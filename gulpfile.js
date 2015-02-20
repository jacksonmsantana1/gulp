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
var $ = require('gulp-load-plugins')({lazy: true}); //Falta ainda usar o npm.
var config = require('./gulp.config')();
var del = require('del');
var port = process.env.PORT || config.defaultPort;

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
	gulp.watch([config.less], ['less'])
});

///////////Sass-watcher

gulp.task('sass-watcher', function () {
	gulp.watch([config.sass], ['sass'])
});

///////////Stylus-watcher

gulp.task('stylus-watcher', function () {
	gulp.watch([config.stylus], ['stylus'])
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

///////////Serve-dev

gulp.task('serve-dev' ['inject'], function () {
	var isDev = true;

	var nodeOptions = {
		script: config.nodeServer, //app.js
		delayTime: 1,
		env: {
			'PORT': port,
			'NODE_ENV': isDev ? 'dev' : 'build'
		},
		watch: [config.server]
	};

	return $.nodemon(nodeOtions)
		.on('restart', ['vet'], function (env) {
			log('*** nodemon restarted');
			log('files changed on restart:\n' + env);
		})
		.on('start', function () {
			log('*** nodemon started');
		})
		.on('crash', function () {
			log('*** nodemon crashed');
		})
		.on('exit', function () {
			log('*** nodemon excited cleanly');
		});
});

///////////Clean CSS files

gulp.task('clean-css', function (done) {
	var files = config.tmp + '**/*.css';
	clean(files, done)
});

///////////Clean

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