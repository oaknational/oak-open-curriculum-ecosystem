---
ddr: DDR-004
iri: urn:uuid:eeb2e972-1c2a-4162-86a6-39451907627c
title: Five themes; access themes are first-class
status: accepted
date: 2026-08-02
deciders: design lane, standing owner accessibility posture
edges:
  depends_on: [DDR-002]
  supersedes: []
  informed_by:
    - demos/oak-curriculum-hub/components/ThemeSwitcher.tsx
  related: []
---

# DDR-004: Five themes; access themes are first-class

## Context

Theme sets often ship light/dark and treat accessibility variants as
add-ons. This system's audience (teachers, in classrooms, on varied
hardware) makes contrast and colour-vision needs ordinary, not exceptional.

## Decision

The selectable theme set is **light, dark, system, high-contrast,
colour-safe**. `system` is the OS-resolution option — it resolves to light
or dark and carries no token tree of its own; the four palette themes
carry the token coverage. The access themes are not optional extras: every
surface that offers theme choice offers all five selections, and every
palette theme is a full peer in token coverage, contrast machinery, and
testing.

## Consequences

- A consumer control that lists a subset of themes is non-conformant.
- Palette work (DDR-007) runs its contrast machinery across all four
  palette themes — a perturbation acceptable in light/dark but failing in
  high-contrast is rejected.
- Token additions land in all four palette themes or not at all
  (`system` has no tree to land in — it resolves).

## Provenance

- The hub ThemeSwitcher carries the working statement ("the access themes
  are not optional extras") and offers all five; landed through the
  2026-08-02 lane (PRs #710/#715).
- The per-theme coverage obligation, in-record: rendered accessibility and
  contrast gates run per identity × palette-theme cell across the four
  token-bearing themes (`system` is gated through its light and dark
  resolutions, never as a fifth cell) with the cell count pinned, so a
  shrinking matrix is visible;
  execution sequencing is the delivery plan's concern, not this record's.
