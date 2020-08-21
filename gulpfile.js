const { src, dest, series, parallel } = require('gulp');
const gulpSass = require('gulp-sass'); 

function sass(){
  return src('./src/css/style.scss', { allowEmpty: true })
      .pipe(gulpSass())     
      .pipe(dest('./publish/css'));
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