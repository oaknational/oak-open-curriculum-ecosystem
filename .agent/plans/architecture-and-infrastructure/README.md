# Architecture and Infrastructure

Cross-cutting architecture, system quality, and observability plans.

**Status**: 🔄 Active backlog (Milestone 2 and Milestone 3 work)
**Last Updated**: 2026-03-04

---

## Queued Work (Current)

See [current/README.md](current/README.md) for the next-up queue.

| Priority | Plan | Milestone | Status |
|----------|------|-----------|--------|
| P0 | [sentry-otel-integration.execution.plan.md](current/sentry-otel-integration.execution.plan.md) | **M3 blocker** | Queued |

## Documents

| File | Milestone | Description |
|------|-----------|-------------|
| [`codegen/`](codegen/README.md) | Post-M1 | SDK codegen workspace decomposition — [strategic plan](codegen/future/sdk-codegen-workspace-decomposition.md) + [research](codegen/sdk-codegen-architecture-analysis.md). Temporary turbo overrides applied by [turbo boundary fix](../semantic-search/archive/completed/turbo-and-codegen-boundary-fix.plan.md) until decomposition completes. |
| `current/config-architecture-standardisation-plan.md` | M1 | Unified config DI pattern via `@oaknational/mcp-config` |
| `current/observability-and-quality-metrics.plan.md` | M3 | Structured logging, monitoring, alerting, quality dashboards |
| `current/security-dependency-triage.plan.md` | M2 | Dependabot + CodeQL + outdated dependency triage (March 2026) |
| `future/stdio-http-server-alignment.md` | M1 | Align STDIO and HTTP server configuration and behaviour |
| `archive/completed/no-console-enforcement.plan.md` | M1 | Superseded 2026-03-04 — folded into `developer-experience/active/devx-strictness-convergence.plan.md` |

## Milestone Alignment

- **Milestone 2** (open public alpha): server alignment,
  config standardisation, and public-alpha hardening dependencies
- **Post-M2**: SDK codegen workspace decomposition
- **Milestone 3** (pre-beta): observability and quality metrics, **Sentry integration (blocker)**

See [high-level-plan.md](../high-level-plan.md) for the strategic
overview.

## History

This collection was formed on 2026-02-23 by merging the former
`architecture/` and `quality-and-maintainability/` directories, then renamed
to `architecture-and-infrastructure/` on 2026-02-24.
Completed plans were archived to `archive/completed/`, speculative
plans were moved to `icebox/`, and ESLint plans were consolidated
into `agentic-engineering-enhancements/`.
