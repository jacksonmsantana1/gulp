'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var args = require('yargs').argv;

module.exports = function(options) {

    //Devlopment
    gulp.task('serve-dev', ['optimize'], function () {
        serve(true, options);
    });

    //Build
    gulp.task('serve-build', ['build'], function () {
        serve(false, options);
    });

    //Serve
    var serve = function(isDev, options) {

        var nodeOptions = {
            script: options.nodeServer,
            delayTime: 1,
            env: {
                'PORT': options.port,
                'NODE_ENV': isDev ? 'dev' : 'build'
            },
            watch: [options.server]
        };

        return $.nodemon(nodeOptions)
            .on('restart', [/*'hints', 'bTest'*/], function (env) {
                gutil.log('*** nodemon restarted');
                gutil.log('files changed on restart:\n' + env);
                setTimeout(function () {
                    browserSync.notify('reloading now ...');
                    browserSync.reload({stream: false});
                }, 1000);
            })
            .on('start', [/*'hints', 'fTest','bTest'*/], function () {
                gutil.log('*** nodemon started');
                startBrowserSync(isDev, options);
            })
            .on('crash', function () {
                gutil.log('*** nodemon crashed');
            })
            .on('exit', function () {
                gutil.log('*** nodemon excited cleanly');
            });
    };

    //BrowserSync
    var startBrowserSync =  function (isDev, options) {
        if (args.nosync || browserSync.active) {
            return;
        }

        gutil.log('Começando browser-sync na porta ' + options.port);

        //gulp.watch([config.less], ['less']);

        //gulp.watch([config.sass], ['sass']);

        if (isDev) {
            gulp
                .watch([options.stylus], ['styles', browserSync.reload])
                .on('change', function (event) { changeEvent(event); });
        } else {
            gulp
                .watch([options.stylus, options.js, options.html], ['build', browserSync.reload])
                .on('change', function (event) { changeEvent(event); });
        }

        var optionsBrownserSync = {
            proxy: 'localhost:' + options.port,
            port: 3000,
            files: isDev ? [
                options.client + '/**/*.*',
                '!' + options.stylus,
                options.tmp + '**/*.css'
            ] : [],
            ghostMode: {
                clicks: true,
                location: true,
                forms: true,
                scroll: true
            },
            injectChanges: true,
            logFileChanges: true,
            logLevel: 'debug',
            logPrefix: 'gulp-patterns',
            notify: true,
            reloadDelay: 1000
        };

        browserSync(optionsBrownserSync);
        require('browser-sync').create().on('change',function () {
           console.log("CUUUUU");
        });
    };

    //Change event
    var changeEvent = function (event) {
        var srcPattern = new RegExp('/.*(?=/' + options.source + ')/');
        gutil.log('Arquivo ' + event.path.replace(srcPattern, '') + ' ' + event.type);
    };

};