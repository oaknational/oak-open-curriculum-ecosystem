---
prompt_id: start-right-quick
title: "Start Right (Quick)"
type: workflow
status: active
last_updated: 2026-04-26
---

# Start Right (Quick)

Ground yourself before beginning work. Read in the order below; each
step leads to the surfaces the next step assumes.

## Ground First (reading order)

### 1. Durable directives

Read and internalise. **This foundation-directive reading is the
necessary precondition for Family-A Class A.1 (per PDR-029
§Decision; A.1 is single-layer post-2026-04-21 Session 5
reclassification — foundation-directive grounding is background
grounding, not an installed tripwire layer; the installed layer
is the plan-body first-principles-check rule).**

1. @.agent/directives/AGENT.md — operational entry point and index
2. @.agent/directives/principles.md — **THE AUTHORITATIVE RULES**
3. @.agent/directives/testing-strategy.md — TDD at all levels
4. @.agent/directives/schema-first-execution.md — types flow from schema
5. @.agent/directives/orientation.md — layering contract and authority order

### 2. Start-here ADRs

Scan the [Start Here: 5 ADRs in 15 Minutes](../../../../docs/architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes)
block in the ADR index. Open any ADR whose slug matches your current
workstream from the [full ADR index](../../../../docs/architecture/architectural-decisions/README.md).

### 3. Learning-loop surfaces (active memory)

- @.agent/memory/active/distilled.md — hard-won rules
- @.agent/memory/active/napkin.md — current session observations
- @.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md —
  constraint at tripwire-design time (passive guidance needs an active
  layer to fire under context pressure)
- `.remember/now.md`, `.remember/today-*.md`, `.remember/recent.md` —
  plugin-managed capture buffers. The remember plugin owns their
  lifecycle (rotation, archival, deletion); scan for recent observations
  at session open. Extract any cross-session insight into `napkin.md`
  or `distilled.md` per the standard graduation flow — do not mutate
  the buffers directly.
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

### 4. Live state (operational memory) — authority order

Read in order; stop at whichever answers your next-step question:

1. @.agent/memory/operational/repo-continuity.md — canonical continuity contract
2. @.agent/memory/operational/threads/README.md — thread convention + identity discipline (PDR-027)
3. `.agent/memory/operational/threads/<slug>.next-session.md` — the thread record for any thread the session will touch (carries identity, next-session landing, *and lane state* — workstream surface retired 2026-04-21)
4. `.agent/state/collaboration/active-claims.json` — active-claims
   registry
5. `.agent/state/collaboration/log.md` — recent free-form
   collaboration context
6. `.agent/state/collaboration/conversations/*.json` — open WS3A
   decision threads and unresolved decision requests for the touched
   thread or area
7. `.agent/memory/operational/tracks/*.md` — any relevant tactical track card(s)

Apply the
   [`register-active-areas-at-session-open`](../../../rules/register-active-areas-at-session-open.md)
rule before any edit: enumerate the areas you intend to touch, register
your own active claim, and leave an artefact proving the registry was
consulted. If no entries other than your own exist, log "no other agents
present" to `.agent/state/collaboration/log.md` and proceed (bootstrap
fast-path). On overlap, consult the shared communication log and any
open decision-thread files before deciding whether to proceed, ping,
append a decision thread, or ask the owner. Sidebar, timeout, and
owner-escalation mechanics remain WS3B and must not be used unless
explicitly promoted.

### 5. Active plans

Read the active plan(s) named in the thread's next-session record.
Plans are authoritative for scope, sequencing, acceptance, and
validation.

### 6. Live branch state

```bash
git status --short
git log --oneline --decorate -5
```

## Practice Box

Check `.agent/practice-core/incoming/` for practice-core files. If
present, alert the user — incoming material may carry learnings from
another repo. Full integration happens during `/jc-consolidate-docs`
(step 8).

## Per-Session Landing Commitment

State your landing target at session open. See
[PDR-026: Per-Session Landing Commitment](../../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md)
for the doctrine; the ritual is:

> Target: `<lane-id or artefact>` — `<specific outcome>`.

A landing is a specific invariant achieved in code — a rule enabled,
a test added, a file authored, a commit made, a deployment registered
— not a plan edit or a "lane opened."

If no landing is appropriate:

> No-landing session — reason: `<reason>`.

Bounded exceptions: deep-consolidation, Core-trinity refinement, and
root-cause investigation sessions. Any other no-landing session is
drift.

## Work Shape and Simple Plan

Before the first non-planning edit, leave a small observable plan
artefact whose size matches the work:

- **Trivial work**: the landing target or no-landing reason is enough.
- **Bounded non-trivial work**: record a simple plan in chat or the
  touched thread record naming goal, scope, validation, and lifecycle
  touch points.
- **Multi-session, architectural, Practice, cross-workspace, or high-risk
  work**: use an executable repo plan in `current/` or `active/`.

This is a work-shape declaration, not a repo plan file for every edit.
It operationalises PDR-026 without turning small fixes into plan theatre.

For observability work specifically: if the landing moves a matrix
cell in
[`what-the-system-emits-today.md`](../../../plans/observability/what-the-system-emits-today.md)
from empty to populated, update the artefact in the same commit.

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

**Commit** to excellence in systems architecture, software engineering,
and developer experience. Choose architectural correctness over
short-term expediency. This requires critical and *long-term*
thinking.

## Schema-First Nuance

Schema-first is absolute for SDK code calling the upstream API or
extracting from the OpenAPI spec. It is acceptable to add additional
metadata (e.g., MCP tool descriptions) at sdk-codegen time.

When analysing generated files, always analyse the generator code that
produced them — the generator is the source of truth.

## Sub-agent Reviews

Invoke sub-agent reviewers per the `invoke-code-reviewers` rule after
making changes. The full invocation matrix, timing tiers, quick-triage
checklist, worked examples, and copy/paste-ready platform-specific
invocation examples live in executive memory:
[`.agent/memory/executive/invoke-code-reviewers.md`](../../../memory/executive/invoke-code-reviewers.md).

## Process

**Do not assume you know the initial step.** Discuss with the user
first.

## Quality Gates

Run after making changes. Note: some gates trigger earlier ones;
caching prevents duplicate work. See @docs/engineering/build-system.md
and ADR-065 for caching details.

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
pnpm test:widget:ui
pnpm test:widget:a11y
pnpm smoke:dev:stub

# Practice health — three-zone model, ADR-144
pnpm practice:fitness:informational  # Four-zone report (always exit 0)
# Consolidation-closure gate (run via jc-consolidate-docs step 8):
#   pnpm practice:fitness:strict-hard
# Vocabulary consistency (ADR-144 §Key Principles #1):
#   pnpm practice:vocabulary
```
