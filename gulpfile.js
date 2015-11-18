var gulp = require('gulp'),
    gutil = require('gulp-util'),
    del = require('del'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    paths;

paths = {
  src: 'src/**/*',
  assets: 'src/assets/**/*',
  css:    'src/css/*.css',
  js:     ['src/js/**/*.js'],
  dist:   {
    main: 'build',
    css: 'build/css',
    js: 'build/js',
    assets: 'build/assets'
  }
};

gulp.task('clean', function () {
  del([paths.dist]);
});
gulp.task('clean-css', function () {
  del([paths.dist.css]);
});
gulp.task('clean-js', function () {
  del([paths.dist.js]);
});
gulp.task('clean-assets', function () {
  del([paths.dist.assets]);
});

gulp.task('copy-src', ['clean'], function () {
  gulp.src(paths.src)
    .pipe(gulp.dest(paths.dist.main))
    .on('error', gutil.log);
});

gulp.task('copy-assets', ['clean-assets'], function () {
  gulp.src(paths.assets)
    .pipe(gulp.dest(paths.dist.assets))
    .on('error', gutil.log);
});


gulp.task('uglify', ['clean-js'], function () {
  gulp.src(paths.js)
    .pipe(concat('main.js'))
    .pipe(uglify({outSourceMaps: false}))
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task('minifycss', ['clean-css'], function () {
 gulp.src(paths.css)
    // .pipe(minifycss({
    //   keepSpecialComments: false,
    //   removeEmpty: true
    // }))
    .pipe(gulp.dest(paths.dist.css))
    .on('error', gutil.log);
});

gulp.task('lint', function() {
  gulp.src(paths.js)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .on('error', gutil.log);
});

gulp.task('connect', function () {
  connect.server({
    root: [__dirname + '/'],
    port: 9000,
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.js, ['lint', 'copy-src']);
  gulp.watch(['./index.html', paths.css, paths.js]);
});

gulp.task('default', ['copy-src', 'connect', 'watch']);
gulp.task('build', ['copy-assets', 'uglify', 'minifycss']);
