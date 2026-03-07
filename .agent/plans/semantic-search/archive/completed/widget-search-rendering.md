---
name: "Pre-Merge Widget Stabilisation"
overview: "Pre-merge widget stabilisation plan (Tracks 1a + 1b): fix search/browse/explore widget rendering, harden resilience gaps found by architecture reviews. Three-level TDD throughout."
todos:
  - id: phase-0-deletion-and-infra
    content: "Phase 0: Track 1a — delete 18 non-search-family renderers, fix Record<string,...> type violations, add build-time JS parse check, create renderer test harness."
    status: completed
  - id: phase-1-search-alignment
    content: "Phase 1: Search renderer alignment — B3 field fix, B4 suggest, multi-scope helpers, comprehensive contract tests. Three-level TDD."
    status: completed
  - id: phase-2-browse-renderer
    content: "Phase 2: Browse renderer — new browse-curriculum renderer + integration contract tests. Three-level TDD."
    status: completed
  - id: phase-3-explore-renderer
    content: "Phase 3: Explore renderer — new explore-topic renderer + integration contract tests. Three-level TDD."
    status: completed
  - id: phase-4-quality-gates
    content: "Phase 4: Full quality gate chain + specialist reviews."
    status: completed
  - id: phase-5-resilience
    content: "Phase 5: Fix critical and important resilience gaps from architecture reviews. Three-level TDD."
    status: completed
isProject: false
---

# Pre-Merge Widget Stabilisation

**Last Updated**: 2026-02-22
**Status**: COMPLETE — All phases (0-5) complete. Phase 5
resilience hardening addressed all critical and important findings.
**Merge-blocking**: Yes — critical resilience gaps must be
resolved before merge.

---

## Standalone Session Bootstrap

**Session entry point**:
[semantic-search.prompt.md](../../../prompts/semantic-search/semantic-search.prompt.md)
provides broader context (architecture, search landscape, quality
gates, mandatory reading). Start there, then return here for
execution.

1. Re-read foundation directives before code changes:
   - [principles.md](../../../directives/principles.md)
   - [testing-strategy.md](../../../directives/testing-strategy.md)
   - [schema-first-execution.md](../../../directives/schema-first-execution.md)
2. Confirm current working context:

   ```bash
   git status --short
   ls -1 .agent/plans/semantic-search/active
   ```

3. Read the widget rendering architecture documentation in the
   HTTP MCP server README (permanent location for all widget
   architecture docs):
   [README.md — Widget Rendering Architecture](../../../../apps/oak-curriculum-mcp-streamable-http/README.md)

---

## What Was Done (Phases 0-4)

Phases 0-4 implemented Tracks 1a + 1b with genuine three-level
TDD. Full implementation details are in git history.

- **Phase 0**: Deleted 18 non-search-family renderers, created
  neutral shell, renderer test harness, fixture builder,
  `Record<string,...>` type fixes, ESLint restricted types
  expanded, dead code removed, type assertions eliminated.
- **Phase 1**: Multi-scope search rendering (4 scopes + suggest),
  field-extraction helpers, Zod contract tests, XSS hardening
  (single-quote escaping), `rel="noopener noreferrer"` on all
  links.
- **Phase 2**: Browse renderer for `browse-curriculum` tool
  (camelCase SequenceFacet fields), 8 integration tests.
- **Phase 3**: Explore renderer for `explore-topic` tool
  (multi-scope with ok/error per scope), 9 integration tests,
  reuses Phase 1 field-extraction helpers.
- **Phase 4**: Full quality gate chain, specialist reviews
  (code-reviewer, test-reviewer, type-reviewer,
  architecture-reviewer-barney, architecture-reviewer-betty,
  architecture-reviewer-wilma).

All quality gates pass: type-check, lint, 9 test suites,
19 Playwright E2E.

---

## Phase 5: Resilience Hardening (Next Steps)

Architecture reviews (Barney, Betty, Wilma) identified critical
and important issues that must be fixed before merge. We do not
defer important work.

### Critical Findings

#### C1: No try/catch around renderer calls

**Location**: `widget-script.ts` line ~97

**Problem**: `renderer(fullData)` is not wrapped in `try/catch`.
Any runtime error (e.g. accessing a property on `undefined` or
unexpected data shape) propagates and crashes the entire widget
script. No error reporting, no fallback.

**Impact**: One bad tool output or one bug in any renderer breaks
all tools for all users.

**Fix**: Wrap `renderer(fullData)` in `try/catch`. On error,
show a neutral fallback ("Unable to display results") and log to
`console.error`. Use three-level TDD: write a Playwright test
that asserts error containment, then an integration test, then
implement.

**Files**: `src/widget-script.ts`

#### C2: CTA config string injection

**Location**: `src/widget-cta/js-generator.ts` lines 44-50

**Problem**: Only `prompt` is escaped via `escapeForTemplateLiteral`.
`id`, `buttonText`, `loadingText`, `understoodText` are interpolated
into JS string literals without escaping. A single quote in any of
these (e.g. `"Teacher's guide"`) breaks the generated JS and the
entire widget.

**Impact**: Same as C1 — one bad CTA config breaks all tools.

**Fix**: Escape all string values for JS string literals before
interpolation, or use `JSON.stringify` for the entire CTA config
object. TDD: write a unit test with a single-quote CTA label,
verify it parses and executes correctly.

**Files**: `src/widget-cta/js-generator.ts`

#### C3: Four-way sync — incomplete test enforcement

**Location**: `widget-renderer-registry.unit.test.ts`

**Problem**: The execution test checks that `RENDERER_IDS` have
corresponding functions in `RENDERERS`, but does not:

- Assert every `TOOL_RENDERER_MAP` value maps to a `RENDERER_IDS` entry
- Assert every `RENDERER_IDS` entry has a corresponding renderer
  in `WIDGET_RENDERER_FUNCTIONS`

**Impact**: A missing renderer function causes `ReferenceError` in
the sandbox, breaking ALL tools.

**Fix**: Extend the test to verify the full chain:
`TOOL_RENDERER_MAP` values ⊆ `RENDERER_IDS`, every ID has a
function in the concatenated JS. TDD.

**Files**: `src/widget-renderer-registry.unit.test.ts`

### Important Findings

#### I1: `scopeObj` implicit default for unknown scopes

**Location**: `src/widget-renderers/helpers.ts` lines 31-35

**Problem**: Unknown scopes silently default to `'sequence'` key.
A new scope or a typo would return `result.sequence` when the data
is in `result.lesson`, producing wrong or empty titles.

**Fix**: Explicit scope whitelist; return `null` for unknown values:

```javascript
var key = scope === 'lessons' ? 'lesson'
  : scope === 'units' ? 'unit'
  : scope === 'threads' ? 'thread'
  : scope === 'sequences' ? 'sequence'
  : null;
return (key && r && r[key]) || null;
```

**Files**: `src/widget-renderers/helpers.ts`, `helpers.unit.test.ts`

#### I2: Browse/explore contract tests lack Zod schema validation

**Location**: `browse-renderer.integration.test.ts`,
`explore-renderer.integration.test.ts`

**Problem**: Search contract tests parse fixtures through SDK Zod
schemas; browse and explore use hand-authored fixture literals with
no schema validation. Schema drift risk is higher for these two.

**Fix**: Extend `fixture-builder.ts` with browse/explore builders
derived from SDK types. Add Zod validation where schemas are
available (e.g. `SequenceFacetSchema` for browse). TDD.

**Files**: `tests/widget/fixture-builder.ts`,
`browse-renderer.integration.test.ts`,
`explore-renderer.integration.test.ts`

#### I3: Search renderer scope fallback

**Location**: `search-renderer.ts` line ~41

**Problem**: When `d.scope` is undefined, `scopeLabel` becomes
`'results'`. `scopeObj(r, 'results')` then uses the default
fallback and treats results as sequences. If the API returns
lessons without a scope, titles will be wrong.

**Fix**: If `d.scope` is absent, either infer it from the result
structure or treat as unknown scope and use neutral display.

**Files**: `src/widget-renderers/search-renderer.ts`

#### I4: Tool name escaping in `generateToolRendererMapJs`

**Location**: `src/widget-script-state.ts` lines 21-29

**Problem**: Tool names and renderer IDs are interpolated into
generated JS without escaping. A future tool name containing `'`
or `\` would break the generated JS.

**Fix**: Use `JSON.stringify` for the map object, or escape
keys and values. TDD.

**Files**: `src/widget-script-state.ts`

#### I5: Explore renderer omits sequences scope

**Location**: `src/widget-renderers/explore-renderer.ts` line 18

**Problem**: `var scopes = ['lessons', 'units', 'threads']` —
the explore-topic tool could add `sequences` in the future,
and they would not be rendered.

**Fix**: Document as intentional and add a comment, OR add
`sequences` defensively. Check the actual explore-topic tool
implementation to determine whether sequences are returned.

**Files**: `src/widget-renderers/explore-renderer.ts`

### Suggestions (Lower Priority)

- De-duplicate repeated card/link HTML assembly across renderers
  into a shared helper function to reduce patch fan-out for
  security fixes (e.g. `rel` attributes were fixed in 3 places)
- Add dispatch-level E2E Playwright coverage for
  `browse-curriculum` and `explore-topic` tool names
- Normalise data at MCP tool boundary (Track 2 preparation):
  renderers should not know about snake_case vs camelCase

### Execution Approach for Phase 5

Use genuine three-level TDD per finding:

1. **RED**: Write tests that expose the problem (e.g. renderer
   throws → Playwright test shows crash; CTA with single quote
   → unit test shows parse failure)
2. **GREEN**: Implement the minimal fix
3. **REFACTOR**: Clean up, update TSDoc

Run full quality gates after all fixes:

```bash
pnpm type-check
pnpm lint:fix
pnpm test
pnpm test:ui
```

Invoke specialist reviewers after Phase 5:

- `code-reviewer` (gateway)
- `security-reviewer` (XSS and injection findings)

---

## Reference Documentation

Widget rendering architecture, data shapes, sandbox
dependencies, edge cases, and known resilience gaps are
documented permanently in the HTTP MCP server README:

[README.md — Widget Rendering Architecture](../../../../apps/oak-curriculum-mcp-streamable-http/README.md)

---

## Related Plans

- [../../../sdk-and-mcp-enhancements/roadmap.md](../../../sdk-and-mcp-enhancements/roadmap.md) — Track 2 research and post-merge extensions
- [search-dispatch-type-safety.md](../archive/completed/search-dispatch-type-safety.md) — SDK-level B1+W1 (complete)
- [Phase 3a (archived)](../archive/completed/phase-3a-mcp-search-integration.md) — source of adversarial findings

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)
