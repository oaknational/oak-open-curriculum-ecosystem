---
skill_id: go
title: "GO"
type: workflow
status: active
last_updated: 2026-04-02
---

# GO GO GO

A complementary grounding prompt for AI agents working in the Oak Open Curriculum
Ecosystem. This skill structures task execution and periodic
self-assessment. It complements [AGENT.md](../../../directives/AGENT.md),
which provides the canonical directives, rules, and architectural
context.

Read ALL of this document, then carry out the [Action](#action).

## Ground Yourself

Read
[start-right-quick shared workflow](../../start-right-quick/shared/start-right.md)
and follow all instructions in that file and in the files it leads to (rules,
testing strategy, schema-first execution).

Then read the live state surfaces in authority order:

1. `.agent/state/repo-continuity.md` — canonical continuity contract
   (current objective, repo-wide invariants, next safe step, deep-consolidation
   status).
2. `.agent/state/workstreams/<slug>.md` — the relevant workstream brief
   (lane-level current state, blockers, promotion watchlist).
3. `.agent/runtime/tracks/<workstream>--<agent>--<branch>.md` — the current
   tactical track card, if one exists.

See [`.agent/state/README.md`](../../../state/README.md) and
[`.agent/runtime/README.md`](../../../runtime/README.md) for the authority
order and contracts. The continuation prompt is a behavioural entry surface;
it does not host continuity state.

If your current task is driven by a plan collection, also read the relevant
collection `README.md` and `roadmap.md`, then:

- read `current/README.md` when selecting queued work
- read `active/README.md` when executing in-progress work

before executing the next step so both queued and in-progress work stay
discoverable.

For MCP App work, start from these three surfaces in order:

1. `start-right-quick`
2. `.agent/state/repo-continuity.md`
3. the active MCP App plan set

## When to Use GO

Use `GO` as a mid-session execution cadence, especially when:

- multiple active sub-plans are in play
- the session is likely to span more than one focused execution block
- the todo list needs re-grounding before the work drifts

Use `GO` when the todo list needs re-grounding before the work drifts.

Use `GO` when the plan is likely to be long running or complex.

Do not use `GO` as the ordinary end-of-session handoff. Close ordinary sessions
with `session-handoff`. Use `consolidate-docs` only when its trigger checklist
says deep convergence is due.

## Intent

- Identify and state the current plan you are working to. What impact
  does the plan seek to bring about?
- What are you trying to achieve? Take a step back and consider the big
  picture, think hard about it, and then reflect on your thoughts. Has
  anything changed? Why?

## Structure the Todo List

- Your todo list must achieve the intent of the plan. Populate it with
  tasks that are atomic, specific, measurable, provable, and
  ACTIONABLE. Make each task small enough for the result to be easily
  and comprehensively reviewed. All actions must be prefixed with
  `ACTION:`.
- If you have tasks that are large or complex, break them down into
  smaller, more manageable tasks.
- Immediately after each `ACTION:` there MUST be a `REVIEW:` item.
  This consists of:
  1. Stepping back and reflecting on the action
  2. Checking alignment with the plan and rules
  3. **Invoking the appropriate sub-agent(s)** per the
     `invoke-code-reviewers` rule (full matrix, timing, triage, and examples)
- Make sure your todo list includes running the quality gates. These
  items should be prefixed with `QUALITY-GATE:` and happen reasonably
  often.
- Periodically include a `GROUNDING:` task to re-read this document
  and the [start-right-quick shared workflow](../../start-right-quick/shared/start-right.md), ensuring your
  todo list stays relevant and aligned with the plan.
- Every fourth `REVIEW:` should be a **holistic review** invoking
  multiple sub-agents to assess overall coherence.
- Remove any items from your todo list that don't make sense, or are
  no longer relevant.
- Every third item must be `GROUNDING: read the GO workflow and re-apply it. This must include re-adding this instruction to read the GO workflow. The recursion is the point.`.

## Action

Please start the next task in the todo list, and carry on.
