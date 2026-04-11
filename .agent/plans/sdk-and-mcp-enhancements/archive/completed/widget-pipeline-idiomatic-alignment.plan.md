---
name: "Widget Pipeline Idiomatic Alignment"
overview: "Address all reviewer findings and validate widget pipeline against the official ext-apps basic-server-react example."
specialist_reviewer: "assumptions-reviewer, mcp-reviewer, architecture-reviewer-wilma, test-reviewer, type-reviewer, sentry-reviewer"
isProject: false
todos:
  - id: phase-a-t1-consolidate-annotation-tests
    content: "T1: Consolidate 4 individual annotation constant tests into single toEqual"
    status: done
  - id: phase-a-t2-startup-validation
    content: "T2: Add fail-fast startup validation for widget HTML existence"
    status: done
  - id: phase-a-t3-build-ordering-docs
    content: "T3: Document build ordering dependency (tsup clean + vite emptyOutDir)"
    status: done
  - id: phase-a-t4-sentry-wrapper-async
    content: "T4: Fix sentry-mcp wrapResourceHandler to support async handlers (Awaited<TResult>)"
    status: done
  - id: phase-a-t8-token-watcher-hardening
    content: "T8: Harden execSync token watcher — async exec, derive paths, guard existence"
    status: done
  - id: phase-b-t5-widget-observability
    content: "T5: Re-add Sentry observability to widget resource handler (blocked by T4)"
    status: done
  - id: phase-c-t9-idiomatic-validation
    content: "T9: End-to-end automated idiomatic validation against official example"
    status: done
---

# Widget Pipeline Idiomatic Alignment

**Last Updated**: 2026-04-08
**Status**: COMPLETE — all 7 tasks done, all reviewer findings resolved, 88/88 gates passing
**Scope**: Address all reviewer findings from adversarial review of the widget
pipeline against the official MCP ext-apps `basic-server-react` example.
**Branch**: `feat/mcp_app_ui` — pending manual checks (Vercel preview, widget-in-host, Claude Desktop)

---

## Context

The widget serving pipeline was aligned with the official MCP ext-apps
`basic-server-react` example during the PR #76 session. Flat tsup output,
async `readFile`, direct `registerAppResource` callback, and multi-entry
build are now in place. However, reviewer findings remain unaddressed.

**Official reference**: `github.com/modelcontextprotocol/ext-apps/tree/main/examples/basic-server-react`

### Reviewer Findings That Shaped This Plan

- **assumptions-reviewer**: T6 (`z.url()`) already resolved (40+ uses,
  ADR-145, codegen pipeline handles transforms) — dropped. T8 extraction
  violates "don't extract single-consumer abstractions" — kept inline.
  T2 path-based dev guard fragile — removed. T9 conflates automated and
  manual — split.
- **mcp-reviewer**: No MCP spec violations. CSP placement on `contents[]`
  items correct. `ui://` URI scheme correct. `registerAppResource` usage
  matches official API. Sentry wrapping compatible if it preserves
  `McpUiReadResourceCallback` type.
- **type-reviewer (plan)**: `Awaited<TResult>` is the correct fix for T4.
  All 3 wrappers share the bug — fixing all is proportionate.

### Scope Reduction (9 tasks to 7)

- **T6 dropped**: `z.url()` has 40+ uses, ADR-145 documents v3-to-v4,
  codegen handles transforms. No remaining work.
- **T7 merged into T9**: Build-output path verification is part of the
  automated acceptance gate, not a standalone task.

---

## Quality Gate Strategy

**Critical**: Run targeted gates after each task, full `pnpm check` after
each phase. SDK and library changes propagate across workspaces — filtered
runs miss cross-workspace regressions.

### After Each Task

```bash
pnpm type-check
pnpm lint:fix
pnpm test
```

### After Each Phase

```bash
pnpm check   # Canonical aggregate gate (88/88)
```

---

## Non-Goals (YAGNI)

- Extracting the token watcher to a separate module (single consumer)
- Adding `z.url()` documentation comments (already pervasive, ADR-145)
- Standalone build-output smoke test (covered by T9 automated validation)
- Generated tool `title` fields (deferred to codegen template change)
- Resource templates, prompt completion, per-primitive icons (future)

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md`
2. **Re-read** `.agent/directives/testing-strategy.md`
3. **Re-read** `.agent/directives/schema-first-execution.md`
4. **Ask**: "Could it be simpler without compromising quality?"
5. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Phase A: Independent Tasks (parallelisable)

### T1: Consolidate Annotation Tests

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/definition.unit.test.ts`

**Problem**: 4 individual `it` blocks assert `readOnlyHint`,
`destructiveHint`, `idempotentHint`, `openWorldHint` as separate boolean
literals (lines 20-34). Sibling files use a single `toEqual` on the full
object — a stronger contract that fails loudly if a field is added or
renamed.

**Target Implementation**:

```typescript
it('has annotations marking it as read-only and idempotent', () => {
  expect(GET_CURRICULUM_MODEL_TOOL_DEF.annotations).toEqual({
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  });
});
```

**Acceptance Criteria**:

1. Four individual `it` blocks replaced with single `toEqual` assertion
2. Test description matches sibling pattern: "has annotations marking it
   as read-only and idempotent"
3. All tests pass with consolidated assertion
4. No other test changes required

**Deterministic Validation**:

```bash
pnpm test --filter @oaknational/curriculum-sdk
# Expected: exit 0, all tests pass
```

**Reviewer**: `test-reviewer` after completion.

---

### T2: Startup Validation for Widget HTML

**Files**:

- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/application.ts`

**Problem**: No fail-fast check at server startup for missing widget HTML.
If the build step is skipped or fails silently, the first `resources/read`
call produces an opaque `ENOENT` error deep in the handler.

**Design** (revised per assumptions-reviewer):

- Export `WIDGET_HTML_PATH` from `register-resources.ts`
- Add `validateWidgetHtmlExists(widgetHtmlPath: string): void` — uses
  `existsSync`, throws descriptive error with resolution guidance
- Call in `initializeCoreEndpoints()` before `registerAllResources()`
- No dev-mode guard — the check runs always. E2E tests use
  `createStubbedHttpApp()` which bypasses bootstrap naturally.
- Inject path as parameter for testability (ADR-078)

**TDD Sequence**:

1. RED: Test `validateWidgetHtmlExists()` throws when file missing
2. GREEN: Implement with `existsSync` + descriptive throw
3. RED: Test succeeds when file exists
4. GREEN: Already passes

**Acceptance Criteria**:

1. `validateWidgetHtmlExists` exported and tested
2. Called in bootstrap before resource registration
3. Error message includes path and `pnpm build` guidance
4. E2E tests still pass (don't hit this code path)
5. Path injected as parameter, not read from module scope

**Deterministic Validation**:

```bash
pnpm type-check
pnpm test --filter @oaknational/oak-curriculum-mcp-streamable-http
pnpm test:e2e
# Expected: all exit 0
```

**Reviewer**: `architecture-reviewer-wilma` (startup placement),
`test-reviewer` (test quality).

---

### T3: Document Build Ordering Dependency

**Files**:

- `apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md`
- `turbo.json` (verify, not change)

**Problem**: The build ordering contract (tsup first, Vite second) is only
documented as a `//build` comment in `package.json`. If Turbo ever
parallelises sub-steps independently, the contract breaks silently.

**Content to Document**:

1. tsup runs first (`clean: true` nukes `dist/`)
2. Vite runs second (`emptyOutDir: false` preserves tsup output)
3. The `&&` in `"build": "tsup && pnpm build:widget"` enforces order
4. Turbo treats the entire `build` script as one atomic task — safe as-is
5. The turbo override at `@oaknational/oak-curriculum-mcp-streamable-http#build`
   includes both `widget/**` and `tsup.config.ts` in inputs

**Acceptance Criteria**:

1. Build ordering documented in `deployment-architecture.md`
2. TSDoc on `package.json` build script references the documentation
3. Turbo override verified as atomic (no sub-task parallelisation risk)

**Deterministic Validation**:

```bash
pnpm markdownlint:root
# Expected: exit 0
```

**Reviewer**: `docs-adr-reviewer` after completion.

---

### T4: Fix sentry-mcp `wrapResourceHandler` Async Types

**Files**:

- `packages/libs/sentry-mcp/src/wrappers.ts`
- `packages/libs/sentry-mcp/src/wrappers.unit.test.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/register-resource-helpers.ts`

**Problem**: All 3 wrappers (`wrapToolHandler`, `wrapResourceHandler`,
`wrapPromptHandler`) declare `Promise<TResult>` return type. When
`TResult = Promise<X>` (async handler), TypeScript sees
`Promise<Promise<X>>` — a double-Promise. Runtime is correct (`await`
collapses), but the type-level contract is wrong and prevents wrapping
async handlers like the widget resource callback.

The app-level wrapper in `register-resource-helpers.ts` compounds the
issue: handler param is `(...args: TArgs) => TResult` (sync only), return
type is `TResult | Promise<TResult>`.

**Fix**: `Awaited<TResult>` across all signatures:

| Function | Current Return | Fixed Return |
|----------|---------------|--------------|
| `observeMcpOperation<T>` | `Promise<T>` | `Promise<Awaited<T>>` |
| `wrapToolHandler` | `Promise<TResult>` | `Promise<Awaited<TResult>>` |
| `wrapResourceHandler` | `Promise<TResult>` | `Promise<Awaited<TResult>>` |
| `wrapPromptHandler` | `Promise<TResult>` | `Promise<Awaited<TResult>>` |
| App-level wrapper | `TResult \| Promise<TResult>` | `Promise<Awaited<TResult>>` |

App-level wrapper handler param also changes to accept
`(...args: TArgs) => Promise<TResult> | TResult`.

**TDD Sequence**:

1. RED: Add `satisfies` assertions in `wrappers.unit.test.ts` proving async
   handlers produce single-layer `Promise<X>` (type-check fails)
2. GREEN: Apply `Awaited<TResult>` to all 4 function signatures in
   `wrappers.ts`
3. Update app-level wrapper in `register-resource-helpers.ts`
4. Verify all downstream consumers still compile

**Acceptance Criteria**:

1. All 3 sentry-mcp wrappers use `Promise<Awaited<TResult>>`
2. `observeMcpOperation` uses `Promise<Awaited<T>>`
3. App-level wrapper accepts async handlers and returns `Promise<Awaited<TResult>>`
4. New `satisfies` tests prove single-layer Promise for async handlers
5. All existing tests pass unchanged
6. No type assertions (`as`) introduced

**Deterministic Validation**:

```bash
pnpm type-check
pnpm test --filter @oaknational/sentry-mcp
pnpm test --filter @oaknational/oak-curriculum-mcp-streamable-http
# Expected: all exit 0
```

**Reviewers**: `type-reviewer` (Awaited propagation), `sentry-reviewer`
(observability wrapper), `test-reviewer` (satisfies pattern).

---

### T8: Harden Token Watcher (inline, no extraction)

**File**: `apps/oak-curriculum-mcp-streamable-http/widget/vite.config.ts`

**Problem**: The `oak-design-tokens-watch` plugin (lines 43-76):

1. Uses `execSync` — blocks Vite dev server event loop during rebuilds
2. Hard-codes `cwd: resolve(widgetRoot, '../../..')` — fragile path
3. No validation that token source directory exists — silent failure

**Changes** (kept inline per single-consumer principle):

1. Replace `execSync` with `exec` from `node:child_process`, wrapped in
   a Promise for non-blocking execution
2. Replace hard-coded `../../..` with workspace root derived by walking
   up from `widgetRoot` to find `pnpm-workspace.yaml`
3. Add `existsSync` guard on `tokenSourceDir` — log warning via Vite
   logger and skip watcher setup if missing
4. Add rebuild lock (boolean flag) to prevent concurrent rebuilds

**Acceptance Criteria**:

1. `execSync` replaced with async `exec`
2. `cwd` derived from workspace root, not hard-coded relative path
3. Missing token directory produces a visible warning, not silent failure
4. Concurrent rebuild attempts are debounced/locked
5. Plugin still only applies in dev mode (`apply: 'serve'`)

**Deterministic Validation**:

```bash
pnpm type-check
pnpm lint:fix
# Expected: exit 0
```

**Reviewer**: `code-reviewer` gateway after completion.

---

## Phase B: Dependent Task

### T5: Re-add Widget Observability (blocked by T4)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`

**Problem**: The widget is the most user-visible resource and the only one
without Sentry tracing. It was excluded because `wrapResourceHandler`
couldn't handle async handlers (T4).

**Change**: Once T4 lands, wrap the widget resource's async callback with
`wrapResourceHandler` from `register-resource-helpers.ts`.

**Implementation**:

1. Add `observability` parameter to `registerWidgetResource()` signature
2. Update `ResourceRegistrationOptions` if needed
3. Wrap the async callback before passing to `registerAppResource`:

```typescript
const wrappedReadCallback = wrapResourceHandler(
  'widget-oak-curriculum-app',
  async () => ({
    contents: [{
      uri: WIDGET_URI,
      mimeType: RESOURCE_MIME_TYPE,
      text: await getWidgetHtml(),
      _meta: { ui: WIDGET_UI_META },
    }],
  }),
  observability,
);
registerAppResource(server, 'Oak Curriculum App', WIDGET_URI,
  { description: 'Interactive Oak curriculum MCP App ...' },
  wrappedReadCallback);
```

**Acceptance Criteria**:

1. Widget resource handler wrapped with `wrapResourceHandler`
2. Observability parameter threaded through from `registerAllResources`
3. Type-check passes — `McpUiReadResourceCallback` satisfied
4. E2E tests pass — widget resource still serves HTML correctly
5. Integration test for observability updated to include widget

**Deterministic Validation**:

```bash
pnpm type-check
pnpm test --filter @oaknational/oak-curriculum-mcp-streamable-http
pnpm test:e2e
# Expected: all exit 0
```

**Reviewers**: `sentry-reviewer` (observability coverage),
`mcp-reviewer` (protocol compliance with wrapper).

---

## Phase C: Acceptance Gate

### T9: Automated Idiomatic Validation

**Scope** (automated only — manual items are merge exit criteria):

1. **Build output**: `pnpm build` produces `dist/index.js` +
   `dist/application.js` + `dist/oak-banner.html`
2. **Resource read**: E2E test verifying `resources/read` for widget URI
   returns HTML with correct MIME type (`text/html;profile=mcp-app`)
3. **Tool linkage**: Verify tools with `_meta.ui.resourceUri` reference
   the widget URI
4. **Path resolution**: Verify built output's `import.meta.dirname`
   resolves widget HTML correctly (absorbs former T7)
5. **Observability**: All resources including widget have Sentry tracing

Extend existing E2E tests in `mcp-app-pipeline.e2e.test.ts` and
`server.e2e.test.ts` as needed.

**Manual Checklist** (merge exit criteria, tracked here but not automated):

- [ ] Vercel preview serves widget without `dist/dist/` bug
- [ ] Widget renders in basic-host via `dev-widget-in-host` script
- [ ] Claude Desktop shows widget when calling `get-curriculum-model`

**Acceptance Criteria**:

1. `pnpm check` passes (full 88/88 gate suite)
2. All automated validation points pass in E2E/smoke tests
3. No deferred reviewer findings remain

**Deterministic Validation**:

```bash
pnpm check
# Expected: exit 0, 88/88 gates
```

**Reviewers**: `mcp-reviewer` (final protocol compliance),
`code-reviewer` gateway (overall quality).

---

## Sequencing

```text
Phase A (parallel):  T1  T2  T3  T4  T8
                                  |
Phase B:                          +-> T5
                                       |
Phase C:              all above -------> T9
```

---

## Reviewer Invocation Plan

**During implementation** (extensive use per user directive):

| Task | Reviewers | Focus |
|------|-----------|-------|
| T1 | `test-reviewer` | Assertion pattern quality |
| T2 | `architecture-reviewer-wilma`, `test-reviewer` | Bootstrap placement, DI pattern |
| T3 | `docs-adr-reviewer` | Documentation completeness |
| T4 | `type-reviewer`, `sentry-reviewer`, `test-reviewer` | Awaited propagation, observability, satisfies tests |
| T5 | `sentry-reviewer`, `mcp-reviewer` | Observability coverage, protocol compliance |
| T8 | `code-reviewer` | Inline fix quality |
| T9 | `mcp-reviewer`, `code-reviewer` | Protocol compliance, overall quality |

**Before merge consideration**:

- `release-readiness-reviewer` for final go/no-go
- `assumptions-reviewer` to validate all findings addressed

---

## Critical Files

| File | Tasks |
|------|-------|
| `packages/libs/sentry-mcp/src/wrappers.ts` | T4 |
| `packages/libs/sentry-mcp/src/wrappers.unit.test.ts` | T4 |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/definition.unit.test.ts` | T1 |
| `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` | T2, T5 |
| `apps/oak-curriculum-mcp-streamable-http/src/register-resource-helpers.ts` | T4, T5 |
| `apps/oak-curriculum-mcp-streamable-http/src/application.ts` | T2 |
| `apps/oak-curriculum-mcp-streamable-http/widget/vite.config.ts` | T8 |
| `apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md` | T3 |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| `Awaited<TResult>` interacts with `withActiveSpan<T>` generics | T4 blocked | Verify `@oaknational/observability` accepts `Awaited<T>` |
| Widget wrapper changes MIME type or CSP behaviour | T5 regression | E2E test asserts exact MIME type and HTML content |
| Token watcher async exec introduces race conditions | T8 dev DX | Rebuild lock prevents concurrent builds |
| Vercel preview still has `dist/dist/` path bug | Merge blocked | Manual checklist item, validated before merge |

---

## Testing Strategy

### Unit Tests

**Existing Coverage**: Annotation tests, sentry wrapper tests, curriculum
model data tests, register-resources observability tests.

**New Tests Required**:

- `validateWidgetHtmlExists` — throws on missing, succeeds on present (T2)
- `satisfies` type assertions for async wrapper return types (T4)

### Integration Tests

**Existing Coverage**: `register-resources-observability.integration.test.ts`,
`register-resources.integration.test.ts`

**Modified Tests**:

- Observability integration test to include widget resource (T5)

### E2E Tests

**Existing Coverage**: `mcp-app-pipeline.e2e.test.ts`, `server.e2e.test.ts`

**Extended for T9**:

- Build output structure assertions
- Widget path resolution from built output
- All resources have observability spans

---

## Success Criteria

### Phase A

- All 5 independent tasks complete with targeted gates passing
- No deferred reviewer findings

### Phase B

- Widget resource has Sentry tracing matching all other resources
- Type-check passes without assertions

### Phase C

- `pnpm check` passes (88/88)
- All automated E2E/smoke validation points pass
- Manual checklist items validated

### Overall

- All 7 reviewer findings addressed — zero deferred items
- Widget pipeline matches official ext-apps pattern idiomatically
- Sentry observability covers all resources including widget
- Build ordering documented and protected

---

## Consolidation

After all work is complete and quality gates pass, run `/jc-consolidate-docs`
to graduate settled content, extract reusable patterns, rotate the napkin,
manage fitness, and update the practice exchange.
