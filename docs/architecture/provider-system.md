# Provider System Overview

**Last Updated**: 2026-03-07  
**Status**: Active guidance  
**Scope**: Runtime provider composition for MCP applications

This document describes the current provider architecture after removal of the
old shared provider package. Providers are composed per app, in each app's
composition root, then injected into tool/runtime modules.

## Composition Roots (Current)

- Legacy stdio server composition root:
  [`apps/oak-curriculum-mcp-stdio/src/app/wiring.ts`](../../apps/oak-curriculum-mcp-stdio/src/app/wiring.ts)
- Legacy stdio runtime configuration loader:
  [`apps/oak-curriculum-mcp-stdio/src/runtime-config.ts`](../../apps/oak-curriculum-mcp-stdio/src/runtime-config.ts)
- Streamable HTTP composition root:
  [`apps/oak-curriculum-mcp-streamable-http/src/application.ts`](../../apps/oak-curriculum-mcp-streamable-http/src/application.ts)
- Streamable HTTP runtime configuration loader:
  [`apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`](../../apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts)

The stdio composition roots remain documented because the legacy workspace still
exists, but active Oak MCP server evolution should now happen in the HTTP
workspace. Future stdio support should be reintroduced there as an additional
entry point rather than through continued parallel workspace maintenance. See
[ADR-128](./architectural-decisions/128-stdio-workspace-retirement-and-http-transport-consolidation.md).

## Provider Model

### App-local composition

Each app composes its own runtime dependencies, including:

- logger
- clock
- storage
- API client
- search retrieval service

No shared provider implementation package is used. This keeps runtime assembly
close to transport concerns while preserving strict dependency injection.

### Injection boundaries

1. Runtime config is loaded once at entry/composition boundary.
2. Providers are constructed in composition roots.
3. Tool modules and handlers receive dependencies via parameters.
4. Runtime modules do not discover providers dynamically at call-time.

## Runtime Separation

- **Transport/runtime layer**: server startup, route/middleware wiring, request
  lifecycle.
- **Tool execution layer**: generated MCP tool registry + executor wiring from
  SDK surfaces.
- **Provider layer**: app-composed logger/clock/storage/search dependencies.

This separation keeps transport logic independent from provider implementation
details while preserving schema-first execution through generated SDK tooling.

## Design Rules

- Compose providers in app roots, not shared global singletons.
- Read environment once, then pass typed config through the call stack.
- Keep Core and generated SDK contracts provider-agnostic.
- Prefer behaviour-level interfaces and injected fakes in tests.

## Related Documentation

- [Provider Contracts](./provider-contracts.md)
- [OpenAPI Pipeline](./openapi-pipeline.md)
- [Programmatic Tool Generation](./programmatic-tool-generation.md)
