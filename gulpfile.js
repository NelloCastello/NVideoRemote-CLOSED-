const { src, parallel, series, watch, dest } = require('gulp');
const browser_sync      = require('browser-sync');
const concat            = require('gulp-concat');
const sass              = require('gulp-sass')(require('sass'));
const browserify        = require('gulp-browserify');
const uglify            = require('gulp-uglify-es').default;

function start() {
    process.env.DEBUG = "nvideoremote:server";

    require('./bin/www');
}

function sassBuild() {
    return src('src/sass/**/*.sass')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(concat("style.css"))
        .pipe(dest('public/stylesheets'));
}

function liveReload() {
    return browser_sync({
        proxy: `localhost:${(process.env.PORT || 3000).toString()}`,
        port: 3001
    });
}

function scriptsBuild() {
    return src("src/javascripts/main.js")
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(concat("script.js"))
        .pipe(uglify())
        .pipe(dest("public/javascripts"));
}

function watching() {
    watch([
        "views/**/*.jade",
        "public/stylesheets/**/*.css",
        "public/scripts/**/*.js"
    ]).on("change", browser_sync.reload);

    watch([
        "src/sass/**/*.sass"
    ], sassBuild);

    watch([
        "src/javascripts/**/*.js"
    ], scriptsBuild);
}

exports.default = series(
    parallel(
        start,
        watching,
        liveReload
    )
);