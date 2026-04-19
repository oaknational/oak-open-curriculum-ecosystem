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

Under the PDR-007 Core contract, PDRs are a **first-class Core
directory**. The Practice is organised with one always-required
Core package and one optional peer companion:

| Layer | Path | Role | Travels with Practice |
|---|---|---|---|
| **Core** | `.agent/practice-core/` | The Core package: trinity + verification + entry points + changelog + provenance + `decision-records/` (this directory) + `patterns/` + `incoming/`. The memotype. | Always — required. |
| **Context** | `.agent/practice-context/` | Optional ephemeral-exchange companion (sharpened under PDR-007). Sender-maintained `outgoing/`; transient receiver-side `incoming/`. | Optional — travels when sender chooses to include. |

`decision-records/` is inside the Core package; PDRs travel with
the Core by construction.

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

```
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
host-repo names as the carrier of meaning). Concept-level references
only. This matches the "concepts are the unit of exchange"
principle from the Practice Core (see `practice.md` Philosophy).

A host repo that hydrates this PDR directory should find every PDR
immediately usable without translation. Cross-references to
host-repo artefacts are allowed only in **Notes** sections, clearly
marked as host-local context and not carrying decision substance.

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
| [PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md) | Continuity Surfaces and the Surprise Pipeline | Accepted |
| [PDR-012](PDR-012-review-findings-routing-discipline.md) | Review-Findings Routing Discipline | Accepted |
| [PDR-013](PDR-013-grounding-and-framing-discipline.md) | Grounding and Framing Discipline | Accepted |
| [PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md) | Consolidation and Knowledge-Flow Discipline | Accepted |
| [PDR-015](PDR-015-reviewer-authority-and-dispatch.md) | Reviewer Authority and Dispatch Discipline | Accepted |
| [PDR-016](PDR-016-claim-propagation-and-reference-quality.md) | Claim Propagation and Reference Quality | Accepted |
| [PDR-017](PDR-017-workaround-hygiene-and-fix-discipline.md) | Workaround Hygiene and Fix-at-Source Discipline | Accepted |
| [PDR-018](PDR-018-planning-discipline.md) | Planning Discipline — End Goals and Workflow Contracts | Accepted |
| [PDR-019](PDR-019-adr-scope-by-reusability.md) | ADR Scope by Reusability, Not Diff Size | Accepted |
| [PDR-020](PDR-020-check-driven-development.md) | Check-Driven Development — Gates as Assertions | Accepted |
| [PDR-021](PDR-021-test-validity-discipline.md) | Test Validity Discipline — Circular Justification and Claim-Assertion Parity | Accepted |
| [PDR-022](PDR-022-governance-enforcement-scanners.md) | Governance Enforcement Requires a Scanner | Accepted |
| [PDR-023](PDR-023-documentation-structure-discipline.md) | Documentation Structure Discipline — README as Index | Accepted |
| [PDR-024](PDR-024-vital-integration-surfaces.md) | Vital Integration Surfaces Between Repo and Practice Core | Accepted |
| [PDR-025](PDR-025-quality-gate-dismissal-discipline.md) | Quality-Gate Dismissal Discipline | Accepted |
