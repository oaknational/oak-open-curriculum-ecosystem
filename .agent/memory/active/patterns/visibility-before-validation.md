---
name: Visibility Before Validation
polarity: pattern
use_this_when: About to build a validator, guard, or scanner over a surface whose current shape accumulated organically rather than by deliberate design
category: process
layer: general
proven_in: .agent/memory/active/napkin.md (2026-07-09, mcp-agent-facing-content audit)
proven_date: 2026-07-09
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Building an enforcement mechanism (validator, guard, scanner) over a surface's current shape before that shape has been reviewed and ratified as the correct one — silently ratifying an unintentional structure by enforcing it"
  stable: true
---

> **POLARITY: PATTERN.** This entry describes a positive shape to repeat: make
> an evolved surface visible for review before building enforcement over it.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

## Principle

A surface that accumulated its current shape organically — a classification
scheme, a taxonomy field, a folder structure, a set of categories — has not
necessarily been *chosen*; it may simply be whatever fell out of successive
additions. Building a validator, guard, or scanner over that shape has a
hidden cost distinct from the enforcement itself: **the act of enforcing a
shape ratifies it**, whether or not anyone actually reviewed and agreed the
shape was correct. The enforcement mechanism makes the accidental shape look
deliberate to everyone downstream, including the enforcement's own author a
session later.

The correct order is: make the surface's current shape **visible for
review** first (present it plainly, name what generated it, name the
open questions it raises); let the surface be **ratified** — explicitly
agreed as correct, amended, or replaced; only then **build the guard** that
enforces the ratified shape.

## Worked Instance (2026-07-09, mcp-agent-facing-content audit)

Building the classified content registry, an agent's `review_domain` field
was a deterministic scalar heuristic assigned during registry generation —
useful evidence, but never reviewed as a taxonomy by anyone. Treating the
current set of domain values as ready-made package or workspace boundaries
would have repeated the failure shape at architecture altitude: enforcing a
structure that had never been ratified as correct, one level higher than the
original miss. The owner correction that grounded this: validate-first
proposals must distinguish "this is evidence toward a taxonomy" from "this
is the taxonomy" — and only the latter is safe to enforce.

## Countermeasure

Before writing a validator, guard, or scanner over a classification,
taxonomy, or structural surface, ask: has this shape actually been reviewed
and agreed, or did it just accumulate? If the honest answer is "it
accumulated", surface the shape plainly to the owner (or the relevant
reviewer) for ratification first — build the guard only after that
ratification, never before it as a way of settling the question implicitly.
