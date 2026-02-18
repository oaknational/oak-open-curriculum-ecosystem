# Orchestrator Subagent: Coordinated Parallel Work

## Status

Icebox — idea stage. Not yet scheduled.

## Core Idea

A high-power coordinating orchestrator subagent that decomposes a plan into
discrete work items and dispatches a swarm of low-power worker subagents in
parallel. The orchestrator defines the work, verifies completion against
acceptance criteria, and aggregates results into a coherent summary for the
invoking agent.

Cursor 2.5 (17 Feb 2026) introduced async subagents that can spawn their own
subagents, forming a tree of coordinated work. This makes the orchestrator
pattern directly implementable without workarounds.

## Prior Art in This Repo

The review ensemble (`jc-review-ensemble`) already implements a simpler version
of this pattern: it dispatches four model-specific code reviewers and then
synthesises their findings. The orchestrator generalises that pattern beyond
reviews to arbitrary parallelisable work.

## Agent Roles

### Planner (the orchestrator itself)

Runs on the default (expensive, thinking) model. Responsibilities:

1. **Read the plan** — accepts a reference to a plan file and/or context files
   from the invoking agent.
2. **Decompose into work items** — breaks the plan into discrete, independent
   tasks with clear boundaries. Each work item has a defined scope (files,
   modules, or responsibilities) and acceptance criteria.
3. **Dispatch workers** — spawns `fast`-model worker subagents, one per work
   item. Assigns each worker its scoped task, the files it may touch, and the
   acceptance criteria it must satisfy.
4. **Monitor and adapt** — as workers complete or report blockers, the
   orchestrator can spawn additional workers, reassign work, or escalate
   issues to the invoking agent.
5. **Aggregate results** — collects worker outputs and synthesises them into a
   single coherent report for the invoking agent.

### Worker

Runs on the `fast` (cheap, focused) model. Responsibilities:

1. **Execute a single scoped task** — reads the assigned files, performs the
   work, and produces output in the format specified by the orchestrator.
2. **Report completion or blockers** — returns a structured result indicating
   success (with output) or failure (with a description of what blocked
   progress).
3. **Stay within scope** — a worker must not modify files outside its assigned
   partition. If it discovers work outside its scope, it reports this to the
   orchestrator rather than acting on it.

### Judge (verification pass)

Runs on the default model, either as a final orchestrator phase or as a
separate subagent. Responsibilities:

1. **Verify each work item** — checks that the worker's output satisfies the
   acceptance criteria defined by the planner.
2. **Identify gaps** — finds work items that were missed, partially completed,
   or completed incorrectly.
3. **Decide: done or iterate** — either confirms the aggregate result is
   complete, or feeds gaps back to the orchestrator for another dispatch cycle.

## Work Item Contract

Each work item dispatched to a worker has a defined shape:

| Field | Description |
|-------|-------------|
| **id** | Unique identifier for the work item |
| **description** | What the worker should do, in plain language |
| **scope** | Files and/or modules the worker may read and (if write-enabled) modify |
| **acceptance criteria** | How to determine if the work is done correctly |
| **context files** | Additional files the worker should read for background |
| **output format** | What the worker should return (e.g., analysis report, code diff summary, list of findings) |
| **mode** | `readonly` (analysis) or `readwrite` (implementation) |

## Conflict Avoidance

When workers perform write operations, file conflicts are avoided by design:

- **Partition by file or module** — no two workers are assigned overlapping
  file scopes. The orchestrator is responsible for partitioning cleanly.
- **Partition by responsibility** — if a single file must be touched by
  multiple concerns, the orchestrator sequences those work items rather than
  parallelising them.
- **Read-only by default** — analysis tasks (the first use cases) have no
  conflict risk. Write operations are an extension, not the starting point.

## Model Allocation

| Role | Model | Rationale |
|------|-------|-----------|
| Orchestrator (planner) | Default (thinking) | Decomposition, synthesis, and judgement require high intelligence |
| Workers | `fast` | Scoped, well-defined tasks; cost-effective at scale |
| Judge | Default (thinking) | Verification requires understanding intent, not just execution |

This means a swarm of 4 workers costs roughly the same as a single default
model invocation, while covering 4x the ground.

## Phased Rollout

### Phase 1: Read-Only Analysis Swarm

The first orchestrator coordinates read-only analysis tasks. No file conflicts,
no write coordination needed. Example use cases:

- Audit N files for compliance with a specific rule (one worker per file or
  file group)
- Investigate a bug from multiple angles in parallel (one worker per
  hypothesis)
- Analyse test coverage across multiple workspaces simultaneously
- Review a large refactoring plan for risks (one worker per workspace)

This phase proves the orchestration pattern, the work item contract, and the
aggregation process.

### Phase 2: Write Operations with Partitioned Ownership

Extend workers to perform scoped write operations (code changes, test
creation, documentation). Each worker owns a non-overlapping set of files. The
orchestrator verifies no scope overlaps exist before dispatching.

Example use cases:

- Implement a plan with steps that touch different workspaces (one worker per
  workspace)
- Write tests for N modules in parallel (one worker per module)
- Apply a mechanical refactoring across multiple files (one worker per file)

### Phase 3: Multi-Cycle Orchestration

The judge feeds gaps back to the orchestrator, which dispatches additional
workers. This enables iterative convergence: plan → execute → verify → fix →
verify. The orchestrator decides when to stop iterating (all acceptance
criteria met, or maximum cycles reached).

## Implementation Path

The orchestrator would be implemented as a Cursor subagent definition in
`.cursor/agents/orchestrator.md`. It would:

- Accept a prompt referencing a plan file and/or context
- Use the Task tool to spawn `fast`-model worker subagents
- Collect and synthesise worker results
- Optionally run a judge pass before returning the final summary

A companion slash command (e.g., `/jc-swarm`) could provide a standard
invocation pattern, similar to how `/jc-review-ensemble` standardises the
review process.

## Open Questions

1. **Maximum useful parallelism** — at what point do more workers add overhead
   without proportional benefit? The review ensemble uses 4; is that the right
   number for general work, or does it depend on the task?
2. **Worker context budget** — `fast` model has lower context capacity. How
   much context can each worker receive while remaining effective? Should the
   orchestrator summarise context rather than forwarding full files?
3. **Error handling** — if a worker fails or hangs, how does the orchestrator
   detect this and recover? Timeout-based? Output-format validation?
4. **State sharing between cycles** — in Phase 3, how does the orchestrator
   pass state from one cycle to the next without context blowup?
5. **Interaction with quality gates** — should the orchestrator run
   `pnpm type-check` or `pnpm lint:fix` between cycles, or leave that to the
   invoking agent?
