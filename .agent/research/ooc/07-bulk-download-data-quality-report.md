# Bulk Download Data Quality Report - Maths Primary and Secondary

Date: 19 December 2025

## Scope

Dataset source: `reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z/`

Files analysed:

- `maths-primary.json`
- `maths-secondary.json`

Dataset timestamp: 7 December 2025, 09:37:04 UTC

## Method

- Parsed the full JSON payloads for both files.
- Computed counts and distributions at unit and lesson level.
- Checked referential integrity between `sequence[].unitLessons[]` and `lessons[]`.
- Checked for duplicate slugs and inconsistent record variants.
- Evaluated field completeness and type consistency for key fields.

## Dataset summary

| Metric | Maths Primary | Maths Secondary |
| --- | --- | --- |
| Units (sequence entries) | 125 | 98 |
| Unique unit slugs | 125 | 68 |
| Lessons (lesson entries) | 1,072 | 1,235 |
| Unique lesson slugs | 1,072 | 862 |
| Duplicate unit slugs | 0 | 30 |
| Duplicate lesson slugs | 0 | 373 |
| Threads (unique) | 10 | 6 |
| Lessons per unit (mean) | 8.58 | 10.95 |
| Lessons per unit (min / max) | 5 / 15 | 1 / 19 |
| Transcripts present | 1,067 / 1,072 | 1,235 / 1,235 |
| VTT present | 1,067 / 1,072 | 1,235 / 1,235 |
| Content guidance present | 2 / 1,072 | 0 / 1,235 |
| Supervision level present | 2 / 1,072 | 0 / 1,235 |
| Downloads available | 100% | 100% |

## Structural integrity checks

### 1. Lesson references vs lesson records

Primary:

- All `unitLessons[].lessonSlug` values exist in `lessons[]`.

Secondary:

- One `unitLessons[]` entry does not exist in `lessons[]`:
  - `further-demonstrating-of-pythagoras-theorem` (state: `new`)

Impact:

- Breaks referential integrity for the sequence view.
- Forces consumers to handle missing lesson records.

### 2. Implicit KS4 tier variants (maths-secondary only)

**Updated 2025-12-30**: Deep investigation into the 373 duplicate lessons revealed:

#### Duplicate Breakdown

| Category | Count | Explanation |
|----------|-------|-------------|
| **Legitimate duplicates** | 210 | Lessons shared between BOTH tier variants (foundation + higher) |
| **Spurious duplicates** | 163 | Lessons in ONE tier only, incorrectly duplicated in `lessons[]` array |

#### Unit-Level Structure

Maths secondary has 30 unit slugs that appear twice (66 unit entries, 36 unique):

- **26 units** have **different lesson lists** — higher tier has more lessons
- **4 units** have **identical lesson lists** — same content in both tiers

Example: `algebraic-manipulation` appears twice:
- Occurrence 1: 16 lessons (higher tier content)
- Occurrence 2: 13 lessons (foundation tier content)
- 9 lessons shared, 7 higher-only, 4 foundation-only

#### Spurious Duplicates (Data Quality Issue)

163 lessons appear twice in `lessons[]` but only exist in ONE unit variant:

```
Example: solving-complex-quadratic-equations-by-completing-the-square
- In lessons[] array: 2 times
- In unit variants: 1 time (algebraic-manipulation higher only)
```

This is a **data quality issue** in the bulk download — the `lessons[]` array incorrectly duplicates tier-specific lessons.

#### Tier Coverage from API (100%)

**Investigation confirmed** (2025-12-30) that the API provides complete tier information:

| Metric | Value |
|--------|-------|
| Unique KS4 units in bulk | 36 |
| Units with tier info from API | 36 ✅ |
| Unique KS4 lessons in bulk | 436 |
| Lessons with tier derivable | 436 ✅ |

**Tier distribution**:
- 30 units in BOTH tiers → lessons get `tiers: ['foundation', 'higher']`
- 6 units HIGHER only → `circle-theorems`, `non-right-angled-trigonometry`, `functions-and-proof`, `iteration`, `graphical-representations-of-data-cumulative-frequency-and-histograms`, `transformations-of-graphs`
- 0 units foundation only

#### Solution

1. **Deduplicate** lessons by `lessonSlug` (simple deduplication handles both legitimate and spurious)
2. **Derive tiers** from API unit→tier map: `lesson.unitSlug` → `unitTierMap` → `tiers[]`
3. **Do NOT** infer tiers from duplicate count — bulk data unreliable for this

**Requested upstream fix**: Add explicit `tier` field to maths-secondary bulk download:

```json
{
  "unitSlug": "algebraic-fractions",
  "tier": "higher",  // ← missing field
  "unitLessons": [/* 8 lessons */]
}
```

### 3. Threads and descriptions missing on secondary units

Secondary has units with missing threads and empty descriptions:

- Units without threads: `maths-and-the-environment`, `maths-in-the-workplace`, `thinking-critically-with-maths`, `calculator-functionality`.
- Units with empty descriptions: `maths-and-the-environment`, `maths-in-the-workplace`, `thinking-critically-with-maths`.

Impact:

- Reduces navigability for thread-based progression.
- Weakens summarisation and search quality.

## Field completeness and type consistency

### Content guidance and supervision level

Primary:

- 1,070 lessons use the string `NULL` for `contentGuidance` and `supervisionLevel`.
- 2 lessons use an array of content guidance objects and `supervisionLevel: "Adult supervision required"`.

Secondary:

- All lessons use the string `NULL` for `contentGuidance` and `supervisionLevel`.

Impact:

- Mixed types (`string` vs `array`) for `contentGuidance`.
- The string `NULL` is not a JSON null and requires special handling.

### Transcripts

Primary:

- 5 lessons missing `transcript_sentences` and `transcript_vtt`:
  - `composition-of-decade-numbers-to-100-making-groups-of-10`
  - `describe-and-represent-hundredths-as-a-decimal-number`
  - `identify-hundredths-as-part-of-a-whole`
  - `round-a-decimal-number-with-hundredths-to-the-nearest-whole-number`
  - `use-known-facts-from-the-10-times-table-to-solve-problems-involving-the-9-times-table`

Secondary:

- No missing transcripts detected.

Impact:

- Transcript-based search and accessibility features have coverage gaps.

### Misconceptions and teacher tips

Primary:

- 2 lessons missing both misconceptions and teacher tips:
  - `know-that-a-right-angle-describes-a-quarter-turn`
  - `make-different-sized-angles-by-rotating-two-lines-around-a-fixed-point`

Secondary:

- No missing entries detected.

## Opportunities for improvement

1. Add explicit tier metadata to maths-secondary (CONFIRMED NEED)
   - The "duplicated" units are KS4 tier variants (foundation/higher) — **not data errors**.
   - Add `tier` field to maths-secondary bulk download to match the explicit variant handling in other subjects.
   - Consider adding `unitVariantSlug` for unique identification (e.g., `algebraic-fractions-higher`).

2. Enforce consistent null semantics
   - Replace the string `NULL` with JSON null for all nullable fields.
   - Make `contentGuidance` consistently an array (empty when absent).

3. Preserve referential integrity
   - Ensure every `unitLessons[].lessonSlug` is present in `lessons[]`.
   - Surface `state` consistently and document how non-published lessons should be handled.

4. Strengthen unit metadata coverage
   - Provide threads and descriptions for all units, or mark them explicitly as optional with null values.

5. Add bulk dataset metadata
   - Publish a per-file manifest with counts, unique slug totals, and checksums.
   - Include a dataset-level `lastUpdated` timestamp for cache invalidation.

## Suggested validation checks for bulk exports

- Uniqueness: `unitSlug` and `lessonSlug` should be unique, or variants must be declared explicitly with metadata (confirmed: maths-secondary needs `tier` field).
- Referential integrity: every `unitLessons[].lessonSlug` must exist in `lessons[]`.
- Type consistency: nullable fields must be null, not string sentinel values.
- Required fields: `unitTitle`, `lessonTitle`, `subjectSlug`, `subjectTitle` should never be empty.
- Transcript coverage: flag missing `transcript_sentences` or `transcript_vtt`.
- Thread coverage: ensure units have at least one thread, or expose an explicit `threads: []` with documentation.

## Appendix: thread categories

Primary thread slugs:

- `algebra`
- `geometry-and-measure`
- `number`
- `number-addition-and-subtraction`
- `number-fractions`
- `number-multiplication-and-division`
- `number-place-value`
- `probability`
- `ratio-and-proportion`
- `statistics`

Secondary thread slugs:

- `algebra`
- `geometry-and-measure`
- `number`
- `probability`
- `ratio-and-proportion`
- `statistics`

## Appendix: cross-subject variant metadata analysis (2025-12-24)

Analysis of all 30 bulk download files for variant metadata fields:

| Subject | Primary | Secondary |
|---------|---------|-----------|
| art | no examBoards | no examBoards |
| citizenship | — | has examBoards |
| computing | no examBoards | has examBoards |
| cooking-nutrition | no examBoards | no examBoards |
| design-technology | no examBoards | no examBoards |
| english | no examBoards | has examBoards |
| french | no examBoards | has examBoards |
| geography | no examBoards | has examBoards |
| german | — | has examBoards |
| history | no examBoards | has examBoards |
| **maths** | no examBoards | **no examBoards** ← unique among KS4 subjects |
| music | no examBoards | has examBoards |
| physical-education | no examBoards | has examBoards |
| religious-education | no examBoards | has examBoards |
| science | no examBoards | has examBoards |
| spanish | no examBoards | has examBoards |

**Key finding**: Maths secondary is the only KS4 subject without explicit variant metadata, despite having tier-based variants. This is why it has "duplicate" unit slugs while other secondary subjects do not.
