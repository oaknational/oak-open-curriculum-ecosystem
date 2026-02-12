# AGENT.md

This file provides core directives for AI agents working with this codebase. Read ALL of it first, then follow all instructions.

## Grounding

Commit to always using British spelling, and British English grammar, and British date and time formats.

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

## Use Sub-agents

Always apply your own critical thinking to your work, and then use the sub-agents to gain additional perspectives and insights.

### Available Sub-agents

Specialist sub-agents provide targeted reviews and insights. Use them proactively for quality assurance.

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| `architecture-reviewer` | Boundary compliance, import patterns | Structural changes, new modules, refactoring |
| `code-reviewer` | Quality, security, maintainability | After writing/modifying code, completing features |
| `test-reviewer` | Test quality, TDD compliance, mock simplicity | After test changes, when auditing test suites |
| `type-reviewer` | Type safety, compile-time embedding | Complex generics, type narrowing, external data |
| `config-reviewer` | Tooling configuration, quality gates | Config changes, new workspaces, base config updates |
| `subagent-architect` | Creating and optimising sub-agents | Agent design, system prompts, orchestration |

**Cursor-specific**: Invoke via the Task tool with `subagent_type` parameter. Other tooling: invoke by name using platform-specific methods.

### Cursor Configuration

| Location | Purpose |
|----------|---------|
| `.cursor/agents/*.md` | Sub-agent definitions |
| `.cursor/commands/*.md` | Slash commands (`/jc-review`, `/jc-gates`, etc.) |
| `.cursor/rules/*.mdc` | Always-applied rules |

## Essential Links

**Important**: These documents must be read.

### Core Practice

- [Development Practice](../../docs/agent-guidance/development-practice.md) - Code standards
- [Testing Strategy](testing-strategy.md) - TDD/BDD approach at all levels
- [TypeScript Practice](../../docs/agent-guidance/typescript-practice.md) - Type safety
- [Safety and Security](../../docs/agent-guidance/safety-and-security.md) - API keys, PII protection, security principles

### Architecture and Schema

- [Architecture](../../docs/architecture/README.md) - Architecture overview
- [Schema-First MCP Execution Directive](./schema-first-execution.md) - Non-negotiable runtime/generator contract
- [Semantic Search Architecture](./semantic-search-architecture.md) - Structure is the foundation, transcripts are a bonus

### Domain and Context

- [Curriculum Tools, Guidance and Playbooks](../../docs/agent-guidance/curriculum-tools-guidance-and-playbooks.md) - Categories, tags, playbooks, commands
- [Experience Recording](../experience/README.md) - Subjective experience across sessions

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
pnpm lint:fix       # Lint
pnpm test           # Unit and integration tests
pnpm test:ui        # UI tests
pnpm test:e2e       # E2E tests (includes built-server behaviour tests)
pnpm smoke:dev:stub # Local smoke tests

# All in one command
pnpm check          # Clean all build products, then run all of the above
```

## Architectural Understanding

This pnpm + Turborepo monorepo is organised along standard lines:

### Structure

- `apps/` – runnable apps that provide services to users
- `packages/libs/` – libraries (`@oaknational/mcp-logger`, `@oaknational/mcp-env`, `@oaknational/result`)
- `packages/sdks/` – SDKs (e.g., `@oaknational/oak-curriculum-sdk`)
- `packages/core/` – Shared, low-level code

## Remember

1. Read GO.md every 6th-ish task for grounding
2. When in doubt, **make it simpler**
3. Think in layers: functions → modules → packages (`core`, `libs`, `apps`)
4. Take the time to step back and reflect if the current approach is the simplest and best way to achieve the goals.
