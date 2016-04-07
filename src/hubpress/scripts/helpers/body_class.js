// # Body Class Helper
// Usage: `{{body_class}}`
//
// Output classes for the body element
//
// We use the name body_class to match the helper for consistency:
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var handlebars  = require('handlebars'),
    _               = require('lodash'),
    body_class;

body_class = function () {
    var classes = [],
        post = this.post,
        tags = this.post && this.post.tags ? this.post.tags : this.tags || [],
        page = this.post && this.post.page ? this.post.page : this.page || false;

    if (this.tag !== undefined) {
        classes.push('tag-template');
        classes.push('tag-' + this.tag.slug);
    }

    if (this.author !== undefined) {
        classes.push('author-template');
        classes.push('author-' + this.author.slug);
    }

    if (_.isString(this.relativeUrl) && this.relativeUrl.match(/\/(page\/\d)/)) {
        classes.push('paged');
        // To be removed from pages by #2597 when we're ready to deprecate this
        classes.push('archive-template');
    } else if (!this.relativeUrl || this.relativeUrl === '/' || this.relativeUrl === '') {
        classes.push('home-template');
    } else if (post) {
        // To be removed from pages by #2597 when we're ready to deprecate this
        // i.e. this should be if (post && !page) { ... }
        classes.push('post-template');
    }

    if (page) {
        classes.push('page-template');
        // To be removed by #2597 when we're ready to deprecate this
        classes.push('page');
    }

    if (tags) {
        classes = classes.concat(tags.map(function (tag) { return 'tag-' + tag.slug; }));
    }

    var classString = _.reduce(classes, function (memo, item) { return memo + ' ' + item; }, '');
    return new handlebars.SafeString(classString.trim());
};

module.exports = body_class;
