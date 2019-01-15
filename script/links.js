window.browser = (function () {
  return window.msBrowser || window.browser || window.chrome;
})();

const links = document.querySelectorAll('a.new-tab');
for (const link of links) {
  link.addEventListener('mousedown', e => {
    e.preventDefault();

    browser.tabs.create({
      url: link.href
    });
  });
}