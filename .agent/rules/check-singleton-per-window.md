---
classification: situational
description: "Before any whole-repo gate sweep (pnpm check, pnpm test, large turbo runs) in a working tree other agents share, or whose build output they read, check the comms stream for an in-flight run: at most one agent sweeps per working tree per coordination window — broadcast start and ETA, broadcast the result with HEAD SHA, peers in that tree defer and consume it (the runner claims --role marshal). Seats in separate worktrees run their own sweeps side by side under no-unbounded-host-load item 6. Not for solo sessions, per-workspace scoped gates, or targeted single-file runs — those are parallel-safe. Failure shape — a sweep rebuilding the tree's shared agent-tools/dist under every concurrent session that reads it, deleting it first where the check script runs a clean step, killing their CLIs and watchers for the rebuild window."
trigger: tool:gate-sweep
---

# Check-Runner Singleton Per Working Tree, Per Coordination Window

Only **one** agent runs a whole-repo gate sweep (`pnpm check`,
`pnpm test`, large `turbo` invocations) in one working tree per
coordination window. Multiple parallel runs in one tree duplicate ~30s+
of work per run, produce no marginal signal, and can collide on
advisory-orchestrator file outputs. The sharpest hazard: a whole-repo
sweep rebuilds the tree's shared build output (e.g. `agent-tools/dist/`)
under every concurrent session that reads it (a session working a sibling
worktree from the primary checkout among them), and where the `check` script
runs a `clean` step it deletes that output first — the peers' CLIs
(heartbeats, comms, marshal commands) and watchers then die for the
rebuild window (~90s). A whole-repo sweep is a shared-substrate
mutation, not a private read.

This rule complements `session-handoff` step §11 by adding an N-agent
constraint: the *team* in one working tree runs a whole-repo gate at most
once per window, not N times. The stronger constraint sits above it: the commit ceremony's
pre-commit hook already runs the local gates (the validators, build,
type-check, lint and unit tests) and the pull request's checks run the
wider suites, so a gate run beside or after a commit is never warranted
(owner, 2026-09-14, verbatim: "the
commit triggers the gates, there is no point and a fair amount of cost
running the gates separately as well, never, ever do that"). The
singleton discipline below governs the residue: a whole-repo run that no
commit triggers.

## The Invariant

Per any single coordination window (the period bounded by the most
recent commit-window claim, comms-stream activity, or active source
claim overlap), **at most one agent** runs the whole-repo gate sweep
in any one working tree. The result of that run binds that tree for
the window; other agents in the tree observe the result and defer
their own run. Seats in separate worktrees run their own sweeps side
by side, within the host bound of
[`no-unbounded-host-load`](no-unbounded-host-load.md) item 6.

## Observable Surface

Two surfaces compose. The **registry surface**: the check-runner's
active claim carries `role` (e.g. `--role marshal` on `claims open`),
the optional claim-schema field landed 2026-06-12 as the structural
cure for singleton-role visibility — peers and glance surfaces resolve
who holds the runner role per window from `active-claims.json`. A claim
records no working tree, so the broadcast, which names the tree, binds
that role to its tree.
The **broadcast convention** signals the in-flight run itself (start,
ETA, result), which a static role field cannot:

1. **Before** invoking `pnpm check` (or equivalent whole-repo gate),
   the agent broadcasts a comms event of the shape
   `"Lane <name> running pnpm check in <worktree>, ETA ~30s, will
   broadcast result"`, where `<worktree>` is the working tree's directory
   name, so a peer can tell whether the run is in its own tree.
2. **After** the run completes, the agent broadcasts a result event:
   `"Lane <name> pnpm check in <worktree>: green"` (or
   `"red <gate>:<file:line>"`), carrying the HEAD SHA at run time.
3. Other agents in the same working tree observing the in-flight
   broadcast **defer** their own check run and consume the result event
   when it arrives. An agent that reads the tree's build output from
   another worktree observes the broadcast (its CLIs and hooks fail for
   the rebuild window) and runs its own worktree's gates.

If the result event has not arrived within ~2× the announced ETA, a
peer may take over with a fresh broadcast — the prior agent is
either retired or stalled.

## When the Rule Fires

- Multi-agent sessions where two or more agents share one working tree, or read its build output
  (≥2 agents visible in active-claims or comms). A sweep in the primary checkout counts every
  live seat of the estate as a reader: no surface records where a session was launched, and a
  session launched in the primary checkout reads that build through its hooks.
- Any session-handoff window where two or more agents in one working
  tree are closing concurrently.
- Any time the agent reflexively reaches for `pnpm check` without
  observing the comms stream for a recent in-flight broadcast.

## When the Rule Does Not Fire

- Solo sessions (no peers visible).
- Per-workspace gate runs (the singleton applies to whole-repo
  sweeps, not to scoped workspace gates — these are cheap and
  parallel-safe).
- Targeted gate invocations (`pnpm lint:fix .` on a single file;
  `vitest run path/to/spec`); these do not duplicate the
  whole-repo sweep work.

## Why

Owner-stated 2026-05-22 during a session-handoff window:
*"only one agent needs to run check, and one agent already is, so
stop check, and record that invariant, and note that we need some
kind of record of who is running check when"*. The friction this
rule prevents is duplicate ~30s+ work across N agents at session
close, plus the advisory-orchestrator file-collision risk when two
runs overlap.

Read through the owner's 2026-09-20 ruling (verbatim: "two parallel gate
runs are fine as long as they are in different work trees"), the
invariant above binds one working tree: seats in separate worktrees run
their own sweeps under
[`no-unbounded-host-load`](no-unbounded-host-load.md) item 6.

## Composition

- [`agent-state-observable`](agent-state-observable.md) — agent
  state changes (including in-flight gate runs) must be observable
  to peers. This rule names a specific observable: the in-flight
  check broadcast.
- [`use-agent-comms-log`](use-agent-comms-log.md) — the broadcast
  is a standard comms event; no new transport.
- [`monitor-branch-touched-files`](monitor-branch-touched-files.md) —
  peers observe the comms stream; the singleton convention rides on
  the existing watcher discipline.

## Source doctrine

- [PDR-076 / PDR-076a (Agent Identity Tuple)](../practice-core/decision-records/PDR-076a-agent-identity-tuple-name-and-uuid.md)
  — broadcasts carry the (name, UUID, session_id_prefix) identity so
  peers can attribute the in-flight run.
- The `agent-tools` comms-event tag namespace — broadcast tags (`gate-sweep:in-flight`, `gate-sweep:result`) sit in
  the comms-event tag taxonomy.
- Active-claims schema `role` field — the structural claim-schema
  surface for singleton-role visibility; see
  [`active-claims.schema.json`](../../agent-tools/src/collaboration-state/schemas/active-claims.schema.json).

## Structural Cure — Landed

The structural claim-schema cure pending since 2026-05-22 landed
2026-06-12 (owner-directed) as the optional `role` field on active
claims — an open-vocabulary session-role marker rather than the
originally predicted `area-kind: gate-sweep`. The check-runner opens
its claim with `--role marshal` (or another agreed runner label), so
the singleton holder is observable through the registry, and its
broadcast names the working tree it holds the seat for. The broadcast
convention remains the in-flight signal: roles answer *who holds the
runner seat this window*; broadcasts answer *is a sweep running right
now and what did it conclude*.

The same singleton discipline applies to WATCHER processes per seat:
multiple concurrent watchers racing one seen-file were observed (four for
one seat, two for another, 2026-07-2x) — each re-arm must confirm the
prior watcher is DEAD (TaskStop confirmed, or the exit notification
received) before arming a successor on the same seen-file; two live
co-writers on one cursor is the F-43 zombie class, and the mark-seen race
silently eats events.
