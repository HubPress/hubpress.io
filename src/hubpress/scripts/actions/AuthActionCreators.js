import HpConstants from '../constants/HpConstants';
import AuthServices from '../services/AuthServices';

const HpDispatcher = require('../dispatchers/HpDispatcher');
const ActionTypes = HpConstants.ActionTypes;

/**
 * ## AuthActionCreators
 */
class AuthActionCreators {

  /**
   * Login user
   *
   * @method logIn
   * @param {Object} credentials
   * @param {Object} credentials.email Email or Username of the user
   * @param {Object} credentials.password Password of the user
   */
  logIn(credentials) {
    console.info('AuthActionCreators - logIn');
    console.log('AuthActionCreators - logIn', credentials.email);
    HpDispatcher.handleViewAction({
      type: ActionTypes.LOG_IN,
      credentials: credentials
    });

    AuthServices.login(credentials);
  }

  /**
  * Logout user
  *
  * @method logOut
  */
  logOut() {
    console.info('AuthActionCreators - logOut');
    HpDispatcher.handleViewAction({
      type: ActionTypes.LOG_OUT,
    });
  }

}

export default new AuthActionCreators();
