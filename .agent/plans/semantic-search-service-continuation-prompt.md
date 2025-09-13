# Semantic Search Service — Continuation Prompt (Living Context)

_Last updated: 2025‑09‑13 (Europe/London)_

Purpose: Preserve essential working context so any agent can immediately continue the Oak Curriculum **hybrid search** project without re‑reading full threads. Pairs with the implementation plan `semantic-search-service-plan.md`. Keep this concise, current, and actionable.

---

## TL;DR (current state)

- **Workspace**: `apps/oak-open-curriculum-semantic-search` (Next.js 15, React 19, TS strict)
- **Search model**: Hybrid retrieval (BM25 + `semantic_text`) fused via **RRF**.
- **Indices (Elasticsearch Serverless)**:
  - `oak_lessons`: lesson metadata + full `transcript_text` + `lesson_semantic` (semantic_text).
  - `oak_units`: unit metadata (`lesson_count`, `lesson_ids`, filters).
  - `oak_unit_rollup`: short per‑lesson passages per unit + `unit_semantic`.
- **Endpoints**:
  - Structured: `POST /api/search` (LLM‑free)
  - Natural language: `POST /api/search/nl` → 501 if LLM disabled
  - Admin (x‑api‑key): `GET /api/index-oak`, `GET /api/rebuild-rollup`
  - SDK parity: `POST /api/sdk/search-lessons`, `POST /api/sdk/search-transcripts`
- **OpenAPI**: schema at `/api/openapi.json`, docs UI at `/api/docs`
- **SDK**: All data via `@oaknational/oak-curriculum-sdk`; runtime guards validate Subject/KeyStage
- **ES client**: Official `@elastic/elasticsearch`
- **UI/Health**: Canonical search page at `/` with header/nav/theme; `/healthz` route (ES, SDK, LLM)

---

## ENV (server‑side)

- `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`
- `OAK_API_KEY`
- `SEARCH_API_KEY` (admin routes)
- Optional LLM: `AI_PROVIDER=openai`, `OPENAI_API_KEY`

LLM optionality: `/api/search` never requires OpenAI. `/api/search/nl` returns `{ error: "LLM_DISABLED" }` with 501 when LLM is off.

---

## Files of interest

- **Indexing & search**
  - `app/api/index-oak/route.ts`, `app/api/rebuild-rollup/route.ts`
  - `src/lib/hybrid-search/{index,lessons,units,types}.ts`, `src/lib/run-hybrid-search.ts`
  - `app/api/search/route.ts`, `app/api/search/nl/route.ts`
  - `src/lib/query-parser.ts`
  - `src/lib/elastic-http.ts`, `src/lib/es-client.ts`, `src/lib/rrf.ts`
  - `src/adapters/{oak-adapter-sdk,sdk-guards}.ts`
- **OpenAPI**
  - `src/lib/openapi.ts`, `src/lib/openapi.register.ts`
  - `app/api/openapi.json/route.ts`, `app/api/docs/page.tsx`
- **Docs**
  - `docs/SETUP.md`, `docs/ARCHITECTURE.md`, `docs/ROLLUP.md`, `docs/SDK-ENDPOINTS.md`

---

## Rebase status

Completed. Branch aligned with `origin/main`; types/tools regenerated; lockfile re-resolved via `pnpm i`.

---

## Immediate next tasks

- Resolve linting issues in the semantic search app in line with `/.agent/directives-and-memory/rules.md` and `/docs/agent-guidance/typescript-practice.md`
- Resolve all other quality gates to the highest possible standards (install → type-gen → build → type-check → lint → docs:all → format → markdownlint → test → test:e2e) until green
- Commit and push; then review next steps and plan
- Follow-on: tests for hybrid-search and OpenAPI builder; Oak Components integration; Vercel deploy

---

## Invariants / non‑negotiables

- **SDK‑first**: All Oak data via `@oaknational/oak-curriculum-sdk`
- **Strict typing**: Zod + SDK guards; avoid unsafe assertions
- **No transcript duplication** in units: use rollup index
- **Security**: Admin endpoints guarded by `x-api-key`

---

## Handy commands

- Create indices (serverless):
  - `ELASTICSEARCH_URL=… ELASTICSEARCH_API_KEY=… pnpm -C apps/oak-open-curriculum-semantic-search run elastic:setup`
- Index + rollup:
  - `curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/index-oak`
  - `curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/rebuild-rollup`
- OpenAPI & docs:
  - Schema: `http://localhost:3000/api/openapi.json`
  - UI: `http://localhost:3000/api/docs`
- Search examples:
  - Structured: `POST /api/search` with `{ scope, text, subject, keyStage, minLessons }`
  - NL: `POST /api/search/nl` with `{ q }`
