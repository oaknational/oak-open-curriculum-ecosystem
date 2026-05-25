---
pdr_kind: contract
---

# PDR-078: Liveness-Heartbeat Contract

**Status**: Accepted
**Date**: 2026-05-24
**Adopted**: 2026-05-25
**Related**:
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads, sessions, and agent identity — the heartbeat subject
line carries the identity tuple this PDR's identity-rendering
discipline binds to);
[PDR-063](PDR-063-mid-cycle-retirement-protocol.md)
(mid-cycle retirement protocol — the retirement-threshold this
contract names triggers the per-cycle handoff protocol when a
heartbeat-emitting role retires under token pressure);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(coordinator handoff two-moments — the coordinator-handoff grace
window is one of the named heartbeat-exemption classes; the
contract defers to PDR-064 for the boundary specification);
[PDR-079](PDR-079-pdr-vs-adr-portability-distinction.md)
(PDR-vs-ADR portability distinction — this PDR is authored under
PDR-079's portability rule: the contract is portable; the
repo-bound phenotype that operationalises it lives in a separate
ADR, named in the practice-index bridge rather than linked from
this body);
ADR-186 (the repo-bound phenotype substrate that operationalises
this contract in the current host repository — heartbeat events
bind to the comms-event substrate's `lifecycle` kind with
`event_type='heartbeat'`, rendering via the ADR-183 tag-namespace
`[HEARTBEAT]` token; cited by ADR identifier only, per PDR-079
PDR↔ADR cross-reference discipline).

## Context

Multi-agent operation under bounded per-agent context budgets
depends on the team being able to distinguish an agent that has
gone quiet from an agent that is actively working but not
broadcasting. Without a structural liveness signal, peers cannot
tell when a role has retired silently; coordination falls back to
out-of-band signals (owner intervention, manual roster sweeps)
that scale poorly and burn owner attention.

The cure is a portable liveness-heartbeat contract: every active
agent emits a periodic heartbeat event into the shared comms-event
substrate; peers and tooling consume heartbeats as the canonical
signal of "this agent is still active." Quietness past a named
threshold is itself a signal: the role is unobserved-live and the
team treats it as retired-pending-confirmation.

Two distinct failure modes shaped the contract:

1. **Heartbeat redundancy under busy work.** A role doing
   substantive work emits substantive events frequently. A cron
   heartbeat firing on top of substantive activity wastes
   substrate volume and noises the comms surface. The contract
   names a redundancy rule that suppresses the heartbeat when a
   substantive event from the same role has fired recently.

2. **Heartbeat blockage during legitimate quiet windows.** Some
   work shapes legitimately exceed the heartbeat cadence between
   substantive events — sub-agent dispatch waiting on
   verdict-synthesis, marshal-cycle contiguous-execution against
   the gate-chain, coordinator-handoff role-transition between
   the two moments. The contract names exemption classes so the
   threshold does not falsely retire a role that is legitimately
   quiet for a known reason.

## Decision

The Liveness-Heartbeat Contract has five named clauses. Clause 5 was
added by the 2026-05-25 amendment; see §Revision history.

### 1. Emit-side: cadence

Every actively-seated role emits a heartbeat event at a default
cadence not exceeding four minutes. The cadence is per-role, not
per-agent — a single agent holding multiple roles emits one
heartbeat per role per cadence window, with the role named in the
event metadata.

The heartbeat event:

- Carries the emitter's identity tuple (agent name + canonical
  identifier) in the event subject.
- Carries a one-line posture summary in the event body
  (current intent, active claim identifier where applicable,
  branch state where applicable).
- Is tagged with the canonical heartbeat tag so consumers can
  filter heartbeats from substantive events at the namespace
  layer.

### 2. Emit-side: cron-redundancy rule

A scheduled heartbeat fire MUST be suppressed when the same
role-identity has authored any substantive comms event
(broadcast, directed, acknowledgement) within the cadence window
preceding the scheduled fire time. Substantive events imply
liveness, so the heartbeat would be a redundant signal.

The rule's effect is that a role doing substantive work skips
heartbeats opportunistically; a role legitimately quiet emits
them on cadence; a role unobserved-quiet stops emitting and is
detected by the observe-side threshold.

### 3. Observe-side: retirement threshold

A role that has emitted no event (heartbeat or substantive) for
a threshold-class window exceeding ten minutes is treated by
peers as **retired-pending-confirmation**. The team's next move
is the standard mid-cycle retirement protocol per PDR-063: any
open claim is captured into a handoff record; the role-class
authority transfers per its own role-transition shape (per
PDR-064 for coordinator class; per the marshal cycle-discipline
PDR for marshal class; ad hoc otherwise).

The threshold is a soft signal, not an immediate retirement
decision. Owner direction overrides; peer judgement may extend
the window when a role is known to be in a long-execution
exemption phase (see Exemptions below).

### 4. Exemptions

Three named exemptions suspend the threshold without suspending
the cadence rule:

- **Coordinator-handoff grace window** — between the
  pre-positioning event and the active-acknowledgement event
  (per PDR-064), the outgoing coordinator's heartbeat is paused
  by design. The threshold extends to cover the window's
  expected duration; peers do not retire the outgoing role
  before active-acknowledgement transfers authority.
- **Marshal-cycle contiguous-execution** — a marshal seat
  executing a cycle (stage, gate-chain, commit, broadcast) holds
  contiguous focus that the cadence may exceed. The threshold
  defers until the marshal emits the cycle-boundary tree-green
  broadcast or the cycle abandons.
- **Sub-agent dispatch verdict-synthesis** — an agent waiting
  on a sub-agent reviewer's verdict synthesis cannot
  meaningfully emit substantive events until the verdict
  returns. The threshold defers until the sub-agent returns or
  the dispatching agent abandons the dispatch.

Exemption windows MUST be observable on the comms-event
substrate before the threshold fires — the outgoing
pre-positioning event for the coordinator-grace exemption; the
marshal-request event for the marshal-cycle exemption; the
sub-agent dispatch event for the verdict-synthesis exemption.
Without an observable opening event, the exemption does not
apply and the threshold fires normally.

### 5. Substrate category: heartbeats are liveness infrastructure

Heartbeat events are categorically **liveness-signal
infrastructure**, not a delivery substrate for inter-agent
content. The category is invariant: the cron-redundancy rule
(§2) governs the cadence relationship between heartbeats and
substantive events, but it does not collapse the category
distinction.

Two consequences flow from the category invariant:

- **Substantive content does not become a heartbeat by
  tagging.** An agent with a query, decision, sidebar request,
  acknowledgement, or any peer-directed content MUST emit it
  via the appropriate event class (broadcast, directed,
  acknowledgement). Re-tagging such an event as a heartbeat to
  satisfy cadence is forbidden; the cron-redundancy rule
  already permits the substantive event to suppress the
  cadence-scheduled heartbeat, so the tag-overload pattern
  serves no liveness purpose and corrupts both surfaces.
- **Heartbeat events do not carry substantive payloads.** The
  one-line posture summary named in §1 binds mechanically to
  current state (active claim identifier, current intent label,
  branch state). It is read by tooling computing the
  retirement threshold (§3) and by peers confirming a role is
  observed-live. It is not a free-form delivery channel for
  peer-directed content; if substantive content arises, the
  agent emits the appropriate event class and the
  cron-redundancy rule suppresses the next scheduled heartbeat.

The category is portable: any host implementing this contract
applies the same invariant on its own comms-event substrate,
independent of the canonical heartbeat tag-token the
repo-bound phenotype ADR chooses.

## Mechanism

The contract operates on the existing comms-event substrate
without introducing a new event schema. The repo-bound
phenotype ADR (named in the practice-index bridge) chooses the
specific event kind, discriminator field, and render-token
shape for heartbeat events. The emit-side cadence is enforced
by per-host scheduling (cron, timer, scheduled-task primitive
— host-local choice); the observe-side threshold is enforced
by per-host watcher tooling that tails the comms-event stream
and applies the threshold window per identity-row.

The contract names the boundary discipline (cadence, threshold,
redundancy rule, exemptions) and the substrate-shape invariants
(comms-event stream + identity tuple + a host-chosen canonical
heartbeat discriminator). The host-specific implementation
(which event kind, which discriminator field, which scheduler,
which watcher, how the threshold is rendered to peers, which
CLI surfaces emit and consume heartbeats) lives in a repo-bound
phenotype ADR recorded in the practice-index bridge, not in
this PDR body.

## Cascade

This PDR carries downstream amendments at the implementation
side, not at the contract side:

- The repo-bound phenotype ADR (named in the practice-index
  bridge) records the host's choice of scheduler, watcher,
  event schema, and CLI integration. The ADR is the repo-bound
  counterpart to this portable contract; the contract is
  unchanged when the host substrate evolves.
- Host SKILL surfaces (the start-right surfaces, the
  closeout-contract surfaces) reference this contract by PDR
  identifier when prescribing heartbeat emission and retirement
  threshold handling. The SKILL surfaces are not themselves
  amended by this PDR; the citation is a forward-pointing
  reference each SKILL absorbs in its own landing cycle.

## Notes

### Identity rendering on heartbeat subjects

A heartbeat event's subject line carries the emitting role's
identity tuple (agent name plus canonical identifier per
PDR-027 + PDR-076a). The identity tuple is the routing-key for
peers consuming heartbeats; the subject-line rendering is the
chat-readable short form. Two roles held by the same agent
emit two distinct heartbeats per window.

### Exemption observability discipline

Each exemption fires against an opening event already present
in the substrate. This is the substrate-as-canonical-truth
discipline applied to the heartbeat surface: exemptions cannot
be claimed retroactively to defend a missed heartbeat; the
opening event must precede the heartbeat-miss.

### Threshold tolerance

Ten minutes is a default. Per-host adjustment is permitted when
the host's overall work-shape mix has a different
substantive-event base rate, but the rule shape (cadence,
threshold, exemption discipline) is portable. The default is
calibrated against multi-agent windows where most work emits a
substantive event in less than ten minutes; if the host's work
shape diverges, the threshold widens proportionately.

### Forward-extensible exemption list

The three named exemptions are the observed-class set. New
exemption classes graduate from worked-instance evidence via the
host's pending-graduations discipline; the contract is updated
as exemption classes graduate, not pre-empted with hypothetical
classes.

## Consequences

### Enables

- A portable liveness signal that any host adopting this
  contract can implement against its own scheduler, watcher,
  and event-stream substrate.
- A non-noisy heartbeat surface: substantive work skips
  heartbeats; quiet work emits them; unobserved quiet retires.
- A bounded threshold mechanism that peers can apply
  consistently without per-role disambiguation: every role
  that opens an exemption-class window emits the opening event;
  every role outside an exemption is subject to the threshold.

### Forbids

- Heartbeat emission without identity-tuple rendering on the
  subject line.
- Retroactive exemption claims (claiming an exemption after a
  threshold-firing has already begun without a substrate
  opening event).
- Substituting a non-comms-event substrate for the canonical
  heartbeat surface (separate log files, side channels,
  out-of-band claims). Liveness lives on the comms-event stream
  per PDR-066.
- Tagging a substantive comms event (broadcast, directed,
  acknowledgement) with the canonical heartbeat tag to satisfy
  cadence. Per §5, heartbeat substrate is liveness
  infrastructure; substantive events suppress the next
  cadence-scheduled heartbeat via §2, but they do not become
  heartbeats by tag.
- Embedding substantive payloads (peer queries, decision
  prompts, sidebar requests, escalation triggers) in heartbeat
  event bodies. Per §5, the heartbeat body binds mechanically
  to current state; substantive content emits via the
  appropriate event class and the cron-redundancy rule
  suppresses the redundant heartbeat.

### Accepted Costs

- Substrate volume from periodic heartbeats. Bounded by the
  cron-redundancy rule; observed cost is acceptable against the
  liveness signal it provides.
- Per-host implementation work: scheduler + watcher + filter on
  the canonical heartbeat tag. The host phenotype ADR records
  the chosen implementation.

## Falsifiability

This contract is falsifiable on four axes:

- A role observed actively working (substantive events firing
  at less than the threshold interval) that is nevertheless
  treated as retired by peers — direct evidence the
  cron-redundancy rule is not being applied consistently.
- A role legitimately quiet under a named exemption whose
  threshold fires anyway — direct evidence the exemption-
  observability discipline is breaking down (opening events
  not being emitted or not being read).
- Substrate-volume cost from heartbeats consistently dominating
  the substantive-event volume over a long observation window —
  evidence the cadence is mis-calibrated and the rule shape
  needs adjustment.
- A heartbeat surface populated with substantive content
  (peer-directed queries, decision prompts, sidebar requests)
  or substantive events repeatedly tagged as heartbeats —
  direct evidence the substrate-category invariant (§5) is
  not holding.

The contract succeeds when liveness is structurally observable
without owner intervention, exemption classes apply cleanly to
the work shapes they were named for, and heartbeat volume stays
secondary to substantive event volume in normal operation.

## Owner direction (source-of-record)

The heartbeat-cadence rules emerged from multi-agent windows
where role-retirement under context-budget pressure produced
silent-failure observations: roles whose identity authority
persisted in claim state past the role's effective retirement,
peers acting on stale role-status, owner intervention required
to surface the retirement and re-route work. The contract
codifies the structural cure: liveness as a first-class signal,
threshold as the retirement boundary, exemptions as the named
extensions to the threshold for work-shapes that legitimately
exceed cadence.

Owner critique recorded against the heartbeat surface during
multi-agent operation: heartbeats accumulating substantive
content payloads, and substantive broadcasts being tagged as
heartbeats to keep cadence, conflated the liveness-signal
substrate with the inter-agent delivery substrate. §5 (added by
the 2026-05-25 amendment) codifies the category invariant the
critique surfaced: the cure is structural separation of
substrate categories, not a per-instance reminder discipline.

## Revision history

- 2026-05-25 — Added clause §5 ("Substrate category: heartbeats
  are liveness infrastructure") inside §Decision, two
  corresponding entries under §Consequences §Forbids, a
  fourth falsifiability axis, and a §Owner direction paragraph
  recording the substrate-category critique. The amendment lands
  WS4 item #1 of the n=2/coordination-efficiency program
  (`heartbeats-are-infrastructure` per Fred's framing during the
  plan-authoring session — clause-inside-PDR, not new rule).
  Substance preserved verbatim across the amendment surfaces:
  the new category invariant elaborates the cron-redundancy rule
  in §2 without contradicting it.
