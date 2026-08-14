# Fleet topologies in the Oak estate: what we have tried, what it taught us, and what to try next

**Date**: 2026-08-05. **Audience**: the owner. **Status**: report, not doctrine — nothing here decides anything.

This answers a direct ask: what arrangements of agents have we actually run, what worked, what
did not, what have we learned, what should we try next, and how do we stop having to rediscover
all of it. Every claim below is anchored to a file and a section or line. Where the evidence is
thin or contested, the report says so rather than rounding it up.

**Success criterion**: the report gives a later owner or fleet designer a source-traceable census
whose aggregate counts reconcile to the raw probe corpus, reports material gaps and disagreements,
and keeps historical observations distinct from proposals. It succeeds as a retrieval and decision
input; it does not succeed by turning the proposals below into doctrine.

The evidence comes from three places: a set of documents read first-hand for this report; a
sweep of twelve overlapping reader probes over roughly 20,000 lines of estate history, which
returned 102 topology sightings and 76 observations about how fleet knowledge is stored; and
two fleet dispatch attempts from tonight, one of which also produced a separately useful failure
outcome.
Section 7 records exactly what was read and what was missed.

---

## 1. What we have tried — the topology census

The twelve probes deliberately overlapped, so the same run was often seen two or three times
from different reading windows. Merging those sightings, **102 raw sightings collapse to 40
distinct arrangements.** One further arrangement (the cross-examination design fleet) was read
first-hand for this report but fell outside every probe's window, and two more were attempted tonight,
giving **43 arrangements in the census below**.

The merge is honest in one direction and conservative in the other: where two probes described
the same run with different numbers, the entry keeps the source's number and the disagreement is
recorded in §1.7. Where a probe reported an *analysis* of a shape rather than a run of it (the
compound-versus-single-seat comparison), it is folded into the relevant row as evidence, not
counted as a separate arrangement.

"Sightings" below is how many of the 102 landed on that row — a rough measure of how prominent
the arrangement is in the estate's own written record, not of how often it ran.

### 1.1 Review and verification fleets

| Arrangement | Shape | Scale | Sightings | Verdict |
| --- | --- | --- | --- | --- |
| Bot-review treadmill / review ratchet | serial rounds | 4–28 rounds per pull request | 6 | Anti-baseline. The shape fleets exist to beat. |
| Lens-grid whole-diff fleet (PR #336) | fan-out + verify | 155 agents, 28 min, ~6.6M tokens | 1 | Worked; found defects 25 bot rounds had missed. |
| Multi-specialist expert gateway panel | fan-out | 2–7 named experts per artefact | 16 | The estate's workhorse. Consistently pays. |
| Four-seat doctrine quorum (PDR-101) | quorum | 4 seats per doctrine batch | 3 | Pays at batch scale; oversized for one file. |
| Claim-verification fleet over a record | fan-out | 7, 8, 9, 12, 14, 18, 22, 25 agents | 10 | Reliable at catching a single author's own drift. |
| Tiered plan-review fleet | tiered fan-out | 31 agents, ~2.9M tokens, 19 min | 1 | Caught 23 blocking defects in one run. |
| Disposition-table fleet | tiered fan-out | 14 dispatched (12 Sonnet: 11 valid + 1 invalid; 2 Opus) | 1 | Produced the model-tier stance gradient finding. |
| Adversarial pre-spend verification panel | panel | ~450k tokens gating a 30M-token spend | 1 | Cheapest insurance measured anywhere. |
| Two-reader cross-attestation | pair | 2 independent first-hand readers | 1 | Named the lane's strongest reliability mechanism. |
| Self-run refuter pass over own synthesis | single | 1 author + 1 self-refuter pass | 1 | Overturned 4 of 6 of its own claims. |
| Self-pass over the *refuted* set | single | 1 re-read of the dropped half | 1 | Caught a wrongly-dropped live question. |
| Cross-model / cross-vendor review | mixed panel | 1 GPT-5 seat inside a Claude chain | 1 | Caught a blind spot the all-Claude chain missed. |
| Semantic-merge resolver fleet | fan-out | 8 resolvers + 1 second reader | 1 | Held, on a mandatory per-file losslessness proof. |
| Whole-divergence review fan-out | fan-out | 39 agents over a 234-commit divergence | 1 | Worked; one inflated finding killed on re-check. |

### 1.2 Corpus and sweep pipelines

| Arrangement | Shape | Scale | Sightings | Verdict |
| --- | --- | --- | --- | --- |
| Corpus-analysis map→reduce→validate→meta | pipeline | Locked 1,001-agent pipeline: ~73M raw / ~$210; full experimental session: 178M / ~$448 | 2 | Mechanism sound, judgement regime failed calibration. |
| Restatement-audit pipeline | pipeline | ~46 windows planned; halted at pilot | 2 | Halted correctly, twice over, before full spend. |
| Reader fleet, point-not-copy | fan-out | 31 Haiku workers over 30 windows | 3 | Produced the estate's sharpest worker-contract lesson. |
| Comms-corpus MAP/REDUCE/MERGE/META (P2) | tiered pipeline | 23 map + 2 reduce + 1 merge + 18 meta | 2 | Worked; one reduce stage died on scale. |
| Full-coverage residue sweep (P6) | fan-out | 11 batches over 159 records | 1 | Exhaustive beat sampling: found 36 unhomed items. |
| Five-scanner estate sweep | fan-out | 5 scanners, 536k tokens, 194 tool calls | 1 | Every instance quote-verified by its own scanner. |
| Multi-lens research fan-out | fan-out | 8 lenses then 5 lenses | 2 | Direction-bending findings; drops in open questions. |
| Uncapped per-finding classifier fan-out | fan-out | 168 classifiers queued | 1 | Owner-killed as waste. The founding cost failure. |
| Known-answer calibration probes | instrument | withheld findings; 4–6 canaries | 2 | Cheap recall measurement; synthetic canaries rejected. |
| Structured-output workflow fan-out | mechanism family | 45 retries; 3/15 verifier deaths; 143k-token scorer failure | 1 | Ran repeatedly and failed at predictable mechanical points; see §3. |

### 1.3 Design and exploration fleets

| Arrangement | Shape | Scale | Sightings | Verdict |
| --- | --- | --- | --- | --- |
| Five-phase adversarial architecture exploration | staged fleet | 27 agents, 5 phases | 1 | Scoreboard discriminated cleanly between options. |
| Five-phase design fleet with cross-examination | staged fleet | 14 agents, 20 min, ~1.33M tokens | 0 (read first-hand) | Cross-examination earned its place on first outing. |

### 1.4 Conscience panels

| Arrangement | Shape | Scale | Sightings | Verdict |
| --- | --- | --- | --- | --- |
| Cricket (single → pair → two pairs → quartet ×2 stances) | quorum | 1 → 2 → 4 → 8 legs per moment | 6 | The estate's only fleet with a proper measurement record. |

### 1.5 Seat and team topologies

| Arrangement | Shape | Scale | Sightings | Verdict |
| --- | --- | --- | --- | --- |
| Director + worktree-isolated implementers | team roles | 1 Director + N implementers | 6 | Zero shared-tree collisions across many generations. |
| Succession / standby / overlap handoff | team roles | 2 seats overlapping per transition | 9 | Overlap beats a clean baton pass. |
| Compound adversarial pair | pair | 2 seats checking each other | 4 | Worth it at bounded decision edges only. |
| n=2 collaboration mode (PDR-082) | team roles | 2 seats, owner-visible | 2 | Protocol overhead is non-linear in team size. |
| n=3 team under a Director | team roles | 3 seats + Director | 1 | Disjoint boundaries held all session, zero collisions. |
| Compact → reground → fork | pipeline | 1 baseline fanned to N siblings | 1 | ~10 minutes of prep saved per forked seat. |
| Director-led four-Opus-seat team, then three-seat peer mode | team roles | 1 Director + 3 executing seats; Director later dissolved | 1 | Coordination stayed "alive" for 90 minutes without merged delivery; peer mode began only after the team reduced to three. |
| Substrate-external fleet member (Copilot) | team roles | 1 external seat + a proxying Director | 1 | Worked as a citizen; the tooling did not reach it. |
| Cross-estate exchange | 2 estates | 1 session each side | 1 | Convergent designs from opposite sides. |
| Relay seat as host-load coordinator | serialiser | 3 gate chains through 1 relay | 1 | Converged three heavy chains on one 8-core host. |

### 1.6 Designed, not yet run

| Arrangement | Shape | Sightings | Note |
| --- | --- | --- | --- |
| Tiered-sight ladder: Haiku ×2 overlap → Sonnet → Opus → Fable overwatch | tiered | 2 | Owner-articulated; the P2 run is its evidence base. |
| D1–D9 corpus kernel with model-tier economy | cellular + tiered | 2 | Ratified as sound by design review; interaction gaps named. |
| Fleet-wide shared-resource broker | infrastructure | 1 | Proposed while the team was being throttled by its absence. |
| Tiered model fallback under vendor overload | policy | 1 | Blocked: the dispatch surface cannot express the tier. |

### 1.7 Tonight's two dispatch attempts and one failure outcome

These are fresh. The third item is an outcome of the overlapping sweep, not a third dispatch.

- **The tmux swarm dispatch.** Spawning a swarm through tmux reported success while no server
  was running. Nothing was ever going to arrive. This is the same class as the comms watcher
  that "crash-loops silently inside a Monitor re-arm loop" recorded in the PR-336 failure log
  (`.agent/reports/agentic-engineering/pr336-fleet-assessment-and-review-treadmill-2026-07-13.md`
  §8), which prescribes asserting the watcher live after arming, not merely armed. The estate
  has a named guard for exactly this — the F-95 watcher-presence fail-fast gate, built and
  landed in June (`.agent/memory/active/archive/napkin-2026-06-25-zephyr-consolidation.md`,
  F-95 entries) — and it did not generalise to swarm arming.
- **The fifteen-probe overlapping sweep** that produced most of this report. Fifteen Sonnet
  probes were given deliberately overlapping reading windows across the estate's history.
  Twelve returned. The overlap was the point: where two probes read the same window, their
  agreement is a coverage check and their disagreement is a signal (§1.8). This is the owner's
  overlapping-landscape design run for real, one tier up from the Haiku sketch.
- **The retry-cap outcome.** Three of the fifteen probes died on the structured-output retry
  cap — the same mechanism that killed 15 of 81 verifier units on PR #336 in July and left
  their findings with no verdict at all. That failure is written down, in a failure log
  addressed to "the next fleet author", with three named cure candidates. None was built. It
  recurred tonight at a 20% death rate, close to the 19% recorded then. A separate earlier
  3-of-15 verifier loss was caused by a provider session limit, not by this retry cap; it is
  evidence for the same sparse-results hazard, not a recurrence of the same mechanism.

### 1.8 Where the probes disagreed, and what that tells us

Overlap was designed in, so disagreement is data rather than noise.

1. **The reduce-stage ceiling: 580 or 581 leaves.** One probe reported "a proven precedent
   ceiling (581 leaves in this estate)". The source says 580, in three separate places
   (`.agent/memory/active/archive/napkin-2026-08-06.md` line 141, "precedent maxed at 580 leaves"; the P2 discovery
   report's cure line; the salvage plan's evidence base). This is a probe transcription error,
   not a source ambiguity, and it is exactly the drift the tiered-sight doctrine predicts when a
   number passes upward through a summary.
2. **How Haiku and Sonnet actually diverge.** One probe concluded that across paired runs
   "Haiku and Sonnet diverge only on SEVERITY grading, never on the redirection substance". Two
   other probes recorded pairs where the *verdicts* differed in kind — a Sonnet DRIFTING against
   a Haiku WRONG-PRIORITY — and the quartet tally has rows where Haiku returns WRONG-PRIORITY
   while every other leg returns ON-TRACK
   (`.agent/reports/agentic-engineering/cricket-quartet-tally-2026-07-29.md`, row 9). The
   narrower claim is the safe one: direction is usually stable, severity is not, and the
   exceptions are real.
3. **Whether the compound pair is worth two seats.** One probe recorded the Mussel/Vole pair
   catching a real defect in each direction within the first hour. Another recorded the
   Lupin/Zephyr pair as ceremony that "slowed execution" for its lane. Both are true. The
   reconciliation the record itself reaches is that the pair pays at bounded decision edges and
   costs at continuous co-navigation.
4. **Quorum economics reported twice with different numbers.** One probe reported ~70–120k
   tokens per seat and 5–7 minutes; another ~120–160k per seat and 9–12 minutes. These are not
   in conflict — they are a ~20-file batch and a ~35-file batch — but each was reported as a
   free-standing baseline. Cost figures need their denominator attached or they become folklore.
5. **The corpus duplicated itself before the probes saw it.** Two probes independently flagged
   that the archived July napkin contains verbatim-duplicated blocks (one called it a "union
   variant", the other counted "27 duplicated blocks"), and two more flagged that a pair of July
   consolidation archives are near-duplicates with no provenance note. Where a sighting pair came
   out of those regions, the inflation is in the source, not in the reading. This is a direct
   argument for §6's proposals: the record we mine is already lossy and duplicated.

---

## 2. What worked

Each of these is stated as a claim with the measurement behind it.

**Splitting finding from verifying, with the verifier defaulting to refute.** On the PR #336
diff fleet, roughly 80% of the verdicts recorded were refutations — 53 of 66 — and the
refutations concentrated on exactly the predicted cheap-tier failure modes: literalism,
house-style flags, and already-handled-nearby claims. The report's own conclusion is blunt:
"Without this layer the fleet's output would have been mostly noise." The value in a find/verify
fleet sits in the verify half.

**Anchoring every finding to a verbatim quote.** The same run recorded exactly one fabrication
among 65 substantively verified findings, against 3 fabricated stubs in 13 agents on an earlier
run without the anchor. Schema validity is not substance validity; a mandatory quote plus a
declared byte-check is what closes the gap.

**Letting code do the counting.** PDR-122's first invariant — atomic judgement from the model,
deterministic aggregation in code — was minted because a meta agent self-reported recall of
~0.72 while its own per-item judgements summed to ~0.28. Models judge one thing well and
aggregate many things badly. The cure is structural: never ask for the number.

**Conserving by default and gating only the irreversible discard.** Re-validating single-voter
kills under a diverse-lens quorum showed an ~80% false-kill rate. The same ~80% figure came back
independently on buffer-item withdrawals, twice
(`.agent/memory/active/patterns/fan-out-verify-gatekeeper-execute.md`). Rigour belongs where the
harm is irreversible, not spread evenly.

**Overlap as an instrument — observed and projected separately.** Tonight's fifteen-Sonnet sweep
used overlapping reading windows: agreement checked coverage, while disagreement exposed
transcription errors and claim drift (§1.8). The P2 report proposed, but did not run, overlapping
Haiku readers, offset strides, a disagreement-field salience map, or the projected double-Haiku
economics. Those remain design warrants for an experiment, not results of the P2 run.

**Calibrating before scaling.** The restatement-audit pilot cost ~100,727 tokens over 62
instances and failed its own acceptance gate at 1 of 8 rows clean — halting a full dispatch
against a 6M-token budget. Separately, measuring the real per-voter cost showed the founding
estimate was about 3.3× under, which halted the same dispatch for a second, independent reason.
Two cheap measurements, two independent halts.

**Checkpointing between stages.** In the P2 run this "paid for itself twice": a killed stage lost
only its own work, and banked spend was never threatened by compaction. It is PDR-122's fifth
invariant and it is the highest-value-per-line mechanism in the whole corpus.

**Replaying deterministic code over data already paid for.** The single most productive move in
an 18-agent adversarial verification was free: re-running the join code over 62 already-paid-for
instances converted three eyeballed claims into measured ones and found two new defects
(`.agent/reports/agentic-engineering/fleet-design-patterns-2026-07-16.md` §Pattern 15).

**Cross-examination inside a design fleet.** On its first outing, having each designer's
proposal critiqued by a peer holding the *next* stance caught two fabricated verdicts before
synthesis — verdicts manufactured against defects the source document did not contain, because a
dispatch defect had fed every leg the literal string "undefined". One extra agent per design
stance, and it caught the run's worst failure.

**Asymmetric verify pairs.** In the same run, the compliance checker returned no findings at all
and the adversarial refuter returned two serious ones. Perspective diversity caught what
redundancy would not.

**Single-turn cells.** Locking a voter's tool surface to one turn cut its cost by 7–17×, because
every tool call re-reads the agent's whole context. Turns × context is the dominant lever, not
model tier.

**Compiled decision procedures for small models.** Haiku tracked Sonnet once judgement was
decomposed into per-item PASS/FAIL steps with mandatory quote anchors, a mechanical verdict
table, and a banned-vocabulary list. The quartet tally then measured the cost shape: the
compiled-procedure leg is the *cheapest* on tokens (~23k against ~30–35k) and the *slowest* on
wall-clock. Effort dominates run time; template dominates token cost.

**Convergence from genuinely different lenses.** Independently reached findings — a security
expert and a code expert landing on the same path-traversal defect, two agents independently
building scratch-repo probes and proving the same git-hook gap — are treated across many sessions
as the strongest available signal that a roster is earning its cost.

**Reserving frame-challenge for the top tier.** In the 14-agent disposition fleet, all 11 valid
Sonnet agents filed SOUND-WITH-CHANGES inside the handed frame — one of them while personally
holding evidence that should have made the frame unsound. Both Opus seats rejected the frame
itself; the remaining Sonnet response was invalid. Direction, severity, frame-judgement is the
observed ordering of what a higher tier buys.

**Batching review rounds.** One PR's batched adjudication converged 41 → 6 → 2 findings in three
rounds, where sibling PRs under one-cure-one-push discipline sustained ten-plus rounds. One push
per adjudicated round is a throughput mechanism, not politeness.

**Exhaustive coverage where an owner grant paid for it.** Upgrading the P6 residue sweep from
sampling to full coverage read all 159 records and found 21 of them carrying 36 unhomed items
that sampling would have missed by construction.

---

## 3. What did not work

**Uncapped fan-out on an expensive tier for mechanical work.** 168 classifiers queued from one
workflow, on the session model, for a classification task. The owner killed it. It produced the
estate's standing constraint: no workflow without an owner go, a declared agent count, and a
declared model tier.

**Spending everything before the calibration instrument reads anything.** The 2026-07-02
discovery run burned $448.08 across 177,690,644 raw tokens, including one leg aborted at 206
agents having spent $196.90, and the validate stage then failed calibration by killing 11 of 18
known-real baselines. The cure that became doctrine is ordering: canaries first, behind a
deterministic breaker, then a tenth-scale pilot.

**Asserting quorum independence instead of measuring it.** Mean pairwise inter-lens correlation
came out at 0.548 for the Sonnet regime and 0.544 for a banked Opus regime — near-identical —
giving a diagnostic estimate of about 1.4 effective votes out of 3 in both. That calculation
uses agreement on live candidates and therefore cannot distinguish sound agreement from
correlated error; a canary-labelled truth set is required before treating it as an effective
error-vote count. Different prompts on the same model do not manufacture independence, and
neither does a different model family. Cross-regime agreement was only 59.6%, with 18 of 19
disagreements one-directional toward kill.

**Verifier deaths on the structured-output retry cap.** 15 of 81 verifier units died on PR #336
carrying no verdict, and were silently dropped from the ledger's first draft — caught only
because a post-merge reviewer noticed the arithmetic did not close. A provider session limit
separately killed 3 of 15 verifiers on an earlier run while the workflow reported completing
normally, and the retry cap killed 3 of 15 probes tonight. A "completed" workflow tells you
nothing about coverage, but the two 3-of-15 losses must not be conflated causally.

**Losing the linkage at export.** The same run's durable extract carries all 81 finding bodies
and all 66 verdict bodies but no key joining them, so the 15 unverified findings are bounded as a
set and not individually identifiable. 64 of 66 verdict rows are clipped at exactly 500
characters, most mid-rationale, by the extract writer rather than the verifier. The file and lens
metadata the workflow had stamped on every finding was dropped, making the findings
unattributable to the file × lens grid the analysis evaluates. The run is not reproducible from
its own record.

**Think-loops at scale.** A single reducer fed 981 leaves produced three consecutive
thinking-only turns over ~35 minutes, burned ~170k tokens, and never reached its output call. The
cure trio worked: shard under the proven 580-leaf precedent, drop one effort tier, and bind the
agent to think briefly then emit. The diagnostic that caught it was turn shape, not output
quality — the agent was alive and not converging.

**Small models cannot copy.** In one wave, the same Haiku workers caught 3 of 3 marker-free
canary plants exactly and failed byte verification on 17 of 30 windows, drifting line numbers by
one and stripping leading whitespace. Catching and copying are different capabilities.

**Identical prompts do not give independent readings.** Two readers with the same prompt over the
same bundle share their blind spots. Independence requires different windows or different lenses.

**Convergence can be a shared-scope artefact.** Three of four quorum seats independently made the
same scoped-search miss and reported it as an over-rejection — a convergent *false* finding,
refuted only by going to source. Convergence never waives per-claim verification.

**A reviewer's clearance inherits the reviewer's search scope.** A documentation expert cleared a
file as needing no update; a later bot round found two operational enumerations in that same file
that the reviewer's scope had never reached. Clearances of absence must compose with a mechanical
sweep, never replace one.

**Coordination liveness is not delivery.** A four-seat team ran for about 90 minutes with
heartbeats green, claims open and broadcasts flowing, while delivering nothing past local
commits. Free-form heartbeat bodies masked it.

**Dispatch success is not dispatch liveness.** Two parallel Opus reviewers froze at exactly the
same second mid-run with no error and no completion notice; pings queued for a next tool round
that a wedged agent never takes. Tonight's tmux swarm reported success into an empty room. The
generalisation is the F-95 one: assert the thing is live, not that arming returned zero.

**Handoffs that mix durable and derivable content in one voice.** A Director handoff captured at
17:30Z was false in six places by 21:00Z, because owner rulings and lane state were written with
the same authority. Where a fact is derivable, the record should carry the command that yields
it, not the value.

**Unbounded adversarial finders against a compliant executor.** Ten rounds on one PR, of which
rounds 4–8 were largely the reviewer reviewing the seat's own cures to its own prior findings,
three levels deep into a formatting question. Every finding was correct; correctness alone was
tested, never relevance or proportion. The instrument that would have stopped it — a round tally
with a step-back predicate — was documented and never built.

**Sampling finders have no fixed point.** On a dense multi-file diff, per-round suppressed-finding
counts ran 5, 5, 2, 4, 3, 3, with round 10 still flagging surfaces unchanged since round 1. What
ended it was one class-kill sweep, not another instance round.

**Directors spawning implementers.** A Director-spawned implementer sub-agent collided with a
live peer's work and left a type-breaking orphan. Directors dispatch read-only reviewers.

**Open-ended existence questions do not fan out.** A workflow asked to map and content-verify
about ten sections failed on the structured-output retry cap having burned ~898k tokens, with no
usable output, even with flat schemas. Fuzzy "does X exist anywhere" work belongs in first-hand
gated verification.

**Synthesis quietly drops the open questions.** In an eight-lens research fan-out, an independent
review found the drops and softenings concentrated specifically in the lenses' open-questions
sections rather than their findings — and those dropped items traced to real later revisions.

**Frozen records read as live seats.** A fresh background seat grounded on frozen succession
records, concluded a singleton seat was open, and overwrote a live Director's registry row
mid-sitting. Separately, a restart-orphaned process woke carrying the lead seat's memory,
concluded it *was* the lead, and issued corrections in the lead's name. Memory of being a seat is
not tenure of the seat.

---

## 4. What we have learned — the doctrine layer

**Rigour goes where the harm is irreversible.** Not uniformly. A false keep is visible and
prunable; a false kill vanishes and silently drops recall. That asymmetry is the whole design
argument for conserve-by-default, and it generalises: fan out to verify, stay serial and
first-hand to execute.

**The landscape is a routing artefact, never a truth artefact.** Cheap wide passes exist to say
where to look, not what is true. Conclusions come only from tier-appropriate source reads. The
failure this prevents has a name — epistemic laundering: low-resolution readings acquiring
authority by passing upward through summaries until the deciding tier has never touched ground
truth. The invariant that falls out is that no source of truth may be seen only by the lowest
tier, and that what narrows going up the ladder is selectivity, never the right to descend. Note
that tonight's 580/581 slip is a live, small instance of exactly this.

**Overwatch is a dynamics role, not a correctness role.** Its object is direction and
convergence. The think-loop was caught by turn shape, not by any output being wrong; the
ten-round review ratchet was caught the same way. Nothing about the overwatch's own output was
being checked — and no tier is the top of the stack, since the platform classifier caught the
overwatch's own canary design and the owner sanity-checked the overwatch throughout.

**Turns × context dominates cost; tier does not.** Every tool call re-reads the whole context, so
a free-tool voter costs an order of magnitude more than a single-turn one on the same judgement.
The corollary is counter-intuitive and useful: narrow scope makes deep tiers cheap. A focused
Opus-high re-read cost only ~2.4× a wide Sonnet pass per candidate, because narrow scope removes
waste. Tier-escalation-on-failure is therefore a cheap default, not a luxury.

**Model tier buys a specific thing, in a specific order.** Direction was usually stable across
tiers in this corpus, with the exceptions in §1.8; severity was not, and frame-judgement appeared
only at the top. A fleet handed a wrong frame will classify faithfully within it unless someone
is mandated to reject it.

**Independence must be measured, never asserted.** Prompt diversity is not lens diversity, and
lens diversity is not statistical independence. The estate's correlation numbers demonstrate
dependence in the observed verdicts, but only canary-labelled joint correctness can distinguish
shared soundness from correlated error and estimate an effective error-vote count.

**A cure is a claim.** It gets the same verification tier as the finding it cured. Layered
reviewer → cure → gate chains are not redundancy; they are the correction for how fluent a wrong
cure sounds when you have just written it.

**Deterministic gates outrank fleet verdicts.** A pre-commit validator refused a
fleet-confirmed fix and forced the correct answer. Fleet output is an input to the gate chain,
never an exemption from it.

**Convergence is a governance property, not an emergent one.** Bot review of an evolving tip is
reflexive — each cure push mints fresh surface, and a competent reviewer finds true findings on
any fresh surface. Counts do not decay to zero on their own. What converges a review is a
declared terminal-round criterion, and finding *altitude* marching outward is a better signal
than falling counts.

**Team-protocol overhead is non-linear in team size.** Substrate that is justified at four or
more rotating seats is pure ceremony at two owner-visible seats. Below four agents, peer
coordination without a formal Director is the default unless the owner explicitly directs otherwise.

**Verification fleets check what was claimed; they cannot see what was never claimed.** A
loss-scan is a structurally different instrument from a verification fleet, and both are needed.

**Delivery and verdict quality are separate axes.** A round can be unanimous among the legs that
delivered while being mostly a delivery failure. Any panel record that does not carry a delivery
column is over-reporting its own agreement.

**Transmission of a warning is not immunity.** Multiple seats broadcast a failure-mode warning
and then hit the same failure minutes later. A recurring passive-memory failure needs a
structural tripwire at the action moment, not another restatement of the rule. Tonight's retry-cap
recurrence — against a written failure log with three named cures — is the clearest instance in
the corpus.

---

## 5. Arrangements worth trying next

Each entry carries a warrant (why the evidence supports trying it) and a falsifier (what
observation would kill it). None is a recommendation to build now; they are candidates.

**1. The three-pass landscape sampler.** A massive overlapping cheap-probe sample, then a
higher-definition pass over only the features the disagreement field flags, then individual
attention on what survives.
*Warrant*: the projected tier economics (double Haiku ≈ half a single Sonnet pass, if the proposed
disagreement field is useful) plus tonight's measured fifteen-Sonnet sweep, which worked and whose
disagreements were genuinely informative (§1.8).
*Falsifier*: disagreement rate stays flat across genuinely different corpora, meaning the field
carries no salience signal and the second pass has nothing to route on.

**2. The octopus.** A high-power mantle holding intent; mid-power arms each holding drive for one
area; each arm running tightly-scoped low-power suckers. This is distinct from tiered sight:
authority and desire are distributed, not just resolution.
*Warrant*: the estate's Director/implementer topology already distributes authority and works
(zero shared-tree collisions across many generations), and the P2 run showed that resolution
tiering alone still funnels every judgement through one seat.
*Falsifier*: measure intent-drift per arm. If arm-level drive merely duplicates mantle intent it
is pure overhead; if it diverges, the run is incoherent. Either reading kills it.
*Try it on*: a multi-workspace migration with one arm per workspace.

**3. The slime mould.** Very low power, extremely tight constraints, with emergent routing as the
cognitive engine. The nearest thing the estate has already built is the deterministic state
machine routing atomic judgements — this takes that to its limit and puts the intelligence
entirely in the constraint design.
*Warrant*: the compiled-decision-procedure result (Haiku tracks Sonnet once judgement is
decomposed) and the 7–17× single-turn cost lever both say that constraint design substitutes for
capability further than intuition suggests.
*Falsifier*: constraint-design cost exceeds the tier cost saved. Measure the authoring hours
against the token delta on the first real run.
*Try it on*: coverage and reachability sweeps.

**4. Cross-examination as a standing stage in every design fleet with three or more stances.**
*Warrant*: it caught both fabricated verdicts on its first outing, for one extra agent per
stance.
*Falsifier*: three consecutive design fleets where the cross-examination round returns no
accepted amendments.

**5. Standing overwatch instrumentation.** Make the dynamics role mechanical where it can be:
turn-shape monitors, disagreement-rate gauges, round tallies, and a delivery-rate column as
first-class run metrics.
*Warrant*: every one of these caught something — turn shape caught the think-loop, disagreement
rate is the proposed regime-degradation metric, the absent round tally is precisely what let the
ten-round ratchet run, and delivery rate is the axis the cricket record added after silent legs
were being counted as agreement.
*Falsifier*: a run where all gauges read normal through a failure the overwatch then catches by
judgement — which would show the gauges measure the wrong dynamics.

**6. A discriminating-experiment leg for expert conflicts.** When specialists conflict on
mechanism, the next dispatch is a cheap empirical probe, not another opinion.
*Warrant*: three specialists on one plan produced mutually exclusive recommended mechanisms and
the panel could not adjudicate; an empirical cache-hash probe broke the tie and falsified the
documentary premise the other expert had relied on. The record's phrasing is "discharge by the
cheapest discriminating experiment, never by eloquence".
*Falsifier*: a conflict where the probe is inconclusive and the panel majority turns out to have
been right — meaning the probe was the more expensive path to the same answer.

**7. The class-kill round.** When a sampling reviewer resurfaces the same shape across rounds,
spend one round on a mechanical sweep of the whole class rather than another instance round.
*Warrant*: one such sweep ended a finding family that had returned one instance per round for
three rounds.
*Falsifier*: a class-kill sweep that mints more new findings than the instances it retires.

---

## 6. Encoding, preserving and making fleet designs usable

This is the part of the ask with the most leverage, because the report you are reading only
exists because twelve agents spent an evening re-reading history that was already written down.

### 6.1 What we have now, assessed

Nine mechanism classes appear across the 76 encoding observations. They are ranked here by how
reliably the knowledge in them reaches the agent who needs it *at the moment of dispatch*.

| Mechanism | What it holds | Honest assessment |
| --- | --- | --- |
| Per-user memory and rules | Standing behavioural rulings | The only mechanism that surfaces automatically. Repeatedly the fastest home for a one-line cure. Cannot hold a design. |
| Skills (`oak-cricket`, `oak-sif`, `pr-lifecycle`, `start-right-team`) | Invokable procedure | Most discoverable structured encoding; genuinely hardened over many sessions. But reading a skill did not stop at least one seat repeating the exact mistake it documents. |
| Decision records (PDR-117, 082, 122, 130, 133, 134) | Doctrine with falsifiers and worked instances | The most durable layer. Each carries an amendment history, a falsifiability clause and named second-instance evidence, so you can see how the doctrine actually evolved under use. Slow by design. |
| Executable pipeline code (`agent-tools/src/corpus-analysis/workflows/`, `agent-tools/src/restatement-audit/workflows/`) | Runnable fleet stages, typed schemas, stage guards, unit tests | The only encoding that *runs*. Shared build machinery already lives in `agent-tools/src/workflow-build/`, and restatement-audit imports corpus-analysis orchestration and harness types. The remaining duplication is narrower: module-local stage IO, guards, run-input contracts and build adapters. |
| Named reports (this directory) | The richest fleet content in the estate | Worst discoverability by a distance. See §6.2. |
| Registers and tallies (cricket tallies, F-numbered frictions, pending-graduations, stray-code register) | Accumulated measurements across many runs | Genuine institutional memory. The F-codes are cited across months; the cricket tally is the only fleet record carrying per-leg tokens and runtime. Under-used elsewhere. |
| Pattern files (`.agent/memory/active/patterns/`) | Single reusable shapes with a proven instance and a barrier block | Cheap to scan, checked in, greppable. But 223 files, of which about 12 are fleet-related, and no fleet index — you find one by already knowing the shape. |
| Napkin (append-only capture buffer) | First capture at occurrence | Indispensable as a buffer and chronically past its own rotation threshold; dense narrative prose with no per-instance index. Mining topology facts out of it requires precisely the line-by-line read this report commissioned. |
| Handoff records and comms events | Live coordination state | Transport, not storage. Explicitly decays within minutes; the durable/derivable split is a real cure but only as good as each writer's discipline. |

### 6.2 The discoverability problem, measured

- `.agent/reports/agentic-engineering/` contains **93 files**. Its README indexes **five** of
  them, none of which is a fleet record. The PR-336 fleet assessment, the fleet-design-patterns
  capture, the cross-examination trial, all three cricket tallies and the entire
  `large-corpus-analysis-tooling/` sub-lane are unindexed.
- The fleet-design-patterns running capture — 17 numbered patterns, each with a worked instance
  and a candidate tooling mechanism, and the single best fleet-authoring document in the estate —
  is reachable only if you already know its filename.
- The rescued PR-336 workflow script survives verbatim at
  `.agent/reports/agentic-engineering/pr336-fleet-workflow-script-2026-07-13.js.txt`. It is a
  `.js.txt` file in a reports directory. It is not runnable, not typed, not tested and not
  referenced from any index.

The pattern across all three: the estate is excellent at *capture* and poor at *retrieval at the
moment of dispatch*. That is the gap the proposals below target.

### 6.3 Five proposals

Tested against the probe evidence. The skeleton for this report carried four candidates; one of
them rested on a premise that does not hold in this repository, and is replaced.

**P1 — A fleet-pattern library with an index at the dispatch surface.**
Promote the 17 running-capture patterns into named pattern files under a fleet-scoped index, each
carrying the same fields: shape, when to use, cost model, briefing template, failure modes,
calibration gates. Add the index to the reports README and to the `oak-sif` skill, which is where
an agent already lands when it is about to invoke another agent.
*Warrant*: 223 pattern files with about 12 fleet-relevant and no index; 93 reports with 5
indexed. The patterns are already written; only the retrieval path is missing.
*Falsifier*: a month in which no dispatching seat cites a library entry.
*Maintainer*: whoever runs the curation pass; the barrier block already gates graduation.

**P2 — Extract only the remaining shared stage contracts in agent-tools.**
The corpus-analysis and restatement-audit pipelines already share the workflow-build core;
restatement-audit also imports corpus-analysis orchestration, harness types and an agent-schema
type. Do not replace that working boundary with one parameterised whole-pipeline layer. Instead,
measure the remaining mirrored stage IO, guards, run-input contracts and build adapters, then
extract only domain-neutral contracts or mechanisms that are genuinely identical. Keep domain
schemas, prompts and adjudication local. Candidates to test at that boundary include anti-stub helpers
with minimum-length constraints and quote anchors, a `calibrationGate(stage, tiers, criterion)`
helper, a per-fleet declaration block generator (counts, tiers, ceilings, halt bindings,
acceptance gate), and a bounded-output guard capping arrays by construction.
*Warrant*: broad build and orchestration reuse is already present. The remaining duplication is
verified by the mirrored module-local boundary files, while cross-imports show which abstractions
have already fitted real variation. Every candidate helper listed is a named mechanism in the
fleet-design-patterns capture (patterns 1, 3, 6, 7, 11) or in the bounded-structured-output
pattern file; each still needs a consumer-shape check before extraction.
*This proposal absorbs the skeleton's fourth candidate.* That candidate proposed "named saved
workflows" in a `.claude/workflows/` registry. **No such directory exists in this repository** —
the executable fleet encoding that actually exists is the two agent-tools pipelines above. The
substance of the idea (encode once, invoke by name, evolve under review) is right and lands here
instead.
*Falsifier*: a third pipeline cannot use an extracted contract without domain-specific branches,
which would mean the narrower abstraction still does not fit the real variation.
*Maintainer*: the agent-tools lane.

**P3 — A one-page topology record for every significant run.**
Topology, cost, findings, disposition — the shape the cross-examination record already uses —
with the PR-336 export-discipline failure log as its mandatory checklist: capture a
verdict-to-finding key, export full evidence text with no slice caps, preserve dispatch-stamped
file and lens metadata, and assert verdict-count equals deduped-count before the run reports.
*Warrant*: this is measurable. The three runs that have such a record — PR #336, the
cross-examination trial, the P2 pipeline — are the three richest sources in this entire report.
Runs without one are permanently degraded: **nine of the twelve probes named missing model tiers
among their uncertainties**, and the per-agent tiers of the 27-agent architecture
exploration and the five-scanner sweep are simply unrecoverable now. Cost is one page per
significant run.
*Falsifier*: three consecutive topology records that a later reader never cites.
*Maintainer*: the dispatching seat, at run close.

**P4 — A run ledger carrying per-leg cost and delivery.**
Extend the cricket quartet tally's recording convention — every run recorded at occurrence, each
leg carrying token usage and runtime, with delivered and undelivered as distinct states — to
every fleet dispatch.
*Warrant*: the cricket tally is the only fleet record in the estate that carries per-leg cost,
and it is the only one that has produced a stable cost shape (~23–34k per leg; compiled procedure
cheapest on tokens, slowest on wall-clock). Meanwhile the PR-336 fleet's 15 dead verifiers were
silently dropped from the first ledger, and the twin Opus freeze had no completion notification
at all. A ledger with a delivery column makes both visible on the day.
*Falsifier*: a quarter of ledger rows with no reader — no citation, no cost comparison, no
calibration use.
*Maintainer*: the dispatching seat; the format is already proven.

**P5 — Index the fleet corpus where readers actually land.**
Add fleet rows to `.agent/reports/agentic-engineering/README.md`; add a per-user memory pointer
naming the three entry documents (this census, the fleet-design-patterns library, PDR-122); and
name the fleet index from `oak-sif`.
*Warrant*: per-user memory is the only mechanism observed to re-surface automatically without an
active search, and skills are the most discoverable structured encoding. Both are cheap. The
measured gap is in §6.2.
*Falsifier*: the pointers exist and dispatching seats still commission a corpus re-read to answer
a question the corpus already answers — which is what happened tonight.

### 6.4 A note on why encoding keeps failing

The corpus is unambiguous that writing something down does not make it fire. Doctrine broadcast
fleet-wide did not change behaviour; a skill was read at session open and the corrected mistake
was repeated the same hour; the estate's own named cure for a failure mode was documented and
never built, and that failure recurred tonight. The pattern the record itself names is that a
recurring passive-memory failure needs a structural tripwire at the action moment rather than
another restatement. Of the five proposals, P2 and P4 are the ones that create tripwires — code
that refuses, and a ledger row that is missing. P1, P3 and P5 improve retrieval, which is
necessary and, on this evidence, not sufficient.

---

## 7. Sources and coverage

### 7.1 Read first-hand for this report

- `.agent/reports/agentic-engineering/fleet-design-patterns-2026-07-16.md` (17 patterns)
- `.agent/reports/agentic-engineering/pr336-fleet-assessment-and-review-treadmill-2026-07-13.md`
- `.agent/reports/agentic-engineering/fleet-topology-cross-examination-2026-08-01.md`
- `.agent/practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md`
- `.agent/plans-backlog-2026-07/agentic-engineering-enhancements/current/corpus-analysis-salvage-and-topology-redesign.plan.md` (D1–D6)
- `.agent/reports/agentic-engineering/comms-corpus-knowledge-transfer/discovery-report-2026-07-31.md` (§P2 run record, §Tiered sight)
- `.agent/reports/agentic-engineering/cricket-quartet-tally-2026-07-29.md`
- `.agent/reports/agentic-engineering/README.md`, and the file listing of that directory
- `.agent/memory/active/patterns/` listing, and six fleet-relevant pattern files
- `agent-tools/src/corpus-analysis/workflows/` and `agent-tools/src/restatement-audit/workflows/`
  listings, `agent-tools/src/workflow-build/`, and their import graphs
- `.agent/memory/operational/threads/` listing

### 7.2 The probe sweep

Fifteen Sonnet probes with deliberately overlapping reading windows over roughly 20,000 lines of
estate history. Twelve returned, producing 102 topology sightings and 76 encoding observations,
banked at `.agent/reports/agentic-engineering/fleet-topology-probe-results-2026-08-05.json`.

Windows covered: the July napkin archives (07-06 ×2, 07-08, 07-14, 07-20 ×2, 07-23, 07-26, 07-30
×2) and the then-live napkin now archived as `napkin-2026-08-06.md`; the pre-July archives (May–June, by targeted grep rather than full
read); the `large-corpus-analysis-tooling/` report sub-lane (six files in full); two concept
explorations and the comms-corpus discovery report; four decision records and nine pattern files.

### 7.3 Bounds applied

- **Two probes read from a different worktree** than the one this report was written in. Line
  numbers in their citations do not always match this checkout (the live napkin is 2,493 lines
  here against the 2,554 they reported). That source window is now immutable at
  `.agent/memory/active/archive/napkin-2026-08-06.md`. Verification was therefore done by content search, not
  by line number.
- **The pre-July sweep was grep-driven, not exhaustive.** Its own coverage note records that
  "subagent" matched 49 files, "parallel" 65 and "team session" 76 — too many to open at that
  effort level. Instances certainly exist there that this report does not have.
- **Cost figures are recorded only where stated.** Most fan-out instances in the napkins carry no
  token or time figure and are marked as such rather than estimated. Model tiers are the single
  most common missing field, named among their uncertainties by nine of the twelve probes.
- **The source corpus duplicates itself** (see §1.8, item 5); no attempt was made to reconstruct
  the provenance of the duplicated archive regions.
- **Quantitative claims from the corpus reports were not re-derived from their backing data.**
  The `data/` checkpoint JSONs behind figures such as the inter-lens correlation measurement were
  out of scope; the figures are as stated in the prose reports.

### 7.4 The three probe deaths

Three of the fifteen probes died on the structured-output retry cap and returned nothing:

- **`cricket-pr336`** — intended to sweep the PR-336 fleet assessment and the cricket tallies.
  **Covered** by first-hand reads of both for this report (§7.1).
- **`agent-defs-pdr122`** — intended to sweep the agent definitions and PDR-122. **Partially
  covered** by a first-hand read of PDR-122 and a listing that confirmed the four `corpus-*` typed
  stage agents and four `cricket-*` panel agents. The definitions themselves were not read, so
  their stage contracts, prompts, tiering and failure controls remain an evidence gap.
- **`thread-records`** — intended to sweep the thread records at
  `.agent/memory/operational/threads/` (23 entries). **Not covered.** This is a real gap. Thread
  records carry lane-level agendas and follow-ups, so the most likely losses are topology
  *follow-ups* and design gaps routed to lanes rather than run instances themselves — for
  example, the four design follow-ups the PR-336 critics raised were routed to the
  agentic-engineering-enhancements thread record's agenda, and this report has them only via that
  report's own §7. A later pass over those 23 files would most plausibly add routed follow-ups
  and lane-level dispositions, not new arrangements.

### 7.5 Verification performed, and what it found

Every load-bearing figure quoted in §§2–4 was checked against its cited source by content search
before being asserted here: the PR-336 arithmetic and failure log; the 150-agent and 168-classifier
figures; the 969,049-token reader batch and its 17-of-30 copy failures; the $448.08 / 177,690,644
burn and the $196.90 aborted leg; the 0.548 and 0.544 correlations; the 11-of-18 killed baselines;
the 557k four-seat quorum and the 505k, 664k and 154k panel figures; the ~2.9M-token 31-agent
fleet and its 23 blocking defects; the 14-agent "all 11 valid Sonnets" finding; the 1.3M-token
22-verifier run and its 3-of-13 stubs; the 1.23M-token 18-agent fleet; the ~898k failed workflow;
the 90-minute alive-but-not-delivering team; the 536k five-scanner sweep; the 36 unhomed items;
the 21:38:59Z twin freeze; the 5,5,2,4,3,3 and 4→7→5→4→4→3 round series; the ~450k-against-30M
pre-spend panel; and the ~80% withdrawal-refutation rate.

**One probe-versus-source mismatch was found.** The `napkin-0726-current` probe reported the
reduce-stage precedent ceiling as "581 leaves in this estate". The source says 580, consistently,
in `.agent/memory/active/archive/napkin-2026-08-06.md` ("precedent maxed at 580 leaves"), in the P2 discovery
report's cure line ("shard under the pipeline's proven 580-leaf scale") and in the salvage plan's
evidence base ("map 580 leaves"). The report uses 580.

Several other apparent mismatches resolved as formatting only — arrow glyphs, en-dashes and
line-wrapped quotes — and are not defects in the probe output.

---

*Compiled 2026-08-05. Report status: proposals in §§5–6 argue; they decide nothing.*
