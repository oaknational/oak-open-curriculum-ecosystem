# Semantic Search API Plan (Service mechanics, OpenAPI, MCP)

Role: This plan covers the back‑end of the Semantic Search service: indices, ingestion, query execution, routes, OpenAPI, and MCP surfacing. It extracts the API/mechanics content from `semantic-search-service-plan.md`. UI and documentation work are tracked separately.

Document relationships

- UI/UX plan: `semantic-search-ui-plan.md`
- Documentation & onboarding plan: `semantic-search-documentation-plan.md`
- Archived source: `archive/semantic-search-service-plan.md`

---

## Scope

- Hybrid lexical + semantic search over Oak content in Elasticsearch Serverless.
- Public endpoints only; admin endpoints are guarded and not exposed via MCP by default.
- OpenAPI schema generation and MCP tool/resource/prompt emission from the schema.

---

## Objectives

- Deliver structured and natural‑language search with reliable highlights.
- Keep the Oak Curriculum API as the single source of truth via the official SDK.
- Use three indices: `oak_lessons` (transcripts + `lesson_semantic`), `oak_units` (metadata), `oak_unit_rollup` (short per‑lesson passages + `unit_semantic`).
- Expose endpoints: `POST /api/search` (structured) and `POST /api/search/nl` (LLM optional; 501 when disabled).
- Publish OpenAPI for public, non‑admin endpoints and surface corresponding MCP tools/resources/prompts.

---

## Current status (API)

- Endpoints implemented: `/api/search`, `/api/search/nl`, `/api/index-oak`, `/api/rebuild-rollup`, SDK‑parity routes (`/api/sdk/search-lessons`, `/api/sdk/search-transcripts`).
- OpenAPI at `/api/openapi.json` and `/api/docs` UI.
- Hybrid‑search core in `src/lib/hybrid-search/*`.
- Tests: basic RRF unit present; more API tests pending (fusion, filters, highlights, rollup fallback; OpenAPI builder).
- Builds green across workspaces; Next app consumes SDK dist.

---

## Deliverables (API)

1. Indices & mappings (serverless): scripts to create/update synonyms and mappings.
2. Indexing routes: `GET /api/index-oak`, `GET /api/rebuild-rollup` (admin‑guarded via `x-api-key`).
3. Search routes: `POST /api/search` (structured), `POST /api/search/nl` (NL, 501 when LLM disabled).
4. SDK parity routes: `POST /api/sdk/search-lessons`, `POST /api/sdk/search-transcripts`.
5. OpenAPI schema: `GET /api/openapi.json` and `/api/docs` UI.
6. MCP tools/resources/prompts derived from OpenAPI for non‑admin operations.
7. Tests: unit/integration for validation, fusion, highlights; OpenAPI builder.

---

## Implementation plan (API phases)

### Phase A — Create indices (Serverless ES)

Required env: `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `OAK_API_KEY`, `SEARCH_API_KEY`.

```bash
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
pnpm -C apps/oak-open-curriculum-semantic-search run elastic:setup
```

Verify

- `/_synonyms/oak-syns` present; analyser uses `lowercase` + `synonym_graph`.
- Mappings include `semantic_text` and `term_vector` where expected.

Notes: synonyms are case‑insensitive; re‑PUT to update; close/open index to refresh analysers if needed.

### Phase B — Local service & tests

Fill `.env.local` (reads from root `.env`): `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `OAK_API_KEY`, `SEARCH_API_KEY`, `AI_PROVIDER`, `OPENAI_API_KEY`.

Dev:

```bash
pnpm -C apps/oak-open-curriculum-semantic-search dev
```

Index & rollup:

```bash
curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/index-oak
curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/rebuild-rollup
```

Structured search:

```bash
curl -X POST http://localhost:3000/api/search \
  -H 'content-type: application/json' \
  -d '{ "scope":"units","text":"mountains","subject":"geography","keyStage":"ks4","minLessons":3 }'
```

NL search:

```bash
curl -X POST http://localhost:3000/api/search/nl \
  -H 'content-type: application/json' \
  -d '{ "q":"ks4 geography units about mountains with at least 3 lessons" }'
```

Tests to add: query struct validation, RRF determinism, highlight presence, OpenAPI builder.

### Phase C — OpenAPI + MCP surfacing

- Generate `/api/openapi.json` from Zod schemas.
- Serve `/api/docs` UI for humans.
- Emit MCP tools/resources/prompts for non‑admin operations.
- Keep admin tools excluded by default or flagged with `x-requires-api-key`.

### Phase D — Host & environment (deployment)

- Vercel project, Node runtime.
- Env (Prod/Preview): `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `OAK_API_KEY`, `SEARCH_API_KEY`; optional `AI_PROVIDER`, `OPENAI_API_KEY`.
- Smoke tests: `/api/index-oak`, `/api/rebuild-rollup`, `/api/search`, `/api/search/nl`.

---

## Acceptance criteria (API)

- Serverless ES ready: three indices exist with expected mappings and synonyms; smoke query succeeds.
- Indexing works end‑to‑end (no duplicate explosion; reasonable counts).
- Hybrid search: BM25 + semantic fused via RRF; snippets present; code in `src/lib/hybrid-search/` with tests.
- LLM optionality: structured works without LLM; NL returns 501 if disabled.
- OpenAPI: reflects public endpoints and schemas; validates.
- MCP: loadable tools/resources, non‑admin by default.

---

## Security

- Admin routes guarded by header `x-api-key`.
- Only server code reads sensitive env vars.
- NL search disabled unless `AI_PROVIDER=openai` + `OPENAI_API_KEY` present.
- Never call raw Oak HTTP; always use the SDK.

---

## Risks & mitigations (API)

- Oak API rate limits → batch with jitter/backoff; progress logs.
- Transcript size / ES payloads → keep rollup snippets ~300 chars; avoid large bulks.
- Serverless quirks → prefer small payloads; test on preview first.

---

## References

- Elasticsearch Serverless: `semantic_text`, RRF guidance.
- Oak SDK; project docs under `docs/` (SETUP, ARCHITECTURE, ROLLUP, SDK‑ENDPOINTS).
