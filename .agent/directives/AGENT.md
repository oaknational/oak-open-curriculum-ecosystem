# AGENT.md

This file provides core directives for AI agents working with this codebase. Read ALL of it first, then follow all instructions.

## Grounding

Commit to always using British spelling, and British English grammar, and British date and time formats.

Now reflect on what you are doing. Would you like to update your self-managed, internal tool task list? If you don't have one, you can create one, or simply move on.

### For Planning Work Only

Read the [metacognitive prompt](./metacognition.md) and follow all instructions, reflect on it.

## The Practice

This file is the operational entry point to the **agentic engineering practice** — the self-reinforcing system of principles, structures, specialist reviewers, and tooling that governs how work happens in this repository. The practice teaches itself through use: follow the links from here and the system reveals itself. For orientation, see [practice-core/index.md](../practice-core/index.md). For the full map, see [practice.md](../practice-core/practice.md). For cross-repo propagation and the plasmid exchange mechanism, see [practice-lineage.md](../practice-core/practice-lineage.md).

Agent onboarding starts with the `start-right` workflow:
- Cursor command: [`.cursor/commands/jc-start-right.md`](../../.cursor/commands/jc-start-right.md)
- Prompt: [`.agent/prompts/start-right.prompt.md`](../prompts/start-right.prompt.md)
- Skill: [`.agent/skills/start-right/SKILL.md`](../skills/start-right/SKILL.md)

Architectural Decision Records (ADRs) define how the system should work and are the architectural source of truth. Start with the [ADR index](../../docs/architecture/architectural-decisions/).

## First Question

Always apply the first question; **Ask: could it be simpler without compromising quality?**

## Cardinal Rule of This Repository

ALL static data structures, types, type guards, Zod schemas, Zod validators, and other type related information MUST flow from the Open Curriculum OpenAPI schema in the SDK, and be generated at build/compile time, i.e. when `pnpm sdk-codegen` is run. If the upstream OpenAPI schema changes, then running `pnpm sdk-codegen` MUST be sufficient to bring all workspaces into alignment with the new schema.

## Project Context

**What**: Libraries, SDK, MCP servers, and Search services for the Oak Open Curriculum API
**Package Manager**: pnpm (REQUIRED - never npm/yarn)  
**Commands**: See [Development Commands](#development-commands) below

## **RULES**

Read [the rules](./rules.md); reflect on them, _apply_ them,they MUST be followed at ALL times.

## Use Sub-agents

Always apply your own critical thinking to your work, and then use the sub-agents to gain additional perspectives and insights.

**Reviewers can review intentions, not just code.** Before implementing a complex change, ask a reviewer whether the approach is sound. Describe what you intend to do, why, and what alternatives you considered. The reviewer can identify architectural issues, missing considerations, or simpler approaches before any code is written. This is often more valuable than post-implementation review because it avoids wasted effort on the wrong approach.

### Available Sub-agents

Specialist sub-agents provide targeted reviews and insights. Use them proactively for quality assurance. For the full invocation matrix, timing guidance, triage checklist, and worked examples, see the `invoke-code-reviewers` rule (`.cursor/rules/invoke-code-reviewers.mdc`, always applied).

#### Standard Quality Roster

`code-reviewer` (gateway), `architecture-reviewer-barney`, `architecture-reviewer-fred`, `architecture-reviewer-betty`, `architecture-reviewer-wilma`, `test-reviewer`, `type-reviewer`, `config-reviewer`, `security-reviewer`, `docs-adr-reviewer`

#### Specialist On-Demand

`ground-truth-designer`, `subagent-architect`, `release-readiness-reviewer`, `onboarding-reviewer`

**Cursor-specific**: Invoke via the Task tool with `subagent_type` parameter. Other tooling: invoke by name using platform-specific methods.

### Cursor Configuration

| Location | Purpose |
|----------|---------|
| `.cursor/agents/*.md` | Sub-agent definitions |
| `.cursor/commands/*.md` | Slash commands (`/jc-review`, `/jc-gates`, etc.) |
| `.cursor/rules/*.mdc` | Always-applied rules |

### Skills and Commands

Commands and skills may be defined in more than one location. Check both the repo-native and Cursor-specific paths.

| Location | Purpose |
|----------|---------|
| `.agent/skills/*/SKILL.md` | Repo-managed skills for shared workflows |
| `.agent/prompts/*.md` | Reusable prompt playbooks |
| `.agent/memory/code-patterns/` | Known solutions to recurring design problems ([README](../../.agent/memory/code-patterns/README.md)) |
| `.cursor/commands/*.md` | Additional command definitions (currently Cursor-specific) |
| `.cursor/skills/*/` | Additional skills (currently Cursor-specific) |

## Essential Links

**Important**: These documents must be read.

### Core Practice

- [Development Practice](../../docs/governance/development-practice.md) - Code standards
- [Testing Strategy](testing-strategy.md) - TDD/BDD approach at all levels
- [TypeScript Practice](../../docs/governance/typescript-practice.md) - Type safety
- [Safety and Security](../../docs/governance/safety-and-security.md) - API keys, PII protection, security principles

### Architecture and Schema

- [Architecture](../../docs/architecture/README.md) - Architecture overview
- [ADR Index](../../docs/architecture/architectural-decisions/) - Architectural source of truth
- [ADR-029](../../docs/architecture/architectural-decisions/029-no-manual-api-data.md) - No manual API data structures
- [ADR-030](../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) - SDK as single source of truth
- [ADR-031](../../docs/architecture/architectural-decisions/031-generation-time-extraction.md) - Generation-time extraction
- [Schema-First MCP Execution Directive](./schema-first-execution.md) - Non-negotiable runtime/generator contract
- [Semantic Search Architecture](./semantic-search-architecture.md) - Structure is the foundation, transcripts are a bonus

### Vision

- [Vision](../../docs/foundation/VISION.md) - Why this repository exists and the impact it aims to achieve (current framing; supersedes ADR-008)

### Domain and Context

- [Curriculum Tools, Guidance and Playbooks](../../docs/governance/curriculum-tools-guidance-and-playbooks.md) - Categories, tags, playbooks, commands
- [Experience Recording](../experience/README.md) - Subjective experience across sessions

## Development Commands

From the repo root, via Turbo:

```bash
pnpm install        # Setup
pnpm clean          # Clean all build products
pnpm sdk-codegen    # Type generation
pnpm build          # Build
pnpm type-check     # Type check
pnpm format:root    # Format code
pnpm markdownlint:root    # Markdown lint
pnpm subagents:check    # Validate sub-agent standards
pnpm lint:fix       # Lint
pnpm test           # Unit and integration tests
pnpm test:ui        # UI tests
pnpm test:e2e       # E2E tests (includes built-server behaviour tests)
pnpm smoke:dev:stub # Local smoke tests

# Convenience commands
pnpm make           # install, build, type-check, doc-gen, lint:fix, subagents:check, markdownlint, format
pnpm qg             # Read-only quality gates: format-check, markdownlint-check, subagents:check, type-check, lint, test, test:ui, test:e2e, smoke:dev:stub
pnpm fix            # Auto-fix: format, markdownlint, lint:fix
pnpm doc-gen        # Generate documentation from TSDoc

# All in one command (clean rebuild + full verification)
pnpm check          # secrets:scan:all, clean, sdk-codegen, build, type-check, doc-gen, lint:fix, test, test:e2e, test:ui, smoke:dev:stub, subagents:check, markdownlint:root, format:root
```

## Architectural Understanding

This pnpm + Turborepo monorepo is organised along standard lines:

### Structure

- `apps/` – runnable apps that provide services to users
- `packages/libs/` – libraries (`@oaknational/logger`, `@oaknational/env-resolution`)
- `packages/sdks/` – SDKs (`@oaknational/curriculum-sdk`, `@oaknational/oak-search-sdk`, `@oaknational/sdk-codegen`)
- `packages/core/` – shared low-level code (`@oaknational/eslint-plugin-standards`, `@oaknational/type-helpers`, `@oaknational/result`, `@oaknational/env`)

## Remember

1. Periodically re-ground using [GO.md](../prompts/GO.md) — a complementary prompt that structures task execution with ACTION/REVIEW/GROUNDING cadence and invokes the [start-right prompt](../prompts/start-right.prompt.md)
2. When in doubt, **make it simpler**
3. Think in layers: functions → modules → packages (`core`, `libs`, `apps`)
4. Take the time to step back and reflect if the current approach is the simplest and best way to achieve the goals.
