'use strict'

$ ->

  showSearch = ->
    $(".content").hide()
    $('#search-results').addClass('active')

  hideSearch = ->
    $(".content").show()
    $('#search-results').removeClass('active')

  $("#search-field").ghostHunter
    results           : "#search-results"
    zeroResultsInfo   : false
    onKeyUp           : true
    displaySearchInfo : true
    result_template   :
      """
      <a class="result" href='{{link}}'>
        <h2>{{title}}</h2>
        <h4>{{pubDate}}</h4>
      </a>
      """
    onComplete : (query) ->
      if query.length > 0 then showSearch() else hideSearch()
