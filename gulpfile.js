const { src, parallel, series, watch, dest } = require('gulp');
const browser_sync      = require('browser-sync');
const concat            = require('gulp-concat');
const sass              = require('gulp-sass')(require('sass'));
const browserify        = require('browserify');
const source            = require('vinyl-source-stream');
const uglify            = require('gulp-uglify-es').default;

function start() {
    process.env.DEBUG = "nvideoremote:server";

    require('./bin/www');
}

function sassBuild() {
    return src('src/sass/**/*.sass')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(concat("style.css"))
        .pipe(dest('public/stylesheets'))
        .pipe(browser_sync.stream());
}

function liveReload() {
    return browser_sync({
        proxy: `localhost:${(process.env.PORT || 3000).toString()}`,
        port: 3001,
        open: false
    });
}

function scriptsBuild() {
    return browserify('src/javascripts/main.js', {
        debug: process.env.DEBUG? true: false,
        insertGlobals: true
    })
        .bundle()
        .pipe(source('script.js'))
        .pipe(dest('public/javascripts'))
}

function watching() {
    watch([
        "views/**/*.jade"
    ]).on("change", browser_sync.reload);

    watch([
        "src/sass/**/*.sass"
    ], sassBuild);

    watch([
        "src/javascripts/**/*.js"
    ], scriptsBuild);
}

exports.default = series(
    sassBuild,
    scriptsBuild,
    parallel(
        start,
        watching,
        liveReload
    )
);