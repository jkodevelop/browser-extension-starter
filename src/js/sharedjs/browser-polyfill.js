var browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();
module.exports = browser;