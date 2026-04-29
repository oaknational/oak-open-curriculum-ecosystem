---
name: "Build Tools Workspace Extraction"
overview: "Move repo-level scripts with tests into proper workspaces under a new build-tools/ directory. Eliminate the test:root-scripts workaround and the orphaned root vitest.config.ts."
todos:
  - id: create-build-tools-directory
    content: "Create build-tools/ at repo root and add it to pnpm-workspace.yaml."
    status: pending
  - id: extract-ci-reporter
    content: "Move ci-turbo-report.mjs and its tests into a build-tools workspace."
    status: pending
  - id: extract-agent-guardrails
    content: "Move check-blocked-content, check-blocked-patterns and their tests into a build-tools workspace."
    status: pending
  - id: extract-validators
    content: "Move validate-portability, validate-practice-fitness, validate-subagents and their tests into a build-tools workspace."
    status: pending
  - id: remove-root-vitest-config
    content: "Delete root vitest.config.ts and the test:root-scripts command. Tests now run via pnpm test (Turbo)."
    status: pending
  - id: update-ci-workflow
    content: "Remove the test:root-scripts step from CI and check. The tests run via Turbo test."
    status: pending
  - id: create-always-on-rule
    content: "Create ESLint or lint rule: repo-root scripts/ must not contain test files. Tests belong in workspaces."
    status: pending
---

# Build Tools Workspace Extraction

**Created**: 2026-03-30
**Status**: PLANNED — not yet executable
**Authority**: [`principles.md` § Build up through scales](../../../directives/principles.md#code-design-and-architectural-principles)
(canonical principle; this plan is its application to repo-level scripts).

## Problem

Repo-level scripts under `scripts/` have accumulated tests (8 files,
62 tests) that don't belong to any workspace. This created a cascade
of workarounds:

1. A root `vitest.config.ts` that only exists for these tests
2. A `test:root-scripts` command that runs outside the Turbo graph
3. Manual additions to `check` and the CI workflow as separate steps
4. A vitest include glob that had to be tightened manually

These scripts are complex enough to warrant proper workspace structure
with build, type-check, lint, and test running through Turbo like
everything else.

## Target Structure

```text
build-tools/
├── package.json              (@oaknational/build-tools)
├── tsconfig.json
├── eslint.config.ts
├── vitest.config.ts
├── src/
│   ├── ci-turbo-report/      CI summary reporter
│   ├── agent-guardrails/     check-blocked-content, check-blocked-patterns
│   ├── validators/           portability, practice-fitness, subagents
│   └── index.ts
└── pnpm-workspace.yaml entry
```

## Why `build-tools/` Not `packages/core/`

These tools are repo infrastructure, not shared library code. They
don't get consumed by apps or SDKs. They're closer to `agent-tools/`
(which already exists at root level for agent workflow CLIs) than to
`packages/core/`. The `build-tools/` name is explicit about purpose.

## Always-On Rule

Create a canonical rule at `.agent/rules/no-tests-in-root-scripts.md`
with platform adapters:

> Test files (`*.test.ts`, `*.spec.ts`) MUST NOT exist under `scripts/`
> at the repo root. Scripts complex enough to require tests MUST live
> in a workspace under `build-tools/` so they participate in the Turbo
> task graph.

## What Gets Removed

- `vitest.config.ts` at repo root (the one with `scripts/**/*.test.ts`)
- `test:root-scripts` command from root `package.json`
- `test:root-scripts` step from the CI workflow and `check` script
- All `*.test.ts` files under `scripts/`

## What Stays

- Simple scripts that don't have tests (e.g. `find-type-assertions.ts`,
  `prevent-accidental-major-version.ts`) can remain under `scripts/`
  as long as they don't warrant testing. If they grow to need tests,
  they move to `build-tools/`.

## References

- `.agent/directives/principles.md` — "Build up through scales"
- `agent-tools/` — existing precedent for root-level workspace
