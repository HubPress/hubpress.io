import HpConstants from '../constants/HpConstants';
import IndexedDb from '../resources/IndexedDb';
import Github from '../resources/Github';
import AuthStore from '../stores/AuthStore';
import SettingsStore from '../stores/SettingsStore';
import PostsServices from '../services/PostsServices';
let HpDispatcher = require('../dispatchers/HpDispatcher');
let ActionTypes = HpConstants.ActionTypes;


/**
 * ## AppActionServerCreators
 */

class AppActionServerCreators {



  /**
   * Receive data to init application
   *
   * ---
   * This action is fired when server send a response
   *
   * @method receiveInit
   *
   * @param {Object} data An object with 2 attributes : config and theme
   * @param {Object} data.config An object that represent the *config.json* file
   * @param {Object} data.theme An object that represent the *theme.json* file of the selected theme
   *
   * @example
   *  AppActionServerCreators.receiveInit({
   *    config: {},
   *    theme: {}
   *  })
   */
  receiveInit(data) {
    let config = data.config;
    let theme = data.theme;
    console.info('AppActionServerCreators - receiveInit');
    console.log('AppActionServerCreators - receiveInit', data);

    IndexedDb.setDbName(SettingsStore.getDbName(config));

    Github.setContext({
      username: config.meta.username,
      repositoryName: config.meta.repositoryName,
      branch: config.meta.branch
    });

    // If there is a **token**, then we **must work with OAuth**
    if (AuthStore.getStatus().token) {
      Github.renewInstance({
        token: AuthStore.getStatus().token,
        auth: "oauth"
      });
    }

    HpDispatcher.handleViewAction({
      type: ActionTypes.RECEIVE_INIT,
      config: config,
      theme: theme
    });
  }


  /**
   * Finish the synchronization
   *
   * @method finishSynchronize
   * @param {Array} posts an array with all the posts
   */

  finishSynchronize(posts) {
    console.info('AppActionServerCreators - finishSynchronize');
    console.log('AppActionServerCreators - finishSynchronize', posts);
    HpDispatcher.handleViewAction({
      type: ActionTypes.FINISH_SYNCHRONIZE,
      posts: posts
    });
  }
};

export default new AppActionServerCreators();
