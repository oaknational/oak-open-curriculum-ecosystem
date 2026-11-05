---
id: pr-tally
node_type: delivery
name: "pr-tally — the review-round tally built by commit binding, with the step-back verdict"
overview: "An agent-tools command that builds the pr-lifecycle review-round tally from a pull request's review threads and review bodies by the commit each review binds to, prints one row per settled round with raised and cure-worthy counts, and prints the mechanical step-back verdict; paired with a pre-push cross-surface read step in the lane-cut skill as its practice half."
status: ratified
ratified_by: Jim Cresswell (owner)
ratified_date: 2026-09-08
ratified_where: "Ratified in advance of authoring by the owner's direct word of 2026-09-08 (11:5xZ, via the Director), verbatim: \"pr-tally, ratified\"; the text was authored after the word and read first-hand by the Director on the landing pull request, whose body quotes the word; the owner's own read of the text is that pull request"
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-10-27
---

# pr-tally — the review-round tally built by commit binding, with the step-back verdict

## Goal

A seat shepherding a pull request reads its review-round tally from one command instead
of building it by hand, and the step-back trigger the pr-lifecycle skill defines fires
from a printed verdict rather than from a seat's memory of it. Every tally the estate has
needed was built late or not at all: eight rounds on one PR ran unnoticed as
non-convergence in July because nothing counted; an eight-round tail on 2026-09-08 fired its
step-back at round four with nobody watching, and the owner invoked four skills by hand to
stop it — the out-of-band correction PDR-140 clause 8 names as a defect against the
skill.

## User groups and value

- **The shepherding seat**: one command at every settle, the tally row and the verdict in
  one read; the class-fix moment arrives as a printed line, not a realisation.
- **The Director**: the same read across every open PR at a glance, so a routing decision
  rests on counted rounds.
- **The owner**: the review-loop discipline the estate wrote becomes an instrument that runs,
  which is what the owner's 2026-08-31 and 2026-09-08 corrections asked for.
- **Any organisation running this tree**: the command derives the repository from the
  checkout and names none (ADR-231).

## Mechanism

- **The reads**: the GraphQL review-thread harvest the pr-lifecycle skill's Phase 3 specifies
  — each thread's first comment carries its originating review's commit binding — the paged
  reviews connection with each review's commit and body, AND the paged issue-comment
  connection, because a finding that exists only in a review body has its disposition
  recorded as an ordinary PR comment (PDR-140) and the seat's settle marks live there too;
  all three paginated to exhaustion — and, as the fourth read, the EXPECTED reviewer set
  as the PR's own Phase 1 declaration: the tally-at-open comment names it, the command
  writes that comment at open from the repository's live automatic-review configuration
  (the ruleset and review-app configuration that fires bot reviews on push), and every
  later round reads the declaration, never the live configuration, so a reviewer enabled
  or removed mid-PR changes no historical row; it is an input to the state machine, never
  inferred from the three harvested surfaces, which are empty on a first tip before any
  bot has posted and cannot tell "no reviewer expected" from "configured reviewer still
  OWED". The repository is named explicitly on every call (the downstream-checkout rule).
- **Findings from bodies**: a review body becomes findings only through the reviewer's own
  structured markers — one item per badge-and-heading block for Codex, and one item per
  finding inside Copilot's suppressed-comments block (one block carries several distinct
  findings — this repository's rounds record four, six and ten in one body — so the block
  is parsed and each finding counted, never the block as one item); body prose without
  markers is never counted and is surfaced as "manual tally required", the boundary the
  existing pr-watch settlement code already draws.
- **The tally**: one row per SETTLED round, in commit order on the branch, never arrival
  order. A head's round is settled when every expected
  reviewer leg reads SATISFIED or SKIPPED for the head under the skill's reviewer-leg
  states — SATISFIED by a review bound to the head, SKIPPED by a tip-scoped skip marker or
  by the checks-green timeout, OWED otherwise — and no newer review arrived within the
  quiet window (anchored on the checks-green window when every leg settled via SKIPPED —
  the command harvests each head's check-run completion times and the next push time, so
  a timeout settlement on a superseded head is recomputed from persisted history, never
  guessed); a round settled through a SKIPPED leg is a row like any other, so a timed-out
  reviewer never suppresses a row or delays the four-round arm; a head superseded before
  either is listed as unsettled and never counted toward the step-back. The invariant:
  every row rests on a recomputed proof — the reviewer-leg predicate over the harvested
  reviews, or a recomputable timeout — and a head with neither is unsettled; the seat's
  signed settle mark (the tally comment naming the head, or a reply naming the round
  settled) is persisted evidence the command records and cross-checks against that
  recomputation, never a settlement by itself, and the only supersession of the predicate
  is an owner settled-word or an owner-executed merge (pr-lifecycle §review-round item 4).
  The raised count is every finding in threads and marked body items bound to
  that head, one logical finding counted once, matched on anchor AND substance (a body item
  restating an inline thread of the same review at the same anchor with the same substance
  is one finding; two distinct defects at one anchor are two); the cure-worthy count is
  read from the disposition state the seat records — a reply or comment signed by the
  seat's identity tuple carries a machine-readable bar marker (over-bar or below-bar, the
  PDR-140 prong met) and a disposition (a cure commit, a named home, or a rejection with its
  rationale); the count reads
  the bar marker, never the disposition type, because a below-bar finding and a
  build-changing one can both be routed to a home — and the seat's own signed replies and
  comments are excluded from the raised count AND from the newer-review test that anchors
  the quiet window (under the shared credential a disposition reply registers as a review
  on the head; the canonical state machine excludes signed self-replies from anchoring, so
  a reply landing before the next push never unsettles the head). The invariant: the
  command derives no count from prose; every count reads a recorded field, and a finding
  without the marker is surfaced as "manual tally required" like an unmarked body. The
  marker is in the intake contract (pr-lifecycle §Response pricing, the disposition format),
  so that ordinary rounds produce counts, not "manual" verdicts.
- **The verdict**: the exact predicate from the skill — `c[n] >= c[n-1] AND c[n-1] >= c[n-2]`
  across three settled cure-worthy counts, or four settled rounds in the epoch, either arm
  firing only while the latest settled count is non-zero; the epoch resets at a push the seat
  marks as the class fix; the terminal-success state (a settled round at cure-worthy zero)
  takes precedence.
- **The command**: `pnpm agent-tools pr-tally --pr <n>` prints the table and the verdict as
  text and, with `--json`, as a document the merge-bot front door can consume later (the
  named PDR-140 follow-up: pass disposition state into the merge verdict).
- **The practice half**: a pre-push step in the lane-cut skill — before any push that changes
  a vocabulary, an order or a bound, read every surface that carries it and cure them in the
  same push — the step whose absence cost #82 eight rounds.

## Acceptance criteria (each with a proof)

1. Given recorded harvest fixtures for a PR with reviews bound to three commits, the command
   prints three rows whose raised and cure-worthy counts match the fixtures, in commit order,
   with the seat's signed replies excluded and a body finding that restates an inline thread
   counted once. Proof: `repo-safe` — unit tests over the tally builder with recorded
   fixtures, no IO.
2. The verdict fires on the fixtures that meet either arm and not on the fixtures that meet
   neither, including the terminal-success precedence and the epoch reset. Proof:
   `repo-safe` — unit tests over the verdict function.
3. Against a live PR of this repository, the command's rows equal the tally the shepherd
   recorded on that PR's working-notes comment. Proof: `repo-safe` — one standalone
   validation script under agent-tools, run by hand or by a credentialled CI job against a
   closed PR named in the script, never by the test suite (tests never do IO; the testing
   strategy files external-resource checks as validation scripts).
4. The lane-cut skill carries the pre-push cross-surface read step and its projections are
   regenerated. Proof: `repo-safe` — the skill's projection check and the markdown-links
   validator on the landing PR.
5. The fixtures cover a head superseded mid-review (no row), a body-only finding with its
   PR-comment disposition, two distinct findings at one anchor (two), a body without
   markers (surfaced as manual, not counted), a suppressed Copilot block carrying several
   findings (each counted), a round settled by a SKIPPED leg through a tip-scoped marker
   and one through the checks-green timeout (both rows present), and a first tip with a
   configured reviewer still OWED (no settled row, never terminal success), a reviewer
   enabled after open (historical rows unchanged), a timeout-settled round on a superseded
   head (row present, recomputed from harvested history), a signed disposition without a
   bar marker (surfaced as manual, not counted), and a seat's signed disposition reply
   landing after the bot review and before the next push (the head's row present, the
   window unmoved); the rows and the verdict match.
   The mechanism above states the invariants; a case these rounds did not name is a
   fixture the implementer adds at pickup, never a mechanism edit. Proof: `repo-safe` —
   unit tests over the tally builder and the classifier, no IO.

## Todos

1. **The tally builder and the verdict, with fixtures** — criteria 1 and 2; one PR, default
   round budget. Landed 2026-09-12: `agent-tools/src/pr-tally/` — `harvest.ts` (the recorded
   boundary), `markers.ts` (the closed marker grammar), `findings.ts` (body items by the
   reviewer's markers), `dispositions.ts` (the seat's signed body-only disposition lines),
   `settlement.ts` (which reviews settle a head), `rows.ts` (rows per settled head in branch
   order) and `verdict.ts` (the predicate with epochs), each with its unit tests and the
   integration suites over the recorded corpora; the conforming
   fixtures #136 and #138 recorded with the widened query. Not yet read from a recording: check-run
   history, so SKIPPED and timeout settlement (criterion 5's skip and timeout cases) wait for the
   command (todo 2) to harvest it; the ledger's signature question is answered by not widening the
   predicate — the #135 corpus reads as undispositioned, truthfully.
2. **The command and the validation script** — criterion 3 and the `--json` shape; one PR.
3. **The practice half** — the skill step (criterion 4) and the disposition format: the bar
   marker and the disposition named in the pr-lifecycle intake contract (PDR-140's
   disposition shape) and its projections, with an end-to-end fixture produced by that
   workflow and consumed by criterion 5; one small records PR, landed before or with todo 1
   so that the first live round reads counts rather than "manual tally required". Partly landed
   2026-09-12: the format in `pr-lifecycle` §Response pricing and its projections; the skill
   step landed earlier in SHA:ccdbc5613; the fixture recorded so far,
   `agent-tools/tests/pr-tally/fixtures/pr-135-harvest.json`, predates the format and reads as
   undispositioned. Landed 2026-09-12 with todo 1: the conforming end-to-end fixtures, recorded
   from #136 and #138 after they merged (the widened query), read by the corpus suite.

Each PR opens with the pr-lifecycle instruments declared at open: the round tally (from this
command once it lands), and the PDR-140 intake contract where the changeset carries prose.

### Candidate recorded ahead of pickup (not a todo)

2026-09-10, from #116, the argument-aware Bash-guard matcher; a mechanism question for todo
3 at pickup, not a mechanism edit on this ratified node: a parser-class pull request
declares its PROMISE at intake (for the guard, PDR-044 accident prevention, not bypass
resistance) and each round's row carries an inside/outside-promise column, so a review tail
on a parser is bounded by the declared promise rather than by the reviewer's imagination —
findings outside the promise are recorded with one named home, never cured. The instance:
Copilot raised 19 findings over four rounds (17 inside, 1 outside, 1 false premise); the
adversarial subagent leg raised 4 inside and 6 outside in one pass. Falsifier: the next
declaring parser PR still draws outside-promise cures after the column lands.

## Out of scope

- Changing the predicate or the tally semantics: those are the pr-lifecycle skill's and
  PDR-140's; this node builds the instrument that runs them. The one intake-contract change
  this node makes is the disposition format in todo 3, which adds a recorded field and
  changes no semantics.
- Consuming disposition state in the merge-bot verdict: the named PDR-140 follow-up, served
  by this command's `--json` output and landed on its own node.
- Reading review state from `latestReviews`: the skill forbids it for the tally (rows vanish
  when a reviewer posts again); the harvest reads threads and the paged reviews connection.

## Review dispositions

One row per finding; "pickup" means read and applied by the implementer at pickup, the node's
mechanism unchanged.

| Date | Source | Finding | Disposition |
| --- | --- | --- | --- |
| 2026-09-12 | PR #135 round three | A slice proposed in the thread record carried only `raised` per row, where this node's predicate reads the cure-worthy count from the bar marker — a round of below-bar findings must be terminal zero even with `raised > 0` | Pickup: todo 3 (the marker) lands first per this node's own sequencing; todo 1's row carries the cure-worthy count |
| 2026-09-12 | PR #135 round three | The same slice ordered rows by first appearance, which is review-arrival order; this node requires branch commit order, since a late review of an older head would reverse `c[n]` | Pickup: `buildRows` takes an authoritative head-order input and sorts bindings against it |
| 2026-09-12 | PR #138 round three | The recorded corpus's seventeen seat replies end with a role suffix (", Director") that the ratified self-reply predicate (`reviewer-legs.ts` `SIGNATURE_SUFFIX`: the final line ends with the six-hex prefix or its `-hex3` token form) rejects, so none reads as signed under the current code | Pickup: todo 1 decides by dated amendment whether the predicate accepts a trailing role suffix, or treats this corpus's replies as unsigned; the fixture is a recording and is not edited |
| 2026-09-12 | PR #138 epoch two | An outdated inline thread returns `line: null` (eleven of the seventeen in the #135 recording), so a harvest reading `line` alone loses the anchor the anchor-and-substance deduplication needs | Pickup: todo 1's harvest reads `originalLine` and `originalStartLine` alongside `line`, and re-records the corpus with the widened query at pickup |
| 2026-09-16 | The Director's 2026-09-12 boundary-9 record, carried to the dedicated consolidation | Hand-writing each suppressed-item disposition reference produced a wrong review id, a `thread <id>` key taken from the wrong review, and four rounds in which undispositioned body items stayed open | Pickup: todo 2's command prints, for every undispositioned body item, the one-line disposition template with the head, review id, anchor and item key filled in; the seat only chooses the marker and writes the rationale |
| 2026-09-17 | PR #152 round two (Copilot, suppressed) | Under the peer-fork model a true finding on carried code is over the bar for this fork but cured in its own lane, never in the carrier's rounds. The tally reads the bar marker only (the scope prefix is not read), so such a finding counts as cure-worthy in the carrier round that raised it, and a carrier that keeps drawing carried-code findings cannot reach the terminal zero it has no means to cure towards. | Pickup: todo 1 decides whether a carrier's tally keeps carried-code findings out of `c[n]` (for example by reading `Out of scope,` on an over-bar marker as routed-elsewhere) and names where their count lives (the local work list), with a recorded carrier harvest as the fixture |
| 2026-10-27 | The code-quality analyser's security and reliability triage | Two of this node's body parsers read text any GitHub user can write and backtrack super-linearly: the disposition-line pattern in `dispositions.ts` (roughly cubic) and the Codex-item pattern in `findings.ts` (quadratic, and live on every push through the review-cost gate). And `isSignedSelfReply` checks a comment's signature line but not its author, so any commenter's signed comment reads as the seat's disposition. | The parsers are cured by `quality-analyser-security-reliability-to-zero` unit 1 (both made linear, with adversarial-input tests), before this node's todo 2. The author check is this node's own work, routed here at that plan's recheck (2026-10-27) because no analyser finding names it: a self-login set (the run's authenticated GitHub login, read through pr-watch's `gh` runner as a `Result` that refuses the run when unreadable, plus the merge bot's app slug when the per-checkout merge-bot config resolves) checked against each signed comment's author in pr-watch and here. GraphQL harvests record a bot without its `[bot]` suffix (the recorded corpus carries the merge bot's login that way, verified in `pr-138-harvest.json`), so the comparison strips a trailing `[bot]` and lowercases both sides; the recorded corpora are unchanged. It lands before todo 2, so the command reads author-bound signatures from its first run. |
