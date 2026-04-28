---
related_pdr: PDR-018
name: end-goals-over-means-goals
category: process
barrier_met: true
proven_by: "Sentry canonical alignment session 2026-04-13 — 15-item plan produced busywork when framed as 'close gaps' (means goal) vs 'developers can debug errors' (end goal)"
---

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
Consensus and reviewer validation do not substitute for judgment
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
