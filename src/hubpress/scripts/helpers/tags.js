// # Tags Helper
// Usage: `{{tags}}`, `{{tags separator=' - '}}`
//
// Returns a string of the tags on the post.
// By default, tags are separated by commas.
//
// Note that the standard {{#each tags}} implementation is unaffected by this helper

import SettingsStore from '../stores/SettingsStore';
var handlebars             = require('handlebars'),
    _               = require('lodash'),
    utils           = require('./utils'),
    tags;

tags = function (options) {
    options = options || {};
    options.hash = options.hash || {};

    var autolink = options.hash && _.isString(options.hash.autolink) && options.hash.autolink === 'false' ? false : true,
        separator = options.hash && _.isString(options.hash.separator) ? options.hash.separator : ', ',
        prefix = options.hash && _.isString(options.hash.prefix) ? options.hash.prefix : '',
        suffix = options.hash && _.isString(options.hash.suffix) ? options.hash.suffix : '',
        output = '';

    function createTagList(tags) {
        var tagNames = _.pluck(tags, 'name');

        if (autolink) {
            return _.map(tags, function (tag) {
                return utils.linkTemplate({
                    url: SettingsStore.getSiteUrl() + '/tag/'+tag.slug,
                    text: _.escape(tag.name)
                });
            }).join(separator);
        }
        return _.escape(tagNames.join(separator));
    }

    if (this && this.tags && this.tags.length) {
        output = prefix + createTagList(this.tags) + suffix;
    }

    return new handlebars.SafeString(output);
};

module.exports = tags;
