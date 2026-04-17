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
- **Current objective**: apply Appendix A.2 structural corrections to
  the executable plan, then begin L-0 RED (author ADR-160 as the
  successor to ADR-143 §6). Phase 1 delivery follows: L-1 free-signal
  integrations, L-2 delegates extraction, L-DOC initial slice, L-EH
  initial slice.
- **Recent surprises / corrections (2026-04-17 maximisation pivot
  session)**:
  - **Ground before framing**. `wrapMcpServerWithSentry` was already
    wired (`core-endpoints.ts:98`); claimed as missing in the first
    pivot summary due to inference from SDK exports rather than
    reading the composition root. Rule added to the prompt's "Ground
    First" step 7.
  - **Reviewer-prompt discipline**. Non-leading reviewer prompts
    (second round) produced a qualitatively wider finding surface
    than leading prompts (first round). Captured in the napkin.
  - **CI pipeline framing**. PR checks network-free (unit +
    integration); Vercel deploy pipeline network-capable (`sentry-cli`
    there); E2E / smoke out-of-band. Encoded in L-7 and A.3 answer 7.
  - **TSDoc-extension-point-only for future providers**. L-10
    (feature flags) and L-11 (AI instrumentation) resolved as
    stub-with-TSDoc, not barrel re-exports.
- **Open questions / low-confidence areas**:
  - Widget bundle-size measurement once `@sentry/browser` lands
    (L-12) — no budget set; owner chose measure-and-note.
  - `nodeRuntimeMetricsIntegration` default metric count varies
    across 10.x minors — cite Sentry docs page live when the lane
    opens rather than fixing a number in plan prose.
  - `@sentry/profiling-node` v10 API knobs
    (`profileSessionSampleRate` + `profileLifecycle`) have not yet
    been exercised locally; L-6 RED will confirm shape before code.
  - **Testing vocabulary deliberation** (raised 2026-04-17). The
    repo's `testing-strategy.md` uses `unit` / `integration` / `E2E`
    / `smoke` with local definitions: `integration` = in-process
    collaboration tests (not the industry-typical
    "integration-against-a-live-service"); `E2E` = running system
    stdio-only, no network; `smoke` = fully running system, all IO.
    Owner flagged this is atypical and may be confusingly named
    relative to industry convention. Open question: should we adopt
    industry-standard naming (without weakening the actual pipeline
    separation captured by ADR-161)? Not a Sentry-plan concern;
    tracked here for a separate deliberation. Relevant files:
    `.agent/directives/testing-strategy.md`, ADR-161, ADR-078.
- **Next safe step**: in a fresh session, apply Appendix A.2
  structural corrections (rewrite L-0 as "author ADR-160"; split
  L-DOC / L-EH into phased pairs; relocate
  `enrichMcpRequestContext` into the MCP app; partition L-7 into
  sibling scripts; tighten RED framing across L-1/L-4b/L-6/L-7/L-0/L-DOC;
  add missing documentation propagation targets), then open L-0 RED.
- **Deep consolidation status**: completed this handoff — napkin
  extended with eight new entries from the maximisation pivot session;
  three patterns extracted (`ground-before-framing`,
  `tsdoc-extension-point-for-future-consumers`,
  `non-leading-reviewer-prompts`); settled CI-pipeline-boundary
  doctrine graduated to `docs/operations/sentry-cli-usage.md`; two
  new ADRs drafted (status: Proposed): ADR-160 "Non-Bypassable
  Redaction Barrier as Principle" (supersedes ADR-143 §6 in part)
  and ADR-161 "Network-Free PR-Check CI Boundary". ADR index updated;
  ADR-143 §6 carries the supersession note. A todo
  (`ws-review-adrs-160-161`) on the active plan flags both ADRs for
  owner review before Phase 1 opens; L-0 has been rewritten to
  implement ADR-160's test gate rather than author the ADR.
  `pnpm practice:fitness` state captured under Current State —
  this session introduced zero new violations.

## Current State (2026-04-17)

Foundation closure is done on `feat/otel_sentry_enhancements`:

- Steps 1–5 of "Road to Provably Working Sentry" closed 2026-04-17.
- Alert rule 521866 validated via `sentry api`.
- Commits `40b212d4` / `9c3044ff` / `5356bffc` / `f1869840` / `8f33cfc0` /
  `9c0ad424` / `724c1523` pushed.
- Source-map upload operational via `pnpm sourcemaps:upload`
  (two-step Debug ID flow).
- MCP server is auto-instrumented via `wrapMcpServerWithSentry` at
  `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts:98`.
- Shared redaction barrier covers `beforeSend` / `beforeSendTransaction`
  / `beforeSendSpan` / `beforeSendLog` / `beforeBreadcrumb` (ADR-143 §6).
- `setupExpressErrorHandler` is wired at `index.ts:40-41` when
  `SENTRY_MODE !== 'off'`.

The PR opens after the maximisation lanes on this plan all close.

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

**First two actions of the fresh session, in order**:

1. **Apply Appendix A.2 structural corrections** to the plan before
   any code is written. The non-trivial ones: write ADR-160 as a
   **successor ADR** to ADR-143 §6 (not an in-place amendment); split
   L-0 / L-DOC / L-EH into phased pairs; move `enrichMcpRequestContext`
   to the MCP app (L-3 belongs in the app, not the shared lib);
   extract a browser-safe redactor core before L-12 opens; tighten
   RED phases to test product behaviour rather than config shape;
   add the missing documentation propagation targets
   (`docs/operations/sentry-deployment-runbook.md`,
   `docs/operations/sentry-cli-usage.md`,
   `docs/operations/production-debugging-runbook.md`,
   `docs/operations/environment-variables.md`, app README,
   `.agent/directives/AGENT.md § Essential Links`).
2. **Begin L-0 RED** against the corrected plan: author ADR-160
   (non-bypassable redaction barrier as principle, with a closure
   property and a test gate).

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
