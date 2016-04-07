const React = require('react');
const Router = require('react-router');
const { Link } = Router;
const uuid = require('node-uuid');
const Authentication = require('./Authentication');
const Loader = require('./Loader.react.js');
const AsciidocRender = require('./AsciidocRender.react.js');
import PostsStore from '../stores/PostsStore';
import PostsActionCreators from '../actions/PostsActionCreators';

let PostItem = React.createClass({
  mixins: [ Router.Navigation ],

  handleClick: function() {
    this.props.onClick(this.props.post);
  },

  editPost: function() {
    this.transitionTo('/posts/'+this.props.post.id);
  },

  render: function() {
    let postClasses = '';

    if (this.props.selectedPost.id === this.props.post.id) {
      postClasses += ' active';
    }

    if (!this.props.post.original || this.props.post.original.content !== this.props.post.content) {
      postClasses += ' draft';
    }
    else if (this.props.post.published) {
      postClasses += ' published';
    }

    return (
      <li key={this.props.post.id} className={postClasses}  onClick={this.handleClick}>
        <h3>{this.props.post.attributes.map['doctitle']}</h3>

        <div className="actions top">
          <a onClick={this.editPost}>
            <i className="fa fa-pencil-square-o fa-lg"></i>
          </a>
        </div>

      </li>
    );
  }
});


let Posts = React.createClass({
  mixins: [ Authentication],

  getInitialState: function() {
    return {posts: [], selectedPost: {}, loading: true}
  },

  componentDidMount: function() {
    PostsStore.addChangeListener(this._onPostsStoreChange);
    this.setState({posts: PostsStore.getPosts(true), selectedPost: {}, loading: PostsStore.isLoading()});
  },

  componentWillUnmount: function() {
    PostsStore.removeChangeListener(this._onPostsStoreChange);
  },

  _onPostsStoreChange: function(){

    if (!PostsStore.isLoading()) {
      let selectedPost = {};

      if (PostsStore.getPosts().length) {
        selectedPost = PostsStore.getPosts()[0];
      }
      this.setState({posts: PostsStore.getPosts(), loading: PostsStore.isLoading(), selectedPost: selectedPost});
    }
    else {
      this.setState({posts: [], selectedPost: {}, loading: PostsStore.isLoading()});

    }

  },

  handleClick: function(post) {
    this.setState({selectedPost: post});
  },

  render: function() {

      let posts = this.state.posts.map(function(post, i) {
        return (
          <PostItem key={post.id} post={post} selectedPost={this.state.selectedPost} onClick={this.handleClick}/>
        )
      }, this);

      let title = this.state.posts.length ? 'All posts' : 'No post';
      let value = (
        <div>
          <Loader loading={this.state.loading}></Loader>
          <div className="container posts-list">
            <ul>
              <li>{title}
                <div className="actions top">
                  <Link to="post" params={{postId: uuid.v4()}} onClick={this.doAnimation}>
                    <i className="fa fa-plus-circle fa-lg"></i>
                  </Link>
                </div>
              </li>
              {posts}
            </ul>
            <AsciidocRender content={this.state.selectedPost.content} />
          </div>
        </div>

      );
    return value;
  }

});

module.exports = Posts;
