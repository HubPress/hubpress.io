# Roon

The Roon theme for [Ghost](http://github.com/tryghost/ghost/).

To download, visit the [releases](https://github.com/TryGhost/Roon/releases) page. See the [demo](https://roon.ghost.io).

## Font Options

This theme comes with two font options; a serif and sans-serif. Switching between them must be done in the HTML, by changing a `class` on the `<body>` element in [default.hbs](https://github.com/TryGhost/Roon/blob/master/default.hbs#L23).

**Sans-Serif - Gibson**

The sans-serif is the default, so you don't need to add anything. The `<body>` element should look like this:

```html
<body class="{{body_class}} {{#is 'index, tag, author'}}user{{/is}} {{#is 'post'}}{{#unless post.image}}noimage{{/unless}}{{/is}}">
```

**Serif - Filo Pro**

For the serif font, the `<body>` element should look like this:

```html
<body class="serif {{body_class}} {{#is 'index, tag, author'}}user{{/is}} {{#is 'post'}}{{#unless post.image}}noimage{{/unless}}{{/is}}">
```

## Colour Options

This theme uses an accent colour for links and the border at the top of pages.

To change this colour, you need to edit [assets/css/screen.css](https://github.com/TryGhost/Roon/blob/master/assets/css/screen.css).

There are only two values you need to change, conveniently **located at the very top of the file**.

## Copyright & License

Copyright (c) 2013-2015 Sam Soffes & Ghost Foundation - Released under the [MIT license](LICENSE).
