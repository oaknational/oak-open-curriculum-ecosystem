# Semantic Search — Navigation

**Last Updated**: 2026-04-19

## Start Here

- Purpose: explore how hybrid semantic search works in conjunction with APIs,
  MCP, MCP Apps, and Oak knowledge graphs so AI education products can find,
  explain, and compose curriculum resources from natural-language intent.
- Session entry: [semantic-search.prompt.md](../../prompts/semantic-search/archive/semantic-search.prompt.md)
- Knowledge-graph hub: [../knowledge-graph-integration/README.md](../knowledge-graph-integration/README.md)
- Strategic sequence: [roadmap.md](roadmap.md)
- Research index: [research-index.md](research-index.md)
- Cross-boundary ontology report:
  [../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md](../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md)
  (important because the ontology is not a search-only asset)
- Graph-serving architecture research note:
  [../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md](../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md)
  (use this when deciding whether a live graph platform is needed at all,
  or whether search should consume ontology projections directly)
- Fresh-perspective follow-on:
  [../knowledge-graph-integration/future/ontology-repo-fresh-perspective-review.plan.md](../knowledge-graph-integration/future/ontology-repo-fresh-perspective-review.plan.md)
  (use this when you need to re-open the ontology repo without letting
  semantic search become the default frame)
- Direct-use and serving-platform comparison plan:
  [../knowledge-graph-integration/future/direct-ontology-use-and-graph-serving-prototypes.plan.md](../knowledge-graph-integration/future/direct-ontology-use-and-graph-serving-prototypes.plan.md)
  (use this when the question is `neither`, `Neo4j`, `Stardog`, or `both`,
  rather than just "how should search consume graph context?")

## Active

No active plans. See [active/README.md](active/README.md).

Recently archived:

- [archive/completed/prod-search-assessment.execution.plan.md](archive/completed/prod-search-assessment.execution.plan.md) — F1/F2 verified in production (2026-03-25)

## Current Queue

- [current/unified-versioned-ingestion.plan.md](current/unified-versioned-ingestion.plan.md)
- [current/sequence-retrieval-architecture-followup.plan.md](current/sequence-retrieval-architecture-followup.plan.md) (locked recipe; executing via remediation plan)
- [current/search-contract-followup.plan.md](current/search-contract-followup.plan.md) (S4/S5 source; executing via remediation plan)
- [current/semantic-search-scheduled-refresh.operations.plan.md](current/semantic-search-scheduled-refresh.operations.plan.md) (deferred; out of migration-complete scope)
- [current/bulk-metadata-quick-wins.execution.plan.md](current/bulk-metadata-quick-wins.execution.plan.md)
- [../knowledge-graph-integration/current/kg-alignment-audit.execution.plan.md](../knowledge-graph-integration/current/kg-alignment-audit.execution.plan.md)
- [current/search-sdk-args-extraction.plan.md](current/search-sdk-args-extraction.plan.md)
- [current/category-integration-remediation.md](current/category-integration-remediation.md) (superseded by the F2 fix; retained for traceability)
- [current/bulk_data_for_semantic_search.feature_request.md](current/bulk_data_for_semantic_search.feature_request.md)
- [current/m2-public-alpha-auth-rate-limits.execution.plan.md](current/m2-public-alpha-auth-rate-limits.execution.plan.md)
- [current/keyword-definition-assets.execution.plan.md](current/keyword-definition-assets.execution.plan.md)
- [current/thread-sequence-semantic-surfaces.execution.plan.md](current/thread-sequence-semantic-surfaces.execution.plan.md)
- [../knowledge-graph-integration/current/kg-integration-quick-wins.plan.md](../knowledge-graph-integration/current/kg-integration-quick-wins.plan.md)

## Future (Strategic)

- [future/curriculum-nlp-processing-workspace.md](future/curriculum-nlp-processing-workspace.md) — Python NLP workspace for ML-based entity extraction, semantic transcript compression, and relationship mining from bulk curriculum data

## Key Completed Evidence

- [archive/completed/comprehensive-field-integrity-integration-tests.execution.plan.md](archive/completed/comprehensive-field-integrity-integration-tests.execution.plan.md)
- [archive/completed/search-cli-sdk-boundary-migration.execution.plan.md](archive/completed/search-cli-sdk-boundary-migration.execution.plan.md)
- [archive/completed/cli-robustness.plan.md](archive/completed/cli-robustness.plan.md)
- [archive/completed/blue-green-reindex.execution.plan.md](archive/completed/blue-green-reindex.execution.plan.md)
- [archive/completed/semantic-search-recovery-and-guardrails.execution.plan.md](archive/completed/semantic-search-recovery-and-guardrails.execution.plan.md)
- [archive/completed/semantic-search-ingest-runbook.md](archive/completed/semantic-search-ingest-runbook.md)
- [archive/completed/mcp-result-pattern-unification.execution.plan.md](archive/completed/mcp-result-pattern-unification.execution.plan.md)
- [archive/completed/sdk-workspace-separation.md](archive/completed/sdk-workspace-separation.md)
- [archive/completed/search-dispatch-type-safety.md](archive/completed/search-dispatch-type-safety.md)
- [archive/completed/search-results-quality.md](archive/completed/search-results-quality.md) ([ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md))

## Directory Map

- Active: [active/README.md](active/README.md)
- Current: [current/README.md](current/README.md)
- Future: [future/README.md](future/README.md)
- Archive: [archive/completed/](archive/completed/)
- Completed index: [../completed-plans.md](../completed-plans.md)

## Foundation (Mandatory)

1. [principles.md](../../directives/principles.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)
