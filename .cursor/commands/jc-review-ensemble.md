# Review Ensemble

Invoke all 6 general code reviewers in parallel for maximum perspective diversity.

## Instructions

Run the following 6 sub-agents **in parallel** using the Task tool. Each should review the recent code changes.

### Reviewers to Invoke

1. **code-reviewer-general-composer** (Composer 1)
2. **code-reviewer-general-gemini-flash** (Gemini 3 Flash)
3. **code-reviewer-general-haiku** (Haiku 4.5)
4. **code-reviewer-general-grok** (Grok Code)
5. **code-reviewer-general-kimi** (Kimi K2)
6. **code-reviewer-general-codex-low** (GPT-5.2 Codex Low)

### Prompt for Each Reviewer

Use this prompt for all reviewers:

> Review the recent code changes in this session for:
>
> 1. Code quality and maintainability
> 2. Potential bugs or edge cases
> 3. Type safety concerns
> 4. Testing gaps
> 5. Adherence to project conventions
>
> Reference `.agent/sub-agents/code-reviewer-template.md` for full review criteria.
> Be specific about file locations and line numbers.

### Invocation Pattern

```yaml
Task tool:
  subagent_type: "code-reviewer-general-composer"
  readonly: true
  prompt: "[prompt above]"
```

Repeat for all 6 reviewers in the same message to run them in parallel.

## Synthesise Findings

After all reviewers respond:

1. **Common themes**: Issues flagged by multiple models are high-confidence findings
2. **Unique insights**: Issues only one model caught — review carefully, may be false positives or genuine catches
3. **Prioritise by severity**: Critical > Important > Suggestions
4. **Present consolidated summary** to the user with actionable recommendations

## When to Use

- After completing a feature or user story
- After fixing a non-trivial bug
- After refactoring (especially structural changes)
- After adding or modifying public APIs
- When changes touch multiple files

## Reference

@.cursor/rules/invoke-code-reviewers.mdc
