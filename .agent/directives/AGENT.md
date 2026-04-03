---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract detail to referenced docs; this file is an index/entry point"
---

# AGENT.md

This file provides core directives for AI agents working with this codebase. Read ALL of it first, then follow all instructions.

## Grounding

Commit to always using British spelling, and British English grammar, and British date and time formats.

Now reflect on what you are doing. Would you like to update your self-managed, internal tool task list? If you don't have one, you can create one, or simply move on.

### For Planning Work Only

Read the [metacognitive prompt](./metacognition.md) and follow all instructions, reflect on it.

## The Practice

This file is the operational entry point to the **agentic engineering practice** — the self-reinforcing system of principles, structures, specialist reviewers, and tooling that governs how work happens in this repository. The practice teaches itself through use: follow the links from here and the system reveals itself. For orientation, see [practice-core/index.md](../practice-core/index.md). For the local bridge from the portable Practice Core into this repo's live surfaces, see [practice-index.md](../practice-index.md). For the full map, see [practice.md](../practice-core/practice.md). For cross-repo propagation and the plasmid exchange mechanism, see [practice-lineage.md](../practice-core/practice-lineage.md).

Agent onboarding starts with the `start-right-quick` workflow:

- Cursor commands: [`.cursor/commands/jc-start-right-quick.md`](../../.cursor/commands/jc-start-right-quick.md)
- Shared workflow: [`.agent/skills/start-right-quick/shared/start-right.md`](../skills/start-right-quick/shared/start-right.md)
- Thorough shared workflow: [`.agent/skills/start-right-thorough/shared/start-right-thorough.md`](../skills/start-right-thorough/shared/start-right-thorough.md)
- Codex skills: [`.agent/skills/start-right-quick/SKILL.md`](../skills/start-right-quick/SKILL.md), [`.agent/skills/start-right-thorough/SKILL.md`](../skills/start-right-thorough/SKILL.md)
- Cursor skills: [`.cursor/skills/start-right-quick/SKILL.md`](../../.cursor/skills/start-right-quick/SKILL.md), [`.cursor/skills/start-right-thorough/SKILL.md`](../../.cursor/skills/start-right-thorough/SKILL.md)

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

Read [the rules](./principles.md); reflect on them, _apply_ them, they MUST be followed at ALL times.

## Use Sub-agents

Always apply your own critical thinking to your work, and then use the sub-agents to gain additional perspectives and insights.

**Reviewers can review intentions, not just code.** Before implementing a complex change, ask a reviewer whether the approach is sound. Describe what you intend to do, why, and what alternatives you considered. The reviewer can identify architectural issues, missing considerations, or simpler approaches before any code is written. This is often more valuable than post-implementation review because it avoids wasted effort on the wrong approach.

### Available Sub-agents

Specialist sub-agents provide targeted reviews and insights. Use them proactively for quality assurance. For the full invocation matrix, timing guidance, triage checklist, and worked examples, see the [invoke-code-reviewers directive](./invoke-code-reviewers.md).

#### Standard Quality Roster

`code-reviewer` (gateway), `architecture-reviewer-barney`, `architecture-reviewer-fred`, `architecture-reviewer-betty`, `architecture-reviewer-wilma`, `test-reviewer`, `type-reviewer`, `config-reviewer`, `security-reviewer`, `docs-adr-reviewer`

#### UI/Frontend Cluster (ADR-149)

`accessibility-reviewer`, `design-system-reviewer`, `react-component-reviewer`

#### Specialist On-Demand

`ground-truth-designer`, `subagent-architect`, `release-readiness-reviewer`, `onboarding-reviewer`, `mcp-reviewer`, `elasticsearch-reviewer`, `clerk-reviewer`, `sentry-reviewer`, `assumptions-reviewer`

**Cursor-specific**: Invoke via the Task tool with `subagent_type` parameter. Other tooling: invoke by name using platform-specific methods.

### Agent Tools

CLI tools for managing agent workflows live in [`agent-tools/`](../../agent-tools/README.md). Use the root scripts (for example `pnpm agent-tools:claude-agent-ops status` or `pnpm agent-tools:claude-agent-ops health`) to run them.

Canonical commands:

- `pnpm agent-tools:claude-agent-ops <status|health|worktrees|log|diff|commit-ready|preflight|cleanup>`
- `pnpm agent-tools:cursor-session-from-claude-session <find|inspect|takeover>`
- `pnpm agent-tools:codex-reviewer-resolve <agent-name> [--json]`

### Agent Artefact Architecture (ADR-125)

All agent artefacts follow a three-layer model: canonical content in `.agent/`, thin platform adapters in `.cursor/`/`.claude/`/`.gemini/`/`.agents/`/`.codex/`, and entry points (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`). For the full inventory see [artefact-inventory.md](./artefact-inventory.md).

**Platform configuration split (Claude Code)**: `.claude/settings.json` is
tracked in git and defines the agentic system contract — skill permissions
(`Skill(name)` entries), safety hooks (`PreToolUse`), and plugin state.
User-specific paths, one-off tool permissions, and machine-local overrides
belong in `.claude/settings.local.json` (gitignored). Arrays concatenate
across scopes per Claude Code merge semantics. The portability validator
(`pnpm portability:check`, Check 11) verifies that every Claude command
adapter has a corresponding `Skill()` permission entry in the project
settings.

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
- [Semantic Search Architecture](../../docs/agent-guidance/semantic-search-architecture.md) - Structure is the foundation, transcripts are a bonus

### Vision

- [Vision](../../docs/foundation/VISION.md) - Why this repository exists and the impact it aims to achieve (current framing; supersedes ADR-008)

### Domain and Context

- [Curriculum Tools, Guidance and Playbooks](../../docs/governance/curriculum-tools-guidance-and-playbooks.md) - Categories, tags, playbooks, commands
- [Experience Recording](../experience/README.md) - Subjective experience across sessions

## Development Commands

From the repo root:

Quality gate policy: run gates one at a time while iterating. If you need the
canonical aggregate verification command, ALWAYS use `pnpm check`.

```bash
pnpm install        # Setup
pnpm clean          # Clean all build products
pnpm sdk-codegen    # Type generation
pnpm build          # Build
pnpm type-check     # Type check
pnpm format:root    # Format code
pnpm markdownlint:root    # Markdown lint (auto-fix)
pnpm subagents:check    # Validate sub-agent standards
pnpm portability:check    # Validate canonical/adaptor and hook parity
pnpm lint:fix       # Lint (auto-fix)
pnpm test:root-scripts    # Repo-level script tests
pnpm test           # Unit and integration tests
pnpm test:field-integrity    # Manifest-based semantic-search field-integrity suites
pnpm test:widget    # MCP App widget in-process tests
pnpm test:ui        # Browser UI tests
pnpm test:a11y      # Browser accessibility tests
pnpm test:e2e       # E2E tests (includes built-server behaviour tests)
pnpm smoke:dev:stub # Local smoke tests
pnpm practice:fitness    # Strict fitness validation for live docs with frontmatter
pnpm practice:fitness:informational    # Non-blocking soft-ceiling report

# Convenience commands
pnpm make           # install, build, type-check, doc-gen, lint:fix, subagents:check, portability:check, practice:fitness:informational, markdownlint, format
pnpm fix            # Auto-fix: format, markdownlint, lint:fix
pnpm doc-gen        # Generate documentation from TSDoc

# All in one command (clean rebuild + full verification)
pnpm check          # Canonical aggregate gate: secrets:scan:all, clean, test:root-scripts, sdk-codegen + build, type-check, doc-gen, lint:fix, test, test:widget, test:e2e, test:ui, test:a11y, smoke:dev:stub, subagents:check, portability:check, markdownlint:root, format:root
```

## Architectural Understanding

This pnpm + Turborepo monorepo is organised along standard lines:

### Structure

- `apps/` – runnable apps that provide services to users
- `agent-tools/` – agent workflow CLIs (`@oaknational/agent-tools`)
- `packages/libs/` – libraries (`@oaknational/logger`, `@oaknational/env-resolution`, `@oaknational/search-contracts`, `@oaknational/sentry-node`, `@oaknational/sentry-mcp`)
- `packages/sdks/` – SDKs (`@oaknational/curriculum-sdk`, `@oaknational/oak-search-sdk`, `@oaknational/sdk-codegen`)
- `packages/core/` – shared low-level code (`@oaknational/eslint-plugin-standards`, `@oaknational/type-helpers`, `@oaknational/result`, `@oaknational/env`, `@oaknational/observability`)
- `packages/design/` – design tokens (`@oaknational/design-tokens-core`, `@oaknational/oak-design-tokens`)

## Remember

1. Periodically re-ground using [GO](../skills/go/shared/go.md) — a complementary skill that structures task execution with ACTION/REVIEW/GROUNDING cadence and invokes the [start-right-quick shared workflow](../skills/start-right-quick/shared/start-right.md)
2. When in doubt, **make it simpler**
3. Think in layers: functions → modules → packages (`core`, `libs`, `apps`)
4. Take the time to step back and reflect if the current approach is the simplest and best way to achieve the goals.
