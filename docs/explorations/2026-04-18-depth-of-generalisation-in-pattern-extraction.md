---
title: Depth of Generalisation in Pattern Extraction — Testing Today's Extractions Against the New Discipline
date: 2026-04-18
status: informed-plan-pattern-consolidation
---

# Depth of Generalisation in Pattern Extraction

An exploration prompted by the Learned Principle added today to
`practice-lineage.md`: **generalise where generalisation doesn't cost
utility**. The principle was named during the session but arrived
late enough that three patterns already extracted in the same window
may have been pitched at a less-than-optimal depth. This exploration
tests the principle against those patterns and proposes what to do
about the outcome.

## Problem statement

The knowledge flow extracts patterns from instances. When an
extraction happens, the author chooses a pitch — how abstractly to
state the principle — that determines how many future contexts the
pattern applies to. Today's session extracted three patterns with
depth choices that pre-dated the explicit generalisation discipline.
The question: should any of those extractions be revised in light of
the discipline, and if so, how?

## Context-test of today's extractions

The generalisation discipline specifies the test: invent three or
more unrelated contexts; if the candidate general form produces
correct behaviour in all of them, generalise to that form; if it
produces vacuous or incorrect behaviour in any, specificity is
carrying the utility and must stay.

### Pattern 1: `findings-route-to-lane-or-rejection` (review-layer)

**As extracted**: every reviewer finding must route to an explicit
outcome (ACTIONED / TO-ACTION with named lane / REJECTED with
rationale); "deferred as a follow-up" without a named lane is a
smuggled drop.

**Candidate general form**: **no smuggled drops — every item in a
triage queue routes to an explicit outcome; nothing parks without a
home.**

**Context tests**:

- Reviewer findings ✓ (origin instance).
- Planning-layer future items ✓ (already validated by the sibling
  pattern `nothing-unplanned-without-a-promotion-trigger`).
- Bug tracker triage — does every reported bug get fixed,
  scheduled, or explicitly closed with rationale? Yes, this is
  fundamental triage discipline.
- Feature request intake — does every request get accepted,
  backlogged with a promotion trigger, or declined with rationale?
  Yes.
- Incoming-Practice-Box integration — per the existing Integration
  Flow, every incoming file is adopted, deferred with recorded
  rationale, or rejected. Yes.
- Code review comments — does every comment get addressed,
  scheduled, or explicitly declined? Yes.
- Security-scan findings (SonarCloud, Github Advanced Security) —
  does every finding get fixed, suppressed-with-rationale, or
  accepted-as-risk? Yes.

**Verdict**: the general form passes six context tests. The discipline
says consolidate: one pattern (`no-smuggled-drops`) with instance
sections for the review layer and the planning layer, subsuming both
`findings-route-to-lane-or-rejection` and
`nothing-unplanned-without-a-promotion-trigger`.

### Pattern 2: `nothing-unplanned-without-a-promotion-trigger` (planning-layer)

**As extracted**: every `future/` plan carries a named testable
promotion trigger; items parked without triggers are smuggled drops.

**Candidate general form**: same as Pattern 1 — this is the planning-
layer instance of `no-smuggled-drops`. The specific form about
promotion triggers is the instance's **specialisation** for planning
(what counts as "explicit outcome" at the planning layer is "named
testable trigger"), but the underlying principle is the same.

**Verdict**: subsumed by the consolidated pattern. The specific
trigger-discipline content becomes the planning-layer instance
section within `no-smuggled-drops`.

### Pattern 3: `compressed-neutral-labels-smuggle-scope` (distilled entry)

**As extracted**: labels like "stretch", "deferred", "follow-up",
"maybe later" sound procedurally neutral but hide scope debt and
uncertainty; correct by writing explicit forms.

**Candidate general form**: **linguistic compression in planning and
documentation is a leading indicator of unresolved thinking; the
explicit form reveals whether the weight is a genuine gap needing
filling or uncertainty being hidden.**

**Context tests**:

- "Stretch" / "deferred" / "follow-up" in scope ✓ (origin).
- Commit message "misc cleanup" — compression hiding what was
  changed. Yes.
- Code comment "magic number" — compression hiding that the author
  didn't know why. Yes.
- Test name "works correctly" — compression hiding the specific
  behaviour being proven. Yes.
- Variable name `data` / `result` / `temp` in production code —
  compression hiding what the value represents. Yes.
- Plan status "in progress" (stale, with no percentage or date
  change) — compression hiding that the plan hasn't moved. Yes.
- "TBD" / "TODO" with no owner or resolution date — compression
  hiding that nobody is committed to resolve. Yes.

**Verdict**: the general form passes seven context tests. The
distilled entry is currently close to this shape but names the
specific examples ("stretch / deferred / follow-up") rather than the
underlying mechanism. Generalisation recommended — but the specific
examples are load-bearing discoverability cues, so they should stay
as an illustration, not vanish.

### Pattern 4 (retroactive check): `ground-before-framing`

Not extracted today but worth testing since the generalisation
discipline would apply retroactively to all patterns.

**As extracted**: read the composition root before proposing an
integration pivot or scope claim.

**Candidate general form**: **verify current state from source
before asserting claims about it.**

**Context tests**:

- Composition root before integration claims ✓ (origin).
- Test files before coverage-gap claims — yes, reviewers often
  assert "we don't test X" without reading the test file.
- Production logs before "bug-fixed" claims — yes.
- Deploy history before regression-cause claims — yes.
- User feedback before feature-success claims — yes.
- Architecture docs before "we don't do X" claims — yes.

**Verdict**: passes six context tests. Current pattern pitches at
composition-root-and-framing specificity; the general form reads as
a fundamental epistemic discipline with the composition-root
instance as one example among many. This is a candidate for
consolidation at a later consolidation pass, not today.

## Options considered

**Option A: Consolidate now.** Create a new pattern
`no-smuggled-drops.md` with instance sections; demote today's two
patterns to pointer files; update the outgoing `outgoing/patterns/`
directory to match.

Pros: honest extraction; fewer overlapping patterns; matches the
discipline immediately.

Cons: retroactive churn; the new principle has not itself been
tested across multiple sessions (it's single-session today); may
be premature.

**Option B: Consolidate at next consolidation pass.** Leave today's
extractions in place; add this exploration as evidence; let the
next consolidation cycle decide whether to execute the consolidation.

Pros: honours the "don't apply a new discipline retroactively on
the day it was named" caution; lets the discipline itself validate
across a second session before reshaping prior output.

Cons: today's patterns remain under-generalised in the meantime;
the evidence is strong enough that waiting doesn't change the
outcome.

**Option C: Add pointer annotations now, consolidate later.** Leave
today's two patterns in place; add an "Informs deeper pattern:
`no-smuggled-drops` (pending consolidation)" annotation to each;
retain this exploration as the evidence for the eventual
consolidation.

Pros: makes the deeper pattern discoverable immediately; defers the
file-level churn; creates a visible trail for the next consolidation
pass to pick up.

Cons: temporary inconsistency (two pattern files plus one annotated
deeper-pattern concept); minor discoverability cost.

## Research questions still open

- Is one session's observation of the generalisation discipline
  sufficient to act on it, or should it wait for cross-session
  validation? **Answer emerging**: the evidence in this exploration
  (six-or-seven-context tests for each pattern) is itself the second
  validation — the principle has been applied to three patterns
  today, all of which survived context-testing.
- Should consolidation produce a pattern called `no-smuggled-drops`,
  or does the principle deserve a different name? Candidates:
  `everything-routes-to-an-explicit-outcome`,
  `triage-queues-have-no-parking`, `explicit-outcome-or-rejection`.
  `no-smuggled-drops` wins on compression and connects to the
  existing "smuggling" vocabulary in distilled.md.
- Should `compressed-neutral-labels-smuggle-scope` also consolidate
  into `no-smuggled-drops` (smuggling is a shared theme), or stay
  distinct? They're different failure modes — compressed labels
  hide uncertainty; no-home parking hides drops. Distinct patterns.

## Informs

- `practice-lineage.md § Learned Principles — Generalise where
generalisation doesn't cost utility` (today's addition; this
  exploration is its first evidence).
- Pattern consolidation plan: **Option C chosen for
  immediacy-plus-caution**. Pointer annotations added to the two
  patterns this session; full consolidation deferred to the next
  consolidation pass, using this exploration as the evidence it
  cites. The deferred work is itself a scheduled item, not a
  smuggled drop (recursive check passes).
- Next consolidation's remit: walk `.agent/memory/active/patterns/` for
  any other pair of patterns that share a deeper principle;
  apply the same test; consolidate where the test passes.

## References

- `practice-lineage.md § Learned Principles` — the source principle
  being tested.
- `.agent/memory/active/patterns/findings-route-to-lane-or-rejection.md` —
  today's review-layer pattern.
- `.agent/memory/active/patterns/nothing-unplanned-without-a-promotion-trigger.md` —
  today's planning-layer pattern.
- `.agent/memory/active/patterns/ground-before-framing.md` — retroactive-
  check candidate for later consolidation.
- `.agent/memory/active/distilled.md § Process — Compressed neutral labels
smuggle scope` — today's distilled entry tested above.
- PDR-005 (transplantation) — explicit use-case for the
  generalisation discipline, which reduces ecosystem-specific-
  orphan pressure at transplant time.
