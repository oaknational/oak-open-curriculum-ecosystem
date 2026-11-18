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

## In-Process Tests with Dependency Injection

An in-process test configures the unit it drives through dependency injection,
with explicit runtime-config objects or hermetic test helpers; `process.env`
stays untouched. A test never imports a production config loader that
reads files or the environment. The loader's parsing and validation are proven
as a pure function over an injected input (the file's text, or an environment
record passed in). The loader's own read of the file or environment is never
exercised by a test: it is proven by non-test validation (a validator script's
own self-proof, run by a CI-gated task) or by an observation made once at cure
time and recorded (`testing-strategy.md` §Philosophy).

The application itself is proven in one of two ways, and neither builds it
inside a test: an integration test calls the handler or middleware under test
directly, with literal request and response values; an E2E check boots the
built app as a separate process and drives it over its protocol channel. An app
bootstrapper that reads configuration or the clock is never imported into a
test ([`test-immediate-fails`](../../.agent/rules/test-immediate-fails.md)
item 1). Tests use and create no IO
([testing-strategy.md](../../.agent/directives/testing-strategy.md) §Philosophy),
and a listener is a socket, so the listener lives in the separately running
system. The suites that call `request(app)` on an imported app break that
invariant: each is a defect, cured by injection or moved to validation, never
exempted. See
[Test File Classification](#test-file-classification).

### The Pattern

Two recipes, one per proof. The integration test drives the unit's seam; this
one is the auth-bypass case of `check-mcp-client-auth.di.integration.test.ts` in
the MCP server workspace's `src/`, and it runs as written in that workspace.
That file's protected-tool cases still inspect an input port's calls, a defect
of the recovery lane this change names out of scope; the recipe takes only the
conformant case:

```typescript
import { expect, it } from 'vitest';
import { checkMcpClientAuth } from './check-mcp-client-auth.js';
import { createFakeAuthInfo, createFakeLogger } from './test-helpers/fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';

it('lets a protected tool through when auth is disabled', () => {
  // 1. Build an explicit runtime config from literals: no disk, no environment
  const runtimeConfig = createMockRuntimeConfig({ dangerouslyDisableAuth: true });

  // 2. Drive the unit through its seam with every dependency injected: no app, no listener
  const result = checkMcpClientAuth(
    'get-key-stages',
    'https://example.com/mcp',
    createFakeLogger(),
    runtimeConfig,
    createFakeAuthInfo(),
    { toolRequiresAuth: () => true, validateResourceParameter: () => ({ valid: true }) },
  );

  // 3. Prove behaviour through the unit's public result, with literal values
  expect(result).toBeUndefined();
});
```

The E2E check's harness owns the other proof. Its composition root (the
runner's global setup or entry script) reads and validates the ambient
environment once, boots the BUILT app as a separate process with that
environment, and provides the address; the check files drive the process
over its protocol channel and never construct, import or listen on the app
(§Subprocess-Spawned Checks, and `testing-tdd-recipes.md` §Red Specs for the
`baseUrl` form).

### Key Rules

- Do not read or write `process.env` in tests. Build literal runtime
  config objects or use hermetic test helpers that do not read disk.
- Never import a runtime config loader that reads files or the environment
  into a test. Prove its parsing and validation as a pure function over an
  injected input (the file's text, or an environment record passed in). Its
  own read of the file or environment is never a test's to prove: non-test
  validation or an observation made once at cure time and recorded proves it.
- For tests needing multiple configurations (e.g. auth enabled
  vs disabled), create **separate config objects** for each case.
- Functions like `enableAuthBypass()` that mutate `process.env`
  must not exist. Use the isolated env pattern instead.

### Subprocess-Spawned Checks

A test never spawns a process (`testing-strategy.md` §Rules). A check that
spawns a built command as a **separate process** (a smoke check using
`spawn('node', [entryPoint], { env })`) may pass environment variables via the
spawn `env` option: they are scoped to the child process.

A check's composition root (its runner config, global setup or entry script)
may load ambient environment, validate it, and pass the resulting object on.
The Oak Search CLI's smoke suite does this through Vitest's `test.provide` /
`inject` (`apps/oak-search-cli/vitest.smoke.config.ts`).
The check's other files consume the injected object; they never read or write
`process.env`.

### Reference Implementations

Templates for the configuration discipline (steps 1 and 2 of the handler-seam
recipe). Each still constructs the app in the test and drives it with
`request(app)`, a defect as above, cured in the recovery lane that follows the
doctrine intake:

- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-bypass.e2e.test.ts`
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/web-security-selective.e2e.test.ts`
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-stubbed-http-app.ts`

---

## Untestable Code Is a Product-Code DI Defect

When adding tests to existing green code would make them audit-shaped, check
whether the untestability is itself the defect: a test that is merely
audit-shaped is deleted or rewritten (`tdd-as-design` §Describe vs. Audit),
while a seam testable only through prohibited mechanisms, or a test that seems
to need real IO, IS the defect. In both of those shapes the product code lacks
a dependency-injection seam (ADR-078):

- **A seam testable only through prohibited mechanisms** (ambient env import,
  a module-level singleton reachable only via `vi.mock`, a non-injectable
  route). The conformant cure is a **fresh TDD cycle** against a
  not-yet-existing injectable seam — genuine RED first — NOT a retrofit and
  NOT abstention (test-expert ruling, 2026-07-01, curriculum-hub search seam:
  extract the core with the service injected + a `createHandler(fn)` factory).
  "Tests would be audit-shaped" is a signal to inspect the product code's
  injectability, never merely a reason to skip.
- **A unit or integration test that seems to need real IO** (see [Test File
  Classification](#test-file-classification)): a loopback socket counts. The fix is to refactor the
  product to be testable (route the read/write through an injectable
  dependency, as sibling modules already do) and inject an in-memory fake —
  never to leave the IO in the test, and never to treat the refactor as
  out-of-scope ("if you need to refactor code to make it testable that is a
  good thing — that is surfacing an architectural issue and fixing it";
  owner, 2026-06-13).

## Split Proofs by Layer

A graph-backed claim is proved twice, at two layers, and each layer proves
what only it can. The contract assertion (a derived value equals what the
entity model says) lives in Vitest, importing the product module. The
emitted-channel assertion (the rendered page, metadata or JSON-LD carries
that value) lives in Playwright, which never imports a product module
(`testing-strategy` §Site Workspace Conventions): a Playwright spec that
imports an app module fails on bundler-resolved JSON imports, three times
over in 2026-03. Where the end-to-end side needs the expected value, it
reads `content/entities.json` directly with a JSON import attribute
(`with { type: 'json' }`), so the expectation is graph-backed without the
product module.

## Real-Content Backstops for Transforms

For any generator, transform, extractor, or content firewall, **green
fixtures are not proof**: fixtures encode the cases you already thought
of, and the real source carries the ones you didn't. Add a backstop that
runs on the real source — a generation-time assertion or a real-content
check, never a test — and inspect the real output before calling the
transform done (worked instances 2026-06-30: fixtures passed twice while
the real generated body carried a routing coupling and a structure leak
that only grepping the real content caught). For a separation or
firewall that encodes a principle, the real-content check IS the proof.

## Test File Classification

Test classification is based on what the test actually does,
not what the author intends:

- **Module-level state with IO is a missing seam**: a test that touches a
  module-level singleton with IO is a defect under any name. Inject the
  singleton's IO and prove the rest in process.
- **A socket is IO, whatever tool opens it**: a request driven at an
  imported, in-process app over a harness's loopback listener is IO in a
  test. Exercise the handler below the listener, called directly. A request
  driven at a separately running black-box system over a network interface is
  an E2E check, classified by the boundary, not the tool (owner-ratified
  2026-07-29).
- **Middleware proofs call the middleware alone**: call the middleware
  function directly with request and response values; never boot the full
  application, or open a listener, to prove one middleware decision (review
  lens Q3/Q4). The existing example,
  `apps/oak-curriculum-mcp-streamable-http/src/correlation/middleware.integration.test.ts`,
  mounts the middleware on a bare `express()` app and drives it with
  `request(app)`; its scoping is the lesson, and its listener is a defect,
  cured by calling the middleware directly.

## Composition Checks

Unit tests and E2E checks can all pass while the integrated product fails. For
features spanning multiple modules (MCP tool → SDK → host), add a **composition check** that
exercises the integration seam from outside the process, as an E2E check
(§In-Process Tests with Dependency Injection: no in-process app, no listener).
A composition check that proves content flow asserts a sentinel content item
through the public result, never a counter or a call argument
(`testing-strategy.md` §Rules: the hidden lesson's keyword appears only when
the switch admits it). A composition check IS the enforcement for multi-module
integration: it is what catches a knip or depcruise cleanup that removed a
module every unit test had already stopped exercising.

## MCP Transport Layer Testing

Supertest tests JSON-RPC but not SSE transport
serialisation. For MCP servers, the transport layer IS part
of the product contract — `_meta` fields, session lifecycle,
and event streaming all happen there. Use MCP client SDK
(`Client` + `StreamableHTTPClientTransport`) for
full-fidelity E2E checks alongside supertest.

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

The same discipline covers **owner-tunable values** (a separator glyph, a
colour, a cosmetic label, a display string): a test that hard-codes one
asserts configuration, not behaviour, and breaks on every free owner
change. The cure is DI-for-testability (ADR-078): make the value a
parameter with a default, have the test **inject a probe value and assert
the probe renders** — default-independent — and keep the default as
editable config no test references. Verify by grepping the tests for the
default value: zero matches (worked instance 2026-06-15: a statusline
separator pinned literally across a suite broke on every glyph change;
the probe-injection cure ended the churn).

## Flaky-Test Disposition

Evaluate a flaky test before silencing it: is it a good test (describes a
system state per `tdd-as-design`)? A good-intent test with a fragile,
environment-coupled assertion gets its **assertion fixed to prove visible
behaviour** (e.g. strip ANSI and assert the visible text — a colour-support
split once made the same source green in a no-colour run and red in a colour
one); a genuinely bad test (proves types, mirrors implementation, tests the
mock) gets **deleted**. Never skip, retry-wrap, or loosen a flake — the
wrapper silences the signal without curing the coupling; the only
dispositions are fix-the-assertion or delete (see
[`testing-strategy`](../../.agent/directives/testing-strategy.md) §Rules).

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

## Testability Seams Must Not Bypass the Gate Under Test

A convenience seam added to make a guarded surface testable — a CLI
override flag, a mode env var, a directory redirect — can itself become a
bypass of the very gate or backstop the test exists to prove, or a leak
path for ambient disk state (`.env.local` via global `process.env`) into
tests. When adding a testability seam to a protective surface, review it
as product attack surface: can the seam disable the protection in
production invocations, and does the test still prove the gate fires with
the seam present? Inject configuration explicitly (DI) rather than adding
ambient overrides — see `no-global-state-in-tests`.

## Test Configuration Gotchas

- `tsconfig.json` `include` patterns `**/*.test.ts` and `**/*.spec.ts` do NOT match
  test utility files (harness, fixture builder). Add `tests/**/*.ts` to the include
  array when creating non-test utilities in test directories.
- ESLint `projectService: true` uses the nearest `tsconfig.json`, not
  `tsconfig.lint.json`. Files must be included in both for linting to work.
- Stale vitest include globs are silent because of `passWithNoTests: true` — remove
  dead globs promptly after file moves.
- After refactoring entry points (removing `dotenv`, changing `loadRuntimeConfig`
  signature), check the E2E and smoke checks that launch the process directly — they
  break when the entry-point contract changes.
- Removing a test (e.g. deleting an audit-shaped constant assertion) can orphan the
  export it referenced — knip then blocks the commit. Un-export or delete the orphan
  in the same change.
- A spread-derived object is a new object (the codegen helper `ensurePathsOnSchema`
  is one): assert structural equality with `toStrictEqual`, never identity with `toBe`.

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

- Replace Express `_router` access with a direct call of the handler or middleware
  under test; assertions over HTTP belong to an E2E check.
- Extract repeated setup into scoped helpers inside `describe`.
- Bulk factories accept `startIndex`; do not mutate readonly `_id`.

### Related

- [ADR-078 dependency injection decision][adr-078]
- [Testing strategy directive][testing-strategy]

[adr-078]: ../architecture/architectural-decisions/078-dependency-injection-for-testability.md
[testing-strategy]: ../../.agent/directives/testing-strategy.md
