# Semantic Search — Active

Executable items currently in progress.

| Priority | Plan | Scope | Status |
|---|---|---|---|
| A0 | [search-tool-prod-validation-findings-2026-03-15.md](./search-tool-prod-validation-findings-2026-03-15.md) | Production search-tool validation findings register covering scope/filter parity checks after blue/green cutover | 🟡 Active (open findings) |
| A1 | [comprehensive-field-integrity-integration-tests.execution.plan.md](./comprehensive-field-integrity-integration-tests.execution.plan.md) | Comprehensive integration-test workstream to prove all search index fields are handled correctly at each stage and end-to-end across stages | 🟡 Planning |

Completed incident-recovery authorities have been archived:

- [semantic-search-recovery-and-guardrails.execution.plan.md](../archive/completed/semantic-search-recovery-and-guardrails.execution.plan.md)
- [semantic-search-ingest-runbook.md](../archive/completed/semantic-search-ingest-runbook.md)

Role split:

- Prompt (`semantic-search.prompt.md`): session bootstrap and lane order.
- Active findings register: production validation evidence and dispositions.
- Archived recovery/runbook plans: closed migration-recovery execution record.

Other semantic-search plans were consolidated out of `active/`:

- Pending/not-started plans moved to `../current/`.
- Completed/superseded incident evidence moved to `../archive/completed/`.

The boundary migration plan is archived. Boundary doctrine is anchored in
[ADR-134](../../../../docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md).
Archive index: [archive/completed/README.md](../archive/completed/README.md)

Next queue: [current/README.md](../current/README.md)
Strategic backlog: [future/README.md](../future/README.md)
