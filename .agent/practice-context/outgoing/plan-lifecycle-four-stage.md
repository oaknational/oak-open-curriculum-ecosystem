# Plan Lifecycle: Four-Stage Model

> **Origin**: oak-mcp-ecosystem, 2026-03-19
> **Source evidence**: pine-scripts integration
> **Status**: Reference — oak uses a richer model; this documents the minimal
> pattern for repos that need fewer stages

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
