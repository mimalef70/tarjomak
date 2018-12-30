window.browser = (function () {
    return window.msBrowser || window.browser || window.chrome;
})();


var Popup = {
    init: function () {
        this.btnsearch = document.getElementById("search");
        this.txtquery = document.getElementById("query");
        this.container = document.getElementById("translationcontainer");
        this.loadingContainer = document.getElementById("loading");
        this.txtquery.focus();
        this.searchForSelectedText();
        this.hideContentScriptContainer();
        this.setBindings();
    },
    hideContentScriptContainer: function () {
        this.sendMessageToCurrentTab({
            action: "hidecontainer"
        });
    },
    setBindings: function () {
        this.btnsearch.addEventListener("click", this.onBtnSearchClick.bind(this));
        this.txtquery.addEventListener("keydown", this.onTxtQueryKeydown.bind(this));
        this.container.addEventListener("mousedown", this.onContainerMouseDown.bind(this));
        this.connectionPort = browser.runtime.connect({
            name: "popup"
        });
    },
    hasClass: function (element, cls) {
        var className = " " + cls + " ";
        return (" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1;
    },
    onContainerMouseDown: function (e) {
        if (e.button === 0) {
            if (this.hasClass(e.target, "speakerimg___extension")) {
                this.onBtnSpeakerMouseDown.call(this, e.target);
            }
            if (this.hasClass(e.target, "addbuttonimg___extension")) {
                this.onBtnAddButtonMouseDown.call(this, e.target);
            }
        }
    },
    onTxtQueryKeydown: function (event) {
        if (event.keyCode == 13) {
            this.processTranslation();
        }
    },
    sendMessageToCurrentTab: function (message, callback) {
        var args = Array.prototype.slice.call(arguments, 0);
        browser.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            if (tabs.length > 0) {
                browser.tabs.sendMessage.apply(browser.tabs, [tabs[0].id].concat(args));
            }
        });
    },
    searchForSelectedText: function () {
        this.sendMessageToCurrentTab({
            action: "getselectedtext"
        }, this.handleResult.bind(this));
    },
    onBtnSearchClick: function () {
        this.processTranslation();
    },
    processTranslation: function () {
        var me = this;
        if (me.txtquery.value === "") {
            return;
        }
        me.loadingContainer.style.display = "block";
        me.container.style.display = "none";
        browser.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                action: "translate",
                text: me.txtquery.value
            }, me.handleResult.bind(me));
        });
    },
    handleResult: function (response) {
        if (response) {
            this.container.innerHTML = response.html;
            this.txtquery.value = response.selectedText;
            this.loadingContainer.style.display = "none";
            this.container.style.display = "block";
        }
    }
};
document.addEventListener("DOMContentLoaded", Popup.init.bind(Popup));