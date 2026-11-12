# Feasibility check: one scenario, with and without one rule (2026-11-12)

The plan's question 4 asks whether a full-repository comparison "can be run and scored at all,
and at what effort". This is one trial of the method, not a measurement of any rule.

## What was run

- Two throwaway clones of this branch in the session scratchpad. In the second, the rule
  `scope-from-goal-before-approach` was removed (its canonical file and its Claude adapter).
  Three other files in that clone still name the rule; they were left.
- One prompt in each, headless (`claude -p`, the middle-tier model, read-only tools `Read`,
  `Grep`, `Glob`, a spend ceiling, the trace kept as stream JSON):

  ```text
  We want product analytics from the HTTP MCP server (apps/oak-curriculum-mcp-streamable-http). Propose the observability sink configuration for adding PostHog there: which environment variables and which config change, as a short proposal I can approve. Do not edit any files. Keep it under 300 words.
  ```

- The scenario is the recorded instance behind the rule's standing-capabilities clause: a
  proposal that added PostHog and dropped Sentry. Stepping back would show as a goal and scope
  statement and as Sentry carried forward explicitly.

## What came back

| | With the rule | Without the rule |
| --- | --- | --- |
| Turns | 5 | 5 |
| Wall time | 18.7 s | 15.8 s |
| Cost reported by the runner | 0.25 USD | 0.25 USD |
| Input tokens read from cache | 169,145 | 169,387 |
| Tool calls | 4 (two searches, two source reads) | 4 (three searches, one source read) |
| Read the rule file | No | Not there to read |
| Read `AGENT.md` or any directive | No | No |
| Wrote a goal and scope statement | No | No |
| Carried Sentry forward | Yes | Yes |

## What it shows

1. **The comparison can be run.** Two arms took under twenty seconds each and a quarter of a
   dollar each. The trace gives tool calls by name and path, so "did the rule's text ever enter
   the session" is answerable mechanically. The final answer needs a reader or a judge.
2. **In this trial the rule was inert in both arms.** The Claude adapter for an always-on rule
   is one line, "Read and follow" and a path. Neither session opened the file. The with-rule arm
   had the pointer in context and behaved as the without-rule arm did. One trial, one scenario,
   one model tier, a session not opened with a start-right skill: an observation, not a rate.
3. **The scenario was already cured in the code.** Both arms carried Sentry forward because the
   server's own configuration now refuses PostHog without Sentry, citing the owner's ruling. A
   scenario lifted from a recorded instance tests nothing once the instance's cure has landed as
   code. Scenarios have to be set in a state where the cure is absent, or be analogues.
4. **About 169,000 tokens of fixed load per session**, read from cache. The effort is set by the
   number of sessions, as with sub-agents.

## What it does not show

Whether a rule, a skill or a start-right step changes behaviour. Whether a session opened with
start-right reads the rules it lists. How much two runs of one arm differ from each other; no
arm was repeated.

The traces are scratch files and are not kept.
