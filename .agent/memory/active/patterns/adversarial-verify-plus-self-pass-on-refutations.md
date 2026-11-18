---
name: Adversarial-Verify Plus a Self-Pass Over the Verifier's Own Downgrades
polarity: pattern
use_this_when: Running a multi-agent verification or triage round (fleet review, adversarial-verify, open-question triage) and about to accept the verifier's/triage-agent's confirmed set as the complete result
category: agent
layer: general
proven_in: .agent/memory/active/napkin.md (PR #328 deep review, 2026-07-08)
proven_date: 2026-07-08
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Critically assessing only the confirmed/surviving half of a verification or triage round, while a verifier's own downgrades, refutations, or 'already-decided' dismissals silently ride through unchecked"
  stable: true
---

> **POLARITY: PATTERN.** This entry describes a positive shape to repeat: run
> both an adversarial-verify pass over the primary output AND a self-pass
> over the verifier's own downgrades.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

## Principle

"Critically assess all subagent output" is usually read as "check that the
confirmed findings are real." That is only half the assessment. A
triage/verification agent also **downgrades, refutes, or marks items
already-decided** — and those downgrades are themselves claims that can be
wrong, made by an agent with no more authority than the one that produced
the original finding. Assessing only the confirmed half and trusting the
rejected half by default inverts the verification discipline exactly where
it matters least visibly: a wrongly-dropped finding never resurfaces for a
second look, while a wrongly-confirmed one usually gets caught downstream.

## Worked Instance (2026-07-08, PR #328 deep review)

In an open-question triage round, two review lenses marked a ZDR-contract
question "ALREADY-DECIDED" by citing the estate's own "confirm this" note —
but a note stating something *needs* confirming is not itself a decision.
The miscategorisation was caught only because the review explicitly went
back and re-read the DROPPED (already-decided / refuted) set, not just the
surviving confirmed set. The owner made the discipline explicit: *"critically
assessing all does not mean assessing half."*

## Countermeasure

Run two passes, not one, whenever a verification/triage agent produces both
a confirmed set and a rejected/downgraded set:

1. **Adversarial-verify the confirmed set** — the ordinary discipline: check
   each surviving claim against its cited evidence.
2. **Self-pass the rejected set** — re-read every item the verifier marked
   refuted, already-decided, duplicate, or out-of-scope, and check the
   *verifier's* reasoning for that downgrade against the actual source,
   exactly as skeptically as the confirmed set was checked.

Both passes are required before treating a triage round as complete; passing
only the first is the failure mode this pattern names.
