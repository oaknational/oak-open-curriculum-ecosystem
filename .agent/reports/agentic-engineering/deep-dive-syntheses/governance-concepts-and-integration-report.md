# Governance Concepts and Integration Report

## Executive Summary

This report captures the durable findings from a deep comparison against a
governance-oriented agent corpus, translated fully into local agentic
engineering language.

The main conclusion is not that the repo needs a replacement operating model.
It is that the repo benefits from a clearer vocabulary for several mechanism
families that are already present, emerging, or still under-specified:

- governance planes around execution
- boundary models and authority gradients
- supervised execution and recovery semantics
- layered safeguard stack across existing control surfaces
- attempt / observed outcome / proven result structure in evidence
- residual-risk and limitation surfaces
- adoption ladders and propagation surfaces

The comparison therefore produces three kinds of output:

1. concepts that should amend existing plans
2. concepts that should remain future-plan material until bounded evidence
   exists
3. concepts that are useful only as framing and should not be adopted as new
   durable machinery

It also produces a smaller but important fourth class: net-new local
abstractions and reflective insights that did not have a clean prior
equivalent, but became worth keeping because the comparison sharpened local
boundaries, routing, or evidence discipline.

## What the Compared Model Contributes

The compared model is strongest where it makes implicit mechanism families
explicit. It treats governance as more than rules or more than runtime:

- action shaping can happen outside model reasoning
- actor boundaries are design inputs, not background assumptions
- supervision and recovery are part of the operating model
- audit and evidence benefit from distinguishing attempt, observed outcome,
  and proven result, while residual risk remains a separate design surface
- adoption can be staged rather than all-or-nothing
- propagation needs stable core semantics plus thin adapters and outward
  summaries

## What It Changes in the Local Mental Model

The local repo already has:

- strong execution plans
- strong reviewer and specialist surfaces
- strong continuity and learning loops
- strong portability and propagation surfaces
- growing evidence discipline

The comparison changes the mental model by showing that these are pieces of a
larger governance estate. The most important shift is from seeing the repo as
"plans plus reviewers plus continuity" to seeing it as:

- **work plane**: execution, edits, checks, closeout
- **governance plane**: decisions, boundaries, authority, safeguards,
  escalation
- **learning plane**: napkin, distilled, consolidation, permanent docs

That does not replace existing doctrine. It sharpens where different surfaces
belong.

## Net-New and Reflective Concepts Worth Keeping

Not every durable concept in this lane is a renamed local analogue. A few
concepts earned retention precisely because the comparison exposed a missing
local distinction or produced a stronger synthesis than either corpus carried
alone:

- **Action-governance boundary**: a cleaner distinction between shaping work
  and executing work. This sharpens where planning, reviewer routing, runtime
  checks, and evidence semantics belong. It is routed as future taxonomy work.
- **Awareness plane**: a repo-local name for short-horizon operational state
  that should stay separate from continuity canon. This gives the
  operational-awareness lane a clearer design target and is now reflected in
  that lane's local vocabulary.
- **Three-plane framing**: work plane, governance plane, and learning plane.
  This is the most useful reflective synthesis in the lane because it improves
  routing decisions across plans, deep dives, and doctrine-adjacent surfaces
  without importing a foreign stack wholesale. It is retained as
  reference/deep-dive framing rather than executable doctrine debt.

These concepts count as extraction because they create sharper local
boundaries, not because they mirror wording from the compared corpus.

## Transferable Concept Register

| Local name | Definition | Why it matters here | Current local analogue | Status | Target surface |
| --- | --- | --- | --- | --- | --- |
| External decision layer | Deterministic steering and checks outside model reasoning | Explains how local control actually happens | directives, plans, reviewers, gates | present but unnamed | reference/deep dive |
| Action-governance boundary | The distinction between shaping work and executing work | Clarifies what belongs in plans, reviewers, runtime checks, and evidence surfaces | directives, plans, reviewer routing | partial | future plan |
| Boundary model | Named boundaries across human, agent, tool, work plane, and control plane | Makes responsibility and escalation clearer | scattered trust and continuity notes | missing | future plan |
| Graduated authority | Authority that changes with risk, evidence, and context | Useful for review depth and tactical ownership | precedence and escalation hints | defer | future plan |
| Relationship-confidence signals | Signals that change how much scrutiny or latitude a track receives | Strengthens review routing and workstream awareness | change profile, user correction, review depth | partial | existing plan |
| Layered safeguard stack | Rules, reviewers, gates, continuity, and runtime safeguards treated as one family | Explains defence in depth locally | current practice surfaces in aggregate | present but unnamed | reference/deep dive |
| Attempt / observed outcome / proven result structure | Separate records for what was tried, what happened, and what is proven | Improves evidence quality and rollback reasoning | evidence bundles and validation outputs | partial | existing plan |
| Supervised execution lifecycle | Observe, pause, recover, redirect, and close work cleanly | Gives operational awareness a stronger frame | continuity and awareness planning | partial | existing plan |
| Residual-risk surface | Durable record of what remains uncertain or intentionally ungoverned | Prevents false completeness claims | plan risk tables and caveats | missing | future plan |
| Adoption ladder | Staged uptake from minimal to mature use | Keeps rollout proportional | plan lifecycle, but not concept-specific | defer | future plan |
| Propagation surface | Stable way to carry concepts outward through hubs, matrices, or packs | Builds discoverability without a second canon | hub, support matrix, outgoing packs | present | reference/deep dive |
| Signal ecology | Named families of sensors, alerts, feedback loops, and routed signals | Makes hidden routing behaviour legible | gates, reviewers, fitness, probes | present but unnamed | future plan |
| Awareness plane | Shared short-horizon operational state separate from continuity canon | Needed for multi-agent hygiene | awareness-plane design work | partial | existing plan |
| Three-plane framing | Reflective separation of work, governance, and learning planes | Improves routing decisions across execution, safeguards, and durable learning surfaces | implicit division across plans, reviewers, memory, and docs | present but unnamed | reference/deep dive |

## Recommended Integration Map

### Existing current plans to amend

- [operational-awareness-and-continuity-surface-separation.plan.md](../../../plans/agentic-engineering-enhancements/active/operational-awareness-and-continuity-surface-separation.plan.md)
  should absorb the supervised-execution frame, awareness-plane vocabulary, and
  clearer authority/ownership language.
- [reviewer-gateway-upgrade.plan.md](../../../plans/agentic-engineering-enhancements/current/reviewer-gateway-upgrade.plan.md)
  should explicitly treat the gateway as a signal router inside a layered
  safeguard stack.
- [hallucination-and-evidence-guard-adoption.plan.md](../../../plans/agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md)
  should assess whether the attempt / observed outcome / proven result
  structure improves claim quality without forking the evidence lane.

### Existing future plan to extend

- [operating-model-mechanism-taxonomy.plan.md](../../../plans/agentic-engineering-enhancements/future/operating-model-mechanism-taxonomy.plan.md)
  is the correct home for the broader abstraction work:
  - action-governance boundary
  - boundary model
  - graduated authority (explicitly deferred inside that lane)
  - signal ecology
  - adoption ladder (explicitly deferred inside that lane)
  - residual-risk surfaces
  - explicit governance-plane vocabulary

### Reference and report surfaces to strengthen

- [governance-planes-trust-boundaries-and-runtime-supervision.md](../../../reference/agentic-engineering/deep-dives/governance-planes-trust-boundaries-and-runtime-supervision.md)
  should remain the compact concept extract, including the three-plane framing
  as reference-level guidance rather than new doctrine.
- [operating-model-and-topology.md](../../../reference/agentic-engineering/deep-dives/operating-model-and-topology.md)
  remains the broader operating-model route.
- [agentic-mechanism-inventory-baseline.md](../../../analysis/agentic-mechanism-inventory-baseline.md)
  should remain the supporting analysis-side inventory for mechanism-family
  coverage and gap tracking across this lane.
- [practice-aligned-direction-and-gap-baseline.md](../../../analysis/practice-aligned-direction-and-gap-baseline.md)
  is the companion analysis baseline for ecosystem direction-of-travel
  signals (governance projects, practice-methodology primitives, adjacent
  enablers). Pair-read with this report when assessing whether external
  trajectory has moved a previously deferred mechanism into the actionable
  zone.
- [agentic-engineering-system.md](../../../../docs/foundation/agentic-engineering-system.md)
  is a future candidate for a clearer explanation of governance planes and
  layered safeguard stack once the concepts stabilise.

## High-Impact Next-Step Candidates

1. **Bring forward the attempt / observed outcome / proven result structure**
   as the first evidence-lane enhancement. It is high value and low structural
   risk.
2. **Bring forward signal-routing language in the reviewer gateway lane** so
   the gateway is defined by what it does, not just by who it can call.
3. **Let operational awareness serve as the supervised-execution pilot** before
   formalising stronger authority or runtime-governance abstractions.
4. **Queue the boundary model and residual-risk surface as the first slice of
   the mechanism taxonomy lane** once the current adjacent plans produce enough
   evidence.

## Concepts to Defer or Reject

### Defer

- **Graduated authority**: promising, but the repo does not yet need a formal
  ladder before the operational-awareness pilot proves the pressure.
- **Adoption ladder mechanics**: conceptually useful, but better introduced
  after at least one successful local abstraction pass.

### Reject for now

- **Heavyweight runtime substrate by default**: the repo has not yet proved
  that a larger state store is necessary.
- **Source-specific naming or taxonomy import**: it adds dependency without
  improving local clarity.
- **Breadth for its own sake**: a wider mechanism map is only useful if it
  sharpens routing and decision quality.

## No-Change Rationale

- [practice.md](../../../practice-core/practice.md) remains unchanged in this
  pass because the findings are still repo-local abstractions, not yet
  travelling practice doctrine.
- [ADR-119](../../../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)
  and [ADR-150](../../../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
  remain unchanged because the work so far clarifies local mechanism language
  rather than establishing a new architectural decision.

## Closing View

The compared governance corpus is most valuable here as a mirror. It shows that
many local capabilities already exist, but some are being carried by utility
without a stable abstract name. The right response is not to copy a foreign
stack. It is to strengthen our own mechanism language, route concepts to the
correct surfaces, preserve net-new distinctions when they clarify local
behaviour, and adopt only what improves clarity, control, and evidence.
