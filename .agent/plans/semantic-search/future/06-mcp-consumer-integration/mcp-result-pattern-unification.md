# MCP Result Pattern Unification

**Boundary**: mcp-consumer-integration
**Legacy Stream Label**: mcp-integration (post-merge)
**Status**: 📋 Scheduled — does not block merge, starts on a new branch
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)
**Created**: 2026-02-16
**Last Updated**: 2026-02-19

**Strategic Note**: Detailed execution phases are intentionally retained from
research and implementation planning. In `future/`, they are reference-level
guidance until promotion to an executable lane.

---

## Overview

Migrate the MCP tool execution layer from the custom
`ToolExecutionResult` discriminated union to the canonical
`Result<T, E>` from `@oaknational/result`. This aligns
the MCP layer with the Search SDK and Search CLI, which
already use `Result<T, E>` throughout.

**Why?** Consistent architecture minimises friction. The
MCP layer currently has three different error
representations — none of which are `Result<T, E>`. This
creates cognitive overhead and an integration boundary
that new consumers (like the semantic-search tool) must
navigate.

---

## Current State: Three Error Patterns

| Pattern | Shape | Used by |
|---------|-------|---------|
| `ToolExecutionResult` | `{ status, data } \| { error }` — no `ok` field | `executeToolCall`, STDIO server, HTTP auth interception |
| `extractExecutionData` return | `{ ok, status, data } \| { ok, error: unknown }` — Result-like, wrong shape | Aggregated tools (`search`, `fetch`) |
| Validation returns | `{ ok, value } \| { ok, message }` — uses `message` not `error` | `validateSearchArgs`, `validateFetchArgs` |

**Target**: All three converge on `Result<T, E>`:

```text
Ok<T>  = { ok: true, value: T }
Err<E> = { ok: false, error: E }
```

---

## Scope

### Files to change (~25-30 total)

**Core SDK** (`packages/sdks/oak-curriculum-sdk/src/mcp/`):

| File | Change |
|------|--------|
| `execute-tool-call.ts` | `ToolExecutionResult` → `Result<ToolExecutionSuccess, McpToolError \| McpParameterError>` |
| `universal-tool-shared.ts` | Remove `extractExecutionData`, update `formatError` consumers |
| `universal-tools/executor.ts` | Consume `Result` instead of `ToolExecutionResult` |
| `stub-tool-executor.ts` | Return `Result` from stub adapter |
| `aggregated-search/execution.ts` | Use `Result` from `executeMcpTool` directly |
| `aggregated-search/validation.ts` | Return `Result<SearchArgs, string>` |
| `aggregated-fetch.ts` | Use `Result` from `executeMcpTool` directly, validation returns `Result` |
| `public/mcp-tools.ts` | Update re-exports |

**STDIO server** (`apps/oak-curriculum-mcp-stdio/`):

| File | Change |
|------|--------|
| `src/tools/index.ts` | Consume `Result` from executor |
| `src/app/server.ts` | `execResult.ok` instead of `execResult.error` |
| `src/app/tool-response-handlers.ts` | Handle `Result` shape |
| `src/app/validation.ts` | Update validation logic |

**Streamable HTTP server** (`apps/oak-curriculum-mcp-streamable-http/`):

| File | Change |
|------|--------|
| `src/tool-handler-with-auth.ts` | `!result.ok` and `result.error` instead of `'error' in execution` |
| `src/validation-logger.ts` | Consume `Result` shape |
| `src/test-helpers/auth-error-test-helpers.ts` | Create `Result` instances in tests |

**Test files** (~10):

All tests creating or asserting `ToolExecutionResult`
instances need updating to use `ok()` / `err()` from
`@oaknational/result`.

---

## Sequencing

**Best started after**: Phase 3a completion (archived).
The semantic-search tool now exists and already uses
`Result<T, E>`, so it acts as a stable downstream consumer
to validate this unification.

**Does not block**: Milestone 0 merge gates. This is a
post-merge follow-up clean-up plan.

---

## Execution Phases (TDD)

### WS1 — Add `@oaknational/result` to Curriculum SDK

- Add dependency to `packages/sdks/oak-curriculum-sdk/package.json`
- Verify build and type-check

### WS2 — Migrate `executeToolCall` (RED → GREEN)

- Write tests asserting `executeToolCall` returns `Result`
- Change `ToolExecutionResult` type to `Result<ToolExecutionSuccess, McpToolError | McpParameterError>`
- Update `mapErrorToResult` to use `err()`
- Update success path to use `ok()`
- All existing tests updated and passing

### WS3 — Remove `extractExecutionData` (RED → GREEN)

- Remove the function
- All consumers (`executor.ts`, `aggregated-search/execution.ts`, `aggregated-fetch.ts`) use `Result` directly
- Pattern: `if (!result.ok) return formatError(result.error.message)`

### WS4 — Migrate validation functions (RED → GREEN)

- `validateSearchArgs` → `Result<SearchArgs, string>`
- `validateFetchArgs` → `Result<FetchArgs, string>`
- `validateHelpArgs` → `Result<HelpArgs, string>`
- Update all callers in `executor.ts`

### WS5 — Migrate MCP server consumers (RED → GREEN)

- STDIO: `server.ts`, `tool-response-handlers.ts`, `tools/index.ts`
- HTTP: `tool-handler-with-auth.ts`, `validation-logger.ts`
- Update all test helpers

### WS6 — Quality gates

- Full quality gate chain
- Verify semantic-search tool (if exists) still works
- Verify all existing MCP tools unaffected

---

## Success Criteria

- [ ] Zero imports of `ToolExecutionResult` remain (type deleted)
- [ ] `extractExecutionData` deleted
- [ ] All tool execution paths return `Result<T, E>`
- [ ] All validation functions return `Result<T, string>`
- [ ] `@oaknational/result` imported in MCP layer
- [ ] All tests pass without `ToolExecutionResult` instances
- [ ] All quality gates pass

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [phase-3a-mcp-search-integration.md](../../archive/completed/phase-3a-mcp-search-integration.md) | Search tool wiring (Phase 3a) |
| [../roadmap.md](../../roadmap.md) | Master roadmap |
| [@oaknational/result](../../../../../packages/core/result/) | Canonical Result type |
| [execute-tool-call.ts](../../../../../packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.ts) | Current `ToolExecutionResult` definition |
| [universal-tool-shared.ts](../../../../../packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts) | Current `extractExecutionData` |

---

## Foundation Documents

Before starting work, re-read:

1. [rules.md](../../../../directives/rules.md)
2. [testing-strategy.md](../../../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../../../directives/schema-first-execution.md)
