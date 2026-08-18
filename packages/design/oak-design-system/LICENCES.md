# Licences & attribution — Oak Open Curriculum Design System

Everything third-party this project loads, vendors, or recommends, with its licence. This file travels with every export; a white-label re-brand that swaps assets must keep its own copy accurate. Oak's own marks are NOT open-licensed — see the last section.

## Oak-authored code and content

Oak-authored code in this workspace is covered by the repository's MIT licence (root [LICENCE](../../../LICENCE)), and so are the docs authored in this repo — the split is by PROVENANCE (owner ruling 2026-08-02): Oak material already published on an existing Oak surface outside this repo and its apps — the brand voice toolkit text (source cited in [LICENSING-MANIFEST.md](LICENSING-MANIFEST.md)), curriculum content — is © Oak National Academy under OGL v3.0 (the system's own licence statement, README §Licence; API curriculum content under the root [LICENCE-DATA.md](../../../LICENCE-DATA.md)). Oak marks (last section) are copyright and not licensed; third-party items keep the licences tabled below. The constrained surface stays the exception, never the default; per-file-class dispositions are [LICENSING-MANIFEST.md](LICENSING-MANIFEST.md)'s, and this file defers to it.

## Fonts

| Font                   | Used by                                                                                               | Source                                                                             | Licence     |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------- |
| Lexend (variable)      | Oak baseline (`colors_and_type.css`, local `fonts/Lexend-VariableFont_wght.ttf`)                      | Google Fonts                                                                       | SIL OFL 1.1 |
| Roboto Mono (variable) | Code contexts — `--font-mono` (`colors_and_type.css`, local `fonts/RobotoMono-VariableFont_wght.ttf`) | Google Fonts ([googlefonts/RobotoMono](https://github.com/googlefonts/RobotoMono)) | SIL OFL 1.1 |
| Nunito · Baloo 2       | EMC² counter-brand (`whitelabel/creature/brand-a.css`, Google Fonts CSS2 API)                         | Google Fonts                                                                       | SIL OFL 1.1 |
| Public Sans            | PDS counter-brand (`whitelabel/pds/brand-a.css`, Google Fonts CSS2 API)                               | USWDS / Google Fonts                                                               | SIL OFL 1.1 |

Both locally shipped faces travel with their verbatim upstream copyright notice + full OFL text (`fonts/Lexend-OFL.txt` — including its Reserved Font Name clause — and `fonts/RobotoMono-OFL.txt`), satisfying OFL 1.1 condition 2 for every redistributed copy; `fonts/*` is on the package exports map, so the notices ship wherever the fonts do.

## Icon sets (one distinct set per identity — DECISIONS)

| Set                      | Used by                                                                                                               | Source (pinned)                                  | Licence                            |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------- |
| Oak official icon SVGs   | Oak (`assets/icons/*.svg`, `--i-*`/`--ic-*` maps in `oak-icons.css`)                                                  | oaknational (mirrors oak-components OakIcon set) | **Oak marks — not MIT**; see below |
| Material Symbols Rounded | EMC² (`whitelabel/creature/icons.css` font + `brand-full.css` SVG URLs, `@material-symbols/svg-600@0.19.0`, jsDelivr) | Google                                           | Apache 2.0                         |
| Bootstrap Icons          | PDS (`whitelabel/pds/icons.css` + `brand-full.css` SVG URLs, `bootstrap-icons@1.11.3`, jsDelivr)                      | The Bootstrap Authors                            | MIT                                |

## Vendored & CDN-loaded code

| Package                                                   | Where                                                                                                                                      | Licence |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| reveal.js                                                 | `integrations/revealjs/vendor/reveal.js` (vendored copy; consuming repo will take it as a real dependency — KNOWN-ISSUES #9)               | MIT     |
| React 18.3.1 · ReactDOM 18.3.1 · @babel/standalone 7.29.0 | specimen cards, component cards, ui_kits, and templates' support.js loader (unpkg, pinned + SRI) — never part of the shipped system CSS/JS | MIT     |

## Recommended dependencies (consumers install these; not shipped here)

| Package                    | Role                                                         | Licence |
| -------------------------- | ------------------------------------------------------------ | ------- |
| Base UI (`@base-ui/react`) | Default headless behaviour library (consuming-nextjs.md §5b) | MIT     |
| Ariakit · Zag.js / Ark UI  | Fallbacks per §5b                                            | MIT     |
| Ink                        | React console TUIs (ecosystem repo pattern)                  | MIT     |

## Influence without trade dress

PDS v7 takes the GDS visual _grammar_ (colour values, type scale, spacing) as a fictional proof. Deliberately NOT taken: the crown, GDS Transport typeface, or GOV.UK header trade dress. govuk-frontend (MIT) was studied for maturity practices (DECISIONS), not copied.

## Oak marks (not open-licensed)

The Oak logo, the official icon set (`assets/icons/`), brand imagery held in the committed capture tier (`studio-source/original-capture-2026-07-23/uploads/`), and the Oak name are Oak National Academy brand assets — excluded from any open licence on this project's code, mirroring and governed by the ecosystem repo's [BRANDING.md](../../../BRANDING.md) (owner ruling 2026-07-19: Oak material in this repo is automatically correctly licensed given brand-asset separation and this reference). White-label consumers MUST replace them (the `--i-*`/`--ic-*` maps and `assets/logo.svg` slot are the levers); making this system a tracked open package is gated on explicit licensing of these marks (DECISIONS "Ecosystem convergence").
