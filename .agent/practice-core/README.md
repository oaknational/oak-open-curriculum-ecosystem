# The Practice

The Practice is a system of principles, guardrails, skills, and a self-teaching learning loop -- working together to ensure quality, reverse entropy, and support innovation.

This directory is the Practice Core, the self-contained heart of the system. The Core is transferable to other repos, see below. The Core integrates into a specific repo via a stable link to the `practice-index.md` file.

The Core is a **bounded package of files plus required directories**: the plasmid trinity (practice, lineage, bootstrap), verification, entry points (this README, index), changelog, provenance, plus three required directories — `decision-records/` (Practice Decision Records — portable governance), `patterns/` (general ecosystem-agnostic abstract patterns), and `incoming/` (the Practice Box). The contract is the **set of surfaces and their roles**, not a file count; growth by explicit decision only.

The Core has one optional peer companion: `.agent/practice-context/` (sender-maintained ephemeral exchange context). Under PDR-007, PDRs and patterns previously held as peer directories are now first-class inside Core.

The Practice is the integrated local application of the Core within a specific repo, and the Core-informed quality gates, rules, commands, optional reviewer/domain-expert agents, skills, and other artefacts that are used to enforce the principles and guardrails.

When a repo supports multiple agent platforms, keep the portable Core concise
and record supported versus unsupported local surface mappings in a local
reference such as `.agent/reference/cross-platform-agent-surface-matrix.md`.

The Practice will naturally evolve over time; using it will cause it to adapt to suit the context of its current repo.

In order for the improvements to the Practice to be shared, the Core has a simple mechanism for integrating learnings from other repos. The `practice-core` directory from the sharing repo is copied into the `practice-core/incoming` directory of the receiving repo; the instructions for integrating what is useful and leaving the rest are integral to the Core — just ask your agent to do it.

This was inspired by the concept of [genetic plasmid exchange](https://en.wikipedia.org/wiki/Bacterial_conjugation), intra-generational evolution -- this is memetic capability exchange. In essence, the Core is the memotype, the Practice is the applied phenotype.

> **Note**: The Core is stack- and ecosystem-agnostic: the principles are universal, the templates use TypeScript/Node.js as concrete examples but can be adapted to any toolset or language, and are expected to evolve over time in new contexts.

## For Humans

### Bringing the Practice to a New Repo

To bring the Practice to a new repo, transfer the Practice Core package: the plasmid trinity (practice, lineage, bootstrap), verification, two entry points (this README + the agent-facing index), changelog, provenance, and the three required directories (`decision-records/` with its PDRs, `patterns/` with any general abstract patterns, `incoming/` empty). The `.agent/practice-context/` directory is an optional companion for ephemeral exchange context. To hydrate into a new repository:

1. Create a directory: `.agent/practice-core/` (or `practice_core` if you prefer underscores).
2. Drop the Core package into it — the eight files + the three directories.
3. Check `.agent/practice-context/README.md` and `incoming/` if they exist (ephemeral exchange context).
4. Ask your agent to read and understand the Core package, explain what it is all about, and tell you what should happen next.

The agent will survey your repo's existing tooling, standards, and norms, then adapt the Practice to fit -- the Practice enables excellence; it does not replace what you already have. See [practice-lineage.md](practice-lineage.md) for the full story of how the Practice propagates and evolves.

## For Agents

Follow [index.md](index.md). It will orient you to the full Practice system and handle any situation you find yourself in -- day-to-day work, cold-start hydration, incoming plasmids, or files that have landed in the wrong place.
