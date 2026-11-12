# Brief: design the Attendant Workflow

**Type**: handover brief, session entry point. **Written**: 2026-11-07 and 2026-11-08, from
the owner's words of those days; a quotation is the owner's, dated; every other sentence is
the author's reading. **Revised**: 2026-11-10 by the design seat (Limpet lifts Spray), on the
owner's words of that day and on facts re-read that day; the evidence for each revision is in the
[working notes](../../research/agentic-engineering/attendant-creation-plan-working-notes.md).
**Terms**: *the creation plan* was the name of the design session's deliverable, now the
strategic node `attendant-workflow` and its delivery nodes; *the run plan* is the detailed plan
a run makes after approval; *the run node* is the plan-estate record a run keeps. The research
step this brief opened was done on 2026-11-12; the step after it is opened by
[`attendant-mechanism-step.prompt.md`](attendant-mechanism-step.prompt.md).

**Task of the session that reads this**: carry out the research step of the Attendant lane,
[`attendant-research`](../../plans/delivery/attendant-research.plan.md), under its strategic node
[`attendant-workflow`](../../plans/strategic/attendant-workflow.plan.md). Both were ratified by the owner on 2026-11-10 ("I ratify both plans and both design choices and
designs to evaluate"). The owner, 2026-11-10: "Let's get the plan written and ready, and the next session will carry out the
research". The owner's earlier word on the standard the planning must reach (2026-11-08):
"decision completed and therefore research complete and design complete".

## Success, provisionally

The owner, 2026-11-08: "Yes to the following as provisional metrics for success":

> - an idea reaches merged value with three touches of your attention and none unplanned;
> - your sense check changes nothing material in most runs;
> - you would rather use it than not;

"I am explicitly excluding cost per run as a success metric, in my experience similar metrics
have become overemphasised and pulled work towards numerical outcomes rather than value
provision and sound judgement." And, on returns to a checkpoint: "There is no count to check
against, the flow has three touch points, only I am send the process around to an earlier
one, but once it is at that earlier one it continues as before but with better
understanding."

## The impact, through what value

The Attendant is a new approach and an exploration on the journey towards unsupervised working;
it replaces nothing (the owner, 2026-11-10). An idea of the owner's becomes merged, value-bearing
work with the owner's judgement at the few points only the owner can supply, those touches kept
few by the agent stepping back, analysing and doubting before each one; each run teaches how far
unsupervised work can be relied on. One of the work's main goals is a reliable, effective
mechanism for automatically stepping back and questioning the bigger picture frame, motivation
and nature of the work. The mechanism of the whole is a fixed-shape process in which judgement
replaces presence, doubt exercised at several altitudes by minds outside the frame that did the
work. Slow gates and ceremony are general problems of the repository's mechanisms with their own
lanes, not this work's. The design notes §1 carry the value chain, the eight capabilities the
value needs, what is understood and unknown, and the questions first asked there. Every item
below names the capability it serves.

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

The owner confirmed on 2026-11-10 how these fit: a touch is a kind of judgement only the owner
makes (what is wanted, whether the criteria capture it, whether the result is sensible to merge),
not a count; initiation through approval is one conversation with the owner, in which the owner
signs the outcomes, the definition of done and the acceptance criteria; a mid-run doubt about
worth returns to that conversation. "Correct, and those touches are minimised by the agent
stepping back and analysing and doubting before my touch."

**States of a run (2026-11-07 and 2026-11-08)**: "'No merge yet' is a valid state, 'no merge
at all' is not." Asked on 2026-11-08 whether an idea the owner decides against after a run
has started is a recorded state of the workflow or the owner's act from outside it, the owner
chose the recorded state: abandoned, the run node archived with the owner's word and the
reason, the branch and pull request closed, the retrospective still run.

**Direction, and the checkpoints (2026-11-08)**. On a worth-doubt found with evidence in the
middle: "This is the very heart of the value we are trying to create. Stepping back,
questioning, and changing direction. This is not a failure, it's a success of the process.
[...] If this state occurs then ask the user for direction, don't offer a menu of options,
ask for direction". On where the owner's word is given: "All in the session. The session is
largely unattended, but clearly at the interaction points the session cannot be unattended.
Instead of making requirements in tension try to fit, recognise that requirements in tension
are a strong signal to step back and assess the frame".

**The first doubt (2026-11-07)**: "this workflow happens once I have an idea for value I want
provided, so the first questions include 'what is the real user value here', and 'how can we
deliver that'".

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
is a high bar." (The author reads "tidy" as "tooling".) And, 2026-11-08: "Hooks are
machinery, in our approach here they are more expensive than rules, skills, and sub-agents,
slightly less expensive than arbitrary scripts. Wherever we can we want to use script free
guidance rather than code."

**Rules and constraints (2026-11-07 and 2026-11-08)**: "step back and question where we should
and should not apply normal rules, the default is always that all rules applies, and strict
everywhere all the time still applies, but previous PR limits and token limits taken from
normal operations should be tunable as part of defining how the this workflow works and is
improved". "We have already excluded pricing as a mechanism for this work." "We have also
said, right at the beginning, that the attendant workflow is a new way of working, and that we
can question existing constraints such as multiple PRs, that doesn't mean ignore rules or best
practice, it means that during design and development we should explore what becomes easier
if aspects of the system are allowed to change."

**Cloud (2026-11-07)**: "We need this to work end to end in cloud sessions, so how do we make
that possible with bot credentials, and if it isn't how do we distinguish these sessions so
it's clear when using my credentials is appropriate?"

**Scale (2026-11-07)**: "should the workflow identify one PR work vs larger projects, and if
and how that potentially relates to the Claude Code concept of projects".

**Doubt (2026-11-08)**: "stepping back and questioning the fundamentals, asking not just if we
are doing the right thing but if what we are trying to achieve is worthwhile, is the only way
this kind of automated delivery is going to provide value instead of ceremony and fluent
seeming but useless busy work." "All input is exactly that, input to be treated critically and
thoughtfully." On the stepping-back trigger: "And potentially a supporting rule to help
trigger the workflow".

**The next session (2026-11-08)**: "The output from the next session will be the plan to
create the workflow, not the workflow itself, the plan must be decision completed and therefore
research complete and design complete."

**The work's nature and its main goal (2026-11-10)**: "The Attendant doesn't replace anything, it
is a new approach and an exploration on the general journey towards unsupervised working." "I
absolutely agree that the quality gates are too slow and that ceremony has a tendency to get in
the way of delivery, and that we need to improve both. This are general problems with the repo's
mechanisms, they are not particular to the Attendant. One of the main goals of this work is to
create a reliable, effective mechanism for automatically stepping back and questioning the bigger
picture frame, motivation, and nature of the work. Several skills already attempt to provide
this, but have only been partially successful".

**The plan now, the research next (2026-11-10)**: "Let's get the plan written and ready, and the
next session will carry out the research".

**Ratification (2026-11-10)**: "I ratify both plans and both design choices and designs to
evaluate". The plans are the strategic node `attendant-workflow` and the delivery node
`attendant-research`; the design choices are the placement under FRAME-1 and the stepping-back
mechanism as a general capability of the estate with the Attendant as its first user.

**How stepping back fires (2026-11-10)**: "This is the very heart of the challenge we face. It is
what we are researching. Hooks are one option, but very heavy handed, skills and rules with
appropriate descriptions and application criteria are better. Ideally some combination of start
right, the agent.md file, skills and rules, but will it work? We just don't know yet".

**Cost (2026-11-10)**: "Our efforts to use cost to steer behaviour have produced some dumb results
where cost reduction was minimised at the expense of producing value. So I definitely do not want
cost used as a success metric. That is not to say it is unimportant, or to ignore it, only that
if highlighted it tends to distort the direction the agent moves, and the distortion compounds
over time, which would make independent work less reliable."

**The cloud credential (2026-11-10)**: "Agreed", to the design seat's leaning: an Attendant cloud
session class that writes under the owner's credential, every write marked as agent-authored, no
pull-request review ever submitted by the agent, the merge only after the owner's word at the
sense check.

## The reference point, with the owner's substitution

The owner's "similar to the recently merged report on an automated agentic development
system" is Alex Ward's team-of-one agentic SDLC (the essay of 5 November 2026) as compared with
the Practice in
[`team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md`](../../research/team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md),
with Practice standards and norms in place of its distinct agent identities (its agents are
separate accounts on Linear and GitHub). Its mechanics (the ticket as the contract; a
refuse-to-start check; plan review before build; a reviewer walking the acceptance list item
by item with evidence, failing closed; verdicts bound to the current plan revision; round caps
that end with the human; the human at both ends) are hypotheses the research tests (the fifth
research question), and the comparison report maps which of them the Practice already holds
in another form.

## What we currently believe the work should produce

**For the lane's later steps, not the research session.** The research informs these items; the
seats that design the mechanism and the rest of the Attendant test and decide them.

The belief before the exploration, written on 2026-11-07 and revised on 2026-11-08. Each item
names in brackets the capability it serves (the notes §1: C1 find the real value; C2 tell
whether value was delivered; C3 keep quality without presence; C4 run in the cloud end to
end, unattended between the interaction points;
C5 earn the owner's trust at the decision screens; C6 survive its own duration; C7 be legible
to any seat from records; C8 learn). The design session tests the list as it explores: an item
may be added, merged, reshaped or retired on evidence, an item that serves no capability is
cut, and the session records what it changed and why. The creation plan specifies each item or
assigns it to a named run.

1. **The `attendant` skill** [C3, C5, C7]: the entry point and the high-level flow, the three
   checkpoints, the hand-offs between sub-skills, the one screen for the final sense check,
   and how a run operates within the estate's constraints (item 7).
2. **The `attendant-*` sub-skills** [C1, C2, C3], one per stage, each in its own detail:
   inputs, outputs, exit, and what it hands to its doubter and withholds.
3. **The doubt briefs** [C3]: for each stage, what the doubter receives, what it may not
   receive, the question at that altitude, the return shape, and the round budget.
4. **The sub-agent definitions** [C2, C3] for the doubters and, in parallel runs, the track
   builders. The count and shape are open: one definition parameterised by altitude, or
   several. (The author's reading, by the decision lenses: a lens-named sub-agent is a role
   inside a run under the Practice's norms, the estate's bot on third-party systems and the
   seat's own name in its records, as the existing reviewer sub-agents are; the identities the
   owner set aside are Ward's separate accounts per agent.)
5. **The components** [C3, C8]: which parts of which existing skills are extracted, each as
   one unit of logic, guidance and contract, referenced by the existing skill and by the
   Attendant.
6. **The contract's carrier** [C2, C5, C7]: how the value-denominated acceptance criteria with
   their evidence, and the lead's track criteria, are recorded; the run node's ratification
   stamp is the candidate the notes propose.
7. **What each normal-operations constraint protects, and what becomes easier if the system
   changes** [C4, C3]. For each constraint the design meets (the work-in-progress limit of
   one open pull request for a seat working alone, the PR bands, the round budgets, the fan-out controls, `one-pr-per-leaf-issue`
   and its split of decision from delivery, the plan-node estate's rule that delivery state is a
   Linear projection, the Director rules, the one-PR-per-run shape the notes' sequence starts
   from, and any other): what it protects in normal operations; what an Attendant run
   would gain if the system changed so that it no longer binds in the same way; and the
   change, if any, the design proposes, each proposal to the owner. Where a rule's sentence is
   incomplete for the Attendant it is improved in the ordinary way doctrine changes. Cost is
   observed and recorded, never a success measure, a target or a highlighted figure in what a
   running agent or the owner's decision screens show (the owner, 2026-11-10); proportion is
   held by judgement, the doubt points and the proportionality lens. (The author's reading of
   the owner's "tunable": the Attendant's
   definition states how a run serves each constraint's purpose, with a value only where one
   is needed, tuned by its retrospectives.)
8. **The credential each write a cloud run makes uses** [C4]. In an Anthropic-hosted cloud
   session every GitHub write goes out under the owner's token (the facts below), so the design
   is the one the owner's question names and the owner agreed on 2026-11-10: how an Attendant
   cloud session is distinguished so that using the owner's credential is clearly appropriate,
   every write marked as agent-authored, no pull-request review submitted by the agent, the
   merge only after the owner's word at the sense check. The host (repository, bot, required
   checks, reviewers) is read at run time: the fork is planned to merge back into Oak's `main`
   (`reunify-oce-forks`).
9. **The run's resumption contract** [C6, C7]: what record a fresh session reads to resume a
   run at the right step after a compaction or a session end, what it must not redo, and how
   a second live run is detected.
10. **The owner's word and the run** [C5, C7]: the owner's word is given in the session,
    which is attended at the interaction points (the owner, 2026-11-08); the abandoned state;
    and the answers to how a run is started, how anyone can tell its current state, how it is
    known to be done, and the scale question.
11. **The first run** [all]: the owner's idea, and the order in which the skills, sub-agents
    and components are built so that run can happen.
12. **The stepping-back capability** [C3] (the notes §2): the component review of the
    step-back family of skills and rules, what each lacks for questioning the genuinely bigger
    picture and in what form the missing part should exist, and whether a specialised
    sub-agent carries it. A main goal of the work in its own right (the owner, 2026-11-10). How it
    fires is a design decision the research informs: script-free forms (a stage's required
    written input, a fixed-text brief run as a forked skill, a supporting rule) and a hook
    declared in the skill's own frontmatter are the candidates.
13. **The composition of the native levers** [C3, C4], as a hypothesis to test: rules for
    invariants across every run; skills for the flow and stage procedures; sub-agents for
    judgement from outside the frame; hooks as machinery, under the owner's bar and cost
    ordering. The survey also covers the native levers beyond these four: forked skills,
    skill-scoped and sub-agent-scoped hooks, the prompt and agent hook types, worktree
    isolation, sub-agent nesting, dynamic workflows and agent teams.

## Research the plan must complete

Bounded, so that "research complete" is reachable in a session. The corpus, read densest
first: the graduated record of what the owner has caught (the rules that carry the owner's dated
words, `owner-signal-interpretation.md`, the `why-…` and other retrospectives under
`.agent/reports/agentic-engineering/`, the Cricket tallies, the experience files, the review-cost
ledger, the frictions register and the open questions); the twelve reports listed under facts
below; the owner's corrections and rulings in the thread records
(`.agent/memory/operational/threads/`), the Director rulings ledger and `distilled.md`; and
the napkin and its archives searched on correction markers (the owner's quoted words,
"verbatim", "ruling", "correction"). Stopping rule: saturation, three consecutive sources
adding neither a new class nor a new fact. Every claim cited to its source in the bounded
corpus.

- **What has the owner historically caught, in review, in conversation and at corrections,
  that agents missed?** Classified by altitude; seed classes are the work, the stage, the
  plan, the value proposition and the bigger picture, and the research lets the classes
  emerge from what it finds. This is the specification for the doubt briefs and for the
  stepping-back questions.
- **What must the owner see at approval and at the sense check** to decide well in minutes?
  From the same corpus: what the owner asked for, re-asked for, and acted on.
- **Why do the existing step-back instruments leave the altitude change to the owner?** The
  notes §2 holds a hypothesis (invoked from inside the frame; triggered by the captured
  judgement; climbing one level); the research tests it against the corpus and the
  instruments' own texts.
- **What can each native lever trigger on and instigate?** Rules (what loads them, in a cloud
  session included, and whether a rule can instigate an action or only shape behaviour);
  skills (invocation, sub-skill hand-off, what a skill can require as a precondition); hooks
  (the exact events Claude Code offers, what `Stop` and `SubagentStop` may do, and what runs
  in a cloud session); sub-agents (dispatch, inputs, return shapes, what a sub-agent can and
  cannot read of the main agent's context). Read from Anthropic's current documentation and
  tested where a test is cheap. One fact is verified: repository skills load and invoke one
  another in an ordinary Claude cloud session (the session that wrote this brief was one, and
  ran `start-right-thorough`, `parallax` and others through the Skill tool on 2026-11-07).
- **Which of the reference point's mechanics the Practice already holds in another form, and
  which the Attendant needs**, from the comparison report and the corpus.

## How to work

For the research session:

- Ground with `start-right-thorough`, then follow the delivery node `attendant-research`: its
  order of questions, its stopping rule and the files its findings go to.
- Check every quotation against its file before using it.
- Stop at the research step's outputs and report to the owner. Designing the mechanism or the
  Attendant belongs to later steps, and the seat that does the research does not design the
  mechanism.

For the later steps (input to the seats that take them): use the Parallax skill and the
cognitive and planning skills (`concept-exploration`, `proportionality`, `reason`,
`metacognition`, `user-value`, `specify`, `plan`); at every part of the design ask what becomes
easier if the system changes and record the answer; extract the parts of existing skills that
carry a needed concept as components; make each design decision with its reasoning; bring the
owner's decisions to the owner with analysis, never as a menu. The owner is the design partner
and provides the idea for the first run.

## Design notes to start from

[`idea-to-merge-process-design-notes-2026-11-07.md`](../../research/agentic-engineering/idea-to-merge-process-design-notes-2026-11-07.md):
the value chain, the eight capabilities, the unknowns and the questions first asked there
(§1); the stepping-back capability and its native-lever hypothesis (§2); a ten-step sequence
drawn from the user story, with the internal reviews and the PR review set apart and the
concepts already explored named per stage (§5); how a run is defined, started, observed and
known done (§6). Input to assess critically; the owner's words are the authority.

## Facts already gathered (the design is yours)

Skills live at `.agent/skills/<group>/<name>/SKILL-CANONICAL.md` and are indexed by
`.agent/skills/README.md`; rules at `.agent/rules/`; decision records at
`.agent/practice-core/decision-records/` (PDR) and `docs/architecture/architectural-decisions/`
(ADR); `distilled.md` at `.agent/memory/active/`. The concepts already explored, per stage,
are the "Concepts explored in" column of the notes §5; each is a place to read and extract
from.

**Surfaces carrying the constraints the owner named as tunable.** The work-in-progress limit
(the `pr-lifecycle` skill), the small-PR bands (the rule `design-work-for-small-prs`),
review-round budgets (PDR-132) and settlement-push budgets (PDR-140; the owner named PR limits
and token limits, and these two are the author's additions; PDR-140's gate lives in the pre-push
hook and does not run in a cloud session), fan-out controls (the rule `fleet-design-review-before-expensive-fleets`).
`rules-have-no-exceptions` governs how a rule's statement changes.

**Claude Code projects** (Anthropic's Projects page, read 2026-11-07 and again 2026-11-10): a
project is a coordinating conversation that starts and tracks threads, each usually a cloud
session on its own branch that "opens a pull request when the work calls for one"; a public beta
on Pro, Max and Ultra plans, absent from Team and Enterprise plans. A cloud thread loads a
repository's root `CLAUDE.md` and root `.claude/rules/`; it does not load path-specific rules,
skills (the page's remedy is enabling a skill on the claude.ai account), agents and commands
under `.claude/`, or `.mcp.json`, and does not run `.claude/settings.json` hooks; the remedy for
agents and hooks is running the thread on the user's own computer. Consequence for the scale
question: the Attendant's sub-agents do not load in a project thread, so a run executes in an
ordinary cloud session, and a project could coordinate such runs.

**Cloud credentials.** In an Anthropic-hosted cloud session "all GitHub operations go through a
dedicated proxy that keeps your real GitHub credentials outside the session's VM": git pushes and
API requests go out under the user's real credentials, the proxy refuses GitHub's GraphQL
endpoint "regardless of the credentials you supply", and a token set as an environment variable
is readable by anyone who uses the environment (Anthropic, "Configure cloud environments", read
2026-11-10). So no GitHub write from a hosted session is the bot's. A self-hosted environment can
use "per-session minted credentials"; GitHub Actions minting the bot's app token is proven by a
stub trial only. The estate's precedent for a session class that writes under the owner's
credential by the owner's ruling is the ChatGPT Work profile
(`.agent/directives/cloud-environment-routing.md`), with agent-authored content marked under
`identify-as-agent-under-shared-credentials`. The estate's review settlement reads review threads
through GraphQL, so a cloud run's review stage is designed against REST or the session's GitHub
connector.

**Claude Code levers** (Anthropic's hooks, skills and sub-agents pages, read 2026-11-10; the
working notes §4 carry the detail): `Stop` and `SubagentStop` hooks can hold the agent or
sub-agent from ending and hooks fire in cloud sessions; hook handlers include a `prompt` type and
an experimental `agent` type; hooks declared in a skill's frontmatter register when the skill is
invoked; a skill with `context: fork` runs as a sub-agent with the skill's text as its prompt;
through the Agent tool the delegating agent writes the sub-agent's prompt, and custom sub-agents
load `CLAUDE.md` unless `omitClaudeMd` is set.

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

For the research session: the outputs the delivery node `attendant-research` names (the findings
file, the two scenarios files, the strategic node's revised research summary) and a report to
the owner. The lane's whole deliverable, across its four steps, is the strategic node's outcome.
