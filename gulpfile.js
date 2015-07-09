'use strict';

var gulp = require('gulp');
var del = require('del');
var spawn = require('child_process').spawn;


var path = require('path');


// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),

    sourceFile = './src/hubpress/scripts/app.react.js',

    destFolder = './dist/hubpress/scripts',
    destFileName = 'app.js';


var LessPluginCleanCSS = require("less-plugin-clean-css"),
cleancss = new LessPluginCleanCSS({advanced: true});

var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
autoprefix= new LessPluginAutoPrefix({browsers: ["last 2 versions"]});

// Styles
gulp.task('styles', function () {
    return gulp.src('src/hubpress/styles/**/*.less')
        .pipe($.sourcemaps.init())
        .pipe($.less({
          paths: [ path.join(__dirname, 'less', 'includes') ],
          plugins: [autoprefix, cleancss]
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/hubpress/styles'))
        .pipe($.size());
});

// Styles css
gulp.task('styles-css', function () {
    return gulp.src('src/hubpress/styles/**/*.css')
        .pipe(gulp.dest('dist/hubpress/styles'))
        .pipe($.size());
});

// Scripts
gulp.task('scripts', function () {
    var bundler = watchify(browserify({
        entries: [sourceFile],
        insertGlobals: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }));

    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle()
            // log errors if they happen
            .on('error', $.util.log.bind($.util, 'Browserify Error'))
            .pipe(source(destFileName))
            .pipe(buffer())
            .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.uglify())
            .pipe($.sourcemaps.write('./'))
            .pipe(gulp.dest(destFolder));
    }

    return rebundle();

});





// HTML
gulp.task('html', function () {
    return gulp.src('src/hubpress/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('dist/hubpress'))
        .pipe($.size());
});

// Home file
gulp.task('home', function () {
  return gulp.src(['src/index.html', 'LICENSE', 'README-ja.adoc', 'README.adoc'])
  .pipe(gulp.dest('dist/'))
  .pipe($.size());
});

// Config file
gulp.task('config', function () {
  return gulp.src('src/hubpress/config.json')
  .pipe(gulp.dest('dist/hubpress'))
  .pipe($.size());
});

// Themes
gulp.task('themes', function () {
  return gulp.src('src/themes/**/*')
  .pipe(gulp.dest('dist/themes'))
  .pipe($.size());
});

// HBS Partials
gulp.task('partials', function () {
  return gulp.src('src/hubpress/scripts/helpers/tpl/*')
  .pipe(gulp.dest('dist/hubpress/scripts/helpers/tpl'))
  .pipe($.size());
});

// Images
gulp.task('images', function () {
  return gulp.src('src/images/**/*')
  .pipe(gulp.dest('dist/images'))
  .pipe($.size());
});

gulp.task('hubpress-images', function () {
    return gulp.src('src/hubpress/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/hubpress/images'))
        .pipe($.size());
});

// README, LICENSE
gulp.task('readme', function () {
  return gulp.src(['docs/README*.adoc', 'docs/LICENSE'])
  .pipe(gulp.dest('dist/'))
  .pipe($.size());
});



gulp.task('jest', function () {
    var nodeModules = path.resolve('./node_modules');
    return gulp.src('src/hubpress/scripts/**/__tests__')
        .pipe($.jest({
            scriptPreprocessor: nodeModules + '/gulp-jest/preprocessor.js',
            unmockedModulePathPatterns: [nodeModules + '/react']
        }));
});

gulp.task('doc', function (){
  spawn('node_modules/groc/bin/groc', {stdio: 'inherit'});
});

// Clean
gulp.task('clean', function (cb) {
    del('dist', cb);
});


// Bundle
gulp.task('bundle', ['styles', 'styles-css', 'scripts'], function(){
    return gulp.src('./src/hubpress/*.html')
               .pipe($.useref.assets())
               .pipe($.useref.restore())
               .pipe($.useref())
               .pipe(gulp.dest('dist/hubpress'));
});

// Build
gulp.task('build', ['html', 'config', 'themes', 'images','partials', 'hubpress-images', 'home', 'bundle']);

// Default task
gulp.task('default', ['clean', 'build', 'readme', 'jest' ]);

// Webserver
gulp.task('serve', function () {
    gulp.src('./dist')
        .pipe($.webserver({
            host: '0.0.0.0',
            //host: 'localhost',
            livereload: true,
            port: 9000
        }));
});

// Bower helper
gulp.task('bower', function() {
    gulp.src('src/hubpress/bower_components/**/*.js', {base: 'src/hubpress/bower_components'})
        .pipe(gulp.dest('dist/hubpress/bower_components/'));

});



// Watch
gulp.task('watch', ['html', 'config', 'themes', 'partials', 'images', 'hubpress-images', 'home', 'bundle', 'serve'], function () {

    // Watch .html files
    gulp.watch('src/hubpress/*.html', ['html']);

    // Watch config files
    gulp.watch('src/hubpress/config.json', ['config']);

    // Watch partials files
    gulp.watch('src/hubpress/scripts/helpers/tpl/**/*', ['partials']);


    // Watch .scss files
    gulp.watch('src/hubpress/styles/**/*.less', ['styles']);

    // Watch themes files
    gulp.watch('src/themes/**/*', ['themes']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    // Watch hubpress image files
    gulp.watch('src/hubpress/images/**/*', ['hubpress-images']);
});
