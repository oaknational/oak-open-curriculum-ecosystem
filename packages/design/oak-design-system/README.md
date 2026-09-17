# Oak National Academy — Design System

> Our mission: to improve pupil outcomes and close the disadvantage gap by supporting teachers to teach, and pupils to access, a high-quality curriculum.

Oak National Academy is an independent, publicly funded body supported by the UK Department for Education, offering free, adaptable curriculum resources and AI tools for teachers. This design system makes anything — product UI, decks, worksheets, prototypes, marketing — feel unmistakably Oak: warm pastels, thick black borders, the signature lemon offset-shadow, Lexend, and a voice like a knowledgeable colleague in the staffroom.

**Built to WCAG 2.2 AA, fully themable (light / dark / high-contrast / colour-safe), no network dependencies for the system itself** — both faces (Lexend, Roboto Mono) ship as local files, so offline and strict-CSP deployments need no font exceptions.

## Integration in this repository (ADR-213)

This workspace **is** the design system — a first-class part of the
[oak-open-curriculum-ecosystem](https://github.com/oaknational/oak-open-curriculum-ecosystem)
monorepo and the estate's design source of truth
([ADR-213](../../../docs/architecture/architectural-decisions/213-design-system-integration-and-component-architecture.md)).
This repo is the system's only surface. Owner ruling 2026-08-12: "there is no
studio sync, the design system lives in this repo and this repo only." The Claude
Design studio project that once served as a second working surface is gone, and the
design-sync runbook that described exchanging files with it no longer describes
anything — every change lands here as a normal reviewed PR.

**Repo-specific notes:**

- The compiled React components under `components/` are deliberately **not** on this
  package's export surface (ADR-213 §3); apps compose Base UI + the class library instead.
- Some tracked files (the four component specimen cards, `templates/*/ds-base.js`, the
  standalone deck) reference `_ds_bundle.js` / `_ds_manifest.json` — a compiled bundle that
  is not built here. Those files are absent from the runtime locations these pages
  reference; the copies under `studio-source/original-capture-2026-07-23/` are provenance,
  not a runtime dependency. In-repo these pages are sources and fidelity targets, not
  served pages.
- **Structural boundary (owner ruling 2026-07-19)**: the non-production studio material
  (specimens, proofs, reference build, templates, reference components, integrations,
  proof pages) lives under [`studio-source/`](studio-source/README.md) — quality-gate
  scopes bind that path alone; everything at the workspace root is product surface under
  the full strict gate. The file index below is the layout of this workspace: instrument
  directories sit under `studio-source/`, consumable files and guidance documents at the
  root.
- Licensing dispositions per file class: [LICENSING-MANIFEST.md](LICENSING-MANIFEST.md);
  Oak marks are outside MIT per the repo's [BRANDING.md](../../../BRANDING.md).
- For Next.js theme bootstrap in THIS repo, ADR-213 §3 corrects `docs/consuming-nextjs.md`:
  use a raw inline head script, not `next/script beforeInteractive`.

## Quick start

```html
<link rel="stylesheet" href="styles.css" />
<!-- tokens + class library -->
<script src="oak-theme.js"></script>
<!-- optional: persisted theme switcher -->
```

**No-build install (copy path):** copy `colors_and_type.css`, `oak-icons.css`, `components.css`, `print.css`, `oak-theme.js`, `assets/icons/`, and `fonts/` — link the four CSS files in that order (equivalent to `styles.css`, which only `@import`s them; some serve contexts drop `@import`-only sheets — see `KNOWN-ISSUES.md` #1; `oak-icons.css` must stay root-adjacent to `components.css`). The copy path stays build-free for consumers: `oak-theme.js` is generated in this repo from `src/oak-theme.ts` (type-erasure only) and committed, with a repo gate holding the committed file byte-identical to the build output — copy it as-is. Versioning and what-changed: `CHANGELOG.md`.

Then build with **classes** and **semantic tokens**:

```html
<button class="oak-btn">Browse subjects</button>
<button class="oak-btn oak-btn--secondary oak-btn--sm">Search</button>
<span class="oak-tag oak-tag--mint">Year 7</span>
<div class="oak-card oak-card--lavender">…</div>
<div class="oak-field">
  <label class="oak-label" for="e">School email</label>
  <input class="oak-input" id="e" type="email" />
  <p class="oak-hint">We'll only use this for your account.</p>
</div>
<button class="oak-quiz-answer oak-quiz-answer--correct">
  <span class="oak-quiz-answer__key">B</span>Condensation
</button>
```

Full set in `components.css`: `oak-btn`, `oak-icon-btn`, `oak-tag`, `oak-card`(+link wrapper), `oak-chip`, `oak-field/label/input/textarea/select-wrap/hint/error`, `oak-choice/checkbox/radio`, `oak-banner`, `oak-quiz-answer`, `oak-link`, `oak-modal` (native `<dialog>` + `--scrim`), `oak-accordion` (native `<details>`), `oak-disclosure` (its dense borderless sibling — do not nest `oak-accordion` inside it), `oak-table`, `oak-skeleton`, `oak-empty`, layout primitives `oak-stack/cluster/grid/box` (gap-based; breakpoints sm 640 · md 960 · lg 1280), `oak-container`, `oak-prose`, `oak-skip-link`, `oak-visually-hidden`, `oak-icon--mask` (currentColor icons for arbitrary surfaces), `oak-scope` (native-element defaults), `oak-interactive` (the signature border+shadow+press). Type classes (`oak-heading-1…7`, `oak-body-1…4`, `oak-code-2…4`) live in `colors_and_type.css`.

## Token architecture

Three tiers; **no raw values at point of use anywhere** — every colour, size, weight, radius, shadow and duration resolves through a token:

1. **Primitives** (tier 1, `colors_and_type.css`) — literal values live only here: `--oak-*` palette (light + dark + high-contrast + colour-safe sets), `--space-*`, `--radius-*`, `--border-solid-*`, `--font-size-1…14` (rem), `--leading-*`, `--weight-*`, `--tracking-*`, `--size-icon-*`, `--size-target*`, `--layer-*`, `--motion-*`.
2. **Roles** (tier 2, same file) — themable meaning composed from primitives via `light-dark()`. **Canonical roles are intent-named and brand-neutral**: `--text-*`, `--bg-*`, `--border-*`, `--color-accent[-soft|-subtle]`, `--surface-decorative-1…6[-soft|-subtle]`, `--bg-{info|success|warning|error}-subtle`, `--bg-selected`, `--shadow-accent*`/`--shadow-neutral*`, `--shadow-ground[-inverted]`, `--focus-ring[-inverted]`, `--filter-icon*`, plus type slots (`--type-heading-*`/`--type-body-*`/`--type-label`/`--type-code-*`) and geometry roles `--radius-control`/`--radius-container`/`--control-pad-*`. Oak-dialect aliases (`--surface-mint`, `--shadow-lemon`…) are pure `var()` references to canonicals — authoring sugar, never redefined per theme or brand.
3. **Component tokens** (tier 3, top of `components.css`) — `--btn-*`, `--tag-*`, `--card-*`, `--input-*`, `--quiz-*`… composed from roles + scales. The `.oak-*` classes and the compiled React components consume the **same** tier-3 tokens, so the two consumption paths cannot drift.

Rules: reference primitives only inside token definitions (or deliberately fixed art like SVG source); build UI from roles + component tokens; add a new token rather than writing a literal.

**Starting points:** `templates/lesson-deck/` (teaching slides in Oak's lesson shape) and `templates/worksheet/` (printable A4, PDF-ready). `ui_kits/oak/index.html` is a full homepage reference build. `preview/*.html` are per-component specimen cards.

## Theming

Semantic tokens are defined with CSS `light-dark()`; themes are one attribute — on `<html>` for the page, or **on any subtree**:

```html
<html data-theme="dark">
  <!-- also: system · high-contrast · colour-safe -->
  <aside data-theme="dark">…</aside>
  <!-- theme just this panel -->
</html>
```

- **light** (default) — no attribute needed.
- **dark** — Oak's own dark palette (dark pastels, white primary buttons, lavender links). The lemon shadow stays lemon: it's the signature.
- **system** — follows the OS preference live.
- **high-contrast** — black on white, decoration stripped, meaning kept. (Windows High Contrast Mode is additionally supported automatically via `forced-colors`.)
- **colour-safe** — for red–green colour-vision deficiency (~8% of men): success/error remap to Okabe-Ito blue/vermilion. Decorative pastels are untouched because they never carry meaning.

`oak-theme.js` persists the choice (`oakTheme.set("dark")`).

## White-label / re-branding

The system is a hard white-label target: **zero literals at point of use**, so a re-brand is a stylesheet, not a fork. Since 1.1.0 that includes **composition**: pages built on the region contract (`.oak-canvas`/`.oak-main`, sibling regions) expose their whole page map as tokens (`--main-areas`…), so a brand can redraw the page architecture without touching HTML — see the "Composition" card and `whitelabel/specimen.html`.

1. Copy `brand.css` — it is the complete, documented override contract (fonts · `--color-accent` · decorative ramp · neutrals · buttons · functional colours · shape & motion · icon rendering). Uncomment what you change; load it after `styles.css`.
2. **One token recolours the signature**: `--color-accent` drives the offset shadows, focus-ring inner, highlights, markers and selected states everywhere.
3. Override **canonical roles only** (intent names). The Oak-dialect aliases follow automatically; the four themes keep working untouched.
4. Supply both halves of each `light-dark()` pair, replace `assets/logo-*.svg`, and keep icons monochrome black (or re-point `--filter-icon*`).
5. **Re-validate**: contrast guarantees don't transfer to a new palette — the "Contrast audit (live)" card computes every role pairing per theme, with `brand.css` already in its cascade.

**App-layer roles** ship for arbitrary product UI: elevation (`--bg-raised`/`--bg-overlay`/`--scrim`, with dark elevating by lightening), mix-derived state overlays (`--state-hover/pressed/selected` — correct over any surface in any theme), and motion verbs (`--motion-enter/exit/emphasis`, all collapsing under reduced motion). **Performance budgets are access** — slow UIs exclude learners on low-end devices — but budgets are product decisions: define them as tokens in the consuming app (e.g. `--budget-first-interaction: 200ms`), not here; the charter card carries the principle.

## Design excellence across media

The token architecture is the portability layer — every medium consumes the same roles (see the "Media & formats" card):

- **Web & mobile** — classes + layout primitives; ≥44px targets; reflow to 320px/400%; breakpoints sm 640 · md 960 · lg 1280.
- **Print & PDF** — `print.css` ships in the cascade: one `color-scheme` flip prints dark pages light (every colour role is `light-dark()`); meaning-bearing fills keep ink (`print-color-adjust`); no card/answer/row splits across pages. `templates/worksheet/` is the A4 reference; 12pt body floor.
- **Presentations & projection** — display scale `--font-size-11…14` (64–96px); `templates/lesson-deck/` at 1920×1080 with a ≥24px floor; hierarchy carried by borders + fills so slides survive washed-out classroom projectors.
- **DOCX** — Word can't consume CSS; map the ramp to named paragraph styles instead: Title ← `oak-heading-3` (30pt semibold) · Heading 1 ← `oak-heading-4` (24pt) · Heading 2 ← `oak-heading-5` (18pt) · Heading 3 ← `oak-heading-6` (15pt) · Body ← `oak-body-1` (13.5pt light) · Caption ← `oak-body-3` (10.5pt), Lexend embedded, colours from the light-theme roles.

**Shipped editable artifacts** (each template ships in the formats schools and home educators actually edit):

- `templates/worksheet/Oak Worksheet.docx` — native Word styles per the ramp mapping above; opens for editing in Word, Google Docs and LibreOffice (save as ODT from there if needed).
- `templates/worksheet/worksheet.md` — universal plain-text fallback; imports anywhere.
- `templates/lesson-deck/Oak Lesson Deck.pptx` — native editable text and shapes; opens in PowerPoint, Google Slides (File → Import) and Keynote.
- `templates/lesson-deck/Oak Lesson Deck (standalone).html` — self-contained offline slides; works from a double-click with no server or install, presents in any browser.
- **SVG** — inline SVG is on the token contract: icons author `fill="currentColor"` + `.oak-svg-icon`; diagrams use `.oak-svg-ink/-subdued/-surface/-accent/-d1…d5/-stroke-*`. Attribute hexes are reserved for fixed brand art. Same markup themes, prints, and re-brands (see the "SVG styling" card).

### Shipped editable artifacts

Every format supports user edits — nothing is a flattened image:

- `templates/worksheet/Oak Worksheet.docx` — native Word heading styles (structure stays navigable); opens in Word, Google Docs, LibreOffice (covers ODT users via Save As).
- `templates/worksheet/worksheet.md` — universal plain-text fallback for home education, LMS upload, or anywhere else.
- `templates/lesson-deck/Oak Lesson Deck.pptx` — native editable text and shapes; opens in PowerPoint, Google Slides (Drive import), Keynote.
- `templates/lesson-deck/Oak Lesson Deck (standalone).html` — single self-contained file: works offline, shares by email/USB/VLE, presents in any browser (arrow keys), prints to PDF.
- The live templates themselves (`*.dc.html`) remain the source of truth — regenerate exports after editing them. **The rule that makes theming free: build with semantic tokens (`--text-primary`, `--bg-primary`, `--surface-mint`, `--border-primary`, `--filter-icon`…), never raw hexes.** Raw `--oak-*` primitives never appear at point of use — they exist only inside token definitions and deliberately fixed art (SVG source, brand marks). Even the templates (slides, worksheet) are fully role-token-driven and theme live.

## Accessibility (WCAG 2.2 AA minimum — AAA the aspiration)

Access is not a compliance checkbox: all learners have a fundamental right to access education, so AA is the floor in **every** theme and every re-brand (see `brand.css` — it's a condition of the white-label contract), and we exceed it wherever the design allows. Core text pairs run 7:1+ (AAA); md targets are 48px (AAA asks 44); body classes sit at ≥1.5 line-height; with no stored theme choice, an OS request for more contrast (`prefers-contrast: more`) gets the high-contrast theme automatically. The "Contrast audit (live)" card computes every pairing per theme and marks AA vs AAA.

Baked into the class library — keep it that way in what you build:

- **Focus:** every interactive class shows the double ring (lemon 2px + contrast 5px) on `:focus-visible`, plus a transparent outline so forced-colors mode draws its own. Never remove it.
- **Targets:** md controls ≥44px; `--sm` (36px) is for dense desktop UI only (2.5.8 requires 24px; we exceed it).
- **Contrast:** every token pairing ships ≥4.5:1 text / ≥3:1 non-text in every theme. Text on pastel fills is `--text-primary` at weight 400+, never white, never 300 below 18px. Body weight 300 lives on white/near-white at 16px+.
- **State is never colour alone:** correct/incorrect pair fill with border + icon + text (crucial for the colour-safe theme to mean anything).
- **Motion:** 120/200ms only (`--motion-quick/base`), no bounces or parallax; everything collapses under `prefers-reduced-motion`.
- **Structure:** sentence case (title case is flagged as an a11y barrier), real `<label>`s, `aria-invalid` + `aria-describedby` on errored fields, `role="status"/"alert"` on banners, `oak-skip-link` for keyboard users, alt text on meaningful icons (`alt=""` on decorative).

## Voice — how Oak writes

Empowering, personable, direct. Like a warm colleague, never corporate. Full toolkit in `brand_voice.txt`; the essentials:

- **You, not we.** Copy celebrates teachers, not Oak.
- **Contractions always** (_we're, you'll, don't_). Short sentences. No jargon.
- **Sentence case everywhere** — headings, buttons, titles.
- **Pupils**, never students. **Aila** (never AILA) supports teachers; teachers stay in control. **Oak** or **Oak National Academy**, never ONA.
- British spelling. No emoji in product. Avoid "catch-up" (_address gaps in knowledge_), "NQT" (_early career teacher_).

> We're Oak, and we want to give you back hours of your week. We do that by giving you free resources and tools to help you prepare high-quality teaching for all your pupils.

## Visual foundations

- **Colour:** neutral-first — near-black `#222` on white. Oak green `#287c34` for brand marks and success. Six pastel families (mint, aqua, lavender, pink, lemon, amber) with subtle tints for card fills and section panels; each has an Oak-designed dark counterpart. Lemon `#ffe555` is the hero accent. Navy for links. **No gradients, ever.**
- **Type:** Lexend for everything (local file, weights 100–900). Body is weight 300, 18/28; emphasis is 700. Headings 600 with slight positive tracking. Scale 12→56px. Roboto Mono for code (local file, weights 100–700).
- **Shape:** thick black borders (2–3px) and radii of 8/16px define components. 4px spacing grid.
- **Shadows:** solid-colour offsets, not blurs — `--shadow-lemon` (2px), `--shadow-wide-lemon` (4px, hover), `--shadow-grey`. The one blur is `--shadow-standard`.
- **The signature interaction:** hover widens the shadow; press collapses it and translates +2px,+2px — like physically pressing the element. Focus is the lemon double ring.
- **Backgrounds:** solid pastel blocks; confetti SVGs on pupil journeys; hand-drawn marks (`assets/brand-*.svg`) for flavour. Photography only paired with a coloured panel — never text over photos.
- **Layout:** 1280px max content width (`oak-container`), ~65ch reading columns (`oak-prose`), 12-col grid at desktop, generous white space. Breakpoints: stack below 768px, full grid from 1024px.

## Iconography

Flat, stroke-based, black-on-transparent SVGs — **bundled locally in `assets/icons/`** (~140 icons: UI, subjects, brand marks). Recolour via `filter` — use `var(--filter-icon)` so icons flip correctly in dark themes. Never emoji, never Unicode symbols as icons. If you need an icon that isn't in the set, use [Lucide](https://lucide.dev) (same stroke feel) and flag the substitution. (The production Cloudinary icon-name map lives in the committed capture tier as `icons.json` — provenance reference only, never loaded at runtime.)

## Compiled components

Four primitives ship as mountable React components on the design-system bundle (`components/`): **OakButton**, **OakTag**, **OakSubjectChip**, **OakIcon** — typed props, full states, theme-aware. Everything else is copy-paste HTML by design — meaning the class-library markup shown in this README and the docs. The `preview/*.html` specimen cards are **visual specimens, not copy sources**: several deliberately mock structure for compact rendering (div-based textareas, non-interactive choice rows) and must not be pasted into product UI as-is.

## File index

```text
styles.css              ← THE entry point: all three token tiers + class library + print layer
brand.css               ← white-label override contract (commented template)
print.css               ← print & PDF layer (ink-safe theming, break rules)
colors_and_type.css     ← tier 1 primitives + tier 2 roles (canonical + aliases), themes, @font-face, type classes
components.css          ← the class library
oak-theme.js            ← persisted theme switcher
brand_voice.txt         ← full voice & style toolkit
CHANGELOG.md            ← semver history, public-surface definition, deprecation policy
KNOWN-ISSUES.md         ← understood gotchas — read before debugging
DECISIONS.md            ← the decision journey — intent, rationale, rejected alternatives, lessons
LICENCES.md             ← third-party licences + Oak-marks boundary — travels with every export
docs/                   ← consumption guides: consuming-nextjs.md (full
                          Next.js guide: install, fonts, Tailwind mapping, theme wiring, identity,
                          §5b chooser, new-component recipe), pairing guides (base-ui / react-aria /
                          ark-ui), integration-oak-curriculum-hub.md,
                          wrapped-widget-a11y-checklist.md, console-tui-tones.md,
                          one-html-many-css-compositions.md (composition doctrine),
                          headless-a11y-frameworks.html (research), nextjs-theme-mapping.css,
                          nextjs-theme-switcher.tsx.txt
dtcg/                   ← DTCG JSON token export (generated FROM the CSS; see dtcg/README.md)
whitelabel/             ← white-label PROOFS: creature/ + pds/ (brand-a.css, brand-full.css,
                          logo, live proof page, card) + failing-example.css (guardrail stress test)
Identity White-Labelling.html ← byte-identical proof — one specimen, three brands side by side
Identity Switchboard.html     ← one specimen copy + live identity/stage/theme controls
Example Front Pages.html      ← three composed per-identity front pages, side by side
integrations/revealjs/  ← Oak reveal.js theme + sample deck
assets/                 ← logos, brand marks, icons/ (local SVG set)
oak-icons.css           ← icon URL token map (--i-* names + --ic-* roles; root-adjacent to components.css by design)
fonts/                  ← Lexend + Roboto Mono variable fonts + their OFL notices
templates/
  lesson-deck/          ← teaching-slides starting point (deck-stage)
  worksheet/            ← printable A4 worksheet (doc-page, PDF-ready)
components/             ← compiled React components (.jsx + .d.ts + card)
preview/                ← specimen cards for the Design System tab
ui_kits/oak/            ← full homepage reference build

```

---

## Appendix — production handoff

In production Oak ships **[`@oaknational/oak-components`](https://www.npmjs.com/package/@oaknational/oak-components)** (React + TypeScript + styled-components, [Storybook](https://components.thenational.academy)). This system mirrors its vocabulary as framework-agnostic HTML/CSS for prototyping; for production code, install the real package (`pnpm add @oaknational/oak-components`, needs React ≥18.2, Next ≥14.2.12, styled-components ≥5.3.11) and wire `OakThemeProvider` + `OakGlobalStyle` + Lexend via `next/font/google`. Icons/images need `NEXT_PUBLIC_OAK_ASSETS_HOST=res.cloudinary.com` and `NEXT_PUBLIC_OAK_ASSETS_PATH=oak-web-application/image/upload`.

Canonical sources: [Oak Design Kit (Figma)](https://www.figma.com/design/YcWQMMhHPVVmc47cHHEEAl/Oak-Design-Kit?node-id=0-1) · [oak-components repo](https://github.com/oaknational/oak-components) · [Oak-Web-Application repo](https://github.com/oaknational/Oak-Web-Application) · [OWA Storybook](https://storybook.thenational.academy).

Raw upstream values live in the committed capture tier (`studio-source/original-capture-2026-07-23/reference/`) — token names there are verbatim (including upstream quirks like "lavendar"); this system's runtime layer intentionally simplifies them. When upstream changes, re-check `colors_and_type.css` against a fresh dump.

**Licence:** code and repo-authored docs MIT; Oak material already published on Oak surfaces other than this repo and its apps (the brand voice toolkit text, curriculum content — sources cited in `LICENSING-MANIFEST.md`) © Oak National Academy under OGL v3.0; Oak trademarks and logos are covered by neither — use per the [Oak brand guidelines](https://support.thenational.academy/using-the-oak-brand).
