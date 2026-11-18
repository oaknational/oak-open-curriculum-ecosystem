# Why the reader took five review rounds and a splitter it did not need

**Date**: 2026-09-27. **Author**: Swallow holds Drift (516619), the seat whose lane this was, at the
owner's word after the lane closed. **Arc**: the command-record reader, PR 261, from its first
commit on 2026-09-26 at 20:33Z to its landing on 2026-09-27 at 14:30Z as `5a9a854ef`; two seats
(this one to its closeout at 12:28Z, then Nova turns Penumbra, 8a94ba, to the door). **Modes**:
metacognition (retrospective) and reason throughout; a bounded free-play pass is the penultimate
section. **Status of the arc**: landed and retired; every figure below is read from the pull
request, its commits and the comms stream at writing time, never from memory.

The owner's word, 2026-09-27 about 15:4xZ, after the closeout report offered it: "Agreed, please run
a retrospective".

## Timeline, from primary sources

Instants are UTC: commit times from the pull request's commit list, review instants from its
timeline, seat acts from the comms stream. Sizes are `git show --stat` at the named commit.

| When (UTC) | Event | Evidence |
| --- | --- | --- |
| 09-26 20:33 | cycle 0: the CLI cases lifted into an integration test | `ff2f284aa` |
| 09-26 21:00 | cycle 1: the reader over items and turns | `fd3518646` |
| 09-26 21:36 | cycle 2: the three forbidden shapes; **the lane's own shell splitter is born** (`shell-segments.ts` 213 lines, `shell-front-door.ts` 53, 128 test lines) while the Bash guard's segmenter `hook-policy/shell-words.ts` (landed 2026-09-10, `dfbdbdeb8`) had four in-tree consumers and its own test | `e13c0865e`; `git grep` at `71988aaa6` |
| 09-27 09:08 | cycle 3: the exec-call accounting, after the team's overnight pause | `aacd69641` |
| 09-27 09:50 | cycle 3's review musts cured | `5cfa601a1` |
| 09-27 09:58, 10:02 | cycle 4: the splitter split for the line budget, then taught redirections and comments (+79 source, +60 test lines) | `c41b257c9`, `537f4bfa8` |
| 09-27 10:22 | PR 261 opened as a draft at the WIP slot | the pull request |
| 09-27 10:29 | option shapes stop at a bare `--` (the Director's matcher cure); the reviews' musts | `c8463858e` |
| 09-27 10:39 | **cycle 5: the estate's segmenter found** by an assumptions-expert check a cycle 3 reviewer asked for; moved to `agent-tools/src/shell/` as a pure move (five renames, zero content change) | `eb322945e` |
| 09-27 10:43 | the one cure at the owner: a word ends at a redirection; a guard argv-mode bypass closed | `0de0f60bb` |
| 09-27 10:47 | the reader consumes the segmenter; **the splitter deleted**: 350 source and 188 test lines out, `shell-commands.ts` 72 lines in | `8909f2efb` (+149, −557) |
| 09-27 11:07 | cycle 5's review cures (the argv kept beside a lifted script; quoted operators are text) | `240d7746b` |
| 09-27 11:13 | ready; both legs requested | the timeline |
| 09-27 11:16, 11:18 | round one on `a9e006557`: Copilot five threads, Codex one | the timeline |
| 09-27 11:26 | settlement push 1 | `ea8fddc72` |
| 09-27 11:36, 11:38 | round two on `ea8fddc72`: Codex clean, Copilot five | the timeline |
| 09-27 11:49 | round two's cures with SonarCloud's seven minors | `93bcf8d74` |
| 09-27 11:52 | this seat cut off by the usage limit; the owner's continue at 12:0xZ | comms `45e47748`, `3c575768` |
| 09-27 12:14 | sync 3 with settlement push 2, the budget's last | `02c9c7562` |
| 09-27 12:23 | round three on `02c9c7562`: Codex one, Copilot three | the timeline |
| 09-27 12:28 | this seat's closeout; claim `f7d8f0de` retained with a handoff record | comms `df8d6012` |
| 09-27 12:32, 12:33 | the Director routes the door to Nova; Nova adopts the claim | comms `f3742c50`, `c3ec1a8d` |
| 09-27 13:42, 13:44 | push 3: round three's four cures with five post-execution reviews' findings; the residuals to the node's ledger | `aa9ed4617` (+963, −293), `ffcc8f24c` |
| 09-27 13:53, 13:55 | round four on `ffcc8f24c`: Copilot four, Codex one | the timeline |
| 09-27 14:08 | push 4, past the budget on the owner's word: three over-bar cures; two findings rejected with evidence | `f47841aae` (+203, −72); comms `b6654743` |
| 09-27 14:18, 14:19 | round five on `f47841aae`: Codex clean; Copilot no thread, one body item below the bar | the timeline |
| 09-27 14:30 | **merged** `5a9a854ef`; branch, worktree and claim retired with read-back | comms `bdd08fc6` |

Derived at writing time: five reviewed heads; twenty review threads (six, five, four, five, none)
and one below-bar body item; four settlement pushes against a budget of two; the gate at landing
priced the heads 0, 15.7, 0, 13.56 and 13.83, total 43.09 of 40, exhausted (the ledger row of
`c52b53f85`). Pre-landing, the lane ran five cycles with two pre-execution design reviews (code,
test) and, as an open set with exemplars, post-execution reviews per cycle (cycle 3 code and test;
cycle 4 docs and test; cycle 5 code, test and security plus the assumptions check; the door seat's
push 3 code, test, security, architecture and assumptions).

## The twenty findings, read as classes

The threads' first comments, read at writing time, sort into three classes and two singletons. The
set is open: these are the exemplars the threads carry.

- **A, the renderer printed a slice of what a seat typed** (six, rounds one and two): a value shaped
  like a long flag printed by name; a record type emitted verbatim; the whole short-option cluster
  in `Hit.token`; the first letter of a dash-prefixed value; a turn id emitted verbatim; a record key
  named like an object property counted onto the prototype.
- **B, the shell reading failed open at a shape it did not model** (seven, rounds one to four; one
  rejected): `eval` and `ssh` operands never scanned (two threads, one defect); ssh's value-taking
  options unread before the host; a leading redirection read as the program; the script after `-c`
  filtered away when it began with a dash; an ssh cluster with an attached login read as taking the
  next word (introduced by round two's cure of the option-value instance); a wrapper followed by a
  `{fd}>` redirection (rejected: it flags, and a regression row now pins it).
- **C, the harness-record contract read leniently at one more edge** (seven, rounds one, three and
  four; one rejected; two threads one defect): an exec request with no call id vanished (Copilot and
  Codex); the strict count counted entries, not hits; a function-tool output accepted under a
  code-mode preamble; output parts accepted without the `input_text` type; `task_complete` ignored,
  so later evidence folded into a closed turn; a provenance concern on function-tool refusals
  (rejected on the 0.157.1 source).

Every instance was real on a first-hand read except the two rejected with evidence. Every instance
was cured on its own, in the round that found it. No round's cure carried a test for the class.

## The causal stack

**Technical root.** Two shapes were built or extended in the lane where the estate held, or lacked,
the canonical one. First, a POSIX shell splitter was written beside the guard's segmenter and grown
for three cycles (about 350 source lines and 188 test lines at its largest) before being deleted in
favour of the module two directories away. Second, three boundaries (the allowlist renderer, the
shell grammar's open ends, the harness-record contract) were each implemented branch by branch and
tested by example: a nonce at one position, one shell form per table row, one carrier shape. Each
review round found the next example.

**Process root.** No step of the lane owned the prior-art question. The design named five
second-consumer lifts of small helpers (`isRecord`, `makeIo`, the fixture helpers) and never the
splitter, because the rule that governs the case, `consolidate-at-second-consumer`, fires when a
second consumer is ADDED, and a lane that does not know the first consumer exists never reaches
its trigger. The scoping artefact's IN set enumerates the goal's surfaces and the output's
downstream consumers; it does not ask who already reads the input noun. Two pre-execution reviews
judged the design's internal consistency and its tests, not its prior art. The finder was a
reviewer who counted the ratchet (a splitter added, then split, then more rules) at cycle 3 and
asked for a bounded solution-class check; the assumptions-expert found the module with one search.

In the review loop, findings were cured as instances, never as classes. The loop shrank, six, five,
four, five, none, but slowly, and one instance was created by an instance cure: round two's fix for
ssh's option values read a cluster's last letter and so opened the `-ljoe` hole round four found.
The settlement budget of two pushes was spent at push 2; the owner's standing word ("known broken
code gets fixed") carried pushes 3 and 4 through the Director's routing. The door seat's assumptions
review named class B as a class at 13:26Z ("the grammar fails open at each option it does not
model"); the cure made the grammar fail closed at its open end, and round four still found a B
instance in a reader the cure did not reach.

**Meta root.** A lane's frame is the lane's design, and the estate is background until something
forces it into view. A thing you have begun does not feel like a thing to look for; a finding you
can cure in five minutes does not feel like a class. Both are one fluency: the smooth next move
(continue the splitter you started; fix the branch the reviewer pointed at) bypasses the situational
check (does the estate already read this? is this the third instance of one leniency?). The estate
holds the doctrine for both (`metacognition` §Fluency Is a Warning; `concept-exploration` §Stacked
symptoms; `consolidate-at-second-consumer`) and has no firing gate at the two moments where this arc
needed one: cycle 1 of a code lane, and the second finding of a class in a review round. The next
"why", why minds prefer to continue what they began, leaves the estate's control; the stack stops
here.

## The counterfactual test

**The segment that ran under the cured process is cycle 5.** From 10:39Z to 11:07Z three commits
moved the segmenter, cured it once at its owner and made the reader consume it; with its three
post-execution reviews the cycle took about an hour and left the estate 332 lines lighter (the
three commits' net, +323/-655; the consuming commit alone reads +149/-557) and one guard bypass
narrower. The uncured segments, cycles 2 and 4, built and grew the splitter across two
review cycles (cycle 2's late nits; cycle 4's pre-execution REVISE and post-execution docs and test
reviews), all of it superseded and deleted at 10:47Z. Had the prior-art question been asked at cycle
1 (21:00Z on the 26th), cycle 2 would have consumed the segmenter directly, the guard's redirection
cure would have landed the evening before, and cycles 4 and 5 would not exist: two review cycles and
about 540 written-then-deleted lines, at the commit clock about two hours of a seat's day.

**The segment that could have run under a cured loop is round two.** Round one carried two class-A
findings. One behavioural test, a nonce at every argv position, dashed or not, glued to `=` or not,
asserting that no character of it survives in either render unless the token is a vocabulary
member, would have failed on the renderer of `ea8fddc72` at four places: the four class-A findings
round two then reported. Round two becomes a Codex-clean round with at most one B finding, the
budget keeps its second push for round three, and one priced head (about 15 of the 43) is not
spent. The per-unit reading: a settlement head cost about 14 whichever seat pushed it; a class test
costs one test.

The class-B evidence cuts the other way and belongs here too: the door seat DID take the class as
the cure target at push 3 and round four still found one B instance, because the cure reached the
grammar and not the ssh reader beside it. A class-level cure needs a class-level probe (every option
table, every reader that walks options), or it is an instance cure with a wider name.

## Honest credit

- **The Bash guard is harder.** Its segmenter lives in a neutral topic with a second consumer and
  seven cures, each verified against bash by the reviews (a glued long option; a word ending at a
  redirection; quoted operator characters as text; a leading redirection before the program; the
  script after `-c` options; ssh option values and clusters; git global options with values). A
  security surface every seat runs under was hardened through a reader's pull request, and the
  duplicate splitter was the second implementation the first differential ran against: its "one
  shared defect" was the redirection bypass. The comparison found it; a bash differential would have
  found it cheaper.
- **The reader exists.** Condition 5's second indicator, `codex-exec command-records`, landed with
  its strict mode, its three evidence classes and over eight hundred tests across the reader, the
  shell topic and the guard.
- **The handoff worked.** A seat closed out mid-loop with a retained claim and a handoff record; the
  successor adopted the claim within a minute of the routing and landed the pull request two hours
  later, curing two rounds the first seat never saw. The Closeout Contract's open-pull-request
  clause has a worked instance.
- **Two mechanisms have words now**: the prior-art question at cycle 1 has no owner; and N findings
  of one class are one finding, best cured with a class test before the next instance cure.
- **The budget suite has a data point**: five rounds, 43 of 40, the owner's word carrying two
  post-budget pushes for real defects, and both seats' stop-round readings agreed by the gate.

None of this excuses the price. The guard cures were worth more than a day's delay; they did not
need the splitter to be found, and the class tests did not need four rounds to be written.

## Proposals, each with warrant, falsifier and lane

1. **The prior-art line** (fast lane, operational). `scope-from-goal-before-approach` gains one
   sentence under "Derive the full relevant set": a lane that will write a parser, matcher,
   validator, reader or renderer of some noun puts every existing reader of that noun in the estate
   into its IN set, found by a search over the noun's vocabulary, and the GOAL · IN · OUT artefact
   names the result or "none found by <the search>". The pre-execution code review checks that the
   line was produced by a search, not from memory. **Warrant**: this arc; the finder was one search;
   the design lacked the line. **Falsifier**: three code lanes carry the line and it never changes an
   approach (ceremony, cut it); or a lane carries it and still duplicates (the line was filled from
   memory, and the cure is a validator, not a sentence). **Carrier**: the queued doctrine edits lane
   (the Director's ruling `1ba895c3` (2); Nova after PR 250, or Siren on resuming).
2. **The class test at the second instance** (fast lane, operational). `pr-lifecycle` §Phase 4
   triage: when a round's findings carry a second instance of one leniency at a second place, the
   settlement push carries a structural test for the class (a nonce at every position; a probe over
   every option table and every reader that walks options; every carrier shape) and names it in its
   gate line; the class test precedes the instance cures, because the instance cure under drive is
   where the next instance is made. A push that cures instances without the class test is not a
   settlement of that class. **Warrant**: PR 261's rounds one to four (A six, B seven, C seven);
   round four's ssh instance made by round two's cure; the loop six, five, four, five, none with the
   budget exhausted. **Falsifier**: a lane writes the class test after round one and the next round
   still finds an instance of that class (the class was mis-named, or coverage is not the
   mechanism); or the clause fires on singletons and inflates pushes. **Carrier**: as 1.
3. **Stop processes by parent, and count subagents** (fast lane, the `wrap` skill). The process
   disposition names subagents (the agent list) beside monitors and crons, and stops by the seat's
   own parent pid, never by a command-line pattern that any seat's loop matches. **Warrant**: this
   seat's close: six review panes reported as "nothing running", then a peer's heartbeat sleep
   signalled by a pattern sweep (napkin, 12:1xZ and 12:3xZ). **Falsifier**: the sentence blocks a
   legitimate stop of the seat's own process (then it is mis-drawn); or three wraps pass with no
   instance and the practice already holds it (then it is redundant, and stays as a sentence, not a
   rule). **Carrier**: the next Practice pull request that touches the wrap skill.
4. **No slow-lane entry.** The meta root is already doctrine at the directive tier
   (`metacognition` §Fluency Is a Warning) and this arc adds two firing moments, which are
   proposals 1 and 2, operational. The budget question a shared-guard cure raises (does a
   security cure on a shared surface count against the carrying pull request's budget?) is already
   on the owner's card as line (d) and in the node's review-dispositions ledger (`ffcc8f24c`); it
   is not duplicated here.

## Free play over the arc, bounded

Kept, as associations only. The handoff boundary fell exactly between the classes: this seat saw A
and B's first instances, the successor saw B and C. A successor is the cheapest external observer
of the predecessor's blind spots that the estate has; the wrap skill's "external bound" has a face.
Inverted: the splitter was not only waste, it was the second implementation a differential needs,
and the comparison it made possible found the guard's shared defect; the caution is that a bash
differential finds the same defect without the second parser. Discarded, visibly: the reader's
`unaccounted` class set beside "a finding with no class" (forced); the guard's segmenter as "the
peer who was in the building all along" (an image, nothing to route).

## Success test

This record has paid its way if proposal 1 or 2 lands as a clause through its named carrier, or if
the next review round on any lane treats a second instance as a class before curing it. It has named
two mechanisms the estate lacked words for: the prior-art question at cycle 1 has no owner, and an
instance cure under drive makes the next instance. If neither proposal is routed and the next lane
builds a parser it did not need, this record was a eulogy.
