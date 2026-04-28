---
name: "Learning-Loop Negative-Feedback Tightening"
overview: "Queued incremental tranche: instantiate executive-memory drift detection on live surfaces and make consolidation-time memory-quality review explicit and auditable."
todos:
  - id: phase-0-red-baseline
    content: "Phase 0 (RED): Prove the current gaps and confirm the tranche boundary."
    status: pending
  - id: phase-1-green-executive-drift
    content: "Phase 1 (GREEN): Install drift-detection sections on the three executive-memory surfaces."
    status: pending
  - id: phase-2-green-memory-quality
    content: "Phase 2 (GREEN): Tighten consolidation-time memory-quality review with explicit dispositions and seed one live operational example."
    status: pending
  - id: phase-3-refactor-validation
    content: "Phase 3 (REFACTOR): Documentation alignment, validation, discoverability updates, and learning-loop closeout."
    status: pending
---

# Learning-Loop Negative-Feedback Tightening

**Last Updated**: 2026-04-23  
**Status**: 🔴 NOT STARTED  
**Scope**: Tighten two existing balancing loops in the practice system without adding new memory layers, new validators, or broad doctrinal redesign.

**Authoritative findings source**:
[learning-loops-and-balancing-feedback-report.md](../../../reports/agentic-engineering/deep-dive-syntheses/learning-loops-and-balancing-feedback-report.md)

**Historical predecessor**:
[memory-feedback-and-emergent-learning-mechanisms.execution.plan.md](memory-feedback-and-emergent-learning-mechanisms.execution.plan.md)
— broader execution plan whose executive-drift and cross-plane intent
landed doctrinally; this tranche is the smaller follow-on needed to
make two of those balancing mechanisms sharper in the live estate.

---

## Intended Impact

This plan is intended to produce two concrete outcomes:

1. **Executive memory becomes lookup-correctable in practice, not only
   in doctrine.**
   Impact: catalogue drift becomes visible and recordable at the point
   of use.

2. **Memory-quality review becomes an explicit consolidation output,
   not just an implicit judgement.**
   Impact: future sessions can distinguish "overweight but justified"
   from "overweight because stale, duplicative, or misrouted."

These are deliberately incremental changes to existing surfaces. They
increase balancing strength without slowing the reinforcing learning
loops or introducing new subsystems.

---

## Strict Scope

### In Scope

1. Add `## Drift Detection` sections to these three executive-memory
   files only:
   - `.agent/memory/executive/artefact-inventory.md`
   - `.agent/memory/executive/invoke-code-reviewers.md`
   - `.agent/memory/executive/cross-platform-agent-surface-matrix.md`
2. Update executive-memory guidance so the lookup-time verification and
   drift-capture expectations are discoverable in the local memory docs.
3. Amend `.agent/commands/consolidate-docs.md` step 9 so that every
   governed file outside `healthy` receives an explicit recorded
   memory-quality disposition.
4. Seed one live operational example of the new disposition vocabulary
   in `.agent/memory/operational/repo-continuity.md` for the existing
   carried-forward hard-zone files.
5. Update the relevant plan/index surfaces for discoverability.

### Out of Scope

- ❌ New scripts or validators.
- ❌ New memory planes, tags, or taxonomy changes.
- ❌ Practice Core / PDR / ADR rewrites in this tranche.
- ❌ Changes to fitness semantics, thresholds, or blocking behaviour.
- ❌ Repo-wide semantic scoring of memory quality.
- ❌ Broad reference-tier reform (already handled by PDR-032).
- ❌ Sweeping cleanup of all soft/hard files in the same tranche.

If any task pressures this plan outside these bounds, stop and split
the work into a separate follow-on plan.

---

## Why This Tranche

The findings report concludes that the repo's strongest balancing
loops are currently **volumetric** and **routing-oriented**, while
semantic value-density review is still concentrated in consolidation
judgement and the curated `reference/` tier.

Applying the first question here:

> Could it be simpler without compromising quality?

**Answer: yes.** The smallest useful move is to strengthen two
existing control points:

1. the executive-memory drift loop already specified by PDR-028;
2. the memory-quality review already present in `consolidate-docs`
   step 9.

No new architecture is required to get material improvement.

---

## Quality Gate Strategy

This tranche is intentionally **markdown-and-process only**. No
TypeScript, runtime, or build logic should change. Because of that,
the quality gates should match the signal-bearing surface:

### After Each Task

```bash
pnpm markdownlint:root
pnpm practice:fitness:informational
pnpm practice:vocabulary
```

### Task-Specific Validation

Use `rg` to prove each structural change exists and is named exactly:

- drift-detection blocks on the executive files
- disposition vocabulary in `consolidate-docs`
- seeded disposition lines in `repo-continuity.md`

### Escalation Rule

If execution introduces any script or runtime change despite the
declared scope, expand validation immediately to include the relevant
script tests (`pnpm test:root-scripts` or narrower targeted tests) and
record the scope break before proceeding.

---

## Foundation Alignment

Before execution and at the start of each phase:

1. Re-read `.agent/directives/principles.md`
2. Re-read `.agent/directives/testing-strategy.md`
3. Re-read `.agent/directives/schema-first-execution.md`
4. Re-read `.agent/directives/orientation.md`
5. Ask: "Are we strengthening an existing loop, or silently inventing
   a new subsystem?"

The answer must remain: **strengthening existing loops**.

---

## Reviewer Scheduling

- **Pre-execution**: `assumptions-reviewer` — validate that the
  tranche is genuinely incremental and not a disguised overhaul.
- **Mid-tranche**: `docs-adr-reviewer` after Phase 1 and Phase 2 —
  confirm that the local doctrine/command surfaces stay aligned.
- **Close**: `code-reviewer` gateway + `docs-adr-reviewer` —
  validate that the changes are coherent, discoverable, and tightly
  scoped.

This plan is intentionally too small to justify a large reviewer fan-out.

---

## Resolution Plan

### Phase 0 (RED): Prove the Current Gaps

#### Task 0.1: Baseline executive-memory drift install state

**Goal**: prove whether the PDR-028 drift-detection surface is absent
on the three local executive files.

**Acceptance Criteria**:

1. ✅ The exact three target files are confirmed.
2. ✅ Current live matches (or partial pre-existing installs) are
   recorded before any edits.
3. ✅ If any target file already contains the required block, the plan
   narrows rather than duplicating it.

**Deterministic Validation**:

```bash
rg -n "## Drift Detection|Last verified accurate|Known drift / pending update" \
  .agent/memory/executive/artefact-inventory.md \
  .agent/memory/executive/invoke-code-reviewers.md \
  .agent/memory/executive/cross-platform-agent-surface-matrix.md
# Expected before implementation: no matches, or partial matches that are
# explicitly captured as pre-existing state.
```

**Task Complete When**: the baseline state is explicit enough that
Phase 1 can add only the missing install surface.

#### Task 0.2: Baseline consolidation-time memory-quality explicitness

**Goal**: prove that `consolidate-docs` currently asks the value-density
question but does not yet require an explicit disposition vocabulary.

**Acceptance Criteria**:

1. ✅ The existing step-9 memory-quality question is located.
2. ✅ The absence of a required disposition vocabulary is proven.
3. ✅ The seeded live example target in `repo-continuity.md` is
   identified before Phase 2 edits begin.

**Deterministic Validation**:

```bash
rg -n "appropriately dense|low-value" .agent/commands/consolidate-docs.md
# Expected before implementation: the question exists.

rg -n "retain-as-dense|compress|split|graduate|de-promote|delete|raise-target|owner-limit-decision" \
  .agent/commands/consolidate-docs.md \
  .agent/memory/operational/repo-continuity.md
# Expected before implementation: no matches.

rg -n "Four directive files in fitness-hard zone" .agent/memory/operational/repo-continuity.md
# Expected: one carried-forward operational block exists as the live seeding target.
```

**Task Complete When**: the exact delta for Phase 2 is pinned and the
plan has not expanded beyond the chosen tranche.

---

### Phase 1 (GREEN): Install Executive-Memory Drift Detection

#### Task 1.1: Add drift-detection block to `artefact-inventory.md`

**Acceptance Criteria**:

1. ✅ The file contains a `## Drift Detection` section.
2. ✅ The section contains `Last verified accurate`.
3. ✅ The section contains `Known drift / pending update`.
4. ✅ The healthy-state placeholder is present and grep-visible.

#### Task 1.2: Add drift-detection block to `invoke-code-reviewers.md`

**Acceptance Criteria**:

1. ✅ The file contains the same three required markers.
2. ✅ The section is phrased as lookup-time verification, not
   session-start grounding.
3. ✅ No new governance mechanism is invented beyond the PDR-028 shape.

#### Task 1.3: Add drift-detection block to `cross-platform-agent-surface-matrix.md`

**Acceptance Criteria**:

1. ✅ The file contains the same three required markers.
2. ✅ The block makes platform-surface drift recordable without
   changing the matrix's primary role.

#### Task 1.4: Update local executive-memory guidance

**Acceptance Criteria**:

1. ✅ The relevant local memory doc names the new executive-memory
   drift-detection expectation.
2. ✅ The guidance explains lookup cadence clearly enough that future
   readers will use the loop rather than treat the new sections as
   decorative metadata.

**Phase 1 Deterministic Validation**:

```bash
rg -n "## Drift Detection|Last verified accurate|Known drift / pending update" \
  .agent/memory/executive/artefact-inventory.md \
  .agent/memory/executive/invoke-code-reviewers.md \
  .agent/memory/executive/cross-platform-agent-surface-matrix.md
# Expected: each file contains the required markers.

pnpm markdownlint:root
pnpm practice:fitness:informational
pnpm practice:vocabulary
# Expected: exit 0 for markdownlint/vocabulary; fitness is informational and
# any changed zone state is recorded, not ignored.
```

**Phase Complete When**: all three executive surfaces expose the
PDR-028 drift loop in a live, grep-visible form and the local memory
guidance reflects the install.

---

### Phase 2 (GREEN): Tighten Memory-Quality Review

#### Task 2.1: Add explicit disposition vocabulary to `consolidate-docs` step 9

**Required dispositions**:

- `retain-as-dense`
- `compress`
- `split`
- `graduate`
- `de-promote`
- `delete`
- `raise-target`
- `owner-limit-decision`

**Acceptance Criteria**:

1. ✅ Step 9 requires an explicit disposition for every governed file
   outside `healthy`.
2. ✅ Each token has a short meaning, so future sessions do not invent
   ad-hoc local synonyms.
3. ✅ The change strengthens the existing loop instead of redefining
   fitness or adding a new validator.

#### Task 2.2: Seed one live operational example in `repo-continuity.md`

**Goal**: ensure the new vocabulary is not purely theoretical by
normalising the existing carried-forward hard-zone block.

**Acceptance Criteria**:

1. ✅ The existing four-file hard-zone carry-forward block is rewritten
   in per-file form.
2. ✅ Each file receives one explicit disposition token.
3. ✅ Owner authority is preserved where appropriate via
   `owner-limit-decision` rather than overwritten by unilateral agent
   action.

**Phase 2 Deterministic Validation**:

```bash
rg -n "retain-as-dense|compress|split|graduate|de-promote|delete|raise-target|owner-limit-decision" \
  .agent/commands/consolidate-docs.md
# Expected: all disposition tokens are present in the step-9 rubric.

rg -n "retain-as-dense|compress|split|graduate|de-promote|delete|raise-target|owner-limit-decision" \
  .agent/memory/operational/repo-continuity.md
# Expected: the carry-forward hard-zone block contains explicit per-file
# dispositions.

pnpm markdownlint:root
pnpm practice:fitness:informational
pnpm practice:vocabulary
```

**Phase Complete When**: low-value-memory review is now an explicit
recorded output of consolidation, and one live operational surface
already demonstrates the vocabulary.

---

### Phase 3 (REFACTOR): Validation, Discoverability, and Closeout

#### Task 3.1: Documentation propagation and no-change rationale

**Acceptance Criteria**:

1. ✅ All directly impacted local surfaces are updated.
2. ✅ Any not-updated adjacent surfaces carry an explicit no-change
   rationale in the execution notes or documentation-sync surface.
3. ✅ No silent drift remains between the report, the plan, and the
   changed operational documents.

#### Task 3.2: Discoverability updates

**Acceptance Criteria**:

1. ✅ This plan is linked from the collection README, current index,
   and roadmap.
2. ✅ The report is linked from the reports lane README and the
   deep-dive syntheses README.

#### Task 3.3: Consolidation and closeout

**Acceptance Criteria**:

1. ✅ `/jc-consolidate-docs` is run after the tranche lands.
2. ✅ Any follow-on work surfaced by that pass is either:
   - captured into a new plan, or
   - explicitly deferred with named constraint, evidence, and
     falsifiability.

**Phase 3 Deterministic Validation**:

```bash
pnpm markdownlint:root
pnpm practice:fitness:informational
pnpm practice:vocabulary

rg -n "learning-loop-negative-feedback-tightening.plan.md" \
  .agent/plans/agentic-engineering-enhancements/README.md \
  .agent/plans/agentic-engineering-enhancements/current/README.md \
  .agent/plans/agentic-engineering-enhancements/roadmap.md
# Expected: plan discoverability entries exist.

rg -n "learning-loops-and-balancing-feedback-report.md" \
  .agent/reports/agentic-engineering/README.md \
  .agent/reports/agentic-engineering/deep-dive-syntheses/README.md
# Expected: report discoverability entries exist.
```

**Phase Complete When**: the tranche is validated, discoverable, and
its outcomes are not stranded in the plan body.

---

## Measurable Acceptance Criteria

The tranche is successful only when all of the following are true:

1. **Three live executive-memory surfaces** each contain a
   `Drift Detection` block with the three required markers.
2. **One local executive-memory guidance surface** describes the
   lookup-time verification/drift-capture expectation.
3. **`consolidate-docs` step 9** defines an explicit disposition
   vocabulary for non-healthy governed files.
4. **`repo-continuity.md`** contains one seeded, live example of that
   vocabulary for the existing hard-zone carry-forward block.
5. **No new validator script** or new architecture layer was added.
6. **All discoverability links** listed in Phase 3 exist.

---

## Definition of Done

This plan is done when:

1. every todo in the YAML frontmatter is `completed`;
2. the measurable acceptance criteria above are all true;
3. markdownlint and vocabulary checks pass;
4. fitness has been reviewed informationally and any changed state is
   recorded honestly;
5. `/jc-consolidate-docs` has run and no settled documentation remains
   trapped in execution notes;
6. any new follow-on work has a named home rather than being left as
   ambient "later" debt.

If execution finds itself proposing new scripts, new metrics, or a
Practice Core rewrite, this plan is no longer the correct vehicle.
Stop, split the work, and create a separate follow-on plan.
