---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Graduate ready items to PDRs, ADRs, rules, skills, or permanent docs"
merge_class: active-register-shard
fitness_content_role: drainable-buffer
---

# 2026-05-26 Starless + Open Closeout Candidates

Live active shard split from the main pending-graduations register by Feathered
Flying Cloud on 2026-05-26. This is not an archive. Process each entry before
removing this shard or its pointer from the main register.

Source windows:

- Main pending-graduations register sections moved in this pass.
- Active napkin source preserved at
  `../../active/archive/napkin-2026-05-26-feathered-hard-curation.md`.
- Open Streaming Updraft thread record at
  `../threads/agentic-engineering-enhancements.next-session.md`.

## Starless n=2-program closeout candidates

Captured 2026-05-26 by Starless Dimming Owl (claude / claude-opus-4-7 /
`781369`) at n=2-coordination-efficiency-program closeout per
session-handoff step 6b. Three candidates surfaced:

- **`classification-weighted-per-mode-load-as-proxy`**.
  Source-surface: WS0 commit body `3c3e01d3` + assumptions-expert
  verdict (transcript ID `a6789ba35eb58b7a8`). Graduation-target:
  amendment to PDR-026 (per-session landing commitment) OR a new
  PDR establishing the measurement discipline. Trigger-condition:
  second instance — a future plan with directive-load reduction in
  its acceptance bar reaches WS0-style execution and the combined
  `wc -l` proxy misrepresents the outcome again. Status: `pending`
  (single instance; the substance is captured in the WS0 commit
  body which is the durable evidence).

- **`skill-extraction-to-rule-eliminates-thin-pointer-subsections`**.
  Source-surface: WS0 architecture-expert-fred review (transcript
  ID `abfdc2e48d3d69917`) and docs-adr-expert review (transcript ID
  `af2a4ea3f4dfdf89f`); convergent MUST-FIX. Graduation-target:
  amendment to `consolidate-docs` SKILL or a new pattern under
  `.agent/memory/active/patterns/` named
  `skill-extraction-thin-pointer-discipline.md`. The pattern is:
  when extracting a SKILL section into a dedicated rule file, the
  thin-pointer paragraphs at the SKILL section heading should be
  DELETED (relying on First Moves numbered pointers); leaving both
  thin-pointer sub-sections AND First Moves pointers creates
  duplication that two independent reviewers caught. Worked
  instance: WS0 §0 / §0.5 extraction. Trigger-condition: second
  instance — a future SKILL extraction repeats the duplication
  pattern. Status: `pending`.

- **`owner-directed-commit-responsibility-with-parallel-coordination`**.
  Source-surface: Thermal Swooping Wing ↔ Starless Dimming Owl
  coordination during the n=2 program closeout (4+ directed comms
  exchanged; no lane-overlap; no duplicate commits). Worked
  instance demonstrates the pattern shape: one agent designs
  substance, another agent commits it under their attribution per
  owner direction; coordination via directed comms keeps lane
  ownership clean. Graduation-target: amendment to
  `start-right-team` SKILL §Closeout Contract or a new pattern
  under `.agent/memory/collaboration/`. Trigger-condition: second
  worked instance (the pattern is single-instance so far);
  alternatively owner-direction to formalise as standing protocol.
  Status: `pending`.

## Open Streaming Updraft reviewer-sizing candidate

Metadata:

- Captured: 2026-05-26.
- Source: napkin/open-streaming-updraft-phase-0a + distilled-entry.
- Target: rule:reviewer-sizing-must-be-stress-tested OR
  pdr-amendment:planning-discipline.
- Trigger: second-instance.
- Size: S.
- Status: pending.

**Substance**: when a reviewer estimates the session-shape of remaining
work, that estimate is typically derived from owned-surface file counts
or touch-point counts. File-count is not cycle-count. Most touch points
are mechanical translations of a small number of structural moves.
Before baking a reviewer's session estimate into permanent plan-body
doctrine, stress-test it with explicit TDD-cycle enumeration. The
realistic count is often substantially smaller than the file-touch count
suggests.

**Worked instance (this one)**: 2026-05-26 Open Streaming Updraft session
on `collaboration-identity-doctrine-enforcement-remediation` —
assumptions-expert's "Phase 0A/0B/0C are each session-sized" framing
(derived from 13+4+2 owned-surface files for Phase 0B and 7+ for Phase
0C) was baked into the plan body. Owner challenged via
`/oak-metacognition`. First-principles decomposition showed ~4 cycles
for 0B and ~5 cycles for 0C — about 10 cycles total, one focused
implementer session. Plan corrected at `3ca77972`; cure demonstrated by
landing Phase 0A + Phase 0B Cycle 1 in the same session as the
correction.

**Trigger to graduate**: a second worked-instance — another session where
a reviewer estimate of session-sizing was baked into doctrine without
cycle-decomposition stress-test, and the cycle-count proved
substantially smaller than the file-count framing implied.

**Graduation target**: a rule under `.agent/rules/` (e.g.
`stress-test-reviewer-sizing-estimates`) OR an amendment to the
planning-discipline PDR (PDR-018) naming the proxy choice discipline.
Single-instance for now; not graduating until trigger fires.

**Cross-references**: distilled.md §"Reviewer-derived session sizing is
not session sizing"; napkin.md 2026-05-26 entry under Open Streaming
Updraft.

## Open closeout-stretch candidates from archived napkin

These items are preserved in full in the archived napkin source window. Route
them entry by entry; do not promote from this shard without checking the archive
and the current rule/PDR homes first.

### Knip invocation scope must match gate scope

Metadata:

- Captured: 2026-05-26.
- Source: napkin/open-streaming-updraft-closeout.
- Target: rule-or-runbook:knip-gate-scope-discipline.
- Trigger: second-instance.
- Size: S.
- Status: pending.

Open's closeout ran repo-level `pnpm check`, fixed two unused types, then ran
workspace-level `knip` directly and misread five different workspace findings
as repo-level gate failures. Route only if a second worked instance shows agents
matching cures to the wrong invocation scope.

### Bulk export removal requires consumer-grep

Metadata:

- Captured: 2026-05-26.
- Source: napkin/open-streaming-updraft-closeout.
- Target: rule-or-tsdoc:export-removal-consumer-grep.
- Trigger: second-instance.
- Size: S.
- Status: pending.

Before removing `export` from interfaces, grep real consumers per symbol. The
worked instance showed four of five interfaces had external consumers; this is a
candidate for a small rule or TypeScript-practice note if it repeats.

### Closeout is closure, not investigation

Metadata:

- Captured: 2026-05-26.
- Source: napkin/open-streaming-updraft-closeout.
- Target: session-handoff-or-closeout-rule.
- Trigger: second-instance.
- Size: S.
- Status: pending.

Open's closeout self-extended by chasing workspace-level findings and
bulk-export over-correction. Candidate route: closeout surfaces should preserve
pickup state and cure direct blockers, not broaden into fresh investigation.

### Cure over blame during gate failure

Metadata:

- Captured: 2026-05-26.
- Source: napkin/open-streaming-updraft-closeout.
- Target: rule-or-principle:cure-over-provenance.
- Trigger: second-instance.
- Size: S.
- Status: pending.

Owner reframed the knip repair away from provenance accounting and toward cure.
Route only if the distinction repeats outside this worked instance; existing
gate discipline may already cover the underlying behaviour.
