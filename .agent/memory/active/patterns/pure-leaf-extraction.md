---
name: "Pure Leaf Module Extraction"
use_this_when: "Pure functions and I/O functions coexist in a module, and other modules need only the pure functions"
category: code
proven_in: "packages/sdks/oak-search-sdk/src/admin/lifecycle-version-identity.ts"
proven_date: 2026-03-24
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Inverted dependency direction where detection/identification modules depend on mutation/I/O modules for pure logic"
  stable: true
---

# Pure Leaf Module Extraction

## Principle

When a module contains both pure functions and I/O functions, and other modules need the pure functions, extract the pure functions into a dedicated leaf module with no I/O imports. Both the original module and the dependent modules import from the leaf.

## Anti-pattern

```text
lifecycle-cleanup.ts          (has pure + I/O)
  ↑
lifecycle-orphan-detection.ts (needs pure functions)
```

The detection module depends "upward" into the I/O module. The dependency arrow is backwards — identification should not pull in deletion.

## Pattern

```text
lifecycle-version-identity.ts  (pure leaf — no I/O imports)
  ↑                ↑
lifecycle-cleanup.ts    lifecycle-orphan-detection.ts
(I/O, imports leaf)     (I/O, imports leaf)
```

The leaf module has no lifecycle imports. Both consumers depend downward on pure logic. The dependency graph is a clean DAG with pure functions at the leaves.

## When to apply

- A module mixes pure logic (extractors, identifiers, validators) with I/O (ES calls, file ops)
- Another module needs the pure logic but not the I/O
- The import creates a dependency from a "lighter" module to a "heavier" one
