---
name: "Synthetic Monitoring"
overview: >
  External uptime probe + external working probe (executes one MCP tool call
  end-to-end) against the production HTTP MCP server. Scheduled cron. Alerts
  on failure route to Slack + email. Closes the gap that internal-only
  observability cannot detect a fully-deployed-but-broken service from the
  outside.
derived_from: feature-workstream-template.md
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
strategic_parent: "observability/future/sentry-observability-maximisation.plan.md"
blocked_on:
  - "Tool-selection decision: Sentry cron-monitor vs third-party uptime probe vs custom Vercel cron. Small exploration stub sufficient; exploration in Phase 3."
todos:
  - id: ws1-red
    content: "WS1 (RED): probe-contract tests (uptime + working probe) fail because no probe runner is wired."
    status: pending
    priority: next
  - id: ws2-green
    content: "WS2 (GREEN): minimal probe runner + cron wiring + alert routing implemented; tests pass."
    status: pending
  - id: ws3-refactor
    content: "WS3 (REFACTOR): runbook entry; ADR-162 operational-axis cross-reference; README for probe authorship."
    status: pending
  - id: ws4-quality-gates
    content: "WS4: pnpm check exit 0; probe smoke test against local stub."
    status: pending
  - id: ws5-adversarial-review
    content: "WS5: sentry-reviewer + architecture-reviewer-fred (probe-tool decision boundary) + assumptions-reviewer (is external probe overkill for public beta)."
    status: pending
  - id: ws6-doc-propagation
    content: "WS6: runbook; high-level observability plan; alert rules list."
    status: pending
isProject: false
---

# Synthetic Monitoring

**Last Updated**: 2026-04-18
**Status**: 🟡 PLANNING — queued; tool-selection decision pending
**Scope**: External uptime probe + external working probe for the production MCP server. Alerts on failure to Slack + email. Statuspage integration deferred to `observability/future/statuspage-integration.plan.md`.

---

## Context

[ADR-162](../../../../docs/architecture/architectural-decisions/162-observability-first.md)
§5.6 of the
[direction-setting session report](../../../../docs/explorations/2026-04-18-observability-strategy-and-restructure.md#5-6-operational-axis-mvp)
sets synthetic monitoring as MVP with minimum scope "external uptime probe +
external working-probe (executes one MCP tool call end-to-end)". The
working-probe contract is critical: uptime probes detect "is the socket
open?"; working probes detect "is the service actually usable?"

### Problem Statement

Internal tracing (Sentry wrapping, redaction barrier, release linkage) all
operate inside the deployed process. A service that deploys cleanly but
fails to execute one MCP tool call end-to-end is invisible to internal
observability until a user reports the failure. Synthetic monitoring
closes this gap.

### Existing Capabilities

- `apps/oak-curriculum-mcp-streamable-http/smoke:dev:stub` already
  exercises an end-to-end tool call against the local stub; the probe
  shape is reusable.
- Sentry alerts route to `#sentry-alert-testing` (rule 521866 validated
  2026-04-17); the alert channel exists.
- Vercel cron exists as platform primitive.

---

## Design Principles

1. **Probe runs from outside the deployed process** — internal
   observability already covers internal failure; the probe's job is
   catching fully-deployed-but-broken.
2. **Working probe beats uptime probe** — a 200 from `/healthz` is not
   the right signal; a successful `tools/list` + one tool-call round-trip
   is.
3. **Failure alert routes to Slack + email** — Statuspage integration is
   deferred per A.3 decisions.
4. **Probe cost is bounded** — per [ADR-161](../../../../docs/architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md)
   this runs outside PR-check CI; on a cron cadence chosen to balance
   signal vs vendor cost.

**Non-Goals** (YAGNI):

- Multi-region probes (public beta scope).
- Statuspage publication — owned by `observability/future/statuspage-integration.plan.md`.
- SLO calculation from probe data — owned by
  `observability/future/slo-and-error-budget.plan.md`.
- Widget-side synthetic probes (widget load is covered by product signal).

---

## Dependencies

**Blocking**:

- Tool-selection decision: Sentry cron-monitor vs third-party uptime
  probe vs custom Vercel cron. Small exploration stub sufficient;
  decision finalises at Phase 3.

**Related**:

- `sentry-observability-maximisation-mcp.plan.md § L-7` — release
  linkage gives probe failures a deploy attribution.
- `observability/future/slo-and-error-budget.plan.md` — consumer of
  probe history.
- `observability/future/customer-facing-status-page.plan.md` — consumer
  of probe status.

---

## WS1 — Probe Contract Tests (RED)

All tests MUST FAIL at the end of WS1.

### 1.1: Working-probe contract

**Test**: `synthetic-monitoring.integration.test.ts` — asserts the probe
runner, given a healthy local stub, returns `ok: true` with a captured
tool-call outcome; given an unhealthy stub (server down / tool returns
error), returns `ok: false` with a structured failure reason.

### 1.2: Alert-routing contract

**Test**: `synthetic-alert-routing.unit.test.ts` — asserts a failed probe
result produces an alert payload of the expected shape (Slack + email
destinations, correlation-id, probe type, failure reason).

**Acceptance**: tests compile and fail for "probe runner not exported".

---

## WS2 — Probe Implementation (GREEN)

All tests MUST PASS at the end of WS2.

### 2.1: Probe runner

**File**: TBD after tool-selection decision. Sketch for the Vercel-cron
option:

```typescript
// apps/oak-curriculum-mcp-streamable-http/src/probes/working-probe.ts
export async function runWorkingProbe(config: ProbeConfig): Promise<ProbeResult> {
  // 1. fetch /.well-known/oauth-protected-resource
  // 2. initialise MCP client
  // 3. call one tool (get-key-stages)
  // 4. validate response shape
  // 5. return {ok, duration, details, emittedAt}
}
```

### 2.2: Cron wiring

Cron cadence: every 5 minutes (subject to Phase 3 refinement — cost vs
signal trade-off discussion).

### 2.3: Alert routing

Alert rule configured to the same Slack channel as alert 521866
(`#sentry-alert-testing`) + an email destination TBD.

---

## WS3 — Documentation and Polish (REFACTOR)

### 3.1: Runbook

Extension to `docs/operations/sentry-deployment-runbook.md` — "Synthetic
probe failure: triage" section.

### 3.2: Cross-references

- ADR-162 §Enforcement Operational axis — cross-link this plan.
- High-level observability plan § Plan Map — entry.

---

## WS4 — Quality Gates

```bash
pnpm check
```

Exit 0, no filtering.

---

## WS5 — Adversarial Review

- `sentry-reviewer` — probe shape; alert rule correctness; cost exposure.
- `architecture-reviewer-fred` — probe-tool decision boundary (third-party
  vs Vercel-native vs Sentry-cron); dependency direction.
- `assumptions-reviewer` — is a 5-minute working-probe overkill for
  public beta? Is email-alert destination validated with owner?

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Probe cadence too tight → cost / noise | Start at 5-min; dashboard-track the false-positive rate; halve cadence if noise >5% of alerts. |
| Third-party vendor lock-in via probe tooling | Probe runner interface is provider-neutral (fetch + JSON-RPC client); vendor is the cron scheduler only. |
| Probe shadows real outage (e.g. tests the stub, not prod) | Probe targets production URL explicitly; test environment uses stub. |
| Alert destination not owned | WS5 assumptions-reviewer flags; owner confirms destination before WS2 close. |

---

## Foundation Alignment

- ADR-161 (network-free PR-check CI boundary) — probe explicitly runs
  outside PR checks.
- ADR-162 — operational axis coverage.
- ADR-143 — probe observations themselves emit via the fan-out sink
  model.

---

## Documentation Propagation

- Runbook section at ws3 close.
- High-level observability plan.
- ADR-162 §Enforcement operational-axis references.

---

## Consolidation

Run `/jc-consolidate-docs`. Candidate pattern: **working-probe-beats-uptime-probe**
if it survives another context validation.

---

## Acceptance Summary

1. Production probe runs on a fixed cadence and emits structured results.
2. Probe failure produces an alert to Slack + email.
3. Probe history is queryable for 30 days (minimum for post-launch SLO
   work to consume).
4. Runbook entry exists and references this plan.
5. `pnpm check` exit 0.
