# Napkin

## Session: 2026-02-25 — Onboarding Review and Documentation Restructure

### What happened

Invoked onboarding-reviewer to audit the onboarding journey from
root README through to contribution-ready state. The reviewer
produced a false positive: claimed 9 documents were missing, but
all 9 existed at their correct paths (moved during the
`docs/development/` → `docs/engineering/` restructure in commit
`5c8bfc2d`). This wasted time investigating a non-issue.

After validating, executed the user's three-part request:
(1) Fixed start-right prompts/commands so commands are thin
pointers to prompts and prompts contain the structured content.
(2) Dissolved `docs/foundation/onboarding.md` — integrated
genuinely unique content (Ready When checklist, domain ADR
handoffs, Known Gate Caveats) into quick-start.md and
troubleshooting.md. Updated 15+ files that referenced onboarding.md.
(3) Fixed `<repo>` placeholder in quick-start.md and stale
`docs/development/` directory listing.

Follow-on items completed in same session:
(4) Updated ADR count from "114" to "116" in README, VISION,
and reference-docs (4 locations).
(5) Fixed CONTRIBUTING.md "Use unknown at boundaries" wording
to clarify that unknown is transient, not a resting type.
(6) Deleted `docs/governance/ai-agent-guide.md` — entirely
redundant with start-right → AGENT.md path. Updated 8+
active references. Only unique content (Kairos time, 4-layer
memory table) already covered by practice.md.
(7) Fixed rules.md Architectural Model section — had inaccurate
package descriptions (listed env, result in libs instead of
core). Added cross-reference to AGENT.md for full listing.

### Patterns noted

- Sub-agent reviewers can produce false positives on file existence
  checks. Always verify claims before acting on them.
- "Onboarding" is a process, not a document. Good documentation
  and organisation IS onboarding. A standalone "onboarding document"
  tends to duplicate content from README, quick-start, and other
  docs.
- When dissolving a document, trace ALL references (grep the repo)
  before deleting. Archive/plan references are historical records
  and should not be updated.
- Commands should be thin pointers to prompts, not duplicates.
  The prompt is the source of truth; the command is a
  platform-specific entry point.

---

## Session: 2026-02-25 — Plan Handoff Preparation

### What happened

Updated `release-plan-m1.plan.md` to function as a standalone entry
point for the next session. Added "Getting Started" and "Current State"
sections. Accounted for parallel removal of `docs/foundation/onboarding.md`
by another agent — O11 cancelled, O12 retargeted to HTTP server README,
O8 demoted to Batch E. Fixed item counts and cross-references for
consistency.

### Patterns noted

- When a file is being removed by a parallel agent, scan all plan items
  that reference it as a target. Three possible dispositions: cancel
  (target gone, fix no longer needed), retarget (useful content, different
  location), or demote (low value, defer).
- Plan handoff sections must be self-contained: tell the next agent
  exactly which files to read and where to start. Don't assume prior
  context or access to conversation history.

---

## Session: 2026-02-25 — M1 Release Fixes Phase 1 Execution

### What happened

Executed Phase 1 of M1 release fixes (F1, F2, F3, F21, F22, F23,
F24) — 7 critical/high architecture and resilience fixes from the
four-reviewer consolidation. All implementations complete. Quality
gates partially run (type-check, lint, test pass; e2e/ui/smoke not
run). Specialist reviewers invoked (code, arch-barney, arch-fred,
arch-wilma, security). Self-assessed against testing-strategy.md
and rules.md — identified remediation items. Consolidated into
canonical release plan with §R remediation section as top priority
for next session.

### Changes made

1. **F1**: Rewired all oak-search-sdk imports from curriculum-sdk
   to sdk-codegen. Two runtime functions kept per ADR-108 Step 1.
2. **F2**: Added `createSdkBoundaryRules('search')` role. Used
   `paths` (not `patterns`) for bare package blocking — patterns
   matched prefixes and incorrectly blocked allowed subpaths.
3. **F21**: Added SDK zone to coreBoundaryRules (TDD applied).
4. **F22**: Switched result and type-helpers to coreBoundaryRules
   with coreTestConfigRules for test/config files.
5. **F3**: Host header validation via extractHostname + allowedHosts
   threading. 403 for disallowed hosts.
6. **F23**: try/catch around createApp with log + exit(1).
7. **F24**: response.ok check with DI (FetchFn parameter). 4 unit
   tests.

### Patterns noted

- `no-restricted-imports` `paths` vs `patterns`: `paths` matches
  exact package names; `patterns` with `group` uses minimatch which
  matches prefixes. Use `paths` when you want to block the bare
  import but allow subpath imports (e.g. block `@oaknational/pkg`
  but permit `@oaknational/pkg/public/foo.js`).
- TDD gaps are costly: F23 and F3 were implemented before tests,
  producing untested paths and test-follows-implementation ordering.
  The remediation cost (writing tests after the fact, plus the
  self-assessment overhead) exceeds the original TDD cost.
- `parsePrmBody` pattern for Supertest response bodies: create a
  typed interface + type guard function to safely narrow `unknown`
  response bodies without `as` assertions. Each distinct response
  shape needs its own guard.
- Threading config through multiple layers (security config →
  bootstrap → OAuth setup → route handlers) requires touching
  multiple function signatures — plan the threading path before
  starting implementation.

### Remediation identified (for next session)

1. R1: ~14 `as` assertions in 2 test files
2. R2: F23 startup failure path untested
3. R3: Remaining quality gates (test:e2e, test:ui, smoke:dev:stub)
4. R4: Result pattern for deriveSelfOrigin/fetchUpstreamMetadata (P2)

---

## Session: 2026-02-25 — Phase 7 Merge Readiness (COMPLETE)

### What happened

Executed Phase 7 of SDK workspace separation plan. Full 12-gate quality
chain passed from clean. Codegen determinism verified (zero diff on re-run).
Implemented `scripts/check-generated-drift.sh` per F16, integrated into CI
and local gates. 8 specialist reviewers invoked — all approved. Drift check
subsequently removed: redundant with `pnpm check` (clean+build regenerates;
diffing after that is meaningless) and caused `pnpm check` to fail.

### Patterns

- **Script-based checks must fit their context**: `pnpm check` runs clean+build.
  Running codegen again and diffing against git adds nothing — the files were
  just regenerated. A drift check only makes sense where committed files are
  *not* freshly regenerated (e.g. pre-commit on dirty tree). Removed entirely.

---

## Session: 2026-02-25 — Consolidation (Typegen Plan, Codegen README)

### What happened

Ran `/jc-consolidate-docs` on sdk-workspace-separation, typegen plan,
roadmap, high-level-plan, and semantic-search prompt.

### Changes made

1. **Typegen vs codegen** — extracted naming convention from completed
   Cursor plan to `packages/sdks/oak-sdk-codegen/README.md` (new section).
   Archived plan to `.agent/plans/semantic-search/archive/completed/
   typegen-vs-codegen-semantic-split.md`. Deleted `.cursor/plans/
   typegen_vs_codegen_semantic_split_623def28.plan.md`.
2. **Codegen README** — updated status to Phases 0–6 complete.
3. **Roadmap** — added typegen-vs-codegen-semantic-split to completed list.
4. **High-level-plan** — Last Updated 2026-02-25.

### Patterns noted

- Completed Cursor plans are safe to delete once documentation is
  extracted to permanent locations (README, ADR).

---

## Session: 2026-02-25 — Self-Ref Fix, code-generation Rename, Consolidation Docs

### What happened

Three tasks: (1) fixed `/jc-consolidate-docs` and distillation
skill to make explicit that extracting to permanent docs is the
primary size-management strategy for `distilled.md`;
(2) diagnosed and fixed 3 test failures from self-referencing
package imports; (3) renamed the `code-generation` turbo task/command
to `sdk-codegen` across the entire repo.

### Changes made

1. **Consolidation command & distillation skill** — updated
   step 5 and the "Prune" section to clearly state that
   extraction to permanent docs (ADRs, READMEs) is the primary
   mechanism, not just deduplication.
2. **Self-referencing import fix** — 17 files in `sdk-codegen`
   had `import ... from '@oaknational/sdk-codegen/bulk'` (their
   own package name). TypeScript type-check passes because it
   resolves via the `types` condition; tsup treats it as
   external. But at test runtime, Node.js resolves through
   `exports` → `dist/` which fails. Converted all to relative
   imports. This was latent — masked by turbo cache until the
   Phase 6 rename forced a cache miss.
3. **`code-generation` → `sdk-codegen` rename** — turbo.json task,
   root and workspace package.json scripts, `.husky/pre-push`,
   cursor rules, agent directives, ~100+ active docs/ADRs/
   plans/source files. Directory paths (`code-generation/codegen.ts`)
   and archived files left unchanged.

### Patterns noted

- Self-referencing imports within a package are a trap:
  TypeScript and tsup don't catch them, only runtime does.
  The pattern should be: external consumers use subpath
  exports; internal files use relative imports.
- Turbo cache can mask latent failures for a long time.
  Package renames force cache misses that surface them.

---

## Session: 2026-02-25 — Post-Phase 6 Consolidation

### What happened

Ran `/jc-consolidate-docs` after Phase 6 completion.

### Changes made

1. **§16 extraction** — replaced 245 lines of synonym system
   documentation in the canonical plan with a 12-line summary
   and cross-references to the permanent
   [Synonyms README](../../packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/README.md).
   The full content was already maintained there. Updated two
   cross-references (plan §7 and prompt) to point to the README
   instead of §16.
2. **Prompt header update** — "Last Updated" line updated from
   "Phase 6 next" to "Phases 0-6 complete, Phase 7 next".
   Two other stale references ("Phases 6-7 remain" → "Phase 7
   remains", "Phases 0-5 are complete" → "Phases 0-6 are
   complete") also fixed.
3. **Distilled.md pruning** — removed 4 entries (12 lines) now
   captured in permanent docs: `onclick` handlers and
   `JSON.stringify` (→ HTTP MCP README), E2E IO rules
   (→ testing-strategy.md), `process.env` pattern
   (→ testing-patterns.md). 375 → 363 lines; remaining content
   is all non-obvious gotchas without permanent doc coverage.

### Patterns noted

- §16 reduction was listed as a Phase 6.7 task but wasn't
  executed during Phase 6 — caught during consolidation.
  Consolidation is the safety net for skipped documentation
  tasks.
- Napkin is 128 lines — well under 800. No distillation needed.
- Distilled.md at 363 lines is still above the 200-line target
  but all remaining entries are high-signal, non-obvious
  gotchas without permanent doc coverage. Aggressive pruning
  would sacrifice actionable content.

---

## Session: 2026-02-25 — Phase 6 Execution

### What happened

Executed all 8 sub-phases of Phase 6 (SDK workspace separation):
6.1 S1-S3 (test helper, test split, _meta simplification), 6.2
logger+env renames (~123 files), 6.3 codegen workspace rename
(git mv + ~100 imports + ESLint rules), 6.4 repo rename refs
(~21 files), 6.5 provenance banners, 6.6 design decisions README,
6.7 documentation alignment, 6.8 full quality gate chain (all 12
pass) + 5 specialist reviewers.

### Patterns noted

- Bulk `rg -l | xargs sed` is reliable for mechanical renames
  across 100+ files — run in two passes (package name, then
  directory name) to avoid partial matches
- `.agent/` exclusion during bulk renames is essential to
  preserve historical records — then manually update
  forward-looking references in prompts/plans
- Reviewer findings that surface pre-existing issues (stale
  `repository.directory` fields from prior moves) are worth
  fixing in the same phase
- `as ToolName` type assertion created in a new file — easy to
  miss during TDD when focus is on behaviour. The `as const
  satisfies ToolName` pattern is the correct alternative.
- Background reviewer agents that haven't returned by the end
  of a conversation turn need to be re-invoked in the next
  session — their results are lost
- AGENT.md is the first thing agents read — stale package names
  there cause immediate confusion. Always check it during renames.

### Reviewer findings actioned

1. `as ToolName` → `as const satisfies ToolName` in test helper
2. AGENT.md stale library names updated
3. `packages/core/env/package.json` stale directory field fixed
4. `packages/core/result/package.json` stale directory field fixed
5. Roadmap quality gate chain — added `subagents:check`

### Pre-existing issues noted (out of scope, not fixed)

- `LIB_PACKAGES` in `boundary.ts` contains phantom entries
  (`storage`, `transport`) — ESLint rules for non-existent dirs
- `sampleDescriptor`/`createFakeRegistry` duplicated between
  unit and integration test files — acceptable for 2 files

---

## Session: 2026-02-25 — Phase 6 Scope Expansion (Planning)

This was a planning session, not an implementation session. The user
explicitly recognised this distinction after thorough context-gathering.

### What happened

1. Grounded thoroughly in the canonical plan, prompt, and all
   foundation documents. Explored the codegen workspace barrels,
   generator templates, boundary rules, and library packages.

2. User expanded Phase 6 scope with four renames:
   - `@oaknational/curriculum-sdk-generation` → `@oaknational/sdk-codegen`
     (dir: `oak-curriculum-sdk-generation` → `oak-sdk-codegen`)
   - `@oaknational/mcp-logger` → `@oaknational/logger`
   - `@oaknational/mcp-env` → `@oaknational/env`
   - Repo: `oak-mcp-ecosystem` → `oak-open-data-ecosystem`

3. Evaluated F12-F14 decisions during exploration:
   - F12 (barrel auto-gen): keep manual — 11 barrels manageable
   - F13 (subpath granularity): keep as-is — actual export counts
     (8, 18, 16) are reasonable, not "1-3" as originally flagged
   - F14 (OakApiPathBasedClient): keep in codegen — schema-derived
   - F15 (wildcard exports): pre-resolved, no `export *` found

4. Created comprehensive execution plan with 8 sub-phases
   (6.1-6.8) in the canonical plan. Integrated all content from
   the Cursor plan file and deleted it.

5. Ran `/jc-consolidate-docs` — updated roadmap, prompt,
   cross-references. No documentation extraction needed (§16
   synonym reference already extracted in prior session).

### Patterns noted

- Thorough context-gathering during planning surfaces scope
  expansions (the four renames emerged from the grounding process,
  not from a separate request)
- Reviewer findings can have inaccurate details (F13 said "1-3
  symbols" but actual counts were 8-18) — always verify against
  the codebase before deciding
- Planning sessions produce their own artefact: the updated plan.
  The consolidation step ensures nothing is lost when the session
  context window closes.

---

## Session: 2026-02-24 (f) — Distillation

Distilled napkin from sessions 2026-02-22 to 2026-02-24 (873 lines).
Archived to `archive/napkin-2026-02-24.md`.

New entries added to distilled.md:

- Type predicate stubs with `noUnusedParameters`
- `as const satisfies T` for test data
- Interface Segregation eliminates assertion pressure
- ESM missing `.js` in barrel re-exports (E2E-only detection)
- TS2209 rootDir ambiguity after tsconfig narrowing
- Stale tsup entries match nothing silently
- Adapter packages must be rebuilt before sdk-codegen
- When moving files, ESLint overrides and tests must move too
- `*.config.ts` glob doesn't match `*.config.e2e.ts`
- `export * from` banned by `no-restricted-syntax`
- Stale vitest include globs are silent

Pruned: Commander `this.args` (too narrow).

Documentation extractions completed before distillation:

1. Synonyms README — two-concern insight, Domain 4, consumer
   chains, co-location target state
2. ADR-063 — revision note about two-concern insight
3. Generation SDK README — subpath export table, status update
4. ESLint plugin README — `createSdkBoundaryRules` documentation
5. Type-helpers README — created with rationale, helpers table,
   assertion discipline

---

## Session: 2026-02-25 (host-validation hardening)

### What changed

1. Added unit coverage for previously flagged security helpers:
   - `deriveSelfOrigin` in `auth-routes.unit.test.ts`
   - `extractHostname` in `security.unit.test.ts`
2. Removed `as` assertions from `auth-routes.integration.test.ts`
   and boundary-rule tests by using explicit runtime narrowing.
3. Hardened host handling:
   - Introduced shared `host-header-validation.ts`
     (`isValidHostHeader`, `isAllowedHostname`)
   - Applied consistent validation in OAuth metadata routes,
     DNS-rebinding middleware, and MCP auth challenge/resource URL generation.
4. Added malformed-host and wildcard-parity coverage across unit,
   integration, and E2E tests.

### Lessons

- Fixing one host-validation path is not enough; all places that
  emit origin/resource URLs from `Host` must share the same checks,
  or security posture drifts.
- When tightening auth/challenge URL generation, update expected
  `/mcp` error-path behaviour (`401` vs `403`) in E2E tests early
  to avoid masking real regressions behind generic `500`s.
- Security findings can surface semantic mismatches between route
  categories ("no DNS middleware on /mcp") and effective protection
  (auth middleware can still and should reject malformed/disallowed hosts).

---

## Session: 2026-02-25 (onboarding docs consolidation)

### What changed

1. **Dissolved `docs/foundation/onboarding.md`** — unique content
   migrated to `quick-start.md` (domain ADR handoffs, "You're Ready
   When" checklist) and `troubleshooting.md` (Known Gate Caveats).
   Updated ~20 files with reference changes.
2. **Deleted `docs/governance/ai-agent-guide.md`** — assessed as
   entirely redundant with start-right → AGENT.md → rules.md path.
   Updated all active references.
3. **Fixed start-right commands/prompts** — commands were duplicating
   prompt content (root cause of gate-list divergence). Elevated
   prompts to contain full structured guidance; reduced commands to
   thin single-line pointers.
4. **Updated ADR count** from 114 → 116 in README, VISION, and
   agentic-engineering-practice.md.
5. **Improved CONTRIBUTING.md** type-safety wording — "Use `unknown`
   at boundaries" now explains Zod validation flow.
6. **Corrected `rules.md` architectural model** — packages/core/ and
   packages/libs/ now accurate, cross-references AGENT.md.
7. **Fixed quick-start.md repository structure tree** — added
   packages/core/, oak-search-sdk, corrected libs, updated docs/ dirs.
8. **Updated release plan** — 6 O-items resolved (O1, O2, O3, O4
   annotated, O8 partial, O9), open items 42 → 26.

### Lessons

- Onboarding-reviewer false positives: reported 9 files "missing"
  that were actually moved/renamed in commit 5c8bfc2d. Always verify
  reviewer claims against git history before acting.
- Commands duplicating prompt content is a DRY violation that
  compounds: each edit only updates one copy, creating divergence.
  Thin-pointer pattern prevents this.
- "Onboarding" as a document conflates process with artefact. The
  process is supported by existing docs (README → quick-start →
  AGENT.md), not a standalone instruction bucket.

---

## Session: Batch B Snagging (2026-02-25)

### Work Done

Completed all 8 Batch B items from release-plan-m1:
- **F6**: Extracted `createSearchRetrieval` to `@oaknational/oak-search-sdk`.
  Both apps now delegate to it. Added 3 unit tests.
- **F10**: Added timeout/retry to `fetchUpstreamMetadata`. Per-attempt
  timeout (10s), exponential backoff (3 attempts), transient-only retry
  (5xx, network, abort). Added 5 tests including 5xx retry-then-success.
- **F20**: Archived contradictory BUILD_VERIFICATION.md and TESTING_GAP_ANALYSIS.md.
- **F25**: Updated deployment-architecture.md for async createApp, mcpFactory,
  correct middleware phase diagram.
- **F28**: Removed blanket eslint-disables from 4 generation files. Replaced
  `as Record<string, unknown>` with `in` operator narrowing in bulk-data-parser.
  Structural exemptions moved to eslint.config.ts overrides.
- **F29**: Fixed "core depends on nothing" wording.
- **O5**: Added doc-gen and subagents:check to start-right quality gate lists.
- **O10**: Added convenience commands (make/qg/fix/doc-gen) to AGENT.md.

### Lessons

- SDK packages consumed as built dist: after adding new files to SDK
  source, both tsup.config.ts entry AND `pnpm build` must run before
  apps see the new module. Turbo caching can mask this — delete dist/
  and rebuild if "Cannot find module" appears in tests.
- `isNetworkOrAbortError` with `message.includes('abort')` is too broad —
  matches unrelated errors. Stick to `error.name` checks for standard
  error classification.
- `fetchUpstreamMetadata` timeout should cover the entire attempt including
  `response.json()` parsing, not just the network fetch. Clerk's metadata
  is tiny, but the principle matters for correctness.
- Reviewer findings: deployment-architecture.md still showed VERCEL
  conditional and default export that no longer exist in actual code.
  Always verify doc examples against the real source file, not memory.

## Session: 2026-02-25 — Split env Package Concerns (F5/F18)

### What happened

Executed the plan to split `@oaknational/env` into:
1. `@oaknational/env` (core) — pure Zod schema contracts only
2. `@oaknational/env-resolution` (libs) — runtime pipeline (resolveEnv, findRepoRoot)

Also cleaned `LIB_PACKAGES` from 6 entries (4 stale/miscategorised) to 2,
and fixed `openapi-zod-client-adapter` ESLint config (was using
createLibBoundaryRules despite being a core package).

### Lessons

- When removing an entry from LIB_PACKAGES, check ALL packages that
  called `createLibBoundaryRules` with that name — their eslint config
  may now generate empty/broken zone paths. The openapi-zod-client-adapter
  was effectively unprotected after the cleanup.
- workspace:^ vs workspace:* — this monorepo uses workspace:* everywhere.
  Don't introduce workspace:^ for private packages.
- tsup externals: only list Node builtins actually imported (YAGNI).
  node:os was listed but never imported.
- Stale tsconfig includes (bin/**/*.ts) should be removed when the
  corresponding directory doesn't exist.
- ADR implementation sections have file paths that go stale when
  packages are moved. Always grep ADRs for old paths after a move.
- When splitting a core package that has runtime deps into core+libs,
  the pattern is: schemas stay in core (coreBoundaryRules), pipeline
  moves to libs (createLibBoundaryRules). No re-exports, no compat layer.

### Patterns that worked

- Phase 0 verification caught that codegen.ts has its own local
  findRepoRoot (not imported from @oaknational/env), avoiding a false
  consumer migration.
- Running deterministic validation greps after each phase catches
  drift immediately.
- Specialist reviewers caught 4 actionable issues that manual review
  would likely have missed (workspace:^ inconsistency, stale ADR paths,
  YAGNI external, openapi-zod-client-adapter boundary violation).
