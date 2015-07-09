// # Asset helper
// Usage: `{{asset "css/screen.css"}}`, `{{asset "css/screen.css" ghost="true"}}`
//
// Returns the path to the specified asset. The ghost flag outputs the asset path for the Ghost admin

import SettingsStore from '../stores/SettingsStore';
import ThemeStore from '../stores/ThemeStore';
var handlebars      = require('handlebars');
var utils           = require('./utils');
var asset;

asset = function (context, options) {
    var output = '',
        isAdmin = options && options.hash && options.hash.ghost;

    output += SettingsStore.getThemeUrl(ThemeStore.getThemeName()) + '/';

    if (!context.match(/^favicon\.ico$/) && !context.match(/^asset/)) {
      output += 'assets/';
    }

    // Get rid of any leading slash on the context
    context = context.replace(/^\//, '');
    output += context;

    if (!context.match(/^favicon\.ico$/)) {
        output = utils.assetTemplate({
            source: output,
            version: ThemeStore.getThemeVersion()
        });
    }

    return new handlebars.SafeString(output);
};

module.exports = asset;
