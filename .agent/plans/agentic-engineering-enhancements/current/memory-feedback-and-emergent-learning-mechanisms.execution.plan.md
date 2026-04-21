---
name: "Memory Feedback and Emergent-Learning Mechanisms — Execution"
overview: "Install feedback loops across all three memory planes, add cross-plane paths, install emergent-whole observation, graduate pending content, and land supporting doctrine."
todos:
  - id: phase-0-ratification
    content: "Phase 0: Ratify inherited three-plane frame (0.1) and resolve portability decision (0.2)."
    status: pending
  - id: phase-1-graduate-overdue
    content: "Phase 1: Graduate overdue content — pattern extraction, perturbation-mechanism bundle, Artefact Map refresh."
    status: pending
  - id: phase-2-pending-graduations-register
    content: "Phase 2: Formalise pending-graduations register schema and bind to session-handoff and consolidate-docs."
    status: pending
  - id: phase-3-cross-plane-paths
    content: "Phase 3: Install missing cross-plane paths (active→executive, operational→executive, executive→anywhere)."
    status: pending
  - id: phase-4-executive-drift-detection
    content: "Phase 4: Install executive-memory drift-detection surface on three executive files."
    status: pending
  - id: phase-5-emergent-whole-observation
    content: "Phase 5: Extend jc-consolidate-docs step 5 cross-session scope to include cross-plane scope; add napkin cross-plane tag."
    status: pending
  - id: phase-6-doctrine-landing
    content: "Phase 6: Land Executive-Memory Feedback Loop doctrine (PDR or host-local per Phase 0.2) + ADR-131 cross-reference."
    status: pending
  - id: phase-7-validation-and-learning-loop
    content: "Phase 7: Run full consolidation + fitness gates, adversarial review, update roadmap, run learning loop."
    status: pending
isProject: false
---

# Memory Feedback and Emergent-Learning Mechanisms — Execution

**Last Updated**: 2026-04-20
**Status**: 🔴 NOT STARTED
**Scope**: Install feedback loops across `active/`, `operational/`, and
`executive/` memory planes; install cross-plane paths; install
emergent-whole observation via `jc-consolidate-docs`; graduate the
four overdue content items named in `repo-continuity.md § Deep
consolidation status`; land supporting doctrine.

**Strategic source**:
[`../future/memory-feedback-and-emergent-learning-mechanisms.plan.md`](../future/memory-feedback-and-emergent-learning-mechanisms.plan.md)

**Metacognition (first- and second-pass)**:
[`../future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md`](../future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md)

---

## Context

The 2026-04-20 memory taxonomy restructure cleanly split persistent
content into three planes (`active/`, `operational/`, `executive/`).
An immediate close-session audit surfaced that the planes are not
all wired into feedback loops:

- `active/` has a mature loop (ADR-131, PDR-011).
- `operational/` has a young-but-real loop (session-handoff writes,
  start-right reads, `promotion_needed` routes to watchlist).
- `executive/` is a write-once catalogue with no drift detection
  and no graduation channel. The `executive/README.md` explicitly
  says *"Executive memory is not refreshed per session."*

Cross-plane paths have two verified gaps: `active → executive` and
`executive → anywhere`. The emergent-whole — cross-plane meta-
pattern detection and liminal-space learning — relies on owner
insight, not any agent-side mechanism.

Four content items are already overdue for graduation per
`repo-continuity.md § Deep consolidation status`:

1. `inherited-framing-without-first-principles-check` pattern
   extraction to `.agent/memory/active/patterns/` — four instances
   logged.
2. Perturbation-mechanism bundle as a PDR + three lightweight
   artefacts (non-goal re-ratification, standing-decision register,
   first-principles metacognition prompt).
3. `practice.md` Artefact Map refresh to reflect the three-mode
   taxonomy.
4. Owner portability decision on the three-mode taxonomy (portable
   PDR vs host-local doctrine).

This plan executes all six sketches named in the strategic plan
(A–F) plus the doctrine work in (E). It is ordered by firing
cadence — mechanisms that fire frequently land first so they teach
quickly.

### Why execution now, not at original promotion trigger

The strategic plan's promotion trigger read: *second drift instance,
OR owner-direct, OR Sentry alpha-gate work lands.* Two of the three
have fired: the fourth pattern instance was a second concrete drift
signal (caught pre-code on 2026-04-21), and the owner commissioned
an execution plan directly on 2026-04-20. Per the owner-beats-plan
invariant in `repo-continuity.md`, execution supersedes deferral.
The Sentry alpha-gate lane continues to hold priority for
implementation capacity; this plan runs alongside rather than
blocking it.

---

## Design Principles

1. **Cadence-first ordering.** Phases are ordered by expected firing
   frequency. Register (every handoff) before drift detection
   (every executive lookup) before doctrine (once). Mechanisms only
   teach if they fire often enough for patterns to accumulate.
2. **Self-application of the graduating pattern.** Phase 0.1
   ratifies the three-plane taxonomy as a first-principles
   decision rather than inheriting it. The plan must not be the
   first case where `inherited-framing-without-first-principles-check`
   would have caught an error and did not.
3. **Doctrine follows artefact.** Every phase installs a concrete
   artefact or amends an existing one. Abstract doctrine (Phase 6)
   follows the operational mechanics (Phases 1–5) because rules
   without use cases stagnate.
4. **No new reviewer, no new ML, no new script unless unavoidable.**
   Existing reviewers and workflows are composed into richer
   loops, not replaced.
5. **Markdown-first, grep-compatible.** Every register, tag, and
   convention is a markdown structure a human can read and a
   simple script could scan.

### Non-Goals (YAGNI)

- ❌ New reviewer or specialist.
- ❌ Machine learning or ambient drift detection.
- ❌ Extending the three-plane memory taxonomy (the taxonomy is
  ratified in Phase 0.1; any future extension is a separate
  decision).
- ❌ Replacing `jc-consolidate-docs` as the graduation pathway;
  this plan composes it.
- ❌ Bypassing the owner in emergent-whole or graduation decisions.
- ❌ Automating doctrine landing; doctrine is owner-approved
  per PDR-003.

---

## Reviewer Scheduling (phase-aligned)

Per PDR-015 and the standard schedule:

- **Pre-execution (now, before Phase 0 runs)**: `assumptions-reviewer`
  (proportionality, self-application check, phase-alignment), plus
  `docs-adr-reviewer` (ADR/PDR impact surface). Reviewers fire
  against this plan's body before Phase 0 starts so solution-class
  drift is caught before any doctrine lands.
- **Mid-cycle**: `docs-adr-reviewer` after each phase that touches
  a doctrine surface (Phases 1, 2, 5, 6); `architecture-reviewer-barney`
  + `architecture-reviewer-betty` after Phase 3 (cross-plane paths
  are boundary changes).
- **Close**: `assumptions-reviewer`, `docs-adr-reviewer`,
  `release-readiness-reviewer`, `onboarding-reviewer` — see
  Phase 7.3.

---

## Foundation Document Commitment

Before Phase 0 and at the start of each phase:

1. Re-read `.agent/directives/principles.md` — core principles.
2. Re-read `.agent/directives/testing-strategy.md` — testing
   philosophy (*"tests prove product behaviour, not
   configuration"*).
3. Re-read `.agent/directives/schema-first-execution.md` — type
   generation flow.
4. Re-read `.agent/directives/metacognition.md` — reflection
   discipline at phase boundaries.
5. Re-read `.agent/directives/orientation.md` — layering contract.

Ask at each phase: *"Could it be simpler without compromising
quality?"*

---

## Build-vs-Buy Attestation

Not vendor-touching. All mechanisms are internal to the repo's
memory and Practice Core. No third-party services. Attestation not
required.

---

## Documentation Propagation Commitment

Before marking a phase complete:

- Update `docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md`
  if the mechanism extends the self-reinforcing loop described
  there (likely true for Phase 5 cross-plane scope).
- Update `.agent/practice-core/practice.md` if the Artefact Map
  or loop description changes (certain for Phase 1.3).
- Update `.agent/memory/README.md` if any plane's contract changes
  (possible for Phases 3 and 4).
- Update `.agent/memory/executive/README.md` if executive
  refresh discipline gains a drift-detection surface (certain for
  Phase 4).
- Record a `documentation-sync-log.md` entry for each phase (or
  an explicit no-change rationale).
- Run `/jc-consolidate-docs` at Phase 7.1 to graduate any settled
  content trapped in this plan.

---

## Phase 0 — Ratification (owner-gated)

**Foundation Check-In**: Re-read `principles.md § First Question`
and `metacognition.md`. Phase 0 is entirely a set of explicit
owner decisions; no code or doctrine changes until both sub-tasks
return.

### Task 0.1 — First-principles ratification of the three-plane frame

**Why this task exists**: The graduating pattern
`inherited-framing-without-first-principles-check` warns that
inherited frames must be ratified, not silently carried. This plan
operates on the three-plane memory taxonomy (landed 2026-04-20);
the plan must ratify that frame explicitly before building on it.

**Cadence**: one-time. The ratification either holds for the
foreseeable or surfaces a reframe; it does not fire repeatedly.

**Acceptance Criteria**:

1. ✅ Owner confirms (or amends) the three-plane taxonomy
   (`active/`, `operational/`, `executive/`) as the working frame.
2. ✅ If amended, the amendment is captured as an explicit decision
   recorded either as a PDR candidate (portable) or a `napkin.md`
   entry tagged `decision` (host-local) — whichever matches the
   Phase 0.2 outcome.
3. ✅ If confirmed, the confirmation is recorded in
   `.agent/memory/operational/repo-continuity.md § Standing
   decisions` (or the equivalent standing-decision register once
   Phase 1.2's perturbation bundle lands).

**Deterministic Validation**:

```bash
# 1. The confirmation (or amendment) is findable by grep
grep -n "three-plane.*ratified\|three-mode.*ratified\|taxonomy.*first-principles" \
  .agent/memory/operational/repo-continuity.md
# Expected: at least one matching line

# 2. If amended, the PDR or napkin entry exists
ls .agent/practice-core/decision-records/ .agent/memory/active/napkin.md
# Expected: the amendment is visible
```

**Task Complete When**: Owner has explicitly confirmed or amended
the frame and the record exists in one of the locations above.

---

### Task 0.2 — Portability decision on the three-plane taxonomy

**Why this task exists**: Phase 6 (doctrine landing) forks on
this answer. Portable → PDR in `practice-core/decision-records/`.
Host-local → doctrine file in this repo only, recorded so other
repos do not silently inherit the taxonomy by file-copy.

**Cadence**: one-time.

**Acceptance Criteria**:

1. ✅ Owner states portable-vs-host-local decision explicitly.
2. ✅ Decision is recorded in `repo-continuity.md § Standing
   decisions` OR as a new entry in the standing-decision register
   (Phase 1.2's artefact), whichever is available.
3. ✅ Phase 6 branch is now determinate.

**Deterministic Validation**:

```bash
# Decision is recorded
grep -n "portability.*three-plane\|three-plane.*portab\|three-mode.*portab" \
  .agent/memory/operational/repo-continuity.md .agent/practice-core/**/*.md
# Expected: matching line found
```

**Task Complete When**: Both the decision and its recording exist.

---

## Phase 1 — Graduate Overdue Content (Sketch F)

**Foundation Check-In**: Re-read
`.agent/commands/consolidate-docs.md` steps 5 and 7a. Pattern
extraction and PDR drafting follow this doctrine exactly.

**Why this phase exists**: Four items are already overdue per
`repo-continuity.md § Deep consolidation status`. Graduating them
is the plan's most concrete and lowest-risk first move. It does
not depend on any new mechanism.

### Task 1.1 — Extract `inherited-framing-without-first-principles-check` pattern

**Cadence**: one-time for this pattern; the *mechanism* (pattern
extraction via consolidate-docs) fires whenever the 3+ repeats
bar is hit. This pattern passed that bar with four instances.

**Changes**:

- New file: `.agent/memory/active/patterns/inherited-framing-without-first-principles-check.md`
  with frontmatter per `.agent/memory/active/patterns/README.md`
  (category, triggers, concrete instances linked to napkin
  entries).
- Napkin entries for the four instances gain
  `graduated_to: .agent/memory/active/patterns/inherited-framing-without-first-principles-check.md`
  references (in-place link, not deletion).
- `.agent/memory/operational/repo-continuity.md § Deep
  consolidation status` first outstanding item is marked ✅ and
  cross-referenced to the new pattern file.

**Acceptance Criteria**:

1. ✅ Pattern file exists with correct frontmatter and cites all
   four napkin instances by date.
2. ✅ `repo-continuity.md § Deep consolidation status` reflects
   the completion.
3. ✅ `docs-adr-reviewer` agrees the extraction meets the barrier
   and frontmatter schema.

**Deterministic Validation**:

```bash
# Pattern file exists
ls .agent/memory/active/patterns/inherited-framing-without-first-principles-check.md
# Expected: file found

# Frontmatter has required fields (per patterns/README.md)
head -20 .agent/memory/active/patterns/inherited-framing-without-first-principles-check.md

# Continuity surface reflects the graduation
grep -n "inherited-framing" .agent/memory/operational/repo-continuity.md
# Expected: graduated reference (not "overdue")
```

---

### Task 1.2 — Draft perturbation-mechanism bundle

**Cadence**: one-time for the bundle itself; each of the three
artefacts then has its own firing cadence (recorded in their
respective docs).

**Changes**:

- New PDR in `.agent/practice-core/decision-records/PDR-NNN-perturbation-mechanisms.md`
  that defines the bundle as Practice doctrine. Per PDR-019
  reusability test, this is PDR-shaped (re-derived across repos).
- Three lightweight artefacts, each a discrete file or directive
  section:
  - **Non-goal re-ratification ritual** — added to
    `session-handoff.md` or equivalent session-close surface as
    a step that re-reads plan non-goals against recent owner
    direction before accepting them.
  - **Standing-decision register** — new file at
    `.agent/memory/operational/standing-decisions.md` (or a
    named section inside `repo-continuity.md` — owner decides
    which shape is right).
  - **First-principles metacognition prompt** — added to
    `.agent/directives/metacognition.md` as a named question
    that fires at phase boundaries: *"What did I inherit here,
    and has anyone ratified it from first principles?"*

**Acceptance Criteria**:

1. ✅ PDR exists with rationale, bundle definition, and cross-
   references to the three artefacts.
2. ✅ Each of the three artefacts exists and is cross-linked from
   the PDR.
3. ✅ `repo-continuity.md § Deep consolidation status` second
   outstanding item is marked ✅.
4. ✅ Owner has approved the PDR per PDR-003 (care-and-consult
   on Core edits).

**Deterministic Validation**:

```bash
# PDR exists
ls .agent/practice-core/decision-records/PDR-*-perturbation-mechanisms.md
# Expected: single PDR file

# Three artefacts exist or are cited
grep -l "non-goal re-ratification\|standing-decision register\|first-principles.*prompt" \
  .agent/directives/ .agent/memory/operational/ .agent/commands/
# Expected: each artefact named in at least one file

# Continuity surface reflects the graduation
grep -n "perturbation-mechanism.*bundle" .agent/memory/operational/repo-continuity.md
# Expected: graduated reference (not "outstanding")
```

---

### Task 1.3 — Refresh `practice.md` Artefact Map

**Cadence**: one-time refresh; the map as a whole refreshes on
any memory-structure change.

**Changes**:

- `.agent/practice-core/practice.md § Artefact Map` (or
  equivalent section) updates the description of `.agent/memory/`
  from a single surface to three modes with distinct cadences,
  referencing `.agent/memory/README.md`.
- Practice Core `CHANGELOG.md` records the amendment.

**Acceptance Criteria**:

1. ✅ Artefact Map describes the three modes by name and read
   trigger.
2. ✅ CHANGELOG entry recorded per PDR-003.
3. ✅ Owner has approved the edit.

**Deterministic Validation**:

```bash
# Artefact map describes the three modes
grep -n "active/.*operational/.*executive/\|three-mode" .agent/practice-core/practice.md
# Expected: at least one matching line naming all three modes

# Changelog entry exists
tail -20 .agent/practice-core/CHANGELOG.md
# Expected: recent entry mentioning Artefact Map refresh
```

---

## Phase 2 — Pending-Graduations Register (Sketch D)

**Foundation Check-In**: Re-read `principles.md § First Question`
and `schema-first-execution.md § Expectations`. The register is a
structured markdown surface; its schema should be explicit and
grep-compatible.

**Why this phase exists**: `repo-continuity.md § Deep consolidation
status` is already a structured four-item list, but the entry
schema is informal. Formalising the schema and binding it to
session workflows closes the loop between capture and graduation.

### Task 2.1 — Formalise the pending-graduations schema

**Cadence**: the *register* fires every session-handoff (add new
items) and every `jc-consolidate-docs` (close items). Formalisation
is one-time; the register fires thereafter.

**Changes**:

- `.agent/memory/operational/repo-continuity.md § Deep
  consolidation status` is rewritten from prose-plus-bullet-list
  to a structured list with explicit fields per entry:
  - `captured-date` (YYYY-MM-DD)
  - `source-surface` (e.g. `napkin`, `distilled`, `workstream brief`, `executive surface`)
  - `graduation-target` (one of: `pattern | PDR | ADR | rule | practice-md | other`)
  - `trigger-condition` (a concrete signal that should move it to "due")
  - `status` (one of: `pending | due | overdue | graduated`)
- The schema is documented once at the top of the section so future
  sessions can add entries mechanically.

**Acceptance Criteria**:

1. ✅ The four existing items are recast into the new schema
   without losing information.
2. ✅ The schema is documented in-line at the top of the section.
3. ✅ An entry's four fields are greppable by field name.

**Deterministic Validation**:

```bash
# Schema fields are present
grep -n "captured-date\|source-surface\|graduation-target\|trigger-condition" \
  .agent/memory/operational/repo-continuity.md
# Expected: at least four matching lines (one per field name)

# Existing four items still present
grep -c "status:" .agent/memory/operational/repo-continuity.md
# Expected: ≥4 entries
```

---

### Task 2.2 — Bind the register to session workflows

**Cadence**: every session-handoff (write); every
jc-consolidate-docs (close-or-defer).

**Changes**:

- `.agent/commands/session-handoff.md` gains a step: *"Review the
  pending-graduations register in `repo-continuity.md §
  Deep consolidation status`. Add any new items captured this
  session (new napkin entries meeting graduation criteria, stale
  executive surfaces noted, etc.) using the documented schema."*
- `.agent/commands/consolidate-docs.md` step 7 preamble gains:
  *"Before applying graduation rules below, read the pending-
  graduations register in `repo-continuity.md`. Any item marked
  `due` or `overdue` lands in this pass or is explicitly deferred
  with a new trigger-condition."*

**Acceptance Criteria**:

1. ✅ `session-handoff.md` step exists.
2. ✅ `consolidate-docs.md` step 7 preamble mentions the register
   by name.
3. ✅ At least one end-to-end rehearsal (even a dry-run) confirms
   the register is actually read at both triggers.

**Deterministic Validation**:

```bash
# Session-handoff step exists
grep -n "pending-graduations register\|Deep consolidation status" \
  .agent/commands/session-handoff.md
# Expected: matching step

# Consolidate-docs preamble exists
grep -n "pending-graduations register" .agent/commands/consolidate-docs.md
# Expected: matching preamble
```

---

## Phase 3 — Cross-Plane Paths (Sketch B)

**Foundation Check-In**: Re-read `memory/README.md § Authority
Order` and `directives/orientation.md § layering contract`. New
paths must respect plane authority.

**Why this phase exists**: Two cross-plane paths are missing
(`active → executive`, `executive → anywhere`) and one is new
(`operational → executive`). Without these, observations stay
trapped in their originating plane.

### Task 3.1 — `active → executive` path as a rule

**Cadence**: fires whenever a napkin entry reveals an executive
surface needs updating (estimated: once every few sessions).

**Changes**:

- New rule at `.agent/rules/executive-memory-drift-capture.md` that
  operationalises the path: *"When a napkin entry or distilled
  entry identifies an executive-memory surface (`artefact-inventory`,
  `invoke-code-reviewers`, `cross-platform-agent-surface-matrix`)
  as stale, inaccurate, or one-behind-reality, add a pending-
  graduations register entry with source-surface: executive and
  trigger-condition: `next consolidate-docs pass or when surface
  is next consulted, whichever comes first`."*
- The rule is cited by `.agent/directives/AGENT.md` or equivalent
  rule-discovery path so agents encounter it.

**Acceptance Criteria**:

1. ✅ Rule file exists and is cross-linked.
2. ✅ Rule cites ADR-131 and the Executive-Memory Feedback Loop
   doctrine landing in Phase 6.
3. ✅ `docs-adr-reviewer` agrees the rule is well-formed and cites
   its establishing ADRs/PDRs.

**Deterministic Validation**:

```bash
ls .agent/rules/executive-memory-drift-capture.md
grep -n "ADR-131\|PDR-" .agent/rules/executive-memory-drift-capture.md
```

---

### Task 3.2 — `operational → executive` watchlist tag

**Cadence**: fires whenever a workstream-brief `Promotion watchlist`
item concerns executive memory.

**Changes**:

- Workstream-brief template (if any) and the README that governs
  `.agent/memory/operational/workstreams/` gain a note: *"Promotion
  watchlist items that concern an executive-memory surface are
  tagged `executive-impact:` and route into the drift-detection
  surface at session close (see `.agent/rules/executive-memory-drift-capture.md`)."*

**Acceptance Criteria**:

1. ✅ Workstream template or governing README documents the tag.
2. ✅ At least one existing workstream brief is retrofitted if
   appropriate (optional; observational).

**Deterministic Validation**:

```bash
grep -n "executive-impact" \
  .agent/memory/operational/workstreams/ \
  .agent/commands/session-handoff.md
# Expected: matching lines
```

---

### Task 3.3 — `executive → anywhere` via napkin tag

**Cadence**: fires whenever someone consulting an executive surface
notices drift (estimated: a few times per quarter).

**Changes**:

- Napkin convention documented at
  `.agent/memory/active/napkin.md` header (or `README.md` of
  `active/`): *"Entries originating from a stale/drifted executive
  surface are tagged `Source plane: executive` so consolidation
  step 7 can aggregate them."*
- `consolidate-docs.md` step 7a gains an explicit bullet for
  aggregating `Source plane: executive` napkin entries into the
  pending-graduations register if not already present.

**Acceptance Criteria**:

1. ✅ Napkin convention documented.
2. ✅ Consolidate-docs step 7a references the tag.

**Deterministic Validation**:

```bash
grep -n "Source plane: executive" \
  .agent/memory/active/napkin.md \
  .agent/memory/active/README.md \
  .agent/commands/consolidate-docs.md
# Expected: at least two matches (convention + step reference)
```

---

## Phase 4 — Executive-Memory Drift Detection (Sketch A)

**Foundation Check-In**: Re-read `memory/executive/README.md`.

**Why this phase exists**: Executive memory has three lookup
surfaces with no drift-detection discipline. When a session
consults a surface and finds it stale, there is no standard
recording move.

### Task 4.1 — Add `last-verified` field to each executive surface

**Cadence**: fires on every executive-surface lookup (estimated
multiple times per session, often passively).

**Changes**:

Each of the following files gets a new short section near the top:

- `.agent/memory/executive/artefact-inventory.md`
- `.agent/memory/executive/invoke-code-reviewers.md`
- `.agent/memory/executive/cross-platform-agent-surface-matrix.md`

Section content:

```markdown
## Drift Detection

**Last verified accurate**: YYYY-MM-DD

### Known drift / pending update

- [no entries]
```

On each lookup, the consulting session either confirms or edits
the date and/or adds a `Known drift` bullet with a trigger-
condition for the pending-graduations register.

**Acceptance Criteria**:

1. ✅ All three files have the new section.
2. ✅ Each file has its initial `Last verified accurate` date set
   (2026-04-20 unless owner specifies otherwise).
3. ✅ `memory/executive/README.md` is amended to describe the
   drift-detection discipline as the loop back into active/
   memory.

**Deterministic Validation**:

```bash
for f in .agent/memory/executive/artefact-inventory.md \
         .agent/memory/executive/invoke-code-reviewers.md \
         .agent/memory/executive/cross-platform-agent-surface-matrix.md; do
  grep -q "Last verified accurate" "$f" || echo "MISSING: $f"
done
# Expected: no output (all files have the field)
```

---

### Task 4.2 — Executive README amendment

**Cadence**: one-time.

**Changes**:

- `.agent/memory/executive/README.md` gains a "Drift Detection"
  subsection describing the `Last verified accurate` + `Known
  drift` convention and linking to the Phase 6 doctrine PDR.
- The `Refresh Discipline` section is amended: the existing claim
  (*"Executive memory is not refreshed per session"*) is
  preserved, but a sentence is added: *"However, drift is
  recorded per-surface at lookup time; see Drift Detection
  below."*

**Acceptance Criteria**:

1. ✅ README has a Drift Detection subsection.
2. ✅ Refresh Discipline section reconciles lookup-time drift
   capture with non-per-session refresh.

**Deterministic Validation**:

```bash
grep -n "Drift Detection" .agent/memory/executive/README.md
grep -n "drift is recorded per-surface" .agent/memory/executive/README.md
```

---

## Phase 5 — Emergent-Whole Observation (Sketch C, minimal form)

**Foundation Check-In**: Re-read `consolidate-docs.md` step 5
and `patterns/cross-session-pattern-emergence.md`.

**Why this phase exists**: The cross-session emergence question
already exists at consolidate-docs step 5. The missing scope is
cross-*plane*. This is a sentence-level addition, not a new
mechanism.

### Task 5.1 — Extend consolidate-docs step 5 with cross-plane scope

**Cadence**: fires at every `jc-consolidate-docs` invocation
(estimated: per significant session / milestone close).

**Changes**:

- `.agent/commands/consolidate-docs.md` step 5 "cross-session
  scan" paragraph gains a parallel sentence: *"Also ask across
  the three memory planes: what did `active/`, `operational/`,
  and `executive/` observe this session that only becomes
  visible when read together? Cross-plane patterns — contradictions,
  redundancies, liminal observations that no single plane owns —
  are candidates for graduation just as cross-session patterns
  are."*
- Step 5's instruction to extract patterns to
  `.agent/memory/active/patterns/` is extended: *"Cross-plane
  patterns land in the existing patterns directory. Tag the
  frontmatter with `cross_plane: true` for discoverability."*

**Acceptance Criteria**:

1. ✅ Step 5 paragraph extended with the cross-plane question.
2. ✅ Pattern frontmatter documents the new `cross_plane` field.
3. ✅ At least one existing pattern is scanned for cross-plane
   character and re-tagged if applicable (the
   `cross-session-pattern-emergence.md` pattern is itself a
   candidate).

**Deterministic Validation**:

```bash
grep -n "cross-plane\|three memory planes" \
  .agent/commands/consolidate-docs.md
# Expected: at least one matching line in step 5

grep -rn "cross_plane" .agent/memory/active/patterns/
# Expected: at least one pattern tagged cross_plane: true
```

---

### Task 5.2 — Napkin `cross-plane` tag convention

**Cadence**: fires at napkin-entry time whenever an observation
spans two or more planes.

**Changes**:

- Napkin header (or active/README.md) documents the convention:
  napkin entries that span two or more memory planes or whose
  observation is about the memory system itself get a
  `tags: cross-plane` line. The consolidation step 5 cross-plane
  scan aggregates these for owner review.

**Acceptance Criteria**:

1. ✅ Convention documented.
2. ✅ Consolidate-docs step 5 references the tag as an input.

**Deterministic Validation**:

```bash
grep -n "cross-plane" .agent/memory/active/napkin.md \
  .agent/memory/active/README.md .agent/commands/consolidate-docs.md
# Expected: ≥3 matches
```

---

## Phase 6 — Doctrine Landing (Sketch E)

**Foundation Check-In**: Re-read `principles.md § Architectural
Excellence` and PDR-003 (care-and-consult on Core edits).

**Why this phase exists**: The mechanisms installed in Phases 1–5
operationalise a doctrine that does not yet exist by name:
executive memory has feedback loops. Phase 6 names it.

**Phase 6 branch depends on Phase 0.2 outcome**:

- If Phase 0.2 said **portable**: draft a PDR.
- If Phase 0.2 said **host-local**: draft a doctrine file in
  `.agent/doctrine/` or `docs/governance/` and record explicitly
  in `repo-continuity.md` that the doctrine is host-local.

### Task 6.1 — Executive-Memory Feedback Loop doctrine

**Cadence**: one-time; amended when loop mechanisms change.

**Changes** (portable branch):

- New PDR at `.agent/practice-core/decision-records/PDR-NNN-executive-memory-feedback-loop.md`.
  Content: rationale (executive memory as write-once catalogue is
  a loop gap); loop definition (drift-detection surface →
  graduation channel via pending-graduations register → ordinary
  capture-distil-graduate); citations to ADR-131 and the three-
  mode memory README.

**Changes** (host-local branch):

- New doctrine file at
  `.agent/reference/agentic-engineering/executive-memory-feedback-loop.md`
  with equivalent content plus an explicit note: *"host-local
  doctrine; three-mode taxonomy is host-local per standing
  decision YYYY-MM-DD."*

**Acceptance Criteria**:

1. ✅ The doctrine exists in the branch-appropriate location.
2. ✅ Citations to ADR-131, the memory README, and the
   pending-graduations register are present.
3. ✅ Owner has approved the doctrine per PDR-003.
4. ✅ `repo-continuity.md § Standing decisions` records the
   portability decision referenced by the doctrine.

**Deterministic Validation**:

```bash
# At least one of the two branches is present
ls .agent/practice-core/decision-records/PDR-*-executive-memory-feedback-loop.md \
   .agent/reference/agentic-engineering/executive-memory-feedback-loop.md 2>&1 | \
  grep -v "No such file"
# Expected: exactly one of the two paths exists
```

---

### Task 6.2 — ADR-131 cross-reference

**Cadence**: one-time.

**Changes**:

- `docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md`
  gains a cross-reference to the Phase 6.1 doctrine in its
  §Interaction Points (or the equivalent) — acknowledging that
  the self-reinforcing loop now reaches across all three memory
  planes.
- If Phase 5's cross-plane scope addition to `consolidate-docs`
  is substantive enough to count as an extension of ADR-131,
  the ADR is amended to cite the extension.

**Acceptance Criteria**:

1. ✅ ADR-131 cross-references the Phase 6.1 doctrine.
2. ✅ Any amendment passes `docs-adr-reviewer`.

**Deterministic Validation**:

```bash
grep -n "executive-memory-feedback-loop\|executive memory.*loop" \
  docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md
```

---

## Phase 7 — Validation and Learning Loop

**Foundation Check-In**: Re-read all three foundation documents
and `.agent/directives/metacognition.md`.

### Task 7.1 — Run the consolidation pass

**Cadence**: one-time here; the consolidation mechanism fires on
every `jc-consolidate-docs` invocation thereafter.

**Actions**:

- Run `/jc-consolidate-docs`. The pass should graduate any
  content that entered the pending-graduations register during
  Phases 1–6 and verify all four originally-overdue items are
  now closed.

**Acceptance Criteria**:

1. ✅ No item in `repo-continuity.md § Deep consolidation status`
   is marked `overdue` at the end of this task.
2. ✅ The consolidation pass's step 5 cross-plane scan runs and
   produces either "nothing qualifies this pass" or candidates
   for owner review.
3. ✅ `documentation-sync-log.md` has an entry per phase (or a
   no-change rationale).

**Deterministic Validation**:

```bash
# No items marked overdue
grep -c "status: overdue" .agent/memory/operational/repo-continuity.md
# Expected: 0

# Sync log has entries for each phase
grep -c "memory-feedback-and-emergent-learning" \
  .agent/plans/agentic-engineering-enhancements/documentation-sync-log.md
# Expected: ≥1
```

---

### Task 7.2 — Fitness gates

**Cadence**: fires on every commit boundary (via pre-commit hooks)
and every consolidation close.

**Actions**:

```bash
pnpm practice:fitness --strict-hard
pnpm markdownlint:root
pnpm format:root
```

**Acceptance Criteria**:

1. ✅ All three commands exit 0.
2. ✅ No file is in the `hard` or `critical` fitness zone after
   this plan's edits. Any file in `soft` has an explicit comment
   noting the reason (temporary during a phase; long-term
   acceptable; scheduled for split).

**Deterministic Validation**: the above commands exit 0.

---

### Task 7.3 — Adversarial review

**Cadence**: one-time for this plan; the mechanism (adversarial
review at phase close) fires at every plan close.

**Actions**:

Dispatch in parallel:

- `assumptions-reviewer` — has proportionality held across all
  seven phases? Are any non-goals suspect in hindsight?
- `docs-adr-reviewer` — do all new/amended rules, PDRs, and
  ADR references cite their establishing doctrine correctly?
- `architecture-reviewer-barney` — are the new cross-plane paths
  well-placed at the right boundaries?
- `architecture-reviewer-betty` — what is the long-term
  change-cost of the new loops? Where will the next reframing
  pressure come from?
- `release-readiness-reviewer` — GO / GO-WITH-CONDITIONS /
  NO-GO for closing this plan.
- `onboarding-reviewer` — do the new conventions (tags,
  register schema, drift-detection surfaces) appear in the
  onboarding paths a new contributor would follow?

**Acceptance Criteria**:

1. ✅ All six reviewers run.
2. ✅ Every BLOCKER finding is resolved or escalated to a
   follow-up plan before Task 7.4.
3. ✅ Every non-BLOCKER finding is either resolved or captured
   in the pending-graduations register with a trigger-condition.

---

### Task 7.4 — Update roadmap; run the learning loop

**Cadence**: one-time.

**Actions**:

- Update `.agent/plans/agentic-engineering-enhancements/roadmap.md`
  to mark this plan ✅ complete (or 🔄 active if the work is
  still mid-execution when the roadmap is updated).
- Move this execution plan from `current/` to `active/` at start
  of work, and to `archive/completed/` at close per ADR-117.
- Record the plan's outcomes in
  `documentation-sync-log.md`.
- Extract anything from this plan that became settled doctrine
  into permanent docs (it should already be so, given Phase 6;
  this is a verification step, not a move).
- Surface any pattern candidates that emerged during execution to
  the owner for Phase-7 consolidation.

**Acceptance Criteria**:

1. ✅ Roadmap reflects the plan's current status.
2. ✅ Plan file lifecycle matches ADR-117 expectations at close.
3. ✅ `documentation-sync-log.md` records the plan's landing.
4. ✅ `/jc-consolidate-docs` runs cleanly and surfaces nothing
   load-bearing that was missed.

**Deterministic Validation**:

```bash
grep -n "memory-feedback-and-emergent-learning" \
  .agent/plans/agentic-engineering-enhancements/roadmap.md
# Expected: matching line reflecting current status

ls .agent/plans/agentic-engineering-enhancements/archive/completed/memory-feedback-*
# Expected (at plan close): archived file exists
```

---

## Risk Assessment

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Mechanism-design becomes its own drift source | Adding markdown structures without use yields dead surface area | Every phase installs only what has a named firing cadence; register + tags are grep-compatible, not bespoke schema |
| Cross-plane paths duplicate existing pathways | Phase 3 could re-invent the reviewer-rule pattern | Phase 3 tasks explicitly cite the rule-based pattern and ADR-131; audit pass in Task 7.3 catches duplication |
| Three-plane frame is wrong and this plan ossifies it | Inheriting a bad shape with ceremony makes it harder to change | Phase 0.1 ratifies from first principles; if owner amends the frame, all downstream phases rebase before continuing |
| Portability decision is deferred indefinitely | Phase 6 cannot land without it | Phase 0.2 is explicit and owner-gated; the plan cannot reach Phase 6 otherwise — this is the correct coupling |
| Pending-graduations register becomes a todo list nobody reads | Adds surface area without closing the loop | Task 2.2 binds the register to `session-handoff` (write) and `jc-consolidate-docs` (close); the register is touched every session |
| Inherited-framing pattern would have caught this plan, and didn't | Self-reference failure | Phase 0.1 is exactly this self-application; the plan's existence does not excuse it from its own test |
| Sentry alpha-gate work gets disrupted | Capacity collision | Phase 1 is pure consolidation (low context switch); Phases 2–6 are small edits that can be scheduled around Sentry work; Phase 7 close is the only concentration point |
| Doctrine drift between PDR and host-local path | If Phase 0.2 shifts after Phase 6 lands | Phase 6 doctrine is final only after owner approval per PDR-003; before approval, all Phase 6 work is draft — shifting Phase 0.2 re-opens Phase 6 |

---

## Testing Strategy

This plan is infrastructure work on persistent memory surfaces
and doctrine. It does not generate runtime code.

### Unit tests

None. The mechanisms are markdown conventions and cross-references.

### Integration tests

None. There is no integration point to test — the "tests" are the
deterministic-validation grep commands in each task.

### Validation approach

Each task has `Deterministic Validation` commands that prove the
artefact exists and contains the expected markers. These are not
tests in the testing-strategy sense; they are boundary checks
against the markdown-as-contract surfaces this plan installs.

Per `testing-strategy.md`: *tests prove product behaviour, not
configuration*. This plan installs configuration (doctrine), so
the proof surface is the configuration's presence, not behaviour.
The behavioural proof — that the loops actually teach — only
accrues over time as the mechanisms fire. Phase 7 Task 7.1's
`jc-consolidate-docs` run is the first observation of that.

---

## Foundation Alignment

| Principle | How this plan honours it |
| --- | --- |
| First Question (could it be simpler?) | Phase 5 collapses to a two-line addition; Phase 2 reuses the existing structured list; Phase 3 reuses the rule-based path pattern |
| Strict and complete | Phase 0.1 ratifies the inherited frame rather than accepting it silently |
| No compatibility layers | Existing surfaces (napkin, repo-continuity, consolidate-docs) are amended in place, not wrapped |
| TDD at all levels | Not applicable — no runtime code generated. Validation commands stand in for post-condition checks |
| Fail fast | Every phase has explicit owner-gated or validation-gated checkpoints |
| Documentation propagation | Explicit step in every phase; dedicated Task 7.1 run for catch-all |
| PDR-003 care-and-consult | Every Core-touching edit requires owner approval before landing |
| PDR-015 reviewer dispatch | Task 7.3 dispatches the full adversarial slate at close |
| Cadence-first | Every Acceptance Criteria names expected firing cadence |

---

## Dependencies

**Blocking** (internal to this plan):

- Phase 0.1 and 0.2 block Phase 6.
- Phase 1.2 (standing-decision register artefact) is cited by
  Phase 0 recording paths; if Phase 1.2 lands first, 0.1/0.2
  records may be written directly into the new register.
- Phase 2.2 (session-handoff/consolidate-docs binding) should land
  before or alongside Phase 3 so that the paths have somewhere to
  route into.

**Not blocking**:

- Sentry alpha-gate work (separate branch; runs in parallel).
- Any other `current/` plan in this collection.

**Related plans**:

- [`../future/memory-feedback-and-emergent-learning-mechanisms.plan.md`](../future/memory-feedback-and-emergent-learning-mechanisms.plan.md)
  — strategic source; this execution plan is its operational
  consequence.
- [`../future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md`](../future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md)
  — first- and second-pass reflection; shaped this plan's
  cadence-ordering and self-application.
- [`../future/operating-model-mechanism-taxonomy.plan.md`](../future/operating-model-mechanism-taxonomy.plan.md)
  — adjacent mechanism-naming work; vocabulary may converge after
  this plan lands.
- [`../future/graphify-and-graph-memory-exploration.plan.md`](../future/graphify-and-graph-memory-exploration.plan.md)
  — relevant if cross-plane redundancy detection later needs a
  graph query surface.

**Prerequisites (met)**:

- ✅ Three-mode memory taxonomy landed 2026-04-20.
- ✅ PDR-026 landing-commitment + orientation directive installed.
- ✅ Pending-graduations content already structured in
  `repo-continuity.md § Deep consolidation status`.
- ✅ Four pattern instances logged; pattern graduation-overdue.

---

## Success Criteria (overall)

- ✅ All four items in `repo-continuity.md § Deep consolidation
  status` are marked `graduated`.
- ✅ Three executive-memory surfaces carry drift-detection
  sections with `Last verified accurate` dates.
- ✅ Three cross-plane paths exist as rules, tags, or documented
  conventions.
- ✅ `jc-consolidate-docs` step 5 asks the cross-plane question
  at every invocation.
- ✅ Executive-Memory Feedback Loop doctrine exists in the
  branch-appropriate location (portable PDR or host-local
  doctrine file) per Phase 0.2.
- ✅ The three-plane memory taxonomy is ratified from first
  principles, not inherited.
- ✅ Every installed mechanism has a named firing cadence that
  makes it teach-rate sufficient.
- ✅ All quality gates pass (`pnpm practice:fitness --strict-hard`,
  `markdownlint:root`, `format:root`).
- ✅ Task 7.3 adversarial review returns no unresolved BLOCKERs.

---

## Consolidation

After Phase 7 completes and all quality gates pass, run
`/jc-consolidate-docs`. Mine any patterns that emerged during
execution into `.agent/memory/active/patterns/`. Update
`documentation-sync-log.md`. Move this plan to
`archive/completed/` per ADR-117.

---

## Future Enhancements (explicitly out of scope)

- Cross-plane redundancy detection as a graph query (covered by
  `future/graphify-and-graph-memory-exploration.plan.md`).
- Automated drift detection via a scheduled script (low-value
  given current cadence; revisit if lookup-time recording proves
  insufficient over two consolidation cycles).
- Extending the memory taxonomy beyond three planes (ruled out by
  Phase 0.1's ratification scope; any future extension is a
  separate decision).
