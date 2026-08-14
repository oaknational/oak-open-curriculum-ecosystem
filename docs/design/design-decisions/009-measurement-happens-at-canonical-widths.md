---
ddr: DDR-009
iri: urn:uuid:f6247464-80d5-40e3-9b64-59d5678a2955
title: Measurement happens at canonical widths
status: accepted
date: 2026-08-10
deciders: Jim Cresswell (owner); set derived at the design-lane seat
edges:
  depends_on: [DDR-001]
  supersedes: []
  informed_by: []
  related:
    - DDR-008
---

# DDR-009: Measurement happens at canonical widths

## Context

The reproduction pipeline's claim — take something that looks amazing and
was hacked together, produce something that looks amazing _because it looks
the same_, built on the design system with best-practice engineering —
rests on comparison. "Looks the same" is a measured verdict, and a
measurement needs agreed places to measure.

Before this decision the places were ad hoc: the fidelity capture took a
bare `--width` flag whose convention (1440) lived in a code comment, and
individual probes picked viewport widths per occasion. Two captures of the
same pair could disagree simply by being taken at different widths, and
nothing recorded why any width had been chosen — coverage was a habit, not
an argument.

The owner directed (2026-08-10): a canonical set of measurement widths,
recorded, at least three, sized for the best coverage.

## Decision

Every fidelity capture, geometry probe, and visual comparison measures at a
single canonical set of viewport widths, and the set is **derived, never
invented**. Its sources, in order of authority:

1. **The kit's own seams.** The design system has exactly one width seam —
   `max-width: 840px` switches the canvas and main grids to their -narrow
   maps — and the set proves every seam from both sides.
2. **The contractual floor.** WCAG 2.2 SC 1.4.10 fixes 320 CSS px as the
   narrowest width the page must serve without horizontal scroll; the set
   always starts there.
3. **The device landscape.** The widths real visitors hold earn cells; a
   width no device class occupies does not.
4. **The reference canvas.** The width the reproduction target was designed
   at is the primary comparison cell.

The current derivation yields six widths — 320, 390, 768, 1024, 1440,
1920 — and the **enforced source of truth is the tracked module**
`demos/oak-design-showcase/tools/measurement-widths.ts`: each entry carries
the failure class it exists to catch, and unit cells pin the floor, the
seam bracketing, the ordering, and the canvas cell. This record governs the
_discipline_; the module owns the _values_ — a seam added to the kit or a
shift in the device landscape changes the module (and its cells) without
reopening this decision.

Amendment is by warrant: adding a width means naming the failure class the
current set misses; removing one means naming which remaining cell now
covers its class.

## Dated amendment — 1280 joins the set (2026-08-10, owner-directed)

`1280 / switchboard-canvas` joins the canonical set. Failure class it
catches: picker-parity — the export's own switchboard frames its specimen
at a 1280 canvas, and the owner's side-by-side comparison of the two
demos happens THERE, so a picker defaulting to any other width shows
every proportion ~12% off and manufactures phantom deltas (observed
2026-08-10: "black outlines, curved corners, smaller fonts" were one
scale artefact). The picker opens at 1280; the standalone-specimen
fidelity convention stays at 1440.

## Consequences

- Coverage is an argument, not a habit: every report can print why each
  cell exists, and a disputed comparison resolves against the recorded
  warrant.
- Two captures of the same pair are comparable by construction — same
  widths, every time.
- The kit's 840px seam is proven from both sides in every measured run, so
  a narrow-map regression cannot hide behind a desktop-only capture.
- Capture tooling consumes the module rather than accepting free-hand
  widths; the wiring lands with the reproduction work it serves.

## Provenance

- Owner direction, 2026-08-10, in-session: a canonical, recorded set of
  measurement widths, "at least three, but whatever number gives us the
  best coverage" — issued immediately after the reproduce-the-demo
  redirection that made comparison the lane's acceptance test.
- The derived set and its per-width warrants: the measurement-widths module
  and its unit cells, landed the same day.
