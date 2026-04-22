---
name: Reference / Research-Notes Rehoming
overview: >
  Find proper homes for the ~35 files moved from `.agent/reference/` into
  `.agent/research/notes/` during Session 6 of the memory-feedback thread
  (2026-04-22) when reference/ was reformed as a curated artefact tier.
  Material in `research/notes/` is in transit — each file needs a per-file
  disposition (research/, reference/, executive memory, deep-dive promotion,
  archive, or delete) before the holding bay can be retired.
todos:
  - id: phase-0-context-preservation
    content: "Phase 0: Preserve context. Capture the rationale for the en-bloc move (reference/ tier reformation, not per-file judgement) so future passes know the moves were structural, not editorial."
    status: pending
  - id: phase-1-inventory-and-classify
    content: "Phase 1: Inventory all files under research/notes/, classify each (deep-dive candidate / research-proper / reference candidate / executive-memory candidate / archive / delete), and record disposition in this plan body."
    status: pending
  - id: phase-2-deep-dive-decisions
    content: "Phase 2: Decide on agentic-engineering/ subtree (deep-dives + conversations + consolidation-design). These already exist as deep-dives in the corpus discoverability plan output; decide whether they belong in reference/ under the new definition or stay in research/."
    status: pending
  - id: phase-3-work-to-date-decisions
    content: "Phase 3: Decide on work-to-date/ subtree (5 ecosystem-progress files dated 2026-04-20). Time-bound material — likely candidates for archive once superseded, or for promotion to reports/ if still load-bearing."
    status: pending
  - id: phase-4-host-local-decisions
    content: "Phase 4: Decide on host-local material (platform-notes/, examples/, internal/, prog-frame/, ui/). Each is host-local in nature; decide retain in research/notes/, move to executive memory, or archive."
    status: pending
  - id: phase-5-architecture-research-decisions
    content: "Phase 5: Decide on architecture/ + complex-systems-dynamics/ subtrees (research-heavy, multi-field reviews). Likely belong in research/ proper under thematic subdirs, not in notes/ holding bay."
    status: pending
  - id: phase-6-top-level-doc-decisions
    content: "Phase 6: Decide on top-level docs (history-of-the-practice.md, official-mcp-app-skills.md, platform-adapter-formats.md, practice-validation-scripts.md). Each has distinct lineage — history likely belongs in practice-core/, official-mcp-app-skills.md is a skills-adjacent reference."
    status: pending
  - id: phase-7-update-active-references
    content: "Phase 7: Update active references after each disposition (active surfaces touched: README.md, docs/foundation/README.md, .agent/practice-index.md, .agent/skills/mcp-expert/SKILL.md, .agent/memory/operational/repo-continuity.md, .agent/plans/architecture-and-infrastructure/current/architectural-documentation-excellence-synthesis.plan.md). Each disposition that moves a file out of research/notes/ MUST follow up with a link refresh."
    status: pending
  - id: phase-8-retire-notes-bay
    content: "Phase 8: Retire research/notes/ once empty. Update research/README.md to remove the notes/ entry. Mark this plan complete and archive."
    status: pending
---

# Reference / Research-Notes Rehoming

## Context

During Session 6 of the `memory-feedback` thread (2026-04-22), the
`.agent/reference/` directory was reformed as a curated artefact tier
under [PDR-030](../../../practice-core/decision-records/PDR-030-reference-tier-as-curated-library.md).
At that point, `.agent/reference/` had accumulated ~35 files across 13
subdirectories with no consistent definition of what "reference" meant
operationally — material had landed there ad-hoc whenever it didn't
fit ADRs, plans, or research/.

Per the owner stipulation that closed the reformation, **all existing
material in `.agent/reference/` was relocated en bloc** to
`.agent/research/notes/` so the new reference tier could start
empty under its definition. The relocation was **structural, not
editorial** — no per-file judgement was made about whether each item
belonged in `research/` long-term.

This plan finds proper homes for the relocated material.

## Non-goals

- This plan does NOT re-author or refresh content. Each file moves
  to a new home as-is or is archived/deleted; substantive edits are
  out of scope and would need their own plan.
- This plan does NOT define `.agent/reference/`. PDR-030 defines the
  tier; this plan only decides which relocated files (if any) should
  be promoted INTO the new reference tier.
- This plan does NOT re-validate the original landing decisions of
  the relocated material — those decisions are accepted as historical;
  the question is only "where should this live going forward".

## Inventory (snapshot at relocation, 2026-04-22)

Files under `.agent/research/notes/` awaiting disposition:

### Top-level (4 files)
- `history-of-the-practice.md`
- `official-mcp-app-skills.md`
- `platform-adapter-formats.md`
- `practice-validation-scripts.md`

### Subdirectories
- `agentic-engineering/` — 11 files (README, deep-dives × 7, conversations × 1, consolidation-design × 1, top-level workbench note)
- `architecture/` — 3 files (boundary-enforcement, two book references)
- `complex-systems-dynamics/` — 3 files (multi-field-review, dynamic-stability, emergent_stability_summary)
- `examples/` — 1 file (validate-practice-fitness.example.ts)
- `internal/` — 1 file (agent-support-tools-specification.md)
- `platform-notes/` — 1 file (claude-code-hook-activation.md)
- `prog-frame/` — 1 file (agentic-engineering-practice.md)
- `ui/` — 3 files (sprite svgs × 2 + styled-components-in-nextjs.md)
- `work-to-date/` — 5 files (oak-ecosystem-progress-* dated 2026-04-20)

### Holdings README
- `README.md` — old reference inventory (will need replacement once disposition complete)

## Active references that broke at relocation

These were updated to point to `research/notes/` during the
reformation; they remain valid pointers but each one becomes a
follow-up update target as files relocate out of `research/notes/`:

- root `README.md`
- `docs/foundation/README.md`
- `.agent/practice-index.md`
- `.agent/skills/mcp-expert/SKILL.md`
- `.agent/memory/operational/repo-continuity.md`
- `.agent/plans/architecture-and-infrastructure/current/architectural-documentation-excellence-synthesis.plan.md`

## Trigger

This plan activates when there is owner appetite for a per-file
disposition pass. It is intentionally in `future/` (not `current/`)
because no SLA is imposed on the holding bay — `research/notes/`
can hold material indefinitely without harming the new reference
tier's integrity. The cost of staying in the bay is modest
discoverability degradation, not active rot.

## Done definition

- `research/notes/` is empty and removed from the tree.
- `research/README.md` no longer mentions `notes/`.
- All active references to relocated files point to their new homes.
- This plan is moved to `archive/completed/`.
