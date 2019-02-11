import React from 'react';
import Comment from './Comment';

const CommentsList = ({ comments, onReply }) =>
  comments.map(c => (
    <Comment key={c.id} replies={c.replies} {...c} onReply={onReply} />
  ));

export default CommentsList;
