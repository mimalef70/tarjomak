window.browser = (function () {
    return window.msBrowser || window.browser || window.chrome;
})();

Translate.loadOptions(function () {
    if (window.self === window.top) {
        browser.runtime.sendMessage({
            action: 'DOMContentLoaded',
        });
    }
});
browser.storage.onChanged.addListener(Translate.loadOptions.bind(Translate));

var debouncedKeydown = Translate.debounce(Translate.keydown.bind(Translate), 250);
document.addEventListener("keydown", debouncedKeydown);

document.addEventListener("mousedown", Translate.hideContainer.bind(Translate));

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (window.self === window.top) {
        if (message.action === "translate") {
            Translate.translate(message.text, function (resp) {
                var html = this.generateContainerHTML(resp);
                sendResponse({
                    html: html,
                    selectedText: message.text
                });
            });
        }
    }
    if (message.action === "getselectedtext") {
        var seltext = Translate.getSelectionText();
        if (seltext !== "") {
            Translate.translate(seltext, function (resp) {
                var html = this.generateContainerHTML(resp);
                sendResponse({
                    html: html,
                    selectedText: seltext.trim()
                });
            });
        }
    }
    if (message.action === "hidecontainer") {
        Translate.hideContainer();
    }
    if (message.action === "closeallpopups") {
        Translate.closePopup();
    }
    return true;
});

if (window.self === window.top) {
    var mainCss = browser.extension.getURL('styles/popup_inject.css');
    allEnv.injectCss(mainCss);
}