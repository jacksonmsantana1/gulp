'use strict';

var gulp = require('gulp'),
    gulpMocha = require('gulp-mocha');

module.exports = function (options) {
    gulp.task('bTest', function () {
       gulp.src('server/**/*.spec.js', {read: false})
           .pipe(gulpMocha({reporter: 'nyan'}));
    });
};