function defaultTask(cb) {
  // place code for your default task here
  console.log('Hello Gulp');
  cb(); // tells gulp you are done
}

exports.default = defaultTask