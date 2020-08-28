const { onClick, domId } = require('./helpers.js');
console.log('Hello Web Extension!');
domId('HellWebext').addEventListener('click', onClick, false);
// if the content script has sent data to background then it will store the data in localStorage
// the value if not a string should be a JSON.stringify string.
// so JSON.parse() to restore the stored object JSON form
var msgFromContentScript = localStorage.getItem("h2") !== null ? JSON.parse(localStorage["h2"]) : 0;
domId('MainContent').innerText = msgFromContentScript.length;