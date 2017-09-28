/*
 * spa.js
 * Root namespace module
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,     nomen : true,   plusplus : true,
  regexp : true,    sloppy : true,       vars : false,
  white  : true
*/
/*global $, spa */

var spa = (function () {
  'use strict';
  var initModule = function ( $container ) {
    spa.model.initModule();
    spa.shell.initModule( $container );
  };

  return { initModule: initModule };
}());
