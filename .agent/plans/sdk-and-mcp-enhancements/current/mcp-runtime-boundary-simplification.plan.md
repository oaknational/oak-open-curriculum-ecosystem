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
    status: pending
  - id: phase-3-green-tool-surface
    content: "Phase 3 (GREEN): Move tool-surface projection into the curriculum SDK, then simplify the HTTP app so it consumes the SDK projection instead of serialising tool metadata itself."
    status: pending
  - id: phase-4-red-ingress-boundary
    content: "Phase 4 (RED): Add failing tests for an explicit MCP ingress/auth context so tool auth no longer depends on the full Express request or the proxy-based createMcpRequest bridge."
    status: pending
  - id: phase-5-green-ingress-boundary
    content: "Phase 5 (GREEN): Introduce the explicit ingress boundary, replace the request proxy path, and keep auth/resource validation behaviour unchanged."
    status: pending
  - id: phase-6-refactor-gates-review
    content: "Phase 6 (REFACTOR): Delete superseded bridge code, propagate documentation, run the full quality gate chain, and complete the required reviewer passes."
    status: pending
isProject: false
---

# MCP Runtime Boundary Simplification

**Last Updated**: 2026-03-26
**Status**: Current — Phases 0-1 complete, Phase 2 next
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

Write tests first to prove that one canonical transport-neutral SDK descriptor
surface exists and that both app registration and `tools/list` exposure derive
from it.

Target tests:

1. SDK tests around the canonical descriptor and derived projections
2. HTTP integration tests covering registration consumption
3. `apps/oak-curriculum-mcp-streamable-http/e2e-tests/tool-examples-metadata.e2e.test.ts`

The RED phase must prove all of the following:

1. generated `inputSchema.examples` survive `tools/list`
2. the app no longer needs to hand-curate fields like `name`, `description`,
   `annotations`, `_meta`, `_meta.ui.visibility`, and future `outputSchema`
3. app-rendering registration remains compatible with `registerAppTool()`, not
   a raw `registerTool()`-specific Oak projection
4. both registration and `tools/list` derive from the same canonical SDK
   descriptor, not two app-local mappings

**Baseline requirement (review finding 2026-03-26)**: Before writing any RED
tests, run existing test suites and confirm they pass (exit 0). This
establishes a known-good baseline so RED failures can be attributed to the new
tests, not pre-existing breakage.

**Acceptance criteria**:

1. Existing tests pass before any new RED tests are written (known-good
   baseline).
2. At least one SDK-level test fails because the canonical descriptor or its
   derived projections do not exist or do not yet expose the required shape.
3. At least one HTTP-level test fails because the app still hand-maps tool
   metadata.
4. The RED tests make it impossible to keep `registerTool()` as the canonical
   long-term registration target for app-rendering tools.
5. The RED tests describe behaviour, not the internal implementation shape.

**Deterministic validation**:

```bash
# Baseline: confirm existing tests pass BEFORE writing RED tests
pnpm --filter @oaknational/curriculum-sdk test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
# Expected: exit 0

# After RED tests written:
pnpm --filter @oaknational/curriculum-sdk test
# Expected during RED: non-zero because the new SDK projection tests fail

pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
# Expected during RED: non-zero because the new HTTP/E2E projection tests fail
```

## Phase 3 — GREEN: Canonicalise the SDK Descriptor Surface

Implement the canonical descriptor and its derived exposure surfaces in
`packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/` and then simplify
the HTTP app to consume it.

Required outcomes:

1. the SDK owns one canonical transport-neutral descriptor surface for MCP tools
2. any overlapping public shapes such as `UniversalToolListEntry` are collapsed
   into that descriptor or demoted to implementation detail if they cannot
   remain canonical
3. `handlers.ts` consumes derived SDK registration data while app-rendering
   tools stay on the `registerAppTool()` boundary
4. `tools-list-override.ts` either delegates to an SDK-owned protocol projection
   or disappears entirely if the helper path can replace it cleanly
5. the canonical descriptor passes through the complete currently modelled MCP
   tool surface, including future-facing fields such as `outputSchema` and
   `_meta.ui.visibility` when present
6. the app no longer hand-maps MCP tool fields

**Acceptance criteria**:

1. The only place that assembles MCP tool protocol fields is the SDK layer.
2. `inputSchema.examples` are still visible to MCP clients through `tools/list`.
3. The HTTP app does not introduce an Oak-owned `registerTool()` normalisation
   layer for app-rendering tools.
4. The app no longer contains a manual `tools.map(...)` over tool entries to
   build protocol output.
5. No new registry, compatibility layer, or host-specific projection is
   introduced.

**Deterministic validation**:

```bash
# Check for any hand-mapping of tool fields (covers variable names, spread, etc.)
rg -n "tool\.(name|description|inputSchema|annotations|_meta)" \
  apps/oak-curriculum-mcp-streamable-http/src/handlers.ts \
  apps/oak-curriculum-mcp-streamable-http/src/tools-list-override.ts
# Expected after GREEN: zero matches (all tool field assembly is in the SDK)

pnpm --filter @oaknational/curriculum-sdk test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
# Expected after GREEN: exit 0
```

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

Phase 4 RED tests must include a convergence test proving both paths reach the
same auth decision for every combination of valid/expired/missing/wrong-scope
tokens. One path must be eliminated or both must be provably equivalent.

**Baseline requirement (review finding 2026-03-26)**: Before writing any RED
tests, run existing test suites and confirm they pass (exit 0). This
establishes a known-good baseline so RED failures can be attributed to the new
tests, not pre-existing breakage.

Target tests:

1. `apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.unit.test.ts`
2. `apps/oak-curriculum-mcp-streamable-http/src/handlers.integration.test.ts`
3. new unit/integration tests around the ingress context / adapter module

Promote `ToolAuthContext` if it can become the single explicit auth contract.
If it cannot, replace it. Do not keep parallel auth-context abstractions.

**Acceptance criteria**:

1. The RED tests fail because auth still depends on the stored request or other
   ambient async-local state and the handler still owns request-shaping logic.
2. The desired end-state is specified at the boundary level — tests specify the
   auth contract behaviour (what auth context the tool receives, what happens
   for each token state), not implementation details (whether the proxy exists).
3. A convergence test proves both auth paths produce identical decisions.
4. Existing tests pass before any new RED tests are written (known-good
   baseline).

**Deterministic validation**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
# Expected during RED: non-zero because the ingress/auth boundary tests fail
```

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

## Phase 6 — REFACTOR, Documentation, Gates, Review

Delete superseded bridge code and comments, then propagate the settled outcome.

Documentation surfaces to review:

1. `docs/architecture/architectural-decisions/046-openai-connector-facades-in-streamable-http.md`
2. `docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md`
3. any impacted workspace README or auth guidance

Required reviewer set before completion:

1. `mcp-reviewer`
2. `clerk-reviewer`
3. `architecture-reviewer-barney`
4. `type-reviewer`
5. `code-reviewer`
6. `docs-adr-reviewer`

**Acceptance criteria**:

1. Superseded bridge code and stale commentary are deleted, not left behind as
   historical ballast.
2. The docs record the new ownership boundary clearly.
3. The full quality gate chain passes from repo root.
4. Reviewer findings are either implemented or explicitly rejected with written
   rationale.

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
