// Gulp passes files throug a stream.
// Dependency tasks run in parallel, not in sequence.
// -->gulp.task(name, [dep], fn); 
//   -Use gulp.task when making new tasks.
//	 -Tests and lint code.
// 	 -Optimize files.
// 	 _Serve your app.
// 
// -->gulp.src(glob, [options]);
//   -Takes a file system glob(set of files), Emits files that match, can specify options.
// 	 -gulp.src('./src/**/*.js, {base: './src/'}'); Defines how much of the path to retain.
// 
// -->gulp.dest(folder, [options]); Especify to where the files go.
// 
// -->gulp.watch(glob, [options], tasks);Run one or more tasks when a file matched by the glob changes
// -->gulp.watch(glob, function (event) {
// 		console.log(event.type","event.path);
// });	

// Wiredep and gulp-inject
// <!-- bower:type -->
// <!-- inject:type -->

/////////Dependencies

var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')({lazy: true}); //Falta ainda usar o npm.
var config = require('./gulp.config')();
var del = require('del');
var port = process.env.PORT || config.defaultPort;
var lib    = require('bower-files')();
var _ = require('lodash');

//////////Tasks Listing

gulp.task('help', $.taskListing);

gulp.task('default', ['help']);

//////////JSHint and JSCS

gulp.task('vet', function () {
	log('Analisando codigo com JSHint and JSCS');

	return gulp.src(config.alljs)
		.pipe($.if(args.verbose, $.print()))
		.pipe($.jscs())
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
		.pipe($.jshint.reporter('fail'));
});

//////////Less

gulp.task('less', ['clean-css'], function () {
	log('Copilando Less --> CSS');

	return gulp
		.src(config.less)
		.pipe($.plumber())
		.pipe($.less())
		.pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
		.pipe(gulp.dest(config.tmp));
});

//////////Sass

gulp.task('sass', ['clean-css'], function () {
	log('Copilando Sass --> CSS');

	return gulp
		.src(config.sass)
		.pipe($.plumber())
		.pipe($.sass())
		.pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
		.pipe(gulp.dest(config.tmp));
});

//////////Stylus

gulp.task('stylus', ['clean-css'], function () {
	log('Copilando Stylus --> CSS');

	return gulp
		.src(config.stylus)
		.pipe($.plumber())
		.pipe($.stylus())
		.pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
		.pipe(gulp.dest(config.tmp));
});

///////////Less-watcher

gulp.task('less-watcher', function () {
	gulp.watch([config.less], ['less']);
});

///////////Sass-watcher

gulp.task('sass-watcher', function () {
	gulp.watch([config.sass], ['sass']);
});

///////////Stylus-watcher

gulp.task('stylus-watcher', function () {
	gulp.watch([config.stylus], ['stylus']);
});

///////////Template Cache

gulp.task('templatecache', ['clean-code'], function () {
	log('Creating AngularJs $templateCache.');

	return gulp
		.src(config.htmltemplates)
		.pipe($.minifyHtml({empty: true}))
		.pipe($.angularTemplatecache(
			config.templateCache.file,
			config.templateCache.options
		))
		.pipe(gulp.dest(config.tmp));
});

///////////Fonts

gulp.task('fonts', ['clean-fonts'],function () {
	log('Copying fonts');

	return gulp
		.src(config.fonts)
		.pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('clean-fonts', function (done) {
	clean(config.build + 'fonts/**/*.*', done);
});

///////////Images

gulp.task('images', ['clean-images'],function () {
	log('Copying and compressing the images.');

	return gulp
		.src(config.images)
		.pipe($.imagemin({optimizationLevel: 4}))
		.pipe(gulp.dest(config.build + 'images'));
});

gulp.task('clean-images', function (done) {
	clean(config.build + 'images/**/*.*', done);
});

///////////Wiredep

gulp.task('wiredep', function () {
	var options = config.getWiredepDefaultOptions();
	var wiredep = require('wiredep').stream;

	return gulp
		.src(config.index)
		.pipe(wiredep(options))
		.pipe($.inject(gulp.src(config.js)))
		.pipe(gulp.dest(config.client));
});

///////////Inject

gulp.task('inject', ['wiredep', 'stylus'], function () {
	return gulp
		.src(config.index)
		.pipe($.inject(gulp.src(config.css)))
		.pipe(gulp.dest(config.client));
});

gulp.task('lib-js', function () {
  gulp.src(lib.ext('js').files)
    .pipe($.concat('lib.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('lib-css', function () {
	var  minifyCSS = require('gulp-minify-css')
  gulp.src(lib.ext('css').files)
  	.pipe($.concat('lib.min.css'))
    .pipe(minifyCSS({keepSpecialComments: 0}))
    .pipe(gulp.dest('build/styles'));
});


///////////Build

gulp.task('build', ['optimize' ,'fonts', 'images', 'lib-js', 'lib-css'], function () {
	log('Building everything');

	var msg = {
		title: 'gulp build',
		subtitle: 'Deployed to the build folder',
		message: 'Running `gulp serve-build`'
	};
	del(config.temp);
	log(msg);
	notify(msg);
});

///////////Opmitize

gulp.task('optimize', ['inject', 'test'], function () {
	log('Optimizing the javascript, css, html.');

	var assets = $.useref.assets({searchPath: './'});
	var templateCache = config.tmp + config.templateCache.file;
	var cssFilter = $.filter('**/*.css');
	var jsFilter = $.filter('**/*.js');
	var jsLibFilter = $.filter('**/lib.js');
	var jsAppFilter = $.filter('**/app.js');

		gulp.src(config.index)
		.pipe($.plumber())
		.pipe($.inject(gulp.src(templateCache, {read: false}), {
			starttag: '<!-- inject:templates:js -->'
		}))
		.pipe(assets)
		.pipe(cssFilter)
		.pipe($.csso())
		.pipe(cssFilter.restore())
		.pipe(jsAppFilter)
		.pipe($.uglify())
		.pipe(jsAppFilter.restore())
		.pipe(jsLibFilter)
		.pipe($.ngAnnotate())
		.pipe($.uglify())
		.pipe(jsLibFilter.restore())
		.pipe($.rev())
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe($.revReplace())
		.pipe(gulp.dest(config.build))
		.pipe($.rev.manifest())
		.pipe(gulp.dest(config.build));
});

// Bump the version
// --type=pre will bump the prerelease version *.*.*-1
// --type=patch will bump the patch version
// --type=minor will bump the minor version
// --type=major will bump the major version
// --version=1.2.3 will bump to version 1.2.3

gulp.task('bump', function () {
	var msg = 'Bumping versions';
	var type = args.type;
	var version = args.version;
	var options = {};
	if (version) {
		options.version = version;
		msg += ' to ' + version;
	} else {
		options.type = type;
		msg += ' for a ' + type;
	}
	log(msg);
	return gulp
		.src(config.packages)
		.pipe($.print())
		.pipe($.bump(options))
		.pipe(gulp.dest(config.root));
});

///////////Serve-Build

gulp.task('serve-build', ['build'], function () {
	serve(false);
});

///////////Serve-dev

gulp.task('serve-dev', ['inject'], function () {
	serve(true);
});

///////////Serve

function serve(isDev, specRunner) {
	var nodeOptions = {
		script: config.nodeServer, //app.js
		delayTime: 1,
		env: {
			'PORT': port,
			'NODE_ENV': isDev ? 'dev' : 'build'
		},
		watch: [config.server]
	};

	return $.nodemon(nodeOptions)
		.on('restart', ['vet'], function (env) {
			log('*** nodemon restarted');
			log('files changed on restart:\n' + env);
			setTimeout(function () {
				browserSync.notify('reloading now ...');
				browserSync.reload({stream: false});
			}, 1000);
		})
		.on('start', function () {
			log('*** nodemon started');
			startBrowserSync(isDev, specRunner);
		})
		.on('crash', function () {
			log('*** nodemon crashed');
		})
		.on('exit', function () {
			log('*** nodemon excited cleanly');
		});
};

///////////BrowserSync

function startBrowserSync(isDev, specRunner) {
	if (args.nosync || browserSync.active) {
		return;
	}

	log('Começando browser-sync na porta ' + port);

	//gulp.watch([config.less], ['less']);

	//gulp.watch([config.sass], ['sass']);

	if (isDev) {
			gulp
				.watch([config.stylus], ['stylus'])
				.on('change', function (event) { changeEvent(event); });
	} else {
			gulp
			.watch([config.stylus, config.js, config.html], ['optimize', browserSync.reload])
			.on('change', function (event) { changeEvent(event); });
	}

	var options = {
		proxy: 'localhost' + port,
		port: 3000,
		files: isDev ? [
			config.client + '/**/*.*',
			'!' + config.less,
			config.tmp + '**/*.css'
		] : [],
		ghostMode: {
			clicks: true,
			location: false,
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

	if (specRunner) {
		options.startPath = config.specRunnerFile;
	}

	browserSync(options);
};

///////////Karma Test
  
//gulp serve-test (Show the results pn the browser)
//gulp serve-test --startServers (include server tests)
//gulp test (Show the results on command line)
//gulp test --startServers (include server tests)
//gulp autotest (Continuos integration test)

gulp.task('test', [/*'vet',*/ 'templatecache'], function (done) {
	startTests(true /* single run*/ , done);
});

gulp.task('autotest', [/*'vet',*/ 'templatecache'], function (done) {
	startTests(false /* single run*/ , done);
});

gulp.task('serve-test', function (done) {
	log('Run the test runner.');
	serve(true, true);
	done();
});

gulp.task('build-test', ['templatecache'], function () {
	log('Building the test runner.');

	var wiredep = require('wiredep').stream;
	var options = config.getWiredepDefaultOptions();
	var specs = config.specs;

	options.devDependencies = true;

	if (args.startServers) {
		specs = [].concat(specs, config.serverIntegrationSpecs);
	}

	return gulp
		.src(config.specRunner)
		.pipe(wiredep(options))
		.pipe($.inject(gulp.src(config.testlibraries),
			{name: 'inject:testlibraries', read: false}))
		.pipe($.inject(gulp.src(config.specHelpers),
			{name: 'inject:spechelpers', read: false}))
		.pipe($.inject(gulp.src(specs),
			{name: 'inject:specs', read: false}))
		.pipe($.inject(gulp.src(config.tmp + config.templateCache.file),
			{name: 'inject:templates', read: false}))
		.pipe($.inject(gulp.src(config.js)))
		.pipe(gulp.dest(config.client));
});

///////////Test

function startTests(singleRun, done) {
	var child;
	var fork  = require('child_process').fork;
	var karma = require('karma').server;
	var excludeFiles = [];
	var serverSpecs = config.serverIntegrationSpecs;

	if (args.startServers) {  //gulp test --startServers
		log('Starting server.');
		var savedEnv = process.env;
		savedEnv.NODE_ENV = 'dev';
		savedEnv.PORT = 8888;
		child = fork(config.nodeServer);
	} else {
		if (serverSpecs && serverSpecs.length) {
			excludeFiles = serverSpecs;
		}	
	}
	
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		exclude: excludeFiles,
		singleRun: !!singleRun
	}, karmaCompleted);

	function karmaCompleted(karmaResult) {
		log('Karma completed!');
		if (child) {
			log('Shutting down the child process.');
			child.kill();
		}
		if (karmaResult === 1) {
			done('Karma: tests failed with code ' + karmaResult);
		} else {
			done();
		}
	}
}

///////////Notify

function notify(options) {
	var notifier = require('node-notifier');
	var notifyOptions = {
		sound: 'Bottle',
		contentImage: path.join(__dirname, 'gulp.png'),
		icon: path.join(__dirname, 'gulp.png')
	};
	_.assign(notifyOptions, options);
	notifier.notify(notifyOptions);
}

///////////ChangeEvent

function changeEvent(event) {
	var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
	log('Arquivo ' + event.path.replace(srcPattern, '') + ' ' + event.type);	
}

///////////Clean CSS files

gulp.task('clean-css', function (done) {
	var files = config.tmp + '**/*.css';
	clean(files, done)
});

///////////Clean Code

gulp.task('clean-code', function (done) {
	var files = [].concat(
		config.tmp + '**/*.js',
		config.build + '**/*.html',
		config.build + 'js/**/*.js'
	);
	clean(files, done);
});

///////////Clean

gulp.task('clean', function (done) {
	var delconfig = [].concat(config.build, config.tmp);
	log('Cleaning: ' + $.util.colors.blue(delconfig));
	del(delconfig, done);
});

function clean(path, done) {
	log('Limpando: ' + $.util.colors.blue(path));
	del(path, done);
}

///////////Log

function log(msg) {
	if (typeof(msn) === 'object') {
		for (var item in msg) {
			if (msn.hasOwnProperty(item)) {
				$.util.log($.util.colors.blue(msg[item]));
			}
		}
	} else {
		$.util.log($.util.colors.blue(msg));
	}
}