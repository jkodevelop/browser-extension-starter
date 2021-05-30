// content script cannot use require
window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();
var B = window.browser || browser;

//////////////////////////////////////////////////////////////////////////
// EXAMPLE 1: onClick on the page, send message to background
//            background will respond back
//////////////////////////////////////////////////////////////////////////
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


//////////////////////////////////////////////////////////////////////////
// EXAMPLE 2: this runs when script loads into matching url then parse the website content 
//            and send date to background to be saved in localStorage
//////////////////////////////////////////////////////////////////////////
function handleResponse(message) {
  console.log(`Message from the background script:  ${message.response}`);
}

function getH1TextForPopupDisplay(){
  var matches = document.body.querySelectorAll("h1");
  var h1Texts = [];
  matches.forEach(function(h1){
    // console.log(h1.textContent);
    h1Texts.push(h1.textContent);
  });
  console.log('number of matches for h1: ', matches.length);

  var sending = B.runtime.sendMessage({
    "dest":"default_popup",
    "key": "h1",
    "value": h1Texts
  },handleResponse);  
}
// run when script is injected
getH1TextForPopupDisplay();


//////////////////////////////////////////////////////////////////////////
// EXAMPLE 3: this listens to Browser_Action messages, (can do something in dom)
//            can even communicate information back through function callback
//////////////////////////////////////////////////////////////////////////
function gotMessage (message, sender, sendResponse) {
  console.log("got message from browser action onClick");
  sendResponse(document.title);
}
B.runtime.onMessage.addListener(gotMessage);