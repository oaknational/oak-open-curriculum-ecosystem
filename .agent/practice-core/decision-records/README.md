# Practice Decision Records

**Status**: First-class Core directory (promoted from peer-directory per PDR-007).
**Established**: 2026-04-17 (as peer directory per PDR-001); promoted to Core 2026-04-18 (PDR-007).
**Established by**: [PDR-001](PDR-001-location-of-practice-decision-records.md); current shape defined by [PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md).

## What This Is

Practice Decision Records (PDRs) are decisions that govern **the
Practice itself** — its structure, its doctrine, its own governance —
as distinct from decisions that govern a host repo's product
architecture (which live in that repo's Architectural Decision
Records).

The Practice is portable. It travels between repos as the Practice
Core plasmid. Decisions that govern the Practice must travel with
it. A PDR recorded in one repo should be readable, understandable,
and authoritative in any repo that hydrates the same Practice.

## Relationship to the Practice Core and Context

Under the PDR-007 Core contract (as amended 2026-04-29), PDRs are a
**first-class Core directory**. The Practice is organised as the
Core package alone:

| Layer | Path | Role | Travels with Practice |
|---|---|---|---|
| **Core** | `.agent/practice-core/` | The Core package: trinity + verification + entry points + changelog + provenance + `decision-records/` (this directory) + `incoming/`. The memotype. | Always — required. |

`decision-records/` is inside the Core package; PDRs travel with
the Core by construction. The previous `patterns/` Core directory
and `practice-context/` peer companion were retired 2026-04-29
(PDR-007 amendment); patterns now live host-side as engineering
instances (in the host's pattern memory surface) or as PDRs with
`pdr_kind: pattern` (governance). Inbound Practice exchange uses
`incoming/`; outbound substance routes by shape per PDR-024
amendment 2026-04-29.

## Intended Evolution

This is provisional by design. The current arrangement is a staging
ground. Over time, stable PDRs are expected to integrate into the
Core as refinements to the plasmid trinity (`practice.md`,
`practice-lineage.md`, `practice-bootstrap.md`) where their
substance naturally belongs. A PDR that graduates in this way
should be marked `Superseded by <Core section>` and retained as
historical provenance.

Until that integration path is routinely travelled, the PDR
directory exists as an explicit, visible surface for Practice
governance decisions that would otherwise have no portable home.

## Numbering and Naming

PDRs are numbered sequentially from `PDR-001`:

```text
PDR-NNN-kebab-case-title.md
```

Numbers are not reused. Superseded PDRs stay in place with a
`Superseded by` header; they are not deleted.

## Shape of a PDR

Each PDR follows a stable shape inherited from the ADR convention:

- **Title** (`# PDR-NNN: Title`)
- **Status** (`Proposed` / `Accepted` / `Superseded by <PDR-NNN>` /
  `Superseded by <Core section>`)
- **Date**
- **Related** (optional — links to other PDRs, Core sections, or
  concept-level references; avoid host-repo ADR numbers inside the
  substance of a PDR — they do not travel)
- **Context** — what problem, what observation, what pressure.
- **Decision** — what is decided. Name the constraint clearly.
- **Rationale** — why this, not the alternatives. Name the
  alternatives.
- **Consequences** — what this enables, what it costs, what it
  forbids.
- **Notes** (optional) — self-reference, migration implications,
  follow-ups.

## Portability Constraint

PDRs are portable content. They MUST NOT depend on host-repo
specifics (no host ADR numbers, no host file paths as substance, no
host-repo names as the carrier of meaning, no commit SHAs or
commit-subject citations). Concept-level references only. This
matches the "concepts are the unit of exchange" principle from the
Practice Core (see `practice.md` Philosophy).

A host repo that hydrates this PDR directory should find every PDR
immediately usable without translation. The only outgoing link
allowed from any PDR is to the stable bridge index
`.agent/practice-index.md` (or its host equivalent at the same
location). Cross-Core references (PDR↔PDR within this directory,
links to the trinity files `practice.md`, `practice-lineage.md`,
and `practice-bootstrap.md`) remain — they are internal connective
tissue, not host leakage.

Host-specific worked instances may motivate a PDR but MUST NOT be
recorded inside it as host-local context, host-local notes, or
"this repo only" sections. The host-side adoption is recorded in
the host's bridge index and ADR surface, not in the PDR.

Two narrow carve-outs (the host's distilled-doctrine entry on
Practice-Core portability ratifies both — see the bridge index
[Practice-Core concept ↔ ADR map](../../practice-index.md#practice-core-concept--adr-map)):

1. **Practice-canonical directory references** describing the
   Practice's own canonical layout (`.agent/skills/`, `.agent/rules/`,
   `.agent/memory/`, `.agent/state/`, etc.) are portable structural
   contract, not host leakage — `.agent/` IS the Practice's
   canonical home per [PDR-009](PDR-009-canonical-first-cross-platform-architecture.md)
   and the [PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
   Core-package contract.
2. **External http(s) citations** to durable third-party material
   (RFCs, vendor specifications, public standards) are permitted —
   the constraint targets repo-internal leakage, not citation of
   external standards.

## Index

| # | Title | Status |
|---|---|---|
| [PDR-001](PDR-001-location-of-practice-decision-records.md) | Location of Practice Decision Records | Superseded in part by [PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md) |
| [PDR-002](PDR-002-pedagogical-reinforcement-in-foundational-practice-docs.md) | Pedagogical Reinforcement in Foundational Practice Docs | Accepted |
| [PDR-003](PDR-003-sub-agent-protection-of-foundational-practice-docs.md) | Sub-Agent Protection of Foundational Practice Docs | Accepted |
| [PDR-004](PDR-004-explorations-as-durable-design-space-tier.md) | Explorations as Durable Design-Space Tier | Accepted |
| [PDR-005](PDR-005-wholesale-practice-transplantation.md) | Wholesale Practice Transplantation as a Third Genesis Scenario | Accepted |
| [PDR-006](PDR-006-dev-tooling-per-ecosystem.md) | Dev Tooling Per Ecosystem — Leading-Edge Reference Repos | Accepted |
| [PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md) | Promoting PDRs and Universal Patterns to First-Class Core Infrastructure | Accepted |
| [PDR-008](PDR-008-canonical-quality-gate-naming.md) | Canonical Quality-Gate Naming | Accepted |
| [PDR-009](PDR-009-canonical-first-cross-platform-architecture.md) | Canonical-First Cross-Platform Architecture for Agent Artefacts | Accepted |
| [PDR-010](PDR-010-domain-specialist-capability-pattern.md) | Domain Specialist Capability Pattern — Adding New Expertise to the Agent Ecosystem | Accepted |
| [PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md) | Continuity Surfaces and the Surprise Pipeline | Accepted (amended 2026-04-21) |
| [PDR-012](PDR-012-review-findings-routing-discipline.md) | Review-Findings Routing Discipline | Accepted |
| [PDR-013](PDR-013-grounding-and-framing-discipline.md) | Grounding and Framing Discipline | Accepted |
| [PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md) | Consolidation and Knowledge-Flow Discipline | Accepted |
| [PDR-015](PDR-015-reviewer-authority-and-dispatch.md) | Reviewer Authority and Dispatch Discipline | Accepted (amended 2026-04-21, 2026-04-25, 2026-04-26) |
| [PDR-016](PDR-016-claim-propagation-and-reference-quality.md) | Claim Propagation and Reference Quality | Accepted |
| [PDR-017](PDR-017-workaround-hygiene-and-fix-discipline.md) | Workaround Hygiene and Fix-at-Source Discipline | Accepted |
| [PDR-018](PDR-018-planning-discipline.md) | Planning Discipline — End Goals and Workflow Contracts | Accepted |
| [PDR-019](PDR-019-adr-scope-by-reusability.md) | ADR Scope by Reusability, Not Diff Size | Accepted (amended 2026-04-21) |
| [PDR-020](PDR-020-check-driven-development.md) | Check-Driven Development — Gates as Assertions | Accepted |
| [PDR-021](PDR-021-test-validity-discipline.md) | Test Validity Discipline — Circular Justification and Claim-Assertion Parity | Accepted |
| [PDR-022](PDR-022-governance-enforcement-scanners.md) | Governance Enforcement Requires a Scanner | Accepted |
| [PDR-023](PDR-023-documentation-structure-discipline.md) | Documentation Structure Discipline — README as Index | Accepted |
| [PDR-024](PDR-024-vital-integration-surfaces.md) | Vital Integration Surfaces Between Repo and Practice Core | Accepted |
| [PDR-025](PDR-025-quality-gate-dismissal-discipline.md) | Quality-Gate Dismissal Discipline | Accepted |
| [PDR-026](PDR-026-per-session-landing-commitment.md) | Per-Session Landing Commitment | Accepted (amended 2026-04-21, 2026-04-22, 2026-04-26) |
| [PDR-027](PDR-027-threads-sessions-and-agent-identity.md) | Threads, Sessions, and Agent Identity | Accepted |
| [PDR-028](PDR-028-executive-memory-feedback-loop.md) | Executive-Memory Feedback Loop | Accepted |
| [PDR-029](PDR-029-perturbation-mechanism-bundle.md) | Perturbation-Mechanism Bundle | Accepted (amended 2026-04-25, 2026-04-27) |
| [PDR-030](PDR-030-plane-tag-vocabulary.md) | Plane-Tag Vocabulary | Accepted |
| [PDR-031](PDR-031-build-vs-buy-attestation.md) | Build-vs-Buy Attestation Pre-ExitPlanMode | Accepted |
| [PDR-032](PDR-032-reference-tier-as-curated-library.md) | Reference Tier as Curated Library | Accepted |
| [PDR-033](PDR-033-vendor-doc-review-for-unknown-unknowns.md) | Vendor-Doc Review for Unknown Unknowns in Third-Party Platform Plans | Accepted |
| [PDR-034](PDR-034-test-fixtures-encode-production-shape.md) | Test Fixtures Encode Production Shape, Not the Code's Expectation | Accepted |
| [PDR-035](PDR-035-agent-work-capabilities-belong-to-the-practice.md) | Agent Work Capabilities Belong to the Practice | Accepted |
| [PDR-036](PDR-036-friction-as-structural-finding.md) | Friction as Structural Finding | Accepted |
| [PDR-037](PDR-037-substrate-vs-axis-plan-categorisation.md) | Substrate-vs-Axis Plan Categorisation | Accepted |
| [PDR-038](PDR-038-stated-principles-require-structural-enforcement.md) | Stated Principles Require Structural Enforcement | Accepted |
| [PDR-039](PDR-039-external-findings-reveal-local-detection-gaps.md) | External Findings Reveal Local Detection Gaps | Accepted |
| [PDR-040](PDR-040-pin-to-maintainer-latest-not-highest-version.md) | Pin to Maintainer-Latest, Not Highest Version | Accepted |
| [PDR-041](PDR-041-composition-obscurity-investigation-methodology.md) | Composition-Obscurity Investigation Methodology | Accepted |
| [PDR-042](PDR-042-signal-distinguishing-pre-action-gate.md) | Signal-Distinguishing Pre-Action Gate | Accepted |
| [PDR-043](PDR-043-rush-impulse-three-structural-cues.md) | Rush-Impulse Three Structural Cues | Accepted |
| [PDR-044](PDR-044-memetic-immune-system.md) | Memetic Immune System | Accepted (amended 2026-05-21) |
| [PDR-045](PDR-045-workspace-first-investigation-discipline.md) | Workspace-First Investigation Discipline | Accepted |
| [PDR-046](PDR-046-layered-knowledge-processing.md) | Layered Knowledge Processing — Preserve First, Restructure Second | Accepted |
| [PDR-047](PDR-047-rule-applies-always-doctrine-authoring.md) | The Rule Applies, Always — Doctrine-Authoring Discipline | Accepted |
| [PDR-048](PDR-048-insight-capture-at-moment-of-occurrence.md) | Insight Capture at the Moment of Occurrence | Accepted |
| [PDR-049](PDR-049-memory-and-state-file-merge-semantics.md) | Memory and State File Merge Semantics | Accepted |
| [PDR-050](PDR-050-state-memory-substrate-contracts.md) | State and Memory Substrate Contracts | Accepted |
| [PDR-051](PDR-051-vendor-agnostic-skills-standardisation.md) | Vendor-Agnostic Skills Standardisation | Accepted |
| [PDR-052](PDR-052-directive-file-context-budget.md) | Directive-File Context Budget | Accepted |
| [PDR-053](PDR-053-orchestrator-vs-gate-structural-cure.md) | Orchestrator-vs-Gate Structural Cure (Advisory Polarity) | Accepted |
| [PDR-054](PDR-054-asymmetric-cure-discipline.md) | Asymmetric-Cure Discipline | Accepted |
| [PDR-055](PDR-055-cli-affordance-set-discipline.md) | CLI Affordance-Set Discipline for Coordination Tooling | Accepted |
| [PDR-056](PDR-056-inter-agent-collaboration-protocol.md) | Inter-Agent Collaboration Protocol — Ten Named Cures | Accepted |
| [PDR-057](PDR-057-empirical-answerability.md) | Empirical-Answerability Pre-Question Gate | Accepted (supersedes quarantined `apply-don't-ask`) |
| [PDR-058](PDR-058-three-tier-optionality-decomposition.md) | Three-Tier Optionality Decomposition | Accepted (supersedes quarantined `stop-inventing-optionality`) |
| [PDR-059](PDR-059-regenerator-output-classification.md) | Regenerator-Output Classification Discipline | Accepted |
| [PDR-060](PDR-060-tooling-friction-is-first-class-user-feedback.md) | Tooling Friction Is First-Class User Feedback | Accepted |
| [PDR-061](PDR-061-agent-pronoun-default-and-conduct-correction-graduation.md) | Agent Pronoun Default and Conduct-Correction Graduation | Accepted |
| [PDR-062](PDR-062-absorption-adjacent-failure-modes.md) | Absorption-Adjacent Failure Modes | Accepted |
| [PDR-063](PDR-063-mid-cycle-retirement-protocol.md) | Mid-Cycle Retirement Protocol for Token-Bounded Agents | Proposed |
| [PDR-064](PDR-064-coordinator-handoff-two-moments.md) | Coordinator Handoff — Pre-Positioning vs Active-Acknowledgement | Proposed |
| [PDR-065](PDR-065-grounding-cost-amortisation-under-rotation.md) | Grounding-Cost Amortisation Under Rotating-Cast Operation | Proposed |
| [PDR-066](PDR-066-comms-events-as-failure-mode-channel.md) | Comms-Events as Real-Time Failure-Mode Capture Channel | Proposed |
| [PDR-067](PDR-067-surface-classification-for-fitness-response.md) | Surface Classification for Fitness-Response Routing | Proposed |
| [PDR-068](PDR-068-pipeline-back-pressure-as-structural-cure-signal.md) | Pipeline Back-Pressure as Structural-Cure Signal | Proposed |
| [PDR-069](PDR-069-doctrine-first-vs-first-principles-diversity.md) | Doctrine-First and First-Principles Reasoning Are Cognitive-Approach Diversity | Draft |
| [PDR-070](PDR-070-moment-of-decision-heuristic-consolidation.md) | Moment-of-Decision Heuristic Consolidation | Draft |
| [PDR-071](PDR-071-coordinator-allocates-without-gating.md) | Coordinator Allocates Without Gating | Proposed |
| [PDR-072](PDR-072-knowledge-curation-as-autonomic-learning.md) | Knowledge Curation as Autonomic Learning | Proposed |
| [PDR-073](PDR-073-recursion-as-method-is-practice-core-mind-shape.md) | Recursion as Method Is Practice Core's Mind-Shape | Proposed |
| [PDR-074](PDR-074-director-value-is-mind-coherence-per-owner-attention.md) | Director Value Is Mind-Coherence-Per-Owner-Attention | Candidate |
| [PDR-076](PDR-076-agent-identity-tuple-and-body-file-frontmatter.md) | Agent Identity Tuple and Body-File Frontmatter (SPLIT stub) | Superseded |
| [PDR-076a](PDR-076a-agent-identity-tuple-name-and-uuid.md) | Agent Identity Tuple `(name, UUID id)` | Accepted |
| [PDR-076b](PDR-076b-body-file-frontmatter-contract.md) | Body-File Frontmatter Contract | Accepted |
| [PDR-077](PDR-077-marshal-as-cycle-discipline.md) | Commit Marshal As Cycle-Discipline Role | Accepted |
| [PDR-078](PDR-078-liveness-heartbeat-contract.md) | Liveness-Heartbeat Contract | Candidate |
| [PDR-079](PDR-079-pdr-vs-adr-portability-distinction.md) | PDR-vs-ADR Portability Distinction | Accepted |
| [PDR-080](PDR-080-coordination-event-absorption-is-signal-driven.md) | Coordination-Event Absorption Is Signal-Driven | Accepted |
