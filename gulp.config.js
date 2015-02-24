module.exports = function () {
	var client = './client';
	var root = './';
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
			directory: './bower_components',
			ignorePath: '../..'
		},
		css: './.tmp/main.css',
		fonts: './client/bower_components/font-awesome/fonts/**/*.*',
		html: client + '/**/*.html',
		defaultPort: 8000,
		nodeServer: './server/app.js',
		server: './server/',
		build: './build/',
		images: './client/assets/images/**/*.*',
		templateCache: {
			file: 'template.js',
			options: {
				module: '', //Nome do modulo do aplicativo
				standAlone: false,
				root: 'app'
			}
		},
		htmltemplates: client + '/**/*.html',
		packages: [
			'./package.json',
			'./bower.json'
		],
		root: root
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