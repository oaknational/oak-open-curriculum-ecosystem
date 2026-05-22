---
name: "Commit-queue intent-scope discipline — make intent.files load-bearing for fingerprint and commit scope"
overview: "Tighten three commit-queue subcommands (record-staged, verify-staged/verify-staged-again, commit) so each scopes its operation to the intent record's existing `files` field instead of operating over the whole index. Closes the multi-writer audit-trail gap surfaced 2026-05-22 when a writer's ff2 plan-edit commit would have swept a peer's in-flight 9.2 eslint-config work staged in the shared index. Replace-don't-bridge: the data model already declares the scope; the operations don't honour it. No new CLI flag, no schema break, no new ADR."
todos:
  - id: phase-0-foundation
    content: >
      Phase 0: Verify foundation assumptions. Confirm intent.files is the
      semantic scope of the audit-trail invariant; confirm current code
      reads `git diff --cached --name-status` with no pathspec; confirm
      the inner `git commit` invocation injection point in
      commit-workflow-runtime.ts has no pathspec; confirm no other queue
      subcommand needs the same treatment.
    status: completed
    completed_at: 2026-05-22
    completed_by: "Stormbound Kiting Squall (claude/ddbea2)"
    evidence: "Plan §Phase 0 Task 0.2 Findings; verified by file inspection."
    depends_on: []
  - id: cycle-1-fingerprint-helper-scoped
    content: >
      Cycle 1.1: Add NEW `getStagedBundleScoped` (mandatory pathspec) in
      git.ts; route `runRecordStagedCommand` in cli.ts:130-143 through
      the scoped variant using `intent.files`. Failing test (atomic-
      landing): two-writer scenario where writer A's fingerprint is
      independent of writer B's out-of-scope staging activity, AND
      writer A's fingerprint changes under writer A's own in-scope
      drift. One commit; tree green at end. Existing unscoped helpers
      retained unchanged for Cycles 1.2 + 1.3 callers; no optional
      fallback in committed history.
    status: completed
    completed_at: 2026-05-22
    completed_by: "Stormbound Kiting Squall (claude/ddbea2)"
    evidence: "Commit fb0833a4 (atomic test+product code + plan body) + e242e633 (post-delivery reviewer absorption + fixture rename). All 5 AC satisfied; 471/471 tests green; husky pre-commit chain green. Pre-execution + post-delivery reviewers all GO/GO-WITH-AMENDMENTS (recorded in §Phase 0 Task 0.3)."
    depends_on: [phase-0-foundation]
  - id: cycle-2-verify-staged-scoped
    content: >
      Cycle 1.2: Route `runVerifyStagedCommand` (cli.ts:162) and the
      verify-staged-before/verify-staged-after sites in
      commit-workflow.ts + commit-workflow-runtime.ts through
      `getStagedBundleScoped` using `intent.files`. Architecture-betty
      Shape A: widen `CommitWorkflowDependencies.getStagedBundle` to
      `(input: { readonly pathspec: readonly string[] }) => StagedBundle`;
      `repoRoot` absorbed in runtime closure with explicit construction
      (no spread) per type-expert. The pre-existing `verifyStagedBundle`
      handles scoped data unchanged; no new core function needed.
      Writer-independence invariants + empty-pathspec boundary +
      overlapping-scope + dep-wiring origin-trace asserted across
      `commit-queue-verify-staged-scope.unit.test.ts` (NEW, 4 tests)
      and `commit-workflow.unit.test.ts` (extended).
    status: completed
    completed_at: 2026-05-22
    completed_by: "Stormbound Kiting Squall (claude/ddbea2)"
    evidence: "476/476 tests green (471 → 476: +4 verify-scope + 1 dep-wiring pathspec capture); type-check + lint clean. Pre-execution: architecture-expert-betty (Shape A), assumptions-expert (proportional + 2 pin-downs), code-expert gateway (APPROVED WITH CONDITIONS — all absorbed), test-expert + type-expert (focused — absorbed). Cycle-shape simplification: NEW `verifyScopedStagedBundle` proved unnecessary; existing `verifyStagedBundle` accepts scoped data without modification."
    depends_on: [cycle-1-fingerprint-helper-scoped]
  - id: cycle-3-commit-pathspec
    content: >
      Cycle 1.3 (RESHAPED 2026-05-22 post-metacognition by Starlit
      Beaming Aurora): the cycle where the system state finally gets
      described. One system state ("commit-queue commit honours
      intent.files scope across peer staging drift") takes one
      describing test surface — `commit-workflow.unit.test.ts` — with
      seven workflow-level invariants (a)–(g) observed at the
      injected-deps boundary via the capture-list pattern. Compile-
      time non-empty narrowing applies to ALL three load-bearing
      types: `GetStagedBundleInput.pathspec`, the workflow's
      `getStagedBundle` dep input pathspec, and the workflow's
      `runGitCommit` dep input pathspec — all narrow to `readonly
      [string, ...string[]]`. Single narrowing site at
      `runCommitWorkflow` entry immediately after `loadIntent` — the
      narrowed intent flows into both `runVerifyStage` and
      `runCommitAndComplete`. Runtime `runGitCommit` closure receives
      `{ pathspec }` and appends `['--', ...pathspec]` to inner `git
      commit` spawn argv. Canonical rename `getStagedBundleScoped` →
      `getStagedBundle` and `ScopedStagedBundleInput` →
      `GetStagedBundleInput`. **Delete** `commit-queue-record-staged-
      scope.unit.test.ts` and `commit-queue-verify-staged-scope.unit
      .test.ts` — they were implementation-coupled scaffolding (complex
      `fakeRunGitFor` mock re-implementing git argv parsing; asserted
      argv-assembly strings rather than system state); the workflow-
      level invariants describe the state in full. NO new `commit-
      queue-commit-pathspec.unit.test.ts` (originally planned;
      collapsed into the single workflow describing-surface).
      Forward-trace closeout broadcast at end of cycle. One commit;
      tree green; atomic narrowing + threading + rename + scaffolding-
      test deletion + invariant additions.
    status: completed
    completed_at: 2026-05-22
    completed_by: "Starlit Beaming Aurora (claude/1977cf)"
    evidence: "Commit 896312d0 (atomic TDD landing); 472/472 tests; aggregate pnpm check GREEN 104/104. Closeout broadcast cf32f2c1 anchored in shared-comms-log.md (markdown anchor) names failure-mode instances A/B/C."
    depends_on: [cycle-2-verify-staged-scoped]
  - id: phase-final-hardening
    content: >
      Phase Final: Update `.agent/skills/commit/SKILL-CANONICAL.md` to
      note the queue ceremony is now intent-scoped (no Path-B bypass
      needed for multi-writer scenarios); agent-tools filtered gates
      plus root aggregate gate (`pnpm check`) pass; consolidation pass
      (docs-adr-expert post-review + napkin entry on resolved
      coordination gap). Verify the Cycle 1.3 forward-trace closeout
      broadcast targets persistent shared-comms-log markdown anchors
      (not event UUIDs) so the anchor survives comms-event retention
      sweeps.
    status: completed
    completed_at: 2026-05-22
    completed_by: "Starlit Beaming Aurora (claude/1977cf)"
    evidence: "Commit 3f6b258a (SKILL update + closeout broadcast residue); aggregate pnpm check GREEN 104/104; SKILL-CANONICAL §'Intent-Scoped End-to-End (2026-05-22 cure)' subsection; closeout broadcast cf32f2c1 anchored in shared-comms-log.md."
    depends_on: [cycle-3-commit-pathspec]
status: complete
isProject: false
---

# Commit-Queue Intent-Scope Discipline

**Last Updated**: 2026-05-22 (arc COMPLETE — Phase Final + Cycle 1.3 + plan-reshape landed; ready for archive transition to `archive/completed/` at next consolidation pass)
**Status**: 🟢 COMPLETE — Phase 0 ✓, Cycle 1.1 ✓ (`fb0833a4` + `e242e633`), Cycle 1.2 ✓ (`6b5c9b4e`), Cycle 1.3 ✓ (`896312d0`), Phase Final ✓ (`3f6b258a`)
**Scope**: Make the commit-queue intent record's `files` field load-bearing for the workflow-level system state ("commit-queue commit honours intent.files scope across peer staging drift"). Cycle 1.3 lands the describing-surface for that state in `commit-workflow.unit.test.ts` and retires the implementation-coupled scaffolding tests from Cycles 1.1 + 1.2.

## Progress Snapshot

| Phase | Status | Evidence |
|---|---|---|
| Phase 0 — surface verification | ✓ Complete | §Phase 0 Task 0.2 Findings (2026-05-22 by Stormbound) |
| Cycle 1.1 — `getStagedBundleScoped` + `record-staged` adoption | ✓ Complete | `fb0833a4` (atomic test+product code) + `e242e633` (reviewer absorption + fixture rename) |
| Cycle 1.2 — `verify-staged`/`verify-staged-again` adoption (no new core function — existing `verifyStagedBundle` handles scoped data unchanged) | ✓ Completed | Atomic landing: test + product code (5 file changes). 476/476 tests green; type-check + lint clean. `architecture-expert-betty` Shape A absorbed: `CommitWorkflowDependencies.getStagedBundle` widened to `(input: { readonly pathspec: readonly string[] }) => StagedBundle`; `commit-workflow-runtime.ts` explicit construction per type-expert (no spread). New `commit-queue-verify-staged-scope.unit.test.ts` (4 tests covering invariants a/b/c/d); `commit-workflow.unit.test.ts` extended with pathspec-capture (invariant e). CLI handler `cli.ts:162` migrated to scoped read |
| Cycle 1.3 — workflow-level system-state describing surface + narrowing + canonical rename + scaffolding-test retirement | Reshaped post-metacognition; ready to execute | Metacognition pass (Starlit Beaming Aurora, 2026-05-22) surfaced that the inherited three-cycle decomposition produced implementation-coupled scaffolding tests at the read seam; one system state ("commit-queue commit honours intent.files scope across peer staging drift") takes one describing surface (`commit-workflow.unit.test.ts`); Cycle 1.3 lands seven workflow-level invariants (a)–(g) via capture-list, narrows all three load-bearing types to `readonly [string, ...string[]]`, narrows once at `runCommitWorkflow` entry, renames to canonical, and deletes the two scaffolding test files |
| Phase Final — SKILL update + `pnpm check` aggregate + consolidation | Pending |  |

## Reviewer Dispatch Log

| Phase | Reviewer | Verdict | Evidence |
|---|---|---|---|
| Pre-Cycle-1.1 | `assumptions-expert` | GO-WITH-AMENDMENTS (4 absorbed) | Plan body §Cycle 1.1 amended pre-staging |
| Pre-Cycle-1.1 | `code-expert` gateway | GO-WITH-AMENDMENTS (4 absorbed) | Plan body §Cycle 1.1/1.2 amended pre-staging |
| Post-Cycle-1.1 | `test-expert` | GO-WITH-AMENDMENTS | §Phase 0 Task 0.3 + `e242e633` fixture rename |
| Post-Cycle-1.1 | `type-expert` | GO | §Phase 0 Task 0.3 |
| Post-Cycle-1.1 | `code-expert` gateway | GO-WITH-AMENDMENTS | §Phase 0 Task 0.3 |
| Pre-Cycle-1.2 | `architecture-expert-betty` | **VERDICT: Shape A** | Widen dep type; `repoRoot` in runtime closure; full reasoning + concrete code changes in §Cycle 1.2 Pre-Execution Absorption |
| Pre-Cycle-1.2 | `assumptions-expert` | **PROPORTIONAL with 2 pin-downs** | Empty-`intent.files` + overlapping-scope degenerate cases absorbed into §Cycle 1.2 Pre-Execution Absorption |
| Pre-Cycle-1.2 | `code-expert` gateway | **APPROVED WITH CONDITIONS** | `cli.ts:162` migration explicit + `verifyStagedBundle` vs `verifyScopedStagedBundle` split clarified + spy capture on workflow regression-guard + delegate to `verifyFingerprint` to stay under complexity-8 |
| Pre-Cycle-1.2 | `test-expert` (focused) | **IMPROVEMENTS ABSORBED** | Three describe blocks (verify invariants + boundary + workflow dep wiring); audit-shape risk on verbatim-reason tests resolved by contract-level naming; pathspec captured-calls pattern (not vi.spyOn) on workflow regression-guard |
| Pre-Cycle-1.2 | `type-expert` (focused) | **AT-RISK RESOLVED** | Inline `{ readonly pathspec: readonly string[] }` at dep interface (no `ScopedStagedBundleInput` import in workflow); **must-fix**: explicit construction (no spread) in runtime binding — absorbed. NEW `verifyScopedStagedBundle` deemed unnecessary; both reviewers' specs collapse to "existing `verifyStagedBundle` handles scoped data unchanged" |
| In-Cycle-1.2 | TDD + atomic landing | ✓ | 476/476 tests; lint + type-check clean |
| Post-Cycle-1.2 | Reviewer absorption | Folded into Cycle 1.3 plan-improvement pass | Owner halted execution to improve the plan before Cycle 1.3 authoring; outstanding reviewer work is now represented by the pending Pre-Cycle-1.3 `type-expert` + `assumptions-expert` rows below |
| Pre-Cycle-1.3 | `code-expert` gateway | **APPROVED WITH CONDITIONS** | Shape A widen `runGitCommit` to `(input: { readonly pathspec: readonly string[] }) => Promise<…>`; thread `intent` through `runCommitAndComplete`; canonical rename ripple into two existing scope test files must land in the same refactor slice or be split if it grows; zero external consumers — full reasoning in §Cycle 1.3 Pre-Execution Absorption |
| Pre-Cycle-1.3 | `test-expert` (focused) | **CRITICAL VIOLATIONS → Path B absorbed** | Proposed `*.integration.test.ts` failed immediate-fail rule 8 (subprocess) + classification mismatch + husky-hook-recursion risk. Resolution: drop integration test entirely; widen dep so pathspec passes through seam; unit-test via capture-list pattern (mirror Cycle 1.2's `stagedBundlePathspecs`). End-to-end git behaviour is git's contract, not ours to re-test |
| Pre-Cycle-1.3 | `type-expert` (focused) | **VERDICTS** | (1) Canonical name = `GetStagedBundleInput` (mirrors function; specificity earns "get" verb). (2) Non-empty pathspec enforcement = BOTH: narrow `pathspec` to `readonly [string, ...string[]]` on `GetStagedBundleInput` and on `CommitWorkflowDependencies.getStagedBundle` dep type; keep runtime guard at `runCommitAndComplete` as the narrowing site (`intent.files.length > 0` check). Do NOT change `CommitIntent.files` (JSON-parsed registry data IS `string[]`; non-empty is a workflow precondition, not a schema invariant). Existing `commit-queue-verify-staged-scope.unit.test.ts` boundary-on-empty-pathspec test is **superseded** by Cycle 1.3 Invariant 2 and must be removed in this cycle |
| Pre-Cycle-1.3 | `assumptions-expert` | **VERDICTS** | (1) Cycle proportionality = PROPORTIONAL (do NOT split A+B into 1.4; A pathspec-threading + B empty-guard are two halves of one contract — landing A alone reintroduces the failure mode in the `files: []` degenerate case; the plan's existing AC #8 split axis behaviour-vs-rename is the correct one). (2) Rename ripple = BOUNDED (zero external callers verified by grep; `index.ts` does NOT re-export `getStagedBundleScoped`/`ScopedStagedBundleInput`). Nit: file-scope bullets understate per-test-file work — actual ≈8 occurrences per test file (import + call sites + describe title), not just import lines |
| Pre-Cycle-1.3 | metacognition reshape (Starlit Beaming Aurora) | **RESHAPE** | The inherited three-cycle decomposition produced implementation-coupled scaffolding tests at the read seam (`fakeRunGitFor` re-implements git argv parsing; tests assert argv-assembly strings, not system state). One system state ("commit-queue commit honours intent.files scope across peer staging drift") takes one describing surface (`commit-workflow.unit.test.ts`). Cycle 1.3 reshape: seven workflow-level invariants (a)–(g) via capture-list; narrowing at ALL three load-bearing types; single narrowing site at `runCommitWorkflow` entry; canonical rename; delete the two scaffolding test files; no new `commit-queue-commit-pathspec.unit.test.ts`. Prior Pre-Cycle-1.3 reviewer verdicts (Path B; canonical name `GetStagedBundleInput`; non-empty enforcement) remain valid; the reshape extends the surface inwards (one file not three) and outwards (retire scaffolding) |
| In-Cycle-1.3 | TDD + atomic landing | Pending |  |
| Post-arc | `docs-adr-expert` + `release-readiness-expert` | Pending | Phase Final |

---

## Context

### Issue: Queue ceremony silently overrides intent scope

The commit-queue intent record carries a `files: readonly string[]` field set at `enqueue` time — the files the intent claims to commit. Three downstream subcommands (`record-staged`, `verify-staged`, `commit`) compute their fingerprints and execute their inner `git commit` over the **entire staged index**, not the intent's `files` scope. In single-writer scenarios this works accidentally because the staged index equals the intent's scope. In multi-writer scenarios — which the queue + claim + comms ceremony explicitly exists to support — the operations silently sweep peer work.

**Evidence (three instances, same 2-hour window 2026-05-22)**:

1. **Instance A (ff2 / Mistbound, 14:04Z)**: surfaced during ff2 owner-decision recording. Mistbound staged 2 plan files (`.agent/plans/graph-mvp-arc.plan.md` + `.agent/plans/sector-engagement/eef/current/eef-first-feature.plan.md`); Shaded had concurrently staged 6 files (3 graph-* eslint configs + 3 collab-state files) for Cycle 9.2 rewire. The current `verifyStagedBundle` would actually have BLOCKED Mistbound's commit at the `stagedFileMismatch` check (returning `extra: <Shaded's 6 files>`) rather than silently committing everything — the framing "would have committed everything staged" in the original write-up overstates the symptom. The deeper issue is that `recordStagedBundle` would have fingerprinted the peer-polluted index content, leaving Mistbound with a baseline that could not match any subsequent re-stage attempt either. The current resolution requires bypassing the queue ceremony via manual `git commit -- <pathspecs>`, which breaks the audit-trail invariant the queue exists to enforce. See comms event `e48d7f16` and the corresponding entry in `.agent/state/collaboration/shared-comms-log.md` (markdown anchor, persistent regardless of comms-event retention) from the same window.

2. **Instance B (distilled.md graduation / Wooded, 14:54Z)**: while this very plan was being grounded, Wooded ran `commit-queue commit` with intent `692c57a7` scoped to a single file (`.agent/memory/active/distilled.md`). The primitive's `record-staged` step fingerprinted the FULL git index rather than the intersection of (`intent.files`, currently-staged). Result: commit `2389ff5e` absorbed Shaded's Cycle 10 source edits to `agent-tools/src/bin/commit-queue.ts` + `agent-tools/src/bin/collaboration-state.ts` (`.then/.catch` → `try/await` conversion) under Wooded's `docs(distilled): …` commit subject. Substance preserved in HEAD; audit trail misattributed. Self-corrected via directed-comms apology + broadcast; substance redress requires the operative fix this plan lands. See comms event `2389ff5e`-broadcast (Wooded) and Stormbound's Shaded-directed event `31641f82` + the corresponding `shared-comms-log.md` window for the full narrative.

3. **Instance C (t12 citation-shape peer-handoff / Stormbound, 15:35Z to 16:13Z)**: while Cycle 1.2 of this very plan was being absorbed and Cycle 1.3 was being scoped, Mistbound handed off their staged t12 work for me to land on owner-directed handoff. Three files staged; my `commit-queue verify-staged` ceremony invoked the (then still unscoped) `verifyStagedBundle` and was rejected with 66 extra files because peer Shaded had concurrently staged their Cycle 11 jc-→oak- rename in the shared index between my queue-enqueue and verify-staged steps. The unscoped read couldn't distinguish "my 3 files plus Shaded's 66 unrelated files" from "wrong staged set". Resolved out-of-cycle via Path-B explicit-pathspec commit (`0b7289e9`) — precisely the structural cure Cycle 1.3 codifies for the queue's own inner `git commit`. This is the third worked example AND the live-production proof that Cycle 1.1's `record-staged` scoping (then-recently-landed) was insufficient on its own without Cycles 1.2 + 1.3 to complete the chain. Cycle 1.2 (verify-staged scope) subsequently landed at `6b5c9b4e`; Cycle 1.3 remains pending. See `0b7289e9` commit metadata + the `shared-comms-log.md` t12 handoff/closeout sequence.

**Root cause**: The `files` field on the intent record is treated as advisory metadata rather than operative scope. The data model is correct (intent declares its file scope); the operations don't honour the declaration. This is a Replace-Don't-Bridge case: the implicit "operate over the whole staged index" assumption is the bug; the explicit "operate over `intent.files`" is the replacement.

**Existing capabilities**:

- The intent record schema (`agent-tools/src/commit-queue/types.ts`) already declares `files: readonly string[]`.
- The fingerprint helper `createStagedBundleFingerprint` lives in `agent-tools/src/commit-queue/core.ts` and consumes a `nameStatus` string from the staged-read seam. Phase 0 found that seam as an unscoped staged-bundle helper; Cycles 1.1 + 1.2 migrated record/verify callers to `getStagedBundleScoped`, and the live pre-Cycle-1.3 surface now has only the scoped staged-read helper awaiting canonical rename.
- The inner `git commit` runs via an injected `runGitCommit` dependency declared in `commit-workflow.ts:48` and wired in `commit-workflow-runtime.ts`. Single injection point; no scope plumbing through callers.
- The prior Wooded Path-B precedent (Lane B Tranche 2 session, 2026-05-22 earlier) demonstrated `git commit -- <pathspecs>` works correctly for the multi-writer case but had to bypass the queue ceremony. This plan codifies that pattern as queue-native.

---

## Quality Gate Strategy

See [`../../templates/components/quality-gates.md`](../../templates/components/quality-gates.md) for canonical gate doctrine.

### After Each Cycle

```bash
pnpm --filter @oaknational/agent-tools test
# Expected: exit 0, new tests pass

pnpm type-check
pnpm lint
pnpm test
```

### Final Aggregate Gate

```bash
pnpm check
```

---

## Solution Architecture

### Principle

From `principles.md`:

> "Replace, don't wrap. If a behavior is wrong, fix it; don't add a compatibility flag."

From the project memory (graduated owner doctrine):

> "Full-tree pre-commit gating is INTENTIONAL and CORRECT. Multi-writer coordination is solved by queue + claim + comms, never by narrowing gate scope."

This plan honours both: the full-tree husky gate runs unchanged on every commit (gate scope is unchanged); only the inner `git commit`'s pathspec narrows to the intent's declared scope (commit content scope tightens to match the already-declared intent scope).

### Key Insight

The data model is already correct. `intent.files` declares the operative scope of the commit. The three affected subcommands ignore that declaration and use "the whole staged index" as the implicit scope. That implicit scope is the bug.

Could it be simpler? **Yes**: no new flag, no schema change, no new field. Three call sites adopt the existing `intent.files` field as the operative scope; the staged-read seam becomes scoped before fingerprinting or verification; one runtime injection narrows its `git commit` invocation.

### Strategy

One scoped staged-read seam + three call-site updates + one runtime injection update. Three TDD cycles, each landing test + product code together. No CLI surface change for users; internal semantic tightening only.

**Non-Goals** (YAGNI):

- ❌ New `--pathspec` CLI flag on `commit-queue commit` (the intent's `files` field IS the pathspec; no flag needed).
- ❌ Per-writer git worktree isolation (collides with the full-tree-gating owner doctrine; rewrites the claim model needlessly).
- ❌ Stash-and-restore around the inner `git commit` (bridge, not replacement; introduces conflict-on-restore failure modes).
- ❌ Detect-staged-content-outside-intent-scope abort (forces serialization theatre rather than enabling concurrent commits).
- ❌ New schema field on the intent record for "pathspec scope". The existing `files` field IS the scope.
- ❌ ADR. The architectural decision (queue + claim + comms; intent records scope via `files`) was already made; this codifies it in the operations. No new pattern, no new boundary.
- ✅ Make `intent.files` load-bearing for `record-staged`, `verify-staged`/`verify-staged-again`, and `commit`.

---

## Reviewer Scheduling (phase-aligned)

- **Pre-execution**: `assumptions-expert` (plan-readiness check on the "no new schema field; no new flag" framing); `code-expert` gateway brief on Phase 0 plus cycle scope.
- **During**: `test-expert` (state-describing unit tests and capture-list seam tests; no real `git commit` integration test); `type-expert` (staged-read and runtime dependency signature ripple); `code-expert` per-cycle absorption.
- **Post**: `docs-adr-expert` (SKILL-CANONICAL jc-commit cross-reference; ADR-non-need attestation); `release-readiness-expert` on the aggregate change.

Scheduling all reviewers at close is phase-misalignment. The pre-execution `assumptions-expert` pass is load-bearing: it must validate that no new flag / no new field is genuinely the right shape before Cycle 1 staging begins.

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md` — Replace-Don't-Bridge; Cardinal Rule.
2. **Re-read** `.agent/directives/testing-strategy.md` — atomic-landing invariant; tests-describe-state-not-implementation.
3. **Re-read** `.agent/directives/schema-first-execution.md` — schema as operative scope, not advisory metadata.
4. **Ask**: "Does this deliver system-level value (queue ceremony becomes sound for the multi-writer scenario it was designed for), not just fix the immediate ff2 case?"
5. **Verify**: No new field, no new flag, no `--no-verify`, no scope-narrowing of the husky full-tree gate.

---

## Lifecycle Trigger Commitment

Before the first non-planning edit:

1. Work shape: **bounded simple plan**. Three TDD cycles + a hardening phase. Single agent can pick up + complete in one or two sessions.
2. Start-right + claims consultation: open a peer-level claim covering the agent-tools commit-queue source surface (`agent-tools/src/commit-queue/**` + flat-named `agent-tools/tests/commit-queue*.test.ts` + flat-named `agent-tools/tests/commit-workflow*.test.ts`). Cross-check `.agent/state/collaboration/active-claims.json` for conflicts.
3. Active-area registration before edits; claim close at session handoff.
4. Apply [`../../templates/components/lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md) — multi-file fix touching a shared substrate.

---

## Documentation Propagation Commitment

Before marking the final phase complete:

1. Update `.agent/skills/commit/SKILL-CANONICAL.md` if the multi-writer flow changes (it should: no Path-B bypass needed any more; queue ceremony is now intent-scoped).
2. Cross-reference this plan from the ff2-coordination comms event (`e48d7f16`) by appending a closeout broadcast that points forward to this plan's landing.
3. No ADR update needed. Record explicit no-change rationale in the consolidation pass: "Architectural decision (queue + claim + comms; intent records scope via `files`) was already made; this plan codifies operative discipline, no new pattern."
4. Update `.agent/practice-core/practice.md` only if a load-bearing practice principle emerges from the work (probably not — the principle "intent scope is load-bearing" is already implicit in the queue design; this plan just makes it operative).
5. Apply `/jc-consolidate-docs` after the final cycle lands.

---

## Resolution Plan

### Phase 0: Verify Foundation Assumptions

**Foundation Check-In**: Re-read `.agent/directives/principles.md` §"Replace, don't wrap"; re-read this plan's §"Solution Architecture" §Key Insight.

**Key Principle**: The intent record's `files` field is the operative scope. Confirm this before any code change.

#### Task 0.1: Confirm code structure matches the metacognition findings

**Current Assumption** (from the metacognition pass):

- `agent-tools/src/commit-queue/types.ts` declares `files: readonly string[]` on the intent record.
- `agent-tools/src/commit-queue/git.ts:13` calls `git diff --cached --name-status` with no pathspec.
- `agent-tools/src/commit-queue/core.ts` houses `createStagedBundleFingerprint` and consumes the unscoped `nameStatus` string.
- `agent-tools/src/commit-queue/commit-workflow.ts:48` declares `runGitCommit` as an injected dep.
- `agent-tools/src/commit-queue/commit-workflow-runtime.ts` is the single mutation point for the actual `git commit` invocation.
- No other queue subcommand (`enqueue`, `phase`, `guard`, `complete`, `status`, `list`, `show`) reads or writes the staged-bundle fingerprint.

**Validation Required**: Confirm each item above by direct inspection of the named files.

**Acceptance Criteria**:

1. ✅ All six structural claims above verified by file inspection.
2. ✅ Search for any other call site of `createStagedBundleFingerprint` or `getStagedBundle` outside the three named subcommands returns nothing.
3. ✅ Search for any other invocation of `git commit` (or `runGit(... 'commit' ...)` shape) inside the commit-queue source returns only the runtime injection.
4. ✅ The intent record schema confirms `files` is a typed `readonly string[]`, not advisory metadata.

**Deterministic Validation**:

```bash
# 1. Intent record schema
grep -n "files:" agent-tools/src/commit-queue/types.ts
# Expected: at least one row showing `files: readonly string[]` or equivalent

# 2. Single unscoped staged-bundle read
grep -rn "git diff --cached" agent-tools/src/commit-queue/
# Expected: exactly the three lines in git.ts (name-only, name-status, full-index --binary)

# 3. Fingerprint helper call sites
grep -rn "createStagedBundleFingerprint\b" agent-tools/src/commit-queue/
# Expected: defined in core.ts; called from at most three sites (record-staged, verify-staged, verify-staged-again)

# 4. Inner git commit injection point
grep -rn "runGitCommit\|'commit'" agent-tools/src/commit-queue/
# Expected: declared in commit-workflow.ts; wired in commit-workflow-runtime.ts; no other call sites
```

**If Assumptions Differ**:

1. **STOP** — do not proceed to Cycle 1.
2. Document the divergence in this plan body under §Phase 0 Findings.
3. Update the cycle scopes if the surface is wider than expected (e.g., additional call sites of the fingerprint helper).
4. Re-run Phase 0 validation after the surface map is corrected.

**Task Complete When**: All four acceptance criteria checked AND deterministic validation matches expectations.

**Foundation Alignment**: This validates that the existing data model already declares the scope; the operations just don't honour it. If the data model were silent on scope, this plan would need a different shape.

#### Task 0.2: Phase 0 findings (recorded 2026-05-22 ~15:00Z by Stormbound Kiting Squall, claude/ddbea2)

All four acceptance criteria are satisfied:

1. **`intent.files` schema confirmed**: `agent-tools/src/commit-queue/types.ts:39-52` — `CommitIntent` declares `readonly files: readonly string[]`. Typed, mandatory, not optional metadata.
2. **Single unscoped staged-read site**: `agent-tools/src/commit-queue/git.ts:10-17` is the only definition; `git diff --cached --name-only|--name-status|--full-index --binary` invoked with no pathspec. Three callers via grep:
   - `commit-queue/cli.ts:132` (`runRecordStagedCommand`)
   - `commit-queue/cli.ts:157` (`runVerifyStagedCommand`)
   - `commit-queue/commit-workflow-runtime.ts:54` (wiring the `getStagedBundle` injected dep)
3. **`createStagedBundleFingerprint` call sites**: defined at `core.ts:17`; called at `core.ts:142` (`recordStagedBundle`) and `core.ts:189` (`verifyFingerprint` via `verifyStagedBundle`). Also used in the **test file** `agent-tools/tests/commit-workflow.unit.test.ts:35` to construct a fixture fingerprint — this becomes a regression-guard surface for all three cycles.
4. **`runGitCommit` injection point**: `agent-tools/src/commit-queue/commit-workflow.ts:48` declares the injected dep; `commit-workflow-runtime.ts:81-95` is the single runtime implementation — spawns `git commit -F <message-file>` with NO pathspec. Single mutation point per the plan.

**Additional finding** (not in the original Phase 0 acceptance criteria but surfaced by the pre-execution `code-expert` gateway):

- `agent-tools/src/commit-queue/index.ts` re-exports `createStagedBundleFingerprint` and `verifyStagedBundle` as part of the public `@oaknational/agent-tools` package surface. The staged-read helper is NOT re-exported (internal helper). The cycle-amendment landing strategy preserved the original unscoped staged-read helper through Cycles 1.1–1.2 so the public API did not change shape mid-arc; **revised post-Cycle-1.2**: the live code now has only `getStagedBundleScoped`, and Cycle 1.3 is the canonical rename to `getStagedBundle` plus possible `ScopedStagedBundleInput` rename. `createStagedBundleFingerprint` and `verifyStagedBundle` were NEVER duplicated — Cycles 1.1 and 1.2 reused them on already-scoped data. The two public re-exports of `createStagedBundleFingerprint` + `verifyStagedBundle` survive Cycle 1.3 unchanged.

**Additional live evidence** (surfaced during this Phase 0 window — Instance B from §Context): the `2389ff5e` commit at 14:54Z is a fresh concrete instance of the failure mode this plan cures. Increases confidence that the cure shape is correctly framed.

**Phase 0 verdict**: GO. Proceed to Cycle 1.1.

#### Task 0.3: Cycle 1.1 post-delivery reviewer absorption (recorded 2026-05-22 ~15:18Z by Stormbound Kiting Squall, claude/ddbea2)

Cycle 1.1 landed at `fb0833a4`. Three reviewers dispatched in parallel post-delivery:

- **test-expert**: GO-WITH-AMENDMENTS. All four tests describe system state correctly; atomic-landing invariant honoured; fake-runGit fixture is state-describing not implementation-tracking; coverage of the scope invariant is complete. Improvements absorbed in the follow-up commit: `emptyRegistry → registryWithIntentA` fixture rename. **Forward brief for Cycle 1.3 (refined post-Cycle-1.2)**: the originally planned `*.integration.test.ts` is dropped per Cycle 1.3 Pre-Execution Absorption (Path B — widen the dep so unit-test capture-list pattern suffices; subprocess + filesystem IO classification mismatch + husky-hook-recursion risk all avoided structurally). The original forward-brief concern (integration test must not reach past product seam for git setup, `test-immediate-fails.md §1`) is moot under Path B because there is no integration test.
- **type-expert**: GO. No `as`/`any`/`unknown`/`@ts-expect-error`/`!` introduced. `ScopedStagedBundleInput` signature is correctly tightened (`pathspec: readonly string[]` required; `runGit?` optional injection seam). Type flow from `CommitIntent.files` (`readonly string[]`) → `pathspec` is direct with no widening. **Resolved post-Cycle-1.2**: `runVerifyStagedCommand` migrated to scoped read at `6b5c9b4e`; the previously flagged dangling-consumer risk for Cycle 1.3's retirement is now closed. The remaining Cycle 1.3 work is the runtime `runGitCommit` pathspec mutation plus the scoped helper's canonical rename.
- **code-expert post-delivery gateway**: GO-WITH-AMENDMENTS. All four pre-execution amendments absorbed cleanly; all five Cycle 1.1 acceptance criteria satisfied. The one important finding (`index.ts` re-export missing) resolved via the Task 0.1 §index.ts decision above (internal-only through the multi-cycle window — documented choice, not a missed deliverable). Three Cycle 1.2 pre-execution concerns flagged:
  1. **`stagedFileMismatch` check at `core.ts:74`** — when Cycle 1.2 replaces the whole-index read with a scoped read, this check's "extra files" branch becomes semantically narrower (in-scope-but-not-in-intent files only); error message may need updating.
  2. **Injection seam in `commit-workflow.ts`** — Cycle 1.2 must decide whether `CommitWorkflowDependencies.getStagedBundle` is widened to accept scope, or the scoped helper is called directly inside the runtime wiring (bypassing the injection seam for the scoped path). `architecture-expert-betty` recommended for the pre-execution dispatch with focus on this boundary question.
  3. **`commit-workflow.unit.test.ts` fixture scope** — that file builds fixtures via `createStagedBundleFingerprint` (the unscoped helper). After Cycle 1.2, the verify path uses scoped fingerprints; fixtures may need updating to match.

The two minor amendments (fixture rename + plan-body internal-only clarification) land in a small follow-up commit alongside this Phase 0 absorption record. Cycle 1.2 implementer picks up with full reviewer evidence in hand.

---

### Phase 1: Intent-scope discipline

**Foundation Check-In**: Re-read `principles.md` §Cardinal Rule + §Replace-Don't-Bridge.

**Key Principle**: One fingerprint helper, scoped to intent.files; one runtime injection, scoped to intent.files. Three cycles each prove a separate concurrent-writer invariant.

#### Cycle 1.1: Fingerprint helper accepts pathspec scope; record-staged adopts it

**Parallel-safety**: sequenced after `phase-0-foundation`.

**Starting state**: branch HEAD at dispatch; no working-tree changes from prior cycles.

**File scope** (corrected from Phase 0 inspection; the `record-staged` mutation point is in `cli.ts`, not `registry.ts`):

- `agent-tools/src/commit-queue/core.ts` (add intent-scoped variant of `createStagedBundleFingerprint`; mandatory `pathspec` parameter, no optional/default-to-whole-index overload)
- `agent-tools/src/commit-queue/git.ts` (add intent-scoped variant of `getStagedBundle`; mandatory `pathspec` parameter; also inject a `runGit` callback for unit testability per the pre-execution `assumptions-expert` direction)
- `agent-tools/src/commit-queue/cli.ts` (`runRecordStagedCommand` at lines 130–143: read `intent.files` from the registry before calling the scoped helpers; pass `intent.files` as pathspec)
- `agent-tools/src/commit-queue/index.ts` — **DECISION (post-Cycle-1.1)**: scoped helpers (`getStagedBundleScoped`, `ScopedStagedBundleInput`) remain INTERNAL-ONLY through the multi-cycle window; they are NOT re-exported from the public package surface during Cycles 1.1 + 1.2. Callers inside `agent-tools/src/commit-queue/**` import via the internal module path. **Revised post-Cycle-1.2**: all staged-read callers have migrated to `getStagedBundleScoped`; Cycle 1.3 renames that scoped helper to the canonical `getStagedBundle` shape — at that point the public package surface ends cleanly, with no transient name bloat ever appearing in published artefacts. Rationale: the staged-read helper was never re-exported; the Phase 0 finding that `createStagedBundleFingerprint` + `verifyStagedBundle` ARE re-exported is preserved unchanged.
- `agent-tools/tests/commit-queue-record-staged-scope.unit.test.ts` (NEW; two-writer scenario; flat-named sibling per repo convention)

**Current Implementation** (load-bearing line in `git.ts`):

```typescript
stagedNameStatus: runGit(repoRoot, ['diff', '--cached', '--name-status']),
```

**Target Implementation** (corrected per pre-execution `assumptions-expert` + `code-expert` direction: no optional/whole-index overload — mandatory `pathspec` on a NEW scoped function; existing unscoped helpers retained unchanged during the multi-cycle landing window and retired in Cycle 1.3):

```typescript
// NEW scoped variant — mandatory pathspec; injected runGit for unit testability:
export interface ScopedStagedBundleInput {
  readonly repoRoot: string;
  readonly pathspec: readonly string[];
  readonly runGit?: (args: readonly string[]) => string;
}

export function getStagedBundleScoped(input: ScopedStagedBundleInput): StagedBundle {
  /* runGit defaults to the existing execFileSync invocation; args end with `--`, ...pathspec */
}

// NOTE (post-landing): `createScopedStagedBundleFingerprint` was originally
// planned as a parallel-scoped variant, but Cycle 1.1 landed reusing the
// existing `createStagedBundleFingerprint({nameStatus, patch})` unchanged —
// the scope enforcement is entirely upstream at the `getStagedBundleScoped`
// read, so the fingerprint helper operates on already-scoped data without
// modification.
```

**Failing Test or Check** (`agent-tools/tests/commit-queue-record-staged-scope.unit.test.ts`):

State the system invariant: "two writers' record-staged fingerprints are independent of each other's staged content when each writer's intent.files is disjoint."

The test sets up a simulated staged-bundle state covering files X, Y, Z, W; constructs intent A with `files: [X, Y]` and intent B with `files: [Z, W]`; calls record-staged for A; mutates the staged-bundle state to add a change in Z; calls record-staged for A again; asserts the fingerprint is unchanged.

**Product Changes (landed shape — `fb0833a4` + `e242e633`)**:

- Add NEW `getStagedBundleScoped({repoRoot, pathspec, runGit?})` in `git.ts` with `pathspec` as a required parameter; the `runGit` injection point allows unit tests to feed literal index snapshots without spawning real git.
- Route `runRecordStagedCommand` (`cli.ts:130–148`) through `getStagedBundleScoped` using `intent.files` as `pathspec`.
- Existing `createStagedBundleFingerprint`, `verifyStagedBundle`, `recordStagedBundle` UNCHANGED — they accept already-scoped data through their existing parameter shapes; the scope discipline is enforced entirely upstream at the staged-read seam.
- `getStagedBundleScoped` + `ScopedStagedBundleInput` remain INTERNAL-ONLY through the multi-cycle window (NOT re-exported from `index.ts`). **Revised post-Cycle-1.2**: the unscoped staged-read helper is no longer live; Cycle 1.3 renames the scoped variant to canonical, so no transient name bloat appears in the public package surface.
- Existing unscoped staged-read behaviour was left unchanged for Cycle 1.1 only. The later non-adopted call sites migrated in Cycle 1.2, and Cycle 1.3 now only needs the runtime `runGitCommit` pathspec plus canonical helper rename. **No backward-compat optional parameter; no transient fallback in committed history.**
- (Originally planned `createScopedStagedBundleFingerprint` was dropped at implementation time — the existing helper accepts already-scoped data unchanged. See "NOTE (post-landing)" in the code-sketch above.)

**Acceptance Criteria**:

1. ✅ Two-writer record-staged invariant test passes (fingerprint stable under peer staging activity).
2. ✅ Single-writer existing behaviour preserved (existing `record-staged` test suite continues green).
3. ✅ Type-check passes; `getStagedBundle` and `createStagedBundleFingerprint` signatures remain backward-compatible.
4. ✅ No new `any` / `as` / `unknown` usage introduced.
5. ✅ One commit; tree green; atomic-landing invariant satisfied.

**Deterministic Validation**:

```bash
# 1. Target test green
pnpm --filter @oaknational/agent-tools test record-staged-scope
# Expected: exit 0, two-writer test passes

# 2. No regression in existing record-staged tests
pnpm --filter @oaknational/agent-tools test record-staged
# Expected: exit 0, all existing tests pass

# 3. Type-check + lint
pnpm type-check  # Expected: exit 0
pnpm lint        # Expected: exit 0
```

**Cycle Complete When**: All five acceptance criteria checked; one cohesive commit lands carrying test + product code; full-tree husky gate passes.

---

#### Cycle 1.2: verify-staged and verify-staged-again adopt scoped fingerprint

**Parallel-safety**: sequenced after Cycle 1.1.

**Starting state**: Cycle 1.1 landed; scoped fingerprint helper available.

**Pre-Execution Reviewer Absorption (architecture-expert-betty, 2026-05-22 post-`0b7289e9`)**:

- **Verdict: Shape A** — widen `CommitWorkflowDependencies.getStagedBundle` from `() => StagedBundle` to `(input: { pathspec: readonly string[] }) => StagedBundle` (the workflow only knows about `pathspec`; `repoRoot` is absorbed in the runtime closure). Shape B (direct scoped call bypassing the injection seam) is architecturally incoherent: the dependency interface would purport to be the complete external surface while having a hardwired channel outside it, the Cycle 1.3 rename would touch the pure orchestrator unnecessarily, and the workflow would acquire two distinct read-channels for staged state.
- **Concrete seam change** (`commit-workflow.ts` line 46): `readonly getStagedBundle: (input: { pathspec: readonly string[] }) => StagedBundle;`. Call site (`runVerifyStage` at line 144) becomes `staged: input.deps.getStagedBundle({ pathspec: intent.files })`.
- **Concrete runtime binding** (`commit-workflow-runtime.ts` line 54): `getStagedBundle: (scopeInput) => getStagedBundleScoped({ repoRoot: input.repoRoot, ...scopeInput })`. `repoRoot` stays closed-over in the runtime exactly as it is for every other side-effecting dep today.
- **`stagedFileMismatch` semantics (`core.ts:74`/166–179)**: needs **no change**. Under the scoped read, `extra` can no longer contain peer-owned files by construction; the existing error message remains accurate ("staged files do not exactly match intent files" now means "something within the intent's own scope was staged but not declared in intent.files" — a genuine integrity violation worth surfacing with that exact text). Confirm at execution time that `stagedNameOnly` entering `verifyStagedBundle` originates from the scoped read.
- **`commit-workflow.unit.test.ts` test double**: signature updates to accept `_input` parameter (genuinely unused — fake returns fixture-driven bundles in sequence, not pathspec-driven). This is correct separation of concerns: workflow orchestration is the test target, scoped-read correctness lives in the new `commit-queue-verify-staged-scope.unit.test.ts`. The `_` prefix is fine here because the fake contractually accepts the input but does not route through it (not a lint-suppression rename of a should-be-used symbol).
- **Cycle 1.3 rename cost under Shape A**: minimal — `commit-workflow-runtime.ts` updates one closure binding; `commit-workflow.ts` is untouched because the workflow goes through the injected slot.

**Live in-production reproduction of the failure mode (2026-05-22, captured during the peer-handoff at `0b7289e9`)**: while running my own `commit-queue verify-staged` ceremony to land Mistbound's t12 work, the unscoped `verify-staged` rejected with 66 extra files because peer Shaded had staged their Cycle 11 jc-→oak- rename in the shared index between my read at queue-enqueue time and verify-staged. The bug is reproducing in production with the exact shape this cycle cures. Resolved out-of-cycle via Path-B explicit-pathspec commit (precisely the structural cure Cycle 1.3 codifies for `git commit`); third worked example added to §Context. **Motivating evidence only — does not substitute for the synthetic invariant test below.** (Shaded's Cycle 11 itself landed at `ff825433` shortly after `0b7289e9`.)

**Pre-Execution Reviewer Absorption (assumptions-expert + code-expert gateway, 2026-05-22 post-betty)**:

- **Line refs verified at `0b7289e9` HEAD**: `commit-workflow.ts:20` (import `verifyStagedBundle` — unchanged under Shape A), `:46` (dep type — widens), `:99/:107/:137` (`runVerifyStage` chain), `:144` (call site — passes scope), `:191` (`verifyStagedBundle` call — receives already-scoped data from the dep, unchanged). `commit-workflow-runtime.ts:27` (imports `getStagedBundle` — flips to `getStagedBundleScoped`), `:39` (`repoRoot` in deps), `:54` (binding — closure absorbs `repoRoot`). `cli.ts:18` already imports both helpers (Cycle 1.1), `:134` already calls scoped (Cycle 1.1), `:151` `runVerifyStagedCommand` def, `:162` **unscoped call site to migrate** (this cycle's CLI mutation), `:199` `verifyStagedBundle` call inside `writeVerificationResult` (receives staged via parameter — unchanged).
- **Two migration sites, ZERO new core functions** (final landed shape — supersedes the original "ONE new function" plan): `cli.ts:162` migrates to `getStagedBundleScoped({ repoRoot: input.input.repoRoot, pathspec: intent.files })` matching the Cycle 1.1 record-staged pattern; the `staged:` argument feeds `verifyStagedBundle` at line 199 (unchanged). `commit-workflow.ts:144` migrates to `input.deps.getStagedBundle({ pathspec: intent.files })`; `verifyStagedAgainstIntent` keeps calling `verifyStagedBundle` (line 191) on pre-scoped data.
- **`verifyScopedStagedBundle` dropped at pre-authoring** (originally proposed by code-expert gateway #4 + type-expert finding 2; collapsed at pre-authoring because both reviewers' signatures were structurally identical to the existing `verifyStagedBundle`). The CLI handler and the workflow now both feed scoped data into the unchanged `verifyStagedBundle` — single function, two consumers, no new public surface. The `stagedFileMismatch` check at `core.ts:74` narrows naturally under the scoped input (cannot contain peer-owned files by construction) with no code change required.
- **`commit-workflow.unit.test.ts` regression-guard**: the fake dep at lines 126–185 updates signature to `(input) => fixture` (accepts the new pathspec input). Per code-expert #3, **one of the existing tests** captures `pathspec` on a spy and asserts the workflow passes `intent.files` through; remaining tests use `_input` parameter. Stronger than betty's pure-`_input` recommendation; absorbs the seam-change into the regression-guard rather than bypassing it.
- **Three additional invariant sub-cases** (per assumptions-expert #5):
  - (c) **Empty `intent.files`**: `getStagedBundleScoped({pathspec: []})` must NOT silently widen to whole-index (git argv assembly risk). Either reject at boundary OR deterministically return empty bundle. Test asserts the chosen behaviour explicitly. (Likely already-rejecting because Cycle 1.1's record-staged tests would have caught widening — confirm at execution time and pin in the new test file.)
  - (d) **Overlapping scope** (writer A `intent.files = [X, Y]`; writer B `intent.files = [Y, Z]`; B restages Y): A's verify-staged-again correctly trips with the verbatim "staged bundle fingerprint changed since it was recorded" reason. Symmetric and expected; pin to ensure no special-casing creeps in.
  - (e) **Origin-trace of `stagedNameOnly`** at execution time: when the test asserts that `verifyStagedBundle` (workflow path) operates on already-scoped data, the test must verify the path through the dep wiring — not just the surface result. Fail-loud if origin trace breaks.
- **Specialists required pre-authoring**: `test-expert` (focused — two-assertion shape correctness; no conditional branching into one it-block) + `type-expert` (focused — confirm Shape A widening introduces no `any`/widening in `commit-workflow-runtime.ts` closure binding). `code-expert` post-delivery only.
- **ESLint forward-trace**: reuse Cycle 1.1's fixture machinery (`fakeRunGitFor` + dispatch table + `inScopeFilesFor` + `shapeKeyFor`) verbatim — no new exposure to complexity-8 / `sonarjs/no-alphabetical-sort` / `missing-curly`. (The original concern about complexity in a new `verifyScopedStagedBundle` is moot under the pre-authoring simplification that dropped the new function.)

**File scope (post-landing — Cycle 1.2 landed at `6b5c9b4e`)**:

- `agent-tools/src/commit-queue/cli.ts` — `runVerifyStagedCommand` at line 162 migrated to `getStagedBundleScoped({ repoRoot: input.repoRoot, pathspec: intent.files })`; unused `getStagedBundle` import dropped.
- `agent-tools/src/commit-queue/commit-workflow.ts` — `CommitWorkflowDependencies.getStagedBundle` (line 46) widened to `(input: { readonly pathspec: readonly string[] }) => StagedBundle`; `runVerifyStage` (line 144) passes `{ pathspec: intent.files }`. `verifyStagedAgainstIntent` (line 187) keeps calling `verifyStagedBundle` (line 191) on now-pre-scoped data — unchanged.
- `agent-tools/src/commit-queue/commit-workflow-runtime.ts` — closure binding (line 54) flips to `getStagedBundleScoped` with explicit `{ repoRoot, pathspec: scopeInput.pathspec }` construction (no spread; type-expert).
- `agent-tools/src/commit-queue/core.ts` — UNCHANGED. `verifyStagedBundle`, `recordStagedBundle`, `createStagedBundleFingerprint`, private `verifyFingerprint`, and `stagedFileMismatch` all accept already-scoped data; the migration is purely on the read side.
- `agent-tools/tests/commit-queue-verify-staged-scope.unit.test.ts` (NEW; 4 tests covering invariants a/b/c/d).
- `agent-tools/tests/commit-workflow.unit.test.ts` — `FakeDepsCallLog` extended with `stagedBundlePathspecs` capture array; `getStagedBundle` fake-dep stub signature updated to `(scopeInput) => { stagedBundlePathspecs.push(scopeInput.pathspec); ... }`; one new `it` asserts both verify-staged sites pass `intent.files` through the seam (invariant e).

**Failing Test or Check (landed shape)**:

State the system invariant: "writer A's verify-staged returns ok=true when writer B restages files outside A's scope, AND returns ok=false when writer A's own scope drifts."

Four invariants asserted across `commit-queue-verify-staged-scope.unit.test.ts`:

- (a) record-staged for intent A; mutate index to add a change in a non-A file; verify-staged for A returns ok=true.
- (b) record-staged for intent A; mutate index to modify an A file; verify-staged for A returns ok=false with verbatim reason "staged bundle fingerprint changed since it was recorded".
- (c) empty `intent.files` (`pathspec: []`): `getStagedBundleScoped` returns an empty bundle (does NOT widen to whole-index).
- (d) overlapping scope (writer A `[X, Y]`; writer B `[Y, Z]`; B restages Y): A's verify-staged trips with the verbatim reason.

Plus invariant (e) in `commit-workflow.unit.test.ts`: workflow passes `intent.files` through the widened `getStagedBundle` dep on both `verify-staged-before` and `verify-staged-after`.

**Product Changes (landed shape)**:

- Widen `CommitWorkflowDependencies.getStagedBundle` dep type from `() => StagedBundle` to `(input: { readonly pathspec: readonly string[] }) => StagedBundle`.
- Migrate CLI `runVerifyStagedCommand` (cli.ts:162) to `getStagedBundleScoped` with `intent.files` as pathspec.
- Migrate workflow `runVerifyStage` (commit-workflow.ts:144) to pass `{ pathspec: intent.files }` to the dep.
- Flip runtime closure binding (commit-workflow-runtime.ts:54) to `getStagedBundleScoped` with explicit property construction (no spread).
- `verifyStagedBundle` + `recordStagedBundle` + `createStagedBundleFingerprint` + `stagedFileMismatch` UNCHANGED — they all accept scoped data through their existing parameter shape. No new core function required.

**Acceptance Criteria (landed shape — Cycle 1.2 at `6b5c9b4e`)**:

1. ✅ Writer-independence verify invariants pass across four sub-cases (peer drift ok=true; own drift ok=false with verbatim reason; overlapping-scope ok=false with verbatim reason; empty-pathspec returns empty bundle).
2. ✅ Workflow dep-wiring origin-trace asserted (invariant e): `intent.files` passes through the widened `getStagedBundle` dep on both `verify-staged-before` and `verify-staged-after`.
3. ✅ Existing verify-staged single-writer tests remain green.
4. ✅ The existing failure-reason string format unchanged.
5. ✅ One commit; tree green; atomic-landing satisfied (476/476 tests; type-check + lint clean).

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/agent-tools test verify-staged-scope
# Expected: exit 0, four invariants pass (a/b/c/d)

pnpm --filter @oaknational/agent-tools test commit-workflow
# Expected: exit 0, no regression after fake-dep signature update; invariant e passes

pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
```

**Cycle Complete When**: All five acceptance criteria checked; one cohesive commit lands.

---

#### Cycle 1.3: One workflow-level describing surface for the system state

**Parallel-safety**: sequenced after Cycle 1.2.

**Starting state**: Cycles 1.1 + 1.2 landed; the staged-bundle read seam consumes scoped pathspec end-to-end at record-staged + verify-staged-before + verify-staged-after. The inner `git commit` is still unscoped. The Cycle 1.1 + 1.2 test files (`commit-queue-record-staged-scope.unit.test.ts` and `commit-queue-verify-staged-scope.unit.test.ts`) describe the read seam, not the system state — they reimplement git argv parsing inside a fake mock (`fakeRunGitFor` + `shapeKeyFor` + `inScopeFilesFor`) and assert exact argv-derived strings; they are audit-shaped per [`testing-strategy.md`](../../../directives/testing-strategy.md) §Philosophy ("NEVER create complex mocks", "Test real behaviour, not implementation details", "Test to interfaces, not internals"). This cycle is the cycle where the system state finally gets described at the right layer.

**Reshape rationale (recorded 2026-05-22 ~21:00Z by Starlit Beaming Aurora, claude/1977cf)**:

The system state this plan promises is **one** state: "commit-queue commit honours intent.files scope across peer staging drift". TDD-as-design: one state takes one describing test surface, one cycle of test-and-product co-design. The inherited three-cycle decomposition (1.1 record-staged seam; 1.2 verify-staged seam; 1.3 commit seam) produced scaffolding tests at three internal seams; the system state was never described at the level where it lives — the workflow seam. Cycle 1.2 began the right shape with invariant (e) in `commit-workflow.unit.test.ts` using the capture-list pattern on injected deps; Cycle 1.3 completes that shape and retires the scaffolding.

Prior Pre-Cycle-1.3 reviewer verdicts (code-expert gateway Shape A widen `runGitCommit`; test-expert Path B drop integration test; type-expert canonical name `GetStagedBundleInput` and compile-time non-empty tuple narrowing; assumptions-expert proportional + bounded ripple) remain valid; the reshape extends the surface inwards (one describing file instead of two new ones) and outwards (delete two scaffolding files).

**Shape (one describing surface, one cycle of co-design)**:

- **Describing surface**: `commit-workflow.unit.test.ts`. All seven workflow-level invariants land here, observed at the injected-deps boundary via the capture-list pattern Cycle 1.2 introduced. One workflow, one file describing its behaviour.
- **No new test files**: the originally planned `commit-queue-commit-pathspec.unit.test.ts` is NOT created. Invariants (f) and (g) (pathspec-threading + empty guard) live in the same file as invariant (e) (existing pathspec-threading on `getStagedBundle`).
- **Scaffolding-test deletion**: `commit-queue-record-staged-scope.unit.test.ts` and `commit-queue-verify-staged-scope.unit.test.ts` are deleted in this cycle. The workflow-level invariants describe the system state at the level it is observable; the scaffolding tests describe the read-mechanism internals via a complex re-implementation of git argv handling in `fakeRunGitFor`.
- **Compile-time non-empty narrowing at all three load-bearing types**: `GetStagedBundleInput.pathspec` AND `CommitWorkflowDependencies.getStagedBundle` input pathspec AND `CommitWorkflowDependencies.runGitCommit` input pathspec all narrow to `readonly [string, ...string[]]`. Three sites, one type shape; the workflow dep types mirror the read-seam input type.
- **Single narrowing site at `runCommitWorkflow` entry**: immediately after `loadIntent` succeeds, validate `intent.files.length > 0`; on empty, return `{ ok: false, stage: 'git-commit', reason: <"empty …intent files…" string> }` without continuing. On non-empty, narrow `intent.files` to `readonly [string, ...string[]]` and pass the narrowed intent into both `runVerifyStage` and `runCommitAndComplete`. One bridge between the `readonly string[]` schema layer (`CommitIntent.files`) and the tuple-typed dep seam.
- **`runGitCommit` widens** to `(input: { readonly pathspec: readonly [string, ...string[]] }) => Promise<CommitWorkflowGitCommitResult>`. `runCommitAndComplete` receives the narrowed intent via its existing call chain and forwards `intent.files` as `pathspec` to the dep.
- **Runtime closure** in `commit-workflow-runtime.ts`: the `runGitCommit` binding receives `{ pathspec }` and appends `['--', ...pathspec]` to the existing spawn argv.
- **Canonical rename**: `getStagedBundleScoped` → `getStagedBundle`; `ScopedStagedBundleInput` → `GetStagedBundleInput` in `git.ts`. Import lines update in `cli.ts` and `commit-workflow-runtime.ts`.
- **No external callers**: zero. The rename is purely internal-to-package + the (now deleted) scaffolding tests' imports.

**File scope**:

- `agent-tools/src/commit-queue/commit-workflow.ts` — narrowing site at `runCommitWorkflow` entry (after `loadIntent`); `CommitWorkflowDependencies.getStagedBundle` input pathspec narrowed to non-empty tuple; `CommitWorkflowDependencies.runGitCommit` widens to receive `{ pathspec: readonly [string, ...string[]] }`; `runCommitAndComplete` threads `intent.files` into the dep call as `pathspec`; the verify-staged sites already pass `intent.files` (now compile-time-known non-empty).
- `agent-tools/src/commit-queue/commit-workflow-runtime.ts` — runtime `runGitCommit` closure receives `{ pathspec }` and forwards; spawn argv appends `['--', ...pathspec]`; import-line rename to canonical.
- `agent-tools/src/commit-queue/git.ts` — rename `getStagedBundleScoped` → `getStagedBundle`; rename `ScopedStagedBundleInput` → `GetStagedBundleInput`; narrow `GetStagedBundleInput.pathspec` from `readonly string[]` to `readonly [string, ...string[]]`.
- `agent-tools/src/commit-queue/cli.ts` — import-line rename to canonical.
- `agent-tools/tests/commit-workflow.unit.test.ts` — extend `FakeDepsCallLog` with `runGitCommitPathspecs: readonly (readonly string[])[]`; update `runGitCommit` fake-dep stub signature; add invariants (a), (b), (f), (g) as new `it` blocks (invariants (c), (d), (e) already exist from Cycle 1.2).
- `agent-tools/tests/commit-queue-record-staged-scope.unit.test.ts` — **DELETE**.
- `agent-tools/tests/commit-queue-verify-staged-scope.unit.test.ts` — **DELETE**.

**Current Implementation** (verified at HEAD `2adeccec`):

- `commit-workflow.ts:48`: `readonly runGitCommit: () => Promise<CommitWorkflowGitCommitResult>;` (zero-arg).
- `commit-workflow.ts:46`: `readonly getStagedBundle: (input: { readonly pathspec: readonly string[] }) => StagedBundle;` (input pathspec is `readonly string[]`, not yet narrowed).
- `commit-workflow.ts:159–163` `runCommitAndComplete`: calls `input.input.deps.runGitCommit()` with no arguments; `intent` is reachable in the caller chain but not threaded into this helper.
- `commit-workflow.ts:93–113` `runCommitWorkflow`: loads `intent` via `loadIntent`, then sequences `runVerifyStage` (before), advisory, phase transition, `runVerifyStage` (after), and `runCommitAndComplete`. No narrowing site exists at workflow entry.
- `commit-workflow-runtime.ts:54–55`: `getStagedBundle: (scopeInput) => getStagedBundleScoped({ repoRoot: input.repoRoot, pathspec: scopeInput.pathspec })`.
- `commit-workflow-runtime.ts:57`: `runGitCommit: () => runGitCommit(input)`; the real `runGitCommit` function builds spawn argv `['commit', '-F', input.messageFilePath]` with no pathspec.
- `git.ts:19–23`: `ScopedStagedBundleInput.pathspec: readonly string[]` (not yet narrowed).

**Target Implementation**:

- `git.ts`: rename to `getStagedBundle` + `GetStagedBundleInput`; `GetStagedBundleInput.pathspec: readonly [string, ...string[]]`.
- `commit-workflow.ts`: `CommitWorkflowDependencies.getStagedBundle` input pathspec narrows to `readonly [string, ...string[]]`. `CommitWorkflowDependencies.runGitCommit` widens to `(input: { readonly pathspec: readonly [string, ...string[]] }) => Promise<CommitWorkflowGitCommitResult>`.
- `commit-workflow.ts`: `runCommitWorkflow` narrows `intent.files` once immediately after `loadIntent`. On empty, returns `{ ok: false, stage: 'git-commit', reason }` without continuing. On non-empty, the narrowed intent propagates to both `runVerifyStage` and `runCommitAndComplete` through the existing call chain; both dep calls compile cleanly with the narrowed pathspec.
- `commit-workflow-runtime.ts`: `runGitCommit` closure receives `{ pathspec }` and forwards; the real `runGitCommit` function appends `['--', ...pathspec]` to spawn argv. Imports update to canonical names.
- `cli.ts`: imports update to canonical names.
- `commit-workflow.unit.test.ts`: `FakeDepsCallLog` extends with `runGitCommitPathspecs: readonly (readonly [string, ...string[]])[]`; the `runGitCommit` fake-dep stub signature updates to capture pathspec on call.
- Scaffolding test files deleted.

**Failing Tests (workflow-level invariants in `commit-workflow.unit.test.ts`)**:

The system state under test is **one** state: "commit-queue commit honours intent.files scope across peer staging drift". Seven invariants describe that state at the workflow seam.

- **(a) record-staged fingerprint stable under peer drift** — workflow invoked with intent A; the fake `getStagedBundle` captures the pathspec it received; the bundle returned by the fake is constructed deterministically from `intent.files` plus a peer-drift snapshot; the resulting fingerprint is identical to the fingerprint produced when the peer-drift snapshot changes. (Existing record-staged path exercised at workflow level.)
- **(b) record-staged fingerprint changes under own-scope drift** — symmetric to (a) but with the in-scope snapshot drifting; fingerprint must differ.
- **(c) verify-staged returns ok=true under peer drift** — already landed in Cycle 1.2; kept unchanged.
- **(d) verify-staged returns ok=false under own-scope drift with verbatim reason "staged bundle fingerprint changed since it was recorded"** — already landed in Cycle 1.2; kept unchanged.
- **(e) workflow passes `intent.files` through `getStagedBundle` dep on both verify-staged-before and verify-staged-after** — already landed in Cycle 1.2 via `stagedBundlePathspecs` capture; kept unchanged.
- **(f) workflow passes `intent.files` through `runGitCommit` dep as `pathspec`** — new. `runGitCommitPathspecs` capture-list asserts the workflow invokes `runGitCommit` exactly once per `runCommitWorkflow`, with `pathspec` equal to the loaded `intent.files` (now narrowed to non-empty tuple).
- **(g) workflow fails before invoking `runGitCommit` when `intent.files` is empty** — new. Registry intent with `files: []` causes `runCommitWorkflow` to return `{ ok: false, stage: 'git-commit', reason: <substring "empty" + one of "pathspec"/"files"/"intent"> }`; `runGitCommitPathspecs.length === 0`. Stage label is the existing `'git-commit'` failure stage (the failure is in the commit-spawning path); no widening of `CommitWorkflowFailureStage` union.

Invariants (a), (b), (f), (g) are NEW in Cycle 1.3. Invariants (c), (d), (e) already live in `commit-workflow.unit.test.ts` from Cycle 1.2.

**Product Changes**:

1. **Rename + narrow at the read seam** (`git.ts`): `getStagedBundleScoped` → `getStagedBundle`; `ScopedStagedBundleInput` → `GetStagedBundleInput`; `GetStagedBundleInput.pathspec: readonly [string, ...string[]]`.
2. **Narrow at the workflow dep seam** (`commit-workflow.ts`): `CommitWorkflowDependencies.getStagedBundle` input pathspec narrowed to `readonly [string, ...string[]]`; `CommitWorkflowDependencies.runGitCommit` widened to `(input: { readonly pathspec: readonly [string, ...string[]] }) => Promise<CommitWorkflowGitCommitResult>`.
3. **Single narrowing site at workflow entry** (`commit-workflow.ts` `runCommitWorkflow`): immediately after `loadIntent` succeeds, validate `intent.files.length > 0`. On empty, return `{ ok: false, stage: 'git-commit', reason: <"empty …intent files…" string> }`. On non-empty, narrow `intent.files` to `readonly [string, ...string[]]` and store on a `LoadedCommitIntent` shape (or equivalent) that the downstream helpers receive. The narrowed value flows into both `runVerifyStage` and `runCommitAndComplete` with no further runtime checks.
4. **Thread narrowed intent into `runCommitAndComplete`**: helper extends its param object with the narrowed intent and forwards `intent.files` as `pathspec` to the `runGitCommit` dep.
5. **Runtime binding** (`commit-workflow-runtime.ts`): `runGitCommit` closure receives `{ pathspec }`; real `runGitCommit` function appends `['--', ...pathspec]` to spawn argv. Import-line rename to canonical.
6. **CLI import-line rename** (`cli.ts`): canonical names.
7. **Extend `commit-workflow.unit.test.ts`**: `FakeDepsCallLog.runGitCommitPathspecs` capture; fake-dep stub signature update; add invariants (a), (b), (f), (g) as new `it` blocks.
8. **Delete scaffolding tests**: `commit-queue-record-staged-scope.unit.test.ts` and `commit-queue-verify-staged-scope.unit.test.ts`. The workflow-level invariants describe the state in full; the scaffolding tests describe the read mechanism via complex argv-parsing mocks.

**Acceptance Criteria**:

1. [ ] Invariant (a) green: record-staged fingerprint stable under peer drift via workflow-level capture.
2. [ ] Invariant (b) green: record-staged fingerprint changes under own-scope drift via workflow-level capture.
3. [ ] Invariant (f) green: `runGitCommitPathspecs` equals `[intent.files]` for the loaded intent.
4. [ ] Invariant (g) green: empty `intent.files` produces `{ ok: false, stage: 'git-commit', reason: "empty ..." }`; `runGitCommit` never invoked.
5. [ ] Invariants (c), (d), (e) remain green (from Cycle 1.2; signature update on `runGitCommit` fake-dep does not regress them).
6. [ ] Canonical rename complete: `getStagedBundleScoped` → `getStagedBundle`, `ScopedStagedBundleInput` → `GetStagedBundleInput`. No stale names in `git.ts`, `cli.ts`, or `commit-workflow-runtime.ts`. `index.ts` re-exports unchanged (the rename does not affect the public re-exports).
7. [ ] Non-empty pathspec invariant enforced at compile time on three load-bearing types (`GetStagedBundleInput`, `CommitWorkflowDependencies.getStagedBundle` input, `CommitWorkflowDependencies.runGitCommit` input) AND at runtime via single narrowing site at `runCommitWorkflow` entry.
8. [ ] `commit-queue-record-staged-scope.unit.test.ts` deleted. `commit-queue-verify-staged-scope.unit.test.ts` deleted. No new `commit-queue-commit-pathspec.unit.test.ts` created.
9. [ ] Cycle closeout broadcast posted via `comms send` naming Instances A, B, C and referencing persistent `shared-comms-log.md` markdown anchors.
10. [ ] One atomic commit; tree green; agent-tools filtered gates green; husky full-tree pre-commit gate green.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/agent-tools test commit-workflow
# Expected: exit 0, all seven invariants green

pnpm --filter @oaknational/agent-tools type-check
# Expected: exit 0, narrowed types satisfied without `as` / `any`

pnpm --filter @oaknational/agent-tools lint
# Expected: exit 0
```

**Cycle Complete When**: All ten acceptance criteria checked; one cohesive commit lands carrying test additions + product narrowing + canonical rename + scaffolding-test deletion; the system state is described in one place via simple capture-list invariants; the forward-trace broadcast exists before Phase Final begins.

---

### Phase Final: Hardening and consolidation

**Foundation Check-In**: Re-read all three foundation documents; verify Replace-Don't-Bridge applied (no new flag, no compatibility wrapper, no widened gate scope).

#### Task Final.1: SKILL-CANONICAL update

Update `.agent/skills/commit/SKILL-CANONICAL.md` to record that the queue ceremony is now intent-scoped; no Path-B bypass needed for multi-writer scenarios. The four-move protocol (open claim → stage → commit-queue commit → close claim) now genuinely supports concurrent multi-writer commits when each writer's intent.files is disjoint.

Include a one-line semantic-narrowing note: after this arc lands, `verifyStagedBundle`'s `stagedFileMismatch` "extra files" error means staged files declared inside `intent.files` that the recorded bundle did not contain — it no longer means peer-class drift, because peer-staged files outside the intent's scope are invisible to the scoped read by construction. The error text is unchanged; only its semantic scope narrows. A reader of the SKILL who hits the error after the arc lands needs this nuance to interpret it correctly.

**Acceptance Criteria**:

1. [ ] SKILL-CANONICAL text updated; no Path-B bypass language remains as a default.
2. [ ] Path-B retained as a documented fallback for emergency cases only (e.g., manual recovery if the queue is corrupted).
3. [ ] Cross-reference to this plan added in the SKILL's references section.
4. [ ] Semantic-narrowing note on `stagedFileMismatch` "extra files" added (one line, near the queue-ceremony explanation).

#### Task Final.2: Comms forward-trace verification

Verify the Cycle 1.3 closeout broadcast points forward to this plan's landing as the structural resolution of the gap surfaced in **three** instances captured in §Context:

- **Instance A**: `e48d7f16` ff2 case (Mistbound) — original motivation.
- **Instance B**: `2389ff5e` / Wooded's `692c57a7` intent + Stormbound's `31641f82` directed event — second worked example surfaced during Phase 0.
- **Instance C**: `0b7289e9` — t12 citation-shape peer-handoff during Cycle 1.3 pre-execution. Live reproduction of the unscoped `verify-staged` failure mode in production: peer (Shaded) staged 66 files for Cycle 11 jc-→oak- rename in the shared index between my queue-enqueue and verify-staged, rejecting my ceremony with the unscoped diff. Resolved out-of-cycle via Path-B explicit-pathspec commit (precisely the structural cure Cycle 1.3 codifies for the queue's own inner `git commit`).

**Target the persistent markdown anchors in `.agent/state/collaboration/shared-comms-log.md`** rather than the comms-event UUIDs directly — comms events have a retention window (commit `1b619457` drained 990 stale events earlier this same session), and the forward-trace must survive that. The closeout broadcast belongs **at the end of Cycle 1.3** (not deferred to Phase Final) so it lands while the anchor events are still recent and findable in the live comms stream.

**Acceptance Criteria**:

1. [ ] Closeout broadcast exists via `comms send` referencing the relevant shared-comms-log markdown anchors and this plan's path.
2. [ ] Broadcast timestamp confirms it was posted at end of Cycle 1.3 (not Phase Final).
3. [ ] All three live instances (A, B, C) named in the closeout body.

#### Task Final.3: Aggregate gate + consolidation

```bash
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools test

pnpm check
# Expected: exit 0 from root aggregate gate after agent-tools filtered gates pass

# Stability check
for i in {1..5}; do
  echo "Run $i/5"
  pnpm --filter @oaknational/agent-tools test || break
done
# Expected: 5/5 passes
```

Run `/jc-consolidate-docs` for the standard graduation + napkin-rotation pass.

#### Task Final.4: Foundation Document Compliance Checklist

- [ ] **principles.md - Cardinal Rule**: schema-first; intent.files schema is now load-bearing for queue ops.
- [ ] **principles.md - No Type Shortcuts**: no `as`, `any`, `Record<string, unknown>` added.
- [ ] **principles.md - No Compatibility Layers**: no backward-compat fallback was introduced at any point in the arc (Cycle 1.1 Pre-Execution Absorption dropped the originally proposed optional-pathspec overload before authoring; the migration is Replace-Don't-Bridge throughout).
- [ ] **principles.md - Replace, Don't Bridge**: the implicit "whole-index scope" assumption replaced; no flag added.
- [ ] **principles.md - Quality Gates**: aggregate `pnpm check` exits 0.
- [ ] **testing-strategy.md - Test Behavior**: two-writer invariant tests describe SYSTEM STATE (independent fingerprints, cohesive commits), not implementation choices.
- [ ] **testing-strategy.md - Atomic Landing**: each cycle ships test + product code in one commit.
- [ ] **testing-strategy.md - No Audit-Shaped Tests**: new tests fail before product code; product code makes them pass.
- [ ] **schema-first-execution.md - Schema as Operative Scope**: `intent.files` is now operative, not advisory.
- [ ] **System-Level Impact**: queue ceremony becomes sound for the multi-writer scenario it was designed for; no bypass needed.

**Acceptance Criteria**:

1. ✅ All checklist items verified.
2. ✅ Any unchecked item has documented justification OR is fixed before commit.

---

## Testing Strategy

### Unit Tests

**Single workflow-level describing surface** — `commit-workflow.unit.test.ts`:

The system state ("commit-queue commit honours intent.files scope across peer staging drift") is **one** state. It takes one describing surface, observed at the workflow seam via the capture-list pattern on injected deps. Seven invariants (a)–(g) cover the state in full.

- Invariants (c), (d), (e) landed in Cycle 1.2 via `stagedBundlePathspecs` capture.
- Invariants (a), (b), (f), (g) land in Cycle 1.3 via the same pattern, extending with `runGitCommitPathspecs` capture.

**Tests deleted in Cycle 1.3** (reshape; see §"Reshape rationale" in Cycle 1.3 body):

- `commit-queue-record-staged-scope.unit.test.ts` (Cycle 1.1 scaffolding; landed `fb0833a4`; deleted in Cycle 1.3 because the workflow-level invariants (a), (b) describe the state at the right layer and the file's `fakeRunGitFor` is a complex mock re-implementing git argv parsing).
- `commit-queue-verify-staged-scope.unit.test.ts` (Cycle 1.2 scaffolding; landed `6b5c9b4e`; deleted in Cycle 1.3 for the same reasons; invariants (c), (d) already live at the workflow level).

**No new test files in Cycle 1.3**. The originally planned `commit-queue-commit-pathspec.unit.test.ts` is NOT created — all new invariants land in the existing `commit-workflow.unit.test.ts` (one workflow → one describing file).

**Existing Coverage**: the rest of the commit-queue test suite (single-writer ceremony coverage) is preserved.

### Integration Tests

**None required for this plan.** The originally proposed `commit-queue-commit-pathspec.integration.test.ts` was dropped at Cycle 1.3 pre-execution per test-expert CRITICAL VIOLATIONS (spawning a real `git commit` in an ephemeral repo classifies as subprocess + filesystem-IO, not integration; husky-hook recursion risk through inherited `core.hooksPath`). The structural cure (Path B) widens the `runGitCommit` dep so the pathspec threading is observable at unit level; the end-to-end behaviour of `git commit -- <pathspec>` is git's contract, not ours to re-test.

### E2E Tests

None affected (commit-queue is internal tooling; no user-facing E2E suite covers it).

---

## Success Criteria

### Phase 0

- ✅ Source-structure assumptions verified by direct inspection.
- ✅ No other queue subcommand needs the same treatment.

### Phase 1

- ✅ Cycle 1.1: record-staged fingerprint is scoped to intent.files; two-writer record-staged invariant test green.
- ✅ Cycle 1.2: verify-staged/verify-staged-again is scoped to intent.files; writer-independence test green.
- [ ] Cycle 1.3: workflow-level describing surface lands seven invariants (a)–(g) in `commit-workflow.unit.test.ts`; the inner `git commit` is intent-scoped via `runGitCommit({ pathspec })`; the non-empty invariant is enforced at compile time on all three load-bearing dep input types and at runtime via the single narrowing site at `runCommitWorkflow` entry; scaffolding tests deleted; forward-trace broadcast posted.

### Phase Final

- [ ] SKILL-CANONICAL updated; Cycle 1.3 forward-trace verified; agent-tools filtered gates and root aggregate gate green; consolidation pass complete.

### Overall

- [ ] Queue ceremony is sound for multi-writer scenarios.
- [ ] No Path-B bypass needed for concurrent commits with disjoint intent scopes.
- [ ] Full-tree husky pre-commit gate preserved unchanged.
- [ ] No new CLI flag; no schema break; no new ADR.

---

## Dependencies

**Blocking prerequisites**:

- None. The agent-tools workspace is self-contained and the surfaces touched have no cross-workspace consumers.

**Beneficial prerequisites**:

- The 2026-05-22 ff2 owner-decision recording (the case that surfaced this gap) ideally lands BEFORE this plan begins so the comms event `e48d7f16` is anchored in committed history. Not blocking — this plan can proceed regardless.

**Related Plans**:

- `.agent/skills/commit/SKILL-CANONICAL.md` — documents the queue ceremony; updated in Phase Final.
- `.agent/plans/sector-engagement/eef/current/eef-first-feature.plan.md` — the ff2 work that surfaced the gap.

**Minimum shippable shape without beneficial prerequisites**: full plan as written; ff2 anchor is documentation context only.

---

## Plan-Body First-Principles Check

Apply [`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md) at the start of Phase 0 and again at the start of Cycle 1.3 (the largest behaviour change):

- **Shape**: is "scope the existing intent.files field to be operative" still the right shape, or has new evidence surfaced a different cure?
- **Landing path**: do all three cycles land cohesively (test + product code per cycle) without skipped tests or test-after-code drift?
- **Vendor literals**: no vendor APIs touched; not applicable.

If the first-principles check at the Cycle 1.3 boundary surfaces a different shape (e.g., the pathspec-threading unit test, dep-shape review, or non-empty pathspec invariant reveals that additional ceremony is required), STOP and revise the plan body before proceeding.

---

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Concurrent `git commit` calls collide on `.git/index.lock` | Low | Git's index.lock serializes commit operations natively; concurrent attempts wait or fail cleanly. Existing queue claim system already prevents simultaneous `commit-queue commit` calls for the same git claim. |
| Husky full-tree gate masks the scope narrowing (a working-tree-only failing artefact still aborts the commit, even though it's outside intent.files) | Low | This is intentional per the owner doctrine. Cycle 1.3 acceptance criterion 3 verifies this behaviour is preserved. |
| Optional-parameter fallback leaks into committed history | Eliminated | The Cycle 1.1 amendment (pre-execution reviewer feedback) replaced the optional-scope overload with a NEW scoped function (mandatory pathspec) sitting alongside the unscoped originals. No transient backward-compat shape ever enters committed history; Cycle 1.3 retires the originals once all callers adopt. |
| Comms-event forward-trace anchor drained before Phase Final | Medium → Mitigated | Forward-trace target switched to persistent `shared-comms-log.md` markdown anchors; closeout broadcast posted at end of Cycle 1.3, not deferred to Phase Final. |
| Stash-or-scope confusion in tests | Low | All new tests are state-describing (system invariant) rather than implementation-tracking; the test-expert reviewer pre-execution dispatch validates this. |
| Other queue subcommands silently rely on the whole-index assumption | Low | Phase 0 verification covers this; if any are found, the cycle scopes widen. The mitigation is "discover before commit", not "ignore". |

---

## Foundation Alignment

This plan commits to:

1. **[`principles.md`](../../../directives/principles.md)** — Replace-Don't-Bridge; schema-first; quality gates; no type shortcuts.
2. **[`testing-strategy.md`](../../../directives/testing-strategy.md)** — atomic-landing per cycle; tests describe state not implementation; no audit-shaped tests.
3. **[`schema-first-execution.md`](../../../directives/schema-first-execution.md)** — `intent.files` is schema-declared; this plan makes it operative.

---

## Notes

### Why This Matters (System-Level)

**Immediate Value**:

- ff2 (today's owner-decision recording) lands via the queue ceremony cleanly without sweeping Shaded's 9.2 work.
- Future multi-writer scenarios don't require Path-B bypass.

**System-Level Impact**:

- The queue + claim + comms ceremony genuinely fulfils its design intent: safe concurrent commits with audit-traceable scope.
- The intent.files field becomes the single source of truth for "what this commit owns" — both at declaration time (enqueue) and at execution time (record-staged, verify-staged, commit).
- Replace-Don't-Bridge applied at the doctrinal level: a silent implicit scope replaced by an explicit declared scope.

**Risk of Not Doing**:

- Every future multi-writer commit requires manual Path-B bypass, breaking the audit trail.
- The queue ceremony's design intent is undermined by an unstated assumption that the ceremony was supposed to enable past.

### Key Insight (restated for the implementer who picks this up)

The fix isn't "add a flag" — it's "honour the field that's already there". The intent record's `files` field is the operative scope; three subcommands ignore it; this plan makes them honour it.

---

## References

- Source files (Phase 0 verification snapshot, completed by Stormbound 2026-05-22 ~15:00Z; Cycles 1.1 + 1.2 have since scoped the staged-read seam):
  - `agent-tools/src/commit-queue/types.ts:39-52` — `CommitIntent.files: readonly string[]` (schema operative scope)
  - `agent-tools/src/commit-queue/git.ts:10-17` — original unscoped staged-read site; live pre-Cycle-1.3 code has only `getStagedBundleScoped`, awaiting canonical rename
  - `agent-tools/src/commit-queue/core.ts:17-29` — `createStagedBundleFingerprint`
  - `agent-tools/src/commit-queue/core.ts:135-160` — `recordStagedBundle` (first caller)
  - `agent-tools/src/commit-queue/core.ts:57-80, 181-217` — `verifyStagedBundle` + `verifyFingerprint` (second caller)
  - `agent-tools/src/commit-queue/cli.ts:130-143` — `runRecordStagedCommand` (Cycle 1.1 mutation point)
  - `agent-tools/src/commit-queue/cli.ts:146-160` — `runVerifyStagedCommand` (Cycle 1.2 mutation point)
  - `agent-tools/src/commit-queue/commit-workflow.ts:46,144,191` — `getStagedBundle` injected dep, `verifyStagedAgainstIntent`, `runVerifyStage` (Cycle 1.2 mutation point)
  - `agent-tools/src/commit-queue/commit-workflow-runtime.ts:51-95` — `getStagedBundle` wiring + `runGitCommit` (Cycle 1.2 wiring + Cycle 1.3 mutation point)
  - `agent-tools/src/commit-queue/index.ts` — public package surface; re-exports `createStagedBundleFingerprint` + `verifyStagedBundle` (so signature changes are part of the package public API)
- Comms anchors (persistent markdown form, retention-resilient):
  - Instance A: `.agent/state/collaboration/shared-comms-log.md` entry "2026-05-22T14:04Z — Mistbound Slipping Night → Shaded Whispering Dusk — Mistbound → Shaded — shared-index coordination ask before ff2 commit (A/B/C, default B in 90s)" (originated as comms event `e48d7f16` — may not survive retention sweep)
  - Instance B: `.agent/state/collaboration/shared-comms-log.md` entry "2026-05-22T14:56:37Z — Wooded Swaying Thicket → Stormbound Kiting Squall — commit 2389ff5e absorbed your foreign-staged commit-queue.ts + collaboration-state.ts edits" + the 14:58Z correction + the 15:00Z Shaded broadcast + Stormbound's 15:00Z directed-to-Shaded event `31641f82`
  - Instance C: `.agent/state/collaboration/shared-comms-log.md` entry "2026-05-22T15:42Z — Mistbound Slipping Night → Stormbound Kiting Squall — t12 handoff at session-end" + the 15:46Z Stormbound-to-Shaded heads-up + the 15:52Z Stormbound broadcast "t12 landed (0b7289e9); Cycle 1.2 pre-execution next" + the 16:13Z Cycle 1.2 closeout (commit `6b5c9b4e`)
- SKILL: `.agent/skills/commit/SKILL-CANONICAL.md` (updated in Phase Final)
- Foundation:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/schema-first-execution.md`

---

## Implementation Notes

### Key Insight

The data model already declares the scope (`intent.files`). The operations don't honour the declaration. Replace the silent assumption with the explicit field; no new surface needed.

### Migration Path

1. **Phase 0**: Confirm code structure matches the metacognition findings.
2. **Cycle 1.1**: Fingerprint helper + record-staged adopt intent-scoped variant.
3. **Cycle 1.2**: verify-staged + verify-staged-again adopt the same scoped helper.
4. **Cycle 1.3**: Inner `git commit` narrows to `intent.files`; no backward-compat fallback is introduced.
5. **Phase Final**: SKILL-CANONICAL update + comms forward-trace + aggregate gate + consolidation.

### Minimal Risk

- Three cohesive cycles, each test + product code together; rollback unit is one commit.
- Existing single-writer commit-queue tests preserved as regression guard throughout.
- No CLI surface change for users; internal semantic tightening only.
- Git's own index.lock provides the concurrency primitive; no new locking ceremony required.

---

## Consolidation

After the final cycle lands and `pnpm check` passes, run `/jc-consolidate-docs` for the standard graduation + napkin-rotation pass. Surface the "intent.files is operative scope" insight as a candidate doctrine entry if it surfaces as load-bearing across multiple sessions.

### Retrospective on Cycles 1.1 and 1.2 (recorded 2026-05-22 by Starlit Beaming Aurora)

Cycles 1.1 + 1.2 landed the product-code seams (`getStagedBundleScoped` read; the dep widening to accept scoped input) without describing the system state at the workflow level. They produced implementation-coupled scaffolding tests at the read seam — `fakeRunGitFor` reimplements git's argv parsing; tests assert on exact `stagedNameOnly`/`stagedNameStatus`/`stagedPatch` strings produced by specific `git diff` invocations. Per [`testing-strategy.md`](../../../directives/testing-strategy.md) §Philosophy, those tests violate "NEVER create complex mocks ... complex mocks result in testing the mocks", "NEVER add complex logic to tests", and "Test real behaviour, not implementation details".

Future readers picking up this plan: do **not** mistake the deleted-in-Cycle-1.3 scaffolding tests for a model to imitate. The right shape — observable in `commit-workflow.unit.test.ts` invariants (a) through (g) post-Cycle-1.3 — is workflow-level capture-list assertions on injected deps. One system state, one describing surface, simple captures of what crosses the dep seam.

The lesson generalises: when planning a multi-cycle structural change, ask at plan-author time *where the system state will be observable*. If the answer is "at the workflow seam", every cycle's tests should describe that one surface; if intermediate cycles need confidence about internal seams, that confidence is the implementer's, not a test-surface deliverable. Scaffolding tests written for the implementer's confidence have no claim on ongoing maintenance cost.

---

## Future Enhancements (Out of Scope)

- Per-writer git worktree isolation (Shape B from metacognition): not pursued; collides with full-tree-gating owner doctrine.
- Stash-and-restore wrapper (Shape C): not pursued; bridge-not-replacement; conflict-on-restore failure modes.
- Detect-and-abort safety net (Shape D): could be added later as a belt-and-braces guard if a genuine two-writers-overlapping-scope case emerges; not needed for the disjoint-scope case this plan covers.
- Queue-state visualisation (TUI improvements showing per-writer scope): future ergonomic improvement; not load-bearing.
