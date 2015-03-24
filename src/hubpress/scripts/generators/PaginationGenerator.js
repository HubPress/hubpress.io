const Q = require('q');
const _ = require('lodash');
const slug = require('slug');
import ThemeStore from '../stores/ThemeStore';
import AuthStore from '../stores/AuthStore';
import SettingsStore from '../stores/SettingsStore';

class PaginationGenerator {

  constructor() {
  }

  generate(params) {
    console.info('PaginationGenerator - generate');
    console.log('PaginationGenerator - generate', params);
    const posts = params.posts;
    const siteConfig = SettingsStore.config().site;
    siteConfig.url = SettingsStore.getSiteUrl();
    let defer = Q.defer();
    let pageCount = 1;
    let siteRoot = siteConfig.url;
    let pagePath = (params.path || '') + 'index.html';
    let postsPageToGenerate = [];
    let postsPageToPublish = [];
    let nbPostPerPage = parseInt(siteConfig.postsPerPage || 10, 10);
    let theme = SettingsStore.config().theme;
    let socialnetwork = SettingsStore.config().socialnetwork;


    if (!posts || !posts.length) {
      let htmlContent = ThemeStore.template(params.template ,{
        pagination: {
          prev: 0,
          next: 0,
          page: 0,
          pages: 0,
          total: 0,
          limit: nbPostPerPage
        },
        posts: [],
        tag: params.tag,
        site: siteConfig,
        theme: theme,
        socialnetwork: socialnetwork,
      });

      postsPageToPublish.push( {
        name:`page-${pageCount}`,
        path: pagePath,
        content: htmlContent,
        message: `Publish page-${pageCount} ${params.template}`,
        author: AuthStore.getAuthor()
      })

      defer.resolve(postsPageToPublish);

      return defer.promise;
    }

    let totalPage = Math.ceil((posts.length) / nbPostPerPage);

    _.each(posts, (post, index) => {
      let next = 0;
      let previous = 0;

      if (pageCount > 1) {
        pagePath =  (params.path || '') + `page/${pageCount}/index.html`;
      }

      if (pageCount > 1) {
        previous = pageCount-1;
      }
      if (pageCount < totalPage) {
        next = pageCount+1;
      }

      if (post.attributes.map['hp-tags']) {
        post.tags = post.attributes.map['hp-tags'].split(',');
        post.tags = _.map(post.tags, (tag) => {
          return  {
            name: tag,
            slug: slug(tag)
          };
        });
      }


      postsPageToGenerate.push({
        image: post.image,
        title: post.title,
        url: siteRoot+post.url,
        excerpt: post.excerpt,
        html: post.excerpt,
        tags: post.tags,
        published_at: post.published_at,
        relativeUrl: ''
      });

      if (Math.floor((index + 1) / nbPostPerPage) > pageCount-1 || (index + 1)===posts.length) {
        //Generate
        //
        //
        let htmlContent = ThemeStore.template(params.template,{
            pagination: {
              prev: previous,
              next: next,
              page: pageCount,
              pages: totalPage,
              total: posts.length,
              limit: nbPostPerPage
            },
            context: params.template,
            posts: postsPageToGenerate,
            tag: params.tag,
            title: siteConfig.title,
            description: siteConfig.description,
            site: siteConfig,
            theme: theme,
            socialnetwork: socialnetwork,
            relativeUrl: ''
          });

        postsPageToPublish.push( {
          name:`page-${pageCount}`,
          path: pagePath,
          content: htmlContent,
          message: `Publish page-${pageCount} ${params.template}`,
          author: AuthStore.getAuthor()
        });

        postsPageToGenerate = [];
        pageCount++;
      }

    });

    defer.resolve(postsPageToPublish);

    return defer.promise;
  }
}

export default new PaginationGenerator();
