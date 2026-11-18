---
name: "Closed Union + No-Throw Forces an Exhaustive Total-Function Renderer"
polarity: pattern
use_this_when: "Rendering (or otherwise dispatching over) a closed discriminated union — content blocks, event kinds, state variants — under the repo's no-throw and no-silent-skip disciplines."
category: code
layer: family
proven_in: "curriculum-hub-demo block-render spine (2026-07-01): BlockRenderer.tsx dispatches all 18 block variants of the closed Block union; the definite-assignment pattern makes the compiler prove completeness. Survived the whole branch uncorrected through the full 214-block corpus and every later styling pass."
proven_date: 2026-07-06
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Dispatchers with a default/fallback branch silently swallow new variants (or throw at runtime); the total-function shape converts a missed variant into a compile error at the moment the union widens."
  stable: true
---

# Closed Union + No-Throw Forces an Exhaustive Total-Function Renderer

> **POLARITY: PATTERN.** This is a shape to repeat: the constraints
> compose into a compiler-proven total function — safety by
> construction, no error path at all.

## The shape

1. The input type is a **closed discriminated union** whose data
   boundary validates schema-first (`strict-validation-at-boundary`), so
   no out-of-union value can reach the dispatcher at runtime.
2. The dispatcher assigns its result under **definite assignment**
   (`let view: ReactElement;` + a `switch` over the discriminant with a
   case per variant, no `default`). TypeScript's definite-assignment and
   exhaustiveness analysis then PROVE totality: a new union member is a
   compile error in the dispatcher, not a silent skip or a runtime
   throw.
3. No-throw holds trivially — there is no error path, because the type
   system guarantees the input is one of the handled variants.

## Why it works

Each constraint alone invites a workaround (a `default: return null`
under no-throw; a `default: throw` under exhaustiveness-by-vigilance).
Together they leave exactly one shape: handle every variant. The
compiler becomes the census — when the corpus widens the union (see
`validate-sampled-schema-against-complete-corpus`), every dispatcher
that must change is found mechanically.

## Worked instance

`demos/oak-curriculum-hub/components/blocks/BlockRenderer.tsx` — 18
variants, no default, definite assignment; the union widened twice
during the build (5 sampled-schema gaps; seam extensions) and each
widening surfaced every affected dispatch site at compile time.

## Related

- `use-result-pattern` / no-throw doctrine (ADR-088);
  `strict-validation-at-boundary`; `closed-shape-design-optionality`.
- `validate-sampled-schema-against-complete-corpus` — the companion
  gate that keeps the union honest against the full corpus.
