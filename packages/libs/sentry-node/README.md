# @oaknational/sentry-node

Shared Sentry Node configuration, fixture capture, logger sink, and runtime
initialisation helpers for Oak runtimes. Applies the invariants established by
[ADR-143 Observability Boundary](../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md),
[ADR-160 Non-Bypassable Redaction Barrier](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md),
[ADR-078 Dependency Injection](../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md),
and [ADR-162 Observability-First](../../../docs/architecture/architectural-decisions/162-observability-first.md)
to every consuming runtime.

**Consuming apps**:

- [`apps/oak-curriculum-mcp-streamable-http`](../../../apps/oak-curriculum-mcp-streamable-http/docs/observability.md)
  — MCP server observability guide (wiring, spans, redaction, modes).
- `apps/oak-search-cli` — Search CLI observability. Docs pending a follow-up
  lane on the next branch.

## What this package provides

- **Runtime initialisation**: `initialiseSentry`, `createSentryInitOptions`,
  `defaultSentryNodeSdk`, and safe shutdown via `flushSentry`.
- **Logger sink**: `createSentryLogSink` — bridges `@oaknational/logger` output
  into Sentry's `logger` event stream in live mode. Stdout JSON remains the
  canonical local log surface in every mode; the logger sink is purely
  additive.
- **Fixture store**: `createFixtureSentryStore` — in-memory, no-network capture
  for `SENTRY_MODE=fixture` validation and tests. Returns a
  `FixtureSentryStore` exposing the full capture taxonomy (errors, contexts,
  breadcrumbs, logs, tags, users, transactions).
- **Shared delegates** (the hook registry): two related types. The barrier
  wiring is typed as `SentryRedactionHooks` (`Pick<NodeOptions,
'beforeSend' | 'beforeSendTransaction' | 'beforeSendSpan' | 'beforeSendLog'
| 'beforeBreadcrumb'>` in `runtime-sdk.ts`) — every outbound event,
  transaction, span, log, and breadcrumb passes through this five-hook slot.
  `SentryPostRedactionHooks` is the subset that admits a consumer-supplied
  post-redaction slot today: `beforeSend`, `beforeSendTransaction`, and
  `beforeBreadcrumb`. `beforeSendSpan` and `beforeSendLog` are
  redaction-only (no consumer slot).
- **Configuration**: `createSentryConfig`, `resolveSentryEnvironment`,
  `resolveSentryRelease` — strict parsing returns a discriminated
  `ParsedSentryConfig` (`SentryOffConfig | SentryFixtureConfig |
SentryLiveConfig`, tagged by `mode: 'off' | 'fixture' | 'sentry'`).
  `SentryConfigEnvironment` is the env-var input interface consumed by
  `createSentryConfig`.
- **Error mapping**: `describeConfigError`, `mapCloseError`, `mapFlushError`
  — `Result<T, E>` error adapters for the shutdown and configuration paths.

## SENTRY_MODE modes

`SENTRY_MODE` is the kill switch and behaviour selector for every consuming
runtime. It is parsed once at startup and never re-read.

- `SENTRY_MODE=off` — default. No Sentry SDK init, no outbound delivery, no
  fixture capture. Every consumer still emits structured JSON to stdout via
  `@oaknational/logger` so local observability is preserved with zero vendor
  dependency (ADR-162 vendor-independence clause).
- `SENTRY_MODE=fixture` — no-network local validation. The SDK does **not**
  initialise; instead every capture path is routed into a `FixtureSentryStore`
  for assertion by tests or local inspection. Stdout JSON is retained.
- `SENTRY_MODE=sentry` — live Sentry mode. `initialiseSentry` configures the
  official SDK, the logger sink becomes active, and every capture path passes
  through the redaction barrier before transmission. Stdout JSON is still
  retained.

No other values are accepted; `createSentryConfig` returns
`Result<ParsedSentryConfig, ObservabilityConfigError>` for strict validation
at the trust boundary.

## DI seam (ADR-078)

Per [ADR-078](../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md)
this package is a library: it **never** reads `process.env`, `process.cwd`,
or any other ambient state. Every runtime value — `sentryMode`, DSN,
environment, release, sample rates, redaction policy — is threaded in as a
parameter through the DI seam on `initialiseSentry` and its composed
factories.

Consumers construct a `RuntimeConfig` literal at their own boundary (typically
via `@oaknational/env-resolution` in the app layer), then pass the resolved
configuration through. This keeps the library hermetic: tests construct
`InitialiseSentryOptions` literals directly without booting env resolution,
and no `process.env` read can creep into library code. The ESLint
configuration enforces the ban on `process.env` reads inside `src/**` at
`error` severity.

## Redaction barrier (ADR-160)

[ADR-160](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
establishes the non-bypassable redaction barrier as the single closure point
for every payload that would otherwise leave the process. `sendDefaultPii:
false` (ADR-143) is set as the floor; the barrier adds structural redaction
on top so every outbound event, transaction, span, log, and breadcrumb is
sanitised before transmission.

The **shared delegates** are the mechanism. The barrier wires five hooks
as a single adapter-level type, `SentryRedactionHooks`
(`Pick<NodeOptions, 'beforeSend' | 'beforeSendTransaction' | 'beforeSendSpan'
| 'beforeSendLog' | 'beforeBreadcrumb'>` in `runtime-sdk.ts`):

- `beforeSend` — errors and messages
- `beforeSendTransaction` — transactions (cannot drop —
  `Promise<TransactionEvent>` only)
- `beforeSendSpan` — spans
- `beforeSendLog` — `logger` events (new in Sentry 10.x)
- `beforeBreadcrumb` — breadcrumbs

Every outbound payload passes through this wiring before transmission. A
subset of these hooks — `beforeSend`, `beforeSendTransaction`, and
`beforeBreadcrumb` — admits a consumer-supplied post-redaction slot via
`SentryPostRedactionHooks`; the remaining two (`beforeSendSpan` and
`beforeSendLog`) are redaction-only today. Adding a new payload-mutating
hook to the Sentry SDK means adding a new member to
`SentryRedactionHooks` — there is no way to wire a consumer hook that skips
redaction.

The closure is enforced by
[`runtime-redaction-barrier.unit.test.ts`](src/runtime-redaction-barrier.unit.test.ts)
(18 tests, three-part closure + automated bypass validation). If a future
SDK release adds a new mutating hook and the test suite is not updated in
the same commit, the tests fail.

## Fixture store

`createFixtureSentryStore()` returns an in-memory `FixtureSentryStore` that
captures every shape the live SDK would transmit, typed as:

- `FixtureSentryExceptionCapture` — errors and messages
- `FixtureSentryContextCapture` — scope context
- `FixtureSentryLogCapture` — logger events
- `FixtureSentryTagCapture` — tags
- `FixtureSentryUserCapture` — user scope set via `observability.setUser`,
  including any `id` attached by the app (e.g. the authenticated `userId`
  in the MCP app). No request body, query, or header content is attached
  to the scope.

The fixture store is the basis for every `SENTRY_MODE=fixture` test: assert
against the captured taxonomy, not against a mocked vendor SDK. This matches
the `testing-strategy.md` rule that tests must not mutate global state or
read `process.env`: fixture mode is enabled by the config literal the test
passes in, not by env manipulation.

## Logger sink

`createSentryLogSink` bridges `@oaknational/logger` into Sentry's `logger`
event stream when `SENTRY_MODE=sentry`. The sink is DI-injected alongside
the runtime and composes through the same redaction barrier as every other
payload. Stdout JSON remains authoritative: the logger sink is an additive
mirror, not a replacement.

In `fixture` and `off` modes the logger sink is inert; the logger still
emits stdout JSON normally.

## Related

- [ADR-078 Dependency Injection](../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md)
- [ADR-143 Observability Boundary](../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
- [ADR-160 Non-Bypassable Redaction Barrier](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
- [ADR-161 Network-Free PR-Check CI Boundary](../../../docs/architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md)
- [ADR-162 Observability-First](../../../docs/architecture/architectural-decisions/162-observability-first.md)
- [`apps/oak-curriculum-mcp-streamable-http/docs/observability.md`](../../../apps/oak-curriculum-mcp-streamable-http/docs/observability.md)
  — app-level observability wiring and per-request span documentation.
- [`what-the-system-emits-today.md`](../../../.agent/plans/observability/what-the-system-emits-today.md)
  — externally-verifiable observability-envelope snapshot.
