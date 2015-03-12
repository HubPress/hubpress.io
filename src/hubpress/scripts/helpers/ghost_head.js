// # Ghost Head Helper
// Usage: `{{ghost_head}}`
//
// Outputs scripts and other assets at the top of a Ghost theme
//
// We use the name ghost_head to match the helper for consistency:
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

import SettingsStore from '../stores/SettingsStore';
var handlebars      = require('handlebars'),
    moment          = require('moment'),
    _               = require('lodash'),

    //config          = require('../config'),

    urlHelper           = require('./url'),
    meta_description    = require('./meta_description'),
    meta_title          = require('./meta_title'),
    excerpt             = require('./excerpt'),
    tagsHelper          = require('./tags'),
    imageHelper         = require('./image'),
    utils               = require('./utils'),
    ghost_head;

ghost_head = function (options) {
    /*jshint unused:false*/
    var self = this,
        blog = SettingsStore.config(),
        useStructuredData = true, // !config.isPrivacyDisabled('useStructuredData'),
        head = [],
        majorMinor = /^(\d+\.)?(\d+)/,
        trimmedVersion = this.version,
        trimmedUrlpattern = /.+(?=\/page\/\d*\/)/,
        trimmedUrl, next, prev, tags,
        structuredData,
        cover, authorImage, keywords,
        schema,
        title = handlebars.Utils.escapeExpression(blog.site.title);

    trimmedVersion = trimmedVersion ? trimmedVersion.match(majorMinor)[0] : '?';


    // Resolves promises then push pushes meta data into ghost_head
    var url = urlHelper.call(self, {hash: {absolute: true}}),
        metaDescription = meta_description.call(self),
        metaTitle = meta_title.call(self),
        cover = null,
        authorImage =  null,
        publishedDate, modifiedDate,
        tags = tagsHelper.call(self.post, {hash: {autolink: 'false'}}).string.split(','),
        card = 'summary',
        type, authorUrl;

      if (self.post) {
        cover = imageHelper.call(self.post, {hash: {absolute:true}});

        if (self.post.author) {
          authorImage = imageHelper.call(self.post.author, {hash: {absolute:true}});
        }
      }

    if (!metaDescription && self.post) {
        metaDescription = excerpt.call(self.post, {hash: {words: '40'}}).string;
    }
    if (tags[0] !== '') {
        keywords = handlebars.Utils.escapeExpression(tagsHelper.call(self.post, {hash: {autolink: 'false', seperator: ', '}}).string);
    }
    head.push('<link rel="canonical" href="' + url + '" />');

    if (self.pagination) {
        //trimmedUrl = self.relativeUrl.match(trimmedUrlpattern);
        if (self.pagination.prev) {
            prev = (self.pagination.prev > 1 ? prev = '/page/' + self.pagination.prev + '/' : prev = '/');
            //prev = (trimmedUrl) ? '/' + trimmedUrl + prev : prev;
            head.push('<link rel="prev" href="' +  SettingsStore.getSiteUrl() + prev + '" />');
        }
        if (self.pagination.next) {
            next = '/page/' + self.pagination.next + '/';
            //next = (trimmedUrl) ? '/' + trimmedUrl + next : next;
            head.push('<link rel="next" href="' +  SettingsStore.getSiteUrl() + next + '" />');
        }
    }

    // Test to see if we are on a post page and that Structured data has not been disabled in config.js
    if (self.post && useStructuredData) {
        publishedDate = moment(self.post.published_at).toISOString();
        modifiedDate = moment(self.post.updated_at).toISOString();

        if (cover) {
            card = 'summary_large_image';
        }

        // escaped data
        metaTitle = handlebars.Utils.escapeExpression(metaTitle);
        metaDescription = handlebars.Utils.escapeExpression(metaDescription + '...');
        authorUrl = '';
        if (self.post && self.post.author) {
          authorUrl = handlebars.Utils.escapeExpression(blog.url + '/author/' + self.post.author.slug);
        }

        schema = {
            '@context': 'http://schema.org',
            '@type': 'Article',
            publisher: title,
            author: {
                '@type': 'Person',
                name: self.post.author.name,
                image: authorImage,
                url: authorUrl,
                sameAs: self.post.author.website
            },
            headline: metaTitle,
            url: url,
            datePublished: publishedDate,
            dateModified: modifiedDate,
            image: cover,
            keywords: keywords,
            description: metaDescription
        };

        structuredData = {
            'og:site_name': title,
            'og:type': 'article',
            'og:title': metaTitle,
            'og:description': metaDescription,
            'og:url': url,
            'og:image': cover,
            'article:published_time': publishedDate,
            'article:modified_time': modifiedDate,
            'article:tag': tags,
            'twitter:card': card,
            'twitter:title': metaTitle,
            'twitter:description': metaDescription,
            'twitter:url': url,
            'twitter:image:src': cover
        };
        head.push('');
        _.each(structuredData, function (content, property) {
            if (property === 'article:tag') {
                _.each(tags, function (tag) {
                    if (tag !== '') {
                        tag = handlebars.Utils.escapeExpression(tag.trim());
                        head.push('<meta property="' + property + '" content="' + tag + '" />');
                    }
                });
                head.push('');
            } else if (content !== null && content !== undefined) {
                type = property.substring(0, 7) === 'twitter' ? 'name' : 'property';
                head.push('<meta ' + type + '="' + property + '" content="' + content + '" />');
            }
        });
        head.push('');
        head.push('<script type="application/ld+json">\n' + JSON.stringify(schema, null, '    ') + '\n    </script>\n');
    }

    head.push('<meta name="generator" content="Ghost ' + trimmedVersion + '" />');
    head.push('<link rel="alternate" type="application/rss+xml" title="' +
        title  + '" href="' + SettingsStore.getSiteUrl() + '/rss" />');
    head.push(utils.stylesheetTemplate({
        source: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/default.min.css',
        version: ''
    }));

    var headString = _.reduce(head, function (memo, item) { return memo + '\n    ' + item; }, '');
    return new handlebars.SafeString(headString.trim());
};

module.exports = ghost_head;
