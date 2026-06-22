---
name: "Generate widget HTML as committed TypeScript constant"
overview: "Replace runtime filesystem reads with a codegen-time committed constant, consumed via DI"
todos:
  - id: phase-0-remove-instrumentation
    content: "Phase 0: Remove debug instrumentation and verify clean baseline."
    status: complete
  - id: phase-1-codegen-pipeline
    content: "Phase 1: Widget build produces committed TypeScript constant."
    status: complete
  - id: phase-2-di-and-cleanup
    content: "Phase 2: Wire constant via DI, delete filesystem code."
    status: complete
  - id: phase-3-tests-gates-docs
    content: "Phase 3: Tests, quality gates, documentation, verification."
    status: complete
---

# Generate Widget HTML as Committed TypeScript Constant

**Last Updated**: 2026-04-10
**Status**: COMPLETE (all phases executed, all gates green, ADR-156 created)
**Scope**: Widget HTML follows the same codegen pattern as all other
generated metadata — committed TypeScript constant, consumed via DI.

---

## Context

### Root Cause (runtime-evidence-confirmed)

The Express MCP HTTP server crashes on every Vercel preview deployment
during `initializeCoreEndpoints`. The error:

```
Widget HTML not found at /var/task/dist/oak-banner.html
```

Two confirmed failure modes:

1. **H2 (cwd/path mismatch)**: `process.cwd()` on Vercel Lambda =
   `/var/task`, not the app package directory.
2. **H1 (bundle tracing)**: Vercel NFT only bundles files reachable
   via static `import`/`require`. `oak-banner.html` is read via
   `readFile` so NFT may not include it.

### Architectural Deviation

The widget HTML is the **only** piece of MCP resource content that
uses runtime filesystem I/O. Every other resource follows the
established codegen pattern:

- `getDocumentationContent()` — SDK constant, no I/O
- `getCurriculumModelJson()` — SDK constant, no I/O
- `WIDGET_URI` — generated at sdk-codegen time, committed `.ts`

The widget HTML should follow the same pattern: generate at codegen
time, produce a committed TypeScript constant, consume via DI.

---

## Architecture Review History

### Round 1 (4 architecture reviewers)

- B1 (Fred): ~18 test files need cleanup
- B2 (Fred): `getWidgetHtml` async→sync type alignment
- B3 (Barney): `src/` must not import `.widget-build/` directly
- H1 (Wilma): `tsx` dev mode won't resolve `.html` imports
- H3 (Betty): `static-content.ts` has same `process.cwd()` bug

### Round 2 (8 reviewers total)

All findings incorporated plus user corrections:

- `.html` import constraints → **dissolved** (committed `.ts` file)
- esbuild text loader complexity → **dissolved** (regular import)
- Dev/prod divergence → **dissolved** (everyone imports same file)
- `import-x/no-unresolved` on `.html` → **dissolved** (`.ts` file)
- Turbo `type-check`/`lint` ordering → **dissolved** (committed)
- TDD sequence (Fred B2-NEW) → preserved in task ordering
- DI preservation → **confirmed by user** (ADR-078, always DI)

---

## Solution Architecture

### Governing Principles

> "No shims, no hacks, no workarounds — Do it properly or do
> something else."

> "ALL the heavy lifting MUST happen at sdk-codegen time... All the
> apps are simple consumers."

> DI is always used because it enables testing with trivial fakes
> (ADR-078).

### Key Insight (user-originated)

This repo is a machine for building codegen-time SDKs consumed by
thin runtime apps. The widget HTML is just another form of generated
metadata associated with an MCP tool — same as `WIDGET_URI`, tool
descriptions, documentation content. Codegen uses build steps (Vite
compiles React); the output is a committed TypeScript constant
consumed by the runtime build. The runtime build (tsup) just imports
it. Same pattern as `pnpm sdk-codegen` producing `widget-constants.ts`.

### Design

```
Codegen phase (build:widget — output committed to git):
  Vite → .widget-build/oak-banner.html (intermediate, gitignored)
  embed script → src/generated/widget-html-content.ts (committed)

Runtime build (tsup — consumes committed constant):
  import { WIDGET_HTML_CONTENT } from './generated/...'
  (normal .ts import — no special loaders)

Production entry (index.ts):
  import { WIDGET_HTML_CONTENT } from './generated/...'
  createApp({ ..., getWidgetHtml: () => WIDGET_HTML_CONTENT })

Dev entry (http-dev.ts — same committed constant):
  import { WIDGET_HTML_CONTENT } from '../../src/generated/...'
  createApp({ ..., getWidgetHtml: () => WIDGET_HTML_CONTENT })

Tests (trivial fakes via DI):
  createApp({ ..., getWidgetHtml: () => '<html>test</html>' })
```

### Why DI is preserved

The constant provides the VALUE. DI provides TESTABILITY. Tests
inject `() => '<html>test</html>'` as a trivial fake — no build
dependency, no filesystem. This follows ADR-078 and matches how
every other injected dependency works in this codebase.

### DI Chain (3 hops, fully specified)

```
CreateAppOptions.getWidgetHtml: () => string
  ↓ (application.ts passes to handlerOptions)
RegisterHandlersOptions.getWidgetHtml: () => string
  ↓ (handlers.ts passes to registerAllResources)
ResourceRegistrationOptions.getWidgetHtml: () => string
  ↓ (register-widget-resource.ts calls in resource handler)
```

### What Disappears (vs esbuild-loader plan)

- No esbuild `.html` text loader in `tsup.config.ts`
- No `src/html.d.ts` declaration file for `.html` modules
- No dev/prod divergence (everyone imports the same committed `.ts`)
- No "only import in entry point" constraint
- No `readFileSync` in dev mode
- All reviewer concerns about `.html` resolution are dissolved

### Breaking API Changes

- `CreateAppOptions`: ADD `getWidgetHtml: () => string` (required)
- `CreateAppOptions`: REMOVE `validateWidgetHtml`
- `RegisterHandlersOptions`: ADD `getWidgetHtml: () => string`
- `ResourceRegistrationOptions.getWidgetHtml`: CHANGE from
  `() => Promise<string>` to `() => string`
- REMOVE exports: `WIDGET_HTML_PATH`, `readBuiltWidgetHtml`,
  `resolveWidgetHtmlPath`

### Non-Goals (YAGNI)

- Fixing `static-content.ts` `process.cwd()` (separate follow-up)
- Runtime HTML reloading or hot-swap
- Widget HTML from external URLs

---

## Resolution Plan

### Phase 0: Remove Debug Instrumentation (COMPLETE)

Removed all debug log blocks from `src/application.ts`,
`src/validate-widget-html.ts`, `src/register-widget-resource.ts`.

---

### Phase 1: Widget Build Produces Committed TypeScript Constant

#### Task 1.1: Change Vite output to intermediate directory

`widget/vite.config.ts`: Change `outDir` to
`resolve(widgetRoot, '..', '.widget-build')`. Set `emptyOutDir: true`.
`.widget-build/` is gitignored (intermediate artefact).

Add `.widget-build/` to app `.gitignore`.
Update `clean` script: `rm -rf dist .turbo .widget-build`.

#### Task 1.2: Create embed script

Create `scripts/embed-widget-html.js` (~15 lines):

1. Read `.widget-build/oak-banner.html`
2. Escape backticks and `${` for template literal safety
3. Write `src/generated/widget-html-content.ts`:

```typescript
/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Built widget HTML content generated by the widget build step.
 * Re-generate by running: pnpm build:widget
 *
 * @see widget/vite.config.ts - Widget build configuration
 * @see widget/oak-banner.html - Widget entry point
 */
export const WIDGET_HTML_CONTENT = `...` as const;
```

This file is committed to git, like `widget-constants.ts`.

#### Task 1.3: Update build:widget script

```json
"build:widget": "vite build --config widget/vite.config.ts && node scripts/embed-widget-html.js"
```

#### Task 1.4: Decouple widget codegen from runtime build

`build:widget` is a codegen step — its output is committed.
The runtime `build` script no longer needs to run it:

```json
"build": "tsup"
```

`build:widget` runs separately (like `pnpm sdk-codegen`) when
widget sources change, and its output is committed.

**Acceptance Criteria**:

1. `pnpm build:widget` produces `src/generated/widget-html-content.ts`
2. The generated file is a valid TypeScript module with the HTML
3. `tsc`, `vitest`, `tsx` all resolve it (regular `.ts` import)
4. `pnpm build` (tsup only) succeeds using the committed constant
5. `.widget-build/` is gitignored; `src/generated/widget-html-content.ts` is committed

**Phase 1 validation**: `pnpm build:widget && pnpm build && pnpm type-check`

---

### Phase 2: Wire Constant via DI, Delete Filesystem Code

**TDD ordering**: Update tests FIRST (Tasks 2.1–2.2), then change
interfaces (Tasks 2.3–2.4), then implement (Tasks 2.5–2.7), then
delete dead code (Tasks 2.8–2.10).

#### Task 2.1: Update integration tests for sync getWidgetHtml (RED)

In `src/register-resources.integration.test.ts` and
`src/register-resources-observability.integration.test.ts`:

Change `async () => TEST_WIDGET_HTML` to `() => TEST_WIDGET_HTML`.

#### Task 2.2: Update E2E test helpers to provide getWidgetHtml

Both `create-stubbed-http-app.ts` and `create-live-http-app.ts`
will need `getWidgetHtml: () => '<html>test</html>'` once it
becomes required on `CreateAppOptions`.

#### Task 2.3: Change getWidgetHtml to synchronous (GREEN)

In `src/register-resource-helpers.ts`:

**Current**: `readonly getWidgetHtml: () => Promise<string>;`
**Target**: `readonly getWidgetHtml: () => string;`

Remove `await` from call site in `register-widget-resource.ts`.

#### Task 2.4: Add getWidgetHtml to CreateAppOptions and
RegisterHandlersOptions

In `src/application.ts`:

- ADD `readonly getWidgetHtml: () => string` to `CreateAppOptions`
- REMOVE `readonly validateWidgetHtml?` from `CreateAppOptions`
- REMOVE `validateWidgetHtmlExists` import and `WIDGET_HTML_PATH`
- REMOVE the validation call in `initializeCoreEndpoints`
- Pass `options.getWidgetHtml` through `handlerOptions`

In `src/handlers.ts`:

- ADD `readonly getWidgetHtml: () => string` to
  `RegisterHandlersOptions`
- Use `options.getWidgetHtml` instead of `readBuiltWidgetHtml`
- REMOVE `readBuiltWidgetHtml` import

#### Task 2.5: Wire constant in production entry point

In `src/index.ts`:

```typescript
import { WIDGET_HTML_CONTENT } from './generated/widget-html-content.js';

const app = await createApp({
  runtimeConfig: config,
  observability,
  getWidgetHtml: () => WIDGET_HTML_CONTENT,
});
```

#### Task 2.6: Wire constant in dev entry point

In `operations/development/http-dev.ts` (or wherever `createApp`
is called for dev): same import of the committed constant.

```typescript
import { WIDGET_HTML_CONTENT } from '../../src/generated/widget-html-content.js';
```

#### Task 2.7: Rewrite register-widget-resource.ts

Remove: `resolveWidgetHtmlPath`, `WIDGET_HTML_PATH`,
`readBuiltWidgetHtml`, `readFile`/`resolve` imports.

Retain: `registerWidgetResource`, `WIDGET_UI_META`, resource
registration logic.

Update TSDoc to describe the codegen constant + DI pattern.

#### Task 2.8: Update register-resources.ts re-exports

Remove: `WIDGET_HTML_PATH`, `readBuiltWidgetHtml`.

#### Task 2.9: Delete dead code files

- `src/validate-widget-html.ts`
- `src/validate-widget-html.unit.test.ts`
- `src/test-helpers/widget-html-validation.ts`

#### Task 2.10: Cascade cleanup — remove skipWidgetHtmlValidation

Remove `skipWidgetHtmlValidation` import and `validateWidgetHtml:`
property from all affected files (~18 files).

E2E test helpers (2 files):

- `e2e-tests/helpers/create-stubbed-http-app.ts`
- `e2e-tests/helpers/create-live-http-app.ts`

E2E tests (12 files):

- `e2e-tests/server.e2e.test.ts`
- `e2e-tests/application-routing.e2e.test.ts`
- `e2e-tests/string-args-normalisation.e2e.test.ts`
- `e2e-tests/header-redaction.e2e.test.ts`
- `e2e-tests/auth-enforcement.e2e.test.ts`
- `e2e-tests/auth-bypass.e2e.test.ts`
- `e2e-tests/web-security-selective.e2e.test.ts`
- `e2e-tests/public-resource-auth-bypass.e2e.test.ts`
- `e2e-tests/validation-failure.e2e.test.ts`
- `e2e-tests/enum-validation-failure.e2e.test.ts`
- `e2e-tests/tool-call-success.e2e.test.ts`
- `e2e-tests/tool-examples-metadata.e2e.test.ts`

Integration tests (2 files):

- `src/security-headers.integration.test.ts`
- `src/auth-routes.integration.test.ts`

**Phase 2 validation**: `pnpm type-check && pnpm lint && pnpm test`

---

### Phase 3: Documentation, Quality Gates, Verification

#### Task 3.1: Update documentation

**`docs/deployment-architecture.md`** — update references to
`dist/oak-banner.html` runtime artefact, describe codegen constant.

**`README.md`** — update widget sourcing description.

**`docs/dev-server-management.md`** — update widget build info.

**Source TSDoc** — covered in Phase 2 tasks.

#### Task 3.2: Draft ADR

`NNN-codegen-time-widget-html-constant.md`:

- **Context**: Vercel `process.cwd()` mismatch + NFT gap; widget
  HTML was the only resource using runtime filesystem I/O
- **Decision**: Widget HTML generated at codegen time as a committed
  TypeScript constant, consumed via DI (same pattern as all other
  generated tool metadata)
- **Consequences**: No runtime filesystem dependency; DI preserved
  for testability; `.widget-build/` intermediate directory; breaking
  API changes to 3 interfaces

#### Task 3.3: Run full quality gates

```bash
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:widget
pnpm test:e2e
```

#### Task 3.4: Verify on Vercel

Deploy to preview, confirm no `FUNCTION_INVOCATION_FAILED`,
widget resource serves HTML, health endpoint responds.

#### Task 3.5: Verify dev mode

Run `pnpm dev:auth:stub`, confirm widget resource is served.

---

## Testing Strategy

### Unit Tests

**Removed**: `validate-widget-html.unit.test.ts` (tests deleted code)

**No new unit tests needed**: Build-time codegen failure replaces
runtime validation — fail-fast shifted earlier in the pipeline.

### Integration Tests

**Modified**: `register-resources.integration.test.ts` and
`register-resources-observability.integration.test.ts` — sync
`getWidgetHtml` fake injection.

### E2E Tests

**Modified**: `built-artifact-import.e2e.test.ts` — proves HTML
survives relocation because it is embedded in the JS bundle.

**Bulk cleanup**: ~18 files lose `skipWidgetHtmlValidation`, gain
`getWidgetHtml` trivial fake injection.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Committed HTML bloats git | Low | Low | ~50-100KB; same as tool descriptors |
| Stale committed constant | Medium | Low | Widget source changes trigger `build:widget`; same as sdk-codegen |
| `.widget-build/` intermediate dir | Low | Low | Gitignored; `pnpm clean` removes it |
| Widget changes need rebuild | Medium | Low | Same workflow as sdk-codegen changes |

---

## Success Criteria

- Vercel deployment crash is resolved
- Widget HTML follows the codegen constant pattern
- DI seam preserved for test isolation (ADR-078)
- Dead code eliminated (4 exports, 3 files)
- No filesystem assumptions in serverless runtime path
- No special loaders, no `.html` declarations, no dev/prod divergence
- All quality gates pass
- New ADR documents the decision

---

## References

- Vercel Express docs:
  https://vercel.com/docs/frameworks/backend/express
- Runtime evidence: Vercel structured logs for
  `dpl_2ZMUWVY8mgQBg9Abe5yqMEi9Rfhf`
- Investigation notes:
  `sdk-and-mcp-enhancements/active/vercel-widget-crash-deep-investigation.notes.md`
- Pattern precedent: `generate-widget-constants.ts` in sdk-codegen
