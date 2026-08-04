---
title: 'Comparative scan of a mature workflow-automation organism for Practice learning'
type: research-index
status: complete
stage: 'Source scan, independent Practice diagnosis, evidence register, and source-independent synthesis complete'
date: 2026-08-04
audience: 'Practice maintainers and reviewers interested in agentic engineering, coordination, memory, feedback, extension, governance, and system evolution'
subject: 'A source-safe comparative investigation using the public n8n repository to reveal possible improvements, reductions, refusals, and preserved strengths in the Practice'
related:
  - .agent/directives/principles.md
  - .agent/practice-core/decision-records/PDR-024-vital-integration-surfaces.md
  - docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md
  - ../../../reports/agentic-engineering/practice-systemic-capabilities-2026-08/README.md
---

# Comparative scan for Practice learning

> **Research complete; proposals remain review-only.** The source-facing evidence and independent
> diagnosis live here. The Practice-facing report is organised entirely in Practice vocabulary and
> remains understandable without knowledge of the comparative source.

## Purpose

Use observation of a mature workflow-automation system as a lens through which to examine the
Practice across multiple scales and dimensions.

The governing question was:

> Across all relevant scales and dimensions, what does comparative observation reveal about
> capabilities, relationships, feedback loops, boundaries, and evolutionary arrangements that the
> Practice should introduce, strengthen, connect, relocate, simplify, constrain, reduce, stop,
> preserve, or consciously refuse?

The work is not a code review, implementation study, reimplementation brief, or attempt to make the
Practice resemble n8n. It studies pressures, concepts, relationships, seams, lifecycles, feedback,
clustering, and cross-scale arrangements.

## Research estate

| Artefact | Role | Status |
| --- | --- | --- |
| [Method and source boundary](method-and-source-boundary.md) | Licensing-safe method, evidence classes, excluded material, transformation discipline, and final review gate | Complete |
| [Tranche 1 — structural observations](tranche-1-structural-observations.md) | Semantic authority, projections, boundaries, agent operations, testing, communication, and cross-scale structural hypotheses | Complete |
| [Tranche 2 — lifecycles and coordination](tranche-2-lifecycles-and-coordination.md) | Intent, occurrence, attempt, actor, evidence, waiting, recovery, cancellation, retention, and distributed coordination | Complete |
| [Tranche 3 — extension, governance, and evolution](tranche-3-extension-governance-and-evolution.md) | Extension membrane, trust, testing ecology, observability, compatibility pressure, migration, security, and forgetting | Complete |
| [Comparative diagnosis](comparative-diagnosis.md) | Independent OCE classification: absent, nascent, fragmented, underpowered, well matched, overdeveloped, misplaced, counterproductive, valuable and distinct, or unknown | Complete |
| [Evidence register](evidence-register.md) | Finding-to-OCE and source traceability, evidence classes, confidence, contradiction register, and negative evidence | Complete |
| [Source-independent Practice report](../../../reports/agentic-engineering/practice-systemic-capabilities-2026-08/README.md) | Main synthesis in Practice terms | Complete; proposed for review |
| [Outcome portfolio](../../../reports/agentic-engineering/practice-systemic-capabilities-2026-08/outcome-portfolio.md) | Additive, connective, subtractive, preservative, and refusal outcomes with dependencies and evidence gates | Complete; proposed for review |
| [Interaction and transition map](../../../reports/agentic-engineering/practice-systemic-capabilities-2026-08/interaction-and-transition-map.md) | Dependency graph, sequencing, anti-sequence, expected deletions, and smallest coherent experiment | Complete; proposed for review |
| [Evaluation and falsifiers](../../../reports/agentic-engineering/practice-systemic-capabilities-2026-08/evaluation-and-falsifiers.md) | Measures, kill conditions, privacy constraints, and minimum evidence before ratification | Complete; proposed for review |

## Principal finding

The Practice is not mainly short of concepts, rules, or governance. It is unusually advanced in
canonical content, memotype/phenotype separation, identity, liveness, state/memory contracts,
provenance, forgetting, AX, plan authority, and seam-specific compatibility.

The central weakness is **operational discontinuity**: correct concepts are embodied in many
operational, human, machine, host, and external projections, but the relationships proving those
embodiments remain aligned are incomplete or depend on repeated agent procedure.

The keystone proposal is a thin portable lifecycle connecting:

```text
ratified intent or standing rule
    → concrete obligation
    → attempt lineage
    → bounded actor authority
    → durable evidence
    → waiting / correction / cancellation / recovery
    → terminal account
    → audience-specific projections
    → consolidation, retention, and forgetting
```

It is not a central orchestrator or new source of truth. Its success is subtractive: it must allow
current instructions, status fields, duplicate indexes, manual reconstruction, and defensive gates
to disappear.

## Direct contradiction discovered

The scan found one current projection mismatch that demonstrates the broader diagnosis:

- accepted PDR-094 and current collaboration conventions require pass-level absorption evidence,
  no per-event disposition ledger, and no archive curation obligation;
- `.agent/state/README.md` still describes a permanent archive with a `manifest.jsonl` disposition
  row per event.

The research records but does not repair this unrelated operational drift. It is the recommended
worked example for any projection-convergence experiment.

## Important findings of non-absence

The scan did **not** support claims that the Practice lacks:

- state/memory separation;
- canonical content and platform adapters;
- liveness semantics;
- forgetting and provenance;
- provider-neutral telemetry intent;
- strict local replacement and explicit external compatibility;
- capacity to amend, supersede, retire, or refuse.

Several source observations therefore became preservation findings or evidence that the Practice
should remain deliberately different.

## Source boundary

The source-facing work:

- reads only the public `master` branch;
- excludes `.ee` directories and `.ee.` files;
- does not reproduce code, schemas, prompts, tests, configuration, diagrams, or implementation;
- uses paths, links, public architectural descriptions, and independently formulated abstractions;
- keeps source evidence out of the organising structure of the main report;
- treats third-party components and public-product compatibility as contextual rather than reusable
  Practice architecture.

See [method-and-source-boundary.md](method-and-source-boundary.md) for the complete contract.

## Review posture

The final report is deliberately proposal-status. Before any broad ratification it asks for:

1. one completed projection-convergence repair;
2. one historical episode modelled through the proposed lifecycle;
3. one live bounded experiment;
4. one interruption/recovery and stale-actor scenario;
5. measured AX and coordination-cost comparison;
6. explicit deletions or retirements caused by the new capability;
7. owner judgement that the conceptual gain warrants the vocabulary and maintenance cost.
