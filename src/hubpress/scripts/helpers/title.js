// # Title Helper
// Usage: `{{title}}`
//
// Overrides the standard behaviour of `{[title}}` to ensure the content is correctly escaped

var handlebars             = require('handlebars'),
    title;

title = function () {
    return new handlebars.SafeString(handlebars.Utils.escapeExpression(this.title || ''));
};

module.exports = title;
