---
name: "Static Analysis Registration With Scaffold"
polarity: pattern
use_this_when: >-
  Scaffolding a package, public export, or sub-path barrel before all planned
  consumers exist.
category: process
proven_in: ".dependency-cruiser.mjs; .agent/plans/connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md"
proven_date: 2026-05-12
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Public scaffold exports being flagged as orphaned or unused before their planned consumers land"
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure
> mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

# Static Analysis Registration With Scaffold

When scaffolding a package or sub-path export ahead of its consumers, register
the scaffold with static-analysis tooling in the same landing. A public export
can be legitimate before an inbound import exists; the absence of the consumer
is only acceptable when the static-analysis exception is explicit and tied to
the scaffold's planned public surface.

## Pattern

1. Add the package, barrel, or sub-path export.
2. Register workspace, TypeScript, lint, Knip, and depcruise shape in the same
   scaffold landing.
3. Add precise no-orphan exceptions only for exported public entrypoints that
   are intentionally consumer-first.
4. Remove the exception once a real consumer imports the entrypoint or the
   export is withdrawn.

## Anti-pattern

Landing public barrels first and letting depcruise or Knip flag them later as
"expected" noise. The exception then becomes invisible debt, or the scaffold is
reshaped to satisfy tooling rather than to reflect the intended package API.

## Evidence

The graph-stack scaffold work showed that pre-declared sub-path barrels consumed
through `package.json` exports can have no inbound imports yet. The scaffold
checklist had to include the `.dependency-cruiser.mjs` exception beside the
workspace, Knip, tsconfig, package, and lockfile updates.

## When to Apply

- New workspace scaffolds with package exports.
- Public API barrels planned for a later consumer cycle.
- Multi-package plans where foundation packages land before app or library
  consumers.
