var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    webserver = require('gulp-webserver'),
    bourbon = require('node-bourbon'),
    neat = require('node-neat').includePaths,
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

gulp.task('js', function() {
  return gulp.src('build/js/app.js')
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function () {
  gulp.src('src/sass/style.scss')
    .pipe(sass({
      includePaths: ['sass'].concat(neat),
      outputStyle: 'compressed'
    }))
   .pipe(gulp.dest('build/css/'));
});

gulp.task('watch', function() {
  gulp.watch(['build/js/lib/*', 'build/js/*'], ['js']);
  gulp.watch(['src/sass/**/*'], ['sass']);
});

gulp.task('webserver', function() {
    gulp.src('build/')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('compress', function() {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js/'));
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };

  return gulp.src('src/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('build/'));
});

gulp.task('image', function () {
    return gulp.src('src/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/img'));
});

gulp.task('resources', ['image', 'minify-html', 'compress']);
gulp.task('default', ['watch', 'sass', 'webserver']);