---
name: Phase 5 resilience hardening
overview: Fix critical and important resilience gaps found by architecture reviews in the widget rendering system (Phase 5 of pre-merge widget stabilisation), using three-level TDD and the Result pattern where reasonable.
todos:
  - id: 5a-string-injection
    content: "Phase 5a: Fix C2 (CTA string injection) and I4 (tool name escaping) with JSON.stringify. TDD. Review: code-reviewer + security-reviewer."
    status: completed
  - id: 5b-scope-handling
    content: "Phase 5b: Fix I1 (scopeObj implicit default) and I3 (search scope fallback). TDD. Review: code-reviewer + test-reviewer."
    status: completed
  - id: 5c-error-containment
    content: "Phase 5c: Fix C1 (try/catch around renderer calls). Three-level TDD (Playwright + integration + unit). Review: code-reviewer + architecture-reviewer-wilma."
    status: completed
  - id: 5d-sync-enforcement
    content: "Phase 5d: Fix C3 (four-way sync enforcement tests). Extend unit tests to verify full TOOL_RENDERER_MAP -> RENDERER_IDS -> RENDERERS chain."
    status: completed
  - id: 5e-zod-fixtures
    content: "Phase 5e: Fix I2 (browse/explore Zod fixture validation). Add builders to fixture-builder.ts, update integration tests."
    status: completed
  - id: 5f-docs-gates-reviews
    content: "Phase 5f: Document I5 as intentional, update plan status, run full quality gates, invoke final specialist reviews."
    status: completed
isProject: false
---

# Phase 5: Widget Resilience Hardening

## Context

Phases 0-4 of widget stabilisation are complete. Architecture reviewers (Barney, Betty, Wilma) identified 3 critical and 5 important findings. This plan fixes them with three-level TDD, using `Result<T, E>` where reasonable per [ADR-088](docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md).

All widget renderers are JavaScript string templates evaluated in the ChatGPT sandbox via `new Function()`. The Result pattern applies at the **TypeScript generation layer**, not within the sandbox JS itself (which has no access to `@oaknational/result`).

## Findings Triage

### Critical (merge-blocking)

- **C1**: No try/catch around `renderer(fullData)` in `[widget-script.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts)` line 98 -- one renderer error crashes all tools
- **C2**: CTA config string injection in `[js-generator.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-cta/js-generator.ts)` lines 44-50 -- `id`, `buttonText`, `loadingText`, `understoodText` unescaped in single-quoted JS strings
- **C3**: Incomplete four-way sync enforcement in `[widget-renderer-registry.unit.test.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.unit.test.ts)` -- missing chain validation

### Important

- **I1**: `scopeObj` in `[helpers.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/helpers.ts)` line 34 silently defaults unknown scopes to `'sequence'`
- **I2**: Browse/explore contract tests lack Zod schema validation (vs search which has it)
- **I3**: Search renderer scope fallback in `[search-renderer.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/search-renderer.ts)` line 42 -- absent `d.scope` maps to `'results'`, which hits I1's bad default
- **I4**: Tool names in `[widget-script-state.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-script-state.ts)` line 25 interpolated without escaping
- **I5**: Explore renderer omits `sequences` scope -- **confirmed intentional** (tool only searches lessons/units/threads per `[execution.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/execution.ts)` line 70). Document only, no code change.

## Result Pattern Application

Per [ADR-088](docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md), `Result<T, E>` is for **expected failure modes** where callers need to make decisions. Assessment:

- **C2/I4 (JS generation)**: Refactor `generateCtaConfigEntry` and `generateToolRendererMapJs` to use `JSON.stringify` for safe serialisation. This eliminates the failure mode entirely (prevention > error handling). Result not needed -- there is no expected failure mode after the fix.
- **C1 (renderer error containment)**: The fix is a try/catch in embedded sandbox JS. The TypeScript layer already produces valid JS (enforced by the parse check test). Result does not apply to vanilla JS in the sandbox.
- **C3, I1, I3**: Test and logic corrections. No I/O boundary, no expected failure modes. Result not applicable.
- **I2 (Zod validation)**: Zod `.parse()` throws on invalid fixtures. This is a **programming error** (test fixture is wrong), not an expected runtime failure. Per ADR-088, exceptions are correct for programming errors. Result not applicable.

**Summary**: The Result pattern does not naturally apply to any Phase 5 finding. The fixes are about prevention (escaping), containment (try/catch in sandbox JS), correctness (scope handling), and test enforcement. The user's instruction is honoured -- we applied the assessment, and the answer is "not reasonable here."

## Execution Order

Findings are grouped by dependency and relatedness. Each group uses three-level TDD: RED (test exposes the problem), GREEN (minimal fix), REFACTOR (TSDoc, cleanup).

### Phase 5a -- String injection prevention (C2 + I4)

Both are the same class of bug: unescaped strings interpolated into generated JS. Fix together.

**C2 fix** in `[js-generator.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-cta/js-generator.ts)`:

Replace the hand-assembled object literal in `generateCtaConfigEntry` with `JSON.stringify` for the entire CTA config object. This safely handles all special characters (single quotes, backslashes, template literal syntax) in all fields. The existing `escapeForTemplateLiteral` remains for the `prompt` field which uses template literal syntax.

RED tests:

- Unit test: CTA with single-quote label (e.g. `"Teacher's guide"`) parses and executes correctly
- Unit test: CTA with backslash in label parses correctly

**I4 fix** in `[widget-script-state.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-script-state.ts)`:

Replace hand-assembled object literal in `generateToolRendererMapJs` with `JSON.stringify` on the map object. Build a plain object from `TOOL_RENDERER_MAP` entries, then `JSON.stringify` it.

RED tests:

- Unit test: tool name containing `'` produces parseable JS

**Reviewer checkpoint**: Invoke `code-reviewer` + `security-reviewer` after this phase (XSS/injection scope).

### Phase 5b -- Scope handling corrections (I1 + I3)

I3 depends on I1. Fix I1 first.

**I1 fix** in `[helpers.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/helpers.ts)`:

Change `scopeObj` to return `null` for unknown scopes instead of defaulting to `'sequence'`:

```javascript
function scopeObj(r, scope) {
  var key = scope === 'lessons' ? 'lesson'
    : scope === 'units' ? 'unit'
    : scope === 'threads' ? 'thread'
    : scope === 'sequences' ? 'sequence'
    : null;
  return (key && r && r[key]) || null;
}
```

RED tests in `[helpers.unit.test.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/helpers.unit.test.ts)`:

- `scopeObj({sequence: {...}}, 'unknown-scope')` returns `null` (currently returns the sequence object)
- `extractTitle({}, 'unknown-scope')` returns `'Untitled'` (currently returns wrong data)

**I3 fix** in `[search-renderer.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/search-renderer.ts)`:

When `d.scope` is absent, use neutral display label `'results'` but do NOT pass it to `scopeObj`. Instead, for title extraction when scope is unknown, fall back to checking common title fields directly.

RED tests in `[renderer-contracts.integration.test.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/renderer-contracts.integration.test.ts)`:

- Search data without `scope` field renders results without crashing (titles show correctly or "Untitled")

**Reviewer checkpoint**: Invoke `code-reviewer` + `test-reviewer`.

### Phase 5c -- Renderer error containment (C1)

**C1 fix** in `[widget-script.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts)`:

Wrap `renderer(fullData)` in try/catch at line 98. On error, show a neutral fallback message and log to `console.error`:

```javascript
if (renderer) {
  try {
    if (c) c.innerHTML = renderer(fullData);
    if (ftr) ftr.style.display = '';
  } catch (e) {
    if (c) c.innerHTML = '<div class="empty">Unable to display results.</div>';
    if (ftr) ftr.style.display = 'none';
    console.error('Renderer error:', e);
  }
} else {
  // ... existing neutral shell
}
```

RED tests:

- **Playwright E2E**: Inject a tool output that causes a renderer to throw (e.g. override `renderSearch` to throw in the page context). Assert: fallback message visible, no crash, other widget elements still render.
- **Integration test**: Create a renderer harness variant that throws, verify error containment.
- **Unit test** (parse check): Verify the try/catch structure parses correctly (existing parse test covers this).

**Reviewer checkpoint**: Invoke `code-reviewer` + `architecture-reviewer-wilma` (resilience finding originator).

### Phase 5d -- Four-way sync enforcement (C3)

**C3 fix** in `[widget-renderer-registry.unit.test.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.unit.test.ts)`:

Extend the sync tests to verify the full chain:

1. Every `TOOL_RENDERER_MAP` value is in `RENDERER_IDS`
2. Every `RENDERER_IDS` entry has a corresponding function in `RENDERERS` (existing)
3. Every `RENDERER_IDS` entry has a corresponding `render{Id}` function in the concatenated JS

RED tests:

- Add a test asserting `TOOL_RENDERER_MAP` values are subset of `RENDERER_IDS`
- Add a test asserting each `RENDERER_IDS` entry has a function named `render{capitalise(id)}` in the widget JS string

### Phase 5e -- Browse/explore Zod fixture validation (I2)

**I2 fix** in `[fixture-builder.ts](apps/oak-curriculum-mcp-streamable-http/tests/widget/fixture-builder.ts)`:

Add `buildBrowseFixture` and `buildExploreFixture` builder functions. For browse, use the `SequenceFacet` type from the SDK. For explore, use `SearchLessonsIndexDoc` / `SearchUnitsIndexDoc` / `SearchThreadIndexDoc` types (already imported for search fixtures).

Update browse and explore integration tests to use these builders instead of inline object literals. Add Zod schema validation where schemas are available (e.g. `SequenceFacetSchema` for browse facets).

RED tests:

- Replace inline fixtures with builder calls; verify tests still pass
- Add Zod `.parse()` call in builder; verify it validates

### Phase 5f -- Documentation and I5

- Document I5 (explore omits sequences) as intentional in `[explore-renderer.ts](apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/explore-renderer.ts)` TSDoc
- Update the widget plan status to Phase 5 complete
- Run full quality gate chain
- Invoke specialist reviewers (final round)

## Quality Gates

Run after all phases complete (or after each phase if preferred):

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

## Specialist Reviews

After Phase 5 completion, invoke:

- `code-reviewer` (gateway -- always)
- `security-reviewer` (C2/I4 are injection findings)
- `test-reviewer` (C3, I2 are test infrastructure)
- `architecture-reviewer-wilma` (C1 was Wilma's critical finding)
- `docs-adr-reviewer` (documentation updates)

Intermediate reviews after 5a and 5c as noted above, to catch issues early and address findings immediately rather than deferring.

## Files Changed (Anticipated)

| File                                                        | Finding | Change                                  |
| ----------------------------------------------------------- | ------- | --------------------------------------- |
| `src/widget-cta/js-generator.ts`                            | C2      | `JSON.stringify` for CTA config         |
| `src/widget-cta/js-generator.ts` (test)                     | C2      | New unit test for single-quote labels   |
| `src/widget-script-state.ts`                                | I4      | `JSON.stringify` for tool renderer map  |
| `src/widget-renderers/helpers.ts`                           | I1      | Explicit scope whitelist in `scopeObj`  |
| `src/widget-renderers/helpers.unit.test.ts`                 | I1      | Tests for unknown scope handling        |
| `src/widget-renderers/search-renderer.ts`                   | I3      | Handle absent scope without bad default |
| `src/widget-script.ts`                                      | C1      | try/catch around renderer call          |
| `src/widget-renderer-registry.unit.test.ts`                 | C3      | Full chain sync assertions              |
| `tests/widget/fixture-builder.ts`                           | I2      | Browse/explore builders                 |
| `src/widget-renderers/browse-renderer.integration.test.ts`  | I2      | Use builders + Zod                      |
| `src/widget-renderers/explore-renderer.integration.test.ts` | I2      | Use builders + Zod                      |
| `src/widget-renderers/explore-renderer.ts`                  | I5      | TSDoc only                              |
| `tests/widget/widget-rendering.spec.ts`                     | C1      | Playwright error containment test       |
