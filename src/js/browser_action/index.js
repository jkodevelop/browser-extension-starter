const { onClick } = require('./helpers.js');
console.log('Hello Web Extension!');
document.getElementById('HellWebext').addEventListener('click', onClick, false);
// if the content script has sent data to background then it will store the data in localStorage
// the value if not a string should be a JSON.stringify string.
// so JSON.parse() to restore the stored object JSON form
var msgFromContentScript = localStorage.getItem("h2") !== null ? JSON.parse(localStorage["h2"]) : "nothing stored in localStorage";
document.getElementById('MainContent').innerText = msgFromContentScript.length;