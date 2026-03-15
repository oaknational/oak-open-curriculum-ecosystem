# Semantic Search — Current (Next Up)

Queued work that is next to execute in post-merge sequencing.

When work starts, promote the selected plan into `../active/`.

## Queue

| Priority | Plan | Scope | Status |
|---|---|---|---|
| P0 | [unified-versioned-ingestion.plan.md](./unified-versioned-ingestion.plan.md) | Complete remaining operational cycle and closeout evidence from unified versioned ingestion lane | 📋 Partially complete, pending final phases |
| P1 | [semantic-search-scheduled-refresh.operations.plan.md](./semantic-search-scheduled-refresh.operations.plan.md) | Deferred incremental/scheduled-refresh planning lane (explicitly out of migration-complete scope) | ⏸️ Deferred |
| P2 | [bulk-metadata-quick-wins.execution.plan.md](./bulk-metadata-quick-wins.execution.plan.md) | Boundary 03 — preserve and widen low-risk bulk lesson/unit metadata for downstream retrieval work | 📋 Not started |
| P3 | [kg-alignment-audit.execution.plan.md](./kg-alignment-audit.execution.plan.md) | Evidence-first ontology/search overlap audit before broader graph integration | 📋 Not started |
| P4 | [search-sdk-args-extraction.plan.md](./search-sdk-args-extraction.plan.md) | Move search param builders/validation/error formatting into SDK canonical surface | 📋 Not started |
| P5 | [category-integration-remediation.md](./category-integration-remediation.md) | Wire category supplementation through bulk ingestion orchestration | 📋 Not started |
| P6 | [bulk_data_for_semantic_search.feature_request.md](./bulk_data_for_semantic_search.feature_request.md) | Bulk data enhancement requests and API-team dependency tracker | 📋 Supporting request |
| P7 | [m2-public-alpha-auth-rate-limits.execution.plan.md](./m2-public-alpha-auth-rate-limits.execution.plan.md) | Canonical blocker execution for production Clerk migration + OAuth proxy edge rate limits | 📋 Ready |
| P8 | [keyword-definition-assets.execution.plan.md](./keyword-definition-assets.execution.plan.md) | Boundary 03 follow-on for keyword definition assets | 📋 Ready after bulk metadata quick wins |
| P9 | [thread-sequence-semantic-surfaces.execution.plan.md](./thread-sequence-semantic-surfaces.execution.plan.md) | Boundary 04 follow-on for thread/sequence semantic enrichment | 📋 Ready after P8 |
| P10 | [kg-integration-quick-wins.plan.md](./kg-integration-quick-wins.plan.md) | Parent plan for remaining bounded Neo4j + Elasticsearch quick wins | 📋 Parent plan |

Reclassification note:

- Pending/not-started plans were moved from `active/` to this queue.
- Active execution is intentionally narrowed to recovery and operator-run runbook only.

Strategic source backlog: [future/README.md](../future/README.md)  
In-progress execution: [active/README.md](../active/README.md)
