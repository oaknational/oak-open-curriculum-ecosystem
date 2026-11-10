---
id: attendant-research
node_type: delivery
name: Research for the Attendant Workflow
overview: Answer the five research questions the Attendant's design rests on, classify what the owner has caught that agents missed, and write the scenarios that will test the stepping-back mechanism.
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-11-10
ratified_where: "In-session word, Claude cloud session session_01DuocjT6NUndtf6abNSv8Tp (seat Limpet lifts Spray), 2026-11-10, verbatim: \"I ratify both plans and both design choices and designs to evaluate\"; recorded in the brief under The owner's words and on pull request 394"
serves: attendant-workflow
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-11-10
---

# Research for the Attendant Workflow

The first step of the lane [`attendant-workflow`](../strategic/attendant-workflow.plan.md),
written to be picked up cold at the owner's word of 2026-11-10: "Let's get the plan written and
ready, and the next session will carry out the research".

## Goal

The five research questions are answered from cited evidence; what the owner has caught that
agents missed is classified, with the question that would have caught each class; and the
scenarios that will test the stepping-back mechanism are written.

## User groups and value

- **The seats that design the mechanism and the Attendant**: decisions made from evidence of
  what the owner actually catches, instead of from a generic idea of doubt.
- **The owner**: a first look at the classification and the two decision screens, to correct
  before anything is built on them.

## Mechanism

**Entry.** Ground with `start-right-thorough`; read the brief's quotations, the strategic node `attendant-workflow` and this plan;
register on the thread `attendant-workflow`
(`.agent/memory/operational/threads/attendant-workflow.next-session.md`).

**Discipline.** Every quotation is checked against its file before it is used; a reader
sub-agent's quotation is a pointer to a source, never the source.

**Where findings go.** The full findings go in one new file,
`.agent/research/agentic-engineering/attendant-research-findings.md`, one section per question.
The evaluation scenarios go in `.agent/research/agentic-engineering/attendant-step-back-scenarios.md`
until the skill that owns them exists. A summary of what the findings change replaces the section "What the first pass
of research found" in the strategic node `attendant-workflow`.

**Order, and what a partial session hands on.** Questions 1, 3 and 4 feed the mechanism step and come
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
   - Output B: for each class, up to three real instances written as evaluation scenarios (the
     situation; the frame error in it; what stepping back looks like; what carrying on looks
     like), and one control scenario in which the frame is sound and stepping back would be
     noise. A class the saturated corpus gives fewer than three instances is recorded with the
     instances it has and the shortfall stated; the stopping rule is not relaxed to find more.
   - Held-back scenarios: where a class has more than three instances, the spare ones are
     written as scenarios into a second file,
     `.agent/research/agentic-engineering/attendant-step-back-held-back.md`. The seat that
     designs the mechanism must not be the seat that did this research and must not open that
     file: only a fresh scenario-runner and scorer read it, after the design is frozen. This
     is custody by convention, and the mechanism step records whether it was kept.
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
4. **What each lever can do, and whether the mechanism step's evaluation can be run.** Output: a short
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
   - A feasibility check of the mechanism step's full-repository comparison (working notes §7): one scenario run in a
     full-repository session with and without one rule present, to learn whether such a
     comparison can be run and scored at all, and at what effort.
5. **Which of the reference point's mechanics the Practice already holds**, from
   `.agent/research/team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md`. Output: a short
   table, each mechanic kept, adapted or left, with the reason.

The step ends with a pull request carrying the findings file, the two scenarios files and the
strategic node's revised summary section, and a report to the owner in the session: the classification, the two
screens, and what the findings change in the strategic node.

## Acceptance criteria (each with a proof — required)

1. The findings file answers the five questions, each claim cited to a source the seat read
   first-hand. Proof: `repo-safe` for existence and citation form (the file, merged; quotations
   checked by fixed-string search, the check recorded in the pull request); `owner-held` for
   adequacy, the owner's reading of the report, recorded in the thread record.
2. The scenarios files exist, with a control scenario per class and each class's shortfall
   stated where it has fewer than three instances. Proof: `repo-safe`, the files, merged.
3. The strategic node's research summary is revised from the findings, and the five causes and
   five requirements are confirmed or revised. Proof: `repo-safe`, the node, merged.

## Todos

1. The research, in the order above: one pull request. It is research prose, so its review
   follows the `pr-lifecycle` skill's intake for prose (PDR-140) at the default budget of two
   review rounds (PDR-132).

At the start the seat reads the brief's quotations, `principles.md`, the strategic node and this
plan, and re-commits to them at each question.

## Out of scope

- Designing or building the stepping-back mechanism or the Attendant: later steps of the lane,
  each with its own node.
- Running the corpus-analysis pipeline without the owner's word.
