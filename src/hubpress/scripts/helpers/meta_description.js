// # Meta Description Helper
// Usage: `{{meta_description}}`
//
// Page description used for sharing and SEO
//
// We use the name meta_description to match the helper for consistency:
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

import SettingsStore from '../stores/SettingsStore';
var _           = require('lodash'),
    meta_description;

meta_description = function () {
    var description,
        blog;

    if (_.isString(this.relativeUrl)) {
        blog = SettingsStore.config();
        if (!this.relativeUrl || this.relativeUrl === '/' || this.relativeUrl === '') {
            description = blog.site.description;
        } else if (this.author) {
            description = /\/page\//.test(this.relativeUrl) ? '' : this.author.bio;
        } else if (this.tag) {
            if (/\/page\//.test(this.relativeUrl)) {
                description = '';
            } else {
                description = _.isEmpty(this.tag.meta_description) ? '' : this.tag.meta_description;
            }
        } else if (this.post) {
            description = _.isEmpty(this.post.meta_description) ? '' : this.post.meta_description;
        }
    }

    description = description || '';
    return description.trim();
};

module.exports = meta_description;
