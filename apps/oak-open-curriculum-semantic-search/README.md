# Oak Open Curriculum Semantic Search

A Next.js App Router workspace that ingests Oak Curriculum content via the official SDK, stores enriched documents across **four Elasticsearch Serverless indices**, and serves **server-side RRF** (lexical + semantic) queries with suggestions, facets, and observability telemetry. This project supersedes the SDK’s legacy search by providing canonical URLs, lesson-planning metadata, and robust zero-hit logging.

> All curriculum data flows through `@oaknational/oak-curriculum-sdk`; types are generated via `pnpm type-gen`.

---

## Primary endpoints

| Endpoint                                                           | Description                                                                                                                               |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/search`                                                 | Structured hybrid search (`scope` = `lessons`  `units`  `sequences`) returning highlights, facets, canonical URLs, zero-hit metadata. |
| `POST /api/search/nl`                                              | Natural-language wrapper; deterministically converts `{ q }` before delegating to `/api/search`. Returns `501` when `AI_PROVIDER=none`.   |
| `POST /api/search/suggest`                                         | Suggestion/type-ahead endpoint backed by completion contexts and `search_as_you_type`. Includes cache/version hints.                      |
| `POST /api/index-oak`                                              | Admin ingestion (guarded by `SEARCH_API_KEY`); performs resilient batching and alias swaps.                                               |
| `POST /api/rebuild-rollup`                                         | Regenerates unit rollup snippets, updates completion payloads, bumps `SEARCH_INDEX_VERSION`.                                              |
| `GET /api/index-oak/status`                                        | Progress telemetry: processed counts, remaining batches, last error, index version.                                                       |
| `GET /api/openapi.json`, `GET /api/docs`                           | Generated OpenAPI contract and Redoc UI.                                                                                                  |
| `POST /api/sdk/search-lessons`, `POST /api/sdk/search-transcripts` | SDK parity routes for regression comparison (feature-flagged).                                                                            |

All admin/status routes require `x-api-key: ${SEARCH_API_KEY}`.

---

## Technical highlights

- **Four indices**: `oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences` with `semantic_text`, completion contexts, highlight offsets, canonical URLs, and lesson-planning data.
- **Server-side RRF**: Lexical + semantic queries fused per scope; optional facets and highlights per definitive guide.
- **Suggestions**: Completion + `search_as_you_type` endpoints with cache tagging tied to `SEARCH_INDEX_VERSION`.
- **Observability**: Structured logging for ingestion batches, zero-hit events, cache version rotation; optional webhook for zero hits.
- **Caching**: Deterministic Data Cache keys `${SEARCH_INDEX_VERSION}|hash(payload)` with tag-based invalidation.
- **Type safety**: Zod schema validation, generated SDK types, no unsafe assertions.
- **Documentation**: Authored guides in `docs/`, generated TypeDoc under `docs/api/`, OpenAPI served at `/api/openapi.json`.

---

## Directory overview

```text
apps/oak-open-curriculum-semantic-search/
├─ app/
│  ├─ api/
│  │  ├─ search/route.ts              # Structured server-side RRF
│  │  ├─ search/nl/route.ts           # NL → structured wrapper
│  │  ├─ search/suggest/route.ts      # Suggestion/type-ahead (to implement per plan)
│  │  ├─ index-oak/route.ts           # Admin ingestion
│  │  ├─ index-oak/status/route.ts    # Ingestion telemetry
│  │  ├─ rebuild-rollup/route.ts      # Rollup regeneration
│  │  └─ sdk/…                        # SDK parity routes
│  ├─ admin/page.tsx                  # Admin dashboard (ingestion, zero hits)
│  └─ page.tsx                        # Search UI (structured + NL + sequences)
├─ src/
│  ├─ lib/queries/                    # RRF builders, facets, highlights
│  ├─ lib/ingestion/                  # Enriched transforms, batching helpers
│  ├─ lib/env.ts                      # Environment validation
│  ├─ lib/logging.ts                  # Structured telemetry helpers
│  └─ …
├─ scripts/                           # Elasticsearch setup + alias swap
└─ docs/                              # Authored guides (architecture, setup, indexing, …)
```

Consult `docs/ARCHITECTURE.md` for the full system diagram.

---

## Quick start (summary)

> For detailed instructions see `docs/SETUP.md`.

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment** – create `.env.local` with:

   | Variable                          | Required | Notes                                                      |
   | --------------------------------- | -------- | ---------------------------------------------------------- |
   | `ELASTICSEARCH_URL`               | ✅       | Elasticsearch Serverless HTTPS endpoint                    |
   | `ELASTICSEARCH_API_KEY`           | ✅       | API key with manage/search permissions                     |
   | `OAK_API_KEY` or `OAK_API_BEARER` | ✅       | SDK authentication (mutually exclusive)                    |
   | `SEARCH_API_KEY`                  | ✅       | Guards admin/status routes                                 |
   | `SEARCH_INDEX_VERSION`            | ✅       | Monotonic version used for cache tags (e.g. `v2025-03-16`) |
   | `ZERO_HIT_WEBHOOK_URL`            | ➖       | Optional webhook (`none` to disable)                       |
   | `LOG_LEVEL`                       | ➖       | Default `info`                                             |
   | `AI_PROVIDER`                     | ➖       | `openai` (default) or `none`                               |
   | `OPENAI_API_KEY`                  | ➖       | Required when `AI_PROVIDER=openai`                         |

3. **Bootstrap Elasticsearch**

   ```bash
   ELASTICSEARCH_URL=... ELASTICSEARCH_API_KEY=... \
   pnpm -C apps/oak-open-curriculum-semantic-search elastic:setup
   ```

4. **Run the dev server**

   ```bash
   pnpm -C apps/oak-open-curriculum-semantic-search dev
   ```

5. **Ingest content & rollups (admin calls)**

   ```bash
   curl -X POST http://localhost:3000/api/index-oak \
     -H "x-api-key: $SEARCH_API_KEY"

   curl -X POST http://localhost:3000/api/rebuild-rollup \
     -H "x-api-key: $SEARCH_API_KEY"

   curl http://localhost:3000/api/index-oak/status \
     -H "x-api-key: $SEARCH_API_KEY"
   ```

6. **Exercise endpoints**
   - Structured search (`/api/search`), natural language (`/api/search/nl`), suggestions (`/api/search/suggest`).
   - Observe logs for zero-hit events and ingestion telemetry.

7. **Quality gates**

   ```bash
   pnpm format
   pnpm type-check
   pnpm lint
   pnpm test
   pnpm build
   pnpm -C apps/oak-open-curriculum-semantic-search doc-gen
   ```

   Record outcomes in your GO.md review entries.

---

## Observability & maintenance

- Monitor structured logs for ingestion retries, zero-hit counts, and cache version rotation.
- Update `SEARCH_INDEX_VERSION` whenever ingestion/rollup runs; call `revalidateTag` to purge cached results.
- Keep `scripts/synonyms.json` fresh; rerun `elastic:setup` after synonym or mapping changes.
- Regenerate OpenAPI (`pnpm make openapi`) and TypeDoc (`pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`) after schema updates.
- Coordinate UI and documentation updates via the alignment refresh plan and associated GO.md tasks.

For deeper explanations see:

- `docs/ARCHITECTURE.md`
- `docs/INDEXING.md`
- `docs/QUERYING.md`
- `docs/ROLLUP.md`
- `docs/oak-curriculum-hybrid-search-definitive-guide.md`

Maintain this README alongside code changes to keep onboarding concise and accurate.
