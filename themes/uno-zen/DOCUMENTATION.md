# Development

## Understanding scenario

The code of the theme is divided in 3 main sections: static files (as HTML and images), CSS and JS. Check out the folders tree:

```
.
├── LICENSE.md
├── README.md
├── assets
│   ├── css
│   │   └── uno-zen.css # the production css
│   ├── fonts
│   ├── img # favicons and cover image
│   ├── js
│   │   ├── src
│   │   │   ├── __init.coffee
│   │   │   ├── cover.coffee
│   │   │   ├── main.coffee
│   │   │   └── search.coffee
│   │   └── uno-zen.js # the production js
│   └── scss
│   │   ├── components # specific stuff
│   │   │   ├── _aside.scss
│   │   │   ├── _loading.scss
│   │   │   ├── _media-queries.scss
│   │   │   ├── _page-error.scss
│   │   │   ├── _pagination.scss
│   │   │   ├── _post.scss
│   │   │   └── _search.scss
│   │   ├── modules # basic stuff
│   │   │   ├── _buttons.scss
│   │   │   ├── _effects.scss
│   │   │   ├── _fonts.scss
│   │   │   ├── _forms.scss
│   │   │   ├── _global.scss
│   │   │   ├── _grid.scss
│   │   │   ├── _mixins.scss
│   │   │   ├── _reset.scss
│   │   │   └── _variables.scss
│   │   └── uno.scss # main file to create the CSS
|   └── vendor # frontend dependencies
├── bower.json
├── default.hbs
├── error.hbs
├── gulpfile.coffee
├── index.hbs
├── node_modules
├── package.json
├── partials # different partials view
│   ├── aside.hbs
│   ├── comments.hbs
│   ├── footer.hbs
│   ├── google-analytics.hbs
│   ├── links.hbs
│   ├── meta.hbs
│   ├── pagination.hbs
│   ├── search.hbs
│   └── social.hbs
├── post.hbs
└── tag.hbs
```

Putting the files in context:

- The JS inside `assets/js/src` is compiled into `assets/js/uno.js`
- The SCSS (we use [SASS](http://sass-lang.com/)) inside `assets/scss` is compiled into `assets/css/uno.css`
- We have some static files like `post.hbs`, `tag.hbs`, `default.hbs`, `index.hbs`,... the partials views inside `assets/partials` is used in this views.

For do it automatically and easily we use [Gulp](http://gulpjs.com/), check `gulpfile.coffee` for know how to we do it.

## First Steps

For local development you need to have a locally Ghost server, like this:

```bash
node index.js
Migrations: Up to date at version 003
Ghost is running in development...
Listening on 127.0.0.1:2387
Url configured as: http://127.0.0.1:2387
Ctrl+C to shut down
```

Note that my local Ghost is running in the port `2387`.

With your local Ghost running, open another terminal and enter in the folder `content/themes` of your local Ghost and clone the theme repository and install the dependencies for local development:

```bash
$ git clone https://github.com/Kikobeats/uno-zen && cd uno-zen && npm install && bower install
```

Just run `gulp` command in the theme terminal. Now you have a development scenario, and looks like this:

![](http://i.imgur.com/Gf4gPR2.png)

With the `gulp` command you are automatically launching the task for compile the assets and reload the server when your assets change. For do it we uses [BrowserSync](http://www.browsersync.io) that is setup as middleware between the theme and the Ghost. You can connect different devices and try the responsive of the website as well.

As the screenshot, you need to use for the proxying the same port as your Ghost server. If your Ghost server is in a different port than `2387` you need to modify `gulpfile.coffee` and put the correct port.

## Customization

### Highlight Code Support

The code highlight is based in [Prism](http://prismjs.com/). By default, the languages supported are:

```
markup, css, c, javascript
```

If you want to support more languages:

1) go to [prismjs.com/download](http://prismjs.com/download.html),
2) generate your custom highlight code
3) paste in the [prism file](https://github.com/Kikobeats/uno-zen/blob/master/assets/scss/modules/_prism.scss)
3) compile the assets

Be careful, the current prism code is integrated with the color schema of the theme. You need to edit manually to get the correct look and feel.

### Google Analytics

Go to Ghost `Admin Panel` → `Code Injection` → `Blog Header` and add:

```html
<script>
var ga_id = 'UA-YOUR_ID_HERE';
</script>
```

### Comments

Go to Ghost `Admin Panel` → `Code Injection` → `Blog Header` and add:

```html
<script>
var disqus_shortname = 'YOUR_DISQUS_SHORTCUT_HERE';
</script>
```

### Open Button

By default, the open buttons works binding the event of open the blog with a button called 'Posts' created into Ghost Navigation section. Here is the piece of code that create the bind:

```js
var openButton = window.open_button || '.nav-posts > a'
```

As you see, you can specify a different button selector. For example, if You want to open your blog under 'Blog' button, then you add this in `Admin Panel` → `Code Injection` → `Blog Header`:

```html
<script>
var open_button = '.nav-blog > a'
</script>
```

### Profile title

By default, the title that you see in the open page of your blog is extracted from your blog settings (`Admin Panel` → Blog Title).

If you want to customize it, you can do it:

Go to Ghost ``Admin Panel`` → `Code Injection` → `Blog Header` and add:

```html
<script>
var profile_title = 'Kiko Beats';
</script>
```

### Profile subtitle

The purpose of the subtitle is resume the bio in a phrase. This will be shown in the mobile/tablet version instead of the bio.

Go to Ghost `Admin Panel` → `Code Injection` → `Blog Header` and add:

```html
<script>
var profile_resume ='Software Engineer';
</script>
```

### Posts list headline

By default, the title that you see in the page with your blog posts list is 'Writings.' but you might want to adjust this text.

If you want to customize it, you can do it:

Go to Ghost `Admin Panel` → `Code Injection` → `Blog Header` and add:

```html
<script>
var posts_headline = 'Random Stuff';
</script>
```

### Colors

Edit the file `assets/scss/modules/_variables.scss`. Remember that is necessary compile the build to load the new style, so keep running your gulp process in background.

### Social Networks

Edit the file `partials/social.hbs`.

### Links

Go to Ghost `Admin Panel` → `Navigation` and add/edit items.

"Blog" link is always included by default, so you don't need to add it manually.

### Favicon

Create your favicons with [Favicon Generator](http://realfavicongenerator.net/) and puts it in `assets/img`.

### Cover

Go to Ghost `Admin Panel` → General → `Blog Cover`

### Cover Filter

The linear gradient of the cover filter is based in `$cover-primary` and `$cover-secondary` colors. If you want to adapt the filter for your cover, check [background-filter](https://github.com/Kikobeats/uno-zen/blob/master/assets/scss/modules/_utils.scss#L19) mixin.

### Custom static pages

Check the [page part](http://themes.ghost.org/v0.6.4/docs/page-context) in the Ghost Official Documentation.

### Multiaccount support

You can enable the multiaccount support editing [posts.hbs](https://github.com/Kikobeats/uno-zen/blob/master/post.hbs#L11-L13) code commented inside the meta post information.

## Preparing for production

When you consider that the development is done and you want to deploy a new version, package your code using `gulp build` command, that minify and concatenate all necessary code.

## Usage with Ghost(Pro)

Run the 'scripts/build.sh' command to create an archive of the theme files. The default archive is called 'uno-zen.zip', but you can pass a preferred name for the archive, for example 'scripts/build.sh uno-zen.2.6.8.zip' will create an archive with the name 'uno-zen.2.6.8.zip'. This archive can then be uploaded through the blog admin panel at [ghost.org](https://ghost.org/).
