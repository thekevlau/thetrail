var babel = require('gulp-babel');
var gulp = require('gulp');
var gutil = require('gulp-util');
var insert = require('gulp-insert');
var sourcemaps = require('gulp-sourcemaps');

var compile = function(){
    return gulp.src('./src/server/**/*')
        .pipe(sourcemaps.init())
        .pipe(babel({
            optional: ['es7.asyncFunctions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/server/'));
};

var watch = function(){
    var cb = function(event){
        gutil.log('Server files changed, recompiling....');
        compile();
    };

    gulp.watch('./src/server/**/*.jsx', cb);
    gulp.watch('./src/server/**/*.js', cb);
};

gulp.task('compile:server', compile);
gulp.task('watch:server', ['compile:server'], watch);
