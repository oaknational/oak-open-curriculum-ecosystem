# Semantic Search API — New Chat Startup Prompt

## Context & Mission

You are working on the **Oak Open Curriculum Semantic Search API** project. The aim is to deliver the definitive architecture captured in `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md`: four Elasticsearch Serverless indices, enriched SDK data, server-side RRF queries, suggestion endpoints, observability, and full documentation alignment.

**Current Status**: Alignment execution — rebuilding mappings, ingestion, queries, API surface, and observability.  
**Next Milestone**: Complete Elasticsearch mapping regeneration, enriched ingestion/rollup, and server-side RRF queries for lessons, units, and sequences (see `semantic-search-api-plan.md`).

## Essential Reading (MANDATORY — in order)

1. **Repository Rules & Standards**
   - `.agent/directives/rules.md`
   - `.agent/directives/testing-strategy.md`
2. **Plans & Context**
   - `.agent/plans/semantic-search/semantic-search-api-plan.md`
   - `.agent/plans/semantic-search/semantic-search-api-context.md`
   - `.agent/plans/semantic-search/semantic-search-alignment-refresh-plan.md`
3. **Workflow**
   - `GO.md` — use ACTION/REVIEW pairs with self-reviews; ground every third task.

## Current Project State (highlights)

### ✅ Established foundations

- Next.js API routes exist for structured/NL search, indexing, rollup rebuild, and SDK parity.
- Baseline Elasticsearch setup scripts and legacy ingestion logic in place.
- Theming/UI work partially complete; documentation and caching plans updated for alignment.

### 🚧 Active alignment work

- Regenerating mappings/settings for `oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences` with completion contexts, highlight offsets, semantic_text.
- Extending environment validation (`OAK_API_KEY`/`OAK_API_BEARER`, `SEARCH_INDEX_VERSION`, observability config, AI provider toggles).
- Rebuilding ingestion & rollup flows for enriched payloads, resilient batching/backoff, canonical URLs, semantic payloads, suggestion inputs.
- Implementing server-side RRF query builders for lessons, units, sequences; adding facets and highlights; refactoring `/api/search` and `/api/search/nl`.
- Adding suggestion/type-ahead endpoints, status telemetry, zero-hit logging.
- Refreshing OpenAPI, MCP tooling, documentation, and regression tests.

### ⏳ Pending validation/sign-off

- Compatibility checks with target clients (OpenAI Connector, Gemini, ElevenLabs).
- Post-alignment quality gates (`pnpm lint`, `pnpm test`, `pnpm build`, `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`).

## Immediate Next Steps (follow GO cadence)

1. Read the mandatory documents above.
2. Open `.agent/plans/semantic-search/semantic-search-alignment-refresh-plan.md` and continue from the next ACTION item.
3. For each task:
   - Write the todo entry in GO format (ACTION, REVIEW, with grounding every third step).
   - Use TDD (`.agent/directives/testing-strategy.md`), starting with failing tests.
   - Capture reviews/quality-gate outcomes in the refresh plan’s Review Log.
4. Keep documentation in sync (docs, README, MCP notes) per the documentation plan.

## Key Technical Context

- **Architecture**: Next.js (App Router) on Vercel, Elasticsearch Serverless (four indices), Oak Curriculum SDK as sole data source, server-side RRF queries, suggestion endpoints, status telemetry.
- **Environment Variables**: `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `OAK_API_KEY` or `OAK_API_BEARER`, `SEARCH_API_KEY`, `SEARCH_INDEX_VERSION`, observability (e.g., `ZERO_HIT_WEBHOOK_URL`), `AI_PROVIDER`, `OPENAI_API_KEY` (when AI enabled).
- **Critical Files**:
  - `apps/oak-open-curriculum-semantic-search/app/api/search/route.ts` (structured RRF)
  - `app/api/search/nl/route.ts` (NL wrapper)
  - `app/api/search/suggest/route.ts` (to be implemented)
  - `app/api/index-oak/route.ts`, `app/api/index-oak/status/route.ts` (admin + telemetry)
  - `app/api/rebuild-rollup/route.ts`
  - `src/lib/ingestion/*`, `src/lib/queries/*`, `src/lib/env.ts`, `src/lib/logging.ts`
  - `scripts/elastic-setup.ts`, `elastic-alias-swap.ts`
  - Docs under `apps/oak-open-curriculum-semantic-search/docs/`

## Development Rules (always)

- Honour `.agent/directives/rules.md` and the testing strategy; apply TDD (Red → Green → Refactor).
- No skipping quality gates. The sequence: `pnpm format` → `pnpm type-check` → `pnpm lint` → `pnpm test` → `pnpm build` → `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`.
- No unsafe assertions (`as`, `!`) or bypassing type guards; prefer pure functions.
- British spelling required; mention “REMINDER: Use british spelling” in todo lists.

## Success Criteria (per alignment plan)

- Four Elasticsearch indices created with definitive mappings/settings.
- Environment validation covers credentials, logging, AI provider, index versioning with tests.
- Ingestion and rollup flows produce enriched documents, canonical URLs, suggestion payloads, with resilient retries and structured logging.
- `/api/search`, `/api/search/nl`, `/api/search/suggest`, admin/status endpoints function as specified with server-side RRF and telemetry.
- OpenAPI/TypeDoc/MCP artefacts regenerated; documentation updated; zero-hit logging operational.
- Quality gates run green; outcomes recorded in Review Log.

## Getting Started Checklist

1. Sync the latest `main` and confirm local workspace baseline (`pnpm install`, `pnpm qg`).
2. Read the essential documents; summarise key points in your notes.
3. Start with the next ACTION in the refresh plan; log all reviews/grounding.
4. Communicate deviations via the plan’s Review Log before proceeding.

**Remember**: keep it simple without compromising quality, follow GO cadence, and let the target alignment plan guide priorities.
