# AI Agent Development Guide

This guide helps AI agents work effectively with the Oak Notion MCP codebase using GO.md and established practices.

## 🎯 The GO.md Pattern

When given a task, always include "Read GO.md and follow all instructions" in your prompt. This ensures:

1. **Intent Clarity**: You identify and state the current plan
2. **Regular Grounding**: You re-read GO.md every third task
3. **Quality Maintenance**: You follow all rules and best practices

## 🧱 Standard Architecture (Current)

Active code and documentation use a conventional, intent‑revealing structure:

- `apps/` – runnable MCP servers (application wiring, startup)
- `packages/core/` – shared interfaces, types, and utilities (`@oaknational/mcp-core`)
- `packages/libs/` – runtime‑adaptive libraries (`@oaknational/mcp-logger`, `@oaknational/mcp-env`, `@oaknational/mcp-storage`, `@oaknational/mcp-transport`)

Historical material describing the legacy Greek model is preserved for context only. See the single pointer document: [Greek ecosystem deprecation](../architecture/greek-ecosystem-deprecation.md).

Key implementation principles:

- Small modules with clear interfaces
- Dependency injection instead of direct imports for runtime concerns
- Strict lint boundaries for safe cross‑package interactions

## 📋 Task Management

### TodoWrite Tool Usage

Always use the TodoWrite tool to:

- Plan complex tasks before starting
- Track progress through implementation
- Ensure nothing is forgotten

### Example Task Structure

```
1. Research existing implementation
2. Write tests for new feature
3. GROUNDING: read GO.md and follow all instructions
4. Implement feature to pass tests
5. Run quality gates
6. GROUNDING: read GO.md and follow all instructions
7. Refactor for clarity
8. Update documentation
9. GROUNDING: read GO.md and follow all instructions
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

## 🔄 Development Workflow

### 1. Before Starting Any Task

```
1. Read GO.md
2. Read AGENT.md
3. Create todo list with TodoWrite
4. Mark first task as in_progress
```

### 2. During Development

```
1. Follow TDD: Write test → Make it pass → Refactor
2. Run quality gates after each significant change:
   - pnpm format
   - pnpm type-check
   - pnpm lint
   - pnpm test
   - pnpm build
3. Keep only ONE task in_progress at a time
4. Mark tasks completed immediately when done
```

### 3. Every Third Task

Re-read GO.md to:

- Verify you're still aligned with the plan
- Check if anything has changed
- Ensure todo list is still relevant
- Remove completed or irrelevant tasks

## 🚫 Common Pitfalls to Avoid

### 1. Task Drift

**Problem**: Starting to implement features not in the original plan
**Solution**: Regular GO.md grounding keeps you focused

### 2. Incomplete Quality Gates

**Problem**: Forgetting to run tests or linting
**Solution**: Include quality gates in your todo list

### 3. Non-Atomic Tasks

**Problem**: Tasks like "Implement entire feature"
**Solution**: Break down into specific, measurable subtasks

### 4. Forgetting PII Scrubbing

**Problem**: Exposing emails or sensitive data
**Solution**: Always use the data scrubbing utilities

## 📝 Example: Adding a New Tool

```markdown
Task: Add a new tool to archive Notion pages. Read GO.md and follow all instructions.

TodoWrite:

1. Read GO.md and follow all instructions ✓
2. Research Notion API archive capabilities
3. Write unit tests for archive logic
4. GROUNDING: read GO.md and follow all instructions
5. Write integration tests for MCP handler
6. Implement pure archive function
7. GROUNDING: read GO.md and follow all instructions
8. Implement MCP tool handler
9. Run all quality gates
10. GROUNDING: read GO.md and follow all instructions
11. Update API documentation
12. Add example to quick reference
```

## 🔍 Key Files to Remember

### Application Layout (example)

- `src/app/` - Composition root (wiring, startup, server bootstrap)
- `src/tools/` - MCP tools and handlers
- `src/integrations/` - External integrations (e.g. Notion)
- `src/types/` - Local types and contracts
- `src/logging/` - App‑specific logging utilities

### Configuration

- `GO.md` - Grounding document (read every 3rd task)
- `AGENT.md` - Agent-specific directives
- `.agent/plans/` - Project plans and phases

### Documentation

- `docs/usage/api-reference.md` - All tools and resources
- `docs/agent-guidance/development-practice.md` - Code standards
- `docs/troubleshooting.md` - Common issues

## ✅ Success Checklist

Before considering any task complete:

- [ ] All tests pass (unit, integration)
- [ ] Quality gates pass (format, lint, type-check, build)
- [ ] Documentation updated if needed
- [ ] No hardcoded values or credentials
- [ ] PII properly scrubbed
- [ ] Todo list updated and current
- [ ] GO.md grounding completed as scheduled

## 🎓 Learning Resources

1. **Start Here**: [Developer Onboarding Journey](../development/onboarding-journey.md)
2. **Quick Tasks**: [Quick Reference](../quick-reference.md)
3. **Deep Dive**: [Understanding Agent References](./understanding-agent-references.md)
4. **Architecture (current)**: [Architecture README](../architecture/README.md)
5. **Historical context**: [Greek ecosystem deprecation](../architecture/greek-ecosystem-deprecation.md)

## 💡 Pro Tips

1. **Batch Tool Calls**: When reading multiple files, do it in one message
2. **Use Glob/Grep**: Better than Task tool for specific file searches
3. **Test First**: Always write tests before implementation
4. **Small Commits**: Make atomic commits with clear messages
5. **Regular Grounding**: Don't skip GO.md readings - they prevent costly mistakes

Remember: GO.md is not just a document - it's a practice that ensures consistent, high-quality development aligned with project goals.
