# The Practice

The Practice is not a single file. It is the entire system of principles, structure, and tooling -- directives, rules, commands, agents, skills, quality gates, and the learning loop -- all working together to ensure quality, reverse entropy, and support innovation. `practice.md` is one small part of that whole.

## For Day-to-Day Work

Follow `.agent/directives/AGENT.md` and `.agent/directives/principles.md`. That is all you need for normal operations.

## The Practice Core Package

The Practice Core is a **bounded package of files plus required directories** that travels between repos as a whole. The contract is the set of surfaces and their roles, not a file count (the count grows by explicit decision, per PDR-007).

| Surface                                              | Role                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| [practice.md](practice.md)                           | Blueprint: artefact map, workflow, three-layer model (the **what**)      |
| [practice-lineage.md](practice-lineage.md)           | Blueprint: principles, evolution rules, exchange mechanism (the **why**) |
| [practice-bootstrap.md](practice-bootstrap.md)       | Blueprint: annotated templates for every artefact type (the **how**)     |
| [practice-verification.md](practice-verification.md) | Verification: checklist, health check, operational estate                |
| [README.md](README.md)                               | Entry point for humans: context and hydration how-to                     |
| [index.md](index.md)                                 | Entry point for agents: operational orientation (this file)              |
| [CHANGELOG.md](CHANGELOG.md)                         | What changed: repo-tagged summaries for plasmid integration              |
| [provenance.yml](provenance.yml)                     | Per-file evolution chains for the plasmid trinity                        |
| [decision-records/](decision-records/)               | **Directory** — Practice Decision Records (PDRs): portable governance decisions about the Practice; also carries Practice-governance and general abstract patterns (PDRs with `pdr_kind: pattern`) per PDR-007 amendment 2026-04-29 |
| [incoming/](incoming/)                               | **Directory** — Practice Box: transient receiver for inbound Core packages |

The trinity files point to `provenance.yml` for their evolution history and evolve between repos. For day-to-day work you do not need to read any of these — they are the blueprint, not the building. The previous `patterns/` Core directory and `.agent/practice-context/` peer companion were retired 2026-04-29 (PDR-007 amendment); patterns live at `.agent/memory/active/patterns/` (engineering instances) or as PDRs (governance and general abstractions).

## Boundary Contract

The Practice Core files are **portable** — they travel between repos and must be self-contained. The one permitted external link is to `../practice-index.md`, a **local** bridge file that each repo creates during hydration. All other external paths appear as code-formatted text only.

**Concepts are the unit of exchange.** All Practice exchange — outgoing
content, incoming integration, two-way comparison — operates at the
concept level: what something is, how it works, why it matters.
Travelling content must carry the substance, not a pointer to where a
host repo documents it (no ADR numbers, no local paths, no repo-specific
names). A descriptive label is better than an opaque number, but a label
alone is still a pointer — the substance must travel. Two repos may
implement the same concept under different names; concept-level
comparison reveals equivalences that file-level diffing misses. The
practice-index bridges portable concepts to each host's local artefacts.

|                | Portable (travels)               | Local (stays)                  |
| -------------- | -------------------------------- | ------------------------------ |
| **Files**      | The eight Practice Core files    | `.agent/practice-index.md`     |
| **Links**      | Only to each other + the bridge  | To the repo's actual artefacts |
| **Created by** | Origin repo or prior propagation | Hydration step 8               |

## The Practice Box

The `incoming/` directory is the Practice Box. When Practice Core files arrive from another repo, they land here. Check it at session start (via `start-right`) and during consolidation. See the Integration Flow in `practice-lineage.md` for details.

Read `decision-records/README.md` and every PDR file. PDRs are
authoritative governance decisions about the Practice itself; they are
first-class Core content under the PDR-007 contract and travel with the
Core package. PDRs may carry `pdr_kind: pattern` frontmatter when they
encode a general abstract pattern (per PDR-007 amendment 2026-04-29 —
the previous `patterns/` Core directory was retired and pattern
abstractions now graduate as PDRs). Specific engineering pattern
instances remain in `.agent/memory/active/patterns/` in each host repo.

If the local repo spans multiple agent platforms, maintain an explicit local
surface contract in `.agent/memory/executive/cross-platform-agent-surface-matrix.md`
and expose it from `../practice-index.md`. Supported and unsupported states
should be written down explicitly rather than inferred from missing files.

## Cold Start -- Hydrating a New Repo

If `.agent/directives/AGENT.md` does not yet exist, you are hydrating the Practice for the first time.

**The key first step is to understand the repo.** Before creating any Practice artefacts, survey the existing repository: its intent, language(s), test framework, linter, formatter, package manager, build system, established norms, and existing quality standards. The Practice enables excellence; it does not replace what has already been achieved. Only once you understand the local ecosystem should you begin adapting the Practice to it.

If the Practice Core files have been placed somewhere other than `.agent/practice-core/` (e.g. the repo root, a random directory), move them to `.agent/practice-core/` first -- create the directory and an `incoming/.gitkeep` within it if needed.

Then follow the Growing a Practice section in [practice-lineage.md](practice-lineage.md). The templates in [practice-bootstrap.md](practice-bootstrap.md) provide artefact specifications -- adapt ALL templates to local tooling and conventions. The templates use TypeScript/Node.js as concrete examples; substitute your ecosystem's equivalents. As part of hydration, create `.agent/practice-index.md` -- the bridge file that carries navigable links to the local repo's artefacts (see the template in [practice-bootstrap.md](practice-bootstrap.md)). See the Bootstrap Checklist in [practice-bootstrap.md](practice-bootstrap.md) for validation.

Read every PDR in `decision-records/` before adapting the Practice. PDRs
carry portable governance decisions that constrain how the Practice
behaves in any repo, not just the sending one. PDRs with
`pdr_kind: pattern` frontmatter additionally carry general abstract
patterns that travel with the Core (per PDR-007 amendment 2026-04-29,
patterns no longer have a dedicated Core directory).
