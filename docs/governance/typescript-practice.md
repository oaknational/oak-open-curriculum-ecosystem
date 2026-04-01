---
fitness_line_target: 150
fitness_line_limit: 200
fitness_char_limit: 12000
fitness_line_length: 100
split_strategy: 'Extract detailed gotcha collections to a companion gotchas file; keep principles and patterns here'
---

# TypeScript Practice

## General

- NEVER disable type checking
- **No type shortcuts** - Never use `as`, `any`, `!`, or `Record<string, unknown>`, or `{ [key: string]: unknown }`, or `Object.*` methods, or `Reflect.*` methods - they ALL disable the type system. The goal is to preserve type information as much as possible, not to work around this rule.
- Never use `any`
- Never use `as` NO TYPE ASSERTIONS, NO TYPE CASTING, JUST NO.
- Only use `unknown` at the boundaries of the application
- Use type guards/predicates to narrow types (functions with the `is` keyword)
- There must be a SINGLE source of truth for each type

## External Types

- Use types from external libraries as-is, do not create substitute types in our code.

## Our Type Locations

- Define types in type files, close to where they are used.
- If a type is used in multiple locations, consider if this is signalling that a refactor is needed.

## Our Type Definitions

- Define runtime constants with `as const`
- Use those constants to define types
- Use those constants to create type predicate functions

### Example

```typescript
const ALLOWED_COLORS = ['red', 'green', 'blue'] as const;
type AllowedColor = (typeof ALLOWED_COLORS)[number];

function isAllowedColor(color: string): color is AllowedColor {
  const stringAllowedColors: readonly string[] = ALLOWED_COLORS;
  return stringAllowedColors.includes(color);
}

// Alternative for pure membership testing (no type guard needed):
const ALLOWED_COLOR_SET = new Set<string>(ALLOWED_COLORS);
ALLOWED_COLOR_SET.has(someString); // widens at lookup, not at definition
```

## Our Type Validation at External Boundaries

- At external boundaries such as network API calls, database calls, file system calls, etc., validate incoming data using Zod.
- Once validated at the boundary, use the validated types throughout the internal system
- This creates a trusted zone where types are guaranteed to be correct

## Zod v4 Patterns

- `ZodIssue` is deprecated — use `core.$ZodIssue` via `import type { core } from 'zod'`
- `.merge()` is deprecated — use `A.extend(B.shape)` to compose Zod object schemas (caught by `@typescript-eslint/no-deprecated`)
- `.passthrough()` is deprecated — use `.loose()` for pass-through behaviour
- Shared Zod schemas are opt-in contracts: define fields as required in the schema, consumers use `.partial()` for optionality. This preserves contract semantics: "if you use this capability, you must satisfy these fields."

## Preserving Type Information

### Spread with Optional Properties

Spread with optional properties widens types: `{ ...defaults, ...overrides }` where `overrides.prop?: T` yields `prop: T | undefined` even when `defaults.prop: T`. Fix with explicit property resolution using `??` or a typed merge helper.

### Derive Types from Generated Contracts

Use indexed access on generated contracts rather than modifying generators:

```typescript
type ToolAnnotations = NonNullable<ContractDescriptor['annotations']>;
```

This avoids modifying generators while maintaining type unification. Use a bottom contract to extract invariant structural properties.

### Discriminated Unions

For discriminated unions of `readonly string[] | { excludes: readonly string[] }`, use `'excludes' in value` (property check) not `Array.isArray(value)`. `Array.isArray` narrows to `string[]` but leaves the else branch still containing both union members.

### The `process.env` Boundary Exception

`Record<string, string | undefined>` is acceptable at the `process.env` entry boundary — the key space is genuinely unbounded. Zod validation immediately narrows it. This is the correct exception to "Record is too generic."

## Interface Segregation for Testability

When test fakes cannot satisfy a complex generated type without `as`, extract a narrowed interface containing only the fields consumed by the code under test. This eliminates assertion pressure at source rather than working around it. See [ADR-078](../architecture/architectural-decisions/078-dependency-injection-for-testability.md).

## Compile-Time Validation Patterns

### `as const satisfies T`

`as const satisfies T` is the gold standard for test data that must be both a literal type and structurally valid. `as const` narrows values to their literal types; `satisfies` verifies the expression matches a type without changing what TypeScript infers.

### Type Predicate Stubs

With `noUnusedParameters`, `() => false` will not compile as a type predicate stub. Use the parameter in the body:

```typescript
(v: unknown): v is T => typeof v === 'string' && v === '__never__';
```

### Compile-Time Type Assertions

Compile-time type assertions (e.g. `AssertNoX<T>`) are inert unless the resulting type is consumed in a binding or type path. Always bind the assertion result.

## Common Type Gotchas

- `Object.getOwnPropertyDescriptor(obj, key)?.value` returns `any` — assign to `const v: unknown = ...`
- `const parsed: unknown = JSON.parse(json)` avoids `no-unsafe-assignment`
- `const noop = () => {};` triggers `no-empty-function` lint — use `const noop = () => undefined;`
- `{}` as a generic constraint (`T extends {}`) is an escape hatch, not a solution. Use specific per-type builder functions
- `expect.any(String)` returns `any` which triggers `no-unsafe-assignment` — use `toHaveProperty` for structural checks on `unknown` values
- `TSESLint.FlatConfig.Plugin` from `@typescript-eslint/utils` bridges the `Rule.RuleModule` vs `TSESLint.RuleModule` gap — eliminates `as unknown as ESLint.Plugin['rules']`
- `@typescript-eslint/no-restricted-imports` `group` patterns use minimatch: `*` matches one path segment (not `/`), `**` matches zero or more segments. Use `**` for deep sub-path coverage
- `localeCompare` uses locale-sensitive collation that may diverge from `Array.sort()` unicode order. For binary search against `sort()`-ordered data, use `===`/`<`/`>`
- `vi.fn()` (bare, no generics) returns
  `Mock<(...args: any) => any>` which is assignable to any
  function signature — cleanest pattern for recording call
  sites in characterisation/integration tests without casts
- A function returning `RegisteredResource` (or any type)
  is assignable to a function returning `void`. Define DI
  interfaces with `void` return when callers don't consume
  the result — both the real impl and `vi.fn()` satisfy it
