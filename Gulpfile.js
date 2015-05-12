var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('nodemon');
var path = require('path');

require('./tasks/server');
require('./tasks/shared');
require('./tasks/client');

gulp.task('move:static_assets', function(){
    gulp.src('./static/**/*')
        .pipe(gulp.dest('./dist/client/'));
});

gulp.task('start', ['watch:server', 'watch:shared', 'watch:client', 'move:static_assets'],
        function(){
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
