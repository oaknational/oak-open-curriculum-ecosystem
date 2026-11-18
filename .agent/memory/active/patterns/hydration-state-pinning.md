---
name: "Hydration State Pinning: Any Check Against a Progressively-Enhanced Page Must Pin Which Enhancement State It Measures"
polarity: pattern
use_this_when: "Writing or trusting any capture, measurement, interaction proof, accessibility scan, or fidelity check against a page that hydrates (SSR + client JS) — a fast run otherwise races the hydration boundary and measures an arbitrary state."
category: testing
layer: family
proven_in: "curriculum-hub-demo 2026-07-02 (Limpet, named by Peregrine's closeout): three tools independently defended the same trust boundary — the capture witness, the interaction proof, and the two-state measurement (each defined in the body)."
proven_date: 2026-07-02
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A check that does not pin its enhancement state passes or fails by race: a pre-hydration click no-ops silently, a pre-hydration capture shows the SSR shell, and the verdict asserts something about a state the check never controlled."
  stable: true
---

# Hydration State Pinning

> **POLARITY: PATTERN.** One trust boundary, three defence shapes — pick
> the one the check needs, but always PIN the state and prove it was
> reached.

## The shape

Any check against a progressively-enhanced page declares which
enhancement state it measures and proves that state was reached:

- **SSR witness** — assert on the no-JS payload (e.g. SSR ships zero
  `[hidden]`; presence of the element proves the server side).
- **Interaction proof** — before trusting a click/keystroke, prove
  hydration completed by observing its effect (click until
  `aria-expanded` flips); a pre-hydration interaction silently no-ops.
- **Two-state measurement** — run a deterministic no-JS pass AND a
  hydrated pass; comparing them is the measurement. A single fast run
  races the boundary and measures an arbitrary intermediate state.

## Capture gotchas that break the pin

- `127.0.0.1` targets never hydrate in the observed setup — use
  `localhost`.
- Capturing a `next dev` page: wait on `domcontentloaded`, never
  `networkidle` (the HMR websocket keeps networkidle from firing).
- A JS-hydrated static export (`.dc.html`) fetches data at runtime:
  `file://` CORS-blocks it and renders blank — serve over local HTTP +
  `networkidle` + `document.fonts.ready`.
