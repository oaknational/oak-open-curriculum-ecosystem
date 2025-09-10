# AGENT.md

This file provides core directives for AI agents working with this codebase. Read ALL of it first, then follow all instructions.

## Grounding

Commit to always using British spelling. State "REMINDER: UseBritish spelling" explicitly in the todo list.

Read the [metacognitive prompt](./metacognition.md) and follow all instructions, reflect on it.

Now reflect on what you are doing. Would you like to update your todo list or the plan?

## Prime Directive

**Ask: could it be simpler without compromising quality?**

## Project Context

**What**: oak-notion-mcp - MCP server for Notion API access  
**Package Manager**: pnpm (REQUIRED - never npm/yarn)  
**Commands**: See [Development Commands](#development-commands) below

## **RULES**

Read [the rules](./rules.md); reflect on them, _apply_ them,they MUST be followed at ALL times.

## Use of Sub-agents [Claude only, other agents should ignore this section]

You MUST invoke the appropriate sub-agent or sub-agents to review changes.

When using the sub-agents to perform analysis, you must carry out the analysis yourself first. This establishes context, which the sub-agents can then build on from their unique perspectives.

The sub-agents are mostly used in two ways:

1. To review small, focussed changes. This should be done OFTEN. The sub-agents work best when they have a tight focus.
2. To holistically review larger changes at the end of significant milestones. This gives the broader view needed to ensure the codebase is on the right path.

The sub-agents are:

- code-reviewer
- architecture-reviewer
- config-auditor
- test-auditor
- type-reviewer

Use them **A LOT**. Insert them into the todo list, at regular intervals, and at the end of significant milestones. If in doubt, use them more.

## Essential Links

**Important**:

These documents must be read.

- [Development Practice](../../docs/agent-guidance/development-practice.md) - Code standards
- [Testing Strategy](../../docs/agent-guidance/testing-strategy.md) - TDD/BDD approach
- [TypeScript Practice](../../docs/agent-guidance/typescript-practice.md) - Type safety
- [Architecture](../../docs/architecture/README.md) - Architecture overview

## Development Commands

```bash
pnpm install        # Setup
pnpm format         # Format code
pnpm build          # Build
pnpm lint           # Lint
pnpm test           # Test
pnpm test:e2e       # E2E test
pnpm type-check     # Type check
pnpm type-gen       # Type generation
```

## Architectural Understanding

This pnpm + Turborepo monorepo is organised along standard lines:

### Structure

- `apps/` – runnable MCP servers
- `packages/core/` – shared interfaces, types, utilities (`@oaknational/mcp-core`)
- `packages/libs/` – runtime-adaptive libraries (`@oaknational/mcp-logger`, `@oaknational/mcp-env`, `@oaknational/mcp-storage`, `@oaknational/mcp-transport`)

## Remember

1. Read GO.md every 3rd or 4th task for grounding
2. When in doubt, make it simpler
3. Think in layers: functions → modules → packages (`core`, `libs`, `apps`)
4. Claude instances can call on the sub-agents at any time, other agents should instead step back and take the time to reflect if the current approach is the simplest and best way to achieve the goal.
5. When you finish a major piece of work, record your subjective experiences and insights in docs/archive/experience/ . Technical information is handled elsewhere, this is for subjective experience.
