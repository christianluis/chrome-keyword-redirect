chrome.omnibox.onInputEntered.addListener(function (text) {
    chrome.storage.sync.get('ninniaKeywordRedirects', function (data) {
        var redirects = data.ninniaKeywordRedirects;
        var match = redirects.find((item) => item.keyword === text);
        if (match) {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                chrome.tabs.update(tab.id, { url: match.target });
            });
        }
    });
});
