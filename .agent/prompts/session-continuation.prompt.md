---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-19-primitives-consolidation-landed
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
4. Read the current workstream artefacts before anything else. The primary
   workstream is the observability/Sentry lane on
   `feat/otel_sentry_enhancements`; a parallel agentic-engineering thread
   owns the follow-up operational-awareness plan.
   - `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
     — lane-level execution authority for Wave 1 and beyond.
   - `.agent/plans/observability/what-the-system-emits-today.md`
     — externally-verifiable emits-today snapshot; updated at every lane close.
   - `.agent/plans/observability/high-level-observability-plan.md`
     — five-axis MVP framing; wave sequencing.
   - `docs/architecture/architectural-decisions/162-observability-first.md`
     — Accepted; governs the whole workstream.
   - `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`
     — authoritative app observability guide (L-DOC initial output).
   - `packages/libs/sentry-node/README.md`
     — package-level reference for the shared Sentry-Node library.
   - `.agent/plans/agentic-engineering-enhancements/current/operational-awareness-and-continuity-surface-separation.plan.md`
     — parallel-thread follow-up; not the primary workstream here.
5. Re-establish live branch state:

```bash
git status --short
git log --oneline --decorate -5
```

## This Prompt's Role

- Operational entry point only.
- Active plans are authoritative for scope, sequencing, acceptance criteria,
  and validation.
- If prompt text conflicts with active plans, active plans win.

## Per-Session Landing Commitment

Every session opens by stating what it **will land** (a concrete,
externally-verifiable outcome) or explicitly naming that no landing
is targeted and why. A landing target is a specific invariant
achieved in code — a rule enabled, a test added, a file authored, a
commit made, a deployment registered — not a plan edit or a "lane
opened." If the session completes without the landing, the close
records what prevented it and what the next session will re-attempt.

**Why this matters**: auto-mode makes it easy to spend a session
refining plans, updating prompts, and opening review loops without
leaving any externally-observable change in the system. Naming the
landing target at open forces the session's work to compose toward
it; reviewing against it at close distinguishes "session produced
evidence" from "session produced more plans."

**Structure at open**:

> Target: `<lane-id or artefact>` — `<specific outcome>`.
> If no target is appropriate: "no-landing session — reason: `<reason>`."

**Structure at close**:

> Landed: `<outcome>` — `<evidence link>`.
> If unlanded: `<what was attempted>` — `<what prevented>` —
> `<what next session re-attempts>`.

**Exceptions**: deep-consolidation sessions, Core-trinity refinement
sessions, and root-cause investigation sessions legitimately have
no code-landing target; they record their exception reason up-front
and close with a shape-specific artefact (consolidation commit,
trinity diff, investigation report).

This field composes with
[`what-the-system-emits-today.md`](../plans/observability/what-the-system-emits-today.md)
for observability work specifically: if the landing moved a matrix
cell from empty to populated, update the artefact in the same
commit.

## Live Continuity Contract

- **Workstream**: Observability Wave 1 on `feat/otel_sentry_enhancements`.
  Three Wave 1 lanes have now landed across the 2026-04-19 series of
  sessions (L-EH initial ✅ + L-DOC initial ✅ + primitives
  consolidation ✅ — the latter closed L-12-prereq as a side effect
  since the original extraction was resolved by fold-into-observability
  rather than a new core workspace). L-7 is the only Wave 1 item still
  open and is **blocked on owner adjudication** of the build /
  releases / Sentry interaction. The three-sink architecture wiring
  landed earlier in the day as a documentation milestone only. All
  non-observability threads (knowledge-graph, semantic-search,
  research, sdk-and-mcp-enhancements) are **paused at owner direction**
  until explicitly picked back up; their in-flight edits were bundled
  into commit `e09918a8` per owner instruction.
- **Active plans**:
  - `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
    — lane-level execution authority. §L-12-prereq flipped to
    **completed** this session. §L-7 fully rewritten against
    [ADR-163](../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md);
    adjudication complete, implementation awaits authorisation.
  - `.agent/plans/observability/high-level-observability-plan.md`
    — five-axis MVP framing + wave sequencing; three-sink architecture
    subsection + Exploration rows landed 2026-04-19.
  - `.agent/plans/observability/future/second-backend-evaluation.plan.md`
    — three-sink strategic brief (reframed 2026-04-19). Decision record:
    PostHog = settled Sink 3 vendor; warehouse-before-PostHog =
    owner-confirmed hard blocker; warehouse vendor + identity envelope
    = open pending Explorations 9 + 10.
  - `.agent/plans/observability/what-the-system-emits-today.md`
    — externally-verifiable emits-today snapshot; 3 of 13 cells
    populated. Update Log entries through 2026-04-19 include L-DOC
    initial close, Sinks Today vs Planned, and the primitives-
    consolidation-landed attempt / observed / proven record.
  - `.agent/plans/architecture-and-infrastructure/archive/completed/observability-primitives-consolidation.plan.md`
    — **LANDED 2026-04-19** as commit `e09918a8`. All nine work streams
    closed. Plan kept in `current/` through this consolidation pass
    only; archive move + stale-link sweep happens during
    `jc-consolidate-docs` step 1–2.
  - `.agent/plans/agentic-engineering-enhancements/current/operational-awareness-and-continuity-surface-separation.plan.md`
    — parallel-thread follow-up (QUEUED, paused); not this session's
    primary.
- **Current state**: Branch `feat/otel_sentry_enhancements` at HEAD
  `e09918a8` (post-consolidation-landing). Six commits ahead of
  `origin/feat/otel_sentry_enhancements` (push deferred — non-
  automated). Working tree clean. Branch is **back to mergeable
  (`pnpm check` exit 0)**. Test totals from the landing gate:
  observability 58/58, sentry-node 61/61 (behavioural safety net
  preserved), logger 140/140, oak-search-sdk 262/262, oak-
  curriculum-mcp-streamable-http 615/615, search-cli 1006/1006; E2E
  161/161 in isolation. `packages/core/telemetry-redaction-core/`
  no longer exists; `@oaknational/observability` owns redaction
  primitives + JSON sanitisation + canonical `JsonValue`/`JsonObject`
  type; `@oaknational/sentry-node` composes directly from
  observability (no intermediate workspace hop); browser-safety
  invariant structurally enforced by `no-node-only-imports.unit.test.ts`.
  - `e09918a8` refactor(observability): fold redaction primitives;
    delete telemetry-redaction-core (WS1–WS9 atomic; bundled parallel-
    agent edits across knowledge-graph / semantic-search /
    sdk-and-mcp-enhancements / research per owner direction)
  - `095e66d4` wip(observability): primitives consolidation plan +
    transitional scaffold
  - `9e1a26b2` feat(observability): l-doc initial — authoritative app
    observability docs
  - `08989388` docs(agentic-engineering): governance-concept integration
    lane closeout
  - `7efd0a43` feat: l-eh initial + wave-1 assurance mechanisms +
    governance-concept lane
- **Current objective**: Consolidation is **LANDED 2026-04-19** per
  [`architecture-and-infrastructure/archive/completed/observability-primitives-consolidation.plan.md`](../plans/architecture-and-infrastructure/archive/completed/observability-primitives-consolidation.plan.md).
  L-12-prereq is now **completed** (see status flip in the
  maximisation plan). The next primary objective is the **L-7
  release + commits + deploy linkage lane**. All other active threads
  (knowledge-graph, semantic-search, research, sdk-and-mcp-enhancements
  README updates) are paused at owner direction until explicitly
  picked back up. L-7 has **completed adjudication AND ADR-163 is
  Accepted** 2026-04-19 — the mechanism is fully specified in
  [ADR-163](../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md)
  (Accepted) and the L-7 lane body in the maximisation plan.
  Release = semver from root `package.json`; SHA = metadata via
  `releases set-commits` + `git.commit.sha` tag; production
  attribution requires both `VERCEL_ENV=production` AND
  `VERCEL_GIT_COMMIT_REF=main`; local-dev skipped unless override
  env-pair set. Existing GitHub `release.yml` + Vercel `ignoreCommand`
  machinery is unchanged; L-7 adds a single orchestrator script inside
  the Vercel Build Command. **Implementation authorised** 2026-04-19;
  ready to execute on session resume.
  The three-sink wiring is **closed as a documentation milestone** —
  no further three-sink plan-edits are expected until either (a)
  Exploration 9 (warehouse vendor) closes with a settled vendor,
  or (b) Exploration 10 (Clerk identity policy) closes with a
  settled doctrine ruling, or (c) a promotion trigger from
  `future/second-backend-evaluation.plan.md` fires (warehouse
  adapter authoring within 8 weeks of public-beta commitment;
  PostHog adapter authoring on a named question with ≥4 weeks of
  telemetry available).
- **Hard invariants / non-goals**: ADR-143 / ADR-160 / ADR-161 / ADR-162
  invariants hold. `sendDefaultPii: false` remains the floor; redaction
  barrier remains non-bypassable. `Result<T, E>` on new/changed code;
  `{ cause }` on constructed errors in `catch` — now compile-time enforced
  at `error` via `preserve-caught-error`. `pnpm check` from repo root with
  no filter is the merge criterion (PDR-025). No `process.env` reads in
  library product code; DI through parameters (ADR-078). No skipped tests.
  Docs-content tests violate testing-strategy.md; acceptance on docs
  lanes sits on the reviewer matrix, not automated content-presence checks.
  Tests must prove behaviour, not constrain implementation/config.
- **Recent surprises / corrections** (2026-04-19 primitives-consolidation EXECUTION session):
  - **Type unification dissolved a work-stream boundary.** WS6 was
    listed as a standalone "eliminate `requireJsonObject` runtime
    throw" work stream. Once WS1's type unification (delete
    `TelemetryRecord` / `TelemetryValue`, canonicalise `JsonObject` /
    `JsonValue`) landed, the `requireJsonObject` workaround became
    structurally unjustified — the outer `sanitiseObject` pass was
    already provably redundant against a typed `JsonObject → JsonObject`
    redaction signature. WS6 completed as side-effect of WS1. Pattern
    candidate: `work-stream-dissolution-via-upstream-fix` — a
    fix-to-root-cause can absorb a downstream remediation listed as
    separate work.
  - **Owner stop-all-streams mid-reviewer-dispatch is a legitimate
    override of plan prescription.** The plan's WS8 listed ten
    specialist reviewers. I launched four in parallel (code-reviewer,
    fred, barney, type-reviewer); the owner interrupted with "stop all
    other streams, include all files in the next commit". Two reviews
    completed (barney + type-reviewer, both with actionable P2/P3
    findings that were applied in-close); two were rejected. Lesson:
    reviewer dispatch scale is discretionary, not prescriptive; owner
    concurrency control trumps plan-level matrix completeness. Pattern
    candidate: `reviewer-matrix-completeness-is-not-absolute`.
  - **Turbo-cached `format:root` is not a reliable proxy for
    pre-commit prettier's verdict.** Ran `pnpm format:root` after
    reviewer edits — turbo reported "all cached unchanged". Committed.
    Pre-commit hook re-ran prettier on the staged file and found
    actual drift in `apps/oak-search-cli/src/observability/cli-observability.ts`.
    Turbo's cache reflected input-hash equivalence, not current
    prettier state. Running `pnpm format:root` a second time DID fix
    the file. Pattern candidate: `turbo-cache-hides-prettier-drift-
    until-pre-commit` — run format unconditionally before commit; or
    trust the pre-commit hook to catch it.
  - **E2E flakiness under parallel `pnpm check` load — third cross-
    session instance.** First `pnpm check` during the landing gate
    hit an E2E failure in `apps/oak-curriculum-mcp-streamable-http`.
    Re-run with `pnpm --filter @oaknational/oak-curriculum-mcp-
    streamable-http test:e2e` in isolation: 161/161 green. Second
    `pnpm check` full run: all 88 tasks green. This is the third
    cross-session instance of the same pattern (per the prior
    session's watchlist, "Name a test-stability lane if a third
    session confirms the pattern"). **Promotion-ready** to an actual
    test-stability lane.
  - **Reviewer findings applied in close, not deferred.** Barney's P2
    (README clarification on historical type names) and type-reviewer's
    P3-1 (`isTelemetryObject` → `isJsonObject` rename) and P3-2
    (redundant post-redaction guard in `express-middleware.ts` removed)
    all landed in the atomic commit rather than being queued as
    follow-up work. The plan's acceptance criterion "findings are
    action items unless explicitly rejected with written rationale"
    was honoured structurally. Deferred: two P3 pre-existing-shape
    observations (`ValueConfigError` indirection; `PlainObjectValue`
    `WeakKey` union) recorded in the plan Close Evidence as out-of-
    scope. Pattern confirmation: `reviewer-findings-are-action-items-
    by-default` still holds; deferral requires named rationale.
  - **Owner override: "include all files" legitimises cross-thread
    bundled commit.** Memory feedback established the default
    (`git add specific files`, not `-A`). This session the owner
    explicitly overrode: "include all files in the next commit". The
    override is the controlling instruction; the default applies when
    no explicit instruction is given. Worth preserving the distinction
    so the next session doesn't read the memory entry as a hard rule.

- **Recent surprises / corrections** (2026-04-19 primitives-consolidation planning session):
  - **Dependency-provenance trace is the leading indicator; lint is
    lagging.** L-12-prereq scaffolded a new core workspace before
    tracing what its imports would transitively depend on. The
    `@oaknational/logger` core→lib violation surfaced only when
    ESLint ran on the new workspace. A 5-minute graph trace at plan
    time — "enumerate every import the new workspace will need;
    verify each lives in a tier it is allowed to depend on" — would
    have surfaced the architectural repair before scaffolding began.
    Watchlist candidate: `dependency-provenance-before-scaffold`.
  - **Architectural excellence trumps ADR honour when the ADR was
    made without the simplification on the table.** ADR-160 §Closed
    Questions (2026-04-17) recorded "new package at
    `packages/core/telemetry-redaction-core/`" as the placement
    decision. Architecture-reviewer-barney's simplification review
    (with the full consumer graph visible) surfaced that the decision
    was over-decomposed: `JsonValue` (logger) and `TelemetryValue`
    (observability) are the same recursive JSON-safe type with
    different names; the new workspace would create a third copy;
    the 139 LOC of primitives are pure composition with zero net
    primitive content. Owner ruling: amend the ADR, do not honour a
    decision made with less information. Watchlist candidate:
    `amend-not-honour-when-simplification-surfaces-post-decision`.
  - **Reviewer verdicts can be contradictory-but-both-honest.**
    Fred (strict-ADR lens) approved the two-workspace plan with
    three corrections. Barney (simplification-first lens) rejected
    it as over-decomposed and recommended folding into
    `@oaknational/observability` and deleting the scaffolded
    workspace entirely. Both verdicts were correct within their
    lens. Running reviewers with different lenses surfaces tradeoffs
    that no single review can reach. Watchlist candidate:
    `multi-lens-reviews-surface-tradeoffs-single-review-cannot`.
  - **139 LOC of pure composition fails core-tier "atomic primitive"
    spirit.** Workspace tier is not just about dependency purity —
    it is about primitive-ness. Composition layers belong in libs
    even when they have zero runtime deps. A new core workspace
    must *add* a primitive, not *compose* primitives. Watchlist
    candidate: `core-tier-means-primitive-not-just-dependency-pure`.
  - **Duplicate types become load-bearing at three consumers.**
    `JsonValue`/`JsonObject` (logger) and
    `TelemetryValue`/`TelemetryRecord` (observability) — the same
    recursive JSON-safe shape with different names — have coexisted
    stably because only two consumers each knew their own copy. The
    would-be third consumer (the scaffolded redactor core) forced
    the canonicalisation question. Pattern candidate:
    `duplicate-type-load-bearing-at-three-consumers` — a duplicated
    type across two workspaces is tolerated until the third import
    site; at three, canonicalisation is forced.
  - **Safety layers stack, they do not nest under conversation-level
    permission.** Owner verbally authorised `--no-verify`; the
    repo's `scripts/check-blocked-patterns.mjs` pre-tool hook still
    rejected it as a dangerous pattern. The owner had to run the
    commit themselves from a shell. Harness-level hook policies are
    not automatically subordinate to in-conversation authorisations.
    Pattern candidate: `safety-layers-stack-not-nest`. Related new
    memory entry: `--no-verify` requires fresh per-commit permission
    and never carries forward
    (`memory/feedback_no_verify_fresh_permission.md`).
  - **Staged-parallel-agent-work is discoverable only via fresh
    `git status`.** The session-open git status was a snapshot (4
    dirty files); by mid-session, parallel agents had staged 47
    files of concurrent work (three-sink wiring, knowledge-graph
    reorg, explorations, ADR history entries, napkin entries).
    Attempted `git restore --staged --worktree` would have
    destroyed parallel-agent work; owner rejected the attempt.
    Lesson: before any destructive git command, re-read status and
    diff exact files; do not rely on mental model from earlier in
    the session. Pattern candidate:
    `git-status-is-a-snapshot-reread-before-destructive-ops`.
- **Recent surprises / corrections** (2026-04-19 three-sink wiring session):
  - **Closure-principle ADRs absorb cardinality changes without
    amendment.** Going in, I expected the three-sink reframe to land
    predominantly as ADR amendments — ADR-160 to permit identified
    events, ADR-162 to enumerate per-sink conformance. Neither
    materialised. ADR-160 is *already* a closure principle (every
    fan-out path applies the redaction policy), so the Clerk identity
    ruling lives at the *policy* layer the closure rule consumes, not
    at the closure rule itself. ADR-162's vendor-independence clause is
    *already* sink-cardinality-agnostic; three sinks is a confirmation,
    not an extension. Both ADRs received History entries only. The
    architectural weight landed in plans
    (`future/second-backend-evaluation.plan.md` reframe + new
    explorations 9 + 10), not in ADR amendments. Captured as new
    pattern candidate: `closure-principles-absorb-cardinality-changes`
    (single-instance; second instance would graduate).
  - **Two reviewer rounds (assumptions + docs-adr) both surfaced
    BLOCKERs that the owner explicitly chose to *override toward the
    more aggressive position*, not toward the reviewer's softening
    suggestion.** Reviewer (1): "PostHog over-named as Sink 3 — keep
    as candidate, not vendor." Owner ruling: keep as settled vendor
    (rationale: existing Oak-org PostHog usage discharges procurement
    + governance + familiarity overhead; vendor decision is settled,
    only adoption *timing* is gated). Reviewer (2): "warehouse-before-
    PostHog is sequencing preference, not a hard dependency." Owner
    ruling: keep as hard blocker (rationale: warehouse is the durable
    analytical-SQL substrate; PostHog interactive analytics layers on
    top of, or alongside, durable storage that already exists;
    promoting PostHog before the warehouse would bypass the substrate
    the org needs for cross-source SQL). Pattern observation: reviewer
    findings frame the *option space*; owner rulings settle within
    that space. The reviewer's job is to surface the alternative; it
    is *not* to prescribe which alternative wins. Watchlist candidate:
    "reviewer-as-option-cartographer-not-decision-maker."
  - **In-place supersession markers at section headers are load-
    bearing for anchor-arrived readers.** Docs-adr-reviewer caught
    that `docs/explorations/2026-04-18-sentry-vs-posthog-capability-
    matrix.md` carried a top-of-file "Status update 2026-04-19 —
    three-sink reframe" callout but Q6 and §7 (the two sections most
    likely to be linked-to from external surfaces) did not carry their
    own in-place markers. A reader who lands on §7 via a fragment URL
    would never see the top-of-file callout. The fix added
    `Status 2026-04-19 (in-place marker)` headers inside Q6 and §7.
    Generalisation: when a doc receives a status reframe, in-place
    markers are needed at every section-level anchor that external
    surfaces reference, not only at the document head. Third instance
    in 2026-04-19 of "fork-cost surfaces in the doc-discipline layer"
    (first: ADR-filename drift across new docs in L-DOC initial;
    second: dual-frame labels invite drift in the planning restructure;
    third: now). Promotion-ready for distilled.md.
  - **Frontmatter field naming with date suffixes locks documents to
    their authoring moment.** I introduced a novel frontmatter field
    `companion_explorations_2026_04_19` on the capability-matrix
    exploration. Docs-adr-reviewer flagged it: the date suffix turns
    the field into a single-snapshot marker that no second pass would
    reuse, defeating the purpose of structured frontmatter. Renamed to
    `informed_by:` (a stable, reusable predicate). Adjacent rule:
    novel frontmatter fields earn their place by being reusable across
    documents and across edits; date-suffixed fields are a smell.
  - **The "Plan Density Invariant" governs plans-folder density but
    must explicitly disclaim explorations.** Reviewer pushback on the
    observability README: the Plan Density Invariant (one
    `current/`/`active/` plan per workstream slot) was being read as
    governing exploration density too. It does not — explorations live
    under `docs/explorations/` and have a different lifecycle. Fix:
    added a "Scope clarification" line plus a separate
    "Exploration-density brake" subsection (review old, unauthored
    stubs every 6 weeks; either author, escalate to plan, or close
    with rejection rationale). Pattern observation: invariants written
    for one tier (plans) get conscripted into governing adjacent tiers
    (explorations) unless the scope is named explicitly. Watchlist:
    "tier-scope-must-be-explicit-for-shared-vocabulary-invariants."
  - **`observability.setUser({ id: userId })` is real, present, and
    needs an architectural ruling, not silent acceptance.** L-DOC
    initial caught the doc/code mismatch (doc claimed userId was
    excluded; code includes it). This session added a TSDoc note at
    the call site (`apps/oak-curriculum-mcp-streamable-http/src/
    mcp-handler.ts`) documenting the privacy posture and pointing at
    `docs/explorations/2026-04-19-redaction-policy-clerk-identity-
    downstream.md` as the open ruling. The TSDoc is a *holding
    pattern*; the substantive ruling still requires owner adjudication.
    Pattern observation: when code embodies an unwritten policy
    decision, the holding pattern is "TSDoc points at the open
    exploration that owns the ruling." Watchlist candidate: "code-
    embodied-policy-without-explicit-ruling-needs-tsdoc-pointer."
- **Recent surprises / corrections** (2026-04-19 L-DOC initial session):
  - Content-presence tests violate testing-strategy.md. The maximisation
    plan's prescribed L-DOC §RED shape (structural token-presence test)
    was authored, confirmed red, then removed after owner flagged the
    directive. Correction propagated to the plan; acceptance moved to
    reviewer matrix.
  - Cross-session ADR filename drift — 11 broken ADR slugs in new docs
    caught by `onboarding-reviewer`. Pattern: new docs citing ADRs must
    verify filenames against the on-disk directory, not against
    plan-prose references.
  - Type-conflation: `SentryPostRedactionHooks` (3 members) ≠
    `SentryRedactionHooks` (5 members). Caught by `docs-adr-reviewer`.
    The barrier wires five hooks; three admit consumer post-redaction
    slots. Both docs now distinguish them.
  - `userId` IS set on Sentry scope via `observability.setUser({ id:
    userId })` at `src/mcp-handler.ts` — my doc claim that it was
    "excluded by Oak policy" contradicted the code. Doc corrected;
    architectural question (should `userId` reach Sentry scope?) raised
    as a follow-up for owner/fred adjudication.
  - Third instance of "reviewer real-code audit catches a plan's own
    blind spot": Phase 5 span-predicate (1st), L-EH warn→error
    (2nd), L-DOC content-presence test shape + ADR-filename drift + type
    conflation + userId scope (3rd — four sub-instances in one lane).
    This pattern is now promotion-ready for distilled.md.
- **Open questions / low-confidence areas**:
  - **Exploration 9 (warehouse vendor selection)** — open. Owner
    statement names BigQuery as the org-preferred candidate but
    verification is deferred. Scope split into identity-independent
    selection criteria (decidable now) and identity-sensitive
    admissibility checks (gated on Exploration 10).
  - **Exploration 10 (Clerk identity policy for downstream sinks)** —
    open. Three coherent positions named: anonymous-only across all
    sinks; identified single-sink (Sentry only); identified all sinks.
    The latter two are "doctrine forks" requiring ADR clarification
    (ADR-160 closure principle holds either way; the ruling lives at
    the policy layer the closure rule consumes). Owner adjudication
    needed before warehouse adapter authoring can begin.
  - Should `userId` reach the Sentry user scope, or is Oak's observability
    boundary meant to exclude it? Today the code includes it; the docs
    now match the code; a TSDoc note at `mcp-handler.ts` points at
    Exploration 10 as the open ruling. Subsumed under Exploration 10.
  - MCP-specific telemetry shape (tool/resource/prompt observations
    retaining only kind/name/status/duration/trace) is a property of
    `wrapMcpServerWithSentry` + `sendDefaultPii: false` + Oak redaction
    combined — not testable at the Oak boundary alone. Candidate for a
    future lane when the events-workspace (Wave 2) provides assertion
    shapes.
- **Next safe step**: Execute L-7 per
  [ADR-163](../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md)
  and the L-7 lane body in
  [`observability/active/sentry-observability-maximisation-mcp.plan.md`](../plans/observability/active/sentry-observability-maximisation-mcp.plan.md).
  Scope: add `VERCEL_GIT_COMMIT_REF` + `SENTRY_RELEASE_REGISTRATION_OVERRIDE`
  to `SentryConfigEnvironment`; extend `resolveSentryEnvironment` to
  implement the ADR-163 §3 truth table; add `git.commit.sha` tag to
  `initialiseSentry` `initialScope.tags`; author
  `apps/oak-curriculum-mcp-streamable-http/scripts/sentry-release-and-deploy.sh`
  orchestrator + its fake-CLI tests; add `build:vercel` npm script;
  update the Vercel Project Build Command setting. Plus the reviewer
  matrix per the lane's acceptance criteria. Wave 1 closes when L-7
  lands (plus the Phase 1 close external-demonstration criterion).
  Phase 2 lanes (events workspace, multi-sink conformance, feature-
  flag provider selection) sit behind that. Wave 4 L-12 (widget
  Sentry) substrate is now ready (observability is browser-safe by
  construction), but the widget lane itself is a Wave 4 item, not
  the next forward-motion target.
  **Alternative landing targets** (if the next session is owner-
  adjudication-shaped rather than code-shaped): close Exploration 10
  (Clerk identity policy ruling); close Exploration 9 (warehouse
  vendor) on identity-independent criteria. (ADR-163 acceptance +
  L-7 authorisation both settled 2026-04-19, so those are no longer
  alternative targets.)
- **Deep consolidation status**: **in progress this handoff — owner
  explicitly requested `jc-consolidate-docs` after the primitives
  consolidation landed**. Triggers that fire: plan closed (primitives
  consolidation + L-12-prereq); settled doctrine in ephemeral
  artefacts (architectural-excellence-over-ADR-honour; amend-not-
  honour-when-simplification-surfaces; type-unification-dissolves-
  work-streams); repeated surprises across sessions (E2E flakiness
  reaching third instance is promotion-ready; reviewer-findings-
  applied-in-close pattern confirmed across L-EH / L-DOC /
  primitives-consolidation; reviewer-matrix-completeness-is-not-
  absolute new); documentation drift (plan entries in `current/` now
  belong in `archive/completed/`; transient workspace name
  references in a few plan bodies). Fitness pressure is acute —
  `distilled.md` was at 275/275 (hard limit) before this session;
  `napkin.md` is ~1400 lines (well over the 500-line rotation
  threshold).

### Later Handoff Addendum — 2026-04-19 (KG reframe + shared-worktree state)

- **Workstream**: The branch still belongs to Observability Wave 1 on
  `feat/otel_sentry_enhancements`, but a later 2026-04-19 session also
  completed a knowledge-graph discovery-surface repair lane on the same
  shared worktree. That docs lane reframed the
  `knowledge-graph-integration` hub so it no longer reads as an EEF-only
  lane, removed the lingering Neo4j-default framing from the KG
  decision surfaces, and repaired moved-link propagation across the KG,
  semantic-search, SDK/MCP, report, and high-level-plan discovery
  surfaces.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/archive/completed/observability-primitives-consolidation.plan.md`
    remains the next observability landing target and the branch's main
    blocker-clearing lane.
  - `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
    remains the authoritative lane-level execution surface for Wave 1.
  - `.agent/plans/knowledge-graph-integration/future/direct-ontology-use-and-graph-serving-prototypes.plan.md`
    and
    `.agent/reports/oak-ontology-mcp-search-integration-report-2026-04-19.md`
    were discovery-wired and reframed in docs during the later handoff
    session, but no KG execution plan was promoted or closed.
  - No observability active plan status was changed by the KG docs lane;
    plan authority remains where it already was.
- **Current state**:
  - `HEAD` is still `095e66d4`; no new commit was made in the later KG
    docs session.
  - The shared worktree is **not** in the earlier "only handoff-session
    edits" state anymore. It now contains substantial in-progress
    observability execution work in `@oaknational/observability`,
    `@oaknational/logger`, `@oaknational/sentry-node`, related app
    call-sites, workspace metadata, and deletions of
    `packages/core/telemetry-redaction-core/`, alongside the KG docs
    cleanup edits and napkin/prompt updates.
  - Because multiple agents are working in the repo, the worktree must
    be treated as shared mutable state. Re-read `git status --short`
    before any edit or cleanup step; do not assume an earlier snapshot
    is still true.
- **Current objective**:
  - For observability, the immediate objective is still to land the
    primitives-consolidation plan cleanly and return the branch to a
    coherent post-scaffold architecture before any merge attempt.
  - For the KG lane, the objective of the later session is complete:
    discovery surfaces now consistently route readers to the ontology
    report, the direct-ontology/platform-comparison plan, and the moved
    KG active/research surfaces without the old EEF-only or
    Neo4j-by-default drift.
- **Hard invariants / non-goals**:
  - Do **not** discard surprising worktree changes. Shared-state safety
    wins over local neatness.
  - Do **not** let docs cleanup imply authority transfer: observability
    active plans remain authoritative for observability scope; KG docs
    changes were navigation and framing corrections only.
  - Do **not** reopen deep consolidation from this handoff. The owner
    explicitly requested: record what needs recording, compact nothing,
    remove nothing, and ignore fitness functions for this closeout.
- **Recent surprises / corrections**:
  - The KG docs move had a wider broken-link surface than it first
    appeared: three stale-path classes were active at once
    (`semantic-search/current/*`, `kgs-and-pedagogy/future/*`, and KG
    active plans still advertised from
    `sdk-and-mcp-enhancements/active/*`), plus moved active-plan
    `Foundation Alignment` links that were now off by one directory.
    The docs reviewer and code reviewer both caught real defects that
    were then fixed in-place.
  - The later KG review round confirmed that wording drift and
    navigation drift interact: the docs can "sound right" while still
    dead-ending at the exact read-order surfaces a fresh reader follows.
  - Owner correction for this handoff: preserve existing continuity
    content in the prompt; add to it instead of compacting or deleting;
    ignore fitness-function-driven escalation for this closeout.
- **Open questions / low-confidence areas**:
  - The observability execution work already present in the worktree may
    have advanced the primitives-consolidation lane beyond the older
    continuity snapshot. The next session should trust fresh disk state
    and active plans over any stale prose here.
  - The IDE still shows
    `.agent/plans/kgs-and-pedagogy/future/ontology-repo-fresh-perspective-review.plan.md`
    as an open tab, but the authoritative tracked file is now under
    `knowledge-graph-integration/future/`. Treat the old path as stale
    editor context, not authoritative repo structure.
- **Next safe step**:
  - Re-ground from the observability consolidation plan, then re-read
    `git status --short` and the touched observability files on disk
    before making any further edits. Assume other agents may have
    advanced the fold from scaffold-removal into real implementation.
  - If the next session is KG-facing instead, no new planning move is
    required first; start by validating the repaired discovery surfaces
    against whatever new concurrent edits landed after this handoff.
- **Deep consolidation status**:
  - **not due — owner-directed lightweight handoff only.** This
    closeout records continuity additively, does not compact existing
    prompt content, does not remove prior handoff material, and
    intentionally ignores fitness functions and consolidation-triggered
    escalation for this session.

### Later Handoff Addendum — 2026-04-20 (practice-aligned project-directions research closeout)

- **Workstream**: A parallel agentic-engineering thread completed a
  broad-before-deep direction-of-travel research session on
  2026-04-20. The observability Wave 1 lane (L-7) and the
  knowledge-graph discovery surfaces are unchanged by this thread.
  The next handover for this thread is:
  `.agent/prompts/agentic-engineering/governance-planes-research-and-reporting.prompt.md`
  (rewritten 2026-04-20 from "research" to "plan-surface
  integration"). That prompt is now the authoritative entry point
  for the agentic-engineering thread; the rest of the live contract
  above remains authoritative for the observability and KG threads.
- **Active plans**:
  - All observability and KG plan authority above is unchanged.
  - `.cursor/plans/practice-aligned_project_directions_research_ea215686.plan.md`
    is **complete end-to-end**; this session ran every phase
    (assumptions-pass + Slices A/B/C/D + analysis baseline + report
    decision + routing + closeout). The plan file itself was not
    edited per owner instruction.
  - `.agent/plans/agentic-engineering-enhancements/current/governance-concepts-and-agentic-mechanism-integration.plan.md`
    remains the closest existing plan-surface neighbour; the next
    session evaluates it (and the other plans in that lane) as
    candidate absorbers for the eight uplift candidates the analysis
    baseline named.
- **Current state**:
  - Branch / HEAD / commits unchanged by this thread (research-only
    session; no commits made).
  - Five new durable artefacts on disk (one analysis, one
    cross-lane synthesis, three reconnaissance notes) and six
    routing surfaces updated (research-lane README; governance-
    planes README; operating-model-and-platforms README; analysis
    README; existing baseline; existing integration report). All
    artefacts and updates are listed in the closeout block of the
    napkin entry below.
  - `.agent/memory/napkin.md` grew from ~377 to 408 lines with the
    2026-04-20 entry. Distilled.md is unchanged at 272/200 (target)
    / 275 (hard limit) — soft-zone, no graduation surfaced this
    session.
- **Current objective** (next session for this thread): Examine the
  `agentic-engineering-enhancements/` plans surface and decide how
  to absorb the eight uplift candidates without churning the plans
  surface into low-signal work. The framing question — recorded in
  the rewritten prompt and the napkin closeout — is **not** "which
  candidate do we adopt?" but "is the existing plans surface sized
  to absorb these candidates?". Adoption decisions follow the
  scope-and-sequencing answer.
- **Hard invariants / non-goals**:
  - All observability / KG invariants above hold.
  - Research-thread fences inherited: no doctrine edits (ADRs,
    `/docs/**`, Practice Core, directives, principles, canonical
    adapter content); no product code; no quality-gate runs beyond
    markdownlint where required.
  - Added for the next session: no new plan created without owner
    approval; no silent candidate adoption; spinning up a new plan
    is itself the kind of churn the next session is meant to assess.
- **Recent surprises / corrections** (2026-04-20):
  - **Convergence-not-divergence across all four research slices.**
    Five direction signals (Agent Skills as cross-tool standard;
    plugins as distribution layer; reviewer-systems as the densest
    underdeveloped neighbour; durable-orchestration as the dominant
    platform pivot; OTel GenAI semconv as the only obvious sole-
    standard) repeated across Slices A/B/D and re-routed cleanly
    through Slice C. The repo is **already aligned** with the
    direction of travel on most of these; the work is uplift, not
    pivot. This shifts the planning conversation from "what to
    build" to "where to absorb without churn".
  - **Conceptual alignment of the Practice five-file package as a
    plugin** — not an adoption signal, but a vocabulary signal. The
    ecosystem now has stable language ("plugin", "skill",
    "AGENTS.md") for substance the Practice has carried for months
    in a different vocabulary. Routing the Practice package
    externally with the ecosystem-shared terms is candidate 4
    (cross-platform surface matrix refresh) and overlaps with
    candidate 3 (continuity-lane vocabulary alignment).
  - **Two transferable principles from external systems**: (i) treat
    untrusted-context state as untrusted (Anthropic context
    engineering applied to compaction); (ii) policy-engine purity as
    a cleavage boundary (OPA's separation between authoring and
    enforcement). Neither is a new mechanism; both sharpen reasoning
    about existing mechanisms when they next get edited.
  - **`assumptions-reviewer` pre-pass paid off twice over.** The
    amendments (parent-led WebFetch first; Slice A guaranteed, B/D
    reconnaissance-first, C synthesised after; "no new lane until
    evidence proves it" fence) prevented two wasted lanes
    (`practice-methodology-ecosystem`, `adjacent-enablers`) and an
    over-large multi-agent fan-out. Pattern candidate:
    `assumptions-reviewer-on-broad-research-plans-prevents-lane-
    inflation`.
  - **No consolidation graduation surfaced.** The watchlist items
    from this session are all single-instance observations
    (transferable principles, vocabulary-alignment hint,
    derived-memory under-signal, planning-surface absorption
    capacity). None has crossed the "stable across sessions" bar.
    Distilled.md and ADR/PDR scans both produced "nothing
    qualifies"; this is itself the finding, not a skipped step.
- **Open questions / low-confidence areas**:
  - The framing question above — capacity of the existing
    `agentic-engineering-enhancements/` plans surface to absorb
    eight uplift candidates without low-signal churn. Cannot be
    answered until the next session reads the plans-surface state.
  - Whether the OTel GenAI semconv stability ladder (events
    Stable; metrics Development; agents Experimental) deserves an
    explicit telemetry-shape entry in the existing observability
    plan, or sits comfortably below planning attention until a
    metric class promotes. Watchlist item.
  - Whether the derived-memory lane's weak external signal
    (graph-construction ecosystem move toward LLM-driven; no
    obvious agent-as-graph-navigator standard to track) merits a
    deliberate "no candidates this round, watch list X / Y / Z"
    note inside that lane. Watchlist item.
- **Next safe step**:
  - Open the rewritten prompt
    (`governance-planes-research-and-reporting.prompt.md`), then
    read the analysis baseline first, then the cross-lane survey,
    then the existing plans surface in
    `.agent/plans/agentic-engineering-enhancements/`. Surface the
    plans-surface scope-and-sequencing observations as a numbered
    decision list before proposing any candidate adoption.
  - For the observability and KG threads, the prior live-contract
    next safe step is unchanged.
- **Deep consolidation status**:
  - **completed this handoff — owner explicitly requested
    `jc-consolidate-docs` after the practice-aligned research
    landed**. Triggers evaluated: napkin pressure soft (408/500,
    just over the 400-line floor; below rotation threshold);
    distilled fitness soft (272/200 target, 272/275 hard — soft
    zone); no plan or milestone closed in product surfaces (the
    research plan is in `.cursor/plans/`, not the repo plans
    surface); no settled doctrine in ephemeral artefacts; no
    repeated cross-session corrections that warrant a new rule;
    no documentation drift. Consolidation ran with explicit
    "nothing qualifies" findings on PDR scan, ADR scan, pattern
    extraction, and Core upstream review. No graduation moves
    landed; no fitness threshold edits. Recorded as a deliberate
    "review reached" rather than "review skipped".

The older observability-specific sections below are historical branch context
only. They are not the active handoff contract for the next session.

## Historical Branch Context (Preserved Pending Consolidation)

The material immediately below is retained as older branch context for a later
bounded consolidation pass. It is not the live work contract for the next
session.
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
- **Current objective** (next session): **Continue Wave 1 of the
  observability MVP execution**. Phase 5 of the restructure is
  closed; ADR-162 is Accepted; **L-EH initial landed** (ESLint core
  `preserve-caught-error` at `error`, 0 violations). Three Wave-1
  lanes remain, each authored independently in the maximisation plan
  (`.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`):

  1. **L-EH initial** — ✅ **LANDED 2026-04-19**. Re-scoped from
     custom `require-error-cause` to ESLint core's built-in
     [`preserve-caught-error`](https://eslint.org/docs/latest/rules/preserve-caught-error)
     (added in 9.35.0; a documented superset of the planned custom
     rule additionally catching destructured-parameter loss and
     variable shadowing). Wired at `error` with
     `requireCatchParameter: true`, scoped to `src/**/*.ts` in the
     same 5 workspaces as `require-observability-emission`.
     Pre-enable audit: 0 violations in-scope; `pnpm check` exit 0
     post-enable. ADR-162 History block records the re-scope.
  2. **L-DOC initial** — expand `packages/libs/sentry-node/README.md`
     (currently a 4-line stub) and author
     `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`.
     Structural test must assert content presence (not just file
     existence).
  3. **L-12-prereq** — extract pure runtime-agnostic redactor core
     from `@oaknational/sentry-node` into new browser-safe package
     `packages/core/telemetry-redaction-core/`. Depends only on
     type-helpers + generic redact primitive; no `@sentry/node`.
     Node and browser adapters compose it. Settles ADR-160's open
     question: new package, not submodule. Blocks L-12.
  4. **L-7** — wire `sentry-cli releases set-commits --auto` and
     `releases deploys new` into CI/deploy flow. Closes
     regression-detection loop. Vercel deploy pipeline only (not
     GitHub Actions PR checks) per A.3 settlement. Uses explicit
     `--commit $GIT_SHA` form.

  These four can land in any order; none blocks another. Each is
  a separate commit closed by the maximisation plan's reviewer
  matrix (§P1.4 at phase close).

  **Wave 1 is "partially opened" — it formally closes only when
  all four remaining lanes land** plus the Phase-5 rule (already
  landed) and the Wave-1 ESLint rules all pass `pnpm check` in
  aggregate. Wave 2 (events workspace) must not open until Wave 1
  closes; schemas-before-emitters is load-bearing.

  **Address the 96 coverage-gap warnings?** Not yet. Each is a
  lane-surface for Wave 3+ emitter work. Triaging them now would
  invert the wave ordering. Leave at `warn` until Wave 3 lanes
  work through the emitter population or until owner signals a
  coverage-closure lane.

  **Pending minor follow-ups from this session's reviewer matrix**:
  - fred's out-of-scope note: `no-export-trivial-type-aliases` is
    exported from the plugin's `rules` record but NOT registered
    in the inline `@oaknational` plugin in `recommended.ts`
    (asymmetric with `no-eslint-disable` and the newly-landed
    `require-observability-emission`). Not a bug; cosmetic
    inconsistency worth a tiny cleanup when next in the file.
  - fred's Finding 2 positive: RuleTester case for sentinel
    comment + unrelated comment adjacency is authored but minimal;
    expand if the sentinel contract tightens during Wave-3 emitter
    work.

  **Sibling backlog work** (concurrent / not blocking Wave 1):
  `.agent/plans/architecture-and-infrastructure/current/test-ceremony-production-factory-audit.plan.md`
  — migrate remaining test files off `loadRuntimeConfig` +
  `createHttpObservabilityOrThrow` ceremony; flip ESLint
  `no-restricted-properties` and `no-restricted-imports` from `warn`
  to `error` when backlog reaches zero. ~34 total violations today.
- **Deep consolidation status**: **due — not-well-bounded for this
  closeout** (now carrying L-EH initial substance on top of the
  already-deferred Phase-5 surprises). L-EH initial closed 2026-04-19
  is a lane-close milestone (session-handoff gate checklist item #1);
  the built-in-superset discovery + reviewer-driven warn→error flip
  + the self-referencing-comment-trigger observation are all
  single-instance-but-substantive candidates. **distilled.md is now
  at 275 lines — exactly the hard limit** (target 200, limit 275)
  after adding two L-EH-session watchlist entries (externally-
  verifiable-output beats plan-compliance; decompose-precedents-
  before-reusing). The next consolidation MUST refine; the file
  has no further soft headroom. BUT running consolidate-docs now
  would be the third structural-change pass in a single day
  (morning: `2dc4d40b`; Phase 5 close: already-deferred; L-EH initial
  now): pattern-inflation risk is compounded, not reduced. The
  structural-change-rate diagnostic from ADR-131 §Self-Referential
  Property explicitly warns against this. Next session opens the
  deep pass deliberately. Content to process when it opens:
  - Phase 5 carried substance (already captured):
    contravariance-at-plugin-slot, MaybeNamedFunctionDeclaration
    subtyping workaround, workspace-cwd regex-vs-glob,
    real-code-audit-over-synthetic-tests.
  - L-EH initial new substance:
    - **ESLint-built-in-supersedes-planned-custom-rule** — the
      owner's "check the upstream tool first" reflex caught a
      custom-rule authorship that would have been a worse wheel;
      single-instance, candidate pattern for "survey the ecosystem
      before authoring custom infrastructure"
    - **Self-referential-comment-trigger** — a lint rule's
      enforcement regex matched against a comment that *documented*
      the rule's opt-out syntax; single-instance, candidate pattern
      for "code config must not reference its own suppression
      syntax in comments"
    - **Reviewer-driven severity-correction** — fred's TO-ACTION
      flipped warn→error using `warning-severity-is-off-severity`
      against the plan's own evidence (audit=0 violations); second
      instance of "reviewer real-code audit catches a plan's own
      blind spot" (first instance: Phase 5's span-predicate gap).
      Promotion candidate to distilled.md as a general principle.
    - **ADR-088 discipline is observably followed in practice** —
      0 violations across 5 workspaces' src/, 3 sampled real
      catch+throw-new sites all pass `{ cause }` correctly.
      Evidence that the existing rule + ADR actually shapes behaviour
      without custom gating. Worth noting but not yet a pattern.
  - distilled.md compression back toward 200-line target.
  - Core-trinity refinement (still deferred from morning pass).
  The completed-pass
  entry below remains authoritative for the morning's consolidation
  (commits `2e0be715` → `2e8a140d`):
  - **Three new memory/patterns**: `stage-what-you-commit.md`
    (2 cross-session instances), `foundations-before-consumers.md`
    (owner-approved; multi-emitter wave ordering),
    `collapse-authoritative-frames-when-settled.md` (owner-approved;
    third-layer sibling of the no-smuggled-drops family).
  - **PDR-025 Quality-Gate Dismissal Discipline** graduated from
    the distilled entry "All gates blocking, no pre-existing
    exceptions" (owner-approved). Composes with PDR-008/012/017/020.
  - **practice-lineage.md** Active Learned Principle
    `Compressed neutral labels smuggle scope and uncertainty`
    extended to cover the document-structure layer as a third
    sibling (owner-approved).
  - **Distilled refinements**: `@ts-expect-error` sharpened to
    test-design-specific scope; forward-pointing-refs added as
    single-instance watchlist.
  - **Core trinity fitness limits raised modestly** per owner
    direction (practice-bootstrap / practice-lineage / practice.md):
    soft + hard line + char limits up ~10%. Full refinement and
    reflection of the Core explicitly deferred to a future session.
    Strict-hard state post-raise: 3 hard items (AGENT.md,
    principles.md, testing-strategy.md) matching the known-deferred
    directives; Core trinity now soft-zone, not hard.
  - **Outgoing reservations** shifted +1 (PDR-025 claimed; slots
    026–029 remain open).
  - **Plan hygiene**: observability-strategy-restructure.plan.md
    status line + Phase 3 & 4 todo notes corrected.
  - **Napkin rotated**: 2026-04-19 archive + fresh napkin file.
- **Restructure phase map** (from the restructure plan):
  - **Phase 1** Structural skeleton — ADR-162 Proposed, directories,
    moves, cross-references. ✅ **Complete 2026-04-18** (commit `502af060`).
  - **Phase 2** MVP scope pass — filled high-level plan; authored 5
    new `current/` plans + 11 `future/` plans with promotion triggers.
    ✅ **Complete 2026-04-18** (commit `231046fe`).
  - **Phase 3** Exploration kickoff — two full explorations
    (accessibility at runtime; event schemas for curriculum
    analytics) + six stubs. ✅ **Complete 2026-04-18** (commit
    `bae88488`).
  - **Phase 4** Executable plan revision — swap L-4a/L-4b; MVP
    classification; cross-refs. ✅ **Complete 2026-04-18** (commit
    `2e0be715`). Followed by status markers (`f1f2c259`), 5-wave
    execution reshape (`7f5b18e7`), and physical reorder of lanes to
    match execution order single-frame (`2e8a140d`, 2026-04-19).
  - **Phase 5** ADR-162 acceptance — `require-observability-emission`
    ESLint rule landed at `warn`; reviewer-matrix axis-coverage
    question codified; ADR-162 flipped Proposed → Accepted. ✅
    **Complete 2026-04-19** (commit `fc0a0602`). This is Wave 1 of
    the MVP execution reshape; formally Wave 1 stays "partially
    opened" until L-EH initial / L-DOC initial / L-12-prereq / L-7
    all land.
- **Wave 1 remaining work** (next session — L-EH initial landed
  2026-04-19; three lanes remain):
  - **L-DOC initial** expand sentry-node README + write app
    observability doc; structural test asserts content presence.
  - **L-12-prereq** extract `packages/core/telemetry-redaction-core/`
    so Node and browser adapters compose a shared redactor core;
    blocks L-12.
  - **L-7** `sentry-cli releases set-commits --auto` +
    `releases deploys new` in Vercel deploy pipeline.
- **Recent surprises / corrections (2026-04-19 Phase 5 ESLint rule landing)**:
  - **TSESLint vs core Rule typing is contravariant at the plugin slot.**
    Authoring an ESLint rule with `TSESLint.RuleModule<'messageId'>`
    typing (the typescript-eslint idiom, typed messageIds) is fine
    at the rule source but fails to satisfy `ESLint.Plugin.rules`
    when embedded in a `Linter.Config.plugins` slot — because
    TSESLint's richer rule-context has more methods than core's,
    and TypeScript's contravariance rejects the substitution. The
    clean resolution is to type the rule as core `Rule.RuleModule`
    (ESTree node types from `estree`), giving up compile-time
    messageId typing in exchange for structural compatibility.
    Mirrors the existing `no-eslint-disable.ts` pattern. Documented
    in the new rule's TSDoc. Rule: for a new rule that must live in
    `recommended.ts`'s inline `@oaknational` plugin, use core
    `Rule.RuleModule`; for a rule that only lives in the plugin's
    `rules` export (not the inline preset plugin), TSESLint
    typing is fine (e.g. `no-export-trivial-type-aliases`).
  - **`MaybeNamedFunctionDeclaration` subtyping friction on default
    exports.** ESTree's `ExportDefaultDeclaration.declaration` is
    typed `MaybeNamedFunctionDeclaration | MaybeNamedClassDeclaration
    | Expression` where `MaybeNamedFunctionDeclaration` is a
    supertype of `FunctionDeclaration` with `id: Identifier | null`.
    Trying to narrow and then assign to an `ESTree.Node`-typed slot
    fails without an assertion. Fix: track *export declaration
    anchors* (`ExportNamedDeclaration` / `ExportDefaultDeclaration`
    wrappers) rather than the inner function nodes; ancestor-walk
    from the CallExpression finds the anchor identity regardless of
    the inner function's sub-type. Behaviourally equivalent; side-
    steps the subtyping friction entirely. Documented in the rule's
    TSDoc.
  - **Workspace-scope filter with glob fails under ESLint's per-
    workspace cwd.** A rule using
    `minimatch(rel, 'apps/*/src/**/*')` against
    `context.physicalFilename` never matches — ESLint's `cwd` is
    the WORKSPACE root, not the repo root, so the resolved relative
    path is `src/foo.ts` (no `apps/` prefix). Fix: use regex with
    path-segment anchors like `/(?:^|\/)apps\/[^/]+\/src\//u`,
    which works on both absolute and repo-relative POSIX paths
    regardless of cwd. Adds absolute-path RuleTester cases to
    exercise the real-run code path. One-instance watchlist; may
    be a general pattern if a second workspace-level rule hits it.
  - **Fred caught a real false positive: span-based emission
    predicates.** Two real sites (`fetchUpstreamMetadata`,
    `proxyUpstreamAsset`) emit solely via `observability.withSpan`
    — a legitimate engineering-axis emission per ADR-162's
    Five-Axes table, but not in my initial predicate. Extended
    CAPTURE_METHODS to include `withSpan`, `startSpan`,
    `startActiveSpan`, `setAttribute`, `setAttributes`,
    `recordException`, `addEvent`. False-positive count dropped
    from 4 to 2 on the MCP app. Reviewer audit of real emitter
    shapes before escalating a rule to `error` is load-bearing;
    a predicate validated only against synthetic RuleTester cases
    is a partial validation.
  - **`@types/estree` is not a transitive dep that declares itself
    in every workspace.** Importing `import type * as ESTree from
    'estree'` surfaced as a knip "unlisted dependency" in the
    oak-eslint package. Added `@types/estree: ^1.0.8` to
    `devDependencies`. Small, but a live instance of the "knip
    flags undeclared types" signal.
  - **Pre-commit hook shapes the commit message.** Commitlint
    enforces `body-max-line-length: 100` (matching the prose-
    line-width config). Initial commit message had plan-file paths
    over 100 chars; rejected. Fix: shorten + wrap. Subject kept
    under 80 per prior napkin rule. Adjacent convention: plan file
    paths in commit bodies should be unqualified file names, not
    full `.agent/plans/.../foo.plan.md` paths.
  - **SHA references in the very commit that creates them are
    inherently unstable.** My first instinct was to amend the
    restructure plan's Phase-5 todo note to include the commit SHA,
    then amend the commit — but that just shifts the SHA again.
    Owner's correction: delete the SHA from the doc entirely; plan
    and git are independent systems. Keep cross-references between
    them symbolic (phase names, lane IDs) rather than SHA-pinned.
    Pattern candidate if a second instance surfaces; file-level
    candidate name: `plan-and-commit-are-independent-systems`.
  - **E2E flakiness under parallel `pnpm check` load.** Two
    separate `pnpm check` runs during Phase 5 produced two
    DIFFERENT E2E test failures
    (`enum-validation-failure.e2e.test.ts` timeout;
    `built-server.e2e.test.ts` unexpected 404), each passing
    cleanly in three isolated e2e runs (all 24 files, 161 tests
    green in ~4s). The pattern is parallel-load inter-test race
    (shared port? cache invalidation?), not a deterministic bug
    caused by Phase 5 (which is lint-only). Per PDR-025 this is a
    test-stability lane rather than a "pre-existing dismissal";
    name it explicitly if a second session confirms the pattern.

- **Recent surprises / corrections (2026-04-19 docs-hygiene parallel track)**:
  - **Numbered-claim drift is a recurring failure mode.** Three
    independent reviewer rounds on the onboarding/Practice surface
    surfaced four separate instances of "live document asserts a
    count that no longer matches reality": pattern count (claimed
    56/57, actual 77 — fixed earlier session); rule count (claimed
    34, actual 25); stable command count (claimed 10, actual 12);
    skill count (claimed 27, actual 23). All four lived in
    `practice-index.md` simultaneously. Mechanism: when a numbered
    claim is written, no fitness function ties it to its source
    enumeration, so divergence is silent. Watch-list candidate for
    pattern extraction if a second cross-session instance surfaces;
    until then, the napkin entry is the capture surface.
  - **Subagent-driven review rounds catch self-inflicted regressions.**
    Round 2 of the docs review caught a 106-char prose-line-width
    violation introduced by Round 1's own AGENT.md condensation
    work, plus stale ADR titles I copy-pasted into PDR-001's
    host-local context. Pattern (already known): "fix-and-review
    cycles must include the diff the fix introduced, not just the
    target it was repairing." Restated, applied, no new pattern
    file needed.
  - **Workspace READMEs are an asymmetric onboarding hop.** Root
    README + CONTRIBUTING route into workspace READMEs, but
    workspace READMEs did not route back. Reciprocity gap caught
    only when a reviewer walked the path from inside out. Fixed
    with "New here?" signpost blocks in
    `apps/oak-curriculum-mcp-streamable-http/README.md` and
    `apps/oak-search-cli/README.md`. Watch-list: any other workspace
    README without a back-link to repo-level onboarding is a latent
    instance of the same shape.

- **Recent surprises / corrections (2026-04-18 → 2026-04-19 planning restructure Phase 4 + reshape + physical reorder)**:
  - **"We are building containers for things without actually
    building them"** — owner observation mid-session. The planning
    work created cross-references to plans for workspaces that don't
    yet exist on disk (`packages/core/observability-events/`,
    `packages/core/telemetry-redaction-core/`). The containers (plans,
    classification tables, cross-refs) were real; the contents (code,
    schemas, workspaces) were planned. Fix: status markers ("planned,
    not yet code") landed at forward-pointing references; deeper fix:
    planning work at this scale should interleave with thin slices of
    implementation so the plan-vs-code gap doesn't accumulate.
  - **Schemas-before-emitters is a load-bearing ordering principle.**
    Initial plan ordering had emitters (L-1, L-3, L-4b, L-9) landing
    before the events-workspace schemas they would emit through. This
    guarantees retrofit: every fixture assertion emits through ad-hoc
    shapes, then gets rewritten when schemas land. The 5-wave
    reshape fixed it by putting the events workspace in Wave 2
    before any Wave 3 emitter. Related principles: rules-before-code;
    extracted-cores-early. Generalises: when a plan has N emitters
    depending on a shared schema, authoring the schema is the gate.
  - **Dual-frame labels invite drift; collapse them before the
    reader encounters them.** My initial 5-wave reshape kept
    historical `## Phase N` headers + per-lane "**Execution phase**"
    notes + an authoritative §Phase Structure table. Owner corrected:
    "we shouldn't allow inaccurate plans to persist." Rule: a
    document with multiple authoritative frames for the same concept
    is a drift trap; resolve to one frame when the decision is
    settled. "Transitional dual-frame with sunset note" is not
    stable — the sunset never fires in practice.
  - **`git commit` after `git add <file>` includes pre-existing
    staged changes.** When `git status` shows `MM` on unrelated
    files, plain `git commit` after staging my own file bundles the
    already-staged work into the commit. Commit message described
    only my change; commit content carried more. Rule: inspect the
    index state (`git diff --cached` or careful two-letter-code
    read) before committing; unstage unrelated with `git restore
    --staged <path>`.
  - **Commit-msg header 100-char limit catches em-dash-heavy
    subjects.** Auto-mode retry handled it, but commit subjects
    should target ≤80 chars for safety margin.

- **Recent surprises / corrections (2026-04-18 observability Phases 1–2 + test hygiene session)** (historical):
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
- **Next safe step**: **L-EH initial landed 2026-04-19 (commit
  `7efd0a43` — composite with 7 forward-motion assurance
  mechanisms and a parallel-track agentic-engineering lane)**.
  Three Wave-1 lanes remain: L-DOC initial (sentry-node README
  expansion + app observability doc), L-12-prereq (extract
  `packages/core/telemetry-redaction-core/`), L-7 (Vercel-only
  release/deploy linkage). None blocks another.
  **Recommended next-session landing target: L-DOC initial**.
  Rationale: (a) closes the reader-side discoverability defect
  that the honest-evaluation pass named as the load-bearing
  failure today (a new contributor cannot find what Sentry does
  for this app by reading workspace READMEs even though
  `wrapMcpServerWithSentry` sits at `core-endpoints.ts:98`);
  (b) cheapest of the three lanes — text + a structural
  content-presence test, no new code workspace, no deploy
  pipeline work; (c) directly populates the Documentation row
  of acceptance criteria across every future lane, discharging
  doc debt while Wave 1 is still the current wave.
  **Lane close shape**: per §Lane Close Evidence Pattern in the
  maximisation plan, state attempt / observed outcome / proven
  result; update `what-the-system-emits-today.md` if the landing
  moves a cell. Each lane closes with its own reviewer matrix per
  the maximisation plan §P1.4. The sibling
  `test-ceremony-production-factory-audit.plan.md` backlog remains
  concurrent and not blocking Wave 1. Owner may also choose a
  dedicated Core-trinity refinement session (compression +
  reflection) deferred from the 2026-04-19 morning consolidation
  pass — separate from Wave 1.
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

**First action of the next session**: the restructure is closed
(Phases 1–5 complete 2026-04-19). Open the **maximisation plan**
(`.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`)
and pick a Wave 1 remaining lane: L-EH initial, L-DOC initial,
L-12-prereq, or L-7. L-EH is the natural first-pick because its
ESLint-rule authorship reuses the core `Rule.RuleModule` typing
pattern just validated by Phase 5 — that rationale is in the new
rule's TSDoc and in the napkin entry on
contravariance-at-plugin-slot. TDD first at every step. Reviewer
matrix per the maximisation plan §P1.4 at lane close with
**non-leading prompts**. Treat reviewer findings as action items
unless explicitly rejected with written rationale.

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
