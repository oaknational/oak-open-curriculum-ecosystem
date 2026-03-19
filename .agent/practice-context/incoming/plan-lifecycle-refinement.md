# Plan Lifecycle Refinement

> **Source**: `pine-scripts` integration
> **Status**: Proposal and observation

## Current State in oak-mcp

Plans are grouped by domain with `active/` and `future/` directories, plus `archive/` implied.

## Extended Lifecycle from pine-scripts

The `pine-scripts` integration adopted a four-stage lifecycle:

```text
future/  →  current/  →  active/  →  archive/
(idea)      (scoped)     (doing)     (done)
```

### Why four stages instead of two

The gap between "future idea" and "actively being implemented" is large. In practice, there is a meaningful intermediate state: **scoped and queued but not yet started.** This is the "current tranche" — work that has been planned, broken down, and accepted for the current development cycle but where nobody has opened the editor yet.

Without this intermediate state, plans jump directly from "vague idea" to "in-flight work," which means:
1. Plans in `active/` might actually be in various states of readiness
2. There's no way to see "what's next" without reading through all plans
3. The transition from idea to action has no intermediate checkpoint

### The naming problem

The user noted that "current" is "a little confusing and perhaps should change." The confusion arises because "current" in everyday usage means "happening now," which overlaps with "active."

Alternatives considered:
- `queued/` — implies strict ordering
- `ready/` — emphasises that the plan is implementable
- `next/` — implies a single next item
- `scoped/` — most precise but least intuitive

No recommendation — this benefits from broader input.

### Domain grouping

Both repos organise plans by domain (`strategy-research/`, `agentic-engineering/`). This pattern scales well and should be documented as a convention.

### File naming

The `.plan.md` extension convention distinguishes plans from other markdown files and enables tooling (glob for `**/*.plan.md` to find all plans).

## Recommendation

Standardise the four-stage lifecycle in the Practice Core with a consistent naming convention. The exact stage names are less important than having the concept documented and consistently applied.
