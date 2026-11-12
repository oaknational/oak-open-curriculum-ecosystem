# ADR-233: Retain the OCE framework and publish configurable mechanisms

- **Status:** Accepted (as direction, 10 October 2026, from the owner's explicit
  architecture commission). The detailed designs and new delivery nodes remain
  proposals; this record does not ratify them or claim implementation.
- **Scope:** This Engraph development line. Oak is a separate, read-only evidence
  source. Eventual reconciliation does not determine its destination or timing.
- **Amends:** [ADR-227](227-oak-product-in-its-own-repository.md), on the scopes
  identified below. Preserves [ADR-230](230-own-built-algorithm-and-data-structure-foundations.md)
  and [ADR-231](231-organisational-identity-below-the-tree.md).

## Context

Moving product repositories is insufficient to make reusable capabilities coherent
or product instances independently maintainable. The earlier extraction design
already required public packages, useful thin consumers and a per-workspace cut.
Subsequent direction strengthens that boundary and connects it with Capability
Foundations (CF), layered data models and end-to-end integrity.

The owner commissioned the complete desk-research and programme design, including
Engraph documentary incorporation, on 10 October 2026. That authorises this
documentation change; application implementation, publication, migration and
deployment are subsequent commissions. No team measurement or team studies form
part of this programme's design or its acceptance requirements.

## Decision

1. **OCE remains the full capability innovation kit and framework.** Its monorepo
   retains foundations, domain capabilities, shared data infrastructure, package
   source, development and experimentation facilities, composition, assurance and
   operating mechanisms. Today's app dependencies do not define its outer scope.
2. **All mechanisms and potentially reusable material remain in OCE.** Potential
   reuse is enough; a second consumer is not an admission condition. External
   application repositories contain only instance-specific configuration and
   declarative references to published mechanisms. Host execution, composition
   execution, policy execution, validation, provisioning and operating automation
   are mechanisms too. A generated adapter remains a distributed OCE artefact,
   never an independently authored app-side mechanism.
3. **Ordinary behaviour changes require zero OCE changes in most cases.** Expressive,
   typed, validated and documented configuration must support ordinary variation
   against already published packages, without an OCE edit or new release. A new
   reusable capability is an honest exception; a missing ordinary configuration
   control is a design gap. Training supports this architecture; it does not
   substitute for it. Thinness is responsibility, not a line-count target.
4. **Published supported contracts are the external consumption boundary.** An
   independently handed-over app builds, validates and runs without an OCE checkout,
   copied internals, workspace/path dependencies or git-URL dependencies on OCE.
   Creation and reliable publication of the required packages are work, not an
   assumed existing facility. Preserve deliberate licence and provenance surfaces.
5. **Prefer CF first, without an all-CF gate.** CF construction and core extraction
   are different dimensions of one programme. Prioritise affected foundations and
   keep the wider reconstruction programme visible. Contract design, release work
   and thinning in place may proceed in parallel where their prerequisites permit.
   Earlier handover needs a concrete constraint, complete supported packages and an
   explicit CF continuation; no deadline or exception is supplied by this record.
6. **Layer the data responsibilities.** A central curriculum model is the starting
   direction; domain models and app-oriented projections can add useful semantics.
   Their reusable modelling, transformation and access mechanisms stay in OCE.
   This is not one universal schema, database, runtime or intermediate representation.
7. **Preserve required integrity from source to consumer and integrate Castr.**
   Identity, required meaning, type/schema obligations, provenance and applicable
   authority must survive the consequential boundaries. Common custody makes this
   easier to govern but does not prove it. Castr integration is settled direction;
   its exact profile, technical method and claims require explicit evidence.
8. **Keep search operational delivery separately scoped and connected.** OCE owns
   reusable source, infrastructure definitions and automation. Independently
   optimised instances are configured consumers. Provisioning, updates, deletions,
   recovery, rebuilds and operation have their own delivery design; completion of
   all search operations is not a blanket architecture or app-extraction gate.
9. **Keep the invariant set open.** The controlling architecture must discover and
   refine further invariants, distinguish direction from derived obligations and
   design choices, and preserve interactions and unresolved decisions.

## Specific amendments and preserved obligations

| Earlier statement                                                                       | Current disposition                                                                                                                                         |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADR-227 permits product domain logic in the external repository                         | Superseded for executable mechanisms: instance configuration only; reusable domain logic and interpreters remain in OCE.                                    |
| ADR-227 puts extraction before remaining estate relocation                              | Replaced in this Engraph programme by CF-first preference with actual dependency edges. Publication remains a prerequisite to external consumption.         |
| ADR-227's success metric measures how often a squad visits OCE                          | Replaced by representative desk scenarios and subsequent technical contract checks. No measurement of teams is commissioned.                                |
| ADR-227's initial MCP/search packaging                                                  | Historical selected product grouping; search service/index and repository decisions are now explicit separate questions. No new repository list is adopted. |
| ADR-227's registry boundary, finish-before-handover, licences and consumer independence | Retained. Source custody does not prove publication or installed consumption.                                                                               |
| One repository release version initially                                                | Retained as the initial release policy. Later lifecycle groups remain the release programme's work; this ADR selects no new release tool.                   |
| Engraph ADR-230's owned algorithm/data-structure foundations                            | Retained at its declared scope. It does not mandate replacement of every runtime, protocol or managed service.                                              |
| Standalone Practice direction                                                           | Retained as a distinct track. Reusable Practice, technology bindings and institutional policy must not become competing canonical copies.                   |

Oak PR1000 is a proposed input, not the governing topology here. Its product and
distribution concerns can inform compatible instances and generated outputs;
neither its five names nor its status wording supersedes this direction. No Oak
repository or PR interaction is authorised by this record.

## Consequences and evidence boundary

The [controlling architecture](../oce-architecture.md) explains the logical roles,
invariants and interfaces. The [configuration contract](../oce-configuration-contracts.md)
and [integrity specification](../oce-integrity-and-castr.md) are proposed detailed
designs within this direction. The native plan estate owns implementation sequence
and acceptance, with honest sketch/ratified status.

No current capability is claimed solely because it has a package manifest, a
proposed contract, a source file or an accepted decision. CF qualification,
publication, installed consumption, operated service and useful educational
outcome require different evidence. The programme serves both current consumers
and future innovation without claiming either service is complete.

Reopen a derived design when its source contract, consumer requirement or adverse
case changes. Reopen this direction only on an explicit owner decision; do not
reinterpret an implementation difficulty as permission to disperse mechanisms.
