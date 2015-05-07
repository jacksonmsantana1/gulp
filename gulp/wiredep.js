'use strict';

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var wiredep = require('wiredep').stream;

module.exports = function (options) {

    //Wiredep
    gulp.task('wiredep', function () {
        var optionsWiredep = options.getWiredepDefaultOptions();

        return gulp
            .src(options.client + '/index.html')
            .pipe(wiredep(options.wiredep))
            .pipe($.inject(gulp.src(options.js)))
            .pipe(gulp.dest(options.client));
    });
};