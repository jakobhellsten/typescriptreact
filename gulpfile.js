
var gulp = require('gulp');
//var react = require('gulp-react');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
//var tsc = require('gulp-tsc');
var ts = require("gulp-typescript");
var tsProject = ts.createProject('tsconfig.json');


gulp.task('through', function () {
	return gulp
    .src(['src/index.html'])
    .pipe(gulp.dest('dist' ) );
});


gulp.task('compile', function () {
  var result = gulp.src('src/**/*{ts,tsx}')
    .pipe(tsProject());
  return result.js.pipe(gulp.dest('.build'));
});

gulp.task('bundle', ['through','compile'], function () {
  var b = browserify('.build/app.js');
  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'))
  ;
});

/*gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("build/js"));
});

*/
