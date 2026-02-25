# Napkin

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
