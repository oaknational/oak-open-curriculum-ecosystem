---
name: "Comms Watch Liveness Floor"
overview: "Add an independent watcher-liveness primitive to the collaboration substrate, tighten the comms-watch identity filter to the full PDR-027 tuple, and validate /loop as the host scheduler for the check companion on Claude Code."
status: decision-incomplete
todos:
  - id: phase-0-grounding
    content: "Phase 0: Re-check identity, active claims, and overlapping touched paths under agent-tools/src/collaboration-state/ before mutation."
    status: pending
  - id: phase-1-red
    content: "Phase 1: Add RED coverage for the liveness-record schema (free-form source), the full-tuple self-echo exclusion, and the check command writing a fresh record."
    status: pending
  - id: phase-2-green
    content: "Phase 2: Implement the liveness writer, extend comms watch to emit `source: \"watcher\"` ticks, and promote the check CLI stub into a real one-shot writer with `source: \"check\"`."
    status: pending
  - id: phase-3-honesty
    content: "Phase 3: Reconcile the comms-watch name with its current poll-based implementation — either commit to fs-event-driven delivery or relabel honestly per the reference anti-pattern."
    status: pending
  - id: phase-4-loop-experiment
    content: "Phase 4: Run the host-integration validation experiment — `/loop ~270s \"… check …\"` over a real Claude Code session of 30+ minutes; record cadence reliability and reasoning-context disruption."
    status: pending
  - id: phase-5-docs
    content: "Phase 5: Update `.agent/reference/comms-watch-mechanism.md` with the CLI invocation, the liveness-record path, the event-ordering rule, and the resolved Claude Code `/loop` validation outcome."
    status: pending
---

# Comms Watch Liveness Floor

**Last Updated**: 2026-05-19
**Status**: 🔵 FUTURE — deferred past graph tooling under the broken/accelerator lens. **Scope reduced 2026-05-19**: Phase 2 (full-tuple identity-filter widening) absorbed into [`start-right-team-singleton-lane-remediation.plan.md`](../current/start-right-team-singleton-lane-remediation.plan.md) WS3 because the canonical-comms-path workstream already touches that surface. This plan retains the liveness-record substrate primitive, `check` companion, `/loop` validation experiment, and the polling-vs-watch honesty reconciliation.
**Activation trigger**: graph-tooling work surfaces concrete watcher/liveness pain (silent watcher death, missing cadence on long-running agent sessions), OR a separate driver for the liveness-record primitive emerges. The self-echo risk that originally motivated this plan is now addressed by singleton-lane WS3.
**Scope**: Add the watcher-liveness substrate primitive that the
[`comms-watch-mechanism`](../../../reference/comms-watch-mechanism.md)
reference describes, tighten the watch filter to the full identity tuple,
and validate `/loop` as the host scheduler for the periodic `check`
companion on Claude Code.

---

## Context

The portable
[`comms-watch-mechanism`](../../../reference/comms-watch-mechanism.md)
reference describes the canonical substrate primitives for event-driven
directed-message intake plus an independent liveness floor. A grounding pass
of the current substrate against the reference's six MVS points showed that
the comms event-file directory, the per-event schema, the seen-events
directory, and the CLI surface are in place. Three substrate primitives are
missing or incomplete:

1. A **standalone watcher-liveness record** with the free-form `source`
   field. Today we conflate "agent is alive" with "claim is held"
   (`heartbeat_at` on claims). Those are different freshness questions: a
   watcher process can die while its parent session still holds claims.
2. **Identity-tuple filtering on the full PDR-027 tuple**
   `(agent_name, platform, model, session_id_prefix)`. The current
   `comms watch` implementation filters on `agent-name` plus optional
   `session-prefix`; platform and model are outside the filter. The
   reference names self-echo as a non-negotiable feedback-loop hazard.
3. The **`check` companion as a real command**. The `check` CLI topic
   already exists but is a stub that prints `ok`. It is the natural home
   for the periodic liveness writer driven by a host scheduler.

A related honesty issue surfaces from the grounding pass: `comms watch`
is currently a 500 ms poll loop, not filesystem-event-driven delivery.
The reference names "polling masquerading as watch" as an anti-pattern.
Either the implementation moves to true fs-events, or the command is
relabelled honestly.

The host-integration question the reference flags as open — does
Claude Code's `/loop ~270s` reliably drive a `check` command without
disrupting the reasoning context — is unresolved. The originating repo
paused its experiment; this repo will run its own.

## Non-Goals

- Schema canonicalisation of the comms event log (owned by the active
  hardening tail plan
  [`2026-05-12-collaboration-protocol-hardening-r1b-opener.md`](../../agentic-engineering-enhancements/current/2026-05-12-collaboration-protocol-hardening-r1b-opener.md)).
- Write-collision elimination across shared state files (owned by
  [`collaboration-state-write-safety.plan.md`](./collaboration-state-write-safety.plan.md)).
- Claim-heartbeat redesign — owned by
  [`claim-liveness-crash-reconciliation-and-session-forensics.plan.md`](./claim-liveness-crash-reconciliation-and-session-forensics.plan.md).
  Claim liveness and watcher liveness are distinct primitives; this plan
  adds the second, that plan owns the first.
- Coordinator roles, tier rankings, or reliability hierarchies. The
  reference rejects those framings; this plan stays at substrate level.

## Relationship to Existing Plans

- **Sibling**, not subordinate, to the hardening tail plan. Different
  concern: reliability floor vs. schema canonicalisation.
- **First concrete liveness slice** of the strategic future brief
  [`collaboration-state-domain-model-and-comms-reliability.plan.md`](../future/collaboration-state-domain-model-and-comms-reliability.plan.md).
  The future brief should grow a cross-link to this plan once the slot
  is allocated.
- **Sequenced after** Step 2 (singleton-lane remediation) of the
  token-remediation program closes, per the thread record's program
  advancement rule.

## Acceptance

- **A1**: A liveness-record schema lives under
  `.agent/state/collaboration/` with `agent_id` (identity tuple),
  `last_alive_at`, and free-form `source` string. No enum type on
  `source`.
- **A2**: `comms watch` writes a liveness record with
  `source: "watcher"` on each tick.
- **A3**: `pnpm agent-tools:collaboration-state check` writes a
  liveness record with `source: "check"` and exits.
- **A4**: `comms watch` filters on the full PDR-027 identity tuple. A
  unit test proves a same-name-different-platform peer is not
  self-excluded and a same-tuple self-write is excluded.
- **A5**: The honesty reconciliation in Phase 3 lands one of:
  (a) true fs-event-driven delivery under `comms watch`, or
  (b) honest relabelling that names the cadence (e.g. `comms poll`
  with `watch` retained as a thin wrapper once fs-events are added
  later).
- **A6**: A 30+ minute Claude Code session has driven the `check`
  command via `/loop ~270s`, with observed cadence and any reasoning-
  context disruption recorded in the reference doc.
- **A7**: The reference doc names the CLI invocation, the liveness-
  record path, and the ordering rule (sort by `created_at` for
  delivery).

## Validation

- Targeted unit tests for the liveness writer, the full-tuple filter,
  and `check` one-shot semantics.
- An integration test that runs `comms watch` and a peer `comms append`
  concurrently and asserts no self-echo on the full tuple.
- The `/loop` experiment captured as a short evidence note under
  `.agent/plans/agent-tooling/current/` with timestamps and outcome.

## Open Questions for Owner

- **Q1**: Slot — does this land alongside the hardening tail plan as a
  parallel slice, or after the tail plan's Wave 4 (markdown→JSON
  migration)? Default: parallel slice, but only after Step 2 of the
  token-remediation program closes.
- **Q2**: Phase 3 honesty reconciliation — preferred resolution is
  fs-event-driven delivery (chokidar-equivalent), but the simpler
  landing is honest relabelling. Owner call.
- **Q3**: Liveness-record path convention — proposed
  `.agent/state/collaboration/liveness/<tuple-key>.json` where
  `<tuple-key>` is a stable hash of the identity tuple. Confirm or
  propose alternative.
