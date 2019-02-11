import Comments from '..';
import { types } from 'mobx-state-tree';
import withComments from './data/withComments.json';
import withoutComments from './data/withoutComments.json';
import comments from './data/comments.json';

const Connection = types.model('Connection', {}).views(() => ({
  entity: (type, id) => (id === 60 ? withComments : withoutComments),
}));

const Stores = types.model('Stores', {
  comments: types.optional(Comments, {}),
  connection: types.optional(Connection, {}),
});

let stores;
let request;
beforeEach(() => {
  request = {
    post: jest.fn(() => request),
    type: jest.fn(() => request),
    get: jest.fn(() => Promise.resolve({ body: comments })),
    send: jest.fn(() => Promise.resolve()),
  };
  stores = Stores.create({}, { request });
});

describe('wp-org-comments › Comments', () => {
  test('fromPost returns an empty array for posts without comments', () => {
    const rootComments = stores.comments.fromPost({ type: 'post', id: 56 });
    expect(rootComments).toMatchSnapshot();
    expect(request.get.mock.calls).toHaveLength(0);
  });
  test('fromPost returns comments from entity.raw', () => {
    const rootComments = stores.comments.fromPost({ type: 'post', id: 60 });
    expect(rootComments).toMatchSnapshot();
    rootComments.forEach(comment => {
      expect(comment.replies).toMatchSnapshot();
    });
  });
  test('update comments', async () => {
    await stores.comments.update({ type: 'post', id: 60 });
    expect(stores.comments).toMatchSnapshot();
  });
  test('submit a new comment', async () => {
    const data = {
      comment: 'Hello',
      author: 'Mario',
      email: 'mario@frontity.com',
      url: 'http://frontity.com',
      comment_post_ID: 60,
      comment_parent: 129,
    };
    await stores.comments.submit({ type: 'post', id: 60, data });
    expect(stores.comments).toMatchSnapshot();
    expect(request.post).toHaveBeenCalledWith('/wp-comments-post.php');
    expect(request.type).toHaveBeenCalledWith('form');
    expect(request.send).toHaveBeenCalledWith(data);
  });
  test('sort replies by date', async () => {
    await stores.comments.update({ type: 'post', id: 60 });
    const rootComments = stores.comments.fromPost({ type: 'post', id: 60 });
    expect(rootComments[1].replies).toMatchSnapshot();
  });
});
