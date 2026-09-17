# Seat-leg verdicts — calibration v0 (full record)

Recorded 2026-08-08 ~17:35Z by the design seat (Civet spins Cavern,
054f5e), BEFORE dispatching or reading either expert leg. Blindness
caveat (stated in the calibration record): the seat leg authored the
corpus and knows the intended labels — it is structurally non-blind; the
two expert legs carry the blind test. Verdicts below are judged against
rubric v0 as written, not against the intended labels.

The corpus mapping (the label key) lives in the calibration record's
corpus table; staged ids match.

## page-1 — EMC² — OVERALL: PASS

| criterion                          | verdict | note                                                                                                                             |
| ---------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale                       | PASS    | wordmark carries raw weight 800 / leading 1 as a brand-mark exception; its size is tokenised (`--font-size-6`)                   |
| 2 spatial rhythm                   | PASS    | token spacing throughout                                                                                                         |
| 3 hierarchy                        | PASS    | h1 → h2 → h3 ordered; one loud moment leads                                                                                      |
| 4 colour discipline                | PASS    | all roles via custom properties; toolbar `color-mix` composes from tokens                                                        |
| 5 composition grammar              | PASS    | utility → masthead → hero → featured → support → context → footer in kit classes                                                 |
| 6 cross-page cohesion              | PASS    | masthead/footer grammar and control faces match the sibling identity pages                                                       |
| 7 ordered-calm (systematic bounds) | PASS    | tilts are deliberate and commented as the identity's ruled angles (systematic, two values, one loud moment); no animation motion |

## page-2 — Oak — OVERALL: FAIL

| criterion             | verdict | note                                                                                                                                            |
| --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | PASS    | —                                                                                                                                               |
| 2 spatial rhythm      | FAIL    | improvised grid carries raw `18px` gap and `28px 40px` padding outside the scale                                                                |
| 3 hierarchy           | FAIL    | h1 → h4 skip in the hero; a second Hero in the content region competes as a second primary focus                                                |
| 4 colour discipline   | PASS    | —                                                                                                                                               |
| 5 composition grammar | FAIL    | TrustBand and Newsletter free-float outside any region; a hand-rolled grid replaces kit layout; the cta region is gone while its content floats |
| 6 cross-page cohesion | ITERATE | same-identity siblings keep the canonical region order; this page's grammar would surprise a reader arriving from them                          |
| 7 ordered-calm        | PASS    | —                                                                                                                                               |

## page-3 — PDS identity — OVERALL: PASS

| criterion                          | verdict | note                                                   |
| ---------------------------------- | ------- | ------------------------------------------------------ |
| 1 type scale                       | PASS    | —                                                      |
| 2 spatial rhythm                   | PASS    | —                                                      |
| 3 hierarchy                        | PASS    | —                                                      |
| 4 colour discipline                | PASS    | roles throughout, incl. inverted masthead/footer pairs |
| 5 composition grammar              | PASS    | —                                                      |
| 6 cross-page cohesion              | PASS    | —                                                      |
| 7 ordered-calm (systematic bounds) | PASS    | zero rotation, zero motion, ordered list rhythm        |

## page-4 — Oak — OVERALL: PASS

| criterion             | verdict | note                                                                                                                                                                                                                            |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | PASS    | —                                                                                                                                                                                                                               |
| 2 spatial rhythm      | PASS    | —                                                                                                                                                                                                                               |
| 3 hierarchy           | PASS    | —                                                                                                                                                                                                                               |
| 4 colour discipline   | PASS    | —                                                                                                                                                                                                                               |
| 5 composition grammar | PASS    | the front-page region instance verbatim                                                                                                                                                                                         |
| 6 cross-page cohesion | PASS    | —                                                                                                                                                                                                                               |
| 7 ordered-calm        | PASS    | motion-scope bound stated in the calibration record: hover transitions via `var(--motion-quick)` (`shared.js:88`, `sections.js:355`) read as quiet affordance transitions within the kit's floor, not entrance/animation motion |

## page-5 — PDS identity — OVERALL: FAIL

| criterion                          | verdict | note                                                                                                                                  |
| ---------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale                       | PASS    | —                                                                                                                                     |
| 2 spatial rhythm                   | FAIL    | raw px offsets (`top: 18px` etc.) and a raw `110px` list offset outside the scale                                                     |
| 3 hierarchy                        | FAIL    | scattered tags overlap the list; visual order no longer matches reading order                                                         |
| 4 colour discipline                | PASS    | —                                                                                                                                     |
| 5 composition grammar              | ITERATE | scatter improvises over the kit cluster pattern used by the sibling page                                                              |
| 6 cross-page cohesion              | ITERATE | diverges from its own identity sibling (page-3) in one section without a recorded reason                                              |
| 7 ordered-calm (systematic bounds) | FAIL    | overlap/collage with unsystematic mixed arbitrary angles (-11°, 6.5°, -3.2°, 14°, -8.7°) — fails the systematic bound on any identity |

## page-6 — Oak (showcase) — OVERALL: ITERATE

| criterion             | verdict | note                                                                                                                                            |
| --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | PASS    | specimens use the type classes                                                                                                                  |
| 2 spatial rhythm      | PASS    | oak-stack/oak-container rhythm                                                                                                                  |
| 3 hierarchy           | ITERATE | no single primary focus — the page reads as an undifferentiated specimen sequence; prominence does not track importance                         |
| 4 colour discipline   | PASS    | tokens only (the page is near-monochrome, but v0's wording judges discipline, not expressive range)                                             |
| 5 composition grammar | ITERATE | named regions exist, but featured/context/cta are absent and content improvises a specimen stack where the export demonstrates composed content |
| 6 cross-page cohesion | ITERATE | identity/theme controls diverge from the export set's demonstrated control faces                                                                |
| 7 ordered-calm        | PASS    | calm, no rotation, no motion                                                                                                                    |

Seat-leg calibration note (recorded at sealing): under rubric v0 AS
WRITTEN this page draws no hard FAIL on any criterion — yet it is the
page the owner rejected outright. If the expert legs read it the same
way, v0 has a measured MISS class; the cure belongs to a rubric revision,
not to bending a criterion's text at judgement time.

## page-7 — Oak — OVERALL: FAIL

| criterion             | verdict | note                                                                                                     |
| --------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| 1 type scale          | FAIL    | raw 27px/19px/23px sizes; two same-role h2s carry different styles (one raw-styled, one `oak-heading-4`) |
| 2 spatial rhythm      | PASS    | —                                                                                                        |
| 3 hierarchy           | PASS    | note: a paragraph styled as a heading (`promo-headline`) blurs the role but structure stays ordered      |
| 4 colour discipline   | FAIL    | raw hex `#1f9e4b` / `#e05c00`; `--text-primary` used as a decorative fill (role against meaning)         |
| 5 composition grammar | PASS    | regions intact                                                                                           |
| 6 cross-page cohesion | PASS    | note: the raw-styled promo diverges from the system's type voice                                         |
| 7 ordered-calm        | PASS    | —                                                                                                        |

## page-8 — Oak — OVERALL: FAIL

| criterion             | verdict | note                                                                                                             |
| --------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| 1 type scale          | PASS    | —                                                                                                                |
| 2 spatial rhythm      | FAIL    | collage children at raw px offsets outside the scale                                                             |
| 3 hierarchy           | FAIL    | scattered visual order breaks the reading-order match                                                            |
| 4 colour discipline   | PASS    | —                                                                                                                |
| 5 composition grammar | FAIL    | a positioned collage improvises where the kit's SubjectGrid pattern exists                                       |
| 6 cross-page cohesion | ITERATE | same-identity siblings present this content as an ordered grid                                                   |
| 7 ordered-calm        | FAIL    | overlapping collaged cards at arbitrary per-element angles (-7°, 4.5°, -2.8°, 9°, -5.2°) on an Oak-identity page |
