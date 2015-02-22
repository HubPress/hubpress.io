let jquery = require('jquery');
let _ = require('lodash');
let Q = require('q');
import AppActionServerCreators from '../actions/AppActionServerCreators';
import SettingsStore from '../stores/SettingsStore';



function _getConfig() {

  let deferred = Q.defer();

  jquery.get('config.json?dt='+Date.now(), function(config) {
    deferred.resolve(config);
  })
  .fail((err) => {
    deferred.reject(err)
  });

  return deferred.promise;
}

function _loadActiveTheme(name, meta) {
  let deferred = Q.defer();
  let promises = [];
  let hubpressUrl = SettingsStore.getHubpressUrl(meta);
  jquery.get(`${hubpressUrl}/themes/${name}/theme.json?dt=${Date.now()}`, function(theme) {
    let version = theme.version;
    let files = _.pairs(theme.files);

    let paginationLoaded = false;
    let navigationLoaded = false;

    files.forEach((file) => {
      let deferredFile = Q.defer();
      promises.push(deferredFile.promise);

      paginationLoaded = paginationLoaded || file[0] === 'pagination';
      navigationLoaded = navigationLoaded || file[0] === 'nav';

      jquery.get(`${hubpressUrl}/themes/${name}/${file[1]}?v=${version}`, function(content) {
        deferredFile.resolve({
          name: file[0],
          path: file[1],
          content: content
        });
      })
      .fail((err) => {
        deferredFile.reject(err)
      });

    });

    if (!paginationLoaded) {
      let deferredPagination = Q.defer();
      promises.push(deferredPagination.promise);
      jquery.get(`${hubpressUrl}/hubpress/scripts/helpers/tpl/pagination.hbs`, function(content) {
        deferredPagination.resolve({
          name: 'pagination',
          path: 'partials/pagination',
          content: content
        });
      })
      .fail((err) => {
        deferredPagination.reject(err)
      });
    }

    if (!navigationLoaded) {
      let deferredNav = Q.defer();
      promises.push(deferredNav.promise);
      jquery.get(`${hubpressUrl}/hubpress/scripts/helpers/tpl/nav.hbs`, function(content) {
        deferredNav.resolve({
          name: 'nav',
          path: 'partials/nav',
          content: content
        });
      })
      .fail((err) => {
        deferredNav.reject(err)
      });
    }

    Q.all(promises)
      .then((values)=>{
        deferred.resolve({
          version: version,
          files: values
        });
      });

  });

  return deferred.promise;
}


class HpWebApiUtils {


  getConfig() {
    let deferred = Q.defer();
    let _config;
    let theme;

    _getConfig()
    .then((config) => {
      _config = config;
      return _loadActiveTheme(config.theme.name, config.meta);
    })
    .then((themeInfos) => {
      let data = {
        config: _config,
        theme: {
          name: _config.theme.name,
          files: themeInfos.files,
          version: themeInfos.version
        }
      };
      deferred.resolve();
      AppActionServerCreators.receiveInit(data);

    });

    return deferred.promise;

  }

  loadActiveTheme(name, meta) {
    return _loadActiveTheme(name, meta);
  }
}

export default new HpWebApiUtils();
