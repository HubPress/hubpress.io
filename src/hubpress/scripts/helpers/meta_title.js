// # Meta Title Helper
// Usage: `{{meta_title}}`
//
// Page title used for sharing and SEO
//
// We use the name meta_title to match the helper for consistency:
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

import SettingsStore from '../stores/SettingsStore';
var _           = require('lodash'),
    meta_title;

meta_title = function (options) {
    /*jshint unused:false*/
    var title = '',
        blog,
        page,
        pageString = '';

    if (_.isString(this.relativeUrl)) {
        blog = SettingsStore.config();

        page = this.relativeUrl.match(/\/page\/(\d+)/);

        if (page) {
            pageString = ' - Page ' + page[1];
        }

        if (!this.relativeUrl || this.relativeUrl === '/' || this.relativeUrl === '') {
            title = blog.site.title;
        } else if (this.author) {
            title = this.author.name + pageString + ' - ' + blog.site.title;
        } else if (this.tag) {
            title = _.isEmpty(this.tag.meta_title) ? this.tag.name + pageString + ' - ' + blog.site.title : this.tag.meta_title;
        } else if (this.post) {
            title = _.isEmpty(this.post.meta_title) ? this.post.title : this.post.meta_title;
        } else {
            title = blog.site.title + pageString;
        }
    }

    title = title || '';
    return title.trim();
};

module.exports = meta_title;
