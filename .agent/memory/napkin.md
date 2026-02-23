# Napkin

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
