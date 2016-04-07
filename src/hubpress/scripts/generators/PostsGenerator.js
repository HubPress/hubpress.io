const Q = require('q');
const _ = require('lodash');
import PostGenerator from './PostGenerator';


class PostsGenerator {

  constructor() {
    this.name = 'posts';
  }

  generate(params) {
    console.info('PostsGenerator - generate');
    console.log('PostsGenerator - generate', params);
    let defer = Q.defer();
    let postsToPublish = [];

    let postPromises = [];
    _.each(params.posts, (post, index) => {
      let postDeferred = Q.defer();
      postPromises.push(postDeferred.promise);

      PostGenerator.generate({post: post})
      .then((publishedPostArray) => {
        postDeferred.resolve(publishedPostArray);
      })
      .catch((err) => {
        postDeferred.reject(err);
      });

    });

    Q.all(postPromises)
    .then((values) => {
      defer.resolve(_.flatten(values, true));
    })
    .catch((err) => {
      defer.reject(err);
    });


    return defer.promise;
  }
}

export default new PostsGenerator();
