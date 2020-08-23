const { src, dest, series, parallel, watch } = require('gulp');
const gulpSass = require('gulp-sass'); 
const cssnano = require('gulp-cssnano'); 
const gulpRename = require('gulp-rename');
const gulpBrowserify = require('gulp-browserify');
const gulpBabel = require('gulp-babel');
const gulpUglify = require('gulp-uglify');
const gulpSourcemap = require('gulp-sourcemaps');
const gulpConcat = require('gulp-concat');

const browserSync = require('browser-sync').create();

function js(){
  return src('./src/js/**/*.js', { allowEmpty: true })
      .pipe(gulpSourcemap.init())
      .pipe(gulpBrowserify())
      .pipe(gulpBabel({
        presets: ['@babel/env']
      })) // babel process bundle
      .pipe(gulpUglify())
      .pipe(gulpSourcemap.write('.', {
        mapFile: function(mapFilePath) {
          // source map files are named *.map instead of *.js.map
          return mapFilePath.replace('index.js.map', 'script.min.map');
        }
      }))
      .pipe(gulpRename({
        basename: 'script',
        suffix: '.min'
      })) // rename javascript to script.min.js
      .pipe(dest('./publish/js')); // then copy to this location
}

function sass(){
  return src('./src/css/**/*.scss', { allowEmpty: true })
      .pipe(gulpSass()) // process sass 
      .pipe(cssnano()) // then minimize the css
      // concat file order by alphabet
      .pipe(gulpConcat('style.css')) // combine all css to one, name it style.css
      .pipe(dest('./publish/css')); // then copy to this location
}

function copyStatic() {
  return src('./src/static/**/*', { allowEmpty: true }) 
      .pipe(dest('./publish'));
}

function watchActivities() {
  build();
  watch('./src/css/**/*.scss', { delay: 750 }, sass);
  watch('./src/js/**/*.js', { delay: 750 }, js); // wait 750ms later before running the task js()
  watch('./src/static/**/*', copyStatic);
}

function sassInject(){
  // stream data to static server using browser-sync.create().steam()
  // this allows browser-sync 
  return sass().pipe(browserSync.stream());
}

function jsInject(){
  return js().pipe(browserSync.stream());
}

function reloadServer() {
  return browserSync.reload();
}
function browserSyncServer(){
  // static server
  browserSync.init({
    server: {
        baseDir: "./publish"
    }
  });

  // this in essence takes over watchActivities() because it will also inject the data to the browser using browser-sync
  watch("./src/css/**/*.scss", { delay: 250 }, sassInject); // watch scss changes, then inject the updated new css file to browser without refresh
  watch("./src/js/**/*.js", { delay: 250 }, jsInject); // watch js changes, then inject new script.min.js

  watch('./src/static/**/*', series(copyStatic, reloadServer)); // this is to force a reload on the browser if any new static content is updated
}
// dev (gulp task): start by building the files into ./publish folder then run the server
const dev = series(parallel(sass, js, copyStatic), browserSyncServer);

const build = series(parallel(sass, js, copyStatic));

// this allows you to just run sass in command line
exports.sass = sass; // $ gulp sass
exports.js = js; // $ gulp js
exports.copyStatic = copyStatic; // $ gulp copyStatic

exports.build = build;
exports.watchActivities = watchActivities;
exports.dev = dev;

exports.default = watchActivities;