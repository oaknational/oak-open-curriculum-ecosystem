---
name: "Moving Targets in Permanent Docs — Remediation"
overview: >
  Catalogue moving-target tokens (counts, SHAs, "live" figures that
  change with ordinary work) embedded in permanent docs, decide a
  per-instance cure (generated index, named pointer, deletion), apply
  the cures, and close the gap with structural enforcement where
  mechanical detection is feasible. Closes the prior-art instances
  the owner-stated rule names.
todos:
  - id: phase-0-foundation
    content: "Phase 0: Reproduce the moving-target inventory mechanically; agree the cure menu per instance class with the owner."
    status: pending
  - id: phase-1-detection-red
    content: "Phase 1 (RED): write failing tests for any structurally-detectable moving-target patterns we choose to enforce."
    status: pending
  - id: phase-2-detection-green
    content: "Phase 2 (GREEN): implement the detection check (likely as an extension to an existing scanner or markdownlint rule)."
    status: pending
  - id: phase-3-remediate
    content: "Phase 3: apply the agreed cure to each catalogued instance."
    status: pending
  - id: phase-4-closure
    content: "Phase 4: detection green; quality gates green; consolidation pass."
    status: pending
isProject: false
---

# Moving Targets in Permanent Docs — Remediation

**Last Updated**: 2026-05-01
**Status**: 🔴 NOT STARTED
**Scope**: Remediate moving-target tokens in permanent docs; add
structural enforcement where mechanical detection is feasible.

---

## Context

### The rule

Owner stated 2026-05-01: tool counts, bug counts, lint counts, file
counts, Git HEAD SHAs and any other figure that changes with ordinary
work must not be embedded in permanent docs. They are appropriate
only in ephemeral / state-tracking surfaces (`.remember/`,
`.agent/state/`, session napkins, comms log) where rotation is part
of the contract.

Existing instances are problems to be addressed — not necessarily
in the session of discovery, but they are problems.

### Issue 1: Permanent docs carry moving targets

**Evidence (prior-art class examples; live inventory is captured to
ephemeral surface in Phase 0, not embedded here)**:

- `practice-index.md` describes its surface using prose-embedded counts
  (rule count, command count, skill count, pattern count). These
  fluctuate with ordinary authoring.
- Some completed plans (e.g.
  `agent-infrastructure-portability-remediation.plan.md`) include
  "as of completion" counts in their Completion Note.
- Some long-lived docs may carry baked-in commit SHAs as historical
  citations; in most cases the Git label HEAD or a tag-shaped
  pointer would be preferable.

**Root cause**: When a count or SHA was first written, it was
accurate. The author had no mechanical reminder that the figure was
a moving target. Without enforcement, future authors copy the same
shape.

**Existing capabilities**:

- `pnpm portability:check` already reports live counts mechanically
  (per the existing
  `agent-infrastructure-portability-remediation.plan.md` completion
  note: "Live truth is now enforced by `pnpm portability:check`").
- Generated indexes exist for several artefact families (skills,
  commands, rules); inserting a count by reference rather than by
  hand is feasible.
- Markdownlint runs on every `.md` file; a custom rule or a
  configured pattern check is the natural extension point for
  detection.

### Issue 2: The cure depends on the instance

A moving target in prose can be cured three ways, and the choice is
case-by-case:

1. **Generated**: replace the prose count with a build-time
   substitution from the canonical source (e.g. scanner output,
   generated index).
2. **Named pointer**: replace the count with prose that names the
   *concept* and points at the live source ("see the canonical rule
   directory `.agent/rules/` for the rule set").
3. **Delete**: if the count is decorative and adds no orientation
   value, remove it entirely.

The owner picks per instance. Phase 0 brings up the catalogue and
agrees the cure menu before any rewriting.

---

## Quality Gate Strategy

```bash
pnpm markdownlint:root        # Doc-mutation gate
pnpm portability:check        # If touched
pnpm test:root-scripts        # If detection check is added
pnpm practice:fitness:strict-hard  # If fitness-managed files touched
```

Run after each task; the full sequence after each phase.

---

## Solution Architecture

### Principle

- "Moving targets do not belong in permanent docs." — `distilled.md`,
  recorded 2026-05-01.
- "Stated principles require structural enforcement." — `distilled.md`
  general form (graduated 2026-04-30).

### Key Insight

Most current violations have an obvious cure: the canonical source
already exists (generated index or scanner output), and the
hand-maintained count is purely a copy. The remediation is mostly
relocation: the live source replaces the prose copy, either by build
substitution or by a named pointer. Detection of *new* violations is
harder — the regex for "a count of agent infrastructure" has
unbounded false positives — but the small set of structurally
detectable forms (Git SHAs in prose; the specific phrase "N canonical
\<thing\>") covers most of the harm.

This exemplifies the first question from `principles.md`: **"Could
it be simpler?"**

Answer: **YES** for cure (mostly relocation); **PARTIALLY** for
detection (a narrow scanner is feasible; broad detection is not
worth the false-positive cost).

### Strategy

Phase 0 catalogues the inventory mechanically (not from this plan
body — moving targets do not belong in permanent docs, and a plan
that becomes reference material is a permanent doc) and agrees the
cure menu with the owner. Phases 1–2 implement the narrow detection
that *is* feasible. Phase 3 applies cures. Phase 4 closes.

**Non-Goals** (YAGNI):

- ❌ Broad mechanical detection of "any number that changes". The
  regex would have unbounded false positives.
- ❌ Auto-rewriting of prose. The cure is a per-instance owner
  decision.
- ❌ Retrospective edit of archived napkins or `.agent/state/`
  files. Those are explicitly ephemeral surfaces; the rule does not
  apply there.
- ❌ Edits to completed plans currently in `archive/`. They are
  frozen historical record. (Open question for owner: do completed
  plans currently in `current/` count as permanent? Decision belongs
  to Phase 0.)
- ❌ Authoring a new ADR/PDR for the rule itself. The rule is
  captured in `distilled.md § Process` and platform memory.
- ✅ Catalogue, cure menu, narrow detection, remediation pass,
  closure proof.

---

## Build-vs-Buy Attestation

Not applicable. Detection extends existing first-party tooling
(scanner or markdownlint config); no vendor adoption.

---

## Reviewer Scheduling (phase-aligned)

- **Pre-execution**: `assumptions-reviewer` (challenge: is the
  detection scope right? Is the cure menu sufficient?).
- **During**: `code-reviewer` gateway; `docs-adr-reviewer` during
  Phase 3 (cure application).
- **Post**: `release-readiness-reviewer` before declaring closure.

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. Re-read `.agent/directives/principles.md`.
2. Re-read `.agent/directives/testing-strategy.md` (RED first; tests
   prove the right behaviour).
3. Re-read the rule capture in `.agent/memory/active/distilled.md
   § Process`.
4. Verify: no compatibility shims, no warn-and-pass, no disabled
   checks.

---

## Lifecycle Trigger Commitment

1. Record the work shape: executable repo plan; this is the
   lifecycle artefact.
2. Run `start-right-quick`; consult active claims and recent
   collaboration log entries.
3. Register active areas before edits; permanent-doc edits are
   cross-cutting and may collide with peer agents' work.
4. Apply
   [`lifecycle-triggers`](../../templates/components/lifecycle-triggers.md)
   for any non-trivial cross-file edit.

---

## Documentation Propagation Commitment

Before marking a phase complete:

1. Update `.agent/practice-index.md` if its prose changes during
   remediation (it is a likely target).
2. Update any generated-index documentation if a generated source
   replaces a hand-maintained count.
3. Apply `/jc-consolidate-docs` after Phase 4.

If no update is needed for a required surface, record an explicit
no-change rationale.

---

## Resolution Plan

### Phase 0: Inventory and Cure Menu

**Foundation Check-In**: Re-read the rule capture; re-read
`principles.md § Could it be simpler?`.

**Key Principle**: The cure is per-instance owner judgement. The
plan's job is to bring the catalogue and the cure menu to the
table, not to pre-decide.

#### Task 0.1: Reproduce the moving-target inventory mechanically

**Acceptance Criteria**:

1. ✅ Inventory captured to ephemeral surface (a `.remember/` file or
   napkin entry; *not* this plan body).
2. ✅ Each entry is `{ file, line, kind, current_token, suggested_cure }`
   where `kind` is one of: count-in-prose, baked-SHA, baked-version,
   other-moving-target.
3. ✅ Inventory excludes ephemeral surfaces by construction
   (`.remember/`, `.agent/state/`, archived napkins, comms log).
4. ✅ The set of permanent-doc paths is recorded explicitly so future
   sessions can re-run the inventory deterministically.

**Deterministic Validation**:

```bash
# Counts in prose: "N <noun>" within permanent surfaces.
grep -REn '\b[0-9]{1,3}\s+(canonical|stable|active|completed|reviewers?|skills?|commands?|rules?|patterns?|wrappers?|ADRs?|PDRs?)\b' \
  .agent/directives/ .agent/practice-index.md .agent/practice-core/ \
  docs/architecture/ \
  | tee /tmp/moving-target-counts.txt

# Baked SHAs: 7+ hex tokens in permanent docs.
grep -REn '\b[0-9a-f]{7,40}\b' \
  .agent/directives/ .agent/practice-index.md .agent/practice-core/ \
  docs/architecture/ \
  | tee /tmp/moving-target-shas.txt
```

False-positive review (UUIDs, content hashes, examples) is part of
the task; the captured inventory excludes them.

#### Task 0.2: Owner decision gate — cure menu

**Decision needed**:

1. ✅ For each `kind` in the inventory, owner picks the default
   cure: generated, named-pointer, delete, or per-instance.
2. ✅ Owner confirms scope: are completed plans currently in
   `current/` in scope (their Completion Notes often carry counts)
   or out (they are about to move to `archive/` and freeze)?
3. ✅ Owner confirms whether the prior-art ADR/PDR amendment-log
   entries that name specific commit SHAs (e.g. "graduated
   2026-04-30 to PDR-038") are in scope. Reasoning for `out`:
   amendment-log entries are append-only historical records of when
   a graduation happened; the SHA-equivalent (the date) is stable
   not moving.
4. ✅ Detection scope confirmed: which structurally-detectable
   patterns will Phase 1–2 enforce, and which are catch-by-review.

**Task Complete When**: Owner has decided the cure menu and the
detection scope; the decision is recorded inline as comments in
this plan body's Phase 3 task list (decision is durable, not
moving).

---

### Phase 1: RED — Detection Tests

**Key Principle**: Only the structurally-detectable patterns
agreed in Phase 0 are tested.

#### Task 1.1: Author fixture cases for the agreed detection patterns

**Acceptance Criteria**:

1. ✅ One fixture per agreed detection pattern (e.g. "N canonical X"
   in a permanent surface; baked-SHA in a non-amendment-log permanent
   surface).
2. ✅ One negative fixture per pattern (e.g. "N canonical X" in
   `.remember/` which is allowed; SHA in an amendment-log entry
   which is allowed).
3. ✅ Tests fail because the detection check does not exist yet.

**Deterministic Validation**:

```bash
pnpm test:root-scripts -- --run [test-suite-name]
# Expected: exit non-zero; missing implementation.
```

---

### Phase 2: GREEN — Detection Implementation

#### Task 2.1: Implement the detection check

**Likely shape**: a new helper in
`scripts/validate-portability-helpers.ts` (or a sibling scanner if
the helper file is approaching fitness). Walks the agreed permanent-
surface paths; emits structured issues `{ file, line, pattern, hint }`.

The check is *narrow* — it enforces only the patterns Phase 0
agreed on. Broader detection is explicitly out of scope.

**Acceptance Criteria**:

1. ✅ Phase 1 fixtures behave as asserted.
2. ✅ Allowed-surface whitelist is explicit and documented inline.
3. ✅ Output is structured (machine-readable list).
4. ✅ Stable across reruns (no nondeterministic ordering).
5. ✅ No `as`, `any`, or `@ts-expect-error` introduced.

**Deterministic Validation**:

```bash
pnpm test:root-scripts
# Expected: exit 0.

pnpm portability:check
# Expected: red on the live repo's prior-art instances.

# Stability:
for i in {1..3}; do pnpm portability:check 2>&1 | sort > /tmp/run$i.txt; done
diff /tmp/run1.txt /tmp/run2.txt && diff /tmp/run2.txt /tmp/run3.txt
# Expected: no diff.
```

---

### Phase 3: Apply Cures

**Key Principle**: One cure per instance, per the menu agreed in
Phase 0.

#### Task 3.1: Apply cures to catalogued instances

**Acceptance Criteria**:

1. ✅ Every Phase 0 inventory entry has a recorded cure applied.
2. ✅ Where the cure is "generated", the prose now references the
   live source (scanner output, generated index, etc.) rather than a
   hand-maintained number.
3. ✅ Where the cure is "named pointer", the prose names the
   concept and the canonical directory/file; no figure remains.
4. ✅ Where the cure is "delete", the prose reads coherently after
   removal.
5. ✅ No replacement is itself a moving target (no swap of one count
   for another).
6. ✅ `pnpm markdownlint:root` and `pnpm practice:fitness:strict-hard`
   pass on every touched file.

**Deterministic Validation**:

```bash
pnpm portability:check
# Expected: enforced patterns now empty in the live repo.

# Re-run the Phase 0 inventory grep; expect empty (or only
# Phase 0-agreed false-positive class):
grep -REn '\b[0-9]{1,3}\s+(canonical|stable|active|completed)\s+(skills?|commands?|rules?|patterns?)\b' \
  .agent/directives/ .agent/practice-index.md .agent/practice-core/
```

**Task Complete When**: All catalogued instances cured; detection
green; markdownlint and fitness gates pass.

---

### Phase 4: Closure

#### Task 4.1: Full quality-gate sweep and consolidation

**Acceptance Criteria**:

1. ✅ All standard gates green.
2. ✅ Detection scanner empty across the agreed surfaces.
3. ✅ Distilled.md `§ Process` entry remains as captured 2026-05-01;
   no edit needed.
4. ✅ Plan moved to `archive/completed/` after closure.
5. ✅ `/jc-consolidate-docs` pass complete.

**Deterministic Validation**:

```bash
pnpm portability:check
pnpm test:root-scripts
pnpm test
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm practice:fitness:strict-hard
```

#### Task 4.2: Foundation Document Compliance Checklist

- [ ] **principles.md — Architectural correctness**: detection is
      mechanical for the agreed patterns.
- [ ] **principles.md — No type shortcuts**: scanner code concretely
      typed.
- [ ] **principles.md — No compatibility layers**: existing scanner
      extended; no parallel implementation.
- [ ] **principles.md — Quality gates**: all gates pass.
- [ ] **testing-strategy.md — RED first**: Phase 1 failed for the
      right reason before Phase 2.
- [ ] **testing-strategy.md — Behaviour not implementation**: tests
      assert "scanner flags pattern X", not "scanner uses regex Y".
- [ ] **System-level impact**: prior-art instances cured; agreed
      patterns durably enforced.

---

## Testing Strategy

### Unit Tests

Phase 1 fixtures cover each agreed detection pattern with one
positive and one negative fixture.

### Integration Tests

The scanner runs end-to-end as part of `pnpm portability:check`.
After Phase 3, the scanner against the live repo must exit 0 for
the agreed patterns.

### E2E Tests

Not applicable.

---

## Success Criteria

### Phase 0

- ✅ Inventory captured to ephemeral surface; cure menu agreed with
  owner; detection scope decided.

### Phase 1

- ✅ Tests fail for the right reason.

### Phase 2

- ✅ Detection green on fixtures; red on live repo's prior-art
  instances.

### Phase 3

- ✅ All catalogued cures applied; live repo green for the agreed
  patterns.

### Phase 4

- ✅ All quality gates green; consolidation complete.

### Overall

- ✅ The owner-stated rule from 2026-05-01 has structural
  enforcement for the agreed pattern set.
- ✅ Existing prior-art instances cured per the agreed menu.
- ✅ Future authoring is mechanically prevented from reintroducing
  the agreed patterns.
- ✅ The plan body itself complies with the rule (no embedded
  inventory; ephemeral capture in Phase 0).

---

## Dependencies

**Blocking**: none. The detection scanner is an additive extension
of `pnpm portability:check`; no new infrastructure required.

**Related Plans**:

- *Practice-Core portability strict enforcement* — same shape
  (structural enforcement of an owner-stated rule); precedes this
  plan in the doctrine sequence.
- *Fitness-frontmatter manifest sweep* — independent; same session.
- *Multi-checkout merge handling for fitness-managed files* —
  independent; same session.

**Prerequisites**:

- ✅ `pnpm portability:check` exists.
- ✅ Rule captured in `distilled.md § Process` and platform memory
  (`feedback_no_moving_targets_in_permanent_docs`).

---

## Notes

### Why This Matters (System-Level Thinking)

**Question**: Why does enforcing the no-moving-targets rule matter?

**Immediate Value**:

- **Doc trust**: figures in permanent docs become trustworthy
  because they are either generated or absent.
- **Fewer onboarding traps**: a new contributor reading "43
  canonical rules" today and finding 47 tomorrow loses calibration
  of every other figure on the page.
- **Reviewer load reduced**: a class of drift previously caught only
  by attention is now mechanical for the agreed patterns.

**System-Level Impact**:

- **The doctrine pattern reinforced**: this is one instance of
  PDR-038's general form; structural enforcement extends durability.
- **Generated-index muscle exercised**: where the cure is
  "generated", we reinforce the practice of letting the source of
  truth speak rather than hand-maintaining copies.
- **Practice-index becomes the bridge it was designed to be**:
  routing host-specific addressing through the index (rather than
  through prose counts) clarifies its role.

**Risk of Not Doing**:

- **Silent rot**: every new permanent doc has a non-trivial chance
  of carrying a fresh moving target; the rule slowly erodes.
- **The doctrine pattern weakens**: failing to follow up on
  "stated principles require structural enforcement" with structural
  enforcement is itself the failure mode.

### Alignment

- ✅ Phase 1 RED before Phase 2 GREEN.
- ✅ Quality gates after every task.
- ✅ Owner-stated rule gets structural enforcement for the agreed
  patterns.
- ✅ Plan body itself complies with the rule (no embedded inventory;
  no embedded counts).

---

## References

- Rule capture: `.agent/memory/active/distilled.md § Process`
  (entries added 2026-05-01).
- Scanner code: `scripts/validate-portability.ts`,
  `scripts/validate-portability-helpers.ts`.
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`

---

## Implementation Notes

### Key Insight

The distinction "permanent vs ephemeral surface" is the load-bearing
abstraction. A figure is allowed in `.remember/`, `.agent/state/`,
napkins, and the comms log because rotation is part of those surfaces'
contract; it is forbidden in directives, principles, ADRs, PDRs,
practice-index, and reference plans because their contract is "stable
between authoring sessions". The detection check keys on this
distinction.

### Migration Path

1. **Phase 0**: Inventory + owner cure menu.
2. **Phase 1**: RED tests for agreed patterns.
3. **Phase 2**: Detection check.
4. **Phase 3**: Apply cures.
5. **Phase 4**: Closure.

### Minimal Risk

- **Detection is narrow**: only agreed patterns are enforced; broad
  detection is explicitly out of scope to avoid false positives.
- **Cures are conservative**: relocation or deletion preserves
  meaning; auto-rewriting is forbidden.
- **No new infrastructure**: the scanner extension reuses existing
  shape.

---

## Validation Checklist

```bash
pnpm portability:check
pnpm test:root-scripts
pnpm test
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm practice:fitness:strict-hard
```

**Expected Results**: All commands exit 0; detection scanner empty
across the agreed surfaces.

---

## Code Quality Verification

```bash
# 1. No type shortcuts in scanner extension.
git diff main..HEAD -- scripts/ | grep -E '\b(as |any\b|@ts-expect-error)'
# Expected: no new matches.

# 2. New detection helper exported and unit-tested.
grep -E 'getMovingTargetIssues' scripts/validate-portability-helpers.ts \
  scripts/validate-portability.unit.test.ts scripts/validate-portability.ts
# Expected: appears in helper definition, unit test, and aggregator.

# 3. Allowed-surface whitelist documented inline.
grep -B2 -A2 'ephemeral\|allowed surface' scripts/validate-portability-helpers.ts
# Expected: comment explaining the whitelist.
```

---

## Consolidation

After all work is complete and quality gates pass, run
`/jc-consolidate-docs`.

---

## Future Enhancements (Out of Scope)

- *Generated-count macros*: build-time substitution of agreed counts
  into permanent docs (an alternative to "named pointer" cure).
- *Broader detection*: detection of natural-language counts that
  fail the narrow regex but match the rule's intent. Owner judgement
  on whether the false-positive cost is worth it.
- *Frozen-completed-plans rule*: explicit policy that plans in
  `archive/completed/` are frozen and exempt from re-rewrites; would
  formalise the Phase 0 scope decision.
