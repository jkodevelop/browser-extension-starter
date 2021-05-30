/* index.js */
const _browser = require("../sharedjs/browser-polyfill.js");
var B = _browser || browser;

//////////////////////////////////////////////////////////////////////////////
// example of background script listening from content script
///////////////////////////////////////////////////////////////////////////////
function handleMessage(request, sender, sendResponse) {
  if(request.hasOwnProperty("greeting")){
    console.log(`Message from the content script: ${request.greeting}`);
    sendResponse({response: "Response from background script! You clicked the page?!"});
  }else if(request.hasOwnProperty("dest") && request.dest == "default_popup"){

    // This 

    console.log(`Message from the content script for popup: ${request.key}`);
    sendResponse({response: `background resp: Got ${request.value.length} H1 texts! will store for popup`});
    // localStorage will auto convert string of array to string.join(,)
    // so to keep it as array when pulling it out
    // JSON stringify insert
    localStorage[request.key] = JSON.stringify(request.value);
  }
}

B.runtime.onMessage.addListener(handleMessage);