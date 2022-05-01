require('dotenv').config();

var gulp = require("gulp");
var sass = require("gulp-sass")(require("sass"));
var concat = require('gulp-concat');
var minifyCSS = require('gulp-cssmin');
var spawn = require('cross-spawn');
var uglify = require('gulp-uglify');
const alert = require('ansi-colors');

const Tray = require('@tray-tecnologia/tray-cli').default;

const api = new Tray({
    key: process.env.TRAY_API_KEY,
    password: process.env.TRAY_API_PASSWORD,
    themeId: process.env.TRAY_THEME_ID,
    debug: false,
});

const JSPATH = './js/';
const CSSPATH = './css/';

const FILES_TO_UPLOAD = [
    './css/**/*',
    './js/**/*',
    './elements/**/*',
    './layouts/**/*',
    './pages/**/*',
    './configs/**/*',
    './img/**/*',
]

gulp.task('js', (done) => {
    gulp.src(JSPATH + "modules/*.js")
    .pipe(concat("theme.min.js"))
    .pipe(uglify({"compress": false}))
    .pipe(gulp.dest(JSPATH));
    done()
});


gulp.task('sass', function(done) { 
    gulp
    .src(CSSPATH + 'sass/theme.min.scss')
    .pipe(sass())
    .pipe(concat('theme.min.css'))
    .on("error", sass.logError)
    .pipe(minifyCSS())
    .pipe(gulp.dest(CSSPATH))
    done()
})

gulp.task('opencode', () => {
    process.chdir(FOLDER);

    var opencode = spawn('opencode', ['watch']);

    opencode.stdout.on('data', (data) => {
        var output = alert.green(data);
        if (data.indexOf('Error') > -1) {
            output = alert.red(data);
        }
        process.stdout.write(output);
    });

    opencode.stderr.on('data', (data) => {
        process.stdout.write(alert.red(data));
    });
});

gulp.task('watch', () => {
    gulp.watch(CSSPATH + 'sass/*', gulp.series('sass'));
    gulp.watch(JSPATH + 'modules/*.js', gulp.series('js'));
});

gulp.task('default', gulp.parallel('watch', 'opencode', 'sass','js' ));
