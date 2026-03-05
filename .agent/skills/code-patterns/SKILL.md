---
name: code-patterns
classification: passive
description: >-
  Check .agent/memory/code-patterns/ for known solutions to recurring
  design problems before inventing a new approach. Triggered when facing
  type-safety issues, validation questions, or assertion pressure.
---

# Code Patterns

When you identify a design problem -- especially type-safety issues, validation questions, or assertion pressure -- check `.agent/memory/code-patterns/` for known solutions before inventing a new approach.

## When to Use

- You are about to write an `as` cast or type assertion
- You are designing a validation boundary
- You see a runtime conversion that mirrors a compile-time type
- You encounter a function returning a claimed type for unvalidated data
- A reviewer flags assertion pressure or type widening

## Steps

1. Read `.agent/memory/code-patterns/README.md` to discover available patterns.
2. Match the current problem against each pattern's `use_this_when` field.
3. If a pattern matches, read its full file and apply the approach.
4. If no pattern matches, proceed normally -- do not force a fit.

## Important

This skill is not always-active. It triggers when an engineer or agent encounters a design problem where type safety, validation, or assertion pressure is involved. It is a discovery mechanism, not a mandate.
