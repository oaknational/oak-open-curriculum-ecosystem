---
name: "Precedent Compounding Is the Mechanism of Entropy"
polarity: anti-pattern
use_this_when: "You (or a reviewer) are about to justify a shape because a landed artefact already uses it — a precedent test, a prior disposition, an allowlist entry, an established exception. Check the precedent's recorded rationale and the governing principle before reusing the shape."
category: agent
layer: general
proven_in: "Four instances in one arc (2026-07-07/08): (1) a COMPLETION_KEYWORDS_V1 pin test added mirroring a landed NET_C precedent test — a reviewer even recommended it — owner-corrected as an audit-shaped test both times (cure: a recomputing validator; BOTH pin tests deleted); (2) an io-allowlist union performed in a merge and rated PASS by a six-seat gateway — every step procedurally correct, every step entropy (owner: 'there should never have been an IO allowlist — the creep is entropy'); (3) a Sonar S4036 WONTFIX lean copied from a precedent that had NO recorded rationale and a different site shape — first-principles review fixed it in code instead; (4) the remediation bot's PR fixing findings by generic convention against the estate's documented local decisions — precedent-compounding embodied in a tool."
proven_date: 2026-07-08
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Reusing a landed shape because it landed — letting procedural legitimacy (citations, review approvals, recorded reasons, gateway passes) substitute for principle-compliance, so each exception normalises the next."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** A landed precedent is not a licence; it is a
> hypothesis whose rationale must still exist and still apply.

## The failure mode

In a large estate every landed artefact becomes a licence-shaped precedent.
The compounding loop: an exception lands with paperwork (a recorded reason, a
review approval, an allowlist entry) → the paperwork manufactures
process-legitimacy → the next agent (or reviewer, or bot) cites the landed
shape as the idiom → gateways rate the *procedure* compliant → the exception
class grows. **Process-compliance is not principle-compliance** — every step
can be procedurally correct and every step entropy. A violation-allowlist is
the crystallised form: an escape hatch with paperwork, institutionalising
exceptions to a rule whose whole point is exceptionlessness.

The reviewer face makes it worse: reviewers recommend precedent-matching
shapes ("mirror the landed NET_C test"), so the compounding survives review —
the same audit-shaped test was wrong twice, recommended once.

## The cure

- **Precedent triggers the principle check, never waives it.** When the
  justification for a shape is "a landed artefact already does this", that is
  the tripwire to run the governing principle (`principles.md` §Strict and
  Complete, the Decision Lenses) over THIS site — first-principles review
  beat precedent twice in one arc.
- **Check the precedent's recorded rationale before reuse.** A precedent with
  no recorded rationale, or a rationale grounded in a different site shape,
  transfers nothing.
- **Category-relocation over exemption, and gates land strict in one
  landing** — the structural forms are PDR-126's Decision; this pattern is
  the failure mechanism that PDR forecloses.

Siblings: `fluency-is-a-failure-vector.md` (the precedent arrives fluently —
"the estate already does this" is a fluent frame);
`legitimate-principle-as-avoidance-cover.md` (paperwork as legitimacy).
