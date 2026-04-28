---
title: Sentry vs PostHog Capability Matrix — Where Each Wins, Where Each Falls Short Across the Five Axes
date: 2026-04-18
status: active
body_state: 'possibility-shaped body authored 2026-04-19 (no usage data; private alpha; parallel Sentry-integration agent active). 2026-04-19 — superseded in framing by the three-sink architecture (see § Status update). The capability-matrix analysis below remains valid as the input that informed the reframe; the binary-choice framing it implies does not.'
overlay_source: '.agent/research/sentry-and-posthog/Sentry and PostHog-oak.md'
plan_of_record: '.cursor/plans/sentry-posthog-oak-overlay_6a16ff6e.plan.md'
informs_with_scope_widening:
  - plan: '.agent/plans/observability/future/second-backend-evaluation.plan.md'
    note: "Reframed 2026-04-19 from 'second backend evaluation' to 'three-sink strategic brief' (warehouse adapter as Sink 2; PostHog adapter as Sink 3). The candidate-widening question this exploration originally posed is settled in favour of three sinks; this exploration's per-axis verdicts inform the per-sink adapter design rather than a binary backend choice."
informed_by:
  - 'docs/explorations/2026-04-19-data-warehouse-selection.md (warehouse choice for Sink 2; landed 2026-04-19 as a consequence of the three-sink reframe)'
  - 'docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md (Clerk-identity policy ruling; landed 2026-04-19 as a consequence of the three-sink reframe)'
constraints:
  - ADR-160 (non-bypassable redaction barrier — closure principle)
  - ADR-162 (observability-first; vendor independence)
  - ADR-154 (framework-from-consumer separation)
  - ADR-078 (per-request DI; composition-root carve-out)
---

# Sentry vs PostHog Capability Matrix

## Status update 2026-04-19 — three-sink reframe

**The binary "Sentry vs PostHog" framing this exploration originally
inhabited is superseded.** The 2026-04-19 owner conversation
collapsed it into a **three-sink architecture** owned by
[`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
(reframed in the same pass from "second backend evaluation" to "three-sink
strategic brief"):

1. **Sink 1 — Sentry** (engineering observability; today).
2. **Sink 2 — Data warehouse** (durable analytical SQL; public-beta
   target). Warehouse choice is now an open question owned by the new
   companion exploration
   [Data Warehouse Selection (2026-04-19)](./2026-04-19-data-warehouse-selection.md).
3. **Sink 3 — PostHog** (interactive product analytics;
   post-public-beta, gated on a named data-scientist or product-owner
   question that PostHog answers materially better than Sentry
   Insights or warehouse + thin BI). PostHog is already in use
   elsewhere in the Oak org (owner statement 2026-04-19).

Two further owner-confirmed framings:

- **MVP usage question is Sentry-addressable**: "how many people are
  using the MCP and roughly for what" is answerable from Sentry today
  via `wrapMcpServerWithSentry` traces + tool-call distribution.
  PostHog is deferred until public beta + a named question.
- **Identity envelope is now an explicit policy question**: all MCP
  users are Clerk-authenticated; the MCP server already sets
  `user.id` into Sentry per-request scope. Whether identified events
  flow into Sinks 2 and 3 is owned by the new companion exploration
  [Redaction Policy — Clerk Identity Downstream (2026-04-19)](./2026-04-19-redaction-policy-clerk-identity-downstream.md).
  The §4 Q6 derivation of "anonymous-events PostHog" below is _one_
  coherent policy outcome; the ruling may yield an _identified-events_
  posture across some or all sinks, in which case that derivation is
  superseded.

**What remains valid below**: the per-axis capability matrix (§3),
the per-question answers (§4) excluding the identified-vs-anonymous
posture in Q6 (now policy-pending), the architectural-seam analysis
(§6) excluding the binary-choice scope-widening framing in §6.1
(superseded), and the references (§9). Reading order: skim this
section, then read §3, §4, §6.4, §6.5, then jump to the two new
2026-04-19 companion explorations linked above for what the reframe
opened.

---

**Status of the body** (pre-reframe context, retained for evidence):
a _possibility-shaped_ body has been authored under explicit "no
usage data" framing (see `body_state` in frontmatter). The
exploration's original promotion trigger
([§8](#8-promotion-trigger-record-update)) remains intact for the
post-launch re-run with real traffic; the body below is the
capability-shaped option-space mapping that informed the three-sink
reframe.

The full evidence base (Stream A repo grounding, Stream B web
verification dated 2026-04-19, Stream D assumption stress tests, two
rounds of reviewer choreography) lives in the overlay companion
[`/.agent/research/sentry-and-posthog/Sentry and PostHog-oak.md`](../../.agent/research/sentry-and-posthog/Sentry%20and%20PostHog-oak.md);
this body is the curated subset.

---

## 1. Problem statement

Oak's observability stack is currently fragmented across multiple
vendors ([direction-setting session §1](./2026-04-18-observability-strategy-and-restructure.md#related-infrastructure-at-oak-session-confirmed)):
Sentry for engineering observability on this project; PostHog as the
primary product-analytics tool for the principal Oak product;
Cloudflare, GCP Logging, Vercel observability, and Atlassian
Statuspage covering adjacent concerns.

The direction-setting session
[§3.3](./2026-04-18-observability-strategy-and-restructure.md#33-sentry-as-paas-exploration-is-a-core-thesis)
and [§3.6](./2026-04-18-observability-strategy-and-restructure.md#36-posthog-vs-sentry-research)
name the research question: what does Sentry do well, what does
PostHog do well, where does each fall short, and where does the
five-axis MVP land each vendor.

This exploration is the evidence base that informs
[`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
and the L-15 reframe in
[`active/sentry-observability-maximisation-mcp.plan.md`](../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md).

---

## 2. Scope and method — capability-shaped, not usage-justified

**Scope** (capability-shaped, not usage-justified):

- Side-by-side capability matrix across the five ADR-162 axes
  (engineering, product, usability, accessibility, security),
  mapped to the four MVP personas in the
  [high-level observability plan's Launch Criteria](../../.agent/plans/observability/high-level-observability-plan.md)
  (data scientist, engineer, product owner, a11y reviewer).
- Per-axis verdict: where Sentry is the natural primary, where
  PostHog is the strongest _candidate_ if a Sentry surface proves
  insufficient, where neither vendor's product offers axis-specific
  tooling and the axis is delivered by _event design_ regardless of
  sink.
- Schema-shape implications for `packages/core/observability-events/`
  and the cross-vendor adapter layer
  ([structured-event-schemas-for-curriculum-analytics.md §5.7](./2026-04-18-structured-event-schemas-for-curriculum-analytics.md)).
- Cost / volume scenarios (modelled, not measured), with arithmetic,
  dated 2026-04-19.
- Compliance and data-residency posture (GDPR, BAA, EU regions),
  with the redaction-barrier closure rule named as the
  binding constraint rather than the vendors' compliance status.

**Method**:

- Stream A — repo grounding: ADRs 160 / 162 / 154 / 078; the high-
  level observability plan, the active maximisation plan, the
  events-workspace and multi-sink-conformance plans, the
  `sentry-node` package, the app-specific `observability.md`, and
  the seven sibling explorations.
- Stream B — live web verification dated 2026-04-19: pricing,
  retention, EU residency, BAA scope, self-host posture for both
  vendors; OpenFeature spec status; Sentry feature-flag integration
  provider list. Two web fetches were substituted (Sentry retention
  page returned 404 → pricing-page table; OpenFeature ecosystem
  page timed out → general OpenFeature provider knowledge).
- Stream C — Sentry MCP queries: **deliberately skipped** to avoid
  collision with the parallel agent currently editing the
  maximisation plan's surface, and because the private-alpha MCP
  server has insufficient traffic for any Sentry-side static-config
  read to be load-bearing.
- Stream D — seven assumption stress tests, run in the overlay
  companion §10 with method and verdict per test.
- Reviewer choreography — two rounds (`assumptions-reviewer` +
  `docs-adr-reviewer` in parallel each round). Round 1 dispositions
  recorded in overlay companion §14.1. Round 2 (against this
  exploration body) follows.

**Non-method** (load-bearing exclusions):

- No claim in this body is grounded in current usage / volume /
  issue / replay / span data — the MCP server is in private alpha
  with negligible traffic.
- No PostHog MCP queries — Oak does not have a PostHog account on
  this project.
- No edits to ADRs, to the maximisation plan, to the
  second-backend-evaluation plan, or to the
  feature-flag-provider-selection plan; this exploration informs
  those plans, it does not rewrite them.
- The original §5 promotion trigger from the initial brief (now
  [§8](#8-promotion-trigger-record-update)) for full authorship of
  the exploration is preserved unchanged — it remains the
  evidence-driven trigger for the post-launch re-authoring of the
  body below with real traffic.

---

## 3. Per-axis capability matrix (curated subset of overlay §3)

Mapping each ADR-162 axis to (a) the MVP-blocking deliverable, (b)
the persona that consumes it, and (c) which vendor serves the axis
well today, with what compromise. Vendor-fact claims are Stream B
2026-04-19; sources in §9.

| Axis              | MVP deliverable                                                                                                 | Persona          | Sentry today                                                                                                                                                                 | PostHog today                                                                                                                                     | Verdict                                                                                                                                                                                                                                                                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Engineering**   | Error capture + tracing + release linkage + free-signal integrations + widget error capture + alerts + runbooks | Engineer         | Native fit. Distributed tracing, profiling, release health, suspect-commit detection, ownership routing, alerting. Seer (SaaS only) for AI-assisted root-cause.              | Possible but secondary. PostHog error tracking is built to connect exceptions back to user behaviour, not to be APM. No native tracing/profiling. | **Sentry primary.** PostHog adds nothing the existing engineering-axis MVP doesn't already get from Sentry; running both for engineering would be effort without payoff.                                                                                                                                                                                          |
| **Product**       | `packages/core/observability-events/` workspace + `tool_invoked` + `search_query` + event catalog               | Data scientist   | Possible but ergonomics likely wrong for cohort/funnel queries. Insights is event-based; tags + measurements + custom dashboards. 90-day Insights lookback on Business tier. | Native fit if behaviour-shaped queries surface. Trends, funnels, retention, paths, lifecycle, HogQL. 7-year retention available.                  | **PostHog stronger if behaviour-shaped queries surface; Sentry plausibly sufficient for the categorical-axis subset.** Note the binding-but-derived constraint: the current MCP architecture's identity model + the redaction policy + ADR-160's closure rule together yield an _anonymous-events_ PostHog slice (see §4 Q6; derivation in overlay companion §6). |
| **Usability**     | Tool-call success/failure breakdown + feedback capture (L-9) + `widget_session_outcome` events                  | Product owner    | Possible. Issues + alerts on success-rate degradation; replay-on-error for failure analysis.                                                                                 | Native fit if cohort-shaped funnels are needed.                                                                                                   | **PostHog stronger for the _measure_ loop if behaviour-cohort queries dominate; Sentry stronger for the _fix_ loop.** The two surfaces are complementary, not substitutable; whether _both_ are required at MVP depends on whether the product owner's first-order questions are cohort-shaped — not yet demonstrated.                                            |
| **Accessibility** | `a11y_preference_tag` + frustration proxies + incomplete-flow correlation + keyboard-only boolean               | A11y reviewer    | Possible via custom-tag aggregations on Insights; Sentry has no a11y-specific feature.                                                                                       | Possible via cohorts on `a11y_preference_tag`; PostHog has no a11y-specific feature either.                                                       | **Neither vendor has axis-specific tooling.** The axis is delivered by the _event schemas_ in `observability-events`, not by either vendor's product. Either backend works equally well as a sink; this is an event-design axis, not a vendor-choice axis.                                                                                                        |
| **Security**      | `auth_failure` + `rate_limit_triggered` events                                                                  | Security/on-call | Native fit at signal level (alert on auth-failure spikes; Sentry session correlation; ownership routing).                                                                    | Possible at analytics level (cohort drift over time); not native security tooling.                                                                | **Sentry stronger.** Cloudflare carries the edge security signal; Sentry carries the application security signal; PostHog adds longitudinal cohort/trend visibility but not incident response. PostHog is _additive_, not substitute.                                                                                                                             |

**Two-by-four mapping**: across the four MVP personas, Sentry is
the natural primary for two (engineer, on-call/security); PostHog
is the strongest current candidate for the other two (data
scientist, product owner) **if** Sentry-native surfaces prove
ergonomically insufficient in real usage; the accessibility axis is
delivered by _schema_ and emission discipline regardless of sink.
None of these mappings amounts to a present-tense "must adopt
PostHog" — that judgement is traffic-shaped and held open by
[`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md).
What this matrix establishes is the _option space_, not the
decision.

---

## 4. Answers to the six research questions

The original §3 of the initial brief (now superseded by the §4 below) posed
six numbered research questions, preserved verbatim in this body's
sub-headings. The answers below are full-form, capability-shaped, and
draw on the overlay companion's deeper analysis in §3, §4, §5, §6,
§7, §8, and §10.

### Q1 — Which product-axis questions does Sentry's product-analytics surface answer well, and which require PostHog-shaped capability?

Sentry can answer the _categorical-axis_ slice (subject, key_stage,
year_group, keyword, thread aggregations on `tool_invoked` /
`search_query` events) via Insights tags + measurements + custom
dashboards. The capability exists — `tool_invoked` with a `subject`
tag is queryable in Sentry — but the ergonomics are debug-flavoured
rather than analytics-flavoured.

Sentry is _ergonomically awkward_ for cohort-shaped queries
("users who triggered tool A then tool B"; funnel paths; cohort
drift over time) and for log-scale numeric distributions like
`result_count`. PostHog is native for both: funnels, retention,
paths, lifecycle, stickiness are first-class insight types, and
HogQL handles log-scale buckets idiomatically.

The categorical-axis subset of the data-scientist persona's
first-order questions is therefore likely answerable on Sentry
alone; the cohort/funnel subset is not. Whether the cohort/funnel
subset is needed at MVP is traffic-shaped and not yet decided. See
overlay companion §3 + §10 Test 4.

### Q2 — Does Sentry's session-replay capability cover the usability-axis needs, or is PostHog's session-replay materially different?

Materially different and not substitutable.

**Sentry replay** is debug-shaped. The recommended sampling pattern
is `replaysOnErrorSampleRate` ≈ 1.0 with `replaysSessionSampleRate`
≈ low (e.g., 0.1). The replay is _evidence attached to an issue_,
viewed in the Issues UI alongside the stack trace. The consumer is
the engineer triaging the bug.

**PostHog replay** is behaviour-shaped. Sampling is cohort-driven
(record sessions matching a behaviour cohort). The replay is
_evidence attached to a funnel-step drop-off_, viewed in the
Replay UI alongside the cohort definition. The consumer is the
product owner / a11y reviewer / data scientist understanding _why_
users behave a certain way.

Sentry replay does not cover the behaviour-investigation use case
regardless of sampling configuration; PostHog replay does not
cover the engineering-debug use case. They are complementary, not
duplicative.

Whether Oak needs the behaviour-investigation use case at MVP is
the actual question; it is decidable in principle from
[`current/accessibility-observability.plan.md`](../../.agent/plans/observability/current/accessibility-observability.plan.md)
and the product-owner persona's first-order questions, and
traffic-shaped in practice. At Oak's modelled MVP volumes the cost
of running both is **$0** (both within free tiers; §5), so the
clean-vendor-document worry about "double-billing" does not bite.
See overlay companion §8.

### Q3 — How do the feature-flag / experimentation surfaces compare for Oak's expected A/B experiment volume?

Sentry does not host feature flags. Sentry offers a _feature-flag
integration_ (in beta) that attaches recent flag evaluations to
error events and provides change-tracking ("which flags changed
near this issue"). First-party provider adapters: **Flagsmith**,
**LaunchDarkly**, **Statsig**, **Unleash**, plus a **Generic
webhook** for any other provider.

PostHog hosts feature flags natively (1M flag requests in the free
tier; experiments product included; cohort-targeted rollouts).

OpenFeature is a CNCF _incubating_ project; the core API surfaces
are **Stable**; some peripheral surfaces are **Hardening** or
**Experimental**. There is a community-maintained OpenFeature
provider for PostHog. Sentry's feature-flag integration does not
have a first-party OpenFeature adapter; bridging requires either
the Generic webhook or a small custom hook calling
`featureFlagsIntegration`.

Oak's expected A/B experiment volume is not yet defined and the
provider-seam choice is **deliberately deferred** by L-10 in the
maximisation plan (which is intentionally TSDoc-extension-point-only)
and by [`future/feature-flag-provider-selection.plan.md`](../../.agent/plans/observability/future/feature-flag-provider-selection.plan.md)
(which is "in wait" until a real flag consumer exists). What the
exploration can usefully add now is the _evaluation criteria_ the
future seam choice should preserve (see [§7](#7-decision-recommendation-framing));
the seam choice itself should remain strategic until a real flag
consumer arrives. See overlay companion §7.

### Q4 — What is the minimal additional field set the event-schema workspace would need to produce PostHog-native `capture()` payloads without Sentry-specific coupling?

With the schemas held vendor-neutral as
[`current/observability-events-workspace.plan.md`](../../.agent/plans/observability/current/observability-events-workspace.plan.md)
already plans, the _minimal additional surface is not in the schema
fields_ — it is in the cross-vendor adapter layer
([structured-event-schemas-for-curriculum-analytics.md §5.7](./2026-04-18-structured-event-schemas-for-curriculum-analytics.md)).

The adapter would need:

- A mapping from `session_id` to PostHog's `distinct_id`.
- A mapping from any numeric measurement field (`result_count` is
  the current example) to PostHog property shape.
- A one-to-one event-name lift.
- The redaction-policy closure proof for the new fan-out path
  (`multi-sink-vendor-independence-conformance.plan.md` would
  inherit this).

None of these belong in the schema itself; all belong in the
adapter. The schema-level decision is to hold vendor neutrality —
the schema does not acquire PostHog-specific naming or
dual-encoding shapes — and to defer all vendor-specific lifts to
the adapter layer when a second sink is admitted. See overlay
companion §4.

### Q5 — Which vendor's alerting + anomaly-detection capability is stronger for Oak's expected signal volume?

Sentry is stronger for incident-shaped alerting on the engineering
and security axes (issue-grouped alerts, ownership routing,
Sentry-native SLA workflows; AI-assisted root-cause via Seer on
SaaS).

PostHog is stronger for cohort-shaped anomaly detection on the
product axis (cohort drift, funnel-step regression on rollout,
experiment-result anomalies).

For the MCP server's modelled MVP volumes (§5), neither vendor's
anomaly-detection threshold tuning is yet a decision worth making.
The alert-threshold work is explicitly traffic-shaped (see L-13 in
the maximisation plan) and the modelled volumes are too low to
exercise either vendor's anomaly-detection differentiator. See
overlay companion §3 Engineering + Security rows.

### Q6 — What are the licence-cost and data-residency implications of emitting identical structured events to both?

> **Status 2026-04-19 (in-place marker)**: the identity-shape
> conclusion at the end of this answer (the "anonymous-events
> PostHog" derivation) is **policy-pending**, owned by
> [Exploration 10 (Clerk identity downstream)](./2026-04-19-redaction-policy-clerk-identity-downstream.md).
> The cost-arithmetic and data-residency tables below remain valid;
> the derivation that "the practical PostHog slice available at Oak
> is anonymous-events PostHog" is **one of three coherent positions**
> the exploration evaluates (anonymous-only / identified single-sink /
> identified all-sinks), not a settled conclusion. Read the cost and
> residency content as still-valid; treat the identity-shape
> derivation as superseded-pending-ruling.

**Licence cost** (Stream B 2026-04-19; modelled three tiers):

- **Tier 1 (private alpha today, ~near-zero traffic)**: Sentry
  $0–$312/yr (depending on whether the Team-tier base subscription
  is needed for non-cost reasons; under the free dev tier
  otherwise); PostHog $0/yr.
- **Tier 2 (public beta launch; conservative model: 1K sessions/mo,
  10 invocations/session)**: Sentry $312/yr (Team-tier base);
  PostHog $0/yr. All instrumented signals stay within free tiers
  on both vendors.
- **Tier 3 (12 months post-launch at 10× growth)**: Sentry
  ~$312–$600/yr (Team-tier base + replay overage estimated at
  ~$0.30 per additional 50 replays from prior published rates);
  PostHog $0/yr.

**Cost-arithmetic caveat**: the Tier 3 replay-overage estimate
(~$0.30 per additional 50 replays) and the Team-tier span-quota
inclusion (~5M spans) come from the Sentry pricing slider on
2026-04-19; the replay rate was not directly visible. **Re-verify
both before any decision-making use of the cost-delta figure**
(see also [§5 Risks and unknowns](#5-risks-and-unknowns)).

The licence-cost delta of running both at modelled 12-month volumes
is approximately $300–$600/year, dominated by the Sentry Team-tier
base subscription Oak is already paying. Cost is therefore _not_ the
decision discriminator at MVP; capability ergonomics for the four
MVP personas, plus the binding redaction-policy closure constraint,
are.

**Data residency**:

| Item                         | Sentry                                     | PostHog                             |
| ---------------------------- | ------------------------------------------ | ----------------------------------- |
| GDPR (Art. 28 processor)     | Yes; DPA available                         | Yes; DPA available                  |
| EU data residency            | Yes (de.sentry.io — Oak is on this region) | Yes (Frankfurt — `eu.posthog.com`)  |
| US-EU Data Privacy Framework | Certified                                  | Available                           |
| HIPAA BAA                    | Available on Business tier and higher      | Available with BAA scoping on Cloud |
| SOC 2 Type II                | Yes                                        | Yes                                 |
| ISO 27001                    | Yes                                        | Yes                                 |

Both vendors clear Oak's compliance bar; neither is a blocker.

**The binding constraint is ADR-160's closure rule, not vendor
compliance posture**: every fan-out path must apply the shared
redaction policy before any sink. Combined with the _current_ MCP
architecture (no Oak-native end-user account model; no
policy-approved second-sink path for propagating identifying user
context beyond the existing redaction barrier), the practical
PostHog slice available at Oak is anonymous-events PostHog.
Sentry-specific scope enrichment may still carry `user.id` today
via `apps/oak-curriculum-mcp-streamable-http/src/mcp-handler.ts`'s
`observability.setUser({ id: userId })` call; that flows into
Sentry's per-request scope, not into the event-data envelope a
PostHog adapter would emit. See overlay companion §6 for the
careful derivation (the constraint follows from three facts
together — identity model + redaction-policy posture + ADR-160
closure rule — not from ADR-160 alone) and
[§5 Risks and unknowns](#5-risks-and-unknowns) for the precondition
that triggers re-derivation.

---

## 5. Risks and unknowns

**This analysis runs ahead of evidence.** All claims in §3 verdicts,
§4 answers, §6 architectural splits, and §7 framing are
capability-shaped, not usage-justified. The MCP server is in private
alpha with negligible traffic; no claim is grounded in current
usage / volume / issue / replay / span data. The post-launch re-run
of this body (see [§8](#8-promotion-trigger-record-update) trigger)
is the evidence-driven supersession.

**Stream B substitutions** (per §2 Method): the Sentry retention
page direct URL returned 404 and was substituted with the
pricing-page retention table; the OpenFeature ecosystem page timed
out and was substituted with general OpenFeature provider
knowledge. Re-verify before any load-bearing use.

**Sentry Team-tier span-quota and replay PAYG rate uncertainty**:
the Q6 cost arithmetic in §4 uses a ~5M-span Team-tier inclusion
and an estimated ~$0.30 per additional 50 replays. Both come from
the Sentry pricing slider on 2026-04-19; the replay rate was not
directly visible. **Verify both before any decision-making use of
the cost arithmetic.**

**Identity-model precondition (load-bearing for the §4 Q6
derivation and §6.1 sequencing)**: the practical anonymous-PostHog
slice depends on the _current MCP architecture_: no Oak-native
end-user account model and no policy-approved second-sink path for
propagating identifying user context beyond the ADR-160 redaction
barrier. Sentry-specific scope enrichment today carries `user.id`
on authenticated requests via
`apps/oak-curriculum-mcp-streamable-http/src/mcp-handler.ts`'s
`observability.setUser({ id: userId })` call; that flows into
Sentry's per-request scope, not into the event-data envelopes a
PostHog adapter would emit. If the identity model, the redaction
policy, or the sink-path inventory changes, this constraint must
be re-derived from policy rather than assumed.

**Stream C deliberately skipped**: no Sentry MCP queries were run
beyond static project-config (parallel agent active on the
maximisation-plan surface; private-alpha traffic insufficient for
load-bearing reads). Any claim that would need to be grounded in
current Sentry state on `oak-national-academy/oak-open-curriculum-mcp`
is out-of-scope for this body.

**Re-run obligation**: when the
[§8](#8-promotion-trigger-record-update) promotion trigger fires
(any one of the three conditions observed in real usage), this body
is re-authored with real-traffic evidence superseding the modelled
scenarios in §4 Q6 and the capability-shaped verdicts in §3.

---

## 6. Architectural decisions decidable today vs genuinely-needs-traffic split

This section replaces the original "promotion-trigger fired /
not-fired" framing of the initial brief. For each strategic plan, it names
what would need to land for that plan's trigger to fire, and which
of those needs traffic versus which is decidable from existing
doctrine. Plan-state claims in §6.x are as of 2026-04-19; re-verify
if the cited plans have been updated.

### 6.1 `future/second-backend-evaluation.plan.md`

**Status update 2026-04-19**: the scope-widening question this
section originally posed (whether PostHog should be admitted as a
candidate alongside the engineering-observability set) **is settled
in favour of three sinks**, not via this exploration's framing but
via the 2026-04-19 owner conversation recorded at the top of this
document and at
[ADR-162 § History 2026-04-19](../architecture/architectural-decisions/162-observability-first.md#history).
The plan has been reframed in the same pass from "second backend
evaluation" to "three-sink strategic brief" with per-sink promotion
triggers (warehouse adapter at public-beta; PostHog adapter
post-public-beta on a named question; alternative engineering sink
only on a named Sentry-capability gap). The original
engineering-observability candidate set (Datadog, Honeycomb,
NewRelic, Grafana+Loki+Tempo, self-hosted OTel) remains as a
contingency under the _alternative-engineering-sink_ trigger. The
analysis in §6.1 below remains valid as the input that informed the
reframe.

**Scope-widening disclosure (pre-reframe context, retained for
evidence)**: this plan formerly enumerated engineering-observability
candidates only. This exploration considered PostHog as an
additional candidate framing under the persona-mapped MVP gate
(data scientist + product owner). That widening is now superseded by
the three-sink architecture.

**Decidable today from doctrine** (no traffic needed):

- **Sequencing constraint** — any second-sink adapter (PostHog or
  otherwise) is downstream of the redaction-core extraction
  (L-12-prereq in the maximisation plan). The `multi-sink-vendor-
independence-conformance.plan.md` already proves emission
  persistence under `SENTRY_MODE=off`; a new sink would need an
  analogous closure proof (no PII leaks to the new sink under
  redaction-active mode), which is small once the redaction core
  is extracted and large if it is not.
- **Vendor-neutral schema posture** — `session_id` stays vendor-
  neutral; `result_count` lifts via adapter; no PostHog-specific
  naming or dual-encoding at the schema layer. This protects the
  option to admit any second sink without retrofit.
- **Identity-model precondition** — the practical anonymous-PostHog
  slice depends on the _current MCP architecture_ (no Oak-native
  end-user account model; no policy-approved second-sink path for
  identifying user context). If a future change introduces an
  end-user account model, redraws the redaction policy, or admits
  a new sink-path, this precondition must be re-derived from
  policy rather than assumed (see [§5 Risks and unknowns](#5-risks-and-unknowns)).

**Requires plan-owner scope acceptance** (not traffic-shaped, not
doctrine-shaped — an editorial decision for the plan owner):

- Whether `future/second-backend-evaluation.plan.md` admits PostHog
  as a candidate at all.

**Genuinely needs traffic** (the plan's promotion trigger must
fire on real-usage evidence):

- Whether anonymous-events PostHog (funnels + retention + HogQL +
  experiments) outperforms Sentry Insights on the data-scientist
  persona's actual queries.
- Whether behaviour-replay is needed (drives the PostHog-replay
  decision).
- Whether either vendor's anomaly-detection capability surfaces a
  signal the other misses.

### 6.2 `future/feature-flag-provider-selection.plan.md`

**Decidable today from doctrine** — _evaluation criteria only_, not
the seam choice itself:

- The chosen seam must not put a vendor SDK in feature code
  (ADR-162 mechanism #3 applied at the flag-evaluation boundary).
- The chosen seam must reach Sentry's `featureFlagsIntegration`
  so flag context surfaces with errors (via direct adapter for
  one of the four listed providers, via Generic webhook for any
  other, or via custom hook from an OpenFeature provider).
- The chosen seam must not pre-commit provider identifiers in
  observability event schemas — those are configuration, not
  contract.

**Not decidable yet; requires a real flag consumer / use case**
(traffic-independent — the plan-of-record's promotion trigger is
"first A/B experiment proposed OR first feature-flag-using feature
lands", and this exploration does not seek to unsettle that posture):

- The seam choice itself (direct provider, OpenFeature, or
  defer-until-consumer).
- The provider identity (PostHog, LaunchDarkly, Flagsmith,
  Statsig, Unleash, or other).
- The change-tracking webhook URL and provider identifier.

### 6.3 `active/sentry-observability-maximisation-mcp.plan.md` § L-15

**This exploration can inform L-15** by (a) testing whether the
architectural seams that would make a second vendor cheap have
landed, and (b) identifying any named persona-question that Sentry
answers poorly. The plan-of-record still defines L-15 as a
three-option strategy close-out (Sentry-only / dual-export /
minimal-operational) based on observed operational value from
Phases 1–4; this exploration contributes one possible evaluation
lens, not a rewritten trigger. The seams the lens would assess are:
the event schemas (§4), the redaction-core extraction (§6.1), the
candidate cross-vendor adapter shape
(`structured-event-schemas-for-curriculum-analytics.md` §5.7),
and the conformance lint extension named in §6.1.

**No new decisions for L-10**: L-10 stays as the
TSDoc-extension-point-only documentation the plan-of-record specifies. The
OpenFeature evaluation criteria above (§6.2) belong to
`future/feature-flag-provider-selection.plan.md`; L-10 carries the
extension point shape, not the seam decision.

**Genuinely needs traffic**: L-15 itself stays usage-shaped — the
plan's three-option close-out depends on observed operational value
from Phases 1–4, which requires traffic to assess.

### 6.4 `current/observability-events-workspace.plan.md`

**Decidable today from doctrine**: WS3 schema design preserves a
vendor-neutral `session_id` correlation key and ensures
`result_count` can be lifted by adapters into either property-only
or property-plus-measurement form without loss. No PostHog-specific
schema commitments today.

**Genuinely needs traffic**: nothing in this plan needs to change
on the strength of this exploration alone; the WS3 design is
already vendor-neutral by intent.

### 6.5 `current/multi-sink-vendor-independence-conformance.plan.md`

**Decidable today**: when a second-sink question goes live, the
plan could usefully add a check that each event schema can in
principle be lifted into both Sentry and PostHog payloads via the
adapter layer without the schema acquiring vendor shape. **Not** a
recommendation to add the check now; the current scope (emission-
persistence under `SENTRY_MODE=off` + structural import lint) is
the right MVP scope.

---

## 7. Decision recommendation framing

> **Status 2026-04-19 (in-place marker)**: the recommendations in
> this section against the now-superseded scope-widening question
> ("should PostHog be admitted as a candidate?") are retained for
> evidence; the question itself is settled in favour of the
> three-sink architecture (PostHog is the chosen vendor for Sink 3
> per the owner ruling 2026-04-19; only adoption _timing_ is open).
> The live recommendations and per-sink promotion triggers are in
> [`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
> §Risks-and-Unknowns and §Promotion-Triggers. Read this section
> as: framings the original exploration was carrying when it informed
> the reframe; not the current decision lattice.

This exploration does not make decisions on behalf of the consuming
plans. It identifies criteria, constraints, and framings those
plans may choose to adopt, accept, or reject. No vendor-pick
recommendations; no plan-state edits.

**For `future/second-backend-evaluation.plan.md`** (pre-reframe
framing — superseded; see status marker above):

- The plan owner decides whether to admit PostHog as a candidate
  (the scope-widening question — see §6.1). _(Settled 2026-04-19
  in favour of the three-sink architecture; PostHog is the chosen
  vendor for Sink 3.)_
- If admitted: the plan owner decides whether the _anonymous-events_
  slice of PostHog (funnels + retention + HogQL + experiments,
  without identified-event person profiles) outperforms Sentry
  Insights on the data-scientist persona's actual queries. This
  decision is traffic-shaped.
- The exploration identifies a sequencing constraint the plan may
  choose to adopt: any PostHog adapter authoring follows the
  redaction-core extraction (L-12-prereq).
- The exploration identifies an identity-model precondition the
  plan may choose to adopt: a PostHog adapter assumes the current
  MCP architecture's identity model and redaction-policy posture
  (see [§5 Risks and unknowns](#5-risks-and-unknowns)); if either
  changes, the precondition must be re-derived.
- **Cost framing for plan-owner readability**: treat cost as a
  non-discriminator at modelled 12-month volumes (Sentry
  ~$312–$600/yr Team-tier base, dominated by Oak's existing
  subscription; PostHog $0/yr at modelled volumes). Re-verify the
  Sentry replay PAYG rate and span-quota inclusion before any
  decision-making use (see §4 Q6 caveat and
  [§5 Risks and unknowns](#5-risks-and-unknowns)).

**For `future/feature-flag-provider-selection.plan.md`**:

- The exploration identifies three evaluation criteria in §6.2
  the plan may choose to adopt (vendor-SDK-out-of-feature-code;
  reach `featureFlagsIntegration`; no provider identifiers in
  event schemas).
- The plan-of-record's "in wait" posture for the seam choice
  itself is preserved by this exploration; the seam choice waits
  for a real flag consumer, not for traffic.

**For `active/sentry-observability-maximisation-mcp.plan.md`**:

- L-10 stays TSDoc-extension-point-only as the plan specifies.
- L-15 stays usage-shaped in the active plan; this exploration
  contributes one possible evaluation lens (the "named persona-
  question Sentry cannot answer ergonomically" framing), not a
  rewritten trigger. The plan-of-record still defines L-15 as a
  three-option close-out (Sentry-only / dual-export /
  minimal-operational) from Phases 1–4 evidence. The
  architectural seams that make a second vendor cheap (§6.1,
  §6.4, §6.5) would benefit from landing _before_ L-15 fires;
  whether the plan owner chooses to sequence them that way is
  the plan owner's call.

**For `current/observability-events-workspace.plan.md`**:

- The exploration identifies vendor-neutral schema posture
  (per §6.4) as the criterion to preserve.

**For `current/multi-sink-vendor-independence-conformance.plan.md`**:

- No changes identified for now; the candidate "lift to both
  Sentry and PostHog payloads" check (§6.5) is work for when a
  second-sink question goes live.

---

## 8. Promotion-trigger record update

**Update 2026-04-19**: the binary "second backend yes/no" framing the
original promotion trigger inhabited is superseded by the three-sink
architecture (see § Status update at top). Per-sink promotion
triggers now live in
[`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
frontmatter:

- **Warehouse adapter (Sink 2)**: public-beta launch nears AND
  warehouse choice settled (per
  [Exploration 9](./2026-04-19-data-warehouse-selection.md)) AND
  redaction-policy ruling for warehouse identity envelope settled
  (per [Exploration 10](./2026-04-19-redaction-policy-clerk-identity-downstream.md)).
- **PostHog adapter (Sink 3)**: public-beta traffic accumulated AND
  a named data-scientist or product-owner question is raised that
  PostHog-shaped surfaces (funnels, retention, paths, cohort replay,
  HogQL) answer materially better than Sentry Insights or warehouse
  plus thin BI AND redaction-policy ruling for PostHog identity
  envelope settled.
- **Alternative engineering sink (contingency)**: a specific
  Sentry-capability gap named in
  [Exploration 2 (Sentry as PaaS)](./2026-04-18-how-far-does-sentry-go-as-paas.md)
  output, with evidence the gap blocks a concrete observability goal
  the warehouse + PostHog combination does not also close.

The original §5 trigger from the initial brief (preserved verbatim below) is
**superseded by the per-sink triggers above** but retained as
evidence of the framing this exploration started with. The
exploration body is re-authored in full when the post-public-beta
named-question trigger for the PostHog adapter fires, at which point
real-traffic evidence supersedes the modelled scenarios in
[Q6 §4](#q6--what-are-the-licence-cost-and-data-residency-implications-of-emitting-identical-structured-events-to-both)
and the capability-shaped verdicts in §3.

**Original §5 trigger (pre-reframe; preserved)**: re-author in full
when any one is observed in real usage:

- A data-scientist-named question cannot be answered from the MVP
  event schemas as ingested by Sentry alone, and PostHog is the
  candidate second sink.
- A specific Sentry limitation (feature missing, licence tier
  prohibitive, capability gap named by exploration 2 on
  Sentry-as-PaaS) is identified.
- The multi-sink vendor-independence conformance test
  (exploration 8) uncovers a mapping gap that would be trivially
  closed by naming the second vendor.

---

## 9. References

Primary repo evidence:

- [`docs/architecture/architectural-decisions/162-observability-first.md`](../architecture/architectural-decisions/162-observability-first.md) — five-axis principle; vendor-independence clause; Enforcement Mechanisms #3–#5.
- [`docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md`](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md) — redaction-barrier closure principle; binding constraint via the identity-model + redaction-policy + closure-rule chain in §6 of the overlay companion.
- [`docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md`](../architecture/architectural-decisions/154-separate-framework-from-consumer.md) — structural prerequisite for vendor independence.
- [`docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md`](../architecture/architectural-decisions/078-dependency-injection-for-testability.md) — composition-root carve-out for vendor wiring.
- [`.agent/plans/observability/high-level-observability-plan.md`](../../.agent/plans/observability/high-level-observability-plan.md) — five-axis MVP scope; persona launch criteria.
- [`.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`](../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md) — L-10 (TSDoc-only feature-flag scaffolding); L-12-prereq (redaction-core extraction); L-15 (sharpened second-vendor framing).
- [`.agent/plans/observability/current/observability-events-workspace.plan.md`](../../.agent/plans/observability/current/observability-events-workspace.plan.md) — Zod-first event-schema workspace; seven MVP events.
- [`.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md`](../../.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md) — emission-persistence test under `SENTRY_MODE=off`; structural import lint.
- [`.agent/plans/observability/future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md) — second-backend candidate set (currently engineering-observability candidates only).
- [`.agent/plans/observability/future/feature-flag-provider-selection.plan.md`](../../.agent/plans/observability/future/feature-flag-provider-selection.plan.md) — provider-selection plan held in wait until a real flag consumer arrives.
- [`packages/libs/sentry-node/README.md`](../../packages/libs/sentry-node/README.md) — three modes (`off`, `fixture`, `sentry`); DI seam; redaction barrier; fixture store.
- [`apps/oak-curriculum-mcp-streamable-http/docs/observability.md`](../../apps/oak-curriculum-mcp-streamable-http/docs/observability.md) — three `SENTRY_MODE` settings; `wrapMcpServerWithSentry`; release metadata; source-map upload; replay sampling defaults.
- [`docs/explorations/2026-04-18-how-far-does-sentry-go-as-paas.md`](./2026-04-18-how-far-does-sentry-go-as-paas.md) — Sentry-as-PaaS thesis.
- [`docs/explorations/2026-04-18-structured-event-schemas-for-curriculum-analytics.md`](./2026-04-18-structured-event-schemas-for-curriculum-analytics.md) §4.3 (categorical-axis vocabulary), §5.7 (cross-vendor adapter shape).
- [`docs/explorations/2026-04-18-accessibility-observability-at-runtime.md`](./2026-04-18-accessibility-observability-at-runtime.md) — runtime a11y signal set.
- [`docs/explorations/2026-04-18-cloudflare-plus-sentry-security-observability.md`](./2026-04-18-cloudflare-plus-sentry-security-observability.md) — edge/app boundary for security.
- [`docs/explorations/2026-04-18-vendor-independence-conformance-test-shape.md`](./2026-04-18-vendor-independence-conformance-test-shape.md) — programmatic test shape for ADR-162's clause.
- [`docs/explorations/2026-04-18-trust-boundary-trace-propagation-risk-analysis.md`](./2026-04-18-trust-boundary-trace-propagation-risk-analysis.md) — OpenTelemetry trace propagation across hosts.
- [`docs/explorations/2026-04-19-data-warehouse-selection.md`](./2026-04-19-data-warehouse-selection.md) — warehouse choice for Sink 2 (companion exploration; 2026-04-19 reframe).
- [`docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md`](./2026-04-19-redaction-policy-clerk-identity-downstream.md) — Clerk-identity policy ruling for downstream sinks (companion exploration; 2026-04-19 reframe).
- Overlay companion: [`/.agent/research/sentry-and-posthog/Sentry and PostHog-oak.md`](../../.agent/research/sentry-and-posthog/Sentry%20and%20PostHog-oak.md) — Stream A grounding; Stream B web verification; Stream D assumption stress tests; Round 1 reviewer dispositions.

External evidence (Stream B web verification, 2026-04-19):

- Sentry pricing: <https://sentry.io/pricing/>.
- Sentry trust/privacy: <https://sentry.io/trust/privacy/>.
- Sentry self-hosted: <https://develop.sentry.dev/self-hosted/>.
- Sentry feature-flag integration: <https://docs.sentry.io/product/issues/issue-details/feature-flags/>.
- PostHog pricing: <https://posthog.com/pricing>.
- PostHog privacy / data storage: <https://posthog.com/docs/privacy/data-storage>.
- PostHog self-host: <https://posthog.com/docs/self-host>.
- OpenFeature: <https://openfeature.dev/> and <https://openfeature.dev/specification/>.

Out-of-scope verifications (intentionally not run):

- PostHog MCP server queries — Oak does not have a PostHog account on this project.
- Sentry MCP server queries beyond static project-config — coordination cost with parallel Sentry-integration agent exceeded the value of zero-traffic queries on a private-alpha server.

---

## 10. Source citations from the original brief (preserved)

- [Exploration 2](./2026-04-18-how-far-does-sentry-go-as-paas.md) —
  Sentry-as-PaaS thesis research.
- [Exploration 8](./2026-04-18-vendor-independence-conformance-test-shape.md) —
  conformance test that proves the adapter shape.
- [Direction-setting session §3.6](./2026-04-18-observability-strategy-and-restructure.md#36-posthog-vs-sentry-research) —
  research question framing.
