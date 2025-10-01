# Oak Components Application and Improvement Plan

## Executive Summary

The Semantic Search application integrated `@oaknational/oak-components` (v1.149.0) into a dual light/dark experience. Delivering that experience demanded roughly **1,200 lines of bespoke production code** (plus ~850 lines of tests) across ten theming files to compensate for gaps in the upstream library. The engineering cost falls into three buckets:

- **Theme creation**: no variant API, no dark-mode baseline, and limited theme surface area forced manual overrides for ~24 UI role tokens per mode.
- **Token + CSS delivery**: Oak exports raw design tokens but no resolution utilities or CSS variable emission, so every consuming app must re-implement parsing and bridging logic.
- **Runtime alignment & guidance**: styled-components builds diverge between server and client, there is no multi-theme documentation, and downstream teams shoulder the maintenance risk alone.

To unblock the wider Oak ecosystem, we propose three headline investment areas for the Oak Components team:

1. **Theme Factory & Dark Mode Baseline** – ship first-class helpers (and reference themes) so apps can opt into multi-theme support without copy-pasting bespoke infrastructure.
2. **Token Resolution & CSS Variable Support** – expose CSS-ready values and optional variable emission out of the box, eliminating the need for local conversion layers.
3. **Runtime & Documentation Alignment** – guarantee SSR/client consistency, provide migration guides, and publish multi-theme integration playbooks.

The remainder of this document summarises the bespoke workarounds, quantifies their impact, and frames the improvements required to make Oak Components multi-theme ready by design.

---

## 1. Integration Snapshot

| Oak gap                     | Local implementation                                                       | Cost / risk                                        |
| --------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| No theme variant API        | `semantic-theme-spec.ts`, manual overrides for ~24 UI role tokens per mode | 227 LOC, brittle when Oak adds tokens              |
| No token resolution helpers | `semantic-theme-resolver.ts`, custom spacing/typography/colour parsers     | 234 LOC, imports Oak internals, hard to maintain   |
| No CSS variable emission    | `ThemeBridgeProvider.tsx`, `ThemeCssVars.tsx`, `ThemeGlobalStyle.tsx`      | 193 LOC, duplicates theme data, CSP considerations |
| Server/client style drift   | `next.config.ts` transpilation + layout pre-hydration script               | Build-time penalty, inline script debt             |
| Limited theme surface area  | Local `AppTheme` types with extended spacing/typography/layout             | Risk of divergence from Oak’s schema               |
| No dark-mode guidance       | Trial-and-error overrides validated via bespoke tests                      | Time-consuming, no guarantee of consistency        |

Detailed implementation notes and code snippets live in Appendix A; the main body focuses on the lessons and desired upstream capabilities.

---

## 2. Challenges and Local Workarounds

### 2.1 Theme Variants

- **Problem**: Only `oakDefaultTheme` is exposed; consuming apps cannot extend or derive variants.
- **Local impact**: We handcrafted a complete theme spec, overriding ~24 UI role tokens per mode and validating completeness via `assertCompleteUiColorMap()`.
- **Workaround**: `semantic-theme-spec.ts` plus helper guards ensure every `OakUiRoleToken` resolves, but the mapping is manual and fragile.
- **Desired upstream capability**: A theme factory that accepts partial overrides, validates coverage, and ships with both light and dark reference themes (see Recommendation 3.1).

### 2.2 Token Resolution

- **Problem**: Oak exports raw design tokens (spacing, typography, colours) without utilities to produce CSS-ready values.
- **Local impact**: Applications must replicate Oak’s token resolution logic, importing internals such as `oakFontTokens` and `oakSpaceBetweenTokens`.
- **Workaround**: `semantic-theme-resolver.ts` converts tokens to rem/px values and assembles a resolved theme object consumed by both styled-components and CSS variables.
- **Desired upstream capability**: Official token-resolution helpers that return CSS-ready strings and insulate consumers from internal token shape changes (Recommendation 3.2).

### 2.3 CSS Variable Emission

- **Problem**: Components accept theme props, but the library does not emit CSS variables for downstream usage.
- **Local impact**: To support non-React styling and utility classes, we built a bridge that maps 45 app-level values into `--app-*` variables and injects bespoke global styles.
- **Workaround**: `ThemeBridgeProvider.tsx`, `ThemeCssVars.tsx`, and `ThemeGlobalStyle.tsx` emit variables and global styles in parallel with styled-components.
- **Desired upstream capability**: Opt-in CSS variable emission from Oak Components so every consumer gains consistent variables without duplicating logic (Recommendation 3.3).

### 2.4 SSR / Client Divergence

- **Problem**: The styled-components build hashes class names differently on server (CJS bundle) and client (ESM bundle), leading to hydration warnings.
- **Local impact**: We must transpile `@oaknational/oak-components` and run a pre-hydration script to align DOM attributes before React mounts, incurring build-time cost and CSP debt.
- **Workaround**: `next.config.ts` forces transpilation; `layout.tsx` injects an inline script that resolves the preferred theme ahead of hydration.
- **Desired upstream capability**: Harmonised SSR/client builds (or extracted CSS) that remove the need for transpilation and inline scripts (Recommendation 3.4).

### 2.5 Theme Surface Area

- **Problem**: `OakTheme` only exposes `uiColors`, preventing official customisation of spacing, typography, breakpoints, or app-specific tokens.
- **Local impact**: We extended the theme type locally (`AppTheme`) and layered additional tokens, but those structures sit outside the Oak contract.
- **Desired upstream capability**: An extended theme API that supports custom spacing scales, typography ramps, and breakpoints while remaining type-safe (Recommendation 3.5).

### 2.6 Dark Mode Guidance

- **Problem**: There is no documented strategy for dark mode, no sample theme, and no design validation guidance.
- **Local impact**: We relied on experimentation and bespoke tests (contrast ratios, visual snapshots) to ensure accessibility.
- **Desired upstream capability**: Official dark theme exports, Storybook demos, and an integration guide covering accessibility and implementation basics (Recommendations 3.1 & 4).

---

## 3. Upstream Improvement Recommendations

The table below links each challenge to the proposed Oak Components investment.

| Challenge                  | Recommended action                                                                                                                    | Expected impact                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Theme variants & dark mode | **3.1 Theme Factory & Reference Themes** – introduce `createOakTheme`, ship `oakLightTheme`/`oakDarkTheme`, provide validation errors | Removes manual token overrides, accelerates dark-mode adoption       |
| Token resolution           | **3.2 Token Resolution Utilities** – expose helper returning CSS-ready spacing/typography/colour values                               | Eliminates custom parsers, keeps apps insulated from token refactors |
| CSS variable emission      | **3.3 Built-in CSS Variable Support** – allow `OakThemeProvider` to emit variables with consistent prefixing                          | Unlocks global styling without bespoke bridges                       |
| SSR/client drift           | **3.4 Runtime Alignment** – ensure consistent styled-component hashing or extract CSS at build time                                   | Removes transpilation & inline script debt                           |
| Extended theme surface     | **3.5 Extended Theme API** – support optional custom spacing/typography/breakpoints                                                   | Enables brand alignment without forks                                |
| Missing guidance           | **4.1–4.3 Documentation Improvements** – publish integration guide, API reference, migration guides                                   | Provides discoverable, repeatable onboarding across teams            |

The detailed recommendations remain compatible with the earlier draft; they have been consolidated to maintain focus during the symposium.

### 3.1 Theme Factory & Reference Themes

- Expose `createOakTheme(options)` accepting partial overrides and validating coverage.
- Ship official light and dark themes plus a toggle example app.
- Provide clear error messages when tokens are missing or mis-typed.

### 3.2 Token Resolution Utilities

- Offer batched resolution helpers returning CSS-ready strings (rem/px/rgba).
- Avoid leaking internal token structures to consumers.
- Document the transformation logic and unit-test upstream.

### 3.3 Built-in CSS Variable Support

- Add an `emitCssVariables` flag (default off) to `OakThemeProvider`.
- Emit `--oak-*` variables at the appropriate scope (`:root` and `[data-theme]`).
- Cover both role tokens and resolved app tokens.

### 3.4 Runtime Alignment

- Provide a build that yields consistent styled-component hashes across server and client.
- Consider extracted CSS or an alternative styling solution if needed.
- Publish a migration guide for consuming apps.

### 3.5 Extended Theme API & Dark Mode Reference

- Allow optional overrides for spacing scales, typography ramps, and breakpoints.
- Document required validation (ascending scales, contrast requirements).
- Ensure Storybook supports switching between reference themes and custom themes.

---

## 4. Documentation Improvements

1. **Integration Guide** – a multi-theme playbook covering provider setup, theme customisation, dark-mode toggles, CSS variable usage, and common pitfalls (`docs/integration/multi-theme-apps.md`).
2. **API Reference** – generated Markdown (via Typedoc) enumerating all exported tokens, types, and components with theme-related annotations.
3. **Migration Guides** – versioned notes for breaking changes, deprecations, and suggested codemods to ease upgrades for consuming applications.

These artefacts are essential for scaling Oak Components across teams once the new APIs land.

---

## 5. Appendices

### Appendix A – Implementation Highlights (Semantic Search)

The following excerpts illustrate the bespoke infrastructure built for Semantic Search.

<details>
<summary>Pre-hydration script (apps/oak-open-curriculum-semantic-search/app/layout.tsx)</summary>

```typescript
const THEME_PREHYDRATION_SCRIPT = `(() => {
  try {
    const doc = document;
    const cookieMatch = doc.cookie.match(/(?:^|;\s*)theme-mode=([^;]+)/);
    const cookieValue = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
    const stored = window.localStorage?.getItem('theme-mode') ?? null;
    const mode = cookieValue || stored || 'system';
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const resolved = mode === 'dark' ? 'dark' : mode === 'light' ? 'light' : prefersDark ? 'dark' : 'light';
    doc.documentElement.dataset.themeMode = mode;
    doc.documentElement.dataset.theme = resolved;
    const root = doc.getElementById('app-theme-root');
    if (root) {
      root.dataset.theme = resolved;
    }
  } catch (_) {
    /* ignore – React providers reconcile on hydration */
  }
})();`;
```

</details>

<details>
<summary>Theme spec + resolver (apps/.../semantic-theme-spec.ts & semantic-theme-resolver.ts)</summary>

- Overrides ~24 UI role tokens per mode while falling back to `oakDefaultTheme` for the rest.
- Resolves spacing via `resolveSpaceBetween()` / `resolveInnerPadding()` + `pxToRem()`.
- Unpacks typography tuples from `oakFontTokens` to produce CSS-ready values.
- Returns a resolved app theme consumed by both styled-components and CSS variable outputs.

</details>

<details>
<summary>CSS variable bridge (apps/.../ThemeBridgeProvider.tsx)</summary>

- Pre-creates light/dark theme instances, selects at runtime, and emits 45 `--app-*` variables.
- Injects deterministic global styles for background/foreground colours and link states.
- Wraps children in a styled-components provider so existing components continue working.

</details>

### Appendix B – Semantic Search Follow-up Actions

Although outside the symposium remit, the Semantic Search team is tracking the following work until upstream support arrives:

1. Keep the pre-hydration script and `ThemeContext` logic in sync.
2. Expand contrast tests to cover subdued/error text and border accents; extend hydration integration tests to cover navigation toggles.
3. Prepare CSP guidance (nonce/hash strategy) for inline styles.
4. Monitor Oak Components releases and reduce custom code once upstream features land.

### Appendix C – Maintenance & Testing Considerations

- **Synchronisation points**: update local code when Oak adds UI role tokens, colour tokens, font tuple structures, or spacing tokens. Pin the Oak Components version and trial upgrades in isolation.
- **Testing**: maintain unit tests for token resolution, completeness checks, and contrast ratios; run Playwright integration tests and (future) visual regression suites for both themes.
- **Performance**: monitor theme resolution time (<10 ms target), CSS variable emission overhead, bundle-size impact, and theme-switch responsiveness. Optimise via memoisation, code-splitting, and potential build-time token resolution.

---

## 6. Conclusion

Oak Components excels in its original single-theme, light-mode setting, but extending it to contemporary multi-theme requirements currently shifts significant complexity to consuming applications. Semantic Search built ~1,200 lines of theming infrastructure, alongside bespoke tests and runtime workarounds, to bridge the gaps. Investing in theme factories, token-resolution utilities, CSS variable support, and aligned documentation will give every Oak product multi-theme capability by default, reduce duplication across teams, and accelerate delivery of accessible, brand-consistent experiences.
