var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('nodemon');
var path = require('path');

// Gulp tasks are registered in these files.
require('./tasks/server');
require('./tasks/shared');
require('./tasks/client');
require('./tasks/css');

gulp.task('move:static_assets', function(){
    gulp.src('./static/**/*')
        .pipe(gulp.dest('./dist/client/static/'));
});

gulp.task('start', ['watch:server', 'watch:shared', 'watch:client', 'watch:css',
        'move:static_assets'], function(){
    nodemon({
        execMap: { js: 'node' },
        script: './dist/server/index.js',
        watch: ['./dist'],
        ignore: ['./dist/static'],
        env: { ENVIRONMENT: 'testing' }
    }).on('restart', function(){
        gutil.log('Restarted server.');
    });
});
