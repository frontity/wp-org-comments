import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import styled from 'styled-components';
import CommentsList from './CommentsList';

class WpOrgComments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      author: '',
      email: '',
      url: '',
      parentId: 0,
    };

    this.onChange = this.onChange.bind(this);
    this.formRef = createRef();
  }

  setParentId = parentId => this.setState({ parentId });

  onChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  onSubmit = event => {
    event.preventDefault();
    const { submit, type, id } = this.props;
    const { elements } = this.formRef.current;
    const data = {};

    Array.from(elements).reduce((d, e) => {
      d[e.name] = e.value;
      return d;
    }, data);

    submit({ type, id, data });
  };

  render() {
    const { comments, id, lang } = this.props;
    const { comment, author, email, url, parentId } = this.state;
    return (
      <Container>
        <CommentsList comments={comments} onReply={this.setParentId} />
        <hr />
        <Form ref={this.formRef} onSubmit={this.onSubmit}>
          <FormTitle>
            <h3>{lang.leaveReply} </h3>
            {parentId ? (
              <CancelReply onClick={() => this.setParentId(0)}>
                {lang.cancelReply}
              </CancelReply>
            ) : null}
          </FormTitle>
          <Label htmlFor="comment">
            <span>{lang.comment} *</span>
            <TextArea
              id="comment"
              name="comment"
              cols="45"
              rows="8"
              maxLength="65525"
              required="required"
              value={comment}
              onChange={this.onChange}
            />
          </Label>
          <Label htmlFor="author">
            <span>{lang.name} *</span>
            <Input
              id="author"
              name="author"
              type="text"
              value={author}
              onChange={this.onChange}
              size="30"
              maxLength="245"
              required="required"
            />
          </Label>
          <Label htmlFor="email">
            <span>{lang.email} *</span>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={this.onChange}
              size="30"
              maxLength="100"
              aria-describedby="email-notes"
              required="required"
            />
          </Label>
          <Label htmlFor="url">
            <span>{lang.website}</span>
            <Input
              id="url"
              name="url"
              type="url"
              value={url}
              onChange={this.onChange}
              size="30"
              maxLength="200"
            />
          </Label>
          <input
            type="hidden"
            name="comment_post_ID"
            id="comment_post_ID"
            value={id}
          />
          <input
            type="hidden"
            name="comment_parent"
            id="comment_parent"
            value={parentId}
          />
          <Button type="submit" value={lang.postComment} />
        </Form>
      </Container>
    );
  }
}

WpOrgComments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  submit: PropTypes.func.isRequired,
  lang: PropTypes.shape({
    leaveReply: PropTypes.string.isRequired,
    cancelReply: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired,
    postComment: PropTypes.string.isRequired,
  }).isRequired,
};

export default inject(({ stores: { comments } }, { type, id }) => ({
  comments: comments.fromPost({ type, id }),
  submit: comments.submit,
  lang: {
    leaveReply: comments.lang.get('leaveReply'),
    cancelReply: comments.lang.get('cancelReply'),
    comment: comments.lang.get('comment'),
    name: comments.lang.get('name'),
    email: comments.lang.get('email'),
    website: comments.lang.get('website'),
    postComment: comments.lang.get('postComment'),
  },
}))(WpOrgComments);

const Container = styled.div`
  padding: 32px 16px;
`;

const Form = styled.form``;

const FormTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
  h3 {
    font-weight: bold;
    margin: 0;
  }
`;

const CancelReply = styled.button`
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

const Label = styled.label`
  margin-top: 16px;
  display: flex;
  flex-direction: column;

  & > span {
    font-weight: bold;
    line-height: 32px;
  }
`;

const TextArea = styled.textarea`
  background: white;
  border: 1px solid #eee;
  padding: 8px;
  font-size: 16px;
  line-height: 24px;
`;

const Input = styled.input`
  background: white;
  padding: 8px;
  border: 1px solid #eee;
  font-size: 16px;
  line-height: 24px;
`;

const Button = styled.input`
  display: block;
  margin-top: 32px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  font-size: 16px;
  line-height: 24px;
  box-shadow: 1px 1px 1px 0 ${({ theme }) => theme.colors.shadow};
`;
