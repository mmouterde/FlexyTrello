chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.indexOf("trello.com/b/") > 0)
        chrome.pageAction.show(tab.id);
    else
        chrome.pageAction.hide(tab.id);
});

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.command == 'saveToken') {
        localStorage.setItem('trello_token', request.token);
        sendResponse();
        return true;
    }

    if (request.command == 'getBoardDetail') {
        return callTrello('boards/' + request.id, {lists:'open',list_fields:'name'},sendResponse);
    }

    if (request.command == 'getBoardId') {
        return callTrello('cards/' + request.id + '/list', {fields:'idBoard'},sendResponse);
    }
});

function callTrello(url, fields,sendResponse) {
    trelloInit();
    Trello.rest('GET', url, fields, function (data) {
        sendResponse(data);
    }, function (data) {
        sendResponse(data);
    });
    return true;
}

function trelloInit() {
    Trello.setKey(APP_KEY);
    Trello.setToken(localStorage.getItem('trello_token'));
}
