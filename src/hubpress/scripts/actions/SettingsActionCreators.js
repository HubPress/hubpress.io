import HpConstants from '../constants/HpConstants';
import SettingsService from '../services/SettingsService';
const HpDispatcher = require('../dispatchers/HpDispatcher');
const ActionTypes = HpConstants.ActionTypes;

/**
 * ## SettingsActionCreators
 */
// TODO add documentation
class SettingsActionCreators {

  synchronize() {
    console.info('SettingsActionCreators - synchronize');
    HpDispatcher.handleViewAction({
      type: ActionTypes.SYNCHRONIZE
    });
  }

  saveAndPublish(settings) {
    console.info('SettingsActionCreators - saveAndPublish');
    console.log('SettingsActionCreators - saveAndPublish', settings);
    HpDispatcher.handleViewAction({
      type: ActionTypes.SAVEANDPUBLISH_SETTINGS,
      settings: settings
    });
    SettingsService.saveAndPublish(settings);
  }

}


export default new SettingsActionCreators();
