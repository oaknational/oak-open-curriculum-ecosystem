---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-19-l-eh-initial-close
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
- **Current state (2026-04-19, HEAD at `3455d26c`, in sync with
  `origin/feat/otel_sentry_enhancements`)**: Observability strategy
  restructure **Phases 1–5 complete**. **ADR-162 Accepted**
  (2026-04-19). **Wave 1 partially opened**: the
  `require-observability-emission` ESLint rule landed at `warn` in
  all `apps/*` and `packages/sdks/*` workspaces (5 wirings, 96
  coverage-gap warnings surface). **L-EH initial landed 2026-04-19
  (later same day)**: ESLint core built-in `preserve-caught-error`
  enabled at `error` severity with `requireCatchParameter: true`,
  scoped to `src/**/*.ts` in the same 5 workspaces. Re-scoped from
  the originally planned custom `require-error-cause` rule when
  surveys found the ESLint 9.35.0 built-in is a documented
  superset; pre-enable audit returned 0 violations in-scope, so
  enforcement landed at `error` from day one per
  `warning-severity-is-off-severity`. Wave 1 remaining: L-DOC
  initial (sentry-node README + app observability doc), L-12-prereq
  (extract `packages/core/telemetry-redaction-core/`), L-7
  (release/deploy linkage). Wave 2 (`packages/core/observability-events/`)
  is the schema-foundation layer that unlocks Wave-3-onwards
  emitter lanes.

  **Commits landed this session, newest first**:
  - `3455d26c` — `docs(agentic-engineering): discoverability hub +
    deep-dives + continuity plans` — 53-file agentic-engineering
    corpus scaffolding (deep-dives, research directories, reports
    scaffolding, 2 new plans, analysis baseline). Parallel-agent
    work committed in a single pass at session close.
  - `fc0a0602` — `feat(observability): adr-162 accepted —
    require-emission rule at warn` — Phase 5 landing: ESLint rule
    + 5 workspace wirings + reviewer-matrix axis-coverage question
    in `.agent/directives/invoke-code-reviewers.md §Coverage
    Tracking` + ADR-162 Proposed → Accepted with a History block
    + restructure-plan Phase-5 todo flipped to completed. Pre-push
    gates all green; pre-commit hooks all green.

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
- **Next safe step**: **L-EH initial landed 2026-04-19**. Pick one of
  the three remaining Wave-1 lanes and author it end-to-end:
  L-DOC initial (sentry-node README expansion + app observability
  doc), L-12-prereq (extract `packages/core/telemetry-redaction-core/`),
  or L-7 (Vercel-only release/deploy linkage). None blocks another;
  L-DOC initial is the natural next pick because it keeps the
  discoverability-of-existing-integration gap (a real defect today —
  `wrapMcpServerWithSentry` is not findable from workspace READMEs)
  in the lane sequence before Wave 2 schema foundation opens.
  Each lane closes with its own reviewer matrix per the
  maximisation plan §P1.4. The sibling `test-ceremony-
  production-factory-audit.plan.md` backlog remains concurrent
  and not blocking Wave 1. Owner may also choose a dedicated
  Core-trinity refinement session (compression + reflection)
  deferred from the 2026-04-19 morning consolidation pass —
  separate from Wave 1.
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
