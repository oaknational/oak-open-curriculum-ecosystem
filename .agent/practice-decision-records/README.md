# Practice Decision Records

**Status**: Provisional — clumsy but functional.
**Established**: 2026-04-17.
**Established by**: [PDR-001](PDR-001-location-of-practice-decision-records.md).

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

The Practice is organised into three peer layers under `.agent/`:

| Layer | Path | Role | Travels with Practice |
|---|---|---|---|
| **Core** | `.agent/practice-core/` | The eight-file plasmid trinity + verification + entry points. The memotype. | Always — required. |
| **Context** | `.agent/practice-context/` | Optional companion. Sender-maintained `outgoing/`; transient receiver-side `incoming/`. | Optional — travels when sender chooses to include. |
| **Decision Records** | `.agent/practice-decision-records/` | Authoritative governance decisions about the Practice itself. | Travels with the Practice; carried alongside Core when hydrating. |

PDRs are **not** part of the eight-file Core contract. They are a
peer directory. The Core remains the compact, always-required
package. PDRs are the "why we decided it is this shape" layer
surrounding the Core.

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
| [PDR-001](PDR-001-location-of-practice-decision-records.md) | Location of Practice Decision Records | Accepted |
| [PDR-002](PDR-002-pedagogical-reinforcement-in-foundational-practice-docs.md) | Pedagogical Reinforcement in Foundational Practice Docs | Accepted |
| [PDR-003](PDR-003-sub-agent-protection-of-foundational-practice-docs.md) | Sub-Agent Protection of Foundational Practice Docs | Accepted |
