const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');
const HpDispatcher = require('../dispatchers/HpDispatcher');
import HpConstants from '../constants/HpConstants';


const ActionTypes = HpConstants.ActionTypes;
const CHANGE_EVENT = 'change';

let _config;
let _db;

function _loadConfig (config) {
  let urlSite;
  _config = config;

  urlSite = _getSiteUrl(_config.meta);

  _config.site = assign({}, _config.site, {
    url: urlSite
  });

};

function _getSiteUrl(_meta, addProtocol) {
  let meta = _meta || _config.meta;
  let url;
  // TODO change that
  if (meta.cname && meta.cname !== '') {
    url = (addProtocol === false ? '' : 'http:') + '//'+meta.cname;
  }
  else {
    url = (addProtocol === false ? '' : 'https:') + `//${meta.username}.github.io`;
    if (meta.branch !== 'master') {
      url = url + '/' + meta.repositoryName;
    }
  }

  return url;
};

function dispatcher(payload) {
  let action = payload.action;
  console.info('SettingsStores - dispatcher');
  console.log('SettingsStores - dispatcher', action);

  switch(action.type) {
    case ActionTypes.RECEIVE_INIT:
      this.message = null;
      _loadConfig(action.config);
      this.emitChange();
      break;
    case ActionTypes.RECEIVE_SETTINGS:
      this.message = action.message;
      this.emitChange();
      break;
    case ActionTypes.SAVEANDPUBLISH_SETTINGS:
      this.message = null;
      _config = action.settings;
      this.emitChange();
      break;
    default:
      // nothing
  }

}

class SettingsStore extends EventEmitter {

  constructor() {
    this.message = null;
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

  getDbName(config) {
    return 'hubpress-' + config.meta.username+'-'+config.meta.repositoryName;
  }

  getSiteUrl(_meta, addProtocol) {
    return _getSiteUrl(_meta, addProtocol);
  }

  getHubpressUrl(_meta) {
    let meta = _meta || _config.meta;
    let url = window.location.protocol + "//" + window.location.host;

    if (window.location.host === `${meta.username}.github.io` || window.location.host === `${meta.username}.github.com`) {
      if (meta.branch !== "master") {
        url = url + "/" + meta.repositoryName;
      }
    }
    else {
      if (meta.branch !== "master" && (!meta.cname || meta.cname === "")) {
        url = url + "/" + meta.repositoryName;
      }
    }

    return url;
  }

  getThemeUrl(name) {
    let url = this.getSiteUrl(null, false);
    url += `/themes/${name}`;
    return url;
  }

  getImagesUrl() {
    let url = this.getSiteUrl();
    url += '/images';
    return url;
  }

  isReady() {
    return !!_config;
  }

  config() {
    return _config;
  }
}

export default new SettingsStore();
