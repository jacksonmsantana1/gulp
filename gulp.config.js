module.exports = function () {
	var client = './client';
	var root = './';
	var report = './report/';
	var wiredep = require('wiredep');
	var server = './server/'
	var bowerFiles = wiredep({devDependencies: true})['js'];
	var specRunnerFile = 'test.html';
	var config = {
		alljs: ['./**/*.js'],
		less: client + '/assets/less/*.less',
		sass: client + '/assets/sass/**/*.sass',
		stylus: client + '/assets/stylus/*.styl',
		report: report,
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
		fonts: './bower_components/font-awesome/fonts/**/*.*',
		html: client + '/**/*.html',
		defaultPort: 8000,
		nodeServer: server + 'app.js',
		server: server,
		build: './build/',
		images: './client/assets/images/**/*.*',
		templateCache: {
			file: 'template.js',
			options: {
				module: 'project-gulp', //Nome do modulo do aplicativo
				standAlone: false,
				root: 'app/'
			}
		},
		htmltemplates: client + '/**/*.html',
		packages: [
			'./package.json',
			'./bower.json'
		],
		root: root,
		specHelpers: [client + '/specHelpers/*.js'],
		serverIntegrationSpecs: [server + '/**/*Test.js'],
		bowerFiles: bowerFiles,
		specRunner: client + '/' +  specRunnerFile,
		specRunnerFile: specRunnerFile,
		specs: [client + '/**/*Test.js'],
		testlibraries: [
			'node_modules/mocha/mocha.js',
			'node_modules/chai/chai.js',
			'node_modules/mocha-clean/index.js',
			'node_modules/sinon-chai/lib/sinon-chai.js'
		],
		e2e: [client + '/**/*e2e.js']
	};

	config.getWiredepDefaultOptions = function () {
		return {
			bowerJson: config.bower.json,
			directory: config.bower.directory,
			ignorePath: config.bower.ignorePath
		};
	};

	config.karma = getKarmaOptions();

	return config;

	///////////

	function getKarmaOptions() {
		var options = {
			files: [].concat(
				bowerFiles,
				config.specHelpers,
				client + '**/*.module.js',
				client + '**/*.js',
				'./tmp/' + config.templateCache.file,
				config.serverIntegrationSpecs	
			),
			exclude: [],
			coverage: {
				dir: report + 'coverage',
				reporters: [
					{type: 'html', subdir: 'report-html'},
					{type: 'lcov', subdir: 'report-lcov'},
					{type: 'text-summary'}
				]
			},
			preprocessors: {}
		};
		options.preprocessors[client + '**/!(*.spec)+(.js)'] = ['coverage'];
		return options;
	};
};