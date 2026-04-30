# Component: Substrate vs Axis Plans (Multi-Axis Collections)

Use this component in any plan **collection** whose organising
principle has multiple axes / dimensions / domains, e.g. the
five-axis observability frame (engineering, product, usability,
accessibility, security), a future security collection organised by
trust-boundary × layer, or a semantic-search collection organised by
signal × algorithm.

## The distinction

A multi-axis collection contains two structurally different kinds of
plan:

- **Axis-shipping plans** ship at least one named output on at least
  one of the collection's axes. They are the visible product of the
  collection (telemetry, signals, decisions, capabilities).
- **Substrate plans** enable axis-shipping work without themselves
  shipping any axis output. Removing one would not lose any axis
  signal directly, but every axis-shipping plan would have to
  re-derive the same infrastructure.

The two kinds need different inventory treatment, different
review lenses, and different promotion criteria. Conflating them
forces substrate plans into a single axis (misleading) or hides
them from axis-by-axis scanning (invisible).

## When to apply this component

The component applies when **all three** are true:

1. The collection's primary navigation surface is the axis frame
   (typically a five-or-N-axis coverage table at the top of the
   collection's high-level plan).
2. At least two plans in the collection meet the substrate
   criterion: removing them would not lose any axis signal but
   would force every axis-shipping plan to re-derive the same
   infrastructure.
3. The substrate plans are not already gathered under their own
   inventory section.

If only one substrate plan exists, you do not need a section yet —
note its substrate role in its own plan body and revisit when a
second appears.

## Recommended shape — collection's high-level plan

Add a `### Substrate (cross-axis infrastructure)` section to the
plan inventory, alongside the lifecycle tables. Keep each substrate
plan's canonical lifecycle entry where it already lives; the
substrate section is a **cross-cut index**, not a relocation.

```markdown
### Substrate (cross-axis infrastructure)

Plans whose primary value is enabling axis-shipping work rather
than shipping axis output. Removing any one would not lose an
axis signal directly, but every axis-shipping plan would have
to re-derive the same infrastructure.

| Plan | Lifecycle | Substrate role |
|---|---|---|
| [`<plan-link>`](path) | `current/` | One-line description of what this enables for axis plans |
| [`<plan-link>`](path) | `future/` | One-line description |
```

The substrate section lists plans by name + link + brief role.
Detailed promotion triggers, scope, and risks remain in the
canonical lifecycle table or the plan body.

## Recommended shape — collection's foundational ADR

If a foundational ADR governs the axis frame (e.g. ADR-162 for
observability), add a one-line cross-reference under the section
that names cross-axis structural commitments:

```markdown
Substrate plans listed in the [collection's high-level plan](
../../../.agent/plans/<collection>/high-level-<collection>-plan.md
#substrate-cross-axis-infrastructure) implement the closure-
property and cross-axis infrastructure this section names.
```

The ADR retains the principle; the high-level plan retains the
inventory. The cross-reference makes the link explicit so the
ADR-to-plan dependency is not tacit.

## Criterion at a glance

| Plan ships axis output? | Plan derives infrastructure used by ≥2 axes? | Category |
|---|---|---|
| Yes | irrelevant | **Axis** (place under primary axis) |
| No | Yes | **Substrate** |
| No | No | Reconsider whether plan belongs in the collection at all |

## Working principle behind this component

> **When you have to invent a justification for an exception, the
> categorisation is incomplete — not the exception unusual.**

If you find yourself writing prose to explain why a plan does NOT
fit the standard frame, the frame is missing a category. Adding
the missing category is cheaper than papering over the exception
case-by-case, and the cost only rises as more exceptions accrue.

This principle generalises beyond plan collections: it applies to
type unions, ADR categories, lint rule categories, anywhere a
classification system has implicit edge cases.

## Lifecycle and review

- A new substrate plan should still go through the lifecycle
  (`future/` → `current/` → `active/` → archive).
- The substrate section in the high-level plan is updated at every
  promotion / archival, alongside the lifecycle table.
- At consolidation time, the substrate section gets the same
  rationalisation review as lifecycle tables: which substrate
  plans should merge, archive, or split.

## Related components

- [`foundation-alignment.md`](foundation-alignment.md) — substrate
  plans that touch shared foundations need explicit alignment.
- [`documentation-propagation.md`](documentation-propagation.md) —
  substrate-shape changes propagate to the foundational ADR
  cross-reference.

## History

- **2026-04-30** — Authored after the observability-config-coherence
  plan landed and exposed the implicit substrate category. The
  insight that triggered authorship: the plan author had to invent
  a justification ("cross-cutting infrastructure rather than
  axis-specific telemetry") to explain why the new plan did not
  appear in the five-axis coverage table. That invented
  justification was load-bearing but unrecorded — the signal that
  the categorisation was incomplete. See
  [`.agent/plans/observability/high-level-observability-plan.md`
  §Substrate](../../observability/high-level-observability-plan.md)
  for the first applied instance.
