'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var fs = require('fs');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var yaml = require('js-yaml');
var process = require('process');
var spawn = require('cross-spawn-async');

/**
 * Get CLI args
 */
var FOLDER;
for (var i = process.argv.length; i > 0; i--) {
    var arg = process.argv[i];
    var nextArg = process.argv[i + 1];

    if (arg == '--folder' && nextArg) {
        FOLDER = process.cwd() + '/' + nextArg;
    }
}

if (!FOLDER) {
    var example = 'gulp --folder opencode.commercesuite.com.br';
    util.log(util.colors.red('Error: missing param: --folder, ex: ' + example));
    process.exit(1);
}

/**
 * Get OpenCode config file
 */
var configYML = FOLDER + '/config.yml';
var configOpenCode = yaml.safeLoad(fs.readFileSync(configYML, 'utf8'));
const URL = configOpenCode[':preview_url'];

if (!URL) {
    util.log(util.colors.red('Error: Did you configured opencode? Check your file: ' + configYML));
    process.exit(1);
}

const CSSPATH = FOLDER + '/css/';
const JSPATH = FOLDER + '/js/';
const IMGPATH = FOLDER + '/img/';
const autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', () => {
  gulp.src(CSSPATH + 'sass/theme.min.scss')
    .pipe(sass({errLogToConsole: true}))
    .on('error', util.log)
    .pipe(concat('theme.min.css'))
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest(CSSPATH));
});



gulp.task('js', () => {
  gulp.src(JSPATH + "modules/*.js")
    .pipe(concat("theme.min.js"))
    .pipe(uglify({"compress": false}))
    .pipe(gulp.dest(JSPATH));
});

var imageFiles = [
    IMGPATH + '**/*.{png,jpg,gif,svg}',
    '!'+ IMGPATH + 'dist/*'
];


gulp.task('opencode', () => {
    process.chdir(FOLDER);

    var opencode = spawn('opencode', ['watch']);

    opencode.stdout.on('data', (data) => {
        var output = util.colors.green(data);
        if (data.indexOf('Error') > -1) {
            output = util.colors.bgRed(data);
        }
        process.stdout.write(output);
    });

    opencode.stderr.on('data', (data) => {
        process.stdout.write(util.colors.bgRed(data));
    });
});

gulp.task('watch', () => {
    gulp.watch(CSSPATH + 'sass/*', ['sass']);
    gulp.watch(JSPATH + 'modules/*.js', ['js']);
});

gulp.task('default', [
    'watch',
    'opencode',
    'sass',
    'js',
 ]);
