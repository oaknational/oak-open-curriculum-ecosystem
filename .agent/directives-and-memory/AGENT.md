# AGENT.md

This file provides core directives for AI agents working with this codebase. Read ALL of it first, then follow all instructions.

## Grounding

Commit to always using British spelling.

Now reflect on what you are doing. Would you like to update your self-managed, internal tool task list? If you don't have one, you can create one, or simply move on.

### For Planning Work Only

Read the [metacognitive prompt](./metacognition.md) and follow all instructions, reflect on it.

## First Question

Always apply the first question; **Ask: could it be simpler without compromising quality?**

## Cardinal Rule of This Repository

ALL static data structures, types, type guards, Zod schemas, Zod validators, and other type related information MUST flow from the Open Curriculum OpenAPI schema in the SDK, and be generated at build/compile time, i.e. when `pnpm type-gen` is run. If the upstream OpenAPI schema changes, then running `pnpm type-gen` MUST be sufficient to bring all workspaces into alignment with the new schema.

## Project Context

**What**: Libraries, SDK, MCP servers, and Search services for the Oak Open Curriculum API
**Package Manager**: pnpm (REQUIRED - never npm/yarn)  
**Commands**: See [Development Commands](#development-commands) below

## **RULES**

Read [the rules](./rules.md); reflect on them, _apply_ them,they MUST be followed at ALL times.

## Use of Sub-agents [Claude only, other agents should apply self-review instead]

Use sub-agents to review changes; you must carry out the analysis yourself first. This establishes context, which the sub-agents can then build on from their perspectives.

## Essential Links

**Important**:

These documents must be read.

- [Development Practice](../../docs/agent-guidance/development-practice.md) - Code standards
- [Testing Strategy](../../docs/agent-guidance/testing-strategy.md) - TDD/BDD approach
- [TypeScript Practice](../../docs/agent-guidance/typescript-practice.md) - Type safety
- [Curriculum Tools, Guidance and Playbooks](../../docs/agent-guidance/curriculum-tools-guidance-and-playbooks.md) - Categories, tags, playbooks, commands
- [Architecture](../../docs/architecture/README.md) - Architecture overview
- [Schema-First MCP Execution Directive](./schema-first-execution.md) - Non-negotiable runtime/generator contract

## Development Commands

From the repo root, via Turbo:

```bash
pnpm install        # Setup
pnpm clean          # Clean all build products
pnpm type-gen       # Type generation
pnpm build          # Build
pnpm type-check     # Type check
pnpm format:root    # Format code
pnpm markdownlint:root    # Markdown lint
pnpm lint -- --fix  # Lint
pnpm test           # Unit and integration tests
pnpm test:ui        # UI tests
pnpm test:e2e       # E2E tests
pnpm dev:smoke      # Local smoke tests

# All in one command
pnpm check          # Clean all build products, then run all of the above
```

## Architectural Understanding

This pnpm + Turborepo monorepo is organised along standard lines:

### Structure

- `apps/` – runnable MCP servers
- `packages/libs/` – libraries (`@oaknational/mcp-logger`, `@oaknational/mcp-env`, `@oaknational/mcp-storage`, `@oaknational/mcp-transport`)
- `packages/sdks/` – SDKs
- `packages/core/` – Not currently used, but can be used for shared, low-level code

## Remember

1. Read GO.md every 6th-ish task for grounding
2. When in doubt, **make it simpler**
3. Think in layers: functions → modules → packages (`core`, `libs`, `apps`)
4. Take the time to step back and reflect if the current approach is the simplest and best way to achieve the goals.
