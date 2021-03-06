import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import CommentsList from './CommentsList';

const Comment = ({
  id,
  name,
  avatar,
  date,
  content,
  replies,
  onReply,
  linkStyles,
  lang,
}) => (
  <Container>
    <Header>
      <Avatar>
        <img alt="avatar" src={avatar} />
      </Avatar>
      <Text>
        <Name>{name}</Name>
        <Fecha>{date.toLocaleString()}</Fecha>
      </Text>
      <ReplyButton onClick={() => onReply(id)}>{lang.reply}</ReplyButton>
    </Header>
    <Content
      linkStyles={linkStyles}
      dangerouslySetInnerHTML={{ __html: content }}
    />
    {replies && replies.length ? (
      <Replies>
        <CommentsList comments={replies} onReply={onReply} />
      </Replies>
    ) : null}
  </Container>
);

Comment.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  content: PropTypes.string.isRequired,
  replies: PropTypes.arrayOf(PropTypes.shape({})),
  onReply: PropTypes.func.isRequired,
  linkStyles: PropTypes.shape({
    color: PropTypes.string,
    bold: PropTypes.bool,
    underline: PropTypes.bool,
  }).isRequired,
  lang: PropTypes.shape({
    reply: PropTypes.string.isRequired,
  }).isRequired,
};

Comment.defaultProps = {
  replies: [],
};

export default inject(({ stores: { comments, settings } }) => ({
  linkStyles: settings.theme.linkStyles,
  lang: {
    reply: comments.lang.get('reply'),
  },
}))(Comment);

const Container = styled.div`
  margin-bottom: 32px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
`;
const Avatar = styled.div`
  margin-right: 16px;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;

  img {
    width: 100%;
    height: 100%;
  }
`;
const Text = styled.div`
  flex: 1 1 auto;
`;
const Name = styled.div`
  font-weight: bold;
`;
const Fecha = styled.div``;
const Content = styled.div`
  a {
    color: ${({ theme, linkStyles }) => linkStyles.color || theme.colors.link};
    font-weight: ${({ linkStyles }) => (linkStyles.bold ? 'bold' : 'normal')};
    text-decoration: ${({ linkStyles }) => {
      if (typeof linkStyles.underline === 'undefined') return 'underline';
      return linkStyles.underline ? 'underline' : 'none';
    }};
  }
`;

const ReplyButton = styled.button`
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  margin: 0;
  padding: 4px 8px;
  border: none;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  cursor: pointer;
  box-shadow: 1px 1px 1px 0 ${({ theme }) => theme.colors.shadow};
`;

const Replies = styled.div`
  border-left: 2px solid ${({ theme }) => theme.colors.link};
  padding-left: 8px;
`;
