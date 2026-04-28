---
title: Data Warehouse Selection — Choosing the Second Sink for Long-Term Analytical SQL
date: 2026-04-19
status: active
informs:
  - '.agent/plans/observability/future/second-backend-evaluation.plan.md'
  - 'docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md (re-frame to three-sink architecture)'
constraints:
  - ADR-160 (non-bypassable redaction barrier — closure principle)
  - ADR-162 (observability-first; vendor independence)
  - ADR-143 (coherent structured fan-out)
  - ADR-154 (framework-from-consumer separation)
  - ADR-078 (per-request DI; composition-root carve-out)
---

# Data Warehouse Selection

**Status**: Stub. Authored 2026-04-19 in response to the owner-confirmed
architectural commitment that _some_ analytical-SQL data warehouse will
sit downstream of the redaction barrier as the second sink (after
Sentry, before any product-analytics tool).

Informs the three-sink architectural framing in
[`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
and the corresponding section in
[Exploration 1 (Sentry vs PostHog)](./2026-04-18-sentry-vs-posthog-capability-matrix.md).

---

## 1. Problem statement

Oak's MCP server emits structured events (per
[ADR-162](../architecture/architectural-decisions/162-observability-first.md))
that today flow only to stdout (baseline) and to Sentry (engineering
sink). The owner has confirmed (2026-04-19 session) that a
**data-warehouse adapter** is a non-negotiable architectural component
post-MVP, independent of any product-analytics-tool decision.

The intent is durable, cross-source analytical SQL — joining MCP
session data with curriculum metadata, search query logs, and any
other Oak-org analytics streams the pipeline collects. This is a
different shape of question from interactive product analytics
(funnels, retention, replay) and from engineering observability
(traces, errors, alerts).

The design question: **which warehouse?** The candidates are not yet
narrowed; the constraints are clear (EU data residency, ADR-160
closure compliance, vendor-neutral schema input from
`packages/core/observability-events/`, low operational overhead for a
small engineering team).

---

## 2. Scope (for full analysis when authored)

The scope splits into **identity-independent selection criteria**
(can be researched in parallel with the Clerk-identity ruling) and
**identity-sensitive admissibility checks** (the final cut depends
on the ruling). Most warehouse research is identity-independent.

### 2.a Identity-independent selection criteria

- Candidate warehouses: BigQuery, Snowflake, Databricks, ClickHouse
  Cloud, Redshift, Postgres + dbt, MotherDuck. Cross-Oak-org existing
  use is a strong signal weighting.
- Loading model: streaming ingest vs micro-batch vs OTel-collector
  routed export vs native exporter.
- Schema model: how the events workspace's Zod schemas project into
  warehouse tables; column versioning; nullable evolution.
- Cost model: storage + query + ingest, modelled at three traffic
  tiers matching the
  [Sentry vs PostHog cost model](./2026-04-18-sentry-vs-posthog-capability-matrix.md#q6--what-are-the-licence-cost-and-data-residency-implications-of-emitting-identical-structured-events-to-both).
- Compliance baseline: GDPR processor terms, EU data residency,
  SOC 2 / ISO 27001 (these are vendor-shape questions, not
  identity-shape questions).
- Operational shape: who owns the warehouse, how it's accessed, how
  ingest health is monitored.

### 2.b Identity-sensitive admissibility checks

- Identity envelope: how the redaction-policy ruling on Clerk
  identity (see
  [companion exploration](./2026-04-19-redaction-policy-clerk-identity-downstream.md))
  shapes whether identified or anonymous events are loaded.
- BAA scoping (only material if the identity ruling permits any
  identifying context to flow into the warehouse).
- Data-subject-rights propagation: how a deletion request reaches
  the warehouse for any identifying field permitted by the ruling.

The shortlist, cost, residency, ingest shape, schema projection, and
operational ownership in §2.a can all be evaluated before the ruling
in [Exploration 10](./2026-04-19-redaction-policy-clerk-identity-downstream.md)
lands. The ruling gates only the final-cut admissibility checks in
§2.b.

---

## 3. Research questions

1. Which warehouse is already in use elsewhere in the Oak org? A
   shared warehouse reduces procurement, governance, and cross-team
   query overhead. (BigQuery is the org-preferred candidate raised
   in the owner conversation; verify cross-Oak-org usage and any
   alternatives before anchoring on it.)
2. Does the chosen warehouse expose an OpenTelemetry-compatible
   ingest path, or is the natural shape a custom exporter inside a
   `@oaknational/<warehouse>-exporter` adapter package?
3. What is the minimum viable shape for the first warehouse adapter
   — does it ship the full MVP event set (seven schemas), a curated
   subset (just `tool_invoked` + `search_query`), or a single event
   for proof-of-life?
4. How does the warehouse adapter satisfy the multi-sink
   vendor-independence conformance test (the
   [vendor-independence conformance test shape exploration](./2026-04-18-vendor-independence-conformance-test-shape.md),
   numbered Exploration 8 in the high-level observability plan's
   [Explorations Map](../../.agent/plans/observability/high-level-observability-plan.md#explorations-map))
   — does it require new RuleTester cases for
   `no-vendor-observability-import`, or does the allowlist mechanism
   cover it?
5. What is the redaction-policy posture for Clerk user IDs flowing
   into the warehouse? Settled by
   [companion exploration](./2026-04-19-redaction-policy-clerk-identity-downstream.md);
   this exploration consumes that ruling.
6. Does the warehouse double as the storage substrate for _any_
   later product-analytics tool's reverse-ETL, or is the
   product-analytics tool a parallel sink?

---

## 4. Informs

- [`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
  — the strategic brief naming the warehouse adapter as Sink 2 in
  the three-sink architecture.
- [Exploration 1 (Sentry vs PostHog)](./2026-04-18-sentry-vs-posthog-capability-matrix.md)
  — the warehouse changes the framing from "Sentry vs PostHog" to
  "Sentry + warehouse + PostHog as adapters on a single vendor-neutral
  pipeline".
- [`current/observability-events-workspace.plan.md`](../../.agent/plans/observability/current/observability-events-workspace.plan.md)
  — the schemas the warehouse adapter consumes; vendor-neutral
  posture is the criterion to preserve.
- [`current/multi-sink-vendor-independence-conformance.plan.md`](../../.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md)
  — the conformance scope expands when this sink lands.
- [Companion exploration: Clerk identity downstream](./2026-04-19-redaction-policy-clerk-identity-downstream.md)
  — settles whether the warehouse receives identified or anonymous
  events.

---

## 5. Promotion trigger for full authorship

The exploration is authored in full when **any one of** the following
fires:

- Public-beta launch nears (per the owner's sequencing: warehouse
  lands at public beta) and the warehouse-adapter plan needs a
  named target.
- Cross-Oak-org engineering signal confirms or contradicts the
  org-preferred-candidate weighting (BigQuery is named today; the
  signal may surface another candidate already in active use).
- A specific data-scientist question is named that requires
  cross-source SQL not satisfied by Sentry Insights alone.

---

## 6. References

- [ADR-162 Observability-First](../architecture/architectural-decisions/162-observability-first.md)
  — vendor-independence clause; sink-agnostic schema discipline.
- [ADR-160 Non-Bypassable Redaction Barrier](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
  — closure principle; every fan-out path applies the redaction
  policy.
- [ADR-143 Coherent Structured Fan-Out](../architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
  — the sink-and-redaction architecture this adapter composes into.
- [Exploration 1 (Sentry vs PostHog)](./2026-04-18-sentry-vs-posthog-capability-matrix.md)
  — the now-three-sink framing.
- [Exploration 4 (event schemas)](./2026-04-18-structured-event-schemas-for-curriculum-analytics.md)
  — the schema input to the warehouse loader.
- [Companion exploration: Clerk identity downstream](./2026-04-19-redaction-policy-clerk-identity-downstream.md)
  — identity envelope ruling.
- [`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
  — three-sink strategic brief.
