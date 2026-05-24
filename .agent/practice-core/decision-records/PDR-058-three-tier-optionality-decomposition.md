---
pdr_kind: governance
---

# PDR-058: Three-Tier Optionality Decomposition

**Status**: Accepted
**Date**: 2026-05-10
**Related**:
[PDR-014](PDR-014-pattern-routing-discipline.md) (consolidation
flow — this PDR routes optionality-shaped findings into three
distinct surfaces rather than a single fence);
[PDR-026](PDR-026-per-session-landing-commitment.md) (deferral
honesty — outcome-optionality is the inbound shape that produces
deferral-honesty failures);
[PDR-046](PDR-046-layered-knowledge-processing.md) §Move 3
(read repo state — decision-optionality routes to the
empirical-answerability surface);
[PDR-057](PDR-057-empirical-answerability.md)
(empirical-answerability gate — subsumes the decision-optionality
surface).

**Supersedes**: the quarantined `stop-inventing-optionality`
doctrine candidate, recorded alongside `apply-don't-ask` in the
combined quarantine entry
([`.agent/memory/operational/quarantine/apply-dont-ask-doctrine.md`](../../memory/operational/quarantine/apply-dont-ask-doctrine.md)),
under the 2026-05-01 owner-named reformulation.

## Context

The doctrine candidate `stop-inventing-optionality` was proposed in
2026-04 to name a recurring failure mode: agents introducing
optional / configurable / extensible surface in places where a
closed shape sufficed. The candidate accumulated evidence across
multiple categories — fork escalations, schema looseness,
acceptance-criteria hedges — and was queued for graduation as a
single rule.

On 2026-05-01 the owner reframed at session close: the candidate
*"moves in the right direction but not necessarily at the right
layer, level of abstraction, or mechanism"*. The substance hides
**three distinct impacts** behind one label, and the rule shape
follows from the impact. Drafting a single rule before naming the
three impacts would itself instance the failure mode the rule
tried to name (manufacturing one fence where the territory needs
three).

The rethink is the work. This PDR names the three surfaces, their
impacts, and where each routes for governance.

## Decision

**The doctrine candidate `stop-inventing-optionality` decomposes
into three impact-named surfaces observed in the current evidence
trail. Each surface has its own diagnostic, its own cure, and its
own home in the Practice graph. The single-rule shape is rejected
as wrong-layer. The decomposition is open to additional surfaces
as future evidence forces them — adjacent candidates (interface
optionality, sequencing optionality, scope optionality) may emerge
and warrant their own surface or merge with these three; the
decomposition is not asserted as exhaustive.**

### Surface 1 — Decision Optionality

**Definition**: bouncing forks to the owner whose answers have a
determinate empirical answer (in code, data, vendor docs, generator
output, schema, or log files).

**Impact**: wastes owner judgement on questions the agent could
have resolved by reading; fragments decision authority; produces
the owner-attention drag that motivated apply-don't-ask in the
first place.

**Diagnostic**:

- A fork is drafted toward the owner.
- The fork's answer is reachable by reading a repo / vendor / data
  surface.
- The agent has not read that surface.

**Cure**: the empirical-answerability gate
([PDR-057](PDR-057-empirical-answerability.md)). The decision-
optionality surface is fully subsumed by PDR-057; this PDR records
its presence in the decomposition for completeness, not as a
standalone rule.

### Surface 2 — Design Optionality

**Definition**: adding configurable / optional / extensible
surface in code or schema where a closed shape suffices.

**Impact**: erodes types (the closed shape's type guarantees are
weakened to admit the optional surface); bakes in fragility
(downstream consumers must handle the optional case forever);
mints maintenance load (every refactor must reason about the
optional surface).

**Concrete shapes** observed in evidence:

- `Record<string, unknown>` in a schema whose key set is known and
  closed.
- `?` (optional) on a property whose actual call sites all supply
  a value, with no caller in the foreseeable future intending to
  omit.
- Generic type parameters introduced *"to support future
  extension"* where every call site instantiates the same
  concrete type.
- Configuration flags that toggle behaviour where one branch is
  the always-correct path and the other is speculative.
- Plugin / strategy / adapter slots where there is one
  implementation and no concrete second one in scope.

**Diagnostic**:

- A surface is being authored or reviewed.
- The author / reviewer cannot name a concrete second instantiation
  in scope.
- The surface is nonetheless being shaped to admit the unknown
  second instantiation.

**Cure**: the closed-shape rule. Author the closed shape that the
known instances need. The configurable / extensible surface is
deferred until a real second instance forces the decomposition
(see also: [`consolidate-at-third-consumer`](../../rules/consolidate-at-third-consumer.md);
two is not three; speculative configurability is not consolidation).

The landing of this PDR requires the rule sibling for this surface
to be recorded as a candidate at
[`.agent/memory/operational/pending-graduations.md`](../../memory/operational/pending-graduations.md)
with the routing label *"design optionality"*. Graduation requires
its own evidence trail; this PDR does not pre-graduate it.

### Surface 3 — Outcome Optionality

**Definition**: writing acceptance criteria, plan outcomes, or
test conditions that hedge between possible answers when there is
a single right answer, or that depend on infrastructure that does
not exist.

**Impact**: produces unfalsifiable plans (no observable signal
distinguishes success from failure); shoehorns value-claims into
infrastructure that cannot carry them (sibling of the
*don't-shoehorn-a-value-claim* candidate); embeds optionality at
the verification layer where the discipline is most load-bearing.

**Concrete shapes** observed in evidence:

- Acceptance criteria of the form *"if X then Y else Z"* where
  one of X, Y, Z is the determinate answer.
- LLM-graded outcome conditions in plans where the LLM-graded
  evaluation infrastructure has not been built (the EEF plan
  example, removed under owner direction).
- Plans whose success condition is *"the team agrees"* without
  naming what the team would observe.
- Tests that branch on environment state (`if process.env.X`) to
  avoid asserting on the actual behaviour.

**Diagnostic**:

- A plan, ADR, acceptance criterion, or test is being authored.
- Its outcome is conditioned on a fork that has a determinate
  answer (decision optionality at the verification layer) or on
  infrastructure not currently in the repo.

**Cure**: the falsifiability rule. The outcome must name a
single observable signal that would distinguish success from
failure. If the infrastructure to observe the signal does not
exist, the plan says so explicitly and ships the structural
enforcement that does exist (the *don't-shoehorn-a-value-claim*
substance).

The landing of this PDR requires the rule sibling for this surface
to be recorded as a candidate at
[`.agent/memory/operational/pending-graduations.md`](../../memory/operational/pending-graduations.md)
with the routing label *"outcome optionality"*. The
*don't-shoehorn-a-value-claim* candidate (2026-04-30) is its
adjacent sibling and may merge or remain distinct depending on
evidence.

## Scope

**Adopter scope**: every Practice-bearing repo. The decomposition
itself is portable substance; the per-surface rules will be
authored at host-specific shapes only as evidence forces them.

**What this PDR does**:

- Names the three surfaces, their impacts, and their distinct
  cures.
- Routes Surface 1 to PDR-057 (now load-bearing).
- Records Surfaces 2 and 3 as routing labels in
  `pending-graduations.md` for their own future graduation paths.

**What this PDR does NOT do**:

- Pre-graduate the design-optionality rule. That requires its own
  evidence trail and its own draft.
- Pre-graduate the outcome-optionality rule. That requires its
  own evidence trail and its own draft, possibly merged with
  *don't-shoehorn-a-value-claim*.
- Replace consolidate-at-third-consumer. The third-consumer rule
  governs *when to extract*; design-optionality governs *when to
  shape*. They compose; they do not substitute.

## Rationale

The single-rule shape `stop-inventing-optionality` was wrong
because the three impacts demand three different cures:

- Decision optionality: read-the-surface (PDR-057).
- Design optionality: close-the-shape (closed-shape discipline).
- Outcome optionality: name-the-falsifier (falsifiability
  discipline).

A single rule that tried to span all three would either generalise
to *"do not introduce optionality"* (too broad — defeats genuine
extensibility where it is load-bearing) or specialise to one
surface and silently fail on the other two (the failure mode at
the time of quarantine).

Naming the impact first is the discipline's central correction.
The owner's 2026-05-01 reframe was explicit: *"drafting the rule
before naming the impact is itself an instance of the failure
mode the doctrine was trying to name"*. This PDR honours that by
authoring the decomposition and routing, not the per-surface
rules.

## Consequences

**Enables**:

- Optionality-shaped findings on review have three distinct
  diagnostic homes; reviewers can route their finding to the
  matching cure.
- The pending-graduations register can carry design- and outcome-
  optionality candidates with named labels rather than as a single
  unwieldy unit.
- PDR-057 inherits Surface 1's substance with a clean boundary;
  the apply-don't-ask quarantine cleanly closes.

**Costs**:

- Reviewers must distinguish which surface a finding sits on
  before naming the cure. The cost is small (the three diagnostics
  are non-overlapping) and pays off in cure precision.
- Two future graduation passes are queued (design-optionality and
  outcome-optionality rules) that might have appeared as a single
  graduation pass. The two passes are correct.

**Forbids**:

- Authoring a single `stop-inventing-optionality` rule. The shape
  is rejected.
- Conflating decision-optionality findings with design- or outcome-
  optionality findings. The diagnostics differ; conflation re-
  imports the failure the decomposition exists to prevent.

## Source

This PDR graduates the QUAR-1 entry of
[`pending-graduations.md`](../../memory/operational/pending-graduations.md)
under the 2026-05-01 owner-named reformulation, partner-PDR with
[PDR-057](PDR-057-empirical-answerability.md). The original
candidate (`stop-inventing-optionality`) is preserved in
[`.agent/memory/operational/quarantine/apply-dont-ask-doctrine.md`](../../memory/operational/quarantine/apply-dont-ask-doctrine.md)
as historical evidence; that file is updated to mark the
quarantine cleared by this PDR pair.
