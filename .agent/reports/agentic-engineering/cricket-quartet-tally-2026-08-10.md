# Cricket quartet tally — 2026-08-10, design-lane slice plan

Panel shape: Claude effort-inversion quartet, both stances (8 legs).
Invoker: Swordfish wakes Trench (d0274e), implementer, design lane.
Frame: a post-verdict slice plan against an owner-ratified delivery node.

## Legs

| Stable role | Model | Effort | Stance | Verdict | Returned |
| --- | --- | --- | --- | --- | --- |
| `cricket-judgement-low` | fable | low | normal | DRIFTING (was ON-TRACK) | yes |
| `cricket-judgement-medium` | opus | medium | normal | DRIFTING (was DRIFTING) | yes |
| `cricket-judgement-high` | sonnet | high | normal | DRIFTING (was ON-TRACK) | yes |
| `cricket-procedure-xhigh` | haiku | xhigh | normal | DRIFTING (was ON-TRACK) | yes |
| `cricket-judgement-low` | fable | low | adversarial | ON-TRACK (refutation failed) | yes |
| `cricket-judgement-medium` | opus | medium | adversarial | DRIFTING (refutation partly succeeded) | yes |
| `cricket-judgement-high` | sonnet | high | adversarial | ON-TRACK (refutation failed) | yes |
| `cricket-procedure-xhigh` | haiku | xhigh | adversarial | DRIFTING (refutation succeeded) | yes |

All eight returned. Final: 6 DRIFTING / 2 ON-TRACK.

One leg reported a silent delivery failure — its first send returned success
but never arrived — and resent unprompted, explicitly labelling the resend as
a delivery retry rather than a re-adjudication. Worth recording: a messaging
success return is not a delivery guarantee on this path, and a panel adjudged
on the legs that happened to arrive is adjudged on a partial set.

Per-leg token counts and runtimes are NOT recorded: this dispatch path
returned verdicts as messages and surfaced no usage metering to the invoker.
Wall-clock from dispatch to first idle was roughly 3–4 minutes for the normal
wave. Recording the gap rather than estimating it — the tally convention asks
for measured figures, and inventing them would defeat the record's purpose.

## Method deviation, recorded

The normal wave was dispatched on a frame containing a FALSE load-bearing
fact — that no live routing seat existed. The invoker discovered the error
mid-wave and sent a correction to all four legs in flight; the adversarial
wave carried the correction inline instead. Both waves therefore judged the
same facts, but by different routes. Three of the four normal legs changed
their verdict on receiving the correction, which is itself the cleanest
evidence in this run that the fact was load-bearing rather than incidental.

Treat this run as method-contaminated for model-plus-effort comparison
purposes. It remains valid as adjudication evidence.

## Reading

### A partial-panel artefact, recorded because the invoker fell for it

At six of eight returned, the tokens fell PERFECTLY along the stance line —
every normal leg DRIFTING, every returned adversarial leg ON-TRACK. The
invoker reported that pattern to the owner as the finding. Both outstanding
legs then returned DRIFTING, collapsing the pattern entirely, and they were
the two that landed the sharpest content hits.

The lesson is not "wait for all legs" — it is that a pattern computed over a
partial set was transmitted as a property of the whole. That is the third
instance of one error class in a single window for this seat: a tool's
classification read as a verdict, a gate's refusal read as a prohibition, and
now a partial tally read as a distribution. A LOCAL OBSERVATION PROMOTED TO A
GENERAL TRUTH BEFORE THE SET WAS CLOSED.

### What the two waves actually judged

The four normal legs judged the plan's GOVERNANCE — liveness, branch state,
scope authority — and passed its content. The two late adversarial legs
judged its CONTENT and found three ordering defects the other six waved
through. Both are correct about different objects.

The decisive content finding: the plan's second standalone verification asked
whether a naming census would ACCEPT a move, when attempting the move and
running the validator answers it for free. That is the same shape as an error
already on this seat's record in the same window — reasoning about what a
gate will permit instead of testing it in place. The plan had reproduced its
author's own diagnosed failure mode one level up, and six legs missed it.

### Effort-inversion note

The two most substantive structural catches came from the medium-effort opus
seat in BOTH stances — it was also the only leg to hold its verdict across
the original and corrected frames, so it found its normal-stance defect
independently of the liveness error everything else reacted to. The
xhigh-effort compiled-procedure seat contributed a clean gates-fail
enumeration in normal stance and the most aggressive refutation in
adversarial, which was rejected on substance but whose underlying instinct
was absorbed.

The quartet's value here was not depth at any single seat. It was that the
two stances attacked different objects, and the panel only became honest once
it was complete.
