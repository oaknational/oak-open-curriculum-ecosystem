---
name: "Main Sonar Remediation Rebuild From Updated Main"
overview: "Rebuild useful Sonar remediation work on a fresh branch from main."
todos:
  - id: phase-0-new-branch-and-baseline
    content: "Phase 0: create the branch and capture current main Sonar baselines."
    status: completed
  - id: phase-1-local-detectors
    content: "Phase 1: reintroduce targeted local SonarJS detectors."
    status: completed
  - id: phase-2-comparator-remediation
    content: "Phase 2: apply explicit comparator fixes to current main files."
    status: blocked
  - id: phase-3-current-main-sonar-classes
    content: "Phase 3: remediate remaining project-wide HIGH issues from main evidence."
    status: pending
  - id: phase-4-security-hotspot-review
    content: "Phase 4: review/fix current main security hotspots with site-specific rationale."
    status: pending
  - id: phase-4-quality-gate-closure
    content: "Phase 5: prove local gates and remote Sonar regression guard before review."
    status: pending
---

# Main Sonar Remediation Rebuild From Updated Main

**Last Updated**: 2026-05-06  
**Status**: PAUSED - corrective handoff; fresh session must first remove the
broken local generator/runtime experiment, then resume the current-main HIGH and
security-hotspot backlog
**Scope**: Replace the stale `fix/sonar_high_priority_issues` stack with a fresh
implementation on top of updated `main`, preserving only the useful ideas from
the old branch.

---

## Context

The old branch contains a small 7-commit Sonar remediation stack based on
`e2796757`, but updated `origin/main` is now `4864cbb4` after PR #93 and the
1.8.0 release. The divergence investigation found:

| Signal | Result |
|---|---:|
| Old branch commits not on main | 7 |
| Main commits not on old branch | 148 |
| Files changed by main since the merge-base | 652 |
| Files changed by the old branch since the merge-base | 91 |
| Overlapping changed files | 24 |

`git merge-tree` showed conflict markers and `removed in remote` cases. The
current stack should therefore be treated as research and prior intent, not as a
branch to rebase or cherry-pick.

Main being red in Sonar is expected for this lane. The purpose of the rebuild is
to remediate the current main Sonar backlog on a branch, not to preserve the old
branch's commit history and not to chase issues produced by this branch's own
delta.

## 2026-05-06 Corrective Handoff

Owner correction supersedes the previous "remote Sonar closure" framing.

A remediation branch cannot be opened to fix its own Sonar issues: branch-scoped
Sonar issues only exist after the branch introduces work. PR analysis is a
regression guard for the remediation branch, not the source of the remediation
backlog. The authoritative worklist for this plan is the current main/project
Sonar state: project-wide HIGH issues plus security hotspots on main.

Concrete correction:

- Sonar **issues** are marked false positive only when they genuinely are false
  positives. Otherwise they are fixed. They are never simply accepted.
- Security hotspots are reviewed site by site. Mark `SAFE` only when the exact
  site is proven safe with a concrete rationale. If a hotspot is unsafe, fix it.
  Do not use `ACKNOWLEDGED` unless the owner explicitly accepts a residual risk.
- Generated files are shipped code and remain inside local and remote quality
  surfaces. Do not exclude generated files from Sonar or lint, and do not disable
  checks.
- For generated-code findings, fix the generator and regenerate. If the fix
  reaches core MCP descriptor/type surfaces, stop and involve the owner before
  changing `ToolDescriptor`, `ToolClientForName`, `ToolArgsForName`, or adjacent
  aliases.
- PR #97 Sonar is useful only after main-backlog fixes are pushed: it should show
  the remediation branch did not add new problems and that the intended backlog
  moved in the right direction.

### Current Branch And Local State

Branch: `fix/sonar-fixes-20260506`.

Committed and pushed before the correction:

- `457fa1f0 fix(sonar): remediate quality gate blockers`
- `b903554b chore(collaboration): close commit window state`
- Draft PR: <https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/97>

Remote PR #97 check snapshot after the first push:

| Check | Result |
|---|---|
| SonarCloud Code Analysis | fail |
| GitHub Actions test | pass |
| CodeQL | skipping |
| Analyze actions/javascript-typescript | pass |
| Vercel | pass |

Current Sonar evidence gathered during the corrective pause:

| Scope | Count / status |
|---|---:|
| Project-wide open HIGH issues | 133 |
| Project-wide security hotspots | 154 |
| Project-wide hotspots `TO_REVIEW` | 143 |
| Project-wide hotspots `REVIEWED` | 11 |
| Since-leak/new-code hotspots | 18 |
| Since-leak/new-code hotspots `TO_REVIEW` | 7 |
| Since-leak/new-code hotspots `REVIEWED` | 11 |
| PR #97 open issues | 5 |
| PR #97 Quality Gate | ERROR |
| PR #97 `new_duplicated_lines_density` | 40.1 (threshold 3) |
| PR #97 `new_security_hotspots_reviewed` | 0.0 (threshold 100) |
| PR #97 `new_violations` | 5 (threshold 0) |

Local uncommitted state at handoff includes broken experimental work in nine
files. The risky/unwanted part is the generated MCP executor/generator refactor
that tried to reduce branch PR duplication by centralising descriptor invocation:

- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-execute-file.ts`
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-execute-file.unit.test.ts`
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.unit.test.ts`
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/runtime/execute.ts`

That experiment is useless for the corrected objective and must be removed first
in the fresh session. Do not carry it forward.

The same local dirty set also contains small PR-issue fixes in:

- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts`
- `apps/oak-search-cli/src/lib/indexing/year-ordering.ts`
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/generated-runtime.integration.test.ts`
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-schema.ts`
- `packages/sdks/oak-sdk-codegen/code-generation/zodgen-core.ts`

Fresh-session recovery must inspect these separately. Keep only those that
directly remediate the main/project HIGH or hotspot backlog under this plan.
Discard PR-only churn that does not advance the main backlog.

### Fresh-Session First Step

1. Preserve this corrective handoff documentation.
2. Inspect the local dirty diff and explicitly revert the broken generated MCP
   executor/generator experiment. Do not blindly reset documentation surfaces.
3. Re-run `git status --short` and confirm no broken generated-runtime refactor
   remains.
4. Re-query Sonar main/project HIGH issues and hotspots.
5. Build the next work slice from the main/project backlog, not from PR #97's
   delta.

## Abandoned Branch Lesson

The abandoned branch happened and should remain part of the project memory. Its
value is the investigation it forced:

- a stale Sonar remediation stack can become more dangerous than useful after a
  large main-side merge;
- branch-local collaboration-state artefacts are not the right proof that the
  work happened when the implementation branch is being deliberately replaced;
- useful learning should be carried as plan/evidence/continuity prose, while
  stale claim mechanics should be dropped or recreated cleanly on the new
  branch;
- the new branch must preserve the conceptual fixes and the decision record, not
  the old commit graph.

## Current Sonar Main Snapshot

The 2026-05-06 Sonar MCP inspection of
`oaknational_oak-open-curriculum-ecosystem` reported the main Quality Gate as
`ERROR`.

Current failing Quality Gate conditions:

| Condition | Main value | Threshold |
|---|---:|---:|
| `reliability_rating` | 4 | 3 |
| `new_duplicated_lines_density` | 6.5 | 3 |
| `new_security_hotspots_reviewed` | 61.1 | 100 |
| `new_violations` | 30 | 0 |
| `security_hotspots_reviewed` | 7.1 | 100 |

Current main measures from the same inspection:

| Measure | Value |
|---|---:|
| Bugs | 59 |
| Code smells | 1091 |
| Vulnerabilities | 0 |
| Security hotspots | 143 |
| Total violations | 1150 |
| Open HIGH/BLOCKER issues | 132 |

Later corrective handoff evidence reported 133 project-wide open HIGH issues.
Treat these numbers as evidence snapshots, not fixed constants. The fresh
session must re-query before editing.

## Useful Concepts To Salvage

The old branch should not be replayed literally. Salvage only these concepts:

1. **Targeted SonarJS detector activation**: current main still registers
   `eslint-plugin-sonarjs` in `packages/core/oak-eslint`, but it does not enable
   the targeted rules used by the old stack:
   - `sonarjs/cognitive-complexity`
   - `sonarjs/no-alphabetical-sort`
   - `sonarjs/no-nested-functions`
   - `sonarjs/void-use`
2. **Explicit comparator remediation**: the intent of replacing ambiguous
   `sort()` / `toSorted()` calls with explicit numeric or `localeCompare`
   comparators remains valid. Known current-main examples still include
   `packages/libs/search-contracts/src/field-inventory.ts` and several
   `agent-tools` paths.
3. **Generator-first discipline**: generated SDK output must be fixed by
   generator/source changes plus regeneration, not hand edits.
4. **Security-hotspot disposition discipline**: review each hotspot with
   site-specific rationale. If the code is unsafe, fix it. If it is safe, mark
   `SAFE` with the concrete reason. Do not use bulk dispositions.
5. **Issue disposition discipline**: issue statuses are not a pressure valve.
   False positives may be marked false positive only when genuinely false.
   Otherwise fix the issue.
6. **Evidence discipline**: reuse the old evidence directory only as historical
   context. Regenerate current evidence from Sonar and local lint on the fresh
   branch.

## Work To Drop Or Treat As Superseded

Do not carry these old-branch changes forward as diffs:

- **Legacy OAuth trace harness deletion**: drop. Updated main already removed the
  `apps/oak-curriculum-mcp-streamable-http/smoke-tests` surface more completely.
  Replaying the old change risks resurrecting deleted files.
- **Generated API schema refresh around `unitOrder`**: drop as a patch. Updated
  main already has the relevant `unitOrder` schema/search-cli state. Regenerate
  only if current evidence proves schema drift.
- **Old operational handoff and evidence edits**: replace. They describe the
  pre-PR #93 branch state. New branch evidence must be authoritative.
- **Whole-stack rebase or cherry-pick**: do not do. It crosses large main-side
  refactors and deleted surfaces.

## Non-Goals

- Do not rebase or merge the old `fix/sonar_high_priority_issues` stack.
- Do not cherry-pick generated output, smoke-test deletion, or stale handoff
  commits.
- Do not silence, downgrade, or suppress Sonar rules to make the dashboard
  green.
- Do not treat PR-scoped Sonar findings as the backlog definition for this
  branch. PR Sonar is a regression guard after main-backlog remediation.
- Do not accept Sonar issues. Mark false positive only when true, otherwise fix.
- Do not hand-edit generated SDK output unless the generator/source change and
  regeneration are in the same phase.
- Do not create another fresh branch unless the owner explicitly redirects. The
  active branch is `fix/sonar-fixes-20260506`; recover it by removing the broken
  local experiment first.

## Branch Transition State

Branch transition has already happened:

1. Current branch is `fix/sonar-fixes-20260506`.
2. The branch has been pushed.
3. Draft PR #97 exists to provide remote regression feedback.
4. The next session must recover the working tree before new implementation:
   remove the broken generated executor/generator experiment, preserve this
   corrected handoff documentation, then re-query main/project Sonar evidence.

## Foundation Alignment

- **Principles**: all gates must be green before merge; no disabled checks; fix
  root causes rather than dashboards.
- **Testing strategy**: comparator and refactor changes need behavioural tests
  where ordering, parsing, generation, or CLI output semantics matter.
- **Schema-first execution**: SDK schema and generated files are changed through
  generator/source contracts and regeneration.
- **Could it be simpler?** Yes: rebuild from current main, apply small local
  edits by rule class, and use current evidence. This is simpler and safer than
  reconciling stale history.

## Lifecycle Trigger Commitment

This is non-trivial, cross-workspace remediation work. Apply
[`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md) before
implementation:

1. Run `start-right-quick` or `start-right-thorough` after branch creation.
2. Check active claims and recent shared communication.
3. Register active areas before edits.
4. Record direction changes in the shared communication log or thread record.
5. Close claims and refresh continuity on handoff.
6. Run consolidation at the end of the work.

## Quality Gate Strategy

Use targeted gates inside implementation slices, then the canonical full gate
from root before merge.

Remote Sonar strategy:

1. Query project/main HIGH issues and security hotspots.
2. Work by issue class and ownership area.
3. For each issue class, decide `fix` vs `false positive` based on the exact
   site, not on dashboard pressure.
4. For each hotspot, decide `fix` vs `SAFE` based on the exact site; document
   the rationale in Sonar when marking safe.
5. Push only after local gates are green.
6. Use PR #97 Sonar to verify the branch did not introduce regressions and that
   main-backlog remediation is reflected remotely.

After each implementation task, run the smallest deterministic checks that prove
the touched behaviour, plus the relevant package lint/test command.

After each phase, run targeted phase gates only. These are not merge-readiness
proof:

```bash
pnpm type-check
pnpm lint
pnpm test
```

Before merge, `pnpm check` from the repo root and the Sonar Quality Gate must
both be green. A red gate is not acceptable merely because it was red on main
when the branch began.

If a detector produces a red state, it must be audit-only scratch evidence or
be activated in the same green slice that clears every local finding for that
detector. No commit, phase close, or handoff may leave lint red.

---

## Resolution Plan

### Phase 0: New Branch And Current Baseline

**Goal**: Confirm the branch-transition work is complete and replace stale
evidence with a condition-by-condition Quality Gate ledger.

**RED**

- Confirm the old branch is not being rebased or replayed.
- Refresh Sonar main evidence with MCP/CLI, grouped by failing Quality Gate
  condition:
  - `reliability_rating`
  - `new_duplicated_lines_density`
  - `new_security_hotspots_reviewed`
  - `new_violations`
  - `security_hotspots_reviewed`
- Run local inventory for the rule classes that the old branch targeted:

```bash
rg -n "\\.(toSorted|sort)\\s*\\(" .
rg -n "\\bvoid\\b" .
rg -n "cognitive-complexity|no-nested-functions|no-alphabetical-sort|void-use" .
```

**GREEN**

- Create a current evidence directory for the rebuild.
- Write a concise baseline summary: failing gate condition, rule or hotspot
  class, file, workspace, intended owner surface, disposition, and expected
  Quality Gate metric movement.
- Confirm smoke-test deletion and `unitOrder` state are already handled by
  current main before any code edit.

**REFACTOR**

- Split implementation into independently reviewable rule-class slices:
  local detector activation, comparator fixes, `void` rewrites, generator-owned
  fixes, complexity/nesting extraction, hotspot review/duplication closure.

**Acceptance Criteria**

1. The new branch starts from updated `main`.
2. Evidence is refreshed from current Sonar state, not copied from the old
   branch.
3. Superseded old-branch work is explicitly excluded from implementation.
4. Local inventory agrees with or explains drift from Sonar.
5. Open scope questions are closed:
   - security hotspots are in scope because both hotspot metrics fail;
   - duplication is scoped to the failing new-code gate unless touched files
     have obvious structural duplication cleanup;
   - this plan is the authority for targeted SonarJS activation on this branch
     and narrows the older broader SonarJS activation plan.

### Phase 1: Reintroduce Targeted Local Detectors

**Goal**: Reapply the old branch's useful lint-gate idea against current main.

**RED**

- Run each targeted SonarJS rule in audit-only scratch mode, or activate it only
  inside a same-slice green fix.
- Capture lint output for current main files without committing a red state.
- Record Sonar/local drift, especially where SonarCloud reports findings that
  local ESLint cannot reproduce.

**GREEN**

- Activate only the targeted rules needed for this lane, and only when the
  corresponding local findings are green in the same slice.
- Keep rule configuration narrow and explicit in
  `packages/core/oak-eslint/src/configs/recommended.ts`.
- Avoid broad `sonarjs.configs.recommended` activation in this lane.

**REFACTOR**

- Ensure generated output, fixtures, and intentional exceptions are handled by
  explicit overrides only where justified.
- Update evidence files with the post-activation lint baseline.

**Acceptance Criteria**

1. The targeted rules are enabled or explicitly deferred with rationale.
2. The local detector surface is documented and reproducible.
3. No controlled-red lint state is committed or handed off.

### Phase 2: Comparator Remediation

**Goal**: Fix S2871-style ambiguous sort ordering in current main files.

**RED**

- Use current Sonar/local evidence to list comparator-free `sort()` and
  `toSorted()` calls by semantic category:
  - string alphabetical ordering.
  - numeric ordering.
  - stable deterministic key ordering.
  - cases where default ordering is genuinely intentional.

**GREEN**

- Add explicit comparators directly at call sites where simple.
- Add small local helpers only when repeated ordering semantics justify them.
- Preserve behaviour with tests for affected contracts, CLI output, generated
  ordering, or collaboration-state ordering where semantics matter.

**REFACTOR**

- Remove any redundant comparator wrappers.
- Keep generated output changes generator-owned.

**Acceptance Criteria**

1. Current-main comparator findings are fixed or dispositioned with evidence.
2. `packages/libs/search-contracts/src/field-inventory.ts` has explicit,
   tested string ordering if still present.
3. `agent-tools` comparator fixes are applied to current files, not old diffs.
4. Local detector and relevant tests pass.

### Phase 3: Remaining Project/Main HIGH Issue Classes

**Goal**: Fix or genuinely false-positive the remaining project/main HIGH issue
classes.

**RED**

- Re-query project/main HIGH issues and group them by rule, file ownership, and
  remediation mode.
- Classify each remaining HIGH issue:
  - reliability bugs.
  - cognitive complexity and nested functions.
  - `void` operator use.
  - comparator/sort ordering.
  - generated-code findings.
  - test-only findings.
- Identify whether each issue requires code change, test change, generator
  change, or a true false-positive disposition.

**GREEN**

- Apply behaviour-preserving extractions for complexity and nesting.
- Rewrite `void` use according to the chosen `sonarjs/void-use` policy.
- Fix generated SDK issues through generator/source changes and regeneration.
- Mark an issue false positive only when the exact finding is genuinely false.

**REFACTOR**

- Remove temporary evidence-only scripts unless they are promoted to real gates.
- Keep documentation focused on durable prevention and final evidence.

**Acceptance Criteria**

1. Every targeted project/main HIGH issue has a concrete `fixed` or true
   `false positive` disposition.
2. Generated files match regenerated output.
3. No issue is accepted merely to quiet Sonar.
4. Targeted local and package gates pass after each slice.

### Phase 4: Security Hotspot Review And Remediation

**Goal**: Review and remediate the project/main security hotspots with exact
site-specific rationale.

**RED**

- Re-query all project hotspots and the since-leak subset.
- Group hotspots by rule and site type:
  - regex denial-of-service.
  - insecure HTTP literals.
  - pseudorandom number usage.
  - public writable directory usage.
  - PATH/environment execution concerns.
  - test-only fixture concerns.
- For each hotspot, inspect the exact site before deciding.

**GREEN**

- Fix unsafe code.
- Mark `SAFE` only when the exact site is safe and record the concrete reason in
  Sonar.
- Use `ACKNOWLEDGED` only if the owner explicitly accepts a residual risk.
- Prefer code fixes over dispositions where a small safe refactor removes the
  hotspot without harming behaviour.

**REFACTOR**

- Capture recurring safe-test-fixture patterns only after enough examples exist
  to justify a durable rule or helper.
- Avoid bulk hotspot status changes.

**Acceptance Criteria**

1. Every targeted hotspot has a site-specific disposition.
2. Unsafe hotspots are fixed.
3. `SAFE` comments explain why that exact site is safe.
4. No `ACKNOWLEDGED` hotspot exists without explicit owner acceptance.

### Phase 5: Quality Gate Closure

**Goal**: Prove the branch is merge-ready.

**RED**

- Run `pnpm check` from repo root and record failures.
- Trigger or wait for the relevant Sonar analysis.
- Compare project/main backlog movement and PR regression state with the Phase 0
  baseline.

**GREEN**

- Fix all local gate failures.
- Fix or correctly disposition targeted Sonar HIGH issues and hotspots.
- Fix all branch-introduced PR Sonar regressions.
- Refresh evidence summaries and update this plan's todo statuses.

**REFACTOR**

- Run `/jc-consolidate-docs`.
- Move settled implementation knowledge into durable docs if needed.
- Prepare a clean final handoff and commit bundle with explicit pathspecs.

**Acceptance Criteria**

1. `pnpm check` passes.
2. Sonar main/project backlog targets are closed for this branch's agreed scope.
3. PR #97 Sonar does not introduce regressions.
4. No old-branch superseded work was accidentally restored.
5. Plan, evidence, and handoff state reflect current main and the active branch.
6. The branch is not merged until all gates are green or an owner-approved
   residual remote metric is explicitly documented.

## Reviewer Scheduling

- **Pre-execution**: assumptions review for the rebuild-not-replay strategy,
  Quality Gate ledger, and hotspot disposition policy.
- **During**: type, test, and code review after each substantial rule-class
  slice.
- **Post**: release-readiness and docs/ADR review before merge.

## Closed Scope Decisions

1. Security hotspot review/remediation stays in scope because both hotspot
   Quality Gate metrics currently fail.
2. Duplication remediation is not the backlog source. Reduce duplication when it
   is a true branch regression or a natural structural cleanup in touched code;
   do not enter core MCP type surfaces to chase a PR-only duplication metric
   without owner participation.
3. The current branch name is `fix/sonar-fixes-20260506`; do not create the
   suggested placeholder branch.
4. This plan is the authority for targeted SonarJS activation on this branch and
   narrows the broader SonarJS activation plan for these four rules only.

## Completion Checklist

- [x] Active branch created from updated `main`.
- [x] Draft PR opened for remote regression feedback.
- [ ] Broken local generated executor/generator experiment removed.
- [ ] Current Sonar evidence regenerated.
- [ ] Targeted local SonarJS detector surface restored or dispositioned.
- [ ] Comparator remediation applied to current main files.
- [ ] Project/main HIGH issues fixed or marked true false positive.
- [ ] Security hotspots fixed or marked `SAFE` with site-specific rationale.
- [ ] Full local gates pass.
- [ ] PR Sonar confirms no branch-introduced regressions.
- [ ] Consolidation and handoff complete.
