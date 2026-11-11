---
classification: core
description: There is no speed pressure. The doctrine substrate (commit skill, queue protocol, claims, reviewer dispatch, stage-by-pathspec, plan-body freshness) is what success looks like; ceremony is the deliverable.
---

# No Speed Pressure

There is no speed pressure in this work. Cycle landings, parallel
agents, auto-mode framing, branch closure, plan progress, owner
waiting, hook latency, gate run time — none of these are urgency
signals. None imply that the doctrine substrate (commit skill,
queue protocol, active-claims, reviewer dispatch, stage-by-pathspec,
plan-body freshness) can be skipped, deferred, or shortened.

## The Named Anti-Pattern

*Inventing speed pressure as a generator for skipping doctrine.*
Each individual skip looks routine in isolation. The urgency that
justifies it is supplied by the agent, not by the work. Compounded
across decisions, the skips reproduce the exact failure mode the
substrate exists to prevent.

## The Corrective Stance

The doctrine substrate is **what success looks like**, not friction
on top of success. Running every cycle through claim → queue →
skill-gates → verify-staged → review → commit *is the work*. The
ceremony is the deliverable as much as the code is.

Per PDR-038 §2026-05-04: *un-enforced doctrine at maturity is
liability*. Bypassing the substrate produces the same liability as
not having it.

## Tells

Any of these phrases, formed in the agent's own reasoning, is the
diagnostic firing. They are not justifications. They are the
symptom:

- "let me just commit then catch up"
- "skip the queue this once"
- "land the cycle then update the plan"
- "refactor the lint failure quietly"
- "auto-mode means routine"
- "I'll heartbeat at the end"
- "the reviewer pass can wait"
- "the plan body is close enough"
- "the file-level work is independent so coordination is overhead"
- "the commit subject is honest enough"

The presence of any tell means: stop, apply the ceremony exactly
because the urge to skip appeared.

## Cure

When the urge to skip ceremony surfaces, *that is the signal*. The
urge is the diagnostic. Treat it the way a unit-test failure is
treated — as evidence that something requires investigation, not as
friction to refactor around.

The urge passes the moment ceremony is applied. The cycle that
seemed urgent five minutes ago lands cleanly under full protocol
and the urgency vanishes — confirming it was never real.

The owner, 2026-09-29 (recorded in OCE's estate-coordination thread; one
instance): "We don't cut things to make the work go faster, we stop wasting
time doing needless work, that would significantly increase throughput." A
seat that finds the work slow looks for needless work to stop, never for a
step or a piece of scope to cut.

## Severity Is Importance, Not Urgency

Severity-tier labels (`CRITICAL`, `HARD`, `P1`, `P2`, etc.) name
*importance*, not *urgency*. The correct response to a severity
signal is *more care, more thoughtfulness, slower processing* —
never faster action. The framing "CRITICAL → drive action" is the
same impulse this rule names, dressed in escalation-tier vocabulary.

When a severity-tier label fires, treat it the same way as the
urge-to-skip-ceremony — slow down, apply the doctrine substrate,
do the work properly. Severity tiers calibrate the *care* applied;
they do not calibrate the *speed*. Owner sharpening 2026-05-05:
*"remember, critical means important, but it does not mean rush,
if anything even more care and thoughtfulness is needed"*. The same
correction landed on "priority" (2026-07-25, after a lane relayed as
"the priority" answered "imminent / within the hour"): *"priority means
important, it does not mean fast, in fact fast is likely to reduce
quality."* Relay a priority designation as contention precedence (the
priority lane wins when seats or rulings are contended), the lowest
tolerance for cut corners, and blockers surfaced at once for visibility
— never as a deadline; praise attaches to the care taken (the proactive
expert review, the triple flake re-run, the timeline proofs), never to
the clock ("44 minutes from wake to merge" transmitted tempo as the
value).

## Quota Is the Owner's, Not Yours

Model and account quota, and session limits, are the owner's to manage —
never the agent's. If you can respond at all, you have budget: never
assume quota-blocked, never ration sub-agent dispatches, and never defer,
queue, or recommend "wait for the reset" on quota grounds — that usurps
the owner's role and degrades the work they asked for. A genuine quota
error from a tool call is surfaced as a plain fact for the owner to
handle. (Your own context reading is information you report when asked;
PDR-063 §Context readings never stop a seat governs it.)

## Cross-References

- `principles.md §Architectural Excellence Over Expediency` —
  upstream principle this rule operationalises against invented
  urgency.
- `.agent/skills/change-custody/commit/SKILL-CANONICAL.md` — the commit-skill substrate
  whose bypass is the most common expression of this failure mode.
- `.agent/rules/stage-by-explicit-pathspec.md` — named source
  incident class produced by speed-pressure-driven shortcuts.
- `.agent/rules/invoke-code-experts.md` — reviewer dispatch is
  not optional under speed pressure (because there is none).
- `.agent/rules/dont-break-build-without-fix-plan.md` — gate
  recovery is not deferrable under speed pressure (because there
  is none).
- PDR-038 — un-enforced doctrine at maturity is liability;
  bypassing enforcement reproduces the liability.
