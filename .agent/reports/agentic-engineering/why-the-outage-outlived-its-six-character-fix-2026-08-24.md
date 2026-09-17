# Why the environment outage outlived its six-character fix

**Retrospective on the 2026-08-24 cloud-environment outage and validation-harness
arc** (OCE PR #12, castr PRs #46/#47), commissioned by the owner at arc close
("carry out, record and merge a deep retrospective") and run per the
`retrospective` skill. Author: Buzzard weaves Airstream (`01e90b`), the arc's
sole seat, written in the same session immediately after both merges. Method:
reconstruction from primary sources only (git log of the merged branch,
webhook merge events, PR-API thread totals, in-session measurements — every
number re-derived at writing time); causal stack; same-arc counterfactuals;
honest credit; proposals with warrant and falsifier each, routed per PDR-130.
Counts are stated as read at their derivation instants; the underlying sets
are open.

**Review contract.** Purpose: conserve what the arc actually taught and
route its lessons, so the estate learns from the trajectory, not only the
outcome. Questions a review should test: are the reconstructed facts
faithful to their named primary sources; does each causal layer's evidence
support it; do the counterfactuals isolate the variable they claim; does
each proposal's warrant support it and its falsifier genuinely bite?
Evidence standard: every count and claim re-derivable from a named source;
authority boundary: this record AUTHORISES NOTHING — proposals 1–3 are
recommendations for the consolidation pass, and proposal 4 records a
routing disposition reached during this record's own review; enacting
any of them is the owner's or that pass's decision. Non-goals: re-litigating the merged PRs' individual findings;
amending the harness. A successful review either confirms the record's
claims against their sources or names the specific claim, source, and
mismatch — factual corrections land as pre-merge cures while the record is
in review, and as dated addenda after it lands.

## The arc, from primary sources

The "Practice Repos" cloud environment stopped starting fresh sessions from
the first paste of the discovery-based setup script (its birth commit
`a3634ea54`, 2026-08-23 17:12Z, already contained both `set -euo pipefail`
and the fatal pipeline) until a fixed paste built cleanly on 2026-08-24
(owner-confirmed early afternoon) — an outage of roughly a day, ended by six
characters: `|| true`.

Between those ends, one session built a validation harness for the setup
script and drove it through review. The merged OCE branch carries 29 commits
(recomputed: 1 feat, 25 fix, 2 docs, 1 chore(continuity)). The
review-driven segment runs 08:29Z→11:50Z at a near-constant cadence —
twenty-five review-cure commits (twenty-four fix plus the review-driven
09:34Z docs commit) in about three and a half hours; the remaining fix
commit (`8836e4247`, 12:34Z) is the outage cure itself, not a review
round. The twin PRs accumulated 51 review
threads on OCE #12 and 10 on castr #47 (PR-API totals read ~13:00Z). The
owner stopped the loop at ~11:52Z with one question — "are we doing the right
thing?" — after which zero further fidelity cures were pushed: fifteen
then-open threads were dispositioned in a single pass (eight
cured-in-already-pushed-commits, seven declined with recorded bounds), and
the four findings that arrived after the final push each took one decline
reply. The diagnosis endgame ran as three owner pastes: the preflight
(12/12 — every network hypothesis, including the prime-suspect redirect
host, exonerated in one round-trip), the instrumented script (failure card
naming phase, line 57, and pipe status `1 0`), and the fixed script (fresh
build succeeded). castr #47 merged 12:54:40Z; OCE #12 merged 13:03:15Z
(merge `63002eeb3`, +1259/−9 across 9 files). Engraph OCE main was separately
restored to mirror Oak main (`1173c1adf`) the same morning.

## The causal stack

**Technical root.** `find /home /workspace …` exits non-zero when a search
root is missing — the builder image ships no `/workspace` — while still
printing every match; under `set -euo pipefail` the assignment pipeline died
at the discovery line on every fresh container, before any network fetch.
Evidence: reproduced in-session (find exit 1 with both repos printed;
`/workspace` ENOENT), the instrumented card's own attribution, and the fixed
paste building. Fatal from the script's birth commit; no environment change
occurred.

**Process root — two strands, one seat.** (a) *Validation vantage*: the
2026-08-23 script was "validated" by hand-running chunks in a persisted
interactive shell — a vantage that drops the script's own strict mode and
differs from a fresh container in both filesystem and egress. Nothing
required whole-file execution under the script's own modes from the target
vantage before pasting. (b) *Review loop*: the harness built to observe the
outage entered an unbounded fidelity-review generator — bot findings
measuring a bash probe against corepack's internals — and the seat cured
them at cadence for configurations the estate does not have (custom
registries, dual credentials, URL pins, env files: none exist in either
repo). pr-lifecycle's own contract carries the cure — the tally store and
step-back trigger, with the warning stated in its own words: "an unbuilt
tally store means the trigger cannot fire" — and no tally was built at
PR-open, so non-convergence had no observable surface. pr-lifecycle's
worked instances already name two prior no-tally arcs (PR #390, eight
untallied fix-rounds; PR #570, 2026-07-26, ten rounds and twelve cure
commits with nothing counting); this arc is the third.

**Meta root (where the stack stops).** Two distinct generators, one shape:
*a review whose reference surface is unbounded cannot converge by instance
cures.* The 07-20 generator was closure claims against a moving world,
surviving kills by climbing one abstraction level; this arc's generator was
implementation fidelity against a vendor's interior, surviving cures by
descending into ever-finer branches — measured directly: the round-22 cure
drew a finding against itself in round 24, the round-24 cure drew the
parseEnv finding, and the round-25 URL-pin cure drew three findings within
two hours of landing. Beneath both: every cure the estate holds for this
class is passive at the moment of need — retrospective prose, skill clauses,
a worked instance in the proportionality skill — and instrumentation is
opt-in at exactly the moment a fluency-rewarded seat is least likely to opt
in. The next "why" (why fluent cures read as rigour) leaves the estate's
control; the 07-20 record stopped there, and this record adopts its stop.

**A separating observation — the streetlight.** From the broken seat, only
network assumptions were probe-able; the actual cause was observable only
from the builder vantage, which only the owner could reach. The loop
optimised what was probe-able from where it sat. The cure for the whole
outage was one round-trip of owner attention, available from the arc's first
hour.

## The counterfactual test (cured segments of the same arc)

- **Diagnosis.** The three-paste endgame — preflight, instrumented script,
  fixed script — took under an hour of elapsed time and three round-trips of
  owner attention, and produced the exoneration, the root cause, and the
  confirmed fix. The review segment split in two: its EARLY
  instrumentation rounds contributed materially — `9158b990f` (09:13)
  added the per-stage PIPESTATUS attribution the failure card then used
  to name the dying pipeline stage (`1 0`), and the 000-normalisation
  and phase-attribution rounds hardened the same card — while the LATE
  fidelity sub-segment (roughly 10:33→11:50, the corepack-internals
  rounds) contributed nothing to the root cause. The unit-cost
  comparison binds to that late sub-segment: one paste round-trip
  against roughly seven fidelity rounds.
- **Disposition policy (observational).** Same PRs, same reviewer, same
  day: under cure-by-default, each landed cure drew one to three fresh
  findings; under the post-stop disposition policy, fifteen threads
  closed in one pass and each subsequent finding terminated in a single
  decline reply, with no finding-against-a-decline observed before
  merge. This is an observational comparison, not a controlled one: the
  cure phase pushed changed artefacts for re-review while the decline
  phase left the diff unchanged, so reviewer opportunity differed with
  the policy — which is itself part of the mechanism (cures create the
  re-reviewable surface findings feed on), but means the phases do not
  isolate the policy as a single variable.
- **The cross-arc comparator.** The 07-20 retrospective's proposal 1
  graduated as structure — the authoring-time open-set clause on
  `no-moving-targets-in-permanent-docs` — and demonstrably held here: this
  record is written under it, and this PR's own review exercised it. The
  tally requirement, by contrast, remained an opt-in prose contract inside
  pr-lifecycle and went unbuilt for the third time. The 07-20 arc itself
  supplies the complement: where the tally WAS built, its trigger fired
  seven times that day — but only after three to four settled rounds each.
  Built-but-late bounds the cure's best case; unbuilt, it never fires at
  all.

## Honest credit (what the cost bought)

The price was real: roughly two of the three and a half review hours spent
past functional completeness; a ~350-line bash mirror of corepack request
flow now owned as maintenance surface; one cure-introduced defect (dedupe
recorded before probe outcome, caught by the seat's own test); one false
"fixed" claim (round 18, caught by re-review and owned on the thread); and a
day of outage that one paste could have diagnosed at its start.

It bought: a working instrument, proven end-to-end on its first real flight
— the phase-banner card named the dying line exactly, and the preflight
eliminated the entire network hypothesis space in one paste; genuinely
load-bearing early catches (the `000000` http-code fail-open that would have
reported blocked egress as PASS — the instrument's core promise; PIPESTATUS
attribution; gpgv status-line classification; apt's measured fatal-versus-
transient exit semantics); a set of measured vendor behaviours now recorded
in code comments and commit messages; two bounded-decline precedents plus a
recorded disposition policy for fidelity generators; the emptied
fragile-hosts register (all four entries positively confirmed at setup
time); and the outage worked instance in the permanent operating doc.

## Proposals (warrant + falsifier each; PDR-130 lanes)

1. **[FAST — pr-lifecycle triage amendment; proportionality domain-instance
   cite] Unbounded-reference review targets get bounds, not cures.** When a
   reviewer measures an artefact against an unbounded external reference
   (vendor internals, a moving world), the default disposition for findings
   beyond the estate's live configuration is a printed `bound:` line in the
   artefact plus a decline reply carrying a reopen condition; an in-loop
   cure requires the configuration to exist in the estate. *Warrant*: the
   disposition-policy counterfactual above, and the measured
   finding-against-cure chain (r22→r24→r25→12:52). *Falsifier*: a declined
   fidelity finding later causing a real setup failure in the estate's live
   configuration.
2. **[FAST — pr-lifecycle entry amendment, graduating its own opt-in cure
   to an entry contract] The tally is built at PR-open, structurally.**
   Opening or adopting a bot-reviewed PR creates the round-tally artefact
   before the first triage, so the step-back trigger has something to
   read; a PR without a tally is out of contract. *Warrant*: three
   no-tally arcs (PR #390's eight untallied rounds, PR #570's ten, this
   arc's twenty-five review-cure commits) in which the trigger existed and
   nothing counted — against the 07-20 built-tally arc, where it fired
   seven times but only after 3–4 settled rounds each. *Prediction (the
   fast-lane graduation sentence, per PDR-130 lane 1, to live in the
   graduated amendment)*: after this lands, no bot-reviewed PR arc runs
   tally-less; a tally-less arc after landing means the contract is not
   working. *Falsifier*: that prediction failing, or tallies built and
   the step-back still failing to fire — which would locate the gap in
   the trigger, not the instantiation.
3. **[FAST — validation-strategy clause; seeded already in
   cloud-environment.md § Provenance] Strict-mode scripts are validated
   whole-file, under their own modes, from the target vantage.** Chunk-wise
   interactive rehearsal is recorded as non-evidence for a strict-mode
   script. *Warrant*: a line fatal from birth passed hand-validation and
   died on every real run for a day. *Falsifier*: a whole-file strict-mode
   run in the right vantage missing a death class anyway.
4. **[RE-ROUTED FAST during this record's own review — no slow-lane
   row.]** The tally-at-PR-open contract was first registered slow-lane
   here; the review then established the dual-route incoherence: the
   identical change rode proposal 2's FAST lane, and the slow row's only
   passing path required the candidate to land before its own gate —
   pre-enactment outside review, exactly what PDR-130 forbids. The
   mis-lane diagnosis: the contract is an OPERATIONAL tightening of
   pr-lifecycle's existing tally requirement (the skill already states
   "an unbuilt tally store means the trigger cannot fire"), not a change
   to how the estate learns or decides — so PDR-130's proportionality
   guard routes it fast, carrying its prediction sentence in proposal 2
   above, and the provisional register row is withdrawn with this
   reasoning retained. The broader principle this arc exemplifies —
   twice-recurred prose-only failure classes get structural firing
   points at consolidation — is carried as narrative for the
   consolidation pass to weigh, not as a register row: measuring it
   honestly would need an eligible-class census the estate does not
   keep, and registering an unmeasurable prediction is the vacuous-pass
   failure PDR-130 exists to prevent.

Named, not re-proposed: the individual fidelity declines stand as recorded
on the PR threads; the harness-checkpoint observation (the platform
committed deliberately held work under the bot identity) is seed-grade for
the working-with-agentic-ai surface.

## The play harvest (bounded pass over the timeline material; guard applied)

- KEPT — *cadence regularity as a non-convergence smell*: twenty-five
  review-cure commits at a near-constant beat for three and a half hours
  reads,
  in retrospect, like machine breathing — a loop with no inner variance.
  The regularity itself was an observable the missing tally would have
  surfaced. Association, routed to the consolidation pass alongside
  proposal 2.
- KEPT (small) — *compression choosing the wrong representative*: castr's
  squash title adopted the first commit's subject, so main now names the
  whole twin arc "actually bypass metadata on corepack's default path" — a
  tiny wrong label on a large box, the closure mechanism in miniature.
  Napkin-seed grade; rides here.
- DISCARDED (visibly): an attempted association between the one long
  inter-commit gap (11:02→11:19) and the session's compaction event —
  forced; the gap is push-gate latency.

## Success test

Proposal 2 carries this arc's sharpest lesson — the third documented
instance of an existing instrument going unbuilt — and proposal 1 carries
its named mechanism (*fidelity findings against an unbounded reference
descend into finer branches; bounds, not cures, are the exit*). Proposal
4's routing was already decided during this record's own review (the
slow-lane row withdrawn as mis-laned — a decision this record's process
produced). If none of 1–3 graduates, is killed, or changes a decision at
the consolidation pass, this record was a eulogy and should be said so
there.

*Addenda land additively below this line; the record is never rewritten.*

## Addendum 2026-08-24 — proposal 1 composes with the ticket route

Routed here from PR #13's post-boundary review round (the finding was
acknowledged and routed, not cured pre-merge, per the declared round
boundary — itself an application of proposal 1's discipline to this
record's own PR). The refinement: a `bound:` line plus a decline reply
leaves a declined finding with no durable home outside the PR thread,
while pr-lifecycle's standing two-class disposition already gives
adjacent-but-valid findings one — a named ticket or Director route.
Proposal 1 is therefore amended to compose with that route rather than
bypass it: the decline reply carries, alongside its reopen condition, a
pointer to the owning home — a ticket, a thread record, or, where
neither exists, the arc's controlling thread record, which then records
the decline and its reopen condition as continuity. Every declined
finding gets a durable pointer; none survives only in a resolved PR
thread. Applied retroactively to
this arc, the declined corepack-fidelity findings (the r22→r24→r25
chain and the 12:52 decline) are exactly the entries such pointers
would have captured; today they live only in resolved PR threads. The
amendment changes proposal 1's mechanism, not its lane — it remains
FAST, and its falsifier is unchanged.
