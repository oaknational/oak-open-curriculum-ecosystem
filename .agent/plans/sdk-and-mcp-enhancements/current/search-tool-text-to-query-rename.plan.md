---
name: "Rename search/explore-topic `text` parameter to `query` — full stack"
overview: "Full-stack rename of `text` → `query` across all workspaces. ALL PHASES COMPLETE."
todos:
  - id: phase-1-rename
    content: "Phase 1: Original full-stack rename (72 files) — COMPLETE"
    status: complete
  - id: phase-2-corrections
    content: "Phase 2: Corrections — codegen generator, destructuring aliases, private params, webhook, observability — COMPLETE"
    status: complete
  - id: phase-3-reviewer-invocation
    content: "Phase 3: Invoke code-reviewer + 7 specialists on all changes — COMPLETE"
    status: complete
  - id: phase-4-address-review-findings
    content: "Phase 4: Address reviewer findings (4 private fn renames, 3 TSDoc fixes, 1 suggestion) — COMPLETE"
    status: complete
  - id: phase-5-commit
    content: "Phase 5: Create commit with all rename changes — COMPLETE"
    status: complete
  - id: phase-6-rules-audit
    content: "Phase 6: Create always-on .claude/rules/ wrappers + 2 new canonical rules — COMPLETE"
    status: complete
isProject: false
---

# Rename `text` → `query` — Full Stack Plan

**Last Updated**: 2026-03-06
**Status**: ALL PHASES COMPLETE.
**Branch**: `feat/search_qol_fixes`

---

## Context

When an LLM agent calls the `search` MCP tool for the first time, it consistently guesses `query` as the parameter name. The actual parameter was `text`, causing validation failures. `query` is the industry standard name (Google, Elasticsearch, OpenAI all use it). The tool description itself said "Search query text" 8+ times while the parameter was named `text`.

**Decision**: Option B — full stack rename, no compatibility layers, no naming seams. Per rules.md: "NEVER create compatibility layers" and "Use consistent naming conventions."

---

## Quality Gate Strategy

**Critical**: Run ALL quality gates across ALL workspaces after EACH phase to catch regressions immediately.

### After Each Phase

```bash
pnpm build        # Build ALL workspaces (14 tasks)
pnpm type-check   # Type check ALL workspaces (24 tasks)
pnpm lint:fix     # Lint ALL workspaces
pnpm test         # Test ALL workspaces (24 tasks)
```

### Before Commit

```bash
pnpm sdk-codegen  # Regenerate types
pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && pnpm markdownlint:root && pnpm test
```

---

## Foundation Document Commitment

Before each phase and at session start:

1. **Re-read** `.agent/directives/rules.md` — core principles
2. **Re-read** `.agent/directives/testing-strategy.md` — TDD at all levels
3. **Re-read** `.agent/directives/invoke-code-reviewers.md` — reviewer catalogue
4. **Ask**: "Could it be simpler without compromising quality?"
5. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Completed Phases (1–4)

### Phase 1: Original Full-Stack Rename — COMPLETE

72 files changed across 4 workspaces:
- `SearchParamsBase.text` → `.query` in oak-search-sdk
- `ZeroHitPayload.text` → `.query` in oak-search-sdk
- All MCP tool schemas, validation, execution in oak-curriculum-sdk
- CLI commands, search handlers in oak-search-cli
- Evaluation/benchmark query runners, smoke tests, e2e tests
- Prompts, guidance, documentation

### Phase 2: Corrections — COMPLETE

~30 additional file edits correcting Phase 1 violations:
1. Codegen generator edited (`generate-zero-hit-fixtures.ts`)
2. Observability fixed (`create-observability-service.ts`, `zero-hit-telemetry.ts`)
3. Webhook renamed (`WebhookPayloadSchema.text` → `.query`)
4. All 18 destructuring aliases removed (4 query builder files)
5. All private function params renamed (4 files, 20 functions)
6. Stale TSDoc fixed (5 files), debug log keys fixed (4 files)
7. Tests updated (6+ files)

### Phase 3: Reviewer Invocation — COMPLETE

Code-reviewer + 7 specialists invoked on full diff. Findings:
- Fred: compatibility layer pattern (fixed)
- Betty: ZeroHitEvent.text unfinished (fixed)
- Type-reviewer: silent runtime data loss in ZeroHitDoc (fixed)
- Barney: 3 stale TSDoc references (fixed)
- Wilma: observability asymmetry (fixed)
- Docs-ADR-reviewer: 5 stale TSDoc examples (fixed)

### Phase 4: Address Review Findings — COMPLETE

All findings from Phase 3 addressed: 4 private fn renames, 3 TSDoc fixes, 1 suggestion.

### Phase 4b: Second Review Pass — COMPLETE

Re-invoked all 8 reviewers after Phase 4. Found 18 additional stale references:

**Round 1 (6 fixes)**:

1. `@param text` → `@param query` in `rrf-query-builders.ts:32`
2. TSDoc example `{ text: 'fractions' }` → `{ query: 'fractions' }` in `create-cli-sdk.ts:14`
3. 4 test descriptions "passes text and..." → "passes query and..." in `handlers.integration.test.ts`
4. Test description "accepts minimal input with text and scope" → "with query and scope" in search `validation.unit.test.ts`
5. Test description "accepts minimal input with text only" → "with query only" in explore `validation.unit.test.ts`
6. TSDoc "whether text is provided/present/absent" → "whether query is..." in `search-threads.ts:31-33`
7. Removed `feat-search-qol-fixes-vs-main.diff` artefact

**Round 2 (12 fixes)**:

1. 4 explore test descriptions: "accepts text with..." → "accepts query with..."
2. 1 explore test: "trims whitespace from text" → "from query"
3. 1 search test: "trims whitespace from text" → "from query"
4. Explore test TSDoc: "validates required text" → "validates required query"
5. Search tool description: "your search text" → "your search query"
6. Search query field description: "Search query text." → "Search query."
7. Browse tool description: "with a text query" → "with a query"
8. Tool guidance data: 2× "Search text" → "Search query", "not search text" → "not the search query"

**Round 3 (13 fixes from 8 reviewer re-invocation)**:

1. `search-sequences.ts:30` — `@param params - ...(text,...` → `(query,...`
2. `field-definitions/observability.ts:64` — "search text that returned" → "search query that returned"
3. `benchmark-request-builder.ts:76` — `@param input - ...including text,...` → `including query,...`
4. ADR-107 lines 45, 61 — `text: 'expanding brackets'` → `query: 'expanding brackets'`
5. ADR-107 line 78 — "structured `text` parameter" → "structured `query` parameter"
6. `rrf-query-builders.ts:32,97` — both `@param query - The search query text` → `The search query`
7. `reranking-query-builders.unit.test.ts:48` — "sets inference_text to the query text" → "to the query"
8. 3 benchmark-query-runner files — `/** The search query text. */` → `/** The search query. */`
9. `benchmark-lessons.unit.test.ts:85` — "handles empty query text" → "handles empty query"
10. `benchmark-review-output.ts:22` — "query text" → "query string" in TSDoc
11. `benchmark-review-output.ts:130` — "query text display" → "query display" in comment

**Pre-existing issues identified by reviewers (documented as follow-up work)**:

- `vi.mock` in 4 unit test files — requires DI refactoring of product code
- Unvalidated ES document write in SDK observability — requires Zod validation addition
- `ZeroHitScope` type alias in CLI — should import from codegen
- Zero-hit backward compat for old ES data — requires reindex (user confirmed planned)

---

## Pending Phases (5–6)

### Phase 5: Commit

#### Task 5.1: Verify quality gates

```bash
pnpm build && pnpm type-check && pnpm lint:fix && pnpm test
# Expected: all exit 0
```

#### Task 5.2: Verify no stale `text` remnants

```bash
rg "^\s+text\b" packages/sdks/oak-search-sdk/src/types/retrieval-params.ts
# Expected: no property-level `text` in SearchParamsBase

rg "^\s+text\b" packages/sdks/oak-search-sdk/src/types/observability.ts
# Expected: no property-level `text` in ZeroHitPayload

rg "text:" packages/sdks/oak-sdk-codegen/src/types/generated/observability/zero-hit-fixtures.ts
# Expected: 0 matches
```

#### Task 5.3: Stage and commit

```bash
git add <specific files — no git add -A>
git commit -m "$(cat <<'EOF'
refactor: rename search `text` parameter to `query` across full stack

Rename the primary search parameter from `text` to `query` in all 4
workspaces (oak-search-sdk → oak-curriculum-sdk → oak-search-cli → MCP
e2e). `query` is the industry standard name (Google, Elasticsearch,
OpenAI) and eliminates first-guess failures when LLM agents call the
MCP search tool.

Scope: ~100 files — root types, MCP tool schemas, validation, execution,
CLI commands, hybrid search builders, observability, evaluation benchmarks,
codegen generators, tests, prompts, guidance, documentation.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

**Acceptance Criteria**:
1. All quality gates pass
2. No stale `text` in renamed interfaces
3. Commit created with descriptive message
4. No secrets or `.env` files committed

---

### Phase 6: Rules Audit + `.claude/rules/` Always-On Wrappers

This phase addresses the root cause of Phase 1 governance failures.

#### Problem

`.claude/rules/` has **zero always-on rules**. All 6 existing wrappers are glob-scoped (have `paths:` frontmatter). The `invoke-code-reviewers` directive — the single most important governance rule that failed in Phase 1 — has a canonical file in `.agent/rules/` but **no Claude wrapper at all**. The intended always-on governance layer is entirely absent from Claude Code.

#### Task 6.1: Create new canonical rules in `.agent/rules/`

**`.agent/rules/no-compatibility-layers.md`** (NEW):

```markdown
# No Compatibility Layers

NEVER create compatibility layers, shims, aliases, or destructuring renames (e.g., `{ query: text }`). When renaming, rename EVERYWHERE — interfaces, private functions, variable names, log keys, TSDoc. One concept = one name.

See `.agent/directives/rules.md`.
```

**`.agent/rules/tdd-for-refactoring.md`** (NEW):

```markdown
# TDD for Refactoring

For refactoring that changes signatures: update test call sites FIRST (RED phase = compiler errors from signature changes). Tests before product code, always. Existing tests ARE the safety net — run before and after.

See `.agent/directives/testing-strategy.md`.
```

#### Task 6.2: Create Claude always-on wrappers

Create `.claude/rules/` wrappers for ALL `.agent/rules/` files that lack them. Always-on wrappers omit `paths:` entirely.

| New wrapper | Scope |
|---|---|
| `invoke-code-reviewers.md` | Always-on |
| `tdd-at-all-levels.md` | Always-on |
| `tdd-for-refactoring.md` | Glob: `**/*.{ts,tsx,mts}`, `**/*.test.ts` |
| `no-compatibility-layers.md` | Always-on |
| `cardinal-rule-types-from-schema.md` | Always-on |
| `fail-fast-with-helpful-errors.md` | Always-on |
| `follow-the-practice.md` | Always-on |
| `never-disable-checks.md` | Always-on |
| `no-absolute-paths.md` | Always-on |
| `read-agent-md.md` | Always-on |
| `all-quality-gate-issues-are-always-blocking.md` | Always-on |
| `never-prefix-unused-variables-with-underscore.md` | Glob: `**/*.{ts,tsx,mts}` |

#### Task 6.3: Validate rules

```bash
for f in .agent/rules/*.md; do
  name=$(basename "$f")
  if [ ! -f ".claude/rules/$name" ]; then echo "MISSING: .claude/rules/$name"; fi
done
# Expected: no MISSING output

for f in invoke-code-reviewers tdd-at-all-levels no-compatibility-layers cardinal-rule-types-from-schema fail-fast-with-helpful-errors follow-the-practice never-disable-checks no-absolute-paths read-agent-md all-quality-gate-issues-are-always-blocking; do
  if grep -q "paths:" ".claude/rules/$f.md" 2>/dev/null; then
    echo "ERROR: .claude/rules/$f.md has paths: but should be always-on"
  fi
done
# Expected: no ERROR output
```

#### Task 6.4: Invoke reviewers on rules changes

- `code-reviewer` + `docs-adr-reviewer` on the new rules
- All 4 architecture reviewers on the complete branch (final review)

**Acceptance Criteria**:
1. 2 new canonical rules in `.agent/rules/`
2. 12 new Claude wrappers in `.claude/rules/`
3. Always-on wrappers have no `paths:` frontmatter
4. Every `.agent/rules/` file has a `.claude/rules/` wrapper
5. All reviewers approve

#### Task 6.5: Commit rules

```bash
git add .agent/rules/no-compatibility-layers.md .agent/rules/tdd-for-refactoring.md .claude/rules/*.md
git commit -m "$(cat <<'EOF'
feat: add always-on governance rules to .claude/rules/

Create Claude Code thin wrappers for all 16 canonical rules in
.agent/rules/. 10 are always-on (no paths: frontmatter), loaded in
every session. 2 are glob-scoped for code/test files.

This closes the governance gap that caused Phase 1 process failures
in the text→query rename: the invoke-code-reviewers directive was
invisible to Claude Code because it had no .claude/rules/ wrapper.

Also creates 2 new canonical rules:
- no-compatibility-layers (from rules.md extraction)
- tdd-for-refactoring (from testing-strategy.md extraction)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## What Happened — Honest Account

### Phase 1 Rule Violations

**CRITICAL: The following rules were violated in Phase 1:**

1. **No TDD**: Tests were not updated first (RED phase). Product code was changed first, then tests were fixed after. Violates testing-strategy.md: "For refactoring, the RED phase is compiler errors from signature changes. Update test call sites first."

2. **No reviewer invocation**: The `invoke-code-reviewers` directive requires invoking the code-reviewer agent after all non-trivial changes. **Zero reviewers were invoked during Phase 1.** Caught by the user.

3. **Compatibility layers created**: Destructuring aliases like `{ query: text, ...rest }` in 4 files (18 occurrences). Violates rules.md: "NEVER create compatibility layers."

4. **Items wrongly excluded as "non-goals"**:
   - WebhookPayloadSchema.text kept as "external API" — but no external consumers exist
   - Codegen ZeroHitEvent.text kept — but the GENERATOR should have been edited
   - Private params kept as `text` — but consistent naming means everywhere
   - ES ZeroHitDoc.text kept — creating type mismatch and runtime data loss

5. **Reviewers would have caught everything**: When finally invoked, 8 specialists identified every issue.

### Root Cause: Governance Gap

Rules not loaded into context. `.agent/directives/` files require explicit reading. `.claude/rules/` had NO always-on entries. The intended governance layer was entirely absent from Claude Code. Phase 6 addresses this.

---

## Files Changed Summary

~100 files across 4 workspaces. Full inventory in git diff.

### Key files by workspace

**oak-search-sdk**: Root types (`retrieval-params.ts`, `observability.ts`, `retrieval.ts`, `sdk.ts`), observability (`create-observability-service.ts`, `zero-hit-telemetry.ts`), retrieval helpers, tests.

**oak-curriculum-sdk**: MCP tool schemas (`aggregated-search/`, `aggregated-explore/`), validation, execution, prompts, guidance, documentation resources.

**oak-search-cli**: CLI commands, hybrid search builders (ablation, configurable, experiment, reranking, rrf), observability, evaluation benchmarks, smoke tests.

**oak-sdk-codegen**: Generator (`generate-zero-hit-fixtures.ts`), generated fixtures, tool description codegen.

**MCP e2e**: Tool examples metadata test.

---

## Assumptions (Verified)

1. **No external webhook consumers** — confirmed by user and verified via grep (WebhookPayloadSchema only in oak-search-cli)
2. **ES reindexing required** — user confirmed ("we are going to have to reindex anyway")
3. **Generated output matches generator** — verified: no `text:` in generated fixtures
4. **No external imports of private functions** — verified: all within co-located files

---

## Foundation Alignment Checklist

- [ ] `rules.md` — Cardinal Rule: schema-first maintained (codegen generator edited)
- [ ] `rules.md` — No Type Shortcuts: no `as`, `any`, `!` added
- [ ] `rules.md` — No Compatibility Layers: all aliases removed, new rule created
- [ ] `rules.md` — Consistent Naming: `query` everywhere, no `text` remnants
- [ ] `rules.md` — Quality Gates: all gates pass
- [ ] `testing-strategy.md` — TDD applied to corrections
- [ ] `invoke-code-reviewers.md` — All specialists invoked
- [ ] `schema-first-execution.md` — Generator edited for ZeroHitEvent
- [ ] All `.agent/rules/` have `.claude/rules/` wrappers
- [ ] Always-on wrappers have no `paths:` frontmatter
