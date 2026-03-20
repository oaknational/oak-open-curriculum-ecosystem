# Semantic Search — Current (Next Up)

Queued work that is next to execute in post-merge sequencing.

When work starts, promote the selected plan into `../active/`.

## Critical Path to P0 Completion

The following sequence must complete in order for the semantic search
functionality to be fully validated and the unified versioned ingestion
lane closed out:

```text
1. Error response classification          ← NEXT SESSION
   Plan: error-response-classification.plan.md
   Scope: Upstream API experimentation, domain-aware error classification
          at SDK + MCP layers, validator-ordering fix
   Prerequisite: codegen error response adaptation (complete 2026-03-20)

2. F2 categoryMap wiring closure
   Scope: 3 blocking Barney findings, remaining reviewers
          (docs-adr, test-reviewer, elasticsearch-reviewer),
          prepare re-ingest operator command
   Prerequisite: pipeline green (done), error classification (for
                 confidence in error handling during re-ingest validation)

3. P0: Unified versioned ingestion — final operational phases
   Plan: unified-versioned-ingestion.plan.md
   Scope: manual admin stage, validate, promote, verify
   Prerequisite: F2 closure (category data must flow correctly in the
                 re-indexed data)
```

Once P0 is complete the search functionality is fully validated and the
versioned ingestion lane is closed. Work beyond P0 will be re-evaluated
at that point.

## Queue

| Priority | Plan | Scope | Status |
|---|---|---|---|
| — | [codegen-schema-error-response-adaptation.plan.md](./codegen-schema-error-response-adaptation.plan.md) | Adapt sdk-codegen to handle upstream error responses | ✅ Complete (2026-03-20) |
| — | [error-response-classification.plan.md](./error-response-classification.plan.md) | Domain-aware error classification for documented 400/401/404 responses | 🔬 Investigation needed |
| P0 | [unified-versioned-ingestion.plan.md](./unified-versioned-ingestion.plan.md) | Complete remaining operational cycle and closeout evidence from unified versioned ingestion lane | 📋 Partially complete, pending final phases |
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
In-progress execution: [active/README.md](../active/README.md)
