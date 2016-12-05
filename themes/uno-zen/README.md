# Uno Zen for Ghost

![Last version](https://img.shields.io/github/tag/Kikobeats/uno-zen.svg?style=flat-square)
[![Build Status](http://img.shields.io/travis/Kikobeats/uno-zen/master.svg?style=flat-square)](https://travis-ci.org/Kikobeats/uno-zen)
![Ghost version](https://img.shields.io/badge/Ghost-0.7.x-brightgreen.svg?style=flat-square)
![Node version](https://img.shields.io/node/v/uno-zen.svg?style=flat-square)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](https://paypal.me/kikobeats)

> Minimalist and Elegant theme for Ghost.

[<img src="http://i.imgur.com/LCSB4Ca.jpg">](http://kikobeats.com)

- [Uno Zen for Ghost](#uno-zen-for-ghost)
  * [Introduction](#introduction)
    + [Whats is new in 2.x](#whats-is-new-in-2x)
  * [Installation](#installation)
  * [Update](#update)
    + [Update your current version](#update-your-current-version)
    + [Receive a mail notification when a new version is available](#receive-a-mail-notification-when-a-new-version-is-available)
  * [Development and Customization](#development-and-customization)
  * [Showcase](#showcase)
  * [Related](#related)
  * [License](#license)

---

## Introduction

**Uno Zen** is a fork of [Uno for Ghost](https://github.com/daleanthony/Uno) that provides some features missing in the original theme.

### Whats is new in 2.x

- Totally rewritten using HTML5 and CSS3.
- Improved development workflow with gulp + browersync.
- Improved responsive and mobile experience.
- Improved SEO Content with meta tags.

Things that already existed:

- A good [404 page error](http://kikobeats.com/404).
- Search support.
- Multiaccount support.
- Loading progress state for each page.
- Estimation about the time of reading.

You can see a [demo](http://kikobeats.com) in my own blog. Also you can check the [styleguide](http://kikobeats.com/styleguide) to view how it looks.

## Installation

Please ensure that `git` and `curl` is installed on your machine.

Enter the theme folder (`content/themes`) of your Ghost installation and paste the following command:

```bash
$ curl -sSL http://git.io/vcIHr | sh
```

## Setup

This theme needs a DOM selector library. The library is not provided by the theme. Instead, you need to inject from the `Blog Footer` in the `Code injection` of your Ghost installation:

```html
<script type="text/javascript" src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
```

You can use jQuery, but we recommend use [Zepto](https://github.com/madrobby/zepto), a lightweight jQuery alternative compatible with jQuery Plugins:

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.6/zepto.min.js"></script>
<script>jQuery = Zepto</script>
```

It should look like this:

![](http://i.imgur.com/xUXdFeH.png)

## Update

One objective of this project is to adopt an effective policy to have the latest version of the theme all the time. We have divided this process into two steps:


### Update your current version

Make sure you're in the uno-zen directory. Then run:

```bash
$ sh scripts/update.sh
```

That's all!

### Receive a mail notification when a new version is available

Stay tuned for new releases with this [IFTTT recipe](https://ifttt.com/recipes):

<div align="center">
<a target="blank" href="https://ifttt.com/recipes/330382-uno-zen-new-release-send-me-an-email"><img src="http://i.imgur.com/sbl8YiZ.png"></a>
</br>
</br>
</div>

## Development and Customization

See in [Documentation](https://github.com/Kikobeats/uno-zen/blob/master/DOCUMENTATION.md).

## Showcase

<div align="center">
<a target="blank" href="http://kikobeats.com"><img src="http://i.imgur.com/crE8jt2.png"></a>
<a target="blank" href="http://www.evilsocket.net"><img src="http://i.imgur.com/qanAbQf.png"></a>
<a target="blank" href="http://pupboss.com"><img src="http://i.imgur.com/0AeVKgB.png"></a>
<a target="blank" href="http://robinz.in"><img src="http://i.imgur.com/qDAbrch.jpg" /></a>
</br>
</br>
.. and many, many more. <a href="https://github.com/Kikobeats/uno-zen/blob/master/SHOWCASE.md">See all</a>!.
</div>


## Related

* [Bloggy](https://github.com/Kikobeats/bloggy#bloggy-for-ghost) – Branding theme for Ghost.

## License

MIT © [Kiko Beats](kikobeats.com)
