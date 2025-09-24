# Semantic Search High-Level Plan

## Intent

Coordinate the execution of all semantic search workstreams so the platform achieves the definitive target architecture defined in `semantic-search-target-alignment-plan.md`: four Elasticsearch Serverless indices, enriched SDK ingestion, server-side RRF queries, suggestion endpoints, observability, and aligned documentation/UI.

## Plan Hierarchy

1. **`semantic-search-target-alignment-plan.md`** – Canonical roadmap describing end-state outcomes, risks, workstreams, acceptance criteria, and deployment guidance. Always consult this plan first; every other document derives from it.
2. **Supporting plans** – Use the documentation, caching, alignment-refresh, and generated-document pipelines under `.agent/plans/semantic-search/` for detailed execution notes. Follow GO.md cadence within each track (ACTION → REVIEW pairs, regular grounding, British spelling).

## Lightweight Milestones

| Milestone/Phase                    | Outcome                                                                                                                                                                                                                                                                                                                     | Primary references                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Phase 1 – Demonstration baseline   | Four indices + `oak_sequence_facets` live; env validation hardened; ingestion/rollup emit enriched docs; `/api/search`, `/api/search/nl`, `/api/search/suggest` deliver RRF responses; UI exposes scopes, facets, suggestions, admin telemetry via Oak Components; zero-hit telemetry and deployment checklist operational. | `semantic-search-target-alignment-plan.md` (Phase 1, workstreams, acceptance criteria, deployment). |
| Phase 2 – Content depth expansion  | Additional indices for lesson planning, transcripts, guidance, assets, and assessments with inference-aware ingestion; optional content blocks and safeguarding filters surfaced behind feature flags; UI updates to showcase richer context.                                                                               | Target alignment plan (Phase 2); generated-document and documentation plans.                        |
| Phase 3 – Ontology & observability | Ontology metadata surfaced end-to-end (`_nodeId`, `_schemaRefs`), advanced suggestions spanning all indices, ontology-aware zero-hit dashboards, MCP resources documented.                                                                                                                                                  | Target alignment plan (Phase 3); observability guidance in deployment section.                      |
| Continuous quality & documentation | OpenAPI/TypeDoc regenerated, MCP tooling aligned, lint/test/build/doc-gen gates green, continuation prompt updated after milestones, documentation refreshed.                                                                                                                                                               | Target alignment plan (workstreams 6 & deployment), documentation plan, alignment-refresh plan.     |

## Execution Notes

- Use `semantic-search-alignment-refresh-plan.md` to track documentation upkeep, continuation prompt updates, and quality gates (format → lint → type-check → test → build → doc-gen).
- Every task should reference the governing plan(s) in commits or review logs to maintain traceability.
- Update this high-level plan as milestones progress (dates, status badges) to keep stakeholders aligned on overall progress.
