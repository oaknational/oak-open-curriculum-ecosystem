---
name: parallel-agents
classification: passive
description: >-
  Guidance on dispatching parallel sub-agents safely. Use when facing
  multiple independent tasks that can be worked on without shared state
  or sequential dependencies.
---

# Parallel Agents

Guidance for dispatching multiple sub-agents concurrently to speed up independent work.

## When to Parallelise

- Tasks have **no shared state**: each agent works on different files or different concerns
- Tasks have **no sequential dependency**: agent B does not need agent A's output
- The work is **read-heavy or write-isolated**: exploration, review, or independent feature implementation

## When NOT to Parallelise

- Tasks modify the **same files**: merge conflicts are likely
- Tasks have **ordering requirements**: one must complete before the next starts
- Tasks need **shared context**: one agent's findings inform another's approach

## Dispatch Pattern

1. **Define tasks explicitly**: each agent gets a clear, self-contained brief
2. **Include full context**: agents start fresh — provide file paths, code snippets, and intent
3. **Specify boundaries**: tell each agent exactly which files/directories it owns
4. **Attach a delegation snapshot**: include the minimum contract below so the child lane can work without guessing
5. **Merge results**: after all agents complete, review and integrate their work

## Delegation Snapshot

Every bounded delegated task should carry these fields:

- **Goal**: the concrete outcome the child lane owns
- **Owned surface**: files, modules, or concern boundary owned by that lane
- **Non-goals**: what must stay out of scope
- **Required evidence**: tests, docs, screenshots, or command output needed before reintegration
- **Acceptance signal**: what tells the parent lane the work is ready to absorb
- **Reintegration owner**: who updates the authoritative plan or dialogue
- **Stop or escalate rule**: when the child lane should stop and ask rather than improvise

If you cannot fill these fields concisely, the task is probably under-scoped.

## Merging Results

- Check for conflicting changes across agents
- Run quality gates after integration
- If agents produced overlapping changes, resolve manually rather than accepting both

## Reintegration Contract

- Mailbox delivery is not reintegration.
- Reintegration completes only when the parent lane absorbs the child outcome
  back into the authoritative plan, prompt, or dialogue.
- If the child result conflicts with the live repo state, re-ground before
  editing or merging.
- Keep the parent lane as the owner of final sequencing and closure decisions.

## Common Parallel Patterns

| Pattern | Agent 1 | Agent 2 | Agent 3 |
|---------|---------|---------|---------|
| Multi-area exploration | Search area A | Search area B | Search area C |
| Independent features | Feature X files | Feature Y files | — |
| Review + implement | Code reviewer | Implementer (after review) | — |
| Test + docs | Write tests | Write documentation | — |

## References

- [ADR-114](../../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md) — sub-agent composition model
- `.agent/sub-agents/` — canonical sub-agent templates and components
- `agent-tools/src/core/session-tools.ts` — takeover bundle reintegration contract
