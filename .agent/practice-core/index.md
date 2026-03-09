# The Practice

The Practice is not a single file. It is the entire system of principles, structure, and tooling -- directives, rules, commands, agents, skills, prompts, quality gates, and the learning loop -- all working together to ensure quality, reverse entropy, and support innovation. `practice.md` is one small part of that whole.

## For Day-to-Day Work

Follow `.agent/directives/AGENT.md` and `.agent/directives/principles.md`. That is all you need for normal operations.

## The Practice-Core Files

The Practice travels between repos as a package of six required files. The three **plasmid trinity** files encode the blueprint; the **entry points** provide orientation; the **changelog** records what changed. It may be accompanied by an optional `.agent/practice-context/` directory, but that directory is not part of the Core.

| File                                           | Role                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| [practice.md](practice.md)                     | Blueprint: artefact map, workflow, three-layer model (the **what**)      |
| [practice-lineage.md](practice-lineage.md)     | Blueprint: principles, evolution rules, exchange mechanism (the **why**) |
| [practice-bootstrap.md](practice-bootstrap.md) | Blueprint: annotated templates for every artefact type (the **how**)     |
| [README.md](README.md)                         | Entry point for humans: context and hydration how-to                     |
| [index.md](index.md)                           | Entry point for agents: operational orientation (this file)              |
| [CHANGELOG.md](CHANGELOG.md)                   | What changed: repo-tagged summaries for plasmid integration              |

The trinity files carry provenance frontmatter and evolve between repos. For day-to-day work you do not need to read any of these -- they are the blueprint, not the building.

## Boundary Contract

The practice-core files are **portable** — they travel between repos and must be self-contained. The one permitted external link is to `../practice-index.md`, a **local** bridge file that each repo creates during hydration. All other external paths appear as code-formatted text only.

|                | Portable (travels)               | Local (stays)                  |
| -------------- | -------------------------------- | ------------------------------ |
| **Files**      | The six practice-core files      | `.agent/practice-index.md`     |
| **Links**      | Only to each other + the bridge  | To the repo's actual artefacts |
| **Created by** | Origin repo or prior propagation | Hydration step 8               |

## The Practice Box

The `incoming/` directory is the practice box. When practice-core files arrive from another repo, they land here. Check it at session start (via `start-right`) and during consolidation. See the Integration Flow in `practice-lineage.md` for details.

If `.agent/practice-context/` exists, read `README.md` and `incoming/` as
received support during hydration or integration. `incoming/` is transient and
should be cleared after integration. Local `outgoing/` may persist.

## Cold Start -- Hydrating a New Repo

If `.agent/directives/AGENT.md` does not yet exist, you are hydrating the Practice for the first time.

**The key first step is to understand the repo.** Before creating any Practice artefacts, survey the existing repository: its intent, language(s), test framework, linter, formatter, package manager, build system, established norms, and existing quality standards. The Practice enables excellence; it does not replace what has already been achieved. Only once you understand the local ecosystem should you begin adapting the Practice to it.

If the practice-core files have been placed somewhere other than `.agent/practice-core/` (e.g. the repo root, a random directory), move them to `.agent/practice-core/` first -- create the directory and an `incoming/.gitkeep` within it if needed.

Then follow the Growing a Practice section in [practice-lineage.md](practice-lineage.md). The templates in [practice-bootstrap.md](practice-bootstrap.md) provide artefact specifications -- adapt ALL templates to local tooling and conventions. The templates use TypeScript/Node.js as concrete examples; substitute your ecosystem's equivalents. As part of hydration, create `.agent/practice-index.md` -- the bridge file that carries navigable links to the local repo's artefacts (see the template in [practice-bootstrap.md](practice-bootstrap.md)). See the Bootstrap Checklist in [practice-bootstrap.md](practice-bootstrap.md) for validation.

If `.agent/practice-context/` exists, read `incoming/` before adapting the
Practice. It may contain useful framing from the sending repo.
