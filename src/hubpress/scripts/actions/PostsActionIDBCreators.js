import HpConstants from '../constants/HpConstants';
import PostsServices from '../services/PostsServices';
const HpDispatcher = require('../dispatchers/HpDispatcher');
const ActionTypes = HpConstants.ActionTypes;

/**
 * ## PostsActionIDBCreators
 */
// TODO add documentation
class PostsActionIDBCreators {
  receivePost(post) {
    console.info('PostsActionIDBCreators - receivePost');
    console.log('PostsActionIDBCreators - receivePost', post);
    HpDispatcher.handleViewAction({
      type: ActionTypes.RECEIVE_POST,
      post: post
    });
  }

  receivePosts(posts) {
    console.info('PostsActionIDBCreators - receivePosts');
    console.info('PostsActionIDBCreators - receivePosts', posts);
    HpDispatcher.handleViewAction({
      type: ActionTypes.RECEIVE_POSTS,
      posts: posts
    });
  }

  receiveRemoteSave(value) {
    console.info('PostsActionIDBCreators - receiveRemoteSave');
    console.info('PostsActionIDBCreators - receiveRemoteSave', value);
    HpDispatcher.handleViewAction({
      type: ActionTypes.RECEIVE_REMOTESAVE,
      post: value.post,
      message: value.message
    });
  }

  receivePublish(value) {
    console.info('PostsActionIDBCreators - receivePublish');
    console.info('PostsActionIDBCreators - receivePublish', value);
    HpDispatcher.handleViewAction({
      type: ActionTypes.RECEIVE_PUBLISH,
      message: value.message
    });
  }

  receiveUnpublish(value) {
    console.info('PostsActionIDBCreators - receiveUnpublish');
    console.info('PostsActionIDBCreators - receiveUnpublish', value);
    HpDispatcher.handleViewAction({
      type: ActionTypes.RECEIVE_UNPUBLISH,
      message: value.message
    });
  }
}

export default new PostsActionIDBCreators();
