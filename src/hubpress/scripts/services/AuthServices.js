import Github from '../resources/Github.js';
import AuthActionGHCreators from '../actions/AuthActionGHCreators.js';
const platform = require('platform');
const slug = require('slug');
const Q = require('q');

function _getRepositoryInfos(repository) {
  let deferred = Q.defer();

  repository.show(function(err, informations) {
    if (err) {
      deferred.reject(err);
    }
    else {
      deferred.resolve(informations);
    }
  });

  return deferred.promise;
}

function _getAuthorizations(authorization) {
  let deferred = Q.defer();

  authorization.list(function(err, list) {
    if (err) {
      deferred.reject(err);
    }
    else {
      deferred.resolve(list);
    }
  });

  return deferred.promise;


}

function _getUserInformations(user) {

  return function() {
    let deferred = Q.defer();

    user.show(null, function(err, informations) {
      if (err) {
        deferred.reject(err);
      }
      else {
        deferred.resolve(informations);
      }
    });

    return deferred.promise;

  }
}

function _getTokenNote() {
  return slug(`hubpress-${platform.name}-${platform.os}`);
}

function _searchAndDeleteAuthorization(authorizations, authorization ) {
  let deferred = Q.defer();
  let id = -1;

  authorizations.forEach(function(token) {
    if (token.note === _getTokenNote()) {
      id = token.id;
    }
  });

  if (id !== -1) {
    authorization.delete(id, function(err, values) {
      if (err) {
        deferred.reject(err);
      }
      else {
        deferred.resolve();
      }
    });
  }
  else {
    deferred.resolve();
  }


  return deferred.promise;
}

function _createAuthorization(authorization) {
  let deferred = Q.defer();
  let definition = {
    scopes: [
    'public_repo'
    ],
    note: _getTokenNote()
  };


  authorization.create(definition, function(err, createdToken) {
    if (err) {
      deferred.reject(err);
    }
    else {
      deferred.resolve(createdToken);
    }
  });

  return deferred.promise;
}


class AuthServices {
  constructor() {}

  // Log and return a token and authorizations for the repository
  login(credentials){
    console.info('AuthServices - login');
    console.log('AuthServices - login', credentials.email);
    let github = Github.renewInstance({
      auth: "basic",
      username: credentials.email,
      password: credentials.password,
      twoFactorCode: credentials.twoFactorCode
    });

    let context = Github.getContext();
    let repository = github.getRepo(context.username, context.repositoryName);
    let authorization = github.getAuthorization();
    let user = github.getUser();
    let _informations;
    let _userInformations;


    _getRepositoryInfos(repository)
      .then(function(informations) {
        _informations = informations;
      })
      .then(_getUserInformations(user))
      .then(function(userInformations) {
        _userInformations = userInformations;
        return _getAuthorizations(authorization);
      })
      .then(function(authorizations) {
        return _searchAndDeleteAuthorization(authorizations, authorization);
      })
      .then(function() {
        return _createAuthorization(authorization);
      })
      .then(function(result) {
        Github.renewInstance({
          auth: "oauth",
          token: result.token
        });

        // Call action
        AuthActionGHCreators.receiveAuthentication({
          message: {
            type: 'success',
            title: 'Authentication',
            content: 'Welcome back ' + _userInformations.name
          },
          authentication: {
            token: result.token,
            permissions: _informations.permissions,
            userInformations: _userInformations
          }
        });
      })
      .catch(function(error) {
        var message = {
          type: 'error',
          title: 'Authentication'
        }
        var otpRequired;

        if (error.request) {
          var otp = error.request.getResponseHeader('X-GitHub-OTP') || '';
          otpRequired = otp.split(';')[0] === 'required';
        }

        if (otpRequired) {
          // force sms with a post on auth
          _createAuthorization(authorization);

          console.log('AuthServices - OTP required : ', otpRequired);
          message.type = 'warning';
          message.content = 'A two-factor authentication code is needed.';
          message.otp = true;
        }
        else {
          console.error('AuthServices - login error', error);
          message.content = 'An error has occurred, see your console for more informations.';
        }

        // Call action
        AuthActionGHCreators.receiveAuthentication({
          message: message
        });
      });
  }
}

export default new AuthServices();
