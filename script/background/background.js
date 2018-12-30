window.browser = (function () {
    return window.msBrowser || window.browser || window.chrome;
})();

browser.runtime.onInstalled.addListener(function (details) {
    browser.tabs.create({
        url: "help.html"
    });
});

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    switch (message.action) {

        case 'closeallpopups':
            allEnv.sendMessageToAllTabs({
                action: 'closeallpopups'
            });
            break;
        default:
            break;
    }

    return true;
});