---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract detail to referenced docs; this file is an index/entry point"
---

# AGENT.md

This file provides core directives for AI agents working with
this codebase. Read ALL of it first, then follow all instructions.

## Grounding

Commit to British spelling, grammar, and date formats.
Reflect on your current task; update your task list if
needed.

### For Planning Work Only

Read [metacognition.md](./metacognition.md) and follow all
instructions.

## The Practice

This file is the operational entry point to the **agentic
engineering practice** — the self-reinforcing system of
principles, structures, specialist reviewers, and tooling
that governs how work happens in this repository. The
practice teaches itself through use: follow the links from
here and the system reveals itself. Start with
[practice-core/index.md](../practice-core/index.md)
(orientation), then
[practice-index.md](../practice-index.md) (local bridge into
this repo's live surfaces),
[practice.md](../practice-core/practice.md) (full map), and
[practice-lineage.md](../practice-core/practice-lineage.md)
(cross-repo propagation and the plasmid exchange mechanism).

Agent onboarding starts with the `start-right-quick` or
`start-right-thorough` workflow. Shared workflow definitions
live in `.agent/skills/start-right-*/shared/`. Platform
adapters in `.cursor/`, `.claude/`, `.codex/` directories.

For the layering contract (doctrine / memory /
reference / plans / workflow / adapters), authority order, and
routing rule, see [orientation.md](./orientation.md).

ADRs define how the system should work and are the
architectural source of truth. Before substantive work,
scan the [5-ADR starter block][adr-5] and open any ADR
that matches your current work area from the
[ADR index][adr-index].

[adr-5]: ../../docs/architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes
[adr-index]: ../../docs/architecture/architectural-decisions/README.md

## First Question

Always apply the first question; **Ask: could it be simpler without compromising quality?**

## Cardinal Rule of This Repository

ALL static data structures, types, type guards, Zod
schemas, Zod validators, and other type related information
MUST flow from the Open Curriculum OpenAPI schema in the
SDK, and be generated at build/compile time, i.e. when
`pnpm sdk-codegen` is run. If the upstream OpenAPI schema
changes, then running `pnpm sdk-codegen` MUST be sufficient
to bring all workspaces into alignment with the new schema.

## Project Context

**What**: Libraries, SDK, MCP servers, and Search services
for the Oak Open Curriculum API.
**pnpm only** (never npm/yarn). See [Commands](#development-commands).

## **RULES**

Read [the rules](./principles.md); reflect on them, _apply_
them, they MUST be followed at ALL times.

**Always-applied rule tier** at [`.agent/rules/`](../rules/) —
additional rules that operationalise principles, ADRs, and PDRs
and MUST be followed at ALL times. On Claude the tier is loaded
automatically from `.claude/rules/*.md`; on Cursor from
`.cursor/rules/*.mdc` with `alwaysApply: true`. On Codex, Gemini,
and any other non-loader platform, **read every file in
`.agent/rules/` at session open** — the canonical files are the
source of truth and the platform adapters are thin pointers.

## Use Sub-agents

Always apply your own critical thinking to your work, and
then use the sub-agents to gain additional perspectives and
insights.

**Reviewers can review intentions, not just code.** Before
implementing a complex change, ask a reviewer whether the
approach is sound. Describe what you intend to do, why, and
what alternatives you considered. The reviewer can identify
architectural issues, missing considerations, or simpler
approaches before any code is written. This is often more
valuable than post-implementation review because it avoids
wasted effort on the wrong approach.

### Available Sub-agents

Specialist sub-agents provide targeted reviews and insights.
Use them proactively for quality assurance. For the full
invocation matrix, timing guidance, triage checklist, and
worked examples, see the reviewer catalogue in executive memory:
[`invoke-code-reviewers.md`](../memory/executive/invoke-code-reviewers.md).

- **Standard quality roster**: `code-reviewer` (gateway),
  `architecture-reviewer-barney`/`-fred`/`-betty`/`-wilma`,
  `test-reviewer`, `type-reviewer`, `config-reviewer`,
  `security-reviewer`, `docs-adr-reviewer`.
- **UI/frontend cluster (ADR-149)**: `accessibility-reviewer`,
  `design-system-reviewer`, `react-component-reviewer`.
- **Specialist on-demand**: `ground-truth-designer`,
  `subagent-architect`, `release-readiness-reviewer`,
  `onboarding-reviewer`, `mcp-reviewer`,
  `elasticsearch-reviewer`, `clerk-reviewer`,
  `sentry-reviewer`, `assumptions-reviewer`.

**Cursor-specific**: Invoke via the Task tool with
`subagent_type` parameter. Other tooling: invoke by name
using platform-specific methods.

### Agent Tools

CLI tools for managing agent workflows live in
[`agent-tools/`](../../agent-tools/README.md). Use the root
scripts (for example
`pnpm agent-tools:claude-agent-ops status` or
`pnpm agent-tools:claude-agent-ops health`) to run them.

Canonical commands:

- `pnpm agent-tools:claude-agent-ops`
  `<status|health|worktrees|log|diff|commit-ready|preflight|cleanup>`
- `pnpm agent-tools:cursor-session-from-claude-session <find|inspect|takeover>`
- `pnpm agent-tools:codex-reviewer-resolve <agent-name> [--json]`

### Agent Artefact Architecture (ADR-125)

All agent artefacts follow a three-layer model: canonical
content in `.agent/`, thin platform adapters in
`.cursor/`/`.claude/`/`.gemini/`/`.agents/`/`.codex/`, and
entry points (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`). For
the full inventory see
[artefact-inventory.md](../memory/executive/artefact-inventory.md) (see § Create
New Artefacts to author a new rule, skill, command, sub-agent,
or ADR) and
[docs/engineering/extending.md](../../docs/engineering/extending.md).

**Platform configuration split (Claude Code)**:
`.claude/settings.json` (tracked) defines the system contract;
`.claude/settings.local.json` (gitignored) holds user-local
overrides. See [artefact-inventory.md](../memory/executive/artefact-inventory.md)
for the full split policy and portability validator details.

## Memory and Patterns

Institutional memory lives in `.agent/memory/`:

- [distilled.md](../memory/active/distilled.md) — hard-won rules extracted from
  session napkins. Read before every session.
- [patterns/](../memory/active/patterns/README.md) — 77 abstract, reusable
  solutions to recurring design problems across code, architecture,
  process, testing, and agent infrastructure. Before inventing a new
  approach, check the pattern library for a known solution.
- [napkin.md](../memory/active/napkin.md) — current session observations
  (written continuously, distilled periodically).

## Essential Links

**Important**: These documents must be read.

### Core Practice

- [Development Practice](../../docs/governance/development-practice.md) - Code standards
- [Testing Strategy](testing-strategy.md) - TDD/BDD approach at all levels
- [TypeScript Practice](../../docs/governance/typescript-practice.md) - Type safety
- [Safety and Security](../../docs/governance/safety-and-security.md) -
  API keys, PII protection, security principles

### UI and Design

- [Accessibility Practice](../../docs/governance/accessibility-practice.md) -
  WCAG 2.2 AA, Playwright + axe-core
- [Design Token Practice](../../docs/governance/design-token-practice.md) -
  DTCG three-tier model, contrast validation
- [MCP App Styling](../../docs/governance/mcp-app-styling.md) -
  SDK variable bridges, font loading, CSP

### Architecture and Schema

- [Architecture](../../docs/architecture/README.md) - Architecture overview
- [ADR Index](../../docs/architecture/architectural-decisions/) - Architectural source of truth
- [ADR-029](../../docs/architecture/architectural-decisions/029-no-manual-api-data.md) -
  No manual API data structures
- [ADR-030](../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) -
  SDK as single source of truth
- [ADR-031](../../docs/architecture/architectural-decisions/031-generation-time-extraction.md) -
  Generation-time extraction
- [Schema-First MCP Execution Directive](./schema-first-execution.md) -
  Non-negotiable runtime/generator contract
- [Semantic Search Architecture](../../docs/agent-guidance/semantic-search-architecture.md) -
  Structure is the foundation, transcripts are a bonus

### Vision

- [Vision](../../docs/foundation/VISION.md) - Why this
  repository exists and the impact it aims to achieve
  (current framing; supersedes ADR-008)

### Domain and Context

- [Curriculum Tools, Guidance and Playbooks][curriculum] —
  Categories, tags, playbooks, commands
- [Experience Recording](../experience/README.md) —
  Subjective experience across sessions

[curriculum]: ../../docs/governance/curriculum-tools-guidance-and-playbooks.md

## Development Commands

From the repo root. Quality-gate policy: run gates one at a time
while iterating; for canonical aggregate verification, use `pnpm check`.

```bash
pnpm install             # Setup
pnpm clean               # Clean all build products
pnpm sdk-codegen         # Type generation
pnpm build               # Build
pnpm type-check          # Type check
pnpm format:root         # Format code
pnpm markdownlint:root   # Markdown lint (auto-fix)
pnpm subagents:check     # Validate sub-agent standards
pnpm portability:check   # Validate canonical/adaptor parity
pnpm lint:fix            # Lint (auto-fix)
pnpm test:root-scripts   # Repo-level script tests
pnpm test                # Unit and integration tests
pnpm test:field-integrity # Semantic-search field-integrity
pnpm test:widget         # MCP App widget in-process tests
pnpm test:ui             # Browser UI tests
pnpm test:a11y           # Browser a11y tests
pnpm test:widget:ui      # Widget Playwright visual tests
pnpm test:widget:a11y    # Widget WCAG 2.2 AA a11y tests
pnpm test:e2e            # E2E tests (built-server)
pnpm smoke:dev:stub      # Local smoke tests
pnpm practice:fitness              # Three-zone, exits 1 on critical (ADR-144)
pnpm practice:fitness:strict-hard  # Consolidation-closure gate: exits 1 on hard or critical
pnpm practice:fitness:informational # Four-zone report, never blocks
pnpm practice:vocabulary           # Three-zone vocabulary consistency check
pnpm make                # Build + lint + format + doc-gen
pnpm fix                 # Auto-fix: format, lint, markdownlint
pnpm doc-gen             # Generate docs from TSDoc
pnpm check               # Canonical aggregate gate (all)
```

## Architectural Understanding

This pnpm + Turborepo monorepo is organised along standard lines:

### Structure

- `apps/` – runnable apps that provide services to users
- `agent-tools/` – agent workflow CLIs (`@oaknational/agent-tools`)
- `packages/libs/` – libraries (logger, env-resolution,
  search-contracts, sentry-node)
- `packages/sdks/` – SDKs (curriculum-sdk, oak-search-sdk,
  sdk-codegen)
- `packages/core/` – shared low-level code (eslint-plugin,
  type-helpers, result, env, observability)
- `packages/design/` – design tokens (core, oak)

## Remember

1. Periodically re-ground using [GO](../skills/go/shared/go.md)
   (ACTION/REVIEW/GROUNDING cadence).
2. When in doubt, **make it simpler**. Think in layers (functions →
   modules → packages) and step back to ask: is this the simplest
   approach?
