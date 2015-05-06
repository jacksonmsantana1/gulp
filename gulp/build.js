'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del', 'size']
});

module.exports = function(options) {
    gulp.task('partials', function () {
        return gulp.src([
            options.client + '/app/**/*.html',
            options.tmp + '/serve/app/**/*.html'
        ])
            .pipe($.minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe($.angularTemplatecache('templateCacheHtml.js', {
                module: 'project-gulp',
                root: 'app'
            }))
            .pipe(gulp.dest(options.tmp + '/partials/'));
    });

    gulp.task('html', ['inject', 'partials'], function () {
        var partialsInjectFile = gulp.src(options.tmp + '/partials/templateCacheHtml.js', { read: false });
        var partialsInjectOptions = {
            starttag: '<!-- inject:partials -->',
            ignorePath: options.tmp + '/partials',
            addRootSlash: false
        };

        var htmlFilter = $.filter('*.html');
        var jsFilter = $.filter('**/*.js');
        var cssFilter = $.filter('**/*.css');
        var assets;

        return gulp.src(options.tmp + '/serve/*.html')
            .pipe($.inject(partialsInjectFile, partialsInjectOptions))
            .pipe(assets = $.useref.assets())
            .pipe($.rev())
            .pipe(jsFilter)
            .pipe($.ngAnnotate())
            .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', options.errorHandler('Uglify'))
            .pipe(jsFilter.restore())
            .pipe(cssFilter)
            .pipe($.csso())
            .pipe(cssFilter.restore())
            .pipe(assets.restore())
            .pipe($.useref())
            .pipe($.revReplace())
            .pipe(htmlFilter)
            .pipe($.minifyHtml({
                empty: true,
                spare: true,
                quotes: true,
                conditionals: true
            }))
            .pipe(htmlFilter.restore())
            .pipe(gulp.dest(options.build + '/'))
            .pipe($.size({ title: options.build + '/', showFiles: true }));
    });

    // Only applies for fonts from bower dependencies
    // Custom fonts are handled by the "other" task
    gulp.task('fonts', function () {
        return gulp.src($.mainBowerFiles())
            .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
            .pipe($.flatten())
            .pipe(gulp.dest(options.build + '/fonts/'));
    });

    gulp.task('other', function () {
        return gulp.src([
            options.client + '/**/*.*',
            '!' + options.client + '/**/*.{html,css,js,less,styl,sass,jpg,jpeg,gif}'
        ])
            .pipe(gulp.dest(options.build + '/'));
    });

    //Images
    gulp.task('images',function () {
        gutil.log('Copying and compressing the images.');

        return gulp
            .src(options.images)
            .pipe($.imagemin({optimizationLevel: 4}))
            .pipe(gulp.dest(options.build + '/images'));
    });

    gulp.task('clean', function (done) {
        $.del([options.build + '/', options.tmp + '/'], done);
    });

    gulp.task('build', ['html', 'fonts', 'other', 'images']);
};
