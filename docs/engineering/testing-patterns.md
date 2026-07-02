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

For worked Red/Green/Refactor examples, see
[Testing TDD Recipes](./testing-tdd-recipes.md).

---

## In-Process E2E Tests with Dependency Injection

E2E tests that create the application in-process (via `createApp()`)
must configure it through dependency injection with explicit runtime-config
objects or hermetic test helpers, never by reading or mutating `process.env`.
Do not import production config loaders unless the test is directly proving
the loader; they may read `.env` files as part of the production pipeline.
Supertest is classified as E2E because it uses loopback socket IO; see
[Test File Classification](#test-file-classification).

### The Pattern

```typescript
import { createApp } from '../src/application.js';
import request from 'supertest';
import { createMockObservability, createMockRuntimeConfig } from './helpers/test-config.js';

// 1. Build an explicit runtime config — never read or mutate process.env
const runtimeConfig = createMockRuntimeConfig({
  dangerouslyDisableAuth: true,
  env: { OAK_API_KEY: 'test-api-key' },
});

// 2. Create the app with DI — zero global side effects
const app = await createApp({
  runtimeConfig,
  observability: createMockObservability(runtimeConfig),
});

// 3. Test with supertest — no external network IO
const response = await request(app).get('/healthz');
expect(response.status).toBe(200);
```

### Key Rules

- Do not read or write `process.env` in tests. Build literal runtime
  config objects or use hermetic test helpers that do not read disk.
- Do not import `loadRuntimeConfig` into E2E tests unless the runtime
  config loader is the direct unit under test.
- For tests needing multiple configurations (e.g. auth enabled
  vs disabled), create **separate config objects** for each case.
- Functions like `enableAuthBypass()` that mutate `process.env`
  must not exist. Use the isolated env pattern instead.

### Subprocess-Spawned Tests

Tests that spawn the application as a **separate process** (e.g.
smoke tests using `spawn('node', [entryPoint], { env })`) may pass
environment variables via the spawn `env` option. This is safe
because the variables are scoped to the child process and cannot
leak into the test runner.

Vitest smoke suites may load ambient environment in the runner config
composition root, validate it, and pass the resulting object through
`test.provide` / `inject`. Test files and setup files must consume the
injected object; they must not read or write `process.env`.

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

## Rendered-Output Assertions

Test a function that returns rendered or string output (a statusline
renderer, a formatter, a layout assembler) by **observable relationships
through the interface** — "the line containing X also contains Y",
relative order, presence/absence — never geometry or exact content.

- Forbid: pinned row indices (`rows[2]`), `toHaveLength` line counts,
  exact ANSI-escape literals, whole-object `.toEqual` on the parsed
  result. A harmless layout reflow or an added field must not break a
  test that proves nothing about behaviour.
- Strip ANSI before asserting visible text; prefer `toMatchObject` over
  `.toEqual` so additive fields don't break unrelated tests.
- Write helpers (line-containing-needle, relative-index, strip-ANSI) and
  assert relationships. Treat any `rows[N]` / line-count / exact-escape
  assertion on rendered output as a coupling smell to remove.

This is the rendered-output specialisation of testing-strategy's "test
behaviour through public interfaces; assert effects, not internal
constants". (Owner-corrected twice in one session, 2026-06-29.)

## Acceptance Value-Proxies

Acceptance value-proxies must compare against independent ground-truth
measures. A value-proxy acceptance criterion ("the new CLI produces a
value within ±N% of the prior baseline") is **tautological** if the
new implementation and the baseline use the same method. Reproducing
the baseline value does not validate correctness; it validates only
internal consistency.

Worked example: a token-count CLI defines acceptance as "the chars/4
output agrees with the prior chars/4 baseline ±5%." The baseline is
itself chars/4. The CLI cannot fail the acceptance check by
construction — chars/4 reproducing chars/4 proves nothing.

The cure is to compare against a **method-independent ground-truth
measure**. For token-count, that is `wc -c` for total characters; the
chars/4 conversion then becomes a mechanical step verified
independently. For other domains, the ground-truth measure is the
authoritative external observation (file size from `stat`, byte count
from the filesystem, response time from a stopwatch, etc.) that the
proxy is supposed to approximate.

Acceptance criteria framed as "agrees with prior baseline ±N%" without
naming an independent ground-truth measure are tautological and fail
under normal churn (any drift looks like baseline error rather than
proxy error). Reject the framing at plan-author time, not at WS
execution.

## Test Configuration Gotchas

- `tsconfig.json` `include` patterns `**/*.test.ts` and `**/*.spec.ts` do NOT match
  test utility files (harness, fixture builder). Add `tests/**/*.ts` to the include
  array when creating non-test utilities in test directories.
- ESLint `projectService: true` uses the nearest `tsconfig.json`, not
  `tsconfig.lint.json`. Files must be included in both for linting to work.
- Stale vitest include globs are silent because of `passWithNoTests: true` — remove
  dead globs promptly after file moves.
- `resolveEnv` integration tests that need `.env` file isolation: use `'/tmp'` as
  `startDir` to prevent ambient `.env` files from satisfying schema requirements.
- After refactoring entry points (removing `dotenv`, changing `loadRuntimeConfig`
  signature), check E2E tests that launch the process directly — they break when the
  entry-point contract changes.
- Removing a test (e.g. deleting an audit-shaped constant assertion) can orphan the
  export it referenced — knip then blocks the commit. Un-export or delete the orphan
  in the same change.

## Discriminating Fixtures

Pick test inputs that maximally **distinguish** the contract from its plausible
regressions — a fixture that still passes under a wrong implementation is a weak
tripwire.

- **Place a witness value _between_ events, not after them.** For an as-of / `--now`
  filter over time-ordered fixtures (e.g. events at 11:00 and 12:00), a `--now` of
  `11:30` (between) fails loud if the filter couples wrongly and drops an event; a
  `--now` after all events (e.g. `13:00`) passes green even under a broken filter.
- The general rule: choose the input that, under the most likely wrong
  implementation, produces a _different_ observable result from the correct one.

## Test Isolation

- Replace Express `_router` access with supertest HTTP assertions.
- Extract repeated setup into scoped helpers inside `describe`.
- For 30+ file migrations, use subagents.
- Bulk factories accept `startIndex`; do not mutate readonly `_id`.

### Related

- [ADR-078 dependency injection decision][adr-078]
- [Testing strategy directive][testing-strategy]

[adr-078]: ../architecture/architectural-decisions/078-dependency-injection-for-testability.md
[testing-strategy]: ../../.agent/directives/testing-strategy.md
