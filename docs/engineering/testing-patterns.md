# Testing Patterns

Reusable testing recipes referenced by the
[testing strategy](../../.agent/directives/testing-strategy.md) and
[ADR-078](../architecture/architectural-decisions/078-dependency-injection-for-testability.md).

---

## In-Process E2E Tests with Dependency Injection

E2E tests that create the application in-process (via `createApp()`)
must configure it through dependency injection, never by mutating
`process.env`. This rule applies to **all** tests — unit,
integration, and E2E (see `principles.md`).

### The Pattern

```typescript
import { loadRuntimeConfig } from '../src/runtime-config.js';
import { createApp } from '../src/application.js';
import request from 'supertest';

// 1. Create an ISOLATED env object — never mutate process.env
const testEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  OAK_API_KEY: process.env.OAK_API_KEY ?? 'test-api-key',
  CLERK_PUBLISHABLE_KEY: 'pk_test_...',
  CLERK_SECRET_KEY: 'sk_test_dummy',
  ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
};

// 2. Pass through loadRuntimeConfig (validates and structures)
const runtimeConfig = loadRuntimeConfig(testEnv);

// 3. Create the app with DI — zero global side effects
const app = createApp({ runtimeConfig });

// 4. Test with supertest — zero network IO
const response = await request(app).get('/healthz');
expect(response.status).toBe(200);
```

### Key Rules

- **Reading** `process.env.OAK_API_KEY` (to inherit a real key when
  available) is acceptable — it is a read, not a mutation.
- **Writing** `process.env.X = 'value'` or
  `delete process.env.X` is forbidden in all tests.
- For tests needing multiple configurations (e.g. auth enabled
  vs disabled), create **separate env objects** for each case.
- Functions like `enableAuthBypass()` that mutate `process.env`
  must not exist. Use the isolated env pattern instead.

### Subprocess-Spawned Tests

Tests that spawn the application as a **separate process** (e.g.
smoke tests using `spawn('node', [entryPoint], { env })`) may pass
environment variables via the spawn `env` option. This is safe
because the variables are scoped to the child process and cannot
leak into the test runner.

### Reference Implementations

Compliant tests to use as templates:

- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-bypass.e2e.test.ts`
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/web-security-selective.e2e.test.ts`
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-stubbed-http-app.ts`

### Related

- [ADR-078: Dependency Injection for Testability](../architecture/architectural-decisions/078-dependency-injection-for-testability.md)
- [Testing Strategy](../../.agent/directives/testing-strategy.md)
