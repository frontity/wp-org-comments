import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReplyIcon from './ReplyIcon';

const Comment = ({ id, name, avatar, date, content, onReply }) => (
  <Container>
    <Header>
      <Avatar>
        <img alt="avatar" src={avatar} />
      </Avatar>
      <Text>
        <Name>{name}</Name>
        <Fecha>{date.toLocaleString()}</Fecha>
      </Text>
    </Header>
    <Content dangerouslySetInnerHTML={{ __html: content }} />
    <ReplyButton onClick={() => onReply(id)}>
      <ReplyIcon /> Reply
    </ReplyButton>
  </Container>
);

const Container = styled.div`
  margin-bottom: 32px;
`;
const Header = styled.div`
  display: flex;
`;
const Avatar = styled.div`
  margin-right: 16px;
  width: 48px;
  height: 48px;

  img {
    width: 100%;
    height: 100%;
  }
`;
const Text = styled.div``;
const Name = styled.div`
  font-weight: bold;
`;
const Fecha = styled.div``;
const Content = styled.div``;

const ReplyButton = styled.button`
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.link};
  background: transparent;
  margin: 0;
  padding: 4px 8px;
  border: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    width: 16px;
    margin-right: 8px;
  }
`;

Comment.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  content: PropTypes.string.isRequired,
  onReply: PropTypes.func.isRequired,
};

export default Comment;
