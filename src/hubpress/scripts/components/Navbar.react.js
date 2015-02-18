const React = require('react');
const Router = require('react-router');
const { Link } = Router;
import AuthStore from '../stores/AuthStore';
import AuthActionCreators from '../actions/AuthActionCreators';

let NavBar = React.createClass({

  getInitialState: function() {
    return {
      transitioned: false
    };
  },

  doAnimation: function() {
    this.setState({
      transitioned: !this.state.transitioned
    })
  },

  handleLogout: function() {
    AuthActionCreators.logOut();
  },

  render: function() {
    let author = AuthStore.getAuthor() || {};
    return (
      <div className={this.state.transitioned ? 'side-nav transitioned' : 'side-nav'}>

        <nav>
          <header>
            <img src={author.image} className="avatar"/>
            <p>{author.name}</p>
            <hr/>
          </header>
          <ul>
          <li><Link to="posts" onClick={this.doAnimation}><i className="fa fa-pencil"></i> Posts</Link></li>
          <li><Link to="settings" onClick={this.doAnimation}><i className="fa fa-cog"></i> Settings</Link></li>
          <li><a onClick={this.handleLogout}><i className="fa fa-power-off"></i> Disconnect</a></li>
          </ul>
          <footer><img src="http://hubpress.io/img/logo.png" className="avatar"/></footer>
        </nav>
        <div className="action"><a onClick={this.doAnimation}><i className="fa fa-bars"></i></a></div>
      </div>
    );
  }

});

module.exports = NavBar;
