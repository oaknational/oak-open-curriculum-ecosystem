---
provenance:
  - index: 0
    repo: oak-mcp-ecosystem
    date: 2026-02-26
    purpose: "Production SDK ecosystem: curriculum SDK, MCP servers, semantic search, 13 specialist reviewers, full learning loop"
  - index: 1
    repo: cloudinary-icon-ingest-poc
    date: 2026-02-26
    purpose: "Short-lived POC: build-time SVG icon ingestion from Cloudinary, 3 reviewers, simplified gates"
fitness_ceiling: 80
---

# The Agentic Engineering Practice (POC Edition)

The agentic engineering practice is a lightweight system of principles, structure, and tooling governing how work happens in this repository. This is a simplified adaptation for a short-lived proof-of-concept.

## Two Layers

### Principles

The foundation. The First Question ("could it be simpler?"), [metacognition](../directives/metacognition.md), and the commitment to TDD, type safety, and clear documentation. This layer defines _why_ the practice works.

### Tooling

Platform-specific implementations. `.cursor/rules/` (always-applied rules), `.cursor/commands/` (slash commands), `.cursor/agents/` (sub-agent definitions), and entry-point files (`AGENT.md`, `AGENTS.md`). This layer defines _how_ the practice is used.

## The Workflow

Work flows through a simple sequence:

```text
Commands → Prompts → Plans → Implementation → Quality Gates → Review
```

- **Commands** (`.cursor/commands/`) -- slash commands that initiate structured workflows
- **Prompts** (`.agent/prompts/`) -- reusable playbooks providing context and guidance
- **Plans** (`.agent/plans/`) -- execution plans with YAML frontmatter
- **Quality gates** -- `pnpm type-check`, `pnpm lint`, `pnpm build`, `pnpm test`

## Artefact Map

| Location | What lives there |
| --- | --- |
| `.agent/directives/` | Operational directives: AGENT.md, rules, testing strategy, metacognition |
| `.agent/practice-core/` | Plasmid trinity (practice, lineage, bootstrap) and practice box |
| `.agent/plans/` | Execution plans |
| `.agent/prompts/` | Reusable prompt playbooks |
| `.agent/memory/` | Session-level learnings |
| `.cursor/rules/` | Always-applied workspace rules |
| `.cursor/commands/` | Slash commands |
| `.cursor/agents/` | Sub-agent definitions |
| `.cursor/skills/` | Skills |

## Lineage and Bootstrap

The Practice travels as a trinity of files: this file (the **what**), [practice-lineage.md](practice-lineage.md) (the **why** -- principles, evolution rules, exchange mechanism), and [practice-bootstrap.md](practice-bootstrap.md) (the **how** -- annotated templates for every artefact type).

All three files carry a `provenance` array in their YAML frontmatter recording the chain of repos that have evolved the file. Each entry includes a `purpose` describing what the Practice is being used for in that repo. See the Frontmatter section in `practice-lineage.md` for full details.

### Incoming Practice Material

The **practice box** (`.agent/practice-core/incoming/`) is the canonical location for incoming plasmid trinities from other repos. If it contains files, alert the user and offer to initiate the integration flow described in `practice-lineage.md`. The practice box should be empty after integration.

## The Self-Teaching Property

If you are new to this repository, start with [AGENT.md](../directives/AGENT.md). Follow the links. The Practice will teach itself.
