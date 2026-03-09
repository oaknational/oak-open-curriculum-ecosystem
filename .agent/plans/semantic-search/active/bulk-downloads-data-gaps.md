# API Gaps — Bulk Download Enhancement Requests

Data that the search CLI currently supplements from the Oak Curriculum API
because it is absent from the bulk download files. Including this data in
the bulk downloads would eliminate API calls during ingestion, improving
speed, reliability, and removing rate-limit constraints.

## KS4 Tier, Exam Board, and Science Variant Data

**Current workaround**: `apps/oak-search-cli/src/adapters/api-supplementation.ts`
fetches this data from the API during each ingestion run.

| Field | Current API Source | Purpose |
|-------|-------------------|---------|
| `tiers` | `GET /subjects/{subject}/sequences` then `GET /sequences/{slug}/units` | Maths tier differentiation (Foundation/Higher) |
| `tier_titles` | Same as above | Human-readable tier names |
| `exam_boards` | Parsed from sequence slug + API response | Exam board identifiers (AQA, Edexcel, OCR, etc.) |
| `exam_board_titles` | `GET /subjects/{subject}/sequences` (`ks4Options`) | Full exam board names |
| `exam_subjects` | Science-specific API data | Science exam subject options (Physics, Chemistry, Biology) |
| `exam_subject_titles` | Same as above | Full exam subject names |
| `ks4_options` | Sequence metadata | Alternative KS4 qualification options |
| `ks4_option_titles` | Same as above | Readable option names |

**Impact**: Without this data in bulk downloads, search filtering by tier
(Maths Foundation/Higher), exam board, and science variant requires live
API calls subject to rate limiting. Each ingestion run makes 2 API calls
per KS4 subject.

**Subjects affected**: `maths` (tiers), `science` (exam subjects), all
KS4 subjects (exam boards).

## Unit Category (Topic) Data

**Current state**: Categories (unit topics such as "Grammar", "Spelling")
are available via the `GET /sequences/{slug}/units` endpoint but are not
included in the bulk download files.

| Field | Current API Source | Purpose |
|-------|-------------------|---------|
| `unit_topics` | `GET /sequences/{slug}/units` → `categories` array | Faceted filtering by topic, context enrichment in search results |

**Impact**: Category data enables faceted search (filter by topic) and
richer search result context. The CLI has extraction code ready
(`category-supplementation.ts`) but it cannot be activated without either
API calls during ingestion or bulk download inclusion.

## Requested Bulk Download Additions

To eliminate API supplementation during ingestion, the bulk downloads
would need to include:

1. **Tier structure per unit** — which units are Foundation/Higher
   (currently derived from sequence → unit API calls)
2. **Exam board mapping per unit** — which exam board(s) each unit serves
   (currently parsed from sequence slugs and API responses)
3. **Science variant mapping** — which units belong to Physics/Chemistry/
   Biology vs Combined Science (currently from API)
4. **Category (topic) data per unit** — which categories/topics each unit
   belongs to (currently from sequence → units API endpoint)

Items 1–3 are derivable from the sequence/unit hierarchy already partially
present in the bulk downloads (`ks4Options` at sequence level) but not
fully resolved at the unit level. Item 4 is available in the API response
but not included in any bulk download schema.

## What the Bulk Downloads Already Include

For context, the bulk downloads (`schema.json`) already provide:

- **Lessons**: title, slug, unit/subject/key stage metadata, keywords,
  key learning points, misconceptions, pupil outcomes, teacher tips,
  content guidance, supervision level, transcripts (sentences + VTT)
- **Units**: title, slug, threads, exam boards, prior knowledge,
  national curriculum content, description, year, key stage,
  why-this-why-now, unit lessons
- **Sequences**: full ordered unit lists per subject
- **KS4 options**: listed at sequence level (exam boards, pathways)
