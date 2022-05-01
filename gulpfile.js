require('dotenv').config();

var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require('gulp-concat');
var minifyCSS = require('gulp-cssmin');
var spawn = require('cross-spawn');
var uglify = require('gulp-uglify');
const alert = require('ansi-colors');

var FOLDER;
for (var i = process.argv.length; i > 0; i--) {
    var arg = process.argv[i];
    var nextArg = process.argv[i + 1];

    if (arg == '--folder' && nextArg) {
        FOLDER = process.cwd() + '/' + nextArg;
    }
}

const JSPATH = FOLDER + '/js/';
const CSSPATH = FOLDER + '/css/';


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
