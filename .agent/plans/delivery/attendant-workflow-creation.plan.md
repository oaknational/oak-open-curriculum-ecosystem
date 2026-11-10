---
id: attendant-workflow-creation
node_type: delivery
name: Create the Attendant Workflow
overview: Research, design, build and first-run the Attendant Workflow, an idea-to-merge process run by agents between the owner's touches, whose heart is a mechanism for automatically stepping back and questioning the frame.
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

The owner's words are quoted and dated in the
[brief](../../prompts/agentic-engineering/idea-to-merge-process-design.prompt.md) and are the
authority. The evidence behind the findings below is in the
[working notes](../../research/agentic-engineering/attendant-creation-plan-working-notes.md).
The owner, 2026-11-10: "Let's get the plan written and ready, and the next session will carry
out the research". So this plan is written to be picked up cold. Its first phase is the
research, specified here; the design decisions that depend on the research are named with the
question each answers.

Three things in this plan are the authoring seat's reading and are the owner's to confirm or
change when stamping it: the parent node; that phase 2 (building the stepping-back mechanism as
an experiment and evaluating it) is part of "what we are researching" and so may run under this
plan's stamp, before the rest of the Attendant is designed; and that the mechanism is designed
to live in the estate's general surfaces with the Attendant as its first user (phase 2, step 1).

## Goal

The Attendant Workflow exists as the `attendant` skill and its `attendant-*` sub-skills, and the
owner's first idea has gone through a run to a proper end: merged, or stopped on an evidenced
doubt about its worth and redirected or abandoned on the owner's word, which the owner calls "a
success of the process". The Attendant is a new approach and an exploration on the journey
towards unsupervised working; it replaces nothing. One of its main goals is a reliable,
effective mechanism for automatically stepping back and questioning the bigger picture frame,
motivation and nature of the work; several skills attempt this today and only partly succeed
(the owner, 2026-11-10).

## User groups and value

- **The owner**: an idea becomes merged, value-bearing work with the owner's judgement at the
  few points only the owner can supply (what is wanted, whether the criteria capture it, whether
  the result is sensible to merge), those touches kept few because the agent steps back, analyses
  and doubts before each one. Offered value; the first runs test it.
- **Agents running or resuming a run**: a process whose state and decisions are readable from
  records. Hypothesised: a stepping-back mechanism they meet without having to judge that they
  need it (the open question of phase 2).
- **The people the estate serves**: more of the owner's ideas delivered. Hypothesised, and
  claimed only as far as merged work; release and use are outside a run's claim.

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
and tested first, a hook considered only on phase 2's evidence.

## What the first pass of research found

A first pass (working notes §6), to be completed in phase 1.

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

Five requirements for the mechanism, to be tested by phase 1 and revised if it refutes them:

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
nobody knows yet whether they will work. The plan does not resolve this; phase 2 is how it is
found out.

Lever facts (working notes §4; Anthropic's documentation read 2026-11-10): rules, skills,
sub-agents and repository hooks all load in an ordinary cloud session; a skill with
`context: fork` runs as a sub-agent with the skill's own text as its prompt; through the Agent
tool the delegating agent writes the sub-agent's prompt; custom sub-agents load `CLAUDE.md`
unless `omitClaudeMd` is set; hooks can be declared in a skill's frontmatter and can hold a
turn open.

## Phase 1: research (the next session)

**Entry.** Ground with `start-right-thorough`; read the brief's quotations and this plan;
register on the thread `attendant-workflow`
(`.agent/memory/operational/threads/attendant-workflow.next-session.md`).

**Discipline.** Every quotation is checked against its file before it is used; a reader
sub-agent's quotation is a pointer to a source, never the source.

**Where findings go.** The full findings go in one new file,
`.agent/research/agentic-engineering/attendant-research-findings.md`, one section per question.
The evaluation scenarios go in `.agent/research/agentic-engineering/attendant-step-back-scenarios.md`
until the skill that owns them exists. A summary of what the findings change goes in a new
section of this plan, "What the research found", replacing the first-pass section above.

**Order, and what a partial session hands on.** Questions 1, 3 and 4 feed phase 2 and come
first, in that order; question 2's instances are collected while reading for question 1;
question 5 comes last and may wait for a later session. A session that ends part-way records in
the thread record which questions are complete, which sources were read for the one in hand, and
the classes found so far.

1. **What the owner has caught that agents missed.**
   - Corpus, in this order: the rules that carry the owner's dated words (51 of 124 by
     `grep -l -iE "owner[^.]{0,40}verbatim|verbatim[^.]{0,20}owner|\(owner, 20[0-9]{2}-" .agent/rules/*.md`;
     a wider pattern finds more, and any rule quoting the owner counts);
     `.agent/memory/executive/owner-signal-interpretation.md`; the nine `why-…` retrospectives
     under `.agent/reports/agentic-engineering/`, then the other retrospectives there; the
     Cricket tallies in the same directory; `.agent/memory/operational/director-rulings-ledger.md`;
     the twelve reports the brief lists. The experience files, thread records and napkin
     archives are searched on correction markers (the owner's quoted words, "verbatim",
     "ruling", "correction"), not read through.
   - Stopping rule, for this question only: a source is one file; stop when three files in a
     row add no new class and no instance that changes a class's question or its moment. The
     rule is not applied before the rules, the owner-signal file and the nine `why-…` records
     have all been read.
   - Output A: a classification of the catches by what was wrong (seed classes: the work, the
     stage, the plan, the value, the bigger picture; let the classes emerge), with, for each
     class, the question that would have caught it and the moment it should have been asked.
   - Output B: for each class, three real instances written as evaluation scenarios (the
     situation; the frame error in it; what stepping back looks like; what carrying on looks
     like), one of the three held back from the mechanism's design as a test case; and, for
     each class, one control scenario in which the frame is sound and stepping back would be
     noise.
   - If the corpus does not saturate by hand, the estate's corpus-analysis pipeline
     (`agent-tools/src/corpus-analysis/`, run through the Workflow tool) is the instrument, and
     running it needs the owner's explicit word.
2. **What the owner must see at approval and at the sense check** to decide well in minutes:
   what the owner asked for, re-asked for and acted on, collected during question 1. Output: the
   contents of each screen, each item traced to an instance.
3. **Why the step-back instruments only partly succeed.** Read each instrument's full text (the
   `plan` skill's design gate, `metacognition`, `parallax` and its frame and audit siblings,
   `concept-exploration`, `proportionality`, `reason`, `cricket`, `retrospective`; the rules
   `scope-from-goal-before-approach`, `re-apply-first-question-at-elaboration-boundaries`,
   `design-from-impact-not-the-cowpath`) against output A. Output: for each, what it does well,
   which of the five causes it shows, and what of it the Attendant can reuse as a component;
   and the five causes and five requirements confirmed or revised.
4. **What each lever can do, and whether phase 2's evaluation can be run.** Output: a short
   answer to each of these.
   - How a rule's and a skill's description and application criteria decide whether it is met at
     the right moment: the rules `skill-naming-and-description-quality` and
     `capability-landing-decision-procedure`, and Anthropic's skills and memory pages
     (code.claude.com/docs).
   - What the `start-right-*` skills (their shared workflows under `.agent/skills/`) and
     `.agent/directives/AGENT.md` can carry, and what a change to either costs every session.
   - Dynamic workflows and agent teams, surveyed for fit.
   - The evaluation instruments: the estate's skill-evaluation runner
     (`pnpm agent-tools:skill-evals`, described in `agent-tools/README.md`) with its case file
     `<skill>/evals/evals.json`, its trigger suite `evals/trigger-validation.json` and its
     results under `evals/results/`; and `.agent/directives/validation-strategy.md`, including
     "What is not eval-shaped".
   - A feasibility check of phase 2, step 2's second instrument: one scenario run in a
     full-repository session with and without one rule present, to learn whether such a
     comparison can be run and scored at all, and at what effort.
5. **Which of the reference point's mechanics the Practice already holds**, from
   `.agent/research/team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md`. Output: a short
   table, each mechanic kept, adapted or left, with the reason.

Phase 1 ends with a pull request carrying the findings file, the scenarios file and this plan's
new summary section, and a report to the owner in the session: the classification, the two
screens, and what the findings change in this plan.

## Phase 2: design and test the stepping-back mechanism

The heart of the work, done before the rest of the Attendant because every other part depends
on it; designed by exploration with the owner as design partner.

1. **Design the composition** across the four surfaces the owner named: `start-right`,
   `AGENT.md`, skills and rules. For each, what it carries, with descriptions and application
   criteria written so the agent meets it at its moment without having to recall it. Two of the
   four are read by every session, so the mechanism is designed as a general capability of the
   estate with the Attendant as its first user, and any change to `AGENT.md` or a `start-right`
   workflow is proposed to the owner before it is made. Candidate parts, to be confirmed or
   replaced by phase 1: a line in `start-right` and `AGENT.md` that names the obligation and
   points to its skill; a rule stating the obligation and its moments; a stage's required
   written input (a stage does not start without the step-back return and its written answer
   on record); the step-back brief as fixed text in a forked skill, given the owner's words and
   primary evidence.
2. **Find out whether it works**, with three instruments, each for what it can show.
   - *The skill part*: the estate's skill-evaluation runner on the step-back skill, including
     its trigger suite for the description. The runner tests a skill alone, in an empty
     workspace; rules, `AGENT.md` and `start-right` are in neither of its arms.
   - *The composition*: full-repository sessions on output B's scenarios, run with the
     composition present and absent (two branches), if question 4's feasibility check shows
     this can be done. Each scenario is run at least three times per arm, on the model a run
     would use, named in the results; the held-back scenarios are used only here; the control
     scenarios measure stepping back where it is noise. Scoring is by a fixed rubric written
     before the runs (did the agent step back; was what it did next right), applied by a fresh
     agent that did not design the mechanism, with the owner reading a sample.
   - *What neither can show*, left to the first runs and their retrospectives and said so: a
     frame drifting slowly over a long session; firing after compaction; capture by the agent's
     own sunk work; whether a written answer is real or formulaic; behaviour across a model
     change.
   Results are kept under the skill's `evals/results/`.
3. **Decide on the evidence, with the owner.** The composition goes forward if, on the seeded
   scenarios, the agent steps back more often with it than without, it does not step back more
   often on the control scenarios, and the owner judges the returns worth having. If not, the
   design is revised and re-run. A hook declared in the skill's own frontmatter is considered
   only then, tested cheaply first, and is the owner's decision.

## Phase 3: design the rest of the Attendant

Each decision below is made in this plan with its reasoning, from phases 1 and 2 and the owner's
words; "simpler if the system changed?" is asked of each and the answer recorded.

- The stages and their sub-skills, from the owner's user story and the settled touch model; the
  doubt asked at each stage and its altitude.
- The two decision screens (phase 1, question 2).
- The sub-agent definitions, and how each receives the owner's words and primary evidence.
- How a run's contract and state are recorded, against three constraints: the plan-node estate's
  rule that delivery state is a Linear projection; `one-pr-per-leaf-issue` and its split of
  decision from delivery; the one-open-pull-request limit for a seat working alone. Each is
  analysed for what it protects and what becomes easier if it changes; any change is proposed
  to the owner.
- How an Attendant cloud session is detected and recorded as its session class, and how its
  writes are marked.
- The review stage without GraphQL.
- The resumption contract across compactions and sessions, and how a second live run is
  detected.
- Which parts of existing skills become components shared with the Attendant.
- The scale question: one pull request against larger work, and Claude Code Projects (a project
  thread does not load the repository's sub-agents or run its hooks, so a run executes in an
  ordinary cloud session).
- The states of a run: not yet; abandoned on the owner's word; done.

Phase 3 ends with this plan's design sections complete, an outside-the-frame audit of the whole
plan asked whether it could be complete and still worthless, and the plan returned to the owner:
a change of this size returns it to `sketch` for a second stamp.

## Phase 4: build and first run

The build order is decided at the end of phase 3; the mechanism of phase 2 already exists by
then. The owner gives the idea for the first run. The first run is an experiment as well as a
delivery. Its record shows each stepping-back return and its written answer. Its retrospective
reads the run against the owner's three provisional measures ("an idea reaches merged value with
three touches of your attention and none unplanned"; "your sense check changes nothing material
in most runs"; "you would rather use it than not"), as information and never as targets, and
says which doubt points changed something, what the owner changed at the sense check, and what
this plan got wrong.

## Acceptance criteria (each with a proof — required)

1. The research questions are answered with cited evidence. Proof: `repo-safe` for existence
   (the findings and scenarios files, merged); `owner-held` for adequacy, the owner's reading of
   the phase 1 report, recorded in the thread record.
2. The stepping-back composition exists with its evaluation cases, and the results with and
   without it are recorded with what they do and do not show. Proof: `repo-safe`, the skill and
   its `evals/` files, `pnpm skills:check` and `pnpm portability:check` in CI.
3. The `attendant` skill and its sub-skills exist and pass the same two checks, which prove
   form only; whether they work is criterion 4's. Proof: `repo-safe`, CI.
4. The owner's first idea has gone through a run to a proper end (merged, or stopped on an
   evidenced worth-doubt and redirected or abandoned on the owner's word), with the run's record
   showing each stepping-back return and its written answer, and the retrospective recorded.
   Proof: `owner-held`, the owner in the session, recorded in the thread record.

## Todos

1. Phase 1, the research: one pull request of findings. It is research prose, so its review
   follows the `pr-lifecycle` skill's intake for prose (PDR-140) at the default budget of two
   review rounds (PDR-132).
2. Phase 2, the mechanism and its evaluations: its own pull request.
3. Phase 3, the design completed in this plan; the owner's second stamp.
4. Phase 4, the build and the first run.

At the start of each phase the seat re-reads the brief's quotations, `principles.md` and this
plan, and re-commits to them. Skills and sub-agents are authored through the estate's
`author-skills` and `subagent-architecture` skills and reviewed per `invoke-code-experts`.

## Out of scope

- Gate speed and ceremony in the repository's general mechanisms: their own lanes.
- Improvements to existing skills beyond the components the Attendant shares with them and the
  general stepping-back capability of phase 2.
- Any machinery (hooks, scripts) before phase 2's evidence asks for it.
