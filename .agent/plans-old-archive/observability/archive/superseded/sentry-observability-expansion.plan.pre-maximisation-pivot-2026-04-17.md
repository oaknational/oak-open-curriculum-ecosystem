---
name: "Sentry Observability Expansion"
overview: >
  Capture the full post-baseline Sentry capability envelope for Oak's Node
  runtimes so no meaningful observability opportunity is lost after HTTP MCP
  live-path alignment. This plan owns the expansion scope intentionally removed
  from the narrowed child plan and maps each item to executable tracks.
parent_plan: "sentry-otel-integration.execution.plan.md"
depends_on:
  - "sentry-otel-integration.execution.plan.md"
source_references:
  - "archive/superseded/sentry-canonical-alignment.plan.pre-value-reframe-2026-04-15.md"
  - "archive/completed/sentry-canonical-alignment.plan.md"
todos:
  - id: track-a-metrics-foundation
    content: "Add adapter-level Sentry metrics surface (count, gauge, distribution) and metric redaction hook"
    status: pending
    priority: next
  - id: track-b-mcp-context-enrichment
    content: "Define and wire mcp_request context enrichment policy for error triage"
    status: pending
    priority: next
  - id: track-c1-propagation-es
    content: "Enable and verify trace propagation for Oak-controlled Elasticsearch targets"
    status: dropped
    note: "Moved to search-observability.plan.md (ES-PROP). Elasticsearch propagation is a search infrastructure concern, not MCP-specific."
  - id: track-c2-propagation-third-party
    content: "Run security-gated propagation decision for non-Oak third-party hosts (including Oak API)"
    status: pending
  - id: track-d-profiling
    content: "Benchmark and decide on @sentry/profiling-node rollout strategy"
    status: pending
  - id: track-e-source-maps
    content: "Automate source map upload with Debug IDs and deployment proof"
    status: pending
  - id: track-f-alerting-and-ops
    content: "Define initial alerting, dashboards, and operational runbook standards for Sentry data"
    status: pending
  - id: track-g-option-architecture
    content: "Record explicit option analysis for Sentry-only, dual-export, and minimal-operational modes"
    status: pending
---

# Sentry Observability Expansion

## Role

This plan restores the intentionally removed expansion scope so the narrowed
HTTP child plan can stay focused without losing capability intent. It is the
authoritative backlog for "full possible gamut" Sentry work across the Node
runtime estate.

## Scope Recovery Commitments

The following removed items are explicitly owned here:

1. `custom-metrics`
2. `mcp-request-context`
3. `trace-propagation-oak-api`
4. `profiling-evaluation`
5. `source-maps-automation` (implementation strategy and evidence shape; final
   deployment authority remains in parent plan WS6)

`trace-propagation-es` was part of the removed scope initially, but ownership
has now moved to `search-observability.plan.md` as ES-PROP.

## Related Plans and Dependencies

Downstream consumer plan:
`search-observability.plan.md`.

Execution dependency policy:

1. Tracks in this plan are not globally blocked by completion of
   `sentry-canonical-alignment.plan.md`.
2. Only track-specific dependencies apply (for example, CLI metrics consume the
   adapter surface from EXP-A).

## EXP-A — Metrics Foundation

### Objective

Provide first-class Sentry metrics through the adapter so HTTP and CLI can
record business and operational counters without bypassing DI boundaries.

### Deliverables

1. Extend `SentryNodeSdk` and `SentryNodeRuntime` with a narrow metrics surface:
   `count`, `gauge`, `distribution`.
2. Add `beforeSendMetric` support in shared redaction policy.
3. Provide fixture-mode metric recording for test assertions.
4. Publish a metrics naming convention (`oak.<runtime>.<feature>.<metric>`).

### Acceptance

1. Off mode is noop, fixture mode is capturable, sentry mode emits.
2. Metric attributes are narrow and typed (no `unknown` bags).
3. At least one HTTP and one CLI metric are visible and queryable in Sentry.

## EXP-B — MCP Context Enrichment

### Objective

Improve triage speed by adding targeted context to error events without
capturing payload bodies or violating redaction doctrine.

### Deliverables

1. Define a schema for `mcp_request` context fields.
2. Add context population at handler boundaries.
3. Add tests proving safe omission of arguments/body payloads.

### Acceptance

1. Sentry issues include `mcp_request` context when relevant.
2. No MCP request or response body content is present.

## EXP-C — Distributed Trace Propagation

### EXP-C1 (Oak-controlled hosts) — MOVED

Moved to `search-observability.plan.md` (ES-PROP). Elasticsearch
propagation is a search infrastructure concern that applies to both
the CLI and the HTTP server.

### EXP-C2 (third-party hosts)

Run a security review for non-Oak hosts (including Oak API from this
MCP service boundary perspective) before any propagation allowlist
addition.

### Acceptance

1. C2: explicit allow/deny decision is documented with reviewer
   attribution.

## EXP-D — Profiling

### Objective

Decide with evidence whether CPU profiling should be enabled in production
runtime(s). Default scope is the HTTP runtime; CLI profiling remains out of
scope unless explicitly reopened with evidence.

### Deliverables

1. Benchmark with and without `@sentry/profiling-node` under representative
   load.
2. Define rollout policy (always-on, env-gated, or deferred).
3. Validate runtime compatibility in deployment target.

### Acceptance

1. Performance overhead and value trade-off are documented with measured data.
2. Decision recorded as implemented policy, not open-ended note.

## EXP-E — Source Maps and Debug IDs

### Objective

Guarantee readable production stack traces through automated source map upload.

### Deliverables

1. Choose upload mechanism (Vercel integration, sentry-cli, or bundler plugin)
   with Debug ID support.
2. Ensure release/source map linkage evidence is captured in deployment bundle.
3. Add failure detection so missing uploads fail the release pipeline.

### Acceptance

1. Production error stack traces resolve to TypeScript source.
2. Evidence bundle includes proof of successful source map processing.
3. Parent plan WS6 remains the merge-readiness gate for deployment evidence.

## EXP-F — Alerting and Operations

### Objective

Turn telemetry into operational value with baseline alerts and dashboards.

### Deliverables

1. Baseline alerts for unhandled exceptions, MCP tool failure spikes, and
   latency regressions.
2. Dashboard panels for HTTP MCP health and CLI ingestion stability.
3. Runbook additions for triage ownership and escalation paths.

### Acceptance

1. Alert rules exist, are tested, and routed to agreed channels.
2. Runbook contains response flow and verification steps.

## EXP-G — Options and Strategy

### Objective

Prevent accidental lock-in or scope drift by explicitly evaluating options.

### Option set to evaluate

1. **Sentry-first mode**: keep Sentry as primary telemetry surface.
2. **Dual-export mode**: retain Sentry while adding selective OTLP export for
   external analysis.
3. **Minimal-operational mode**: keep only baseline traces/errors and reject
   higher-cost features.

### Acceptance

1. Each option has documented cost, complexity, and operational impact.
2. A selected strategy is recorded with rationale and review attribution.

## Sequencing

1. Track A first (unlocks metrics consumers consistently).
2. Track B next (C1 moved to search-observability.plan.md as ES-PROP).
3. Track D and E after baseline deployment credentials are complete.
4. Track F after A-E signal is live.
5. Track G closes with a strategy decision before broad rollout.

## Non-Goals

1. Reopening the narrowed HTTP child-plan scope
   (`sentry-canonical-alignment.plan.md`).
2. Adding browser-side Sentry runtime features.
3. Altering redaction doctrine (`sendDefaultPii: false` remains invariant).
