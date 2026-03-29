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

### COMPLETED (2026-03-28 session)

Items 1-5 all resolved:

- **Item 1 (Opaque token RFC 8707)**: CLOSED — NO CHANGE NEEDED. Spike
  confirmed the app uses Clerk opaque tokens (`oat_...`) as the production
  path. Clerk verifies these server-side via `getAuth()`. The "bypass" in
  `resource-parameter-validator.ts:163` is the designed behaviour, not a bug.
  JWT audience validation is defence-in-depth for non-Clerk tokens only.
  Switching to JWT would introduce risk (issuer mismatch per ADR-115) for
  no security benefit. See spike findings in session plan.
- **Item 2 (DI simplification)**: `ToolHandlerDependencies` reduced from 5 to 2
  members. New `tool-executor-factory.ts` composes SDK functions.
  `searchRetrieval` closed over at build time (not on the DI interface).
  Test mock creation: 31 → 5 lines. Circular dependency broken via
  `tool-handler-types.ts`. E2E test boundary fixed (no internal imports).
- **Item 3 (CallToolResult)**: Removed `as CallToolResult` assertion (replaced
  with `as const` on literal). Product code imports are architecturally correct.
- **Item 4 (authLogContextSchema)**: Moved to `src/auth-log-context.ts` product
  code. Test helpers import from there.
- **Item 5 (logger fakes)**: Consolidated 6 implementations → 2 canonical fakes
  in `src/test-helpers/fakes.ts`. Removed all `as Logger` assertions.

### Low Priority — RESOLVED (2026-03-28)

- **Item 6**: Deleted the `console.error` spy test — tested library side effects
  via global spy (both prohibited). 8 conformance tests remain, covering the full
  `verifyClerkToken` contract.
- **Item 7**: Deleted the timing-dependent test — required `vi.useFakeTimers()`
  (global state). Root cause: `createPhasedTimer` has no injectable clock. 5
  tests remain, covering all other bootstrap phase behaviour.
- **Item 8**: Replaced fragile `import type {} from '.../bearerAuth.js'` with a
  local `declare module 'express-serve-static-core'` augmentation. Imports
  `AuthInfo` from the SDK's types module (pure-type leaf, less fragile).

### OPEN — CI lint/local lint parity

CI lint fails on `feat/mcp_app` (PR #70) but lint passes locally. Root
cause is environmental — likely turbo cache parity or ESLint config
resolution differences between CI and local. The errors CI reports
(`no-unsafe-assignment`, `no-unresolved`) are not reproducible locally.
Previous CI runs passed because turbo replayed cached lint success from
older commits.

This is an infrastructure problem, not a code problem. The next session
should investigate the CI workflow's lint step and turbo cache behaviour
to establish parity between local and CI lint results.

## Work Stream Status

- **WS1** (ADR + codegen contract): **complete** (2026-03-26)
- **WS2** (app runtime migration): **complete** (2026-03-26)
- **Runtime boundary simplification**: **ALL PHASES COMPLETE** (2026-03-28)
- **WS3** (widget client + branding): **next** — NOW UNBLOCKED. Note: widget Playwright tests + renderer integration tests deleted (2026-03-29) as part of CI remediation. New tests to be written TDD against replacement widget.
- **WS4** (search UI for humans): **blocked by** WS3
- **Output schemas**: `.agent/plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md`

## Parallel Active Work — CI and eslint-disable Remediation

Active plan: `.agent/plans/architecture-and-infrastructure/active/ci-consolidation-and-gate-parity.plan.md`

Phases 0-2 complete (2026-03-29). Next: Phase 3 (remediate ~101 eslint-disable comments), then Phases 4-6 (CI reporter, consolidation, documentation). The `@oaknational/no-eslint-disable` ESLint rule is live in the recommended config — it will report all unapproved eslint-disable comments as errors.

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
