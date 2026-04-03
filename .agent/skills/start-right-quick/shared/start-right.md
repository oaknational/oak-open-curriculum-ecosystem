---
prompt_id: start-right-quick
title: "Start Right (Quick)"
type: workflow
status: active
last_updated: 2026-02-27
---

# Start Right (Quick)

Ground yourself before beginning work.

## Foundation Documents

Read and internalise these documents:

1. @.agent/directives/AGENT.md — Entry point and documentation index
2. @.agent/directives/principles.md — **THE AUTHORITATIVE RULES**
3. @.agent/directives/testing-strategy.md — TDD at all levels
4. @.agent/directives/schema-first-execution.md — Types flow from schema

## Practice Box

Check `.agent/practice-core/incoming/` for practice-core files. If present, alert the user — incoming material may carry learnings from another repo. Full integration happens during `/jc-consolidate-docs` (step 8).

## Session Priority

Apply session priority ordering:

1. **Bugs first** — fix known defects before anything else
2. **Unfinished planned work second** — complete in-progress items
3. **New work last** — only start new items when the above are clear

## Guiding Questions

Before diving in, pause and ask:

1. **Are we solving the right problem, at the right layer?**
2. **What value are we delivering, through what impact, for which users?**
3. **Could it be simpler without compromising quality?**
4. **What assumptions am I making? Are they valid?**

## Commit

**Commit** to excellence in systems architecture, software engineering, and developer experience. Choose architectural correctness over short-term expediency. This requires critical and _long-term_ thinking.

## Schema-First Nuance

Schema-first is absolute for SDK code calling the upstream API or extracting from the OpenAPI spec. It is acceptable to add additional metadata (e.g., MCP tool descriptions) at sdk-codegen time.

When analysing generated files, always analyse the generator code that produced them — the generator is the source of truth.

## Sub-agent Reviews

Invoke sub-agent reviewers per the `invoke-code-reviewers` rule after making changes. The rule contains the full invocation matrix, timing tiers, quick-triage checklist, worked examples, and copy/paste-ready platform-specific invocation examples.

## Process

**Do not assume you know the initial step.** Discuss with the user first.

## Quality Gates

Run after making changes. Note: some gates trigger earlier ones; caching prevents duplicate work. See @docs/engineering/build-system.md and ADR-065 for caching details.

```bash
# From repo root, one at a time
pnpm sdk-codegen        # Makes changes
pnpm build              # Makes changes
pnpm type-check
pnpm doc-gen            # Makes changes (after TSDoc/public API changes)
pnpm lint:fix           # Makes changes
pnpm format:root        # Makes changes
pnpm markdownlint:root  # Makes changes
pnpm subagents:check    # After sub-agent definition changes
pnpm portability:check  # After platform surface or hook changes
pnpm test:root-scripts  # Repo-level script tests
pnpm test
pnpm test:widget
pnpm test:e2e
pnpm test:ui
pnpm test:a11y
pnpm smoke:dev:stub

# Informational practice health
pnpm practice:fitness:informational  # Soft-ceiling report; not a blocking gate
```
