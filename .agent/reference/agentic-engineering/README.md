# Agentic Engineering Hub

This directory is the **concept-and-deep-dive hub** for high-level agentic
engineering material in this repository.

It is intentionally **index-only**. Canonical doctrine remains in ADRs,
Practice Core, and human-facing `/docs/**` pages. This hub helps readers find,
compare, and synthesise those sources without turning reference notes into a
second canon.

## Start Here

### Canon and ADR Cluster

- [ADR-119](../../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)
  — naming, boundary, and three-layer model
- [ADR-124](../../../docs/architecture/architectural-decisions/124-practice-propagation-model.md)
  — propagation and plasmid exchange
- [ADR-125](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
  — three-layer portability model
- [ADR-131](../../../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
  — knowledge flow and consolidation convergence
- [ADR-150](../../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
  — continuity surfaces and split-loop model
- [practice.md](../../practice-core/practice.md) — operational map of the
  practice
- [practice-index.md](../../practice-index.md) — repo-local bridge into live
  surfaces
- [How the Agentic Engineering System Works](../../../docs/foundation/agentic-engineering-system.md)
  — human-facing explanation of the same system

### Reference Entry Points

- [workbench-agent-operating-topology.md](./workbench-agent-operating-topology.md)
  — operating-model note for editor-resident agents
- [cross-platform-agent-surface-matrix.md](../cross-platform-agent-surface-matrix.md)
  — live support map for platform surfaces
- [platform-adapter-formats.md](../platform-adapter-formats.md) — adapter
  format reference
- [history-of-the-practice.md](../history-of-the-practice.md) — historical
  evolution record

### Deep Dives

- [deep-dives/README.md](./deep-dives/README.md) — curated concept extracts and
  launch points for wider synthesis

## Topic Map

| Theme | Anchor surfaces | Seed deep dive | Main source lanes |
| --- | --- | --- | --- |
| Operating model and topology | ADR-119, ADR-125, `agentic-engineering-system.md` | [operating-model-and-topology.md](./deep-dives/operating-model-and-topology.md) | [research operating-model lane](../../research/agentic-engineering/operating-model-and-platforms/README.md) |
| Mechanism taxonomy, signals, and precedence | `workbench-agent-operating-topology.md`, ADR-131, PDR-024, `agentic-mechanism-inventory-baseline.md` | [operating-model-and-topology.md](./deep-dives/operating-model-and-topology.md) | [analysis](../../analysis/README.md), [future mechanism taxonomy plan](../../plans/agentic-engineering-enhancements/future/operating-model-mechanism-taxonomy.plan.md) |
| Governance planes, boundaries, and supervision | `workbench-agent-operating-topology.md`, `agentic-engineering-system.md`, `governance-concepts-and-mechanism-gap-baseline.md` | [governance-planes-trust-boundaries-and-runtime-supervision.md](./deep-dives/governance-planes-trust-boundaries-and-runtime-supervision.md) | [analysis](../../analysis/README.md), [formal synthesis lane](../../reports/agentic-engineering/deep-dive-syntheses/README.md), [future mechanism taxonomy plan](../../plans/agentic-engineering-enhancements/future/operating-model-mechanism-taxonomy.plan.md) |
| Continuity and knowledge flow | ADR-131, ADR-150, `continuity-practice.md` | [continuity-and-knowledge-flow.md](./deep-dives/continuity-and-knowledge-flow.md) | [research continuity lane](../../research/agentic-engineering/continuity-memory-and-knowledge-flow/README.md), [analysis](../../analysis/README.md) |
| Operational awareness and state surfaces | ADR-150, `workbench-agent-operating-topology.md`, `continuity-operational-awareness-baseline.md` | [operational-awareness-and-state-surfaces.md](./deep-dives/operational-awareness-and-state-surfaces.md) | [analysis](../../analysis/README.md), [future sidecars plan](../../plans/agentic-engineering-enhancements/future/cross-vendor-session-sidecars.plan.md) |
| Reviewer systems and review operations | ADR-114, ADR-129, ADR-146, ADR-149 | [reviewer-system-and-review-operations.md](./deep-dives/reviewer-system-and-review-operations.md) | [research reviewer lane](../../research/agentic-engineering/reviewer-systems-and-discoverability/README.md) |
| Portability and platform surfaces | ADR-125, support matrix, adapter formats | [portability-and-platform-surfaces.md](./deep-dives/portability-and-platform-surfaces.md) | [research operating-model lane](../../research/agentic-engineering/operating-model-and-platforms/README.md) |
| Safety, evidence, and enforcement | ADR-131, [principles.md](../../directives/principles.md), [hallucination-and-evidence-guard-adoption.plan.md](../../plans/agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md) | no seed deep dive yet | [research safety lane](../../research/agentic-engineering/safety-evidence-and-enforcement/README.md), [plans collection](../../plans/agentic-engineering-enhancements/README.md) |
| Derived memory and graph navigation | ADR-059, ADR-062, ADR-157, [graphify-and-graph-memory-exploration.plan.md](../../plans/agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md) | [derived-memory-and-graph-navigation.md](./deep-dives/derived-memory-and-graph-navigation.md) | [research graph lane](../../research/agentic-engineering/derived-memory-and-graph-navigation/README.md) |

## Source Lanes

### Research, Evidence, and Reports

- [research/agentic-engineering/README.md](../../research/agentic-engineering/README.md)
  — themed routing for scattered research and source material
- [analysis/README.md](../../analysis/README.md) — authoritative investigation
  and evidence lane
- [reports/agentic-engineering/README.md](../../reports/agentic-engineering/README.md)
  — formal report lane for promoted audits and syntheses
- [plans/agentic-engineering-enhancements/README.md](../../plans/agentic-engineering-enhancements/README.md)
  — roadmap, source plans, execution plans, and documentation sync log

### Reflective and Staged Sources

- [experience/README.md](../../experience/README.md) — reflective archive;
  extract concepts, do not reorganise the source files
- [practice-context/outgoing/README.md](../../practice-context/outgoing/README.md)
  — staged concept packs and transfer material

## Human-Facing Discovery Surfaces

The hub does not replace `/docs/**`. It links back to the entry points humans
already use:

- [docs/README.md](../../../docs/README.md)
- [docs/foundation/README.md](../../../docs/foundation/README.md)
- [docs/governance/README.md](../../../docs/governance/README.md)
- [docs/architecture/README.md](../../../docs/architecture/README.md)
- [docs/architecture/architectural-decisions/README.md](../../../docs/architecture/architectural-decisions/README.md)
- [docs/engineering/README.md](../../../docs/engineering/README.md)
- [docs/explorations/README.md](../../../docs/explorations/README.md)

## Usage Rule

Use this hub when the question is conceptual ("where do operating-model,
reviewer-system, continuity, or graph-memory ideas live?"). Use ADRs, Practice
Core, and `/docs/**` when the question is normative ("what is the current
authoritative decision or rule?").
