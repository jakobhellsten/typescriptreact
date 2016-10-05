
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var ts = require("gulp-typescript");
var uglify = require('gulp-uglify');
var tsProject = ts.createProject('tsconfig.json');

var paths = {
    source: "./src/",
    build: "./build/",
    output: "./dist/"
};

var build = {
    input: {
        files: {
            // Source to compile
            ts: [
                paths.source + '**/*.ts',
                paths.source + '**/*.tsx'
            ],
            
            // Styles
            styles: paths.source + "styles/**/*.css",
            stylesMin: paths.source + "styles/**/*.min.css",
            less: [paths.source + "styles/*.less"],
            
            // Scripts
            scripts: paths.source + "scripts/**/*.js",
            scriptsMin: paths.source + "scripts/**/*.min.js",
            vendor_js: [
                'react'
            ],
            extern_js: [
                'node_modules/q/q.js',
            ],
            polyfill_js: [
                paths.source + 'polyfills/Object.assign.js'
            ],
            
            // Miscellaneous files to copy
            images: [paths.source + 'images/**/*.{jpg,png}'],
            root: [paths.source + 'favicon.ico'],
            views: [paths.source + 'views/**/*.vash']
        }
    },
    output: {
        files: {
            styles: paths.output + "styles/site.css",
            scripts: paths.output + "scripts/site.js"
        },
        dirs: {
            ts: paths.output,
            images: paths.output + 'images',
            root: paths.output,
            styles: paths.output + 'styles',
            scripts: paths.output + 'scripts',
            polyfills: paths.output + 'polyfills',
            views: paths.output + 'views'
        }
    },
    other: {
        clean: ['output/*', 'build/*'],
        output_typings: 'output/typings',
        // An intermediate file; output from tsx, input to bundle.
        client_js: [paths.output + 'app/client.js']
    }
};


gulp.task('through', function () {
	return gulp
    .src(['index.html'])
    .pipe(gulp.dest(paths.output));
});


gulp.task('compile', function () {
  var result = gulp.src(paths.source + '**/*{ts,tsx}')
    .pipe(tsProject());
  return result.js.pipe(gulp.dest(paths.output));
});

gulp.task('bundle', ['through','compile'], function () {
  var b = browserify(paths.output + 'app.js');
  return b
    .require(build.input.files.vendor_js)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
    .pipe(uglify()) // now gulp-uglify works 
    .pipe(gulp.dest('dist'))
  ;
});
