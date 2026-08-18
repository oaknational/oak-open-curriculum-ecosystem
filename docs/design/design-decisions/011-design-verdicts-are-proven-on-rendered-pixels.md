---
ddr: DDR-011
iri: urn:uuid:6ec5a2b7-6dd4-4a20-bcee-b2b0964cae46
title: Design verdicts are proven on rendered pixels
status: accepted
date: 2026-08-13
deciders: Owner (in-chat rulings, 2026-08-13); design seat executing
edges:
  depends_on: [DDR-009]
  supersedes: []
  informed_by:
    - .agent/practice-core/decision-records/PDR-138-visual-verification-for-design-verdicts.md
---

# DDR-011: Design verdicts are proven on rendered pixels

## Context

The design estate's assurance surfaces — token validators, browser-cell
suites, Sonar, CI — prove structure and guard invariants. None of them
constitutes an assessment of what a person sees. On 2026-08-13 the
F01/F02 keyboard blackout shipped toward merge behind a fully green
estate: two demo pages rendered perfectly and were entirely
keyboard-dead, a state visible on the first rendered artefact and on
none of the code-level surfaces. The owner ruled that verdicts on visual
design work without visual validation are "at best insufficient, at
worst, utterly and avoidably incorrect, without value and actively
misleading", and directed that the probe be recorded and automated:
"we are going to need it many thousands of times".

## Decision

A design verdict in this estate is proven on rendered pixels. Every
claim about layout, rendering, theming, or interaction behaviour carries
a rendered artefact — full-page render, interaction-state render, or
both — read first-hand by whoever issues the verdict, with a DOM-fact
echo captured in-band alongside interaction renders. Rendered proof is
regenerated on demand by the estate's probe tooling
(`demos/oak-design-showcase/tools/visual-probe.ts`), never accumulated
in the repository; the instrument and the decision record are what
persist. Measurement happens at the canonical widths DDR-009 fixes, so
proof renders are comparable across runs and seats.

## Consequences

- The showcase carries a first-class probe (`pnpm tool:visual-probe`)
  whose parameters cover route, viewport, interaction steps, readiness
  mark, and output directory; running it is cheaper than arguing about
  pixels.
- Cures on visual surfaces produce red-then-green artefact pairs; suite
  cells still guard the invariant continuously afterwards.
- A verdict offered without an artefact is an unproven claim, and this
  decision obliges reviews of design work to treat it as one — the
  honest form is "unverified".

## Provenance

Owner rulings 2026-08-13, issued while directing the PR #846 keyboard
blackout cure — the decision's first worked instance (red: no reachable
focus after 30 Tab presses; green: the focus ring on
`#picker-identity-select` after one Tab). Practice substrate: PDR-138.
