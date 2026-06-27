---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

# Napkin

Current-session observations. Append below. Rotate when over ~400 lines (`consolidate-docs`
step 6): extract every behaviour-changing entry, merge into `distilled.md` or graduate to a
permanent home, verify the home, then archive and start fresh.

## Napkin rotated (2026-06-27 dedicated consolidation, Hawthorn rides Foliage)

Rotated at a goal-gated dedicated-consolidation session. The processed window (2026-06-25 →
2026-06-27 entries — the Sonar/CI-hardening/merge-train/Director-rotation window) is preserved
verbatim in `archive/napkin-2026-06-27-hawthorn-consolidation.md` (tracked, byte-identical).
Every behaviour-changing entry was dispositioned first-hand against its home before the
archive-move. As in the prior rotation, the substrate was already mature: most entries were
worked instances of patterns/rules/frictions live in their homes (`verify-dont-trust`,
fluency-is-a-warning, the merge-gate `CLEAN`/`BLOCKED`/`required_deployments` behaviour,
semantic-merge of memory files, `wrapped-exit-codes-false-green` for background-gate exit
masking). The genuinely-new facets graduated to the agent-tooling frictions register
(F-88 the comms-seen filename structural cure, F-92 the heartbeat-CLI/rule `--created-at`
drift, F-100 the workspace-creation skill + per-category config canon). The candidate-pattern
single-instances were promoted to their pattern homes **on the first instance** (owner
direction 2026-06-27: promote and trust the Practice to invalidate a wrong promotion through
experience, never hold for a second sighting) — `disambiguate-overloaded-term-before-canonicalising`
and `glanceable-surface-divergence-only-display` as new files, the pr-monitor head-SHA
refinement folded into `pr-monitor-to-merge`. `distilled` and `pending-graduations` are now
empty. The commits and the homes are the record of where each piece went.

New session observations append below.

## 2026-06-27 — Ask the Director for shared-state topology (Hawthorn rides Foliage)

- **Mistake → owner-corrected: I inferred the canonical buffer base by a multi-step solo
  divergence-archaeology pass instead of asking the Director who owns the shared-state branch.**
  Created off `main` (owner-acknowledged wrong base), then spent ~6 read steps diffing napkins
  across 8 worktrees to deduce that `chore/director-coordination` was the live buffer state —
  when one directed question to the Director (Hearth tracks Tallow) answered it directly and
  authoritatively (tip `beb53c423` stable; flow-back into the coordination branch; repo-continuity
  is the Director's lane). In an Implementer seat, shared-state topology is a Director question
  ([[feedback_implementer_routes_questions_via_director]]); archaeology to avoid asking is the
  failure. Cure: when a question is about who-owns-what / where-the-canonical-state-lives, route
  it to the Director first; reserve first-hand investigation for verifying their answer, not for
  reconstructing what coordination already knows. Sibling: [[read-before-asking]],
  [[feedback_useful_work_over_ceremony]].
