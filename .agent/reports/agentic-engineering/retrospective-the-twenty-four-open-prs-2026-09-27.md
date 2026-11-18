# Retrospective: the twenty-four open PRs, 2026-09-25 to the limit (2026-09-27)

Author: the Director (Wick binds Temper, ed7b48), at the owner's ratification of 2026-09-27
(answer 6, "The Director"), on the trigger re-anchored at suite 26 and ratified the same morning
(answer 5): the first fold moment at which the non-coordination count across both estates reads
at or under the limit and the eight drain rows have landed. Drafted from 09:5xZ on 2026-09-27
after suite 28's return; the record is dated to the fold moment that satisfies the trigger. Modes:
metacognition (retrospective) and reason throughout; a bounded free-play pass at the end.

Home: `.agent/reports/agentic-engineering/` on the lineage; a pointer in JC.net's index. Sources
are named per line: the GitHub PR list read by `gh pr list --state all --limit 300 --json
number,createdAt` at 09:5xZ on 2026-09-27 (55 rows created from 2026-09-25 to that instant; the
count recomputed with the explicit limit at 15:5xZ on the 27th, 55 again; the default limit of 30
would have truncated it), the check-in blocks of the Director's napkin on JC.net's coordination
branches (check-ins 24 to 33), the two estates' comms streams, the plan report
`.agent/reports/agentic-engineering/2026-09-26-the-estates-programme-plan.md` and its two
amendment notes, and the owner's words quoted verbatim in those records.

## 1. The question

Why did the lineage's open pull requests reach twenty-four on the morning of 2026-09-26 with
nothing merging for twelve hours, what it cost, when the arc could have gone right, and which
proposals carry a warrant and a falsifier. The owner's word that framed it (2026-09-26, about
10:09Z, verbatim): "work is safe when it is merged, the target number of open PRs is always zero.
24 open PRs is a process failure and creates a risk of losing work and creating rework".

## 2. The timeline, from the forge and the records

Counts are open non-coordination pull requests on the lineage (EngraphCode/open-curriculum-
ecosystem) unless a line says otherwise; every instant is the forge's `mergedAt` or `createdAt`,
or the record it names.

| merged (UTC) | by | files | PR | opened (UTC) |
| --- | --- | --- | --- | --- |
| 2026-09-25T22:07:22Z | app/el-graphael | 15 | 233 | 2026-09-25T18:33:25Z |
| 2026-09-25T22:24:18Z | app/el-graphael | 3 | 242 | 2026-09-25T20:46:35Z |
| 2026-09-26T10:32:37Z | app/el-graphael | 3 | 241 | 2026-09-25T20:39:35Z |
| 2026-09-26T10:35:07Z | jimCresswell | 1 | 240 | 2026-09-25T20:12:53Z |
| 2026-09-26T10:41:59Z | jimCresswell | 1 | 211 | 2026-09-25T11:57:03Z |
| 2026-09-26T10:42:36Z | jimCresswell | 1 | 229 | 2026-09-25T18:01:35Z |
| 2026-09-26T10:43:00Z | jimCresswell | 1 | 235 | 2026-09-25T18:38:25Z |
| 2026-09-26T10:43:27Z | jimCresswell | 1 | 243 | 2026-09-25T21:48:03Z |
| 2026-09-26T10:43:52Z | jimCresswell | 1 | 247 | 2026-09-26T09:56:29Z |
| 2026-09-26T10:44:38Z | jimCresswell | 2 | 226 | 2026-09-25T17:52:31Z |
| 2026-09-26T10:45:28Z | jimCresswell | 3 | 231 | 2026-09-25T18:23:29Z |
| 2026-09-26T10:46:01Z | jimCresswell | 3 | 236 | 2026-09-25T18:56:17Z |
| 2026-09-26T10:47:06Z | jimCresswell | 4 | 220 | 2026-09-25T16:14:09Z |
| 2026-09-26T10:47:31Z | jimCresswell | 4 | 232 | 2026-09-25T18:32:35Z |
| 2026-09-26T10:48:39Z | jimCresswell | 5 | 237 | 2026-09-25T19:02:05Z |
| 2026-09-26T10:50:00Z | jimCresswell | 7 | 216 | 2026-09-25T15:40:47Z |
| 2026-09-26T11:13:48Z | jimCresswell | 11 | 234 | 2026-09-25T18:35:52Z |
| 2026-09-26T11:14:18Z | jimCresswell | 14 | 244 | 2026-09-25T22:11:21Z |
| 2026-09-26T11:14:32Z | jimCresswell | 20 | 238 | 2026-09-25T19:09:43Z |
| 2026-09-26T11:14:53Z | jimCresswell | 23 | 218 | 2026-09-25T15:49:01Z |
| 2026-09-26T12:09:25Z | app/el-graphael | 16 | 223 | 2026-09-25T17:11:20Z |
| 2026-09-26T12:35:57Z | app/el-graphael | 1 | 248 | 2026-09-26T11:03:46Z |
| 2026-09-26T13:08:50Z | app/el-graphael | 12 | 224 | 2026-09-25T17:41:11Z |
| 2026-09-26T15:11:50Z | app/el-graphael | 5 | 251 | 2026-09-26T12:45:02Z |
| 2026-09-26T15:38:20Z | app/el-graphael | 1 | 255 | 2026-09-26T15:04:16Z |
| 2026-09-26T15:57:38Z | app/el-graphael | 6 | 252 | 2026-09-26T12:55:00Z |
| 2026-09-26T16:16:52Z | app/el-graphael | 11 | 221 | 2026-09-25T16:41:15Z |
| 2026-09-26T16:38:41Z | app/el-graphael | 1 | 258 | 2026-09-26T15:29:51Z |
| 2026-09-26T19:39:28Z | app/el-graphael | 4 | 257 | 2026-09-26T15:20:30Z |
| 2026-09-26T19:56:13Z | app/el-graphael | 5 | 259 | 2026-09-26T16:31:14Z |
| 2026-09-26T20:16:22Z | app/el-graphael | 13 | 249 | 2026-09-26T12:25:54Z |
| 2026-09-26T20:37:36Z | app/el-graphael | 13 | 217 | 2026-09-25T15:47:52Z |
| 2026-09-26T20:58:48Z | app/el-graphael | 16 | 253 | 2026-09-26T14:57:16Z |
| 2026-09-26T21:23:06Z | app/el-graphael | 20 | 246 | 2026-09-26T09:50:16Z |
| 2026-09-26T21:45:08Z | app/el-graphael | 30 | 256 | 2026-09-26T15:11:04Z |
| 2026-09-27T09:06:12Z | app/el-graphael | 45 | 245 | 2026-09-25T22:23:24Z |

The table above: every lineage landing from 22:00Z on 2026-09-25 to the drain's last row, with
the merging hand (`app/el-graphael` is the estate's merge bot, the seats' door; `jimCresswell` is
the owner by hand). Read against it:

- 2026-09-25, 00:22Z to 22:24Z: twenty-one landings through the door (the merged list read from gh
  at 09:5xZ on the 27th; the table above starts at 22:00Z and shows the last two of them, 233 and
  242), the last (242) at 22:24Z;
  the seats opened faster than the door landed through the evening (the opened list: 55 rows
  created since 2026-09-25 across both days at 09:5xZ on the 27th, read at the same instant).
- 22:24Z on the 25th to 10:32Z on the 26th: no landing for twelve hours; the harness paused
  every seat from 22:32Z to 09:49Z (the plan report §The mechanism, read from the seats' records
  and the stream), and PR 241, BLOCKED on six threads, held the readiness slot through the pause.
- 10:10Z on the 26th: twenty-four open (seventeen green, zero-thread and BEHIND; 241 BLOCKED; 240
  red; 211 conflicting; four drafts), the plan report's first-hand count.
- 10:32Z: 241 landed through the door (Swallow) under a Director ruling. 10:35Z to 10:50Z: the
  owner landed thirteen by hand in changed-file order (one-file PRs first) under the ruleset
  bypass; 11:13Z to 11:15Z, four more (234, 244, 238, 218). Ten open at 10:52Z, seven at 11:2xZ.
- 12:09Z to 16:38Z: the folds (223 at 12:09Z), then the seats' door: 248, 224, 251, 255, 252, 221,
  258 (seven landings) while fourteen new PRs opened between 09:50Z and 16:31Z (246 to 259:
  twelve by the seats, 250 by the owner, 254 the coordination draft); the count read
  twelve at 15:47Z (check-in 28) and nine at 19:24Z (the owner's word).
- 19:2xZ: the owner's WIP limit ("three other open PRs each between them", one coordination PR per
  repository). 19:39Z to 21:45Z: seven landings through three seats and eight slot handovers with
  no Director word on the order (257, 259, 249, 217, 253, 246, 256); one opening by the rule (260
  at 21:49Z, Siren's wording PR); the count three after that opening (nine, minus seven, plus one;
  check-in 30's gh read at 21:47Z already showed three, two minutes before 260's recorded open
  time, a straddle recorded as read and not explained).
- 21:54Z: 245 door-ready at the slot (both legs, CI green); Myrtle's wake on its leg wait was
  lost and the slot sat door-ready until 09:05Z on the 27th (Myrtle's 09:05:49Z line); 245 landed
  at 09:06:12Z, the drain's eighth row; the count two.
- 09:1xZ on the 27th: the owner's thirteen answers; 09:2xZ the start word; by 09:55Z the count
  three by open PRs (250 the owner's lane, 260, and JC.net's 224, the runbook twin) with the
  reader's draft behind them, the folds of 215 and 254 at the door.

## 3. The causal stack, by depth

Each layer answers why the layer above was possible; the stack stops where the next "why" leaves
the estate's control.

**Technical root: a serial door under strict currency.** The engraph ruleset (21202096) requires
every branch up to date before merge (`strict_required_status_checks_policy: true`, read
first-hand on 2026-09-26). Every landing therefore knocks every other open PR BEHIND, and each
landing costs one sync push plus the full CI on the synced head (13.5 to 15 minutes across the
day's landings) before the bot can merge. The door's ceiling is about one landing per seventeen to
twenty-four minutes with a seat continuously at it (measured from the table in §2: seven landings
between 19:39:28Z and 21:45:08Z on the 26th, the six intervals between them from sixteen minutes
forty-five seconds to twenty-four minutes eighteen seconds, twenty minutes fifty-seven seconds on
average; the drain's eighth landing, 245, came at 09:06Z the next morning after the pause). A
merge queue is not the cure: the required "CodeQL" check is the code-scanning app's, which never
reports on a `merge_group` ref while codeql-action#1537 stays open (verified by the assumptions
reviewer on the 26th; ADR-204 amended by PR 255).

**Process root: an unbounded intake against a bounded door.** Opening a PR was free and landing
cost a door turn. On the 25th forty PRs were opened (the opened list, rows created that day)
and the door landed 21; the exchange lane cut one PR per register row, twelve in one evening.
No rule bounded the intake, and the owner's 10:50Z answer that morning kept it so ("No bound")
until the count sat at nine for the evening and the owner set the limit at 19:2xZ. Behind it, two
process amplifiers: each sync push re-opened a review round on unchanged text (the seats' own
identity re-requested Copilot two minutes after every sync, and the Codex connector reviews every
push and, as suite 28 found, unchanged heads on its own clock), and the readiness slot that
serialises the door is hand-run by a live seat, so a BLOCKED holder across a harness pause held
the door for eleven hours (241 through the 25th's night; 245, door-ready, through the 26th's).

**Meta root: the counting surface measured intake, not lead time.** Every check-in counted open
PRs and landings, so a rising count read as "work in progress" rather than as lead time
accruing on work already done. The register's rows were the unit of work, and "one PR per row"
was the lane's shape by design (small PRs, fast review), which priced the review round but not
the fixed cost per PR: the slot turn, the CI, the two bot legs, the claim, the worktree, the
records commit and the branch deletion. The owner named this on the 26th at 11:01Z ("there are
flat costs that dominate for tiny PRs ... an optimum in the effort to value curve that is well
above a single line change"), and PDR-132's cost model gained the fixed term the same day (PR
212 on JC.net, 249 on the lineage). The next "why", the harness's overnight pause of idle seats
with no backstop, is outside the estate's control and is named under the proposals as the thing
the estate can only detect, not prevent.

## 4. The counterfactual test

When could the arc have gone right? The strongest counterfactual is inside the same arc: the
segment from 19:2xZ to 21:49Z on the 26th ran under the cured process (the WIP limit, the seat
door in changed-file order, the ready list, one sync push per landing) and took the count from
nine to three in two hours twenty-one minutes with seven landings and one opening (two the next
morning, when 245 landed at 09:06Z), across three seats and eight slot handovers with no Director
word on the order (check-ins 30 to 32). The uncured segment, the evening of the 25th, landed
twenty-one and opened thirty-three, and the count rose while the door ran flat out. The difference
is not the door's speed (the same ceiling held in both segments) but the intake: under the limit
no seat could open past three, so every seat's next act was a cure or a door turn, and lead time
per PR fell to the door's own turn. The owner's hand is the other counterfactual: seventeen
landings in forty minutes under the ruleset bypass, in changed-file order, on the 26th morning. It
is a real capability the Practice cannot copy (the bypass is the owner's), but its order (smallest
first) is the door's order now, and its price was paid forward: engraph's push CI on the final
owner-landed tip (81e126e8e) had to be read green before the seat door resumed, and two of the
fast landings drew fix-forward cures the same afternoon.

## 5. Honest credit

The cost bought things that hold. The readiness slot protocol (one holder, one sync push, legs,
merge, release) is landed doctrine in pr-lifecycle §Phase 7 on both estates, and eight handovers
ran on it in one evening with gaps of seven to forty-seven seconds. The WIP limit is the owner's
rule and is being worded by PR 260 with its reservation-first serialiser, which suite 28 watched
work without the Director: Siren reserved, found Swallow's earlier reservation, asked; Swallow
withdrew; the twin opened. The cost model gained its fixed term. The fold cadence went to twice a
day and the DUE check carried a fold across a missed moment. The bot merge path (merge-bot merge,
both legs, the verdicted sha) landed thirty-seven PRs on the lineage over the 25th and 26th
(twenty-one and sixteen by the merged list read from gh at 15:3xZ on the 27th, the two
coordination folds 187 and 223 among them; the owner's hand landed seventeen more) without a
squash or an unverdicted merge. And the estate now has words for the mechanism: an unbounded
intake against a serial door under strict currency, with self-inflicted rounds and a hand-run slot
as the amplifiers.

## 6. Proposals, each with its warrant, its falsifier and its PDR-130 lane

1. **The reservation-first serialiser with a bounded count** (fast lane; landing as PR 260's
   wording in pr-lifecycle §Phase 7, JC.net's twin by the exchange). Warrant: at a count one
   below the limit two seats can read the same forge state and both open (the Codex connector's
   P1 on 260, 2026-09-26 22:00Z); on 2026-09-27 at 09:48Z the order worked without the Director
   (Siren reserved, found Swallow's earlier reservation, asked; Swallow withdrew; the twin opened
   as PR 224). Falsifier: two non-coordination PRs open within one minute of each other past the
   limit while both seats posted reservations.
2. **A reservation is followed at once by the branch's push and its draft PR, or withdrawn**
   (fast lane; the same clause). Warrant: suite 28 found a reservation held for ninety minutes of
   local work while the owner's word is absolute ("All useful work must be pushed and in a PR or
   merged ... This is always true") and worktree-hygiene §1 admits no worktree holding work
   without a PR. Falsifier: a draft opened at reservation draws reviewer rounds before its
   ready-mark (a probe on the next draft: does the Codex connector review a draft's pushes?), in
   which case the draft costs what it saves and the rule reverts to "reserve, then open when
   ready" with a stated bound on the wait.
3. **The sync-lineage binding is worth its door turn** (fast lane; Swallow's design note
   `2026-09-26-sync-lineage-binding-design.md`, P1 on the ledger). Warrant: the design was
   deferred on a sample where one tip move in seven was a pure sync; the drain's eight landings,
   read from their timelines at 09:5xZ on the 27th, show eight of eight with a pure sync as the
   last commit, Copilot re-requested and re-run after it on every one and the Codex connector
   re-running on three (249, 217, 246): under the readiness slot every landing pays at least one
   review round on unchanged content, about three to five minutes of the door's turn and one
   round of the budget. Falsifier: a bound review on a synced head lets a semantic change through
   that the exact-oid rule would have caught (the design's own residual: patch-id equality with a
   context change; the checks on the new head cover the context).
4. **The slot's release predicate reads the holder's last state line, and the pinging seat takes
   the freed slot and runs a door-ready holder's door** (fast lane; pr-lifecycle §Phase 7's slot
   bullet). Warrant: 245 sat door-ready from 21:54Z on the 26th to 09:05Z on the 27th with an
   awake seat pinging at 22:5xZ; the holder's monitor kept its heartbeat going every four minutes
   all night (168 heartbeats from 21:53Z to 09:04Z, the longest gap four minutes, read from the
   lineage stream at 15:5xZ on the 27th) while its wake on the leg wait was lost, so the rule's
   release predicate (heartbeat and state lines both silent for twenty minutes before an
   unanswered ping frees the slot) never fired and the slot was never freed; the rule also named
   no taker, and the awake seat waited ("unsure whether I was waiting correctly or just waiting",
   Siren's letter). The cure is the predicate first: a holder's liveness for the slot is the age
   of its last state line (a gate notice, a slot line, a check-in, any titled line that is not a
   heartbeat), never its heartbeat, which a monitor emits for a seat whose turn is lost; a state
   line older than twenty minutes plus a ping unanswered for twenty minutes frees the slot, and
   the pinging seat takes it and runs the holder's door when the holder's legs and checks are
   green on its head. Falsifier: a seat running another seat's door merges a head whose legs were
   not on it (the bot refuses an unverdicted merge, so the failure would have to be a wrong
   reading of the legs; one instance reopens the proposal); or a holder mid-gate loses its slot to
   the predicate while its gate notice is under twenty minutes old (one instance reopens the
   predicate's clock).
5. **A monitor's cap ends with a legible line** (fast lane; the seats' monitor scripts and the
   liveness rule's note). Warrant: the Director's pulse died with its monitor's cap at about
   22:2xZ on the 26th and read as silence until 09:0xZ; Siren's ping got no answer; a peer could
   not tell a pause from a dead seat. The cure is not a pulse that outlives the seat (silence is
   never liveness, and a pulse from a paused seat would lie) but a final "pulse ending at the
   cap; re-armed only by a live turn" heartbeat-end line emitted by the script at its cap, so the
   stream carries the pause as a fact. Falsifier: peers act on the line as retirement rather than
   pause (the line names which it is).
6. **Lead time joins the snapshot** (fast lane; the check-in's MERGED section gains open-to-merge
   per landing and the median). Warrant: the count measured a stock while the harm was a flow;
   the drain's eight ran from three hours twenty-five minutes (259) to thirty-four hours
   forty-three minutes (245) open-to-merge, and under the limit the number is bounded by the
   door's turn times the queue. Falsifier: the number never changes a routing across a week of
   check-ins (then it is ceremony and comes out).
7. **Slow lane, the register (PDR-130): the limit follows the implementer count.** Prediction:
   with three seats and a door turn of seventeen to twenty-four minutes, the steady state reads a
   count of two to three with a median lead time under one hour and no seat idle past one door
   turn; review date the fold of 2026-10-04. Falsifier (the plan's own): three seats idle for more
   than one door turn with the count at three, or the count at zero for a full check-in with no
   slice prepared.
8. **The fold's sweep and the substrate check's second read** (fast lane; the fold skill's step-9
   sweep sentence and the never-use-git chmod clause, queued in JC.net's napkin at 14:3xZ on the
   27th for the next Practice PR per estate under a seat's hand, held for a seat by suite 34; the
   substrate check's re-evaluation and its render lock as a toolkit finding on the same block).
   Warrant: one fold push from a shared primary on the 27th cost four gate runs, none for the
   branch's content (a peer's unlinted append; the practice-substrate check's read window against
   live comms senders, twice; a moved file's relative links), each about two minutes plus a stream
   line; a sweep that lints every dirty tracked file and renders the comms-log projection before
   the push, with a check that re-evaluates once before declaring drift, removes the first two
   causes at the pusher's desk. Falsifier: after the sweep lands, a fold push from a shared
   primary fails a gate run on a peer's dirty tracked file or on projection drift; two such runs
   across two folds falsify the claim that the sweep removes them, and the cure moves into the
   tool (a render lock held for the gate's duration).

## 7. A bounded free-play pass

Played over the arc's material for one pass; the harvest routes under its own contract. (a) The
"static zero" paradox: the owner's target is zero open PRs and the process needs work in flight;
the limit turned zero from a state into a direction ("aiming for zero while useful value is still
created and merged"), and the estate's number changed meaning from a stock to a flow bound
without anyone renaming it; proposal 6 is that renaming. (b) The bypass as an instrument: the
owner's hand landed seventeen in forty minutes, and the door's order copied it; what the Practice
cannot copy is the judgement that priced each merge in seconds. The nearest mechanism is the
changed-file order plus the bot's verdict, which is what the seat door now runs. (c) The
reviewers as a clock: the Codex connector re-reviewed an unchanged head eleven hours later; a PR
waiting at the limit is not inert, it accrues threads. Proposal 2's probe is the test.

## 8. Landing status

Drafted in the scratchpad from 09:5xZ on 2026-09-27 (no worktree, no commit, the count at the
limit). Opens as its own PR on the lineage at the first WIP slot freed after the 12:00Z fold
moment when no live seat has a ready item (the Director's ruling of suite 31, replacing the
earlier "behind every seat's waiting item", which was the Director's own consequence line); a
pointer line in JC.net's agentic-engineering index by the exchange. Proposals 1 and 2 ride PR 260;
3 is Swallow's ledger item, now warranted; 4, 5 and 6 are one-file wording or script changes at
free slots; 7 goes to the slow-lane register with its review date.

## 9. Addendum at the resume (2026-09-27, 09:2xZ to 12:4xZ)

Facts read first-hand after the draft's cut, for the final text:

- The 12:00Z fold moment: the lineage's coordination PR 262 merged at 12:06:40Z as d6c9e582e
  (one round; one Codex P2 Rejected on a first-hand test of `GIT_CONFIG` against `core.hooksPath`,
  no settlement push); JC.net's PR 225 merged at 12:39:05Z as 3699c155d (three rounds; two
  settlement pushes; six findings cured, one Accepted-deferred). Both successors cut from one
  resolved sha each (coordination/2026-09-27-d6c9e5, draft PR 264; coordination/2026-09-27-3699c1).
- The push cost of a fold from a shared primary: four gate runs for one push, none for the
  branch's content (a peer's unlinted append on the primary; the practice-substrate check's read
  window against live comms senders, twice; a moved file's relative links under the markdown-links
  validator, which scans `unconsolidated/` and not `archive/`). Each run about two minutes plus a
  stream line. Proposal 8 (§6, with its carrier and falsifier).
- The WIP serialiser in operation (PR 260's clause): 263 opened under Siren's 10:56Z reservation
  and landed 11:34:36Z; 226 opened under her 11:38Z reservation at 11:41Z; 261 readied at 11:12Z
  behind them; the count read three of three from 10:56Z to the end of the window with no
  contested opening and no idle slot. The fold took a released slot at 11:36Z rather than its
  clock time, so 261 synced once instead of twice.
- The seats: Myrtle closed out at 12:06Z on the owner's stop word (PR 250 at 388 files with three
  red checks read); Swallow closed out at 12:28:57Z with PR 261 settled at 02c9c7562 and the door
  handed to any live seat; Siren paused at 12:11Z on the owner's compaction word with a HOLD on
  226 (JC.net reads a PR with unresolved threads as CLEAN, so a door would land past findings);
  Nova turns Penumbra (8a94ba, Opus 5.5) registered at 12:11Z and was freed by the owner at
  12:12Z; routed 261's dispositions and door, then 250's cures. The Director was the only live
  seat for about twenty minutes; the retrospective's queue order was re-labelled as the Director's
  ruling (suite 31, 12:2xZ): a freed slot goes to a live seat's ready item, else to this PR.
- The usage limit: the Director's seat was cut off at 11:50Z with both folds at their doors, the
  doors and monitor stopped and the state on both streams; the owner's start word at 12:0xZ
  resumed it. A boundary of this kind is the seventh interruption class of the arc (after the
  harness pause, the compaction words, the review quota, the owner's hand landings, the reviewer
  race and the gate's live-tree reads).


## Addendum, 2026-09-27 18:34Z: the cited path qualified; the comparison window; the sibling record

Two findings from PR 265's round five (Codex, two root threads: the comparison window at line 156
and the plan report's path at line 17), dispositioned by signed lines on 76195aa19 (16:20:12Z, item
1 of 2, the window; 16:20:14Z, item 2 of 2, the path), both "Rejected, below the bar", with the
qualifier routed to the record's next addendum; the PR merged 16:24:59Z as 9b622d827. The Director's
suite 37 re-read (16:45:09Z, the lineage stream) applied the reader-harm test per finding, reversed
the path finding (the forge's item 2 of 2; its item 1, the window, stays below) to over the bar, and
named this addendum as its cure under PDR-140 clause 9(b) (the retrospective skill: new
understanding amends the record additively).

1. The plan report cited in the sources paragraph,
   `.agent/reports/agentic-engineering/2026-09-26-the-estates-programme-plan.md`, lives in JC.net
   (`jimCresswell/jimcresswell.net`), not in this repository; a reader who follows the path here
   finds nothing. Read the sources paragraph with that qualifier. The signed line read it as a
   missing qualifier below the bar; the re-read put it over the bar (a reader acting on the record
   is misled by the path); cured here.
2. The counterfactual's comparison window pairs the 25th's door-day landings with the evening's
   openings and calls both "the evening"; the conclusion rests on section 3's measured intervals,
   and the pairing is two windows, not one. Below the bar on the signed line and on the re-read (no
   reader acts on the pairing); the rationale restated here.

The sibling record, the retrospective on the review rounds that grew (PRs 258, 260, 263, 224, 226),
landed on 2026-09-27 at 18:13:16Z as 2522b8965 and carries its own addendum for the arc's tail.
