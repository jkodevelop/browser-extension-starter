// content script cannot use require
window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();
var B = window.browser || browser;

function handleResponse(message) {
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
  },handleResponse);

  // this uses promise, only worked for mozilla 2020, chrome didn't allow it
  // B
  // var sending = B.runtime.sendMessage({
  //   greeting: "Greeting from the content script"
  // });
  // sending.then(handleResponse, handleError);  
  
}

window.addEventListener("click", notifyBackgroundPage);

document.body.style.border = "5px solid black";