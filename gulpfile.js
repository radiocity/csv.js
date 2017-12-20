var gulp = require('gulp'),
    color= require('colors'),
    path = require('path'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    mocha = require('gulp-mocha'),
    argv = require('yargs').argv,

    config = {
        source: "source/**/*.js",
        tests: "tests/**/*.js",
        dest: "dist",
        uglify: {
            compress: {
                warnings: false,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
            },
            output: {
                comments: /^!/
            }
        }
    };

function onError(error) {
    process.stderr.write(
        "\007\n" +
        color.red.bold.inverse(error.name) +
        color.white.bold(" in " + error.plugin) +
        color.white.bold("\n\nMessage:\n") +
        color.red.bold(error.message) +
        "\n\n"
    );
    this.emit('end');
}

function build() {
    return gulp.src(config.source)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest(config.dest))
        .pipe(uglify(config.uglify))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(config.dest))
        .pipe(plumber.stop());
}

function test() {
    var filename = config.tests;
    if (argv.name) {
        filename = filename ?
            filename.replace("*.", "*"+ argv.name +"*.") :
            "*"+ argv.name.replace(".js", "") +"*.js";
    }
    return gulp.src(filename, {read: false})
        .pipe(plumber())
        .pipe(mocha())
        .on('error', function(){return true;}) // Prevent [DEP0018] error
        .pipe(plumber.stop());
}

function watch() {
    var paths = [config.source, config.tests];
    return gulp.watch(paths).on('change', gulp.series(build, test));
}

/*
    Gulp tasks
*/

gulp.task('build', gulp.series(build, test));
gulp.task('test', test);
gulp.task('default', gulp.series(build, test, watch));
