# An idea-to-merge delivery workflow: initial design notes

**Date**: 2026-11-07 · **Seat**: Juniper seeks Pollen (Claude Code cloud session, solo) ·
**Status**: initial notes for designing a new process; revision 3, after the owner's
correction of the same day. Nothing in this note decides the design.

This note supports the design of a new workflow: a fixed process. It holds, in order, what
the owner has decided (§1), the request restated (§2), the open design questions (§3), the
assumptions this seat made and how each now stands (§4), and the evidence: what the estate
already has and has learned (§§5 to 9). The owner's words, verbatim, are in §10.

The process being designed is kept separate from two other things: this session's own
artefacts (these notes and the pull request that carries them), and the estate's current
operations (other pull requests, today's limits). Neither constrains the design.

## 1. What the owner has decided

Each item is traced to the owner's words in §10.

1. **A new, named, reusable workflow**: a process, "not an adjustment to the general
   workforce nor a new rule for wide application". It needs "a memorable name"; none is
   chosen.
2. **The owner provides the idea** and its intended outcomes.
3. **Fixed checkpoints for the owner**: "initiation, acceptance criteria approval, final
   sense check just before merge". The number is fixed; the process is designed around it.
4. **A fully automated middle** "with appropriate checks and reviews", using "Practice
   standards and norms" rather than distinct agent identities, similar to the automated
   agentic development system in the recently merged report (the lights-on comparison,
   [`practice-nature-and-lights-on-comparison-2026-10-22.md`](../practice-nature-and-lights-on-comparison-2026-10-22.md)).
5. **The stages**, from the original request: the agents flesh out and refine the idea,
   create a plan, review and improve it; the owner approves the definition of done and
   acceptance criteria; the pieces are planned and carried out in parallel, each reviewed and
   improved until it meets the required standards and acceptance criteria; the pieces are
   assembled; the whole is reviewed from multiple perspectives ("value over ceremony,
   delivery of user value, engineering excellence, Practice alignment and whatever else is
   good"); the work goes to a PR, is assessed and evaluated; the owner's final check; the
   agent merges.
6. **Quality**: high-quality outputs and meaningful reviews at each stage.
7. **Rules**: "all rules applies, and strict everywhere all the time still applies, but
   previous PR limits and token limits taken from normal operations should be tunable as part
   of defining how the this workflow works and is improved".
8. **Cloud**: it must "work end to end in cloud sessions", with bot credentials where that is
   possible.
9. **The definition must answer** how the workflow is defined, how it is started, how the
   current state of an instance is known, and how we know when it is done.

## 2. The request, restated

> I want a new, named, reusable OCE workflow that takes an idea of mine and the outcomes I
> want to merged work that meets acceptance criteria I approved. It has a fixed set of
> checkpoints for me: initiation, acceptance-criteria approval, and a sense check just
> before merge. Everything between is fully automated, with meaningful reviews at every stage,
> run on the Practice's standards and norms: the agents refine the idea into a structured
> plan and review and improve it before I approve; then plan and build the pieces in
> parallel, reviewing and improving each until it meets the standards and the acceptance
> criteria; assemble them; review the whole from multiple perspectives; open, assess and
> evaluate the pull request; and, after my check, merge. Every Practice rule applies
> strictly; the PR and token limits set for normal operations become this workflow's own
> tunable parameters. It runs end to end in cloud sessions. Its definition says how a run is
> started, how anyone can tell a run's current state, and how we know a run is done.

## 3. Open design questions

None is answered here. Each lists what is known and where the evidence is.

- **Q1. Name.** Candidates seen so far: Bookends (the owner at both ends, agents between),
  Errand, Sortie. The owner expressed no preference when asked (§10).
- **Q2. Deviations inside a fixed process.** When the automated middle finds that the
  approved plan or criteria are wrong (a criterion cannot be met, the scope must change, the
  cost will be exceeded, a review loop will not converge), what does the process do, given
  that the owner's checkpoints are fixed? Known: the estate treats evidence that refutes an
  owner-approved premise as an owner action moment
  ([owner-attention rule](../../rules/owner-attention-at-action-moments.md)), so the process
  has to give that moment a defined place among its fixed checkpoints, for example by ending
  the run at the final checkpoint with a report of what was not delivered and why.
- **Q3. One PR or a larger project**, and whether and how that relates to Claude Code
  projects (the owner's question). Facts in §7.
- **Q4. End to end in the cloud with bot credentials**, and, if that is not possible, how to
  distinguish the sessions where the owner's credentials are appropriate (the owner's
  question). Constraints and candidate routes in §8.
- **Q5. Which limits are the workflow's parameters, and their starting values.** The owner
  named PR limits and token limits. Candidates and their purposes in §6.
- **Q6. How the workflow is defined, started, observed and finished.** Candidate answers from
  existing machinery in §5.
- **Q7. The parts of the middle**: which plan, review and assembly instruments run at each
  stage, how many review rounds, which perspectives in the holistic review. Lessons in §9.

## 4. Assumptions this seat made, and how each stands

| # | Assumption | Status |
| --- | --- | --- |
| A1 | A deviation in the middle adds an owner touch ("surprises reach me at once") | Withdrawn: the checkpoints are fixed; this is Q2 |
| A2 | Approval after a long plan review "pauses and resumes" and still counts as one touch | Withdrawn: a counting device for A1's framing |
| A3 | "No preference" on the seat's questions licensed adopting its proposals as working defaults | Withdrawn: nothing was adopted; the questions stay open |
| A4 | The design is bound by today's open pull requests and the work-in-progress limit (a card said "the seat's one open-PR slot is held") | Withdrawn: the process is independent of existing PRs; limits are Q5 |
| A5 | The first version runs single-PR work only | Withdrawn to Q3 |
| A6 | The cloud merge runs as a review-triggered GitHub Actions job | Withdrawn to a candidate under Q4 |
| A7 | The "recently merged report" was PR 384 (Alex Ward's team-of-one pipeline) | Wrong: the merged report is the lights-on comparison; PR 384 is open and is further evidence |
| A8 | The restated request could carry design choices in the owner's voice | Withdrawn: §2 now carries only the owner's decisions |
| A9 | The owner's approval is recorded as the ratification stamp on a plan node | Open: a strong fit with the plan estate (§5), not decided |
| A10 | A run's state is read from records any seat can see, never from an agent's say-so | Open: strong estate warrant (§9), not decided |

## 5. What the estate already has, stage by stage

No stage is wholly missing; most of the process is a composition of existing machinery. The
gap column is what is not there today, not a decision to build it.

| Stage | Existing machinery | Not there today |
| --- | --- | --- |
| Initiation and refinement | `concept-exploration`, `parallax`, `parallax-frame`, `proportionality`, `reason`, `metacognition`, `user-value`, `specify`, `cricket`; PDR-103's GOAL · IN · OUT | One entry point; a fixed composition order ending in a plan |
| Plan | `plan` skill and its size contract; PDR-132 clause 5 (steps sliced to PR-shaped units at authoring); PDR-093 (each deliverable states what it consumes and "how the gate breaks if the predecessor drifted"); `specify-connection` for interfaces; `ticket-management` | Piece interfaces and dependencies as data |
| Plan review | PDR-123 design-panel protocol; `assumptions-expert` (ADR-146); the four architecture lenses; `parallax-audit`; anti-deference briefs | A fixed panel and brief for this process |
| Acceptance-criteria approval | Plan-node estate (ADR-216): born-sketch, the ratification stamp, delivery criteria with typed proofs (`repo-safe` or `owner-held`), user groups and value; the definition of delivery; `assess-specification` | The form of the approval checkpoint |
| Pieces | Agent worktree isolation; `agent-tools` `spawn`; `set-up-worktree-lane`; the Implementer role (PDR-117); TDD doctrine; the `commit` skill | A piece brief for unattended agents |
| Piece review | `invoke-code-experts` roster; PDR-122 (atomic judgement, deterministic aggregation, conserve by default); PR-side per-finding dispositions in `agent-tools` `pr-tally` | A pre-PR review loop with its own record of how each finding was handled |
| Assembly | `specify-connection`; the definition of delivery's rule that interdependent surfaces are one unit and "deliver together or not at all"; the CI gates | An integration step with an interface check |
| Holistic review | `user-value` (assess mode), `proportionality`, code-expert and specialists, `docs-adr-expert`, `release-readiness-expert`, `parallax-audit`, cross-vendor legs (`sif`, `codex-helper`) | A fixed perspective set; a per-criterion check of the evidence (lights-on's held / not held / not provable) |
| PR, assessment, evaluation | `pr-lifecycle` and its review-round state machine; PDR-128; PDR-131 (settled-READY); `agent-tools` `merge-bot`, `pr-watch`, `pr-tally` | A summary built for the owner's final check |
| Final check and merge | Cards; standing merge doctrine; `merge-bot` (local only); the upstream carrier's Actions token minting | A cloud merge path (Q4) |
| Done | Definition of delivery; plan archival; `wrap` | A done check (`plan assert-complete` was proposed in a backlog plan and is not built) |
| State of a run | PDR-118 (derive, do not author); ADR-212; `pr-watch`; the Workflow tool's live view; a Claude Code project's thread overview (§7) | A read of a run's stage |
| Learning | `retrospective`, `parallax-learn`, PDR-130, napkin, `consolidate-docs` | A per-run retrospective shape |
| Orchestration | The Workflow tool; `agent-tools` `workflow-build`; `corpus-analysis` as a worked multi-stage pipeline | — |

On defining it: the capability-landing procedure places a multi-step procedure in a skill
(with evals) and zero-context enforcement in a validator or hook. On starting it: the Claude
Code Workflow tool counts the invocation of a skill whose instructions call that tool as the
owner's opt-in to multi-agent orchestration, and a Workflow-tool run takes no input mid-run,
so each owner checkpoint ends one automated stretch and starts the next.

## 6. Rules and the workflow's parameters

The owner's direction (§1, item 7) meets one estate rule head-on:
`rules-have-no-exceptions` reads a misfit as "evidence the rule is incomplete", cured by
improving the rule's statement, never by an exception. So a tunable limit would be stated in
the rule as a parameter of an operating context: normal operations keep today's values, and
this workflow's definition sets its own, with a reason, tuned through the Practice's learning
path (PDR-130).

Candidates, with the purpose each serves in normal operations:

| Limit in normal operations | Its purpose there |
| --- | --- |
| Open-PR (work-in-progress) limit: no more than the implementer seats; one for a lone seat (`pr-lifecycle`) | Bound unlanded work across many seats |
| Small-PR bands, ~5 / 10 / 20 files (`design-work-for-small-prs`) | Keep reviewer-comment complexity low |
| Review-round budgets (PDR-132) and settlement-push budgets (PDR-140) | Make non-convergence visible early |
| Fan-out cost controls: a pilot per phase, design review above ~500k tokens, the owner pricing each fleet ([fleet-design rule](../../rules/fleet-design-review-before-expensive-fleets.md)) | Stop unpriced agent spend |
| Seat coordination: claims, commit queue, heartbeats, the Director role | Stop seats colliding on a shared checkout |

The owner named the first and fourth kinds (PR limits, token limits). Whether the others are
in scope, and what values the workflow starts with, is Q5. Rules whose purpose is
correctness, safety, authority or knowledge (the principles, TDD, quality gates, secret
scans, bot identity, owner-attention cards, conserve-by-default, the learning loop) are not
candidates.

## 7. One PR or a project: what Claude Code projects are

From Anthropic's [Projects page](https://code.claude.com/docs/en/claude-projects.md), read
first-hand on 2026-11-07 for its availability note, its fit list and its table of what
threads load; the rest through a lookup agent.

- In Claude Code on the web, desktop and mobile, a **project** is a coordinating conversation
  that starts and tracks cloud **threads**, each its own cloud session that opens its own PR
  and watches it; an overview groups threads as ready for review, waiting on the user, or
  working. The page names "a build or migration bigger than a session" as a fit. It is a
  public beta on Pro, Max and Ultra plans, for one user, and absent from the terminal and
  from Team and Enterprise plans.
- Threads load each repository's root `CLAUDE.md` and `.claude/rules/`, but **not** its
  skills, `.mcp.json`, or `.claude/settings.json` permissions and hooks. The page's remedies:
  enable skills on the user's claude.ai account, and for hooks, "run the thread on your own
  computer" through Remote Control.
- The CLI has no project object; a project there is a working directory.

Bearing on Q3: a project's shape (one coordinating conversation, one thread and one PR per
piece, a built-in overview) resembles a multi-PR run of the workflow. Running the Practice in
threads would mean doing without its hooks in the cloud, or running threads on the owner's
computer, which conflicts with the cloud requirement.

## 8. End to end in the cloud: constraints and candidate routes

**Constraints.** Every agent write on GitHub uses the bot
(`bot-identity-on-third-party-systems`: "exceptions are by user permission only and generally
must only be instigated by the user"; a missing bot capability is "a blocker to surface,
never a licence"). The merge bot cannot run in a cloud session: it needs a machine-local
private key and an untracked per-checkout config
([cloud environment](../../claude-harness-integrations/cloud-environment.md)). The cloud
environment injects secrets as request headers through its network proxy and never exposes
them inside the session, so the bot's key cannot sign a token request there. The rule's
action map already permits one write under the owner's credential: a PR review.

**Candidate routes**, none verified:

- **Mint the bot token in GitHub Actions**, where the key can live as a repository secret; the
  upstream-carrier workflow already does this with `actions/create-github-app-token`. A job
  triggered by the run (for example by the owner's approving review at the final checkpoint)
  would make the bot's writes, including the merge. The GitHub event mechanics were not read:
  `docs.github.com` is outside this session's allowed hosts.
- **A dedicated bot account** whose token the cloud environment injects as a header for
  GitHub's API host: a different identity model from today's GitHub App.
- **Distinguishing sessions** where no bot route exists: a declared map of each GitHub write
  the workflow makes, the credential it uses and why; a cloud session is detectable by the
  estate's cloud-environment classification.

## 9. Lessons from the estate's own history

Rows marked *n = 1* rest on a single instance.

| Lesson | Source | Bears on |
| --- | --- | --- |
| "Merged code is not delivery"; "The seats merged 235 pull requests across both estates" in five days, yet "nine of the exchange's twenty-one owed stories were whole" | [Definition of delivery](../../directives/definition-of-delivery.md); [retrospective](../../reports/agentic-engineering/why-five-days-of-landings-closed-nine-stories-2026-09-29.md) | Done (Q6) |
| The ratification stamp "records that the owner has seen and blessed the plan's shape"; a delivery node's "resolution criteria with typed proofs are the acceptance-criteria contract" | [Plan-node schema](../../plans/plan-node-schema.md); [panel decision](../plan-estate-remediation-node-decision-2026-08-31.md) | The approval checkpoint (A9) |
| "Execution state is never a durable repository field"; lights-on: "No agent writes progress"; a workstream-brief state surface was built and retired | Plan-node schema; [lights-on comparison](../practice-nature-and-lights-on-comparison-2026-10-22.md); [state surfaces](operational-awareness-and-state-surfaces.md) | State of a run (Q6, A10) |
| "fan out to verify, stay serial and first-hand to execute"; coordination helps decomposable work and harms sequential work; seven agents given one prompt herded, *n = 1* | [Fleet topologies](../../reports/agentic-engineering/fleet-topologies-history-and-designs-2026-08-05.md); [adaptive capacities](../agent-capacities-2026-09-09/report.md); [experiment](../../analysis/team-self-organisation-experiment-2026-05-14.md) | Parallel pieces (Q7) |
| Two rounds is a healthy review; "the cure is the exception"; PR #570 ran ten rounds, *n = 1*; review happens "inside the frame it is handed" | PDR-132; PDR-140; [convergence](../review-loop-convergence-concept-exploration-2026-07.md); [retrospective](../../reports/agentic-engineering/why-two-expert-reviews-hardened-a-mechanism-that-should-not-exist-2026-09-20.md) | Review loops (Q7) |
| PR 336: "roughly half of all rounds were echoes of the previous round's own additions", *n = 1*; review before the push | [Assessment](../../reports/agentic-engineering/pr336-fleet-assessment-and-review-treadmill-2026-07-13.md) | Review placement (Q7) |
| "Sixteen of nineteen prior-kept mechanisms recurred within four weeks of the run that kept them"; "a rule that fires after the fact is a story, not a guard" | [Retrospective](../../reports/agentic-engineering/why-written-lessons-kept-needing-the-owner-2026-09-16.md) | Defining the workflow (Q6) |
| The Practice's value stream "stops at delivery" and is "a link, not a loop" | [DORA comparison](../dora-2025-and-the-practice.comparison.md) | Learning across runs |
| A 45-agent review net cost ~5.2M output tokens for one PR; its report says to spend such a net "at a merge gate" and not "in an inner loop" | [Methodology](../../reports/agentic-engineering/multi-agent-review-methodology-2026-08-09.md) | Token parameters (Q5) |
| "Build the simplest thing that works, ship it, then let real friction … drive the next increment" | `scope-from-goal-before-approach` | How to start building it |

**Two systems built outside the estate have a similar shape.** Gojko Adzic's lights-on
factory interviews the user, stops twice for approval, then runs unattended with a derived
run record and a final stage that tries to refute each step's claim. Alex Ward's team-of-one
pipeline, compared with the Practice in
[PR 384](https://github.com/EngraphCode/open-curriculum-ecosystem/pull/384) (open), keeps the
human at intent and merge ("Three agents in the middle. Me at both ends."), treats the ticket
as the contract ("If a decision only exists in chat, it doesn't exist."), refuses to start
without acceptance criteria, walks the acceptance list item by item, and counts a verdict only
for the current plan revision ("so a late verdict on a stale plan does nothing."); its agents
are distinct identities, where the owner's workflow runs on Practice norms.

## 10. The owner's words, verbatim

**The request (2026-11-07):**

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

**Answers to the first questions (2026-11-07):**

- "This is not an adjustment to the general workforce nor a new rule for wide application,
  this is a new workflow, we need to give it a memorable name, and within that workflow there
  are two or three touch points for me depending on how one counts: initiation, acceptance
  criteria approval, final sense check just before merge. The entire middle part is fully
  automated with appropriate checks and reviews, similar to the recently merged report on an
  automated agentic development system, but using Practice standards and norms instead of
  distinct agent identifies"
- "That is one of the questions to explore, should the workflow identify one PR work vs larger
  projects, and if and how that potentially relates to the Claude Code concept of projects"
- "As part of the workflow, an important part, is turning my suggestions into structured plans
  with multiple structured reviews during refinement and implementation, I think I should
  provide the idea. Please also step back and question where we should and should not apply
  normal rules, the default is always that all rules applies, and strict everywhere all the
  time still applies, but previous PR limits and token limits taken from normal operations
  should be tunable as part of defining how the this workflow works and is improved"
- "We need this to work end to end in cloud sessions, so how do we make that possible with bot
  credentials, and if it isn't how do we distinguish these sessions so it's clear when using my
  credentials is appropriate?"

**Second questions:** "No preference" on all four (name, rules stance, sizing, cloud merge).

**Correction (2026-11-07):** "The number of check points in the workflow will be fixed, we
are designing a process. That process has nothing to do with the existing PRs. You are making
all kinds of assumptions, so, much, fluent and incorrect momentum. Step back and use the
cognitive skills to reassess"

## 11. Session record (dated observations, 2026-11-07)

- **Method**: thorough grounding; a Parallax inquiry with three reader legs over reports,
  research and decision records (469,822 tokens), a cold framing pass that saw only the
  owner's words (90,819 of those), three reviews of the first revision
  (`docs-adr-expert`, `prose-expert`, an adversarial `assumptions-expert` audit; 279,332
  tokens), and a documentation lookup on Claude Code projects (156,938 tokens).
- **Quotation discipline**: four reader-leg paraphrases presented as verbatim were caught by a
  fixed-string check against their sources; every quotation here has been checked the same way.
- **What went wrong, and its generator**: the seat ran a design conversation as a delivery
  lane. The estate's delivery rules (open a PR, wait for CI, card decisions, proceed on
  confidence) each fired correctly in isolation and together supplied momentum the design did
  not ask for: an owner touch added for deviations, the design tied to today's open PRs,
  "No preference" read as licence to adopt the seat's proposals, design choices written into
  the owner's request, and the owner's premise "corrected" from an assumption (§4). The
  owner's correction named it: "fluent and incorrect momentum". Revision 3 separates the
  process from this session's artefacts and from current operations, and moves every
  undecided choice to §3.
