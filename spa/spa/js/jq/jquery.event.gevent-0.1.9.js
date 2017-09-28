/*
 * jQuery global custom event plugin (gevent)
 *
 * Copyright (c) 2013 Michael S. Mikowski
 * (mike[dot]mikowski[at]gmail[dotcom])
 *
 * Dual licensed under the MIT or GPL Version 2
 * http://jquery.org/license
 *
 * Versions
 *  0.1.5 - initial release
 *  0.1.6 - enhanced publishEvent (publish) method pass
 *          a non-array variable as the second argument
 *          to a subscribed function (the first argument
 *          is always the event object).
 *  0.1.7
 *  0.1.8
 *  0.1.9 - documentation changes
 *
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global jQuery */

(function ( $ ) {
  'use strict';
  $.gevent = ( function () {
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
      subscribeEvent, publishEvent, unsubscribeEvent,
      $customSubMap = {}
      ;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN PUBLIC METHODS -------------------
    // BEGIN public method /publishEvent/
    // Example  :
    //   $.gevent.publish(
    //     'spa-model-msg-receive',
    //     [ { user : 'fred', msg : 'Hi gang' } ]
    //   );
    // Purpose  :
    //   Publish an event with an optional list of arguments
    //   which a subscribed handler will receive after the event object.
    // Arguments (positional)
    //   * 0 ( event_name )  - The global event name
    //   * 2 ( data )        - Optional data to be passed as argument(s)
    //                         to subscribed functions after the event
    //                         object. Provide an array for multiple
    //                         arguments.
    // Throws   : none
    // Returns  : none
    //
    publishEvent = function ( event_name, data ) {
      var data_list;

      if ( ! $customSubMap[ event_name ] ){ return false; }

      if ( data ){
        data_list = Array.isArray( data ) ? data : [ data ];
        $customSubMap[ event_name ].trigger( event_name, data_list );
        return true;
      }

      $customSubMap[ event_name ].trigger( event_name );
      return true;
    };
    // END public method /publishEvent/

    // BEGIN public method /subscribeEvent/
    // Example  :
    //   $.gevent.subscribe(
    //     $( '#msg' ),
    //     'spa-msg-receive',
    //     onModelMsgReceive
    //   );
    // Purpose  :
    //   Subscribe a function to a published event on a jQuery collection
    // Arguments (positional)
    //   * 0 ( $collection ) - The jQuery collection on which to bind event
    //   * 1 ( event_name )  - The global event name
    //   * 2 ( fn ) - The function to bound to the event on the collection
    // Throws   : none
    // Returns  : none
    //
    subscribeEvent = function ( $collection, event_name, fn ) {
      $collection.on( event_name, fn );

      if ( ! $customSubMap[ event_name ] ) {
        $customSubMap[ event_name ] = $collection;
      }
      else {
        $customSubMap[ event_name ]
          = $customSubMap[ event_name ].add( $collection );
      }
    };
    // END public method /subscribeEvent/

    // BEGIN public method /unsubscribeEvent/
    // Example  :
    //   $.gevent.unsubscribe(
    //     $( '#msg' ),
    //     'spa-model-msg-receive'
    //   );
    // Purpose  :
    //   Remove a binding for the named event on a provided collection
    // Arguments (positional)
    //   * 0 ( $collection ) - The jQuery collection on which to bind event
    //   * 1 ( event_name )  - The global event name
    // Throws   : none
    // Returns  : none
    //
    unsubscribeEvent = function ( $collection, event_name ) {
      if ( ! $customSubMap[ event_name ] ){ return false; }

      $customSubMap[ event_name ]
        = $customSubMap[ event_name ].not( $collection );

      if ( $customSubMap[ event_name ].length === 0 ){
        delete $customSubMap[ event_name ];
      }

      return true;
    };
    // END public method /unsubscribeEvent/
    //------------------- END PUBLIC METHODS ---------------------

    // return public methods
    return {
      publish     : publishEvent,
      subscribe   : subscribeEvent,
      unsubscribe : unsubscribeEvent
    };
  }());
}( jQuery ));

