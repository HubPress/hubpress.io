import HpConstants from '../constants/HpConstants';
import SettingsStore from '../stores/SettingsStore'
const HpDispatcher = require('../dispatchers/HpDispatcher');
const EventEmitter = require('events').EventEmitter;
const Handlebars = require('handlebars');


const ActionTypes = HpConstants.ActionTypes;
const CHANGE_EVENT = 'change';
const LAYOUT_PATTERN = /{{!<\s+([A-Za-z0-9\._\-\/]+)\s*}}/;


function dispatcher(payload) {
  let action = payload.action;
  console.info('ThemeStores - dispatcher');
  console.log('ThemeStores - dispatcher', action);

  switch(action.type) {
    case ActionTypes.RECEIVE_INIT:
      this.setThemeName(action.theme.name);
      this.setThemeVersion(action.theme.version);
      this.registerFiles(action.theme.files);
      this.emitChange();
      break;
   default:
      // nothing
  }
}

function getTemplateOptions() {
  let blog = SettingsStore.config().site;
  blog.url = SettingsStore.getSiteUrl();

  return {
    data: {
      blog: blog
    }
  }
}

class ThemeStore extends EventEmitter {

  constructor(){
    this.name = null;
    this.version = null;
    this.templateCache = new Map();
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

  registerTheme(theme) {
    this.setThemeName(theme.name);
    this.setThemeVersion(theme.version);
    this.registerFiles(theme.files);
  }

  registerFiles(themeFiles) {
    console.info('ThemeStore - registerFiles');
    console.log('ThemeStore - registerFiles', themeFiles);
    themeFiles.forEach((file) => {
      if (file.path.indexOf('partials/') === 0) {
        Handlebars.registerPartial(file.name, file.content);
      }
      else {
        let data = {
          name: file.name,
          template: Handlebars.compile(file.content)
        };

        let matches = file.content.match(LAYOUT_PATTERN);
        if (matches) {
          data.layout = matches[1];
        }

        this.templateCache.set(file.name, data);

      }
    });
  }

  template(templateName, data) {
    console.info('ThemeStore - template');
    console.log('ThemeStore - template', templateName, data);
    let templateCache = this.templateCache.get(templateName);
    let htmlContent = templateCache.template(data, getTemplateOptions());

    if (templateCache.layout) {
      data.body = htmlContent;
      templateCache = this.templateCache.get(templateCache.layout);
      htmlContent = templateCache.template(data, getTemplateOptions());
    }

    return htmlContent;
  }

  setThemeName(name) {
    this.name = name;
  }

  getThemeName() {
    return this.name;
  }

  getThemeVersion() {
    return this.version ;
  }
  setThemeVersion(version) {
    this.version = version;
  }

}

export default new ThemeStore();
