---
name: "Main Sonar Remediation Rebuild From Updated Main"
overview: "Rebuild useful Sonar remediation work on a fresh branch from main."
todos:
  - id: phase-0-new-branch-and-baseline
    content: "Phase 0: create the branch and capture current Sonar baselines."
    status: completed
  - id: phase-1-local-detectors
    content: "Phase 1: reintroduce targeted local SonarJS detectors."
    status: completed
  - id: phase-2-comparator-remediation
    content: "Phase 2: apply explicit comparator fixes to current main files."
    status: in_progress
  - id: phase-3-current-main-sonar-classes
    content: "Phase 3: remediate remaining current-main Sonar blockers."
    status: blocked
  - id: phase-4-quality-gate-closure
    content: "Phase 4: prove local and Sonar gates are green before review."
    status: pending
---

# Main Sonar Remediation Rebuild From Updated Main

**Last Updated**: 2026-05-06  
**Status**: PAUSED - local `pnpm check` green; continue Sonar remediation in a
fresh session
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
to make the current main Sonar gate green, not to preserve the old branch's
commit history.

## 2026-05-06 Local Gate Green Pause

Owner direction stopped the earlier implementation after the generated MCP
runtime executor refactor began chasing TypeScript errors. The original problem
was narrow: enabling `sonarjs/cognitive-complexity` made the generated
`packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/runtime/execute.ts`
file fail local lint because the generator emitted one large switch with repeated
validation/invocation/output-checking bodies.

The original problem is **not** to generalise the MCP descriptor contract or
core tool type aliases. The attempted cure in
`code-generation/typegen/mcp-tools/parts/generate-execute-file.ts` introduced a
generic invoker-map shape; `pnpm --filter @oaknational/sdk-codegen build` then
failed because TypeScript could not preserve each literal tool name through the
generic indexed access. Do not continue that line without owner involvement.

Owner correction on the decision space:

- Generated files are shipped code and remain inside local and remote quality
  surfaces. Stopping Sonar or local lint from scanning generated files is not an
  acceptable route; it disables fast feedback and violates the no-disabled-checks
  doctrine.
- The build-green recovery was to roll back the generic invoker-map abstraction
  only, while preserving the unrelated generated `void flatArgs` and strict
  flat-schema fixes.
- The cognitive-complexity cure is now generator-owned and literal-preserving:
  the generator emits concrete per-tool invocation helpers and a simple literal
  switch delegation, not a generic indexed map and not core MCP type broadening.

Approved recovery sequence:

1. Prefer the smallest architecture-preserving option that leaves core MCP tool
   types unchanged.
2. Roll back the attempted generic invoker-map generator change and regenerate
   `runtime/execute.ts` so the existing literal switch narrowing is restored.
3. If generated output itself must be structurally changed later, split emitted
   per-tool invokers into generated per-tool modules or literal switch
   delegation in a way that preserves existing literal descriptor types.
4. Touch `ToolDescriptor`, `ToolClientForName`, `ToolArgsForName`, or adjacent
   core aliases only with explicit owner participation.

Current verification state after rollback and literal-preserving executor split:

- `pnpm --filter @oaknational/sdk-codegen sdk-codegen` passed after the attempted
  generic invoker-map rollback and regenerated SDK outputs.
- `pnpm --filter @oaknational/sdk-codegen build` passed after the rollback.
- `pnpm --filter @oaknational/curriculum-sdk test` passed after updating stale
  tests to exercise the flat generated MCP argument boundary while still proving
  SDK invocation receives nested `{ params: {} }`.
- `pnpm --filter @oaknational/sdk-codegen type-check`, `pnpm --filter
  @oaknational/sdk-codegen lint:fix`, and `pnpm --filter
  @oaknational/sdk-codegen test` passed after extracting `ResponseMapEntry` into
  a sibling response-map contract file to remove a dependency-cruiser cycle.
- `pnpm depcruise` passed after the response-map contract extraction.
- Full root `pnpm check` passed on 2026-05-06 after a complete restart from the
  top of the gate sequence.
- The generated executor now preserves literal tool-name dispatch without
  touching `ToolDescriptor`, `ToolClientForName`, `ToolArgsForName`, or adjacent
  core aliases.
- The workspace-local pnpm cache directory is generated dependency state and is
  now ignored via `.gitignore` (`.pnpm-store/`); do not treat it as source or
  evidence.
- The branch remains mid-implementation for remote Sonar closure. Do not continue
  other Sonar slices in this session; pick up the next remediation step fresh.

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

These numbers are a starting snapshot only. Phase 0 must refresh the evidence
after the new branch is created from updated `main`.

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
4. **Evidence discipline**: reuse the old evidence directory only as historical
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
- Do not hand-edit generated SDK output unless the generator/source change and
  regeneration are in the same phase.
- Do not stage this plan on the old branch. Carry it unstaged, then stage it
  only after creating the new branch from updated `main`.

## Branch Transition Plan

Before starting implementation:

1. Confirm the working tree and decide what to carry from the old branch. The
   intended carry-forward artefact is this plan file only.
2. Update local `main` from `origin/main`.
3. Create a fresh remediation branch from updated `main`.
4. Stage this plan on the fresh branch.
5. Re-run start-right, inspect active claims, and register the implementation
   claim before touching code.

Suggested branch name:

```bash
fix/main-sonar-remediation-rebuild
```

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

### Phase 3: Remaining Current-Main Sonar Blocker Classes

**Goal**: Close the remaining Sonar Quality Gate blockers on current main.

**RED**

- Classify each remaining Quality Gate blocker:
  - reliability bugs.
  - new violations.
  - cognitive complexity and nested functions.
  - `void` operator use.
  - duplicated lines.
  - security hotspots requiring review.
- Identify whether each blocker requires code change, test change, generator
  change, documentation/evidence, or Sonar hotspot review.

**GREEN**

- Apply behaviour-preserving extractions for complexity and nesting.
- Rewrite `void` use according to the chosen `sonarjs/void-use` policy.
- Fix generated SDK issues through generator/source changes and regeneration.
- Review or remediate security hotspots with evidence. Mark hotspots reviewed
  only when the code is fixed or safe with concrete evidence, or when the owner
  explicitly approves an `ACKNOWLEDGED` risk acceptance.
- Reduce duplication structurally where it is part of the failing gate.

**REFACTOR**

- Remove temporary evidence-only scripts unless they are promoted to real gates.
- Keep documentation focused on durable prevention and final evidence.

**Acceptance Criteria**

1. Every current Quality Gate blocker has a concrete disposition.
2. Generated files match regenerated output.
3. Hotspot review status is backed by recorded rationale. Any `ACKNOWLEDGED`
   hotspot includes owner approval.
4. Duplications that block the gate are reduced or otherwise resolved in Sonar.

### Phase 4: Quality Gate Closure

**Goal**: Prove the branch is merge-ready.

**RED**

- Run `pnpm check` from repo root and record failures.
- Trigger or wait for the relevant Sonar analysis.
- Compare branch Sonar state with the Phase 0 baseline.

**GREEN**

- Fix all local gate failures.
- Fix all Sonar Quality Gate failures.
- Refresh evidence summaries and update this plan's todo statuses.

**REFACTOR**

- Run `/jc-consolidate-docs`.
- Move settled implementation knowledge into durable docs if needed.
- Prepare a clean final handoff and commit bundle with explicit pathspecs.

**Acceptance Criteria**

1. `pnpm check` passes.
2. Sonar Quality Gate is green.
3. No old-branch superseded work was accidentally restored.
4. Plan, evidence, and handoff state reflect current main and the fresh branch.
5. The branch is not merged until all gates are green.

## Reviewer Scheduling

- **Pre-execution**: assumptions review for the rebuild-not-replay strategy,
  Quality Gate ledger, and any hotspot acceptance policy.
- **During**: type, test, and code review after each substantial rule-class
  slice.
- **Post**: release-readiness and docs/ADR review before merge.

## Closed Scope Decisions

1. Security hotspot review/remediation stays in scope because both hotspot
   Quality Gate metrics currently fail.
2. Duplication remediation targets the failing new-code gate. Overall
   duplication is reduced only where the touched files make structural cleanup
   obvious.
3. The current branch name is `fix/sonar-fixes-20260506`; do not create the
   suggested placeholder branch.
4. This plan is the authority for targeted SonarJS activation on this branch and
   narrows the broader SonarJS activation plan for these four rules only.

## Completion Checklist

- [ ] Fresh branch created from updated `main`.
- [ ] This plan staged only on the fresh branch.
- [ ] Current Sonar evidence regenerated.
- [ ] Targeted local SonarJS detector surface restored or dispositioned.
- [ ] Comparator remediation applied to current main files.
- [ ] Remaining Quality Gate blockers remediated or reviewed with evidence.
- [ ] Full local gates pass.
- [ ] Sonar Quality Gate is green.
- [ ] Consolidation and handoff complete.
