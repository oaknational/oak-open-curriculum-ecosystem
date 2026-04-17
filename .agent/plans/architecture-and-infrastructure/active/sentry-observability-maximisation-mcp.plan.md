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
  - id: l0-ground-truth-and-adr-143-amendment
    content: "L-0: record corrected ground-truth inventory in docs; generalise ADR-143 §6 (redaction barrier as principle, not enumerated list)"
    status: pending
  - id: l1-free-signal-integrations
    content: "L-1: opt-in to anrIntegration, zodErrorsIntegration, nodeRuntimeMetricsIntegration, spanStreamingIntegration+withStreamedSpan, rewriteFramesIntegration, extraErrorDataIntegration; verify processSessionIntegration emits"
    status: pending
  - id: l2-delegates-extraction
    content: "L-2: extract createSentryDelegates from the MCP app into @oaknational/sentry-node so the CLI call site can consume it in the next branch"
    status: pending
  - id: l3-mcp-context-enrichment
    content: "L-3: type and populate mcp_request context (session, method, tool, argument-shape deny-list, client/server party info)"
    status: pending
  - id: l4a-span-metrics-convention
    content: "L-4a: publish span-metric naming convention oak.<runtime>.<feature>.<metric>; instrument acceptance tracers on existing spans"
    status: pending
  - id: l4b-dedicated-metrics-adapter
    content: "L-4b: dedicated Sentry.metrics.* adapter surface with SENTRY_ENABLE_METRICS flag, beforeSendMetric redaction, fixture capture, narrow SentryPrimitiveValue attributes"
    status: pending
  - id: l5-dynamic-sampling
    content: "L-5: replace fixed tracesSampleRate with tracesSampler (100% errors, 100% >P95 latency, sampled happy path, elevated cold-boot and auth-proxy)"
    status: pending
  - id: l6-profiling
    content: "L-6: add @sentry/profiling-node, wire nodeProfilingIntegration, evaluate overhead, document rollout"
    status: pending
  - id: l7-release-deploy-linkage
    content: "L-7: sentry-cli releases set-commits --auto and releases deploys new wired into CI/deploy flow; close regression-detection loop"
    status: pending
  - id: l8-bundler-source-maps
    content: "L-8: PARKED — bundler source-map plugin deferred. @sentry/esbuild-plugin would require replacing tsup with esbuild; the current shell-script flow is simpler, offline-capable, and auditable. Revisit only if script complexity grows or a specific driver emerges."
    status: dropped
  - id: l9-feedback
    content: "L-9: captureFeedback pipeline; optionally surface as an MCP tool"
    status: pending
  - id: l10-feature-flag-scaffolding
    content: "L-10: provider-TBD featureFlagsIntegration shim; context-on-error loop wired so any future provider pays for itself"
    status: pending
  - id: l11-ai-instrumentation-scaffolding
    content: "L-11: expose instrumentOpenAiClient / instrumentAnthropicAiClient / vercelAIIntegration wrappers via adapter so future LLM tool calls are one import away"
    status: pending
  - id: l12-widget-sentry
    content: "L-12: @sentry/browser (or @sentry/react after bundle-size review) in the MCP App widget with shared redaction and linked traces"
    status: pending
  - id: l13-alerts-dashboards-runbooks
    content: "L-13: per-loop alert + dashboard panel + runbook entry with severity, routing, dedupe"
    status: pending
  - id: l14-third-party-trace-propagation
    content: "L-14: security-gated trace propagation decision for non-Oak hosts (including Oak API boundary)"
    status: pending
  - id: l15-strategy-close-out
    content: "L-15: record the Sentry-only vs dual-export vs minimal-operational strategy decision with rationale and reviewer attribution"
    status: pending
  - id: l-eh-error-handling-discipline
    content: "L-EH (cross-cutting): author eslint rules require-error-cause and prefer-result-pattern in @oaknational/eslint-plugin-standards; apply to new/changed code across the monorepo"
    status: pending
  - id: l-doc-documentation-coverage
    content: "L-DOC (cross-cutting): inventory existing Sentry docs, write missing sentry-node README and app observability doc, cross-link, TSDoc per loop"
    status: pending
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
    content: "Review ADRs 160 and 161 (drafted 2026-04-17, status: Proposed) before Phase 1 opens. ADR-160 supersedes ADR-143 §6 in part; ADR-161 captures the network-free PR-check CI boundary. L-0 authors confirm ADR-160 text matches what lands in code; L-7 authors confirm ADR-161's pipeline boundary table matches the actual sibling-script attachment points. Accept, revise, or request amendments; flip status from Proposed to Accepted when settled."
    status: pending
    priority: next
isProject: true
---

# Sentry Observability Maximisation — MCP Server

**Last Updated**: 2026-04-17
**Status**: 🟡 PLANNING — ready for fresh session
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
  ADR-159 (per-workspace vendor CLI ownership).

---

## Phase Structure

The plan has four phases. Each phase runs a full RED → GREEN → REFACTOR
→ QUALITY GATE → SPECIALIST REVIEW cycle before the next begins. Phases
commit independently; the PR opens after Phase 4.

| Phase | Tracks |
|-------|--------|
| Phase 1 — Foundation uplift | L-0, L-1, L-2, L-DOC (initial), L-EH (initial) |
| Phase 2 — Measurement and correlation | L-3, L-4a, L-4b, L-5, L-6, L-7, L-8 |
| Phase 3 — Breadth | L-9, L-10, L-11, L-12 |
| Phase 4 — Operations + close-out | L-13, L-14, L-15, L-DOC (final), L-EH (final) |

Cross-cutting tracks (L-EH, L-DOC) have work in every phase; their
acceptance is assessed in Phase 4.

---

## Phase 1 — Foundation Uplift

### L-0 Ground truth + ADR-160 implementation

**Objective**. Implement the test-gate closure property named by
ADR-160 (drafted 2026-04-17 alongside this plan) so that the
redaction-barrier doctrine is machine-enforced across every current
and future fan-out path.

**Prerequisite** (drafted 2026-04-17): [ADR-160: Non-Bypassable
Redaction Barrier as Principle](../../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
supersedes ADR-143 §6 in part. ADR text exists; this lane is the
test-gate implementation plus cross-reference sweep. Status flips
to Accepted at close-out per the `ws-review-adrs-160-161` todo.

**RED**: Unit / integration test(s) per the ADR-160 "Test Gate"
section. For each registered fan-out hook on the current adapter
surface (`beforeSend`, `beforeSendTransaction`, `beforeSendSpan`,
`beforeSendLog`, `beforeBreadcrumb`), a fixture-mode test feeds a
payload containing a known redactable value (e.g. a known email-like
string) and asserts the value emerges redacted at the fixture
capture. These MUST fail against any bypass condition (e.g. the
redactor wired but the consumer post-hook receiving the
pre-redaction payload).

**GREEN**: Wire the conformance tests into `pnpm test` so the
barrier-bypass class becomes a lint/test-level defect, not just a
reviewer concern. The redactor implementation is already in place
(`packages/libs/sentry-node/src/runtime-redaction.ts`); this is
primarily a test-authoring lane, not a behaviour-change lane.

**REFACTOR**:

1. `packages/libs/sentry-node/README.md` acquires a "Redaction
   barrier" section that cites ADR-160 as authoritative doctrine
   (L-DOC overlap — coordinate).
2. The crosswalk plan
   (`active/sentry-observability-translation-crosswalk.plan.md`)
   reflects ADR-160 as the authoritative successor to ADR-143 §6.
3. Session napkin and distilled carry the grounding lesson (already
   captured; verify no drift).

**Acceptance**:

1. Conformance test(s) green in `pnpm check`.
2. A deliberately-introduced bypass (e.g. returning the
   pre-redaction payload from a consumer post-hook) is caught by the
   test suite.
3. ADR-160 status flipped from Proposed to Accepted at close-out.
4. ADR-143 §6 supersession note remains in place and points at
   ADR-160.

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

**RED**: Unit/integration tests under
`packages/libs/sentry-node/src/` and
`apps/oak-curriculum-mcp-streamable-http/src/observability/` asserting
that each integration is present in the constructed `NodeOptions`
and that the shared redaction barrier still intercepts events from
each one (fixture-mode assertions for ANR stacks, Zod error payloads,
runtime metric attributes where applicable).

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

**Acceptance**:

1. `grep -rn "createSentryDelegates" apps/` returns only imports from
   `@oaknational/sentry-node`.
2. MCP app tests unchanged in behaviour.
3. Type-check green.

### L-DOC (initial slice) — Documentation inventory

**Objective**. Make the existing Sentry integration discoverable by
reading docs, without grepping.

**RED**: Write a structural test (under `test:root-scripts`) that
asserts the existence of:

- `packages/libs/sentry-node/README.md` mentioning: modes, redaction
  barrier, DI seam, fixture store, logger sink, shared delegates.
- `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`
  mentioning: `wrapMcpServerWithSentry` wiring, per-request span,
  scope enrichment, Express error handler, source-map upload,
  redaction barrier entry points.

**GREEN**: Write both files.

**REFACTOR**: Cross-link from the workspace READMEs and
`.agent/directives/AGENT.md § Essential Links`. Add a one-line entry
to the ADR index if the amendment from L-0 warrants it.

**Acceptance**:

1. Structural test passes.
2. Manual review: a reader unfamiliar with the code can answer "is
   MCP auto-instrumented?" and "where does redaction happen?" from
   docs alone.

### L-EH (initial slice) — Error-handling discipline

**Objective**. Land the ESLint rule for cause preservation and apply
it to new/changed code in Phase 1.

**RED**: Unit tests under
`packages/core/oak-eslint/src/rules/require-error-cause.unit.test.ts`
using `RuleTester`. Cases:

- `new Error('x')` inside a `catch(e)` without `{ cause: e }` → error.
- `new CustomError('x', { cause: e })` → pass.
- `new Error('x')` outside any `catch` → pass.
- `throw new Error('x')` inside `catch` without re-throw of `e` — error
  (unless explicit pass-through or marked with ADR-approved sentinel).

**GREEN**: Author
`packages/core/oak-eslint/src/rules/require-error-cause.ts`. Register in
`packages/core/oak-eslint/src/index.ts`'s `rules` record. Include in
the `strict` config.

**REFACTOR**: Apply rule to repo; fix violations introduced by Phase 1
changes. Document the rule and the `Result<T, E>`-preferred pattern in
`.agent/rules/use-result-pattern.md` (expand the current one-line rule
with concrete examples and the new ESLint rule id).

**Acceptance**:

1. RuleTester suite green.
2. `pnpm lint` on the branch surfaces no new `require-error-cause`
   violations in changed files.

---

## Phase 2 — Measurement and Correlation

### L-3 MCP request context enrichment

**Objective**. Populate a typed `mcp_request` context on the Sentry
scope at the handler boundary. Complements, not replaces, the
attributes that `wrapMcpServerWithSentry` writes on spans.

**RED**: Unit/integration tests for an `enrichMcpRequestContext`
function asserting the context shape. Fields: `session_id`, `method`,
`tool_name`, `argument_shape` (deny-listed key names only, never
values), `client.name`/`client.version`/`client.title` from the
MCP initialize handshake, `server.name`/`server.version`.

**GREEN**: Implement `enrichMcpRequestContext(req, observability)` and
call it from `mcp-handler.ts`. Redact via existing barrier — request
body never flows into the context.

**REFACTOR**: TSDoc + observability.md update.

**Acceptance**: fixture-mode captures include the `mcp_request` context
with the expected shape and no argument values.

### L-4a Span metrics convention

**Objective**. Publish `oak.<runtime>.<feature>.<metric>` as the
convention for metric-shaped signals on existing spans (production-safe
Sentry-recommended path).

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

### L-4b Dedicated metrics adapter surface (beta)

**Objective**. Add `metrics: { count, gauge, distribution }` to
`SentryNodeSdk` and `SentryNodeRuntime`. Gate live emission behind
`SENTRY_ENABLE_METRICS`. Extend the shared redaction barrier with
`beforeSendMetric`.

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

**RED**: Unit tests for off-mode noop, fixture-mode capture,
`beforeSendMetric` redaction, attribute narrowing, namespace
parameterisation, sync single-arg hook shape.

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

### L-5 Dynamic sampling

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

### L-6 Profiling

**Objective**. Add `@sentry/profiling-node`, wire
`nodeProfilingIntegration`, measure overhead.

**RED**: Integration test asserting the profiling integration is
present in the `NodeOptions` when `SENTRY_PROFILES_SAMPLE_RATE > 0`.

**GREEN**: Install dependency. Add `SENTRY_PROFILES_SAMPLE_RATE` env
flag. Compose integration in `createSentryInitOptions`.

**REFACTOR**: Measure overhead on a representative harness
(`prod:harness` or a new micro-bench). Document rollout (env-gated
initially; revisit continuous after measurement).

**Acceptance**: profile linked to a transaction visible in Sentry UI;
overhead documented in the runbook.

### L-7 Release + commits + deploy linkage

**Objective**. Close the regression-detection loop.

**Pipeline discipline** (settled 2026-04-17 with owner): L-7 runs in
the **Vercel deploy pipeline only**, not in GitHub Actions PR / push
checks. PR checks stay network-free per `testing-strategy.md`. The
deploy pipeline already has `SENTRY_AUTH_TOKEN` available; CI PR
checks do not.

**Script partitioning**: the existing `scripts/upload-sourcemaps.sh`
stays as-is (source-map concern). Add **sibling scripts** in the same
workspace:

- `scripts/sentry-release-set-commits.sh` — invokes
  `sentry-cli releases set-commits "$RELEASE" --commit "oaknational/oak-open-curriculum-ecosystem@$GIT_SHA"`.
  Uses the **explicit `--commit`** form for determinism and to keep
  the script testable without Sentry org-side state. (The Sentry
  GitHub integration is installed for the org and enables `--auto`;
  we use explicit anyway so the CLI has no implicit dependency on
  the integration remaining installed.)
- `scripts/sentry-deploy-register.sh` — invokes
  `sentry-cli releases deploys "$RELEASE" new -e "$SENTRY_ENVIRONMENT"`.

Each script follows the ADR-159 shape: fail-fast preflight + one
vendor invocation + post-condition check.

**RED**: Behaviour tests (not shell grep). For each sibling script,
write a deterministic validation that runs against a fake
`sentry-cli` binary placed on `PATH` and asserts the argument vector
the script emits (including explicit commit SHA and environment).
Optionally: an integration test against a recorded Sentry API
response under `nock` or equivalent — but only in a workspace that
already runs network-isolated integration tests; otherwise keep the
fake-CLI approach.

**GREEN**: Author the two sibling scripts. Wire both into the Vercel
predeploy/postdeploy hook (release linkage in predeploy after
source-map upload; deploy register in postdeploy after traffic
switches). Document the hook attachment in the deployment runbook.

**REFACTOR**: Update `docs/operations/sentry-deployment-runbook.md`
(new section: "Release → commit → deploy linkage"),
`docs/operations/sentry-cli-usage.md` (add the two new script
entries), and the `packages/libs/sentry-node/README.md` release
section (refer to both scripts).

**Acceptance**:

1. Sentry UI shows the branch release tagged with the commit SHA
   (verify via `sentry api` against `organizations/.../releases/<rel>/commits/`).
2. Sentry UI shows a deploy event for the preview environment
   (verify via `sentry api` against `organizations/.../releases/<rel>/deploys/`).
3. No Sentry network calls originate from PR-check CI runs —
   verified by grepping the GitHub Actions workflow files for
   `sentry-cli` invocations (expected: zero).

### L-8 Bundler-side source maps — PARKED (2026-04-17)

**Status**. Not in this plan's delivery scope.

**Rationale** (settled with owner 2026-04-17): `@sentry/esbuild-plugin`
would require replacing `tsup` with direct `esbuild` — a toolchain
swap. The current shell-script flow is:

- Simple (≈150 lines of bash).
- Offline-capable (devs can `pnpm build` without `SENTRY_AUTH_TOKEN`).
- Auditable (we own the script; Sentry plugin updates cannot break
  our build).
- Already working and proven on this branch.

The plugin option stays parked as a **future enhancement**. Revisit
only if (a) the shell script's complexity grows materially, (b) a
specific operational requirement emerges, or (c) the tsup→esbuild
swap becomes desirable for unrelated reasons.

No acceptance criterion — this lane is deferred, not delivered.

---

## Phase 3 — Breadth

### L-9 Feedback pipeline

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

### L-10 Feature-flag scaffolding — TSDoc extension point only

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

### L-11 AI-instrumentation scaffolding — TSDoc extension point only

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

### L-12 Widget Sentry

**Objective**. Instrument the MCP App browser widget with
`@sentry/browser` (or `@sentry/react` after bundle-size review).

**Process**:

1. Bundle-size measurement with both packages on a throwaway branch.
2. Select based on measurement + React-tree complexity.
3. Share DSN / environment / release / traces-propagation-target
   configuration with the server so traces link end-to-end.
4. Redaction: widget-side `beforeSend` uses a widget-adapted version
   of the shared policy (no server-only fields). Align doctrine with
   ADR-143.

**RED**: Integration tests under `test:widget` assert the widget
constructs a Sentry client with the expected options (in fixture
mode) and that the shared redaction policy is applied.

**GREEN**: Implement. Thread config from the HTML resource's served
content or a widget-bootstrap endpoint (DI per ADR-078).

**REFACTOR**: TSDoc, widget README, observability.md (widget section).

**Acceptance**: browser error reproduction produces a linked trace in
Sentry (owner-verified); bundle size delta documented.

---

## Phase 4 — Operations + Close-out

### L-13 Alerts + dashboards + runbooks

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

### L-14 Third-party trace propagation (security-gated)

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
value from Phases 1–3. Record decision as an ADR.

**Acceptance**: ADR merged; the parent plan's strategy-close-out
obligation is discharged.

### L-EH (final) — Error-handling discipline

**Objective**. Land the opt-in `prefer-result-pattern` rule scoped
incrementally per workspace, and apply Phase-4 corrections across all
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

### L-DOC (final) — Documentation coverage

**Objective**. Every product loop in the taxonomy is discoverable from
docs.

**Deliverables**:

- `packages/libs/sentry-node/README.md` — adapter contract, modes,
  redaction barrier, metric surface, delegates seam.
- `apps/oak-curriculum-mcp-streamable-http/docs/observability.md` —
  MCP wrapper wiring, Express error handler, scope enrichment, span
  model, feedback, feature-flag and AI scaffolding, widget.
- Per-loop TSDoc on the owning function.
- ADR index includes L-0 amendment and any Phase-4 ADRs.
- `.agent/directives/AGENT.md § Essential Links` cross-links the
  observability doc.

**Acceptance**: structural test (from L-DOC initial) green on the full
inventory; manual walk-through by a reviewer (docs-adr-reviewer).

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

| Phase | Reviewers |
|-------|-----------|
| Phase 1 | code-reviewer (gateway), test-reviewer, type-reviewer, config-reviewer, docs-adr-reviewer, sentry-reviewer, architecture-reviewer-fred |
| Phase 2 | code-reviewer, test-reviewer, type-reviewer, sentry-reviewer, architecture-reviewer-betty, architecture-reviewer-wilma, security-reviewer |
| Phase 3 | code-reviewer, test-reviewer, type-reviewer, sentry-reviewer, react-component-reviewer (L-12), accessibility-reviewer (L-12), design-system-reviewer (L-12) |
| Phase 4 | code-reviewer, docs-adr-reviewer, sentry-reviewer, architecture-reviewer-fred, architecture-reviewer-wilma, security-reviewer (L-14), release-readiness-reviewer |

Reviewer outputs feed back into the plan's todo list. Findings are
actioned unless explicitly rejected with written rationale (per
principles.md).

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

Covered in the strategic brief at
[future/sentry-observability-maximisation.plan.md § Risks and Unknowns](../future/sentry-observability-maximisation.plan.md#risks-and-unknowns).

Phase-specific risks:

| Phase | Risk | Mitigation |
|-------|------|------------|
| 1 | Integration composition changes default behaviour unexpectedly | Fixture tests assert the `NodeOptions` shape; SDK version pinned |
| 2 | `tracesSampler` regresses sampling coverage during rollout | Roll out behind env flag with a fixed-rate fallback; measure first |
| 2 | Profiling-node native binary install fails in CI | Pin in `onlyBuiltDependencies`; document in CI runbook |
| 3 | Widget bundle size regression | Bundle-size test gate on widget build |
| 4 | Alert fatigue | Each alert has an SLO-style intent and dedupe before enablement |

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

Per phase, propagate:

- ADRs for architectural decisions (L-0, L-5, L-6, L-14, L-15).
- READMEs for every touched workspace.
- TSDoc on every new public surface.
- Runbook entries for alerts and operational procedures.
- `.agent/rules/` updates for error-handling (L-EH).

---

## Consolidation

After Phase 4, run `/jc-consolidate-docs` to graduate settled content,
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
   effectively four lanes across Phase 1 and Phase 4. Source:
   architecture-reviewer-barney.
4. **L-3 `enrichMcpRequestContext` lives in the MCP app**, not in
   `@oaknational/sentry-node`. It is MCP-specific domain logic; keeping it
   in the shared library regresses ADR-154 framework/consumer separation.
   Source: architecture-reviewer-betty.
5. **L-7 sibling scripts, not fused script**. Release-lifecycle operations
   (`set-commits`, `deploys new`) get their own scripts
   (`release-set-commits.sh`, `deploy-register.sh`) alongside
   `upload-sourcemaps.sh`. Preserves the ADR-159 "one vendor invocation
   per script with its own preflight + post-condition" discipline.
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
10. **L-EH edge-case coverage**. `require-error-cause` RuleTester must
    cover re-throw of the original binding, `cause` mismatch against a
    different variable, nested `try/catch` scopes, `AggregateError`
    constructor shape, and async-wrapper catch patterns. Explicit
    pass-through requires a sentinel (e.g. ADR-documented inline
    comment), not an absence of the rule. `prefer-result-pattern` needs a
    concrete heuristic spec — which function signatures fall under it —
    and valid/invalid RuleTester cases. Source: test-reviewer.
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
    `docs/observability.md`), `.agent/directives/AGENT.md § Essential
    Links` (observability doc), `packages/core/observability/README.md`
    (L-4a naming convention), ADR index entry for ADR-160 (L-0), and
    ADR-088 / ADR-144 amendment obligations. Source: docs-adr-reviewer.
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
2. **L-11 AI scaffolding**. **TSDoc extension-point stub only.** No
   re-exports from the adapter barrel. No new helpers on
   `HttpObservability`. A README section documents where LLM
   instrumentation will attach when the first Oak MCP tool calls an
   LLM. Plan text updated in §L-11 accordingly.
3. **L-10 feature-flag scaffolding**. **TSDoc extension-point stub
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
    the next branch.** L-15 strategy close-out happens in Phase 4 of
    this plan, informed by Phase 1-3 operational data, before the
    user-facing-search work begins.

### A.4 Additional Owner Direction (2026-04-17)

- **Sentry GitHub integration is installed and configured** on the
  org (`oak-national-academy`). This enables source-code links in
  Sentry issue frames and unlocks `set-commits --auto` if ever
  needed. L-7 still uses explicit `--commit` for determinism.
- **`@sentry/esbuild-plugin` → requires tsup→esbuild swap**. Noted
  for a possible future enhancement lane. Not this branch.

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
