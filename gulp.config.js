module.exports = function () {
	var client = './client';
	var config = {
		alljs: ['./**/*.js'],
		less: client + '/assets/less/*.less',
		sass: client + '/assets/sass/**/*.sass',
		stylus: client + '/assets/stylus/*.styl',
		tmp: './.tmp/',
		index: client + '/index.html',
		js: [
			client +  '/*.js',
			client + '/app/**/*.js',
			client + '/components/**/*.js',
			'!'+ client +'/**/*Test.js',
			'!'+ client +'/**/*E2E.js'
		],
		client: client,
		bower: {
			json: require('./bower.json'),
			directory: './client/bower_components',
			ignorePath: '../..'
		},
		css: './.tmp/main.css',
		defaultPort: 8000,
		nodeServer: './server/app.js',
		server: './server/'
	};

	config.getWiredepDefaultOptions = function () {
		return {
			bowerJson: config.bower.json,
			directory: config.bower.directory,
			ignorePath: config.bower.ignorePath
		};
	};

	return config;
};