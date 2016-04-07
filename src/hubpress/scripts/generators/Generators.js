const Q = require('q');
const _ = require('lodash');

// Generator
import IndexGenerator from './IndexGenerator';
import PostGenerator from './PostGenerator';
import PostsGenerator from './PostsGenerator';
import TagsGenerator from './TagsGenerator';

class Generators {

  constructor() {
    this.generators = [];
  }

  register(generator) {
    console.log('Generators - Register generator', generator.constructor.name);
    this.generators.push(generator);
  }

  generate(params) {
    console.info('Generators - generate');
    console.log('Generators - generate', params);
    let defer = Q.defer();
    let buildDefer = Q.defer();
    let promise = buildDefer.promise;
    let elementsToPublish = [];

    this.generators.forEach((generator) => {
      if (!params.generators || _.contains(params.generators, generator.name)) {
        promise = promise.then((values)=> {
          if (values) {
            elementsToPublish = elementsToPublish.concat(values);
          }
          return generator.generate(params);
        });
      }
    });

    promise.then((values) => {
      if (values) {
        elementsToPublish = elementsToPublish.concat(values);
      }

      defer.resolve( _.compact(elementsToPublish));
    })
    .then(() => {
      defer.resolve();
    })
    .catch((err) => {
      defer.reject(err);
    })

    buildDefer.resolve([]);
    return defer.promise;
  }
}

const generators = new Generators();


//generators.register(tagsCloudGenerator);
generators.register(PostGenerator);
generators.register(PostsGenerator);
generators.register(TagsGenerator);
generators.register(IndexGenerator);

export default generators;
