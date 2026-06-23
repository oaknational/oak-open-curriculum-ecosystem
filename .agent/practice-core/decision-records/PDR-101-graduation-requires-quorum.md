---
pdr_kind: governance
---

# PDR-101: A Doctrine-Minting Graduation Requires a Review Quorum

**Status**: Accepted
**Date**: 2026-06-16
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md) (capture →
distil → graduate → enforce; this PDR hardens the graduate edge);
[PDR-100](PDR-100-decision-debt-as-a-first-class-pillar.md) (owner-gated is
abolished — the agent decides by the lenses; this PDR is the *review* safety net,
not an owner gate);
[PDR-089](PDR-089-conservation-reflex-external-check.md) (an external check
catches the conservation reflex the author cannot self-detect — the graduation
quorum is that external check applied to the graduate edge).

## Context

The decision-debt drain of 2026-06-16 (Limpet spins Headland) ran every
graduation candidate through a review quorum and found the primary's first-pass
confidence **mis-calibrated in both directions**: a rejection-list quorum caught
~9 single-instance items wrongly rejected (the lenses favoured them once the
"await a second instance" gate was abolished), and a graduation quorum caught ~6
items minted from thin, duplicate, or substantively-wrong evidence — including a
doctrine that was simply *wrong* ("the more-restrictive reviewer always wins")
and several already homed elsewhere.

A graduation **mints doctrine into the always-loaded corpus** (a rule, a PDR, a
principle, a graduated pattern). A wrong graduation therefore costs *every future
session* that loads it — corpus bloat, or worse, an actively-wrong instruction.
Graduations deserve **more** scrutiny than rejections, not less.

## Decision

**Every graduation that mints always-loaded or corpus-referenced doctrine runs
through a review quorum before it lands.** The protocol:

1. **Primary assesses every candidate first-hand** — reads the raw substance,
   verifies each "already homed in X" claim against the live home, decides
   graduate / reject / duplicate by the lenses (long-term architectural
   excellence, strict-everywhere, improve-DX).
2. **The quorum assesses the *result*** — `assumptions-expert` +
   `docs-adr-expert` + two further reviewers (e.g. two Opus code/architecture
   reviewers) read the decided batch: the authored homes AND the rejection
   reasons.
3. **The primary critically adjudicates and corrects.** The deciding vote stays
   with the primary; the quorum is calibration, not authority.

The two calibrations pull in opposite directions and the truth is in the middle:
the rejection-list quorum pushes *up* (catches over-rejection); the graduation
quorum pulls *down* (catches over-graduation). First-pass confidence is
unreliable in both directions — only the adversarial pass exposes it.

This is **not an owner gate.** Per PDR-100 the agent decides; provenance and
adaptation are the safety net for a wrong call. The quorum is an agent-side
review that makes the decision better before it lands, not a routing of the
decision to the owner.

## Scope

**Adopter scope**: every Practice-bearing repo that runs consolidation /
graduation. The quorum roster is host-specific (the reviewer agents available);
the discipline — first-hand decide, multi-mind review the result, primary
adjudicates — is portable.

**Applies to**: graduations that mint or amend always-loaded / corpus-referenced
doctrine — rules, PDRs, principles, graduated patterns, governance docs.

**Does not require a full quorum for**: a verified duplicate removal, a
reject-as-situational, or a routing to the frictions register / an exploration
plan — these do not mint doctrine. (A batch that contains graduations runs the
quorum over the whole batch, because the quorum also catches over-rejection.)

## Rationale

Naming a failure mode does not prevent it (passive prose is a no-op actuator);
the cure for mis-calibrated graduation is a *structural review step*, not
self-vigilance. The quorum is that step. It is cheap relative to the cost of a
wrong doctrine loaded into every future session.

## Consequences

**Enables**: graduations land calibrated; over-graduation (corpus bloat,
wrong-doctrine) and over-rejection (lost insight) are both caught before landing.

**Costs**: a graduation batch incurs a review pass. Proportionate — the quorum
runs once per batch, not once per item, and only when the batch mints doctrine.

**Forbids**: minting always-loaded doctrine from a single primary pass without
review; treating the quorum as an owner gate or as authority over the primary's
deciding vote.

## Falsifiability

Shown wrong if, across a run of graduation batches, the quorum **changes no
decision the primary would not have reached alone** — i.e. the calibration it
claims to provide never materialises, and the review is pure cost. The honest
signal to retire or lighten the obligation is a sequence of batches where every
quorum verdict ratified the primary's first pass unchanged. (This very batch is a
counter-instance: the quorum rescued four over-rejections and forced this
Falsifiability clause, the single-instance barrier reconciliation, and a broken
cross-reference fix — decisions the primary did not reach alone.) Conversely it
would be confirmed by continued bidirectional miscalibration catches.

This PDR is itself prose, not a wired actuator — by its own enforce-edge logic it
is the no-op-actuator risk it names. It is accepted as a *discipline* (the agent
convenes the quorum because the lesson is internalised), not a gate; the
`action-time-structural-interrupt`
design space is where a mechanical firing surface for disciplines like this is
explored.

## Source

Graduates the `graduation-requires-quorum` candidate from the 2026-06-16
decision-debt drain (Limpet spins Headland), conserved in `distilled.md` and
drained to this PDR on 2026-06-16 (Skunk hunts Crescent). The drain's
opposite-direction calibration evidence is the worked instance.
