const { src, dest, series, parallel, watch } = require('gulp');
const gulpSass = require('gulp-sass'); 
const cssnano = require('gulp-cssnano'); 
const gulpRename = require('gulp-rename');
const gulpBrowserify = require('gulp-browserify');
const gulpBabel = require('gulp-babel');
const gulpUglify = require('gulp-uglify');
const gulpSourcemap = require('gulp-sourcemaps');
const gulpConcat = require('gulp-concat');

function js(){
  return src('./src/js/index.js', { allowEmpty: true })
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
  return src('./src/static/index.html', { allowEmpty: true }) 
      .pipe(dest('./publish'));
}

const build = series(parallel(sass, js, copyStatic));

function watchActivities() {
  build();
  watch('./src/css/**/*.scss', { delay: 750 }, sass);
  watch('./src/js/index.js', { delay: 750 }, js); // wait 750ms later before running the task js()
  watch('./src/static/index.html', copyStatic);
}


// this allows you to just run sass in command line
exports.sass = sass; // $ gulp sass
exports.js = js; // $ gulp js
exports.copyStatic = copyStatic; // $ gulp copyStatic

exports.build = build;
exports.watchActivities = watchActivities;

exports.default = watchActivities;