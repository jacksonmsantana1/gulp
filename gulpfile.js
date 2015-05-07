'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var wrench = require('wrench');
var gutil = require('gulp-util');
var wiredep = require('wiredep');
var bowerFiles = wiredep({devDependencies: true})['js'];

var options = {

    //folders
	client: 'client',
	build: 'build',
	tmp: '.tmp',
	e2e: 'e2e',
	server: 'server',

    //Server conf.
    port: 7203,
    nodeServer: 'server/app.js',

    //assets
    images: 'client/assets/images/*.*',
    stylus: 'client/assets/stylus/*.styl',
    css: './.tmp/serve/app/index.css',

    //js files
    all: ['./**/*.js'],
    js: [
        'client/*.js',
        'client/app/**/*.js',
        'client/components/**/*.js',
        '!client/**/*.spec.js',
        '!client/**/*.mock.js'
    ],
    bowerFiles: bowerFiles,
    serverIntegrationSpecs: 'e2e/*.spec.js',
    templateCache: '.tmp/partials/templateCacheHtml.js',
    specHelpers: '',    //TODO
    karmaExclude: [],


    //Html
    html: 'client/**/*.html',
    index: 'client/index.html',

    //wiredep conf.
    wiredep: {
        directory: 'bower_components'
    },

	errorHandler: function(title) {
		return function(err) {
			gutil.log('[' + title + ']' + err.toString());
			this.emit('end');
		};
	}
};

options.getWiredepDefaultOptions = function () {
    return {
        bowerJson: './bower.json',
        directory: './bower_components',
        ignorePath: '../..'
    };
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
	return (/\.(js|css)$/i).test(file);
}).map(function(file) {
	require('./gulp/' + file)(options);
});

