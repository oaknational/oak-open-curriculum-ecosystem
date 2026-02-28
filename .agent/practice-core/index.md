# The Practice

The Practice is not a single file. It is the entire system of principles, structure, and tooling -- directives, rules, commands, agents, skills, prompts, quality gates, and the learning loop -- all working together to ensure quality, reverse entropy, and support innovation. `practice.md` is one small part of that whole.

## For Day-to-Day Work

Follow [AGENT.md](../directives/AGENT.md) and [rules.md](../directives/rules.md). That is all you need for normal operations.

## The Plasmid Trinity

These three files encode the Practice in a transmissible form. They live here so they can travel between repos as a unit. For day-to-day work you do not need to read them -- they are the blueprint, not the building.

| File | Role |
|---|---|
| [practice.md](practice.md) | Orientation: artefact map, workflow, three-layer model (the **what**) |
| [practice-lineage.md](practice-lineage.md) | Principles, evolution rules, exchange mechanism (the **why**) |
| [practice-bootstrap.md](practice-bootstrap.md) | Annotated templates for every artefact type (the **how**) |

## The Practice Box

The `incoming/` directory is the practice box. When the trinity arrives from another repo, it lands here. Check it at session start (via `start-right`) and during consolidation. See the Integration Flow in `practice-lineage.md` for details.

## Cold Start (New Repo)

If `.agent/directives/AGENT.md` does not yet exist, you are hydrating the Practice for the first time. See [README.md](README.md) for orientation, then follow the Growing a Practice section in [practice-lineage.md](practice-lineage.md). The templates in [practice-bootstrap.md](practice-bootstrap.md) provide artefact specifications.

**Critical**: before creating any artefacts, understand the local ecosystem. The Practice is ecosystem-agnostic in principle; all templates must be adapted to local tooling and conventions. The Practice enables excellence; it does not replace what has already been achieved.
