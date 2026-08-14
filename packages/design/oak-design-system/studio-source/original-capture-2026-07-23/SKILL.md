---
name: oak-design
description: Use this skill to generate well-branded, accessible (WCAG 2.2 AA), themable interfaces and assets for Oak National Academy — production or throwaway prototypes/mocks/decks/worksheets. Contains tokens, a component class library, compiled React components, templates, fonts, icons, and the brand voice toolkit.
user-invocable: true
---

Read `README.md`, then build. The one-line setup for anything new:

```html
<link rel="stylesheet" href="styles.css">
```

That loads the themable token layer (`colors_and_type.css`), the component class library (`components.css`), and the print/PDF layer (`print.css`). Compose UI from the `oak-*` classes and semantic tokens; check every line of copy against `brand_voice.txt`. (Pages *inside this project* link the three CSS files directly — see KNOWN-ISSUES.md #1.)

## Rules of the road

- **Voice:** empowering, personable, direct. Sentence case everywhere. British spelling. Pupils (not students). Aila (never AILA). Contractions always.
- **Build with semantic tokens** (`--text-primary`, `--bg-primary`, `--surface-mint`, `--border-primary`, `--filter-icon` for img icons) — never raw hexes. Aliases like `--surface-mint`/`--shadow-lemon` resolve to canonical intent roles (`--surface-decorative-1`, `--shadow-accent`); re-branding overrides canonicals only, via `brand.css` (the white-label contract) — validate with the "Contrast audit (live)" card — and all four themes (light / dark / high-contrast / colour-safe) work via `data-theme` on `<html>` or any subtree. `oak-theme.js` persists the user's choice.
- **A11y is non-negotiable (WCAG 2.2 AA):** keep the built-in focus rings, ≥44px targets, real labels, `alt` text, state never conveyed by colour alone, quiet motion (120/200ms, reduced-motion respected).
- **Signature motif:** thick black border (2–3px) + offset lemon shadow; hover widens it, press collapses it with a +2px,+2px translate. `.oak-interactive` gives you this.
- **No gradients. No emoji. No title case.** Body text is Lexend 300 on white; on pastel fills use weight 400+.
- **Icons:** local `assets/icons/*.svg` (flat black strokes); recolour with `filter: var(--filter-icon)`. Missing icon? Use Lucide and flag it.

## What's where

- `components.css` — buttons, tags, cards, chips, inputs, checkbox/radio, banners, quiz answers, links, skip-link, utilities, **and the authoring blocks** (the lesson anatomy: `.oak-outcome`, `.oak-key-learning-points`, `.oak-keywords`, `.oak-quiz`, `.oak-worked-example`, `.oak-misconception`, `.oak-practice`, `.oak-teacher-tip`, `.oak-guidance`, each with `.oak-block-label`). Copy the class, not the CSS.
- `colors_and_type.css` — tokens, themes, type classes (`oak-heading-1…7`, `oak-body-1…4`), `.oak-scope`.
- `templates/lesson-deck/`, `templates/worksheet/` — starting points for teaching slides and printable A4 worksheets (PDF-ready). Start from these for lesson artifacts.
- `components/` — compiled React components (OakButton, OakTag, OakSubjectChip, OakIcon) with typed props.
- `preview/*.html` — specimen cards: exhaustive states for every component, plus motion, theming, and accessible-combination guides.
- `ui_kits/oak/index.html` — full homepage reference build; the model for composing screens.
- `reference/` — upstream Figma/library dumps for provenance only; never load at runtime.

## Authoring educational content

When writing lesson content (not just consuming templates), compose from the authoring blocks in Oak's real lesson anatomy and order — the oak-lesson-builder skill is the source: **pupil outcome** (one "I can…" sentence) → **key learning points** (3–5 precise knowledge statements) → **keywords** (pupil-facing definitions, one clause each) → **starter quiz** (checks prior knowledge) → learning cycles of **explanation (worked examples) → check → practice** → **misconceptions and common mistakes** (the wrong idea verbatim in quotes + the teacher response) → **teacher tips** → **content guidance + supervision level** where needed → **exit quiz** (checks the key learning points; distractors target the misconceptions). Classes: `.oak-outcome`, `.oak-key-learning-points`, `.oak-keywords`/`.oak-keyword`, `.oak-quiz`, `.oak-worked-example`, `.oak-misconception`, `.oak-practice`, `.oak-teacher-tip`, `.oak-guidance` — each semantic HTML with a visible `.oak-block-label`; headings take `--font-display` so authored content re-brands with everything else. See the "Authoring blocks" card for the full anatomy with real content.
- `DECISIONS.md` — why the system is the way it is: decisions, rationale, rejected alternatives, hard-won lessons. Read it before changing architecture; keep it current when you do. `CHANGELOG.md` — semver history + public-surface definition; `KNOWN-ISSUES.md` — understood gotchas, read before debugging.
- `whitelabel/` — the white-label contract proofs: two counter-brands (`creature/`, `pds/`) + `specimen.html` (byte-identical full app page, `?brand=<slug>`) + `failing-example.css` (negative control). Root pages `Identity White-Labelling.html` / `Identity Switchboard.html` / `Example Front Pages.html` demonstrate the contract.
- `dtcg/` — generated DTCG JSON token export (the CSS is canonical); `docs/` — consumption guides: `consuming-nextjs.md` (install, theme wiring, identity, §5b behaviour-library chooser, §7 new-component recipe) + pairing guides (`pairing-base-ui.md` default / `pairing-react-aria.md` dates+conformance / `pairing-ark-ui.md` non-React), `wrapped-widget-a11y-checklist.md`, `console-tui-tones.md`, `integration-oak-curriculum-hub.md` (the live consumer's migration plan), and `nextjs-theme-switcher.tsx`; `integrations/revealjs/` — Oak reveal.js theme.

## Page composition (region contract)

Build any full page shell on the region contract: `.oak-canvas` > `[data-region="utility|masthead|main|footer"]`, and `<main class="oak-main oak-region" data-region="main">` > sibling `[data-region]` sections (hero/navigation/featured/facets/results/detail/content/context/resources/support/cta). Declare the page type (`data-page="unit|home|proof"` or a new one) on `<body>`/canvas and scope any new map under `[data-page="…"]` — never :root. Regions must be SIBLINGS (no wrapper columns); DOM order is canonical; brands recompose via the map tokens. See the "Composition" card and brand.css §composition surface.
