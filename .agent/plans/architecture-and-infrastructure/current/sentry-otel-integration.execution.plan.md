---
name: "Sentry and OpenTelemetry Integration"
overview: >
  Integrate the Sentry SDK with the existing @oaknational/logger package and
  wire observability into all deployed workspaces. The logger already produces
  OpenTelemetry-compliant JSON logs (ADR-051); this plan adds runtime Sentry
  error tracking, log forwarding via a Sentry sink, and distributed tracing
  via Sentry's built-in OTel support. Blocker for Milestone 3 (Public Beta).
source_strategy: "../observability-and-quality-metrics.plan.md"
todos:
  - id: audit-current-state
    content: "Audit current logger architecture, sink interfaces, and deployment topology"
    status: completed
  - id: reference-implementation-review
    content: "Review starter-app-spike reference implementation for transferable patterns"
    status: completed
  - id: adr-sentry-strategy
    content: "Draft ADR for Sentry integration strategy (Sentry as OTel provider, not separate OTel SDK)"
    status: pending
  - id: sentry-sink
    content: "Implement Sentry sink for UnifiedLogger (port from starter-app-spike pattern)"
    status: pending
  - id: error-tracking-adapter
    content: "Implement ErrorTrackingAdapter interface with Sentry and Console implementations"
    status: pending
  - id: fixture-mode
    content: "Implement SENTRY_MODE fixture/sentry toggle for credential-free local development"
    status: pending
  - id: env-config
    content: "Add Sentry environment variables to env schemas and runtime config"
    status: pending
  - id: mcp-server-wrapping
    content: "Wrap MCP server instances with Sentry.wrapMcpServerWithSentry() and define recordInputs/recordOutputs PII policy"
    status: pending
  - id: workspace-integration-http
    content: "Wire Sentry init + MCP server wrapping into oak-curriculum-mcp-streamable-http"
    status: pending
  - id: workspace-integration-search
    content: "Wire Sentry into oak-search-cli"
    status: pending
  - id: workspace-integration-stdio
    content: "Evaluate Sentry for oak-curriculum-mcp-stdio (file-only logging context) including MCP wrapping"
    status: pending
  - id: vercel-deployment
    content: "Configure Sentry project, DSN, and source map uploads for Vercel deployment"
    status: pending
  - id: alerting-baseline
    content: "Define initial alerting thresholds (error rate, latency) in Sentry"
    status: pending
  - id: mcp-insights-verification
    content: "Verify MCP Insights dashboard populates with tool call metrics, latency, and error rates"
    status: pending
---

# Sentry and OpenTelemetry Integration

## Milestone Position

**Blocker for Milestone 3 (Public Beta)**. Observability beyond structured
logs is required before the service exits public alpha. See
[high-level-plan.md](../../high-level-plan.md) Milestone 3, stream 3.

For public alpha (M2), Vercel logs provide sufficient visibility.

## Current State (as of 2026-03-08)

- `@oaknational/logger` produces **OTel-compliant JSON logs** (ADR-051)
  following the OpenTelemetry Logs Data Model specification
- Logger uses a **sink-based architecture** (stdout sink, file sink) with
  dependency injection — adding a Sentry sink requires no architectural changes
- **No Sentry SDK** is installed in any workspace — requires `@sentry/node`
  >= 9.46.0 for MCP Insights support
- **No `@opentelemetry/*` runtime packages** are installed (only transitive
  via vitest)
- Correlation IDs are converted to W3C TraceId format for future trace
  correlation
- All Sentry guidance is **archived**: `docs/agent-guidance/archive/sentry-guidance.md`

## Reference Implementation

The **Oak Starter App** (`~/code/personal/starter-app-spike/`) provides a
production-grade Sentry integration that serves as the reference for this work.
Key transferable patterns:

### Patterns to Port

| Pattern | Source Location | Target |
|---------|----------------|--------|
| **Sentry sink for UnifiedLogger** | `src/lib/logger/src/sentry-sink.ts` | `packages/libs/logger/` |
| **ErrorTrackingAdapter interface** | `src/lib/error-tracking/` | `packages/libs/logger/` or new core package |
| **Fixture mode (`SENTRY_MODE`)** | `src/lib/config/internal/helpers/observability.ts` | App-level config |
| **Breadcrumb adapters** | `src/lib/logger/src/breadcrumb-adapters.ts` | `packages/libs/logger/` |
| **`withSpan()` helper** | `src/lib/observability/spans.ts` | Shared observability utility |

### Key Architectural Decisions from Starter App

1. **Sentry as OTel provider** (ADR-0002): Use `@sentry/node` (not
   `@sentry/nextjs` — we have no Next.js) as the canonical observability
   solution. Sentry provides built-in OTel support. Do NOT install separate
   `@opentelemetry/*` SDKs — they cause provider conflicts.

2. **Dedicated Sentry sink, not `consoleLoggingIntegration`** (ADR-0011):
   Preserves structured context (not raw console strings), avoids duplication
   with Vercel log drains, gives direct control over what is sent.

3. **Centralised config with DI**: All Sentry env vars flow through typed
   builders. No direct `process.env` access in product code (aligns with
   ADR-078).

4. **Level routing**: DEBUG/TRACE stay local. INFO/WARN forward to Sentry
   Logs API. ERROR/FATAL forward and create Sentry issues.

5. **MCP server wrapping** (Sentry MCP Insights): `@sentry/node` >= 9.46.0
   provides `Sentry.wrapMcpServerWithSentry()` which auto-instruments MCP
   servers with OTel spans for tool calls, resource reads, and prompt
   retrievals. This populates the Sentry Insights > AI > MCP dashboard with
   traffic, latency, error rates, client identification, and transport
   distribution. No separate package required — built into `@sentry/node`.

### Patterns That Do NOT Transfer

- Client/edge Sentry configs (`sentry.client.config.ts`, `sentry.edge.config.ts`)
  — no browser/edge runtimes in this monorepo
- Next.js webpack plugin / source map uploads via `withSentryConfig()` — we use
  tsup, not webpack
- `@sentry/nextjs` specifics — use `@sentry/node` directly

## Phases

### Phase 1: Foundation (Logger + Adapter)

1. Draft ADR for Sentry integration strategy
2. Implement `SentrySink` in `@oaknational/logger` — accepts `Sentry.logger`
   via constructor (DI), maps severity levels, forwards structured attributes
3. Implement `ErrorTrackingAdapter` interface with `SentryErrorTrackingAdapter`
   and `ConsoleErrorTrackingAdapter`
4. Implement `SENTRY_MODE: "fixture" | "sentry"` toggle
5. Add Sentry env vars to env schemas (`SENTRY_DSN`, `SENTRY_MODE`,
   `SENTRY_ENVIRONMENT`, `SENTRY_TRACES_SAMPLE_RATE`)
6. Define `recordInputs`/`recordOutputs` PII policy for MCP wrapping —
   curriculum queries may contain student-related context; align with
   `docs/governance/safety-and-security.md`

### Phase 2: Workspace Integration

Each workspace integration includes both `Sentry.init()` and
`Sentry.wrapMcpServerWithSentry()` for MCP apps. `Sentry.init()` **must**
run before MCP server creation. `tracesSampleRate` must be > 0.

1. Wire Sentry into `oak-curriculum-mcp-streamable-http` (primary deployment)
   — wrap the `McpServer` inside `McpServerFactory` (`application.ts:185`)
2. Wire Sentry into `oak-search-cli`
3. Evaluate Sentry for `oak-curriculum-mcp-stdio` (stdout is reserved for MCP
   protocol; file sink + Sentry sink may be the right combination) — wrap
   the `McpServer` in `server.ts:62`

### Phase 3: Deployment and Alerting

1. Create Sentry project under `oak-national-academy` org
2. Configure DSN and source map uploads for Vercel
3. Define initial alerting thresholds
4. Verify end-to-end: error in app → Sentry issue with trace context
5. Verify MCP Insights dashboard (`Insights > AI > MCP`) populates with tool
   call metrics, latency percentiles, error rates, and client identification

## Dependencies

- Logger DI foundation: **ready** (established 2026-02-23)
- OTel-compliant log format: **ready** (ADR-051)
- Correlation ID → TraceId conversion: **ready**
- Sentry org access: **requires Oak infrastructure team**

## Cross-References

- Parent plan: [observability-and-quality-metrics.plan.md](../observability-and-quality-metrics.plan.md)
- Archived guidance: `docs/agent-guidance/archive/sentry-guidance.md`
- Reference implementation: `~/code/personal/starter-app-spike/`
- ADR-051: OpenTelemetry-compliant logging format
- ADR-078: Dependency injection for testability
- [high-level-plan.md](../../high-level-plan.md) — Milestone 3, stream 3
- [Sentry MCP Monitoring docs](https://docs.sentry.io/ai/monitoring/mcp/)
- [Sentry Node.js MCP instrumentation](https://docs.sentry.io/platforms/javascript/guides/node/tracing/instrumentation/mcp-module/)
- Sentry MCP Insights dashboard: `oak-national-academy.sentry.io/insights/mcp/`
