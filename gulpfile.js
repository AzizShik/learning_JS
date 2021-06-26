const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');


function clean() {
	return del('./build/*');
}

function watch() {
	browserSync.init({
		server: {
			baseDir: "./build"
		}
	});

	gulp.watch('./src/**/*.html', html);
	gulp.watch('./src/css/**/*.css', styles);
	gulp.watch('./src/js/**/*.js', scripts);
	gulp.watch('./src/img/**/*.*', images);

}

function html() {
	return gulp.src('./src/**/index.html')
		.pipe(gulp.dest('./build'))
		.pipe(browserSync.stream());
}

function images() {
	return gulp.src('./src/img/**/*.*')
		.pipe(gulp.dest('./build/img'))
		.pipe(browserSync.stream());
}

function styles() {
	return gulp.src('./src/css/**/*.css')
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream());
}

function scripts() {
	return gulp.src('./src/js/*.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('./build/js/'))
		.pipe(browserSync.stream());
}

let build = gulp.parallel(html, styles, scripts, images);
let buildWithClean = gulp.series(clean, build);
let dev = gulp.series(buildWithClean, watch);

gulp.task('dev', dev);