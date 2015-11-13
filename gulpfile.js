var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    webserver = require('gulp-webserver'),
    bourbon = require('node-bourbon'),
    neat = require('node-neat').includePaths;

gulp.task('js', function() {
  return gulp.src('build/js/app.js')
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function () {
  gulp.src('sass/style.scss')
    .pipe(sass({
      includePaths: ['sass'].concat(neat)
    }))
   .pipe(gulp.dest('build/css/'));
});

gulp.task('watch', function() {
  gulp.watch(['build/js/lib/*', 'build/js/*'], ['js']);
  gulp.watch(['sass/**/*'], ['sass']);
});

gulp.task('webserver', function() {
    gulp.src('build/')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('default', ['watch', 'sass', 'webserver']);