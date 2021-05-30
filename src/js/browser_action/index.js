const _browser = require("../sharedjs/browser-polyfill.js");
var B = _browser || browser;

const { onClick, domId } = require('./helpers.js');
console.log('Hello Web Extension!');
domId('HellWebext').addEventListener('click', onClick, false);
// if the content script has sent data to background then it will store the data in localStorage
// the value if not a string should be a JSON.stringify string.
// so JSON.parse() to restore the stored object JSON form
var msgFromContentScript = localStorage.getItem("h1") !== null ? JSON.parse(localStorage["h1"]) : 0;
if(msgFromContentScript){
  domId('MainContent').innerText = "# of <h1> found: " + msgFromContentScript.length;
}else{
  domId('MainContent').innerText = "";  
}

// on popup load, check the active tab url and change some of the content's html
// hide link to https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions if tab is already there
B.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
  if(tabs[0].url === "https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions"){
    domId('TestContentScript').classList.add("hide-it");
  }else{
    domId('TestContentScript').classList.remove("hide-it");
  }
});