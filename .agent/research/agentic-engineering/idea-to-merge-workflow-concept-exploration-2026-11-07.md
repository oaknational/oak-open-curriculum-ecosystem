# An idea-to-merge delivery workflow: concept exploration and the improved request

**Date**: 2026-11-07 · **Seat**: Juniper seeks Pollen (Claude Code cloud session, solo) ·
**Status**: provisional; revision 2, after two rounds of the owner's answers. The working
defaults in §2 are confirmed when the owner ratifies the trial's plan.

**What you need to do:** give the trial its idea. §1 is the request as it now stands; §2
records your answers and the working defaults; the rest of the note is the evidence.

## 1. The improved request

Working name **Bookends**, pending the owner's choice (§2, Q1): the owner at both ends, the
agents in the middle.

> I want a new, named OCE workflow that turns an idea of mine into merged work that delivers
> its intended outcomes. It is a workflow, not a change to how the rest of the estate works.
> I touch it at three moments: when I start it with the idea, when I approve the reviewed plan
> and its acceptance criteria, and when I sense-check the pull request just before merge.
> Everything between is fully automated, with structured reviews at every stage, run on the
> Practice's own standards, skills and reviewers rather than on separate agent identities.
> It runs end to end in a cloud session. When it ends, every acceptance criterion I approved
> has its evidence.

The detail:

> **Outcome.** I give the workflow an idea and the outcomes I want. I get back merged work on
> the default branch that says who benefits. Every criterion the repository can prove passes
> on the merged code; a criterion only an outside system can show (a deployment, a dashboard)
> names who verifies it and where. Between my touch-points the agents work unattended within
> the cost I approved, and anyone can see where the run stands.
>
> **Touch-point 1: initiation.** I give the idea. Agents flesh it out, challenge it and refine
> it with me in conversation, then turn it into a structured plan: the definition of done
> (the goal; who benefits and what each group gets; scope and non-goals; acceptance criteria,
> each with a named proof), the size of the run, the split into pieces with their interfaces,
> and the estimated cost.
>
> **Touch-point 2: approval.** Reviewers with distinct lenses review and improve the plan,
> one of them asked whether each part should exist at all. I approve the reviewed plan and
> its acceptance criteria, with the reviewers' verdicts and the cost estimate in front of me.
> My approval is the ratification stamp on the run's plan node.
>
> **Touch-point 3: pre-merge sense check.** One card with a one-screen summary for an exact
> commit: each acceptance criterion against its evidence; the holistic review's verdicts and
> what was done with each finding; remaining risks; cost against budget; and what was left
> out. I answer merge, or not yet with a reason. Any later push voids my answer, and the agent
> merges only after it.
>
> **Surprises reach me at once.** The run stops and asks me if the evidence shows that what I
> approved is wrong: a criterion cannot be met, would cause harm or misses the point; the
> scope must change; behaviour a beneficiary will see must change; the cost will exceed what I
> approved; or a review loop uses up its rounds without converging. Each such stop is recorded
> as a flaw in the workflow to fix. Changes inside what I approved go ahead and appear in the
> pre-merge summary.
>
> **The automated middle.**
>
> - **Pieces.** Each piece is planned in detail and built test-first in its own worktree, in
>   parallel where pieces are genuinely independent. Reviewers who did not write it review it
>   for a fixed number of rounds. Each finding is fixed, rejected with evidence, or logged for
>   separate follow-up.
> - **Assembly.** The pieces are integrated and every interface is checked.
> - **Holistic review.** The assembled whole is reviewed from user value; value over ceremony;
>   engineering excellence; Practice alignment; and any further perspective the change calls
>   for. A final reviewer walks every acceptance criterion and tries to disprove its evidence.
> - **PR.** Opened with a description built from the evidence. CI and the review conversation
>   settle under the PR lifecycle discipline. Then my card.
> - **Merge and close.** After my word the agent merges, checks the merged state and closes
>   the run.
>
> **Its own operating limits.** Every Practice rule applies to the workflow, strictly. The
> limits that normal operations set for their own conditions (how many PRs may be open, PR
> size bands, review-round budgets, token thresholds) are the workflow's parameters: its
> definition sets them, each with its reason, and its retrospectives tune them.
>
> **Each run teaches the next.** At close, a short retrospective records what each stage's
> review found that mattered, where a stage added little, the cost of each stage, and every
> time I was needed outside the three touch-points, with the cause. Changes to the workflow
> and its parameters go through the Practice's normal learning path.
>
> **Defined, started, observed, finished.**
>
> - **Defined** once, so a second run follows the same definition without re-deriving it.
> - **Started** from one entry point that I invoke with my idea. It sizes the run, and refuses
>   to start building from a plan whose approval or acceptance criteria are missing.
> - **Observed**: at any moment I or any agent can see which stage a run is in, from records
>   any seat can read, never from an agent's say-so.
> - **Finished** when shown, not claimed: each criterion's evidence is checked, the plan is
>   closed with its record, and the retrospective is written.
>
> **First, a trial** on an idea I provide, joining up the existing skills and reviewers by
> hand and measuring every stage; during the trial the stage and finish checks are made by
> hand against the same records. Build only what the trial shows is missing.

## 2. Your answers and the open questions

### Answers, round 1 (owner, 2026-11-07, verbatim)

- On the pre-merge check: "This is not an adjustment to the general workforce nor a new rule
  for wide application, this is a new workflow, we need to give it a memorable name, and
  within that workflow there are two or three touch points for me depending on how one counts:
  initiation, acceptance criteria approval, final sense check just before merge. The entire
  middle part is fully automated with appropriate checks and reviews, similar to the recently
  merged report on an automated agentic development system, but using Practice standards and
  norms instead of distinct agent identifies"
- On ideas larger than one PR: "That is one of the questions to explore, should the workflow
  identify one PR work vs larger projects, and if and how that potentially relates to the
  Claude Code concept of projects"
- On the trial idea: "As part of the workflow, an important part, is turning my suggestions
  into structured plans with multiple structured reviews during refinement and
  implementation, I think I should provide the idea. Please also step back and question where
  we should and should not apply normal rules, the default is always that all rules applies,
  and strict everywhere all the time still applies, but previous PR limits and token limits
  taken from normal operations should be tunable as part of defining how the this workflow
  works and is improved"
- On merging from a cloud session: "We need this to work end to end in cloud sessions, so how
  do we make that possible with bot credentials, and if it isn't how do we distinguish these
  sessions so it's clear when using my credentials is appropriate?"

What follows from them: §1 now names three touch-points and an automated middle; the
pre-merge check is part of this workflow by design, so the note no longer frames it as a gate
to retire; the owner provides the trial idea. The report on the automated system (Alex Ward's
team-of-one pipeline) is in [PR 384](https://github.com/EngraphCode/open-curriculum-ecosystem/pull/384),
which was open and unmerged when this revision was written. §§3 to 5 answer the three
explorations the owner asked for.

### Open questions, round 2

Each has a proposed answer; nothing is decided until the owner replies.

- **Q1. The name.** Proposed: **Bookends**, for the shape (the owner at both ends, the agents
  in the middle); unused anywhere in the Practice surfaces. Others considered: Errand, Sortie,
  Commission (the last already reads as a verb across the estate).
- **Q2. The rules stance in §3.** Proposed: adopt it. Every rule holds; five named limits
  become the workflow's parameters, each set in its definition with a reason. The doctrine
  change that makes this lawful (one statement, not exceptions) is drafted for the owner's
  ratification after the trial.
- **Q3. Sizing (§4).** Proposed: the entry point sizes each run as a single-PR run or a
  multi-PR run. The trial is a single-PR run. Multi-PR runs wait until Claude Code projects
  can carry the Practice's hooks and skills, or until the gap is closed another way.
- **Q4. Cloud merge (§5).** Proposed: your card answer is recorded as an approving PR review
  pinned to the head commit, under your credential (a row the bot-identity rule already
  permits), and a GitHub Actions job mints the bot's token and merges as the bot. To build
  and verify before the trial's merge.
- **Q5. The stop list in §1 ("Surprises reach me at once").** Proposed: adopt it as written.

### Answers, round 2 (owner, 2026-11-07)

The owner answered "No preference" to Q1 to Q4; Q5 was not put as a card. The proposals
therefore stand as working defaults: the name Bookends; all five limits in §3 as the
workflow's parameters, with the doctrine wording drafted for ratification after the trial;
single-PR runs first; the review-triggered Actions merge, built and verified before the
trial's merge; the stop list as written. None of them is irreversible yet, and each is
confirmed or changed when the owner ratifies the trial's plan node.

## 3. Which rules hold, and which become the workflow's parameters

The owner's ruling sets the frame: every rule applies and strictness holds; the limits that
normal operations calibrated for their own conditions are tunable. The estate forbids
carving exceptions into rules (`rules-have-no-exceptions`: a misfit is "evidence the rule is
incomplete", cured by improving its statement). So the change is to the rules' statements,
not to their reach: each limit below becomes a parameter whose value belongs to an operating
context. Normal operations keep today's values; a ratified workflow definition declares its
own, with a reason, tuned through the Practice's learning path (PDR-130).

The test for a parameter: the rule's own text says its number manages a resource (open work,
reviewer attention, spend) under normal multi-seat conditions, and the workflow supplies a
control for the same purpose.

| Limit in normal operations | Its purpose there | In a Bookends run |
| --- | --- | --- |
| WIP limit: open PRs no more than the implementer seats, one for a lone seat (`pr-lifecycle`, owner 2026-09-26) | Bound unlanded work across many seats | Parameter. The run's plan declares its open-PR count (one for a single-PR run) and the workflow declares how many runs may be live at once |
| Small-PR bands, ~5 / 10 / 20 files (`design-work-for-small-prs`) | Keep reviewer-comment complexity low | Parameter, default unchanged. Pieces are reviewed before the PR exists, so a run may justify a different band in its approved plan; the owner's one-screen check is the counterweight that keeps it small |
| Review-round budgets: two healthy, a third raises the generator question (PDR-132); a settlement-push budget (PDR-140) | Make non-convergence visible early | Parameter for the pre-PR loops (set in the plan); the PR-level defaults hold until a run's evidence says otherwise |
| Fan-out cost controls: a pilot leg per phase, design review above ~500k tokens, the owner prices each fleet (fleet-design rule) | Stop unpriced agent spend | Parameter. The owner prices the whole run once, at approval; the design review of the run's fan-out is part of plan review; measured stage costs from earlier runs replace the per-launch pilot |
| Seat coordination: claims, commit queue, comms heartbeats, the Director role | Stop seats colliding on a shared checkout | Parameter of shape. A run's internal agents are sub-agents in isolated worktrees, not seats; the run registers one claim as a whole |

Everything else holds unchanged, among it: the principles; TDD; quality gates never disabled;
CI as the cloud gate; never committing to the default branch; the secret scans; the push
cadence (a push waits for the previous head's required check); the bot-identity rule (hence
§5); blocking asks as cards and the stop on a refuted premise; conserve-by-default for
discards; review triage; derived state over authored state; no prompts in unattended seats;
the learning loop.

## 4. One PR or a project

The owner asked whether the workflow should tell single-PR work from larger projects, and how
that relates to Claude Code's projects. Facts, from Anthropic's documentation as read on
2026-11-07: the [Projects page](https://code.claude.com/docs/en/claude-projects.md) (its
availability note, its fit list and its table of what threads load were read first-hand by
this seat), and through a lookup agent, the pages on
[cloud sessions](https://code.claude.com/docs/en/claude-code-on-the-web.md) and
[workflows](https://code.claude.com/docs/en/workflows.md).

- In Claude Code on the web, desktop and mobile, a **project** is a coordinating conversation
  that starts and tracks cloud **threads**, each its own cloud session that opens its own PR
  and watches it. An overview groups threads as ready for review, waiting on the user, or
  working. The documentation names "a build or migration bigger than a session" as a fit. It
  is a public beta on Pro, Max and Ultra plans, for one user, and absent from the terminal and
  from Team and Enterprise plans.
- Threads start with the project's instructions, repositories, files, cloud environment,
  connectors and plugins, and a project memory file. They load each repository's root
  `CLAUDE.md` and `.claude/rules/`, but **not** its skills, `.mcp.json`, or
  `.claude/settings.json` permissions and hooks. The page's remedies: skills are enabled on
  the user's claude.ai account instead, and for hooks, "run the thread on your own computer"
  through Remote Control.
- The CLI has no project object; a project is a working directory. A Workflow-tool run takes
  no input mid-run, so an owner touch-point between stages ends one workflow and starts the
  next.

What this means for the workflow:

- **A single-PR run fits one cloud session**: the conversation carries touch-points 1 and 2,
  sub-agents in worktrees and Workflow-tool fan-outs carry the middle, and touch-point 3 is a
  card in the same session.
- **A multi-PR run maps naturally onto a project**: the project conversation holds the plan
  and the touch-points, each piece is a thread with its own PR, and the overview is a ready
  view of the run's state. Two gaps block it today. Threads would run without the Practice's
  hooks (the content and command guards), and the documented remedy, running the thread on
  the owner's computer, breaks the requirement that a run work end to end in the cloud. Its
  skills would not load as skills unless enabled on the owner's account (a thread can still
  read a skill's canonical file, as non-loader platforms do). And the run's open
  PRs need a merge shape: pieces landing dark behind a flag with the owner's check gating
  the release, or a series held for one check, which the run's WIP parameter (§3) would have
  to allow.
- So the entry point sizes the run first, and the first version runs single-PR work only.

## 5. End to end in a cloud session

The constraint: every agent write on GitHub uses the bot (`bot-identity-on-third-party-systems`;
"exceptions are by user permission only and generally must only be instigated by the user").
The merge bot cannot run in a cloud session: it needs a machine-local private key and an
untracked per-checkout config ([cloud environment](../../claude-harness-integrations/cloud-environment.md)).
The cloud environment's secrets are injected by its network proxy as request headers and are
never readable inside the session, so the bot's private key cannot be used there to sign the
token request. This session's own PR (389) was therefore opened under the owner's credential,
as PR 384 was; the cloud environment document records that as a gap, "never a practice to
normalise".

**A path with bot credentials.** The bot's token can be minted where its key already lives:
in GitHub Actions. The repository's upstream-carrier workflow already mints the bot's app
token from repository secrets (`actions/create-github-app-token`). So:

1. At touch-point 3 the owner answers the card. The seat records the answer as an approving
   PR review naming the head commit, under the owner's credential. The bot-identity rule's
   action map already permits exactly this row (a PR review under the operator's own
   credential), and here the owner's card answer instigates it.
2. A workflow triggered by that review checks that the reviewer is the owner, that the
   review's commit is the PR's head, and that the PR is settled; it then mints the bot token
   and merges as the bot with a merge commit.
3. The review is the commit-pinned approval record the earlier revision lacked: a push after
   it leaves the review on an older commit, and the merge job refuses.

Unverified here: the GitHub event and payload mechanics behind steps 2 and 3 (that a review
by a user credential triggers a workflow with access to repository secrets, and that the
payload carries the review's state, author and commit). `docs.github.com` is outside this
session's allowed network hosts, so they were not read; the first build step verifies them.
No workflow in the repository triggers on reviews today.

The same pattern can carry the run's other GitHub writes (comments, thread resolutions) as
bot actions triggered by the run, so that a cloud run's writes are all bot writes except the
branch push and draft PR the cloud harness makes under its configured credential.

**Telling sessions apart, where no bot path exists.** The rule already draws the line: the
owner's credential is right for the action map's rows and for acts the owner instigates, and
a missing bot capability is "a blocker to surface, never a licence". For this workflow that
becomes a per-run credential map, declared in its definition: each GitHub write a run makes,
the credential it uses, and why. A cloud session is detectable mechanically (the estate's
cloud-environment classification), so the map can say which rows apply in the cloud, and any
write with no bot path there stops the run with a card rather than falling back silently.

## 6. The request as given

The owner, 2026-11-07, verbatim:

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

The same message continued:

> Consider how we define the workflow, how we start it, how we know what the current state of
> a specific instance is, and how we know when we are done.

## 7. What changed, and why

§1 keeps the owner's order: the plan is drafted and reviewed before approval, and pieces are
planned in detail after it. Rows marked *n = 1* rest on a single instance.

| # | Change | Why | What would show it wrong |
| --- | --- | --- | --- |
| R1 | "Done" moves from merged to every criterion evidenced; repository-provable criteria on the merged code, others with a named verifier | "Merged code is not delivery" ([definition of delivery](../../directives/definition-of-delivery.md)). "The seats merged 235 pull requests across both estates" in five days, yet "nine of the exchange's twenty-one owed stories were whole" ([retrospective](../../reports/agentic-engineering/why-five-days-of-landings-closed-nine-stories-2026-09-29.md)). The plan estate never records deployment state ([plan-node schema](../../plans/plan-node-schema.md)) | Across trials every criterion is trivially met at merge and the post-merge check never finds anything |
| R2 | The approval is the ratification stamp on the reviewed plan | The stamp "records that the owner has seen and blessed the plan's shape"; a 2026-08-31 panel found the delivery node's "resolution criteria with typed proofs are the acceptance-criteria contract" ([decision](../plan-estate-remediation-node-decision-2026-08-31.md)) | The node cannot carry the split and cost without contortion: amend the schema through its owner, never a parallel format |
| R3 | A run's state is read from records, never authored | The schema: "Execution state is never a durable repository field"; PDR-118, derive do not author; lights-on: "No agent writes progress" ([comparison](../practice-nature-and-lights-on-comparison-2026-10-22.md)); a workstream-brief state surface was built and retired ([state surfaces](operational-awareness-and-state-surfaces.md)) | A stage question can only be answered from an agent's memory: that one fact earns a validated anchor (PDR-118 §3), not a status file |
| R4 | Three touch-points hold when nothing goes wrong; a finding that refutes the approval stops the run | Evidence refuting an owner-approved premise is an owner-class action moment ([owner-attention rule](../../rules/owner-attention-at-action-moments.md)); PDR-084 classes each owner touch as an owner-only decision or a missing autonomy primitive | Most trial runs stop for the owner: shaping is under-powered, and the cure goes there |
| R5 | The pre-merge check is part of this workflow by design, pinned to a commit and fed a one-screen summary | The owner's word (§2); the merge doctrine provides for it: green and clean PRs "don't wait on me unless I explicitly say so" (owner, 2026-09-03, [pr-lifecycle](../../skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md)); PDR-128: the owner should not chase thread state | The summary repeatedly misleads the owner's check: the summary's construction is at fault |
| R6 | Parallel build only where pieces are independent; review always independent | "fan out to verify, stay serial and first-hand to execute" ([fleet topologies](../../reports/agentic-engineering/fleet-topologies-history-and-designs-2026-08-05.md)); coordination helps decomposable work and harms sequential work ([adaptive capacities](../agent-capacities-2026-09-09/report.md)); seven agents given one prompt herded, *n = 1* ([experiment](../../analysis/team-self-organisation-experiment-2026-05-14.md)) | The trial shows near-zero conflict at assembly: widen parallel build |
| R7 | Every review loop has a round budget, an outcome for each finding and an exit, and one reviewer challenges existence | PDR-132 and PDR-140 ("the cure is the exception"); PR #570 ran ten rounds, *n = 1* ([convergence](../review-loop-convergence-concept-exploration-2026-07.md)); review "inside the frame it is handed" ([retrospective](../../reports/agentic-engineering/why-two-expert-reviews-hardened-a-mechanism-that-should-not-exist-2026-09-20.md)) | A stage's review finds nothing material across several runs: slim it, never below one meaningful review |
| R8 | Review moves before the push; bots get the residue | PR 336: "roughly half of all rounds were echoes of the previous round's own additions", *n = 1* ([assessment](../../reports/agentic-engineering/pr336-fleet-assessment-and-review-treadmill-2026-07-13.md)) | Pre-push review does not reduce PR rounds in the trial |
| R9 | The entry point sizes each run; the first version runs single-PR work | §4: Claude Code project threads load neither skills nor hooks; [small-PR bands](../../rules/design-work-for-small-prs.md); PDR-132 clause 7, one story in one PR | Real ideas routinely need more than one PR before multi-PR runs are possible |
| R10 | Reuse means a second run needs no re-derivation; how much to script follows the trial | "Sixteen of nineteen prior-kept mechanisms recurred within four weeks of the run that kept them"; "a rule that fires after the fact is a story, not a guard" ([retrospective](../../reports/agentic-engineering/why-written-lessons-kept-needing-the-owner-2026-09-16.md)) | A seat following a written definition runs the trial cheaply and faithfully: script less |
| R11 | Each run closes with a retrospective that measures each stage | The Practice's value stream "stops at delivery" and is "a link, not a loop" ([DORA comparison](../dora-2025-and-the-practice.comparison.md)) | Retrospectives change nothing across several runs: shrink them |
| R12 | Normal-operations limits become the workflow's parameters (§3), stated in the rules, never as exceptions | The owner's ruling (§2); `rules-have-no-exceptions`; the [fleet-design rule](../../rules/fleet-design-review-before-expensive-fleets.md)'s purpose is priced spend, which the run's approved budget supplies | A run's parameter is used to skip a purpose rather than serve it: the parameter is mis-set |
| R13 | Trial before engine | The `reason` skill's direct-trial gate; scope-from-goal: "Build the simplest thing that works, ship it, then let real friction … drive the next increment" | Hand composition proves too costly: that names the first thing to script |
| R14 | Cloud merges run as the bot through GitHub Actions, triggered by the owner's commit-pinned approval | §5; the bot-identity rule; the upstream carrier already mints the bot token in Actions | The Actions path cannot be made to trigger or to read the secrets (§5's unverified step) |

## 8. What the estate already has, stage by stage

No stage is wholly missing. The gaps are of two kinds: compositions and briefs that the
workflow's definition itself supplies, and seven instruments that need code (§9).

| Stage | Existing machinery | Gap |
| --- | --- | --- |
| Start | `start-right-*` skills; skills invoked by hand; `agent-tools` `spawn` | One entry point taking an idea; sizing; a refuse-to-start check (proposed by PR 384, §5.1) |
| Initiation | `concept-exploration`, `parallax`, `parallax-frame`, `proportionality`, `reason`, `metacognition`, `user-value`, `specify`, `cricket`; PDR-103's GOAL · IN · OUT | A fixed composition order ending in a drafted plan |
| Plan and split | `plan` skill and its size contract; PDR-132 clause 5; PDR-093 (each deliverable states what it consumes and "how the gate breaks if the predecessor drifted"); `specify-connection` for interfaces; `ticket-management`; one PR per leaf | Piece interfaces and dependencies as data; a test for independence; a cost estimate per stage |
| Plan review | PDR-123 design-panel protocol; `assumptions-expert` (ADR-146); the four architecture lenses; `parallax-audit`; anti-deference briefs; the fleet-design rule's design review | A fixed panel and its brief, including the existence challenger |
| Approval | Plan-node estate (ADR-216): born-sketch, the ratification stamp, delivery criteria with typed proofs (`repo-safe` or `owner-held`), user groups and value, out of scope, expiring `owner_gates`; the definition of delivery; `assess-specification` | Where the split, the cost and the run's parameters sit in the node; the card that collects the stamp |
| Piece build | Agent worktree isolation; `spawn`; `set-up-worktree-lane`; the Implementer role (PDR-117); TDD doctrine; the `commit` skill | A piece brief with a task-id handshake (fleet-design lessons, 2026-08-17) |
| Piece review | `invoke-code-experts` roster; PDR-122; PDR-132; PDR-140; PR-side per-finding dispositions in `agent-tools` `pr-tally` | A pre-push review loop with its own disposition record (proposed 2026-05, not built; its line format can follow `pr-tally`'s; the `fidelity-review` package's register is a different concern) |
| Assembly | `specify-connection`; the definition of delivery's rule that interdependent surfaces are one unit and "deliver together or not at all"; the CI gates | An integration step with an interface check |
| Holistic review | `user-value` (assess mode), `proportionality`, code-expert and specialists, `docs-adr-expert`, `release-readiness-expert`, `parallax-audit`, cross-vendor legs (`sif`, `codex-helper`) | A fixed perspective set with an open slot; a contract walk: one verdict per criterion (met, not met, cannot tell, not applicable with a reason), evidence for every "met" (lights-on's held / not held / not provable; PR 384's proposal 2) |
| PR | `pr-lifecycle`; PDR-128; PDR-131; `agent-tools` `merge-bot`, `pr-watch`, `pr-tally`; the review-cost gate | A generator for the one-screen summary |
| Pre-merge check | Cards (owner-attention rule); PR reviews under the owner's credential (the bot-identity action map) | The commit-pinned approval as a review (§5) |
| Merge | Standing merge doctrine; `merge-bot` (local); the upstream carrier's Actions token minting; PDR-131 auto-merge, armed only after the owner's approval of the head commit; Phase 8 post-merge harvest | A review-triggered Actions merge job (§5) |
| Finish | Definition of delivery; plan archival; `wrap` | A finish check (`plan assert-complete` was proposed in the backlog plan `completion-claim-proof-pipeline` and is not built) |
| Run state | PDR-118; ADR-212; `pr-watch`; the Workflow tool's live view; for multi-PR runs, a Claude Code project's thread overview | A stage read over the plan node, git, the PR, its checks and the evidence |
| Learning | `retrospective`, `parallax-learn`, PDR-130, napkin, `consolidate-docs` | A per-run retrospective shape with per-stage measures and parameter tuning |
| Cost | The fleet-design rule; PDR-122 invariant 4; `agent-tools` `context-cost`, `arc-metrics`, `review-cost`; the Workflow tool's `budget` | A per-stage estimate in the plan; a measured stage-cost table across runs |
| Orchestration | The Workflow tool; `agent-tools` `workflow-build`; `corpus-analysis` as a worked multi-stage pipeline | Whatever the trial shows a seat cannot do reliably by hand |

## 9. Defining, starting, observing and finishing a run

**Defining.** The note commits to no home before the trial. The hypothesis to test: the
capability-landing procedure puts a multi-step procedure in a skill, with evals; so the
definition would be one skill in the Practice corpus, with its parameters (§3) declared in
it, and whichever deterministic parts the trial shows are needed in `agent-tools`. It should
not depend on one agent host (PDR-143, The Practice as a Standalone Entity): "capability
parity, not mechanism parity", in the v0 practice report's words.

**Starting.** One entry point the owner invokes with the idea. The Claude Code Workflow tool's
own conditions count the invocation of a skill whose instructions call that tool as the
owner's opt-in to multi-agent orchestration.

**Observing.** No new state store. Each stage is read from a record any seat can see:

| Stage | Read from |
| --- | --- |
| Initiation | Plan node exists at `status: sketch`, no split yet |
| Plan in review | Plan node at sketch with its split and estimate |
| Approved | Ratification stamp complete |
| Building | The run's draft PR, opened at its branch's first push; piece worktrees are local by design |
| In review | PR ready; checks running or threads unresolved |
| Awaiting the owner | Settled-READY on the head commit; no owner approval review on that commit |
| Approved to merge | An approving review by the owner on the current head commit |
| Merged | PR merged; post-merge checks run |
| Finished | Every repository-provable criterion passes on the merged code; any owner-held criterion's verifier has recorded it; plan archived; retrospective written |
| Stopped | An `owner_gates` entry on the plan node awaiting the owner's decision, with its expiry |

During the trial, the seat reads each stage by hand from these rows.

**Finishing.** Shown from the Finished row, never asserted
(`validators-must-recompute-not-just-record`).

**The seven instruments** the code-shaped gaps in §8 add up to: the entry point with its
sizing and refuse-to-start check; the pre-push review loop with its disposition record; the
contract walk; the one-screen summary; the review-triggered merge job; the stage read with its
finish check; the per-run credential map's enforcement (§5).

**An indicative cost**, priced from this session's measured legs (readers 113k to 134k
tokens, reviewers 56k to 112k, a cold pass 91k), excluding the building agents, which this
session did not measure:

| Path | Legs | Estimate |
| --- | --- | --- |
| Small | Plan review 2 (existence challenger and one lens); serial build; piece review 2; holistic review 3 and the contract walk | About 8 review legs, 0.6M to 1M tokens |
| Standard | Plan review 3; parallel build; piece review 2 per piece for 2 to 3 pieces; holistic review 4 and the contract walk | About 12 to 15 review legs, 0.9M to 2M tokens |

Under §3 the owner prices the run once, at approval; the trial replaces these figures with
measurements.

## 10. The Parallax record

**Depth: standard.** The request is new, spans several scales and admits different frames;
the stakes are moderate and the note is reversible. Three readers and a cold pass ran in
fresh contexts, synthesis stayed with the seat, three reviews ran on the first revision, and
a documentation lookup informed the second.

**Scales.** One piece; one run; many runs over weeks (does the workflow improve?); the
owner's attention over weeks; the estate (open PRs, merge capacity, other seats).

**Frames.** Two protected passes generated frames: the seat's, anchored in the estate, and a
cold pass that saw only the owner's words.

| Frame | Focal question | What it adds |
| --- | --- | --- |
| Attention ledger | What must the owner see, at three moments, to hand over the rest? | The value sits in the plan the owner approves and the summary the owner checks |
| Durable run | How is one run resumed, queried and known finished? | One source of truth; finish shown, not claimed (R3) |
| Assurance case | What evidence justifies merging without reading the diff? | Criterion-to-evidence mapping; reviewer independence; stopping rules (R7) |
| Interfaces, not pieces | Can the work split into independently checkable pieces that still fit? | Interfaces in the plan; some work should not run in parallel (R6) |
| Done is not merge | Did the outcome arrive, and does the workflow improve? | R1, R11 |
| Counterframe: a router, not a pipeline | What is the smallest addition that runs the existing machinery from one entry point, sized to the work? | Most of the request exists (§8); a fixed many-stage pipeline would put maximum ceremony on all work |

The counterframe wins by its own test, in the cold pass's words ("if fewer than two stages
are missing, build the router"): no stage is wholly missing. §1 therefore describes one
entry point over existing machinery, sized at the start, plus the seven instruments of §9.

**Independent evidence.** Two systems built outside this estate have the request's shape.
Alex Ward's team-of-one pipeline, compared with the Practice in PR 384, keeps the human at
intent and merge, in the essay's figure title "Three agents in the middle. Me at both
ends."; its ticket is the contract ("If a decision only exists in chat, it doesn't exist."),
its builder refuses to start without acceptance criteria, its reviewer walks the acceptance
list item by item and fails closed, verdicts count only for the current plan revision ("so a
late verdict on a stale plan does nothing."), and a review loop that hits its cap hands back
to the human. Its agents are distinct identities; the owner's workflow runs on Practice
norms instead. Gojko Adzic's lights-on factory interviews the user, stops twice for approval,
then runs unattended with a derived run record and a refuting final stage. Where they
differ from §1: Ward's human merges; lights-on has no learning loop and no PR stage.

**Cross-scale claims the design relies on.**

- **Piece to run.** Individually reviewed pieces make a sound whole only if their interfaces
  are declared and checked; fails when pieces share hidden state.
- **Run to the owner's check.** A summary that matches what the owner finds shows the check
  is informed; the check itself is part of the workflow by the owner's design.
- **Merged to delivered.** Holds for landed work; released work needs its named verifier.
- **Parameter to purpose.** A tuned limit is sound only while the workflow's replacement
  control serves the same purpose (§3).
- **More agents to more throughput.** Bounded by independence, merge capacity and the run's
  open-PR parameter; reviewers sharing context count for less than their number.

**The owner's terms against the estate's.**

| Owner's term | Estate's term | What changes |
| --- | --- | --- |
| Definition of done and acceptance criteria | Delivery-node acceptance criteria with typed proofs, plus the definition of delivery | "Done" was a producer word; the estate measures delivery to a beneficiary |
| Acceptance criteria approval | The ratification stamp on the reviewed plan | Maps cleanly |
| Pieces | Units inside one delivery node, each built in a worktree | For multi-PR runs, possibly project threads (§4) |
| Assembled PR | One PR, sized by the run's parameter | Multi-PR runs follow §4 |
| Agent merges | The bot, through a review-triggered Actions job | §5 |
| State of an instance | A stage read from records (PDR-118, ADR-212) | No status file |
| Reusable workflow | One named definition a second run follows, with its own parameters | How much to script follows the trial |

**Strength of the evidence.** Mostly this estate's own retrospectives and decision records:
highly relevant, single-estate, written by agents of one model family. Owner words quoted are
primary. Two external systems were reviewed first-hand by earlier seats. The Claude Code
project facts come from Anthropic's documentation through one lookup agent; the GitHub event
mechanics in §5 are unverified. Nothing has measured this workflow, so every change in §7 is
a hypothesis with a stated way to show it wrong.

**Status: provisional.** The evidence supports adopting the request and designing a trial. It
does not support building tooling or amending doctrine; either needs the owner's word.

**What the first trial measures.**

| Indicator | Reading |
| --- | --- |
| Owner touches, planned and unplanned, with causes | Three planned, none unplanned |
| Material findings per stage, against that stage's cost | A stage with no material findings is a slimming candidate |
| Review rounds before and on the PR | Against the run's parameters (§3) |
| Conflict and rework at assembly | How far to parallelise build (R6) |
| Cost per stage against the approved estimate | Replaces §9's indicative figures |
| Lead time from approval to merge | The delivery measure |
| What the owner's check changed, if anything | Calibrates the summary |
| Criteria evidenced at finish | The finish measure (R1) |
| Every GitHub write and its credential | Proves §5's credential map |

Reopen this inquiry when the trial closes, or sooner if the answers to §2 change a frame.

## 11. Proposed next steps

Proposals for the owner to accept, change or refuse.

1. The owner provides the trial idea (the working defaults in §2 stand meanwhile).
2. Before the trial's merge: build and verify the review-triggered merge job (§5), the one
   piece of tooling a cloud run cannot do without. It handles a credential, so its lane takes
   a `security-expert` review alongside the usual reviewers.
3. The trial idea gets its own delivery node, serving the strategic node that idea already
   belongs to; that node is the run's record. No strategic node for the workflow itself until
   the trial earns one.
4. The trial runs by hand composition, recording the measures in §10.
5. After the trial: the doctrine statement that makes §3's parameters lawful, drafted for the
   owner's ratification; the retrospective decides which of the other instruments to build.

## 12. Evidence base

Read for this note by the seat or a reader leg. The legs read about 60 files, most at heading
and targeted-section depth; leg B read nine in full or nearly so.

- **First-hand by the seat**: AGENT.md, `principles.md`, the definition of delivery, the
  plan-node schema and plans README, PDR-117, PDR-118, PDR-122, the `pr-lifecycle` merge
  doctrine, WIP limit and code-owner ruleset paragraph, and the rules on owner attention,
  scope from goal, design from impact, small PRs, one PR per leaf, no parallel long-lived
  branches, fleet design, unattended seats, confident seats, capability landing, rules have
  no exceptions and bot identity; the lights-on comparison §§2–3; `agent-tools/src/pr-tally`;
  the upstream-carrier workflow's token minting; the PR 384 report (§§1, 4 and 5, at its head
  commit of 2026-11-06, not on `engraph`).
- **Reader leg A** (`reports/agentic-engineering/`): merge throughput fell to zero when the
  one merging seat retired; PDR-131's concurrent landing; PR latency's long tail was owner
  availability; the story, not the slice, is the unit; acceptance as a ledger; review before
  the push; bounded convergence; sizing with a stop rule ("within 2 hours as a guide, if the
  estimate hits four we have a problem", owner, 2026-10-03).
- **Reader leg B** (`research/`, `analysis/`, `proposals/`): the lights-on comparison;
  review-loop convergence; fleet-design lessons; closure pressure (agents under-report
  deferrals); coordination efficiency ("Owner action is not a valid cure for anything"); the
  adaptive-capacities report; the DORA comparison; the user-value and specification method
  reviews; an external lifecycle skill pack with a three-cycle review bound.
- **Reader leg C** (decision records): PDR-018, 026, 084, 085, 089, 093, 103, 116, 121, 123,
  128, 130, 131, 132, 136, 140, 143; ADR-204, 212, 216, 146.
- **Cold pass** (no repository reads): the six frames of §10, ten hidden assumptions, and the
  commit-pinned check.
- **Documentation lookup** (round 2): Anthropic's Claude Code documentation on projects, cloud
  sessions, scheduled tasks, sessions, cross-session messaging and workflows.

Relevant and not read: `practice-system-review-2026-10.md`, the fleet-topology adversarial
review and cross-examination, the agentic design-panel protocol report,
`modern-software-architecture-for-long-term-excellence.md`, and GitHub's documentation on
workflow events (outside this session's allowed hosts).

## 13. Session record (dated observations, 2026-11-07)

- **Skills applied**: `start-right-thorough`; `parallax`, with `parallax-frame` run as two
  protected passes and synthesis held by the seat; `proportionality`; `concept-exploration`'s
  loop dynamics; `reason` (direct-trial gate); `metacognition`; `user-value` and `specify` as
  lenses on the definition of done. Reviews of revision 1: `docs-adr-expert`, `prose-expert`
  and an adversarial `assumptions-expert` audit in the Parallax-audit stance.
- **Fan-out cost**: four legs, 469,822 tokens (A 131,775; B 134,236; C 112,992; cold pass
  90,819); reviews 279,332 (`assumptions-expert` 112,432; `prose-expert` 111,309;
  `docs-adr-expert` 55,591); the round-2 documentation lookup 156,938.
- **The cold pass cost 90,819 tokens with no repository reads**, against 112,992 for a reader
  that made sixteen tool calls on the mid tier. The cause was not measured.
- **Four quotations from reader legs were paraphrases presented as verbatim**; the
  fixed-string check caught them before review. A leg's quotation is a pointer to a source,
  never the source.
- **The first draft put the sign-off before the plan**; the adversarial audit caught it. The
  documentation review corrected one "not built" claim (PR-side dispositions exist in
  `pr-tally`).
- **Round 2**: the owner's answers moved the pre-merge check from a gate to retire to a
  designed part of a named workflow, asked for normal-operations limits to become the
  workflow's tunable parameters, and asked for an end-to-end cloud path; §§3 to 5 are the
  response. The owner then expressed no preference on the round-2 questions, so the seat's
  proposals stand as working defaults until the trial's plan is ratified.
