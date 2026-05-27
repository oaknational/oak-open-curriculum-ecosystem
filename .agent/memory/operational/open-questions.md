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

## Q-001 — gate-1a EEF tool: whole-graph selection vs data-supported narrowing

- **Captured**: 2026-05-27 (Galactic Dancing Constellation / `claude` / `7efeec`)
- **Question**: At gate-1a, `eef-explore-evidence-for-context` returns the whole
  connected EEF graph (all 30 strands + 37 edges) and lets the model select
  contextual fit. Is whole-graph the right teacher experience, or should a
  later stage add narrowing — and if so, on what signal?
- **Why it shapes future work**: determines the scope and trigger of the gate-1b
  t5 ranking/scoring engine (relevance selection is explicitly deferred there).
- **Why not answerable cheaply now**: needs real teacher-usage signal; the
  corpus tag vocabulary does not support reliable server-side narrowing today
  (verified: focus-enum→tag mapping mostly empty; only 16/30 strands carry a
  phase tag, so phase-narrowing would suppress ~14 phase-general strands).
- **Owning artefact / discussion home**: PR #121 top section (Starless flagged
  for owner discussion). Does not block the current cycle — PR #121 is
  mergeable as whole-graph.
- **Status**: open — owner discussion pending.
