var templates     = {},
handlebars           = require('handlebars');

// ## Template utils
function logAndThrowError(err) {
  console.log(err);
  throw new Error(err);
}
// Execute a template helper
// All template helpers are register as partial view.
templates.execute = function (name, context) {
    var partial = handlebars.partials[name];

    if (partial === undefined) {
      var err = 'Template ' + name + ' not found.';
      console.log(err);
      throw new Error(err);
      return;
    }

    // If the partial view is not compiled, it compiles and saves in handlebars

    if (typeof partial === 'string') {
        partial = handlebars.compile(partial);
    }

    return new handlebars.SafeString(partial(context));
};

module.exports = templates;
