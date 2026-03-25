# Semantic Search — Current (Next Up)

Queued work that is next to execute in post-merge sequencing.

When work starts, promote the selected plan into `../active/`.

## Critical Path to P0 Completion

```text
1. Error response classification          ✅ COMPLETE (2026-03-20)
2. Pre-reingest remediation                ✅ COMPLETE (2026-03-23)
3. F2 closure + P0 ingestion              ✅ Code + re-ingest COMPLETE (2026-03-24)
   Archived: ../archive/completed/f2-closure-and-p0-ingestion.execution.plan.md
   Production verified 2026-03-25. Plan archived:
   ../archive/completed/prod-search-assessment.execution.plan.md
```

## Queue

| Priority | Plan | Scope | Status |
|---|---|---|---|
| P0 (done) | [sequence-retrieval-architecture-followup.plan.md](./sequence-retrieval-architecture-followup.plan.md) | Restore SDK-owned 2-way RRF for sequences by populating `sequence_semantic` from ordered unit summaries via the shared unit semantic generator, with fail-fast ingest rules | ✅ Work items complete via [pre-reingest-remediation](../archive/completed/pre-reingest-remediation.execution.plan.md) |
| P0 (done) | [search-contract-followup.plan.md](./search-contract-followup.plan.md) | Lessons `threadSlug` field-integrity test; optional documented prod search smoke (not default CI) | ✅ Work items complete via [pre-reingest-remediation](../archive/completed/pre-reingest-remediation.execution.plan.md) |
| — | [codegen-schema-error-response-adaptation.plan.md](../archive/completed/codegen-schema-error-response-adaptation.plan.md) | Adapt sdk-codegen to handle upstream error responses | ✅ Archived (2026-03-20) |
| — | [error-response-classification.plan.md](../archive/completed/error-response-classification.plan.md) | Domain-aware error classification for documented 400/401/404 responses | ✅ Archived (2026-03-20) |
| P0 | [unified-versioned-ingestion.plan.md](./unified-versioned-ingestion.plan.md) | Reference lane for the underlying versioned-ingestion architecture; the active F2 closure plan is the operator source of truth for the remaining stage/validate/promote steps | 📋 Partially complete; final operator steps now run through the active F2 closure plan |
| P1+ | Future work — to be re-evaluated after P0 closure | | |

### Parked (re-evaluate after P0)

| Plan | Scope | Notes |
|---|---|---|
| [semantic-search-scheduled-refresh.operations.plan.md](./semantic-search-scheduled-refresh.operations.plan.md) | Deferred incremental/scheduled-refresh planning | ⏸️ Explicitly out of migration-complete scope |
| [bulk-metadata-quick-wins.execution.plan.md](./bulk-metadata-quick-wins.execution.plan.md) | Boundary 03 — bulk lesson/unit metadata for retrieval | 📋 Not started |
| [kg-alignment-audit.execution.plan.md](./kg-alignment-audit.execution.plan.md) | Evidence-first ontology/search overlap audit | 📋 Not started |
| [search-sdk-args-extraction.plan.md](./search-sdk-args-extraction.plan.md) | Search param builders/validation into SDK surface | 📋 Not started |
| [category-integration-remediation.md](./category-integration-remediation.md) | Category supplementation wiring | ✅ Superseded by F2 fix |
| [bulk_data_for_semantic_search.feature_request.md](./bulk_data_for_semantic_search.feature_request.md) | Bulk data enhancement requests | 📋 Supporting request |
| [m2-public-alpha-auth-rate-limits.execution.plan.md](./m2-public-alpha-auth-rate-limits.execution.plan.md) | Clerk migration + OAuth proxy rate limits | 📋 Ready |
| [keyword-definition-assets.execution.plan.md](./keyword-definition-assets.execution.plan.md) | Boundary 03 follow-on for keyword assets | 📋 Ready after bulk metadata |
| [thread-sequence-semantic-surfaces.execution.plan.md](./thread-sequence-semantic-surfaces.execution.plan.md) | Thread/sequence semantic enrichment | 📋 Ready after keyword assets |
| [kg-integration-quick-wins.plan.md](./kg-integration-quick-wins.plan.md) | Bounded Neo4j + Elasticsearch quick wins | 📋 Parent plan |

Strategic source backlog: [future/README.md](../future/README.md)
Active plan: [active/README.md](../active/README.md)
