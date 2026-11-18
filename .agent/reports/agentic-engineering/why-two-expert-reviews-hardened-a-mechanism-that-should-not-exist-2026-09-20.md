# Why two expert reviews hardened a mechanism that should not exist

**Retrospective, 2026-09-20.** Commissioned by the owner while pull request 158 waited on its
third round. Author: Dynamo turns Temper (2a4c8a). Arc: the sync-machinery segment of the Oak
integration lane, 2026-09-17 to 2026-09-20, with the git file-monitor incident inside it. The
carrier itself (pull request 154) is still open and is outside this record. Every count below
was recomputed from the pull requests, commits and comms events at writing time.

## The surprise

Two things cost far more than their final size, and they turned out to be one thing.

- **Pull request 158.** Its workflow diff peaked at 144 added lines and landed its third round
  at 37. In between: two pre-commit expert reviews (security and code, 2026-09-17), three
  pushes, three bot rounds, seven threads, one owner card, and a design reversal. The final
  shape is a written version of what this seat had already done by hand in about ten minutes on
  2026-09-17 when it replaced the stale carrier (pull request 151) itself.
- **The git hang.** Work on this host stopped at about 16:15Z on 2026-09-17 on the owner's card
  answer "investigate first". The measurement that forced the decision (the same command with
  and without the file monitor, no load) took about thirty seconds on 2026-09-19 and needed no
  probe: the monitor saved nothing. The causal probe that followed took seven minutes.

## Timeline (instants from the platform and the comms stream)

| When (UTC) | What |
| --- | --- |
| 09-16 21:31 | The carrier workflow opens 151 at release 1.181.4. |
| 09-17 15:32 | This seat closes 151 by hand, 76 upstream commits stale, and dispatches a new carrier; 154 opens 15:36. The dispatch first failed 403: a bot-dispatched run's token is capped at the dispatching token's permissions (measured, runs 35240876819 and 35241924531). That became lane 1. |
| 09-17 ~15:40 to 16:10 | Lane 2 authored: the workflow supersedes an unworked carrier itself. Security review finds the read-then-act race and cites `principles.md` §No timing dependence; the cure taken is a pre-close re-read and a leased delete. Code review clears the shell. |
| 09-17 15:48 to 16:13 | Three git commands sleep on the file monitor's socket. Owner card: investigate first. Compaction; this seat stops. |
| 09-19 15:52 to 15:59 | Baseline and probe. Decision forced by the baseline; mechanism reproduced with a dose-response. A peer's read-only command on the primary sleeps ten minutes during the probe. |
| 09-19 19:42 | Monitor unset after the decision lenses and a second opinion. |
| 09-19 19:57, 20:03 | 157 and 158 open. |
| 09-19 20:00 to 20:12 | 158 round one: both reviewers find the race the re-read left. Cure: the leased delete made the first write. |
| 09-19 ~20:25 | 158 round two: both reviewers find that a lease reserves nothing after the deletion. Step-back; owner card. |
| 09-20 10:45 | Owner: the seat replaces a stale carrier at pickup. 157 merges 10:47 as `bdbdda04a`. 158 reshaped 10:50; round three: no findings. |

## Causal stack

**Technical root.** Replacing a carrier writes two platform resources, the branch reference and
the pull request's state, and the platform has no transaction over both. A seat taking the
carrier up writes the same two. With two writers and two resources, no ordering of one writer's
steps is atomic against the other. Every cure (re-read, lease, reorder) removed one interleaving
and exposed the next.

**Process root: the principle was cited by name and its prescription was not read.** The
security review of 2026-09-17 named §No timing dependence. That clause's own text says what to
do: "Eliminate the shared mutable resource instead of shrinking its window", and that an
argument containing "the window is small" names a defect. The cure taken was a re-read that
shrank the window, and this seat's description then claimed the window closed. The clause was
used as a label for the finding and never as the instruction it is. The reshape that ended the
arc is that sentence, applied: remove the second writer.

**Meta root: review happens inside the frame it is handed.** Four reviewers (two expert
subagents, two vendor bots) over three passes each accepted "the workflow supersedes" and made
it safer. None asked whether the workflow should supersede at all, and none was asked to. The
briefs this seat wrote asked "is this safe and correct?", which has no answer of the form
"delete it". A reviewer can harden a design; only the author, or a brief that asks, can
question its existence. The first question (`principles.md` §First Question) was applied at
plan time on 2026-09-17, when the proposal was one line, and not again when the step had grown
to five guards, which is the elaboration boundary the companion rule names.

The git hang has the same two lower layers. The card this seat wrote offered "investigate
first", so the work was denominated in the cause; the decision needed only the with-and-without
difference. And the probe's notice named one worktree as exposed because this seat's model (one
daemon per worktree, so isolation) was a hypothesis it had not labelled as one; the peer's
ten-minute sleep refuted it.

The stack stops here. The next "why" (why vendors review inside the frame) is outside the
estate's control.

## Counterfactual

The cured segment exists inside the arc. The reshape (one commit, 37 workflow lines, a skill
paragraph) drew one round and no findings. The uncured segment (144 lines, five guards) drew two
expert reviews, two rounds and seven threads, all true. The cheapest point to have gone right
was 2026-09-17 15:32Z: this seat had just performed the replacement by hand, under its claim,
without incident. Writing that procedure into the skill's step 1 then would have been the whole
of lane 2. The second cheapest was the security review's item 2, by reading the cited clause.

For the hang: the thirty-second baseline was available at 16:15Z on 2026-09-17, before the
card. It would have replaced about forty-seven hours of stopped work with a config line and a
second opinion.

## Honest credit

- Lane 1 is a measured platform fact the vendor's documentation does not state, now a scope, two
  tests and a truthful doc, landed. Its first review round found three stale operator passages
  that would have kept seats pushing empty commits.
- Two hardenings from lane 2's reviews stand on their own: the least-privilege token inputs, and
  a second open carrier failing loudly where `.[0]` chose silently.
- The reviewers were right every time. Two rounds of true P1 findings are what showed the
  mechanism, and the step-back predicate fired at the second cure of one sentence, as designed.
- The probe produced a dose-response, a host-wide datum nobody had, and a sketch node
  (`warranted-means-in-the-operating-environment`) sized down by a second seat before it could
  grow. A second candidate instance (the shared browser cache) arrived within hours.
- None of this excuses the price: about two days of stopped work and a withdrawn design.

## Proposals (each with warrant, falsifier, lane)

1. **A brief for any change that writes shared mutable state opens with the writers' list.**
   "Name every writer to each resource this change writes. Can one be removed?" comes before
   "is it safe?". Home: the specialist-review brief guidance that `invoke-code-experts` points
   at, and one worked-instance sentence under §No timing dependence citing this arc. Warrant:
   four reviewers, three passes, zero existence questions; the dissolving question was one
   sentence. Falsifier: the next such change whose brief carries the list still runs two or
   more rounds of race findings. Lane: fast (operational).
2. **The commit-message hook fails on commitlint warnings.** Warrant: two pushed messages with
   the same warning fourteen minutes apart (`67330f696`, `e1fe4438b`), the second after the lesson was
   written down; a note did not bind, and `no-warning-toleration` already says a warning is
   fixed or made an error. Falsifier: a legitimate message the stricter hook refuses that
   rewording cannot satisfy. Lane: fast; its own small pull request.
3. **The merge door reads a vendor's zero-findings completion comment.** Already the unratified
   sketch `landing-instruments-read-the-evidence`; this arc adds a third hand-recomputed landing
   (147, 149, 157) and one typed refusal (157, 10:46Z on 2026-09-20). Warrant for ratifying and
   scheduling it, nothing new to design. Falsifier: the vendor changes its transport. Lane: the
   owner's ratification of that node.
4. **Not proposed, by a peer's caution and this record's agreement:** the four-part warrant for
   adopted means and the fit-before-cause order stay inside the sketch node until its
   enumeration has a count. One instance is an observation.

Observations for the napkin, not proposals: a compaction summary's "fence equals file" was false
at resume and the script check caught it (a summary is a claim); a merge commit message stated
what a fold contained without reading the diff (corrected on the pull request); the first
PR watcher woke the seat on every check-count change and cost context until it was narrowed to
terminal conditions.

## Success test

The causal stack names two things the estate did not have words for in this form: **a principle
cited as a label, with its prescription unread**, and **frame-internal review**. Proposal 2
changes a gate. This record has paid its way if proposal 1 or 2 lands; if neither is routed by
the carrier's closeout, it is a eulogy.

## State of this record

Written 2026-09-20 and landed on `engraph` the same day by the coordination fold (#156); its
correction and addendum are carried by the author's records pull request (#161).

## Addendum, 2026-09-20 11:35Z — the record's own lesson did not bind its author

Written after four more rounds on pull request 158 (seven in all; twelve threads, all true; five
cure pushes against a declared two, then a sixth under a budget the owner raised).

- **Proposal 1 failed its first trial within the hour, on its author.** Straight after
  proposing that any change to shared mutable state opens with a writers' list, this seat wrote
  the seat-at-pickup procedure into the skill with no such list. Rounds three, four and six
  then found, one at a time, exactly what the list would have shown: the carrier workflow's
  schedule as a second actor on the mirror and the carrier (rounds three and four), and the
  missing author proof on a destructive act (round six). Same shape as the second commitlint
  warning: a lesson held as a sentence is retrieved only on cue, and a find-cure loop supplies
  no cue.
- **What did bind was structure, every time:** the commit-message hook on a long header, the
  markdown and machine-path hooks, the owner's permission layer on the amend, and above all the
  review-cost gate, which refused the sixth cure push and turned a loop that was promising to
  stop into an owner decision. A declared "last push" was a promise; the gate was a fuse.
- **So proposal 1 is re-scoped, not dropped.** Its sentence form is weak by this record's own
  evidence. The instrument that already sits at the right act is the pre-publication claim pass
  in `pr-lifecycle` (one context-free verification pass before a claim-bearing changeset is
  published). Neither lane pull request ran it, and the reshape had no expert review at all,
  because the owner's 2026-09-17 word "do not start any more subagents until I say otherwise"
  was never lifted and this seat never asked whether it still held for the landing work. A
  standing constraint silently disabled a prescribed instrument, and the conflict was not
  surfaced. Warrant for asking: five true findings after the reshape, each on a claim a
  context-free reader checks against the workflow. Falsifier: the next changeset that runs the
  pass still draws two or more rounds of claim-class findings. Lane: an owner question at
  resume, then fast.
- **Credit the loop anyway.** Severity fell every round (races, then ordering, then wording,
  then one safety clause, then observations only), and the final tip drew no findings from
  either reviewer.

## Addendum, 2026-09-20 13:45Z — a correction, and the proposals' routing

- **Correction.** Proposal 2 first said the two warning commits were "an hour apart". They were
  fourteen minutes apart (`67330f696` 20:50 and `e1fe4438b` 21:04 local, 2026-09-19), read from
  the commits by a context-free claim pass on the hook's own lane. The sentence is corrected in
  place because a false count in a record is cited as hard as a true one.
- **Routing.** The owner ratified by card on 2026-09-20: the commit-message hook fails on
  warnings (pull request 160); the claim pass runs before every publish (it caught eight true
  errors on the carrier before any reviewer saw them); the merge door reads a vendor's clean
  comment (the node `landing-instruments-read-the-evidence`, stamped the same day, which is
  the sketch proposal 3 calls unratified). These are proposal 2, the addendum's re-scoped
  proposal 1 and proposal 3. Ratified and routed is what the evidence supports at this writing:
  pull request 160 is open and the merge door's change is not built. Proposal 1's original
  sentence form (the writers' list in a brief) is routed nowhere.
