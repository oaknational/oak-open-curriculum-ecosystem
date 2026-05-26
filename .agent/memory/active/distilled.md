---
fitness_line_target: 120
fitness_line_limit: 180
fitness_char_limit: 12000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
merge_class: curated-learning-register
fitness_content_role: drainable-buffer
fitness_rationale: >-
  Lowered 2026-05-25 after owner-requested `distilled.md` processing through
  `oak-consolidate-docs`: the 2026-05-14 multi-agent deep-dive and 2026-05-17
  gate-stack entries graduated to permanent behavioural homes. The active file
  now carries only the conservation role, graduation pointers, and held
  validation entries; the larger 2026-05-17 envelope has served its purpose.
  Falsifiability: if future napkin rotations add high-signal learning that has
  no stable permanent home, preserve it first and revise the envelope by
  substance rather than trimming the lesson.
---

# Distilled Learnings

Refined cross-session learning extracted from session capture. Read this
before every session. Every entry earned its place by changing behaviour and
has not yet reached, or no longer needs, a more permanent home.

**Source**: Distilled from archived napkins
`napkin-2026-02-16.md` through `napkin-2026-05-10.md`
(sessions 2026-02-10 to 2026-05-10).

**Knowledge-conservation role**: `napkin.md` captures session observations;
this file conserves behaviour-changing lessons across sessions while they
ripen; permanent docs, ADRs, PDRs, rules, and patterns take over when the
lesson is stable and has a natural enforcement or reference home. Always
graduate useful understanding — fitness management handles the consequences.
What remains here is repo/domain-specific context with no natural permanent
home, plus entries explicitly held pending validation.

**Earlier graduations audit-trail archived (2026-05-22)**: the
2026-05-06, 2026-05-09 (Woodland Sheltering Glade), 2026-05-10
(Quiet Lurking Mask), and 2026-05-11 (Verdict-not-menu Flamebright
Burning Lava) graduation blocks moved to
[`archive/distilled-graduations-log-2026-05-14.md`](archive/distilled-graduations-log-2026-05-14.md)
§ "Backfill rotation 2026-05-22 — earlier graduations blocks moved
from distilled.md". Substance lives at named permanent homes
(PDR-057, PDR-058, PDR-018 amendment, PDR-026 amendment,
`agent-collaboration.md` directive amendments,
`.agent/rules/present-verdicts-not-menus.md`,
`.agent/rules/practice-core-portability.md`,
`.agent/rules/directive-file-context-budget.md`,
`.agent/rules/validators-must-recompute-not-just-record.md`,
`.agent/rules/re-apply-first-question-at-elaboration-boundaries.md`,
`.agent/rules/no-moving-targets-in-permanent-docs.md`,
`docs/governance/development-practice.md` § Documentation Practice,
`.agent/memory/operational/collaboration-state-lifecycle.md`).

**Meta-observation (2026-05-09 historical-napkin-synthesis)**: the
fitness-as-trim impulse is doctrine-resistant under context
pressure. Three independent corrections in 2026-05-06 → 2026-05-09
on the same shape — agents reflexively trimming substance when
fitness signals fire. Two structural cures captured as
pending-graduations entries: lifecycle-aware fitness model and
active inline discipline-reminder text in fitness-validator output
at non-healthy zones. Source: §F1 of the synthesis report under
`research/agentic-engineering/continuity-memory-and-knowledge-flow/`.

**Verified distilled homes archived (2026-05-24)**: Phase 3 of the
memory-surface critical-drain plan removed entries whose durable homes were
verified first. Audit trail lives in
[`archive/distilled-graduations-log-2026-05-14.md`](archive/distilled-graduations-log-2026-05-14.md)
§ "Backfill rotation 2026-05-24 — verified distilled homes".

**Verified distilled homes archived (2026-05-25)**: the gate-stack
diagnostic lesson and 2026-05-14 coordination / commit / continuation
lessons graduated to
[`gates/SKILL-CANONICAL.md`](../../skills/gates/SKILL-CANONICAL.md)
and related team, commit, CLI, continuity, and agent-entry surfaces.
Audit trail lives in
[`archive/distilled-graduations-log-2026-05-14.md`](archive/distilled-graduations-log-2026-05-14.md)
§ "Backfill rotation 2026-05-25 — distilled processing pass".

---

## Reviewer-derived session sizing is not session sizing

**Captured 2026-05-26** — Open Streaming Updraft Phase 0A + 0B Cycle 1 session.

When a reviewer estimates the session-shape of remaining work, that estimate
is typically derived from owned-surface file counts or touch-point counts.
File-count is not cycle-count. Most touch points are mechanical translations
of a small number of structural moves (a single schema split surfaces all
identity-construction sites at compile time; a single discriminated union
narrows all routing comparators by construction).

Before baking a reviewer's session estimate into permanent plan-body
doctrine, stress-test it with explicit TDD-cycle enumeration: list each
red→green pair, count the substantive product changes, distinguish
mechanical follow-on from substantive cycle. The realistic count is often
substantially smaller than the file-touch count suggests.

**Failure mode**: accepting reviewer estimates as gospel produces conservative
session-partitioning that paying gate-and-context-warmup tax across more
sessions than the work shape requires.

**Worked instance**: 2026-05-26, the
`collaboration-identity-doctrine-enforcement-remediation` plan accepted
assumptions-expert's "Phase 0A/0B/0C are each session-sized" framing,
derived from 13+4+2 owned-surface files for Phase 0B and 7+ for Phase 0C.
Owner challenged the assumption mid-session via `/oak-metacognition`.
First-principles decomposition showed ~4 cycles for 0B and ~5 cycles for
0C (~10 cycles total, one focused implementer session for both). Plan body
was corrected at `3ca77972`; Phase 0A + Phase 0B Cycle 1 landed in the same
session as the metacognition correction. Doctrine: cycle-decomposition is
the authoritative sizing proxy; file-counts are at best a ceiling.

**Routing**: if a second worked-instance occurs, graduate to a rule or PDR
amendment under planning-discipline. Until then, this lesson lives here as
session-readable cross-session guidance.

---

## Reviewer "follow-on cycle" verdicts are information, not authority

**Captured 2026-05-26** — Airy Whirling Current Phase 0C Cycles 9+10+11
session.

When a code-expert or type-expert review returns a finding marked
"follow-on cycle" or "not blocking, queue for later", that verdict is
INFORMATION about the reviewer's scope assumptions, not AUTHORITY over
the implementer's landing decision. Reviewers see the diff in isolation;
the implementer sees the cure surface in full.

Before deferring a "follow-on" finding, apply this test: **"Does landing
this finding NOW complete the same cure I am claiming to deliver in this
session?"** If yes, land it as part of the same arc — the reviewer's
verdict is shaping by what they were asked to look at, not by what
architectural completeness requires.

**Failure mode**: authority-deference. Accepting reviewer-deferral
verdicts without first-principles check leaves type-safety holes, brand
drops, or invariant gaps inside the claimed cure. The next session
inherits a "completed" surface that still has the failure mode the cure
was supposed to close.

**Worked instance**: 2026-05-26, the Phase 0C cycle 9+10 reviewer
dispatch returned type-expert flagging the brand-drop at
`createDirectedCommsMessage` with verdict "follow-on cycle". Deferred
citing reviewer guidance + plan-scope locking. Owner Q2 ("why has
anything been deferred?") surfaced the authority-deference. The change
was small, completed the same routing-cure surface, and matched the
architectural-excellence directive. Landed as Cycle 11 (`597b0945`)
within the same session.

**Routing**: if a second worked-instance occurs, graduate to a rule
under reviewer-dispatch discipline (e.g. `reviewer-verdicts-are-information-not-authority`).
Until then, this lesson lives here as session-readable cross-session
guidance. Related but distinct from `no-analysis-responsibility-passback`
and `reviewer-briefs-respect-decided-scope` user-memory entries — both
deal with what reviewers should NOT be asked to do; this lesson deals
with how to absorb what reviewers DO return.

---

## Structural cure delivered ≠ operationally exercised cure

**Captured 2026-05-26** — Airy Whirling Current Phase 0C Cycles 9+10+11
session.

When claiming "measurable value delivered" for a behavioural-cure
landing, distinguish STRUCTURAL evidence from OPERATIONAL evidence.
Tests + types proving the cure at the code boundary are STRUCTURAL.
The cure actually preventing the named failure mode in real production
use is OPERATIONAL. The first does not imply the second.

For inter-agent or multi-system cures, operational evidence often
requires an arranged scenario (two-same-name peers running concurrently;
two services with overlapping configuration; etc.) that the
implementer alone cannot manufacture — it requires owner orchestration
or a real-world incident.

**Failure mode**: framing structural completion as operational success.
Subsequent agents inherit the impression that "the failure mode is
gone" when it has only been "made unreachable in code"; the first
operational test may surface adjacent gaps (e.g. legacy data on disk
still cross-kind-fails; the cure protects new writes but not stored
state).

**Worked instance**: 2026-05-26, Owner Q1 ("is the measurable value of
Phase 0 delivered?") forced honest separation: 707 tests prove the
PDR-076a cure structurally; no inter-agent comms event was sent through
the new `--to-id` path in the same session that landed it. The
operational proof is pending. The honest framing surfaced an adjacent
gap: legacy events already on disk still classify as `observed` rather
than `directed` post-cure (not a regression — those events were never
routable by id — but the cure does not retroactively rescue them).

**Routing**: this is closeout-framing discipline, not architectural
doctrine. Lives here until a recurring pattern of "claimed
operationally / proven structurally only" gaps surfaces in continuity
audits.

---

## Held Pending Validation

### Hypothesis-Layer Routing for Multi-Agent Cures → `hypothesis.md` family

Multi-agent collaboration cures route through the hypothesis layer
before graduating to doctrine. Substance lives at
[`hypothesis.md`][n-agent-hypothesis] (per-primitive coordination
cures), [`falsification-criteria.md`][n-agent-falsify]
(per-primitive falsifiability), and [`experiments.md`][n-agent-experiments]
(empirical validation at N≥3). Capture → hypothesis → empirical
validation → graduate. Treated-as-hypothesis they get tested;
shipped-as-design they get defended. Substrate validated at N=2;
not yet at N≥3.

[n-agent-hypothesis]: ../../prompts/agentic-engineering/collaboration/hypothesis.md
[n-agent-falsify]: ../../prompts/agentic-engineering/collaboration/falsification-criteria.md
[n-agent-experiments]: ../../prompts/agentic-engineering/collaboration/experiments.md

---
