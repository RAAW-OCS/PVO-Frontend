// Reading aids from the PVO accessibility toolbar, applied before the page shows.
// Each aid is a set of Tailwind classes on <body>; the toolbar (a11y.js) adds and removes the
// same lists. Text size and colour themes are OCS preferences (assets/js/user-preferences.js).
window.PVO_READING_AIDS = {
  underline: ['[&_a]:!underline', '[&_a]:!underline-offset-2'],
  spacing: ['[&_p]:!leading-[1.9]', '[&_li]:!leading-[1.9]', '[&_dd]:!leading-[1.9]', '[&_label]:!leading-[1.9]',
    '[&_p]:!tracking-wide', '[&_li]:!tracking-wide', '[&_p]:![word-spacing:0.12em]'],
  motion: ['[&_*]:!transition-none', '[&_*]:!animate-none', '[&_*]:!scroll-auto'],
};
// the same key as the earlier PVO toolbar, so aids people already turned on stay on
window.PVO_READING_AIDS_KEY = 'pvoAccessibility';

(function applySavedAids() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(window.PVO_READING_AIDS_KEY) || '{}') || {};
    Object.keys(window.PVO_READING_AIDS).forEach((aid) => {
      if (saved[aid] === true) document.body.classList.add(...window.PVO_READING_AIDS[aid]);
    });
  } catch (error) {
    // private browsing or storage turned off: the page simply starts without aids
  }
})();
