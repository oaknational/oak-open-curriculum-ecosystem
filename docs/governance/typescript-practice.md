---
fitness_line_target: 150
fitness_line_limit: 200
fitness_char_limit: 12000
fitness_line_length: 100
split_strategy: 'Extract detailed gotcha collections to a companion gotchas file; keep principles and patterns here'
---

# TypeScript Practice

## Compiler-time Types and Runtime Validation

Operationalises
[principles.md § Compiler Time Types and Runtime Validation][principle-types].

[principle-types]: ../../.agent/directives/principles.md#compiler-time-types-and-runtime-validation

- **No type widening or destruction** — never use widening casts
  (`as SomeType`), `any`, `!`, `Record<string, unknown>`,
  `{ [key: string]: unknown }`, `Object.*` methods, `Reflect.*`
  methods, `isObject` type predicates, `z.unknown()` where a
  concrete schema exists, `z.record(z.string(), z.unknown())`,
  or hand-crafted Zod schemas that duplicate generated shapes.
  `as const` and `satisfies SomeType` are permitted because they
  tighten compile-time information instead of disabling it. See
  `.agent/rules/no-type-shortcuts.md`.
- **`unknown` is type destruction** — `unknown`, `z.unknown()`, and
  `Record<string, unknown>` erase structural type information.
  They are permitted only at named external boundaries and are
  forbidden as stand-ins for known shapes. See
  `.agent/rules/unknown-is-type-destruction.md`.
- **Preserve type information** — do not widen literal types into
  broad annotations such as `string` or `number` when the exact
  literal matters. Let information flow from data structures with
  `as const` through to use sites.
- **Single source of truth for types** — define each type once,
  preferably from the OpenAPI schema, generated SDK contract, or
  external library, then import it everywhere. Do not redefine later
  as an approximation.
- **Use library types directly where possible** — do not invent a
  local type when a package exports the type you need.
- **Prefer library-native error and response types** — when parsing
  third-party SDK outputs, use official exported types and error
  classes first; introduce local shapes only when the library does
  not expose what is needed.
- **Validate external signals** — parse and validate API responses,
  file reads, SSE messages, WebSocket payloads, and other external
  signals to the exact expected shape at the boundary. Official SDKs
  count as validation; use Zod where appropriate. Once validated, use
  the validated type throughout the trusted zone. See
  `.agent/rules/strict-validation-at-boundary.md`.
- **Type imports must be labelled with `type`** — use
  `import type { Type } from 'package'` or
  `import { type Type } from 'package'`.
- **Avoid type-alias entropy** — do not introduce aliases that merely
  rename an existing generated, library, or well-named local type.
  Good naming and direct imports keep the concept graph smaller.

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
