# Architecture and Infrastructure — Current (Next Up)

Current queued work for this collection.

## Queue

| Priority | Plan | Scope | Status |
|----------|------|-------|--------|
| P1 | [config-architecture-standardisation-plan.md](./config-architecture-standardisation-plan.md) | Shared config DI and runtime-config standardisation | Queued |
| P2 | [security-dependency-triage.plan.md](./security-dependency-triage.plan.md) | Dependabot, CodeQL, and outdated dependency triage | Queued |
| P3 | [doc-architecture-phase-a-immediate.plan.md](./doc-architecture-phase-a-immediate.plan.md) | QA register, fitness function ADR, ADR index, C4 diagrams, layer contract | Queued |
| P4 | [doc-architecture-phase-b-dependent.plan.md](./doc-architecture-phase-b-dependent.plan.md) | Deduplication, operability practice, trade-off guidance, Practice Core | Queued (blocked by Phase A) |

Active execution:

- [sentry-otel-integration.execution.plan.md](../active/sentry-otel-integration.execution.plan.md) — HTTP adoption + rate limiting complete; Search CLI adoption next. Branch: `feat/otel_sentry_enhancements`

Strategic analysis (parent of Phase A and B):

- [architectural-documentation-excellence-synthesis.plan.md](./architectural-documentation-excellence-synthesis.plan.md) — multi-part report synthesising internal docs against external research

Quality gate hardening (promoted from future/ 2026-04-11):

| Priority | Plan | Scope | Status |
|----------|------|-------|--------|
| P0 | [quality-gate-hardening.plan.md](./quality-gate-hardening.plan.md) | Unified plan for all pending quality gate promotions and enforcement hardening | Owner decisions resolved, ADR-121 reconciled |
| P0 | [knip-triage-and-remediation.plan.md](../active/knip-triage-and-remediation.plan.md) | Child plan: run knip, investigate findings with evidence, remediate | **Complete** (all phases resolved 2026-04-12) |
| P1 | [depcruise-triage-and-remediation.plan.md](./depcruise-triage-and-remediation.plan.md) | Child plan: triage depcruise findings, resolve circular deps and orphans, promote to blocking gate | Queued |

Related strategic umbrella:

- [observability-and-quality-metrics.plan.md](../future/observability-and-quality-metrics.plan.md) — strategic parent plan whose first slice is currently being executed by the active child plan

Strategic context: [../roadmap.md](../roadmap.md)
