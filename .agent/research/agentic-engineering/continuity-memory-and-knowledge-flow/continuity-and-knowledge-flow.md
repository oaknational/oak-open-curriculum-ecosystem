# Continuity and Knowledge Flow

This deep dive covers how the repository keeps orientation, corrections, and
doctrine moving across sessions and eventually into permanent surfaces.

## Canonical Anchors

- [ADR-131](../../../../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
- [ADR-150](../../../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
- [continuity-practice.md](../../../../docs/governance/continuity-practice.md)
- [practice.md](../../../practice-core/practice.md)

## Evidence and Investigations

- [continuity-adoption-baseline.md](../../../analysis/continuity-adoption-baseline.md)
- [continuity-adoption-evidence.md](../../../analysis/continuity-adoption-evidence.md)

## Reflective Sources

- [2026-04-01-the-workflow-that-travels.md](../../../experience/2026-04-01-the-workflow-that-travels.md)
- [2026-02-22-document-hierarchy-and-the-consolidation-practice.md](../../../experience/2026-02-22-document-hierarchy-and-the-consolidation-practice.md)
- [2026-03-23-deep-practice-integration.md](../../../experience/2026-03-23-deep-practice-integration.md)

## Staged and Planning Sources

- [plan-lifecycle-four-stage.md](../../../practice-context/outgoing/plan-lifecycle-four-stage.md)
- [continuity-and-surprise-practice-adoption.plan.md](../../../plans/agentic-engineering-enhancements/archive/completed/continuity-and-surprise-practice-adoption.plan.md)

## Current Synthesis

- Continuity is treated as an engineering property, not as vague model memory.
  The authoritative split is operational continuity, epistemic continuity, and
  institutional continuity.
- ADR-150 and `continuity-practice.md` define the split-loop model:
  `session-handoff` keeps ordinary closeout light, while
  `jc-consolidate-docs` owns deep convergence.
- ADR-131 and `practice.md` define the broader knowledge-flow circuit:
  capture -> distil -> graduate -> enforce. Continuity is one working slice of
  that loop rather than a separate subsystem.
- Experience files are especially valuable here because they show how the
  continuity model felt in real use; they should feed concept extraction, not
  be converted into pseudo-canon.

## Good Follow-Up Questions

- Which continuity signals belong in analysis/evidence versus future formal
  reports?
- Where are active plans, prompts, and memory layers overlapping rather than
  complementing each other?
- Which continuity patterns should graduate from staged practice-context notes
  into permanent patterns or PDRs?

## Related Lanes

- [research continuity lane](../../../research/agentic-engineering/continuity-memory-and-knowledge-flow/README.md)
- [analysis evidence lane](../../../analysis/README.md)
- [formal audit lane](../../../reports/agentic-engineering/discoverability-audits/README.md)
- [deep-dives index](./README.md)
- [hub README](../README.md)
