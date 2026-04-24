---
prompt_id: start-right-thorough
title: "Start Right (Thorough)"
type: workflow
status: active
last_updated: 2026-02-27
---

# Start Right (Thorough)

Ground yourself rigorously before beginning significant work.

## Foundation Documents

Read and internalise these documents:

1. @.agent/directives/AGENT.md — Entry point and documentation index
2. @.agent/directives/principles.md — **THE AUTHORITATIVE RULES**
3. @.agent/directives/testing-strategy.md — TDD at all levels
4. @.agent/directives/schema-first-execution.md — Types flow from schema
5. @.agent/memory/operational/threads/README.md — thread convention + identity discipline (PDR-027)
6. Scan the [Start Here: 5 ADRs in 15 Minutes](../../../../docs/architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes)
   block in the ADR index. Open any ADR whose slug matches your current
   work area from the [full ADR index](../../../../docs/architecture/architectural-decisions/README.md).

**Plans must include regularly re-reading and re-committing to these foundation documents.**

## Learning-Loop Surfaces

Before engaging with the work, scan the active-memory capture surfaces:

- `.agent/memory/active/distilled.md` — hard-won rules across sessions
- `.agent/memory/active/napkin.md` — current session observations
- `.agent/memory/active/patterns/` — reusable patterns (ADR-150 §Interaction Points)
- `.remember/now.md`, `.remember/today-*.md`, `.remember/recent.md` —
  plugin-managed capture buffers. The remember plugin owns their
  lifecycle (rotation, archival, deletion); scan for recent observations
  at session open. Extract any cross-session insight into `napkin.md` or
  `distilled.md` per the standard graduation flow — do not mutate the
  buffers directly.
- Your own platform's per-user memory and session logs. Scan the
  surface for the platform you are running on:
  - Claude Code: `~/.claude/projects/<project>/memory/`
  - Cursor: `~/.cursor/chats/`, `~/.cursor/prompt_history.json`
  - Codex: `~/.codex/memories/`, `~/.codex/history.jsonl`

  Read only the surface that matches your current platform at
  session open. Cross-platform ingestion (reading another
  platform's surface for insight) is a consolidation-time
  activity, not a session-open one — see `consolidate-docs`
  step 3.

## Guiding Questions

Before diving in, pause and ask:

1. **Are we solving the right problem, at the right layer?**
2. **What value are we delivering, through what impact, for which users?**
3. **Could it be simpler without compromising quality?**
4. **What assumptions am I making? Are they valid?**

Step back and consider if work is delivering value through impact at the system level, not just fixing the problem right in front of you.

## Practice Box

Check `.agent/practice-core/incoming/` for practice-core files. If present, alert the user — incoming material may carry learnings from another repo. Full integration happens during `/jc-consolidate-docs` (step 8).

## Commit

**Commit** to excellence in systems architecture, software engineering, and developer experience. Choose architectural correctness over short-term expediency. This requires critical and _long-term_ thinking.

## Schema-First Nuance

Schema-first is absolute for SDK code calling the upstream API or extracting from the OpenAPI spec. It is acceptable to add additional metadata (e.g., MCP tool descriptions) at sdk-codegen time.

When analysing generated files, always analyse the generator code that produced them — the generator is the source of truth.

## After Each Piece of Work

1. **Run the full quality gate suite** one gate at a time
2. **Wait for all gates to complete** before analysing issues
3. **Analysis must include**: Are there fundamental architectural issues or opportunities for improvement?

## Documentation Requirements

All plans must include instructions to create:

- **TSDoc**: General on all logic and state, extensive examples on public interfaces
- **Markdown**: READMEs for each workspace
- **ADRs**: For significant architectural decisions

## Sub-agent Reviews

Invoke sub-agent reviewers per the `invoke-code-reviewers` rule after making changes. The rule contains the full invocation matrix, timing tiers, quick-triage checklist, worked examples, and copy/paste-ready platform-specific invocation examples.

## Process

**Do not assume you know the initial step.** Discuss with the user first.

## Quality Gates

Run after making changes. Note: some gates trigger earlier ones; caching prevents duplicate work. See @docs/engineering/build-system.md and ADR-065 for caching details.

```bash
# From repo root, one at a time, with no filters
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
pnpm test:widget:ui
pnpm test:widget:a11y
pnpm smoke:dev:stub

# Practice health — three-zone model, ADR-144
pnpm practice:fitness:informational  # Four-zone report (always exit 0)
# Consolidation-closure gate (used by jc-consolidate-docs step 8):
#   pnpm practice:fitness:strict-hard
# Vocabulary consistency (ADR-144 §Key Principles #1):
#   pnpm practice:vocabulary
```
