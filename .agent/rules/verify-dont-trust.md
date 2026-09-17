# Verify, Do Not Trust

Operationalises
[PDR-011](../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md),
especially its separation of first-hand claim verification from
context-holder-only loss detection at handoff.

When live coordination, routing, validation, or completion depends on a claim,
ask for artefacts and inspect them. Do not treat a peer's status statement,
handoff prose, owner recollection, sub-agent summary, or your own prior note as
verified state until the relevant evidence has been checked.

This rule graduates the 2026-05-24 Knowledge Curator finding captured in the
active napkin and `pending-graduations.md`: "verification asks need artefacts,
not trust confirmations".

## Rule

If a decision changes work ownership, route, completion status, gate state, or
knowledge disposition, verify it against the surface that would make it true.
A claim becomes true only when the proving surface is current and visible, not
merely present in a historical, contaminated, in-flight, or superseded artefact.

Ask for and inspect concrete artefacts such as:

- claim IDs and the current `active-claims.json` entry;
- file paths and current file contents;
- comms event IDs and event bodies;
- transcript IDs or reviewer outputs when a review is the evidence;
- staged diff, git status, commit, or branch evidence;
- command output from the gate that actually covers the requirement;
- source-side enumeration output for completeness claims, such as `rg`,
  import graphs, generated indexes, schema inventories, or source corpus lists.

Generic confirmations like "done", "still true", "looks good", "green",
"landed", or "processed" are routing hints, not proof.

Reviewer output is also evidence to test, not another substrate pointer to
trust. When absorbing reviewer findings, verify the highest-stakes claims
against live artefacts, identify reviewer blind spots, and then decide what to
absorb. Convergence is not a substitute: N reviewers independently surfacing
the same shape can be N agents inventing the same optionality — convergence
raises scrutiny, it never waives it (worked instance 2026-06-27: four
reviewers converged on a "graceful-degradation floor" the owner killed as
invented optionality) — and when your own brief seeded the premise,
reviewers "confirming" it is amplification of your frame, never independent
corroboration. And "first-hand" means the main agent's own read: run
a fan-out for breadth or second opinion, but read the load-bearing sources
yourself and form your own verdicts first — sub-agent reports corroborate or
challenge your reading, never substitute for it, and the first-hand pass is
never deferred to "after the agents finish".

Fix verification must also return to the original defect location. A patch that
adds intended cure text elsewhere but leaves the contradicting source text in
place has not fixed the defect. Re-read the original offending line or section,
not only the new-content area, before declaring the tranche complete.

## Apply This Before

- closing or transferring a claim;
- reporting a plan item, gate, reviewer condition, or curation phase complete;
- moving source material to archive;
- accepting a handoff as current state;
- routing a peer based on a claim about another peer's status;
- absorbing sub-agent or reviewer findings into a durable artefact.
- closing a reviewer, revision, or fix tranche that was meant to remove or
  replace a specific defective statement.
- asserting that all siblings, consumers, imports, labels, sections, statuses,
  or file-set members have been found.

## What To Do Instead

1. Name the specific fact that needs proving.
2. Name the artefact that would prove it.
3. Inspect that artefact directly.
4. Report the verdict with the artefact reference.

For curation work, this means a source is not "processed" because a pass log
says so. It is processed only when the source substance has a visible
disposition: permanent home, pending route, explicit duplicate skip, or named
blocker.

For completeness work, start from the source side rather than the claim side.
A spot check scoped to files named by a claim cannot discover unclaimed
consumers or siblings. Enumerate from the code, graph, schema, or source corpus
first, then compare the claim boundary to that discovered set.

Verification applies to your own verification. A sweep, grep, or audit command
is itself a claim-shaped artefact: before trusting its empty result, audit its
filters — any exclusion (`-v`, glob, path scope, type filter) that could remove
the class under test invalidates the sweep. The same discipline covers your own
summarised verdicts: a conclusion you recorded earlier is a claim to re-test at
the point of action, not a fact to inherit. And it covers your own arithmetic:
recompute any asserted total from its parts before it leaves your output — a
noise-inclusive grep once asserted 318 blocks where the genuine total was 214,
with the per-type census right and only the summary total unrecomputed.

**Self-state is the category where this discipline is most often skipped.** Agents
reliably verify a peer's, a sub-agent's, or a bot's claim first-hand, then accept
a reading of *their own* state — "I'm context-spent", "the host is under load",
"I exhausted the rate-limit budget", "I spotted a gap nobody else saw" — without
the same check. The reason is structural: a self-reading arrives *fluently* (it
feels true from the inside), and fluency is exactly what bypasses the situational
check (`fluency-is-a-failure-vector`). The observable cures are the data already
in hand, not introspection: read the harness/`rate_limit`/Activity-Monitor
figure, not the felt level. Treat any claim whose subject is your own capacity,
budget, or completeness as the *highest*-priority claim to verify against an
external artefact, not the one to wave through.

A gate's *green* is itself a claim, not proof the gate works. A completion gate,
validator, or count can read green while silently failing on the very input it
exists to catch — most dangerously at the moment you cite its green as evidence
that work is done. Before trusting a gate's pass, confirm it can go *red* on a
known-bad input; a gate never observed failing has not been verified, only
assumed. This applies hardest to your own completion gates.

Verification reaches the *meaning* of an inherited frame, not only its
existence. A recorded verdict, a continuity note's diagnosis, or a status
label tells you what a prior mind concluded — it does not tell you the role,
meaning, or current correctness of the thing it describes. For any artefact
authored weeks or more ago — an open PR, plan, or proposal — **supersession is
the first-order question, before internal merits**: check the ADRs/PDRs
ratified since its date, recent merges, and active plans for anything that has
already decided its scope (worked instance 2026-06-23: a four-week-old
proposal earned "merge-but-trim" on its merits when a nine-day-old ADR had
settled the same ground; the true verdict was close-as-overtaken). Before letting
inherited prose define the question you are answering, re-test the verdict
against the live artefact: is this still the right frame, or am I inheriting a
stale diagnosis as my starting premise? Hedged prose in the artefact —
"arguably", "loosely covers", "should be" — is itself the tell that the
writer's classification was uncertain: read the object, not the hedge (a
hedged thread-record link once caused a required brief to go unread because
the hedge was absorbed as the verdict; owner-surfaced 2026-04-21).

An artefact's annotation — a code comment, docstring, schema description,
ontology comment — is evidence of what the thing **is to a consumer**, never of
**why it was added**. Rationale belongs to the decision-maker, and they are
authoritative on their own decision: when an annotation and a decision-maker's
account conflict on *why* something exists, do not resolve the conflict in the
direction convenient to your narrative — mark it owner-held and surface the
question (worked instance 2026-06-23: an ontology field's comment was used to
"correct" a peer report and downgrade a designed identity-join to "emergent";
the owner had added the field specifically to enable the join).

The same discipline covers authorities you are about to cite or copy. Before
writing "this discipline lives in ADR-NNN" into a durable artefact, open the
claimed home and confirm the substance is actually there — citing from a memory
of "where this kind of thing lives" plants a wrong authority that a future
reader follows to nothing (worked failure 2026-06-30: a plan cited ADR-117 for
a discipline that lives in the plan architecture; caught pre-commit). And
before recommending a consistency or "simplify" move on tooling, ground the
**governing** decision (the ADR/PDR that owns the surface), never the sibling
that looks simplest — siblings can themselves be the inconsistency (worked
instance 2026-06-29: "run it via tsx like its siblings" would have violated
ADR-178, which mandates built-`dist` for agent-tools CLIs; the simplest-looking
siblings were the outliers).

The proactive form: before editing *around* an inherited story to repair it,
find the fact that would **falsify** the proposed repair. Locate the fact that
would break your fix before you build it — the diagnostic counterpart to "a
recorded verdict is a claim to test." If you cannot find the falsifying fact,
you have not yet understood the defect well enough to repair it.

A *mutating* sweep needs its set dispositioned before it runs, not only its
filters audited after. Before a broad text-sweep or revert (multi-file
find-replace, bulk revert, a `sed` across a tree), enumerate the planned set and
its per-class disposition when the set spans more than simple live prose —
generated snapshots, immutable records, and peer edits each need explicit
handling. A blanket sweep that treats every class alike corrupts the ones it
should never have touched.

## Verify Landing Containment Against the Current Target

When the question is whether substance reached the current target branch or
survived a merge, update, or rebase, use a probe that answers containment:

- Do not use `git diff A...B` as a current-target containment test. Three-dot
  diff compares one side with the merge base, so content added to the target
  after that base can appear absent. Compare the current target blob directly,
  for example with `git show <target>:<path>`, or use an appropriate two-dot
  content comparison.
- Do not make exact wrapped lines the only presence test. Formatters can reflow
  unchanged substance. Probe for several distinctive short phrases or compare
  the parsed/semantic content, and judge the set rather than one line shape.
- Treat every merge, update, or rebase as invalidating pre-event containment
  evidence. Re-run the probes for each load-bearing surface afterward; a clean
  operation result does not prove that every intended edit survived it.

These checks apply symmetrically: they prevent both false “missing” verdicts
and silent losses being blessed as landed.

Read the failure surface, never the exit code, for any wrapped, piped, or
output-captured invocation. A pipe, redirect, or background-task wrapper reports
the *wrapper's* exit, not the inner command's: a green hook banner with zero
transfer behind a piped `git push`; a SIGPIPE-141 after a passing gate when the
output is redirected; a background-task wrapper reporting exit 0 while both inner
hooks ran red. Inspect the inner command's actual output, not the wrapper's
status. The full behavioural doctrine is the pattern
`wrapped-exit-codes-false-green`.

## Citation or Silence

A load-bearing claim about current state — what is paused, landed, conserved,
authorised, decided, or merely *exists* — may not stand in your output unless
the same sentence carries a source you inspected **this session**: a
`path:line`, command output, an event ID, or the owner's own turn. If you
cannot cite it, you have two honest moves: read the proving surface, or write
the claim tagged `[unverified]` so it cannot pass as fact.

This is structural, not a matter of vigilance. The failure mode is a claim that
arrives *fluently* — smoothly enough to bypass the instant you would have
checked it — and fluency is exactly what an internal "remember to verify"
intention cannot catch. The missing citation can: it is a visible feature of
the sentence, observable to you as you write and to a reader as they read. Gate
on the artefact the fluent claim omits, not on the feeling you hoped to notice.
The smoother and more convenient the claim, the harder the citation is owed.

## Name the Instrument

The sibling of *Citation or Silence* one step over: that section gates a claim
about **current state** on a source you read; this one gates a claim about **how
something works, how big it is, or how bad it is** on the instrument that
measured it.

> Before a claim about a mechanism, a size, or a severity reaches a durable
> surface or a colleague, **name the instrument that proved it.** If the answer
> is "reasoning", it is not proven yet.

Four points, each paid for in this estate:

- **"I ran the command myself" is not the check.** First-hand is about whether
  the evidence supports the claim, not about who ran the command — running it
  makes interpretation *feel* like observation. The full failure shape, its seven
  variants and its two-arm cure are the pattern
  `observation-that-does-not-bear-on-the-claim`; the free arm is *ask whether
  anything you already know contradicts the claim* before hunting for a test.
- **Restore access rather than reasoning around its absence.** When the
  authoritative surface (runtime logs, the code, the vendor doc) is unreadable,
  say so and fix that first. Thirty seconds restoring an instrument beats thirty
  minutes theorising without one — measured, on consecutive days, at one seat:
  logs unreadable produced a thirty-minute wrong theory and a release cut on it;
  every check reachable killed every wrong claim within minutes.
- **This applies to bad news exactly as to good.** Unmeasured estimates skew
  **pessimistic**, because a summary is cheaper than the thing and drops the
  reasons something might be fine — hunk headers instead of a real merge, an
  isolated repro instead of the real invocation, a bulk listing instead of a
  per-item query. A reviewer who raises three false alarms is a reviewer whose
  fourth finding gets discounted.
- **Cost, not correctness, decides whether a check runs.** A check that exists
  but costs "remember at the right moment" is not a mechanism. The design
  consequence — make falsification cheap and make its absence loud — is the
  pattern `falsification-cost-determines-claim-quality`.

The personal form, at the moment of wanting to assert: not *"am I confident?"*
but **"what is the cheapest thing that would prove me wrong, and have I run
it?"**

**The fire-signal is vocabulary.** *Impossible, never, cannot, always, static,
already handled, nothing else, only* — writing one of those words about a
system IS the trigger to stop and run the single cheapest check that would
prove it wrong: a grep, a config read, one API call. The diagnosis behind the
class is not carelessness about checked facts — it is converting "I have not
checked" into a confident claim, because a confident claim reads as finished
work. Three instances in one lane in one day (2026-07-29), two caught by
others: a "structurally impossible" header with an unchecked third
interpolation path; a log line ruled "legitimately static" without opening the
config that ran it in production; a "the bot cannot (403)" owner card whose
cause was three lines of our own token-minting code, falsifiable by one grep.
Verdicts-not-hedges licenses committing to a judgement; it never licenses
skipping the check that would falsify it.

Four sharpenings from one window (2026-08-18 → 19): **a number in evidence
owes its procedure** — a banked "227 of 1287" grep matched no stated
method (136, 126 or 550 under three plausible readings) and was restated
with the method visible; **when the claim is about what a system EMITS,
observe the emission** — a plan's envelope doctrine survived every document
check and died on one live `tools/call` (three envelope shapes, not one);
**a universal negative needs its published enumeration** — "no
registration site carries X" is evidence only when the leg lists the sites
it searched; and **a reviewer is rejected only against the primary source**
— a re-derivation from memory with a wrong region order nearly rejected a
CORRECT finding, and the falsifier for any reject-verdict is the artefact's
own tuple. Ask for probes explicitly in reviewer dispatches: a gateway that
verified its browser assumptions in a live Chromium caught a validator-red
blocker pre-push that reasoning would have approved.

**"Verified real" is not "verified terminal".** The sharper variant (owner,
twice in one session, 2026-07-29): the constraint is genuine and the error is
treating it as final. After confirming a blocker, ask the distinct question
*what would make this not block?* and cost the answer before reporting the
block — a report that names only who else must act is the tell. Its
second-order failure is the expensive one: an accepted false constraint sends
you shopping for ways *around* the wall instead of through it, up to and
including offering to weaken a control (`principles.md` §Architectural
Excellence names presenting the cheap cure as an option as itself the failure
mode). When an instrument refuses you, find out why before designing around
it. And a suppression that must be re-applied after every refactor (a
dismissal, an ignore entry) is a defect report about the code, not the tool —
the repetition is the evidence.

## Claims Crossing Boundaries Carry Their Derivation

The transmitting-side dual of `patterns/referent-narrowing.md` (which governs
reading instruments). Consolidated at the 2026-07-30 dedicated pass from
twelve-plus first-hand instances across four seats in one week (napkin
2026-07-28→30; distilled provenance-at-boundary entry, graduated here).

Internal working beliefs stay cheap. The moment a claim is about to be
**consumed by another context** — a key-turn, a retry, a handoff record, a
verdict, an ACK, an owner card — the crossing pays: re-derive from the source
and name the deriving command/ref/time in the same sentence as the claim.
Three questions gate the transmission, in the order they catch failures:

1. **When did I last read this state?** A stale observation restated in the
   present tense is a new claim (fifteen "dirty" paths broadcast as peer work
   were landed content; a "pushed" ACK composed before its ls-remote line was
   read).
2. **Whose sentence is this?** When relaying an owner ruling, quote it and
   stop; implications go in a separate paragraph attributed to the relayer by
   name — a derived inference inside a quoted paragraph inherits the owner's
   authority on the way past, and a reader cannot tell where the owner stopped
   speaking.
3. **Did anyone read this state, ever?** An inference about an unprobed
   surface is a hypothesis wearing a fact's clothes; it carries no staleness
   signal and no borrowed authority to spot.

Carriage extends beyond the source pointer: state the claim's **scope** (a
measurement's population), its **frame** (the domain an absolute holds over),
and its **verification rung** (recorded prior → published docs → authoritative
surface → live enactment; each rung falsifies below itself and nothing above).
Tag inherited links honestly: if any load-bearing datum in a mechanism claim
was inherited rather than first-hand, ship the claim as a **question to
whoever owns that surface**, never as a finding. Attribution is also the
containment when verification fails — a finding recorded under its true
observer's name has a one-comment blast radius; one absorbed as your own
becomes a premise others act on.

**Verify at the rung that binds.** Descriptions are claims, not evidence:
an endpoint's description string, a README, a plan sentence, a view named
in a schema doc, a review bot's summary table — each sits BELOW the surface
that binds (the response schema and handler code, the contract file, the
deployed migration, the review threads themselves). One lane paid four
times in one day (2026-08-31): an "unpublished" verdict generalised from
the bulk schema to the whole API; a cure sourced from an endpoint's
description while its schema returned two fields; a view cited as
"materialised for the API" that the estate's own research had recorded as
undeployed; a bot's "Completed" summary read as "no findings" over fifteen
unharvested review threads. Sibling instances the same week: four false
plan rows written from a README instead of the mapper source; a merge gate
asserted from doctrine prose while the live ruleset's NAME carried the
fact. Three corollaries: an absence proven on ONE surface licenses a claim
about that surface only (sweep the endpoint inventory before writing "the
API does not serve X"); before citing an estate artefact by name, search
the estate's own research corpus for it (deployment status lives there);
and a shared dirty checkout is a working surface, never a state authority
— classify "already done" from the file at the branch base (2026-09-01).

The **change-at-a-distance** facet: the world can move underneath a standing
artefact with no claim transmitted at all (a dependency override changing
resolution truth; a vendor re-imposing a cancelled requirement; an edge config
changing header truth). The working cure, twice-evidenced in one morning, is
the residual ticket minted **at the change moment by whoever saw the domain
move** — structure over vigilance; a record referencing a moved domain has no
staleness signal of its own.

Falsifiers, carried from the source captures: a provenance-carrying claim that
still misleads breaks carriage and moves the cure receiver-side; a fresh seat
paying a new miss on a genuinely new surface after this section lands means
passive capture failed and a mechanical gate is warranted (route via PDR-098).

## Run Gates, Pushes, and Probes BARE — the Exit Code Is the Verdict

`gate | tail` / `| head` / `| grep` returns the LAST pipe stage's exit, so a
red gate reads green and every narration downstream inherits the lie. The
class does not yield to vigilance: after this section first landed
(2026-07-02, three instances in one day), six-plus further instances hit four
different seats in three days (2026-07-06→08) — `eslint | tail` twice, a
plan-state refusal read green through `| head`, `check-commit | tail`,
`git push | tail`, `comms | grep -c`. The discipline is categorical:

- Run every gate, push, and verification probe BARE, and read `$?` off the
  bare command itself (or `PIPESTATUS[0]` / `set -o pipefail` when a pipe is
  genuinely required; or append the code INSIDE the artefact:
  `; echo "EXIT: $?" >> log`).
- A success echo chained after a pipe (`… | tail && echo OK`) is unproven —
  the echo keys off the tail's exit, never the gate's.
- The **trailing-echo variant**: `cmd; echo "exit=$?"` makes the harness task
  notification read exit 0 (the echo's) while `cmd` failed — when a status
  echo trails the command, read the PRINTED value, never the notification's
  exit.
- zsh does not word-split unquoted variables: a captured `$ARGS` expands as
  ONE argv word, the tool fails as invalid usage, and a quiet pipe masks the
  failure — pass literal args or `${=VAR}`, and never trust a captured
  variable through a quiet pipe.

Any broadcast asserting a remote-state change (pushed / merged / deployed)
quotes POST-action ground truth (`git status -sb`, `gh pr view`) captured
after an unmasked exit — assert-from-evidence, never from intent. And a
relayed claim must never ride inside a sentence labelled "verified
first-hand": the verified label covers only what the check could see.
Recurrence-despite-home is the live signal on this class (PDR-098) — the
class carries a literal surface signature, so it is a candidate for the
PDR-044 innate hook layer.

## Briefing Facts Carry Their Epistemic Status

A briefing fact's confidence drops at the author's lane boundary: the facts
you verified are the ones your own cycles exercised; everything beyond is
"inferred" until re-grounded. Tag every fact in a seam handoff or reviewer
brief `verified-live / from-fixtures / inferred` — a consumer builds on
exactly the facts you mark trustworthy. Worked instance (2026-07-02): an
8-fact seam briefing labelled "all first-hand" carried two inferred items —
the load-bearing two — one hiding a live `dangerouslySetInnerHTML` injection
surface. The consumer side of the same discipline: a load-bearing, cheap-to-
check briefing fact gets verified first-hand BEFORE building on it, not at
verification time (a 10-second `curl` beats a parser built on a relayed
vocabulary).

## Probe the Deployment Before Planning About It

Artefact grounding (docs, ADRs, code, plan shape) and artefact-shaped review
compose into a **collective blind spot**: everything cross-checks
consistently against everything except the running system. Before authoring
OR adjudicating any plan about a deployed surface, probe the deployment
first-hand — metadata endpoints, challenge shape, health endpoints, env
reality — and put the probe output in the plan's evidence base. A
"sound" adjudication verdict on a deployed-surface plan requires the probe
too, not just shape-reading. Worked instance (2026-07-21, MCP-67): a
promotion plan and its owner card asked domain/staging questions the live
alpha deployment already answered — thirty seconds of curl would have
reframed the plan from greenfield ceremony to an upstream realm swap, and
two expert reviewer rounds plus a Director post-landing read all shared the
blind spot, because every one of them verified artefacts. Owner cards
authored from artefact-only grounding waste the owner's attention on
questions the running system answers.

## Calibrate Verification to Stakes

This rule prescribes *calibrated* verification, not maximal distrust. The
default posture is **trust and verify**: accept the stated or likely state,
then run ONE light, targeted check of the load-bearing fact — not an
exhaustive re-derivation of everything in sight. Over-verification is not free
safety; it is a real cost (friction, rework, held progress) that must be
justified by stakes. Reserve exhaustive distrust and first-hand re-derivation
for genuinely novel, irreversible, or high-risk moves. The craft is choosing
the *right* single check: cheap and load-bearing (a `git fetch` before
asserting remote state — `@{u}` is only truth-bearing after a fetch) beats
both stale-cache trust and elaborate theory-building on an unverified premise
(worked instance 2026-06-14, owner-corrected: an unfetched `@{u}` read as
"push blocked" grew a multi-layer push-blocker edifice; the branch was fully
in sync and one fetch would have shown it).

## Anti-Patterns

- Asking "are you done?" when the answer needs a claim, diff, event, or gate.
- Accepting silence after a broad status question as evidence.
- Treating a handoff record as live state without checking current claims,
  comms, and git.
- Trusting a sub-agent's cited source without opening the source.
- Verifying a compound claim's headline while its elements go unchecked — a
  homes-authored note once claimed "pattern file + testing-strategy cross-ref"
  where the pattern was real and the cross-ref absent; a reviewer-praised
  TSDoc claim carried a real code defect dressed as doc drift. Verify each
  element of a compound claim, never the headline.
- Repeating a peer's closeout or relay claim into a durable artefact without
  checking the tree — a "handoff records ride the PR" relay was wrong twice
  over (the records are gitignored by design); verify-dont-trust applies to
  PEER closeout broadcasts exactly as to reviewer claims: check the tree, not
  the relay.
- Calling an archive move a completed curation pass without disposition
  evidence for the archived substance.
- Checking only the intended cure location while the original defect location
  still carries contradictory text.
- Treating a label as live because the token appears in a changelog,
  historical note, superseded plan, or contaminated in-flight artefact.
- Checking only files named by a claim when the assertion is about all
  consumers, siblings, or members of a source set.
- Declaring a sweep clean while the sweep command carried an exclusion filter
  that removed the very class it was meant to inspect.
- Concluding "X does not exist / is untested / is missing" from a subtree
  search. A negative existence claim earns the same whole-package search as a
  positive assertion — a subtree scope is exactly the path-scope exclusion above,
  and a convention the subtree omits (e.g. tests living in a `tests/` tree, not
  colocated in `src/`) is precisely what it misses. The tell is fluency that
  flatters: "I spotted a gap" arrives smoothly because it flatters a gap-spotter
  self-image, and that smoothness is what bypasses the whole-package check.
- Citing a scoped gate run as a full-scope verdict — narrow scopes also
  propagate agent-to-agent; see
  [`validate-full-target-estate`](validate-full-target-estate.md) for the
  full discipline.
- Reading a commit's success or failure from the streamed terminal display
  rather than from `git log -1` / `git status`.
- Asserting a whole-file property (size, line count, "all captured") from a
  windowed (offset+limit) read — run the cheap probe (`wc -l`, the fitness
  report) before any whole-file claim.
- Running a generator / codegen / build script to *diagnose* without reading it
  first — a `clean` / `rm -rf` prelude on a command that may crash deletes
  tracked artefacts (a diagnostic `sdk-codegen` once deleted ~100 tracked files
  this way).
- A proof loop whose probe consumes its own input as options — `grep -Fq "$line"`
  ate every `-`-prefixed needle as a flag, so 13 of 132 lines were never tested
  while the loop reported a clean zero-duplicates result (2026-08-06). Use
  `grep -Fq -- "$needle"` whenever the needle is untrusted text; a proof can
  read green having tested nothing.
- `git rev-parse` without `--verify` echoes the ref NAME on a missing ref — two
  false verdicts in one day (a "fabricated" verdict against a correct reviewer
  claim; branch-existence checks reading as DIVERGES). `git rev-parse --verify
  --quiet` or nothing (2026-08-05).
- A "matched nothing" identity verdict scoped to the surfaces searched — a
  post-compaction seat declared its own pre-compaction subagent an unregistered
  peer because the search covered claims/comms only, where subagents correctly
  never register (2026-08-06). An identity search's negative is only as wide as
  its surface set; post-compaction, add the session's own spawn history before
  declaring a peer unknown.

## Timestamp-Zone Discipline

Owner-directed, standing (2026-06-29) — all agents, all analysis. A timestamp is a
load-bearing fact; an unlabelled or mis-zoned one is a verification failure.

- **UTC (`Z`) is the canonical analysis clock.** Host / `pmset` / system logs / the
  Monitor wall-clock are in the **host's local zone — determine it (`date +%z`), never
  assume a fixed offset** (it varies by host and by DST). Convert every local source to
  UTC using that actual offset and **show** the conversion (e.g. on a `+0100` host,
  `01:06 +0100 = 00:06Z`).
- **Never compare a `…Z` time against a local-offset time** — the 2026-06-25 false
  58-minute coordinator-less gap came from reading `07:52Z` against an `~08:50` local
  clock on a `+0100` (BST) host, where `07:52Z` *is* `08:52` local.
- **Label every timestamp's zone.** An unlabelled timestamp is a bug.
- **Never infer a timeline from a truncated log view** (`tail` / `head` / capped grep) —
  query the full window first (a `tail`-truncated `pmset` read once reported `00:51Z`
  when the full log gave `00:06Z`).

Composes with the `director-handoff.md` liveness rule (let the tool compute age
UTC-to-UTC; never a local clock).

## Composition

- [`respect-active-agent-claims`](respect-active-agent-claims.md) — claims are
  a live ownership surface; read them before acting on scope.
- [`use-agent-comms-log`](use-agent-comms-log.md) — comms events are evidence
  surfaces, not just notifications.
- [`present-verdicts-not-menus`](present-verdicts-not-menus.md) — once the
  artefacts prove a verdict, present it instead of asking the owner to choose.
- [`knowledge-preservation-over-fitness-warnings`](knowledge-preservation-over-fitness-warnings.md)
  — process source substance before archive moves, even under fitness pressure.

## Worked Instances

- 2026-05-23 Scorched Director window: "don't trust, verify" was named as a
  deeper Director primitive after repeated trust-propagation failures on peer
  and routing state.
- 2026-05-24 Lanternlit plan refinement: reviewer-pass plus critical analysis
  caught trusted-but-unverified throughput and claim-state assertions.
- 2026-05-24 Knowledge Curator continuation: Shaded's read-only review caught
  a scoping defect in the archive-after-processing rule patch; the finding was
  verified against the rule's Scope section before absorption.
- 2026-05-24 PDR-066 revision: a blocker fix added new cure text while leaving
  the original contradicting statement in place; the durable check is to inspect
  the original defect location before calling the revision complete.
- 2026-06-02 JC4 thread-progressions repair: claim-scoped spot checks missed a
  consumer outside the named set; the durable check is source-side enumeration
  before accepting completeness.
- 2026-06-02 EEF D4 sibling-frontmatter repair: a stale label was present in
  history and contaminated artefacts but not live truth; assertion-time checks
  needed to test whether the cited label was current and visible.
- 2026-05-30 readiness review + 2026-06-09 factory-importer refutation: two
  sweeps reported clean because the command's own exclusion filter (`-v
  .test.ts` in the second instance) removed the class under test; the durable
  check is to audit the sweep's filters before trusting its empty result.
- 2026-06-15 Cursor commit-output truncation: the Cursor agent shell returned
  exit 1 and truncated `git commit` hook output (stopping before the build gate)
  while the commit actually landed; the durable check is to confirm a commit's
  outcome from authoritative git state (`git log -1`, `git status`), never from
  the streamed terminal display — the display was never the source of truth,
  independent of any one platform's truncation behaviour.
- 2026-06-16 long-gate status drift: a long aggregate gate run (`pnpm check`,
  full test/build sweeps) can mutate the working tree (codegen, format, doc-gen);
  claiming "tree clean" or writing handoff state from a pre-gate `git status` is a
  stale-claim failure. The durable check is to rerun `git status --short` *after*
  any long gate, before asserting clean or recording closeout state.
- 2026-06-16 no-commit owner-visibility: a successful file write is proof to the
  writing agent, not to the owner, when the file stays untracked and uncommitted.
  In no-commit sessions a "created X" report carries the path **plus current
  `git status` evidence**. Sibling: after a `git mv` followed by a later
  `Write`-edit of the renamed file, verify the *staged content* (`git show :<path>`),
  not just the rename — a 100%-similarity (`R100`) score is the tripwire that the
  staged blob is the pre-edit original and the real change is unstaged.
- 2026-06-22 F-84 decision-debt false-green: the pending-graduations decision-debt
  count read a healthy 0 while two live items existed (the item-count parser stripped
  the fenced blocks the live entries used), and that green 0 was cited as
  consolidation-completion evidence. Only a first-hand loss-scan caught it — no
  gate-green ever could. The durable check is to prove a completion gate fails on a
  known-bad input before trusting its green, especially your own.
- 2026-06-23 MCPJam host-header: an enforced check may not live in the
  obviously-named middleware (authed `/mcp` Host validation is in the auth layer
  `getPRMUrl`, not `dnsRebindingProtection`, which is landing-page-only), so
  tracing only the named middleware wrongly concluded `/mcp` was unguarded; and a
  black-box re-run false-passes when an unrelated layer short-circuits (auth 401s
  the probe regardless of Host). Trace every layer to the decisive source, and
  verify a sub-agent's *correction of your own finding* first-hand too.
- Status surfaces are pointers, not facts: thread records, frictions registers,
  plan statuses, and register markers each describe state without being it. A
  frictions register stamped "addressed-in-working-tree" with a never-completed
  "replace with SHA" trigger reads "fixed" for work that may never have
  committed. Before acting on any status, recompute against the current
  code / data / state, not the marker.
- 2026-06-29 `gh` rate-limit signature: a `403` then `401` on a `gh` GraphQL
  call was confabulated as "I exhausted the shared 5,000/hr budget" — primed by
  the harness reminder's "5,000 shared" framing — when the `rate_limit` evidence
  in hand showed the *unauthenticated* signature (`core.limit 60` /
  `graphql.limit 0`, authenticated budget ~94% free minutes later): a transient
  token blip, ~6% used. The durable check is to read the signature in the data
  you already hold and isolate the layer (auth vs volume) before adopting a
  primed frame; on a `401`/unauthenticated signature check `gh auth status` and
  retry, never assume volume. (Tooling cure lives at frictions F-110.)
- 2026-07-30 vendor-capability arity: when a review finding's premise is a
  claim about platform or vendor capability, fetch the vendor documentation
  first-hand at time of use before classifying — and check the capability's
  ARITY, not just its existence: two individually-true vendor facts composed
  can yield a false third claim (the capability exists AND the surface exists
  does not mean the capability applies to that surface N times, in that
  direction, or at that layer).
- 2026-07-2x "stands unchanged" claims cite their survey: any conformance
  claim of the form "X stands unchanged" / "no impact on Y" must cite the
  verification that established it (which files were surveyed, by what
  method, when) — an uncited stands-claim is a status marker, and this
  rule's first bullet already says what a status marker is worth. (A
  recurring doctrine candidate parked three times in machine-local records
  before landing here.)
- 2026-07-3x engaged-path before mechanism: A GREP HIT IS NOT A CONSUMER —
  a reviewer-adopted claim about a value's consumer was falsified by
  re-reading the found site (the match existed; nothing consumed it), and
  two expert rounds mis-read PostHog retry arithmetic until
  `resolveCaptureMode()` settled WHICH code path was actually engaged.
  Before reasoning about a mechanism's behaviour, settle the engaged path
  and the actual consumer first-hand; a text match proves presence, never
  participation.
- 2026-07-2x captures go stale against live surfaces: a captured artefact (a
  saved page, a screenshotted portal, a studio HTML export) is a DATED
  record, not the surface — a design capture showed Resources 6 / Tools 42
  against a live serve of 5 and a different count, and a submission portal's
  LIVE form outranked docs pages and prior captures (the portal had gained a
  Team/Enterprise-plan requirement no doc mentioned). For any third-party
  requirement or served-surface fact, read the live source at time of use;
  cite captures as "as of <date>".
