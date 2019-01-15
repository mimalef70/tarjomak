window.browser = (function () {
    return window.msBrowser || window.browser || window.chrome;
})();

var Translate = {
    container: null,
    dudakPayi: 5,
    words: null,
    xhrUrl: "https://api.targoman.com/v9.1/rest/translate/?token=Extension-bca2A2UWfVMZv9kBw&dir=en2fa&abadis=true&text=[TRANSLATE_TEXT]",
    get: function (url, callback) {
        var xhr = new XMLHttpRequest();
        var me = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var json = null;
                try {
                    json = JSON.parse(xhr.responseText);
                    callback.call(me, json, xhr);
                } catch (e) {
                    callback.call(me, false, xhr);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    },
    getSelectionText: function () {
        var sel = window.getSelection();
        var html = sel.toString();
        return html.trim();
    },
    getSelectionTextPos: function () {
        var ret = null;
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0);
            range.collapse(true);
            var dummy = document.createElement("span");
            range.insertNode(dummy);
            var rect = dummy.getBoundingClientRect();
            ret = {
                x: rect.left,
                y: rect.top,
                width: rect.right - rect.left,
                height: rect.bottom - rect.top
            };
            dummy.parentNode.removeChild(dummy);
        }
        return ret;
    },
    translate: function (text, callback) {
        var me = this;
        var url = this.xhrUrl.replace(/\[TRANSLATE_TEXT\]/g, encodeURIComponent(text));
        this.get(url, callback.bind(me));
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
    isInput: function (el) {
        var inputTypes = ["password", "textarea", "text"];
        return inputTypes.indexOf(el.type) > -1;
    },
    handleResult: function (googleJson) {
        var translated = this.generateContainerHTML(googleJson);
        if (!this.container) {
            var props = {
                node: "div",
                cls: "tarjomak_popup",
                style: "display:none;"
            };
            this.container = this.createDomElement(props);
            document.getElementsByTagName("body")[0].appendChild(this.container);
        }

        this.container.innerHTML = '<span class="tarjomak_logo" /></span>' + '<span id="translated-text">' + translated + '</span>' + '<button class="copy_btn hint--left hint--rounded" aria-label="کپی متن" data-clipboard-target="#translated-text"><span class="copy_logo" /></span></button>';
        new ClipboardJS('.copy_btn');
        this.positionContainer(this.container);
    },
    hasClass: function (element, cls) {
        var className = " " + cls + " ";
        return (" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1;
    },
    escapeHtml: function (unsafe) {
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    },
    generateContainerHTML: function (googleJson) {
        var translated = '';
        if (googleJson.hasOwnProperty("tr")) {
            if (googleJson.tr.hasOwnProperty('simple')) {
                translated = googleJson.tr.simple;
            }
        }

        // if(googleJson.hasOwnProperty("abadis")) {
        //     var result = JSON.parse(googleJson.abadis.replace(/&#\d+;/g, function (d) {
        //         return String.fromCharCode(parseInt(d.substring(2, d.length - 1)))
        //     }));
        // }
        return translated;
    },
    positionContainer: function (el) {
        var selectedPos = this.getSelectionTextPos();
        el.style.display = "block";
        var top = (selectedPos.y - el.offsetHeight - this.dudakPayi);
        top = top > 0 ? top : 0;
        var left = selectedPos.x;
        if (document.body.offsetWidth - left < el.offsetWidth) {
            left = (document.body.offsetWidth - el.offsetWidth - this.dudakPayi);
        }
        el.style.top = top + "px";
        el.style.left = left + "px";
    },
    keydown: function (e) {
        this.hideContainer();
        if (e.shiftKey) {
            if (!this.isInput(e.target) || (this.isInput(e.target) && !allEnv.options.IGNORE_INPUTS)) {
                var text = this.getSelectionText().trim();
                if (text !== "") {
                    this.translate(text, this.handleResult);
                }
            }
        }
    },
    hideContainer: function (e) {
        if (typeof e !== "undefined") {
            if (this.container !== null && this.container.contains(e.target)) {
                return;
            }
        }

        browser.runtime.sendMessage({
            action: 'closeallpopups'
        });
    },

    closePopup: function () {
        if (this.container) {
            this.container.style.display = "none";
        }
    },

    loadOptions: function (callback) {
        var me = this;
        browser.storage.sync.get(allEnv.options, function (items) {
            allEnv.options = items;

            browser.storage.local.get(allEnv.options, function (itemsLocal) {
                allEnv.optionsLoaded = true;
                if (typeof callback === 'function') {
                    callback();
                }
            });
        });
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
    }
};