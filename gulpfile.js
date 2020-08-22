const { src, dest, series, parallel } = require('gulp');
const gulpSass = require('gulp-sass'); 
const cssnano = require('gulp-cssnano'); 
const gulpRename = require('gulp-rename');

function js(){
  return src('./src/js/index.js', { allowEmpty: true })
      .pipe(gulpRename({
        basename: 'script',
        suffix: '.min'
      })) // rename javascript to script.min.js
      .pipe(dest('./publish/js')); // then copy to this location
}

function sass(){
  return src('./src/css/style.scss', { allowEmpty: true })
      .pipe(gulpSass()) // process sass 
      .pipe(cssnano()) // then minimize the css
      .pipe(dest('./publish/css')); // then copy to this location
}

function copyStatic() {
  return src('./src/static/index.html', { allowEmpty: true }) 
      .pipe(dest('./publish'));
}


const build = series(parallel(sass, js, copyStatic));


// this allows you to just run sass in command line
exports.sass = sass; // $ gulp sass
exports.js = js; // $ gulp js

exports.build = build;

exports.default = build;