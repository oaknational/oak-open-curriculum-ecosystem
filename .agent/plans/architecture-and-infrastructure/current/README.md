# Architecture and Infrastructure — Current (Next Up)

Current queued work for this collection.

## Queue

| Priority | Plan | Scope | Status |
|----------|------|-------|--------|
| P1 | [config-architecture-standardisation-plan.md](./config-architecture-standardisation-plan.md) | Shared config DI and runtime-config standardisation | Queued |
| P2 | [security-dependency-triage.plan.md](./security-dependency-triage.plan.md) | Dependabot, CodeQL, and outdated dependency triage | Queued |

Active execution:

- [sentry-otel-integration.execution.plan.md](../active/sentry-otel-integration.execution.plan.md) — blocker-clearance and follow-up doc fixes are pushed on `feat/full-sentry-otel-support` at `44d8d74d`; the checkpoint is now restart-cleared, and HTTP adoption is the next action in the active plan so the public-alpha runtimes become supportable with redacted telemetry

Related strategic umbrella:

- [observability-and-quality-metrics.plan.md](../future/observability-and-quality-metrics.plan.md) — strategic parent plan whose first slice is currently being executed by the active child plan
