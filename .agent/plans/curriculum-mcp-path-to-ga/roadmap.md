---
title: "Curriculum MCP Path-to-GA Programme"
type: strategic-index
status: active
last_updated: 2026-05-26
foundational_adrs:
  - "docs/architecture/architectural-decisions/112-per-request-mcp-transport.md"
  - "docs/architecture/architectural-decisions/117-plan-templates-and-components.md"
  - "docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md"
  - "docs/architecture/architectural-decisions/162-observability-first.md"
  - "docs/architecture/architectural-decisions/171-observability-configuration-orthogonal-axes.md"
informs:
  - ".agent/milestones/README.md"
  - ".agent/plans/high-level-plan.md"
  - ".agent/plans/observability/high-level-observability-plan.md"
purpose: >
  Thin coordination layer sequencing the work needed to take the Oak
  Curriculum MCP HTTP server (apps/oak-curriculum-mcp-streamable-http)
  from current state (M2 in progress) to General Availability. Indexes
  sub-plans and milestone gates; owns no execution.
---

# Curriculum MCP Path-to-GA Programme

**Status**: 🔄 Active strategic index
**Scope**: Cross-collection coordination for the Curriculum MCP HTTP server release arc.

This file indexes the milestone gates, sub-plans, and paperwork backlog that take the MCP app from M1 (invite-only alpha, complete) through M2 (open public alpha, in progress) and M3 (public beta, planned) to General Availability. Per ADR-117 it is a strategic index — execution detail belongs in the sub-plans referenced here.

---

## 1. Context

"GA" for the Curriculum MCP HTTP server means sustained production use by teachers and education professionals via third-party AI hosts (Claude, ChatGPT, Cursor) with full five-axis observability, privacy-compliant analytics, production Clerk authentication, current MCP specification, and operational alerting/DSAR runbooks in place. M3 (public beta) is the immediate gate; M4/GA is undefined and surfaced in §6 as a paperwork-backlog item.

A programme is needed because the MCP app's path crosses every plan collection (observability, security-and-privacy, sdk-and-mcp-enhancements, compliance, architecture-and-infrastructure) and nothing else sequences them against a single release target. This document does that sequencing and nothing else. **It owns no work**: every sub-plan it references is independently owned.

---

## 2. End goal · mechanism · means (PDR-018)

**End goal.** MCP HTTP server at GA on production Clerk, with full five-axis observability emitting on documented schemas via the ADR-160 redaction barrier; identified product analytics flowing through DPIA-covered processors; the MCP `2026-07-28` specification adopted; alerting and DSAR runbooks operational; user-facing widget experience accessible and instrumented.

**Mechanism.** Milestone-gated progression M1 → M2 → M3 → GA with explicit acceptance criteria per axis. Each axis is owned by a domain-shaped collection; this programme indexes and sequences them but does not duplicate their content.

**Means.** Cross-collection sub-plans listed in §5 plus the gated paperwork backlog in §6. Owner-direction gates (named in §6) keep substantial paperwork from accumulating ahead of evidence.

---

## 3. Milestone matrix

| Milestone | Status | Owning gates | Owning sub-plans (selection) | Blocker |
|---|---|---|---|---|
| **M0** Open Private Alpha | ✅ Complete (2026-02-15) | Repo public; secrets/PII swept | Archived (see `.agent/plans/archive/`) | — |
| **M1** Invite-only Alpha | ✅ Complete (2026-03-03) | Dev Clerk + allowlist; server live | Archived | — |
| **M2** Open Public Alpha | 🔄 In progress (~95%) | ES re-index ✅; MCP Apps infra ✅; KG audit ✅; Sentry+OTel foundation IN PROGRESS; user-facing widget search UI NOT STARTED | [`observability/active/sentry-observability-maximisation-mcp.plan.md`](../observability/active/sentry-observability-maximisation-mcp.plan.md); [`sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`](../sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md) | Deployment evidence bundle + widget WS3/WS4 |
| **M3** Public Beta | 📋 Planned | Production Clerk; Cloudflare MCP security gate; alerting in place; exemplar UI; observability operationalised | [`security-and-privacy/future/cloudflare-mcp-public-beta-security-gate.plan.md`](../security-and-privacy/future/cloudflare-mcp-public-beta-security-gate.plan.md); production Clerk migration research at [`.agent/research/auth/clerk-production-migration.md`](../../research/auth/clerk-production-migration.md); [`security-and-privacy/roadmap.md`](../security-and-privacy/roadmap.md) | Cloudflare MCP security gate (named in `high-level-plan.md`) |
| **M4 / GA** | ⏳ TBD | **Undefined** — see §6 backlog item A4 | None yet | Owner direction to define |

Milestone definitions live at [`.agent/milestones/README.md`](../../milestones/README.md), [`m2-extension-surfaces.md`](../../milestones/m2-extension-surfaces.md), and [`m3-tech-debt-and-hardening.md`](../../milestones/m3-tech-debt-and-hardening.md). This programme does not redefine them.

---

## 4. Cross-cutting axes

| Axis | Launch criterion (paraphrased) | Owning collection | Status snapshot |
|---|---|---|---|
| **Observability (5 sub-axes)** | Per ADR-162: every runtime emits structured events on documented schemas covering engineering, product, usability, accessibility, security | [`observability/`](../observability/) | M2 engineering axis ~95%; M3 carries product/usability/accessibility/security |
| **Privacy & compliance** | DPIA register current for PostHog + Sentry + Clerk; legal notices updated; DSAR runbook tested; identified production analytics gated on §11.7 of `docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md` | [`security-and-privacy/`](../security-and-privacy/) | No execution plan yet — §6 backlog A2 |
| **Security** | Cloudflare MCP gate satisfied; auth + rate limiting at trust boundary; hallucination/evidence guards adopted | [`security-and-privacy/`](../security-and-privacy/) | Cloudflare gate is M3 hard blocker |
| **Performance** | Cold-start, fan-out cost, retry budget within Vercel runtime envelope | [`architecture-and-infrastructure/`](../architecture-and-infrastructure/) | No dedicated active plan |
| **Accessibility (widget)** | A11y telemetry emitting; WCAG 2.2 AA validated; widget keyboard-only flow tested | [`observability/current/accessibility-observability.plan.md`](../observability/current/accessibility-observability.plan.md); [`sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`](../sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md) | Accessibility observability plan queued; widget rebuild in progress |
| **MCP spec compliance** | Adopt MCP `2026-07-28` GA when published (decision A7, exploration §1.1) | [`sdk-and-mcp-enhancements/`](../sdk-and-mcp-enhancements/) (likely) or [`observability/`](../observability/) — collection choice deferred to A3 promotion | No execution plan yet — §6 backlog A3 |

---

## 5. Sub-plan inventory

Plans currently relevant to the MCP app's path to GA. Grouped by collection; status emoji follows each plan's own frontmatter at last_updated. **Not exhaustive** — each collection's `roadmap.md` / `README.md` is the authoritative inventory.

### `observability/`

**`active/`**

- [`sentry-observability-maximisation-mcp.plan.md`](../observability/active/sentry-observability-maximisation-mcp.plan.md) — 🟡 Wave 1 active; closes every Sentry product loop on MCP server + widget (17 lanes)

**`current/`**

- [`observability-events-workspace.plan.md`](../observability/current/observability-events-workspace.plan.md) — 🟡 Planning; Zod-first event-schema contract
- [`search-observability.plan.md`](../observability/current/search-observability.plan.md) — 🟡 Planning; end-to-end search estate observability
- [`security-observability.plan.md`](../observability/current/security-observability.plan.md) — 🟡 Planning; `auth_failure` + `rate_limit_triggered`
- [`accessibility-observability.plan.md`](../observability/current/accessibility-observability.plan.md) — 🟡 Planning; widget a11y telemetry
- [`multi-sink-vendor-independence-conformance.plan.md`](../observability/current/multi-sink-vendor-independence-conformance.plan.md) — 🟡 Planning; ADR-162 vendor-independence test

**`future/` (selection)**

- [`second-backend-evaluation.plan.md`](../observability/future/second-backend-evaluation.plan.md) — three-sink strategic brief (Sentry / warehouse / PostHog)
- [`cross-system-correlated-tracing.plan.md`](../observability/future/cross-system-correlated-tracing.plan.md) — W3C `traceparent` propagation
- [`mcp-http-runtime-canonicalisation.plan.md`](../observability/future/mcp-http-runtime-canonicalisation.plan.md) — runtime-shape simplification
- [`slo-and-error-budget.plan.md`](../observability/future/slo-and-error-budget.plan.md) — promotion trigger ≥30 days post-launch baseline

Cross-axis index: [`.agent/plans/observability/high-level-observability-plan.md`](../observability/high-level-observability-plan.md).

### `security-and-privacy/`

- [`security-and-privacy/roadmap.md`](../security-and-privacy/roadmap.md) — collection roadmap
- [`active/phase-0-foundation-and-baseline.md`](../security-and-privacy/active/phase-0-foundation-and-baseline.md) → [`active/phase-3-protocol-auth-and-tool-governance-baseline.md`](../security-and-privacy/active/phase-3-protocol-auth-and-tool-governance-baseline.md) — phased hardening
- [`future/cloudflare-mcp-public-beta-security-gate.plan.md`](../security-and-privacy/future/cloudflare-mcp-public-beta-security-gate.plan.md) — **M3 blocker**

### `sdk-and-mcp-enhancements/`

- [`active/mcp-app-extension-migration.plan.md`](../sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md) — MCP App widget rebuild (WS3 in progress, WS4 pending)
- [`current/clerk-mcp-tools-and-ext-apps-bumps.plan.md`](../sdk-and-mcp-enhancements/current/clerk-mcp-tools-and-ext-apps-bumps.plan.md) — Clerk + MCP Apps version bumps (M3 dependency)

### `compliance/`

- [`compliance/roadmap.md`](../compliance/roadmap.md) — collection roadmap
- [`current/claude-and-chatgpt-app-submission-compliance.plan.md`](../compliance/current/claude-and-chatgpt-app-submission-compliance.plan.md) — host-platform submission

### `architecture-and-infrastructure/`

- [`current/observability-strategy-restructure.plan.md`](../architecture-and-infrastructure/current/observability-strategy-restructure.plan.md) — restructure execution plan
- [`active/sentry-otel-integration.execution.plan.md`](../architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md) — cross-cutting Sentry+OTel foundation
- [`future/vercel-build-warning-elimination.plan.md`](../architecture-and-infrastructure/future/vercel-build-warning-elimination.plan.md) — runtime hygiene

### Cross-cutting threads (from repo-wide index)

- Knowledge Graph thread — see [`connecting-oak-resources/knowledge-graph-integration/`](../connecting-oak-resources/knowledge-graph-integration/README.md). KG alignment audit feeds M2/M3 gates.
- EEF Evidence thread — see [`.agent/plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../sector-engagement/eef/current/eef-evidence-corpus.plan.md). Sector-engagement story, M3+.

---

## 6. Open paperwork backlog

Owner-direction-gated artefacts that this programme tracks but does not author. Each row names the authorisation gate.

| # | Artefact | Scope (brief) | Gate |
|---|---|---|---|
| **A1** | MCP analytics execution plan promoted from `docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md` | `AnalyticsEnvelope` threading, `dependency_call` emission, PostHog Sink 3 adapter, Sentry §7.5 identity guards | Owner request (Jim) — explicitly deferred per exploration §15/§18 |
| **A2** | `security-and-privacy/future/mcp-analytics-privacy-gate.plan.md` (working name) | §11.7 hard gate: DPIA register, legal notice updates, DSAR/deletion runbook for PostHog + Sentry MCP projects | Owner + DPO |
| **A3** | MCP `2026-07-28` GA upgrade plan (collection TBD — likely `sdk-and-mcp-enhancements/`) | SDK + transport migration: stateless handshake removal, W3C `traceparent` ingestion via `_meta`, removed `Mcp-Session-Id`, JSON Schema 2020-12, error code changes | Spec GA (target 2026-07-28) + owner |
| **A4** | `.agent/milestones/m4-general-availability.md` (or equivalent) | Define M4/GA milestone gates: prod stability evidence, alerting in place, DSAR proven, observability operationalised, MCP spec current | Owner direction |
| **A5** | Exploration 10 formal ruling backfill at `docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md` | Per-sink Clerk identity projection ruling — unblocks identified production analytics | Owner + legal |

---

## 7. Decision register

Load-bearing decisions feeding this programme. Outbound links only; no content duplication.

- [`docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md`](../../../docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md) — Authoritative design record for MCP analytics (May 2026). §1.1 owner decisions; §7.5 Sentry identity guards; §11 privacy and compliance; §15 linking policy; §18 plan deferral.
- [PDR-018 Planning Discipline](../../practice-core/decision-records/PDR-018-planning-discipline.md) — end goal + mechanism + means; DECISION-COMPLETE as readiness gate.
- [ADR-117 Plan Templates and Components](../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md) — strategic-index shape; document hierarchy.
- [ADR-160 Non-bypassable redaction barrier](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md) — closure principle for every sink fan-out.
- [ADR-162 Observability-first](../../../docs/architecture/architectural-decisions/162-observability-first.md) — five-axis principle; vendor-independence clause.
- [ADR-171 Observability configuration orthogonal axes](../../../docs/architecture/architectural-decisions/171-observability-configuration-orthogonal-axes.md) — `OBSERVABILITY_SINKS` typed enum + `OBSERVABILITY_FIXTURES` boolean.
- [ADR-112 Per-request MCP transport](../../../docs/architecture/architectural-decisions/112-per-request-mcp-transport.md) — stateless transport, aligns with MCP `2026-07-28` direction.

---

## 8. Non-goals

- Owning execution. Every sub-plan in §5 is owned by its collection; this programme indexes, never executes.
- Duplicating sub-plan content. Status, scope, acceptance, and dependencies live in the sub-plan. This programme cites paths only.
- Gating sub-plans on its own existence. Sub-plans run independently of this index; staleness of the index never blocks their progress.
- Redefining milestone gates. Milestone definitions live at [`.agent/milestones/`](../../milestones/).
- Authoring §6 backlog items. Each is owner-direction-gated; this programme tracks the gate, not the artefact.

---

## 9. Update cadence and plan-body first-principles check

**Refresh triggers.**

- Milestone state transition (e.g. M2 closes → M3 opens).
- Sub-plan moves between `future/` → `current/` → `active/` → `archive/`.
- A §6 backlog item is authorised, completes, or is removed.
- A new ADR enters or supersedes the §7 decision register.

**Plan-body first-principles check** (per [`.agent/rules/plan-body-first-principles-check.md`](../../rules/plan-body-first-principles-check.md)) fires at every refresh boundary:

- **Shape** — is each indexed item a Programme concern, or has it drifted into the index without belonging here?
- **Landing-path** — do every referenced path and link resolve?
- **Vendor-literal** — do milestone / gate names match the current strings in [`.agent/milestones/README.md`](../../milestones/README.md) and the source sub-plan frontmatter?

**Named risk: staleness rot.** A strategic-index document atrophies if not pruned. Owner may call any row stale; refresh re-runs the FPC above.

---

## Related

- [`.agent/plans/high-level-plan.md`](../high-level-plan.md) — repo-wide strategic index
- [`.agent/plans/observability/high-level-observability-plan.md`](../observability/high-level-observability-plan.md) — observability cross-axis index
- [`.agent/milestones/README.md`](../../milestones/README.md) — milestone definitions
- [`docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md`](../../../docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md) — design record driving §6 backlog A1–A2
