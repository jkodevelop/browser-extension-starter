/* index.js */
const _browser = require("../sharedjs/browser-polyfill.js");
var B = _browser || browser;

function handleMessage(request, sender, sendResponse) {
  console.log(`Message from the content script: ${request.greeting}`);
  sendResponse({response: "Response from background script!?"});
}

B.runtime.onMessage.addListener(handleMessage);