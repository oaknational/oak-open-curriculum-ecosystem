# Check-Runner Singleton Per Coordination Window

Only **one** agent runs a whole-repo gate sweep (`pnpm check`,
`pnpm test`, large `turbo` invocations) per coordination window.
Multiple parallel runs duplicate ~30s+ of work per run, produce no
marginal signal, and can collide on advisory-orchestrator file
outputs. The sharpest hazard: `pnpm check`'s opening `clean` step
deletes shared build output (e.g. `agent-tools/dist/`) from under
every concurrent peer — their CLIs (heartbeats, comms, marshal
commands) and watchers die for the rebuild window (~90s). A
whole-repo sweep is a shared-substrate mutation, not a private read.

This rule complements `session-handoff` step §11 (which directs every
closing agent to run `pnpm check`) by adding an N-agent constraint:
the *team* runs check once, not N times.

## The Invariant

Per any single coordination window (the period bounded by the most
recent commit-window claim, comms-stream activity, or active source
claim overlap), **at most one agent** runs the whole-repo gate sweep.
The result of that run binds for the window; other agents observe
the result and defer their own run.

## Observable Surface

Two surfaces compose. The **registry surface**: the check-runner's
active claim carries `role` (e.g. `--role marshal` on `claims open`),
the optional claim-schema field landed 2026-06-12 as the structural
cure for singleton-role visibility — peers and glance surfaces resolve
who holds the runner role per window from `active-claims.json` alone.
The **broadcast convention** signals the in-flight run itself (start,
ETA, result), which a static role field cannot:

1. **Before** invoking `pnpm check` (or equivalent whole-repo gate),
   the agent broadcasts a comms event of the shape
   `"Lane <name> running pnpm check, ETA ~30s, will broadcast
   result"`.
2. **After** the run completes, the agent broadcasts a result event:
   `"Lane <name> pnpm check: green"` (or `"red <gate>:<file:line>"`),
   carrying the HEAD SHA at run time.
3. Other agents in the window observing the in-flight broadcast
   **defer** their own check run and consume the result event when
   it arrives.

If the result event has not arrived within ~2× the announced ETA, a
peer may take over with a fresh broadcast — the prior agent is
either retired or stalled.

## When the Rule Fires

- Multi-agent sessions (≥2 agents visible in active-claims or comms).
- Any session-handoff window where two or more agents are closing
  concurrently.
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
- ADR-183 Comms-Event Tag Namespace (`../../docs/architecture/architectural-decisions/ADR-183-comms-event-tag-namespace.md`)
  — broadcast tags (`gate-sweep:in-flight`, `gate-sweep:result`) sit in
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
the singleton holder is observable through the registry. The broadcast
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
