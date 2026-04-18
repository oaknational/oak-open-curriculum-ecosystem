# Architecture and Infrastructure

Cross-cutting architecture, system quality, and observability plans.

**Status**: 🔄 Active backlog (Milestone 2 and Milestone 3 work)
**Last Updated**: 2026-04-16

---

## Active Now

See [active/README.md](active/README.md) for work in progress.

| Priority | Plan | Milestone | Status |
|----------|------|-----------|--------|
| P0 | [sentry-otel-integration.execution.plan.md](active/sentry-otel-integration.execution.plan.md) | **M2 blocker** | Foundation closure DONE 2026-04-17. Branch: `feat/otel_sentry_enhancements`. Next in-branch lane: [`observability/active/sentry-observability-maximisation-mcp.plan.md`](../observability/active/sentry-observability-maximisation-mcp.plan.md). |
| P0 | [`observability/active/sentry-observability-maximisation-mcp.plan.md`](../observability/active/sentry-observability-maximisation-mcp.plan.md) | **M2 blocker (follow-on)** | Close every available Sentry product loop for the MCP app (server + widget) on the same branch before PR. Strategic parent: [`observability/future/sentry-observability-maximisation.plan.md`](../observability/future/sentry-observability-maximisation.plan.md). Supersedes archived `sentry-observability-expansion.plan.md` (2026-04-17). Observability plans moved to [`observability/`](../observability/) on 2026-04-18. |

Prompt entry:

- [sentry-otel-foundation.prompt.md](../../prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md)

## Queued Work (Current)

See [current/README.md](current/README.md) for the next-up queue.

Documentation architecture excellence (from synthesis analysis):

- [current/doc-architecture-phase-a-immediate.plan.md](current/doc-architecture-phase-a-immediate.plan.md) — QA register, fitness function ADR, ADR index, C4 diagrams, layer contract
- [current/doc-architecture-phase-b-dependent.plan.md](current/doc-architecture-phase-b-dependent.plan.md) — Deduplication, operability, trade-off guidance, Practice Core integration

Quality gate hardening has been promoted to current (2026-04-11):
[current/quality-gate-hardening.plan.md](current/quality-gate-hardening.plan.md).
Knip triage child plan completed 2026-04-12 and archived to
[archive/completed/knip-triage-and-remediation.plan.md](archive/completed/knip-triage-and-remediation.plan.md).

## Strategic Backlog (Future)

See [future/README.md](future/README.md) for later work and umbrella planning.

Roadmap:

- [roadmap.md](roadmap.md)
- Follow-up after Sentry validation:
  [future/codex-mcp-server-compatibility.plan.md](future/codex-mcp-server-compatibility.plan.md)

## Active Plans

| Plan | Status | Description |
|------|--------|-------------|
| [`eslint-disable-remediation.plan.md`](active/eslint-disable-remediation.plan.md) | 🟢 In progress | Remove ~64 remaining eslint-disable comments by fixing root causes. Extracted from CI plan. |
| [`current/quality-gate-hardening.plan.md`](current/quality-gate-hardening.plan.md) | 🟢 Current | Promoted 2026-04-11. Umbrella for static-analysis promotion, rule hardening, gate enforcement. Active child: knip triage. |
| [`static-analysis-tool-promotion.plan.md`](static-analysis-tool-promotion.plan.md) | 📎 Reference only | Background knip + dependency-cruiser triage detail retained until the hardening umbrella is promoted and absorbs execution. |

## Recently Completed

| Plan | Status | Description |
|------|--------|-------------|
| [`merge-main-pr76-into-otel-enhancements.plan.md`](archive/completed/merge-main-pr76-into-otel-enhancements.plan.md) | ✅ Complete | Merge main (PR #76, #78, releases 1.3.0-1.5.0) into otel branch. ADR-158 renumbering. Archived 2026-04-11. |
| [`ci-consolidation-and-gate-parity.plan.md`](archive/completed/ci-consolidation-and-gate-parity.plan.md) | ✅ Complete | CI consolidation, ESLint rule, widget deletion, documentation. Archived after completion. |

## Documents

| File | Milestone | Description |
|------|-----------|-------------|
| [`codegen/`](codegen/README.md) | Post-M1 | SDK codegen workspace decomposition — [strategic plan](codegen/future/sdk-codegen-workspace-decomposition.md) + [research](codegen/sdk-codegen-architecture-analysis.md). Temporary turbo overrides applied by [turbo boundary fix](../semantic-search/archive/completed/turbo-and-codegen-boundary-fix.plan.md) until decomposition completes. |
| `active/sentry-otel-integration.execution.plan.md` | M2 | Active execution source for the Sentry + OTel foundation |
| `current/config-architecture-standardisation-plan.md` | M1 | Unified config DI pattern via `@oaknational/mcp-config` |
| `future/oak-surface-isolation-and-generic-foundation-programme.plan.md` | Post-M2 | Strategic umbrella for extracting generic foundations and making Oak workspaces thin leaves |
| `future/observability-and-quality-metrics.plan.md` | M2 + M3 | Strategic umbrella for the observability foundation, alerting, and quality dashboards |
| `future/codex-mcp-server-compatibility.plan.md` | Post-M2 branch follow-up | Strategic brief for Codex-specific MCP auth compatibility work after Sentry validation closes |
| `future/teacher-memory-store-solid-vs-user-keyed-private-store.plan.md` | Post-M2 | Strategic comparison of Solid Pods vs user-keyed private store architecture for long-term teacher preferences and memory |
| `current/security-dependency-triage.plan.md` | M2 | Dependabot + CodeQL + outdated dependency triage (March 2026) |
| `future/stdio-http-server-alignment.md` | M1 | Align STDIO and HTTP server configuration and behaviour |
| `archive/completed/no-console-enforcement.plan.md` | M1 | Superseded 2026-03-04 — folded into `developer-experience/active/devx-strictness-convergence.plan.md` |
| `roadmap.md` | M2 onward | Strategic sequence for active blockers, queued standardisation, and the new Oak/generic separation programme |

## Milestone Alignment

- **Milestone 2** (open public alpha): server alignment,
  config standardisation, and the Sentry + OpenTelemetry observability
  foundation
- **Post-M2**: Oak surface isolation and generic foundation programme,
  including SDK codegen workspace decomposition
- **Milestone 3** (pre-beta): alerting, quality metrics, and broader
  operational hardening on top of the foundation
- **Quality gate hardening**: promoted to
  `current/quality-gate-hardening.plan.md` (2026-04-11); knip child plan
  completed 2026-04-12 and archived to
  `archive/completed/knip-triage-and-remediation.plan.md`.

See [high-level-plan.md](../high-level-plan.md) for the strategic
overview.

## History

This collection was formed on 2026-02-23 by merging the former
`architecture/` and `quality-and-maintainability/` directories, then renamed
to `architecture-and-infrastructure/` on 2026-02-24.
Completed plans were archived to `archive/completed/`, speculative
plans were moved to `icebox/`, and ESLint plans were consolidated
into `agentic-engineering-enhancements/`.
