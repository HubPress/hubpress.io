'use strict';
import Github from '../resources/Github.js';
import IndexedDb from '../resources/IndexedDb.js';
import PostsActionIDBCreators from '../actions/PostsActionIDBCreators';
import AppActionServerCreators from '../actions/AppActionServerCreators';
import Generators from '../generators/Generators.js';
const url = require('../utils/url');
const Q = require('q');
const slug = require('slug');
const _ = require('lodash');
const moment = require('moment');
const assign = require('object-assign');
const uuid = require('node-uuid');
const asciidoctor = require('../utils/asciidoctor');


function _getPost(db, id) {
  return db.posts
    .where('id')
    .equals(id)
    .first();
}

function _localSave(post) {
  let deferred = Q.defer();
  let published_at = post.attributes.map['published_at'] || post.published_at || moment().format('YYYY-MM-DD');
  let title = post.attributes.map['doctitle'] ;
  let image = post.attributes.map['hp-image'] ;
  let tags = post.attributes.map['hp-tags'] && post.attributes.map['hp-tags'].split(',') ;
  let altTitle = post.attributes.map['hp-alt-title'];
  let name = slug(published_at + '-' + (altTitle || title)) +'.adoc';
  let urlPost = url.getPostUrl(name);

  let postToSave = assign({}, post, {
		published_at: published_at,
		name: name,
		url: urlPost,
    title: title,
    image: image,
    tags: tags
	});
  let db = IndexedDb.getDb();
  db.transaction('rw', db.posts, ()=>{
    db.posts.put(postToSave);
  })
  .then(()=>{
    deferred.resolve(postToSave);
  })
  .catch((err) => {
    deferred.reject(err);
  });

  return deferred.promise;
}

function _remoteSave(repository, context, db, id) {
  return _getPost(db, id)
  .then(_movePostIfNecessary(repository, context))
  .then(_writePost(repository, context))
  .then(_localSave);
}

function _deleteElements(repository, context, elementPath) {
  let deferred = Q.defer();

  repository.delete(context.branch, elementPath, (err, sha)=>{

    if (err) {
      deferred.reject(err);
    }
    else {
      deferred.resolve(sha);
    }
  });

  return deferred.promise;
}

function _movePostIfNecessary(repository, context) {

	return (post) => {
	  let promise;
	  // Check if move is necessary
	  if (post.original && post.name !== post.original.name) {
	    let deferred = Q.defer();
	    promise = deferred.promise;
	    // Move post
	    repository.move(context.branch, `_posts/${post.original.name}`, `_posts/${post.name}`, (err, sha) => {
	      if (err) {
	        deferred.reject(err);
	      }
	      else {
          // if published, then removed
          if (post.published) {
            let elementPath = url.getPostGhPath(post.original.name);
            _deleteElements(repository, context, elementPath)
            .then((sha) => {
              deferred.resolve({post: post, sha: sha});
            })
            .catch((err) => {
              deferred.reject(err);
            })
            .done();
          }
          else {
            deferred.resolve({post: post, sha: sha});
          }
	      }
	    });
	  }
	  else {
	    promise = Q({post: post});
	  }
	  return promise;

	}
}

function _writePost(repository, context) {

	return (value) => {
		let post = value.post;
		let deferred = Q.defer();

		repository.write(context.branch, '_posts/'+post.name, post.content, 'Update '+post.name, (err, sha) => {
			if (err) {
				deferred.reject(err);
			}
			else {
				post.original = assign({}, post);
				post.original.url = url.getPostUrl(post.original.name);
				post.original.path = '_posts/' + post.original.name;
				post.original.sha = sha;

				deferred.resolve(post);
			}

		})

		return deferred.promise;

	}
}

function _getGithubPostsSha(repository, context) {

  let deferred = Q.defer();

  repository.read(context.branch, '', (err, elements) => {
    if (err) {
      deferred.reject(err);
    }
    else {
      let postsSha;
      elements = JSON.parse(elements);

      elements.forEach((element) => {
        if (element.name === '_posts'){
          postsSha = element.sha;
        }
      });
      deferred.resolve(postsSha);
    }
  });

  return deferred.promise;

};

/*

1 get post github
1.1 filter post to sync
2 check if published
3 on va chercher le post correspondant et on le MAJ
4 on supprime les posts qui ne sont plus sur Github

*/
function _getPostsGithub(repository, context, sha) {
  let promise;

  if (sha === localStorage.postsSha) {
    promise = Q.fcall(function() {
      return [];
    });
  }
  else {
    let deferred = Q.defer();
    repository.read(context.branch, '_posts', (err, posts) => {
      if (err) {
        deferred.reject(err);
      }
      else {
        deferred.resolve(JSON.parse(posts));
      }
    });

    promise = deferred.promise;
  }

  return promise;
}

function _filterPostsToSync(db, posts) {
  let promises = [];

  posts.forEach((postGithub) => {
    let deferred = Q.defer();
    promises.push(deferred.promise);

    db.posts.where('original.name').equals(postGithub.name).first()
    .then((postDb) => {
      let _post = null;

      postDb = postDb || {id: uuid.v4()};

      // Test on sha is not enough because a post can be published/unpublished
      // and the sha on the post does not change
      //if (postDb.sha !== postGithub.sha) {
        _post = assign({}, postGithub, postDb);
      //}

      deferred.resolve(_post)
    })
    .catch((err) => {
      deferred.reject(err);
    })
  })

  return Q.all(promises);
}

function _markIfPublished(repository, context, posts) {
  let promises = [];
  let _posts = _.compact(posts);

  _posts.forEach((post) => {
    let deferred = Q.defer();
    promises.push(deferred.promise);

    repository.getSha(context.branch, url.getPostGhPath(post.name), (err, sha) => {
      if (err && err.error !==404) {
        deferred.reject(err);
      }
      else {
        let published = sha ? 1 : 0;
        let _post = assign({}, post, {published: published});
        deferred.resolve(_post);
      }
    });
  });

  return Q.all(promises);
}

function _readContentAndConvert(repository, context, posts) {
  let promises = [];

  posts.forEach((post) => {
    let deferred = Q.defer();
    promises.push(deferred.promise);

    repository.read(context.branch, post.path, (err, content) => {
      if (err) {
        deferred.reject(err);
      }
      else {
        let _post;
        // Convert with Asciidoc only if necessary
        if (post.original && post.original.content === content) {
          _post = assign({}, post);
        }
        else {
          _post = assign({}, post, asciidoctor.convert(content), {
            content: content
          });
        }

        deferred.resolve(_post);
      }

    });
  });

  return Q.all(promises);

}

function _majPostsIndexDb(repository, context, posts) {

  let promises = [];

  posts.forEach((post) => {
    let original = _.pick(post, 'attributes', 'html', 'tags', 'content', 'name', 'path', 'sha');

    original.title = original.attributes.map['doctitle'] ;
    original.image = original.attributes.map['hp-image'] ;
    original.tags = original.attributes.map['hp-tags'] && post.attributes.map['hp-tags'].split(',') ;
    original.url = url.getPostUrl(original.name);

    let _postToSave = assign({}, post, {original: original});
    _postToSave.original.published_at = _postToSave.published_at = original.name.split('-').slice(0,3).join('-');

    let deferred = Q.defer();
    promises.push(deferred.promise);

    _localSave(_postToSave)
    .then((_post) => {
      deferred.resolve(_post);
    })
    .catch((err)=>{
      deferred.reject(err);
    })
  });

  return Q.all(promises);
}

function _removePostsDeleted() {

}

function _updateHead(repository, context, sha) {
  let deferred = Q.defer();

  repository.updateHead(context.branch, sha, (err, commit) => {
    if (err) {
      deferred.reject(err);
    }
    else {
      deferred.resolve(commit);
    }
  })

  return deferred.promise;
}

class PostsServices {

	constructor() {}

	getPosts() {
    console.info('PostsServices - getPosts');
		IndexedDb.getDb().posts
			.orderBy('name')
			.reverse()
			.toArray()
			.then((posts) => {
				PostsActionIDBCreators.receivePosts(posts);
			})
      .catch((err) => {
        conso.error(err);
				PostsActionIDBCreators.receivePosts([]);

      });
	}

	getPost(id) {
    console.info('PostsServices - getPost');
    console.log('PostsServices - getPost', id);
    const db = IndexedDb.getDb();
    _getPost(db, id)
			.then((post) => {
        if (post) {
          PostsActionIDBCreators.receivePost(post);
        }
        else {
          PostsActionIDBCreators.receivePost({id: id});
        }

			})
			.catch((err) => {
        console.error(err);
				PostsActionIDBCreators.receivePost({id: id});
			});
	}

	localSave(post) {
    //console.info('PostsServices - localSave');
    //console.log('PostsServices - localSave', post);
    _localSave(post)
      .then((_post)=>{
        //console.log('Save post ', _post);
      })
      .catch((err)=>{
        console.error('Erreur save post ', err);
      })

	}

  remoteSave(id) {
    console.info('PostsServices - remoteSave');
    console.log('PostsServices - remoteSave', id);
		let context = Github.getContext();
		let github = Github.getGithub();
    let repository = github.getRepo(context.username, context.repositoryName);
    const db = IndexedDb.getDb();

    _remoteSave(repository, context, db, id)
		.then((post)=>{
			PostsActionIDBCreators.receiveRemoteSave({
        post: post,
        message: {
          type: 'success',
          title: 'Remote save',
          content: 'Post Saved.'
        }
      });
		})
		.catch((err) => {
			PostsActionIDBCreators.receiveRemoteSave({
        message: {
          type: 'error',
          title: 'Remote save',
          content: 'Your post was not saved. See your browser\'s developer console for the cause of the error.'
        }
      });
		});
  }

  synchronizePosts() {
    console.info('PostsService - synchronizePosts');

    let context = Github.getContext();
    let github = Github.getGithub();
    let db = IndexedDb.getDb();
    let repository = github.getRepo(context.username, context.repositoryName);

    _getGithubPostsSha(repository, context)
    .then((sha) => {
      return _getPostsGithub(repository,context,sha);
    })
    .then((posts)=>{
      return _filterPostsToSync(db, posts);
    })
    .then((posts)=>{
      return _markIfPublished(repository, context, posts);
    })
    .then((posts)=>{
      return _readContentAndConvert(repository, context, posts);
    })
    .then((posts)=>{
      return _majPostsIndexDb(repository, context, posts);
    })
    .then((posts) => {
      AppActionServerCreators.finishSynchronize(posts);
    })
    .catch((err) => {
      console.log(err);
      AppActionServerCreators.finishSynchronize(err);

    })
    .done();
  }

	saveAndMarkAsPublished(id) {
    console.info('PostsServices - saveAndMarkAsPublished');
    console.log('PostsServices - saveAndMarkAsPublished', id);
    let context = Github.getContext();
    let github = Github.getGithub();
    let repository = github.getRepo(context.username, context.repositoryName);
    const db = IndexedDb.getDb();

    return _remoteSave(repository, context, db, id)
    .then((post) => {
      let _post = assign({}, post, {published: 1});
      return _localSave(_post);
    });
	}

  markAsUnpublishedAndDelete(id) {
    console.info('PostsServices - markAsUnpublishedAndDelete');
    console.log('PostsServices - markAsUnpublishedAndDelete', id);
    let context = Github.getContext();
    let github = Github.getGithub();
    let repository = github.getRepo(context.username, context.repositoryName);
    const db = IndexedDb.getDb();
    let post;
    let deferred = Q.defer();

    _getPost(db, id)
    .then((_post) => {
      post = _post;
      var elementPath = url.getPostGhPath(post.original.name);
      return _deleteElements(repository, context, elementPath)
    })
    .then(() => {
      let _post = assign({}, post, {published: 0});

      return _localSave(_post);
    })
    .then((savedPost)=>{
      deferred.resolve(savedPost);
    })
    .catch((err) => {
      if (err !== 'not found') {
        deferred.reject(err.error);
      }
      else {
        let _post = assign({}, post, {published: 0});

        _localSave(_post)
        .then((savedPost)=>{
          deferred.resolve(savedPost);
        }).done();
      }
    });

    return deferred.promise;
  }

  getPublishedPosts() {
    console.info('PostsServices - getPublishedPosts');
    let deferred = Q.defer();

    IndexedDb.getDb().posts
    .where('published')
    .equals(1)
    .toArray()
    .then((posts) => {
      if (!posts) {
        deferred.resolve([]);
        return;
      }

      posts.sort((postA, postB) => {
        if (postA.original.name > postB.original.name) {
          return -1;
        }
        if (postA.original.name < postB.original.name) {
          return 1;
        }
        return 0;
      });

      deferred.resolve(posts);
    });

    return deferred.promise;
  }

  publishElements(elements) {
    console.info('PostsServices - publishElements');
    console.log('PostsServices - publishElements', elements);
    let context = Github.getContext();
    let github = Github.getGithub();
    let repository = github.getRepo(context.username, context.repositoryName);
    let deferred = Q.defer();

    repository.writeAll(context.branch, elements, (err, commit) => {
      if (err) {
        deferred.reject(err);
      }
      else {
        repository.write(context.branch, '.last-sha', commit, 'Update last sha', (err, sha) => {
          if (err) {
            console.log('.last-sha', err);
            deferred.reject(err);
          }
          else {
            console.log('.last-sha done');
            deferred.resolve(sha);
          }
        });
      }
    });

    return deferred.promise;
  }

  publishPost(id) {
    console.info('PostsServices - publishPost');
    console.log('PostsServices - publishPost', id);
    let postToPublish;
    let tags;
    const db = IndexedDb.getDb();
    _getPost(db, id)
    .then((post) => {
      let originalTags = post.original ? post.original.tags : [];
      tags = _.union(post.tags, originalTags);
      return this.saveAndMarkAsPublished(id);
    })
    .then((post) => {
      postToPublish = post;
      return this.getPublishedPosts();
    })
    .then((posts) => {
      let generators = ['post', 'index'];
      if (tags.length) {
        generators.push('tags');
      }
      else {
        tags = undefined;
      }

      return Generators.generate({
        generators: generators,
        post: postToPublish,
        posts: posts,
        tags: tags
      });
    })
    .then((elementsToPublish) => {
      return this.publishElements(elementsToPublish);
    })
    .then((sha) => {
      PostsActionIDBCreators.receivePublish({
        message: {
          type: 'success',
          title: 'Publishing',
          content: 'Post Published'
        }
      });
    })
    .catch((err) => {
      console.error('PostsServices - publishElements error', err);
      PostsActionIDBCreators.receivePublish({
        message: {
          type: 'error',
          title: 'Publishing',
          content: 'Your post was not published. See your browser\'s developer console for the cause of the error.'
        }
      });
    });
  }

  publishPosts() {
    console.info('PostsServices - publishPosts');
    this.getPublishedPosts()
    .then((posts) => {
      return Generators.generate({
        posts: posts
      });
    })
    .then((elementsToPublish) => {
      return this.publishElements(elementsToPublish);
    })
    .then((sha) => {
      PostsActionIDBCreators.receivePublish({
        message: {
          type: 'success',
          title: 'Publishing - Step 2/2',
          content: 'All Posts Published'
        }
      });
    })
    .catch((err) => {
      console.error('PostsServices - publishPosts error', err);
      PostsActionIDBCreators.receivePublish({
        message: {
          type: 'error',
          title: 'Publishing',
          content: 'Posts were not published. See your browser\'s developer console for the cause of the error.'
        }
      });
    });
  }

  unpublishPost(id) {
    console.info('PostsServices - unpublishPost');
    console.log('PostsServices - unpublishPost', id);
    let deferred = Q.defer();
    let tags;
    const db = IndexedDb.getDb();
    _getPost(db, id)
    .then((post)=>{
      tags = post.tags;
      return this.markAsUnpublishedAndDelete(id);
    })
    .then(this.getPublishedPosts)
    .then((posts) => {
      return Generators.generate({
        generators: ['tags', 'index'],
        posts: posts,
        tags: tags
      });
    })
    .then((elementsToPublish) => {
      return this.publishElements(elementsToPublish);
    })
    .then(() => {
      PostsActionIDBCreators.receiveUnpublish({
        message: {
          type: 'success',
          title: 'Unpublishing',
          content: 'Blog Post Unpublished.'
        }
      });
      deferred.resolve();
    })
    .catch((e) => {
      console.error('PostsServices - unpublishPost error', e);
      PostsActionIDBCreators.receiveUnpublish({
        message: {
          type: 'error',
          title: 'Publishing',
          content: 'The blog entry was not unpublished. See your browser\'s developer console for the cause of the error.'
        }
      });
      deferred.reject(e);
    });

    return deferred.promise;
  }

}

export default new PostsServices();
