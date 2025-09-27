# Oak Components Application and Improvement Plan

## Enabling Theming

Document a pragmatic fallback for aligning Oak theme tokens prior to React hydration when styled-components class names diverge across server and client renders.

### Implemented Script Option

- Add an inline `<script>` in `app/layout.tsx` ahead of the body that (current implementation):
  - Reads `document.cookie` and/or `localStorage` for `theme-mode`.
  - Derives the initial mode (`light` | `dark` | `system`).
  - Resolves `system` via `matchMedia('(prefers-color-scheme: dark)')`.
  - Sets `document.documentElement.dataset.theme` and `dataset.themeMode` plus the `#app-theme-root` `data-theme` attribute before hydration.
  - Mirrors `theme-utils.ts` logic; `layout.tsx` holds the stringified script (`THEME_PREHYDRATION_SCRIPT`).

### Advantages

- Eliminates the light→dark flash and the associated hydration mismatch by ensuring the markup React hydrates already uses the resolved theme.
- No dependency on styled-components internals; runs on bare DOM APIs so it remains resilient if the theme bridge changes.
- Keeps the existing Providers flow intact, avoiding deeper refactors during the snagging audit.

### Drawbacks / watchpoints

- Requires careful guards to avoid referencing `window`/`document` during SSR; must inject as raw HTML string.
- Inline script adds maintenance burden (lint exemptions, CSP considerations if the site enables strict CSP later).
- Needs duplication of the `resolveMode` logic to stay in sync with `ThemeContext`; periodic audits required when theme rules evolve.
- Still leaves class-name divergence unsolved for other styled-components outputs (so should be considered a stop-gap, not a permanent fix).

### Next Steps

1. Keep the inline script and `ThemeContext` logic in lockstep—add unit coverage if the resolution rules change.
2. Document CSP considerations before production hardening (current inline string would require a nonce or hash under strict CSP).
3. Record the CSS media-query alternative (dual light/dark variable blocks keyed off `prefers-color-scheme`) as the longer-term fix once we have bandwidth to revisit the bridge implementation.
4. Upstream follow-up: coordinate with `@oaknational/oak-components` to publish aligned SSR/client bundles (e.g. ESM-first build or unified hashed output) so future consumers don’t need per-app transpile overrides.
5. Propose Oak Components expose semantic typography ramps (Lexend + Work Sans) so the semantic search themes can eventually defer to core tokens instead of local overrides.

### Theme Alignment Follow-up

- The active phase pivots towards typed light/dark themes built directly from Oak token exports. Once the semantic spec lands, revisit this snagging plan to determine whether the inline script can be simplified or replaced with Oak-provided CSS variable sheets.
- Track any Oak token gaps (e.g. dark-mode icon accents) and feed them into the next revision of this document so the hydration mitigation strategy stays aligned with the broader theming direction.
