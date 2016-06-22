'use strict'

$ ->

  if Uno.is 'device', 'desktop'
    $('a').not('[href*="mailto:"]').click ->
      if this.href.indexOf(location.hostname) is -1
        window.open $(this).attr 'href'
        false
  else
    FastClick.attach Uno.app

  if Uno.is 'page', 'home'
    Uno.timeAgo '#posts-list time'

  if Uno.is 'page', 'post'
    Uno.timeAgo '.post.meta > time'
    $('main').readingTime readingTimeTarget: '.post.reading-time > span'
    $('.content').fitVids()

  if Uno.is 'page', 'error'
    $('#panic-button').click ->
      s = document.createElement 'script'
      s.setAttribute 'src','https://nthitz.github.io/turndownforwhatjs/tdfw.js'
      document.body.appendChild s
