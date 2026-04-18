---
name: "Search Observability"
overview: >
  Deliver end-to-end observability for Oak's semantic search estate: the
  Search CLI (indexing, admin, evaluation), the Elasticsearch cluster
  (query performance, index health, zero-hit telemetry), and the search
  path through the HTTP MCP server. Covers Sentry runtime enablement for
  the CLI, Elasticsearch operations monitoring, retrieval quality
  observability, and trace propagation across the search data path.
parent_plan: "sentry-otel-integration.execution.plan.md"
depends_on:
  - "sentry-otel-integration.execution.plan.md"
supersedes: "sentry-cli-observability-extension.plan.md (renamed and expanded 2026-04-16)"
todos:
  # === SEARCH CLI SENTRY RUNTIME ===
  - id: cli-logger-di-remediation
    content: "Complete ADR-078 logger singleton remediation via createSearchLogger(config) composition-root factory rollout"
    status: pending
    priority: next
    note: "15 files import logger singletons directly. Remediation: createSearchLogger(config) factory at composition root. ~15-file refactor."
  - id: cli-context-completeness
    content: "Thread command/index/version context into all CLI command families (admin, eval, ingest, utility)"
    status: pending
    priority: next
  - id: cli-preload-decision
    content: "Run explicit preload decision for CLI execution paths with maintainability gate"
    status: pending
  - id: cli-source-map-strategy
    content: "Define source map strategy for bundled CLI distributions and CI execution contexts"
    status: pending
  # === ELASTICSEARCH OPERATIONS OBSERVABILITY ===
  - id: es-propagation
    content: "Enable and verify trace propagation for Oak-controlled Elasticsearch targets"
    status: pending
    priority: next
    note: "Moved from archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md (now succeeded by sentry-observability-maximisation-mcp.plan.md) EXP-C1. Applies to both CLI and HTTP search paths."
  - id: es-request-instrumentation
    content: "Add request/response instrumentation on the Elasticsearch client for latency, error rate, and timeout tracking"
    status: pending
    priority: next
    note: "Currently ES client uses internal logging only. SDK captures 'took' from responses but does not trace requests."
  - id: bulk-operation-monitoring
    content: "Add failure rate, retry tracking, and field-level audit observability to bulk indexing operations"
    status: pending
    note: "Bulk ingestion stats exist (counts) but no failure rates, retry tracking, or per-batch error capture."
  - id: index-health-observability
    content: "Surface index health, alias topology, and lifecycle state as observable metrics"
    status: pending
    note: "assessAliasHealth() exists in SDK but results are not captured in telemetry."
  # === RETRIEVAL QUALITY OBSERVABILITY ===
  - id: zero-hit-mcp-integration
    content: "Integrate SDK zero-hit recording into HTTP MCP server search tools"
    status: pending
    note: "SDK provides recordZeroHit() and persistence to ES, but MCP tools do not call it."
  - id: retrieval-latency-tracking
    content: "Capture and surface retrieval latency distributions across search paths"
    status: pending
    note: "ES 'took' is captured in responses but not persisted or traced as metrics."
  - id: search-quality-metrics
    content: "Track hit counts, score distributions, and result quality indicators over time"
    status: pending
  # === CLI METRICS AND EVIDENCE ===
  - id: cli-metrics
    content: "Add CLI command metrics using adapter-level Sentry metrics surface"
    status: pending
    note: "Depends on archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md (now succeeded by sentry-observability-maximisation-mcp.plan.md) EXP-A (metrics foundation)."
  - id: cli-ops-evidence
    content: "Produce search observability evidence checklist and runbook updates"
    status: pending
---

# Search Observability

## Role

This plan delivers end-to-end observability across Oak's semantic search
estate so search operations are diagnosable, search quality is
measurable, and Elasticsearch health is visible. It covers four
layers:

1. **Search CLI runtime** — Sentry enablement for the CLI process
   (indexing, admin, evaluation commands)
2. **Elasticsearch operations** — request instrumentation, trace
   propagation, bulk operation monitoring, index health
3. **Retrieval quality** — zero-hit integration, latency tracking,
   search quality metrics
4. **CLI metrics and evidence** — command execution metrics,
   operational evidence and runbooks

## Motivation

The Search CLI and Elasticsearch operations are currently the least
observable part of the system. The CLI has baseline Sentry init and
shutdown but lacks complete command context, logger DI compliance,
and metrics. Elasticsearch calls from both the CLI and the HTTP MCP
server have no request-level instrumentation — `took` is captured in
responses but not traced. The SDK's zero-hit recording mechanism
exists but is not wired into the MCP server's search tools. Index
health assessment exists but results are not captured in telemetry.

## Relationship to Other Plans

- **Parent**: `sentry-otel-integration.execution.plan.md` (shared
  foundation authority)
- **Peer**: `archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md (now succeeded by sentry-observability-maximisation-mcp.plan.md)` (MCP server
  expansion — metrics foundation, MCP context enrichment, profiling,
  source maps, alerting, strategy)
- **Dependency**: EXP-A (metrics foundation) must land before CLI
  metrics can consume the adapter surface

This plan absorbs the Elasticsearch trace propagation track (formerly
EXP-C1 in the MCP expansion plan) because propagation is a search
infrastructure concern, not MCP-specific.

---

## Layer 1: Search CLI Sentry Runtime

### CLI-0 — ADR-078 Logger DI Remediation

Complete the direct-import logger singleton remediation so CLI
observability composition is ADR-078-compliant.

- Introduce `createSearchLogger(config)` from the composition root
- Remove or isolate direct singleton imports across ~15 CLI modules
- Regression tests proving command-level logger composition

### CLI-CTX — Command Context Completeness

Ensure all CLI command families attach consistent context for triage:
admin, evaluation, ingest, and utility flows. Standardise tags and
context keys. Any CLI error in Sentry must be attributable to command
family and mode.

### CLI-PRELOAD — Preload Decision

Resolve with a maintainability-governed decision. Options: no preload
(current), selective preload for stable entrypoints, or wrapper
launcher script. Decision documented with rationale and rollback path.

### CLI-SRCMAP — Source Map Strategy

Define whether CLI bundles require automated source-map upload for
readable stack traces in CI and packaged contexts. Align release
identity with parent-plan release resolution contract.

---

## Layer 2: Elasticsearch Operations Observability

### ES-PROP — Trace Propagation to Elasticsearch

Enable and verify trace propagation for Oak-controlled Elasticsearch
targets. Prove trace continuity from CLI root span and HTTP request
span through to Elasticsearch dependency spans. This applies to both
the CLI (ingest, admin, eval) and the HTTP MCP server (search
retrieval).

Moved from `archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md (now succeeded by sentry-observability-maximisation-mcp.plan.md)` EXP-C1.

### ES-INST — Request/Response Instrumentation

Add observability to the Elasticsearch client so every ES call is
traceable:

- Request latency (start to response)
- HTTP status and error classification
- Timeout detection (`timed_out` from ES responses)
- Slow-query identification (configurable threshold)

Currently the ES client uses internal logging only. The SDK captures
`took` from search responses but does not instrument the request
lifecycle. The `@sentry/node/preload` hook on the HTTP server will
auto-instrument outbound HTTP when propagation is enabled, but the
CLI path needs explicit instrumentation.

### ES-BULK — Bulk Operation Monitoring

Extend bulk indexing observability beyond counts:

- Per-batch success/failure rates
- Retry tracking (count, backoff duration)
- Field-level validation audit (malformed documents)
- Batch timing distributions

Existing: `bulk-ingestion-stats.ts` tracks file/lesson/unit counts.
`ingest-harness-metrics.ts` tracks sequence facet metrics with
durations. Gap: no failure rates, no retry tracking, no per-batch
error capture in telemetry.

### ES-HEALTH — Index Health Observability

Surface index lifecycle state as observable telemetry:

- Alias health (from existing `assessAliasHealth()`)
- Index version and blue/green state
- Document counts and freshness indicators
- Lifecycle rollback events

Existing: `assessAliasHealth()` and `index-meta.ts` provide the data
but results are logged, not captured in structured telemetry.

---

## Layer 3: Retrieval Quality Observability

### RQ-ZERO — Zero-Hit MCP Integration

Wire the SDK's `recordZeroHit()` into the HTTP MCP server's search
tools so zero-hit events from live MCP queries are captured:

- In-memory event store (SDK provides, max 200 events)
- Optional persistence to Elasticsearch
- Scope, query, filters, index version, `tookMs`, `timedOut`

Existing: SDK provides `createObservabilityService()` with
`recordZeroHit()`, `getRecentZeroHits()`, `getZeroHitSummary()`, and
`fetchTelemetry()`. The CLI `observe` commands consume this. Gap: the
HTTP MCP server does not call `recordZeroHit()`.

Note: this track modifies the HTTP MCP server but is owned by the
search plan because the concern is retrieval quality observability,
not MCP-specific instrumentation. The change wires SDK search
observability into the server's search tools — the value is search
quality visibility, not MCP protocol behaviour.

### RQ-LAT — Retrieval Latency Tracking

Capture and surface retrieval latency distributions:

- ES `took` values as Sentry metric distributions
- End-to-end retrieval latency (SDK call to response)
- Breakdown by search scope (lessons, units, sequences)

### RQ-QUALITY — Search Quality Metrics

Track result quality indicators over time:

- Hit count distributions per query type
- RRF score distributions
- Result-set size trends
- Correlation with zero-hit rates

---

## Layer 4: CLI Metrics and Evidence

### CLI-MET — CLI Command Metrics

Emit command execution counters and key latency distributions.
Depends on `archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md (now succeeded by sentry-observability-maximisation-mcp.plan.md)` EXP-A (metrics
foundation).

- Command-start and command-complete counters
- Distribution metrics for ingest phase durations
- Bounded attribute set: command name, index target, outcome

### CLI-EVID — Operational Evidence

Date-stamped evidence checklist, runbook updates for command-failure
triage, and minimal alert suggestions for recurring CLI failure
signatures.

---

## Sequencing

```text
Layer 1 (CLI runtime prerequisites):
  1. CLI-0  (logger DI remediation — unblocks clean composition)
  2. CLI-CTX (command context — unblocks triage)

Layer 2 (Elasticsearch operations — can parallel Layer 1 after CLI-0):
  3. ES-PROP (trace propagation — foundational for all ES observability)
  4. ES-INST (request instrumentation — depends on ES-PROP)
  5. ES-BULK + ES-HEALTH (operational monitoring — parallel)

Layer 3 (retrieval quality — can start after ES-INST):
  6. RQ-ZERO (zero-hit integration)
  7. RQ-LAT + RQ-QUALITY (quality metrics — parallel)

Layer 4 (CLI metrics and evidence — after EXP-A lands):
  8. CLI-MET (depends on metrics foundation from MCP expansion)
  9. CLI-PRELOAD + CLI-SRCMAP (decision tracks — any time)
  10. CLI-EVID (last — after signal is live)
```

## Non-Goals

1. Browser-side Sentry or client-side search observability
2. Relaxing `sendDefaultPii: false` or deny-by-default propagation
3. Replacing existing search-contracts or field-inventory mechanisms
4. Duplicating MCP-specific observability (owned by the expansion plan)
