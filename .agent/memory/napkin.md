## Session 2026-03-24 — Turbo boundary triage + plan consolidation

### What Was Done

- Distilled napkin (549 lines → archive/napkin-2026-03-24.md).
- Graduated commitlint troubleshooting to CONTRIBUTING.md, vitest v4
  entry to troubleshooting.md.
- Added turbo build system insights to distilled.md (concurrency masks,
  workspace boundary as dependency declaration).
- Compressed response augmentation entry to free space (200/200 ceiling).
- Added turbo-and-codegen-boundary-fix plan to active README index.
- Cross-referenced turbo plan with existing strategic decomposition plan
  at `.agent/plans/architecture-and-infrastructure/codegen/`.

### Turbo Boundary Triage

- **B2 extractions done**: `reader-utils.ts` (extractSubjectPhase),
  `vocab-gen-config.ts` (PipelineConfig/Result + createPipelineConfig).
- **B2 reassessment**: 3 of 5 B2 tests had type-only or no generated-type
  deps — `import type` is erased at compile time. No extraction needed.
- **Turbo overrides extended**: added `#type-check`, `#lint`, `#lint:fix`
  for sdk-codegen (same pattern as `#build`, `#test`).
- **agent-tools bug fixed**: missing `devDependencies` for
  `@oaknational/eslint-plugin-standards` — exposed by removing
  `--concurrency=2`. All other workspaces had it declared.
- **`pnpm clean && pnpm check` passes** with all fixes.
- **B1 deferred**: 4 tests that import generated code directly. Proper
  fix is workspace decomposition (separate workspaces make `^build`
  provide the ordering). Documented in decomposition plan's acceptance
  criteria.
- **Decomposition plan discoverability improved**: direct links from
  architecture README, distilled.md, and turbo plan.

### Semantic Search Plan Consolidation

- **Active/ reduced** from 5 plans + findings register to README + 1 plan.
- **Archived**: turbo-and-codegen-boundary-fix, f2-closure-and-p0-ingestion,
  search-tool-prod-validation-findings.
- **Moved to future/**: bulk-canonical-merge, search-ingestion-sdk-extraction.
- **Single active plan**: `prod-search-assessment.execution.plan.md` — assess
  prod search via MCP server after PR merge and deployment.
- **Cross-ref sweep**: 11 files updated to point at archive/completed/ or
  future/ paths. Archive files left untouched (historical records).
- **Prompt simplified**: semantic-search.prompt.md now reflects single action.
- **Fitness check**: all 13 tracked files pass.

### Learnings

- `import type` is erased by esbuild/SWC — vitest does NOT resolve
  the target module for type-only imports. This means tests with
  `import type { Foo } from './heavy-module.js'` do NOT create a
  runtime dependency on that module's transitive imports.
- When turbo's `--concurrency=N` is removed, ALL undeclared workspace
  dependencies become visible. Check `devDependencies` in every
  workspace that uses shared ESLint plugins, tsconfig bases, etc.
- Turbo `^build` only sees declared `dependencies`/`devDependencies`
  in `package.json`. If a workspace imports another workspace's
  package at ESLint config load time but doesn't declare the dep,
  turbo won't order them correctly.
