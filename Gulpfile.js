var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('nodemon');
var path = require('path');

require('./tasks/server');
require('./tasks/shared');
require('./tasks/client');

gulp.task('start', ['watch:server', 'watch:shared', 'watch:client'], function(){
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
