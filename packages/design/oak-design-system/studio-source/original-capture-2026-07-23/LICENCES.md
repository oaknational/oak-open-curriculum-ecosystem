# Licences & attribution — Oak Open Curriculum Design System

Everything third-party this project loads, vendors, or recommends, with its licence. This file travels with every export; a white-label re-brand that swaps assets must keep its own copy accurate. Oak's own marks are NOT open-licensed — see the last section.

## Fonts

| Font | Used by | Source | Licence |
|---|---|---|---|
| Lexend (variable) | Oak baseline (`colors_and_type.css`, local `fonts/Lexend-VariableFont_wght.ttf`) | Google Fonts | SIL OFL 1.1 |
| Nunito · Baloo 2 | EMC² counter-brand (`whitelabel/creature/brand-a.css`, Google Fonts CSS2 API) | Google Fonts | SIL OFL 1.1 |
| Public Sans | FDSE counter-brand (`whitelabel/freedonia/brand-a.css`, Google Fonts CSS2 API) | USWDS / Google Fonts | SIL OFL 1.1 |

## Icon sets (one distinct set per identity — DECISIONS)

| Set | Used by | Source (pinned) | Licence |
|---|---|---|---|
| Oak official icon SVGs | Oak (`assets/icons/*.svg`, `--i-*`/`--ic-*` maps in `oak-icons.css`) | oaknational (mirrors oak-components OakIcon set) | **Oak marks — not MIT**; see below |
| Material Symbols Rounded | EMC² (`whitelabel/creature/icons.css` font + `brand-full.css` SVG URLs, `@material-symbols/svg-600@0.19.0`, jsDelivr) | Google | Apache 2.0 |
| Bootstrap Icons | FDSE (`whitelabel/freedonia/icons.css` + `brand-full.css` SVG URLs, `bootstrap-icons@1.11.3`, jsDelivr) | The Bootstrap Authors | MIT |

## Vendored & CDN-loaded code

| Package | Where | Licence |
|---|---|---|
| reveal.js | `integrations/revealjs/vendor/reveal.js` (vendored copy; consuming repo will take it as a real dependency — KNOWN-ISSUES #9) | MIT |
| React 18.3.1 · ReactDOM 18.3.1 · @babel/standalone 7.29.0 | preview/specimen cards only (unpkg, pinned + SRI) — never part of the shipped kit | MIT |

## Recommended dependencies (consumers install these; not shipped here)

| Package | Role | Licence |
|---|---|---|
| Base UI (`@base-ui/react`) | Default headless behaviour library (consuming-nextjs.md §5b) | MIT |
| Ariakit · Zag.js / Ark UI | Fallbacks per §5b | MIT |
| Ink | React console TUIs (ecosystem repo pattern) | MIT |

## Influence without trade dress

FDSE v7 takes the GDS visual *grammar* (colour values, type scale, spacing) as a fictional proof. Deliberately NOT taken: the crown, GDS Transport typeface, or GOV.UK header trade dress. govuk-frontend (MIT) was studied for maturity practices (DECISIONS), not copied.

## Oak marks (not open-licensed)

The Oak logo, the official icon set (`assets/icons/`), brand imagery in `uploads/`, and the Oak name are Oak National Academy brand assets — excluded from any open licence on this project's code, mirroring the ecosystem repo's `BRANDING.md`. White-label consumers MUST replace them (the `--i-*`/`--ic-*` maps and `assets/logo.svg` slot are the levers); making this system a tracked open package is gated on explicit licensing of these marks (DECISIONS "Ecosystem convergence").
