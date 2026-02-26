---
provenance:
  - index: 0
    repo: oak-mcp-ecosystem
    date: 2026-02-26
  - index: 1
    repo: cloudinary-icon-ingest-poc
    date: 2026-02-26
profile: poc
fitness_ceiling: 80
---

# The Agentic Engineering Practice (POC Edition)

The agentic engineering practice is a lightweight system of principles, structure, and tooling governing how work happens in this repository. This is a simplified adaptation for a short-lived proof-of-concept.

## Two Layers

### Principles

The foundation. The First Question ("could it be simpler?"), [metacognition](metacognition.md), and the commitment to TDD, type safety, and clear documentation. This layer defines _why_ the practice works.

### Tooling

Platform-specific implementations. `.cursor/rules/` (always-applied rules), `.cursor/commands/` (slash commands), `.cursor/agents/` (sub-agent definitions), and entry-point files (`AGENT.md`, `AGENTS.md`). This layer defines _how_ the practice is used.

## The Workflow

Work flows through a simple sequence:

```
Commands → Prompts → Plans → Implementation → Quality Gates → Review
```

- **Commands** (`.cursor/commands/`) -- slash commands that initiate structured workflows
- **Prompts** (`.agent/prompts/`) -- reusable playbooks providing context and guidance
- **Plans** (`.agent/plans/`) -- execution plans with YAML frontmatter
- **Quality gates** -- `pnpm type-check`, `pnpm lint`, `pnpm build`, `pnpm test`

## Artefact Map

| Location | What lives there |
|---|---|
| `.agent/directives/` | Principles, rules, and this practice guide |
| `.agent/plans/` | Execution plans |
| `.agent/prompts/` | Reusable prompt playbooks |
| `.agent/memory/` | Session-level learnings |
| `.cursor/rules/` | Always-applied workspace rules |
| `.cursor/commands/` | Slash commands |
| `.cursor/agents/` | Sub-agent definitions |
| `.cursor/skills/` | Skills |

## Lineage

This Practice instance was propagated from another repo and may exchange learnings with other repos in the future. See [practice-lineage.md](practice-lineage.md) for origin, evolution rules, and the exchange mechanism.

Both this file and `practice-lineage.md` carry a `provenance` array in their YAML frontmatter. This records the chain of repos that have evolved the file, in order (index 0 is the origin, highest index is the most recent). This chain is how receiving repos determine whether incoming Practice files carry new learnings. See the Frontmatter section in `practice-lineage.md` for full details.

### Incoming Practice Material

The **practice box** (`.agent/incoming/`) is the canonical location for incoming Practice/Lineage pairs from other repos. If it contains files, alert the user and offer to initiate the integration flow described in `practice-lineage.md`. The practice box should be empty after integration.

## The Self-Teaching Property

If you are new to this repository, start with [AGENT.md](AGENT.md). Follow the links. The Practice will teach itself.
