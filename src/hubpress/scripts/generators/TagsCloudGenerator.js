let Q = require('q');

class TagsCloudGenerator {

  constructor() {
  }

  generate(posts, modifiedPost) {
    let defer = Q.defer();

    (() => {
      console.log('generate cloud');
      // TODO Generate cloud partials from the partials of the theme
      defer.resolve();
    })()

    return defer.promise;
  }
}

export default new TagsCloudGenerator();
