# Retrospective: the review rounds that grew on the transplant runbook's rollback and the WIP clause, 2026-09-26 to 2026-09-27

Commissioned by the owner (the word given in Siren's session before that session's 15:49Z compaction on
2026-09-27, relayed verbatim by her brief at 15:5xZ: "post compaction write the retrospective
brief and pass it to the Director to carry out /jc-retrospective"). Run by the Director (Wick
binds Temper, ed7b48) with the retrospective skill: metacognition (retrospective mode) and reason
throughout; a bounded free-play pass at the end. Home: `.agent/reports/agentic-engineering/` on
the lineage; a pointer in JC.net's index by the exchange.

Scope: the closed part of the arc, from lineage PR 258's opening (2026-09-26T15:29:51Z) to lineage
PR 263's landing (2026-09-27T11:34:36Z); JC.net PR 226 (open, held at 8af432a5a at the writing)
and the lineage follow-up that will carry 226's final bytes are the open tail, read here as far as
they had gone and to be added as an addendum when they land.

Sources, each named per line: the GitHub review threads (root comments with no `in_reply_to_id`),
reviews, commits and timeline events of the five PRs, read by the REST and GraphQL APIs at 16:0xZ
on 2026-09-27 into a ledger and recomputed there; the review-cost gate's own pricing of the three
lineage PRs (`review-cost gate --pr N --json`, run at 16:06Z; its total is the settlement cost,
the opening round excluded); the Director's napkin blocks on JC.net's coordination branches
(check-ins 24 to 41 and the suite tallies between them); Siren's thread record and Siren's two
letters; the two comms streams; the brief itself, whose author is one of the arc's actors and
whose reading is rival 1 below, a source checked, never evidence.

## 1. The question

Why did the review rounds on the transplant runbook's rollback and on the WIP clause grow instead
of shrinking, and what did that cost?

## 2. The timeline, from the forge

| PR | estate | opened | merged | lead | files | commits after opening (syncs among them) | bot rounds (heads reviewed) | root threads | dispositions |
|---|---|---|---|---|---|---|---|---|---|
| 258 the runbook, born sketch | lineage | 2026-09-26T15:29:51Z | 16:38:41Z | 69 min | 1 (+249) | 3 (1) | 4 | 15 | Fixed 11, Accepted 3, Rejected 1 |
| 260 the WIP limit beside the landing slot | lineage | 2026-09-26T21:49:18Z | 2026-09-27T10:43:58Z | 775 min | 1 (+38) | 6 (3) | 4 | 10 | Fixed 7, Accepted 2, Rejected 1 |
| 224 the runbook twin | JC.net | 2026-09-27T09:53:57Z | 10:17:01Z | 23 min | 1 (+72/-35) | 3 (1) | 2 | 1 | Fixed 1 |
| 263 the runbook's rollback cured; the WIP count | lineage | 2026-09-27T10:56:15Z | 11:34:36Z | 38 min | 2 (+51/-27) | 2 (0) | 3 | 10 | Fixed 5, Accepted 3, Rejected 1, Acknowledged 1 |
| 226 the twin of 263 | JC.net | 2026-09-27T11:41:01Z | open | open | 2 (+83/-24) | 1 (0) | 2 | 4 | Fixed 2, two unanswered |

Read against the ledger (every number recomputed from the API reads at 16:0xZ):

- 2026-09-26, 15:29:51Z: 258 opens on the lineage, the transplant runbook born sketch (one file,
  249 lines; the review-cost gate, on the lineage since 2026-09-12, priced each of its pushes as
  it came and refused none). Round one on the opening head df30d9e0c (Codex 15:33Z, Copilot
  15:35Z): seven threads, one on the rollback (Copilot, line 208: the rollback command
  inconsistent with the pin's location) and six on other steps. Settlement push one, 8926e3620 at
  15:38Z, cures all seven (signed 15:42Z to 15:43Z). Round two on it (15:46Z, 15:48Z): four
  threads, none on the rollback. Settlement push two, 44f8c079d at 15:49Z, cures them (signed
  15:54Z). Round three on it (15:58Z, 15:59Z): two threads, one on the rollback (Codex, line 226:
  restore snapshots to their paths), both Accepted and not cured (signed 16:00Z: "Review stops at
  two rounds"). The sync merge 00fc1504f at 16:17Z draws round four (Codex 16:25Z, Copilot
  16:27Z): two threads, one on the rollback (Codex, line 230: record approval for step 12's
  non-reversible writes), one Rejected and one Accepted by signed lines at 16:26Z and 16:29Z.
  Merged 16:38:41Z. The gate prices it today at 47.94 of 40, exhausted (rounds 9.54, 25.3, 22.64,
  0; the settlement cost, the opening round's 9.54 excluded, crossed 40 only on round three, after
  the last content push).
- 21:49:18Z: 260 opens, the WIP limit beside the landing slot (one file, 38 lines added to
  pr-lifecycle §Phase 7). Round one at 21:51Z and 21:52Z: three threads, all on the clause (the
  count command's missing `--repo`; the owner's rationale for zero; a draft PR needs its head
  pushed). Settlement push one, c1143f1a3 at 21:53Z, cures them (signed 21:56Z). Round two on it
  (Copilot 21:58Z, Codex 22:00Z): two threads (`gh pr list` pages at thirty; serialise the
  reservation before counting); the cure 16a16ffae at 22:01Z stays local. The harness pauses every
  seat at 22:32Z. At 09:20Z on the 27th GitHub's update-branch merge 96d424d12 (owner-authored, a
  sync) draws round three from the Codex connector alone (09:24Z): two threads (reconcile local
  preparation with worktree-hygiene; separate the Director's reading from the owner's ruling),
  eleven hours after the last content push. Siren's cure d899b423e lands at 09:37Z; settlement
  push two, 33d225657 at 10:26Z (pushed 10:30Z), a merge commit carrying 16a16ffae, d899b423e and
  engraph's tip, which the gate reads as a sync and prices at zero. Round four on it (10:33Z, both
  reviewers): three threads (exclude coordination PRs from the count, twice; reservations across
  per-repo streams), two Accepted with the cure riding the next carrier and one Rejected, by
  signed lines at 10:34Z. Merged 10:43:58Z. Lead 775 minutes, about 660 of them in the pause and
  the morning's slot order. The gate prices it at 10.30 of 40, within: rounds 5.96, 10.3, 0, 0
  (the update-branch head and the cure-carrying merge both priced as syncs).
- 09:53:57Z on the 27th: 224 opens on JC.net, the runbook twin carrying 258's fourteen cures and
  the owner's ratification (answer 10, 09:1xZ). One Copilot round on 9503108dd (10:07Z): one
  thread, the ratification pointer not resolvable; cured in 694b29cd6 with a sync of main
  (31a18a0a6), one push at 10:09Z; the second Copilot pass (10:15Z) "Approval recommended". Merged
  10:17:01Z. Lead 23 minutes. Its title's "fourteen cures" is Siren's count of what 258's rounds
  produced; the ledger reads eleven Fixed and three Accepted on 258.
- 10:5xZ: the Director's ruling on 258's carried rollback finding, asked by Siren before 263
  opened and answered natively (check-in 35, the Director's words: "two reviewers found the
  runbook's rollback unsafe (`git show <tag>:<path> > <path>` follows a symlink and restores no
  mode or type); the estate's own forward-write invariant is the cure; ruled: cure now in 263 and
  in JC.net's copy through the WIP twin PR; a procedure change returns both copies to sketch by
  the template's line; one batched card to the owner"). Siren's label for it, "fix now", is Siren's own.
- 10:56:15Z: 263 opens, titled for the runbook's rollback cured and ratified here and the WIP
  count leaving out coordination PRs (two files); at its opening the rollback still read as 258
  carried it, the cure came in its first settlement push. Round one on 737f26d04 (Copilot 10:59Z,
  Codex 11:00Z): four threads, two on the rollback (the redirect follows a symlink and restores no
  mode; restore tracked paths with git's metadata), one on the WIP count (the coordination PR
  omitted before reservation matching), one on the ratification pointer's block (acknowledged, no
  change). Settlement push one, a8d820a11 at 11:02Z (the forward write by
  `never-use-git-to-remove-work`'s recipe), signed 11:06Z. Round two on it (11:09Z, 11:12Z): four
  threads, three on the rollback (`chmod` does not take git's tree mode; the added-path case
  against the invariant; a directory where a file was) and one on the stamp fields; signed 11:11Z
  and 11:18Z. Settlement push two, eed1f6e44 at 11:14Z ("the rollback from a clean tree; chmod
  bits"), carries the cures. Round three on it (11:20Z, 11:24Z): two threads, one on the WIP
  clause (the reservation instruction unconditional, Rejected at 11:22Z) and one on the rollback
  (a symlink resolving to a directory, Codex, reproduced on its machine, Accepted at 11:25Z).
  Merged 11:34:36Z. Lead 38 minutes. The gate prices it at 44.65 of 40, exhausted (rounds 7.16,
  25.62, 19.03; the settlement cost crossed 40 on round three, after the last content push, so the
  gate refused nothing here either).
- 11:41:01Z: 226 opens on JC.net, the twin of 263 plus a thirty-minute lapse sentence for
  reservations (two files). Round one on d0d1b9ac2 (Copilot 11:46Z): two threads (a reservation
  can become permanent; the mode lookup names no tree); settlement push 8af432a5a at 11:48Z cures
  both (signed 11:50Z). Round two on it (Copilot 11:55:42Z): two threads, both real and both new
  (the leaf-only type check while `mktemp` and `mv` follow symlinks in parent components; the
  admission gate contradicts the skill's live sentence at lines 84 to 88 that "the zero-PR
  objective never prevents PRs from being created"). The team's usage limit fell at about 11:50Z;
  Siren paused at 12:11Z on the owner's sixth compaction word of the day (the seventh, at 15:49Z,
  produced the brief) with the two threads unanswered and a HOLD on 226 (JC.net reads a PR with
  open threads as CLEAN, so a door would have landed the contradiction). Open at the writing, held
  at 8af432a5a, twelve commits behind main.

## 3. The rival hypotheses, each read against its falsifier

The five rivals are the brief's, in the brief's order; the first is Siren's own reading and was
treated as a source to check. Each is read against the falsifier the brief gave it, on the
ledger's numbers.

1. **Prose with no test: each round samples one edge case, and each cure adds text for the next
   round.** Falsifier: the findings do not concentrate in the procedural paragraphs, or the new
   defects per round on those paragraphs fell round by round. Read: rival 1 stands as the
   mechanism. The rollback paragraph's root threads per round were 258: 1, 0, 1, 1 (before the
   forward write existed), 263: 2, 3, 1, and 226: 1, 1; across the arc seven of the eleven
   rollback threads name a filesystem edge the previous cure's text created or exposed (bytes
   only; type and mode; `chmod`'s operand and a clean tree; a directory where a file was; a
   symlink resolving to a directory; the mode's revision; symlinked parents), and each cure grew
   the paragraph (the runbook's diff on 263 is +51/-27 for a rollback that began as one line). On
   the WIP clause the threads per round were 260: 3, 2, 2, 3, then 263: 1, 0, 1, then 226: 1, 1;
   of the fourteen WIP threads, six are facts about the estate's own tools or the owner's words
   that one run of the procedure would have shown (`--repo`, `--limit`, a draft needs its head
   pushed, the coordination exclusion three times), not matters of judgement. The findings
   concentrate where the falsifier says they must not, and neither paragraph's per-round count
   fell to zero and stayed there in any PR. One correction to Siren's account: the rounds did not
   grow in number per PR (258 four, 260 four, 263 three, 226 two); what grew was the concept's
   total round count across PRs, because the concept moved from PR to PR carrying a fresh budget
   each time (rival 4's territory).

2. **Disproportion: the rollback has never run, and a ledger row ("harden at first use") was the
   proportionate answer.** Falsifier: a finding names a failure a first real run would hit and not
   recover from, at a cost above the rounds spent. Read: rival 2 stands as a cause of cost, not of
   growth. Three of the seven rollback findings name failures a first run would hit outright and
   visibly (`chmod 100755` is rejected by chmod; a `mv` into a directory that replaced a file
   lands inside it; a redirect through a symlink writes into the link's target), and each is
   recoverable in principle from the pre-state tag the runbook's precondition 3 creates and
   pushes, though the restore that recovers is the same untested procedure, so whether a first run
   "would not recover" cannot be judged on this arc's evidence. The falsifier's first half (a
   failure a first run would hit) is met by three findings; its second half (not recover, at a
   cost above the rounds) is unjudgeable until the rollback runs: the rounds bought edge-case
   coverage for a procedure the estate has never run, at the price of two exhausted budgets (258
   and 263 by the gate's pricing) and an owner re-ratification still waiting. It says the growth
   should have been stopped, not why it happened. The Director's 10:5xZ ruling ("cure now in 263
   and in JC.net's copy") chose the cure over the ledger row; that choice is read under rival 5.

3. **The byte-equal twin: the same bytes in both estates doubled every carried cure, and each twin
   got a fresh budget.** Falsifier: the twins' rounds cost little against the originals' (thread
   counts and open-to-merge), or the twins found real defects the originals missed. Read: rival 3
   is refuted as a cause of the growth. 224, the twin of 258, drew one thread and merged in 23
   minutes against 258's fifteen threads and 69 minutes; 226, the twin of 263, drew four threads
   in two rounds against 263's ten in three, and its round two found two real defects 263 had not
   (symlinked parent components; the live contradiction at lines 84 to 88 of the skill, a doctrine
   clash in a sentence both estates carry). Both halves of the falsifier fire: the twin
   requirement cost one cheap PR and one that found what the original missed. It does add one
   settlement push and one door turn per twin, which is the price of the alignment goal the owner
   set, not of this arc.

4. **The per-PR budget: two rounds bind per PR, not per concept, so a concept carried through 258,
   224, 263, 226 and the follow-up had no bound.** Falsifier: each later PR's findings were
   defects in that PR's own new text, not the concept's old gaps found again. Read: rival 4 stands
   as the process mechanism that let rival 1's loop run. 263's round-one findings were on 258's
   text as carried (the redirect's symlink and mode behaviour, present since 258, where Codex
   raised the restore question at line 226 and Siren's line answered "Accepted as valid, and not
   cured on this pull request" at 16:00Z on the 26th); 263's round-two and round-three findings
   were on 263's own new text (the forward write's `chmod` operand, its directory case, its
   symlink-to-directory case); 226's two open findings are one on 263's carried text (the
   leaf-only type check) and one on 260's carried text (the admission gate against the skill's
   older sentence). So the falsifier is half met: the later PRs' findings were mostly on new text,
   but the new text existed only because the concept was carried from PR to PR, and one finding
   per later PR was an old gap resurfacing. The two-round rule counts per PR (258 spent four
   rounds and 263 three through the rebudget and late-cure doors, 224 and 226 two each), so it
   never bounded the concept's aggregate of eleven rounds across its carriers; the review-cost
   gate, in force since 2026-09-12, priced each push as it came
   and refused none, because a settlement cost crosses its budget on the round AFTER the push that
   earns it, and reads 258 and 263 as exhausted only today, in retrospect.

5. **The process choices: the Director's ruling to cure now rather than ledger, with the return to
   sketch; and Siren's skipped pre-open review of rule text (the lesson of 2026-09-26, recorded
   and not applied).** Falsifier: a pre-open expert pass run now on 263's opening text finds none
   of the defects the bots found in later rounds, and the growth predates the ruling. Read: rival
   5 stands in part. The growth predates the ruling: 258's four rounds and 260's four ran on the
   26th, the ruling came at 10:5xZ on the 27th. The ruling then shaped 263: it made the rollback's
   cure a content push into a runbook the owner had ratified an hour earlier (answer 10 at
   09:1xZ), so the procedure change returned both copies to sketch by the template's line and the
   re-ratification went on the owner's card, where it still sits. The pre-open pass was run for
   this record on 263's opening diff (127 lines, both files) by a documentation reviewer blind to
   the PRs and their threads. It found fourteen defects on the opening text, ranked by the
   reviewer as would-mislead, imprecision or style: the redirect writes through a symlink and
   restores no mode (the two findings the bots raised in round one, lines 236 to 238); a directory
   at the tag written as a file (round two's directory case); the drops-from-the-pin claim wrong
   for upstream-deleted paths (round two's added-path conflict, by another route); the
   ratification pointer unresolvable by git reachability (round one's pointer thread); the
   coordination PR named with no identification rule (rounds one and three's coordination
   threads); a reservation with no expiry (226's round-one lapse finding); and seven the bots
   never raised (a deleted parent directory, a hand count in present tense, a 149-character line,
   the step 7 recovery's unnamed tool, drafts in the count, the command lists rather than counts,
   wall-clock order across two streams). The second half of the falsifier is therefore not met: a
   blind expert pass before opening finds seven of the bots' fourteen findings across 263's three
   rounds and 226's two, including both of 263's round-one rollback findings, so the skipped pass
   cost at least one round of 263 and one of 226. The ruling did not start the growth (258's and
   260's rounds were the 26th's); it made 263's three rounds and 226's two the concept's carriers
   and spent the ratification where a ledger row would have kept it; the skipped pre-open pass is
   Siren's own account (the lesson in Siren's night-watch letter of the 26th's evening, restated in
   her 09:1xZ block on the 27th, "recorded and not applied" in her 12:1xZ block) and is confirmed
   by the blind pass.

## 4. The causal stack, by depth

Each layer answers why the layer above was possible; the stack stops where the next "why" leaves
the estate's control.

**Technical root: a mechanical procedure written as prose, with the reviewers as its only test.**
The rollback is a restore of tracked paths from a tag; the WIP count is a read of two forges with
a reservation order. Both are mechanisms. Neither had an instrument: no tool in agent-tools
implements the forward-write restore (Siren's grep on the 27th found none; the hook policy blocks
`git restore` in every form), and the count was a documented `gh` command a seat runs by hand. A
mechanism written as prose has no test that shrinks its input space, so every reviewer pass
samples one more input (a symlink, a mode, a directory, a parent link; a fork's remote, a page
size, a coordination PR) and every cure adds surface for the next sample. Neither paragraph's
per-round threads fell to zero and stayed there (rival 1's reading), and six of the fourteen WIP
findings were facts one run would have shown.

**Process root: a budget that binds pushes per PR while the concept crosses PRs, and a sync that
draws a round.** PDR-140 clause 4 rations settlement pushes per PR; PDR-132 binds two review
rounds per PR. The rollback concept ran through 258, 224, 263 and 226 (eleven rounds across four
carriers; the follow-up still to come), each PR opening with a fresh budget and a reviewer pool
that had not read the last PR's cures. Two of the arc's fifteen reviewed heads were syncs that
drew rounds with findings (258's 00fc1504f, two threads; 260's 96d424d12, two threads from the
connector alone, eleven hours after the last content push), and a third, 260's 33d225657, was a
merge commit carrying two cures that the gate priced as a sync: the self-inflicted review round
the retrospective on the twenty-four open PRs named (its proposal 3, the sync-lineage binding,
still on the ledger). The review-cost gate, in force since 2026-09-12, refused none of the arc's
pushes: its settlement cost crosses the budget on the round after the push that earns it, so on a
concept whose every push draws a round the tripwire reads exhausted only after the last push.

**Meta root: a recorded lesson with no carrier, and a ruling that chose the cure over the row.**
Siren wrote the lesson that rule text needs an operability pass or a pre-open reviewer on the
26th's evening (her night-watch letter; restated in her 09:1xZ block on the 27th: "For rule text
that binds every seat, a pre-open reviewer pass … is cheaper than a spent round") and did not
apply it to 263 or 226 (her own words: "recorded and not applied"); the estate's memory of the
same shape (procedure-prose-review-cascade: at the third edge case in one paragraph, stop adding
clauses, point at one home, propose a tested tool) sat in the Director's private memory, not in
the Practice. The Director's 10:5xZ ruling ("cure now") applied the owner's 2026-09-16 word for
defects (fixed, not queued) to a procedure the estate had never run and had just ratified, without
weighing proportionality's own question (a ledger row for a rollback with no first use), and so
spent the ratification. The next "why" (why do lessons wait for a carrier; why does a ruling reach
for the fix-now word first) is the estate's learning loop, PDR-130's fast lane, whose
consolidation pass is the carrier; that pass is the estate's, so the stack stops here.

## 5. The counterfactual test

When could the arc have gone right? Converge once: a mechanism reviewed to a fixed point in one PR
costs its twin one round. The strongest counterfactual inside the arc is 224: it carried 258's
text after 258's four rounds and the fourteen cures, drew one thread (the ratification pointer, a
new field) and merged in 23 minutes with one settlement push and one sync. Text that had already
been reviewed to convergence cost one round in the twin; text that had not (263's forward write,
226's lapse sentence and the carried gate) cost three rounds and two. The second counterfactual is
the row: had the 10:5xZ ruling put the rollback's cure on the exchange ledger ("harden at first
use") and left the ratified runbook alone, 263 would have carried the count cure and the stamps
only (its WIP threads: two across three rounds), the re-ratification would not be on the owner's
card, and the rollback's seven edges would be found by the first run's operator against a pushed
tag, recoverable each time. That path costs a first-use failure with the tag as the net; this path
cost two exhausted budgets and an open twin. The third is the instrument: had the forward-write
restore been a tool with tests (Siren's P2), each edge would be a test row, found once, and the
runbook's rollback a pointer (her P1); the WIP count likewise (her P3). That is the path the
proposals take.

## 6. Honest credit

The price first: two settlement budgets exhausted by the gate's retrospective pricing (258 on the
26th, before any ruling; 263 on the 27th, on the ruling's path), a ratified runbook returned to
sketch, and an owner card line that has waited since 11:02Z. What the cost bought: seven true
filesystem edge cases for a restore procedure the estate will run at the next transplant, each
recorded with its cure, which is the specification a restore tool now needs and did not have; a
WIP clause whose counting and reservation steps have been checked against the estate's own tools
(`--repo`, `--limit`, the pushed head, the coordination exclusion, the reservation order, the
lapse) and have run clean on every opening since 09:48Z on the 27th (224, 263, 226 and the two
later openings the Director's check-ins 33 to 41 record, all reservation-first, no contested
opening); the WIP serialiser itself, wording born in 260 and cured through the arc, which the
first retrospective's data shows holding the count at three with no idle slot; one doctrine clash
found (the skill's "never prevents PRs from being created" sentence against the owner's later
limit) that would otherwise have sat live in both estates; and a worked instance of the
loop-dynamics principle that the estate can now name and test for (§7).

## 7. Proposals, each with its warrant, its falsifier and its PDR-130 lane

1. **The mechanics move into an instrument or a pointer; procedure prose that specifies a
   mechanism does not get a fourth clause** (fast lane; Siren's P1 and P2 for the rollback, Siren's P3
   for the count; the runbook's rollback shrinks to one pointer at
   `never-use-git-to-remove-work`'s forward write in 226's settlement push, already her plan; the
   tool rows on the JC.net napkin's tool-findings block, routed to the toolkit lane). Warrant: the
   rollback's per-round threads (1, 0, 1, 1; 2, 3, 1; 1, 1) and the WIP clause's (3, 2, 2, 3; 1,
   0, 1; 1, 1) never reached zero and stayed there while the mechanism lived in prose; 224, whose
   text had converged, cost one round. Falsifier: the pointer version of the rollback draws a
   rollback finding on the lineage follow-up or on 226's final head; or, once the restore tool
   exists, a review of the runbook's rollback still draws a filesystem-edge finding. The owner's
   judgement that a rarely-run rollback is not worth a tool is not a falsifier but a routing: then
   the row "harden at first use" is the home, per precondition 5's instrument clause.

2. **A pre-open expert pass is the opening step for rule and procedure text, not a lesson** (fast
   lane; one sentence in pr-lifecycle §Phase 1's intake for Practice text: a read-only reviewer
   pass on the diff before the PR opens, its findings cured in the opening commit; the same
   sentence in both estates). Warrant: the 26th's lesson was recorded and not applied on the 27th
   ("a passive lesson lost to artefact gravity again", Siren, 12:1xZ); a blind
   documentation-reviewer pass run for this record on 263's opening diff found fourteen defects,
   seven of them findings the bots later raised across five rounds of 263 and 226 (both of 263's
   round-one rollback findings among them), and seven the bots never raised. Falsifier: three
   Practice-text PRs opened after the sentence lands draw the same count of round-one findings as
   before (the pass finds nothing the bots would not), in which case the sentence is ceremony and
   comes out.

3. **The budget follows the concept across its carriers, not the PR** (slow lane, the PDR-130
   register: PDR-140 clause 4's per-PR budget gains one clause: a finding carried out of a merged PR
   is a ledger row at the concept's home, never the opening cure of a new PR on the same text).
   Warrant: the two-round rule counted per PR and read four carriers each inside its own budget
   while the concept spent eleven rounds across them (rival 4's read above); each carried cure
   opened a fresh PR on the same text, whose opening round the per-PR budget never charged, and
   258's finding left "Accepted as valid, and not cured on this pull request" at 16:00Z on the 26th
   returned as 263's round-one finding on the 27th. Prediction: with the clause, a concept's total
   rounds across its carriers stays at or under the number of its carriers plus one (each opening
   head draws a round; the clause removes the carried cure's extra rounds); without it, the next
   carried procedure cure repeats this arc's eleven across four carriers. Review date: the fold of
   2026-10-04, with 226's tail and the lineage follow-up as the first data. Falsifier: a carried
   finding left as a ledger row is hit by a real run before its row is taken up, at a cost above the
   rounds the clause saved (then the per-PR budget is right and the concept needs the instrument,
   proposal 1, not a budget rule).

4. **The sync-lineage binding, again** (fast lane; the first retrospective's proposal 3, Swallow's
   design note, P1 on the ledger; no new text). Warrant: two of this arc's fifteen reviewed heads
   were syncs that drew rounds with findings (258's fourth round, two threads; 260's third, two
   threads), a third was a cure-carrying merge the gate priced as a sync (260's 33d225657, three
   threads), and the gate prices all three at zero, so the budget did not see them while the seats
   paid them. Falsifier: the design's own (a bound review on a synced head lets a semantic change
   through that the exact-oid rule would have caught).

5. **A ruling on a procedure defect asks proportionality's question before the fix-now word** (slow
   lane, the PDR-130 register, because it changes how a ruling decides between fix-now and the
   ledger and narrows the owner's fix-now word of 2026-09-16; the row proposes one sentence in the
   Director's rulings-as-artefacts shape, PDR-117 clause 5, and in the known-broken-code memory's
   limit: a defect in a procedure the estate has never run, with a recoverable pre-state, is a
   ledger row at the procedure's first use unless a run is scheduled; a defect in code or in a
   served surface is fixed now). Prediction: with the sentence, the next procedure defect found in
   review on a never-run procedure costs a ledger row and no ratification; without it, the next such
   ruling spends a ratification within the day, as the 10:5xZ ruling did. Review date: the fold of
   2026-10-04, with the transplant runbook's next touch as the first data. Warrant: the 10:5xZ
   ruling spent a ratification (answer 10, 09:1xZ) within two hours of its grant on a procedure with
   no scheduled run, and the re-ratification has waited on the card since 11:02Z; the growth
   predates the ruling, so the ruling's cost is the ratification and the twin's tail, not the
   rounds. Falsifier: the first transplant run hits one of the seven edges with the ledger row in
   place and the tag's restore does not recover it (then fix-now was right for procedures too, and
   this sentence comes out); until the rollback runs, the falsifier is unjudgeable and the sentence
   stands on the ratification it would have saved.

6. **arc-metrics takes a window** (fast lane; `--since` and `--until` on the tool, JC.net first,
   the lineage by the exchange). Warrant: the brief asked for agent time by arc-metrics and the
   tool measures whole sessions (27 sessions overlap this arc's window, four of them seat sessions
   spanning several days: one from the 23rd to the 27th, two from the 24th, one from the 25th;
   Siren's session 1582755b reads 26.9 active hours and 18 compactions over 2026-09-24 to 27), so
   the arc's share is unmeasurable today. Falsifier: the windowed figure never changes a routing
   or a retrospective's verdict across three uses (then it is ceremony).

## 8. A bounded free-play pass

A bounded pass over the arc's material, its harvest routed under its own contract, none of it a
finding. (a) The reviewers were a fuzzer with a memory of one round: each pass read the paragraph
as new and found the next edge, never the last one's fix; a fuzzer that remembered would have said
"still no directory case" on round two of 258. That is what a test file is. (b) The twin found
what the original missed (226's two round-two findings) because a different reviewer instance read
the same bytes cold; the cheapest second reader the estate has is the twin, and the alignment goal
makes it free. (c) Six of fourteen WIP findings were facts about the estate's own tools or the
owner's words; a seat who had run the count once by hand would have found most of them; the hands
knew what the text did not say (Siren's night-watch letter). (d) The gate that reads 258 and 263
as exhausted by its own pricing was in force for both and refused neither push, because its
settlement cost crosses the budget on the round after the push that earns it; the estate had the
instrument that measures this arc and measured the arc after it ran, a tripwire at the wrong
tempo. (e) The rollback has never run; the seven edges are all true and all untested; the record
of them is a test plan wearing a runbook's clothes.

## 9. Cost, recomputed

The price: two budgets exhausted (258, 263), a ratification spent, an owner card line waiting
since 11:02Z, and a twin held open. The counts: reviewed heads (rounds): 258 four, 260 four, 224
two, 263 three, 226 two: fifteen. Root threads: 15, 10, 1, 10, 4: forty, of which the rollback
drew eleven and the WIP clause fourteen. Pushes after opening: 258 three (the last a sync), 260
three (GitHub's update-branch, then the cure-carrying merge), 224 one (a cure with a sync), 263
two, 226 one: ten, three of them read by the gate as syncs, all three drawing rounds with
findings. Dispositions: Fixed 26, Accepted 8, Rejected 3, Acknowledged 1, unanswered 2.
Open-to-merge: 69, 775, 23, 38 minutes, and 226 open since 11:41Z (its settlement push at 16:11Z,
under a pause and a hold for most of the interval). The gate's pricing: 258 at 47.94 of 40
(exhausted), 260 at 10.30 (within), 263 at 44.65 (exhausted); 224 and 226 cannot be priced:
JC.net's agent-tools has no review-cost topic (the gate has not crossed the exchange; a row for
the register). The Director's rulings on the arc, six: the runbook stamps routed at the resume
(c664195c); ruling 1 on 260 and its reversal within twelve minutes; cure now on the rollback (the
subject of proposal 5); the settlement-push reading on 263, recorded only in Siren's account;
suite 30's order; the card's corrected default. The owner's re-ratification: granted 09:1xZ, spent
11:02Z, on the card since. The harness paused every seat from 22:32Z on the 26th to 09:49Z on the
27th (the retrospective on the twenty-four open PRs, §2, and the seats' records); the team's usage
limit at about 11:50Z (the Director's boundary block, check-in 36) fell inside the arc, and
whether the arc's reviews contributed is a question this record cannot answer (the limit is the
vendor's, its accounting unread). Agent time: unmeasurable to the arc by arc-metrics today
(proposal 6).

## 10. Landing status

This record was written 16:0xZ to 16:4xZ on 2026-09-27 in the Director's scratchpad from the
ledger, with no worktree and no commit while the count read three. It opens on the lineage as its
own PR at its place in the slot order posted at 15:5xZ (after Nova's OCE doctrine PR and Siren's
lineage follow-up, before or beside Nova's JC.net twin as the slots free), reservation-first; a
pointer in JC.net's agentic-engineering index by the exchange. The addendum for the tail (226's
settlement push and door; the lineage follow-up) is owed when they land. Proposals 1, 2, 4 and 6
are fast-lane rows; proposals 3 and 5 go to the PDR-130 register with their review dates.



## Addendum, 2026-09-27 18:34Z: the tail landed; two routed findings; this record's own rounds

Sources: gh (each PR's commits, reviews, signed lines and merge times, read 18:1xZ to 18:3xZ), both
comms streams, the JC.net napkin (its check-in 44 block at 17:42Z and suite 39 block at 18:14Z), the
review-cost gate's output at this record's last push and a re-run at 18:33Z, and the Director's diff
of the two estates at 17:1xZ. A pre-open documentation pass on this addendum's own draft found
fifteen findings before its PR opened, five of them sentences a reader would act on that the forge
contradicts; all are cured in this text. That pass is the first pre-open instance of proposal 2's
mechanism, on a report rather than rule text; its round-one count is the datum once the PR opens.

- 226 (JC.net, the twin of 263): opened 11:41:01Z at d0d1b9ac2; the round-one cure 8af432a5a at
  11:48:09Z (Fixed 2); held through the pause and the hold; the sync ab87c2157 at 16:02Z (main at
  3699c155; no round on it); the settlement push 55d81dc92 (committed 16:08Z, on the forge by
  16:11Z), which marked the older zero-PR sentence superseded, cured the admission-gate finding
  (Fixed, 16:10:56Z) and deferred the symlinked-parents finding to the proposed rollback tool
  (Accepted, 16:10:54Z); a third round on it (Copilot 16:15:27Z, two root threads: the byte-equality
  claim, Fixed in the PR body with no push at 16:17:26Z; the standing-grant citation, Accepted and
  deferred to the ledger at 16:17:28Z); merged 16:18:03Z as 02f0ffbd8. Section 9 counts 226 at its
  16:0xZ state (two heads, four threads, one push, Fixed 2, two unanswered); its whole is three
  reviewed heads, six root threads, three pushes after opening (one a sync with no round), Fixed 4
  (one in the PR body), Accepted 2, unanswered 0, so section 9's totals read sixteen heads,
  forty-two root threads, twelve pushes, Fixed 28, Accepted 10, Rejected 3, Acknowledged 1,
  unanswered 0 (PR 267 round three, Codex at line 392, routed here).
- 266 (the lineage follow-up of 226): opened 16:25:31Z at b8d1499f0 with three sections as bytes
  from 226's merged head (each section's diff empty; no pass before opening); round one on it two
  Copilot findings; the round-one cure ff330377d at 16:35Z carried those two, the standing-grant
  point ledgered from 226 (the rollback as an ordinary forward change, not an act under the standing
  grant), and three more edges found by a pre-push expert review of the new wording (Siren's lines
  at 16:35:56Z and 16:38Z); round two on it clean on both legs, the arc's second clean round after
  224's second Copilot pass at 10:15Z; the slot-turn sync d0251962d at 16:42Z drew a third round
  with one Codex P2 (16:47:51Z, revalidate an expired reservation before opening), Rejected by
  signed line at 16:56:38Z; merged 16:58:46Z as 96bb08963. So 266 is three reviewed heads and three
  root threads (Fixed 2; Rejected 1, on the sync), and the sync's round is one more instance for
  proposal 4.
- 228 (the JC.net twin of 266): opened 17:02:49Z with two sections as bytes from 96bb08963; one
  Copilot round, no thread; merged 17:06:19Z as 33514ec19. The runbook's rollback section (27 lines,
  engraph's lines 232 to 258) and pr-lifecycle's WIP paragraph are byte-identical between JC.net
  main 33514ec1 and engraph 96bb08963 (the Director's diff, 17:1xZ); the runbook otherwise differs
  by its provenance paragraph, two report citations in its steps, and the measured-instance section
  (JC.net carries the first instance's timing table and outcomes, engraph an empty table) and the
  position of one frontmatter key. Proposal 1's shrink of the rollback to one pointer did not land:
  the rollback remains a 27-line procedure in both estates, and that procedure drew two more
  rollback findings on the tail (226's final head, the standing-grant citation, Accepted and
  deferred on 226 and cured in 266's ff330377d; 266's opening, the symlink mode case, Fixed in
  ff330377d), which restates the warrant; the falsifier needs the pointer version on a head and is
  untested.
- 258's dispositions restated: eleven Fixed, three Accepted and one Rejected, fifteen; section 5's
  "fourteen cures" reads as the fourteen Fixed and Accepted dispositions (PR 267 round three, Codex
  at line 263, routed here).
- This record's own rounds, as proposal 3's data: five reviewed heads (c06667ee9, 8c803cbac,
  35573e8c0, 5625e022c, 39923bc07) with 2, 1, 3, 1 and 0 root threads, seven findings: five over the
  bar cured (two in 8c803cbac, one in 35573e8c0, one in 5625e022c, one in 39923bc07), two below the
  bar routed here; four pushes after opening: three settlement pushes, the third under a rebudget to
  3 recorded on the PR by decision (PDR-140 clause 4), and one late-cure push under clause 9(b). The
  gate at the last push (its pre-push output at 17:48Z: rounds 16.43, 23.54 and 15.2, the opening
  round excluded from the total) read 55.17 of 60; re-run at 18:33Z after round five it reads 69.14
  of 60, exhausted (rounds 6.47, 16.43, 23.54, 15.58 and 13.59; the fourth round's cost had moved
  from 15.2 to 15.58 as its replies landed), the tempo section 8(d) describes. The rounds grew from
  one incomplete cure (a lane corrected in section 7 and not in section 10), the shape section 8(a)
  names: a reviewer with a memory of one round finds the next edge, and a grep of the record for the
  same claim would have found it first. Merged 18:13:16Z as 2522b8965 on Copilot's leg: Codex's
  fifth run completed with no findings and, on this PR, recorded that only by editing its one
  summary comment (created 17:16:57Z, updated 17:52:18Z) and posting no review object, so the
  merge-bot read its leg as owed and refused the edited comment as evidence; on 266 the same day
  Codex posted a fresh comment per clean run, so the tool row is scoped to the edited-comment shape.
- A cost on the exchange's code rows of a guard scoped wider than its concept (the JC.net napkin,
  check-in 44 and suite 39): JC.net's content-policy guard, scoped to every path, refused a JC.net
  seat's write of lineage code (reported in Siren's withdrawal line, 17:32:57Z on the lineage
  stream); the scope fix is JC.net PR 230 at its rounds; exchange-register row J3 (repo-check over
  the tracked tree) waits on it, with J2 (the tracked-universe validators) behind J3 in the order.
