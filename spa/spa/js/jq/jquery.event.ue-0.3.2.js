/*
 * Jquery plugin for unified mouse and touch events
 *
 * Copyright (c) 2013 Michael S. Mikowski
 * (mike[dot]mikowski[at]gmail[dotcom])
 *
 * Dual licensed under the MIT or GPL Version 2
 * http://jquery.org/license
 *
 * Versions
 *  0.3.0 - Initial jQuery plugin site release
 *        - Replaced scrollwheel zoom with drag motion.
 *          This resolved a conflict with scrollable areas.
 *  0.3.1 - Change for jQuery plugins site
 *  0.3.2 - Updated to jQuery 1.9.1.
 *          Confirmed 1.7.0-1.9.1 compatibility.
 *
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,  plusplus : true,    regexp  : true,
  sloppy : true,      vars : true,     white  : true
*/
/*global jQuery, sl */

(function ( $ ) {
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    $Special        = $.event.special,  // shortcut for special event
    motionMapMap    = {},         // map of pointer motions by cursor
    isMoveBound     = false,      // flag if move handlers bound
    pxPinchZoom     = -1,         // distance between pinch-zoom points
    optionKey       = 'ue_bound', // data key for storing options
    doDisableMouse  = false,      // flag to discard mouse input
    defaultOptMap   = {           // Default option hash
      bound_ns_map  : {},         // namspace hash e.g. bound_ns_map.utap.fred
      wheel_ratio   : 15,         // multiplier for mousewheel delta
      px_radius     : 3,          // 'distance' dragged before dragstart
      ignore_class  : ':input',   // 'not' suppress matching elements
      tap_time      : 200,        // millisecond max time to consider tap
      held_tap_time : 300         // millisecond min time to consider taphold
    },
    callbackList  = [],           // global callback stack
    zoomMouseNum  = 1,            // multiplier for mouse zoom
    zoomTouchNum  = 4,            // multiplier for touch zoom

    boundList, Ue,
    motionDragId,  motionHeldId, motionDzoomId,
    motion1ZoomId, motion2ZoomId,

    checkMatchVal, removeListVal,  pushUniqVal,   makeListPlus,
    fnHeld,        fnMotionStart,  fnMotionMove,
    fnMotionEnd,   onMouse,        onTouch,
    onMousewheel
    ;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // Begin utiltity /makeListPlus/
  // Returns an array with much desired methods:
  //   * remove_val(value) : remove element that matches
  //     the provided value. Returns number of elements
  //     removed.
  //   * match_val(value)  : shows if a value exists
  //   * push_uniq(value)  : pushes a value onto the stack
  //     iff it does not already exist there
  // Note: the reason I need this is to compare objects to
  //   objects (perhaps jQuery has something similar?)
  checkMatchVal = function ( data ) {
    var match_count = 0, idx;
    for ( idx = this.length; idx; 0 ) {
      if ( this[--idx] === data ) { match_count++; }
    }
    return match_count;
  };
  removeListVal = function ( data ) {
    var removed_count = 0, idx;
    for ( idx = this.length; idx; 0 ) {
      if ( this[--idx] === data ) {
        this.splice(idx, 1);
        removed_count++;
        idx++;
      }
    }
    return removed_count;
  };
  pushUniqVal = function ( data ) {
    if ( checkMatchVal.call(this, data ) ) { return false; }
    this.push( data );
    return true;
  };
  // primary utility
  makeListPlus = function ( input_list ) {
    if ( input_list && $.isArray(input_list) ) {
      if ( input_list.remove_val ) {
        console.warn( 'The array appears to already have listPlus capabilities' );
        return input_list;
      }
    }
    else {
      input_list = [];
    }
    input_list.remove_val = removeListVal;
    input_list.match_val  = checkMatchVal;
    input_list.push_uniq  = pushUniqVal;

    return input_list;
  };
  // End utility /makeListPlus/
  //-------------------- END UTILITY METHODS -------------------

  //--------------- BEGIN JQUERY SPECIAL EVENTS ----------------
  // Unique array for bound objects
  boundList = makeListPlus();

  // Begin define special event handlers
  Ue = {
    setup : function( data, a_names, fn_bind ) {
      var
        elem_this = this,
        $to_bind  = $(elem_this),
        seen_map    = {},
        option_map, idx, namespace_key, ue_namespace_code, namespace_list
        ;

      // if previous related event bound do not rebind, but do add to
      // type of event bound to this element, if not already noted
      if ( $.data( this, optionKey ) ) { return; }

      option_map = {};
      $.extend( true, option_map, defaultOptMap );
      $.data( elem_this, optionKey, option_map );

      namespace_list = makeListPlus(a_names.slice(0));
      if ( ! namespace_list.length 
        || namespace_list[0] === ""
      ) { namespace_list = ["000"]; }

      NSPACE_00:
      for ( idx = 0; idx < namespace_list.length; idx++ ) {
        namespace_key = namespace_list[idx];

        if ( ! namespace_key ) { continue NSPACE_00; }
        if ( seen_map.hasOwnProperty(namespace_key) ) { continue NSPACE_00; }

        seen_map[namespace_key] = true;

        ue_namespace_code = '.__ue' + namespace_key;

        $to_bind.bind( 'mousedown'  + ue_namespace_code, onMouse  );
        $to_bind.bind( 'touchstart' + ue_namespace_code, onTouch );
        $to_bind.bind( 'mousewheel' + ue_namespace_code, onMousewheel );
      }

      boundList.push_uniq( elem_this ); // record as bound element

      if ( ! isMoveBound ) {
        // console.log('first element bound - adding global binds');
        $(document).bind( 'mousemove.__ue', onMouse  );
        $(document).bind( 'touchmove.__ue', onTouch  );
        $(document).bind( 'mouseup.__ue'  , onMouse  );
        $(document).bind( 'touchend.__ue' , onTouch  );
        isMoveBound = true;
      }
    },

    // arg_map.type = string - name of event to bind
    // arg_map.data = poly - whatever (optional) data was passed when binding
    // arg_map.namespace = string - A sorted, dot-delimited list of namespaces
    //   specified when binding the event
    // arg_map.handler  = fn - the event handler the developer wishes to be bound
    //   to the event.  This function should be called whenever the event
    //   is triggered
    // arg_map.guid = number - unique ID for event handler, provided by jQuery
    // arg_map.selector = string - selector used by 'delegate' or 'live' jQuery
    //   methods.  Only available when these methods are used.
    //
    // this - the element to which the event handler is being bound
    // this always executes immediate after setup (if first binding)
    add : function ( arg_map ) {
      var
        elem_this       = this,
        option_map      = $.data( elem_this, optionKey ),
        namespace_str   = arg_map.namespace,
        event_type      = arg_map.type,
        bound_ns_map, namespace_list, idx, namespace_key
        ;
      if ( ! option_map ) { return; }

      bound_ns_map  = option_map.bound_ns_map;

      if ( ! bound_ns_map[event_type] ) {
        // this indicates a non-namespaced entry
        bound_ns_map[event_type] = {};
      }

      if ( ! namespace_str ) { return; }

      namespace_list = namespace_str.split('.');

      for ( idx = 0; idx < namespace_list.length; idx++ ) {
        namespace_key = namespace_list[idx];
        bound_ns_map[event_type][namespace_key] = true;
      }
    },

    remove : function ( arg_map ) {
      var
        elem_bound     = this,
        option_map     = $.data( elem_bound, optionKey ),
        bound_ns_map   = option_map.bound_ns_map,
        event_type     = arg_map.type,
        namespace_str  = arg_map.namespace,
        namespace_list, idx, namespace_key
        ;

      if ( ! bound_ns_map[event_type] ) { return; }

      // No namespace(s) provided:
      // Remove complete record for custom event type (e.g. utap)
      if ( ! namespace_str ) {
        delete bound_ns_map[event_type];
        return;
      }

      // Namespace(s) provided:
      // Remove namespace flags from each custom event typei (e.g. utap)
      // record.  If all claimed namespaces are removed, remove
      // complete record.
      namespace_list = namespace_str.split('.');

      for ( idx = 0; idx < namespace_list.length; idx++ ) {
        namespace_key = namespace_list[idx];
        if (bound_ns_map[event_type][namespace_key]) {
          delete bound_ns_map[event_type][namespace_key];
        }
      }

      if ( $.isEmptyObject( bound_ns_map[event_type] ) ) {
        delete bound_ns_map[event_type];
      }
    },

    teardown : function( a_names ) {
      var
        elem_bound   = this,
        $bound       = $(elem_bound),
        option_map   = $.data( elem_bound, optionKey ),
        bound_ns_map = option_map.bound_ns_map,
        idx, namespace_key, ue_namespace_code, namespace_list
        ;

      // do not tear down if related handlers are still bound
      if ( ! $.isEmptyObject( bound_ns_map ) ) { return; }

      namespace_list = makeListPlus(a_names);
      namespace_list.push_uniq('000');

      NSPACE_01:
      for ( idx = 0; idx < namespace_list.length; idx++ ) {
        namespace_key = namespace_list[idx];

        if ( ! namespace_key ) { continue NSPACE_01; }

        ue_namespace_code = '.__ue' + namespace_key;
        $bound.unbind( 'mousedown'  + ue_namespace_code );
        $bound.unbind( 'touchstart' + ue_namespace_code );
        $bound.unbind( 'mousewheel' + ue_namespace_code );
      }

      $.removeData( elem_bound, optionKey );

      // Unbind document events only after last element element is removed
      boundList.remove_val(this);
      if ( boundList.length === 0 ) {
        // console.log('last bound element removed - removing global binds');
        $(document).unbind( 'mousemove.__ue');
        $(document).unbind( 'touchmove.__ue');
        $(document).unbind( 'mouseup.__ue');
        $(document).unbind( 'touchend.__ue');
        isMoveBound = false;
      }
    }
  };
  // End define special event handlers
  //--------------- BEGIN JQUERY SPECIAL EVENTS ----------------

  //------------------ BEGIN MOTION CONTROLS -------------------
  // Begin motion control /fnHeld/
  fnHeld = function ( arg_map ) {
    var
      timestamp         = +new Date(),
      motion_id    = arg_map.motion_id,
      motion_map   = arg_map.motion_map,
      bound_ns_map = arg_map.bound_ns_map,
      event_ue
      ;

    delete motion_map.idto_tapheld;

    if ( ! motion_map.do_allow_tap ) { return; }

    motion_map.px_end_x     = motion_map.px_start_x;
    motion_map.px_end_y     = motion_map.px_start_y;
    motion_map.ms_timestop  = timestamp;
    motion_map.ms_elapsed   = timestamp - motion_map.ms_timestart;

    if ( bound_ns_map.uheld ) {
      event_ue     = $.Event('uheld');
      $.extend( event_ue, motion_map );
      $(motion_map.elem_bound).trigger(event_ue);
    }

    // remove tracking, as we want no futher action on this motion
    if ( bound_ns_map.uheldstart ) {
      event_ue     = $.Event('uheldstart');
      $.extend( event_ue, motion_map );
      $(motion_map.elem_bound).trigger(event_ue);
      motionHeldId = motion_id;
    }
    else {
      delete motionMapMap[motion_id];
    }
  };
  // End motion control /fnHeld/


  // Begin motion control /fnMotionStart/
  fnMotionStart = function ( arg_map ) {
    var
      motion_id      = arg_map.motion_id,
      event_src      = arg_map.event_src,
      request_dzoom  = arg_map.request_dzoom,

      option_map     = $.data( arg_map.elem, optionKey ),
      bound_ns_map   = option_map.bound_ns_map,
      $target        = $(event_src.target ),
      do_zoomstart   = false,
      motion_map, cb_map, do_allow_tap, event_ue
      ;

    // this should never happen, but it does
    if ( motionMapMap[ motion_id ] ) { return; }

    if ( request_dzoom && ! bound_ns_map.uzoomstart ) { return; }

    // :input selector includes text areas
    if ( $target.is( option_map.ignore_class ) ) { return; }

    do_allow_tap = bound_ns_map.utap
      || bound_ns_map.uheld || bound_ns_map.uheldstart
      ? true : false;

    cb_map = callbackList.pop();

    while ( cb_map ) {
      if ( $target.is( cb_map.selector_str )
        || $( arg_map.elem ).is( cb_map.selector_str )
      ) {
        if ( cb_map.callback_match ) {
          cb_map.callback_match( arg_map );
        }
      }
      else {
        if ( cb_map.callback_nomatch ) {
          cb_map.callback_nomatch( arg_map );
        }
      }
      cb_map = callbackList.pop();
    }

    motion_map = {
      do_allow_tap : do_allow_tap,
      elem_bound   : arg_map.elem,
      elem_target  : event_src.target,
      ms_elapsed   : 0,
      ms_timestart : event_src.timeStamp,
      ms_timestop  : undefined,
      option_map   : option_map,
      orig_target  : event_src.target,
      px_current_x : event_src.clientX,
      px_current_y : event_src.clientY,
      px_end_x     : undefined,
      px_end_y     : undefined,
      px_start_x   : event_src.clientX,
      px_start_y   : event_src.clientY,
      timeStamp    : event_src.timeStamp
    };

    motionMapMap[ motion_id ] = motion_map;

    if ( bound_ns_map.uzoomstart ) {
      if ( request_dzoom ) {
        motionDzoomId = motion_id;
      }
      else if ( ! motion1ZoomId ) {
        motion1ZoomId = motion_id;
      }
      else if ( ! motion2ZoomId ) {
        motion2ZoomId = motion_id;
        event_ue = $.Event('uzoomstart');
        do_zoomstart = true;
      }

      if ( do_zoomstart ) {
        event_ue = $.Event( 'uzoomstart' );
        motion_map.px_delta_zoom = 0;
        $.extend( event_ue, motion_map );
        $(motion_map.elem_bound).trigger(event_ue);
        return;
      }
    }

    if ( bound_ns_map.uheld || bound_ns_map.uheldstart ) {
      motion_map.idto_tapheld = setTimeout(
        function() {
          fnHeld({
            motion_id  : motion_id,
            motion_map   : motion_map,
            bound_ns_map : bound_ns_map
          });
        },
        option_map.held_tap_time
      );
    }
  };
  // End motion control /fnMotionStart/

  // Begin motion control /fnMotionMove/
  fnMotionMove  = function ( arg_map ) {
    var
      motion_id   = arg_map.motion_id,
      event_src   = arg_map.event_src,
      do_zoommove = false,
      motion_map, option_map, bound_ns_map,
      event_ue, px_pinch_zoom, px_delta_zoom,
      mzoom1_map, mzoom2_map
      ;

    if ( ! motionMapMap[motion_id] ) { return; }

    motion_map   = motionMapMap[motion_id];
    option_map   = motion_map.option_map;
    bound_ns_map = option_map.bound_ns_map;

    motion_map.timeStamp    = event_src.timeStamp;
    motion_map.elem_target  = event_src.target;
    motion_map.ms_elapsed   = event_src.timeStamp - motion_map.ms_timestart;

    motion_map.px_delta_x   = event_src.clientX - motion_map.px_current_x;
    motion_map.px_delta_y   = event_src.clientY - motion_map.px_current_y;

    motion_map.px_current_x = event_src.clientX;
    motion_map.px_current_y = event_src.clientY;

    // native event object override
    motion_map.timeStamp    = event_src.timeStamp;

    // disallow tap if outside of zone or time elapsed
    // we use this for other events, so we do it every time
    if ( motion_map.do_allow_tap ) {
      if ( Math.abs(motion_map.px_delta_x) > option_map.px_radius
        || Math.abs(motion_map.pd_delta_y) > option_map.px_radius
        || motion_map.ms_elapsed           > option_map.tap_time
      ) { motion_map.do_allow_tap = false; }
    }

    if ( motion1ZoomId && motion2ZoomId
      && ( motion_id === motion1ZoomId
        || motion_id === motion2ZoomId
    )) {
      motionMapMap[motion_id] = motion_map;
      mzoom1_map = motionMapMap[motion1ZoomId];
      mzoom2_map = motionMapMap[motion2ZoomId];

      px_pinch_zoom = Math.floor(
        Math.sqrt(
            Math.pow((mzoom1_map.px_current_x - mzoom2_map.px_current_x),2)
          + Math.pow((mzoom1_map.px_current_y - mzoom2_map.px_current_y),2)
        ) +0.5
      );

      if ( pxPinchZoom === -1 ) { px_delta_zoom = 0; }
      else { px_delta_zoom = ( px_pinch_zoom - pxPinchZoom ) * zoomTouchNum;}

      // save value for next iteration delta comparison
      pxPinchZoom  = px_pinch_zoom;
      do_zoommove  = true;
    }
    else if ( motionDzoomId === motion_id ) {
      if ( bound_ns_map.uzoommove ) {
        px_delta_zoom = motion_map.px_delta_y * zoomMouseNum;
        do_zoommove = true;
      }
    }

    if ( do_zoommove ){
      event_ue = $.Event('uzoommove');
      motion_map.px_delta_zoom = px_delta_zoom;
      $.extend( event_ue, motion_map );
      $(motion_map.elem_bound).trigger(event_ue);
      return;
    }

    if ( motionHeldId === motion_id ) {
      if ( bound_ns_map.uheldmove ) {
        event_ue = $.Event('uheldmove');
        $.extend( event_ue, motion_map );
        $(motion_map.elem_bound).trigger(event_ue);
      }
    }
    else if ( motionDragId === motion_id ) {
      if ( bound_ns_map.udragmove ) {
        event_ue = $.Event('udragmove');
        $.extend( event_ue, motion_map );
        $(motion_map.elem_bound).trigger(event_ue);
      }
    }

    if ( ! motionDragId
      && ! motionHeldId
      && bound_ns_map.udragstart
      && motion_map.do_allow_tap === false
    ) {
      motionDragId = motion_id;
      event_ue = $.Event('udragstart');
      $.extend( event_ue, motion_map );
      $(motion_map.elem_bound).trigger(event_ue);

      if ( motion_map.idto_tapheld ) {
        clearTimeout(motion_map.idto_tapheld);
        delete motion_map.idto_tapheld;
      }
    }
  };
  // End motion control /fnMotionMove/

  // Begin motion control /fnMotionEnd/
  fnMotionEnd   = function ( arg_map ) {
    var
      motion_id    = arg_map.motion_id,
      event_src    = arg_map.event_src,
      do_zoomend   = false,
      motion_map, option_map, bound_ns_map, event_ue
      ;

    doDisableMouse = false;

    if ( ! motionMapMap[motion_id] ) { return; }

    motion_map   = motionMapMap[motion_id];
    option_map   = motion_map.option_map;
    bound_ns_map = option_map.bound_ns_map;

    motion_map.elem_target  = event_src.target;
    motion_map.ms_elapsed   = event_src.timeStamp - motion_map.ms_timestart;
    motion_map.ms_timestop  = event_src.timeStamp;

    if ( motion_map.px_current_x ) {
      motion_map.px_delta_x   = event_src.clientX - motion_map.px_current_x;
      motion_map.px_delta_y   = event_src.clientY - motion_map.px_current_y;
    }

    motion_map.px_current_x = event_src.clientX;
    motion_map.px_current_y = event_src.clientY;

    motion_map.px_end_x     = event_src.clientX;
    motion_map.px_end_y     = event_src.clientY;

    // native event object override
    motion_map.timeStamp    = event_src.timeStamp
    ;

    // clear-out any long-hold tap timer
    if ( motion_map.idto_tapheld ) {
      clearTimeout(motion_map.idto_tapheld);
      delete motion_map.idto_tapheld;
    }

    // trigger utap
    if ( bound_ns_map.utap
      && motion_map.ms_elapsed   <= option_map.tap_time
      && motion_map.do_allow_tap
    ) {
      event_ue = $.Event('utap');
      $.extend( event_ue, motion_map );
      $(motion_map.elem_bound).trigger(event_ue);
    }

    // trigger udragend
    if ( motion_id === motionDragId ) {
      if ( bound_ns_map.udragend ) {
        event_ue = $.Event('udragend');
        $.extend( event_ue, motion_map );
        $(motion_map.elem_bound).trigger(event_ue);
      }
      motionDragId = undefined;
    }

    // trigger heldend
    if ( motion_id === motionHeldId ) {
      if ( bound_ns_map.uheldend ) {
        event_ue = $.Event('uheldend');
        $.extend( event_ue, motion_map );
        $(motion_map.elem_bound).trigger(event_ue);
      }
      motionHeldId = undefined;
    }

    // trigger uzoomend
    if ( motion_id === motionDzoomId ) {
      do_zoomend = true;
      motionDzoomId = undefined;
    }

    // cleanup zoom info
    else if ( motion_id === motion1ZoomId ) {
      if ( motion2ZoomId ) {
        motion1ZoomId = motion2ZoomId;
        motion2ZoomId = undefined;
        do_zoomend = true;
      }
      else { motion1ZoomId = undefined; }
      pxPinchZoom  = -1;
    }
    if ( motion_id === motion2ZoomId ) {
      motion2ZoomId = undefined;
      pxPinchZoom  = -1;
      do_zoomend   = true;
    }

    if ( do_zoomend && bound_ns_map.uzoomend ) {
      event_ue = $.Event('uzoomend');
      motion_map.px_delta_zoom = 0;
      $.extend( event_ue, motion_map );
      $(motion_map.elem_bound).trigger(event_ue);
    }
    // remove pointer from consideration
    delete motionMapMap[motion_id];
  };
  // End motion control /fnMotionEnd/
  //------------------ END MOTION CONTROLS -------------------

 //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin event handler /onTouch/ for all touch events.
  // We use the 'type' attribute to dispatch to motion control
  onTouch = function ( event ) {
    var
      elem_this   = this,
      timestamp   = +new Date(),
      o_event     = event.originalEvent,
      a_touches   = o_event.changedTouches || [],
      idx, touch_event, motion_id,
      handler_fn
      ;

    doDisableMouse = true;

    event.timeStamp = timestamp;

    switch ( event.type ) {
      case 'touchstart' : handler_fn = fnMotionStart; break;
      case 'touchmove'  :
        handler_fn = fnMotionMove;
        event.preventDefault();
      break;
      case 'touchend'   : handler_fn = fnMotionEnd;   break;
      default : handler_fn = null;
    }

    if ( ! handler_fn ) { return; }

    for ( idx = 0; idx < a_touches.length; idx++ ) {
      touch_event  = a_touches[idx];

      motion_id = 'touch' + String(touch_event.identifier);

      event.clientX   = touch_event.clientX;
      event.clientY   = touch_event.clientY;
      handler_fn({
        elem      : elem_this,
        motion_id : motion_id,
        event_src : event
      });
    }
  };
  // End event handler /onTouch/


  // Begin event handler /onMouse/ for all mouse events
  // We use the 'type' attribute to dispatch to motion control
  onMouse = function ( event ) {
    var
      elem_this     = this,
      motion_id     = 'mouse' + String(event.button),
      request_dzoom = false,
      handler_fn
      ;

    if ( doDisableMouse ) {
      event.stopImmediatePropagation();
      return;
    }

    if ( event.shiftKey ) { request_dzoom  =  true; }

    // skip left or middle clicks
    if ( event.type !== 'mousemove' ) {
      if ( event.button !== 0 ) { return true; }
    }

    switch ( event.type ) {
      case 'mousedown' : handler_fn = fnMotionStart; break;
      case 'mouseup'   : handler_fn = fnMotionEnd;   break;
      case 'mousemove' :
        handler_fn = fnMotionMove;
        event.preventDefault();
      break;
      default          : handler_fn = null;
    }

    if ( ! handler_fn ) { return; }

    handler_fn({
      elem          : elem_this,
      event_src     : event,
      request_dzoom : request_dzoom,
      motion_id     : motion_id
    });
  };
  // End event handler /onMouse/
  //-------------------- END EVENT HANDLERS --------------------


  // Export special events through jQuery API
  $Special.ue
    = $Special.utap       = $Special.uheld
    = $Special.uzoomstart = $Special.uzoommove = $Special.uzoomend
    = $Special.udragstart = $Special.udragmove = $Special.udragend
    = $Special.uheldstart = $Special.uheldmove = $Special.uheldend
    = Ue
    ;
  $.ueSetGlobalCb = function ( selector_str, callback_match, callback_nomatch ) {
    callbackList.push( {
      selector_str     : selector_str     || '',
      callback_match   : callback_match   || null,
      callback_nomatch : callback_nomatch || null
    });
  };

}(jQuery));

