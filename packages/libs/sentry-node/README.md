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
  `resolveSentryRegistrationPolicy`, `resolveSentryRelease` — strict
  parsing returns a discriminated `ParsedSentryConfig` (`SentryOffConfig
  | SentryFixtureConfig | SentryLiveConfig`, tagged by `mode: 'off' |
'fixture' | 'sentry'`). `SentryConfigEnvironment` is the env-var input
  interface consumed by `createSentryConfig`.
  `resolveSentryRegistrationPolicy` implements the ADR-163 §3 truth
  table (environment + `VERCEL_GIT_COMMIT_REF` → `{registerRelease,
  warning?}`) plus §4 override-pair validation for local-dev release
  registration. The deploy-time orchestrator in the MCP app consumes
  this sibling resolver; the runtime does not.
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

## Git SHA tag key (ADR-163 §2)

The git commit SHA is attached to every captured event as a Sentry tag
under the key **`git.commit.sha`**, matching the OpenTelemetry
`code.git.commit.sha` semantic convention. This is emitted on
`initialScope.tags` at SDK init and again on per-event tags via the
logger sink. The SHA is metadata (ADR-163 §2); it is never used as the
Sentry release identifier — the release is the root `package.json`
semver (ADR-163 §1).

> **Migration note (2026-04-20)**: this key was previously `git_sha`.
> The rename to `git.commit.sha` landed during Wave 1 of the
> observability maximisation lane. Historical events captured before
> the rename retain the legacy key in Sentry's retention window. Update
> any saved-search / dashboard queries that filter on `git_sha`.

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

## Runtime-constraint notes

### Local variables in stack frames are not available on Vercel Lambda

Sentry's [`localVariablesIntegration`][lv-integration] can capture
in-scope variable values at every frame of a thrown error's stack,
which is highly useful for debugging. **It does not function on
Vercel's Firecracker microVMs and is therefore not available to this
package's deployed callers.**

The integration works by attaching to the V8 inspector debug protocol
(via Node's `--inspect` flag, or the equivalent `vm` API). Vercel's
Lambda runtime does not expose the inspector port: Firecracker isolates
each function instance and the runtime entry point is not invoked with
`--inspect`. The integration's session establishment fails silently and
falls back to no-op variable capture.

What that means in practice for stack traces captured under
`@oaknational/sentry-node` running on Vercel:

- ✅ File path, line, column resolved (proven by source-map upload —
  see ADR-163 §Source-Map Attachment)
- ✅ Function name preserved
- ✅ Rendered source-line context (proves source upload, not just maps)
- ✅ First-party vs third-party frame distinction
- ❌ **Local variable values at frame** — not available
- ❌ **Function arguments at frame** — not available

**No package-side change is available.** Owners considering adoption
of this package should size the trade-off as: source-line context is
captured (so the THROW SITE is fully diagnosable from the source
file); the variable values at the throw site must be reconstructed
from logs, breadcrumbs, or explicit `Sentry.setContext` calls.

The constraint **only binds this package's Vercel-deployed callers**.
Long-running Node hosts (a self-hosted server, local development, an
EC2 instance) have inspector access and the integration would
function there with no code change.

**Empirical evidence**: 2026-04-26 Sentry validation captured three
issues from the live deployed preview (`OAK-OPEN-CURRICULUM-MCP-7`,
`-8`, `-9`) — all show file:line:col + rendered source context, none
show local variable values. This matches the runtime-constraint
prediction.

[lv-integration]: https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/local-variables/

### Outbound trace propagation is opt-in via DEFAULT_TRACE_PROPAGATION_TARGETS

The `tracePropagationTargets` Sentry option (set via
`DEFAULT_TRACE_PROPAGATION_TARGETS` in `runtime-sdk.ts`) controls
whether `httpIntegration` adds `sentry-trace` and `baggage` headers
to outbound HTTP calls. **The default is empty.** Internal trace
correlation within a single Lambda is unaffected — spans created by
the SDK's instrumentation share a trace ID locally. Cross-process
trace continuity to downstream services requires those services'
hostnames to be added to the targets list.

**Future state (2026-04-26 owner direction)**: targets will be
extended to include internal Oak service hostnames once the Search
service is also wired to the same Sentry organisation. Until then,
external upstreams (Clerk, third-party APIs) deliberately do NOT
receive trace context — leaking trace IDs across trust boundaries is
a compliance / cost concern.

## Related

- [ADR-078 Dependency Injection](../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md)
- [ADR-143 Observability Boundary](../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
- [ADR-160 Non-Bypassable Redaction Barrier](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
- [ADR-161 Network-Free PR-Check CI Boundary](../../../docs/architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md)
- [ADR-162 Observability-First](../../../docs/architecture/architectural-decisions/162-observability-first.md)
- [ADR-163 Sentry Release Identifier, Source-Map Attachment, and Vercel Production Attribution](../../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md)
  — authoritative mechanism for release = semver, SHA as metadata,
  `VERCEL_ENV` + branch check for production attribution, and the
  deploy-time orchestrator sequence.
- [`apps/oak-curriculum-mcp-streamable-http/docs/observability.md`](../../../apps/oak-curriculum-mcp-streamable-http/docs/observability.md)
  — app-level observability wiring and per-request span documentation.
- [`what-the-system-emits-today.md`](../../../.agent/plans/observability/what-the-system-emits-today.md)
  — externally-verifiable observability-envelope snapshot.
