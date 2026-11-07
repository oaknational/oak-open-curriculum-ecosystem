# An idea-to-merge delivery workflow: concept exploration and the improved request

**Date**: 2026-11-07 · **Seat**: Juniper seeks Pollen (Claude Code cloud session, solo) ·
**Status**: provisional. Every decision in §2 is the owner's.

**What you need to do:** edit the improved request in §1 until it says what you want, then
answer the four questions in §2. The rest of the note is the evidence behind them, for you and
for the seat that runs the first trial.

## 1. The improved request

> I want a reusable OCE workflow that turns an idea and its intended outcomes into a merged
> change that delivers them. I am needed twice: to shape the idea and sign off the definition
> of done, and to check the pull request just before merge. Between those two points, agents
> plan, build, review and improve the work without me, and they stop and tell me at once if
> the evidence shows the definition of done is wrong. When it ends, every acceptance criterion
> I signed off has passing evidence on the merged commit.

The detail:

> **Outcome.** I give OCE an idea and the outcomes I want. I get back a merged change on the
> default branch. Each acceptance criterion I signed off has passing evidence on the merged
> commit. The change says who benefits and whether it is landed (for developers and agents)
> or released (to end users). Between my two touch-points the agents work unattended within a
> declared cost, and anyone can see where the work stands.
>
> **Touch-point 1: shape and sign-off.** Agents flesh out, challenge and refine the idea with
> me in conversation. It ends when I sign off the definition of done, recorded as the
> ratification stamp on the work's plan node. The sign-off covers: the goal; who benefits and
> what each group gets; scope and non-goals; acceptance criteria, each with a named proof;
> whether the result is landed or released; the size and cost budget; the risk level; and the
> points where the agents must stop and ask me. A small idea takes a lighter path through the
> same stages; the size is part of what I sign off.
>
> **Touch-point 2: pre-merge check.** I get one card with a one-screen summary for an exact
> commit: each acceptance criterion against its evidence; the holistic review's verdicts and
> what was done with each finding; remaining risks; cost against budget; and what was left
> out. I answer merge, or not yet with a reason. Any later push voids my answer.
>
> **Surprises reach me at once.** If evidence shows what I signed off is wrong (a criterion
> cannot be met, would cause harm or misses the point; the scope must grow; or the budget
> will be broken beyond the limit I set), the work stops and asks me. I expect this to be
> rare. Each occurrence is recorded as a flaw in the workflow to fix. Changes that stay within
> what I signed off go ahead and appear in the pre-merge summary.
>
> **Between the touch-points.**
>
> - **Plan.** The definition of done is split into pieces with explicit interfaces: what each
>   piece needs, what it guarantees, and how integration would break if a neighbour changed.
>   The work is sized to the estate's small-PR bands. Pieces run in parallel only where they
>   are genuinely independent.
> - **Plan review.** Reviewers with distinct lenses check the plan before any code. One of
>   them is asked whether each part should exist at all.
> - **Pieces.** Each piece is built test-first in its own worktree and reviewed by reviewers
>   who did not write it or share its assumptions. Review runs for a fixed number of rounds.
>   Each finding is fixed, rejected with evidence, or logged for separate follow-up.
> - **Assembly.** The pieces are integrated and every interface is checked.
> - **Holistic review.** The assembled whole is reviewed from fixed perspectives: user value
>   (do beneficiaries get what the criteria promise?); value over ceremony (could it be
>   simpler?); engineering excellence (architecture, types, tests, security as needed);
>   Practice alignment (principles, rules, decision records). A final reviewer tries to
>   disprove the evidence for each acceptance criterion.
> - **PR.** Opened with a description built from the evidence. CI and the review conversation
>   settle under the PR lifecycle discipline. Then my card.
> - **Merge and close.** After my word the agent merges, checks the merged state (and the
>   release, where the sign-off names one) and closes the work.
>
> **Each run teaches the next.** At close, a short retrospective records what each stage's
> review found that mattered, where a stage added nothing, the cost of each stage, and every
> time I was needed outside the two touch-points, with the cause. Changes to the workflow go
> through the Practice's normal learning path.
>
> **Defined, started, observed, finished.**
>
> - **Defined** once, in one place that any agent host can use. The definition covers
>   stages, outputs, entry and exit criteria, reviewers and budgets. Scripts and tests, not
>   agent interpretation, handle orchestration and record-keeping.
> - **Started** from one entry point that I invoke with my idea and outcomes.
> - **Observed** by a status read computed on demand from what the repository and GitHub
>   already hold: the plan node's sign-off, the branches, the PR, its checks and review
>   threads, and the evidence for each criterion. Never from an agent's say-so or a
>   hand-kept status file.
> - **Finished** when computed, not claimed: every criterion's proof passes on the merged
>   commit, the landed or released state is reached, the plan node is archived, and the
>   retrospective is recorded.
>
> **First, a trial.** Before building any engine, run one real, small idea through this shape
> by joining up the existing skills and reviewers by hand, measuring every stage. Build only
> what that trial shows is missing.

## 2. Your decisions

Each question has a proposed answer. Reply with the question number and yes, no, or your own
answer; they will also come to you as cards. Nothing is decided until you reply.

- **D1. Should your pre-merge check be permanent, or end once it stops changing outcomes?**
  Proposed: trial only, tied to one commit. If it changes nothing across several runs, the
  seat proposes a notification instead, and you decide. Why: it is a new gate against your
  standing word "no prs are blocked on me" (2026-09-07), so it should earn its place.
- **D2. Must the first version deliver one story in one PR?** Proposed: yes. Larger ideas
  are split into sequential runs at shaping. How to deliver multi-story ideas waits for the
  trial.
- **D3. When a criterion proves wrong mid-flight, do the agents stop or amend?** Proposed:
  stop and ask if the change narrows scope, changes behaviour a beneficiary can see, or breaks
  the budget or a stop point; otherwise amend and report it in the pre-merge summary.
- **D4. Which idea should the first trial use?** Proposed test: a real idea with a named
  beneficiary, one story, an outcome visible at merge, two or three natural pieces, and not
  the workflow's own tooling. Name one, or ask the seat to propose three.

## 3. Review contract

- **Purpose and impact.** Improve the owner's request and ground it in the estate, so the
  owner can adopt it in one sitting and the next seat can run a trial without re-surveying.
- **A review should test** whether §1 is faithful to the owner's words (§4), whether each
  change in §5 is warranted by its evidence, whether §6 and §7 are true of the repository,
  and whether the note decides anything that is the owner's.
- **Evidence standard.** Owner words are quoted from the files that carry them; every
  quotation was checked against its source by fixed-string search. Reader-leg claims are
  labelled where they were not checked first-hand. The legs share a model family, so their
  agreement is correlated, not independent.
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

R4, R5 and R9 depend on the answers to §2 (D3, D1 and D2 respectively).

| # | Change | Why | What would show it wrong |
| --- | --- | --- | --- |
| R1 | "Done" moves from merged to every signed-off criterion evidenced on the merged commit, landed or released named | "Merged code is not delivery" ([definition of delivery](../../directives/definition-of-delivery.md)). "The seats merged 235 pull requests across both estates" in five days, yet "nine of the exchange's twenty-one owed stories were whole" ([retrospective](../../reports/agentic-engineering/why-five-days-of-landings-closed-nine-stories-2026-09-29.md)) | Across trials every criterion is trivially met at merge and the post-merge check never finds anything |
| R2 | The definition of done is recorded as a plan node's ratification stamp | The [plan-node schema](../../plans/plan-node-schema.md) already has the stamp and criteria "each with a proof"; a 2026-08-31 panel found the delivery node's "resolution criteria with typed proofs are the acceptance-criteria contract" ([decision](../plan-estate-remediation-node-decision-2026-08-31.md)) | The node cannot carry size, budget or stop points without contortion: amend the schema through its owner, never a parallel format |
| R3 | The unit of work and of state is one run of one idea, and its state is derived | The schema: "Execution state is never a durable repository field"; PDR-118, derive do not author; lights-on: "No agent writes progress" ([comparison](../practice-nature-and-lights-on-comparison-2026-10-22.md)); a workstream-brief state surface was built and retired ([state surfaces](operational-awareness-and-state-surfaces.md)) | A state question can only be answered from an agent's memory: that one fact earns a validated anchor (PDR-118 §3), not a status file |
| R4 | "Only twice" holds when nothing goes wrong; a finding that refutes the sign-off goes to the owner at once | Evidence refuting an owner-approved premise is an owner-class action moment ([owner-attention rule](../../rules/owner-attention-at-action-moments.md)); PDR-084 classes each owner touch as an owner-only decision or a missing autonomy primitive | Most trial runs need a third touch: shaping is under-powered, and the cure goes there |
| R5 | The pre-merge check is tied to a commit, fed a one-screen summary, and ends if it stops catching anything | A new gate against "no prs are blocked on me, green and clean and sensible, those are the requirements" (owner, 2026-09-07, [pr-lifecycle](../../skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md)); PDR-128: the owner should not chase thread state | The check changes nothing the holistic review missed across several runs |
| R6 | Parallel build only where pieces are independent; review always independent | "fan out to verify, stay serial and first-hand to execute" ([fleet topologies](../../reports/agentic-engineering/fleet-topologies-history-and-designs-2026-08-05.md)); coordination helps decomposable work and harms sequential work ([adaptive capacities](../agent-capacities-2026-09-09/report.md)); seven agents given one prompt herded ([experiment](../../analysis/team-self-organisation-experiment-2026-05-14.md)) | The trial shows near-zero conflict at assembly: widen parallel build |
| R7 | Every review loop has a round budget, an outcome for each finding and an exit, and one reviewer challenges existence | PDR-132: two rounds is healthy, a third raises the generator question; PDR-140: "the cure is the exception"; PR #570 ran ten rounds ([convergence](../review-loop-convergence-concept-exploration-2026-07.md)); review "inside the frame it is handed" ([retrospective](../../reports/agentic-engineering/why-two-expert-reviews-hardened-a-mechanism-that-should-not-exist-2026-09-20.md)) | A stage's review finds nothing material across several runs: slim or drop it |
| R8 | Review moves before the push; bots get the residue | PR 336: "roughly half of all rounds were echoes of the previous round's own additions" ([assessment](../../reports/agentic-engineering/pr336-fleet-assessment-and-review-treadmill-2026-07-13.md)) | Pre-push review does not reduce PR rounds in the trial |
| R9 | One story, one PR, inside the bands, for the first version | [Small-PR bands](../../rules/design-work-for-small-prs.md); PDR-132 clause 7, one story in one PR; a lone seat may hold one open PR | Real ideas routinely refine into more than one story |
| R10 | Reuse comes from one definition plus scripted orchestration and records | "Sixteen of nineteen prior-kept mechanisms recurred within four weeks of the run that kept them"; "a rule that fires after the fact is a story, not a guard" ([retrospective](../../reports/agentic-engineering/why-written-lessons-kept-needing-the-owner-2026-09-16.md)) | A seat following a written procedure runs the trial cheaply and faithfully: script less |
| R11 | Each run closes with a retrospective that measures each stage | The Practice's value stream "stops at delivery" and is "a link, not a loop" ([DORA comparison](../dora-2025-and-the-practice.comparison.md)) | Retrospectives change nothing across several runs: shrink them |
| R12 | A cost budget per run, with a tier per stage | The [fleet-design rule](../../rules/fleet-design-review-before-expensive-fleets.md); a 45-agent review net cost ~5.2M output tokens for one PR, and its report says to spend such a net "at a merge gate" and not "in an inner loop" ([methodology](../../reports/agentic-engineering/multi-agent-review-methodology-2026-08-09.md)) | Trial cost per stage lands within its estimate: keep the budget coarse |
| R13 | Trial before engine | The `reason` skill's direct-trial gate; scope-from-goal: "Build the simplest thing that works, ship it, then let real friction … drive the next increment" | Hand composition proves too costly: that names the first thing to script |

## 6. What the estate already has, stage by stage

The workflow is mostly a composition of existing machinery plus a few small new instruments
(§8 lists them).

| Stage | Existing machinery | Gap |
| --- | --- | --- |
| Start | `start-right-*` skills; skills invoked by hand | One entry point taking an idea and outcomes |
| Shape and refine (touch 1) | `concept-exploration`, `parallax`, `parallax-frame`, `proportionality`, `reason`, `metacognition`, `user-value`, `specify`, `cricket`; PDR-103's GOAL · IN · OUT | A fixed composition order ending in the definition of done |
| Definition of done and sign-off | Plan-node estate (ADR-216): born-sketch, the ratification stamp, delivery criteria with typed proofs, user groups and value, out of scope, expiring `owner_gates`; the definition of delivery; `assess-specification` (readiness for a named use) | Where size, budget, stop points and risk level live in the node; the card that collects the stamp |
| Plan and split | `plan` skill and its size contract; PDR-132 clause 5 (steps sliced to PR-shaped units at authoring); PDR-093 (each deliverable states what it consumes and "how the gate breaks if the predecessor drifted"); `specify-connection` for interfaces; `ticket-management`; one PR per leaf | Piece interfaces and dependencies as data; a test for independence |
| Plan review | PDR-123 design-panel protocol; `assumptions-expert` (ADR-146); the four architecture lenses; `parallax-audit`; anti-deference briefs | A fixed panel, the existence-challenger brief, an exit |
| Parallel build | Agent worktree isolation; `agent-tools` `spawn` (seat briefs); `set-up-worktree-lane`; the Implementer role (PDR-117); TDD doctrine; the `commit` skill | A piece brief with a task-id handshake (fleet-design lessons, 2026-08-17) |
| Piece review | `invoke-code-experts` roster; PDR-122 (atomic judgement, deterministic aggregation, conserve by default); PDR-132 round budget; PDR-140 pricing; PR-side per-finding dispositions in `agent-tools` `pr-tally` (signed lines bound to the head commit and review id) | A pre-push review loop with its own disposition record, proposed in 2026-05 and not built; its line format can follow `pr-tally`'s. (The `fidelity-review` package's disposition register is a different concern.) |
| Assembly | `specify-connection`; the definition of delivery's rule that interdependent surfaces are one unit and "deliver together or not at all"; the hook and CI gates | An integration step with an interface check |
| Holistic review | `user-value` (assess mode), `proportionality`, code-expert and specialists, `docs-adr-expert`, `release-readiness-expert` (GO / NO-GO), `parallax-audit`, cross-vendor legs (`sif`, `codex-helper`) | A fixed perspective set; a schema-forced refutation stage (held, not held, not provable, with file-and-line evidence, as in lights-on) |
| PR and assessment | `pr-lifecycle` phases and review-round state machine; PDR-128; PDR-131 settled-READY; `agent-tools` `merge-bot`, `pr-watch`, `pr-tally`; the review-cost gate | A generator for the one-screen summary |
| Owner check (touch 2) | Cards (owner-attention rule) | A commit-pinned approval record that a later push voids |
| Merge | Standing merge doctrine; `merge-bot` (bot identity, REST merge commit); PDR-131 auto-merge armed at settled-READY under a grant; Phase 8 post-merge harvest | A merge executor per host: the merge-bot needs a machine-local key and an untracked per-checkout config, so it cannot run in a cloud session ([cloud environment](../../claude-harness-integrations/cloud-environment.md)) |
| Done and close | Definition of delivery; plan archival; `wrap` | A computed done-check. `plan assert-complete` was proposed in the backlog plan `completion-claim-proof-pipeline` and is not built (no match under `agent-tools/src` or `packages`) |
| Run state | PDR-118; ADR-212 (repository holds intent, the tracker holds execution, GitHub holds change and readiness); `pr-watch`; the Workflow tool's live view of a running fan-out | A status read over the plan node, git, the PR, its checks and the evidence |
| Learning | `retrospective`, `parallax-learn`, PDR-130, napkin, `consolidate-docs` | A per-run retrospective shape with per-stage measures |
| Cost | The fleet-design rule; PDR-122 invariant 4; `agent-tools` `context-cost`, `arc-metrics`, `review-cost`; the Workflow tool's `budget` | A per-run budget in the sign-off; a tier per stage |
| Orchestration | The Workflow tool; `agent-tools` `workflow-build` (typed stage bundler with an output contract); `corpus-analysis` as a worked multi-stage pipeline | Stage scripts for the fan-out stages; a plan-to-workflow generator only if the trial asks for one |

## 7. Collisions with standing doctrine

The resolutions are proposals. C1 and C2 are routed to the owner (D1, D2); C7 is a constraint
the trial must design around; the rest are settled at trial design under the decision lenses.

| # | The request says | Standing doctrine says | Proposed resolution |
| --- | --- | --- | --- |
| C1 | "a single check from me, then the agent merges" | "no prs are blocked on me" (2026-09-07); bot-authored PRs exempt from code-owner review (owner ruling of 2026-07-21, as the pr-lifecycle skill records it; the fork's live ruleset was not read) | A gate scoped to this workflow, tied to a commit, with an end test (D1) |
| C2 | "the pieces are assembled … pushed to a PR" | Small-PR bands; PDR-132 clauses 2 and 5 | One story, one PR, inside the bands (D2); PDR-132 clause 7 permits one PR for one story |
| C3 | Pieces "carried out in parallels" | The WIP limit gives a lone seat one open PR; no branch targets another branch | Pieces are short-lived local worktree branches integrated into the run's branch; only the run's PR opens |
| C4 | "know what the current state of a specific instance is" | Execution state is never a repository field (plan-node schema, ADR-216); PDR-118 | A computed status read; no status file |
| C5 | Sign-off of the definition of done, with pieces planned afterwards | Every plan node is sketch until stamped; a scope change returns it to sketch | One stamp covers the definition of done; the split is added inside it as dated in-place amendments, which the schema allows for changes smaller than scope |
| C6 | Pieces "reviewed and improved until it meets the required standards" | PDR-132 round budget; PDR-140 pricing | Bounded loops with an outcome per finding; pre-push rounds are not PR rounds, so the PR budget still binds |
| C7 | "the agent merges the work" | The merge-bot cannot run in a cloud session; the bot-identity rule governs third-party writes | A constraint, not a decision here: the trial merges from a host that runs the merge-bot, or the cloud gap is cured first |
| C8 | Holistic review after assembly | The costliest point to find an interface defect | Interfaces declared at plan time and checked in plan review |

## 8. Defining, starting, observing and finishing a run

**Defining.** The capability-landing procedure puts a multi-step procedure in a skill, with
evals, and zero-context enforcement in a validator or hook. So the workflow's home is one
skill in the Practice corpus, with generated platform adapters. Its deterministic parts (the
status read, the one-screen summary, the done-check, the fan-out stage scripts) live in
`agent-tools` with tests, built through `workflow-build` where they are Workflow-tool stages.
The definition does not depend on one agent host (PDR-143, The Practice as a Standalone
Entity); the Claude Code Workflow tool is one binding ("capability parity, not mechanism
parity", from the v0 practice report).

**Starting.** One entry point the owner invokes with the idea and outcomes. A skill whose
instructions call the Workflow tool counts, by its invocation, as the owner's opt-in to
multi-agent orchestration.

**Observing.** No new state store. Intent lives in the plan node; change, checks and
readiness live in the PR; branches live in git. A status read projects them:

| Phase | Computed from |
| --- | --- |
| Shaping | Plan node exists at `status: sketch` |
| Signed off | Ratification stamp complete |
| Building | Run branch and piece worktrees exist; no PR yet |
| In review | PR open; checks running or threads unresolved |
| Awaiting the owner | Settled-READY on the head commit; no owner approval for that commit |
| Approved | Owner approval recorded for the current head commit |
| Merged | PR merged; post-merge checks run |
| Done | Every criterion's proof passes on the merged commit; node archived; retrospective recorded |
| Stopped | An owner card is open on a finding that refutes the sign-off |

The one fact with no home today is the owner's commit-pinned approval. A PR review or comment
naming the commit is a candidate; the choice follows the trial.

**Finishing.** Done is computed from the last rows of that table, never asserted
(`validators-must-recompute-not-just-record`).

The six small instruments the gaps in §6 add up to: the entry point; the pre-push review loop
with its disposition record; the refutation stage; the one-screen summary; the commit-pinned
approval; and the status read with its done-check.

## 9. The Parallax record

**Depth: standard.** The request is new, spans several scales and admits different frames;
the stakes are moderate and the note is reversible. Four legs ran in fresh contexts,
synthesis stayed with the seat, and independent reviews ran on the note.

**Scales.** One piece; one run; many runs over weeks (does the workflow improve?); the
owner's attention over weeks; the estate (WIP limit, merge capacity, other seats).

**Frames.** Two protected passes generated frames: the seat's, anchored in the estate, and a
cold pass that saw only the owner's words.

| Frame | Focal question | What it adds |
| --- | --- | --- |
| Attention ledger | What must the owner see, at two moments, to hand over the rest? | The value sits in two artefacts: the sign-off and the summary |
| Durable run | How is one run resumed, queried and known finished? | One source of truth; done recomputed (R3) |
| Assurance case | What evidence justifies merging without reading the diff? | Criterion-to-evidence mapping; reviewer independence; stopping rules (R7) |
| Interfaces, not pieces | Can the work split into independently checkable pieces that still fit? | Interfaces at plan time; some work should not run in parallel (R6, C8) |
| Done is not merge | Did the outcome arrive, and does the workflow improve? | R1, R11 |
| Counterframe: a router, not a pipeline | What is the smallest addition that runs the existing machinery from one entry point, sized to the work? | Most stages exist (§6); a fixed many-stage pipeline would put maximum ceremony on all work, so size at shaping |

The counterframe holds in part. Its own test, in the cold pass's words ("if fewer than two
stages are missing, build the router"), lands between the frames: no stage is wholly missing, but six small instruments are
(§8). §1 therefore describes a router over existing machinery plus those instruments, sized
at shaping.

**Cross-scale claims the design relies on.**

- **Piece to run.** Individually reviewed pieces make a sound whole only if their interfaces
  are declared and checked; fails when pieces share hidden state.
- **Run to owner trust.** Runs whose summaries match what the owner finds support fewer
  touch-points; fails if the check is a rubber stamp, which is why D1 records whether it
  changed anything.
- **Merged to delivered.** Holds only for the landed or released state the sign-off names.
- **Plan-time sizing to review convergence.** PDR-132's claim; the trial measures it.
- **More agents to more throughput.** Bounded by independence, merge capacity and the WIP
  limit; reviewers sharing context count for less than their number.

**The owner's terms against the estate's.**

| Owner's term | Estate's term | What changes |
| --- | --- | --- |
| Definition of done | Delivery-node acceptance criteria with typed proofs, plus the definition of delivery | "Done" was a producer word; the estate measures delivery to a beneficiary |
| Sign off | The ratification stamp | Maps cleanly |
| Pieces | Units inside one delivery node, each built in a worktree | Not separate plan nodes, PRs or tickets in the first version |
| Assembled PR | One story, one PR | Multi-story ideas follow the trial (D2) |
| Agent merges | Standing merge doctrine, PDR-131, merge-bot | The owner's check is a new gate (C1) |
| State of an instance | A computed read (PDR-118, ADR-212) | No status file |
| Reusable workflow | A skill plus `agent-tools` scripts | Prose alone is not reuse (R10) |

**Strength of the evidence.** Mostly this estate's own retrospectives and decision records:
highly relevant, single-estate, written by agents of one model family. Owner words quoted are
primary. One external system (lights-on) was reviewed first-hand by an earlier seat. The
literature on multi-agent gains is conditional. Nothing has measured this workflow, so every
change in §5 is a hypothesis with a stated way to show it wrong.

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
| Cost per stage against estimate | Budget calibration (R12) |
| Lead time from sign-off to merge | The delivery measure |
| Whether the owner's check changed the outcome | Feeds D1 |
| Criteria evidenced on the merged commit | The done measure (R1) |

Reopen this inquiry when the trial closes, or sooner if the answers to §2 change a frame.

## 10. Proposed next steps

Proposals for the owner to accept, change or refuse.

1. The owner edits and adopts §1 and answers D1 to D4: touch-point 1 applied to the workflow
   itself.
2. From the adopted request, the seat drafts two born-sketch plan nodes: a strategic node for
   the workflow and a delivery node for the first trial. The owner's ratification of both
   closes touch-point 1.
3. The trial runs by hand composition on the idea chosen under D4, recording the measures in
   §9.
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
  lights-on comparison §§2–3; `agent-tools/src/pr-tally`.
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
  stance, folded into a follow-up commit.
- **Fan-out cost**: four legs, 469,822 tokens (A 131,775; B 134,236; C 112,992; cold pass
  90,819). Three readers on the mid tier with a 30-read cap each; the cold pass on the session
  model with no tools. The pilot leg was measured before the other two launched.
- **The cold pass cost 90,819 tokens with no repository reads**, against 112,992 for a reader
  that made sixteen tool calls on the mid tier. The cause was not measured; the next framing
  pass is priced from its own pilot before its tier is chosen.
- **Four quotations from reader legs were paraphrases presented as verbatim**; the
  fixed-string check caught them before review and they were replaced with the sources' own
  words. A leg's quotation is a pointer to a source, never the source.
- **The documentation review corrected one "not built" claim**: PR-side per-finding
  dispositions exist in `agent-tools` `pr-tally`; only a pre-push record is missing.
