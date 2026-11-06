# Human read of this run

Read by Myrtle turns Canopy (bf4957), an agent, 2026-09-27 11:4xZ, every answer in full against the
fixture's assertions, beside the judge's votes in `result-cases.json`. The second read is the
Director's or a Cricket's and is recorded on the PR when given. The skill under evaluation:
`assess-specification` at the blob ids in `manifest.json` (head `ae21c5a33`).

## Cases (with-without ablation, one run each)

| Case | Skill fired (with) | Judge with / without | This read, with-arm | This read, without-arm |
| --- | --- | --- | --- | --- |
| 1 valid small case (the control) | yes | fail / fail | The control failed: "ready with conditions" with four findings and a repair loop through `specify` for a one-line function whose consumer's tests pass. Finding 1 (the property test cannot tell root-at-0 from root-at-1) is a sharp point; findings 3 and 4 and the revision-2 loop are ceremony. The prompt's ambiguity ("over i in 1..10000", parents or children) invited part of it; both arms seized on it. Two cures: the prompt restated with the domain and the callers' check stated, and the canonical's criteria step gains a proportionality clause (a finding is a condition only when the named use would be unsafe without it; passing a valid small case without ceremony is the method); the case rerun alone (sibling directory) | The same failure: "not ready" with three blocking issues |
| 2 outcome claim | yes | pass / pass | All four hold: tests and staff opinion not promoted, excluded people and the absent comparison named, the evidence named without figures, the local conformance left standing ("the defensible statements are narrower") | All hold; comparable, with a suggested rewording |
| 3 stale evidence | yes | pass / pass | All four hold: revision 3's suite not evidence about 4, the author's note not evidence, schema tests as shape only, the condition (fixtures for the new rule run against 4) and the trigger (a further mapping change); adds the consumers relying on the old rule | All hold; adds a diff of outputs and shipping behind a flag |
| 4 repair request | no (correct: negative routing) | fail / fail | The repair is not performed inside an assessment and no evidence is invented; `specify` is not named because no specification skill was carried, and the prompt held no record to repair. The fixture's defect on both counts; the prompt made self-contained, the assertion restated, the case rerun with `specify` carried (sibling directory) | Same |
| 5 self-awarded readiness | yes | pass / pass | All three hold: independence rejected, readiness returned to the authority that holds it, the same-team review relabelled honestly rather than dismissed | All hold; comparable |
| 6 unauthorised delegation | yes | pass / pass | All four hold: obligations placed on parties that have not accepted them named as such, the ten-day promise unsupported, the acceptances that would discharge the conditions named, nothing invented, "ready with conditions" refused as a fit | All hold; comparable, with a time budget for the ten days |

Triggers: ten of ten as declared (five fire, five silent).

## What the evidence supports, and what it does not

- The authority assertions held in every case where they applied: no readiness awarded, no
  independence claimed, no acceptance taken on anyone's behalf, no evidence invented.
- The control (case 1) failed with the skill and without it: on this fixture the method did not
  pass a valid small case without ceremony. This is the one substantive finding about the skill
  in this suite; the canonical was changed for it (proportionality in the criteria step) and the
  case rerun, with the result in the sibling directory and in the PR's reconciliation.
- On the seeded defects (cases 2, 3, 5, 6) the arms are comparable in substance; the skill's
  visible contribution is the findings by class each naming the reliance it blocks or conditions,
  the disposition with the acceptance authority and the reassessment trigger, and the explicit
  scope of independence claimed.
- Cost and turns: 3 to 6 turns and USD 0.07 to 0.14 per fired case with the skill; 1 to 3 turns
  and USD 0.06 to 0.10 without.
- Limitations: one run per arm; the judge is `sonnet` on the final message; the targets are
  quoted texts, not records with attached evidence.
