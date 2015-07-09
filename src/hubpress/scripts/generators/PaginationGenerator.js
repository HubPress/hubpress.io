const Q = require('q');
const _ = require('lodash');
import ThemeStore from '../stores/ThemeStore';
import AuthStore from '../stores/AuthStore';
import SettingsStore from '../stores/SettingsStore';

class PaginationGenerator {

  constructor() {
    this.name = 'pagination';
  }

  generate(params) {
    console.info('PaginationGenerator - generate');
    console.log('PaginationGenerator - generate', params);
    const posts = params.posts;
    let defer = Q.defer();
    let pageCount = 1;
    const siteConfig = SettingsStore.config().site;
    siteConfig.url = SettingsStore.getSiteUrl();
    let siteRoot = siteConfig.url;
    let pagePath = 'index.html';
    let postsPageToGenerate = [];
    let postsPageToPublish = [];
    let nbPostPerPage = parseInt(siteConfig.postsPerPage || 10, 10);


    if (!posts || !posts.length) {
      let htmlContent = ThemeStore.template('index',{
        pagination: {
          prev: 0,
          next: 0,
          page: 0,
          pages: 0,
          total: 0,
          limit: nbPostPerPage
        },
        posts: [],
        site: siteConfig,
        theme: SettingsStore.config().theme,
        socialnetwork: SettingsStore.config().socialnetwork,
      });

      postsPageToPublish.push( {
        name:`page-${pageCount}`,
        path: 'index.html',
        content: htmlContent,
        message: `Publish page-${pageCount}`,
        author: AuthStore.getAuthor(),
        relativeUrl: ''
      })

      defer.resolve(postsPageToPublish);

      return defer.promise;
    }

    let totalPage = Math.ceil((posts.length) / nbPostPerPage);

    _.each(posts, (post, index) => {
      let olderPage = '';
      let youngerPage = '';
      let next = 0;
      let previous = 0;

      if (pageCount > 1) {
        pagePath = `page/${pageCount}/index.html`
      }

      if (pageCount > 1) {
        if (pageCount === 2) {
          youngerPage = '/index.html';
        }
        else {
          youngerPage = `${siteRoot}/page/${pageCount-1}/index.html`;
        }
        previous = pageCount-1;
      }
      if (pageCount < totalPage) {
        olderPage = `${siteRoot}/page/${pageCount+1}/index.html`;
        next = pageCount+1;
      }


      if (post.attributes.map.tags) {
        post.tags = post.attributes.map.tags.split(',');
        post.tags = _.map(post.tags, (tag) => {
          return tag.trim();
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
        let htmlContent = ThemeStore.template('index',{
            pagination: {
              prev: previous,
              next: next,
              page: pageCount,
              pages: totalPage,
              total: totalPage,
              limit: nbPostPerPage
            },
            posts: postsPageToGenerate,
            title: siteConfig.title,
            description: siteConfig.description,
            site: siteConfig,
            theme: SettingsStore.config().theme,
            socialnetwork: SettingsStore.config().socialnetwork,
            relativeUrl: ''
          });

        postsPageToPublish.push( {
          name:`page-${pageCount}`,
          path: pagePath,
          content: htmlContent,
          message: `Publish page-${pageCount}`,
          author: AuthStore.getAuthor()
        })

        postsPageToGenerate = [];
        pageCount++
      }

    })

    defer.resolve(postsPageToPublish);

    return defer.promise;
  }
}

export default new PaginationGenerator();
