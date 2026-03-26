---
prompt_id: session-continuation
title: "MCP App Extension Migration — Session Continuation"
type: workflow
status: active
last_updated: 2026-03-26
---

# MCP App Extension Migration — Session Continuation

Use this prompt to pick up work on the MCP App Extension migration across sessions.

## First Action: Live Spec Research

Before any implementation, deeply research the latest MCP App Extension features. Do not rely on cached knowledge or the local research document alone — the spec and SDK evolve.

1. **Fetch the live spec and SDK docs** using WebFetch/WebSearch:
   - <https://apps.extensions.modelcontextprotocol.io/api/sitemap.xml> — **START HERE**: complete sitemap of all 147 API doc pages. Use this to find exact URLs instead of guessing.
   - <https://modelcontextprotocol.io/extensions/apps/overview> — spec overview
   - <https://modelcontextprotocol.io/extensions/apps/build> — build guide
   - <https://apps.extensions.modelcontextprotocol.io/api/> — API docs index
   - <https://apps.extensions.modelcontextprotocol.io/api/documents/migrate-openai-app.html> — official migration guide (OpenAI → MCP Apps field mappings)
   - <https://apps.extensions.modelcontextprotocol.io/api/documents/csp-and-cors.html> — CSP and CORS patterns
   - <https://apps.extensions.modelcontextprotocol.io/api/documents/patterns.html> — patterns
   - <https://apps.extensions.modelcontextprotocol.io/api/modules/server-helpers.html> — server module (registerAppTool, registerAppResource, RESOURCE_MIME_TYPE)
   - <https://github.com/modelcontextprotocol/ext-apps> — SDK source, examples, changelog
2. **Compare against the plan's "Research Findings" section** — flag any new features, API changes, deprecations, or patterns since 2026-03-25.
3. **Update the plan** if new features change the optimal approach. The goal is the most canonical, idiomatic MCP Apps implementation — not just one that works.
4. **Invoke `mcp-reviewer`** with findings before proceeding to implementation.

Only after this research step is complete should you proceed to implementation work. Then read and execute the active child plan (see "Work Stream Status" below).

## Quick Ground

1. Read `.agent/directives/AGENT.md` and `.agent/directives/principles.md`
2. Read the broad plan: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`
3. Read the active child plan for the current work stream (see "Work Stream Status" below)

## Where Are We?

Run the coupling regression check to see current state:

```bash
rg -n "openai/outputTemplate|openai/toolInvocation|openai/widgetAccessible|openai/visibility|text/html\+skybridge|window\.openai|openai/widget" \
  packages/sdks/ apps/oak-curriculum-mcp-streamable-http/src/
```

- **Many hits in apps/ only** → WS2 (runtime migration) is current (WS1 complete as of 2026-03-26)
- **Few hits (widget-script + preview files only)** → Runtime boundary simplification plan is active. Check the plan's `todos` frontmatter for the current phase: `current/mcp-runtime-boundary-simplification.plan.md`. Note: `packages/sdks/` hits in `universal-tool-shared.ts` are expected (MCP Apps `structuredContent` format) and do not indicate WS1 incompleteness.
- **Few hits (widget-script only), simplification plan all phases done** → WS3 (widget client migration) is current
- **Zero hits** → WS3 complete; WS4 (search UI) is next
- **Search UI exists** → WS4 is in progress or complete

## What To Do Next

**The immediate next work is the runtime boundary simplification plan, starting
with Phase 3 (GREEN).** Skip live spec research for simplification plan phases —
Phase 3 is pure SDK + app simplification work.

Read: `.agent/plans/sdk-and-mcp-enhancements/current/mcp-runtime-boundary-simplification.plan.md`

**Phases 0-2** are **complete** (2026-03-26).

- Phase 0: `verifyClerkToken` adopted from `@clerk/mcp-tools/server` (ADR-142).
  All five Express utilities SKIP'd.
- Phase 1: Seam inventory mapped, 3 reviewers passed (`mcp-reviewer`,
  `architecture-reviewer-barney`, `clerk-reviewer`). Key decisions:
  - `tool-auth-context.ts` is dead code — **delete** in Phase 6 (not promote)
  - `tools/list` override cannot be eliminated by MCP SDK upgrade — Phase 3
    must build SDK-owned protocol projection function
  - Canonical ingress: `getAuth()` once → `verifyClerkToken()` → forward
    `AuthInfo` as typed context
  - Auth orchestration in `check-mcp-client-auth.ts` may be too thick for app
    layer — consider extracting to shared library
- Phase 2: RED tests written and verified. Two projection functions
  (`toRegistrationConfig`, `toProtocolEntry`) are asserted but do not exist.
  `pnpm type-check` fails on missing imports; `pnpm test` fails on missing
  behaviour. All 1,372 existing tests remain green.

### Phase 3 (GREEN) — What to Do

Implement the canonical descriptor projections in the SDK and simplify the HTTP
app to consume them. Make all Phase 2 RED tests pass.

**Invoke `mcp-reviewer` before implementation decisions.**

**MCP-reviewer findings from Phase 2 (incorporate during GREEN)**:

- `toProtocolEntry` should include top-level `title` (MCP spec 2025-11-25
  distinguishes `title` from `annotations.title`)
- Assert `outputSchema` absence explicitly (`undefined` for current tools) so
  the contract is visible when it's eventually added
- Non-widget `_meta` assertion should test `_meta.ui` undefined, not `_meta`
  entirely (allows future non-UI `_meta` uses)
- `toRegistrationConfig` should own the `title` derivation
  (`tool.annotations?.title ?? tool.name`) — currently hand-assembled in
  `handlers.ts:103`

**Architecture-reviewer-fred findings from Phase 2 (incorporate during GREEN)**:

- Replace `vi.spyOn(server, 'registerTool')` with a fake server capturing
  calls in a plain array (ADR-078 simple-fakes)
- Consider injecting a controlled registry into the integration test instead
  of using real `generatedToolRegistry` for assertions
- Phase 3 must fully delete the config hand-assembly in `handlers.ts:102-108`
  — no partial adoption

**SDK work** — create `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/projections.ts`:

1. `toRegistrationConfig(tool: UniversalToolListEntry)` — produces a config
   object that `registerAppTool()` (widget tools) or `registerTool()`
   (non-widget tools) can consume directly. Must include:
   - `title`, `description`, `inputSchema` (Zod shape via `flatZodSchema` or
     JSON Schema fallback), `annotations`, `securitySchemes`
   - `_meta.ui.resourceUri` for widget tools (from `tool._meta`)
   - No `_meta` for non-widget tools (e.g. `download-asset`)

2. `toProtocolEntry(tool: UniversalToolListEntry)` — produces a `tools/list`
   protocol entry using JSON Schema `inputSchema` (preserving examples). Must
   include: `name`, `description`, `inputSchema`, `annotations`, `_meta` (when
   present).

3. Export both from `public/mcp-tools.ts` barrel.

**App work** — simplify `handlers.ts` and `tools-list-override.ts`:

1. `handlers.ts:registerHandlers()` — replace hand-assembled config with
   `toRegistrationConfig(tool)`. Use `registerAppTool()` for widget tools,
   `registerTool()` for non-widget tools.
2. `tools-list-override.ts:overrideToolsListHandler()` — replace `tools.map()`
   hand-mapping with `toProtocolEntry(tool)`.
3. Both files should have zero `tool.(name|description|inputSchema|annotations|_meta)`
   field access after GREEN.

**Critical files**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/canonical-descriptor.unit.test.ts` — RED tests to make green
- `apps/oak-curriculum-mcp-streamable-http/src/handlers.integration.test.ts` — RED tests to make green
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts` — current SDK surface
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts` — `UniversalToolListEntry`
- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` — registration loop
- `apps/oak-curriculum-mcp-streamable-http/src/tools-list-override.ts` — protocol projection

**Deterministic validation** (from plan Phase 3):

```bash
# Check for hand-mapping of tool fields (should be zero after GREEN)
rg -n "tool\.(name|description|inputSchema|annotations|_meta)" \
  apps/oak-curriculum-mcp-streamable-http/src/handlers.ts \
  apps/oak-curriculum-mcp-streamable-http/src/tools-list-override.ts
# Expected: zero matches

pnpm type-check   # Must pass (no more missing imports)
pnpm --filter @oaknational/curriculum-sdk test          # Must pass
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test  # Must pass
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e  # Must pass
```

## Work Stream Status

- **WS1** (ADR + codegen contract): **complete** (2026-03-26)
- **WS2** (app runtime migration): **complete** (2026-03-26). Child plan at `.agent/plans/sdk-and-mcp-enhancements/active/ws2-app-runtime-migration.plan.md` — reference only, not active work.
- **Runtime boundary simplification**: **active** — `.agent/plans/sdk-and-mcp-enhancements/current/mcp-runtime-boundary-simplification.plan.md`. Phases 0-2 complete, Phase 3 (GREEN) next.
- **WS3** (widget client + branding): **blocked by** simplification plan completion
- **WS4** (search UI for humans): **blocked by** WS3
- **Output schemas**: `.agent/plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md` — Phases 0-2 can run independently, Phase 3 depends on simplification plan Phase 3

Child plans for WS3 and WS4 will be created when those streams become active.

## Key Decisions (Settled)

- **Hard cutover, no compatibility layers** — every change actively removes old coupling and replaces with MCP Apps standard. No dual-emit, no deprecated flat keys, no backward-compatible shims, no fallback wrappers. Principles: "NEVER create compatibility layers."
- **No type aliases** — use SDK types directly, no local aliases. Principles: "Don't use type aliases, use good naming."
- **React for all UI** — use `@modelcontextprotocol/ext-apps/react` hooks (`useApp`, `useHostStyles`, `useHostFonts`, `useDocumentTheme`). No plain HTML/JS/CSS. Keep it basic.
- **ext-apps SDK v1.3.1** — `^1.3.1` in package.json. No breaking changes since 2026-01-26.
- **WS1 complete** (2026-03-26) — zero `openai/` in `packages/sdks/`. ADR-141 governs.
- **WS2 complete** (2026-03-26) — child plan at `.agent/plans/sdk-and-mcp-enhancements/active/ws2-app-runtime-migration.plan.md`. 10 specialist reviews completed across two rounds. All findings incorporated. Production code confirmed matching target state by 12-pass review (2026-03-26).

### WS2 Key Findings (from 10 specialist reviews)

- **No `getUiCapability()` in WS2** — wrong lifecycle layer (`registerHandlers()` runs before `connect()`). Non-capable hosts ignore `_meta.ui` per spec. Defer to WS3 if active gating needed.
- **Drop `domain` entirely** — no direct cross-origin fetch from widget.
- **Delete `getToolWidgetUri()` passthrough** — import `WIDGET_URI` directly from SDK.
- **Delete `ResourceRegistrar` type alias** — use `Pick<McpServer, 'registerResource'>` directly.
- **Plain-object fakes in tests** — no `vi.fn()`, handler call signature `handler(new URL(uri), {})`.
- **Broader coupling grep** — `rg -i "openai|chatgpt|skybridge"` across app src.

## Rules

- TDD at all levels — write tests FIRST
- Schema-first — types flow from OpenAPI via `pnpm sdk-codegen`
- No compatibility layers — delete the old, do not wrap it
- No `as`, `any`, `!`, `Record<string, unknown>` — validate to exact shapes at boundaries
- All reviewer findings are blocking
- Use `mcp-reviewer` before implementation decisions

## Specialist and Skills

- **Reviewer**: `mcp-reviewer` (invoke for MCP Apps standards, CSP, capability negotiation, widget lifecycle)
- **Skills**: `mcp-migrate-oai` (WS1–WS3), `mcp-create-app` + `mcp-add-ui` (WS4)

## Key References

- **ADR-141**: `docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md` — the governing architectural decision
- Research: `.agent/plans/sdk-and-mcp-enhancements/mcp-apps-support.research.md`
- Roadmap: `.agent/plans/sdk-and-mcp-enhancements/roadmap.md`
- MCP Apps spec: <https://modelcontextprotocol.io/extensions/apps/overview>
- ext-apps SDK: <https://github.com/modelcontextprotocol/ext-apps>
- MCP Apps Patterns: <https://apps.extensions.modelcontextprotocol.io/api/documents/Patterns.html>
- ext-apps React hooks: <https://apps.extensions.modelcontextprotocol.io/api/modules/_modelcontextprotocol_ext-apps_react.html>

## Quality Gates

After every change:

```bash
pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm test && pnpm test:e2e && pnpm format:root && pnpm markdownlint:root
```
