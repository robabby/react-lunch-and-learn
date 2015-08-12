var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

// Webserver with livereload
var livereload = require('gulp-livereload'),
    tinylr = require('tiny-lr')();
    express = require('express'),
    livereloadport = 35729,
    serverport = 3000;

function notifyLivereload(event) {

  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

// JSHint Task
gulp.task('lint', function() {
  gulp.src('./app/js/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Watch Task
gulp.task('watch', function() {
  // Watch Scripts
  gulp.watch(['app/js/*.js', 'app/js/**/*.js'], notifyLivereload);

  // Watch Views
  gulp.watch(['app/index.html', 'app/views/**/*.html'], notifyLivereload);
});

// Serve task
gulp.task('default', ['lint', 'watch'], function() {
  // Set up an express server (but not starting it yet)
  var server = express();
  // Add live reload
  server.use(require('connect-livereload')({port: livereloadport}));
  // Use our 'dist' folder as rootfolder
  server.use(express.static('./app'));
  server.all('/*', function(req, res) {
    res.sendFile('index.html', { root: 'app' });
  });

  // Start webserver
  server.listen(serverport);
  // Start live reload
  tinylr.listen(livereloadport);
  // Run the watch task, to keep taps on changes

  console.log('Server is running on port: ' + serverport);
});
