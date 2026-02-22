---
name: "Pre-Merge Widget Stabilisation"
overview: "Pre-merge widget stabilisation plan (Tracks 1a + 1b): enforce non-search shell-only widgets and fix search widget rendering with contract tests."
todos:
  - id: a1-shell-only-non-search
    content: "1a: Reduce non-search widgets to static Oak branding shells with no tool payload rendering or renderer dispatch."
    status: pending
  - id: b3-field-mismatch
    content: "B3: Fix widget renderer field mismatch — renderer accesses flat camelCase fields but LessonResult wraps data in nested snake_case `lesson` property. Multi-level TDD."
    status: pending
  - id: b4-suggest-renderer
    content: "B4: Handle suggest scope in widget renderer — suggest returns `{ suggestions, cache }`, not `{ results }`. Multi-level TDD."
    status: pending
  - id: b2-contract-tests
    content: "B2: Add contract tests validating renderer field access against generated index document types. TDD."
    status: pending
  - id: widget-quality-gates
    content: "Full quality gate chain after all changes."
    status: pending
  - id: widget-review
    content: "Specialist reviews (code-reviewer, test-reviewer)."
    status: pending
isProject: false
---

# Pre-Merge Widget Stabilisation

**Last Updated**: 2026-02-22
**Status**: ACTIVE (pre-merge execution-ready)
**Scope**: Pre-merge widget stabilisation across both tracks:
Track 1a non-search shell-only reduction and Track 1b search
widget correctness + drift protection tests.
**Merge-blocking**: Yes — Tracks 1a and 1b are both pre-merge
requirements and both must complete before the upcoming merge.

---

## Standalone Session Bootstrap (Next Session)

1. Re-read foundation directives before code changes:
   - [rules.md](../../../directives/rules.md)
   - [testing-strategy.md](../../../directives/testing-strategy.md)
   - [schema-first-execution.md](../../../directives/schema-first-execution.md)
2. Confirm current working context:

   ```bash
   git status --short
   ls -1 .agent/plans/semantic-search/active
   ```

3. Use this file as the single owner of pre-merge Tracks 1a and 1b.
4. Treat dispatch type-safety work as complete and archived:
   - `../archive/completed/search-dispatch-type-safety.md`
5. Keep post-merge rendering and extensions work out of scope for this file:
   - `../../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md`

---

## Context

Post-WS5 adversarial reviews surfaced 4 blockers and 8 warnings.
Three of the blockers (B3, B4, B2) are exclusively ChatGPT
widget concerns:

- **B3**: Search results render as "Untitled" — broken UX
- **B4**: Suggestions silently show "No results found"
- **B2**: Zero compile-time feedback on renderer field access

The remaining items (B1, W1) were SDK-level concerns now closed in
the archived merge-blocking plan:
[search-dispatch-type-safety.md](../archive/completed/search-dispatch-type-safety.md).

**Source**: [Phase 3a archived plan](../archive/completed/phase-3a-mcp-search-integration.md)
(Adversarial Review Findings section)
Track 1a requirements come from the sequencing decision captured on
22 February 2026.

---

## Merge Window Sequencing (Agreed)

1. **Track 1a (this file, pre-merge)**: Reduce current non-search
   widgets to no rendering in most paths, with basic static Oak
   branding in a limited subset.
2. **Track 1b (this plan, pre-merge)**: Fix the search widget so
   search and suggest output render correctly and are protected by
   contract tests.
3. **Track 2 (later, unscheduled)**: All other rendering-system
   work, including React component replacement.
   Track 2 planning and backlog remain in
   [mcp-extensions-research-and-planning.md](../../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md).

This plan now carries both pre-merge tracks. It does not absorb
Track 2 architecture, research, or feature-expansion work.

---

## Track 1a: Non-Search Widget Hard Block (Prerequisite)

**Objective**: Enforce minimal Oak-branded shell-only widgets for
non-search paths, with no content rendering and no tool payload
usage.

**Scope**:

1. Static branding shell only (neutral copy, no data cards).
2. No `window.openai.toolOutput`, no payload parsing, and no
   renderer dispatch for non-search widget paths.
3. Keep only minimum metadata needed for host attachment and shell
   loading.
4. Search widget remains enabled and is fixed under Track 1b in
   this same file.

**Acceptance criteria**:

1. Non-search widget HTML paths are shell-only.
2. Non-search widget script paths contain no tool-output access.
3. Search widget continues to function as the one active rich path.
4. Validation output is recorded with deterministic checks.

**Deterministic validation (planned implementation checks)**:

```bash
rg -n "toolOutput|toolResponseMetadata|TOOL_RENDERER_MAP|getRendererForTool" \
  apps/oak-curriculum-mcp-streamable-http/src/widget-*.ts \
  apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.ts

rg -n "window\\.openai\\.(toolOutput|toolInput|toolResponseMetadata)" \
  apps/oak-curriculum-mcp-streamable-http/src
```

---

## Why This Matters

1. **Immediate value**: Teachers using the ChatGPT widget see
   working search results with correct titles, subjects, key
   stages, and links instead of "Untitled" cards.
2. **System-level impact**: Contract tests catch future ES index
   document schema drift before it reaches users.
3. **Risk of inaction**: The widget is the primary visual interface
   for ChatGPT users. Broken rendering undermines trust.

---

## Multi-Level TDD is Vital

> See [testing-strategy.md](../../../directives/testing-strategy.md)

This workstream touches code at three levels: pure formatting
functions (unit), SDK-to-widget data flow (integration), and
widget rendering in a browser (E2E/Playwright). TDD must apply
at **all three levels** for each phase.

### Why multi-level TDD matters here

**B3 is a case study in what happens without it.** The Playwright
test fixtures (`tests/widget/fixtures.ts`) use flat camelCase
fields that match the old REST API response shape, not the SDK's
`LessonResult` shape. The renderer was written to match those
fixtures. The tests pass. The widget is broken.

The tests passed because they tested the wrong contract. A unit
test validating field access against the generated
`SearchLessonsIndexDoc` type would have caught this at compile
time. A Playwright test using a fixture derived from the real SDK
shape would have caught it at runtime. Neither existed.

### TDD at each level

| Level | What it proves | When to write | RED phase |
|-------|---------------|---------------|-----------|
| **Unit** | Field extraction functions produce correct access patterns | Before fixing extraction logic | Tests fail against current wrong fields |
| **Integration** | Contract tests validate field existence against generated types | After fixing renderer (B2) | Tests verify correct fields exist on Zod schemas |
| **E2E (Playwright)** | Widget renders correct titles, subjects, URLs from real SDK shapes | Before fixing the renderer | Tests fail with "Untitled" cards |

---

## B3: Widget-to-SDK Field Mismatch (Broken UX)

**Location**: `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/search-renderer.ts`

**Problem**: The search renderer expects flat, camelCase fields:

```javascript
const t = l.lessonTitle || l.title || l.slug || 'Untitled';
const s = l.subjectTitle || l.subject || (un ? un.subjectSlug : '') || '';
const k = l.keyStageTitle || l.keyStage || (un ? un.keyStageSlug : '') || '';
const u = l.canonicalUrl || '';
```

But `LessonResult` from the SDK has a nested structure with
snake_case fields:

```typescript
interface LessonResult {
  readonly id: string;
  readonly rankScore: number;
  readonly lesson: SearchLessonsIndexDoc;  // nested
  readonly highlights: readonly string[];
}
```

Where `SearchLessonsIndexDoc` has `lesson_title`, `subject_slug`,
`key_stage`, `lesson_url` — not `lessonTitle`, `subjectTitle`,
`keyStageTitle`, `canonicalUrl`.

**Impact**: Every field access misses. Every search result renders
as **"Untitled"** with no subject, no key stage, and no URL.

The Playwright test fixtures also use the wrong shape:

- `tests/widget/fixtures.ts`: `SEARCH_OUTPUT_FIXTURE` uses flat
  `{ lessonTitle, subject, keyStageTitle, canonicalUrl }`
- `tests/widget/renderer-fixtures.ts`: `SEARCH_LESSONS_ARRAY_FIXTURE`
  uses flat `{ lessonTitle, units: [{ unitSlug }] }`

**Scope-specific field mapping** (from `search-retrieval-types.ts`):

| Scope | Result type | Nested property | Title field | Subject field | Key stage field | URL field |
|-------|------------|----------------|-------------|--------------|----------------|-----------|
| `lessons` | `LessonResult` | `.lesson` | `lesson_title` | `subject_slug` | `key_stage` | `lesson_url` |
| `units` | `UnitResult` | `.unit` | `unit_title` | `subject_slug` | `key_stage` | `unit_url` |
| `threads` | `ThreadResult` | `.thread` | `thread_title` | (via `subject_slugs`) | — | `thread_url` |
| `sequences` | `SequenceResult` | `.sequence` | `sequence_title` | `subject_slug` | (via `key_stages`) | `sequence_url` |

## B4: Suggest Scope Silently Broken

**Location**: Widget renderer + `widget-script.ts` fallback logic.

**Problem**: The widget fallback (line 118 of `widget-script.ts`)
checks `fullData.results !== undefined && fullData.scope !== undefined`
to match search results. Suggest returns
`{ suggestions: [...], cache: { version, ttlSeconds } }` — no
`results` property, no `scope` property.

**Impact**: Suggest output falls through to raw JSON rendering
or "Loading..." state.

**Fix**: Add suggest-aware branching in the search renderer.
When data has a `suggestions` property, render suggestion items
instead of search cards. The `TOOL_RENDERER_MAP` already routes
`search` to the `search` renderer, so suggest output will reach
the renderer — the renderer just needs to handle the shape.

## B2: Zero Compile-Time Feedback on Renderer Fields

**Location**: `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/search-renderer.ts`

**Problem**: Raw JS string template accessing index document
fields with no type checking. Any ES index document schema change
silently breaks the widget.

**Fix**: Contract tests that validate the *fixed* renderer's field
access against generated index document types. Tests import from
generated Zod schemas (`SearchLessonsIndexDocSchema`, etc.), not
hardcoded strings — so they automatically detect drift when
`pnpm type-gen` produces new field shapes.

---

## Execution Plan

### Phase 0: Track 1a — Non-Search Shell-Only Reduction

**RED**: Add tests that assert non-search widget templates and
scripts do not consume tool payload fields or renderer map paths.
Run tests. They MUST fail against current mixed rendering state.

**GREEN**: Remove non-search payload rendering paths and keep
static branding-only shells. Run tests. They MUST pass.

**REFACTOR**: Reduce duplicated non-search widget logic, keep
boundaries clear, and update TSDoc/comments where needed.

**Likely files to change**:

- `apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`

**Deterministic validation**:

```bash
rg -n "toolOutput|toolResponseMetadata|TOOL_RENDERER_MAP|getRendererForTool" \
  apps/oak-curriculum-mcp-streamable-http/src/widget-*.ts \
  apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.ts

pnpm test --filter @oaknational/oak-curriculum-mcp-streamable-http
```

### Phase 1: B3 — Widget Field Fix (RED/GREEN/REFACTOR at all levels)

> See [TDD Phases component](../../templates/components/tdd-phases.md)

**E2E RED**: Update Playwright test fixtures in
`tests/widget/fixtures.ts` and `tests/widget/renderer-fixtures.ts`
to use the real SDK result shape:

- `SEARCH_OUTPUT_FIXTURE`: change from flat `{ lessonTitle }` to
  nested `{ lesson: { lesson_title, subject_slug, key_stage, lesson_url } }`
- `SEARCH_LESSONS_ARRAY_FIXTURE`: same transformation

Run Playwright tests. They MUST fail — the renderer will produce
"Untitled" cards.

**Unit RED**: Write unit tests for a field-extraction helper that
extracts title, subject, key stage, and URL from each scope's
result type. Tests should cover all four scopes. Run tests. They
MUST fail — the helper does not exist.

**GREEN**: Fix the search renderer to access the correct nested
fields. Implement scope-aware field extraction. The renderer must
handle all four scopes — each has a different nested property
(`lesson`, `unit`, `thread`, `sequence`). Run all tests. They
MUST pass.

**REFACTOR**: Remove fallback field chains
(`l.lessonTitle || l.title || l.slug || 'Untitled'`). Update TSDoc.

**Files to change**:

- `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/search-renderer.ts`
- `apps/oak-curriculum-mcp-streamable-http/tests/widget/fixtures.ts`
- `apps/oak-curriculum-mcp-streamable-http/tests/widget/renderer-fixtures.ts`

**Deterministic validation**:

```bash
pnpm test:ui
# Expected: Playwright search rendering tests pass with correct field access
```

### Phase 2: B4 — Suggest Rendering (RED/GREEN/REFACTOR at all levels)

**E2E RED**: Add a Playwright test fixture using the real
`SuggestionResponse` shape (`{ suggestions: [...], cache: {...} }`).
Write a test asserting suggestion items render with their text.
Run test. It MUST fail.

**Unit RED**: Write unit tests for suggest rendering logic.
Tests should verify that suggestion items are rendered as a list.
Run tests. They MUST fail.

**GREEN**: Add suggest-aware branching in the search renderer.
When data has `suggestions` property (and no `results`), render
suggestions. Update `widget-script.ts` fallback logic if needed
to recognise the suggest shape. Run all tests. They MUST pass.

**REFACTOR**: Add suggest fixture data file. Update TSDoc.

**Files to change**:

- `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/search-renderer.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts` (if fallback needs updating)
- `apps/oak-curriculum-mcp-streamable-http/tests/widget/renderer-fixtures.ts`

**Deterministic validation**:

```bash
pnpm test:ui
# Expected: Playwright suggest rendering test passes
```

### Phase 3: B2 — Contract Tests (RED/GREEN/REFACTOR)

**RED**: Write contract tests that validate the *fixed* renderer's
field access against generated index document types. For each scope:
assert that every field the renderer accesses exists on the
corresponding generated Zod schema (`SearchLessonsIndexDocSchema`,
`SearchUnitsIndexDocSchema`, `SearchThreadIndexDocSchema`,
`SearchSequenceIndexDocSchema`). Run tests. They MUST pass
(because the renderer was fixed in Phase 1). If they fail,
the renderer still has wrong field access — fix it.

**GREEN**: Contract tests are the deliverable. They catch
*future* drift, not current bugs (those were fixed in Phase 1).

**REFACTOR**: Add TSDoc explaining what the contract tests prove
and when they would fail (schema change without renderer update).

**Files to create/change**:

- New test file (location TBD — could be in the HTTP server's
  test directory or alongside the renderer)

**Deterministic validation**:

```bash
pnpm test --filter @oaknational/oak-curriculum-mcp-streamable-http
# Expected: contract tests pass
```

### Phase 4: Quality Gates + Review

> See [Quality Gates](../../templates/components/quality-gates.md)
> and [Adversarial Review](../../templates/components/adversarial-review.md)

Full quality gate chain from repo root:

```bash
pnpm clean
pnpm type-gen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

Invoke specialist reviewers:

- `code-reviewer` (gateway)
- `test-reviewer` (contract tests, fixture updates, TDD compliance)

---

## Non-Goals (YAGNI)

- **Redesigning the widget rendering architecture** — fix the
  field access, do not redesign the infrastructure.
- **Replacing the rendering system with React components** — this is
  explicitly deferred to Track 2, after the pre-merge window.
- **Track 2 research and ADR backlog expansion** — stays in
  [mcp-extensions-research-and-planning.md](../../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md).
- **Adding typed renderers in TypeScript** — the widget runs as
  a JS string template inside a ChatGPT sandbox. Type safety
  comes from contract tests, not from converting to TypeScript.
- **SDK-level type safety changes** — addressed in
  [search-dispatch-type-safety.md](../archive/completed/search-dispatch-type-safety.md).
- **W2-W8 warnings** — future workstreams.

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| B3 renderer fix breaks widget rendering for other scopes | Medium | Playwright tests catch regressions | E2E tests for all scopes before changing renderer |
| Playwright fixtures diverge from real SDK shapes again | Medium | Future schema changes break tests | Contract tests (B2) validate field existence against generated types |
| B4 suggest rendering conflicts with search renderer logic | Low | Suggest is a distinct data shape | Clear branching on `suggestions` vs `results` property |
| B2 contract tests are brittle against schema changes | Low | Tests derive from generated types | Import from Zod schemas, not hardcoded strings |

---

## Dependencies

**Execution dependency**: Tracks 1a and 1b are both defined in this
file and can execute in parallel where they do not modify the same
paths.
**Release dependency**: Upcoming merge is blocked until all Track
1a and Track 1b acceptance criteria in this file are complete.
**Note**: The dispatch plan (B1/W1) is complete and archived.
Even with improved dispatch typing in place, the renderer fixes in
this file remain independently required for correct ChatGPT widget
output.

**Related Plans**:

- [mcp-extensions-research-and-planning.md](../../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md) — Track 2 research, specialist, refactor, and future feature backlog
- [search-dispatch-type-safety.md](../archive/completed/search-dispatch-type-safety.md) — SDK-level B1+W1 (complete)
- [Phase 3a (archived)](../archive/completed/phase-3a-mcp-search-integration.md) — source of adversarial findings

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)
