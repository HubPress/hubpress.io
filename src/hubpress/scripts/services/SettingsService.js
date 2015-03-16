import Generators from '../generators/Generators';
import SettingsStore from '../stores/SettingsStore';
import Github from '../resources/Github';
import SettingsActionGHCreators from '../actions/SettingsActionGHCreators';
import HpWebApiUtils from '../utils/HpWebApiUtils';
const Q = require('q');
const _ = require('lodash');

function _remoteSave(repository, context, config) {
  let defer = Q.defer();
  repository.write(context.branch, 'hubpress/config.json', config, 'Update configuration file', (err, sha) => {
    if (err) {
      defer.reject(err);
    }
    else {
      defer.resolve(sha);
    }
  });
  return defer.promise;
}

class SettingsService {
  constructor() {}

  saveAndPublish(settings) {
    console.info('SettingsService - saveAndPublish');
    console.log('SettingsService - saveAndPublish', settings);
    let context = Github.getContext();
    let github = Github.getGithub();
    let repository = github.getRepo(context.username, context.repositoryName);

    settings.site.url = SettingsStore.getSiteUrl(settings.meta);

    _remoteSave(repository, context, JSON.stringify(settings))
    .then((commitSha) => {
      let deferred = Q.defer();
      let cb = (err, sha) => {
        // not found if we try to delete CNAME that not exist
        // TODO Compare with the previous settings state
        if (err && err !== 'not found') {
          deferred.reject(err);
        }
        else {
          deferred.resolve(sha);
        }
      }

      if (!settings.meta.cname || settings.meta.cname === '') {
        console.info('SettingsService - saveAndPublish delete CNAME');
        repository.delete(settings.meta.branch, 'CNAME', cb);
      } else {
        console.info('SettingsService - saveAndPublish save CNAME');
        repository.write(settings.meta.branch, 'CNAME', settings.meta.cname, `Update CNAME with ${settings.meta.cname}`, cb);
      }

      return deferred.promise;
    })
    .then(() => {
      SettingsActionGHCreators.receiveSettings({
        settings: settings,
        message: {
          type: 'success',
          title: 'Settings save - Step 1/2',
          content: 'Settings Saved, do not save further configuration changes until HubPress confirms posts were regenerated successfully.'
        }});
    })
    .catch((err) => {
      console.error('SettingsService - saveAndPublish error', err);
      SettingsActionGHCreators.receiveSettings({
        settings: settings,
        message: {
          type: 'error',
          title: 'Settings save',
          content: 'Your settings could not be saved. See your browser\'s developer console for the cause of the error.'
        }});
    })
    ;
  }
}

export default new SettingsService();
