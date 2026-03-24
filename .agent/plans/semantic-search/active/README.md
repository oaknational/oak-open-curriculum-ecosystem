# Semantic Search — Active

Executable plans currently in flight.

| Plan | Scope | Status |
|---|---|---|
| [f2-closure-and-p0-ingestion.execution.plan.md](./f2-closure-and-p0-ingestion.execution.plan.md) | F2 code follow-ups, versioned re-ingest, F1/F2 production verification, P0 closure | 🟡 In progress — Phase 1 ✅; Phase 2 staged + promoted (v2026-03-24-091112); Phase 3 verification next |
| [bulk-canonical-merge-api-parity-and-validation.execution.plan.md](./bulk-canonical-merge-api-parity-and-validation.execution.plan.md) | Canonical bulk policy, TDD merge for duplicate lesson ids, bulk-vs-API field matrix, thread/sequence naming, MCP+CLI validation after F2 promote | 🟡 Planning — execution starts after F2 promote (or merge work can begin in branch in parallel) |
| [index-lifecycle-management.execution.plan.md](./index-lifecycle-management.execution.plan.md) | CLI commands for orphan detection/deletion, alias-aware generation cleanup, lease resilience, pre-stage orphan warning | 🟡 In progress — Phase 6 ✅, Phase 6a uncommitted, Phases 1-5 pending |
| [search-ingestion-sdk-extraction.execution.plan.md](./search-ingestion-sdk-extraction.execution.plan.md) | Extract Oak-specific ingestion runtime into `@oaknational/oak-search-ingestion-sdk`, keep CLI thin, and document the internal-consumer adoption path | 🟡 Planning — boundary locked in ADR-140; execution starts after overlap audit and lane sequencing |

Supporting documents (updated alongside the plans):

- [search-tool-prod-validation-findings-2026-03-15.md](./search-tool-prod-validation-findings-2026-03-15.md) — F1/F2 findings register with reproduction queries and evidence
- [sequence-retrieval-architecture-followup.plan.md](../current/sequence-retrieval-architecture-followup.plan.md) — locked execution recipe for sequence semantic producer + SDK-owned two-way RRF (work items executing via remediation plan)
- [search-contract-followup.plan.md](../current/search-contract-followup.plan.md) — lessons `threadSlug` inventory test + optional prod smoke source (work items executing via remediation plan)

Archived plans:

- [pre-reingest-remediation.execution.plan.md](../archive/completed/pre-reingest-remediation.execution.plan.md) — S1-S5 remediation + CLI-SDK boundary enforcement (complete 2026-03-23)
- [comprehensive-field-integrity-integration-tests.execution.plan.md](../archive/completed/comprehensive-field-integrity-integration-tests.execution.plan.md) — field-integrity test infrastructure (complete)
- [semantic-search-recovery-and-guardrails.execution.plan.md](../archive/completed/semantic-search-recovery-and-guardrails.execution.plan.md) — migration recovery (complete)
- [semantic-search-ingest-runbook.md](../archive/completed/semantic-search-ingest-runbook.md) — ingest runbook (complete)

Next queue: [current/README.md](../current/README.md)
Strategic backlog: [future/README.md](../future/README.md)
