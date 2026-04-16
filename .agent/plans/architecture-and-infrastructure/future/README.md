# Architecture and Infrastructure — Future (Later)

Strategic backlog and umbrella planning for later work in this collection.

Promote a future item to `../current/` when it becomes the next executable
queue item, then to `../active/` when implementation starts.

## Strategic Plans

| Priority | Plan | Role |
|---|---|---|
| P0 | [oak-surface-isolation-and-generic-foundation-programme.plan.md](./oak-surface-isolation-and-generic-foundation-programme.plan.md) | Strategic umbrella for separating Oak-specific leaves from generic foundations across runtime, design, tooling, SDK/codegen, search, and app surfaces |
| P0 | [observability-and-quality-metrics.plan.md](./observability-and-quality-metrics.plan.md) | Strategic umbrella for the M2 observability foundation plus M3 alerting and quality-metrics hardening |
| P1 | [codex-mcp-server-compatibility.plan.md](./codex-mcp-server-compatibility.plan.md) | Strategic follow-up for Codex-specific MCP auth compatibility after the active Sentry validation lane closes |
| P1 | [teacher-memory-store-solid-vs-user-keyed-private-store.plan.md](./teacher-memory-store-solid-vs-user-keyed-private-store.plan.md) | Strategic comparison brief for long-term teacher memory storage: Solid Pods vs a user-keyed private store pattern |
| -- | ~~quality-gate-hardening.plan.md~~ | Promoted to [current/](../current/quality-gate-hardening.plan.md) 2026-04-11 |
| P1 | [test-suite-audit-and-triage.plan.md](./test-suite-audit-and-triage.plan.md) | Deep test-suite audit before stricter enforcement and mutation-testing rollout |
| P1 | [ground-truth-archive-retirement.plan.md](./ground-truth-archive-retirement.plan.md) | Delete old 120-query ground-truth-archive/ and wire evaluation pipeline to canonical ground-truth/ model |
| P2 | [stdio-http-server-alignment.md](./stdio-http-server-alignment.md) | Historical/server-alignment strategy reference; not an active observability adoption lane |

Companion future plan in the nested codegen lane:

- [../codegen/future/sdk-codegen-workspace-decomposition.md](../codegen/future/sdk-codegen-workspace-decomposition.md) — strategic split of mixed OpenAPI/codegen and bulk-data lineages; tranche 4 of the new programme must absorb rather than duplicate this direction

Strategic context: [../roadmap.md](../roadmap.md)
In-progress execution: [../active/README.md](../active/README.md)
Next-up queue: [../current/README.md](../current/README.md)
