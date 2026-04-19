---
title: "High-Level Observability Plan"
status: active
last_updated: 2026-04-19
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
direction_session: "docs/explorations/2026-04-18-observability-strategy-and-restructure.md"
execution_plan: ".agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md"
adr_162_status: "Accepted (2026-04-19)"
wave_1_state: "partially opened — require-observability-emission rule landed at warn; L-EH initial / L-DOC initial / L-12-prereq / L-7 pending"
---

# High-Level Observability Plan

Authoritative index for observability across the Oak Open Curriculum
Ecosystem. Every observability-related plan, ADR, and exploration is
reachable from here.

---

## Observability Principle (condensed from ADR-162)

Every runtime capability emits structured events covering the five
axes — **engineering, product, usability, accessibility, security** —
as applicable. Events are emitted in documented stable schemas the
downstream analytics pipelines depend on. Every emission passes
through the [ADR-160](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md) redaction barrier before any sink
receives it. Consumers couple to `@oaknational/observability` and
`@oaknational/observability-events`, never directly to vendor SDKs
(feature code; composition-root DI wiring carve-out per ADR-078).
Minimum functionality (stdout/err via `@oaknational/logger`) persists
in the absence of any third-party backend.

Full text: [ADR-162](../../../docs/architecture/architectural-decisions/162-observability-first.md).

---

## Five Axes — MVP Scope

| Axis | MVP deliverable | Owning plan | Post-MVP | Explorations informing |
|---|---|---|---|---|
| **Engineering** | Error capture + tracing + release linkage + free-signal integrations (ANR, event-loop delay, Zod validation failures) + widget error capture + alert suite + runbooks | [`active/sentry-observability-maximisation-mcp.plan.md`](active/sentry-observability-maximisation-mcp.plan.md) (L-0..L-13 lanes) | [`future/cross-system-correlated-tracing.plan.md`](future/cross-system-correlated-tracing.plan.md), [`future/deployment-impact-bisection.plan.md`](future/deployment-impact-bisection.plan.md), [`future/slo-and-error-budget.plan.md`](future/slo-and-error-budget.plan.md) | Exploration 2 (Sentry-as-PaaS) |
| **Product** | `packages/core/observability-events/` workspace + `tool_invoked` emission + `search_query` emission + event catalog | [`current/observability-events-workspace.plan.md`](current/observability-events-workspace.plan.md), [`current/search-observability.plan.md`](current/search-observability.plan.md) | [`future/curriculum-content-observability.plan.md`](future/curriculum-content-observability.plan.md), [`future/feature-flag-provider-selection.plan.md`](future/feature-flag-provider-selection.plan.md), [`future/ai-telemetry-wiring.plan.md`](future/ai-telemetry-wiring.plan.md), [`future/second-backend-evaluation.plan.md`](future/second-backend-evaluation.plan.md) (three-sink architecture: warehouse + PostHog) | Exploration 1 (Sentry vs PostHog), Exploration 4 (event schemas), Exploration 9 (warehouse selection), Exploration 10 (Clerk-identity downstream) |
| **Usability** | Tool-call success/failure breakdown + feedback capture (L-9) + `widget_session_outcome` events | [`active/sentry-observability-maximisation-mcp.plan.md`](active/sentry-observability-maximisation-mcp.plan.md) (L-9, L-12), [`current/observability-events-workspace.plan.md`](current/observability-events-workspace.plan.md) | Absorbed into SLO + accessibility-phase-2 lanes | Exploration 4 (stage vocabulary for session-outcome) |
| **Accessibility** | `a11y_preference_tag` + frustration proxies + incomplete-flow correlation + keyboard-only boolean | [`current/accessibility-observability.plan.md`](current/accessibility-observability.plan.md) | (open question; see exploration 3) | Exploration 3 (a11y at runtime — **blocks MVP**) |
| **Security** | `auth_failure` + `rate_limit_triggered` events | [`current/security-observability.plan.md`](current/security-observability.plan.md) | [`future/security-observability-phase-2.plan.md`](future/security-observability-phase-2.plan.md) | Exploration 5 (trace propagation), Exploration 6 (Cloudflare+Sentry), Exploration 7 (static analysis) |

Operational concerns (synthetic monitoring, vendor-independence
conformance) are cross-axis MVP and owned by:

- [`current/synthetic-monitoring.plan.md`](current/synthetic-monitoring.plan.md)
- [`current/multi-sink-vendor-independence-conformance.plan.md`](current/multi-sink-vendor-independence-conformance.plan.md)

---

## Launch Criteria

MVP criterion per the direction-setting session (§5): **on the day
public beta opens, a data scientist, an engineer, a product owner,
and an a11y reviewer can each answer their first-order questions
from telemetry alone.**

Concretely:

- **Data scientist** can answer "what is used most/least; what tools
  correlate with use of which others; which subjects/key-stages/
  keywords are most requested" from the events workspace emissions +
  the event catalog.
- **Engineer** can diagnose any runtime issue using tracing, release
  linkage, error capture, and alerts (ADR-162 engineering axis MVP
  set).
- **Product owner** can see tool-call outcome distribution, feedback
  capture, and widget-session-outcome trends — all from events
  workspace emissions.
- **A11y reviewer** can see preference-tag distribution, keyboard-
  only session share, and frustration-proxy incidence via
  `accessibility-observability.plan.md` emissions.

---

## MVP Gate Summary

**Pre-launch (launch-blocking)**:

- [`active/sentry-observability-maximisation-mcp.plan.md`](active/sentry-observability-maximisation-mcp.plan.md) — the maximisation plan's MVP-in lanes
  (L-0..L-4b, L-7, L-9, L-12, L-12-prereq, L-13, L-DOC initial/final,
  L-EH initial/final, L-15). See plan's own §MVP classification (landed
  in Phase 4 of the restructure) and §Execution Waves below for
  the authoritative cross-plan ordering.
- [`current/observability-events-workspace.plan.md`](current/observability-events-workspace.plan.md) — without this, product/usability/a11y/security
  axes have no schema contract.
- [`current/synthetic-monitoring.plan.md`](current/synthetic-monitoring.plan.md) — without this, internal-only observability cannot detect
  fully-deployed-but-broken.
- [`current/security-observability.plan.md`](current/security-observability.plan.md) — security-axis MVP.
- [`current/accessibility-observability.plan.md`](current/accessibility-observability.plan.md) — accessibility-axis MVP.
- [`current/multi-sink-vendor-independence-conformance.plan.md`](current/multi-sink-vendor-independence-conformance.plan.md) — proves ADR-162's vendor-
  independence clause programmatically.

**Post-launch (scheduled via promotion trigger)**:

- See [§ Plan Map](#plan-map) below.

---

## Execution Waves — Cross-plan MVP Order

**Authoritative cross-plan execution order** for the MVP observability
work (owner-approved 2026-04-18). The maximisation plan controls the
lane order of its own L-N sections; this table is the cross-plan index
that interleaves the maximisation lanes with the five sibling MVP
`current/` plans so the whole MVP envelope is ordered consistently.

**Architectural rationale**: schemas before emitters; rules before the
code they police; extracted cores before the emitters that use them;
release linkage before the smoke tests that benefit from it;
vendor-independence conformance runs pre-launch rather than post-hoc.

| Wave | Purpose | Work |
|------|---------|------|
| **1. Gates & Foundation Extractions** | Land compile-time gates and extract shared workspaces. Every line written after Wave 1 is gate-conformant at write-time. | Maximisation: L-0a / L-0b (done); L-EH initial (ESLint built-in `preserve-caught-error` at `warn` — supersedes original `require-error-cause` custom-rule plan; landed 2026-04-19); L-DOC initial (sentry-node README expansion + app observability doc); **L-12-prereq blocked 2026-04-19** by [`architecture-and-infrastructure/current/observability-primitives-consolidation.plan.md`](../architecture-and-infrastructure/current/observability-primitives-consolidation.plan.md) — scaffolded extraction surfaced core→lib boundary violation + over-decomposition; architecture review (fred + barney) resolved toward folding primitives into `@oaknational/observability` rather than a new core workspace; L-12-prereq becomes a trivial confirmation step once consolidation closes; **L-7 moved here** (release/deploy linkage scripts). Restructure Phase 5 carve-out: author `require-observability-emission` ESLint rule at `warn`; flip ADR-162 Proposed → Accepted. |
| **2. Schema Foundation** | Event-schema contract + vendor-independence structural lint. Every downstream-analytics obligation exists as code before any consumer imports it. | Sibling plan [`observability-events-workspace.plan.md`](current/observability-events-workspace.plan.md) WS1–WS6 — creates `packages/core/observability-events/` with Zod schemas for the 7 MVP events + conformance helper + event catalog. Sibling plan [`multi-sink-vendor-independence-conformance.plan.md`](current/multi-sink-vendor-independence-conformance.plan.md) WS1 carve-out — `no-vendor-observability-import` ESLint rule landed at `warn`; the emission-persistence test itself is Wave 5. |
| **3. Primary Emitters (Server)** | Server-side emission sites consume Wave 2 schemas by import. Each lane's RED asserts schema conformance via the events-workspace conformance helper. | Maximisation: L-1 (free-signal integrations with fixture envelope-observability prereq), L-2 (delegates extraction), L-3 (MCP request context enrichment), L-4b (primary `Sentry.metrics.*` adapter), L-9 (feedback pipeline + `submit-feedback` MCP tool). |
| **4. Cross-axis & Widget** | Second emitting runtime + axis-specific plans. Can parallelise within wave. | Maximisation: L-12 (widget Sentry; uses `telemetry-redaction-core`; emits widget-session-outcome and a11y events). Sibling plan [`security-observability.plan.md`](current/security-observability.plan.md) — `auth_failure`, `rate_limit_triggered` events. Sibling plan [`accessibility-observability.plan.md`](current/accessibility-observability.plan.md) — `a11y_preference_tag`, frustration proxies, `widget_session_outcome`. |
| **5. Operations + Conformance + Close-out** | Alerts can land because emission landscape is real. Vendor-independence conformance runs pre-launch. MVP-deferred lanes cluster for clean branch close. | Maximisation: L-13 (alerts + dashboards + runbooks), L-14 (trust-boundary ADR), L-15 (strategy close-out ADR), L-DOC final (per-loop TSDoc + ADR index + runbook propagation), L-EH final (`prefer-result-pattern` ESLint rule), MVP-deferred lanes: L-4a, L-5, L-6, L-10, L-11. Sibling plan [`multi-sink-vendor-independence-conformance.plan.md`](current/multi-sink-vendor-independence-conformance.plan.md) WS2+ — emission-persistence test runs MCP server + widget + Search CLI in `SENTRY_MODE=off`; Wave 5 escalates the ESLint rule severity to `error`. Sibling plan [`synthetic-monitoring.plan.md`](current/synthetic-monitoring.plan.md) — uptime + working-probe deployment. |

**Wave close semantics** (2026-04-18 per fred-review TO-ACTION —
cross-plan scheduling is only a real dependency if it is named):

- **Wave close** = every maximisation lane in the wave's row GREEN
  (per that lane's Acceptance section) AND every sibling `current/`
  plan listed in the wave GREEN (per its own Acceptance summary) AND
  the reviewer matrix for that wave discharged (findings ACTIONED or
  REJECTED with written rationale per PDR-012).
- **Cross-plan convener** = the maximisation plan owner. Sibling
  plans report readiness to the maximisation owner; the maximisation
  owner signals wave close. Consistent with A.3's single-PR
  commitment (one PR, one convener).
- **Slippage protocol**: if a sibling plan slips, the wave does not
  close and downstream waves do not open. The maximisation plan
  owner records the slip as a RISK row (not a silent deferral per
  PDR-012) and either (a) renegotiates wave contents with the owner,
  (b) promotes the slipping plan to a blocker explicitly, or (c)
  re-scopes the wave content. Slippage is a named event, not a
  silent delay.
- **Wave-to-wave handoff** = acceptance evidence for the closing
  wave is captured in the maximisation plan's Appendix A-equivalent
  (reviewer findings + ACTIONED/REJECTED disposition) before the
  next wave opens. No in-flight work crosses wave boundaries except
  where a lane explicitly spans waves (e.g., L-EH and L-DOC have
  "initial" in Wave 1 and "final" in Wave 5 — this is permitted; the
  initial-slice lane closes independently of the final-slice lane).

**PR boundary**: single PR on this branch for every lane + every
sibling MVP plan completed. A.3 settlement (single PR) is unchanged by
the reshape; waves are within-branch commit ordering, not PR
boundaries. The PR opens after Wave 5 closes.

**Search CLI mirror**: runs on the next branch post-merge. The Search
CLI maximisation plan will mirror the wave structure; its own current/
plan (`search-observability.plan.md`) interleaves into Wave 3 or Wave
4 of the next branch's execution order.

**Post-reshape rationale** (summary): pre-reshape ordering landed
emitters before schemas and ran compile-time gates after the code they
would have policed — both are retrofit-heavy architectural anti-
patterns. The reshape moves three things forward (events workspace
schemas; extracted telemetry-redaction-core; release linkage) and
moves two things later (MVP-deferred lanes cluster; operations
follow emission). Net effect: every emitter lands against stable
foundations, not moving targets.

---

## Plan Map

### `active/`

| Plan | One-line summary |
|---|---|
| [`sentry-observability-maximisation-mcp.plan.md`](active/sentry-observability-maximisation-mcp.plan.md) | MCP server + widget: close every Sentry product loop (17 lanes) |
| [`sentry-observability-translation-crosswalk.plan.md`](active/sentry-observability-translation-crosswalk.plan.md) | Lossless map from pre-pivot plan to current plan set |

### `current/`

| Plan | One-line summary |
|---|---|
| [`observability-events-workspace.plan.md`](current/observability-events-workspace.plan.md) | `packages/core/observability-events/` — Zod-first schema contract |
| [`synthetic-monitoring.plan.md`](current/synthetic-monitoring.plan.md) | External uptime + working-probe against production |
| [`security-observability.plan.md`](current/security-observability.plan.md) | App-layer auth-failure + rate-limit-triggered emission |
| [`accessibility-observability.plan.md`](current/accessibility-observability.plan.md) | Widget-side preference tags + frustration proxies + outcomes |
| [`multi-sink-vendor-independence-conformance.plan.md`](current/multi-sink-vendor-independence-conformance.plan.md) | Programmatic proof of ADR-162 vendor-independence clause |
| [`search-observability.plan.md`](current/search-observability.plan.md) | Search estate observability (CLI + ES + retrieval quality); next-branch MVP |

### `future/` (each with promotion trigger)

| Plan | Promotion trigger |
|---|---|
| [`ai-telemetry-wiring.plan.md`](future/ai-telemetry-wiring.plan.md) | First LLM-calling MCP tool lands |
| [`feature-flag-provider-selection.plan.md`](future/feature-flag-provider-selection.plan.md) | First A/B experiment proposed OR first feature-flag-using feature lands |
| [`cross-system-correlated-tracing.plan.md`](future/cross-system-correlated-tracing.plan.md) | Debug session shows the gap OR Search CLI obs merged + cross-system incident |
| [`curriculum-content-observability.plan.md`](future/curriculum-content-observability.plan.md) | First data-science request requiring curriculum-metadata joins |
| [`slo-and-error-budget.plan.md`](future/slo-and-error-budget.plan.md) | ≥30 days of post-launch baseline data collected |
| [`statuspage-integration.plan.md`](future/statuspage-integration.plan.md) | Readiness to publish operational state to external users |
| [`cost-and-capacity-telemetry.plan.md`](future/cost-and-capacity-telemetry.plan.md) | First cost-pressure OR capacity-risk event |
| [`deployment-impact-bisection.plan.md`](future/deployment-impact-bisection.plan.md) | L-7 release linkage stable + manual-regression-attribution event |
| [`second-backend-evaluation.plan.md`](future/second-backend-evaluation.plan.md) | Three-sink strategic brief. **Vendor decisions**: warehouse settled as load-bearing (vendor open per Exploration 9); PostHog settled as the vendor for Sink 3 (per owner ruling 2026-04-19; timing open). **Sequencing**: warehouse adapter lands before PostHog adapter — owner-confirmed hard blocker. **Triggers**: warehouse adapter at public-beta (after warehouse-choice + identity-policy explorations close); PostHog adapter post-public-beta on a named question; alternative engineering sink only on a named Sentry gap (from exploration 1 or 2) with evidence |
| [`customer-facing-status-page.plan.md`](future/customer-facing-status-page.plan.md) | Statuspage integration completes |
| [`security-observability-phase-2.plan.md`](future/security-observability-phase-2.plan.md) | Exploration 6 or 7 conclusions OR first app-level security incident |
| [`sentry-observability-maximisation.plan.md`](future/sentry-observability-maximisation.plan.md) | (Strategic parent brief across both runtimes; remains for cross-branch context) |

### `archive/superseded/`

| Plan | Archival note |
|---|---|
| [`sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md`](archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md) | Replaced by the maximisation plan 2026-04-17 |

---

## Explorations Map

Ten observability explorations at [`docs/explorations/`](../../../docs/explorations/).
Two are full-text (blocking Phase 2 scoping); six were stubs authored
in Phase 3 of the restructure; the Sentry-vs-PostHog stub was promoted
to a full-body capability matrix in 2026-04-18..-19; two further stubs
(warehouse selection; Clerk-identity redaction policy) landed
2026-04-19 as immediate consequences of the three-sink architectural
collapse.

| # | Exploration | Status | Informs |
|---|---|---|---|
| 1 | `2026-04-18-sentry-vs-posthog-capability-matrix.md` | Full-body (2026-04-19; three-sink reframe) | `future/second-backend-evaluation.plan.md` |
| 2 | `2026-04-18-how-far-does-sentry-go-as-paas.md` | Phase 3 stub | ADR-162; future lanes; `future/second-backend-evaluation.plan.md` (alternative-engineering-sink trigger) |
| 3 | `2026-04-18-accessibility-observability-at-runtime.md` | Phase 3 full | **blocks** `current/accessibility-observability.plan.md` |
| 4 | `2026-04-18-structured-event-schemas-for-curriculum-analytics.md` | Phase 3 full | **blocks** `current/observability-events-workspace.plan.md` MVP schema set |
| 5 | `2026-04-18-trust-boundary-trace-propagation-risk-analysis.md` | Phase 3 stub | `sentry-observability-maximisation-mcp.plan.md § L-14` + `future/cross-system-correlated-tracing.plan.md` |
| 6 | `2026-04-18-cloudflare-plus-sentry-security-observability.md` | Phase 3 stub | `current/security-observability.plan.md` scope; `future/security-observability-phase-2.plan.md` |
| 7 | `2026-04-18-static-analysis-augmentation.md` | Phase 3 stub | `future/security-observability-phase-2.plan.md` |
| 8 | `2026-04-18-vendor-independence-conformance-test-shape.md` | Phase 3 stub | `current/multi-sink-vendor-independence-conformance.plan.md` |
| 9 | `2026-04-19-data-warehouse-selection.md` | Stub (2026-04-19) | `future/second-backend-evaluation.plan.md` (warehouse-adapter sink-2 promotion trigger) |
| 10 | `2026-04-19-redaction-policy-clerk-identity-downstream.md` | Stub (2026-04-19) | ADR-160 closure-rule projection per sink; `future/second-backend-evaluation.plan.md` identity envelope; explorations 1 and 9 |

---

## Vendor-Independence Invariants

Per ADR-162, vendor-independence is tested programmatically by
[`current/multi-sink-vendor-independence-conformance.plan.md`](current/multi-sink-vendor-independence-conformance.plan.md).
The tests enumerate:

1. **Emission-persistence test** — MCP server + widget + Search CLI
   run in `SENTRY_MODE=off`; structural event information persists
   via stdout/err.
2. **Structural import lint** (`no-vendor-observability-import`) —
   ESLint rule; vendor SDK imports only permitted in adapter
   libraries, core observability packages, and composition-root
   files.

Both tests are authored in Phase 5 of the restructure plan as part of
ADR-162 flipping Proposed → Accepted.

The conformance scope **expands per sink** as the three-sink
architecture lands — warehouse adapter, then PostHog adapter — per
[`future/second-backend-evaluation.plan.md`](future/second-backend-evaluation.plan.md)
sequencing. Each adapter PR ships its own conformance allowlist
update + emission-persistence assertion update before merge.

---

## Three-Sink Architecture (Post-MVP Sink Sequencing)

The post-MVP observability pipeline fans out to three sinks via the
ADR-160 redaction barrier (closure principle):

1. **Sink 1 — Sentry** (engineering observability; today; owned by
   the maximisation plan).
2. **Sink 2 — Data warehouse** (durable analytical SQL; public-beta
   target; warehouse vendor open per
   [Exploration 9](../../../docs/explorations/2026-04-19-data-warehouse-selection.md)).
3. **Sink 3 — PostHog** (interactive product analytics; vendor
   settled on existing Oak-org usage per the owner ruling
   2026-04-19; adoption *timing* gated on a named question).

**Decision record (2026-04-19, summary)**: data warehouse is settled
as a load-bearing post-MVP sink (vendor open). PostHog is settled as
the vendor for Sink 3 (timing open). Warehouse adapter lands before
PostHog adapter — owner-confirmed hard blocker, not sequencing
preference. Full decision record:
[`future/second-backend-evaluation.plan.md` § Decision record](future/second-backend-evaluation.plan.md).

Identity envelope per sink is governed by the ruling in
[Exploration 10 (Clerk identity downstream)](../../../docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md).
Sequencing, triggers, and adapter shape are owned by
[`future/second-backend-evaluation.plan.md`](future/second-backend-evaluation.plan.md).
The three-sink framing supersedes the prior "Sentry vs PostHog"
binary; all three sinks share the same vendor-neutral Zod schemas
from
[`current/observability-events-workspace.plan.md`](current/observability-events-workspace.plan.md).

**Cardinality framing**: "three" is the *current roadmap*
cardinality, not an architectural ceiling. ADR-162's
vendor-independence clause is sink-cardinality agnostic; if a
fourth sink is later justified (e.g. a separate data-residency or
specialist-axis sink), it composes into the same architecture
without re-opening this section.

---

## Coordination Points With Non-Observability Workstreams

Observability emissions originate outside this directory tree. Key
coordination points:

| Emission site | Owned by | Emits |
|---|---|---|
| MCP tool handler boundary | `apps/oak-curriculum-mcp-streamable-http/` | `tool_invoked` |
| Search-result handler | `apps/oak-curriculum-mcp-streamable-http/` + `apps/oak-search-cli/` | `search_query` |
| Auth middleware | `packages/libs/mcp-auth/` | `auth_failure` |
| Rate-limit middleware | Existing rate-limit surface (ADR-158) | `rate_limit_triggered` |
| Widget load + session lifecycle | MCP App widget bundle | `a11y_preference_tag`, `widget_session_outcome` |
| Feedback tool (L-9) | MCP tool | `feedback_submitted` |

Each emission site's owning plan is responsible for:

1. Composing the `@oaknational/observability-events` conformance
   helper into its test suite.
2. Passing through the ADR-160 redaction barrier.
3. Respecting the composition-root carve-out per ADR-162.

---

## Related

- [Observability directory README](./README.md)
- [ADR-162 Observability-First](../../../docs/architecture/architectural-decisions/162-observability-first.md)
- [Direction-setting session report](../../../docs/explorations/2026-04-18-observability-strategy-and-restructure.md)
- [Observability strategy restructure plan](../../../.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md)
- [Repo-wide plan index](../high-level-plan.md)
- [Parent foundation plan](../architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md) (cross-cutting; not moved)
