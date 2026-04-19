---
name: "Sentry Observability Maximisation"
overview: >
  Strategic brief for maximising the operational value Oak obtains from
  Sentry across the MCP server (server runtime + browser widget) and, later,
  the Search CLI. This plan owns the full capability envelope: errors, logs,
  traces, performance, profiling, measurement (span metrics and beta Sentry
  Metrics), release/deploy linkage, feedback, feature-flag context, AI
  instrumentation scaffolding, alerting, dashboards, runbooks, and strategy
  close-out. Executable lanes are spun out per branch.
parent_plan: "sentry-otel-integration.execution.plan.md"
depends_on:
  - "sentry-otel-integration.execution.plan.md"
supersedes:
  - "archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md"
source_references:
  - "archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md"
  - "active/sentry-observability-translation-crosswalk.plan.md"
  - "active/search-observability.plan.md"
status: strategic
---

# Sentry Observability Maximisation

## Role

Strategic brief for the full Sentry capability envelope Oak intends to adopt
across its Node runtimes and the MCP App browser widget. This is not an
executable plan. Executable lanes branch off by runtime and by session:

- `active/sentry-observability-maximisation-mcp.plan.md` — current branch,
  MCP-server side (and MCP App widget).
- A future `search-observability-maximisation.plan.md` — next branch, Search
  CLI side; will mirror the MCP lanes plus search-specific additions
  (Elasticsearch instrumentation, retrieval-quality metrics, ingest
  check-ins).

This brief replaces `sentry-observability-expansion.plan.md`, which was
feature-shaped ("add SDK method X"). The replacement framing is:

> Maximise the operational value Oak obtains from Sentry by closing every
> Sentry "product loop" — capture + correlation + surface — the SDK offers,
> subject to Oak's redaction invariants and architectural doctrine.

## Problem and Intent

**Problem**. The outgoing plan tracked seven features (EXP-A..EXP-G) as a
checklist. That framing understated the available surface (the Sentry Node
SDK ships MCP-specific wrapping, ANR detection, Node runtime metrics,
streaming-span support, Zod error capture, LLM instrumentation hooks,
feature-flag context capture, dedicated metrics pipelines, and more) and
produced two concrete errors:

1. It did not catch that `wrapMcpServerWithSentry(server)` was already wired
   at `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts:98`.
   The scope audit inferred from SDK exports rather than reading the
   composition root. The corrective rule lands in this plan's L-DOC lane:
   the existing wiring must be discoverable without grepping.
2. It proposed new ADR-worthy doctrine (`beforeSendMetric` extending
   ADR-143 §6) without flagging that §6 enumerates a closed list of
   fan-out hooks — which means any additive fan-out creates the same
   footgun until §6 is generalised.

**Intent**. Close the gap between "SDK surface we have installed" and
"operational value we extract from Sentry" — without diluting ADR-143's
redaction doctrine, ADR-078's dependency-injection model, or ADR-159's
per-workspace vendor CLI ownership.

## Scope Recovery (from the superseded plan)

The following are owned here:

- `custom-metrics` (dual pattern: span metrics + dedicated beta metrics)
- `mcp-request-context`
- `trace-propagation-third-party` (security-gated)
- `profiling-evaluation`
- `source-maps-automation` (Debug ID injection is shipped; release +
  commit + deploy linkage is not)
- `alerting-dashboards-runbooks` (expanded beyond the single alert rule
  521866 that is already live)

Newly added to scope (absent from the superseded plan):

- Opt-in integrations not enabled by `@sentry/node` defaults:
  `anrIntegration`, `zodErrorsIntegration`, `nodeRuntimeMetricsIntegration`,
  `spanStreamingIntegration` + `withStreamedSpan`, `rewriteFramesIntegration`,
  `extraErrorDataIntegration`, `consoleIntegration`/`captureConsoleIntegration`.
- Dynamic sampling via `tracesSampler`.
- `captureFeedback` pipeline.
- `@sentry/profiling-node` (new dependency).
- Feature-flag context scaffolding (`featureFlagsIntegration`, provider TBD).
- AI instrumentation scaffolding (`anthropicAIIntegration`,
  `vercelAIIntegration`, `langChainIntegration`, `langGraphIntegration` —
  installed but unused until an MCP tool calls an LLM).
- Shared delegates extraction: `createSentryDelegates` moves from the MCP
  app into `@oaknational/sentry-node`, deleting the CLI's duplicated
  delegation seam (per architecture-reviewer-betty's finding).
- Bundler-side source maps: evaluate `@sentry/esbuild-plugin` for tsup and
  `@sentry/vite-plugin` for the widget as replacements for the shell
  script.
- **MCP App browser widget** observability via `@sentry/browser` with linked
  traces.
- **Error handling discipline track**: repo-wide push to `Result<T, E>` for
  all new/changed code, with ESLint rules enforcing cause preservation on
  constructed errors and Result-pattern adoption where practical.
- **Documentation coverage track**: inventory what we have, write the
  missing docs, cross-link them. Scope-driven by the concrete gap surfaced
  in the metacognition this session.

## Domain Boundaries and Non-Goals

**In scope**:

- `@oaknational/sentry-node` adapter surface extension.
- `@oaknational/logger` and `@oaknational/observability` coverage where
  Sentry signals flow.
- MCP app server-side instrumentation (Express, MCP SDK, auth, rate
  limiting, asset download, OAuth proxy).
- MCP App browser widget instrumentation (`@sentry/browser` or
  `@sentry/react`).
- Search CLI instrumentation (parity pass in the next branch).
- ESLint rule authoring and adoption across the monorepo.
- Release and deploy linkage via `sentry-cli`.
- Alerting, dashboard, and runbook content in the Sentry org.

**Out of scope**:

- Reopening ADR-078 or ADR-143's invariants (dependency injection;
  redaction barrier non-bypassable; `sendDefaultPii: false`).
- Browser-side features outside the MCP App widget (no marketing site, no
  other surfaces).
- Non-Node runtime support beyond what Sentry ships out of the box.
- Altering the per-request MCP transport pattern (ADR-112) or the
  auto-inserted MCP wrapper (`wrapMcpServerWithSentry`).
- Replacing `@oaknational/logger` — the coherent fan-out model stays.

## Dependencies and Sequencing Assumptions

1. Current branch `feat/otel_sentry_enhancements` holds the validated
   foundation (alert rule 521866, source-map Debug IDs, evidence bundle
   2026-04-16). The MCP-side executable plan lands on this branch before
   PR.
2. Search CLI parity work runs on its own branch after the MCP branch
   merges.
3. ADR-143 §6 amendment (or successor ADR) lands with the first new
   fan-out (metrics) — not before.
4. `createSentryDelegates` extraction lands before any new method added
   to the adapter surface, so both consumers pick up new methods in one
   change.
5. Profiling (`@sentry/profiling-node`) depends on dynamic sampling
   landing first so we don't double-sample happy-path traffic.
6. Release + commit + deploy linkage runs last in the MCP branch because
   it produces the evidence the branch's PR description will cite.

## Product-Loop Taxonomy

Each lane closes at least one **Sentry product loop**: capture mechanism
→ correlation identifier → Sentry surface. This is the unit of value.

| Loop | Capture | Correlation | Sentry Surface |
|------|---------|-------------|----------------|
| Unhandled exceptions | `onUncaughtException`/`onUnhandledRejection` integrations (default) | `release` + `environment` + `git_sha` | Issues, release regression |
| Handled errors | `captureHandledError` via adapter | `trace_id` + user id (where present) | Issues |
| Session health | `processSessionIntegration` (default) | `release` | Release Health / crash-free sessions |
| Structured logs | `SentryLogSink` + `beforeSendLog` | `trace_id` + `span_id` | Logs explore |
| Traces (auto) | Default HTTP/Express integrations | `trace_id` | Performance, Traces explore |
| Traces (MCP) | `wrapMcpServerWithSentry` | `trace_id` + `mcp.method`/`mcp.tool_name` | MCP Insights |
| Streaming traces | `spanStreamingIntegration` + `withStreamedSpan` | `trace_id` | Performance (accurate SSE/stream durations) |
| ANR | `anrIntegration` | `release` + call stack | Issues (ANR) |
| Zod errors | `zodErrorsIntegration` | `trace_id` | Issues (structured) |
| Runtime metrics | `nodeRuntimeMetricsIntegration` | `release` | Metrics / Performance |
| Span metrics | Span attribute convention `oak.<runtime>.<feature>.<metric>` | `trace_id` | Spans/Explore |
| Dedicated metrics (beta) | `Sentry.metrics.count/gauge/distribution` via adapter | `trace_id` + attributes | Metrics (beta) |
| Dynamic sampling | `tracesSampler` function | sampling decision tag | Performance (kept traces) |
| Profiling | `@sentry/profiling-node` | `trace_id` + transaction | Profiles |
| Source maps | `sentry-cli sourcemaps inject && upload` | Debug ID | Issues (symbolicated stacks) |
| Release + commits | `sentry-cli releases set-commits` | `release` + git SHA | Release UI, suspect commits |
| Deploy tracking | `sentry-cli releases deploys new` | `release` + env | Deploys UI, regression alerts |
| Feedback | `captureFeedback` | `trace_id` + user id | User Feedback UI |
| Feature-flag context | `featureFlagsIntegration` | error → flag state | Issue context |
| AI instrumentation (future) | `anthropic-ai`/`vercel-ai`/`langchain`/`langgraph` integrations | `trace_id` + model/tokens | LLM Monitoring |
| Third-party propagation | `tracePropagationTargets` allowlist (security-reviewed) | W3C `traceparent` | Linked traces across services |
| Widget browser Sentry | `@sentry/browser` in MCP App client | shared `trace_id` with server | Issues + Performance (browser) |
| Alerts + dashboards + runbooks | Sentry org configuration | loop-bound queries | Alerts, Dashboards, Runbooks |

Each loop has an executable-lane entry in the per-branch plan.

## Cross-Cutting Tracks

Two tracks span every loop:

### L-EH Error-handling discipline (Result<T, E> + cause preservation)

- All new or changed code MUST use `Result<T, E>` where practical.
- All constructed errors MUST preserve the cause chain via the native
  `cause` option.
- ESLint enforcement:
  - `preserve-caught-error` (ESLint core, built-in from 9.35.0 —
    supersedes the originally planned `require-error-cause` custom
    rule; landed 2026-04-19 in the MCP branch's L-EH initial lane):
    when a new `Error` is constructed inside a `catch` clause, the
    caught value MUST be passed as `{ cause }`. Covers missing cause,
    cause-mismatch, destructured-parameter loss, and variable
    shadowing by construction.
  - `prefer-result-pattern` (opt-in in specific scopes; custom rule in
    `@oaknational/eslint-plugin-standards`): flags functions whose
    signature could return `Result<T, E>` but instead relies on
    thrown exceptions for the error path. Apply incrementally per
    workspace, not globally on day one.
- Complements, does not replace, existing community rules
  (`@typescript-eslint/only-throw-error`,
  `@typescript-eslint/prefer-promise-reject-errors`).

### L-DOC Documentation coverage

- Inventory existing Sentry-related documentation (AGENT.md, governance
  docs, `docs/operations/sentry-*.md`, workspace READMEs, ADRs).
- Write the missing pieces (`packages/libs/sentry-node/README.md`,
  `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`).
- Each loop gets a short TSDoc surface summary in its owning module.
- Cross-link from the per-workspace READMEs, the ADR index, and the
  observability runbook.
- Acceptance: a new contributor (or a fresh agent session) can answer
  "is this wired?" for any listed loop by reading docs, without
  grepping code.

## Success Signals (what would justify promoting the next executable lane)

1. The MCP-side executable plan closes cleanly: every product loop in
   the taxonomy is either CLOSED (with evidence) or DEFERRED WITH
   RATIONALE.
2. The `createSentryDelegates` extraction deletes the CLI's duplicated
   delegation seam (verifiable by grep on the old path returning no
   hits).
3. ADR-143 §6 is generalised (or successor ADR landed) — the redaction
   barrier is defined as a principle, not an enumerated list.
4. `pnpm check` is green after every phase.
5. The documentation inventory is complete and every loop in the
   taxonomy is discoverable by reading docs alone.
6. The Search-CLI executable plan can re-use L-1..L-13 track shapes
   with minimal edits — if the MCP plan's lanes are shaped too
   MCP-specifically, that is a rework signal.

## Risks and Unknowns

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Sentry beta Metrics pipeline changes shape mid-flight | Medium | Medium | Dual pattern: span metrics is production-safe path; dedicated metrics is gated behind `SENTRY_ENABLE_METRICS` and ships adapter + fixture + redaction independent of live product availability |
| Cardinality drift in metric attributes | Medium | High | Naming convention TSDoc + lint suggestion; tests prove attribute values for acceptance metrics remain closed-set |
| Bundler-plugin source maps regress the current shell-script flow | Low | Medium | Evaluate on a branch; only adopt if the plugin simplifies CI without losing Debug ID post-condition check |
| `@sentry/profiling-node` adds native binary build cost to CI | Medium | Low | Pin version in `pnpm-workspace.yaml` `onlyBuiltDependencies`; measure install time delta |
| ESLint error-cause rule produces noisy false positives at first run | Superseded (2026-04-19) | Low | Resolved by re-scoping to ESLint built-in `preserve-caught-error` in the MCP branch's L-EH initial. Initial audit returned 0 in-tree violations; warn severity preserves CI until opt-in escalation to error. Standard `// eslint-disable-next-line preserve-caught-error -- <reason>` handles legitimate pass-through. |
| Widget `@sentry/browser` bloats the widget bundle | Medium | Medium | Measure bundle size delta; scope to minimal integrations; consider `@sentry/react` only if the React tree grows |
| Trace propagation to third-party hosts exposes user data | High if mishandled | High | Security review before any non-Oak allowlist addition (EXP-C2, now L-14) |
| Alert coverage becomes noisy / fatigue-inducing | Medium | Medium | Define each alert with SLO-style intent, severity, routing, and dedupe in the runbook before enabling |

## Open Questions

1. Bundler source-map plugin for tsup: `@sentry/esbuild-plugin` works at
   esbuild level; does tsup expose an esbuild-plugin hook cleanly, or do
   we stay with the post-build shell script?
2. Feature-flag provider: user confirmed generic support only; when a
   provider is chosen, do we still prefer `featureFlagsIntegration` or
   a provider-specific one (`growthbookIntegration`, etc.)?
3. Widget Sentry: `@sentry/browser` (smaller, framework-agnostic) or
   `@sentry/react` (React-aware, larger)? The widget is React — decide
   at L-12 based on bundle-size measurement.
4. AI instrumentation: the adapter should expose the wrappers via a
   narrow surface, but what does that surface look like before any
   Oak MCP tool actually calls an LLM? Defer the API shape until the
   first real consumer.

## Promotion Trigger

Each per-branch executable lane (MCP now, Search CLI next) is promoted
when:

- The previous branch's executable lane has merged, or
- The current branch requires the next lane to close its value
  proposition (e.g. alerting cannot close until enough signal is
  flowing).

## Related Plans

- `active/sentry-otel-integration.execution.plan.md` — parent foundation
  authority.
- `active/sentry-observability-maximisation-mcp.plan.md` — this plan's
  MCP-branch executable lane.
- `active/sentry-observability-translation-crosswalk.plan.md` — will be
  updated to reflect this plan as the authoritative successor.
- `active/search-observability.plan.md` — Search CLI lane owns ES-PROP
  and CLI-metrics; maximisation mirror will be a new plan on the
  search branch.

## Execution Decisions Finalised at Promotion

Per ADR-117, strategic plans carry implementation detail as reference
only. Binding commitments — phase sequencing, acceptance criteria,
deterministic validation commands, reviewer matrix — are finalised in
the per-branch executable plans, not here.
