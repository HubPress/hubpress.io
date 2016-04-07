let Handlebars = require('handlebars');

(function(handlebars) {

  'use strict';

  let getBlocks = function (context, name) {
    let blocks = context._blocks;
    return blocks[name] || (blocks[name] = []);
  };

  handlebars.registerHelper({
    extend: function (partial, options) {
      let context = Object.create(this);
      let template = handlebars.partials[partial];

      // Partial template required
      if (template == null) {
        throw new Error('Missing layout partial: \'' + partial + '\'');
      }

      // New block context
      context._blocks = {};

      // Parse blocks and discard output
      options.fn(context);

      // Render final layout partial with revised blocks
      if (typeof template !== 'function') {
        template = handlebars.compile(template);
      }

      // Compile, then render
      return template(context);
    },

    append: function (name, options) {
      getBlocks(this, name).push({
        should: 'append',
        fn: options.fn
      });
    },

    prepend: function (name, options) {
      getBlocks(this, name).push({
        should: 'prepend',
        fn: options.fn
      });
    },

    replace: function (name, options) {
      getBlocks(this, name).push({
        should: 'replace',
        fn: options.fn
      });
    },

    block: function (name, options) {
      let block = null;
      let retval = options.fn(this);
      let blocks = getBlocks(this, name);
      let length = blocks.length;
      let i = 0;

      for (; i < length; i++) {
        block = blocks[i];

        switch (block && block.fn && block.should) {
          case 'append':
            retval = retval + block.fn(this);
            break;

            case 'prepend':
              retval = block.fn(this) + retval;
              break;

              case 'replace':
                retval = block.fn(this);
                break;
              }
            }

            return retval;
          },

          foreach: function(context, options) {
            let ret = "";

            for(let i=0, j=context.length; i<j; i++) {
              ret = ret + options.fn(context[i]);
            }

            return ret;
          }

        });
      })(Handlebars);
