---
id: attendant-workflow
node_type: strategic
name: The Attendant Workflow
overview: An idea of the owner's becomes merged, value-bearing work through a process agents run between the owner's touches, built on a mechanism that steps back and questions the frame automatically.
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-11-10
ratified_where: "In-session word, Claude cloud session session_01DuocjT6NUndtf6abNSv8Tp (seat Limpet lifts Spray), 2026-11-10, verbatim: \"I ratify both plans and both design choices and designs to evaluate\"; recorded in the brief under The owner's words and on pull request 394"
serves: FRAME-1
impact_areas:
  - practice-and-estate
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-11-10
---

# The Attendant Workflow

The owner's words are quoted and dated in the
[brief](../../prompts/agentic-engineering/idea-to-merge-process-design.prompt.md) and are the
authority; the evidence behind this node is in the
[working notes](../../research/agentic-engineering/attendant-creation-plan-working-notes.md).
The owner ratified this node on 2026-11-10 together with its two design choices: the placement
under FRAME-1 (the Practice as a meta-learning loop), and the stepping-back mechanism designed
to live in the estate's general surfaces with the Attendant as its first user; and the designs
to evaluate (working notes §7).

## Outcome

The Attendant Workflow exists as the `attendant` skill and its `attendant-*` sub-skills, and
ideas of the owner's go through it to a proper end: merged, or stopped on an evidenced doubt
about worth and redirected or abandoned on the owner's word, which the owner calls "a success of
the process". Agents meet a mechanism for stepping back and questioning the bigger picture
frame, motivation and nature of the work at the moments it is needed, without having to judge
that they need it.

## User groups and value

- **The owner**: an idea becomes merged, value-bearing work with the owner's judgement at the
  few points only the owner can supply (what is wanted, whether the criteria capture it, whether
  the result is sensible to merge), those touches kept few because the agent steps back, analyses
  and doubts before each one. Offered value; the first runs test it.
- **Agents running or resuming a run**: a process whose state and decisions are readable from
  records. Hypothesised: a stepping-back mechanism they meet without having to judge that they
  need it.
- **The people the estate serves**: more of the owner's ideas delivered. Hypothesised, and
  claimed only as far as merged work; release and use are outside a run's claim.

## The bet

The Attendant is a new approach and an exploration on the journey towards unsupervised working;
it replaces nothing (the owner, 2026-11-10). The bet is that judgement can stand in for the
owner's presence between the touches if stepping back is reliable, effective and automatic.
Several skills attempt that today and only partly succeed. The owner prefers a combination of
start-right, `AGENT.md`, skills and rules to hooks, and says of it: "will it work? We just don't
know yet". So the lane begins with research and an experiment, and treats its first run as an
experiment too. Not done here: gate speed and ceremony in the repository's general mechanisms,
which have their own lanes; any machinery (hooks, scripts) before evidence asks for it.

## What is settled

Confirmed by the owner on 2026-11-10, or forced by a fact read that day:

1. **Touches are kinds of judgement, not a count** (the owner: "Correct, and those touches are
   minimised by the agent stepping back and analysing and doubting before my touch"). Initiation
   through approval is one conversation with the owner, in which the owner signs the outcomes,
   the definition of done and the acceptance criteria. A mid-run doubt about worth, with evidence,
   returns the run to that conversation as a request for direction with analysis, never a menu.
2. **A cloud run writes under the owner's credential, as a distinguished session class** (the
   owner: "Agreed"). Every write is marked as agent-authored; the agent never submits a
   pull-request review; the merge happens only after the owner's word at the sense check. A
   hosted cloud session has no other credential for GitHub and cannot reach GitHub's GraphQL
   endpoint.
3. **Cost is never a success measure, and is not put in front of a running agent** (the owner:
   "if highlighted it tends to distort the direction the agent moves"; "That is not to say it is
   unimportant, or to ignore it"). It is recorded.
4. **The host is read at run time** (repository, required checks, reviewers, rulesets): the fork
   is planned to merge back into Oak's `main` (the plan node `reunify-oce-forks`).
5. **How stepping back fires is the central research question.** The owner: "Hooks are one
   option, but very heavy handed, skills and rules with appropriate descriptions and application
   criteria are better. Ideally some combination of start right, the agent.md file, skills and
   rules, but will it work? We just don't know yet".
6. **Slow gates and ceremony are the repository's general problems**, with their own lanes.

The authoring seat's readings, not the owner's words: that cost also stays off the owner's two
decision screens (kept for the retrospective); and that the script-free composition is designed
and tested first, a hook considered only on the evidence of the mechanism step.

## What the first pass of research found

A first pass (working notes §6), to be completed by the research step.

Five causes of the step-back instruments only partly succeeding:

1. The working agent decides when to step back ("Sixteen of nineteen prior-kept mechanisms
   recurred within four weeks of the run that kept them").
2. The one being checked writes the frame.
3. The question asked cannot return "stop" or "delete it".
4. The evidence handed over is the working agent's own record.
5. The return is advice to the agent it doubts.

What has worked: reviewers given no frame and pointed at the question; a frame built from the
owner's verbatim words; instruments where doctrine had not changed the rate; a sentence that
must be written; a declared deadline with a default.

Five requirements for the mechanism, to be tested by the research step and revised if it refutes them:

1. It fires without the working agent judging it is needed.
2. Its frame is the owner's words and primary evidence; the working agent's reading is the thing
   judged.
3. Its question is fixed, climbs from the work to the bigger picture, and admits "stop",
   "smaller" and "not worth doing".
4. Its return is answered in writing in the run's record before the run continues, and a
   worth-doubt with evidence goes to the owner.
5. It can subtract.

**The tension at the centre.** Requirement 1 pulls against the estate's own evidence: under a
silent model change, prose-only disciplines "regressed to error types months absent, despite the
full rule corpus being loaded in context", and the estate's pattern
(`.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md`) holds that
guidance works when the environment fires it. A written input a stage requires is still checked
by the agent it constrains. The owner prefers skills and rules to hooks and says plainly that
nobody knows yet whether they will work. This node does not resolve it; the mechanism step is how it is found out.

Lever facts (working notes §4; Anthropic's documentation read 2026-11-10): rules, skills,
sub-agents and repository hooks all load in an ordinary cloud session; a skill with
`context: fork` runs as a sub-agent with the skill's own text as its prompt; through the Agent
tool the delegating agent writes the sub-agent's prompt; custom sub-agents load `CLAUDE.md`
unless `omitClaudeMd` is set; hooks can be declared in a skill's frontmatter and can hold a
turn open.

## Success looks like

- The research questions answered from cited evidence, and the owner's catches classified.
- The stepping-back composition built and its working found out, with what the evidence does and
  does not show stated.
- The owner's first idea taken through a run to a proper end, the run's record showing each
  stepping-back return and its written answer.
- The first run's retrospective read against the owner's three provisional measures ("an idea
  reaches merged value with three touches of your attention and none unplanned"; "your sense
  check changes nothing material in most runs"; "you would rather use it than not"), as
  information and never as targets. Cost is recorded and is not a measure.

Not claimed: that unsupervised working is reached; that a seeded evaluation shows what a long
run will do.

## Delivery

Delivery plans serving this node declare `serves: attendant-workflow`; enumerate them by search.
The lane has four steps, each its own delivery node, authored by its implementer at pickup and
stamped before it governs work (the research node was stamped with this one):

1. **Research**: [`attendant-research`](../delivery/attendant-research.plan.md), written.
2. **The stepping-back mechanism**: designed across start-right, `AGENT.md`, skills and rules,
   and tested.
3. **The rest of the Attendant's design**: stages, decision screens, records, the cloud session
   class, resumption, scale.
4. **Build and first run**, on the owner's idea.

The authoring seat's proposals for steps 2 to 4 are in the working notes §7, as input to the
seats that write those nodes.
