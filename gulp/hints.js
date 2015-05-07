'use strict';

var args = require('yargs').argv;
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var gutil = require('gulp-util');

module.exports = function (options) {

    //JSHint and JSCS
    gulp.task('hints', function () {
        gutil.log('Analisando codigo com JSHint and JSCS');

        return gulp.src(options.all)
            .pipe($.if(args.verbose, $.print()))
            .pipe($.jscs())
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
            .pipe($.jshint.reporter('fail'));
    });
};