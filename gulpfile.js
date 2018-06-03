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
plumber = require('gulp-plumber'),
browserSync = require('browser-sync').create(),
connect = require('gulp-connect-php'),
path = require('path');


/**
 * here we have the configuration used
 * within this gulpfile.
 */
const configs = {
    NAME: 'calendar-plugin',
    BROWSER_SYNC: {
        PORT: 8014,
        RELOAD: browserSync.reload,
        PUBLIC_DIR: path.join(__dirname, 'examples')
    },
    js: {
        source: [path.join(__dirname, 'src/*.js'), path.join(__dirname, 'src/**/*.js')],
        watch: [path.join(__dirname, 'src/*.js'), path.join(__dirname, 'src/**/*.js')],
        dest: path.join(__dirname, 'dist/js'),
        examples: path.join(__dirname, 'examples/js')
    },
	sass: {
        source: path.join(__dirname, "sass/style.scss"),
        watch: [ path.join(__dirname, "sass/**/*.scss"), path.join(__dirname, "sass/*.scss")],
        dest: path.join(__dirname, 'dist/css'),
        examples: path.join(__dirname, 'examples/css')
    },
    images: {
        source: [path.join(__dirname, 'images/*.jpg'), path.join(__dirname, 'images/**/*.jpg'),
                path.join(__dirname, 'images/*.png'), path.join(__dirname, 'images/**/*.png')],
        watch: [path.join(__dirname, 'images/*.jpg'), path.join(__dirname, 'images/**/*.jpg'),
                path.join(__dirname, 'images/*.png'), path.join(__dirname, 'images/**/*.png')],
        dest: path.join(__dirname, 'dist/images'),
        examples: path.join(__dirname, 'examples/images'),
    },
    autoprefixer: {
        browsers: [ 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4' ]
    },
    PHP_SERVER: {
        PORT: 8040,
        PATH: path.join(__dirname, '/examples')
    }
};

/**
 * used to log the start of a running task
 * to the terminal
 * @param {string} task 
 */
const logStart = function(task) 
{
    console.log('');
    console.log(chalk.cyan("running")+' '+chalk.yellow(' '+task));
}

/**
 * displays when a task completes
 * used for determining how long a task took to run.
 * @param {string} task 
 * @param {integer} start 
 * @param {integer} end 
 */
const logEnd = function(task, start, end) 
{
    console.log(chalk.cyan("completed")+' '+chalk.yellow(' '+task)+' in '+chalk.magenta((end - start)+"ms"));
}

/**
 * returns current millisecond from unix epoch
 */
const getMs = function()
{
    var d = new Date;
    return d.getTime();
}

/**
 * sass tasks
 */
gulp.task('sass', function()
{
    var ms = getMs();
    logStart('sass');
    pump([
        sass(configs.sass['source'], { style: 'expanded', sourcemap:true }),
        autoprefixer(configs.autoprefixer),
        rename(configs.NAME+'.css'),
        gulp.dest(configs.sass.dest),
        gulp.dest(configs.sass.examples),
        cssnano(),
        rename(configs.NAME+'.min.css'),
        gulp.dest(configs.sass.dest),
        gulp.dest(configs.sass.examples),
        browserSync.stream(),
        gulpFn(
            function()
            {
                logEnd('sass', ms, getMs());
            }
        ),
    ]);
});

/**
 * javascrip task for js files
 */
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
        gulp.dest(configs.js.dest),
        gulp.dest(configs.js.examples),
        uglify(),
        rename(configs.NAME+'.min.js'),
        gulp.dest(configs.js.dest),
        gulp.dest(configs.js.examples),
        browserSync.stream(),
        gulpFn(function(){
            logEnd('js', ms, getMs());
        })
    ]);
});

/**
 * images task for js files
 */
gulp.task('images', function()
{
    var ms = getMs();
    logStart('images');
    pump([
        gulp.src(configs.images.source),
        plumber(),
        sourcemaps.init(),
        gulp.dest(configs.images.dest),
        gulp.dest(configs.images.examples),
        gulpFn(function(){
            logEnd('images', ms, getMs());
        })
    ]);
});

/**
 * watch task
 */
gulp.task('watch', function()
{
    // watch for changes in sass files
    gulp.watch(configs.sass['watch'], ['sass']);
    // watch for changes in javascript files
    gulp.watch(configs.js['watch'], ['js']);
    // watch for changes in javascript files
    gulp.watch(configs.images['watch'], ['images']);
});

/**
 * browser sync server gulp task
 */
gulp.task('browser_sync', function()
{
    /**
     * this initializes the browser sync server on port 8014
     */
	browserSync.init({
		host: 'localhost',
        port: configs.BROWSER_SYNC.PORT,
        logLevel: 'silent',
        notify: false,
        injectChanges: true,
        injectFileTypes: ['css'],
        files: [configs.sass.examples+'/*.css'],
		server: {
			baseDir: [configs.BROWSER_SYNC.PUBLIC_DIR]
		}
	});

    /**
     * watch for changes in js, plugins and base directory and fire
     * a reload the browser if any change was made to
     * file whithin them
     */
	gulp.watch(configs.js.examples+'/*.js').on('change', configs.BROWSER_SYNC.RELOAD);
	gulp.watch(configs.images.examples+'/*.*').on('change', configs.BROWSER_SYNC.RELOAD);
	gulp.watch('examples/plugins/**/*.*').on('change', configs.BROWSER_SYNC.RELOAD);
	gulp.watch('examples/*.*').on('change', configs.BROWSER_SYNC.RELOAD);
});

/**
 * this task starts a php server in the background
 */
gulp.task('php-server', function(){
    connect.server({
        base: configs.PHP_SERVER.PATH,
        port: configs.PHP_SERVER.PORT,
        keepalive: true
    });
    console.log(configs.PHP_SERVER.PATH);
    console.log('Running php server on '+chalk.magenta("http://localhost:"+configs.PHP_SERVER.PORT));
});

/**
 * this will run the sass and javascript tasks and start watching
 * for sass and javascript changes and then finaly start the browser
 * sync server which helps to preview the work.
 */
gulp.task('start', ['sass', 'js', 'images', 'watch', 'browser_sync', 'php-server']);

/**
 * the available commands within this gulp file
 */
gulp.task('default', function(){
    console.log(' ');
    console.log(chalk.cyan("AVAILABLE COMMANDS"));
    console.log(' ');
    console.log("1.  gulp sass");
    console.log("2.  gulp js");
    console.log("3.  gulp watch-sass");
    console.log("4.  gulp watch-js");
    console.log("5.  gulp watch");
    console.log("5.  gulp start");
});