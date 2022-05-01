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

const PARAMS = {
    folder: (args.match(/--(folder|dir)(=|\s)?([\d\w\-]+)( --)?/)||[])[3] || '',
    tray_api_key: (args.match(/--key(=|\s)?([\d\w]+)( --)?/)||[])[2] || '',
    tray_api_password: (args.match(/--(password|pass)(=|\s)?([\d\w]+)( --)?/)||[])[3] || '',
    tray_theme_id: (args.match(/--theme(=|\s)?([\d]+)( --)?/)||[])[2] || '',
    file: (args.match(/--file(=|\s)?([\d\w\.\-\/]+)( --)?/)||[])[2] || '',
}

const CONFIG = {
    key: PARAMS.tray_api_key || process.env.TRAY_API_KEY,
    password: PARAMS.tray_api_password || process.env.TRAY_API_PASSWORD,
    themeId: PARAMS.tray_theme_id || process.env.TRAY_THEME_ID,
    debug: false,
}

const api = new Tray(CONFIG);

const FOLDER = PARAMS.folder || `theme-${CONFIG.themeId}`

if (!fs.existsSync(FOLDER)){
    fs.mkdirSync(FOLDER);
}

process.chdir(FOLDER);

const JSPATH = `js/`;
const CSSPATH = `css/`;

const FILES_TO_UPLOAD = [
    `css/**/*`,
    `js/**/*`,
    `elements/**/*`,
    `layouts/**/*`,
    `pages/**/*`,
    `configs/**/*`,
    `img/**/*`,
]

const upload = files => {
    console.log('Uploading:', files)
    api.upload(files ? files.split(',') : null).then(res => {
        if(res.succeed) {
            console.log(alert.green(`File ${files} has been uploaded`))
        }
        else {
            res.fails.forEach(fail => {
                console.log(alert.red(`File ${fail.file} not uploaded ${fail.error}`))
            })
        }
    })
}

const remove = files => {
    console.log('Removing:', files)
    api.remove(files.split(',')).then(res => {
        if(res.succeed) {
            console.log(alert.green(`File ${files} has been removed`, files))
        }
        else {
            res.fails.forEach(fail => {
                console.log(alert.red(`File ${fail.file} not removed ${fail.error}`))
            })
        }
    })
}

const download = files => {
    console.log(alert.green('Starting downloading theme files...', files))
    api.download(files ? files.split(',') : null).then(res => {
        console.log(res)
        if(res.succeed) {
            console.log(alert.green(`Done download files!`, files))
        }
        else {
            res.fails.forEach(fail => {
                console.log(alert.red(`Error download ${fail.file}: ${fail.error}`))
            })
        }
    }).catch(err => {
      console.log(alert.red(`An error occurred while downloading ${PARAMS.file}`))
    })
}

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

gulp.task('upload', cb => {
    upload(PARAMS.file)
    cb()
});

gulp.task('download', cb => {
    download(PARAMS.file)
    cb()
});

gulp.task('watch', () => {
    gulp.watch(FILES_TO_UPLOAD).on('change', upload);
    gulp.watch(FILES_TO_UPLOAD).on('add', upload);
    gulp.watch(FILES_TO_UPLOAD).on('unlink', remove);
    gulp.watch(CSSPATH + 'sass/*', gulp.series('sass'));
    gulp.watch(JSPATH + 'modules/*.js', gulp.series('js'));
});

gulp.task('default', gulp.parallel('watch', 'sass','js' ));