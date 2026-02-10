# Review Ensemble

Invoke 4 general code reviewers for diverse perspectives.

## Instructions

Run the 4 sub-agents **sequentially**, one at a time, waiting for each to complete before starting the next:

1. **code-reviewer-general-composer** (Composer 1)
2. **code-reviewer-general-gemini-pro** (Gemini 3 Pro)
3. **code-reviewer-general-sonnet** (Sonnet 4.5 Thinking)
4. **code-reviewer-general-codex** (GPT-5.2 Codex)

### Prompt for Each Reviewer

Use this prompt for all reviewers:

> Review the recent code changes (not doc changes) in this session for:
>
> 1. Code quality and maintainability
> 2. Potential bugs or edge cases
> 3. Type safety concerns
> 4. Testing gaps
> 5. Adherence to project conventions
>
> **CRITICAL**: Before reviewing, you MUST read and internalise these foundation documents:
>
> - `.agent/sub-agents/code-reviewer-template.md` - Full review criteria
> - `.agent/directives/AGENT.md` - Core directives
> - `.agent/directives/rules.md` - **THE AUTHORITATIVE RULES**
> - `.agent/directives/testing-strategy.md` - Testing philosophy
>
> Apply these rules with understanding, not mechanically. For example:
>
> - `as const` (const assertion) is NOT the same as `as SomeType` (type assertion)
> - Archived code is legacy and should not be assessed as current code
> - Tests must verify BEHAVIOUR, not data shape or types
>
> Be specific about file locations and line numbers.

### Invocation Pattern

```yaml
Task tool:
  subagent_type: "code-reviewer-general-composer"
  readonly: true
  prompt: "[prompt above]"
```

## Synthesise Findings (CRITICAL)

After all reviewers respond, you MUST critically evaluate and synthesise their findings. Reviewers may:

- Misunderstand project rules (e.g., confusing `as const` with `as Type`)
- Apply rules mechanically without context
- Suggest testing approaches that contradict testing-strategy.md
- Flag archived/legacy code as if it were current code
- Miss the distinction between behaviour and implementation

### Synthesis Steps

1. **Read each finding carefully** — Does it actually violate our rules when understood in context?

2. **Cross-reference with foundation documents**:
   - Does the suggestion align with `rules.md`?
   - Does the testing suggestion align with `testing-strategy.md`?
   - Is the code actually in scope (not archived)?

3. **Categorise findings**:
   - **Valid**: Genuine issues that violate our rules correctly understood
   - **False positive**: Misapplied rules or mechanical interpretation
   - **Context-dependent**: Needs more information to judge

4. **Common themes**: Issues flagged by multiple models with valid reasoning are high-confidence

5. **Unique insights**: Single-model findings need extra scrutiny — may be false positives OR genuine catches others missed

6. **Present consolidated summary** to the user:
   - Valid issues with actionable recommendations
   - Dismissed findings with brief explanation of why
   - Areas where your own judgement was required

**Remember**: The ensemble provides diverse perspectives. Your job is to synthesise these into accurate, context-aware recommendations — not to blindly accept all findings.

## When to Use

- After completing a feature or user story
- After fixing a non-trivial bug
- After refactoring (especially structural changes)
- After adding or modifying public APIs
- When changes touch multiple files

## Reference

@.cursor/rules/invoke-code-reviewers.mdc
