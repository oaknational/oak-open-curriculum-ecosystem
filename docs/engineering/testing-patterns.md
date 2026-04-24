---
fitness_line_target: 140
fitness_line_limit: 200
fitness_char_limit: 12000
fitness_line_length: 100
split_strategy: 'Split specialised domains into focused pattern files if this grows.'
---

# Testing Patterns

Reusable testing recipes referenced by the
[testing strategy](../../.agent/directives/testing-strategy.md) and
[ADR-078](../architecture/architectural-decisions/078-dependency-injection-for-testability.md).

`.agent/directives/testing-strategy.md` is the authoritative doctrine.
This file is a governed recipe companion; patterns here must conform to the
directive and to the immediate-fail rules.

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
  OAK_API_KEY: 'test-api-key',
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

- Do not read or write `process.env` in tests. Build literal env
  objects and pass them explicitly through configuration loaders.
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

---

## Test File Classification

Test classification is based on what the test actually does,
not what the author intends:

- **Module-level state = integration**: any test that touches
  module-level singletons with IO must be
  `*.integration.test.ts`, even if it injects DI fakes for
  the new behaviour.
- **Supertest is E2E, not integration**: supertest's
  in-process HTTP server does real socket IO. The existing
  `error-handling.integration.test.ts` is a pre-existing
  misclassification. For middleware tests, call Express
  directly with mocks.

## Composition Testing

Unit + E2E tests can all pass while the integrated product
fails. For features spanning multiple modules (MCP tool →
SDK → host), add a **composition test** that exercises the
integration seam.

Example: `mcp-app-composition.e2e.test.ts` caught
knip/depcruise cleanup that broke the UI — the composition
test IS the enforcement for multi-module integration.

## MCP Transport Layer Testing

Supertest tests JSON-RPC but not SSE transport
serialisation. For MCP servers, the transport layer IS part
of the product contract — `_meta` fields, session lifecycle,
and event streaming all happen there. Use MCP client SDK
(`Client` + `StreamableHTTPClientTransport`) for
full-fidelity E2E tests alongside supertest.

## Structural Equality

`ensurePathsOnSchema` creates a new object (spread) — use
`toStrictEqual` not `toBe` for structural equality checks
on spread-derived objects.

### Related

- [ADR-078 dependency injection decision][adr-078]
- [Testing strategy directive][testing-strategy]

[adr-078]: ../architecture/architectural-decisions/078-dependency-injection-for-testability.md
[testing-strategy]: ../../.agent/directives/testing-strategy.md
