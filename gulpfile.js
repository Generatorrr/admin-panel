var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('scripts', function() {
  return gulp.src(['./dist/inline.bundle.js', './dist/styles.bundle.js', './dist/polyfills.bundle.js', './dist/vendor.bundle.js', './dist/main.bundle.js'])
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./dist'));
});
