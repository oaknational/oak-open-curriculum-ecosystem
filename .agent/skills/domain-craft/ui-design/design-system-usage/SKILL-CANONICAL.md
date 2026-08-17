---
name: design-system-usage
classification: active
concern: domain-craft
domain: ui-design
description: >-
  Build well-branded, accessible (WCAG 2.2 AA), themable interfaces and assets
  with the Oak Open Curriculum Design System — production surfaces or throwaway
  prototypes, mocks, decks, and worksheets. Use whenever composing UI, documents,
  or teaching artefacts from the system's tokens, component class library,
  compiled React components, templates, fonts, icons, or brand voice.
---

# Design-system usage

**Path context.** This repo is the design system's only home. Every path
below is relative to `packages/design/oak-design-system/`.

One structural rule inside that root: the non-production material —
`components/`, `templates/`, `preview/`, `ui_kits/`, `whitelabel/`,
`integrations/`, and the proof pages — lives under `studio-source/`, while
the consumable files (`styles.css`, `brand.css`, `colors_and_type.css`,
`components.css`, `print.css`, `oak-icons.css`, `oak-theme.js`,
`brand_voice.txt`, `assets/`, `fonts/`, `dtcg/`) and the guidance documents
(`DECISIONS.md`, `CHANGELOG.md`, `KNOWN-ISSUES.md`, `docs/**`) sit at the
root. That split is a quality-gate boundary, not a filing preference — owner
ruling 2026-07-19 scopes the gate exclusions to `studio-source/**` alone, so
anything under it that becomes consumed by product code moves out in the
same change.

Read the system's `README.md`, then build. The one-line setup for anything new:

```html
<link rel="stylesheet" href="styles.css" />
```

That imports exactly four files, in order: the themable token layer
(`colors_and_type.css`), the mask-icon set (`oak-icons.css`), the component
class library (`components.css`), and the print/PDF layer (`print.css`). It
deliberately does NOT import `brand.css` — re-branding loads that *after*
`styles.css`, so the override cascade lands on top.

**The one exception, and it bites silently.** `styles.css` is the entry point
for EXTERNAL consumers. Some serve contexts drop `@import`-only sheets
entirely — the stylesheet parses to zero rules and the page renders unstyled
with no error. Pages served from inside the design-system workspace itself
(the specimen cards, proof pages, and reference builds under
`studio-source/`) must therefore link the tier files directly rather than
`styles.css`. `KNOWN-ISSUES.md` #1 is the record; the same applies to a
brand's `brand-full.css`.

Compose UI from the `oak-*` classes and semantic tokens; check every line of
copy against `brand_voice.txt`.

## Rules of the road

- **Voice:** empowering, personable, direct. Sentence case everywhere. British
  spelling. Pupils (not students). Aila (never AILA). Contractions always.
- **Build with semantic tokens** (`--text-primary`, `--bg-primary`,
  `--surface-mint`, `--border-primary`, `--filter-icon` for img icons) — never
  raw hexes. Aliases like `--surface-mint`/`--shadow-lemon` resolve to
  canonical intent roles (`--surface-decorative-1`, `--shadow-accent`);
  re-branding overrides canonicals only, via `brand.css` (the white-label
  contract) — validate with the "Contrast audit (live)" card. **Five
  selectable themes, four token-bearing:** offer light / dark / system /
  high-contrast / colour-safe everywhere a theme choice is offered (DDR-004 —
  a control listing a subset is non-conformant); the four palette themes
  carry token trees via `data-theme` on `<html>` or any subtree, and `system`
  resolves to light or dark and mints no tree of its own. `oak-theme.js`
  persists the user's *choice* — the applied value never round-trips back
  into state (DDR-003).
- **A11y is non-negotiable (WCAG 2.2 AA):** keep the built-in focus rings,
  ≥44px targets, real labels, `alt` text, state never conveyed by colour
  alone, quiet motion (120/200ms, reduced-motion respected).
- **Signature motif:** thick black border (2–3px) + offset lemon shadow; hover
  widens it, press collapses it with a +2px,+2px translate. `.oak-interactive`
  gives you this.
- **No gradients. No emoji. No title case.** Body text is Lexend 300 on white;
  on pastel fills use weight 400+.
- **Icons:** local `assets/icons/*.svg` (flat black strokes); recolour with
  `filter: var(--filter-icon)`. Missing icon? Use Lucide and flag it.

## What's where

The four you reach for constantly (the last two live under `studio-source/`):

- `components.css` — every component class **and the authoring blocks** (the
  lesson anatomy). Copy the class, not the CSS.
- `colors_and_type.css` — tokens, themes, type classes (`oak-heading-1…7`,
  `oak-body-1…4`), `.oak-scope`.
- `templates/lesson-deck/`, `templates/worksheet/` — start here for teaching
  slides and printable A4 worksheets.
- `preview/*.html` and `ui_kits/oak/index.html` — exhaustive component states,
  and the full reference build that models how screens compose.

The full map — compiled React components, the DTCG export, the reveal.js
theme, the consumption and pairing guides, the `whitelabel/` contract proofs
on their two counter-brands `creature/` and `freedonia/`, and where each of
these sits in the tree — is
[`references/whats-where.md`](references/whats-where.md). Read it before
hunting the tree; read `DECISIONS.md` before changing architecture.

## Authoring educational content

When writing lesson content (not just consuming templates), compose from the
authoring blocks in Oak's real lesson anatomy and order: **pupil outcome**
(one "I can…" sentence) → **key learning points** (3–5 precise knowledge
statements) → **keywords** (pupil-facing definitions, one clause each) →
**starter quiz** (checks prior knowledge) → learning cycles of
**explanation (worked examples) → check → practice** → **misconceptions and
common mistakes** (the wrong idea verbatim in quotes + the teacher response) →
**teacher tips** → **content guidance + supervision level** where needed →
**exit quiz** (checks the key learning points; distractors target the
misconceptions). Classes: `.oak-outcome`, `.oak-key-learning-points`,
`.oak-keywords`/`.oak-keyword`, `.oak-quiz`, `.oak-worked-example`,
`.oak-misconception`, `.oak-practice`, `.oak-teacher-tip`, `.oak-guidance` —
each semantic HTML with a visible `.oak-block-label`; headings take
`--font-display` so authored content re-brands with everything else. See the
"Authoring blocks" card for the full anatomy with real content.

## Page composition (region contract)

Build any full page shell on the region contract: `.oak-canvas` >
`[data-region="utility|masthead|main|footer"]`, and
`<main class="oak-main oak-region" data-region="main">` > sibling
`[data-region]` sections (hero/navigation/featured/facets/results/detail/
content/context/resources/support/cta). Declare the page type
(`data-page="unit|home|proof"` or a new one) on `<body>`/canvas and scope any
new map under `[data-page="…"]` — never `:root`. Regions must be SIBLINGS (no
wrapper columns); DOM order is canonical; brands recompose via the map tokens.
See the "Composition" card and `brand.css` §composition surface.
