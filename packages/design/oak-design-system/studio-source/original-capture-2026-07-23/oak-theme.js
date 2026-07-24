/* oak-theme.js — tiny theme switcher for the Oak design system.
   Themes: "light" (default) | "dark" | "system" | "high-contrast" | "colour-safe".
   Persists to localStorage("oak-theme"); applies before first paint when
   loaded synchronously in <head>: <script src="oak-theme.js"></script>.
   Access commitment: with no stored choice, an OS-level request for more
   contrast (prefers-contrast: more) gets the high-contrast theme
   automatically. An explicit user choice always wins.
   API: oakTheme.set("dark"), oakTheme.get(), oakTheme.themes.
   Motion axis (orthogonal to themes): oakTheme.motion.set("system"|"reduced"|"full"),
   .get(), .modes — persists to localStorage("oak-motion"); default follows the
   OS prefers-reduced-motion; explicit choice wins (school-managed devices). */
(function () {
  var KEY = "oak-theme";
  var THEMES = ["light", "dark", "system", "high-contrast", "colour-safe"];
  function apply(t) {
    var el = document.documentElement;
    // Explicit choices (including "light") SET the attribute so they beat a
    // polarity-flipped brand default (see brand.css); no choice = no attribute.
    if (!t) el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", t);
  }
  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function auto() {
    try {
      if (window.matchMedia && matchMedia("(prefers-contrast: more)").matches) return "high-contrast";
    } catch (e) {}
    return null;
  }
  function get() { return stored() || auto() || "light"; }
  function set(t) {
    if (THEMES.indexOf(t) === -1) return;
    try { localStorage.setItem(KEY, t); } catch (e) {}
    apply(t);
  }
  apply(stored() || auto() || null);
  // Follow a live OS contrast change until the user makes an explicit choice.
  try {
    matchMedia("(prefers-contrast: more)").addEventListener("change", function () {
      if (!stored()) apply(auto() || null);
    });
  } catch (e) {}
  window.oakTheme = { set: set, get: get, themes: THEMES.slice() };
  var MKEY = "oak-motion";
  var MODES = ["system", "reduced", "full"];
  function mapply(m) {
    var el = document.documentElement;
    if (!m || m === "system") el.removeAttribute("data-motion");
    else el.setAttribute("data-motion", m);
  }
  function mget() {
    try { var s = localStorage.getItem(MKEY); if (s) return s; } catch (e) {}
    return "system";
  }
  function mset(m) {
    if (MODES.indexOf(m) === -1) return;
    try { localStorage.setItem(MKEY, m); } catch (e) {}
    mapply(m);
  }
  mapply(mget());
  window.oakTheme.motion = { set: mset, get: mget, modes: MODES.slice() };
})();
