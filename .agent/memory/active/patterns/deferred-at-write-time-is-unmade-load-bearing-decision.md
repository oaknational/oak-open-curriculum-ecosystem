---
name: "Deferred-at-Write-Time Is an Unmade Load-Bearing Decision"
polarity: anti-pattern
use_this_when: A plan or design defers a substantive decision to implementation time ("decide at write time", "the cycle author chooses", "TBD in the implementation slice") — check whether the deferral is real flexibility or a load-bearing decision the plan owner has declined to make
category: process
proven_in: ".agent/memory/active/distilled.md § Multi-Reviewer Dispatch Discipline (2026-05-09 napkin rotation)"
proven_date: 2026-05-09
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Plans that hand load-bearing decisions to the cycle author under implementation pressure, framed as 'flexibility' but operating as decision-shedding"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to
> avoid*, not a shape to repeat. The name is the diagnostic: when a
> plan phrase contains "decide at write time", "TBD in implementation",
> "the cycle author chooses", or any equivalent deferral vocabulary,
> the failure mode is at risk of firing.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

## Principle

A plan defers a substantive decision when its body says "decide at
write time" (or any equivalent vocabulary: *TBD in implementation*,
*the cycle author chooses*, *resolved during the cycle*, *finalised
when the slice lands*). The vocabulary frames the deferral as
*flexibility*, but operates as *decision-shedding*: the plan owner has
declined to make the decision, and the cycle author will be forced to
make it under implementation pressure — at the worst possible moment
for thoughtful trade-off analysis.

The diagnostic question: *if this decision is the right thing to
defer to write-time, what changes between plan-time and write-time
that informs the decision?* If the answer is "nothing" — the
information available at write-time is the same information available
at plan-time — then the deferral is decision-shedding, not flexibility.

The deferral has a real cost: under implementation pressure, the
decision compresses against context budget, against gate-failure
reactivity, against the natural pull toward whichever option is
fastest. The cycle author's decision is rarely worse than the plan
owner's would have been *technically*, but it is rarely as
well-considered, and it lacks the load-bearing review the plan body
would otherwise have applied.

## Worked Instance — 2026-05-09 WS0 dispatch

The 2026-05-09 multi-reviewer dispatch surfaced a plan that deferred
the boundary-decision for a structural cycle: *"the boundary will be
decided at write time per the cycle author's judgement"*. The
`architecture-reviewer-fred` review caught the deferral as a BLOCKER:

- The boundary was load-bearing (it determined where validation fired,
  which workspace owned the type, which composition root consumed it).
- The information that would inform the decision was present at
  plan-time (the schema shape was known; the consumer surfaces were
  enumerated; the validation policy was settled).
- Nothing changed between plan-time and write-time except *which
  agent had to decide under what pressure*.

The reshape: the plan owner made the boundary decision in WS0 (before
any code was written). The cycle then had a substantively-easier path
through implementation; the boundary was named, the trade-off was
recorded, and the cycle author's job was construction, not
decision-making.

## Worked Instance — 2026-05-10 fabricated-gate vocabulary

The pending-graduations register's `vaporware-gated`, `XL-deferred`,
`sequenced-deferral pointer` vocabulary is a generalised form of the
same shape. Each entry's deferral named a *real* gate (plan execution,
N≥3 validation, dedicated session) but the gates did not actually
constrain authoring — the substance was graduation-ready in every
case. The vocabulary operated as *graduation-shedding*. Owner reframe
2026-05-10 named this as *fabricated gate as avoidance* (see the
[`fabricated-gate-as-avoidance`](fabricated-gate-as-avoidance.md)
pattern instance). The two patterns compose: deferred-at-write-time
is the per-decision shape; fabricated-gate-as-avoidance is the
multi-decision aggregate shape.

## The Diagnostic

Before authoring or accepting a plan-body deferral, run this check:

1. **Name the decision being deferred.** *"This is a decision about
   X — where does Y go, what shape does Z take, who validates W."*
   If the deferral cannot be named as a discrete decision, the plan
   body is gesturing at indecision, not flexibility.
2. **Name the information needed to make the decision.** Schema
   inputs, consumer surfaces, validation policy, downstream contract.
3. **Name what changes between plan-time and write-time** that
   informs the decision. If the answer is *nothing* — the plan-time
   information is the write-time information — the deferral is
   decision-shedding, and the decision belongs in the plan body.
4. **If write-time information genuinely will change the decision**,
   name what that information is, name when it becomes available,
   and name the resolution mechanism (a sub-question, a probe, a
   test). Real flexibility has a structural shape; decision-shedding
   does not.

## Composition

This pattern composes with:

- [`fabricated-gate-as-avoidance`](fabricated-gate-as-avoidance.md) —
  the multi-decision aggregate form. Each fabricated gate is a
  per-decision instance of "deferred-at-write-time is unmade".
- [`eager-rounding-off-on-partial-structures`](eager-rounding-off-on-partial-structures.md) —
  under failure pressure (the moment write-time arrives), the cycle
  author rounds the deferred decision into whatever shape is fastest;
  this is the rounding-off pattern firing on the deferral pattern's
  output.
- [PDR-026](../../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md)
  §Deferral-honesty discipline — every deferral must satisfy the
  named-constraint + falsifiability test. A "decide at write time"
  deferral fails the falsifiability test by definition (the
  constraint is unspecified).

## Cure

When reviewing a plan body that contains deferral vocabulary:

1. Run the diagnostic above. If the deferral fails the test, surface
   it as a BLOCKER for the plan owner to resolve before the cycle
   begins.
2. If the deferral passes the test (real flexibility with named
   triggers), make the trigger and resolution mechanism explicit in
   the plan body. *"X is decided at write time when Y becomes known;
   resolution mechanism is Z"*.
3. If the deferral is decision-shedding under disguise, the cure is
   to make the decision in the plan body. The plan owner is the
   right author for the decision; deferring it to the cycle author
   is the failure mode.

## Source Surfaces

- `.agent/memory/active/distilled.md` § Multi-Reviewer Dispatch
  Discipline 2026-05-09 entry (graduated 2026-05-10 to this pattern).
- 2026-05-09 WS0 dispatch reflection (pending-graduations register
  noted the candidate at the time).
- Owner reframe 2026-05-10 in the `knowledge graduation` session.
