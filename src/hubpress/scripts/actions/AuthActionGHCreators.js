import HpConstants from '../constants/HpConstants';
const HpDispatcher = require('../dispatchers/HpDispatcher');
const ActionTypes = HpConstants.ActionTypes;

/**
 * ## AuthActionGHCreators
 */
class AuthActionGHCreators {

  /**
  * Receive authentication information from GitHub
  *
  * @method receiveAuthentication
  * @param {Object} values
  * @param {Object} values.authentication Email or Username of the user
  * @param {Object} values.authentication.permissions
  * @param {boolean} values.authentication.permissions.admin true if user is admin
  * @param {boolean} values.authentication.permissions.push true if user can push
  * @param {boolean} values.authentication.permissions.put true if user can put
  * @param {String} values.token Token to use to query GitHub API
  * @param {Object} values.message
  * @param {String} values.message.content Content of the message to show
  * @param {String} values.message.title Title of the message to shoz
  * @param {String} values.message.type Type of the message
  */
  receiveAuthentication(values) {
    console.info('AuthActionGHCreators - receiveAuthentication');
    console.log('AuthActionGHCreators - receiveAuthentication', values);
    HpDispatcher.handleViewAction({
      type: ActionTypes.RECEIVE_AUTHENTICATION,
      authentication: values.authentication,
      message: values.message
    });
  }
}

export default new AuthActionGHCreators();
