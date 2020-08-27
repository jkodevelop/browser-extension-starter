// content script cannot use require
window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();
var B = window.browser || browser;

function handleClickResponse(message) {
  document.body.style.border = "5px solid green";
  console.log(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
  document.body.style.border = "5px solid red";
  console.log(`Error: ${error}`);
}

function notifyBackgroundPage(e) {
  document.body.style.border = "5px solid blue";
  // this is lowest common denominator
  // A
  var sending = B.runtime.sendMessage({
    greeting: "Greeting from the content script"
  },handleClickResponse);

  // this uses promise, only worked for mozilla 2020, chrome didn't allow it
  // B
  // var sending = B.runtime.sendMessage({
  //   greeting: "Greeting from the content script"
  // });
  // sending.then(handleResponse, handleError);  
}

window.addEventListener("click", notifyBackgroundPage);
document.body.style.border = "5px solid black";

function handleResponse(message) {
  console.log(`Message from the background script:  ${message.response}`);
}

function getH2TextForPopupDisplay(){
  var matches = document.body.querySelectorAll(".section h2");
  var h2Texts = [];
  matches.forEach(function(h2){
    // console.log(h2.textContent);
    h2Texts.push(h2.textContent);
  });
  console.log('number of matches for .section h2:', matches.length);

  var sending = B.runtime.sendMessage({
    "dest":"default_popup",
    "key": "h2",
    "value": h2Texts
  },handleResponse);  
}
// run when script is injected
getH2TextForPopupDisplay();
