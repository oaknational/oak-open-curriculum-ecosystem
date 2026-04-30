# Architecture and Infrastructure — Future (Later)

Strategic backlog and umbrella planning for later work in this collection.

Promote a future item to `../current/` when it becomes the next executable
queue item, then to `../active/` when implementation starts.

## Strategic Plans

| Priority | Plan | Role |
|---|---|---|
| P0 | [architectural-budget-system-across-scales.plan.md](./architectural-budget-system-across-scales.plan.md) | Strategic companion lens for cross-scale architectural bounds, visibility-before-enforcement, and anti-gaming doctrine. It links to the visibility/enforcement child briefs without replacing the workspace layer-separation programme. |
| P0 | [oak-surface-isolation-and-generic-foundation-programme.plan.md](./oak-surface-isolation-and-generic-foundation-programme.plan.md) | Strategic umbrella for enforcing one-layer-per-workspace and separating Oak-specific leaves from generic foundations across runtime, design, tooling, SDK/codegen, search, and app surfaces |
| P0 | [observability-and-quality-metrics.plan.md](./observability-and-quality-metrics.plan.md) | Strategic umbrella for the M2 observability foundation plus M3 alerting and quality-metrics hardening |
| P0 | [`observability/future/sentry-observability-maximisation.plan.md`](../../observability/future/sentry-observability-maximisation.plan.md) | Strategic parent for closing every available Sentry product loop across MCP (server + widget) and Search CLI; executable lane at [`observability/active/sentry-observability-maximisation-mcp.plan.md`](../../observability/active/sentry-observability-maximisation-mcp.plan.md) for the MCP branch. Moved 2026-04-18 per the observability restructure. |
| P1 | [codex-mcp-server-compatibility.plan.md](./codex-mcp-server-compatibility.plan.md) | Strategic follow-up for Codex-specific MCP auth compatibility after the active Sentry validation lane closes |
| P2 | [clerk-cli-adoption.plan.md](./clerk-cli-adoption.plan.md) | Strategic follow-up to extend the Sentry CLI-as-infrastructure pattern to Clerk's CLI: per-workspace pnpm-pinned install, repo-tracked scoping, agent-skill discoverability |
| P1 | [teacher-memory-store-solid-vs-user-keyed-private-store.plan.md](./teacher-memory-store-solid-vs-user-keyed-private-store.plan.md) | Strategic comparison brief for long-term teacher memory storage: Solid Pods vs a user-keyed private store pattern |
| -- | ~~quality-gate-hardening.plan.md~~ | Promoted to [current/](../current/quality-gate-hardening.plan.md) 2026-04-11 |
| P1 | [test-suite-audit-and-triage.plan.md](./test-suite-audit-and-triage.plan.md) | Deep test-suite audit before stricter enforcement and mutation-testing rollout |
| P1 | [ground-truth-archive-retirement.plan.md](./ground-truth-archive-retirement.plan.md) | Delete old 120-query ground-truth-archive/ and wire evaluation pipeline to canonical ground-truth/ model |
| P1 | [oak-search-cli-command-surface-rationalisation.plan.md](./oak-search-cli-command-surface-rationalisation.plan.md) | Strategic follow-up to define one public `oaksearch` command architecture, demote non-CLI operations to package scripts, and delete commands/scripts that cannot prove ongoing value |
| P2 | [stdio-http-server-alignment.md](./stdio-http-server-alignment.md) | Historical/server-alignment strategy reference; not an active observability adoption lane |

Companion future plan in the nested codegen lane:

- [../codegen/future/sdk-codegen-workspace-decomposition.md](../codegen/future/sdk-codegen-workspace-decomposition.md) — strategic split of mixed OpenAPI/codegen and bulk-data lineages; tranche 4 of the new programme must absorb rather than duplicate this direction

Strategic context: [../roadmap.md](../roadmap.md)
In-progress execution: [../active/README.md](../active/README.md)
Next-up queue: [../current/README.md](../current/README.md)

Architectural budget child briefs:

- [architectural-budget-visibility-layer.plan.md](./architectural-budget-visibility-layer.plan.md) — read-only metrics child; promote only for one named consumer trigger at a time
- [architectural-budget-enforcement-layer.plan.md](./architectural-budget-enforcement-layer.plan.md) — later gate-promotion child; blocked until visibility, remediation, and non-zero failure modes are proven

Immediate executable child:

- [../current/workspace-layer-separation-audit.plan.md](../current/workspace-layer-separation-audit.plan.md) — audit current workspace topology, produce the authoritative layer/workspace matrix, and slice migration tranches
