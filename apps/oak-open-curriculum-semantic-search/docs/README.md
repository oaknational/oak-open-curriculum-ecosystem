# Oak Curriculum Hybrid Search — Documentation

This directory contains authored documentation for the semantic search workspace. Generated TypeDoc output lives under `docs/api/` and must be regenerated with `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen` whenever the API surface changes. Follow GO.md when editing docs—record ACTION/REVIEW pairs and perform regular grounding.

## Authored guides

- `ARCHITECTURE.md` – High-level system overview: four-index topology, endpoints, observability.
- `SETUP.md` – Environment configuration, Elasticsearch bootstrap, ingestion/rollup, quality gates.
- `INDEXING.md` – Resilient ingestion playbook, canonical payloads, alias rotation.
- `ROLLUP.md` – Unit snippet generation, semantic copy, cache invalidation.
- `QUERYING.md` – Canonical RRF queries, facets, suggestions, zero-hit logging.
- `SDK-ENDPOINTS.md` – Parity routes for regression comparison.
- `oak-curriculum-hybrid-search-definitive-guide.md` – Deep-dive reference for architecture and mappings.

## Generated artefacts

- `docs/api/` – TypeDoc output for the workspace.
- `/api/openapi.json` – Generated automatically from Zod schemas; human-readable version at `/api/docs`.

## Editing workflow

1. Read `.agent/directives-and-memory/rules.md`, `docs/agent-guidance/testing-strategy.md`, and GO.md.
2. Update authored Markdown alongside code changes; ensure British spelling.
3. Run `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen` to regenerate TypeDoc and verify zero warnings.
4. Add notes to the alignment refresh plan’s Review Log summarising documentation changes and quality gate outcomes.

## Quality gates for documentation changes

- `pnpm lint` (Markdown linting included via unified configuration).
- `pnpm test` (ensure doc-related tests pass if any).
- `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen` (TypeDoc + OpenAPI regeneration).

Keep this README updated if new guides are added or responsibilities change.
