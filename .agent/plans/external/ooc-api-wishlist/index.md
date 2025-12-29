# Open Curriculum API Wishlist Index

This directory contains a split version of the upstream API metadata wishlist to keep each document short and focused. The content is split sequentially and preserved verbatim within each file.

## Key references

- API docs: https://open-api.thenational.academy/docs/about-oaks-api/api-overview
- OpenAPI schema (local): packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-original.json
- Canonical field name: semantic_summary
- Archive (original single file): .agent/plans/external/ooc-api-wishlist/archive/upstream-api-metadata-wishlist.md

## File map

- `00-overview-and-known-issues.md` — open questions, binary response fix, legitimate z.unknown exceptions, bulk download data integrity issues, KS4 science accessibility clarification.
- `01-derived-fields-and-ks4-metadata.md` — derived fields registry, ghost pathway note, KS4 programme factors, and interim denormalisation workaround.
- `02-semantic-summary.md` — rerank summary request and the semantic_summary field definitions with status and rationale.
- `03-context-and-vision.md` — executive summary, vision, tool ecosystem, schema-first pipeline overview, and audience.
- `04-high-priority-requests.md` — high priority requests covering tool discovery, ontology, error docs, programme variants, identity consistency, and **structural pattern documentation** (NEW 2025-12-28).
- `05-medium-priority-requests.md` — medium priority items for parameters, extensions, behavioural metadata, thread enhancements, schema refs, Zod validators, and **ingestion efficiency improvements** (boolean resource flags, bulk lesson materials endpoint).
- `06-response-metadata-and-caching.md` — response examples, canonical URL patterns, and resource timestamps.
- `07-low-priority-and-best-practices.md` — performance hints plus the OpenAPI best practices checklist sections A-G.
- `08-summary-and-coordination.md` — summary table, implementation notes, testing impact, coordination, related docs, next steps, and contact details.

## Related Analysis Documents

- **[Curriculum Structure Analysis](../../curriculum-structure-analysis.md)** — Comprehensive analysis of all 6 structural patterns, traversal strategies, and aggregation requirements (2025-12-28)
