---
name: Knip Phase 0 Execution
overview: "Execute Phase 0 of the knip triage plan: resolve 2 unused dependencies (by removing the deprecated stdio workspace) and 9 unused devDependencies (by removing root duplicates and fixing knip config patterns)."
todos:
  - id: remove-stdio-workspace
    content: "Step 1: Remove the deprecated stdio workspace directory, knip entry, pnpm-workspace line, boundary rule, agent rules, and update active documentation references"
    status: completed
  - id: remove-root-devdeps
    content: "Step 2: Remove 4 unused root devDependencies (@axe-core/playwright, @eslint/js, tsup, typescript-eslint)"
    status: completed
  - id: fix-knip-search-cli
    content: "Step 3: Fix knip config for oak-search-cli -- add scripts/**/*.ts and evaluation/**/*.ts to project pattern"
    status: completed
  - id: fix-knip-streamable-http
    content: "Step 4: Fix knip config for streamable-http -- add widget entry/project pattern and @types/express-serve-static-core ignore"
    status: completed
  - id: verify-gates
    content: "Step 5: Run pnpm install, pnpm knip, pnpm type-check, pnpm lint:fix, pnpm test to verify no regressions"
    status: completed
  - id: invoke-reviewers
    content: "Step 6: Invoke code-reviewer and config-reviewer on the changes"
    status: completed
isProject: false
---

# Knip Phase 0: Unused Dependencies Triage and Remediation

## Grounding

- Active plan: [knip-triage-and-remediation.plan.md](.agent/plans/architecture-and-infrastructure/active/knip-triage-and-remediation.plan.md)
- Parent plan: [quality-gate-hardening.plan.md](.agent/plans/architecture-and-infrastructure/current/quality-gate-hardening.plan.md)
- Evidence-before-classification pattern active
- One-gate-at-a-time discipline active

## Investigation Results (evidence gathered)

### Task 0.1: Unused Dependencies (2) in stdio app

Both `@elastic/elasticsearch` and `@modelcontextprotocol/ext-apps` are **confirmed unused** in `apps/oak-curriculum-mcp-stdio/src/` — no imports found. ES access is via `@oaknational/oak-search-sdk`; ext-apps is HTTP-app-only.

The stdio workspace is **already commented out** of `pnpm-workspace.yaml`, has **no references** in `turbo.json`, CI, or root `package.json` scripts, and is documented as retired in [ADR-128](docs/architecture/architectural-decisions/128-stdio-workspace-retirement-and-http-transport-consolidation.md).

**Decision: remove the entire workspace.** The explore agent scanned for useful patterns:

- `create-stubbed-stdio-server.ts` (stdio transport testing) -- HTTP app has its own `createStubbedHttpApp` equivalent
- `file-reporter.ts` (file logging) -- not needed by the HTTP server
- `bin/oak-curriculum-mcp.ts` (CLI binary) -- not needed; HTTP server is the product

None require extraction. ADR-128 preserves the historical record.

### Task 0.2: Unused devDependencies (9) -- classified by evidence

**Category A -- Remove from root `package.json` (4 items, genuinely unused at root):**

- `@axe-core/playwright` -- not imported at root; workspace `streamable-http` has its own dep
- `@eslint/js` -- not imported in root `eslint.config.ts`; workspaces have their own deps
- `tsup` -- no root tsup config or script; workspaces have their own deps
- `typescript-eslint` -- not imported in root `eslint.config.ts`; workspaces have their own deps

**Category B -- Fix knip project patterns in `knip.config.ts` (3 items in oak-search-cli):**

- `@types/unzipper` -- types for `unzipper`, which IS imported in `scripts/download-bulk.ts`
- `dotenv` -- imported in `evaluation/experiments/current/mcp-comparison.experiment.ts` and `evaluation/analysis/zero-hit-investigation.ts`
- `unzipper` -- imported in `scripts/download-bulk.ts`

All three are consumed in directories NOT in the knip project glob. The knip config for `oak-search-cli` has `project: ['src/**/*.ts', 'e2e-tests/**/*.ts', 'ground-truths/**/*.ts']` -- missing `scripts/**/*.ts` and `evaluation/**/*.ts`. **Fix: expand the project glob.**

**Category C -- Genuine non-standard consumption (2 items in streamable-http):**

- `@oaknational/oak-design-tokens` -- consumed via CSS `@import` in `widget/src/index.css` and Vite config in `widget/vite.config.ts`. The `widget/` directory is NOT in the knip project glob. **Fix: add `widget/**/*.{ts,css}` to the knip project/entry pattern.**
- `@types/express-serve-static-core` -- consumed via `declare module 'express-serve-static-core'` augmentations in `src/auth/mcp-auth/mcp-auth.ts` and `src/correlation/middleware.ts`. This is standard TypeScript module augmentation; knip cannot detect it. **Fix: add targeted `ignoreDependencies` entry with explanatory comment** -- this is a genuine tool limitation for type augmentation, not a non-standard consumption pattern.

## Execution Plan

### Step 1: Remove the deprecated stdio workspace

- Delete `apps/oak-curriculum-mcp-stdio/` directory entirely
- Remove the commented-out line from `pnpm-workspace.yaml`
- Remove the workspace entry from `knip.config.ts` (lines 68-71)
- Remove `@oaknational/oak-curriculum-mcp-stdio` from `APP_PACKAGE_IMPORTS` in [packages/core/oak-eslint/src/rules/boundary.ts](packages/core/oak-eslint/src/rules/boundary.ts) (line 33)
- Update the boundary unit tests that reference the stdio package name
- Delete the legacy-stdio agent rules (`.agent/rules/legacy-stdio-workspace.md`, `.claude/rules/legacy-stdio-workspace.md`, `.cursor/rules/legacy-stdio-workspace.mdc`)
- Update documentation references in active docs (not archives -- archives are historical records):
  - `README.md` -- remove workspace listing row
  - `docs/foundation/quick-start.md` -- remove/update stdio references
  - `docs/governance/logging-guidance.md` -- update reference
  - `docs/operations/environment-variables.md` -- update reference
  - `docs/operations/production-debugging-runbook.md` -- update reference
  - `docs/architecture/provider-system.md` -- update reference
  - `docs/architecture/provider-contracts.md` -- update reference
  - `docs/architecture/openapi-pipeline.md` -- update reference
  - `apps/oak-curriculum-mcp-streamable-http/README.md` -- update reference

### Step 2: Remove 4 unused root devDependencies

Remove from root `package.json` devDependencies:

- `@axe-core/playwright`
- `@eslint/js`
- `tsup`
- `typescript-eslint`

Also remove corresponding entries from root `knip.config.ts` `ignoreDependencies` if any exist (the `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` entries are for *different* packages).

### Step 3: Fix knip config for oak-search-cli

In `knip.config.ts`, expand the `apps/oak-search-cli` workspace:

```typescript
'apps/oak-search-cli': {
  entry: ['src/bin/oaksearch.ts'],
  project: ['src/**/*.ts', 'e2e-tests/**/*.ts', 'ground-truths/**/*.ts', 'scripts/**/*.ts', 'evaluation/**/*.ts'],
  // ... existing ignoreDependencies
},
```

### Step 4: Fix knip config for streamable-http

In `knip.config.ts`, expand the `apps/oak-curriculum-mcp-streamable-http` workspace to include the widget:

```typescript
'apps/oak-curriculum-mcp-streamable-http': {
  entry: ['src/index.ts', 'widget/src/main.tsx'],
  project: ['src/**/*.ts', 'e2e-tests/**/*.ts', 'tests/**/*.ts', 'smoke-tests/**/*.ts', 'widget/src/**/*.{ts,tsx,css}'],
  ignoreDependencies: [
    '@clerk/backend',
    'prettier',
    // TypeScript module augmentation: declare module 'express-serve-static-core'
    // in src/auth/mcp-auth/mcp-auth.ts and src/correlation/middleware.ts.
    // Knip cannot detect module augmentation as dependency usage.
    '@types/express-serve-static-core',
  ],
},
```

### Step 5: Run `pnpm install` and verify

- `pnpm install` -- lock file updates after root dep removal
- `pnpm knip` -- verify unused deps/devDeps findings resolved
- `pnpm type-check` -- no type regressions
- `pnpm lint:fix` -- no lint regressions (especially after boundary rule change)
- `pnpm test` -- no test regressions

### Step 6: Invoke reviewers

Code review + config review on the changes before committing.

## Risks

- **Boundary rule change**: removing stdio from `APP_PACKAGE_IMPORTS` changes the ESLint boundary rules. This is correct (the workspace no longer exists) but the boundary unit tests need updating.
- **Widget knip entry**: adding widget source as a knip entry may surface NEW unused exports/files in the widget code. These would be Phase 2 findings, not blockers.
- **Documentation scope**: many `.agent/plans/` files reference stdio. Per distilled.md, archive docs are historical records and must not be updated. Active plans may need a note that stdio has been removed, but this is not blocking.
