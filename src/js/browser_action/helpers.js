const _browser = require("../sharedjs/browser-polyfill.js");
var B = _browser || browser;

function domId(query){
  return document.getElementById(query);
}
module.exports.domId = domId;

function handleResponse(htmlTitle) {
  document.body.style.border = "5px solid blue";
  domId('MainContent').innerText = `Title of site: ${htmlTitle}`;
  domId('HellWebext').innerText = "disabled";
  domId('HellWebext').disabled = true;
}

function onClick(e) {
  B.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(!tabs[0].url.includes('https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions')) {
      alert('please go to https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions for demonstration.')
      return;
    }
    const payload = {
      "message": "from browser action"
    };
    B.tabs.sendMessage(tabs[0].id, payload, handleResponse);
  });
}
module.exports.onClick = onClick;

