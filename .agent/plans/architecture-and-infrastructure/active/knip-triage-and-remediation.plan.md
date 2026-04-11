---
name: "Knip Triage and Remediation"
overview: "Run knip, triage all findings by category, design and apply remediations — prefer fixing consumption patterns over reducing knip sensitivity."
todos:
  - id: triage-unused-deps
    content: "Phase 0: Triage unused dependencies (2) and unused devDependencies (9) — hard blockers, real manifest issues."
    status: completed
  - id: triage-unused-files
    content: "Phase 1: Triage unused files (53) — investigate each, verify consumption, remediate."
    status: completed
  - id: triage-unused-exports
    content: "Phase 2: Triage unused exports (614 exports + 236 types) — investigate by workspace, verify each, remediate."
    status: completed
  - id: resolve-phase2-followups
    content: "Phase 2.5: Resolve follow-ups from Phase 2 — consolidate auth helpers, restructure ground-truth barrels, fix schema-emitter, resolve cli/shared barrel."
    status: pending
  - id: triage-config-hints
    content: "Phase 3: Triage configuration hints (43) — fix knip.config.ts entry/project patterns and stale ignore entries."
    status: completed
  - id: remediate-and-promote
    content: "Phase 4: Verify clean knip baseline, add knip to pnpm check, pre-commit, pre-push, and CI, update ADR-121."
    status: completed
---

# Knip Triage and Remediation

**Last Updated**: 2026-04-11
**Status**: Active — Phases 0-4 complete (`pnpm knip` exits 0, promoted to all gate surfaces). Phase 2.5 follow-ups remain.
**Scope**: Run knip, triage all findings, design and apply remediations,
promote to blocking quality gate.
**Parent**: [quality-gate-hardening.plan.md](../current/quality-gate-hardening.plan.md)
(item `enable-knip`)

## Context

Knip is installed and configured (`knip.config.ts`) but is not a blocking
gate. It runs on demand but findings have never been systematically triaged.
The parent plan identifies knip's dependency-hygiene findings as high-impact
— undeclared dependencies caused real CI failures (PR #76) — and its
unused-code detection as medium-impact for long-tail cleanup.

Some findings may turn out to be caused by unusual consumption patterns
(e.g. CLI entry points, smoke tests, generated code, barrel re-exports)
rather than genuinely dead code. **No finding may be labelled as a false
positive without evidence-based proof.** Every finding must be investigated
and its status determined by evidence. Where investigation proves the code
IS consumed via a non-standard pattern, the correct response is to fix the
consumption pattern to use standard conventions that knip can follow, NOT
to add `ignoreDependencies` or reduce knip sensitivity. Reducing
sensitivity is a gate weakness, not a fix.

## Verified Findings (2026-04-11)

| Category | Pre-Phase 0 | Post-Phase 0 | Post-Phase 3 | Priority |
|---|---|---|---|---|
| Unused dependencies | 2 | **0** | **0** | P0 — resolved |
| Unused devDependencies | 9 | **0** | **0** | P0 — resolved |
| Unlisted binaries | 2 | **0** | **0** | P1 — resolved |
| Unused files | 96 | **0** | **0** | P1 — resolved |
| Unused exports | 515+234 | 614 | **0** | P2 — resolved |
| Duplicate exports | 1 | 0 | **0** | P2 — resolved |
| Configuration hints | 45 | ~40 | **0** | P1 — resolved |
| **Total** | **904** | **~725** | **0** | |

### Phase 0 Resolution (2026-04-11i)

- **Stdio workspace removed entirely** per ADR-128. Deleted
  `apps/oak-curriculum-mcp-stdio/` (~5000 lines, 55 files). No unique
  code needed extraction — HTTP app has equivalents for all patterns.
- **4 root devDeps removed**: `@axe-core/playwright`, `@eslint/js`,
  `tsup`, `typescript-eslint` (redundant at root, workspaces have own).
- **Knip config fixed**: `scripts/**/*.ts` and `evaluation/**/*.ts`
  added as entries+project for oak-search-cli; `widget/src/main.tsx`
  and `widget/src/**/*.{ts,tsx,css}` added for streamable-http.
- **2 documented ignoreDependencies added**: `@types/express-serve-static-core`
  (TS module augmentation), `@oaknational/oak-design-tokens` (CSS @import).
- **Pre-existing bug fixed**: knip entry path was `src/bin/oaksearch.ts`,
  corrected to `bin/oaksearch.ts`.
- **13 documentation files updated** to remove stale stdio references.
- **3 legacy-stdio agent rules deleted**.

### Phase 1 Resolution (2026-04-11j)

- **38 genuinely dead files deleted** across 5 sub-groups:
  streamable-http barrels/duplicates/fixtures (5), oak-search-cli dead
  library code (15), ES setup CLI cluster (8), ground-truth archive
  dead leaf files (9), root empty/dead files (4).
- **13 non-standard consumption patterns fixed** via `knip.config.ts`:
  smoke-tests as entries for streamable-http, root workspace moved to
  `workspaces["."]`, generation scripts as entries for oak-search-cli,
  sentry-mcp workspace added with typecheck test entry.
- **`bulk-data-manifest` consumption bug fixed**: wired through
  `generated/index.ts` barrel into `validate-ground-truth.ts` with
  new manifest completeness validation check.
- **2 unlisted binaries resolved**: `lsof` and `ps` added to
  `ignoreBinaries` (system utilities for port/process checks).
- **`smoke:dev:auth` script added** to streamable-http `package.json`.
- **`typedoc.json` updated** to remove references to deleted files.
- Architecture reviewers consulted on all barrel file decisions.

### Phase 2 Resolution (2026-04-11k)

614 unused exports + 236 unused types resolved to **0** across 4 batches:

- **Batch A**: Ground-truth archive barrel trimming (~526 findings).
  Scripted removal of per-query-constant re-exports from 54 barrel files.
  Fixed `generate-ground-truth-types.ts` to stop emitting `TOTAL_LESSON_COUNT`
  and `GENERATED_AT`. Deleted 16 empty subject-level barrel files and
  `ablation-query-builders.ts` (dead file).
- **Batch B**: oak-search-cli non-ground-truth (~153 findings).
  De-exported ~40 internal types/helpers. Deleted dead code: `esBulk`,
  `createEsClient`, `suggestLogger`, `printWarning`, `getIndexVersion`,
  `handleUploadComplete`, `writeFailureReport`, `buildThreadRrfRequest`,
  `BaseEnvSchema`, and numerous unused type aliases. Re-exported 9 types
  for TypeDoc API documentation.
- **Batch C**: streamable-http + agent-tools + packages (~118 findings).
  De-exported ~50 same-file-only functions/types/constants. Trimmed ~20
  barrel re-exports. Deleted 8 duplicate auth-response-helpers functions,
  `PROMPT_SCHEMAS`/`PromptSchemas`/`PromptName` dead code, and default
  export from eslint rule.
- **Batch D**: Config-level resolution of remaining 14 type findings —
  5 e2e-test types resolved by adding `e2e-tests/**/*.ts` as entry for
  streamable-http; 9 doc-gen types resolved by adding TypeDoc entry
  points to oak-search-cli entries.

Child plan: `.cursor/plans/knip_phase_2_execution_cc08d451.plan.md`
Code reviewers invoked after each batch. Config reviewer invoked for
Phase 3 knip config changes.

### Phase 3 Resolution (2026-04-11k)

43 configuration hints resolved to **0** by updating `knip.config.ts`:

- Removed 7 redundant `ignore` patterns (knip doesn't scan `.agent/**` etc.)
- Removed `ignoreFiles` (no generated type files exist)
- Removed 14 stale `ignoreDependencies` (knip now auto-detects them)
- Removed 1 stale `ignoreBinaries` (`playwright`)
- Fixed 2 wrong entry patterns (`src/cli` → `src/bin`, `src/mcp-tools.ts`)
- Removed ~14 redundant `src/index.ts` entries (knip auto-detects from exports)
- Added TypeDoc entry points for oak-search-cli
- Added `e2e-tests/**/*.ts` as entry for streamable-http

### Phase 4 Resolution (2026-04-11)

Knip promoted to all four gate surfaces:

- **`pnpm check`**: added `pnpm knip` after `portability:check`
- **Pre-commit** (`.husky/pre-commit`): added knip check before turbo gates
- **Pre-push** (`.husky/pre-push`): added knip check after `portability:check`
- **CI** (`.github/workflows/ci.yml`): added knip step after `portability:check`
- **ADR-121**: knip row added to coverage matrix, design principle #2 updated,
  implementation lists updated, change log entry added
- **Cross-references updated**: `build-system.md` (matrix + command expansion),
  `workflow.md` (gate surface list), `CONTRIBUTING.md` (`pnpm check` description),
  `AGENT.md` (`pnpm check` comment), `distilled.md` (corrected stale entry)
- **Parent plan** (`quality-gate-hardening.plan.md`): `enable-knip` marked complete

Config-reviewer and docs-adr-reviewer invoked. All findings addressed.

### Unused Dependencies (2) — P0

```text
@elastic/elasticsearch          apps/oak-curriculum-mcp-stdio/package.json
@modelcontextprotocol/ext-apps  apps/oak-curriculum-mcp-stdio/package.json
```

Both are in the stdio app. **The stdio MCP server is deprecated.** Removing
the entire workspace is a valid remediation, but requires:

1. Scanning the stdio app source for any useful patterns or learnings to
   extract before deletion
2. Removing all references to it across the codebase (knip config,
   turbo.json, root package.json, documentation, CI)
3. Retaining a historical note that it was built first, then superseded
   by the HTTP streamable server

The HTTP server will eventually support a stdio transport, but that is not
currently a priority and is out of scope for this plan.

If the decision is to remove the stdio workspace entirely, the 2 unused
dependencies are resolved by that removal. If not, investigate each
individually.

### Unused devDependencies (9) — P0

```text
@oaknational/oak-design-tokens    apps/oak-curriculum-mcp-streamable-http
@types/express-serve-static-core  apps/oak-curriculum-mcp-streamable-http
@types/unzipper                   apps/oak-search-cli
dotenv                            apps/oak-search-cli
unzipper                          apps/oak-search-cli
@axe-core/playwright              package.json (root)
@eslint/js                        package.json (root)
tsup                              package.json (root)
typescript-eslint                 package.json (root)
```

Each needs verification: is the dependency used by any file in that
workspace? If yes, the consumption pattern needs fixing. If no, remove
from `package.json`. Do not presume any outcome before investigating.

### Unlisted Binaries (2)

```text
lsof  apps/oak-curriculum-mcp-streamable-http
ps    apps/oak-curriculum-mcp-streamable-http
```

Investigation required: find where `lsof` and `ps` are invoked, determine
whether the invocation is necessary, and decide the appropriate
remediation based on evidence.

### Unused Files (96) — P1

Breakdown by workspace:

- `apps/oak-search-cli`: ~78 files (ground-truth archives, hybrid-search,
  setup scripts, rate-limiting). Many are in `ground-truth-archive/` and
  `hybrid-search/`. Investigation required to determine whether each is
  genuinely dead or consumed via a pattern knip cannot detect.
- `apps/oak-curriculum-mcp-streamable-http`: ~9 files (smoke tests, logging,
  observability, test helpers)
- Root scripts: 4 files (`find-type-assertions.ts`,
  `prevent-accidental-major-version.ts`, refactor scripts)
- Root config: 3 files (`stryker.config.base.ts`, `test-context.js`,
  `vitest.field-integrity.config.ts`)
- `packages/libs/sentry-mcp`: 1 file (typecheck test)

Investigation required: determine how `ground-truth-archive/` files are
(or are not) consumed. Check for dynamic imports, glob-based discovery,
and script-based invocation. Evidence determines the remediation.

### Unused Exports (515) and Unused Exported Types (234) — P2

The largest category. Dominated by:

- `apps/oak-search-cli`: ~350+ exports across adapters, indexing,
  hybrid-search, ground-truth. Investigation required: for each, determine
  whether genuinely unused or consumed via a pattern knip cannot detect.
  Where barrel re-exports expose more than is consumed, trim the barrel.
- `apps/oak-curriculum-mcp-streamable-http`: ~100 exports across auth,
  observability, test helpers, smoke tests.
- `agent-tools`: ~15 exports
- Root scripts: ~5 exports
- `packages/core/oak-eslint`: ~5 exports
- `packages/core/openapi-zod-client-adapter`: ~4 exports
- `packages/libs/logger`: ~5 types
- `packages/libs/sentry-mcp`: 1 type

### Duplicate Exports (1)

```text
baseE2EConfig|default  vitest.e2e.config.base.ts
```

Named export and default export for the same value. Investigate which
consumers use which name, then consolidate to one export.

### Configuration Hints (45)

Knip suggests removing stale `ignore`, `ignoreDependencies`,
`ignoreBinaries` entries and refining entry/project patterns. Each hint
must be investigated individually. Fixing the config first improves
knip's accuracy for all other categories.

## Guiding Principles

From `principles.md`:

> "No unused code — If a function is not used, delete it. If product code
> is only used in tests, delete it. If a file is not used, delete it.
> Delete dead code."

> "Keep it strict — don't invent optionality, don't add fallback options."

**Decision rule**: Every finding must be investigated with evidence before
any action. When investigation proves a reported item IS consumed via a
non-standard pattern, the correct fix is to make the consumption pattern
standard (explicit import, explicit entry point in knip config) rather
than adding an ignore rule. Reducing knip sensitivity is a gate weakness.
The only legitimate `ignoreDependencies` entries are for genuinely
non-imported tools (Stryker CLI, Husky hooks, commitlint hooks) — and
even those must be verified, not assumed.

## Quality Gate Strategy

After each phase, run:

```bash
pnpm knip          # Verify finding count decreased
pnpm type-check    # No type regressions
pnpm lint          # No lint regressions
pnpm test          # No test regressions
```

After Phase 4, run the full `pnpm check`.

## Resolution Plan

### Phase 0: Triage Unused Dependencies (P0, ~1 hour)

**Foundation Check-In**: Re-read principles.md §Code Quality, §Removing
unused code.

#### Task 0.1: Remove unused dependencies from stdio app

Verify that `@elastic/elasticsearch` and `@modelcontextprotocol/ext-apps`
are not imported by any file in `apps/oak-curriculum-mcp-stdio/src/`.
If confirmed unused, remove from `package.json`.

**Acceptance Criteria**:

1. No imports of either package in the stdio app source
2. Both removed from `package.json`
3. `pnpm install` succeeds
4. `pnpm type-check` passes for the stdio app
5. `pnpm test` passes for the stdio app

#### Task 0.2: Triage unused devDependencies

For each of the 9 unused devDependencies:

1. Search for imports/usage in the relevant workspace
2. If genuinely unused: remove from `package.json`
3. If used indirectly (e.g. via another tool): verify the consumption
   path and document; fix the consumption pattern if possible, or add
   a targeted `ignoreDependencies` entry with a comment explaining why

**Acceptance Criteria**:

1. Each dependency classified as removed or documented
2. `pnpm install` succeeds
3. All quality gates pass

### Phase 1: Triage Unused Files (P1, ~2-3 hours)

#### Task 1.1: Classify ground-truth archive files

For each `ground-truth-archive/` file, gather evidence:

1. Search for imports (static and dynamic) across the codebase
2. Search for glob patterns that could discover these files
3. Check `package.json` scripts that might invoke them
4. Check test configurations that might reference them

Evidence determines the remediation: delete if genuinely dead, fix
consumption pattern or knip config if consumed via non-standard path.

#### Task 1.2: Classify remaining unused files

For each non-ground-truth unused file, gather evidence of consumption:

1. Search for imports across the codebase
2. Check `package.json` scripts and config files
3. Check test configurations

Evidence determines the remediation: delete if genuinely dead, fix
consumption pattern or knip config if evidence proves consumption.

**Acceptance Criteria**:

1. Every unused file classified and actioned
2. Knip unused files count is 0 or all remaining are documented
3. Quality gates pass

### Phase 2: Triage Unused Exports (P2, ~3-5 hours)

This is the largest phase. Approach by workspace.

#### Task 2.1: Investigate barrel re-exports

Identify `index.ts` barrel files among the reported unused exports.
For each, verify whether the export is consumed anywhere. If evidence
shows the barrel re-exports more than is consumed, trim the barrel to
only re-export what is used.

#### Task 2.2: Delete genuinely unused exports

For exports not covered by barrel trimming: verify they are genuinely
unused (no runtime or test consumer). Delete if confirmed.

#### Task 2.3: Fix the duplicate export

Remove either `baseE2EConfig` or the `default` export from
`vitest.e2e.config.base.ts`.

**Acceptance Criteria**:

1. Unused exports count reduced to 0 or all remaining are documented
2. Quality gates pass
3. No public API surface changes that affect semver

### Phase 3: Triage Configuration Hints (P1, ~1-2 hours)

#### Task 3.1: Fix stale ignore entries

Remove `ignore`, `ignoreDependencies`, `ignoreBinaries` entries that
knip identifies as unnecessary. For each removal, verify the finding
is correct (the ignored item is genuinely no longer needed).

#### Task 3.2: Fix entry and project patterns

Refine entry/project patterns that knip identifies as having no matches.
Remove redundant entry patterns.

**Acceptance Criteria**:

1. Configuration hints count reduced to 0
2. Knip runs clean with updated config
3. Quality gates pass

### Phase 4: Promote to Blocking Gate (~30 minutes)

#### Task 4.1: Verify clean knip baseline

Run `pnpm knip` and confirm 0 findings across all categories.

#### Task 4.2: Add knip to all four gate surfaces

Knip must be added to every gate surface simultaneously:

1. **`pnpm check`** — add `pnpm knip` to the check script in
   `package.json`
2. **Pre-commit** (`.husky/pre-commit`) — add `pnpm knip` so every
   commit is clean
3. **Pre-push** (`.husky/pre-push`) — add `pnpm knip` per pre-push
   === CI principle
4. **CI** (`.github/workflows/ci.yml`) — add `pnpm knip` to the
   workflow

Per ADR-121, pre-push and CI must have the same check set. Pre-commit
also includes knip because unused code must not enter the repository
at all — catching it at commit time is faster feedback than waiting
for push.

#### Task 4.3: Update ADR-121 coverage matrix

Add knip to the ADR-121 coverage matrix for all four surfaces.

**Acceptance Criteria**:

1. `pnpm knip` returns exit 0
2. `pnpm check` includes `pnpm knip`
3. Pre-commit runs knip
4. Pre-push runs knip
5. CI runs knip
6. ADR-121 matrix updated
7. Full `pnpm check` passes

## Dependencies

**Parent plan**: `quality-gate-hardening.plan.md` (item `enable-knip`)

**No blocking dependencies** — this plan can execute independently.
ESLint config standardisation (sibling item in parent plan) is not
a prerequisite for knip work.

## Non-Goals (YAGNI)

- Knip integration with Turbo (knip runs as a standalone command)
- Per-workspace knip configs (single root config is sufficient)

## Risks

- **Ground-truth files may be consumed dynamically**: if the generation
  pipeline uses glob/dynamic imports, deleting "unused" files could break
  it. Must verify consumption patterns before deletion.
- **Barrel trimming may affect downstream consumers**: if an SDK barrel
  is trimmed, consumers that import removed exports will break. Run full
  `pnpm type-check` after each barrel change.
- **Some devDependencies may be consumed by tools not visible to knip**:
  e.g. Playwright config, Stryker config. These need manual verification.
- **Large unused-export count may include re-exports consumed by
  external tools** (typedoc, documentation generators). Verify before
  deleting.

## Phase 2.5: Resolve Phase 2 Follow-ups (blocks Phase 4)

Four items surfaced during Phase 2 investigation that represent
architectural improvements beyond export trimming. Each must be
resolved (actioned OR explicitly deferred with owner rationale)
before Phase 4 can proceed.

### Follow-up 2.5.1: Consolidate auth response helpers

`auth-response-helpers.ts` exports 8 functions that duplicate private
implementations in `mcp-auth.ts`. Phase 2 deletes the dead exports.
This follow-up evaluates whether to consolidate the duplicate code
into a single implementation.

**Resolution options**: (a) consolidate into `auth-response-helpers.ts`
and import from `mcp-auth.ts`, (b) keep `mcp-auth.ts` private
implementations and document the rationale, (c) defer with rationale.

### Follow-up 2.5.2: Restructure ground-truth barrel hierarchy

54 barrel files across 16 subjects with 3 nesting levels. Phase 2
trims unused re-exports but preserves the structure. The nesting is
excessive for an app with no downstream consumers.

**Resolution options**: (a) flatten to 2 levels (subject + phase),
(b) keep 3 levels with trimmed barrels and document rationale,
(c) defer with rationale.

### Follow-up 2.5.3: Fix schema-emitter for unused generated exports

`generate-ground-truth-types.ts` emits `TOTAL_LESSON_COUNT`,
`GENERATED_AT`, and validation schemas that have zero runtime
consumers. The generator should not emit unused exports.

**Resolution options**: (a) fix generator to remove dead exports and
regenerate, (b) defer with rationale.

### Follow-up 2.5.4: Resolve cli/shared barrel dead-on-arrival

`src/cli/shared/index.ts` is a barrel with zero importers — all CLI
code uses deep imports. Phase 2 trims unused re-exports from the
barrel.

**Resolution options**: (a) delete the barrel entirely, (b) migrate
CLI imports to use the barrel consistently, (c) defer with rationale.

**Acceptance Criteria**:

1. Each follow-up has a documented resolution (actioned or deferred)
2. If deferred, owner has provided explicit rationale
3. Quality gates pass

## Consolidation

After all work is complete and quality gates pass, run
`/jc-consolidate-docs` to graduate settled content, extract reusable
patterns, rotate the napkin, manage fitness, and update the practice
exchange.
