# Naming + Snagging Handover Team — Session Opener (2026-06-11)

> When working with other agents, all responses, work, claims and sources
> must be critically assessed before being accepted.

**Type**: handover (team session entry point; instance of
[`team-session-opener.prompt.md`](team-session-opener.prompt.md) — read that template's entry
ritual, worktree/coordination-home convention, branching strategy, and cadence sections as part
of this brief; this instance records only what is specific to this team).

**Team purpose**: two long-running lanes reached context budget on 2026-06-11 and retired
mid-cycle under PDR-063. This team carries both lanes forward through successor seats under one
Director, and clears the P1 identity defect the handover surfaced.

## Roster (owner-named)

| Seat | Agent (identity tuple) | Lane |
| --- | --- | --- |
| Director | Firefly seeks Temper / claude / Fable 5 / ce44ae / 8b52a57e-cf62-52da-a5f8-3b24a2737954 | Pure direction; coordination home = primary checkout; claim 9a666480 |
| Naming | Moss weaves Blossom / claude / Fable 5 / 10438c / abcbaa34-d804-5ed4-bd5e-f7d15a69674f | Succeeds Swift Gliding Zephyr (aba87a; owner-roster alias "Harrier weaves Stratosphere") |
| Snagging | Cosmos turns Equinox / claude / Fable 5 / 1bc763 / 59c5b4c4-2de7-578f-b703-89094e6a9400 | Succeeded Dusky Passing Mist (2c0c4b); claim 7e903895 live |

## Lane briefs

### Naming lane (thread `agent-tooling`)

- **Plan authority**: ADR-195 (naming-schema versioning) and the naming-lane handoff record
  Swift Gliding Zephyr freezes at retirement (under `.agent/state/collaboration/handoffs/`).
- **FIRST claimed task (owner-ruled P1, Director supersession event 10cb3a10)**: the identity
  split-brain diagnosis. One seed renders two names for every pre-v2-activation session
  (Zephyr/Harrier confirmed; Dusky/"Tarsier calls Warren" suspected — verify). Required
  outcome: deterministic single-valued identity resolution — one seed, exactly one name,
  enforced. Evidence: fresh post-activation tuples record `naming_schema_version: "override"`
  rather than a pinned schema version (confirmed on three independent tuples).
- **PR #189 merge is GATED on that diagnosis** locating the defect (activation logic in the PR
  vs session-local cache/env). No self-merge default exists.
- **Owner signal, no decision yet**: the owner is exploring alternatives to the v2
  noun-verb-noun shape. Exploration only — a possible v3 follows the owner's decision; the
  single-identity outcome is shape-agnostic and proceeds regardless.
- **Shared-checkout caution**: the primary checkout (coordination home) carried this lane's
  branch plus an in-flight `origin/main` merge with a napkin.md conflict at handover time. The
  handoff record pins the disposition; do no primary-checkout work — adopt a worktree per the
  template convention.

### Snagging lane (thread `eef`)

- **Plan authority**: the snag register
  [`oak-prod-mcp-snagging-2026-06-11.plan.md`](../../plans/sdk-and-mcp-enhancements/current/oak-prod-mcp-snagging-2026-06-11.plan.md),
  the handoff record `7fb69812-snagging-execution-handoff.md`, and the owner-approved execution
  plan named inside that record.
- **State at pickup (verified first-hand by the successor)**: PR-1 (outbound token health
  metric) open as PR #190, checks green — monitor to merge, then verify `oak.mcp.response.*`
  in Sentry preview. PR-2 (EEF dual-shape) E1+E2 landed locally (commit `20ad83326`,
  push did not complete before retirement) — E3 docs-supersession sweep, size delta, push,
  open PR-2. PR-3 (keyword-graph limit schema bounds) specified, unstarted.
- **Worktree**: `.claude/worktrees/snagging-2026-06-11`, branch `feat/eef-dual-shape-alignment`;
  lane work is worktree-only, registry state stays out of all PR diffs.

## Team-specific gates and cautions

- **Single-identity invariant is under live repair**: until the naming lane's diagnosis lands,
  every seat carries its full tuple on every event and reports any dual rendering immediately
  as P1 (template entry-ritual step 2 is load-bearing for exactly this team).
- **Coordination-surface integrity**: two comms event files went ENOENT during the handover
  merge window. The Director runs an integrity sweep after the primary-checkout merge resolves;
  report any missing-event symptom to the Director rather than re-emitting.
- **Heartbeats**: canonical ≤4-minute cadence per the liveness rule; no looser cadence is
  ratified for this team.
- **Hard sequencing gates**: naming-lane source work starts only after its handoff record is
  read end to end; PR #189 merge only after the identity diagnosis; no seat touches the primary
  checkout (Director-owned).
