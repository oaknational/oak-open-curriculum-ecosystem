---
name: "Streamable HTTP Transport — Stateless Mode Bug Investigation"
overview: >
  The oak-curriculum-mcp-streamable-http server creates ONE StreamableHTTPServerTransport
  in stateless mode at startup and reuses it for every request. The MCP TypeScript SDK
  (v1.26.0) explicitly forbids this: stateless transports throw after the first request.
  This means no real MCP client (Cursor, Claude Desktop, etc.) can complete a session
  against our local dev server, and warm Vercel instances may silently fail.
  This plan investigates the bug, documents the correct patterns from the SDK, and
  proposes the architectural fix.
todos:
  - id: investigate-production
    content: "Verify whether the bug manifests on deployed Vercel instances (warm function reuse)."
    status: pending
  - id: investigate-local
    content: "Confirm that a real MCP client (Cursor, MCP Inspector) fails on the second request to local dev server."
    status: pending
  - id: choose-architecture
    content: "Decide between stateful mode (single long-lived server) vs per-request transport (serverless) — or both, selected by config."
    status: pending
  - id: implement-fix
    content: "Implement the chosen architecture with TDD (E2E test first, then implementation)."
    status: pending
  - id: verify-smoke
    content: "Verify smoke:dev:stub still passes after the fix, and revert withFreshServer workaround if no longer needed."
    status: pending
  - id: verify-e2e
    content: "Verify E2E tests pass. Update any tests that relied on single-request-per-app assumption."
    status: pending
  - id: verify-remote
    content: "Deploy to Vercel preview and run smoke:remote to verify production behaviour."
    status: pending
isProject: false
---

# Streamable HTTP Transport — Stateless Mode Bug Investigation

## The Bug

The application creates **one** `StreamableHTTPServerTransport` instance in stateless
mode (`sessionIdGenerator: undefined`) at startup and reuses it for **all** incoming
requests:

```typescript
// src/application.ts line 247
const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
```

The MCP TypeScript SDK (v1.26.0) explicitly forbids reusing a stateless transport:

```javascript
// node_modules/@modelcontextprotocol/sdk/.../webStandardStreamableHttp.js line 137-141
if (!this.sessionIdGenerator && this._hasHandledRequest) {
    throw new Error('Stateless transport cannot be reused across requests. Create a new transport per request.');
}
this._hasHandledRequest = true;
```

**Result:** The first MCP request to the server succeeds. Every subsequent MCP request
throws, and the Express error handler returns HTTP 500.

## Impact

| Environment | Impact | Severity |
|---|---|---|
| **Local dev** (`node src/index.ts`) | No real MCP client can complete a session (initialize → tools/list → tool call). Second request fails. | **Critical** |
| **Vercel (cold start)** | Works — each cold start creates a fresh app + transport. | None |
| **Vercel (warm instance)** | Second request to same warm function fails. Depends on Vercel's warm reuse behaviour. | **Unknown — needs investigation** |
| **E2E tests** | Never exposed — each test creates a fresh `createApp()` by design. | Masked |
| **smoke:dev:stub** | Was exposed — fixed by `withFreshServer` workaround (creates fresh server per MCP assertion). | Workaround |

## Evidence

### 1. The SDK's stateless example creates transport per request

From the official SDK `simpleStatelessStreamableHttp.ts`
([v1.x branch](https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/src/examples/server/simpleStatelessStreamableHttp.ts)):

```typescript
app.post('/mcp', async (req: Request, res: Response) => {
  const server = getServer();   // NEW server per request
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined
  });
  await server.connect(transport);  // NEW connection per request
  await transport.handleRequest(req, res, req.body);
  res.on('close', () => {
    transport.close();
    server.close();              // CLEANUP per request
  });
});
```

Key difference from our code: the SDK example creates **both a new McpServer AND a new
transport for every single request**. Our code creates one of each at startup.

### 2. The SDK's stateful example uses session tracking

From the official SDK `simpleStreamableHttp.ts`
([v1.x branch](https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/src/examples/server/simpleStreamableHttp.ts)):

```typescript
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;

  if (sessionId && transports[sessionId]) {
    transport = transports[sessionId];  // REUSE for same session
  } else if (!sessionId && isInitializeRequest(req.body)) {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),   // GENERATES session ID
      onsessioninitialized: (sid) => { transports[sid] = transport; }
    });
    const server = getServer();
    await server.connect(transport);
  } else {
    res.status(400).json({ ... });  // REJECT invalid requests
    return;
  }
  await transport.handleRequest(req, res, req.body);
});
```

Key difference: stateful mode allows transport reuse, but **only for the same session**
(identified by `Mcp-Session-Id` header). Each `initialize` creates a **new** transport.

### 3. The SDK enforces the constraint at line 137

```javascript
// webStandardStreamableHttp.js
async handleRequest(req, options) {
    // In stateless mode (no sessionIdGenerator), each request must use
    // a fresh transport. Reusing a stateless transport causes message ID
    // collisions between clients.
    if (!this.sessionIdGenerator && this._hasHandledRequest) {
        throw new Error(
          'Stateless transport cannot be reused across requests. '
          + 'Create a new transport per request.'
        );
    }
    this._hasHandledRequest = true;
    // ...
}
```

### 4. E2E tests inadvertently document the constraint

Every E2E test file includes comments acknowledging this:

```typescript
// application-routing.e2e.test.ts
/**
 * MCP StreamableHTTPServerTransport serves one client per instance.
 * Each test expecting a 200 from the transport needs its own app.
 */
```

### 5. Issue #340 on the SDK repo

[modelcontextprotocol/typescript-sdk#340](https://github.com/modelcontextprotocol/typescript-sdk/issues/340)
reports the same fundamental issue. Fixed in SDK 1.10.1 by making stateless mode
skip the `_initialized` check, but the one-request-per-transport constraint remains
by design.

## Reference Documentation

### MCP Specification

- [Streamable HTTP Transport](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http)
  — protocol-level definition of Streamable HTTP, session management, and
  `Mcp-Session-Id` header requirements.
- [Session Management](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#session-management)
  — specifies that session IDs are optional (`MAY assign`), but when present,
  clients `MUST include` them in subsequent requests.
- [MCP Introduction](https://modelcontextprotocol.io/docs/getting-started/intro/)
  — protocol overview.

### MCP TypeScript SDK (v1.x — what we use)

- **Repository**: [modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)
  (v1.x branch for our version)
- **Server docs**: [`docs/server.md`](https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/docs/server.md)
  — "Stateless vs stateful sessions" section documents both patterns.
- **Stateless example**: [`simpleStatelessStreamableHttp.ts`](https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/src/examples/server/simpleStatelessStreamableHttp.ts)
  — canonical per-request transport creation.
- **Stateful example**: [`simpleStreamableHttp.ts`](https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/src/examples/server/simpleStreamableHttp.ts)
  — canonical session-tracked transport with `sessionIdGenerator: () => randomUUID()`.
- **SDK version**: We use `@modelcontextprotocol/sdk@^1.26.0` (installed: `1.26.0`).
  v2 is pre-alpha on `main`; v1.x is the stable branch.
- **Related issue**: [#340 — stateless mode cannot be reused](https://github.com/modelcontextprotocol/typescript-sdk/issues/340)

### Vercel

- [Express on Vercel](https://vercel.com/docs/frameworks/backend) — how Express
  apps are deployed as serverless functions.
- [Vercel Functions](https://vercel.com/docs) — warm instance reuse
  behaviour (relevant: does a warm function reuse the same Express app across
  invocations?).
- [Vercel dev CLI](https://vercel.com/docs/cli/dev) — local simulation of
  Vercel serverless behaviour.
- Our deployment config: `apps/oak-curriculum-mcp-streamable-http/vercel.json`
  (`{ "framework": "express" }`).

### Express

- [Express app.use()](https://expressjs.com/en/5x/api.html) — middleware
  execution model relevant to understanding request routing through our
  security middleware → MCP transport handler chain.

## Architectural Options

### Option A: Stateful Mode (long-lived server)

Switch to `sessionIdGenerator: () => crypto.randomUUID()`. This allows the
transport to handle multiple requests within a session.

**Pros:**

- Simplest change (one line in `application.ts`)
- Matches the SDK's `simpleStreamableHttp.ts` pattern
- Works for local dev, Cursor, Claude Desktop
- Supports resumability, server notifications via SSE GET

**Cons:**

- Requires session tracking (transport map by session ID)
- Each `initialize` creates a new McpServer + transport
- Warm Vercel instances would only serve one session at a time
- E2E tests that send non-initialize requests directly would need updating
  (they'd get 400 "Server not initialized")

**Pattern** (from SDK example):

```typescript
const transports: Map<string, StreamableHTTPServerTransport> = new Map();

app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (sessionId && transports.has(sessionId)) {
    await transports.get(sessionId)!.handleRequest(req, res, req.body);
  } else if (!sessionId && isInitializeRequest(req.body)) {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => transports.set(sid, transport),
    });
    transport.onclose = () => transports.delete(transport.sessionId ?? '');
    const server = createMcpServer();
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } else {
    res.status(400).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Bad Request' }, id: null });
  }
});
```

### Option B: Per-Request Transport (serverless / stateless)

Create a new `McpServer` + `StreamableHTTPServerTransport` for every incoming
POST to `/mcp`. This is the SDK's `simpleStatelessStreamableHttp.ts` pattern.

**Pros:**

- True stateless — works on Vercel, k8s, any serverless platform
- No session tracking needed
- Each request is independent — no warm-instance state issues

**Cons:**

- Higher per-request cost (new server + transport + handler registration)
- No session continuity (no resumability, no server-initiated notifications)
- `McpServer.connect()` cost per request — need to benchmark

**Pattern** (from SDK example):

```typescript
app.post('/mcp', async (req, res) => {
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
  res.on('close', () => { transport.close(); server.close(); });
});
```

### Option C: Dual Mode (config-selected)

Support both modes via runtime configuration:

- `MCP_TRANSPORT_MODE=stateful` for local dev, traditional hosting
- `MCP_TRANSPORT_MODE=stateless` for Vercel serverless (default on Vercel)

**Pros:**

- Best of both worlds
- Production and local dev each get optimal behaviour

**Cons:**

- More code paths to test
- Configuration complexity

## Investigation Steps

### Phase 1: Confirm Impact (Priority: HIGH)

1. **Local dev verification**: Start the server with `node src/index.ts`,
   connect Cursor or the MCP Inspector, observe that the second request fails
   with 500.

2. **Vercel warm instance verification**: Deploy to a Vercel preview, send
   two sequential requests via curl. If the second fails with 500, confirm
   the bug exists in production.

3. **E2E test gap**: Write a test that sends `initialize` then `tools/list`
   to the same app instance. This test should fail (RED), proving the bug
   at the E2E level.

### Phase 2: Choose Architecture

1. Review the SDK's deployment patterns documentation:
   [`docs/server.md`](https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/docs/server.md)
   ("Multi-node deployment patterns" section).

2. Consult the team on Vercel behaviour: does the Express framework adapter
   reuse the same app across warm invocations? This determines whether
   Option A alone is sufficient or Option C is needed.

3. Benchmark per-request McpServer creation cost (Option B) to determine
   feasibility for serverless.

4. Make architectural decision: A, B, or C.

### Phase 3: Implement (TDD)

1. **RED**: Write E2E test(s) specifying the desired multi-request behaviour
   (initialize → tools/list → tool call against same server).

2. **GREEN**: Implement the chosen option.

3. **REFACTOR**: Clean up, update documentation.

### Phase 4: Verify and Clean Up

1. Run full quality gate chain (`pnpm smoke:dev:stub`).

2. If the fix allows multi-request sessions, the `withFreshServer` workaround
   in the smoke test can be simplified (assertions can share one server again).

3. Deploy to Vercel preview and run `smoke:remote`.

4. Update Vercel environment documentation
   (`docs/vercel-environment-config.md`).

## Files Involved

| File | Role |
|---|---|
| `src/application.ts` | Creates the single transport instance (line 247) — the bug |
| `src/auth-routes.ts` | Passes the transport to Express route handlers |
| `src/handlers.ts` | `createMcpHandler()` calls `transport.handleRequest()` per request |
| `smoke-tests/smoke-assertions/index.ts` | `withFreshServer` workaround |
| `smoke-tests/local-server.ts` | `withEphemeralServer` helper |
| `e2e-tests/*.e2e.test.ts` | Create fresh `createApp()` per test (masked the bug) |
| `docs/vercel-environment-config.md` | Documents "stateless" as intentional design |
| `vercel.json` | `{ "framework": "express" }` |
