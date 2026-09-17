# Accessibility-expert leg — calibration v0 (full report, blind, opus)

Harvested verbatim from the leg's report, 2026-08-08. Two edits only:
identity naming and pre-rename slugs are sanitised to the target-state
naming per the identity-naming ratchet (the leg, reading the live tree,
naturally used the pre-rename forms); staged-corpus scratch paths are
abbreviated to `page-N/`. The leg judged blind: it received the rubric,
the corpus, and the per-identity bounds — never the intended labels.

---

I have judged all eight pages. Here is my report as the accessibility leg.

## Judging lines I held (stated so the calibration record can read them)

**Identity.** Three identities appear, matching the switchboard's own
closed set (`oak`, the pre-rename PDS slug, `creature`): page-1 is EMC²;
pages 3 and 5 are the PDS identity under its pre-rename name; pages 2, 4,
6, 7, 8 are Oak. Non-Oak pages were judged under criteria 1–6 plus
criterion 7's systematic bounds only.

**Motion.** `.oak-btn` and `.oak-interactive` ship transitions through
`--motion-quick`, which collapse at token level under
`prefers-reduced-motion`. Reading criterion 7's motion clause to fail
every page that uses a kit button would make the clause inert, so I
treated kit-token-carried quiet motion as the kit's own contract and
reserved the clause for page-authored motion. No page in this corpus is
discriminated by motion; the criterion-7 verdicts below all rest on
overlap/collage and rotation.

**Raw pixels (criterion 2).** I failed where raw off-scale pixels
_govern layout_ (positions, column geometry, section rhythm) and iterated
where they are incidental fixed-art dimensions.

**Overall verdict rule.** Any criterion FAIL → page FAIL (rubric's fail
semantics). Any ITERATE with no FAIL → page ITERATE. All PASS → PASS.

**The shared-code finding.** Pages 2, 4, 7, 8 share byte-identical
`shared.js` and `sections.js` (verified by checksum), so all four inherit
the same hero. `Hero()` at `page-2/sections.js:92-201` builds three
absolutely-positioned cards in a fixed `height: 360` box, over a helper
whose own comment reads `// Oak marketing collage` (line 5). At the pinned
`width=1280` viewport the cards clear each other by a handful of pixels;
at the SC 1.4.10 reflow condition (400% zoom / 320px equivalent) the 1fr
column collapses to ~130px while the cards stay at `width: 280` and
`width: 244`, so they pile onto each other and onto the h1 column. That is
a collage arrangement on an Oak-identity page, and it fails criterion 7 on
all four.

## Cross-cutting observations (not scored, shared by pages 2/4/7/8)

- Every button on these pages is the inline-styled `Button` in
  `shared.js:63`, not `.oak-btn`, so the kit's double focus ring never
  applies — they fall back to the UA ring. The kit's own CLAUDE.md calls
  that ring non-negotiable.
- `<meta name="viewport" content="width=1280">` (line 6 of all four) pins
  the layout viewport and, with `repeat(4,1fr)` and `1fr 1fr` grids that
  carry no media queries, leaves the composition unreflowable (SC 1.4.10).
- `SubjectChip` (`shared.js:53-58`) gives the decorative icon
  `alt={s.name}`, duplicating the adjacent subject label for
  screen-reader users.
- The newsletter input (`sections.js:809`) is labelled only by
  `aria-label` + placeholder — no visible label (SC 3.3.2 met, best
  practice missed).

## page-1 — EMC² (Educate My Creature Too) — OVERALL: FAIL

| criterion             | verdict | note                                                                                                                                                                                                                                                                                                                                                        |
| --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | ITERATE | `.wordmark` sets raw `font-weight: 800` and `line-height: 1` outside the weight/leading tokens and `.toolbar select` recomposes a font shorthand from primitives instead of consuming a type slot (`page-1/index.html:20-26`, `:44`).                                                                                                                       |
| 2 spatial rhythm      | ITERATE | Fixed-art geometry uses raw pixels where tokens exist — `top: -44px`, `88px` art, `minmax(240px, 1fr)`, `min-height: 44px` (`page-1/index.html:66-77`, `:38`) — though the section-to-section rhythm itself is token-driven and coherent.                                                                                                                   |
| 3 hierarchy           | PASS    | —                                                                                                                                                                                                                                                                                                                                                           |
| 4 colour discipline   | PASS    | —                                                                                                                                                                                                                                                                                                                                                           |
| 5 composition grammar | ITERATE | `.shelf-grid` re-authors `repeat(auto-fill, minmax(240px, 1fr))` where `.oak-grid` is exactly that kit pattern (`page-1/index.html:74-78`).                                                                                                                                                                                                                 |
| 6 cross-page cohesion | PASS    | —                                                                                                                                                                                                                                                                                                                                                           |
| 7 ordered-calm        | FAIL    | Two hand-picked angles are authored per element in the page's own style block — `rotate(-1.5deg)` on the card carrying running prose and the primary CTA, `rotate(8deg)` on the creature (`page-1/index.html:63`, `:71`) — with no angle token anywhere in `brand-full.css`, so the rotation is per-element noise, which the rubric bars on every identity. |

## page-2 — Oak — OVERALL: FAIL

| criterion             | verdict | note                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | ITERATE | `var(--weight-semibold) var(--font-size-4)/var(--leading-24) var(--font-display)` (`page-2/sections.js:176`, `:656`) is a composite matching no slot in the ramp, and `<h4 className="oak-heading-6">` is used as a bare section label (`page-2/index.html:55`).                                                                                                                                                                                                                  |
| 2 spatial rhythm      | FAIL    | `gap: '18px'` and `padding: '28px 40px'` (`page-2/index.html:66-67`) are off the 4px scale entirely, on top of the shared hero's raw positional geometry (`top: 170`, `left: 10`, `width: 244`, `height: 196`).                                                                                                                                                                                                                                                                   |
| 3 hierarchy           | FAIL    | `<Hero />` renders twice (`page-2/index.html:54`, `:74`), producing two identical h1s — competing primary emphases — and the `<h4>` at `:55` follows the h1 directly, skipping h2 and h3.                                                                                                                                                                                                                                                                                         |
| 4 colour discipline   | ITERATE | `--text-success` colours the four trust-band statistics and `--bg-success` fills the step-1 marker (`page-2/sections.js:244`, `:570`) — meaning roles carrying non-semantic emphasis, which re-hue to Okabe–Ito blue under `colour-safe` for no reason.                                                                                                                                                                                                                           |
| 5 composition grammar | FAIL    | `TrustBand` and `Newsletter` are `.oak-canvas` children with no `data-region`, and the two-up feature div is an `.oak-main` child with none (`page-2/index.html:62`, `:81-82`); under the shipped canvas and `[data-page='home']` area maps they auto-place away from their DOM slots — the trust band into the empty `utility` row above the masthead, the feature pair into the empty `cta` row below the quote band, and the newsletter into an implicit row below the footer. |
| 6 cross-page cohesion | FAIL    | Its same-identity sibling page-4 renders the same feature bands full-bleed with the trust band inside the hero region; page-2 halves the bands in a raw two-up grid and duplicates the hero — same-role elements diverging across pages.                                                                                                                                                                                                                                          |
| 7 ordered-calm        | FAIL    | The shared hero collage (`page-2/sections.js:92-201`), rendered twice, is an overlap arrangement on an Oak page — the cards clear by a few pixels only at the pinned 1280 width and collide at the SC 1.4.10 reflow condition.                                                                                                                                                                                                                                                    |

## page-3 — PDS identity — OVERALL: ITERATE

| criterion             | verdict | note                                                                                                                                                                                                                              |
| --------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | ITERATE | `.wordmark small` sets raw `font-weight: 400` and `letter-spacing: 0.04em` where `--weight-regular` and `--tracking-caps` exist, and `.toolbar select` recomposes a shorthand from primitives (`page-3/index.html:30-34`, `:51`). |
| 2 spatial rhythm      | ITERATE | Raw `10px` rules twice and `min-width: 96px` three times, plus a `52px` logo, all off the space/border scales (`page-3/index.html:87`, `:123`, `:176`, `:91`).                                                                    |
| 3 hierarchy           | PASS    | —                                                                                                                                                                                                                                 |
| 4 colour discipline   | PASS    | —                                                                                                                                                                                                                                 |
| 5 composition grammar | PASS    | —                                                                                                                                                                                                                                 |
| 6 cross-page cohesion | PASS    | —                                                                                                                                                                                                                                 |
| 7 ordered-calm        | PASS    | —                                                                                                                                                                                                                                 |

## page-4 — Oak — OVERALL: FAIL

| criterion             | verdict | note                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | ITERATE | The same off-ramp composite `var(--weight-semibold) var(--font-size-4)/var(--leading-24) var(--font-display)` at `page-4/sections.js:176` and `:656`; otherwise the ramp holds and every section h2 is uniform at `type-heading-3`.                                                                                                       |
| 2 spatial rhythm      | FAIL    | The shared hero positions its cards with off-scale raw pixels — `height: 360`, `top: 170`, `left: 10`, `width: 244`, `height: 196`/`150` (`page-4/sections.js:92-195`) — and the chrome adds `height: 76` (Nav), `maxWidth: 320` (footer), `maxWidth: 820` (quote).                                                                       |
| 3 hierarchy           | PASS    | —                                                                                                                                                                                                                                                                                                                                         |
| 4 colour discipline   | ITERATE | `--text-success` on the trust-band statistics and `--bg-success` on the step-1 marker (`page-4/sections.js:244`, `:570`) are meaning roles carrying non-semantic emphasis.                                                                                                                                                                |
| 5 composition grammar | ITERATE | Region placement is exactly the shipped `[data-page='home']` map with nothing free-floating, but every section re-authors `maxWidth: var(--container-max); margin: 0 auto` and `repeat(4,1fr)` inline where `.oak-container` and `.oak-grid` exist, and the pinned `width=1280` viewport leaves those grids unable to reflow (SC 1.4.10). |
| 6 cross-page cohesion | PASS    | —                                                                                                                                                                                                                                                                                                                                         |
| 7 ordered-calm        | FAIL    | The shared hero's three absolutely-positioned cards (`page-4/sections.js:92-201`, the author's own "Oak marketing collage") are a collage on an Oak page: separated by a few pixels only at 1280, piled onto each other and onto the h1 column at the SC 1.4.10 reflow condition.                                                         |

## page-5 — PDS identity — OVERALL: FAIL

| criterion             | verdict | note                                                                                                                                                                                                                                                                                           |
| --------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | ITERATE | As page-3: `.wordmark small` raw weight and tracking, and the `.toolbar select` shorthand recomposed from primitives (`page-5/index.html:30-34`, `:51`).                                                                                                                                       |
| 2 spatial rhythm      | FAIL    | The scatter is positioned entirely by off-scale raw pixels (`top: 18/44/10/70/52`, `left: 30/120/210/55/260`, `page-5/index.html:156-177`) and the list below it is held clear only by a magic `margin: 110px 0 0` (`:183`) that breaks as soon as the tags wrap or type scales up.            |
| 3 hierarchy           | FAIL    | DOM order (Mathematics, Sciences, Languages, Humanities, Technical) does not match visual order — Languages sits highest at `top: 10px`, Humanities lowest at `top: 70px` (`page-5/index.html:154-179`) — so reading order and visual order diverge for sighted and screen-reader users alike. |
| 4 colour discipline   | PASS    | —                                                                                                                                                                                                                                                                                              |
| 5 composition grammar | FAIL    | `.subject-scatter` improvises an absolute-positioning container where `.oak-cluster` is the kit pattern — its own sibling page-3 uses exactly that for the identical content — and the `<ol>` is nested inside that positioning context (`page-5/index.html:53-59`, `:153`, `:180`).           |
| 6 cross-page cohesion | FAIL    | The same subject-tag row renders as a flow cluster on same-identity sibling page-3 (`page-3/index.html:146-158`) and as a rotated absolute scatter here: same-role elements diverging across pages.                                                                                            |
| 7 ordered-calm        | FAIL    | Five hand-picked angles — `rotate(-11deg)`, `6.5deg`, `-3.2deg`, `14deg`, `-8.7deg` (`page-5/index.html:156-177`) — with no angle token anywhere in the brand contract: per-element rotation noise, which the rubric bars on every identity.                                                   |

## page-6 — Oak — OVERALL: PASS

| criterion             | verdict | note |
| --------------------- | ------- | ---- |
| 1 type scale          | PASS    | —    |
| 2 spatial rhythm      | PASS    | —    |
| 3 hierarchy           | PASS    | —    |
| 4 colour discipline   | PASS    | —    |
| 5 composition grammar | PASS    | —    |
| 6 cross-page cohesion | PASS    | —    |
| 7 ordered-calm        | PASS    | —    |

This page is the corpus's access benchmark: zero authored raw values
anywhere (`page-6/globals.css` carries only roles and scales),
`overflow-wrap: anywhere` on the h1 with a stated SC 1.4.10 reason, the
footer re-pointing `--text-link*` roles rather than overriding descendant
colour so hover and visited stay legible,
`--focus-ring: var(--focus-ring-inverted)` set on the controls rather
than the band, a deliberately non-inverted utility band so the canonical
ring stays audit-clean in every identity × theme cell, and a switchboard
whose pre-hydration placeholders carry full option geometry so hydration
swaps state and never layout.

## page-7 — Oak — OVERALL: FAIL

| criterion             | verdict | note                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | FAIL    | Raw sizing outside the scale — `font-size: 27px` and `19px` (`page-7/index.html:26`, `:33`) and inline `fontSize: '23px'` (`:75`) — and three different styles carried by the one section-heading role on the page (23px raw, `oak-heading-4`, and the feature bands' `type-heading-3`).                                                                      |
| 2 spatial rhythm      | FAIL    | Both promo paragraphs set `margin: 0` with no spacing token between them or the section below (`page-7/index.html:69-70`) and the bare `height: '8px'` rule div sits flush against its neighbours (`:74`), against sibling sections carrying `--space-72` padding.                                                                                            |
| 3 hierarchy           | FAIL    | The promo headline is a visually-emphasised `<p>` doing a heading's job with no semantics for assistive technology (`page-7/index.html:69`, SC 1.3.1), and the injected 23px `<h2>` at `:75` sits above `AilaFeature`'s own `<h2>` at `type-heading-3` (40px) on the same topic — two competing h2s with prominence inverted against meaning.                 |
| 4 colour discipline   | FAIL    | Raw literals `#1f9e4b` and `#e05c00` (`page-7/index.html:26`, `:32`); `#e05c00` at 19px inheriting weight 300 measures 3.68:1 on `--bg-primary`, below the 4.5:1 floor in the judged light cell (SC 1.4.3, verified by calculation); and `background: 'var(--text-primary)'` at `:74` uses a text role as a decorative fill — the rubric's own named example. |
| 5 composition grammar | ITERATE | Components stay inside their regions, but the promo paragraphs and the naked rule div are improvised where the kit carries banner and label patterns, and the shared grids remain unreflowable at the pinned `width=1280` viewport.                                                                                                                           |
| 6 cross-page cohesion | FAIL    | Against same-identity sibling page-4 it introduces an off-system promo voice in raw green and orange and a second heading register above the feature bands — a reader arriving from page-4 meets a different grammar.                                                                                                                                         |
| 7 ordered-calm        | FAIL    | The shared hero collage as on page-4 (`page-7/sections.js:92-201`), with the raw-coloured promo block adding a second visual register competing for the reader's first fixation.                                                                                                                                                                              |

## page-8 — Oak — OVERALL: FAIL

| criterion             | verdict | note                                                                                                                                                                                                                                                                                                                        |
| --------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | ITERATE | `<h2 className="oak-heading-4">Explore our subjects</h2>` (`page-8/index.html:91`) sits alongside the feature bands' `type-heading-3` h2s, so the one section-heading role carries two styles.                                                                                                                              |
| 2 spatial rhythm      | FAIL    | The collage is raw off-scale pixel geometry throughout — `min-height: 460px`, `width: 300px`, `top: 12/64/30/150/190`, `left: 48/250/470/130/390` (`page-8/index.html:24-56`).                                                                                                                                              |
| 3 hierarchy           | FAIL    | DOM order (Maths, English, Science, History, Geography) does not match visual order — Science is third in the DOM but second-highest on screen, History overlaps beneath both — and later-painted cards sit over earlier ones, so a keyboard-focused card can be obscured by its sibling (SC 2.4.11).                       |
| 4 colour discipline   | PASS    | —                                                                                                                                                                                                                                                                                                                           |
| 5 composition grammar | FAIL    | `.subject-collage` improvises an absolute-positioning container where `.oak-grid` is the kit pattern, and all five cards leave normal flow inside a fixed `min-height: 460px` box that cannot contain them at any zoom level (`page-8/index.html:24-31`).                                                                   |
| 6 cross-page cohesion | FAIL    | The subject browse that same-identity sibling page-4 renders through the kit's `SubjectGrid` is here a hand-scattered card pile — same-role elements diverging across pages.                                                                                                                                                |
| 7 ordered-calm        | FAIL    | Five hand-picked rotations — `rotate(-7deg)`, `4.5deg`, `-2.8deg`, `9deg`, `-5.2deg` (`page-8/index.html:32-56`) — over deliberately overlapping cards carrying real prose: both fail clauses at once, overlap/collage on an Oak page and unsystematic per-element rotation, against the owner's verbatim readability rule. |

> **Erratum (record-keeper annotation, 2026-08-08 review round 1; the
> harvested text above is conserved unedited).** The criterion-3 row's
> SC 2.4.11 focus-obscuration clause is inapplicable: the collage cards
> contain only headings and paragraphs — nothing focusable — so keyboard
> focus cannot be obscured here. The row's valid substance (DOM order vs
> visual order divergence, and opaque later-painted cards occluding
> earlier cards' TEXT) stands unchanged, as does the criterion-3 FAIL it
> grounds.

---

**One note for the Director on the instrument itself, not on any page:**
criterion 7's motion clause and criterion 2's raw-pixel clause both need a
stated boundary before the next revision — the first because the kit's own
`.oak-btn` carries a `--motion-quick` transition (a literal reading fails
every page that uses a kit button), the second because "raw pixel spacing
outside the scale" does not distinguish layout-governing values from
fixed-art dimensions. I applied explicit lines for both, stated at the
top, so my verdicts are reproducible; a different leg applying a literal
reading would land elsewhere on pages 1, 3 and 4.
