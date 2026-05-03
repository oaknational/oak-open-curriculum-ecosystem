# The Practice

The Practice is a system of principles, guardrails, skills, and a self-teaching learning loop -- working together to ensure quality, reverse entropy, and support innovation.
It is a reusable plain-text framework for agentic-first engineering: agents from major vendors can collaborate, learn, adapt, and preserve useful operational knowledge inside the repo.

This directory is the Practice Core, the self-contained heart of the system. The Core is transferable to other repos, see below. The Core integrates into a specific repo via a stable link to the `practice-index.md` file.

The Core is a **bounded package of files plus required directories**: the plasmid trinity (practice, lineage, bootstrap), verification, entry points (this README, index), changelog, provenance, plus two required directories — `decision-records/` (Practice Decision Records — portable governance, including universal patterns recorded as PDRs with `pdr_kind: pattern`) and `incoming/` (the Practice Box). The contract is the **set of surfaces and their roles**, not a file count; growth by explicit decision only.

The previous `patterns/` Core directory and `practice-context/` peer
companion were retired 2026-04-29 by [PDR-007](decision-records/PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
amendment; universal patterns now travel as PDRs and there is no
peer-companion option.

The Practice is the integrated local application of the Core within a specific repo, and the Core-informed quality gates, rules, commands, optional reviewer/domain-expert agents, skills, and other artefacts that are used to enforce the principles and guardrails.

When a repo supports multiple agent platforms, keep the portable Core
concise and record supported versus unsupported local surface mappings
in a local reference (e.g. a cross-platform agent-surface matrix on
the host's executive-memory surface, bridged via the practice-index).

The Practice will naturally evolve over time; using it will cause it to adapt to suit the context of its current repo.

In order for the improvements to the Practice to be shared, the Core has a simple mechanism for integrating learnings from other repos. The `practice-core` directory from the sharing repo is copied into the `practice-core/incoming` directory of the receiving repo; the instructions for integrating what is useful and leaving the rest are integral to the Core — just ask your agent to do it.

This was inspired by the concept of [genetic plasmid exchange](https://en.wikipedia.org/wiki/Bacterial_conjugation), intra-generational evolution -- this is memetic capability exchange. In essence, the Core is the memotype, the Practice is the applied phenotype.

> **Note**: The Core is stack- and ecosystem-agnostic: the principles are universal, the templates use TypeScript/Node.js as concrete examples but can be adapted to any toolset or language, and are expected to evolve over time in new contexts.

## For Humans

### Bringing the Practice to a New Repo

To bring the Practice to a new repo, transfer the Practice Core package: the plasmid trinity (practice, lineage, bootstrap), verification, two entry points (this README + the agent-facing index), changelog, provenance, and the two required directories (`decision-records/` with its PDRs and `incoming/` empty). To hydrate into a new repository:

1. Create a Practice-Core directory at the host's chosen location (e.g. `practice-core/` or `practice_core/`, conventionally under the host's agent-artefact surface).
2. Drop the Core package into it — the eight files plus the two required directories.
3. Ask your agent to read and understand the Core package, explain what it is all about, and tell you what should happen next.

The agent will survey your repo's existing tooling, standards, and norms, then adapt the Practice to fit -- the Practice enables excellence; it does not replace what you already have. See [practice-lineage.md](practice-lineage.md) for the full story of how the Practice propagates and evolves.

## For Agents

Follow [index.md](index.md). It will orient you to the full Practice system and handle any situation you find yourself in -- day-to-day work, cold-start hydration, incoming plasmids, or files that have landed in the wrong place.
