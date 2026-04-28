# Setup

**Last Updated**: 2026-02-10

Follow these steps to run the semantic search workspace end-to-end. All commands assume the repository root unless stated otherwise.

---

## 1. Configure Environment Variables

Create `apps/oak-search-cli/.env.local` and populate:

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
pnpm sdk-codegen
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
cd apps/oak-search-cli

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

## 5. Run Ingestion

```bash
cd apps/oak-search-cli

# Ingest specific subject (API mode)
pnpm es:ingest -- --api --subject maths --key-stage ks4

# Ingest all subjects (API mode)
pnpm es:ingest -- --api --all

# Dry run to preview (API mode)
pnpm es:ingest -- --api --subject maths --dry-run
```

---

## 6. Verify Search Quality

```bash
# Run smoke tests (hit live Elasticsearch directly)
pnpm test:smoke

# Run ground truth benchmarks
pnpm benchmark
```

Smoke tests require only `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY`.
Ingestion and admin commands require the full CLI environment.

---

## 7. Quality Gates (Run After Changes)

From repository root:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
```

---

## 8. Observability Reminders

- Monitor logs for bulk retries, zero-hit events, and ingestion durations.
- If using `ZERO_HIT_WEBHOOK_URL`, verify webhook deliveries after search verification.
- Update `SEARCH_INDEX_VERSION` whenever running ingestion/rollup to keep caches coherent.

---

## 9. Documentation Sync

After making structural changes, regenerate TypeDoc artefacts:

```bash
pnpm -C apps/oak-search-cli doc-gen
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
