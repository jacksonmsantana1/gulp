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

//var

var gulp = require('gulp');
var files = ['./*.js', './**/*.js'];
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

//JSHint and JSCS

gulp.task('vet', function () {
	return gulp.src(files)
	.pipe(jscs())
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish', {verbose: true}));
});

