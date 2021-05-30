# Browser Extensions starter [2021]
This is a starter pack for **browser extensions** (aka web-extensions). The purpose of this repo is allow quick start of a  browser extensions with basic manifest setup and scripts, it does not contain all available function of a browser extension project. For more comprehensive example list go to https://github.com/mdn/webextensions-examples. But it does provide a simple guide for the purposes of different context scripts (browser_action/content_script/background). The project also includes a simple step by step guide of **gulp** to streamline and build the project for publishing. 

The current state of the code has been tested to work for IE edge/Chrome/Firefox. 

```

Please fork the project to start a new browser extension

```

### prerequisite:
1. node 12+
2. firefox
3. make sure to run `npm install` to install the package

## usage: Development
`npm run webext` then web-ext module will load a firefox with the extension loaded. 

For development these libraries are used/enabled:
- web-ext
- gulp
- babel
- sass/scss
- browser-sync
- browserify

Once the firefox is loaded, changes code in `./src`; it will be watched and updated in the browser. The folder `./publish` is the export of the browser extension. In chrome or IE edge `./publish` can be used for "load unpacked extensions", this is the source code for the final build out browser extensions.

## Tutorial and Guides
Please use git history to see the step by step guide for gulp setup to browser extensions setup and examples of different functionalities for browser extensions. `source.md` are sources/referecnes and other tutorials used to build this project.