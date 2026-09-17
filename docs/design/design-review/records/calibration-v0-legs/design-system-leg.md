# Design-system-expert leg — calibration v0 (full report, blind, opus)

Harvested verbatim from the leg's report, 2026-08-08. Two edits only:
identity naming and pre-rename directory paths are sanitised to the
target-state naming per the identity-naming ratchet (the leg, reading the
live tree, naturally used the pre-rename forms); staged-corpus scratch
paths are abbreviated to `page-N/`. The leg judged blind: it received the
rubric, the corpus, and the per-identity bounds — never the intended
labels.

---

I have judged all eight pages. Two pieces of ground truth shaped the
calibration, and both are worth stating before the tables.

**The corpus contains its own reference.** Three pages are byte-identical
to the export the rubric derives from: `page-4/index.html` ≡
`studio-source/ui_kits/oak/index.html`, `page-1/index.html` ≡
`studio-source/whitelabel/creature/index.html`, `page-3/index.html` ≡ the
PDS identity's front page under `studio-source/whitelabel/`. The
`shared.js`/`sections.js` under pages 2, 4, 7 and 8 are byte-identical to
each other _and_ to the studio-source Oak kit, so across that family the
component library is a constant and composition is the only variable.

**Consequence for criterion 7.** The shared `Hero` carries an
absolutely-positioned decorative card cluster that its own source calls an
"Oak marketing collage" (`sections.js:5`). Because the rubric's Oak anchor
_is_ this file's demonstrated language, I treated that cluster as baseline
rather than as the thing criterion 7 forbids — otherwise the rubric fails
its own anchor. I reserved criterion 7 for overlap/rotation added on top
of it. I flag this as the single sharpest v0 ambiguity: the instrument
should state explicitly whether the canonical hero cluster is inside or
outside the ordered-calm rule, because that one ruling moves four
verdicts.

**Identities.** Page-1 is EMC² (`whitelabel/creature`); pages 3 and 5 are
the PDS identity (its directory bears the pre-rename name); pages 2, 4, 6,
7, 8 are Oak.

## Token-contract findings that cut across pages

Raw hex at page level appears on exactly one page — `page-7/index.html:25,31`.
The hex inside each `brand-full.css` is the brand's palette-definition
layer, which is where literals legitimately live; I did not score it
against the pages.

Three white-label pages carry the same silent-lookalike defect:
`z-index: var(--layer-3, 30)` (`page-1/index.html:30`,
`page-3/index.html:39`, `page-5/index.html:39`). `--layer-3` does not
exist anywhere in the estate — I grepped `colors_and_type.css` and
`components.css`. Every one of those sticky toolbars is running on the raw
`30` fallback while `--layer-sticky: 40` sits unused. It resolves, it
renders, and it is entirely outside the contract. This is an export-wide
cure, not a page defect, and it will not surface until a layer is
re-pointed.

No tilt token exists anywhere in the system. The only `rotate()` in
`components.css` is 45deg glyph mechanics (chevrons, checkmarks). So
_every_ decorative rotation in this corpus is a raw per-element literal by
necessity — the "tokenised angles" half of criterion 7 is currently
unsatisfiable. If identities are to carry angles, the estate needs a tilt
scale before the criterion can be met rather than merely failed.

The shared Oak kit carries a handful of raw dimensions (`shared.js:215`
`height: 76`, `:322` `maxWidth: 320`; `sections.js:40,73` measure caps). I
did not fail criterion 2 on these: they are measure and height caps rather
than spacing steps, the section cadence around them is fully token-driven,
and they are identical across all four pages so they discriminate nothing.
They are still a real gap worth a kit-level fix.

`page-6/globals.css` is the cleanest consumption surface in the corpus —
every value is a token role, a scale step or a CSS keyword, and the footer
re-points `--text-link`/`--text-link-hover`/`--text-link-visited`
(`:84-86`) rather than colouring descendants, which is the role-correct
way to handle links on an inverted band and is the pattern I would hold up
as the reference.

## page-1 — EMC² (Educate My Creature Too) — OVERALL: ITERATE

| criterion             | verdict | note                                                                                                                                                                                                                                                                                        |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | ITERATE | `.wordmark` hardcodes `font-family: 'Baloo 2'` and `font-weight: 800` (`index.html:21-22`) where the brand tokenises exactly those as `--font-display`/`--weight-display` (`brand-full.css:10-11`), a miss page-3's wordmark demonstrably avoids.                                           |
| 2 spatial rhythm      | ITERATE | Raw literals where tokens exist or off-scale entirely: `top: -44px` and `88px` square (`index.html:67-70`), `minmax(240px, 1fr)` re-implementing `.oak-grid`'s `var(--space-240)` (`:77`), `min-height: 44px` vs `--size-target-min` (`:38`), `outline-offset: 2px` vs `--space-2` (`:81`). |
| 3 hierarchy           | PASS    | —                                                                                                                                                                                                                                                                                           |
| 4 colour discipline   | PASS    | —                                                                                                                                                                                                                                                                                           |
| 5 composition grammar | ITERATE | `.shelf-grid` (`index.html:74-78`) re-implements `.oak-grid` with a raw literal and `.pick-layout` is a bespoke grid where `--flow-columns`/`.oak-flow` is the kit's brand-surface lever for exactly this.                                                                                  |
| 6 cross-page cohesion | PASS    | Sole EMC² page in the corpus; at the shared proof-shell level (region set, control faces, footer grammar) it matches pages 3 and 5 exactly.                                                                                                                                                 |
| 7 ordered-calm        | ITERATE | The two tilts (`rotate(-1.5deg)` on `.pick-card`, `rotate(8deg)` on `.pick-creature`, `index.html:63,71`) are role-anchored, single-instance and carry a recorded owner ruling in-source, but they are raw literals because no tilt token exists in the estate.                             |

## page-2 — Oak — OVERALL: FAIL

| criterion             | verdict | note                                                                                                                                                                                                                                                                                                               |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 type scale          | ITERATE | The stray `<h4 className="oak-heading-6">` (`index.html:55`) gives a section-level heading a subsection style while every other section heading resolves to `--type-heading-3`, and the duplicated `<Hero />` puts two `--type-heading-1` h1s on one page.                                                         |
| 2 spatial rhythm      | FAIL    | The feature wrapper uses `gap: '18px'` and `padding: '28px 40px'` (`index.html:66-67`); 18 and 28 are on no `--space-*` step and the wrapper breaks the 72/64px section cadence its siblings hold.                                                                                                                 |
| 3 hierarchy           | FAIL    | `<Hero />` renders twice (`index.html:54,74`) giving two competing h1 primaries, and the `<h4>` at `:55` skips h2 and h3 straight from the hero's h1.                                                                                                                                                              |
| 4 colour discipline   | PASS    | —                                                                                                                                                                                                                                                                                                                  |
| 5 composition grammar | FAIL    | The feature wrapper (`index.html:62-72`) is a bare inline-styled `div` inside `.oak-main` with no `data-region`, and `<TrustBand />`/`<Newsletter />` (`:81-82`) are direct `.oak-canvas` children with no region, so three blocks auto-place outside the grid's named areas while the `cta` region is left empty. |
| 6 cross-page cohesion | FAIL    | The duplicated hero and the two-up feature pairing are grammar a reader arriving from page-4 would not recognise, since pages 4/7/8 all run the feature rows full-width and stacked.                                                                                                                               |
| 7 ordered-calm        | PASS    | —                                                                                                                                                                                                                                                                                                                  |

## page-3 — PDS identity — OVERALL: ITERATE

| criterion             | verdict | note                                                                                                                                                                                                                                                                                |
| --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | ITERATE | `.wordmark small` uses raw `font-weight: 400` and `letter-spacing: 0.04em` (`index.html:30,34`) where `--weight-regular` and `--tracking-caps` exist, and the hero eyebrow borrows `oak-heading-7` for a non-heading `<p>` (`:112`) where `--type-label` is the role-correct style. |
| 2 spatial rhythm      | ITERATE | `min-width: 96px` on the gazette-reference column (`index.html:176,199,222`) is off the `--space-*` scale entirely, and `min-height: 44px` (`:45`) and `border-*: 10px` (`:87,123`) are literals where `--size-target-min` and `--border-solid-xxxxl` exist.                        |
| 3 hierarchy           | PASS    | —                                                                                                                                                                                                                                                                                   |
| 4 colour discipline   | PASS    | —                                                                                                                                                                                                                                                                                   |
| 5 composition grammar | ITERATE | The circulars list (`index.html:159-236`) hand-rolls inline `display:flex` rows where `.oak-cluster`/`.oak-stack` are the kit classes, and the masthead re-inlines the brand's own `.mast` expression hook (`brand-full.css:138-141`) instead of wearing the class.                 |
| 6 cross-page cohesion | PASS    | This is the grammar its same-identity sibling page-5 departs from; shell, control faces and type usage are internally consistent.                                                                                                                                                   |
| 7 ordered-calm        | PASS    | —                                                                                                                                                                                                                                                                                   |

## page-4 — Oak — OVERALL: PASS

| criterion             | verdict | note |
| --------------------- | ------- | ---- |
| 1 type scale          | PASS    | —    |
| 2 spatial rhythm      | PASS    | —    |
| 3 hierarchy           | PASS    | —    |
| 4 colour discipline   | PASS    | —    |
| 5 composition grammar | PASS    | —    |
| 6 cross-page cohesion | PASS    | —    |
| 7 ordered-calm        | PASS    | —    |

## page-5 — PDS identity — OVERALL: FAIL

| criterion             | verdict | note                                                                                                                                                                                                                                                                                             |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 type scale          | ITERATE | Carries page-3's gaps unchanged — raw `font-weight: 400` and `letter-spacing: 0.04em` in `.wordmark small` (`index.html:30,34`) and `oak-heading-7` on a non-heading eyebrow (`:119`).                                                                                                           |
| 2 spatial rhythm      | FAIL    | The scatter is positioned by ten raw off-scale offsets (`index.html:156-177`) and cleared by a magic `margin: 110px 0 0` on the list (`:183`) plus `min-height: 300px` (`:55`), none of which is on the `--space-*` scale or survives a density change.                                          |
| 3 hierarchy           | FAIL    | Absolute placement decouples visual order from DOM order — DOM runs Mathematics, Sciences, Languages, Humanities, Technical while the rendering reads top-down Languages (y10), Mathematics (y18), Sciences (y44), Technical (y52), Humanities (y70) — and the rotated tags overlap one another. |
| 4 colour discipline   | PASS    | —                                                                                                                                                                                                                                                                                                |
| 5 composition grammar | FAIL    | The five subject tags are `position: absolute` free-floaters inside a bespoke `.subject-scatter` (`index.html:53-59`) where `.oak-cluster` is the kit pattern its own sibling page-3 uses for identical content.                                                                                 |
| 6 cross-page cohesion | FAIL    | The same-role subject-tag set is a flat `.oak-cluster` row on page-3 and a rotated scatter here, so identical content carries two grammars across same-identity siblings.                                                                                                                        |
| 7 ordered-calm        | FAIL    | Five distinct per-element angles (`-11deg`, `6.5deg`, `-3.2deg`, `14deg`, `-8.7deg`, `index.html:156-177`) on five peers of one role with no tilt token in the estate is unsystematic rotation, a bound that binds on every identity.                                                            |

## page-6 — Oak — OVERALL: PASS

| criterion             | verdict | note                                                                                                                                                                                                                  |
| --------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | PASS    | —                                                                                                                                                                                                                     |
| 2 spatial rhythm      | PASS    | —                                                                                                                                                                                                                     |
| 3 hierarchy           | PASS    | —                                                                                                                                                                                                                     |
| 4 colour discipline   | PASS    | —                                                                                                                                                                                                                     |
| 5 composition grammar | PASS    | —                                                                                                                                                                                                                     |
| 6 cross-page cohesion | PASS    | Leaner than pages 2/4/7/8 in content, but masthead and footer resolve through the same border, background and text roles, and its `.oak-btn` faces are the same `--btn-*` tier-3 tokens the shared `Button` consumes. |
| 7 ordered-calm        | PASS    | —                                                                                                                                                                                                                     |

## page-7 — Oak — OVERALL: FAIL

| criterion             | verdict | note                                                                                                                                                                                                                                                                                  |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | FAIL    | `font-size: 27px` (`index.html:26`), `font-size: 19px` (`:32`) and `fontSize: '23px'` (`:75`) are raw sizes outside the `--font-size-*` scale, and that 23px h2 sits beside a sibling `oak-heading-4` h2 (`:79`) so one role carries two styles.                                      |
| 2 spatial rhythm      | ITERATE | `height: '8px'` (`index.html:74`) is a literal where `--space-8` exists, and the inserted promo and heading elements carry `margin: 0` with no gap owner, so they butt directly against each other and against `SubjectGrid`'s own 72px pad.                                          |
| 3 hierarchy           | FAIL    | The inserted content-region h2s (23px, and `oak-heading-4` at 2rem) are smaller than the `--type-heading-3` 2.5rem h2s inside the `FeatureRow`s they introduce, inverting prominence against meaning, and the promo headline is a `<p>` dressed as a section heading above a real h2. |
| 4 colour discipline   | FAIL    | Raw hex `#1f9e4b` and `#e05c00` (`index.html:25,31`) bypass the role layer and are theme-blind, `#e05c00` at 19px regular measures ~3.68:1 on `--bg-primary` white against a 4.5:1 floor, and `background: 'var(--text-primary)'` (`:74`) uses a text role as a decorative fill.      |
| 5 composition grammar | ITERATE | The promo pair and the divider/heading stack are dropped as bare children of the `featured` and `content` regions rather than composed through `.oak-stack`/`.oak-container`, so they sit outside the inner-composition classes their sibling sections all carry.                     |
| 6 cross-page cohesion | FAIL    | The green/orange promo face appears on no sibling and in no token role, and the 23px h2 breaks the 2.5rem section-heading face pages 2/4/8 share.                                                                                                                                     |
| 7 ordered-calm        | PASS    | —                                                                                                                                                                                                                                                                                     |

## page-8 — Oak — OVERALL: FAIL

| criterion             | verdict | note                                                                                                                                                                                                                                                                                                 |
| --------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | ITERATE | The featured h2 uses `oak-heading-4` (2rem) where every other section heading in the shared sections resolves to `--type-heading-3` (2.5rem), and the collage cards' `h3`/`p` sit in a bare `.oak-card` without `.oak-stack`, so UA margins rather than the gap contract set their internal spacing. |
| 2 spatial rhythm      | FAIL    | The collage is positioned by raw off-scale literals — `top: 30px/150px/190px`, `left: 250px/470px/130px/390px`, `width: 300px`, `min-height: 460px` (`index.html:24-56`) — none on the `--space-*` scale and none surviving a density or container change.                                           |
| 3 hierarchy           | FAIL    | The cards genuinely overlap and `.oak-card` is opaque (`--card-bg`), so scatter-1 at x[48,348] and scatter-2 at x[250,550] occlude each other's text, and visual order (Maths y12, Science y30, English y64, History y150, Geography y190) no longer matches DOM order.                              |
| 4 colour discipline   | PASS    | —                                                                                                                                                                                                                                                                                                    |
| 5 composition grammar | FAIL    | Five `.oak-card`s are `position: absolute` free-floaters inside a bespoke `.subject-collage` (`index.html:24-31`) replacing `SubjectGrid`, whose auto-fit `.oak-grid` is precisely the kit pattern for this content.                                                                                 |
| 6 cross-page cohesion | FAIL    | Subject browsing renders as the shared `SubjectGrid` on pages 2/4/7 and as a rotated collage here, diverging the same role across same-identity siblings.                                                                                                                                            |
| 7 ordered-calm        | FAIL    | A literally overlapping collage on an Oak-identity page plus five arbitrary per-element angles (`-7deg`, `4.5deg`, `-2.8deg`, `9deg`, `-5.2deg`, `index.html:32-56`) breaches the owner's verbatim rule on both of its clauses.                                                                      |

## Two calibration notes for the instrument owner

The rubric gives no guidance on how to score a page that is _identical to
the derivation source_. Pages 1 and 3 are the export's own white-label
proofs, and I still returned ITERATE on both because raw literals sit
where tokens exist. If the instrument intends canonical exports to score
PASS by construction, that needs saying; if it intends the token contract
to bind the export too — which is my reading, and the one I applied —
then the v0 record should expect its own reference pages to carry
ITERATEs until those cures land.

Criterion 7's motion clause has the same self-reference problem as the
hero cluster. `components.css` gives `.oak-btn` a token-governed
transition, so _every_ Oak page in this corpus including the reference
carries motion. I scored motion presence as page-introduced only. Judged
literally against "motion on an identity whose stance is none", all five
Oak pages fail, which cannot be the intent.
