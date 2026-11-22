# AIP-137 Stage-A import verification — independent second pass (PR2, commit 922f2e806)

**Author**: Salmon binds Undertow (`de5c10`), reviewer seat, n=3 session 2026-07-19 (peers:
Caracal wakes Tunnel `265648` — PR2 implementer; Harrier rides Updraft `416a38` — PR3
validation lane).
**Scope**: adversarial verification of the design-system initial import
(`packages/design/oak-design-system`, 290 files, local commit `SHA:922f2e806` on
`<owner>/aip-137-pr2-design-system-stage-a`) against the invariants ADR-213 §1 records
and the licensing manifest declares. Read-only pass; no tree modifications.
**Method**: six parallel audit dimensions (22 agents total), every non-pass finding
independently re-verified by an adversarial second agent, and the three highest-stakes
findings additionally reproduced first-hand by the report author. Dimensions:
manifest↔tree correspondence; referential self-consistency; licence boundary; external
network dependencies; empirical DTCG data sheet (consumer: the PR3 lane); workspace +
repo-config hygiene.

## Verdict

**The Stage-A import is sound and PR2-ready after a small cure set.** The licence boundary
holds on all six checks (OFL notice, vendored reveal.js MIT text, BRANDING.md consistency,
no unaccounted third-party headers). Referential self-consistency holds under the
manifest's documented public-surface reading. The hold-out discipline is exact (workspace
`.gitignore` is a 1:1 projection of manifest classes 15–16, `/support.js` anchoring
correct). The package `exports` map fences the React components per ADR-213 §3, and all
four repo-config hunks in the commit are scoped to the import. Against that clean base:
**two manifest↔tree fails, one undeclared runtime network dependency in the shipped
system CSS, and six notable flags** — every one curable inside PR2 before it undrafts.

## Findings (all independently verified; F1–F3 also reproduced first-hand by the author)

| #   | Sev     | Finding                                                                                                                                                                                                                                                                                | Evidence                                                                                                                                                                              | Suggested cure                                                                                                                                                                                                                | Routes to                     |
| --- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| F1  | notable | **Manifest phantom: `dtcg/README.md` declared Track, does not exist** anywhere (not tracked, not loose, absent from every ref). The plan quotes this README's convergence claims — the quote source is the studio bundle, not the repo tree.                                             | `LICENSING-MANIFEST.md:30`; `dtcg/` holds exactly 8 `.json` files                                                                                                                       | Import the README from the studio (it carries the convergence deltas PR3 wants) or correct the class-2 row                                                                                                                     | Caracal / PR2                 |
| F2  | notable | **All four component `.d.ts` files silently untracked**: root `.gitignore:55 **/*.d.ts` swallows them; class 6 declares them Track. Zero `.d.ts` tracked; files exist loose in the tree. Nothing imports them (components are export-fenced), so notable not critical.                   | `git check-ignore -v` → `.gitignore:55`; `git ls-files … \| grep -c '\.d\.ts'` = 0                                                                                                      | Root-gitignore negation entries (two hand-authored negation precedents exist at lines 59/64) or carve `.d.ts` out of the class-6 row                                                                                            | Caracal / PR2                 |
| F3  | notable | **Shipped class-1 CSS carries a live runtime Google Fonts dependency, fully undeclared**: `colors_and_type.css:3` `@import`s Roboto Mono from `fonts.googleapis.com` (implies follow-on `fonts.gstatic.com` fetches). Absent from KNOWN-ISSUES, the manifest, and LICENCES.md's font table; the file's own comment says "swap for local files if licensing requires". Every consumer of the canonical CSS chain (MCP App views at Stage B) inherits the call — privacy/GDPR + offline posture. | `colors_and_type.css:1-3`; grep -i roboto over LICENCES/DECISIONS/MANIFEST: no hits                                                                                                     | Minimum for PR2: declare it (KNOWN-ISSUES + manifest + LICENCES.md font table). Better: localise the font — the repo already tracks Lexend locally under OFL, and Roboto Mono is Apache-2.0, so the same pattern applies         | Caracal / PR2 (+ owner visibility) |
| F4  | notable | **Oak-marks classes 13/14 are committed ahead of the owner call** — the tree enacts the manifest's track recommendation before ratification. By design the PR is the review surface; the PR body should make the ratification explicit so merging is a conscious licensing act. Also: class 14 says "~140" icons; the tree holds 128.                                                        | `LICENSING-MANIFEST.md:41-42`; 11 mark files + 128 icon SVGs + `icons.json` tracked                                                                                                     | Name the marks ratification explicitly in the PR body's owner-gate section; true up "~140" → 128                                                                                                                               | Owner gate (via PR2 body)     |
| F5  | notable | **ADR-213 §1's referential-integrity sentence is literally absolute** ("no tracked file may reference a held-out file" — no qualifier), while the tree (correctly, per the manifest's documented exception) has ten tracked studio-wiring files referencing `_ds_bundle.js`. Invariant holds under the manifest's public-surface reading; the ADR text and tree disagree verbatim.             | ADR-213 line 72; wiring inventory: 4 specimen cards, 4 `.jsx`, `templates/*/ds-base.js`, standalone deck                                                                                | At ADR ratification, add the public-surface qualifier + exception pointer to the ADR sentence (it is still Proposed — cheap now)                                                                                                | ADR ratification (PR2/PR1 window) |
| F6  | minor   | **README file index lists held-out entries with no held-out marker** (`thumbnail.html`, `reference/`, `SKILL.md` at README.md:215/225-227/229; `components.css:1049` also points readers at SKILL.md). A repo consumer following the index looks for files that are not there.                                                                                                                | README.md:188-230                                                                                                                                                                       | One-line held-out annotations (or a pointer to manifest classes 15–16) on those index entries                                                                                                                                  | Caracal / PR2                 |
| F7  | minor   | **Undeclared (but pinned + SRI'd) CDN loads beyond the declared set**: `ui_kits/oak/index.html:26-41` and the 4 component cards load React from unpkg while LICENCES.md:26 scopes CDN code to "preview/specimen cards only"; `templates/*/support.js:1072-1077` embed an unpkg CDN-fallback loader; creature `brand-a.css:4` loads Nunito/Baloo 2 (KNOWN-ISSUES 3 names only the icon font). Declaration-surface gap, not a hygiene gap.                                                        | Full inventory in §Network below                                                                                                                                                        | Widen LICENCES.md:26 scope wording + KNOWN-ISSUES 3; no code change needed                                                                                                                                                     | Caracal / PR2                 |
| F8  | minor   | **Manifest orphan set**: `.gitignore`, `LICENSING-MANIFEST.md`, `package.json` (the workspace's own integration scaffolding) belong to no manifest class.                                                                                                                                                                                                                                     | Exhaustive subtraction, classes 1–14 vs 286 tracked files                                                                                                                               | A one-row "class 0: repo-integration scaffolding" or a scope sentence ("manifest covers studio-export files")                                                                                                                  | Caracal / PR2                 |

## Empirical DTCG data sheet (for the PR3 validation cycles)

All numbers recomputed against the tracked tree (author re-verified the tree counts
first-hand). 8 files, 537 tokens across 7 token trees + the contrast manifest.

1. **The four semantic theme trees are NOT key-identical — the plan's falsifier fired.**
   Flattened `$value` path counts: light **139**, dark **63**, high-contrast **67**,
   colour-safe **12**. The three non-light trees are **strict subsets of light with zero
   extras** (override deltas). The completeness cycle needs the declared-subset /
   override-delta model the plan anticipated; strict key-set equality fails immediately.
2. **Root dialect is mixed.** `palette.json` is namespaced `oak.color.*`; every other tree
   uses bare group roots (`bg.*`, `text.*`, `space.*`, `btn.*`, …) with bare curly-brace
   refs. Zero `{semantic.*}` spellings exist anywhere. 47 within-semantic-tree aliases use
   bare root names (45 light, 2 high-contrast). Ref-prefix census: oak 202, font 24,
   weight 12, leading 12, surface 17, shadow 14, border 11, color 10, motion 6, focus 2,
   space 2, bg 1.
3. **Two root-group collisions in a naive merged namespace**: `border` (primitives widths
   `solid-*` vs semantic border COLOURS) and `control` (semantic.light `{pad-block,
   pad-inline}` vs component `{size, border}`). Child key sets are disjoint so a deep
   merge resolves, but a validator keying groups by file-of-origin or rejecting duplicate
   roots breaks; live `{border.solid-*}` refs from semantic values already depend on the
   merged resolution.
4. **15 tokens carry CSS function `$values`** — the boundary-rejection cycle has real
   targets: 3 × `color-mix(` (all `semantic.light` `state.*`; `state.hover`/`state.pressed`
   depend on `currentColor` so they are not statically resolvable) and 12 × `calc(` (all
   `component.json`; refs appear INSIDE function strings, so a resolver must interpolate
   refs inside arbitrary strings, not just whole-value aliases).
5. **`contrast-pairings.json` shape**: top-level `{pairs, triads}`; `pairs` = 34 elements,
   uniform shape `{foreground, background, context}` with `context` ∈ {`text`,
   `non-text`}; values are bare-dialect semantic paths. **`triads` is present but EMPTY** —
   the plan's "component-tier triads authored or absence recorded" item is empirically
   "absent".
6. **`$type` coverage**: 131 of 537 tokens have no `$type` and there is ZERO group-level
   `$type` anywhere, so DTCG group inheritance cannot supply them (component.json 68/74
   untyped; semantic.light 50/139). A strict resolvable-`$type` validator rejects these
   131. Also: zero `light-dark(` occurrences in any dtcg file (the split trees carry the
   polarity).
7. **`dtcg/README.md` does not exist in the repo** (F1) — the plan's quoted claims about
   `oak.color.*` repo-convention compatibility come from the studio copy. Empirically only
   `palette.json` is `oak.`-rooted.

## External network surface (full inventory)

Three hosts total across 286 tracked files (112 css/html/js/jsx): `fonts.googleapis.com`
(`colors_and_type.css:3` ← the F3 item; `whitelabel/creature/icons.css:7`;
`whitelabel/creature/brand-a.css:4`; `whitelabel/freedonia/brand-a.css:9`),
`cdn.jsdelivr.net` (whitelabel brand-full/icons files), `unpkg.com` (4 component cards, 4
preview pages, `ui_kits/oak/index.html`, `templates/*/support.js` CDN-fallback loader).
Every unpkg load is exact-pinned with sha384 SRI + crossorigin. The standalone deck embeds
its resources (offline at runtime). The three root proof HTML files carry zero external
refs. No protocol-relative, preconnect, external-fetch, or SVG external-ref vectors found.

## Checks run clean (the pass surface)

Manifest classes 1, 3–5, 7–12, 15–16 correspond exactly (hold-outs verified absent AND not
loose). Referential self-consistency: public-surface files carry zero runtime references
to held-out names (two comment mentions only: `styles.css:13`, `components.css:1049`); the
`./support.js` script tags in `.dc.html` templates resolve to the TRACKED nested
`templates/*/support.js` (the workspace `.gitignore`'s `/support.js` anchor correctly
spares them); nothing references `uploads/`/`reference/` including inside the `.pptx`/
`.docx` binaries. Licence boundary: all six checks pass (LICENCES.md complete for Lexend
OFL + counter-brand sources; vendored reveal.js retains its MIT text at
`integrations/revealjs/vendor/LICENSE` + inline header; BRANDING.md's operative clause is
consistent with the class-13/14 recommendation; the hub's tracked `oak-logo*.svg` baseline
claim is factually true; Material Symbols / Bootstrap Icons are CDN-only, not vendored).
Hygiene: `package.json` exposes no React component exports and carries no React
dependency; `styles.css`'s four local `@import`s all resolve to tracked files;
`oak-icons.css` sits at the root beside `components.css` and all 59 icon `url()` tokens
resolve to tracked assets (full audit, not sampled); the four repo-config hunks
(`.dependency-cruiser.mjs`, `knip.config.ts`, root `.gitignore`, root `.prettierignore`)
are scoped to the import with dep-cruiser/knip exclusions correctly shaped for a
no-module-graph static-asset workspace; the README documents the studio-runtime wiring
exception and the design-sync runbook.

---

## Part 2 — Empirical probes: CSS↔DTCG consistency and four-theme contrast (2026-07-19, same seat)

**Method**: deterministic probe script (conserved beside this report as
`aip-137-dtcg-probes-2026-07-19.py`; comparison + WCAG 2.x
computation), then three independent adversarial verifiers: a methodology attack (re-ran
Probe A with its own tokenizer-based comparator and reconciled the full 518-declaration CSS
census), a full independent recomputation (**all 136 pair-theme rows recomputed from the raw
JSON — zero diffs** in hex, ratio, AA or AAA verdicts), and raw file-quote spot-checks.
Verdicts: sound-with-caveats / sound-with-caveats / sound. Caveats are scope notes, all
independently closed and recorded below.

### 2.1 The dtcg export is value-consistent with the canonical CSS — every token

Zero mismatches: palette 84, semantic light 139 / dark 63 / high-contrast 67 / colour-safe
12, component 74 (probe), **plus primitives 98/98 (verifier's independent check — the probe
itself skipped that tier; combined coverage is all 537 tokens)**. Structural findings the
future CI consistency check must encode:

- Exactly **two live naming transforms**: `oak.color.x` → `--oak-x` and `font.family.x` →
  `--font-x`; every other path maps mechanically (`a.b` → `--a-b`). Zero collisions across
  all dtcg paths.
- **Dark `filter.*` values live in the explicit `[data-theme='dark']` block** (`filter`
  cannot ride `light-dark()`); `semantic.dark`'s 63 keys are exactly the 60 `light-dark()`
  roles + these 3 — no role can silently retain a light value in dark.
- The theme-merge model (dark/HC/CS overlaid on the light base) is faithful to the cascade:
  the HC/CS blocks set `color-scheme: light`, so non-overridden `light-dark()` roles keep
  their light arms, matching overlay-on-light semantics.
- Two pair-relevant tokens are absent from the dark tree and verified safe: `border.inverted`
  (fixed `--oak-grey50` in both polarities by design, `colors_and_type.css:277`) and
  `bg.selected` (themes via the dark-overridden `color.accent-subtle` ref).
- Reverse coverage: only `--canvas-rows` and `--icon-src` exist in CSS with no dtcg
  counterpart — non-token plumbing (grid rows; per-class icon dispatch), deliberate.
- `[data-page='unit'|'home'|'proof']` re-declare the four map tokens and `.ic-*` classes
  re-declare `--icon-src`; the probe compares the `:root` fallback (correct today by source
  order). **The real CI check should key the comparand on `:root` scope explicitly, use a
  real CSS parser (the probe's brace scanner is unsafe against CSS nesting and quoted
  braces), and include the primitives tier.**

### 2.2 Four-theme contrast, computed: AA clean everywhere; HC meets AAA today

All 34 manifest pairs (26 text / 8 non-text) resolve to opaque hex in all four themes —
zero unresolvable, zero AA failures (thresholds 4.5 text / 3.0 non-text). Ratios are stable
under both sRGB knee constants (0.03928/0.04045): zero verdict flips; the closest AAA call
anywhere is 7.1287 vs 7.0 (dark `text.primary` on `surface.decorative-5`).

**AAA (text pairs, n=26) — the ADR-213 owner-gate data:**

| Theme         | AAA   | Misses (ratio, resolved values)                                                                                                          |
| ------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| high-contrast | 26/26 | — (**gating HC at AAA costs nothing as of this snapshot**)                                                                                |
| dark          | 25/26 | `text.error`/`bg.primary` 6.20 (`#ee809a` on `#222222`)                                                                                   |
| light         | 23/26 | `text.subdued`/`bg.subtle` 6.86 (`#575757` on `#f9f9f9`); `text.error`/`bg.primary` 5.09; `text.success`/`bg.primary` 5.22                |
| colour-safe   | 23/26 | `text.subdued`/`bg.subtle` 6.86; `text.error`/`bg.primary` 5.50 (`#b34700`); `text.success`/`bg.primary` 5.19 (`#0072b2`)                 |

Data-backed gate shape: **AAA for the high-contrast tree, AA floor for the rest** — matching
DECISIONS.md's "AA floor, AAA aspiration" with zero value changes required. (If all-theme
AAA were ever wanted: exactly 4 distinct role values need raising, listed above.)

Scope note: `contrast-pairings.json`'s `triads` array is empty (Part 1 §data-sheet item 5),
so pair coverage is total coverage today. This table is the expected-output baseline for the
PR3 four-theme contrast gate (PR #412's cycle 3).
