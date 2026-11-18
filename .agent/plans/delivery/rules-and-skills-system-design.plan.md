---
id: rules-and-skills-system-design
node_type: delivery
name: "Design the rules and skills system: units, contracts, budgets, projections and build"
overview: "A design for how the estate's guidance is shaped, sized, built and delivered to Claude Code first and Codex second, with every budget well inside the platforms' thresholds. The system, not the content of any rule or skill."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-11-12
ratified_where: "In-session word, Claude cloud session session_01DuocjSig1rYLYhoLbF6r6w (seat Swift holds Aether), 2026-11-12, verbatim: \"Ratified. I mean PR 397, but it will review all PRs. Leave the plan under the current node. Yes, update the platform citizenship ordering\"; recorded in the comparison brief under The owner's words and on pull request 397"
serves: outcome-informed-practice-learning
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-11-13
---

# Design the rules and skills system

The owner's words are the authority and are quoted, dated, in the
[comparison brief](../../research/agentic-engineering/hermes-practice-comparison-2026-11/brief.md).
The evidence is under
[`doing-and-dreaming-2026-11`](../../research/agentic-engineering/doing-and-dreaming-2026-11/README.md):
the [review of the collection](../../research/agentic-engineering/doing-and-dreaming-2026-11/review-of-the-collection.md),
and the loading notes for
[Claude Code](../../research/agentic-engineering/doing-and-dreaming-2026-11/claude-code-rules-and-skills-loading.md)
and
[Codex](../../research/agentic-engineering/doing-and-dreaming-2026-11/codex-rules-and-skills-loading.md).

## Goal

A design exists, and the owner has ratified it, for the system that carries the estate's
guidance to a working agent: what kinds of unit there are, what each may hold and how large it
may be, how each is built into what each platform loads, what the build refuses, and how a
unit enters, changes and leaves. A seat that has not seen this work can then say, from the
design alone, what the build must be changed to do.

This is the shape, mechanics, processes and build steps, and not the content of any rule or
skill. The owner, 2026-11-12: "Is the next work defining the rule and skill system shape and
mechanics and processes and build steps etc, or the actual content of those rules and skills?
I am expecting the former."

## The problem

Stated as a gap, before any design.

- **The gap.** On Claude Code, a rule reaches a session as a pointer to a file, and the
  model must choose to open it; a skill reaches it as a name and its description, in an
  adapter that points to the skill's body as another file to open. By its documentation, Codex has no mechanism
  that loads a rule at all, and nothing was observed in a running Codex. The 124 rules and 78
  skills hold about 2.2 million characters, in which an instruction of a sentence or two
  shares a file with the ruling behind it and the incidents behind that. The build checks one
  platform threshold, the Codex limit on project documents, against the rules index, and no
  other.
- **What a session does with pointers.** In thirty short read-only sessions on Claude Code, a
  session opened rule files on the subject of its task, most of them with names that shared
  its words, and few others. That is a shape and not a rate, and why a file was opened was
  not measured.
- **Who it costs.** Every session carries the listing and pays in full for a file it opens.
  The owner stated the count as the premise of a question: "the fact that we have far, far too
  many rules". That the owner supplies by hand what undelivered guidance would have supplied
  is this seat's hypothesis; no trial here tempted a breach.
- **The mechanism, as a hypothesis.** The owner's account of the pointers: "The pointer system
  is designed to reduce repetition", across platforms. Long files, where an instruction and
  its evidence are kept together, cannot be repeated for each platform within any budget, so
  the pointer is what is repeated and the text is absent.
- **What the evidence does not say.** Text placed in context was acted on in one planning task
  and not in another. On short tasks the answer without the text is already close, in two
  bodies of first-hand evidence. So better delivery is not shown to be sufficient, and the
  design must say what text is not to be relied on for.

## User groups and value

- **The owner.** A system whose size is bounded by the build and not by vigilance, and,
  hypothesised, fewer corrections of the kind a delivered instruction would have prevented.
  The design names how that would be shown.
- **Agents opening a session, on Claude Code and on Codex.** The instructions that apply at
  all times are in front of them as text, the rest arrive at their moment, and nothing arrives
  twice. Claimed for Claude Code first and Codex second.
- **Agents on other platforms.** The repository still works there and nothing more is
  claimed. The owner: "every else is reasonable efforts only".
- **Seats that author or retire guidance.** One procedure that says where a thing goes, what
  it may weigh, and where its evidence is kept.

## Mechanism

The estate already generates its rule adapters. A rule's frontmatter is its declaration, and
`pnpm portability:fix` renders the index, the Cursor triggers and the Claude and `.agents`
adapters from it; `pnpm portability:check` recomputes them. Skills have a generator of their
own, a separate command that writes adapters carrying each skill's description to two
platform directories. The first todo's
[audit](../../research/agentic-engineering/rules-and-skills-system-design-2026-11/pipeline-audit.md)
describes both from their code. The
design therefore changes what is declared and what is rendered, and adds what the build
refuses. Whether anything in the pipeline must be replaced is for the first todo to find.

What the design starts from, each marked for what it is.

| Input | Standing |
| --- | --- |
| Claude Code first, Codex second, the rest functional | The owner's word, 2026-11-12 |
| Copied text for each platform is acceptable "as long as we don't end up loading things twice" | The owner's word, 2026-11-12 |
| Rules and skills "must describe current requirements, not the evolution that arrived at them" | The owner's ruling, 2026-11-12 |
| "each rule, skill, and the combined total of the relevant parts, should be well within the identified important thresholds" | The owner's word, 2026-11-12. How far within is a figure the design proposes and the owner decides |
| The thresholds themselves | Read from each vendor's documentation and recorded in the loading notes; measured only where the notes say so |
| A rule and a skill are containers that platforms provide, and Codex provides no container for a rule's text as guidance. Its `.codex/rules/` files are execution policy, which allows or forbids commands | Documented for Codex, not observed. If it holds, the design cannot be stated in rules and skills alone, and the audit still counts the execution-policy files as a Codex surface |
| A unit is better described by when it must be in front of the agent than by which container holds it | This seat's starting hypothesis. The design derives its own kinds and may discard this |

## What the design delivers

One document, `design.md`, in a new directory
`.agent/research/agentic-engineering/rules-and-skills-system-design-2026-11/`, with the scripts
behind its figures beside it. Where its decisions are finally recorded (a Practice decision
record or another home) is one of the questions it puts to the owner. Its parts:

1. **The unit model.** The kinds of unit, derived from what each needs of a platform; what
   each may and may not carry; how a unit relates to a paired skill, to the code that
   enforces it, and to the record of why it exists.
2. **Contracts.** For each kind: its required fields, its allowed length, what it promises a
   reader, and what it must not be relied on to do.
3. **Budgets.** Every threshold that matters on Claude Code and Codex, the budget proposed
   against each, and the estate's present measure beside it, per unit and per total.
4. **Projections.** For each kind and each of the two platforms: the file the build writes,
   what text it holds, and when the platform loads it. For other platforms: the least that
   keeps the repository working.
5. **Build and validation.** What is declared, what is generated, and each check that fails
   the build.
6. **Processes.** How a lesson becomes a unit and by whose decision; how a unit is changed,
   merged and retired; where its evidence and history go; and the method by which present
   content would be sorted into the model.
7. **How it will be known to work.** The instrument, the comparison, and what result would
   count against the design.

## Acceptance criteria (each with a proof)

1. Every budget in the document names the platform threshold it is set against and that
   threshold's source, and the present measure beside it is computed. `repo-safe`: a script
   kept with the document reproduces the table from the repository.
2. The projections are shown on real units before the design is put to the owner. A small set
   of units is rendered for Claude Code and for Codex in a throwaway clone, using each unit's
   existing description unaltered as its text, as the habit-text trial did. The tokens at
   session start are measured on Claude Code, and each unit is shown to be present once.
   `owner-held`, because the measure is taken from a running Claude Code session and no
   repository check can reproduce it: verified by the seat that runs the spike, with the
   dated observation, the script that renders and measures, and its output recorded with the
   document.
3. On Codex the same units are present once and within the proposed budget. `owner-held`:
   verified by the owner, or by a seat running Codex at the owner's word, with the dated
   observation recorded in the document.
4. The goal's "from the design alone" is tested. A reader who wrote none of it is given the
   document and nothing else and lists the changes the build requires; where the list is
   wrong or cannot be made, the document is corrected. `owner-held`, because a read is not a
   test, validator or CI check: verified by the seat that commissions the read, with the
   reader's list and the corrections it led to recorded, dated, in the document.
5. Each decision that is the owner's is put as one question with a recommendation and concrete
   text to accept. `owner-held`: the owner's answers, dated, in the document.

## Todos

Each is one pull request.

1. **Audit the present pipeline against its code.** The declaration shape, both generators,
   the portability and fitness validators, the one build-failing size threshold (which is in the
   portability validator), and what each platform's directory holds today. One page of facts,
   with the citations and quoted templates behind it in the same document. Done on
   2026-11-12, for the generators and those two validators; the build's other checks are
   named there and not audited:
   [`pipeline-audit.md`](../../research/agentic-engineering/rules-and-skills-system-design-2026-11/pipeline-audit.md).
2. **Write the unit model, the contracts and the budgets**, with the script behind the
   measures. Done on 2026-11-13:
   [`design.md`](../../research/agentic-engineering/rules-and-skills-system-design-2026-11/design.md),
   with each threshold re-read at its vendor page in
   [`threshold-reread.md`](../../research/agentic-engineering/rules-and-skills-system-design-2026-11/threshold-reread.md)
   and what each platform reads below the repository root in
   [`nested-directories.md`](../../research/agentic-engineering/rules-and-skills-system-design-2026-11/nested-directories.md).
   The owner decided its four questions on the model and the budgets on the same day, as the
   design records. Its fifth, where the decisions are recorded, was not put to the owner; it
   and the other open items of these parts went through the decision lenses in
   [`open-items.md`](../../research/agentic-engineering/rules-and-skills-system-design-2026-11/open-items.md).
   One is open, by the owner's word of the same day: whether the repository needs the nine
   skills installed from their vendors.
3. **Spike the projections** in a throwaway clone and record the measurements. It happens only
   when the owner says so, and any documentation change related to it, the amendments of the
   accepted records among them, is part of it. The owner, 2026-11-13: "The spike will not
   happen until I say so, stop treating it as imminent, and any related change of
   documentation is part of that spike, not a separate thing." What it observes, each with
   the decision it can change, is listed in `open-items.md`.
4. **Write the projections, the build and validation, the processes and the measure of
   success**, revised by what the spike showed; have it read cold; put the owner's questions.

## Out of scope

- The content of any rule, skill or pattern, and any rewrite, merge or retirement of one.
- Any change to the generators, validators or adapters in the repository. The spike runs in a
  throwaway clone.
- Research into platforms other than Claude Code and Codex.
- Any work after the design. The owner expects that "some existing materials will be redundant
  or inappropriate or be better expressed more succinctly"; changing the build and sorting the
  present content are not authorised by this node, and the design names no successor plans.
- The experiment on self-starting refinement, which is the node
  [`self-starting-practice-refinement`](../strategic/self-starting-practice-refinement.plan.md).
- Hooks, gates and lint rules themselves. The design says which requirements belong to code
  and not to text; building any of them is other work.

## Where this sits

- **It serves [`outcome-informed-practice-learning`](../strategic/outcome-informed-practice-learning.plan.md)**
  through one link of the learning loop: whether a lesson, once written, is in front of the
  agent that needs it. That node routes capability frameworks to `agent-platform-citizenship`;
  this node is placed here because its seventh part is about showing that delivered guidance
  changes later work. The owner, 2026-11-12: "Leave the plan under the current node."
  - *The live decision it enables.* What the build of the estate's guidance is changed to do.
  - *The narrower hypothesis.* That the standing instructions can be carried as text on
    Claude Code and on Codex, once each, well inside each platform's thresholds.
  - *The evidence that warrants it.* The two trials, the sort and the loading notes.
  - *The stop condition.* The spike shows the hypothesis false for Claude Code: the standing
    instructions, as their own descriptions state them, do not fit the proposed budget, or a
    unit is loaded twice. The same two failures observed on Codex, under the third acceptance
    criterion, reopen the Codex projection and do not stop the Claude Code design.
  - *The effect expected.* An agent starts with the standing instructions as text, at a known
    and bounded cost.
  - *Information governance and decision rights.* The design reads only tracked repository
    files and vendor documentation, and starts headless sessions only in a throwaway clone, as
    the two trials did. It decides nothing about any unit's content. Each choice of budget,
    kind and landing is the owner's and is put as a question.
- **[`agent-platform-citizenship`](../strategic/agent-platform-citizenship.plan.md)** holds
  that every capable platform is an equal first-class citizen, and records the owner
  deprioritising Codex on 2026-09-28. The owner's word of 2026-11-12 orders the platforms for
  this work, and at the owner's word of the same day that node carries the ordering as a
  dated note.
- **A second model family.** The owner, 2026-11-12: "Codex will review the PR so it gets a
  second agent family at that point", and on which pull request: "I mean PR 397, but it will
  review all PRs". The design's own pull requests are therefore reviewed by Codex too.
- **The accepted records it amends.** PDR-009 (canonical-first platform files), PDR-051
  (skills and their adapters) and PDR-124 (the budget of what a session is given at start)
  govern what this design changes. `open-items.md` says how, and the amendments are written
  as part of the spike's work, each quoting the owner's word.
- **The rule `capability-landing-decision-procedure`** already orders the estate's levers from
  always-loaded text to code that needs no context. The design builds on it and proposes its
  amendment where the evidence requires one.
- **First-principles check.** Shape: the design extends a generator that exists and the first
  todo reads its code before anything is proposed. Landing path: research documents and a
  throwaway clone; nothing a session loads is changed. Vendor literals: every threshold is
  cited to its vendor page in the loading notes and re-read at the page before a budget is
  set against it.
