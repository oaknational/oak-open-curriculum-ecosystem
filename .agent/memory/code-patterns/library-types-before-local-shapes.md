---
name: "Library Types Before Local Shapes"
use_this_when: "An integration parses third-party SDK responses or errors and custom local `*Like` shapes are being considered."
category: type-safety
proven_in: "apps/oak-search-cli/src/lib/elasticsearch/index-meta.ts"
proven_date: 2026-03-13
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Replacing official SDK types with broad local shapes that widen type information and hide real invariants."
  stable: true
---

# Library Types Before Local Shapes

## Problem

When code integrates with external SDKs, it is tempting to define local
`*Like` interfaces and broad predicates for response and error handling. These
local shapes frequently widen types and lose guarantees exposed by the SDK.

## Pattern

Prefer official exported SDK types/classes first. Only define local types when
the SDK does not expose an appropriate type.

- Use SDK error classes for classification (`instanceof ...`) rather than local
  object-shape predicates.
- Use SDK response types for function signatures and mocks.
- Validate unknown boundaries explicitly; do not replace known SDK contracts
  with permissive local abstractions.

## Why It Works

This preserves type information end-to-end, reduces duplicate schema drift,
and keeps runtime checks aligned with the library's real contract.

## Anti-Pattern

- Local `isXxxLike(value): value is { statusCode?: number }` helpers that accept
  broad object shapes.
- `as unknown as` casts to satisfy test fakes for SDK clients.

## Example Context

In the semantic-search recovery guardrail work, Elasticsearch integration moved
from broad local error-like guards to direct `@elastic/elasticsearch`
`errors.ResponseError` and typed SDK responses. This removed widening, improved
diagnostics, and made tests align with real client contracts.

Further reading:

- [.agent/plans/semantic-search/active/semantic-search-recovery-and-guardrails.execution.plan.md](../../plans/semantic-search/active/semantic-search-recovery-and-guardrails.execution.plan.md)
