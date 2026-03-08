# Provider Contracts (Runtime Boundaries)

**Last Updated**: 2026-03-07  
**Status**: Active guidance  
**Scope**: Behaviour contracts between app-composed providers and MCP runtime modules

Purpose: define the minimal behaviour-level contracts that provider
implementations must satisfy, independent of any specific runtime package.

## Current Contract Surfaces

| Surface          | Behaviour contract                                                 | Current composition locations                                                                                                              |
| ---------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Clock            | `now(): number` returns current epoch milliseconds                 | `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts` (legacy stdio workspace)                                                                 |
| Logger           | accepts `trace/debug/info/warn/error/fatal` calls without throwing | `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts` (legacy stdio workspace), `apps/oak-curriculum-mcp-streamable-http/src/logging/index.ts` |
| Storage          | async `get/set/delete` semantics for request/session-scoped state  | `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts` (legacy stdio workspace)                                                                 |
| Search retrieval | satisfies SDK `SearchRetrievalService` interface                   | `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts` (legacy stdio workspace), `apps/oak-curriculum-mcp-streamable-http/src/application.ts`   |

## Where Contracts Are Bound

- Legacy stdio binds runtime dependencies in:
  [`apps/oak-curriculum-mcp-stdio/src/app/wiring.ts`](../../apps/oak-curriculum-mcp-stdio/src/app/wiring.ts)
- Streamable HTTP binds handler dependencies in:
  [`apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`](../../apps/oak-curriculum-mcp-streamable-http/src/handlers.ts)
- Runtime configuration is loaded at app entry via:
  [`runtime-config.ts`](../../apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts) and
  [`runtime-config.ts`](../../apps/oak-curriculum-mcp-stdio/src/runtime-config.ts)

The stdio binding locations remain documented because the legacy workspace still
exists, but active MCP server evolution should now happen in the HTTP workspace.
See [ADR-128](./architectural-decisions/128-stdio-workspace-retirement-and-http-transport-consolidation.md).

## Contract Rules

1. Compose dependencies in app roots only.
2. Inject dependencies through function/module boundaries.
3. Do not read environment variables from deep runtime modules.
4. Keep contract checks behaviour-focused (no provider implementation coupling).
5. Keep generated SDK execution surfaces authoritative for tool schema/runtime contracts.

## Testing Guidance

- Validate provider behaviour through integration tests at composition boundaries.
- Use simple injected fakes for logger/clock/storage/search dependencies.
- Avoid network/filesystem side effects in contract-level checks.
- Keep tests deterministic and fast.

## Relationship to Schema-First Execution

Provider contracts govern runtime dependencies (logging, time, storage, search
retrieval), while MCP tool contracts (names, args, results, validation) remain
schema-first and generated from SDK artefacts.

See:

- [Provider System](./provider-system.md)
- [OpenAPI Pipeline](./openapi-pipeline.md#execution-model-schema-first-tool-invocation)
