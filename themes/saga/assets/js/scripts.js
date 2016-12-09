/* global hljs, $, console */
/* jshint browser: true */

var siteurl = $('#site-url').attr("href"); // Get url for blog (in case site is run under a sub-domain)
siteurl += "/themes/saga";
/******************
 * HIGHLIGHT CODE *
 ******************/

if($("code").length !== 0){
    $.getScript(siteurl+"/assets/js/helper/highlight.min.js", function() {
        hljs.initHighlightingOnLoad();
    });
}

/**********************
 * RESPONSIVE VIDEOS  *
 **********************/

$.getScript(siteurl+"/assets/js/helper/jquery.fitvids.js", function() {
    $("#main").fitVids();
});

/***********
 * GALLERY *
 ***********/

if($('p a:not(:only-child) img').closest('p').length !== 0 || $('p img:not(:only-child)').closest('p').length !== 0){ // If there is a gallery present.
    $.getScript(siteurl+"/assets/js/helper/imagesloaded.pkgd.min.js", function() {
        $('p a:not(:only-child) img').closest('p').addClass('gallery');
        $('p img:not(:only-child)').closest('p').addClass('gallery');
        $(".gallery").imagesLoaded(gallery);
        $(window).resize(gallery);
    });
}

function gallery(){
    $.getScript(siteurl+"/assets/js/helper/gallery.min.js", function() { // Load in script for gallery
        var size = 0;
        if ($(window).height() > $(window).width()){
            size = $(window).height();
        } else {
            size = $(window).width();
        }
        if (size < 210 ){
            size = 210;
        }
        $('.gallery').removeWhitespace().collagePlus(
            {
                'targetHeight':size/5
            }
        );
    });
}

/*********************
 * FULL WIDTH IMAGES *
 *********************/

if($("#main").hasClass("content")){
    $.getScript(siteurl+"/assets/js/helper/imagesloaded.pkgd.min.js", function() {
        function fullImage(){
            $('img[src$="#full"]:only-child').each(function() {
                $(this).addClass("full-loaded");
                $(this).closest("p").css("min-height",$(this).height());
                $(this).closest("p").addClass("full-image-container");
            });
        }
        $("#main").imagesLoaded(fullImage);
        $(window).resize(fullImage);
    });
}

/************
 * LIGHTBOX *
 ************/

if($("#main").hasClass("content")){
    $.getScript(siteurl+"/assets/js/helper/jquery.fluidbox.min.js", function() {
        $.getScript(siteurl+"/assets/js/helper/imagesloaded.pkgd.min.js", function() {
            function lightBox(){
                $('.content a').filter(function() {
                    return $(this).attr('href').match(/\.(jpeg|jpg|png|gif)/i);
                }).fluidbox({
                        closeTrigger: [
                            { selector: '#fluidbox-overlay', event: 'click'         },
                            { selector: 'window',            event: 'resize scroll' }
                        ]
                });
            }
            $("#main").imagesLoaded(lightBox);
        });
    });
}

/*****************
 * STICKY FOOTER *
 *****************/

$(window).load(function(){
    $("#main").css("min-height",$(window).height() - $("#header").height() - $("#footer").height() );
});
$(window).resize(function(){
    $("#main").css("min-height",$(window).height() - $("#header").height() - $("#footer").height() );
});

/********
 * FEED *
 ********/

var $masonry;
if($("#main").hasClass("archive")){
    $.getScript(siteurl+"/assets/js/helper/masonry.pkgd.min.js", function() {
        $.getScript(siteurl+"/assets/js/helper/imagesloaded.pkgd.min.js", function() {
            $("#main").imagesLoaded(function(){
                $masonry = $('.feed').masonry({
                    columnWidth: '.post:not(.featured)',
                    itemSelector: '.post',
                    gutter: 20
                });
                $('.post').each(function(){
                    $(this).css("opacity", "1.0");
                });
                $('#loadmore').each(function(){
                    $(this).css("opacity", "1.0");
                });
            });
        });
    });
}

/*******************
 * LOAD MORE POSTS *
 *******************/

if($("#main").hasClass("archive")){
    $(document).ready(function($) {

        // The number of the next page to load (/page/x/).
        var numbers = $(".page-number").text().match(/[-+]?[0-9]*\.?[0-9]+/g);
        var pageNum = parseInt(numbers[0]);
        // The maximum number of pages the current query can return.
        var max = parseInt(numbers[1]);
        // The link of the next page of posts.
        var nextLink = $(".older-posts").attr('href');
        /**
         * Replace the traditional navigation with our own,
         * but only if there is at least one page of new posts to load.
         */
        if(pageNum < max) {
            // Insert the "More Posts" link.
            $('#feed').append('<div id="loadmore" style="opacity: 0;"><a class="btn">Load more <i class="fa fa-plus-circle"></i></a></div>');

            // Remove the traditional navigation.
            $('.pagination').remove();
        } else {
            $('.pagination').remove();
        }


        /**
         * Load new posts when the link is clicked.
         */
        $('#loadmore a').click(function() {
            // Are there more posts to load?
            if(pageNum < max) {

                // Show that we're working.
                $(this).html('<i class="fa fa-spinner fa-spin"></i>');

                // Grab data from next page
                $.get(nextLink, function(data){
                    // Append all posts to #content
                    var posts = $(data).find(".post");
                    $.each(posts,function(){
                        $(this).css("opacity", 0);
                    });
                    $masonry.append(posts);
                    // Change nextLink to next page
                    $("#feed").imagesLoaded(function(){
                        pageNum++;
                        nextLink = nextLink.substring(0, nextLink.indexOf('page/'));
                        nextLink += "page/"+(pageNum+1);

                        // Remove button if last page else move the button to end of #content
                        if(pageNum < max) {
                            $('#loadmore').insertAfter($('#feed .post:last'));
                            $('#loadmore a').html('Load more <i class="fa fa-plus-circle"></i>');
                        } else {
                            $('#loadmore').remove();
                        }
                        $masonry.masonry('appended', posts);
                    });
                });
            } else {
                $('#loadmore').remove();
            }

            return false;
        });
    });
}
