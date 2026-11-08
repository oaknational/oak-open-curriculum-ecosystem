# The Attendant Workflow: design notes

**Date**: 2026-11-07, revised 2026-11-08 · **Seat**: Juniper seeks Pollen (Claude Code cloud session) ·
**Status**: design notes, input to the design session briefed in
[`idea-to-merge-process-design.prompt.md`](../../prompts/agentic-engineering/idea-to-merge-process-design.prompt.md).
Every prior analysis these notes draw on, the two reports they compare included, is input
to assess critically; the owner's words, quoted in the brief, are the authority. Terms as in
the brief: *the creation plan* is the design session's deliverable, *the run plan* is what a
run makes after approval, *the run node* is the plan-estate record a run keeps.

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

**Success, provisionally.** The owner's three sentences, the exclusion of cost per run, and
the owner's words on a return to a checkpoint are quoted in the brief under "Success,
provisionally". The author's reading: the three touch points are kinds of moment, and a
return sends the flow back to an earlier point in the graph, from which it continues with
better understanding; every number a run records is information for its retrospective.

The artefacts (skills, sub-agents, components) are means. Every item the brief asks for is
derived from the capabilities below, and an item that serves none of them is cut.

### What we need in order to create that value

1. **Find the real value in a sketch**: turn a one-line idea into a value contract the owner
   recognises as their own and would have written given the time.
2. **Tell whether value was delivered, without the owner**: an assessment denominated in value
   with evidence, by someone outside the builder's frame.
3. **Keep quality without presence**: doubt at each altitude that catches what the owner would
   have caught, and above all the one act the owner still performs for every instrument the
   estate has: pausing the flow and changing altitude, perspective or frame (§2).
4. **Run in the cloud, end to end**, the merge included, unattended between the interaction
   points.
5. **Earn the owner's trust at the two decision screens**: what the owner sees at approval and
   at the sense check lets a good decision be made in minutes.
6. **Survive its own duration**: a run outlives a context window and perhaps a session, and
   resumes from its records.
7. **Be legible to any seat from records**: the owner, a fresh session or a peer can tell
   from what the repository and GitHub hold where a run is, what it has decided and what it
   doubts, without the run's own context.
8. **Learn**: each run improves the next.

### What we understand

The owner's three checkpoints and the sequence; that doubt at altitude is the quality
mechanism; the estate's doctrine on delivery, plan nodes and reviews; what Ward's pipeline
and the lights-on factory do and lack; the estate's measured failure modes (review
treadmills, reviewers hardening a frame nobody questioned, prose disciplines regressing). The
Attendant's middle consists of agents working without the owner present, the condition in
which the estate's record shows frames go uncorrected. Its doubt points are the designed
antidote; nothing yet shows that they work.

### What is unknown, and how each would be learned

| Unknown | How we would learn it |
| --- | --- |
| Can an agent find the real user value from the owner's idea, in this domain, reliably? | The first runs: how much the owner changes the contract at approval is the signal |
| Do fresh-context doubters catch frame errors, or produce doubt theatre? | Per run: doubts that changed something, against their cost; what the owner's sense check catches is the miss rate |
| What must the owner see at approval and at the sense check? | Research in the retrospectives, napkins and lessons (the owner, 2026-11-08: a design question for the next session), refined by runs |
| What has the owner historically caught at review that agents missed? | The same research; the answer is the specification for the doubt briefs and the stepping-back questions |
| What does "value delivered" mean before release? | Doctrine distinguishes landed from released; the claim boundary needs the owner's word |
| What does a run cost? | Measured and reported, as information for the retrospective |
| Why do the existing step-back instruments leave the altitude change to the owner, and what differs in kind? | The component review of §2, against the record of owner corrections |
| Does parallel build pay here, or does assembly consume the gain? | Measurement across runs |
| How does a cloud run merge as the bot? | Designed from the known constraints (the brief's item 8 and facts); the first run confirms the design |
| Does a stated precondition hold an agent in a captured frame to the step-back dispatch? | The first runs: a stage entered without the step-back return on record falsifies it (§2) |
| Is one run node, one branch and one pull request per idea proportionate? | The first runs' friction, read with the brief's item 7 |

### Questions first asked here, and their status

- **What are the Attendant's own acceptance criteria, in value terms?** Answered
  provisionally above (the owner, 2026-11-08).
- **What has the owner historically caught at review that agents missed?** Now a research
  task of the next session; the estate's retrospectives, napkins and lessons hold it.
- **What does an agent need to know at initiation to find real value?** A model of the
  estate's beneficiaries exists in the vision and strategy; whether it serves as a value
  model at step 2 is untested.
- **What holds a run across compactions and sessions**, and what does resuming a run look
  like? Now an expected output of the plan (the brief's item 9, the resumption contract):
  the record a fresh session reads to resume at the right step, what it must not redo, and
  how a second live run is detected.
- **May two runs be live at once**, and what do they share? Folded into the same item.
- **What does the first run teach that only many runs can**, and what must it settle before a
  second starts?

### The decision lenses, in order

1. *Architectural excellence*: the Attendant is a Practice capability, portable across hosts,
   defined in skills, sub-agents and components, learning through the estate's loop.
2. *Strict everywhere*: the checkpoints are fixed structure; the doubt points are not
   optional; every rule holds.
3. *Simpler?* The first increment that creates the value is the checkpoints plus the doubt
   briefs, run by hand on one idea; the rest is added by the friction a real run shows.
4. *Simpler if the system changed?* Asked of every part of the design, by the owner's
   direction: the Attendant is a new way of working, and existing constraints (multiple pull
   requests among them) are questioned during design and development for what becomes easier
   if the system is allowed to change, with every rule and best practice holding. Two answers
   so far: skill components, so the Attendant assembles from references; and a doubt contract
   (artefact plus contract, the author's claims withheld) native to the estate's reviewers,
   which improves every review in the estate.
5. *User value*: proximately the owner; ultimately the people the estate serves.

## 2. Stepping back: the capability the owner still supplies

**The observation** (the owner, 2026-11-08). Planning, metacognition, parts of Parallax, the
other cognitive skills and the Cricket suites have each provided value, and one use of the
owner's attention remains: pausing the flow and changing altitude, perspective or frame. The
first two success metrics measure this directly: an unplanned touch is the owner changing
altitude; a sense check that changes something material is a frame nobody changed in time.
If this act stays the owner's, the Attendant's middle cannot run unattended.

**A hypothesis for the research to test.** Read against the estate's record of owner
corrections, the existing instruments share three properties. They are invoked by the agent
from inside its frame: the agent writes the brief, selects the sources and chooses the
moment, and a captured frame writes a captured brief. Their trigger is the agent's own judgement
that stepping back is needed, the judgement that fails when the frame is wrong. And they
climb one level: metacognition asks about the action's bridge to impact; Cricket judges the
work against the agent's reading; Parallax reframes within a charter the agent wrote. None
climbs until it reaches the owner's stated purpose and asks whether the whole direction
serves it.

**What the capability needs, if the hypothesis holds.** Something that differs in kind from
the five, rather than a sixth of the same kind:

- **Outside the frame.** A fresh context, briefed by a fixed component; its inputs are the
  records and the owner's verbatim words, with the invoking agent's prose withheld.
- **Structurally triggered.** At every stage boundary of the Attendant, and on signals read
  from the record: a cure that grows, churn without convergence, instruments appearing before
  value, the same correction arriving twice, requirements in tension (the owner, 2026-11-08:
  a strong signal to step back and assess the frame). It does not wait for the captured agent
  to call it.
- **Multi-altitude, ascending.** The work in hand; the stage; the plan; the value
  proposition; the bigger picture the estate exists for. Stepping back more than once is the
  climb, and it ends at the top, not at the first level that looks fine.
- **Questions as output.** It returns questions the main agent must answer in writing before
  continuing, with an analysis of what is happening read from the record, and the standing to
  say "stop and climb".

**The work this sets for the design session.** Review the step-back family while decomposing
into components: the `plan` skill's design gate, `metacognition`, `parallax` and its frame,
proportionality and audit siblings, `concept-exploration`, `reason`, `cricket`,
`retrospective`, and the rules `scope-from-goal-before-approach`,
`re-apply-first-question-at-elaboration-boundaries` and `design-from-impact-not-the-cowpath`.
For each: what it does well, which of the three properties above it has, what content, logic
or guidance is missing for questioning the genuinely bigger picture, and in what form that
missing part should exist. Then decide whether a specialised sub-agent carries the
capability, and whether the Attendant's doubters are that sub-agent parameterised by
altitude or separate instruments. The record of the owner's corrections is the evidence base
for both the review and the questions the sub-agent would ask.

**Can the structural trigger be built from native features?** Mostly yes, and the two
halves of the trigger differ.

*At every stage boundary*: yes, by script-free layers.

1. **The skill makes the dispatch a dependency.** Each `attendant-*` sub-skill names the
   step-back agent's return as a required input of the next stage, and the dispatch brief is
   a fixed component, the same text on every call. The design's central bet, stated as the
   hypothesis it is: an agent in a captured frame will rationalise past a reminder and will
   hold to a stated precondition, because starting a stage whose input is missing visibly
   breaks the procedure it follows. Falsifier: a run's record showing a stage entered with no
   step-back return on record. The first runs test it, and a failure is the evidence that
   would send the trigger to a costlier lever.
2. **Sub-agents give the fresh context.** The step-back agent is dispatched through the
   native Agent tool with the record and the owner's verbatim words as its inputs: the
   outside-the-frame property, available today.
3. **A hook is machinery** (the owner's words of 2026-11-08 are in the brief under
   "Machinery"). So the trigger is built from layers 1 and 2 and potentially a supporting
   rule, as the owner allowed: always-loaded or trigger-loaded text that states the
   obligation, so the agent meets it before any skill is open. A rule is the cheapest lever
   for the run and is paid by every session that loads it, so whether the obligation lives
   in a rule or in the umbrella skill is decided by the estate's capability-landing
   procedure. For the record of what a hook could do if a run ever shows those layers fail:
   Claude Code's hooks fire on harness events;
   this estate configures four kinds (`SessionStart`, `PreToolUse`, `UserPromptSubmit`,
   `PreCompact`), each running a script; `SubagentStop` (a sub-agent returning) and `Stop`
   (the main agent ending its turn) would fit a stage boundary if they behave as the author
   believes, which is unverified. One observation, from a single session: this session's
   `SessionStart` hook fired in an ordinary cloud session. The Projects documentation says
   hooks do not run in Claude Code project threads.

*On signals*: partly, and the rest stays unbuilt until a run asks for it. Detecting a growing
cure or churn without convergence as an event needs a script reading the record and computing
a condition, which is machinery. The native alternatives: the step-back agent reads the
signals itself when it runs, since analysing what is happening is its brief and the boundary
trigger brings it in often enough for most signals; and a cadence for long stages through
native scheduling (the estate's heartbeat cron and `Monitor` are the same mechanism), a
dispatch every so many minutes of a stage, so a long build cannot drift unobserved between
boundaries. Boundaries plus cadence, with the arriving agent doing the detection. If runs
show misses clustering between boundaries with the cadence too coarse, that is the evidence
a hook script would need.

**To verify in the design session**: the exact hook events Claude Code offers
and what a `Stop` or `SubagentStop` hook may do in a cloud session, read from Anthropic's
current hooks documentation. Layers 1 and 2 are built from features this repository already
uses; one of them is verified for the target host: repository skills load and invoke one
another in an ordinary cloud session (the session that wrote these notes).

**Research the design session owes on the levers themselves.** What a rule can trigger on
and instigate: in Claude Code a rule under `.claude/rules/` is text loaded always or by path
glob and shapes behaviour; whether it can instigate an action, and under what conditions it
is loaded in a cloud session, is to be read from the documentation and tested, and set
beside the estate's own trigger vocabulary for rules (`surface:`, `tool:`, `session:`,
`ceremony:`), which is convention the agent honours. The composition of the four levers for
the Attendant is a hypothesis the research tests: rules for the invariants that hold across
every run; skills for the flow and the stage procedures; sub-agents for judgement that must
come from outside the frame; hooks as machinery, entering on a run's evidence under the
owner's bar. The estate's capability-landing procedure is the starting map; the research
tests it against what each lever can do in a cloud session.

## 3. What the owner has set

The owner's words are quoted once, with their dates, in the brief
([`idea-to-merge-process-design.prompt.md`](../../prompts/agentic-engineering/idea-to-merge-process-design.prompt.md),
"The owner's words"); these notes point there and do not restate them. In short: the
Attendant Workflow, the `attendant` skill with `attendant-*` sub-skills assembled from
components; zero machinery as the base, with a high bar for any tooling; three fixed owner
checkpoints; the seven-step user story, with doubt explored and valued throughout; every
rule applying strictly, each normal-operations constraint questioned for what becomes easier
if the system changes; end to end in cloud sessions; the next session's output the
decision-complete creation plan.

## 4. The request's quality mechanism

The reviews are the mechanism, and the owner's words make it exact: at each stage, step back
and ask not only whether the work is right but whether what it is trying to achieve is
worthwhile. The sequence in §5 is built from those doubt points outward. Each sub-skill
carries one doubt brief; the doubter receives the artefact and the contract, with the
author's claims about them withheld; a doubt changes the artefact, is answered with evidence,
or travels forward to the final sense check as a finding. A worth-doubt found with evidence
in the middle is the process succeeding (the owner, 2026-11-08, quoted in the brief under
"Direction, and the checkpoints"): the run stops the spend and asks the owner for direction,
in the session, with the evidence and its analysis of what is happening; the owner's
direction sends the run to the point in the graph it names, where it continues with better
understanding. A run ends merged, or abandoned on the owner's word (the owner's words on the
states of a run are in the brief). The checkpoint count holds throughout.

The estate's own record of why this matters: four reviewers hardened a mechanism nobody had
asked whether to keep, because "review happens inside the frame it is handed"
([retrospective](../../reports/agentic-engineering/why-two-expert-reviews-hardened-a-mechanism-that-should-not-exist-2026-09-20.md)).
Alex Ward's team-of-one pipeline
([compared with the Practice](../team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md))
has the same gap: both of its reviewers grade against a ticket its author wrote, and nothing
doubts the ticket. The Attendant's doubt points are the answer to both.

## 5. The sequence

Two kinds of review run inside it. **Internal reviews** are the Attendant's own, by
sub-agents within the run, before the PR is marked ready. **The PR review** is the
repository's, by its configured reviewers and checks, after it is marked ready. The table
separates them.

| Step | Sub-skill (proposed) | Owner | What happens | Doubt: altitude and question | Concepts explored in | Exit |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `attendant` | ✔ initiation | The owner puts forward the idea and asks for the Attendant. The umbrella skill opens the run: a run node at `sketch`, one branch, one draft pull request (the single-carrier shape, a first cut that the brief's item 7 questions) | — | — | The idea recorded as given |
| 2 | `attendant-shape` | | The idea is analysed and improved. The result is the value contract: beneficiaries and what each gets; outcomes; scope and non-goals; acceptance criteria denominated in value, each with the evidence that would show it met; the doubts raised (the run's sizing is the plan's, after approval) | **Value.** What is the real user value here, and for whom? How can we deliver it? Does the idea as stated deliver that value, or is there a sharper shape for it? What would make this complete and worthless? | `user-value`, `concept-exploration`, `parallax-frame`, `proportionality`, PDR-103 | The contract, with the value stated, the way to it, and what would show it wrong |
| — | internal review | | **Contract review**: a sub-agent outside the shaping frame assesses the contract for the reliance "build from this unattended" | **Contract.** Would meeting every criterion be worth the cost of meeting it? Which criteria measure activity rather than outcome? What is unprovable? | `assess-specification`, the definition of delivery | The contract and its doubts presented to the owner |
| 3 | `attendant` | ✔ approval | The owner approves the acceptance criteria or returns them, in the session; the notes propose the run node's ratification stamp as the record the agent writes from that word | — | — | Stamped, or returned to step 2 |
| 4 | `attendant-plan` | | The detailed plan: subplans (tracks) with interfaces and sequence, parallel where tracks are independent. For parallel work the lead sets each track's acceptance criteria, each tracing to an approved value criterion; these need no owner approval | **Approach.** Simplest plan that meets the contract? Simpler if the system changed? Does each track need to exist, and for which value criterion? Are the parallel tracks independent in fact? | `plan`, PDR-132 clause 5, PDR-093, `specify-connection` | Every track names its value criterion and interface; a track with none is cut |
| — | internal review | | **Plan review**: a sub-agent outside the planning frame, with the contract and the plan | the same questions, asked from outside | `assumptions-expert`, `cricket` (frame verdict), PDR-123 | The plan revised or confirmed; doubts recorded |
| 5 | `attendant-build` | | Each track built test-first in its own worktree, by the solo agent or by track agents under the lead | **Track against contract, at each milestone.** Does the track still serve its criterion? Has building it shown the contract wrong? Has it grown past its reason? | worktree isolation, `spawn`, PDR-117, TDD doctrine, the `commit` skill | A track whose review converged within its rounds; a track stopped at its milestone when the doubt holds, its criterion carried as not met |
| — | internal review | | **Track code review**: the reviewer roster on each track's change, in its worktree, before integration; **track value assessment**: the lead (or, solo, a fresh sub-agent) walks the track's criteria with evidence | **Track worth.** Did the track deliver its criterion's value, shown, not claimed? | `invoke-code-experts`, PDR-122, the per-finding disposition concept in `pr-tally` | Each track: criteria met with evidence, or not met with the reason |
| 6 | `attendant-assess` | | The tracks come together: integration, every interface checked, then the overall assessment of whether the implementation delivered the value specified in the plan: the criterion walk (each value criterion met, not met, cannot tell, not applicable, with evidence for every "met") and the holistic perspectives | **Whole worth.** Would the beneficiary notice? Could half of it be deleted? Then engineering excellence, Practice alignment, and whatever else the change calls for | the definition of delivery, `user-value` (assess), `proportionality`, `parallax-audit`, the reviewer roster | Value delivered, shown; or back to step 5 within the plan's budget; or, when it cannot be delivered within the contract, the run asks the owner for direction with the evidence |
| — | internal review | | **Independent challenge**: a sub-agent that neither planned nor built nor assessed the work challenges the run's whole claim with the contract and the diff | **Frame.** Is the claim "value delivered" the right claim, and is its evidence sufficient? | `parallax-audit`, `cricket` | The claim stands, is narrowed, or sends the run back |
| 7 | `attendant-review` | | The agent believes the value delivered: the PR is marked ready for review. The PR review runs: the repository's configured reviewers and checks; every surface harvested; findings triaged (fixed, rejected with evidence, or routed) within the run's round budget | **Change.** Is each finding worth curing, or is the review producing rounds? Does the PR say what the diff does? Did a cure change what step 6 judged? | `pr-lifecycle`, PDR-128, PDR-140 | Settled: green, clean, every finding dispositioned; a materially changed diff re-opens the criterion walk |
| 8 | `attendant-review` | | The agent judges whether the work is ready for merge: settled, and the value assessment still true of the current head | **Readiness.** What, if anything, in the review iteration changed the value delivered? | the merge doctrine's green, clean and sensible | Ready, with the summary for the owner; or back to step 7 |
| 9 | `attendant` | ✔ sense check | One screen for an exact commit: the worth verdicts, each criterion against its evidence, each doubt and what became of it, what the review iteration changed, cost against the plan, what was left out, the agent's recommendation | — | — | The owner's word on that commit |
| 10 | `attendant-close` | | The agent merges on the owner's word; the run node is archived; a short retrospective records which doubt points changed something and which did not, and tunes the run's definition | **The process.** Which doubt point earned its place this run? | `retrospective`, PDR-130 | Done |

**Solo and parallel.** A solo run collapses the lead's role into the one agent, with one
difference the doubt discipline demands: the track value assessment, the whole assessment
and the independent challenge are delegated to fresh sub-agents, since an agent assessing its
own build stands inside its own frame. In a parallel run the lead sets track criteria and
assesses tracks it did not build; the whole is challenged by a sub-agent that did neither.

**Doubt throughout.** Every sub-skill emits its doubts as a named output. A doubt carries
forward until it is answered with evidence or reaches the owner at step 9. An evidenced
worth-doubt at steps 4, 6 or 8 stops the spend and asks the owner for direction, in the
session: the owner sees the doubt, the evidence and the agent's analysis of what is
happening, and the owner's direction sends the run to the point in the graph it names.
Doubts at steps 2 and 3 take a
different path by design: the decision that the value is wanted is the owner's, made at
initiation, so the contract review's doubts about the criteria and their cost are presented
at the approval checkpoint, where the owner shapes or returns the contract.

## 6. Defined, started, observed, done

- **Defined** as the `attendant` skill and its `attendant-*` sub-skills, assembled from
  components. The umbrella carries the flow of §5, the hand-off between sub-skills, the
  three checkpoints, the summary's shape and how a run operates within the estate's
  constraints. Each sub-skill carries its
  stage in its own detail, with its doubt brief as its substance. Components are plain
  files, one definition each, referenced by the sub-skill that needs them and by the existing
  skill the definition was extracted from. Only the stage in hand is in context.
- **Started** by the owner asking for the Attendant with an idea. Building begins when the
  run node carries the owner's stamp.
- **Observed** (capability 7) from records any seat can read: the run node (sketch, stamped,
  archived), the run's branch and draft pull request, and the run's log as comments on that
  pull request, one line per step entered and per doubt recorded. This is the single-carrier
  shape, a first cut; the brief's item 7 asks what becomes easier if it changes.
- **Not yet** is a state of a run: it holds for the owner's word, given in the session.
- **Abandoned** on the owner's word: the run node archived with the reason, the branch and
  pull request closed, the retrospective recorded.
- **Done** when the owner's word stands on the merged commit, the criterion walk on that
  commit shows every value criterion met or dispositioned, the run node is archived, and
  the retrospective is recorded.

Each of those is a skill reading or writing a record the repository and GitHub already hold.
The skills, sub-agents and components are built before the first run; tooling enters on a
run's evidence.

## 7. Could it be simpler?

- **Simpler without loss.** Reading the run's state is reading the run node and the PR; the
  owner's one screen is `attendant`'s output at step 9; the finish check is its checklist;
  the entry point is asking for the Attendant. Each would otherwise have been a tool.
- **Simpler if the system changed.** The component layer: skills sharing definitions by
  reference instead of restating them. One change to how skills are built, and the Attendant
  assembles from references; the skills estate's duplication falls with it.
- **What is complex, and what gets better when it goes.** Tooling for the stages, and a
  per-run negotiation of every limit. Without the first there is no tooling to build before
  the first run and none to break during it. For the limits, no mechanism:
  each normal-operations constraint protects something (unlanded work bounded; changes small
  enough to review; non-convergence visible early), and the Attendant, a new way of working,
  asks of each what becomes easier if the system is allowed to change so that the constraint
  no longer binds in the same way, multiple pull requests among them, proposing the change to
  the owner where one earns its place and improving a rule's incomplete sentence as doctrine
  always is (`rules-have-no-exceptions`). Cost is observed for information; proportion is
  held by judgement, the doubt points and the proportionality lens. The cloud merge is a
  design question answered from the known constraints (the brief's facts): the bot for every
  write, and a blocker surfaced to the owner where no bot path exists. Attention stays on the
  doubt points, which are where the value is.

## 8. Held open for the design session

- The sub-skill set: the six proposed in §5 are a starting cut, to be settled by what each
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
- How a run operates within each constraint (the brief's item 7), with a starting value
  where one is needed.
- The credential a cloud run's merge uses, designed from the known constraints; the brief's
  item 8 and its facts section hold the candidates.
- The run's resumption contract across compactions and sessions, and the detection of a
  second live run (the brief's item 9).
- Single-PR work against larger projects (the Claude Code project facts are in the brief).
