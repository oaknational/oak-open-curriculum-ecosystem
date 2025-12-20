# ESLint Max Files Per Directory Implementation Plan

**Status**: Ready to start
**Priority**: Medium (enforcement tied to lint centralisation)
**Estimated Effort**: 4-6 hours
**Created**: 2025-02-14

---

## Intent

Add the `max-files-per-dir` rule to `@oaknational/eslint-plugin-standards`, implement it in strict compliance with repository rules, wire it into configs, and enforce it across the repo with clear documentation and tests.

## Foundations (Must Re-Read)

- [rules.md](../../../directives-and-memory/rules.md)
- [testing-strategy.md](../../../directives-and-memory/testing-strategy.md)
- [eslint-enhancement-plan.md](./eslint-enhancement-plan.md)
- [eslint-max-files-per-dir.md](./eslint-max-files-per-dir.md)
- [eslint-plugin-standards-research.md](./eslint-plugin-standards-research.md)

## Navigation

- [ESLint Plans Index](./index.md)

## Current State

- Plugin workspace exists at `packages/core/oak-eslint`.
- `max-files-per-dir` rule and test files already exist in `packages/core/oak-eslint/src/rules/` but the rule is not exported from the plugin or included in configs.
- Plugin index currently uses type assertions and an ESLint disable comment, which conflicts with repository rules and must be removed as part of the implementation.

## Scope

### In Scope

- Implement or refactor the rule to comply with repository restrictions (no type assertions, no `any`, no `Record`, no `Object.*`).
- Export the rule from `@oaknational/eslint-plugin-standards` and include it in the strict config (and optionally recommended).
- Provide documentation in the plugin README and in the rule plan document.
- Enforce the rule across the monorepo via the shared config.

### Out of Scope

- Any change to runtime behaviour beyond linting.
- Non-eslint refactors.

## Decisions to Confirm

- Default `maxFiles` threshold (recommended: 8 as per the rule plan).
- Default `pattern` (recommended: `*`).
- Default `ignoreDirs` list for generated or vendor directories.
- Whether to enable in `strict` only or both `recommended` and `strict`.

## Plan Phases

### Phase 1: Rule Compliance Audit

1. Review `packages/core/oak-eslint/src/rules/max-files-per-dir.ts` and `.test.ts` for rule compliance.
2. Refactor the rule implementation to avoid restricted constructs (no `as`, no `any`, no `Record`, no `Object.*`).
3. Ensure the rule only uses `context.getFilename()` and stable path handling, with explicit error handling for virtual files.

**Acceptance Criteria**

- Rule implementation compiles without type assertions or disallowed constructs.
- Rule uses deterministic anchor-file reporting.
- Rule supports `pattern`, `maxFiles`, and `ignoreDirs` options.

### Phase 2: Plugin Wiring

1. Export the rule from `packages/core/oak-eslint/src/index.ts`.
2. Remove the existing plugin type assertion and disable comment by aligning rule module types with ESLint’s plugin rule typing.
3. Include the rule in `strict` config (and confirm whether to add to `recommended`).

**Acceptance Criteria**

- `rules` export includes `max-files-per-dir`.
- No `eslint-disable` comments or type assertions remain in the plugin index.
- Configs expose the rule at the agreed severity.

### Phase 3: Tests

1. Add or update tests using `@typescript-eslint/rule-tester`.
2. Cover: threshold enforcement, ignore patterns, anchor-file behaviour, and default options.
3. Ensure tests are pure and avoid global state mutation.

**Acceptance Criteria**

- Tests cover at least one pass and one fail scenario per option.
- Tests run under `pnpm test` for the plugin workspace.

### Phase 4: Documentation

1. Update `packages/core/oak-eslint/README.md` (or equivalent) with rule usage and options.
2. Update `eslint-max-files-per-dir.md` to reflect actual plugin location and configuration names.
3. Add examples using flat config, consistent with `eslint-plugin-standards-research.md`.

**Acceptance Criteria**

- Documentation shows rule options and defaults.
- Documentation uses flat config examples only.

### Phase 5: Enforcement

1. Enable the rule in the shared strict config across the repo.
2. Audit existing directories for threshold breaches.
3. Resolve violations by refactoring folder structure, not by disabling the rule.

**Acceptance Criteria**

- Lint passes without rule disables.
- All threshold breaches resolved by structural refactoring.

## Verification (Mandatory)

From repo root, run one at a time, no filters:

```bash
pnpm type-gen # Makes changes
pnpm build # Makes changes
pnpm type-check
pnpm lint:fix # Makes changes
pnpm format:root # Makes changes
pnpm markdownlint:root # Makes changes
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

## Risks and Mitigations

- **Risk**: Large directories trigger widespread violations.
  - **Mitigation**: Introduce targeted refactors and use intentional subdirectories rather than disabling the rule.
- **Risk**: ESLint rule typing friction.
  - **Mitigation**: Use native ESLint rule types end-to-end and ensure test coverage for rule exports.

## Exit Criteria

- Rule is exported, documented, and enforced via `@oaknational/eslint-plugin-standards`.
- No rule disable comments or type assertions are required.
- Lint passes across the repo with the rule enabled.
