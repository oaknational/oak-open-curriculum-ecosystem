# Operating-Model Mechanism Taxonomy - Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Related baseline**:
[agentic-mechanism-inventory-baseline.md](../../../analysis/agentic-mechanism-inventory-baseline.md)
**Related concept anchor**:
[operating-model-and-topology.md](../../../reference/agentic-engineering/deep-dives/operating-model-and-topology.md)

## Problem and Intent

The repo already names several major mechanism systems:

- the three-layer Practice model
- the knowledge flow and its governors
- continuity surfaces and the surprise pipeline
- vital integration surfaces
- reviewer and specialist infrastructure

The workbench topology note and the continuity-planning follow-on work exposed
another cross-cutting mechanism estate that is active in practice but not yet
cleanly named across doctrine:

- governance-plane vocabulary and boundary model
- interaction planes and disclosure boundaries
- action-governance boundary
- turn-level control loops and non-linear re-entry
- posture selection
- authority and precedence
- signals, sensors, alerts, relationship-confidence signals, and special feeds
- evidence surfaces as a mechanism family
- residual-risk surfaces and explicit do-not-govern boundaries
- signal ecology and routed feedback behaviour
- graduated authority and adoption ladder
- artefact economy and renewal triggers

Without a mechanism taxonomy, these patterns get rediscovered inside prompts,
plans, and local notes. Real utility then shows up as prompt bloat, flat
triage lists, or scattered signal handling rather than as reusable design
concepts.

The intent of this plan is to define a general mechanism taxonomy and
example-implementation map for the repo's agentic operating model without
prematurely promoting every local detail into Practice Core.

## Domain Boundaries and Non-Goals

### In scope

- defining the candidate mechanism families and their boundaries
- mapping each family to existing doctrine, current concrete implementations,
  and candidate future homes
- defining explicit governance-plane vocabulary where the repo currently has
  mechanism utility without a stable shared name
- distinguishing abstract mechanism types from local implementations
- identifying which families merit repo-local guidance only, which deserve
  future PDR or ADR consideration, and which should remain reference notes
- capturing example implementations for awareness, sensors, feedback, alerts,
  and signals across gates, reviewers, plans, and runtime surfaces
- locating durable homes for boundary model, signal ecology, and
  residual-risk concepts once adjacent lanes produce enough evidence
- clarifying where the workbench topology note is a local extract versus a
  portable candidate

### Out of scope

- immediate implementation of runtime state surfaces
- rewriting all prompts or commands
- replacing the operational-awareness, reviewer-gateway, or
  hallucination/evidence plans
- inventing a canonical sidecar store
- forcing platform-transport details into universal Practice doctrine
- reducing the work to a glossary with no routing or example mapping

## Candidate Mechanism Families

The initial baseline identifies these families:

1. governance-plane vocabulary and boundary model
2. action-governance boundary
3. interaction planes and disclosure boundaries
4. turn-level control loops and non-linear re-entry
5. posture selection
6. temporary operational ledgers
7. authority and precedence
8. signal ecology: signals, sensors, alerts, relationship-confidence signals, and
   special feeds
9. evidence surfaces and rendering discipline
10. residual-risk surfaces and explicit govern / do-not-govern boundaries
11. artefact economy and conservative proliferation
12. renewal triggers and freshness probes

This plan does not assume that every family will graduate to the same doctrinal
layer. Some may stay repo-local.

The future taxonomy lane should not re-open every routed concept as fresh debt.
For example, the **layered safeguard stack** already has a reference/deep-dive
home plus a concrete reviewer-gateway manifestation. This lane should reference
that concept where useful, but not build a second explanatory canon around it.

## Dependencies and Sequencing Assumptions

- The operational-awareness plan should pilot work-ledger and precedence
  concerns before those aspects are treated as portable candidates.
- The reviewer gateway work should provide live evidence for posture selection,
  signal routing, and escalation semantics.
- The hallucination/evidence plan continues to own evidence-bundle mechanics.
  This plan only provides the broader mechanism classification that explains
  where evidence surfaces sit in the wider operating model.
- The governance-concept integration lane has already routed
  `action-governance boundary`, `boundary model`, `signal ecology`,
  `residual-risk surface`, and `governance-plane vocabulary` here; this plan
  should make those homes explicit rather than leaving them stranded in the
  report layer.
- The cross-vendor sidecars plan remains separate adjacent work. This plan may
  inform its conceptual framing, but it should not collapse into storage design.
- Any Practice Core or PDR promotion requires evidence that the concept travels
  across more than one repo or more than one workstream shape.

## Success Signals

This plan is successful when:

- one stable mechanism-family map exists with boundaries and examples
- the operational-awareness, reviewer-gateway, and evidence lanes are clearly
  routed from that map
- candidate doctrine promotions are enumerated with reasons
- explicit defer decisions exist for concepts that are interesting but not yet
  justified as executable slices
- at least one family is explicitly kept local with rationale, preventing
  over-generalisation
- the hub, analysis lane, and future-plan index all route to the same source
  set without creating a second canon

## Risks and Unknowns

| Risk / unknown | Why it matters | Mitigation direction |
| --- | --- | --- |
| Over-abstraction of repo-local transport details | Local substrate facts may not travel well | Keep local examples explicit and require promotion evidence before doctrine changes |
| Duplication with existing ADR/PDR doctrine | A second taxonomy would create drift | Map to existing doctrine first and only fill real gaps |
| Treating any data point as a "signal" | The concept becomes too loose to teach or verify | Require each signal family to name source, consumer, and behavioural effect |
| Promotion pressure before bounded pilots exist | Abstract work may outrun evidence | Use the operational-awareness and reviewer-gateway lanes as evidence feeders |
| Taxonomy sprawl | A too-large taxonomy becomes another unread reference pile | Prefer a few strong families with examples and routing over exhaustive enumeration |

## Promotion Trigger

Promote this plan into `current/` only when all of the following are true:

1. the mechanism baseline and owner priorities identify a bounded first slice
2. at least one adjacent plan has produced live evidence relevant to that slice
3. the output home is explicit: repo-local guidance, human-facing docs, a
   PDR/ADR candidate, or a deliberate combination
4. the execution plan can validate the slice without rewriting the entire
   Practice at once

## Possible First Executable Slices

- action-governance boundary, boundary model, and governance-plane vocabulary
  map with concrete local examples
- precedence and disagreement-resolution contract
- signal ecology taxonomy with concrete examples
- residual-risk surface placement guidance
- artefact economy and surface-proliferation guidance

## Explicit Deferred Concepts

- **Graduated authority** — defer until the operational-awareness pilot and the
  reviewer-gateway lane both show that a formal authority ladder would solve a
  real local problem rather than merely rename existing precedence.
- **Adoption ladder** — defer until at least one mechanism family has moved
  from repo-local pilot to doctrine candidate and needs a staged uptake model.

## Implementation Detail Note

Any implementation detail captured here is reference context only. Final
execution choices belong to the later `current/` or `active/` plan.
