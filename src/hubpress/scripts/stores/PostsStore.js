import HpConstants from '../constants/HpConstants';
import PostsServices from '../services/PostsServices';
import ThemeStore from './ThemeStore';
const HpDispatcher = require('../dispatchers/HpDispatcher');
const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');

const ActionTypes = HpConstants.ActionTypes;
const CHANGE_EVENT = 'change';

let posts = [];

function dispatcher(payload) {
  let action = payload.action;
  console.info('PostsStores - dispatcher');
  console.log('PostsStores - dispatcher', action);

  switch(action.type) {
    case ActionTypes.RECEIVE_POSTS:
      this.posts = action.posts;
      this.cachePosts = action.posts;
      this._isLoading = this._isSynchronizing;
      this.emitChange();
      break;
    case ActionTypes.RECEIVE_POST:
      this.cachePosts.push(action.post);
      this._isLoading = this._isSynchronizing;
      this.emitChange();
      break;
    case ActionTypes.REMOTESAVE_POST:
      this._isLoading = true;
      this.message = null;
      this.emitChange();
      break;
    case ActionTypes.PUBLISH_POST:
      this._isLoading = true;
      this.message = null;
      this.emitChange();
      break;
    case ActionTypes.UNPUBLISH_POST:
      this._isLoading = true;
      this.message = null;
      this.emitChange();
      break;
    case ActionTypes.RECEIVE_REMOTESAVE:
      this.cachePosts.push(action.post);
      this._isLoading = this._isSynchronizing;
      this.message = action.message;
      this.emitChange();
      break;
    case ActionTypes.RECEIVE_PUBLISH:
      this._isLoading = false;
      this.cachePosts = [];

      this.message = action.message;
      this.emitChange();
      break;
    case ActionTypes.RECEIVE_UNPUBLISH:
      this._isLoading = false;
      this.cachePosts = [];
      this.message = action.message;
      this.emitChange();
      break;
    case ActionTypes.START_SYNCHRONIZE:
      this._isSynchronizing = true;
      this.message = null;
      this.emitChange();
      break;
    case ActionTypes.FINISH_SYNCHRONIZE:
      this.posts = null;
      this.cachePosts = null;
      this._isSynchronizing = false;
      this._isLoading = false;
      this.emitChange();
      break;
    default:
    // nothing
  }
}

class PostsStore extends EventEmitter {

  constructor() {
    this._isLoading = false;
    this._isSynchronizing = false;
    this.posts = null;
    this.message = null;
    this.cachePosts = [];
    this.dispatcherToken = HpDispatcher.register(dispatcher.bind(this));
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getPosts(force) {
    console.info('PostsStore - getPosts');
    console.log('PostsStore - getPosts', force);
    this.message = null;
    let load = force || !this.posts;
    if (!load) {
      return this.posts;
    }

    this._isLoading = true;
    this.emitChange();
    PostsServices.getPosts();
    return [];
  }

  getPost(id) {
    console.info('PostsStore - getPost');
    console.log('PostsStore - getPost', id);
    this.message = null;
    let post = _.find(this.cachePosts, (_post) => _post.id === id);

    if (post) {
      return post;
    }
    else {
      this._isLoading = true;
      this.emitChange();
      PostsServices.getPost(id);
      return {};
    }
  }

  isLoading() {
    return this._isLoading;
  }
}

export default new PostsStore();
