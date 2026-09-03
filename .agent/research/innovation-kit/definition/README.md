# Proposed Oak Innovation Kit definition

- **Status:** proposed research definition; not ratified architecture
- **Strategic authority:** [Innovation Kit strategy](../../../../docs/strategy/stream-innovation-kit.md)
- **Local index:** [Innovation Kit research](../README.md)
- **Purpose:** make the complete product-creation system legible, contestable and usable without
  selecting implementation topology or providers

This corpus describes the Innovation Kit as the portable, governed part of a complete
product-creation system. It is deliberately split by responsibility. No single document is the
definition on its own; the index supplies reader routes and each linked document owns one concern.

Within this proposed corpus, **must** means that a future Kit claiming conformance would need to
satisfy the statement or record a competent, evidence-backed non-applicability decision. It does
not mean the repository already implements the capability or that the proposal has been ratified.

## Definition map

| Document | Single responsibility |
| --- | --- |
| [Concept lineage and foundational thesis](concept-lineage-and-thesis.md) | Why the Kit exists, what came before it, the fast-and-good thesis, governing doctrine and non-goals |
| [System and authority model](system-and-authority-model.md) | Core vocabulary, correspondence planes, authority boundaries, seam rule and relationship between the model's axes |
| [Outcomes, quality and human authority](outcomes-quality-and-human-authority.md) | Human, educational, public, service, accessibility, trust, difficult-state and remedy obligations |
| [Capability and contract model](capability-and-contract-model.md) | What a capability means, the complete obligation envelope, capability families, explicit absence and adapter/binding boundaries |
| [Composition profiles and elevation](composition-profiles-and-elevation.md) | Applicability, obligation activation, declared profiles, the creator's input and decision budget, semantic-core preservation and the boundary between elevation and redesign |
| [Core records and interfaces](core-records-and-interfaces.md) | The stable conceptual records that let the other parts refer to one another without copying prose |
| [Operating pipelines](operating-pipelines.md) | Closed proposition, operation, authority/release and Kit-evolution loops through time |
| [Evidence, learning and decision](evidence-learning-and-decision.md) | Claim classes, evidence discipline, falsifiers, dispositions, return routes and evaluation of the fast-and-good thesis |
| [Developer and agent experience](developer-and-agent-experience.md) | The end-to-end experience of discovering, declaring, composing, diagnosing, changing and contributing safely |
| [Stewardship, evolution and adoption](stewardship-evolution-and-adoption.md) | Investment posture, placement, contribution, reuse, divergence, compatibility, migration, provider exit, deprecation, preservation and retirement |

Supporting material is deliberately outside the definition:

- [current-estate evidence](../evidence/current-estate-2026-08-30.md) says what is demonstrated,
  partial, proposed, absent or unknown at one repository pin;
- the [source and provenance map](../evidence/source-and-provenance-map.md) says which evidence can
  support which kind of claim;
- [worked scenarios](../scenarios/README.md) exercise and challenge the model without governing it;
- the [web-app deconstruction](../web-app-deconstruction/README.md) preserves historical analysis,
  examples, difficult cases and low-confidence hypotheses.

## Reader routes

| Question | Route |
| --- | --- |
| I have an idea or consequential question | [Thesis](concept-lineage-and-thesis.md) → [outcomes and quality](outcomes-quality-and-human-authority.md) → [composition](composition-profiles-and-elevation.md) → [evidence and decision](evidence-learning-and-decision.md) |
| I own curriculum, domain, pedagogy, design, policy or another source of meaning | [System and authority](system-and-authority-model.md) → [capability contracts](capability-and-contract-model.md) → [operating pipelines](operating-pipelines.md) |
| I am creating a bounded demonstration | [Composition](composition-profiles-and-elevation.md) → [records](core-records-and-interfaces.md) → [developer experience](developer-and-agent-experience.md) → [scenarios](../scenarios/README.md) |
| I am exposing or sustaining a public experience | [Outcomes and quality](outcomes-quality-and-human-authority.md) → [composition](composition-profiles-and-elevation.md) → [pipelines](operating-pipelines.md) → [stewardship](stewardship-evolution-and-adoption.md) |
| I am elevating an existing experience | [Composition and elevation](composition-profiles-and-elevation.md) → [records](core-records-and-interfaces.md) → [pipelines](operating-pipelines.md) → [evidence](evidence-learning-and-decision.md) |
| I need to know what exists now | [Dated current-estate evidence](../evidence/current-estate-2026-08-30.md) |
| I want to contribute recurring capability | [Capability contracts](capability-and-contract-model.md) → [developer experience](developer-and-agent-experience.md) → [stewardship](stewardship-evolution-and-adoption.md) |
| I am an agent deciding what is authoritative | This index → [system vocabulary](system-and-authority-model.md) → the task-specific [record](core-records-and-interfaces.md) → governing contract; examples last |

Reader routes are decision routes, not job-title silos. One person may hold several roles; the
model keeps proposition ownership, semantic authority, method authority, disposition authority,
service ownership, runtime operation, Kit stewardship and rights duties distinct.

## Boundary of this definition

This corpus defines a problem and a proposed contract system. It does not:

- select an application framework, package topology, cloud host, database, ORM, vector store,
  identity provider, queue, observability service or agent framework;
- imply that every capability family must be implemented before any experience can exist;
- lower quality for an early profile or equate a public URL with production readiness;
- transfer curriculum, pedagogical, design, policy, evidence or product authority into the Kit;
- turn the seven analytical capability families into packages, teams or services; or
- prescribe the first implementation proof. Later implementation planning consumes this
  definition after its conceptual and authority boundaries are reviewed.
