---
title: "Sentry and PostHog — Oak Overlay"
date: 2026-04-19
last_updated: 2026-04-19
status: working-draft
companion: "Sentry and PostHog-clean.md"
plan_of_record: ".cursor/plans/sentry-posthog-oak-overlay_6a16ff6e.plan.md"
informs:
  - .agent/plans/observability/future/second-backend-evaluation.plan.md
  - .agent/plans/observability/future/feature-flag-provider-selection.plan.md
  - .agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md
  - docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md
informs_with_scope_widening:
  - target: .agent/plans/observability/future/second-backend-evaluation.plan.md
    note: "That plan currently enumerates engineering-observability candidates (Datadog, Honeycomb, NewRelic, Grafana+Loki+Tempo, self-hosted OTel). This overlay considers PostHog as an additional candidate framing; see §11.1 for the reframing disclosure."
constraints:
  - ADR-160 (non-bypassable redaction barrier — closure principle, not a no-identifiers rule)
  - ADR-162 (observability-first; vendor independence)
  - ADR-154 (framework-from-consumer separation)
  - ADR-078 (per-request DI; composition-root carve-out)
streams_completed: [A, B, D]
streams_skipped: [C]
posture: "possibility-space exploration, not justification document"
---

# Sentry and PostHog — Oak Overlay

> Sibling working draft to `Sentry and PostHog-clean.md`. The clean
> document is a generic vendor comparison authored against a generic
> SaaS buyer profile. This overlay re-frames the same evidence base
> against Oak's actual situation, principles, and pending decisions,
> and adds the original research the generic document could not do.
>
> **Posture**: this is a *possibility-space* document, not a
> justification document. The MCP server is in private alpha with
> negligible traffic; Sentry integration is being actively built by
> a parallel agent in this repo right now; we do not have a PostHog
> account on this project so the PostHog MCP server is unauthenticated.
> The point of this work is to make later decisions cheaper, not to
> justify a vendor pick today.

---

## 1. Frame — Oak is not the buyer the clean document was written for

The `Sentry and PostHog-clean.md` document is structured around a
generic buying decision: "you are a digital product team, what should
you pick first." That framing is incomplete for Oak in three specific
ways that materially change the decision surface and several
downstream priorities. Many of clean.md's conclusions still stand on
their own terms (see §2); the issues are with how those conclusions
land against Oak's specific constraints, not with their accuracy in
their own frame.

**Oak is not a single-product team picking a single tool.** Oak's
direction-setting session (`docs/explorations/2026-04-18-observability-strategy-and-restructure.md`)
records that the wider Oak engineering organisation already runs:
PostHog as the primary product-analytics platform for the principal
Oak product; Sentry for engineering observability on the
[Oak Open Curriculum Ecosystem](https://github.com/oaknational/oak-open-curriculum-ecosystem)
(this repo); plus Cloudflare, GCP Logging, Vercel observability, and
Atlassian Statuspage covering adjacent concerns. Vendor "selection"
in the abstract is therefore not the question; what *is* the question
is whether this repo's MCP server should add a second sink (PostHog)
on top of its existing Sentry integration, and if so, which axes that
second sink should serve.

**Oak has decided, in code, that vendor identity is replaceable.**
[ADR-162 Enforcement Mechanisms #3–#5](../../../docs/architecture/architectural-decisions/162-observability-first.md)
mandate that consumers couple to `@oaknational/observability` and
`@oaknational/observability-events`, never directly to a vendor SDK,
and commit to a programmatic conformance test
([`current/multi-sink-vendor-independence-conformance.plan.md`](../../plans/observability/current/multi-sink-vendor-independence-conformance.plan.md))
that proves emission persistence under `SENTRY_MODE=off`. That is
already mid-execution. The clean document treats vendor choice as a
strategic act; Oak's architecture treats it as a configuration.

**Oak's MVP gate is persona-driven, not feature-driven.**
[`high-level-observability-plan.md` §Launch Criteria](../../plans/observability/high-level-observability-plan.md)
says the MVP gate fires when *a data scientist, an engineer, a
product owner, and an a11y reviewer can each answer their first-
order questions from telemetry alone*. Vendor-fit must be assessed
against four named consumers, not against a generic "what does this
tool do well" rubric. Three of those four (data scientist, product
owner, a11y reviewer) are not the canonical Sentry persona; one
(engineer) is. That is the load-bearing fact that the rest of this
overlay re-litigates the clean document against.

The remainder of this overlay carries exactly the same evidence base
the clean document used (vendor websites, official docs, public
pricing, public privacy policy, public self-host docs) and adds
Stream B (live web verification dated 2026-04-19), but reframes every
conclusion against the Oak-specific frame above.

---

## 2. What `Sentry and PostHog-clean.md` gets right, wrong, and off-frame

All Stream B verifications below are dated 2026-04-19 unless a row
states otherwise.

| Claim from clean.md                                                                | Verdict for Oak                            | Why                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sentry and PostHog overlap "in a meaningful but narrow band"                       | **Right**                                  | Confirmed: only error capture + replay + alerting overlap structurally; the rest is disjoint.                                                                                                        |
| "Use Sentry if the question is what broke / who fixes it; use PostHog for growth"  | **Right but incomplete for Oak**           | Oak's MVP gate also names a *data scientist* and *a11y reviewer*; neither maps cleanly to the Sentry-versus-PostHog dichotomy as posed.                                                              |
| "If you need both, the most robust architecture is to use both"                    | **Right; framing is wrong**                | True, but the clean doc treats this as a buying recommendation. For Oak, the architectural decision (`@oaknational/observability` adapter shape) is the real cost, not the licence cost.             |
| Sentry Team plan "starts at $26/month"                                             | **Confirmed 2026-04-19**                   | Sentry pricing page; included quotas: 50K errors, 5GB logs, ~5M spans, 50 replays. (Span quota number to re-verify before any decision-making use; pricing page slider was the source.)               |
| PostHog "starts at $0" with generous free quotas                                   | **Confirmed 2026-04-19**                   | PostHog pricing page; 1M analytics events, 5K recordings, 1M flag requests, 100K exceptions, 1.5K survey responses, 1M warehouse rows.                                                               |
| Sentry self-host "geared towards under about 1M events/month"                      | **Approximately right; nuance missing**    | Sentry self-hosted is Fair-Source-licensed (FSL-1.1-Apache-2.0; converts to Apache 2.0 after two years), free at any volume, but excludes AI/ML features, spike protection, and dedicated support.   |
| PostHog self-host is hobbyist-grade and won't scale past "a couple hundred K"      | **Right and material**                     | Oak's MVP traffic is well under that, but Oak does not have the infra appetite to self-host either platform; this is a non-decision for Oak.                                                         |
| G2 4.5/5 for both; PostHog has more reviews                                        | **Right but inert for Oak**                | Clean.md presented the rating as one signal among many, not a primary input. Oak isn't shopping by review aggregate, but the row was not answering Oak's question to begin with.                     |
| Replay should not be enabled on both vendors to avoid "duplicating every replay"   | **Right at scale; doesn't bite for Oak at MVP volume** | Clean.md's framing is correct cost/operational discipline at the volumes its scenarios assumed (20k–100k replays/month). At Oak's modelled MVP volume the cost arithmetic is $0 (§5, §8); the question becomes whether Oak needs *behaviour-replay at all*, not whether to duplicate. |
| Pricing tables comparing per-error, per-replay, per-event prices                   | **Right but doesn't bite for Oak yet**     | At Oak's modelled 12-month traffic, both vendors are essentially free (see §5). Cost is not the discriminator at MVP; capability and ergonomics are.                                                 |
| Sentry "Seer" / AI features as a differentiator                                    | **Out of scope for self-host; in scope for SaaS** | Oak runs Sentry SaaS (EU region, project `oak-open-curriculum-mcp` in `oak-national-academy`). Seer is available; whether it adds value is an L-15-class question, not a vendor-pick question. |
| GDPR / BAA / data-residency parity                                                 | **Both qualify; redaction barrier matters more** | Both Sentry and PostHog offer EU regions and BAA scoping (Sentry on Business+; PostHog on Cloud). For Oak the binding constraint is ADR-160's redaction barrier, not vendor compliance posture. |
| OpenFeature is "the obvious abstraction layer" for feature flags                   | **Half-right; specific to provider**       | OpenFeature is CNCF-incubating; spec sections vary in stability ("Experimental", "Hardening", "Stable"). PostHog has a community OpenFeature provider; Sentry's *feature-flag integration* (in beta) lists Flagsmith / LaunchDarkly / Statsig / Unleash / Generic-webhook — not OpenFeature directly. See §7. |

The off-frame items above are not errors in the clean document; they
are answers to a question Oak is not asking. The right items are
absorbed without further re-derivation. The remaining sections of this
overlay focus on the questions clean.md does not address: how the
five-axis MVP maps to each vendor, what the schema-shape implications
are, what costs Oak should actually expect at its modelled volumes,
and which assumptions need stress-testing before they harden into
plans.

---

## 3. Five-axis capability matrix mapped to Oak's MVP gate

Mapping each ADR-162 axis to (a) Oak's current MVP-blocking
deliverable, (b) the persona that consumes it, and (c) which vendor
serves the axis well today, with what compromise. This is the table
the clean document would have produced if it had Oak's frame. Vendor-
fact claims in the table below (Seer SaaS-only, 90-day Insights
lookback, 7-year retention, OpenFeature provider availability,
absence of native a11y tooling on either platform) are Stream B
2026-04-19; the references list (§12) carries the source URLs.

| Axis              | MVP deliverable (per high-level plan)                                                                                                                                                                              | Persona                | Sentry today                                                                                                                | PostHog today                                                                                                  | Verdict                                                                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Engineering**   | Error capture + tracing + release linkage + free-signal integrations (ANR, event-loop delay, Zod-validation failures) + widget error capture + alerts + runbooks. Owned by `active/sentry-observability-maximisation-mcp.plan.md`. | Engineer               | Native fit. Distributed tracing, profiling, release health, suspect-commit detection, ownership routing, alerting. AI-assisted root-cause via Seer (SaaS only). | Possible but secondary. PostHog error tracking is built to connect exceptions back to user behaviour, not to be APM. No native distributed-tracing / profiling. | **Sentry primary.** PostHog adds nothing that the existing engineering-axis MVP does not already get from Sentry; running both for engineering would be effort without payoff.                                                                                       |
| **Product**       | `packages/core/observability-events/` workspace + `tool_invoked` + `search_query` + event catalog. Owned by `current/observability-events-workspace.plan.md`.                                                      | Data scientist         | Possible but ergonomics likely wrong. Sentry Insights is event-based and supports tags + measurements. Custom dashboards possible. 90-day Insights lookback on Business tier. | Native fit if behaviour-shaped queries are needed. Trends, funnels, retention, paths, stickiness, lifecycle, HogQL/SQL. 7-year retention available. Subject/key-stage/year-group as event properties is idiomatic. | **PostHog stronger if behaviour-shaped queries surface; Sentry plausibly sufficient for the categorical-axis subset.** Note also a binding-but-derived constraint: in the MCP server's no-end-user-account context (see §6), PostHog's identified-events product (autocapture, identity merging, person profiles) cannot be wired in the obvious way; the available slice is anonymous-events PostHog (funnels, retention, HogQL, experiments). Whether that slice outperforms Sentry Insights on the data-scientist persona's actual queries is open and traffic-shaped. |
| **Usability**     | Tool-call success/failure breakdown + feedback capture (L-9 in maximisation plan) + `widget_session_outcome` events.                                                                                               | Product owner          | Possible. Issues + alerts on success-rate degradation; replay-on-error for failure analysis.                                | Native fit if cohort-shaped funnels are needed. Funnels are designed for this exact question; experiments product can A/B test fixes.              | **PostHog stronger for the *measure* loop if behaviour-cohort queries dominate; Sentry stronger for the *fix* loop.** The two surfaces are complementary, not substitutable; whether *both* are required at MVP depends on whether the product owner's first-order questions are cohort-shaped. Not yet demonstrated in Oak usage. |
| **Accessibility** | `a11y_preference_tag` + frustration proxies + incomplete-flow correlation + keyboard-only boolean. Owned by `current/accessibility-observability.plan.md`.                                                         | A11y reviewer          | Possible via custom-tag aggregations on Insights; Sentry has no a11y-specific feature.                                      | Possible via cohorts on `a11y_preference_tag`; PostHog has no a11y-specific feature either.                    | **Neither vendor has axis-specific tooling.** The axis is delivered by the *event schemas* in `observability-events`, not by either vendor's product. This is an *event-design* axis, not a *vendor-choice* axis. Either backend works equally well as a sink.       |
| **Security**     | `auth_failure` + `rate_limit_triggered` events. Owned by `current/security-observability.plan.md` and informed by `cloudflare-plus-sentry-security-observability.md` exploration.                                  | Security/on-call       | Native fit at signal level (alert on auth-failure spikes; Sentry session correlation; ownership routing).                   | Possible at analytics level (cohort drift over time); not native security tooling.                             | **Sentry stronger.** Cloudflare carries the edge security signal; Sentry carries the application security signal; PostHog adds longitudinal cohort/trend visibility but not incident response. PostHog is *additive*, not substitute.                               |

**Two-by-four mapping**: across the four MVP personas, Sentry is the
natural primary for two (engineer, on-call/security); PostHog is the
strongest current candidate for the other two (data scientist,
product owner) **if** Sentry-native surfaces prove ergonomically
insufficient in real usage; the accessibility axis is delivered by
*schema* and emission discipline regardless of sink. None of these
mappings amount to a present-tense "must adopt PostHog" — that
judgement is traffic-shaped and held open by
`future/second-backend-evaluation.plan.md`. What this matrix
establishes is the *option space*, not the decision.

Compared to the clean document's hedging "use both" recommendation,
the Oak-frame version is more conditional: PostHog is the most
plausible second sink for the product/data-science personas if
Sentry's surfaces don't carry them, and the architectural seams
should keep that option cheap (§4, §11). Neither this overlay nor
the strategic plans yet have the Sentry-insufficiency evidence
needed to move from option to commitment.

---

## 4. Schema-shape implications — what the seven MVP events demand of each sink

The vendor-independence clause in ADR-162 is operationalised through
the seven Zod-defined event schemas being authored in
[`packages/core/observability-events/`](../../plans/observability/current/observability-events-workspace.plan.md).
The seven events are: `tool_invoked`, `search_query`,
`widget_session_outcome`, `feedback_submitted`, `auth_failure`,
`rate_limit_triggered`, `a11y_preference_tag`. Each carries
correlation keys (anonymous session ID, MCP session ID, tool-call ID,
trace ID).

The clean document's "use both vendors" recommendation hand-waves
this layer. For Oak the schema-shape question *is* the architectural
question. If the schemas are Sentry-shaped, PostHog adoption is a
refactor; if they are PostHog-shaped, Sentry's traces lose
information; if they are vendor-neutral, an adapter per sink lifts
them into vendor-native payloads at the edge. The third option is
ADR-162's stated direction.

| Event                      | Sentry-native lift                                                                          | PostHog-native lift                                                                | Friction                                                                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tool_invoked`             | Span (parent of any call-chain), tags = subject/key-stage/year-group/keyword/thread.        | `capture('tool_invoked', { ... })` with same tags as properties.                   | Low. Both sinks accept the tag set as first-class. Sentry insists on a span; PostHog insists on a `distinct_id` (which is the anonymous session ID in Oak's case).                                                    |
| `search_query`             | Span + custom measurement for `result_count`. Numeric histograms native.                    | `capture('search_query', { result_count })`. HogQL handles log-scale buckets well. | Low–medium. Sentry's measurements are span-attached; PostHog's properties are event-attached. The schema must define `result_count` as a property *and* a measurement, or normalise to one and lift to the other.   |
| `widget_session_outcome`   | Replay attached when sampled; outcome as tag.                                               | `capture('widget_session_outcome', { outcome })`; replay attached when sampled.    | Low. Both sinks support an "outcome" categorical and replay attachment; replay sampling policy differs (see §8).                                                                                                      |
| `feedback_submitted`       | Custom event; relates to issue/release.                                                     | `capture('feedback_submitted', { rating, comment_redacted })`.                     | Low. Identical shape on both sides.                                                                                                                                                                                  |
| `auth_failure`             | Issue + alert; ownership routing.                                                           | `capture('auth_failure', { reason })`; alert via webhook.                          | Low. Sentry is more idiomatic here.                                                                                                                                                                                  |
| `rate_limit_triggered`     | Issue + alert; ownership routing.                                                           | `capture('rate_limit_triggered', { limit, key_hash })`.                            | Low. Sentry is more idiomatic here.                                                                                                                                                                                  |
| `a11y_preference_tag`      | Tag on session/scope; Sentry has no a11y-specific surface so it is queried as a custom tag. | Property on event; PostHog has no a11y-specific surface so it is queried as a property. | Low. Neither sink has native a11y tooling; the axis is delivered by event design, not by sink choice.                                                                                                            |

**Implication for `observability-events-workspace.plan.md`**:
preserve a *vendor-neutral* `session_id` correlation key and ensure
`result_count` can be lifted by adapters into either property-only or
property-plus-measurement form without loss. Do not commit to any
PostHog-specific naming (`distinct_id`) or to dual-encoding
(`result_count` as both property and measurement) at the schema
layer until a named consumer requires it; either move would be
contrary to ADR-162's vendor-independence principle. The exploration
confirms (`structured-event-schemas-for-curriculum-analytics.md`
[§5.7](../../../docs/explorations/2026-04-18-structured-event-schemas-for-curriculum-analytics.md))
that the cross-vendor adapter shape is the right place for those
decisions, not the schema itself.

**Implication for `multi-sink-vendor-independence-conformance.plan.md`**:
the structural-import lint that forbids vendor SDKs in feature code
is necessary but not sufficient; a complementary check is desirable
that each event schema *can in principle* be lifted into both Sentry
and PostHog payloads via the adapter layer, without the schema
itself acquiring vendor shape. This is a candidate addition to that
conformance plan's WS3 — author when the second-sink question goes
live, not before.

The clean document's silence on this layer is the single largest
piece of evidence that it was not authored against Oak's situation:
for any team that has decided vendor-independence at the architecture
level, the schema-shape question is the question.

---

## 5. Cost / volume scenarios with arithmetic at modelled tiers

The clean document presents pricing as a vendor-comparison axis. For
Oak at modelled volumes for the next 12 months, pricing is *not* the
discriminator. This section shows the arithmetic.

**Scenario assumptions**

- Pricing snapshot date: 2026-04-19 (Stream B verification).
- Sentry SaaS, EU region (de.sentry.io), project
  `oak-open-curriculum-mcp` in `oak-national-academy`.
- PostHog Cloud EU (Frankfurt), hypothetical second sink for the MCP
  server only (does not affect existing PostHog usage on the principal
  Oak product).
- Anonymous-events slice of PostHog assumed (the MCP server's
  no-end-user-identity context plus the redaction policy plus
  ADR-160's closure rule together yield this posture in practice
  today; see §6 for the careful derivation). PostHog's
  identified-event price multiplier is therefore not modelled.
- Replay sampling per current `observability.md` recommendation
  (replay-on-error sampling at modest rate).

**Tier 1 — Private alpha today (~near-zero traffic)**

| Signal           | Modelled monthly volume | Sentry charge                    | PostHog charge |
| ---------------- | ----------------------- | -------------------------------- | -------------- |
| Errors           | ~5                      | $0 (free dev tier; 5K included)  | n/a            |
| Spans            | ~1K                     | $0 (5M included on Team)         | n/a            |
| Replays          | ~0–5                    | $0 (50 included)                 | $0 (5K free)   |
| Logs             | <0.1 GB                 | $0 (5 GB included)               | n/a            |
| Analytics events | ~5–50                   | n/a                              | $0 (1M free)   |
| Feature flags    | 0                       | $0 (no FF tier yet)              | $0 (1M free)   |
| **Subtotal**     |                         | **$26/mo Team base** (or $0 dev) | **$0**         |
| **Annualised**   |                         | **$0–$312/yr**                   | **$0/yr**      |

At alpha volumes, both vendors are free. The only spend is the
optional Sentry Team-plan base subscription that Oak is already on for
features beyond the dev tier (SAML, longer history, etc).

**Tier 2 — Public beta launch (modelled from launch-criteria persona load)**

The high-level plan does not state a target user count for public
beta; this scenario uses a deliberately conservative model: 1,000
distinct anonymous sessions per month, ~10 tool invocations per
session, ~5 searches per session, 50 replays sampled per month, 1%
error rate.

| Signal                  | Modelled monthly volume                              | Sentry charge                                          | PostHog charge                       |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------ | ------------------------------------ |
| Errors                  | ~100                                                 | $0 (50K included)                                      | $0 (100K exceptions free)            |
| Spans                   | ~45K (3 spans × 15K invocations)                     | $0 (5M included)                                       | n/a                                  |
| Replays                 | ~50                                                  | $0 (50 included)                                       | $0 (5K free)                         |
| Logs                    | ~1 GB                                                | $0 (5 GB included)                                     | n/a                                  |
| Analytics events (anon) | ~15K (`tool_invoked` + `search_query` + outcomes)    | n/a                                                    | $0 (1M free)                         |
| Feature-flag requests   | hypothetical 10K                                     | n/a (Sentry doesn't host flags; integration only)      | $0 (1M free)                         |
| **Subtotal**            |                                                      | **$26/mo base** (Team)                                 | **$0**                               |
| **Annualised**          |                                                      | **$312/yr**                                            | **$0/yr**                            |

**Tier 3 — Twelve months post-launch (modelled at 10× growth)**

| Signal                  | Modelled monthly volume   | Sentry charge                                                                                     | PostHog charge        |
| ----------------------- | ------------------------- | ------------------------------------------------------------------------------------------------- | --------------------- |
| Errors                  | ~1K                       | $0 (50K included)                                                                                 | $0 (100K free)        |
| Spans                   | ~450K                     | $0 (5M included)                                                                                  | n/a                   |
| Replays                 | ~500                      | overage 450 (Team includes 50). Replay PAYG rate not on the public pricing slider used 2026-04-19; estimated ~$0.30 per additional 50 replays from prior published rates. **Verify before any decision.** | $0 (5K free)          |
| Logs                    | ~5 GB                     | $0 (5 GB included)                                                                                | n/a                   |
| Analytics events (anon) | ~150K                     | n/a                                                                                               | $0 (1M free)          |
| Feature-flag requests   | hypothetical 100K         | n/a                                                                                               | $0 (1M free)          |
| **Subtotal**            |                           | **$26 + replay overage**                                                                          | **$0**                |
| **Annualised**          |                           | **~$312–$600/yr**                                                                                 | **$0/yr**             |

**Conclusion**: at modelled 12-month volumes, the vendor cost
difference is approximately $300–$600/year. That is not a meaningful
decision input. The discriminator is *capability ergonomics for the
four MVP personas* and *the ADR-160 anonymous-only constraint on
PostHog's identified-events differentiation*, not licence cost.

**Discrepancy disclosure**: the modelled volumes above are
deliberately conservative because the MCP server is in private alpha
and we do not yet have real usage data. Real launch volumes might be
materially lower (no users yet) or materially higher (Oak's
principal-product user base could spike adoption). Either way, both
vendors stay free or near-free until volumes cross thresholds at
least an order of magnitude above anything in the current
roadmap. Cost is therefore not a decision-blocker; the analysis is
*possibility-shaped*, not budget-shaped.

---

## 6. Compliance, data residency, and the redaction barrier

The clean document treats compliance as a parity item. For Oak it is
the most important constraint, and it is enforced by ADR-160, not by
either vendor. This section makes the constraint explicit.

**Vendor compliance posture (Stream B, 2026-04-19)**

| Item                              | Sentry                                                                 | PostHog                                                                |
| --------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| GDPR (Art. 28 processor)          | Yes; DPA available                                                     | Yes; DPA available                                                     |
| EU data residency                 | Yes (de.sentry.io — Oak is on this region)                             | Yes (Frankfurt — `eu.posthog.com`)                                     |
| US-EU Data Privacy Framework      | Certified                                                              | Available                                                              |
| HIPAA BAA                         | Available on Business tier and higher                                  | Available with BAA scoping on Cloud                                    |
| SOC 2 Type II                     | Yes                                                                    | Yes                                                                    |
| ISO 27001                         | Yes                                                                    | Yes                                                                    |
| Data-retention windows            | Errors 90 days (Team)/90+ days (Business); spans 30 days; logs varies  | Configurable per product; up to 7 years on paid product analytics     |

Both vendors clear Oak's compliance bar; neither is a blocker.

**The actually-binding constraint: ADR-160 + the MCP server's identity model**

[ADR-160](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
mandates that **every fan-out path that carries telemetry data to
any external destination must apply the shared redaction policy
before transmission, with no consumer-side bypass**. ADR-160 is a
**closure-property principle** about applying *the* redaction policy
on every fan-out path; it is not by itself a rule that forbids
identifying information. What ADR-160 ensures is that *whatever the
redaction policy redacts* is redacted on every path, regardless of
hook shape, runtime, or vendor. The redaction barrier is implemented
in [`packages/libs/sentry-node`](../../../packages/libs/sentry-node/README.md)
and being extracted to
[`packages/core/telemetry-redaction-core/`](../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
(L-12-prereq).

The MCP server's *practical* anonymous posture for PostHog comes
from the combination of three facts, of which ADR-160 is one:

1. The MCP server is fundamentally a server-to-server protocol; it
   has no end-user account model of its own. Any user identity
   present in observability context (e.g., the
   `observability.setUser({ id: userId })` enrichment in
   `apps/oak-curriculum-mcp-streamable-http/src/mcp-handler.ts`)
   originates upstream from a federated identity provider, not from
   Oak account holders.
2. The shared redaction policy strips user-identifying values from
   telemetry payloads as part of its hardening; identifying context
   that does flow into observability today flows through Sentry
   scope enrichment (a Sentry-side feature) rather than into the
   event-data envelope.
3. ADR-160 ensures (2) is non-bypassable across every fan-out path,
   including any future PostHog adapter.

The practical consequence for PostHog at Oak: PostHog's
identified-events product (autocapture, identity merging, person
timelines, customer profiles) cannot be wired in the obvious way,
because either (a) the wiring would bypass the redaction policy
(forbidden by ADR-160) or (b) there is no end-user identity to
attach to in the MCP server's protocol context. The available slice
of PostHog at Oak is therefore the anonymous-events slice — funnels,
retention, HogQL, experiments — over server-issued anonymous session
identifiers.

This is a *target operating constraint* derived from the current
identity model and the redaction policy, not a clause in ADR-160
itself. If a future change altered (1) — e.g., the MCP server
acquired an end-user account model — the constraint would need to be
re-derived from policy rather than assumed.

**Two further consequences for sequencing**:

- **Any second-sink integration must extend the same redaction
  barrier closure proof.** The
  [`multi-sink-vendor-independence-conformance.plan.md`](../../plans/observability/current/multi-sink-vendor-independence-conformance.plan.md)
  currently proves emission persistence under `SENTRY_MODE=off`. A
  PostHog adapter would need an analogous closure proof: when
  redaction is active, no PII reaches PostHog. This is a *small*
  addition once the redaction core is extracted; it is a *large*
  addition if the extraction has not happened. L-12-prereq
  sequencing therefore matters for any PostHog decision.
- **`security-reviewer` is the right authority on what the
  redaction policy actually strips today.** The argument above
  treats "strips identifiers" as the current policy posture; a
  formal review of `runtime-redaction.ts` field-by-field would be
  needed before any PostHog adapter authoring.

**Implication for the second-backend-evaluation plan** (which
currently enumerates engineering-observability candidates only —
Datadog, Honeycomb, NewRelic, Grafana+Loki+Tempo, self-hosted OTel —
and does not list PostHog): if PostHog is admitted as a candidate by
that plan, the question "should we add PostHog?" decomposes into
three sub-questions: (a) is the *anonymous-events* slice of PostHog
enough to justify a second sink for the data-scientist and
product-owner personas, (b) does the redaction-core extraction land
before the PostHog adapter is wired, and (c) is the MCP server's
no-end-user-identity model expected to remain stable across the
adapter's lifetime. Question (a) is traffic-shaped; questions (b)
and (c) are decidable now from sequencing and product-direction
respectively. See §11.1 for the scope-widening disclosure.

---

## 7. Feature-flag question — OpenFeature seam, Sentry FF integration scope

The clean document treats feature flags as a PostHog-native
capability and does not address the Sentry side. For Oak this is a
worth-mapping sub-question — but explicitly *not* a present-tense
decision. L-10 in the maximisation plan is intentionally
*"Feature-flag scaffolding — TSDoc extension point only
(MVP-deferred)"*; the active provider-seam choice belongs to
[`future/feature-flag-provider-selection.plan.md`](../../plans/observability/future/feature-flag-provider-selection.plan.md),
which is explicitly held in wait until a real flag consumer exists
("the stub exists so the extension point is documented; no real flag
is wired because there is no use case … pre-committing a shape
before a real consumer risks locking in a wrong API"). What this
overlay can usefully add is the *evaluation criterion* a future
provider-seam decision should preserve, not the seam decision
itself.

**Status of OpenFeature** (Stream B, 2026-04-19)

OpenFeature is a CNCF *incubating* project that publishes a
vendor-agnostic feature-flag API + provider model + evaluation hook
model. The OpenFeature specification is split into normative
sections with maturity statuses: most of the core (flag evaluation
API, provider interface, evaluation context) is **Stable**; some
sections (telemetry hooks, transactional context propagation) are at
**Hardening**; a minority of newer surfaces are **Experimental**.
Conformance is testable and there is a community-maintained
provider for PostHog.

**Sentry's feature-flag integration** (Stream B, 2026-04-19)

Sentry has a *feature-flag integration* (in beta), which is **not** a
flag-hosting product. It is a context-enrichment integration that
attaches the most recent flag evaluations to error events and
provides change-tracking ("which flags changed near this issue"). It
ships first-class adapters for: **Flagsmith, LaunchDarkly, Statsig,
Unleash**, and a **Generic webhook**. There is no first-party
OpenFeature adapter. Wiring an OpenFeature provider through to
Sentry's evaluation tracker today requires either (a) the Generic
webhook bridge or (b) a custom hook on the OpenFeature provider that
calls Sentry's `featureFlagsIntegration` SDK directly.

**The option space the future provider-seam decision will face**

The architectural choice the future provider-seam decision will
face has three flavours, with their cost shapes:

1. **Pick a provider directly (e.g., LaunchDarkly, Flagsmith,
   Statsig, Unleash, PostHog).** Lowest integration cost; couples
   feature code to a single provider's evaluation API; Sentry
   change-tracking works out of the box for the four direct-adapter
   providers and via Generic webhook for any other (including
   PostHog).
2. **Adopt OpenFeature as the application-side API; choose the
   provider underneath.** Highest portability; consistent with
   ADR-162's vendor-independence pattern (the same carve-out shape
   ADR-078 + ADR-162 §3 use for observability adapters, applied to
   flags); requires a custom hook to bridge OpenFeature evaluation
   events into Sentry's `featureFlagsIntegration`. The hook itself
   is a small, well-documented pattern. The cost is the OpenFeature
   API surface and the bridge maintenance.
3. **Defer the abstraction question; pick a provider when the first
   real consumer arrives.** Cheapest today; cost scales with how
   many flag-evaluation call sites accrete before re-platforming.
   Acceptable while the call-site count is zero or near-zero.

**Evaluation criteria the future provider-seam decision should
preserve** (decidable now from existing doctrine; this is what the
overlay contributes):

- The chosen seam should not put a vendor SDK inside feature code —
  this is ADR-162 mechanism #3 applied at the flag-evaluation
  boundary. Equivalent to: the seam must allow a provider swap
  without rewriting feature code.
- The chosen seam should preserve the link between flag-evaluation
  context and Sentry crash context. Sentry's
  `featureFlagsIntegration` is the canonical surface; whatever the
  seam is must reach it (via a direct adapter for one of the four
  listed providers, or via the Generic webhook, or via a custom
  hook from an OpenFeature provider).
- The chosen seam should not pre-commit the change-tracking
  webhook URL or the provider identifier in observability event
  schemas — those are configuration, not contract.

These criteria are decidable now and can be lifted directly into
[`future/feature-flag-provider-selection.plan.md`](../../plans/observability/future/feature-flag-provider-selection.plan.md)
as evaluation gates for the eventual provider/seam choice. The
seam *itself* — option 1, 2, or 3 — should remain strategic until a
real flag consumer lands, per the plan's stated posture and per
L-10's deliberate TSDoc-only scope. Recommending the seam choice
now would be a masquerading-blocking move on a plan the owner has
explicitly held in wait.

---

## 8. Replay overlap and complementarity (decisive correction to clean.md)

**TL;DR**: at Oak's modelled MVP volumes, the cost of running both
Sentry replay and PostHog replay is **$0** (both within free tiers;
§5). The clean document's "don't duplicate replays" advice is sound
at the volumes its scenarios assumed but does not bite for Oak. The
real question is therefore *whether Oak needs behaviour-replay at
all*, which is a product/a11y-axis judgement that is independent of
the engineering-axis Sentry replay decision.

The clean document treats Sentry replay and PostHog replay as
substitutable signals and recommends not running both to avoid
"double-billing". At Oak's volumes that arithmetic does not apply;
beyond the arithmetic, the two surfaces are not substitutable in any
case.

**Different recordings for different jobs** (current vendor sampling
patterns per Sentry SDK docs and PostHog product docs, 2026-04-19):

- **Sentry replay** is debug-shaped. The recommended sampling pattern
  is `replaysOnErrorSampleRate` ≈ 1.0 with `replaysSessionSampleRate`
  ≈ low (e.g., 0.1). The replay is the *evidence attached to an
  issue*, viewed in the Issues UI alongside the stack trace. The
  consumer is the engineer triaging the bug.
- **PostHog replay** is behaviour-shaped. The sampling pattern is
  cohort-driven (record sessions matching a behaviour cohort). The
  replay is the *evidence attached to a funnel-step drop-off*, viewed
  in the Replay UI alongside the cohort definition. The consumer is
  the product owner / a11y reviewer / data scientist understanding
  why users behave a certain way.

**Cost arithmetic** (continuing §5 modelled tier 2 of 50 replays/mo):
both vendors include this in their free tier. Even if Oak ran replay
on both for the entire MVP envelope, the cost is **$0**. There is no
double-billing at modelled volumes.

**Therefore**: the question is not "should we duplicate replays" (the
clean doc's framing). The question is *whether Oak needs behaviour-
replay at all*, which is an a11y-axis and product-axis question that
is independent of the engineering-axis Sentry replay decision. The
relevant inputs are:

- A11y observability plan (`current/accessibility-observability.plan.md`)
  may want behaviour-replay to investigate `a11y_preference_tag`
  cohorts that lead to incomplete sessions.
- Product owner persona (per the launch criterion) may want
  behaviour-replay to investigate `widget_session_outcome ≠ ok`
  cohorts.

If the answer to either is "yes", PostHog replay is the natural
fit; Sentry replay does not address those use cases regardless of
sampling configuration. If the answer to both is "no", PostHog
replay is post-MVP and the question is empty.

The right question is therefore *whether the a11y and product MVP
deliverables need behaviour-replay*. That judgement is plan-decidable
in principle (from `current/accessibility-observability.plan.md` and
the product-owner persona's first-order questions), but the strongest
evidence will come from the first traffic that surfaces a question
neither stack-trace context nor categorical-axis aggregation can
answer. This overlay holds the question open rather than pre-empting
it; §11.1 records replay-need as remaining open and usage-shaped.

---

## 9. Self-host posture — moot for Oak

The clean document presents self-hosting as a real option and
analyses both vendors' postures in detail. For Oak this is a
non-decision and stating that explicitly saves L-15 from re-asking it.

**Stream B verification (2026-04-19)**

| Item                       | Sentry self-hosted                                                               | PostHog self-hosted                                                              |
| -------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Licence                    | FSL-1.1-Apache-2.0 (Fair Source; converts to Apache 2.0 after two years)         | MIT                                                                              |
| Cost                       | Free at any volume                                                               | Free at any volume                                                               |
| Excluded features          | AI/ML (Seer), spike protection, spend allocation, some mobile stack-trace, support | Paid features (warehouse-tier integrations etc.), support                        |
| Minimum infra              | 4 CPU cores, 16 GB RAM + 16 GB swap, 20 GB disk; multi-component stack (Relay, Snuba, Kafka, ClickHouse, Redis, Postgres, Symbolicator) | 4 vCPU, 16 GB RAM, ≥ 30 GB storage; single-machine deployment                    |
| Operational appetite       | Heavy (component count + upgrades + storage growth)                              | Heavy (community-only support; "won't scale past a few hundred K events" per vendor) |
| Vendor-stated audience     | "Low-traffic, < 1M events/month" or specialist deployments                       | "Hobbyists / unusual deployments"                                                |

**Why this is moot for Oak**: Oak is on Sentry SaaS in the EU region
already; the principal Oak product is on PostHog Cloud already. The
infrastructure team's appetite for adopting Kafka + ClickHouse +
Symbolicator + Snuba for a private-alpha MCP server's observability
stack is, by inspection, zero. There is no scenario in which self-
hosting either vendor is the right answer for the MCP server during
MVP, and the cloud free/low tiers cover modelled volumes (§5).

If a future regulatory event ever forced fully on-premises
observability, Sentry self-hosted is the only realistic candidate
because PostHog's vendor-stated single-machine cap is below the
expected post-MVP traffic. But this is not a decision being asked
today.

---

## 10. Seven assumption stress tests

The clean document accepts a number of generic assumptions about
vendor selection that need explicit stress-testing against Oak's
frame. Each test below states the assumption, the method used to
test it, and the verdict.

**Test 1 — "Vendor choice should be evidence-driven."**

- **Method**: trace which architectural decisions must be settled
  before vendor selection vs which can defer.
- **Verdict**: **PARTIALLY HOLDS.** Vendor *selection* can defer to
  evidence (and should — see §10 Test 7). But the *architectural
  seams* that make later vendor selection cheap or expensive must be
  settled now: schema vendor-neutrality (events workspace, in
  flight); redaction barrier closure across all sinks (ADR-160,
  L-12-prereq); composition-root-only vendor imports (ADR-162
  mechanism #5, conformance test in flight); OpenFeature seam
  decision (L-10, see §7). If these settle now, the vendor decision
  is configuration; if they don't, every later vendor decision is a
  refactor.

**Test 2 — "PostHog is the natural second sink."**

- **Method**: cross-reference the seven MVP event schemas against
  PostHog's `capture()` shape; cross-reference the ADR-160 constraint
  against PostHog's product-analytics differentiation.
- **Verdict**: **PARTIAL FIT, NOT NATURAL.** Five of seven events lift
  cleanly into PostHog's shape (§4). Two (`auth_failure`,
  `rate_limit_triggered`) sit at the security axis where Sentry is
  idiomatic and PostHog adds no axis-specific value. PostHog's
  competitive advantage rests on identified-event person profiles
  (autocapture, identity merging, person timelines, customer
  profiles); the MCP server has no end-user account model and the
  redaction policy strips identifiers, so the practical PostHog
  slice available at Oak is the *anonymous-events slice* — funnels,
  retention, HogQL, experiments — without the identified-user
  product. (See §6 for why this follows from the identity model +
  redaction policy + ADR-160 closure rule together, rather than from
  ADR-160 alone.) Whether that slice justifies a second sink is the
  question `future/second-backend-evaluation.plan.md` would pose if
  PostHog is admitted as a candidate (the plan currently lists
  engineering-observability candidates only; see §11.1 for the
  scope-widening disclosure).

**Test 3 — "OpenFeature is the obvious abstraction layer for any
provider."**

- **Method**: verify OpenFeature spec maturity; check Sentry's feature-
  flag integration provider list for OpenFeature support; check
  PostHog's OpenFeature provider availability.
- **Verdict**: **HOLDS WITH CAVEAT.** OpenFeature is CNCF-incubating;
  the core API surfaces are Stable; some peripheral surfaces are
  Hardening or Experimental. Sentry's feature-flag integration (beta)
  does not list OpenFeature as a first-party provider; bridging
  requires a small custom hook calling
  `featureFlagsIntegration`. PostHog has a community-maintained
  OpenFeature provider. The abstraction is realistic and
  well-precedented; it is *not* zero-effort to bridge to Sentry's
  change-tracking. See §7 for option space.

**Test 4 — "Sentry can answer the data scientist's product-axis
questions alone."**

- **Method**: compare Sentry capability surface to the categorical-
  axis vocabulary in
  [exploration 4 §4.3](../../../docs/explorations/2026-04-18-structured-event-schemas-for-curriculum-analytics.md)
  (subject, key_stage, year_group, keyword, thread).
- **Verdict**: **DOES NOT HOLD AS-IS BUT CAN BE FORCED.** Sentry's
  Insights is event-based, supports tags + measurements + custom
  dimensions, and a `tool_invoked` event with `subject` tag *is*
  queryable in Sentry. But: cohort-style "users who triggered tool A
  then tool B" (funnel/path) is native in PostHog and awkward in
  Sentry; `result_count` log-scale buckets are easier in PostHog;
  Sentry's product-analytics affordances are debug-flavoured rather
  than analytics-flavoured. **The ergonomics are wrong for the
  data-scientist persona named in the launch criteria**, even though
  the capability technically exists.

**Test 5 — "Replay overlap is double-billing."**

- **Method**: compare default sampling models and consumer journey for
  Sentry replay vs PostHog replay; do the cost arithmetic at modelled
  volumes (§5).
- **Verdict**: **DOES NOT HOLD.** The two replay surfaces record
  *different things* for *different consumers*. At modelled MVP
  volumes the cost of running both is $0 (both within free tiers).
  See §8 for full treatment. The right question is whether Oak needs
  behaviour-replay at all, decidable from a11y / product MVP plans.

**Test 6 — "The promotion trigger should fire on usage evidence."**

- **Method**: enumerate the seven sibling explorations' promotion
  triggers; classify each as usage-shaped or architecture-shaped.
- **Verdict**: **PARTIALLY HOLDS.** Most triggers are usage-shaped
  ("first incident requiring X", "WS1 RED opens"). A smaller set is
  decidable now from existing doctrine without traffic:
  vendor-independence test shape (decidable now from the
  event-workspace schemas); the OpenFeature *evaluation criteria*
  (decidable now from §7 — but *not* the seam itself, which the
  plan-of-record holds in wait until a real consumer arrives); the
  cross-vendor adapter shape (already explored in
  [exploration 4 §5.7](../../../docs/explorations/2026-04-18-structured-event-schemas-for-curriculum-analytics.md));
  trace-propagation host policy (decidable from
  [`trust-boundary-trace-propagation-risk-analysis.md`](../../../docs/explorations/2026-04-18-trust-boundary-trace-propagation-risk-analysis.md)
  alone). Usage-shaped triggers genuinely need traffic: pricing
  validation, replay value at scale, AI-instrumentation placement,
  alert thresholds, the OpenFeature seam choice itself.

**Test 7 — "Doing this analysis now is proportional."** (meta-test)

- **Method**: meta-reflection plus inversion. Given private alpha +
  parallel Sentry agent + no PostHog account on this project, is
  this overlay worth authoring now? What would make the inverse
  ("this is premature") true?
- **Verdict**: **PARTIALLY HOLDS.** The overlay is proportional only
  if it is used to sharpen evaluation criteria for already-live
  plan surfaces (events-workspace schema shape, redaction-core
  sequencing, OpenFeature evaluation criteria, second-backend
  candidate framing) — *not* to force pre-traffic decisions on plans
  that have been deliberately held in wait. The honest reasons it is
  worth authoring now: (a) the events workspace schema is being
  authored *now* and benefits from explicit vendor-neutrality stress
  tests (§4) — this is a real, current consumer; (b) the
  redaction-barrier extraction (L-12-prereq) is sequencing-critical
  for any future PostHog adapter (§6) — this is a real, current
  sequencing claim; (c) the second-backend-evaluation plan currently
  enumerates engineering-observability candidates only and the
  overlay surfaces an honest scope-widening disclosure (§11.1) that
  the plan can either accept or reject. The honest reasons it is
  *not* yet validated: (d) downstream uptake is currently
  anticipated, not observed — none of the strategic plans yet
  reference this overlay; (e) Test 7 risks self-ratification, and
  the inversion ("the supposed now-decidable items are actually
  not") is genuinely live for the OpenFeature seam (per upstream
  plan posture) and partly live for the schema-shape items (per
  vendor-independence doctrine). *Mitigation*: §11 explicitly
  separates "now decidable from doctrine" items from "now decidable
  from real consumers" items, and avoids the trap of recommending
  the seam choice; the overlay's value is the option space and the
  evaluation criteria, not the choices.

---

## 11. What this informs — decisions surfaced, decisions not made, sequencing

This overlay is not a vendor pick. It is the evidence base for the
following downstream surfaces. Each entry names what the overlay
clarifies, what is now decidable, and what remains open.

### 11.0 Direct answers to the canonical exploration's six research questions

The canonical exploration stub
[`docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md`](../../../docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md)
poses six numbered research questions. The answers below are the
parallel-commit-ready lift target for that exploration's body.

**Q1 — Which product-axis questions from the MVP set does Sentry's
product-analytics surface answer well, and which require
PostHog-shaped capability?**

*Answer*: Sentry can answer the *categorical-axis* slice (subject,
key_stage, year_group, keyword, thread aggregations on
`tool_invoked` / `search_query` events) via Insights tags +
measurements + custom dashboards (see §3 Product row). It is
*ergonomically awkward* for cohort-shaped queries (funnels, paths,
retention) and for log-scale numeric distributions like
`result_count`; PostHog is native for both. The categorical-axis
subset of the data-scientist persona's first-order questions is
likely answerable on Sentry alone; the cohort/funnel subset is not.
See §3 + §10 Test 4. Whether the cohort/funnel slice is needed at
MVP is traffic-shaped and not yet decided.

**Q2 — Does Sentry's session-replay capability cover the
usability-axis needs, or is PostHog's session-replay materially
different?**

*Answer*: They are materially different and not substitutable.
Sentry replay is debug-shaped (replay-on-error sampling, attached to
issues, consumed by engineers triaging bugs). PostHog replay is
behaviour-shaped (cohort-driven sampling, attached to funnel-step
drop-offs, consumed by product/a11y/data-science personas
investigating *why* users behave a certain way). Sentry replay does
not cover the behaviour-investigation use case regardless of
sampling configuration. Whether Oak needs the behaviour-investigation
use case at MVP is the actual question; it is decidable in principle
from `current/accessibility-observability.plan.md` and the
product-owner persona's first-order questions, and traffic-shaped in
practice. See §8.

**Q3 — How do the feature-flag / experimentation surfaces compare
for Oak's expected A/B experiment volume?**

*Answer*: Sentry does not host feature flags; it offers a
*feature-flag integration* (in beta) that attaches recent flag
evaluations to error events and provides change-tracking. First-party
provider adapters: Flagsmith, LaunchDarkly, Statsig, Unleash, plus
a Generic webhook. PostHog hosts feature flags natively
(1M flag requests in the free tier; experiments product included).
Oak's expected A/B experiment volume is not yet defined and the
provider-seam choice is deliberately deferred by L-10 + the
provider-selection plan's "in wait" posture. The evaluation criteria
the future seam choice should preserve are decidable now (§7); the
seam choice itself is not. See §7 + §11.2.

**Q4 — What is the minimal additional field set the event-schema
workspace would need to produce PostHog-native `capture()` payloads
without Sentry-specific coupling?**

*Answer*: With the schemas held vendor-neutral as the events
workspace already plans, the minimal additional surface is *not* in
the schema fields — it is in the adapter layer (exploration 4 §5.7).
The adapter would need: (i) a mapping from `session_id` to PostHog's
`distinct_id`; (ii) a mapping from any numeric measurement field
(`result_count` is the current example) to PostHog property shape;
(iii) a one-to-one event-name lift; (iv) the redaction-policy
closure proof for the new fan-out path. None of these belong in the
schema itself; all belong in the adapter. See §4 + §11.4.

**Q5 — Which vendor's alerting + anomaly-detection capability is
stronger for Oak's expected signal volume?**

*Answer*: Sentry is stronger for incident-shaped alerting on the
engineering and security axes (issue-grouped alerts, ownership
routing, Sentry-native SLA workflows; AI-assisted root-cause via
Seer on SaaS). PostHog is stronger for cohort-shaped anomaly
detection on the product axis (cohort drift, funnel-step regression
on rollout, experiment-result anomalies). For the MCP server's
modelled MVP volumes (§5), neither vendor's anomaly-detection
threshold tuning is yet a decision worth making — the alert-
threshold work is explicitly traffic-shaped (see L-13 in the
maximisation plan). See §3 Engineering + Security rows.

**Q6 — What are the licence-cost and data-residency implications of
emitting identical structured events to both?**

*Answer*: At Oak's modelled 12-month volumes, the licence-cost delta
of running both vendors is approximately $300–$600/year, dominated
by the Sentry Team-tier base subscription Oak is already paying
(see §5 modelled tiers 1–3 with arithmetic). PostHog at modelled
volumes stays in its free tier across all instrumented signals.
Data residency is parity: both vendors offer EU regions
(de.sentry.io and Frankfurt respectively); both offer GDPR DPAs;
both offer HIPAA BAA scoping (Sentry Business+ tier; PostHog Cloud).
The binding constraint is the redaction-policy closure proof
(§6) — every fan-out path applies the same redaction policy — not
the vendor's compliance posture. See §5 + §6.

### 11.1 `future/second-backend-evaluation.plan.md` — scope-widening disclosure

- **Scope-widening disclosure**: the plan as currently written
  enumerates engineering-observability candidates (Datadog,
  Honeycomb, NewRelic, Grafana+Loki+Tempo, self-hosted OTel) and
  does not list PostHog. This overlay considers PostHog as an
  additional candidate framing under the persona-mapped MVP gate
  (data scientist + product owner). That is a scope widening the
  plan owner can accept, reject, or partially accept. The overlay
  does not assume the widening is accepted.
- **Clarified** (regardless of the widening decision): if PostHog
  is admitted, PostHog at Oak is the *anonymous-events slice* of
  PostHog — funnels + retention + HogQL + experiments — over
  server-issued anonymous session identifiers. The slice is a
  consequence of the MCP server's no-end-user-identity model + the
  redaction policy + ADR-160's closure rule together; it is not a
  clause in ADR-160 (see §6 for the careful derivation). If the
  identity model changes, the constraint must be re-derived.
- **Now decidable from doctrine** (no traffic needed):
  - Sequencing constraint — any PostHog adapter is downstream of
    the redaction-core extraction (L-12-prereq).
  - Vendor-neutral schema posture — `session_id` stays vendor-
    neutral; `result_count` lifts via adapter (§4); no
    PostHog-specific naming or dual-encoding at the schema layer.
- **Remains open** (usage-shaped, defer to evidence):
  - Whether the second-backend-evaluation plan accepts the PostHog
    scope widening.
  - Whether anonymous-events PostHog outperforms Sentry Insights on
    the data-scientist persona's actual queries.
  - Whether behaviour-replay is needed (drives PostHog-replay
    decision).

### 11.2 `future/feature-flag-provider-selection.plan.md`

- **Clarified**: OpenFeature is realistic (CNCF incubating; Stable
  core API surfaces, Hardening/Experimental peripheral surfaces).
  Sentry's feature-flag *change tracking* lists Flagsmith,
  LaunchDarkly, Statsig, Unleash, and a Generic webhook as
  first-party providers; bridging any other provider (including an
  OpenFeature provider) requires either the Generic webhook or a
  custom hook calling `featureFlagsIntegration`.
- **Now decidable** (evaluation criteria only, not the seam itself):
  - the chosen seam must not put a vendor SDK in feature code
    (ADR-162 mechanism #3 applied to the flag-evaluation boundary);
  - the chosen seam must reach Sentry's `featureFlagsIntegration`
    so flag context surfaces with errors;
  - the chosen seam must not pre-commit provider identifiers in
    observability event schemas (configuration, not contract).
- **Remains open** (the plan-of-record holds these in wait until a
  real flag consumer arrives, and this overlay does not seek to
  unsettle that posture):
  - The seam choice itself (option 1, 2, or 3 in §7).
  - The provider identity (PostHog, LaunchDarkly, Flagsmith,
    Statsig, Unleash, or other).

### 11.3 `active/sentry-observability-maximisation-mcp.plan.md`

- **Clarified**: L-15 (vendor-count question) is sharpened from
  "should we add a second vendor" to "have the architectural seams
  that make a second vendor cheap actually landed, and is there a
  named persona-question Sentry cannot answer ergonomically". Those
  seams are: the event schemas (§4), the redaction-core extraction
  (§6), the candidate cross-vendor adapter shape (exploration 4
  §5.7), the conformance lint (§4 last paragraph).
- **No new decisions for L-10**: L-10 stays as the
  TSDoc-extension-point-only stub the plan-of-record specifies.
  The OpenFeature evaluation criteria above (§11.2) belong to
  `future/feature-flag-provider-selection.plan.md`; L-10 carries
  the extension point shape, not the seam decision.
- **Remains open**: L-15 itself stays usage-shaped — the trigger is
  "first axis-specific question the engineer-persona surface
  cannot answer", which requires traffic to fire.

### 11.4 `current/observability-events-workspace.plan.md`

- **Clarified**: WS3 schema design should preserve a vendor-neutral
  `session_id` correlation key and ensure `result_count` can be
  lifted by adapters into either property-only or
  property-plus-measurement form without loss. Do *not* commit
  schema naming or dual-encoding to either vendor's shape at the
  schema layer — that is the cross-vendor adapter's job
  (exploration 4 §5.7).
- **Now decidable from doctrine**: the vendor-neutrality posture
  above. No PostHog-specific schema commitments today.

### 11.5 `current/multi-sink-vendor-independence-conformance.plan.md`

- **Clarified**: when a second-sink question goes live, the plan
  could usefully add a check that each event schema can in
  principle be lifted into both Sentry and PostHog payloads via
  the adapter layer without the schema acquiring vendor shape
  (§4). This is *not* a recommendation to add the check now; the
  current scope (emission-persistence under `SENTRY_MODE=off` +
  structural import lint) is the right MVP scope.
- **Now decidable**: nothing in the current plan needs to change
  on the strength of this overlay alone.

### 11.6 `docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md`

- This overlay supplies the full text the canonical exploration was
  holding open at stub. The canonical exploration is updated
  separately (per plan, §2–§5 replaced) and stays the single
  citable source for `future/second-backend-evaluation.plan.md`.

### 11.7 Decisions explicitly *not* made by this overlay

- Does Oak adopt PostHog as a second sink? *Not decided.* Pending
  evidence + the persona-question test in
  `future/second-backend-evaluation.plan.md`.
- Which feature-flag provider does Oak pick? *Not decided.* Pending
  evidence in `future/feature-flag-provider-selection.plan.md`.
- Is Sentry sufficient for all five axes? *Not decided.* The
  capability matrix in §3 says no for two personas (data scientist
  and product owner), but "sufficient" is a usage-shaped judgement
  that needs traffic.
- Should self-hosting be considered? *Not now.* §9 makes this
  explicit.

---

## 12. References

Primary repo evidence (Stream A, 2026-04-19):

- `docs/architecture/architectural-decisions/162-observability-first.md`
  — five-axis principle, vendor-independence clause, mechanism set.
- `docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md`
  — redaction-barrier closure property; binding constraint on PostHog
  identified-events.
- `docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md`
  — structural prerequisite for vendor independence.
- `docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md`
  — DI seam for observability adapters.
- `.agent/plans/observability/high-level-observability-plan.md`
  — five-axis MVP scope; persona launch criteria.
- `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
  — active Sentry maximisation lanes (L-0..L-15); L-10 (OpenFeature),
  L-12-prereq (redaction-core extraction), L-15 (vendor-count
  reframe).
- `.agent/plans/observability/current/observability-events-workspace.plan.md`
  — Zod-first event-schema workspace; seven MVP events.
- `.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md`
  — emission-persistence test + structural import lint.
- `packages/libs/sentry-node/README.md` — three modes (`off`,
  `fixture`, `sentry`); DI seam; redaction barrier; fixture store.
- `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`
  — three `SENTRY_MODE` settings; `wrapMcpServerWithSentry`; release
  metadata; source-map upload; replay sampling defaults.
- `docs/explorations/2026-04-18-how-far-does-sentry-go-as-paas.md`
  — Sentry-as-PaaS thesis.
- `docs/explorations/2026-04-18-structured-event-schemas-for-curriculum-analytics.md`
  — categorical-axis vocabulary; lifecycle decomposition; session
  correlation under ADR-160.
- `docs/explorations/2026-04-18-accessibility-observability-at-runtime.md`
  — runtime a11y signal set.
- `docs/explorations/2026-04-18-cloudflare-plus-sentry-security-observability.md`
  — edge/app boundary for security.
- `docs/explorations/2026-04-18-vendor-independence-conformance-test-shape.md`
  — programmatic test shape for ADR-162's clause.
- `docs/explorations/2026-04-18-trust-boundary-trace-propagation-risk-analysis.md`
  — OTel trace propagation across hosts.

External evidence (Stream B web verification, 2026-04-19):

- Sentry pricing: <https://sentry.io/pricing/>
  (Developer free tier; Team $26/mo; Business $80/mo; included
  quotas; PAYG sliders).
- Sentry trust/privacy: <https://sentry.io/trust/privacy/>
  (GDPR; EU data residency; EU-US DPF; HIPAA BAA on Business+).
- Sentry self-hosted: <https://develop.sentry.dev/self-hosted/>
  (FSL-1.1-Apache-2.0; minimum infra; excluded features).
- Sentry feature-flag integration:
  <https://docs.sentry.io/product/issues/issue-details/feature-flags/>
  (Beta; first-party providers Flagsmith / LaunchDarkly / Statsig /
  Unleash / Generic webhook).
- PostHog pricing: <https://posthog.com/pricing>
  (free tier quotas; per-product PAYG; 7-year retention available).
- PostHog privacy / data storage: <https://posthog.com/docs/privacy/data-storage>
  (EU Frankfurt region; data-processing transformations; access
  controls).
- PostHog self-host: <https://posthog.com/docs/self-host>
  (MIT licensed; Cloud parity minus paid features; no support;
  ≥ 4 vCPU / 16 GB RAM / 30 GB storage).
- OpenFeature: <https://openfeature.dev/> and
  <https://openfeature.dev/specification/>
  (CNCF incubating; spec-section maturity statuses Experimental /
  Hardening / Stable).

Out-of-scope verifications (intentionally not run):

- PostHog MCP server queries — Oak does not have a PostHog account on
  this project.
- Sentry MCP server queries beyond static project-config — coordination
  cost with parallel Sentry-integration agent exceeds the value of
  zero-traffic queries on a private-alpha server.

---

## 13. Provenance and process notes

- **Source document**: `Sentry and PostHog-clean.md` in this folder
  (LLM-exported vendor comparison, normalised via
  `chatgpt-report-normalisation` skill).
- **Plan of record**: `.cursor/plans/sentry-posthog-oak-overlay_6a16ff6e.plan.md`
  (do-not-edit; instruction-of-record for this work).
- **Companion artifact**: `docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md`
  receives the full-text body in §2–§5 in a parallel commit.
- **Reviewers**: this overlay is being routed to the
  `assumptions-reviewer` and `docs-adr-reviewer` subagents in
  parallel for Round 1; revisions and dispositions will be appended
  below in §14 once received.
- **Stream classifications**:
  - Stream A (repo grounding) — completed.
  - Stream B (web verification) — completed; one fetch (Sentry
    retention page direct URL) returned 404 and was substituted with
    the pricing-page retention table; one fetch (OpenFeature
    ecosystem page) timed out and was substituted with general
    knowledge of OpenFeature provider availability for PostHog.
  - Stream C (Sentry MCP) — *deliberately skipped*. Coordination cost
    with parallel agent + zero useful usage data on a private-alpha
    server made even read-only static-config reads net-negative
    relative to the schedule risk of stepping on the parallel agent.
    Revisit when the parallel Sentry agent's surface stabilises.
  - Stream D (assumption stress tests) — completed inline in §10.

---

## 14. Reviewer dispositions

### 14.1 Round 1 — overlay (assumptions-reviewer + docs-adr-reviewer in parallel, 2026-04-19)

The two reviewers landed strongly aligned findings on three
load-bearing issues plus several smaller ones. Dispositions below.

**14.1.1 BLOCKER (docs-adr-reviewer) + Important (assumptions-reviewer) — ADR-160 paraphrase overreach**

- **Finding**: the overlay claimed in five sites that ADR-160
  "forbids identified events" / "forbids any flow that attaches
  identifying information to telemetry". ADR-160 is actually a
  closure-property principle: every fan-out path applies *the
  shared redaction policy*. The redaction policy decides what is
  redacted; the ADR ensures the policy is non-bypassable. The
  assumptions-reviewer additionally surfaced live identified scope
  enrichment in the codebase (`mcp-handler.ts:151–155` calls
  `observability.setUser({ id: userId })`), demonstrating that the
  "anonymous-only" claim was over-strong even before the doctrinal
  question.
- **Disposition**: **accepted in full**. Rewrote §6 to derive the
  PostHog-anonymous-slice posture from three facts together (MCP
  server's no-end-user-identity model + redaction-policy strips
  identifiers + ADR-160's closure rule), not from ADR-160 alone.
  Propagated the corrected paraphrase to §3 Product row, §5
  scenario assumptions, §10 Test 2 verdict, and §11.1.
  Acknowledged that a `security-reviewer` audit of the redaction
  policy's actual scope is the proper next step before any PostHog
  adapter authoring. Flagged that if the MCP server's identity
  model ever changes, the constraint must be re-derived rather than
  assumed.

**14.1.2 Important (both reviewers) — OpenFeature seam recommendation contradicts plan-of-record**

- **Finding**: §7 and §11.2 recommended treating the OpenFeature-
  vs-direct-vendor seam shape as "now decidable" and "explicit
  decision rather than continuing to defer". This is contradicted
  by L-10 in the active maximisation plan ("Feature-flag
  scaffolding — TSDoc extension point only (MVP-deferred)") and by
  `future/feature-flag-provider-selection.plan.md` ("the stub
  exists so the extension point is documented; no real flag is
  wired because there is no use case … pre-committing a shape
  before a real consumer risks locking in a wrong API"). Both
  reviewers identified this as a masquerading-blocking move on a
  plan the owner has explicitly held in wait.
- **Disposition**: **accepted in full**. Rewrote §7's framing
  paragraph to honour the plan-of-record posture; replaced the
  three-flavour "recommendation surface" with an "evaluation
  criteria the future provider-seam decision should preserve"
  surface (decidable now from existing doctrine; the seam choice
  itself remains strategic until a real flag consumer arrives).
  Rewrote §11.2 to separate the now-decidable evaluation criteria
  from the remains-open seam and provider choices. Removed the
  L-10-now-ready-to-author claim from §11.3.

**14.1.3 Important (both reviewers) — schema-shape over-prescription contradicts vendor-independence doctrine**

- **Finding**: §4 and §11.1/§11.4 prescribed adopting `result_count`
  as both property and measurement and aligning `session_id` to
  PostHog's `distinct_id` convention. Both reviewers noted this is
  vendor-shaped naming imported into the schema layer, which
  contradicts ADR-162's vendor-independence principle. The
  assumptions-reviewer also flagged it as upgrading "future-facing
  design preference" into "settled present-tense fact".
- **Disposition**: **accepted in full**. Rewrote §4's
  implications paragraphs to keep the schema vendor-neutral
  (preserve `session_id`; ensure `result_count` is *liftable* by
  adapters) and to relocate the dual-encoding / naming decisions
  to the cross-vendor adapter layer per exploration 4 §5.7.
  Rewrote §11.1 / §11.4 / §11.5 to match.

**14.1.4 Important (docs-adr-reviewer) — ADR-162 mechanism numbering**

- **Finding**: §1 cited "ADR-162 §3 Mechanisms #4–#6". ADR-162's
  enumerated Enforcement Mechanisms are 1–5; the intended trio
  corresponds to #3, #4, #5.
- **Disposition**: **accepted**. Corrected §1 to "ADR-162
  Enforcement Mechanisms #3–#5".

**14.1.5 Important (docs-adr-reviewer) — internal contradiction on Sentry Team-tier span quota**

- **Finding**: §2 row says "10M spans" included; §5 Tier 1 / Tier 2
  arithmetic uses "5M included". Both come from the same Sentry
  pricing page. Cost arithmetic depends on the resolution.
- **Disposition**: **accepted, partially resolved**. Reconciled §2
  to "~5M spans" (matching the §5 arithmetic) and added a
  "to re-verify before any decision-making use" note. Full
  re-fetch of the Sentry pricing slider deferred to either a
  Round 2 verification pass or to a `sentry-reviewer` second
  opinion before any decision-making use of the cost arithmetic.

**14.1.6 Important (docs-adr-reviewer) — exploration 4 mis-cite (§4.5 vs §5.7)**

- **Finding**: §10 Test 6 and §11.4 cited "exploration 4 §4.5" for
  schema vendor-neutrality. §4.5 is "Redaction posture per field";
  schema vendor-neutrality / cross-vendor adapter shape is §5.7.
- **Disposition**: **accepted**. Corrected the cite in §10 Test 6
  and added the §5.7 cite in §4 and §11.0 / §11.4 where
  appropriate.

**14.1.7 Important (docs-adr-reviewer) — second-backend-evaluation scope-widening not flagged**

- **Finding**: §11.1 reduced the second-backend-evaluation question
  to "is anonymous-only PostHog worth a second sink", silently
  widening that plan's candidate set (which currently lists
  Datadog, Honeycomb, NewRelic, Grafana+Loki+Tempo, self-hosted
  OTel) to include PostHog. The widening should be explicit so the
  plan owner can accept or reject.
- **Disposition**: **accepted in full**. Added explicit
  scope-widening disclosure to frontmatter
  (`informs_with_scope_widening:`) and to §11.1's first paragraph.

**14.1.8 Important (docs-adr-reviewer) — missing "six research questions, answered" section**

- **Finding**: the canonical exploration stub poses six numbered
  research questions in its §3. The overlay touched all six but
  did not produce a discrete section that answers them in the
  same numbering, ready to lift into the canonical exploration's
  body. The parallel-commit step would have to reverse-engineer
  answers from scattered overlay paragraphs.
- **Disposition**: **accepted in full**. Added new §11.0 — six
  numbered answers, each cross-referencing the overlay sections
  that carry the underlying analysis. This becomes the
  parallel-commit lift target for the canonical exploration's
  body.

**14.1.9 Important (assumptions-reviewer) — §3 over-strong "both needed; neither sufficient"**

- **Finding**: §3 Usability row asserted "Both are needed; neither
  is sufficient alone" and the section's two-by-four conclusion
  asserted "follows directly from the persona-mapped MVP gate".
  Too strong for a possibility-shaped document; opposite
  conclusion (Sentry-only MVP may be sufficient) is still live.
- **Disposition**: **accepted in full**. Rewrote §3 Usability row
  with conditional language ("if cohort-shaped funnels are
  needed"); rewrote the matrix conclusion to a "two-by-four
  *mapping*" rather than "two-by-four conclusion" and explicitly
  noted that none of the mappings amount to a present-tense "must
  adopt PostHog" judgement.

**14.1.10 Important (assumptions-reviewer) — §10 Test 7 self-ratifies**

- **Finding**: Test 7 (meta-test on proportionality of doing this
  analysis) concluded "HOLDS AS POSSIBILITY-SHAPED" using
  authorial rationale rather than consumer evidence; mitigation
  ("cross-referenced from the strategic plans' open-question
  tables") was future-tense / asserted, not observed.
- **Disposition**: **accepted in full**. Rewrote Test 7 verdict to
  "PARTIALLY HOLDS" with explicit honest-reasons-for and
  honest-reasons-against split; named the inversion (premature)
  as genuinely live for the OpenFeature seam item; relocated
  authorial-rationale claims to plain language and dropped the
  ratification verdict.

**14.1.11 Nice-to-have (assumptions-reviewer) — §1 frame too absolute**

- **Finding**: §1 said "wrong for Oak in three specific ways that
  change *every* downstream conclusion". §2 itself concedes many
  clean.md conclusions remain right.
- **Disposition**: **accepted**. Softened §1 to "incomplete for
  Oak in three specific ways that materially change the decision
  surface and several downstream priorities" with explicit
  acknowledgement that many clean.md conclusions stand.

**14.1.12 Nice-to-have (docs-adr-reviewer) — two §2 verdicts mis-characterise clean.md**

- **Finding**: "G2 4.5/5 — Off-frame for Oak" and "Replay
  duplication — Off-frame for Oak" were too harsh; clean.md was
  not asking Oak to use either as a primary input, and the
  replay-duplication advice is sound at the volumes clean.md
  assumed.
- **Disposition**: **accepted**. Re-graded G2 row to "Right but
  inert for Oak" and replay row to "Right at scale; doesn't bite
  for Oak at MVP volume", with rationale text retained.

**14.1.13 Nice-to-have (docs-adr-reviewer) — frontmatter additions**

- **Finding**: missing `last_updated`, `plan_of_record`,
  `streams_completed/skipped` for findability.
- **Disposition**: **accepted**. Added all four fields plus the
  `informs_with_scope_widening:` block (per §14.1.7).

**14.1.14 Nice-to-have (docs-adr-reviewer) — §3 capability-matrix dating**

- **Finding**: §3 vendor-fact claims (Seer SaaS-only, 90-day
  Insights lookback, OpenFeature provider availability, etc.) had
  no inline date, undermining re-verifiability.
- **Disposition**: **accepted**. Added a section-header dating
  paragraph that stamps the table's vendor facts as Stream B
  2026-04-19 with §12 as the source-URL list.

**14.1.15 Nice-to-have (docs-adr-reviewer) — §8 readability**

- **Finding**: §8 buried its punchline under a long preamble.
- **Disposition**: **accepted**. Added a TL;DR paragraph at the
  top of §8.

**14.1.16 Nice-to-have (docs-adr-reviewer) — §11.6 understates parallel-commit work**

- **Finding**: §11.6 said the canonical exploration "is updated
  separately (per plan, §2–§5 replaced)". The actual parallel-
  commit step has more work than a clean §2–§5 replacement
  because the overlay's §2–§5 are substantively different shapes
  from the exploration stub's §2–§5.
- **Disposition**: **deferred to draft-exploration step**. The
  parallel-commit step itself is the right place to make the
  structural mapping explicit; rewriting §11.6 here would
  duplicate the work. The new §11.0 (six numbered answers) plus
  the explicit `informs_with_scope_widening:` frontmatter make
  the parallel-commit lift mechanically sound.

**14.1.17 Recommended onward delegations (docs-adr-reviewer)**

- `sentry-reviewer` — for §3 Engineering claims (Seer SaaS-only,
  90-day Insights lookback, replay sampling defaults) and for the
  §2-vs-§5 spans-quota reconciliation (currently at "to verify").
- `security-reviewer` — for whether the redaction policy
  categorically strips user-identifying values today (load-bearing
  for the §6 derivation).
- `architecture-reviewer-fred` — principles-first read on whether a
  working-draft research artefact is a legitimate place to surface
  decisions ahead of plan-of-record sign-off.
- *Disposition*: **accepted as future work**, but not blocking for
  Round 1 closure. The overlay's `working-draft` status reflects
  these onward delegations being open. Will be picked up either
  by a Round 2 verification pass or by the consumers
  (second-backend-evaluation, feature-flag-provider-selection)
  when those plans go live.

### 14.2 Round 2 — exploration body (to be appended after parallel-commit step)
