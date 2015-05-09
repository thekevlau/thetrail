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

gulp.task('compile:server', function(){
    return gulp.src('./src/server/**/*')
        .pipe(insert.prepend('require(\'babel/polyfill\');\n'))
        .pipe(insert.prepend('require(\'node-jsx\').install();\n'))
        .pipe(babel({
            optional: ['es7.asyncFunctions']
        }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/server/'));
});

gulp.task('restart:server', ['compile:server'], function(done){
    if (server.started){
        server.restart(done);
    }
    else {
        done();
    }
});

gulp.task('watch:server', ['compile:server'], function(){
    gulp.watch('./src/server/**/*.js', ['restart:server']);
});

gulp.task('watch:client', function(){
    webpack({
        context: __dirname,
        entry: './src/client/init.jsx',
        output: {
            path: __dirname + '/dist/client/',
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
        gutil.log('Finished Compiling.');

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

        if (server.started){
            server.restart();
        }
    });
});

gulp.task('run:server', ['watch:server'], function(done){
    server.listen({
        path: './dist/server/index.js',
        env: {ENVIRONMENT: 'testing'}
    }, done);
});

gulp.task('run', ['run:server', 'watch:client']);
