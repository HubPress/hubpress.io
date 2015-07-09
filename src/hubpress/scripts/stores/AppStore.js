import HpConstants from '../constants/HpConstants';
import SettingsStore from '../stores/SettingsStore';
import PostsStore from './PostsStore';
import ThemeStore from './ThemeStore';
const EventEmitter = require('events').EventEmitter;
const moment = require('moment');
const HpDispatcher = require('../dispatchers/HpDispatcher');
const helpers = require('../helpers');

const ActionTypes = HpConstants.ActionTypes;
const AppStates = HpConstants.AppStates;

const CHANGE_EVENT = 'change';

function dispatcher(payload) {
  var action = payload.action;
  console.info('AppStores - dispatcher');
  console.log('AppStores - dispatcher', action);

  switch(action.type) {
    case ActionTypes.RECEIVE_INIT:
      HpDispatcher.waitFor([
        SettingsStore.dispatcherToken,
        ThemeStore.dispatcherToken
      ]);
      helpers.loadCoreHelpers();
      this.markAsInitialize();
      this.emitChange();
      break;
    case ActionTypes.START_SYNCHRONIZE:
      break;
    case ActionTypes.FINISH_SYNCHRONIZE:
      HpDispatcher.waitFor([
        PostsStore.dispatcherToken
        ]);
      this.message = {
        type: 'success',
        title: 'Synchronization',
        content: 'Site Changes Synchronized with GitHub Pages'
      };
      localStorage.setItem('hp-synchronization', moment().format());
      this.emitChange();
      break;
    default:
      // nothing
  }
}

class AppStore extends EventEmitter {
  constructor(){
    this.state = AppStates.INIT;
    this.dispatcherToken = HpDispatcher.register(dispatcher.bind(this));
    this.message = null;
  }

  markAsInitialize() {
    this.state = AppStates.READY;
  }

  lastSynchronization() {
    return localStorage.getItem('hp-synchronization');
  }

  isInitialize() {
    return this.state === AppStates.READY;
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

}


export default new AppStore();
