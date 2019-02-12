/* eslint-disable import/prefer-default-export */
export const normalizeComment = ({
  id,
  parent,
  post,
  author_name: name,
  author_avatar_urls: { '96': avatar },
  date,
  content: { rendered: content },
}) => ({
  id: `${id}`,
  parent: `${parent}`,
  post: `${post}`,
  name,
  content,
  avatar,
  dateString: date,
});
