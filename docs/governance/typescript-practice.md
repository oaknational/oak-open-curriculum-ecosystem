---
fitness_line_target: 150
fitness_line_limit: 200
fitness_char_limit: 12000
fitness_line_length: 100
split_strategy: 'Extract detailed gotcha collections to a companion gotchas file; keep principles and patterns here'
---

# TypeScript Practice

## General

- NEVER disable type checking.
- **No type shortcuts** — see `.agent/rules/no-type-shortcuts.md` for the
  full forbidden-constructs list. The goal is to preserve type information,
  not to work around constraints.
- **`unknown` is type destruction** — see
  `.agent/rules/unknown-is-type-destruction.md`. Permitted only at
  incoming external boundaries from third-party systems.
- Use type guards/predicates to narrow types (functions with the `is`
  keyword).
- There must be a SINGLE source of truth for each type. Define once,
  import everywhere.

## Type Locations

- Use types from external libraries as-is; do not create substitute types.
- Define our types in type files, close to where they are used.
- If a type is used in multiple locations, consider if a refactor is needed.

## Our Type Definitions: The Constant-Type-Predicate Pattern

The foundational type pattern in this codebase, used 30+ times in the
generated type infrastructure. See
[ADR-153](../architecture/architectural-decisions/153-constant-type-predicate-pattern.md)
for the full specification, decision tree, and common
violations.

1. Define runtime constants with `as const`
2. Derive strict types with `typeof ... [number]`
3. Create type predicate functions backed by honest runtime checks
4. Optionally use `satisfies` to prove interface compliance without
   losing literal types

### Example

```typescript
const ALLOWED_COLORS = ['red', 'green', 'blue'] as const;
type AllowedColor = (typeof ALLOWED_COLORS)[number];

function isAllowedColor(color: string): color is AllowedColor {
  const stringAllowedColors: readonly string[] = ALLOWED_COLORS;
  return stringAllowedColors.includes(color);
}
// Alternative: Set<string>(ALLOWED_COLORS).has(s) — widens at lookup, not definition
```

## Our Type Validation at External Boundaries

- At external boundaries such as network API calls, database calls,
  file system calls, etc., validate incoming data using Zod.
- Once validated at the boundary, use the validated types throughout
  the internal system.
- This creates a trusted zone where types are guaranteed to be correct.

### Zod Schema Integrity

`z.unknown()` is type destruction — the Zod equivalent of TypeScript's
`unknown`. It claims "we don't know the shape" when often we do.

**Forbidden patterns:**

- `z.unknown()` where a concrete Zod schema exists or can be generated
- `z.record(z.string(), z.unknown())` as a stand-in for a known object
- Hand-crafted Zod schemas that approximate shapes from `sdk-codegen`

**Required pattern:** Use generated schemas and values as the source of
truth. When validating wire data against a known shape, import from
`@oaknational/sdk-codegen` rather than re-modelling the shape.

```typescript
// WRONG: z.object({ type: z.string(), examples: z.array(z.unknown()) })
// RIGHT: import from the generated source of truth
import { getToolFromToolName } from '@oaknational/sdk-codegen/mcp-tools';
const generated = getToolFromToolName('get-key-stages-subject-lessons');
expect(wireValue).toHaveProperty('properties.keyStage', generated.inputSchema.properties.keyStage);
```

`z.unknown()` is permitted only at genuine external boundaries from
third-party systems (e.g. Elasticsearch aggregation buckets). See
`.agent/rules/unknown-is-type-destruction.md`.

## Zod v4 Patterns

- `ZodIssue` is deprecated — derive the type via
  `ZodError['issues'][number]` (a stable structural alternative that
  avoids coupling to the `$`-prefixed core naming convention).
- `.passthrough()` is deprecated — use `.loose()` on existing schemas
  or `z.looseObject()` for new definitions.
- Shared Zod schemas are opt-in contracts: define fields as required
  in the schema, consumers use `.partial()` for optionality. This
  preserves contract semantics: "if you use this capability, you must
  satisfy these fields."

## Preserving Type Information

### Spread with Optional Properties

Spread with optional properties widens types:
`{ ...defaults, ...overrides }` where
`overrides.prop?: T` yields `prop: T | undefined`
even when `defaults.prop: T`. Fix with explicit
property resolution using `??` or a typed merge
helper.

### Derive Types from Generated Contracts

Use indexed access on generated contracts rather than modifying generators:

```typescript
type ToolAnnotations = NonNullable<ContractDescriptor['annotations']>;
```

This avoids modifying generators while maintaining type
unification. Use a bottom contract to extract invariant
structural properties.

### Discriminated Unions

For discriminated unions of
`readonly string[] | { excludes: readonly string[] }`,
use `'excludes' in value` (property check) not
`Array.isArray(value)`. `Array.isArray` narrows to
`string[]` but leaves the else branch still containing
both union members.

### The `process.env` Boundary Exception

`Record<string, string | undefined>` is acceptable at
the `process.env` entry boundary — the key space is
genuinely unbounded. Zod validation immediately narrows
it. This is the correct exception to "Record is too
generic."

## Error Handling Types

Functions that can fail return `Result<T, E>` from `@oaknational/result`,
not thrown exceptions. Error types must be specific, not `Error` or
`unknown`. See `.agent/directives/principles.md` §Handle All Cases
Explicitly.

## Interface Segregation for Testability

When test fakes cannot satisfy a complex generated type
without `as`, extract a narrowed interface containing
only the fields consumed by the code under test. This
eliminates assertion pressure at source rather than
working around it. See
[ADR-078](../architecture/architectural-decisions/078-dependency-injection-for-testability.md).

## Compile-Time Validation Patterns

### `as const satisfies T`

`as const satisfies T` is the gold standard for data that must be both
a literal type and structurally valid. `as const` alone preserves
literals but skips structural checks; `satisfies` alone checks
structure but widens literals. Combined, you get both.

```typescript
const c = { name: 'search' } as const satisfies { name: string };
// type: { readonly name: 'search' } — literal preserved + structural check
```

### Type Predicate Stubs

With `noUnusedParameters`, `() => false` will not
compile as a type predicate stub. Use the parameter
in the body:

```typescript
(v: unknown): v is T => typeof v === 'string' && v === '__never__';
```

### Compile-Time Type Assertions

Compile-time type assertions (e.g. `AssertNoX<T>`)
are inert unless the resulting type is consumed in a
binding or type path. Always bind the assertion result.

## Common Type Gotchas

See [typescript-gotchas.md](./typescript-gotchas.md) for the
full collection of TypeScript and tooling quirks (runtime
value typing, lint interactions, ESLint patterns, collation,
test doubles).
