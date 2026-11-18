---
id: review-round-predicates
node_type: delivery
name: "review-round predicates — a round is any declared reviewer's structured review of a head; a leg needs a body"
overview: "Two predicate fixes in the review instruments, each closed on a recorded harvest: the tally and the cost gate count a round when a declared reviewer's structured findings bind a head by any shape GitHub delivers (a review, or an issue comment whose findings link the head), and the merge door's reviewer leg is satisfied only by a review with a body."
status: archived
ratified_by: null
ratified_date: null
ratified_where: null
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: pr-tally
    kind: beneficial
owner_gates: []
last_updated: 2026-09-20
---

# review-round predicates — a round is any declared reviewer's structured review of a head; a leg needs a body

## Disposition (archived 2026-09-20)

Archived as an abandoned sketch, never ratified: both defects below became slices 1 and 2 of
`landing-instruments-read-the-evidence`, which the owner ratified on 2026-09-20, so nothing
here is left to govern. The text stands as the fuller statement of the two defects and their
fixtures.

## Goal

The two mechanical stops the estate built around review loops read the state they claim
to read. The review cost gate (`agent-tools review-cost gate`, in the pre-push hook) prices
every round a declared reviewer actually delivered, whatever shape GitHub delivered it in,
so a loop of settlement pushes cannot price as "within" while a reviewer is finding things.
The merge door (`merge-bot merge`, over `pr-watch`'s reviewer legs) reads a reviewer leg as
satisfied only when a review with a body binds the tip, so no review shape that carries
nothing can settle a leg.

## User groups and value

- **The shepherding seat**: the gate's verdict at the push and the door's verdict at the
  merge are the counts the seat would reach by hand from the same surfaces; the seat stops
  when the instrument says stop, and the instrument says stop when the reviewers are still
  finding things.
- **The owner**: the stop asked for on 2026-09-12 ("a dumb script counting could tell this
  had gone wrong") binds in the case most likely to need it, a vendor delivering rounds in
  its second shape while the other vendor errors; and the door cannot be settled by a review
  that says nothing, including the author's own thread replies.
- **The ledger's reader**: the ledger's rows are re-priced under the corrected predicate,
  so the calibration the owner corrects is a reading of the loops, not of the reviewer set.

## Mechanism

Both defects are predicates over review shapes, an open input space; each fix closes on a
recorded harvest (the pr-tally fixture contract: recorded once after the pull request
merges, unedited, every connection exhausted; tests never call GitHub).

**Defect 1, the round predicate.** `review-cost/measure.ts` `reviewedHeads` counts a head
as reviewed only when an entry of the GraphQL `reviews` connection from a declared
reviewer binds it and is not a skip marker. Codex delivers a round in two shapes: a review
with inline comments (a `reviews` entry binding the head), or an issue comment headed
"Codex Review" whose findings are badge-and-heading blocks each linking a blob URL that
names the head SHA. The second shape is invisible to `reviewedHeads`, and to pr-tally's
rows, which read issue comments for dispositions only. Recorded instance: PR #143, round
one (comment 5652449972, three P1 findings, every blob URL at `f762426f1`), priced by the
gate as "rounds 0" while Copilot's error marker on the same head was read as a skip.

The fix, at the lowest effective level: pr-tally's harvest normalises a **comment-shaped
review** — an issue comment whose author is a declared reviewer and whose body yields at
least one structured finding through the existing marker extraction, and whose findings'
blob URLs all name one commit in the pull request's commit list — into a review record
(author, body, state `COMMENTED`, `commitOid` from the blob URLs, `submittedAt` from
`createdAt`). pr-tally's rows and `review-cost`'s `measureRounds` consume the normalised
list, so a Codex issue-comment round is one round with its findings, characters and head,
priced like any other. A comment whose findings link two different commits, or none, is
not a round; it is reported in the tally's evidence lines as an unbound comment, never
silently dropped. No new reviewer name is hard-coded: the declared set stays the input.

**Defect 2, the leg predicate.** `pr-watch/reviewer-legs.ts` `legFor` reads any
tip-bound, landed review whose body is not a skip marker as `SATISFIED`. Replying to a
review thread through the API creates a review with an empty body under the replier's
identity, so a pull request whose author has replied to threads carries empty tip-bound
reviews under the author's identity. Today the declared set is the vendor alone and the
empties are ignored; the first time the vendor-outage ruling (2026-09-10: a subagent
review posted to the pull request stands as a leg) is used with the door by declaring the
posting identity, the door would read the author's own replies as the review. Recorded
instance: PR #142's tip `92018c1f1` carried seven empty `COMMENTED` reviews from the bot
identity beside Copilot's two error markers and its later substantive review.

The fix: a leg is `SATISFIED` only by a tip-bound, landed review whose body is non-empty
after trimming and is not a skip marker. An empty-bodied review neither satisfies nor
skips; the leg stays `OWED` and the evidence line names the empties by count. The quiet
window anchor already excludes signed self-replies; it excludes empty bodies the same way,
so a reply cannot hold a window open. Nothing else about the door changes: the door still
merges only on `SETTLE-READY`, and the declaration of the expected set stays explicit.

**Consequence for the ledger.** The six seeded rows were priced under defect 1; once the
predicate is fixed the survey re-prices them and the rows' numbers are replaced, with one
line under the table saying the rows were re-derived under the corrected round predicate
on the named date. No weight changes: the policy is untouched, only its input.

## Acceptance criteria (each with a proof — required)

1. The #143 harvest, recorded after merge, prices round one as one round on `f762426f1`
   with three findings, and the gate's verdict for the settlement push at `1ba34663f`
   reads the opening round as priced and the settlement round as charged — proof
   `repo-safe`: `agent-tools/tests/review-cost/measure.integration.test.ts` over
   `tests/pr-tally/fixtures/pr-143-harvest.json`.
2. pr-tally's rows for the same fixture show round one bound to `f762426f1` with its three
   raised findings — proof `repo-safe`: `tests/pr-tally/rows.integration.test.ts`.
3. The three existing fixtures (#135, #136, #138) produce the same rows and prices as before
   the change, except where an issue-comment round exists in them; any difference is
   asserted explicitly in the test, never absorbed by re-recording — proof `repo-safe`:
   `tests/pr-tally/corpus.integration.test.ts`.
4. A comment whose findings link two commits, or no commit, is not a round and appears in
   the evidence — proof `repo-safe`: `tests/pr-tally/harvest.unit.test.ts` with literal
   inputs.
5. A tip-bound, landed, empty-bodied review from any author leaves the leg `OWED` with an
   evidence line counting the empties; a non-empty non-skip body satisfies it; a skip
   marker still routes to the skip arms — proof `repo-safe`:
   `agent-tools/src/pr-watch/reviewer-legs.unit.test.ts`, plus an integration case over
   the recorded #142 harvest's `reviews` (seven empties, two markers, one substantive) in
   `settlement`'s suite.
6. The ledger's six rows carry the re-priced numbers and the re-derivation line, and the
   survey's output for those pull requests matches the rows — proof `repo-safe`: the
   survey run recorded in the landing pull request's validation section, and the ledger's
   own text.
7. No test performs IO: every suite reads recorded fixtures or literal inputs — proof
   `repo-safe`: the pre-commit gate's test run and the fixture README's contract.

## Out of scope

- Any change to the cost policy's weights or to the budget's reading; the ledger's
  weight-change rule (the owed-items records node) governs those.
- Treating a Codex issue-comment round as a reviewer leg for the door: the door's expected
  set is declared per call and names the vendor whose reviews bind the tip; widening the
  leg to comment-shaped reviews is a separate decision with its own fixture.
- Excluding the pushing identity from satisfying a leg: the 2026-09-10 ruling has the seat
  post the subagent's review under the same identity; the declaration is explicit and the
  body must be substantive, which closes the recorded hole.
- pr-watch's `isSkipMarker` substring defect (a substantive review quoting the skip phrase
  read as a marker on #139's tip): already cured at the tally level by `skipOnly`; the
  door's own predicate takes the same reading as its own fixture at pickup, separately.

## Todos

Sliced for two single-story pull requests, each with a declared budget of two settlement
pushes (PDR-132; PDR-140 clause 3). Pickup reads `## Review dispositions` first (absent
here: an empty ledger).

1. **Fixtures.** After #143 merges, record `pr-142-harvest.json` and `pr-143-harvest.json`
   with the fixture README's query (number changed; every `hasNextPage` false), unedited.
   These are test data; recording is the only GitHub read and happens once, outside tests.
2. **PR A, the code.** pr-tally: the comment-shaped review normaliser (harvest), the
   blob-URL binding, the evidence line for unbound comments; rows and `measureRounds`
   consume the normalised list. pr-watch: the non-empty body clause in `legFor` and the
   quiet-window anchor, with the evidence line. Tests per AC 1 to 5 and 7. Validation:
   the pre-commit gate (type-check, lint, tests, knip), the review-cost gate at the push.
3. **PR B, the records.** Re-run `review-cost survey --since 2026-09-12` on engraph after
   PR A lands; replace the six rows' numbers; add the re-derivation line; amend the
   pr-tally node's mechanism paragraph (issue comments are read for findings as well as
   dispositions) and `docs/engineering/merge-bot.md`'s leg sentence (a body is required);
   pr-lifecycle state machine item 3's `SATISFIED` definition gains "with a non-empty body".
   Validation: markdownlint, prettier, the plan-corpus validator, the markdown-links
   validator.

## Prediction and falsifier

With PR A landed, a settlement push on a pull request whose only round on the previous
head arrived as a Codex issue comment prices as one settlement round, and a declared
reviewer's leg is never satisfied by an empty review. Falsifier: a pull request after
landing whose ledger row shows fewer rounds than the seat counts from the four surfaces
by hand, or a door merge whose declared leg's satisfying review has an empty body; either
is filed against this node's mechanism, not absorbed by a special case.
