---
title: 'Comparative scan of a mature workflow-automation organism for Practice learning'
type: research-index
status: active
stage: 'Tranche 1: source boundary, structural cartography, and initial hypotheses'
date: 2026-08-04
audience: 'Practice maintainers and reviewers interested in agentic engineering, coordination, memory, feedback, extension, governance, and system evolution'
subject: 'A source-safe comparative investigation using the public n8n repository to reveal possible improvements, reductions, refusals, and preserved strengths in the Practice'
related:
  - .agent/directives/principles.md
  - .agent/practice-core/decision-records/PDR-024-vital-integration-surfaces.md
  - docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md
  - .agent/reports/external-organising-and-stakeholder-surfaces-review-2026-07-13.md
---

# Comparative scan for Practice learning

> **Active research.** This index records a staged comparative investigation. The eventual
> Practice-facing report will be understandable without knowledge of n8n. Source-facing material
> remains in this research companion so that claims are traceable without allowing the source
> system's vocabulary, package topology, or implementation to become the architecture of the
> Practice.

## Purpose

Use observation of a mature workflow-automation system as a lens through which to examine the
Practice across multiple scales and dimensions.

The governing question is:

> Across all relevant scales and dimensions, what does comparative observation reveal about
> capabilities, relationships, feedback loops, boundaries, and evolutionary arrangements that the
> Practice should introduce, strengthen, connect, relocate, simplify, constrain, reduce, stop,
> preserve, or consciously refuse?

The work is not a code review, implementation study, reimplementation brief, or attempt to make the
Practice resemble n8n. It studies pressures, concepts, relationships, seams, lifecycles,
feedback, clustering, and cross-scale arrangements.

## Research estate

| Artefact | Role | Status |
| --- | --- | --- |
| [Method and source boundary](method-and-source-boundary.md) | Defines the licensing-safe method, evidence classes, and transformation from source observation to original Practice analysis | Tranche 1 complete |
| [Structural observations](tranche-1-structural-observations.md) | First cartography of recurring arrangements and initial Practice hypotheses | Tranche 1 complete |
| `tranche-2-lifecycles-and-coordination.md` | Definition/execution, activation, scheduling, queueing, task-running, event, retry, cancellation, retention, and replay lifecycles | Planned |
| `tranche-3-extension-governance-and-evolution.md` | Extension membranes, testing ecology, observability, security, contribution governance, migrations, compatibility pressure, and forgetting | Planned |
| `comparative-diagnosis.md` | Practice-by-Practice diagnosis: absent, nascent, fragmented, underpowered, well matched, overdeveloped, misplaced, counterproductive, valuable and distinct, or unknown | Planned |
| `evidence-register.md` | Finding-to-source traceability with confidence, alternative interpretation, and context-difference notes | Planned |
| `.agent/reports/agentic-engineering/practice-systemic-capabilities-2026-08/` | Source-independent synthesis, outcome portfolio, interaction graph, transition sequencing, and falsifiers | Planned final synthesis |

## Research tranches

### Tranche 1 — source boundary and structural cartography

- establish the licence and attribution boundary;
- identify high-level responsibility clusters;
- inspect canonical registries and their projections;
- inspect architectural enforcement and agent-facing operational surfaces;
- record early hypotheses without promoting them to recommendations.

### Tranche 2 — lifecycles, state, and distributed coordination

Trace representative concepts through time and across process boundaries:

- workflow definition, validation, persistence, activation, execution, observation, retry,
  cancellation, retention, and pruning;
- control-plane and execution-plane communication;
- task-runner containment and failure diagnosis;
- event publication, storage, replay, and user steering;
- agent planning, execution, memory, human approval, and deterministic verification loops.

### Tranche 3 — extension, governance, testing, observability, and evolution

- extension registration, discovery, versioning, trust, and distribution;
- testing as a composable system-environment ecology;
- architecture fitness functions and change-impact selection;
- product telemetry, operational observability, and evidence transport;
- security and public-repository information boundaries;
- migration, compatibility, deprecation, and historical residue;
- commercial/community and licensed/unlicensed seams, without examining excluded source.

### Tranche 4 — Practice diagnosis and synthesis

For each meaningful finding, classify the Practice state and possible direction:

- introduce;
- strengthen;
- connect;
- relocate;
- simplify;
- constrain;
- reduce;
- stop;
- preserve;
- refuse;
- investigate.

The final synthesis will include interactions and sequencing. An addition that makes three existing
surfaces unnecessary is not one additive recommendation; it is a transition in the topology of the
Practice.

## Initial cross-cutting signal

The first pass suggests a recurring arrangement more important than any individual package:

> A semantic definition is placed in one canonical surface; human-facing, machine-facing, runtime,
> and governance projections are derived from or checked against it; specialised transports and
> consumers remain outside the definition layer.

Examples under investigation include telemetry definitions and their catalogue, shared API
contracts, agent-skill sources and harness links, database-schema checks, package-boundary checks,
and test capability declarations. The Practice already contains related ideas — generated schema
flow, canonical skills, memotype/phenotype separation, and repo-owned intent — so the research must
determine whether this is a genuinely missing capability, a unifying name for fragmented existing
capabilities, or merely a useful external confirmation.

## Required caution

No finding is a recommendation merely because it is visible in a successful system. Each finding
must identify:

1. the pressure it appears to answer;
2. whether the Practice experiences the same pressure;
3. differences in obligations and freedoms;
4. current Practice evidence;
5. benefits and harms at each affected scale;
6. a falsifier;
7. whether the right response is adoption, adaptation, connection, reduction, refusal, or no
   change.
