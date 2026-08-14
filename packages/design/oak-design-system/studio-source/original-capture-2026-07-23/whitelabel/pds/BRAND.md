# Office of Education — brand definition

Fictional. The second counter-brand — drawn on a blank canvas first, designed to be maximally far from Oak *and* from Educate My Creature, so that the three identities triangulate the contract's range.

## Identity, from a blank canvas

The Office is not a website that publishes documents; it is a **document tradition that acquired a website**. Its ancestors are the government gazette, the bound framework, the ledger of circulars — a typographic world of rules, folios and reference numbers, where authority is carried by restraint and permanence, not by interface. Its readers are teachers, school leaders and officials doing their jobs, often printing what they read, often reading in a second or third language. Nothing about it should look like an "app"; everything should look like it will still be correct in a decade.

Oak is a warm colleague; EMC is a pocket world; the Office is **the public record**.

## Desired impact

- A teacher finds the current statutory framework in under a minute and *trusts* it's current (gazette references on everything).
- Documents survive printing, photocopying and low bandwidth without losing meaning.
- The design signals stability and probity — nothing fashionable, nothing dated in ten years.

## WWGDD — what we learned from mature government design systems (v4)

The previous version was "Oak in a green suit" — half the colours sat on Oak's own axes (green primary near Oak green, gold accent in lemon's family, navy-adjacent links). v4 takes the GENRE lessons of systems like GOV.UK without copying anyone's trade dress:

- **Metadata first**: caption over heading ("Statutory guidance · ED series"), reference numbers as first-class text.
- **One narrow reading column** (`--container-max: 920px`): a document measure, not an app canvas.
- **Underline-always links**, steel-blue, visited state distinct — wayfinding over aesthetics.
- **Buttons are flat rectangles with a hard 2px bottom edge** that goes flush when pressed — a mechanical press, not a floating shadow.
- **Inset text** for the load-bearing sentence; rule-lined summary lists (the ledger) instead of cards.
- **Palette moved off Oak's axes entirely**: warm-black ink on archival paper, OXBLOOD state actions, bronze seal accent — no green, no lemon-family gold, no navy.
- Not taken: the crown, GDS Transport, GOV.UK's palette, or any protected mark — genre conventions only.

## Mechanism distance (compounding the identity distance)

- **Typographic, not boxy — component selection as a lever**: the register pages use rule-lined ledger lists and never `.oak-card`; where a container is unavoidable it's a hairline plate (`--card-border: 1px`, radius 0). Oak's bordered, shadowed card simply does not appear.
- **Sharp as cut paper**: radius 0 on everything; the masthead sits on a double rule (engraver's grammar, not app chrome).
- **Flat signature**: every decorative shadow `none`; press feedback is a 1px drop; affordance from fills, underlines and the (untouchable) focus ring.
- **Authority in the type**: Noto Serif display at 700 over Noto Sans body — Noto specifically for script coverage (Latin today; Ge'ez, Arabic, Devanagari tomorrow without a re-brand).
- **Tags are reference stamps**: hairline-bordered squares ("In force", "Under review") — status metadata, not category confetti.
- **Density for professionals**: `--control-pad-block: 8px`; targets still ≥44px via the floor.
- **State colours of state**: deep green primary actions; gold reserved for the seal, focus and selection.
- **Plain workmanlike icons** → Bootstrap Icons (MIT), via currentColor (`icons.css`); used sparingly — GDS's own register is icon-sparse, wayfinding only. (v4–v6 used Material Symbols Sharp; replaced so each identity has a genuinely distinct openly-licensed set.)

## Invariants (not brand surface)

WCAG 2.2 AA in all four themes (audit-checked), double focus ring, quiet motion honouring the motion axis, state never colour alone, sentence case.

## v5 — GDS alignment (July 2026)

PDS now takes its **colours, spacing, type scale and layout** directly from the GOV.UK Design System (design-system.service.gov.uk, OGL v3.0), used per "GOV.UK Frontend without GOV.UK branding": no crown, no GDS Transport, no GOV.UK header.

- **Colour**: text #0b0c0c, secondary #484949, borders #505a5f, brand blue #1d70b8 accent trio, link #1a65a6 (hover #0f385c, visited #54319f), action-green buttons #0f7a52 with the 2px shade-50 bottom edge. Decorative ramp = GDS web-palette groups (blue/green/purple/teal/yellow/magenta) at tint-50/80/95; dark polarity re-derived on the same hue axes (GDS ships light-only).
- **Spacing**: GDS static scale only (5·10·15·20·25·30·40·50·60) — gap-s/m/l 10/20/30, insets 15/20, card-pad 20.
- **Layout**: 1020px width container; flow = two-thirds/one-third with 30px gutters; everything ranged left.
- **Type**: GDS scale — headings 48/36/27/24/19 bold in the workhorse sans (serif display RETIRED); body 19/16/14; labels bold 16 sentence case.
- **Form**: square everything, flat signature kept, tags now GDS-style flat tinted rectangles (border and shadow none, radius 0).
- Superseded: v4 oxblood/bronze/archival-paper palette and Noto Serif display.
- Invariants unchanged: focus ring, ≥44px targets, Oak functional colours, motion behaviour.


## v6 — the printed record (July 2026): leaving Oak's basin

**v5 is superseded.** The lever-distance instrument (preview/lever-distance.html) made the failure measurable: v5 agreed with Oak on the dominant perceptual axes — light polarity, cool white page, near-black SANS ink, bold-sans headings, flat atmosphere, quiet 120ms motion, app-grid composition — and spent its distance on hue (green buttons) and micro-form (square corners), the weakest axes at page scale. GDS was the wrong genre to borrow: GOV.UK and Oak occupy the SAME region of identity phase space ("calm, plain, light, accessible public service"). Authenticity made a cousin, not a distant point.

**Placement rule (three identities, Oak fixed): maximise the minimum pairwise distance.** EMC² already holds Oak's antipode on polarity/scale/gloss. The region far from BOTH is the identity's own founding tradition, executed fully this time:

- **Warm archival paper** (#f7f3ea) with warm ink — neither Oak's cool white nor EMC²'s plum dark. Dark polarity = the evening reading room (warm blacks, never blue-grey).
- **Serif THROUGHOUT** — `--font-sans` itself re-points to Noto Serif (body, controls, everything): a document tradition that acquired a website. v4 only dressed the display slot; that was the half-measure.
- **Flat documentary type scale**: 36px ceiling, hierarchy by weight/case/rules, small-caps labels (`--label-variant: all-small-caps`), zero tracking.
- **Oxblood seal accent** (#7a1f2b) drives focus/selection/markers; letterpress buttons (oxblood plate, hard 2px bottom edge, press-flush). Steel links, violet visited.
- **Archival decorative ramp**: buff/sage/slate/rose-ash/parchment/tan — LOW chroma against Oak's candy-value pastels and EMC²'s sweet-shop.
- **Dense and motionless**: `--density: 0.8`, 44px targets (the legal dense floor), `--motion-quick/base: 0ms` — documents do not animate (the OS motion axis still governs).
- **Folio composition**: 880px container, 620px reading measure, filter panel as right-hand MARGINALIA on unit pages; proof page puts the gazette search in the margin.

Residual coincidences with Oak are irreducible by identity, not oversights: light polarity (two poles; EMC² holds dark) and flat atmosphere (no-garnish IS the print identity). Score at adoption: Oak↔PDS 23/26 · Oak↔EMC² 26/26 · PDS↔EMC² 26/26 levers differ.

Audit: 34/34 AA in all four themes, Part A and full (July 2026; re-run after the white-holes fix — a paper page must carry its WHOLE elevation family: --bg-btn-secondary/--bg-raised/--bg-overlay are paper sheets, never screen-white). Invariants unchanged. Sharp-outline icons retained (engraver-adequate); the "no icons, typographic markers" pole is noted as a further step if wanted.

## v7 — the public service (July 2026): GDS-aligned by direction

**v6 is superseded by an explicit direction**: authentic GDS visual design, further from Oak. This reverses v6's placement rule on purpose — the judgement is that GDS's own signatures ARE the distance from Oak, because Oak has none of them:

- **Black masthead with the brand-blue bar** (Oak: white chrome, lemon accents).
- **Action-green buttons** (#00703c) with the hard 2px bottom edge (#002d18) that goes flush when pressed (Oak: black pill-adjacent buttons with lemon offset shadows).
- **Blue underlined links** #1d70b8, hover #003078, visited #4c2c92 — GDS wayfinding verbatim (Oak: navy).
- **GDS ink and greys**: text #0b0c0c, secondary #505a5f, panels #f3f2f1, hairlines #b1b4b6, white page (Oak: warm cool-white + candy pastels).
- **The GDS type scale**: 48/36/27/24/19 bold, 19/16/14 body, tight leading, zero tracking, sentence case, no light weights — in **Public Sans** (open government-service grotesque; GDS Transport is restricted).
- **GDS static spacing** (10·20·30, insets 15/20/30) and the **960px two-thirds/one-third page grid**, 30px gutters, ranged left.
- **Square and flat everywhere**: radius 0, no decorative shadows, no animation; tags are flat tinted rectangles; inset text carries the 10px grey border; ledger hairlines go #b1b4b6.
- **Decorative ramp = GDS web palette** (blue/turquoise/light-purple/pink/yellow/orange) at panel tints; dark polarity re-derived on the same hues (GDS ships light-only).
- Still NOT taken: the crown, GDS Transport, the GOV.UK header trade dress, "GOV.UK" anything.
- Invariants unchanged: focus ring composition (now blue-accent inner), ≥44px targets, Oak functional state colours, state never colour alone, sentence case.

Dark theme note: GDS defines no dark mode; the dark ramp keeps GDS hues (light-blue #5694ca links, brightened green plate #00b374 with ink text) at AA. Lever-distance vs Oak drops on polarity/atmosphere axes relative to v6 — accepted consequence of the direction; the identity distance now lives in the genre signatures above.