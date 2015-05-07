'use strict';

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');

module.exports = function (options) {

    //Inject
    gulp.task('optimize', ['wiredep', 'styles'], function () {
        return gulp
            .src(options.index)
            .pipe($.inject(gulp.src(options.css)))
            .pipe(gulp.dest(options.client));
    });
};