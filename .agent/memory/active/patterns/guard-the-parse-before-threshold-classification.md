---
name: "Guard the Parse Before a Threshold Classification"
polarity: pattern
use_this_when: "Classifying external or parsed data by a numeric threshold (age buckets, liveness states, severity bands) — gate the value's validity before any comparison, because a NaN or missing value makes every < and > false and silently selects the last/worst branch."
category: code
layer: family
proven_in: "agent-tools comms peer-liveness classifier — classifyState false-`retired` on a malformed created_at (2026-06-28)"
proven_date: 2026-06-28
related_pattern: "explicit-missing-resource-state (the sibling: a missing/invalid value must not be confused with a valid extreme)"
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "An unguarded NaN/missing value silently falling through every threshold comparison into the default (often worst) classification branch."
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: validate the parse before the
> threshold comparison, so a bad value is handled, not silently mis-bucketed.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Guard the Parse Before a Threshold Classification

A classifier that buckets a value by threshold —

```typescript
if (ageMs < FRESH_MS) return 'active';
if (ageMs < OFFLINE_MS) return 'offline';
return 'retired'; // default branch
```

— silently picks the **last branch** when `ageMs` is `NaN`, because `NaN < x`
and `NaN > x` are **both false** in JavaScript. Every comparison fails, so
control flows to the default — frequently the worst bucket (`retired`,
`critical`, `expired`). The bad input is not rejected; it is **mis-classified
with full confidence.**

## Pattern

Gate the value's validity **before** any threshold comparison. A value that does
not parse is not "the most extreme" — it is *unknown*, and unknown is its own
disposition: skip it, quarantine it, or surface it, but never let it fall
through the comparisons.

```typescript
const ageMs = Date.parse(createdAt) ; // NaN on a malformed timestamp
if (Number.isNaN(ageMs)) return skip(); // <-- guard FIRST
if (ageMs < FRESH_MS) return 'active';
...
```

## Worked instance

The peer-liveness classifier read `Date.parse(created_at)` for each heartbeat
and bucketed by age. One malformed `created_at` produced `NaN`, fell through
both `<` comparisons, and classified the peer `retired` — a **silent
false-positive retirement** of a live peer. The cure was to **skip the malformed
event** (consistent with the id-less skip already in the classifier): a peer
whose only heartbeats are corrupt is *absent / unknown*, never falsely
`retired`.

## Why it generalises

Any `classify-by-threshold` over data from outside the type system — parsed
timestamps, parsed numbers, optional fields, vendor responses — carries this
hazard. The threshold comparisons encode an ordering that `NaN` is silently
outside of. Guarding the parse first is the single cheap move that converts a
confident mis-classification into an explicit unknown-handling branch. Sibling:
[`explicit-missing-resource-state`](explicit-missing-resource-state.md) — a
missing value must not be read as a valid extreme.
