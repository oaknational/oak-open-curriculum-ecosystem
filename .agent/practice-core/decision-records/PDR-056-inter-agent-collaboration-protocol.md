---
pdr_kind: governance
---

# PDR-056: Inter-Agent Collaboration Protocol — Ten Named Cures

**Status**: Accepted (cure substance is doctrine; per-cure validation
status is recorded inline)
**Date**: 2026-05-10
**Related**:
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads-sessions-and-agent-identity — identity preflight + thread
discipline that the protocol cures compose with);
[PDR-049](PDR-049-memory-and-state-file-merge-semantics.md)
(memory and state file merge semantics — collaboration-state surfaces
that the protocol fires on);
[PDR-050](PDR-050-state-memory-substrate-contracts.md) (state and
memory substrate contracts — claims, comms, queue surfaces this PDR's
cures extend);
[PDR-053](PDR-053-orchestrator-vs-gate-structural-cure.md) (advisory-
polarity discipline — relevant to commit-flow cures (ix) below);
[PDR-055](PDR-055-cli-affordance-set-discipline.md) (CLI affordance-
set — cure (v) below is the inter-agent-comms specific application).

## Context

Multi-agent coordination at small N (3–7 concurrent agents) surfaced a
recurring failure-mode set during the 2026-05-03 Pelagic ↔ Misty Task
M1 round-trip and follow-on sessions. The failure modes are:

1. *Out-of-band-direction reading drift* — when an agent acts on owner
   direction received outside the comms log, peers reading the comms
   log later infer wrong sequencing (the action looks unprovoked).
2. *Path-overlap claim conflicts on non-conflicting modes* — two
   agents legitimately reading the same file under different intents
   collide because the claims schema does not express read-vs-write.
3. *Stale-but-fresh-looking claims* — claims past their ETA without
   heartbeat continue to show as "active", blocking peers and
   misrepresenting the agent's actual state.
4. *Round-trip cost on under-specified task offers* — the task
   issuer's spec did not name the fallback path, forcing the
   acceptor to round-trip a clarifying question or unilaterally
   decide.
5. *Manual JSON authoring inertia* — comms-event ceremony (UUID,
   ISO timestamp, identity fields, schema validation) under
   time-bounded coordination windows is the bottleneck, not the
   substance.
6. *Wall-clock drift* — agent-side timestamps drift relative to
   each other; sequence reconstruction is unreliable when
   `created_at` is agent-local.
7. *Conversation threading is invisible in render* — the rendered
   shared-comms-log is flat; reply chains and audience-filtering
   are not surfaced.
8. *Worker-side empirical discoveries do not propagate* — when an
   acceptor discovers mid-task that the spec is wrong (the world
   does not match the assumption), the discovery often surfaces
   only in the closing comms event, by which time the orchestrator
   has continued on the wrong assumption.
9. *Premature commit costs* — committing before task-close and
   counterparty acknowledgement makes self-correction expensive.
10. *No-ack-on-deadlined-defaults* — when a task offer carries
    a deadline + default action, the acceptor's silent absence
    cannot be distinguished from unawareness; the orchestrator
    cannot rely on the deadline.

Source surfaces: experience file
[`experience/2026-05-03-pelagic-two-way-agent-communication-reflection.md`](../../experience/2026-05-03-pelagic-two-way-agent-communication-reflection.md);
napkin entries from Pelagic Washing Anchor and Misty Ebbing Pier on
2026-05-03; the empirical hypothesis-evolution surfaces at
[`prompts/agentic-engineering/collaboration/hypothesis.md`](../../prompts/agentic-engineering/collaboration/hypothesis.md) +
[`falsification-criteria.md`](../../prompts/agentic-engineering/collaboration/falsification-criteria.md) +
[`experiments.md`](../../prompts/agentic-engineering/collaboration/experiments.md).

## Decision

Adopt the following ten named cures as inter-agent collaboration
protocol substance. Each cure carries an explicit *validation status*:

- **Validated**: empirical evidence at N≥3 distinct sessions.
- **Hypothesis**: substance captured and proposed; awaiting empirical
  validation.

Cures are graduated as protocol substance now (the documentation
graduation); the validation status travels with each cure and updates
as evidence accumulates.

### Cure (i) — Out-of-band brief acknowledgement

When an agent acts on owner direction received outside the comms log,
the *first* comms event the agent posts after receiving the direction
MUST cite the out-of-band source explicitly (e.g.
`out_of_band_source: "owner direct message via session prompt at <iso>"`).
Peers reading the comms log have a temporal anchor for the otherwise-
unprovoked action.

**Status**: Hypothesis. Single instance (Misty's pre-existing claim
read as temporal anomaly by Pelagic) plus owner-stated reflection.
Validation: N≥3 sessions where the citation prevents downstream
temporal-anomaly framing.

### Cure (ii) — Read/write claim mode field

Extend `active-claims.json` schema with a `mode` field:
`'read' | 'write' | 'mutual-exclusive'`. Non-conflicting modes (two
read claims on the same path) coexist; write claims on overlapping
paths block; `mutual-exclusive` is the legacy default.

**Status**: Hypothesis. Single observed instance (smoke-tests-workspace
path overlap). Validation: N≥3 path-overlap-without-real-conflict
sessions where the mode field correctly resolves.

### Cure (iii) — Heartbeat-or-die enforcement

Claims past `claimed_at + (declared_eta * 1.5)` without an updated
`heartbeat_at` are stale. The orchestrator (or any peer) may reclaim,
escalate to owner, or auto-archive depending on the surface's
escalation policy.

**Status**: Hypothesis. ETA-decay observed in M1 round-trip. Validation:
N≥3 sessions where stale-claim detection unblocks coordination
without false-positive on legitimately-long claims.

### Cure (iv) — Overflow protocol in task offers

Task issuers MUST include explicit fallback-path language when offering
non-trivial tasks: *"if the spec is too tight to deliver, do X; do not
unilaterally Y"*. The acceptor reading the spec has a contract for
under-specification.

**Status**: Hypothesis. Single instance (M1 hybrid-vs-inline question
round-trip). Validation: N≥3 task offers where overflow protocol
prevents round-trip cost.

### Cure (v) — `comms` CLI ergonomics

The `comms` CLI surface gains four affordance commands per PDR-055's
affordance-triple discipline plus inter-agent-specific helpers:

- `comms reply <event-id>` — auto-populates `in_response_to`, inverts
  `audience`, opens an editor for the body.
- `comms watch [--audience <agent>]` — non-blocking polling iteration
  surfacing new events for the named audience.
- `comms pending` — events with `audience` containing the current
  agent and no later reply from this agent.
- `comms heartbeat <claim_id>` — emits a heartbeat-event-shaped JSON
  for a named claim.

**Status**: Hypothesis (carrier-plan implementation pending). Substance
graduates here as the affordance contract; implementation slices in the
agent-tooling enhancement plan.

### Cure (vi) — Wall-clock authority

`created_at` for comms events MUST be derived from `date -u` on the
host shell (or equivalent canonical UTC source), not from agent-local
clock state. The host shell is the single authority on wall-clock for
sequence reconstruction.

**Status**: Hypothesis. Implicit failure mode in M1 round-trip;
explicit cure named by Misty Ebbing Pier. Validation: N≥3 sessions
where host-shell wall-clock prevents sequence reconstruction errors.

### Cure (vii) — Render conversation threading

The rendered `shared-comms-log.md` (and any equivalent rendered view)
groups events by `audience` and `in_response_to`, surfacing reply
chains as conversation trees rather than as a flat append-log. The
`audience` and `in_response_to` fields are promoted to canonical
schema requirements.

**Status**: Hypothesis. Flat-render fragility observed in M1. Validation:
N≥3 multi-thread sessions where threaded render improves coordination
legibility.

### Cure (viii) — Worker initiates on empirical surface

The acceptor of a task discovers mid-execution that the spec's
assumptions are wrong (the world does not match). The acceptor MUST
surface a comms event NAMING the empirical discovery before continuing
on the corrected assumption. The orchestrator MUST poll that signal
before continuing on the original assumption.

**Status**: Hypothesis. Single instance (Misty's hybrid-vs-inline
discovery). Validation: N≥3 worker-discovers-spec-error sessions where
the comms-first protocol prevents downstream propagation.

### Cure (ix) — Defer commit until task-close + counterparty acknowledgement

For tasks that span multiple agents, commits land *after* task-close
(task issuer marks the task complete) AND counterparty acknowledgement
(acceptor confirms the close). Premature commits make self-correction
expensive when worker-side empirical discoveries (cure viii) require
backout.

**Status**: Hypothesis. Inferred from M1 cost-of-self-correction
observation. Validation: N≥3 multi-agent tasks where deferred commit
preserves cheap backout.

### Cure (x) — Wait-for-ack on deadlined defaults

When a task offer includes `deadline` and `default_action_if_no_ack`,
the orchestrator must wait *for an explicit acknowledgement-or-reject*
event before treating the deadline as elapsed. The acceptor's silent
absence cannot be distinguished from unawareness; the deadline-default
fires only on explicit acknowledgement (or after a separately-defined
escalation timeout).

**Status**: Hypothesis. Worker-perspective companion to cure (iv).
Validation: N≥3 deadlined-default tasks where wait-for-ack prevents
false-default firings.

## Scope

**Adopter scope**: every Practice-bearing repo with multi-agent
collaboration on shared state. The cure shapes are portable; the
specific schema fields, CLI commands, and render formats are
operational forms that each repo's substrate adopts.

**Out of scope**: cure implementation sequencing. The host enhancement
plan (`agent-tooling/`) tracks the implementation slices; this PDR
records the cure substance as graduation-ready doctrine.

## Rationale

The original entry's framing — *"cures graduate to permanent doctrine
after empirical validation at N≥3, not before"* — preserves a
legitimate epistemic discipline: hypothesis vs settled doctrine.
Owner reframe (2026-05-10) names the discipline-as-deferral-vocabulary
failure mode: the *substance* of the cures is fully captured; gating
documentation graduation on N≥3 hides the substance from future agents
who could otherwise apply the cures and contribute to validation.

The graduation pattern adopted here:

- The cure substance is graduated *now* (the PDR is written, the cures
  are named, the failure modes are explicit).
- The validation status is part of the substance — each cure carries
  *Hypothesis* until N≥3 evidence accumulates, then *Validated*.
- Future agents apply the cures; their applications generate the
  empirical evidence. The PDR's status updates inline as evidence
  accumulates rather than blocking the substance behind the evidence.

This shape is consistent with PDR-055 (CLI affordance discipline)
and PDR-053 (advisory polarity): substance graduates at the moment
it is fully captured; downstream surfaces (validation, implementation)
ride on the substance, not in front of it.

## Consequences

**Required**:

- The ten cures are reference doctrine for inter-agent collaboration
  on shared state. Each cure's *Status* line is the live evidence
  marker.
- New cure candidates land as additional sections on this PDR with
  their own Status; the PDR is the authoritative collaboration-cure
  index.
- Implementation slices for the cures (schema extensions, CLI
  commands, render changes) live in the agent-tooling enhancement
  plan; the plan cites this PDR's cures by name.
- Validation evidence for each cure is recorded inline as the Status
  line is updated. Evidence accumulation is itself part of the
  substance.

**Forbidden**:

- Treating the cure substance as "not doctrine" because validation
  status is *Hypothesis*. The substance graduates; the validation
  status is part of the substance.
- Promoting a *Hypothesis* cure to *Validated* without N≥3 distinct
  sessions of evidence. The discipline is the substance's epistemic
  shape, not a deferral gate on the substance.

**Costs**:

- Each cure that lands implementation surface area (schema, CLI,
  render) carries a one-time host-architectural cost. The costs are
  amortised across multi-agent sessions.

## Source

This PDR graduates the substance of the
`pending-graduations.md` entry *"inter-agent collaboration protocol
gaps surfaced by Pelagic ↔ Misty Task M1 round-trip"* (captured
2026-05-03; deferred under fabricated `vaporware-gated(CLI-ergonomics-plan); empirical-N>=3-validation-required` vocabulary
across multiple sessions until owner reframe in the
`knowledge graduation` session 2026-05-10). The empirical
hypothesis-evolution surfaces at
[`prompts/agentic-engineering/collaboration/hypothesis.md`](../../prompts/agentic-engineering/collaboration/hypothesis.md) +
falsification + experiments remain the live empirical surface where
each cure's evidence accumulates; this PDR is the substance index.
