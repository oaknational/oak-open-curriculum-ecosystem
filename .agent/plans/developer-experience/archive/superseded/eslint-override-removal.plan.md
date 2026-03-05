---
name: "Phased Removal of ESLint Overrides"
overview: "Progressively remove all ESLint rule overrides from generation and runtime SDK workspaces, bringing all code to full strict compliance."
status: "superseded"
superseded_on: 2026-03-03
superseded_by: ".//.agent/plans/developer-experience/active/devx-strictness-convergence.plan.md"
todos:
  - id: phase-0-logger
    content: "Phase 0: Replace console.* with logger in code-generation/ and vocab-gen/ (tracked in codegen-logger-replacement.plan.md)."
    status: completed
  - id: phase-1-code-generation-authored
    content: "Phase 1: Remove structural overrides for code-generation/ authored code (6 rules)."
    status: pending
  - id: phase-1b-vocab-gen
    content: "Phase 1b: Remove structural overrides for vocab-gen/ (3 rules, 6 files)."
    status: pending
  - id: phase-2-generated-output
    content: "Phase 2: Remove overrides for src/types/generated/ machine output (13 rules)."
    status: pending
  - id: phase-3-config-files
    content: "Phase 3: Remove overrides for config files (3 rules)."
    status: pending
  - id: phase-4-other-workspaces
    content: "Phase 4: Remove overrides in streamable-http, search-cli, and other workspaces."
    status: pending
---

> Superseded on 2026-03-03. Use the canonical plan:
> `active/devx-strictness-convergence.plan.md`.

# Phased Removal of ESLint Overrides

**Last Updated**: 2026-03-03
**Status**: 📋 Planned
**Scope**: Remove all ESLint rule overrides across the generation and runtime
SDK workspaces, plus other workspaces with overrides, bringing all code to
full strict compliance.

---

## Context

The generation workspace (`@oaknational/sdk-codegen`) has two
categories of ESLint rule overrides that were carried over from the runtime
SDK during Phase 2 of the SDK workspace separation (ADR-108). The runtime
SDK itself is now clean (dead overrides were removed in Phase 2). Other
workspaces also have minor overrides.

The workspace rules are clear: "All quality gate issues are always blocking"
and "Never disable checks." These overrides are technical debt that should
be systematically eliminated.

### Session Update (2026-03-03)

The `no-console` rule was promoted from `'warn'` to `'error'` in the shared
ESLint config. Scoped `no-console: 'off'` overrides were added for genuinely
non-product-code (scripts, smoke tests, CLI entry points, e2e tests, logger
fallback). The `code-generation/` and `vocab-gen/` directories still have
`console.*` calls that need replacing with proper logger instances — tracked
separately in [codegen-logger-replacement.plan.md](./archive/completed/codegen-logger-replacement.plan.md).

Additionally, vocab-gen files now have their own structural overrides
(file-specific, not directory-wide), and the search-cli workspace has
grown additional override sections for ground-truth generation, evaluation,
and operations scripts.

### Why Phased?

The overrides exist for genuine reasons — generator scripts have complex
code-generation logic, and machine-generated files were not designed to pass
strict rules. Removing all overrides at once would require touching many
files simultaneously. A phased approach lets each category be addressed
independently, with quality gates verified at each step.

---

## Current Override Inventory

### Generation workspace (`packages/sdks/oak-sdk-codegen/eslint.config.ts`)

#### Category A: `code-generation/**` — Authored generator scripts (6 rules)

These are hand-written scripts that generate TypeScript code. The overrides
exist because several generator functions are large and complex. The comment
in the eslint config explicitly states: "All of these exceptions need removing
now that the codegen workspace is separate."

| Rule | Why it fails | Fix strategy |
|------|-------------|--------------|
| `no-restricted-properties` | Generators use `Object.keys()`, `Object.entries()` | Replace with `typeSafeKeys()`, `typeSafeEntries()` |
| `@typescript-eslint/no-restricted-types` | Generators use broad types for schema manipulation | Narrow types using proper generics |
| `max-lines-per-function` (limit: 50) | Several generators exceed 50 lines (e.g. `zodgen-core.ts` at 267) | Extract helper functions |
| `max-statements` (limit: 20) | Same large functions have many statements | Extract helper functions |
| `max-depth` (limit: 4) | Nested conditionals in schema traversal | Extract to separate functions |
| `complexity` (limit: 8) | High cyclomatic complexity in schema traversal | Decompose into smaller units |

**Fix approach**: Refactor generator functions into smaller, composable
units. This is straightforward authored-code refactoring — no generator
output changes.

**Prerequisite**: The `console.*` calls in these files must first be
replaced with logger instances — see
[codegen-logger-replacement.plan.md](./archive/completed/codegen-logger-replacement.plan.md).

#### Category A2: `vocab-gen/` — File-specific structural overrides (3 rules, 6 files)

Added 2026-03-03. The vocab-gen serialiser functions exceed structural limits.
These overrides are scoped to specific files (not directory-wide).

| Rule | Files affected | Fix strategy |
|------|---------------|--------------|
| `max-lines-per-function` | 6 files (see below) | Extract helper functions |
| `max-statements` | 6 files | Extract helper functions |
| `complexity` | 6 files | Decompose into smaller units |

**Files**: `vocab-gen/generators/analysis-report-generator.ts`,
`misconception-graph-generator.ts`, `nc-coverage-generator.ts`,
`synonym-miner.ts`, `vocabulary-graph-generator.ts`, `vocab-gen/vocab-gen.ts`

**Fix approach**: Same as Category A — refactor into smaller functions.

**Prerequisite**: The `console.*` calls in these files must first be
replaced with logger instances — see
[codegen-logger-replacement.plan.md](./archive/completed/codegen-logger-replacement.plan.md).

#### Category B: `src/types/generated/**` — Machine-generated output (13 rules)

These are files produced by the `sdk-codegen` pipeline. Fixing these requires
changing the generators to emit code that passes these rules.

| Rule | Why it fails | Fix strategy |
|------|-------------|--------------|
| `@typescript-eslint/consistent-type-assertions` | Generated code uses `as` casts | Emit type guards or generic narrowing |
| `@typescript-eslint/no-unnecessary-type-assertion` | Redundant assertions in generated code | Remove from generator templates |
| `@typescript-eslint/no-unnecessary-type-conversion` | Unnecessary conversions | Remove from generator templates |
| `@typescript-eslint/no-unnecessary-condition` | Always-true conditions | Fix generator logic |
| `@typescript-eslint/no-unsafe-assignment` | `any` flows in generated code | Emit proper typed assignments |
| `@typescript-eslint/no-unsafe-return` | `any` returns in generated code | Emit proper typed returns |
| `@typescript-eslint/no-redundant-type-constituents` | Redundant union members | Simplify generator type emissions |
| `@typescript-eslint/consistent-indexed-object-style` | Uses `{ [key: string]: T }` | Emit `Record<K, V>` (where K is specific) |
| `@typescript-eslint/no-restricted-types` | Broad types in generated code | Emit specific types |
| `no-restricted-properties` | `Object.keys()` in generated code | Emit `typeSafeKeys()` calls |
| `max-lines` / `max-lines-per-function` / `max-depth` / `complexity` / `max-statements` | Large generated files | Split generated output across files |
| `@typescript-eslint/explicit-module-boundary-types` | Missing return types | Add return types to generator templates |
| `no-irregular-whitespace` | Whitespace in generated strings | Fix generator string templates |
| `curly` | Missing braces in generated code | Add braces to generator templates |

**Fix approach**: Update the generator templates and functions in
`code-generation/` to emit compliant code, then regenerate. Some rules (like
`max-lines` for large type-definition files) may need further analysis
to determine whether splitting is practical.

#### Category C: Config files (3 rules)

| Rule | File | Justification |
|------|------|---------------|
| `@typescript-eslint/no-non-null-assertion` | `eslint.config.ts` | `oakStandards.configs!.strict` uses `!` |
| `@typescript-eslint/consistent-type-assertions` | config files | Config APIs use assertion-style patterns |
| `import-x/no-named-as-default-member` | config files | Third-party default exports |

**Fix approach**: These may be permanently necessary for config files that
interact with third-party APIs. Evaluate whether wrapper functions or type
guards can eliminate them.

### Other workspaces

#### `apps/oak-curriculum-mcp-streamable-http/eslint.config.ts`

| Rule | Scope | Fix strategy |
|------|-------|--------------|
| `import-x/no-relative-parent-imports` | All `**/*.ts` and config files | Restructure imports |
| `import-x/no-restricted-paths` | Test files | Restructure test utilities |
| `@typescript-eslint/no-restricted-imports` | Test files, config files | Restructure imports |
| `@typescript-eslint/await-thenable` | Config files | Fix async patterns |
| `@typescript-eslint/no-array-delete` | Config files | Use proper array methods |
| `max-lines-per-function` (220) | Test files | Tighten test structure |
| `max-lines-per-function` (200) | Config files | Evaluate necessity |
| `no-console: 'off'` | `scripts/`, `smoke-tests/` | Legitimate — keep |

#### `apps/oak-search-cli/eslint.config.ts`

| Rule | Scope | Fix strategy |
|------|-------|--------------|
| `no-console: 'off'` | `scripts/`, `smoke-tests/`, `evaluation/` | Legitimate for CLI/eval — keep |
| `max-lines: 'off'` | `ground-truths/generation/` | Refactor generation scripts |
| `max-lines-per-function: 'off'` | `ground-truths/generation/` | Refactor generation scripts |
| `max-statements: 'off'` | `ground-truths/generation/` | Refactor generation scripts |
| `complexity: 'off'` | `ground-truths/generation/` | Refactor generation scripts |
| `testRules` type cast | Test file config (line 60) | `eslint-disable` comment — fix type compatibility |

Note: The search-cli `testRules` application uses an `eslint-disable` comment
with `as unknown as Linter.RulesRecord` to work around a type mismatch
between `testRules` and `defineConfig`'s strict expectations. This is itself
a disabled check that should be resolved.

#### `packages/libs/logger/eslint.config.ts`

| Rule | Scope | Fix strategy |
|------|-------|--------------|
| `no-console: 'off'` | `src/file-sink.ts` | Legitimate — logger fallback to console |

#### Root `eslint.config.ts`

| Rule | Scope | Fix strategy |
|------|-------|--------------|
| `no-console: 'off'` | `scripts/` | Legitimate for repo scripts |

#### Legitimate `no-console: 'off'` overrides (not targeted for removal)

The following `no-console: 'off'` overrides exist for genuinely non-product
code that produces CLI output or operates as entry-point scripts. These are
appropriate and should be preserved:

- Root `scripts/`
- HTTP app `scripts/`, `smoke-tests/`
- STDIO app `bin/`, `src/index.ts`, `src/app/startup.ts`, `src/app/file-reporter.ts`
- Search CLI `scripts/`, `bin/`, `smoke-tests/`, CLI output helpers, logger fallback
- Search CLI `evaluation/`, `operations/ingestion/`
- Logger `src/file-sink.ts`
- sdk-codegen `e2e-tests/`

---

## Execution Order and Rationale

### Phase 0: Replace `console.*` with logger (prerequisite) — ✅ COMPLETE

**Tracked separately**: [codegen-logger-replacement.plan.md](./archive/completed/codegen-logger-replacement.plan.md)

The `no-console` rule is `'error'` in the shared config. All `console.*`
calls across the entire monorepo have been replaced with proper logger
instances or `process.stdout/stderr.write` for CLI output. Zero `no-console`
errors repo-wide. All quality gates pass. Phases 1/1b can now proceed.

### Phase 1: `code-generation/` authored code (6 rules) — Highest value

Refactoring authored generator scripts improves code quality and
maintainability directly. No generated output changes. No downstream
impact. Pure refactoring.

**Prerequisite**: Phase 0 (logger replacement) must be complete.

### Phase 1b: `vocab-gen/` structural overrides (3 rules, 6 files) — Moderate value

Same approach as Phase 1 but for the vocab-gen serialiser functions.
File-specific overrides for `max-lines-per-function`, `max-statements`,
and `complexity` across 6 files. Refactor into smaller, composable functions.

**Prerequisite**: Phase 0 (logger replacement) must be complete.

### Phase 2: `src/types/generated/` machine output (13 rules) — Highest effort

Requires changing generator templates and verifying that regenerated
output is correct. Each rule change needs a TDD cycle:

1. Remove the override for one rule
2. Run lint to see violations
3. Fix the generator to emit compliant code
4. Regenerate and verify

### Phase 3: Config files (3 rules) — Evaluate necessity

Some config file overrides may be permanently necessary. Evaluate each
one. Remove those that can be eliminated.

### Phase 4: Other workspaces — Independent work

The streamable-http, search-cli, and search-cli ground-truth generation
overrides are independent of the SDK separation work and can be tackled
separately. This includes:

- streamable-http: import restructuring, test/config structural limits
- search-cli: ground-truth generation structural limits, `testRules` type cast
- search-cli `eslint-disable` comment for `testRules` type compatibility

---

## Quality Gate Strategy

After removing each override:

```bash
pnpm sdk-codegen # Regenerate (if generator templates changed)
pnpm build       # Build all workspaces
pnpm type-check  # Type-check all workspaces
pnpm lint:fix    # Lint all workspaces (zero errors expected)
pnpm test        # All tests pass
```

---

## Success Criteria

### Phase 0

- Zero `console.*` calls in `code-generation/` and `vocab-gen/` product code
- `no-console` enforced without overrides for product code
- Quality gates pass

### Phase 1

- Zero ESLint overrides for `code-generation/**` in generation workspace
- All generator functions under 50 lines, complexity under 8
- Quality gates pass

### Phase 1b

- Zero ESLint overrides for `vocab-gen/` files in generation workspace
- All vocab-gen serialiser functions under 50 lines, complexity under 8
- Quality gates pass

### Phase 2

- Zero ESLint overrides for `src/types/generated/**`
- Generated code passes all strict ESLint rules
- `pnpm sdk-codegen` produces lint-clean output

### Phase 3

- Config file overrides either removed or documented as permanently necessary
  with ADR justification

### Phase 4

- All workspaces at zero overrides (except documented permanent exceptions)

### Overall

- No ESLint override blocks in any `eslint.config.ts` across the monorepo
- Full strict compliance proven by `pnpm lint` passing with zero warnings
  and zero errors

---

## Dependencies

**Blocking**: SDK workspace separation Phase 2 must be complete (done).
Phase 0 (logger replacement) must be complete before Phases 1/1b can start.

**Related Plans**:

- [codegen-logger-replacement.plan.md](./archive/completed/codegen-logger-replacement.plan.md)
  — Phase 0 prerequisite: replace `console.*` calls with logger instances
- [SDK Workspace Separation](../semantic-search/archive/completed/sdk-workspace-separation.md) (archived)
  — Phase 2 introduced these overrides in the generation workspace.
  Findings F15 (runtime wildcard exports) and F17 (ESLint override tech debt)
  in the reviewer findings registry (§13) cross-reference this plan.

---

## Notes

### Why This Matters

**Immediate Value**:

- Every disabled rule is a class of bug that can ship undetected
- Generator code quality directly affects generated output quality
- Consistent rules across all code reduce cognitive load

**Risk of Not Doing**:

- Overrides normalise rule-disabling as acceptable practice
- New code in `code-generation/` inherits relaxed rules by default
- Generated code quality cannot improve while rules are disabled

### Alignment with Workspace Rules

> "Never disable any quality gates."
> "All quality gate issues are always blocking."
> "Fix the root cause. Never work around it."

This plan directly addresses the gap between these principles and the
current ESLint configuration.

---

## References

- `packages/sdks/oak-sdk-codegen/eslint.config.ts` — primary target
- `apps/oak-curriculum-mcp-streamable-http/eslint.config.ts` — secondary target
- `apps/oak-search-cli/eslint.config.ts` — secondary target
- `.agent/directives/rules.md` — "never disable checks"
- `.cursor/rules/never-disable-checks.mdc` — workspace rule
