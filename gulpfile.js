'use strict';

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var envify = require('envify/custom');
var partialify = require('partialify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var rimraf = require('gulp-rimraf');
var notify = require('gulp-notify');
var browserSync = require('browser-sync');



// default task /////////////////////////////////////////////////
gulp.task('default', ['build', 'browser-sync', 'watch']);

gulp.task('clean', function() {
    return gulp.src(['build/**/*'], {
        read: false
    }).pipe(rimraf());
});



// build tasks //////////////////////////////////////////////////
gulp.task('build', ['css', 'html', 'assets', 'browserify']);

gulp.task('browserify', function() {
    var environ = {
        NODE_ENV: process.env.NODE_ENV
    };
    return browserify('./public/index.js')
        .transform(envify(environ))
        .transform(partialify)
        .bundle({
            debug: process.env.NODE_ENV != 'production'
        })
        .on('error', function(err) {
            notify.onError('Error: <%= error.message %>')(err);
            this.end();
        })
        .pipe(source('index.js'))
        .pipe(gulp.dest('build/'));
});



// assets //////////////////////////////////////////////////////
gulp.task('html', function() {
    return gulp.src('./public/**/*.html')
        .pipe(gulp.dest('build/'))
});

gulp.task('css', function() {
    return gulp.src('public/**/*.css')
        .pipe(autoprefixer('last 1 version'))
        .pipe(gulp.dest('./build'))
});

gulp.task('less', function() {
    var less_transform = less();
    less_transform.on('error', function(err) {
        notify.onError('<%= error.message %>')(err);
        this.end();
    });
    return gulp.src('./public/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less_transform)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build'));
});

gulp.task('assets', ['images'], function() {
    return gulp.src('public/assets/**/*')
        .pipe(gulp.dest('build/assets'));
});

gulp.task('images', ['favicon'], function() {
    return gulp.src('public/img/**/*')
        .pipe(gulp.dest('build/img'));
});

gulp.task('favicon', function() {
    return gulp.src('public/img/favicon.ico')
        .pipe(gulp.dest('build/'));
});



// file watching & rebuild/reload on change ////////////////////
gulp.task('watch', function() {
    gulp.watch('public/**/*.js', ['browserify']);
    gulp.watch('public/**/*.html', ['html']);
    gulp.watch('public/**/*.css', ['css']);
    gulp.watch('public/**/*.less', ['less']);
    gulp.watch('public/img/**/*', ['images']);
    gulp.watch('public/assets/**/*', ['assests']);
});

gulp.task('browser-sync', function() {
    browserSync({
        tunnel: true,
        open: 'local',
        files: './build/**/*',
        server: {
            baseDir: './build',
        },
    });
});
