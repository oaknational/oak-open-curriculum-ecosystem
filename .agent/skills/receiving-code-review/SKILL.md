---
name: receiving-code-review
classification: passive
description: >-
  How to process code review feedback effectively. Understand before acting,
  verify suggestions technically, ask for clarification when needed.
  Complements the reviewer sub-agents.
---

# Receiving Code Review

Guidance for processing review feedback — whether from human reviewers or sub-agent reviewers.

## Principles

### Understand before acting

- Read all feedback before making any changes
- Identify which comments are blocking vs advisory
- Group related comments that may share a root cause

### Verify suggestions technically

- Do not blindly implement reviewer suggestions — verify they are correct
- Run the suggested change through tests before accepting
- If a suggestion introduces a regression, flag it rather than accepting it

### Ask for clarification

- If feedback is ambiguous, ask the reviewer to clarify rather than guessing
- If you disagree with a suggestion, explain why with evidence (test results, type errors, architectural constraints)
- Silence is not agreement — respond to every substantive comment

### One concern at a time

- Address each piece of feedback in a separate commit where practical
- This makes review of the fixes easier and keeps the history clean

## Anti-patterns

- **Performative agreement**: accepting all suggestions without evaluation
- **Defensive dismissal**: rejecting feedback without technical justification
- **Scope creep**: using review feedback as an excuse to refactor unrelated code

## References

- `.agent/sub-agents/templates/` — reviewer prompt templates
- `.agent/directives/invoke-code-reviewers.md` — when and how reviewers are invoked
