# ADR-153: Constant-Type-Predicate Pattern

**Status**: Accepted
**Date**: 2026-04-03
**Related**: [ADR-031](031-generation-time-extraction.md),
[ADR-034](034-system-boundaries-and-type-assertions.md),
[ADR-038](038-compilation-time-revolution.md)

## Context

The generated code in this repository uses a recurring four-step pattern
for bridging compile-time type safety with runtime validation. The pattern
appears 37+ times across the generated type infrastructure and is the
primary mechanism by which the Cardinal Rule ("types flow from schema")
is satisfied at runtime boundaries.

The pattern was not previously named or formally documented as an
architectural decision, despite being the foundational building block of
the type system. ADR-031 established generation-time extraction, ADR-034
defined system boundaries, and ADR-038 embedded validation at compile
time — but none named the repeating unit that implements all three.

## Decision

The **Constant-Type-Predicate Pattern** is the standard mechanism for
creating type-safe runtime validation from schema-derived data. It has
four steps:

1. **Runtime constant** with `as const` — the single source of truth.
   The constant holds the literal values extracted from the OpenAPI
   schema at generation time.

2. **Strict type** derived with `typeof ... [number]` — exact matching
   where values on the left match ONE value on the right, not a union
   of all possible strings.

3. **Type predicate function** — `value is NarrowedType` backed by an
   honest runtime check. The predicate proves the type it asserts; it
   does not lie.

4. **Optional `satisfies`** — when the constant needs to prove it
   implements an interface without losing literal types.

### The Intermediate Narrowing Trick

TypeScript cannot call `.includes()` directly on a narrowed literal
tuple. The standard workaround is an intermediate assignment:

```typescript
const SCOPES = ['lessons', 'units', 'sequences'] as const;
type Scope = (typeof SCOPES)[number];

function isScope(value: unknown): value is Scope {
  const strings: readonly string[] = SCOPES; // widen just enough
  return typeof value === 'string' && strings.includes(value);
}
```

The intermediate `readonly string[]` widens the array type enough for
`.includes()` to accept the `string` parameter while preserving the
type predicate's narrow return type.

### Decision Tree: When to Use What

| Situation                                             | Mechanism                                            |
| ----------------------------------------------------- | ---------------------------------------------------- |
| Validating a value is one of a known set of literals  | **Type predicate** with `as const` constant          |
| Validating a complex object shape from external input | **Zod schema** with `.safeParse()`                   |
| Distinguishing between variants of a known union      | **Discriminated union** check on the tag field       |
| Compile-time-only constraint, no runtime value        | **Type-only** (no predicate needed)                  |
| Generated tool parameter validation                   | **Zod schema** embedded at generation time (ADR-038) |

### Common Violations

- **Lying predicate**: checking `typeof === 'object'` but claiming
  `value is SpecificType`. The runtime check must prove the asserted
  type, not a weaker property.
- **Skipping the constant**: defining a type without the backing
  `as const` constant. This loses the runtime membership test.
- **Using `as` instead of a predicate**: type assertions bypass the
  type system; predicates work with it. Never use `as` where a
  predicate exists.
- **Widening the return**: returning `string` where the predicate
  should return the literal union type. Every `: string` parameter
  destroys type information irreversibly.

## Consequences

- **Positive**: The pattern provides a consistent, reviewable mechanism
  for runtime validation that the type system can verify. All 37+
  instances follow the same shape, making the generated code
  predictable and auditable.
- **Positive**: The pattern composes naturally with the `unknown`
  boundary rule — external data enters as `unknown`, passes through a
  type predicate, and emerges with full type information.
- **Negative**: The intermediate narrowing trick is non-obvious to
  developers unfamiliar with the pattern. This ADR and the
  typescript-practice.md documentation mitigate this.

## Non-Goals

- This ADR does not change the code generation pipeline — it names
  and documents the pattern the pipeline already produces.
- This ADR does not prescribe when to use Zod vs type predicates —
  the decision tree above is guidance, not a mandate. Both are valid
  depending on the complexity of the shape being validated.
