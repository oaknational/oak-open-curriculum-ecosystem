# Workflow tool — operating notes

Operating knowledge for Claude Code's `Workflow` tool (the scripted
`agent()` / `parallel()` / `pipeline()` orchestrator) that the platform's own
authoring reference does not carry and that seats on this estate have paid
for. Doctrine on when a fan-out is warranted lives in
[PDR-122](../practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md);
this page is the Claude-harness phenotype: what the tool does at the edges.

## A died agent is silent unless you check

`parallel()` and `pipeline()` tolerate agent death by design: a died agent
becomes `null` in the results array and the workflow completes
"successfully". Nothing in the completion reads as a failure unless the
`failures` field or the `agents_error` count is inspected. On every Workflow
completion, before synthesising or reporting, check `agents_error` /
`failures`; when non-zero, read `<transcriptDir>/journal.jsonl` to see which
agent died and why, and surface the died agent and its cause proactively.
Worked instance (2026-07-20): one of three parallel mappers died at launch on
a schema typo (`addit_properties` for `additionalProperties`, rejected by
strict-mode validation); the surviving results were read and reported, and
the owner found the gap first. Validate schema keys by re-reading them before
launch — the typo was catchable at author time.

## A held command stalls the run silently

A background workflow agent has nobody to answer a hook's approval prompt.
When one of its shell commands is held by the repo's PreToolUse policy (a
recursive delete, state-changing git, a generator run), the agent sits with
a `tool_use` and no `tool_result`, no process running, and the run stalls
short of completion (14 of 15 agents, fifteen minutes, 2026-09-03). The
diagnosis path: compare `started` against `result` counts in the run's
`journal.jsonl`; open the newest agent transcript and read its last event
(a Bash `tool_use` with no result); confirm with `ps` that nothing is
running. The cure: `TaskStop` the run, edit the prompt to name the held
command classes as forbidden (say what the trial would be and mark the
claim unverified instead), and resume with `resumeFromRunId`, which returns
every cached agent instantly. The doctrine side, that research prompts name
the held classes, lives in the
[fleet-design-review rule](../rules/fleet-design-review-before-expensive-fleets.md);
expensive trials belong to the main seat or an explicitly isolated worktree
agent, never to a verifier.

## Sub-agents, panes and monitors outside a Workflow run

Facts about the harness's other agent surfaces, each paid for once (2026-10-02
to 2026-10-08):

- After a pane-teammate wave, stop the finished panes before the next wave
  spawns, and read each judge's final text from its session transcript rather
  than waiting on the return notification.
- A sub-agent's report arrives as an agent message and nowhere else, so a
  report needed past a compaction is written to a file before the boundary.
- A Monitor's output file after its expiry is stale: read the stream fresh
  before any hold line.
- A worker's Write that the repository's write hook refuses arrives at the
  dispatching seat as the hand-back message, not as a tool error in the
  worker's own transcript.
