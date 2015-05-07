'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;

module.exports = function (options) {
    gulp.task('inject', ['styles'], function () {
        var injectStyles = gulp.src([
            options.client + '/app/**/*.css'
        ], { read: false });

        var injectScripts = gulp.src([
            options.client + '/**/*.js',
            '!' + options.client + '/app/**/*.spec.js',
            '!' + options.client + '/app/**/*.mock.js'
        ])
            .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'));

        var injectOptions = {
            ignorePath: [options.client, options.tmp + '/serve'],
            addRootSlash: false
        };

        return gulp.src(options.client + '/index.html')
            .pipe($.inject(injectStyles, injectOptions))
            .pipe($.inject(injectScripts, injectOptions))
            .pipe(wiredep(options.wiredep))
            .pipe(gulp.dest(options.tmp + '/serve'));

    });
};