const Q = require('q');
const _ = require('lodash');
const slug = require('slug');
import PaginationGenerator from './PaginationGenerator';


class TagsGenerator {

  constructor() {
    this.name = 'tags';
  }

  generate(params) {
    console.info('TagsGenerator - generate');
    console.log('TagsGenerator - generate', params);
    let defer = Q.defer();
    let posts;

    if (params.tags) {
      posts = _.filter(params.posts, (post) => {
        return _.intersection(params.tags, post.tags).length;
      });
    }
    else {
      posts = params.posts
    }

    let tags = _.reduce(posts, (memo, post) => {
      if (!post.tags) {
        return memo;
      }

      let postsTags = _.reduce(post.tags, (memo, postTag) => {
        let slugTag = slug(postTag);
        if (!params.tags || params.tags.indexOf(postTag) !== -1) {
          memo.push(slugTag);
        }
        
        return memo;
      }, []);

      _.each(_.uniq(postsTags), (postTag) => {
        memo[postTag] = memo[postTag] || [];
        memo[postTag].push(post);
      });

      return memo;

    }, {});

    let postPromises = [];
    _.each(tags, (tag, key) => {
      let postDeferred = Q.defer();
      postPromises.push(postDeferred.promise);

      let tagObject = {
        name: key,
        slug: slug(key)
      }

      PaginationGenerator.generate({posts: tag, tag: tagObject, template: 'tag', path: `tag/${key}/`})
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

export default new TagsGenerator();
