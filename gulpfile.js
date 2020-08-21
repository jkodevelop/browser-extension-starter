const { src, dest, series } = require('gulp');

function copyStatic() {
    return src('./src/static/index.html', { allowEmpty: true }) 
        .pipe(dest('./publish'));
}

const build = series(copyStatic);

exports.build = build;

exports.default = build;