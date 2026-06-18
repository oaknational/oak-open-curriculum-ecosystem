---
fitness_line_target: 180
fitness_line_limit: 240
fitness_char_limit: 14000
fitness_line_length: 100
drain_strategy: >-
  Surface owner-decision items during consolidate-docs; move answered or
  withdrawn entries to an archive when the register needs rotation.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

# Open Questions

Drainable register of architectural / design questions that are not yet decidable
and are not blocking a current cycle. Each entry names the question, why it shapes
future work, why it is not cheaply answerable now, its owning artefact, and a
status with a resolution trigger.

Drained empty at the 2026-06-15 dedicated consolidation; new questions are appended
as they arise.

## Q-001 — Cadence anchor for report-only fitness

**Question:** Now that fitness is report-only (ADR-144, 2026-06-16 — the validator never
fails a build), what structural anchor ensures the signal is actually *run and read* at
the right cadence (consolidation / session handoff)?

**Why it shapes future work:** report-only is only as live as its invocation. ADR-144 was
originally created to stop fitness drifting into "advisory and ignored"; the report-only
amendment answers that with "prominence + discipline," but a passive discipline with no
firing surface is exactly the failure mode this repo has repeatedly found decays under
pressure. A cadence anchor (a skill step that *runs* `practice:fitness`, a handoff checklist
item, or a non-gating hook that emits the report) would make the signal reliably seen.

**Why not cheaply answerable now:** needs design — which surface owns the cadence, and how to
emit a prominent signal without re-introducing a gate. Out of scope for the decision-debt drain.

**Owning artefact:** ADR-144 (§Exit code semantics); relates to `consolidate-docs` /
`session-handoff` cadence.

**Status:** open. **Resolution trigger:** the next fitness/cadence design pass, or a second
instance of a report-only fitness signal going unread. Surfaced by assumptions-expert during
the 2026-06-16 report-only review.

## Q-002 — The nature of the strategy layer and the vision→strategy→planning flow

**Question:** What *is* the strategy layer (its shape, content, and granularity), and how exactly
does vision derive strategy, and strategy derive planning? The controlling plan assumes a
2A (align-on-impact) → 2B (gap analysis) → 2C (execution spine) structure, but the owner wants the
nature of the strategy layer and the derivation flow settled before more strategy work proceeds.

**Why it shapes future work:** it governs the whole Phase 2 (and the Phase 3 estate restructure
that serves the strategy). If "the strategy layer" means something different from the current
2A/2B/2C breakdown, that breakdown is provisional and may be reshaped — so authoring more strategy
documents now risks building on an unsettled frame.

**Why not cheaply answerable now:** it's a design discussion the owner wants to hold directly in a
fresh session; it isn't an artefact an agent should settle unilaterally.

**Owning artefact:** [`vision-strategy-and-plan-estate.plan.md`](../../plans/vision-strategy-and-plan-estate.plan.md)
(Phase 2 — carries the owner-directed gate); thread `strategy-and-plan-estate-holistic-review`.

**Status:** RESOLVED (2026-06-18). The discussion happened. Outcome: the strategy layer is a
**cohesive system-strategy** (choices + measures; portfolio tier + per-stream sections, cohesive
across and within), homed at `docs/strategy/`. The vision→strategy→planning relationship is
**informational dependence, not execution order**, sitting under a fourth top layer — **Oak's own
strategy**, which our vision services (align, not fulfil). The 2A/2B/2C phase breakdown is
superseded by three co-equal, first-class bodies of work (vision / strategy / plan estate). Full
outcome recorded in the controlling plan
[`vision-strategy-and-plan-estate.plan.md`](../../plans/vision-strategy-and-plan-estate.plan.md)
(reconceived 2026-06-18). Surfaced by owner direction; resolved with the owner.
