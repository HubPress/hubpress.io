import HpConstants from '../constants/HpConstants';
const EventEmitter = require('events').EventEmitter;
const HpDispatcher = require('../dispatchers/HpDispatcher');
const ActionTypes = HpConstants.ActionTypes;
const CHANGE_EVENT = 'change';

function _receiveAuthentication(authentication) {
  if (authentication) {
    saveCredentials(authentication);
    this.permissions = authentication.permissions;
  }
}

function _dispatcher(payload) {
  var action = payload.action;
  console.info('AuthStores - dispatcher');
  console.log('AuthStores - dispatcher', action);

  switch (action.type) {
    case ActionTypes.LOG_IN:
      this.processing = true;
      this.message = null;
      this.emitChange();
      break;
    case ActionTypes.LOG_OUT:
      this.processing = true;
      this.message = null;
      sessionStorage.removeItem('hp-credentials');
      this.emitChange();
      break;
    case ActionTypes.RECEIVE_AUTHENTICATION:
      this.processing = false;
      this.message = action.message;
      _receiveAuthentication.bind(this)(action.authentication);
      this.emitChange();
      break;

    default:
        // nothing to do
  }

}

function saveCredentials(credentials) {
  sessionStorage.setItem('hp-credentials', JSON.stringify(credentials));
}

function readCredentials() {
  let credentials = sessionStorage.getItem('hp-credentials');
  return credentials && JSON.parse(credentials) || {};
}

class AuthStore extends EventEmitter {

  constructor() {
    this.processing = false;
    this.error = null;
    this.message = null;
    this.permissions = [];

    this.dispatcherToken = HpDispatcher.register(_dispatcher.bind(this));
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

  getStatus() {
    let credentials = readCredentials();
    return {
      loggedIn: !!credentials.token,
      token: credentials.token,
      error: this.error,
      processing: this.processing,
      authorized: this.permissions.push
    };
  }

  getAuthor() {
    let userInfos = readCredentials().userInformations;

    if (!userInfos) {
      return;
    }

    return {
      id: userInfos.id,
      name: userInfos.name,
      location:userInfos.location,
      website:userInfos.blog,
      image:userInfos.avatar_url
    }
  }



}

export default new AuthStore();
