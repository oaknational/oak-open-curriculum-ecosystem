// Theme control: applies the user's choice to <html data-theme> and persists it.
// Pairs with a <select id="theme-control"> anywhere in the page (event delegation,
// so it works regardless of when the control renders).
(() => {
  const KEY = 'oak-theme';
  const THEMES = ['light', 'dark', 'system', 'high-contrast', 'colour-safe'];
  const apply = (t) => { if (THEMES.indexOf(t) !== -1) document.documentElement.setAttribute('data-theme', t); };
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved) apply(saved);
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el && el.id === 'theme-control') {
      apply(el.value);
      try { localStorage.setItem(KEY, el.value); } catch (err) {}
    }
  });
  const sync = () => {
    const el = document.getElementById('theme-control');
    if (el) { if (saved) el.value = saved; }
    else if (document.readyState !== 'complete') requestAnimationFrame(sync);
  };
  requestAnimationFrame(sync);
})();
