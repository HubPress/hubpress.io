// # Excerpt Helper
// Usage: `{{excerpt}}`, `{{excerpt words="50"}}`, `{{excerpt characters="256"}}`
//
// Attempts to remove all HTML from the string, and then shortens the result according to the provided option.
//
// Defaults to words="50"

var handlebars             = require('handlebars'),
    _               = require('lodash'),
    downsize        = require('downsize'),
    excerpt;

excerpt = function (options) {
    var truncateOptions = (options || {}).hash || {},
        result,
        excerpt;

    truncateOptions = _.pick(truncateOptions, ['words', 'characters']);
    _.keys(truncateOptions).map(function (key) {
        truncateOptions[key] = parseInt(truncateOptions[key], 10);
    });

    /*jslint regexp:true */
    excerpt = String(this.html);
    // Strip inline and bottom footnotes
    excerpt = excerpt.replace(/<a href="#fn.*?rel="footnote">.*?<\/a>/gi, '');
    excerpt = excerpt.replace(/<div class="footnotes"><ol>.*?<\/ol><\/div>/, '');
    // Strip other html
    excerpt = excerpt.replace(/<\/?[^>]+>/gi, '');
    excerpt = excerpt.replace(/(\r\n|\n|\r)+/gm, ' ');
    /*jslint regexp:false */

    if (!truncateOptions.words && !truncateOptions.characters) {
        truncateOptions.words = 50;
    }

    result = downsize(excerpt, truncateOptions);

    /* Fix CJK language */
    // TODO It's a fast workaround maybe find a better solution / 7 = average letters by words
    if (!truncateOptions.characters && result.length > truncateOptions.words*7) {
      truncateOptions.characters = truncateOptions.words*7;
      delete truncateOptions.words;
      result = downsize(excerpt, truncateOptions);
    }

    return new handlebars.SafeString(
        downsize(excerpt, truncateOptions)
    );
};

module.exports = excerpt;
