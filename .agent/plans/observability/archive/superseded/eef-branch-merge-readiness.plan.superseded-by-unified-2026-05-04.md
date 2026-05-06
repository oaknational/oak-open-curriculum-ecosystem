---
name: "feat/eef_exploration merge readiness: comprehensive review, green gates, MCP tools exercised"
overview: >
  Linear, straightforward closure of the feat/eef_exploration branch.
  Begin with a comprehensive sub-agent review of this plan, apply their
  findings while keeping the plan simple and linear, then run every
  quality gate green, boot the dev server locally, exercise the MCP
  tools through the protocol, analyse divergence vs main, and declare
  merge-ready. No new product code in this plan; this is verification
  and merge readiness only.
status: current
isProject: false
todos:
  - id: step-1-comprehensive-review
    content: "Dispatch a comprehensive sub-agent review of THIS plan body and the merge-readiness arc it describes, in parallel where reviewers are independent. Reviewer brief is the §Sub-agent Reviewers section below. Each reviewer reports findings against their lens. Findings are applied to the plan body in-place inside this same step before step 2 begins. Discipline: any amendment must preserve the plan's comprehensive-simple-linear-straightforward shape; reviewer findings that would fragment, branch, or complicate the sequence are recorded as out-of-scope follow-ups rather than absorbed. After application, this todo is marked complete and the plan body's next-version timestamp is bumped. **Hard precondition**: `architecture-and-infrastructure/current/smoke-test-retirement-recovery-and-completion.plan.md` (Moonlit Shimmering Comet's plan-3 recovery) must have completed through its step 35 (root `pnpm check` green) before this plan's step 2 begins; their cycles 2a–2f audits and cycle 3 ESLint rule wire-up are merge prerequisites. This plan owns the verification + merge-readiness work singly; Moonlit's plan body's steps 36–38 (dev boot, MCP tool exercise, divergence analysis) are duplicative and should be descoped during their own step-1 review pass — flag at coordination time if not already addressed."
    status: pending
  - id: step-2-clean-tree-gates
    content: "From a clean tree on feat/eef_exploration, run the full quality gate chain in canonical order: pnpm install (only if needed), pnpm sdk-codegen, pnpm build, pnpm type-check, pnpm doc-gen, pnpm format:root, pnpm markdownlint:root, pnpm lint:fix, pnpm test, pnpm test:e2e, pnpm test:ui, pnpm test:a11y, pnpm portability:check, pnpm subagents:check, pnpm test:root-scripts, pnpm practice:fitness:informational, pnpm practice:vocabulary. Each must exit 0. Fix any failure at the source per never-disable-checks; no gate is bypassed."
    status: pending
  - id: step-3-dev-boot
    content: "Boot the dev server locally with the current SENTRY_MODE-based env contract (the rename is paused; legacy SENTRY_MODE consumer path remains live). Probe shape: env -u VERCEL_ENV -u VERCEL_BRANCH_URL -u VERCEL_GIT_COMMIT_SHA -u VERCEL_GIT_COMMIT_REF -u SENTRY_RELEASE_OVERRIDE SENTRY_MODE=sentry pnpm dev (run from apps/oak-curriculum-mcp-streamable-http/). Expect 'Oak Curriculum MCP Server listening on port 3333' within ~5s. Capture log output to /tmp/dev-boot.log for evidence. Server must remain running into step 4."
    status: pending
  - id: step-4-mcp-tools-exercise
    content: "With the dev server running from step 3, exercise the MCP tools through the protocol. Required exercises: (a) issue an MCP tools/list against http://localhost:3333/mcp; record the count and full list of tool names. (b) issue an MCP tools/call against three representative tools — at least one curriculum-data tool (e.g. get-key-stages or search), one MCP-app/UI tool, and one prompt or sequence tool. Each call returns a structurally-valid response (no SDK or transport errors). (c) capture the raw exchanges to /tmp/mcp-tool-exercise.log for evidence. The DANGEROUSLY_DISABLE_AUTH path is acceptable for this exercise only if explicitly enabled in the dev env; otherwise drive auth via the dev OAuth flow."
    status: pending
  - id: step-5-stop-dev-server
    content: "Stop the dev server cleanly (SIGTERM the process started in step 3). Confirm no orphaned listeners on port 3333."
    status: pending
  - id: step-6-merge-divergence-analysis
    content: "Per .agent/rules/pre-merge-divergence-analysis.md, perform a pre-merge divergence analysis between feat/eef_exploration and main: git fetch origin main; git log --oneline origin/main..HEAD; git log --oneline HEAD..origin/main; git diff --stat origin/main...HEAD. Inspect any cross-cutting changes (root config files, lockfile, CI surfaces) for conflict potential. Surface findings to the owner before merge proposal."
    status: pending
  - id: step-7-merge-readiness-declaration
    content: "Owner-gated merge readiness declaration. Required evidence bundle: review findings + applied amendments (step 1), gates green (step 2 outputs), dev boot proof (step 3 log), MCP tool exercise log (step 4), divergence analysis (step 6). Invoke release-readiness-reviewer over the bundle to synthesise a GO / GO-WITH-CONDITIONS / NO-GO recommendation. Owner reviews and authorises the merge action. Merge mechanics (PR open, squash-or-merge-commit, target branch) are owner-directed; this plan does not pre-decide them."
    status: pending
---

# `feat/eef_exploration` Merge Readiness

**Last Updated**: 2026-05-04
**Status**: 🟢 CURRENT — owner-directed minimal plan replacing damaged plan-2

## Intent

Close out the `feat/eef_exploration` branch with confidence: a comprehensive
sub-agent review of the plan and the arc, every quality gate green, dev
server boots locally, MCP tools work through the protocol, divergence-vs-main
analysed. After this plan, the branch is ready for an owner-authorised
merge. The graph wiring work begins on a fresh branch post-merge.

This plan is **simple, linear, straightforward, and comprehensive** by
owner direction (2026-05-04). It contains no cycles in the TDD-cycle
sense; the value here is verification and merge readiness, not new
product code.

## Context

Branch state at authoring (`feat/eef_exploration` HEAD `b226670d`):

- **Plan 1** (`fix-dev-boot-release-resolution`, archived to
  `observability/archive/completed/`): ✅ Cycle 1 landed at commit
  `2a2d1b05`. `resolveDevelopmentRelease` falls through to `local-dev` in
  development; `missing_git_sha` error kind is gone; orphaned skipped/
  todo tests deleted. Boot probe passed (server reaches "listening" in
  ~142ms with `SENTRY_MODE=sentry` and no Vercel env).
- **Plan 2** (`replace-sentry-mode-with-observability-sinks`, moved to
  `observability/future/` as
  `replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`):
  🛑 DAMAGED — PAUSED — SUPERSEDED. The SENTRY_MODE rename is real
  future work but its current plan body has unnamed foundational
  tension; resumed work needs to name that tension and re-shape the
  plan first. **Out of scope** for this branch. Legacy SENTRY_MODE
  consumer path remains the live contract through merge.
- **Plan 3 (original)** (`retire-smoke-tests-all-vitest-no-real-io`,
  archived 2026-05-04 to
  `architecture-and-infrastructure/archive/superseded/`): cycles 1a, 1b,
  1c, 1d landed (smoke-tests directory deleted, vitest config retired,
  smoke:* scripts removed, in-process replacement test added). Damaged
  during execution: commit-skill protocol bypassed, reviewer dispatch
  not invoked, plan-body freshness not maintained, doc rewrites went
  beyond authorisation. Generator was *invented speed pressure*.
- **Plan 3 (recovery)**
  (`architecture-and-infrastructure/current/smoke-test-retirement-recovery-and-completion.plan.md`):
  🟡 IN PROGRESS — to be picked up in a fresh session. 41 steps. Step 1
  comprehensive sub-agent review of its own plan body; steps 03–13
  codify the new `.agent/rules/no-speed-pressure.md` rule and capture
  failure modes into memory. Steps 14–26 commit accumulated continuity
  state and backfill reviewer dispatch on the four landed commits.
  Steps 27–34 complete cycles 2 (per-workspace real-IO audit) and 3
  (no-real-io-in-tests ESLint rule + root-config wire-up). Steps 35–41
  verify branch goals — step 35 (`pnpm check` green) is the load-bearing
  proof of plan-3 closure. **Note**: their steps 36 (dev boot), 37 (MCP
  tools), 38 (divergence) duplicate this plan's steps 3, 4, 6 — owned
  singly by this plan; descope expected during their step-1 review.
  Their step 39 (coordinate plan 2 close) is partially obsolete — plan
  2 is already closed-paused.

WS1 of the multi-sink rename (commit `a3a0222a`, pre-pause) introduced
`packages/core/env/src/schemas/observability*.ts` and
`packages/core/observability/src/sink-registry.ts`. These types coexist
unused-by-consumer in the tree under the pause; they are not removed by
this merge-readiness plan and are correctly typed; lint and type-check
will pass them through.

## Foundation Alignment

- **principles.md §First Question**: simpler than wholesale producer
  rename. Verification of working software is the lowest-cost,
  highest-confidence shape of "branch is ready to ship".
- **principles.md §Architectural Excellence Over Expediency**: pausing
  the rename rather than racing it through is the architectural choice;
  the rename's foundational tension must be named before resumption.
- **principles.md §Owner Direction Beats Plan**: owner directed the
  pause; this plan reflects the direction.
- **never-disable-checks**: all gates are blocking, none weakened.
- **no-warning-toleration**: any new warning surfaced by step 2 is
  fixed in the same work-item.

## Sequence

The plan is intentionally a single linear sequence; no decomposition
into cycles. The YAML `todos` block above defines the seven steps.

| # | Step | Output |
|---|------|--------|
| 1 | Comprehensive sub-agent review of plan + arc | Reviewer findings; applied plan amendments; out-of-scope follow-ups recorded |
| 2 | Clean-tree full quality gate run | Gate-by-gate exit-0 evidence |
| 3 | Local dev server boot probe with `SENTRY_MODE=sentry` | "listening" log line; `/tmp/dev-boot.log` |
| 4 | MCP tools exercise via protocol (`tools/list` + 3× `tools/call`) | Tool count, names, response shapes; `/tmp/mcp-tool-exercise.log` |
| 5 | Clean dev-server shutdown | Port 3333 free |
| 6 | Pre-merge divergence analysis vs `origin/main` | Commit-list diffs; conflict-potential findings |
| 7 | Owner-gated merge readiness declaration | Evidence bundle; release-readiness-reviewer call; owner authorisation |

## Sub-agent Reviewers (step 1 brief)

Step 1 dispatches the following reviewers in parallel where they are
independent (the four architecture reviewers in particular). Each
reviewer reads this plan body plus the named context surfaces and
reports findings against their lens. Findings are applied to the plan
body before step 2 begins; findings that fragment or branch the
sequence are recorded under §Out-of-Scope Follow-ups rather than
absorbed.

| Reviewer | Lens | Brief |
|---|---|---|
| `assumptions-reviewer` | Proportionality, blocking legitimacy, assumption validity | Is the plan-3 wait (step 1 → step 2 sequencing) genuinely load-bearing? Are the seven steps proportionate to a merge-readiness arc? Are any blocking relationships invented? |
| `architecture-reviewer-barney` | Simplification-first | Can the seven-step shape collapse without losing quality? Is the boot+exercise pair (steps 3+4+5) decomposable to fewer outputs? |
| `architecture-reviewer-betty` | Systems thinking, change-cost trade-offs | Does descoping plan 2 to a future paused state introduce hidden coupling cost (e.g. WS1 schemas in tree without consumer)? Is the merge-readiness shape stable across the next graph-wiring arc? |
| `architecture-reviewer-fred` | Strict ADR / principles compliance | Does the descope of plan 2 violate any ADR? Does running with legacy `SENTRY_MODE` through merge violate any principle? Does step 4's auth approach respect ADR-160 redaction barrier and ADR-158 multi-layer security? |
| `architecture-reviewer-wilma` | Adversarial / failure modes | What failure modes does step 4 miss? What if the dev server boots but a single tool's response shape is wrong — is that caught? What if `practice:fitness:informational` regresses post-step-2? |
| `mcp-reviewer` | MCP protocol expertise | Is the tools/list + tools/call exercise a sufficient protocol probe for "tools work properly"? Does it cover MCP App resources, prompts, and sequence tools? Should the exercise include `resources/list` and `resources/read`? Brief includes ADR-123 tool catalogue. |
| `test-reviewer` | Test discipline integrity | Does step 2's gate sequence preserve TDD-as-pairs at every level? Is `pnpm test:e2e` necessary given step 4's protocol probe overlaps it? Are any newly-added tests on this branch audit-shaped rather than describe-shaped? |
| `security-reviewer` | Auth + trust-boundary | Step 4's auth path: which mode is exercised — DANGEROUSLY_DISABLE_AUTH or real OAuth? What's the exercise's coverage of the auth trust boundary? Is any sensitive material captured in `/tmp/mcp-tool-exercise.log`? |
| `clerk-reviewer` | Clerk middleware behaviour | Step 3's dev boot starts Clerk middleware in development with `SENTRY_MODE=sentry`. Does step 4's tool exercise correctly cover Clerk's request-isolation-scope behaviour? Should the exercise include a deliberate auth-failure tool call? |
| `sentry-reviewer` | Observability surface | Step 3 boots with `SENTRY_MODE=sentry` (legacy contract under the pause). Is the observability path proven by boot alone, or should step 4 verify a captured event surface (fixture or live)? Are there any redaction-barrier checks missing? |
| `onboarding-reviewer` | Plan readability + first-contact discoverability | Will a future agent picking up this plan from `current/` understand the seven-step sequence without back-references? Are the cross-references to plan-1, plan-2, plan-3 sufficient? |
| `release-readiness-reviewer` | GO / GO-WITH-CONDITIONS / NO-GO synthesis | At plan-phase: does the seven-step evidence bundle constitute sufficient release readiness for a merge? Are any release-readiness signals missing (rollback strategy, breaking-change risk audit, migration impact)? At step 7: synthesise the actual evidence. |
| `docs-adr-reviewer` | Plan-body docs alignment | Are the cross-references in this plan accurate (paths, commit SHAs, related-plans links)? Does any in-flight ADR need updating to reflect the descope? |

The four architecture reviewers (`barney`, `betty`, `fred`, `wilma`) are
the proven quartet for plan-phase scrutiny; running all four covers
simplification, systems-thinking, principles-compliance, and adversarial
failure-mode lenses without overlap.

## Out of Scope

- The SENTRY_MODE → OBSERVABILITY_SINKS rename (paused; see
  `future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`).
- Authoring ADR-171 (was plan-2 cycle 2; deferred with the rename).
- README + `.env.example` updates for the observability surface (was
  plan-2 cycle 3; deferred with the rename).
- Plan 3's remaining cycles (separate plan, separate session).
- Graph-wiring work (post-merge, separate branch).

## Out-of-Scope Follow-ups (populated during step 1 application)

Reviewer findings that are valid but would fragment or complicate the
seven-step sequence are recorded here as named follow-ups, not absorbed
into the sequence:

- *(none yet — populated when step 1 runs)*

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Step 1's reviewer findings collectively complicate the plan beyond simple-linear | Medium | Medium | Discipline: findings that fragment the sequence become out-of-scope follow-ups, not new steps; the plan body remains seven steps after application |
| Step 2 surfaces a real test failure that did not show in iterative dev | Medium | Medium | Fix at the source per never-disable-checks; if larger than mechanical, surface to owner with named highest-priority recovery plan |
| Step 4's MCP tool exercise reveals a regression in a tool's response shape | Low | High | Regression is a merge blocker; route to owner; either fix in-branch or revert the responsible commit |
| Step 6's divergence analysis reveals unmergeable conflicts vs `main` | Low | Medium | Per `.agent/skills/complex-merge/SKILL.md`, structured workflow if 100+ files diverged or 10+ conflicts predicted |
| Plan 3 stalls and step 1's wait extends indefinitely | Low | Low | Owner-directed; this plan doesn't claim plan 3's timeline |

## Plan Exit

- All seven steps complete with their named evidence.
- Owner authorises the merge action.
- This plan moves to `archive/completed/` with a closure note linking
  to the resulting merge commit on `main`.

## Consolidation

After plan close (post-merge), run `/jc-consolidate-docs` per the
session-handoff convention.

## Related Plans

- `archive/completed/fix-dev-boot-release-resolution.plan.md` — plan 1,
  landed
- `future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`
  — plan 2, paused-superseded
- `../../architecture-and-infrastructure/archive/superseded/retire-smoke-tests-all-vitest-no-real-io.plan.md`
  — plan 3 (original), damaged-superseded; landed cycles 1a–1d
- `../../architecture-and-infrastructure/current/smoke-test-retirement-recovery-and-completion.plan.md`
  — plan 3 (recovery), 41 linear steps; merge-prerequisite for this plan
