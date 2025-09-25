# Semantic Search Continuation Prompt

Plan: .agent/plans/semantic-search/semantic-search-target-alignment-plan.md
Context: .agent/plans/semantic-search/semantic-search-target-alignment-context.md
UI investigation: .agent/plans/semantic-search/ui-investigation.md

All work must remain aligned with `GO.md`, `AGENT.md`, `.agent/directives-and-memory/rules.md`, and `docs/agent-guidance/testing-strategy.md`. Maintain GO cadence (ACTION → self REVIEW, grounding every third item) and British spelling.

===

## Phase snapshot (2025-09-25)

- Server-side RRF live for lessons/units/sequences with enriched totals, facets, highlights.
- `/api/search/suggest` ships cached completion + fallback suggestions with structured logging.
- Zero-hit telemetry now persists to Elasticsearch Serverless with ILM + CLI purge tooling (see `zero-hit-persistence.ts`, `docs/QUERYING.md`).
- Target alignment plan / context capture the full history; the UI investigation file logs outstanding theming/hydration defects.

## Immediate focus (Plan Steps 52–61)

1. Optimise `oak_sequence_facets` ingestion + caching (batch sizing, invalidation hooks) using sandbox instrumentation; document the runbook (Plan Step 52).
2. Verify/document persistence-backed zero-hit dashboards (Plan Step 50 already complete) and harden webhook/web UI flows if gaps appear during ingestion work.
3. Enrich `/admin` with index health telemetry and controls (Plan Step 55).
4. Complete Oak Component migration + theme remediation per UI investigation (Theme SSR bridge, theme selector sync, overlay removal).
5. Refresh docs/onboarding then run quality gates (`pnpm lint`, `pnpm test`, `pnpm build`, `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`, `pnpm qg`).

## Known issues / references

- `.agent/plans/semantic-search/ui-investigation.md` documents styled-components hydration mismatch and theme toggle regression blocking UI work.
- `apps/oak-open-curriculum-semantic-search/src/lib/index-oak.ts` orchestrates ingestion; sequence facets built via `sequence-facet-index.ts` / `sequence-facets.ts`.
- Sandbox harness lives under `apps/oak-open-curriculum-semantic-search/scripts/sandbox/ingest.ts` with fixtures (`fixtures/sandbox`).
- Zero-hit persistence logic: `zero-hit-persistence.ts` (+ `*-index.ts`, `*-search.ts`, CLI purge).

## Suggested starting cadence

1. ACTION: Audit current `oak_sequence_facets` ingestion runtime (use sandbox harness dry run) to capture batch sizes, request counts, cache write points.
2. REVIEW: Summarise ingestion/caching findings in plan/context; update UI investigation if theming errors surface during the audit.
3. ACTION: Prototype instrumentation/logging for sequence facet batches, experiment with chunk sizing + cache invalidation trigger; document runbook updates.
4. REVIEW: Extend unit coverage around `buildSequenceFacetSources`/`buildSequenceFacetOps`; ensure no regressions with existing tests.
5. GROUNDING: read GO.md; refresh AGENT.md/metacognition instructions. REMINDER: UseBritish spelling.
6. ACTION: Implement styled-components SSR fix + theme sync (per UI investigation) before resuming Oak component migration tasks.
