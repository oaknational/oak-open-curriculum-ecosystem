# Semantic Search Service — Continuation Prompt (Living Context)

_Last updated: 2025‑09‑11 (Europe/London)_

Purpose: Preserve essential working context so any agent can immediately continue the Oak Curriculum **hybrid search** project without re‑reading full threads. Pairs with the implementation plan `semantic-search-service-plan.md`. Keep this concise, current, and actionable.

---

## TL;DR (current state)

- **Workspace**: `apps/oak-open-curriculum-semantic-search` (Next.js 15, React 19, TS strict)
- **Search model**: Hybrid retrieval (BM25 + `semantic_text`) fused via **RRF**.
- **Indices (Elasticsearch Serverless)**:
  - `oak_lessons`: lesson metadata + full `transcript_text` + `lesson_semantic` (semantic_text).
  - `oak_units`: unit metadata (`lesson_count`, `lesson_ids`, filters).
  - `oak_unit_rollup`: short per‑lesson passages per unit + `unit_semantic` (lets us highlight units without duplicating full transcripts).
- **Endpoints**:
  - Structured search (LLM‑free): `POST /api/search`.
  - Natural‑language search (LLM optional): `POST /api/search/nl` → returns 501 if LLM disabled.
  - Admin (guarded by `x-api-key`): `GET /api/index-oak`, `GET /api/rebuild-rollup`.
  - SDK parity: `POST /api/sdk/search-lessons`, `POST /api/sdk/search-transcripts`.
  - API docs: **UI** at `GET /api/docs`, **schema** at `GET /api/openapi.json` (OpenAPI 3.1 from Zod).
- **SDK**: All source data via `@oaknational/oak-curriculum-sdk` only (no raw HTTP). Runtime guards from SDK validate Subject/KeyStage. SDK parity routes now validate request bodies with Zod.
- **ES client**: Official `@elastic/elasticsearch` (`_search`, `_bulk`) with official client types in helpers.
- **Synonyms**: Updateable set `oak-syns`; analyzer `oak_text` = `lowercase` + `synonym_graph` (case‑insensitive matching). File: `scripts/synonyms.json`.

---

## ENV (server‑side)

Set these in `.env.local` for local dev; equivalent on Vercel for remote:

- `ELASTICSEARCH_URL` — Elastic Cloud Serverless endpoint (https://…).
- `ELASTICSEARCH_API_KEY` — ApiKey with index manage/search perms.
- `OAK_API_KEY` **or** `OAK_API_BEARER` — for Oak SDK.
- `SEARCH_API_KEY` — long random string; required for admin routes.
- `AI_PROVIDER` — `openai` **or** `none` (default `openai`).
- `OPENAI_API_KEY` — required **iff** `AI_PROVIDER=openai` (used only by `/api/search/nl`).

> LLM optionality: `/api/search` never requires OpenAI. `/api/search/nl` returns `{ error: "LLM_DISABLED" }` with 501 when LLM is off.

---

## Files of interest (workspace)

- **Elasticsearch**
  - `scripts/setup.sh` — idempotent synonyms + index creation (Serverless‑compatible).
  - `scripts/alias-swap.sh` — utility for future blue/green index swaps.
  - `scripts/synonyms.json` — curated starter synonyms (KS1–KS4, core subjects, geo/history/science themes).
  - `docs/ROLLUP.md` — rationale for rollup index.
- **Indexing & search**
  - `app/api/index-oak/route.ts` — SDK‑driven indexing of lessons/units.
  - `app/api/rebuild-rollup/route.ts` — derives unit rollups from existing docs.
  - `src/lib/hybrid-search/` — module for hybrid search:
    - `index.ts` — exports `runHybridSearch`
    - `lessons.ts` — lesson lexical/semantic queries + RRF fusion + highlights
    - `units.ts` — unit/rollup queries + fusion + rollup fallback mapping
    - `types.ts` — shared query/result types
    - `src/lib/run-hybrid-search.ts` — re-export shim for backwards compatibility
  - `app/api/search/route.ts` — **structured** endpoint; validates body; calls `runHybridSearch`.
  - `app/api/search/nl/route.ts` — **NL** endpoint; uses `parseQuery()` (Vercel AI SDK) → structured → `runHybridSearch`.
  - `src/lib/query-parser.ts` — LLM parser (Vercel AI SDK + OpenAI). Safe to bypass when LLM disabled.
  - `src/lib/elastic-http.ts` — typed wrappers around official client calls.
  - `src/lib/es-client.ts` — singleton client init.
  - `src/lib/rrf.ts` — reciprocal rank fusion.
  - `src/adapters/oak-adapter-sdk.ts` — SDK integration; strict guards.
  - `src/adapters/sdk-guards.ts` — re‑exports SDK guards; structural fallbacks.
- **API docs**
  - `src/lib/openapi.ts` — builds OpenAPI 3.1 doc from Zod and delegates path registrations to `src/lib/openapi.register.ts` (smaller helpers; no unsafe assertions).
  - `app/api/openapi.json/route.ts` — serves schema.
  - `app/api/docs/page.tsx` — Redoc UI (CDN) with link to `/api/openapi.json`.
- **Docs**
  - `docs/SETUP.md`, `docs/ARCHITECTURE.md`, `docs/README.md`, `docs/SDK-ENDPOINTS.md`.

---

## How to bootstrap (local)

1. **Install**
   - From repo root: `pnpm install`
2. **Env**
   - Copy: `cp apps/oak-open-curriculum-semantic-search/.env.example apps/oak-open-curriculum-semantic-search/.env.local`
   - Fill values (see ENV above).
3. **Create indices**
   - `ELASTICSEARCH_URL=… ELASTICSEARCH_API_KEY=… pnpm -C apps/oak-open-curriculum-semantic-search run elastic:setup`
4. **Run**
   - `pnpm -C apps/oak-open-curriculum-semantic-search dev`
5. **Index + rollup**
   - `curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/index-oak`
   - `curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/rebuild-rollup`
6. **Docs**
   - Schema: `http://localhost:3000/api/openapi.json`
   - UI: `http://localhost:3000/api/docs`
7. **Search examples**
   - Structured: `POST /api/search` with `{ "scope":"units", "text":"mountains", "subject":"geography", "keyStage":"ks4", "minLessons":3 }`.
   - NL (if enabled): `POST /api/search/nl` with `{ "q":"ks4 geography units about mountains with at least 3 lessons" }`.

---

## Invariants / non‑negotiables

- **SDK‑first**: All Oak data via `@oaknational/oak-curriculum-sdk` only.
- **Strict typing**: No `any`; use Zod + SDK guards; keep request/response schemas in sync with `src/lib/openapi.ts`. Avoid `as` assertions; prefer guards/narrowing.
- **No transcript duplication** in units: use rollup index for unit highlights.
- **Security**: Admin endpoints require `x-api-key: ${SEARCH_API_KEY}`; never expose admin tools by default.

---

## Open items / next steps

These align with the plan file phases—do not duplicate effort; check what’s already complete.

1. **Remote deploy (Vercel)**
   - Set env vars (prod/preview). Confirm Node runtime. Smoke test `/api/docs`, `/api/search`.
2. **Basic UI page** (`/search`)
   - Two tabs: Structured vs NL. Dropdowns for Subject/KeyStage using SDK allowed values. Result list with highlights.
3. **Admin UI** (`/admin`)
   - Buttons: Re‑index, Rebuild rollup. Show counts / last run.
4. **Workspace integration & tooling parity**
   - Add/verify Turbo wiring in `turbo.json` (build, lint, type-check, test, format)
   - Align workspace scripts with root conventions (`type-check`, `lint`, `dev`, `build`, `start`)
   - Ensure ESLint extends repo base + Next.js/React rules; add `tsconfig.lint.json`
   - Remove TS path aliases; use relative imports everywhere (including Vitest config)
   - Verify root-run gates pass for this workspace using the full ordered set
5. **MCP exposure**
   - Use `/api/openapi.json` to register tools: `searchStructured`, `searchNaturalLanguage`, `sdkSearchLessons`, `sdkSearchTranscripts`.
   - Consider prompt helpers (YAML or markdown presets).
6. **Oakify UI**
   - Integrate `@oaknational/oak-components` and theme provider; swap controls to Oak components.
7. **Testing**
   - Vitest: query validation; RRF determinism; highlight presence; indexing smoke (mock SDK).
8. **Ops niceties**

---

## Quick status signals

- OpenAPI present at `/api/openapi.json`; Redoc at `/api/docs`.
- Core hybrid search wired (`src/lib/run-hybrid-search.ts`), endpoints available.
- LLM path optional; if disabled, `/api/search/nl` returns 501 with error payload.

## Immediate next task

- Build the `/search` page using Oak Components (two tabs: Structured, NL). Use SDK guards for dropdown values. Ensure accessibility (`role="search"`, `aria-live` for results).
  - Add `/healthz` (checks ES + SDK; LLM availability when enabled). Add minimal logging.

---

## Handy commands

- Update synonyms (hot):
  - `curl -X PUT "$ELASTICSEARCH_URL/_synonyms/oak-syns" -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" -H "Content-Type: application/json" --data-binary @apps/oak-open-curriculum-semantic-search/scripts/synonyms.json`
  - Then (optional) close/open indices to refresh analyzers.
- Alias swap (future blue/green):
  - `bash apps/oak-open-curriculum-semantic-search/scripts/alias-swap.sh <from> <to> <alias>`

---

## Risks / watch‑outs

- **Rate limits**: Oak API; index in batches; respect jitter/backoff.
- **Size**: Transcripts can be large; keep rollup snippets short (~300 chars/lesson) for efficient highlights.
- **Serverless constraints**: Prefer small request bodies; avoid very large bulk batches.

---

## Contact points

- Source SDK: `@oaknational/oak-curriculum-sdk` (see project docs).
- This workspace: `apps/oak-open-curriculum-semantic-search`.

> If you are a new agent: start at **Docs → Setup**, verify **ENV**
> For initial setup, guide the user to run **elastic:setup**, then use the **Admin** endpoints to index and roll up. Demo **/api/docs**, then **/api/search** and **/api/search/nl**.
