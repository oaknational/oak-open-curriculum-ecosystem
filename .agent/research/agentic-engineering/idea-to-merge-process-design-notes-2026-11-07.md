# The Attendant Workflow: design notes

**Date**: 2026-11-07 · **Seat**: Juniper seeks Pollen (Claude Code cloud session) ·
**Status**: design notes, input to the design session briefed in
[`idea-to-merge-process-design.prompt.md`](../../prompts/agentic-engineering/idea-to-merge-process-design.prompt.md).
Every prior analysis these notes draw on, the two reports they compare included, is input
to assess critically, never authority. An adversarial Cricket check ran on the first draft;
its redirection (give the worth-doubt the power to end a run; cut rather than accumulate) is
folded in.

## 1. Impact, value, and what we do not yet know

**The outcome.** An idea of the owner's becomes merged, value-bearing work with three touches
of the owner's attention and none unplanned, at a quality the owner would otherwise get only
by being present throughout.

**The impact.** The owner's attention stops being the bottleneck on delivery. What gets
delivered is bounded by the ideas the owner has, not by the hours the owner can supervise, and
the attention the owner does spend lands where only the owner can decide: what value is
wanted, whether the criteria capture it, whether the result is sensible to merge. Everything
the estate serves gets more of the owner's ideas, sooner.

**The mechanism.** A fixed-shape process in which judgement replaces presence: doubt exercised
at several altitudes by minds outside the frame that did the work, so that the work stays
honest and valuable without the owner watching it.

The artefacts (skills, sub-agents, components) are means. Every item the brief asks for is
derived from the capabilities below, and an item that serves none of them is cut.

### What we need in order to create that value

1. **Find the real value in a sketch**: turn a one-line idea into a value contract the owner
   recognises as their own and would have written given the time.
2. **Tell whether value was delivered, without the owner**: an assessment denominated in value
   with evidence, by someone outside the builder's frame.
3. **Keep quality without presence**: doubt at each altitude that catches what the owner would
   have caught.
4. **Run unattended, end to end, in the cloud**, the merge included.
5. **Earn the owner's trust at the two decision screens**: what the owner sees at approval and
   at the sense check lets a good decision be made in minutes.
6. **Survive its own duration**: a run outlives a context window and perhaps a session, and
   resumes from its records.
7. **Learn**: each run improves the next.

### What we understand

The owner's three checkpoints and the sequence; that doubt at altitude is the quality
mechanism; the estate's doctrine on delivery, plan nodes and reviews; what Ward's pipeline
and the lights-on factory do and lack; the estate's measured failure modes (review
treadmills, reviewers hardening a frame nobody questioned, prose disciplines regressing). And
one datum from the session that wrote these notes: an agent working without the owner
present generated fluent momentum in the wrong direction for hours. The Attendant's middle
consists of agents in exactly that condition. Its doubt points are the designed antidote;
nothing yet shows that they work.

### What is unknown, and how each would be learned

| Unknown | How we would learn it |
| --- | --- |
| Can an agent find the real user value from the owner's idea, in this domain, reliably? | The first runs: how much the owner changes the contract at approval is the signal |
| Do fresh-context doubters catch frame errors, or produce doubt theatre? | Per run: doubts that changed something, against their cost; what the owner's sense check catches is the miss rate |
| What must the owner see at approval and at the sense check? | The owner, now (owner-constitutive); refined by runs |
| What does "value delivered" mean before release? | Doctrine distinguishes landed from released; the claim boundary needs the owner's word |
| What does a run cost, and what cost is acceptable? | Measurement; the owner's word on the envelope |
| Does parallel build pay here, or does assembly consume the gain? | Measurement across runs |
| How does a cloud run merge as the bot? | A probe at the point a run meets it |
| Is one plan node per idea proportionate? | The first runs' friction |

### Questions not yet asked

- **What are the Attendant's own acceptance criteria, in value terms?** Candidates, for the
  owner to shape: an idea reaches merged value with three touches and none unplanned; the
  owner's sense check changes nothing material in most runs; the owner would rather use it
  than not; cost per run inside an envelope the owner sets.
- **What has the owner historically caught at review that agents missed?** That history is
  the specification for the doubt briefs; the estate's retrospectives hold it.
- **What does an agent need to know at initiation to find real value?** A model of the
  estate's beneficiaries exists in the vision and strategy; whether it serves as a value
  model at step 2 is untested.
- **What holds a run across compactions and sessions**, and what does resuming a run look
  like?
- **May two runs be live at once**, and what do they share?
- **What does the first run teach that only many runs can**, and what must it settle before a
  second starts?

### The decision lenses, in order

1. *Architectural excellence*: the Attendant is a Practice capability, portable across hosts,
   defined in skills, sub-agents and components, learning through the estate's loop.
2. *Strict everywhere*: the checkpoints are fixed structure; the doubt points are not
   optional; every rule holds.
3. *Simpler?* The first increment that creates the value is the checkpoints plus the doubt
   briefs, run by hand on one idea; the rest is added by the friction a real run shows.
4. *Simpler if the system changed?* Twice: skill components, so the Attendant assembles from
   references; and a doubt contract (artefact plus contract, the author's claims withheld)
   native to the estate's reviewers, which improves every review in the estate.
5. *User value*: proximately the owner; ultimately the people the estate serves.

## 2. What the owner has set

- **The name.** The Attendant Workflow. The umbrella skill is `attendant`; the sub-skills
  are `attendant-*`.
- **The shape of the definition.** The umbrella skill is the entry point and the high-level
  flow; each sub-skill is one part of the flow in its own appropriate detail, so no single
  large skill sits in context creating confusion and competing demands. Skill components are
  units of logic, guidance and contract that skills assemble from; they are not skills.
  Where an existing skill holds a part the Attendant needs, that part is extracted into a
  component the existing skill and the Attendant both reference.
- **The base is zero machinery.** Skills, sub-agents and the repository's records. Tooling
  enters only where a run has shown skills alone fail, never in anticipation, and leaves when
  that evidence lapses; the bar is high because machinery draws attention to itself, adds
  complexity and fragility, and displaces the value.
- **Three owner checkpoints, fixed**: initiation; approval of the acceptance criteria; a
  final sense check just before merge.
- **The user story** (the owner, 2026-11-07, verbatim):
  1. "I put forward an idea and ask for the Attendant workflow"
  2. "The idea is analysed using all appropriate skills, improved, and acceptance criteria in
     terms of value the implemented work would provide are presented for my approval"
  3. "Once I approve a detailed plan is created, broken down into subplans, optimised for
     parallel work where appropriate"
  4. "The plan is implemented by the agent or agents"
  5. "An assessment is made by the solo agent, or if in parallel the lead agent, as to whether
     the implementation has delivered the value specified in the plan. If work is happening in
     parallel each parallel track subplan must have acceptance criteria set by the lead agent,
     these do not need my approval, and each parallel track be agent assessed for value
     delivery, and then when the sub tracks come together the above overall assessment must
     happen"
  6. "Once the agent believes that the value has been delivered the PR is marked ready for
     review"
  7. "Once the review iteration is complete the agent judges if the work is ready for merge, if
     it is then the final request for a user sense check is made"

  "Throughout that process doubt is explored and valued."

- **Rules.** Every Practice rule applies, strictly. The PR and token limits set for normal
  operations are the Attendant's own parameters, set in its definition and tuned by its runs.
- **Cloud.** It runs end to end in cloud sessions.

## 3. The request's quality mechanism

The reviews are the mechanism, and the owner's words make it exact: at each stage, step back
and ask not only whether the work is right but whether what it is trying to achieve is
worthwhile. The sequence in §4 is built from those doubt points outward. Each sub-skill
carries one doubt brief; the doubter receives the artefact and the contract and nothing of
the author's claims about them; a doubt changes the artefact, is answered with evidence, or
travels forward to the final sense check as a finding; and a worth-doubt with evidence stops
the spend and brings the run to the final sense check as *not yet*, with the blocking doubt
named and the agent's recommendation. The owner's word there redirects the run, which
resumes. A run is done only when its work is merged; *no merge yet* is a state of a run,
and *no merge at all* is not. The checkpoint count holds throughout.

The estate's own record of why this matters: four reviewers hardened a mechanism nobody had
asked whether to keep, because "review happens inside the frame it is handed"
([retrospective](../../reports/agentic-engineering/why-two-expert-reviews-hardened-a-mechanism-that-should-not-exist-2026-09-20.md)).
Alex Ward's team-of-one pipeline
([compared with the Practice](../team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md))
has the same gap: both of its reviewers grade against a ticket its author wrote, and nothing
doubts the ticket. The Attendant's doubt points are the answer to both.

## 4. The sequence

Two kinds of review run inside it. **Internal reviews** are the Attendant's own, by
sub-agents within the run, before the PR is marked ready. **The PR review** is the
repository's, by its configured reviewers and checks, after it is marked ready. The table
separates them.

| Step | Sub-skill (proposed) | Owner | What happens | Doubt: altitude and question | Concepts explored in | Exit |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `attendant` | ✔ initiation | The owner puts forward the idea and asks for the Attendant. The umbrella skill opens the run: a plan node at `sketch`, a branch | — | — | The idea recorded as given |
| 2 | `attendant-shape` | | The idea is analysed and improved. The result is the value contract: beneficiaries and what each gets; outcomes; scope and non-goals; acceptance criteria denominated in value, each with the evidence that would show it met; the size of the run; the doubts raised | **Value.** What is the real user value here, and for whom? How can we deliver it? Does the idea as stated deliver that value, or is there a sharper shape for it? What would make this complete and worthless? | `user-value`, `concept-exploration`, `parallax-frame`, `proportionality`, PDR-103 | The contract, with the value stated, the way to it, and what would show it wrong |
| — | internal review | | **Contract review**: a sub-agent outside the shaping frame assesses the contract for the reliance "build from this unattended" | **Contract.** Would meeting every criterion be worth the cost of meeting it? Which criteria measure activity rather than outcome? What is unprovable? | `assess-specification`, the definition of delivery | The contract and its doubts presented to the owner |
| 3 | `attendant` | ✔ approval | The owner approves the acceptance criteria (the ratification stamp on the plan node) or returns them | — | — | Stamped, or returned to step 2 |
| 4 | `attendant-plan` | | The detailed plan: subplans (tracks) with interfaces and sequence, parallel where tracks are independent. For parallel work the lead sets each track's acceptance criteria, each tracing to an approved value criterion; these need no owner approval | **Approach.** Simplest plan that meets the contract? Simpler if the system changed? Does each track need to exist, and for which value criterion? Are the parallel tracks independent in fact? | `plan`, PDR-132 clause 5, PDR-093, `specify-connection` | Every track names its value criterion and interface; a track with none is cut |
| — | internal review | | **Plan review**: a sub-agent outside the planning frame, with the contract and the plan | the same questions, asked from outside | `assumptions-expert`, `cricket` (frame verdict), PDR-123 | The plan revised or confirmed; doubts recorded |
| 5 | `attendant-build` | | Each track built test-first in its own worktree, by the solo agent or by track agents under the lead | **Track against contract, at each milestone.** Does the track still serve its criterion? Has building it shown the contract wrong? Has it grown past its reason? | worktree isolation, `spawn`, PDR-117, TDD doctrine, the `commit` skill | A track whose review converged within its rounds; a track stopped at its milestone when the doubt holds, its criterion carried as not met |
| — | internal review | | **Track code review**: the reviewer roster on each track's change, in its worktree, before integration; **track value assessment**: the lead (or, solo, a fresh sub-agent) walks the track's criteria with evidence | **Track worth.** Did the track deliver its criterion's value, shown, not claimed? | `invoke-code-experts`, PDR-122, the per-finding disposition concept in `pr-tally` | Each track: criteria met with evidence, or not met with the reason |
| 6 | `attendant-assess` | | The tracks come together: integration, every interface checked, then the overall assessment of whether the implementation delivered the value specified in the plan: the criterion walk (each value criterion met, not met, cannot tell, not applicable, with evidence for every "met") and the holistic perspectives | **Whole worth.** Would the beneficiary notice? Could half of it be deleted? Then engineering excellence, Practice alignment, and whatever else the change calls for | the definition of delivery, `user-value` (assess), `proportionality`, `parallax-audit`, the reviewer roster | Value delivered, shown; or back to step 5 within the plan's budget; or, when it cannot be delivered within the contract, to step 9 as *not yet* with the blocking doubt |
| — | internal review | | **Independent challenge**: a sub-agent that neither planned nor built nor assessed the work challenges the run's whole claim with the contract and the diff | **Frame.** Is the claim "value delivered" the right claim, and is its evidence sufficient? | `parallax-audit`, `cricket` | The claim stands, is narrowed, or sends the run back |
| 7 | `attendant-review` | | The agent believes the value delivered: the PR is marked ready for review. The PR review runs: the repository's configured reviewers and checks; every surface harvested; findings triaged (fixed, rejected with evidence, or routed) within the run's round budget | **Change.** Is each finding worth curing, or is the review producing rounds? Does the PR say what the diff does? Did a cure change what step 6 judged? | `pr-lifecycle`, PDR-128, PDR-140 | Settled: green, clean, every finding dispositioned; a materially changed diff re-opens the criterion walk |
| 8 | `attendant-review` | | The agent judges whether the work is ready for merge: settled, and the value assessment still true of the current head | **Readiness.** What, if anything, in the review iteration changed the value delivered? | the merge doctrine's green, clean and sensible | Ready, with the summary for the owner; or back to step 7 |
| 9 | `attendant` | ✔ sense check | One screen for an exact commit: the worth verdicts, each criterion against its evidence, each doubt and what became of it, what the review iteration changed, cost against the plan, what was left out, the agent's recommendation | — | — | The owner's word on that commit |
| 10 | `attendant-close` | | The agent merges on the owner's word; the plan node is archived; a short retrospective records which doubt points changed something and which did not, and tunes the parameters | **The process.** Which doubt point earned its place this run? | `retrospective`, PDR-130 | Done |

**Solo and parallel.** A solo run collapses the lead's role into the one agent, with one
difference the doubt discipline demands: the track value assessment, the whole assessment
and the independent challenge are delegated to fresh sub-agents, since an agent assessing its
own build stands inside its own frame. In a parallel run the lead sets track criteria and
assesses tracks it did not build; the whole is challenged by a sub-agent that did neither.

**Doubt throughout.** Every sub-skill emits its doubts as a named output. A doubt carries
forward until it is answered with evidence or reaches the owner at step 9. An evidenced
worth-doubt at steps 4, 6 or 8 stops the spend and takes the run to step 9 as *not yet*: the
owner sees the blocking doubt and the agent's recommendation, and the owner's word sends the
run back into the middle at the step the doubt names. Doubts at steps 2 and 3 take a
different path by design: the decision that the value is wanted is the owner's, made at
initiation, so the contract review's doubts about the criteria and their cost are presented
at the approval checkpoint, where the owner shapes or returns the contract.

## 5. Defined, started, observed, done

- **Defined** as the `attendant` skill and its `attendant-*` sub-skills, assembled from
  components. The umbrella carries the flow of §4, the hand-off between sub-skills, the
  three checkpoints, the summary's shape and the run's parameters. Each sub-skill carries its
  stage in its own detail, with its doubt brief as its substance. Components are plain
  files, one definition each, referenced by the sub-skill that needs them and by the existing
  skill the definition was extracted from. Only the stage in hand is in context.
- **Started** by the owner asking for the Attendant with an idea. Nothing builds until the
  plan node carries the owner's stamp.
- **Observed** from records any seat can read: the plan node (sketch, stamped, archived), the
  run's branch and draft PR, and the run's log as comments on that PR, one line per step
  entered and per doubt recorded.
- **Not yet** is a state, never an end: the run holds at step 9 with the blocking doubt and
  the agent's recommendation on the one screen, and the owner's word sends it back into the
  middle. A run has no completed state short of a merge.
- **Done** when the owner's word stands on the merged commit, the criterion walk on that
  commit shows every value criterion met or dispositioned, the plan node is archived, and
  the retrospective is recorded.

Each of those is a skill reading or writing a record the repository and GitHub already hold.
Nothing is built before the first run.

## 6. Could it be simpler?

- **Simpler without loss.** Reading the run's state is reading the plan node and the PR; the
  owner's one screen is `attendant`'s output at step 9; the finish check is its checklist;
  the entry point is asking for the Attendant. Each would otherwise have been a tool.
- **Simpler if the system changed.** The component layer: skills sharing definitions by
  reference instead of restating them. One change to how skills are built, and the Attendant
  assembles from references; the skills estate's duplication falls with it.
- **What is complex, and what gets better when it goes.** Tooling for the stages, rule
  amendments for the parameters, and a merge job for the cloud. Without them there is
  nothing to build before the first run and nothing to break during it, the `attendant`
  skill declares its own parameters, and the cloud merge is answered by a run: the owner's
  word at step 9 and a native merge first, tooling only where a run shows the credential
  constraint blocks it. Attention stays on the doubt points, which are where the value is.

## 7. Held open for the design session

- The sub-skill set: the six proposed in §4 are a starting cut, to be settled by what each
  stage needs in its own detail.
- The sub-agent definitions. Every doubt point dispatches a sub-agent, since only a fresh
  context stands outside the frame that produced the artefact; a skill loads into the
  context that did the work. The sub-skill carries the stage (what it hands the doubter,
  what it withholds, the round budget, how it uses the verdict); the sub-agent definition
  carries the doubter (its lens, its question at that altitude, the contract of what it
  receives and returns); components serve both, as the estate's sub-agent templates already
  do. New doubters: the contract reviewer, the plan reviewer, the track and whole value
  assessors, the independent challenger. One sharp doubter per altitude, several of them one
  definition parameterised by its brief. In a parallel run the track builders are sub-agents
  with a brief, a worktree and no prompts.
- Which parts of existing skills become components, and what each sub-skill adds that no
  existing skill holds; the doubt briefs are the surest additions, since no existing skill
  receives an artefact and a contract while withholding the author's claims.
- The run's parameters and their starting values.
- The credential a cloud run's merge uses, found where a run meets the constraint.
- Single-PR work against larger projects (the Claude Code project facts are in the brief).
