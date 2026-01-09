# Setup

**Last Updated**: 2026-01-03

Follow these steps to run the semantic search service end-to-end. All commands assume the repository root unless stated otherwise.

---

## 1. Configure Environment Variables

Create `apps/oak-open-curriculum-semantic-search/.env.local` and populate:

```env
# Elasticsearch
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here

# Oak Curriculum access
OAK_API_KEY=your_oak_api_key_here

# Admin + observability
SEARCH_API_KEY=your_search_api_key_here
SEARCH_INDEX_TARGET=primary | sandbox       # Index namespace (defaults to primary)
LOG_LEVEL=info                              # Structured logging level
ZERO_HIT_WEBHOOK_URL=https://... | none     # Optional webhook for zero-hit telemetry
ZERO_HIT_PERSISTENCE_ENABLED=false          # true to persist zero-hit events

# Natural language search (optional)
AI_PROVIDER=openai | none                   # Choose 'none' to disable NL endpoint
OPENAI_API_KEY=your_openai_api_key_here

# Development
SEMANTIC_SEARCH_USE_FIXTURES=fixtures       # fixtures | fixtures-empty | fixtures-error | live
NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE=true      # Controls fixture toggle visibility
```

Environment validation (`src/lib/env.ts`) enforces these rules; run unit tests after editing env handling.

---

## 2. Install Dependencies

```bash
pnpm install
```

---

## 3. Run Quality Gates

From the repository root:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
```

---

## 4. Bootstrap Elasticsearch (Mappings, Synonyms, Indices)

```bash
cd apps/oak-open-curriculum-semantic-search

ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
pnpm es:setup
```

This script:

- Creates/updates the `oak-syns` synonym set
- Applies index templates/settings (analysers, normalisers, `highlight.max_analyzed_offset`)
- Creates all seven indices: `oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_threads`, `oak_sequences`, `oak_sequence_facets`, `oak_meta`
- Verifies completion contexts and `semantic_text` mappings

---

## 5. Start the Dev Server

```bash
pnpm -C apps/oak-open-curriculum-semantic-search dev
```

The server uses App Router with SSR theming; logs appear in the terminal for observability events.

---

## 6. Run Ingestion

### Option A: CLI Ingestion (Recommended)

```bash
cd apps/oak-open-curriculum-semantic-search

# Ingest specific subject
pnpm es:ingest-live -- --subject maths --key-stage ks4

# Ingest all subjects
pnpm es:ingest-live -- --all

# Dry run to preview
pnpm es:ingest-live -- --subject maths --dry-run
```

### Option B: Admin Endpoints

Admin endpoints require `x-api-key: $SEARCH_API_KEY`:

```bash
curl "http://localhost:3003/api/index-oak" \
  -H "x-api-key: $SEARCH_API_KEY"

curl "http://localhost:3003/api/rebuild-rollup" \
  -H "x-api-key: $SEARCH_API_KEY"
```

Monitor progress:

```bash
curl http://localhost:3003/api/index-oak/status \
  -H "x-api-key: $SEARCH_API_KEY"
```

---

## 7. Verify Search Endpoints

Structured search:

```bash
curl -X POST http://localhost:3003/api/search \
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
curl -X POST http://localhost:3003/api/search/nl \
  -H 'content-type: application/json' \
  -d '{ "q": "Find KS4 geography units about mountains with at least three lessons" }'
```

Suggestion endpoint:

```bash
curl -X POST http://localhost:3003/api/search/suggest \
  -H 'content-type: application/json' \
  -d '{ "prefix": "mount", "scope": "lessons", "subject": "geography", "keyStage": "ks4" }'
```

---

## 8. Quality Gates (Run After Changes)

From repository root:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
```

---

## 9. Observability Reminders

- Monitor logs for bulk retries, zero-hit events, and ingestion durations.
- If using `ZERO_HIT_WEBHOOK_URL`, verify webhook deliveries after search verification.
- Update `SEARCH_INDEX_VERSION` whenever running ingestion/rollup to keep caches coherent.

---

## 10. Documentation Sync

After making structural changes, update authored docs and regenerate OpenAPI/TypeDoc artefacts:

```bash
pnpm -C apps/oak-open-curriculum-semantic-search doc-gen
```

---

## Related Documentation

| Document                                           | Purpose                               |
| -------------------------------------------------- | ------------------------------------- |
| [ES_SERVERLESS_SETUP.md](./ES_SERVERLESS_SETUP.md) | Elasticsearch Serverless provisioning |
| [INGESTION-GUIDE.md](./INGESTION-GUIDE.md)         | Complete ingestion guide              |
| [SDK-CACHING.md](./SDK-CACHING.md)                 | Redis-based SDK response caching      |

## Related ADRs

| ADR                                                                                                | Topic                         |
| -------------------------------------------------------------------------------------------------- | ----------------------------- |
| [ADR-076](../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) | ELSER-Only Embedding Strategy |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-First Ingestion Strategy |
