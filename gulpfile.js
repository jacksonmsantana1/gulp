'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var wrench = require('wrench');
var gutil = require('gulp-util');

var options = {
	client: 'client',
	build: 'build',
	tmp: '.tmp',
	e2e: 'e2e',
    images: 'client/assets/images/*.*',
    stylus: 'client/assets/stylus/*.styl',
	errorHandler: function(title) {
		return function(err) {
			gutil.log('[' + title + ']' + err.toString());
			this.emit('end');
		};
	},
	wiredep: {
		directory: 'bower_components'
	}
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
	return (/\.(js|css)$/i).test(file);
}).map(function(file) {
	require('./gulp/' + file)(options);
});

