# API Gaps — Data Not in Bulk Downloads

Data that the CLI's bulk ingestion pipeline currently supplements from the
Oak Curriculum API because it is absent from the bulk download files.

The long-term goal is to lobby the API team to include this data in the
bulk downloads, eliminating the need for API calls during ingestion.

## Currently Supplemented (KS4 Tier/Exam Board)

**Source**: `apps/oak-search-cli/src/adapters/api-supplementation.ts`

| Field | API Endpoint | Purpose |
|-------|-------------|---------|
| `tiers` | `GET /subjects/{subject}/sequences` → `GET /sequences/{slug}/units` | Maths tier differentiation (Foundation/Higher) |
| `tier_titles` | Same as above | Human-readable tier names |
| `exam_boards` | Parsed from sequence slug + API response | Exam board identifiers (AQA, Edexcel, OCR, etc.) |
| `exam_board_titles` | `GET /subjects/{subject}/sequences` (`ks4Options`) | Full exam board names |
| `exam_subjects` | Science-specific API data | Science exam subject options (Physics, Chemistry, Biology) |
| `exam_subject_titles` | Same as above | Full exam subject names |
| `ks4_options` | Sequence metadata | Alternative KS4 qualification options |
| `ks4_option_titles` | Same as above | Readable option names |

**Why it matters**: Without this data, search filtering by tier (Maths
Foundation/Higher), exam board, and science variant is incomplete.

**Subjects affected**: `maths` (tiers), `science` (exam subjects),
all KS4 subjects (exam boards).

**API calls per ingestion**: 2 per KS4 subject (getSubjectSequences →
getSequenceUnits for each sequence). Subject to rate limiting.

## Infrastructure Built but Unused (Categories)

**Source**: `apps/oak-search-cli/src/adapters/category-supplementation.ts`

| Field | API Endpoint | Purpose |
|-------|-------------|---------|
| `unit_topics` | `GET /sequences/{slug}/units` | Unit categorisation for faceted filtering (e.g., Grammar, Spelling) |

Code exists (`buildCategoryMap()`, `getCategoriesForUnit()`) but is never
wired into the bulk pipeline. The `HybridDataSource` and
`bulk-ingestion-phases.ts` never build or pass the category map.

## Not Currently Addressed

These fields exist in the API but are not fetched during bulk ingestion:

| Data | Why Not Used | Impact |
|------|-------------|--------|
| Lesson quizzes | Not needed for search index | No impact on search |
| Lesson worksheets/assets | Not needed for search index | No impact on search |
| Lesson video URLs | Not needed for search index | No impact on search |
| Exit quiz answers | Not needed for search index | No impact on search |

## What the Bulk Downloads Already Include

The bulk downloads (`schema.json`) already provide:

- **Lessons**: title, slug, unit/subject/key stage metadata, keywords,
  key learning points, misconceptions, pupil outcomes, teacher tips,
  content guidance, supervision level, transcripts (sentences + VTT)
- **Units**: title, slug, threads, exam boards, prior knowledge,
  national curriculum content, description, year, key stage,
  why-this-why-now, unit lessons
- **Sequences**: full ordered unit lists per subject
- **KS4 options**: listed at sequence level (exam boards, pathways)

## Request for API Team

To eliminate API supplementation during ingestion, the bulk downloads
would need to include:

1. **Tier structure per unit** — which units are Foundation/Higher
   (currently derived from sequence → unit API calls)
2. **Exam board mapping per unit** — which exam board(s) each unit serves
   (currently parsed from sequence slugs and API responses)
3. **Science variant mapping** — which units belong to Physics/Chemistry/
   Biology vs Combined Science (currently from API)

These are all derivable from the sequence/unit hierarchy that is already
partially in the bulk downloads (`ks4Options` at sequence level) but not
fully resolved at the unit level.
