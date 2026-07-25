/* Theme-control wiring for the landing page.
 *
 * The design system's own oak-theme.js owns theme state, persistence, and the
 * pre-paint application; this file only connects the page's <select> to it.
 * Loaded deferred — the select is inert until it runs, which is correct:
 * without script the page still renders in whichever theme oak-theme.js
 * applied synchronously in <head>.
 */
(() => {
  const control = document.getElementById('theme-control');
  const oakTheme = globalThis.oakTheme;
  if (!control || !oakTheme) {
    return;
  }

  // Initialise from LIVE theme state, not from storage alone. A
  // server-rendered page ships a fixed `selected` option, so a visitor whose
  // stored choice (or OS prefers-contrast) differs would see a select that
  // disagrees with the page it sits on — SC 4.1.2.
  const active = oakTheme.get();
  if (oakTheme.themes.includes(active)) {
    control.value = active;
  }

  control.addEventListener('change', (event) => {
    oakTheme.set(event.target.value);
  });
})();
