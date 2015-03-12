// # Ghost Foot Helper
// Usage: `{{ghost_foot}}`
//
// Outputs scripts and other assets at the bottom of a Ghost theme
//
// We use the name ghost_foot to match the helper for consistency:
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var handlebars             = require('handlebars'),
    _               = require('lodash'),
    utils           = require('./utils'),
    ghost_foot;

ghost_foot = function (options) {
    /*jshint unused:false*/
    var foot = [];

    foot.push(utils.scriptTemplate({
        source: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js',
        version: ''
    }));
    foot.push(utils.scriptTemplate({
        source: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment-with-locales.min.js',
        version: ''
    }));
    foot.push(
      `
      <script type="text/javascript">
        jQuery('ago.ago').each(function(){
          var element = jQuery(this).parent();
          element.html( moment(element.text()).fromNow());
        });
      </script>
      `

    );


    var footString = _.reduce(foot, function (memo, item) { return memo + ' ' + item; }, '');
    return new handlebars.SafeString(footString.trim());
};

module.exports = ghost_foot;
