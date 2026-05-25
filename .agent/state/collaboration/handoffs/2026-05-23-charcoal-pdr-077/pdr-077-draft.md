---
agent_name: Charcoal Brazing Kiln
session_id_prefix: 7c7327
platform: claude
model: claude-opus-4-7
captured_by_agent_name: Charcoal Brazing Kiln
captured_by_session_id_prefix: 7c7327
captured_by_platform: claude
captured_by_model: claude-opus-4-7
captured_at: 2026-05-24T21:30:00Z
capture_class: substrate-from-tmp-to-durable-repo
preservation: byte-for-byte (source body between lint-disable markers)
intended_consumer: post-m1-attestation-tidy-up cycle 5 (PDR-077 final author)
created_at: 2026-05-23T20:32:00Z
last_updated_at: 2026-05-24T21:30:00Z
topic: pdr-077-marshal-as-cycle-discipline-draft
capture_origin_path: /tmp/charcoal-pdr-077-draft.md
role_in_lane: draft-artefact
---

<!-- markdownlint-disable -->

---
pdr_kind: governance
---

# PDR-077: Commit Marshal As Cycle-Discipline Role

**Status**: Candidate
**Date**: 2026-05-23
**Related**:
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(identity substrate — the Commit Marshal seat carries the same identity-tuple
discipline as any other role);
[PDR-063](PDR-063-mid-cycle-retirement-protocol.md)
(mid-cycle retirement protocol — names the intersection: a Commit Marshal
mid-cycle retirement fires both PDR-063 for any open cycle claim AND this
PDR's two-moments shape for the gate-singleton authority transfer);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(coordinator handoff two-moments — the Commit Marshal seat uses the same
pre-positioning + active-acknowledgement shape for role transitions, with
`git index/HEAD` authority as the analogue of the coordinator-cadence cron);
[PDR-066](PDR-066-comms-events-as-failure-mode-channel.md)
(comms-events as real-time channel — Commit Marshal cycle-boundary broadcasts
flow into the same stream);
[PDR-074](PDR-074-director-value-is-mind-coherence-per-owner-attention.md)
(Director value model — the Commit Marshal's existence preserves Director
context for routing decisions; the role-separation is a context-allocation
principle);
[PDR-075](PDR-075-director-substrate-writing-discipline.md)
(Director substrate-writing discipline — Commit Marshal cycle landings
emit substrate events into the same stream the Director writes into);
[ADR-185](../../../docs/architecture/architectural-decisions/185-comms-event-auto-acceptance-metadata.md)
(comms-event auto-acceptance metadata — composes with this PDR's
empirical-cure observation: throughput improves on multiple axes at once,
of which marshal-as-role is one).

## Context

In multi-agent rotating-cast operation under bounded per-agent context
budgets, a recurring failure mode is the **multi-window stall on
cure-cascades that no single Director window's context budget can
discharge end-to-end**. Each Director window inherits a queue of
orphan-class commits, retained-claim handoffs, and care-and-consult
substance from prior windows. When the same Director who routes the
substantive work also runs the commit ceremony, every cycle competes
with routing-decision context for the Director's bounded budget, and
the cycle that would have landed mechanical substance loses the
context-budget race.

The observed downstream shape: cure-cascades expand across multiple
Director windows; the same orphan-class substance survives four or
more consecutive Director handoffs without landing; each new Director
re-derives the ratification chain from scratch because the substantive
ratification trail has not been preserved on the canonical-truth
surface in a form that allows the next role-holder to act on it
without re-routing.

The structural shape parallels the **substrate-pointer-read-as-current-
state** anti-pattern from an adjacent angle — Directors read inherited
handoff substrate as if it were current state and act on the lagged
read. The cure-shape this PDR names short-circuits the staleness by
introducing a separable role whose entire context budget is the live
commit queue plus the ratification trail leading into it.

## Decision

Recognise the **Commit Marshal** as a distinct cycle-discipline role
within the practice framework, separable from but composable with the
Director and implementer roles. The Commit Marshal owns the boundary
between substantively-ratified work and the commit ceremony that lands
it. The Director owns routing authority and substrate-writing
discipline. The implementer authors substance under Director routing.
The three lanes share the canonical comms-event stream as the
substrate of record but maintain disjoint authority and disjoint
context budgets.

### Role Definition

The Commit Marshal seat holds:

- **`git index/HEAD` authority**: the seat is the only agent that
  stages, runs the husky gate-chain, and commits during its authority
  window. Multi-marshal contention on the same gate is the failure
  mode the gate-singleton invariant exists to prevent.
- **Cycle-protocol authority**: the seat owns the sequence
  marshal-request → claim-verify → stage-by-pathspec → husky-gate →
  commit → tree-green broadcast → close-claim.
- **Standing duty for coordination-substrate hygiene**: on tree-green
  windows between cycles, the seat opportunistically queues
  accumulated coordination substrate (comms events, claim-state
  drift, unclaimed memory updates) into hygiene cycles.

The Commit Marshal seat does NOT hold:

- Routing authority (that is the Director's lane).
- Substantive-ratification authority (that is the Director's via care-
  and-consult; or the implementer's via authoring within a routed
  boundary).
- Sub-agent reviewer dispatch authority for substantive decisions
  (that is the Director-routes-to-implementer path).

### Cycle Protocol

A canonical marshal cycle proceeds:

1. **Marshal-request**: an implementer (or an absorbing-orphan
   marshal) surfaces a directed comms-event naming the bundle
   (claim id, file scope, intent, pre-stage state).
2. **Claim-verify**: the marshal verifies the claim is active under
   the requestor's identity, the file scope matches the claim's
   intent, and pre-stage gates pass on the requestor's side.
3. **Stage-by-pathspec**: the marshal stages files by explicit
   pathspec rather than wildcard `git add -A`, to honour the
   stage-by-explicit-pathspec discipline.
4. **Pre-commit gate-chain**: the marshal runs the host's full
   pre-commit gate-chain. Gate-RED is blocking; never bypassed
   without fresh per-commit owner authorisation.
5. **Commit**: the marshal commits with a subject line that fits
   commit-msg lint constraints and honours the conventional-commits
   shape.
6. **Tree-green broadcast**: the marshal emits a broadcast comms-event
   naming the commit subject, file scope, gate-chain result, and
   downstream cycle triggers (e.g., adversarial reviewer dispatch on
   tree-green).
7. **Close-claim**: the marshal closes the consumed claim and
   surfaces the closure-event for the next-in-queue.

### Claim-State Immutability Invariant

Once a marshal-request event is emitted (step 1), the referenced
claim's scope field is frozen for the duration of that cycle. Any
Director-initiated scope change to a claim that has an outstanding
marshal-request MUST be surfaced as a blocking event to the marshal
before step 2 (claim-verify) proceeds. The Director does not mutate
claim scope unilaterally mid-cycle; the marshal-cycle claim-verify
step reads against the scope as stated at marshal-request time.

This invariant resolves the claim-state ownership question across
the Director–Marshal authority surface: the Director holds routing
authority over claim scope outside of an active marshal-cycle; the
Marshal holds verify-time authority over claim scope inside an
active cycle. The blocking-event handshake is the structural
mechanism that prevents a Director routing-mutation from racing
against a marshal claim-verify on the same claim-state.

### Gate-Singleton Invariant

Within a single branch authority-window, at most one Commit Marshal
seat is occupied. Two agents independently running the husky chain
against the same working tree is the failure mode this invariant
prevents. The invariant is currently enforced by team-coordination
discipline; its structural cure (a claim-area schema field marking
the marshal-seat-holder) is named in §Open Questions.

### Role-Transition Shape (Two Moments)

Commit Marshal role transitions use the PDR-064-equivalent two-moments
shape:

- **Moment 1 — Pre-positioning**: outgoing marshal broadcasts a
  narrative event with the conventional title *"Commit Marshal
  pre-positioning: \<outgoing\> → \<incoming\>"* carrying the queue
  state, in-flight cycle status, and the proposed incoming marshal.
- **Moment 2 — Active-acknowledgement**: incoming marshal broadcasts
  a distinct active-acknowledgement event with the conventional
  title *"Commit Marshal role acknowledgement: \<incoming\> from
  \<prior\>"*, referencing the pre-positioning event via
  `in_response_to`, naming the prior marshal, and declaring the
  cadence the incoming marshal will adopt.

Authority transfers only at Moment 2. The `git index/HEAD` authority,
the queue-state watcher, and the commit-window mediation authority
all continue with the outgoing marshal through Moment 1 and transfer
at Moment 2. The marshal-queue is paused, not contested, between the
two moments — an owner-accepted gap analogous to the coordinator-less
window PDR-064 names.

### Intersection With PDR-063 (Mid-Cycle Retirement)

When the Commit Marshal must retire mid-cycle under context-budget
pressure, BOTH PDR-063 and this PDR fire:

- **PDR-063 governs the per-cycle handoff**: the open cycle claim
  freezes to a handoff record under PDR-063 step 2; the receiving
  marshal reads the record before any source edit.
- **This PDR governs the role-level transfer**: the marshal-seat
  authority transfers via the two-moments shape above. The role-level
  pre-positioning event is distinct from any cycle-level handoff
  record — the handoff record carries cycle-claim substance; the
  pre-positioning event carries marshal-role substance.

The two events MUST be distinct. The PDR-063 `mid-cycle-handoff`
`message_kind` is reserved for cycle-claim handoffs and MUST NOT be
used for marshal-role transitions.

## Rationale

The role-separation is one of **N compositional cures** that compose
to produce throughput improvement in multi-agent rotating-cast
operation. Recognising the role does not by itself produce a cure;
the cure emerges only when the role's existence allows other
disciplines to operate within their proper bounds:

- The Director's context budget is preserved for routing decisions
  and substrate-writing (per PDR-074 and PDR-075). Without a
  separable marshal, every commit competes with routing context for
  the Director's bounded budget.
- The comms-event auto-acceptance metadata discipline (per ADR-185,
  when landed) reduces the marshal's per-cycle ratification cost on
  mechanical events. Without auto-acceptance, the marshal would need
  to re-derive ratification for every mechanical event, undoing the
  context-budget gain from role separation.
- The substrate-writing discipline (PDR-075) preserves substantive
  ratification on the comms-stream as the canonical truth. Without
  substrate-writing, the marshal would lack the ratification context
  needed to commit without re-deriving from scratch.

The marshal-as-role is therefore necessary but not sufficient for
the throughput-cure. This PDR codifies the role; the cure emerges
from composition.

The compositional framing above is a **hypothesis** pending the
isolation tests named in §Trigger to Graduate — not an established
structure. See §Open Question 12: until cross-session evidence
isolates each axis, the composing cures are also confounds for
causal-attribution analysis.

## Consequences

### Required

- Multi-agent teams under bounded per-agent context budgets MUST
  recognise the Commit Marshal as a distinct role when cycle-throughput
  is structurally bounded by Director context contention.
- Role transitions MUST use the two-moments shape; cron/cadence
  artefacts MUST continue through Moment 1 and end at Moment 2.
- Marshal-cycle authorship MUST honour stage-by-explicit-pathspec,
  the full host pre-commit gate-chain, and tree-green broadcast on
  landing.
- Marshal mid-cycle retirement MUST fire both PDR-063 (per-cycle
  handoff) and this PDR's role-level two-moments (role transfer).

### Forbidden

- Multi-marshal contention on the same gate-singleton within a single
  branch authority-window.
- Use of `mid-cycle-handoff` message_kind for marshal-role transitions
  (reserved for cycle-claim handoffs per PDR-063).
- Director self-dispatch of marshal-cycles when a marshal seat exists
  (re-creates the context-contention failure mode the role separation
  cures).
- Skipping the pre-commit gate-chain without fresh per-commit owner
  authorisation (existing standing rule; reaffirmed here).

### Accepted Cost

- One additional role-class adds modest coordination overhead
  (marshal-request, tree-green broadcast, role-transition events).
- Cycle-boundary events add substrate volume to the comms-stream; this
  is the price paid for the substrate-as-canonical-truth discipline
  per PDR-075.
- An additional possible failure mode: marshal-orphaned-claims when
  the marshal retires before consuming the queue. The handoff record
  + auto-rebalance protocol cures this; see §Open Questions for the
  unresolved protocol shape.

## Worked Instances

The first worked-instance observation surfaces the empirical pattern:
a multi-window cure-cascade stall is broken by an active-marshal
discipline composing with substrate-writing and auto-acceptance, with
the marshal-role specifically responsible for the cycle-ceremony
boundary.

The cure-shape is reported as **nine marshal-authority cycles within
approximately forty-five minutes**, against a prior baseline where the
same cure-cascade had survived four consecutive Director handoffs
without landing. The empirical measurement is **nine cycles in
forty-five minutes**; the causal attribution is more modest —
**role-separation between routing-authority and commit-authority is
one of N compositional cures observed in this window**, not the sole
cause of the throughput delta. The other observed cures composing
include substrate-writing discipline (PDR-075) firing for the first
time, auto-acceptance metadata schema (ADR-185, when landed),
substrate-pointer-staleness pattern landing, and owner-direct
unblock authorisation on a long-carried structural blocker.

A falsifiability anchor is therefore named: ratification to Proposed
status requires an independent session demonstrating the same shape
where (a) the cure-cascade is NOT pre-staged in working tree, (b)
the structural blocker class is NOT freshly owner-resolved at cycle
start, and (c) the marshal role is separate from the Director, AND
throughput is still materially higher than the single-role baseline.

## Open Questions

1. **No SKILL amendment yet encodes the Commit Marshal as a
   third-class role** in `start-right-team` SKILL §Closeout Contract
   or §Roster Discipline. The amendment is required to make the
   role-class discoverable to future sessions.
2. **Routing-default when no marshal is seated** is unresolved. Does
   the Director fall back to self-marshal? Does the tree freeze
   pending a marshal arrival? Does an opportunistic implementer
   self-promote? The protocol shape needs ratification.
3. **Auto-rebalance protocol for marshal-orphaned claims** is
   unresolved. When the marshal retires mid-cycle with N orphan-class
   items queued, the per-claim disposition (handoff-record-set vs
   orphan-class vs retained-for-handoff) and the routing path for
   each class needs codification.
4. **Gate-singleton invariant has no structural enforcement
   mechanism**. The current enforcement is team-coordination
   discipline. A claim-area schema field marking the marshal-seat-
   holder, or a comms-event protocol that detects parallel marshals,
   is named as the structural cure but not yet landed.
5. **Cycle-cost claim shape is unfalsifiable as currently stated**.
   "Nine cycles in forty-five minutes" with no baseline measurement
   protocol cannot be compared across sessions. The doctrine should
   specify the empirical-claim shape (cycles per marshal-active-minute,
   normalised to size-class) so future evidence is comparable.
6. **The "marshal closes consumed claims" boundary** is incompletely
   specified. When the claim's original implementer-of-record has
   retired before the cycle lands, who owns the closure-event? The
   handoff-record-and-marshal-closes path is one option; the stale-
   claims handling cure named in adjacent doctrine is another.
7. **Standing-duty scope for coordination-substrate hygiene is
   undefined**. What counts as accumulated coordination substrate?
   What threshold triggers a hygiene cycle? Without a trigger, the
   standing duty becomes a non-falsifiable obligation.
8. **ADR-185 composition is load-bearing for the throughput cure but
   not yet landed in Accepted form**. The doctrine's empirical claim
   depends on auto-acceptance metadata reducing per-cycle ratification
   cost. Until ADR-185 lands, marshal cycles verify by manual diff-
   inspection, and the throughput claim is materially weaker.
9. **Vocabulary discipline**: the role MUST be named **Commit Marshal**
   consistent with prior owner-direction and handoff-record usage.
   Introducing a different term ("marshal", "gate-runner", "commit-
   keeper") in different contexts fragments the substrate and breaks
   reciprocal-reference integrity.
10. **Fitness-pressure and graduation criteria for the role itself**
    are needed. The ladder Candidate → Proposed → Accepted applies
    to this PDR; the Proposed trigger is independent-session
    confirmation of the empirical shape with confounds absent; the
    Accepted trigger is multi-session validation plus SKILL amendment
    landing.

11. **HUSKY=0-class prior-unblock confound is load-bearing for the
    empirical claim**. The cure-cascade that drained under the marshal
    seat ran against a gate-chain that had been freshly unblocked by
    an owner-direct intervention (a `HUSKY=0` emergency-unblock + tree
    sweep just before the marshal window opened). That intervention
    materially shaped the gate-chain conditions the cycles ran against
    — without it, the gate would have stayed RED on the same surface
    that had blocked four prior Director windows. The throughput
    observation is therefore conditional on this confound being
    cleared by a non-marshal mechanism. Future evidence must isolate
    marshal-cycle throughput from owner-direct gate-chain unblock
    effects.

12. **Parallel Director substrate-writing is a confound for causal
    attribution, not only a composing cure**. §Rationale frames
    PDR-075 (Director substrate-writing discipline) as a positive
    composing factor — these add up. The complementary truth: until
    cross-session evidence isolates each axis, the composing cures
    are also confounds (we cannot separate their contributions in
    this evidence). Concrete isolation criterion for the falsifiability
    anchor: a session where PDR-075 is the only first-firing discipline
    (marshal-as-role baseline established), OR a session where
    marshal-as-role is the only first-firing discipline (PDR-075
    baseline already established), with all other composing axes held
    at baseline. The Trigger to Graduate clause (d) operationalises
    this: PDR-075 must have fired in at least one prior independent
    session before the test session for throughput attribution to
    marshal-as-role to be defensible.

13. **Self-referential ratification risk**. This PDR is being landed
    by a marshal-cycle whose throughput is itself a worked instance
    of the central claim. §Required Companion Edits lands four
    reciprocal-reference additions inside the same marshal-cycle that
    lands this doctrine — and the speed of that landing is implicit
    evidence for the claim under review. The doctrine's own first-
    landing therefore cannot count toward the multi-session validation
    that promotes Candidate → Proposed → Accepted. The first
    independent-session test (Candidate → Proposed) MUST be a session
    distinct from the authoring session, with a marshal seat occupied
    by an agent who did not participate in authoring this PDR. This
    constraint is structural, not stylistic — without it, the doctrine
    ratifies on its own emission.

    **Participation enumeration** (to defeat litigation at the bar):
    participation includes (i) drafting or editing this PDR's body;
    (ii) being dispatched as a reviewer on this PDR (sub-agent
    transcript ids count); (iii) holding the marshal seat during this
    PDR's authoring cycle (the cycle that lands the PDR file).
    Participation does NOT include (a) reading the draft as ambient
    context, (b) watching the comms stream during authoring,
    (c) authoring other PDRs in the same Director window.

    **Enforceability anchor** (per PDR-066 comms-stream as canonical
    truth): the first independent-session test's marshal Moment-2
    active-acknowledgement event MUST declare
    `authoring_participation: none` against this PDR's authoring-
    window event ids. This makes participation-status structurally
    observable from the substrate, not from memory or honour-system.
    The declaration norm is a convention on the existing
    acknowledgement event; it does not require a new schema field.

## Trigger to Graduate

**Candidate → Proposed**: at least one independent session that
demonstrates the marshal-as-role empirical shape with the named
confounds absent. Concretely, the session must satisfy ALL of:

(a) No pre-staged cure-cascade in working tree at session-open.
(b) No freshly-owner-resolved structural blocker at cycle start.
(c) No `HUSKY=0`-class or other owner-direct gate-chain unblock
    operating concurrently with the marshal cycles.
(d) Director substrate-writing discipline already-established as
    baseline (not first-firing in the observation window).
    Operational test: PDR-075 has fired in at least one prior
    independent session before the test session.
(e) Marshal seat occupied by an agent who did NOT participate in
    authoring this PDR (self-referential-ratification bar; see
    §Open Question 13 for participation enumeration and the
    `authoring_participation: none` declaration anchor).

AND throughput materially higher than the single-role baseline for
that session, with the empirical-claim metric normalised per
§Open Question 5 (cycles per marshal-active-minute, normalised to
size-class).

The session may name additional worked instances; if the session
names contradicting evidence, the doctrine moves to RE-SHAPE-NEEDED
rather than Proposed. **Contradicting evidence explicitly includes**:
throughput materially equal-to or lower-than the single-role baseline
under clean-confound conditions (clauses a-e all satisfied). The
absence of throughput improvement under clean confounds is itself a
falsification signal, not a null result.

**Proposed → Accepted**: multi-session validation of the empirical
shape across at least two further sessions, plus the SKILL amendment
landing in `start-right-team` SKILL §Closeout Contract or §Roster
Discipline, plus resolution of at least Open Questions 2, 3, and 4
(routing-default, auto-rebalance protocol, gate-singleton
enforcement).

Reciprocal-reference additions land as a separate cycle adjacent to
this PDR's first landing — see §Required Companion Edits in the
implementation tranche.

## Required Companion Edits (Bundled With First Landing)

Per the docs-adr-expert completeness check, this PDR's first landing
must include the following reciprocal-reference additions to close
the doctrine graph:

1. **PDR-063 §"Intersection with PDR-064"** extends to name the
   marshal-role intersection: third axis adjacent to cycle handoff
   and coordinator handoff.
2. **PDR-064 §Related** adds PDR-077; §"Partial / Slice-Scoped
   Coordinator Transfer" references the Commit Marshal seat as a
   sibling slice-class authority.
3. **PDR-074** adds the Commit Marshal role to the context-allocation
   taxonomy.
4. **`.agent/practice-index.md`** registers PDR-077 in the
   governance-PDR enumeration.

Without these reciprocal additions, the doctrine graph carries one-way
edges, which is the recurring documentation-completeness failure mode
in this repo's PDR network.

**Deferred to ADR-185 Accepted landing**: the reciprocal-reference
addition to **ADR-185 §"verification"** naming the Commit Marshal
seat as verifier-of-record is intentionally deferred. ADR-185 is
currently Proposed (not Accepted); adding the reference now creates
a pointer to an unstable target. The reference lands at ADR-185's
Accepted landing, not at this PDR's first landing. This reduces the
companion-edit bundle from five to four for the first landing.

<!-- markdownlint-enable -->
