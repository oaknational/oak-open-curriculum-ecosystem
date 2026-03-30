---
name: "WS3: Fresh React MCP App Rebuild"
overview: "Delete the dead widget framework and replace it with one fresh React MCP App built from scratch on the MCP Apps standard. No banned legacy code, metadata, docs, or bridge assumptions survive in the active path."
parent_plan: "mcp-app-extension-migration.plan.md"
source_research:
  - "../../roadmap.md"
  - "../../mcp-apps-support.research.md"
specialist_reviewer: "mcp-reviewer"
isProject: false
todos:
  - id: phase-0-baseline
    content: "Phase 0: Re-ground the live branch, write RED specs first, and capture the full legacy contamination inventory."
    status: pending
  - id: phase-1-delete-legacy
    content: "Phase 1: Delete the legacy widget framework and remove all active-path references to it."
    status: pending
  - id: phase-2-scaffold
    content: "Phase 2: Scaffold a fresh React MCP App build, lint, type-check, test, and Turbo pipeline."
    status: pending
  - id: phase-3-contracts-runtime
    content: "Phase 3: Extend canonical SDK/runtime contracts for MCP App registration, visibility, and tool listing."
    status: pending
  - id: phase-4-curriculum-view
    content: "Phase 4: Build the curriculum-model MCP App view."
    status: pending
  - id: phase-5-search-view
    content: "Phase 5: Build the interactive user-search MCP App view and app-only helper flow."
    status: pending
  - id: phase-6-docs-review
    content: "Phase 6: Rewrite normative docs, run full quality gates, invoke reviewers, and commit."
    status: pending
---

# WS3: Fresh React MCP App Rebuild

**Status**: ACTIVE  
**Last Updated**: 2026-03-30  
**Scope**: Delete the dead widget framework and build one fresh React MCP App
from scratch.

> Anything that survives from the OpenAI-era stack, in code, architecture,
> design or in guidance, is contamination to be removed.

---

## Context

The old widget system is not a migration target.

Any surviving `window.openai`, `openai/*` metadata aliases,
`text/html+skybridge`, preview wrappers, string renderers, or stale normative
docs are contamination to remove, not assets to preserve.

WS3 is therefore a **total replacement**:

- delete the old widget framework
- build one fresh React MCP App resource
- re-enable only the intended UI tools
- keep all business logic and schema ownership in the SDK/app boundaries that
  already govern the MCP server

Search split invariant for this rebuild:

1. `search` remains the model-facing, agent-facing tool interface
2. `user-search` is the new UI-first, user-first MCP App interface
3. `user-search-query` is app-only helper functionality, not a second
   model-facing search interface

## Foundation Alignment

This plan is governed by:

- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`

Non-negotiables from those directives:

1. No compatibility layers, shims, hacks, renamed globals, or workarounds
2. TDD at every level: RED first, then GREEN, then REFACTOR
3. Schema-first and generator-first remain binding
4. Apps stay thin; domain logic lives in SDKs and libraries
5. Dead code is deleted, not adapted

## Governing Technical Sources

The implementation model comes from the MCP Apps standard and the
`@modelcontextprotocol/ext-apps` SDK only:

1. SEP-1865 (MCP Apps)
2. `@modelcontextprotocol/ext-apps` quickstart
3. `@modelcontextprotocol/ext-apps` patterns
4. `@modelcontextprotocol/ext-apps/react` API docs

Host-specific extension material is not normative input for this rebuild.

## Non-Goals

This work explicitly does **not** do any of the following:

1. Preserve or convert `window.openai` code
2. Use `openai/*` metadata aliases or host extensions
3. Introduce a compatibility bridge, preview shim, or renamed global
4. Add host-specific branching, per-host code paths, or platform toggles
5. Repair the string-template widget system incrementally
6. Move schema ownership from SDK/codegen into the HTTP app
7. Change `apps/oak-curriculum-mcp-stdio`
8. Make direct HTTP requests from the iframe unless a later explicit plan
   justifies and governs that change

## Product Scope

### User-facing MCP App entry points

| Tool | UI | Notes |
|------|----|-------|
| `get-curriculum-model` | Yes | Structured curriculum-model view |
| `user-search` | Yes | New interactive human-facing search entry point |
| `user-search-query` | App-only helper | Hidden from model; callable from the UI only when needed |

### Text-only tools

These remain text-only and do not launch the MCP App:

- `search`
- `fetch`
- `browse-curriculum`
- `explore-topic`

## Target Architecture

### 1. Single MCP App resource

Oak serves one fresh MCP App resource and routes inside React on tool name.

Why:

- one resource URI keeps the current generated-constant model simple
- one React root avoids per-tool iframe drift
- routing inside the app is cleaner than reviving multiple legacy widget files

Clean-break decision:

- rename the resource slug away from `oak-json-viewer`
- do not preserve the old HTML generator or viewer identity

### 2. React + ext-apps/react is the canonical UI stack

The UI is a fresh React app under a nested `widget/` build target inside
`apps/oak-curriculum-mcp-streamable-http/`.

Canonical client pattern:

- `useApp()` is the default React entry point
- register handlers in `onAppCreated`
- set up `ontoolinput`, `ontoolresult`, `ontoolcancelled`, `onteardown`,
  `onhostcontextchanged`, and `onerror` before the app starts handling data
- read host context from the SDK, not from bespoke globals
- call server tools with `app.callServerTool()`
- open external URLs with `app.openLink()`
- update model-visible context only through `app.updateModelContext()`

The raw `App` class remains the underlying primitive, but the React rebuild
should use the official React integration by default, not hand-built bridge
plumbing.

### 3. Data and state model

#### Business data

Business data remains server-owned and arrives through MCP tool results.

- curriculum-model data comes from tool results
- search results come from MCP tool calls initiated by the app
- the iframe does not become a second API client

#### UI state

Use the simplest state model that satisfies behaviour:

1. React state for ephemeral UI state
2. Do not preserve `window.openai.widgetState` or invent substitutes for it
3. If recoverable view state is truly needed, follow the documented MCP Apps
   pattern: server returns a stable `viewUUID`, client keys `localStorage` from
   that UUID, and only UI-level state is persisted

Do **not** invent sessionStorage pseudo-bridges or compatibility wrappers.

#### Model-visible context

`app.updateModelContext()` is only for state the model genuinely needs for the
next turn, such as user-selected search results. The app owns the cumulative
context it sends; replace semantics are explicit.

### 4. Resource, MIME, and CSP model

Server-side UI resources use:

- `registerAppResource`
- `RESOURCE_MIME_TYPE`
- `_meta.ui.csp` only for assets actually required by the app

Because Oak’s iframe data flow is MCP-only, `_meta.ui.domain` should be omitted
unless a future explicit plan introduces direct cross-origin fetches from the
iframe.

### 5. Registration model must stay canonical

The app must not sprout a second manual inventory of “UI tools”.

Required end state:

1. The app still iterates the canonical universal tool registry
2. Descriptor metadata remains the source of truth for whether a tool is an
   MCP App tool
3. A single canonical registration path chooses `registerAppTool` for
   UI-bearing tools and `server.registerTool` otherwise
4. The app does not hard-code a bespoke list of UI tool names outside the
   canonical descriptor/configuration flow

This preserves schema-first execution and the “apps are thin” rule.

### 6. App-only tool visibility is part of the contract

`user-search-query` must be hidden from the model and callable by the app only.

That means the canonical descriptor/projection path must support:

- `_meta.ui.visibility`
- `registerAppTool` registration for app-only helper tools

The default canonical behaviour should be metadata-driven visibility. Do not add
a bespoke second discovery contract unless host-validated evidence requires it.

The current generated contract and registration flow are not yet sufficient.
WS3 must fix that properly rather than working around it in the HTTP app.

### 7. Build and tooling model

The new app must be first-class in the existing workspace tooling.

Required corrections:

1. Build order must respect `tsup.config.ts` `clean: true`
2. Turbo inputs must include widget `ts`, `tsx`, `css`, and `html` files
3. App lint config must include `.tsx`
4. App type-check config must include `.tsx`
5. Widget in-process tests need a dedicated DOM-capable Vitest config
6. No custom preview shim; use the upstream `basic-host` workflow for local
   MCP App verification

### 8. Non-UI host behaviour and fallback policy

Oak keeps host-neutral server behaviour:

1. Do not add host-specific server branches for UI/non-UI clients
2. UI-bearing tools must still provide meaningful text `content` fallback for
   hosts that ignore `_meta.ui`
3. Use server-side `getUiCapability()` where capability gating is required
4. Keep app-side adaptation on host context/lifecycle hooks, and do not
   introduce a second discovery protocol or compatibility shim

---

## Canonical Compliance Checklist

Every WS3 phase must satisfy this checklist. Any failure is blocking.

1. **No legacy bridge residue**
   - No served or reachable runtime path depends on `window.openai`,
     `text/html+skybridge`, or bridge-emulation placeholders
   - Dead legacy files are deleted rather than kept behind empty allowlists
2. **Single source of truth for resource identity**
   - Resource URI/slug lives in canonical SDK/codegen constants only
   - Runtime registration, auth allowlists, tests, and docs consume constants;
     no hard-coded `oak-json-viewer` literals remain in active paths
3. **Canonical tool registration and visibility only**
   - One registry-driven registration pass over universal tools
   - `_meta.ui` metadata drives MCP App registration behaviour
   - `_meta.ui.visibility` is canonical for app-only helper tools
   - No bespoke discovery filters or override layers are introduced in HTTP app
     code to hide/show tools
4. **Public-resource auth behaviour is explicit and protocol-clear**
   - Default target: auth is required for all MCP client-to-server requests
   - Any retained public-resource bypass must be treated as a bounded Oak
     compatibility waiver, not canonical MCP compliance
   - Waiver status must be explicit (owner, scope, host evidence, and removal
     condition), with no undocumented permissive auth path
5. **Test contracts are non-vacuous**
   - Widget metadata/resource tests must fail if intended UI tools are absent
     after WS3 registration is expected to be live
   - Assertions must validate MIME type, resource URI identity, and representative
     payload content, not only object existence
6. **Prompt/plan cross-reference integrity**
   - Prompt, roadmap, umbrella plan, WS3 child plan, and current-plan index are
     mutually consistent on scope, ownership, and dependency order
   - No stale operational command appears in multiple conflicting forms

---

## Phase Companion Plans

Execution details for each phase also live in companion child plans. This WS3
plan remains the parent orchestration document and source of phase ordering.

1. [ws3-phase-0-baseline-and-red-specs.plan.md](ws3-phase-0-baseline-and-red-specs.plan.md)
2. [ws3-phase-1-delete-legacy-widget-framework.plan.md](ws3-phase-1-delete-legacy-widget-framework.plan.md)
3. [ws3-phase-2-scaffold-fresh-mcp-app-infrastructure.plan.md](ws3-phase-2-scaffold-fresh-mcp-app-infrastructure.plan.md)
4. [ws3-phase-3-canonical-contracts-and-runtime.plan.md](ws3-phase-3-canonical-contracts-and-runtime.plan.md)
5. [ws3-phase-4-curriculum-model-view.plan.md](ws3-phase-4-curriculum-model-view.plan.md)
6. [ws3-phase-5-interactive-user-search-view.plan.md](ws3-phase-5-interactive-user-search-view.plan.md)
7. [ws3-phase-6-docs-gates-review-commit.plan.md](ws3-phase-6-docs-gates-review-commit.plan.md)

---

## Phase 0: Baseline and RED Specs

**Goal**: ground the live branch and write failing specs first.

### Tasks

1. Inspect live branch state with `git status --short` and
   `git log --oneline --decorate -5`
2. Capture the runtime contamination inventory using the canonical command in
   `Canonical Runtime Contamination Check`
3. Capture a focused non-canonical inventory for:
   - `src/widget-script.ts` bridge residue and serving path
   - `src/register-resources.ts` hard-coded legacy resource identity
   - `src/tools-list-override.ts` bespoke tool discovery/visibility behaviour
   - public resource auth bypass semantics and test coverage depth

4. Update or add RED tests before product changes:
   - `e2e-tests/widget-resource.e2e.test.ts`
   - `e2e-tests/widget-metadata.e2e.test.ts`
   - `e2e-tests/public-resource-auth-policy.e2e.test.ts` (or equivalent file
     rename from `public-resource-auth-bypass.e2e.test.ts`)
   - any new widget build E2E coverage
5. Define the RED command/evidence contract for each downstream phase:
   - exact command
   - expected failure reason
   - target GREEN evidence
6. Rewrite stale normative docs that would otherwise direct work back toward
   the dead widget model

### Acceptance

- contamination inventory captured against the live tree
- RED command/evidence contract is written for each downstream phase
- RED tests fail for the expected reasons and are linked to explicit GREEN
  expectations
- non-canonical inventory is captured and mapped to specific phase fixes
- no planning document still tells the next session to preserve the old widget
  architecture

---

## Phase 1: Delete the Legacy Widget Framework

**Goal**: remove the old architecture before scaffolding the new one.

### Delete

Delete the dead client stack and its support files, including:

- `src/widget-script.ts`
- `src/widget-script-state.ts`
- `src/widget-script-escaping.ts`
- `src/widget-renderer-registry.ts`
- `src/widget-file-generator.ts`
- `src/widget-renderers/**`
- legacy preview infrastructure under `scripts/` that exists only to emulate
  the dead widget runtime
- tests that prove deleted implementation details rather than the new MCP App
  contract

Keep only architecture-neutral assets that are still useful, such as the Oak
logo source, if they are reused directly by the React app.

Deletion sequencing rule:

1. Add replacement tests for the new MCP App contract first
2. Confirm replacement tests are RED then GREEN
3. Delete legacy tests only after replacement tests prove equivalent or stronger
   coverage

### Also remove

1. Legacy widget resource registration if no tool points to it
2. Legacy comments and docs that still describe the deleted runtime as live
3. Any build step whose sole purpose is to keep the dead framework runnable

### Acceptance

- zero active product code references to `window.openai`
- zero active product code references to `text/html+skybridge`
- zero legacy widget renderer files remain in use
- no legacy widget script/resource can still be served as a fallback path
- widget-rendering workspace docs no longer describe the deleted runtime as
  current architecture

---

## Phase 2: Scaffold Fresh MCP App Infrastructure

**Goal**: create a clean React MCP App build and test foundation.

### RED

Write failing tests first for:

1. Widget build output exists and is self-contained
2. Widget shell renders a React root and expected bundle markers
3. Lint/type-check/test tooling includes the new widget source set

### GREEN

Create a nested `widget/` build target with:

- `widget/mcp-app.html`
- `widget/vite.config.ts`
- `widget/tsconfig.json`
- `widget/src/mcp-app.tsx`
- `widget/src/global.css`
- component files for shared app shell and routed views

Add dependencies for:

- `react`
- `react-dom`
- `@vitejs/plugin-react`
- `vite`
- `vite-plugin-singlefile`
- `cross-env`
- `@types/react`
- `@types/react-dom`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `jsdom`

### Tooling corrections

Update:

1. `package.json` build/dev/test scripts
2. `turbo.json` inputs so widget source actually invalidates caches
3. `eslint.config.ts` for `.tsx`
4. `tsconfig.lint.json` for `.tsx`
5. dedicated widget Vitest config for DOM-based in-process tests

### Acceptance

- focused package build produces a self-contained `dist/mcp-app.html`
- Turbo invalidates correctly on widget `ts`, `tsx`, `css`, and `html` changes
- lint and type-check see widget source
- no preview shim is introduced

---

## Phase 3: Canonical SDK and Runtime Contracts

**Goal**: make the canonical descriptor and registration path sufficient for the
fresh MCP App.

### Required contract changes

1. Extend the canonical tool metadata contract to support
   `_meta.ui.visibility`
2. Support the new `user-search` and `user-search-query` tool descriptors
   without hand-authoring schema logic in the HTTP app
3. Rename the generated UI resource slug away from `oak-json-viewer`
4. Re-populate the canonical UI tool allowlist only when the new app is ready
5. Align generated auth/noauth wording with MCP auth target semantics and avoid
   permissive "no bearer token required" ambiguity in canonical contracts
6. If a public-resource bypass remains, track it as explicit Oak compatibility
   waiver (owner, scope, host evidence, removal condition), not as canonical
   MCP compliance

### Required runtime changes

1. Keep one registry-driven iteration over universal tools
2. Route registration through one canonical helper/path that selects
   `registerAppTool` when `_meta.ui` is present
3. Ensure app-only visibility is metadata-driven via `_meta.ui.visibility`
   semantics and host-compatible behaviour
4. Update public-resource handling and resource registration to match the new
   resource URI
5. Remove bespoke discovery/visibility override behaviour that duplicates
   canonical descriptor metadata decisions

### Rename blast-radius checklist

When renaming the widget resource slug, update all coupled surfaces atomically:

1. SDK/codegen constants and template source
2. resource registration and metadata wiring
3. public resource auth allowlist
4. resource and metadata E2E assertions
5. plan/prompt/docs references that describe active architecture

### Acceptance

- `get-curriculum-model` advertises the new MCP App resource
- `user-search` advertises the new MCP App resource
- `user-search-query` is registered as app-only using canonical visibility
  metadata
- non-UI tools remain standard tool registrations
- `search` remains model-facing and agent-facing
- active runtime/tests/docs do not contain hard-coded `oak-json-viewer`
  identity in place of canonical constants
- intended UI tool registration cannot pass vacuously with an empty UI tool
  set once WS3 registration is enabled

---

## Phase 4: Curriculum Model View

**Goal**: deliver the first real view on the new app shell.

### RED

Write tests first for:

- routed rendering of `get-curriculum-model`
- Oak header/footer behaviour
- empty/error states
- host-context-aware layout behaviour where practical

### GREEN

Build:

- a shared app shell
- tool routing
- curriculum-model renderer
- Oak brand styling via CSS variables and host-aware fallbacks

The `useApp()`-owning shell should be exercised primarily through E2E/system
tests. Child components that receive plain props should be covered with
in-process React tests.

### Acceptance

- the curriculum-model view renders through the fresh MCP App shell
- external links go through `app.openLink()`
- the app handles tool input/result/cancel/teardown through the MCP Apps SDK
- local verification works against the upstream `basic-host`

---

## Phase 5: Interactive User Search View

**Goal**: add the human-facing search experience without violating app/SDK
boundaries.

### RED

Write tests first for:

- search submission flow
- loading/error/empty/result states
- result validation at the component boundary
- app-only helper tool behaviour from the UI perspective
- model-context sync for explicit user selections

### GREEN

Build:

1. `user-search` as the user-facing MCP App entry point
2. `user-search-query` as an app-only helper if still justified after design
   review
3. search UI interactions through `app.callServerTool()`
4. selection sync through `app.updateModelContext()` only where the model needs
   that context

The iframe must not call Oak HTTP endpoints directly.

### Acceptance

- search runs through MCP tool calls only
- result shapes are validated before render
- UI state remains local to the React app
- no direct iframe HTTP fetch is required

---

## Phase 6: Docs, Gates, Review, Commit

**Goal**: finish the clean break across normative docs and quality gates.

### Documentation

Rewrite or update the live normative documents so they reflect the new
architecture and stop preserving the dead one:

- `.agent/prompts/session-continuation.prompt.md`
- `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`
- `.agent/plans/sdk-and-mcp-enhancements/roadmap.md`
- collection README/index files in this plan set
- `.agent/plans/sdk-and-mcp-enhancements/current/README.md`
- `apps/oak-curriculum-mcp-streamable-http/docs/widget-rendering.md`
- workspace README material that explains widget build/development

Historical archive materials remain historical. Active docs must not prescribe
banned legacy architecture.

### Quality gates

Canonical readiness gate (non-mutating):

```bash
pnpm qg
```

Full scrub before push/merge:

```bash
pnpm check
```

Focused verification during development should include the HTTP app build,
test, and E2E commands as needed.

### Reviewer set

- `mcp-reviewer`
- `code-reviewer`
- `test-reviewer`
- `type-reviewer`
- `config-reviewer`
- `security-reviewer`
- `docs-adr-reviewer`
- `architecture-reviewer-barney`
- `architecture-reviewer-betty`
- `architecture-reviewer-fred`
- `architecture-reviewer-wilma`

### Acceptance

Runtime/product code should be clean under the canonical contamination check:
(run the command from `Canonical Runtime Contamination Check`)

Plus:

- `pnpm check` passes
- the fresh MCP App renders in the upstream `basic-host`
- UI-bearing tools provide meaningful text fallback for hosts that ignore
  `_meta.ui`
- WS3 and WS4 scope in the umbrella plan can be closed together
- C8 auth hardening closure gates are complete (or explicitly superseded by
  accepted architecture)
- no retained public-resource bypass is presented as canonical MCP compliance;
  any retained bypass is recorded as explicit compatibility waiver status
- public-resource auth tests assert MIME, URI, and payload contract details
  (not only object presence)

---

## Cross-Plan References

- `mcp-app-extension-migration.plan.md` — umbrella ownership and closure criteria
- `../roadmap.md` — strategic ordering and C8 blocking status
- `../current/auth-safety-correction.plan.md` — deny-by-default auth correction
- `../current/auth-boundary-type-safety.plan.md` — auth boundary typing and
  fail-fast validation remediation
- `../current/README.md` — queued and in-progress follow-on execution plans

Closure gate rule:

- WS3/WS4 implementation can proceed phase-by-phase.
- WS3/WS4 migration closure requires C8 auth closure plans to be complete (or
  explicitly superseded by accepted architecture).

---

## Canonical Runtime Contamination Check

Run throughout implementation:

```bash
rg -n --hidden \
  'window\.openai|openai/|text/html\+skybridge|__mcpPreview|chatgpt-emulation|oak-json-viewer|undefined\?\.tool(Output|Input)|tools-list-override' \
  apps/oak-curriculum-mcp-streamable-http \
  packages/sdks/oak-curriculum-sdk \
  packages/sdks/oak-sdk-codegen
```

Expected active-path result at completion: zero.
