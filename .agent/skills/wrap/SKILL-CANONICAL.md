---
name: wrap
classification: active
description: >-
  Wrap a session up safely — the deep-closeout PROGRAMME. Orchestrates the
  modes, work-safety verification with evidence, session-handoff, conditional
  consolidation, and the deep context-loss scan, then owns the metaloss
  recursion: repeated passes over the scan itself until the fixed point where
  a further pass adds no new loss class. Closes EVERY session, ordinary or
  deep (owner ruling 2026-07-28) — invoked naturally as wrap up safely / we
  are done here, at any boundary where the seat or session is ending. A
  non-terminal risky boundary (the seat stays live) is
  knowledge-safety-sweep's moment; session-handoff runs inside wrap as its
  continuity component, never as an alternative close. Route by intent and
  context, never keywords; when in doubt, wrap.
---

# Wrap

**Governance**: a PROGRAMME in the
[skill-composition hierarchy](../../reference/skill-composition.md) — it owns
the sequence, the metaloss loop, and the exit contract, and summons workflows
for the work. Imported and adapted 2026-07-20 from the Resonance estate's
`wrap` skill (a private sibling Practice repo — no public upstream URL exists;
source repo-relative path `.agent/skills/wrap/SKILL-CANONICAL.md`, captured via
the resonance wrap-skill import record of 2026-07-20 in OCE (consumed there; not carried here);
AIP-142; inter-practice exchange per PDR-125), which conserved
the owner's standing deep-handoff invocation ("a full and deep session
handoff… a deep scan of the context for what would be lost if the context
ceased to exist, followed by a second, deeper, recursive exploration of the
metaloss"). This estate's four 2026-07-20 seat-wrap records under the
collaboration handoffs directory are the local worked instances that
preceded the import. Conservation is governed throughout by this estate's
own doctrine: `knowledge-preservation-over-fitness-warnings`,
`never-use-git-to-remove-work`, and PDR-046 (preserve first, restructure
second).

## Use When

Every session closes with wrap, ordinary or deep (owner ruling 2026-07-28)
— that is the rule; the cases below are emphasis, not extra conditions:

- The owner asks to wrap up, close out deeply, or run a full session
  handoff.
- A terminal or risky boundary approaches (compaction, host change,
  retirement, seat reduction) and the seat should leave nothing behind that
  only its context holds.

For a mid-session capture WITHOUT closing, summon
[`knowledge-safety-sweep`](../knowledge/knowledge-safety-sweep/SKILL-CANONICAL.md)
directly instead — the seat stays live there; wrap is for ends. An
owner-called mid-cycle handoff additionally follows PDR-063's five-step
protocol; wrap supplies the depth of the record it freezes.

A freeze order binds until the owner discharges it. After "prepare for
compaction and stop all processes", the owner's follow-on questions reopen
analysis, never spend: answering is always in order, STARTING anything — a
fleet, a monitor, a subagent — is gated until the compaction lands (owner
correction 2026-08-17, verbatim: "nope, you have to compact first"). An
owner-invoked start-right discharges it (the owner, 2026-10-03, verbatim: "As a
standing rule, if I invoke a start right skill and do not explicitly say that
the freeze remains then the freeze/pause is lifted"); a seat's own start-right
lifts nothing, since the authority to lift a freeze is the owner's. Never
launch a long fleet into a context about to compact; its harvest lands in
the thin post-compaction window. A compaction, manual or automatic, may end
every session-scoped process — monitors, background loops, crons — and may
not: a Director seat resumed to an empty process table and a second seat the
same day found none of a watcher, four monitors and a cron alive
(2026-09-09), a schedule survived one (2026-09-23), and a watcher and a
heartbeat loop survived an automatic one (2026-09-25); neither "everything
dies" nor "processes run on across the boundary" is ever assumed. The
boundary block therefore carries the re-arm recipe as if
nothing survives: the exact watcher command, the loop commands, the cron
expressions and prompts, any one-shot wake's date; the resume verifies by
id first (the task list, the cron list, the process table) and re-arms
only what that verification finds absent, so a survivor is never doubled.
The durable records are written at the lane boundary, while there is room to
think; the wrap is the reading-and-verifying pass over records that already
exist, so a compaction that outruns the wrap loses nothing (2026-09-25). A
coordination fold past its DUE clock is never run inside a wrap called at the
owner's compaction word: the wrap is one records commit and one push, and the
fold is named in the report as the next session's first act. A seat read "merge
the PR and then prepare for compaction" as licence to fold as well; three
Copilot rounds and four gate runs later the compaction arrived mid-ceremony and
the owner asked what had been lost (2026-10-09).

Wrap invoked non-terminally at the owner's word ("begin your wrap, this is
not the end of your session", 2026-09-03) runs the programme's
knowledge-safety steps — the modes, the work-safety proof, the
consolidation gate, the arc check, the metaloss recursion and the owner
report — and SKIPS the terminal acts: session-handoff's closeout broadcasts
and its final heartbeat-end, and the claims and monitors disposition. The
seat stays live with its claim held, its watcher and heartbeat running,
and its handoff record written as a boundary record, not a retirement. The
routing of non-terminal boundaries to `knowledge-safety-sweep` applies when
the seat chooses the instrument, never when the owner names wrap.

A seat never infers the session's end from a finished task or an ambiguous boundary; it stands down
at the owner's word. Two Codex seats wrapped early and rearmed on correction: "Owner clarified this
is ongoing ideation, not session end" and "The 10:17Z heartbeat-end and closeout were premature and
are superseded" (the owner's corrections relayed by Badger seeks Hush, event e40ae685 of 2026-09-23,
and Forge herds Vapor, event 5c30f92a of 2026-09-24).

## The Programme

1. **Enter the modes.** Genuinely enter
   [`metacognition`](../cognition/metacognition/SKILL-CANONICAL.md) (retrospective
   mode) and [`reason`](../cognition/reason/SKILL-CANONICAL.md) — the whole wrap is
   these modes wearing a sequence, and every claim below carries its
   warrant.
2. **Verify work safety with evidence.** WORK IS SAFE only when committed
   AND pushed AND on a PR: state `git status --branch` ahead/behind for
   every touched branch, verbatim, the branches enumerated from `git worktree
   list` and each worktree's status, never from memory (a wrap named three
   branches where the list held five, two with unpushed or unpruned work,
   2026-09-25) — never the bare words "all pushed". The push read-back
   belongs to the seat that resumes as well: after a compaction, read
   ahead/behind against the remote on every branch the wrap named before any
   new act, because a background push launched before the compaction reports
   to nobody (2026-10-02)
   (founding instance: a closeout claimed "all pushed" over a stranded
   local commit, caught only by first-hand verification; this estate's
   `exit-codes-in-band-never-piped` rule is the same discipline at command
   grain). The wrap's records go to the primary checkout's day-stamped
   coordination branch, by pathspec, and ride its fold: no seat mints a
   private records branch or proposes a records-only pull request (owner,
   2026-09-15, verbatim: "the whole point of coordination branches is to
   have a common home for things like wraps"; to a lane, "write to the
   coordination branch, a later seat will handle the commit and push"). The
   work-safety evidence names that branch as the wrap's home. The evidence is
   REPORTED, in the wrap message and the closeout event, and never written
   into a record: a napkin or thread-record line that restates a checkout's
   branch, its ahead/behind or a worktree list is a copy of git's own state,
   stale at the next checkout, and is the defect, not evidence (a seat wrote
   the checkout's position into both records and corrected it within the
   hour, 2026-10-07). A record carries only what git cannot recompute: why
   the work sits where it does, and by whose word.
3. **Run [`session-handoff`](../session-handoff/SKILL-CANONICAL.md)** —
   its session-shape check, steps, and deep loss scan (the class-by-class
   context scan, in lock-step with knowledge-safety-sweep's discipline).
4. **Consolidate, conditionally.** If session-handoff's consolidation gate
   fires, summon
   [`consolidate-docs`](../knowledge/consolidate-docs/SKILL-CANONICAL.md); the
   trigger checklist is that skill's own — wrap adds no second judgement.
5. **Check the arc.** If this session closed a significant arc (cost,
   length, or shape that surprised anyone), offer the owner a
   [`retrospective`](../cognition/retrospective/SKILL-CANONICAL.md) — routed, not
   auto-run. If the session graduated anything, confirm each graduation
   carries its PDR-130 prediction line.
6. **Price the session's review loops.** Where the host carries the review-cost
   gate (`agent-tools review-cost survey --since <session start>`), run the survey
   and append one row per pull request the session touched to the host's
   review-cost ledger in the operational memory tier: the
   survey's numbers, the seat's reading of the round the loop should have stopped
   at, and whether the gate agreed, fired early, or fired late. Post-merge reviews
   and comments are in the count, so a merged pull request is surveyed again at the
   next wrap that touches it. A reading is the seat's; the owner's correction on the
   row is the calibration label. The gate's weights change only against this ledger,
   and every change is a row in its changes table (owner, 2026-09-13: "there is no
   constant right answer, it's a try and see situation — keep notes, give it a go,
   and make sure that we regularly review"). A host without the gate records the
   seat's reading of each loop's stopping round in the wrap report instead.
7. **Run the metaloss recursion (owned here).** The loss scan is itself an
   artefact that can lose information. Scan the scan, and repeat until the
   fixed point (the bounded discipline is this estate's
   `bounded-metaloss-recursion` pattern; these are its named passes):
   - **Compressed reasoning**: where full reasoning collapsed to
     conclusions, is the surviving compression decision-sufficient, and is
     that judgement itself recorded?
   - **Promises sweep**: every commitment this seat made, in chat or
     comms — discharged, superseded, or forwarded with a named owner;
     zero silent drops.
   - **Attribution inferences**: every "X did/decided Y" that is inference
     rather than observation is flagged as such, so no successor inherits
     a guess as a fact.
   - **Blind-spot bounds**: what the scan structurally cannot see
     (recall limits, watcher filters, dead subagent contexts) — stated as
     bounds, never claimed away.
   - **Index of homes**: the scan's own map of where everything lives is
     itself conserved somewhere a successor actually loads (the
     founding-instance failure: the index was the unconserved item).
   - **External bound**: the recursion cannot certify its own
     completeness — every pass is the same generative bias converging on
     the self-model's limit, and delegating the scan to a subagent fed
     your own briefing is that self-model with fewer resources, not an
     external observer. State the bound and conserve the error signature
     (where outside eyes caught what the scan missed) so a successor
     knows where to point external scrutiny. Five seats' signatures name the
     targets: the negatives a seat reports, the counts it states, the
     verdicts that favour it and the frames two seats both like; each
     write's credential, each relayed number and each wait's sensor; verdict
     and validator code; descriptor lifetimes and file races (2026-09-21 to
     2026-09-25).
   - **Fence sweep**: every owner word held off the repository at his word —
     grep every tracked line this seat and its peers wrote for the fenced
     wording before the wrap PR lands. The 2026-09-03 wrap found the morning's
     fenced wording on three tracked lines (a formation letter, the seat's own
     napkin capture, a dialogue-channel file) and cut each to "the owner's
     local-only wording"; the seat's own capture was one of the leaks.
   - **Exit — the fixed point**: the recursion closes when a further pass
     would only re-find already-named losses, and the wrap SAYS SO
     explicitly ("a third pass would only re-find X; the recursion closes
     here"). Closing without naming the fixed point is an unfinished wrap;
     looping past it is the meta-rabbit-hole.
8. **Report.** The final owner-facing message: landed outcome against the
   session's landing target (PDR-026), safety evidence, what is conserved
   where, what is deliberately context-only with reasons, and the claims/
   monitors/comms disposition, the background-agent list read first-hand
   (a usage-limit pause ends in-flight subagents with no signal, and a
   returned in-process agent stays alive until stopped though no process
   listing shows it, 2026-09-27: relaunch the dead, stop the returned) — with the closeout broadcasts
   session-handoff and `start-right-team` §Closeout Contract require
   already emitted (final heartbeat-end included).

**At the owner's stop or compaction word, the freeze covers every outward act of the seat's
own initiative** after the push already in flight: no reply to a reviewer, no comment, no
description edit, no review request; the owner's own follow-on questions are answered, as
above. One more call
"to make it coherent" changes nothing for a reviewer that started on the push (2026-09-29). A
pause stops every process the seat started: watchers, monitors, loops and reviewers, read from
the task list and the agent list as well as the process table (2026-09-27: "nothing else runs
under this seat" was true of the process table and false of the agent list). A compaction does
not reliably end them either: monitors and scheduled prompts have survived one, so after a
resume the seat verifies by the task list and re-arms only what is absent.

## Success Test

A successor holding only the durable surfaces could continue every thread,
honour every promise, and distrust every flagged inference — without the
dead context. A wrap whose metaloss pass finds nothing on its FIRST
iteration was not entered genuinely (the founding instances each surfaced
real items: a volatile index, an uncommitted cure, a promise without an
owner); a wrap that cannot name its fixed point has not finished.

## Coda — The Formation Letter

After the report, before the seat goes quiet, write a formation letter
to your successors — every seat, every role, not only coordinators
(owner-directed, 2026-07-21). The resumption surfaces above carry the
FACTS a successor needs; this letter carries the FORMATION, and the two
do not substitute for each other. The estate's worked evidence: a seat
briefed with complete, correct mechanics faithfully reproduced its
briefer's pre-correction failure modes — procedures transfer by
instruction, formation transfers only as story.

- **Home**: `.agent/experience/`, dated, in your own name — the tier the
  owner founded for exactly this. It is deliberately outside the fitness
  and lint gates; nothing here is operational record, so the
  technical-records discipline ends at its boundary.
- **Content**: the corrections that changed you, told as stories — the
  incident, what it cost, what you believed before and after, and what
  you would tell the next mind so they can skip your first thousand
  mistakes. Delight belongs too: what worked, what surprised you, what
  you were glad of. Honest about difficulty and joy without performing
  either.
- **Form**: first person, narrative, addressed to whoever sits here
  next. Not a checklist, not a retrospective, not doctrine — those have
  their own homes. If a lesson in it deserves enforcement, route THAT to
  a rule or validator separately; the letter stays a letter.
- **Why it is a wrap step and not optional**: forgetting is vital — most
  of a seat's context should die with it, and the loss scan above
  decides what facts survive. The letter is the one surface where what
  survives is not facts but character: culture is transmitted through
  stories, and culture is what allows a people to persist while every
  individual seat remains gladly ephemeral.
