---
id: landing-instruments-read-the-evidence
node_type: delivery
name: 'Landing instruments: read the evidence that exists, and ask when nobody has'
overview: 'The merge door and the review-cost gate verdict on the evidence the surfaces actually produce, refuse loudly on evidence they cannot type, and request a review nobody has asked for.'
status: ratified
ratified_by: 'Jim Cresswell (owner)'
ratified_date: 2026-09-20
ratified_where: 'Owner card answer of 2026-09-20 ~13:35Z in the session of Dynamo turns Temper (2a4c8a): the card "Which of these do you ratify now?" with all four options selected, among them this node''s; recorded in that seat''s handoff record and on the pull request that carries this stamp'
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-10-02
---

# Landing instruments: read the evidence that exists, and ask when nobody has

This node absorbs the sketch `review-round-predicates` (2026-09-13, unratified): its two
defects are slices 1 and 2 here, restated with their fixtures. This node's ratification on
2026-09-20 retired that one; it is archived as an abandoned sketch with a disposition note. The `agent-tools-watch-commands` node
keeps the command-surface candidates in its own disposition ledger (the session-script
commands, the deletion-sweep integration); this node owns the readings and the one act.

## Goal

A pull request is never held by evidence the instruments can see and cannot type, and never
landed on evidence that says nothing. When a wait exists only because nobody asked a
reviewer, the door asks, once, and says it did. When an instrument cannot classify what it
is looking at, it refuses loudly and quotes it, rather than reading silence.

## User groups and value

- **The shepherding seat** gets the verdict it would reach by hand from the same four
  surfaces, and a stall that ends with a request instead of an escalation.
- **The owner** is asked only what is genuinely theirs — a vendor outage, a policy choice —
  never "the vendor answered in a shape the tool does not parse". Worked instance,
  2026-09-15: #147 sat green, zero threads, with Codex's completion comment naming the head,
  and the door refused `SILENT-WAIT-NO-REVIEWER`; the decision reached the owner because the
  tool could not read a sentence a human reads in a second.
- **Every later seat** inherits refusals that name what was seen. An unclassified shape is a
  named refusal, so the next vendor change is one typed source, not another silent stall.

## Mechanism

Four readings and one act. Each names the defect it cures and the recorded instance.

**1. One evidence type, two questions.** `pr-watch/reviewer-legs.ts` reads a single shape:
an entry of the `reviews` connection, landed, bound to the tip, whose body is not a skip
marker. The surfaces produce at least five: a review with findings (a summary body, or inline
comments of its own under an empty summary); a review with an empty body and no inline comments
(a thread reply creates one under the replier's identity); an issue comment carrying a
round's findings, each linking a blob URL that names a commit; a completion comment stating
the commit reviewed with no findings, beside a reaction; and a review posted by a seat for
an unavailable vendor under the 2026-09-10 ruling. The cure is a typed reading —
`{ reviewer, source, tipBinding, substance, id, at }` — over which the leg asks two
orthogonal questions instead of one: **did this reviewer look at this tip**, and **did it
say anything that must be dispositioned**. `SATISFIED` needs the first; `substance: empty` —
no summary body and no inline comments of its own — never satisfies; a skip marker keeps today's
arms. A body from a declared reviewer that
names the tip and types to nothing is `UNCLASSIFIED`: the verdict refuses and quotes it.
Recorded instances: #147's completion comment (2026-09-15), #142's seven empty tip-bound
reviews (2026-09-12), #143's comment-shaped round (2026-09-13).

**2. The act: request the review nobody asked for.** Copilot binds any head the bot requests
(`POST pulls/{n}/requested_reviewers`); the Codex connector's own text lists its triggers as
open, ready, and an `@codex review` comment — a push is not among them. So a leg can be OWED
with nothing composing and nothing coming. When a leg is OWED, no run is live, and the
reviewer is in the repository's automatic-review configuration, the door issues one request
per tip, records it in the evidence, and keeps polling. It never weakens a verdict: the
request is an act, and settlement still needs evidence. Cures F-167 (a merge-only tip draws
no automatic review) and the #147 shape.

**3. The liveness residue.** The review-runs leg still carries F-166/F-185's tail: the
pull-request pair is validated for null-shape but not for agreement (this PR's URL beside
another PR's number passes), the URL match is exact-string where GitHub's rendering varies,
the view's own id is parsed and never compared with the run requested, and the window is
user-scoped across repositories so foreign runs consume the list limit before this
repository's appear. Each is a narrow guard with a literal-input test.

**4. The cost readings.** `review-cost`: `gitDiffStat` calls a round a sync when the head's
tree equals git's automatic merge of the head's own two parents, without asking whether the
first parent is the previous reviewed head — so a cure pushed beneath a clean base merge
prices zero (#145's third push, 2026-09-15). An upstream carrier's rounds price the import
as the seat's churn (#147: 552.25 then 503.87 against a budget of 40) although the seat authored
none of it; the carrier is priced by its fork-side resolution diff. **Corrected 2026-09-16
(owner):** the premise that a carrier's cure-worthy count is "zero by construction" is FALSE —
the two repositories are peer forks of OCE that merge back, not an upstream and a downstream, so
a finding on carried code is cure-worthy HERE. Only the PRICING claim survives, and it survives
because the seat did not AUTHOR the import, never because the findings belong to someone else. And `BUDGET-EXHAUSTED` names the
smallest declared budget that would admit the next push, which the owner and the seat
currently derive by hand from an unstated unit weight. A base sync that resolves a conflict
prices as a full settlement push (pull request 250, 2026-09-27: 179.23 of 40, and the pre-push
gate refused the sync; the Director routed it as a tool defect), so the sync test admits a
base merge whose tree differs from git's automatic merge only on the conflicted paths, and
the gate prices only those resolution lines.

**5. The watch exit predicate.** `pr-watch --watch` exits ALL-GREEN on a pull request that
is CONFLICTING with a standing change-request (F-162, F-164, three recorded instances). The
exit predicate gains mergeability and review decision; the command's emission and CLI shape
stay with the `agent-tools-watch-commands` node.

Why this produces the goal: the leg's two questions are the distinction every one of the
recorded stalls turns on, and typing the sources makes the next vendor shape an addition
rather than a silence. The act converts the one stall class that no evidence will ever end.
The cost readings make the gate's arithmetic about the seat's own work. Nothing here widens
what may merge: every change either adds evidence the tool can read, or refuses more loudly.

## Acceptance criteria (each with a proof — required)

1. A recorded harvest whose only tip evidence from a declared reviewer is a completion
   comment naming that commit reads `SATISFIED`; the same harvest with the named commit
   changed reads a refusal that names the failed precondition (the commit is not the current
   tip) and quotes the comment, never `OWED`, as the ruled decision note requires —
   `repo-safe`: `agent-tools/src/pr-watch/completion-comments.unit.test.ts` (one refusal
   case per precondition, over the comment recorded on #160) and
   `agent-tools/src/pr-watch/settlement-completion-comments.unit.test.ts` (the tip-bound
   comment satisfies; the non-tip comment reads `UNCLASSIFIED-EVIDENCE`, quoted). Amended
   2026-09-20 from `reviewer-legs.unit.test.ts` + a #147 fixture: the transport is read in
   its own module and the leg machine is unchanged.
2. A tip-bound landed review with an empty body and no inline comments of its own never
   satisfies a leg, and the evidence line counts the empties; the same review carrying inline
   comments is a review with findings — `repo-safe`: the same suite, with the recorded #142
   harvest and a literal inline-only review.
3. A comment-shaped round is one round with its findings and head in both the tally rows and
   the cost survey — `repo-safe`: `tests/pr-tally/rows.integration.test.ts` and
   `tests/review-cost/measure.integration.test.ts` over the recorded #143 harvest.
4. A body from a declared reviewer that names the tip and types to no known source produces a
   refusal quoting it, never `OWED` — `repo-safe`: unit test over a literal unknown body.
5. An `OWED` leg with no live run and a configured reviewer issues exactly one request per
   tip, recorded in the evidence, and none when the reviewer is unconfigured or a request
   already exists for that tip — `repo-safe`: integration test over an injected GitHub port;
   `owner-held`: the next landing's timeline shows the bot's request, recorded in that pull
   request's landing premises.
6. The review-runs leg rejects a disagreeing pull-request pair, matches a canonically
   different URL, refuses a view whose id is not the requested run, and reads this
   repository's runs before the limit — `repo-safe`: literal-input unit tests per guard.
7. A settlement push whose head is a merge whose first parent is not the previous reviewed
   head prices the cure it carries; a carrier's round prices its fork-side resolution diff —
   `repo-safe`: unit tests over injected git output; and the ledger's affected rows are
   re-derived with one dated line under the table.
8. `BUDGET-EXHAUSTED` evidence names the smallest declared budget that admits one more push
   — `repo-safe`: unit test over a priced report.
9. `pr-watch --watch` never exits ALL-GREEN while the pull request is CONFLICTING or carries
   a standing change-request — `repo-safe`: unit test over the exit predicate.
10. No test in this node's slices performs or creates IO — `repo-safe`: the pre-commit gate's
    test run; every suite reads literal inputs or recorded fixtures.

## Out of scope

- The session-script commands (comment, ready-with-tally, create-draft, merge-at-pinned-head,
  delete-remote-branch, reply-and-resolve) and integrating the merge-base deletion sweep into
  the door: candidates on `agent-tools-watch-commands`, whose ledger already holds them.
- Granting the App the Actions write permission so a failed job can be re-run: an owner
  decision, routed there; the empty-commit shape stands meanwhile.
- The cost policy's weights: untouched here, and changed only against the review-cost ledger.
- Replacing the declared `--expect` set with one inferred from configuration: the act in
  mechanism 2 reads the configuration to decide whether a reviewer is requestable; the
  declared set stays the verdict's input.
- Any change to what may merge: no new merge path, no widened exception, no auto-merge.

## Todos

Six slices, each a single-story pull request with the default round budget (PDR-132), the
intake declared at open where the changeset carries prose (PDR-140 clause 3). Pickup reads
`## Review dispositions` first — empty at authoring.

1. **The evidence type and the completion source.** The typed reading, the two questions, the
   empty-body clause, the `UNCLASSIFIED` refusal; the quiet-window anchor excludes empty
   bodies and signed self-replies alike. The empty-body clause and the anchor landed in #149;
   #147 landed on premises without waiting.
2. **The comment-shaped round.** The harvest normaliser (author is a declared reviewer, the
   findings' blob URLs name one commit in the pull request's commits), consumed by the tally
   rows and `measureRounds`; unbound comments appear in the evidence. Needs the #142 and #143
   fixtures recorded after merge, unedited, outside any test.
3. **The act.** One request per tip for a configured, unrequested reviewer on an `OWED` leg
   with no live run, recorded in the evidence and in the verdict's grounds.
4. **The liveness guards.** Pair agreement, canonical URL match, requested-id assertion,
   repository-scoped window.
5. **The cost readings.** First-parent sync test, carrier pricing by the fork-side
   resolution, the refusal naming the admitting budget; then the ledger's re-derivation line.
6. **The watch exit predicate.** Mergeability and review decision in ALL-GREEN.

Sequence: 1 first (its remaining half is next), then 3, then 4, 5 and 6 in any order; 2 lands
when its fixtures are recorded. Slice 5's ledger line lands with slice 5, never ahead of it.

**Recorded during implementation, 2026-09-16 (Zephyr guards Leeward, 281e44).** Slice 1
was split on the Director's verdict and the owner's asleep-hours consultation route. The
TIGHTENING half landed on `lane/reviewer-leg-empty-body-281e44`: an empty-bodied review
satisfies no leg and never anchors the quiet window, with the empties counted in the
leg's detail. That half landed as pull request 149 (merge SHA:514bfc06a, 2026-09-16). Its round
one added three cures:

- the count now rides every arm;
- the expected set defaulted without `--expect` now excludes empty bodies too, because without
  that the tightening itself would have minted a phantom OWED leg;
- pr-lifecycle item 3 now states the anchor's eligibility as implemented: a non-empty skip marker
  still anchors the quiet window.

The derivation moved into the pure `pr-watch/expected-reviewers.ts`. The EVIDENCE-WIDENING half is
no longer a decision. The owner ruled on 2026-09-16 that a zero-findings review is a positive
result (`.agent/reports/merge-door-comment-evidence-decision-2026-09-16.md`), and pull request 147
landed on recorded premises that same day. What remains of slice 1 is the implementation: a
reviewer's reported result binding a tip, with the review object and the completion comment as two
transports of it.

The connector's transports, first-hand on #149 (2026-09-16):

- At ready-for-review, with a finding to report, it posted a review OBJECT carrying one inline
  comment (review 5223405525).
- At an `@codex review` comment on the cure tip, with nothing to report, it did two things. It put a
  👍 on the pull request itself (13:56:35Z). One second later it posted an issue COMMENT, "Didn't
  find any major issues", naming the commit as `8e81f02cc4` (comment 5698673326, no reactions of
  its own).
- #147's zero-findings run did the same: a 👍 on the pull request (15:51:12Z), then a completion
  comment naming `15de4bc69e` (comment 5683402893). The 👀 at 15:46:27Z recorded in #147's
  premises is no longer listed by the reactions API.
- Its About text mentions only the 👍 for a run with no suggestions.

On a zero-findings run the COMMENT is the only emission that names a commit; the 👍 sits on the
pull request and binds no tip, so it is corroboration at most. A findings run binds its tip through
the review object's `commit_id`, and its body names the commit too. The vendor's About text
describes a subset of what it emits; it is not the contract.

**Recorded during implementation, 2026-09-20 (Dynamo turns Temper, 2a4c8a).** The warrant
for taking the remaining half now: on 2026-09-20 alone this seat landed eight pull requests
(#160 to #167) each on a "Landing premises" comment recomputing the Codex leg by hand on the
same four preconditions; the comments are on those pull requests. The
implementation reads the transport in its own modules rather than retyping the leg:
`pr-watch/state-conversation.ts` parses the comments and the commits, each harvested in full by
a paginated GraphQL read (`pr-watch/harvests.ts`, beside the reviews query);
`pr-watch/completion-comments.ts` reads a declared reviewer's comment as a review bound to the
one commit it names, or as a REFUSAL naming the failed precondition and quoting the comment;
`pr-watch/completion-evidence.ts` gives the settlement half the union of both transports, the
transport evidence and the refusals; the reading gains `completionComments`; the closed verdict
set gains `UNCLASSIFIED-EVIDENCE` (a refused near-miss on a leg the tip does not satisfy; not a
wait state — the cure is a fresh result on the tip). What this leaves of slice 1: the
inline-only review (a review object with an empty summary and inline comments of its own)
still reads as an empty body — the review's own comments are not yet a leg input (the
round-two row of pull request 149 below); that is the next edit to the leg machine, its own
pull request. One substitution, recorded: the ruling's first precondition names the
repository's live automatic-review configuration, and the code reads a comment against the
`--expect` set, which `docs/engineering/merge-bot.md` requires to be sourced from that
configuration; a configured reviewer the operator did not declare is outside the reading, as
it is outside every leg, and the door refuses a defaulted set. A follow-up this node now owns,
unscheduled (test-expert, 2026-09-20): `pr-watch/state-gh.ts` multiplexes four gh legs
through one `execFileSync` seam, so its suites need a fake that branches on argv; one
reader per leg would let each test pass a constant.

**A second completion shape, 2026-09-28 (Siren herds Rudder, 158275).** On pull requests 267, 268
and 264 (2026-09-27 and 2026-09-28) the connector posted no comment per run. It kept one summary
comment (`<!-- codex-pull-request-review-summary -->`), which it rewrites on every run, and named
the commit its latest code review read in the table's completed Code Review row. The door refused
each rewrite as "edited after creation" and read the leg as OWED on a head the connector had
reviewed. The unedited precondition came from the superseded verdict's grounds, where an edit is
a way to talk the door into a merge. That edit is someone else's: an edit by the comment's own
author is that author's report. The reader now accepts a comment last edited by its author, and
refuses one last edited by any other account, deleted accounts included. It times the report at
the edit and parses the summary's completed Code Review row beside the "Reviewed commit" label.
The harvest reads each comment's `editor`. A completed row means that a review ran, whatever it
found; the findings of a run arrive as review objects and threads, which the door reads first
(pull request 264's summary read Completed for runs that had filed findings). A row still Running
names the commit under review and is refused as "names a code review still running", quoting the
row. What this leaves: the door refuses during a run window instead of waiting, because the
running row is not yet read as the connector's live run. Mapping that row to a live run is the
next edit to the leg machine.

Two follow-ups this node now owns, neither scheduled:

- `agent-tools/src/pr-watch/reviewer-legs.ts` sits at 249 lines against a 250-line
  ceiling; the tightening's own comments were trimmed to fit. The seam the ceiling is
  pointing at is extracting the body-classification predicates (`isSkipMarker`,
  `isSubstantive`, `isSignedSelfReply`) from the leg machine — deferred because five
  modules import from that module (`pr-watch/settlement.ts`, `pr-watch/expected-reviewers.ts`
  since #149 took the derivation out of `pr-watch/state-gh.ts`, `pr-tally/settlement.ts`,
  `pr-tally/rows.ts` and `pr-tally/dispositions.ts`), which makes it a second story with its own round budget. The
  next edit to this file pays that cost, so it is the next seat's first question, not a
  surprise.
- Line-limit pressure selects against the LONGEST comment, not the least load-bearing
  one. On this change the comment recording that discarded evidence must be counted —
  the clause the whole cure rests on — competed for space against dated instances already
  recorded in the SKILL. Noticed, not cured; no mechanism is proposed here. Two orderings
  that helped at the moment of the trim, from Cauldron herds Lustre (880ff9), 2026-09-16:
  ask which lines a later reader could NOT reconstruct from another surface, and trim
  those last (the dated instances were recoverable from the SKILL, the counted-empties
  invariant was not); and where decomposition is actually available, it beats
  prose-trimming outright — a ceiling breach usually wants a module split, not a shorter
  paragraph. Neither removes the pressure; they only order the queue.

## Prediction and falsifier

With slice 1 landed, a landing whose configured vendor reports zero findings in a completion
comment lands through the front door with that leg machine-checked, and no seat premises carry it
(#147 and #149 each carried the Codex leg on premises). With slice 3 landed, a merge-only tip or a push the connector does
not observe produces a request and then a review, instead of a stall that reaches the owner.
Falsifier for the evidence type: a landing where the door reads `SATISFIED` from a completion
comment whose commit the vendor did not in fact review — the vendor's own statement would
then be unreliable evidence, and the leg needs the review object after all. Falsifier for the
act: a request that produces no review within a quiet window on a vendor the configuration
lists, twice — the request would then be ceremony, and the leg belongs on the timeout arm.

## Review dispositions

One dated row per routed finding (PDR-140 ledger surface).

| Date       | Source                                                   | Finding                                                                                                                                                                                                                                                                                                                                          | Routing                                                                                                                                                                                                                                                                                                                                                                |
| ---------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-16 | #149 round two, Copilot (settlement.ts)                  | A human review with inline comments and no summary has an empty body. It neither satisfies a leg nor anchors the quiet window, so after an earlier substantive review settlement can come sooner than ten minutes after it — not only stall.                                                                                                     | Slice 1, remaining half: the typed reading must tell an inline-only review from a thread-reply artefact by the review's own comments. Bounded meanwhile by its threads having to resolve. #149's description is corrected. Re-routed 2026-09-20: the completion-transport pull request does not take it; it is the next edit to the leg machine, its own pull request. |
| 2026-09-16 | #149 round two, Copilot (states.unit.test.ts)            | No test covers the ordering where an empty review with `submittedAt: ''` is filtered before the missing-timestamp guard, so it cannot force the conservative null anchor.                                                                                                                                                                        | Slice 1, remaining half: the first edit to the settlement suite adds the literal-input case. Not pushed on #149, because a third round would exceed its budget. Added 2026-09-20 in `states.unit.test.ts` with the completion-transport pull request.                                                                                                                  |
| 2026-09-16 | #150 round three, Copilot (suppressed, the act)          | The request act names reviewers but no executable reviewer-to-trigger mapping: Copilot is requested by `POST pulls/{n}/requested_reviewers`, Codex only by an `@codex review` comment, and the door's only input is `--expect` logins (`merge-args.ts`), so acceptance criterion 5 can pass on the Copilot request while the Codex stall remains | Ratification reading, then slice 3 (the act): name where the mapping lives and prove both trigger paths in criterion 5                                                                                                                                                                                                                                                 |
| 2026-09-16 | #150 round three, Copilot (suppressed, the node's shape) | Six PR-sized slices in one delivery node, where the plan skill holds that a delivery node is one step of a lane, never the lane                                                                                                                                                                                                                  | Ratification reading: the owner decides whether the node ratifies as written or splits into delivery nodes under a parent before any slice is taken                                                                                                                                                                                                                    |
| 2026-09-16 | #150 round three, Copilot (suppressed, criterion 1)      | Criterion 1 proves the happy path and a non-tip commit only, where the ruled decision note also requires a configured author, an unedited comment and an abbreviation resolving to exactly one commit of the pull request                                                                                                                        | Slice 1, remaining half: criterion 1's proof carries one refusal case per precondition. Done 2026-09-20: `completion-comments.unit.test.ts`, one case per precondition.                                                                                                                                                                                                |
