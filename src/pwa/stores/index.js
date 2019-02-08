import { types, getRoot, getParent, getEnv, flow } from 'mobx-state-tree';
import { values, has, get, set } from 'mobx';

const dateGmtRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;
const normalizeDate = dateGmt => {
  const [, year, month, day, hours, minutes, seconds] = dateGmt.match(
    dateGmtRegex,
  );
  return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
};

const normalizeComment = ({
  id,
  parent,
  post,
  author_name: name,
  author_avatar_urls: { '96': avatar },
  date_gmt: dateGmt,
  content: { rendered: content },
}) => ({
  id: `${id}`,
  parent: `${parent}`,
  post: `${post}`,
  name,
  content,
  avatar,
  date: normalizeDate(dateGmt),
});

const Comment = types
  .model('Comment', {
    id: types.identifier,
    parent: types.string,
    post: types.string,
    name: types.string,
    content: types.string,
    avatar: types.string,
    date: types.Date,
  })
  .views(self => ({
    get commentsMap() {
      return getParent(self);
    },
    replies: () =>
      values(self.commentsMap).filter(({ parent }) => parent === self.id),
  }));

export default types
  .model('WpOrgComments', {
    commentsMap: types.map(types.map(Comment)),
  })
  .views(self => ({
    get root() {
      return getRoot(self);
    },
    getFromPost: postId => {
      const id = `${postId}`;
      if (!has(self.commentsMap, id)) {
        self.init(id);
      }
      const postComments = get(self.commentsMap, id);
      return values(postComments)
        .filter(({ parent }) => parent === 0)
        .sort((a, b) => a.date - b.date);
    },
  }))
  .actions(self => ({
    init: postId => {
      const id = `${postId}`;
      // Initialize comments for post with id `id`
      if (!has(self.commentsMap, id)) set(self.commentsMap, id, {});
    },
    update: flow(function* updateComments(postId) {
      const id = `${postId}`;
      // Initialize comments for post with id `id`
      self.init(id);

      // Request comments from REST API
      const { request } = getEnv(self.root);
      const { body: comments } = yield request.get(
        `/?rest_route=/wp/v2/comments&post=${id}&per_page=100`,
      );

      console.log(comments);

      const normalized = comments.map(normalizeComment);
      console.log(normalized);

      const postComments = get(self.commentsMap, id);

      // Add requested comments
      normalized.forEach(comment => set(postComments, comment.id, comment));
    }),
  }));
