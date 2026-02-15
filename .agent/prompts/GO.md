# GO GO GO

A complementary grounding prompt for AI agents working in the Oak MCP
Ecosystem. This prompt structures task execution and periodic
self-assessment. It complements [AGENT.md](../directives/AGENT.md),
which provides the canonical directives, rules, and architectural
context.

Read ALL of this document, then carry out the [Action](#action).

## Ground Yourself

Read [start-right.prompt.md](./start-right.prompt.md) and follow all
instructions in that file and in the files it leads to (rules, testing
strategy, schema-first execution).

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
  3. **Invoking the appropriate sub-agent(s)** for targeted review:
     - Code changes -> `code-reviewer`
     - Structural changes -> `architecture-reviewer`
     - Test changes -> `test-reviewer`
     - Type complexity -> `type-reviewer`
     - Config changes -> `config-reviewer`
     - **Cursor-specific**: Use Task tool with `readonly: true`,
       `subagent_type: "[agent-name]"`
- Make sure your todo list includes running the quality gates. These
  items should be prefixed with `QUALITY-GATE:` and happen reasonably
  often.
- Periodically include a `GROUNDING:` task to re-read this document
  and the [start-right prompt](./start-right.prompt.md), ensuring your
  todo list stays relevant and aligned with the plan.
- Every fourth `REVIEW:` should be a **holistic review** invoking
  multiple sub-agents to assess overall coherence.
- Remove any items from your todo list that don't make sense, or are
  no longer relevant.

## Action

Please start the next task in the todo list, and carry on.
