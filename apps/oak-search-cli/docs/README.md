# Oak Curriculum Hybrid Search — Documentation

**Last Updated**: 2026-01-03

This directory contains authored documentation for the semantic search workspace. Generated TypeDoc output lives under `docs/api/` and must be regenerated with `pnpm -C apps/oak-search-cli doc-gen` whenever the API surface changes.

---

## Authored Guides

### Core Documentation

| Document                             | Purpose                                                              |
| ------------------------------------ | -------------------------------------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | High-level system overview: index topology, endpoints, observability |
| [SETUP.md](./SETUP.md)               | Environment configuration, Elasticsearch bootstrap, quality gates    |
| [INDEXING.md](./INDEXING.md)         | Resilient ingestion playbook, canonical payloads, alias rotation     |
| [QUERYING.md](./QUERYING.md)         | Canonical RRF queries, facets, suggestions, zero-hit logging         |
| [SYNONYMS.md](./SYNONYMS.md)         | Synonym expansion strategy and phrase boosting                       |

### Ingestion and Operations

| Document                                           | Purpose                                                    |
| -------------------------------------------------- | ---------------------------------------------------------- |
| [INGESTION-GUIDE.md](./INGESTION-GUIDE.md)         | Complete guide to ingesting curriculum data                |
| [ingestion-harness.md](./ingestion-harness.md)     | Repeatable ingestion workflow and harness                  |
| [ROLLUP.md](./ROLLUP.md)                           | Unit snippet generation, semantic copy, cache invalidation |
| [SDK-CACHING.md](./SDK-CACHING.md)                 | Redis-based SDK response caching                           |
| [ES_SERVERLESS_SETUP.md](./ES_SERVERLESS_SETUP.md) | Elasticsearch Serverless provisioning                      |

### Search Quality

| Document                                       | Purpose                                 |
| ---------------------------------------------- | --------------------------------------- |
| [IR-METRICS.md](./IR-METRICS.md)               | MRR, NDCG@10, zero-hit rate definitions |
| [NEW-SUBJECT-GUIDE.md](./NEW-SUBJECT-GUIDE.md) | Workflow for onboarding new subjects    |
| [DATA-COMPLETENESS.md](./DATA-COMPLETENESS.md) | Which fields are indexed completely     |

---

## Generated Artefacts

- `docs/api/` — TypeDoc output for the workspace
- `/api/openapi.json` — Generated automatically from Zod schemas; human-readable version at `/api/docs`

---

## Related ADRs

Architectural decisions relevant to this workspace:

| ADR                                                                                                       | Topic                                    |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md)  | SDK Domain Synonyms Source of Truth      |
| [ADR-064](../../../docs/architecture/architectural-decisions/064-elasticsearch-mapping-organization.md)   | Elasticsearch Index Mapping Organization |
| [ADR-067](../../../docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md) | SDK Generated Elasticsearch Mappings     |
| [ADR-076](../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md)        | ELSER-Only Embedding Strategy            |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)   | Fundamentals-First Search Strategy       |
| [ADR-084](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md)                | Phrase Query Boosting                    |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md)               | Batch-Atomic Ingestion                   |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)        | Bulk-First Ingestion Strategy            |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md)               | ES Bulk Retry Strategy                   |

---

## Editing Workflow

1. Update authored Markdown alongside code changes; ensure British spelling.
2. Run `pnpm -C apps/oak-search-cli doc-gen` to regenerate TypeDoc and verify zero warnings.
3. Run quality gates after documentation changes.

---

## Quality Gates

After documentation changes:

```bash
pnpm format:root                                             # Code and doc formatting
pnpm markdownlint:root                                       # Markdown linting
pnpm test                                                    # Ensure doc-related tests pass
pnpm -C apps/oak-search-cli doc-gen                          # TypeDoc + OpenAPI regeneration
```

Keep this README updated if new guides are added or responsibilities change.
