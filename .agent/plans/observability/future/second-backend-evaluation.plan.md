---
name: "Three-Sink Architecture — Warehouse Adapter (Sink 2) + PostHog Adapter (Sink 3)"
status: strategic-brief
overview: >
  Strategic brief for the post-Sentry sink architecture. Following the
  2026-04-19 owner-confirmed direction, the post-MVP observability
  pipeline fans out to three sinks: Sentry (engineering, today), a
  data-warehouse adapter (durable analytical SQL, public-beta target),
  and a PostHog adapter (interactive product analytics, post-public-beta
  target gated on named questions). Each is a separate adapter
  consuming the vendor-neutral schemas in
  packages/core/observability-events/. This plan replaces the prior
  "second backend evaluation" framing — the question is no longer
  "should we add a second backend" but "in what order, and against
  which named triggers, do the warehouse and PostHog adapters land".
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
informing_explorations:
  - "docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md (three-sink framing)"
  - "docs/explorations/2026-04-19-data-warehouse-selection.md (warehouse choice)"
  - "docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md (identity envelope)"
  - "docs/explorations/2026-04-18-how-far-does-sentry-go-as-paas.md (Sentry-as-PaaS thesis)"
  - "docs/explorations/2026-04-18-vendor-independence-conformance-test-shape.md (conformance scope expansion)"
promotion_triggers:
  warehouse_adapter: "Public-beta launch nears AND warehouse choice settled (per docs/explorations/2026-04-19-data-warehouse-selection.md) AND redaction-policy ruling for warehouse identity envelope settled (per docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md)."
  posthog_adapter: "Public-beta traffic accumulated AND a named data-scientist or product-owner question is raised that PostHog-shaped surfaces (funnels, retention, paths, cohort replay, HogQL) answer materially better than Sentry Insights AND redaction-policy ruling for PostHog identity envelope settled."
  alternative_engineering_sink: "A specific Sentry-capability gap named (with evidence) in docs/explorations/2026-04-18-how-far-does-sentry-go-as-paas.md output, with evidence the gap blocks a concrete observability goal that the warehouse + PostHog combination does not also close."
---

# Three-Sink Architecture — Warehouse Adapter (Sink 2) + PostHog Adapter (Sink 3)

**Status**: 🔵 Strategic (not yet executable)
**Last Updated**: 2026-04-19
**Supersedes (in framing)**: prior "Second Backend Evaluation" brief — the question is no longer "should we dual-export" but "in what order do the warehouse and PostHog adapters land".

---

## Problem and Intent

[ADR-162](../../../../docs/architecture/architectural-decisions/162-observability-first.md)'s
vendor-independence clause structurally supports any number of sinks.
The 2026-04-19 owner conversation (recorded in
[`.agent/memory/active/napkin.md` § 2026-04-19 — Sentry vs PostHog overlay + canonical exploration body](../../../memory/active/napkin.md))
collapsed the prior "Sentry vs PostHog" framing into a
**three-sink architecture**:

1. **Sink 1 — Sentry** (engineering observability; today).
2. **Sink 2 — Data warehouse** (durable analytical SQL; public-beta
   target). Load-bearing per owner statement: "we will need to be
   able to send session data into a data analytics pipeline, possibly
   BigQuery, possibly something else." The warehouse is non-negotiable
   architecturally; the choice is
   [the subject of a dedicated exploration](../../../../docs/explorations/2026-04-19-data-warehouse-selection.md).
3. **Sink 3 — PostHog** (interactive product analytics;
   post-public-beta, gated on named questions). PostHog is already in
   use elsewhere in the Oak org; the owner statement (2026-04-19)
   that "we already use PostHog in other repos" is treated here as
   settling the **vendor** question for Sink 3. What remains gated on
   a named question is the **adoption timing**, not the vendor
   choice. Until a real question arrives that PostHog answers
   materially better than Sentry Insights or warehouse + thin BI, no
   PostHog adapter authoring work happens. The MVP usage question —
   "how many people are using the MCP and roughly for what" — is
   answerable from Sentry today via `wrapMcpServerWithSentry` traces
   plus tool-call distribution; PostHog is not a precondition for
   answering it.

The prior "second backend evaluation" framing implied a binary
add-or-not decision against an unnamed candidate set
(Datadog / Honeycomb / NewRelic / Grafana / self-hosted OTel). The
revised framing names the candidates, names the order, and ties each
to its own promotion trigger. The original engineering-observability
candidates remain available as a contingency under the
*alternative-engineering-sink* trigger if a Sentry-capability gap is
named that the warehouse + PostHog combination does not close.

**Cardinality framing**: "three" is the *current roadmap*
cardinality, not an architectural ceiling. ADR-162's
vendor-independence clause is sink-cardinality agnostic; if a
fourth sink is later justified (e.g. a separate data-residency or
specialist-axis sink), it composes into the same architecture
without re-opening this brief.

**Decision record (2026-04-19)**:

| Decision | Status | Owner-confirmed rationale |
|---|---|---|
| Data warehouse is a load-bearing post-MVP sink | **Settled** | Owner statement: "we will need to be able to send session data into a data analytics pipeline." Non-negotiable architecturally. |
| PostHog is the vendor for Sink 3 | **Settled** | Owner statement: "we already use PostHog in other repos." Existing Oak-org usage is the load-bearing rationale; cross-product procurement, governance, and familiarity overhead all already paid. |
| Warehouse adapter lands before PostHog adapter | **Settled (hard-blocker, owner-confirmed)** | Not merely sequencing preference. Owner confirmation 2026-04-19: warehouse-first is non-negotiable. The warehouse is the durable analytical-SQL substrate; PostHog interactive analytics layers on top of (or alongside) durable storage that already exists. Promoting PostHog before the warehouse would bypass the durable substrate the org needs for cross-source SQL. |
| Adoption *timing* for Sink 3 (PostHog) | **Open** | Gated on named question per the promotion trigger below. The vendor decision is settled; only the moment of authoring the adapter is open. |
| Warehouse vendor (Sink 2) | **Open** | Owned by [Exploration 9 (Data Warehouse Selection)](../../../../docs/explorations/2026-04-19-data-warehouse-selection.md). |
| Identity envelope per sink | **Open** | Owned by [Exploration 10 (Clerk identity downstream)](../../../../docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md). The ruling may be uniform across sinks or expressed as per-sink projection of the closure rule; the ADR-160 closure principle holds either way. |

## Architectural Shape

```text
Emission site (request handler / tool boundary / widget event)
        │
        ▼
@oaknational/observability-events  (vendor-neutral Zod schemas)
        │
        ▼
ADR-160 redaction barrier  (closure principle; uniform-or-per-sink projection per ruling)
        │
        ├──▶ Sink 1: Sentry adapter         (today; @oaknational/sentry-node)
        ├──▶ Sink 2: Warehouse adapter      (public-beta;  @oaknational/<warehouse>-exporter)
        └──▶ Sink 3: PostHog adapter        (post-beta;    @oaknational/posthog-exporter)
```

Each sink is an adapter package consuming the same vendor-neutral
schemas. None of the consumer code knows which sinks are wired —
selection happens at the composition root per ADR-078. The
[multi-sink vendor-independence conformance test](../current/multi-sink-vendor-independence-conformance.plan.md)
expands its allowlist + emission-persistence assertions as each new
sink lands.

## Domain Boundaries and Non-Goals

**In scope**:

- Warehouse adapter authoring (ingest model, schema projection,
  identity envelope per the redaction-policy ruling).
- PostHog adapter authoring (capture-payload mapping, distinct_id
  derivation, identity envelope per the redaction-policy ruling).
- Sequencing decisions: warehouse before PostHog; both after the
  redaction-core extraction (L-12-prereq in the maximisation plan).
- Cost / operational overhead assessment per adapter.
- Fallback contingency: alternative engineering sink (Datadog,
  Honeycomb, NewRelic, Grafana+Loki+Tempo, self-hosted OTel
  collector → DIY) if a Sentry-capability gap is named.
- Migration path if any adapter becomes primary for a slice of
  signal.

**Out of scope (non-goals)**:

- Replacing Sentry as the primary engineering sink — separate
  promotion if ever proposed.
- Building dashboards / queries / curated views on top of the
  warehouse — owned by downstream data consumers.
- PostHog-side product configuration (cohorts, experiments, surveys)
  — owned by product owners after the adapter lands.
- Choosing between identified and anonymous events — that is owned
  by the [redaction-policy ruling exploration](../../../../docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md);
  this plan consumes the ruling, it does not author it.

## Dependencies and Sequencing

**Pre-requisite for the warehouse adapter**:

- L-12-prereq in
  [`active/sentry-observability-maximisation-mcp.plan.md`](../active/sentry-observability-maximisation-mcp.plan.md)
  — **CLOSED 2026-04-19** via the observability-primitives-consolidation
  lane (primitives folded into `@oaknational/observability` rather than
  extracted to a new workspace; browser-safety structurally enforced).
  Downstream adapters compose the redaction primitives directly from
  `@oaknational/observability`.
- [`current/observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)
  — vendor-neutral schemas are the input the warehouse adapter
  consumes.
- [`docs/explorations/2026-04-19-data-warehouse-selection.md`](../../../../docs/explorations/2026-04-19-data-warehouse-selection.md)
  — warehouse choice settled.
- [`docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md`](../../../../docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md)
  — identity envelope ruling.

**Hard prerequisites for the PostHog adapter** (technical):

- [`current/observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)
  has landed (vendor-neutral schemas exist).
- L-12-prereq has closed (the redaction primitives live in
  `@oaknational/observability`; the closure-rule patterns the
  adapter composes exist as a reusable module there).
- The multi-sink vendor-independence conformance harness exists in
  code and the warehouse adapter has demonstrated a sink-addition
  pattern (PR-shape precedent).
- Identity-envelope ruling extends to PostHog (may differ from
  warehouse posture).
- A named data-scientist or product-owner question that PostHog
  answers materially better than Sentry Insights *or* than the
  warehouse + a thin BI tool.

**Owner-confirmed sequencing constraint** (non-negotiable):

- The warehouse adapter has landed before any PostHog adapter
  authoring begins. Owner confirmation 2026-04-19: this is a hard
  blocker, not a sequencing preference. Rationale: warehouse is the
  durable analytical-SQL substrate; PostHog layers interactive
  analytics on top of (or alongside) durable storage that already
  exists. Promoting PostHog first would bypass the durable substrate
  the org needs for cross-source SQL — the question PostHog answers
  ergonomically (cohort/funnel/retention/HogQL) is a different shape
  from the question the warehouse answers durably (cross-source
  SQL); both are needed, and the warehouse one is the foundation.

**Related**:

- ADR-162 (vendor-independence clause; sink-agnostic schema
  discipline).
- ADR-160 (closure principle; the redaction policy applies via the
  closure rule; whether the policy itself is uniform across sinks or
  expressed as per-sink projection is the open ruling owned by
  Exploration 10).
- ADR-143 (coherent structured fan-out — the architectural shape
  the adapters compose into).
- [`current/multi-sink-vendor-independence-conformance.plan.md`](../current/multi-sink-vendor-independence-conformance.plan.md)
  — conformance scope expands as each sink lands.
- [`future/cost-and-capacity-telemetry.plan.md`](./cost-and-capacity-telemetry.plan.md)
  — each sink adds cost; capacity model evolves.
- [`future/feature-flag-provider-selection.plan.md`](./feature-flag-provider-selection.plan.md)
  — PostHog hosts feature flags natively; if PostHog lands as Sink 3
  before a flag consumer arrives, the provider-selection plan's
  candidate set shifts.

## Success Signals

**Warehouse adapter (Sink 2)**:

- Public-beta launch ships with the warehouse adapter wired for at
  least the MVP event set (or a curated subset, per the warehouse-
  selection exploration's research question 3).
- Cross-source SQL queries joining MCP session data with curriculum
  metadata are runnable end-to-end.
- Vendor-independence conformance test passes with three sinks
  (stdout + Sentry + warehouse).

**PostHog adapter (Sink 3)**:

- A named data-scientist or product-owner question is answered on
  PostHog that was unanswerable (or ergonomically painful) on
  Sentry alone or on the warehouse alone.
- Cohort/funnel/retention/paths workflows are usable by the product
  owner without engineering support.
- Vendor-independence conformance test passes with four sinks
  (stdout + Sentry + warehouse + PostHog).

**Alternative engineering sink (contingency)**:

- A specific Sentry-capability gap is named with evidence the
  warehouse + PostHog combination cannot close.
- The chosen alternative measurably closes the named gap
  (before/after metric).

## Risks and Unknowns

| Risk | Mitigation |
|------|------------|
| Warehouse ingest cost grows faster than budget | Cost model with three traffic tiers in the warehouse-selection exploration; per-sink emission gating in the composition root. |
| Identity-envelope ruling drifts between sinks (Clerk ID flows to one but not another) | The redaction-policy ruling exploration ([Exploration 10](../../../../docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md)) holds three coherent positions open: anonymous-only, identified single-sink, identified all-sinks. The ADR-160 closure rule applies uniformly *to whatever the policy permits*; the question of whether the policy itself is uniform or per-sink is owned by the ruling, not assumed here. Non-uniform permits, if ruled, land in the ruling — possibly with an ADR clarification — not in the closure principle. |
| PostHog adapter lands before a real consumer question (premature optimisation) | Promotion trigger explicitly requires a *named* question, not a hypothetical one. PostHog-shaped capability is described in the [Sentry vs PostHog exploration](../../../../docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md) §4 — those become triggers when observed in real usage. |
| Three-sink operational complexity | Promotion scope per sink includes a concrete operational SLA (who owns it, who responds to its alerts, how ingest health is monitored). |
| Conformance test scope expansion lags adapter landing | Each adapter PR includes the conformance allowlist update + emission-persistence assertion update before merge. |
| Existing Oak-org PostHog usage anchors choice prematurely | The warehouse-selection exploration explicitly weighs cross-Oak-org existing use as a signal but does not treat it as binding for Sink 2. PostHog is already in scope for Sink 3 by owner statement. |

## Promotion Triggers

This plan splits into per-sink executable lanes. Each lane promotes on
its own trigger (frontmatter `promotion_triggers`):

**Warehouse adapter (Sink 2)** — fires when **all** are observable:

- Public-beta launch date is **scheduled and within 8 weeks** (or
  on a slower track: a named owner-approved date for warehouse
  ingest start exists in writing, regardless of public-beta
  proximity), AND
- Warehouse choice **recorded as a decision** in
  [`docs/explorations/2026-04-19-data-warehouse-selection.md`](../../../../docs/explorations/2026-04-19-data-warehouse-selection.md)
  (full body authored; chosen vendor named; cost model finalised),
  AND
- Identity-envelope ruling for the warehouse **recorded as a
  decision** in
  [`docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md`](../../../../docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md)
  or in a separate redaction-policy document referenced from
  ADR-160.

**When triggered**: move to `current/`. Author the warehouse adapter
plan; wire the exporter; update conformance scope.

**PostHog adapter (Sink 3)** — fires when **all** are observable:

- Warehouse adapter has shipped to production (the owner-confirmed
  hard-blocker constraint above), AND
- At least 4 weeks of post-public-beta retained telemetry exists
  (so the named question below can reference real data, not
  hypothetical scenarios), AND
- A **named** data-scientist or product-owner question is recorded
  in this plan (or a successor plan) with: (a) named requester,
  (b) the question text, (c) demonstration that the question
  cannot be answered within agreed time/fidelity using Sentry
  Insights or warehouse + thin BI, AND
- Identity-envelope ruling for PostHog **recorded as a decision**
  (may be the same ruling as for the warehouse, or a separate
  per-sink projection if Exploration 10 rules that way).

**When triggered**: move to `current/`. Author the PostHog adapter
plan; wire the exporter; update conformance scope.

**Triggers vs assertions**: each fire condition above is a
*recordable event* with a written artefact (date scheduled, decision
recorded, telemetry-window measurable, named question logged). A
condition that cannot be checked against an artefact has not fired.

**Alternative engineering sink (contingency)**:

- A specific Sentry-capability gap is named (with evidence) in
  [`docs/explorations/2026-04-18-how-far-does-sentry-go-as-paas.md`](../../../../docs/explorations/2026-04-18-how-far-does-sentry-go-as-paas.md)
  output, AND
- The gap blocks a concrete observability goal that the warehouse +
  PostHog combination does not also close.

**When triggered**: move to `current/`. Quote the gap; select among
the original candidate set (Datadog, Honeycomb, NewRelic,
Grafana+Loki+Tempo, self-hosted OTel); evaluate; decide.

## Implementation Sketch (for context, finalised at promotion)

**Per-sink adapter shape** (each becomes its own
`packages/libs/<vendor>-exporter/` workspace):

- Consumes `@oaknational/observability-events` schemas as input.
- Composes the redaction policy via `@oaknational/observability`
  (redaction primitives + sanitisation consolidated here per the
  2026-04-19 primitives-consolidation lane).
- Emits to the sink via that vendor's SDK or its OTel-compatible
  ingest endpoint.
- Registers in the composition root only (per ADR-078); never in
  feature code (per ADR-162 mechanism #3).
- Ships its own slice of the multi-sink vendor-independence
  conformance test.
- Documents per-sink alert / dashboard / runbook ownership.

**Cross-sink concerns** (owned at the events-workspace +
`@oaknational/observability` level, not per adapter):

- Vendor-neutral correlation keys (`session_id`, `trace_id`,
  `release`).
- Identity envelope per the redaction-policy ruling.
- Schema versioning and deprecation.

## References

- [`high-level-observability-plan.md`](../high-level-observability-plan.md)
  — authoritative observability index; this plan is reachable from
  the Plan Map and the Three-Sink Architecture section.
- ADR-162 (vendor-independence clause; sink-cardinality agnostic).
- ADR-160 (closure principle; the redaction policy applies via the
  closure rule; whether the policy is uniform across sinks or
  per-sink projection is the open ruling owned by Exploration 10).
- ADR-143 (coherent structured fan-out — architectural shape).
- ADR-154 (framework / consumer separation).
- ADR-078 (per-request DI; composition-root carve-out).
- [Exploration 1 (Sentry vs PostHog)](../../../../docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md)
  — original capability matrix; informed the three-sink reframe.
- [Exploration 2 (Sentry as PaaS)](../../../../docs/explorations/2026-04-18-how-far-does-sentry-go-as-paas.md)
  — informs the *alternative-engineering-sink* contingency trigger.
- [Exploration 8 (vendor-independence conformance test shape)](../../../../docs/explorations/2026-04-18-vendor-independence-conformance-test-shape.md)
  — informs the conformance-scope expansion per adapter.
- [Exploration: data warehouse selection (2026-04-19)](../../../../docs/explorations/2026-04-19-data-warehouse-selection.md)
  — the warehouse choice this plan consumes.
- [Exploration: redaction policy — Clerk identity downstream (2026-04-19)](../../../../docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md)
  — the identity-envelope ruling each adapter consumes.
- [`active/sentry-observability-maximisation-mcp.plan.md` § L-12-prereq](../active/sentry-observability-maximisation-mcp.plan.md)
  — extracts the redaction core that all post-Sentry adapters
  compose. Independent architectural commitment per the
  workspace-extraction posture.
- [`active/sentry-observability-maximisation-mcp.plan.md` § L-15](../active/sentry-observability-maximisation-mcp.plan.md)
  — strategy close-out ADR; this plan's three-sink framing is one
  input among several that L-15 may choose to incorporate.
- [`current/observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)
  — schema input to all adapters.
- [`current/multi-sink-vendor-independence-conformance.plan.md`](../current/multi-sink-vendor-independence-conformance.plan.md)
  — conformance scope expands per adapter.
