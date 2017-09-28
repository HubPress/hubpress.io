/*
 * Jquery plugin for state managment through the URI anchor (hash fragment)
 *
 * Copyright (c) 2013 Michael S. Mikowski
 * (mike[dot]mikowski[at]gmail[dotcom])
 *
 * Dual licensed under the MIT or GPL Version 2
 * http://jquery.org/license
 *
 * Versions
 *  1.1.1-3 - Initial jQuery plugin site releases
 *
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global jQuery */

(function ($) {
  $.uriAnchor = ( function ( ) {
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
      configMap = {
        regex_anchor_clean1 : /^[#!]*/,
        regex_anchor_clean2 : /\?[^?]*$/,
        settable_map_key    : { schema_map : true },
        schema_map          : null
      },

      getErrorReject,   getVarType,       getCleanAnchorString,
      parseStringToMap, makeAnchorString, setAnchor,
      makeAnchorMap,    configModule
      ;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    getErrorReject = function ( message  ) {
      var error     = new Error();
      error.name    = 'Anchor Schema Reject';
      error.message = message;
      return error;
    };

    // Begin public method /getVarType/
    // Returns 'Object', 'Array', 'String', 'Number', 'Boolean', 'Undefined'
    getVarType = function ( data  ) {
      if ( data === undefined  ) { return 'Undefined'; }
      if ( data === null  ) { return 'Null'; }
      return {}.toString.call( data ).slice( 8, -1 );
    };
    // End public method /getVarType/

    // Begin internal utility to clean bookmark
    getCleanAnchorString = function () {
      return String( document.location.hash )
        // remove any leading pounds or bangs
        .replace( configMap.regex_anchor_clean1 , '' )
        // snip off after question-mark ( a ClickStreet bug )
        .replace( configMap.regex_anchor_clean2 , '' )
        ;
    };
    // End internal utility to clean bookmark

    // Begin internal utility /parseStringToMap/
    parseStringToMap = function ( arg_map  ) {
      var
        input_string    = arg_map.input_string    || '',
        delimit_char    = arg_map.delimit_char    || '&',
        delimit_kv_char = arg_map.delimit_kv_char || '=',
        output_map      = {},

        splitter_array, i, key_val_array
        ;

      splitter_array = input_string.split( delimit_char );

      for ( i = 0; i < splitter_array.length; i++  ) {
        key_val_array = splitter_array[i].split( delimit_kv_char );

        if ( key_val_array.length === 1  ) {
          output_map[decodeURIComponent( key_val_array[0] )] = true;
        }
        else if ( key_val_array.length === 2  ) {
          output_map[decodeURIComponent( key_val_array[0] )]
            = decodeURIComponent( key_val_array[1] )
            ;
        }
      }
      return output_map;
    };
    // End internal utility /parseStringToMap/

    // Begin utility /makeAnchorString/
    // -- all the heavy lifting for setAnchor ( see below )
    // Converts a map into the anchor component as described
    // in setAnchor
    makeAnchorString = function ( anchor_map_in, option_map_in  ) {
      var
        anchor_map          = anchor_map_in || {},
        option_map          = option_map_in || {},
        delimit_char        = option_map.delimit_char        || '&',
        delimit_kv_char     = option_map.delimit_kv_char     || '=',
        sub_delimit_char    = option_map.sub_delimit_char    || ':',
        dep_delimit_char    = option_map.dep_delimit_char    || '|',
        dep_kv_delimit_char = option_map.dep_kv_delimit_char || ',',
        schema_map         = configMap.schema_map,
        key_val_array       = [],

        schema_map_val, schema_map_dep, schema_map_dep_val,
        key_name, key_value, class_name, output_kv_string,
        sub_key_name, dep_map, dep_key_name, dep_key_value,
        dep_class_name,

        dep_kv_array
        ;

      if ( getVarType( anchor_map ) !== 'Object' ) {
        return false;
      }

      for ( key_name in anchor_map  ) {
        // filter out inherited properties
        if ( anchor_map.hasOwnProperty( key_name ) ) {

          // skip empty and dependent keys
          if ( ! key_name  ) { continue;}
          if ( key_name.indexOf( '_' ) === 0 ) { continue;}

          // check against anchor schema if provided
          if ( schema_map  ) {
            if ( ! schema_map[key_name] ) {
              throw getErrorReject(
                'Independent key |'
                + key_name + '| not authorized by anchor schema'
              );
            }
          }

          output_kv_string   = '';
          key_value   = anchor_map[key_name];

          if ( key_value === undefined ) { key_value = ''; }

          class_name = getVarType( key_value  );

          // check against anchor schema map of allowable
          // values is provided
          if ( schema_map  ) {
            schema_map_val = schema_map[key_name];
            if ( getVarType( schema_map_val ) === 'Object'
              && ! schema_map_val[String( key_value )]
            ) {
              throw getErrorReject(
                'Independent key-value pair |'
                + key_name + '|' + String( key_value )
                + '| not authorized by anchor schema'
              );
            }
          }

          // Booleans, we skip false
          if ( class_name === 'Boolean'  ) {
            if ( key_value ) { output_kv_string += encodeURIComponent( key_name ); }
          }
          // String and Number
          else {
             output_kv_string
                += encodeURIComponent( key_name )
                +  delimit_kv_char
                +  encodeURIComponent( key_value )
                ;
          }

          sub_key_name = '_' + key_name;
          if ( anchor_map.hasOwnProperty( sub_key_name ) ) {
            dep_map      = anchor_map[sub_key_name];
            dep_kv_array = [];

            if ( schema_map  ) {
              schema_map_dep = schema_map[sub_key_name];
              if ( ! schema_map_dep  ) {
                throw getErrorReject(
                  'Dependent key |' + sub_key_name
                  + '| not authorized by anchor schema'
                );
              }
            }
            else {
              schema_map_dep = null;
            }

            for ( dep_key_name in dep_map  ) {
              if ( dep_map.hasOwnProperty( dep_key_name ) ) {
                dep_key_value = dep_map[dep_key_name];
                dep_class_name = getVarType( dep_key_value  );

                if ( schema_map_dep  ) {
                  schema_map_dep_val = schema_map_dep[dep_key_name];
                  if ( getVarType( schema_map_dep_val ) === 'Object'
                    && ! schema_map_dep_val[String( dep_key_value )]
                  ) {
                    throw getErrorReject(
                      'Dependent key-value pair |'
                      + dep_key_name + '|' + String( dep_key_value )
                      + '| not authorized by anchor schema'
                    );
                  }
                }

                // Booleans, we skip false
                if ( class_name === 'Boolean'  ) {
                  if ( dep_key_value === true  ) {
                    dep_kv_array.push( encodeURIComponent( dep_key_name ));
                  }
                }
                // String and Number
                else {
                  dep_kv_array.push(
                    encodeURIComponent( dep_key_name )
                    + dep_kv_delimit_char
                    + encodeURIComponent( dep_key_value )
                  );
                }
              }
            }
            // append dependent arguments if there are any
            if ( dep_kv_array.length > 0  ) {
              output_kv_string
                += sub_delimit_char + dep_kv_array.join( dep_delimit_char )
              ;
            }
          }
          key_val_array.push( output_kv_string );
        }
      }

      return key_val_array.join( delimit_char );
    };
    // End utility /makeAnchorString/
    //-------------------- END UTILITY METHODS -------------------

    //------------------- BEGIN PUBLIC METHODS -------------------
    // Begin public method /setAnchor/
    // Purpose     :
    //   Sets Anchor component of the URI from a Map
    //   (The Anchor component is also known as the
    //   'hash fragment' or 'bookmark component')
    // Arguments  : positional -
    //   * 1 ( anchor_map )   : The map to be encoded to the URI anchor
    //   * 2 ( option_map )   : map of options
    //   * 3 ( replace_flag )  : boolean flag to replace the URI
    //     When true, the URI is replaced, which means the prior URI
    //     is not entered into the browser history
    // Environment : Expects the document.location browser object
    // Settings    : none
    // Returns     : boolean: true on success, false on failure
    // Throws      : none
    // Discussion  :
    //
    //  The first positional argument, anchor_map, may be a simple map:
    //    $.uriAnchor.setAnchor({
    //      page   : 'profile',
    //      slider : 'confirm',
    //      color  : 'red'
    //    });
    //
    //  This changes the URI anchor to:
    //     #!page=profile&slider=confirm&color=red
    //
    //  All these arguments are independent, that is, they can vary
    //  independent of each other. We also support dependent values -
    //  values that depend on others.
    //
    //  An independent argument key has no '_' prefix.  The same key name,
    //  prefixed by an '_', holds the arguments that are dependent on
    //  an independent argument.  The dependent key always points
    //  to a map.  Consider:
    //
    //    $.uriAnchor.setAnchor({
    //      page   : 'profile',
    //      _page  : {
    //        uname   : 'wendy',
    //        online  : 'today'
    //      }
    //    });
    //
    //  This changes the URI Anchor to:
    //    #!page=profile:uname,wendy|online,today
    //
    //  Only independent keys and their matching dependent keys are
    //  processed.  All other keys are ignored.  Importantly, this includes
    //  keys of the form _s_/key/ ( e.g. '_s_page' ) returned by makeAnchorMap
    //
    //  Setting a more complex anchor map is illustrated below:
    //    $.uriAnchor.setAnchor({
    //      page : 'profile',
    //      _page : {
    //        uname   : 'wendy',
    //        online  : 'today'
    //      },
    //      slider  : 'confirm',
    //      _slider : {
    //       text   : 'hello',
    //       pretty : false
    //      },
    //      color : 'red'
    //    });
    //
    //  This sets the URI Anchor to:
    //     #!page=profile:uname,wendy|online,today&slider=confirm:text,hello\
    //       |pretty,false&color=red
    //
    //   Options: The second positional argument tp this method, option_map,
    //   provides a number of options for delimiters:
    //     * delimit_char     : delimiter independent args
    //       Defaults to '&'
    //     * delimit_kv_char  : delimiter key-value of independent args
    //       Defaults to '='
    //     * sub_delimit_char : delimiter independent and dependent args
    //       Defaults to ':'
    //     * dep_delimit_char : delimiter between key-value of dependent args
    //       Defaults to '|'
    //     * dep_kv_delimit_char : key-value delimiter for dependent args.
    //       Defaults to ','
    //
    //   Boolean values ( as part of a key-value pair ) are convert into
    //     the stings 'true' or 'false'.
    //
    //  Validation:
    //
    //  As of 1.0, the ability to optionally check the validity of the
    //  Anchor against a schema has been included.  Since we don't expect
    //  the allowable schema to change during run-time, we use a
    //  module configuration to set the schema, like so:
    //
    //    $uriAnchor.configModule({
    //      schema_map : {
    //        page    : { profile : true, pdf : true },
    //        _page   : {
    //          uname   : true,
    //          online  : { 'today','yesterday','earlier' }
    //        },
    //        slider  : { confirm : 'deny' },
    //        _slider : { text : 'goodbye' },
    //        color   : { red : true, green : true, blue : true }
    //      }
    //    });
    //
    //  This check occurs only during setting of the Anchor, not
    //  during its parsing ( See makeAnchorMap )
    //
    //  The replace_flag instructs the routine to replace the uri,
    //  discarding browser history
    //
    setAnchor = function ( anchor_map, option_map, replace_flag  ) {
      var
        anchor_string = makeAnchorString( anchor_map, option_map  ),
        uri_array, uri_string
        ;

      uri_array = document.location.href.split( '#',2 );
      uri_string = anchor_string
        ? uri_array[0] + '#!' + anchor_string : uri_array[0]
        ;

      if ( replace_flag  ) {
        if ( anchor_string  ) {
          document.location.replace( uri_array[0] + '#!' + anchor_string );
        }
        else {
          document.location.replace( uri_array[0] );
        }
        return true;
      }
      // we replace the full href so that jquery recognizes the uri
      // change
      document.location.href = uri_string;
    };
    // End public method /setAnchor/

    // Begin public method /makeAnchorMap/
    // Purpose     : Parses URI anchor and returns as map
    // Arguments  : none
    // Environment : Expects the document.location browser object
    // Settings    : none
    // Returns     : Map
    // Throws      : none
    //
    // Discussion :
    //   Parses the browser URI anchor into a map using the same
    //   rules used to set the anchor in the method setAnchor
    //   ( see above ).
    //
    //   This method creates an additional key type, _s_<indendent_arg>
    //   for each independent argument with dependent arguments.
    //
    //   These keys point to a string representation of the independent
    //   argument along with all its dependent arguments.
    //
    //   These values are ignored by setAnchor, but they are useful
    //   for routines using setAnchor to check if a part of the anchor
    //   has changed.
    //
    // Example:
    //   If the browser URI Anchor looks like this:
    //     #!page=profile:uname,wendy|online,true&slider=confirm:text,hello\
    //     |pretty,false&color=red
    //
    //   Then calling $.uriAnchor.makeAnchorMap();
    //   will return a map that looks like so:
    //
    //     { page : 'profile',
    //       _page : {
    //         uname   : 'wendy',
    //         online  : 'today'
    //       },
    //       _s_page : 'profile:uname,wendy|online,today',
    //       slider  : 'confirm',
    //       _slider : {
    //        text   : 'hello',
    //        pretty : false
    //       },
    //       _s_slider : 'confirm:text,hello|pretty,false',
    //       color : 'red'
    //     };
    //

    makeAnchorMap = function () {
      var
        anchor_string = getCleanAnchorString(),
        anchor_map, idx, keys_array, key_name, key_value, dep_array
        ;

      if ( anchor_string === ''  ) { return {}; }

      // first pass decompose
      anchor_map = parseStringToMap({
        input_string     : anchor_string,
        delimit_char     : '&',
        delimit_kv_char  : '='
      });

      // extract keys to prevent run-away recursion when
      // adding keys to anchor_map, below
      keys_array = [];
      for ( key_name in anchor_map  ) {
        if ( anchor_map.hasOwnProperty( key_name ) ) {
          keys_array.push( key_name );
        }
      }

      for ( idx = 0; idx < keys_array.length; idx++  ) {
        key_name  = keys_array[idx];
        key_value = anchor_map[key_name];

        if ( getVarType( key_value ) !== 'String' || key_name === ''
        ) { continue; }

        // include string representation with all dependent keys and values
        anchor_map[ '_s_' + key_name ] = key_value;

        dep_array = key_value.split( ':' );

        if ( dep_array[1] && dep_array[1] !== '' ) {
          anchor_map[key_name] = dep_array[0];

          anchor_map[ '_' + key_name ] = parseStringToMap({
            input_string    : dep_array[1],
            delimit_char    : '|',
            delimit_kv_char : ','
          });
        }
      }
      return anchor_map;
    };
    // End public method /makeAnchorMap/

    // Begin public method /configModule/
    // Set configuration options
    configModule = function ( arg_map  ) {
      var
        settable_map = configMap.settable_map_key,
        key_name, error
        ;

      for ( key_name in arg_map ) {
        if ( arg_map.hasOwnProperty( key_name )) {
          if ( settable_map.hasOwnProperty( key_name )) {
            configMap[key_name] = arg_map[key_name];
          }
          else {
            error         = new Error();
            error.name    = 'Bad Input';
            error.message = 'Setting config key |'
              + key_name + '| is not supported';
            throw error;
          }
        }
      }
    };
    // End public method /configModule/

    // return public methods
    return {
      configModule     : configModule,
      getVarType       : getVarType,
      makeAnchorMap   : makeAnchorMap,
      makeAnchorString : makeAnchorString,
      setAnchor        : setAnchor
    };
    //------------------- END PUBLIC METHODS ---------------------
  }());
} ( jQuery ));
