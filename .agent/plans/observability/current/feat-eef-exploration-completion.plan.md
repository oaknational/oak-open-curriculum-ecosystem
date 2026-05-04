---
name: "feat/eef_exploration completion: smoke-test cycle 2+3, reviewer backfill, no-speed-pressure rule, MCP tools verified, merge"
overview: >
  Single linear unified plan to complete and merge feat/eef_exploration.
  Replaces the parallel pair (eef-branch-merge-readiness.plan.md and
  smoke-test-retirement-recovery-and-completion.plan.md) with one
  comprehensive sequence. Step 1 dispatches a comprehensive sub-agent
  review; step 2 applies findings while preserving simple-linear shape.
  Steps 3–13 complete the smoke-test retirement substrate (no-speed-
  pressure rule integration, reviewer backfill on landed commits,
  cycle 2 per-workspace real-IO audits, cycle 3 ESLint rule). Steps
  14–17 run gates green, exercise MCP tools live, analyse divergence,
  and declare merge-ready.
status: current
isProject: true
todos:
  - id: 01-comprehensive-plan-review
    content: "Dispatch a comprehensive sub-agent review of THIS plan body in parallel where reviewers are independent. Reviewers: assumptions-reviewer (proportionality, blocking legitimacy), architecture-reviewer-barney (simplification), architecture-reviewer-betty (cohesion + change cost), architecture-reviewer-fred (ADR/principles compliance), architecture-reviewer-wilma (failure modes), code-reviewer (gateway), config-reviewer (cycle 3 ESLint rule prescription), test-reviewer (cycle 2 + cycle 3a RuleTester correctness), mcp-reviewer (step 15 protocol probe sufficiency), security-reviewer (step 15 auth path), clerk-reviewer (Clerk middleware coverage), sentry-reviewer (SENTRY_MODE=sentry boot path), onboarding-reviewer (plan readability), docs-adr-reviewer (cross-references), release-readiness-reviewer (step 17 evidence bundle shape). Capture findings in §Plan Review Findings."
    status: pending
  - id: 02-apply-review-findings
    content: "Apply reviewer recommendations to refine this plan body. Discipline: amendments must preserve comprehensive-simple-linear-straightforward shape; findings that fragment, branch, or complicate the sequence are recorded under §Out-of-Scope Follow-ups instead of absorbed. Findings explicitly rejected get written rationale per principles.md. After this step the plan body is the contract for the rest of execution. Land plan-body changes via full commit-skill protocol."
    status: pending
    depends_on: [01-comprehensive-plan-review]
  - id: 03-integrate-no-speed-pressure-rule
    content: "Integrate the already-authored .agent/rules/no-speed-pressure.md across the rule estate in one commit: add to RULES_INDEX.md (canonical platform-independent enumeration); create thin adapters at .claude/rules/no-speed-pressure.md, .cursor/rules/no-speed-pressure.md, .agents/rules/no-speed-pressure.md; add one-line cross-reference from principles.md §Architectural Excellence Over Expediency; add one distilled.md entry naming it; write user-memory feedback files feedback_no_speed_pressure.md (the rule itself), feedback_performed_grounding_vs_practised.md (read-at-session-open ≠ apply-through-decisions), feedback_rule_conflict_is_signal.md (lint-or-test-rule-failure-treated-as-personal-refactor failure mode), feedback_auto_mode_is_not_permission_slip.md (auto-mode-misread-as-skip-ceremony failure mode), updating MEMORY.md index for each. Land via full commit-skill protocol with code-reviewer gateway."
    status: pending
    depends_on: [02-apply-review-findings]
  - id: 04-reviewer-backfill-landed-commits
    content: "Backfill reviewer dispatch on the four already-landed plan-3 commits (commit range fd4eabaa..b226670d covering 8fa339f4 cycle 1d, 7620fefd cycle 1b, d4fb9a8f cycle 1a, b226670d cycle 1c). Invoke in parallel: code-reviewer (gateway across the range; nominate further specialists from the delta), test-reviewer (b226670d new test against test-immediate-fails.md 22 items + describe-vs-audit lens), config-reviewer (eslint.config.ts/tsconfig*.json/vitest.config.ts/turbo.json/knip.config.ts deltas across 8fa339f4 + d4fb9a8f), architecture-reviewer-fred (cycle-1a deletion footprint + cycle-1c test placement; particular focus on import { TEST_UPSTREAM_METADATA } from '../e2e-tests/helpers/upstream-metadata-fixture.js' boundary-crossing), docs-adr-reviewer (TESTING.md + dev-server-management.md + vercel-environment-config.md + playwright.config.ts comment drift). Capture all findings."
    status: pending
    depends_on: [03-integrate-no-speed-pressure-rule]
  - id: 05-apply-backfill-findings
    content: "For each reviewer finding from step 04: implement the fix (own atomic commit per finding via full commit-skill protocol) OR record explicit written rejection rationale in this plan body. Reviewer findings are action items by default per principles.md §Compiler Time Types and Runtime Validation."
    status: pending
    depends_on: [04-reviewer-backfill-landed-commits]
  - id: 06-cycle-2a-audit-packages-core
    content: "Cycle 2a — audit packages/core/* test files for real-IO violations using `grep -rn 'spawn\\|child_process\\|fs\\.\\|readFile\\|writeFile\\|process\\.env\\s*=\\|process\\.env\\[' packages/core/ --include=*.test.ts`. Classify each match: composition root (vitest config / setup file) — permitted; designated DI fake helper file — permitted; real IO elsewhere — violation. Each violation fixed in its own atomic commit (test + fake + product-code edit landed together) via full commit-skill protocol with test-reviewer dispatch. Open per-batch sub-claim before grep; close after batch. Acceptance: post-batch grep returns only composition-root and DI-fake matches; pnpm test --filter @oaknational/<core-workspaces> exits 0."
    status: pending
    depends_on: [05-apply-backfill-findings]
  - id: 07-cycle-2b-audit-packages-libs
    content: "Cycle 2b — same audit + fix discipline as 2a, scoped to packages/libs/*. Acceptance per-batch as 2a."
    status: pending
    depends_on: [06-cycle-2a-audit-packages-core]
  - id: 08-cycle-2c-audit-packages-sdks
    content: "Cycle 2c — same audit + fix discipline as 2a, scoped to packages/sdks/*. Acceptance per-batch as 2a."
    status: pending
    depends_on: [07-cycle-2b-audit-packages-libs]
  - id: 09-cycle-2d-audit-apps-mcp
    content: "Cycle 2d — same audit + fix discipline as 2a, scoped to apps/oak-curriculum-mcp-streamable-http/. Aware: cycle 1c already deleted the spawning e2e regression-guard in this workspace; audit covers what remains. Acceptance per-batch as 2a."
    status: pending
    depends_on: [08-cycle-2c-audit-packages-sdks]
  - id: 10-cycle-2e-audit-apps-search-cli
    content: "Cycle 2e — same audit + fix discipline as 2a, scoped to apps/oak-search-cli/. Note: this workspace has its own vitest.smoke.config.ts; if cycle uncovers retire-or-keep questions, fold them in or fork a follow-up plan per scope. Acceptance per-batch as 2a."
    status: pending
    depends_on: [09-cycle-2d-audit-apps-mcp]
  - id: 11-cycle-2f-audit-agent-tools
    content: "Cycle 2f — same audit + fix discipline as 2a, scoped to agent-tools/. Acceptance per-batch as 2a."
    status: pending
    depends_on: [10-cycle-2e-audit-apps-search-cli]
  - id: 12-cycle-3a-author-eslint-rule
    content: "Cycle 3a — author packages/core/oak-eslint/src/rules/no-real-io-in-tests.ts. Triggers on *.test.ts outside allowlisted composition-root files. Flags: child_process.spawn/exec, direct fs.* calls, process.env mutation, process.cwd() reads, fetch() to non-localhost. Allowlist: vitest config files at workspace roots; designated DI fake helper files. Pair with no-real-io-in-tests.unit.test.ts (RuleTester cases) + plugin registration in plugin.ts. Land via full commit-skill protocol with config-reviewer dispatch. **Do NOT yet wire into root eslint.config.ts** — that is step 13. Acceptance: pnpm test --filter @oaknational/eslint-plugin-standards exits 0; the rule is registered but inactive at root."
    status: pending
    depends_on: [11-cycle-2f-audit-agent-tools]
  - id: 13-cycle-3b-wire-rule-into-root-config
    content: "Cycle 3b — wire no-real-io-in-tests into eslint.config.ts at the repo root. Hard sequencing point: only after cycle 2 fully closed (steps 6–11) and cycle 3a authored (step 12). Wiring earlier breaks the build. Land via full commit-skill protocol with config-reviewer dispatch. Acceptance: pnpm lint exits 0 across the entire monorepo; the rule fires only on intentional violations (none should remain after cycle 2)."
    status: pending
    depends_on: [12-cycle-3a-author-eslint-rule]
  - id: 14-pnpm-check-green
    content: "From a clean tree on feat/eef_exploration HEAD, run `pnpm check` at the repo root. All gates must exit 0. This is the load-bearing proof that the smoke-test retirement substrate is complete and the branch is structurally green. Document the result with HEAD SHA in this plan body. Fix any failure at the source per never-disable-checks; if larger than mechanical, surface to owner with named highest-priority recovery plan."
    status: pending
    depends_on: [13-cycle-3b-wire-rule-into-root-config]
  - id: 15-mcp-server-live-exercise
    content: "Boot the dev server locally, exercise the MCP tools through the protocol, then shut down cleanly. (a) From apps/oak-curriculum-mcp-streamable-http/, run `env -u VERCEL_ENV -u VERCEL_BRANCH_URL -u VERCEL_GIT_COMMIT_SHA -u VERCEL_GIT_COMMIT_REF -u SENTRY_RELEASE_OVERRIDE SENTRY_MODE=sentry pnpm dev` and capture output to /tmp/dev-boot.log. Expect 'Oak Curriculum MCP Server listening on port 3333' within ~5s. Note: the legacy SENTRY_MODE consumer path is the live contract; the rename is paused (see future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md). (b) Issue an MCP `tools/list` against http://localhost:3333/mcp; record the count and full list of tool names to /tmp/mcp-tool-exercise.log. (c) Issue an MCP `tools/call` against three representative tools — at least one curriculum-data tool (get-key-stages or search), one MCP-app/UI tool, one prompt or sequence tool. Each call returns a structurally-valid response (no SDK or transport errors); capture exchanges to the same log. (d) SIGTERM the dev server; confirm port 3333 free. Acceptance: `listening` log line present; tools/list returns >0 tools; three tools/call exchanges return successful responses."
    status: pending
    depends_on: [14-pnpm-check-green]
  - id: 16-pre-merge-divergence-analysis
    content: "Per .agent/rules/pre-merge-divergence-analysis.md, perform a pre-merge divergence analysis between feat/eef_exploration and main: `git fetch origin main`; `git log --oneline origin/main..HEAD`; `git log --oneline HEAD..origin/main`; `git diff --stat origin/main...HEAD`. Inspect any cross-cutting changes (root config files, lockfile, CI surfaces) for conflict potential. If 100+ files diverged or 10+ conflicts predicted, follow .agent/skills/complex-merge/SKILL.md. Surface findings to owner before merge proposal."
    status: pending
    depends_on: [15-mcp-server-live-exercise]
  - id: 17-merge-readiness-declaration
    content: "Owner-gated merge readiness declaration. Required evidence bundle: review findings + applied amendments (steps 1–2), no-speed-pressure rule integration (step 3), reviewer-backfill findings + fixes (steps 4–5), cycle 2a–2f green (steps 6–11), cycle 3a–3b green with rule active (steps 12–13), pnpm check green at HEAD (step 14), MCP server live exercise log (step 15), divergence analysis (step 16). Invoke release-readiness-reviewer over the bundle to synthesise GO / GO-WITH-CONDITIONS / NO-GO recommendation. Owner reviews and authorises the merge action. Merge mechanics (PR open, squash-or-merge-commit, target branch) are owner-directed; this plan does not pre-decide them."
    status: pending
    depends_on: [16-pre-merge-divergence-analysis]
---

# `feat/eef_exploration` Completion

**Last Updated**: 2026-05-04
**Status**: 🟢 CURRENT — owner-directed unified replacement of two parallel plans

## Intent

Single linear sequence to complete and merge `feat/eef_exploration`. Replaces
two separately-authored predecessor plans whose verification work overlapped
duplicatively and whose coordination introduced friction. The work is the
same; the seams are removed.

After this plan: the smoke-test retirement substrate is complete (real-IO
audit closed, ESLint rule active), the no-speed-pressure rule is integrated
across the rule estate, reviewer dispatch is current on every landed
commit, the dev server boots locally with MCP tools verified live,
divergence vs `main` is analysed, and an owner-authorised merge can land.

This plan is **simple, linear, straightforward, and comprehensive** by
owner direction (2026-05-04). It supersedes:

- `archive/superseded/eef-branch-merge-readiness.plan.superseded-by-unified-2026-05-04.md`
  (was `observability/current/eef-branch-merge-readiness.plan.md`).
- `../../architecture-and-infrastructure/archive/superseded/smoke-test-retirement-recovery-and-completion.plan.superseded-by-unified-2026-05-04.md`
  (was
  `architecture-and-infrastructure/current/smoke-test-retirement-recovery-and-completion.plan.md`).

## Context

Branch state at authoring (`feat/eef_exploration` HEAD `b226670d`):

- **Plan 1** (`fix-dev-boot-release-resolution`): ✅ landed at commit
  `2a2d1b05`. Archived to `observability/archive/completed/`.
- **Plan 2** (`replace-sentry-mode-with-observability-sinks`): 🛑
  damaged-paused-superseded; moved to
  `observability/future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`.
  Owner direction: foundational tension unnamed; do not resume until
  named in PDR/ADR. Legacy `SENTRY_MODE` consumer path is the live
  contract through this branch's merge.
- **Plan 3 (original)** (`retire-smoke-tests-all-vitest-no-real-io`):
  cycles 1a–1d landed in commits `8fa339f4`, `7620fefd`, `d4fb9a8f`,
  `b226670d`. Damaged execution (commit-skill protocol bypassed,
  reviewer dispatch not invoked, plan-body freshness not maintained).
  Plan archived to
  `architecture-and-infrastructure/archive/superseded/retire-smoke-tests-all-vitest-no-real-io.plan.md`.
  The cycles' substance landed cleanly; the discipline gap is what
  needs recovery.
- **`.agent/rules/no-speed-pressure.md`**: rule already authored
  2026-05-04 by Moonlit Shimmering Comet's session. Integration
  pending (step 3 of this plan).

## Foundation Alignment

- **principles.md §First Question**: linear unified plan is simpler
  than two coordinated parallel plans. Coordination cost was real;
  removing it removes friction.
- **principles.md §Architectural Excellence Over Expediency**: every
  step uses the full commit-skill protocol; no skip-doctrine paths.
  The no-speed-pressure rule (integrated in step 3) is the codified
  guard against the failure mode that damaged plan-3 execution.
- **principles.md §Owner Direction Beats Plan**: owner directed the
  unification.
- **testing-strategy.md §TDD-as-pairs**: cycles 2a–2f and 3a–3b each
  land test + product code together in one commit. No skipped or
  failing tests across commits.
- **never-disable-checks**: every gate is blocking; none weakened.
- **no-warning-toleration**: any new warning surfaced by step 14 is
  fixed at source in the same work-item.

## Discipline (applies to every step)

- **Commit-skill protocol**: every commit goes through
  `claim → queue (enqueue) → stage by pathspec → record-staged →
  check-commit-skill-gates.ts → verify-staged → phase pre_commit →
  git commit -F <msg> -- <pathspec> → complete → close window`. No
  exceptions. See `.agent/skills/commit/SKILL.md`.
- **Stage by explicit pathspec**: `git add <each path>` then
  `git commit -F <msg> -- <pathspec>` to filter peer-staged work
  out of the index. Hook policy blocks `git add -A`/`-all`/`.`. The
  predecessor plan-3 execution failed this discipline at commit
  `8fa339f4`; do not repeat.
- **Reviewer dispatch**: invoke `code-reviewer` as gateway after
  every non-trivial change; let it nominate specialists per the
  delta. Reviewer findings are action items by default; explicit
  rejection requires written rationale.
- **Plan-body freshness**: update todo status as each step closes;
  refresh `Last Updated`; record commit SHAs against completed
  steps in this plan body.
- **No invented urgency**: per `.agent/rules/no-speed-pressure.md`,
  any urge to skip ceremony is the diagnostic. Apply the ceremony.
- **Owner-attention discipline**: when a step requires owner
  judgement (step 17), pause and surface; do not proceed past a
  doctrine-flagged decision point on own analysis.

## Plan Review Findings

Populated by step 1. Until then this section is empty by design.

## Out-of-Scope Follow-ups (populated by step 2 if needed)

Reviewer findings that are valid but would fragment or complicate the
seventeen-step sequence are recorded here as named follow-ups, not
absorbed into the sequence:

- *(none yet — populated when step 2 runs)*

## Sequence Summary

The full linear sequence is in the frontmatter `todos` array. Summary:

| # | Step | Output |
|---|------|--------|
| 1 | Comprehensive sub-agent review of plan | Reviewer findings under §Plan Review Findings |
| 2 | Apply review findings | Plan body refined; out-of-scope follow-ups recorded |
| 3 | Integrate no-speed-pressure rule across estate | RULES_INDEX entry, 3 adapters, principles cross-ref, distilled entry, 4 memory files |
| 4 | Reviewer backfill on commits `fd4eabaa..b226670d` | Findings from 5 specialist reviewers |
| 5 | Apply backfill findings | Per-finding atomic commits or written rejections |
| 6–11 | Cycles 2a–2f real-IO audit per workspace | Per-batch grep clean; per-batch tests green |
| 12 | Cycle 3a author no-real-io-in-tests rule | Rule + RuleTester + plugin registration; not yet wired |
| 13 | Cycle 3b wire rule into root config | Rule active; pnpm lint green across monorepo |
| 14 | `pnpm check` green at HEAD | One-line note with SHA in plan body |
| 15 | Dev boot + MCP tool exercise + shutdown | `/tmp/dev-boot.log`; `/tmp/mcp-tool-exercise.log`; port 3333 free |
| 16 | Pre-merge divergence analysis vs `origin/main` | Commit-list diffs; conflict-potential findings |
| 17 | Owner-gated merge readiness declaration | Evidence bundle; release-readiness-reviewer call; owner authorisation |

## Out of Scope

- The SENTRY_MODE → OBSERVABILITY_SINKS rename (paused; see
  `future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`).
- New observability or auth work — this plan is verification +
  completion only.
- Graph-wiring work (post-merge, separate branch).
- TESTING.md scope-rewrite triage from the predecessor plan-3
  recovery (was an owner-decision step in that plan; no clear
  re-emergence trigger here — fold in only if step 4 reviewer
  backfill surfaces it as material).

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Step 1's reviewer findings collectively complicate the plan beyond simple-linear | Medium | Medium | Discipline: findings that fragment the sequence become out-of-scope follow-ups, not new steps |
| Step 14 surfaces a real test failure that did not show in iterative dev | Medium | Medium | Fix at source per never-disable-checks; if larger than mechanical, surface as named highest-priority recovery |
| Step 15's MCP tool exercise reveals a regression in a tool's response shape | Low | High | Regression is a merge blocker; route to owner; either fix in-branch or revert the responsible commit |
| Step 16 reveals unmergeable conflicts vs `main` | Low | Medium | Per `.agent/skills/complex-merge/SKILL.md`, structured workflow if 100+ files diverged or 10+ conflicts |
| Cycle 2 audit (steps 6–11) surfaces a non-trivial real-IO violation requiring product-code refactor | Medium | Medium | Each violation is its own small commit; if a single violation explodes in scope, fork a follow-up plan |
| The shared-index foreign-stage-absorption that damaged commit `8fa339f4` recurs | Low | Medium | Mandatory `git commit -- <pathspec>` filter on every commit per §Discipline; no other parallel session is active on this branch |

## Sub-agent Reviewers (step 1 brief)

The reviewer set covers plan-phase scrutiny across simplification,
systems-thinking, principles-compliance, adversarial failure-modes,
config correctness, test discipline, MCP protocol, security, auth,
observability surface, plan readability, doc alignment, and release
readiness.

| Reviewer | Lens | Brief |
|---|---|---|
| `assumptions-reviewer` | Proportionality, blocking legitimacy, assumption validity | Are the seventeen steps proportionate? Is the dependency chain (each step depends on the previous) genuinely load-bearing? Any invented blocking? |
| `architecture-reviewer-barney` | Simplification-first | Can steps collapse without losing quality? Are cycles 2a–2f genuinely six separate batches, or could a single audit step suffice? |
| `architecture-reviewer-betty` | Systems thinking, change-cost trade-offs | Does the linear-sequenced shape introduce hidden change-cost vs running cycle 2 audits in parallel? Is the no-speed-pressure rule integration shape stable for future arcs? |
| `architecture-reviewer-fred` | ADR / principles compliance | Step 15's auth path: which mode? Does it respect ADR-160 redaction barrier and ADR-158 multi-layer security? Does running with legacy `SENTRY_MODE` through merge violate any principle now that plan 2 is paused? |
| `architecture-reviewer-wilma` | Adversarial / failure modes | What failure modes does step 15 miss? What if dev server boots but a single tool's response shape is wrong — is that caught? What if cycle 3b wires the rule and a previously-unaudited test fails? |
| `code-reviewer` | Gateway | Plan-phase: are there obvious quality concerns in the plan body itself? Will be re-invoked per execution step. |
| `config-reviewer` | Tooling-config correctness | Cycle 3a's rule prescription: are the trigger globs and allowlists correctly scoped? Will the rule fire on legitimate test infrastructure files? |
| `test-reviewer` | Test discipline integrity | Cycle 2a–2f audit: does the proposed grep + classify + fix-with-DI-fake pattern preserve TDD-as-pairs? Cycle 3a's RuleTester cases: are they describe-shaped or audit-shaped? |
| `mcp-reviewer` | MCP protocol expertise | Is step 15's tools/list + tools/call exercise sufficient? Should it cover MCP App resources, prompts, sequence tools, resources/list? Brief includes ADR-123 tool catalogue. |
| `security-reviewer` | Auth + trust-boundary | Step 15's auth path: DANGEROUSLY_DISABLE_AUTH or real OAuth? Coverage of auth trust boundary? Is sensitive material captured in `/tmp/mcp-tool-exercise.log`? |
| `clerk-reviewer` | Clerk middleware behaviour | Step 15's exercise correctly covers Clerk's request-isolation-scope behaviour? Should it include a deliberate auth-failure tool call? |
| `sentry-reviewer` | Observability surface | Step 15 boots with `SENTRY_MODE=sentry`. Is the observability path proven by boot alone, or should the exercise verify a captured event surface? Any redaction-barrier checks missing? |
| `onboarding-reviewer` | Plan readability | Will a future agent picking up this plan from `current/` understand the seventeen-step sequence without back-references? |
| `docs-adr-reviewer` | Plan-body docs alignment | Are cross-references accurate (paths, commit SHAs, related-plans links)? Does any in-flight ADR need updating? |
| `release-readiness-reviewer` | GO / GO-WITH-CONDITIONS / NO-GO synthesis | Plan-phase: does the seventeen-step evidence bundle constitute sufficient release readiness? Step 17: synthesise the actual evidence. |

The four architecture reviewers (`barney`, `betty`, `fred`, `wilma`) are
the proven quartet for plan-phase scrutiny across simplification,
systems-thinking, principles-compliance, and adversarial failure-modes.

## Quality Gates

After every cycle 2 batch (steps 6–11) and every cycle 3 step (12–13),
per `.agent/plans/templates/components/quality-gates.md`:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm test
```

Step 14 runs the full canonical chain:

```bash
pnpm check
```

This expands to the full nine-layer gate taxonomy per
`docs/governance/development-practice.md §Gate Taxonomy`. All exit 0.

## Acceptance

- All seventeen steps closed with commit SHAs (or explicit no-op
  notes) recorded in this plan body.
- `pnpm check` exits 0 at the repo root (step 14).
- Dev server boots locally with `SENTRY_MODE=sentry` and reaches
  `listening` (step 15a).
- MCP tools exercise via protocol succeeds: `tools/list` returns >0
  tools, three `tools/call` exchanges return successful responses
  (step 15b/c).
- Pre-merge divergence analysis clean (step 16).
- `no-real-io-in-tests` ESLint rule wired into root config and
  passing across all workspaces (step 13).
- No-speed-pressure rule integrated across `RULES_INDEX.md`,
  Claude/Cursor/Codex adapters, `principles.md` cross-ref,
  `distilled.md`, and four user-memory feedback files (step 3).
- Reviewer-backfill findings on commits `fd4eabaa..b226670d`
  applied or rejected with rationale (steps 4–5).
- Owner authorises merge (step 17).

## Plan Exit

- All steps closed.
- Branch `feat/eef_exploration` ready for merge into `main`.
- Plan moved to `archive/completed/`.

## Lifecycle Triggers

Per `.agent/plans/templates/components/lifecycle-triggers.md`:

- **Plan promotion**: this plan is `current/` at authoring; promote to
  `active/` when step 1 begins execution.
- **ADR/PDR creation**: none required by this plan; the no-speed-pressure
  rule is already authored. If step 1's reviewer pass surfaces a
  PDR-worthy pattern, record under §Out-of-Scope Follow-ups.
- **Memory graduation**: step 3 graduates four feedback observations to
  user-memory; one entry to `distilled.md`.
- **Pattern extraction**: post-merge consolidation (see Learning Loop)
  may extract patterns from this plan's execution.
- **Plan archive**: post-merge, this plan moves to `archive/completed/`
  with closure note linking to the merge commit on `main`.

## Learning Loop

After plan close (post-merge), run `/jc-consolidate-docs` per the
session-handoff convention. Likely candidates for consolidation:
the no-speed-pressure rule (graduate to PDR if a second instance
surfaces), the stage-by-explicit-pathspec discipline (named instance
count incremented), the foreign-stage-absorption pattern (capture if
not already recorded).

## Related Plans

- `archive/completed/fix-dev-boot-release-resolution.plan.md` — plan 1,
  landed.
- `future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`
  — plan 2, paused-superseded.
- `archive/superseded/eef-branch-merge-readiness.plan.superseded-by-unified-2026-05-04.md`
  — predecessor merge-readiness plan, superseded by this plan.
- `../../architecture-and-infrastructure/archive/superseded/retire-smoke-tests-all-vitest-no-real-io.plan.md`
  — plan 3 (original), damaged-superseded.
- `../../architecture-and-infrastructure/archive/superseded/smoke-test-retirement-recovery-and-completion.plan.superseded-by-unified-2026-05-04.md`
  — predecessor recovery plan, superseded by this plan.
