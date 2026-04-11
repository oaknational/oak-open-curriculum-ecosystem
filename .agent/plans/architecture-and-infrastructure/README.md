# Architecture and Infrastructure

Cross-cutting architecture, system quality, and observability plans.

**Status**: 🔄 Active backlog (Milestone 2 and Milestone 3 work)
**Last Updated**: 2026-03-29

---

## Active Now

See [active/README.md](active/README.md) for work in progress.

| Priority | Plan | Milestone | Status |
|----------|------|-----------|--------|
| P0 | [sentry-otel-integration.execution.plan.md](active/sentry-otel-integration.execution.plan.md) | **M2 blocker** | HTTP adoption complete (PR #73 merged), rate limiting complete (ADR-144); Search CLI adoption + deployment evidence pending. Branch: `feat/otel_sentry_enhancements`. |

Prompt entry:

- [sentry-otel-foundation.prompt.md](../../prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md)

## Queued Work (Current)

See [current/README.md](current/README.md) for the next-up queue.

## Strategic Backlog (Future)

See [future/README.md](future/README.md) for later work and umbrella planning.

## Active Plans

| Plan | Status | Description |
|------|--------|-------------|
| [`ci-consolidation-and-gate-parity.plan.md`](active/ci-consolidation-and-gate-parity.plan.md) | ✅ Complete | CI consolidation, ESLint rule, widget deletion, documentation. Ready to archive after branch merge. |
| [`eslint-disable-remediation.plan.md`](active/eslint-disable-remediation.plan.md) | 🟢 In progress | Remove ~64 remaining eslint-disable comments by fixing root causes. Extracted from CI plan. |
| [`static-analysis-tool-promotion.plan.md`](static-analysis-tool-promotion.plan.md) | Pending | Triage knip + dependency-cruiser findings, then promote to blocking QG |

## Documents

| File | Milestone | Description |
|------|-----------|-------------|
| [`codegen/`](codegen/README.md) | Post-M1 | SDK codegen workspace decomposition — [strategic plan](codegen/future/sdk-codegen-workspace-decomposition.md) + [research](codegen/sdk-codegen-architecture-analysis.md). Temporary turbo overrides applied by [turbo boundary fix](../semantic-search/archive/completed/turbo-and-codegen-boundary-fix.plan.md) until decomposition completes. |
| `active/sentry-otel-integration.execution.plan.md` | M2 | Active execution source for the Sentry + OTel foundation |
| `current/config-architecture-standardisation-plan.md` | M1 | Unified config DI pattern via `@oaknational/mcp-config` |
| `future/observability-and-quality-metrics.plan.md` | M2 + M3 | Strategic umbrella for the observability foundation, alerting, and quality dashboards |
| `current/security-dependency-triage.plan.md` | M2 | Dependabot + CodeQL + outdated dependency triage (March 2026) |
| `future/stdio-http-server-alignment.md` | M1 | Align STDIO and HTTP server configuration and behaviour |
| `archive/completed/no-console-enforcement.plan.md` | M1 | Superseded 2026-03-04 — folded into `developer-experience/active/devx-strictness-convergence.plan.md` |

## Milestone Alignment

- **Milestone 2** (open public alpha): server alignment,
  config standardisation, and the Sentry + OpenTelemetry observability
  foundation
- **Post-M2**: SDK codegen workspace decomposition
- **Milestone 3** (pre-beta): alerting, quality metrics, and broader
  operational hardening on top of the foundation

See [high-level-plan.md](../high-level-plan.md) for the strategic
overview.

## History

This collection was formed on 2026-02-23 by merging the former
`architecture/` and `quality-and-maintainability/` directories, then renamed
to `architecture-and-infrastructure/` on 2026-02-24.
Completed plans were archived to `archive/completed/`, speculative
plans were moved to `icebox/`, and ESLint plans were consolidated
into `agentic-engineering-enhancements/`.
