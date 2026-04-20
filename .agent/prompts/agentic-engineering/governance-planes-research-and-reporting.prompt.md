---
prompt_id: governance-planes-research-and-reporting
title: "Governance Planes Research and Reporting"
type: handover
status: active
last_updated: 2026-04-20
---

# Governance Planes Research and Reporting

## Context

You are starting a deeper agentic-engineering research and reporting session.
The immediate seed note is:

- `.agent/research/agentic-engineering/governance-planes-and-supervision/repos-as-governance-planes.md`

Treat that document as a **starting point**, not as the finished output. It is
mainly a pointer to promising research directions, upstream repositories, and
conceptual gaps. Your job is to turn that starting point into stronger source
research, clearer local analysis, and at least one report-grade synthesis.

## Scope

This is a **research, analysis, and reporting** session.

- ✅ Read and assess the existing seed note
- ✅ Deepen the source base where needed
- ✅ Compare external concepts against this repo's actual governance surfaces
- ✅ Produce durable research/analysis/report artefacts
- ✅ Tighten discovery links if new artefacts are created
- ❌ Do not modify product code
- ❌ Do not start implementation work for runtime/platform changes
- ❌ Do not quietly convert speculative ideas into doctrine

## Ground First

Read and internalise:

1. `.agent/directives/AGENT.md`
2. `.agent/directives/principles.md`
3. `.agent/memory/distilled.md`
4. `.agent/memory/napkin.md`

Then read these agentic-engineering surfaces before doing new research:

### Seed and research lanes

- `.agent/research/agentic-engineering/governance-planes-and-supervision/README.md`
- `.agent/research/agentic-engineering/governance-planes-and-supervision/repos-as-governance-planes.md`
- `.agent/research/agentic-engineering/README.md`

### Analysis and report lanes

- `.agent/analysis/governance-concepts-and-mechanism-gap-baseline.md`
- `.agent/reports/agentic-engineering/README.md`
- `.agent/reports/agentic-engineering/deep-dive-syntheses/governance-concepts-and-integration-report.md`

### Concept-routing and canon

- `.agent/reference/agentic-engineering/README.md`
- `.agent/reference/agentic-engineering/deep-dives/governance-planes-trust-boundaries-and-runtime-supervision.md`
- `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
- `docs/architecture/architectural-decisions/124-practice-propagation-model.md`
- `docs/architecture/architectural-decisions/125-agent-artefact-portability.md`

### Planning context

- `.agent/plans/agentic-engineering-enhancements/current/governance-concepts-and-agentic-mechanism-integration.plan.md`

## Prompt Role

- The seed note is a directional sketch.
- The analysis lane owns investigation and evidence.
- The reports lane owns promoted synthesis once it can stand alone.
- Canonical doctrine remains in ADRs, Practice Core, directives, and `/docs/**`.

If your findings suggest doctrine changes, record that as a recommendation and
route it to the appropriate plan or report. Do not edit doctrine unless the
session explicitly widens scope.

## Core Questions

Use the seed note to investigate questions like:

1. What does "repo as governance plane" mean in concrete operational terms?
2. Which functions belong to a governance plane versus a runtime, protocol,
   policy engine, workflow system, or repo-support substrate?
3. Which open ecosystems are strongest on:
   - bounded autonomy
   - contribution contracts
   - trust boundaries
   - supervision before side effects
   - durable state and resumption
   - multi-agent conflict management
4. Which of those functions already exist in this repo, and in which artefacts?
5. Where is this repo stronger than the surveyed ecosystem?
6. Where are the real local gaps, rather than merely interesting global gaps?
7. Which concepts deserve promotion into:
   - research lane structure
   - analysis baselines
   - report-grade syntheses
   - future plans
   - reference deep dives

## Required Working Posture

- Distinguish carefully between:
  - external concept
  - repo-local mechanism
  - inference
  - recommendation
- Prefer primary and official sources when extending the research base.
- Do not let the session collapse into framework tourism or vendor catalogue
  summary. Always route back to local implications for this repo.
- Ask the first question repeatedly: could the explanation, synthesis, or route
  be simpler without losing quality?

## Expected Outputs

Produce outputs in the correct lanes.

Minimum expected shape:

1. **Research lane improvement**
   - Either substantially strengthen
     `.agent/research/agentic-engineering/governance-planes-and-supervision/repos-as-governance-planes.md`
     or add one adjacent research note in the same lane with a clearly narrower
     remit.
2. **Analysis or evidence artefact**
   - Add or update an analysis document if the session produces a sharper local
     baseline, gap map, comparison matrix, or mechanism inventory.
3. **Promoted report**
   - Create or update a report-grade synthesis in
     `.agent/reports/agentic-engineering/deep-dive-syntheses/` if the findings
     can stand alone as a durable explanation or audit.
4. **Discovery updates**
   - Update the relevant `README.md` routing surfaces if you create a new
     durable artefact.

## Suggested Deliverable Shapes

Good outcomes include one or more of:

- a clearer research note focused on repo-native contribution contracts
- an analysis baseline comparing governance-plane concepts to this repo's live
  artefacts
- a report on "repo-native governance planes as contribution control surfaces"
- a sharper deep-dive synthesis of trust boundaries, supervision, and repo-local
  operational authority

## Closeout Standard

At the end of the session:

- state what landed
- list the artefacts created or updated
- separate evidence from inference
- name the most important unresolved question
- say whether the work changed only research/reporting surfaces or also implies
  future doctrine/planning follow-up
