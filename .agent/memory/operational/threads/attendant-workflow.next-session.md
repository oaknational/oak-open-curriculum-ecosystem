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

- Branch: `ccr-ddb70dc4-jltz47`, restarted at `engraph` `SHA:54fb0b8c5` (pull request 394's
  merge) for the research step; the same branch name carried the creation plan before that merge.
- Invocation pointer: the brief above.
- Controlling plans: the strategic node [`attendant-workflow`](../../../plans/strategic/attendant-workflow.plan.md)
  and, for the next session, the delivery node
  [`attendant-research`](../../../plans/delivery/attendant-research.plan.md). Both ratified by the owner on 2026-11-10.
- Working notes: [`attendant-creation-plan-working-notes.md`](../../../research/agentic-engineering/attendant-creation-plan-working-notes.md)
  (the evidence; §7 holds proposals for the lane's later steps).
- Next safe step: the research step as its node sets it out (the owner, 2026-11-10: "Let's get
  the plan written and ready, and the next session will carry out the research"; both nodes
  ratified the same day): `start-right-thorough`, the brief's quotations, the two nodes,
  registration here, the five questions in the node's order. The seat that does the research
  does not later design the mechanism.
- Research progress, 2026-11-12 (pull request 398): question 3 answered; question 1 has a first
  classification of ten classes from about seventy instances and owes the remaining rule files,
  the other retrospectives and the scenarios; questions 2, 4 and 5 not started. Sources read are
  in the reading ledger under `attendant-research-working/`. A reader fan-out was designed,
  reviewed (three verdicts of "revise") and not launched. Two matters are with the owner: the
  price of a smaller staged fan-out over the rule files, and a departure from the plan's
  stopping rule. PDR-098 was found and bears on the mechanism step.
- The owner's answer to both, 2026-11-12, in session: "Agreed on both, no fan-out; carry on with
  questions 4 and 5". Since then questions 4 and 5 are answered and a feasibility check has run.
  By the session's close all five questions are answered, both scenario files are written and
  reviewed by a fresh reader, and the strategic node's research summary is revised. The step's
  acceptance is the owner's reading of the report (the plan's three criteria, each
  `owner-held`); it is not yet recorded here. Not read, by the seat's choice: the Cricket
  tallies, the rulings ledger, the further retrospectives and reports, the archives.
- Next safe step after the owner accepts the research: the mechanism step, by a different seat,
  which writes its own delivery node at pickup and does not open the held-back scenarios.
- Team expectation: solo cloud seat, the owner as design partner.
- Acceptance bar: for the next session, phase 1's outputs as the plan names them (the findings
  file, the scenarios file, the plan's summary section, a report to the owner).

## Participating Agent Identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude-code | claude-fable-5-1 | 01Duoc | Juniper seeks Pollen | brief author (row reconstructed at thread open from pull request 390's commits and records) | 2026-11-07 | 2026-11-08 |
| claude-code | claude-opus-5-5, then claude-fable-5-2 from 2026-11-10 | 01Duoc | Limpet lifts Spray | designer of the creation plan; research seat from 2026-11-10 (the owner's opener, given in the same session) | 2026-11-08 | 2026-11-10 |

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
