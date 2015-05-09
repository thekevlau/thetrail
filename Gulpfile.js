var babel = require('gulp-babel');
var gulp = require('gulp');
var gutil = require('gulp-util');
var insert = require('gulp-insert');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('webpack');

var server = require('./tools/server');

var handleWebpackErrors = function(errors){
    errors.forEach(function(error){
        process.stderr.write('\n' + error + '\n\n');
    });
};

gulp.task('compile:shared', function(){
    return gulp.src('./src/shared/**/*')
        .pipe(insert.prepend('require(\'source-map-support\').install();\n'))
        .pipe(insert.prepend('require(\'babel/polyfill\');\n'))
        .pipe(insert.prepend('require(\'node-jsx\').install();\n'))
        .pipe(babel({
            optional: ['es7.asyncFunctions']
        }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/shared/'));
});

gulp.task('compile:server', function(){
    return gulp.src('./src/server/**/*')
        .pipe(insert.prepend('require(\'source-map-support\').install();\n'))
        .pipe(insert.prepend('require(\'babel/polyfill\');\n'))
        .pipe(insert.prepend('require(\'node-jsx\').install();\n'))
        .pipe(babel({
            optional: ['es7.asyncFunctions']
        }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/server/'));
});

gulp.task('restart', ['compile:server', 'compile:shared'], function(done){
    if (server.isStarted()){
        server.restart(done);
    }
    else {
        done();
    }
});

gulp.task('watch:server', ['compile:server'], function(){
    gulp.watch('./src/server/**/*.jsx', ['restart']);
    gulp.watch('./src/server/**/*.js', ['restart']);
});

gulp.task('watch:shared', ['compile:shared'], function(){
    gulp.watch('./src/shared/**/*.jsx', ['restart']);
    gulp.watch('./src/shared/**/*.js', ['restart']);
});

gulp.task('watch:client', function(){
    webpack({
        context: __dirname,
        entry: './src/client/init.jsx',
        output: {
            path: __dirname + '/static/js/',
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    include: path.resolve(__dirname, './src/'),
                    loader: 'babel-loader?optional[]=runtime&optional[]=es7.asyncFunctions'
                }
            ]
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        },
        devtool: 'inline-source-map'
    }).watch(1000, function(err, stats) {
        gutil.log('Finished Compiling Client.');

        if (err){
            process.stderr.write(err + '\n');
            return;
        }
        var jsonStats = stats.toJson();
        if (jsonStats.errors.length){
            handleWebpackErrors(jsonStats.errors);
            return;
        }
        if (jsonStats.warnings.length){
            handleWebpackErrors(jsonStats.warnings);
            return;
        }

        if (server.isStarted()){
            server.restart();
        }
    });
});

gulp.task('run', ['watch:server', 'watch:shared', 'watch:client'], function(done){
    server.listen({
        path: './dist/server/index.js',
        env: {ENVIRONMENT: 'testing'}
    }, done);
});

