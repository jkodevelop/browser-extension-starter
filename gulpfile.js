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

const fsExtra = require('fs-extra');

function clean(done){
  fsExtra.emptyDirSync('./publish');
  done();
}

function jsTask(pattern, outPath, params){
  return src(pattern, { allowEmpty: true })
      .pipe(gulpSourcemap.init())
      .pipe(gulpBrowserify())
      .pipe(gulpBabel({
        presets: ['@babel/env']
      })) // babel process bundle
      .pipe(gulpUglify())
      .pipe(gulpSourcemap.write('.', {
        mapFile: function(mapFilePath) {
          // source map files are named *.map instead of *.js.map
          return mapFilePath.replace(params.mapSource, params.mapDest);
        }
      }))
      .pipe(gulpRename({
        basename: params.renameBasename,
        suffix: params.renameSuffix
      })) // rename javascript to script.min.js
      .pipe(dest(outPath)); // then copy to this location
}

function browserActionJS(){
  return jsTask('./src/js/browser_action/**/*.js','./publish/js',{
    'mapSource': 'index.js.map',
    'mapDest': 'script.min.map',
    'renameBasename': 'script',
    'renameSuffix': '.min'
  });
}
function contentScriptJS(){
  return jsTask('./src/js/content_scripts/**/*.js','./publish/js',{
    'mapSource': 'index.js.map',
    'mapDest': 'contentscript.min.map',
    'renameBasename': 'contentscript',
    'renameSuffix': '.min'
  });
}
function backgroundJS(){
  return jsTask('./src/js/background/**/*.js','./publish/js',{
    'mapSource': 'index.js.map',
    'mapDest': 'background.min.map',
    'renameBasename': 'background',
    'renameSuffix': '.min'
  });
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
  noCleanBuild();
  watch('./src/css/**/*.scss', { delay: 750 }, sass);
  watch('./src/js/browser_action/**/*.js', { delay: 750 }, browserActionJS); // wait 750ms later before running the task js()
  watch('./src/js/content_scripts/**/*.js', { delay: 750 }, contentScriptJS);
  watch('./src/static/**/*', copyStatic);

  // option 1: this lets you watch 2+ sets of folder and run the same task
  watch(['./src/js/background/**/*.js','./src/js/sharedjs/**/*.js'], { delay: 750 }, backgroundJS);
  // option 2: or use as many watch function as you need running the same tasks
  // watch('./src/js/background/**/*.js', { delay: 750 }, backgroundJS);
  // watch('./src/js/sharedjs/**/*.js', { delay: 750 }, backgroundJS);
  
}

function sassInject(){
  // stream data to static server using browser-sync.create().steam()
  // this allows browser-sync 
  return sass().pipe(browserSync.stream());
}

function jsInject(){
  return browserActionJS().pipe(browserSync.stream());
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
  watch("./src/js/browser_action/**/*.js", { delay: 250 }, jsInject); // watch js changes, then inject new script.min.js
  watch('./src/static/**/*', series(copyStatic, reloadServer)); // this is to force a reload on the browser if any new static content is updated
}
// dev (gulp task): start by building the files into ./publish folder then run the server
const dev = series(clean,parallel(sass, browserActionJS, contentScriptJS, backgroundJS, copyStatic), browserSyncServer);

const build = series(clean,parallel(sass, browserActionJS, contentScriptJS, backgroundJS, copyStatic));

// special case for use in watchActivities() 
// added because web-ext runner for Firefox web-extension development needs ./publish/manifest.json to exist to load
// if you clean while running web-ext, then firefox won't be able to import and setup the Web Extension
// $ npm run webext
const noCleanBuild = parallel(sass, browserActionJS, contentScriptJS, backgroundJS, copyStatic); 

// this allows you to just run sass in command line
exports.sass = sass; // $ gulp sass
exports.js = browserActionJS; // $ gulp js
exports.copyStatic = copyStatic; // $ gulp copyStatic

exports.build = build;
exports.noCleanBuild = noCleanBuild;
exports.watchActivities = watchActivities;
exports.dev = dev;

exports.clean = clean;

exports.default = watchActivities;