# A cron loop that prepares a seat for compaction: what a working seat measured

**Dates**: 2026-09-19 to 2026-09-20. **Author**: Zephyr guards Leeward (281e44), claude-code, a
one-million-token window. **Status**: one run, ended; the loop was not re-created after the
compaction of 2026-09-20 and the owner was not asked, so restarting or ending it is the owner's.
This is the tracked copy of a machine-local instrument log; the design, the frames and the
refutation conditions were the peer seat's (Dynamo turns Temper, 2a4c8a), whose record is also
machine-local. One seat, one run: every finding below is an observation.

## The owner's rules for the run

Check the context figure every five minutes. At or above 70 %, run the preparation once
(metacognition, free play, concept exploration, wrap); the loop is then complete until a
compaction is observed, when it starts again. Five consecutive no-change checks end the loop (a
safety valve). Auto-compact was set at 80 %.

## Findings

1. **The cron did not fire while the seat worked.** A scheduled job fires only when the session
   is idle, and a working seat's turns ran back to back, so the seat took its rows by hand. Idle
   is also when context is not growing. A hook on turn end, or on every Nth tool call, has no
   such gap.
2. **A working seat spent about 8,000 tokens a minute when it read large files** (41,496 tokens
   in five minutes, most of it one 440-line read). At that rate the 100,000 tokens between 70 %
   and 80 % are about twelve minutes, or three large reads.
3. **A read can be priced before it is made.** The reader refused a 280-line tail at 27,078
   tokens, and the refusal was the best sizing instrument of the session. A seat needs the cost
   of its next act as well as its level; this graduated into `consolidate-until-done` grounding
   step 7 (price the pass at open).
4. **A bare check cost about 900 tokens**, the same order as a heartbeat: about 11,000 tokens an
   hour for an idle seat, 1.1 % of the window.
5. **The safety valve could not tell "finished" from "waiting on a peer".** Four no-change rows
   accrued while the seat waited for a peer's gate run with a commit pending; a fifth would have
   ended the loop mid-task. A valve keyed on token delta alone reads a blocked seat as an
   abandoned one.
6. **The loop ended by its valve at 60.3 %, correctly, and the trigger never fired.** The seat
   had stopped at 60 % on its own pricing of the next acts, ten points under the trigger, so the
   run measured the observer and not the thing observed. A watcher re-arm plus two replies cost
   2,510 tokens and still read "no-change" under the 5,000-token line, so the line sits about
   right for housekeeping.
7. **The preparation's cost, run at the owner's word and not by the trigger (2026-09-20).** The
   three cognition passes written to the napkin, a wrap, one commit and one push: 16,440 tokens
   in about five minutes. A retrospective between two wraps (a ledger read, a 130-line report,
   two skill edits, a register row, a commit and push): 28,596 tokens in about seven minutes. A
   preparation of this shape fits the 100,000-token margin six times over, provided no large
   read is in flight when the trigger fires: one 440-line read costs more than the whole
   preparation.
8. **The first reading after a compaction is stale.** Straight after a compaction the meter read
   69 %, and one turn later 11 %: the latest usage line was the compaction call's own. The
   `directive-file-context-budget` rule carries this beside the meter command.

## Design of the next run

1. Trigger from a hook (turn end, or every Nth tool call), not from an idle cron.
2. Read the harness's own figure (the statusline's `used_percentage`) beside the transcript's,
   and skip a compaction call's usage line.
3. Trigger on the level plus the projected cost of the preparation (about 16,000 tokens; about
   45,000 with a retrospective), and do not start a read that would cross the line.
4. Give the safety valve a second input: a pending-work flag the seat sets, or an open claim.
5. Pre-register the outcome that matters: the resumed seat's first act is right with no owner
   prompt, against a compaction with no preparation as the control. "The preparation ran" is
   not the outcome.
6. Plan one run that deliberately crosses the trigger, so the preparation's cost and the margin
   to auto-compact are measured by the trigger's own firing.
7. Add a column the seat fills saying what happened in each interval, so deltas can be read.
8. Keep the results in a tracked report from the start.

## Log

| Time (UTC) | Context tokens | Of 1M | Delta | State | No-change streak |
| --- | --- | --- | --- | --- | --- |
| 2026-09-19T19:48:44Z | 517,360 | 51.7% | | first | 0 |
| 2026-09-19T19:53:44Z | 558,856 | 55.9% | +41,496 | changed | 0 |
| 2026-09-19T19:55:12Z | 580,995 | 58.1% | +22,139 | changed | 0 |
| 2026-09-19T19:59:58Z | 584,340 | 58.4% | +3,345 | no-change | 1 |
| 2026-09-19T20:04:48Z | 586,753 | 58.7% | +2,413 | no-change | 2 |
| 2026-09-19T20:09:27Z | 587,676 | 58.8% | +923 | no-change | 3 |
| 2026-09-19T20:14:13Z | 588,498 | 58.8% | +822 | no-change | 4 |
| 2026-09-19T20:18:58Z | 594,471 | 59.4% | +5,973 | changed | 0 |
| 2026-09-19T20:23:44Z | 597,572 | 59.8% | +3,101 | no-change | 1 |
| 2026-09-19T20:28:29Z | 598,367 | 59.8% | +795 | no-change | 2 |
| 2026-09-19T20:33:14Z | 600,877 | 60.1% | +2,510 | no-change | 3 |
| 2026-09-19T20:38:00Z | 601,696 | 60.2% | +819 | no-change | 4 |
| 2026-09-19T20:42:46Z | 602,508 | 60.3% | +812 | no-change | 5 (the valve ended the loop) |
| 2026-09-20T10:48:22Z | 605,849 | 60.6% | +3,341 | taken by hand | |
| 2026-09-20T10:53:09Z | 622,289 | 62.2% | +16,440 | the preparation | |
| 2026-09-20T11:00:27Z | 650,885 | 65.1% | +28,596 | the retrospective | |
| 2026-09-20T11:01:25Z | 656,313 | 65.6% | +5,428 | the second wrap | |

## The 2026-09-21 run (Zephyr guards Leeward, 281e44): a compaction crossed with the loop running

The column the earlier design asked for (item 7) is kept here. Times are read from the clock or
from a tool result; a time the seat could not read is marked as bounded.

| Time (UTC) | Context tokens | Of 1M | Delta | What happened in the interval |
| --- | --- | --- | --- | --- |
| about 16:44Z (recorded before the compaction; the exact read did not survive it) | about 631,000 | 63.1% | | a day of pull-request rounds, a plan, a three-leg design review |
| between 16:44Z and 16:55Z | | | | the context was compacted; the seat resumed from a summary |
| 17:13Z | 158,378 | 15.8% | about −473,000 | post-compaction work: two cures, two pushes, seven dispositions |
| 2026-09-21T17:35:14Z | 338,667 | 33.9% | +180,289 | a re-grounding at the owner's word (five long skill and directive files read end to end), then the opening of a two-seat definition exercise |
| 2026-09-21T17:39:54Z | 358,228 | 35.8% | +19,561 | two conscience-check verdicts received and posted verbatim with dispositions; one peer message; a watcher re-armed |
| 2026-09-21T17:49:32Z | 391,795 | 39.2% | +33,567 | three long peer entries read; the fold landed through the front door; the successor cut and its first commit. The row was written after the push exited: a tick that lands during a push's whole-tree checks cannot write a tracked file without racing them |
| 2026-09-21T18:12:22Z | 523,499 | 52.3% | +131,704 | 23 minutes of one continuous working turn: a two-seat definition exercise carried on a shared channel (long peer entries read in full, three versions of a shared text, two replies composed), two conscience checks, one mis-bounded read that re-printed the seat's own entry. The 50 % line was crossed inside the turn and surfaced to the owner at this tick |
| 2026-09-21T18:21:51Z | 564,604 | 56.5% | +41,105 | a peer seat's seven comms events read in full and a tracked record written of them; a whole-file echo after a shell append (the harness re-prints a file changed outside its editing tools, so appending by shell costs the file's size in context); an outside verdict dispositioned and a fourth version of the shared text posted as replacement lines, never retyped |
| 2026-09-21T18:27:49Z | 584,832 | 58.5% | +20,228 | a co-authored report checked by search instead of read; an echo of about a hundred lines when a peer edited a tracked file on disk; a commit message corrected before use |
| 2026-09-21T18:34:24Z | 623,536 | 62.4% | +38,704 | the compaction preparation, called by the OWNER and never by the loop: the owner read 65 % on their own meter while this instrument read 58 to 62 %. So far: three skills read (free-play, wrap, the handoff's loss-scan step by range), work safety verified per branch, a ledger row, the napkin's reflection, harvest, exploration and loss scan, and a boundary block in the continuity record |
| 2026-09-21T18:42:01Z | 655,773 | 65.6% | +32,237 | the rest of the preparation: a formation letter; the boundary commit and push; a fifth version of the shared text read whole by commit and signed with two changes; pause notices to the peer seat, the channel and the canonical stream; a retired Copilot seat's handoff and letter checked by search and landed for it. The preparation cost 70,941 tokens from its start at 58.5 %, against the earlier design's estimate of 45,000 with a retrospective: work that ARRIVES during a preparation (a peer's version to sign, a retiring seat's records to land) is priced into it, and cannot be refused at a boundary that precedes days of absence. The loop is complete until after the compaction |
| between 18:42:01Z and 18:57:23Z | | | | the context was compacted a second time; the seat resumed from a summary. The level at which it happened and what triggered it were not read, so neither is stated |
| 2026-09-21T18:57:23Z | 132,185 | 13.2% | −523,588 against the last reading | the loop's first tick after the second compaction, fired by the surviving schedule at the seat's first idle moment. All of the work since the resume sits inside this figure: a refused commit diagnosed (six source files read in part, the queue's record read, a traced copy of the ceremony), two commits, a push, the closing report to the owner. The floor straight after the compaction was never read; it is bounded above by this figure. No re-grounding was run, because none was called and a pause follows |
| 2026-09-21T19:02:20Z | 145,015 | 14.5% | +12,830 | nothing but the recording of the tick above: the report edit, a gate-run notice on the channel, a commit and a push. Counted as changed |
| 2026-09-21T19:07:05Z | 146,446 | 14.6% | +1,431 | idle: the check's own cost. Unchanged, one of five |
| 2026-09-21T19:11:50Z | 147,175 | 14.7% | +729 | idle. Unchanged, two of five |
| 2026-09-21T19:16:36Z | 147,936 | 14.8% | +761 | idle. Unchanged, three of five |
| 2026-09-21T19:21:22Z | 148,740 | 14.9% | +804 | idle. Unchanged, four of five |
| 2026-09-21T19:26:07Z | 149,655 | 15.0% | +915 | idle. Unchanged, five of five: the safety valve fired and the loop exited. These six rows were held in the conversation and written here in one commit at the exit |

Findings of this run, each one instance:

1. **The loop did not survive the compaction.** Its schedule is session-only state; after the
   compaction the scheduler listed no jobs, and nothing re-armed it. The seat re-created it
   between 17:16Z and 17:17Z (bounded by the tool results either side, not read from a clock),
   some twenty minutes after resuming, only because it happened to list the jobs. The loop's own text
   says it "must start again" after a compaction; nothing makes that happen. A hook on
   session resume is the candidate instrument, which is what this experiment exists to inform.
2. **Re-grounding is the largest single cost after a compaction**: about 180,000 tokens in 22
   minutes, most of it four files read whole (the team start skill is over a thousand lines).
   A compaction that frees 470,000 tokens and a re-grounding that spends 180,000 of them is a
   net of 290,000. The trigger's arithmetic should price the re-grounding, not only the
   preparation.
3. **The outcome the earlier design pre-registered (item 5) can be read for this run.** The
   resumed seat's first acts were right on mechanical state (the fold, the two pull requests)
   with no owner prompt. They were NOT right on the governing text: the seat applied PDR-140's
   clauses from the summary for half an hour, recording a rebudget, until the owner invoked
   the team start and metacognition skills; re-reading the clause then showed the generator
   question had been run over one finding where the text says the full raised set. A summary
   carries state well and doctrine badly.
4. **A scheduled loop is blind during exactly the turns that matter.** Scheduled jobs fire
   only while the session is idle. Between the 17:49Z and 18:12Z ticks the seat was in one
   continuous turn, so four ticks never ran, and in that gap the context grew by 131,704
   tokens and crossed the 50 % handover line unobserved. The fastest growth happens inside
   long working turns, which is where an idle-gated schedule cannot look. An instrument that
   fires on tool use (a hook) has no such gap; an idle-gated one can only ever report the
   crossing after the fact.
5. **Growth is driven by reading a peer, not by the seat's own work.** The 23-minute interval
   was dominated by a shared channel that two seats append to in whole entries of 40 to 90
   lines; each is read in full because the exercise is about agreeing on words. A collaboration
   surface that both seats must read whole is a context cost that scales with the peer's
   output, which no budget of the seat's own controls.
6. **The trigger never fired; the owner did.** The loop's line was 70 %. The owner called the
   preparation when their meter read 65 % and this instrument read under 60 %, because a pause
   of several days was coming, which no context measurement can know. A level is one reason to
   prepare; an approaching absence is another, and only the owner holds it. The two meters
   also disagreed by some five points at the same moment, so a trigger built on one of them
   inherits an error of that size.
7. **Any file a peer edits while this seat holds it in context is re-printed into this
   context.** The harness echoed a co-authored report back twice, in part, when the other seat
   wrote to it on disk, and once in full when this seat appended to it by shell. A shared file
   costs context on every peer write, not only on this seat's reads; and an append made outside
   the editing tools costs the file's whole size.
8. **The preparation's price, measured by its own firing:** 38,704 tokens from its start to the
   boundary block, before the formation letter, the commit and the closing report. The earlier
   design estimated about 16,000 for the preparation and 45,000 with a retrospective; a
   preparation ahead of a pause of days sits at the upper figure, because the record must
   serve a reader who was never here.
9. **The loop survived the second compaction, which contradicts finding 1.** At 18:57Z the
   scheduler still listed the same job, and it fired without being re-created. After the first
   compaction of the day it listed none. Two compactions, two outcomes, and the seat read how
   neither was triggered, so the difference is unexplained. Finding 1 stands as what happened
   once; it is not a rule that a schedule dies with a compaction, and this seat had begun to
   carry it as one. A hook on session resume is still the instrument that does not depend on
   which outcome occurs.
10. **The first tick after a compaction arrives after the resumed seat's first turn, never
    during it.** The schedule fires only when the session is idle (finding 4), and a resumed
    seat starts working at once. Here that turn spent at most 132,185 tokens, which is small;
    the reading that would matter most, the floor straight after the compaction, is exactly
    the one an idle-gated schedule cannot take.
11. **Finding 3 read again for the second compaction.** The resumed seat continued the
    interrupted diagnosis with no owner prompt, closed the claim the summary named, and did
    not retry the refused commit blindly, all from the summary alone: state carried well.
    Every standing constraint it worked under also came from the summary, with no governing
    text re-read. Two lapses followed: an exit status read after a pipe, and an inference
    about an outside index writer written into a commit message and a channel entry before a
    trace refuted it, corrected in the next commit. Neither can be attributed to the
    compaction from one run; both are recorded so a later run can be compared.
12. **Recording each tick in a tracked file defeats the loop's own safety valve.** One tracked
    row cost 12,830 tokens and a gate run (the edit, a channel notice, a commit, a push),
    against 729 to 1,431 tokens for a bare check. A tick that is recorded that way always
    shows a change at the next tick, so "no change for five checks" can never be met while
    the seat obeys "keep records". The seat changed its record-keeping and said so to the
    owner at the time: idle ticks were held in the conversation and written once, at the
    exit, accepting the loss of at most five readings if the session died first. "Unchanged"
    was read as growth of no more than the check's own cost, since the count itself never
    stands still. A hook that writes its readings to an untracked log, with the tracked
    report written once per run, would not have this conflict.
13. **The safety valve fired as designed once the recording stopped feeding it.** Five idle
    checks at five-minute spacing, 19:07Z to 19:26Z, cost 4,640 tokens in all. An idle seat
    holding a schedule open costs about 900 tokens every five minutes, which is a little
    over one per cent of the window per hour; the valve is what bounds that across a pause.
