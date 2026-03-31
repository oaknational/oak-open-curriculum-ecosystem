---
name: "Explicit DI Over Ambient State"
use_this_when: "You are tempted to use AsyncLocalStorage, module-level singletons, or thread-local context to propagate request-scoped data through a call chain"
category: architecture
proven_in: "apps/oak-curriculum-mcp-streamable-http/src/handlers.ts"
proven_date: 2026-03-30
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "AsyncLocalStorage context leaks in per-request handlers; ambient state makes testing require global mocks; request context is invisible in function signatures"
  stable: true
---

# Explicit DI Over Ambient State

## Pattern

Pass request-scoped data (auth, config, observability) as explicit
parameters through the call chain rather than storing them in
`AsyncLocalStorage`, module-level variables, or thread-local context.

## Anti-Pattern

```typescript
// ❌ Ambient state — invisible dependency, requires vi.mock to test
const requestStorage = new AsyncLocalStorage<Request>();

function setRequestContext<T>(req: Request, cb: () => Promise<T>) {
  return requestStorage.run(req, cb);
}

function getRequestContext(): Request | undefined {
  return requestStorage.getStore();
}
```

## Correct Pattern

```typescript
// ✅ Explicit parameter — visible dependency, testable with plain fakes
server.registerTool(name, config, async (params, extra) => {
  return handleToolWithAuth({
    authInfo: extra.authInfo,  // Explicit parameter
    tool,
    params,
    deps,
  });
});
```

## Why

- Function signatures document their dependencies
- Tests use simple fakes passed as arguments (ADR-078)
- No `vi.mock` or global state manipulation needed
- Context leaks between requests are impossible
- The type system proves the data is available

## When Ambient State Is Acceptable

OpenTelemetry trace context propagation (`context.with(...)`) is an
acceptable exception because it is infrastructure-only (carries no
business data) and the OTel API is designed around it.
