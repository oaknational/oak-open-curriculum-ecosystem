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
if anything even more care and thoughtfulness is needed"*.

## Cross-References

- `principles.md §Architectural Excellence Over Expediency` —
  upstream principle this rule operationalises against invented
  urgency.
- `.agent/skills/commit/SKILL.md` — the commit-skill substrate
  whose bypass is the most common expression of this failure mode.
- `.agent/rules/stage-by-explicit-pathspec.md` — named source
  incident class produced by speed-pressure-driven shortcuts.
- `.agent/rules/invoke-code-reviewers.md` — reviewer dispatch is
  not optional under speed pressure (because there is none).
- `.agent/rules/dont-break-build-without-fix-plan.md` — gate
  recovery is not deferrable under speed pressure (because there
  is none).
- PDR-038 — un-enforced doctrine at maturity is liability;
  bypassing enforcement reproduces the liability.
