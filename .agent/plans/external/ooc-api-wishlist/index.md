# Open Curriculum API Wishlist Index

This directory contains a split version of the upstream API metadata wishlist to keep each document short and focused. The content is split sequentially and preserved verbatim within each file.

## Key references

- API docs: https://open-api.thenational.academy/docs/about-oaks-api/api-overview
- OpenAPI schema (local): packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-original.json
- Canonical field name: semantic_summary
- Archive (original single file): .agent/plans/external/ooc-api-wishlist/archive/upstream-api-metadata-wishlist.md

## Guiding question

If someone handed you this pack, would you know how to find what you want, and would you be able to discover everything important?

## How to find what you need

**If you need a quick overview:** start with `08-summary-and-coordination.md`, then scan `00-overview-and-known-issues.md`.

**If you want examples first:** jump to `10-availability-and-gating-examples.md` through `20-validation-and-schema-examples.md`, then follow cross-links back to the request docs.

**If you are working by topic:**

- **Maths-specific improvements:** `21-maths-education-enhancements.md`
- **Search and enums:** `12-search-and-enums-examples.md` and `04-high-priority-requests.md` (Items 1-2)
- **Threads and ontology:** `17-ontology-and-threads-examples.md` and `05-medium-priority-requests.md` (Item 10)
- **Quizzes and questions:** `13-quiz-content-examples.md` and `04-high-priority-requests.md` (Item 4)
- **Assets and transcripts:** `11-assets-and-transcripts-examples.md` and `06-response-metadata-and-caching.md`
- **Bulk download integrity:** `15-bulk-download-examples.md` and `00-overview-and-known-issues.md`
- **Bulk download completeness:** `15-bulk-download-examples.md` (Examples 8-12) and `00-overview-and-known-issues.md` (ER4-ER8)
- **Schema/validation tooling:** `20-validation-and-schema-examples.md` and `09-schemas-endpoint-rfc.md`
- **Programme variants and identifiers:** `18-programmes-and-identifiers-examples.md` and `04-high-priority-requests.md` (Items 5-6)
- **MFL/Languages issues:** `00-overview-and-known-issues.md` (MFL Transcript API Response Inconsistency, ER14 Multilingual Captioning)
- **Data variances and coverage:** `00-overview-and-known-issues.md` (ER15 Category Availability, ER16 Key Stage Coverage Discovery) and [Data Variances](../../../../docs/data/DATA-VARIANCES.md)
- **Ground truth and evaluation:** `00-overview-and-known-issues.md` (ER17 Phase Metadata, ER18 Bulk Slug Validation, ER19 Field Availability, ER20 Bulk Version Metadata)

## File map

- `00-overview-and-known-issues.md` — open questions, API code review findings, binary response fix, legitimate z.unknown exceptions, bulk download data integrity issues, KS4 science accessibility clarification, **clarifying questions for upstream team** (NEW 2025-12-30), **enhancement requests** (full data coverage, API vs bulk docs, hasTranscript flags) (NEW 2025-12-30), **bulk download completeness requests** (RSHE-PSHE file, tier field, unit options, yearSlug, examBoard) (NEW 2025-12-30), **bulk download structure improvements** (top-level threads, null handling, bundled schemas, lesson counts, subject metadata) (NEW 2025-12-31), **MFL transcript API inconsistency** (500 vs 404 responses) (NEW 2026-01-03), **future enhancements** (multilingual captioning, category docs, key stage discovery) (NEW 2026-01-03), **ground truth & evaluation support** (phase metadata, bulk slug validation, field availability docs, bulk version metadata) (NEW 2026-01-05).
- `01-derived-fields-and-ks4-metadata.md` — derived fields registry, ghost pathway note, KS4 programme factors, and interim denormalisation workaround.
- `02-semantic-summary.md` — rerank summary request and the semantic_summary field definitions with status and rationale.
- `03-context-and-vision.md` — executive summary, vision, tool ecosystem, schema-first pipeline overview, and audience.
- `04-high-priority-requests.md` — high priority requests covering tool discovery, ontology, error docs, programme variants, identity consistency, and **structural pattern documentation** (NEW 2025-12-28).
- `05-medium-priority-requests.md` — medium priority items for parameters, extensions, behavioural metadata, thread enhancements, schema refs, Zod validators, and **ingestion efficiency improvements** (boolean resource flags, bulk lesson materials endpoint).
- `06-response-metadata-and-caching.md` — response examples, canonical URL patterns, and resource timestamps.
- `07-low-priority-and-best-practices.md` — performance hints plus the OpenAPI best practices checklist sections A-G.
- `08-summary-and-coordination.md` — summary table, implementation notes, testing impact, coordination, related docs, next steps, and contact details.
- `09-schemas-endpoint-rfc.md` — RFC for a /schemas bundle endpoint and SDK type-gen integration for validators.
- `10-availability-and-gating-examples.md` — examples for blocked subjects, allowlists, and availability metadata.
- `11-assets-and-transcripts-examples.md` — examples for assets endpoints, binary responses, and transcript availability.
- `12-search-and-enums-examples.md` — examples for search constraints and enum sources.
- `13-quiz-content-examples.md` — examples for quiz question filtering and omission metadata.
- `14-listing-and-pagination-examples.md` — examples for lesson/unit listings, pagination, and KS4 science access.
- `15-bulk-download-examples.md` — examples for bulk download data integrity issues.
- `16-schema-and-metadata-examples.md` — examples for descriptions, extensions, responses, and schema patterns.
- `17-ontology-and-threads-examples.md` — examples for `/ontology` and thread metadata enhancements.
- `18-programmes-and-identifiers-examples.md` — examples for programme variants, tier/examBoard fields, and identifiers.
- `19-semantic-summary-examples.md` — examples for `semantic_summary`.
- `20-validation-and-schema-examples.md` — examples for schema export, `z.unknown()` exceptions, and OpenAPI questions.
- `21-maths-education-enhancements.md` — maths-focused API enhancements with examples and OpenAPI change sketches.
- `20-ontology-and-graphs-api-proposal.md` — **NEW 2026-02-04** Proposal for API endpoints serving ontology and pre-computed graph data (vocabulary, prerequisites, progressions, misconceptions, NC coverage).

## Related Analysis Documents

- **[Data Variances](../../../../docs/data/DATA-VARIANCES.md)** — **Consolidated reference** for all curriculum data differences, transcript availability, structural patterns, API vs Bulk, integrity issues
- **[Curriculum Structure Analysis](../../analysis/curriculum-structure-analysis.md)** — Comprehensive analysis of all 7 structural patterns, traversal strategies, and aggregation requirements (2025-12-28)
