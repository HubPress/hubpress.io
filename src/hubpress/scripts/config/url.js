// Contains all path information to be used throughout
// the codebase.

let moment            = require('moment'),
    _                 = require('lodash'),
    ghostConfig = '';

// ## setConfig
// Simple utility function to allow
// passing of the ghostConfig
// object here to be used locally
// to ensure clean depedency graph
// (i.e. no circular dependencies).
function setConfig(config) {
    ghostConfig = config;
}

// ## createUrl
// Simple url creation from a given path
// Ensures that our urls contain the subdirectory if there is one
// And are correctly formatted as either relative or absolute
// Usage:
// createUrl('/', true) -> http://my-ghost-blog.com/
// E.g. /blog/ subdir
// createUrl('/welcome-to-ghost/') -> /blog/welcome-to-ghost/
// Parameters:
// - urlPath - string which must start and end with a slash
// - absolute (optional, default:false) - boolean whether or not the url should be absolute
// - secure (optional, default:false) - boolean whether or not to use urlSSL or url config
// Returns:
//  - a URL which always ends with a slash
function createUrl(urlPath, absolute, secure) {
    urlPath = urlPath || '/';
    absolute = absolute || false;
    let output = '', baseUrl;

    // create base of url, always ends without a slash
    if (absolute) {
        baseUrl = (secure && ghostConfig.urlSSL) ? ghostConfig.urlSSL : ghostConfig.url;
        output += baseUrl.replace(/\/$/, '');
    } else {
        output += ghostConfig.paths.subdir;
    }

    // append the path, always starts and ends with a slash
    output += urlPath;

    return output;
}

// ## urlPathForPost
// Always sync
// Creates the url path for a post, given a post and a permalink
// Parameters:
// - post - a json object representing a post
// - permalinks - a string containing the permalinks setting
function urlPathForPost(post, permalinks) {
    let output = '',
        tags = {
            year:   function () { return moment(post.published_at).format('YYYY'); },
            month:  function () { return moment(post.published_at).format('MM'); },
            day:    function () { return moment(post.published_at).format('DD'); },
            author: function () { return post.author.slug; },
            slug:   function () { return post.slug; },
            id:     function () { return post.id; }
        };

    if (post.page) {
        output += '/:slug/';
    } else {
        output += permalinks;
    }

    // replace tags like :slug or :year with actual values
    output = output.replace(/(:[a-z]+)/g, function (match) {
        if (_.has(tags, match.substr(1))) {
            return tags[match.substr(1)]();
        }
    });

    return output;
}

// ## urlFor
// Synchronous url creation for a given context
// Can generate a url for a named path, given path, or known object (post)
// Determines what sort of context it has been given, and delegates to the correct generation method,
// Finally passing to createUrl, to ensure any subdirectory is honoured, and the url is absolute if needed
// Usage:
// urlFor('home', true) -> http://my-ghost-blog.com/
// E.g. /blog/ subdir
// urlFor({relativeUrl: '/my-static-page/') -> /blog/my-static-page/
// E.g. if post object represents welcome post, and slugs are set to standard
// urlFor('post', {...}) -> /welcome-to-ghost/
// E.g. if post object represents welcome post, and slugs are set to date
// urlFor('post', {...}) -> /2014/01/01/welcome-to-ghost/
// Parameters:
// - context - a string, or json object describing the context for which you need a url
// - data (optional) - a json object containing data needed to generate a url
// - absolute (optional, default:false) - boolean whether or not the url should be absolute
// This is probably not the right place for this, but it's the best place for now
function urlFor(context, data, absolute) {
    let urlPath = '/',
        secure, imagePathRe,
        knownObjects = ['post', 'tag', 'author', 'image'], baseUrl,

    // this will become really big
    knownPaths = {
        home: '/',
        rss: '/rss/',
        api: '/ghost/api/v0.1'
    };

    // Make data properly optional
    if (_.isBoolean(data)) {
        absolute = data;
        data = null;
    }

    // Can pass 'secure' flag in either context or data arg
    secure = (context && context.secure) || (data && data.secure);

    if (_.isObject(context) && context.relativeUrl) {
        urlPath = context.relativeUrl;
    } else if (_.isString(context) && _.indexOf(knownObjects, context) !== -1) {
        // trying to create a url for an object
        if (context === 'post' && data.post) {
            urlPath = data.post.url;
            secure = data.secure;
        } else if (context === 'tag' && data.tag) {
            urlPath = '/tag/' + data.tag.slug + '/';
            secure = data.tag.secure;
        } else if (context === 'author' && data.author) {
            urlPath = '/author/' + data.author.slug + '/';
            secure = data.author.secure;
        } else if (context === 'image' && data.image) {
            urlPath = data.image;
            imagePathRe = new RegExp('^' + ghostConfig.paths.subdir + '/' + ghostConfig.paths.imagesRelPath);
            absolute = imagePathRe.test(data.image) ? absolute : false;
            secure = data.image.secure;

            if (absolute) {
                // Remove the sub-directory from the URL because ghostConfig will add it back.
                urlPath = urlPath.replace(new RegExp('^' + ghostConfig.paths.subdir), '');
                baseUrl = (secure && ghostConfig.urlSSL) ? ghostConfig.urlSSL : ghostConfig.url;
                baseUrl = baseUrl.replace(/\/$/, '');
                urlPath = baseUrl + urlPath;
            }

            return urlPath;
        } else if (context === 'sitemap-xsl') {
            absolute = true;
            urlPath = '/sitemap.xsl';
        }
        // other objects are recognised but not yet supported
    } else if (_.isString(context) && _.indexOf(_.keys(knownPaths), context) !== -1) {
        // trying to create a url for a named path
        urlPath = knownPaths[context] || '/';
    }

    return createUrl(urlPath, absolute, secure);
}

module.exports.setConfig = setConfig;
module.exports.urlFor = urlFor;
module.exports.urlPathForPost = urlPathForPost;
