# Semantic Search — Active

Executable plans currently in progress.

| Priority | Plan | Scope | Status |
|---|---|---|---|
| A0 | [semantic-search-recovery-and-guardrails.execution.plan.md](./semantic-search-recovery-and-guardrails.execution.plan.md) | Incident recovery execution plan covering metadata-alias coherence repair, salvage promotion, lifecycle invariant enforcement, test-doctrine/type-discipline remediation, and anti-recurrence guardrails | 🟢 In progress |
| A0.1 | [semantic-search-ingest-runbook.md](./semantic-search-ingest-runbook.md) | Operator-run lifecycle ingest runbook with deterministic stop/go checkpoints and failure branches | 🟡 Active (gated) |

Role split:

- Prompt (`semantic-search.prompt.md`): session bootstrap and lane order.
- Recovery plan: task execution, findings register, and evidence trail.
- Ingest runbook: operator stop/go sequence and failure branches.

Other semantic-search plans were consolidated out of `active/`:

- Pending/not-started plans moved to `../current/`.
- Completed/superseded incident evidence moved to `../archive/completed/`.

The boundary migration plan is archived. Boundary doctrine is anchored in
[ADR-134](../../../../docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md).

## Archived

- [blue-green-reindex.execution.plan.md](../archive/completed/blue-green-reindex.execution.plan.md) — superseded by `unified-versioned-ingestion.plan.md`; retained for root cause analysis and completed prerequisites
- [short-term-pr-snagging.plan.md](../archive/completed/short-term-pr-snagging.plan.md) — complete. Archived 2026-03-11.
- [search-cli-sdk-boundary-migration.execution.plan.md](../archive/completed/search-cli-sdk-boundary-migration.execution.plan.md) — strict CLI/SDK capability boundary migration completed and archived.
- [cli-robustness.plan.md](../archive/completed/cli-robustness.plan.md) — superseded by recovery lane; retained as incident evidence.

Next queue: [current/README.md](../current/README.md)
Strategic backlog: [future/README.md](../future/README.md)
