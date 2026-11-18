# Doing and Dreaming: Periodic Learning for Agents in a Repo

Nov 12, 2026 · @Jim

Agents act when something prompts them, so learning from accumulated experience happens only when a person remembers to start it. This report proposes a second mode of agent activity, dreaming, that runs on a clock beside ordinary work and turns raw experience into better guidance.

The entity that learns is a repo joined with the agents that act in it. The repo is the body and the memory, and the agents are the animus. Work and learning can run in parallel as separate sessions, and what makes them one entity is the repo they share.

## The problem: kairos without chronos

An agent today lives entirely in kairos, the opportune moment. It acts when a user writes, a tool returns or an event is pushed to it, and at no other time.

It has no chronos, no regular time that passes whether or not anyone prompts it. Reviewing accumulated notes, refining them and learning from them all depend on a person remembering to start the process.

Push messages and loops are means to an end here. The need is periodic action inside the agent's flow.

Periodicity is still only the trigger. What the agent needs underneath is a standing intention that outlives any one conversation: what to review, by what standard, and where the results go. A clock is the simplest way to act on that intention.

## What exists today

Current tools supply triggers, both event-driven and timed. None of them supplies the standing intention or the practice of learning.

| Mechanism | What it gives | What it lacks |
| --- | --- | --- |
| MCP notifications | A server can send unsolicited protocol messages to a client | No standard way to place a message in the agent's context; each client decides |
| [Claude Code channels](https://code.claude.com/docs/en/channels) | An MCP server pushes events into a running session, and the agent can reply through the same channel | Events arrive only while a session is open; research preview; needs Anthropic authentication and a per-session opt-in |
| Session-scoped scheduled tasks | A timer inside a session, for polling on a schedule | Lives and dies with the session |
| Cloud sessions | A task run in a fresh cloud sandbox cloned from GitHub | Starts with no memory beyond what the repo holds |
| Cron launching a headless session | A clock that is independent of any session | Supplies only the tick; the brief and the state must come from elsewhere |

Channels improve kairos: they widen the set of events an agent can react to. Timers supply chronos. The rest of this report is about what a timer should wake the agent to do.

The Claude Code rows follow Anthropic's [channels documentation](https://code.claude.com/docs/en/channels), read on 12 November 2026. Channels are a research preview and their contract may change. The MCP and cron rows are from general knowledge and were not checked against a source.

## The model: body, memory and animus

The entity is a repo joined with the agents that act in it. Neither half is the entity alone.

- **The repo is the body.** Its code structure, tests and conventions hold knowledge that no note states. Some of what the entity knows is in its shape.
- **The repo is also the memory.** Notes, guidance and records are what the entity has written about itself.
- **The agents are the animus.** They animate the body. A repo with no agents is inert, and an agent with no repo has no particular history.

The same animus can animate many repos. What makes one entity itself is the body it animates.

The entity is also not a single unit. It is a series of related and connected expressions. One agent can be working while another is learning, in the same checkout, in a worktree or in a cloud session.

## Doing and dreaming

Doing and dreaming are two modes of being for the same entity. Doing is experiencing, and dreaming is learning.

|  | Doing | Dreaming |
| --- | --- | --- |
| Faces | The task in hand | Accumulated experience |
| Produces | Work, and a record of how it went | Changes to guidance and memory |
| Prompted by | An occasion: a request or an event | A clock, then a judgement that there is enough to review |
| Effect on the entity | It acts | It becomes something different for the next task |

An entity that only did would have a history but no development.

The analogy with sleep suggests four properties a learning pass should have, beyond summarising notes:

- **Separate from the stream it reviews.** The pass works on a fixed view of past experience. The entity as a whole can stay awake, because another agent can keep working.
- **Selective.** It revisits what was surprising or mattered: corrections, failures and repeated friction.
- **Forgetful.** Pruning is half the work. A system that only accumulates has a bigger pile and has learned nothing.
- **Recombining.** It connects experiences that never occurred together. That is how single notes become general lessons.

Doing owes dreaming one thing. Experience has to be captured cheaply and rawly in the moment, or there is nothing honest to dream about later.

## How such a system might work

The system is a loop through the repo. Working sessions lay down raw experience, and a clocked session turns it into guidance that the next working session reads.

&#91;embedded content: learning loop · doing and dreaming, joined through the repo\]

Read it clockwise from the top left. Everything passes through the repo, and the two lanes never exchange anything directly.

The parts, in the order a lesson travels:

1. **A standing brief.** The repo holds a durable description of the dreaming pass: what to review, by what standard and where results go. A tick with no brief has nothing to act on.
2. **Capture during work.** Working agents append raw experience to a log as they go: corrections received, failures, dead ends and friction. Capture is cheap and unedited.
3. **A clock.** A scheduler starts a dreaming session at intervals. Any timer serves, such as a scheduled task or cron launching a headless session.
4. **A threshold check.** The dreaming agent first judges whether enough has accumulated since the last pass, and stops if not. The clock grants the opportunity and the agent decides whether to take it.
5. **Consolidation in isolation.** In a worktree or cloud session, on a fixed view of the log, the agent selects what mattered, prunes what did not and recombines related experiences into general lessons. It then rewrites the distilled memory and guidance.
6. **Review and integration.** The result arrives as one reviewable, reversible change. A person or a reviewing agent accepts or rejects it.
7. **Waking.** Working sessions read the guidance when they start, so the next session begins with the new lessons. A session already under way keeps a stable view until it ends.
8. **Checking that it took.** A later dreaming pass looks for whether the friction behind a lesson has recurred. A lesson that changed nothing is revised or dropped.

## Where git helps and where it misleads

Git supplies useful machinery for this system, but its vocabulary only approximates the ideas and should not define them.

Where it helps:

- **Isolation.** A branch or worktree lets the dreaming agent rewrite notes without changing files under an agent that is mid-task.
- **A fixed point.** A commit gives the dreamer a stable "everything up to here" to review while work carries on.
- **Review and reversal.** A pull request is a natural place to inspect what dreaming proposes, and a merged change can be reverted.

Where it misleads:

- **Commits are not the experience.** They record outcomes. Dead ends, corrections and friction rarely show in a diff, so experience needs its own capture.
- **A merge is not learning.** It marks when a change was accepted. A lesson is learned when it changes how work is done, which may be later or never.
- **Files are not the whole memory.** Much of what the entity knows is held in the body's shape and appears in no note.

Sharing one checkout needs care. A working agent holds what the guidance said when its session started. A dreamer editing those files in place leaves it on a stale copy, and the two can collide on writes.

One rule keeps parallel work clean: any agent may append raw experience, but only the dreaming agent rewrites distilled memory.

## Risks and open questions

The main risks come from learning that nobody watches.

- **Churn.** Consolidating on every tick, whether or not anything new has happened, wears good notes into worse ones.
- **Compounding error.** A wrong lesson that merges unreviewed shapes later work, and later dreaming then builds on it.
- **Unattended authority.** A scheduled session either stalls at a permission prompt or runs with broad permissions. What dreaming may touch needs a deliberate limit.
- **Drift.** Memory can come to describe a body that has since changed, so guidance and code disagree.

Open questions:

- Where does raw experience live: in the repo, or beside it?
- What marks an experience as worth revisiting, and who marks it?
- Who reviews what dreaming proposes: a person, another agent, or both? What, if anything, may merge unreviewed?
- What evidence shows that a lesson has changed how work is done?
- May dreaming change the body, such as tests and conventions, or only the memory?
- What cadence suits the pass, and should it follow the amount of activity?
- When one animus animates several repos, should lessons pass between them?
