---
related_pdr: PDR-018
name: end-goals-over-means-goals
polarity: pattern
category: process
barrier_met: true
proven_by: "Sentry canonical alignment session 2026-04-13 — 15-item plan produced busywork when framed as 'close gaps' (means goal) vs 'developers can debug errors' (end goal)"
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# End Goals Over Means Goals

## Pattern

Frame work in terms of what the user ultimately needs (end goal),
not what the plan says to do (means goal). A means goal like
"close 15 gaps" or "achieve canonical alignment" generates items
that may not serve the actual need. The end goal — "a developer
can debug a production error" — filters out items that don't
contribute to the chain.

## Anti-pattern

Grinding through a well-reviewed, internally-consistent plan
without questioning whether each item serves the actual goal.
Consensus and reviewer validation do not substitute for judgement
about whether an item should exist at all.

## Test

For each item: "If I remove this, can a developer still debug
a production error (or whatever the end goal is)?" If yes, the
item is an enhancement, not a foundation piece. Do the foundation
first.

## Example

A Sentry integration plan had 15 items including CLI preload
flags, custom metrics, profiling evaluation, and trace
propagation. Only 3 items (context enrichment, source maps,
clean shutdown) were actually needed for "working Sentry." The
rest were enhancements on top of a system that wasn't useful yet.

## The golden-set variant (means-vs-ends screen)

Run this screen on any *"prove X against a golden/reference set"*
framing: the golden set / recall gate **tunes the instrument**; the
end is what the work actually produces (the discovery, the shipped
behaviour). It is easy to harden the tuning dial into the milestone —
the corpus-analysis arc PASS/FAILed its plan on a recall gate until
the owner corrected: "tuning against the golden dataset was not the
ends, just a means to getting to the ends more effectively"
(2026-06-30). The tell: **the success criterion measures the
instrument's fidelity, not the work's value.** A criterion like that
can declare false success (high recall, trivial yield) or false
failure (rich new insight but a missed narrow baseline → an expensive
re-run for a tuning point after the value was already delivered). Cure:
the deliverable is the conserved output; the reference-set score is a
credibility dial, and a miss triggers "did it cost real value?", never
an automatic re-run.
