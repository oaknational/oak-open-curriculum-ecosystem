# Napkin

## Session: 2026-02-24 (d) — SDK Workspace Separation Phase 5

### What Was Done

Completed Phase 5 of ADR-108 SDK workspace separation: tests, scripts,
config migration, and reviewer hardening. 13 findings triaged, 7 already
resolved, 6 implemented in 4 batches with review checkpoints.

**F1 (scope guard)**: Removed 4 stale allowlist entries from
`scripts/check-generator-scope.sh` pointing to deleted agent files.

**F4 (test split)**: Moved `writeMcpToolsDirectory` filesystem I/O test
from `typegen-core.unit.test.ts` to new
`typegen-core-file-operations.integration.test.ts`.

**F7 (path test)**: Verified already implemented and passing.

**F10 (barrel simplification)**: Removed duplicate exports (`paths`,
`components`, `PATH_OPERATIONS`, `OPERATIONS_BY_ID`, `PathOperation`,
`OperationId`) from runtime SDK `src/index.ts`. Re-exported from
`./types/index.js` to establish single canonical source.

**F18 (DI refactoring)**: Largest change. Introduced `GeneratedToolRegistry`
interface and `ToolRegistryDescriptor` (ISP-narrowed type). Created default
implementation (`generated-tool-registry.ts`). Modified `listUniversalTools`,
`isUniversalToolName`, and executor to accept injected dependencies.
Rewrote `universal-tools.unit.test.ts` to eliminate all `vi.mock`/`vi.hoisted`.
Updated 10 call sites across apps, SDK, and tests. Removed all `as` type
assertions from tests.

**F8 (resilience)**: Already documented in generation SDK README (lines 52-58).

**Type predicate fix**: Fixed `isToolName` stubs in 4 integration test files
to use proper `(value: unknown): value is ToolName =>` signatures.

**Max-lines fix**: Removed orphaned JSDoc block from `handlers.ts`.

### Key Decisions

- **`ToolRegistryDescriptor` over full `ToolDescriptorForName<TName>`**:
  The narrowed interface includes only fields the universal-tools layer
  accesses. This makes test fakes constructible without `as` assertions.
  Type-reviewer confirmed it's a proper supertype via Interface Segregation.
- **`isToolName` stubs use sentinel comparison**: `typeof value === 'string'
  && value === '__never__'` satisfies the type predicate requirement, uses
  `value` in the body (avoiding `noUnusedParameters`), and always returns
  false. Cleaner than `void value` or block body.
- **Orphaned JSDoc removal**: An orphaned `@param transport` JSDoc block was
  left behind from a prior refactor. `createMcpHandler` already had its own
  JSDoc. Removing saved 9 lines, fixing the max-lines violation.

### Patterns Learned

- **Type predicate stubs need body usage**: TypeScript's `noUnusedParameters`
  flags type predicate parameters even though they're referenced in the return
  type annotation. Use the parameter in a meaningful expression like
  `typeof value === 'string' && value === '__never__'` rather than just
  returning `false`.
- **`as const satisfies T` is the gold standard** for test data that must be
  both a literal type and structurally valid. The unit test uses
  `'get-key-stages-subject-lessons' as const satisfies ToolName`.
- **Interface Segregation eliminates assertion pressure**: When test fakes
  can't satisfy a complex generated type without `as`, extract a narrowed
  interface with only the consumed fields. This is not loss of information —
  it's correct scoping.
- **Check `noUnusedParameters` in tsconfig before assuming arrow function
  stubs compile**: `() => false` is clean but doesn't compile when the
  interface requires a parameter and the tsconfig enforces usage.

### Quality Gates

build 13/13, type-check 22/22, lint:fix 24/24, test 22/22, format clean,
markdownlint clean.

### Reviewer Summary

Final Phase 5 review: 4 specialists invoked (code-reviewer,
architecture-reviewer-barney, test-reviewer, type-reviewer). All APPROVED.
Non-blocking follow-ups: shared test stub extraction (DRY), test naming
hygiene (vi.fn in unit test file), redundant `in` check in list-tools.ts.

## Session: 2026-02-24 (c) — Architecture Review Remediation (N1-N6)

### What Was Done

Implemented all 6 findings from the architecture review remediation plan
plus the canonical plan update, completing all blocking architectural issues
identified by the four-reviewer sweep.

**N1**: Added `**/schema-cache/**` to `turbo.json` `type-gen` inputs (1 line).

**N2**: Extended `createSdkBoundaryRules('generation')` to cover
`type-gen/**/*.ts` and `vocab-gen/**/*.ts` in generation ESLint config.
Verified no existing `type-gen/` files import from `@oaknational/curriculum-sdk`.

**N3**: Created `@oaknational/type-helpers` core package (Option A).
Scaffolded following `@oaknational/result` conventions. Moved all 9
`typeSafe*` helpers. Both SDKs now re-export from the shared package.
Added to `LIB_PACKAGES` in `boundary.ts`. 11 unit tests pass.

**N4**: Created `/vocab` subpath on generation SDK, separating static graph
data and ontology from pipeline APIs. Rewired 6 runtime SDK files from
`/bulk` to `/vocab`. Graph-related types remain exported from `/bulk` for
generator function signatures.

**N5**: Flattened MCP tool generated directory structure, removing
`generated/data/` intermediate directories. Tool file depth reduced from
8 to 6 levels. Import paths shortened (`../../../../` to `../../`).
Modified 7 generator files, updated all barrel/index paths, fixed 3 test
files. All 26 tool files + stubs regenerated automatically.

**N6**: Broke generator bootstrap cycle in `generate-ai-doc.ts`. Static
imports from generated output replaced with dynamic `import()` inside
`main()`. `renderToolCatalog` made generic to preserve type safety.

**Canonical plan update**: Integrated N1-N6 into findings table, Phase 5,
Phase 6, and reverse-dependency inventory.

### Key Decisions

- **Type-helpers as core package** (not lib): Follows `@oaknational/result`
  pattern. Added to `LIB_PACKAGES` for boundary enforcement.
- **Graph types stay in `/bulk`**: Even though data values moved to `/vocab`,
  the types are return types of generator functions that remain in `/bulk`.
  Dual-export is correct.
- **MCP tool flattening removes 2 levels**: `generated/data/` removed. The
  `generated/` boundary between authored and generated is no longer needed
  because all files under `mcp-tools/` except `contract/` are generated.
- **Dynamic import for bootstrap cycle**: `import()` defers module loading
  to runtime. TypeScript still resolves types at compile time but this is
  acceptable because `doc-gen` depends on `type-gen` in Turbo.

### Patterns Learned

- **`typeSafeFromEntries` type annotation**: When entries have mixed value
  types, use `readonly (readonly ['x' | 'y', number | string])[]` not
  `readonly (readonly ['x', number] | readonly ['y', string])[]` — the
  latter creates incompatible tuple union.
- **`generateDataIndexFile` was a pure pass-through**: After flattening,
  the data barrel became unnecessary because `index.ts` imports directly
  from `./definitions.js`. One less generated file.
- **Generator modifications propagate automatically**: When changing
  import paths in generator files, the 26+ tool files don't need manual
  updates — `pnpm type-gen` regenerates them all.
- **StrReplace can fail on long multi-function blocks**: For large file
  edits, target smaller unique chunks instead of entire functions.

### Quality Gates

type-gen 22/22, build 22/22, type-check 22/22, test 22/22.

## Session: 2026-02-24 (b) — SDK Workspace Separation Phase 2

### What Was Done

Executed Phase 2 of the SDK workspace separation plan (ADR-108 Step 1).
Moved `type-gen/` (192 files), `schema-cache/` (2 files), and
`src/types/generated/` (106 files) from runtime SDK to generation
workspace. Created 10 subpath barrel files. Rewired ~70 runtime SDK
imports. Passed full quality gate chain.

### Key Decisions

- **Subpath exports one level deep**: e.g. `/api-schema`, `/mcp-tools`,
  `/search`, not `/api-schema/path-parameters`.
- **ESLint boundary pattern**: `@oaknational/curriculum-sdk-generation/*/**`
  blocks two-or-more levels, allows single-level subpath exports.
- **Named exports only**: `export * from` violates `no-restricted-syntax`
  rule; all barrels use explicit named exports.
- **`OakApiPathBasedClient` is generated**: Added to `typegen-core.ts`
  `createFileMap` so it survives `generate:clean`.

### Patterns Learned

- **When moving files between workspaces, ESLint rule overrides must move
  too**. The runtime SDK had `type-gen/**` and `src/types/generated/**`
  overrides that needed copying to the generation workspace. 270 lint
  errors appeared until this was done.
- **`vi.mock` paths must be updated when imports are rewired**. The
  `universal-tools.unit.test.ts` mock path was stale and inert after
  rewiring. Fixing it required a partial mock (`importOriginal`) to avoid
  breaking unrelated imports like `SCOPES_SUPPORTED`.
- **`*.config.ts` glob does not match `*.config.e2e.ts`**. The additional
  glob `*.config.e2e.ts` must be explicitly added to tsconfig includes.
- **Root barrel files with full re-exports easily exceed `max-lines`**.
  Keep the root barrel as a curated subset; consumers should use subpath
  imports.
- **`export * from` is banned by `no-restricted-syntax`**. Always use
  named exports in barrel files, even though it requires reading the
  target module to list all exports.
- **Stale vitest include globs are silent** because of
  `passWithNoTests: true`. Remove dead globs promptly.
- **Dead ESLint overrides for removed paths** add cognitive load and should
  be cleaned up immediately when files are moved.

### Mistakes Made

- Initially forgot to copy the ESLint rule overrides for `type-gen/` and
  `src/types/generated/` from the runtime SDK to the generation workspace,
  causing 270 lint errors.
- Updated `vi.mock` path without checking that the mock replaces ALL
  module exports, breaking `SCOPES_SUPPORTED`. Fixed by using partial mock
  with `importOriginal`.
- Created `vitest.config.e2e.ts` but didn't add `*.config.e2e.ts` to the
  tsconfig include, causing an ESLint parsing error.

### Reviewer Findings Summary

**Architecture reviewers**: All compliant. Fred found stale JSDoc import
paths in generator templates. Barney suggested merging `query-parser`,
`observability`, and `admin` subpaths into `search` (deferred). Betty
recommended generating barrel files (deferred). Wilma flagged
`generate:clean` atomicity risk and missing CI check for generated file
drift (both deferred).

**Specialist reviewers**: Code-reviewer approved with suggestions. Config
reviewer found orphaned E2E tests (fixed), dead ESLint overrides (fixed),
stale vitest globs (fixed). Test-reviewer found orphaned `vi.mock` (fixed).
Type-reviewer confirmed safe — no type widening detected.

## Session: 2026-02-24 (a) — SDK Workspace Separation Phase 0+1

### What Was Done

Executed Phase 0 and Phase 1 of the SDK workspace separation plan
(ADR-108 Step 1). Commit `86a71125`.

**Phase 0**: Captured reproducible baseline evidence
(`sdk-workspace-separation-baseline.json`). Counts: type-gen 192,
src 303, generated 106, runtime importing generated 56, SDK
workspaces 2 (no generation). Updated plan Section 4 baseline
from 302→303 (drift from dependency bump commit).

**Phase 1**: Full TDD cycle for SDK boundary rules.

1. RED: 6 unit tests for `createSdkBoundaryRules()` — all failed
   (`is not a function`).
2. GREEN: Implemented function in `boundary.ts`, exported from
   `index.ts`. 20/20 tests pass.
3. Scaffolded `packages/sdks/oak-curriculum-sdk-generation/` with
   10 config files following `oak-search-sdk` conventions.
4. Registered in `pnpm-workspace.yaml`, installed.
5. Applied `createSdkBoundaryRules('runtime')` to runtime SDK
   ESLint config.
6. Updated `turbo.json` — added `**/vocab-gen/**/*.ts` to
   `type-gen` inputs.
7. Final gate: `pnpm build` (12/12), `pnpm type-check` (19/19),
   lint all affected workspaces — clean.
8. Commit + 4 reviewer invocations.

**Reviewer findings addressed** (amended commit):
- Glob depth `**` not `*` for deep sub-path coverage (Fred)
- `@workspace/*` restriction added for parity (code-reviewer, Fred)
- Test helper type fixed: `Linter.RulesRecord` not
  `Record<string, unknown>` (test-reviewer)
- Fail-fast throws instead of silent empty returns (test-reviewer)
- 5 new test cases: severity, ADR-108 reference, self-restriction,
  `@workspace/*` (test-reviewer)
- Baseline file relocated from repo root to plan-adjacent
  directory (code-reviewer, Fred)
- `test:watch` script added for convention parity (config-reviewer)
- Pre-existing `_libName` unused parameter fixed (code-reviewer)

**Cross-references**: Added bidirectional links between
`sdk-workspace-separation.md` and
`architectural-enforcement-adoption.plan.md`.

### Patterns Learned

- `@typescript-eslint/no-restricted-imports` `group` patterns
  use minimatch: `*` matches one segment, `**` matches deep paths.
  Always use `**` for package import restrictions.
- `@workspace/*` aliases are a bypass vector for boundary rules.
  All boundary rule sets must include this restriction.
- Pre-commit hooks running the full quality gate suite (type-check,
  lint, test across all workspaces) are a powerful final safety net
  but add ~50s to commit time. The trade-off is worth it for
  structural changes like new workspace additions.
- `pnpm install` with `frozen-lockfile` (CI default) rejects new
  workspace registrations — use `--no-frozen-lockfile` for the
  initial install after adding a workspace.
- TSDoc `@` in package names (e.g. `@oaknational/...`) triggers
  tsdoc-characters-after-block-tag warnings. Escape with `\@`.
- Baseline evidence files belong adjacent to the plan they serve,
  not at the repo root.

### Quality Gates

All pass: build 12/12, type-check 19/19, lint clean,
25/25 eslint plugin tests, pre-commit hooks pass.

## Session: 2026-02-23 (g) — Document Cohesion and Archival

### What Was Done

1. Audited cohesion across prompt, canonical plan, and pre-phase1 decisions
2. Reviewed both against directives (rules.md, testing-strategy.md, schema-first, AGENT.md)
3. Archived `sdk-separation-pre-phase1-decisions.md` to `archive/completed/`
4. Updated canonical plan Section 12 link to archived path
5. Updated prompt: added two-pipeline context to "Next Execution Targets",
   nuanced search SDK relationship in "What We Have", added ADR-108 to
   "Immediately Relevant" documents, added pre-phase1 to archive references
   in bootstrap checklist
6. Updated plans README: added archived pre-phase1 entry to documents table

### Key Insight

Decision rationale (WHY, alternatives, trade-offs) belongs in archive
reference, not execution guidance. The canonical plan has the WHAT (decisions)
and execution phases. The prompt + canonical plan are now self-sufficient
entry points — a fresh session can bootstrap without reading the pre-phase1 doc.

### Pattern Learned

When archiving, verify ALL cross-references point to the new location. Four
files referenced the pre-phase1 doc — all needed updating. Search for the
filename before deleting the original.

## Session: 2026-02-23 (f) — Two-Pipeline Architecture Documentation

### What Was Done

Updated three documents to integrate the API vs bulk data pipeline insight
into the SDK decomposition architecture:

1. **sdk-separation-pre-phase1-decisions.md**: Added "Architectural rationale:
   two pipelines, one generation workspace" subsection under D1. Documents the
   API pipeline (OpenAPI → types/Zod/MCP) and bulk pipeline (JSON files →
   bulk types/extractors/ES mappings/vocab), their different inputs, change
   triggers, and consumers.

2. **sdk-workspace-separation.md**: Updated D1 (Section 2), added two new
   findings to Section 5 (pipeline partitioning, search SDK serves bulk data),
   updated Section 7 target state diagram with pipeline annotations, updated
   Section 12 D1 summary.

3. **ADR-108**: Added "Two Data Pipelines" subsection to Context, updated WS2
   to show both pipelines, updated WS4 consumers, added "Split the two
   pipelines into separate workspaces?" to the "Why not five?" section, updated
   Step 1 phased execution description.

### Key Insight

The curriculum SDK was designed for API access; the search SDK shifted to bulk
download data. These are genuinely separate data pipelines with different
inputs, triggers, and consumers. They share the generation workspace but are
internally partitioned. The connection between them at runtime is only at the
MCP application layer (aggregated tools).

### Pattern Learned

When documenting architectural boundaries, capture not just what moves where,
but *why* the boundary exists in terms of data flow. The two-pipeline model
explains the boundary better than "generation vs runtime" alone.

## Session: 2026-02-23 (e) — Cross-Query Search Quality Investigation

### What Was Done

Investigated single-word cross-subject lesson queries to characterise
the search quality problem. Ran "apple", "tree", "mountain" through
the MCP search tool and analysed results, scores, and highlights.

**Key findings**:

- **Two compounding problems**: (1) volume — ALL queries return entire
  index (8k–10k results), no min_score threshold; (2) ranking — short
  words (3–5 chars) fuzzy-match to common English words via
  `fuzziness: 'AUTO'`
- "apple" (5 chars) → "apply" (1 edit) — PE lessons dominate, only
  1/5 top results relevant
- "tree" (4 chars) → "three" (1 edit: insert h) AND "true" (1 edit:
  e→u) — 10,000 results (index cap!), highlights confirm "three"
  matches in non-tree lessons
- "mountain" (8 chars) → no common word within 2 edits — good top-3
  results but still 8,277 total
- Score ranges (0.03–0.06) indicate marginal-to-weak matches across
  the board; no clear signal-to-noise separation

**Documentation updates**: Comprehensive rewrite of
search-results-quality.md with all three queries, pattern analysis,
impact analysis, root cause chain, five prioritised remediation
options. Updated 5 interconnected files (quality plan, session prompt,
README, roadmap, high-level plan) to function as standalone entry
points for the next session.

**Consolidation**: All plans and prompts verified up to date. No
documentation extraction needed from active plans (technical detail
is execution context, not permanent architecture). Napkin 362 lines
(under 800 threshold). Distilled.md — no entries to remove.

### Patterns Learned

- Running the same class of query with different word lengths
  immediately reveals whether a problem is universal (volume) or
  length-dependent (ranking). Three queries was the right number:
  one short with fuzzy poison ("apple"), one short with different
  fuzzy poison ("tree"), one long without fuzzy poison ("mountain").
- The "tree"→"three" match is arguably worse than "apple"→"apply"
  because "three" appears in EVERY lesson (counting, numbering,
  sequencing). This produces 10,000 results vs 8,329 for "apple".
- Elasticsearch highlight data is essential for diagnosing fuzzy
  match pollution — the `<mark>three</mark>` tags in "tree" results
  made the problem unambiguous.
- Five interconnected documents (plan, prompt, README, roadmap, HLP)
  need to be updated atomically or they drift. Doing them all in
  one pass is better than incremental updates across sessions.

---

## Session: 2026-02-23 (d) — Documentation Follow-On B7, B9, B10

### What Was Done

Implemented 3 documentation follow-on items from the onboarding remediation Track B plan:

- **B9**: Added "Known Constraints and Limitations" section (8 subsections) to `openapi-pipeline.md`. Cross-referenced from `extending.md`.
- **B7**: Created `docs/curriculum-guide.md` — plain-language curriculum structure for non-technical audiences. Cross-referenced from `docs/README.md`, `onboarding.md`, `VISION.md`.
- **B10**: Added "Sustainability and Scaling" section to `practice.md` — volume, consolidation mechanisms, intentional repetition trade-off, scaling constraints, restructuring triggers. Updated ADR-119 file count from "500+" to "1,000+".

All items in `onboarding-documentation-follow-on.plan.md` now marked complete
(archived to `developer-experience/archive/completed/`).

### Reviewer Findings Addressed

- **docs-adr-reviewer**: Fixed broken relative link in ADR-119 (used `../../` instead of `../../../`). Added Religious Education coverage gap, Sequence explanation note, and subject count clarification to curriculum guide. Added MRR source citation.
- **architecture-reviewer-betty**: Added search pollution and context-window exhaustion as scaling constraints. Added leading mechanical indicators (>5 equal-weight search hits, context exhaustion) alongside the trailing human indicators. Loosened ADR-119 anchor link to point to practice.md root rather than a specific header.

### Patterns Learned

- **Relative link depth matters**: From `docs/architecture/architectural-decisions/`, `../../` goes to `docs/`, not the repo root. Always verify by counting directory levels. The same ADR file already had correct `../../../` links on other lines.
- **Non-technical guides need careful scope**: When the mermaid diagram included "Sequence" (an API implementation detail), the docs reviewer correctly flagged it as confusing for non-technical readers. Simplified the diagram and added a developer-only note.
- **Subject count discrepancies**: The ontology `subjects` array (13) and thread `subjectsCovered` (16) differ — the thread data covers 3 additional subjects. Must reconcile when quoting counts.
- **Trailing vs leading indicators**: The architecture reviewer's distinction between trailing indicators (human reports of intimidation) and leading mechanical indicators (search hit counts, context exhaustion) is a valuable framing for sustainability monitoring.

---

## Session: 2026-02-23 (c) — Onboarding Remediation A1-A8

### What Was Done

Implemented all 8 merge-blocking onboarding remediation workstreams (A1-A8)
from the multi-audience onboarding review plan. All 7 cross-cutting findings
(flagged by 4+ of 8 reviewers) fully addressed. All 3 audiences previously at
CRITICAL GAPS (junior devs, product owners, CEOs) now at PASS.

**A1 (Correctness Sweep)**: Fixed broken institutional-memory.md link in
README, added prerequisites sections (Node.js 24.x, pnpm, gitleaks), created
.nvmrc, fixed .env.example misleading Elasticsearch comment and path, fixed
script-documentation drift in 5 files (subagents:check added to pnpm make/qg
descriptions), fixed pnpm version 9.x→10.x, fixed double-dash typo, fixed
ADR-029 stale references, fixed ADR index Quick Navigation labels, resolved
CONTRIBUTING.md E2E credential contradiction.

**A2 (Human-First Structure)**: Restructured onboarding.md — added "What's
Different About This Repo" section with 6 principles and rationale, defined
jargon inline (MCP, OpenAPI, ADR, SDK, TDD, Zod, workspace), added default
path recommendation, Day 1 Essentials vs Reference separation, time estimates,
"You're Ready When..." checklist, architecture diagram, fix type safety
guidance in quick-start.md, added as-const exception to rules.md.

**A3 (Workflow)**: Created docs/development/workflow.md — full dev lifecycle
(branch, TDD, local gates, commit, push, PR, CI, AI review, human review,
merge, release), CI-vs-local gap table, quality metrics.

**A4 (Strategic Entry)**: Added plain-language README opening, prominent
VISION.md link, strategic/leadership path in onboarding, mission-framing
paragraph, Vision section in docs/README.md.

**A5 (Vision Translation)**: Enhanced VISION.md capability table with
user-value descriptions and evidence column, added MRR baseline metrics
table, expanded Aila section with 3 concrete examples, added Last Updated
date.

**A6 (Practice Explanation)**: Added section 12 to onboarding.md — human-facing
practice explanation (sub-agent table, when they run, napkin/distilled
explanation, human expectations, AI review in PR lifecycle, manager summary
with ADR-119 evidence). Updated README practice section with "single engineer
+ AI" evidence. Added practice section to docs/README.md.

**A7 (ADR Hygiene)**: Added "Start Here: 5 ADRs in 15 Minutes" section to ADR
index (ADR-029, 030, 031, 048, 107). ADR-029 fixes and Quick Navigation
relabelling done in A1.

**A8 (Extension Points)**: Created docs/development/extending.md — guidance for
adding MCP tools (generated and aggregated), search indices, SDK helpers, core
packages.

### Reviewer Findings and Fixes

Four reviewers invoked in parallel (code-reviewer, docs-adr-reviewer,
config-reviewer, onboarding-reviewer). All returned APPROVED with fixes:

1. extending.md: ADR-041 link was wrong (`041-standard-monorepo-layout.md`
   → `041-workspace-structure-option-a.md`) — FIXED
2. build-system.md: `pnpm check` description missing subagents:check — FIXED
3. build-system.md: `pnpm test:all` showed turbo command instead of
   sequential pnpm calls — FIXED
4. .cursor/rules/no-type-shortcuts.mdc: as-const exception not propagated
   from rules.md — FIXED
5. onboarding.md: Added handoff from 3-ADR list to "5 ADRs in 15 Minutes"
   in ADR index — FIXED

### Patterns Learned

- When adding `subagents:check` to one command description, check ALL
  command descriptions on the same page — the config-reviewer caught that
  `pnpm check` was missed despite being on the same page as `pnpm make` and
  `pnpm qg`
- ADR file names do not always match their conceptual titles — ADR-041 is
  called `041-workspace-structure-option-a.md`, not the more intuitive
  `041-standard-monorepo-layout.md`. Always verify with glob.
- When adding `as const` exception to rules.md, also propagate to the
  always-applied cursor rule in `.cursor/rules/no-type-shortcuts.mdc` —
  the code-reviewer correctly identified that the cursor rule is injected
  into every AI interaction and would cause false-positive violations
- VISION.md "7 different curriculum structures" was slightly misleading — 7
  is the count of Elasticsearch indices, not structures; the actual
  structures are 4 (lessons, units, threads, sequences)

### Quality Gates

markdownlint:root, format:root, lint:fix all pass.

## Session: 2026-02-22 (d) — Consolidation and Architecture Reviews

### What Was Done

- Ran `/consolidate-docs` after completing widget Phase 5 resilience hardening
- Invoked all four architecture reviewers (Barney, Betty, Fred, Wilma)
- Fixed Wilma's medium finding: added try/catch around delegated click
  handler in `widget-script.ts` (error containment for `openOnOakWebsite`)
- Added Barney's suggestion: regression test in `renderer-contracts.integration.test.ts`
  asserting no renderer produces `onclick` attributes and all use `data-oak-url`
- Updated permanent docs:
  - README "Known Resilience Gaps" → "Resilience Hardening (Phase 5)" with
    current state (all gaps fixed)
  - README `esc()` description: removed `onclick` reference
  - README four-way sync description: expanded to describe full chain
  - README edge case table: "Unknown scope" → "Fail-fast: explicit error message"
- Updated roadmap: 3h Widget stabilisation → COMPLETE
- Updated session prompt: removed widget from pre-merge blockers, updated
  status to COMPLETE, reduced to one merge blocker (SDK workspace separation)
- Distilled new patterns from napkin sessions 2026-02-17 to 2026-02-22:
  - Widget: `onclick` HTML-decode exploit, `JSON.stringify` for generated JS,
    `expect.any(String)` → `toHaveProperty`
  - Architecture: TSDoc `@see` → ADRs not plans, "noauth" semantic distinction
  - Testing: refactoring TDD RED = compiler errors, compile-time assertion
    consumption requirement
- Pruned distilled.md: removed fail-fast ES credentials pattern (now in
  ADR-116) and per-request transport pattern (now in ADR-112)
- Archived napkin (1220 lines) to `archive/napkin-2026-02-22.md`, started fresh

### Architecture Reviewer Findings

**Barney** (simplification): Compliant. Suggests:
- Explore fixture lacks Zod runtime validation (only TypeScript shaping)
- Co-locate `openOnOakWebsite` with delegated handler to remove ordering coupling
- Consider single-source generation for renderer dispatch (vs 4-way sync tests)

**Betty** (systems-thinking): Compliant. Positive trajectory across all
dimensions. No issues found.

**Fred** (principles/ADR): Compliant. No violations. Minor observations:
- CTA HTML `id` unescaped (trusted boundary, near-zero risk)
- Zod validation style inconsistency (`safeParse` vs `parse` in contract tests)

**Wilma** (resilience): Issues found:
- [FIXED] Delegated click handler lacked try/catch
- [LOW] Null guards in `forEach` callbacks for browse/suggest
- [DELEGATE] URL sanitisation for `data-oak-url`/`href` → security-reviewer

### Quality Gates

All pass: type-check, lint:fix, test (39 passed), test:ui (20 Playwright).

## Session: 2026-02-22 (e) — Documentation Accuracy Improvements

### What Was Done

Executed all 6 workstreams from the documentation-accuracy-improvements plan
(prerequisite for architectural enforcement tooling).

**Workstream A (BLOCKING — boundary definitions, 5 files):**
- ADR-041: Replaced stale workspace list (removed duplicate packages/libs,
  removed deleted packages/providers), replaced vague dep flow with canonical
  import matrix table, fixed two broken links to archived plans, updated
  Consequences to past tense, normalised status to "Accepted (Revised)",
  added revision date
- Enforcement plan: Replaced ambiguous linear shorthand with canonical import
  matrix, added ADR-041 and architecture README citations
- Architecture reviewer template: Fixed valid patterns (sdks can import from
  core, libs, and other sdks), added circular SDK-to-SDK as invalid pattern,
  fixed checklist to reference Import Direction Rules
- Architecture README: Added cross-SDK import allowance

**Workstream B (mutation testing plan):**
- Fixed broken relative link (doubled path)
- Replaced stale 2025-09-24 audit with re-baseline checklist + prerequisite gate
- Moved historical pilot to appendix
- Explicitly positioned mutation testing as supplementary signal (Phases 0-2)

**Workstream C (ADR-119 / practice.md rationalisation):**
- Trimmed ADR-119's three-layer, feedback loops, and self-teaching sections
  to summaries with delegation to practice.md
- Enriched practice.md with architectural enforcement and cross-agent
  standardisation concepts (previously unique to ADR-119)
- Added canonical-source note to reference-docs progression application

**Workstream D:** Split cross-agent plan into committed (2a) vs conditional (2b)
sections with explicit triggers. Split success metrics to match.

**Workstream E:** Added date caveat to research document inventory counts.

**Workstream F:** Created collection README with read order and dependencies.

### Reviewer Findings

All three final reviewers (code-reviewer, architecture-reviewer-fred,
docs-adr-reviewer) returned COMPLIANT. Two reviewer-driven fixes applied:
- Architecture reviewer checklist at line 192 was missing sdks reference
- ADR-041 needed explicit revision date alongside "Revised" status

### Patterns Learned

- ADR-041's "Accepted (Revised)" follows ADR-055 precedent — use for
  documentation entropy fixes where the core decision is unchanged
- docs-adr-reviewer caught that Consequences sections should use past tense
  for completed actions — stale future tense creates false impression of
  outstanding work
- provider-system.md exists but is stale (references deleted
  @oaknational/mcp-providers-node) — flagged for separate cleanup pass

### Quality Gates

markdownlint:root and format:root both pass.

## Session: Search Snagging Implementation (2026-02-22)

### Track C: Schema Conformance Fix (Snag 5)

**Root cause**: `openapi-zod-client` with `strictObjects: true` generates
`.strict().and(.strict())` for OpenAPI `allOf` schemas. Each `.strict()`
rejects the other side's properties, making the intersection impossible
to validate. Real API data with `{order, type, content}` answers fails.

**Fix location**: `transformZodV3ToV4` in
`packages/core/openapi-zod-client-adapter/src/zod-v3-to-v4-transform.ts`

**Fix approach**: Two-pass regex in the v3-to-v4 post-processor:
1. Remove `.strict()` before `.and(` (left side)
2. Remove `.strict()` inside `.and()` argument (right side)

**Key learnings**:
- Adapter package must be rebuilt (`pnpm build`) before `pnpm type-gen`
  picks up changes — the SDK consumes the built output, not source
- `[\s\S]*?` in replacement regex: be careful with `.and($1$2)` — if $2
  captures the closing `)`, adding another `)` in the replacement string
  produces double parens
- Test assertions with `not.toMatch(/regex/)` can false-positive when the
  regex matches content *outside* the intended scope (e.g., matching
  `.strict()` from a different union member beyond the `.and()` call)

### Lint Fixes

- `isCompletionQuery` type guard: cyclomatic complexity 9 > 8 — extract
  `isNonNullObject` helper to reduce branching
- `suggest` function: 57 lines > 50, complexity 9 > 8 — extract
  `clampLimit`, `resolveIndexKind`, `buildCompletionClause` helpers
- `resolveIndexKind`: must use braces on `if` returns (curly rule)

### Logger Usage Finding

Two logger instances in the SDK deviate from established pattern:
- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`
- `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts`

Issues: custom inline stdout sink (`console.log`) instead of
`createNodeStdoutSink()`, empty env `{}` instead of `process.env`,
hardcoded version `'1.0.0'`. Module-level singletons rather than
injectable via DI. Not a bug but loses OTEL metadata and prevents
consumer configuration. Recorded in search-snagging.md as related
finding.

### Consolidation Notes

- search-snagging.md: updated all 5 snag statuses to "completed",
  status line to "IMPLEMENTED", added implementation notes section
- semantic-search.prompt.md: updated snagging status entries
- roadmap.md: updated snagging to "IMPLEMENTED"
- `.strict().and(.strict())` fix pattern added to distilled.md

### Logger Fixes Applied (2026-02-23)

Both SDK logger deviations fixed via TDD:
- `response-augmentation.ts`: Uses `createNodeStdoutSink()` + `buildResourceAttributes(process.env, ...)`
- `client/middleware/response-augmentation.ts`: Same fix + DI via optional `Logger` param in factory
- Integration tests: 4 tests covering logger injection and error containment
- Pattern: logger architectural bug → fix-via-TDD + `no-console` enforcement plan

### Snag 1 Suggest Validation (2026-02-23)

Bare `search(scope:'suggest')` without subject/keyStage was hitting
ES "Missing mandatory contexts" error. Root cause: ES completion
index defines `subject` and `key_stage` as mandatory contexts.
Fix: early validation in `suggest()` requiring at least one context.
Test updated from "omits contexts when not provided" to "returns
validation error when neither provided".

### End-to-End Smoke Testing (2026-02-23)

All 5 snagged tools verified against running HTTP MCP server (rebuilt
packages first — tsx runs app source but consumes built SDK dists).
Additionally verified: get-ontology, get-help, get-subjects, get-key-stages,
browse-curriculum, explore-topic, search(lessons/units/threads/sequences),
fetch(lesson/unit/subject/sequence/thread), get-thread-progressions,
get-prerequisite-graph, get-subjects-key-stages, get-subjects-years,
get-key-stages-subject-units, get-key-stages-subject-lessons.

### no-console Enforcement Plan

Created `no-console-enforcement.plan.md` — post-public-repo,
pre-public-alpha. Add `no-console: 'error'` to shared ESLint config
and fix ~110 files (largely mechanical, nuanced for CLI/build/widget).
Added to roadmap.

## Session: 2026-02-23 (b) — Plan Modernisation and Consolidation

### What Was Done

- Modernised `quality-and-maintainability/` and `architecture/` plan
  directories per prompt; merged into single `architecture/` directory
- Archived 5 completed plans to `completed-plans.md`
- Iceboxed 3 speculative plans with stubs
- Consolidated overlapping config/DI plans into
  `config-architecture-standardisation-plan.md`
- Condensed ESLint subdirectory (5 files) into
  `architectural-enforcement-adoption.plan.md` in
  `agentic-engineering-enhancements/`
- Fixed ADR-078 stale reference to archived plan
- Updated all cross-references across active docs
- Created `architecture/README.md` for the consolidated directory

### Icebox and External Scan

- Icebox (10 files): all healthy, no deletions needed
- `cross-agent-standardisation.md` already a clean supersession stub
- `openapi-pipeline-framework.md` mentions deleted
  `pipeline-enhancements/` as historical provenance — acceptable
- OOC API wishlist: well-structured, fixed numbering collision
  (two files numbered 20) — renamed `20-ontology-and-graphs-api-proposal.md`
  to `22-ontology-and-graphs-api-proposal.md`, updated index and 3
  cross-references (ontology-data.ts, vocabulary-graph-generator.ts,
  DATA-VARIANCES.md)
- Castr collection: thorough contract documentation, no issues

### Consolidate-Docs Sweep

- Napkin: 203 lines, well under 800-line threshold
- Distilled.md: removed "noauth" semantic entry — now fully
  documented in ADR-113
- Experience files: ~50 files could be reduced to reflective stubs
  (technical patterns already in permanent docs) — noted for future
  pass, too large for this session
- Plans scan: 6 medium-risk plans have architectural content that
  ideally belongs in permanent docs — all are active plans with
  ongoing work, extraction premature until completion
- One reported broken link in mutation-testing plan was a false
  positive (relative path resolves correctly)

### Information Placement Discipline (23 Feb 2026)

Extracted to distilled.md ("Documentation and Markdown" section).
Applied: moved consumer model and boundary invariants from
sdk-workspace-separation plan to ADR-108.

### Deferred Dependency Updates (24 Feb 2026)

Batch dependency update bumped 28 packages within major version.
The following were intentionally deferred:

| Package | Current | Latest | Reason |
|---|---|---|---|
| `eslint` | 9.39.1 | 10.0.2 | ESLint 10 migration (dedicated task) |
| `@eslint/js` | 9.39.1 | 10.0.1 | Coupled to ESLint 10 |
| `eslint-plugin-sonarjs` | 3.0.5 | 4.0.0 | Coupled to ESLint 10 |
| `globals` | 16.5.0 | 17.3.0 | ESLint config dependency; defer with ESLint 10 |
| `@types/node` | 24.10.x | 25.3.0 | We target Node 24; stay on latest 24.x |
| `zod` (openapi-zod-client-adapter) | 3.25.76 | 4.3.6 | Zod 3-to-4 migration; pinned exactly |
| `openapi-typescript` | 7.10.1 | 7.13.0 | Affects type-gen pipeline (dedicated task) |
| `openapi-fetch` | 0.15.0 | 0.17.0 | Coupled to openapi-typescript |
| `vite-tsconfig-paths` | 5.1.4 | 6.1.1 | Vite ecosystem update (dedicated task) |

ES SDK 9.3 type changes required fixes:
- `ClientOptions` ESM barrel missing re-export — derived from
  `ConstructorParameters<typeof Client>[0]` instead of deep import
- `RetrieverContainer` now `ExactlyOne<>` union — tests need
  `'standard' in entry` narrowing for `RRFRetrieverEntry`
- `RerankingRetrieverContainer` removed — `text_similarity_reranker`
  now natively in `RetrieverContainerExclusiveProps`

### SDK Workspace Separation Phase 4 Complete (24 Feb 2026)

Phase 4.3-4.4 executed: 22 search CLI files rewired from
`@oaknational/curriculum-sdk/public/bulk` to
`@oaknational/curriculum-sdk-generation/bulk`. Dead `public/bulk.ts`
facade deleted. Export entries removed from runtime SDK package.json.

Key learnings:
- **TS2209 rootDir ambiguity**: When `tsconfig.build.json` extends a
  base with wide `include` but narrows its own `include` to `src/**/*`,
  tsc may not infer `rootDir` for export map resolution. Fix: explicit
  `rootDir: "./src"` in build config.
- **Moved files may have reverse deps on helpers**: The bulk generators
  imported `typeSafeEntries` from runtime SDK's `type-helpers.ts` via
  relative path. After moving, the import path broke. Fix: create a
  generation-workspace copy (one function, documented justification).
- **Test coverage migration**: When removing an import from a moved test
  file, check whether the removed test should be recreated in the
  destination workspace. The ontology budget test (70KB check) was lost
  until the test reviewer caught it.
- **Stale tsup entries**: After moving `src/bulk/` to generation, the
  runtime SDK's `tsup.config.ts` still had `src/bulk/**/*.ts` as an
  entry. It matched nothing silently — removed.
- **Turbo stale cache**: After file moves and config changes, turbo may
  report false test failures from stale cache. `--force` or clean build
  resolves.

Reviewer findings addressed:
- test-reviewer: ontology budget test recreated in runtime SDK
  (blocking finding resolved)
- config-reviewer: stale tsup entry removed (non-blocking)
- All 4 reviewers invoked: code, architecture-barney, test, config
