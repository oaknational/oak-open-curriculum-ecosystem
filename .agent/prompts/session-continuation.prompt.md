---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-17
---

# Session Continuation

## Ground First

1. Read and internalise:
   - `.agent/directives/AGENT.md`
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Scan the [Start Here: 5 ADRs in 15 Minutes](../../docs/architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes)
   block in the ADR index, and open any ADR whose slug matches your current
   workstream from the [full ADR index](../../docs/architecture/architectural-decisions/README.md).
3. Read `.agent/memory/distilled.md` and `.agent/memory/napkin.md`
4. Read the active plan for your workstream (see below) — **read
   Appendix A in full before anything else**
5. Read the Sentry-relevant ADRs you will touch on day one:
   - [`docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md`](../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
   - [`docs/architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md`](../../docs/architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md)
   - [`docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md`](../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md)
   - [`docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md`](../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md)
6. Read the existing Sentry surface docs:
   - [`packages/libs/sentry-node/README.md`](../../packages/libs/sentry-node/README.md)
     (currently a 4-line stub — L-DOC will expand it, not write it new)
   - [`docs/operations/sentry-cli-usage.md`](../../docs/operations/sentry-cli-usage.md)
   - [`docs/operations/sentry-deployment-runbook.md`](../../docs/operations/sentry-deployment-runbook.md)
7. **Read the actual composition root before framing observability work.**
   Specifically: `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts`
   and `apps/oak-curriculum-mcp-streamable-http/src/index.ts`. What Sentry
   already does for this app must be inferred from code, not from SDK
   documentation alone. This session added that rule to distilled after
   a false-miss on `wrapMcpServerWithSentry`.
8. Re-establish live branch state:

```bash
git status --short
git log --oneline --decorate -10
```

## This Prompt's Role

- Operational entry point only.
- Active plans are authoritative for scope, sequencing, acceptance criteria,
  and validation.
- If prompt text conflicts with active plans, active plans win.

## Live Continuity Contract

- **Workstream**: Sentry Observability Maximisation — MCP app (server +
  browser widget) on the current branch; Search CLI mirror on the next
  branch.
- **Branch**: `feat/otel_sentry_enhancements`.
- **Active executable plan**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-observability-maximisation-mcp.plan.md`
    (authoritative execution source for the MCP branch).
- **Strategic parent brief**:
  - `.agent/plans/architecture-and-infrastructure/future/sentry-observability-maximisation.plan.md`
    (full envelope across both runtimes).
- **Parent foundation authority**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
    (closure lane — foundation done 2026-04-17; alert rule 521866 validated).
- **Superseded**:
  - `.agent/plans/architecture-and-infrastructure/archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md`
    — replaced 2026-04-17 by the maximisation pivot. Do not use for
    decisions.
- **Related**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-observability-translation-crosswalk.plan.md`
    (will be updated to reference the maximisation plan as successor).
  - `.agent/plans/architecture-and-infrastructure/active/search-observability.plan.md`
    (sibling; owns ES-PROP + CLI-metrics; search branch will gain its own
    maximisation plan).
  - `.agent/plans/architecture-and-infrastructure/future/codex-mcp-server-compatibility.plan.md`
    (strategic follow-up; not executable yet; separate branch).
  - `.agent/plans/architecture-and-infrastructure/future/clerk-cli-adoption.plan.md`
    (strategic follow-up extending the ADR-159 pattern to Clerk; separate
    lane after Sentry work).
- **Current state (2026-04-17, commit `d08c6969`)**: L-0a (ground-truth
  correction) and L-0b (ADR-160 test gate) both closed. ADR-160 and
  ADR-161 Accepted. ADR-143 §6 status line records supersession.
  Appendix A.2's 15 structural corrections applied. §A.6 Reviewer
  Findings Register records all 29 findings from the close-of-session
  reviewer matrix (18 ACTIONED, 11 TO-ACTION with owning lane, 0
  REJECTED). `pnpm check` from repo root exit 0, 88/88 tasks green.
  `packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts`
  landed (18 tests). `SentryRedactionHooks` exported from
  `runtime-sdk.ts`; `SentryLogPayload` / `SentrySpanPayload` exported
  from `types.ts`.
- **Current objective**: open L-1 (free-signal integrations) next.
  L-1 has a prerequisite step named in its body (per A.6 AR-3): fixture
  runtime must route non-event envelopes through the same `beforeSend*`
  composition the live SDK uses before the integration behaviour
  assertions can land. Expect L-1 to take longer than a naive "turn on
  six integrations" estimate.
- **Phase 1 remainder scheduled** (all lanes un-started, none dropped):
  - **L-1** free-signal integrations (ANR, Zod, node-runtime, span-
    streaming, rewrite-frames, extraErrorData) — opens first; has
    fixture envelope-observability prerequisite.
  - **L-2** `createSentryDelegates` extraction into
    `@oaknational/sentry-node` — structural-intersection acceptance
    test required (A.6 AF-3).
  - **L-DOC initial** expand `packages/libs/sentry-node/README.md`
    from 4-line stub + write `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`.
    Owner-only edit to `.agent/directives/AGENT.md § Essential Links`
    at lane close (exact diff recorded in §A.6 of the executable plan).
  - **L-EH initial** author `require-error-cause` ESLint rule with
    expanded RuleTester cases.
- **Recent surprises / corrections (2026-04-17)**:
  - **"Stretch" is not scope.** First summary labelled L-1 / L-2 /
    L-DOC-initial / L-EH-initial as "stretch" and then "dropped" them
    under pacing pressure. Owner correction: they are Phase 1 features
    of the executable plan, not optional add-ons; "un-started" is the
    honest framing. Session plan reworded.
  - **Nothing is deferred without a named lane.** First A.6 draft
    used a "deferred as follow-ups" block for 11 reviewer findings.
    Owner correction: plan to address all findings unless explicitly
    rejected; each gets an owning lane + specific edit. Register
    rewritten as ACTIONED / TO-ACTION / REJECTED.
  - **Test-file "RED by non-existence" overstates TDD.** Reviewer
    pointed out that parts 1–3 of the L-0b conformance test were
    retroactive assertion against existing code, not TDD. Bypass
    section remains credible RED-on-change. File header now
    explicitly labels the conformance harness honestly.
  - **Settle-vs-propose for ADR Open Questions.** Accepting an ADR
    as-drafted while the plan body settles its Open Questions in
    prose is a procedural inversion. Resolution: ADR-160 Open
    Questions now closed in the ADR itself (package placement + per-
    consuming-workspace conformance).
  - **Tautological tests are not tests.** `BYPASS_CANDIDATES` aliased
    `BARRIER_HOOKS` and the set-equality assertion could never fail.
    Replaced with a type-level set-equality gate against
    `keyof SentryRedactionHooks`.
  - **Ground before framing** (carried): `wrapMcpServerWithSentry`
    at `core-endpoints.ts:98` — read the composition root before
    framing integration pivots.
  - **Fixture runtime does not route through hooks.** Discovered via
    sentry-reviewer + test-reviewer: `createFixtureRuntime` in
    `runtime.ts` captures directly via `store.push(...)`; it does NOT
    install or invoke the `beforeSend*` pipeline. Proof surface for
    hook behaviour is direct `createSentryInitOptions(...)` return
    invocation, not `SENTRY_MODE=fixture`. L-1 absorbs this as its
    envelope-observability prerequisite.
- **Open questions / low-confidence areas**:
  - Widget bundle-size measurement once `@sentry/browser` lands
    (L-12) — no budget set; owner chose measure-and-note.
  - `nodeRuntimeMetricsIntegration` default metric count varies
    across 10.x minors — cite Sentry docs page live when L-1 opens
    rather than fixing a number in plan prose.
  - `@sentry/profiling-node` v10 API knobs
    (`profileSessionSampleRate` + `profileLifecycle`) have not yet
    been exercised locally; L-6 RED will confirm shape before code.
  - **L-1 envelope-observability approach**: Option A (route fixture-
    mode envelopes through `createSentryHooks`) vs Option B (per-
    envelope capture paths). Option A is preferred in plan text;
    implementer confirms at lane open.
  - **Testing vocabulary deliberation** (carried from 2026-04-17).
    `testing-strategy.md` uses `unit` / `integration` / `E2E` /
    `smoke` with local definitions. Owner flagged atypical naming
    relative to industry convention. Separate deliberation, not a
    Sentry-plan concern. Relevant files: `.agent/directives/testing-strategy.md`,
    ADR-161, ADR-078.
- **Next safe step**: open L-1 in a fresh session. Begin with the
  fixture envelope-observability prerequisite (named in §L-1 of the
  executable plan); land the plumbing that routes non-event envelopes
  through `createSentryHooks`; then assert per-integration behaviour
  via fixture capture. Phase 1 per-phase reviewer matrix runs at
  phase close — do NOT bundle L-1/L-2/L-DOC-initial/L-EH-initial in
  a single un-reviewed pass.
- **Deep consolidation status**: **completed this handoff** — user
  invoked `/jc-consolidate-docs` explicitly after session-handoff
  reported "not due". Full pass ran 2026-04-17 post-commit
  `d08c6969`. Outputs:
  - **Step 5 (patterns)**: one new pattern extracted —
    `patterns/findings-route-to-lane-or-rejection.md`. Evidence
    entries appended to `patterns/ground-before-framing.md`
    (satisfies-gate overclaim instance) and
    `patterns/test-claim-assertion-parity.md` (BYPASS_CANDIDATES
    tautology instance). Three today's napkin surprises remain
    single-instance and stay in the napkin for cross-session
    validation: "stretch is not scope"; "RED-by-new-file overstates
    TDD when implementation exists"; "ADR Open Questions close in
    the ADR, not in plan prose".
  - **Step 6 (napkin)**: no rotation — 444 lines, under 500 threshold.
  - **Step 7 (graduation)**: `distilled.md` "Review scope separation"
    entry replaced with pointer to new `findings-route-to-lane-or-rejection`
    pattern. No ADR-shaped doctrine surfaced from today's observations;
    surviving ADR candidates (`@ts-expect-error` policy;
    `eslint-disable` self-justification) remain owner-deferred per
    earlier decisions.
  - **Step 8 (fitness)**: `pnpm practice:fitness:strict-hard` exit 1
    — three foundational directives remain in the hard zone
    (`AGENT.md` lines+prose-width; `principles.md` chars;
    `testing-strategy.md` lines+prose-width). All owner-deferred
    per earlier decisions; this session introduced zero new hard
    violations. `distilled.md` at 263 lines (soft zone, target 200,
    limit 275). Eight soft-zone files unchanged.
  - **Step 9 (practice exchange)**: incoming boxes empty (both
    `.agent/practice-core/incoming/` and
    `.agent/practice-context/incoming/` carry only `.gitkeep`).
    Outgoing broadcast drafted:
    `.agent/practice-context/outgoing/findings-route-to-lane-or-rejection.md`.
  - **Step 10 (experience)**: brief reflection recorded at
    `.agent/experience/2026-04-17-the-language-that-hides-scope.md`
    covering the owner-pushback rhythm (stretch → deferred) and the
    shift from triage-mindset to routing-mindset.
  - **Commit state**: consolidation edits not yet committed; working
    tree carries the new pattern file, pattern annotations, distilled
    edit, outgoing broadcast, experience entry, and continuity-contract
    updates on top of commit `d08c6969`.

## Current State (2026-04-17, post-L-0 session)

Foundation closure + L-0 (barrier-gate conformance) done on `feat/otel_sentry_enhancements`:

- Steps 1–5 of "Road to Provably Working Sentry" closed.
- Alert rule 521866 validated via `sentry api`.
- Commits landed (most recent first): `d08c6969` (l-0b + reviewer
  register), `ded99224`, `e215a879`, `724c1523`, `9c0ad424`,
  `8f33cfc0`, `f1869840`, `5356bffc`, `9c3044ff`, `40b212d4`.
  Branch is one commit ahead of remote; push pending owner
  instruction.
- Source-map upload operational via `pnpm sourcemaps:upload`
  (two-step Debug ID flow).
- MCP server is auto-instrumented via `wrapMcpServerWithSentry` at
  `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts:98`.
- Shared redaction barrier covers `beforeSend` / `beforeSendTransaction`
  / `beforeSendSpan` / `beforeSendLog` / `beforeBreadcrumb` — now
  governed by ADR-160 (supersedes ADR-143 §6 in part, Accepted
  2026-04-17) and enforced by
  `packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts`
  (18 tests, three-part closure + automated bypass validation).
- `setupExpressErrorHandler` is wired at `index.ts:40-41` when
  `SENTRY_MODE !== 'off'`.
- ADR-160 and ADR-161 Accepted; ADR-160 Open Questions closed
  (new `packages/core/telemetry-redaction-core/` package for
  browser-safe core; per-consuming-workspace conformance tests).

The PR opens after the remaining Phase 1 lanes (L-1, L-2, L-DOC
initial, L-EH initial) and Phases 2–4 of the executable plan close.

## Corrective Learning (2026-04-17)

The session that authored this plan initially claimed
`wrapMcpServerWithSentry` was missing. It was not — it was at
`core-endpoints.ts:98` with clear TSDoc. The miss came from inferring
scope from SDK exports rather than reading the composition root. The
corrective lesson is now doctrine in this plan:

- **Grounding precedes framing.** Before proposing an integration
  pivot, read the composition root.
- **Documentation is part of the loop.** The fact that the wiring was
  not discoverable from workspace READMEs is itself a defect — L-DOC
  exists to close it.

## Objective for This Session

**A.3 owner decisions are settled** (Appendix A.3 of the executable
plan, resolved 2026-04-17). Do not re-open them. Notable settlements:

- Single PR on this branch for all 17 lanes (future work smaller, not
  this).
- L-10 and L-11 are **TSDoc extension-point stubs only** — no adapter
  barrel exports, no wired integrations.
- L-9 `submit-feedback` MCP tool ships with a **closed-set Zod enum**
  input — no free-text fields (privacy invariant).
- L-7 runs in the **Vercel deploy pipeline only**, never in GitHub
  Actions PR checks. Uses **explicit `--commit $GIT_SHA`** form.
- L-8 bundler-plugin adoption is **parked** (would require tsup →
  esbuild swap).
- L-13 replaces alert 521866 (which was smoke-test shape only).
- L-5/L-6 rollback is env-flag-off; alpha, no SLA.

**First action of the next session**: open **L-1** (free-signal
integrations). Before asserting integration behaviour, land the
fixture envelope-observability prerequisite named in §L-1 of the
executable plan: route non-event envelopes (ANR, streamed-span,
runtime-metrics) through `createSentryHooks` so fixture-mode tests
observe the same transformations the live SDK applies. Option A
(preferred) extends `createFixtureRuntime` to route every envelope
through the adapter hook composition; Option B adds per-envelope
capture paths. Owner confirms choice at lane open. Then compose
`anrIntegration`, `zodErrorsIntegration`, `nodeRuntimeMetricsIntegration`,
`spanStreamingIntegration` + `withStreamedSpan`, `rewriteFramesIntegration`,
and `extraErrorDataIntegration`, asserting behaviour-level capture per
§L-1 RED.

Do NOT bundle L-1/L-2/L-DOC-initial/L-EH-initial in a single
un-reviewed pass. Per the updated reviewer matrix (plan §Adversarial
Review), `assumptions-reviewer` runs at every phase close, and Phase 1
close requires the full seven-reviewer roster (code, test, type,
config, docs-adr, sentry, architecture-fred, plus assumptions).

Then continue into L-1, L-2, L-DOC (initial), L-EH (initial) as the
Phase 1 delivery. TDD first at every step. Run the reviewer matrix
per the plan at the end of Phase 1 with **non-leading prompts** (do
not pre-suppose the answer inside the question). Treat reviewer
findings as action items unless explicitly rejected with written
rationale.

## Hard Invariants / Non-Goals

- Parent-plan authority stays with
  `sentry-otel-integration.execution.plan.md` for credential and evidence
  closure.
- No broader search-observability work unless it is explicitly confined
  to the MCP server; the Search CLI lane opens on a new branch after
  this one merges.
- Codex compatibility is a separate follow-up lane; do not reopen shared
  auth configuration speculatively inside the Sentry validation pass.
- Preserve working-client compatibility while investigating Codex.
- **Vendor CLI adoption discipline** (ADR-159): pnpm-first install,
  repo-tracked config, per-workspace ownership for pipeline CLIs,
  shared libraries never pin `project`. See
  [docs/operations/sentry-cli-usage.md](../../docs/operations/sentry-cli-usage.md).
- `sendDefaultPii: false` remains invariant. Shared redaction barrier
  remains non-bypassable.
- ADR-078 DI discipline applies to every new surface (no `process.env`
  reads in library product code; config threaded through parameters).
- `Result<T, E>` is strongly preferred; all new or changed code MUST
  use it where practical. Constructed errors inside a `catch` MUST pass
  `{ cause }`. See `.agent/rules/use-result-pattern.md` (expanding in
  L-EH).
- Practice fitness zones per ADR-144. Routine commits not blocked by
  `soft` or `hard`. Consolidation closure runs
  `pnpm practice:fitness --strict-hard`.
- **Never delegate foundational Practice doc edits** to sub-agents:
  `principles.md`, `testing-strategy.md`, `schema-first-execution.md`,
  `AGENT.md` are owner-edited.

## Reviewer Discipline

Run specialist reviewers per phase per the matrix in the executable
plan. Prompts must be:

- **Self-contained** — the reviewer sees nothing from this conversation.
- **Non-leading** — pose questions, do not pre-suppose answers.
- **Scoped** — word-capped, with a clear review lens.

Findings are actioned unless explicitly rejected with written
rationale. Reviewer results that contradict this prompt or the plan
win.

## Future Strategic Watchlist

- `../plans/agentic-engineering-enhancements/future/cross-vendor-session-sidecars.plan.md`
  — durable cross-vendor session metadata (strategic; not active).
- `../plans/agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md`
  — graph-memory exploration (strategic; not active; explicit
  attribution required on any future adoption).

## Active Workstreams (2026-04-17)

### 1. Sentry Observability Maximisation — MCP branch (this branch)

**Plan**:
`active/sentry-observability-maximisation-mcp.plan.md`

Four phases (foundation uplift → measurement → breadth → operations).
Closes every available Sentry product loop for the MCP app (server +
browser widget) before PR. See the plan for sequencing, TDD cycles,
acceptance, and the reviewer matrix.

### 2. Sentry Observability Maximisation — Search CLI (next branch)

Mirrors the MCP plan on a new branch after the MCP branch merges. The
sibling `search-observability.plan.md` owns ES-PROP and CLI-metrics;
the next-branch maximisation plan will share the same structure.

### 3. User-Facing Search UI — QUEUED AFTER SENTRY

Interactive search MCP App widget. Queued after Sentry close-out.

### 4. Compliance — READY / PARKED

`compliance/current/claude-and-chatgpt-app-submission-compliance.plan.md`
— reviewed, ready for promotion once Sentry is no longer current.

### 5. Schema Resilience — PENDING (owner decision)

Blocked on OQ1 (`.strip()` vs `.passthrough()`).

### 6. Parked

- Interactive User Search MCP App (WS3 Phase 5)
- `_meta` Namespace Cleanup
- Quality Gate Hardening (knip/depcruise done, ESLint remaining —
  partly absorbed by L-EH)
- Upstream API Reference Metadata (design complete)

## Core Invariants

- DI is always used — enables testing with trivial fakes (ADR-078).
- `principles.md` is the source of truth; rules operationalise it.
- Separate framework from consumer in all new work (ADR-154).
- Decompose at tensions rather than classifying around compromises.
- Apps are thin interfaces over SDK/codegen capabilities.
- Widget HTML is generated metadata — same codegen constant pattern
  as `WIDGET_URI`, tool descriptions, documentation content.

## Durable Guidance

- **The quality-gate criterion is always `pnpm check` from the repo
  root, with no filtering, green.** Individual gates may be invoked
  one at a time while iterating to narrow a failure, but the
  phase-boundary and merge criterion is `pnpm check` exit 0 with no
  filter. No exceptions; no "pre-existing" dismissals.
- Run `pnpm fix` to apply auto-fixes.
- Keep this prompt concise and operational; do not duplicate plan
  authority.
