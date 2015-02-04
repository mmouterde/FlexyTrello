chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.indexOf("trello.com/b/") > 0)
        chrome.pageAction.show(tab.id);
    else
        chrome.pageAction.hide(tab.id);
});
/*
chrome.pageAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, {
        code: 'flexyfn();'
    }, function () {
        chrome.pageAction.hide(tab.id);
    });
});
*/