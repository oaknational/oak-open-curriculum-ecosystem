# Deep Codebase Review

Read this WHOLE document _before_ taking action.

## Request

Perform a slow, deep, COMPREHENSIVE review of the **entire** codebase: go slowly, take your time, get it right. I do not expect this process to be quick, I do expect it to be both thorough and accurate.

As you go, compare the code to the rules @.agent/directives-and-memory/rules.md and other guidance @.agent/directives-and-memory/AGENT.md, and make notes of any discrepancies.

If additional context was provided by the user, consider all feedback in that context.

## Structured Thinking

First, before taking action:

1. **Think hard** about the request - these are your thoughts.
2. **Reflect deeply** on those thoughts - these are your reflections.
3. **Comprehensively consider** those reflections - these are your insights.
4. **Think hard** about what the insights tell you about the original request, and the context and desired impact. What has changed? _Why?_
5. **Report** your insights and how they inform the original request.

Then, using your thoughts, reflections, and insights, work through the following step-by-step, thinking really hard at each point:

1. **UNDERSTAND**: What is the core question being asked?
2. **ANALYSE**: What are the key factors/components involved?
3. **REASON**: What logical connections can I make?
4. **SYNTHESISE**: How do these elements combine?
5. **CONCLUDE**: What is the most accurate/helpful response?

## Sub-agent Orchestration

The review MUST use all appropriate sub-agents. Invoke them as needed, as many times as needed, and use their reports to inform your review.

**Cursor-specific**: Use the Task tool with `readonly: true` and the appropriate `subagent_type`:

| Sub-agent | Purpose | When to Invoke |
|-----------|---------|----------------|
| `architecture-reviewer` | Structural compliance, boundaries | For import patterns, module structure, workspace boundaries |
| `code-reviewer` | Quality, security, maintainability | For code quality, patterns, potential issues |
| `test-reviewer` | Test quality, TDD compliance | For test structure, mock quality, test value |
| `type-reviewer` | Type safety, compile-time embedding | For type assertions, generics, type flow |
| `config-reviewer` | Configuration consistency | For tooling configs, quality gates |

Make it clear to each sub-agent that they are to **review and report**, not to modify or fix.

## Execution

Now: carry out the review and produce a detailed, actionable report, thinking hard at each step.

1. Gather context using quality gate commands:

   ```bash
   pnpm type-check
   pnpm lint
   pnpm test
   ```

2. Invoke each relevant sub-agent to review and report.

3. Reflect on their reports and your own analysis.

4. Produce a consolidated report with:
   - **Summary**: Overall assessment
   - **Critical Issues**: Must be addressed
   - **Improvements**: Should be addressed
   - **Positive Observations**: What's working well
   - **Recommendations**: Strategic next steps

## Output Format

```text
## Comprehensive Review Report

**Date**: [Date]
**Scope**: [What was reviewed]
**Overall Status**: [HEALTHY / CONCERNS / CRITICAL]

### Quality Gate Status

| Gate | Status | Notes |
|------|--------|-------|
| Type Check | PASS/FAIL | [notes] |
| Lint | PASS/FAIL | [notes] |
| Tests | PASS/FAIL | [notes] |

### Sub-agent Reports Summary

| Agent | Status | Key Findings |
|-------|--------|--------------|
| architecture-reviewer | [status] | [summary] |
| code-reviewer | [status] | [summary] |
| test-reviewer | [status] | [summary] |
| type-reviewer | [status] | [summary] |
| config-reviewer | [status] | [summary] |

### Critical Issues

[Issues that must be addressed immediately]

### Improvements

[Issues that should be addressed]

### Positive Observations

[What's working well - be specific]

### Strategic Recommendations

[Next steps and priorities]
```
