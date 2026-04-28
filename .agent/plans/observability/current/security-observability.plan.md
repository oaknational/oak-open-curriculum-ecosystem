---
name: "Security Observability"
overview: >
  Application-layer security observability for the MCP server: auth_failure
  emission at the trust boundary (Clerk → MCP handler), rate_limit_triggered
  emission (rate limiting already shipped per ADR-158). Explicit non-goals:
  transport/bot/DDoS observability — Cloudflare's layer. Depends on
  exploration 6 (Cloudflare+Sentry complementarity) for scope boundary
  refinement.
derived_from: feature-workstream-template.md
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
strategic_parent: "observability/future/sentry-observability-maximisation.plan.md"
blocked_on:
  - "observability-events-workspace.plan.md (for schema definitions — 2026-04-20: events-workspace is beta-gate, which makes this plan beta-gate too; does NOT block public alpha)"
  - "docs/explorations/2026-04-18-cloudflare-plus-sentry-security-observability.md (informs boundary)"
release_gate: public-beta
todos:
  - id: ws1-red
    content: "WS1 (RED): auth_failure + rate_limit_triggered emission-site contract tests; assert emissions conform to schemas from observability-events workspace."
    status: pending
    priority: next
  - id: ws2-green
    content: "WS2 (GREEN): wire emissions at Clerk trust boundary + existing rate-limit middleware; compose conformance helper into tests."
    status: pending
  - id: ws3-refactor
    content: "WS3 (REFACTOR): runbook entry; cross-reference ADR-158 and ADR-160 redaction boundary."
    status: pending
  - id: ws4-quality-gates
    content: "WS4: pnpm check exit 0."
    status: pending
  - id: ws5-adversarial-review
    content: "WS5: security-reviewer (trust-boundary shape, PII redaction of auth fields) + clerk-reviewer (Clerk error-path enumeration) + sentry-reviewer."
    status: pending
  - id: ws6-doc-propagation
    content: "WS6: security runbook; ADR-158 cross-references; event catalog updates."
    status: pending
isProject: false
---

# Security Observability

**Last Updated**: 2026-04-18
**Status**: 🟡 PLANNING — depends on observability-events workspace + exploration 6
**Scope**: Application-layer auth_failure + rate_limit_triggered emission. Transport/bot/DDoS observability is explicitly Cloudflare's layer.

---

## Context

Per [ADR-162](../../../../docs/architecture/architectural-decisions/162-observability-first.md)
§Security Axis and the
[direction-setting session report](../../../../docs/explorations/2026-04-18-observability-strategy-and-restructure.md#5-5-security-axis-mvp-lightly-scoped),
security observability at the application layer is lightly scoped: auth-
failure patterns and rate-limit-triggered patterns. Everything else (bot
detection, DDoS, anomalous-traffic analysis) is already handled at
[Cloudflare](../../../../docs/architecture/architectural-decisions/158-multi-layer-security-and-rate-limiting.md).

### Problem Statement

Authentication failures today surface as Clerk errors intercepted by
`packages/libs/mcp-auth/` middleware (per
[ADR-054](../../../../docs/architecture/architectural-decisions/054-tool-level-auth-error-interception.md));
the interception is for error-shape normalisation, not security
observability. A persistent pattern of auth failures against a specific
tool or origin is not today separately observable. Rate-limit triggers
are logged but not emitted as structured events.

### Existing Capabilities

- Clerk auth middleware with error interception (ADR-054).
- Rate-limiting middleware (ADR-158; 6 routes, 3 profiles).
- Redaction barrier (ADR-160) already scrubs PII from any fan-out.
- Logger fan-out (ADR-143) ready to carry structured events.

---

## Design Principles

1. **Categorical, not value-level** — emit the categorical shape
   (origin tier, tool name, rate-limit profile) but not the triggering
   identity or payload per ADR-160.
2. **Trust boundary is the emission point** — auth failure emits from
   the middleware that intercepts the Clerk error, not from downstream
   handlers. Matches [PDR-013](../../../practice-core/decision-records/PDR-013-grounding-and-framing-discipline.md)
   ground-before-framing: read the interception root first.
3. **Cloudflare is the transport-security layer** — this plan emits
   only application-layer signal. Exploration 6 refines the split.
4. **No new auth paths** — instrumentation only, no change to
   authorisation decisions.

**Non-Goals** (YAGNI):

- Bot detection, DDoS signals — Cloudflare.
- User-identity tracking in security events — ADR-160 forbids PII
  leakage; we track cardinality of failed identities, not the
  identities themselves.
- Alert tuning — `observability/future/security-observability-phase-2.plan.md`
  (which this plan feeds) owns alert-rule shape.

---

## Dependencies

**Blocking**:

- `observability-events-workspace.plan.md` — `auth_failure` and
  `rate_limit_triggered` schemas live there.
- Exploration 6 — refines Cloudflare/app boundary; MVP emission set
  may shrink if Cloudflare data proves sufficient for a slice.

**Related**:

- `sentry-observability-maximisation-mcp.plan.md § L-13` — alert rules
  consume security emissions.
- `observability/future/security-observability-phase-2.plan.md` —
  post-MVP expansion (Cloudflare integration, SonarCloud, decoration).

---

## WS1 — Emission Contract Tests (RED)

### 1.1: `auth_failure` emission

**Test**: `auth-failure-emission.integration.test.ts` — hits a Clerk-
protected tool with an invalid token; asserts the interceptor middleware
emits a conformant `auth_failure` event (shape from the events
workspace) with only categorical fields.

### 1.2: `rate_limit_triggered` emission

**Test**: `rate-limit-emission.integration.test.ts` — exercises the
rate-limit path to exhaustion; asserts emission of a conformant
`rate_limit_triggered` event.

### 1.3: Redaction boundary enforcement

**Test**: `security-event-redaction.unit.test.ts` — asserts that
emitted events never carry identity tokens or payload bodies (ADR-160
redaction applied).

**Acceptance**: tests compile and fail for "emission call not present".

---

## WS2 — Emission Wiring (GREEN)

### 2.1: `auth_failure` emission

**File**: `packages/libs/mcp-auth/src/error-interceptor.ts` (or its
equivalent).

**Change**: on Clerk error interception, emit via logger + Sentry using
`@oaknational/observability-events` schemas. Field selection: origin
tier (categorical), tool name, error class. **Not** the caller identity.

### 2.2: `rate_limit_triggered` emission

**File**: rate-limiting middleware from ADR-158 wiring.

**Change**: on trigger, emit via the same fan-out. Field selection:
profile name, route tier, trigger count. **Not** the client identifier.

### 2.3: Compose conformance helper

Every emission-site test imports `assertEventConformance` from the
events workspace and applies it to the captured event.

---

## WS3 — Documentation and Polish (REFACTOR)

### 3.1: Runbook entry

`docs/operations/security-runbook.md` (new) or extension to an existing
runbook — triage flow for auth-failure spike, rate-limit spike.

### 3.2: Cross-references

- ADR-158 Related section updated to name this plan.
- ADR-162 §Five Axes Security row updated.
- Event catalog in `observability-events` workspace updated.

---

## WS4 — Quality Gates

```bash
pnpm check
```

Exit 0.

---

## WS5 — Adversarial Review

- `security-reviewer` — trust-boundary correctness; PII redaction of
  auth fields; cardinality of emitted values.
- `clerk-reviewer` — completeness of Clerk error-path enumeration.
- `sentry-reviewer` — emission wiring; alert-rule fit.

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Identity leaks into security events | Conformance test asserts redaction; security-reviewer verifies. |
| Cloudflare + app double-coverage creates noise | Exploration 6 defines the boundary; MVP scope accepts minor overlap. |
| Rate-limit emission fires at high volume during attack → cost | Emission path uses the logger sink model (stdout + Sentry); Sentry `beforeSendMetric` sampling can cap if needed. |
| Auth-middleware changes while this plan drafts | Ground-before-framing per PDR-013; WS2 re-reads the interceptor before wiring. |

---

## Foundation Alignment

- ADR-054 — tool-level auth-error interception (the seam we hook).
- ADR-158 — multi-layer security; this plan emits app-layer observability.
- ADR-160 — redaction barrier mandatory.
- ADR-162 — security axis coverage.

---

## Documentation Propagation

- Security runbook.
- Event catalog updates.
- ADR-162 §Five Axes Security entry.

---

## Consolidation

Run `/jc-consolidate-docs`. No new pattern candidates expected.

---

## Acceptance Summary

1. `auth_failure` + `rate_limit_triggered` events emit at the correct
   trust-boundary points.
2. All emission sites compose the conformance helper.
3. Runbook entry exists.
4. Exploration 6 integration boundary reflected in this plan body.
5. `pnpm check` exit 0.
