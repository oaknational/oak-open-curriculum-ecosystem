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
- **Few hits (widget-script + preview files only), no simplification branch** → Runtime boundary simplification plan is next (see `current/mcp-runtime-boundary-simplification.plan.md`). Start with Phase 0 (`@clerk/mcp-tools/express` evaluation)
- **Few hits (widget-script only), simplification complete** → WS3 (widget client migration) is current
- **Zero hits** → WS3 complete; WS4 (search UI) is next
- **Search UI exists** → WS4 is in progress or complete

## What To Do Next

**The immediate next work is the runtime boundary simplification plan, starting
with Phase 0.**

Read: `.agent/plans/sdk-and-mcp-enhancements/current/mcp-runtime-boundary-simplification.plan.md`

**Phase 0** is an investigation spike — evaluate whether `@clerk/mcp-tools/express`
official utilities (`mcpAuthClerk`, `streamableHttpHandler`,
`protectedResourceHandlerClerk`, `authServerMetadataHandlerClerk`) can replace
the hand-rolled MCP auth plumbing. The package is already a dependency at
`^0.3.1` but its Express utilities are unused. Principle: use off-the-shelf
wherever possible; innovate in Oak's domain, not in plumbing.

Phase 0 deliverables: spike document, ADR documenting the adopt-or-explain
decision, updated Phase 4/5 scope. Required reviewers: `clerk-reviewer`,
`mcp-reviewer`, `security-reviewer`.

**Do not skip Phase 0 and jump to Phases 1-3 (tool-surface projection).** The
Phase 0 outcome may reshape Phases 4-5 significantly.

## Work Stream Status

- **WS1** (ADR + codegen contract): **complete** (2026-03-26)
- **WS2** (app runtime migration): **complete** (2026-03-26). Child plan at `.agent/plans/sdk-and-mcp-enhancements/active/ws2-app-runtime-migration.plan.md` — reference only, not active work.
- **Runtime boundary simplification**: **next** — `.agent/plans/sdk-and-mcp-enhancements/current/mcp-runtime-boundary-simplification.plan.md`. Start with Phase 0.
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
