# Brief: design the idea-to-merge process

**Type**: handover brief, session entry point. **Written**: 2026-11-07, from the owner's words
of that day. **Task of the session that reads this**: design the process below and record the
design.

## The process, as the owner specified it

A new, named, reusable OCE workflow. It is a process in its own right, designed on its own
terms; the repository's current pull requests and day-to-day operations are not inputs to it.

**It needs a memorable name.** Choosing one is part of the design.

**The owner's checkpoints are fixed. There are three:**

1. **Initiation.** The owner provides the idea and the outcomes it is for.
2. **Acceptance-criteria approval.** The owner signs off the definition of done and the
   acceptance criteria.
3. **Final sense check, just before merge.** The owner checks the pull request once.

**The middle is fully automated**, with appropriate checks and reviews at every stage, run on
the Practice's standards and norms. In order:

- the agents flesh out and refine the idea, turning the owner's suggestion into a structured
  plan, with multiple structured reviews during refinement;
- the plan is reviewed and improved;
- (checkpoint 2);
- the individual pieces of work are planned, and carried out in parallel, each reviewed and
  improved until it meets the required standards and the acceptance criteria;
- the pieces are assembled;
- the whole is reviewed holistically from multiple perspectives: value over ceremony,
  delivery of user value, engineering excellence, Practice alignment, and whatever else is
  good;
- the work is pushed to a pull request, assessed and evaluated;
- (checkpoint 3);
- the agent merges the work.

**Qualities.** Reusable. High-quality output at every stage. Meaningful reviews at every
stage. Structured reviews during both refinement and implementation.

**The model to work from.** Alex Ward's team-of-one agentic SDLC (the essay "I built an
agentic SDLC for a team of one. Here's the plumbing", 5 November 2026) as compared with the
Practice in the report
[`team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md`](../../research/team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md):
the ticket as the contract; a refuse-to-start check on the ticket; plan review
before build; two reviewers on every push, one walking the acceptance list item by item with
evidence for every "met", failing closed; verdicts that count only for the current plan
revision; round caps that end with the human; the human at both ends. The owner's
instruction: this process runs on Practice standards and norms where that system uses
distinct agent identities.

**Rules.** Every Practice rule applies to the process, strictly, everywhere, all the time.
The limits that normal operations set for their own conditions, the pull-request limits and
the token limits among them, are parameters of this workflow: its definition sets them, and
improving the workflow tunes them. Part of the design is to question, rule by rule, where the
process applies a normal-operations value and where it sets its own.

**Cloud.** The process runs end to end in Claude cloud sessions. Design how its writes to
third-party systems use bot credentials there; where that proves impossible for a write,
design how such sessions are distinguished so that it is clear when the owner's credentials
are appropriate.

**Scale.** Explore whether the process identifies single-pull-request work as distinct from
larger projects, and whether and how a larger project relates to the Claude Code concept of
projects.

## How it is built (the owner, 2026-11-07)

1. **The process is a new skill with sub-skills.** Where an existing skill holds a part of a
   definition the process needs, that part is extracted into a skill component, a plain file
   that the existing skill and the new skills both reference, so one definition serves both.
   Existing skills are evidence that a concept was explored, never a part to reuse whole.
2. **The base is zero machinery.** The process is skills, sub-agents and the repository's
   records. Tooling enters at a point where a run has shown that skills alone fail there,
   never in anticipation, and it leaves when that evidence lapses. The bar is high because
   machinery draws attention to itself, adds complexity and fragility, and displaces the
   value.

## What the design must answer

1. How the process is defined: the new skill, its sub-skills, and the components extracted
   from existing skills, each with its home.
2. How a run is started.
3. How anyone can tell the current state of a specific run.
4. How a run is known to be done.
5. What happens inside the automated middle: which sub-skill runs at each stage, what each
   review tests, and what the middle does when a stage finds the approved plan or criteria
   cannot be met, within the three fixed checkpoints.
6. The parameters the process sets for itself, each with its value and its reason.
7. The credential each write a cloud run makes uses, found by running the process on skills
   alone and meeting the constraint where a run meets it.
8. The scale question above.

## How to work

- Ground with `start-right-thorough`. Use the Parallax skill to explore the design space, and
  the cognitive and planning skills (`concept-exploration`, `proportionality`, `reason`,
  `metacognition`, `user-value`, `specify`, `plan`) through it.
- Find where the estate has already worked through a concept the process needs, and extract
  the part of each existing skill that carries it as a component. Read the reports and
  research on similar concepts under `.agent/reports/agentic-engineering/`,
  `.agent/research/`, and the decision records.
- Make design decisions in the design, each with its reasoning. A decision that is the
  owner's by the decision lenses goes to the owner as a card; everything else is the
  designer's to settle and state.
- The owner is the design partner. The owner provides the idea for the first run of the
  process.
- Keep notes in the repository as the work proceeds.

## Design notes to start from

[`idea-to-merge-process-design-notes-2026-11-07.md`](../../research/agentic-engineering/idea-to-merge-process-design-notes-2026-11-07.md)
holds the owner's direction on the process's quality mechanism: a doubt point in every stage,
at differing altitudes, asking not only whether the work is right but whether what it is
trying to achieve is worthwhile; the process built from the agent's native features, skills
above all, each stage's skill kept, changed or newly written as the design finds; and a
nine-stage draft with the doubt points placed and candidate skills named. It is input to
assess critically; the owner's words in it are the authority, the draft is not.

## Concepts already explored, and where (facts; the design is yours)

Each name below is a place where a concept was worked through, to read and extract from; the
process starts from zero machinery and no existing skill is assumed to serve.

**By stage.** Initiation and refinement: `concept-exploration`, `parallax`
and its siblings, `proportionality`, `reason`, `metacognition`, `user-value`, `specify`,
`cricket`, PDR-103. Plan: the `plan` skill, PDR-132 clause 5, PDR-093, `specify-connection`,
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

**Rules carrying the limits the owner named as tunable.** The work-in-progress limit
(`pr-lifecycle`), the small-PR bands (`design-work-for-small-prs`), review-round and
settlement-push budgets (PDR-132, PDR-140), fan-out cost controls
(`fleet-design-review-before-expensive-fleets`). `rules-have-no-exceptions` governs how a
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
operator's credential, a PR review among them). The merge bot needs a machine-local key and
an untracked per-checkout config, so it cannot run in a cloud session
(`.agent/claude-harness-integrations/cloud-environment.md`). Cloud-environment secrets are
injected by the network proxy as request headers and are never readable in the session. The
upstream-carrier workflow mints the bot's app token inside GitHub Actions from repository
secrets.

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

The new skill, its sub-skills and the components extracted from existing skills, with the
process's parameters and its answers to the eight questions above.
