// Load packages
var gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
concat = require('gulp-concat'),
cssnano = require('gulp-cssnano'),
rename = require('gulp-rename'),
uglify = require('gulp-uglify'),
util = require('gulp-util'),
chalk = require('chalk'),
pump = require('pump'),
gulpFn  = require('gulp-fn'),
sourcemaps = require('gulp-sourcemaps'),
babel = require('gulp-babel'),
plumber = require('gulp-plumber');

// configs
const configs = {
    NAME: 'calendar-plugin',
    js: {
        source: ['js/*.js', 'js/**/*.js'],
        watch: ['js/*.js', 'js/**/*.js'],
        dest: 'dist/js'
    },
	sass: {
        source: "sass/style.scss",
        watch: [ "sass/**/*.scss", "sass/*.scss"],
        dest: 'dist/css'
    },
    "build": "dist/build",
    autoprefixer: {
        browsers: [ 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4' ]
    }
};

const logStart = function(task) 
{
    console.log('');
    console.log(chalk.cyan("running")+' '+chalk.yellow(' '+task));
}

const logEnd = function(task, start, end) 
{
    console.log(chalk.cyan("completed")+' '+chalk.yellow(' '+task)+' in '+chalk.magenta((end - start)+"ms"));
}

const getMs = function()
{
    var d = new Date;
    return d.getTime();
}


// sass task
gulp.task('sass', function()
{
    var ms = getMs();
    logStart('sass');
    pump([
        sass(configs.sass['source'], { style: 'expanded', sourcemap:true }),
        autoprefixer(configs.autoprefixer),
        cssnano(),
        rename(configs.NAME+'.css'),
        gulp.dest(configs.build),
        rename(configs.NAME+'.min.css'),
        gulp.dest(configs.sass.dest),
        gulpFn(
            function()
            {
                logEnd('sass', ms, getMs());
            }
        )
    ]);
});

// js task
gulp.task('js', function()
{
    var ms = getMs();
    logStart('js');
    pump([
        gulp.src(configs.js['source']),
        plumber(),
        babel({
            presets: [
                "react", 
                [
                  "es2015",
                  {
                    "modules": false
                  }
                ]
            ]
        }),
        sourcemaps.init(),
        concat(configs.NAME+'.js'),
        gulp.dest(configs.build),
        // uglify(),
        rename(configs.NAME+'.min.js'),
        gulp.dest(configs.js.dest),
        gulpFn(function(){
            logEnd('js', ms, getMs());
        })
    ]);
});

// watch task
gulp.task('watch', function()
{
    // watch for changes in sass
    gulp.watch(configs.sass['watch'], function(){
        sassFn();
    });
    // watch for changes on javascript
    gulp.watch(configs.js['watch'], function(){
        jsFn();
    });
});

// displays available commands
gulp.task('default', function(){
    console.log(' ');
    console.log(chalk.cyan("AVAILABLE COMMANDS"));
    console.log(' ');
    console.log("1.  gulp sass");
    console.log("2.  gulp js");
    console.log("3.  gulp watch-sass");
    console.log("4.  gulp watch-js");
    console.log("5.  gulp watch");
});