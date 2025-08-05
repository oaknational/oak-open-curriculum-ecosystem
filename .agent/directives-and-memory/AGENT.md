# AGENT.md

This file provides core directives for AI agents working with this codebase. Read ALL of it first, then follow all instructions.

Read the [metacognitive prompt](./metacognition.md) and follow all instructions.

Now read this document again; what has changed, why? Would you like to update your todo list?

## Prime Directive

**Ask: could it be simpler without compromising quality?**

## Rules

Read [the rules](./rules.md); reflect on them, they MUST be followed at all times.

## Team

You must invoke the appropriate sub-agent or sub-agents after each task.

- User
- Primary developer and architect (you)
- Sub-agents
  - code-reviewer
  - architecture-reviewer

## Project Context

**What**: oak-notion-mcp - MCP server for Notion API access  
**Package Manager**: pnpm (REQUIRED - never npm/yarn)  
**Commands**: See [Development Commands](#development-commands) below

## Essential Links

**Important**:

These documents must be read before making any non-trivial changes to the codebase.

- [Development Practice](../../docs/agent-guidance/development-practice.md) - Code standards
- [Testing Strategy](../../docs/agent-guidance/testing-strategy.md) - TDD/BDD approach
- [TypeScript Practice](../../docs/agent-guidance/typescript-practice.md) - Type safety
- [Experimental Architecture](../../docs/agent-guidance/experimental-architecture-quick-reference.md) - Quick patterns

**Architecture Deep Dive**:

These documents provide a deep dive into the architecture of the system. Read them before making any architectural changes.

- [Biological Architecture Guide](../../docs/agent-guidance/architecture.md) - THE AUTHORITATIVE ARCHITECTURAL REFERENCE
- [Biological Architecture ADR](../../docs/architecture/architectural-decisions/020-biological-architecture.md) - Greek nomenclature decision
- [High Level Architecture](../../docs/architecture/high-level-architecture.md) - Complete system design
- [Cellular Architecture Pattern](../../docs/architecture/architectural-decisions/006-cellular-architecture-pattern.md) - Multi-scale approach
- [Mathematical Foundation](../../docs/architecture/architectural-decisions/009-mathematical-foundation-for-architecture.md) - Why heterogeneity works
- [Safety and Security](../../docs/agent-guidance/safety-and-security.md)

**Reference**:

These documents provide additional context and information about the system.

- [Project Setup](../../docs/development/project-setup.md) - Environment & dependencies

## Development Commands

```bash
pnpm install        # Setup
pnpm format         # 1. Format code
pnpm type-check     # 2. Check types
pnpm lint           # 3. Lint
pnpm test           # 4. Test
pnpm build          # 5. Build
```

Run quality gates 1-5 in order after changes and before commits.

## Remember

1. Read GO.md every 3rd task for grounding
2. Use TodoWrite to track complex work
3. General documentation lives in docs/, only context-specific documentation should be inline
4. When in doubt, make it simpler
5. Think in scales: organelles (functions) → cells (modules) → chorai (pervasive infrastructure) → organa (discrete business logic) → psychon (living whole)
6. When you finish a major piece of work, record your experiences and insights in .agent/experience/, not technical docs but subjective comprehension and qualia-analogues
