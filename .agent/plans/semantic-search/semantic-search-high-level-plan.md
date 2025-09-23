# Semantic Search High-Level Plan

## Intent

Coordinate the execution of all semantic search workstreams so the platform achieves the definitive target architecture defined in `semantic-search-target-alignment-plan.md`: four Elasticsearch Serverless indices, enriched SDK ingestion, server-side RRF queries, suggestion endpoints, observability, and aligned documentation/UI.

## Plan Hierarchy

1. **`semantic-search-target-alignment-plan.md`** – Canonical roadmap describing end-state outcomes, risks, and detailed actions. This plan should always be interpreted first; every other plan derives from it.
2. **Derived execution plans** – API, UI, caching, documentation, prompts, and refresh roadmap under `.agent/plans/semantic-search/`. Follow GO.md cadence within each track, ensuring ACTION → REVIEW pairs and regular grounding.

## Lightweight Milestones

| Milestone                                 | Outcome                                                                                                                                                                                              | Primary references                                                                                          |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Search-M1 — Foundations realigned         | Elasticsearch mappings/settings regenerated (four indices, completion contexts, highlight offsets); env validation expanded (`OAK_API_KEY`/`OAK_API_BEARER`, `SEARCH_INDEX_VERSION`, observability). | `semantic-search-target-alignment-plan.md` steps 1–6; `semantic-search-api-plan.md` workstreams 1–2.        |
| Search-M2 — Ingestion & rollups enriched  | Resilient batching/backoff, canonical URLs, semantic_text payloads, suggestion inputs, rollup snippets, alias rotation, zero-hit telemetry scaffolding.                                              | Target plan steps 7–12; `semantic-search-api-plan.md` workstream 3; docs in `INDEXING.md`, `ROLLUP.md`.     |
| Search-M3 — Server-side RRF & suggestions | Structured/NL/suggest endpoints using shared RRF builders, facets, highlights, caching tags; status endpoint live; zero-hit logging operational.                                                     | Target plan steps 13–23; `semantic-search-api-plan.md` workstreams 4–5; caching plan.                       |
| Search-M4 — UI & documentation alignment  | UI exposes lessons/units/sequences, facets, suggestion dropdown, admin telemetry; authored docs + README updated; MCP tooling refreshed.                                                             | `semantic-search-ui-plan.md`, `semantic-search-documentation-plan.md`, `semantic-search-ui-style-audit.md`. |
| Search-M5 — Regression & sign-off         | Tests expanded (unit/integration/UI), OpenAPI/TypeDoc regenerated, quality gates green, compatibility checks with target clients captured.                                                           | Target plan steps 24–36; refresh plan review log entries; `semantic-search-startup-prompt.md`.              |

## Execution Notes

- Use `semantic-search-alignment-refresh-plan.md` as the active tracker for documentation/plan upkeep and quality gates.
- Every task must reference the governing plan(s) in commit messages or review logs.
- Keep the High-Level Plan in sync when milestones progress; update the table with dates or status badges as work completes.
