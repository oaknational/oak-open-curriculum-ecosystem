---
name: "Sentry and OpenTelemetry Foundation"
overview: >
  Build the shared observability foundation for Oak's canonical runtimes: the
  HTTP MCP server and the Search CLI. This work rewrites the logger around a
  coherent structured fan-out model, introduces shared telemetry redaction and
  Result-based observability config, integrates Sentry runtime support and MCP
  Insights, and defines measurable success evidence. Blocker for Milestone 2
  (Open Public Alpha).
source_strategy: "../future/observability-and-quality-metrics.plan.md"
todos:
  - id: audit-current-state
    content: "Audit the existing logger, app runtime, and starter-app-spike observability patterns"
    status: completed
  - id: sentry-specialist-capability
    content: "Create and publish the Sentry specialist reviewer/skill/rule capability"
    status: completed
  - id: adr-observability-foundation
    content: "Record the logger foundation ADR comparing coherent fan-out with a speculative async transport rewrite"
    status: completed
  - id: governance-alignment
    content: "Align milestone, strategy, workflow, and public-alpha documents with the new observability gate"
    status: completed
  - id: prompt-and-handover
    content: "Create and maintain a dedicated session prompt and deep on-disk handover record for this active plan"
    status: completed
  - id: reviewer-plan-pass
    content: "Run the full reviewer pass over the refreshed plan and prompt before trusting them as the restart source of truth"
    status: completed
  - id: logger-foundation
    content: "Rewrite @oaknational/logger around a single LogSink[] model with explicit error overloads and active-span correlation"
    status: completed
  - id: shared-observability-packages
    content: "Add shared observability, Sentry Node, and Sentry MCP packages with Result-based init/config surfaces"
    status: completed
  - id: phase-1-blocker-remediation
    content: "Resolve the 2026-03-27 blocker bundle before any runtime adoption or further Phase 1 expansion"
    status: pending
  - id: redaction-policy
    content: "Generalise header redaction into a shared telemetry redaction policy used by the logger and Sentry hooks"
    status: pending
  - id: http-adoption
    content: "Adopt the foundation in oak-curriculum-mcp-streamable-http, including cold-start init, MCP wrapping, and targeted manual spans"
    status: pending
  - id: search-cli-adoption
    content: "Adopt the foundation in oak-search-cli with runtime-config-driven logger composition, command init, spans, and shutdown flush"
    status: pending
  - id: deployment-and-evidence
    content: "Verify release/source maps, alerting baseline, MCP Insights, and produce a date-stamped evidence bundle"
    status: pending
---

# Sentry and OpenTelemetry Foundation

## Role

This is the authoritative execution source of truth for the Sentry +
OpenTelemetry foundation. Implementation facts, contracts, acceptance criteria,
execution order, and restart guidance belong here.

The paired operational prompt is intentionally thin and only points back here:
[sentry-otel-foundation.prompt.md](../../../prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md)

## Current Execution Snapshot (2026-03-27)

### Lane and state

- This plan has been promoted to the `active/` lane because implementation has
  started.
- Branch in use: `feat/full-sentry-otel-support`
- Governance, ADR, capability, and document-alignment work is complete.
- The handover bundle hardening and refreshed reviewer pass are complete.
- The initial local implementation pass for `@oaknational/logger`,
  `@oaknational/env`, `@oaknational/observability`, `@oaknational/sentry-node`,
  and `@oaknational/sentry-mcp` is on disk.
- Focused `test` and `type-check` are green across that Phase 1 surface.
- Focused `lint` is red because the shared ESLint package export map is
  currently broken.
- Phase 1 is **not** complete. The 2026-03-27 config/architecture/code-review
  pass found blocker defects that must be fixed before any HTTP or Search CLI
  adoption work starts.

### Phase 1 blocker bundle (2026-03-27 reviewer pass)

These are front-and-centre for the next session. Do not start new adoption
work until they are cleared.

Blocking defects:

1. Restore workspace linting by fixing the `@oaknational/eslint-plugin-standards`
   export map in `packages/core/oak-eslint/package.json`.
2. Remove all explicit logger compatibility layers and aliases:
   `pure-functions.ts`, legacy re-exports, `StdoutSink`, and README guidance
   that still teaches the removed API.
3. Make `SENTRY_MODE=off` and `SENTRY_MODE=fixture` true kill switches even
   when live-only env vars such as `SENTRY_DSN` or
   `SENTRY_TRACES_SAMPLE_RATE` are present.
4. Make invalid boolean env values fail closed with `Err`, never silently
   default back to enabled logging.
5. Apply the chosen long-term architectural resolution for the current
   `libs -> libs` contradiction:
   - move `@oaknational/observability` from `packages/libs/observability` to
     `packages/core/observability`
   - restore `@oaknational/logger` to depending on `core` only
   - codify an explicit layered library topology in the architecture docs and
     ESLint boundary rules so adapter libs such as `@oaknational/sentry-node`
     depend on foundation libs such as `@oaknational/logger` by rule, not by
     bespoke allow-lists
   - remove the current per-workspace sibling-lib allow-lists once that rule is
     in place

Follow-on issues to clear in the same slice once blockers are addressed:

1. Remove `vi.mock(...)` usage from the new in-process tests.
2. Extend shared redaction to scrub URL username/password credentials.
3. Replace `@sentry/node` `"*"` with an explicit manifest range.
4. Tighten `@oaknational/sentry-node` so its public init/capture surfaces model
   native Sentry types directly instead of `Record<string, unknown>` plus casts.

### Next session first actions

Start here, in this order:

1. Fix the lint blocker in `packages/core/oak-eslint/package.json` and prove
   `lint` is runnable again for `@oaknational/logger`, `@oaknational/env`,
   `@oaknational/observability`, `@oaknational/sentry-node`, and
   `@oaknational/sentry-mcp`.
2. Remove the remaining clean-break violations in `@oaknational/logger`:
   delete the compatibility shim and alias surfaces, then update the README so
   it only documents the new contract.
3. Correct `@oaknational/sentry-node` config semantics:
   - `off` and `fixture` must ignore live-only inputs rather than erroring
   - invalid boolean flags must return `Err`
4. Apply the architectural resolution, not a local exception:
   - move `@oaknational/observability` into `packages/core/`
   - update the architecture docs and ESLint boundary model to encode explicit
     foundation-lib vs adapter-lib layering
   - delete the current sibling-lib allow-lists after the layered rule exists
5. Remove `vi.mock(...)` from the new test harness and close the URL-credential
   redaction gap.
6. Rerun the focused gates for the Phase 1 surface.
7. Only after the blocker bundle is green should the work continue into
   downstream app adoption.

Preconditions already satisfied:

1. The handover bundle is cleared for restart in the review checkpoint.
2. The active plan remains the implementation authority.
3. No further plan-layer review is required before beginning
   blocker remediation.

### Authority and review state

1. This active plan is authoritative for implementation facts and execution
   detail.
2. The review checkpoint is authoritative for whether the handover bundle has
   been reviewed and cleared:
   [sentry-otel-foundation.review-checkpoint-2026-03-27.md](./sentry-otel-foundation.review-checkpoint-2026-03-27.md)
3. The prompt is an operational entry point only; it must not restate plan
   facts beyond minimal restart framing.
4. The napkin records session learnings and caveats; it is not a parallel fact
   authority.
5. Do not trust compressed session memory over this file.

### Governance and authority work already landed

1. **ADR and architecture**
   - `docs/architecture/architectural-decisions/141-coherent-structured-fan-out-for-observability.md`
2. **Sentry specialist capability surfaces**
   - `.agent/sub-agents/templates/sentry-reviewer.md`
   - `.agent/skills/sentry-expert/SKILL.md`
   - `.agent/rules/invoke-sentry-reviewer.md`
   - `.cursor/agents/sentry-reviewer.md`
   - `.claude/agents/sentry-reviewer.md`
   - `.codex/agents/sentry-reviewer.toml`
   - `.cursor/rules/invoke-sentry-reviewer.mdc`
   - `.claude/rules/invoke-sentry-reviewer.md`
   - `.cursor/skills/sentry-expert/SKILL.md`
3. **Workflow and reviewer discovery alignment**
   - `.agent/directives/AGENT.md`
   - `.agent/directives/invoke-code-reviewers.md`
   - `.agent/practice-context/outgoing/reviewer-system-guide.md`
   - `docs/engineering/workflow.md`
   - `docs/governance/development-practice.md`
4. **Milestone and strategy alignment**
   - `.agent/plans/high-level-plan.md`
   - `.agent/milestones/README.md`
   - `.agent/milestones/m2-extension-surfaces.md`
   - `.agent/milestones/m3-tech-debt-and-hardening.md`
   - `docs/foundation/strategic-overview.md`
   - `docs/foundation/VISION.md`
   - `.agent/plans/user-experience/public-alpha-experience-contract.md`
   - `.agent/plans/user-experience/roadmap.md`
5. **Collection and capability indexes**
   - `.agent/plans/architecture-and-infrastructure/README.md`
   - `.agent/plans/architecture-and-infrastructure/current/README.md`
   - `.agent/plans/agentic-engineering-enhancements/README.md`
   - `.agent/plans/agentic-engineering-enhancements/current/README.md`
   - `.agent/plans/agentic-engineering-enhancements/roadmap.md`

### Implementation reality after the initial Phase 1 pass

1. `packages/libs/logger`
   - `UnifiedLogger` has been rewritten around `readonly LogSink[]`.
   - explicit `NormalizedError` overloads and active-span correlation now exist.
   - the remaining problems are the deliberate compatibility shim/alias
     surfaces and test harness use of `vi.mock(...)`.
2. `packages/core/env`
   - `SentryEnvSchema` and its unit tests now exist.
3. `packages/libs/observability`
   - the workspace exists and provides shared redaction plus active-span
     helpers.
   - the current known gap is URL username/password redaction.
4. `packages/libs/sentry-node`
   - the workspace exists with discriminated config building, fixture runtime,
     sink helpers, and bounded flush helpers.
   - the current known gaps are kill-switch semantics for `off`/`fixture`,
     invalid-boolean fail-open behaviour, wildcard `@sentry/node`, and an
     over-erased SDK type boundary.
5. `packages/libs/sentry-mcp`
   - the workspace exists and remains transport-agnostic.
   - the current known gap is `vi.mock(...)` in the test harness.
6. Focused validation
   - `test` and `type-check` are green for `@oaknational/logger`,
     `@oaknational/env`, `@oaknational/observability`,
     `@oaknational/sentry-node`, and `@oaknational/sentry-mcp`.
   - `lint` is red for the same surface until the shared ESLint export-map
     defect is fixed.
7. Adoption scope confirmation
   - `apps/oak-curriculum-mcp-stdio` remains deprecated per ADR-128 and is not
     an adoption target.

### `starter-app-spike` inputs already reviewed

The following files were inspected and mined for useful patterns from the
sibling `starter-app-spike` repo:

1. `src/lib/logger/src/sentry-sink.ts`
2. `src/lib/logger/src/breadcrumb-adapters.ts`
3. `src/lib/logger/src/trace-context.ts`
4. `src/lib/config/internal/helpers/observability.ts`
5. `src/lib/error-tracking/ErrorTrackingAdapter.ts`
6. `src/lib/error-tracking/SentryErrorTrackingAdapter.ts`
7. `src/lib/error-tracking/ConsoleErrorTrackingAdapter.ts`
8. `src/lib/observability/spans.ts`

## Governing Principles

1. **We always choose long-term architectural excellence over expediency.**
2. **Ask the first question**: could this be simpler without compromising
   quality?
3. **Use `Result<T, E>` wherever reasonable** for config and initialisation
   surfaces.
4. **Treat `starter-app-spike` as a pattern source, not an authority.**
5. **Do not invest in the deprecated standalone stdio MCP workspace.**
6. **`SENTRY_MODE=off` is the default and immediate kill switch.**
7. **Fail closed on invalid live Sentry config.**
8. **Protect privacy before convenience**: no payload capture, no raw secrets,
   and no implicit outbound trace propagation to third parties.

## Explicit Adoption Boundary

Implementation targets:

1. `packages/libs/logger`
2. `packages/libs/observability`
3. `packages/libs/sentry-node`
4. `packages/libs/sentry-mcp`
5. `packages/core/env`
6. `apps/oak-curriculum-mcp-streamable-http`
7. `apps/oak-search-cli`

Not an adoption target:

1. `apps/oak-curriculum-mcp-stdio`
2. Minimal compile-preserving compatibility edits are allowed there only if a
   shared API change makes them unavoidable; do not add new observability
   runtime features to that workspace.

## Milestone Position

**Explicit blocker for Milestone 2 (Open Public Alpha).**

This work is no longer treated as a Milestone 3-only concern. The public-alpha
service needs a real observability foundation, not just ad hoc local logs, in
order to be supportable once it opens more broadly. Milestone 3 still carries
additional operational hardening and alert verification work, but the shared
foundation defined here must land before M2 exit.

## Scope

Explicitly out of scope for implementation:

1. `apps/oak-curriculum-mcp-stdio` — deprecated per ADR-128
2. Browser or edge Sentry runtimes
3. Separate OpenTelemetry SDK providers or auto-instrumentation packages

### Problem Statement

Oak has ADR-051 single-line OpenTelemetry JSON logging, but it does not yet
have:

1. a coherent multi-sink logger model,
2. a shared telemetry redaction barrier,
3. active-span log correlation,
4. typed Sentry runtime wiring,
5. MCP Insights wrapping and capture policy,
6. deployment-grade observability evidence.

The previous logger shape (`stdoutSink` + `fileSink`) was too narrow for this
phase, and the Search CLI still relies on mutable logger-global configuration.

## Chosen Architecture

Per
[ADR-141](../../../docs/architecture/architectural-decisions/141-coherent-structured-fan-out-for-observability.md),
the foundation is:

1. **Coherent structured fan-out**, not a speculative async transport rewrite
2. `OtelLogRecord` as the canonical internal currency
3. `sinks: readonly LogSink[]` as the final logger model
4. explicit `Logger.error` / `Logger.fatal` overloads:
   - `(message, context?)`
   - `(message, error: NormalizedError, context?)`
5. active OpenTelemetry span context for `TraceId` / `SpanId` when present,
   falling back to correlation-id hashing only when no active span exists
6. one logger-level redaction barrier before any sink sees data
7. no compatibility layers, aliases, or fallback exports survive the accepted
   Phase 1 exit state

## Execution Phases

### Phase 0: Governance and handover hardening

Status: complete.

Completed outcomes:

1. Sentry specialist capability triplet and discovery surfaces exist.
2. ADR-141 records the architectural decision.
3. Milestone, strategy, workflow, and public-alpha docs now treat this work as
   an M2 blocker.
4. Active plan, thin prompt, and review checkpoint now form the handover
   bundle.

Exit criteria:

1. The plan/prompt/checkpoint bundle survives session compression cleanly.
2. The reviewer matrix has re-checked the refreshed bundle and the checkpoint
   records the result.

Next phase:

1. Continue Phase 1 with blocker remediation, then resume runtime adoption.

### Phase 1: RED shared contracts and regression harness

Status: code and harness landed locally, but acceptance is blocked by the
Phase 1 blocker bundle above.

Proofs now on disk:

1. Golden tests that lock current `@oaknational/logger` JSON output semantics.
2. Negative type tests for `logger.error` / `logger.fatal` misuse and
   `normalizeError()` boundaries.
3. Config tests for `SENTRY_MODE=off|fixture|sentry`, including
   fail-closed `Err` behaviour for invalid live config.
4. Redaction tests covering nested JSON, URLs, query strings, request
   bodies, CLI args, env-derived config, breadcrumb extras, span attributes,
   and log payloads.
5. MCP capture-policy tests proving deny-by-default metadata-only
   capture.

Blocking exit criteria before this phase can be treated as complete:

1. The config booleans fail closed instead of silently defaulting.
2. `off` and `fixture` behave as real kill switches even when live-only env
   inputs are present.
3. The in-process test harness no longer uses `vi.mock(...)`.
4. The remaining compatibility shim/alias surfaces are deleted.

Deterministic validation commands:

1. `pnpm --filter @oaknational/logger test`
2. `pnpm --filter @oaknational/logger type-check`
3. `pnpm --filter @oaknational/logger lint`
4. `pnpm --filter @oaknational/env test`
5. `pnpm --filter @oaknational/env type-check`
6. `pnpm --filter @oaknational/env lint`

### Phase 2: GREEN shared foundation

Status: initial package creation is complete, but this phase is still open
until the blocker bundle is resolved and the focused lint/test/type-check
surface is green together.

Implement the shared packages and logger rewrite:

1. Add `@oaknational/observability`, `@oaknational/sentry-node`, and
   `@oaknational/sentry-mcp`.
2. Rewrite `@oaknational/logger` around `readonly LogSink[]`.
3. Add discriminated-union Sentry env parsing and shared config building.
4. Centralise telemetry redaction, active-span correlation, and release
   resolution.

Deterministic validation commands:

1. `pnpm --filter @oaknational/logger test`
2. `pnpm --filter @oaknational/logger type-check`
3. `pnpm --filter @oaknational/logger lint`
4. `pnpm --filter @oaknational/observability test`
5. `pnpm --filter @oaknational/observability type-check`
6. `pnpm --filter @oaknational/observability lint`
7. `pnpm --filter @oaknational/sentry-node test`
8. `pnpm --filter @oaknational/sentry-node type-check`
9. `pnpm --filter @oaknational/sentry-node lint`
10. `pnpm --filter @oaknational/sentry-mcp test`
11. `pnpm --filter @oaknational/sentry-mcp type-check`
12. `pnpm --filter @oaknational/sentry-mcp lint`
13. `pnpm --filter @oaknational/env test`
14. `pnpm --filter @oaknational/env type-check`
15. `pnpm --filter @oaknational/env lint`

### Phase 3: GREEN runtime adoption

Adopt the shared foundation in the in-scope runtimes only:

1. HTTP MCP server: cold-start init, stdout JSON retained, per-request MCP
   wrapping, manual spans for bootstrap, asset-download proxy, and OAuth
   upstream flows.
2. Search CLI: runtime-config-driven logger composition, command-scope Sentry
   init, ingest root/phase spans, bounded flush on success/failure/interrupted
   exits.

Deterministic validation commands:

1. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`
2. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`
3. `pnpm --filter @oaknational/search-cli test`
4. `pnpm --filter @oaknational/search-cli test:e2e`

### Phase 4: VERIFY evidence, regression, and review

Required closing proof:

1. Date-stamped evidence bundle under
   `.agent/plans/architecture-and-infrastructure/evidence/`
2. Repo-wide regression gate after the shared logger rewrite
3. Full reviewer matrix over the runtime implementation

Deterministic validation commands:

1. `pnpm qg`
2. `pnpm practice:fitness`
3. `pnpm markdownlint:root`
4. `pnpm subagents:check`
5. `pnpm portability:check`

## Shared Contracts

### Environment Contract

`@oaknational/env` must expose a shared `SentryEnvSchema` with the canonical
contract:

- `SENTRY_MODE=off|fixture|sentry`
- `SENTRY_DSN`
- `SENTRY_ENVIRONMENT`
- `SENTRY_RELEASE`
- `SENTRY_TRACES_SAMPLE_RATE`
- `SENTRY_ENABLE_LOGS`
- `SENTRY_SEND_DEFAULT_PII`
- `SENTRY_DEBUG`

Profiling is intentionally omitted from v1 unless the Sentry specialist
confirms current SDK support and a concrete Oak use.

### Logger Contract

The shared sink boundary must be exported as an exact, readonly contract, not
left as prose:

```ts
type LogContextScalar = string | number | boolean | null;

type LogContextValue =
  | LogContextScalar
  | readonly LogContextValue[]
  | { readonly [key: string]: LogContextValue };

type LogContext = { readonly [key: string]: LogContextValue };

interface NormalizedError {
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
  readonly cause?: NormalizedError;
  readonly metadata?: LogContext;
}

interface LogEvent {
  readonly level: LogLevel;
  readonly message: string;
  readonly context: LogContext;
  readonly error?: NormalizedError;
  readonly otelRecord: OtelLogRecord;
  readonly line: string;
}

interface LogSink {
  write(event: LogEvent): void;
}
```

Required invariants:

1. `OtelLogRecord` remains the canonical internal record.
2. The serialised `line` is derived once from the canonical structured record.
3. Sink implementations must treat `LogEvent` as immutable input.
4. `normalizeError()` must return a package-owned `NormalizedError`, not a raw
   `Error` or ad hoc object.

### Error-call Contract

Only these public call shapes are allowed:

1. `(message, context?)`
2. `(message, error: NormalizedError, context?)`

Required enforcement:

1. Add negative type tests so `logger.error("x", unknownValue)` and ambiguous
   `Error | LogContext` call paths fail at compile time.
2. Require callers to convert unknown caught values through `normalizeError()`
   before they may be passed as errors.

### Correlation Contract

1. When an active span exists, log records must use that span context for
   `TraceId`, `SpanId`, and `TraceFlags`.
2. Fallback correlation-id hashing is allowed only when no active span exists.
3. Only system-generated, non-sensitive correlation identifiers may be hashed.
   Never hash user-provided payload fragments, query values, tokens, emails, or
   opaque external identifiers.

### Sentry Config Contract

The parsed env/config surface must be a discriminated union keyed by
`SENTRY_MODE`:

```ts
type SentryMode = "off" | "fixture" | "sentry";

interface SentryOffConfig {
  readonly mode: "off";
  readonly environment: string;
  readonly release: string;
  readonly enableLogs: false;
  readonly sendDefaultPii: false;
  readonly debug: false;
}

interface SentryFixtureConfig {
  readonly mode: "fixture";
  readonly environment: string;
  readonly release: string;
  readonly enableLogs: boolean;
  readonly sendDefaultPii: false;
  readonly debug: boolean;
}

interface SentryLiveConfig {
  readonly mode: "sentry";
  readonly dsn: string;
  readonly environment: string;
  readonly release: string;
  readonly tracesSampleRate: number;
  readonly enableLogs: boolean;
  readonly sendDefaultPii: false;
  readonly debug: boolean;
}

type ParsedSentryConfig =
  | SentryOffConfig
  | SentryFixtureConfig
  | SentryLiveConfig;
```

Mode-specific rules are owned by a single shared config builder in
`@oaknational/sentry-node`, not by app-local wiring:

| Mode | Required input | Forbidden input | Defaults / behaviour |
|---|---|---|---|
| `off` | none | none | `environment` and `release` resolved by the shared builder, `enableLogs=false`, `sendDefaultPii=false`, `debug=false`, no Sentry init, no Sentry sink, no outbound delivery; any live-only DSN/sample-rate inputs are ignored rather than treated as fatal |
| `fixture` | none | none | `environment` and `release` resolved by the shared builder, `enableLogs=true` unless explicitly disabled, `sendDefaultPii=false`, `debug=false`, local fixture capture only, no network, no requirement to run the live Sentry SDK transport or sampler; any live-only DSN/sample-rate inputs are ignored rather than treated as fatal |
| `sentry` | valid `SENTRY_DSN`, valid `SENTRY_TRACES_SAMPLE_RATE` | none beyond v1 forbiddance of `SENTRY_SEND_DEFAULT_PII=true` | `environment` and `release` resolved by the shared builder, `enableLogs=true` unless explicitly disabled, `sendDefaultPii=false`, `debug=false`, live Sentry init permitted |

Required `Result` discipline:

```ts
type ObservabilityConfigError =
  | { readonly kind: "invalid_sentry_mode"; readonly value: string }
  | { readonly kind: "missing_sentry_dsn" }
  | { readonly kind: "invalid_sentry_dsn"; readonly value: string }
  | { readonly kind: "invalid_traces_sample_rate"; readonly value: string }
  | { readonly kind: "send_default_pii_forbidden" }
  | { readonly kind: "missing_release_for_live_mode" };
```

1. `createSentryConfig()` and `initialiseSentry()` return `Result<T, E>` with
   package-owned closed error unions.
2. `SENTRY_MODE=sentry` with missing or invalid `SENTRY_DSN`, or invalid
   `SENTRY_TRACES_SAMPLE_RATE`, must return `Err` and block initialisation.
3. `SENTRY_SEND_DEFAULT_PII=true` is invalid in v1 and must return `Err` unless
   a future security-reviewed ADR explicitly changes that rule.
4. `SENTRY_MODE=off` must prove that no Sentry init, outbound delivery, or sink
   registration occurs in either in-scope runtime.
5. `SENTRY_MODE=off` and `SENTRY_MODE=fixture` must never fail merely because
   live-only inputs are present; those values are ignored when the mode is not
   `sentry`.
6. Boolean flags are exact: any non-empty value other than literal
   `true|false` must return `Err`, not silently default.
7. `SENTRY_MODE=fixture` is a no-network local fallback path, not a disguised
   live-Sentry mode. It exercises Oak's observability adapters, redaction, MCP
   metadata policy, and correlation flow without requiring a real DSN or live
   Sentry tracing sampler.
8. `environment` and `release` are resolved only by the shared builder, never
   by app-local fallback logic.

### Environment Resolution Contract

Environment resolution is owned by the same shared builder and must be total
and deterministic for every runtime:

1. `SENTRY_ENVIRONMENT` if present and non-empty
2. `VERCEL_ENV` if present and non-empty
3. `NODE_ENV` if present and non-empty
4. `development`

Additional rules:

1. Empty strings are treated as absent input, not as fatal config errors.
2. The resolved environment value is normalised once in the shared builder and
   reused by both in-scope runtimes.
3. Apps may not apply their own secondary environment-tag defaults.

### Release Resolution Contract

Release resolution is deterministic across HTTP, Search CLI, CI, and local
shells. The only accepted precedence is:

1. `SENTRY_RELEASE`
2. `VERCEL_GIT_COMMIT_SHA`
3. `GITHUB_SHA`
4. `COMMIT_SHA`
5. `SOURCE_VERSION`
6. `npm_package_version`
7. `local-dev` for `off` and `fixture` only

Additional rules:

1. The shared builder records which source won so diagnostics and tests can
   assert the decision.
2. Do not shell out to `git` at runtime.
3. Source-map, release, and deployment evidence must all prove the same release
   string.
4. `SENTRY_MODE=sentry` must return
   `Err { kind: "missing_release_for_live_mode" }` if none of the live-mode
   release sources resolve.
5. `SENTRY_MODE=off` and `SENTRY_MODE=fixture` must never fail because release
   metadata is absent; they fall back to the literal `local-dev`.

### Node Runtime Init Strategy

For v1, Oak chooses **manual tracing plus explicit composition-root init**, not
automatic preload-based Node instrumentation.

Required consequences:

1. HTTP initialises Sentry in its composition root before app creation and
   before the MCP server factory is exercised.
2. Search CLI initialises Sentry once per command entry point before the
   command body runs.
3. Success criteria for tracing are limited to explicit manual spans and MCP
   wrapper spans defined in this plan.
4. If Oak later wants automatic Node instrumentation, that work requires a new
   ADR or ADR amendment covering preload-module strategy, changed success
   criteria, and the interaction with Oak's "no auto-instrumentation packages"
   rule.

### Redaction and Outbound Telemetry Contract

The single telemetry redaction barrier must cover every forwarded observability
surface:

1. logger sink input
2. Sentry `beforeSend`
3. Sentry `beforeSendTransaction`
4. Sentry `beforeSendSpan`
5. Sentry `beforeSendLog`
6. breadcrumb filtering

Coverage must be recursive and include:

1. headers
2. tokens, cookies, auth codes, API keys, and bearer/basic credentials
3. URLs and query strings
4. nested JSON objects and arrays
5. request and response bodies
6. CLI arguments
7. env-derived config
8. breadcrumb extras, event extras, span attributes, and forwarded log payloads

Outbound propagation policy:

1. `tracePropagationTargets` is deny-by-default.
2. v1 default is no third-party propagation from the HTTP runtime or Search
   CLI.
3. Any future allowlist must be explicit, limited to Oak-controlled targets,
   security-reviewed, and documented in this plan or its successor.
4. The HTTP `/mcp` transport must not allow raw JSON-RPC request or response
   bodies, headers, or envelope fields to be captured by generic Sentry HTTP
   request collection. Sanitise or suppress request capture before Sentry sees
   the streamable-HTTP payload.

### MCP Metadata Contract

The deny-by-default MCP capture policy must compile down to a closed metadata
type, not a freeform bag:

```ts
type MergedMcpObservationKind = "tool" | "resource" | "prompt";
type MergedMcpObservationStatus = "success" | "error";

interface MergedMcpObservation {
  readonly kind: MergedMcpObservationKind;
  readonly name: string;
  readonly status: MergedMcpObservationStatus;
  readonly durationMs: number;
  readonly service: string;
  readonly environment: string;
  readonly release: string;
  readonly traceId?: string;
  readonly spanId?: string;
}
```

Required invariants:

1. `recordInputs=false` and `recordOutputs=false` everywhere by default.
2. No payload-bearing freeform extras are allowed in the MCP capture adapter.
3. Any future payload allowlist requires explicit security review and plan
   update.

### Package Boundaries

- **Chosen layered resolution for long-term architecture**
  - `@oaknational/observability` is a provider-neutral primitive and belongs in
    `packages/core/observability`, not `packages/libs/`
  - `@oaknational/logger` is the foundation runtime library layer and should
    depend only on `core`
  - `@oaknational/sentry-node` is an adapter library above `logger`, so the
    architecture and ESLint rules must encode that relationship explicitly
    instead of relying on per-package allow-lists
  - `@oaknational/sentry-mcp` should depend only on `core` observability
    primitives and MCP abstractions
- `@oaknational/observability` (target end state: `packages/core/observability`)
  - provider-neutral helpers
  - shared telemetry redaction
  - span helpers built only on `@opentelemetry/api`
- `@oaknational/sentry-node`
  - Sentry init/flush helpers
  - Sentry sinks
  - handled-error capture adapters
  - fixture-mode no-network capture helpers
  - release resolution and config builder
- `@oaknational/sentry-mcp`
  - MCP wrapping helpers
  - deny-by-default capture policy helpers
  - must stay transport-agnostic and depend on MCP server abstractions only
  - must not depend on Express or `StreamableHTTPServerTransport`

## Runtime Acceptance Matrix

| Runtime | Mode | Required behaviour |
|---|---|---|
| HTTP MCP server | `off` | stdout JSON only; no Sentry init; no Sentry sinks; no outbound delivery; no trace propagation |
| HTTP MCP server | `fixture` | stdout JSON plus fixture sink/adapter; no network; MCP wrapper active with metadata-only capture via local fallback adapter; provider-neutral manual spans and correlation still exercised locally; raw `/mcp` envelopes suppressed or sanitised before request capture |
| HTTP MCP server | `sentry` | stdout JSON retained; live Sentry sink/adapter; manual spans for bootstrap, asset-download proxy, OAuth upstream; MCP wrapper active; outbound trace propagation remains deny-by-default unless explicitly allowlisted; raw `/mcp` envelopes suppressed or sanitised before request capture |
| Search CLI | `off` | local logger only; no Sentry init; no Sentry sinks; no outbound delivery; no trace propagation |
| Search CLI | `fixture` | local logger plus fixture sink/adapter; no network; root/phase spans exercised through local fallback adapters; bounded shutdown path still executed |
| Search CLI | `sentry` | live Sentry init once per command; root/phase spans for ingest; bounded flush on success, failure, and interrupted exits; outbound trace propagation remains deny-by-default unless explicitly allowlisted |

## Workstreams

### WS1: Governance and Authority

1. Keep the Sentry specialist capability discoverable before implementation.
2. Keep the active plan authoritative, the prompt thin, and the checkpoint
   authoritative for review state.
3. Keep collection, milestone, and strategy docs aligned to the M2-blocker
   reality.

### WS2: Logger Foundation

1. Rewrite `@oaknational/logger` around `LogSink[]`.
2. Preserve current JSON output semantics as a regression baseline.
3. Add explicit error overloads and remove legacy sink special-casing.
4. Guarantee per-sink failure isolation.
5. Keep sink writes synchronous and fast.

### WS3: Shared Observability and Policy

1. Add the shared telemetry redaction policy.
2. Add active-span trace context helpers.
3. Add `Result`-based Sentry config and init surfaces with a discriminated
   union.
4. Add deterministic release resolution with the explicit precedence contract.
5. Enforce deny-by-default trace propagation and MCP metadata capture.
6. Finish the structural move of provider-neutral observability into `core`
   and encode the resulting library tiers in the architecture docs and ESLint
   boundary rules.

### WS4: HTTP MCP Server Adoption

1. Initialise Sentry at cold start in the composition root before app creation.
2. Keep stdout JSON logging as the canonical local log surface.
3. Add Sentry sink(s) and handled-error capture.
4. Wrap each per-request MCP server inside `mcpFactory`.
5. Add targeted manual spans for cold-start bootstrap, asset-download proxy,
   and OAuth upstream flows.
6. Keep Sentry lifecycle at the process boundary only:
   - never initialise Sentry inside per-request MCP server creation
   - never flush or shut down Sentry on per-request server/transport teardown
   - HTTP flush belongs only to process shutdown or explicit deployment hooks

### WS5: Search CLI Adoption

1. Replace mutable logger-global configuration with runtime-config-driven
   composition rooted in validated env.
2. Initialise Sentry once per command or script entry point.
3. Add root and phase spans for ingest.
4. Prove bounded drain on command completion, failure, and interrupted exits.

### WS6: Deployment and Proof

1. Configure DSN, release tagging, and source-map upload paths.
2. Define an initial alerting baseline.
3. Verify MCP Insights with metadata-only capture.
4. Produce the evidence bundle under
   `.agent/plans/architecture-and-infrastructure/evidence/`.

## Security and Privacy Doctrine

1. `recordInputs=false` and `recordOutputs=false` by default everywhere
2. The only retained MCP metadata is:
   - tool/resource/prompt name
   - success/failure
   - latency
   - service identity
   - environment
   - release
   - correlation/trace identifiers
3. Search CLI and other operational paths remain opt-in and must not leak
   secrets, tokens, cookies, auth codes, API keys, or secret-bearing URLs
4. The logger-level redaction policy must also back:
   - `beforeSend`
   - `beforeSendTransaction`
   - `beforeSendSpan`
   - `beforeSendLog`
   - breadcrumb filtering
5. Evidence artefacts stored in-repo must be scrubbed summaries only. Do not
   store raw event exports, raw payload dumps, captured tokens, cookies, or
   full unsanitised stack/event JSON.

## Success Measures

### Automated Proof

The foundation is not complete until automated verification includes:

1. fake-Sentry contract tests with no network
2. golden regression tests for current logger output
3. redaction tests with known-bad secret/PII fixtures
4. runtime integration tests for both in-scope runtimes across
   `off | fixture | sentry`
5. compile-time/type enforcement for `logger.error` and `logger.fatal`
6. trace-correlation proof that logs emitted during wrapped MCP tool, resource,
   and prompt calls share the same trace context as the corresponding MCP span
7. sink failure isolation and protocol-safety proof
8. explicit kill-switch proof that `SENTRY_MODE=off` disables Sentry init,
   sink registration, outbound delivery, and trace propagation
9. bounded-drain proof for Search CLI success, failure, and interrupted exits
10. repo-wide regression proof after the logger rewrite (`pnpm qg`)
11. HTTP transport proof that generic request capture does not retain raw `/mcp`
   JSON-RPC envelopes

### Manual and Deployment Proof

The evidence bundle must show:

1. one info log
2. one handled error
3. one unhandled exception
4. one traced MCP call
5. correct release tag
6. resolved source-map stack trace
7. alerting baseline wiring
8. kill-switch rehearsal (`SENTRY_MODE=off`)
9. MCP Insights populated with metadata only
10. release-resolution source used by the shared builder
11. evidence hygiene notes confirming that only scrubbed artefacts were stored

## External Dependencies

Sentry org/project access may lag the code work. If so:

1. local and integration evidence can still proceed,
2. fake-Sentry contract tests remain mandatory,
3. the public-alpha gate stays open until live Sentry verification is complete.

## Restart Bundle

If session context compresses again, re-ground from these files in order:

1. this active plan
2. [sentry-otel-foundation.prompt.md](../../../prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md)
3. [sentry-otel-foundation.review-checkpoint-2026-03-27.md](./sentry-otel-foundation.review-checkpoint-2026-03-27.md)
4. [observability-and-quality-metrics.plan.md](../future/observability-and-quality-metrics.plan.md)
5. [ADR-141](../../../docs/architecture/architectural-decisions/141-coherent-structured-fan-out-for-observability.md)
6. [testing-strategy.md](../../../directives/testing-strategy.md)
7. [schema-first-execution.md](../../../directives/schema-first-execution.md)
8. `packages/libs/logger/src/unified-logger.ts`
9. `packages/libs/logger/src/types.ts`
10. `packages/libs/logger/src/otel-format.ts`
11. `apps/oak-curriculum-mcp-streamable-http/src/application.ts`
12. `apps/oak-curriculum-mcp-streamable-http/src/logging/index.ts`
13. `apps/oak-search-cli/src/runtime-config.ts`
14. `apps/oak-search-cli/src/lib/logger.ts`
15. `apps/oak-search-cli/src/lib/elasticsearch/setup/ingest.ts`

## Review Requirement

Before trusting this plan/prompt pair as the execution baseline, run the full
reviewer pass requested by the project owner after any material bundle refresh,
including:

1. code-reviewer
2. all four architecture reviewers
3. test-reviewer
4. type-reviewer
5. config-reviewer
6. security-reviewer
7. docs-adr-reviewer
8. mcp-reviewer
9. sentry-reviewer

Review-state authority is recorded in:
[sentry-otel-foundation.review-checkpoint-2026-03-27.md](./sentry-otel-foundation.review-checkpoint-2026-03-27.md)

## Reference Inputs

- [ADR-051](../../../docs/architecture/architectural-decisions/051-opentelemetry-compliant-logging.md)
- [ADR-078](../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md)
- [ADR-128](../../../docs/architecture/architectural-decisions/128-stdio-workspace-retirement-and-http-transport-consolidation.md)
- [ADR-141](../../../docs/architecture/architectural-decisions/141-coherent-structured-fan-out-for-observability.md)
- [Sentry specialist capability](../../agentic-engineering-enhancements/current/sentry-specialist-capability.plan.md)
- Sibling `starter-app-spike` reference implementation (pattern source only)
