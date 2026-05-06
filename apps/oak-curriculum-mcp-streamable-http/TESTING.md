# Testing Strategy: Oak Curriculum MCP Streamable HTTP

## Overview

- Authentication is proven through deterministic mock-driven suites at unit, integration, and E2E scale.
- All tests follow TDD discipline: write the failing test first, keep arrangements simple, and favour pure functions at unit scale.
- IO appears only in E2E suites; unit and integration tests import code directly and inject tiny fakes where required.

## Authentication Testing

- Fixtures live in `src/test-fixtures/`:
  - `auth-scenarios.ts` captures canonical requests, responses, and enforcement expectations.
  - `mock-clerk-middleware.ts` exposes deterministic middleware helpers.
- Tests consuming these fixtures:
  - `auth-scenarios.unit.test.ts`
  - `mock-clerk-middleware.integration.test.ts`
  - `clerk-auth-middleware.integration.test.ts`
  - `auth-enforcement.e2e.test.ts`
- These suites keep `DANGEROUSLY_DISABLE_AUTH` unset so real middleware paths execute; only bypass-specific scenarios set the flag deliberately.

## Test Layers

### Unit tests (`*.unit.test.ts`)

- Purpose: prove pure functions with no IO.
- Run: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` (Vitest auto-detects `*.unit.test.ts`).
- Examples: `env.unit.test.ts`, `handlers.unit.test.ts`, `test-fixtures/auth-scenarios.unit.test.ts`.

### Integration tests (`*.integration.test.ts`)

- Purpose: exercise multiple units as imported code with tiny injected fakes.
- Run: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` (Vitest groups these by filename).
- Examples: `mock-clerk-middleware.integration.test.ts`, `clerk-auth-middleware.integration.test.ts`, `oauth-metadata-clerk.integration.test.ts`.

### E2E tests (`*.e2e.test.ts`)

- Purpose: exercise a running server in-process spawned by the Vitest harness.
- Run: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`.
- Key files: `auth-enforcement.e2e.test.ts`, `auth-bypass.e2e.test.ts`, `tool-call-envelope.e2e.test.ts`, `server.e2e.test.ts`.

## Fixture Catalogue

- `src/test-fixtures/auth-scenarios.ts` – immutable map of valid/invalid tokens, headers, and enforcement expectations. Update via TDD alongside schema changes.
- `src/test-fixtures/mock-clerk-middleware.ts` – deterministic middleware wiring used by integration tests.
- Whenever fixtures evolve, extend the unit suite first, then propagate changes to integration and E2E suites so expectations stay aligned.

## Using `DANGEROUSLY_DISABLE_AUTH`

- Leave the flag unset (or explicitly `false`) for any test that is meant to prove auth enforcement.
- Set the flag **only** when the scenario’s purpose is unrelated to auth (tool execution flows, protocol validation, Oak API integration, DX fixtures).
- Every remaining usage must carry an inline comment explaining why auth is intentionally bypassed and which auth-focused test exercises the behaviour instead.

## Command Reference

| Goal                      | Command                                                                  |
| ------------------------- | ------------------------------------------------------------------------ |
| Unit + integration suites | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`     |
| System suites             | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e` |

## Testing Correlation IDs

Correlation IDs enable request tracing across the system. All tests should verify correlation ID propagation where applicable.

### Asserting Correlation ID Presence

```typescript
import request from 'supertest';

it('includes correlation ID in response headers', async () => {
  const response = await request(app).get('/healthz');

  // Correlation ID should be in response headers
  expect(response.headers['x-correlation-id']).toBeDefined();
  expect(response.headers['x-correlation-id']).toMatch(/^req_\d+_[a-f0-9]{6}$/);
});
```

### Testing Correlation ID Reuse

```typescript
it('preserves client-provided correlation ID', async () => {
  const clientCorrelationId = 'test-trace-123';

  const response = await request(app).get('/healthz').set('X-Correlation-ID', clientCorrelationId);

  // Server should reuse the provided ID
  expect(response.headers['x-correlation-id']).toBe(clientCorrelationId);
});
```

### Verifying Correlation in Logs

```typescript
it('logs include correlation ID', async () => {
  const mockLogger = createMockLogger();
  const app = createTestApp({ logger: mockLogger });

  await request(app).get('/test');

  // Find log call with correlation ID
  const logCalls = vi.mocked(mockLogger.debug).mock.calls;
  const correlatedLog = logCalls.find(
    (call) => typeof call[1] === 'object' && call[1] !== null && 'correlationId' in call[1],
  );

  expect(correlatedLog).toBeDefined();
});
```

### Correlation ID Test Patterns

**Unit tests**: Verify correlation ID generation and format

- Test: IDs match expected pattern
- Test: IDs are unique across calls
- Test: IDs are URL-safe

**Integration tests**: Verify middleware behavior

- Test: Middleware generates IDs when absent
- Test: Middleware reuses client-provided IDs
- Test: Middleware sets response header
- Test: Logger receives correlation ID

**E2E tests**: Verify end-to-end correlation

- Test: Request without ID gets generated ID
- Test: Request with ID preserves that ID
- Test: All logs for one request share same ID
- Test: Concurrent requests have different IDs

## Quality Gates

- Run `pnpm check` at the workspace root after documentation or code changes.
- Before shipping, repeat `pnpm check` at the repo root to ensure no other workspaces regressed.

## Troubleshooting

- **Auth test failing with bypass enabled** – confirm `DANGEROUSLY_DISABLE_AUTH` is explicitly set to `'false'` (string) in the test harness, or removed entirely.
- **Fixture drift** – update `auth-scenarios.ts` and its unit test first, then propagate to integration and E2E suites so expectations stay aligned.
