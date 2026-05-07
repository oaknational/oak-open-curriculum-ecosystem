---
name: "Multi-Checkout Merge Handling for Fitness-Managed Files"
overview: >
  Handle the new architectural reality of multiple active checkouts
  diverging on fitness-managed files (Practice, plans, memories,
  shared state). Layered approach matched to file shape: custom
  merge drivers for append-by-date and JSON-with-IDs surfaces;
  standard merge plus a focused post-merge reconciliation command
  for curated rule lists and structured trackers; pre-merge CI gate
  keyed on fitness frontmatter; pre-commit warning on non-main
  branches. PDR-049 adds the topology rule: semantic content union is
  insufficient unless the integration lands through a real git merge.
  Phase 0 is an explicit owner decision gate where the architectural
  shape is confirmed before implementation begins.
todos:
  - id: phase-0-design-gate
    content: "Phase 0: Owner decision gate on architectural shape; confirm or redirect the layered recommendation."
    status: pending
  - id: phase-1-failure-mode-catalogue
    content: "Phase 1: Catalogue failure modes per file shape against current state; record the per-shape cure."
    status: pending
  - id: phase-2-drivers-red
    content: "Phase 2 (RED): failing tests for append-by-date and JSON merge drivers."
    status: pending
  - id: phase-3-drivers-green
    content: "Phase 3 (GREEN): implement merge drivers + .gitattributes wiring + setup script."
    status: pending
  - id: phase-4-reconcile-red
    content: "Phase 4 (RED): failing tests for the post-merge reconcile command."
    status: pending
  - id: phase-5-reconcile-green
    content: "Phase 5 (GREEN): implement consolidate-docs:reconcile."
    status: pending
  - id: phase-6-ci-gate
    content: "Phase 6: pre-merge CI gate keyed on fitness frontmatter."
    status: pending
  - id: phase-7-precommit-warning
    content: "Phase 7: pre-commit warning when non-main branches touch fitness files."
    status: pending
  - id: phase-8-closure
    content: "Phase 8: end-to-end validation against simulated multi-checkout scenarios; quality gates green; consolidation pass."
    status: pending
isProject: false
---

# Multi-Checkout Merge Handling for Fitness-Managed Files

**Last Updated**: 2026-05-07
**Status**: 🔴 NOT STARTED — broad fitness-file driver work remains
blocked on *fitness-frontmatter-manifest-sweep.plan.md*; the
state/memory contract-doctor slice is unblocked and owned by
[`memory-state-contract-doctor.plan.md`](../archive/completed/memory-state-contract-doctor.plan.md).
**Scope**: Make multi-checkout work safe for the repo's
knowledge-accretion surfaces by matching merge handling to file
shape, with the fitness frontmatter as the manifest that drives
routing.

---

## Context

### The transition

Until recently, the repo was active in a single checkout at a time.
Concurrent agents were a write-time concern (the active-claims
registry mediates contention; "shared-state files are always
writable" handles unavoidable overlap). Standard 3-way merge was
not exercised against the most knowledge-dense files because there
were no parallel branches authoring into them.

The repo is now active in multiple checkouts. The Practice, the
plans, and the memories can diverge across branches. Standard git
merge does not understand the *meaning* of these files — fitness
frontmatter, dated append-logs, curated rule lists, status tables,
JSON-with-IDs. Merging treats them as bags of lines; the merge we
want is structure-aware.

### Issue 1: Append-by-date logs lose ordering and may carry duplicates

**Files**: `napkin.md`, `shared-comms-log.md`, archived napkins,
PDR amendment logs, `pending-graduations.md` append sections.

**Failure mode under standard merge**: usually clean (different
lines), but:

- Date order may be wrong (interleaved entries from two branches).
- Exact duplicates can appear if both branches captured the same
  observation.
- Fitness blown after concatenation; consolidate-docs is required to
  graduate.

### Issue 2: Curated rule lists drift semantically

**Files**: `distilled.md`, `principles.md`, directives,
`practice-lineage.md`, `repo-continuity.md`, executive memory tables.

**Failure mode**: mechanical merge often succeeds; semantic merge
often broken — contradictory rules, two parallel "Process"
sections, dead cross-references, fitness blown.

### Issue 3: Status tables produce contradictory truth

**Files**: plan trackers, `repo-continuity.md` lane tables,
`pending-graduations.md`, `artefact-inventory.md`.

**Failure mode**: adjacent-row updates merge cleanly; same-row
updates conflict; two-branch updates can produce contradictory
truth (e.g. both reporting "in progress" with different evidence).

### Issue 4: JSON shared state is structurally fragile under text merge

**Files**: `active-claims.json`, `conversations/*.json`,
`escalations/*.json`.

**Failure mode**: text merge can produce invalid JSON or duplicate
IDs. The existing "always writable" rule was designed for one
checkout; multi-checkout merges hit a different seam.

### Issue 5: Fitness frontmatter is currently the only manifest, but it is not yet coherent

The fitness frontmatter (`fitness_line_target` etc.) is the
natural manifest of "knowledge-accretion surface with bounded size."
The *fitness-frontmatter-manifest-sweep* plan (sibling, in flight)
makes this manifest coherent. Without that work, this plan cannot
key its routing on the manifest.

### Issue 6: Content reconciliation without git topology loses future merge data

PDR-049 records the additional topology contract for memory/state
merges: copying files, cherry-picking content, or landing a
single-parent snapshot may preserve the visible text while discarding
the git parentage, merge-base behaviour, and future conflict-resolution
data structures. This plan therefore treats "proper git merge
operation first, semantic resolution second" as a gate for any
memory/state merge handling. The repo-local doctor plan owns the
deterministic topology check for the memory/state slice; this broader
plan applies the same rule to fitness-managed files once the manifest
and drivers exist.

---

## Quality Gate Strategy

```bash
pnpm test:root-scripts        # Driver and reconcile unit tests
pnpm test                     # End-to-end
pnpm portability:check        # Manifest + CI gate consistency
pnpm practice:fitness:informational
pnpm markdownlint:root
pnpm lint:fix
pnpm format:root
```

Run after each task; full sequence after each phase.

---

## Solution Architecture

### Principle

- "Stated principles require structural enforcement." — recorded
  in `distilled.md`; the general form was graduated 2026-04-30.
- "Knowledge preservation is absolute — fitness pressure routes to
  consolidate-docs, never as retroactive permission to have written
  less." — captured in the napkin skill and `distilled.md`.

### Key Insight

Fitness frontmatter is doing more work than it was originally
designed for. It started as a write-time signal ("this file targets
220 lines"); it is now (or should be) a *manifest* — the canonical
machine-readable list of "knowledge-accretion surfaces with bounded
size and structural enforcement requirements." Every mechanism in
this plan keys on that manifest:

- Routing: which files get a custom merge driver, which get
  post-merge reconcile.
- CI gate: which files trigger the gate when touched.
- Pre-commit warning: which files trigger the warning.

This means the system does not maintain a separate path-list in
three places. The frontmatter *is* the list.

This exemplifies the first question from `principles.md`: **"Could
it be simpler?"**

Answer: **YES.** One manifest (the frontmatter); four mechanisms
that read it; per-shape routing rules that fit on a small table.

### The proposed shape (subject to Phase 0 owner confirmation)

A layered approach, matched to file shape:

| Shape | Files | Merge handling |
|---|---|---|
| Append-by-date log | `napkin.md`, `shared-comms-log.md`, archived napkins | Custom merge driver: date-sort + exact-dedupe |
| JSON shared state | `active-claims.json`, `conversations/*.json`, `escalations/*.json` | Custom merge driver: deep-merge by ID, conflict-on-divergent-fields |
| Curated rule list | `distilled.md`, `principles.md`, directives, trinity prose | Standard merge + `pnpm consolidate-docs:reconcile` |
| Structured tracker | plans, `repo-continuity.md`, executive tables | Standard merge + `pnpm consolidate-docs:reconcile` |
| PDR amendment log | inside otherwise-static decision records | Custom merge driver scoped to the amendment-log section |

Cross-cutting:

- **Pre-merge CI gate** keyed on fitness frontmatter: any merge to
  main that touches a file with fitness frontmatter requires (1)
  merge result in-fitness, (2) reconcile receipt
  (`last_reconciled_at: <merge-base-or-parent-sha>` frontmatter
  field), (3) no broken cross-refs.
- **Pre-commit warning** on non-main branches touching fitness
  files: a hint, not a block. Matches the
  `respect-active-agent-claims` shape.

### Strategy

- **Phase 0**: Owner decision gate on the shape. The recommendation
  above is the starting point; Phase 0 is where the owner confirms
  or redirects. Subsequent phases build the agreed shape.
- **Phase 1**: Catalogue failure modes per file shape against
  *actual* current state (not just the abstract typology). Confirms
  routing.
- **Phases 2–3 (RED→GREEN)**: append-by-date and JSON merge drivers.
- **Phases 4–5 (RED→GREEN)**: post-merge reconcile command.
- **Phase 6**: pre-merge CI gate.
- **Phase 7**: pre-commit warning.
- **Phase 8**: end-to-end validation against simulated
  multi-checkout scenarios; closure.

**Non-Goals** (YAGNI):

- ❌ Auto-mutating files post-merge silently. The reconcile step is
  explicitly human-driven; a CI gate enforces that it happened, but
  the gate refuses to land a merge — it does not heal silently.
  This asymmetry ("fail-the-gate is structural; mutate-silently is
  forbidden") is preserved.
- ❌ Moving any fitness-managed file out of git. Tempting for some
  coordination surfaces (e.g. active-claims could live in an
  external store); deferred. If multi-checkout collisions remain
  painful even after this plan, that is the right escalation, in
  its own session.
- ❌ Per-author or per-branch ownership claims on fitness files.
  Multiple branches *will* author into napkin and distilled; a
  single-writer convention is the wrong shape.
- ❌ Custom merge drivers for the curated rule lists. The semantics
  matter; a script cannot tell that branch-1's rule contradicts
  branch-2's rule. Reconciliation requires owner judgement.
- ❌ Solving the multi-checkout coordination problem at the design
  level (e.g. designing an external coordination store). This plan
  works inside the current "git is the substrate" assumption.
- ✅ Drivers for mechanical shapes; reconcile for semantic shapes;
  CI gate for structural enforcement; pre-commit warning for
  early signal; end-to-end validation.

---

## Build-vs-Buy Attestation

### First-party options surveyed

- `git merge` with custom drivers via `.gitattributes` and
  `git config merge.<name>.driver`: native git, well-documented,
  per-file selection. Used for Phases 2–3.
- `git mergetool`: interactive merge resolution; not suitable for
  CI; not load-bearing here.
- Existing `pnpm consolidate-docs` command: heavy-weight current
  consolidation flow; the new reconcile command is a *narrower*
  sibling, not a replacement.

### Vendor / third-party options surveyed

- Dedicated semantic-merge tools (e.g. `git-mergetool` plugins for
  YAML/JSON): generally inappropriate for markdown with fitness
  semantics; few support the project's specific shapes.
- Outside the standard git flow (PR-bot resolvers, web-UI merge
  helpers): coupling to a specific platform; not portable across
  the agent surfaces this repo supports.

### Decision

Bespoke drivers + a focused first-party reconcile command, both built
on top of native git's `gitattributes` extension point. Sunk-cost
reasoning is *not* the rationale: the alternatives genuinely do not
fit (markdown-with-fitness-semantics is not a shape vendor tools
target). `assumptions-reviewer` runs against this attestation
pre-ExitPlanMode at Phase 0.

---

## Reviewer Scheduling (phase-aligned)

- **Pre-execution (Phase 0)**: `assumptions-reviewer` (challenge:
  is the layered shape right? Are there valid options not surveyed?
  Should some files leave git entirely?). Vendor specialist *not*
  applicable — bespoke first-party.
- **During Phases 2–3**: `test-reviewer` (RED proves the right
  thing); `architecture-reviewer-betty` (cohesion / coupling of the
  driver shape); `code-reviewer` gateway.
- **During Phases 4–5**: `architecture-reviewer-fred` (principles-
  first; reconcile must not silently mutate); `test-reviewer`.
- **During Phase 6**: `architecture-reviewer-wilma` (adversarial:
  what hides under "in-fitness" or "no broken cross-refs"?).
- **Post**: `docs-adr-reviewer`, `release-readiness-reviewer`.

Scheduling all reviewers at close is phase-misalignment.

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. Re-read `.agent/directives/principles.md`.
2. Re-read `.agent/directives/testing-strategy.md`.
3. Re-read `.agent/directives/agent-collaboration.md` (multi-agent
   coordination; the multi-checkout case is a specialisation).
4. Re-read the rule capture in `.agent/memory/active/distilled.md
   § Process`.
5. Verify: no auto-mutation, no compatibility shims, no warn-and-
   pass.

---

## Lifecycle Trigger Commitment

1. Record the work shape: executable repo plan; cross-cutting
   infrastructure work.
2. Run `start-right-quick`; consult active claims and recent
   collaboration log entries. This plan touches the *coordination*
   substrate; collisions with peer work are particularly likely.
3. Register active areas before edits — drivers under `scripts/`
   or `.git/`-adjacent infrastructure; reconcile command in
   `.agent/commands/`; CI workflow files; precommit hook
   configuration.
4. Apply
   [`lifecycle-triggers`](../../templates/components/lifecycle-triggers.md)
   for the cross-cutting Phases 6–7.

---

## Documentation Propagation Commitment

Before marking a phase complete:

1. `.agent/practice-index.md` updated if the merge convention
   changes its surface description.
2. `.agent/directives/agent-collaboration.md` extended with a
   "merge-time coordination" section (the existing collaboration
   directive covers write-time; multi-checkout adds a new seam).
3. `.agent/memory/operational/collaboration-state-conventions.md`
   updated if JSON merge-driver behaviour interacts with the
   active-claims schema.
4. `docs/engineering/build-system.md` updated with the
   per-checkout setup step (registering merge drivers).
5. Apply `/jc-consolidate-docs` after Phase 8.

If no update is needed for a required surface, record an explicit
no-change rationale.

---

## Resolution Plan

### Phase 0: Design Gate — Owner Confirmation

**Foundation Check-In**: Re-read the rule capture and the
recommendation prose at session-open 2026-05-01.

**Key Principle**: The shape is owner-decided. The plan's job is
to make the trade-offs visible.

#### Task 0.1: Owner decision gate

**Decision needed**:

1. ✅ Is the layered shape (drivers for mechanical shapes; reconcile
   for semantic; CI gate; pre-commit warning) the right approach?
   Or:
   - All-drivers (custom merge for every shape, including curated)?
   - All-reconcile (no drivers; reconcile handles everything)?
   - Hybrid with different layering?
   - Something else (e.g. moving some files out of git)?
2. ✅ Per-shape routing confirmed: which file paths get which
   treatment. Default: route by fitness frontmatter + a small
   per-shape rule table. Owner picks deviations.
3. ✅ Reconcile command home: extension to existing
   `consolidate-docs` or a sibling command? Owner picks.
4. ✅ CI gate scope: PR-only, or also branch-merge? Block on
   over-fitness, or warn?
5. ✅ Pre-commit warning scope: every fitness file, or only those
   already touched by another active claim?

**Build-vs-buy attestation review**: assumptions-reviewer challenges
the bespoke choice; owner confirms or redirects.

**Task Complete When**: Owner has confirmed the architectural shape;
deviations from the recommendation are recorded as durable plan-body
content.

---

### Phase 1: Per-Shape Failure-Mode Catalogue

**Foundation Check-In**: Re-read the failure modes named above;
test them against actual current state, not the abstract typology.

#### Task 1.1: Reproduce divergence scenarios for each file shape

**Acceptance Criteria**:

1. ✅ For each shape (append-by-date, JSON, curated rule list,
   structured tracker, amendment log), a reproducible scenario is
   constructed where two branches author into the same file and a
   standard merge produces an undesirable result.
2. ✅ Scenarios captured to ephemeral surface (test fixtures or
   `.remember/` notes; *not* embedded in this plan body, per
   no-moving-targets and the principle that scenarios are
   inventory-shaped).
3. ✅ Each scenario has a documented "desired result" — the merge
   output the chosen handling should produce.

#### Task 1.2: Map shapes to current files

**Acceptance Criteria**:

1. ✅ Every fitness-managed file (per the manifest produced by the
   *fitness-frontmatter-manifest-sweep* plan) has a recorded shape.
2. ✅ Files needing custom drivers vs reconcile vs both are
   itemised.
3. ✅ Edge cases recorded — e.g. a PDR with both static body and
   amendment log; a plan with both status table and append-shaped
   session-history section.

**Task Complete When**: Routing decisions per file are recorded;
edge cases have explicit handling.

---

### Phase 2: RED — Driver Tests

**Foundation Check-In**: Re-read `testing-strategy.md § RED first`.

#### Task 2.1: Append-by-date driver tests

**Acceptance Criteria**:

1. ✅ Test fixtures: `ancestor.md`, `branch-A.md`, `branch-B.md` for
   the three-way merge shape, with realistic napkin-style content.
2. ✅ Asserted outputs: date-sorted, exact-deduplicated.
3. ✅ Negative cases: malformed dates, mid-section conflicts.
4. ✅ Tests fail because the driver does not exist yet.

#### Task 2.2: JSON deep-merge-by-ID driver tests

**Acceptance Criteria**:

1. ✅ Test fixtures: representative active-claims, conversation,
   escalation snapshots.
2. ✅ Asserted outputs: union of records by ID; conflict on
   divergent same-ID field updates.
3. ✅ Negative cases: malformed JSON, schema-incoherent records.
4. ✅ Tests fail because the driver does not exist yet.

**Deterministic Validation**:

```bash
pnpm test:root-scripts
# Expected: exit non-zero; missing implementation.
```

---

### Phase 3: GREEN — Driver Implementation

#### Task 3.1: Append-by-date driver

**Likely shape**: `scripts/git-merge-drivers/append-by-date-merge.ts`
(or `.mjs` if matching existing scanner style). Reads the three
inputs from the args git's merge-driver API supplies; writes the
merged content.

**Acceptance Criteria**:

1. ✅ Phase 2.1 fixtures pass.
2. ✅ Driver is invokable directly (for testing) and via git's
   merge-driver protocol.
3. ✅ Conflict markers emitted on irreconcilable cases (driver
   defers to human).
4. ✅ No `as`, `any`, or `@ts-expect-error` introduced.

#### Task 3.2: JSON deep-merge-by-ID driver

**Likely shape**: `scripts/git-merge-drivers/json-deep-merge.ts`.

**Acceptance Criteria**:

1. ✅ Phase 2.2 fixtures pass.
2. ✅ Schema-aware: refuses merge with conflict markers if the
   merged JSON would be invalid.
3. ✅ Stable ordering of records (e.g. by ID).
4. ✅ No type shortcuts.

#### Task 3.3: `.gitattributes` wiring + setup script

**Acceptance Criteria**:

1. ✅ `.gitattributes` declares the per-file driver names (e.g.
   `napkin-merge`, `comms-log-merge`, `claims-json-merge`).
2. ✅ `pnpm setup:merge-drivers` (or equivalent) registers the
   `merge.<name>.driver` config for the current checkout.
3. ✅ Setup script is idempotent.
4. ✅ Setup script is documented in `docs/engineering/build-system.md`
   (or wherever onboarding lives) and in the Quick Start.
5. ✅ Onboarding for a fresh checkout can complete in a single,
   discoverable step.

**Deterministic Validation**:

```bash
pnpm test:root-scripts
# Expected: exit 0.

# End-to-end: simulate a divergent merge via two worktrees.
[fixture-driven test that creates two branches, edits a fitness
file in each, merges, and asserts the result]
# Expected: merge succeeds; output matches the asserted shape.
```

---

### Phase 4: RED — Reconcile Tests

**Foundation Check-In**: Re-read `testing-strategy.md` and
"knowledge preservation is absolute" from `distilled.md`.

#### Task 4.1: Reconcile-command tests

**Acceptance Criteria**:

1. ✅ Test scenarios: a merge has produced an over-fitness file; a
   merge has produced two parallel "Process" sections in distilled.md;
   a merge has produced a duplicate row in repo-continuity.md;
   a merge has produced a broken cross-reference (link to an ADR
   that one branch added/removed).
2. ✅ Asserted reconcile behaviour: surfaces the issue with a
   targeted prompt; suggests the cure; never silently mutates;
   records the reconcile event in a `last_reconciled_at` frontmatter
   field on success.
3. ✅ Tests fail because the command does not exist yet.

---

### Phase 5: GREEN — Reconcile Implementation

#### Task 5.1: `pnpm consolidate-docs:reconcile`

**Likely shape**: a new command in `.agent/commands/`, invoked as
`/jc-consolidate-docs:reconcile` or as the `pnpm` script. Reads
fitness frontmatter; iterates touched files; surfaces issues; walks
the agent through cures.

**Acceptance Criteria**:

1. ✅ Phase 4.1 scenarios pass.
2. ✅ Command never silently mutates a file. Every change is
   owner-visible (chat-rendered diff or explicit prompt).
3. ✅ `last_reconciled_at` is recorded only after the file is in-
   fitness AND no broken cross-refs remain AND owner has confirmed
   the section-level merges (where applicable).
4. ✅ Command is invoked from any branch; not main-only.
5. ✅ Documented in the appropriate canonical location (the existing
   `.agent/commands/consolidate-docs.md` is the natural sibling; the
   reconcile variant is a narrower entry point).

**Deterministic Validation**:

```bash
pnpm test:root-scripts
# Expected: exit 0.
```

---

### Phase 6: Pre-Merge CI Gate

#### Task 6.1: CI workflow extension

**Acceptance Criteria**:

1. ✅ The PR workflow (or merge-to-main workflow) includes a job
   that:
   - Detects whether the PR head touches any file with fitness
     frontmatter.
   - If yes, requires (a) merge result in-fitness
     (`pnpm practice:fitness:strict-hard` exits 0), (b) every
     touched fitness file has `last_reconciled_at` matching the
     merge-base SHA (or the PR head's parent if simpler), (c) no
     broken cross-references introduced.
   - If any check fails, the gate fails.
2. ✅ Gate failure surfaces a clear hint: "run
   `pnpm consolidate-docs:reconcile` and update
   `last_reconciled_at`."
3. ✅ Gate is keyed on fitness frontmatter (per the manifest from the
   *fitness-frontmatter-manifest-sweep* plan), not on a hand-
   maintained path-list.
4. ✅ Owner waiver path documented (rare cases where the gate must
   be bypassed; the waiver is owner-explicit, not agent-explicit).

**Deterministic Validation**:

```bash
[CI workflow simulated in a PR fixture]
# Expected: gate fails when last_reconciled_at is stale; passes
# after reconcile; informational when no fitness files touched.
```

---

### Phase 7: Pre-Commit Warning

**Key Principle**: Hint, not block. The pre-commit warning is an
*information surface* — it does not refuse the commit.

#### Task 7.1: Pre-commit hook extension

**Acceptance Criteria**:

1. ✅ When the working tree contains a staged change to a fitness-
   manifest file AND the current branch is not main, the pre-commit
   hook emits a warning naming:
   - The file(s) touched.
   - The reminder that the merge to main will require
     `consolidate-docs:reconcile`.
2. ✅ Warning does not block the commit.
3. ✅ Warning is suppressible per-commit if the same notice has
   already fired for the file in this session (avoid noise).
4. ✅ Warning text is portable (no host-specific addressing if the
   hook content lives inside `.agent/practice-core/` — in practice,
   it likely lives in `.husky/` or a hook-runner script and is
   host-specific by nature).

**Deterministic Validation**:

```bash
[hook fixture: staged change to napkin.md on a feature branch]
# Expected: warning emitted; commit succeeds.
```

---

### Phase 8: End-to-End Validation and Closure

#### Task 8.1: Multi-checkout simulation

**Acceptance Criteria**:

1. ✅ Two worktrees on different branches each author into
   napkin.md, distilled.md, and active-claims.json. A merge of one
   into the other:
   - Produces correct napkin merge via driver (date-sorted,
     deduped).
   - Produces correct active-claims merge via driver (records
     unioned by ID; no duplicates).
   - Produces *valid markdown* but possibly-unreconciled
     distilled.md, requiring `consolidate-docs:reconcile`.
2. ✅ The CI gate (Phase 6) refuses to land the merge until
   reconcile completes and `last_reconciled_at` is current.
3. ✅ The pre-commit warning fires during the simulated branch
   work.
4. ✅ End-to-end simulation runs as a scripted test
   (`scripts/test-multi-checkout-merge.ts` or similar) so the
   scenario is reproducible.

#### Task 8.2: Full quality-gate sweep and consolidation

**Acceptance Criteria**:

1. ✅ All standard gates green.
2. ✅ Multi-checkout simulation passes.
3. ✅ Plan moved to `archive/completed/` after closure.
4. ✅ `/jc-consolidate-docs` pass complete.

**Deterministic Validation**:

```bash
pnpm test:root-scripts
pnpm test
pnpm portability:check
pnpm practice:fitness:informational
pnpm practice:fitness:strict-hard
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
```

#### Task 8.3: Foundation Document Compliance Checklist

- [ ] **principles.md — Architectural correctness**: drivers and
      reconcile are first-party; no compatibility shims.
- [ ] **principles.md — No type shortcuts**: drivers and reconcile
      concretely typed.
- [ ] **principles.md — Quality gates**: all gates pass.
- [ ] **testing-strategy.md — RED first**: every implementation phase
      followed RED before GREEN.
- [ ] **testing-strategy.md — Behaviour over implementation**: tests
      assert merge outcomes, not regex matches.
- [ ] **agent-collaboration.md — coordination at write time and merge
      time**: directive extended to cover both seams.
- [ ] **System-level impact**: multi-checkout work is now safe;
      knowledge preservation is preserved at merge time as it is at
      write time.

---

## Testing Strategy

### Unit Tests

- Append-by-date merge driver: fixtures cover ancestor/branch-A/
  branch-B with realistic napkin content; positive and negative
  cases.
- JSON deep-merge driver: fixtures cover claims/conversations/
  escalations snapshots; positive and negative cases.
- Reconcile command: fixtures cover over-fitness merge result,
  duplicate sections, broken cross-refs.
- CI gate logic: fixtures cover stale `last_reconciled_at`,
  in-fitness vs over-fitness, broken-cross-ref detection.
- Pre-commit warning: fixture covers staged-change-to-fitness-file-
  on-feature-branch.

### Integration Tests

- Multi-checkout simulation (Phase 8.1) — scripted end-to-end test
  driving two worktrees through divergent edits and a merge.

### E2E Tests

- A CI dry-run of the gate against a simulated PR fixture.

---

## Success Criteria

### Phase 0

- ✅ Owner has confirmed the architectural shape.

### Phase 1

- ✅ Per-shape failure-mode catalogue produced; routing decisions
  recorded.

### Phases 2–3

- ✅ Drivers green on fixtures and against simulated divergent
  scenarios.

### Phases 4–5

- ✅ Reconcile command green on fixtures; never silently mutates.

### Phase 6

- ✅ CI gate fails for the right reasons; passes after reconcile.

### Phase 7

- ✅ Pre-commit warning fires correctly; never blocks.

### Phase 8

- ✅ Multi-checkout simulation passes end-to-end.
- ✅ All quality gates green.

### Overall

- ✅ Multi-checkout work on fitness-managed files is safe by
  construction.
- ✅ Knowledge preservation holds at merge time as well as write
  time.
- ✅ The fitness manifest does the work; no parallel path-lists
  are maintained.

---

## Dependencies

**Blocking**:

- *Fitness-frontmatter manifest sweep* — must complete before this
  plan can key its routing on the manifest.

**Related Plans**:

- *Practice-Core portability strict enforcement* — independent;
  same session.
- *Moving-targets remediation in permanent docs* — independent;
  same session.

**Prerequisites**:

- ✅ `pnpm practice:fitness:*` exists.
- ✅ `pnpm portability:check` exists.
- ✅ Existing `consolidate-docs` command exists; the reconcile
  command is a sibling.

---

## Notes

### Why This Matters (System-Level Thinking)

**Question**: Why does multi-checkout safety matter for these
files?

**Immediate Value**:

- **Knowledge preservation at merge time**: napkin entries and
  distilled rules from two branches both survive without manual
  diff-resolving.
- **JSON state stays valid**: active-claims merges produce valid,
  ID-coherent JSON, not text-merged garbage.
- **Reviewer / owner load reduced**: routine merges are routine
  again; only semantically-conflicting changes ask for attention.

**System-Level Impact**:

- **Repo can support genuinely parallel work**: a long-running
  feature branch and an exploratory branch can both author into the
  Practice without one of them being "the canonical writer."
- **Doctrine pattern reinforced**: "stated principles require
  structural enforcement" applied to the merge-time seam.
- **Fitness frontmatter promoted to canonical manifest**: a
  pre-existing convention earns its keep as the routing index.

**Risk of Not Doing**:

- **Knowledge loss at merge time**: napkin entries silently
  duplicated or lost; distilled rules silently contradicted; JSON
  state silently invalidated.
- **Multi-checkout work informally banned**: the cost of merging
  these files becomes high enough that branches converge on a
  single-writer convention by accident.
- **Coordination at write time becomes incoherent**: active-claims
  loses its meaning if branches independently mutate it.

### Alignment

- ✅ RED before GREEN at every implementation phase.
- ✅ Owner-on-loop where semantics matter (reconcile, owner waiver).
- ✅ No silent mutation: gates fail; reconcile prompts; warnings
  hint.
- ✅ Manifest-keyed routing: no parallel path-lists.

---

## References

- Existing fitness infrastructure: `pnpm practice:fitness:*`.
- Existing consolidation: `.agent/commands/consolidate-docs.md`.
- Existing collaboration directive: `.agent/directives/agent-collaboration.md`.
- Existing collision-safety rule:
  `.agent/rules/respect-active-agent-claims.md` (write-time analogue).
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/agent-collaboration.md`

---

## Implementation Notes

### Key Insight

The fitness frontmatter is the manifest. Once it is coherent
(prerequisite plan), every mechanism in this plan reads it. There
is no parallel path-list to maintain. This is the simplification
move that makes the rest of the design tractable.

### Migration Path

1. **Phase 0**: Owner confirmation.
2. **Phase 1**: Failure-mode catalogue.
3. **Phases 2–3**: Drivers (append, JSON).
4. **Phases 4–5**: Reconcile.
5. **Phase 6**: CI gate.
6. **Phase 7**: Pre-commit warning.
7. **Phase 8**: End-to-end validation; closure.

### Minimal Risk

- **Phase 0 explicit decision gate**: avoids building the wrong
  shape.
- **RED before GREEN at every implementation phase**: tests prove
  the right thing.
- **No silent mutation**: gates fail; reconcile prompts; warnings
  hint. This is the architectural commitment that makes the system
  trustworthy.
- **Manifest-keyed routing**: the system stays simple as the file
  population grows.
- **Drivers handle only the mechanically clean shapes**: semantic
  shapes always go through reconcile, where owner judgement applies.

---

## Validation Checklist

```bash
pnpm test:root-scripts
pnpm test
pnpm portability:check
pnpm practice:fitness:informational
pnpm practice:fitness:strict-hard
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
[multi-checkout simulation script]
```

**Expected Results**: All commands exit 0; multi-checkout simulation
passes end-to-end.

---

## Code Quality Verification

```bash
# 1. No type shortcuts in drivers or reconcile.
git diff main..HEAD -- scripts/git-merge-drivers/ .agent/commands/ \
  | grep -E '\b(as |any\b|@ts-expect-error)'
# Expected: no new matches.

# 2. .gitattributes wiring present.
grep -E 'merge=(napkin-merge|comms-log-merge|claims-json-merge)' .gitattributes
# Expected: at least one match per shape.

# 3. CI gate workflow declares the right job.
grep -E '(consolidate-docs:reconcile|practice:fitness:strict-hard)' \
  .github/workflows/*.yml
# Expected: gate references the reconcile receipt and the fitness
# check.

# 4. Documentation propagation: setup step discoverable.
grep -E 'setup:merge-drivers' docs/engineering/build-system.md README.md
# Expected: at least one match.
```

---

## Consolidation

After all work is complete and quality gates pass, run
`/jc-consolidate-docs`.

---

## Future Enhancements (Out of Scope)

- *External coordination store for active-claims*: if multi-
  checkout collisions on the JSON state remain painful even with
  drivers, moving the state out of git into a shared store is the
  right escalation.
- *Driver for amendment-log sections inside otherwise-static
  files*: a section-scoped driver that is invoked only on the
  amendment-log section of a PDR (rather than the whole file).
  Useful but not load-bearing for closure.
- *Reconcile UI*: a richer interactive walk-through (web UI,
  IDE plugin) for the reconcile step. Quality-of-life.
- *Cross-checkout claim awareness*: the active-claims registry
  could be extended to include the branch holding each claim, so
  agents on different checkouts see each other. Useful but not
  load-bearing here.
- *Promotion to PDR/ADR*: if the merge-handling shape proves
  durable, promoting the layered approach to a decision record is a
  separate session.
