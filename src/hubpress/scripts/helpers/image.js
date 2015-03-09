
// Usage: `{{image}}`, `{{image absolute="true"}}`
//
// Returns the URL for the current object scope i.e. If inside a post scope will return image permalink
// `absolute` flag outputs absolute URL, else URL is relative.
import SettingsStore from '../stores/SettingsStore';
var image;

image = function (options) {
    var absolute = options && options.hash.absolute;
    var url;
    if (this.image) {
      url = this.image;
      //return config.urlFor('image', {image: this.image}, absolute);
      if (!/^(f|ht)tps?:\/\//i.test(this.image)) {
        url =  SettingsStore.getImagesUrl() + '/' + url;
      }
      return url;
    }
};

module.exports = image;
