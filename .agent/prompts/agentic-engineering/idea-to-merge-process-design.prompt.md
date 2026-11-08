# Brief: design the Attendant Workflow

**Type**: handover brief, session entry point. **Written**: 2026-11-07 and 2026-11-08, from
the owner's words of those days; every unquoted sentence is the author's reading of them.
**Task of the session that reads this**: produce the plan to create the Attendant Workflow,
not the workflow itself. The plan is decision-complete: every item in it is either specified
to the point where building it is execution, or assigned to a named run with the signal that
settles it and the default that holds until then; there is no third state. Research complete
means the bounded research below is done and cited; design complete means every item of
"What we currently believe the work should produce" is in one of those two states.

## Success, provisionally (the owner, 2026-11-08)

- An idea reaches merged value with three touches of the owner's attention and none
  unplanned.
- The owner's sense check changes nothing material in most runs.
- The owner would rather use the Attendant than not.

Cost per run is measured for information and is not a success metric: a number as a target
pulls work towards the number and away from value and sound judgement. That holds for every
numerical measure the Attendant takes. The three touch points are kinds of moment, not a
tally: a return (criteria returned at approval; "not yet" at the sense check) is the owner
sending the flow back to an earlier point in the graph, from which it continues as before
with better understanding. Nothing is counted (the owner, 2026-11-08).

## The impact, through what value

**The outcome**: an idea of the owner's becomes merged, value-bearing work with three touches
of the owner's attention and none unplanned, at a quality the owner would otherwise get only
by being present throughout. **The impact**: the owner's attention stops being the bottleneck
on delivery; what gets delivered is bounded by the owner's ideas, not by the hours the owner
can supervise, and the attention spent lands where only the owner can decide. **The
mechanism**: a fixed-shape process in which judgement replaces presence, doubt exercised at
several altitudes by minds outside the frame that did the work.

The design starts from "what do we need to create that value?", never from "how does what we
have fit this shape?". The design notes open with the seven capabilities the value needs,
what is understood, what is unknown and how each unknown would be learned, and the questions
not yet asked. Every item below traces to one of those capabilities.

## The owner's words

**The original request (2026-11-07)**:

> I want try adding a workflow to OCE, where I specify an idea and outcomes, the agent(s) flesh
> out and refine the idea, create a plan, review and improve the plan, I sign off on the
> definition of done and acceptance criteria, the invidual pieces of work are planned and
> carried out in parallels each on reviewed and improved until it meets the required standards
> and acceptance criteria, the pieces are assembled and the work is reviewed holistically from
> multiple perspectives including value over ceremony, delivery of user value, engineering
> excellence, Practice alignment and whatever else is good. The work is pushed to a PR,
> assessed, evaluated, there is a single check from me, then the agent merges the work. This
> workflow must be reusable, it must produce high quality outputs at each stage, it must
> include meaningful reviews at each stage, and it must need me only twice, during initial
> ideation and refinement, then to sense check the PR just before merge.

> Consider how we define the workflow, how we start it, how we know what the current state of
> a specific instance is, and how we know when we are done.

**The checkpoints and the middle (2026-11-07)**: "this is a new workflow, we need to give it a
memorable name, and within that workflow there are two or three touch points for me depending
on how one counts: initiation, acceptance criteria approval, final sense check just before
merge. The entire middle part is fully automated with appropriate checks and reviews, similar
to the recently merged report on an automated agentic development system, but using Practice
standards and norms instead of distinct agent identifies". Then: "The number of check points
in the workflow will be fixed, we are designing a process. That process has nothing to do with
the existing PRs."

**The user story (2026-11-07)**:

1. "I put forward an idea and ask for the Attendant workflow"
2. "The idea is analysed using all appropriate skills, improved, and acceptance criteria in
   terms of value the implemented work would provide are presented for my approval"
3. "Once I approve a detailed plan is created, broken down into subplans, optimised for
   parallel work where appropriate"
4. "The plan is implemented by the agent or agents"
5. "An assessment is made by the solo agent, or if in parallel the lead agent, as to whether
   the implementation has delivered the value specified in the plan. If work is happening in
   parallel each parallel track subplan must have acceptance criteria set by the lead agent,
   these do not need my approval, and each parallel track be agent assessed for value delivery,
   and then when the sub tracks come together the above overall assessment must happen"
6. "Once the agent believes that the value has been delivered the PR is marked ready for
   review"
7. "Once the review iteration is complete the agent judges if the work is ready for merge, if
   it is then the final request for a user sense check is made"

"Throughout that process doubt is explored and valued."

Where the original request and the user story differ, the user story governs: the detailed
plan follows the owner's approval of the acceptance criteria; the pre-approval work turns the
idea into those criteria. "No merge yet" is a valid state of a run; "no merge at all" is not
(2026-11-07). On the first doubt: "this workflow happens once I have an idea for value I want
provided, so the first questions include 'what is the real user value here', and 'how can we
deliver that'" (2026-11-07).

**The name and the shape (2026-11-07)**: "We call the new workflow the Attendant Workflow, the
umbrella skill is the attendant skill, and the sub skills the attendant-\* skill. Skill
components are not skills, they are a unit of logic and guidance and contract. The umbrella
skill is the entry point and high-level flow, the sub skills are each part in appropriate
detail, so there is never one huge skill in context creating confusion and competing
demands." And: "assume we need a new skill and sub skills, where existing skills cover part of
the needed definitions we pull those specific parts out as skill components that we can
assemble it the existing skills and the new skills. There is ZERO expectation that this new
approach will be served by existing skills, only that we may have explored appropriate
concepts already."

**Machinery (2026-11-07)**: "Start from a base assumption of zero machinery and only skills,
and use tidy where, if anywhere, that causes problems. The preference is no machinery, it
inevitably becomes the center of attention, adding complexity and fragility while preventing
real value being delivered. Where machinery truly earns it's place we will consider it, but it
is a high bar." (The author reads "tidy" as "tooling".)

**Rules (2026-11-07)**: "step back and question where we should and should not apply normal
rules, the default is always that all rules applies, and strict everywhere all the time still
applies, but previous PR limits and token limits taken from normal operations should be
tunable as part of defining how the this workflow works and is improved".

**Cloud (2026-11-07)**: "We need this to work end to end in cloud sessions, so how do we make
that possible with bot credentials, and if it isn't how do we distinguish these sessions so
it's clear when using my credentials is appropriate?"

**Scale (2026-11-07)**: "should the workflow identify one PR work vs larger projects, and if
and how that potentially relates to the Claude Code concept of projects".

**Doubt (2026-11-08)**: "stepping back and questioning the fundamentals, asking not just if we
are doing the right thing but if what we are trying to achieve is worthwhile, is the only way
this kind of automated delivery is going to provide value instead of ceremony and fluent
seeming but useless busy work." And: "All input is exactly that, input to be treated
critically and thoughtfully."

**The next session (2026-11-08)**: "The output from the next session will be the plan to
create the workflow, not the workflow itself, the plan must be decision completed and
therefore research complete and design complete."

## The reference point, with the owner's substitution

The owner's "similar to the recently merged report on an automated agentic development
system" is Alex Ward's team-of-one agentic SDLC (the essay of 5 November 2026) as compared with
the Practice in
[`team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md`](../../research/team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md),
with Practice standards and norms in place of its distinct agent identities. Its mechanics
(the ticket as the contract; a refuse-to-start check; plan review before build; a reviewer
walking the acceptance list item by item with evidence, failing closed; verdicts bound to the
current plan revision; round caps that end with the human; the human at both ends) are
hypotheses the research tests against the estate's record, not adopted shape; the comparison
report maps which of them the Practice already holds in another form.

## What we currently believe the work should produce

This list is the belief before the exploration, written on 2026-11-07 and revised on
2026-11-08, derived from the seven capabilities the value needs (the design notes, §1). The
design session tests it as it explores: an item may be added, merged, reshaped or retired on
evidence, an item that serves none of the capabilities is cut, and the session records what it
changed and why. The plan specifies each item or assigns it to a named run; building is the
work that follows the plan.

1. **The `attendant` skill**: the entry point and the high-level flow, the three checkpoints,
   the hand-offs between sub-skills, the one screen for the final sense check, and the
   process's parameters.
2. **The `attendant-*` sub-skills**, one per stage, each in its own detail: inputs, outputs,
   exit, and what it hands to its doubter and withholds.
3. **The doubt briefs**: for each stage, what the doubter receives, what it may not receive,
   the question at that altitude, the return shape, and the round budget.
4. **The sub-agent definitions** for the doubters and, in parallel runs, the track builders.
   The count and shape are open: whether one definition parameterised by altitude serves, or
   several. A lens-named sub-agent is a role inside a run under the Practice's norms (the
   estate's bot on third-party systems, the seat's own name in its records), as the existing
   reviewer sub-agents are; it is not a distinct agent identity in the sense the owner set
   aside, which is Ward's separate accounts per agent on Linear and GitHub.
5. **The components**: which parts of which existing skills are extracted, each as one unit
   of logic, guidance and contract, referenced by the existing skill and by the Attendant.
6. **The contract's carrier**: how the value-denominated acceptance criteria with their
   evidence, and the lead's track criteria, are recorded; the plan node's ratification stamp
   is the candidate the notes propose, not a decision.
7. **How a run meets the purpose of each normal-operations limit**, limit by limit: unlanded
   work bounded (the open-PR limit's purpose), changes small enough to review well (the PR
   bands'), non-convergence visible early (the round budgets'), spend priced before it is
   spent (the fan-out controls'). The Attendant's definition states how a run serves each
   purpose, with a value only where one is needed, and its retrospectives tune what it
   states. Where a rule's literal sentence would be false of an Attendant run, the sentence
   is incomplete and is improved in the ordinary way doctrine changes; nothing is overridden
   and no mechanism is added.
8. **The credential each write a cloud run makes uses**, designed from the known constraints
   (the facts section below): the bot for every write; where no bot path exists for a write,
   the plan names the blocker and the owner rules, per the bot-identity rule's own escalation
   clause. A run never discovers this by making the write under the owner's credential.
9. **The run's resumption contract**: what record a fresh session reads to resume a run at the
   right step after a compaction or a session end, what it must not redo, and how a second
   live run is detected.
10. **The answers** to how a run is started, how anyone can tell its current state, how it is
    known to be done, and the scale question.
11. **The first run**: the owner's idea, and the order in which the skills, sub-agents and
    components are built so that run can happen.
12. **The stepping-back capability** (the design notes, §2): the review of the step-back
    family of skills and rules as components, what each lacks for questioning the genuinely
    bigger picture and in what form the missing part should exist, and whether a specialised
    sub-agent carries it: one that reads the record and the owner's verbatim words, is
    triggered at stage boundaries and on signals rather than by the main agent's judgement,
    climbs altitude more than once, and returns frame-challenging questions the main agent
    must answer before continuing.
13. **The composition of the native levers** for the Attendant, as a hypothesis to test: rules
    for invariants across every run; skills for the flow and stage procedures; sub-agents for
    judgement from outside the frame. Hooks are machinery (the owner, 2026-11-08): costlier
    here than rules, skills and sub-agents, slightly less costly than arbitrary scripts;
    script-free guidance wherever it can serve, a hook only on a run's evidence that it
    cannot.

## Research the plan must complete

Bounded, so that "research complete" is reachable in a session. The corpus: the twelve
reports listed under facts below; the owner's corrections and rulings in the thread records
(`.agent/memory/operational/threads/`), the Director rulings ledger and `distilled.md`; and
the napkin and its archives searched on correction markers (the owner's quoted words,
"verbatim", "ruling", "correction"), not read end to end. Stopping rule: saturation, three
consecutive sources adding no new altitude class or no new fact. Every claim cited to its
source in the bounded corpus.

- **What has the owner historically caught, in review, in conversation and at corrections,
  that agents missed?** Classified by altitude (the work, the stage, the plan, the value
  proposition, the bigger picture). This is the specification for the doubt briefs and for the
  stepping-back questions.
- **What must the owner see at approval and at the sense check** to decide well in minutes?
  From the same corpus: what the owner asked for, re-asked for, and acted on.
- **Why do the existing step-back instruments leave the altitude change to the owner?** The
  notes' §2 holds a hypothesis (invoked from inside the frame; triggered by the captured
  judgement; climbing one level); the research tests it against the corpus and the
  instruments' own texts.
- **What can each native lever trigger on and instigate?** Rules (what loads them, in a cloud
  session included, and whether a rule can instigate an action or only shape behaviour);
  skills (invocation, sub-skill hand-off, what a skill can require as a precondition); hooks
  (the exact events Claude Code offers, what `Stop` and `SubagentStop` may do, and what runs
  in a cloud session); sub-agents (dispatch, inputs, return shapes, what a sub-agent can and
  cannot read of the main agent's context). Read from Anthropic's current documentation and
  tested where a test is cheap, never assumed. One fact is already verified: repository skills
  load and invoke one another in an ordinary Claude cloud session (the session that wrote
  this brief was one, and ran `start-right-thorough`, `parallax` and others through the Skill
  tool on 2026-11-07).

## The owner's answers of 2026-11-08 to the review's questions

- On whether a return to a checkpoint counts: "Already we are being distracted by the pull of
  numbers. A return to a checkpoint is cycling back to an earlier point in the graph. There is
  no count to check against, the flow has three touch points, only I am send the process
  around to an earlier one, but once it is at that earlier one it continues as before but
  with better understanding."
- On hooks: "Hooks are machinery, in our approach here they are more expensive than rules,
  skills, and sub-agents, slightly less expensive than arbitrary scripts. Wherever we can we
  want to use script free guidance rather than code."
- On whether a lens-named sub-agent is a distinct agent identity: closed by the decision
  lenses (item 4 above): a role under Practice norms, as the existing reviewer sub-agents are.
- On a mechanism for the tunable limits: the question dissolved on stepping back (item 7
  above). The Attendant's definition states how a run serves each limit's purpose; an
  incomplete rule sentence is improved as doctrine always is; no mechanism exists to admit.

## How to work

- Ground with `start-right-thorough`. Use the Parallax skill to explore the design space, and
  the cognitive and planning skills (`concept-exploration`, `proportionality`, `reason`,
  `metacognition`, `user-value`, `specify`, `plan`) through it.
- Find where the estate has already worked through a concept the process needs, and extract
  the part of each existing skill that carries it as a component. Existing skills are
  evidence that a concept was explored, never a part to reuse whole.
- Make design decisions in the plan, each with its reasoning. A decision that is the owner's
  by the decision lenses goes to the owner as a card; everything else is the designer's to
  settle and state.
- The owner is the design partner, and provides the idea for the first run.
- Author the plan in the plan estate through the `plan` skill (born `sketch`; the owner's
  ratification stamp is what makes it the plan of record), and keep working notes in the
  repository as the work proceeds.

## Design notes to start from

[`idea-to-merge-process-design-notes-2026-11-07.md`](../../research/agentic-engineering/idea-to-merge-process-design-notes-2026-11-07.md):
the value chain, the seven capabilities, the unknowns and the questions not yet asked (§1);
the stepping-back capability and its native-lever hypothesis (§2); a ten-step sequence drawn
from the user story, with the internal reviews and the PR review set apart (§5); how a run is
defined, started, observed and known done (§6). Input to assess critically; the owner's words
are the authority, the draft is not.

## Facts already gathered (the design is yours)

Each name below is a place where a concept was worked through, to read and extract from.
Skills live at `.agent/skills/<group>/<name>/SKILL-CANONICAL.md` and are indexed by
`.agent/skills/README.md`; rules at `.agent/rules/`; decision records at
`.agent/practice-core/decision-records/` (PDR) and `docs/architecture/architectural-decisions/`
(ADR); `distilled.md` at `.agent/memory/active/`.

**Concepts by stage.** Initiation and refinement: `concept-exploration`, `parallax` and its
siblings, `proportionality`, `reason`, `metacognition`, `user-value`, `specify`, `cricket`,
PDR-103. Plan: the `plan` skill, PDR-132 clause 5, PDR-093, `specify-connection`,
`ticket-management`. Plan review: PDR-123, `assumptions-expert` (ADR-146), the four
architecture lenses, `parallax-audit`. Approval: the plan-node estate (ADR-216: born-sketch
nodes, the ratification stamp, acceptance criteria with `repo-safe` or `owner-held` proofs),
the definition of delivery, `assess-specification`. Pieces: worktree isolation, `agent-tools`
`spawn`, `set-up-worktree-lane`, PDR-117, the `commit` skill. Piece review: the
`invoke-code-experts` roster, PDR-122, `agent-tools` `pr-tally` (signed per-finding
dispositions). Assembly: `specify-connection`, the CI gates. Holistic review: `user-value`,
`proportionality`, the reviewer roster, `release-readiness-expert`, `parallax-audit`, the
cross-vendor instruments (`sif`, `codex-helper`). PR and merge: `pr-lifecycle`, PDR-128,
PDR-131, `agent-tools` `merge-bot`, `pr-watch`. Done and learning: the definition of
delivery, plan archival, `wrap`, `retrospective`, `parallax-learn`, PDR-130. State: PDR-118,
ADR-212. Orchestration: the Workflow tool, `agent-tools` `workflow-build`, `corpus-analysis`.

**Surfaces carrying the limits the owner named as tunable.** The work-in-progress limit (the
`pr-lifecycle` skill), the small-PR bands (the rule `design-work-for-small-prs`), review-round
and settlement-push budgets (PDR-132, PDR-140), fan-out cost controls (the rule
`fleet-design-review-before-expensive-fleets`). `rules-have-no-exceptions` governs how a
rule's statement changes.

**Claude Code projects** (Anthropic's Projects page, read 2026-11-07): a project is a
coordinating conversation that starts and tracks cloud threads, each a cloud session with
its own PR, with an overview of thread states; a public beta on Pro, Max and Ultra plans, for
one user, absent from Team and Enterprise plans and from the terminal. Threads load a
repository's root `CLAUDE.md` and `.claude/rules/` and do not load its skills, `.mcp.json`,
or `.claude/settings.json` permissions and hooks; the page's remedy for hooks is running the
thread on the user's own computer.

**Cloud credentials.** Every agent write on GitHub uses the bot
(`bot-identity-on-third-party-systems`; its action map names the writes permitted under the
operator's credential, a PR review among them; a bot capability gap is a blocker to surface,
never a licence). The merge bot needs a machine-local key and an untracked per-checkout
config, so it cannot run in a cloud session
(`.agent/claude-harness-integrations/cloud-environment.md`, which records a connector merge
under the operator credential as "never a practice to normalise"). Cloud-environment secrets
are injected by the network proxy as request headers and are never readable in the session.
The upstream-carrier workflow mints the bot's app token inside GitHub Actions from repository
secrets. Candidate shapes for the plan to weigh: a bot write made by a GitHub Actions job the
run triggers; a local seat woken by the PR record to make the write.

**Most relevant prior reports.** `.agent/research/practice-nature-and-lights-on-comparison-2026-10-22.md`;
`.agent/research/review-loop-convergence-concept-exploration-2026-07.md`;
`.agent/research/fleet-design-lessons-2026-08-17.md`;
`.agent/research/agent-teams-and-fleets-survey-2026-08-22.md`;
`.agent/research/agentic-engineering/closure-pressure-and-workflow-composition-2026-05-20.md`;
`.agent/research/dora-2025-and-the-practice.comparison.md`;
`.agent/reports/agentic-engineering/why-five-days-of-landings-closed-nine-stories-2026-09-29.md`;
`.agent/reports/agentic-engineering/pr336-fleet-assessment-and-review-treadmill-2026-07-13.md`;
`.agent/reports/agentic-engineering/multi-agent-review-methodology-2026-08-09.md`;
`.agent/reports/agentic-engineering/fleet-topologies-history-and-designs-2026-08-05.md`;
`.agent/reports/agentic-engineering/why-written-lessons-kept-needing-the-owner-2026-09-16.md`;
`.agent/research/team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md`.

## Deliverable

A decision-complete plan to create the Attendant, authored in the plan estate: the bounded
research answered with citations; every item of "What we currently believe the work should
produce" either specified to build or assigned to a named run with its settling signal and
interim default, with a record of what the exploration added, merged, reshaped or retired and
why; the owner's questions answered or carded; and the build order for the first run.
