---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-18
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
   For this branch specifically, read the direction-setting session report
   `docs/explorations/2026-04-18-observability-strategy-and-restructure.md`
   (rationale for the observability reframe) and the execution plan
   `.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md`
   (five-phase work to realise it).
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
  - `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
    (authoritative execution source for the MCP branch).
- **Strategic parent brief**:
  - `.agent/plans/observability/future/sentry-observability-maximisation.plan.md`
    (full envelope across both runtimes).
- **Parent foundation authority**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
    (closure lane — foundation done 2026-04-17; alert rule 521866 validated).
    Remains in `architecture-and-infrastructure/` per the 2026-04-18
    observability restructure (parent foundation is cross-cutting, not
    observability-scoped).
- **Superseded**:
  - `.agent/plans/observability/archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md`
    — replaced 2026-04-17 by the maximisation pivot. Do not use for
    decisions.
- **Related**:
  - `.agent/plans/observability/active/sentry-observability-translation-crosswalk.plan.md`
    (will be updated to reference the maximisation plan as successor).
  - `.agent/plans/observability/current/search-observability.plan.md`
    (sibling; owns ES-PROP + CLI-metrics; search branch will gain its own
    maximisation plan).
  - `.agent/plans/architecture-and-infrastructure/future/codex-mcp-server-compatibility.plan.md`
    (strategic follow-up; not executable yet; separate branch).
  - `.agent/plans/architecture-and-infrastructure/future/clerk-cli-adoption.plan.md`
    (strategic follow-up extending the ADR-159 pattern to Clerk; separate
    lane after Sentry work).
- **Current state (2026-04-18, commit `276ea9bd`)**: Observability
  strategy restructure **Phases 1–2 complete**. Branch **16 commits
  ahead of remote** on `feat/otel_sentry_enhancements`; `pnpm check`
  from repo root exit 0. **Zero MaxListenersExceededWarning** in the
  test suite (was 38 before the hermetic-test migration). Next phase
  is Phase 3 — explorations 3 and 4 in full + six exploration stubs.

  This session shipped three commits on top of the Phase 1 starting
  point (`502af060`):

  - `502af060` — Phase 1 structural skeleton: ADR-162 Proposed;
    `.agent/plans/observability/` directory with lifecycle sub-dirs,
    area README, high-level-observability-plan skeleton; five `git mv`
    moves; cross-reference sweep zero stale.
  - `231046fe` — Phase 2 MVP scope: filled high-level-observability-plan
    (principle, five-axis MVP table, launch criteria, plan map,
    explorations map, vendor-independence invariants, coordination
    points); authored five new MVP `current/` plans (skeleton-level,
    Phase 3 explorations fill exact scope); eleven `future/` plans
    each with a named testable promotion trigger; audited
    `search-observability.plan.md` for MVP classification.
  - `276ea9bd` — Hermetic-test architectural fix: 11 integration/E2E
    tests migrated off `loadRuntimeConfig` + `createHttpObservabilityOrThrow`
    ceremony to `createMockRuntimeConfig` + `createFakeHttpObservability`;
    new `.agent/rules/test-immediate-fails.md` (21-item checklist) +
    Claude/Cursor adapters + test-reviewer template wiring; ESLint
    `no-restricted-syntax` (error), `no-restricted-properties` and
    `no-restricted-imports` (warn during backlog) added to
    `@oaknational/eslint-plugin-standards` `testRules`; sibling plan
    `test-ceremony-production-factory-audit.plan.md` tracks the
    warn→error migration.

  Practice track outputs this session (commits `d726a1d8` →
  `8a38ab42`):
  - **PDR-007** redefined the Core contract from "eight files" to
    "a bounded package of files plus required directories." New
    first-class Core directories: `practice-core/decision-records/`
    (all PDRs, absorbing the former peer directory) and
    `practice-core/patterns/` (general ecosystem-agnostic
    abstractions authored via synthesis).
  - **PDR-008 Canonical Quality-Gate Naming** — `clean`/`build`/
    `format`/`format:fix`/`lint`/`lint:fix`/`typecheck`/`test`/
    `check` (alias for `check:fix`)/`check:fix`/`check:ci`/`fix`/
    `dev` across ecosystems. Convention: bare = verify, `:fix` =
    apply, `:ci` = non-mutating CI form. `check` alias-for-`check:fix`
    is the one deliberate ergonomic exception.
  - **PDR-009 Canonical-First Cross-Platform Architecture** —
    three-layer canonical/adapter/entry-point model; thin-wrapper
    contract; activation triggers distinct from policies.
  - **PDR-010 Domain Specialist Capability Pattern** — four-layer
    triplet (reviewer + skill + rule + optional operational tooling);
    classification taxonomy (domain_expert / process_executor /
    specialist) × three modes (explore / advise / review); inverted-
    hierarchy variant for proportionality reviewers.
  - **PDR-011 Continuity Surfaces and Surprise Pipeline** — three
    continuity types (operational / epistemic / institutional);
    split-loop handoff/consolidate with gate; named continuity
    contract; capture→distil→graduate→enforce pipeline.
  - **PDR-012 through PDR-023** (batched) — twelve Practice-governance
    PDRs absorbing ~29 instance patterns from `memory/patterns/`:
    review-findings routing (012), grounding/framing (013),
    consolidation/knowledge-flow (014), reviewer authority/dispatch
    (015), claim propagation/reference quality (016), workaround
    hygiene (017), planning discipline (018), ADR scope by
    reusability (019), check-driven development (020), test validity
    (021), governance scanners (022), docs structure (023).
  - **PDR-024 Vital Integration Surfaces** — names the required
    bidirectional repo↔Core bindings in five categories: Core→Repo
    orientation, Repo→Core feedback, genesis paths, cross-cutting
    contracts (PDR-008/009/010/011/006), defensive integrations
    (PDR-003/002/004). Practice Maturity Level 1 = "structurally
    present but inert" — missing any vital surface triggers this.
    Verification enforced at hydration close, routine consolidation
    (step 8 of consolidate-docs), and transplant close.
  - **Consolidate-docs + session-handoff wired** for PDRs and new
    Core surfaces: step 5 pattern-extraction distinguishes three
    destinations; step 7a scans for ADR- AND PDR-shaped doctrine;
    step 7b graduation names practice-core/decision-records and
    practice-core/patterns as first-class homes; step 8 NEW upstream
    Core review; step 10 practice-exchange per PDR-007. Rules
    now cite ADR(s) AND/OR PDR(s).
  - **29 memory/patterns/ entries** gained `related_pdr: PDR-NNN`
    frontmatter linking instance to general governance.
  - **12 outgoing/ duplicates deleted** + outgoing/patterns/
    subdirectory retired; 4 host-local files moved to
    `.agent/reference/`; outgoing/README rewritten as ephemeral-
    exchange-only surface with explicit future-PDR reservations
    (025-028).
  - **Trinity + entry points + practice-verification + CHANGELOG**
    updated for new Core contract and vital-surface verification.
  - **New Learned Principle**: "Integrations must be named to be
    verified" (practice-lineage §Active Principles).
  - **Consolidation passes**: two run this session. 9 distilled
    entries graduated to PDRs (Process-section pruning); 5 upstream
    Core-review amendments applied (Learned Principle, cold-start
    step 11, Self-Teaching refinement, CHANGELOG entry, bootstrap
    drift-check clean).
  - **Experience entry**: `2026-04-18-seam-definition-precedes-migration.md`
    captures the mid-session corrective arc (owner interrupt caught
    a migration classifying against the wrong axis).
- **Current objective** (next session): **Phase 3 of the observability
  strategy restructure — exploration kickoff**. Phases 1 and 2 of the
  restructure are complete; Phase 3 is the next gate before the
  executable-plan revisions (Phase 4) and ADR-162 acceptance (Phase 5).

  **Next action**: open Phase 3 of the restructure plan at
  `.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md`.
  Phase 3: write **two explorations in full** — (3)
  `docs/explorations/2026-04-18-accessibility-observability-at-runtime.md`
  (blocks `current/accessibility-observability.plan.md` MVP scope)
  and (4) `docs/explorations/2026-04-18-structured-event-schemas-for-curriculum-analytics.md`
  (blocks `current/observability-events-workspace.plan.md` MVP schema
  set). Stub the other six explorations with problem statement +
  research questions: sentry-vs-posthog, sentry-as-paas,
  trust-boundary-propagation, cloudflare-plus-sentry,
  static-analysis-augmentation, vendor-independence-conformance-test-shape.
  Reviewer matrix at phase close: `docs-adr-reviewer`. Single commit.

  L-1 of the maximisation plan is **not** next — it opens only
  after Phases 1–5 of the observability restructure close.

  **Sibling backlog work** (concurrent / not blocking Phase 3):
  `.agent/plans/architecture-and-infrastructure/current/test-ceremony-production-factory-audit.plan.md`
  — migrate remaining test files off `loadRuntimeConfig` +
  `createHttpObservabilityOrThrow` ceremony; flip ESLint
  `no-restricted-properties` and `no-restricted-imports` from `warn`
  to `error` when backlog reaches zero. ~34 total violations today.
- **Deep consolidation status**: **due — new session-level surprises
  (test-ceremony architectural drift, immediate-fails rule as a
  first-class artefact, MaxListeners root-cause lineage) and a new
  current/ plan (test-ceremony-production-factory-audit) landed this
  session. Check triggers via consolidate-docs next session opener, or
  execute now if well-bounded.**
- **Restructure phase map** (from the restructure plan):
  - **Phase 1** Structural skeleton — ADR-162 Proposed, directories,
    moves, cross-references. ✅ **Complete 2026-04-18** (commit `502af060`).
  - **Phase 2** MVP scope pass — filled high-level plan; authored 5
    new `current/` plans + 11 `future/` plans with promotion triggers.
    ✅ **Complete 2026-04-18** (commit `231046fe`).
  - **Phase 3** Exploration kickoff — two full explorations
    (accessibility at runtime; event schemas for curriculum
    analytics) + six stubs. **Next action.**
  - **Phase 4** Executable plan revision — swap L-4a/L-4b; MVP
    classification; cross-refs.
  - **Phase 5** ADR-162 acceptance — land `require-observability-emission`
    ESLint rule at `warn`; codify reviewer-matrix question; flip ADR
    Proposed → Accepted.
- **Post-restructure Phase 1 work** (still scheduled, not started —
  carries forward from prior handoff):
  - **L-1** free-signal integrations with fixture envelope-observability
    prerequisite.
  - **L-2** `createSentryDelegates` extraction with structural-
    intersection acceptance test.
  - **L-DOC initial** expand sentry-node README + write app observability doc.
  - **L-EH initial** `require-error-cause` ESLint rule with expanded
    RuleTester cases.
- **Recent surprises / corrections (2026-04-18 observability Phases 1–2 + test hygiene session)**:
  - **Tests import production factories as ceremony — and it hides
    bugs.** The session opened with a `MaxListenersExceededWarning`
    of ambiguous origin; trace-warnings showed Sentry's `init()` at
    `runtime-sdk.ts:100`. Root cause: integration + e2e tests
    routinely pulled in `loadRuntimeConfig` and
    `createHttpObservabilityOrThrow` as incidental infrastructure to
    satisfy `createApp`'s signature. With a developer-local
    `.env.local` setting `SENTRY_MODE=sentry`, each test triggered
    real Sentry init; listeners accumulated across test cases until
    Node tripped its 10-listener cap. The bug was a symptom of
    architectural drift, not a Sentry bug. Rule:
    **tests must never import product code they are not directly
    testing**.
  - **`.env.local` silently leaks into tests that look hermetic.**
    Integration tests passed curated `processEnv` objects — but
    `loadRuntimeConfig` still calls `resolveEnv` which reads
    `.env.local` from disk and merges it. Any test that calls
    `loadRuntimeConfig` is exposed. The fix is to bypass
    `loadRuntimeConfig` entirely in tests — construct a `RuntimeConfig`
    literal via a test-helper.
  - **Symptom-level fixes can violate their own principles.** First
    attempted fix set `process.env.SENTRY_MODE = 'off'` in
    `test.setup.ts`. That mutates global state in tests — exactly
    what ADR-078 forbids. Correction: tests must not touch OR consume
    `process.env`. New memory entry
    `feedback_tests_no_global_state.md` captures this.
  - **Immediate-fails checklist earns first-class status.** Owner
    codified 6 items for test-reviewer; expanded to 21 covering
    Boundary, Side-Effect, Mock/Stub, Structural, Pipeline
    categories. Lives at `.agent/rules/test-immediate-fails.md` with
    Claude/Cursor adapters and test-reviewer first-pass screen.
    Complements (not replaces) the existing
    `no-global-state-in-tests.md`.
  - **Quality gates encode the checklist at compile time.** Once the
    rule existed, encoding as ESLint rules in
    `@oaknational/eslint-plugin-standards` `testRules` was natural:
    `no-restricted-syntax` (error) for the zero-violation patterns,
    `no-restricted-properties` + `no-restricted-imports` (warn) for
    the ~34-violation backlog tracked via the new
    `test-ceremony-production-factory-audit.plan.md`.
  - **Production factories can be legitimate subjects under test.**
    `runtime-config.unit.test.ts` and
    `http-observability.unit.test.ts` legitimately import the factory
    they test. The ESLint rule handles this via file-glob allowlists
    in each workspace's own `eslint.config.ts` — not via a repo-wide
    rule relaxation. Per-file discipline; exceptions declared
    explicitly.

- **Recent surprises / corrections (2026-04-18 Practice-track close)** (historical):
  - **Seam definition precedes mechanical migration.** Migration
    plan had ~53 patterns queued for move based on universal-vs-
    local classification. Owner interrupt caught the real seam was
    different: governance-vs-engineering, and within engineering,
    general-vs-instance. Moving files around a loose seam would
    have actively made the system worse. The corrective produced
    PDR-024 indirectly by surfacing that intent/audience/meaning
    distinctions must be explicit before file moves. Experience
    entry at `.agent/experience/2026-04-18-seam-definition-precedes-migration.md`.
  - **Upstream Core review is a distinct flow from graduation.**
    Owner observed that consolidate-docs had downstream wiring
    (session → Core) but no upstream review (existing Core ← current
    practice). Added as new step 8 of consolidate-docs. The two
    flows are distinct design concerns: graduation adds new content;
    upstream review amends existing content.
  - **Integrations must be named to be verified.** Owner's final
    observation of the session: repo↔Core bindings flow in both
    directions (orientation via entry-point/bridge/start-flows;
    feedback via capture/refinement/graduation/upstream-review).
    These are vital — without them, the Practice is structurally
    present but inert. PDR-024 named them as required and wired
    verification into Bootstrap Checklist + consolidate-docs step 8
    + transplant close. Landed as an Active Learned Principle.

- **Earlier surprises / corrections (2026-04-18 observability reframe)**:
  - **MVP is a function of launch context.** Initial MVP framing
    assumed private-alpha. Owner clarified: public beta, long-lived,
    important — **MVP is materially larger**, spanning engineering +
    product + usability + accessibility + security axes. Same
    codebase, same foundation; scoping decision changed by 2-3x.
    Generalises: get launch context locked before defining MVP; the
    launch commitment shape is the single biggest MVP scope lever.
  - **Vendor-independence was always architectural intent but not
    explicit principle.** ADR-078 / ADR-143 / ADR-154 / the adapter
    pattern all imply it; no ADR named it. Now being raised to
    first-class ADR clause (ADR-162 vendor-independence) with a
    testable conformance gate (run in `SENTRY_MODE=off`; structural
    event information persists via stdout/err). Implicit intent is
    not enforcement.
  - **Event schemas deserve a code workspace, not a Markdown doc.**
    `packages/core/observability-events/` becomes the code-enforced
    contract between emitters and downstream analytics pipelines.
    Documented-schema-as-code matches the repo's schema-first pattern
    (ADR-029/030/031 are kindred). Markdown doc was underweight for
    the cross-pipeline integration contract.
  - **`metrics.*` beta over span-metrics stable.** Owner preference:
    build on the forward path even in beta over the deprecating
    stable surface. Risk: beta API churn. Mitigation: adapter
    insulates consumers; conservative version-pin; changelog-watch.
    Trade-off explicit.
  - **Explorations fill a real documentation gap.** Between napkin
    (ephemeral observations) and ADR (committed decisions) sits
    option-weighing / research / design-space work. This tier had
    no home; `docs/explorations/` created to fill it. Pattern
    candidate: **research as a first-class deliverable** alongside
    code, not a side note to it — validated by "Sentry-as-PaaS
    exploration is a core project thesis."
  - **"Nothing unplanned without a promotion trigger."** Extension
    of the "findings route to a lane or a rejection" pattern from
    review-findings to planning-level decisions. Every future plan
    now requires a named testable event that would promote it. A
    plan without a trigger is a zombie backlog item in disguise.
    Second instance of the underlying principle applied at a higher
    level; candidate pattern extraction.
  - **Sentry-as-PaaS is an explicit exploration thesis.** Owner
    framed this as one of the project's core research questions:
    "how far does Sentry go across five axes, where does it win,
    where does it fall short." Reframes L-15 from vendor-count
    decision to research-deliverable question.
  - **Accessibility observation at runtime is partially open.**
    Some signal is capturable (preference tags, frustration proxies,
    incomplete-flow correlation). Some is dev-time-only (axe-core).
    Some may be fundamentally out of reach. Open question flagged
    for exploration 3.

Carried from 2026-04-17 (still relevant):

- **"Stretch" is not scope**; feature lanes are features, no hidden
  third category.
- **Findings route to a lane or a rejection**; never deferred without
  a home (pattern `findings-route-to-lane-or-rejection.md`).
- **RED-by-new-file overstates TDD** when implementation exists;
  conformance harness is honest framing.
- **ADR Open Questions close in the ADR**, not in plan prose.
- **Tautological tests are not tests**; comparing two names at the
  same value tests aliasing, not behaviour.
- **Ground before framing**: read the composition root before
  proposing pivots.
- **Fixture runtime does not route through hooks**: proof surface
  for hook behaviour is direct `createSentryInitOptions(...)` return
  invocation.
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
- **Next safe step**: open Phase 3 of the observability strategy
  restructure per **Current objective** above. Primary deliverables:
  (3) accessibility-observability-at-runtime exploration in full, (4)
  structured-event-schemas-for-curriculum-analytics exploration in
  full, plus six exploration stubs. Reviewer: `docs-adr-reviewer`.
  Single commit. Sibling backlog work on
  `test-ceremony-production-factory-audit.plan.md` is concurrent and
  not blocking Phase 3.
- **PDR-007 landed 2026-04-18** — Core contract redefined as
  "bounded package of files plus required directories." New
  directories `practice-core/decision-records/` (PDRs) and
  `practice-core/patterns/` (general ecosystem-agnostic abstract
  patterns) became first-class Core. Full batch of PDR-008 through
  PDR-023 landed in the same session, absorbing ~29 Practice-
  governance patterns from `memory/patterns/`. See
  `.agent/practice-core/CHANGELOG.md` (2026-04-18 entry) for the
  executed: 12 outgoing duplicates deleted, outgoing/patterns/
  subdirectory retired, 4 files moved to `.agent/reference/`, 29
  memory/patterns/ entries updated with `related_pdr` pointers,
  trinity edits + entry-point edits completed, cross-reference
  sweep zero stale. The graduation-path ladder is now:
  memory/patterns/ → practice-core/patterns/ (general pattern via
  synthesis) OR practice-core/decision-records/ (when Practice-
  governance-shaped PDR).

- **Deep consolidation status**: **completed this handoff (2026-04-18
  second pass)** — consolidation after the structural-change-heavy
  session. This is the third consolidation in the 2026-04-17 →
  2026-04-18 window; the rate of structural change has been high.
  Flag: if the next session produces another round of structural
  PDRs or principle graduations, consider a deliberate pause-and-
  stabilise pass before any new structural work. Outputs of this
  consolidation:
  - **Step 5 (patterns)**: one new pattern extracted —
    `patterns/nothing-unplanned-without-a-promotion-trigger.md`
    (extension of `findings-route-to-lane-or-rejection` from
    review-findings to planning-level decisions — a second
    instance of the underlying "no smuggled drops" principle at a
    higher abstraction layer). Evidence entry appended to
    `findings-route-to-lane-or-rejection.md` referencing the
    planning-layer application. Two today's napkin observations
    remain single-instance pending cross-session validation:
    "research is a first-class deliverable" and "launch context
    shapes MVP by orders of magnitude."
  - **Step 6 (napkin)**: handoff + consolidation entries bring
    napkin to ~490 lines. Under 500 rotation threshold but close;
    expect rotation at next consolidation.
  - **Step 7 (graduation)**: no new distilled.md graduations this
    pass. No new ADR-shaped doctrine beyond the already-scheduled
    ADR-162 (Observability-First with vendor-independence clause),
    which is drafted as Phase 1 of the restructure plan.
  - **Step 8 (fitness)**: `pnpm practice:fitness:strict-hard`
    state unchanged — three owner-deferred hard-zone directives
    remain; this session introduced zero new hard violations.
    Soft-zone files unchanged.
  - **Step 9 (practice exchange)**: incoming boxes empty. Outgoing
    broadcast drafted:
    `.agent/practice-context/outgoing/nothing-unplanned-without-a-promotion-trigger.md`.
  - **Step 10 (experience)**: reflective experience entry at
    `.agent/experience/2026-04-18-observability-as-principle.md`
    on the session shape — from a single-branch Sentry expansion
    into a project-wide five-axis observability principle, and
    what that shift felt like to navigate.
  - **Commit state**: handoff + consolidation edits to commit in a
    single closing commit.

## Current State (2026-04-18, post-observability-reframe session)

Foundation closure + L-0 (barrier-gate conformance) + observability
strategy reframe done on `feat/otel_sentry_enhancements`:

- Steps 1–5 of "Road to Provably Working Sentry" closed.
- Alert rule 521866 validated via `sentry api`.
- Commits landed (most recent first): `2319a614` (session report +
  restructure plan for observability reframe), `bdffc770`
  (consolidation pass from l-0b close), `d08c6969` (l-0b + reviewer
  register), `ded99224`, `e215a879`, `724c1523`, `9c0ad424`,
  `8f33cfc0`, `f1869840`, `5356bffc`, `9c3044ff`, `40b212d4`.
  Branch is three-plus commits ahead of remote; push pending owner
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

The PR opens after (a) the observability strategy restructure
(Phases 1-5 of `observability-strategy-restructure.plan.md`) and
(b) the remaining lanes of the revised maximisation plan
(L-1 / L-2 / L-DOC initial + final / L-EH initial + final / Phases 2-4)
close. The restructure is a pre-requisite because it establishes the
five-axis MVP framing that governs what "launch-ready" means.

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

**First action of the next session**: open **Phase 1 of the
restructure plan** (`.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md`).
Phase 1 is structural: draft ADR-162 (Observability-First with
vendor-independence clause) in Proposed status; create
`.agent/plans/observability/` with lifecycle sub-dirs (`active`,
`current`, `future`, `archive`) + README +
`high-level-observability-plan.md` skeleton; `git mv` the six existing
observability plans (the maximisation executable plan moves to
`observability/active/`; the strategic brief to `observability/future/`;
the crosswalk to `observability/active/`; the search-observability
plan to `observability/current/`; the pre-pivot archive to
`observability/archive/superseded/`); sweep cross-references across
all `.agent/**/*.md` and `docs/**/*.md` for the old paths until grep
returns zero. Single Phase-1 commit. `docs-adr-reviewer` +
`architecture-reviewer-fred` pass at phase close.

**Do NOT jump straight to L-1** of the old maximisation plan — L-1
opens only after Phase 4 of the restructure plan revises the
maximisation plan's MVP classification and the `metrics.*`
priority swap lands. The restructure is the gate.

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
