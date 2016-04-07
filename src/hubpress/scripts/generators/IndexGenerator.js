const Q = require('q');
import PaginationGenerator from './PaginationGenerator';

class IndexGenerator {

  constructor() {
    this.name = 'index';
  }

  generate(params) {
    console.info('IndexGenerator - generate');
    console.log('IndexGenerator - generate', params);
    let defer = Q.defer();

    PaginationGenerator.generate({posts: params.posts, template: 'index', path: ''})
    .then((publishedPostArray) => {
      defer.resolve(publishedPostArray);
    })
    .catch((err) => {
      defer.reject(err);
    });

    return defer.promise;
  }
}

export default new IndexGenerator();
