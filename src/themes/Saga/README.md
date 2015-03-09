Saga [![Latest Github release](https://img.shields.io/github/release/Reedyn/Saga.svg?style=flat-square)](http://github.com/Reedyn/Saga/releases/latest) [![](http://img.shields.io/github/issues/Reedyn/Saga.svg?style=flat-square)](http://github.com/Reedyn/Saga/issues) [![Project Status](http://saga.gustavlindqvist.se/content/images/2015/01/Saga.png)](https://stillmaintained.com/Reedyn/Saga)
====

![](http://saga.gustavlindqvist.se/content/images/2014/10/Saga-showcase.png)

> **Saga** is a theme designed to look beautiful with all your media, be it a collection of images, a video you've embedded or that nice panorama you took yesterday. *To take a look at the various ways you can display your content, check out [this post](http://saga.gustavlindqvist.se/2014/09/22/welcome-to-ghost/)*.

## Useful information

### Quotations

There's two different ways to show quotation.

#### Blockquote
```
> Quoted text here
>
> ![Images work well inside a quote]()
>
> More text
```

#### Quote
```
<q>Your quote here, this will show up centered with a larger font-size and with a serif-font. Great for Quoting someone famous :)</q>
```

### Images
There are currently 4 different sizes an image can be displayed at:

 1. Small *(add the fragment `#small`)*
 2. Normal *(No need to add anything)*
 2. Large *(add the fragment `#large`)*
 3. Full *(you add the fragment `#full`)*

#### Example

```html
![Small image](//url-to-image.jpeg#small)

![Normal image](//url-to-image.jpeg)

![Large image](//url-to-image.jpeg#large)

![Full image](//url-to-image.jpeg#full)
```
 
### There's also a fourth way to display images, and that's using a gallery (or collage)
That is done in the following manner *(grouping together the images without an empty linebreak)*:
```html
![Gallery 1](//url-to-image.jpeg)
![Gallery 2](//url-to-image.jpeg)
![Gallery 3](//url-to-image.jpeg)
![Gallery 4](//url-to-image.jpeg)
![Gallery 5](//url-to-image.jpeg)
```

### Lightbox for your images
Saga supports lightbox for your images. The example above modified to work with lightbox would look like this:

```html
[![Gallery 1](//url-to-image.jpeg)](//url-to-larger-image.jpeg)
[![Gallery 2](//url-to-image.jpeg)](//url-to-larger-image.jpeg)
[![Gallery 3](//url-to-image.jpeg)](//url-to-larger-image.jpeg)
[![Gallery 4](//url-to-image.jpeg)](//url-to-larger-image.jpeg)
[![Gallery 5](//url-to-image.jpeg)](//url-to-larger-image.jpeg)
```
