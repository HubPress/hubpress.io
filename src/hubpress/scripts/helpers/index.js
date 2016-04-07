var handlebars             = require('handlebars'),
    coreHelpers     = {},
    registerHelpers;

// Pre-load settings data:
// - activeTheme
// - permalinks

coreHelpers.asset  = require('./asset');
coreHelpers.author  = require('./author');
coreHelpers.body_class  = require('./body_class');
coreHelpers.content  = require('./content');
coreHelpers.date  = require('./date');
coreHelpers.encode  = require('./encode');
coreHelpers.excerpt  = require('./excerpt');
coreHelpers.foreach = require('./foreach');
coreHelpers.ghost_foot = require('./ghost_foot');
coreHelpers.ghost_head = require('./ghost_head');
coreHelpers.is = require('./is');
coreHelpers.has = require('./has');
coreHelpers.meta_description = require('./meta_description');
coreHelpers.meta_title = require('./meta_title');
coreHelpers.page_url = require('./page_url');
coreHelpers.pageUrl = require('./page_url').deprecated;
coreHelpers.pagination = require('./pagination');
coreHelpers.plural = require('./plural');
coreHelpers.post_class = require('./post_class');
coreHelpers.tags = require('./tags');
coreHelpers.title = require('./title');
coreHelpers.url = require('./url');
coreHelpers.image = require('./image');


coreHelpers.helperMissing = function (arg) {
    if (arguments.length === 2) {
        return undefined;
    }
    console.log('Missing helper: "' + arg + '"');
};

// Register a handlebars helper for themes
function registerThemeHelper(name, fn) {
  handlebars.registerHelper(name, fn);
}

registerHelpers = function (adminHbs) {

    // Register theme helpers
    registerThemeHelper('asset', coreHelpers.asset);
    registerThemeHelper('author', coreHelpers.author);
    registerThemeHelper('content', coreHelpers.content);
    registerThemeHelper('title', coreHelpers.title);
    registerThemeHelper('date', coreHelpers.date);
    registerThemeHelper('encode', coreHelpers.encode);
    registerThemeHelper('excerpt', coreHelpers.excerpt);
    registerThemeHelper('foreach', coreHelpers.foreach);
    registerThemeHelper('is', coreHelpers.is);
    registerThemeHelper('has', coreHelpers.has);
    registerThemeHelper('page_url', coreHelpers.page_url);
    registerThemeHelper('pageUrl', coreHelpers.pageUrl);
    registerThemeHelper('pagination', coreHelpers.pagination);
    registerThemeHelper('tags', coreHelpers.tags);
    registerThemeHelper('plural', coreHelpers.plural);
    registerThemeHelper('url', coreHelpers.url);
    registerThemeHelper('image', coreHelpers.image);

    registerThemeHelper('body_class', coreHelpers.body_class);
    registerThemeHelper('ghost_foot', coreHelpers.ghost_foot);
    registerThemeHelper('ghost_head', coreHelpers.ghost_head);
    registerThemeHelper('meta_description', coreHelpers.meta_description);
    registerThemeHelper('meta_title', coreHelpers.meta_title);
    registerThemeHelper('post_class', coreHelpers.post_class);
};

module.exports = coreHelpers;
module.exports.loadCoreHelpers = registerHelpers;
module.exports.registerThemeHelper = registerThemeHelper;
