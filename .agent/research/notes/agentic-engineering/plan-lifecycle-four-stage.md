# Plan Lifecycle: Four-Stage Model

> **Origin**: oak-mcp-ecosystem, 2026-03-19
> **Source evidence**: pine-scripts integration
> **Status**: Research note — oak uses a richer 5-state model
> (`active`/`paused`/`archived`/`research`/`future`). This file documents
> the minimal four-stage alternative for downstream repos at POC or
> early Production scope.
> **Routing**: relocated 2026-04-22 (Session 7, `memory-feedback` thread)
> from `.agent/practice-context/outgoing/` to research-tier per
> [PDR-014 §Graduation-target routing](../../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md#graduation-target-routing)
> — content is reference-shape (read-to-learn for downstream repos),
> not Practice-governance, not engineering-pattern. Lands in research
> notes (per PDR-032's research-tier definition) rather than the
> curated `.agent/reference/` tier; promotion to curated reference
> requires an owner-vet pass through the PDR-032 gate.

## The Gap

The jump from "future idea" to "actively being implemented" is large. Without
an intermediate state, `active/` contains plans in various states of readiness,
and there is no way to see "what's next" without reading through all of them.

## Four-Stage Model

```text
future/  →  ready/  →  active/  →  archive/
(idea)      (scoped)   (doing)     (done)
```

- **future/**: Speculative — may never happen
- **ready/**: Scoped, broken down, accepted for work — but not yet started
- **active/**: Someone has opened the editor
- **archive/**: Complete or abandoned

## Naming

The original proposal used `current/` for the second stage, but "current"
overlaps with "active" in everyday usage. `ready/` or `scoped/` are clearer
alternatives.

## Oak's Richer Model

Oak uses five states: `active/`, `paused/`, `archived/`, `research/`,
`future/`. The `paused/` state preserves resumable execution context for
incomplete but non-primary workstreams — an important distinction at
Production-scope maturity. `research/` separates exploratory investigation
from committed plans.

## When This Document Is Useful

For repos at POC or early Production scope where a simpler lifecycle is
appropriate. Repos that outgrow four stages can adopt oak's model or design
their own.
