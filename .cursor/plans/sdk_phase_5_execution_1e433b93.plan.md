---
name: SDK Phase 5 Execution
overview: Execute Phase 5 of the SDK workspace separation plan — 6 remaining findings (F4, F7, F8, F10, F18, scope guard cleanup) with review checkpoints after each batch. 7 of 13 original findings are already resolved.
todos:
  - id: verify-resolved
    content: Verify and close 7 already-resolved findings (F1, F2, F3, F5, F6, F9, root vocab-gen) with evidence
    status: completed
  - id: scope-guard
    content: Remove 4 stale allowlist entries from scripts/check-generator-scope.sh
    status: completed
  - id: f4-test-split
    content: Split writeMcpToolsDirectory IO test from typegen-core.unit.test.ts to typegen-core-file-operations.integration.test.ts
    status: completed
  - id: f7-path-test
    content: Add unit test asserting client-types.js import path in generate-tool-file.ts resolves correctly
    status: completed
  - id: review-batch-1
    content: "Review checkpoint 1: code-reviewer + test-reviewer on scope guard, F4, F7"
    status: completed
  - id: f10-barrel-simplify
    content: Remove duplicate exports from runtime SDK src/index.ts, re-export from ./types/index.js
    status: completed
  - id: review-batch-2
    content: "Review checkpoint 2: code-reviewer + type-reviewer on F10"
    status: completed
  - id: f18-di-refactor
    content: "DI refactoring: listUniversalTools and isUniversalToolName accept deps as parameters, eliminate vi.mock/vi.hoisted"
    status: completed
  - id: review-batch-3
    content: "Review checkpoint 3: code-reviewer + test-reviewer + type-reviewer on F18"
    status: completed
  - id: f8-resilience
    content: Document generate:clean recovery procedure in generation SDK README (Option A)
    status: completed
  - id: review-batch-4
    content: "Review checkpoint 4: code-reviewer on F8"
    status: completed
  - id: phase5-gate
    content: "Run Phase 5 gate: pnpm build && pnpm type-check && pnpm lint:fix && pnpm test"
    status: completed
  - id: final-review
    content: "Final review: code-reviewer + all applicable specialists for Phase 5 sign-off"
    status: completed
  - id: consolidation
    content: Update canonical plan, prompt, napkin. Check napkin for distillation threshold.
    status: completed
isProject: false
---

# Phase 5: Tests, Scripts, Config Migration, and Reviewer Hardening

## Triage: Already Resolved (7 of 13)

Exploration confirmed these findings are already addressed in current codebase:

- **F1** (turbo test:e2e input): `vitest.config.e2e.ts` pattern matches actual file
- **F2** (tsup dep): `tsup: ^8.5.1` present in runtime SDK devDependencies
- **F3** (phantom dep): `@next/eslint-plugin-next` not present
- **F5** (vacuous assertions): No `expect(true).toBe(true)` found in `zodgen.e2e.test.ts`
- **F6** (silent error suppression): No try/catch — `rmSync` called directly with `force: true`
- **F9** (SearchFacetsSchema dual export): Only exported from `/search` subpath; not from `/zod`
- **Root vocab-gen**: Already targets `@oaknational/curriculum-sdk-generation`

These will be verified and closed in the first batch.

---

## Batch 1: Quick Fixes (scope guard + F4 test split)

### Scope guard script cleanup

[scripts/check-generator-scope.sh](scripts/check-generator-scope.sh) lines 21-24 contain 4 stale allowlist entries pointing to deleted files:

```text
.agent/plans/semantic-search/context.md          # MISSING
.agent/plans/semantic-search/snagging-resolution-plan.md  # MISSING
.agent/plans/sdk-workspace-separation-plan.md    # MISSING
.agent/prompts/schema-first.prompt-2.md          # MISSING
```

**Action**: Remove all 4 stale entries.

### F4: Split IO test from typegen-core.unit.test.ts

[typegen-core.unit.test.ts](packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen-core.unit.test.ts) contains one test with filesystem IO (`writeMcpToolsDirectory`, lines 190-251) that uses `mkdtempSync`, `readFileSync`, and `rmSync`. All other tests (lines 15-188) are pure.

**Action**:

- Move `writeMcpToolsDirectory` test to new file `typegen-core-file-operations.integration.test.ts` in the same directory
- Add to generation workspace `vitest.config.ts` integration test patterns if needed
- Verify both test files pass independently

### F7: Add unit test for client-types.js import path

[generate-tool-file.ts](packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen/mcp-tools/parts/generate-tool-file.ts) line 13 has hardcoded path `'../../client-types.js'`. After N5 flattening this is shallow (was `../../../../`).

**Action**: Add a unit test in `generate-tool-file.unit.test.ts` asserting the generated import path resolves to a file that exists in the generation workspace `src/types/generated/` tree.

### Review checkpoint 1

Invoke `code-reviewer` and `test-reviewer` on Batch 1 changes (scope guard, F4 test split, F7 path test). Address all blocking findings before proceeding.

---

## Batch 2: Barrel Simplification (F10)

### F10: Simplify runtime SDK types/index.ts

[src/types/index.ts](packages/sdks/oak-curriculum-sdk/src/types/index.ts) and [src/index.ts](packages/sdks/oak-curriculum-sdk/src/index.ts) share overlapping exports:

- `paths`, `components` (types) — duplicated
- `PATH_OPERATIONS`, `OPERATIONS_BY_ID` (constants) — duplicated
- `PathOperation`, `OperationId` (types) — duplicated

**Action**: Remove the duplicates from `src/index.ts` and replace with re-exports from `./types/index.js`. This makes `types/index.ts` the single source for type-related exports, and `index.ts` the curated public API that delegates to it.

Verify no downstream consumers break by checking what imports from `@oaknational/curriculum-sdk` (the root barrel) vs `@oaknational/curriculum-sdk/public/search` etc.

### Review checkpoint 2

Invoke `code-reviewer` and `type-reviewer` on Batch 2. The type-reviewer confirms no type widening from the re-export change. Address all blocking findings.

---

## Batch 3: DI Refactoring (F18) — Largest Task

### F18: Eliminate module mocks in universal-tools

The test file [universal-tools.unit.test.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/universal-tools.unit.test.ts) uses `vi.mock` (line 52) and `vi.hoisted` (line 16) to mock `@oaknational/curriculum-sdk-generation/mcp-tools`. This violates the testing rules (no module-level mocking in unit or integration tests).

Root cause: `listUniversalTools()` in [list-tools.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts) and `isUniversalToolName()` in [type-guards.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/type-guards.ts) hardcode their imports from the generation package. `createUniversalToolExecutor()` already uses DI.

**Action** (TDD — write tests first):

1. Define a dependency interface for the generation-package functions:

```typescript
interface UniversalToolDependencies {
  readonly toolNames: readonly ToolName[];
  readonly getToolFromToolName: (name: ToolName) => ToolDescriptor;
  readonly isToolName: (value: unknown) => value is ToolName;
}
```

1. Refactor `listUniversalTools(deps: UniversalToolDependencies)` — accept deps as parameter instead of importing directly.
2. Refactor `isUniversalToolName` — create a factory `createIsUniversalToolName(deps)` that returns the type guard, or accept `isToolNameFn` as parameter.
3. Update call sites to wire real dependencies.
4. Rewrite tests with simple injected fakes — no `vi.mock`, no `vi.hoisted`.
5. Remove ad-hoc `McpToolDefinition` interface and `Record<string, McpToolDefinition>` from the test file — use proper types from the generation package or narrower test-specific fixtures.
6. Keep the test as `.unit.test.ts` if mocks are fully eliminated, or rename to `.integration.test.ts` if simple injected fakes remain.

### Review checkpoint 3

Invoke `code-reviewer`, `test-reviewer`, and `type-reviewer` on Batch 3. This is the highest-risk batch (public API surface change). Address all blocking findings.

---

## Batch 4: Resilience (F8)

### F8: generate:clean atomicity

[package.json](packages/sdks/oak-curriculum-sdk-generation/package.json) line 70: `"generate:clean": "rm -rf src/types/generated"`. If `type-gen` fails after `clean`, the workspace is left without generated artefacts.

**Action** (choose one):

- **Option A (documentation)**: Add a "Recovery" section to the generation SDK README explaining `pnpm type-gen` re-generates everything from scratch, and that `generate:clean` should only be called via the `type-gen` script chain.
- **Option B (atomic write)**: Change the pipeline to write to `src/types/generated.tmp`, then atomically rename to `src/types/generated` on success. More robust but more complex.

Recommend Option A for Phase 5 (proportional to risk), with Option B tracked as a future hardening task.

### Review checkpoint 4

Invoke `code-reviewer` on Batch 4. If Option B is chosen, also invoke `config-reviewer`.

---

## Phase 5 Gate

Run the full intermediate compilation gate:

```bash
pnpm build
pnpm type-check
pnpm lint:fix
pnpm test
```

All gates must pass.

---

## Final Review

Invoke `code-reviewer` with instruction to recommend any remaining specialists. The change profile suggests:

- `test-reviewer` (F4 test split, F7 new test, F18 DI refactoring)
- `type-reviewer` (F10 barrel simplification, F18 type changes)
- `config-reviewer` (scope guard script, any package.json changes)

Address all blocking findings, then update the canonical plan to mark Phase 5 complete and update Phases 6-7 status.

---

## Consolidation

After Phase 5 gate passes:

1. Update [sdk-workspace-separation.md](/.agent/plans/semantic-search/active/sdk-workspace-separation.md) — mark Phase 5 `completed`, update findings registry
2. Update [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md) — Phase 5 status
3. Update napkin with session learnings
4. Check napkin length (currently ~755 lines) — if approaching 800, trigger distillation
