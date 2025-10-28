# Oak Open Curriculum Semantic Search

A Next.js App Router workspace that ingests Oak Curriculum content via the official SDK, stores enriched documents across **four Elasticsearch Serverless indices**, and serves **server-side RRF** (lexical + semantic) queries with suggestions, facets, and observability telemetry. This project supersedes the SDK’s legacy search by providing canonical URLs, lesson-planning metadata, and robust zero-hit logging.

> All curriculum data flows through `@oaknational/oak-curriculum-sdk`; types are generated via `pnpm type-gen`.

---

## Primary endpoints

| Endpoint                                                           | Description                                                                                                                             |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/search`                                                 | Structured hybrid search (`scope` = `lessons` / `units` / `sequences`) returning highlights, facets, canonical URLs, zero-hit metadata. |
| `POST /api/search/nl`                                              | Natural-language wrapper; deterministically converts `{ q }` before delegating to `/api/search`. Returns `501` when `AI_PROVIDER=none`. |
| `POST /api/search/suggest`                                         | Suggestion/type-ahead endpoint backed by completion contexts and `search_as_you_type`. Includes cache/version hints.                    |
| `GET /api/index-oak`                                               | Admin ingestion (guarded by `SEARCH_API_KEY`); performs resilient batching and alias swaps.                                             |
| `GET /api/rebuild-rollup`                                          | Regenerates unit rollup snippets, updates completion payloads, bumps `SEARCH_INDEX_VERSION`.                                            |
| `GET /api/index-oak/status`                                        | Progress telemetry: processed counts, remaining batches, last error, index version.                                                     |
| `GET /api/openapi.json`, `GET /api/docs`                           | Generated OpenAPI contract and Redoc UI.                                                                                                |
| `POST /api/sdk/search-lessons`, `POST /api/sdk/search-transcripts` | SDK parity routes for regression comparison (feature-flagged).                                                                          |

All admin/status routes require `x-api-key: ${SEARCH_API_KEY}`.

---

## Technical highlights

- **Four indices**: `oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences` with `semantic_text`, completion contexts, highlight offsets, canonical URLs, and lesson-planning data.
- **Server-side RRF**: Lexical + semantic queries fused per scope; optional facets and highlights per definitive guide.
- **Suggestions**: Completion + `search_as_you_type` endpoints with cache tagging tied to `SEARCH_INDEX_VERSION`.
- **Observability**: Structured logging for ingestion batches, zero-hit events, cache version rotation; optional webhook for zero hits.
- **Caching**: Deterministic Data Cache keys `${SEARCH_INDEX_VERSION}|hash(payload)` with tag-based invalidation.
- **Type safety**: Generated SDK types + shared `parseSchema` helper for requests/responses, no unsafe assertions.
- **Documentation**: Authored guides in `docs/`, generated TypeDoc under `docs/api/`, OpenAPI served at `/api/openapi.json`.

---

## Directory overview

```text
apps/oak-open-curriculum-semantic-search/
├─ app/
│  ├─ api/
│  │  ├─ search/route.ts              # Structured server-side RRF
│  │  ├─ search/nl/route.ts           # NL → structured wrapper
│  │  ├─ search/suggest/route.ts      # Suggestion/type-ahead endpoint
│  │  ├─ index-oak/route.ts           # Admin ingestion
│  │  ├─ index-oak/status/route.ts    # Ingestion telemetry
│  │  ├─ rebuild-rollup/route.ts      # Rollup regeneration
│  │  └─ sdk/…                        # SDK parity routes
│  ├─ admin/page.tsx                  # Admin dashboard within the shared operations layout
│  ├─ natural_language_search/page.tsx# Natural-language search workspace (prompt-only)
│  ├─ structured_search/page.tsx      # Structured search workspace (filters + fixtures)
│  ├─ page.tsx                        # Landing page (hero + CTAs linking to search variants)
│  └─ ui/
│     ├─ landing/                     # Landing hero + CTA cards
│     ├─ client/                      # Search layout, fixtures toggle, shared controls
│     └─ operations/                  # OperationsLayout shared by admin and status routes
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

## UX surfaces & artefacts

The Phase 1 UX slice now exposes dedicated surfaces for landing, structured search, natural-language search, and operations tooling. Each surface is backed by deterministic fixtures, automated tests, and captured artefacts.

| Surface                              | Description                                                                                    | Test coverage                                                                                                                                                                                                     | Artefact evidence                                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Landing (`/`)                        | Hero messaging introducing hybrid search, CTA cards linking to both experiences.               | `app/ui/landing/LandingPage.integration.test.tsx`; `tests/visual/navigation.accessibility.spec.ts`.                                                                                                               | `test-artifacts/landing/2025-10-02/landing-light-xs.png`, `test-artifacts/landing/2025-10-02/landing-dark-md.png`.     |
| Structured (`/structured_search`)    | Condensed hero, structured form, deterministic fixtures with empty/error banners.              | `app/ui/search/SearchPageClient.integration.test.tsx`; `tests/visual/fixture-toggle.spec.ts`; `tests/visual/responsive-baseline.spec.ts`.                                                                         | `test-artifacts/structured/2025-10-02/responsive-baseline-Search-83ced-d-controls-stack-vertically-Google-Chrome.png`. |
| Natural (`/natural_language_search`) | Prompt-only flow with derived summary card validated against SDK schema.                       | `app/ui/NaturalSearch.unit.test.tsx`; `tests/visual/responsive-baseline.spec.ts` (natural fixtures).                                                                                                              | `test-artifacts/structured/2025-10-02/natural-hero-bp-md.png`.                                                         |
| Operations (`/admin`, `/status`)     | OperationsLayout with fixture banners, aria-live telemetry status, and platform outage alerts. | `app/admin/AdminPageClient.integration.test.tsx`; `app/ui/ops/admin/ZeroHitDashboard.accessibility.integration.test.tsx`; `app/status/StatusClient.integration.test.tsx`; `tests/visual/admin.telemetry.spec.ts`. | `test-results/responsive-baseline-Admin--02d41-ort-and-clears-stale-hashes-Google-Chrome/test-finished-1.png`.         |

Each artefact path is stored within the repository to maintain deterministic visual evidence for design reviews.

---

## Quick start (summary)

> For detailed instructions see `docs/SETUP.md`.

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment**

   ```bash
   cp apps/oak-open-curriculum-semantic-search/.env.example       apps/oak-open-curriculum-semantic-search/.env.local
   ```

   Populate the required variables:

   | Variable                       | Required | Notes                                                                             |
   | ------------------------------ | -------- | --------------------------------------------------------------------------------- |
   | `ELASTICSEARCH_URL`            | ✅       | Elasticsearch Serverless HTTPS endpoint                                           |
   | `ELASTICSEARCH_API_KEY`        | ✅       | API key with manage + search privileges                                           |
   | `OAK_API_KEY`                  | ✅       | Oak Curriculum SDK key (bearer tokens are not yet supported by the env validator) |
   | `SEARCH_API_KEY`               | ✅       | Shared secret that guards admin and status routes                                 |
   | `SEARCH_INDEX_VERSION`         | ✅       | Monotonic cache/version tag (update manually after every ingestion/rollup run)    |
   | `AI_PROVIDER`                  | ✅       | `openai` (default) or `none` to disable natural-language search                   |
   | `OPENAI_API_KEY`               | ➖       | Required when `AI_PROVIDER=openai`                                                |
   | `ZERO_HIT_WEBHOOK_URL`         | ➖       | Use a webhook endpoint or set to `none` to disable external delivery              |
   | `LOG_LEVEL`                    | ➖       | Structured logging level (`info` by default)                                      |
   | `SEARCH_INDEX_TARGET`          | ➖       | `primary` (default) or `sandbox` for alternate index namespaces                   |
   | `ZERO_HIT_PERSISTENCE_ENABLED` | ➖       | `true` to persist zero-hit events to Elasticsearch                                |

   Recommended local toggles:
   - `SEMANTIC_SEARCH_USE_FIXTURES=fixtures` enables deterministic fixtures for search and admin endpoints.
   - `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE=true` shows the fixture toggle in the UI.
   - `NEXT_DISABLE_DEV_ERRORS=1` hides the Next.js error overlay during Playwright runs.

3. **Run the standard quality gates**

   ```bash
   pnpm make   # install → type-gen → build → type-check → doc-gen → lint → format
   pnpm qg     # format-check → type-check → lint → markdownlint → unit/int/ui tests → smoke
   ```

4. **Bootstrap Elasticsearch (mappings, synonyms, indices)**

   ```bash
   ELASTICSEARCH_URL=... \
   ELASTICSEARCH_API_KEY=... \
   pnpm -C apps/oak-open-curriculum-semantic-search elastic:setup
   ```

5. **Start the dev server**

   ```bash
   pnpm -C apps/oak-open-curriculum-semantic-search dev
   ```

6. **Ingest content and rebuild rollups (supports fixtures)**

   ```bash
   curl "http://localhost:3000/api/index-oak" \
     -H "x-api-key: $SEARCH_API_KEY"

   curl "http://localhost:3000/api/rebuild-rollup" \
     -H "x-api-key: $SEARCH_API_KEY"

   curl "http://localhost:3000/api/index-oak/status" \
     -H "x-api-key: $SEARCH_API_KEY"
   ```

   Append `?fixtures=on|empty|error` to exercise the SDK-generated admin fixtures without touching Elasticsearch.

7. **Exercise search endpoints**

   Structured search:

   ```bash
   curl -X POST http://localhost:3000/api/search \
     -H 'content-type: application/json' \
     -d '{"scope":"units","text":"mountain formation","subject":"geography","keyStage":"ks4","facets":true}'
   ```

   Natural-language search (when `AI_PROVIDER` is not `none`):

   ```bash
   curl -X POST http://localhost:3000/api/search/nl \
     -H 'content-type: application/json' \
     -d '{"q":"Find KS4 geography units about mountains with at least three lessons"}'
   ```

   Suggestions:

   ```bash
   curl -X POST http://localhost:3000/api/search/suggest \
     -H 'content-type: application/json' \
     -d '{"prefix":"mount","scope":"lessons","subject":"geography","keyStage":"ks4"}'
   ```

   Add `?fixtures=` query parameters to any of the above endpoints to confirm deterministic data and cookie persistence.

## Observability & maintenance

- Monitor structured logs for ingestion retries, zero-hit counts, and cache version rotation.
- Update `SEARCH_INDEX_VERSION` whenever ingestion/rollup runs; call `revalidateTag` to purge cached results.
- Keep `scripts/synonyms.json` fresh; rerun `elastic:setup` after synonym or mapping changes.
- Regenerate OpenAPI and TypeDoc after schema updates with `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen` (this command updates both artefacts).
- Coordinate UI and documentation updates via the alignment refresh plan and associated GO.md tasks.

For deeper explanations see:

- `docs/ARCHITECTURE.md`
- `docs/INDEXING.md`
- `docs/QUERYING.md`
- `docs/ROLLUP.md`
- `docs/oak-curriculum-hybrid-search-definitive-guide.md`

Maintain this README alongside code changes to keep onboarding concise and accurate.
