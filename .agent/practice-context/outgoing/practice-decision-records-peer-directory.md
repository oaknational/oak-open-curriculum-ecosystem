# Practice Decision Records — A Third Peer Directory

**Originated**: 2026-04-17, in `oak-open-curriculum-ecosystem`.
**Status**: Provisional — "clumsy but functional for now," with explicit expectation that stable PDRs eventually integrate into the Core as refinements.
**Shape**: New peer directory at `.agent/practice-decision-records/`, alongside `.agent/practice-core/` and `.agent/practice-context/`. Four files at creation time (README + three PDRs).

## The Problem This Solves

The Practice accumulates decisions that govern **itself**: how it is
bootstrapped, how it propagates between repos, how foundational
documents relate to each other, how the fitness-function model
operates, how continuity artefacts interact with the surprise
pipeline, which editing agents may touch which files.

Before this layer existed, such decisions were recorded as
Architectural Decision Records inside the host repo's product-ADR
folder. That placed governance of a portable Practice inside a
single repo's non-portable documentation layer. When the Practice
Core plasmid hydrated into a new repo, these decisions did not
travel. Only their downstream operational consequences (rules,
commands, learned principles) arrived in the new repo, stripped of
their decision lineage. A new Practice steward inherited "this rule
exists" without "here is why this rule exists, who decided it, and
what alternatives were rejected."

The failure mode is rationale drift. A rule whose rationale is
invisible reads as arbitrary. Under pressure (fitness violations,
deduplication passes, compression requests), arbitrary rules get
weakened. The rationale must travel with the rule it anchors.

## The Decision Shape

A PDR is ADR-shaped but governs the Practice rather than a host
repo's product architecture:

- **Title** (`# PDR-NNN: Title`)
- **Status** (`Accepted` / `Superseded by <PDR-NNN>` / `Superseded by <Core section>`)
- **Date**
- **Related** (optional — links to other PDRs or Core sections; no host ADR numbers in the substance)
- **Context** — the observation, the pressure, the problem.
- **Decision** — what is decided, named as a constraint.
- **Rationale** — why this, not the alternatives. Name the alternatives.
- **Consequences** — what this requires, forbids, and accepts as cost.
- **Notes** (optional) — self-reference, migration implications, host-local context clearly fenced off.

Portability is a hard invariant: PDRs MUST NOT carry host-repo-specific
references in the substance of the decision. Host-local paths and
ADR numbers appear only inside clearly-marked **Notes** subsections
that name themselves as host-local context, not decision carrier.

## Three Peer Layers Under `.agent/`

| Layer | Path | Role | Travels |
|---|---|---|---|
| **Core** | `.agent/practice-core/` | Eight-file plasmid trinity + verification + entry points. The memotype. | Always — required. |
| **Context** | `.agent/practice-context/` | Optional companion. Sender-maintained `outgoing/`; transient receiver-side `incoming/`. Support material. | Optional — travels when sender chooses to include. |
| **Decision Records** | `.agent/practice-decision-records/` | Portable governance decisions about the Practice itself. | Travels as a complete directory when the sender includes it. |

The Core contract is unchanged. PDRs are **not** part of the
eight-file Core contract. They are a peer directory. This preserves
the compact, always-required Core package while giving Practice
doctrine a portable home.

## First Three PDRs (as adopted at the originating repo)

- **PDR-001 — Location of Practice Decision Records.** The
  self-referential meta-decision that establishes the directory.
  Names four options considered (status quo in host ADR folder,
  absorb into Core lineage, add to Core itself, new peer directory),
  adopts Option 4, and records the provisional/graduation intent.
- **PDR-002 — Pedagogical Reinforcement in Foundational Practice
  Docs.** Substantive doctrine: cross-document rule repetition in
  foundational documents is deliberate pedagogical reinforcement,
  not accidental duplication. Consolidation and fitness compression
  MUST NOT deduplicate rules across foundational Practice files.
- **PDR-003 — Sub-Agent Protection of Foundational Practice Docs.**
  Operational enforcement: sub-agents lack the cross-session and
  cross-file context needed to curate foundational documents.
  Records the three-component rationale (scoped context, curation-
  not-optimisation, invisible pedagogical weight) that host-repo
  permission rules can cite as their authority chain.

## Adoption Notes for Receiving Repos

This is an **optional peer directory**. Adopting it is not a Core
contract change; refusing it does not break the Core. If the
receiving repo decides the PDR layer is not yet useful, it can
integrate the three inbound PDRs as governance docs (or equivalent)
in its local convention.

If adopted:

1. Create `.agent/practice-decision-records/` at the top of `.agent/`,
   peer to `.agent/practice-core/`.
2. Copy the README and PDR-001 (the self-referential establishing
   decision) first. These define the layer's role locally.
3. Evaluate the substantive PDRs (PDR-002 onwards) at the concept
   level, per the Practice's "concepts are the unit of exchange"
   principle. A receiving repo may accept a PDR's substance while
   recording the acceptance in its own PDR-NNN with fresh
   numbering, or it may import the inbound PDR-NNN directly if the
   decision applies unchanged.
4. Wire the new peer directory into the Core's entry points: the
   "accompanied by" sentence in `practice-core/README.md`, the
   eight-files paragraph and Practice Box / Cold Start sections in
   `practice-core/index.md`, the Bootstrap Checklist in
   `practice-core/practice-verification.md`, and a CHANGELOG entry
   describing the adoption.
5. Consider refactoring any host-repo rule that operationalises a
   PDR's substance to cite the PDR rather than restate its rationale
   (e.g., a local "sub-agent may not edit foundational docs" rule
   citing PDR-003 as its authority chain).

## Open Questions the Receiving Repo May Want to Answer

- **Retroactive migration.** Does the receiving repo have existing
  Practice-governance ADRs in its product-ADR folder that now
  arguably belong as PDRs? Migration is a separate decision per
  PDR-001; the originating repo deferred it as well.
- **Graduation path.** When a PDR stabilises enough to integrate into
  the Core plasmid trinity as a refinement, what is the migration
  procedure? The originating repo expects a subsequent PDR will
  define this when the first graduation becomes pressing.
- **PDR supersession by Core sections.** When a PDR graduates into a
  Core section, the PDR should be marked `Superseded by <Core
  section>` and retained as historical provenance. This is recorded
  in the README but not yet exercised.

## What Did Not Change

- The eight-file Practice Core contract.
- The Context layer's role as optional sender-maintained companion.
- The "concepts are the unit of exchange" portability principle —
  strengthened, in fact, by the PDR layer's explicit host-local-
  context fencing convention.
- The bootstrap checklist's minimum operational estate (the Core
  remains the always-required package).
