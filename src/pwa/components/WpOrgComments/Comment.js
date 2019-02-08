import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
      <ReplyButton onClick={() => onReply(id)}>Reply</ReplyButton>
    </Header>
    <Content dangerouslySetInnerHTML={{ __html: content }} />
  </Container>
);

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
const Content = styled.div``;

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

Comment.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  content: PropTypes.string.isRequired,
  onReply: PropTypes.func.isRequired,
};

export default Comment;
