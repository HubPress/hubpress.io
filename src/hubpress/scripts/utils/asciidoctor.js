let asciidoctor = require('asciidoctor.js')();
let opal = asciidoctor.Opal;
let processor = asciidoctor.Asciidoctor();

let options = opal.hash2(
  ['safe', 'attributes'],
{safe: 'unsafe', attributes: ['showtitle!','imagesdir=/images', 'icons=font']});

function splitMore(asciidocContent) {
  let parts = asciidocContent.split('pass::[more]');
  return {
    excerpt: parts[0],
    full: parts.join('')
  }
}

module.exports = {
  convert: function(asciidocContent) {
    let parts = splitMore(asciidocContent);
    let excerpt = processor.$load(parts.excerpt, options);
    let doc = processor.$load(parts.full, options);
    let value = {
      attributes: doc.attributes,
      excerpt: excerpt.$convert(),
      html: doc.$convert()
    }
    return value;
  }
}
