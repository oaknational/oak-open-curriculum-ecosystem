---
name: Const Map as Type Guard
use_this_when: a runtime conversion mirrors a compile-time type transformation and all possible values are known at generation or build time
category: type-safety
proven_in: packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts
proven_date: 2026-02-27
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: Runtime conversion functions that use `as` casts to satisfy conditional types
  stable: true
---

# Const Map as Type Guard

## Problem

A function converts a value at runtime to match what a conditional type computes at compile time. Because TypeScript cannot verify that the runtime conversion produces the same result as the type-level computation, the function needs an `as` cast to satisfy the compiler.

```typescript
type StatusDiscriminant<T extends string> = T extends `${infer N extends number}` ? N : T;

function toStatusDiscriminant<T extends string>(status: T): StatusDiscriminant<T> {
  const numeric = Number(status);
  return (Number.isNaN(numeric) ? status : numeric) as StatusDiscriminant<T>;
}
```

The `as` cast hides a class of bugs: if the runtime conversion diverges from the type-level computation, the type system cannot catch it.

## Solution

Encode the mapping as a `const` data structure. Derive types from the data structure. Look up from the map instead of converting at runtime.

```typescript
const STATUS_DISCRIMINANTS = { '200': 200, '404': 404 } as const;
type DocumentedStatusDiscriminant = typeof STATUS_DISCRIMINANTS[DocumentedStatus];

const discriminant = STATUS_DISCRIMINANTS[statusKey];
```

The `as const` annotation narrows the object literal to its exact values. TypeScript infers the value types directly from the data structure -- no conditional type and no `as` assertion needed.

## When this applies

- All possible input values are known at build or generation time
- A conditional type or mapped type computes the output type
- A runtime function mirrors that type-level computation
- The function uses `as` to bridge the gap between runtime and compile-time

## When this does not apply

- The set of possible values is open-ended or determined at runtime
- The mapping is genuinely dynamic (e.g. user input)
- The data structure would be impractically large

## Anti-pattern it replaces

Generic conversion functions with `as` casts: `toX(value) as X<T>`.
