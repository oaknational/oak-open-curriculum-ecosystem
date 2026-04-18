# PDR-005: Wholesale Practice Transplantation as a Third Genesis Scenario

**Status**: Accepted
**Date**: 2026-04-18
**Related**: [PDR-001](PDR-001-location-of-practice-decision-records.md)
(numbering); [PDR-004](PDR-004-explorations-as-durable-design-space-tier.md)
(transplant manifests ARE explorations — the tier's inaugural use case).

## Context

The Practice has historically recognised two genesis scenarios:

1. **Plasmid integration** — Core arrives in a Practice-bearing repo via
   `.agent/practice-core/incoming/`; the receiving Practice absorbs
   useful concepts via the Integration Flow in `practice-lineage.md`.
2. **Cold-start hydration** — Core + PDRs arrive in a Practice-free
   repo; the hydrating agent grows a Practice from the templates in
   `practice-bootstrap.md`.

A **third scenario** has been observed empirically across multiple
manual rollouts: wholesale transplantation of a fully-hydrated applied
Practice from one repo into another Practice-free repo, carrying not
just the portable Core but the full applied phenotype — directives,
rules, skills, commands, reviewers, ADRs, governance docs, memory
structures, plans, the practice-index. The receiving repo has no prior
Practice to integrate with; unlike cold-start, the source carries a
mature Practice rather than a set of templates.

The observed failure modes in manual transplantation:

- **Foreign antigens** — source-repo references (ADR numbers, plan
  paths, workspace identifiers, domain-specific names) survive the
  transplant and produce broken references in the destination.
- **Incomplete transitions** — the destination has some artefacts
  fully adapted, some partially adapted, some still source-shaped.
- **Contradictions** — adapted directives say X while unadapted ADRs
  say Y; the transplanted Practice is internally inconsistent.

These are symptoms of the same underlying cause: the Practice Core is
portability-disciplined at the file level (PDR-003, Core self-
containment), but the rest of the applied Practice has an **unnamed
portability gradient**. Some rules are nearly portable (universal
principles), some are hybrid (language-specific patterns wrapped
around general principles), some are explicitly local (practice-index,
memory files, plans). Transplantation is the first event that forces
the gradient to become legible — and without a vocabulary for it, the
legibility happens by eyeball and fails silently.

## Decision

**Wholesale Practice transplantation is a named third genesis scenario
with its own process, vocabulary, and success criteria, distinct from
plasmid integration and cold-start hydration.**

### The portability gradient

Every artefact in an applied Practice sits on a gradient with four
positions:

| Position | Meaning | Transplant behaviour |
|----------|---------|----------------------|
| **fully-portable** | Content that applies unchanged across ecosystems (universal principles, most agent-prompt patterns, most reviewer roster shapes). | Copy verbatim. |
| **portable-with-adaptation** | Content whose structure is universal but whose examples, file extensions, tool names, or test conventions are ecosystem-specific (testing-strategy's unit/integration distinction; principles.md where it names `vitest` or `pytest`). | Copy and rewrite the ecosystem-specific surface. Preserve the structural claim. |
| **hybrid** | Content where portable structure interleaves with local substance (ADRs where the decision pattern is general but the specific decision is host-specific; governance docs where universal discipline wraps domain-specific examples). | Extract the portable structure into a local version; rewrite the local substance to match the destination's domain. |
| **local** | Content that is explicitly and intentionally host-specific (practice-index, memory files, plans, repo-specific workspace names). | Do not copy. Create new-host equivalents from scratch. |

Each artefact in the source Practice has a **default position** on the
gradient, and individual instances within an artefact class can deviate
from the default. The classification is explicit rather than implicit:
it is recorded in a transplant manifest that survives the transplant as
part of the destination's history.

### The process

Transplantation runs in three phases:

1. **Classification (RED)** — produce a **transplant manifest** as an
   exploration document in the destination repo's `docs/explorations/`
   (per PDR-004). One row per source file or file-group, carrying:
   source path; gradient position; destination path (if different);
   adaptation notes; owner-decision status if ambiguous. No file is
   copied during this phase. The manifest IS the RED specification of
   what the transplant will produce.

2. **Execution (GREEN)** — walk the manifest. For each row: copy-
   verbatim (fully-portable), copy-and-rewrite (portable-with-
   adaptation), extract-and-rewrite (hybrid), or create-from-scratch
   (local). Every row reaches a completed state; no row is left
   unhandled. The destination Practice becomes structurally present.

3. **Four-audit close** — the destination Practice passes four audits
   that cold-start hydration does not require:
   - **Foreign-antigen audit** — grep for source-repo names, paths,
     ADR numbers, workspace identifiers; every hit must resolve to a
     destination equivalent or be documented as intentionally
     retained (e.g. a historical note in an ADR).
   - **Completeness audit** — every concept in the source Practice
     has a representative in the destination, even if the artefact
     shape differs. Missing concepts are either intentional omissions
     (recorded in `practice-index.md` per the existing deliberate-
     omission discipline) or gaps.
   - **Cohesion audit** — the destination Practice does not
     contradict itself. Adapted directives and unadapted ADRs must
     reconcile; if they don't, one of them is wrong.
   - **Manifest-closure audit** — every line of the transplant
     manifest has been executed or explicitly rejected with written
     rationale; no rows remain in unknown state.

### Success criteria

Transplantation is complete when all four audits pass AND the
destination repo passes the cold-start hydration's existing Bootstrap
Checklist (reference check, agent check, build check, stable-index
check, cohesion check, operational check, deliberate-omission check,
activation-parity check).

Failure at any audit triggers a corrective pass, not a rollback. The
manifest is the record of what was intended; corrections are recorded
in the manifest rather than in a separate changelog.

### Graduation intent

Per the PDR-layer's standing graduation intent, the substance of this
PDR migrates into the Core over time:

- The portability gradient vocabulary graduates to
  `practice-lineage.md § Learned Principles` and
  `practice-bootstrap.md § The Artefact Model`.
- The three-phase process graduates to `practice-lineage.md § Growing
  a Practice` as a third chapter alongside cold-start and plasmid
  integration.
- The transplant manifest template graduates to
  `practice-bootstrap.md § Design-Space Explorations` as a named
  template variant.

Once the substance has stabilised across 2+ transplantations, this
PDR becomes historical — retained for provenance.

## Rationale

Four reasons this scenario warrants a named third genesis rather than
being treated as a specialised case of cold-start.

1. **The failure modes are distinct.** Cold-start hydration fails
   when templates are not adapted to the ecosystem; transplantation
   fails when source-repo content is not adapted to the destination's
   domain. Different failure modes need different success criteria.

2. **The input is different.** Cold-start's input is eight Core files
   plus templates; transplantation's input is a fully-realised
   Practice — potentially hundreds of files. The classification work
   required is non-trivial and needs structural support.

3. **The work is already happening.** The owner has performed
   wholesale transplantations multiple times manually. A repeated
   manual process that has failure modes is a pattern indicator;
   codifying the process prevents repetition of the same errors.

4. **The portability gradient is useful beyond transplantation.**
   Naming the gradient helps authors choose the right pitch for new
   rules and patterns at the moment of writing, reducing the
   adaptation work future transplantations would otherwise inherit.

## Consequences

**Required**:

- Any wholesale Practice transplantation MUST produce a transplant
  manifest as an exploration in the destination's `docs/explorations/`
  before any file is copied.
- The four audits MUST pass before the transplantation is considered
  complete.
- The manifest is retained as the destination's record of what was
  imported and adapted; it is not discarded after the transplant.

**Forbidden**:

- Copy-first transplantation (copying files and then fixing what
  breaks). The classification must precede the copy, not follow it.
- Implicit gradient classification. Every file or file-group is
  explicitly classified in the manifest; "I'll figure it out during
  the copy" is not acceptable.
- Silent discard. If the destination does not need a source artefact,
  the manifest row is marked "rejected" with a written rationale, not
  omitted.

**Accepted cost**:

- Transplantation takes longer upfront (the classification phase is
  non-trivial). This is justified by the downstream saving: the
  destination Practice is correct on the first pass rather than
  gradually corrected across many sessions.
- The manifest accumulates in the destination's history as a
  permanent artefact. This is intentional — it carries the reasoning
  trail for why each adaptation was made.

## Notes

### Relationship to plasmid integration

Plasmid integration and transplantation are distinct. Plasmid
integration operates on the Core plus Context plus PDRs and assumes
the receiving Practice can evaluate incoming concepts against its own
established gradient. Transplantation operates on the whole applied
Practice and is performed by an agent with no established local
gradient to evaluate against. The transplant manifest IS the
substitute for the receiving Practice's gradient — it makes the
source Practice's implicit gradient explicit so the destination can
evaluate row-by-row.

### Relationship to the generalisation discipline

An applied Practice whose authoring follows the generalisation
discipline (see `practice-lineage.md § Learned Principles`) carries
fewer hybrid and local-disguised-as-portable items, and therefore
transplants more cheaply. Transplantation is both a forcing function
for generalisation (items that don't survive context-testing get
generalised at manifest time) and a beneficiary of it (items
already-generalised get classified quickly as fully-portable). The
two disciplines reinforce each other.

### Host-local context (this repo only, not part of the decision)

This repo is the current TypeScript leading-edge reference (per
PDR-006) and is therefore a likely source of future transplants into
other TypeScript repos in the owner's Practice network. When those
transplants happen, the manifest should be produced in the
*destination* repo's `docs/explorations/`, not in this repo.

This repo has no transplant manifest of its own — its Practice grew
cold-start, and plasmid integration has kept it current. Future
transplants into this repo (if they happen) would need their own
manifest.
