# Semantic Search — Active

Executable plans currently in progress.

| Priority | Plan | Scope | Status |
|---|---|---|---|
| A0 | [semantic-search-recovery-and-guardrails.execution.plan.md](./semantic-search-recovery-and-guardrails.execution.plan.md) | Incident recovery execution plan covering metadata-alias coherence repair, salvage promotion, lifecycle invariant enforcement, test-doctrine/type-discipline remediation, and anti-recurrence guardrails | 🟢 In progress (primary active lane; Phase 0/1 complete, Phase 2/3 in flight, Phase 4 pending with comprehensive review cycle) |
| A0.1 | [semantic-search-ingest-runbook.md](./semantic-search-ingest-runbook.md) | Operator-run lifecycle ingest runbook with deterministic stop/go checkpoints and failure branches | 🔴 Active |
| A0.3 | [semantic-search-scheduled-refresh.operations.plan.md](./semantic-search-scheduled-refresh.operations.plan.md) | Incremental-first scheduled refresh with per-document fingerprinting, Bulk API partial-update optimisation for semantic\_text fields, and full re-ingest fallback | 🟡 Planning |
| A1 | [unified-versioned-ingestion.plan.md](./unified-versioned-ingestion.plan.md) | Unify bulk ingestion, fix layer boundaries, enable blue/green lifecycle (ADR-130) | 🟢 Active |
| A2 | [search-sdk-args-extraction.plan.md](./search-sdk-args-extraction.plan.md) | Move param builders, scope validation, and error formatting into Search SDK | 🟡 Planning |
| A3 | [bulk-metadata-quick-wins.execution.plan.md](./bulk-metadata-quick-wins.execution.plan.md) | Boundary 03 — preserve and widen low-risk bulk lesson/unit metadata for later asset and retrieval work | 🟢 Active |
| A4 | [kg-alignment-audit.execution.plan.md](./kg-alignment-audit.execution.plan.md) | Audit measured overlap between ontology graph entities and search-facing curriculum records before broader graph integration | 🟢 Active |
| A5 | [category-integration-remediation.md](./category-integration-remediation.md) | Wire existing category supplementation infrastructure through the bulk ingestion orchestration layer | 🟡 Planning |

`semantic-search.prompt.md` is the standalone-ready session entry for the next
session. Follow its recovery-first ordering and operator-run ingest protocol.

`bulk-metadata-quick-wins.execution.plan.md` is the standalone-ready session
entry for the current Boundary 03 workstream.

`kg-alignment-audit.execution.plan.md` is the standalone-ready session entry
for the first ontology/search graph-enablement workstream.

`semantic-search-recovery-and-guardrails.execution.plan.md` is the
authoritative anti-recurrence execution lane for restoring metadata-alias
coherence and adding lifecycle fail-fast guardrails.

The next-session remediation tranche is authored in
`semantic-search-recovery-and-guardrails.execution.plan.md` Task 2.3, with
review/gate closure authored in Phase 4.

Next session starts with a full reviewer pass and iterative fix/re-review cycle
before additional implementation.

Continue from first incomplete phase; do not replay completed recovery phases
unless new regression evidence appears.

`cli-robustness.plan.md` remains available as supporting incident evidence
and residual closure context, but is no longer the primary active lane.

`semantic-search-scheduled-refresh.operations.plan.md` is the
authoritative operations lane for scheduled refreshes using
incremental Bulk API updates as the primary path and full re-ingest
(stage -> validate -> promote) as the fallback for mapping changes
and recovery. It depends on recovery-lane coherence fixes landing first.

`semantic-search-ingest-runbook.md` is the operator-run execution checklist for
first successful lifecycle proof (`validate-aliases` ->
`versioned-ingest` -> `validate-aliases`) and closeout sequencing.

The boundary migration plan is archived. Boundary doctrine is anchored in
[ADR-134](../../../../docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md).

## Reference Documents

- [bulk_data_for_semantic_search.feature_request.md](./bulk_data_for_semantic_search.feature_request.md) — bulk download enhancement requests for the API team

## Archived

- [blue-green-reindex.execution.plan.md](../archive/completed/blue-green-reindex.execution.plan.md) — superseded by `unified-versioned-ingestion.plan.md`; retained for root cause analysis and completed prerequisites
- [short-term-pr-snagging.plan.md](../archive/completed/short-term-pr-snagging.plan.md) — complete. Archived 2026-03-11.
- [search-cli-sdk-boundary-migration.execution.plan.md](../archive/completed/search-cli-sdk-boundary-migration.execution.plan.md) — strict CLI/SDK capability boundary migration completed and archived.

Next queue: [current/README.md](../current/README.md)
Strategic backlog: [future/README.md](../future/README.md)
