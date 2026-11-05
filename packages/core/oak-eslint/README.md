# @oaknational/eslint-plugin-standards

Custom ESLint plugin for architectural boundary enforcement and code standards
across the Oak Open Curriculum Ecosystem monorepo.

## Purpose

This plugin provides:

1. **Custom ESLint rules** that enforce Oak-specific code quality constraints
2. **Boundary rules** that prevent architectural violations between workspaces
3. **Shared configs** that standardise linting across all workspaces

## Rules

### Custom Rules

Every rule `src/plugin.ts` registers, what it reports, and where it is switched on.

| Rule                             | Reports                                                                                                                                                | Switched on                                                                                                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no-agent-substrate-access`      | Application code reading the `.agent/` substrate at runtime (fs reads or `new URL` into `.agent/`); `agent-tools/` is exempt inside the rule.          | `recommended`, error                                                                                                                                                                                             |
| `no-conditional-tests`           | Vitest `skipIf` / `runIf`, so every suite registers the same tests on every machine.                                                                   | `recommended`, error                                                                                                                                                                                             |
| `no-dynamic-import`              | Dynamic `import(...)`, so module boundaries stay static, reviewable and lintable.                                                                      | `recommended`, error                                                                                                                                                                                             |
| `no-eslint-disable`              | `eslint-disable` comments without the project-owner approval marker; `@ts-ignore` and `@ts-nocheck` unconditionally.                                   | `recommended`, error                                                                                                                                                                                             |
| `no-export-trivial-type-aliases` | An exported type alias that only renames an imported type; re-export the original instead.                                                             | registered; no preset or workspace switches it on                                                                                                                                                                |
| `no-posthog-vendor-imports`      | PostHog vendor SDK imports outside `packages/libs/posthog-node`.                                                                                       | `strict` (through `vendorBoundaryRules`), error                                                                                                                                                                  |
| `no-real-io-in-tests`            | Real fs, child_process, worker_threads, network, process or non-localhost fetch in `*.test.ts` and `*.spec.ts` files outside the structural allowlist. | `recommended`, warn over a frozen allowlist: transition debt under PDR-126, owned by the `no-io-test-boundary-and-di-recovery` plan; two file-scoped `off`s, in the design system's and the search CLI's configs |
| `no-throw-statement`             | A `throw` statement; errors flow through the Result pattern (ADR-088).                                                                                 | `recommended`, error; `off` in each workspace holding throw debt, by the owner's ruling of 2026-09-08, until the merge-back migration                                                                            |
| `no-vercel-functions-imports`    | `@vercel/functions` imports outside the product-analytics compose module.                                                                              | `strict` (through `vendorBoundaryRules`), error                                                                                                                                                                  |
| `require-observability-emission` | A newly exported async function without a structured-observability emission (ADR-162).                                                                 | each `apps/*` and `packages/sdks/*` workspace, in its own flat config, error                                                                                                                                     |

### Boundary Rules

Boundary rules use `eslint-plugin-import-x` and `@typescript-eslint` to enforce
layer separation:

| Rule Set                    | Scope              | Enforces                                                                                                  |
| --------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| `coreBoundaryRules`         | `packages/core/`   | No imports from libs, SDKs, or apps via relative paths or `@oaknational/*` package specifiers             |
| `createDesignBoundaryRules` | `packages/design/` | Design-token dependency direction: core may stay independent; Oak token set may depend on token core only |
| `createLibBoundaryRules`    | `packages/libs/`   | Tier-aware lib boundaries plus no imports from SDKs/apps; no `process`/`__dirname`/`__filename`           |
| `createSdkBoundaryRules`    | `packages/sdks/`   | One-way dependency rules for generation/runtime/search SDK workspaces                                     |
| `appBoundaryRules`          | `apps/`            | Baseline cross-app boundary helper for relative-package and package-specifier imports                     |
| `appArchitectureRules`      | `apps/` internals  | Cross-app boundaries plus tools/integrations separation and private-module bans                           |

#### `createSdkBoundaryRules(role)`

Factory function that returns boundary rules for SDK workspaces. The `role`
parameter (`'generation'`, `'runtime'`, or `'search'`) determines the constraint set:

- **`'generation'`**: blocks imports from the runtime SDK
  (`@oaknational/curriculum-sdk`). The generation workspace must not depend
  on its consumer.
- **`'runtime'`**: blocks deep imports into the generation workspace
  (`@oaknational/sdk-codegen/*/**`) — only single-level
  subpath exports are permitted. Also blocks `@workspace/*` aliases to
  prevent pnpm workspace aliases from bypassing the boundary rules.
- **`'search'`**: forbids direct imports from
  `@oaknational/curriculum-sdk` and requires generated search-facing
  surfaces from `@oaknational/sdk-codegen` instead, in line with ADR-108.

All roles block `@workspace/*` imports to ensure all cross-workspace
dependencies go through published package names.

#### Removing a lib from `LIB_PACKAGES`

When removing an entry from `LIB_PACKAGES`, check ALL packages
that call `createLibBoundaryRules` with that name.
`createLibBoundaryRules` generates zone patterns using
`../${otherLib}/**` relative paths — removing a lib without
updating all consumers silently breaks their boundary rules.

## Configs

| Config        | Description                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| `recommended` | Base: ESLint recommended, TypeScript strict + stylistic, import-x, Prettier, TSDoc, Oak-specific rules |
| `strict`      | Extends `recommended`: restricts `Object.keys`/`values`/`entries`, `Reflect.*`, stronger type rules    |
| `react`       | React + React Hooks rules                                                                              |
| `next`        | Extends `react` with Next.js recommended and core-web-vitals                                           |

### Restricted Type Patterns

The `strict` config restricts 10 type-destroying patterns via
`@typescript-eslint/no-restricted-types`:

`Record<string, unknown>`, `Record<string, any>`,
`Record<string, undefined>`, `Readonly<Record<string, undefined>>`,
`Record<PropertyKey, undefined>`, `object`, `Object`, `Function`,
`unknown[]`, `{}`

The `satisfies Record<...>` pattern is acceptable because `satisfies`
validates without widening — the inferred type stays narrow.

**Flat config caveat**: ESLint flat config uses last-writer-wins for rule
declarations. When `strict.ts` overrides a rule from `recommended.ts`, all
entries from the recommended declaration are silently lost. The `strict`
config must replicate all restricted type entries from `recommended`.

### Activating new rules

"Autofixable" idiom rules are not automatically safe: Sonar idiom rules
(S7765 prefer-includes, S7755 prefer-at — implemented in this repo via the
matching `unicorn/*` rules, see `recommended.ts`) are **type-affecting, not
stylistic** — their autofixes can force type-unsound rewrites (one broke an
ADR-153 `value is X` type-guard). When activating a new rule:

- Land it at `error` with full conformance in ONE landing (PDR-126,
  graduating the 2026-07-07 owner ruling — this supersedes the earlier
  warn-first preference): the same landing clears every violation with
  **type-sound** fixes (review each autofix's type effect, never bulk-apply)
  or category-moves the genuine non-fits.
- If the violation surface cannot be cleared soundly in one landing, the
  conformance work is sequenced FIRST and the rule lands at `error` as that
  sequence's final slice — never at `warn` over a violation inventory.
  Downgrading an existing `error` rule to `warn` remains forbidden
  (`never-disable-checks`).

### Flat-config gotchas (verified in-repo)

- **`typescript-eslint`'s `projectService` is a per-run singleton — use ONE
  options object for the whole config.** Two flat-config blocks with different
  `projectService` values (`true` for ts/tsx; `{allowDefaultProject: ['*.mjs']}`
  for mjs) fail non-obviously: the service is created from the FIRST options
  seen, so a full `eslint .` run drops the mjs allowance ("not found by the
  project service") while linting the mjs file alone passes. Cure: one files
  block `['**/*.ts', '**/*.tsx', '**/*.mjs']` with a single `projectService`
  object (verified 2026-07-02, demos/oak-curriculum-hub).
- **`includeIgnoreFile` ships in ESLint core (`eslint/config`)** — do not add
  `@eslint/compat` for it; `@typescript-eslint/no-deprecated` flags the compat
  export as deprecated and names the core replacement (verified against
  eslint ≥10.5; re-verified on the installed 10.6.0).

## Usage

This plugin is consumed internally by workspaces in this monorepo via
`eslint.config.js` files. It is not published to npm.

```javascript
import oakStandards from '@oaknational/eslint-plugin-standards';

export default [
  ...oakStandards.configs.recommended,
  // workspace-specific overrides
];
```

## Development

```bash
pnpm test        # Run rule tests
pnpm build       # Build the plugin
pnpm type-check  # Type-check
```
