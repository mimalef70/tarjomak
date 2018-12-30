window.browser = (function () {
  return window.msBrowser || window.browser || window.chrome;
})();

var query = {
  active: true,
  currentWindow: true
};

function callback(tabs) {
  var currentTab = tabs[0]; // there will be only one in this array
  var url = new URL(currentTab.url).hostname;
  //Developer Settings
  const link = document.querySelector('#developer');

  link.addEventListener('click', e => {
    e.preventDefault();
    if (url === 'www.linkedin.com') {
      browser.tabs.create({
        url: 'https://www.linkedin.com/in/mostafaalahyari/'
      });
    } else {
      browser.tabs.create({
        url: 'https://twitter.com/mimalef70'
      });
    }
  });
}
browser.tabs.query(query, callback);

const links = document.querySelectorAll('a.new-tab');
for (const link of links) {
  link.addEventListener('mousedown', e => {
    e.preventDefault();

    browser.tabs.create({
      url: link.href
    });
  });
}