/* eslint-disable import/prefer-default-export */

const dateGmtRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;
const normalizeDate = dateGmt => {
  const [, year, month, day, hours, minutes, seconds] = dateGmt.match(
    dateGmtRegex,
  );
  return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
};

export const normalizeComment = ({
  id,
  parent,
  post,
  author_name: name,
  author_avatar_urls: { '96': avatar },
  date,
  date_gmt: dateGmt,
  content: { rendered: content },
}) => ({
  id: `${id}`,
  parent: `${parent}`,
  post: `${post}`,
  name,
  content,
  avatar,
  date: normalizeDate(dateGmt || date),
});
