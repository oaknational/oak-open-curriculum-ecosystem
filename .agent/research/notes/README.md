# Research / Notes — Holding Bay

**Status**: Transient. Material here is awaiting per-file
disposition.

This subdirectory is a holding bay created on 2026-04-22 during
the reformation of `.agent/reference/` into a curated library tier
([PDR-032](../../practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md)).
At reformation, ~35 files across 13 subdirectories were relocated
en bloc from `.agent/reference/` to here so the new `reference/`
tier could start under definition. The relocation was
**structural, not editorial** — no per-file judgement was made
about whether each item belonged in `research/` long-term.

## Disposition pass

Each file in this directory awaits one of:

- **Move to `research/` proper** under a thematic subdirectory
- **Promote to `reference/`** under PDR-032 (substantiate / justify
  / owner-vet)
- **Move to executive memory** if it is a stable contract or
  catalogue
- **Move to `reports/`** if it is a promoted formal synthesis
- **Move to `docs/`** if it is human-facing project documentation
- **Move to `practice-core/`** if it is portable Practice doctrine
- **Archive** if superseded but worth retaining
- **Delete** if substance is recoverable from git and not worth
  retaining

The disposition pass is tracked by
[`reference-research-notes-rehoming.plan.md`](../../plans/agentic-engineering-enhancements/future/reference-research-notes-rehoming.plan.md).
The plan lives in `future/` because no SLA is imposed on this bay
— material can hold here indefinitely without harming the new
`reference/` tier's integrity.

## Active references that point here

The following active surfaces were updated during reformation to
point to this directory; each becomes a follow-up update target as
files relocate out of here:

- root [`README.md`](../../../README.md)
- [`docs/foundation/README.md`](../../../docs/foundation/README.md)
- [`.agent/practice-index.md`](../../practice-index.md)
- [`.agent/skills/mcp-expert/SKILL.md`](../../skills/mcp-expert/SKILL.md)
- [`.agent/memory/operational/repo-continuity.md`](../../memory/operational/repo-continuity.md)
- [`.agent/plans/architecture-and-infrastructure/current/architectural-documentation-excellence-synthesis.plan.md`](../../plans/architecture-and-infrastructure/current/architectural-documentation-excellence-synthesis.plan.md)

## What was relocated (snapshot, 2026-04-22)

### Top-level
- `history-of-the-practice.md`
- `official-mcp-app-skills.md`
- `platform-adapter-formats.md`
- `practice-validation-scripts.md`

### Subdirectories
- `agentic-engineering/` — README + deep-dives (7) + conversations (1) + consolidation-design (1) + workbench note
- `architecture/` — boundary-enforcement plus two book references
- `complex-systems-dynamics/` — multi-field-review, dynamic-stability, emergent_stability_summary
- `examples/` — `validate-practice-fitness.example.ts`
- `internal/` — `agent-support-tools-specification.md`
- `platform-notes/` — `claude-code-hook-activation.md`
- `prog-frame/` — `agentic-engineering-practice.md`
- `ui/` — `sprite.svg`, `inline-sprite.svg`, `styled-components-in-nextjs.md`
- `work-to-date/` — 5 oak-ecosystem-progress files dated 2026-04-20

## What this bay is NOT

- Not the new home for fresh material — fresh material should land
  directly in `research/`, `analysis/`, `reports/`, or another
  appropriate tier.
- Not a sub-tier of `research/` long-term — the bay is removed when
  empty.
- Not a relaxation of `reference/` discipline — material here is
  not "almost reference"; it is in transit and the disposition is
  open.

## Bay retirement

When this directory is empty, the entry is removed from
[`research/README.md`](../README.md) and the bay is retired until
the next reformation pass.
