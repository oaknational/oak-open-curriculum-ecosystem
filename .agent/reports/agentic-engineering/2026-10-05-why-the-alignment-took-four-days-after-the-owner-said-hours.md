# Retrospective: why the alignment of the two Practices took four days after the owner said hours, and which segment ran right

Written 2026-10-05 by the seat that held the Director seat for the arc (Crucible binds Slag,
7b999c, claude-code, claude-fable-5-1), at the owner's word after the compaction that followed
its handoff: "post-compaction you will run a retro, then your session will be complete" (14:3xZ)
and "Please plan then run a restrospective" (15:3xZ). The arc runs from 2026-10-01 to
2026-10-05 across both estates, jimcresswell.net (home) and OCE (the sibling): the parity
measure and its ledger, the per-surface twinning plan, the owner's turn, the definition of the
Practice, the alignment node, the doctrine landing (321, #353) and the code landing (322, #354),
finished by the successor seat (Sycamore holds Spore, 18d874) at 16:33Z and folded at 17:17Z.
Every count names the command or file it is derived from; every proposal names its warrant,
falsifier and PDR-130 lane; the adversarial read's findings are quoted as returned.

## The owner's words that bound the arc, verbatim

- 2026-10-02 20:1xZ (the sibling's Director handoff §STATE, line 614): "We WILL finish the
  Practice work in the next few hours".
- 2026-10-02, the standing words (the napkin archive, 17:2xZ): "ALL of this work is bounded, ALL
  of it must have a known, reachable, measurable end state, and ALL of it must be finished soon."
- 2026-10-03 13:0xZ (the napkin, 13:1xZ block): "Once you have a goal and plan for finishing the
  work, update the repo plan and include sizing, I would still like this work finished today."
- 2026-10-03 21:0xZ (the napkin, 21:0xZ block): "Yesterday I said finish within 2 hours as a
  guide, if the estimate hits four we have a problem. Today I said finish today. Now you are
  telling me that we need all of today and ten straight hours tomorrow. And I am telling you,
  that means we are doing it wrong." Then: "I am happy to do this in two large PRs"; "This is an
  n=1 session and will stay that way until we have a simple model to proceed with, I will decide
  when."
- 2026-10-04 14:3xZ (the napkin, 14:1xZ block): the family layer, "I would expect all Typescript
  family repos to have the same package.json scripts, at least for Practice operations, which
  includes all quality gates"; 15:0xZ: "tooling agnostic policy, strict universal contracts,
  tooling specific implementations where a universal approach is not efficient or appropriate";
  16:xZ, the card answers: "Ratify, four pull requests"; "Proceed at about five hours over two
  sittings".
- 2026-10-05 09:1xZ (the napkin, 11:3xZ block): "finished this Practice work happens today, it is
  bounded, it will end. There are also two PRs across the estates that are about 2 days old,
  that's bad PR hygeine, we should keep on top of it to avoid creating rework." 11:0xZ: "prepare
  for a full handoff to another agent ... this session is several days old and the context is
  accumulating cruft even with compaction."

## Reconstruction from primary sources

Pull requests created per day in both estates (`gh pr list --state all --search
'created:2026-10-01..2026-10-05' --json number,createdAt,state`, read 20:4xZ):

| Day | home created (merged) | sibling created (merged) | what the day was |
| --- | --- | --- | --- |
| 10-01 | 10 (10) | 11 (10) | the merge-bot convergence; capability carries lane by lane |
| 10-02 | 22 (22) | 19 (19) | the twinned slices (#328 to #339 and their home twins); the parity node and ledger |
| 10-03 | 11 (3) | 5 (3) | the doctrine batch 311 merged; the ledger revision; two home surface lanes pushed and never opened; five dependabot pull requests closed by the owner |
| 10-04 | 3 (3) | 3 (3) | two folds; the definition landing (319, #351); the doctrine landing opened |
| 10-05 | 2 (1) | 2 (1) | the code landing (322, #354); the folds of the day's coordination drafts |

The alignment's own landings, from the API (`gh pr view --json`, `gh api .../reviews`, the
GraphQL `reviewThreads` query, `gh api .../check-runs`, read 15:3xZ and 20:4xZ):

| Landing | opened | merged | commits | reviews | threads | settlement |
| --- | --- | --- | --- | --- | --- | --- |
| 319 the definition | 10-04 15:18Z | 10-04 18:47Z | 3 | 11 | 8 | three rounds, two pushes |
| #351 the same | 15:31Z | 18:47Z | 4 | 11 | 7 | three rounds, two pushes |
| 321 the doctrine | 10-04 21:10Z | 10-05 09:02Z | 7 | 6 | 3 | two rounds, one push |
| #353 the same | 21:28Z | 09:33Z | 4 | 11 | 7 | two rounds, one push |
| 322 the code | 10-05 10:35Z | 16:26Z | 17 | 23 | 15 | seven rounds, six pushes, one rebudget |
| #354 the same | 11:13Z | 16:33Z | 16 | 24 | 13 | five rounds, five pushes, one rebudget |

"Reviews" counts every review object, the bots' thread replies included; the review legs were
Copilot at every push and Codex at most. All 53 threads are resolved; every check run on every
merged tip concluded success. The paired merges landed four seconds apart on 10-04 and six
minutes apart on 10-05.

The code landing's sizes at the merged tips (`gh pr view --json additions,deletions,changedFiles`,
read 20:5xZ): 322 changed 465 files, +40,508 and -2,955 lines; #354 218 files, +11,149 and
-1,204. The byte proof the
successor posted at the merged tips: 829 shared paths, 776 identical, 9 placeholder-only, 44
differing, every difference in the contextual layer the doctrine landing named.

The push gates on the code landing, from the session's push logs (`push-*.err`, one file per
`merge-bot push`): home, one refusal then three pushes before the handoff; sibling, four
refusals before its first push reached the remote at 11:12Z (the Playwright browser build absent
on the machine, one unused type export under the sibling's knip rule, the depcruise gate's roots
pinned to the home's directory names, a product validator's stale reviewed hash). Each gate ran
fifteen to twenty minutes; the two estates' gates ran one at a time on one host.

The review-cost ledgers (the home's, new in the code landing; the sibling's rows of 2026-10-01
onward): on 10-02 twelve sibling slices carried rows, two exhausted (#328 at 45.66 of 40, #332 at
58.54 of 20) and three warned; on 10-05 the code landing's rows read 62.74 of 120 (home, after
one PDR-140 rebudget, warn) and 41.25 of 100 (sibling, within); the doctrine landing 13.98 and
11.55 of 40; the two folds 22.65 and 36.57 of 40, both warn, on findings about the records' own
freshness.

Wall-clock, from the commit and merge instants: the owner's 09:1xZ word to the sibling's fold at
17:17Z is eight hours. Inside it the code landing's authoring ran from 09:5xZ to the first push
at 10:34Z (thirteen home commits between 10:14Z and 11:05Z, twelve sibling commits between
10:28Z and 11:08Z, from the commit loop's files), and its gates, reviews and settlement ran the
remaining five and a half hours across two seats. The doctrine landing took "about two and a half
seat-hours from the resume to both pull requests" (the napkin, 22:4xZ) with six workers, against
a two-hour estimate, and its settlement one hour. The 10-03 per-surface route sized the shared
text at "about fifteen seat-hours if both seats run continuously" (the napkin, 13:1xZ); when
the owner stopped it at 21:0xZ, the doctrine batch 311 had merged and the two home surface
lanes were pushed, never opened. The successor's reading of the finish: "about eight seat-hours
over two days against a two-hour yardstick, most of it reading what had moved" (the napkin,
17:3xZ).

The ceremony, from the napkin's headings (`grep '^## 2026-10-0[1-5].*Crucible'` over the active
napkin and its archive): nine compaction boundaries of this seat in the arc, each with a
four-pass reflection and a wrap, each followed by a resume read (10-01 20:5xZ; 10-02 14:4xZ and
20:0xZ; 10-03 07:1xZ, 13:1xZ and 21:0xZ; 10-04 19:0xZ; 10-05 00:4xZ and 14:3xZ), plus the handoff
at 11:3xZ. Between 06:2xZ and 12:4xZ on 10-03 the owner's freeze held every outward act.

## The causal stack, by depth

**Technical root: one text could not pass two gate sets.** A validator one estate ran and the
other did not made the shared text host-bound in effect: the cited-paths, cited-scripts and
lineage-names validators here, knip's unused-export rule and the product lockstep there, the
depcruise gate's pinned roots, a Playwright browser build the sibling's gate needs on the pushing
machine. Every doctrine carry hit one of these (the napkin's 22:4xZ lessons; the four sibling
refusals above). The code landing's validator alignment and the family conformance manifest cured
the root; the napkin's 00:4xZ block named it the keystone "and not a carry among carries", which
is the right reading. Two more: a carried directory swallowed by the host's bare `build` ignore
line (the local gate read the disk and passed, CI read the commit and failed), and the merge-bot
that the system review had read as "identical by name" and that measured at 1,185 differing
lines.

**Process root: the unit of work was the hunk times a pull-request lifecycle, twinned.** The
10-02 day ran forty-one pull requests through two bot reviewers, a settlement budget, records and
the bot's door each; the 10-03 plan priced four surfaces at fifteen seat-hours and twinned each by
a second seat by content; the Director sat on the instrument (folds, review settlement,
re-requests, first-hand reads of every Core hunk) and so became the serial gate. The fixed cost
per pull request was measured on 10-03 at 07:1xZ: "310 was four files and forty-four lines, two
minutes of copying, about seventy minutes door to merge". That measurement cured the carries
the same day ("batch by kind": the doctrine batch 311, seven carries in one landing, merged on
10-03) and left the shared text per surface: the route of 13:1xZ still ran rules, skills,
directives and sub-agents as separate pull requests, each twinned by the other seat. Why the
process root was possible: the measurement priced the carries and not the surfaces, so the
surfaces kept the shape the ledger had given them; a Cricket read the seat as DRIFTING at 14:00Z
and the seat discounted it (the napkin, 21:0xZ); the owner's turn collapsed the surfaces too
("two large PRs"). The per-surface route ran for eight hours, from 13:1xZ to 21:0xZ; the hours
before it were the owner's freeze.

**Meta root: the frame was inherited from the transplant and no definition of the Practice
existed.** "The Practice" meant the copyable subset, so parity meant bytes, so the work became
hunks times a lifecycle (the seat's own words at 21:0xZ). Each estimate was re-sized with reasons
rather than stopped at twice the guide. A plan node written at a compaction boundary reproduced
the instrument it replaced (the review node's first sketch, caught by two Crickets at 09:4xZ on
10-04). The owner's definition of 10-03 21:0xZ (general, contextual, accumulated, the loop) and
the family layer of 10-04 14:3xZ dissolved the frame: once the layers existed, the alignment
became two landings by class with a proof, and the two landings took one day and a half. The next
"why" (why the transplant's frame was never ratified from first principles) leaves this arc.

## The counterfactual

The cured segment exists inside the arc. The code landing moved 465 files and 40,500 lines into
the home and 218 files into the sibling in one pull request per estate, authored in about an
hour and a half by one seat with nine workers on disjoint paths, and merged in six and a half
hours door to door. The 10-02 day moved its slices in forty-one pull requests, two of them
exhausting their budgets; the 10-03 route would have moved the shared text in at least eight
more. The like-for-like reading is the doctrine landing against the per-surface route for the
same four surfaces: two and a half hours of wall-clock with six workers plus an hour of
settlement, against fifteen seat-hours of two seats (seven and a half hours of wall-clock at
best, and unmeasured). The confound the record cannot remove: the cured segment ran under n=1
with sub-agent workers after the owner's 21:0xZ word, where 10-02 and 10-03 ran a Director on
the instrument with two twinned seats; the batch shape and the team topology changed together,
on the same word, and nothing in the arc separates their contributions.

The falsifier named on 10-03 ("a batched pull request whose review round grows with its file
count") did fire: the code landing drew seven rounds and six pushes at home under a sampling
reviewer, and needed the one rebudget PDR-140 allows. The batch still won, because the rounds
grew with the landing's size while the per-surface shape would have paid the fixed cost sixteen
times; and the rounds' cost was mostly on carried one-body modules, which a per-surface shape
would have carried too.

When could the arc have switched? For the shared text, at 13:1xZ on 10-03, when the route was
issued with the carries batched and the surfaces not; the owner reached that shape at 21:0xZ
("two large PRs"). The eight hours between held the ledger revision, the two surface lanes
pushed and never opened, and the Director's first-hand reads. One day of the four is that gap,
and no more than one: the code landing's objects (the family manifest and its validator, the
merge-bot as one body, the validators aligned) did not exist at 13:1xZ and needed the
definition of 21:0xZ and the family layer of 10-04, so the shape alone could not have finished
the alignment on 10-03. The other days were the frame's (10-01 and 10-02, lane by lane) and the
definition's (10-04, the layer pass, the ratification and the first landing, which was the right
day).

## Honest credit

The cost bought a definition the estates did not have: the five-layer model in PDR-143 and
`practice.md`, ratified by card on 10-04, and the family layer with a manifest and a validator
that refuses drift. It bought one text for the general layer in both estates with a byte proof
(776 of 829 identical at the merged tips) and one body for the tooling the proof had wrongly
read as identical (the merge-bot, the repo-check runner, the substrate audit, the docs validators,
the lint rules). It bought the review-cost ledger running in both estates with the same weights,
the CI fan-in and the ruleset switch, the doors closed and ten superseded branches retired under
the bot. It bought a handoff that worked: the successor seated at 14:44Z, settled both landings,
merged them within two hours and folded both coordination branches within three, from the
records alone plus five facts in one message. None of this excuses the price: the eight hours
of the per-surface route after its own measurement, and the frame's two days before the
definition, were the arc's to spend differently.

## The predecessor's proposals, read against the arc

The 2026-09-30 retrospective proposed five things. Each is read here against what the arc did
(the skill's success test applied to its predecessor):

1. Withdrawn by the owner's frame on 10-01. No action owed.
2. "Home the fan-out method" into consolidate-docs. Not routed: `grep -n -i 'fan-out\|decider'`
   on the skill finds nothing. Its falsifier ("the next fan-out reinvents the frame from scratch")
   fired: the doctrine landing's six-worker fan-out and the code landing's nine-worker one each
   wrote a fresh brief (the scratch `BRIEF.md` and `BRIEF-code.md`), and the napkin's 00:4xZ
   block says the brief's shape "is the free-play seed above", still unhomed.
3. "Fitness read twice, never as a queue". Homed: consolidate-until-done names the readout "a
   noticer for that goal" (line 34). Routed.
4. "OCE is the name". Decided by the owner's card answer of 10-04 23:0xZ ("Your words stand"):
   a Core record names an estate where it records that estate's act; PDR-142's clause amended in
   the code landing. Routed, by a different home than proposed.
5. "A test that reads `.agent/` is a defect to cure". Not routed: the sibling's
   `state-file-seeds.integration.test.ts` still reads a skill file from `.agent/skills/`, and the
   doctrine landing marked the sif annex contextual-bound because of it. No OWED row exists.

Two of four live proposals routed. The skill's own falsifier (three consecutive retrospectives
with no routed proposal) does not fire; the unrouted fan-out method is re-proposed below with a
home, and the lockstep read is left as a row for the sibling's next code session.

## Proposals, each with warrant, falsifier and lane

1. **The landing unit for cross-estate change is one pull request per estate with the byte proof
   in its description.** Never per surface, never per hunk; the proof is `cmp` or the dry-run
   merge over the landed prefixes, posted at the merged tips. Warrant: the doctrine landing
   against the per-surface route for the same four surfaces (two and a half hours of wall-clock
   with workers against fifteen seat-hours of two seats); the lifecycle counts (forty-one pull
   requests on 10-02, two on 10-05) are a weaker reading because the content differs. Falsifier:
   a one-landing pull request whose settlement cost exceeds the sum of the per-surface
   settlements it replaced (the code landing's 62.74 against the 10-02 slices' rows is the first
   reading; the next landing is the second). Lane: fast, as a clause in
   `cross-estate-work-must-reduce-divergence.md` and the pr-lifecycle skill's sizing.
2. **A plan node's §Size carries a measured rate from its first segment, and the stop rule is the
   owner's twice-the-guide.** Warrant: "two hours per surface, unmeasured" on 10-03; the layer
   pass at twenty minutes against a two-hour estimate on 10-04; the doctrine landing at 1.25 times
   its estimate reported as one line, which worked. Falsifier: a first segment whose rate misleads
   the whole by more than the estimate it replaced. Lane: fast, the plan skill's §Size contract.
3. **Settlement under sampling reviewers cures the class, not the instance, and the budget counts
   the rounds two reviewers add at every push.** Warrant: the code landing's rounds four and six in
   both estates were half-cured classes (the optional-reads class, the `--fail-if-no-match`
   class), each costing a round in both estates; the definition landing spent its two-push budget
   by round three of three. Falsifier: a class cure that draws a further round on the same class.
   Lane: slow (PDR-140 governs the budget); prediction: the next landing of more than two hundred
   files settles in at most three pushes per estate; review 2026-10-19, in the slow-lane section
   of `pending-graduations.md` in both estates.
4. **A carry's proof is the tracked tree and CI, never the local gate.** `git ls-files` over the
   carried tree before the push and the fan-in's result after it; the family conformance
   validator reads the tracked tree. Warrant: 322's CI red on a locally green push (the bare
   `build` ignore line); the sibling's thirty Playwright failures at 0 ms that were a machine
   fact. Falsifier: a tracked-tree read that passes a carry CI then refuses for a reason the local
   gate would have caught. Lane: fast, from the memory file `carry-proof-is-git-ls-files-never-
   the-gate` into the pr-lifecycle skill's push step.
5. **The fan-out brief is a reference page, not a scratch file.** The shape that worked twice
   (one brief, disjoint paths, no wiring edits by workers, hand-back as a table, a time box) goes
   under `.agent/reference/` in both estates. Warrant: the predecessor's proposal 2 fired its
   falsifier twice in this arc. Falsifier: a third fan-out that reads the page and still writes a
   fresh brief. Lane: fast.

## The free-play harvest (bounded; associations, never findings)

The arc's shape is a compiler bootstrapping itself: the definition (the language) was written by
reading the two instances (the programs), and the first clean build was the landing that used it.
The settlement rounds that grew on the code landing look like garbage collection pressure: the
larger the heap moved at once, the longer the pauses, and the cure was generational (cure the
class). The fourteen-hour gap between the seat's measurement and the owner's turn reads like a
message queued to a consumer who was already walking over to say the same thing. Discarded,
visibly: the four refused sibling gates as "four horsemen"; cute, forced. One seed with a possible
home: the successor's napkin stamps read local time with a Z suffix, and the arc's records
elsewhere stamp UTC, so a records validator that reads the stamp against the commit's instant
would catch the class without a reader.

## The adversarial read

One read-only leg (the assumptions reviewer) read the draft before the cures below were applied,
with the GitHub API, the napkin and the rules as its sources. Its eight findings, condensed, and
the seat's disposition of each:

1. "fourteen hours of the per-surface plan ran between the measurement and the owner's turn":
   does not hold; about five and a half of those hours were the owner's freeze (06:2xZ to
   12:4xZ) and the route was issued at 13:1xZ. Taken: the gap reads eight hours and the freeze is
   named.
2. "eight surface lanes later retired unmerged": does not hold; the eight unmerged home pull
   requests of 10-03 were five dependabot bumps, the ledger revision, the re-cut heading gate
   and one carry; the two surface lanes were never opened. Taken: the table and the
   counterfactual corrected.
3. "the batch shape was treated as the owner's decision when it was the seat's own measured
   finding": the seat's verdict in its own favour; the measurement cured the carries' batch (311
   merged the same day) and itself kept the surfaces separate. Taken: the process root rewritten
   as the smaller claim.
4. The counterfactual's "would have finished on 10-03" assumed objects that did not exist until
   the definition and the family layer. Taken: dropped; one day of the four is the gap.
5. "two and a half against ten for the same four surfaces" mixed wall-clock with seat-hours.
   Taken: wall-clock against wall-clock, and the successor's eight-seat-hour reading cited.
6. Counts: the per-day table, the reviews and commits of 319, 321 and 322 and the home ledger
   rows reproduce; 322's size did not (read at an earlier tip). Taken: both landings re-read at
   their merged tips and the tip named. The sibling's ledger figures were outside the leg's
   reach and stand on the sibling's file.
7. The proposal that "a measured shape is the seat's to take, not the owner's to ratify"
   broadens authority: `confident-seats-proceed-and-report.md` excludes what the rules reserve
   to the owner, the node's own §Size reopened the carry count with the owner, and the owner's
   words bind it ("I will decide when"; "Ratify, four pull requests"). Taken: the proposal is
   killed; its substance survives only as the process root's description. The leg named the
   landing-unit proposal as the one most likely to change a decision, with its warrant
   conflating content and topology; taken, the warrant now reads like for like and the confound
   is in the counterfactual.
8. Structural blindness: the speed-up is never separated from the team-topology change (n=1
   with workers against a Director on the instrument with two twinned seats), and the
   compaction boundaries are unpriced. Taken: the confound line and the ceremony paragraph
   added.

## Blind-spot bounds and the error signature

This record is written by the seat whose arc it judges, from its own records and the API, after
a compaction; the successor's segment is read from the successor's records, not observed. Point
outside scrutiny at: the counts this seat states (the per-day pull request table is one command's
output, re-runnable); the negatives it reports (no comms event exists for either landing, the
inventory agent found; the arc's coordination ran on the napkin, the thread record and native
messages); the verdict that favours it (the adversarial leg found one and it is cured above; a
second may remain in the causal stack's weighting of the frame against the topology). The
scratch logs and the commit-loop files die with the session; their substance is in the pull
request descriptions and the napkin blocks cited.

One instance from this record's own landing, before it landed: the seat's two consultation
events, posted at 20:43Z while the successor's boundary pushes ran, left each estate's generated
comms read model stale, and the substrate check refused both pushes at the final gate, ten
minutes in each. The technical root above ("one text could not pass two gate sets") has a
sibling the arc kept meeting: a gate that reads the disk reads every edit made under it, comms
events included, so the never-edit-under-a-gate rule covers the comms directory and the push
order is render, then push, with nothing between.
