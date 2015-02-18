import HpConstants from '../constants/HpConstants';
import PostsServices from '../services/PostsServices';
const HpDispatcher = require('../dispatchers/HpDispatcher');
const ActionTypes = HpConstants.ActionTypes;

/**
 * ## PostsActionCreators
 */
class PostsActionCreators {

  /**
  * Get all posts
  *
  * @method getPosts
  */
  getPosts() {
    console.info('PostsActionCreators - getPosts');
    HpDispatcher.handleViewAction({
      type: ActionTypes.GET_POSTS
    });
    PostsServices.getPosts();
  }

  /**
  * Save a post to local IndexedDb
  *
  * @method localSave
  * @param {Object} post The post to save
  */
  // TODO Complete documentation
  localSave(post) {
    PostsServices.localSave(post);
  }

  /**
  * Save a post to GitHub
  *
  * @method remoteSave
  * @param {String} id Id of the post to save
  */
  remoteSave(id) {
    console.info('PostsActionCreators - remoteSave');
    console.log('PostsActionCreators - remoteSave', id);
    HpDispatcher.handleViewAction({
      type: ActionTypes.REMOTESAVE_POST,
      id: id
    });
    PostsServices.remoteSave(id);
  }

  /**
  * Publish a post to GitHub
  *
  * @method publish
  * @param {String} id Id of the post to publish
  */
  publish(id) {
    console.info('PostsActionCreators - publish');
    console.log('PostsActionCreators - publish', id);
    HpDispatcher.handleViewAction({
      type: ActionTypes.PUBLISH_POST,
      id: id
    });
    PostsServices.publishPost(id);
  }

  /**
  * Unpublish a post from GitHub
  *
  * @method unpublish
  * @param {String} id Id of the post to unpublish
  */
  unpublish(id) {
    console.info('PostsActionCreators - unpublish');
    console.log('PostsActionCreators - unpublish', id);
    HpDispatcher.handleViewAction({
      type: ActionTypes.UNPUBLISH_POST,
      id: id
    });
    PostsServices.unpublishPost(id);
  }

}

export default new PostsActionCreators();
