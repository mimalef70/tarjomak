window.browser = (function () {
    return window.msBrowser || window.browser || window.chrome;
})();


var Options = {
    init: function () {
        var me = this;
        this.restore();
        var btnsave = document.getElementById("btnsave");
        btnsave.addEventListener("click", Options.save.bind(Options));
    },

    save: function () {
        var vals = {
            IGNORE_INPUTS: document.getElementById("ignoreinputs").checked,
        };
        browser.storage.sync.set(vals, function () {
            var txtmessage = document.getElementById("txtmessage");
            txtmessage.innerHTML = "ذخیره شد";
            setTimeout(function () {
                txtmessage.innerHTML = "";
            }, 1000);
        });
    },
    restore: function () {
        var me = this;
        var ignoreinputs = document.getElementById("ignoreinputs");

        browser.storage.sync.get('IGNORE_INPUTS', function (items) {

            if (items == undefined || Object.keys(items).length == 0) {
                console.log('hello');
                browser.storage.sync.set({
                    IGNORE_INPUTS: true
                });
                ignoreinputs.checked = true;
            } else {
                if (items.IGNORE_INPUTS == true) {
                    ignoreinputs.checked = true;
                } else {
                    ignoreinputs.checked = false;
                }
            }
        });
    }
};
document.addEventListener('DOMContentLoaded', Options.init.bind(Options));