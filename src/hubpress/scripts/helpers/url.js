// # URL helper
// Usage: `{{url}}`, `{{url absolute="true"}}`
//
// Returns the URL for the current object scope i.e. If inside a post scope will return post permalink
// `absolute` flag outputs absolute URL, else URL is relative

import SettingsStore from '../stores/SettingsStore';
var url;

function isPost(jsonData) {
  return jsonData.hasOwnProperty('html') &&
  jsonData.hasOwnProperty('title');
}

url = function (options) {
    var absolute = options && options.hash.absolute;

    if (isPost(this)) {
      var postUrl = '';

      if (absolute) {
        postUrl = SettingsStore.getSiteUrl();
      }
      postUrl += this.url;
      return postUrl;
    }

    // if (schema.isTag(this)) {
    //     return config.urlFor('tag', {tag: this}, absolute);
    // }
    //
    // if (schema.isUser(this)) {
    //     return config.urlFor('author', {author: this}, absolute);
    // }

    return absolute ? SettingsStore.getSiteUrl() + this.relativeUrl : this.relativeUrl;
};

module.exports = url;
