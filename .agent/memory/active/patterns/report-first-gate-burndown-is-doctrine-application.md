---
name: "A Freshly-Landed Enforcement Gate's First Burndown Is Doctrine Co-Design, Not Mechanical Data-Entry"
polarity: pattern
use_this_when: "Burning down the violations a newly-landed enforcement gate (validator, lint rule, scanner) reports for the first time — the impulse is to 'watch the count fall to zero', but the first burndown is where the gate's doctrine meets reality."
category: process
proven_in: "PDR-105 validate-reference-direction first burndown (~197 wrong-direction references) — 2026-06-19 (Tulip spins Xylem)."
proven_date: 2026-06-19
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Treating every flag a freshly-landed gate reports as a delete-target so the count reaches zero — which bulldozes constitutive references the rule needs and enacts a different failure (rules that cannot name what they govern)."
  stable: true
---

> **POLARITY: PATTERN.** A shape to repeat: classify each flag before curing it;
> the first burndown is co-design with the gate's doctrine.
> See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# A Freshly-Landed Enforcement Gate's First Burndown Is Doctrine Co-Design, Not Mechanical Data-Entry

## Principle

When a new enforcement gate ships **report-first** and produces its first list of
violations, the framing "watch the count fall to zero" is wrong. The first
burndown is where the gate's **doctrine meets reality** and reveals where the
doctrine needs refinement. Treating every flag as a delete-target is itself a
failure mode — it can bulldoze references the system legitimately needs, enacting
a *different* defect (a rule that cannot name what it governs).

**Classify each flag before curing it.** The flags split (at least) three ways,
only one of which is "delete":

- **A — genuine defect.** The flagged construct really is the thing the gate
  exists to stop (e.g. a reference pointing at a *moving* target). Cure: remove or
  invert it.
- **B — constitutive reference to a stable-addressed surface.** A rule that
  *governs* a surface must be able to *name* it; the surface's address is fixed,
  only its content churns. The flag is a false positive against the rule's intent.
  Cure (owner-approved): extend the rule's corollary / the validator allowlist —
  **not** bulldoze the legitimate reference. Bulldozing degrades the rule.
- **C — genuinely historical pointer.** A reference to something that has
  concluded. Cure: annotate it as a historical reference.

## Worked instance — 2026-06-19 (Tulip spins Xylem)

PDR-105's `validate-reference-direction` shipped report-first measuring ~197
"wrong-direction references." The opener framed the burndown as mechanical. It was
not. The `dont-break-build-without-fix-plan` rule quoting an ephemeral plan as its
"Authority (verbatim)" was a class-A defect (inverted). Constitutive references to
`active-claims.json`, the comms log, index READMEs, and `*.schema.json` were
class-B — the rule must name the surface it governs; the cure was extending the
stable-index corollary + allowlist, not deleting the pointers. Treating all ~197
flags as class A would have enacted the rules-can't-name-what-they-govern failure.

## Falsifiability and scope

The A/B/C taxonomy is drawn from one (large) first burndown; a later gate's first
burndown may reveal a further class. The load-bearing doctrine — *classify before
curing; a report-first gate's first burndown is co-design, not data-entry* — holds
regardless of whether the taxonomy gains a class D. Refine the taxonomy as further
burndowns accumulate.

## Related

- [`evidence-before-classification`](evidence-before-classification.md) — treat
  each finding as unclassified until evidence proves its class; this pattern is
  that discipline applied to a *freshly-landed* gate, where class B (the gate's
  own doctrine is too narrow) is live.
- [`judge-usefulness-from-current-process`](judge-usefulness-from-current-process.md)
  — the sibling "judge by present reality, not inherited framing" stance; and
  [`fluency-is-a-failure-vector`](fluency-is-a-failure-vector.md) — "the count must
  reach zero" is the fluent move that skips the classification.
- [`tool-output-framing-bias`](tool-output-framing-bias.md) — adopting a tool's
  count/grouping as the plan without independent classification.
