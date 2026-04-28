---
title: Observability Strategy and Restructure — Session Context and Derived Direction
date: 2026-04-18
status: informed-plan-observability-strategy-restructure informed-adr-162
---

# Observability Strategy and Restructure — Session Context and Derived Direction

This document preserves the full context of a design session that took the
Sentry observability work from a 17-lane execution plan on a single branch
into a project-wide observability strategy with a dedicated plan directory,
a new foundational ADR, and an explicit MVP spanning five axes (engineering,
product, usability, accessibility, security).

The session is preserved because the direction correction is material and
must not be lost. The execution is captured in the companion plan
`.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md`.

---

## 1. Session starting state

**Branch**: `feat/otel_sentry_enhancements`
**Starting commit**: `d08c6969` (l-0b redaction barrier conformance + full reviewer register)
**Most recent consolidation commit**: `bdffc770` (consolidation pass from l-0b close)

The branch had, at session start:

- Sentry + OTel foundation closed (source-map upload, release tagging,
  `wrapMcpServerWithSentry` wiring at `core-endpoints.ts:98`, redaction
  barrier covering five hooks, logger-to-Sentry sink, Express error
  handler, alert rule 521866 as smoke-shape).
- ADR-160 (Non-Bypassable Redaction Barrier as Principle) Accepted.
- ADR-161 (Network-Free PR-Check CI Boundary) Accepted.
- ADR-143 §6 superseded-in-part by ADR-160.
- Executable plan `sentry-observability-maximisation-mcp.plan.md` with 17
  lanes across four phases; L-0a (ground-truth correction) and L-0b
  (ADR-160 test-gate implementation) closed; L-1 through L-15 still to run
  before the PR opens.
- L-0b conformance test at `packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts`
  (18 tests, three-part closure coverage plus automated bypass validation).
- `§A.6 Reviewer Findings Register` in the executable plan enumerating 29
  findings from a close-of-session six-reviewer matrix: 18 ACTIONED, 11
  TO-ACTION (each with owning lane + specific edit), 0 REJECTED.
- `pnpm check` from repo root: EXIT=0, 88/88 tasks green.
- One new pattern extracted (`findings-route-to-lane-or-rejection.md`) and
  two patterns annotated with today's second instances during the
  `/jc-consolidate-docs` pass.

### Related infrastructure at Oak (session-confirmed)

Oak's observability landscape beyond this repo (per owner):

- **Cloudflare** — edge-layer traffic, bot, and attack observability.
- **Google Logging (GCP)** — log aggregation for some services.
- **Vercel observability** — hosting-layer telemetry for this project.
- **PostHog** — primary product analytics for the principal product.
- **An existing analytics pipeline** — fragmented but consumes structured events.
- **Atlassian Statuspage** — current incident management / public status surface.
- **git-leaks** — secret scanning.
- **Github Advanced Security** — code scanning.

The landscape is fragmented. The integration contract is structured events at
the source: if this project emits clean, well-defined events, the existing
pipelines can consume them.

---

## 2. The gap-analysis dialogue

The session began with a request for a comprehensive report on current
state, what a fully operational integrated observability platform could
give us, the gap, what of the gap was in plans, and what was not yet
planned.

### 2.1 Where we were

Summarised in §1. The maximisation plan's 17 lanes cover a substantial
expansion of Sentry-backed observability on the MCP server and widget,
but that plan's envelope was implicitly infrastructure-shaped (errors,
traces, metrics, release linkage, widget-side instrumentation, alerts).

### 2.2 Where a fully operational + integrated observability platform could get us

The maturity curve named in the dialogue:

1. **Did it break?** — detection (unhandled exceptions, crash-free-session rate).
2. **Where did it break?** — diagnosis (spans correlated across tiers, profiles).
3. **Why did it break?** — cause attribution (release linkage, deploy correlation).
4. **Who feels it?** — user-impact (RUM, user-scoped scope, end-to-end trace).
5. **How much does it cost us?** — operational economics (function-level cost, cold-boot).
6. **What are users actually doing?** — product signal (tool-call outcomes, search quality).
7. **Are we within budget on reliability?** — SLO / error-budget with burn-rate alerts.
8. **Will it break soon?** — prediction / anomaly detection.
9. **Where do we look first when it breaks?** — runbook integration (triage flowcharts, ownership, escalation).
10. **What changed when we changed something?** — deployment impact (canary, release-over-release regression).

### 2.3 The gap (14 items initially unplanned)

1. Business / product metrics pipeline (tool-call outcomes, search quality, curriculum area usage).
2. Real AI instrumentation wiring (blocked on first LLM-calling tool).
3. Real feature-flag provider wiring (blocked on first flag-using feature).
4. SLO / error-budget codification and burn-rate alerts.
5. Incident management integration (PagerDuty/Opsgenie/Statuspage).
6. Synthetic / external monitoring (uptime, "is it working" probes).
7. Cost telemetry (function-level attribution, cold-boot alerting).
8. Security observability (auth-failure patterns, rate-limit patterns, anomalous access).
9. Distributed tracing backend besides Sentry (dual-export decision + implementation).
10. Customer-facing uptime / status page.
11. Capacity planning / growth forecasting.
12. Deployment-impact / commit-level regression bisection.
13. Cross-system correlated views (Search CLI + HTTP MCP + upstream APIs).
14. Curriculum-content-specific observability (joining events to curriculum metadata).

### 2.4 What was in the plans

All 15 remaining lanes of the maximisation plan (Phase 1 remainder L-1,
L-2, L-DOC initial, L-EH initial; Phase 2 L-3, L-4a, L-4b, L-5, L-6, L-7;
Phase 3 L-9, L-10, L-11, L-12-prereq, L-12; Phase 4 L-13, L-14, L-15,
L-DOC final, L-EH final), plus L-8 parked. Search CLI observability
mirror on the next branch (`search-observability.plan.md`).

---

## 3. Owner direction and corrections

Ten pieces of owner direction, each with material consequences for the
restructure.

### 3.1 Launch context

> Public beta, but beta in this case just means subject to change, the
> product is expected to be long lived and important, and we need high
> levels of observability across engineering, product, usability,
> accessibility and so on concerns.

**Consequence**: MVP is not "minimum viable alpha" but "enough observability
that a data scientist, an engineer, a product owner, and an a11y reviewer
can each answer first-order questions on launch day." Five axes become
first-class: engineering, product, usability, accessibility, security.

### 3.2 Fragmented cross-stack landscape

> The observability across the rest of the stack is constrained to
> individual sources… it is fragmented, and as long as we are producing
> well structured events we can integrate with the analytics.

**Consequence**: integration happens at the event-schema layer. This
project's job is to emit clean, stable, documented events. Downstream
pipelines integrate from there. The MVP deliverable for product
observability is therefore **the event schema contract as much as the
events themselves**.

### 3.3 Sentry-as-PaaS exploration is a core thesis

> We are also partly here to explore how far we can push Sentry in terms
> of providing cross-cutting observability for engineering, behaviour,
> product, security etc… this project is, in part, an exploration of a
> more integrated PaaS approach to full observability.

**Consequence**: the research/exploration deliverable is co-equal with the
production code. L-15 ("Sentry-only vs dual-export vs minimal-operational")
reframes from a vendor-count decision into "where Sentry wins, where
PostHog wins, where each falls short — and what fills the remaining gap."
An exploration document is required output, not a side note.

### 3.4 Incident management and synthetic monitoring

> Incident management is currently Atlassian Statuspage, we do not need
> to integrate _yet_, synthetic monitoring is expected, at the very least
> "is it up, and is it working".

**Consequence**: Statuspage integration becomes `future/` with the
explicit trigger "readiness to publish operational state." Synthetic
monitoring becomes MVP with minimum scope "external uptime probe +
external working-probe (executes one MCP tool call end-to-end)."

### 3.5 Product / data-scientist questions

> I am the product owner, and we want simple questions answered: what is
> used most, least, what tools correlate with use of which other tools,
> which subjects, key stages, key words are most requested. We have
> several data scientists and analysts, so the best thing we can do for
> now is give them well defined data.

**Consequence**: MVP product observability is concrete:

- Every MCP tool call emits a `tool_invoked` event with `tool_name`,
  curriculum filter context (subject / key-stage / keyword at the
  **categorical** level — values redacted per ADR-160), outcome class,
  duration, session correlation keys.
- Every search emits a `search_query` event (coordinates with the
  existing `search-observability.plan.md`).
- Schemas are documented and stable; data scientists consume them without
  renegotiating on every tool surface change.

### 3.6 PostHog vs Sentry research

> We should research and define if there is anything that PostHog can
> provide that Sentry can't.

**Consequence**: `docs/explorations/sentry-vs-posthog-capability-matrix.md`
is a first-wave exploration and a named deliverable. Its inverse
(what Sentry provides that PostHog does not) is equally in scope. Output
informs L-15 and future feature-flag + session-replay decisions.

### 3.7 Vendor independence as first-class principle

> Part of the original motivation of this repo was to construct a set of
> reusable libraries and services that use third party tooling without
> being locked to any one vendor, and using adapters to keep the code as
> free from lock in as possible. While I want to focus on Sentry as the
> target for now, we should absolutely support sending our OTel logs to
> an arbitrary number of destinations, and we should preserve our ability
> to change provider. We must also maintain minimal functionality without
> a third party, even if that is logging to stdout/err only.

**Consequence**: ADR-162 (Observability-First) gains a vendor-independence
clause as a principle, load-bearing and testable. A new MVP lane —
`multi-sink-vendor-independence-conformance` — proves the invariant
programmatically (emitting workspaces work under `SENTRY_MODE=off` with
no loss of structural information beyond the network hop). The existing
adapter architecture (ADR-078 DI, ADR-143 fan-out, ADR-154 framework/
consumer separation) already makes this achievable; the restructure
elevates it from implicit to enforced.

### 3.8 Event schema as a new core workspace

> A documented event schema feels incredibly important, and that it
> deserves a new workspace in core, what do you think?

**Consequence**: `packages/core/observability-events/` becomes a new
workspace. Zero runtime dependencies beyond Zod. Holds schemas for every
structured event type across all five axes. Consumed by every emitting
workspace. Provides a conformance helper that validates emitted events
roundtrip through the schema. `event-catalog.md` inside the workspace is
the data-scientist-facing reference. This converts "documented schema"
from a Markdown artefact into a code-enforced one and matches the repo's
schema-first pattern.

### 3.9 General direction: research + provide data, refine from real needs

> The general direction is research and provide data, and we can refine
> as real needs appear both from internal sources such as data
> scientists, and external users.

**Consequence**: MVP gives **structural capacity to answer questions**,
not pre-built dashboards for every question. Lanes emit events; they
don't build query UIs. Future-plan promotion triggers tighten — "first
data-science request that needs X" is valid; "capacity to answer X in
the abstract" is not.

### 3.10 `metrics.*` as primary, span-metrics transitional

> I would prefer to use the beta metrics.\* rather than the stable but on
> the way out span-metrics.

**Consequence**: L-4a and L-4b priorities flip in the executable plan.
`Sentry.metrics.*` is the primary metric-emission surface, gated behind
`SENTRY_ENABLE_METRICS` (beta API may shift). Span-metrics becomes
transitional — used only where span attribution is the unique value
(metric-attached-to-active-span cases `metrics.*` cannot correlate). New
risk row: "Sentry `metrics.*` API shifts during beta" — mitigated by
adapter-wrapping consumer code, conservative version-pin, tracked
changelog watch. Adopting beta API is the explicit trade-off for not
building on deprecated surface.

### 3.11 Security observability, lightly scoped

> Security observability can be lightly scoped, and largely this will be
> handled at the Cloudflare level rather than the application or hosting
> level, at least for traffic/bots/attacks. Application level security I
> am less sure about. There is work here to research what Cloudflare and
> Sentry additional data this app could usefully provide, and there are
> sensible and useful integrations between Cloudflare and Sentry. We also
> already use git-leaks for secret scanning, Github advanced security for
> code scanning, and we could add in e.g. SonarCloud and potentially
> explore if there are any ways of decorating the code to enhance that
> analysis.

**Consequence**: Security observability plan narrows to application-level
signal only (auth-failure pattern events, rate-limit trigger events).
Transport / bot / DDoS observability is explicitly Cloudflare's layer.
Two new explorations:

- `docs/explorations/cloudflare-plus-sentry-security-observability.md` —
  what app-level data complements Cloudflare's telemetry; Sentry ↔
  Cloudflare integrations worth adopting.
- `docs/explorations/static-analysis-augmentation.md` — SonarCloud
  integration, Github Advanced Security gaps, code-decoration techniques
  that improve static scan signal.

### 3.12 Accessibility observability — best effort + open question

> I am not sure accessibility can be observed live, maybe it can. We can
> use tools like Axecore to detect obvious failures, we can set strict
> design requirements, e.g. keyboard navigation is always a first class
> requirement, we can try and detect user frustration, we can correlate
> incomplete flows and error events… I think we make best efforts and
> flag the open question for additional research.

**Consequence**: Accessibility observability plan scopes to what is
runtime-capturable:

- **Preference tags** on widget load (reduced-motion, high-contrast,
  font-scaling, prefers-color-scheme).
- **Frustration proxies** (rage-click, rapid-retry, form-resubmit-after-
  error-cluster).
- **Incomplete-flow correlation** via `widget-session-outcome` events
  (`outcome: 'abandoned_during_<stage>'`).
- **Keyboard-only interaction detection** as a session boolean.

Dev-time layer stays as-is (axe-core in widget tests, a11y reviewer in
the matrix, keyboard-navigation as a governance requirement). Exploration
`docs/explorations/accessibility-observability-at-runtime.md` surveys
what is and is not capturable and carries the explicit **open question**
that live a11y observation may resist certain dimensions.

---

## 4. Derived structural decisions

Four structural moves crystallised from the direction above.

### 4.1 Dedicated `plans/observability/` directory

Observability is currently scattered across `architecture-and-infrastructure/`.
Consolidation into a sibling directory:

```text
.agent/plans/observability/
├── README.md
├── high-level-observability-plan.md
├── active/
├── current/
├── future/
└── archive/
```

Lifecycle sub-directories only (mirroring `architecture-and-infrastructure/`);
no area sub-directories at current plan volume. Plans carry area tags in
frontmatter if cross-classification becomes useful. Move the six existing
observability plans from `architecture-and-infrastructure/active/` and
`future/` into the new home.

**Deliberation note**: area sub-directories (e.g. `widget/`, `server/`,
`business-metrics/`) were considered and rejected. Lifecycle is a
universal axis; area is not — a plan about "widget error tracking with
upstream trace propagation to the server" classifies into multiple areas.
Revisit if observability plans exceed ~15.

### 4.2 Foundational ADR-162: Observability-First

Proposed text shape:

> **ADR-162: Observability-First — Every Capability Emits Across Five Axes**
>
> **Principle**: every runtime capability emits structured events covering,
> as applicable, the engineering axis (errors, performance, health), the
> product axis (what is used, by whom, how), the usability axis (did the
> user succeed), the accessibility axis (a11y preferences and failure
> modes), and the security axis (trust-boundary events). Events are
> emitted in documented stable schemas the downstream analytics pipelines
> can depend on.
>
> Not all axes apply to every capability. Omission is explicit and
> justified, not incidental.
>
> **Vendor-independence clause**: emissions are produced in provider-
> neutral shapes (OTel-compliant where applicable) and routed through
> adapters. Consumers couple to `@oaknational/observability` and
> `@oaknational/observability-events`, never directly to vendor SDKs.
> Minimum functionality (structured stdout/err via `@oaknational/logger`)
> persists in the absence of any third-party backend. Adding, replacing,
> or removing a vendor adapter MUST NOT require changes in consumer code.
>
> **Closure property + test gate**: `packages/core/observability`
> (operations) + `packages/core/observability-events` (schemas) expose
> conformance harnesses every consuming workspace composes into its own
> test, parallel to ADR-160. A capability without a loop, without schema
> coverage, or with vendor lock-in is not shippable.
>
> **Enforcement mechanisms** (concrete, testable):
>
> 1. **ESLint rule** in `@oaknational/eslint-plugin-standards` flags new
>    exported async functions in `apps/**/*/src/**` and
>    `packages/sdks/**/*/src/**` that emit no structured log / span /
>    metric / event.
> 2. **Reviewer-matrix question** at every phase close: "Does this
>    capability have a loop across each applicable axis?"
> 3. **Conformance test** in `packages/core/observability-events/`
>    validates schema coverage for every emission site enumerated in a
>    workspace's registry (parallel to ADR-160's `BARRIER_HOOKS`).
> 4. **Vendor-independence test** runs emitting workspaces in
>    `SENTRY_MODE=off` and asserts all structural event information
>    persists via stdout/err.
>
> **Supersession**: extends ADR-143 rather than superseding it. ADR-143
> gave structural coherence; this ADR gives lifecycle commitment and
> axis coverage.

### 4.3 `docs/explorations/` as documentation home

A new top-level sibling to `docs/architecture/`, `docs/governance/`,
`docs/engineering/`, `docs/operations/`. README defines the document
shape. Each exploration timestamped (`YYYY-MM-DD-<slug>.md`). Some
explorations inform ADRs; others inform plans; some remain `active`
indefinitely pending a triggering event. See `docs/explorations/README.md`
for the full shape.

### 4.4 `packages/core/observability-events/` workspace

New sibling to `packages/core/observability/`. Zod-schema-first. Zero
runtime dependencies beyond Zod. Holds:

```text
packages/core/observability-events/
├── package.json
├── README.md
├── src/
│   ├── index.ts                   # barrel
│   ├── schemas/
│   │   ├── tool-invoked.ts
│   │   ├── search-query.ts
│   │   ├── feedback-submitted.ts
│   │   ├── auth-failure.ts
│   │   ├── rate-limit-triggered.ts
│   │   ├── widget-session-outcome.ts
│   │   └── a11y-preference-tag.ts
│   ├── correlation-keys.ts        # trace_id / session_id / release contract
│   └── conformance.ts             # test helper every emitting workspace imports
└── docs/
    └── event-catalog.md            # data-scientist-facing reference
```

Conversion of "documented schema" from Markdown to code-enforced. Matches
the repo's schema-first pattern (ADR-029 no-manual-API-data, ADR-030
SDK-single-source-truth, ADR-031 generation-time-extraction — kindred
spirits even though this isn't API-schema-derived).

---

## 5. Revised MVP — five axes, launch-blocking

MVP criterion: **on the day public beta opens, a data scientist, an
engineer, a product owner, and an a11y reviewer can each answer their
first-order questions from telemetry alone.**

### 5.1 Engineering axis (MVP)

- Error capture with redaction (done).
- Server-side tracing via `wrapMcpServerWithSentry` (done).
- Release + deploy linkage (L-7).
- Free-signal integrations covering runtime health — ANR, event-loop
  delay, Zod validation failures, extra error data (L-1 subset).
- Widget error capture (L-12 + L-12-prereq).
- Alert suite for the above (L-13 subset).
- Runbooks (L-13 + L-DOC deliverables).

### 5.2 Product axis (MVP, new lanes)

- `packages/core/observability-events/` workspace with MVP schema set.
- MCP tool-call event emission site at the handler boundary.
- Search emission (existing `search-observability.plan.md`, elevated).
- Event catalog documented; data scientists briefed on the contract.

### 5.3 Usability axis (MVP)

- Tool-call success/failure breakdown by error class (engineering overlap).
- User feedback capture via closed-set schema (L-9).
- `widget-session-outcome` event emission at success and abandonment
  points (new emission site in the widget; schema in events workspace).

### 5.4 Accessibility axis (MVP, best-effort + open question)

- `a11y-preference-tag` event emission on widget load (reduced-motion,
  high-contrast, font-scaling, prefers-color-scheme).
- Frustration-proxy event emission (rage-click, rapid-retry).
- Incomplete-flow correlation via `widget-session-outcome`.
- Keyboard-only session boolean.
- Dev-time axe-core continues in widget tests.
- Exploration flags the open question.

### 5.5 Security axis (MVP, lightly scoped)

- `auth-failure` event emission at the trust boundary (application layer).
- `rate-limit-triggered` event emission (rate limiting already done).
- Transport / bot / DDoS observability deferred to Cloudflare (not this
  app's responsibility).
- Trust-boundary trace propagation decision (L-14).

### 5.6 Operational axis (MVP)

- Synthetic monitoring: external uptime probe + external "is it working"
  probe (new lane).
- Alerts route to Slack + email (Statuspage integration deferred).
- Vendor-independence conformance test (new MVP lane, proves principle
  of ADR-162 programmatically).

### 5.7 Cross-cutting (MVP)

- Event schemas contracted via `observability-events` workspace.
- Analytics-bridge documentation naming the downstream consumers and
  their contracts.

---

## 6. Plan map — nothing unplanned

Every item from §2.3's gap list has a home. Classifications below.

### 6.1 Moved into `plans/observability/active/`

- `sentry-observability-maximisation-mcp.plan.md` — current branch work.

### 6.2 Moved into `plans/observability/current/`

- `search-observability.plan.md` — elevated to MVP from next-branch work.

### 6.3 New in `plans/observability/current/` (MVP lanes)

- `observability-events-workspace.plan.md` — the new core workspace.
- `mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md` —
  current repo-owned deploy-boundary repair plus preview/Sentry proof
  before owner-external uptime monitoring is configured.
- `security-observability.plan.md` — application-level, lightly scoped.
- `accessibility-observability.plan.md` — best-effort + open question.
- `multi-sink-vendor-independence-conformance.plan.md` — proves ADR-162 clause.

### 6.4 Moved into `plans/observability/future/`

- `sentry-observability-maximisation.plan.md` — strategic parent brief.

### 6.5 New in `plans/observability/future/` (post-MVP, each with promotion trigger)

- `ai-telemetry-wiring.plan.md` — trigger: first LLM-calling MCP tool lands.
- `feature-flag-provider-selection.plan.md` — trigger: first A/B experiment proposed.
- `cross-system-correlated-tracing.plan.md` — trigger: debug session shows the gap.
- `curriculum-content-observability.plan.md` — trigger: first data-science request needing it.
- `slo-and-error-budget.plan.md` — trigger: baseline data collected post-launch.
- `statuspage-integration.plan.md` — trigger: readiness to publish operational state.
- `cost-and-capacity-telemetry.plan.md` — trigger: cost pressure or capacity risk.
- `deployment-impact-bisection.plan.md` — trigger: post-L-7 release linkage stable.
- `second-backend-evaluation.plan.md` — trigger: specific Sentry gap requires it (reframed from "dual-export decision" per §3.1 clarification).
- `customer-facing-status-page.plan.md` — trigger: Statuspage integration done.
- `security-observability-phase-2.plan.md` — trigger: exploration conclusions.

### 6.6 Archived

- `sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md` (already archived; path retained post-move).

### 6.7 Explorations in `docs/explorations/`

Eight first entries. Some block MVP scoping; others inform future decisions.

1. `2026-04-18-sentry-vs-posthog-capability-matrix.md` — what each vendor handles better across the five axes. Informs L-15 reframe.
2. `2026-04-18-how-far-does-sentry-go-as-paas.md` — the project's thesis research question. Informs ADR-162 principle and multiple future-plan promotion triggers.
3. `2026-04-18-accessibility-observability-at-runtime.md` — what's capturable, what's inferred, what's dev-time-only. Blocks scoping of `accessibility-observability.plan.md` detail.
4. `2026-04-18-structured-event-schemas-for-curriculum-analytics.md` — data-scientist-facing schema shape. Blocks scoping of `observability-events-workspace.plan.md` MVP schema set.
5. `2026-04-18-trust-boundary-trace-propagation-risk-analysis.md` — Oak API, Clerk, Elastic propagation allow/deny analysis. Informs L-14.
6. `2026-04-18-cloudflare-plus-sentry-security-observability.md` — what app-level adds beyond Cloudflare, integration points. Informs security scope.
7. `2026-04-18-static-analysis-augmentation.md` — SonarCloud, Github Advanced Security gaps, code decoration. Informs security tooling.
8. `2026-04-18-vendor-independence-conformance-test-shape.md` — how the conformance test proves ADR-162's vendor-independence clause programmatically. Informs `multi-sink-vendor-independence-conformance.plan.md`.

---

## 7. Executable plan revisions

The current executable plan `sentry-observability-maximisation-mcp.plan.md`
requires three specific absorption edits once the restructure lands:

### 7.1 Swap L-4a / L-4b priorities

L-4b (dedicated `Sentry.metrics.*` adapter surface) becomes primary and
MVP. L-4a (span-metrics convention) becomes transitional — used only for
span-attribution-unique cases. Risk row updated to name beta-API shift.

### 7.2 Mark MVP vs post-MVP per lane

Lanes currently in Phase 2 and Phase 3 that are NOT launch-blocking get
flagged "MVP-deferred": L-4a (transitional), L-5 (dynamic sampling — fixed
rate fine for beta), L-6 (profiling — on-demand fine), L-10 (scaffolding
only), L-11 (scaffolding only), L-14 (decision not wiring). All still
planned, all still in the executable plan; flag clarifies launch-readiness
without scope change.

### 7.3 Cross-reference the new MVP lanes

L-0/L-1/L-3 reference the `observability-events-workspace` for event
schemas. L-7 references `synthetic-monitoring` for uptime/working probe
coordination. L-9 references the workspace for `feedback-submitted`
schema. L-13 references `accessibility-observability` and
`security-observability` for per-axis alerts.

---

## 8. Order of operations (execution-side)

See companion plan. Summary:

1. **Structural skeleton** (one session): ADR-162 Proposed, explorations
   directory + README + inaugural entry (this document), plans/observability
   directory, move six plans, update cross-references.
2. **MVP scope pass**: fill `high-level-observability-plan.md`; author six
   new `current/` plans; author eleven new `future/` plans.
3. **Exploration kickoff**: write explorations 3 and 4 in full
   (blocking); author the other six as focused briefs with problem
   statement + research questions.
4. **Executable plan revision**: apply §7 edits.
5. **ADR-162 acceptance**: after enforcement mechanisms are concrete.

---

## 9. Open questions flagged

- **Accessibility observability** — fundamental runtime limits unclear.
  Exploration 3 addresses.
- **PostHog vs Sentry capability boundaries** — exploration 1 addresses.
- **Static analysis augmentation** — whether code-decoration meaningfully
  improves SonarCloud / Github Advanced Security signal. Exploration 7
  addresses.
- **Trust-boundary trace propagation** — allow/deny per host under what
  security review. Exploration 5 addresses (informs L-14).
- **MVP event schema granularity** — data-scientist input needed on shape
  of `tool_invoked.arguments_shape` (categorical keys preserved; values
  redacted; which categorical axes matter). Exploration 4 addresses;
  workspace plan depends on it.
- **`widget-session-outcome` stage vocabulary** — what "stage" means at
  widget abandonment. Product-owner input needed.
- **Sentry `metrics.*` API stability** — how much adapter churn to expect
  during beta. Tracked via changelog watch task.
- **Vendor-independence conformance test shape** — exploration 8
  addresses.
- **ADR-162 enforcement specifics** — ESLint rule scope (which file
  patterns trigger it), reviewer-matrix question phrasing, conformance
  test API shape. Locked down before ADR-162 flips from Proposed to
  Accepted.

---

## 10. Invariants and non-negotiables

Carried forward from the existing architecture and reinforced by this
restructure:

- `sendDefaultPii: false` (ADR-143).
- Non-bypassable redaction barrier (ADR-160).
- Network-free PR-check CI boundary (ADR-161).
- Foundational Practice docs are owner-edited only (PDR-003).
- `Result<T, E>` for new/changed code; `{ cause }` on constructed errors.
- `pnpm check` from repo root, no filtering, exit 0 is the merge criterion.
- Findings route to a lane or a rejection — never deferred without a home
  (`patterns/findings-route-to-lane-or-rejection.md`).
- Ground before framing — composition root read before scope claims
  (`patterns/ground-before-framing.md`).

---

## 11. Relationship to other documentation

- **Execution plan**: `.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md`
  carries the phase-by-phase work to realise this direction. Once
  executed, that plan archives and this exploration remains as the
  rationale record.
- **ADR-162** (to be drafted in Phase 1): carries the committed principle
  - enforcement mechanisms. This document is the reasoning trail it
    cites.
- **Session napkin**: `/Users/jim/code/oak/oak-open-curriculum-ecosystem/.agent/memory/active/napkin.md`
  has this session's structured entries (L-0b close + consolidation pass
  - the restructure dialogue). Napkin is ephemeral; this document is
    durable.
- **Continuity contract**: `.agent/prompts/session-continuation.prompt.md`
  will be refreshed at session close to point at this exploration and
  the companion plan.

---

## 12. References

- Commit `d08c6969` — l-0b redaction barrier conformance + full reviewer register.
- Commit `bdffc770` — consolidation pass from l-0b close.
- ADR-143 — Coherent Structured Fan-Out for Observability.
- ADR-160 — Non-Bypassable Redaction Barrier as Principle.
- ADR-161 — Network-Free PR-Check CI Boundary.
- PDR-003 — Sub-Agent Protection of Foundational Practice Docs.
- Pattern `findings-route-to-lane-or-rejection.md`.
- Pattern `ground-before-framing.md`.
- Existing executable plan `sentry-observability-maximisation-mcp.plan.md`
  (to move to `plans/observability/active/`).
- Existing strategic brief `sentry-observability-maximisation.plan.md`
  (to move to `plans/observability/future/`).
