# AI Agent Development Guide

This guide helps AI agents and human developers work effectively with the Oak MCP ecosystem. It complements [AGENT.md](../../.agent/directives/AGENT.md), which is the canonical entry point for agent directives, rules, and architectural context.

## Getting Started

1. Read [AGENT.md](../../.agent/directives/AGENT.md) and follow all instructions
2. Read [rules.md](../../.agent/directives/rules.md) — the authoritative rules
3. Read [testing-strategy.md](../../.agent/directives/testing-strategy.md) — TDD at all levels
4. Create your todo list (see [Task Management](#task-management) below)
5. Mark the first task as in-progress and begin

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
