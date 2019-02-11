import { types, getRoot, getParent, getEnv, flow } from 'mobx-state-tree';
import { values, has, get, set } from 'mobx';
import { normalizeComment } from '../utils';

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
    get replies() {
      return values(self.commentsMap).filter(
        ({ parent }) => parent === self.id,
      );
    },
  }));

export default types
  .model('WpOrgComments', {
    commentsMap: types.map(types.map(Comment)),
  })
  .views(self => ({
    get root() {
      return getRoot(self);
    },
    fromPost: ({ type, id }) => {
      self.init({ type, id });
      const postComments = get(self.commentsMap, String(id));
      return values(postComments)
        .filter(({ parent }) => parent === '0')
        .sort((a, b) => a.date - b.date);
    },
  }))
  .actions(self => ({
    addComments: (strId, comments) => {
      const normalized = comments.map(normalizeComment);
      const postComments = get(self.commentsMap, strId);
      normalized.forEach(c => set(postComments, c.id, c));
    },
    init: ({ type, id }) => {
      const strId = String(id);
      // Return if it was previously initialized
      if (has(self.commentsMap, strId)) return;

      // Set an empty map for that entity
      set(self.commentsMap, strId, {});

      // Get the initial comments from `entity.raw`
      const { _embedded: embedded } = self.root.connection.entity(type, id).raw;

      if (embedded.replies) {
        const [comments] = embedded.replies;
        self.addComments(strId, comments);
        self.update({ type, id });
      }
    },
    update: flow(function* updateComments({ type, id }) {
      // Initialize comments for post with id `id`
      self.init({ type, id });

      // Request comments from REST API
      const { request } = getEnv(self.root);
      const { body: comments } = yield request.get(
        `/?rest_route=/wp/v2/comments&post=${id}&per_page=100`,
      );
      self.addComments(String(id), comments);
    }),
  }));
