import React from 'react';
import Comment from './Comment';

const CommentsList = ({ comments, onReply }) =>
  comments.map(c => (
    <Comment
      key={c.id}
      replies={c.replies}
      date={c.date}
      {...c}
      onReply={onReply}
    />
  ));

export default CommentsList;
