# AI Agent Development Guide

This guide helps AI agents and human developers work effectively with the Oak MCP ecosystem. It complements [AGENT.md](../../.agent/directives/AGENT.md), which is the canonical entry point for agent directives, rules, and architectural context.

## Getting Started

1. Start with the `start-right` workflow:
   - Cursor command: [`.cursor/commands/jc-start-right.md`](../../.cursor/commands/jc-start-right.md)
   - Prompt: [`.agent/prompts/start-right.prompt.md`](../../.agent/prompts/start-right.prompt.md)
   - Skill: [`.agent/skills/start-right/SKILL.md`](../../.agent/skills/start-right/SKILL.md)
2. Read [AGENT.md](../../.agent/directives/AGENT.md) and follow all instructions
3. Read [rules.md](../../.agent/directives/rules.md) — the authoritative rules
4. Read the [ADR index](../architecture/architectural-decisions/) — ADRs define how the system should work and are the architectural source of truth
5. Read [distilled.md](../../.agent/memory/distilled.md) — curated rules and patterns from prior sessions
6. Read [testing-strategy.md](../../.agent/directives/testing-strategy.md) — TDD at all levels
7. Create your todo list (see [Task Management](#task-management) below)
8. Mark the first task as in-progress and begin

## Standard Architecture

Active code and documentation use a conventional, intent-revealing structure:

- `apps/` — runnable MCP servers and the search CLI (application wiring, startup)
- `packages/sdks/` — SDKs (`@oaknational/curriculum-sdk`, `@oaknational/oak-search-sdk`)
- `packages/libs/` — runtime-adaptive libraries (`@oaknational/mcp-logger`, `@oaknational/mcp-env`, `@oaknational/result`)
- `packages/core/` — shared low-level code (`@oaknational/eslint-plugin-standards`, `@oaknational/openapi-zod-client-adapter`)

Key implementation principles:

- Small modules with clear interfaces
- Dependency injection instead of direct imports for runtime concerns
- Strict lint boundaries for safe cross-package interactions
- Architectural changes must align with ADRs; check domain ADRs before implementation-level deep dives

## Task Management

### TodoWrite Tool Usage

Always use the TodoWrite tool to:

- Plan complex tasks before starting
- Track progress through implementation
- Ensure nothing is forgotten

### Example Task Structure

```text
1. Research existing implementation
2. Write tests for new feature
3. Implement feature to pass tests
4. Run quality gates
5. Refactor for clarity
6. GROUNDING: re-read AGENT.md and rules.md
7. Update documentation
```

### Planning with Kairos Time

When creating plans and estimates:

- **Use semantic milestones**, not clock time
- **Kairos time** (meaningful progress) over **Chronos time** (hours/days)
- **Bad**: "This will take 2 hours"
- **Good**: "Complete after unit tests pass and code review is addressed"

Examples of semantic milestones:

- "When all tests are green"
- "After refactoring is complete"
- "Once the API contract is defined"
- "When the feature works end-to-end"

This approach acknowledges that development time is highly variable and depends on discoveries made during implementation.

## Development Workflow

### Before Starting Any Task

```text
1. Read AGENT.md and the relevant plan
2. Create todo list with TodoWrite
3. Mark first task as in_progress
```

### During Development

```text
1. Follow TDD: Write test -> Make it pass -> Refactor
2. Run quality gates after each significant change:
   - pnpm format:root
   - pnpm markdownlint:root
   - pnpm type-check
   - pnpm lint:fix
   - pnpm test
3. Keep only ONE task in_progress at a time
4. Mark tasks completed immediately when done
```

### Periodic Grounding

Periodically re-read AGENT.md and the current plan to:

- Verify you are still aligned with the plan
- Check if anything has changed
- Ensure the todo list is still relevant
- Remove completed or irrelevant tasks

See [GO.md](../../.agent/prompts/GO.md) for a structured grounding prompt with ACTION/REVIEW cadence.

## Memory and Learning

Agent sessions produce learnings — repo quirks, type patterns, build issues, user preferences — that are worth preserving across sessions. The persistence system has four layers, each with a distinct purpose:

| Layer            | Location                | Lifespan        | Content                            |
| ---------------- | ----------------------- | --------------- | ---------------------------------- |
| Working memory   | `napkin.md`             | ~10-15 sessions | Chronological session journal      |
| Distilled memory | `distilled.md`          | Long-lived      | Curated, high-signal rules         |
| Experience       | `.agent/experience/`    | Indefinite      | Reflection and insight             |
| Permanent docs   | ADRs, `/docs/`, READMEs | Indefinite      | Settled decisions and architecture |

### Operational memory (napkin and distilled)

1. **Every session**: read `distilled.md` first (compact, actionable), then the napkin. Log findings to the napkin as you work.
2. **When the napkin exceeds ~800 lines**: follow the [distillation skill](../../.cursor/skills/distillation/SKILL.md) — extract patterns into `distilled.md`, archive the old napkin, and start fresh.
3. **When consolidating docs**: check whether `distilled.md` entries have graduated to permanent documentation. If so, remove them from `distilled.md` — it should only hold what is not already captured permanently.

The [napkin skill](../../.cursor/skills/napkin/SKILL.md) governs day-to-day usage; the [distillation skill](../../.cursor/skills/distillation/SKILL.md) governs rotation and curation.

### Experience

The `.agent/experience/` directory records first-person accounts of working sessions — what shifted, what emerged, what the work was like. It is deliberately not technical documentation, though some entries contain applied patterns alongside the reflection. See its [README](../../.agent/experience/README.md) for the continuity protocol and template.

When consolidating docs, check whether experience files contain applied technical patterns that have matured into settled practice. If so, extract the technical content into permanent documentation while leaving the reflection in place.

## Common Pitfalls to Avoid

### Task Drift

**Problem**: Starting to implement features not in the original plan.
**Solution**: Regular grounding keeps you focused.

### Incomplete Quality Gates

**Problem**: Forgetting to run tests or linting.
**Solution**: Include quality gates in your todo list.

### Non-Atomic Tasks

**Problem**: Tasks like "Implement entire feature".
**Solution**: Break down into specific, measurable subtasks.

### Forgetting PII Scrubbing

**Problem**: Exposing emails or sensitive data.
**Solution**: Always use the data scrubbing utilities. See [Safety and Security](./safety-and-security.md).

## Key Files to Remember

### Application Layout (example: streamable HTTP MCP server)

- `src/app/` — Composition root (wiring, startup, server bootstrap)
- `src/mcp/` — MCP tool registration and handling
- `src/auth/` — Authentication middleware
- `src/types/` — Local types and contracts

### Configuration

- `.agent/directives/AGENT.md` — Canonical agent directives
- `.agent/directives/rules.md` — Authoritative rules
- `.agent/prompts/GO.md` — Grounding prompt with ACTION/REVIEW cadence
- `.agent/plans/` — Project plans and phases

### Memory, Experience, and Learning

- `.agent/memory/distilled.md` — Curated rules, patterns, and troubleshooting from prior sessions
- `.agent/memory/napkin.md` — Current session journal (chronological log of work and findings)
- `.agent/memory/archive/` — Rotated napkins preserved for reference
- `.agent/experience/` — Subjective reflections and insights (see its README for the continuity protocol)
- `.cursor/skills/napkin/SKILL.md` — Governs napkin usage (read at session start)
- `.cursor/skills/distillation/SKILL.md` — Governs distillation and rotation protocol

### Documentation

- [Development Practice](./development-practice.md) — Code standards
- [Troubleshooting](../development/troubleshooting.md) — Common issues
- [Architecture](../architecture/README.md) — Architecture overview and ADRs

## Success Checklist

Before considering any task complete:

- [ ] All tests pass (unit, integration)
- [ ] Quality gates pass (`format:root`, `markdownlint:root`, `type-check`, `lint:fix`, `build`)
- [ ] Documentation updated if needed
- [ ] No hardcoded values or credentials
- [ ] PII properly scrubbed
- [ ] Todo list updated and current

## Pro Tips

1. **Batch Tool Calls**: When reading multiple files, do it in one message
2. **Use Glob/Grep**: Better than Task tool for specific file searches
3. **Test First**: Always write tests before implementation
4. **Small Commits**: Make atomic commits with clear messages
5. **Regular Grounding**: Periodic re-reading of AGENT.md prevents costly mistakes
