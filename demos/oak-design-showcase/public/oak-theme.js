'use strict';
/* oak-theme.js — tiny theme switcher for the Oak design system.
   GENERATED from src/oak-theme.ts (tsc type-erasure only; comments survive).
   Edit the source, then run the workspace build and sync:runtime scripts —
   the committed root copy is byte-parity-gated by the workspace test suite.
   Themes: "system" | "light" | "dark" | "high-contrast" | "colour-safe".
   With no stored choice the page shows its IDENTITY's own default — no
   data-theme attribute, so a brand's polarity lever governs (DDR-003
   amendment 2026-08-11: the person's choice wins; the identity speaks
   first when the person is silent).
   Persists to localStorage("oak-theme"); applies before first paint when
   loaded synchronously in <head> as a script element with src "oak-theme.js".
   (This comment must never contain a literal closing-script sequence: the file
   is documented for INLINE embedding, and the HTML parser ends an inline
   script element at the first such sequence regardless of JS context.)
   Access commitment: with no stored choice, an OS-level request for more
   contrast (prefers-contrast: more) gets the high-contrast theme
   automatically. An explicit user choice always wins, and clear() re-runs
   the automatic route so the commitment survives a return to the default.
   API: oakTheme.set("dark"), oakTheme.clear(), oakTheme.get(),
   oakTheme.choice(), oakTheme.themes.
   choice() returns the EXPLICIT choice (this session's set() or the persisted
   value) and null when none exists — the no-choice state controls render as
   "Identity default" (a control value of the consuming store layer, never a
   theme: it must not reach localStorage or data-theme). get() collapses
   no-choice to the kit-base default "light" (a concrete value for consumers
   that need one; it cannot see a brand's polarity lever), so controls that
   must distinguish "chosen" from "applied" read choice().
   Motion axis (orthogonal to themes): oakTheme.motion.set("system"|"reduced"|"full"),
   .get(), .modes — persists to localStorage("oak-motion"); default follows the
   OS prefers-reduced-motion; explicit choice wins (school-managed devices).
   Motion has no choice(): "system" IS its no-choice semantic (no attribute). */
(function () {
  const KEY = 'oak-theme';
  const THEMES = ['system', 'light', 'dark', 'high-contrast', 'colour-safe'];
  // Equality-form membership loop: narrows a raw storage string without a
  // widening cast (ADR-153 §Membership Without Widening) in a shape the
  // quality profile also accepts. One generic guard serves both the theme
  // and motion rosters.
  function isMember(values, s) {
    for (const known of values) {
      if (known === s) {
        return true;
      }
    }
    return false;
  }
  function isThemeName(s) {
    return isMember(THEMES, s);
  }
  // The session's own word, tri-state: undefined = the session has said
  // nothing (defer to storage); null = CLEARED this session (authoritative
  // even when removal failed and the store stays readable — quota-style
  // denial must not resurrect a cleared choice); a theme = set this session.
  // Keeps get() truthful when persistence fails (private mode, quota) —
  // applied state must never desync from get().
  let current;
  // The explicit choice as the session sees it: the session's word when it
  // has spoken (set or clear), the persisted value otherwise.
  function sessionChoice() {
    return current === undefined ? stored() : current;
  }
  function apply(t) {
    const el = document.documentElement;
    // Explicit choices (including "light") SET the attribute so they beat a
    // polarity-flipped brand default (see brand.css); no choice = no attribute.
    if (!t) {
      delete el.dataset.theme;
    } else {
      el.dataset.theme = t;
    }
  }
  function stored() {
    try {
      const s = localStorage.getItem(KEY);
      // A persisted value from another version (or corruption) is treated as
      // absent — only current members of THEMES may reach data-theme.
      return isThemeName(s) ? s : null;
    } catch {
      return null;
    }
  }
  function auto() {
    try {
      // Runtime guard kept for engines without matchMedia (the DOM lib types
      // it always-present; real browsers may not agree). The bare-identifier
      // typeof read is safe even where the global was never declared.
      if (typeof matchMedia === 'function' && matchMedia('(prefers-contrast: more)').matches) {
        return 'high-contrast';
      }
    } catch {
      return null;
    }
    return null;
  }
  function get() {
    // The no-choice collapse names the KIT-BASE default: light. A brand's
    // polarity lever renders elsewhere (brand.css, invisible from here), so
    // this is a concrete value for consumers that need one, never a claim
    // about the rendered page — the honest control accessor is choice().
    return sessionChoice() || auto() || 'light';
  }
  // The explicit choice, or null when none exists. The kit-contract accessor
  // (MCP-388): downstream stores render "no choice" honestly from this,
  // instead of re-deriving the storage read (the applied value from get()
  // cannot serve — the automatic contrast route also applies a theme).
  function choice() {
    return sessionChoice();
  }
  function set(t) {
    if (!isThemeName(t)) {
      return;
    }
    try {
      localStorage.setItem(KEY, t);
    } catch {
      // Persistence is best-effort: the in-memory choice below still wins.
    }
    current = t;
    apply(t);
  }
  // Return to the identity's own default (DDR-003 amendment 2026-08-11):
  // clearing removes BOTH halves of the choice — the persisted value and the
  // in-memory current — then re-runs the automatic contrast route, so an OS
  // request for more contrast keeps high-contrast after the clear (the
  // access commitment survives). "Identity default" is the consuming
  // store layer's control value for this state; it is a clear, never a
  // theme, so no sentinel string exists at this boundary.
  function clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // Best-effort like set(): the tri-state null below stays
      // authoritative for this session even though the store still holds
      // the old value (it may resurrect on the NEXT visit — honest, since
      // persistence genuinely failed).
    }
    current = null;
    apply(auto() || null);
  }
  apply(stored() || auto() || null);
  // Follow a live OS contrast change until the user makes an explicit choice.
  // The in-memory choice counts: an explicit set() whose persistence threw
  // must still win over an automatic theme change.
  try {
    matchMedia('(prefers-contrast: more)').addEventListener('change', function () {
      if (!sessionChoice()) {
        apply(auto() || null);
      }
    });
  } catch {
    // No matchMedia (or no event support): the pre-paint application above
    // already ran; live OS contrast changes simply will not re-apply.
  }
  // Motion application captures nothing, so it lives at this scope as the
  // sibling of apply() — the rest of the motion axis (keys, membership,
  // persistence) stays assembled inside createMotion below.
  function applyMotion(m) {
    const el = document.documentElement;
    if (!m || m === 'system') {
      delete el.dataset.motion;
    } else {
      el.dataset.motion = m;
    }
  }
  // The motion axis is orthogonal to themes (see the header), so its whole
  // assembly — keys, membership, application, persistence — lives here and
  // only the finished API joins the runtime object below.
  function createMotion() {
    const MKEY = 'oak-motion';
    const MODES = ['system', 'reduced', 'full'];
    function isMotionMode(s) {
      return isMember(MODES, s);
    }
    let mcurrent = null;
    function mget() {
      if (mcurrent) {
        return mcurrent;
      }
      try {
        const s = localStorage.getItem(MKEY);
        if (isMotionMode(s)) {
          return s;
        }
      } catch {
        return 'system';
      }
      return 'system';
    }
    function mset(m) {
      if (!isMotionMode(m)) {
        return;
      }
      try {
        localStorage.setItem(MKEY, m);
      } catch {
        // Persistence is best-effort: the in-memory mode below still wins.
      }
      mcurrent = m;
      applyMotion(m);
    }
    applyMotion(mget());
    return { set: mset, get: mget, modes: MODES.slice() };
  }
  // Typed from the Window contract it fulfils, so the global declaration
  // above and the assembled value cannot drift apart.
  const runtime = {
    set: set,
    clear: clear,
    get: get,
    choice: choice,
    themes: THEMES.slice(),
    motion: createMotion(),
  };
  // window, deliberately (not globalThis): the pre-paint contract attaches
  // to the page global the test harness can inject and prove — the fake-
  // window seam is the runtime's behaviour contract (S7764 rejected on
  // these grounds; see the suite).
  window.oakTheme = runtime;
})();
