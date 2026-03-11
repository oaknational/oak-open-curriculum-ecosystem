---
type: feature-request
status: draft
audience: Oak Curriculum API team
domain: semantic-search
relates-to:
  - https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/main/apps/oak-search-cli/src/adapters/api-supplementation.ts
  - https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/main/apps/oak-search-cli/src/adapters/category-supplementation.ts
  - https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/main/apps/oak-search-cli/src/adapters/hybrid-data-source.ts
  - https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/main/apps/oak-search-cli/bulk-downloads/schema.json
verified: 2026-03-10
phases:
  - id: 1
    title: Eliminate API calls during ingestion
    priority: blocking
    summary: Add tier and examSubject fields to maths/science KS4 units
  - id: 2
    title: Enable richer search features
    priority: high
    summary: Add categories, unitOptionGroup, canonicalUrl, phaseSlug
  - id: 3
    title: Data quality fixes
    priority: low
    summary: Fix examBoard duplication, null encoding, field name casing
---

# Bulk Download Enhancement Request

Feature request for the Oak Curriculum API bulk download files.

**Goal**: Enable search index creation entirely from bulk download data,
eliminating all live API calls during ingestion.

**Context**: The search CLI currently uses a hybrid approach — bulk
download files as the primary data source, supplemented by live API calls
for data missing from the downloads. This creates a runtime dependency on
API availability and rate limits during ingestion. These phased
enhancements would remove that dependency and progressively improve
search quality.

---

## Phase 1 — Eliminate API calls during ingestion

These two additions are the only data gaps that currently force live API
calls. Resolving them allows fully offline ingestion from bulk files.

### 1a. Maths KS4 tier structure

**Problem**: Maths KS4 units exist in both Foundation and Higher tiers,
but the bulk download contains no tier information. The 66 KS4 units
produce 373 duplicate lesson entries with no distinguishing field. The
only way to resolve which tier a unit belongs to is the live API's
`GET /sequences/maths-secondary/units` response, which nests units
inside `tiers[].units[]`.

**Current workaround**: `api-supplementation.ts` calls
`getSubjectSequences('maths')` then `getSequenceUnits('maths-secondary')`
at ingestion time.

**Suggested approach**: Add an optional `tier` field to units in the bulk
download. This follows the existing convention of flat metadata fields on
units (like `examBoards`, `yearSlug`) rather than introducing nested
grouping.

```jsonc
// In sequence[]:
{
  "unitSlug": "algebraic-manipulation",
  "unitTitle": "Algebraic manipulation",
  "keyStageSlug": "ks4",
  "tier": { "slug": "foundation", "title": "Foundation" },
  // ... existing fields
}
```

A flat `tier` object on the unit is preferred over nesting units inside
tier groups because:

- It matches the existing flat-unit-array structure of `sequence[]`
- It avoids a structural divergence where maths KS4 uses a different
  array shape than every other subject
- It keeps units addressable by array index without tier-aware traversal
- A unit belongs to exactly one tier in a given sequence, so a single
  object (not an array) is correct

Units that have no tier (all non-KS4 subjects, plus KS3 maths) would
simply omit the field.

### 1b. Science KS4 exam subject grouping

**Problem**: Science KS4 units belong to specific exam subjects (Physics,
Chemistry, Biology, Combined Science) but the bulk download's single
`science-secondary.json` file contains all units in a flat list with no
exam subject indicator. The live API's
`GET /sequences/science-secondary-aqa/units` response nests units inside
`examSubjects[].tiers[].units[]`, providing this mapping.

**Current workaround**: Same `api-supplementation.ts` path — calls
`getSubjectSequences('science')` (returning 3 exam-board sequences:
AQA, Edexcel, OCR) then `getSequenceUnits` for each.

**Suggested approach**: Add an optional `examSubject` field to units,
following the same flat-field pattern as the tier addition above.

```jsonc
// In sequence[]:
{
  "unitSlug": "particle-explanations-of-density-and-pressure",
  "unitTitle": "Particle explanations of density and pressure",
  "keyStageSlug": "ks4",
  "tier": { "slug": "foundation", "title": "Foundation" },
  "examSubject": { "slug": "physics", "title": "Physics" },
  // ... existing fields
}
```

This is preferred over separate files per exam subject or nested
grouping for the same reasons as tiers: it keeps the unit array flat and
uniform across all subjects.

**Note**: Science KS4 units also have tiers (Foundation/Higher), so both
`tier` and `examSubject` would appear together on science KS4 units.

### Phase 1 impact

With these two additions, the search CLI can set `client: null` for the
entire ingestion pipeline. The `api-supplementation.ts` module and its
API calls become unnecessary. Currently 4+ API calls per ingestion run
(1 for maths sequences, 1 for maths units, 1 for science sequences,
3 for science units per exam board) are eliminated.

---

## Phase 2 — Enable richer search features

These additions do not currently cause API calls (the code paths exist
but are dormant). They would enable new search capabilities.

### 2a. Categories (unit topics)

**Problem**: The API provides `categories` on units (e.g., Grammar,
Spelling, Vocabulary for English; Biology, Chemistry, Physics for
science). These are absent from the bulk download. The search CLI has
complete category extraction code (`category-supplementation.ts`,
`bulk-unit-transformer.ts`) ready to consume this data, but it is never
activated because there is no data source.

**What it enables**:

- Faceted search — filter by topic within a subject (e.g., "show only
  Grammar units in English")
- Context enrichment — display topic labels alongside search results
- The `unit_topics` field in the search index is already defined but
  always empty

**Suggested approach**: Add an optional `categories` array to units,
matching the shape already used in the API response.

```jsonc
// In sequence[]:
{
  "unitSlug": "five-sentence-types",
  "unitTitle": "Five sentence types",
  "categories": [
    { "categoryTitle": "Grammar", "categorySlug": "grammar" }
  ],
  // ... existing fields
}
```

### 2b. Unit options (alternative units)

**Problem**: Some subjects offer alternative units at the same sequence
position (e.g., English Year 5 offers "The Aye-Aye: non-chronological
report" OR "Wild Cats: non-chronological report"). The API's
`GET /sequences/{slug}/units` response includes `unitOptions[]` on these
units, but the bulk download resolves each option into a separate
top-level unit with no link back to the parent or its alternatives.

This causes unresolvable phantom duplicates — English (47 units),
Geography (67 units), and History (25 units) contain duplicate entries
that the search CLI cannot distinguish or group.

**What it enables**:

- Correct deduplication during ingestion
- Search result grouping — show alternatives together rather than as
  separate, seemingly identical results
- Understanding which units are primary vs alternative

**Suggested approach**: Add an optional `unitOptionGroup` field to units
that share alternatives, identifying the parent position. Units that are
not part of an option group omit the field.

```jsonc
// In sequence[]:
{
  "unitSlug": "the-aye-aye-or-wild-cats-non-chronological-report-506",
  "unitTitle": "The Aye-Aye: non-chronological report",
  "unitOptionGroup": "the-aye-aye-or-wild-cats-non-chronological-report",
  // ... existing fields
},
{
  "unitSlug": "the-aye-aye-or-wild-cats-non-chronological-report-504",
  "unitTitle": "Wild Cats: non-chronological report",
  "unitOptionGroup": "the-aye-aye-or-wild-cats-non-chronological-report",
  // ... existing fields
}
```

A shared group identifier is preferred over nesting alternatives inside a
parent unit because it preserves the flat unit array and avoids two
different unit shapes (parent-with-children vs standalone).

### 2c. Canonical URL and phase

**Problem**: `canonicalUrl` (the Oak website URL for a lesson or
sequence) and `phaseSlug` (primary/secondary) are available in API
responses but absent from bulk downloads.

**What it enables**:

- Direct links from search results to the Oak website
- Phase-based search filtering without deriving phase from key stage

**Suggested approach**: Add optional `canonicalUrl` (string) on lessons
and `phaseSlug` (string) on sequences or units.

---

## Phase 3 — Data quality fixes

Existing fields with quality issues. These do not block any
functionality but create unnecessary complexity in the ingestion
pipeline.

### 3a. Science exam board deduplication

The `examBoards` array on science KS4 units contains massive
duplication. Example from `science-secondary.json`:

```json
"examBoards": [
  {"title": "Edexcel", "slug": "edexcel"},
  {"title": "Edexcel", "slug": "edexcel"},
  {"title": "Edexcel", "slug": "edexcel"},
  {"title": "Edexcel", "slug": "edexcel"},
  {"title": "OCR", "slug": "ocr"},
  {"title": "AQA", "slug": "aqa"},
  {"title": "OCR", "slug": "ocr"},
  {"title": "AQA", "slug": "aqa"},
  {"title": "OCR", "slug": "ocr"},
  {"title": "AQA", "slug": "aqa"},
  {"title": "OCR", "slug": "ocr"},
  {"title": "AQA", "slug": "aqa"}
]
```

Expected: 3 unique entries (AQA, Edexcel, OCR). Actual: 12 entries with
4x duplication per board.

### 3b. Null value encoding

`contentGuidance` and `supervisionLevel` use the string `"NULL"` instead
of JSON `null` when no value is present. The ingestion pipeline has to
check for both.

### 3c. Field name casing

`downloadsavailable` (all lowercase) diverges from the camelCase
convention used by every other field in the schema. The API uses
`downloadsAvailable`.

---

## Appendix: What the bulk downloads already include

For reference, the bulk downloads currently provide:

- **Lessons**: title, slug, unit/subject/key stage metadata, keywords,
  key learning points, misconceptions, pupil outcomes, teacher tips,
  content guidance, supervision level, transcripts (sentences + VTT)
- **Units**: title, slug, threads, exam boards, prior knowledge,
  national curriculum content, description, year, key stage,
  why-this-why-now, unit lessons
- **Sequences**: full ordered unit lists per subject
- **KS4 options**: listed at sequence level (exam boards, pathways)

## Appendix: Verification

All claims in this document were verified on 2026-03-10 against:

- Live API responses via MCP tools (maths, science, english sequences
  and units)
- Actual bulk download files in `apps/oak-search-cli/bulk-downloads/`
- Bulk download schema at `apps/oak-search-cli/bulk-downloads/schema.json`
- Ingestion code in `apps/oak-search-cli/src/adapters/`
