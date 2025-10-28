# Setup

Follow these steps to run the semantic search service end-to-end. All commands assume the repository root unless stated otherwise. Always follow GO.md: record ACTION/REVIEW pairs and ground every third task.

## 1. Configure environment variables

Create `apps/oak-open-curriculum-semantic-search/.env.local` and populate:

```env
# Elasticsearch
ELASTICSEARCH_URL=https://...               # Serverless HTTPS endpoint
ELASTICSEARCH_API_KEY=...                   # API key with manage + search privileges

# Oak Curriculum access
OAK_API_KEY=...                             # SDK key (bearer tokens are not yet supported by the env validator)

# Admin + observability
SEARCH_API_KEY=...                          # Shared secret for admin/status routes
SEARCH_INDEX_VERSION=v2025-03-16            # Monotonic version tag for cache invalidation
ZERO_HIT_WEBHOOK_URL=https://... | none     # Optional webhook for zero-hit telemetry
LOG_LEVEL=info                              # Structured logging level
SEARCH_INDEX_TARGET=primary | sandbox       # Optional alternate namespace (defaults to primary)
ZERO_HIT_PERSISTENCE_ENABLED=false          # true to persist zero-hit events

# Natural language search
AI_PROVIDER=openai | none                   # Choose 'none' to disable NL endpoint
OPENAI_API_KEY=...                          # Required when AI_PROVIDER=openai

# Fixture toggles
SEMANTIC_SEARCH_USE_FIXTURES=fixtures       # fixtures | fixtures-empty | fixtures-error | live
NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE=true      # Controls fixture toggle visibility
NEXT_DISABLE_DEV_ERRORS=1                   # Optional: hide the Next.js dev overlay (useful for Playwright)
```

Environment validation (`src/lib/env.ts`) enforces these rules; run unit tests after editing env handling.

## 2. Install dependencies

```bash
pnpm install
```

## 3. Run the standard quality gates

```bash
pnpm make
pnpm qg
```

## 4. Bootstrap Elasticsearch (mappings, synonyms, indices)

```bash
ELASTICSEARCH_URL=... \
ELASTICSEARCH_API_KEY=... \
pnpm -C apps/oak-open-curriculum-semantic-search elastic:setup
```

This script:

- Creates/updates the `oak-syns` synonym set.
- Applies index templates/settings (analysers, normalisers, `highlight.max_analyzed_offset`).
- Creates all four indices: `oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences`.
- Verifies completion contexts and `semantic_text` mappings.

## 5. Start the dev server

```bash
pnpm -C apps/oak-open-curriculum-semantic-search dev
```

The server uses App Router with SSR theming; logs appear in the terminal for observability events.

## 6. Run ingestion and rollup (admin endpoints)

Admin endpoints require `x-api-key: $SEARCH_API_KEY` and should run in the target deployment (e.g. Vercel). For local testing:

```bash
curl "http://localhost:3000/api/index-oak" \
  -H "x-api-key: $SEARCH_API_KEY"

curl "http://localhost:3000/api/rebuild-rollup" \
  -H "x-api-key: $SEARCH_API_KEY"
```

These endpoints:

- Fetch lessons, units, sequences via the SDK and perform resilient bulk indexing.
- Regenerate unit rollups with lesson-planning snippets and canonical URLs.
- Rotate aliases and bump `SEARCH_INDEX_VERSION` (ensure environment store updated).
- Trigger cache invalidation and structured logging.

Monitor progress using the status endpoint:

```bash
curl http://localhost:3000/api/index-oak/status \
  -H "x-api-key: $SEARCH_API_KEY"
```

The response reports processed counts, remaining batches, last error, and current index version. Append `?fixtures=on|empty|error` to any admin endpoint to use SDK-generated fixtures without mutating Elasticsearch.

## 7. Verify search endpoints

Structured search:

```bash
curl -X POST http://localhost:3000/api/search \
  -H 'content-type: application/json' \
  -d '{
    "scope": "units",
    "text": "mountain formation",
    "subject": "geography",
    "keyStage": "ks4",
    "minLessons": 3,
    "facets": true
  }'
```

Natural-language search (if `AI_PROVIDER` ≠ `none`):

```bash
curl -X POST http://localhost:3000/api/search/nl \
  -H 'content-type: application/json' \
  -d '{ "q": "Find KS4 geography units about mountains with at least three lessons" }'
```

Suggestion endpoint:

```bash
curl -X POST http://localhost:3000/api/search/suggest \
  -H 'content-type: application/json' \
  -d '{ "prefix": "mount", "scope": "lessons", "subject": "geography", "keyStage": "ks4" }'
```

## 8. Quality gates (run after changes)

```bash
pnpm make
pnpm qg
```

Record results in your GO.md review log; remediate failures immediately. For deployment, ensure Vercel environment variables match `.env.local` (excluding secrets committed to source control) and rerun admin endpoints after each deploy.

## 9. Observability reminders

- Monitor logs for bulk retries, zero-hit events, and ingestion durations.
- If using `ZERO_HIT_WEBHOOK_URL`, verify webhook deliveries after search verification.
- Update `SEARCH_INDEX_VERSION` whenever running ingestion/rollup to keep caches coherent.

## 10. Documentation sync

After making structural changes, update authored docs and README via the documentation plan and regenerate OpenAPI/TypeDoc artefacts.

By following these steps you will have a workspace aligned with the definitive architecture and ready for further development or demonstration.
