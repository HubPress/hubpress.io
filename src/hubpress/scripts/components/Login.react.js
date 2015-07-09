const React = require('react');
const Router = require('react-router');
import AuthStore from '../stores/AuthStore';
import AuthActionCreators from '../actions/AuthActionCreators';

let Login = React.createClass({
  mixins: [ Router.Navigation ],

  getInitialState: function() {
    return {email: '',password: '', twoFactorCode: '', twoFactorRequired: false, loading: false};
  },

  componentDidMount:function(){
    AuthStore.addChangeListener(this._onAuthStoreChange);
  },

  componentWillUnmount: function() {
    AuthStore.removeChangeListener(this._onAuthStoreChange);
  },

  _onAuthStoreChange: function(){
    if (AuthStore.getStatus().loggedIn) {
      this.transitionTo('/posts');
    }
    this.setState({loading: false, twoFactorRequired: AuthStore.message && AuthStore.message.otp});
  },

  _handleChangeEmail: function(event) {
    this.setState({email: event.target.value});
  },

  _handleChangePassword: function(event) {
    this.setState({password: event.target.value});
  },

  _handleChangeTwoFactorCode: function(event) {
    this.setState({twoFactorCode: event.target.value});
  },

  _handleSubmit: function(event) {
    event.preventDefault();


    AuthActionCreators.logIn({
      email: this.state.email,
      password: this.state.password,
      twoFactorCode: this.state.twoFactorCode
    });
    this.setState({loading: true});
  },

  render: function() {
    let errors =  '';
    let loginButton = 'Log in';
    let twoFactorInput = '';
    if (this.state.loading) {
      loginButton = (<i className="fa fa-spinner fa-spin"></i>);
    }

    if (this.state.twoFactorRequired) {
      twoFactorInput = (<input ref="twoFactorCode" type="text" name="twoFactorCode" onChange={this._handleChangeTwoFactorCode} placeholder="Two factor code" title="Enter your two factor code"/>)
    }

    return (
      <div id="login">
        <header><img src="http://hubpress.io/img/logo.png" className="avatar"/>
        <p>Welcome !</p>

        </header>

        <form onSubmit={this._handleSubmit}>
          <input ref="email" type="text" name="email" onChange={this._handleChangeEmail} placeholder="Username or Email" title="Enter your github username or email"/>
          <input ref="password" type="password" name="password" onChange={this._handleChangePassword} placeholder="Password" title="Enter your github password"/>
          {twoFactorInput}
          <button type="submit" className="button success">{loginButton}</button>
        {errors}
        </form>
      </div>
    );
  }

});

module.exports = Login;
