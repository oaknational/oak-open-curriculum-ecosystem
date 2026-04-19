# ADR-162: Observability-First — Every Capability Emits Across Five Axes

**Status**: Accepted (2026-04-19)
**Date**: 2026-04-18
**Related**:
[ADR-051](051-opentelemetry-compliant-logging.md) — OpenTelemetry-compliant
single-line JSON logging, the emission baseline;
[ADR-078](078-dependency-injection-for-testability.md) — DI discipline,
the seam through which emitters receive their observability adapters;
[ADR-143](143-coherent-structured-fan-out-for-observability.md) — coherent
structured fan-out, the sink-and-redaction architecture this ADR extends
(this ADR does not supersede 143; it names a lifecycle commitment and an
axis-coverage principle that 143 implicitly assumed);
[ADR-154](154-separate-framework-from-consumer.md) — framework/consumer
separation, the structural prerequisite for the vendor-independence
clause below;
[ADR-158](158-multi-layer-security-and-rate-limiting.md) — multi-layer
security; security-axis emissions are the application-layer complement
to Cloudflare-layer telemetry;
[ADR-160](160-non-bypassable-redaction-barrier-as-principle.md) — the
companion principle that every emission passes through redaction before
any sink sees it;
[`docs/explorations/2026-04-18-observability-strategy-and-restructure.md`](../../explorations/2026-04-18-observability-strategy-and-restructure.md)
— the session report that derived this ADR;
[`.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md`](../../../.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md)
— the execution plan under which this ADR is drafted, accepted, and
operationalised.

## Context

Oak's observability has been treated, historically, as an engineering
concern: errors captured, traces correlated, performance measured. That
framing produced a coherent foundation (ADR-143, ADR-160, ADR-161) but
left four other axes — **product, usability, accessibility, security** —
as implicit at best.

The Sentry Observability Maximisation work exposed the gap. The
executable plan's envelope was infrastructure-shaped (errors, traces,
metrics, release linkage, widget-side instrumentation, alerts), but the
owner clarified during a 2026-04-18 direction-setting session (recorded
at
[`docs/explorations/2026-04-18-observability-strategy-and-restructure.md`](../../explorations/2026-04-18-observability-strategy-and-restructure.md))
that the launch context is public beta, long-lived, and important; the
MVP must enable a data scientist, an engineer, a product owner, and an
accessibility reviewer each to answer their first-order questions from
telemetry alone on launch day.

Two further pressures forced an explicit principle:

1. **Downstream analytics integration happens at the event-schema layer.**
   Oak's wider landscape (Cloudflare, GCP, Vercel, PostHog, an existing
   analytics pipeline, Atlassian Statuspage, git-leaks, GitHub Advanced
   Security) is fragmented. The integration contract is structured
   events at the source: if this repo emits clean, stable, documented
   events, the existing pipelines can consume them. The event-schema
   contract is first-class output, not an infrastructure concern.

2. **Vendor-independence was implicit architectural intent but never a
   named principle.** ADR-078 (DI), ADR-143 (fan-out), ADR-154
   (framework/consumer) structurally enable vendor-independent
   observability. None of them state it. A contributor reading the
   existing ADRs can reasonably adopt a vendor SDK in consumer code
   without violating any written rule — and today's codebase contains
   an instance: `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts`
   imports `wrapMcpServerWithSentry` directly from `@sentry/node` at
   the composition root. That import is defensible as DI wiring per
   ADR-078, but the decision was never captured as a carve-out —
   exactly because no principle named vendor-independence as an
   invariant. Implicit architectural intent is not enforced principle;
   naming is the upgrade path.

This ADR names both pressures as first-class principles and specifies
enforcement mechanisms concrete enough to be testable.

## Decision

Adopt **observability-first as a five-axis principle with a
vendor-independence clause and a closure-property test gate**.

### The Principle

> **Every runtime capability emits structured events covering, as
> applicable, the engineering axis (errors, performance, health), the
> product axis (what is used, by whom, how), the usability axis (did the
> user succeed), the accessibility axis (a11y preferences and failure
> modes), and the security axis (trust-boundary events). Events are
> emitted in documented stable schemas the downstream analytics
> pipelines can depend on, and every emission passes through the
> [ADR-160](160-non-bypassable-redaction-barrier-as-principle.md)
> redaction barrier before any sink receives it.**
>
> Not all axes apply to every capability. Omission is explicit and
> justified, not incidental.

### The Vendor-Independence Clause

> **Emissions are produced in provider-neutral shapes (OpenTelemetry-
> compliant where applicable) and routed through adapters. Consumers
> couple to `@oaknational/observability` and
> `@oaknational/observability-events`, never directly to vendor SDKs.
> Minimum functionality (structured stdout/err via `@oaknational/logger`)
> persists in the absence of any third-party backend. Adding, replacing,
> or removing a vendor adapter MUST NOT require changes in consumer
> code.**

**Composition-root carve-out.** The term "consumer" above refers to
feature code (MCP tool handlers, SDK modules, widget React components,
middleware). Composition roots — `apps/**/src/index.ts`,
`apps/**/src/app/*.ts` — are permitted to wire vendor SDKs as the
DI seam per [ADR-078](078-dependency-injection-for-testability.md).
The enforcement boundary for this clause is therefore feature code, not
wiring code. Phase 5 operationalises this distinction with a structural
import lint (see Enforcement Mechanism #5).

### The Closure Property and Test Gate

For the principle to remain enforceable rather than aspirational:

1. **`packages/core/observability` (operations) and
   `packages/core/observability-events` (schemas) expose conformance
   harnesses** that every consuming workspace composes into its own
   test, parallel to ADR-160's redaction barrier closure.
2. **A capability without a loop, without schema coverage, or with
   vendor lock-in is not shippable.** The reviewer matrix at phase
   close interrogates each of the five axes per new capability.
3. **The vendor-independence clause is tested programmatically.** A
   vendor-independence conformance test runs emitting workspaces in
   `SENTRY_MODE=off` and asserts all structural event information
   persists via stdout/err.

### Enforcement Mechanisms

Four mechanisms, each concrete and testable. Details may be refined in
Phase 5 of the
[observability strategy restructure plan](../../../.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md).

1. **ESLint rule** `require-observability-emission` in
   `@oaknational/eslint-plugin-standards`:
   - **Scope**: newly exported async functions in `apps/**/*/src/**`
     and `packages/sdks/**/*/src/**`.
   - **Behaviour**: flags functions with no call to any of
     `logger.info` / `logger.error` / `log()`, `Sentry.*`, or any schema
     from `@oaknational/observability-events`.
   - **Initial severity**: `warn`. Escalates to `error` once Phase 2 of
     the restructure plan lands its first emission sites (per
     [`patterns/warning-severity-is-off-severity.md`](../../../.agent/memory/patterns/warning-severity-is-off-severity.md)
     this is a deliberate soft-launch with a named escalation trigger,
     not a permanent warn-severity state).
   - **Opt-out**: a sentinel comment justifies a legitimate
     non-emission case (e.g. pure computation with a caller-side
     emission).
2. **Reviewer-matrix question** at every phase close:
   "Does this capability have a loop across each applicable axis?"
   Codified in
   [`.agent/rules/invoke-code-reviewers.md`](../../../.agent/rules/invoke-code-reviewers.md)
   (or its canonical counterpart) so it is asked routinely, not
   remembered ad-hoc.
3. **Conformance test** in
   [`packages/core/observability-events/`](../../../packages/core/)
   (workspace to be created under its owning Phase 2 plan): the
   `conformance.ts` helper validates schema coverage for every emission
   site enumerated in a workspace's registry (parallel to ADR-160's
   `BARRIER_HOOKS` closure).
4. **Vendor-independence emission test** in
   `multi-sink-vendor-independence-conformance.plan.md`'s output (plan
   to be authored under Phase 2 of the restructure): runs the MCP app
   server + browser widget + Search CLI in `SENTRY_MODE=off` and
   asserts structural event information persists via stdout/err with
   no loss beyond the network hop. This proves the **stdout-sink
   fallback**.
5. **Structural import lint — `no-vendor-observability-import`** in
   `@oaknational/eslint-plugin-standards` (plan owned by
   `multi-sink-vendor-independence-conformance.plan.md`, Phase 2;
   authored in Phase 5 as part of ADR-162 acceptance). Forbids
   imports of `@sentry/*`, future telemetry-vendor packages, or any
   other observability vendor SDK outside of:
   - `packages/libs/sentry-*/**` (vendor adapter libraries);
   - `packages/core/observability/**` and
     `packages/core/observability-events/**` (canonical boundaries);
   - composition-root files (per the carve-out above, an allowlisted
     set of `apps/**/src/index.ts` and `apps/**/src/app/*.ts` paths).
     This proves **structural decoupling** — mechanism #4 alone cannot
     catch a consumer that imports a vendor SDK directly but still
     routes emissions to stdout; mechanism #5 does.

### The Five Axes — What Each Covers

| Axis          | Primary signal                                                                    | MVP owner (post-restructure)                                                                  |
| ------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Engineering   | Errors, performance, health (ANR, event-loop delay, Zod validation failures)      | `sentry-observability-maximisation-mcp.plan.md`                                               |
| Product       | What is used, by whom, how (tool-call outcomes, search queries, curriculum usage) | `observability-events-workspace.plan.md` + `search-observability.plan.md`                     |
| Usability     | Did the user succeed (session outcomes, feedback, abandonment)                    | `sentry-observability-maximisation-mcp.plan.md` (L-9, L-12) + widget-session-outcome emission |
| Accessibility | Preferences, frustration proxies, incomplete-flow correlation                     | `accessibility-observability.plan.md`                                                         |
| Security      | Trust-boundary events (auth failure, rate-limit triggered)                        | `security-observability.plan.md`                                                              |

Transport / bot / DDoS observability is explicitly **Cloudflare's**
layer, not this application's (cross-reference: [ADR-158](158-multi-layer-security-and-rate-limiting.md)).

## Supersession

**This ADR extends ADR-143; it does not supersede it.** ADR-143 gave
structural coherence (sink model, OtelLogRecord currency, workspace
scope). This ADR gives lifecycle commitment and axis coverage. ADR-160
(non-bypassable redaction barrier) remains the companion principle
governing the redaction boundary; every emission enumerated here passes
through ADR-160's barrier before reaching any sink.

## Alternatives Considered

1. **Add an "observability" checklist to `principles.md` without a
   dedicated ADR.** Rejected: the concern applies across every future
   capability, every workspace, every vendor-adoption decision, and
   every MVP scoping conversation. Its reusability is too high for a
   checklist; it warrants an ADR per
   [`practice-core/decision-records/PDR-019`](../../../.agent/practice-core/decision-records/PDR-019-adr-scope-by-reusability.md).
2. **Retain the single-axis engineering framing and treat other axes
   as per-plan concerns.** Rejected: the MVP is a function of launch
   context (public beta, long-lived, important); a single-axis frame
   cannot answer data-scientist / a11y-reviewer / product-owner
   questions without forcing each subsequent plan to re-derive the
   gap. The direction-setting session report derives this rejection
   in full.
3. **Treat vendor-independence as an operational preference rather
   than a principle.** Rejected: the existing adapter architecture
   (ADR-078 / 143 / 154) already structurally enables it; the only
   gap is enforcement. Leaving it as a preference means a future
   plan can reasonably couple to a vendor SDK. The conformance test
   makes the preference a property.
4. **Postpone ADR authorship until Phases 2–5 of the restructure
   plan land the new MVP lanes.** Rejected: the new plans need a
   foundation they can cite. An ADR in `Proposed` status today is the
   lightest stable reference point; acceptance follows once
   enforcement mechanisms are concrete (Phase 5).

## Consequences

### Positive

- **Observability becomes a first-class principle**, not a by-product
  of error tracking. Future capability plans interrogate all five
  axes by default.
- **The event-schema contract is code-enforced**, not documented
  by convention. Downstream consumers (data scientists, analytics
  pipelines) integrate from a stable, versioned surface.
- **Vendor-independence becomes a testable property**. Adding or
  replacing a backend is a configuration-level change, not a consumer
  rewrite.
- **The reviewer matrix gains a routine prompt** that surfaces
  axis-coverage gaps at phase close, not after launch.
- **Five-axis framing generalises** to every future capability (AI
  wiring, feature-flag adoption, cost telemetry, SLO codification)
  without re-derivation.

### Negative / trade-offs

- **Authorship overhead**: every new capability now has an explicit
  axis-coverage interrogation. Mitigation: the ESLint rule starts at
  `warn`; the reviewer-matrix question is routine; omissions are
  justified, not forbidden.
- **Schema-workspace dependency**: emitting workspaces depend on
  `@oaknational/observability-events`. Mitigation: the workspace has
  zero runtime dependencies beyond Zod and is a Core package.
- **Vendor-independence conformance test is a new test surface**.
  Mitigation: it lives in `packages/core/observability-events/` and is
  composed into consuming workspaces' existing test suites; it does
  not require a new pipeline stage.
- **Phase 5 enforcement mechanisms are not yet concrete in this
  Proposed-status draft**. The ADR-162 Proposed → Accepted flip is
  gated on those mechanisms landing in Phase 5 of the restructure.

## Implementation Notes

Phased execution is owned by the
[observability strategy restructure plan](../../../.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md).
In summary:

1. **Phase 1** (this ADR in `Proposed`; directory skeleton; plan moves).
2. **Phase 2** (six MVP `current/` plans — including
   `observability-events-workspace`, `synthetic-monitoring`,
   `security-observability`, `accessibility-observability`,
   `multi-sink-vendor-independence-conformance` — and eleven
   post-MVP `future/` plans each with a named promotion trigger).
3. **Phase 3** (two explorations in full: accessibility-at-runtime,
   event-schemas-for-curriculum-analytics; six exploration stubs).
4. **Phase 4** (revise the maximisation executable plan for
   MVP-vs-MVP-deferred classification; `metrics.*` primary over
   span-metrics transitional).
5. **Phase 5** (acceptance — ESLint rule landed at `warn`; reviewer-
   matrix question codified; status flipped `Proposed` → `Accepted`).

## Related Documentation

- Direction-setting session report:
  [`docs/explorations/2026-04-18-observability-strategy-and-restructure.md`](../../explorations/2026-04-18-observability-strategy-and-restructure.md).
- Execution plan:
  [`observability-strategy-restructure.plan.md`](../../../.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md).
- Companion principles: ADR-143 (structural fan-out), ADR-160
  (redaction barrier), ADR-161 (network-free PR checks).
- Implementation seams: ADR-078 (DI), ADR-154 (framework/consumer
  separation).

## Open Questions

- The ESLint rule's sentinel-comment opt-out syntax has not yet been
  specified. Phase 5 authors the rule implementation and RuleTester
  cases; the opt-out comment format is decided there.
- Whether the reviewer-matrix question should live in
  `.agent/rules/invoke-code-reviewers.md` directly or in a dedicated
  `.agent/rules/axis-coverage-interrogation.md` file is a Phase 5
  structural choice. Either placement satisfies this ADR.
- Whether the vendor-independence conformance test should run in CI
  PR checks (network-free per ADR-161, so yes in principle) or only
  at phase close (operator-initiated) is a Phase 2 authoring decision
  for `multi-sink-vendor-independence-conformance.plan.md`.
- `wrapMcpServerWithSentry` at `core-endpoints.ts:98` is currently an
  unconditional call into `@sentry/node` — inertness under
  `SENTRY_MODE=off` is a vendor-SDK behaviour, not a structural
  property. To prove "adding, replacing, or removing a vendor adapter
  MUST NOT require changes in consumer code", the wrapping call must
  move behind a `ServerInstrumenter` port injected from
  `@oaknational/observability`. This is scheduled as part of
  `observability-events-workspace.plan.md` / the vendor-independence
  conformance plan in Phase 2; the decision is out of scope for Phase
  1.

## History

- **2026-04-18** — Proposed. Structural skeleton (Phase 1 of the
  restructure plan) landed in commit `502af060`.
- **2026-04-19** — Accepted. Phase 5 close: `require-observability-emission`
  ESLint rule landed at `warn` in `packages/core/oak-eslint/src/rules/require-observability-emission.ts`
  and wired at `warn` into every `apps/*` and `packages/sdks/*`
  workspace's `eslint.config.ts`. Reviewer-matrix axis-coverage
  question codified at
  [`.agent/directives/invoke-code-reviewers.md §Coverage Tracking`](../../../.agent/directives/invoke-code-reviewers.md).
  Wave-1 enforcement covers `logger.*` / `Sentry.*` / delegate-pattern
  emission sites; the schema-usage detection path (Enforcement
  Mechanism #3) remains deferred to Wave 2 when the
  `@oaknational/observability-events` workspace lands. The
  vendor-independence conformance test (Enforcement Mechanism #4) and
  the `no-vendor-observability-import` structural import lint
  (Enforcement Mechanism #5) are Phase-2-plan deliverables, not
  blockers for acceptance.
