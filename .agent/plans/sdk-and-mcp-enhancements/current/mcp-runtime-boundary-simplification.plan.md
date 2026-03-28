---
name: "MCP Runtime Boundary Simplification"
overview: "Thin the streamable HTTP MCP app by establishing one canonical, transport-neutral SDK tool descriptor surface and replacing the Express/Clerk ingress bridge with one explicit auth boundary."
source_research:
  - "../roadmap.md"
  - "../active/mcp-app-extension-migration.plan.md"
  - "../active/ws2-app-runtime-migration.plan.md"
specialist_reviewer: "mcp-reviewer"
todos:
  - id: phase-0-clerk-mcp-tools-spike
    content: "Phase 0: Evaluate @clerk/mcp-tools/express adoption — spike against live docs, map replaceable surface, write ADR documenting adopt-or-explain decision."
    status: done
  - id: phase-1-foundation-and-seam-audit
    content: "Phase 1: Re-ground in the foundation directives and audit the exact app-owned MCP seams so the work starts from the real boundaries rather than the temporary WS2 stop-gaps."
    status: done
  - id: phase-2-red-tool-surface
    content: "Phase 2 (RED): Add failing SDK and HTTP tests that prove tool registration projection and tools/list projection must come from one canonical SDK-owned surface while preserving generated examples."
    status: done
  - id: phase-3-green-tool-surface
    content: "Phase 3 (GREEN): Move tool-surface projection into the curriculum SDK, then simplify the HTTP app so it consumes the SDK projection instead of serialising tool metadata itself."
    status: done
  - id: phase-4-red-ingress-boundary
    content: "Phase 4 (RED): Add failing tests for an explicit MCP ingress/auth context so tool auth no longer depends on the full Express request or the proxy-based createMcpRequest bridge."
    status: done
  - id: phase-5-green-ingress-boundary
    content: "Phase 5 (GREEN): Introduce the explicit ingress boundary, replace the request proxy path, and keep auth/resource validation behaviour unchanged."
    status: done
  - id: phase-6-refactor-gates-review
    content: "Phase 6 (REFACTOR): Delete superseded bridge code, propagate documentation, run the full quality gate chain, and complete the required reviewer passes."
    status: done
  - id: phase-7-post-review-remediation
    content: "Phase 7: Address all findings from the 9-reviewer comprehensive review (2026-03-28) — Tier 1-3 items A-R plus S."
    status: done
  - id: phase-8-eliminate-res-locals-bridge
    content: "Phase 8: Eliminate the res.locals auth bridge — move auth storage from res.locals to req.auth, aligning with MCP SDK intended pattern."
    status: done
isProject: false
---

# MCP Runtime Boundary Simplification

**Last Updated**: 2026-03-28
**Status**: ALL PHASES COMPLETE (0-8). Phase 8 landed in 4 commits on `feat/mcp_app`.
**Scope**: Remove the two remaining app-owned MCP seams after WS2: the
Express/Clerk ingress bridge and the hand-authored MCP tool exposure path.

## Why This Plan Exists

WS2 deliberately left two non-blocking seams in place so the MCP Apps runtime
migration could land without reopening transport and SDK architecture at the
same time:

1. `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` still proxies
   `express.Request` through `createMcpRequest()` so Clerk's `auth` property is
   hidden from `StreamableHTTPServerTransport`, while
   `apps/oak-curriculum-mcp-streamable-http/src/request-context.ts` stores the
   full Express request for later auth checks.
2. `apps/oak-curriculum-mcp-streamable-http/src/tools-list-override.ts` still
   serialises MCP tool metadata in the app layer so `inputSchema.examples`
   survives `tools/list`, even though the tool contract already originates in
   the SDK.

Those stop-gaps were acceptable for WS2, but they are the wrong long-term
ownership model. They keep the app thicker than the repo's architectural model
allows, preserve assertion pressure at the transport boundary, and create drift
risk against the schema-first rule.

## Settled Direction

### 1. SDK owns one canonical transport-neutral tool descriptor surface

`@oaknational/curriculum-sdk` should expose one canonical descriptor surface for
MCP tools, not several overlapping “list”, “registration”, or protocol-only
shapes.

That canonical descriptor must carry the complete tool contract already known in
the SDK, including:

1. invocation name, description, annotations, and security schemes
2. JSON Schema surfaces such as `inputSchema` and future `outputSchema`
3. MCP Apps metadata such as `_meta.ui.resourceUri` and `_meta.ui.visibility`
   when required
4. any helper-specific registration aids that are required for faithful
   registration, without making those helper-specific shapes the canonical
   contract

Every protocol or transport projection must be derived from that one descriptor
surface.

### 2. App-rendering registration stays on the upstream helper boundary

The official `ext-apps/server` guidance is to use `registerAppTool()` and
`registerAppResource()` instead of base `registerTool()` and
`registerResource()` for app-rendering tools and resources.

Therefore this plan must not make raw `registerTool()` the long-term ownership
target. The SDK should expose helper-compatible tool data, while the HTTP app
should continue to use the upstream helper boundary for app-rendering tools so
UI metadata normalisation stays upstream rather than being re-authored in Oak
code.

### 3. The HTTP app owns only ingress composition

The streamable HTTP app should compose an explicit ingress boundary, not
transport around a full Express request:

1. Clerk interaction and token verification happen at the HTTP edge
2. a single explicit auth context is passed forward into MCP tool execution
3. `handlers.ts` becomes composition only
4. no ambient async-local request store remains in the MCP tool path
5. any remaining transport shaping is isolated to a dedicated ingress adapter
   module, not mixed into handler or tool-auth logic

This follows the canonical Clerk MCP pattern more closely: verify once at
ingress, then pass typed auth information forward instead of recovering auth by
re-reading the request deeper in the tool path.

### 4. Schema-first stays intact

This plan does **not** author a new runtime registry. Generated tool contracts
remain generator-owned, aggregated tool contracts remain definition-owned, and
the descriptor work in this plan must collapse overlapping shapes rather than
move duplication from the app into the SDK.

### 5. Design for adjacent `outputSchema` and visibility work

`current/output-schemas-for-mcp-tools.plan.md` is already queued. The new
canonical descriptor must therefore carry the **complete** MCP tool surface
already modelled in the SDK, not a smaller app-curated subset that would force
another rewrite when `outputSchema` or `_meta.ui.visibility` work lands.

## Non-Goals

1. No widget client rewrite or React migration work from WS3.
2. No host detection, host-mode toggles, or compatibility layers.
3. No product-level auth behaviour change to OAuth routes, public resources, or
   the existing error semantics.
4. No upstream MCP SDK fork as a prerequisite for local cleanup.

## Quality Gate Strategy

This work crosses SDK and app boundaries, so filtered verification is
insufficient.

### After each task

```bash
pnpm type-check
pnpm lint
pnpm test
```

### After each phase

```bash
pnpm clean
pnpm sdk-codegen
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

## Phase 0 — Evaluate `@clerk/mcp-tools/express` Adoption

**Status**: Done (2026-03-26)

**Principle**: Use off-the-shelf wherever possible. Be idiomatic and canonical.
Innovate in Oak's domain (curriculum), not in plumbing.

The codebase already depends on `@clerk/mcp-tools@^0.3.1` but does not use its
Express utilities. Clerk now provides official MCP auth helpers that overlap
with hand-rolled code in this app. Before building a new ingress boundary, we
must determine how much of the existing custom auth plumbing can be replaced by
the official package.

### Investigation

Fetch the current `@clerk/mcp-tools/express` documentation and source:

1. **`mcpAuthClerk`** — HTTP-level Bearer token enforcement. Does it compose
   with Oak's RFC 8707 audience validation and conditional auth bypass
   (ADR-057, ADR-126)?
2. **`streamableHttpHandler`** — Express↔MCP transport bridge. Does it
   eliminate the `createMcpRequest()` Proxy? Does it compose with the
   per-request server pattern (ADR-112)?
3. **`protectedResourceHandlerClerk`** — RFC 9728 PRM endpoint. Does it
   support per-request URL rewriting for DNS rebinding protection?
4. **`authServerMetadataHandlerClerk`** — OAuth AS metadata endpoint. Same
   URL rewriting question.

### Mapping: Custom Code vs Official Utilities

| Custom File | Official Replacement | Outcome |
|-------------|---------------------|---------|
| `src/auth/mcp-auth/mcp-auth-clerk.ts` | `mcpAuthClerk` | SKIP — no RFC 8707 |
| ~~`src/auth/mcp-auth/verify-clerk-token.ts`~~ | `verifyClerkToken` from `@clerk/mcp-tools/server` | ADOPT — file deleted, import adopted |
| `src/auth/mcp-auth/auth-response-helpers.ts` | Internal to `mcpAuthClerk` | SKIP |
| `src/handlers.ts` `createMcpRequest()` | `streamableHttpHandler` | SKIP — no per-request server |
| `src/request-context.ts` | `streamableHttpHandler` | SKIP |
| PRM/AS metadata in `src/auth-routes.ts` | `protectedResourceHandlerClerk` / `authServerMetadataHandlerClerk` | SKIP — no URL rewriting |

### Oak-Specific Code That Must Remain (Regardless of Adoption)

| File | Why |
|------|-----|
| `src/check-mcp-client-auth.ts` | Tool-level auth gating per ADR-054 |
| `src/tool-handler-with-auth.ts` | Upstream API auth error → MCP `_meta` interception (ADR-054) |
| `src/resource-parameter-validator.ts` | RFC 8707 audience claim validation |
| `src/conditional-clerk-middleware.ts` | Path-specific auth bypass (ADR-126) |
| `src/security.ts` | DNS rebinding protection |
| `src/auth-error-response.ts` | MCP-compliant `_meta["mcp/www_authenticate"]` error formatting |

### Deliverables

1. A spike document recording investigation findings with live-doc citations
2. An ADR documenting the adopt-or-explain decision for each utility
3. Updated Phase 4/5 scope based on findings — if `streamableHttpHandler`
   eliminates the Proxy bridge, Phases 4-5 become "adopt and delete" rather
   than "build Oak-owned ingress context"

### Acceptance Criteria

1. Every `@clerk/mcp-tools/express` utility has been evaluated against the
   live docs with an explicit adopt/skip/compose decision.
2. The ADR is written and cross-referenced.
3. Phase 4/5 scope is updated to reflect the investigation outcome.

### Required Reviewers

1. `clerk-reviewer`
2. `mcp-reviewer`
3. `security-reviewer`

---

## Phase 1 — Foundation and Seam Audit

**Status**: Done (2026-03-26)

Foundation directives re-read and recommitted:

1. `.agent/directives/principles.md` — generator-first, no compatibility layers,
   TDD at all levels, apps are thin interfaces
2. `.agent/directives/testing-strategy.md` — DI for testability (ADR-078),
   no `vi.mock`, behaviour not implementation
3. `.agent/directives/schema-first-execution.md` — runtime files are thin
   façades, generator is single source of truth

### Seam Inventory

Audited files:

1. `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`
2. `apps/oak-curriculum-mcp-streamable-http/src/tools-list-override.ts`
3. `apps/oak-curriculum-mcp-streamable-http/src/request-context.ts`
4. `apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.ts`
5. `apps/oak-curriculum-mcp-streamable-http/src/auth/tool-auth-context.ts`
6. `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts`
7. `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts`

#### Seam 1: Tool Surface Duplication

Two consumption paths from `listUniversalTools(generatedToolRegistry)`:

| Component | File | Line | Owner | End-State |
|-----------|------|------|-------|-----------|
| Tool registration loop | `handlers.ts` | 98 | App | Consume SDK canonical descriptor via `registerAppTool()` |
| `tools/list` override | `tools-list-override.ts` | 43 | App | Delete or delegate to SDK protocol projection |
| `listUniversalTools()` | `list-tools.ts` | 44 | SDK | Becomes canonical source |
| `UniversalToolListEntry` | `types.ts` | — | SDK | Collapse or promote to canonical descriptor |

**Why the override exists**: MCP SDK Zod→JSON Schema conversion drops
`inputSchema.examples`. The override preserves them using pre-generated JSON
Schema from the SDK directly.

**SDK already provides both shapes**: Each `UniversalToolListEntry` carries
`inputSchema` (JSON Schema with examples) and `flatZodSchema` (Zod shape for
registration). The app should consume SDK-derived projections, not hand-map.

**`registerAppTool()` gap**: Currently uses raw `server.registerTool()`. The
SDK must emit data compatible with `registerAppTool()` (MCP Apps helper).

#### Seam 2: Ingress/Auth Bridge

| Component | File | Line | Owner | End-State |
|-----------|------|------|-------|-----------|
| `createMcpRequest()` proxy | `handlers.ts` | 159 | App | Delete — ingress adapter replaces |
| `setRequestContext()` | `request-context.ts` | 19 | App | Delete entirely |
| `getRequestContext()` | `request-context.ts` | 29 | App | Delete entirely |
| `AsyncLocalStorage<Request>` | `request-context.ts` | 9 | App | Delete entirely |
| `checkMcpClientAuth()` | `check-mcp-client-auth.ts` | 38 | App | Retain, refactor to DI |
| `getAuth()` direct call | `check-mcp-client-auth.ts` | 79 | App | Move to ingress edge |
| `getAuth()` in middleware | `mcp-auth-clerk.ts` | 43 | App | Already at edge — no change |
| `verifyClerkToken()` | `@clerk/mcp-tools/server` | — | Library | Stays at ingress edge |
| `extractAuthContext()` | `tool-auth-context.ts` | 105 | App (**DEAD**) | Promote or delete |
| `ToolAuthContext` interface | `tool-auth-context.ts` | 34 | App (**DEAD**) | Promote or delete |
| `RequestWithAuthContext` | `tool-auth-context.ts` | 23 | App (test-only) | Follows disposition |

**Dual auth paths**: `getAuth(req, ...)` in `check-mcp-client-auth.ts:79` vs
`req.auth` in `tool-auth-context.ts:105`. Phase 4/5 must converge to one.

**Dead code**: `extractAuthContext()`, `ToolAuthContext`, `RequestWithAuthContext`
have zero production callers. `ToolAuthContext` shape (`userId`) resembles the
intended explicit auth context.

**ADR-078 violation**: `check-mcp-client-auth.unit.test.ts` uses 5 `vi.mock()`
calls. Phase 4/5 must refactor to DI.

#### Data Flow

```text
Express Request (HTTP)
         │
    [1] clerkMiddleware (sets req.auth)
         │
    [2] createMcpRouter → mcpAuth/mcpAuthClerk (HTTP 401 gate)
         │                   └─ getAuth() + verifyClerkToken()  ← at edge
         │
    [3] createMcpHandler
         ├─ createMcpRequest(req)   ← Proxy, omits auth         [SEAM 2]
         └─ setRequestContext(req)  ← AsyncLocalStorage          [SEAM 2]
              │
    [4] registerHandlers loop       ← listUniversalTools()       [SEAM 1]
         │
    [5] handleToolWithAuthInterception
         ├─ checkMcpClientAuth      ← getRequestContext + getAuth [SEAM 2]
         ├─ executeToolCall         ← SDK tool execution
         └─ auth error interception
         │
    [6] overrideToolsListHandler    ← listUniversalTools()       [SEAM 1]
```

### Reviewer Questions

#### `mcp-reviewer`

1. Does the end-state (SDK owns canonical descriptor, app via `registerAppTool()`)
   align with the MCP Apps helper boundary? Can the SDK emit data that
   `registerAppTool()` consumes without re-projection?
2. The `tools/list` override exists because Zod→JSON Schema drops examples.
   Is there a known upstream fix that would eliminate the override?
3. Is `_meta.ui.resourceUri` auto-populated by `registerAppTool()` so the
   canonical descriptor need not emit it explicitly?

#### `architecture-reviewer-barney`

1. `extractAuthContext()` / `ToolAuthContext` have zero production callers.
   Delete in Phase 6 or promote in Phase 4/5 as the explicit auth contract?
2. Does the ingress end-state (Clerk at edge, explicit typed auth forward, no
   `AsyncLocalStorage` in tool path) satisfy apps-are-thin-interfaces?
3. `RequestWithAuthContext` imported only in `test-helpers/fakes.ts` — does this
   test-only dependency change the dead-code assessment?

#### `clerk-reviewer`

1. ADR-142 skipped Express utilities. Is Oak-owned ingress with `verifyClerkToken`
   as the only adopted utility the correct Clerk integration shape?
2. Do `getAuth(req, { acceptsToken: 'oauth_token' })` and `req.auth` produce
   equivalent auth data, or can they diverge?
3. Should the ingress edge call `getAuth()` once and forward the result, or
   call `verifyClerkToken()` directly bypassing `getAuth()`?

### Intended End-State (Reviewer Sign-Off Required)

1. **One canonical SDK descriptor surface** — SDK owns all tool protocol fields
2. **App registration via `registerAppTool()`** — not raw `registerTool()`
3. **One explicit auth boundary at ingress** — verify once, typed context forward
4. **No compatibility layers** — old paths deleted, not shimmed
5. **`tool-auth-context.ts` disposition** — promote or delete, not limbo

Required reviewer checkpoint before GREEN work begins:

1. `mcp-reviewer`
2. `architecture-reviewer-barney`
3. `clerk-reviewer`

**Acceptance criteria**:

1. The tool-surface duplication and ingress/auth bridge are enumerated with
   exact file ownership.
2. The execution team has explicitly recommitted to generator-first and
   no-compatibility-layer rules.
3. Reviewer feedback on the intended end-state is collected before product code
   changes begin.

**Deterministic validation** (confirmed 2026-03-26):

```bash
rg -n "createMcpRequest|setRequestContext|getRequestContext|getAuth\\(|overrideToolsListHandler|listUniversalTools" \
  apps/oak-curriculum-mcp-streamable-http/src \
  packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools
# Confirmed: identifies the seam inventory, no source files edited
```

## Phase 2 — RED: Canonical SDK Descriptor and Exposure Boundary

**Status**: Done (2026-03-26)

Write tests first to prove that one canonical transport-neutral SDK descriptor
surface exists and that both app registration and `tools/list` exposure derive
from it.

### Check Driven Development Approach

Phase 2 uses the appropriate tool for each assertion:

- **`pnpm type-check`** fails on missing imports (the primary RED signal)
- **`pnpm lint`** fails on unresolved import and unsafe-assignment cascade
- **`pnpm test`** fails on behavioural assertions

Zero `eslint-disable` comments — lint failing IS a valid RED signal.

This follows the Check Driven Development principle: TDD is not limited to
test files — type-check, lint, grep, knip, depcruise, or any other quality gate
can serve as the assertion mechanism. Pick the tool that proves the gap most
directly.

### RED Test Files

1. **SDK**: `packages/sdks/oak-curriculum-sdk/src/mcp/canonical-descriptor.unit.test.ts`
   (new file, 7 tests across 3 describe blocks)
   - Imports `toRegistrationConfig`, `toProtocolEntry` from
     `./universal-tools/projections.js` — module does not exist yet
   - `pnpm type-check` fails: `TS2307: Cannot find module`
   - Tests registration projection (widget/non-widget), protocol projection
     (JSON Schema with examples), and canonical source consistency

2. **HTTP**: `apps/oak-curriculum-mcp-streamable-http/src/handlers.integration.test.ts`
   (modified, 2 new tests in `tool registration via SDK projection` block)
   - Imports `toRegistrationConfig` from SDK — export does not exist yet
   - `pnpm type-check` fails: `TS2305: has no exported member`
   - Test 2a: widget tools must include `_meta.ui.resourceUri` in registration
     config (currently omitted by `handlers.ts:102-108`)
   - Test 2b: registration config must match SDK projection (currently
     hand-assembled)

### RED State (confirmed 2026-03-26)

| Gate | Status | Signal |
| ---- | ------ | ------ |
| `pnpm type-check` | RED | `TS2307` (missing module) + `TS2305` (missing export) |
| `pnpm lint` | RED | `import-x/no-unresolved` + `no-unsafe-assignment` cascade |
| SDK tests | RED | 1 file fails, 48 pass (698 existing tests green) |
| HTTP tests | RED | 2 tests fail, 674 pass (all existing tests green) |
| `pnpm format` | GREEN | formatting passes |
| `pnpm markdownlint` | GREEN | markdown passes |

### Acceptance Criteria (all met)

1. Existing tests pass before RED tests (baseline confirmed: 698 + 674 green).
2. SDK-level type-check fails on missing `projections.js` module.
3. HTTP-level tests fail: `_meta` omitted from config + `toRegistrationConfig`
   not a function.
4. Test 1b asserts `_meta.ui.resourceUri` in registration config — makes raw
   `registerTool()` insufficient for widget tools.
5. Tests describe behaviour ("produces config with X shape") not implementation.

## Phase 3 — GREEN: Canonicalise the SDK Descriptor Surface — Complete (2026-03-27)

Created `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/projections.ts`
with two pure projection functions, then simplified the HTTP app to consume them.

**What was built:**

- `toRegistrationConfig(tool)` — config for `registerTool()` with Zod inputSchema
  (via `flatZodSchema` or WeakMap-cached JSON Schema→Zod conversion), title
  fallback (`annotations.title ?? name`), `_meta` for widget tools
- `toProtocolEntry(tool)` — `tools/list` entry with JSON Schema inputSchema
  (preserving examples), top-level `title` per MCP spec 2025-11-25, explicit
  `outputSchema?: undefined`
- Both exported from `public/mcp-tools.ts` barrel via `universal-tools/index.ts`
- `handlers.ts` — 7-line hand-assembled config replaced with single
  `const config = toRegistrationConfig(tool)`
- `tools-list-override.ts` — `tools.map(...)` replaced with `tools.map(toProtocolEntry)`

**Reviewer outcomes:**

- MCP-reviewer: COMPLIANT — top-level `title` correct, `outputSchema` absence
  explicit, `_meta` handling follows MCP Apps conventions
- Code-reviewer: APPROVED — description asymmetry fixed (both projections use
  `?? tool.name`), stale Architecture comment updated, undefined-description
  test added
- Phase 2 `eslint-disable` comment removed (no longer needed with typed module)

**Acceptance criteria (all met):**

1. Only the SDK layer assembles MCP tool protocol fields ✓
2. `inputSchema.examples` visible via `tools/list` (JSON Schema preserved) ✓
3. No Oak-owned `registerTool()` normalisation layer ✓
4. No manual `tools.map(...)` in app ✓
5. No new registry, compatibility layer, or host-specific projection ✓
6. Zero `eslint-disable` comments in Phase 2/3 test files ✓

**Verification (all passed):** 706 SDK tests, 676 HTTP tests, 165 E2E tests.
Zero `tool.(description|inputSchema|annotations|_meta)` in handlers.ts or
tools-list-override.ts.

## Phase 4 — RED: One Explicit Auth Boundary

**Phase 0 outcome (2026-03-26)**: All Express utilities SKIP per ADR-142. Only
`verifyClerkToken` adopted from `@clerk/mcp-tools/server` (identical
implementation). Phases 4-5 proceed as originally scoped: build Oak-owned
explicit ingress context. The library lacks RFC 8707 audience validation, DNS
rebinding protection, and per-request server support.

Write tests first for the desired ingress boundary:

1. tool auth runs from an explicit auth context (either official utility or
   Oak-owned, per Phase 0 outcome)
2. downstream code no longer depends on `AsyncLocalStorage<Request>`
3. `handlers.ts` no longer owns the proxy-based `createMcpRequest()` bridge

**DI refactoring of `checkMcpClientAuth` (Phase 0 review finding 2026-03-26)**:
`check-mcp-client-auth.ts` hard-imports five dependencies from module scope
(`verifyClerkToken`, `getAuth`, `getRequestContext`, `toolRequiresAuth`,
`validateResourceParameter`) rather than receiving them as injected parameters.
This violates ADR-078 and forces `vi.mock` usage in the test file. Phase 4/5
must refactor this function to accept dependencies as parameters, eliminating
all `vi.mock` calls. See ADR-142 "Pre-existing ADR-078 gap" section.

**Dual auth paths (review finding 2026-03-26)**: Two independent auth
extraction paths currently exist and both must be addressed:

1. `check-mcp-client-auth.ts` calls `getAuth(req, ...)` directly on the stored
   Express request
2. `tool-auth-context.ts` offers `extractAuthContext()` via `req.auth`

**Update 2026-03-27**: `tool-auth-context.ts` has zero production callers and a
known bug (`scopes` always `undefined`). Convergence testing is unnecessary —
the dead path will be deleted in Phase 6. Phase 4 RED tests specify the new DI
contract only; the single active path (`check-mcp-client-auth.ts` via `getAuth`)
is replaced by the explicit `AuthInfo` parameter.

**Baseline requirement (review finding 2026-03-26)**: Before writing any RED
tests, run existing test suites and confirm they pass (exit 0). This
establishes a known-good baseline so RED failures can be attributed to the new
tests, not pre-existing breakage.

Target tests:

1. `apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.unit.test.ts`
2. `apps/oak-curriculum-mcp-streamable-http/src/handlers.integration.test.ts`
3. new unit/integration tests around the ingress context / adapter module

**Update 2026-03-27**: `ToolAuthContext` is dead code — not promoted. `AuthInfo`
from `@modelcontextprotocol/sdk/server/auth/types.js` is the explicit auth
contract (returned by `verifyClerkToken`, already in the MCP SDK type system).

**Acceptance criteria**:

1. The RED tests fail because auth still depends on the stored request or other
   ambient async-local state and the handler still owns request-shaping logic.
2. The desired end-state is specified at the boundary level — tests specify the
   auth contract behaviour (what auth context the tool receives, what happens
   for each token state), not implementation details (whether the proxy exists).
3. ~~A convergence test proves both auth paths produce identical decisions.~~
   Superseded: `tool-auth-context.ts` confirmed dead code (2026-03-27). No
   convergence test needed — the dead path is deleted in Phase 6.
4. Existing tests pass before any new RED tests are written (known-good
   baseline).

**Deterministic validation**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
# Expected during RED: non-zero because the ingress/auth boundary tests fail
```

**Completion (2026-03-27):**

- `check-mcp-client-auth.di.unit.test.ts` (renamed to `.di.integration.test.ts`
  in Phase 5) — 6 DI-based unit tests (3 RED, 3 pass through current code
  path). Zero `vi.mock` calls.
- `handlers.integration.test.ts` — Phase 4 RED test for
  `HandleToolOptions.authInfo` (TS2353 at type-check, passes at runtime).
- `createFakeAuthInfo` helper in `test-helpers/fakes.ts` using `AuthInfo` from
  MCP SDK with explicit per-field merging (type-reviewer fix).
- Pre-existing `as { auth?: unknown }` assertion replaced with
  `toHaveProperty('auth', undefined)` (type-reviewer fix).
- Stale Phase 2 RED comment cleaned up.
- 3 type errors (TS2724, TS2554, TS2353). 3 runtime test failures. 680
  existing tests pass.
- Code-reviewer: APPROVED. Type-reviewer: findings addressed.

## Phase 5 — GREEN: Replace the Request Proxy Bridge with One Explicit Auth Flow

Implement the explicit ingress boundary.

Required outcomes:

1. `handlers.ts` becomes composition-only and no longer contains
   `createMcpRequest()`
2. `request-context.ts` is deleted from the MCP HTTP app path rather than
   retained as a narrower ambient context store
3. `check-mcp-client-auth.ts` receives explicit auth context and no longer
   reaches back into stored request state to call `getAuth(req, ...)`
4. Clerk-specific interaction is confined to the ingress edge
5. any remaining transport adaptation lives in a dedicated ingress adapter
   module, not in `handlers.ts`

**Phase 4 type-reviewer obligation (2026-03-27)**: `AuthInfo.extra` is typed as
`Record<string, unknown>` in the MCP SDK (library type, cannot change). Phase 5
must NOT access `extra.userId` directly as `string`. Use a local Zod schema
`z.object({ userId: z.string().optional() }).passthrough()` or a type guard
at the access site.

**Acceptance criteria**:

1. Tool auth still validates bearer token and RFC 8707 resource semantics.
2. The production path no longer stores any ambient request context for MCP
   tool execution.
3. The production path no longer uses the proxy-based bridge from `handlers.ts`.
4. The production path follows the canonical ingress shape more closely:
   verification once at ingress, typed auth info passed forward explicitly.
5. No auth behaviour regressions are introduced for protected tools or public
   resources.

**Deterministic validation**:

```bash
rg -n "createMcpRequest" apps/oak-curriculum-mcp-streamable-http/src
# Expected after GREEN: zero matches

rg -n "AsyncLocalStorage<.*Request>|getRequestContext\\(" \
  apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.ts \
  apps/oak-curriculum-mcp-streamable-http/src/request-context.ts \
  apps/oak-curriculum-mcp-streamable-http/src/handlers.ts
# Expected after GREEN: zero matches (request-context.ts may be deleted entirely)

rg -n "getAuth\\(" \
  apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.ts \
  apps/oak-curriculum-mcp-streamable-http/src/handlers.ts
# Expected after GREEN: zero matches

pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
# Expected after GREEN: exit 0
```

**Completion (2026-03-27):**

- `check-mcp-client-auth.ts` — refactored to 6-param DI signature. Exports
  `CheckMcpClientAuthDeps`. Removes 5 hard imports (`getAuth`, `getRequestContext`,
  `verifyClerkToken`, `toolRequiresAuth`, `validateResourceParameter`). Zod parse
  for `AuthInfo.extra.userId` via `z.object({ userId: z.string().optional() }).loose()`.
- `tool-handler-with-auth.ts` — `HandleToolOptions` gains `authInfo?: AuthInfo`.
  Module-level `checkAuthDeps` constant for DI wiring. `executeWithAuthCapture`
  extracted to keep function within lint limits.
- `handlers.ts` — deleted `createMcpRequest()` Proxy (60 lines). New
  `extractAuthInfoAtIngress` extracts `AuthInfo` via `getAuth` + `verifyClerkToken`
  at ingress edge. Sets `req.auth = authInfo` for MCP SDK's native
  `StreamableHTTPServerTransport` → `extra.authInfo` channel. `registerTool`
  callback reads `extra.authInfo`. Removed `setRequestContext` import.
- `check-mcp-client-auth.unit.test.ts` — DELETED (5 `vi.mock`, ADR-078 violation).
- `check-mcp-client-auth.di.unit.test.ts` — RENAMED to `.di.integration.test.ts`.
- `handlers.integration.test.ts` — removed context propagation tests, updated
  auth property test to verify `req.auth` is `undefined` when no Bearer token.
- `test-helpers/fakes.ts` — `createFakeAuthInfo` simplified, stale JSDoc updated.
- 669 tests pass, 22 E2E pass. Zero lint errors. Zero type errors.

**Reviewer outcomes (2026-03-27):**

- security-reviewer: RISKS FOUND — silent auth failure documented in security
  design note; log message improved. No code change required beyond documentation.
- clerk-reviewer: ISSUES FOUND — double `getAuth`/`verifyClerkToken` is safe
  (both synchronous, pure). Phase 6 opportunity: middleware stores `AuthInfo`
  directly (eliminates `extractAuthInfoAtIngress`).
- code-reviewer: APPROVED WITH SUGGESTIONS — stale references to deleted
  `createMcpRequest` in `register-prompts.integration.test.ts` (Phase 6 cleanup).
- type-reviewer: AT-RISK (no critical) — `as unknown as` assertion justified and
  documented. `createFakeAuthInfo` spread-vs-`??` trade-off documented.
- mcp-reviewer: COMPLIANT — `req.auth` pattern canonically correct, `extra.authInfo`
  chain verified end-to-end against SDK v1.28.0 source.

**Phase 6 cleanup items recorded from reviewer passes:**

1. `register-prompts.integration.test.ts` — stale `createMcpRequest` reference and
   Proxy pattern in `createMcpTestRequest` (code-reviewer)
2. `check-mcp-client-auth.di.integration.test.ts` — "Phase 4 RED" describe label
   should become "Phase 5 GREEN" (code-reviewer)
3. `request-context.ts` — zero production callers remain; delete file and its unit
   tests (code-reviewer)
4. `tool-auth-context.ts` — dead code; delete (Phase 1 finding)
5. `ToolRegistrationServer` type alias — evaluate for deletion per no-type-shortcuts
   rule (code-reviewer)
6. `extractAuthInfoAtIngress` → middleware `req.auth` storage — eliminate double
   verification by having `mcpAuth` middleware store `AuthInfo` (clerk-reviewer)

## Phase 6 — REFACTOR, Documentation, Gates, Review — Complete (2026-03-27)

**What was done:**

1. **Dead code deletion**: `request-context.ts` + unit test (AsyncLocalStorage
   wrapper, zero callers), `tool-auth-context.ts` + unit test (dead auth context,
   known bugs), `createFakeRequest` from `fakes.ts`, `ToolRegistrationServer` type
   alias from `handlers.ts` (replaced with `McpServer` in consumers).
2. **Double auth verification eliminated**: `mcpAuth` middleware now stores verified
   `AuthInfo` on `res.locals.authInfo`. `createMcpHandler` reads it instead of
   re-calling `getAuth` + `verifyClerkToken`. `extractAuthInfoAtIngress` deleted.
   `handlers.ts` has zero Clerk imports — pure composition.
3. **Stale references cleaned**: `register-prompts.integration.test.ts` Proxy
   pattern replaced with direct cast (matching production pattern). Phase 4 RED
   labels removed from test describe blocks and TSDoc.
4. **Documentation propagated**: `auth-error-response.ts` ChatGPT references
   reframed to MCP-standard. `session-continuation.prompt.md` updated to reflect
   completion and advance to WS3. ADR-046/141 reviewed — no changes needed.
5. **Quality gates**: Full chain passed (see Task 7).
6. **Reviewer passes**: 6 specialists completed (see Task 8).

**Acceptance criteria (all met):**

1. Superseded bridge code and stale commentary deleted ✓
2. Docs record new ownership boundary ✓
3. Full quality gate chain passes ✓
4. Reviewer findings implemented or explicitly rejected ✓

## Phase 7 — Post-Review Remediation (2026-03-28)

**Status**: Complete (2026-03-28)
**Source**: Comprehensive 9-reviewer pass (code, type, security, mcp, clerk,
test, architecture-fred, architecture-wilma, architecture-barney). All findings
are blocking per project rules.

### Tier 0: Merge blocker (user-identified, 2026-03-28)

#### S. Widget UI renders for every tool — should only render for specific tools

**Flagged by**: User (manual testing in Claude client)

**Problem**: The codegen emitter (`emit-index.ts:156-158`) unconditionally sets
`_meta: { ui: { resourceUri: WIDGET_URI } }` on **every generated tool**.
Aggregated tool definitions (`definitions.ts`) also set `_meta.ui` on all tools
except `download-asset`. This means ~30+ tools all advertise a widget UI. The
MCP client (Claude) sees `_meta.ui` on every tool result and renders the widget
— producing a "flash of content that then collapses to an empty green bar" for
every tool call.

**The widget itself** (`aggregated-tool-widget.js`, `widget-file-generator.ts`)
is a generic JSON viewer still using `window.openai` patterns — the WS3 React
migration has not happened yet.

**User-specified correct behaviour**:

- `get-curriculum-model`: minimal branding only
- `search`: minimal branding only
- `user-search` (future WS4): full user-facing interface
- **All other tools: NO widget UI** — no `_meta.ui` at all

**Root cause**: The emitter unconditionally emits `_meta.ui` at
`emit-index.ts:151-158` with the comment "All generated curriculum tools share
the Oak JSON viewer widget". This was a WS2 decision that assumed every tool
would eventually have a widget. The user has clarified this is wrong.

**Fix** (spans SDK codegen + aggregated definitions + app resources):

1. **Codegen**: Make `_meta.ui` emission conditional — only tools in an
   explicit allowlist emit `_meta.ui.resourceUri`. The allowlist could be a
   constant in `cross-domain-constants.ts` or passed as a generator parameter.
2. **Aggregated definitions**: Remove `_meta.ui` from all aggregated tools
   except those in the allowlist (currently: `search`,
   `get-curriculum-model`).
3. **Tests**: Update projection tests and E2E tests that assert widget
   metadata on all tools.
4. **Widget resource**: Keep `registerWidgetResource` — it still serves the
   HTML for the tools that do have `_meta.ui`. But it should only be
   referenced by the allowlisted tools.

**Impact**: Without this fix, every tool call in any MCP client (Claude,
Cursor, etc.) shows a broken/empty widget UI. This is a user-visible
regression that blocks merge to `main`.

**Files**: `emit-index.ts`, `definitions.ts`, `projections.unit.test.ts`,
`handlers.integration.test.ts`, E2E test files

**Sequencing**: Must be done BEFORE Tier 1 items — this is a merge blocker.

---

### Tier 1: High-confidence (flagged by 5+ reviewers)

#### A. `req.auth` global augmentation + `Object.assign` mutation

**Flagged by**: type-reviewer, security-reviewer, clerk-reviewer,
architecture-wilma, code-reviewer

**Problem**: `types.ts:47` declares `auth` as non-optional callable
`(options?) => AuthObject`. `handlers.ts:195` overwrites with `AuthInfo` via
`Object.assign`. TypeScript believes `req.auth` is always a callable Clerk
accessor; at runtime it's `AuthInfo | undefined` after mutation. Any downstream
`getAuth(req)` call after mutation would runtime-error with no compiler warning.

**Fix**:

1. Make `auth` optional in the global Express.Request augmentation
2. Add explicit type annotation to `Object.assign` result:
   `const mcpRequest: IncomingMessage & { auth?: AuthInfo } = Object.assign(baseReq, { auth: authInfo })`
3. Consider `Object.create(req)` to avoid mutating the original request

**Files**: `auth/mcp-auth/types.ts`, `handlers.ts`

#### B. `.loose()` on `authInfoSchema`

**Flagged by**: type-reviewer, security-reviewer, mcp-reviewer,
architecture-wilma, architecture-barney

**Problem**: `authInfoSchema` in `handlers.ts:70-79` uses `.loose()` which
allows unknown properties through at the boundary. Violates
strict-validation-at-boundary principle. Future SDK version drift would be
silently accepted.

**Fix**: Replace `.loose()` with `.strict()` (fail on unknown fields). If a
future SDK version adds fields, the Zod parse fails fast — prompting an
intentional schema update. Also replace `.loose()` with `.passthrough()` on
`authInfoExtraSchema` in `check-mcp-client-auth.ts:39` for clarity.

**Files**: `handlers.ts`, `check-mcp-client-auth.ts`

#### C. `DANGEROUSLY_DISABLE_AUTH` production guard

**Flagged by**: security-reviewer, architecture-wilma

**Problem**: No enforcement that the flag cannot be set in production. If
accidentally deployed with `DANGEROUSLY_DISABLE_AUTH=true` and
`VERCEL_ENV=production`, all auth is silently bypassed.

**Fix**: Add `superRefine` guard in `HttpEnvSchema` (in `env.ts`) that rejects
`DANGEROUSLY_DISABLE_AUTH=true` when `VERCEL_ENV === 'production'`. This makes
misconfiguration a hard startup failure.

**Files**: `env.ts`

### Tier 2: Solid (flagged by 2-3 reviewers)

#### D. `authInfoSchema.parse()` throws unhandled ZodError

**Flagged by**: security-reviewer, architecture-wilma, code-reviewer

**Problem**: Malformed `res.locals.authInfo` throws `ZodError` — propagates as
unstructured 500, potentially leaking internal validation details.

**Fix**: Use `safeParse` with explicit error response. On failure, log at
`error` level and return HTTP 500 with structured body. No stack traces to
client.

**Files**: `handlers.ts`

#### E. `authInfoSchema` split across two files

**Flagged by**: architecture-barney, type-reviewer

**Problem**: `authInfoSchema` in `handlers.ts` and `authInfoExtraSchema` in
`check-mcp-client-auth.ts` validate the same `AuthInfo` contract independently.
If the shape changes, two files must be updated.

**Fix**: Extract shared `authInfoSchema` into `auth-info-schema.ts`. Both
`handlers.ts` and `check-mcp-client-auth.ts` import from there.

**Files**: New `auth-info-schema.ts`, `handlers.ts`, `check-mcp-client-auth.ts`

#### F. `checkAuthDeps` sealed at module level

**Flagged by**: architecture-barney, code-reviewer

**Problem**: `tool-handler-with-auth.ts` wires `CheckMcpClientAuthDeps` at
module scope — DI benefit of `checkMcpClientAuth` doesn't propagate.
`handleToolWithAuthInterception` can't be tested with fake auth deps without
`vi.mock`.

**Fix**: Surface `CheckMcpClientAuthDeps` as optional field on
`HandleToolOptions`. Default to real implementations at the call site in
`handlers.ts`.

**Files**: `tool-handler-with-auth.ts`, `handlers.ts`

#### G. Transport cleanup chain

**Flagged by**: architecture-wilma

**Problem**: If `transport.close()` rejects, `server.close()` never runs.
Logger is optional — errors silently swallowed if logger undefined.

**Fix**: Use `Promise.allSettled([transport.close(), server.close()])` or
sequential with independent error handling. Always log errors unconditionally.

**Files**: `handlers.ts`

### Tier 3: Single-reviewer findings (valid, lower priority)

#### H. `zod/v4` import in E2E test

**Flagged by**: architecture-fred

**Problem**: `widget-metadata.e2e.test.ts:15` imports `zod/v4`; all other
files import `zod`. Risk of `instanceof` mismatch.

**Fix**: Change to `import { z } from 'zod'` for consistency.

**Files**: `e2e-tests/widget-metadata.e2e.test.ts`

#### I. `vi.spyOn(console, 'error').mockImplementation()` in conformance test

**Flagged by**: architecture-fred, test-reviewer

**Problem**: Mutates global `console` object (ADR-078). The spy observation
works without `mockImplementation`.

**Fix**: Remove `mockImplementation()` — keep `vi.spyOn(console, 'error')`
alone.

**Files**: `auth/mcp-auth/verify-clerk-token.unit.test.ts`

#### J. Type assertion in conformance test

**Flagged by**: architecture-fred

**Problem**: `as unknown as MachineAuthObject<'oauth_token'>` at line 70-71.
Type assertions are forbidden.

**Fix**: Extend `createFakeMachineAuthObject` to accept a `tokenType` override
parameter, or use a loosened Zod schema to construct the invalid shape.

**Files**: `auth/mcp-auth/verify-clerk-token.unit.test.ts`,
`test-helpers/fakes.ts`

#### K. Duplicated E2E Zod schemas for widget CSP metadata

**Flagged by**: architecture-fred

**Problem**: `widget-metadata.e2e.test.ts` and `widget-resource.e2e.test.ts`
both define Zod schemas for the same MCP Apps UI metadata structure.

**Fix**: Extract shared schemas into `e2e-tests/helpers/mcp-apps-schemas.ts`.

**Files**: `e2e-tests/widget-metadata.e2e.test.ts`,
`e2e-tests/widget-resource.e2e.test.ts`, new
`e2e-tests/helpers/mcp-apps-schemas.ts`

#### L. `ResourceRegistrar` inline Pick repeated 6x

**Flagged by**: architecture-barney

**Problem**: `Pick<McpServer, 'registerResource'>` repeated 6 times in
`register-resources.ts` after deleting the type alias. DRY violation.

**Fix**: Reintroduce as `interface ResourceRegistrar extends Pick<McpServer, 'registerResource'> {}`
(an interface, not a type alias — compliant with the no-alias rule).

**Files**: `register-resources.ts`

#### M. `toProtocolEntry` missing `type: "object"` enforcement

**Flagged by**: mcp-reviewer

**Problem**: Bypasses the SDK's internal `type: "object"` enforcement on
`ToolSchema.inputSchema`. If any tool descriptor has a non-object root schema,
the `tools/list` response would be protocol-invalid.

**Fix**: Add compile-time or runtime check that `tool.inputSchema.type ===
'object'` in `toProtocolEntry`.

**Files**: `projections.ts`

#### N. Phase label in test describe block

**Flagged by**: test-reviewer

**Problem**: `handlers.integration.test.ts:159` — `'(Phase 2 RED)'` in
describe block. Plan-phase markers should not be in committed test names.

**Fix**: Rename to describe stable behaviour, e.g. `'tool registration uses
SDK canonical projection'`.

**Files**: `handlers.integration.test.ts`

#### O. Misplaced test in `handlers.integration.test.ts`

**Flagged by**: test-reviewer, code-reviewer

**Problem**: `'explicit auth context propagation'` describe block (lines
230-253) tests `handleToolWithAuthInterception`, not `handlers.ts`.

**Fix**: Move to `tool-handler-with-auth.integration.test.ts`. Focus assertion
on observable auth-error response content, not just `isError: true`.

**Files**: `handlers.integration.test.ts`, new or existing
`tool-handler-with-auth.integration.test.ts`

#### P. Token prefix leaked to logs (10 chars)

**Flagged by**: security-reviewer

**Problem**: `resource-parameter-validator.ts:146-153` logs first 10 characters
of token. Pre-existing but in scope.

**Fix**: Reduce to 4-6 characters, or log only token format (e.g. `"jwt"` vs
`"opaque"`).

**Files**: `resource-parameter-validator.ts`

#### Q. Opaque tokens pass RFC 8707 without resource binding

**Flagged by**: security-reviewer

**Problem**: Pre-existing. Opaque tokens unconditionally pass RFC 8707
validation. Security assumption undocumented.

**Fix**: Document the assumption that Clerk's `verifyClerkToken` performs
resource binding for opaque tokens, or implement server-side resource binding
verification.

**Files**: `resource-parameter-validator.ts` (documentation)

#### R. `getAuth` precondition undocumented

**Flagged by**: clerk-reviewer

**Problem**: `mcp-auth-clerk.ts:43` calls `getAuth(req)` which requires
`clerkMiddleware()` upstream. Precondition undocumented.

**Fix**: Add TSDoc `@requires` or `@precondition` note.

**Files**: `auth/mcp-auth/mcp-auth-clerk.ts`

#### T. `get-curriculum-model` conflates tool and prompt roles

**Flagged by**: User evaluation (2026-03-28), verified against MCP spec

**Problem**: `get-curriculum-model` does double-duty as both a data retrieval
tool (domain model JSON) and a workflow prompt ("call this ONCE at conversation
start", "tool guidance, categories, workflows, tips"). The MCP spec separates
these: tools for data operations, prompts for workflow guidance. The server
already registers 4 prompts (`find-lessons`, `lesson-planning`,
`explore-curriculum`, `learning-progression`) but the primary onboarding
workflow is embedded in a tool, not a prompt.

**Impact**: Current MCP clients mostly only support tools well, so this works
today. But as clients improve prompt support, the workflow guidance should
live in a prompt. Also creates confusion about primitive boundaries.

**Fix**: Design question for WS3/WS4 — consider extracting the workflow
guidance portion of `get-curriculum-model` into an `onboard` or
`get-started` prompt, keeping the tool focused on returning the domain model
data.

**Files**: Design-level — affects SDK aggregated tool + prompts

#### U. `get-keywords` description claims frequency order but API returns alphabetical

**Flagged by**: User evaluation (2026-03-28), verified against upstream API

**Problem**: Tool description says "keywords are returned in order of
frequency, with the most common keywords appearing first". Upstream API at
`/api/v0/keywords?keyStage=ks3&subject=science` actually returns
alphabetical order. Our code passes through the response faithfully — the
mismatch is in the upstream OpenAPI spec documentation.

**Verified**: Direct `curl` to upstream API confirms alphabetical. No sorting
in our codegen or SDK code.

**Fix**:

1. Override the description at codegen time for `get-keywords` to say
   "alphabetical order" (accurate to observed behaviour)
2. Upstream issue already documented at
   `.agent/plans/external/ooc-issues/keywords-ordering-mismatch.md`

**Files**: `emit-index.ts` (description override mechanism) or upstream
OpenAPI spec

**Flagged by**: clerk-reviewer

**Problem**: `mcp-auth-clerk.ts:43` calls `getAuth(req)` which requires
`clerkMiddleware()` upstream. Precondition undocumented.

**Fix**: Add TSDoc `@requires` or `@precondition` note.

**Files**: `auth/mcp-auth/mcp-auth-clerk.ts`

### Pre-Phase-7 Quality Gate Baseline (2026-03-28)

Full sequential gate run — all 15 gates green:

| Gate | Status | Notes |
| ---- | ------ | ----- |
| `sdk-codegen` | GREEN | 12/12 cached |
| `build` | GREEN | 16/16 |
| `type-check` | GREEN | 27/27 |
| `doc-gen` | GREEN | 13/13 (3 warnings: stale glob in search-cli) |
| `lint:fix` | GREEN | 0 errors, 105 warnings (`consistent-type-assertions` in test files) |
| `format:root` | GREEN | |
| `markdownlint:root` | GREEN | |
| `subagents:check` | GREEN | 17 wrappers, 14 templates |
| `portability:check` | GREEN | 26 rules, 40 adapters |
| `test:root-scripts` | GREEN | 23 tests |
| `test` | GREEN | 27/27 workspaces |
| `test:e2e` | GREEN | 22/22 workspaces |
| `test:ui` | GREEN | 20 Playwright tests |
| `smoke:dev:stub` | GREEN | Smoke suite passed |
| `practice:fitness` | PASS | All docs within soft ceilings |

The 105 lint warnings are all `consistent-type-assertions` in test/spec files.
Phase 7 items I, J, and the test helper consolidation should reduce this count.

### Acceptance Criteria

1. All Tier 1-3 items addressed (fixed or explicitly rejected with rationale)
2. Zero new `eslint-disable` comments in production code
3. Zero type assertions in production code
4. Full quality gate chain passes (target: reduce 105 lint warnings)
5. 9-reviewer re-review confirms no regressions

### Recommended Sequencing

0. **S** (Tier 0) — MERGE BLOCKER. Fix widget `_meta.ui` emission first.
   Spans codegen + aggregated definitions + tests.
1. **A + B + C** (Tier 1) — address next, highest reviewer confidence
2. **D + E** — `safeParse` and schema extraction (related to A+B)
3. **F + G** — DI propagation and cleanup chain
4. **H + I + J + K** — quick test/E2E fixes
5. **L + M + N + O** — structural cleanup
6. **P + Q + R** — documentation and hardening

### Implementation Notes

- Items A, B, D, E all touch `handlers.ts` — sequence A before B before D+E
  to avoid merge conflicts within a session.
- Item F touches `tool-handler-with-auth.ts` and `handlers.ts` — sequence
  after A+B+D+E.
- Items H, I, J, K are independent test/E2E fixes — can be parallelised via
  subagents.
- Items L, M are SDK-layer changes — independent of app-layer items.
- Items P, Q, R are documentation-only — can be done last.

---

## Phase 8 — Eliminate the `res.locals` auth bridge (2026-03-28)

**Status**: COMPLETE (2026-03-28) — 4 commits on `feat/mcp_app`

**Commits** (oldest first):
1. `6992e656` — Core Phase 8: type-safe auth boundary, file splits, security hardening
2. `03bf000c` — Code-reviewer fixes: silent assertion paths, handlers.ts TSDoc
3. `76dfb730` — Test-reviewer fixes: underscore params, duplicated tests, describe label
4. `ea6bc42b` — Eliminate ALL eslint-disable from test helpers: narrow interfaces + node-mocks-http

**Reviewer scorecard** (12 specialist passes across 2 rounds):

| Reviewer | Round 1 | Round 2 |
|----------|---------|---------|
| code-reviewer | APPROVED WITH SUGGESTIONS | All 4 findings fixed |
| type-reviewer | AT-RISK | SAFE (8 remaining `as` all in SDK boundary fakes) |
| test-reviewer | ISSUES FOUND | All actionable findings fixed |
| architecture-reviewer-fred | COMPLIANT | COMPLIANT (both warnings resolved) |
| security-reviewer | LOW RISK | All 3 recommendations addressed |
| architecture-reviewer-wilma | COMPLIANT WITH HARDENING | COMPLIANT WITH RISK |

**Architectural changes in Phase 8**:
- `McpRequestContext` uses narrow `McpRequestServer`/`McpRequestTransport` interfaces
- `McpHandlerRequest`/`McpHandlerResponse` decouple handler from Express types
- `node-mocks-http` replaces hand-written Express fakes for middleware tests
- All 9 `eslint-disable` directives eliminated from test helpers
- 2 targeted `as` assertions managed via eslint config override (registerTool overload + Clerk type violations)
- `req.auth = authData` (direct assignment) replaces `Object.assign(req, { auth })`
- `req.auth = undefined` cleanup in response close handler
- Dead re-exports deleted from `auth/mcp-auth/types.ts`

**What went wrong in the first attempt** (session that preceded this one):
The session tried to fix `max-lines` by condensing TSDoc and adding `eslint-disable` — both forbidden. The correct fix: split files by responsibility, tighten types at the source.

**What went right in the remediation session**:
Deep re-grounding in principles. 6 specialist reviewers in round 1, found and fixed all findings. User escalated: "eslint-disable is BANNED". Second round eliminated ALL 9 directives through architectural narrowing + off-the-shelf library.

### Remaining follow-up work (not blocking Phase 8 completion)

These items were identified during Phase 8 but are independent concerns:

1. **CallToolResult coupling** (type-reviewer) — test helpers import
   `CallToolResult` type from SDK. Replace with `unknown` + `CallToolResultSchema`
   Zod validation at test boundary. Low risk, small scope.

2. **Opaque token RFC 8707 bypass** (security-reviewer) — `verifyClerkToken`
   performs zero audience validation. Clerk's `token_introspection_endpoint` is
   exposed in PRM metadata but never called. Tokens can be replayed across servers
   sharing a Clerk app. Needs separate plan for async token introspection.

3. **Test complexity in `tool-handler-with-auth.integration.test.ts`**
   (test-reviewer deep scan) — `createMockDependencies` re-implements the
   executor factory chain. Root cause: `ToolHandlerDependencies` exposes
   factories-of-factories. Simplify the DI interface so mocks are trivial.

4. **`authLogContextSchema` in test helper** — should be in product code
   (the log context shape is a product code contract). Move adjacent to the
   logging call.

5. **Three duplicate logger fakes** — `createFakeLogger` (fakes.ts),
   `createTestLogger` (app/test-helpers/), `createRecordingLogger` (inline).
   Consolidate to one.

6. **`verify-clerk-token.unit.test.ts` tests external library** — these are
   conformance tests per ADR-142 (legitimate), but `vi.spyOn(console, 'error')`
   is global state. Consider whether these tests justify their maintenance cost.

7. **SDK module path fragility** — `import type {} from
   '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js'` depends on
   an internal SDK path. Documented with version pin. If SDK moves it, type-check
   fails immediately with a clear error.

**Design reviewed** — approved by code-reviewer and architecture-barney
**Source**: Adversarial investigation of the `Object.assign(req, { auth })` bridge
in `createMcpHandler` (2026-03-28). Triggered by user instinct that the
manipulation felt wrong. Investigation revealed the root cause: a false
Express.Request global augmentation in `types.ts` that declared `req.auth` as
Clerk's callable type. Clerk does not actually declare a global augmentation —
it uses `ExpressRequestWithAuth` as a standalone intersection type. Removing
the false augmentation eliminated the type conflict. This phase completes the
simplification by removing the `res.locals` intermediary entirely.

### Problem

The auth data flow has an unnecessary hop:

```text
mcpAuth middleware → res.locals.authInfo = AuthInfo
handler → reads res.locals.authInfo → Zod validates → Object.assign(req, { auth }) → transport reads req.auth
```

The MCP SDK's intended pattern is simpler:

```text
auth middleware → req.auth = AuthInfo → transport reads req.auth
```

The `res.locals` intermediary existed because our (now-deleted) global
augmentation declared `req.auth` as Clerk's callable, creating a type conflict
with the SDK's `AuthInfo` data. With the augmentation removed, the conflict is
gone.

### Design: Move auth storage from `res.locals` to `req.auth`

**Change `mcpAuth` middleware** (`mcp-auth.ts:205`):

```typescript
// BEFORE:
res.locals.authInfo = authData;

// AFTER:
Object.assign(req, { auth: authData });
```

This aligns with both:

- The MCP SDK's `requireBearerAuth` pattern (`bearerAuth.js:36`)
- Clerk's own `clerkMiddleware` pattern (`index.mjs:191`)

Both frameworks use `Object.assign(request, { auth: ... })` at runtime.

**Simplify `createMcpHandler`** (`handlers.ts`):

Remove the auth bridge. The handler retains `IncomingMessage` narrowing for
type compatibility with `transport.handleRequest(req: IncomingMessage & { auth?: AuthInfo })`:

```typescript
const { server, transport } = mcpFactory();
await server.connect(transport);
const baseReq: IncomingMessage = req;
await transport.handleRequest(baseReq, res, req.body);
```

The `const baseReq: IncomingMessage = req` narrowing is necessary because
`transport.handleRequest` expects `IncomingMessage & { auth?: AuthInfo }`.
Express `Request` extends `IncomingMessage`, so the assignment is safe. The
middleware has already set `req.auth` via `Object.assign`, so the transport
reads it natively.

**Zod validation in `createMcpAuthClerk`** (resolved design decision):

Zod validation of `authData` moves into `createMcpAuthClerk` (the
Clerk-specific wrapper in `mcp-auth-clerk.ts`), NOT into generic `mcpAuth`.
This preserves `mcpAuth`'s provider-agnosticism — it takes a generic
`TokenVerifier` and has no knowledge of the `AuthInfo` schema shape. The
Clerk-specific wrapper already knows it produces `AuthInfo` via
`verifyClerkToken`, so co-locating the `.strict()` validation there is
architecturally correct.

**Relocate `auth-info-schema.ts`** to `src/auth/mcp-auth/auth-info-schema.ts`
(co-located with `mcp-auth-clerk.ts`). Confirmed: `authInfoSchema` has exactly
one runtime consumer (`handlers.ts`) which will no longer need it. The
`check-mcp-client-auth.ts` file defines its own `authInfoExtraSchema`
independently and is unaffected.

**Update tests** — handler tests that set `res.locals.authInfo` change to use
`Object.assign(req, { auth })` to match the middleware pattern. The concurrent
isolation test adapts accordingly.

### What this eliminates

1. `res.locals.authInfo` as a transport mechanism (replaced by `req.auth`)
2. `Object.assign` in `createMcpHandler` (middleware already set `req.auth`)
3. Zod validation in the handler (moved to `createMcpAuthClerk`)
4. The handler's knowledge of auth entirely — it becomes pure MCP composition
5. The comment explaining why `Object.assign` exists
6. `auth-info-schema.ts` import in `handlers.ts`

### What this preserves

1. `mcpAuth` still runs before the handler — 401 responses still work
2. Zod validation still happens — in `createMcpAuthClerk`, at the point of
   production, before setting `req.auth`
3. The SDK transport still reads `req.auth` — the mechanism is unchanged
4. The `DANGEROUSLY_DISABLE_AUTH` path still works — when auth is disabled,
   the entire `mcpRouter` middleware chain (including `mcpAuth`) is replaced
   by a no-auth route in `auth-routes.ts`. `req.auth` is never set, and the
   transport receives `undefined`, which tools check via `checkMcpClientAuth`.
   Confirmed: `auth-routes.ts` wires `mcpRouter` conditionally — when auth is
   disabled, a separate route without `mcpAuth` is used.
5. `mcpAuth`'s provider-agnosticism — generic `TokenVerifier`, no Zod dependency

### Risk

- Tests that mock `res.locals.authInfo` must change to test the `req.auth`
  path instead. This is a test-only change.
- The `IncomingMessage` narrowing in the handler (`const baseReq: IncomingMessage = req`)
  is a type-level step that drops Express augmentations. This is intentional
  and necessary — `transport.handleRequest` expects `IncomingMessage`, not
  `Request`. Invoke `type-reviewer` during implementation to confirm.

### Files affected

- `src/auth/mcp-auth/mcp-auth.ts` — change line 205 (`res.locals` → `Object.assign`),
  update TSDoc item 7 ("stores on `res.locals`" → "sets `req.auth`")
- `src/auth/mcp-auth/mcp-auth-clerk.ts` — add Zod validation of `authData`
  before returning from `verifyToken` callback, update TSDoc
- `src/handlers.ts` — delete auth bridge code (lines 156-182), retain
  `IncomingMessage` narrowing, remove `authInfoSchema` import
- `src/auth-info-schema.ts` → relocate to `src/auth/mcp-auth/auth-info-schema.ts`
- `src/auth-info-schema.unit.test.ts` → relocate alongside schema
- `src/handlers.integration.test.ts` — update tests (`res.locals` → `req.auth`)
- `src/handlers-auth-errors.integration.test.ts` — verify unaffected (uses
  `registerHandlers` which is unchanged)

### TDD approach

1. RED: Write test asserting `createMcpAuthClerk` validates `authData` with
   `.strict()` schema (rejects unknown fields)
2. RED: Write test asserting `mcpAuth` sets `req.auth` (not `res.locals`)
3. RED: Write handler test asserting transport receives `req.auth` without
   the handler setting it (middleware already did)
4. GREEN: Add Zod validation to `createMcpAuthClerk`, change `mcpAuth` line
   205, simplify handler
5. REFACTOR: Relocate schema, delete bridge code, update TSDoc

---

## Success Criteria

1. The HTTP app no longer serialises MCP tool protocol fields itself.
2. The MCP tool surface is projected canonically from the SDK and remains ready
   for `outputSchema` exposure without another app-layer rewrite.
3. The MCP ingress/auth path no longer depends on storing the full Express
   request or proxying Clerk's `auth` away inside `handlers.ts`.
4. All full-repo quality gates pass.
5. The resulting boundary is simpler, thinner, and more obviously aligned with
   the repo's schema-first architecture.

## Dependencies

**Blocking**:

1. WS2 runtime/resource migration must be present in the branch used for
   execution.
2. Complete Phase 3 of this plan before landing any `outputSchema`
   transport-exposure work from `output-schemas-for-mcp-tools.plan.md`.

**Related plans**:

1. `../active/mcp-app-extension-migration.plan.md` — umbrella MCP Apps
   migration plan
2. `../active/ws2-app-runtime-migration.plan.md` — the runtime baseline this
   cleanup builds on
3. `output-schemas-for-mcp-tools.plan.md` — adjacent queued work whose
   transport-exposure phase depends on the canonical descriptor groundwork from
   this plan

**Recommended sequencing**:

Run this plan immediately after WS2 and complete it before promoting WS3.
If a later session proposes deferring it, record an explicit rationale in the
session napkin and update the umbrella migration plan before any WS3
implementation begins.

Also complete Phase 3 of this plan before landing Phase 3 of
`output-schemas-for-mcp-tools.plan.md`, so `outputSchema` is threaded through
the canonical descriptor surface rather than the pre-simplification app-owned
exposure path.

## References

1. `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`
2. `apps/oak-curriculum-mcp-streamable-http/src/tools-list-override.ts`
3. `apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.ts`
4. `apps/oak-curriculum-mcp-streamable-http/src/auth/tool-auth-context.ts`
5. `apps/oak-curriculum-mcp-streamable-http/src/request-context.ts`
6. `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts`
7. `.agent/directives/principles.md`
8. `.agent/directives/testing-strategy.md`
9. `.agent/directives/schema-first-execution.md`
10. MCP Apps server helpers: [registerAppTool() and registerAppResource()](https://apps.extensions.modelcontextprotocol.io/api/modules/server-helpers.html)
11. MCP Apps migration guide: [Migrating from OpenAI Apps SDK to MCP Apps SDK](https://apps.extensions.modelcontextprotocol.io/api/documents/migrate-openai-app.html)
12. Clerk Express MCP guide: [Build an MCP server in your application with Clerk](https://clerk.com/docs/expressjs/guides/ai/mcp/build-mcp-server)
13. `@clerk/mcp-tools` npm package: <https://www.npmjs.com/package/@clerk/mcp-tools>
14. `@clerk/mcp-tools` GitHub: <https://github.com/clerk/mcp-tools>

---

## Review Findings Log (2026-03-26)

15 specialist review passes across 5 waves (12 pre-plan + 3 Phase 1). Key
findings affecting this plan:

### Incorporated into Phase 0 (new)

- **`@clerk/mcp-tools/express` provides official utilities** (`mcpAuthClerk`,
  `protectedResourceHandlerClerk`, `authServerMetadataHandlerClerk`,
  `streamableHttpHandler`) that overlap with hand-rolled auth code. Package is
  already a dependency at `^0.3.1` but its Express utilities are unused. No ADR
  documents this decision. Phase 0 added to investigate and document.
  (clerk-reviewer, Wave 4)

### Incorporated into Phase 4/5 scope notes

- **Dual Clerk auth paths**: `check-mcp-client-auth.ts` calls `getAuth()`
  directly; `tool-auth-context.ts` offers `extractAuthContext()`. Phase 4 RED
  tests must target both paths. (betty, security-reviewer)
- **`AsyncLocalStorage` isolation is correct**: Wilma's race condition concern
  withdrawn after Express patterns verification confirmed `AsyncLocalStorage.run()`
  provides correct per-request isolation by design. (Express verifier, Wave 4)

### Incorporated into Phase 6 cleanup scope

- **`ToolRegistrationServer` type alias** in `handlers.ts` — violates no-alias
  principle. Delete during Phase 6. (fred, betty)
- **`tools-list-override.ts:52` comment** says "OpenAI Apps SDK" — stale after
  WS1. Correct during Phase 6. (fred, betty)
- **`auth-error-response.ts` ChatGPT-specific TSDoc** — reframe as MCP-standard
  during Phase 6. (fred, security-reviewer)

### Noted for awareness

- **`getUiCapability()` returns `undefined`, not `null`** — any future code must
  use falsy checks, not `=== null`. (mcp-reviewer live-spec, Wave 4)
- **`McpUiResourcePermissions` is an object, not an array** — `permissions: []`
  would be a type error. Absent field is the secure default. (mcp-reviewer
  live-spec, Wave 4)
- **`updateModelContext()` is replace-not-append** — relevant for WS4 design,
  not this plan. (mcp-reviewer, Wave 1+4)
- **`registerAppTool` auto-populates deprecated `_meta["ui/resourceUri"]`** —
  no need to emit manually. (mcp-reviewer live-spec, Wave 4)

### Phase 1 Seam Audit Findings (2026-03-26)

3 specialist review passes: `mcp-reviewer`, `architecture-reviewer-barney`,
`clerk-reviewer`.

#### Decisions (incorporated into plan scope)

- **`tool-auth-context.ts`: DELETE, do not promote.** Dead code confirmed
  (zero production callers). `ToolAuthContext` shadows Clerk's
  `MachineAuthObject<'oauth_token'>` — promoting it creates a local interface
  that must be reconciled with what Clerk already provides. YAGNI applies.
  `extractAuthContext()` also has a correctness bug: calls `req.auth()` without
  `{ acceptsToken: 'oauth_token' }`, returning session-typed auth for OAuth
  requests. Delete in Phase 6: file, unit test, `createFakeRequest` from
  `fakes.ts`. (barney, clerk-reviewer)

- **`tools/list` override cannot be eliminated by MCP SDK upgrade.** Zod→JSON
  Schema structurally cannot preserve `examples` (no `.examples()` on Zod, SDK
  issue #685 closed as "requires protocol-level changes"). Phase 3 must build
  an SDK-owned protocol projection function; the app wires it to
  `server.server.setRequestHandler()`. The "disappears entirely" path is
  blocked. (mcp-reviewer)

- **`_meta.ui.resourceUri` is NOT auto-generated by `registerAppTool()`.** It
  only normalises legacy key compat. The canonical descriptor must carry
  `_meta.ui.resourceUri` explicitly. Current `listUniversalTools` already does
  this correctly. (mcp-reviewer)

- **Canonical ingress pattern**: `getAuth(req, { acceptsToken: 'oauth_token' })`
  once at edge → `verifyClerkToken(authData, token)` → forward `AuthInfo` as
  typed context. `getAuth()` calls `req.auth()` internally; they are not
  independent. Cannot bypass `getAuth()` because `verifyClerkToken` requires
  `MachineAuthObject<'oauth_token'>` as input. (clerk-reviewer)

#### Scope adjustments for later phases

- **Phase 3**: SDK must emit both `flatZodSchema` (for `registerAppTool()`
  registration) and `inputSchema` (JSON Schema for protocol projection).
  Registration loop should pass `flatZodSchema` as `registerAppTool()`'s
  `inputSchema` parameter. Tools with `_meta.ui` → `registerAppTool()`, tools
  without → base `registerTool()`. (mcp-reviewer)

- **Phase 4/5**: Auth orchestration in `check-mcp-client-auth.ts` (bearer
  parsing, Clerk `getAuth` config, `verifyClerkToken`, RFC 8707 validation)
  is reusable MCP auth domain logic. Consider extracting to a shared library
  so the app's ingress becomes a single function call. Without extraction,
  the app remains too thick. (barney)

- **Phase 4/5**: Forward `AuthInfo` (the output of `verifyClerkToken`), not
  `MachineAuthObject`. `AuthInfo` has `{ token, scopes, clientId,
  extra: { userId } }` — this is the typed context the tool layer receives.
  (clerk-reviewer)

- **Phase 6**: Delete `tool-auth-context.ts`, its unit test, and
  `createFakeRequest` from `fakes.ts`. `createFakeExpressRequest` already
  exists for tests needing Express `Request` shape. (barney)

#### Specialist follow-ups recommended

- **Wilma**: Pressure-test `createMcpRequest` Proxy removal safety once
  `AsyncLocalStorage` is eliminated. (barney)
- **Test reviewer**: Audit `check-mcp-client-auth.unit.test.ts` for `vi.mock`
  violations and recommend DI-based alternative. (barney)
- **Verify at implementation time**: `flatZodSchema` (`z.ZodRawShape`) is
  assignable to `registerAppTool()`'s `ZodRawShapeCompat | AnySchema`
  parameter type. (mcp-reviewer)
