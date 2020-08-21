const { src, dest, series, parallel } = require('gulp');
const gulpSass = require('gulp-sass'); 
const cssnano = require('gulp-cssnano'); 

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


const build = series(parallel(sass, copyStatic));


// this allows you to just run sass in command line
exports.sass = sass; // $ gulp sass

exports.build = build;

exports.default = build;