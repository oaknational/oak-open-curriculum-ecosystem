# Architecture and Infrastructure — Current (Next Up)

Current queued work for this collection.

## Queue

| Priority | Plan | Scope | Status |
|----------|------|-------|--------|
| P0 | [workspace-layer-separation-audit.plan.md](./workspace-layer-separation-audit.plan.md) | Repo-wide audit and migration preparation for the rule that distinct architectural layers must live in distinct workspaces | Queued |
| P1 | [config-architecture-standardisation-plan.md](./config-architecture-standardisation-plan.md) | Shared config DI and runtime-config standardisation | Queued |
| P2 | [security-dependency-triage.plan.md](./security-dependency-triage.plan.md) | Dependabot, CodeQL, and outdated dependency triage | Queued |
| P3 | [doc-architecture-phase-a-immediate.plan.md](./doc-architecture-phase-a-immediate.plan.md) | QA register, ADR-166 / ADR-121 gate-mapping follow-up, ADR index, C4 diagrams, layer contract | Queued |
| P4 | [doc-architecture-phase-b-dependent.plan.md](./doc-architecture-phase-b-dependent.plan.md) | Deduplication, operability practice, trade-off guidance, Practice Core | Queued (blocked by Phase A) |
| P5 | [agent-identity-derivation.plan.md](../archive/completed/agent-identity-derivation.plan.md) | Portable deterministic agent-identity CLI in `agent-tools/`; cross-platform (Claude Code/Codex/Cursor) | Complete — archived 2026-04-27 |

Active execution:

- [sentry-otel-integration.execution.plan.md](../active/sentry-otel-integration.execution.plan.md) — HTTP MCP and Search CLI implementation complete; remaining live validation is Vercel credential provisioning plus the deployment evidence bundle. After that validation pass, continue with the MCP-server-confined expansion lane. Branch: `feat/otel_sentry_enhancements`

Strategic analysis (parent of Phase A and B):

- [architectural-documentation-excellence-synthesis.plan.md](./architectural-documentation-excellence-synthesis.plan.md) — multi-part report synthesising internal docs against external research

Strategic architecture-budget context:

- [../future/architectural-budget-system-across-scales.plan.md](../future/architectural-budget-system-across-scales.plan.md) — future parent for ADR-166 cross-scale budget visibility and enforcement; does not displace the P0 workspace layer separation audit

Quality gate hardening (promoted from future/ 2026-04-11):

| Priority | Plan | Scope | Status |
|----------|------|-------|--------|
| P0 | [quality-gate-hardening.plan.md](./quality-gate-hardening.plan.md) | Unified plan for all pending quality gate promotions and enforcement hardening | Owner decisions resolved, ADR-121 reconciled |
| P0 | [knip-triage-and-remediation.plan.md](../archive/completed/knip-triage-and-remediation.plan.md) | Child plan: run knip, investigate findings with evidence, remediate | **Complete** (all phases resolved 2026-04-12; archived 2026-04-17) |
| P1 | [depcruise-triage-and-remediation.plan.md](../archive/completed/depcruise-triage-and-remediation.plan.md) | Child plan: triage depcruise findings, resolve circular deps and orphans, promote to blocking gate | **Complete** (all phases resolved 2026-04-12; archived 2026-04-29) |

Related strategic umbrella:

- [observability-and-quality-metrics.plan.md](../future/observability-and-quality-metrics.plan.md) — strategic parent plan whose first slice is currently being executed by the active parent/child/companion plan set

Strategic context: [../roadmap.md](../roadmap.md)
