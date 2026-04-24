---
fitness_line_target: 80
fitness_line_limit: 120
fitness_char_limit: 6000
fitness_line_length: 100
split_strategy: 'Companion to typescript-practice.md; detailed gotcha entries live here'
---

# Common Type Gotchas

Extracted from
[TypeScript Practice](./typescript-practice.md) — detailed
observations on TypeScript and tooling quirks that affect
type safety.

## Runtime Value Typing

- `Object.getOwnPropertyDescriptor(obj, key)?.value`
  returns `any` — assign to `const v: unknown = ...`
- `const parsed: unknown = JSON.parse(json)` avoids
  `no-unsafe-assignment`

## Lint Interactions

- `const noop = () => {};` triggers `no-empty-function`
  lint — use `const noop = () => undefined;`
- `expect.any(String)` returns `any` which triggers
  `no-unsafe-assignment` — use `toHaveProperty` for
  structural checks on `unknown` values

## Union Key Extraction

- `keyof (Union[keyof Union])` gives the **intersection**
  of keys (only keys on ALL members), not the union.
  Use a distributive mapped type for the union of all keys:
  `type KeysOf<T> = T extends unknown ? keyof T : never`

## Generic Constraints

- `{}` as a generic constraint (`T extends {}`) is an
  escape hatch, not a solution. Use specific per-type
  builder functions

## ESLint Plugin Typing

- `TSESLint.FlatConfig.Plugin` from
  `@typescript-eslint/utils` bridges the
  `Rule.RuleModule` vs `TSESLint.RuleModule` gap —
  eliminates `as unknown as ESLint.Plugin['rules']`

## ESLint Pattern Matching

- `@typescript-eslint/no-restricted-imports` `group`
  patterns use minimatch: `*` matches one path segment
  (not `/`), `**` matches zero or more segments. Use
  `**` for deep sub-path coverage

## Collation and Ordering

- `localeCompare` uses locale-sensitive collation that
  may diverge from `Array.sort()` unicode order. For
  binary search against `sort()`-ordered data, use
  `===`/`<`/`>`

## ESLint Import Merging

- `lint:fix` can merge value+type imports from the same
  source module into a single `import type` statement,
  making value symbols unavailable at runtime. Use inline
  `type` keyword on individual specifiers:
  `import { applyTheme, type McpUiHostContext } from '...'`

## ESLint Suppressions

- **Self-justifying `eslint-disable` comments embed false
  assumptions.** "Unavoidable: bridging incompatible types"
  rationalises the violation. Ask: WHY are the types
  incompatible? The rationalisation often masks a fixable
  type-flow break upstream.

## Type Assertions in Tests

- **`@ts-expect-error` in a test means the test is testing
  what types already enforce.** If a test needs
  `@ts-expect-error` to compile, the type system is already
  asserting the constraint; the test is redundant. Delete
  the test, don't suppress the types. (PDR-020 covers the
  RED-phase counterpart: never suppress to hide a RED-phase
  type-check failure.)

## Test Double Typing

- `vi.fn()` (bare, no generics) is assignable to any
  function signature — use for recording call sites
  without casts. Define DI interfaces with `void`
  return when callers don't consume the result.
