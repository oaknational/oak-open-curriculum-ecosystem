# Active Plans — Agent Tooling

In-progress execution plans for the agent tooling substrate.

When a plan is being actively executed in a session, move it from
[`../current/`](../current/) to this directory. Move it back to
[`../current/`](../current/) when it pauses, or to [`../archive/`](../archive/)
when it completes.

## Plans

| Plan | Scope | Status |
| --- | --- | --- |
| [comms-corpus-research-and-rotation-strategy.plan.md](comms-corpus-research-and-rotation-strategy.plan.md) | Dedicated research pass over the preserved comms-event corpus — blind cold read, automated survey, failure-mode taxonomy, deep-dives across three lenses, ratification-ready non-held rotation strategy, owner-gated WS7 end-state execution. Owner-amended 2026-06-12 to the ultracode multi-wave execution strategy (statistical index, breadth extraction waves, power analysis waves, adversarial verification, corroboration-provenance matrix). | IN EXECUTION — WS0 complete, WS1 running (Katydid hunts Roost, a4314f) |
| [codex-to-codex-synchronous-hook-review-experiment.plan.md](codex-to-codex-synchronous-hook-review-experiment.plan.md) | Owner-directed Codex-first fast-feedback experiment: capture the released `PostToolUse` `apply_patch` wire shape, land a two-fixture adapter, reuse the context-bounded reviewer, and compare Spark standard, Luna standard, and Luna Fast under the real synchronous penalty. Latency thresholds are versioned per-run configuration, not invariants. No Claude UAT, production activation, or generic framework extraction. | IN EXECUTION — WS0 STATIC PREFLIGHT; NO INFERENCE STARTED |

## Related

- Collection root: [../README.md](../README.md)
- Queued: [../current/README.md](../current/README.md)
- Future backlog: [../future/README.md](../future/README.md)
- Frictions register: [../../../memory/operational/frictions-register.md](../../../memory/operational/frictions-register.md)
