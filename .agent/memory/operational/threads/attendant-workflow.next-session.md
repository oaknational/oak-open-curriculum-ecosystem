---
fitness_line_target: 200
fitness_line_limit: 400
fitness_char_limit: 24000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---

# attendant-workflow Next Session

## Thread Identity

Thread: `attendant-workflow`
Goal: the Attendant Workflow, a reusable idea-to-merge process in which the owner's judgement
comes at the points only the owner can supply (what is wanted and whether the criteria capture
it, in one conversation from initiation through approval; then the sense check before merge),
with a middle run on Practice norms and a mechanism for automatically stepping back. The owner's words are quoted and dated in the brief
[`idea-to-merge-process-design.prompt.md`](../../../prompts/agentic-engineering/idea-to-merge-process-design.prompt.md);
the design notes beside it are input to assess critically. Opened 2026-11-08 by Limpet lifts
Spray at the design session's open; the brief and notes landed in pull request 390 before any
thread record existed.

## Current Continuation

- State: step 1 of the lane, the research, is done and accepted. The owner, 2026-11-12, in
  session: "I ratify the research." That is the recorded proof of the research node's three
  acceptance criteria, each `owner-held`; the fresh reviewer's read that criterion 2 names
  returned "sound-with-corrections" on the twenty-three open and nine held-back scenarios, all
  corrections applied. The research landed by pull request 398.
- Next safe step: step 2, the stepping-back mechanism, designed and tested by a seat other than
  Limpet lifts Spray. That seat writes the step's delivery node at pickup; the strategic node
  delegates it, so it needs no stamp of its own.
- Invocation pointer: the opener
  [`attendant-mechanism-step.prompt.md`](../../../prompts/agentic-engineering/attendant-mechanism-step.prompt.md).
  The brief above holds the owner's words.
- Controlling plan: the strategic node
  [`attendant-workflow`](../../../plans/strategic/attendant-workflow.plan.md), ratified on
  2026-11-10, its research summary revised on 2026-11-12. The delivery node
  [`attendant-research`](../../../plans/delivery/attendant-research.plan.md) is complete and
  controls nothing further.
- What step 2 reads: the findings,
  [`attendant-research-findings.md`](../../../research/agentic-engineering/attendant-research-findings.md);
  the open scenarios, `attendant-step-back-scenarios.md` beside it; PDR-098. The working notes
  ([`attendant-creation-plan-working-notes.md`](../../../research/agentic-engineering/attendant-creation-plan-working-notes.md),
  §7) are an earlier seat's proposals, as input.
- What step 2 does not open: `attendant-step-back-held-back.md` and
  `attendant-research-working/scenario-review.md`. They are for a fresh scorer after the design
  is frozen, and the mechanism step records whether this was kept.
- Limits the research states about itself: the classification covers catches that were written
  down; the retrospectives beyond nine, most of the twelve reports the brief lists, the
  archives and the run-by-run rows of the Cricket tallies were not read; a reader fan-out was
  designed, reviewed and not launched (the owner, 2026-11-12: "Agreed on both, no fan-out;
  carry on with questions 4 and 5"); the feasibility check is one trial.
- Branch: none held. A new session works on its own designated branch from `engraph`.
- Team expectation: solo cloud seat, the owner as design partner.
- Acceptance bar for the next session: the step's delivery node, brought to the owner, saying
  what the mechanism has to do, how it will be tested against the scenarios before anything is
  relied on, and what would show it does not work.

## Participating Agent Identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude-code | claude-fable-5-1 | 01Duoc | Juniper seeks Pollen | brief author (row reconstructed at thread open from pull request 390's commits and records) | 2026-11-07 | 2026-11-08 |
| claude-code | claude-opus-5-5, then claude-fable-5-2 from 2026-11-10 | 01Duoc | Limpet lifts Spray | designer of the creation plan; research seat on 2026-11-12 (the owner's opener, given in the same session) | 2026-11-08 | 2026-11-12 |

The two rows share a prefix and are two seats. Juniper seeks Pollen is cloud session
`01DuocjTp8TB8373EtwFwkoA` (pull request 390's `Claude-Session` trailers); Limpet lifts Spray is
cloud session `01DuocjT6NUndtf6abNSv8Tp`, created 2026-11-08T20:22Z. Each name derives from its
own session id with the identity tool. The six-character prefix collides across these cloud
sessions; the name tells them apart.

The research step was written to be picked up cold by a new seat. The owner gave its opener to
the session that wrote the plans, so the research seat is Limpet lifts Spray, continuing after a
context compaction. Two consequences: the seat that writes the scenarios also wrote the
proposals for the mechanism's design (working notes §7); and this seat does not design the
mechanism and does not open the held-back file after the research step ends.
