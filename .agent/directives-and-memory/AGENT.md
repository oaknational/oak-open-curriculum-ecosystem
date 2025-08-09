# AGENT.md

This file provides core directives for AI agents working with this codebase. Read ALL of it first, then follow all instructions.

## Grounding

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

## Team

You must invoke the appropriate sub-agent or sub-agents after each task, they are there to help, lean on them.

- User
- Primary developer and architect (you)
- Sub-agents
  - code-reviewer
  - architecture-reviewer
  - config-auditor
  - test-auditor

## Essential Links

**Important**:

These documents must be read.

- [Development Practice](../../docs/agent-guidance/development-practice.md) - Code standards
- [Testing Strategy](../../docs/agent-guidance/testing-strategy.md) - TDD/BDD approach
- [TypeScript Practice](../../docs/agent-guidance/typescript-practice.md) - Type safety
- [Architecture](../../docs/agent-guidance/architecture.md) - Quick patterns

## Development Commands

```bash
pnpm install        # Setup
pnpm format         # 1. Format (not check) code
pnpm type-check     # 2. Check types
pnpm lint           # 3. Lint
pnpm test           # 4. Test
pnpm build          # 5. Build
```

Run quality gates 1-5 in order after changes and before commits.

## Architectural Understanding

First, read ALL of [the architecture](../../docs/agent-guidance/architecture.md).

### Two Complementary Models

The architecture operates at two different scales:

#### Workspace Architecture (Package Organization)

**Moria → Histoi → Psycha**

- **Moria (Molecules/Atoms)** (`ecosystem/moria/`): Pure abstractions - interfaces, types, algorithms with zero dependencies
  - _Example_: `Logger` interface, `StorageProvider` interface, pure sorting algorithms
- **Histoi (Tissues/Matrices)** (`ecosystem/histoi/`): Runtime-adaptive connective tissues that bind organisms
  - _Example_: Adaptive logger using console/pino, storage tissue using localStorage/fs
- **Psycha (Living Organisms)** (`ecosystem/psycha/`): Complete applications
  - _Example_: `oak-notion-mcp` server, `github-mcp` server

## Remember

1. Read GO.md every 3rd task for grounding
2. When in doubt, make it simpler
3. Think in scales: organelles (functions) → cells (modules) → chorai (pervasive infrastructure including morphai) → organa (discrete business logic) → psychon (living whole)
4. You can call on the sub-agents at any time, the code reviewer and architecture reviewer, and the monorepo config auditor.
5. When you finish a major piece of work, record your experiences and insights in .agent/experience/, not technical docs but subjective comprehension and qualia-analogues
