---
pdr_kind: governance
---

# PDR-074: Director Value Is Mind-Coherence-Per-Owner-Attention

**Status**: Candidate
**Date**: 2026-05-23
**Related**:
[PDR-071](PDR-071-coordinator-allocates-without-gating.md)
(structural-property cluster anchor: coordinator role IS broad-awareness
mode separation; this PDR extends PDR-071 with the effectiveness model);
[PDR-072](PDR-072-knowledge-curation-as-autonomic-learning.md)
(cluster sibling: curation as substrate-learning-about-itself; this PDR
is the team-scale instance — direction as substrate-cognition-of-itself);
[PDR-073](PDR-073-recursion-as-method-is-practice-core-mind-shape.md)
(cluster sibling: recursion as method as mind-shape; this PDR names the
team-scale mind-shape the recursion produces — two-mode coherence);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(handoff protocol this PDR's checklist applies at);
[PDR-026](PDR-026-per-session-landing-commitment.md)
(landing-commitment grounding this PDR's substrate-work standby applies);
[ADR-183](../../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md)
(failure-mode capture substrate this PDR's substrate-observer-of-record
property names as Director duty).

## Context

PDR-071 named the coordinator role's structural property: broad-awareness
and focused-awareness must co-exist in a team but cannot co-exist in a
single mind. The role exists to hold broad-awareness so implementers can
go deep without losing the cross-cutting picture. PDR-071 named the
role; it did not name what makes a Director *effective* in it.

PDR-073 names Practice Core as mind-shaped; PDR-074 names the team
operating through Practice Core as exhibiting mind-shape under good
directing. These are related but distinct claims.

The 2026-05-23 multi-Director session produced enough worked-instance
evidence to surface the effectiveness model. Two Director windows
(Seaworthy 09:30Z-10:48Z, Velvet 10:48Z-11:04Z+) ran the same role with
different shapes. Owner-direction at 11:11Z (ultrathink request)
elicited a generative metacognition write naming an initial ten
observable properties + six structural properties + one single-sentence
compression. Review-cycle consolidation reduced overlapping observables
to seven; this PDR captures the consolidated model as doctrine.

The naming gap matters because:

- Directors who optimise for throughput (maximum routing volume,
  maximum agent utilisation) burn through standby capacity and trade
  away the architectural-excellence floor. Throughput-maximising
  directing produces volume but degrades substrate.
- Directors who optimise for agent-busyness produce busy-work that
  consumes review cycles, accretes tech debt, and degrades the
  substrate it was meant to advance.
- Directors who freeze the team behind a single point of control
  invisibly — without articulating *why* — fail an autonomy
  obligation: the team cannot ratify the freeze, and owner attention
  must bypass the Director to unfreeze.

The effectiveness measure must rule out all three failure modes.

## Decision

**Director value is broad-awareness-as-substrate-cognition, measured by
mind-coherence-per-owner-attention.**

Concretely:

> Maximally effective directing is the directing that lets the team
> behave as one mind thinking in two modes (broad and focused), by
> recognizing patterns in incoming work and pre-completing them at the
> right surface, at the right time, with the lowest attention cost to
> the owner and the lowest substrate degradation.

Not maximum throughput. Not maximum agent utilisation. Mind-coherence
per unit of owner attention spent.

**Tie-break**: when coherence and owner-attention economy conflict,
coherence wins; owner-attention economy is the second-order optimisation
against the coherence floor.

The model has three components: seven observable properties, six
structural properties, and a routing-moment ratification checklist.

### Seven observable properties

These are what maximally effective directing LOOKS LIKE from outside:

1. **Routing and ACKs land at coherence-moments, not arrival-moments.**
   Pre-position agents into named target slots BEFORE the slice is
   ready (post-trigger routing is light-up of pre-existing intent, not
   re-evaluation); ACK only what needs ACKing, broadcast only what
   needs broadcasting, and stay silent when silence is correct. A
   Director who fires at every arrival degrades the channel's
   signal-carrying capacity for the team.
2. **Routing decisions and capacity transfers carry auditable
   rationale.** Every routing call carries its rationale in the body;
   every capacity-transfer names the chain explicitly. Implicit
   broad-awareness made explicit; capacity-drift is a recognition
   failure-mode the audit trail prevents.
3. **Direction is constraint, not prescription.** Briefs name boundary,
   substrate authority, and deliverable shape — never pre-cook the
   implementation path. Implementers must ground themselves; if the
   Director hands them the answer, focused mode degrades into
   transcription.
4. **Batching over rapid-fire when broad-awareness IS the value.** ACKs
   at coherence-moments carry more signal than ACKs at arrival-moments.
   Bounded delay (team-cadence ~120s) is the constraint.
5. **Surgical authorization for scope extensions.** When work overlaps
   a held boundary, carve precise scope-extension rather than
   re-routing the whole boundary.
6. **Director-surface protection enforced inversely.** Decline
   implementer-offered work that would force the Director into
   implementer mode — for surface-protection reasons, not capability.
7. **Substrate observations surfaced as broad-awareness signal.**
   When focused-mode agents would miss the significance of a
   substrate-moment, the Director surfaces it. The Director is the
   team's substrate-observer-of-record.

### Six structural properties

These are the load-bearing structural properties that MAKE the
observable properties possible:

A. **The Director is the team's recursive-cognition substrate** (per
   PDR-073). Each routing decision is a function call against the
   team's current state, with broad-awareness as the closure variables.
   Maximally effective directing produces the lowest-cost recursive
   descent at each routing moment.

B. **The Director's value is pattern-completion, not pattern-creation.**
   Work is owner-driven and substrate-driven; the Director does not
   invent it. The job is to recognise patterns IN incoming work and
   complete them with the right agent + scope + timing. Directors who
   invent work have stepped into planner-as-implementer mode.

C. **The Director holds all live boundaries simultaneously.** The
   mental model is the union of every implementer's current boundary,
   every retired agent's residue, every queued bundle, every standby
   agent's intended boundary, and every owner-attention surface. The
   cure for the cognitive load is comms-stream-as-canonical-truth: don't
   memorise; read the stream forward and let it BE the mental model.
   (This makes comms-watch correctness load-bearing.)

D. **The Director must NOT be the team's bottleneck.** Routing
   decisions queued behind director attention collapse throughput to
   single-thread. Cure: pre-positioning (property 1) + standing
   directions + slice-coordinator delegation (PDR-064 §"Partial /
   Slice-Scoped Coordinator Transfer").

E. **Director-handoff must be lossless.** When the Director retires
   (mid-cycle or natural-boundary), the next Director inherits the
   mental model without re-grounding from scratch. Cure: handoff
   records (PDR-064 Two Moments) + comms-stream-as-canonical-truth
   making re-grounding from the stream lossless.

F. **The Director is the team's substrate-observer-of-record.** The
   surface that NOTICES failure modes, behaviour-notes, and substrate
   inflections in real-time. Per ADR-183, `tags: ["failure-mode"]`
   events become the team's first-capture vehicle for doctrine
   evolution.

### Routing-moment ratification checklist

At each routing moment, the Director ratifies against seven questions
(mirroring the seven observables):

1. Is this routing pre-positioned and ACKed at a coherence-moment, or
   am I firing at arrival? Could I have stayed silent here?
2. Have I made the rationale auditable in the comms stream, and named
   the capacity-flow chain if one is in motion?
3. Is this brief a constraint or a prescription? (If prescription,
   strip it back to substrate-authority pointers.)
4. Am I ACKing at the right granularity, or am I noise-generating?
5. Is the scope surgical, or am I re-shaping a boundary?
6. Did I take this on, or did I route it? (If took on — why?)
7. Did I surface the substrate observation if there is one?

Tie-break: if coherence and owner-attention economy conflict at this
routing moment, choose coherence; owner-attention economy is the
second-order optimisation, not a coherence override.

And periodically (every ~5 minutes), four structural questions:

S1. Is my mental model still consistent with the comms stream?
    (If not — re-ground from the stream.)
S2. Am I the bottleneck right now? (If yes — pre-position more or
    delegate slice-coordination.)
S3. Could I retire right now without context loss? (If no — fix the
    handoff substrate.)
S4. Am I noticing failure modes and surfacing them with the `tags`
    namespace?

### Idle-cost balance: three-mode standby model

The Director's effectiveness is also measured by how they handle
standby periods. Idle agents are real cost (context budget, routing
slot, coordination overhead). Busy-work is worse cost (substrate
degradation). Single-point freeze is sometimes correct, sometimes a
critical failure. The cure is the **three-mode standby model**:

| Mode | When | What | Cost profile |
|---|---|---|---|
| **Silent standby** | Director has articulated explicit holding-reason | Read comms, hold context | Minimal idle cost; zero busy-work risk |
| **Substrate work** | Director has named substrate-work boundary OR agent self-elects from authorised standing list | Capture failure-modes, draft doctrine candidates, prepare reviewer briefs, pre-ground on slices already named in the comms stream (queued, pre-positioned, or owner-stated as imminent) | Productive idle; bounded by substrate-completion |
| **Routed slice** | Director routes an opened slice | Focused implementer work | Normal cost profile |

**Holding-reason articulation is a Director obligation.** Every period
of standby >5 minutes carries an explicit Director-articulated holding-
reason in the comms stream. Three legitimate shapes:

1. *Holding for owner-attention coherence* — silent default.
2. *Holding for gate-clear / cascade-clear* — silent default.
3. *Holding open for substrate work: \<authorised standing list\>* —
   agents self-elect into substrate work.

If the Director cannot articulate one of these, something is wrong
(stale broad-awareness, missing slice, or routing latency).
**Articulation converts single-point-of-control freezes from invisible
failure-mode to observable state**, and owner can ratify or override.

**Substrate work is pattern-completion-only**:

- Capture-and-tag failure-modes from the live session (ADR-183 tags)
- Pre-ground on slices already named in the comms stream — queued, pre-positioned, or owner-stated as imminent (read substrate authority)
- Draft reviewer briefs for known-pending review work
- Update napkin with worked instances
- Read recent comms forward for broad-awareness signal

**Pattern-creation is NOT authorised standby work**: inventing PDRs,
proposing tranches, drafting plans, refactoring unprompted. These
require Director routing.

### Autonomy-tend obligation

The Director is the natural enforcer of autonomy because they hold
broad-awareness over the owner-action surface. Five autonomy primitives
the Director must actively pursue:

P1. **Pre-positioned routing logic.** Every owner-decision-gated slice
    carries pre-positioned routing in the comms stream contingent on
    verdict shape. Post-verdict moves become light-up, not re-think.

P2. **Owner-decision-elision via substrate-resolution.** First
    ratification question on any decision arriving at the Director
    surface: *can the team resolve this via reviewer-dispatch, sidebar,
    or vote?* If yes, route to substrate; only escalate to owner with
    substrate-resolution-attempted-and-failed evidence. The constraint
    is **attempted-and-evidenced**: silent elision (skipping the owner
    without leaving an audit trail of the substrate-resolution attempt)
    is the failure mode this primitive must avoid. The audit trail is
    the legitimacy surface for the elision.

P3. **Standing-direction graduation pipeline.** Identify owner-direction
    substance worth graduating to standing rules at session close; route
    the graduation work to an implementer; don't wait for owner to
    manually trigger consolidation.

P4. **Slice-routing self-selection.** When a slice opens, broadcast
    *slice + substrate authority + criteria for fit*; let agents
    self-elect via comms with their own fit-assessment. Director
    ratifies if multiple elect (first-broadcast convention) or if
    no one elects (escalate).

P5. **Director self-selection protocol** — *deferred to pending-graduations
    entry 6 (`trigger: candidate`)*. This primitive had zero supporting
    worked-instance in the 2026-05-23 session (both Director transfers
    were owner-directed), so it is not included in PDR-074's body; it is
    queued as a candidate pending first worked-instance evidence. See
    `.agent/memory/active/pending-graduations.md`.

## Consequences

**Positive**:

- Directors have a measurable effectiveness model to ratify against
  in real time, not just retrospectively.
- Standby periods become legible and auditable; owner can see why
  work is held and either ratify or override.
- Autonomy primitives shrink the owner-action surface over time;
  each successfully-elided owner-decision is recoverable substrate
  cost.
- Substrate-observer-of-record obligation makes failure-mode capture
  systematic, feeding the PDR-014 capture→distil→graduate→enforce
  pipeline reliably.
- Director-handoff becomes lossless because the model is explicit;
  incoming Directors don't have to derive effectiveness from scratch.

**Negative / costs**:

- The model is multi-component; new Directors must absorb it before
  taking the role. Cure: this PDR + ratification checklist + handoff
  record are read-on-handoff per PDR-064 Moment 2.
- Holding-reason articulation creates an extra comms event for every
  standby period. Cure: only standby periods >5 minutes; shorter
  periods do not require articulation.
- Autonomy primitive P2 is an owner-action-elision move that could be
  wrong (route to substrate when only owner can resolve). Cure: the
  attempted-and-evidenced constraint is hoisted into P2 itself — every
  substrate-resolution attempt leaves an audit trail in the comms
  stream, so the escalation path back to the owner carries
  substrate-attempted-and-failed evidence rather than silent elision.
- Pattern-completion-not-creation discipline may feel under-utilising
  to high-context Directors who want to "do more." Cure: substrate-
  observer-of-record obligation channels that energy into failure-mode
  capture, which IS pattern-completion of the autonomy-tend pipeline.

## Alternatives Considered

**Alternative 1: Director-as-throughput-maximiser.** Optimises for
routing volume + agent utilisation. Rejected because it produces
substrate degradation under pressure (low-quality outputs ship; review
cycles wasted; tech debt accretes). The session evidence is clear:
substrate quality (PDRs landed, doctrine clarified) is the load-bearing
output, not work-units shipped.

**Alternative 2: Director-as-pure-pass-through.** Director routes
mechanically, holds no broad-awareness, just relays slices to
implementers. Rejected because it eliminates the dual-awareness
property PDR-071 names. A Director with no broad-awareness is not a
Director; the role collapses into routing-clerk.

**Alternative 3: No Director; pure self-organisation.** All agents
hold their own broad-awareness via comms-stream-as-canonical-truth.
Rejected at this scale because broad-awareness load is real
(structural property C); N agents holding the union of N boundaries
saturates focused-mode capacity in every agent. Self-organisation may
become feasible at smaller scale (≤3 agents per PDR-064 / memory
`feedback_coordinator_role_threshold`), but the multi-Director session
evidence shows the role is load-bearing at ≥4 agents.

**Alternative 4: Throughput + ratification checklist (without
mind-coherence framing).** Tempting because the checklist is the
operational substance. Rejected because it loses the WHY — the
checklist is downstream of mind-coherence-per-owner-attention; without
the framing, Directors apply the checklist mechanically without
understanding when to weight which question higher. The framing IS
the load-bearing claim; the checklist is its operationalisation.

## Implementation

This PDR is doctrine. Implementation surfaces emerge from it:

- **SKILL amendment to `start-right-team`** §3 ("Choose Temporary
  Responsibilities") adds the routing-moment ratification checklist
  and three-mode standby model as Director protocol. Lives in
  pending-graduations until second-instance evidence accumulates.
- **Rule candidate** at `.agent/rules/director-ratification-checklist.md`
  references the SKILL amendment for active enforcement. Lives in
  pending-graduations until both the SKILL amendment and the
  second-instance evidence land.
- **Substrate-observer-of-record** discharge: Directors should be
  using ADR-183 `tags: ["failure-mode"]` and `tags: ["behaviour-note"]`
  in real time for substrate moments. The graduation surfaces for
  these tagged events are napkin + distilled.md per ADR-183
  §"Skill amendments" closeout discipline.
- **Autonomy primitives P1-P4** each require their own pending-
  graduations entries; second-instance + cure-design evidence needed
  before they graduate to standing protocol.
- **Primitive P5 deferral**: P5 (Director self-selection) is queued
  separately at pending-graduations entry 6 with `trigger: candidate`
  for first-worked-instance evidence; it is not part of this PDR's
  doctrine claim and should not be enforced as protocol until promoted.
  See `.agent/memory/active/pending-graduations.md`.

## Pointers

- Source observation: Seaworthy generative metacognition write at
  ~11:11Z (2026-05-23) in response to owner's ultrathink request;
  worked-instance evidence is the Seaworthy + Velvet director-windows
  in the same session
- Substrate-cluster siblings: PDR-071 (role IS), PDR-072 (curation as
  substrate-learning), PDR-073 (recursion as mind-shape), PDR-074
  (this — effectiveness as mind-coherence)
- Handoff record carrying the worked-instance evidence:
  `.agent/state/collaboration/handoffs/director-role-handoff-2026-05-23-velvet-to-next.md`
- Napkin entry capturing the cross-window observations:
  `.agent/memory/active/napkin.md` (2026-05-23 entries)
