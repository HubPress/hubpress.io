// # Has Helper
// Usage: `{{#has tag="video, music"}}`, `{{#has author="sam, pat"}}`
//
// Checks if a post has a particular property

var _               = require('lodash'),
    has;

has = function (options) {
    options = options || {};
    options.hash = options.hash || {};

    var tags = _.pluck(this.tags, 'name'),
        author = this.author ? this.author.name : null,
        tagList = options.hash.tag || false,
        authorList = options.hash.author || false,
        tagsOk,
        authorOk;

    function evaluateTagList(expr, tags) {
        return expr.split(',').map(function (v) {
            return v.trim();
        }).reduce(function (p, c) {
            return p || (_.findIndex(tags, function (item) {
                // Escape regex special characters
                item = item.replace(/[\-\/\\\^$*+?.()|\[\]{}]/g, '\\$&');
                item = new RegExp('^' + item + '$', 'i');
                return item.test(c);
            }) !== -1);
        }, false);
    }

    function evaluateAuthorList(expr, author) {
        var authorList =  expr.split(',').map(function (v) {
            return v.trim().toLocaleLowerCase();
        });

        return _.contains(authorList, author.toLocaleLowerCase());
    }

    if (!tagList && !authorList) {
        console.warn('Invalid or no attribute given to has helper');
        return;
    }

    tagsOk = tagList && evaluateTagList(tagList, tags) || false;
    authorOk = authorList && evaluateAuthorList(authorList, author) || false;

    if (tagsOk || authorOk) {
        return options.fn(this);
    }
    return options.inverse(this);
};

module.exports = has;
