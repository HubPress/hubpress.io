import HpConstants from '../constants/HpConstants';
import PostsServices from '../services/PostsServices';
let HpDispatcher = require('../dispatchers/HpDispatcher');
let ActionTypes = HpConstants.ActionTypes;


/**
 * ## AppActionCreators
 */

class AppActionCreators {


  /**
   * Start the synchronize process, ATM only synchronize posts
   * 
   * @method startSynchronize
   * @public
   *
   */
  startSynchronize() {
    console.info('AppActionCreators - startSynchronize');
    HpDispatcher.handleViewAction({
      type: ActionTypes.START_SYNCHRONIZE
    });

    PostsServices.synchronizePosts();
  }

};

export default new AppActionCreators();
