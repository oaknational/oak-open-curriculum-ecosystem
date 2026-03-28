---
prompt_id: session-continuation
title: "MCP App Extension Migration — Session Continuation"
type: workflow
status: active
last_updated: 2026-03-28
---

# MCP App Extension Migration — Session Continuation

## First Action: Live Spec Research

Before any implementation, deeply research the latest MCP App Extension features.

1. **Fetch the live spec and SDK docs** using WebFetch/WebSearch:
   - <https://apps.extensions.modelcontextprotocol.io/api/sitemap.xml> — START HERE
   - <https://modelcontextprotocol.io/extensions/apps/overview> — spec overview
   - <https://modelcontextprotocol.io/extensions/apps/build> — build guide
   - <https://github.com/modelcontextprotocol/ext-apps> — SDK source
2. **Compare against the plan's "Research Findings" section**
3. **Update the plan** if new features change the optimal approach
4. **Invoke `mcp-reviewer`** with findings before proceeding

## Quick Ground

1. Read `.agent/directives/AGENT.md` and `.agent/directives/principles.md`
2. Read the broad plan: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`
3. Read the active child plan for the current work stream (see below)

## Where Are We?

**Runtime boundary simplification plan: ALL PHASES COMPLETE (0-8).**

Phase 8 landed in 4 commits on `feat/mcp_app` (2026-03-28):

- `6992e656` — Core: type-safe auth boundary, file splits, security hardening
- `03bf000c` — Code-reviewer fixes: silent assertion paths, handlers.ts TSDoc
- `76dfb730` — Test-reviewer fixes: underscore params, duplicated tests
- `ea6bc42b` — Eliminate ALL eslint-disable from test helpers: narrow interfaces + node-mocks-http

**WS3 (widget client migration) is now unblocked.**

## Follow-Up Work Items (from Phase 8 reviews)

These are independent of WS3 and can be addressed in parallel or sequentially:

### High Priority

1. **Opaque token RFC 8707 bypass** — `verifyClerkToken` performs ZERO audience
   validation. Clerk's `token_introspection_endpoint` is exposed in PRM metadata
   but never called. Tokens CAN be replayed across servers sharing a Clerk app.
   Needs separate plan: make `validateResourceParameter` async, call Clerk
   introspection for opaque tokens. See ADR-142 "accepted residual risk" section.

2. **Test complexity in `tool-handler-with-auth.integration.test.ts`** —
   `createMockDependencies` re-implements the executor factory chain (30+ lines).
   Root cause: `ToolHandlerDependencies` exposes factories-of-factories. Simplify
   the DI interface so mocks are trivial fakes, not re-implementations.

### Medium Priority

3. **CallToolResult coupling** — test helpers import `CallToolResult` type from
   SDK. Replace with `unknown` + `CallToolResultSchema` Zod validation at test
   boundaries. Consistent with the `authLogContextSchema` pattern.

4. **`authLogContextSchema` in test helper** — Zod schema for log context shape
   belongs in product code adjacent to the logging call, not in test helpers.
   Move it, then test helpers import from product code.

5. **Three duplicate logger fakes** — `createFakeLogger` (fakes.ts),
   `createTestLogger` (app/test-helpers/), `createRecordingLogger` (inline in
   bootstrap-helpers.unit.test.ts). Consolidate to one.

### Low Priority

6. **`verify-clerk-token.unit.test.ts`** — conformance tests for external library
   (per ADR-142). `vi.spyOn(console, 'error')` is global state manipulation.
   Assess whether these tests justify maintenance cost.

7. **`setTimeout` in `bootstrap-helpers.unit.test.ts`** — time-dependent assertion
   with `-10ms` tolerance. Fragile in CI. Consider clock injection.

8. **SDK module path fragility** — `import type {} from bearerAuth.js` depends on
   internal SDK path. Documented with version pin in `mcp-auth.ts`. If SDK moves
   it, type-check fails immediately.

## Work Stream Status

- **WS1** (ADR + codegen contract): **complete** (2026-03-26)
- **WS2** (app runtime migration): **complete** (2026-03-26)
- **Runtime boundary simplification**: **ALL PHASES COMPLETE** (2026-03-28)
- **WS3** (widget client + branding): **next** — NOW UNBLOCKED
- **WS4** (search UI for humans): **blocked by** WS3
- **Output schemas**: `.agent/plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md`

## Key Decisions (Settled)

- **Hard cutover, no compatibility layers**
- **No type aliases** — use SDK types directly
- **React for all UI** — `@modelcontextprotocol/ext-apps/react` hooks
- **ext-apps SDK v1.3.2**
- **eslint-disable is BANNED** — eliminated all 9 from test helpers via:
  - Narrow product interfaces (ADR-078): `McpRequestServer`, `McpRequestTransport`,
    `McpHandlerRequest`, `McpHandlerResponse`
  - Off-the-shelf library: `node-mocks-http` for Express middleware tests
  - 2 targeted `as` assertions managed via eslint config override (not eslint-disable)

## Rules

- TDD at all levels — write tests FIRST
- Schema-first — types flow from OpenAPI via `pnpm sdk-codegen`
- No compatibility layers — delete the old, do not wrap it
- No `as`, `any`, `!`, `Record<string, unknown>` — validate at boundaries
- ALL reviewer findings are blocking — no exceptions
- NEVER disable any checks — EVER, for ANY reason
- Use `mcp-reviewer` before implementation decisions
- Use off-the-shelf libraries, not custom plumbing

## Key References

- **ADR-141**: `docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md`
- **ADR-142**: `docs/architecture/architectural-decisions/142-clerk-mcp-tools-adopt-or-explain.md`
- Research: `.agent/plans/sdk-and-mcp-enhancements/mcp-apps-support.research.md`
- MCP Apps spec: <https://modelcontextprotocol.io/extensions/apps/overview>

## Quality Gates

After every change:

```bash
pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm test && pnpm test:e2e && pnpm format:root && pnpm markdownlint:root
```
