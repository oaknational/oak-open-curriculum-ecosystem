---
name: "Sentry Observability Maximisation — MCP Server"
overview: >
  Executable plan for the MCP-side work of the Sentry Observability
  Maximisation initiative. Closes every Sentry product loop available to
  the MCP app (server runtime + browser widget) on branch
  `feat/otel_sentry_enhancements` before PR. Companion strategic brief
  covers both runtimes; the Search CLI lane runs on its own branch after
  this one merges.
parent_plan: "sentry-otel-integration.execution.plan.md"
strategic_plan: "../future/sentry-observability-maximisation.plan.md"
supersedes:
  - "archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md"
depends_on:
  - "sentry-otel-integration.execution.plan.md"
branch: "feat/otel_sentry_enhancements"
todos:
  - id: l0a-ground-truth-correction
    content: "L-0a: record corrected ground-truth inventory in crosswalk + plan; confirm ADR-143 §6 supersession note + frontmatter Status line point at ADR-160. DONE 2026-04-17 (frontmatter Status line updated; §6 note already in place)."
    status: completed
  - id: l0b-adr-160-test-gate
    content: "L-0b: implement ADR-160 test gate — new packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts with three-part closure coverage (composition presence via TypeScript satisfies; ordering invariant via capturing postRedactionHooks; redacted-at-destination) plus automated bypass-validation harness. DONE 2026-04-17: 17 tests landed; pnpm check exit 0; 61/61 sentry-node tests green."
    status: completed
  - id: l1-free-signal-integrations
    content: "L-1 (Phase 3): opt-in to anrIntegration, zodErrorsIntegration, nodeRuntimeMetricsIntegration, spanStreamingIntegration+withStreamedSpan, rewriteFramesIntegration, extraErrorDataIntegration; verify processSessionIntegration emits"
    status: pending
  - id: l2-delegates-extraction
    content: "L-2 (Phase 3): extract createSentryDelegates from the MCP app into @oaknational/sentry-node so the CLI call site can consume it in the next branch"
    status: pending
  - id: l3-mcp-context-enrichment
    content: "L-3 (Phase 3): type and populate mcp_request context (session, method, tool, argument-shape deny-list, client/server party info)"
    status: pending
  - id: l4b-dedicated-metrics-adapter
    content: "L-4b (Phase 3, primary): Sentry.metrics.* is the primary production metrics surface; opt-in behind SENTRY_ENABLE_METRICS during beta; adapter insulates consumers from the beta API; includes beforeSendMetric redaction, fixture capture, narrow SentryPrimitiveValue attributes"
    status: pending
  - id: l4a-span-metrics-convention
    content: "L-4a (Phase 5, MVP-deferred transitional): span-metric naming convention oak.<runtime>.<feature>.<metric> for narrow span-attribution-unique cases only; adopted only after L-4b metrics.* adapter is stable"
    status: pending
  - id: l5-dynamic-sampling
    content: "L-5 (Phase 5, MVP-deferred): replace fixed tracesSampleRate with tracesSampler (100% errors, 100% >P95 latency, sampled happy path, elevated cold-boot and auth-proxy)"
    status: pending
  - id: l6-profiling
    content: "L-6 (Phase 5, MVP-deferred): add @sentry/profiling-node, wire nodeProfilingIntegration, evaluate overhead, document rollout"
    status: pending
  - id: l7-release-deploy-linkage
    content: "L-7 (Phase 1): release + commits + deploy linkage per ADR-163 (Accepted 2026-04-19). Bespoke orchestrator landed 2026-04-19/20 across three commits: 7f3b17e9 (sentry-node resolver split + git.commit.sha tag rename), 6f5acd17 (four-file TypeScript orchestrator in apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-registration/ + 21 integration tests + ADR-163 §6.0 probe amendment), ecee9801 (build:vercel script + vercel.json buildCommand wiring). Single orchestrator invoked via tsx from the Vercel Build Command."
    status: completed
    note: "BESPOKE BEING TORN OUT. Owner identified 2026-04-20 that @sentry/esbuild-plugin (vendor first-party bundler plugin) eliminates most of this code. Forward direction: tsup -> esbuild + @sentry/esbuild-plugin; keep resolveSentryEnvironment + resolveSentryRegistrationPolicy in @oaknational/sentry-node as vendor-agnostic policy. L-8 is the forward lane (un-dropped 2026-04-20). Migration plan authoring is task #22, using feature-workstream-template.md with Build-vs-Buy Attestation + Reviewer Scheduling sections filled in (self-test of the guardrails installed in commit 4bccba71). Bespoke commits stay in git history as signal for the build-vs-buy lesson; ADR-163 §6 prose will be amended by the migration plan to state the outcome Sentry must reach rather than the specific CLI invocations chosen."
  - id: l8-bundler-source-maps
    content: "L-8 (forward lane for release/commits/deploy + source-map linkage): replace bespoke L-7 orchestrator with @sentry/esbuild-plugin. Switch tsup -> esbuild in the MCP app build; wire @sentry/esbuild-plugin as the bundler plugin so release registration, sourcemap upload, commit attribution, and deploy-event emission are handled by the vendor's first-party plugin. Keep resolveSentryEnvironment + resolveSentryRegistrationPolicy in @oaknational/sentry-node (pure vendor-agnostic policy). Delete-side: four orchestrator files in build-scripts/sentry-release-registration/, 21 integration tests, build:vercel custom script, vercel.json buildCommand override, ESLint + tsconfig exceptions carried for the bespoke shape; amend ADR-163 §6 to state WHAT outcome the vendor must reach (Sentry UI state: release + commits + deploy per env) rather than HOW (specific sentry-cli argv). Authoring: task #22 uses feature-workstream-template.md with Build-vs-Buy Attestation + phase-aligned Reviewer Scheduling."
    status: pending
    note: "UN-DROPPED 2026-04-20. Atomic landing 2026-04-21 in f9d5b0d2 (WS1+WS2+WS3.1) then PROBE FAILED 2026-04-22 (Vercel preview exited 1 with `missing_app_version`). WI 1-5 LANDED LOCALLY 2026-04-23 in commit fb047f86 (canonical resolveBuildTimeRelease in @oaknational/build-metadata + buildBuildInfo persistence + createSentryBuildPlugin refactor with `skipped` variant + esbuild.config.ts intent-kind switch + validate-script removal from MCP HTTP build; oak-search-cli left on tsup with the pre-flight script intact per scope discipline). Later 2026-04-23 work verified the real Vercel import contract, landed the dedicated `dist/server.js` deploy boundary, finished the former Step-4 consumer backlog in the affected workspaces, and reran the full repo-root gate sequence to green. Current execution authority is `mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`; the remaining repo-owned gap is now the representative-env production-build gate plus honest disposition of the lingering non-fatal diagnostics before the later owner-directed preview proof."
  - id: l9-feedback
    content: "L-9 (Phase 3): captureFeedback pipeline; optionally surface as an MCP tool"
    status: deferred
    note: "Deferred to public beta 2026-04-20. Feedback pipeline requires a user-facing collection surface that does not yet exist in alpha. Reopen when an alpha/beta user feedback path is defined."
  - id: l10-feature-flag-scaffolding
    content: "L-10 (Phase 5, MVP-deferred): provider-TBD featureFlagsIntegration shim; context-on-error loop wired so any future provider pays for itself"
    status: pending
  - id: l11-ai-instrumentation-scaffolding
    content: "L-11 (Phase 5, MVP-deferred): expose instrumentOpenAiClient / instrumentAnthropicAiClient / vercelAIIntegration wrappers via adapter so future LLM tool calls are one import away"
    status: pending
  - id: l12-prereq-browser-safe-redactor-core
    content: "L-12-prereq (Phase 1): CLOSED 2026-04-19 by the observability-primitives-consolidation lane. The originally planned browser-safe redactor core extraction was resolved by folding the primitives into @oaknational/observability rather than standing up a new core workspace — architecture review (fred + barney) surfaced the core→lib boundary violation the original plan would have required plus a third duplicate of the recursive JSON-safe type. Post-consolidation state satisfies L-12-prereq's substantive goal: @oaknational/observability owns the redaction primitives + sanitisation + unified JsonValue/JsonObject type; @oaknational/sentry-node composes directly from observability (no intermediate workspace hop); zero @sentry/* and zero node:* imports in observability runtime src (structurally enforced by no-node-only-imports.unit.test.ts). Wave 4 L-12 (widget Sentry) can now compose @oaknational/observability directly without a prerequisite extraction."
    status: completed
  - id: l12-widget-sentry
    content: "L-12 (Phase 4): @sentry/browser (or @sentry/react after bundle-size review) in the MCP App widget with shared redaction via @oaknational/telemetry-redaction-core and linked traces"
    status: deferred
    note: "Deferred to public beta 2026-04-20. The widget runtime surface is an agentic client (ChatGPT, Claude Desktop, etc.), not a standard browser. Sentry instrumentation behaviour inside those hosts is unverified and would need probing before committing to an integration shape. Reopen when host-compatibility evidence is available."
  - id: l13-alerts-dashboards-runbooks
    content: "L-13 (Phase 5): per-loop alert + dashboard panel + runbook entry with severity, routing, dedupe"
    status: deferred
    note: "Deferred to public beta 2026-04-20. Alerts + dashboards require real signal distributions from L-1/L-3/L-4b; designing thresholds before seeing alpha noise/signal is premature optimisation that produces alert fatigue. Reopen when L-1/L-3/L-4b have accumulated enough alpha traffic to observe real distributions."
  - id: l14-third-party-trace-propagation
    content: "L-14 (Phase 5): security-gated trace propagation decision for non-Oak hosts (including Oak API boundary)"
    status: deferred
    note: "Deferred to public beta 2026-04-20. Security-gated trace propagation to non-Oak hosts requires a deliberate policy decision that should not be rushed pre-alpha. Reopen when the trust-boundary policy owner is identified and an explicit decision surface (ADR) is ready."
  - id: l15-strategy-close-out
    content: "L-15 (Phase 5): record the Sentry-only vs dual-export vs minimal-operational strategy decision with rationale and reviewer attribution"
    status: pending
  - id: l-eh-initial
    content: "L-EH initial (Phase 1 / Wave 1 per 2026-04-18 reshape): enable ESLint built-in `preserve-caught-error` (added in 9.35.0) with `requireCatchParameter: true` at `error` severity in `src/**/*.ts` of the 5 Wave-1 workspaces. Supersedes the originally planned custom `require-error-cause` rule — the built-in is a documented superset covering missing cause, cause-mismatch, destructured-parameter loss, variable shadowing, and re-throw / nested / AggregateError / async-wrapper cases by construction. Audit (2026-04-19): 0 violations in-scope; enforcement landed at `error` per `warning-severity-is-off-severity` (with no violations to clean up, `warn`-with-deadline would be vacuous)."
    status: completed
    note: "Landed 2026-04-19. Rule wired in each of the 5 workspace `eslint.config.ts` files as a sibling block to the `require-observability-emission` block, scoped to `src/**/*.ts`. Pre-enable audit: 0 violations (MCP app 0; search-cli 0; curriculum-sdk 0; search-sdk 0; sdk-codegen 0) — consistent with ADR-088 + `.agent/rules/use-result-pattern.md` discipline already in practice. pnpm check exit 0 post-enable at `error`. Architecture-reviewer-fred TO-ACTION driving the `warn` → `error` flip actioned in the same lane closure; comment preamble updated with trust-boundary rationale."
  - id: l-eh-final
    content: "L-EH final (Phase 5 per 2026-04-18 reshape; was Phase 4 pre-reshape): author prefer-result-pattern ESLint rule with concrete heuristic spec + valid/invalid RuleTester cases; apply to sentry-node, core/observability, MCP app observability as first adoption tranche; update ADR-088 and .agent/rules/use-result-pattern.md"
    status: pending
  - id: l-doc-initial
    content: "L-DOC initial (Phase 1): expand packages/libs/sentry-node/README.md + author apps/oak-curriculum-mcp-streamable-http/docs/observability.md + shrink app README Observability section to summary+link; cross-link from workspace READMEs and docs mesh (docs/README.md, quick-start.md, docs/operations/README.md, sentry-deployment-runbook § Redaction). DONE 2026-04-19."
    status: completed
    note: "Landed 2026-04-19 (commit 9e1a26b2). §RED reshaped mid-execution: the prescribed structural content-presence test was authored, run red, then removed after testing-strategy.md review (tests must prove behaviour, not constrain doc wording). Acceptance moved to the reviewer matrix (docs-adr-reviewer + onboarding-reviewer) plus the manual reader-test. Both reviewers returned; P1/Critical findings actioned in-place (11 broken ADR filename slugs, SentryPostRedactionHooks vs SentryRedactionHooks conflation, userId/setUser scope correction, discoverability mesh). Follow-ups recorded in lane close evidence."
  - id: l-doc-final
    content: "L-DOC final: DISSOLVED 2026-04-20. Docs are definition-of-done on every lane, not a separate phase — a separate L-DOC-final lane creates a drift window where code lands in Phases 3 and 4 without matching docs, which violates the repo's no-drift discipline. Each lane's REFACTOR phase now gates on: per-loop TSDoc on owning functions; ADR index entries for any new ADR touched; propagation to `sentry-deployment-runbook.md`, `sentry-cli-usage.md`, `production-debugging-runbook.md`, and `environment-variables.md` for the specific signals that lane emits; `docs-adr-reviewer` close review. `documentation-sync-log.md` entries land per-lane at lane close, not in a final sweep."
    status: dissolved
  - id: ws-quality-gates
    content: "Full quality gate chain after each phase (pnpm check)"
    status: pending
  - id: ws-adversarial-review
    content: "Specialist reviewer passes per phase, non-leading prompts"
    status: pending
  - id: ws-doc-propagation
    content: "Propagate settled outcomes to canonical ADR / directive / reference docs and relevant READMEs"
    status: pending
  - id: ws-consolidation
    content: "Final /jc-consolidate-docs run on branch close-out"
    status: pending
  - id: ws-review-adrs-160-161
    content: "Review ADRs 160 and 161 (drafted 2026-04-17). ADR-160 supersedes ADR-143 §6 in part; ADR-161 captures the network-free PR-check CI boundary. Accepted 2026-04-17 by owner as-drafted. Status on both flipped Proposed → Accepted. L-7 authors confirm ADR-161's pipeline boundary table matches the actual sibling-script attachment points at lane-open time."
    status: completed
isProject: true
---

# Sentry Observability Maximisation — MCP Server

**Template**: Derived from `.agent/plans/templates/feature-workstream-template.md` (ADR-117).
**Last Updated**: 2026-04-23
**Status**: 🟡 WAVE 1 STILL ACTIVE — ADR-162 Accepted; `require-observability-emission`
is now `error` in the 5 scoped Wave-1 workspaces; the dedicated
`dist/server.js` deploy boundary is landed locally; and the current
execution authority for the remaining repo work is
`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`. The former
Step-4 backlog in `@oaknational/oak-search-sdk`,
`@oaknational/sdk-codegen`, and `@oaknational/search-cli` is now
retired as authoritative history because the full repo-root gate
sequence has since passed through `pnpm format:root`. The remaining
repo-owned gap before any owner-directed preview work is the dedicated
realistic production-build gate for the env path that loads the Sentry
esbuild plugin, plus honest disposition of the lingering non-fatal
diagnostics. Preview `/healthz`, preview-release evidence, and preview
traffic proof are now explicitly outside the current repo-owned plan
and wait on owner direction after that narrower work lands.
**Branch**: `feat/otel_sentry_enhancements`
**Scope**: Close every available Sentry product loop for the MCP app (server + widget) on this branch before PR. Search CLI mirrors on the next branch.

---

## Context

### Current State (verified 2026-04-17)

The foundation is done: `@oaknational/sentry-node` is a three-mode adapter
(`off`/`fixture`/`sentry`), the shared redaction barrier covers five hook
types (ADR-143), `@oaknational/logger` forwards to Sentry as a sink with
trace correlation, per-request MCP spans are emitted, source maps are
uploaded with Debug IDs via a post-build shell script, release /
environment / git SHA are resolved and tagged, alert rule 521866 is live,
and the MCP server is instrumented with `wrapMcpServerWithSentry` at
`apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts:98`.

**Correction**. The immediate predecessor plan
(`sentry-observability-expansion.plan.md`, archived under
`archive/superseded/...pre-maximisation-pivot-2026-04-17.md`) did not
mention the existing `wrapMcpServerWithSentry` wiring, and the scope
audit that replaced it initially proposed re-adding it. The corrective
lesson — ground before framing, read the composition root before
proposing integrations — is captured in the napkin and operationalised
in L-DOC (documentation coverage) and L-0 (ground-truth ADR amendment).

### Problem Statement

Despite a mature foundation, meaningful Sentry capabilities are unused:

1. **Opt-in integrations** shipped by `@sentry/node` v10.48 but not
   enabled: `anrIntegration`, `zodErrorsIntegration`,
   `nodeRuntimeMetricsIntegration`, `spanStreamingIntegration`,
   `rewriteFramesIntegration`, `extraErrorDataIntegration`.
2. **Missing first-class capabilities**: dynamic sampling, CPU
   profiling, release/deploy linkage beyond source maps, feedback
   capture, feature-flag context-on-error.
3. **Scaffolding absent**: future AI instrumentation, future
   feature-flag provider wiring.
4. **Delegates duplication**: `createSentryDelegates` (in the MCP app)
   and `buildCliObservability` (in the CLI) re-implement the same
   `SentryNodeRuntime` → provider-neutral bridge. Adding any new
   adapter method doubles the change cost.
5. **Measurement gap**: no published naming convention for metric-shaped
   signals (span attributes or the beta Sentry Metrics pipeline).
6. **Widget-side silence**: the MCP App browser widget has no Sentry
   instrumentation, so client-side failures and linked traces are
   invisible.
7. **Error-handling drift**: `Result<T, E>` coverage is partial; cause
   preservation on constructed errors is not machine-enforced.
8. **Documentation gap**: the fact that `wrapMcpServerWithSentry` was
   wired was not discoverable from workspace READMEs or the shared
   library README. Missing documentation is itself a quality defect.

### Existing Capabilities Preserved

- Three-mode adapter with full redaction barrier (ADR-143).
- Logger-to-Sentry sink with trace correlation.
- MCP server wrapping via `wrapMcpServerWithSentry`.
- Per-request span `oak.http.request.mcp` with HTTP attributes.
- Scope enrichment: `mcp.method`, `mcp.tool_name`, user id from auth.
- Source-map upload via `pnpm sourcemaps:upload` (Debug ID injection +
  upload + post-condition grep).
- Express error handler (`setupExpressErrorHandler`) registered when
  `SENTRY_MODE !== 'off'`.
- Default Sentry Node integrations: `httpIntegration`,
  `nativeNodeFetchIntegration`, `onUncaughtExceptionIntegration`,
  `onUnhandledRejectionIntegration`, `processSessionIntegration`,
  `contextLinesIntegration`, `localVariablesIntegration`,
  `modulesIntegration`, `nodeContextIntegration`,
  `childProcessIntegration`, `systemErrorIntegration`, auto performance
  integrations.

---

## Design Principles

1. **Close loops, not check features.** A loop = capture + correlation +
   surface. The plan's unit of progress is a closed loop with evidence.
2. **Redaction barrier stays non-bypassable.** ADR-143 §6 is generalised
   before any new fan-out lands.
3. **Single source of truth.** `createSentryDelegates` lives in one
   place; both consumers import it.
4. **Opt-in over default** for anything that changes runtime behaviour:
   `SENTRY_ENABLE_METRICS` flag, sampling strategy configurable via env,
   profiling rollout env-gated until measured.
5. **Documentation is part of the loop.** Each loop has TSDoc on the
   surface and prose in the app/library README. If a loop is not
   discoverable from docs, it is not done.
6. **Result-first error handling.** New and changed code uses
   `Result<T, E>` where practical; cause preservation is
   machine-enforced on constructed errors.
7. **Strict types at the surface.** Metric attributes narrow to
   `SentryPrimitiveValue` — never `unknown` at our boundary.

### Non-Goals (YAGNI)

- Rewriting `@oaknational/logger`. The coherent fan-out model stays.
- Replacing `wrapMcpServerWithSentry` with hand-rolled MCP spans.
- Adding browser Sentry outside the MCP App widget.
- Provider-specific feature-flag integration — scaffolding only.
- Instrumenting actual LLM calls — scaffolding only (no Oak MCP tool
  currently calls an LLM, per owner confirmation).
- Migrating every pre-existing throw site to `Result<T, E>` in one pass.
  The rule applies to new/changed code; pre-existing sites migrate
  opportunistically.
- Reopening ADR-078 (DI), ADR-112 (per-request MCP transport), ADR-128
  (STDIO retirement), ADR-143 invariants (barrier non-bypassable,
  `sendDefaultPii: false`).

---

## MVP Classification

> **Status note (2026-04-18)**. As of this plan revision, **none of
> the MVP observability code has been written**. Foundation work is in
> place (`@oaknational/sentry-node` three-mode adapter,
> `@oaknational/logger`, shared redaction barrier + ADR-160 test gate
> at L-0b, `wrapMcpServerWithSentry` wired in the MCP composition
> root, alert 521866 validated, source-map upload operational). Every
> L-lane after L-0b, every MVP event schema, and every workspace named
> in cross-references below (notably `packages/core/observability-events/`
> and `packages/core/telemetry-redaction-core/`) **exists as planned
> work, not as code**. Cross-references in this plan link planning
> authority, not current runtime state. Workspaces land when their
> owning `current/` plans enter `active/` lifecycle and execute.

This plan ships as one PR, but not every lane is launch-blocking for the
public-beta release that ADR-162 frames as the MVP envelope. The table
below classifies every lane as **MVP-in** (launch-blocking) or
**MVP-deferred** (planned, shipped in the same PR, but not launch-
blocking). Governing authority is
[ADR-162 §Principle](../../../../docs/architecture/architectural-decisions/162-observability-first.md#the-principle):

> **Not all axes apply to every capability. Omission is explicit and
> justified, not incidental.**

Every MVP-deferred lane therefore carries an explicit
axis-applicability rationale naming one of three families:

- **(a) not applicable at MVP** — the axis obligation does not bind
  because no runtime capability exists from which to emit (e.g. L-10
  has no feature-flag provider selected; there is nothing to observe).
- **(b) satisfied by a simpler surface at MVP** — a narrower mechanism
  already meets the axis obligation at launch (e.g. fixed-rate
  sampling for the engineering axis; dynamic sampling is a
  post-launch optimisation).
- **(c) a decision, not a runtime capability** — the lane records an
  architectural choice rather than a capability to observe (e.g. L-14
  records an allow/deny propagation decision; any wiring that follows
  is post-MVP).

This table is **load-bearing**: Phase 5's ADR-162 axis-coverage audit
(per the restructure plan) will treat any unjustified omission as a
finding. Update this table if a lane's classification changes.

| Lane ID | MVP-in / MVP-deferred | Axis-applicability rationale |
|---------|------------------------|------------------------------|
| L-0a, L-0b | MVP-in | Engineering-axis foundation (ground-truth correction + ADR-160 redaction-barrier test gate). Complete 2026-04-17. |
| L-1 | MVP-in | Engineering axis — free-signal error and runtime telemetry (ANR, Zod, runtime metrics, span streaming, rewrite-frames, extra-error-data). |
| L-2 | MVP-in | Engineering axis — shared delegate seam required before the Search CLI branch can mirror this maximisation plan. |
| L-3 | MVP-in | Engineering + product axes — typed MCP-request context enrichment. |
| **L-4a** | **MVP-deferred** | [ADR-162 §Principle](../../../../docs/architecture/architectural-decisions/162-observability-first.md#the-principle): omission justified — **(b) satisfied by a simpler surface at MVP**. L-4b provides the primary metric surface; L-4a's span-metrics convention is retained only for narrow span-attribution-unique cases and adopts only after L-4b is stable (see §Phase 1 dependency graph `L-4b → L-4a`). |
| L-4b | MVP-in | Engineering axis — **primary metric emission surface** via `Sentry.metrics.*`. Launch-blocking because the five-axis observability principle requires a working metric pipeline on launch day. |
| **L-5** | **MVP-deferred** | [ADR-162 §Principle](../../../../docs/architecture/architectural-decisions/162-observability-first.md#the-principle): omission justified — **(b) satisfied by a simpler surface at MVP**. A fixed `tracesSampleRate` meets the engineering-axis observability obligation at launch; dynamic `tracesSampler` is a post-launch optimisation once traffic shape is known. |
| **L-6** | **MVP-deferred** | [ADR-162 §Principle](../../../../docs/architecture/architectural-decisions/162-observability-first.md#the-principle): omission justified — **(b) satisfied by a simpler surface at MVP**. On-demand profiling (env-gated manual activation) meets the engineering-axis obligation; continuous profiling is a post-launch enablement. |
| L-7 | MVP-in | Engineering axis — release / commit / deploy linkage is launch-blocking. Without it, a regression cannot be attributed to a specific release in Sentry; regression-detection is an MVP obligation. |
| L-9 | MVP-in | Usability axis — the `feedback-submitted` pipeline is the product-launch feedback loop. |
| **L-10** | **MVP-deferred** | [ADR-162 §Principle](../../../../docs/architecture/architectural-decisions/162-observability-first.md#the-principle): omission justified — **(a) not applicable at MVP**. No feature-flag provider is selected; no runtime capability exists from which to emit flag context. L-10 ships scaffolding only (TSDoc extension point) per owner decision 2026-04-17; the first real provider's integration is a separate lane. |
| **L-11** | **MVP-deferred** | [ADR-162 §Principle](../../../../docs/architecture/architectural-decisions/162-observability-first.md#the-principle): omission justified — **(a) not applicable at MVP**. No Oak MCP tool currently calls an LLM. L-11 ships scaffolding only (TSDoc extension point) per owner decision 2026-04-17; the first real LLM tool's integration is a separate lane. |
| L-12-prereq, L-12 | MVP-in | Engineering + usability + accessibility axes — widget instrumentation. Widget is a second emitting workspace under ADR-162's vendor-independence clause. |
| L-13 | MVP-in | Engineering + usability + security + accessibility axes — per-loop alerts are the launch-day operational surface. |
| **L-14** | **MVP-deferred** | [ADR-162 §Principle](../../../../docs/architecture/architectural-decisions/162-observability-first.md#the-principle): omission justified — **(c) a decision, not a runtime capability, with a latent security-axis emission obligation**. L-14 records an allow/deny trust-boundary propagation decision per outbound host (Oak API, Clerk, Elastic) with security-reviewer attribution. Any `allow` decision recorded here creates a post-MVP security-axis emission obligation (who propagated to whom, with what trust-boundary classification) that is discharged in [`security-observability.plan.md`](../current/security-observability.plan.md); any runtime wiring that follows the decision is therefore post-MVP but not unbounded. |
| L-15 | MVP-in | Close-out / strategy ADR — required to discharge the parent plan's strategy-close-out obligation. |
| L-DOC (initial + final), L-EH (initial + final) | MVP-in | Cross-axis discipline — documentation coverage and error-handling standards bind on every axis. |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

Read before each phase and at the start of each RED cycle:

- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`
- ADR-078 (dependency injection), ADR-088 (Result pattern),
  ADR-112 (per-request MCP transport), ADR-128 (STDIO retirement),
  ADR-143 (redaction barrier), ADR-144 (fitness zones),
  ADR-154 (framework vs consumer), ADR-158 (multi-layer security),
  ADR-159 (per-workspace vendor CLI ownership),
  [ADR-160](../../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
  (non-bypassable redaction barrier as principle — supersedes ADR-143
  §6 in part; already operationalised by L-0b and cited throughout
  this plan; listed here for canonical alignment),
  [ADR-162](../../../../docs/architecture/architectural-decisions/162-observability-first.md)
  (observability-first across five axes + vendor-independence clause
  — governs the §MVP Classification above and the cross-references
  to sibling MVP plans in §Documentation Propagation below).

---

## Phase Structure

The plan has **five execution phases**. Physical section order below
matches execution order; the `## Phase N — <name>` headers are
authoritative. Each phase runs a full RED → GREEN → REFACTOR → QUALITY
GATE → SPECIALIST REVIEW cycle before the next begins. Phases commit
independently; the single-PR commitment (A.3) is unchanged — the PR
opens after Phase 5 closes.

**Execution order (authoritative)**:

| Execution phase | Purpose | Maximisation lanes | Sibling `current/` plans |
|-----------------|---------|---------------------|---------------------------|
| **Phase 1 — Gates & Foundation Extractions** | Land compile-time gates and extract shared workspaces before any new emission site. Every line written after Phase 1 is compile-time-gated. | L-0a, L-0b (both complete 2026-04-17); L-EH initial (ESLint built-in `preserve-caught-error` — supersedes original `require-error-cause` custom-rule plan; landed 2026-04-19); L-DOC initial; L-12-prereq (moved from old Phase 3 — extract `packages/core/telemetry-redaction-core/`); L-7 (moved from old Phase 2 — release/deploy linkage scripts unlock regression attribution for every subsequent smoke test); restructure Phase 5 carve-out (`require-observability-emission` ESLint rule + ADR-162 Proposed → Accepted; authored here rather than after emitters land) | — |
| **Phase 2 — Schema Foundation** | Every downstream-analytics contract exists as code before any emitter consumes it. | — | [`observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md) WS1–WS6 (create `packages/core/observability-events/` + 7 MVP schemas + conformance helper); [`multi-sink-vendor-independence-conformance.plan.md`](../current/multi-sink-vendor-independence-conformance.plan.md) WS1 carve-out (`no-vendor-observability-import` ESLint rule only; emission-persistence test deferred to Phase 5) |
| **Phase 3a — Alpha-gate emitters (schema-independent)** | Server-side emission sites that do NOT consume Phase 2 schemas. Can land before events-workspace. This is the transition-to-useful phase — after Phase 3a, Sentry is diagnostic-grade for the MCP server (release attribution via L-8, free runtime signal via L-1, request-context attribution via L-3). | L-1 (free-signal integrations — emits Sentry-native vendor events, not Oak-authored schema); L-2 (delegates extraction — structural refactor, no event shape; unblocks Search CLI branch); L-3 (MCP request context enrichment — establishes `mcp_request` scope shape that later `tool_invoked` emitters consume; does not itself emit schema-governed events). | — |
| **Phase 3b — Beta-gate emitters (schema-dependent)** | Emission sites that consume Phase 2 schemas by import. Gated on events-workspace existing. | L-4b (primary `Sentry.metrics.*` adapter — metric names catalogued alongside event schemas per ADR-162). **Deferred to public beta**: L-9 (feedback pipeline — user-facing surface not yet defined in alpha). | — |
| **Phase 4 — Cross-axis** | Security + a11y sibling plans emit their axis events using Phase 2 schemas. Gated on events-workspace. **Deferred to public beta**: L-12 (widget Sentry — runtime surface is agentic clients like ChatGPT/Claude Desktop, not a standard browser; instrumentation behaviour in those hosts is unverified). | — | [`security-observability.plan.md`](../current/security-observability.plan.md) — `auth_failure`, `rate_limit_triggered`; [`accessibility-observability.plan.md`](../current/accessibility-observability.plan.md) — `a11y_preference_tag`, frustration proxies, `widget_session_outcome` |
| **Phase 5 — Operations + Conformance + Close-out** | Vendor-independence conformance runs pre-launch (previously blocked by schema foundation). Strategy close-out and error-handling final land while experience is fresh. | L-15 (strategy close-out ADR); L-EH final (`prefer-result-pattern` ESLint rule + first-tranche adoption); MVP-deferred lanes: L-4a, L-5, L-6, L-10, L-11; L-8 (now UN-DROPPED — see body). **Deferred to public beta**: L-13 (alerts/dashboards/runbooks — require real signal distributions from L-1/L-3/L-4b before threshold design is meaningful); L-14 (third-party trace propagation — security-gated policy decision). | [`multi-sink-vendor-independence-conformance.plan.md`](../current/multi-sink-vendor-independence-conformance.plan.md) WS2+; [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md) — archived closure record for the bounded repo-owned corrective lane before owner-run validation |

### Alpha vs public-beta gates (2026-04-20 re-sequencing)

Events-workspace (Phase 2) is **required for public beta**, not for
public alpha. Owner direction 2026-04-20: *"we absolutely must create
the events workspace, but it does not necessarily need to block public
alpha, it absolutely does block public beta."*

Consequence: Phase 3 was originally drafted as one block with all
emitters behind Phase 2 for uniformity. In fact only L-4b has a genuine
schema dependency; L-1 and L-3 emit Sentry-native or scope-context
shapes, and L-2 is structural-only. Splitting Phase 3 into 3a
(schema-independent, alpha-gate) and 3b (schema-dependent, beta-gate)
compresses time-to-useful-Sentry from end-of-Phase-3 to end-of-Phase-3a.

**Alpha gate** (what must land before public alpha ships):

- Phase 1 complete (L-7 torn out by L-8; L-EH initial ✓; L-DOC initial ✓;
  L-12-prereq ✓; restructure Phase 5 carve-out ✓; L-8 landing next)
- Phase 3a complete (L-1 + L-2 + L-3)
- Existing error capture, redaction barrier, ESLint gates (already in place)

**Public-beta gate** (additive to alpha):

- Phase 2 events-workspace (`packages/core/observability-events/`)
- Phase 3b L-4b metrics adapter
- Phase 4 sibling plans (security-observability, accessibility-observability)
- Phase 5 L-15, L-EH final, vendor-independence conformance run
- Previously-deferred lanes re-evaluated at beta (L-9 feedback, L-12
  widget Sentry, L-13 alerts, L-14 trust-boundary trace propagation)

**Docs are definition-of-done on every lane — not a separate phase.**
The original Phase 5 "L-DOC final" lane has been dissolved (2026-04-20).
Every lane's REFACTOR gate includes: per-loop TSDoc on owning functions;
ADR index entries for any new ADR touched; propagation to the operational
runbooks and `environment-variables.md` for the specific signals that
lane emits; `docs-adr-reviewer` close review; a `documentation-sync-log.md`
entry for the lane. Docs drift is not permitted between lanes.

L-EH retains its "initial + final" structure (rule enablement in Phase 1;
authored `prefer-result-pattern` rule + first-tranche adoption in Phase 5).

**Architectural rationale for this ordering** (summary):

1. **Schemas before schema-consuming emitters** — L-4b imports metric-name schemas from `packages/core/observability-events/` (and the Phase-4 sibling plans + deferred L-9/L-12 also import their Oak-authored event schemas). L-1 and L-3 do NOT import from the events-workspace (L-1 emits Sentry-native vendor events; L-3 emits scope-context shapes, not events), so they can land before Phase 2. This split is what makes Phase 3a alpha-gate-reachable without Phase 2.
2. **Rules before code** — ESLint built-in `preserve-caught-error` (L-EH initial, supersedes `require-error-cause`), custom `require-observability-emission` (restructure Phase 5), and custom `no-vendor-observability-import` (Phase 2) all land in Phases 1–2, before any emission site is authored.
3. **Redactor core extracted once** — L-12-prereq in Phase 1 gives server + widget + future Search CLI a shared `packages/core/telemetry-redaction-core/` they all compose.
4. **Release linkage early** — L-7 in Phase 1 means every subsequent lane's owner-verified smoke test is tagged and attributable.
5. **Vendor-independence runs pre-launch** — the conformance plan's emission-persistence test was blocked on the events workspace; Phase 2 unblocks it; Phase 5 runs it before PR open.

**ADR-162 Proposed → Accepted sequencing** (2026-04-18 per
fred-review TO-ACTION — explicit to remove interpretive ambiguity):
ADR-162 is Proposed at Phase 1 open; Phase 1 flips it Accepted as
part of the restructure Phase 5 carve-out (`require-observability-emission`
rule authored + status flip). **Phase 1 deliverables other than the
flip itself** (L-EH initial, L-DOC initial, L-12-prereq, L-7) land
under ADR-162 Proposed and reference its principle without requiring
Accepted status. Phases 2–5 open **after** the Accepted flip and
reference ADR-162 as Accepted. The only circular dependency that
could have existed — Phase 1 deliverables requiring Accepted status —
does not hold; Phase 1 discharges principle-level obligations under
Proposed, and Phase 1's own closure flips the ADR.

---

## Lane Close Evidence Pattern

Every lane close in this plan states its outcome in three distinct
parts. This shape is consistent with the evidence-bundle template
landing in the governance-concept integration lane
(`.agent/plans/agentic-engineering-enhancements/evidence-bundle.template.md`)
and forces the plan-versus-reality gap into view at every close.

1. **Attempt** — what the lane edited / enabled / authored. The
   verb-phrase description of what was *done*.
2. **Observed outcome** — what happened when the edit was exercised:
   specific lint counts, test output, `pnpm check` exit code, a
   recorded artefact (commit SHA, video link, sentry-cli response,
   etc.). Anything externally verifiable.
3. **Proven result** — the specific invariant that now holds,
   stated as a property that would fail if the change were reverted.
   E.g. "catch-throw-new sites without `{ cause }` now fail `pnpm
   check` at error severity in the 5 Wave-1 workspaces." Not "the
   rule is enabled" (which is an attempt) and not "the lint passed"
   (which is an observation). An invariant statement about system
   behaviour.

**Why the third leg is load-bearing**. Without the proven-result
statement, a lane close is a self-report of intent; with it, a lane
close is a claim about the running system that a reader can
independently verify by attempting to violate it.

**Linked forward-motion evidence**:
[`what-the-system-emits-today.md`](../what-the-system-emits-today.md)
is updated with the proven-result content at every lane close. The
two documents compose: the maximisation plan is the lane inventory;
the emits-today artefact is the running-system snapshot.

---

## Phase 1 — Gates & Foundation Extractions

### Phase 1 dependency graph (lane-level, authoritative)

Dependencies cross execution phases. Execution-phase assignments are
stated in parentheses for clarity.

- `L-0b (Phase 1) → L-4b (Phase 3)` — barrier test gate exists before the primary metric adapter extends the hook registry.
- `L-4b (Phase 3) → L-4a (Phase 5, MVP-deferred)` — primary `Sentry.metrics.*` adapter stable before the transitional span-metrics convention adopts (restructure Phase 4 priority swap 2026-04-18).
- `L-2 (Phase 3) → L-DOC-initial (Phase 1)` — **swap direction from the pre-reshape graph**: under the reshape, L-DOC initial is authored in Phase 1 as documentation for the pre-reshape delegate seam. L-2's Phase 3 delegates extraction will subsequently update the docs in a small follow-up within its own lane. The pre-reshape `L-2 → L-DOC-initial` edge no longer applies.
- `L-0b (Phase 1) ↔ L-12-prereq (Phase 1)` — coordinating, not strict blocking (both in Phase 1 now — L-12-prereq extracts pure redactor core whose correctness depends on the redaction policy code, not on the Node-side test harness; it authors its own runtime-neutral tests).
- `L-12-prereq (Phase 1) → L-12 (Phase 4)` — widget Sentry cannot land without the browser-safe redactor core extracted (crosses Phase 1 → Phase 4 boundary in the reshape; still a strict blocking edge).
- `L-0b (Phase 1) → L-13 (Phase 5)` — barrier-bypass alert derives from ADR-160's test gate.
- `L-13 (Phase 5) → L-1, L-4b (Phase 3); L-12 (Phase 4); security-observability, accessibility-observability (Phase 4)` — alerts reference product loops and axis events that must exist first.
- `L-0b (Phase 1) ↔ L-EH initial (Phase 1)` — soft — ESLint rule authoring shares `oak-eslint` infrastructure with L-3's boundary-rule discussion and the Phase 1 gate-landing cluster.
- `require-observability-emission (Phase 1, from restructure Phase 5) → every emitting lane (Phase 3, 4)` — compile-time gate for emission presence is authored before any emission site is written; every Phase 3/4 lane lands through the gate.
- `no-vendor-observability-import (Phase 2, from vendor-independence plan WS1 carve-out) → every emitting lane (Phase 3, 4)` — structural import lint is authored before any emission site is written; every Phase 3/4 lane is gate-conformant at write-time.
- `observability-events-workspace (Phase 2) → L-1, L-3, L-4b, L-9 (Phase 3); L-12 (Phase 4); security-observability, accessibility-observability (Phase 4)` — schemas exist before any emitter imports them.
- `L-12-prereq (Phase 1) → L-12 (Phase 4); observability-events-workspace runtime consumer (Phase 3+)` — `telemetry-redaction-core` extraction is a Phase 1 precondition for every payload that passes through the redaction barrier on either runtime.

### L-0a Ground-truth correction

**Objective**. Ensure the corrected ground-truth inventory (`wrapMcpServerWithSentry` is wired; redactor covers five hooks today; fixture mode does NOT route through hook pipeline) is reflected across adjacent docs so no future contributor has to re-discover it from source.

**Scope**:

1. Confirm ADR-143 §6 supersession note points at ADR-160 (lines 144–151 of the ADR; already in place as of 2026-04-17).
2. Confirm ADR-143 frontmatter Status line reads "Superseded in part by ADR-160 (§6 only)" (applied 2026-04-17).
3. Update `active/sentry-observability-translation-crosswalk.plan.md` to reflect ADR-160 as the authoritative successor to ADR-143 §6.
4. Verify session napkin and `distilled.md` carry the grounding lesson (ground before framing; composition root must be read before proposing integration pivots).

**Acceptance**:

1. ADR-143 §6 note and frontmatter Status line both present and aligned (verify by re-read).
2. Crosswalk plan references ADR-160.
3. No drift between session-prompt claims and source-of-truth files.

### L-0b ADR-160 test-gate implementation

**Objective**. Implement the three-part closure-property test gate named by ADR-160 so the redaction-barrier doctrine is machine-enforced across every currently-wired fan-out path. Compile-time enforcement surfaces future hooks (e.g. `beforeSendMetric` in L-4b) as build-breaks until their redaction wiring lands.

**Prerequisite** (Accepted 2026-04-17): [ADR-160: Non-Bypassable Redaction Barrier as Principle](../../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md) supersedes ADR-143 §6 in part. Owner accepted both ADR-160 and ADR-161 as-drafted at Phase B of the fresh session. L-0b implements the ADR-160 test gate against this accepted specification.

**RED — new file = genuine RED**:

Author `packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts`. No `.conformance.` discriminant (repo convention is `.unit.test.ts` / `.integration.test.ts`). The file does not exist at session start; its non-existence is the RED state.

Proof surface is **direct invocation of hook closures** from `createSentryHooks({ mode: 'sentry', ... })` and `createSentryInitOptions(...)`'s returned `NodeOptions`. Fixture mode is NOT the proof surface — `createFixtureRuntime` in `runtime.ts` does not install or invoke the `beforeSend*` hook pipeline. Extend the existing `capturingPostRedactionHooks` harness at `runtime.unit.test.ts:421–514` rather than creating a parallel harness.

Three-part coverage per ADR-160 closure property:

1. **Composition presence** — a TypeScript `satisfies` check over a discriminated-union type of fan-out hook names; compiler fails the build if a new hook is added to `NodeOptions` but not the union. Plus a runtime assertion that every hook name in the union is a function on `createSentryInitOptions({...})`'s returned options.
2. **Ordering invariant** (ADR-160 closure part 2) — for each hook with a `SentryPostRedactionHooks` slot (`beforeSend`, `beforeSendTransaction`, `beforeBreadcrumb`), inject a capturing post-redaction hook that records the argument it receives; feed the top-level hook closure a PII-bearing payload; assert the captured argument is already redacted. This proves the redactor runs **before** the post-hook.
3. **Redacted-at-destination** — for each of the five hooks, assert the returned payload has PII replaced by the redaction sentinel.

Per-hook contract metadata (drives assertion shape per ADR-160's non-uniformity table):

| Hook | Sync/async | Can drop? | Bypass proof |
|------|------------|-----------|--------------|
| `beforeSend` | async-capable (always `await` return) | yes (`null`) | post-hook capture (Part 2) |
| `beforeSendTransaction` | async-capable (always `await`) | yes (`null`) | post-hook capture (Part 2) |
| `beforeBreadcrumb` | sync | yes (`null`) | post-hook capture (Part 2) |
| `beforeSendLog` | sync | yes (`null`) | direct-omission (pure helper, Part 3) |
| `beforeSendSpan` | sync | **no** (typed return) | direct-omission (pure helper) — assert `result !== null && result !== undefined` |

`beforeSendMetric` is NOT covered in L-0b — `@sentry/node`'s pinned version does not wire it today. L-4b extends the registry; the compile-time `satisfies` check will require L-4b to add coverage in the same PR.

Payload construction:

- Multiple PII classes per hook: email-like, UK phone-shaped, OAuth-token-shaped, auth-header-shaped.
- PII placed in each redacted sub-field per `runtime-redaction.ts`'s coverage surface (message, logentry, transaction name, breadcrumb message/data, exception type/value/module, extras, request URL/query_string/cookies/env/headers, span description and string span data).
- For `beforeSend`'s event shape: at minimum, PII in `event.message`, `event.exception`, `event.request.headers`, and `event.extra`.

Automated bypass validation:

A nested describe block (or sibling file) constructs a pure local helper `createSentryHooksWithBypass(hookName)` that returns the same shape as `createSentryHooks` but with the named redactor call removed. Feed this harness the same PII payload; assert the sentinel is **absent**. This replaces the manual comment-and-uncomment validation with an automated, CI-runnable negative test.

**GREEN**:

Tests pass against the current `createSentryHooks` implementation — the specification is well-formed and the implementation satisfies it. `pnpm test --filter @oaknational/sentry-node` green; `pnpm check` from repo root green with no filter.

**REFACTOR**:

1. `packages/libs/sentry-node/README.md` acquires a "Redaction barrier" section that cites ADR-160 as authoritative doctrine (L-DOC overlap — coordinate).
2. TSDoc on the hook union type and the `createSentryHooksWithBypass` helper names ADR-160 as the governing doctrine.

**Acceptance**:

1. Three-part coverage present per hook per the table above (`pnpm test` green).
2. Automated bypass-validation test demonstrates that omitting one redactor call produces unredacted output (sentinel absent).
3. TypeScript `satisfies` check over the hook union compiles green; adding a new hook name to `NodeOptions` without adding it to the union breaks the build.
4. ≥ 3 PII classes across ≥ 2 redacted sub-fields per hook.
5. ADR-160 Accepted (done 2026-04-17 at Phase B).
6. ADR-143 §6 supersession note and frontmatter Status line both point at ADR-160 (confirmed in L-0a).

**Cross-references** (per ADR-162 event-schema contract):

- [`observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)
  — the redaction barrier L-0b closes is the gate every schema-
  conformant emission passes through; the events workspace depends
  on this barrier being non-bypassable for its redaction invariant.

### L-EH (initial slice) — Error-handling discipline

**Objective**. Enable ESLint's built-in
[`preserve-caught-error`](https://eslint.org/docs/latest/rules/preserve-caught-error)
rule (added in ESLint 9.35.0) with `requireCatchParameter: true` at
`error` in `src/**/*.ts` of the 5 Wave-1 workspaces, and audit the
in-tree surface. `prefer-result-pattern` remains L-EH final (Phase 5).

**Re-scoping note (2026-04-19)**. The original plan authored a custom
`require-error-cause` rule in `@oaknational/eslint-plugin-standards`.
Before execution, surveyed ESLint 10.x and found
`preserve-caught-error` as a built-in superset: it covers missing
cause, cause-mismatch against a different variable, destructured-
parameter loss, variable shadowing, and every wrapping shape
(AggregateError, async `.catch`, nested try/catch) by construction.
Re-throw of the original binding (`throw err`) is trivially allowed
because it is not a new constructor site. The plan therefore reuses
the built-in instead of authoring a worse wheel. The opt-out path is
ESLint's standard `// eslint-disable-next-line preserve-caught-error
-- <reason>` comment, which composes with the existing
`@oaknational/no-eslint-disable` governance (requires a reason).

**Package change**: none. Built-in rule requires no plugin registration.
No new files under `packages/core/oak-eslint/src/rules/`.

**Files to touch (exactly 5)**, each adding a sibling rule block
next to the existing `@oaknational/require-observability-emission`
block, scoped to `src/**/*.ts`:

- `apps/oak-curriculum-mcp-streamable-http/eslint.config.ts`
- `apps/oak-search-cli/eslint.config.ts`
- `packages/sdks/oak-curriculum-sdk/eslint.config.ts`
- `packages/sdks/oak-search-sdk/eslint.config.ts`
- `packages/sdks/oak-sdk-codegen/eslint.config.ts`

Rule invocation:

```ts
{
  files: ['src/**/*.ts'],
  rules: {
    'preserve-caught-error': ['error', { requireCatchParameter: true }],
  },
},
```

**RED (evidence)**. Run `pnpm lint` from repo root after enabling.
Record per-workspace violation counts — this is the audit surface.
No synthetic RuleTester suite authored in this lane; built-in rule's
own test suite (ESLint core) is the proven behaviour; real-code
audit is the RED evidence per `tdd-for-refactoring.md`.

**GREEN**. The edit is the enable block. If the audit surfaces
violations, categorise as (a) real missing cause, (b) legitimate
pass-through (annotated with `// eslint-disable-next-line
preserve-caught-error -- <reason>`), or (c) destructured /
shadowed / no-param that needs a small structural rewrite. Fix
each in minimal per-file edits — no unrelated refactors.

**REFACTOR**. Cross-link `preserve-caught-error` from
`.agent/rules/use-result-pattern.md` (the rule file expands from
a 5-line pointer to mention the compile-time gate for `{ cause }`).
No `recommended.ts` edit — rule is per-workspace enabled only, not
preset-level (matches the Phase 5 pattern, so the escalation
trigger is discoverable per-workspace).

**Execution result (2026-04-19)**, stated in the three-part shape
(see §Lane Close Evidence Pattern):

- **Attempt**: enable ESLint core's built-in `preserve-caught-error`
  (added in 9.35.0) at `error` severity with
  `requireCatchParameter: true`, scoped to `src/**/*.ts`, as a
  sibling rule block next to `@oaknational/require-observability-emission`
  in each of the 5 Wave-1 workspace `eslint.config.ts` files.
- **Observed outcome**: pre-enable audit at `warn` across the 5
  workspaces returned **0 violations** (MCP app 0; search-cli 0;
  curriculum-sdk 0; search-sdk 0; sdk-codegen 0). Sample of 3 real
  `catch`+`throw new` sites in
  `packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts`
  and `src/mcp/stub-tool-executor.ts` all pass `{ cause: error }`
  correctly, confirming ADR-088 + `use-result-pattern.md` discipline
  is followed in practice. `pnpm check` exit 0 at `error` severity
  (88/88 tasks; pre-existing 96 `require-observability-emission`
  warnings unchanged). Architecture-reviewer-fred TO-ACTION
  flipped `warn` → `error` mid-lane (with 0 violations and no
  backlog trigger, `warn` violates `warning-severity-is-off-severity`).
- **Proven result**: in `src/**/*.ts` of the 5 Wave-1 workspaces,
  any newly-authored or edited `throw new Error(...)` inside a
  `catch` block that does not attach the caught binding as
  `{ cause }` now fails `pnpm check` at `error` severity. Any
  `catch` block declared without a parameter also fails. Any
  destructured or shadowed caught binding that loses the original
  error reference also fails. These invariants are enforced at
  write-time by ESLint core, not by convention; reverting the
  enable blocks in the 5 `eslint.config.ts` files is the only way
  to break them.

**Acceptance**:

1. Each of the 5 workspace `eslint.config.ts` files has the rule
   block with `preserve-caught-error: ['error', { requireCatchParameter: true }]`
   scoped to `src/**/*.ts`.
2. `pnpm lint` reports zero `preserve-caught-error` violations
   repo-wide.
3. `pnpm check` from repo root exits 0 with no filtering.
4. Audit counts recorded in the commit body.
5. `.agent/rules/use-result-pattern.md` cross-references the
   built-in rule as the compile-time gate.

### L-DOC (initial slice) — Documentation inventory

**Objective**. Make the existing Sentry integration discoverable by
reading docs, without grepping. Current `packages/libs/sentry-node/README.md` is a 4-line stub — this lane **expands** it (per A.1 factual correction 10), it does not write a new one.

**RED — reviewer-gate, not content-presence test** (corrected
2026-04-19 during L-DOC initial execution). The prior shape prescribed a
structural content-presence test asserting specific tokens appear in each
doc. That shape violates
[`.agent/directives/testing-strategy.md`](../../../directives/testing-strategy.md):
the test constrains implementation (doc wording) rather than proving
behaviour; legitimate rewording of the docs would fail the test. The
authoring concept-checklist below is retained as the *authoring and
reviewer walkthrough* guide, but it is not enforced by an automated test.
Acceptance falls on the reviewer matrix (`docs-adr-reviewer`,
`onboarding-reviewer`) plus the manual reader-test in Acceptance #2.

Authoring concept checklist (for reviewer walkthrough, not automated):

- In `packages/libs/sentry-node/README.md`: modes (off/fixture/sentry),
  redaction barrier (ADR-160), DI seam (ADR-078), fixture store, logger
  sink, shared delegates.
- In `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`:
  `wrapMcpServerWithSentry` wiring (with the `core-endpoints.ts:98`
  reference), per-request span `oak.http.request.mcp`, scope enrichment
  (`mcp.method`, `mcp.tool_name`), Express error handler registration at
  `src/index.ts:40-41`, source-map upload via `pnpm sourcemaps:upload`,
  redaction barrier entry points (ADR-143 + ADR-160).

**GREEN**: Write both files. The sentry-node README expansion absorbs the 4-line stub.

**REFACTOR**: Cross-link from the workspace READMEs. **`.agent/directives/AGENT.md § Essential Links`** update is **owner-only** (foundational Practice doc per PDR-003) — L-DOC drafts the target line in plan text or a follow-up note; the owner applies the edit. Add a one-line entry to the ADR index if the amendment from L-0 warrants it.

**Acceptance**:

1. ~~Structural content-presence test passes.~~ **Superseded
   2026-04-19**: content-presence tests violate testing-strategy.md;
   replaced by reviewer-matrix pass (Acceptance #2).
2. Manual review: a reader unfamiliar with the code can answer "is
   MCP auto-instrumented?" and "where does redaction happen?" from
   docs alone. Verified by `docs-adr-reviewer` and `onboarding-reviewer`
   specialist passes.
3. AGENT.md Essential Links edit is deferred to owner (tracked as follow-up in executable plan todos).

**Lane close evidence (2026-04-19)** — per §Lane Close Evidence Pattern:

- **Attempt**: Expanded `packages/libs/sentry-node/README.md` from
  4-line stub to package-level reference covering modes, redaction
  barrier (ADR-160), DI seam (ADR-078), fixture store, logger sink,
  shared delegates, and related ADRs. Authored new
  `apps/oak-curriculum-mcp-streamable-http/docs/observability.md` as
  the authoritative app-level guide covering `wrapMcpServerWithSentry`
  at `core-endpoints.ts:98`, per-request span `oak.http.request.mcp`,
  scope enrichment (`mcp.method`, `mcp.tool_name`), Express error
  handler DI wiring at `src/index.ts:40-41`, manual spans, redaction
  barrier entry points (ADR-143 + ADR-160), source-map upload, and
  release metadata. Shrunk the app README Observability section
  (lines 176–235) to a summary plus link. Added the new doc to the
  app README's Detailed Documentation list. Authored and then
  **removed** a structural content-presence test under
  `scripts/` after reconsidering against testing-strategy.md (see
  §RED correction above). Appended an Update Log entry to
  `what-the-system-emits-today.md`.
- **Observed outcome**: `pnpm check` exit 0 from repo root with no
  filter (PDR-025). Pre-commit hooks passed on Step 0 governance-lane
  commit. Reviewer matrix (`docs-adr-reviewer`, `onboarding-reviewer`)
  run at lane close; results recorded in the commit body.
- **Proven result**: a reader unfamiliar with the code can answer
  "is MCP auto-instrumented?" (yes — `wrapMcpServerWithSentry` named
  at a specific file:line in the dedicated observability doc) and
  "where does redaction happen?" (the ADR-160 barrier, with a link
  to the enforcing test suite) from the docs alone. Reverting any of
  the three touched files would regress the discoverability property
  named in the Phase 5 honest-evaluation pass; the reviewer matrix
  is the current enforcement gate (not an automated test, per the
  testing-strategy correction).
- **AGENT.md Essential Links draft** (owner-only per PDR-003): add
  a pointer line under an Observability or Runtime Practice block
  — suggested draft `[Sentry observability](../../apps/oak-curriculum-mcp-streamable-http/docs/observability.md)`
  — for owner review before L-DOC final.

**Reviewer rounds (2026-04-19)**:

- `onboarding-reviewer` P1s actioned in-place: fixed 11 broken ADR
  filename links (actual slugs `078-dependency-injection-for-testability`,
  `143-coherent-structured-fan-out-for-observability`,
  `160-non-bypassable-redaction-barrier-as-principle`); added forward
  links from `docs/foundation/quick-start.md` (both signpost locations)
  and `docs/operations/README.md` to the new doc pair; added an
  Observability section to `docs/README.md`; added a forwarding link
  from `docs/operations/sentry-deployment-runbook.md § Redaction` to
  the new authoritative surfaces. Softened brittle line-number
  citations to symbol names for `src/mcp-handler.ts` and
  `src/handlers.ts`; retained the plan-required `core-endpoints.ts:98`
  and `src/index.ts:40-41` references.
- `docs-adr-reviewer` Critical Gaps actioned:
  - ADR filename mismatches — fixed (shared with the onboarding P1).
  - `SentryPostRedactionHooks` vs `SentryRedactionHooks` conflation —
    corrected in both docs: the barrier wires five hooks as
    `SentryRedactionHooks`; `SentryPostRedactionHooks` is the
    three-member subset that admits consumer post-redaction slots.
  - Scope enrichment + `userId` — corrected: the doc now states
    `observability.setUser({ id: userId })` is called when an
    authenticated `userId` is present, matching
    `src/mcp-handler.ts`. The `clientId` / `scopeCount` /
    `hasUserContext` fields are correctly attributed to the
    stdout JSON auth-success log, not the Sentry scope.
  - "stripped" → "deny-list-masked" wording correction applied.
  - Two-layer span reconciliation added (manual
    `oak.http.request.mcp` wrapper vs
    `wrapMcpServerWithSentry`'s nested MCP-server spans).
  - `SentryConfigEnvironment` / `SentryMode` framing corrected
    (`live` → `sentry`; discriminated `ParsedSentryConfig`).
  - L-7 plan-back link added; `:98` added to README summary for
    consistency.

**Follow-up items (not in this lane)**:

1. **Architectural question raised by docs-adr-reviewer**: should
   `userId` reach the Sentry user scope at all, or is Oak's
   observability boundary meant to exclude it entirely? Today the
   code sets `user.id = userId` via `observability.setUser` at
   `src/mcp-handler.ts`. If the intent is exclusion, the `setUser`
   call is a code defect; if inclusion is intended, ADR-143's
   observability boundary should be clarified. Route: open a
   bounded architecture-reviewer-fred question lane on the next
   session, or raise via PR discussion.
2. **MCP-specific telemetry shape is not tested at the Oak
   boundary**: the claim that MCP observations retain only kind,
   name, status, duration, and trace identifiers is a property of
   `wrapMcpServerWithSentry` + `sendDefaultPii: false` + generic
   redaction, not an Oak-side test. Candidate for a future lane
   when the events-workspace (Wave 2) can provide assertion shapes.
3. **CONTRIBUTING.md** has no observability reference (P3). Add
   one bullet under "Where the documentation lives" pointing to
   the new doc pair. Owner-gateable; small follow-up.

### L-12-prereq Browser-safe redactor core extraction

> **Status (2026-04-19)**: ✅ **CLOSED** via the observability-primitives-consolidation lane (archived at [`architecture-and-infrastructure/archive/completed/observability-primitives-consolidation.plan.md`](../../architecture-and-infrastructure/archive/completed/observability-primitives-consolidation.plan.md); commit `e09918a8`).
>
> The original brief for this lane was to extract a pure, runtime-agnostic redactor core into a new `packages/core/telemetry-redaction-core/` workspace. A 2026-04-19 scaffolded attempt surfaced a core→lib boundary violation (sanitisation primitives were in `@oaknational/logger`, a lib) and an over-decomposition signal (the new workspace was 139 LOC of pure composition over `@oaknational/observability`'s existing primitives). Architecture review (fred + barney) resolved the tension by **folding the primitives into `@oaknational/observability`** rather than creating a new core workspace. The substantive goal of L-12-prereq — a browser-safe home for the redaction primitives that Wave 4 L-12 (widget Sentry) can compose — was achieved by that fold without any new workspace.
>
> **What has been checked post-consolidation** (all satisfied as of 2026-04-19):
>
> - `@oaknational/observability` owns redaction primitives + JSON sanitisation + unified recursive JSON-safe type (`JsonValue`/`JsonObject`).
> - `@oaknational/sentry-node` composes directly from observability (no intermediate workspace hop).
> - Zero `@sentry/*` and zero `node:*` in observability runtime `src/` (structurally enforced by `packages/core/observability/src/no-node-only-imports.unit.test.ts`).
> - `packages/core/telemetry-redaction-core/` does not exist (workspace entry removed from `pnpm-workspace.yaml`; lockfile clean).
> - Wave 4 widget Sentry can compose observability without a prerequisite extraction.
>
> ADR-160 §Closed Questions carries the amended placement decision + dated history entry.
>
> **Original body retained below** as the record of the scaffolded attempt that surfaced the architectural repair. The extraction-focused decomposition rationale is historical; the actual landing shape is the fold documented above.

**Objective** (A.2 item 6, per architecture-reviewer-fred + sentry-reviewer). Extract a pure, runtime-agnostic redactor core into a new browser-safe package so both the Node adapter (`@oaknational/sentry-node`) and the forthcoming browser adapter (L-12) compose it. **Proposes** (pending ADR-160 amendment) to close the ADR's "Open Question" on redactor core placement in favour of a new package. ADR-160 is Accepted 2026-04-17 with Open Questions intact; L-12-prereq GREEN is conditional on either a minor ADR-160 amendment closing the question or owner confirmation that plan-prose is sufficient authority for the decision.

**Package placement — new `packages/core/telemetry-redaction-core/`, NOT a submodule**. Rationale: `@oaknational/sentry-node`'s `runtime-redaction.ts` imports types from `@sentry/node` (`Breadcrumb`, `Exception`, `NodeOptions`, `RequestEventData`), coupling it to Node. A subpath export from `@oaknational/sentry-node` would still pull `@sentry/node` into the browser graph transitively. Only a separate core package with zero `@sentry/*` dependencies can be composed from both runtimes. Precedent: `design-tokens-core/oak-design-tokens` split per ADR-154 § Examples. Tier `packages/core/` matches ADR-041 workspace structure.

**Scope**:

- New workspace at `packages/core/telemetry-redaction-core/` — depends only on `@oaknational/type-helpers` and a generic redact primitive; no `@sentry/*` imports.
- Extract the pure redaction functions (`redactText`, deny-list policy, `SentryPrimitiveValue` narrowing) from `packages/libs/sentry-node/src/runtime-redaction.ts`.
- `@oaknational/sentry-node` adopts the core as a dependency and re-wraps each `redactSentryEvent` / `redactSentrySpan` / etc. around the core functions with Node-specific payload adapters.
- Contract: core accepts generic payload shapes parameterised by a "what to redact" descriptor; adapters describe per-runtime payload walks.

**RED**: Extract is by symbol move — existing `runtime-redaction.unit.test.ts` behaviour must be preserved. Introduce parallel tests on the core package exercising the pure redactor functions in runtime-neutral shapes (no `@sentry/node` types in the core's test surface).

**GREEN**: Workspace created, dependency wired, existing tests pass. Node adapter preserves exact behaviour (no behaviour change).

**REFACTOR**: TSDoc naming ADR-160 as doctrine on both packages. `@oaknational/sentry-node` README section describing the composition. Core package README describing the runtime-neutral contract.

**Acceptance**:

1. New workspace builds under `pnpm build`; `pnpm type-check` green from repo root.
2. `@oaknational/sentry-node` tests unchanged in behaviour (Node adapter composes core).
3. Zero `@sentry/*` imports in `packages/core/telemetry-redaction-core/`.
4. L-12 can import the core without pulling `@sentry/node` into the widget bundle.

### L-7 Release + commits + deploy linkage — BESPOKE LANDED, BEING TORN OUT (2026-04-20)

> **Supersession note** (2026-04-20): the bespoke orchestrator described in
> this section landed across commits `7f3b17e9` + `6f5acd17` + `ecee9801`
> and is now being replaced by `@sentry/esbuild-plugin` (task #22, L-8 in
> frontmatter). Owner identified in one question that the vendor's
> first-party bundler plugin eliminates ~900 lines of bespoke code. The
> body below is retained as historical record of the shape that was
> built; the authoritative forward path is L-8 + task #22. ADR-163 §6
> prose will be amended by the migration plan to state the outcome
> Sentry must reach, not the specific CLI invocations chosen. Bespoke
> commits stay in git history as signal for the build-vs-buy lesson
> captured in commit `4bccba71` guardrails.

**Authoritative mechanism**: see
[ADR-163: Sentry Release Identifier, Source-Map Attachment, and Vercel
Production Attribution](../../../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md).
This lane is a mechanical transcription of the ADR; any divergence
between the lane and the ADR is a lane bug.

**Objective**. Close the regression-detection loop. Every emitted
event carries a semver release tag and a git SHA tag; every release
has a timeline of deploys across `preview` and `production`
environments; every deploy carries the commit SHA that was built.

**Pipeline discipline** (ADR-161 + ADR-163 §7): L-7 scripts run inside
the **Vercel Build Command** only, via a dedicated orchestrator
invoked as part of the single Vercel build step. PR checks stay
network-free per ADR-161. Local-dev builds do not register Sentry
releases or deploys unless the
`SENTRY_RELEASE_REGISTRATION_OVERRIDE=1` /
`SENTRY_RELEASE_OVERRIDE=<version>` env pair is set (ADR-163 §4).

**Preceding machinery — already wired, no L-7 work required**:

- `.github/workflows/release.yml` runs `semantic-release` on successful
  CI on `main`. `semantic-release` creates a bump-commit to `main` with
  the advanced root `package.json` version. `concurrency: release`
  with `cancel-in-progress: false` serialises release workflows, so
  competing version-bump commits cannot be produced in parallel.
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`
  is wired as `ignoreCommand` in `apps/oak-curriculum-mcp-streamable-http/vercel.json`.
  It cancels production builds whose root `package.json` version has
  NOT advanced beyond the previous successful deployed version. Only
  the `semantic-release` bump-commit triggers a production Vercel
  build.

L-7 does **not** change either of these. L-7 attaches steps inside the
Vercel Build Command that runs on the version-bump commit.

**Script partitioning** (ADR-163 §7): one orchestrator, three
underlying building blocks.

- `apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`
  — **stays as-is except for a doc comment update** (see "WHEN TO RUN"
  in the existing script). This script runs the Debug-ID + upload pair
  (§6.3–§6.4 of ADR-163).
- `apps/oak-curriculum-mcp-streamable-http/scripts/sentry-release-and-deploy.sh`
  (new) — the **single orchestrator** owning steps §6.1, §6.2, §6.5,
  and §6.6 of ADR-163, plus calling `upload-sourcemaps.sh` for §6.3
  and §6.4. Per-step error-handling posture matches ADR-163 exactly
  (abort on §6.1, warn-continue on §6.2, abort on §6.3–§6.4, warn-
  continue on §6.5 and §6.6). No partitioning into multiple orchestrator
  scripts: per-step exit-code inspection requires the single-script
  shape per ADR-163 §7.
- `apps/oak-curriculum-mcp-streamable-http/package.json` gains a
  `build:vercel` script that runs `pnpm build` followed by
  `scripts/sentry-release-and-deploy.sh`. The Vercel Build Command
  setting is updated to invoke
  `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http run build:vercel`.
  Local `pnpm build` remains unchanged (tsup only, no side effects).

**Preflight computed by the orchestrator** (ADR-163 §6 preflight):

1. `VERSION = $(node -p "require('./package.json').version")` read
   from the repo root `package.json`.
2. Verify `VERCEL_ENV` is one of `production`, `preview`, or
   `development`. If `development` (or unset), exit 0 without
   registering unless `SENTRY_RELEASE_REGISTRATION_OVERRIDE=1` AND
   `SENTRY_RELEASE_OVERRIDE` is set.
3. Compute `DERIVED_ENV` per ADR-163 §3 truth table. Log the derived
   value and the branch warning (if any) before any sentry-cli call.
4. Verify `VERCEL_GIT_COMMIT_SHA` is set and matches `/^[0-9a-f]{7,40}$/i`.
5. Verify `SENTRY_AUTH_TOKEN` is set (non-empty). Do not print it.
6. Verify `dist/` exists and is non-empty.

Any preflight failure → exit non-zero → Vercel build fails.

**CLI sequence** (copy of ADR-163 §6):

```bash
sentry-cli releases new "$VERSION"                          # §6.1 abort on fail

sentry-cli releases set-commits "$VERSION" \                # §6.2 warn-continue
  --commit "oaknational/oak-open-curriculum-ecosystem@$VERCEL_GIT_COMMIT_SHA"

# §6.3 + §6.4 = existing upload-sourcemaps.sh, abort on fail
RELEASE="$VERSION" ./scripts/upload-sourcemaps.sh

sentry-cli releases finalize "$VERSION"                     # §6.5 warn-continue

sentry-cli deploys new --release "$VERSION" -e "$DERIVED_ENV"  # §6.6 warn-continue
```

**Runtime contract changes** (ADR-163 §8): adds
`VERCEL_GIT_COMMIT_REF?: string` and
`SENTRY_RELEASE_REGISTRATION_OVERRIDE?: string` to
`packages/libs/sentry-node/src/types.ts#SentryConfigEnvironment`.
Extends `resolveSentryEnvironment` to implement the ADR-163 §3 truth
table. `resolveSentryRelease` unchanged.

**Additional SDK scope contract**: `initialiseSentry` in
`packages/libs/sentry-node/src/runtime.ts` gains one additional tag
on the SDK's `initialScope.tags` map: `git.commit.sha = <sha>`
(resolved via the existing `resolveGitSha` in `config-resolution.ts`).
This is the tag described in ADR-163 §2.

**RED** (TDD per `.agent/rules/tdd-for-refactoring.md`):

1. **Unit tests in `config-resolution.unit.test.ts`** — parametrised
   test with one row per row of the ADR-163 §3 truth table. Assert
   `resolveSentryEnvironment(...)` returns the expected `{ value,
   source }` pair AND that a warning-intent marker is returned
   alongside when the branch check fires.
2. **Unit tests for the `VERCEL_GIT_COMMIT_REF` input surface** —
   `SentryConfigEnvironment` type now includes the field; test that
   `createSentryConfig` validates + forwards it end-to-end into the
   resolved config.
3. **Unit tests for the override-pair behaviour** — both env vars
   required together; one without the other is a startup error per
   ADR-163 §4.
4. **Orchestrator-script argument-vector tests** — against a fake
   `sentry-cli` binary placed on `PATH`, invoke the orchestrator with
   representative `VERCEL_ENV` / `VERCEL_GIT_COMMIT_REF` /
   `VERCEL_GIT_COMMIT_SHA` combinations and assert the exact argument
   vectors emitted (one assertion per CLI step). The fake-CLI harness
   follows the ADR-159 shape already used by
   `upload-sourcemaps.sh`'s tests.
5. **Per-step error-handling tests** — the fake CLI returns non-zero
   for a given step; assert orchestrator either exits non-zero (§6.1,
   §6.3, §6.4) or logs a warning and continues (§6.2, §6.5, §6.6) per
   ADR-163.

All tests run in-process with no network (ADR-161 compliant). No
smoke test dependency on Sentry SDK state.

**GREEN**:

1. Extend `SentryConfigEnvironment` per ADR-163 §8.
2. Implement the branch-check in `resolveSentryEnvironment`.
3. Add the `git.commit.sha` tag to `initialiseSentry`.
4. Author `scripts/sentry-release-and-deploy.sh` with the preflight
   - CLI sequence + per-step error handling.
5. Author `scripts/sentry-release-and-deploy.unit.test.ts` (or `.sh`
   equivalent harness) exercising the fake-CLI paths.
6. Add `build:vercel` to `apps/oak-curriculum-mcp-streamable-http/package.json`.
7. Update the Vercel Project Settings Build Command override to
   `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http run build:vercel`.
   Document the exact value in
   `docs/operations/sentry-deployment-runbook.md` §Build Command (new
   subsection).

**REFACTOR / Documentation updates** (ADR-163 §Enforcement.3):

- `docs/operations/sentry-deployment-runbook.md` — fix the SENTRY_RELEASE
  auto-resolved row (semver, not SHA); add a new "Release → commit →
  deploy linkage" section transcribing ADR-163 §6.
- `docs/operations/sentry-cli-usage.md` — add the release-linkage
  sequence as a named invocation pattern; reference ADR-163.
- `apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`
  — update WHEN TO RUN to say `RELEASE=$VERSION_FROM_PACKAGE_JSON`
  only; remove the SHA alternative.
- `apps/oak-curriculum-mcp-streamable-http/docs/observability.md` —
  link to ADR-163 as the release/deploy authoritative source.
- `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`
  — link to ADR-163 §3 truth table; add `VERCEL_GIT_COMMIT_REF` to the
  enumerated runtime-config env vars.
- `packages/libs/sentry-node/README.md` — point at ADR-163 for
  release/deploy semantics.

**Acceptance**:

1. **Runtime**: `config-resolution.unit.test.ts` parametrised tests
   pass for every row of ADR-163 §3. Override-pair startup errors
   pass.
2. **Build pipeline**: orchestrator script unit tests green for each
   CLI step (§6.1–§6.6), each error-handling posture, each preflight
   failure mode.
3. **End-to-end demonstration** (piggybacks on the Phase 1 close
   demonstration artefact below): a preview deploy of the
   version-bump commit shows:
   - Sentry UI: release `<semver>` tagged with commit SHA (verify via
     `sentry api organizations/oak-national-academy/releases/<semver>/commits/`).
   - Sentry UI: deploy event for `preview` environment (verify via
     `sentry api organizations/.../releases/<semver>/deploys/`).
   - Sentry UI: an event emitted post-deploy carries both `release =
     <semver>` and `git.commit.sha = <sha>` tags.
4. **Pipeline-boundary invariant** (ADR-161): grep of
   `.github/workflows/*.yml` returns zero `sentry-cli` invocations.

**Cross-references** (per ADR-162 five-axis principle +
vendor-independence clause):

- [ADR-163](../../../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md)
  — authoritative mechanism.
- [ADR-161](../../../../docs/architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md)
  — pipeline boundary.
- [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
  — archived closure record for the bounded repo-owned corrective lane
  that sat between L-8 and the owner-run validation stages; external
  uptime monitoring starts outside the repo.
- [`multi-sink-vendor-independence-conformance.plan.md`](../current/multi-sink-vendor-independence-conformance.plan.md)
  — L-7 carries an explicit **release-linkage carve-out** from the
  vendor-independence clause. Release linkage is Sentry-coupled by
  nature; the conformance plan's scope explicitly acknowledges this
  signal as one that need NOT survive `SENTRY_MODE=off`.

---

## Phase 1 (Wave 1) Close — External Demonstration Criterion

Added 2026-04-19 as a forward-motion assurance mechanism. At the
point Wave 1 formally closes (L-EH initial ✅ + L-DOC initial +
L-12-prereq + L-7 all landed + restructure Phase 5 carve-out ✅), a
**recorded end-to-end demonstration** is a required acceptance
artefact. Not a replacement for the lint/test gates; a
complement. Rationale: gates prove absence of known failures;
demonstration proves presence of the wired pipeline.

**Scope**: one ≤5-minute recording (screen + narration OR
annotated transcript) that shows:

1. MCP server boot under `SENTRY_MODE=sentry` (or fixture, whichever
   matches the Wave 1 post-close state).
2. One MCP tool invocation flowing through the server — any real
   tool, not a synthetic test.
3. Sentry capture of a deliberately-introduced exception in the tool
   path, visible in the Sentry UI with source-map-resolved stack.
4. Structured emission visible via `@oaknational/logger` stdout at
   the same moment, demonstrating the ADR-162 minimum-functionality
   property at engineering-axis scope.
5. Redaction barrier observable — a payload containing a
   redaction-trigger token emitted and the post-barrier form visible
   in both sinks.

**Location**: link from this plan's Acceptance Summary section, and
from [`what-the-system-emits-today.md`](../what-the-system-emits-today.md)
Update Log. The artefact itself may live in owner-controlled storage;
the plan records the link and the date.

**Why this is cheap**: every step is already wired in code today —
`wrapMcpServerWithSentry` at `core-endpoints.ts:98`, the Express
error handler at `index.ts:40-41`, `runtime-redaction-barrier`
closure tests, the logger sink. The demo is not new behaviour; it
is a recorded trace of existing behaviour that an external observer
can replay. The step that is *not* available today (vendor-
independence at `SENTRY_MODE=off` across all runtimes) is
explicitly out of Wave 1 scope and handled by
[`current/multi-sink-vendor-independence-conformance.plan.md`](../current/multi-sink-vendor-independence-conformance.plan.md)
Wave 5.

**Failure mode this blocks**: "the gates are green so the system
works" — true at the axis Wave 1 addresses (engineering), but
nothing in the lint/test gates asserts that a human-initiated
invocation actually produces the expected observable trace. The
recording does.

**Nearer-term partial analogue** (proposal, not yet lane-scoped):
a **minimum-viable conformance test** at MCP-server-only scope,
engineering axis only, `SENTRY_MODE=off`, asserting one tool
invocation produces event information via stdout. Authorable
against the existing logger + adapter without the events workspace;
converts ADR-162's vendor-independence claim to a tested invariant
at current scope before Wave 2 opens. Raised in
[`what-the-system-emits-today.md §Vendor-Independence Status`](../what-the-system-emits-today.md).

---

## Phase 2 — Schema Foundation

> **Phase 2 is owned by sibling `current/` plans, not by maximisation
> lanes.** This phase-body is a reference pointer; execution happens
> in the sibling plans named below when they promote to `active/`.
> Wave-close semantics per the high-level observability plan:
> maximisation plan owner signals Phase 2 closure after BOTH sibling
> plans GREEN + reviewer matrix discharged.

**Work**:

- [`observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)
  WS1–WS6 — creates `packages/core/observability-events/` as a new
  workspace with Zod schemas for the seven MVP events (`tool_invoked`,
  `search_query`, `feedback_submitted`, `auth_failure`,
  `rate_limit_triggered`, `widget_session_outcome`,
  `a11y_preference_tag`), a correlation-keys contract, a
  `conformance.ts` helper every consuming workspace composes, and an
  `event-catalog.md` data-scientist-facing reference.

- [`multi-sink-vendor-independence-conformance.plan.md`](../current/multi-sink-vendor-independence-conformance.plan.md)
  WS1 carve-out — authors the `no-vendor-observability-import` ESLint
  rule in `@oaknational/eslint-plugin-standards`. The sibling current
  plan owns the final severity and rollout posture; this parent plan no
  longer assumes a `warn` staging path now that the branch's honest
  strictness work has already moved `require-observability-emission`
  to `error` in the five scoped workspaces. The rule forbids
  `@sentry/*` imports outside the allowlisted adapter +
  core-observability + composition-root paths per ADR-162 Mechanism #5.
  The **emission-persistence test** (the behavioural gate) is deferred
  to Phase 5 (see §Phase 5 below).

**Why Phase 2 matters**: every Phase 3/4 emitter imports schemas from
`@oaknational/observability-events` and is compile-time-gated by
`no-vendor-observability-import`. Landing both before Phase 3 opens
means every subsequent emission site is schema-conformant and vendor-
independent by construction, not by audit.

---

## Phase 3 — Primary Emitters (Server)

### L-1 Free-signal integrations

**Objective**. Enable the opt-in Sentry Node integrations that ship
free signal.

**Targets**:

- `anrIntegration()` — blocked event-loop detection.
- `zodErrorsIntegration()` — structured Zod error issues.
- `nodeRuntimeMetricsIntegration()` — eight default runtime metrics.
- `spanStreamingIntegration()` + explicit `withStreamedSpan` wrapping
  around the MCP streamable-HTTP transport's `handleRequest` path.
- `rewriteFramesIntegration()` — cleaner stack frames.
- `extraErrorDataIntegration()` — capture non-`message` props on
  thrown objects.

**RED — behaviour-first** (A.2 item 9 tightening). Tests assert the observable outcome of each integration, not its registration in `NodeOptions`.

Per-integration behaviour assertions (under `packages/libs/sentry-node/src/` or `apps/oak-curriculum-mcp-streamable-http/src/observability/`):

- **`anrIntegration`**: ANR stack event is emitted when a simulated blocked event-loop condition is detected (fixture-mode capture asserts an ANR-shaped event with redacted stack frames per the barrier).
- **`zodErrorsIntegration`**: a thrown `ZodError` produces a structured issue event (fixture capture asserts the `Zod` error payload with redacted attribute values).
- **`nodeRuntimeMetricsIntegration`**: at least one runtime metric emission appears in the fixture store under the default collection cadence (count-of-metrics is not asserted — the default metric set varies across Sentry SDK 10.x minors and is cited from live Sentry docs at lane-open time, not pinned here).
- **`spanStreamingIntegration`**: a wrapped `withStreamedSpan` call emits a streamed-span envelope that passes through `beforeSendSpan` redaction before capture (additive to `wrapMcpServerWithSentry`, which already patches MCP transport send/onmessage per A.1 factual correction 4 — not a replacement).
- **`rewriteFramesIntegration`**: a thrown error's stack frames have their paths rewritten per the configured rewrite before appearing in the captured event.
- **`extraErrorDataIntegration`**: a thrown object with non-`message` enumerable properties produces an event whose context contains those properties (redacted if PII-shaped).

Integration registration may be verified as a sanity check, but it is not the primary assertion — the behaviour (event shape / content / redaction) is.

**Fixture envelope-observability prerequisite** (per A.6 AR-3, assumptions-reviewer). Before any of the per-integration behaviour assertions can be meaningful, the fixture runtime must be able to observe the envelope types the integrations emit. `createFixtureRuntime` in `runtime.ts` today captures a closed set (`log | exception | set_user | set_tag | set_context | metric (pending L-4b)`) via direct `store.push(...)`; it does NOT route envelopes through the `beforeSend*` adapter pipeline. L-1 GREEN must land one of the following first:

1. **Option A (preferred)** — extend `createFixtureRuntime` to route every envelope through the same `createSentryHooks` composition used by the live SDK, so fixture mode observes the same hook transformations. This aligns fixture and live behaviour and lets L-1 assertions re-use the hook pipeline.
2. **Option B** — add per-envelope capture paths to the fixture store (`ANREvent`, `StreamedSpanEnvelope`, `RuntimeMetricSample`) with their own `beforeSend*` routing. Higher engineering cost; chosen only if Option A conflicts with existing fixture semantics.

Acceptance: the fixture store captures at minimum (a) ANR stack events via `beforeSend`; (b) Zod error payloads via `beforeSend`; (c) runtime metric samples via `beforeSendMetric` (coordinated with L-4b). L-1 does NOT close until this prerequisite lands.

**GREEN**: Extend `createSentryInitOptions` in
`packages/libs/sentry-node/src/runtime-sdk.ts` to compose the integrations.
Compose via injected parameters (ADR-078) — no hardcoded list in the
library beyond documented defaults. Expose an
`additionalIntegrations?: Integration[]` option and a
`disableDefaults?: readonly IntegrationName[]` option to preserve
tunability.

**REFACTOR**: TSDoc on every new integration option; update
`packages/libs/sentry-node/README.md` (new — see L-DOC).

**Redaction verification**: `beforeSendLog` still redacts log
attributes from `zodErrorsIntegration`; `beforeSendSpan` redacts span
attributes from `spanStreamingIntegration`; `beforeSend` redacts stack
frames from `anrIntegration`.

**Acceptance**:

1. Fixture tests prove each integration emits through the shared
   barrier.
2. Live-mode smoke (optional, owner-run) confirms ANR, Zod, and runtime
   metric events appear in Sentry under the test release tag.

**Cross-references** (per ADR-162 five-axis principle + event-schema
contract):

- [`observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)
  — authoritative home for the downstream-analytics event-schema
  contract. ANR events, Zod-error events, runtime-metric samples, and
  streamed-span envelopes that L-1 turns on must conform to the
  schemas defined there when those schemas exist; L-1 does not
  itself author schemas, but emits through paths the events workspace
  catalogues.

### L-2 Delegates extraction

**Objective**. Extract `createSentryDelegates` from the MCP app into
`@oaknational/sentry-node` so both the MCP app and (next branch) the
Search CLI import the same function. Removes the duplicated delegation
seam.

**RED**: Move the existing `sentry-observability-delegates.unit.test.ts`
into `packages/libs/sentry-node/src/`. Make it fail by removing the MCP
app's local implementation before moving.

**GREEN**: Create `packages/libs/sentry-node/src/delegates.ts` exporting
`createSentryDelegates(runtime: SentryNodeRuntime):
SentryObservabilityDelegates`. Export from the barrel. Update the MCP
app to import the shared version. Leave the CLI's
`buildCliObservability` untouched for now — the next branch picks it up.

**REFACTOR**: TSDoc on the exported seam. Note in README that the
seam is shared across app-layer observability objects.

**Explicit-superset discipline** (A.2 item 8, per architecture-reviewer-fred): `SentryObservabilityDelegates` is a **structural intersection at the composition root** — each consumer declares the delegate slice it injects; the library publishes the method factory, not a monolithic interface. Divergence between MCP and CLI consumers is explicit at each composition site, not smuggled in as an "implicit superset with silent discard." When the Search CLI branch adopts the shared factory, its composition root declares its own slice; methods it does not expose never become no-ops of an omnibus interface.

**Acceptance**:

1. `grep -rn "createSentryDelegates" apps/` returns only imports from
   `@oaknational/sentry-node`.
2. MCP app tests unchanged in behaviour.
3. Type-check green.
4. The shared seam exports a method factory (not a closed omnibus interface); each consumer's composition root names its own delegate slice.
5. **Structural-intersection test** (per A.6 AF-3, architecture-reviewer-fred): a type-level test asserts that the published method factory's inferred return type is a structural **intersection** over the consumers' declared delegate slices at each composition root. No method name appears in the public factory type that is not consumed by at least one caller in this repo. This closes the residual silent-discard back-door that "opt-in via method presence" wording alone leaves open.

### L-3 MCP request context enrichment

**Objective**. Populate a typed `mcp_request` context on the Sentry
scope at the handler boundary. Complements, not replaces, the
attributes that `wrapMcpServerWithSentry` writes on spans.

**Location — MCP app, not the shared library** (A.2 item 4, per architecture-reviewer-betty + ADR-154 framework/consumer separation). `enrichMcpRequestContext` is MCP-specific domain logic and MUST live under `apps/oak-curriculum-mcp-streamable-http/src/observability/enrich-mcp-request-context.ts` (sibling to `sentry-observability-delegates.ts`, `sanitise-mcp-events.ts`, `http-observability.ts`). It MUST NOT be exported from `packages/libs/sentry-node/`. Enforcement is two-part today: (a) `packages/core/oak-eslint/src/rules/boundary.ts` (factory `createLibBoundaryRules`, tested by `lib-boundary.unit.test.ts`) governs cross-workspace import direction; (b) `import-x/no-extraneous-dependencies` transitively catches any `@modelcontextprotocol/sdk` import from `sentry-node` because the SDK is not declared in `sentry-node/package.json`. A named "no MCP-specific symbol" pattern is a follow-up lane candidate rather than an existing rule. Putting the function in the shared library would regress ADR-154 and invite a dependency-direction inversion between app domain and shared framework.

**Sensitivity** (A.1 factual correction 7): `recordInputs`/`recordOutputs` on `wrapMcpServerWithSentry` default to `sendDefaultPii`, which Oak pins to `false`. MCP tool inputs/outputs are not captured today. Any future flip of `sendDefaultPii` cascades into L-3's context shape — the deny-list MUST still apply regardless of the top-level flag.

**RED**: Unit/integration tests in `apps/oak-curriculum-mcp-streamable-http/src/observability/` for an `enrichMcpRequestContext` function asserting the context shape. Fields: `session_id`, `method`,
`tool_name`, `argument_shape` (deny-listed key names only, never
values), `client.name`/`client.version`/`client.title` from the
MCP initialize handshake, `server.name`/`server.version`.

**GREEN**: Implement `enrichMcpRequestContext(req, observability)` at the path above and
call it from `mcp-handler.ts`. Redact via existing barrier — request
body never flows into the context.

**REFACTOR**: TSDoc + observability.md update.

**Acceptance**: fixture-mode captures include the `mcp_request` context
with the expected shape and no argument values.

**Cross-references** (per ADR-162 event-schema contract):

- [`observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)
  — the `mcp_request` context shape (session id, method, tool name,
  argument-shape deny-list, client/server party info) is the
  correlation substrate for `tool_invoked` events; the events
  workspace schema for `tool_invoked` depends on these field names
  remaining stable.

### L-4b Primary metrics emission via `Sentry.metrics.*`

**Priority** (2026-04-18 — restructure Phase 4 swap). L-4b is the
**primary** production metrics surface. `Sentry.metrics.*` supersedes
span-metrics (L-4a, Phase 5 MVP-deferred) as the default path for new
metric emissions; span-metrics is retained only for narrow
span-attribution-unique cases (see L-4a). The adapter insulates
consumers from the underlying beta API — consumers depend on
`@oaknational/sentry-node` and `@oaknational/observability`, never on
`Sentry.metrics.*` directly.

**Objective**. Add `metrics: { count, gauge, distribution }` to
`SentryNodeSdk` and `SentryNodeRuntime` as the primary production
metric emission path. Gate live emission behind
`SENTRY_ENABLE_METRICS` during the Sentry beta window so rollout is
explicit and auditable. Extend the shared redaction barrier with
`beforeSendMetric`. Emitted metric names are catalogued alongside
event schemas in
[`observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)
(planned — `packages/core/observability-events/` does not yet exist
as code)
per ADR-162's event-schema contract — `metrics.*` emissions are part
of the downstream-analytics contract, not a Sentry-internal concern.

**Ground-truth corrections** (from sentry-reviewer, 2026-04-17):

- Fixture `type: 'counter'` (not `'count'`).
- `beforeSendMetric` is **synchronous, single-argument** `(metric) =>
  Metric | null` — model on `beforeSendLog`, not `beforeSend`.
- Do NOT manually snapshot trace context — the SDK attaches
  `trace_id`/`span_id` automatically to emitted metrics.
- Redactor must defensively handle non-primitive attribute values
  because upstream `Metric.attributes` is `Record<string, unknown>`.

**Ground-truth corrections** (from architecture-reviewer-fred):

- `SentryOffConfig.enableMetrics: false` as a literal (mirror
  `enableLogs`).
- Parameterise the metric namespace via
  `InitialiseSentryOptions.metricNamespace?: string` — do not hardcode
  consumer-specific prefixes in the shared library.
- ADR-143 amendment is a prerequisite of landing this (done in L-0).

**RED — behaviour-first, test-boundary mechanics specified** (A.2 item 9 tightening; A.6 AR-4 mechanical spec):

Two distinct test surfaces. Each proves a different claim, and they must NOT be conflated:

- **Pure-function `beforeSendMetric` redaction unit test** (primary — proves the **policy**): calls `redactSentryMetric(metric)` **directly** from `runtime-redaction.ts` with a fully-constructed `Metric` payload; asserts the returned metric has sentinel replacement per the policy. No adapter wiring, no `createSentryHooks`, no fixture store. Fails if and only if the redaction policy is wrong.
- **Fixture-capture integration test** (secondary — proves the **wiring**): calls `createSentryInitOptions({ mode: 'sentry', ... })` to get a `NodeOptions`, extracts `beforeSendMetric` from it, invokes the hook on a `Metric` payload, and asserts the fixture store captures the redacted envelope. No assertion on redaction policy beyond "sentinel present" — the exact policy is proved by the pure test. Fails if and only if the adapter wiring has broken.

These two tests must exist as separate `it` blocks with named purpose in their titles (e.g. "`beforeSendMetric` redaction policy (pure)" and "`beforeSendMetric` fixture wiring (integration)"). A combined test that asserts both claims at once is a test-smell per `testing-strategy.md`.

- **Off-mode noop test**: live `Sentry.metrics.*` calls are zero under `SENTRY_MODE=off` (verified by test-time stub on the SDK export).
- **Fixture-mode capture test**: capture shape `{ kind: 'metric', type: 'counter' | 'gauge' | 'distribution', name, value, unit?, attributes, environment, release }` with post-redaction payload (this test proves the fixture adapter records correctly — it does NOT prove the redaction policy; that is the pure unit test above).
- **Attribute narrowing test**: `Record<string, unknown>` inputs with non-primitive values are defensively narrowed to `SentryPrimitiveValue` at the redactor boundary.
- **Namespace parameterisation test**: `InitialiseSentryOptions.metricNamespace?: string` prepends to emitted metric names; default namespace is documented and stable across Oak runtimes.
- **Hook contract shape test**: `beforeSendMetric` is sync, single-argument (modelled on `beforeSendLog`, not `beforeSend`).
- **Compile-time closure extension** (dependency on L-0b): adding `beforeSendMetric` to the hook union in `runtime-redaction-barrier.unit.test.ts` is part of this lane; if L-0b authored the `satisfies` check, L-4b extends it.

**GREEN**: Extend `types.ts`, `runtime-sdk.ts`, `runtime-redaction.ts`,
`runtime.ts`, `fixture.ts`, `config.ts`. Wire `createSentryHooks` with
`beforeSendMetric`.

**REFACTOR**: TSDoc on every new surface. Convention note in README.
Metric emission guide in `observability.md`.

**Acceptance**:

1. Off mode: zero `Sentry.metrics.*` calls verified by test-time stub.
2. Fixture mode: captures `{ kind: 'metric', type: 'counter' | 'gauge'
   | 'distribution', name, value, unit?, attributes, environment,
   release }` with post-redaction payload.
3. Sentry mode: at least one counter and one distribution visible in
   Sentry under the branch release tag (owner-verified, informational
   not merge-gate).
4. **Metric-names catalog conformance** (2026-04-18 reshape, per
   sentry-reviewer TO-ACTION): fixture-capture metric names are
   validated against the `@oaknational/observability-events`
   metric-names catalog (Phase 2 deliverable) via the conformance
   helper; unlisted names fail RED.

**Cross-references** (per ADR-162 event-schema contract; consistent
with other lane-body cross-reference blocks):

- [`observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)
  — metric-names catalog. `Sentry.metrics.*` metric names emitted by
  this adapter (e.g. `oak.mcp.handler.request.count`,
  `oak.mcp.tool.duration_ms`) are part of the downstream-analytics
  schema contract per ADR-162 and are catalogued alongside event
  schemas. L-4b publishes the adapter; the events workspace
  catalogues the names the adapter emits.

### L-9 Feedback pipeline

**Status**: 🔵 **DEFERRED to public beta** (2026-04-20). Feedback
pipeline requires a user-facing collection surface that does not yet
exist in alpha. Reopen when an alpha/beta user feedback path is
defined. Body below preserved for continuity; not executed this
branch.

**Objective**. `captureFeedback` wired end-to-end, plus an MCP tool
`submit-feedback` with a **fixed, closed-set input schema**. Privacy
is a primary concern: the feedback pipeline MUST NOT accept free-text
fields in this lane.

**Design non-negotiables** (settled 2026-04-17 with owner):

- Input schema is a Zod enum over a fixed set of values, e.g.
  `z.object({ rating: z.enum(['good', 'bad', 'neutral']), reason: z.enum([<closed set of reason codes>]).optional() })`.
- No free-text `message` field. No user-supplied strings.
- Any future extension to free-text feedback is a separate, explicit
  scope change with a privacy review — not this lane.
- Redaction barrier still applies (defence in depth); a future
  schema change cannot accidentally leak PII through the feedback
  surface.

**RED**: Unit/integration tests for:

1. A `captureFeedback({ rating, reason?, user? })` function on
   `HttpObservability` — fixture-mode capture asserts the payload
   shape matches the enum schema.
2. The `submit-feedback` MCP tool registration — asserts the Zod
   input schema rejects free-text and accepts only the enum values.
3. A property-style test: any string value that is not in the enum
   is rejected at the tool boundary.

**GREEN**: Add `captureFeedback` to the adapter and app-layer
observability with the typed schema (no `string` message parameter).
Register the `submit-feedback` MCP tool via the SDK registry.
Integrate with the redaction barrier at the normal seam.

**REFACTOR**: TSDoc making the closed-set constraint and the privacy
rationale load-bearing in the public API. README and runbook entry
describing how to query feedback and the fixed schema.

**Acceptance**:

1. Fixture capture asserts exact enum values.
2. Zod rejection tests prove the schema refuses free-text.
3. Live Sentry UI shows at least one submitted feedback item under
   the branch release tag, with rating + reason visible, no free
   text (owner-verified).

**Cross-references** (per ADR-162 event-schema contract):

- [`observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)
  — the `feedback_submitted` event is in the MVP event set owned by
  the events workspace. L-9's closed-set Zod enum inputs map directly
  to the schema defined there; any enum evolution is a coordinated
  change across both plans.

---

## Phase 4 — Cross-axis

### L-12 Widget Sentry

**Status**: 🔵 **DEFERRED to public beta** (2026-04-20). The widget
runtime surface is an agentic client (ChatGPT, Claude Desktop, etc.),
not a standard browser. Sentry instrumentation behaviour inside
those hosts is unverified and would need probing before committing
to an integration shape. Reopen when host-compatibility evidence is
available. Body below preserved for continuity; not executed this
branch.

**Objective**. Instrument the MCP App browser widget with
`@sentry/browser` (or `@sentry/react` after bundle-size review).

**Depends on L-12-prereq**: widget imports `@oaknational/telemetry-redaction-core` for the shared redaction policy. Widget bundle does NOT import `@oaknational/sentry-node`.

**Test boundary declaration** (A.2 item 11, per test-reviewer): `test:widget` runs in `jsdom`. If `@sentry/browser` init requires browser globals (`window`, `document`, `performance`), the integration test uses `jsdom`; if it does not, the fixture-equivalent browser adapter is used directly without a DOM. E2E is NOT the home for this test — E2E is stdio-only per `testing-strategy.md`, and widget Sentry init is an in-process collaboration test. Do not push the test to E2E without a written rationale.

**Process**:

1. Bundle-size measurement with both packages on a throwaway branch.
2. Select based on measurement + React-tree complexity.
3. Share DSN / environment / release / traces-propagation-target
   configuration with the server so traces link end-to-end.
4. Redaction: widget-side `beforeSend` composes `@oaknational/telemetry-redaction-core` with a browser-side payload adapter (no server-only fields). Align doctrine with ADR-143 + ADR-160.

**RED**: Integration tests under `test:widget` assert the widget
constructs a Sentry client with the expected options and that the shared redaction policy is applied to the widget's `beforeSend` payload. Extend L-0b's closure-property invariant — browser-side `beforeSend` + `beforeSendTransaction` are new fan-out paths under ADR-160's closure; they MUST appear in the widget's conformance test (mirror of the Node-side L-0b).

**GREEN**: Implement. Thread config from the HTML resource's served
content or a widget-bootstrap endpoint (DI per ADR-078).

**REFACTOR**: TSDoc, widget README, observability.md (widget section).

**Acceptance**: browser error reproduction produces a linked trace in
Sentry (owner-verified); bundle size delta documented; widget closure-property tests mirror L-0b coverage on the browser side.

**Cross-references** (per ADR-162 five-axis principle +
vendor-independence clause):

- [`accessibility-observability.plan.md`](../current/accessibility-observability.plan.md)
  — widget is the primary runtime surface for the accessibility-axis
  signal set (preference-media-query tags, frustration proxies,
  incomplete-flow correlation, keyboard-only session detection).
  L-12 provides the Sentry transport; the accessibility plan
  authors the events and schemas the widget emits.
- [`multi-sink-vendor-independence-conformance.plan.md`](../current/multi-sink-vendor-independence-conformance.plan.md)
  — the widget is the **second emitting workspace** under ADR-162's
  vendor-independence clause (the MCP server being the first). The
  conformance plan lists the widget as a consuming workspace; L-12
  must compose the shared conformance helper (not bypass it) so
  widget-side emissions are proven to persist via stdout/err under
  `SENTRY_MODE=off`.

### Sibling `current/` plans in Phase 4

- [`security-observability.plan.md`](../current/security-observability.plan.md)
  — emits `auth_failure` and `rate_limit_triggered` events using Phase
  2 schemas. Security axis MVP.
- [`accessibility-observability.plan.md`](../current/accessibility-observability.plan.md)
  — emits `a11y_preference_tag`, frustration proxies, incomplete-flow
  correlation, and `widget_session_outcome` from the widget runtime.
  Accessibility axis MVP.

Can parallelise within Phase 4. Wave-close semantics per the high-level
observability plan: maximisation plan owner signals Phase 4 closure
after L-12 GREEN + both sibling plans GREEN + reviewer matrix
discharged.

---

## Phase 5 — Operations + Conformance + Close-out

### L-13 Alerts + dashboards + runbooks

**Status**: 🔵 **DEFERRED to public beta** (2026-04-20). Alerts +
dashboards require real signal distributions from L-1/L-3/L-4b to
design thresholds meaningfully; picking thresholds before seeing
alpha noise/signal is premature optimisation that produces alert
fatigue. Reopen when L-1/L-3/L-4b have accumulated enough alpha
traffic to observe real distributions. Body below preserved for
continuity; not executed this branch.

**Objective**. Per product loop, define baseline alert + dashboard
panel + runbook entry + routing + escalation.

**Deliverables**:

- Alerts: unhandled-exception rate, ANR rate, Zod-error spike, MCP
  tool failure spike, latency regression (P95), crash-free-session
  rate below threshold, event-loop-delay P99 saturation,
  heap-used-bytes anomaly.
- Dashboards: HTTP MCP health, MCP App widget health (post-L-12),
  release regression indicator.
- Runbook: each alert has a triage flowchart, ownership, and
  escalation path in `docs/operations/production-debugging-runbook.md`.

**Acceptance**: alerts configured via `sentry api` with evidence;
dashboards snapshot captured; runbook entries present.

**Cross-references** (per ADR-162 five-axis principle — alerts cover
every axis, not only engineering):

- [`security-observability.plan.md`](../current/security-observability.plan.md)
  — security-axis alerts (auth-failure spike, rate-limit-triggered
  anomaly) derive from events the security-observability plan
  emits. L-13 authors the alert rules; the security plan authors
  the underlying events + thresholds.
- [`accessibility-observability.plan.md`](../current/accessibility-observability.plan.md)
  — accessibility-axis alerts (frustration-proxy spike,
  incomplete-flow anomaly, keyboard-only session failure) derive
  from widget-side events the accessibility plan emits. L-13
  authors the alert rules; the accessibility plan authors the
  underlying events + thresholds.

### L-14 Third-party trace propagation (security-gated)

**Status**: 🔵 **DEFERRED to public beta** (2026-04-20). Security-
gated trace propagation to non-Oak hosts requires a deliberate
policy decision that should not be rushed pre-alpha. Reopen when
the trust-boundary policy owner is identified and an explicit
decision surface (ADR) is ready. Latent security-axis emission
obligation in
[`security-observability.plan.md`](../current/security-observability.plan.md)
continues regardless. Body below preserved for continuity.

**Objective**. Decide allow/deny for non-Oak host propagation,
including the Oak API from the MCP server boundary.

**Process**:

1. Enumerate current outbound HTTP callees (Oak API, Clerk, Elastic).
2. For each, record: data sensitivity, cross-org trust boundary,
   existing propagation config.
3. Security-reviewer pass.
4. Decision recorded in an ADR amendment or a note in the runbook.

**Acceptance**: decision documented per host with reviewer
attribution.

### L-15 Strategy close-out

**Objective**. Record the Sentry-only vs dual-export vs
minimal-operational decision.

**Process**: compare the three options against observed operational
value from Phases 1–4. Record decision as an ADR.

**Acceptance**: ADR merged; the parent plan's strategy-close-out
obligation is discharged.

### L-DOC (final) — DISSOLVED 2026-04-20

**Status**: 🔴 **DISSOLVED**. Docs are now definition-of-done on
every lane, not a separate phase. Batching documentation to a final
phase creates a drift window during Phases 3 and 4 where code lands
with only initial docs — a violation of the repo's no-drift
discipline that the rest of the observability lane is authored
against.

**Distributed obligations** (now carried per-lane REFACTOR):

- **Per-loop TSDoc on the owning function** — owned by each lane
  that introduces the loop.
- **ADR index entries** — updated in the lane that authors or
  amends the ADR.
- **Propagation to operational runbooks** (`sentry-deployment-
  runbook.md`, `sentry-cli-usage.md`,
  `production-debugging-runbook.md`,
  `environment-variables.md`) — per-lane for the specific signals
  that lane emits.
- **`packages/libs/sentry-node/README.md`** — expanded per-lane as
  each lane adds to the adapter contract; no single final sweep.
- **`apps/oak-curriculum-mcp-streamable-http/docs/observability.md`**
  — expanded per-lane as each lane lands a server-side wiring
  change.
- **`.agent/directives/AGENT.md § Essential Links`** — updated in
  the lane that establishes the link target.
- **`docs-adr-reviewer` close review** — runs at every lane close,
  not once at the end.
- **`documentation-sync-log.md`** — entry per lane, not per phase.

**Acceptance**: each lane's close criteria include the items above
that apply to it. No lane closes with unmatched docs.

### L-EH (final) — Error-handling discipline

**Objective**. Land the opt-in `prefer-result-pattern` rule scoped
incrementally per workspace, and apply Phase-5 corrections across all
new/changed code.

**RED**: Unit tests for `prefer-result-pattern` flagging functions
whose signature could return `Result<T, E>` but rely on thrown
exceptions.

**GREEN**: Author rule; include in a `strict-result` opt-in config.
Apply to `packages/libs/sentry-node/`,
`packages/core/observability/`, and the MCP app's `src/observability/`
as the first adoption tranche.

**REFACTOR**: Update `.agent/rules/use-result-pattern.md` and
`docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md`
with the new enforcement.

**Acceptance**: rule landed; first adoption tranche lint-clean.

### L-4a Transitional span metrics convention (MVP-deferred)

**Priority** (2026-04-18 — restructure Phase 4 swap). L-4a is the
**transitional** metric surface, adopted only for narrow
span-attribution-unique cases where a metric must share the enclosing
span's trace context inline. The primary metric surface is L-4b
(`Sentry.metrics.*`, Phase 3). L-4a opens only after L-4b's adapter
is stable — see §Phase 1 dependency graph (`L-4b → L-4a`).

**Objective**. Publish `oak.<runtime>.<feature>.<metric>` as the
convention for the narrow set of metric-shaped signals that belong on
existing spans (cases where the metric's value is indivisible from
its span's trace context, e.g. span-tagged tool-execution duration).
Most metric emissions go through L-4b; L-4a documents the exception.

**RED**: Unit tests asserting that a `recordSpanMetric(span, name,
value, attributes?)` helper in `@oaknational/observability` writes the
attribute under the published naming scheme and narrow attribute types.

**GREEN**: Author the helper. Document the convention in the package
README.

**REFACTOR**: Instrument acceptance tracers:

- `oak.mcp.handler.request.count` incremented at handler start.
- `oak.mcp.tool.duration_ms` on the active tool-execution span.

**Acceptance**: tests verify attributes on spans; manual Sentry
explore-query confirms the attributes are present.

### L-5 Dynamic sampling (MVP-deferred)

**Objective**. Replace fixed `tracesSampleRate` with a `tracesSampler`
function.

**Policy**:

- Errored transactions: 100%.
- Transactions whose root-span duration exceeds the rolling P95
  threshold: 100% (approximate via static threshold initially,
  revisit).
- Cold-boot + auth-proxy transactions: elevated rate (e.g. 50%).
- Default happy-path: configurable sampling rate (default 10%).

**RED**: Unit tests over a pure `decideSampleRate(samplingContext,
env)` function.

**GREEN**: Wire into `createSentryInitOptions`.

**REFACTOR**: TSDoc, README update, runbook entry.

**Acceptance**: tests green; documentation reflects the policy.

### L-6 Profiling (MVP-deferred)

**Objective**. Add `@sentry/profiling-node`, wire
`nodeProfilingIntegration`, measure overhead.

**API shape — v10** (A.2 item 7, per sentry-reviewer): `@sentry/profiling-node` v10 uses `profileSessionSampleRate` + `profileLifecycle: 'trace' | 'manual'`, NOT the legacy `profilesSampleRate` / `profilesSampler` / `SENTRY_PROFILES_SAMPLE_RATE` env names from v9. Env variable surface: `SENTRY_PROFILE_SESSION_SAMPLE_RATE` and `SENTRY_PROFILE_LIFECYCLE` (confirm exact names against the live `@sentry/profiling-node` v10 docs at lane-open time — do not pin from plan prose).

**RED — behaviour-first** (A.2 item 9 tightening):

- A profile envelope is emitted under a representative harness (`prod:harness` or a new micro-bench) when `profileSessionSampleRate > 0` and `profileLifecycle = 'trace'` — assertion is over the envelope content, not over `NodeOptions.integrations.some(...)` presence.
- A transaction produced while a profile is active carries the profile linkage in its event data (fixture capture asserts `profile_id` or equivalent linkage attribute on the captured transaction).
- `profileLifecycle: 'manual'` mode does not emit a profile envelope unless explicitly started — off-behaviour check.

**GREEN**: Install `@sentry/profiling-node` (opt-in `onlyBuiltDependencies` entry — precompiled binaries ship for Node 18/20/22/24 on Linux/macOS/Windows per A.1 factual correction 3). Thread `profileSessionSampleRate` + `profileLifecycle` through `InitialiseSentryOptions` via DI (ADR-078); expose as env-resolvable but do not read `process.env` in library code.

**REFACTOR**: Measure overhead on the harness. Document rollout (env-gated initially; revisit continuous after measurement) in `docs/operations/sentry-deployment-runbook.md` and `packages/libs/sentry-node/README.md`.

**Acceptance**: profile envelope emitted under the harness; profile linked to a transaction visible in Sentry UI (owner-verified); overhead documented in the runbook; env names match v10 API.

### L-10 Feature-flag scaffolding — TSDoc extension point only (MVP-deferred)

**Objective** (settled 2026-04-17 with owner). Document the
future-provider extension point without wiring
`featureFlagsIntegration()` or exposing any helper on the adapter
barrel. No provider is selected yet, and pre-committing a shape
before a real consumer risks locking in a wrong API.

**Scope**:

- TSDoc on the adapter's public surface describing where a flag
  context helper will attach when a provider is chosen. Name the
  Sentry integration (`featureFlagsIntegration` or `growthbookIntegration`)
  as candidates.
- No code change to `createSentryInitOptions`.
- No new exports from `@oaknational/sentry-node`.
- A README section in `packages/libs/sentry-node/README.md`:
  "Feature-flag context — future extension".

**RED**: Docs structural test asserting the TSDoc block exists on the
agreed extension anchor (e.g. a dedicated comment block at the top
of `runtime-sdk.ts`). This is not a behaviour test; it is an
integrity test for the documentation contract — acknowledged
explicitly per test-reviewer's finding.

**GREEN**: Author the TSDoc + README section.

**REFACTOR**: Cross-link from `observability.md` (app doc).

**Acceptance**: TSDoc and README section in place; no runtime
behaviour change. The first real feature-flag provider's integration
is a separate future lane.

### L-11 AI-instrumentation scaffolding — TSDoc extension point only (MVP-deferred)

**Objective** (settled 2026-04-17 with owner). Document the future-LLM
extension point without exporting wrappers from the adapter barrel.
No Oak MCP tool currently calls an LLM; pre-committing the public
surface shape before a real consumer risks a breaking change when
the first LLM tool arrives.

**Scope**:

- TSDoc on the adapter's public surface describing where LLM
  instrumentation will attach. Name the Sentry-shipped integrations
  (`instrumentAnthropicAiClient`, `instrumentOpenAiClient`,
  `instrumentGoogleGenAIClient`, `vercelAIIntegration`,
  `anthropicAIIntegration`, `langChainIntegration`,
  `langGraphIntegration`) as candidates.
- No re-exports from `@oaknational/sentry-node`.
- No new helpers on `HttpObservability`.
- A README section in `packages/libs/sentry-node/README.md`:
  "LLM instrumentation — future extension".

**RED**: Docs structural test asserting the TSDoc block exists on the
agreed extension anchor.

**GREEN**: Author the TSDoc + README section.

**REFACTOR**: Cross-link from `observability.md` (app doc); note the
Vercel AI SDK version-range caveat from the sentry-reviewer (v4 vs
v5 semantics diverged) so a future author reaches for the right
integration.

**Acceptance**: TSDoc and README section in place; no runtime
behaviour change. The first real LLM tool's integration is a
separate future lane, triggered by an actual consumer landing.

### L-8 Bundler-side source maps + release/deploy linkage (UN-DROPPED 2026-04-20 — forward lane)

**Status**. 🟠 LANDED-WITH-CORRECTION-PENDING. WS1 (RED), WS2 (GREEN),
and WS3.1 (ADR-163 §6/§7 amendment) landed atomically in commit
`f9d5b0d2` (2026-04-21). The Vercel preview acceptance probe (deployment
`dpl_8LJxuArqh68w4pon9MbfnriD5rre` on `feat/otel_sentry_enhancements`
@ `ff91cd1c`) ran the new `esbuild.config.ts` composition root
correctly but exited 1 with
`[esbuild.config] Sentry build-plugin intent error: { kind: 'missing_app_version' }`.
Two distinct errors surfaced — see [L-8 Correction (2026-04-21) —
Version source-of-truth and fail-policy](#l-8-correction-2026-04-21--version-source-of-truth-and-fail-policy)
at the end of this lane for the corrected design and remaining work.
Original lane intent (release/commits/deploy/source-map linkage,
supersession of L-7 bespoke orchestrator) is unchanged.

**Scope**. Switch the MCP app's build tool from `tsup` to **raw
esbuild** and register `@sentry/esbuild-plugin` directly. Delete the
~900-line L-7 bespoke orchestrator and all its scaffolding
(`build:vercel` script, `vercel.json.buildCommand` override,
`@sentry/cli` devDependency, ESLint/tsconfig exceptions,
`upload-sourcemaps.sh`). Amend ADR-163 §6 from HOW (`sentry-cli`
invocations) to WHAT (Sentry UI outcome).

**Why the tool swap is load-bearing** (not a preference): the
`@sentry/esbuild-plugin` has documented integration breakage with
`tsup` at runtime. Two independent defects:

1. Stub module resolution fails — the plugin references
   `_sentry-release-injection-stub` and `_sentry-debug-id-injection-stub`
   as bare specifiers; tsup's esbuild wrapper treats them as npm
   packages and the build errors with `ERR_MODULE_NOT_FOUND` (Sentry
   issue 614, closed 2025-08-08 *"not planned — no one blocked"*; the
   `noExternal` workaround fixes this single symptom only).
2. Source-map upload silently uploads nothing — the plugin's `onEnd`
   hook fires before tsup writes files to disk, so the plugin's glob
   for `.map` files returns `[]` (Sentry issue 608; tsup issue 1260,
   open since 2024-12). No known workaround within tsup. The Dec 2024
   reporter resolved by switching build tools.

The raw esbuild path avoids both defects by removing the tsup wrapper
that introduces them. Only the MCP app switches; every other workspace
stays on tsup (libs, SDKs, other app).

**Rationale** (2026-04-20). `@sentry/esbuild-plugin` is the vendor's
first-party bundler plugin for esbuild builds and the canonical path
per current Sentry documentation
(`platforms/javascript/guides/node/sourcemaps/uploading/esbuild.md`).
Wiring it directly replaces the L-7 bespoke orchestrator (953 lines
across 5 files plus build-config overrides, ESLint exception, and an
ADR HOW-prescription) with a small plugin registration inside a raw
esbuild config.

The prior `PARKED` rationale (2026-04-17) — "shell-script flow is
simpler, offline-capable, auditable" — was sunk-cost framing the
commit `4bccba71` guardrails are designed to catch. Specifically:

- "Already working and proven on this branch" was not yet true on
  2026-04-17 (the bespoke orchestrator had not landed).
- "Offline-capable without `SENTRY_AUTH_TOKEN`" is not a requirement
  the plugin fails to meet; `SENTRY_AUTH_TOKEN` is already required
  for any release-registration path.
- "Auditable because we own the script" protects the shape chosen,
  not the outcome Sentry must reach.

The prior "land the plugin inside tsup" framing (2026-04-20 morning,
in the now-deleted standalone plan at commit `4cbc8843`) was a
separate sunk-cost: it protected the existing tsup config from
change despite the known runtime-breakage evidence above. That
framing has been sanitised in commit `363037af`. The standing
decision is raw esbuild for this app.

#### L-8 L-7 Current State (2026-04-20)

The L-7 bespoke orchestrator landed across three commits
(`7f3b17e9` + `6f5acd17` + `ecee9801`) and carries:

- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy.ts` (157 lines)
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy-cli.ts` (153 lines)
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy-preflight.ts` (201 lines)
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy-types.ts` (41 lines)
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy.integration.test.ts` (401 lines, 22 test cases)

Total: **953 lines across 5 files**, plus:

- `apps/oak-curriculum-mcp-streamable-http/package.json` —
  `build:vercel` script invoking
  `tsx build-scripts/sentry-release-and-deploy-cli.ts`
- `apps/oak-curriculum-mcp-streamable-http/vercel.json` —
  `buildCommand` override pointing at `build:vercel`
- `apps/oak-curriculum-mcp-streamable-http/eslint.config.ts` (~line
  137) — `process.env` allowance for the CLI entry point
- `@sentry/cli` as a devDependency (3.3.5)
- `@sentry/node` SDK already present (required version: ≥ 7.47.0 for
  source-map support per Sentry docs)
- `apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`
  — legacy shell-script fallback
- ADR-163 §6 — six-step `sentry-cli` invocation prose

**Retained capabilities**: `resolveSentryEnvironment` and
`resolveSentryRegistrationPolicy` in `packages/libs/sentry-node/src/`
— pure vendor-agnostic policy functions encoding Oak's Vercel
env-pair truth table (ADR-163 §3). Reused by the new esbuild config
at build-config-load time. Unchanged by this lane.

#### L-8 Design Principles

1. **Vendor plugin owns the Sentry lifecycle** — release registration,
   commit attribution, source-map upload with Debug IDs, deploy
   events. No Oak code reimplements any of these.
2. **Local code owns policy, not mechanism** —
   `resolveSentryEnvironment` and `resolveSentryRegistrationPolicy`
   remain because they encode Oak's Vercel env-pair truth table
   (ADR-163 §3). They are pure functions with no `@sentry/*` imports.
3. **Raw esbuild for this app; tsup everywhere else** — the swap is
   scoped to the MCP app because `@sentry/esbuild-plugin` + tsup is
   runtime-broken. No other workspace is affected.
4. **Delete aggressively, preserve nothing of the bespoke shape** —
   no compatibility layer, no shell-script fallback, no parallel
   path. Per `principles.md`: "replace old approaches with new
   approaches, never create compatibility layers".
5. **ADRs state WHAT, not HOW** — WS3 rewrites ADR-163 §6 to state
   the Sentry UI state Sentry must reach and lets the plugin config
   live in code and in this plan body.

**Non-Goals** (YAGNI):

- **Do NOT migrate any other workspace off tsup.** Only the MCP app
  needs `@sentry/esbuild-plugin`. Libs, SDKs, and the search CLI
  stay on tsup.
- **Do NOT preserve `@sentry/cli` as a devDependency anywhere in the
  workspace.** The plugin is the sole mechanism. WS2.4 clears the
  MCP app's `@sentry/cli` entry and also the dormant copy in
  `apps/oak-search-cli/` (no consumer; present only because it was
  pre-wired alongside the MCP app's bespoke orchestrator).
- **Do NOT retain `upload-sourcemaps.sh` as a fallback.** Delete.
- **Do NOT defer the ADR-163 §6 rewrite.** The HOW-vs-WHAT
  calcification IS the lesson installed by `4bccba71`; leaving the
  bespoke CLI sequence documented as authoritative re-enables the
  calcification this lane exists to resolve.

#### L-8 Build-vs-Buy Attestation (REQUIRED before ExitPlanMode)

**Vendor**: Sentry.

**First-party integrations surveyed**:

| Integration shipped by vendor | Evaluated? | Adopted / ruled out + reason |
|---|---|---|
| `@sentry/esbuild-plugin` wired into **raw esbuild** | yes | **ADOPTED.** Canonical first-party bundler plugin per current Sentry docs (`platforms/javascript/guides/node/sourcemaps/uploading/esbuild.md`). Covers release registration, commit attribution, source-map upload with Debug IDs, and deploy-event emission as a single unit. |
| `@sentry/esbuild-plugin` wired **inside tsup** | yes | **RULED OUT on runtime-compatibility grounds.** Two documented defects: (i) Sentry issue 614 — stub specifiers fail to resolve through tsup's esbuild wrapper; (ii) Sentry issue 608 / tsup issue 1260 — plugin `onEnd` fires before tsup writes files, so source-map upload silently uploads nothing. Neither has a known in-tsup fix; the Sentry issue was closed "not planned" in 2025-08-08 for lack of a blocked user willing to PR a major-version-breaking fix. Verified 2026-04-20 against the `@sentry/esbuild-plugin` CHANGELOG up through 5.2.0: neither defect has a dedicated fix entry across the 3.x, 4.x, or 5.x majors. Defect reports remain the current public state; no re-test against 5.x is attested here because the raw-esbuild path is the minimum-change route that avoids the wrapper layer where the defects arise. |
| `@sentry/wizard` (`npx @sentry/wizard -i sourcemaps`) | yes | **N/A — setup-time tool, not a runtime mechanism.** The wizard generates plugin config interactively for first-time integrators; the runtime mechanism under review is what the generated config produces, which is already assessed in the esbuild-plugin rows above. |
| Sentry official `getsentry/action-release` GitHub Action | yes | **RULED OUT on deploy-surface grounds.** Oak's deploy surface is Vercel Build Command, not GitHub Actions. Adopting a GitHub Action path would multiply deploy surfaces for no gain. If Oak ever moves deploys to GitHub Actions (independent decision), this integration would be re-evaluated. |
| `@sentry/webpack-plugin` | yes | N/A — the MCP app does not use webpack. |
| `@sentry/vite-plugin` | yes | N/A — the MCP app does not use Vite. |
| `@sentry/rollup-plugin` via unbuild | yes | **RULED OUT.** Would require adopting a new build tool (unbuild) with no Oak precedent. Raw esbuild is more proportional: same underlying tool tsup wraps, direct plugin support, zero new tooling. |
| `@sentry/cli` invoked from a bespoke orchestrator | yes | **RULED OUT on solution-class grounds.** `@sentry/cli` invoked from a bespoke orchestrator replicates behaviours the first-party bundler plugin ships. Bespoke orchestration only justifies itself when the vendor offers no first-party mechanism; `@sentry/esbuild-plugin` is that mechanism. The 953 lines already written are a cost-to-delete, not a reason to retain — per commit `4bccba71` guardrails sunk cost is explicitly not a valid retention reason. |
| Sentry-hosted release finalizer API | yes | N/A. The plugin handles finalization via `release.finalize: true`. |
| Sentry GitHub App for commit attribution | yes | **RULED OUT for this lane.** Oak's commit attribution already runs through semantic-release + Vercel env pairs (ADR-163 §3 truth table). The plugin reads `VERCEL_GIT_COMMIT_SHA` directly via `release.setCommits.commit`; no GitHub App wiring needed. |

**Bespoke wrapper retention**: NONE. The bespoke orchestrator is
deleted in WS2. The only local code that remains is
`resolveSentryEnvironment` and `resolveSentryRegistrationPolicy`,
which are vendor-agnostic policy functions — not a wrapper around
Sentry behaviour.

**Reviewer**: `assumptions-reviewer` MUST run against this attestation
pre-ExitPlanMode. Documentation check: Sentry canonical-idiom
already confirmed via `mcp__sentry-ooc-mcp__search_docs` +
`get_doc` + direct inspection of
`sentry-javascript-bundler-plugins/packages/bundler-plugin-core/src/types.ts`.
`sentry-reviewer` MAY be invoked for a second-pass verification if
solution-class doubt returns.

#### L-8 Reviewer Scheduling (phase-aligned)

**Plan-phase (PRE-ExitPlanMode)** — challenges solution-class. Before
WS1 begins:

- **`assumptions-reviewer`** — challenge the Build-vs-Buy Attestation
  rows (are any "RULED OUT" reasons sunk-cost rather than concrete?
  Any vendor integrations not named?). Challenge scope proportionality
  (is raw esbuild the right blast radius, or should more workspaces
  migrate?). Expected finding: attestation holds; scope is right.
- **`sentry-reviewer`** (optional, second-pass) — verify the
  esbuild-plugin config shape (release, setCommits, deploy, sourcemaps)
  matches the canonical types in the plugin repo and that no fields
  are missing for Oak's required outcomes.

**Mid-cycle (DURING execution)** — challenges solution-execution:

- **`test-reviewer`** — after WS1 RED; challenge whether tests assert
  product behaviour (build output carries Debug IDs; plugin logs
  release-registration + upload + deploy) rather than asserting
  plugin internals.
- **`type-reviewer`** — after WS2 esbuild config lands; challenge any
  type widening at the plugin config boundary (must use
  `@sentry/esbuild-plugin` and `esbuild` vendor types; no `as
  unknown` escapes).
- **`architecture-reviewer-fred`** — after WS2 file deletions;
  challenge boundary discipline around `@oaknational/sentry-node`
  now that the policy functions are the sole remaining Oak
  contribution to the release/deploy surface.
- **`code-reviewer`** — gateway after WS2; triggers the
  friction-ratchet counter if 3+ independent friction signals
  accumulate against the esbuild-native shape. If friction accrues,
  escalate to `assumptions-reviewer` for a solution-class re-review
  — do not tactical-patch.

**Close (POST-execution)** — verifies coherence:

- **`docs-adr-reviewer`** — verify ADR-163 §6 rewrite states WHAT
  not HOW; verify runbook + `observability.md` +
  `sentry-cli-usage.md` (archived) are internally consistent with
  the landed esbuild config.
- **`release-readiness-reviewer`** — GO / GO-WITH-CONDITIONS / NO-GO
  before merge, with evidence that a Vercel preview deployment
  produced the expected Sentry UI state (release registered,
  commits attached, deploy event).

#### L-8 WS0 — Plan-Time Review (PRE-ExitPlanMode)

Dispatch `assumptions-reviewer` against this §L-8 body. Record
findings in an L-8 WS0 Findings sub-section. Amend this section in
response to findings before proceeding to WS1.

**Block type**: WS0 is a **process block**, not a technical
dependency. WS1's tests would compile and run without it; the block
exists to ensure solution-class challenge lands at the cheapest
phase per `.agent/sub-agents/templates/assumptions-reviewer.md`.

**Acceptance Criteria**:

1. `assumptions-reviewer` returns without rejecting the solution-class
   or returns a refined shape that this section adopts.
2. Build-vs-Buy Attestation rows are all concrete (no sunk-cost
   reasoning, no undefined "X unavailable" hand-waves).
3. Scope is proportional (raw esbuild for this app only; no creep
   into other workspaces beyond the orphaned search-CLI `@sentry/cli`
   cleanup in WS2.4).

**WS0 Findings** (2026-04-20, dispatched against an earlier draft of
this §L-8 body):

`assumptions-reviewer` returned **ACCEPT WITH NOTES**. Four Important
findings + three nits were all applied to this plan body before
commit:

- (a) Attestation completeness — added rows for `@sentry/wizard`
  (N/A: setup-time tool) and `getsentry/action-release` (RULED OUT:
  Vercel-vs-GitHub-Actions deploy surface).
- (b) 2.x vs 5.x currency — added a sentence to the
  `@sentry/esbuild-plugin` + `tsup` ruling-out row explicitly
  noting that verification against the plugin CHANGELOG up through
  5.2.0 shows no fix for either defect, and that the raw-esbuild
  path is the minimum-change route avoiding the wrapper layer.
- (c) Dormant `@sentry/cli` in `apps/oak-search-cli/` — added WS2.4
  to clear the orphaned devDep + `.sentryclirc` from the search
  CLI alongside the MCP-app cleanup. Non-goal rewritten to reflect
  workspace-wide `@sentry/cli` removal (was: MCP-app only).
- (d) ADR-first ordering foreclosure — WS3.1 now explicitly forbids
  landing before WS2 as well as after WS2, locking the
  same-commit/same-PR atomicity.
- (nit) WS1.2 equivalence-test invariant list now names `format`
  (esm), `target` (es2022), and `platform` (node).
- (nit) `sourcemap: 'hidden'` deliberate divergence from tsup's
  `sourcemap: true` acknowledged in WS1.2.
- (nit) WS0 itself re-labelled as process block rather than
  technical dependency.

Sunk-cost phrase scan returned zero matches. Proportionality:
in-bounds. Blocking-chain: process-level only, acknowledged.

#### L-8 WS1 — Test Specification (RED)

All tests MUST FAIL at the end of WS1. See
[TDD Phases component](../../templates/components/tdd-phases.md).

**1.1: Build-output integration tests**

- `apps/oak-curriculum-mcp-streamable-http/build-scripts/plugin-build-output.integration.test.ts`
  — asserts that `pnpm build` (now backed by raw esbuild) with
  `SENTRY_AUTH_TOKEN=<fake>` and the Vercel env-pair inputs (per
  ADR-163 §3) produces dist bundles that carry Debug IDs (scannable
  in the bundle) and source-map files written to disk; asserts that
  the plugin's release-registration + sourcemap-upload +
  deploy-event emission are invoked (log scrape) during build.
- `packages/libs/sentry-node/src/policy-invocation.integration.test.ts`
  — asserts that `resolveSentryEnvironment` and
  `resolveSentryRegistrationPolicy` are invoked exactly once per
  build and that their outputs are passed to the plugin config.

**1.2: Verify tsup → esbuild build equivalence (no behaviour regression)**

- `apps/oak-curriculum-mcp-streamable-http/build-scripts/build-output-equivalence.integration.test.ts`
  — asserts the post-swap dist bundle entry shape matches the
  pre-swap tsup output for known-stable invariants: entry-point
  filenames, external-package boundary (only `node_modules/*` are
  external), top-level exports surface, source-map presence and
  linkage, module format (`esm`), compile target (`es2022`),
  platform (`node`). Not a byte-for-byte diff; a contract-surface
  diff. Test is a guard against the esbuild config accidentally
  changing the runtime shape of the deployed app.
  Note: `sourceMappingURL` comment presence is deliberately NOT
  part of the equivalence contract. Esbuild's `sourcemap: 'hidden'`
  emits `.map` files without the URL comment, per Sentry's
  recommended hidden-source-map posture (the plugin uploads the
  map server-side; runtime consumers don't need the URL comment).
  This is a deliberate divergence from tsup's `sourcemap: true`,
  not a regression.

**Acceptance Criteria**:

1. Tests compile and run.
2. All new tests fail for the expected reason (no esbuild config yet;
   no plugin wired yet).
3. No existing tests broken.

#### L-8 WS2 — Implementation (GREEN)

All tests MUST PASS at the end of WS2.

**2.1: Create raw esbuild config for the MCP app**

**File**: `apps/oak-curriculum-mcp-streamable-http/esbuild.config.mjs`
(or `.ts` — decide at implementation time based on whether the
config itself benefits from type-checking).

**Content**:

- `entryPoints: ['src/index.ts', 'src/application.ts']`
- `bundle: true`, `platform: 'node'`, `format: 'esm'`,
  `target: 'es2022'`
- `sourcemap: 'hidden'` (per Sentry docs recommendation; plugin
  uploads and plugin-specified `filesToDeleteAfterUpload` handles
  retention)
- `external: [/node_modules/*/]` (match the MCP app's current tsup
  boundary exactly)
- `outdir: 'dist'`
- `plugins: [sentryEsbuildPlugin({...})]` (Sentry plugin last in the
  array per Sentry docs)
- `sentryEsbuildPlugin` config derived from
  `resolveSentryEnvironment(process.env)` +
  `resolveSentryRegistrationPolicy(process.env)` at
  config-construction time. Include: `org`, `project`, `authToken`,
  `release: { name, finalize: true, setCommits: { auto: false,
  commit, repo }, deploy: { env } }`, `sourcemaps: {
  filesToDeleteAfterUpload: ['dist/**/*.js.map'] }`, `telemetry:
  false`.

> **SUPERSEDED (2026-04-21)** by [L-8 Correction (2026-04-21) —
> Version source-of-truth and fail-policy](#l-8-correction-2026-04-21--version-source-of-truth-and-fail-policy).
> The `release.name` resolver shipped in `f9d5b0d2` reads from a
> different boundary than the build-time validation script, producing
> the `missing_app_version` failure on Vercel preview. The single-
> source-of-truth strategy and per-environment derivation rules are
> stated in the correction subsection. Treat the bullet above as a
> shape sketch only; the resolver contract MUST follow the correction.

**Pre-edit verification**: read `resolveSentryEnvironment` and
`resolveSentryRegistrationPolicy` return types in
`packages/libs/sentry-node/src/`. Cross-check field names against
plugin input keys (`release.name`, `release.setCommits.commit`,
`release.setCommits.repo`, `release.deploy.env`,
`policy.shouldRegister`). If the policy functions use different
names, rename the policy-function fields (vendor-neutral) rather
than renaming at the plugin call site.

**Minimum plugin version**: pin `@sentry/esbuild-plugin` at an
explicit version compatible with the workspace's `@sentry/node` SDK
(≥ 7.47.0 per Sentry docs). Record the pinned version in
`package.json` and cite it in the runbook (WS3.2).

**2.2: Update `package.json` build script and dependencies**

- Replace `"build"` script from `tsup` invocation to
  `node esbuild.config.mjs` (or equivalent).
- Delete `"build:vercel"` script.
- Add `@sentry/esbuild-plugin` devDependency (pinned version).
- Delete `@sentry/cli` devDependency.
- Delete `tsx` devDependency if no other consumer remains in the
  MCP app.
- Delete `tsup` from the MCP app's devDependencies if no other
  script references it (check for lingering `tsup.config.ts` usage
  first). Other workspaces keep their own `tsup` pin.

**2.4: Clear dormant `@sentry/cli` from the search CLI**

Files amended:

- `apps/oak-search-cli/package.json` — delete `@sentry/cli` devDep
  (dormant; no consumer in this package).
- `apps/oak-search-cli/.sentryclirc` — delete.

Rationale: the non-goal above scopes L-8 to the MCP app, but the
`@sentry/cli` devDep in the search CLI is an orphaned artefact from
when the same CLI tool was pre-wired alongside the MCP app's bespoke
orchestrator. Leaving it after L-8 lands violates the
"delete aggressively, preserve nothing of the bespoke shape"
principle. No other workspace changes.

**2.3: Delete the tsup config for this app and the L-7 bespoke
orchestrator + wiring**

Files deleted:

- `apps/oak-curriculum-mcp-streamable-http/tsup.config.ts` (replaced
  by esbuild.config.mjs)
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy.ts`
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy-cli.ts`
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy-preflight.ts`
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy-types.ts`
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy.integration.test.ts`
- `apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`

Files amended:

- `apps/oak-curriculum-mcp-streamable-http/vercel.json` — remove
  `buildCommand` override. Vercel falls back to the workspace's
  `build` script (now esbuild).
- `apps/oak-curriculum-mcp-streamable-http/eslint.config.ts` —
  remove the `build-scripts/sentry-release-and-deploy-cli.ts`
  exception block (line numbers drift — check fresh before edit).
- `apps/oak-curriculum-mcp-streamable-http/tsconfig.build.json` —
  adjust if tsup-specific options become irrelevant under esbuild
  (verify; may be no-op).

**Deterministic Validation**:

```bash
rg -n "sentry-release-and-deploy|build:vercel|@sentry/cli|upload-sourcemaps\.sh" \
  apps/oak-curriculum-mcp-streamable-http/
# Expected: 0 matches.
ls apps/oak-curriculum-mcp-streamable-http/build-scripts/
# Expected: only vercel-ignore-production-non-release-build.mjs + .d.ts remain.
SENTRY_AUTH_TOKEN=fake VERCEL_ENV=preview VERCEL_GIT_COMMIT_SHA=abc123 \
  VERCEL_GIT_REPO_SLUG=test pnpm --filter \
  @oaknational/oak-curriculum-mcp-streamable-http run build
# Expected: build exits 0; dist contains .js + .js.map files;
# plugin logs confirm release-registration + upload + deploy-event emission.
```

#### L-8 WS3 — Documentation and Polish (REFACTOR)

**3.1: Amend ADR-163 §6 to state outcome, not HOW** (atomic with WS2).

Replace §6's six-step `sentry-cli` invocation prescription with an
outcome statement: *"For each successful production or preview
build, the Sentry UI MUST reflect (a) a release keyed by the root
package.json semver, (b) the build commit attached to that release,
(c) a deploy event recorded under the appropriate environment. The
mechanism is the vendor's first-party bundler plugin
(`@sentry/esbuild-plugin`) registered in
`apps/oak-curriculum-mcp-streamable-http/esbuild.config.mjs`."*

Add a History entry recording the 2026-04-20 plugin migration and
the supersession of the bespoke-CLI prose.

**ATOMIC COMMIT REQUIREMENT**: WS2 (plugin wiring + bespoke deletion)
and WS3.1 (ADR amendment) MUST land in the same commit or at
minimum the same PR. Intermediate state where the ADR still asserts
the deleted CLI path is a documentation-vs-code drift the lane
exists to prevent.

**WS3.1 MUST NOT land before WS2 either** — an ADR claiming an
outcome the code does not yet deliver is the inverse drift.
Same-commit or same-PR is the only correct order.

**3.2: Update operational docs**

- `docs/operations/sentry-deployment-runbook.md` — replace bespoke
  orchestrator references with plugin-based guidance; troubleshooting
  steps reference plugin logs. Record pinned
  `@sentry/esbuild-plugin` version.
- `docs/operations/sentry-cli-usage.md` — delete or archive; the
  CLI is no longer an operational surface.
- `apps/oak-curriculum-mcp-streamable-http/docs/observability.md` —
  update the release-attribution section to reference the plugin.
- `packages/libs/sentry-node/README.md` — note that
  `resolveSentryEnvironment` and `resolveSentryRegistrationPolicy`
  are consumed by the app's esbuild config at build time.

**3.3: Update this plan's L-7 section**

- L-7's status `completed` note updated to: *"migrated to plugin via
  §L-8 (landed YYYY-MM-DD, commit <sha>)"*.
- L-7 body section supersession note pointing at the landed L-8
  commit.

**3.4: TSDoc**

- Update `@remarks` on `resolveSentryEnvironment` and
  `resolveSentryRegistrationPolicy` to name the esbuild config as
  the sole consumer at build time.

#### L-8 WS4 — Quality Gates

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e && pnpm smoke:dev:stub
```

**Additional release-state verification** (not a gate, but a
blocker for WS5's `release-readiness-reviewer`): push branch to
GitHub; Vercel preview deployment completes green; Sentry UI shows
the preview-env release registered with commits attached and a
deploy event.

#### L-8 WS5 — Adversarial Review

Invoke reviewers per the Reviewer Scheduling section above. Record
findings inline in this section. Any BLOCKER finding halts the
lane; FIX-BEFORE-MERGE findings land inside the same PR.

#### L-8 WS6 — Documentation Propagation

- ADR-163 (amended in WS3.1; History entry)
- ADR index (update §Observability entry)
- `docs/operations/sentry-deployment-runbook.md`
- `docs/operations/sentry-cli-usage.md` (archive or delete)
- `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`
- `packages/libs/sentry-node/README.md`
- `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
  L-7 + L-8 status + section bodies (this file)
- `.agent/plans/observability/documentation-sync-log.md`

#### L-8 Risk Assessment

| Risk | Mitigation |
|---|---|
| Raw esbuild config misses a tsup-provided behaviour the MCP app relied on (e.g. entry-point convention, external resolution, specific target flag) | WS1.2 "build-output equivalence" contract-surface test catches regression before WS2 lands. If a gap is found, name the specific tsup option and its esbuild equivalent in the plan before proceeding. |
| `@sentry/esbuild-plugin` version upgrade later breaks the build | Pin plugin version explicitly in `package.json`; document the upgrade path in the runbook; rely on the existing gate chain to catch upgrade regressions. |
| Vercel preview deployment fails on first build after `vercel.json.buildCommand` removed | Preview failures are cheap; a fresh branch re-run with the override restored is one commit. Production is gated by `vercel-ignore-production-non-release-build.mjs` + the version-bump invariant. |
| Sentry UI does not show a distinct deploy event, only release metadata | Per `@sentry/esbuild-plugin` types (`DeployOptions`), setting `release.deploy.env` is the canonical path; if UI shows only metadata, the WS5 `release-readiness-reviewer` flags it and we escalate to `sentry-reviewer` for canonical-idiom re-check. |
| ADR-163 §6 rewrite is perceived as rewriting history | History entry records the 2026-04-20 supersession and the reason (HOW-vs-WHAT calcification lesson from `4bccba71`). Prior §6 prose stays as a versioned History entry in the ADR itself. |
| Other workspaces break because they shared a tsup config surface the MCP app relied on | Not applicable — `tsup.config.base.ts` is untouched; the MCP app's `tsup.config.ts` deletion removes a call site, not the shared base. Other workspaces continue to consume the base unchanged. |

#### L-8 Dependencies

**Blocking**:

- L-7 bespoke orchestrator landed (DONE: `7f3b17e9` + `6f5acd17` +
  `ecee9801`). The migration deletes it; it must exist to be deleted.
- OAC Phase 2 scaffolding landed (DONE: `ffcad2aa`). This lane is
  authored against the decomposed state surfaces.

**Environment**:

- Vercel project settings already expose `SENTRY_AUTH_TOKEN` to the
  build step (carried over from L-7, which also required it). No
  env-var provisioning work expected.
- Vercel build environment exposes `VERCEL_ENV`,
  `VERCEL_GIT_COMMIT_SHA`, `VERCEL_GIT_REPO_SLUG` at build time (L-7
  already relied on these in a separate `tsx` stage; now required at
  esbuild config-load time). WS1 acceptance criterion includes a
  preview-push probe confirming all three are populated at the new
  stage before WS2 wiring lands.

#### L-8 Foundation Alignment

Before WS1 and at each phase boundary:

1. Re-read `.agent/directives/principles.md` — "no compatibility
   layers"; "version with git, not with names"; "fix the boundary,
   not duplicate across it".
2. Re-read `.agent/directives/testing-strategy.md` — tests prove
   product behaviour (build output shape and plugin invocation
   evidence), not plugin internals.
3. Re-read `.agent/directives/schema-first-execution.md` — plugin
   config is schema-adjacent; use vendor types from
   `@sentry/esbuild-plugin` and `esbuild`; no widening.
4. Re-ask the First Question: could this be simpler without
   compromising quality?

#### L-8 Self-Test of Installed Guardrails

This lane is the deliberate self-test of the six metacognition
lessons installed in commit `4bccba71` plus the owner-beats-plan
invariant installed in commit `363037af`:

- **Build-vs-Buy Attestation** (above) — concrete survey with
  runtime evidence for the tsup+plugin ruling-out (Sentry issues
  608/614; tsup issue 1260). No sunk-cost phrasing.
- **Reviewer Scheduling** (above) — plan-time reviewers scheduled
  BEFORE ExitPlanMode. `assumptions-reviewer` is WS0, blocking
  execution start.
- **Friction-ratchet counter** — if 3+ friction signals accumulate
  against the esbuild-native shape during execution,
  `code-reviewer` escalates to `assumptions-reviewer` rather than a
  tactical fix.
- **Sunk-cost phrase detector** — the tsup-retention framing of
  the prior standalone plan (2026-04-20 morning) was itself
  sunk-cost reasoning; this lane's scope statement names it
  explicitly as such to close the loop.
- **ADRs state WHAT, not HOW** — WS3.1 rewrites ADR-163 §6 from
  HOW to WHAT. Audit via `docs-adr-reviewer` close review.
- **Solution-class challenge at dispatch frame** — WS0 framing
  asks "should the esbuild-native shape exist?" not "is the
  esbuild config well-structured?". If reviewers answer the
  latter instead, that IS phase-misalignment.
- **Owner-beats-plan invariant** — the non-goals above were
  written from the owner's standing esbuild decision, not from
  inherited plan text. Any future session that reads this plan
  and finds its non-goals contradicting a newer owner directive
  MUST resolve in favour of the owner.

A graduation signal for the guardrails: if this lane lands without
re-activating the tsup-vs-esbuild debate, the owner-beats-plan
invariant is working as designed.

#### L-8 Correction (2026-04-21) — Version source-of-truth and fail-policy

**Status**. 🟡 WI 1-5 LANDED IN `fb047f86`, and later 2026-04-23 work
verified the deploy contract, landed the dedicated `dist/server.js`
boundary locally, and repaired the MCP HTTP app onto the DI-friendly
test/doctrine path. The remaining repo-owned work is now governed by
[`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md):
that repo-owned corrective lane is now archived complete; owner-run
validation proceeds separately before ADR-163 is amended with any
further validation doctrine. Broader
runtime simplification moved to
[`mcp-http-runtime-canonicalisation.plan.md`](../future/mcp-http-runtime-canonicalisation.plan.md).

##### Local landing record (2026-04-23, commit `fb047f86`)

WI 1-5 implementation summary:

- **WI-1** Canonical `resolveBuildTimeRelease` authored in new
  workspace package `@oaknational/build-metadata`
  (`packages/core/build-metadata/`). Pure function; production =
  root `package.json` `version`; preview = `preview-<branch-slug>-<short-sha>`;
  development = short SHA. Exhaustive vitest unit coverage
  (44/44 green) of every context row + `SENTRY_RELEASE_OVERRIDE`
  precedence rule + every `BuildTimeReleaseError.kind` discriminant.
  Internal helpers extracted to `build-time-release-internals.ts`
  to clear the `max-lines: 250` rule; shared types extracted to
  `build-time-release-types.ts` to break a circular dependency
  surfaced by the depcruise pre-commit gate.
- **WI-2** `buildBuildInfo` + `serialiseBuildInfo` helpers added
  to `@oaknational/build-metadata`; `dist/build-info.json` is now
  the canonical persisted build identity, written exactly once
  per build by the composition root.
- **WI-3** `createSentryBuildPlugin` refactored to consume the
  canonical resolver and to return a typed `SentryBuildPluginIntent`
  union (`disabled | skipped | configured`), eliminating the
  second boundary read. New `skipped` variant carries the
  `auth_token_missing` kind; unit-test rewrite covers both
  fail-policy halves and the typed intent shape.
- **WI-4** `apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`
  refactored to switch on `intent.value.kind`: `disabled` →
  log + omit plugin + continue; `skipped` → log skip-reason +
  omit plugin + continue (vendor-config-missing posture);
  `configured` → register the plugin + write `dist/build-info.json`
  - continue. Three-branch dry build (disabled, skipped,
  configured) verified green locally.
- **WI-5** (corrected scope) `&& node ../../scripts/validate-root-application-version.mjs`
  removed from the MCP HTTP `build` script only; the script
  itself and its call from `apps/oak-search-cli/`'s build script
  are left untouched. Search CLI stays on tsup with the pre-flight
  pending its own esbuild migration. Three deferred follow-ons
  captured in §Deferred follow-on (search-cli → esbuild + canonical
  resolver; converge remaining deployable workspaces; delete the
  `validate-root-application-version.mjs` script when no
  consumer remains).

Quality gates at landing: `pnpm` filter-run lint + type-check +
test for the touched workspaces all green (build-metadata 44/44,
MCP HTTP 646/646 unit + 3-branch dry build, sentry-node 101/101,
search-cli build sanity); root `prettier --check`, `depcruise`,
and `markdownlint` pre-commit gates green at commit time. Both
patterns named in the L-8 Correction §Pattern signal were
actively countered during execution: WI-3 + WI-4 implemented
`SentryBuildPluginIntent` as a discriminated union (not a
fail-fast `Result.error` propagation) so the fail-policy split
is structurally enforced (countering
`passive-guidance-loses-to-artefact-gravity`); WI-5's mid-flight
owner-correction (over-broad first read deleted the script
outright; reverted to MCP-HTTP-only scope) was caught before
landing (countering `inherited-framing-without-first-principles-check`
on the deletion-shape). Same-commit `fb047f86` also folded
session-scoped continuity work (entry-point sweep landing
`AGENTS.md` + `CLAUDE.md` to pure pointers per
`session-handoff` §6d, new `ephemeral-to-permanent-homing`
shared partial, `tsdoc-and-documentation-hygiene` rule renamed
to `documentation-hygiene` across canonical + Cursor + Claude
adapters with restructured body, distilled-memory pref additions,
and three workspace-local doc edits homing the AGENTS.md/CLAUDE.md
content per the homing partial).

**Build-log root cause**:

```text
Validated application version: 1.5.0
[esbuild.config] Sentry build-plugin intent error: { kind: 'missing_app_version' }
ELIFECYCLE  Command failed with exit code 1.
```

The composition root executed correctly (the new `esbuild.config.ts`
ran, the `validate-root-application-version.mjs` pre-flight resolved
`1.5.0` from disk), but `createSentryBuildPlugin`'s release-name
resolver read from a different boundary and reported
`missing_app_version`, which `esbuild.config.ts` then treated as
fatal.

##### Error 1 — Version resolution drifted from the documented strategy

The lane was authored against an existing strategy stated in the L-7
prose (root `package.json` is the single source of truth for release
versions; `vercel-ignore-production-non-release-build.mjs` cancels
production builds whose version has not advanced). WS2 implementation
in `f9d5b0d2` did not preserve that single-source-of-truth boundary:
the validation script reads version from disk (`require('./package.json').version`),
the Sentry release-name resolver reads version from a process-env
field (`npm_package_version` or similar) that Vercel does not populate
at build time. The two boundary reads disagreed; the build failed.

This is a **planning + implementation drift** — the strategy was
explicit in the L-7 narrative but was not carried forward as a
hardened contract into L-8 WS2.

##### Error 2 — Fail-policy was inverted

`createSentryBuildPlugin` returned a `Result.error({ kind: 'missing_app_version' })`,
and `esbuild.config.ts` exited 1. This treats a load-bearing identity
failure (we do not know the release name) as a build-fatal error,
which is correct in spirit but the **opposite policy** was applied to
optional vendor configuration: the lane's standing decision (per
`threads/observability-sentry-otel.next-session.md` and the `[esbuild.config]` log-line table)
was that a missing `SENTRY_AUTH_TOKEN` should *skip* plugin
registration so that non-release contexts (local dev, fork preview
without secrets) can still build. The `f9d5b0d2` implementation
does not yet implement that skip-on-vendor-missing path; it gates
solely on `policy.shouldRegister` from `resolveSentryRegistrationPolicy`,
which is upstream of the auth-token check.

The two errors compound: with the vendor-missing path also halting
the build, every preview build without a Vercel-provisioned
`SENTRY_AUTH_TOKEN` would fail too, even on commits where release
attribution is not required.

##### Corrected version-resolution strategy (single source of truth)

Release-name derivation MUST follow this contract, with the rule
selected by `VERCEL_ENV` (or its local equivalent), and the resolved
value persisted to a build-output file so that the plugin and any
runtime SDK initialisation read the same string:

| Context (`VERCEL_ENV` or local) | Source of truth | Rule |
|---|---|---|
| `production` | Root `package.json` `version` | Read by `validate-root-application-version.mjs` once at the start of the build; Vercel `ignoreCommand` already guarantees production builds run only on `semantic-release` version-bump commits to `main`, so the version in `package.json` is the canonical released semver. |
| `preview` | Branch name | Derive a version-shaped string from `VERCEL_GIT_COMMIT_REF` (e.g. `preview-<branch-slug>-<short-sha>`). The root `package.json` version is stale on preview branches and MUST NOT be used. |
| `development` (local or `vercel dev`) | Short git SHA | `git rev-parse --short HEAD` (or `VERCEL_GIT_COMMIT_SHA` truncated to 7 chars). Do not read root `package.json` — it is stale outside the bump-commit moment. |

Implementation requirements (binding):

1. **Single resolver, single boundary read**. One function in
   `packages/libs/sentry-node/` (or a new `release-identity` module)
   takes the build context (env vars, branch, sha) as inputs and
   returns the resolved release name. No other consumer reads the
   raw boundary directly.
2. **Persist once, consume many**. The resolved release name MUST be
   written to a build-output file (e.g. `dist/build-info.json`) so
   that runtime Sentry SDK initialisation, future tag emission, and
   any post-build verification all read the same string the plugin
   used. The current dual-boundary read (validation script + plugin
   resolver) is the bug; persisting the canonical resolution to disk
   is the structural fix, not a per-consumer patch.
3. **Validation script convergence**. The existing
   `validate-root-application-version.mjs` invocation either becomes
   the canonical resolver call (preferred — one entry point) OR
   becomes a thin wrapper that delegates to it. Two scripts that
   independently parse `package.json` is the failure mode this lane
   is correcting.
4. **No env-var-based version inputs in the resolver's contract for
   `production`**. Reading `npm_package_version` or any pnpm-injected
   env var is the bug; `production` reads from disk via the
   pre-flight script's resolved value, not from `process.env`.

##### Corrected fail-policy (warn-vs-throw)

Two distinct categories of build-time observability configuration,
two distinct policies:

| Category | Examples | Missing-config policy |
|---|---|---|
| **Optional vendor configuration** — third-party service hookup that is nice-to-have for the build to participate in a remote system | `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`, source-map upload destination | **Warn and continue.** Log a single, structured `[esbuild.config]` line naming what is missing and what consequence follows (e.g. `Sentry plugin skipped: SENTRY_AUTH_TOKEN not provided — release will not be registered with Sentry`). Build succeeds. App boots and runs. |
| **Vital identity** — information without which the produced artefact cannot be correctly attributed, even at runtime | Resolved release name (per the strategy above), build environment (`production`/`preview`/`development`), commit SHA on production builds | **Throw with helpful error.** `esbuild.config.ts` exits non-zero. Error message names exactly what was missing, which boundary was read, and what the operator must do (e.g. *"Cannot resolve release name on production: root package.json version did not advance beyond last deployed version. Ensure semantic-release ran successfully before this build."*). |

The `Result<…, IntentError>` shape returned by
`createSentryBuildPlugin` is the right primitive but its consumer
(`esbuild.config.ts`) MUST branch on the error `kind`, not treat
all `IntentError` variants as build-fatal. The current `f9d5b0d2`
behaviour treats every `IntentError` as fatal; that is the policy
inversion.

##### Work items required to land the correction

1. **Author** the canonical release-name resolver per the strategy
   above (production = disk, preview = branch, dev = short sha).
   Single function, single boundary read per context. Pure,
   exhaustively tested with vitest unit tests covering each context
   row.
2. **Persist** the resolved release name to a build-output file
   (`dist/build-info.json` or equivalent). Document the file shape
   in TSDoc on the resolver and in `docs/operations/sentry-deployment-runbook.md`.
3. **Refactor** `createSentryBuildPlugin` to consume the persisted
   release name (or call the canonical resolver), eliminating the
   second boundary read.
4. **Refactor** `esbuild.config.ts` to branch on `IntentError.kind`:
   vendor-config-missing variants → log warn, omit plugin, continue
   the build; identity-missing variants → throw with the helpful
   message named above.
5. **Tighten** `validate-root-application-version.mjs` to either
   delegate to the canonical resolver or be deleted in favour of the
   resolver running at the same point in the build. Two scripts is
   the bug.
6. **Re-run** the Vercel preview acceptance probe per
   `threads/observability-sentry-otel.next-session.md` § Session shape. Expected log line on
   preview: `[esbuild.config] Sentry plugin enabled: release=preview-<branch-slug>-<short-sha> env=preview`.
   Expected log line on a fork preview without `SENTRY_AUTH_TOKEN`:
   `[esbuild.config] Sentry plugin skipped: SENTRY_AUTH_TOKEN not provided — release will not be registered with Sentry`.
7. **Verify** Sentry UI surfaces the preview release with branch-derived
   name + commits + deploy event.
8. **Amend** ADR-163 §6/§7 to record the version-resolution contract
   explicitly (currently the ADR states the *outcome* but not the
   *boundary discipline*; the omission is what allowed this drift).
   Same-commit-or-same-PR rule from WS3.1 still applies.

##### Risk-assessment additions (to be merged into the L-8 risk table)

| Risk | Mitigation |
|---|---|
| The canonical release-name resolver is added but a future contributor re-introduces a second boundary read (e.g. a test helper that re-parses `package.json`) | ESLint rule or dependency-cruiser check forbidding `package.json` reads outside the canonical resolver. Schedule under L-8 WS3 (REFACTOR) of the correction. |
| The persisted `dist/build-info.json` becomes stale during local dev (resolver runs at build-time, dev server runs after) | Resolver also runs at dev-server startup, writing to a known location consumed by runtime initialisation. Same single-boundary-read discipline. |
| The fail-policy branching introduces a code path where vendor-config-missing silently produces a release-unattributed artefact in production | Production builds enforce identity-missing → throw via the `VERCEL_ENV === 'production'` branch, which makes both `SENTRY_AUTH_TOKEN` AND release name vital. Only `preview` and `development` apply the warn-and-continue policy to vendor config. |

##### Pattern signal

Both errors are instances of patterns already named in the napkin:

- The drift between the L-7 prose strategy and the L-8 WS2
  implementation is a fresh instance of
  `inherited-framing-without-first-principles-check` — the lane
  inherited a resolver shape from `@oaknational/sentry-node` without
  re-checking that the shape actually implemented the documented
  single-source-of-truth boundary discipline.
- The fail-policy inversion is a fresh instance of
  `passive-guidance-loses-to-artefact-gravity` — the
  `threads/observability-sentry-otel.next-session.md` explicitly anticipated this exact failure
  mode (the `[esbuild.config] Sentry build-plugin intent error: …`
  line in the Session-shape table is named verbatim) but the
  guardrail was documented, not enforced. The build had to fail in
  Vercel before the policy was corrected.

Both pattern instances are eligible for napkin recording at the next
session-handoff. The lane closes the metacognitive loop by carrying
this correction subsection rather than amending the WS2 prose in
place — the full chain (original design → preview probe → corrected
design) stays visible for future reference.

##### Deferred follow-on (out of scope for this correction)

WI-5 was originally drafted to cover the MCP HTTP app only — that
is the workspace where the L-8 acceptance probe runs. During WI-5
execution (2026-04-23), an over-broad first read deleted
`scripts/validate-root-application-version.mjs` outright and
removed its call from `apps/oak-search-cli/`'s build script too.
The owner caught the over-reach: removing the pre-flight from
`oak-search-cli` *without* migrating it to esbuild + the canonical
resolver leaves search-cli with the very `missing_app_version`-style
drift this correction was designed to repair. Reverted both
deletions; `oak-search-cli` stays on tsup with the validate-script
pre-flight in place. Only the MCP HTTP build script's `&&` removal
landed.

The principled long-tail follow-on, owner-confirmed in the same
exchange:

1. **Migrate `apps/oak-search-cli/` to esbuild + the canonical
   `resolveBuildTimeRelease`**. Search CLI needs Sentry release
   registration for source-map-attributed error reports;
   registration requires the canonical resolver pattern in
   `esbuild.config.ts`; therefore search CLI needs esbuild. Once
   migrated, drop the `validate-root-application-version.mjs`
   call from its build script.
2. **Converge the rest of the deployable-artefact workspaces on
   esbuild + the canonical resolver**. The L-8 Correction's
   single-source-of-truth doctrine only fully realises once
   esbuild is the universal build pipeline; tsup is the legacy
   build wrapper. Survey + plan as a separate lane.
3. **Delete `scripts/validate-root-application-version.mjs`**
   when (1) and (2) are complete and no consumer remains. The
   script then has no callers and its validation contract is
   subsumed by the canonical resolver at every composition root.

These are not blocking for the L-8 acceptance probe and are not
graduated to a plan body yet; they sit here as the standing
register entry for the follow-on lane.

### Sibling `current/` plans in Phase 5

- [`multi-sink-vendor-independence-conformance.plan.md`](../current/multi-sink-vendor-independence-conformance.plan.md)
  WS2+ — emission-persistence test runs MCP server + widget + Search
  CLI in `SENTRY_MODE=off`, asserting structural event information
  persists via stdout/err. If the sibling lane still requires a
  severity-escalation step for `no-vendor-observability-import`, it
  closes that step here under the repo's no-warning doctrine rather
  than assuming a fixed `warn`-then-`error` sequence.
- [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
  — archived closure record for the bounded repo-owned corrective lane
  after the deploy-boundary repair. External monitor setup happens
  outside the repo.

---

## Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

**The criterion is always the same: `pnpm check` from the repo root,
with no filtering, green.** No per-gate invocation list replaces
this. Individual gates may be run one at a time while iterating to
narrow a failure, but the phase-boundary criterion — and the PR-merge
criterion — is `pnpm check` exit 0 with no filter.

```bash
# Phase-boundary criterion — ALL must be green:
pnpm check
```

No exceptions, no "pre-existing" dismissals, no filtered runs. If a
gate is failing, the phase does not close.

---

## Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

Per phase, invoke reviewers (non-leading prompts). Matrix:

| Execution phase | Reviewers |
|-----------------|-----------|
| **Phase 1 — Gates & Foundation Extractions** | code-reviewer (gateway), test-reviewer, type-reviewer, config-reviewer, docs-adr-reviewer, sentry-reviewer, architecture-reviewer-fred (L-12-prereq workspace extraction is structural; runs at GREEN close too), architecture-reviewer-barney (L-12-prereq boundary; workspace creation), **assumptions-reviewer** |
| **Phase 2 — Schema Foundation** | code-reviewer, docs-adr-reviewer (schema/contract completeness), type-reviewer (Zod 4 usage; io='input' vs 'output' semantics), sentry-reviewer (schema/emission fit), architecture-reviewer-fred (workspace boundary), **assumptions-reviewer**; the vendor-independence `no-vendor-observability-import` ESLint carve-out lands here — type-reviewer + architecture-reviewer-fred |
| **Phase 3 — Primary Emitters (Server)** | code-reviewer, test-reviewer, type-reviewer, sentry-reviewer, architecture-reviewer-betty, architecture-reviewer-wilma, security-reviewer (L-3 context shape), **docs-adr-reviewer** (L-4b / L-7-linked env-var edits — L-7 already landed in Phase 1), **assumptions-reviewer** |
| **Phase 4 — Cross-axis & Widget** | code-reviewer, test-reviewer, type-reviewer, sentry-reviewer, react-component-reviewer (L-12), accessibility-reviewer (L-12 + accessibility-observability plan), design-system-reviewer (L-12), security-reviewer (security-observability plan), **architecture-reviewer-fred + architecture-reviewer-barney** (2026-04-18 reshape per fred-review TO-ACTION: Phase 4 touches three concurrent architectural boundaries — browser bundle, auth middleware, widget runtime — all composing the Phase 1 telemetry-redaction-core through Phase 2 events-workspace schemas; Fred for ADR-162 vendor-independence-clause compliance + events-workspace import direction; Barney for cross-plan boundary cartography), **docs-adr-reviewer** (widget README, cross-axis plan READMEs), **assumptions-reviewer** |
| **Phase 5 — Operations + Conformance + Close-out** | code-reviewer, docs-adr-reviewer, sentry-reviewer, architecture-reviewer-fred, architecture-reviewer-wilma, security-reviewer (L-14 + vendor-independence emission-persistence test), release-readiness-reviewer, **assumptions-reviewer** |

Additions per A.6 register (pre-reshape) — still apply under reshape:

- `assumptions-reviewer` runs at **every** phase close, not only branch close (AR-11).
- `architecture-reviewer-fred` + `architecture-reviewer-barney` run at L-12-prereq GREEN close within Phase 1 (structural workspace extraction; AR-12).
- `type-reviewer` in Phase 1 covers L-0b follow-through (the `satisfies` gate and the `SentryRedactionHooks` type export from `runtime-sdk.ts`); same reviewer also runs Phase 3 for L-4b's hook-union extension (CR-7, AF-10).
- Reshape-specific additions:
  - `docs-adr-reviewer` runs at Phase 2 close (events-workspace schema completeness + vendor-independence ESLint-rule documentation health) AND at Phase 4 close (cross-axis plan READMEs and the widget observability doc).
  - `assumptions-reviewer` runs at the **reshape commit** itself (this plan revision) to verify proportionality of the lane migrations across phases.

Reviewer outputs feed back into the plan's todo list. Findings are
actioned unless explicitly rejected with written rationale (per
principles.md).

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

Covered in the strategic brief at
[future/sentry-observability-maximisation.plan.md § Risks and Unknowns](../future/sentry-observability-maximisation.plan.md#risks-and-unknowns).

Phase-specific risks:

| Execution Phase | Risk | Mitigation |
|-----------------|------|------------|
| 1 | L-0b `satisfies` gate does NOT auto-detect new fan-out hooks added to `NodeOptions` (e.g. a future `beforeSendMetric` wiring) — it only validates that BARRIER_HOOKS entries are valid `NodeOptions` keys | Resolved by A.6 SR-5: `runtime-sdk.ts` now exports `SentryRedactionHooks` (the `Pick<NodeOptions, ...>` return of `createSentryHooks`); the test imports it and constrains `MinimalHooks` to it. Any new hook wired in `createSentryHooks` without an update to the test's `BARRIER_HOOKS` registry now fails the type-check via a set-equality assertion between the imported type's keys and the registry. Code review remains the backstop. |
| 1 | **L-12-prereq extraction may accidentally couple the new `telemetry-redaction-core` workspace to Node-specific payload types** if the pure redactor functions' signatures leak `@sentry/node` generics | Run `architecture-reviewer-fred` + `architecture-reviewer-barney` at L-12-prereq GREEN close specifically on boundary and zero `@sentry/*` imports in the new workspace; a dedicated test asserts zero `@sentry/*` imports in `packages/core/telemetry-redaction-core/**`. |
| 1 | **L-7 scripts run in Vercel deploy pipeline only** (ADR-161); accidental CI PR-check invocation would reintroduce network calls to PR-check runs | Explicit pipeline-attachment documentation in deployment runbook; GitHub Actions workflows grep-audited for zero `sentry-cli` references at L-7 acceptance (already named in L-7's acceptance criterion 3). |
| 1 | **Two custom ESLint rules in quick succession** (`require-observability-emission` in Wave 1 / restructure Phase 5; `no-vendor-observability-import` in Wave 2) create authorship load | Accepted: upfront authorship cost buys compile-time-gated quality for all Phases 3–5. The older assumption that custom rules would stage at `warn` first is no longer generally safe on this branch: `require-observability-emission` is already `error` in the five scoped workspaces, and any future `no-vendor-observability-import` rollout must satisfy the repo's no-warning doctrine based on the real audit state of the sibling lane. L-EH initial's third authorship slot is reclaimed by ESLint built-in `preserve-caught-error` (added in 9.35.0), which supersedes the planned `require-error-cause` custom rule at a fraction of the authoring cost and with strictly-better coverage (adds destructured-parameter loss and variable shadowing). |
| 2 | **Events workspace schema drift between authoring (Phase 2) and first emission (Phase 3)** — if Phase 2 authors schemas from exploration 4 alone without a Phase 3 consumer in the loop, schemas may not match real emission shapes | Run `sentry-reviewer` + `docs-adr-reviewer` at Phase 2 close against the specific MVP event set; Phase 3 emitters import schemas by type, so any drift breaks type-check (compile-time gate). |
| 2 | **Vendor-independence carve-out** (`no-vendor-observability-import` ESLint rule authored in Phase 2, emission-persistence test authored in Phase 5) — the ESLint rule alone does not prove the stdout-sink property; a consumer could pass the import lint while still emitting only to a vendor | Accepted: the ESLint rule is a structural gate (prevents import leakage); the emission-persistence test in Phase 5 is the behavioural gate (proves the stdout-sink property). Both are required for ADR-162 Mechanism #4 + #5 satisfaction. Phase 5 is still pre-launch, not post-launch. |
| 3 | Integration composition changes default behaviour unexpectedly (L-1) | Behaviour-level fixture tests assert per-integration event emission (ANR / Zod / runtime-metric / etc.); SDK version pinned. Per A.2 item 9, RED is not config-shape presence on `NodeOptions`. |
| 3 | **Fixture runtime does not observe non-event envelopes** (ANR stack frames, streamed-span payloads, runtime-metric samples) without adapter extension — L-1 behaviour-level assertions cannot land against the current `createFixtureRuntime` (per A.6 AR-3) | L-1 GREEN has a prerequisite step named in §L-1 to route fixture-mode envelopes through `createSentryHooks` (Option A) OR add per-envelope capture paths (Option B). L-1 does not close until the prerequisite lands. Schedule impact: expect L-1 to take longer than a naive "turn on six integrations" estimate. |
| 3 | **Per-phase RED tightening fans test-author load across six L-1 integrations** (ANR / Zod / node-runtime / span-streaming / rewrite-frames / extraErrorData), each needing behaviour-level fixture capture rather than integration-registered presence — doubles or triples Phase 3 authorship versus the earlier config-presence posture (per A.6 AR-9) | Recognised: split L-1 into sub-lanes per integration if author-load becomes a bottleneck (L-1a / L-1b / ... ). Reviewer discipline at phase close remains fixed even under split. |
| 3 | **Sentry `metrics.*` API shifts during the beta window** (L-4b is the primary metric surface per the restructure Phase 4 swap; the beta API may introduce breaking-shape changes within the `^10.x` caret range `packages/libs/sentry-node/package.json` currently pins) | Adapter insulates consumers (consumers never import `Sentry.metrics.*` directly); conservative version-pin in `packages/libs/sentry-node`. **Concrete changelog-review trigger**: re-read the Sentry Node SDK `metrics.*` changelog at (a) every L-4b closure milestone, (b) the next monthly dependency-audit cadence, and (c) any `@sentry/node` minor-or-major bump inside the 10.x range (patch bumps within the current range can still ship shape changes under beta conventions), whichever fires first; raise any breaking-shape change as a new risk row immediately. Owner: L-4b implementer at each milestone review; dependency auditor at each bump. |
| 4 | Widget bundle size regression from adding `@sentry/browser` | Bundle-size test gate on widget build; L-12-prereq extracts browser-safe redactor core to avoid pulling `@sentry/node` transitively (L-12-prereq landed in Phase 1 under the reshape, so widget never risks transitively pulling `@sentry/node`). |
| 4 | **Cross-axis plan coordination** — security-observability + accessibility-observability + L-12 all emit to the events workspace concurrently | Phase 2 events-workspace schemas were authored with all three consumers in the loop; schemas are stable before any consumer imports them. Reviewer matrix includes `accessibility-reviewer` + `security-reviewer` at Phase 4 close. |
| 5 | `tracesSampler` regresses sampling coverage during rollout (L-5, MVP-deferred) | Roll out behind env flag with a fixed-rate fallback; measure first. |
| 5 | Profiling-node precompiled-binary install consent not granted in CI (L-6, MVP-deferred) | `onlyBuiltDependencies` entry; document in CI runbook. Per A.1 factual correction 3, precompiled binaries ship for Node 18/20/22/24 across Linux/macOS/Windows. |
| 5 | Alert fatigue (L-13) | Each alert has an SLO-style intent and dedupe before enablement. |
| 5 | **Emission-persistence test shape TBD** (vendor-independence conformance runs MCP server + widget + Search CLI in `SENTRY_MODE=off`; test scaffolding is non-trivial and exploration 8 deliberately left shape open) | Exploration 8 closure is a Phase 5 prerequisite; if the emission-persistence test shape cannot be resolved in time, Phase 5 close documents the gap as a launch caveat (never silently deferred per PDR-012). |

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

Per phase, propagate:

- ADRs for architectural decisions (L-0a/L-0b → ADR-160 acceptance; L-5, L-6, L-14, L-15).
- READMEs for every touched workspace.
- TSDoc on every new public surface.
- Runbook entries for alerts and operational procedures.
- `.agent/rules/` updates for error-handling (L-EH).

**Propagation targets added 2026-04-17** (A.2 item 13, per docs-adr-reviewer):

- `apps/oak-curriculum-mcp-streamable-http/docs/observability.md` — first-class app observability doc (L-DOC initial writes it; L-3 / L-4b / L-6 / L-9 / L-10 / L-11 / L-12 all update it throughout later phases).
- `packages/libs/sentry-node/README.md` — expanded from the 4-line stub to cover modes, redaction barrier (ADR-160), DI seam (ADR-078), fixture store, logger sink, shared delegates (L-DOC initial).
- `docs/operations/sentry-deployment-runbook.md` — release-commit linkage + deploy register (L-7); alert wiring + runbook entries (L-13).
- `docs/operations/sentry-cli-usage.md` — two new sibling script entries (L-7); L-8 parked rationale.
- `docs/operations/production-debugging-runbook.md` — per-loop triage flowcharts (L-13).
- `docs/operations/environment-variables.md` — `SENTRY_ENABLE_METRICS` (L-4b), sampling env (L-5), `SENTRY_PROFILE_SESSION_SAMPLE_RATE` + `SENTRY_PROFILE_LIFECYCLE` (L-6).
- `apps/oak-curriculum-mcp-streamable-http/README.md` — cross-link to `docs/observability.md` (L-DOC initial).
- `packages/core/observability/README.md` — span-metric naming convention (L-4a).
- `packages/core/telemetry-redaction-core/README.md` — runtime-neutral redactor contract (created by L-12-prereq; new package).
- ADR index — entries for ADR-160 (non-bypassable redaction barrier) and ADR-161 (network-free PR-check CI boundary); both Proposed → Accepted at Phase B close.
- ADR-088 amendment obligation — expanded enforcement via `prefer-result-pattern` rule (L-EH final).
- ADR-144 citation-style alignment ("three-zone fitness model") wherever "fitness zones" appears in plan text (A.1 factual correction 6).

**Cross-plan propagation — sibling MVP plans (added 2026-04-18 per restructure Phase 4)**:

> **Status note**. Every target below is a **`current/` (queued)**
> plan — not `active/`, not code. Workspaces named within them
> (`packages/core/observability-events/`,
> `packages/core/telemetry-redaction-core/`) **do not yet exist on
> disk**. Each sibling plan must be promoted to `active/` and executed
> for its workspace to materialise. Cross-references link planning
> authority, not current runtime state; readers who need runtime
> state should consult each sibling plan's frontmatter status.

Under ADR-162's five-axis principle, several lanes of this plan carry
obligations that are discharged in sibling `current/` plans. The
authoritative cross-references live in the lane bodies; listing
them here gives docs-adr-reviewer a single surface to audit:

- **L-0/L-0b/L-1/L-3 → [`observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)** — the downstream-analytics event-schema authority. L-0b's redaction barrier gates every schema-conformant emission; L-1's free-signal integrations emit events that the workspace will catalogue; L-3's `mcp_request` context is the correlation substrate for `tool_invoked`.
- **L-4b → [`observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)** — metric-names catalog. `Sentry.metrics.*` emissions are part of the downstream-analytics schema contract per ADR-162; metric names the adapter emits (e.g. `oak.mcp.handler.request.count`, `oak.mcp.tool.duration_ms`) are catalogued alongside event schemas.
- **L-7 → [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)** — deploy events registered by L-7 become operationally meaningful once the archived corrective lane has left the repo in an honest state for the owner-run validation stages.
- **L-7 → [`multi-sink-vendor-independence-conformance.plan.md`](../current/multi-sink-vendor-independence-conformance.plan.md)** — documents the release-linkage carve-out. Release linkage is Sentry-coupled by nature; the conformance plan's scope explicitly acknowledges this signal as one that need NOT survive `SENTRY_MODE=off`.
- **L-9 → [`observability-events-workspace.plan.md`](../current/observability-events-workspace.plan.md)** — `feedback_submitted` event schema. L-9's closed-set Zod enum maps directly to the schema defined there.
- **L-12 → [`accessibility-observability.plan.md`](../current/accessibility-observability.plan.md)** — widget-side a11y signal (preference tags, frustration proxies, incomplete-flow correlation, keyboard-only detection).
- **L-12 → [`multi-sink-vendor-independence-conformance.plan.md`](../current/multi-sink-vendor-independence-conformance.plan.md)** — widget is the **second emitting workspace** under the vendor-independence clause; the conformance plan lists it as a consuming workspace.
- **L-13 → [`security-observability.plan.md`](../current/security-observability.plan.md)** + **[`accessibility-observability.plan.md`](../current/accessibility-observability.plan.md)** — per-axis alert derivations. L-13 authors the Sentry alert rules; the sibling plans author the underlying events and thresholds for the security and accessibility axes.

**OWNER-ONLY** (PDR-003 protection):

- `.agent/directives/AGENT.md § Essential Links` — cross-link to the observability doc. This is a foundational Practice doc; **sub-agents MUST NOT edit**. Owner applies the edit directly; L-DOC drafts the target line in plan prose or a follow-up note for owner review.

---

## Consolidation

After Phase 5, run `/jc-consolidate-docs` to graduate settled content,
extract reusable patterns, rotate the napkin, manage fitness, and
update the practice exchange.

---

## Dependencies

**Blocking**: none. Foundation (`sentry-otel-integration.execution.plan.md`)
is validated. This plan is the next lane on the same branch.

**Related plans**:

- `../future/sentry-observability-maximisation.plan.md` — strategic
  parent.
- `sentry-otel-integration.execution.plan.md` — parent foundation
  authority.
- `sentry-observability-translation-crosswalk.plan.md` — will reference
  this plan as the authoritative successor to the archived
  `sentry-observability-expansion.plan.md`.
- `search-observability.plan.md` — sibling; owns ES-PROP and
  CLI-metrics; will gain a parallel maximisation plan when the Search
  CLI branch opens.

---

## Evidence and Claims

> See [Evidence and Claims component](../../templates/components/evidence-and-claims.md)

Claims in this plan are one of:

- **Observed** (verified in code today, with file:line reference).
- **Proposed** (target state, not yet implemented).
- **Deferred** (in scope but deliberately not in this plan).

---

## Appendix A — Reviewer Findings (2026-04-17)

Seven reviewers audited this plan before the fresh session opens:
`assumptions-reviewer`, `architecture-reviewer-barney`, `architecture-reviewer-betty`,
`architecture-reviewer-fred`, `sentry-reviewer`, `docs-adr-reviewer`,
`test-reviewer`. Findings are recorded here so nothing is lost between sessions.

### A.1 Factual Corrections Applied Before Session Close

These were factual errors or broken links and have been fixed in situ:

1. **Dangling references to the archived plan**. Updated in
   `.agent/prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md`
   (lines 27, 58), `active/sentry-observability-translation-crosswalk.plan.md`
   (`target_plans:` + body rows), `active/search-observability.plan.md` (notes and
   body), `active/sentry-otel-integration.execution.plan.md` (multiple references),
   `.agent/plans/high-level-plan.md` (line 76), and the active README + top-level
   README + roadmap + future README indices. Source: docs-adr-reviewer.
2. **ESLint package name clarified**. `@oaknational/eslint-plugin-standards` is
   the correct package name (`packages/core/oak-eslint/package.json:"name"`). The
   directory name `oak-eslint/` differs from the package name. Source:
   assumptions-reviewer raised the concern; package.json verified during
   close-out.
3. **`@sentry/profiling-node` native-binary framing**. Strategic-brief risk row
   will read "optional install-script consent" (via `onlyBuiltDependencies`)
   rather than "native binary build cost" when Phase 2 begins — precompiled
   binaries ship for Node 18/20/22/24 on Linux/macOS/Windows. Source:
   sentry-reviewer.
4. **L-1 `spanStreamingIntegration`/`withStreamedSpan` scope**. Must be treated as
   *additive* to `wrapMcpServerWithSentry` (which already patches
   transport `send`/`onmessage`), not as a replacement around
   `handleRequest`. Phase 1 RED will reflect this. Source: sentry-reviewer.
5. **L-1 "eight default runtime metrics" wording**. Must cite the live Sentry
   docs page or state "runtime metrics integration (default metric set per SDK
   version)" — the fixed count is not currently citation-grounded. Source:
   sentry-reviewer.
6. **ADR-144 citation style**. Instances of "fitness zones" will read
   "three-zone fitness model" for canonical label parity. Source:
   architecture-reviewer-fred.
7. **`wrapMcpServerWithSentry` `recordInputs`/`recordOutputs` note**. Both
   default to the value of `sendDefaultPii` (pinned `false` at Oak), so MCP
   tool inputs/outputs are not captured today. L-3 must cite this explicitly
   so the cascade is visible if `sendDefaultPii` ever flips. Source:
   sentry-reviewer.
8. **Sentry Metrics predecessor history**. L-4b must note that the current
   `Sentry.metrics.*` pipeline is a second-wave product after the 2024
   deprecation of the first-generation Sentry Metrics. Strengthens the
   dual-pattern framing (span metrics is the production path; dedicated
   metrics is the beta opt-in). Source: sentry-reviewer.
9. **Hook contract non-uniformity**. Plan language must acknowledge that
   `beforeSendSpan` cannot drop (no `| null` return), that `beforeSend` and
   `beforeSendTransaction` may be async (Promise-returning), and that
   `beforeSendLog` / `beforeSendMetric` are synchronous. Source:
   sentry-reviewer.
10. **`sentry-node/README.md` status**. Existing file is a 4-line stub.
    L-DOC initial slice should read "expand" not "write new". Source:
    docs-adr-reviewer.
11. **Strategic brief `parent_plan` wording**. The strategic brief is the
    parent of this executable plan but itself depends on the foundation plan.
    Phrasing to be adjusted to avoid the inversion appearance in frontmatter.
    Source: architecture-reviewer-fred.

### A.2 Structural Corrections for the Fresh Session

**Status (2026-04-17)**: APPLIED. All 15 items have been integrated into the plan body above. This list is retained for historical traceability of the reviewer finding → plan correction lineage. Items 1, 5, 14 were spot-checked as already reflected (ADR-160 exists as Proposed successor; L-7 sibling scripts in plan text; session prompt links ADR-143 / ADR-159 / sentry-node README / sentry-cli-usage.md). Item 13's AGENT.md cross-link is flagged owner-only (PDR-003).

These are plan-shape corrections to apply as part of Phase 1 setup in the
fresh session. They do not need owner approval — they are direct remediations
of reviewer findings consistent with the plan's own principles:

1. **Successor ADR, not in-place amendment of ADR-143 §6** (L-0). Per
   repo convention (ADRs 037, 044, 045, 064, 069, 091 precedents), write
   `docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md`
   that supersedes §6. Update ADR-143 status to "Superseded in part by
   ADR-160 (§6 only)". The amendment must keep a closure property
   ("every adapter fan-out hook is covered by the shared redactor") plus
   a test gate, not just a principle statement. Source:
   docs-adr-reviewer + architecture-reviewer-fred.
2. **Split L-0 into two lanes**. Separate the ground-truth doc correction
   from the ADR-160 authorship — they are different risk classes.
   Source: architecture-reviewer-barney.
3. **Split L-DOC and L-EH into phased pairs in the todos list** — they are
   effectively four lanes across Phase 1 and Phase 5. Source:
   architecture-reviewer-barney.
4. **L-3 `enrichMcpRequestContext` lives in the MCP app**, not in
   `@oaknational/sentry-node`. It is MCP-specific domain logic; keeping it
   in the shared library regresses ADR-154 framework/consumer separation.
   Source: architecture-reviewer-betty.
5. **L-7 sibling scripts, not fused script**. Release-lifecycle operations
   (`set-commits`, `deploys new`) get their own scripts
   (`sentry-release-set-commits.sh`, `sentry-deploy-register.sh`) alongside
   `upload-sourcemaps.sh`. Preserves the ADR-159 "one vendor invocation
   per script with its own preflight + post-condition" discipline. Script
   names are `sentry-`-prefixed to match the plan body at § L-7; early
   A.2 drafts used unprefixed names (`release-set-commits.sh` /
   `deploy-register.sh`) — the body is authoritative.
   Source: architecture-reviewer-fred.
6. **L-12 browser-safe redactor extraction**. Before L-12 opens, extract a
   pure redactor core into a browser-safe shared package (e.g.
   `@oaknational/telemetry-redaction-core`). `@oaknational/sentry-node` is
   Node-only (depends on `@sentry/node`); the widget cannot reach into it.
   Source: architecture-reviewer-fred + sentry-reviewer.
7. **L-4b profiling options API shape** (if the session touches profiling
   in the same window): use the v10 `profileSessionSampleRate` +
   `profileLifecycle: 'trace' | 'manual'` knobs, not legacy
   `profilesSampleRate`/`profilesSampler`. Source: sentry-reviewer.
8. **`createSentryDelegates` divergence for CLI**. When L-2 lands and the
   Search CLI branch adopts it, the CLI's `CliObservability` will silently
   ignore methods it does not expose (e.g. `setUser`). Plan the shared
   surface as an explicit superset with per-consumer opt-in, not
   implicit-superset-with-silent-discard. Source: architecture-reviewer-betty.
9. **Per-phase RED tightening**. Several RED phases (L-0, L-1, L-4b, L-6,
   L-7, L-DOC) were described as configuration-shape/presence assertions
   rather than product-behaviour specifications. Each RED must test
   behaviour: for L-1 the fixture capture of ANR/Zod/runtime-metric
   events is primary, not `NodeOptions.integrations.some(...)` presence;
   for L-4b the `beforeSendMetric` redaction needs a pure-function unit
   test separate from fixture-capture (the fixture proves the mock
   write path, not the redaction policy); for L-6 the test must prove
   that a profile envelope is emitted under a representative harness,
   not just that the integration is registered; for L-7 the test must
   prove that `releases set-commits --auto` and `releases deploys new`
   create the expected Sentry API state, not that the commands appear
   in a shell-script string; for L-0 no "docs test" — the ADR is
   authored and the successor ADR number is registered. Source:
   test-reviewer.
10. **L-EH edge-case coverage** (historical — superseded 2026-04-19).
    Originally required a custom `require-error-cause` RuleTester suite
    covering re-throw of the original binding, cause-mismatch against
    a different variable, nested `try/catch` scopes, `AggregateError`
    constructor shape, and async-wrapper catch patterns. Superseded by
    ESLint built-in `preserve-caught-error` (added in 9.35.0), which
    covers each of these cases by construction and additionally catches
    destructured-parameter loss and variable shadowing. The built-in's
    own test suite (ESLint core) is the proven behaviour; RED evidence
    in-tree is the audit count. Explicit pass-through uses the standard
    `// eslint-disable-next-line preserve-caught-error -- <reason>`
    comment, which composes with the existing
    `@oaknational/no-eslint-disable` governance (requires a reason).
    `prefer-result-pattern` (L-EH final) still needs a concrete
    heuristic spec and valid/invalid RuleTester cases. Source:
    test-reviewer (original); re-scoping rationale captured 2026-04-19.
11. **L-12 test-boundary**. Settle the widget Sentry test location before
    the RED is written: `test:widget` is in-process with `jsdom`; if
    `@sentry/browser` init requires browser globals, the integration
    test uses `jsdom`; if it does not, the test uses the fixture adapter
    directly without a DOM. Do not push the test to E2E without stating
    why. Source: test-reviewer.
12. **Cross-phase dependency graph made explicit**. The phase table hides
    the real dependencies (L-4b → L-0, L-13 → L-1/L-4a/L-4b/L-5/L-12,
    intra-Phase-1 L-1+L-2 order, L-DOC depends on L-2 landing first, etc.).
    Add a dependency graph at the top of Phase 1 RED. Source:
    architecture-reviewer-barney + assumptions-reviewer.
13. **Documentation propagation additions**. Add these to §Documentation
    Propagation (currently missing): `docs/operations/sentry-deployment-runbook.md`
    (L-7, L-13), `docs/operations/sentry-cli-usage.md` (L-7, L-8),
    `docs/operations/production-debugging-runbook.md` (L-13),
    `docs/operations/environment-variables.md` (L-4b, L-5, L-6),
    `apps/oak-curriculum-mcp-streamable-http/README.md` (cross-link to
    `docs/observability.md`), `packages/core/observability/README.md`
    (L-4a naming convention), ADR index entry for ADR-160 (L-0), and
    ADR-088 / ADR-144 amendment obligations. Source: docs-adr-reviewer.
    **OWNER-ONLY** (per [PDR-003](../../../../.agent/practice-core/decision-records/PDR-003-sub-agent-protection-of-foundational-practice-docs.md)):
    the `.agent/directives/AGENT.md § Essential Links` edit for the observability
    doc is a foundational Practice doc change. Sub-agents MUST NOT edit AGENT.md
    directly. The exact single-line diff is recorded verbatim in §A.6 "AGENT.md
    edit — exact text" so the owner can apply it at L-DOC-initial close without
    paraphrase drift.
14. **Session prompt pointers**. Add links to `ADR-143`, `ADR-159`, the
    existing `packages/libs/sentry-node/README.md` stub, and
    `docs/operations/sentry-cli-usage.md` to the session prompt's "Read
    First" list so an agent starting fresh does not have to discover
    them. Source: docs-adr-reviewer.
15. **Executable plan template derivation**. Name the template this plan
    derives from (feature-workstream) at the top of the file. Source:
    docs-adr-reviewer.

### A.3 Owner Decisions — RESOLVED (2026-04-17)

All 11 questions resolved with the owner before the fresh session opens.
Recorded verbatim so the fresh session inherits settled direction, not
re-openable framing.

1. **PR-size posture**. **All 17 lanes land in a single PR on this
   branch.** This work is "everything at once"; future MCP-app work
   will use smaller PRs, but not this foundational observability push.
2. **L-11 AI scaffolding**. **TSDoc extension-point only.** No
   re-exports from the adapter barrel. No new helpers on
   `HttpObservability`. A README section documents where LLM
   instrumentation will attach when the first Oak MCP tool calls an
   LLM. Plan text updated in §L-11 accordingly.
3. **L-10 feature-flag scaffolding**. **TSDoc extension-point
   only.** No `featureFlagsIntegration()` wired. No helper exported.
   README + TSDoc anchor documents the future-provider attachment
   point. Plan text updated in §L-10 accordingly.
4. **L-9 feedback**. **Ship a basic `submit-feedback` MCP tool with a
   closed-set Zod enum input — no free-text fields.** Privacy is a
   primary concern for this alpha. Enum values are `good | bad |
   neutral` with an optional `reason` enum over a fixed closed set.
   ADR-143 redaction barrier still applies. Plan text updated in §L-9
   accordingly.
5. **L-12 widget bundle-size budget**. **No budget.** Measure bundle
   size and performance impact; note findings in the lane evidence. A
   budget will be introduced later only if measurement surfaces a
   problem.
6. **L-5/L-6 rollback plan**. **Minimal.** The service is in private
   alpha with no SLA guarantees. Env-flag-off is the rollback
   mechanism; no additional kill-switch infrastructure. If a provider
   plan emerges post-alpha, rollback planning is revisited then.
7. **L-7 CI secret mapping**. **`SENTRY_AUTH_TOKEN` lives in the
   Vercel environment and is invoked from the Vercel deploy pipeline
   only, never from GitHub Actions PR / push checks.** PR checks stay
   network-free per `testing-strategy.md` (unit + integration tests
   only, no network IO). L-7 sibling scripts attach to Vercel
   predeploy/postdeploy hooks. Plan text updated in §L-7 accordingly.
8. **L-7 `--auto` vs `--commit <sha>`**. **Use explicit
   `--commit "oaknational/oak-open-curriculum-ecosystem@$GIT_SHA"`.**
   The Sentry GitHub integration **is installed** for the
   organisation (owner verified 2026-04-17) so `--auto` is available,
   but we use the explicit form for deterministic script behaviour
   independent of org-side integration state. Plan text updated in
   §L-7 accordingly.
9. **L-13 vs existing alert rule 521866**. **Ignore / delete 521866.**
   That rule was a smoke test of the alert wiring itself; it has
   served its purpose. L-13 builds the production alert suite from
   scratch against the product loops defined in Phases 1-3.
10. **L-8 bundler plugin adoption criterion**. **Parked as a future
    enhancement; not delivered in this plan.** Adopting
    `@sentry/esbuild-plugin` would require replacing `tsup` with
    direct `esbuild` — a toolchain swap that the owner is open to
    doing, but only if there is a specific driving reason beyond
    "fewer CI steps". The current shell-script flow is simple,
    offline-capable, and auditable. Plan text updated in §L-8
    accordingly (lane status: dropped).
11. **L-15 timing and the broader sequence**. **Sequence is fixed:
    (1) this MCP observability push completes → (2) user-facing
    search tool (MCP App widget) → (3) Search CLI observability on
    the next branch.** L-15 strategy close-out happens in Phase 5 of
    this plan, informed by Phase 1-4 operational data, before the
    user-facing-search work begins.

### A.4 Additional Owner Direction (2026-04-17)

- **Sentry GitHub integration is installed and configured** on the
  org (`oak-national-academy`). This enables source-code links in
  Sentry issue frames and unlocks `set-commits --auto` if ever
  needed. L-7 still uses explicit `--commit` for determinism.
- **`@sentry/esbuild-plugin` → requires tsup→esbuild swap**. Noted
  for a possible future enhancement lane. Not this branch.

### A.6 Reviewer Findings Register — Session 2026-04-17 close

Six reviewers ran at session close: `docs-adr-reviewer`, `assumptions-reviewer`, `code-reviewer`, `test-reviewer`, `sentry-reviewer`, `architecture-reviewer-fred`. All returned non-blocking verdicts. Full enumeration below. Every finding has a status: **ACTIONED** (edit already applied, citing location), **TO-ACTION** (scheduled with owning lane + specific edit), or **REJECTED** (with written rationale). No finding is "deferred" without an owning lane.

#### Status counts

29 findings total: 18 ACTIONED, 11 TO-ACTION, 0 REJECTED.

#### docs-adr-reviewer (7 findings)

| # | Finding | Status | Home |
|---|---------|--------|------|
| DR-1 | ADR-143 / 160 / 161 supersession and acceptance consistency across files | ACTIONED | ADR-143 frontmatter status line + §6 note; ADR-160/161 Accepted flip — all in place |
| DR-2 | `observability.md` missing as a first-class propagation target | ACTIONED | § Documentation Propagation now lists it explicitly |
| DR-3 | `packages/libs/sentry-node/README.md` expansion load-bearing but only named generically | ACTIONED | Explicit entry in § Documentation Propagation |
| DR-4 | `packages/core/telemetry-redaction-core/README.md` listed but workspace does not yet exist | ACTIONED | Entry annotated "(created by L-12-prereq; new package)" |
| DR-5 | Phase 1 dependency graph edge `L-12-prereq → L-DOC-initial` is spurious (crosses phases) | ACTIONED | Edge removed; replaced with `L-12-prereq → L-12` |
| DR-6 | L-7 script-name drift between plan body (`sentry-*`-prefixed) and A.2 item 5 (unprefixed) | ACTIONED | A.2 item 5 now names the prefixed forms matching body |
| DR-7 | Todo-status lifecycle: ADR-117 defines only `pending` / `completed`; `dropped` on L-8 is non-compliant (pre-existing, not session-introduced) | TO-ACTION | **Owning lane: L-8 body** (not this session). Edit: either amend ADR-117 to recognise `dropped`, or change L-8's frontmatter status to `completed` with body note documenting park status. Track via new frontmatter todo `ws-reconcile-dropped-status`. |

#### assumptions-reviewer (15 findings)

| # | Finding | Status | Home |
|---|---------|--------|------|
| AR-1 | ~90 lines of A.1/A.2/A.3 retrospective content duplicate plan body — candidate for pruning | TO-ACTION | **Owning lane: consolidation at branch close** (`/jc-consolidate-docs` at PR time). Edit: reduce Appendix A retrospective sections to one-paragraph summaries + link to git history for reviewer-transcripts. Frontmatter todo already exists (`ws-consolidation`); annotate it with this obligation. |
| AR-2 | L-12-prereq pre-commits package name/tier/deps without ADR-level authority | ACTIONED | §L-12-prereq wording softened to "proposes (pending ADR-160 amendment)"; ADR-160 amendment now scheduled (see AR-7) |
| AR-3 | L-1 RED names integration behaviour as fixture-observable before any integration is wired — fixture runtime may not observe non-event envelopes (ANR, streamed-span, runtime-metrics) without adapter extensions | TO-ACTION | **Owning lane: L-1**. Edit L-1 GREEN to name fixture-runtime envelope-observability extensions as a prerequisite step: before asserting ANR/Zod/runtime-metric event capture, `createFixtureRuntime` in `runtime.ts` must route envelopes through the same `beforeSend*` adapters the live SDK uses, OR a separate capture path for non-event envelopes must be added. Acceptance criterion: fixture can observe at minimum (a) ANR stack events via `beforeSend`; (b) Zod error payloads via `beforeSend`; (c) runtime metrics via `beforeSendMetric` (after L-4b). Add schedule-risk row (done — see Risk table). |
| AR-4 | L-4b's pure-function vs fixture-capture separation is semantically well-defined but not mechanically specified | TO-ACTION | **Owning lane: L-4b RED**. Edit L-4b RED to specify: pure-function test calls `redactSentryMetric(metric)` directly with a `Metric` payload, no adapter wiring; fixture-capture test calls `createSentryHooks({ mode: 'sentry', ... }).beforeSendMetric(metric)` through the composed options returned by `createSentryInitOptions` and asserts the fixture store observes the redacted metric envelope. The two tests prove different claims: policy (pure) vs wiring (fixture). |
| AR-5 | `satisfies` gate's "build breaks on new NodeOptions hook" claim was inaccurate in risk table | ACTIONED | Risk row rewritten to name the honest enforce-edge (code review + explicit registry); L-0b test file TSDoc already carries the same caveat |
| AR-6 | Risk row mitigation mis-stated `satisfies` behaviour | ACTIONED | Same row as AR-5; rewritten |
| AR-7 | ADR-160 Open Questions resolved in plan prose not ADR amendment | TO-ACTION → **ACTIONED** this session | **Owning lane: ADR-160 amendment** — applied at this session close in the same commit as the register. Amendment folds the package-placement answer (`packages/core/telemetry-redaction-core/`) and conformance-test-centralisation answer (per-consuming-workspace) into the ADR body; Open Questions section replaced with "Closed Questions — 2026-04-17" noting the resolution. |
| AR-8 | Fixture runtime may not observe non-event envelopes — L-1 schedule risk not called out | ACTIONED | New risk row added (see Risk table, Phase 1 row "fixture envelope observability"). |
| AR-9 | Per-phase RED tightening creates test-scope fan-out (six integrations × behaviour-level capture in L-1) not called out as schedule risk | ACTIONED | New risk row added (see Risk table, Phase 1 row "RED test-author fan-out"). |
| AR-10 | Reviewer matrix gap: no `docs-adr-reviewer` in Phase 2 | ACTIONED | § Adversarial Review matrix updated — Phase 2 now includes `docs-adr-reviewer` (L-4b / L-7 touch runbooks + env-variable docs). |
| AR-11 | Reviewer matrix gap: no `assumptions-reviewer` at each phase close | ACTIONED | § Adversarial Review matrix updated — `assumptions-reviewer` added at every phase close, not only session close. |
| AR-12 | No reviewer specifically targets L-12-prereq package-extraction decision before L-12 Phase 3 | ACTIONED | § Adversarial Review matrix updated — `architecture-reviewer-fred` and `architecture-reviewer-barney` scheduled at L-12-prereq GREEN close, not only at Phase 3 close. |
| AR-13 | `L-0b → L-12-prereq` blocking relationship over-strict | ACTIONED | Graph edge relaxed to `L-0b ↔ L-12-prereq` (coordinating, not strict blocking) with rationale. |
| AR-14 | Graph edge `L-2 → L-DOC-initial` is sequencing preference, not technical dependency | ACTIONED | Graph wording updated to "(sequencing — shared delegate seam should land before doc describes it; not a hard technical block)". |
| AR-15 | `L-12-prereq → L-DOC-initial` is only blocking if same phase | ACTIONED | Edge dropped (see DR-5). |

#### code-reviewer (7 findings)

| # | Finding | Status | Home |
|---|---------|--------|------|
| CR-1 | `resolveHookReturn` dual-guard logic is slightly redundant | ACTIONED | Test file: collapsed to one-pass check with contextual error (applied this session after register) |
| CR-2 | `BYPASS_CANDIDATES` tautological alias (same reference as `BARRIER_HOOKS`) — test cannot fail | ACTIONED | Test file: `BYPASS_CANDIDATES` deleted; the bypass-describe references `BARRIER_HOOKS` directly |
| CR-3 | `SentryLogPayload` / `SentrySpanPayload` re-declared locally | ACTIONED | `types.ts` now exports both aliases; test file imports them |
| CR-4 | Maintenance JSDoc only at file head — consider inline comment above `BARRIER_HOOKS` edit point | ACTIONED | Inline comment block above `BARRIER_HOOKS` added, pointing at file-header protocol |
| CR-5 | Part 2 helper duplicates Part 3 inline URL assertion | ACTIONED | Part 3 tests call the `assertRedacted*` helpers where shape matches; inline assertions retained only where helper shape differs |
| CR-6 | `buildPiiSpan` uses literal `'Bearer oak-span-secret-zzz'` in two places — extract constant | ACTIONED | Test file: `OAK_SPAN_BEARER_TOKEN` constant introduced |
| CR-7 | Recommend `type-reviewer` as additional specialist for `satisfies` gate + `MinimalHooks` type coupling | ACTIONED | § Adversarial Review matrix updated — `type-reviewer` added to Phase 1 reviewers for L-0b follow-through and to L-4b/L-12-prereq |

#### test-reviewer (9 findings)

| # | Finding | Status | Home |
|---|---------|--------|------|
| TR-1 | TDD framing was retroactive for Parts 1–3; "RED by non-existence" overstates what was done | ACTIONED (honest labelling) | Test file header now explicitly calls Parts 1–3 a "conformance harness" rather than a TDD specification; bypass section remains credible RED-on-change. Plan §L-0b wording aligned. |
| TR-2 | Bypass tests for `beforeSend` / `beforeSendTransaction` under-covered PII sub-fields | ACTIONED | Assertions extended to cover every PII field in the payload builders |
| TR-3 | File naming compliant | ACTIONED (no edit needed) | n/a |
| TR-4 | Assertion style — `JSON.stringify` negative scans weaker than positive `toEqual`; standardise toward positive equality where feasible | ACTIONED | Test file: positive `toEqual` assertions used for exact shape; `JSON.stringify` retained only as supplementary "no raw leak" check where exact shape is too deep to enumerate |
| TR-5 | Fixture discipline compliant | ACTIONED (no edit needed) | n/a |
| TR-6 | No-skipped-tests compliant | ACTIONED (no edit needed) | n/a |
| TR-7 | Part 2 ordering invariant absent for `beforeSendLog` / `beforeSendSpan` (documentation gap in header, not a missing test — ordering is vacuous for hooks without post-hook slots) | ACTIONED | Test file header note added explaining the degenerate case |
| TR-8 | `beforeSendLog` has no explicit "never returns null" assertion (only via `requireDefined`) | ACTIONED | Explicit `expect(result).not.toBeNull()` added for consistency with `beforeSendSpan` |
| TR-9 | `REDACTION_SENTINEL` hardcoded and duplicated across two test files | ACTIONED | Test file imports `REDACTED_VALUE` from `@oaknational/observability` (already an exported constant at `packages/core/observability/src/redaction.ts:18`); local alias `REDACTION_SENTINEL` deleted |

#### sentry-reviewer (10 findings; 7 substantive + 3 details)

| # | Finding | Status | Home |
|---|---------|--------|------|
| SR-1 | Three-part closure coverage ADEQUATE per ADR-160 Parts 1–3 | ACTIONED (confirmation) | n/a |
| SR-2 | Hook contract non-uniformity handled correctly | ACTIONED (confirmation) | n/a |
| SR-3 | `beforeSendMetric` gap: `satisfies` alone insufficient; code review + explicit registry is the enforce-edge | ACTIONED | Risk row rewritten (see AR-5); test file TSDoc already calls this out |
| SR-4 | Payload adequacy: sufficient for current policy; JWT / email / session-cookie would harden | ACTIONED | Test file payload builders extended with JWT-shaped, email-shaped, and session-cookie-shaped PII classes |
| SR-5 | Bypass-helper drift: constrain `MinimalHooks` to `ReturnType<typeof createSentryHooks>` | ACTIONED | `runtime-sdk.ts` now exports the hook-return type as `SentryRedactionHooks`; test `MinimalHooks` alias removed in favour of this imported type |
| SR-6 | Proof-surface correctness CONFIRMED | ACTIONED (confirmation) | n/a |
| SR-7 | `createSentryHooks` second `hint` argument not exercised — tests pass `{}` | ACTIONED | At least one test now passes a meaningful `hint` (`{ originalException: new Error('pii-source') }`) to exercise the hint path; the redactor does not branch on hint today, but the test is forward-compatible |
| SR-8 | `isPromiseLike` generic has unused type parameter | ACTIONED | Signature simplified to remove unused generic |
| SR-9 | Cite ADR-143 §6 alongside ADR-160 in test-file JSDoc | ACTIONED | File header @see block now cites ADR-160 + ADR-143 §6 |
| SR-10 | No false positives observed | ACTIONED (confirmation) | n/a |

#### architecture-reviewer-fred (10 findings)

| # | Finding | Status | Home |
|---|---------|--------|------|
| AF-1 | L-3 boundary-rule path and enforcement claim off | ACTIONED | §L-3 wording corrected (`boundary.ts` + `import-x/no-extraneous-dependencies`; no named MCP-symbol rule exists today) |
| AF-2 | L-12-prereq package placement at `packages/core/telemetry-redaction-core/` CORRECT under ADR-041 / ADR-154 | ACTIONED (confirmation) | n/a |
| AF-3 | Explicit-superset wording adequate; residual risk — add test that shared seam's published type has no method-name union wider than any single consumer | TO-ACTION | **Owning lane: L-2 RED**. Edit L-2 acceptance to add: "A type-level test asserts that the published method factory's inferred type is a structural **intersection** over the consumers' declared delegate slices at each composition root — no method name appears in the public type that is not consumed by at least one caller." |
| AF-4 | L-0b test file ADR-078 / ADR-154 compliant | ACTIONED (confirmation) | n/a |
| AF-5 | `MinimalHooks` test-local duplication acceptable as test-local (but structural coupling via `ReturnType<typeof createSentryHooks>` would harden) | ACTIONED | Resolved via SR-5 — `MinimalHooks` removed; test imports `SentryRedactionHooks` from `runtime-sdk.ts` |
| AF-6 | Missing graph edge `L-12-prereq → L-12` | ACTIONED | Edge added to Phase 1 dependency graph |
| AF-7 | L-0b test file ADR-161 compliant (in-process, no network, no vendor CLI) | ACTIONED (confirmation) | n/a |
| AF-8 | AGENT.md OWNER-ONLY flag correctly placed in main Documentation Propagation block; two nits — parallel flag in A.2 historical block (item 13), cross-reference PDR-003 file path | ACTIONED | A.2 item 13 historical block now carries the OWNER-ONLY flag + `.agent/practice-core/decision-records/PDR-003-sub-agent-protection-of-foundational-practice-docs.md` path |
| AF-9 | Delegation suggestion: `test-reviewer` on `MinimalHooks` coupling | ACTIONED | Resolved by CR-7 + SR-5 (type-reviewer in matrix; MinimalHooks removed) |
| AF-10 | Delegation suggestion: `type-reviewer` confirm the `satisfies` gate's compile-time behaviour | ACTIONED | Resolved by CR-7 — `type-reviewer` in Phase 1 matrix for L-0b follow-through and Phase 2 L-4b hook-union extension |

#### AGENT.md edit — exact text (owner-applied at L-DOC-initial close)

L-DOC-initial creates `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`. At that lane's close, the owner edits `.agent/directives/AGENT.md` § Essential Links → Architecture and Schema (between the Schema-First MCP Execution Directive line and the Semantic Search Architecture line):

```markdown
- [MCP Observability](../../apps/oak-curriculum-mcp-streamable-http/docs/observability.md) -
  Sentry wrapping, redaction barrier, scope enrichment, source-map upload
```

This is **the only AGENT.md edit required** by the maximisation work. Owner-applied per PDR-003. Sub-agents must not edit AGENT.md; this register carries the exact diff so the edit cannot drift.

### A.5 Reviewers' Closing Posture

- **assumptions-reviewer**: CONCERNS IDENTIFIED (proportionality, blocking
  legitimacy, unstated assumptions). Not merge-blocking; resolve via A.3.
- **architecture-reviewer-barney**: ISSUES FOUND (structural, not blocking).
  Shape simplifications recommended — see A.2 items 2, 3, 12.
- **architecture-reviewer-betty**: ISSUES FOUND (scaffolding shapes, widget
  coupling, divergence semantics). Long-term change cost higher than plan
  states on L-11 and L-12.
- **architecture-reviewer-fred**: ISSUES FOUND (one critical — ADR-160
  successor ADR required — plus L-7 sibling-scripts and L-12 browser-safe
  redactor). All actionable in A.2.
- **sentry-reviewer**: ISSUES FOUND (API accuracy — L-6 env name, L-1
  streaming scope, metrics history). All actionable in A.1 and A.2.
- **docs-adr-reviewer**: GAPS FOUND (dangling references — now fixed;
  missing propagation targets; ADR-160 successor convention). Actionable in
  A.1 and A.2 items 1, 13, 14, 15.
- **test-reviewer**: ISSUES FOUND (RED phases framed as config-shape, not
  behaviour; L-EH edge cases; L-12 boundary). Actionable in A.2 items 9,
  10, 11.

Phase 1 of this plan opens in the next session. With A.3 resolved
(2026-04-17), the first two actions of that session are: (a) apply the
A.2 structural corrections to the plan, (b) begin L-0 RED on the
corrected ADR-160 successor path. The broader order then follows the
Phase 1 lane list.

Per phase, the todo list is the binding record of state transitions.
