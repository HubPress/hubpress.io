const AuthStore = require('../stores/AuthStore');


module.exports = {
  statics: {
      willTransitionTo: function(transition) {
          if (!AuthStore.getStatus().loggedIn) {
              //Login.attemptedTransition = transition;
              transition.redirect('/login');
          }
      }
  }
};
