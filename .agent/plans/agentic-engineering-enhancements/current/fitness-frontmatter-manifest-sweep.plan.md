---
name: "Fitness Frontmatter — Manifest Sweep"
overview: >
  Establish the fitness-frontmatter convention as the canonical
  manifest of "knowledge-accretion surfaces with bounded size",
  catalogue files that should carry the frontmatter, agree the
  inclusion criterion with the owner, apply the manifest to
  qualifying files, and document the convention so future authoring
  defaults to it. Pre-requisite for any merge-handling or
  structural-enforcement mechanism keyed on the frontmatter.
todos:
  - id: phase-0-foundation
    content: "Phase 0: Catalogue current fitness frontmatter usage; agree inclusion criterion with owner."
    status: pending
  - id: phase-1-doc-convention
    content: "Phase 1: Author the convention doc that future scanners and authors consult."
    status: pending
  - id: phase-2-detection-red
    content: "Phase 2 (RED): write failing test that asserts every file matching criterion has the frontmatter."
    status: pending
  - id: phase-3-detection-green
    content: "Phase 3 (GREEN): implement the detection check; failing files itemised."
    status: pending
  - id: phase-4-apply-frontmatter
    content: "Phase 4: apply frontmatter to qualifying files."
    status: pending
  - id: phase-5-closure
    content: "Phase 5: detection green; quality gates green; consolidation pass."
    status: pending
isProject: false
---

# Fitness Frontmatter — Manifest Sweep

**Last Updated**: 2026-05-01
**Status**: 🔴 NOT STARTED
**Scope**: Make fitness frontmatter the canonical manifest of
knowledge-accretion surfaces with bounded size; apply it consistently
across qualifying files.

---

## Context

### The opportunity

The fitness frontmatter (`fitness_line_target`, `fitness_line_limit`,
`fitness_char_limit`, `fitness_line_length`, `split_strategy`)
already exists on a subset of files (e.g. `distilled.md`, `napkin.md`,
`practice-lineage.md`, `repo-continuity.md`, `pending-graduations.md`,
some patterns and operational memory files). It is consumed by
`pnpm practice:fitness:informational` and `pnpm practice:fitness:strict-hard`
to enforce write-time discipline.

The frontmatter is implicitly a *manifest*: any file that carries it
is declaring "I am a knowledge-accretion surface with bounded size and
graduation discipline." Several mechanisms benefit from a consistent
manifest:

1. The Practice-Core portability scanner (separate plan, in flight)
   does not depend on the manifest, but adjacent planning concerns
   (e.g. moving-targets remediation) ask "is this a permanent doc or
   an ephemeral surface?" — the inverse of the manifest question.
2. Multi-checkout merge handling (separate plan) keys on the
   manifest to decide which files need custom merge drivers vs
   post-merge reconciliation.
3. Structural enforcement of the rule "stated principles require
   structural enforcement" leans on the manifest to know which
   files to scan and which to leave alone.

### Issue 1: The manifest is incomplete and incoherent

**Evidence (live inventory captured to ephemeral surface in Phase 0,
not embedded here)**:

- Some files that accrete knowledge over time and have graduation
  discipline carry the frontmatter (distilled, napkin, repo-continuity,
  pending-graduations, the operational memory files).
- Some files that accrete similarly do *not* carry it (some PDRs
  with append-shaped amendment logs; some directive files; some
  pattern files).
- Some files that *do* carry it would not, on first principles,
  qualify (e.g. completed plans that are essentially frozen).
- Several different `fitness_*` value sets are in use; coherence of
  the values themselves is a separate question (not load-bearing for
  closure here).

**Root cause**: The frontmatter convention emerged organically.
There is no single canonical answer to "should this file carry it?",
and authoring drift has produced uneven coverage.

**Existing capabilities**:

- `pnpm practice:fitness:informational` and
  `pnpm practice:fitness:strict-hard` already iterate files with the
  frontmatter. The detection logic is already in place; the gap is
  in *coverage of the input set*.
- The scanner pattern (helper file + aggregator + unit tests) is
  reusable for the new "manifest coverage" check.

### Issue 2: The inclusion criterion is implicit

What property qualifies a file for the manifest? Candidate phrasings:

- "Files whose fitness function is *not* 'never grows beyond the
  original spec'." — captures the intent but is not mechanical.
- "Files written-to over multiple sessions, with graduation
  discipline." — captures more files; harder to enforce.
- "Files where size pressure is itself a structural signal." —
  captures the spirit of the existing convention.

The owner picks. Phase 0 catalogues candidates and records the
agreed criterion as durable plan-body content (the criterion is
stable, not moving).

---

## Quality Gate Strategy

```bash
pnpm practice:fitness:informational  # Frontmatter consumers
pnpm practice:fitness:strict-hard    # Hard-zone enforcement
pnpm portability:check               # If detection scanner extended
pnpm test:root-scripts               # Scanner unit tests
pnpm markdownlint:root
pnpm test
```

Run after each task; full sequence after each phase.

---

## Solution Architecture

### Principle

> "Stated principles require structural enforcement." — `distilled.md`
> general form (graduated 2026-04-30).

### Key Insight

The frontmatter already exists and is already consumed. The gap is
not in the mechanism; it is in *which files participate*. Closing the
gap is mostly cataloguing and decision-recording, with a thin
detection check to keep the manifest consistent going forward.

This exemplifies the first question from `principles.md`: **"Could
it be simpler?"**

Answer: **YES.** No new infrastructure. Catalogue, decide, apply,
detect.

### Strategy

1. **Phase 0**: Catalogue files with and without the frontmatter;
   classify each; agree the inclusion criterion with the owner.
2. **Phase 1**: Author the convention doc — the canonical answer to
   "what files should carry fitness frontmatter and what values are
   appropriate?" — so future authors and scanners can consult one
   source.
3. **Phase 2 (RED)**: failing test that asserts every file matching
   the agreed criterion carries the frontmatter.
4. **Phase 3 (GREEN)**: detection check; itemise failing files.
5. **Phase 4**: apply the frontmatter to qualifying files (with
   owner sign-off on each value set).
6. **Phase 5**: closure proof.

**Non-Goals** (YAGNI):

- ❌ Re-tuning fitness *values* across files. The manifest sweep is
  about presence/absence; the values are case-by-case and out of
  scope unless the owner explicitly asks during Phase 4.
- ❌ Auto-applying frontmatter without owner sign-off. Each apply is
  a small decision; mechanical defaults are fine, blanket apply is
  not.
- ❌ Graduating the frontmatter convention to an ADR/PDR. The
  convention doc in Phase 1 may be sufficient; promotion is a
  separate decision.
- ❌ Designing the multi-checkout merge handling. That is the
  downstream plan that consumes this manifest.
- ✅ Catalogue, criterion, convention doc, detection, application,
  closure.

---

## Build-vs-Buy Attestation

Not applicable. Extends existing first-party fitness infrastructure.

---

## Reviewer Scheduling (phase-aligned)

- **Pre-execution**: `assumptions-expert` (challenge: is the
  inclusion criterion the right shape?).
- **During**: `code-expert` gateway during Phase 3; `docs-adr-expert`
  during Phase 1 (convention doc).
- **Post**: `release-readiness-expert` before declaring closure.

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. Re-read `.agent/directives/principles.md`.
2. Re-read `.agent/directives/testing-strategy.md`.
3. Re-read the rule capture in `.agent/memory/active/distilled.md
   § Process` ("stated principles require structural enforcement").

---

## Lifecycle Trigger Commitment

1. Record the work shape: executable repo plan.
2. Run `start-right-quick`; consult active claims and recent
   collaboration log entries. The manifest sweep touches many files
   across many areas; coordination matters.
3. Register active areas before edits. Multiple peers may be
   touching fitness-managed files concurrently; collisions are
   likely if not coordinated.
4. Apply
   [`lifecycle-triggers`](../../templates/components/lifecycle-triggers.md)
   for the cross-cutting Phase 4.

---

## Documentation Propagation Commitment

Before marking a phase complete:

1. The Phase 1 convention doc lands in the appropriate canonical
   location (likely `.agent/directives/` or
   `.agent/memory/executive/`). Owner picks at Phase 1.
2. `.agent/memory/executive/artefact-inventory.md` updated if its
   characterisation of fitness frontmatter changes.
3. Apply `/jc-consolidate-docs` after Phase 5.

If no update is needed for a required surface, record an explicit
no-change rationale.

---

## Resolution Plan

### Phase 0: Catalogue and Criterion

#### Task 0.1: Catalogue the current state

**Acceptance Criteria**:

1. ✅ Inventory captured to ephemeral surface (`.remember/` or
   napkin), `{ file, has_frontmatter, accrual_shape, candidate }`.
2. ✅ `accrual_shape` classified: append-by-date / curated-rule-list /
   status-table / amendment-log / static-reference / other.
3. ✅ `candidate` flag indicates initial assessment of "should this
   file carry the manifest?" — to be confirmed in 0.2.
4. ✅ Survey covers: `.agent/directives/`, `.agent/memory/`,
   `.agent/practice-core/`, `.agent/plans/` (active and current),
   `.agent/state/`, `.agent/skills/`, `.agent/commands/`,
   `.agent/sub-agents/`. Ephemeral surfaces (`.remember/`,
   `.agent/state/collaboration/shared-comms-log.md`,
   archived napkins) explicitly excluded.

**Deterministic Validation**:

```bash
# Files currently carrying fitness frontmatter:
grep -REln 'fitness_line_target' .agent/ \
  | grep -v 'archive/' \
  | tee /tmp/fitness-current.txt

# Candidate accrual surfaces (heuristic only — owner judgement
# required):
grep -REln '## [0-9]{4}-[0-9]{2}-[0-9]{2}' .agent/ \
  | grep -v 'archive/' \
  | tee /tmp/fitness-candidates-by-date-headings.txt
```

#### Task 0.2: Owner decision gate — inclusion criterion

**Decision needed**:

1. ✅ Inclusion criterion: which property defines "this file should
   carry the manifest"? (Candidate phrasings recorded above.)
2. ✅ Edge cases recorded:
   - Append-only amendment logs inside otherwise-static decision
     records (PDRs, ADRs).
   - Pattern files (some accrete subsections, some do not).
   - Operational tracks and threads (semi-frozen vs active).
   - Active vs current vs future plans.
3. ✅ Default `fitness_*` values agreed: are there sensible defaults
   for new entries, or is each file value-tuned? (If defaults
   exist, the convention doc in Phase 1 records them.)
4. ✅ Detection scope confirmed: which directories the Phase 3
   scanner check covers.

**Task Complete When**: Inclusion criterion recorded as durable
plan-body content (this is a stable decision, not a moving target).

---

### Phase 1: Author the Convention Doc

#### Task 1.1: Convention doc

**Target location**: owner-decided at Phase 0.2 (likely
`.agent/directives/fitness-frontmatter-convention.md` or a section
in an existing directive — the convention is doctrinal and
permanent-shaped).

**Content**:

- The inclusion criterion (as agreed in Phase 0.2).
- The `fitness_*` field set, with field semantics.
- Default value guidance, if defaults exist.
- The relationship between the frontmatter and consumers
  (`pnpm practice:fitness:*`).
- The `split_strategy` field convention.

**Acceptance Criteria**:

1. ✅ Convention doc landed at the agreed location.
2. ✅ Doc is portable in tone (no host-specific addressing inside
   `.agent/practice-core/`; if landing inside Core, follow the
   strict portability rule).
3. ✅ `pnpm markdownlint:root` passes.

---

### Phase 2: RED — Detection Test

#### Task 2.1: Failing test for manifest coverage

**Acceptance Criteria**:

1. ✅ Test asserts: every file in the agreed scope that matches the
   inclusion criterion's mechanical proxy carries fitness
   frontmatter.
2. ✅ Test fails today (manifest gaps exist per Phase 0 catalogue).
3. ✅ Mechanical proxy for the criterion is documented inline (the
   test cannot encode owner judgement directly; it encodes the
   detectable shape that maps to the criterion — e.g. "files in
   `.agent/memory/active/` and `.agent/memory/operational/` that
   contain dated section headings").

**Deterministic Validation**:

```bash
pnpm test:root-scripts -- --run [test-suite-name]
# Expected: exit non-zero.
```

---

### Phase 3: GREEN — Detection Implementation

#### Task 3.1: Implement the manifest-coverage check

**Likely shape**: a new helper
`getFitnessManifestCoverageIssues(rootPath)` in
`validate-portability-helpers.ts` (or a sibling scanner). Walks the
agreed scope; for each file, applies the mechanical proxy; emits
`{ file, has_frontmatter, expected, hint }`.

Wired into `pnpm portability:check` (or a sibling scanner script if
the portability scope feels wrong; owner picks at Phase 3 if a
re-home is appropriate).

**Acceptance Criteria**:

1. ✅ Check passes Phase 2 fixtures.
2. ✅ Output is structured.
3. ✅ Allowed-exception list documented inline (e.g. files
   genuinely static despite living in a typically-accrual directory).
4. ✅ Stable across reruns.
5. ✅ No `as`, `any`, or `@ts-expect-error` introduced.

**Deterministic Validation**:

```bash
pnpm portability:check
# Expected: red on the live repo's manifest gaps from Phase 0.
```

---

### Phase 4: Apply the Manifest

**Key Principle**: Each apply is a small decision; mechanical
defaults are fine but blanket-apply is not. Owner-on-the-loop for
each non-default value choice.

#### Task 4.1: Apply frontmatter to qualifying files

**Acceptance Criteria**:

1. ✅ Every file the Phase 3 scanner flags either gains the
   frontmatter (with values per the convention doc and owner
   sign-off where non-default) or is added to the documented
   allowed-exception list with rationale.
2. ✅ No file gains the frontmatter without an `accrual_shape`
   classification matching the criterion.
3. ✅ Practice-Core files (if any qualify) follow the strict
   portability rule — frontmatter is portable; field names and
   semantics are universal, not host-specific.
4. ✅ `pnpm practice:fitness:informational` continues to pass.
5. ✅ `pnpm practice:fitness:strict-hard` does not regress (some
   files may legitimately be over hard-limit at this point — that
   is *fitness pressure*, not a Phase-4 failure; document explicitly).

**Deterministic Validation**:

```bash
pnpm portability:check
# Expected: manifest-coverage class now empty.

pnpm practice:fitness:informational
# Expected: exit 0; new files now visible to the consumer.
```

---

### Phase 5: Closure

#### Task 5.1: Full quality-gate sweep and consolidation

**Acceptance Criteria**:

1. ✅ All standard gates green.
2. ✅ Manifest-coverage scanner empty across the agreed scope.
3. ✅ Convention doc landed and discoverable.
4. ✅ Plan moved to `archive/completed/` after closure.
5. ✅ `/jc-consolidate-docs` pass complete.

**Deterministic Validation**:

```bash
pnpm portability:check
pnpm practice:fitness:informational
pnpm practice:fitness:strict-hard
pnpm test:root-scripts
pnpm test
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
```

#### Task 5.2: Foundation Document Compliance Checklist

- [ ] **principles.md — Architectural correctness**: convention
      mechanically detectable for the agreed proxy.
- [ ] **principles.md — No type shortcuts**: scanner code concretely
      typed.
- [ ] **principles.md — Quality gates**: all gates pass.
- [ ] **testing-strategy.md — RED first**.
- [ ] **System-level impact**: the manifest is now coherent;
      downstream mechanisms (merge handling) can key on it.

---

## Testing Strategy

### Unit Tests

Phase 2 fixtures cover the inclusion-criterion proxy with positive
and negative cases.

### Integration Tests

The scanner runs end-to-end as part of `pnpm portability:check`.
After Phase 4, the manifest-coverage class must be empty.

### E2E Tests

Not applicable.

---

## Success Criteria

### Phase 0

- ✅ Inventory + criterion + scope agreed.

### Phase 1

- ✅ Convention doc landed.

### Phase 2

- ✅ Tests fail for the right reason.

### Phase 3

- ✅ Scanner green on fixtures; itemises live-repo gaps.

### Phase 4

- ✅ Manifest applied; scanner empty.

### Phase 5

- ✅ All quality gates green; convention durable.

### Overall

- ✅ Fitness frontmatter is now the canonical manifest of
  knowledge-accretion surfaces with bounded size.
- ✅ Future authoring has a documented convention to consult.
- ✅ Downstream mechanisms can key on the manifest with confidence.

---

## Dependencies

**Blocking**: none.

**Blocks**:

- *Multi-checkout merge handling for fitness-managed files* — keys
  on this manifest to decide per-file merge strategy.

**Related Plans**:

- *Practice-Core portability strict enforcement* — independent;
  same session.
- *Moving-targets remediation in permanent docs* — independent;
  same session.

**Prerequisites**:

- ✅ `pnpm practice:fitness:*` exists and consumes the frontmatter.
- ✅ `pnpm portability:check` exists and is the natural extension
  point for the coverage scanner.

---

## Notes

### Why This Matters (System-Level Thinking)

**Question**: Why does manifest coherence matter?

**Immediate Value**:

- **Authoring clarity**: a documented criterion answers "should this
  new file carry fitness frontmatter?" without owner consultation
  every time.
- **Consumer reliability**: `pnpm practice:fitness:*` no longer
  silently misses files that should be tracked.
- **Reviewer load reduced**: the criterion is checkable mechanically.

**System-Level Impact**:

- **Foundation for merge handling**: the multi-checkout merge plan
  cannot start until the manifest is coherent. This plan unblocks
  that work.
- **Foundation for cross-cutting enforcement**: any future
  mechanism that wants to "iterate over knowledge-accretion
  surfaces" has a single, trustworthy manifest.
- **Doctrine pattern reinforced**: stated convention now has
  structural enforcement.

**Risk of Not Doing**:

- **Drift accumulates**: each new file is one more "should it
  carry the frontmatter?" judgement, none of which is cumulative.
- **Downstream mechanisms wobble**: the merge plan would have to
  re-do this catalogue work, or accept that some files silently
  fall through.

### Alignment

- ✅ RED before GREEN.
- ✅ Quality gates after every task.
- ✅ The manifest is the primary contribution; convention doc is
  the durable record.

---

## References

- Existing fitness infrastructure: `pnpm practice:fitness:informational`,
  `pnpm practice:fitness:strict-hard` (consumers of the frontmatter).
- Scanner code: `scripts/validate-portability.ts`,
  `scripts/validate-portability-helpers.ts`.
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/memory/active/distilled.md § Process`

---

## Implementation Notes

### Key Insight

The frontmatter is the manifest. We are not designing a new
mechanism; we are making an existing one coherent. The mechanical
proxy in Phase 2 is necessarily approximate (the criterion is
ultimately owner judgement); the convention doc is the place where
the full criterion lives, and the scanner enforces a checkable
subset.

### Migration Path

1. **Phase 0**: Catalogue + criterion.
2. **Phase 1**: Convention doc.
3. **Phase 2**: RED.
4. **Phase 3**: GREEN — scanner.
5. **Phase 4**: Apply.
6. **Phase 5**: Closure.

### Minimal Risk

- **No new infrastructure**: extends existing scanners and
  consumers.
- **Owner-on-loop for each apply**: blanket-apply is forbidden.
- **Allowed-exception list documented**: legitimate static files
  in typically-accrual directories are not coerced.

---

## Validation Checklist

```bash
pnpm portability:check
pnpm practice:fitness:informational
pnpm practice:fitness:strict-hard
pnpm test:root-scripts
pnpm test
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
```

**Expected Results**: All commands exit 0; manifest-coverage scanner
empty across the agreed scope.

---

## Code Quality Verification

```bash
# 1. No type shortcuts in scanner extension.
git diff main..HEAD -- scripts/ | grep -E '\b(as |any\b|@ts-expect-error)'
# Expected: no new matches.

# 2. New helper exported and unit-tested.
grep -E 'getFitnessManifestCoverageIssues' scripts/validate-portability-helpers.ts \
  scripts/validate-portability.unit.test.ts
# Expected: appears in helper definition and unit test.

# 3. Convention doc discoverable.
grep -RE 'fitness-frontmatter-convention' .agent/directives/ .agent/practice-index.md
# Expected: at least one match.
```

---

## Consolidation

After all work is complete and quality gates pass, run
`/jc-consolidate-docs`.

---

## Future Enhancements (Out of Scope)

- *Per-shape default values*: tuned defaults for `append-by-date`
  vs `curated-rule-list` vs `amendment-log` accrual shapes. The
  current plan covers presence; values are a follow-on.
- *Frontmatter linter*: a dedicated linter that checks the
  *values* (target ≤ limit; sensible char-to-line ratio; etc.).
  Optional improvement.
- *Convention promotion to PDR/ADR*: if the convention proves
  durable, promotion to a decision record is a separate session.
