import HpConstants from '../constants/HpConstants';
import PostsServices from '../services/PostsServices';
import ThemeStore from '../stores/ThemeStore';
import HpWebApiUtils from '../utils/HpWebApiUtils';
const HpDispatcher = require('../dispatchers/HpDispatcher');
const ActionTypes = HpConstants.ActionTypes;

/**
 * ## SettingsActionGHCreators
 */
// TODO add documentation
class SettingsActionGHCreators {

  receiveSettings(value) {
    console.info('SettingsActionCreators - receiveSettings');
    console.log('SettingsActionGHCreators - receiveSettings', value);
    HpDispatcher.handleViewAction({
      type: ActionTypes.RECEIVE_SETTINGS,
      settings: value.settings,
      message: value.message
    });

    HpWebApiUtils.loadActiveTheme(value.settings.theme.name, value.settings.meta)
    .then((themeInfos) => {
      ThemeStore.registerTheme({
        name: value.settings.theme.name,
        files: themeInfos.files,
        version: themeInfos.version
      })

      PostsServices.publishPosts();
    })
    .catch((err) => {
      console.log(err);
    })

  }
}

export default new SettingsActionGHCreators();
