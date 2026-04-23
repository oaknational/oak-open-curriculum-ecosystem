---
name: "Observability Strategy Restructure"
overview: >
  Structural restructure moving observability from scattered plans under
  `architecture-and-infrastructure/` into a dedicated `plans/observability/`
  directory; drafting foundational ADR-162 (Observability-First across five
  axes + vendor-independence clause); establishing `docs/explorations/` as
  design-space documentation home; creating the six MVP `current/` plans
  and eleven post-MVP `future/` plans so nothing on the enumerated
  observability scope remains unplanned; authoring eight initial
  explorations; revising the active executable plan to reflect MVP
  classification and the `metrics.*` over span-metrics priority swap.
derived_from: feature-workstream-template.md
session_context: ../../../../docs/explorations/2026-04-18-observability-strategy-and-restructure.md
strategic_plan: "observability/future/sentry-observability-maximisation.plan.md (post-move)"
branch: "feat/otel_sentry_enhancements"
todos:
  - id: phase-1-structural-skeleton
    content: "Phase 1: ADR-162 Proposed, docs/explorations/ + README (done — session report is inaugural entry), plans/observability/ + lifecycle sub-dirs + README, move six existing observability plans, update cross-references (session prompt, crosswalk, high-level-plan, archived-plan back-pointers)."
    status: completed
    note: "Executed 2026-04-18. ADR-162 Proposed at docs/architecture/architectural-decisions/162-observability-first.md; observability/ directory tree + README + high-level-observability-plan.md skeleton created; five git mv moves applied (sentry-otel-integration.execution.plan.md deliberately not moved); cross-reference sweep returned zero stale paths."
  - id: phase-2-mvp-scope-pass
    content: "Phase 2: fill high-level-observability-plan.md (MVP across five axes, launch criteria, plan map). Author six new current/ plans (observability-events-workspace, synthetic-monitoring, security-observability, accessibility-observability, multi-sink-vendor-independence-conformance — search-observability already moved). Author eleven new future/ plans each with promotion trigger."
    status: completed
    note: "Executed 2026-04-18 (commit 231046fe). High-level plan filled: principle, five-axis MVP table, launch criteria, MVP gate summary, plan map, explorations map, vendor-independence invariants, coordination points. Five new current/ plans authored at skeleton level (exact scope fills at Phase 3 explorations). Eleven future/ plans authored each with a named testable promotion trigger. search-observability audited for MVP classification. Out-of-plan architectural fix also landed (commit 276ea9bd): tests migrated off loadRuntimeConfig/createHttpObservabilityOrThrow ceremony to hermetic helpers, root-causing a MaxListenersExceededWarning that surfaced during Phase 2 authoring. New rule .agent/rules/test-immediate-fails.md + platform adapters + ESLint gates in @oaknational/eslint-plugin-standards testRules + sibling plan test-ceremony-production-factory-audit.plan.md tracks backlog migration."
  - id: phase-3-exploration-kickoff
    content: "Phase 3: write explorations 3 (accessibility-observability-at-runtime) and 4 (structured-event-schemas-for-curriculum-analytics) in full — blocking on MVP plan scope. Author the other six explorations (sentry-vs-posthog, sentry-as-paas, trust-boundary-propagation, cloudflare-plus-sentry, static-analysis-augmentation, vendor-independence-conformance-test-shape) as focused briefs with problem statement + research questions."
    status: completed
    note: "Executed 2026-04-18 (commit bae86488). Two full explorations + six focused briefs landed per §P3.1–P3.3."
  - id: phase-4-executable-plan-revision
    content: "Phase 4: revise sentry-observability-maximisation-mcp.plan.md — swap L-4a/L-4b priorities (metrics.* primary, span-metrics transitional); mark lanes MVP vs MVP-deferred; cross-reference new MVP lanes (events workspace, synthetic, a11y, security, vendor-independence). Risk row update for metrics.* beta-API shift."
    status: completed
    note: "Executed 2026-04-18 (commit 2e0be715). Maximisation plan revised per §P4.1–P4.4: (1) L-4a/L-4b priority swap in frontmatter, headings, objectives, Phase 2 dependency graph (L-4b → L-4a), and Risk Assessment (new Phase 2 row with concrete changelog-review trigger covering closure milestones, monthly dependency audits, and @sentry/node 10.x minor/major bumps); (2) new §MVP Classification section at plan head with three-column table citing ADR-162 §Principle's 'Omission is explicit and justified, not incidental' clause for every MVP-deferred lane (L-4a, L-5, L-6, L-10, L-11, L-14); (3) §Foundation Alignment extended with ADR-160 and ADR-162 per §P4.2b; (4) eight cross-references added in lane bodies AND new Cross-plan propagation sub-section of §Documentation Propagation. Three-reviewer matrix (sentry-reviewer, architecture-reviewer-fred, docs-adr-reviewer) dispatched at phase close per §P4.4: three TO-ACTIONs applied. pnpm check exit 0 both before and after the reviewer corrections. Post-Phase-4 hardening landed 2026-04-19 across three further commits: f1f2c259 (status markers on forward-pointing references to planned-not-yet-code workspaces), 7f5b18e7 (5-wave execution reshape — authored §Post-Phase-5 Execution Plan in this plan + §Execution Waves in high-level-observability-plan.md), 2e8a140d (physical reorder of the maximisation plan's lane sections to match execution-wave order single-frame)."
  - id: phase-5-adr-162-acceptance
    content: "Phase 5: lock down ADR-162 enforcement mechanics (ESLint rule scope, reviewer-matrix question, conformance test API, vendor-independence test); flip status Proposed → Accepted. Land the ESLint rule as part of the acceptance (even if initially warning-severity while Phase 2 new plans ramp up)."
    status: completed
    note: "Executed 2026-04-19. require-observability-emission authored at packages/core/oak-eslint/src/rules/require-observability-emission.ts (core Rule.RuleModule typing to fit ESLint.Plugin slot; export-anchor tracking to avoid MaybeNamedFunctionDeclaration subtyping friction) + 20 valid + 6 invalid RuleTester cases in require-observability-emission.unit.test.ts. Emission predicate covers logger.* / Sentry.* / delegate-pattern including span/tracer verbs (withSpan, startSpan, startActiveSpan, setAttribute, setAttributes, recordException, addEvent) per architecture-reviewer-fred TO-ACTION — avoids false-positives on trace-only emitters like fetchUpstreamMetadata and proxyUpstreamAsset. Rule registered in the inline @oaknational plugin at recommended.ts and activated at warn in each of the 5 workspaces: apps/oak-curriculum-mcp-streamable-http (2 warns), apps/oak-search-cli (46 warns), packages/sdks/oak-curriculum-sdk (7 warns), packages/sdks/oak-search-sdk (27 warns), packages/sdks/oak-sdk-codegen (14 warns) — 96 total observability-gap warns surface; each is a coverage surface for Wave 3+ emitter lanes. Reviewer-matrix axis-coverage question added at .agent/memory/executive/invoke-code-reviewers.md §Coverage Tracking (adapters are thin pointers; no propagation edits). ADR-162 status flipped Proposed → Accepted (2026-04-19) with a History block recording wave-1 enforcement scope and wave-2 deferrals (schema-usage detection path, vendor-independence conformance test, no-vendor-observability-import lint). Wave-2 cases NOT stubbed as it.skip per .agent/rules/no-skipped-tests.md — schema-usage cases deferred from the test file entirely until the events workspace lands. Reviewer matrix (architecture-reviewer-fred + type-reviewer): 4 TO-ACTION findings all ACTIONED in-place — span-predicate extension, defensive id null-guard on named FunctionDeclaration path, absolute-path RuleTester coverage, delegate-pattern span RuleTester coverage."
  - id: ws-quality-gates
    content: "Full quality gate chain after each phase (pnpm check from repo root, exit 0, no filtering)."
    status: pending
  - id: ws-adversarial-review
    content: "Specialist reviewer passes per phase: Phase 1 docs-adr-reviewer + architecture-reviewer-fred (boundary correctness of new directory structure); Phase 2 docs-adr-reviewer + assumptions-reviewer (plan proportionality + promotion-trigger legitimacy); Phase 3 docs-adr-reviewer; Phase 4 sentry-reviewer + architecture-reviewer-fred; Phase 5 architecture-reviewer-fred + type-reviewer (ESLint rule shape)."
    status: pending
  - id: ws-doc-propagation
    content: "Propagate: session-continuation prompt; high-level-plan references; crosswalk plan; ADR index; AGENT.md (owner-only edit at close; exact text in §Documentation Propagation)."
    status: pending
  - id: ws-consolidation
    content: "Final /jc-consolidate-docs run on restructure close-out; archive this plan; extract reusable patterns (five-axis framing; nothing-unplanned-without-a-trigger; explorations-as-research-deliverable)."
    status: pending
isProject: true
---

# Observability Strategy Restructure

**Template**: Derived from `.agent/plans/templates/feature-workstream-template.md` (ADR-117).
**Last Updated**: 2026-04-19
**Status**: 🟢 Phases 1–5 complete (2026-04-19). ADR-162 Accepted; `require-observability-emission` landed at `warn` across all apps/*and packages/sdks/* workspaces; reviewer-matrix axis-coverage question codified. Wave 1 of the MVP execution reshape is therefore substantially closed — remaining Wave 1 items (L-EH initial, L-DOC initial, L-12-prereq, L-7) are owned by the maximisation plan.
**Branch**: `feat/otel_sentry_enhancements`
**Session rationale**: `docs/explorations/2026-04-18-observability-strategy-and-restructure.md`

---

## Context

This plan carries the execution for the observability direction correction
captured in the session report at
[`docs/explorations/2026-04-18-observability-strategy-and-restructure.md`](../../../../docs/explorations/2026-04-18-observability-strategy-and-restructure.md).
**Read the session report first** for rationale. This plan assumes the
direction is settled and focuses on the phased work to realise it.

Summary of the change:

1. Observability plans move from `architecture-and-infrastructure/` into a
   dedicated sibling `plans/observability/` directory.
2. ADR-162 (Observability-First) is drafted and later accepted, covering
   the five-axis principle (engineering, product, usability, accessibility,
   security) and the vendor-independence clause.
3. `docs/explorations/` is established as documentation home for
   design-space / option-weighing / research documents that sit between
   napkin observations and committed ADRs.
4. `packages/core/observability-events/` becomes a new core workspace
   holding Zod-first schemas for every structured event.
5. Every item previously on the "unplanned" list gets a plan — either MVP
   in `current/` or post-MVP in `future/` with a named promotion trigger.
6. The active executable plan absorbs the `metrics.*` priority swap and
   MVP classification.

---

## Design Principles

Carried from the session report:

1. **Five axes, not just engineering**. MVP spans engineering, product,
   usability, accessibility, security.
2. **Vendor-independence is first-class**. Emissions are provider-neutral
   at the consumer boundary. Minimum functionality (stdout/err) without
   third-party. No consumer couples to a vendor SDK directly.
3. **Event schemas are code-enforced**. `packages/core/observability-events/`
   is the contract with downstream analytics pipelines.
4. **Research + provide data, refine from real needs**. MVP gives
   structural capacity; dashboards and derived views come as needs appear.
5. **Nothing unplanned without a promotion trigger**. Every future item is
   either actioned now or scheduled with a specific event that would
   promote it to active work.
6. **Explorations are research deliverables**. They inform ADRs and plans
   without being substitutes for either.

### Non-Goals (YAGNI for this restructure)

- Re-deriving the five-axis framing — it's settled per the session report.
- Debating `metrics.*` vs span-metrics — owner decided; plan absorbs.
- Building query UIs / dashboards — MVP is emission, not consumption.
- Integrating Statuspage — explicit `future/` with a named trigger.
- Wiring real AI instrumentation — blocked on first LLM-calling tool.
- Selecting a real feature-flag provider — blocked on first A/B need.

---

## Foundation Alignment

Read before each phase:

- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`
- ADR-078 (Dependency Injection for Testability)
- ADR-117 (Plan Templates and Components)
- ADR-143 (Coherent Structured Fan-Out for Observability)
- ADR-154 (Separate Framework from Consumer)
- ADR-160 (Non-Bypassable Redaction Barrier as Principle)
- ADR-161 (Network-Free PR-Check CI Boundary)
- PDR-003 (Sub-Agent Protection of Foundational Practice Docs)
- Pattern `findings-route-to-lane-or-rejection.md`
- Session report (this plan's rationale)

---

## Phase Structure

Five phases. Each phase commits independently; quality gate + reviewer
pass at each phase close. The restructure ships as 5-7 commits total (1
per phase, plus the consolidation close-out).

| Phase | Scope | Approximate size |
|-------|-------|------------------|
| 1 | Structural skeleton | Small — directory creation + moves + ADR-162 Proposed + cross-ref sweep |
| 2 | MVP scope pass | Large — 1 high-level plan + 5 new current/ plans + 11 new future/ plans |
| 3 | Exploration kickoff | Medium — 2 full explorations + 6 focused briefs |
| 4 | Executable plan revision | Small — targeted edits to the active maximisation plan |
| 5 | ADR-162 acceptance | Small — concrete enforcement mechanics + status flip + ESLint rule landing |

---

## Phase 1 — Structural Skeleton

### P1.1 ADR-162 Proposed

**Objective**. Draft ADR-162 Observability-First in Proposed status per
the text shape in §4.2 of the session report.

**Location**: `docs/architecture/architectural-decisions/162-observability-first.md`.

**RED**: docs-adr-reviewer pass on the ADR text asserts closure property
is present and testable, vendor-independence clause is testable, and
enforcement mechanisms are at least named (if not yet concrete).

**GREEN**: ADR-162 committed in Proposed status. ADR index updated.
Cross-reference from `docs/explorations/README.md` and the session
report.

**Acceptance**:

1. ADR-162 exists at the named path with Proposed status.
2. ADR index lists it.
3. Principles enumerated match the session report (§4.2).
4. At least one named enforcement mechanism per principle (may be refined
   in Phase 5).
5. Vendor-independence clause is load-bearing and testable.

### P1.2 `docs/explorations/` directory + README

**Objective**. Establish the explorations home.

**Status**: DONE (at restructure plan authoring time). README and
inaugural entry (the session report) both landed this session.

**Acceptance**: `docs/explorations/README.md` + the session report file
exist and are well-formed.

### P1.3 `.agent/plans/observability/` directory structure

**Objective**. Create the new plans home with lifecycle sub-dirs and a
README.

**Directory shape**:

```text
.agent/plans/observability/
├── README.md
├── high-level-observability-plan.md          # skeleton; filled in Phase 2
├── active/                                   # will receive maximisation plan
├── current/                                  # will receive search + new MVP lanes
├── future/                                   # will receive strategic parent + post-MVP
└── archive/
    └── superseded/                           # will receive the pre-pivot archived plan
```

**README content**: area framing (five axes), relationship to ADR-162,
pointer to the session report, pointer to high-level plan, index of
lifecycle sub-dirs.

**`high-level-observability-plan.md` skeleton**: frontmatter + section
headings + "filled in Phase 2" placeholder text. Sections to include:
MVP across five axes (placeholder), launch criteria (placeholder), plan
map (placeholder), post-MVP promotion-trigger matrix (placeholder),
explorations map (placeholder).

**Acceptance**: directory tree present; README and high-level-plan
skeleton in place; `.gitkeep` files in empty sub-dirs if needed.

### P1.4 Move six existing observability plans

**Status**: ✅ **Executed 2026-04-18** (the paths below are historical
record of the move; they do not represent live references).

**Moves performed** (via `git mv`; source paths were under the
architecture-and-infrastructure collection prior to 2026-04-18):

1. `sentry-observability-maximisation-mcp.plan.md`
   → [`observability/active/sentry-observability-maximisation-mcp.plan.md`](../../observability/active/sentry-observability-maximisation-mcp.plan.md).
2. `search-observability.plan.md`
   → [`observability/current/search-observability.plan.md`](../../observability/current/search-observability.plan.md)
   (lifecycle change: `active/` → `current/` as it's no longer on this
   branch's critical path but is the next-branch priority). Owner
   confirmed `current/` as the correct lifecycle 2026-04-18.
3. `sentry-observability-translation-crosswalk.plan.md`
   → [`observability/active/sentry-observability-translation-crosswalk.plan.md`](../../observability/active/sentry-observability-translation-crosswalk.plan.md).
4. `sentry-observability-maximisation.plan.md` (strategic brief)
   → [`observability/future/sentry-observability-maximisation.plan.md`](../../observability/future/sentry-observability-maximisation.plan.md).
5. `sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md`
   → [`observability/archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md`](../../observability/archive/superseded/sentry-observability-expansion.plan.pre-maximisation-pivot-2026-04-17.md).
6. [`architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`](../active/sentry-otel-integration.execution.plan.md)
   — **NOT MOVED** (as specified). This is the parent foundation plan
   that spans both observability and the broader OTel integration; it
   retains its architecture-and-infrastructure home. Cross-reference
   from [`observability/README.md`](../../observability/README.md)
   added.

**Cross-reference updates** after moves:

- `.agent/memory/operational/repo-continuity.md` + relevant workstream brief
  — Active executable plan, Strategic parent brief, and Related paths
  (the prior session-continuation prompt that hosted these has been
  dissolved 2026-04-20; state lives in operational memory now).
- `.agent/plans/high-level-plan.md` — any observability-plan paths.
- `.agent/plans/architecture-and-infrastructure/active/README.md` — remove
  moved entries, add note pointing at new home.
- `.agent/plans/architecture-and-infrastructure/future/README.md` — same.
- `.agent/plans/architecture-and-infrastructure/archive/superseded/README.md` — same.
- ADR-160 — cross-reference to the executable plan's new path.
- ADR-161 — cross-reference to the executable plan's new path.
- ADR-143 §6 note — cross-reference to the executable plan's new path.
- `sentry-otel-integration.execution.plan.md` — `child_plans:` or
  similar cross-ref to the new observability maximisation path.

**RED**: Comprehensive grep for the old paths across `.agent/**/*.md` and
`docs/**/*.md` must return zero matches after the move + update pass.

**GREEN**: All cross-references updated.

**Acceptance**:

1. `git mv` applied to all five moved plans.
2. Cross-reference grep returns zero stale paths.
3. All moved plans build their own links correctly (no relative-path
   breakage from the depth change).

### P1.5 Phase 1 close

**Quality gate**: `pnpm check` exit 0, no filtering.

**Reviewer matrix**:

- `docs-adr-reviewer` — ADR-162 Proposed text correctness; plan-directory
  ADR-117 compliance; cross-reference completeness.
- `architecture-reviewer-fred` — directory boundary correctness;
  vendor-independence clause testability in ADR-162.

**Phase 1 commit**: single commit with subject
`feat(observability): structural skeleton — adr-162 proposed, plans/observability/ directory, docs/explorations/`.

---

## Phase 2 — MVP Scope Pass

### P2.1 Fill `high-level-observability-plan.md`

**Objective**. Convert the skeleton into a substantial plan capturing
the MVP definition, launch criteria, plan map, and promotion triggers.

**Content** (authoritative for observability scope going forward):

1. **Observability principle** (§4.2 of session report, condensed).
2. **Five axes** — engineering, product, usability, accessibility, security
   — each with:
   - MVP deliverable names + owning plan.
   - Post-MVP deliverable names + owning future plan.
   - Explorations informing scope.
3. **Launch criteria** — the data-scientist / engineer / product-owner /
   a11y-reviewer test ("can each answer first-order questions from
   telemetry alone").
4. **MVP gate summary** — which lanes must close before public-beta
   launch vs which can close post-launch.
5. **Plan map** — full list of `active/` + `current/` + `future/` plans
   with one-line summaries + promotion triggers where applicable.
6. **Explorations map** — eight initial explorations + status + which
   plan each informs.
7. **Vendor-independence invariants** — the short list of tests that
   prove ADR-162's vendor-independence clause.
8. **Coordination points** with non-observability workstreams (search,
   auth, rate-limit) — where other plans emit events into the schema
   workspace.

### P2.2 Author six new `current/` plans (MVP lanes)

Per the session report §6.3. Each plan follows feature-workstream-template
with:

- Frontmatter (`name`, `overview`, `branch`, `todos`, `strategic_plan`,
  `derived_from`).
- Context + Design Principles + Non-Goals.
- Phase structure with RED/GREEN/REFACTOR per lane.
- Quality gates + Adversarial Review + Risk Assessment +
  Documentation Propagation.
- Acceptance criteria.

**The six plans**:

1. **`observability-events-workspace.plan.md`** — creates
   `packages/core/observability-events/` with Zod schemas, TSDoc, event
   catalog, conformance helper. MVP schema set: `tool_invoked`,
   `search_query`, `feedback_submitted`, `auth_failure`,
   `rate_limit_triggered`, `widget_session_outcome`, `a11y_preference_tag`.
   Depends on exploration 4 for schema-shape details.

2. **`synthetic-monitoring.plan.owner-externalised-2026-04-23.md`** —
   archive note for the repo lane that was originally authored here for
   external uptime and working-probe monitoring. Archived 2026-04-23 as
   owner-external work. The surviving repo-owned proof now lives in
   `mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`:
   bootable preview, healthy `/healthz`, and verified preview/Sentry
   linkage.

3. **`security-observability.plan.md`** — application-layer `auth_failure`
   - `rate_limit_triggered` events. Schema in events workspace.
   Explicit non-goals: transport/bot/DDoS observability (Cloudflare's
   layer). Depends on exploration 6 for Cloudflare integration scope;
   exploration 7 for static-analysis augmentation.

4. **`accessibility-observability.plan.md`** — best-effort runtime
   signal: `a11y_preference_tag`, frustration proxies, incomplete-flow
   correlation, keyboard-only session tag. Depends on exploration 3 for
   the runtime-capturable set; carries the explicit open question.

5. **`multi-sink-vendor-independence-conformance.plan.md`** — proves
   ADR-162's vendor-independence clause programmatically. Conformance
   test that runs emitting workspaces in `SENTRY_MODE=off`, asserts
   structural event information persists via stdout/err. Depends on
   exploration 8 for test shape.

6. **`search-observability.plan.md`** — already exists (moved from
   `architecture-and-infrastructure/active/` in Phase 1). Audit for MVP
   classification; elevate events to use the new events workspace
   schema for `search_query`.

### P2.3 Author eleven new `future/` plans

Per session report §6.5. Each a **strategic brief** (not executable),
~100-200 lines:

- Problem statement.
- Domain boundaries + non-goals.
- Dependencies + sequencing assumptions.
- Success signals.
- Risks + unknowns.
- **Promotion trigger** (named, testable, with implicit or explicit
  owner).

The eleven plans with their triggers (per session report §6.5):

1. `ai-telemetry-wiring.plan.md` — first LLM-calling MCP tool lands.
2. `feature-flag-provider-selection.plan.md` — first A/B experiment
   proposed OR first feature-flag-using feature lands.
3. `cross-system-correlated-tracing.plan.md` — debug session shows
   the gap (or Search CLI observability merged AND a cross-system
   incident occurs).
4. `curriculum-content-observability.plan.md` — first data-science
   request that needs curriculum-metadata joins.
5. `slo-and-error-budget.plan.md` — ≥30 days of baseline data
   collected post-launch.
6. `statuspage-integration.plan.md` — readiness to publish operational
   state to external users.
7. `cost-and-capacity-telemetry.plan.md` — first instance of cost
   pressure OR capacity-risk event.
8. `deployment-impact-bisection.plan.md` — L-7 release linkage stable
   AND a regression attributed manually surfaces need.
9. `second-backend-evaluation.plan.md` — specific Sentry gap requires
   it (named in the exploration output).
10. `customer-facing-status-page.plan.md` — Statuspage integration
    done.
11. `security-observability-phase-2.plan.md` — exploration 6
    conclusions (OR first app-level security incident).

### P2.4 Phase 2 close

**Quality gate**: `pnpm check` exit 0.

**Reviewer matrix**:

- `docs-adr-reviewer` — plan shape compliance with ADR-117;
  documentation-propagation completeness across the 17 new plan files.
- `assumptions-reviewer` — proportionality (17 new plan files is a lot;
  verify the MVP six are truly MVP and the future eleven are truly
  post-MVP with legitimate triggers); promotion-trigger testability
  (each trigger must be observable — "first data-science request" is
  testable; "when it feels right" is not).

**Phase 2 commit**: single commit with subject
`feat(observability): mvp scope — high-level plan + 17 plans covering every observability item`.

---

## Phase 3 — Exploration Kickoff

### P3.1 Write explorations 3 and 4 in full (blocking on MVP plan scope)

These two unblock concrete MVP scoping of their respective plans.

**Exploration 3 — `accessibility-observability-at-runtime.md`**:

- Problem: what accessibility signal is capturable at runtime in the MCP
  App widget.
- Options considered: preference-media-query tags (reduced-motion,
  high-contrast, font-scaling, prefers-color-scheme); frustration-proxy
  events (rage-click, rapid-retry, form-resubmit-after-error);
  keyboard-only session detection; incomplete-flow correlation via
  session-outcome events; screen-reader session detection (privacy-
  sensitive, likely out of scope).
- Evidence: axe-core runtime capability (dev-time only); MDN media query
  APIs; PostHog's autocapture approach to click patterns.
- Open questions: whether rage-click threshold should be session-specific
  or global; whether keyboard-only is inferrable without false positives.
- Informs: `accessibility-observability.plan.md` MVP scope.

**Exploration 4 — `structured-event-schemas-for-curriculum-analytics.md`**:

- Problem: what shape must `tool_invoked` events and related have for
  data scientists to answer the named product questions.
- Options considered: flat event schemas with denormalized context;
  nested schemas with separate-but-correlated emission; event-per-
  lifecycle-stage (started / ok / error) vs single-event-with-outcome.
- Evidence: existing event-schema patterns in Oak (PostHog events,
  Vercel Analytics); curriculum categorical axes (subject, key-stage,
  keyword, year-group); ADR-160 redaction constraints on value-axis
  fields.
- Open questions: which categorical axes matter most (owner / data-team
  input needed); granularity of `arguments_shape` field; how to
  correlate multi-tool sequences into sessions.
- Informs: `observability-events-workspace.plan.md` MVP schema set.

### P3.2 Stub the other six explorations

Each with problem statement + options to consider + research questions;
filled in as work progresses.

1. `sentry-vs-posthog-capability-matrix.md` — informs L-15 reframe.
2. `how-far-does-sentry-go-as-paas.md` — project thesis research output.
3. `trust-boundary-trace-propagation-risk-analysis.md` — informs L-14.
4. `cloudflare-plus-sentry-security-observability.md` — informs
   `security-observability-phase-2.plan.md`.
5. `static-analysis-augmentation.md` — informs security tooling
   decisions.
6. `vendor-independence-conformance-test-shape.md` — informs
   `multi-sink-vendor-independence-conformance.plan.md`.

### P3.3 Phase 3 close

**Quality gate**: `pnpm check` exit 0 (markdown-only; light gate).

**Reviewer matrix**: `docs-adr-reviewer` — exploration shape
compliance; clarity of informed-plan linkage.

**Phase 3 commit**: single commit with subject
`docs(observability): exploration kickoff — accessibility + event schemas in full, six focused briefs`.

---

## Phase 4 — Executable Plan Revision

### P4.1 Swap L-4a / L-4b priorities in the maximisation plan

**Edits to `observability/active/sentry-observability-maximisation-mcp.plan.md`**:

- § L-4b renamed to "Primary metrics emission via `Sentry.metrics.*`".
  Objective rewrite: primary production path; opt-in behind
  `SENTRY_ENABLE_METRICS` during beta; adapter insulates consumers.
- § L-4a renamed to "Transitional span-metrics convention". Objective
  rewrite: narrow use for span-attribution-unique cases only.
- Phase 2 dependency graph updated: `L-0b → L-4b` (existing); add
  `L-4b → L-4a` (span-metrics adopts only after `metrics.*` adapter
  stable).
- Risk table new row: "Sentry `metrics.*` API shifts during beta" —
  adapter insulates consumers; conservative version-pin in
  `packages/libs/sentry-node`; changelog review is tied to a concrete
  trigger: "re-read the Sentry Node SDK `metrics.*` changelog at (a)
  every L-4b closure milestone and (b) the next monthly dependency-
  audit cadence, whichever fires first; raise any breaking-shape change
  as a new risk row immediately." Owner: L-4b implementer at each
  milestone review.

### P4.2 Mark MVP vs MVP-deferred per lane

**MVP-deferred** (planned, not launch-blocking; still in this branch's
PR):

- L-4a (transitional — narrow cases).
- L-5 (dynamic sampling — fixed rate fine for beta).
- L-6 (profiling — on-demand fine).
- L-10 (feature-flag scaffolding only).
- L-11 (AI-instrumentation scaffolding only).
- L-14 (decision-lane; wiring is post-MVP).

**MVP-in** (launch-blocking for public beta):

- All other lanes (L-0a/b done; L-1, L-2, L-3, L-4b, L-7, L-9, L-12,
  L-12-prereq, L-13, L-DOC initial/final, L-EH initial/final, L-15).

Add a § "MVP classification" section near the top of the plan body
containing **a table with three columns**:

1. **Lane ID** (L-NN).
2. **MVP-in / MVP-deferred**.
3. **Axis-applicability rationale**. For MVP-deferred lanes, this
   column MUST cite [ADR-162 §Principle](../../../../docs/architecture/architectural-decisions/162-observability-first.md)'s
   clause "Omission is explicit and justified, not incidental" and
   state WHY the lane's axis obligation is either (a) not applicable
   at MVP (e.g. L-10 has no provider selected; no runtime capability
   exists to emit from), (b) satisfied by a simpler surface at MVP
   (e.g. L-5 fixed-rate sampling satisfies engineering axis
   observability without dynamic sampling), or (c) a decision, not a
   runtime capability (e.g. L-14).

Without this rationale column, the Phase 5 ADR-162 axis-coverage audit
will find an unjustified omission. The column is load-bearing, not
optional.

### P4.2b Update Foundation Alignment in the maximisation plan

**Edit to `observability/active/sentry-observability-maximisation-mcp.plan.md`**:

The maximisation plan's § Foundation Alignment list (lines ~223–237)
enumerates the ADRs it aligns to but currently omits the two ADRs
that govern its MVP classification and its redaction posture most
directly:

- Add [ADR-160](../../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
  — Non-Bypassable Redaction Barrier as Principle. Already referenced
  in-body (L-0b conformance) but absent from the canonical alignment
  list.
- Add [ADR-162](../../../../docs/architecture/architectural-decisions/162-observability-first.md)
  — Observability-First, five axes, vendor-independence clause. This
  is the governing ADR for the MVP classification added in §P4.2;
  listing it in Foundation Alignment is not optional.

Without this update, the maximisation plan's alignment list is stale
relative to the principle Phase 4 is enforcing.

### P4.3 Cross-reference new MVP lanes

Update maximisation plan's § Documentation Propagation + specific lane
bodies to cross-reference:

- L-0/L-1/L-3 → `observability-events-workspace.plan.md` for schemas.
- L-4b → `observability-events-workspace.plan.md` for the metric-names
  catalog. `metrics.*` emissions are part of the downstream-analytics
  schema contract per ADR-162; metric names the adapter emits
  (e.g. `oak.mcp.handler.request.count`, `oak.mcp.tool.duration_ms`)
  must be catalogued alongside event schemas.
- L-7 → `mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`
  for deploy-boundary repair and preview proof before any external
  uptime monitor is meaningful.
- L-7 → `multi-sink-vendor-independence-conformance.plan.md` to
  document the release-linkage carve-out (release linkage is
  Sentry-coupled by nature; the conformance plan's scope explicitly
  acknowledges this as a signal that need not survive `SENTRY_MODE=off`).
- L-9 → `observability-events-workspace.plan.md` for `feedback-submitted`.
- L-12 → `accessibility-observability.plan.md` for widget-side a11y
  signal.
- L-12 → `multi-sink-vendor-independence-conformance.plan.md` —
  the widget is a second emitting workspace that the conformance plan
  lists as a consuming workspace; the lane body must acknowledge the
  vendor-independence compose-in obligation.
- L-13 → `security-observability.plan.md` + `accessibility-observability.plan.md`
  for per-axis alerts.

### P4.4 Phase 4 close

**Quality gate**: `pnpm check` exit 0 (plan edits are markdown).

**Reviewer matrix**:

- `sentry-reviewer` — `metrics.*` priority swap correctness; beta-API
  risk mitigation sufficiency; `beforeSendMetric` shape compatibility
  with the changelog-watch trigger named in §P4.1.
- `architecture-reviewer-fred` — MVP classification boundary;
  axis-applicability rationale correctness; cross-reference
  completeness including the three additions in §P4.3.
- `docs-adr-reviewer` — Foundation Alignment list completeness after
  §P4.2b; MVP classification section presence at plan head; ADR
  cross-reference health across the revised plan.

**Phase 4 commit**: single commit with subject
`docs(observability): revise maximisation plan — metrics.* primary, mvp classification, cross-refs`.

---

## Phase 5 — ADR-162 Acceptance

### P5.1 Lock down enforcement mechanisms

Refine ADR-162's § Enforcement section to concrete, testable mechanics:

1. **ESLint rule** — author as new rule in
   `@oaknational/eslint-plugin-standards`:
   - Name: `require-observability-emission`.
   - Scope: new exported async functions in `apps/**/*/src/**` and
     `packages/sdks/**/*/src/**`.
   - Behaviour: flags functions with no call to any of
     `logger.info`/`logger.error`/`log()`, `Sentry.*`, or any schema
     from `@oaknational/observability-events`.
   - Initial severity: `warn` (per `warning-severity-is-off-severity`
     pattern, this is a deliberate soft-launch — escalated to `error`
     once the six new MVP plans land their first emission sites).
2. **Reviewer-matrix question** at every phase close: "Does each new
   capability have a loop across each applicable axis?" Codify in the
   existing `.claude/rules/invoke-code-reviewers.md` or equivalent.
3. **Conformance test** in `packages/core/observability-events/`: the
   `conformance.ts` helper exported in Phase 2 provides the structural
   gate; each consuming workspace imports it to validate emitted events.
4. **Vendor-independence test** in
   `multi-sink-vendor-independence-conformance.plan.md`'s output: runs
   the MCP app + widget + search CLI in `SENTRY_MODE=off` and asserts
   structural event information persists via stdout/err.

### P5.2 Author `require-observability-emission` ESLint rule

**RED**: `packages/core/oak-eslint/src/rules/require-observability-emission.unit.test.ts`
RuleTester cases:

- Exported async function in `apps/**` with no emission → flagged.
- Exported async function with at least one `logger.info` → pass.
- Exported async function with at least one Sentry capture → pass.
- Exported async function with at least one `@oaknational/observability-events`
  schema usage → pass.
- Private (non-exported) function → pass.
- Test file (`*.unit.test.ts` / `*.integration.test.ts`) → pass.
- Non-app non-SDK path → pass.
- Edge case: function with only a forwarded emission to an injected
  observability delegate → pass (delegate-call pattern counts).

**GREEN**: Author rule implementation. Register in
`packages/core/oak-eslint/src/index.ts` `rules` record at severity
`warn`. Document the sentinel-comment opt-out for legitimate non-
emission cases.

**Wave-2 dependency** (2026-04-18 reshape, per sentry-reviewer
TO-ACTION): the rule's "schema usage" acceptance path depends on
`@oaknational/observability-events` existing as a workspace. Wave 1
authors the rule and its `logger.*` / `Sentry.*` detection paths;
RuleTester cases for the schema-usage path must be either (a)
omitted with a named "Wave 2 unlocks" note until the
workspace exists, or (b) authored with a test-fixture workspace
stand-in (if the existing RuleTester infra supports it). Do NOT
author RuleTester cases that import from `@oaknational/observability-events`
as if it resolves in Wave 1 — it does not. Re-enable the schema-
usage path's tests + assertions in the Wave 2 events-workspace plan
(WS5 adversarial review is the correct closure gate).

**REFACTOR**: `.agent/rules/` update; ADR-162 § Enforcement references
the rule by name and file.

### P5.3 Flip ADR-162 status

**Objective**. Move ADR-162 from Proposed → Accepted once all four
enforcement mechanisms are concrete and at least two (ESLint rule at
`warn`; reviewer-matrix question codified) are landed.

**Acceptance**:

1. ADR-162 Status line reads `Accepted (2026-04-XX)`.
2. `require-observability-emission` rule authored and green in
   `pnpm lint`.
3. Reviewer-matrix question present in
   `.agent/rules/invoke-code-reviewers.md` or equivalent.
4. Conformance test helper and vendor-independence test named as
   deliverables in their respective Phase 2 plans.

### P5.4 Phase 5 close

**Quality gate**: `pnpm check` exit 0 (ESLint rule must compile, type-
check, and test-pass).

**Reviewer matrix**:

- `architecture-reviewer-fred` — enforcement-mechanism completeness;
  ADR-162 Accepted-status readiness.
- `type-reviewer` — ESLint rule type correctness; `RuleTester` case
  coverage.

**Phase 5 commit**: single commit with subject
`feat(observability): adr-162 accepted — require-observability-emission rule landed`.

> **2026-04-18 reshape — Phase 5 is now Wave 1 of the broader
> observability MVP execution.** Restructure Phase 5 authors the
> `require-observability-emission` ESLint rule; the broader execution
> reshape makes that rule a Wave 1 deliverable that lands BEFORE any
> maximisation plan emitter writes a new function. See
> §Post-Phase-5 Execution Plan below for the cross-plan wave
> structure.

---

## Post-Phase-5 Execution Plan — Cross-plan Wave Structure

Phases 1–5 of this restructure are structural plan-text work (Phase 4
committed 2026-04-18; Phase 5 next). Once Phase 5 closes (ADR-162
Accepted), the observability MVP moves from planning into execution.

The execution order is NOT "run the maximisation plan's four phases
in sequence, then run the sibling `current/` plans in parallel". That
ordering lands emitters before schemas and runs compile-time gates
after the code they would have policed. The owner-approved
2026-04-18 reshape interleaves the maximisation plan's lanes with
the five sibling MVP `current/` plans into five **execution waves**:

| Wave | Purpose | Work |
|------|---------|------|
| **1. Gates & Foundation Extractions** | Compile-time gates + extracted workspaces before any emission site. | Maximisation lanes: L-0a / L-0b (done); L-EH initial; L-DOC initial; **L-12-prereq moved here**; **L-7 moved here**. Restructure Phase 5 work (`require-observability-emission` rule + ADR-162 Accepted) folds into this wave. |
| **2. Schema Foundation** | Events workspace + vendor-independence structural lint. | Sibling `observability-events-workspace.plan.md` WS1–WS6. Sibling `multi-sink-vendor-independence-conformance.plan.md` WS1 carve-out (`no-vendor-observability-import` ESLint rule only). |
| **3. Primary Emitters (Server)** | Server-side emission consumes Wave 2 schemas by import. | Maximisation lanes: L-1, L-2, L-3, L-4b, L-9. |
| **4. Cross-axis & Widget** | Second emitting runtime + axis-specific emission plans. | Maximisation lane L-12; sibling `security-observability.plan.md`; sibling `accessibility-observability.plan.md`. Can parallelise within wave. |
| **5. Operations + Conformance + Close-out** | Alerts + emission-persistence test + MVP-deferred lanes + close-out ADRs. | Maximisation lanes: L-13, L-14, L-15, L-DOC final, L-EH final; MVP-deferred (L-4a, L-5, L-6, L-10, L-11). Sibling `multi-sink-vendor-independence-conformance.plan.md` WS2+ (emission-persistence test). Current repair plan `mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md` makes `/healthz` and preview/Sentry proof real; external monitor setup happens outside the repo. |

**Architectural rationale**:

1. **Schemas before emitters** — Wave 2 creates `packages/core/observability-events/` before any L-1 / L-3 / L-4b / L-9 / L-12 fixture test imports from it. No retrofit.
2. **Rules before code** — ESLint built-in `preserve-caught-error` (Wave 1, L-EH initial — supersedes original `require-error-cause` custom-rule plan; landed 2026-04-19), custom `require-observability-emission` (Wave 1, restructure Phase 5 carve-out), custom `no-vendor-observability-import` (Wave 2, vendor-independence plan carve-out) all land before any emission site is written.
3. **Redactor core consolidated once** — L-12-prereq in Wave 1 (closed 2026-04-19 via the observability-primitives-consolidation lane) folds the redaction primitives + JSON sanitisation + canonical `JsonValue`/`JsonObject` type into `@oaknational/observability`. Server + widget + future Search CLI all compose from this single canonical home; no refactor underneath emitters.
4. **Release linkage early** — L-7 in Wave 1 means every subsequent lane's owner-verified smoke test is tagged and attributable.
5. **Vendor-independence runs pre-launch** — the conformance plan's emission-persistence test was structurally blocked on the events workspace; Wave 2 unblocks it; Wave 5 runs it before PR open.

**Cross-plan authoritative index**: see
[`.agent/plans/observability/high-level-observability-plan.md §Execution Waves`](../../observability/high-level-observability-plan.md#execution-waves--cross-plan-mvp-order).

**Within-plan index**: see
[`.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md §Phase Structure`](../../observability/active/sentry-observability-maximisation-mcp.plan.md#phase-structure).

**Non-change**: the A.3 single-PR commitment is unchanged. Waves are
within-branch commit ordering, not PR boundaries. The PR opens after
Wave 5 closes.

**Scope of this restructure**: Phases 1–5 of THIS plan do not execute
the waves. This plan closes when Phase 5 lands (ADR-162 Accepted +
the `require-observability-emission` rule authored at `warn`). Wave
1's remaining items (L-EH initial, L-DOC initial, L-12-prereq, L-7)
and all subsequent waves are owned by the maximisation plan + sibling
current/ plans; they execute after this restructure is archived.

---

## Quality Gates

Phase-boundary criterion: `pnpm check` from the repo root, no filtering,
exit 0. Per phase, individual gates may be invoked one at a time while
iterating to narrow a failure, but the phase does not close until the
aggregate gate is green.

```bash
pnpm check
```

No exceptions, no "pre-existing" dismissals, no filtered runs.

---

## Adversarial Review

Per phase, invoke reviewers with non-leading prompts. Matrix:

| Phase | Reviewers |
|-------|-----------|
| 1 | docs-adr-reviewer, architecture-reviewer-fred |
| 2 | docs-adr-reviewer, assumptions-reviewer |
| 3 | docs-adr-reviewer |
| 4 | sentry-reviewer, architecture-reviewer-fred |
| 5 | architecture-reviewer-fred, type-reviewer |
| Final | code-reviewer (gateway), assumptions-reviewer, docs-adr-reviewer |

Findings route per `patterns/findings-route-to-lane-or-rejection.md` —
ACTIONED, TO-ACTION (named lane + specific edit), or REJECTED (written
rationale). No deferred block.

---

## Risk Assessment

| Phase | Risk | Mitigation |
|-------|------|------------|
| 1 | Move breaks cross-references; stale paths accumulate silently | Comprehensive grep for old paths returns zero matches before Phase 1 close. |
| 1 | ADR-162 Proposed text drifts from session report framing | Session report is the authoritative rationale; reviewer checks alignment. |
| 2 | 17 new plan files overwhelm future readers and rot | High-level plan is the single index; every plan has a promotion trigger; fitness limits apply. |
| 2 | Future-plan promotion triggers written as vague intent | assumptions-reviewer gates triggers for testability at Phase 2 close. |
| 3 | Explorations 3 and 4 block Phase 2 MVP plan detail | Allow Phase 2 to author `current/` plans at skeleton-level; full detail waits on Phase 3 outputs; Phase 4 revision absorbs if needed. |
| 4 | `metrics.*` beta API shifts during the work | Adapter insulates consumers; version-pin conservatively; a named changelog-watch task in the risk table. |
| 5 | `require-observability-emission` rule fires too aggressively | Initial severity `warn` not `error`; sentinel-comment opt-out documented; escalation to `error` is a separate decision. |
| All | "Nothing unplanned" exercise generates zombie future plans that never promote | Every future plan's promotion trigger is tested for testability at review time; plans without triggers are rejected. |

---

## Documentation Propagation

Per phase, propagate:

- ADRs for architectural decisions (ADR-162 is the primary; no others
  expected in this restructure).
- READMEs for every touched workspace (`plans/observability/README.md`,
  `docs/explorations/README.md`, `packages/core/observability-events/README.md`
  at creation time).
- TSDoc on every new public surface (ESLint rule in Phase 5; events
  workspace in later Phase 2 lane).
- Runbook entries: none expected in this restructure; operational
  runbooks come later in the maximisation plan's L-13.
- `.agent/rules/` updates for the reviewer-matrix question in Phase 5.

**Owner-only** (per PDR-003):

- `.agent/directives/AGENT.md § Essential Links` — add cross-link to
  `docs/explorations/` and (once `high-level-observability-plan.md` is
  populated in Phase 2) to the high-level observability plan. Exact
  diffs recorded in the respective phase's acceptance section.

---

## Consolidation

After Phase 5, run `/jc-consolidate-docs`. Candidate patterns for
extraction:

- **Five-axis framing for observability** — if it survives the next
  capability planning session without revision.
- **Nothing-unplanned-without-a-trigger** — if proven by Phase 2 not
  generating zombie plans over the next two sessions.
- **Explorations-as-research-deliverable** — if Explorations 3 and 4
  demonstrably unblock concrete plan scoping.

---

## Dependencies

**Blocking**: none. This restructure can begin immediately.

**Related plans**:

- `sentry-observability-maximisation-mcp.plan.md` — the plan being
  moved + revised in Phase 4.
- `sentry-otel-integration.execution.plan.md` — parent foundation
  (stays in architecture-and-infrastructure; cross-referenced from the
  new observability directory).
- `search-observability.plan.md` — moves to `observability/current/`.
- `clerk-cli-adoption.plan.md` — unchanged; stays in architecture-and-
  infrastructure.
- `codex-mcp-server-compatibility.plan.md` — unchanged.

---

## Evidence and Claims

Claims in this plan are one of:

- **Observed** (verified in code / directory state today, with file
  reference).
- **Proposed** (target state per the session report).
- **Deferred** (named explicit promotion trigger or out-of-scope clause).

---

## Acceptance Summary

The restructure is complete when:

1. `plans/observability/` directory exists with the full lifecycle
   structure + README + high-level-plan + six current/ plans + eleven
   future/ plans.
2. Six existing observability plans moved; zero stale cross-references
   anywhere.
3. ADR-162 Accepted; enforcement mechanisms concrete (ESLint rule
   landed at `warn`; reviewer-matrix question codified; conformance
   test helper + vendor-independence test named as deliverables).
4. `docs/explorations/` exists with README + eight exploration files
   (two full, six focused briefs).
5. `packages/core/observability-events/` named as a deliverable of its
   owning plan (actual creation happens when that plan enters active
   lifecycle, not in this restructure).
6. Active maximisation plan revised per §4 (metrics.* primary, MVP
   classification, cross-references).
7. `pnpm check` exit 0 after each phase commit.
8. Session-continuation prompt refreshed with pointers to the new homes.
9. Nothing from the §2.3 fourteen-item unplanned list remains unplanned.
