require('dotenv').config();

var fs = require('fs');
var gulp = require("gulp");
var sass = require("gulp-sass")(require("sass"));
var concat = require('gulp-concat');
var minifyCSS = require('gulp-cssmin');
var uglify = require('gulp-uglify');
const alert = require('ansi-colors');

const Tray = require('@tray-tecnologia/tray-cli').default;

var args = process.argv.join(' ')

    folder: (args.match(/--(folder|dir)(=|\s)?([\d\w\-]+)( --)?/)||[])[3] || '',
    tray_api_key: (args.match(/--key(=|\s)?([\d\w]+)( --)?/)||[])[2] || '',
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

const upload = file => {
    console.log('Uploading:', file)
    api.upload([
        file
    ]).then(res => {
        if(res.succeed) {
            console.log(alert.green(`File ${file} has been uploaded`))
        }
        else {
            res.fails.forEach(fail => {
                console.log(alert.red(`File ${fail.file} not uploaded ${fail.error}`))
            })
        }
    })
}

const remove = file => {
    console.log('Removing:', file)
    api.remove([
        file
    ]).then(res => {
        if(res.succeed) {
            console.log(alert.green(`File ${file} has been removed`))
        }
        else {
            res.fails.forEach(fail => {
                console.log(alert.red(`File ${fail.file} not removed ${fail.error}`))
            })
        }
    })
}

gulp.task('watch', () => {
    gulp.watch(FILES_TO_UPLOAD).on('change', upload);
    gulp.watch(FILES_TO_UPLOAD).on('add', upload);
    gulp.watch(FILES_TO_UPLOAD).on('unlink', remove);
    gulp.watch(CSSPATH + 'sass/*', gulp.series('sass'));
    gulp.watch(JSPATH + 'modules/*.js', gulp.series('js'));
});

gulp.task('download', cb => {
    console.log(alert.green('Starting downloading theme files...'))
    api.download().then(res => {
        if(res.succeed) {
            console.log(alert.green(`Done download theme files!`))
        }
        else {
            res.fails.forEach(fail => {
                console.log(alert.red(`Error download ${fail.file}: ${fail.error}`))
            })
        }
        cb();
    }).catch(() => cb())
});

gulp.task('default', gulp.parallel('watch', 'sass','js' ));