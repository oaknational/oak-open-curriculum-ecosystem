# Feature Request: Populate the Declared Bulk-Download Fields

**Date**: 2026-06-03
**From**: Oak Open Curriculum ecosystem — semantic search ingestion
**To**: Open Curriculum API team
**Follows up**: the earlier bulk-data request
([`bulk_data_for_semantic_search.feature_request.md`](./bulk_data_for_semantic_search.feature_request.md)),
whose Phase 1–2 fields are now **declared in the bulk schema but not populated in the data**.

## Summary

The bulk-download schema (`schema.json` served with every bulk ZIP) already declares the
per-unit fields we asked for: `tier`, `examSubjects`, `examBoard`, `pathway`, `pathwaySlug`,
`categories`, `unitOptionGroup`, and `canonicalUrl` are all present as optional unit properties.
**None of them is populated in the data.** We ask that the bulk export be extended to populate
these declared fields, so search indexes can be built purely from bulk downloads with no live
API calls during ingestion.

## Evidence (verified 2026-06-03)

Census across the full bulk corpus (30 subject files, 1,664 units — 490 of them KS4 — and
12,864 lessons; a fresh authenticated download on 2026-06-03 was byte-identical on `schema.json`
and showed the same population for sampled subjects):

| Declared per-unit field | Units populated | Notes                                            |
| ----------------------- | --------------- | ------------------------------------------------ |
| `tier`                  | 0 / 1,664       | Needed for maths KS4 (Foundation/Higher)         |
| `examSubjects`          | 0 / 1,664       | Needed for science KS4 (physics/chemistry/…)     |
| `examBoard`             | 0 / 1,664       | AQA/Edexcel/OCR per unit where applicable        |
| `pathway` / `pathwaySlug` | 0 / 1,664     | GCSE/Core where applicable                       |
| `categories`            | 0 / 1,664       | Unit topics for faceted search                   |
| `unitOptionGroup`       | 0 / 1,664       | Alternative-unit grouping (dedup)                |
| `canonicalUrl`          | 0 / 1,664       | Direct links from unit-level search results      |

By contrast `whyThisWhyNow` (1,622 / 1,664) shows the export pipeline populates optional unit
fields where the source data is wired through — the gap is wiring, not schema design.

Top-level `ks4Options` is populated inconsistently: 12 of 30 files carry it. Notably
`maths-secondary.json` does **not**, despite maths KS4 being the tiered subject — so even
sequence-level KS4 variance is not currently derivable from bulk for maths.

## Why this matters

Our search ingestion currently makes live API calls during indexing solely to recover what
these fields would carry: per-unit tier and exam-subject assignments (via
`/sequences/{sequence}/units`) and unit categories. We have just completed a realignment to the
v0.7.0+ API restructure that reduced this dependency to that single endpoint. Populating the
declared bulk fields removes the last live-API dependency from ingestion entirely:

- **Offline, reproducible index builds** — no API coupling, no rate-limit pressure, no
  ingestion breakage when API paths restructure (as on 2026-06-03).
- **Faceted search by topic** — `categories` populates our `unit_topics` facet (the extraction
  code already exists and is dormant).
- **Correct KS4 search filtering** — `tiers` / `exam_subjects` index fields come from bulk
  instead of API supplementation.
- **Deduplication of alternative units** — `unitOptionGroup` removes phantom duplicates in
  English/Geography/History results.
- **Direct unit links** — `canonicalUrl` on units, matching what lessons already carry.

## Requested change

1. **Populate the already-declared per-unit fields** in the bulk export for every unit where
   the source data carries a value: `tier`, `examBoard`, `pathway`/`pathwaySlug`,
   `examSubjects`, `categories`, `unitOptionGroup`, `canonicalUrl`. No schema change is
   required — the declarations are already correct.
2. **Make top-level `ks4Options` consistent** across files (present wherever the subject has
   KS4 variance, including maths), or document why a subject legitimately omits it.
3. **Consider aligning per-unit KS4 field naming with the API's `ks4ProgrammeFactors`
   vocabulary** (`examBoard` / `pathway` / `tier` / `childSubject`). The bulk schema currently
   says `examSubjects` where `/subjects/{subject}` now says `childSubject`; one name per
   concept across both surfaces would remove a mapping step for every consumer.

## Acceptance criteria

- A fresh bulk download shows non-zero population for each requested field, with KS4 units in
  maths carrying `tier` and KS4 units in science carrying `examSubjects` (or `childSubject`)
  and `examBoard`, at parity with what `/sequences/{sequence}/units` returns today.
- `categories` and `canonicalUrl` populated for units at parity with the API/site.
- We will verify by re-running our field-population census against a fresh download and by
  rebuilding the search indexes bulk-only and diffing the resulting index documents against
  the current API-supplemented build.

## Data-quality notes (small, same-pass candidates)

- **`"NULL"` string sentinels**: `supervisionLevel` and `contentGuidance` use the string
  `"NULL"` instead of JSON `null` (e.g. 563 lessons in `science-secondary.json` alone).
- **Field-name casing**: `downloadsavailable` (lowercase) vs the API's camelCase convention.
- **Resolved — thank you**: the science `examBoards` 4× duplication reported in the earlier
  request now samples clean (3 unique entries).
