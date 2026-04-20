---
name: "Template Literal Derived Union with Builder"
use_this_when: "A string union type is the cross-product of two smaller unions joined by a separator, and code constructs members at runtime via template literals"
category: code
proven_in: "apps/oak-search-cli/src/lib/indexing/curriculum-pattern-config.ts"
proven_date: 2026-03-01
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Hand-written large unions that drift from their constituent parts, and `as` casts to construct members at runtime"
  stable: true
---

# Template Literal Derived Union with Builder

## Problem

A large string literal union (e.g. 68 members) is the cross-product of two
smaller unions joined by a separator. The union is hand-written and must be
kept in sync manually. Runtime code constructs keys via template literals
(`` `${a}:${b}` ``) but TypeScript widens the expression to `string`,
requiring `as` casts to index typed objects.

## Anti-Pattern

```typescript
type Key = 'foo:x' | 'foo:y' | 'bar:x' | 'bar:y'; // hand-written

const key = `${a}:${b}` as Key; // cast — no compile-time proof
const value = CONFIG[key];
```

Adding a new constituent value requires updating the union manually.
Forgetting an entry is a silent bug. The `as` cast bypasses the type
system entirely.

## Pattern

Define the constituent parts as `as const` arrays. Derive the union
using a template literal type. Create a builder function whose parameter
types constrain the operands so the template expression produces the
correct type without a cast.

```typescript
const PARTS_A = ['foo', 'bar'] as const;
const PARTS_B = ['x', 'y'] as const;

type PartA = (typeof PARTS_A)[number];
type PartB = (typeof PARTS_B)[number];
type Key = `${PartA}:${PartB}`;

function makeKey(a: PartA, b: PartB): Key {
  return `${a}:${b}`;
}
```

For runtime validation of untyped strings, add a type guard using `in`:

```typescript
function isKey(s: string): s is Key {
  return s in CONFIG;
}
```

## Why It Works

TypeScript distributes template literal types over finite union operands.
The builder function's parameter types constrain the template expression
so the compiler proves the return type matches the union — no assertion
needed. Adding a constituent value to either array automatically expands
the union and triggers compile errors for missing entries in any typed
`Record` keyed by the union.

## Caveat

TypeScript widens template literal expressions to `string` in `for...of`
loop bodies even when the loop variable is a narrow literal union. The
builder function solves this: call it inside the loop instead of using
a raw template expression.
