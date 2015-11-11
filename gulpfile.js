var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    // sourcemaps = require('gulp-sourcemaps'),
    webserver = require('gulp-webserver'),
    bourbon = require('node-bourbon');

gulp.task('js', function() {
  return gulp.src('build/js/app.js')
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function () {
  gulp.src('sass/style.scss')
    .pipe(sass({
      includePaths: bourbon.includePaths
    }))
   .pipe(gulp.dest('build/css/'));
    // return sass('sass/style.scss', {
    //   sourcemap: true,
    //   style: 'expanded'
    // })
    // .on('error', function (err) {
    //     console.error('Error!', err.message);
    // })
    // .pipe(sourcemaps.write())
    // .pipe(gulp.dest('build/css'));
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