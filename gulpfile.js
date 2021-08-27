const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');

function watch() {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });

  gulp.watch('./src/**/*.html', html);
  gulp.watch('./src/sass/**/*.scss', styles);
  gulp.watch('./src/js/main.js', scripts);
  gulp.watch('./src/img/**/*.*', images);
  gulp.watch('./src/img/**/*.{jpg,jpeg,png,webp,svg,gif}', {
    usePolling: true
  }, images);
}

function clean() {
  return del('./build/*');
}

function html() {
  return gulp.src('./src/**/index.html')
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream());
}


function images() {
  return gulp.src('./src/img/**/*.*')
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.mozjpeg({
        quality: 75,
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 2
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest('./build/img'))
    .pipe(browserSync.stream());
}




function styles(done) {
  return gulp.src('./src/sass/main.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
  done();
}

function scripts() {
  return gulp.src('./src/js/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest('./build/js/'))
    .pipe(browserSync.stream());
}

let build = gulp.parallel(html, styles, scripts, images);
let buildWithClean = gulp.series(clean, build);
let dev = gulp.series(buildWithClean, watch);

gulp.task('build', buildWithClean);
gulp.task('dev', dev);