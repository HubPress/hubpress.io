// # Encode Helper
//
// Usage:  `{{encode uri}}`
//
// Returns URI encoded string

var handlebars = require('handlebars'),
    encode;

encode = function (context, str) {
    var uri = context || str;
    return new handlebars.SafeString(encodeURIComponent(uri));
};

module.exports = encode;
