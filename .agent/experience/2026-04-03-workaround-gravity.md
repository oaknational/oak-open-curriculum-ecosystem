# The Gravity of Workarounds

**Date**: 2026-04-03
**Context**: OakUrlAugmentable codegen fix — replacing
`Readonly<Record<string, unknown>>` with schema-derived types

## What happened

TypeScript's spread checker cannot evaluate `JsonBody200<P, 'get'>` — a type
defined through six layers of conditional and mapped types — even when `P` is
a single literal. The direct `Paths` index form of the same structural type
IS spreadable. I spent an entire session trying to work *around* this gap
rather than fixing the type definition that causes it.

Seven attempts. Each one accepted the premise that `JsonBody200` was
immovable and tried to make the consumer cope: `& object`, `object`
constraint, remove generics, inject callbacks, generate per-path dispatch.
Each failed or was correctly rejected as widening. The attempts accumulated
complexity while moving further from the principles:

- Generator-first: "When behaviour needs to change, update the templates."
- Could it be simpler: the answer was always yes — change the definition.

## The pattern

There is a gravitational pull towards workarounds. When a type, a function,
or a structure doesn't do what you need, the instinct is to work around it
at the point of use rather than fix it at the point of definition. Each
workaround is locally reasonable. Collectively they create a maze that
obscures the one change that would have resolved everything.

The tells:

- "TypeScript can't see this, so I'll add a hint" → the type is wrong
- "The generic constraint doesn't propagate, so I'll use a wider type"
  → the constraint definition is wrong
- "The callback narrows to the wrong form, so I'll inject a different
  callback" → the type the callback narrows to is wrong
- Multiple attempts that all fail for related reasons → the shared
  upstream cause hasn't been addressed

## The lesson

When the consumer cannot use the type correctly, the fix is almost always
in the producer — the generator template, the type definition, the
function signature that established the shape. "Could it be simpler?"
applied to the whole chain, not just to the current function.

In this case: `JsonBody200` is defined through `ResponseForPathAndMethod`,
which uses `PathOperation` (a flattened conditional union). If it instead
used direct `Paths[P][M]['responses'][200]['content']['application/json']`
indexing, the six-layer conditional chain disappears. The fix is one type
definition in the generator template. Everything downstream — spread,
narrowing, augmentation — would follow naturally.

Seven workarounds. One root cause. The root cause was visible from
attempt 1 if I had asked: "Why is this type opaque?" instead of "How do
I spread an opaque type?"
