# An idea-to-merge delivery workflow: concept exploration and the improved request

**Date**: 2026-11-07 · **Seat**: Juniper seeks Pollen (Claude Code cloud session, solo) ·
**Status**: provisional. Every decision in §2 is the owner's.

**What you need to do:** edit the improved request in §1 until it says what you want, then
answer the five questions in §2. The rest of the note is the evidence behind them, for you
and for the seat that runs the first trial.

## 1. The improved request

> I want a reusable OCE workflow that turns an idea and its intended outcomes into a merged
> change that delivers them. I am needed twice: first to shape the idea with the agents and
> sign off the reviewed plan, its definition of done and its cost; then to check the pull
> request just before merge. Between those points the agents build, review and improve the
> work without me, and they stop and ask me at once if the evidence shows that what I signed
> off is wrong. When it ends, every acceptance criterion I signed off has its evidence.

The detail:

> **Outcome.** I give OCE an idea and the outcomes I want. I get back a merged change on the
> default branch that says who benefits. Every criterion the repository can prove passes on
> the merged commit; a criterion only an outside system can show (a deployment, a dashboard)
> names who verifies it and where. The first version aims at landed work (usable by
> developers and agents), so finishing needs nothing more from me after merge. Between my two
> touch-points the agents work unattended within the cost I signed off, and anyone can see
> where the work stands.
>
> **Touch-point 1: shape, plan, sign off.** Agents flesh out, challenge and refine the idea
> with me in conversation. They then draft the plan: the definition of done (the goal; who
> benefits and what each group gets; scope and non-goals; acceptance criteria, each with a
> named proof), the split into pieces with their interfaces, and the estimated cost.
> Reviewers with distinct lenses review and improve the plan; one of them is asked whether
> each part should exist at all. Touch-point 1 ends when I sign off the reviewed plan, with
> the reviewers' verdicts and the cost estimate in front of me. My sign-off is the
> ratification stamp on the work's plan node. The plan also sizes the run: a small idea takes
> a lighter path (fewer reviewers, pieces built one after another), and the size is part of
> what I sign off.
>
> **Touch-point 2: pre-merge check.** I get one card with a one-screen summary for an exact
> commit: each acceptance criterion against its evidence; the holistic review's verdicts and
> what was done with each finding; remaining risks; cost against budget; and what was left
> out. I answer merge, or not yet with a reason. Any later push voids my answer, and the
> agent merges only after it.
>
> **Surprises reach me at once.** The work stops and asks me if the evidence shows that what
> I signed off is wrong: a criterion cannot be met, would cause harm or misses the point; the
> scope must change in either direction; behaviour a beneficiary will see must change; the
> cost will exceed what I signed off; or a review loop uses up its rounds without
> converging. I expect this to be rare, and each occurrence is recorded as a flaw in the
> workflow to fix. Changes that stay within what I signed off go ahead and appear in the
> pre-merge summary.
>
> **Between the touch-points.**
>
> - **Pieces.** Each piece is planned in detail and built test-first in its own worktree,
>   in parallel only where pieces are genuinely independent. Reviewers who did not write it
>   or share its assumptions review it for a fixed number of rounds. Each finding is fixed,
>   rejected with evidence, or logged for separate follow-up.
> - **Assembly.** The pieces are integrated and every interface is checked.
> - **Holistic review.** The assembled whole is reviewed from user value (do beneficiaries
>   get what the criteria promise?); value over ceremony (could it be simpler?); engineering
>   excellence (architecture, types, tests, security as needed); Practice alignment
>   (principles, rules, decision records); and any further perspective the change calls for.
>   A final reviewer walks every acceptance criterion and tries to disprove its evidence.
> - **PR.** Opened with a description built from the evidence. CI and the review
>   conversation settle under the PR lifecycle discipline. Then my card.
> - **Merge and close.** After my word the agent merges, checks the merged state and closes
>   the work.
>
> **Each run teaches the next.** At close, a short retrospective records what each stage's
> review found that mattered, where a stage added little, the cost of each stage, and every
> time I was needed outside the two touch-points, with the cause. Changes to the workflow go
> through the Practice's normal learning path.
>
> **Defined, started, observed, finished.**
>
> - **Defined** once, so a second run follows the same definition without re-deriving it.
> - **Started** from one entry point that I invoke with my idea and outcomes. It refuses to
>   start building from a plan whose sign-off or acceptance criteria are missing.
> - **Observed**: at any moment I or any agent can see which stage a run is in, from records
>   any seat can read, never from an agent's say-so.
> - **Finished** when shown, not claimed: each criterion's evidence is checked, the plan is
>   closed with its record, and the retrospective is written.
>
> **First, a trial.** Before building any engine, run one real idea through this shape by
> joining up the existing skills and reviewers by hand, measuring every stage; during the
> trial the stage and finish checks are made by hand against the same records. Build only
> what the trial shows is missing.

## 2. Your decisions

Each question has a proposed answer. Reply with the question number and yes, no, or your own
answer; they will also come to you as cards. Nothing is decided until you reply.

- **D1. What is your pre-merge check for?** Catching defects the workflow missed, keeping
  control of what merges, or building trust while the workflow is new. Proposed: trust while
  new. Each run records whether the check changed anything, and after a few runs you decide
  whether to keep it. Its cost: while a run waits for you, the seat's one open-PR slot is
  held.
- **D2. When an idea needs more than one PR, which shape?** Splitting it into runs costs two
  touches per run. The alternative lands the pieces dark (small PRs behind a flag, merged when
  green and clean) and your one check gates the release; that moves your check from before
  merge to before release, and not every change can sit behind a flag. Proposed: run the
  trial on an idea that fits one PR, and decide this after it, leaning to dark landing.
- **D3. Is the stop list in §1 ("Surprises reach me at once") the right boundary?**
  Proposed: yes. Any change in scope, in behaviour a beneficiary sees, or in cost beyond the
  sign-off stops the run; anything inside the sign-off goes ahead and is reported.
- **D4. Which idea should the first trial use?** Proposed test: a real idea with a named
  beneficiary, a landed outcome visible at merge, sized to one PR, and not the workflow's own
  tooling. Name one, or ask the seat to propose three.
- **D5. Who merges when the run is in a cloud session?** The merge bot cannot run there, and
  the estate records merging under your credential as "never a practice to normalise".
  Proposed: for the trial, a local seat merges after your check, picking the handoff up from
  the PR.

## 3. Review contract

- **Purpose and impact.** Improve the owner's request and ground it in the estate, so the
  owner can adopt it in one sitting and the next seat can run a trial without re-surveying.
- **A review should test** whether §1 is faithful to the owner's words (§4), whether each
  change in §5 is warranted by its evidence, whether §6 and §7 are true of the repository,
  and whether the note decides anything that is the owner's.
- **Evidence standard.** Owner words are quoted from the files that carry them; every
  quotation was checked against its source by fixed-string search. Reader-leg claims are
  labelled where they were not checked first-hand. The three readers and the cold pass share
  a model family, so their agreement is correlated, not independent; the external systems
  in §9 are the independent evidence.
- **Non-goals.** This note builds nothing and changes no rule, skill, decision record or plan.

## 4. The request as given

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

## 5. What changed, and why

§1 keeps the owner's order: the plan is drafted and reviewed before the sign-off, and pieces
are planned in detail after it. R4, R5 and R9 depend on the answers to §2 (D3, D1 and D2).
Rows marked *n = 1* rest on a single instance.

| # | Change | Why | What would show it wrong |
| --- | --- | --- | --- |
| R1 | "Done" moves from merged to every criterion evidenced; repository-provable criteria on the merged commit, others with a named verifier | "Merged code is not delivery" ([definition of delivery](../../directives/definition-of-delivery.md)). "The seats merged 235 pull requests across both estates" in five days, yet "nine of the exchange's twenty-one owed stories were whole" ([retrospective](../../reports/agentic-engineering/why-five-days-of-landings-closed-nine-stories-2026-09-29.md)). The plan estate never records deployment state; a deployment criterion is `owner-held` ([plan-node schema](../../plans/plan-node-schema.md)) | Across trials every criterion is trivially met at merge and the post-merge check never finds anything |
| R2 | The sign-off is the ratification stamp on the reviewed plan | The schema's stamp "records that the owner has seen and blessed the plan's shape", and delivery criteria carry a proof each; a 2026-08-31 panel found the delivery node's "resolution criteria with typed proofs are the acceptance-criteria contract" ([decision](../plan-estate-remediation-node-decision-2026-08-31.md)). The fleet-design rule's cost review travels "with the plan to the ratification ask" | The node cannot carry the split and cost without contortion: amend the schema through its owner, never a parallel format |
| R3 | The unit of work and of state is one run of one idea, and its state is read from records, never authored | The schema: "Execution state is never a durable repository field"; PDR-118, derive do not author; lights-on: "No agent writes progress" ([comparison](../practice-nature-and-lights-on-comparison-2026-10-22.md)); a workstream-brief state surface was built and retired ([state surfaces](operational-awareness-and-state-surfaces.md)) | A stage question can only be answered from an agent's memory: that one fact earns a validated anchor (PDR-118 §3), not a status file |
| R4 | "Only twice" holds when nothing goes wrong; a finding that refutes the sign-off goes to the owner at once | Evidence refuting an owner-approved premise is an owner-class action moment ([owner-attention rule](../../rules/owner-attention-at-action-moments.md)); PDR-084 classes each owner touch as an owner-only decision or a missing autonomy primitive | Most trial runs need a third touch: shaping is under-powered, and the cure goes there |
| R5 | The pre-merge check is an explicit owner hold, tied to a commit and fed a one-screen summary; its purpose is asked (D1) | The merge doctrine already provides for it: green and clean PRs "don't wait on me unless I explicitly say so" (owner, 2026-09-03, [pr-lifecycle](../../skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md)); PDR-128: the owner should not chase thread state | Owners' answers at the check never differ from the summary's verdict, and the owner reads that as reason to stop |
| R6 | Parallel build only where pieces are independent; review always independent | "fan out to verify, stay serial and first-hand to execute" ([fleet topologies](../../reports/agentic-engineering/fleet-topologies-history-and-designs-2026-08-05.md)); coordination helps decomposable work and harms sequential work ([adaptive capacities](../agent-capacities-2026-09-09/report.md)); seven agents given one prompt herded, *n = 1* ([experiment](../../analysis/team-self-organisation-experiment-2026-05-14.md)) | The trial shows near-zero conflict at assembly: widen parallel build |
| R7 | Every review loop has a round budget, an outcome for each finding and an exit, and one reviewer challenges existence | PDR-132: two rounds is healthy, a third raises the generator question; PDR-140: "the cure is the exception"; PR #570 ran ten rounds, *n = 1* ([convergence](../review-loop-convergence-concept-exploration-2026-07.md)); review "inside the frame it is handed" ([retrospective](../../reports/agentic-engineering/why-two-expert-reviews-hardened-a-mechanism-that-should-not-exist-2026-09-20.md)) | A stage's review finds nothing material across several runs: slim it, never below one meaningful review |
| R8 | Review moves before the push; bots get the residue | PR 336: "roughly half of all rounds were echoes of the previous round's own additions", *n = 1* ([assessment](../../reports/agentic-engineering/pr336-fleet-assessment-and-review-treadmill-2026-07-13.md)) | Pre-push review does not reduce PR rounds in the trial |
| R9 | The first version's runs fit one PR inside the bands | [Small-PR bands](../../rules/design-work-for-small-prs.md); PDR-132 clause 7, one story in one PR; a lone seat may hold one open PR | Real ideas routinely need more than one PR (D2) |
| R10 | Reuse means a second run needs no re-derivation; how much to script is a post-trial question | "Sixteen of nineteen prior-kept mechanisms recurred within four weeks of the run that kept them"; "a rule that fires after the fact is a story, not a guard" ([retrospective](../../reports/agentic-engineering/why-written-lessons-kept-needing-the-owner-2026-09-16.md)) | A seat following a written definition runs the trial cheaply and faithfully: script less |
| R11 | Each run closes with a retrospective that measures each stage | The Practice's value stream "stops at delivery" and is "a link, not a loop" ([DORA comparison](../dora-2025-and-the-practice.comparison.md)) | Retrospectives change nothing across several runs: shrink them |
| R12 | The plan carries a cost estimate the owner signs off, priced per stage | The [fleet-design rule](../../rules/fleet-design-review-before-expensive-fleets.md): a fan-out over ~500k tokens has its design reviewed and is priced by the owner; §8 estimates a run at about 0.6M to 2M tokens; a 45-agent review net cost ~5.2M output tokens for one PR, and its report says to spend such a net "at a merge gate" and not "in an inner loop" ([methodology](../../reports/agentic-engineering/multi-agent-review-methodology-2026-08-09.md)) | Trial cost per stage lands within its estimate: keep the estimate coarse |
| R13 | Trial before engine | The `reason` skill's direct-trial gate; scope-from-goal: "Build the simplest thing that works, ship it, then let real friction … drive the next increment" | Hand composition proves too costly: that names the first thing to script |

## 6. What the estate already has, stage by stage

No stage is wholly missing. The gaps are of two kinds: compositions and briefs that the
workflow's definition itself supplies, and six instruments that need code (§8).

| Stage | Existing machinery | Gap |
| --- | --- | --- |
| Start | `start-right-*` skills; skills invoked by hand; `agent-tools` `spawn` | One entry point taking an idea and outcomes; a refuse-to-start check (proposed by [PR 384](https://github.com/EngraphCode/open-curriculum-ecosystem/pull/384), §5.1) |
| Shape and refine | `concept-exploration`, `parallax`, `parallax-frame`, `proportionality`, `reason`, `metacognition`, `user-value`, `specify`, `cricket`; PDR-103's GOAL · IN · OUT | A fixed composition order ending in a drafted plan |
| Plan and split | `plan` skill and its size contract; PDR-132 clause 5 (steps sliced to PR-shaped units at authoring); PDR-093 (each deliverable states what it consumes and "how the gate breaks if the predecessor drifted"); `specify-connection` for interfaces; `ticket-management`; one PR per leaf | Piece interfaces and dependencies as data; a test for independence; a cost estimate per stage |
| Plan review | PDR-123 design-panel protocol; `assumptions-expert` (ADR-146); the four architecture lenses; `parallax-audit`; anti-deference briefs; the fleet-design rule's design review | A fixed panel and its brief, including the existence challenger |
| Sign-off | Plan-node estate (ADR-216): born-sketch, the ratification stamp, delivery criteria with typed proofs (`repo-safe` or `owner-held`), user groups and value, out of scope, expiring `owner_gates`; the definition of delivery; `assess-specification` (readiness for a named use) | Where the split and the cost estimate sit in the node; the card that collects the stamp |
| Piece build | Agent worktree isolation; `spawn` (seat briefs); `set-up-worktree-lane`; the Implementer role (PDR-117); TDD doctrine; the `commit` skill | A piece brief with a task-id handshake (fleet-design lessons, 2026-08-17) |
| Piece review | `invoke-code-experts` roster; PDR-122 (atomic judgement, deterministic aggregation, conserve by default); PDR-132 round budget; PDR-140 pricing; PR-side per-finding dispositions in `agent-tools` `pr-tally` (signed lines bound to the head commit and review id) | A pre-push review loop with its own disposition record, proposed in 2026-05 and not built; its line format can follow `pr-tally`'s. (The `fidelity-review` package's disposition register is a different concern.) |
| Assembly | `specify-connection`; the definition of delivery's rule that interdependent surfaces are one unit and "deliver together or not at all"; the hook and CI gates | An integration step with an interface check |
| Holistic review | `user-value` (assess mode), `proportionality`, code-expert and specialists, `docs-adr-expert`, `release-readiness-expert` (GO / NO-GO), `parallax-audit`, cross-vendor legs (`sif`, `codex-helper`) | A fixed perspective set with an open slot; a contract walk: one verdict per criterion (met, not met, cannot tell, not applicable with a reason), evidence for every "met" (lights-on's held / not held / not provable; PR 384's proposal 2) |
| PR | `pr-lifecycle` phases and review-round state machine; PDR-128; PDR-131 settled-READY; `agent-tools` `merge-bot`, `pr-watch`, `pr-tally`; the review-cost gate | A generator for the one-screen summary |
| Owner check | Cards (owner-attention rule) | A commit-pinned approval record that a later push voids |
| Merge | Standing merge doctrine; `merge-bot` (bot identity, REST merge commit); PDR-131 auto-merge, armed here only after the owner's approval of the head commit; Phase 8 post-merge harvest | A merge executor per host: the merge bot needs a machine-local key and an untracked per-checkout config, so it cannot run in a cloud session ([cloud environment](../../claude-harness-integrations/cloud-environment.md)); D5 |
| Finish | Definition of delivery; plan archival; `wrap` | A finish check. `plan assert-complete` was proposed in the backlog plan `completion-claim-proof-pipeline` and is not built (no match under `agent-tools/src` or `packages`) |
| Run state | PDR-118; ADR-212 (repository holds intent, the tracker holds execution, GitHub holds change and readiness); `pr-watch`; the Workflow tool's live view of a running fan-out | A stage read over the plan node, git, the PR, its checks and the evidence |
| Learning | `retrospective`, `parallax-learn`, PDR-130, napkin, `consolidate-docs` | A per-run retrospective shape with per-stage measures |
| Cost | The fleet-design rule; PDR-122 invariant 4; `agent-tools` `context-cost`, `arc-metrics`, `review-cost`; the Workflow tool's `budget` | A per-stage estimate in the plan |
| Orchestration | The Workflow tool; `agent-tools` `workflow-build` (typed stage bundler with an output contract); `corpus-analysis` as a worked multi-stage pipeline | Whatever the trial shows a seat cannot do reliably by hand |

## 7. Collisions with standing doctrine

The resolutions are proposals; C3 to C6, C8 and C9 are settled at trial design under the
decision lenses.

| # | The request says | Standing doctrine says | Proposed resolution |
| --- | --- | --- | --- |
| C1 | "a single check from me, then the agent merges" | Green and clean PRs "don't wait on me unless I explicitly say so" (owner, 2026-09-03) | No conflict: the request is that explicit word, for runs of this workflow. Its purpose and its cost are D1 |
| C2 | "the pieces are assembled … pushed to a PR" | Small-PR bands; PDR-132 clauses 2 and 5 | One PR inside the bands for the first version; PDR-132 clause 7 permits one PR for one story; larger ideas are D2 |
| C3 | Pieces "carried out in parallels" | The WIP limit gives a lone seat one open PR; no branch targets another branch | Pieces are short-lived local worktree branches integrated into the run's branch; only the run's PR opens |
| C4 | "know what the current state of a specific instance is" | Execution state is never a repository field; it belongs to the ticket where a tracker tracks the work (plan-node schema, ADR-216), and plan validity never depends on a tracker (2026-08-07) | Read the stage from the plan node, git and the PR (§8); a ticket, where one exists, mirrors it |
| C5 | Sign-off of the definition of done, with pieces planned afterwards | Every plan node is sketch until stamped; a scope change returns it to sketch | The stamp covers the reviewed plan; detailed piece plans are added inside it as dated in-place amendments; a scope change stops the run (§1) |
| C6 | Pieces "reviewed and improved until it meets the required standards" | PDR-132 round budget; PDR-140 pricing | Bounded loops with an outcome per finding; a loop that runs out of rounds stops the run; pre-push rounds are not PR rounds, so the PR budget still binds |
| C7 | "the agent merges the work" | The merge bot cannot run in a cloud session; merging under the owner's credential is "an environment fact, never a practice to normalise" | D5 |
| C8 | Holistic review after assembly | The costliest point to find an interface defect | Interfaces declared in the plan and checked in plan review |
| C9 | Agents working "in parallels" with "meaningful reviews at each stage" | A fan-out over ~500k tokens has its design reviewed and is priced by the owner | The estimate and its review travel with the plan to touch-point 1, where the owner prices it |

## 8. Defining, starting, observing and finishing a run

**Defining.** The note commits to no home before the trial. The hypothesis to test: the
capability-landing procedure puts a multi-step procedure in a skill, with evals, and
zero-context enforcement in a validator; so the definition would be one skill in the
Practice corpus, with whichever deterministic parts the trial shows are needed in
`agent-tools`, built through `workflow-build` where they are Workflow-tool stages. The
definition should not depend on one agent host (PDR-143, The Practice as a Standalone
Entity): "capability parity, not mechanism parity", in the v0 practice report's words.

**Starting.** One entry point the owner invokes with the idea and outcomes. The Claude Code
Workflow tool's own conditions count the invocation of a skill whose instructions call that
tool as the owner's opt-in to multi-agent orchestration.

**Observing.** No new state store. Each stage is read from a record any seat can see:

| Stage | Read from |
| --- | --- |
| Shaping | Plan node exists at `status: sketch`, no split yet |
| Plan in review | Plan node at sketch with its split and estimate |
| Signed off | Ratification stamp complete |
| Building | The run's draft PR, opened at its branch's first push (the estate's rule); piece worktrees are local by design |
| In review | PR ready; checks running or threads unresolved |
| Awaiting the owner | Settled-READY on the head commit; no owner approval for that commit |
| Approved | Owner approval recorded for the current head commit |
| Merged | PR merged; post-merge checks run |
| Finished | Every repository-provable criterion passes on the merged commit; any owner-held criterion's verifier has recorded it; plan archived; retrospective written |
| Stopped | An `owner_gates` entry on the plan node awaiting the owner's decision, with its expiry |

The owner's commit-pinned approval has no home yet; a PR review or comment naming the commit
is a candidate, chosen after the trial. During the trial, the seat reads each stage by hand
from these rows.

**Finishing.** Shown from the Finished row, never asserted
(`validators-must-recompute-not-just-record`).

**The six instruments** the code-shaped gaps in §6 add up to: the entry point with its
refuse-to-start check; the pre-push review loop with its disposition record; the contract
walk; the one-screen summary; the commit-pinned approval; the stage read with its finish
check.

**An indicative cost**, priced from this session's measured legs (readers 113k to 134k
tokens, reviewers 56k to 112k, a cold pass 91k), excluding the building agents, which this
session did not measure:

| Path | Legs | Estimate |
| --- | --- | --- |
| Small | Plan review 2 (existence challenger and one lens); serial build; piece review 2; holistic review 3 and the contract walk | About 8 review legs, 0.6M to 1M tokens |
| Standard | Plan review 3; parallel build; piece review 2 per piece for 2 to 3 pieces; holistic review 4 and the contract walk | About 12 to 15 review legs, 0.9M to 2M tokens |

Both cross the fleet-design rule's ~500k line, which is why the estimate goes to the owner
at touch-point 1 (C9). The trial replaces these figures with measurements.

## 9. The Parallax record

**Depth: standard.** The request is new, spans several scales and admits different frames;
the stakes are moderate and the note is reversible. Three readers and a cold pass ran in
fresh contexts, synthesis stayed with the seat, and three reviews ran on the note.

**Scales.** One piece; one run; many runs over weeks (does the workflow improve?); the
owner's attention over weeks; the estate (WIP limit, merge capacity, other seats).

**Frames.** Two protected passes generated frames: the seat's, anchored in the estate, and a
cold pass that saw only the owner's words.

| Frame | Focal question | What it adds |
| --- | --- | --- |
| Attention ledger | What must the owner see, at two moments, to hand over the rest? | The value sits in two artefacts: the reviewed plan and the summary |
| Durable run | How is one run resumed, queried and known finished? | One source of truth; finish shown, not claimed (R3) |
| Assurance case | What evidence justifies merging without reading the diff? | Criterion-to-evidence mapping; reviewer independence; stopping rules (R7) |
| Interfaces, not pieces | Can the work split into independently checkable pieces that still fit? | Interfaces in the plan; some work should not run in parallel (R6, C8) |
| Done is not merge | Did the outcome arrive, and does the workflow improve? | R1, R11 |
| Counterframe: a router, not a pipeline | What is the smallest addition that runs the existing machinery from one entry point, sized to the work? | Most of the request exists (§6); a fixed many-stage pipeline would put maximum ceremony on all work |

The counterframe wins by its own test, in the cold pass's words ("if fewer than two stages
are missing, build the router"): no stage is wholly missing. §1 therefore describes one
entry point over existing machinery, sized by the plan, plus the six instruments of §8.

**Independent evidence.** Two systems built outside this estate have the request's shape.
Alex Ward's team-of-one pipeline, compared with the Practice in
[PR 384](https://github.com/EngraphCode/open-curriculum-ecosystem/pull/384), keeps the human
at intent and merge, in the essay's figure title "Three agents in the middle. Me at both
ends."; its ticket is the contract ("If a decision only exists in chat, it doesn't exist."),
its builder refuses to start without acceptance criteria, its reviewer walks the acceptance
list item by item and fails closed, verdicts count only for the current plan revision ("so a
late verdict on a stale plan does nothing."), and a review loop that hits its cap hands back
to the human. Gojko Adzic's lights-on factory interviews the user, stops twice for approval,
then runs unattended with a derived run record and a refuting final stage. Where they
differ from §1: Ward's human merges, and his loops hand back to him on non-convergence (§1
stops the run likewise); lights-on has no learning loop and no PR stage.

**Cross-scale claims the design relies on.**

- **Piece to run.** Individually reviewed pieces make a sound whole only if their interfaces
  are declared and checked; fails when pieces share hidden state.
- **Run to the owner's check.** A summary that matches what the owner finds shows the check
  is informed; whether to keep the check is the owner's (D1).
- **Merged to delivered.** Holds for landed work; released work needs its named verifier.
- **Plan-time sizing to review convergence.** PDR-132's claim; the trial measures it.
- **More agents to more throughput.** Bounded by independence, merge capacity and the WIP
  limit; reviewers sharing context count for less than their number.

**The owner's terms against the estate's.**

| Owner's term | Estate's term | What changes |
| --- | --- | --- |
| Definition of done | Delivery-node acceptance criteria with typed proofs, plus the definition of delivery | "Done" was a producer word; the estate measures delivery to a beneficiary |
| Sign off | The ratification stamp on the reviewed plan | Maps cleanly |
| Pieces | Units inside one delivery node, each built in a worktree | Not separate plan nodes, PRs or tickets in the first version |
| Assembled PR | One PR inside the bands | Larger ideas are D2 |
| Agent merges | Standing merge doctrine, PDR-131, merge bot | The owner's check is an explicit hold (C1); the merge host is D5 |
| State of an instance | A stage read from records (PDR-118, ADR-212) | No status file |
| Reusable workflow | One definition a second run follows | How much to script follows the trial (R10) |

**Strength of the evidence.** Mostly this estate's own retrospectives and decision records:
highly relevant, single-estate, written by agents of one model family. Owner words quoted are
primary. Two external systems (lights-on, Ward's pipeline) were reviewed first-hand by earlier
seats and are independent of this note's legs. The literature on multi-agent gains is
conditional. Nothing has measured this workflow, so every change in §5 is a hypothesis with a
stated way to show it wrong.

**Status: provisional.** The evidence supports refining and adopting the request and
designing a trial. It does not support building tooling or amending doctrine; either needs
the owner's word.

**What the first trial measures.**

| Indicator | Reading |
| --- | --- |
| Owner touches, planned and unplanned, with causes | Two planned, none unplanned |
| Material findings per stage, against that stage's cost | A stage with no material findings is a slimming candidate |
| Review rounds on the PR | At most two (PDR-132) |
| Conflict and rework at assembly | How far to parallelise build (R6) |
| Cost per stage against the signed-off estimate | Replaces §8's indicative figures |
| Lead time from sign-off to merge | The delivery measure |
| Whether the owner's check changed the outcome | Feeds D1 |
| Criteria evidenced at finish | The finish measure (R1) |

Reopen this inquiry when the trial closes, or sooner if the answers to §2 change a frame.

## 10. Proposed next steps

Proposals for the owner to accept, change or refuse.

1. The owner edits and adopts §1 and answers D1 to D5.
2. The trial idea (D4) gets its own delivery node, serving the strategic node that idea
   already belongs to; that node is the run's record. No strategic node for the workflow
   itself until the trial earns one.
3. The trial runs by hand composition, recording the measures in §9.
4. The trial's retrospective decides which of the six instruments in §8 to build, and in
   what order.

## 11. Evidence base

Read for this note by the seat or a reader leg. The legs read about 60 files, most at heading
and targeted-section depth; leg B read nine in full or nearly so.

- **First-hand by the seat**: AGENT.md, `principles.md`, the definition of delivery, the
  plan-node schema and plans README, PDR-117, PDR-118, PDR-122, the `pr-lifecycle` merge
  doctrine, WIP limit and code-owner ruleset paragraph, and the rules on owner attention,
  scope from goal, design from impact, small PRs, one PR per leaf, no parallel long-lived
  branches, fleet design, unattended seats, confident seats and capability landing; the
  lights-on comparison §§2–3; `agent-tools/src/pr-tally`; the PR 384 report (§§1, 4 and 5, at
  its head commit of 2026-11-06, not yet on `engraph`).
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
- **Cold pass** (no repository reads): the six frames of §9, ten hidden assumptions, and the
  commit-pinned check.

Relevant and not read: `practice-system-review-2026-10.md`, the fleet-topology adversarial
review and cross-examination, the agentic design-panel protocol report, and
`modern-software-architecture-for-long-term-excellence.md`.

## 12. Session record (dated observations, 2026-11-07)

- **Skills applied**: `start-right-thorough`; `parallax`, with `parallax-frame` run as two
  protected passes and synthesis held by the seat; `proportionality`; `concept-exploration`'s
  loop dynamics; `reason` (direct-trial gate); `metacognition`; `user-value` and `specify` as
  lenses on the definition of done. Reviews: `docs-adr-expert` and `prose-expert`, folded
  into the first commit; an adversarial `assumptions-expert` audit in the Parallax-audit
  stance and the PR 384 comparison, folded into the second.
- **Fan-out cost**: four legs, 469,822 tokens (A 131,775; B 134,236; C 112,992; cold pass
  90,819); reviews 279,332 (`assumptions-expert` 112,432; `prose-expert` 111,309;
  `docs-adr-expert` 55,591). The pilot leg was measured before the other readers launched.
- **The cold pass cost 90,819 tokens with no repository reads**, against 112,992 for a reader
  that made sixteen tool calls on the mid tier. The cause was not measured; the next framing
  pass is priced from its own pilot before its tier is chosen.
- **Four quotations from reader legs were paraphrases presented as verbatim**; the
  fixed-string check caught them before review and they were replaced with the sources' own
  words. A leg's quotation is a pointer to a source, never the source.
- **The first draft put the sign-off before the plan.** The owner's order is plan, review,
  sign-off; the adversarial audit caught the reorder, which no other review or pass had
  flagged. The documentation review corrected one "not built" claim: PR-side per-finding
  dispositions exist in `agent-tools` `pr-tally`.
