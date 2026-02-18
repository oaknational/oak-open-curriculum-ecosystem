# ADR-112: Per-Request MCP Transport for Stateless Mode

## Status

Accepted

## Context

The MCP TypeScript SDK v1.26.0 `StreamableHTTPServerTransport` in stateless mode
(`sessionIdGenerator: undefined`) enforces a single-request-per-instance constraint via
an internal `_hasHandledRequest` flag. After the first request, subsequent calls to
`handleRequest()` throw:

```text
Stateless transport cannot be reused across requests.
```

Our application created one `McpServer` and one `StreamableHTTPServerTransport` at
startup and reused them for every incoming HTTP request. This caused:

- **Local development broken**: The second MCP request to the same process returned HTTP 500.
- **Vercel warm instances broken**: Warm function instances reuse the same Express app,
  so the second request to a warm instance failed.
- **Test workarounds**: E2E tests and smoke tests created fresh `createApp()` instances
  per MCP assertion, masking the bug.

Three options were evaluated:

| Option                   | Description                                    | Verdict                                                        |
| ------------------------ | ---------------------------------------------- | -------------------------------------------------------------- |
| A. Stateful mode         | Use `sessionIdGenerator` to track sessions     | Rejected: incompatible with Vercel serverless, adds complexity |
| B. Per-request transport | Create fresh McpServer + transport per request | **Accepted**                                                   |
| C. Dual mode             | Support both stateless and stateful via config | Rejected: invents optionality without a consumer               |

## Decision

Adopt Option B: **per-request McpServer and transport creation**.

A factory closure (`McpServerFactory`) captures shared dependencies at startup
(Elasticsearch client, runtime configuration, logger) and creates a fresh `McpServer` +
`StreamableHTTPServerTransport` per incoming request. This matches the MCP SDK's
canonical stateless example exactly.

### What is shared (once, at startup)

- `runtimeConfig` (environment-derived configuration)
- `searchRetrieval` (Elasticsearch client with connection pooling)
- `logger` (structured logger)
- Tool handler configuration and overrides

### What is created per request

- `McpServer` instance (~20 tool registrations)
- `StreamableHTTPServerTransport` instance
- `server.connect(transport)` call
- Cleanup via `res.on('close', ...)` calling `transport.close()` and `server.close()`

### Test simplification

With per-request transport, multi-step MCP flows (e.g. `resources/list` then
`resources/read`) work against the same app instance. This eliminates:

- `withFreshServer` workaround in smoke tests
- Multiple `createStubbedHttpApp()` calls within single test cases
- "transport is one-client" comments throughout the test suite

## Consequences

- **Positive**: Local dev, Vercel warm instances, and multi-step MCP flows all work correctly.
- **Positive**: Tests are simpler and more realistic (testing actual production behaviour).
- **Positive**: Aligns exactly with the MCP SDK's documented pattern.
- **Trade-off**: ~20 tool registrations per request. Negligible for serverless workloads.
  If profiling shows issues, tools can be registered from a shared configuration object.
- **Trade-off**: The `ready` promise now resolves immediately (no startup-time connection).
  The readiness middleware remains for future use if shared dependency setup becomes async.
