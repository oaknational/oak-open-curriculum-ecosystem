# Changelog — Oak Open Curriculum Design System

## 1.7.0 — 2026-07-19

**Added — pairing guides ×3 + integration readiness.** Behaviour-library docs go multi-library per direction: `docs/pairing-base-ui.md` (the default; v1.3-pinned; data-attribute styling map, §7b as worked example), `docs/pairing-react-aria.md` (React Aria admitted as a documented non-default, scoped to date/time + locale widgets and conformance-critical surfaces — worked Oak-tokened DateField, `en-GB` I18nProvider gotcha), `docs/pairing-ark-ui.md` (the non-React/multi-framework/web-component option over Zag machines — worked Tabs styled via `[data-scope][data-part]`, chosen as third over Ariakit which overlaps Base UI ~90%). §5b reworked as a chooser table linking the three. **New `docs/integration-oak-curriculum-hub.md`**: grounded read of the live consumer (Next 16/React 19/Tailwind v4; today it mirrors ~30 token values as raw `@theme` hex literals, hand-rolls a single navy focus ring and a blanket motion collapse) + the §-by-§ migration (kit in → `@theme inline` alias RENAMES → theme/motion axis → double focus ring, recorded as `deliberate` in their fidelity register → components → audit-in-CI), the export/versioning contract, and our readiness checklist — **all green**: FDSE v7 full audit re-run 34/34 AA ×4 themes (brand-full.css verified loaded in-page), dtcg confirmed current, `docs/nextjs-theme-mapping.css` extended (`--color-warning`/`--color-info`, `--shadow-accent-brand`/`--shadow-neutral-brand`). DECISIONS "Behaviour-library direction" updated (React Aria exclusion → scoped admission). **Hand-off consistency pass**: research doc rev 3 aligned to the refined direction (scoped React Aria, Ark as documented third); KNOWN-ISSUES #11 (any capitalised-export `.tsx`/`.jsx` anywhere — docs/ included — compiles into the bundle; doc samples use `.tsx.txt`); SKILL.md docs index updated.

## 1.6.8 — 2026-07-19

**Added — the behaviour-library direction made operational.** Six artefacts recorded: consuming-nextjs.md §5b gains the **native-first decision matrix** (`<dialog>`/`<details>`/`popover`/`<select>` before any library; Base UI per-widget for the genuinely hard patterns) and a **version-watch register** (pinned against Base UI v1.3; point releases change behaviour; DatePicker gap re-evaluated on need); new **§7b worked example** — Oak-tokened Base UI Combobox (focus ring on parts + `data-highlighted`, state = fill+border+icon via `data-selected`, audit + SR checks as done-criteria). New `docs/wrapped-widget-a11y-checklist.md` (per-widget-class screen-reader spot-checks — the "library ≠ discharge" obligation made concrete); new `docs/console-tui-tones.md` (role→ANSI vocabulary for Ink TUIs: tone map mirroring the collaboration TUI's StatusTone, colour+label rule, NO_COLOR degradation, text-path-first); new **`LICENCES.md`** (fonts OFL, Material Symbols Apache 2.0, Bootstrap Icons/reveal.js/React/Base UI/Ink MIT, GDS influence-without-trade-dress note, Oak marks explicitly not open-licensed). README file index updated.

## 1.6.7 — 2026-07-19

**Changed — behaviour-library direction applied (owner).** `docs/headless-a11y-frameworks.html` rev 2: **Base UI is the default** recommendation (not React Aria — Adobe libraries excluded by direction; its a11y depth + the date/time-widget gap recorded honestly); Ariakit then Zag.js/Ark as fallbacks; new **Console TUIs — Ink** section grounded in the ecosystem repo's collaboration TUI (`agent-tools/src/collaboration-state/tui/`, Ink v7 + ink-testing-library): tokens port as a role→ANSI vocabulary not CSS, state stays colour-plus-label, `NO_COLOR`/`--format text` paths are the terminal a11y surface. consuming-nextjs.md §5b now names the picks. DECISIONS "Behaviour-library direction".

## 1.6.6 — 2026-07-19

**Fixed + docs.** `docs/nextjs-theme-switcher.tsx` → `.tsx.txt` — the compiler was picking it up and shipping it as a 5th public component (`ThemeSwitcher`) on the bundle namespace; it is a copy-paste doc artifact, not a compiled component (consuming-nextjs.md §4 updated). `preview/brand-icons.html` CATS grid now lists all 122 on-disk icons — 33 were missing (slide-deck-3, worksheet-3, social-facebook, social-x, and 29 subject-* variants), so the "Every OakIcon" caption under-claimed. New research doc: `docs/headless-a11y-frameworks.html` — headless a11y component frameworks compared (React Aria, Base UI, Radix, Ariakit, Headless UI, Ark/Zag), with recommendations to fold into consuming-nextjs.md §5b (React Aria Components default; Base UI second; Zag for non-React).

## 1.6.5 — 2026-07-19

**Docs — comprehensive Next.js consumption guide.** `docs/consuming-nextjs.md` rewritten end-to-end for current defaults (App Router, TS, Tailwind v4): install with folder geometry (incl. the oak-icons.css adjacency rule), next/font recipe, Tailwind `@theme inline` mapping, full theme-control wiring (`beforeInteractive` + `suppressHydrationWarning`, detection matrix: OS dark / prefers-contrast / forced-colors / reduced-motion / stored choice), identity setting for single-tenant (brand.css import order) and multi-tenant (server-emitted per-tenant link), page composition rules, and a NEW-component recipe (semantic HTML → tier-3 tokens from roles only → state never colour alone → non-negotiables → theme-proofing incl. audit pairings → naming + contributing back), with a worked `.oak-stepper` example. New `docs/nextjs-theme-switcher.tsx` — copyable hydration-safe theme + motion controls.

## 1.6.4 — 2026-07-19

**Added — icon roles for shared markup.** Byte-identical markup can't name an icon set (the three identities' mechanisms are mutually incompatible), so the public surface gains a role vocabulary: `.ic-<role>` on `.oak-icon--mask` resolves `--ic-<role>` (16 roles: search download next prev external close menu tick cross warning info star book quiz video worksheet). Oak defaults live in `oak-icons.css` (+ new `--i-books`); both counter-brands re-point the roles to their sets' SVG URLs in brand-full.css. The specimen exercises search/download/info/star/cross — same bytes, three glyph sets — and its former text-glyph "icons" (☆ save buttons, ✕ filter chips) are now role icons that re-brand with everything else.

**Fixed — Oak mask icons 404 (url-in-custom-property resolution).** `oak-icons.css` moved from `assets/` to the project root: a `url()` held in a custom property may resolve against the declaring OR the consuming stylesheet depending on engine, and the two locations disagreed — root-adjacent to components.css, both rules agree (KNOWN-ISSUES #10).

## 1.6.3 — 2026-07-19

**Changed — one distinct icon set per identity.** FDSE moves from Material Symbols Sharp to **Bootstrap Icons** (MIT, via jsDelivr; class-per-icon markup `bi bi-<name>`), so the three identities no longer share a design programme: Oak = official local SVG set, EMC² = Material Symbols Rounded (Apache 2.0), FDSE = Bootstrap Icons (MIT). BRAND.md/KNOWN-ISSUES #3/DECISIONS/brand.css §8 updated. Also fixed: assets/icons/lock.svg + pause.svg served 404 despite valid content (storage anomaly; re-saved unchanged — see HANDOFF gotcha), which broke two tiles on the Core icons card.

## 1.6.2 — 2026-07-19

**Review pass — cohesion + icon wiring.**

- **Added — the official Oak icon URL token map is now on the public surface**: `assets/oak-icons.css` (`--i-<name>` → `url(assets/icons/<name>.svg)`, ~80 names) loads via `styles.css`; use with `.oak-icon--mask` (`--icon-src:var(--i-tick)`) for currentColor tinting. Its pre-token-architecture `.oak-icon`/`.oak-mask` blocks (conflicting duplicates of components.css classes) were removed. Icon strategy per identity stands: Oak = official local SVGs; EMC² = Material Symbols Rounded (Apache 2.0); FDSE = Material Symbols Sharp (Apache 2.0) — licences now noted in each brand's icons.css.
- **Fixed:** three specimen cards still loaded renamed `tweaks-panel.jsx` (→ `.js`; brand-icons, banners, brand-subject-icons were broken); `Example Front Pages.html` linked the renamed `Byte-Identical.html` (→ `Identity White-Labelling.html`, + Switchboard link); dtcg `component.json` band.bg stale + band.radius missing; icon URL tokens noted as deliberately unexported in dtcg/README.
- **Docs:** KNOWN-ISSUES #4 rewritten for FDSE v7, #9 added (bundle carries the reveal.js vendor copy — kept deliberately; the consuming repo will take it as a real dependency); DECISIONS un-staled + "Direction outranks the placement rule"; README/SKILL index additions; HANDOFF compacted per session protocol. Full-project link audit: no broken local refs remain.

Versioning follows semver: MAJOR = breaking token/class renames or removals, MINOR = new tokens/classes/levers/templates, PATCH = value fixes and docs. Consuming projects copy a snapshot — check this file (top entry first) to see what changed since yours.

**Deprecation policy** (learned from govuk-frontend): public-surface names are never silently renamed. A deprecated token or class keeps working for at least one MINOR release, marked at its definition with `/* @deprecated since x.y — use --replacement */`, and is listed here under "Deprecated" before it ever appears under "Removed".

**Public surface** (what semver protects): tier-2 role tokens, tier-3 component tokens named in `brand.css` Parts A/B, all documented `.oak-*` classes, type slot roles (`--type-heading-*`/`--type-body-*`/`--type-label`), structure levers (`--container-max`, `--flow-*`, `--key-*`, `--band-*`), and the theme/motion attributes. Tier-1 `--oak-*` primitives and undocumented tier-3 internals are private — they can change in a MINOR.

## 1.6.1 — 2026-07-19

**Changed — EMC² refinement pass + band-radius token.** New `--band-radius` (default 0): full-bleed tone bands are square — `.oak-band` no longer inherits `--radius-container`, whose rounded corners collided with the masthead rule (EMC²'s "ears"; Oak's mint band also squares up, matching thenational.academy). EMC²: ambient pink glow removed from rest-state shadows (`--shadow-accent`/`--shadow-neutral` are crisp offsets; the glow is a reward, kept on `-raised` hover/featured); utility strip joins the nocturne via §expression hooks (`.util` → subtle plum, 16.9:1) instead of the inverted cream bar; dark decorative-3 de-mudded olive → butterscotch (#6d4715 family, 7.6:1 under white text).

## 1.6.0 — 2026-07-19

**Changed — Oak baseline re-expressed; FDSE expression layer.** `--band-bg` default is now `var(--surface-decorative-1)` (Oak's solid mint tone band, per thenational.academy hero grammar) instead of transparent — the neutralised baseline made Oak render as the generic contract and converge with FDSE/GDS. Counter-brands already re-point the token (FDSE grey panel, EMC² gradient) so only Oak's render changes. FDSE brand-full.css adds §11 expression layer (hook-clean, equal specificity): black masthead + 10px accent bar, inverted masthead wayfinding, 48px bold page titles. Byte-Identical caption updated v5→v7.

## 1.5.2 — 2026-07-19

**Changed — FDSE re-brand v7 "the public service" (brand surface only, no system tokens touched):** Freedonia DSE moves from v6 printed-record (warm paper/serif/oxblood) to authentic GDS visual design per direction — GDS colours (#0b0c0c ink, #1d70b8 links/accent, #00703c action buttons with #002d18 bottom edge, #f3f2f1 panels), GDS type scale (48/36/27/24/19 bold, 19/16/14 body, zero tracking) in Public Sans, GDS static spacing (10·20·30), 960px two-thirds/one-third grid, square/flat/motionless, flat tinted tags, black masthead + blue bar. No crown, no GDS Transport, no GOV.UK trade dress. Dark polarity re-derived on GDS hues (GDS ships light-only). Key pairs probed AA ×4 themes. See whitelabel/freedonia/BRAND.md v7.

## 1.5.1 — 2026-07-19

**Fixed — region collapse (real bug, long misread as a screenshot artifact):** `.oak-region` carried `container:region/inline-size`; inline-size containment zeroes a region's intrinsic width, and any region that is also `.oak-container` (auto inline margins — which disable grid-item stretch) collapsed to its padding (~48px “narrow column” render). Now `container-name:region` only — no size containment on the region grid item; opt into width queries on an inner wrapper. No shipped rule used `@container`, so nothing else changes. Also fixed: stray `</div>` in `whitelabel/freedonia/index.html` that closed `.oak-canvas` early and dropped support/context/footer out of the region grid; stale v5 caption in `Example Front Pages.html`.

## 1.5.0 — 2026-07-19

**Added — the lever-distance instrument** (`preview/lever-distance.html` + `lever-probe.html`, Brand group): samples ~26 brand levers from the live cascade per identity (computed values via probe iframes), flags pairwise coincidences, scores pairwise distance. Rationale: "near identical" must be measurable per lever, not just visible in the byte-identical gestalt — the matrix says WHERE distance collapsed. Probe gotcha encoded: page-type map tokens are read from `body` (where `data-page` lives), not the root.

**Changed — Freedonia v6 "the printed record"** (brand proof, not public surface): v5 GDS alignment superseded — GDS shares Oak's genre basin, so authentic GDS spent distance on hue/micro-form (the weakest axes) while agreeing with Oak on polarity, value structure, sans ink, flatness and motion. v6: warm archival paper, serif throughout (--font-sans itself), 36px flat scale, small-caps labels, oxblood letterpress buttons, archival low-chroma ramp, density 0.8, 44px dense targets, motion 0ms, folio composition (620px measure + marginalia facets). Audit 34/34 AA ×4 themes ×both stages. EMC² gained --container-max 1360 and 160/260ms motion (two coincidences with Oak the instrument caught). Lever scores: Oak↔FDSE 23/26 · Oak↔EMC² 26/26 · FDSE↔EMC² 26/26 (residuals irreducible: polarity has two poles; flat atmosphere is the print identity).

## 1.4.0 — 2026-07-19

**Added — inverted-surface roles promoted to tier 2 (public surface):** `--text-inverted-subdued` (muted text on inverted surfaces: footers, quote bands; grey40/grey60 flip) and `--border-inverted` (dividers/rings on inverted surfaces; grey50, ≥3:1 in both polarities; white in high-contrast). Rationale: 1.3.0's ui_kit rewrite derived these at point of use with color-mix — but a derivation that encodes a ROLE belongs on the role surface, the audit, and the export. Audit grew to 34 pairs (33 + the two new, one text + one non-text): 34/34 AA — Oak ×4 themes, EMC² + FDSE light/dark. contrast-pairings.json and dtcg/ regenerated. brand.css §4 documents the obligation when re-pointing `--bg-inverted`.

## 1.3.0 — 2026-07-19

**Fixed — systemic a11y cascade bug (found by the audit paying the EMC² debt):** the `high-contrast` and `colour-safe` theme scopes were `[data-theme]`-only (0,1,0) — tied with a brand's `:root`, losing on load order, so a dark-first brand silently gutted both themes (20/32 AA). All five `data-theme` values now also carry `:root[data-theme]` guards (0,2,0); an explicit theme choice beats any brand `:root` in every theme. Evidence: EMC² full 32/32 AA in all four themes AND both polarities (band gradient stops hand-checked ≥10.6:1 under text); FDSE full 32/32 ×4; Oak 32/32 ×4; failing-example still fails (negative control intact); Oak primitives zero-drift vs reference (positive control).

**Added:**

- `--density` (public surface, brand.css §7): ONE knob scaling `--gap-*` / `--inset-*` / `--card-pad` together (plush >1, dense <1). Targets, type and focus floors are not density-derived; direct token overrides still win. Raised from the §7c candidate-lever register (derivation over specification).
- brand.css §9: voice documented as brand surface (BRAND.md + proof pages carry it; the byte-identical page stays voice-neutral by definition — it is the controlled experiment).

**Changed:**

- `ui_kits/oak` fully tokenised — shared.js/sections.js/index.html now consume roles, tier-3 tokens and type slots exclusively (no raw values). The home proof page is now re-brandable and theme-live; the last hardcoded island is gone.
- `dtcg/` regenerated from CSS (was stale since 1.1.0): palette 84 / primitives 98 / semantic light 137 · dark 62 · high-contrast 65 · colour-safe 12 / component 73; 59 light-dark() splits; 15 functional values verbatim.

## 1.2.0 — 2026-07-19

**Changed (breaking for 1.1.0 maps):** composition maps are now **page-type scoped** — `--main-columns/-areas` (+`-narrow`) live under `[data-page="<type>"]`, never `:root`; the `:root` default is a universal all-regions single-column stack that is safe for any region subset. Pages declare `data-page` on `<body>` or the canvas.

**Added:**

- Generic region vocabulary: `navigation`, `featured`, `content`, `context` join the specialised set; shipped page types: `unit`, `home`, `proof`.
- Region contract rolled out: `ui_kits/oak/index.html` (home), both white-label proof pages (proof; EMC² ships a recomposed proof map — quests beside the naming drawer), specimen (unit).
- Out of scope by decision: deck slides and A4 worksheets (fixed-canvas media own their geometry); sub-page layout stays on the flow/band/stack/cluster primitives; preview cards are specimens, not pages.

## 1.1.0 — 2026-07-19

**Added — the region contract** (one HTML, many compositions; design note: uploads/one-html-many-css-compositions.md):

- New public classes: `.oak-canvas`, `.oak-main`, `.oak-region` (+ `data-region` hooks: utility/masthead/main/footer and hero/facets/results/detail/resources/support/cta).
- New public tokens: `--canvas-columns/-areas/-gap`, `--main-columns/-areas/-gap/-gutter`, `--main-columns-narrow/-areas-narrow` — whole-map grid templates a brand may redraw; direct region-name declarations are also on the surface (brand.css §composition surface).
- Regions are containers (`container-type: inline-size`); `reading-flow: grid-rows` ships under `@supports` as progressive enhancement; below 840px the -narrow maps apply.
- `whitelabel/specimen.html` restructured to shallow sibling regions (content unchanged); Freedonia + EMC² gained genuinely different composition maps; new "Composition" card group.

## 1.0.0 — 2026-07-19

First versioned snapshot. Contents:

- Three-tier token architecture (471 tokens), zero raw values at point of use; light / dark / high-contrast / colour-safe themes via `[data-theme]`; motion axis via `[data-motion]`.
- `.oak-*` class library + 4 compiled React components on the same tier-3 tokens.
- White-label contract (`brand.css` Parts A/B) with structure, ramp, atmosphere, and form levers; two counter-brand proofs (Educate My Creature Too; Freedonia DSE, GDS-aligned v5) + failing counter-example.
- Live contrast audit, a11y charter, media-formats cards; print layer; SVG contract.
- Templates: lesson deck (deck-stage, PPTX/standalone exports) + A4 worksheet (DOCX/MD exports); reveal.js theme; DTCG JSON export; Next.js/Tailwind mapping.
