---
name: "A Lint-Rule Pincer Is a Design Signal, Not an Obstacle"
polarity: pattern
use_this_when: "Two (or more) lint rules jointly ban every shape you can think of for an in-component or in-function implementation, and the reflex is to disable one rule or contort past them."
category: code
layer: general
proven_in: "curriculum-hub-demo 2026-07-02 (Galago), twice in one session: react-hooks/refs + react/no-set-state-in-effect jointly banned every in-component shape for hash stickiness — the escape was moving the state OUT of React (a useSyncExternalStore store owning the state machine), which was the better architecture; and max-lines forcing the quiz state/presentation split."
proven_date: 2026-07-02
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "The pincer's apparent dead-end invites a rule disable (forbidden — never-disable-checks) or a tortured in-place shape; both miss that the joint constraint is pointing at a structural move (extract, relocate state, split responsibility) that produces better architecture."
  stable: true
---

# A Lint-Rule Pincer Is a Design Signal

> **POLARITY: PATTERN.** When every local shape is banned, the design
> wants a structural move, not a cleverer local shape.

## The shape

1. Enumerate the shapes the rules jointly ban — if every *in-place*
   variant trips one rule or the other, stop iterating locally.
2. Ask what structural move dissolves the pincer: move state out of the
   component (external store), split the file's responsibilities,
   extract the seam. The joint constraint usually names the move.
3. The result is architecture the rules were designed to produce —
   `tool-error-as-question` applied to a rule *pair*.

Composes with `principled-eslint-zoning` (the legitimate scoped-zone
case is build tooling / generated artefacts — app logic never zones its
way out of a pincer) and `never-disable-checks`.
