---
name: "Static Analysis Tool Promotion"
overview: "Triage and resolve findings from knip and dependency-cruiser so both tools can be promoted to blocking quality gates."
specialist_reviewer: "config-reviewer"
todos:
  - id: triage-depcruise-circular
    content: "Resolve all circular dependency findings from dependency-cruiser"
    status: pending
  - id: triage-depcruise-orphans
    content: "Resolve orphan warnings — exclude docs/generated, confirm genuine orphans"
    status: pending
  - id: triage-knip-unused-files
    content: "Triage 94 unused files — delete genuine dead code, adjust config for false positives"
    status: pending
  - id: triage-knip-unused-exports
    content: "Triage 626 unused exports — delete genuine dead exports, adjust config"
    status: pending
  - id: triage-knip-deps
    content: "Triage remaining dependency findings (4+4+6)"
    status: pending
  - id: promote-to-qg
    content: "Add both tools to qg and check scripts as blocking gates"
    status: pending
isProject: false
---

# Static Analysis Tool Promotion

**Last Updated**: 2026-03-26
**Status**: Pending — tools installed, findings need triaging
**Scope**: Resolve all pre-existing findings from knip and dependency-cruiser,
then promote both to blocking quality gates.

## Why This Plan Exists

knip (`^6.0.6`) and dependency-cruiser (`^17.3.9`) were added to the monorepo
on 2026-03-26. Both tools run successfully and surface genuine pre-existing
issues. They are available as `pnpm knip` and `pnpm depcruise` but are NOT yet
in the `qg` or `check` quality gate scripts because they have findings that
would block the gate.

This plan records every finding, classifies it, and tracks resolution so the
tools can be promoted to blocking gates.

## Current Configuration

| Tool | Config | Script |
| --- | --- | --- |
| knip | `knip.config.ts` | `pnpm knip`, `pnpm knip:fix` |
| dependency-cruiser | `.dependency-cruiser.mjs` | `pnpm depcruise`, `pnpm depcruise:report` |

## Promotion Criteria

Both tools can be added to `qg` and `check` when:

1. `pnpm knip` exits 0 (no findings)
2. `pnpm depcruise` exits 0 (no violations)

The promotion change is a one-line edit in `package.json`:

```diff
-"qg": "pnpm format-check:root && pnpm markdownlint-check:root && pnpm subagents:check && pnpm portability:check && pnpm test:root-scripts && turbo run type-check lint test test:ui test:e2e smoke:dev:stub",
+"qg": "pnpm format-check:root && pnpm markdownlint-check:root && pnpm subagents:check && pnpm portability:check && pnpm knip && pnpm depcruise && pnpm test:root-scripts && turbo run type-check lint test test:ui test:e2e smoke:dev:stub",
```

And similarly for `check`.

---

## Dependency-Cruiser Findings (88 violations: 39 errors, 49 warnings)

### Circular Dependencies (39 errors)

All circular dependency errors fall into 4 distinct cycles. Many errors are
the same cycle reported from different entry points.

#### Cycle 1: sdk-codegen ES field overrides (31 errors)

```text
es-field-overrides/index.ts
  → es-field-overrides/*-overrides.ts  (units, threads, sequences, lessons, etc.)
    → es-field-overrides/common.ts
      → es-field-config.ts
        → es-field-overrides/index.ts
```

**Root cause**: `es-field-config.ts` imports the overrides barrel
(`es-field-overrides/index.ts`) to compose the full config, while each
override file imports `common.ts` which itself imports from `es-field-config.ts`
for shared types/constants.

**Classification**: Genuine circular dependency in the codegen module.
The cycle is between config and its overrides — a common pattern when a
config-assembly module imports from the same modules it configures.

**Fix strategy**: Extract the shared types/constants from `es-field-config.ts`
into a separate `es-field-types.ts` that both `common.ts` and
`es-field-config.ts` import. This breaks the cycle without changing behaviour.

#### Cycle 2: search-cli index-oak-helpers ↔ lesson-processing (2 errors)

```text
src/lib/index-oak-helpers.ts → src/lib/indexing/lesson-processing.ts → index-oak-helpers.ts
```

**Classification**: Genuine. Two modules that share indexing utilities
circularly.

**Fix strategy**: Extract the shared utilities into a dedicated module that
both import.

#### Cycle 3: search-cli ablation ↔ experiment query builders (2 errors)

```text
src/lib/hybrid-search/ablation-query-builders.ts
  → experiment-query-builders.ts
    → ablation-query-builders.ts
```

**Classification**: Genuine. These are already flagged as unused files by knip.
Likely dead code from search experimentation.

**Fix strategy**: If confirmed dead by knip triage, delete both files.
Otherwise extract shared builder utilities.

#### Cycle 4: search-cli oak-adapter ↔ sdk-client-factory (2 errors)

```text
src/adapters/oak-adapter.ts → sdk-client-factory.ts → oak-adapter.ts
```

**Classification**: Genuine. The adapter creates the SDK client, but the
factory also needs the adapter type.

**Fix strategy**: Extract the factory interface/type so the adapter can
implement it without importing the factory.

#### Cycle 5: streamable-http handlers ↔ tool-handler-with-auth (2 errors)

```text
src/handlers.ts → src/tool-handler-with-auth.ts → src/handlers.ts
```

**Classification**: Genuine. The handler creates MCP handlers that delegate
to tool-handler-with-auth, which imports types or utilities back from handlers.

**Fix strategy**: Extract the shared type/utility into a separate module.
This may naturally resolve during the simplification plan Phases 2-3 when
handler composition is restructured.

### Orphan Modules (49 warnings)

Modules not reachable from any entry point:

| Category | Count | Assessment |
| --- | --- | --- |
| Generated docs (`docs/api/assets/*.js`) | 10 | False positive — generated documentation assets. Exclude `docs/` from analysis. |
| TypeDoc source (`docs/_typedoc_src/`) | 6 | False positive — TypeDoc helper files. Exclude from analysis. |
| Test files (`.test.ts`, `.spec.ts`) | 8 | Expected — test files are entry points for vitest, not for module graph. Exclude test patterns. |
| Smoke test files | 1 | Same as tests — exclude. |
| Dead source files | ~10 | Genuine orphans (e.g., `rate-limit.ts`, `analyzer-config-variants.ts`, `definitions/index.ts`). Cross-reference with knip's unused files list. |
| Scripts and operations | 2 | Build/operational scripts not in module graph. Exclude `scripts/`, `operations/`. |
| `schema-bridge.ts`, `public-types.ts`, `openapi.ts` | 3 | Possibly barrel-only exports — need manual verification. |

**Fix strategy**:

1. Add exclusions for `docs/`, test files, smoke tests, scripts, and
   operations to the `no-orphans` rule's `pathNot`
2. Cross-reference remaining orphans with knip's unused files — overlapping
   files are confirmed dead code
3. Delete confirmed dead code; adjust config for legitimate standalone files

---

## Knip Findings (728 issues)

### Unused Files (94)

| Category | Count | Assessment |
| --- | --- | --- |
| search-cli `ground-truth-archive/` | 30 | Archived ground truths — historical data. Either delete or exclude the archive directory. |
| search-cli `ground-truth/` active entries | 15 | Ground truth entries loaded via barrel files — knip may not trace the dynamic barrel. Investigate. |
| search-cli `hybrid-search/` experimental | 7 | Likely dead experimentation code. Matches depcruise orphans. |
| search-cli `elasticsearch/setup/` | 8 | Legacy ingestion code. Likely dead after versioned-ingestion migration. |
| search-cli misc (`rate-limit.ts`, `search-scopes.ts`, etc.) | 5 | Probably dead. Verify and delete. |
| streamable-http smoke-tests | 5 | Smoke test utilities — may be used only by CI scripts. Check if they're imported by smoke test entry points. |
| streamable-http `test-fixtures/` | 2 | Test fixtures — should be imported by tests. If orphaned, delete. |
| streamable-http `src/logging.ts` | 1 | Likely dead — replaced by structured logging. |
| Root `scripts/` | 4 | One-off refactoring/analysis scripts. Exclude or delete. |
| Root config (`stryker.config.base.ts`, `test-context.js`, `vitest.field-integrity.config.ts`) | 3 | Config files — knip may not recognise these as entry points. Add to config or exclude. |

**Fix strategy**: Work through by workspace. Delete confirmed dead code,
adjust knip config for legitimate standalone files (smoke tests, config
files, ground truth archives).

### Unused Exports (626)

This is the largest finding category. Breakdown:

| Category | Count | Assessment |
| --- | --- | --- |
| search-cli `lesson-slugs-by-subject.ts` generated constants | ~400 | Generated constants for ground-truth validation. Used at runtime by ground truth scripts. Knip can't trace the usage — either add the ground truth entry barrel as an entry point or exclude the file. |
| search-cli `ground-truth-schemas.ts` exports | ~10 | Same — used by ground truth infrastructure. |
| streamable-http auth helpers (`auth-response-helpers.ts`) | ~10 | Functions exported for composition but only used within the module. Reduce export visibility. |
| streamable-http smoke test exports | ~15 | Test utilities — exported for test composition. Exclude test patterns from export analysis. |
| streamable-http widget renderers | ~5 | Named exports from barrel — may be legitimately unused pending WS3. |
| SDK and codegen exports | ~50 | Public API surface — some exports may be consumed by external packages not in this monorepo. Use `includeEntryExports: false` (already default). |
| Remaining misc | ~136 | Genuinely unused exports across all workspaces. These are the real value — dead public API surface to clean up. |

**Fix strategy**:

1. Exclude generated ground-truth files from unused-export analysis
2. Configure `includeEntryExports` per workspace for packages with external
   consumers
3. Work through genuinely unused exports by workspace — either delete or
   reduce visibility to module-internal

### Unused Dependencies (4)

| Package | Workspace | Assessment |
| --- | --- | --- |
| `@modelcontextprotocol/ext-apps` | `apps/oak-curriculum-mcp-stdio` | Likely leftover from WS2 migration. Remove if not used. |
| `dotenv` | `apps/oak-search-cli` | May be loaded via `--env-file` flag rather than import. Check CLI usage. |
| `zod` | `packages/core/openapi-zod-client-adapter` | May be used only at type level. Check if runtime import exists. |
| `@modelcontextprotocol/ext-apps` | `packages/sdks/oak-sdk-codegen` | May be used in codegen scripts. Verify. |

### Unused DevDependencies (4)

| Package | Workspace | Assessment |
| --- | --- | --- |
| `@types/unzipper` | `apps/oak-search-cli` | Remove if `unzipper` is also unused. |
| `unzipper` | `apps/oak-search-cli` | Likely dead after bulk-download refactor. Remove. |
| `@modelcontextprotocol/ext-apps` | `packages/sdks/oak-curriculum-sdk` | devDep — may have been used for testing. Verify and remove. |
| `tsx` | `packages/sdks/oak-curriculum-sdk` | Used to run scripts directly. May be consumed via turbo rather than direct import. |

### Unlisted Dependencies (6)

| Package | Workspace | Assessment |
| --- | --- | --- |
| `@oaknational/type-helpers` (×4) | `apps/oak-curriculum-mcp-stdio` | Workspace dependency used in tests — likely resolved via pnpm workspace protocol but not listed in package.json. Add as devDependency. |
| `playwright` | `apps/oak-curriculum-mcp-streamable-http` | Used in smoke tests. Add `@playwright/test` as devDependency (or `playwright`). |
| `@elastic/elasticsearch` | `packages/sdks/oak-sdk-codegen` | Sub-path import in codegen types. Add as devDependency. |

---

## Execution Order

1. **Quick wins**: Delete confirmed dead code (overlapping knip unused files +
   depcruise orphans). Expect to remove 20-30 files.
2. **Depcruise orphans config**: Add docs/, tests, scripts exclusions to
   `no-orphans` pathNot. This should eliminate ~30 of 49 warnings.
3. **Depcruise circular deps**: Fix the 5 distinct cycles. Cycle 1 (codegen)
   is the largest but most mechanical. Cycles 3 may resolve via deletion.
4. **Knip unused files**: Work through remaining files by workspace after
   dead code deletion.
5. **Knip dependencies**: Fix unlisted deps (add to package.json), remove
   genuinely unused deps.
6. **Knip unused exports**: The largest effort. Work by workspace, starting
   with generated files config, then genuine cleanup.
7. **Knip config tuning**: Exclude generated ground-truth data from export
   analysis.
8. **Promote**: Add `pnpm knip && pnpm depcruise` to `qg` and `check`.

## References

- Config files: `knip.config.ts`, `.dependency-cruiser.mjs`
- Scripts: `pnpm knip`, `pnpm depcruise`, `pnpm knip:fix`, `pnpm depcruise:report`
- Config-reviewer findings: `.dependency-cruiser.mjs` must be exact name
  (not `.dependency-cruiserrc.mjs`); no turbo plugin in knip v6; no
  `--ts-pre-compilation-deps` CLI flag (config-only)
