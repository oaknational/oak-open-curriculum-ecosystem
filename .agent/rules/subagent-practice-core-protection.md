# Subagents Must Not Modify the Practice Core

## Rule

Sub-agents (background workers, worktree-isolated agents, batch unit agents)
**MUST NOT** create, edit, delete, or rename any file in:

- `.agent/directives/` — foundation documents (principles, testing strategy, schema-first execution)
- `.agent/rules/` — canonical rules
- `.claude/rules/` — Claude platform adapters
- `.cursor/rules/` — Cursor platform adapters

These paths constitute the **Practice Core** — the governance layer that shapes all
agent behaviour. Sub-agents lack the cross-session context and architectural
perspective needed to make sound changes to these documents.

## Why

A sub-agent is scoped to a narrow task (e.g., "fix verifyDocCounts"). It sees
one slice of the codebase, not the full practice history. Changes to the Practice
Core require understanding how rules interact, what precedents exist, and how a
change propagates across all agents and reviewers. An innocent-looking edit to a
rule file can silently erode the practice for every future session.

## What Sub-agents Should Do Instead

If a sub-agent discovers that a rule is wrong, missing, or needs updating:

1. **Document the finding** in its final report (not in the rule file)
2. **Flag it** with the text: `PRACTICE-CORE-FINDING: <description>`
3. The coordinating agent or human will assess and apply the change with full context

## Scope

This rule applies only to sub-agents — agents spawned via the Agent tool with
`run_in_background: true` or `isolation: "worktree"`. The primary conversation
agent (the one the human is talking to) retains full authority over the Practice Core.
