const React = require('react');
const assign = require('object-assign');
const Router = require('react-router');
const Loader = require('./Loader.react.js');
const Authentication = require('./Authentication');
require('../utils/codemirror/mode/asciidoc');
const CodeMirror = require('react-code-mirror');

const AsciidocRender = require('./AsciidocRender.react');

import SettingsStore from '../stores/SettingsStore';
import PostsStore from '../stores/PostsStore';
import PostsActionCreators from '../actions/PostsActionCreators';

let Post = React.createClass({
  mixins: [Authentication, Router.State],

  getInitialState: function() {
    return {post: {}, asciidocContent: '', loading: true, viewActive: false};
  },

  componentDidMount: function() {
    PostsStore.addChangeListener(this._onPostsStoreChange);
    this.setState({post: PostsStore.getPost(this.getParams().postId), loading: PostsStore.isLoading(), viewActive: false});
  },

  componentWillUnmount: function() {
    PostsStore.removeChangeListener(this._onPostsStoreChange);
  },

  _onPostsStoreChange: function(){
    if (!PostsStore.isLoading()) {
      let post = PostsStore.getPost(this.getParams().postId);
      this.setState({post: post, asciidocContent: post.content, loading: PostsStore.isLoading()});

    }
    else {
      this.setState({post: this.state.post, asciidocContent: this.state.asciidocContent, loading: PostsStore.isLoading()});
    }

  },

  handleRemoteSave: function() {
    PostsActionCreators.remoteSave(this.getParams().postId);
    //this.setState({loading: true});
  },

  handlePublish: function() {
    PostsActionCreators.publish(this.getParams().postId);
  },

  handleUnpublish: function() {
    PostsActionCreators.unpublish(this.getParams().postId);
  },

  handleChange: function(event) {
    const config = SettingsStore.config();
    let post = this.state.post;

    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    this.timeout = window.setTimeout(() => {
      let content = this.state.post.content;
      this.setState({asciidocContent: content });
    }, config.meta.delay ? config.meta.delay : 200);

    post.content = event.target.value;
    this.setState({post: post});
  },

  handleAsciidocChange: function(postConverted) {
    postConverted.title = postConverted.attributes && postConverted.attributes.map['doctitle'];
    if (!PostsStore.isLoading() && postConverted.title) {
      let postToSave = assign({}, this.state.post, postConverted);
      this.postAttributes = postToSave.attributes;
      PostsActionCreators.localSave(postToSave);
    }
  },

  doAnimation: function() {
    this.setState({
      viewActive: !this.state.viewActive
    })
  },

  render: function() {
    let saveBtn;
    let publishedBtn;
    let toogleView;

    // if (this.state.loading)
    //   return (
    //     <div><h1>Loading</h1></div>
    //   );
    //else {
      if (this.state.viewActive) {
        toogleView = <a onClick={this.doAnimation}><span className="fa-stack"><i className="fa fa-circle-thin fa-stack-2x"></i><i className="fa fa-eye-slash fa-stack-1x"></i></span></a>

      }
      else {
        toogleView = <a onClick={this.doAnimation}><span className="fa-stack"><i className="fa fa-circle-thin fa-stack-2x"></i><i className="fa fa-eye fa-stack-1x"></i></span></a>
      }

      if (this.state.post.published) {
        publishedBtn = <a onClick={this.handleUnpublish} title="Unpublish post"><span className="fa-stack"><i className="fa fa-circle-thin fa-stack-2x"></i><i className="fa fa-level-down fa-stack-1x"></i></span></a> //<button name="unpublish" className="button success" onClick={this.handleUnpublish}>Unpublish</button>
        saveBtn = <a onClick={this.handlePublish} title="Update post"><span className="fa-stack"><i className="fa fa-circle-thin fa-stack-2x"></i><i className="fa fa-save fa-stack-1x"></i></span></a> //<button name="update" className="button success" onClick={this.handlePublish}>Update</button>
      }
      else {
        publishedBtn = <a onClick={this.handlePublish} title="Publish post"><span className="fa-stack"><i className="fa fa-circle-thin fa-stack-2x"></i><i className="fa fa-level-up fa-stack-1x"></i></span></a> //<button name="publish" className="button success" onClick={this.handlePublish}>Publish</button>
        saveBtn = <a onClick={this.handleRemoteSave} title="Save post"><span className="fa-stack"><i className="fa fa-circle-thin fa-stack-2x"></i><i className="fa fa-save fa-stack-1x"></i></span></a> //<button name="save" className="button success" onClick={this.handleRemoteSave}>Remote save</button>
      }

      return (
        <div>
          <Loader loading={this.state.loading}></Loader>
            <div className="actions top">
              {toogleView}
            </div>


          <div className={this.state.viewActive ? 'container view-active' : 'container view-inactive'}>

            <CodeMirror mode={'asciidoc'}
            theme={'solarized dark'}
            className={'editor'}
            textAreaClassName={['form-control']}
            value={this.state.post.content}
            textAreaStyle= {{minHeight: '10em'}}
            style= {{border: '1px solid black'}}
            lineNumbers={false}
            lineWrapping={true}
            autofocus={true}
            onChange={this.handleChange}
            />

            <div className="viewer" >
              <AsciidocRender content={this.state.asciidocContent} onChange={this.handleAsciidocChange}/>
            </div>
          </div>
            <div className="actions bottom">
              {saveBtn}
              {publishedBtn}
            </div>
        </div>
      );
    //}
  }

});

module.exports = Post;
