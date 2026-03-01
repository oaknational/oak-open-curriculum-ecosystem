# 1. Current State Analysis

## The existing library: `@oaknational/oak-components`

- **Package:** `@oaknational/oak-components` v2.9.1
- **Components:** ~125+ exported across 12 categories
- **Styling:** styled-components (runtime CSS-in-JS)
- **Theming:** `OakThemeProvider` wrapping styled-components `ThemeProvider`
- **Build:** Rollup (ESM + CJS)
- **Peer deps:** React ≥18.2, styled-components ≥5.3.11, Next.js ≥14.2, next-cloudinary ≥6.16

## Component categories

| Category | Count | Examples |
|----------|-------|----------|
| Buttons | ~15 | OakPrimaryButton, OakSecondaryButton, OakTertiaryButton |
| Form elements | ~17 | OakTextInput, OakCheckBox, OakRadioButton, OakSelect |
| Typography | ~7 | OakHeading, OakP, OakSpan, OakTypography |
| Layout & structure | ~8 | OakBox, OakFlex, OakGrid, OakMaxWidth |
| Navigation | ~10 | OakLink, OakTabs, OakPagination, OakBreadcrumbs |
| Images & icons | ~5 | OakIcon, OakImage, OakSvg, OakRoundIcon |
| Messaging & feedback | ~11 | OakModalCenter, OakToast, OakTooltip, OakLoadingSpinner |
| Presentational | ~2 | OakCarousel, OakQuote |
| Cookies | ~4 | OakCookieBanner, OakCookieConsent |
| OWA-specific | ~43 | Teacher components, pupil quiz components |
| Providers | ~2 | OakThemeProvider, OakGlobalStyle |

## Design token inventory

| Token Category | Count | Examples |
|---------------|-------|----------|
| Colour palette | ~30 | oakGreen, mint, aqua, navy, grey10–grey110 |
| Semantic colour roles | ~50 | text-primary, bg-btn-primary, border-neutral |
| Font tokens | ~14 | heading-1–7, body-1–4, code-1–3 |
| Spacing | ~25 | 0–1360px |
| Border radius | ~5 | square, xs, s, m, circle |
| Drop shadows | ~6 | standard, lemon, grey, black |
| Opacity, transitions, z-index | ~12 | Various |
| Breakpoints | 2 | 750px (small), 1280px (large) |

## How the Oak Web Application consumes it

The OWA (Next.js 15) is deeply coupled across ~40 files:

- Layout primitives (`OakBox`, `OakFlex`, `OakMaxWidth`) on every page
- `$`-prefixed styling props throughout (`$pa`, `$mt`, `$font`, `$background`)
- `OakThemeProvider` + `oakDefaultTheme` at root
- Typography components on every page
- Some local styled-components extensions (`styled(OakHeading)`, `styled(OakFlex)`)
- No Tailwind; className used only for semantics and test hooks

## Problems prompting this work

1. **Runtime cost** — styled-components generates and injects CSS at runtime, affecting TTI and SSR
2. **Ecosystem decline** — styled-components maintenance has slowed; React/Next.js favours zero-runtime approaches
3. **Forced dependency** — every consumer must install styled-components (~15KB gzipped)
4. **Monolithic coupling** — behaviour, tokens, and visual styling are inseparable
5. **Single design system** — structurally incapable of serving any brand other than Oak
6. **Hand-rolled a11y** — focus trapping, keyboard nav, ARIA implemented per-component rather than using a proven headless foundation
7. **Layout-as-components anti-pattern** — `OakBox` and `OakFlex` with extensive `$`-prefixed props are effectively a utility CSS system built in React, coupling layout decisions to the component library
