---
name: "Sentry CLI Observability Extension"
overview: >
  Extend Search CLI observability beyond baseline command tracing so CLI
  incidents are diagnosable with the same confidence as the HTTP MCP runtime.
  This plan owns the CLI-specific capability work removed from the narrowed
  child plan, including explicit decisions on preload, metrics, propagation,
  and operational evidence.
parent_plan: "sentry-otel-integration.execution.plan.md"
depends_on:
  - "sentry-canonical-alignment.plan.md"
  - "sentry-observability-expansion.plan.md"
todos:
  - id: b0-cli-logger-di-remediation
    content: "Complete ADR-078 logger singleton remediation via createSearchLogger(config) composition-root factory rollout"
    status: pending
    priority: next
  - id: b1-cli-metrics
    content: "Add CLI command metrics using adapter-level Sentry metrics surface"
    status: pending
    priority: next
  - id: b2-cli-propagation
    content: "Evaluate and implement CLI propagation policy for Elasticsearch calls"
    status: pending
  - id: b3-cli-preload-decision
    content: "Run explicit preload decision for CLI execution paths with maintainability gate"
    status: pending
  - id: b4-cli-context-completeness
    content: "Thread command/index/version context into all CLI command families"
    status: pending
    priority: next
  - id: b5-cli-source-map-strategy
    content: "Define source map strategy for bundled CLI distributions and CI execution contexts"
    status: pending
  - id: b6-cli-ops-evidence
    content: "Produce CLI observability evidence checklist and runbook updates"
    status: pending
---

# Sentry CLI Observability Extension

## Role

This plan restores explicit CLI scope so narrowing the HTTP child plan does not
accidentally freeze Search CLI observability maturity.

## Scope Recovery Commitments

The following removed items are explicitly owned here:

1. `cli-metrics`
2. `cli-early-init` (as a decision track, not an implicit requirement)
3. CLI portions of `trace-propagation-es`
4. CLI-focused continuation of source-map and release evidence
5. Completion of command-context coverage across all entry points

## CLI-1 — CLI Metrics

### Objective

Record command execution counters and key latency distributions for operational
monitoring and regression detection.

### Deliverables

1. Emit command-start and command-complete counters.
2. Emit distribution metrics for ingest phase durations.
3. Include bounded attribute set: command name, index target, outcome.

### Acceptance

1. Metrics appear in sentry mode and are fixture-capturable in tests.
2. No sensitive args or payload fragments are emitted as attributes.

## CLI-2 — CLI Propagation Policy

### Objective

Decide and implement whether CLI-originated Elasticsearch calls should carry
trace context under the same deny-by-default doctrine.

### Deliverables

1. Add explicit CLI propagation config path for Oak-controlled ES host(s).
2. Verify trace linkage from CLI root span to Elasticsearch dependency span.
3. Document why non-ES third-party propagation remains denied by default.

### Acceptance

1. One representative CLI command shows trace continuity to Elasticsearch.
2. Policy and defaults are documented in CLI runtime docs.

## CLI-3 — CLI Preload Decision

### Objective

Resolve the earlier preload disagreement by replacing binary yes/no framing with
a maintainability-governed decision.

### Options

1. **No preload (current baseline)**: keep explicit manual spans only.
2. **Selective preload for stable entrypoints**: apply `--import
   @sentry/node/preload` only where invocation surface is centrally owned.
3. **Wrapper launcher script**: one managed script controls preload rather than
   per-script flags.

### Decision gate

Choose the option that gives measurable signal gain without brittle script
sprawl or hidden infrastructure coupling.

### Acceptance

1. Decision is documented with rationale and rollback path.
2. If preload is chosen, ownership and update policy are explicit.

## CLI-4 — Context Completeness

### Objective

Ensure all CLI command families attach consistent context for triage.

### Deliverables

1. Cover admin, evaluation, ingest, and utility command flows.
2. Standardise tags and context keys.
3. Add regression tests for context population by command family.

### Acceptance

1. Any CLI error in Sentry can be attributed to command family and mode quickly.

## CLI-5 — CLI Source Map and Release Strategy

### Objective

Avoid unreadable stack traces in CI and packaged execution contexts.

### Deliverables

1. Document where CLI errors are expected to be triaged from Sentry.
2. Decide whether CLI bundles require automated source-map upload.
3. Align CLI release identity with parent-plan release resolution contract.

### Acceptance

1. Chosen strategy is tested and evidenced for at least one CLI failure case.

## CLI-0 — ADR-078 Logger DI Remediation

### Objective

Finish the previously identified direct-import logger singleton remediation so
CLI observability composition remains ADR-078-compliant.

### Deliverables

1. Introduce and use `createSearchLogger(config)` from the composition root.
2. Remove or isolate direct singleton imports across CLI command modules.
3. Add regression tests that prove command-level logger composition works without
   global mutable coupling.

### Acceptance

1. The remediation note from `cli-logger-di-audit` is closed by implementation,
   not just investigation.

## CLI-6 — Operational Evidence

### Objective

Make CLI observability verifiable as part of release readiness.

### Deliverables

1. Date-stamped CLI evidence checklist.
2. Runbook updates for command-failure triage flow.
3. Minimal alert suggestions for recurring CLI failure signatures.

### Acceptance

1. Evidence artefacts are scrubbed and linked from parent-plan evidence lane.

## Sequencing

1. CLI-0 first (composition-root logger remediation baseline).
2. CLI-4 next (complete context baseline).
3. CLI-1 next (metrics, dependent on
   `sentry-observability-expansion.plan.md` EXP-A).
4. CLI-2 and CLI-3 in parallel decision lanes.
5. CLI-5 then CLI-6 before release readiness sign-off.

## Non-Goals

1. Replacing the existing CLI observability baseline.
2. Adding browser-only Sentry capabilities.
3. Relaxing redaction and deny-by-default propagation doctrine.
