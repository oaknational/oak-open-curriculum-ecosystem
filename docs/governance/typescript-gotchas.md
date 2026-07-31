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

## Union Subtype Collapse

- A union `A | B` where one member is a structural subtype
  of the other **collapses** to the supertype and carries no
  extra static information. `EefEvidenceEnvelope | EefEvidenceEnvelope<EefStrandHeadline>`
  collapses because the headline `Pick` is assignable from the
  full strand. Flag it in type review — and note a nested-union
  "fix" collapses identically, so it is not the cure.

## Generic Constraints

- `{}` as a generic constraint (`T extends {}`) is an
  escape hatch, not a solution. Use specific per-type
  builder functions

## ESLint Plugin Typing

- `TSESLint.FlatConfig.Plugin` from
  `@typescript-eslint/utils` bridges the
  `Rule.RuleModule` vs `TSESLint.RuleModule` gap —
  eliminates `as unknown as ESLint.Plugin['rules']`
- Run candidate ESLint rules against the package that owns
  the shared config when practical. `@typescript-eslint/no-deprecated`
  caught deprecated `typescript-eslint.config()` usage in the
  standards plugin before it spread. If ESLint core `defineConfig()`
  rejects a local plugin typed through `@typescript-eslint/utils`,
  split the config at the type boundary rather than weakening the
  plugin type.

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
- **`expectTypeOf<Field>().toEqualTypeOf<Declared>()` mirrors
  the declaration** — it is configuration, not behaviour, and
  `tsc` is the correct tool for type correctness. Vitest proves
  runtime behaviour; never mirror a type declaration in a test
  framework. Delete type-only assertion blocks and rely on
  `type-check`.

## tsconfig Include Globs Cross Project Boundaries

A `**/` glob in a tsconfig `include` reaches into sibling projects:
`**/*.test.tsx` in an app's `tsconfig.lint.json` pulls a co-located
`widget/` project's tests into the app project, which may lack the
required `lib` (no DOM lib → type errors that look environmental).
Scope test globs to `src/`. A pre-existing `**/*.test.ts` can mask this
for years if the sibling's tests all use a different extension
(2026-07-25: the widget's tests were all `.tsx`).

## Package Export Contracts

- **Exports resolve built `dist/` via standard conditions only**
  (`types`, `import`, `default`) — so a subpath whose `default`
  points at a file tsup never emits fails at first import instead
  of hiding behind a source-resolving condition. tsup entry globs
  are per-subtree; when adding a subpath, confirm its `default`
  target is actually emitted.

## Test Double Typing

- `vi.fn()` (bare, no generics) is assignable to any
  function signature — use for recording call sites
  without casts. Define DI interfaces with `void`
  return when callers don't consume the result.

## Regex Findings That Refuse to Die (2026-07-30 consolidation)

A quantifier-before-required-literal scan (`\d*\.?\d+px`, `[\d.]+px`) is
O(n²) by construction on non-matching runs — each start position pays a
linear backtrack hunting the suffix. When Sonar's backtracking findings
fire twice on one site's successive regex refinements, the instrument is
right both times: stop refining the regex. If the input grammar is
token-shaped (computed CSS serialisations, whitespace-tokenised output),
parse by `split` + `endsWith` + `Number` — linear, simpler, and the
finding class ends rather than relocates.

## Fixture and Emit Gotchas (2026-07-30 consolidation)

- **Parse-input fixtures are `z.input<schema>`, never the output type** —
  NULL-sentinel transforms make them differ; an output-typed factory is a
  genuine mis-model the compiler catches.
- **Before typing an "undeclared" field as `z.unknown`, falsify "no
  contract exists" against the WHOLE pipeline** — a field the bulk sidecar
  omitted was fully declared in the API's response schema.
- **Script-kind TS files** (no imports/exports) emit classic browser
  scripts and their top-level `interface` declarations merge globally —
  the mechanism that lets a pre-paint runtime be TypeScript without a
  bundler. Adding any export flips the emit to ESM, so testability comes
  from smoke-testing the EMITTED artefact, not from DI-factory exports.
  Read a merged global's type back with `NonNullable<Window['x']>` — uses
  the interface (curing the no-unused-vars false positive) and survives
  `exactOptionalPropertyTypes`.
- **TSDoc code spans must not wrap lines** — a backticked command split
  across docblock lines parses as an unclosed span and fires tsdoc tag
  errors on the wrapped tokens.
- **tsc error locations point at the EXPRESSION, not the literal needing
  fields** — a scripted insertion keyed on an error location can land in
  a helper call's surrounding literal; unique-anchor asserts + type-check
  are the guard.
- **A bare `@` character in TSDoc prose breaks the docblock** — an SHA
  reference like `main @ 63a7e675` parses as an unknown block tag and fires
  tsdoc errors; escape it (`\@`) or rephrase (`main at 63a7e675`).
- **Exporting a zod input shape as `: z.ZodRawShape` kills `.meta()` reads**
  (bitten twice in one day, 2026-07-30): the annotation widens every field
  to the core `$ZodType`, discarding the per-field schema types the readers
  need. Export as `X.shape`, or constrain with `satisfies z.ZodRawShape` —
  never the widening annotation.
