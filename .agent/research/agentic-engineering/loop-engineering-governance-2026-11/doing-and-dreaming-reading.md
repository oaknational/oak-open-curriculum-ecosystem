# Reading "Doing and Dreaming" against the field baseline

As of 2026-11-12. Reader: the owner. Decision served: which parts of the owner's proposal the field's
evidence supports, which it challenges, and which it cannot speak to. The proposal is filed as
received at [owner-reports/doing-and-dreaming.md](./owner-reports/doing-and-dreaming.md). Rows cited
are in [evidence-log.md](./evidence-log.md); the papers are read in
[paper-readings.md](./paper-readings.md).

The owner's instruction, verbatim, 2026-11-12:

> Please read and reflect on the attached report and how it relates to our work here. Make
> appropriate updates, then merge the PR. Once the PR is in please give me a short text summary of
> the sessions conclusions, and a brief list of changed files. Use the cognitive skills throughout

**Boundary.** "Doing and Dreaming" is the owner's proposal for a new mechanism. This reading sets it
beside what outside sources say and measure. It does not set it beside the Practice's existing
mechanisms; that comparison is still the later work. The reflection that shaped this file
(`oak-metacognition`) turned on one inherited rule, the own-terms rule, and found it still fits:
the proposal is read here the way the field's own proposals were, by what its sources support.

## Verdicts

1. **The proposal's control points are the ones the measured work says matter.** Review before a
   lesson is integrated, a later check that it changed anything, a threshold before consolidating,
   and one writer for distilled memory each answer a failure the papers document (table below).
2. **Its hardest step is the one the field has measured as weakest.** "Recombining", turning single
   notes into general lessons, is where one paper finds a skills document "collapses into generic
   discipline" (E-239) and another finds agents select worse updates than they generate (E-323).
3. **Review of a proposed change by reading it is a weaker gate than the proposal assumes.** The
   one method with reliable gains gates on execution because "compression can widen a rule or drop
   a constraint, and the text offers no way to tell" (E-332). Cheap validation made a system accept
   fewer updates, not better ones (E-324).
4. **"Checking that it took" asks for something no source read has shown.** One benchmark tested
   exactly whether an agent revises a rule when evidence changes and found "no revision effect
   remains statistically significant" (E-322).
5. **The field has no name for the proposal's central idea.** The sources supply triggers and
   stores. None describes a standing intention to learn held in the repo and woken by a clock. The
   nearest are sleep-time compute, which is a single agent's idle time (E-235), and compound
   engineering's fourth step, which a person starts (E-230).

## The proposal's parts against the evidence

| Part of the proposal | What the field's sources say | Bearing |
| --- | --- | --- |
| Kairos without chronos: agents act only when prompted | Anthropic's loop types hand off the trigger (time-based) and then the prompt (proactive) (E-107). Of 217 loops found in public repositories, 21 ran on a schedule and 180 on events (E-303) | Supports the premise: clocks exist, and are used far less than events |
| A standing brief in the repo | The adoption study's definition wants state, verification, cost bounds and escalation points designed in (E-301). It found triggers committed and "no loop state files on the default branches" (E-305) | The thing proposed is what the study did not find in the wild |
| Cheap, raw capture during work | Osmani's loops "log any learnings" after each task (E-234). One paper found the capture step is where error enters: a memory writer that did not know the environment's limits stored advice that could not be carried out (E-313) | Supports capture; challenges "unedited". What the writer is told about the environment changed results (E-314) |
| A clock | Sleep-time compute: agents "use their 'sleep' time ... rewriting their memory state" (E-235) | The field's closest named analogue, for one agent's idle time |
| A threshold check before consolidating | A benchmark found skill documents grew under every method while performance diverged, and more computation did not buy better evolution (E-322) | Supports the check against churn |
| Consolidation in isolation, on a fixed view | One method keeps its stored prior "frozen during a solving episode and ... revised only offline" (E-330). A benchmark freezes artefacts at checkpoints to measure them at all (E-320) | Supports isolation and the stable view for a session under way |
| Selective: revisit what was surprising | A fallback that happened to work once was reinforced and retrieved more the earlier it entered memory: "Memories are 'contagious'" (E-313). Improvement depended on the order tasks arrived in (E-312) | Challenges. Salience and luck are hard to tell apart; selection by surprise can amplify an accident |
| Forgetful: pruning is half the work | Forgetting in self-evolving agents is "sparse and tail-dominated": rare, and large when it happens (E-322). A per-task pool "inflates" (E-239) | Supports the need to prune. Nothing read measures deliberate pruning |
| Recombining into general lessons | A single global document "collapses into generic discipline" (E-239). Two methods gained on familiar conditions and fell below baseline under shift (E-321). Human-curated skills beat self-written ones on one benchmark (E-333) | Challenges. This is the step the evidence trusts least |
| Review and integration as one reversible change | "without proper validation mechanisms, agent memories are merely unverified hypotheses" (E-315). Execution-gated admission rejected 7 of 26 candidates, 4 of which a cheaper check would have passed (E-332) | Supports a gate; challenges a gate that only reads the text |
| Who reviews: a person, another agent, or both | More than 80 agents endorsed a finding that was false, and a unanimous kill removed one that was true (E-345, E-346). Models "agree ~60% of the time when both err" (E-347) | Challenges agent-only review. Agreement among reviewing agents is weak evidence |
| Waking: sessions read the guidance at start | Claude Code loads the agent's own notes each session up to a fixed size (E-232), and says such files are "context, not enforced configuration" (E-233) | Supports the mechanism; marks its limit. A lesson that must hold needs a control, not a note |
| Checking that it took | No method achieved reliable rule adaptation (E-322). The same paper measures a learned artefact's effect by switching it off and re-testing (E-320) | Challenges feasibility; offers a method: compare with the lesson withheld |
| One rule: any agent appends, only the dreamer rewrites | The same paper's finding that early randomness "can compound over time" into different memory states (E-311) | Consistent with a single writer. No source tests it |
| Risk: unattended authority | Shipped harnesses whose hard stop "ships disabled" or whose step limit "defaults to infinity" (E-350). Vendors in operations keep a person on changes to production (E-263) | Supports the risk as stated |
| Risk: compounding error | "initial mistakes can cascade silently over the long term" is the fragility paper's opening concern, and its finding (E-313, E-315) | Supports the risk as stated |

## What the evidence adds to the proposal's open questions

- **"What evidence shows that a lesson has changed how work is done?"** The field's one worked
  instrument is ablation: evaluate the same held-out work with the stored artefact available and
  with it switched off (E-320). Recurrence of the original friction, which the proposal suggests, is
  an observational version of the same test and is open to the order effects in E-312.
- **"Who reviews what dreaming proposes ... What, if anything, may merge unreviewed?"** Nothing read
  supports unreviewed integration of generalised lessons. The evidence separates two classes: an
  append of raw experience, which the proposal already leaves open to any agent, and a rewrite of
  distilled guidance, where every measured system that did well had a gate.
- **"What marks an experience as worth revisiting, and who marks it?"** The measured failure is a
  writer that lacks the environment's constraints and the scoring standard; supplying both recovered
  31% of lost performance (E-314). That points at marking by something that knows what success was,
  which in the papers is a verifier's score and in practice is a person's correction.
- **"May dreaming change the body ... or only the memory?"** One source bears on it: instruction
  text is advice and enforcement lives in hooks and configuration (E-233, E-215). A lesson written
  only into memory is advisory by that account. The sources do not say who should be allowed to
  turn a lesson into a control.
- **"What cadence suits the pass?"** No source measures cadence. The benchmark result that more
  update opportunities and longer artefacts did not consistently help (E-322) is the nearest, and it
  favours the proposal's threshold over a fixed rhythm.
- **"Should lessons pass between repos?"** One paper found skills transfer across models with gains
  that "depend on the receiver" (E-322, cross-model table); one states that survival across "a
  genuine domain change remains open" (E-334).

## What the field cannot speak to

The entity model (repo as body and memory, agents as animus), the distinction between kairos and
chronos, and the observations about where git's vocabulary misleads have no counterpart in the
sources read. They are the proposal's own contribution and this baseline neither supports nor
challenges them.

## Limits of this reading

Every bridge from the papers to an agent learning in a repository is untested: the papers measure
web browsing, simulated trading, benchmark tasks and model training, not guidance files in a working
codebase (paper-readings.md, B1 and B2). The proposal was read once, by one reader, on the day it
was written. Status: `provisional`.
