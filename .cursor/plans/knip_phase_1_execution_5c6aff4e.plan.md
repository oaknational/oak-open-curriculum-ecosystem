---
name: Knip Phase 1 Execution
overview: "Triage and remediate all 53 unused files reported by knip, executing Phase 1 of the knip triage and remediation plan. Files are classified into three remediation batches: delete genuinely dead code (~38 files), fix non-standard consumption patterns (~13 files), and handle generated artifacts (~2 files)."
todos:
  - id: batch-a-delete-dead
    content: Delete 38 genuinely dead files across 5 sub-groups (streamable-http barrels, search-cli dead code, ES setup CLI, ground-truth archive leaves, root empty files)
    status: completed
  - id: batch-a-side-effects
    content: "Clean up side effects: update typedoc.json entryPoints, remove empty directories, check for broken imports"
    status: completed
  - id: batch-a-verify
    content: Run pnpm knip + quality gates (type-check, lint:fix, test) to verify Batch A
    status: completed
  - id: batch-b-fix-consumption
    content: "Fix non-standard consumption: add knip entries for smoke scripts, root configs, generation scripts, sentry-mcp typecheck test; add smoke:dev:auth package.json script"
    status: completed
  - id: batch-b-verify
    content: Run pnpm knip + quality gates to verify Batch B
    status: completed
  - id: batch-c-generated
    content: "Handle generated artifacts: fix bulk-data-manifest consumption (should be in use), investigate generated/index.ts barrel"
    status: completed
  - id: arch-review-barrels
    content: Invoke architecture reviewers (barney + betty) for barrel file decisions — dead barrels (A1 logging.ts, A1 observability/index.ts, A2 search-quality barrels, A4 units/index.ts, generated/index.ts) and any tensions revealed
    status: completed
  - id: final-verify
    content: Run full pnpm knip and confirm 0 unused files; update knip plan status
    status: completed
isProject: false
---

# Knip Phase 1: Triage 53 Unused Files

## Investigation Summary

All 53 files have been investigated with evidence. Classification:

- **Batch A**: 38 files — genuinely dead code, delete
- **Batch B**: 13 files — non-standard consumption, fix knip config or add scripts
- **Batch C**: 2 files — generated artifacts (`bulk-data-manifest` consumption bug + barrel)

## Batch A: Delete Dead Code (38 files)

### A1: streamable-http dead barrels, duplicates, fixtures (5 files)

- `src/logging.ts` — dead barrel; `logging/index.ts` is used instead
- `src/observability/index.ts` — dead barrel; `http-observability.ts` imported directly
- `src/test-fixtures/auth-scenarios.ts` — dead fixture, never integrated
- `src/test-helpers/search-fakes.ts` — dead duplicate of `fakes.ts`
- `smoke-tests/token-resolution.ts` — dead helper, zero callers

### A2: oak-search-cli dead library code (14 files)

- `src/lib/elasticsearch/definitions/index.ts` — doc-only, `export {}`
- `src/lib/hybrid-search/analyzer-config-variants.ts` — no importers
- `src/lib/hybrid-search/bm25-config.ts` — only imported by dead `configurable-query-builders`
- `src/lib/hybrid-search/configurable-query-builders.ts` — only imports dead `bm25-config`
- `src/lib/hybrid-search/sequence-facets.ts` — no importers
- `src/lib/hybrid-search/sequences.ts` — no importers
- `src/lib/hybrid-search/types.ts` — only used by dead sequence-facets/sequences
- `src/lib/index-oak-keystage-ops.ts` — only imported by dead `index-oak.ts`
- `src/lib/index-oak.ts` — no importers
- `src/lib/openapi.schemas.ts` — TypeDoc entryPoint only, not runtime
- `src/lib/rate-limit-logger.ts` — only imported by dead `setup/ingest.ts`
- `src/lib/rate-limit.ts` — no importers
- `src/lib/search-scopes.ts` — no importers
- `src/lib/search-quality/ground-truth.ts` — dead barrel, never imported
- `src/lib/search-quality/index.ts` — dead barrel, never imported

### A3: ES setup CLI cluster (8 files) — per owner decision

- `src/lib/elasticsearch/setup/cli-commands.ts`
- `src/lib/elasticsearch/setup/cli-output.ts`
- `src/lib/elasticsearch/setup/cli.ts` (legacy standalone CLI, shebang)
- `src/lib/elasticsearch/setup/index.ts`
- `src/lib/elasticsearch/setup/ingest-bulk.ts`
- `src/lib/elasticsearch/setup/ingest-output.ts`
- `src/lib/elasticsearch/setup/ingest.ts`
- `src/lib/elasticsearch/setup/schemas.ts`

Superseded by SDK-based admin commands. Owner confirmed: delete.

### A4: Ground-truth archive dead leaf files (9 files)

- `ground-truth-archive/english/types.ts` — not imported by any file in the archive chain
- `ground-truth-archive/maths/secondary/units/index.ts` — barrel NOT imported by `maths/secondary/index.ts`
- `ground-truth-archive/maths/secondary/units/algebra.ts`
- `ground-truth-archive/maths/secondary/units/geometry.ts`
- `ground-truth-archive/maths/secondary/units/graphs.ts`
- `ground-truth-archive/maths/secondary/units/hard-queries.ts`
- `ground-truth-archive/maths/secondary/units/number.ts`
- `ground-truth-archive/maths/secondary/units/statistics.ts`
- `ground-truth-archive/maths/secondary/units/types.ts`

The `maths/secondary/index.ts` uses `.query.ts` / `.expected.ts` pairs, not the `units/` directory.

### A5: Root empty/dead files (4 files + 1 barrel)

- `test-context.js` — 0 bytes, no references
- `scripts/find-type-assertions.ts` — 0 bytes, no references
- `scripts/refactor/part1-codemod-exec.ts` — 0 bytes, no references
- `scripts/refactor/part1-codemod-plan.ts` — 0 bytes, no references
- Also delete empty `scripts/refactor/` directory after removing files

## Batch B: Fix Non-Standard Consumption (13 files)

### B1: streamable-http smoke scripts — add knip entries (4 files)

These are legitimate operational scripts consumed via `pnpm exec tsx`:

- `smoke-tests/auth/cleanup-browser-handshake.ts` — documented in `docs/clerk-oauth-trace-instructions.md`
- `smoke-tests/auth/prepare-browser-handshake.ts` — documented in same
- `smoke-tests/capture-rest-analysis.ts` — self-executing analysis script
- `smoke-tests/smoke-dev-auth.ts` — documented in `TESTING.md`, also add missing `smoke:dev:auth` script to `package.json`

**Fix**: Add `smoke-tests/**/*.ts` to the streamable-http workspace `entry` in [knip.config.ts](knip.config.ts). Also add `smoke:dev:auth` script to the workspace `package.json`.

### B2: Root config/scripts — add knip entries (3 files)

- `scripts/prevent-accidental-major-version.ts` — consumed via `.husky/commit-msg` hook
- `vitest.field-integrity.config.ts` — consumed via `scripts/run-field-integrity-tests.mjs`
- `stryker.config.base.ts` — consumed via `turbo.json` inputs

**Fix**: These are already in the root `entry` (`scripts/**/*.{ts,mjs}`) — `prevent-accidental-major-version.ts` should be found. For `vitest.field-integrity.config.ts` and `stryker.config.base.ts`, add as root `entry` patterns (e.g. `vitest.field-integrity.config.ts`, `stryker.config.base.ts`).

### B3: Ground-truth generation scripts — add knip entry (2 files)

- `ground-truths/generation/generate-ground-truth-types.ts` — consumed via subprocess (`src/cli/eval/index.ts` pass-through)
- `ground-truths/generation/index.ts` — barrel for generation scripts

**Fix**: Add `ground-truths/generation/**/*.ts` to oak-search-cli `entry` in `knip.config.ts`.

### B4: sentry-mcp typecheck test — add workspace entry (1 file)

- `packages/libs/sentry-mcp/tests/capture-policy.typecheck.ts` — consumed by `tsc`, not vitest

**Fix**: Add `sentry-mcp` workspace to `knip.config.ts` with `entry: ['src/index.ts']` and `project: ['src/**/*.ts', 'tests/**/*.ts']`, so `.typecheck.ts` files are in scope.

## Batch C: Generated Artifacts (2 files)

- `ground-truths/generated/bulk-data-manifest.ts` — not consumed by any TS importer, but **owner indicates it should be in use**. This is a consumption bug, not dead code. Investigate: what should consume it, and wire the import.
- `ground-truths/generated/index.ts` — barrel, only used for existsSync check. If `bulk-data-manifest.ts` gets wired in properly, the barrel may become the correct import path.

**Fix**: Investigate what should consume `bulk-data-manifest.ts`, wire the missing import, and verify the barrel is then live. If the barrel remains unused after wiring the manifest, evaluate whether to delete or keep per architecture reviewer guidance.

## Architecture Reviewer Checkpoints

Invoke **architecture-reviewer-barney** (simplification-first) and **architecture-reviewer-betty** (cohesion/coupling) at these decision points:

- **Before deleting dead barrels** (A1: `src/logging.ts`, `src/observability/index.ts`; A2: `search-quality/ground-truth.ts`, `search-quality/index.ts`): confirm that removing these convenience layers is correct and no tension is being papered over. A dead barrel may signal that the "right" public API was defined but callers went around it — the fix might be to wire callers through the barrel rather than delete it.
- **Before deleting A4 ground-truth archive leaf files** (`maths/secondary/units/`): confirm these are genuinely dead and not a missing integration that should exist.
- **Batch C generated barrel**: whether `generated/index.ts` should be the standard import path for generated artifacts, or whether direct imports are preferable.
- **Any tension discovered during execution**: if deleting a file reveals that the remaining import structure is inconsistent or that boundaries are unclear, pause and consult reviewers before proceeding.

## Execution Order

1. **Architecture review** of barrel file decisions (A1, A2 barrels, A4, Batch C) — invoke reviewers before committing to deletions
2. Batch A (delete dead code) — highest confidence, immediate impact. Incorporate reviewer guidance on barrels.
3. Batch B (fix consumption patterns) — config changes to `knip.config.ts` and one `package.json`
4. Batch C (fix `bulk-data-manifest` consumption bug, resolve generated barrel)
5. Run `pnpm knip` after each batch to verify count reduction
6. Run quality gates: `pnpm type-check && pnpm lint:fix && pnpm test`

## Side Effects to Watch

- **TypeDoc entryPoints**: `apps/oak-search-cli/typedoc.json` lists some deleted files (`openapi.schemas.ts`, `hybrid-search/*`). Must update typedoc config after deletions.
- **Empty directories**: Remove empty dirs after file deletion (e.g. `elasticsearch/setup/`, `hybrid-search/`, `scripts/refactor/`).
- **TESTING.md**: Update if `smoke-dev-auth.ts` references change.
- **Unused exports**: Many deleted files also contribute to the 630 unused exports count; deleting them will reduce Phase 2 scope.
