---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract detail to referenced docs; this file is an index/entry point"
---

# AGENT.md

This is the operational entry point for AI agents working with this codebase.
Read all of it first, then follow the links that match the work in front of
you. This file is an index and stance-setter; durable detail lives in the
referenced homes.

## Grounding

Commit to British spelling, grammar, and date formats. Reflect on your current
task; update your task list if needed. Apply the
[user-collaboration directive](./user-collaboration.md): dialogue, scope
discipline, human risk acceptance, direct verification, discovery-based
onboarding, and archive discipline. For agent-to-agent collaboration, also
apply the [agent-collaboration directive](./agent-collaboration.md):
knowledge and communication (not mechanical refusals), peer dialogue,
five communication channels, identity vs liveness, and the bootstrap
fast-path.

For planning work, read [metacognition.md](./metacognition.md) and follow its
reflection discipline before finalising a plan.

## The Practice

This file is the front door to the **agentic engineering practice**: the
self-reinforcing system of principles, structures, reviewers, and tooling that
governs how work happens in this repository.

Start with:

- [practice-core/index.md](../practice-core/index.md) — portable Practice
  orientation
- [practice-index.md](../practice-index.md) — local bridge into this repo's
  live surfaces
- [practice.md](../practice-core/practice.md) — full Practice map
- [practice-lineage.md](../practice-core/practice-lineage.md) — cross-repo
  propagation and plasmid exchange

Agent onboarding starts with `start-right-quick` or `start-right-thorough`.
For the layering contract, authority order, and routing rule, see
[orientation.md](./orientation.md).

ADRs define how the system should work and are the architectural source of
truth. Before substantive work, scan the
[5-ADR starter block][adr-5] and open any ADR that matches your work area from
the [ADR index][adr-index].

[adr-5]: ../../docs/architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes
[adr-index]: ../../docs/architecture/architectural-decisions/README.md

## First Question

Always ask: **could it be simpler without compromising quality?**

## Cardinal Rule

ALL static data structures, types, type guards, Zod schemas, Zod validators,
and other type-related information MUST flow from the Open Curriculum OpenAPI
schema in the SDK and be generated at codegen time. If the upstream OpenAPI
schema changes, then `pnpm sdk-codegen` followed by `pnpm build` MUST be
sufficient to bring all workspaces into alignment.

Use [schema-first-execution.md](./schema-first-execution.md) for the
non-negotiable runtime and generator contract.

## Project Context

This repository contains libraries, SDKs, MCP servers, search services, and
agent tooling for the Oak Open Curriculum API. Use `pnpm` only. For setup,
package topology, and capabilities, see the [root README](../../README.md) and
[architecture overview](../../docs/architecture/README.md).

## Rules

Read [principles.md](./principles.md); reflect on it, apply it, and follow it
at all times.

The always-applied rule tier lives in [`.agent/rules/`](../rules/). Rules
operationalise principles, ADRs, and PDRs. Claude and Cursor load their adapter
tiers automatically; Codex, Gemini, and any other non-loader platform MUST read
every canonical `.agent/rules/*.md` file at session open.

## Reviewers And Tools

Apply your own critical thinking, then use reviewers when the platform and
owner direction allow it. Reviewer routing, timing, roster, depth, and reporting
requirements live in
[invoke-code-reviewers.md](../memory/executive/invoke-code-reviewers.md).

Agent workflow CLIs live in [agent-tools](../../agent-tools/README.md). Use
root scripts such as `pnpm agent-tools:claude-agent-ops health` from the repo
root.

Agent artefacts follow ADR-125's three-layer model: canonical content in
`.agent/`, thin platform adapters, and platform entrypoints. See
[artefact-inventory.md](../memory/executive/artefact-inventory.md) and
[docs/engineering/extending.md](../../docs/engineering/extending.md) before
adding rules, skills, commands, sub-agents, adapters, or ADRs.

Use the [commit skill](../skills/commit/SKILL.md) for commits. It enumerates
live commitlint constraints and validates the drafted message via
`scripts/check-commit-message.sh` before `git commit`.

## Memory And Continuity

Institutional memory lives in `.agent/memory/`:

- [distilled.md](../memory/active/distilled.md) — hard-won rules extracted from
  session napkins
- [napkin.md](../memory/active/napkin.md) — current session observations
- [patterns/](../memory/active/patterns/README.md) — reusable solutions and
  failure modes
- [threads/](../memory/operational/threads/README.md) — thread convention,
  identity discipline, and next-session records

Before joining an active thread, read the thread record and follow the
additive identity rule.

## Essential Links

Use these links by trigger:

- Core practice: [Development Practice][development],
  [User Collaboration Practice](./user-collaboration.md),
  [Agent Collaboration Practice](./agent-collaboration.md),
  [Testing Strategy](testing-strategy.md), [TypeScript Practice][typescript],
  [Safety and Security][security]
- Architecture and schema: [Architecture][architecture], [ADR index][adr-index],
  [ADR-029][adr-029], [ADR-030][adr-030], [ADR-031][adr-031],
  [Schema-First MCP Execution](./schema-first-execution.md),
  [Semantic Search Architecture][semantic-search]
- UI and design: [Accessibility Practice][accessibility],
  [Design Token Practice][design-tokens], [MCP App Styling][mcp-app-styling]
- Build and operations: [Build System][build-system],
  [Troubleshooting][troubleshooting]
- Vision and domain: [Vision][vision], [Curriculum Guidance][curriculum],
  [Experience Recording](../experience/README.md)

[development]: ../../docs/governance/development-practice.md
[typescript]: ../../docs/governance/typescript-practice.md
[security]: ../../docs/governance/safety-and-security.md
[architecture]: ../../docs/architecture/README.md
[adr-029]: ../../docs/architecture/architectural-decisions/029-no-manual-api-data.md
[adr-030]: ../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md
[adr-031]: ../../docs/architecture/architectural-decisions/031-generation-time-extraction.md
[semantic-search]: ../../docs/agent-guidance/semantic-search-architecture.md
[accessibility]: ../../docs/governance/accessibility-practice.md
[design-tokens]: ../../docs/governance/design-token-practice.md
[mcp-app-styling]: ../../docs/governance/mcp-app-styling.md
[build-system]: ../../docs/engineering/build-system.md
[troubleshooting]: ../../docs/operations/troubleshooting.md
[vision]: ../../docs/foundation/VISION.md
[curriculum]: ../../docs/governance/curriculum-tools-guidance-and-playbooks.md

## Commands

From the repo root. Run gates one at a time while iterating; use `pnpm check`
for canonical aggregate verification. The command source of truth is
[Build System](../../docs/engineering/build-system.md) plus root
`package.json`.

Common entrypoints:

```bash
pnpm install
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm practice:fitness:informational
pnpm practice:vocabulary
pnpm check
```

## Remember

1. Periodically re-ground using [GO](../skills/go/shared/go.md)
   (ACTION/REVIEW/GROUNDING cadence).
2. When in doubt, make it simpler without compromising quality. Think in
   layers: functions, modules, packages.
