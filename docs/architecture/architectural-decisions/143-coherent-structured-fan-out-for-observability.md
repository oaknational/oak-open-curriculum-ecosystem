# ADR-143: Coherent Structured Fan-Out for the Sentry and OpenTelemetry Foundation

## Status

Accepted (2026-03-27) — **Superseded in part by [ADR-160](160-non-bypassable-redaction-barrier-as-principle.md) (§6 only; 2026-04-17)**. The rest of ADR-143 (sink model, `OtelLogRecord` currency, workspace scope, other out-of-scope clauses) remains in force.

**Related**: [ADR-051 (OpenTelemetry-Compliant Single-Line JSON Logging)](051-opentelemetry-compliant-logging.md), [ADR-078 (Dependency Injection for Testability)](078-dependency-injection-for-testability.md), [ADR-128 (Retire the Standalone STDIO Workspace)](128-stdio-workspace-retirement-and-http-transport-consolidation.md), [ADR-129 (Domain Specialist Capability Pattern)](129-domain-specialist-capability-pattern.md), [ADR-160 (Non-Bypassable Redaction Barrier as Principle)](160-non-bypassable-redaction-barrier-as-principle.md)

## Context

Oak already has OpenTelemetry-compliant JSON logging via
[`@oaknational/logger`](../../../packages/libs/logger/), but the remaining
observability foundation work is materially larger than "add a Sentry sink".

The next foundation needs to support:

1. logger fan-out to multiple destinations without duplicating formatting logic,
2. Sentry log forwarding and handled-error capture,
3. active trace correlation from OpenTelemetry span context,
4. a single non-bypassable telemetry redaction barrier before any sink sees
   data,
5. shared runtime configuration and release resolution across the HTTP MCP
   server and the Search CLI,
6. MCP-specific wrapping for Sentry Insights with deny-by-default payload
   capture.

During planning, a natural alternative emerged: replace the logger with a
full asynchronous transport pipeline supporting batching, buffering, per-sink
backpressure policy, and heterogeneous encoders as first-class concepts.

That alternative would be a materially larger rewrite. It could be justified if
Oak already needed durable buffering, independent encoder graphs, or
cross-process delivery guarantees. Today it does not.

The actual product surface in scope is narrower:

1. the HTTP MCP server is the canonical MCP runtime,
2. the Search CLI is the canonical operational runtime,
3. the standalone STDIO workspace is deprecated and must not drive new
   architectural work per ADR-128.

We therefore need the simplest architecture that still establishes an excellent
long-term foundation. The governing principle for this work is:

> We always choose long-term architectural excellence over expediency.

That principle does not imply maximal machinery. It implies choosing the
smallest architecture that remains correct, extensible, and hard to misuse.

## Decision

Adopt a **coherent structured fan-out** logger architecture and explicitly
reject a speculative full async transport/pipeline rewrite for this phase.

### 1. Canonical logger currency

`OtelLogRecord` remains the canonical internal logging currency.

Formatting to a single-line JSON string is still performed once inside the
logger, but the line is a downstream artefact derived from the canonical
structured record, not the source of truth.

### 2. Single coherent sink model

`@oaknational/logger` will expose a single sink contract:

```ts
type LogContextScalar = string | number | boolean | null;
type LogContextValue =
  | LogContextScalar
  | readonly LogContextValue[]
  | { readonly [key: string]: LogContextValue };
type LogContext = { readonly [key: string]: LogContextValue };

interface NormalizedError {
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
  readonly cause?: NormalizedError;
  readonly metadata?: LogContext;
}

interface LogEvent {
  readonly level: LogLevel;
  readonly message: string;
  readonly context: LogContext;
  readonly error?: NormalizedError;
  readonly otelRecord: OtelLogRecord;
  readonly line: string;
}

interface LogSink {
  write(event: LogEvent): void;
}
```

Legacy separate sink concepts (`stdoutSink`, `fileSink`) are replaced by a
single `sinks: readonly LogSink[]` array. Existing destinations become sink
implementations, not privileged logger concepts.

### 3. Synchronous fan-out with failure isolation

Sink writes remain synchronous and fast.

The logger is responsible for:

1. filtering by severity,
2. redacting once,
3. producing the canonical event once,
4. invoking each sink independently with per-sink failure isolation.

The logger is **not** responsible for:

1. durable buffering,
2. batching,
3. retry policy,
4. backpressure management,
5. cross-process delivery guarantees.

Those concerns belong to the underlying destination SDK or transport where they
actually matter. For example, Sentry's own SDK owns remote delivery semantics.

### 4. Explicit error-call contract

`Logger.error` and `Logger.fatal` must expose only these public call shapes:

1. `(message, context?)`
2. `(message, error: Error, context?)`

Unknown caught values must be normalised explicitly with `normalizeError()`
before they are passed as errors. This is an intentional type-system pressure:
callers must choose whether they are logging an `Error` or logging context.

### 5. Trace correlation rules

The logger must read the active OpenTelemetry span context when present and
populate `TraceId`, `SpanId`, and `TraceFlags` from that span.

If no active span exists, the logger falls back to correlation-id hashing for
`TraceId` compatibility with existing request correlation.

### 6. Shared redaction barrier

> **Note (2026-04-17)**: the enumerated list in this section is
> **superseded in part** by
> [ADR-160: Non-Bypassable Redaction Barrier as Principle](160-non-bypassable-redaction-barrier-as-principle.md).
> The principle — one shared redactor, applied before any sink
> receives data — remains in force; the enumeration below is retained
> for historical context but is no longer canonical. For the
> authoritative closure property, hook contract non-uniformity, and
> test gate, read ADR-160.

The logger must apply one shared telemetry redaction policy before any sink
receives data.

The same policy must also power:

1. Sentry `beforeSend`
2. Sentry `beforeSendTransaction`
3. Sentry `beforeSendSpan`
4. Sentry `beforeSendLog`
5. Sentry breadcrumb filtering

This prevents policy drift between local logs and forwarded telemetry.

### 7. Workspace adoption scope

The foundational observability adoption scope for this phase is:

1. `apps/oak-curriculum-mcp-streamable-http`
2. `apps/oak-search-cli`

The deprecated standalone stdio workspace is explicitly out of scope for new
observability investment.

## Options Considered

### Option A: Coherent structured fan-out

Keep one logger, one canonical event shape, one redaction barrier, and multiple
sink implementations.

**Chosen.**

Why:

1. it solves the real product needs now,
2. it keeps the logging architecture understandable,
3. it supports Sentry cleanly without coupling Sentry into the core logger,
4. it preserves a future path to richer delivery semantics if they become
   necessary later.

### Option B: Full async transport/pipeline rewrite

Build a transport graph with async queues, batching, buffering, retry,
backpressure, and potentially multiple encoder stages.

**Rejected for this phase.**

Why:

1. it adds major complexity before Oak has concrete requirements for it,
2. it would delay the real product outcome,
3. it would blur ownership between logger responsibilities and SDK transport
   responsibilities,
4. it would optimise for speculative future needs rather than present
   architectural truth.

## Rationale

### Why this is architectural excellence, not expediency

Excellence means building the right foundation, not the biggest one.

The coherent structured fan-out model is the right foundation because it:

1. removes ad hoc sink special-casing,
2. makes redaction a first-class boundary,
3. makes trace correlation explicit,
4. supports Sentry, file, stdout, and future sinks cleanly,
5. keeps dependency direction and failure semantics easy to reason about.

That is a better long-term architecture than a speculative async framework that
Oak cannot yet justify operationally.

### Why not keep the existing sink split

The current `stdoutSink` and `fileSink` split hard-codes destination concepts
into the logger API. That is already too narrow for the next phase.

Replacing it with one sink contract makes the logger simpler and more general at
the same time.

### Why not wait for a future wider observability rewrite

The HTTP server and Search CLI now need shared observability primitives:
redaction, release resolution, Sentry init, trace correlation, and MCP
wrapping. Deferring the architectural cleanup would guarantee drift and
piecemeal work.

## Consequences

### Positive

1. `@oaknational/logger` becomes a cleaner core foundation.
2. Sentry integration stays outside the logger core via sink and adapter
   packages.
3. Redaction policy becomes centralised and enforceable.
4. Trace/log correlation becomes correct when spans are active.
5. The HTTP server and Search CLI share one observability shape.

### Negative

1. This is an internal breaking change and requires repo-wide logger call-site
   cleanup.
2. Search CLI adoption still requires careful composition-root work because it
   currently relies on mutable logger globals.

### Neutral

1. This ADR does not prohibit a future async transport layer.
2. If Oak later needs batching, durable buffering, or per-sink async policy as
   first-class features, a later ADR may extend or supersede this decision with
   concrete evidence.

## Implementation Notes

The implementation is expected to:

1. create shared observability packages for provider-neutral helpers and
   Sentry-specific wiring,
2. add the Sentry specialist capability before implementation work begins,
3. model Sentry config as a discriminated union keyed by `SENTRY_MODE`,
4. fail closed when live Sentry config is invalid,
5. keep `SENTRY_SEND_DEFAULT_PII` effectively pinned to `false` in v1,
6. treat the HTTP server and Search CLI as the adoption targets,
7. leave the deprecated standalone stdio workspace untouched except for any
   unavoidable compile-preserving compatibility edits.

## Related Documentation

- [ADR-159: Per-Workspace Vendor CLI Ownership with Repo-Tracked
  Configuration](159-per-workspace-vendor-cli-ownership.md) —
  formalises how the source map upload decision in this ADR (and any
  future vendor CLI in the observability/auth pipeline) is realised:
  pnpm-installed devDep, per-workspace `.sentryclirc`, shared-library
  "no default project" rule, and fail-fast preflights.
- [Sentry Deployment Runbook](../../operations/sentry-deployment-runbook.md)
  — live runbook for release correlation, source map uploads, and
  production verification.
- [Sentry CLI Usage](../../operations/sentry-cli-usage.md) — canonical
  documentation for the `sentry-cli` vs dev `sentry` split,
  `.sentryclirc` composition, per-workspace ownership, and the
  two-step `sourcemaps inject` → `sourcemaps upload` flow that this
  ADR's source map decision assumes.
- [Sentry + OpenTelemetry Integration Execution Plan](../../../.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md)
  — the execution plan under which the observability adoption,
  per-workspace CLI scoping, and alerting baseline were landed.
