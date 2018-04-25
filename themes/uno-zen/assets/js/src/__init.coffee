'use strict'

window.Uno = Uno =
  version: '2.7.0'
  app: do -> document.body
  is: (k, v=!'undefined') -> this.app.dataset[k] is v

  context: ->
    # get the context from the first class name of body
    # https://github.com/TryGhost/Ghost/wiki/Context-aware-Filters-and-Helpers
    className = document.body.className.split(' ')[0].split('-')[0]
    if className is '' then 'error' else className

  search:
    container: -> $('#results')
    form: (action) -> $('#search-container')[action]()

  loadingBar: (action) -> $('.pace')[action]()

  timeAgo: (selector) ->
    $(selector).each ->
      postDate = $(this).html()
      postDateInDays = Math.floor((Date.now() - new Date(postDate)) / 86400000)

      if postDateInDays is 0 then postDateInDays = 'today'
      else if postDateInDays is 1 then postDateInDays = 'yesterday'
      else postDateInDays = "#{postDateInDays} days ago"

      $(this).html(postDateInDays)
      $(this).mouseover -> $(this).html postDate
      $(this).mouseout -> $(this).html postDateInDays

  device: ->
    w = window.innerWidth
    h = window.innerHeight
    return 'mobile' if (w <= 480)
    return 'tablet' if (w <= 1024)
    'desktop'

Uno.app.dataset.page = Uno.context()
Uno.app.dataset.device = Uno.device()

# window global properties
$('#profile-title').text window.profile_title if window.profile_title
$('#profile-resume').text window.profile_resume if window.profile_resume
$('#posts-headline').text window.posts_headline if window.posts_headline
window.open_button = window.open_button or '.nav-posts > a'

