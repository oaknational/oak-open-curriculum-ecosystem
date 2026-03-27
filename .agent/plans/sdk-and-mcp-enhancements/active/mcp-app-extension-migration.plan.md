---
name: "MCP App Extension Migration"
overview: "Broad session-anchor plan for migrating Oak's MCP HTTP server from ChatGPT-specific widget coupling to the MCP Apps open standard (SEP-1865). Covers OpenAI removal, MCP App Extension implementation, branding, and a new human-facing search UI. Child plans carry implementation details for each work stream."
source_research:
  - "../mcp-apps-support.research.md"
  - "../roadmap.md"
specialist_reviewer: "mcp-reviewer"
skills:
  - "mcp-migrate-oai"
  - "mcp-create-app"
  - "mcp-add-ui"
  - "mcp-convert-web"
supersedes:
  - "replace-openai-app-with-mcp-app-infrastructure.execution.plan.md"
todos:
  - id: ws1-adr-codegen
    content: "WS1: Write reframing ADR and migrate SDK codegen contract from openai/* metadata keys to _meta.ui.resourceUri."
    status: done
  - id: ws2-runtime-migration
    content: "WS2: Migrate HTTP app runtime — MIME type, resource registration, CSP, delete ChatGPT artefacts."
    status: done
  - id: ws3-widget-client-branding
    content: "WS3: Rewrite widget client from window.openai.* to MCP Apps SDK App class. Add Oak branding on key tools."
    status: pending
  - id: ws4-search-ui
    content: "WS4: Build new MCP App search UI for human users with 5 scopes, filters, and drill-down."
    status: pending
  - id: mcp-reviewer-upgrade
    content: "Upgrade mcp-reviewer with live-spec-first doctrine and ext-apps coverage per specialist upgrade plan."
    status: pending
  - id: session-continuation-prompt
    content: "Write session continuation prompt at .agent/prompts/session-continuation.prompt.md."
    status: done
  - id: planning-docs-update
    content: "Update roadmap, milestones, and mark old execution plan as superseded."
    status: pending
---

# MCP App Extension Migration

**Status**: ACTIVE
**Last Updated**: 2026-03-26
**Scope**: Full migration from ChatGPT-specific widget coupling to MCP Apps open standard, plus new search UI.

---

## Context

Oak's MCP HTTP server (`apps/oak-curriculum-mcp-streamable-http/`) has its UI layer locked to ChatGPT. All 5 aggregated tools (search, fetch, browse-curriculum, explore-topic, get-curriculum-model) serve widgets via `window.openai.*` APIs and `text/html+skybridge` MIME — a ChatGPT-only surface. The `@modelcontextprotocol/ext-apps` package (^1.3.1) is declared in `package.json`. WS1 migrated SDK metadata keys; WS2 migrated the app runtime to use the SDK's server helpers (`registerAppResource`, `RESOURCE_MIME_TYPE`).

**Governing ADR**: [ADR-141: MCP Apps Standard as Only UI Surface](../../../../docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md)

The MCP Apps standard (SEP-1865, stable 2026-01-26) is the official, host-neutral way to serve interactive UIs from MCP tools. ChatGPT and Claude both support it. This work migrates from single-host lock-in to the open standard, adds branding, and builds a new human-facing search UI.

**This plan supersedes** the documentation-only execution plan at `replace-openai-app-with-mcp-app-infrastructure.execution.plan.md` and replaces the old Domain A–D taxonomy as the primary session anchor.

---

## Vision

Oak's MCP HTTP server becomes a first-class MCP Apps server — one codebase, one open standard, every host. All OpenAI-specific coupling is deleted, not wrapped. The server uses `@modelcontextprotocol/ext-apps/server` helpers as the sole registration surface. Oak branding flows through MCP Apps resource HTML. A new interactive search UI gives human users a rich search experience. ChatGPT and Claude consume the same tools, resources, and UI.

---

## Research Findings (2026-03-25)

### Spec Status

- SEP-1865 stable (2026-01-26). No breaking changes since publication.
- ext-apps SDK: v1.3.1 (^1.3.1 in package.json).
- Local research at `../mcp-apps-support.research.md` is fully current.

### MCP Specialist Answers (Key Technical Decisions)

1. **`registerAppTool` does NOT emit `openai/outputTemplate`** — hard cutover is correct; ChatGPT reads `_meta.ui.resourceUri` natively.
2. **`getUiCapability()`** is the correct fallback check for hosts without MCP Apps support (returns `undefined`, not `null` — use falsy checks). Text-only fallback for Claude Desktop CLI, Cursor, etc.
3. **Widget state**: in-memory or `sessionStorage` (keyed by viewUUID). No `localStorage` for auth/PII.
4. **Search UI**: widget-initiated `tools/call` for subsequent searches. `visibility: ["app"]` for private helper tools. `app.updateModelContext()` to sync selections back to model.
5. **MIME**: ChatGPT accepts `text/html;profile=mcp-app`. Safe to remove `text/html+skybridge`.
6. **CSP**: Minimal — just `resourceDomains` for Google Fonts if using MCP bridge for all data.
7. **Multiple widgets**: No limits. One resource per UI concern is the recommended pattern.
8. **Dev preview**: `basic-host` from ext-apps repo replaces `chatgpt-emulation-wrapper.ts`.

### OpenAI Coupling Inventory (at time of planning)

**SDK codegen** (metadata keys — all migrated in WS1, zero `openai/` hits
remain in `packages/sdks/`):

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/definition.ts`

**HTTP app** (widget runtime, resources, security — paths relative to
`apps/oak-curriculum-mcp-streamable-http/`):

- `src/aggregated-tool-widget.ts` — MIME constant and `window.openai` refs
- `src/register-resources.ts` — `openai/widget*` metadata keys (migrated in WS2)
- `src/widget-script.ts` — `window.openai.*` bridge calls (WS3 scope)
- `src/widget-script-state.ts` — `window.openai.widgetState` (WS3 scope)
- `src/widget-cta/` — ChatGPT-focused CTA (deleted in WS2)
- `scripts/chatgpt-emulation-wrapper.ts` — dev preview server (deleted in WS2)
- `src/widget-file-generator.ts` — `window.openai` mock injection (WS3 scope, review finding 2026-03-26)
- `src/security.ts`, `src/security-config.ts` — ChatGPT-specific comments
- `src/tools-list-override.ts` — "OpenAI Apps SDK" comment (simplification Phase 6)
- `src/auth-error-response.ts` — "ChatGPT OAuth" TSDoc (WS2 Task 4 / simplification Phase 6)
- `packages/sdks/oak-sdk-codegen/src/types/generated/widget-constants.ts` — ChatGPT cache-busting comments

### Domain A/B Assessment

- **Domain A (research)**: COMPLETE and current. MIME validation gap closed by MCP specialist confirmation.
- **Domain B (specialist alignment)**: COMPLETE. Skills and reviewer are in place. The "reframing ADR" blocker is a formality — the decision is made.

### The "Reframing ADR"

The decision: *"Oak builds one MCP server with MCP Apps widgets. ChatGPT is one host. No separate OpenAI App. No dual paths."* This is already reflected throughout the roadmap. The ADR formalises it. Written as part of WS1.

---

## Work Streams

### WS1: ADR + Codegen Contract Migration

**Scope**: Write the reframing ADR. Migrate SDK codegen emitter and tool descriptor contracts from `openai/*` metadata keys to `_meta.ui.resourceUri`.

**Files**:

- `docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md` (written in WS1)
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts` — `_meta` block
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts` — `_meta` block
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts` — `_meta` block
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts` — `_meta` block
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/definition.ts` — `_meta` block
- `packages/sdks/oak-sdk-codegen/src/types/generated/widget-constants.ts`

**Change**: Replaced `_meta: { 'openai/outputTemplate': WIDGET_URI, ... }` with `_meta: { ui: { resourceUri: WIDGET_URI } }` across all 5 aggregated tool definitions. Dropped `openai/toolInvocation/*` because MCP Apps does not yet implement equivalents. Translated `openai/widgetAccessible` / `openai/visibility` only when app-vs-model exposure semantics are required, using `_meta.ui.visibility`; for WS1 aggregated tools, no such split was needed.

**Acceptance**:

- `rg "openai/" packages/sdks/` returns zero hits
- `pnpm sdk-codegen && pnpm build && pnpm type-check` passes
- ADR written and cross-referenced

**Dependencies**: None. First stream.

---

### WS2: App Runtime Migration (MIME, Resources, Deletions)

**Child plan**: [ws2-app-runtime-migration.plan.md](ws2-app-runtime-migration.plan.md) — detailed implementation plan with 7 distinct specialists across 10 review runs in 2 rounds (2026-03-26).

**Scope**: Migrate HTTP app resource registration, MIME type, CSP. Delete all ChatGPT-only artefacts.

**Files**:

- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` — rewrite to use `registerAppResource`, `RESOURCE_MIME_TYPE`, `_meta.ui.csp` (camelCase)
- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` — replace `AGGREGATED_TOOL_WIDGET_MIME_TYPE` with `RESOURCE_MIME_TYPE`
- `apps/oak-curriculum-mcp-streamable-http/src/security.ts` — update ChatGPT-specific comments
- `apps/oak-curriculum-mcp-streamable-http/src/security-config.ts` — update comments
- DELETE: `scripts/chatgpt-emulation-wrapper.ts`
- DELETE: `src/widget-cta/` directory (vestigial)

**CSP migration**:

```text
BEFORE: openai/widgetCSP → { connect_domains, resource_domains } (snake_case)
AFTER:  _meta.ui.csp → { connectDomains, resourceDomains } (camelCase)
```

`connectDomains` can be dropped if all data flows through MCP bridge. `resourceDomains` keeps Google Fonts only.

**Acceptance**:

- Zero `text/html+skybridge` in runtime code
- Zero `openai/widget*` keys in resource registration
- `widget-cta/` directory does not exist
- `chatgpt-emulation-wrapper.ts` does not exist
- All e2e tests pass with MCP-standard assertions

**Dependencies**: WS1 (metadata keys must be MCP-standard before resource registration changes).

**Queued follow-up after WS2**:
[../current/mcp-runtime-boundary-simplification.plan.md](../current/mcp-runtime-boundary-simplification.plan.md)
captures the two runtime seams intentionally left behind by WS2: app-owned tool
projection and the Express/Clerk ingress bridge. It establishes one canonical
transport-neutral SDK descriptor surface, keeps app-rendering registration on
the `registerAppTool()` helper boundary, and replaces ambient request state with
one explicit auth boundary. Default sequencing: run it immediately after WS2 and
complete it before promoting WS3. Any deferral must be recorded explicitly
before WS3 implementation begins.

**Simplification plan progress (2026-03-27)**:

- **Phase 0** (complete): `@clerk/mcp-tools/express` utilities evaluated. All
  five Express utilities SKIP'd per ADR-142. Only `verifyClerkToken` adopted.
- **Phase 1** (complete): Seam inventory mapped, 3 specialist reviewers passed.
  Key decisions: `tool-auth-context.ts` is dead code (delete in Phase 6);
  `tools/list` override stays (MCP SDK cannot preserve examples); canonical
  ingress is `getAuth()` once → `verifyClerkToken()` → forward `AuthInfo`.
- **Phase 2** (complete): RED tests for canonical SDK descriptor surface.
  `toRegistrationConfig` and `toProtocolEntry` asserted but non-existent.
  type-check, lint, and test all RED. All 1,372 existing tests green.
- **Phase 3** (complete, 2026-03-27): GREEN — `projections.ts` created with
  `toRegistrationConfig` + `toProtocolEntry`. App simplified to single SDK
  calls. 706 SDK + 676 HTTP + 165 E2E tests pass. MCP-reviewer COMPLIANT.
- **Phase 4** (complete, 2026-03-27): RED — 6 DI-based unit tests, `AuthInfo`
  from MCP SDK adopted as explicit auth contract, convergence test superseded
  (dead code). Code-reviewer APPROVED, type-reviewer findings addressed.
- **Phase 5** (next): GREEN — implement explicit ingress boundary.

---

### WS3: Widget Client-Side Migration + Branding

**Scope**: Rewrite widget JavaScript from `window.openai.*` to MCP Apps SDK `App` class. Add Oak branding on key entry-point tools.

**Files**:

- `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts` — complete rewrite: `App` class, `connect()`, `PostMessageTransport`, `app.on('tool-result')`
- `apps/oak-curriculum-mcp-streamable-http/src/widget-script-state.ts` — replace `window.openai.widgetState`/`setWidgetState` with in-memory state
- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` — update HTML shell to load MCP Apps client SDK, async `connect()` lifecycle
- `apps/oak-curriculum-mcp-streamable-http/src/widget-file-generator.ts` — rewrite `generatePreviewWidgetFile()` to inject MCP Apps bridge instead of `window.openai` mock (review finding 2026-03-26)
- `apps/oak-curriculum-mcp-streamable-http/scripts/widget-preview-server.ts` — update to use MCP Apps preview host instead of ChatGPT emulation (review finding 2026-03-26)
- `apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.ts` — update comment referencing `window.openai.toolOutput` (review finding 2026-03-26)

**Key design decisions** (settled):

1. **React with ext-apps/react hooks** — use `useApp`, `useHostStyles`, `useHostFonts`, `useDocumentTheme` from `@modelcontextprotocol/ext-apps/react`. Keep it basic. Bundle with Vite.
2. **Async lifecycle**: Show Oak-branded loading state until `useApp` reports `isConnected` and tool result arrives via `app.ontoolresult`.
3. **Branding**: Oak logo, Lexend font, brand colours already exist in `widget-styles.ts` and `oak-logo-svg.ts` — carry forward into React components.

**Acceptance**:

- Zero `window.openai` references in `apps/oak-curriculum-mcp-streamable-http/src/`
- Widget renders correctly via MCP Apps bridge
- Oak branding visible on search, browse, fetch, explore, get-curriculum-model tools
- External links work via `ui/open-link` pattern

**Dependencies**: WS1 + WS2 (correct metadata and MIME must be in place).

**Child plan**: To be created before implementation begins, following the WS2
pattern.

**WS3 TDD obligation (from WS2 Task 3c)**: WS3 implementation MUST begin by
rewriting the `window.openai` e2e test in `e2e-tests/widget-resource.e2e.test.ts`
to specify the new MCP Apps `App` class behaviour FIRST (RED), then implement
(GREEN). Per testing-strategy.md: "When changing system behaviour, update E2E
tests FIRST."

---

### WS4: MCP App Search UI for Humans

**Scope**: Build a new, separate MCP App widget for interactive human-facing search across all 5 scopes.

**Design**:

- **Separate tool** (`search-ui` or similar) with `_meta.ui.resourceUri` pointing to a dedicated resource. The existing `search` tool remains agent-facing.
- **Separate resource** (`ui://search/app.html`) — NOT a branch in the aggregated widget. Per MCP specialist: one resource per distinct UI concern.
- **Private helper tools** with `visibility: ["app"]` for scope-specific searches called by the widget, if needed.
- **Data flow**: All via MCP bridge (`app.callServerTool`). No direct API calls. Minimal CSP.
- **Features**: search input, scope selector (lessons/units/threads/sequences/suggest), filter controls (subject, key stage, year, tier, exam board), results with drill-down via `tools/call`, Oak branding.
- **Model context sync**: `app.updateModelContext()` when user selects items, so the model knows what the human found. **Important**: each call overwrites prior context (replace semantics, not append). The widget must maintain cumulative state and send the full current selection on each call. Only the last update before the next user message is sent to the model.

**Key design decisions** (settled or partially settled):

1. **React with ext-apps/react hooks** — decided. Use `useApp`, `useHostStyles`, `useHostFonts`, `useDocumentTheme`. Keep it basic. Bundle with Vite.
2. **Renderer reuse**: Existing `widget-renderers/` may be adapted as React components for result display.
3. **Suggest scope**: Live typeahead via debounced `tools/call` or simpler scope-based filtering — to resolve during child plan.

**Acceptance**:

- Search UI renders in ChatGPT and Claude
- All 5 scopes searchable with subject + key stage filters minimum
- Drill-down from result to detail works via MCP bridge
- Oak branding present (logo, font, colours)
- No direct API calls from iframe
- Keyboard navigable, WCAG 2.2 AA contrast

**Dependencies**: WS3 (MCP Apps bridge must be working).

**Child plan**: To be created before implementation begins, following the WS2
pattern.

---

## Ordering and Parallelism

```text
WS1: ADR + Codegen Contract ──────────────────────┐  ✓ done
                                                    ▼
WS2: App Runtime Migration ────────────────────────┐  ✓ done
                                                    ▼
Runtime Boundary Simplification ───────────────────┐  ← active
  Phase 0: evaluate @clerk/mcp-tools/express       │  ✓ done
  Phase 1: foundation + seam audit                 │  ✓ done
  Phase 2: RED — SDK descriptor tests              │  ✓ done
  Phase 3: GREEN — canonicalise SDK surface        │  ✓ done
  Phase 4: RED — ingress auth tests                 │  ✓ done
  Phase 5: GREEN — explicit ingress boundary        │  ← next
  Phase 6: cleanup + review                        │
                                                    ▼
WS3: Widget Client + Branding ─────────────────────┐
  (design spike can begin during simplification)   │
                                                    ▼
WS4: Search UI for Humans
  (design/prototype can begin during WS3)
```

---

## Validation

**Global coupling regression** (run after every stream):

```bash
rg -n "openai/outputTemplate|openai/toolInvocation|openai/widgetAccessible|openai/visibility|text/html\+skybridge|window\.openai|openai/widget" \
  packages/sdks/ apps/oak-curriculum-mcp-streamable-http/src/
```

Expected: decreasing hit count per stream, zero after WS3.

**Quality gates per stream**:

```bash
pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm test && pnpm test:e2e && pnpm format:root && pnpm markdownlint:root
```

---

## Preparatory Work (This Session)

Before implementation begins, this planning session delivers:

1. **This plan** — broad session anchor
2. **Reframing ADR draft** — captures the MCP-standard-primary decision
3. **mcp-reviewer upgrade** — add live-spec-first doctrine, ext-apps coverage
4. **Session continuation prompt** at `.agent/prompts/session-continuation.prompt.md`
5. **Updated planning docs** — roadmap, milestones, old execution plan marked superseded

---

## Session Continuation

When picking up this work in a new session:

1. Read this plan
2. Read `.agent/prompts/session-continuation.prompt.md`
3. Run the coupling regression check to see current state
4. Check which WS is active and read its child plan
5. Re-ground: `AGENT.md`, `principles.md`, `testing-strategy.md`, `schema-first-execution.md`
6. Use `mcp-reviewer` before implementation decisions
7. Use skill chain: `mcp-migrate-oai` (WS1-3), `mcp-create-app` + `mcp-add-ui` (WS4)

---

## Specialist Reviewer

`mcp-reviewer` is the specialist of record. Invoke for:

- MCP Apps standards review
- Resource metadata and CSP review
- Capability negotiation patterns
- Widget data flow and lifecycle review

---

## Key References

- [../mcp-apps-support.research.md](../mcp-apps-support.research.md) — research
- [../roadmap.md](../roadmap.md) — strategic context
- [mcp-migrate-oai skill](../../../.agent/skills/mcp-migrate-oai/SKILL.md) — migration skill
- [mcp-create-app skill](../../../.agent/skills/mcp-create-app/SKILL.md) — new app creation skill
- [mcp-add-ui skill](../../../.agent/skills/mcp-add-ui/SKILL.md) — add UI to existing tool skill
- [mcp-reviewer template](../../../.agent/sub-agents/templates/mcp-reviewer.md) — specialist reviewer
- [ADR-141: MCP Apps Standard as Only UI Surface](../../../../docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md) — governing ADR
- SEP-1865 stable spec: <https://modelcontextprotocol.io/extensions/apps/overview>
- ext-apps SDK: <https://github.com/modelcontextprotocol/ext-apps>
- MCP Apps Patterns: <https://apps.extensions.modelcontextprotocol.io/api/documents/Patterns.html>
- ext-apps React hooks: <https://apps.extensions.modelcontextprotocol.io/api/modules/_modelcontextprotocol_ext-apps_react.html>

---

## Related Documents

- [replace-openai-app-with-mcp-app-infrastructure.execution.plan.md](../archive/completed/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md) — superseded predecessor
- [../roadmap.md](../roadmap.md) — strategic context (Domains A–D)
- [../README.md](../README.md) — collection index
- [README.md](README.md) — active plans index
