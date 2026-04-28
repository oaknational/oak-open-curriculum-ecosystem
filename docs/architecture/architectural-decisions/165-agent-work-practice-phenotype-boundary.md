# ADR-165: Agent Work Practice Phenotype Boundary

**Status**: Accepted
**Date**: 2026-04-28
**Related**:
[PDR-035](../../../.agent/practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md)
— portable Practice authority for agent-work capabilities;
[ADR-119](119-agentic-engineering-practice.md) — Practice naming and
boundary;
[ADR-124](124-practice-propagation-model.md) — Practice propagation
model;
[ADR-125](125-agent-artefact-portability.md) — canonical content and
platform adapters;
[ADR-150](150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
— continuity surfaces and learning loop;
[ADR-154](154-separate-framework-from-consumer.md) — framework/consumer
separation and specificity gradient.

## Context

This repository hosts both product/application architecture and a
Practice-bearing agentic engineering system. The agent-work system has
several local surfaces: `.agent/` canonical content and state,
platform adapters, operational memory, implementation plans, and the
TypeScript `agent-tools` workspace.

Some of those surfaces are highly repo- or stack-specific. Without an
explicit phenotype boundary, implementation detail can be mistaken for
conceptual ownership. That would make agent collaboration, coordination,
work management, direction, lifecycle, claims, identity, handoff, review
routing, and adjacent mechanisms look like repo-local doctrine even when
they are Practice-owned capabilities.

## Decision

This repo treats PDR-035 as the portable authority for agent-work
capabilities. This ADR records only this repository's phenotype:
where those Practice capabilities appear locally and how local
implementation surfaces relate to the portable memotype.

| Local surface                                                                                     | Classification                                                           |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `.agent/practice-core/`                                                                           | Portable Practice Core and PDR memotype.                                 |
| `.agent/directives/`, `.agent/rules/`, `.agent/skills/`, `.agent/commands/`, `.agent/sub-agents/` | Hydrated canonical Practice content for this repo.                       |
| `.agent/state/collaboration/`                                                                     | Local operational state instance for Practice collaboration protocols.   |
| `.agent/memory/operational/` and `.agent/memory/executive/`                                       | Local continuity, routing, and evidence surfaces.                        |
| `agent-tools/`                                                                                    | Optional TypeScript implementation of Practice-operational tooling.      |
| `.cursor/`, `.claude/`, `.gemini/`, `.agents/`, `.codex/`                                         | Platform adapters, activation metadata, and local project configuration. |
| `.agent/plans/`                                                                                   | Execution tracking and plan state, not permanent doctrine.               |

When an agent-work behaviour changes, route the change by substance:

1. Portable concept, vocabulary, lifecycle, or governance goes to a
   PDR, Practice Core section, canonical rule, skill, command, or
   portable pattern.
2. Repo-specific implementation, state layout, command wiring, or
   stack choice goes to this repo's ADRs, READMEs, state docs, or
   implementation plans.
3. Plans and live state may preserve evidence while work is underway,
   but they must not remain the only home for settled doctrine.

## Consequences

- `agent-tools` remains an optional TypeScript implementation surface,
  not the source of Practice doctrine.
- Collaboration-state JSON and markdown files are local operational
  instances of Practice-owned coordination concepts.
- Future non-TypeScript or non-Oak repos can implement equivalent
  Practice behaviours without inheriting this repo's implementation.
- ADRs in this repo may document phenotype choices, but portable
  agent-work authority belongs in PDRs and Practice Core surfaces.
- Consolidation passes should correct any plan, README, or state file
  that treats stack-specific implementation as ownership of the
  agent-work concept.
