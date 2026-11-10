---
id: attendant-workflow-creation
node_type: delivery
name: Create the Attendant Workflow
overview: Build the Attendant Workflow, an idea-to-merge process run by agents between the owner's touches, with an automatic stepping-back mechanism, and take the owner's first idea through it.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: outcome-informed-practice-learning
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-11-10
---

# Create the Attendant Workflow

**State of this sketch, 2026-11-10**: in design. The research is part-done and the decisions
below are those made so far; the sections marked open are the design session's remaining work.
The plan is complete when every decision the build needs is made here, each with its reasoning,
and the owner stamps it. The owner's words are quoted and dated in the
[brief](../../prompts/agentic-engineering/idea-to-merge-process-design.prompt.md); the evidence
behind each finding is in the
[working notes](../../research/agentic-engineering/attendant-creation-plan-working-notes.md).
The parent node is this seat's placement, for the owner to confirm or move at the stamp.

## Goal

The Attendant Workflow exists as the `attendant` skill and its `attendant-*` sub-skills, and the
owner's first idea has gone through it to a merge. The Attendant is a new approach and an
exploration on the journey towards unsupervised working; it replaces nothing (the owner,
2026-11-10). One of its main goals is a reliable, effective mechanism for automatically stepping
back and questioning the bigger picture frame, motivation and nature of the work.

## User groups and value

- **The owner**: an idea becomes merged, value-bearing work with the owner's judgement at the
  few points only the owner can supply (what is wanted, whether the criteria capture it, whether
  the result is sensible to merge), those touches kept few because the agent steps back, analyses
  and doubts before each one. Offered value; the first runs test it.
- **Agents running or resuming a run**: a process whose state and decisions are readable from
  records, and a stepping-back mechanism that does not depend on their own judgement that it is
  needed.
- **The people the estate serves**: more of the owner's ideas delivered. Hypothesised, and
  claimed only as far as merged work; release and use are outside a run's claim.

## Research

Five questions (the brief, "Research the plan must complete"). Status and findings:

1. **What the owner has caught that agents missed** — open. Corpus and order are set (the
   graduated record first: rules carrying the owner's words, `owner-signal-interpretation.md`,
   the retrospectives, the Cricket tallies).
2. **What the owner must see at approval and at the sense check** — open.
3. **Why the step-back instruments only partly succeed** — first pass done (working notes §6).
   Five causes: the working agent decides when to step back ("Sixteen of nineteen prior-kept
   mechanisms recurred within four weeks of the run that kept them"); the one being checked
   writes the frame; the question asked cannot return "stop" or "delete it"; the evidence handed
   over is the working agent's own record; the return is advice to the agent it doubts. What has
   worked: anchor-free reviewers commissioned against the question; a frame built from the
   owner's verbatim words; instruments where doctrine had not changed the rate; a sentence that
   must be written; a declared deadline with a default.
4. **What each native lever can do in a cloud session** — largely answered (working notes §4;
   Anthropic's documentation read 2026-11-10 and this session's own observations): `Stop` and
   `SubagentStop` hooks can hold the agent, fire in cloud sessions, and can be declared in a
   skill's frontmatter so they exist only where the skill runs; a hook handler can be a model
   prompt; a skill with `context: fork` runs as a sub-agent with fixed text; a delegating agent
   otherwise writes its sub-agent's prompt; custom sub-agents load `CLAUDE.md` unless
   `omitClaudeMd` is set; hosted cloud sessions make every GitHub write under the user's own
   token and cannot reach GraphQL. Open: dynamic workflows and agent teams surveyed for fit; one
   cheap test of a skill-scoped hook.
5. **Which of the reference point's mechanics the Practice already holds** — open.

## Decisions made

1. **Touches are kinds of judgement, not a count** (the owner, 2026-11-10: "Correct"). Initiation
   through approval is one conversation with the owner, in which the owner signs the outcomes,
   the definition of done and the acceptance criteria. A mid-run doubt about worth, with evidence,
   returns the run to that conversation as a request for direction, never a menu.
2. **A cloud run writes under the owner's credential, as a distinguished session class** (the
   owner, 2026-11-10: "Agreed"). Every write is marked as agent-authored; the agent never submits
   a pull-request review; the merge happens only after the owner's word at the sense check.
   Reason: a hosted session has no other credential for GitHub. Open within it: how the session
   class is detected and recorded.
3. **Cost is recorded, never steered by** (the owner, 2026-11-10). No cost figure is a success
   measure, a target, or highlighted in what a running agent or the owner's decision screens
   show; it is kept for the retrospective. A round or push budget, where the design keeps one,
   is a sign of non-convergence to step back on.
4. **The host is read at run time**: repository, required checks, reviewers and rulesets. Reason:
   the fork is planned to merge back into Oak's `main` (`reunify-oce-forks`).
5. **The stepping-back mechanism meets five requirements** (from research question 3): it fires
   without the working agent judging it is needed; its frame is the owner's words and primary
   evidence, the working agent's reading being the thing judged; its question is fixed, climbs
   from the work to the bigger picture and admits "stop", "smaller" and "not worth doing"; its
   return is answered in writing in the run's record before the run continues, and a worth-doubt
   with evidence goes to the owner; it can subtract.

## Decisions open

- **How the stepping-back mechanism fires**: script-free forms (a stage's required written input;
  a fixed-text brief as a forked skill; a supporting rule) or a hook declared in the skill's
  frontmatter. Put to the owner on 2026-11-10 with this seat's leaning (script-free first, with a
  falsifier and the hook as the pre-decided next step).
- The stages and sub-skills; the doubt briefs per altitude; the sub-agent definitions.
- The two decision screens.
- The contract's carrier and the run's state, against the plan-node estate's rule that delivery
  state is a Linear projection, `one-pr-per-leaf-issue` and the one-open-pull-request limit.
- The resumption contract; detection of a second live run.
- Which parts of existing skills become components.
- The scale question (one pull request against larger work; Claude Code Projects).
- The build order and the first run's idea, which is the owner's to give.

## Acceptance criteria (each with a proof — required)

To be completed with the design. Held so far:

1. The `attendant` skill, its sub-skills and the stepping-back mechanism exist and pass the
   estate's skill and portability checks. Proof: `repo-safe`, `pnpm skills:check` and
   `pnpm portability:check` in CI.
2. The owner's first idea has gone through a run to a merge, with the run's record showing each
   stepping-back return and its written answer. Proof: `owner-held`, the owner at the sense
   check and the retrospective, recorded in the thread record.

## Out of scope

- Gate speed and ceremony in the repository's general mechanisms: their own lanes (the owner,
  2026-11-10).
- Improvements to existing skills beyond the components the Attendant shares with them.
