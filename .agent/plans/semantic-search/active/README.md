# Semantic Search — Active

Executable plans currently in flight.

| Plan | Scope | Status |
|---|---|---|
| [pre-reingest-remediation.execution.plan.md](./pre-reingest-remediation.execution.plan.md) | Fix all 5 known code/doc issues (S1–S5) before re-indexing: sequence_semantic, 2-way RRF, CLI collapse, threadSlug test, prod smoke | 🔴 ACTIVE — blocks re-ingest; TDD Phase 1 (RED) next |
| [f2-closure-and-p0-ingestion.execution.plan.md](./f2-closure-and-p0-ingestion.execution.plan.md) | F2 code follow-ups, versioned re-ingest, F1/F2 production verification, P0 closure | 🟡 In progress — Phase 1 ✅; Phase 2 BLOCKED by remediation |
| [bulk-canonical-merge-api-parity-and-validation.execution.plan.md](./bulk-canonical-merge-api-parity-and-validation.execution.plan.md) | Canonical bulk policy, TDD merge for duplicate lesson ids, bulk-vs-API field matrix, thread/sequence naming, MCP+CLI validation after F2 promote | 🟡 Planning — execution starts after F2 promote (or merge work can begin in branch in parallel) |

Supporting documents (updated alongside the plans):

- [search-tool-prod-validation-findings-2026-03-15.md](./search-tool-prod-validation-findings-2026-03-15.md) — F1/F2 findings register with reproduction queries and evidence
- [sequence-retrieval-architecture-followup.plan.md](../current/sequence-retrieval-architecture-followup.plan.md) — locked execution recipe for sequence semantic producer + SDK-owned two-way RRF (work items executing via remediation plan)
- [search-contract-followup.plan.md](../current/search-contract-followup.plan.md) — lessons `threadSlug` inventory test + optional prod smoke source (work items executing via remediation plan)

Archived plans:

- [comprehensive-field-integrity-integration-tests.execution.plan.md](../archive/completed/comprehensive-field-integrity-integration-tests.execution.plan.md) — field-integrity test infrastructure (complete)
- [semantic-search-recovery-and-guardrails.execution.plan.md](../archive/completed/semantic-search-recovery-and-guardrails.execution.plan.md) — migration recovery (complete)
- [semantic-search-ingest-runbook.md](../archive/completed/semantic-search-ingest-runbook.md) — ingest runbook (complete)

Next queue: [current/README.md](../current/README.md)
Strategic backlog: [future/README.md](../future/README.md)
