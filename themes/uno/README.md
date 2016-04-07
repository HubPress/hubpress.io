# Uno for Ghost


Uno for Ghost is the result of my first 'mini-project' of 2014. The theme features a minimal, responsive design with a cover page, disqus comment integration, foundation icons and various colour options.


## Demo
There's a demo of the theme running on my personal website, [daleanthony.com](http://daleanthony.com)


## Features

**Cover page**
The landing page for Uno is a full screen 'cover' featuring your avatar, blog title, mini-bio and cover image.

**Built with SASS, using BEM**
If you know HTML and CSS making modifications to the theme should be super simple.

**Responsive**
Uno looks great on all devices, even those weird phablets that nobody buys.

**Disqus comments**
Disqus integration allows users to comment on your posts.

**Foundation icons**
Uno contains the [Foundation icon font by Zurb](http://zurb.com/playground/foundation-icon-fonts-3) which means you can easily add icons. A full list of available icons can be found on the [Foundation Icon](http://zurb.com/playground/foundation-icon-fonts-3) website.

**No-JS fallback**
While JS is widely used, some themes and websites don't provide fallback for when no JS is available (I'm looking at you [Squarespace](http://blog.squarespace.com/)). If for some weird reason a visitor has JS disabled your blog will still be useable.

**1 theme, 5 colour options**
Uno includes 5 different colour options for you to chose from.

**Future**
Ghost is still a work in progress with many features not yet implemented, as Ghost gets updated new features will be added to Uno.

## FAQs

Some common questions are answered on the [Uno FAQ page](http://daleanthony.com/uno-faq/)

## Contact

The best way to contact me is by [dropping me an email](dale@daleanthony.com) or my messaging me on [Twitter](https://twitter.com/daleanthony)

## Licence

[Creative Commons Attribution 4.0 International](http://creativecommons.org/licenses/by/4.0/)

## Development

In order to develop or make changes to the theme you will need to have the sass compiler and bourbon both installed.  If you are running a Ghost environment locally then you should already have these installed as those are required to run Ghost.

To check installation run the following commands from a terminal and you should see the `> cli output` but your version numbers may vary.

** SASS **
```bash

sass -v
> Sass 3.3.4 (Maptastic Maple)
```
If for some reason SASS isn't installed follow the instructions from the [Sass install page](http://sass-lang.com/install)

** Bourbon **
```bash

bourbon help
> Bourbon 3.1.8
```
If Bourbon isn't installed follow the installation instructions on the [Bourbon website](http://bourbon.io)

Once installation is verified we will need to go mount the bourbon mixins into the `scss` folder.

From the project root run `bourbon install` with the correct path
```bash
bourbon install --path assets/scss
> bourbon files installed to assets/scss/bourbon/
```

Now that we have the bourbon mixins inside of the `scss` src folder we can now use the sass cli command to watch the scss files for changes and recompile them.

```bash
sass --watch assets/scss:assets/css
>>>> Sass is watching for changes. Press Ctrl-C to stop.
```

** MacOSX Maverick **

Some people may receive this error when trying to run the `sass --watch` command

```bash
> LoadError: cannot load such file -- rb-fsevent
  Use --trace for backtrace.
```

This is a known issue with the [Sass on MaxOS Maverick](http://stackoverflow.com/questions/22413834/getting-error-when-using-command-line-for-sass-to-watch-files) as indicated install the `rb-fsevent` gem

```bash
gem install rb-fsevent
```
