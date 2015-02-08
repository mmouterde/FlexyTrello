var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var cssContent = data.load('override.css');
pageMod.PageMod({
  include: "https://www.trello.com/b/*",
  attachTo: ["existing", "top"],
  contentScriptFile: [data.url("jquery-1.7.1.min.js"),data.url("FlexyTrello.js")],
  contentScriptOptions: {
    cssContent: cssContent,
  }
});