# Oak Curriculum Hybrid Search — App Workspace

This workspace hosts the Next.js service that powers Oak’s hybrid (lexical + semantic) search. It indexes lessons, units, and sequences into **Elasticsearch Serverless**, fuses BM25 with `semantic_text` using **server-side Reciprocal Rank Fusion (RRF)**, and serves structured or natural language queries with teacher-centric highlights.

## Key Capabilities

- **Hybrid search per scope** (`lessons`, `units`, `sequences`) with server-side RRF combining `multi_match` and `semantic` queries.
- **Teacher-tuned signals** drawn from the Oak Curriculum SDK: curated lesson metadata, rollup snippets, canonical URLs, and validated filters.
- **Unit rollup index** (`oak_unit_rollup`) that stores short per-lesson snippets, enabling semantic unit recall without duplicating transcripts.
- **Type-ahead and suggestions** via `search_as_you_type` sub-fields and completion `title_suggest` contexts (`subject`, `key_stage`).
- **Admin automation** for indexing (`/api/index-oak`) and rollup rebuilds (`/api/rebuild-rollup`) secured by `SEARCH_API_KEY`.
- **Optional natural language endpoint** (`/api/search/nl`) that translates `{ q }` with an LLM when `AI_PROVIDER=openai`; otherwise the structured route remains available.
- **OpenAPI + Redoc docs** generated from Zod schemas (`/api/openapi.json`, `/api/docs`).

Refer to `ARCHITECTURE.md` for a deeper architectural overview and `oak-curriculum-hybrid-search-definitive-guide.md` for the authoritative reference.

## Getting Started

1. **Set environment variables** – copy `.env.example` to `.env.local` and populate the values described in `SETUP.md`.
2. **Install dependencies** – `pnpm install` (from the repository root).
3. **Bootstrap Elasticsearch** – run the scripted setup to create indices, analysers, and synonyms.

   ```bash
   ELASTICSEARCH_URL=... ELASTICSEARCH_API_KEY=... pnpm -C apps/oak-open-curriculum-semantic-search elastic:setup
   ```

4. **Index content** – start the Next.js dev server (`pnpm -C apps/oak-open-curriculum-semantic-search dev`) and call:

   ```bash
   curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/index-oak
   curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/rebuild-rollup
   ```

5. **Query the service** – send structured or natural language requests (examples below).

## Example Requests

### Structured units search

```bash
curl -X POST http://localhost:3000/api/search \
  -H 'content-type: application/json' \
  -d '{
    "scope": "units",
    "text": "mountains",
    "subject": "geography",
    "keyStage": "ks4",
    "minLessons": 3
  }'
```

### Natural language search (if enabled)

```bash
curl -X POST http://localhost:3000/api/search/nl \
  -H 'content-type: application/json' \
  -d '{ "q": "Which KS4 geography units with at least three lessons cover mountains?" }'
```

If LLM support is disabled (`AI_PROVIDER=none` or no `OPENAI_API_KEY`), the NL endpoint returns `501` with `{ "error": "LLM_DISABLED" }` while the structured search remains available.

## Documentation & Tooling

- **Authoritative guide:** `docs/oak-curriculum-hybrid-search-definitive-guide.md`
- **Setup instructions:** `docs/SETUP.md`
- **Rollup detail:** `docs/ROLLUP.md`
- **SDK parity endpoints:** `docs/SDK-ENDPOINTS.md`
- **TypeDoc output:** `docs/api/` (generated via `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`)

## Maintenance Checklist

- Refresh synonyms with `scripts/synonyms.json` → `PUT /_synonyms/oak-syns` whenever vocabulary updates.
- Schedule nightly re-index jobs (index + rollup) to stay in sync with the Oak Curriculum API.
- Monitor logs for slow queries, zero-hit searches, and bulk indexing errors; adjust analyser settings or metadata accordingly.
- For mapping changes, create new indices and swap aliases to avoid downtime.
