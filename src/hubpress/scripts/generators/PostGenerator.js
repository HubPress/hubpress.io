const Q = require('q');
const _ = require('lodash');
import ThemeStore from '../stores/ThemeStore';
import AuthStore from '../stores/AuthStore';
import SettingsStore from '../stores/SettingsStore';
const slug = require('slug');
const url = require('../utils/url');

class PostGenerator {

  constructor() {
    this.name = 'post';
  }

  generate(params) {
    console.info('PostGenerator - generate');
    console.log('PostGenerator - generate', params);
    let defer = Q.defer();
    let postsToPublish = [];
    let modifiedPost = params.post;

    if (!modifiedPost) {
      defer.resolve(postsToPublish);
      return defer.promise;
    }

    let postData = {};
    _.extend(postData, modifiedPost.original);

    postData.tags = _.map(postData.tags, (tag) => {
      return {
        name: tag,
        slug: slug(tag)
      }
    });

    postData.author = AuthStore.getAuthor();

    const config = SettingsStore.config();
    let theme = config.theme;
    theme.url = SettingsStore.getThemeUrl(theme.name);

    let htmlContent = ThemeStore.template('post',{
        context: 'post',
        site: config.site,
        theme: theme,
        socialnetwork: config.socialnetwork,
        relativeUrl: modifiedPost.url,
        post: postData
      });

    postsToPublish.push({
      title: modifiedPost.title,
      image: modifiedPost.image,
      name:modifiedPost.name,
      path:url.getPostGhPath(modifiedPost.name),
      content:htmlContent,
      message: `Publish ${modifiedPost.name}`,
      published_at: modifiedPost.published_at
    });


    defer.resolve(postsToPublish);

    return defer.promise;
  }
}

export default new PostGenerator();


/*



 */
