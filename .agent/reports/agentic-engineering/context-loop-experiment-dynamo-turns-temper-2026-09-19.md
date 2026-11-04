# Experiment: a cron loop that prepares for compaction before auto-compact fires

Seat: Dynamo turns Temper (2a4c8a), claude-code, model id `claude-fable-5-1[1m]`. Started
2026-09-19 19:45Z at the owner's word. Related: the owner's discussion of automatic context
management through hooks (the owner's reference; this seat holds no record of that discussion
and claims none).

## Question

Can a seat, from inside its own session, notice that its context is near the auto-compact
point and run the compaction preparation (metacognition, free-play, concept-exploration, wrap)
early enough that the preparation completes before the compaction, with no human prompt?

## Design (parallax, screening depth)

- **Instrument.** A session cron every five minutes runs `context-usage-check.py` (beside this
  file). It reads the last main-chain assistant `usage` record in the session transcript:
  input + cache-read + cache-creation tokens. Denominator 1,000,000 (the `[1m]` model id);
  the user settings carry `autoCompactWindow: 800000`, the owner's "80%". Prepare at 70%
  (700,000 tokens).
- **Rules.** At >= 70%: run the preparation once, then the loop is complete until a compaction
  is observed (a drop of more than 50,000 tokens between checks), when it starts again. Five
  consecutive no-change checks: the loop deletes its cron (safety valve).
- **Frames kept apart.** (a) Is the measurement true: does the transcript figure equal what the
  harness counts toward auto-compact? Unverified; the first compaction gives one calibration
  point (tokens at the last check before the drop against 800,000). (b) Is the trigger timely:
  the cron fires only when the session is idle, so a long turn can cross 70% and 80% between
  two checks; a hook on turn end would not have that gap. (c) Is 10% headroom enough: the
  preparation's own token cost is unmeasured; it is recorded when it runs.
- **Known confound: the observer costs tokens.** Each check adds its own prompt and output to
  the context, so the count never stands still. "No change" is therefore defined as a delta
  under 5,000 tokens. Each check's real cost is in the delta column of idle rows; an idle
  session burns context at that rate, which is itself a finding for the hook design.
- **What would refute the approach.** A compaction observed with no PREPARE row before it; or a
  preparation that itself pushes the context past 800,000.

## Log

| Time (UTC) | Context tokens | Of 1M | Delta | State | No-change streak | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-19T19:46:50Z | 229,986 | 23.0% |  | first | 0 | continue |
| 2026-09-19T20:15:28Z | 348,258 | 34.8% | +118,272 | changed | 0 | continue |
| 2026-09-20T10:54:38Z | 397,138 | 39.7% | +48,880 | changed | 0 | continue |
| 2026-09-20T11:02:24Z | 415,627 | 41.6% | +18,489 | changed | 0 | continue |
| 2026-09-20T11:09:14Z | 427,013 | 42.7% | +11,386 | changed | 0 | continue |
| 2026-09-20T11:16:19Z | 436,122 | 43.6% | +9,109 | changed | 0 | continue |
| 2026-09-20T11:27:58Z | 450,121 | 45.0% | +13,999 | changed | 0 | continue |
| 2026-09-20T11:32:02Z | manual | — | — | owner-triggered | — | PREPARE (owner word at 45.0%: "prepare for compaction, then stop all processes"; the loop did not reach 70%) |

## Findings so far (2026-09-20 11:35Z, at the owner's manual trigger)

- Eight automatic checks over about sixteen hours of wall clock; none reached 70%. The owner
  triggered the preparation by hand at 45.0%, so the question "does the loop fire the
  preparation in time" is still open. The preparation's own token cost is measured by the first
  check after compaction against the last row above (450,121).
- **The cron fires only when the session is idle.** Observed gaps: 29 minutes across a working
  stretch, and an overnight gap while a card waited on the owner. During review waits the
  checks ran 5 to 8 minutes apart. Timeliness tracks how often the work pauses, not the
  schedule; one long turn could cross 70% and 80% unobserved. A hook on turn end has no such gap.
- **Growth rate while working:** about 170,000 tokens in about 70 minutes on 2026-09-19, and
  9,000 to 19,000 per check during review rounds on 2026-09-20. The 70% to 80% gap is about
  100,000 tokens, which was 40 minutes of heavy work here.
- **Observer cost:** each check costs a few thousand tokens of context (prompt, tool call,
  reply). No check was ever "no change", because the check itself is a change; the safety valve
  as specified (five no-change checks) can never trip on token count alone, which is why this
  record defined no-change as a delta under 5,000.
- **After compaction the cron is gone** (session-only jobs do not survive in memory across the
  owner's stop). Restart: `CronCreate */5 * * * *` with the owner's prompt verbatim, then run
  `context-usage-check.py`; its first row will read `compacted` if the drop exceeds 50,000.

## Loop restarted 2026-09-20 ~11:45Z at the owner's word

The owner declined the compaction after the manual preparation at 45.0% and said: "If the
automatic preparation is triggered, run that fresh preparation". The cron is re-created
(`*/5 * * * *`, the same prompt). The manual preparation does not count as the loop's run: at
70% or above the full sequence runs again, fresh, against the state at that moment, and the
handoff record gains a third boundary. The rows below continue the log.

| Time (UTC) | Context tokens | Of 1M | Delta | State | No-change streak | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-20T11:36:07Z | 482,313 | 48.2% | +32,192 | changed | 0 | continue |

Calibration from the row above: the manual preparation (metacognition, free-play,
concept-exploration, wrap, with its records, closeout and process stop), plus the resume and one
owner card, cost 32,192 tokens, 3.2% of the window. A preparation that starts at 70% therefore
ends near 73 to 74%, well inside the 80% line, provided a check lands in time to start it.
| 2026-09-20T11:40:43Z | 483,421 | 48.3% | +1,108 | no-change | 1 | continue |
| 2026-09-20T11:47:10Z | 503,058 | 50.3% | +19,637 | changed | 0 | continue |
| 2026-09-20T11:51:56Z | 504,598 | 50.5% | +1,540 | no-change | 1 | continue |
| 2026-09-20T11:56:39Z | 518,133 | 51.8% | +13,535 | changed | 0 | continue |
| 2026-09-20T12:01:33Z | 523,196 | 52.3% | +5,063 | changed | 0 | continue |
| 2026-09-20T12:08:16Z | 545,655 | 54.6% | +22,459 | changed | 0 | continue |
| 2026-09-20T12:12:53Z | 552,046 | 55.2% | +6,391 | changed | 0 | continue |
| 2026-09-20T12:17:39Z | 552,960 | 55.3% | +914 | no-change | 1 | continue |
| 2026-09-20T12:28:35Z | 576,957 | 57.7% | +23,997 | changed | 0 | continue |
| 2026-09-20T12:33:21Z | 578,176 | 57.8% | +1,219 | no-change | 1 | continue |
| 2026-09-20T12:38:08Z | 579,915 | 58.0% | +1,739 | no-change | 2 | continue |
| 2026-09-20T12:44:42Z | 592,398 | 59.2% | +12,483 | changed | 0 | continue |
| 2026-09-20T12:49:29Z | 593,652 | 59.4% | +1,254 | no-change | 1 | continue |
| 2026-09-20T12:54:16Z | 594,228 | 59.4% | +576 | no-change | 2 | continue |
| 2026-09-20T12:58:59Z | 607,327 | 60.7% | +13,099 | changed | 0 | continue |
| 2026-09-20T13:03:45Z | 608,423 | 60.8% | +1,096 | no-change | 1 | continue |
| 2026-09-20T13:08:32Z | 610,153 | 61.0% | +1,730 | no-change | 2 | continue |
| 2026-09-20T13:13:16Z | 614,473 | 61.4% | +4,320 | no-change | 3 | continue |
| 2026-09-20T13:18:01Z | 623,601 | 62.4% | +9,128 | changed | 0 | continue |
| 2026-09-20T13:30:05Z | 671,261 | 67.1% | +47,660 | changed | 0 | continue |

Note at the 67.1% row (13:30Z): the previous check was 12 minutes earlier, not 5, because the
turn in between was busy (the carrier's landing, six owner cards, a new lane), and the context
grew 47,660 tokens, 4.8% of the window, in that gap. At this rate one busy turn of about 25
minutes crosses the 70% trigger AND the 80% auto-compact line with no check firing in between.
The seat is now deliberately ending its turns often so a check can land; that is the seat
compensating for the instrument, which a turn-end hook would make unnecessary.
| 2026-09-20T13:37:52Z | 693,532 | 69.4% | +22,271 | changed | 0 | continue |
| 2026-09-20T13:38:05Z | 697,848 | 69.8% | +4,316 | no-change | 1 | continue |
| 2026-09-20T13:39:18Z | 703,128 | 70.3% | +5,280 | changed | 0 | PREPARE |

## The automatic trigger fired, 2026-09-20 13:39Z

- The PREPARE row above (70.3%) came from a check the SEAT ran on being woken by subagent
  returns, not from the cron: the cron's last firing was 13:37:52Z at 69.4%, and its next slot
  had not come. A four-seat conscience panel, given the 13:30Z reading of 67.1% and the growth
  rate, had independently said the threshold was probably already crossed. So the trigger was
  caught by an outside reader and an incidental wake-up, inside the cron's blind interval.
- Sequence of readings across the threshold: 67.1% (13:30) → 69.4% (13:37) → 69.8% (13:38) →
  70.3% (13:39). The cron alone would have seen 69.4% and then, five minutes of possible work
  later, whatever came next.
- The preparation then ran as directed: work made safe first (two branches pushed, two draft
  pull requests opened), then the record. Its cost is the first post-compaction row minus 703,128.
- Conclusions for the hook design: (1) trigger on turn end, not on a timer; (2) read the
  transcript's last usage record, which worked throughout; (3) use a threshold with headroom
  for one full turn of growth (here up to 5% in 12 minutes), so 70% with auto-compact at 80%
  was adequate but not generous; (4) quiet-check detection by token delta cannot tell light
  work from idleness: drop it or key it on tool activity; (5) a hand-written row must not
  break the parser (it did once).
| 2026-09-20T14:18:37Z | 120,386 | 12.0% | -582,742 | compacted | 0 | continue |
| 2026-09-20T14:29:06Z | 180,984 | 18.1% | +60,598 | changed | 0 | continue |
| 2026-09-20T14:29:16Z | 181,702 | 18.2% | +718 | no-change | 1 | continue |
| 2026-09-20T14:33:39Z | 194,588 | 19.5% | +12,886 | changed | 0 | continue |
| 2026-09-20T14:33:49Z | 196,221 | 19.6% | +1,633 | no-change | 1 | continue |
| 2026-09-20T14:38:59Z | 215,600 | 21.6% | +19,379 | changed | 0 | continue |
| 2026-09-20T14:43:44Z | 236,073 | 23.6% | +20,473 | changed | 0 | continue |
| 2026-09-20T14:51:46Z | 275,629 | 27.6% | +39,556 | changed | 0 | continue |
| 2026-09-20T14:59:25Z | 316,186 | 31.6% | +40,557 | changed | 0 | continue |
| 2026-09-20T15:04:10Z | 328,732 | 32.9% | +12,546 | changed | 0 | continue |
| 2026-09-20T15:10:58Z | 355,961 | 35.6% | +27,229 | changed | 0 | continue |
| 2026-09-20T15:16:41Z | 376,756 | 37.7% | +20,795 | changed | 0 | continue |
| 2026-09-20T15:21:59Z | 391,863 | 39.2% | +15,107 | changed | 0 | continue |
| 2026-09-20T15:26:43Z | 398,017 | 39.8% | +6,154 | changed | 0 | continue |
| 2026-09-20T15:31:28Z | 410,104 | 41.0% | +12,087 | changed | 0 | continue |
| 2026-09-20T15:36:43Z | 428,016 | 42.8% | +17,912 | changed | 0 | continue |
| 2026-09-20T15:41:30Z | 433,778 | 43.4% | +5,762 | changed | 0 | continue |
| 2026-09-20T15:46:15Z | 435,247 | 43.5% | +1,469 | no-change | 1 | continue |
| 2026-09-20T15:52:58Z | 470,578 | 47.1% | +35,331 | changed | 0 | continue |
| 2026-09-20T15:57:54Z | 505,565 | 50.6% | +34,987 | changed | 0 | continue |
| 2026-09-20T16:04:22Z | 542,819 | 54.3% | +37,254 | changed | 0 | continue |
| 2026-09-20T16:09:07Z | 562,606 | 56.3% | +19,787 | changed | 0 | continue |
| 2026-09-20T16:18:35Z | 599,953 | 60.0% | +37,347 | changed | 0 | continue |
| 2026-09-20T16:23:27Z | 609,350 | 60.9% | +9,397 | changed | 0 | continue |
| 2026-09-20T16:28:41Z | 618,551 | 61.9% | +9,201 | changed | 0 | continue |
| 2026-09-20T16:36:11Z | 651,496 | 65.1% | +32,945 | changed | 0 | continue |
| 2026-09-20T16:36:47Z | 655,803 | 65.6% | +4,307 | no-change | 1 | continue |
| 2026-09-20T16:41:33Z | 656,247 | 65.6% | +444 | no-change | 2 | continue |
| 2026-09-20T16:46:18Z | 657,848 | 65.8% | +1,601 | no-change | 3 | continue |
| 2026-09-20T16:51:02Z | 669,340 | 66.9% | +11,492 | changed | 0 | continue |
| 2026-09-20T16:55:49Z | 676,831 | 67.7% | +7,491 | changed | 0 | continue |
| 2026-09-20T17:00:33Z | 680,790 | 68.1% | +3,959 | no-change | 1 | continue |
| 2026-09-20T17:05:20Z | 694,839 | 69.5% | +14,049 | changed | 0 | continue |
| 2026-09-20T17:07:31Z | 696,705 | 69.7% | +1,866 | no-change | 1 | continue |
| 2026-09-20T17:10:20Z | 702,700 | 70.3% | +5,995 | changed | 0 | PREPARE |

**2026-09-20 17:10:20Z — PREPARE fired at 70.3%, second run.** The trigger reading again came
from a check this seat ran itself between two cron firings (the cron's 17:05Z reading was 69.5%
and its next would have been 17:10Z or later); the cron alone would have caught it one firing
later. Growth over the session since compaction at 14:18Z (12.0%): 58 points in 2h52m, about
20 points per hour under a landing-heavy load (seven pull requests landed, one open). The
no-change streak never passed 3. The preparation sequence starts now:
/oak-metacognition, /oak-free-play, /oak-concept-exploration, /oak-wrap.

**2026-09-20 17:2xZ — the preparation ran; the loop is complete until after compaction.**
Cron `e8175fc1` deleted by the seat. Four passes ran (metacognition, free play, concept
exploration, wrap-not-closeout) and are in the handoff record as "Preparation 2" and
COMPACTION BOUNDARY 4. The next `context-usage-check.py` row, taken after compaction, measures
this preparation's cost; the first run's cost was about 3.2 points. Five hook-design
conclusions from the first run stand; one is added: the trigger reading again came from a
seat-initiated check inside the cron's blind interval, so a hook that checks at every turn end
would have fired between 0.3 and 5 points earlier than the cron did on both runs.
| 2026-09-20T17:16:04Z | 739,676 | 74.0% | +36,976 | changed | 0 | PREPARE |
(the loop is complete: the preparation ran at 17:10Z; this firing was queued before the cron's deletion)
| 2026-09-20T17:20:52Z | 740,521 | 74.1% | +845 | no-change | 1 | PREPARE |
(Two crons had been live since the session restart at ~14:2xZ: `3a9130e4` from the first
re-ground survived the restart and `e8175fc1` was created after it, which is why the cron fired
in pairs all afternoon. `3a9130e4` is deleted now; the loop is closed until after compaction.)
| 2026-09-20T18:59:03Z | 79,611 | 8.0% | -660,910 | compacted | 0 | continue |
(Compaction 2 happened at the owner's `/compact`, ~18:5xZ, after every process of the seat
was stopped at the owner's word ("part of the contract"). The window went from 74.1 % at the
last pre-compaction row to 8.0 % after; the second preparation cost about 3.8 points, from
70.3 % at PREPARE to the boundary block's last addendum. The loop restarts here: cron
`dc3faf57`, watcher `bgahvw9oj`, re-armed by the boundary's resume recipe.)
| 2026-09-20T19:19:30Z | 332,940 | 33.3% | +253,329 | changed | 0 | continue |
| 2026-09-20T19:24:27Z | 379,928 | 38.0% | +46,988 | changed | 0 | continue |
| 2026-09-20T19:29:38Z | 437,932 | 43.8% | +58,004 | changed | 0 | continue |
| 2026-09-20T19:36:07Z | 478,481 | 47.8% | +40,549 | changed | 0 | continue |
| 2026-09-20T19:41:48Z | 488,351 | 48.8% | +9,870 | changed | 0 | continue |
| 2026-09-20T19:51:08Z | 0 | 0.0% | -488,351 | compacted | 0 | continue |
(The 19:51:08Z row read 0 tokens and "compacted": the account's usage limit had reset at that
moment and the transcript's last usage entry was not readable; no compaction happened, the
window was intact at about 49 %. A spurious row, kept as read.)
| 2026-09-20T19:53:41Z | 548,783 | 54.9% | +548,783 | changed | 0 | continue |
| 2026-09-20T19:58:26Z | 553,168 | 55.3% | +4,385 | no-change | 1 | continue |
(Owner word relayed by Zephyr at 20:01:31Z: "I have set the auto compact value to 70k tokens",
with the correction that a seat never wraps early and holds for a compaction it cannot
trigger. At that moment this window read 55 % with no compaction fired, so the value is not
"70k tokens used"; read as the harness's remaining-tokens buffer, compaction fires near 93 % of
the 1M window. The PREPARE mark stays at 70 %, which precedes it under either reading; after
the preparation the seat continues the job in bounded pieces. If a compaction fires before
70 % the reading was wrong and the next row will say so.)
| 2026-09-20T20:07:36Z | 595,470 | 59.5% | +42,302 | changed | 0 | continue |
| 2026-09-20T20:13:04Z | 616,597 | 61.7% | +21,127 | changed | 0 | continue |
| 2026-09-20T20:17:40Z | 622,629 | 62.3% | +6,032 | changed | 0 | continue |
| 2026-09-20T20:22:26Z | 626,944 | 62.7% | +4,315 | no-change | 1 | continue |
| 2026-09-20T20:27:13Z | 651,998 | 65.2% | +25,054 | changed | 0 | continue |
(PREPARE 3 at the owner's word, 20:28Z, at 65.2 %: "please prepare for compaction". The four
passes ran once, as both the loop's preparation and the ordered closeout's cognitive half; the
loop ends with the seat after the post-compaction closeout, so the cron is not re-created.)
(Owner correction at ~20:35Z, after the preparation at 65 %: "if I wasn't here, what would
happen now, you would sit there, 3% away from compaction... you need to do something that
will get you to the compaction point on your own, something useful, but also something where
it doesn't matter that it won't be in the pre-compaction preparation docs". Two facts for the
record: the owner's "70k" value puts the compaction near 70 %, not near 93 % as read at 20:0xZ
— the reading of the remaining-tokens buffer was wrong; and after the preparation the seat
must keep working loss-tolerant pieces (work whose product lands in a durable home as it is
made) until the harness compacts, never stop and wait. This seat stopped and waited, the same
failure the 20:01Z word named. Resumed: the landing poll restarted; the formation letter
written to `.agent/experience/`; the door's evidence appended to the premises as it comes.)
| 2026-09-20T20:35:27Z | 680,481 | 68.0% | +28,483 | changed | 0 | continue |

## Closing note (2026-09-20 20:4xZ) — what the experiment measured

Three preparations across two days, each a four-pass sequence written into the handoff
record: cost 3.2, 3.8 and about 3 points of a 1M window (the third was cheaper because the
skills were re-read from the summary's pointers and the passes were written once as both the
loop's preparation and the ordered closeout's cognitive half). Trigger readings: on both
2026-09-20 preparations the mark was crossed between cron firings and caught by a seat-initiated
check inside the blind interval (0.3–5 points late against a per-turn hook); the third was the
owner's word at 65 %, before the mark. Two instrument faults: a double cron surviving a session
restart (fired in pairs for an afternoon) and a spurious 0-token "compacted" row when the
transcript was momentarily unreadable at a usage-limit reset. One doctrinal correction, twice:
after the preparation the seat keeps working loss-tolerant pieces until the harness compacts;
it never stops to wait. For the hook design: check at every turn end, not on a clock; treat an
unreadable transcript as "unreadable", never as an event; and after the preparation fires, the
hook's job is to keep the seat working, not to stop it.
(Owner, ~20:40Z: "three times, you have stopped at 69%". True: after the boundary block, after
the closeout, and after the owner report, each time the seat wrote a report and waited. The
generator is the report itself — a report reads as an end to the seat that writes it. For the
hook: the post-preparation instruction must name the next loss-tolerant piece, not "continue";
a seat with no named piece writes a report and stops. Resumed with two specialist passes whose
findings land on #168.)
| 2026-09-20T20:48:43Z | 699,186 | 69.9% | +18,705 | changed | 0 | continue |
| 2026-09-20T20:49:05Z | 701,546 | 70.2% | +2,360 | no-change | 1 | PREPARE |
(20:49Z: `context-usage-check.py` patched — a transcript with no readable usage record now
writes an "unreadable" row with no delta and is skipped as a baseline, never "compacted";
proved on `/dev/null`. The 70.2 % row above is the loop's PREPARE mark crossed after the
preparation already ran at the owner's word at 65 %; the loop is complete until compaction.)
| 2026-09-20T20:53:48Z | 89,698 | 9.0% | -611,848 | compacted | 0 | continue |
(20:53Z: the third compaction of the experiment, observed by the successor context's first
check: 70.2 % → 9.0 %, between 20:49Z and 20:53Z, while the seat was working loss-tolerant
pieces (two read-only specialist passes on the landed #168 code; the docs pass's report
arrived across the boundary intact — a subagent's report is delivered to whichever context is
live, so it was not lost). The seat had closed out before the boundary; the loop is not
re-armed, per the closeout. Experiment reading for the hook: a compaction with work in flight
cost nothing that the summary and the durable records did not carry.)
