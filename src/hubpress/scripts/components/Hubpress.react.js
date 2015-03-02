const React = window.React = require('react');
const Router = require('react-router');
const { Route, DefaultRoute, RouteHandler, Link } = Router;
const assign = require('object-assign');
const ReactToastr = require("react-toastr");
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.jQuery);

// Components
const Navbar = require('./Navbar.react');
const Loader = require('./Loader.react');

// Actions
import AppActionCreators from '../actions/AppActionCreators';

// Store
import AuthStore from '../stores/AuthStore';
import AppStore from '../stores/AppStore';
import PostsStore from '../stores/PostsStore';
import SettingsStore from '../stores/SettingsStore';

function _appState(){
  return {
    loggedIn: AuthStore.getStatus().loggedIn,
    isInit: AppStore.isInitialize()
  }
};

class Hubpress {

  constructor() {
    this.mixins = [ Router.Navigation ];
  }

  getInitialState() {
    return _appState();
  }

  componentDidMount() {
    if (this.isMounted()) {
      AppStore.addChangeListener(this._onAppStoreChange);
      AuthStore.addChangeListener(this._onAuthStoreChange);
      PostsStore.addChangeListener(this._onPostsStoreChange);
      SettingsStore.addChangeListener(this._onSettingsStoreChange);
    }
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this._onAuthStoreChange);
  }

  _onAppStoreChange() {
    if (AppStore.message) {
      this.showNotification(AppStore.message);
    }
    this.setState(_appState());
  }

  _onSettingsStoreChange() {
    if (SettingsStore.message) {
      this.showNotification(SettingsStore.message);
    }
    this.setState(_appState());
  }

  _onAuthStoreChange() {
    if (AuthStore.message) {
      this.showNotification(AuthStore.message);
    }
    if (!AuthStore.getStatus().loggedIn) {
      this.transitionTo('/');
      this.setState(_appState());
      return;
    }

    if (this.isMounted() && AuthStore.getStatus().loggedIn) {
      setTimeout(() => {
        AppActionCreators.startSynchronize();
      },0);
    }

    this.setState(_appState());
  }

  _onPostsStoreChange() {
    if (!PostsStore.isLoading() && PostsStore.message) {
      this.showNotification(PostsStore.message);
    }
    this.setState(_appState());
  }

  showNotification(message) {
    let options = {
      closeButton: true,
      timeOut: 6000,
      extendedTimeOut: 1000
    };
    if (message.type === 'error') {
      this.refs.toastr.error(
        message.content,
        message.title, options);

    }
    if (message.type === 'warning') {
      this.refs.toastr.warning(
        message.content,
        message.title, options);

    }
    if (message.type === 'success') {
      this.refs.toastr.success(
        message.content,
        message.title, options);
    }

  }

  render(){
    let menuItems = [
      { route: 'posts', text: 'Posts' },
      { route: 'css-framework', text: 'CSS Framework' },
      { route: 'components', text: 'Components' }
    ];

    let navbar;
    if (this.state.loggedIn)
      navbar = (
        <div>
          <Navbar/>
        </div>
      );


    if (this.state.isInit)
      return (
        <div>
          {navbar}
          <ToastContainer ref="toastr"
          toastMessageFactory={ToastMessageFactory}
          className="toast-top-right" />
          <RouteHandler/>
          </div>
        );
    else
      return (
        <Loader loading={true}></Loader>
      );
    }
}

export default React.createClass(assign(Hubpress.prototype, Router.Navigation));
