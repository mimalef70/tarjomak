window.browser = (function () {
    return window.msBrowser || window.browser || window.chrome;
})();

var allEnv = {
    optionsLoaded: false,
    options: {
        IGNORE_INPUTS: true,
    },

    injectCss: function (src) {
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = src;
        (document.head || document.documentElement).appendChild(style);
    },

    sendMessageToCurrentTab: function (message, callback) {
        var args = Array.prototype.slice.call(arguments, 0);
        browser.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            if (tabs.length > 0) {
                browser.tabs.sendMessage.apply(browser.tabs, [tabs[0].id].concat(args));
            } else {
                if (typeof callback === 'function') {
                    callback(null);
                }
            }
        });
    },
    sendMessageToAllTabs: function (message, callback) {
        var args = Array.prototype.slice.call(arguments, 0);
        browser.tabs.query({}, function (tabs) {
            if (tabs.length > 0) {
                for (var i = 0; i < tabs.length; ++i) {
                    browser.tabs.sendMessage.apply(browser.tabs, [tabs[i].id].concat(args));
                }

            }
        });
    },
    createDomElement: function (prop) {
        var el = document.createElement(prop.node);
        delete prop.node;
        el.setAttribute("class", prop.cls);
        delete prop.cls;
        for (var i in prop) {
            var attr = i;
            var val = prop[attr];
            el.setAttribute(attr, val);
        }
        return el;
    },
    escapeHtml: function (unsafe) {
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    },

    debounce: function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    getParam: function (name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
};