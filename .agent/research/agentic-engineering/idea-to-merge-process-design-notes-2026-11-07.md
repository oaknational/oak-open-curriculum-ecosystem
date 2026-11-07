# An idea-to-merge process: the better of both, and where it doubts itself

**Date**: 2026-11-07 · **Seat**: Juniper seeks Pollen (Claude Code cloud session) ·
**Status**: design notes, input to the design session briefed in
[`idea-to-merge-process-design.prompt.md`](../../prompts/agentic-engineering/idea-to-merge-process-design.prompt.md).
Every prior analysis these notes draw on, the two reports they compare included, is input
to assess critically, never authority. An adversarial Cricket check ran on the first draft;
its redirection (give the worth-doubt the power to end a run; cut rather than accumulate) is
folded in.

## 1. The original request, and the direction measured against it

The request (verbatim in the brief): the owner supplies an idea and outcomes; agents refine
it, plan it, review and improve the plan; the owner signs off the definition of done and
acceptance criteria; pieces are planned and built in parallel, each reviewed and improved to
the standards and criteria; the pieces are assembled; the whole is reviewed from multiple
perspectives, "value over ceremony" first among them; a PR is opened, assessed and
evaluated; the owner checks once; the agent merges. Reusable; high quality and meaningful
reviews at every stage; the owner at the fixed checkpoints only.

Measured against it:

- **The request's quality mechanism is the reviews**, and the owner's later words make the
  mechanism exact: at each stage, step back and ask not only whether the work is right but
  whether what it is trying to achieve is worthwhile. The design below is built from those
  doubt points outward. It is a new skill with sub-skills, assembled from skill components:
  where an existing skill holds a part of a definition the process needs, that part is
  extracted into a plain file that the existing skill and the new skills both reference.
  Existing skills are evidence that a concept was explored; the names in §3 say where. The
  base is zero machinery: skills, sub-agents and the repository's records. Tooling enters
  where a run has shown skills alone fail, never in anticipation.
- **Two touches became three** at the owner's word: initiation, acceptance-criteria
  approval, final sense check. The original "ideation and refinement" touch split into its
  two halves because the approval is where the contract is doubted before anything is built.
- **"Each piece reviewed and improved until it meets the required standards"** is bounded
  here: a piece review has a round budget, and a review that does not converge is itself a
  finding about the piece or the contract, carried to the final check.
- **"Whatever else is good"** stays an open slot in the whole-work review.

## 2. Two systems, each imagined better, and what the better of both leaves out

**Alex Ward's team-of-one pipeline** (the essay of 5 November 2026; compared with the
Practice in
[`team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md`](../team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md)).
Its strength: the contract is one durable record; the builder refuses to start without
acceptance criteria; a reviewer walks the acceptance list with evidence and fails closed;
verdicts bind to a plan revision; iteration has caps; the human stands at the ends. Better:
a reviewer whose job is to doubt the ticket itself before any plan is drawn from it, so two
reviewers agreeing no longer means two reviewers inheriting one wrong assumption; the plan
reviewer's history in the repository, where it survives the chat; a loop that lets one run
change the next.

**The Practice's delivery approaches.** Their strength: skills for exactly the cognitive acts
the doubt points need; a plan estate whose ratification stamp and typed proofs already form
an owner-signed contract; the definition of delivery; a reviewer roster; a settled-merge
discipline; a learning loop. Better: those skills given fixed moments in a delivery process,
so doubting the frame is a stage with an output and an exit and never depends on a seat
remembering to invoke it; "meaningful review" meaning review of the frame as well as of the
work; the stretch between checkpoints run unattended, the contract record carrying the
judgement a Director seat carries in a team.

**The better of both** takes Ward's shape (contract, refuse-to-start, plan review before
build, the evidence-bearing criterion walk, revision-bound verdicts, caps, the human at the
ends) and the Practice's substance (skills as stages, the plan node as the contract,
Practice norms, the learning loop), and adds doubt as a stage at several altitudes. It
leaves out, from Ward: the distinct agent identities, the external ledger and launcher, the
ten-round PR cap; from the Practice: the Director seat, per-fleet pricing ceremony, seat
coordination (claims, queues, heartbeats), and any reviewer whose brief is the work alone
where a doubt brief covers it.

## 3. The process

Three owner checkpoints, fixed. Between them, stages run through skills, one doubt point in
each. A doubt point has an altitude, one question, a sub-skill that asks it, and an exit; the
"asked through" column names where the estate has already worked the concept through, the
place the sub-skill's components are extracted from. The
doubter receives the artefact and the contract and nothing of the author's claims about them.
A doubt changes the artefact, is answered with evidence, or travels to the final check as a
finding; **a worth-doubt with evidence ends the run early**, and the final check takes the
report in place of a PR. The checkpoint count holds either way.

| Stage | Owner | Doubt: altitude and question | Asked through | Exit |
| --- | --- | --- | --- | --- |
| **1. Initiation.** The owner gives the idea and outcomes | ✔ | — | — | Recorded as given |
| **2. Shape the contract.** Beneficiaries and what each gets; outcomes; scope and non-goals; acceptance criteria each with a proof; the size of the run | | **Purpose.** Is the outcome worth having, for whom, and what changes if it arrives? What would make this complete and worthless? Would the better move be a different idea, or none? | `user-value`, with one counterframe from `parallax-frame` | A contract with its worth stated and what would show it wrong; or a recommendation at checkpoint 3 that the idea is better served another way, the run ending here |
| **3. Ratify the acceptance criteria.** The contract goes to the owner with its doubts | ✔ | **Contract.** Would meeting every criterion be worth the cost of meeting it? Which criteria measure activity rather than outcome? What is left unprovable? | `assess-specification`, for the reliance "build from this unattended" | The ratification stamp on the plan node, or the contract returned |
| **4. Plan.** Pieces with interfaces; sequence; parallel only where independent | | **Approach.** Is this the simplest plan that meets the contract? Would it be simpler if the system changed? Does each piece need to exist, and for which criterion? | `plan`, with `cricket` for the frame verdict | Each piece names its criterion and interface; a piece with no criterion is cut |
| **5. Build the pieces.** Test-first, each in its own worktree | | **Piece against contract, at each milestone.** Does the piece still serve its criterion? Has building it shown the contract wrong? Has it grown past its reason? | `cricket` at the milestone with the contract; `code-expert` and the specialists it names for the work | A converged piece; a piece stopped at its milestone when the doubt holds, its criterion carried to stage 6 as not met |
| **6. Assemble and review the whole.** Integrate; check seams; the holistic review | | **Worth.** Would the beneficiary notice? Could half of it be deleted? Then engineering excellence, Practice alignment, and whatever else the change calls for. The criterion walk: each criterion met, not met, cannot tell, or not applicable, with evidence for every "met" | `parallax-audit` as the independent challenge of the run's whole claim; the criterion walk as one reviewer brief with the contract and the diff | A verdict per perspective and per criterion; or the run ends early on an evidenced worth-doubt |
| **7. Pull request.** Opened, assessed, evaluated | | **Change.** Is each finding worth curing, or is the review producing rounds? Does the PR say what the diff does? | `pr-lifecycle`: harvest, triage, bounded rounds | Settled: green, clean, every finding dispositioned |
| **8. Final sense check.** One screen: the worth verdicts, each criterion against its evidence, each doubt and what became of it, cost against the plan, what was left out, the agent's recommendation | ✔ | — | — | The owner's word on an exact commit |
| **9. Merge and learn.** The agent merges; a short retrospective records which doubt points changed something and which did not | | **The process itself.** Which doubt point earned its place this run? | `retrospective` | Done: criteria evidenced, plan node archived, lesson recorded |

**Why the doubt points are the value.** A review inside the frame it is handed improves the
artefact and leaves the frame alone; the estate's own record of four reviewers hardening a
mechanism nobody had asked whether to keep is
[`why-two-expert-reviews-hardened-a-mechanism-that-should-not-exist-2026-09-20.md`](../../reports/agentic-engineering/why-two-expert-reviews-hardened-a-mechanism-that-should-not-exist-2026-09-20.md)
("review happens inside the frame it is handed"). Each stage above has one reviewer whose
brief is the frame: the idea's worth (2), the contract's worth (3), the plan's existence (4),
the piece's reason (5), the whole's worth (6), the review's own worth (7), the process's (9).
The altitudes differ; the question keeps one shape: not only "is this right?" but "is this
worth doing?".

## 4. Defined, started, observed, done

- **Defined** as a new skill with one sub-skill per stage, assembled from skill components.
  The skill carries the stage order, the summary's shape and the run's parameters (the PR
  and token limits the workflow sets for itself, each with its reason); each sub-skill
  carries its stage's doubt question and brief, the brief being its substance. The
  components are plain files, each holding one definition, referenced by the sub-skill and
  by the existing skill it was extracted from.
- **Started** by invoking the skill with the idea and outcomes. Stage 2 opens the plan node
  at `sketch`; nothing builds until the node carries the owner's stamp.
- **Observed** from records any seat can read: the plan node (sketch, stamped, archived), the
  run's branch and draft PR, and the run's log as comments on that PR, one line per stage
  entered and per doubt recorded.
- **Done** when the criterion walk shows every criterion met or dispositioned, the owner's
  word stands on the merged commit, the plan node is archived, and the retrospective is
  recorded.

Each of those is a skill reading or writing a record the repository and GitHub already hold.
Nothing is built before the first run.

## 5. Could it be simpler?

- **Simpler without loss.** The stage read is reading the plan node and the PR; the
  one-screen summary is the final sub-skill's output; the finish check is that sub-skill's
  checklist; the entry point is invoking the skill. Each would otherwise have been a tool.
- **Simpler if the system changed.** The component layer: skills sharing definitions by
  reference instead of restating them. One change to how skills are built, and this process
  assembles from references; the skills estate's duplication falls with it.
- **What is complex, and what gets better when it goes.** Tooling for the stages, rule
  amendments for the parameters, and a merge job for the cloud. Without them there is
  nothing to build before the first run and nothing to break during it, the skill declares
  its own parameters, and the cloud merge is answered by a run: the owner's final-check
  answer and a native merge first, tooling only where a run shows the credential constraint
  blocks it. Attention stays on the doubt points, which are where the value is.

## 6. Held open for the design session

- The name.
- The run's parameters and their starting values.
- The credential a cloud run's merge uses, found where a run meets the constraint.
- Single-PR work against larger projects (the Claude Code project facts are in the brief).
- Which parts of existing skills become components, and what each sub-skill adds that no
  existing skill holds; the doubt briefs are the surest additions, since no existing skill
  receives an artefact and a contract while withholding the author's claims.
