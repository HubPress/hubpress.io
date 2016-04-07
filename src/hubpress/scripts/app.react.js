/** @jsx React.DOM */

let React = window.React = require('react');
let Router = require('react-router');
let { Route, DefaultRoute, RouteHandler, Link } = Router;
let mountNode = document.getElementById("hubpress");

// Components
import Hubpress from './components/Hubpress.react.js';
import HpWebApiUtils from './utils/HpWebApiUtils.js';
let Login = require('./components/Login.react');
let Posts = require('./components/Posts.react');
let Post = require('./components/Post.react');
let Settings = require('./components/Settings.react');

let injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

HpWebApiUtils.getConfig();

let routes = (
  <Route handler={Hubpress}>
    <DefaultRoute handler={Posts}/>
    <Route name="login" handler={Login}/>
    <Route name="posts" path="/posts" handler={Posts} />
    <Route name="post" path="/posts/:postId" handler={Post} />
    <Route name="settings" path="/settings" handler={Settings} />
  </Route>
);

Router.run(routes, (Handler) => {
  React.render(<Handler/>, mountNode);
});
