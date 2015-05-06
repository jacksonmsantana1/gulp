'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;

module.exports = function(options) {
    gulp.task('styles', function () {

        var injectFiles = gulp.src([
            options.client + '/assets/stylus/*.styl',
            '!' + options.client + '/app/index.styl',
            '!' + options.client + '/app/vendor.styl'
        ], { read: false });

        var injectOptions = {
            transform: function(filePath) {
                filePath = filePath.replace(options.client + '/assets/stylus/', '');
                return '@import \'' + filePath + '\';';
            },
            starttag: '// injector',
            endtag: '// endinjector',
            addRootSlash: false
        };

        var mainFilter = $.filter('main.styl');

        return gulp.src([
            options.client + '/assets/stylus/main.styl',
        ])
            .pipe(indexFilter)
            .pipe($.inject(injectFiles, injectOptions))
            .pipe(indexFilter.restore())
            .pipe(wiredep(options.wiredep))
            .pipe($.sourcemaps.init())
            .pipe($.stylus()).on('error', options.errorHandler('Stylus'))
            .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest(options.tmp + '/serve/app/'))
    });
};
