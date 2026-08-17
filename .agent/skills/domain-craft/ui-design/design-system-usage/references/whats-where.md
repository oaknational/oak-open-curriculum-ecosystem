# What's where

The design-system file map. Every path is relative to
`packages/design/oak-design-system/`, which is the system's only home.

One structural rule inside that root: the non-production material lives under
`studio-source/` — `components/`, `templates/`, `preview/`, `ui_kits/`,
`whitelabel/`, `integrations/`, and the proof pages — while the consumable
files and the guidance documents sit at the root. That split is a
quality-gate boundary rather than a filing preference (owner ruling
2026-07-19): the gate exclusions bind `studio-source/**` alone, everything at
the workspace root is product surface under the full strict gate, and
anything under `studio-source/` that becomes consumed by product code moves
out of it in the same change.

## Styles — at the root

- `components.css` — buttons, tags, cards, chips, inputs, checkbox/radio,
  banners, quiz answers, links, skip-link, utilities, **and the authoring
  blocks** (the lesson anatomy: `.oak-outcome`, `.oak-key-learning-points`,
  `.oak-keywords`, `.oak-quiz`, `.oak-worked-example`, `.oak-misconception`,
  `.oak-practice`, `.oak-teacher-tip`, `.oak-guidance`, each with
  `.oak-block-label`). Copy the class, not the CSS.
- `colors_and_type.css` — tokens, themes, type classes (`oak-heading-1…7`,
  `oak-body-1…4`), `.oak-scope`.
- `oak-icons.css` — the mask-icon set (`--ic-*` / `--i-*`).
- `print.css` — the print/PDF layer.
- `styles.css` — **the one file to link, for external consumers**. It imports
  exactly four, in this order: `colors_and_type.css`, `oak-icons.css`,
  `components.css`, `print.css`. **Pages served from inside this workspace
  must NOT rely on it**: some serve contexts drop `@import`-only sheets, so
  the sheet parses to zero rules and the page renders unstyled with no error.
  Those pages link the four tier files directly. `KNOWN-ISSUES.md` #1 is the
  record, and the same applies to a brand's `brand-full.css`.
- `brand.css` — the white-label contract: re-branding overrides canonical
  intent roles only, never the aliases, and never a raw value at a use site.
  **`styles.css` does NOT import it** — it is a deliberate opt-in you load
  *after* `styles.css`, so the override cascade lands on top (README
  §white-label step 1). Linking `styles.css` alone gets you the Oak brand;
  a re-brand is `styles.css` then `brand.css`.

## Building blocks

- `studio-source/templates/lesson-deck/`,
  `studio-source/templates/worksheet/` — starting points for teaching slides
  and printable A4 worksheets (PDF-ready). Start from these for lesson
  artefacts.
- `studio-source/components/` — compiled React components (OakButton, OakTag,
  OakSubjectChip, OakIcon) with typed props. These are deliberately NOT on the
  package's export surface (ADR-213 §3) — apps compose Base UI plus the class
  library instead.
- `assets/icons/*.svg` — local flat-black-stroke icons; recolour with
  `filter: var(--filter-icon)`.
- `fonts/` — the shipped typeface files.

## Reference builds and specimens — all under `studio-source/`

Every path in this section is prefixed `studio-source/`.

- `preview/*.html` — specimen cards: exhaustive states for every component,
  plus motion, theming, and accessible-combination guides.
- `ui_kits/oak/index.html` — full homepage reference build; the model for
  composing screens.
- `whitelabel/` — the white-label contract proofs. The counter-brand
  directories are named in the skill entry's "What's where"; alongside them
  sit `specimen.html` (byte-identical full app page, `?brand=<slug>`) and
  `failing-example.css` (the negative control). The proof pages
  `Identity White-Labelling.html` / `Identity Switchboard.html` /
  `Example Front Pages.html` sit beside them and demonstrate the contract.

Some files here reference `_ds_bundle.js` / `_ds_manifest.json`, a compiled
bundle that is not built in this repo. Those files are absent from the runtime
locations these pages reference; copies exist under
`studio-source/original-capture-2026-07-23/` as provenance, never as a runtime
dependency. In the repo these pages are sources and fidelity targets, not
served pages.

## Guidance documents — at the root

- `DECISIONS.md` — why the system is the way it is: decisions, rationale,
  rejected alternatives, hard-won lessons. Read it before changing
  architecture; keep it current when you do.
- `CHANGELOG.md` — semver history + public-surface definition.
- `KNOWN-ISSUES.md` — understood gotchas, read before debugging.
- `docs/consuming-nextjs.md` — install, theme wiring, identity,
  §5b behaviour-library chooser, §7 new-component recipe.
- `docs/pairing-base-ui.md` (default) / `docs/pairing-react-aria.md`
  (dates + conformance) / `docs/pairing-ark-ui.md` (non-React) — the
  behaviour-library pairing guides.
- `docs/wrapped-widget-a11y-checklist.md`, `docs/console-tui-tones.md`,
  `docs/integration-oak-curriculum-hub.md` (the live consumer's migration
  plan), `docs/nextjs-theme-switcher.tsx.txt`.
- `docs/one-html-many-css-compositions.md` — the white-label composition
  doctrine.

## Generated and integration surfaces

- `dtcg/` — generated DTCG JSON token export (the CSS is canonical).
- `studio-source/integrations/revealjs/` — the Oak reveal.js theme.

## Provenance capture

Upstream Figma/library provenance dumps live in the committed capture tier
(`studio-source/original-capture-2026-07-23/reference/`) — never load them at
runtime.
