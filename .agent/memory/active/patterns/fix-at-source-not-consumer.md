---
related_pdr: PDR-017
name: "Fix at source, not consumer"
polarity: pattern
use_this_when: "Multiple workaround attempts fail at the consumer because the producer's type/function/interface is wrong"
category: process
layer: general
proven_in: "packages/sdks/oak-sdk-codegen/code-generation/typegen/paths/path-generators.ts"
proven_date: 2026-04-03
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Accumulating consumer-side workarounds that each fail for related reasons, when a single upstream fix resolves all of them"
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Fix at Source, Not Consumer

## The Pattern

When a consumer cannot use a type, function, or interface correctly, and
multiple workaround attempts at the consumer site fail for related reasons,
the fix is almost always in the producer — the type definition, the
generator template, or the function signature that established the shape.

The owner's general form, ratifying the design-lane instance (2026-08-13,
verbatim): **"fix things at the lowest level where the fix works and
produces the correct outcome."** Both bounds bind. The LOWEST level, never
higher: a page-level cure for a kit-level gap cures one page while the gap
re-appears in every other consumer (the showcase's hyphenation workaround
for the kit's fixed type ramp). And only as low as WHERE THE FIX WORKS AND
PRODUCES THE CORRECT OUTCOME, never lower than effectiveness: clamping the
kit's font-size primitives would have cured only the Oak base, because both
counter-identities re-point whole shorthands and never read the primitives.
Before homing any cure, walk the stack downward and stop at the lowest layer
where the fix both works and yields the correct outcome for every consumer;
name that layer in the plan or PR rationale.

## The Anti-Pattern

Each workaround is locally reasonable. Collectively they form a maze:

- "TypeScript can't see this, so I'll add a hint" -- the type is wrong
- "The constraint doesn't propagate, so I'll widen" -- the constraint is wrong
- "The callback narrows to the wrong form, so I'll inject a different one"
  -- the type the callback narrows to is wrong
- Multiple attempts that all fail for related reasons -- the shared upstream
  cause hasn't been addressed

## The Signal

Three or more failed attempts at the consumer that share a root cause.
Each attempt introduces complexity (generics, callbacks, dispatchers,
constraints) to work around a property of the upstream definition.

## The Question

"Why is this type opaque?" not "How do I use an opaque type?"

## Corollary: Serialisation Boundary Honesty

At serialisation boundaries (JSON.stringify, HTTP response construction),
type-preserving patterns (spread, generics) are compile-time ceremony if
no typed downstream consumer exists. Use `Object.assign` and return
`unknown`. The type is destroyed at serialisation — preserving it through
the function serves no one.
