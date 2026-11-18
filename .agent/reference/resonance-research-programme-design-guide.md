# Resonance Incoming — Research-Programme Design Guide

**Provenance chain**: authored 2026-07-19 by the resonance session Ashen
Melting Forge (session prefix `3b0252`), at the end of the completed
best-in-class design-system research programme (seven phases, 111
agents, ~7.12M subagent tokens, one orchestrating seat; conserved at
resonance on its PR #271). Delivered at the shared owner's direct word
in this session ("copy the report over"), for THIS estate's named
consumer job: deep-diving the `.agent/plans` corpus, extracting
concepts and intent, and producing a new plan set — fewer, denser,
clearer — without losing anything that matters. Part VII of the guide
is written specifically for that job.

**Integration posture**: per your Practice Box flow — integration is
consolidation work, not an interrupt. The guide is self-contained (no
resonance tooling assumed; every mechanism described in portable form).
The payload below is the guide verbatim from the resonance tracked
head.

---

# Designing Long-Running, Many-Agent Research→Analyse→Produce Programmes

A self-contained design guide. Written 2026-07-19 from a completed
worked instance (a seven-phase, 111-agent, ~7M-token design-system
research programme run over two days by one orchestrating seat), and
written FOR a specific consumer: a project that must deep-dive a large
corpus of its own plans, extract the concepts and intent inside them,
and produce a new plan set that is fewer, denser, and clearer — without
losing anything that mattered. Part VII translates the whole method to
that job; everything before it is the general design. No part of this
guide depends on the source project's tooling: wherever a mechanism is
named, its portable form is described.

---

## Part I — The problem shape and the three enemies

This design applies when a programme has ALL of these properties:

- **Long-running**: too big for one sitting; it will cross pauses,
  possibly days, possibly context loss.
- **Multi-step**: later work consumes earlier work's outputs, so early
  errors compound.
- **Many-agent**: the volume demands delegation to subagents whose
  output cannot be assumed correct.
- **Research→analyse→produce**: it gathers evidence, judges it, and
  synthesises durable artefacts that others will trust and build on.

Three enemies destroy such programmes, and every structure in this
guide exists to defeat one of them:

1. **Confident garbage.** Agents produce fluent, plausible, wrong
   output: fabricated citations, overstated claims, hallucinated
   quotes, coverage claimed but not performed. Unverified agent output
   COMPOUNDS: one invented fact cited by three later artefacts becomes
   load-bearing. (The worked instance caught a verbatim "quote" whose
   key word appears nowhere at its cited source — it had survived
   collection and would have entered the final synthesis.)
2. **Drift.** Long programmes lose the plot: scope creeps inward or
   sideways, the owner loses sight of what is happening and why, spend
   diverges silently from expectation, and mid-programme owner
   direction fails to reach the working level.
3. **Loss.** Context dies — compaction, crashes, pauses, seat changes —
   and with it dies everything not yet landed somewhere durable.

The corresponding master principles:

- Against garbage: **evidence admissibility rules, instrument
  calibration before expensive use, and a dedicated adversarial
  verification phase.** Nothing load-bearing rests on one unverified
  agent's say-so.
- Against drift: **phase gates with owner-visible boundary reports
  (verdict + spend), computed budget baselines with an escalation
  trigger, and same-window encoding of every owner direction.**
- Against loss: **land work at every green boundary** (in git terms:
  committed AND pushed AND on a pull request — all three, every time),
  and treat the orchestration journal as a first-class recovery
  surface.

---

## Part II — Programme architecture: the phase skeleton

The proven skeleton is seven phases. Each exists for a reason; adapt
the content, keep the reasons.

### P0 — Consume the priors (fence the settled ground)

Read everything that already exists on the question, END TO END,
first-hand, in the orchestrator's own context. Produce a short written
note: (a) the SETTLED list — what is already known and must not be
re-researched; (b) the FRONTIER list — what is genuinely open, each
item verified against the priors' actual text (not their summaries).

Then HARDEN the frontier adversarially before trusting it: a small
panel of frame-diverse critics (2–3 agents with deliberately different
lenses) attacks the frontier list — what does it miss? what does it
claim is open that is actually settled? — plus one refuter attacking
the settled/frontier BOUNDARY itself (is the "do not re-research"
claim safe? is the trigger for exceptions executable?). In the worked
instance this small pass (~250k tokens) rejected an unexecutable
scoping rule and added nine missed evidence classes; it repaid itself
several times over in the expensive middle phase. The general lesson:
**a scope register pre-reasoned by one mind needs frame-diverse
critics BEFORE the fan-out consumes it** — the register's author is
structurally blind to its gaps.

### P1 — Frame the dimensions and calibrate the instruments

Two jobs, both gating the expensive middle:

1. **Derive the analysis dimensions** — the axes along which evidence
   will be gathered and the output graded. Derive them from the priors
   plus the hardened frontier; treat any dimension list inherited from
   the plan as HYPOTHESES to re-derive. Each dimension gets: a
   one-line statement of what it grades, its admissible evidence
   classes, and a FALSIFIABILITY note (what evidence could grade it
   down — a dimension nobody could fail is decoration).
2. **Calibrate every non-trivial instrument** before it consumes
   budget (Part III).

Also pin here: the scope declarations (unit of analysis; what is
explicitly out of scope), the sampling frames (how surfaces/items will
be selected for grading — declared BEFORE grading, so grades cannot
be cherry-picked), and any coverage registers the fan-out will scope
its work by.

### P2 — The evidence fan-out (the wide middle)

The main many-agent sweep: one stream per dimension plus the
orthogonal arms the frontier demands (in the worked instance:
practitioner-reality and version-history arms crossing all streams).
This phase takes ~40–50% of the budget. Its design rules are in
Part IV; its epistemic rules in Part V. The output is per-stream
evidence files — every claim carrying its source and date, every
stream carrying an honest coverage statement — explicitly labelled
UNVERIFIED until the verification phase runs.

### P3 — The counterfactual arms (what the sweep structurally cannot see)

The main sweep looks at what exists and succeeded. Three
counterfactual arms correct its structural blindness:

- **The failure canon**: cases that died, were abandoned, or quietly
  failed — with a SURVIVORSHIP CONTROL: any "cause of death" property
  must be checked for prevalence among the living/successful before it
  becomes an anti-criterion. (In the worked instance the control
  rejected 28 of 43 candidate anti-criteria — without it the canon
  would have shipped mostly noise.)
- **The empirical arm**: stop reading, start doing — small identical
  experiments that produce unfakeable comparative numbers (build the
  same artefact with rival systems; measure; keep a friction diary).
  The only evidence class immune to marketing.
- **The exploratory arm**: a bounded wander through adjacent territory
  that might reframe everything — under a CONFABULATION GUARD: its
  outputs are associations, never findings; each gets a second look at
  harvest with forced connections discarded VISIBLY; returning
  empty-handed is a valid outcome. A harvest with zero discards, ever,
  means the guard is not running.

### P4 — Adversarial verification (the truth phase)

Two layers, run when draft outputs exist but before synthesis
hardens (details in Part V):

1. **Claim verification**: mechanical sweeps first (they are nearly
   free), then agent verifiers re-fetching the LOAD-BEARING subset of
   claims — the ones conclusions actually rest on — checking the
   source says what the claim says.
2. **Refuter panels**: 3+ strong agents with DISTINCT lenses
   (falsifiability, structure, evidence-sufficiency worked well)
   attacking the draft dimensions, levels, and conclusions.

The phase's exit condition: every finding carries a recorded
disposition — accepted-with-cure (the cure becomes a binding synthesis
contract) or rejected-with-reasoning. Dispositions are the
orchestrator's JUDGEMENT, never compliance: rejecting a plausible
finding with reasons is a valid and necessary outcome.

### P5 — Custody synthesis (the orchestrator writes)

The synthesis is written BY THE ORCHESTRATING SEAT, in its own
context, from everything it absorbed first-hand — not delegated to a
synthesis agent. Two reasons, both proven: (a) cost — synthesis in the
main seat consumes no fan-out budget; (b) epistemics — only the seat
that read every artefact, watched every verification, and disposed
every refutation holds the whole picture; a synthesis agent would work
from compressed briefings and re-introduce exactly the errors P4
removed. The corollary is a standing obligation: **the orchestrator
must actually read the corpus as it lands** — folding agent output to
disk unread forfeits the right to synthesise it.

Synthesis obeys the P4 contract mechanically, plus these rules:

- No level/claim defined by a single instance found under an exhausted
  search budget; no grade awarded for absence-of-found-criticism.
- Uncalibrated cells are HELD OPEN and labelled, never filled by
  plausibility.
- **The backtest**: before declaring the synthesis final, run it
  against known outcomes it did not train on (Part V). Record misses
  honestly.

### P6 — Application and routing (landing the value)

Apply the synthesis to the commissioning context (gap analysis,
targets with derivation chains to real goals) and ROUTE the outputs:
what goes where, gated by whom. Routing records are records, not acts
— promotions, adoptions, and queue merges happen at their owners'
moments. End with the programme write-up (Part VI §The write-up).

### The phase contract (all phases)

Every phase ends at a stop-point with standalone value: if the
programme halted there, what exists is landed, coherent, and useful.
Every boundary produces an owner-visible report: VERDICT (what was
established), SPEND (against the baseline), and what launches next
with its ETA. The owner can halt at any boundary; steering decisions
are presented as concise option cards with a recommendation, never as
open questions.

### The plan document (decision-completeness for a cold start)

The programme plan must let a cold executor begin without questions.
Its required sections: the end goal (one falsifiable paragraph); the
consumed-inputs slot (filled before activation); per-phase todos with
ACCEPTANCE CRITERIA and proof class (artefact / witnessed / attested);
the execution contract (safety rules, evidence rules, orchestration
expectations, boundary protocol); budget order-of-magnitude WITH
per-phase baseline shares (making the escalation guard computable);
non-goals; risks with mitigations; and a first-principles clause
listing what the executor must RE-DERIVE rather than trust (dimension
lists, tool call shapes, register validity). Have the plan reviewed
before activation by 2–3 reviewers with disjoint lenses
(proportionality; domain truth; artefact-contract completeness) — in
the worked instance the three returned fully disjoint defect classes.

---

## Part III — Instruments and calibration

**The rule: no expensive fan-out consumes an uncalibrated
instrument.** An instrument is anything that converts raw material
into judgements: an extraction schema, a judge panel, a grading
protocol, a validator.

### The mutation probe (the core calibration pattern)

1. PLANT a fixture with a known defect (and keep a known-good control).
2. Run the REAL instrument on it — blind: the instrument must not know
   which is which, must not be told what to find, and the fixture must
   carry no self-describing labels (the worked instance had to strip
   captions from its own fixtures after noticing they leaked the
   answer).
3. REQUIRE discrimination: the defect graded down, the control passing.
   A rubber-stamp BLOCKS the phase the instrument was built for.
4. The STRONG pass is the instrument finding true things BEYOND the
   plant — that proves resolution, not just detection. (The worked
   instance's judge panel caught a real unplanned defect in the
   control fixture; that catch was worth more than the planted test.)
5. Where a mechanical ground truth exists, verify it FIRST and then
   test whether the judge layer reproduces it blind (frame checksums
   proved motion/stillness before any judge saw the frames).

Calibration costs ~1–3% of what it protects. It is never optional for
instruments whose output will be trusted at scale.

### Instrument honesty rules

- **Declared-context grading**: grade behaviour against what the
  subject DECLARES, not against a universal ideal (a surface that
  deliberately doesn't support a mode has not "failed" the mode; a
  minimal aesthetic is a posture, not an absence). Record observed
  behaviour; judge fidelity-to-declared-intent.
- **State constancy**: when comparing two captures/extracts, every
  variable except the one under test must be held constant, or the
  pair is inadmissible for that comparison.
- **Rung labelling**: machine judgement is a distinct, lower-confidence
  rung than structured human judgement. Label it everywhere; flag the
  irreducibly-judgemental calls for human spot-verification; never let
  a machine-rung claim borrow human-rung language.
- **Instrument limits recorded at the artefact**: when an instrument
  cannot answer a question (a rest-state capture cannot show
  interaction states; a text fetch cannot read a client-rendered app),
  the record says so at the point of use, and the needed instrument
  evolution is NAMED. Honest not-observable beats plausible grading,
  every time.

---

## Part IV — Fleet mechanics

### Pricing (measure, then re-price)

Rules of thumb from the worked instance (re-price from your own
harness's actuals after wave one — that is the real rule):

| Agent kind                                           | All-in cost (tokens)                 |
| ---------------------------------------------------- | ------------------------------------ |
| Web-research stream (search+fetch heavy)             | 60–100k                              |
| Full-document critic/refuter (strong model)          | ~80k                                 |
| Image/vision judge                                   | ~42k each; escalations ×1.4          |
| Build/experiment agent (installs, runs, diarises)    | 100–130k                             |
| Mechanical sweeps (HTTP checks, greps, fold scripts) | ~0 (no agents)                       |
| Custody synthesis                                    | main-seat context; no fan-out budget |

Two hard-won corollaries: image-heavy phases cost 3–5× text phases of
equal agent count (misjudged twice in the worked instance before the
rule was priced); and shared session caps on external calls (search
APIs) are real — design streams to degrade gracefully and DISCLOSE
when a cap bites mid-pass.

### Budget governance

Give every phase a baseline share of the total envelope at plan time.
The guard: any phase wanting >2× its share triggers an owner card
BEFORE proceeding. When an estimate misses, the miss goes to the owner
AS a card with the miss named — never silently absorbed. Present
options with a recommendation (extend / trim scope with named costs /
stop at the standing stop-point).

### Brief design (the decision-complete unit)

Every agent brief contains: role and single purpose; the exact
material to read (paths/URLs); the evidence rules (below); the output
schema; honesty requirements; and nothing the agent must ask about.
Rules that earned their place:

- **Briefs are hypotheses**: a brief's factual premises (package
  names, URLs, "the docs say") get verified by the agent, and agents
  are told to correct the brief when reality disagrees (a builder
  caught a renamed package the brief asserted; the correction was
  data).
- **Schemas shallow**: deep nested schemas kill agents on retry
  (schema-weight deaths). Arrays of flat objects with string fields;
  prose where prose serves.
- **Every schema carries a `coverage_notes` field and the brief
  demands an honest denominator**: what was NOT covered and why. An
  empty-classes result must be readable as instrument limit vs true
  absence.
- **Verifiability by construction**: claims must carry the URL/location
  ACTUALLY fetched this session plus a date; verbatim quotes wherever
  the claim is textual; "never cite from memory — if you did not fetch
  it this session, it is not evidence."
- **Self-identifying outputs**: agents echo their own id/lens into the
  schema; parallel results are matched by content, never by index
  (completion order is not submission order).

### Topology

- **Pipeline over barrier**: items flow through stages independently;
  a barrier (wait-for-all) is justified only by genuine cross-item
  dependency — deduplication before expensive downstream work, or a
  control that needs ALL finder output (the survivorship control is
  the canonical barrier).
- **Diverse-lens panels over redundant panels**: three refuters with
  different lenses find disjoint defect classes; three identical
  refuters find the same ones thrice.
- **Escalation tiers**: a cheaper judge per item with a strong-model
  tiebreak on disagreement or self-flagged hard calls. Make judges
  self-flag ("escalate_recommended") — it works.
- **Calibrate with the tiers you will actually use at scale**, so
  calibration prices the real instrument.

### Folding (agent output → durable artefacts)

Fold mechanically with scripts, not by retyping (retyping is a
corruption vector). Two lessons: build ONE shared
agent-prose→markdown/text sanitiser before the first fold (bare URLs,
pseudo-headings, stray markup — five lint rounds died to this in the
worked instance); and the orchestration journal (per-agent results on
disk) is the recovery surface — verify it persists, know how to
re-fold from it, and never assume a cached result is non-empty
without reading it.

---

## Part V — Truth discipline

### Collect-then-verify (the two-phase split)

Collect broadly under evidence rules; then VERIFY the load-bearing
subset — the claims conclusions actually rest on — by re-fetching
sources and quote-checking. Verdict vocabulary that worked: VERIFIED
(quote found) / PARTIALLY-SUPPORTED (direction right, strength
overstated — quote what IS there) / SOURCE-MISMATCH (source says
otherwise — quote it) / SOURCE-DEAD / UNVERIFIABLE. Never grade by
plausibility. Run the free mechanical sweeps FIRST (link liveness,
existence checks, greps): in the worked instance a zero-agent HTTP
sweep triaged 374 citations and found the interesting 6 before any
verifier spent a token.

### Dispositions (the orchestrator's judgement layer)

Every adversarial finding — critic, refuter, verifier — is INPUT TO
JUDGE, not instruction. The disposition record (accept-with-cure /
reject-with-reasoning, per finding) is the phase's real output: the
accepts become a binding synthesis contract; the rejects document why
plausible attacks were wrong. A programme that only ever accepts is in
a compliance loop; a programme that cannot show its rejects has no
judgement layer.

### The backtest (validate the output against known outcomes)

Before the synthesis is final, run it against ground truth it was not
built from. The worked instance graded DEAD systems posthumously with
its draft rubric and discovered its content dimensions could not
separate the dead from the living — only the continuity criteria
added late could. That finding restructured the conclusions. The
pattern generalises: find outcomes you already know (deaths,
successes, past decisions) and ask whether your instrument
retrodicts them; record the misses in the final artefact.

### Quality lives in the refusals

The strongest predictor of output trustworthiness in the worked
instance was what the programme DECLINED to claim: finders rejecting
famous candidates that live checks showed healthy; judges answering
not-observable rather than guessing; the exploratory arm discarding
its forced associations visibly; empty results honoured as findings.
Design every schema and brief so refusal is expressible, cheap, and
credited — an agent that cannot say "I could not see this" will
pretend it saw something.

---

## Part VI — Flow control, the owner interface, and safety

### Boundary reports

Lead with the outward milestone and when it fires ("the fan-out
launches after this twenty-minute calibration gate"), not with the
internals of the preparatory step — a programme front-loading
instrument work READS as navel-gazing from outside unless the report
says otherwise (an owner correction earned this rule). Then: verdict,
spend vs baseline, what launches next. Cards for genuine steering
decisions only, always with a recommended option.

### Owner words are amendments

Any mid-programme owner direction — emphasis, constraint, addition —
is encoded into the plan as a DATED amendment in the same working
window it was spoken, and honoured programme-wide (a standing
constraint like "do not touch X" gets checked at every routing that
could brush X, and outputs record "held pending release" rather than
silently dropping the routing).

### Work safety

Safe = committed AND pushed AND on a pull request — all three, at
every green boundary. Land phase artefacts incrementally (the
synthesis keystone lands before the next artefact is begun). Before
every commit, review the staged set by name — long programmes share
working trees with other flows more often than expected. At any pause
(including deliberate cold pauses): everything uncommitted lands
first; in-flight fan-outs may continue (their journals persist), with
the fold explicitly deferred and its recovery pointers written down.

### The write-up (the programme's last obligation)

Conserve four complementary layers, in this order of durability:

1. **The corpus itself** — the phase artefacts, already landed.
2. **The programme record** — the process narrative a successor needs:
   method rules that transferred, the priced cost model, tooling
   knowledge, the first-person experience layer (including the misses
   and corrections), and an explicit do-differently list.
3. **The distilled rules** — the few cross-session durable lessons,
   extracted to wherever the estate keeps standing guidance.
4. **The continuity map** — where everything is, what is unresolved,
   what the owner's queued moments are, and the cold pickup path.

The write-up cannot be delegated: the experience layer exists only in
the orchestrator's context, and a subagent given a briefing about it
would reproduce the briefing, not the experience.

---

## Part VII — Worked translation: consolidating a plan corpus

The consumer project: many plans; extract concepts and intent; produce
NEW plans — fewer, denser, clearer — losing nothing that matters.
This is a research→analyse→produce programme where the corpus is
internal. Five structural differences change the design before the
phase mapping starts:

1. **The corpus is closed and owned.** No web volatility; the
   liveness-sweep analogue is an INTERNAL REALITY SWEEP: does each
   plan's described state match the repo/tracker/estate it points at?
   (Plans rot against reality exactly as citations rot against the
   web — mechanically checkable and nearly free.)
2. **Conservation, not discovery, is the acceptance bar.** The
   headline risk is silent loss of intent, constraints, or
   commitments during the merge. The conservation ledger (below) is
   the programme's central artefact, and the old corpus is FROZEN
   read-only before any new writing begins.
3. **A living oracle exists.** The owner holds ground truth about
   intent that no document carries. Unlike web research, you can ASK —
   so the design adds an owner-question queue as a first-class
   evidence class: cheap, authoritative, batched at boundaries
   (never one-at-a-time interruptions), with each answer recorded as
   a dated evidence item.
4. **The output supersedes the input.** The end is destructive
   (old plans retire). This demands: byte-frozen archive of the old
   corpus, the conservation ledger proving the mapping, and an
   explicit owner-gated cutover moment — reversible until it isn't,
   and the irreversible step named as such.
5. **New plans are designed artefacts.** Writing them is P5 design
   work that needs its OWN refuter pass (attack the new plans for
   lost intent, invented intent, merged-but-actually-distinct
   concepts, and unclear ownership/sequencing).

### The phase mapping

**P0 — Consume and fence.** Inventory the plan corpus mechanically
(count, dates, staleness signals, cross-references, ownership).
Consume any prior consolidation attempts and rulings about the plan
estate. Frontier = what extraction must recover; settled = decisions
already ratified elsewhere. Harden with 2–3 frame-diverse critics:
what would THIS register miss (implicit intent? commitments to
external parties? constraints living only in plan comments?), plus a
refuter on the corpus boundary itself (are there plan-like artefacts
outside the plans directory — decision records, issues, READMEs —
that carry plan-intent? In most estates: yes, and missing them is the
classic silent loss).

**P1 — Taxonomy and instrument calibration.** Derive the extraction
taxonomy — the concept types the extractor must separate. A proven
starting set, each with a falsifiability note:

- GOAL (the end-state the plan wants) vs APPROACH (how it currently
  intends to get there) — never merge these; approaches are
  replaceable, goals are conserved.
- COMMITMENT (a promise with an external party or a dependent) —
  the class whose silent loss does real-world damage.
- CONSTRAINT (a binding rule the plan operates under) and its source.
- OPEN DECISION (named but unresolved) with its trigger.
- STATE CLAIM (what the plan says is true of the world — the class
  the reality sweep checks).
- INTENT, stated vs INFERRED — the extractor must label which; every
  extraction carries a verbatim anchor (quote + location) so
  verification is possible.

Calibrate the extractor by mutation probe: run it on one plan the
orchestrator knows deeply; require it to find the known concepts,
NOT hallucinate extras, and catch a PLANTED contradiction and a
planted stale state-claim. A rubber-stamp blocks the fan-out. Pin the
sampling/coverage frame: every plan in the frozen inventory gets
extracted; the register from P0 adds the out-of-directory
plan-intent carriers.

**P2 — The extraction fan-out.** One extractor per plan (or per plan
cluster), schema per the taxonomy, coverage notes mandatory
("sections I could not classify" is load-bearing output). Add two
cross-cutting arms: a CROSS-REFERENCE arm (who depends on whom; which
plans silently contradict each other — pairwise contradiction-hunting
over the extracted claims is cheap at concept level) and the REALITY
SWEEP (every STATE CLAIM checked against the estate; mechanical
first, agent judgement only for the ambiguous residue). Fold into
per-plan extraction files plus a corpus-wide concept index.

**P3 — Counterfactuals.**

- Failure canon = the corpus's own dead plans: abandoned, superseded,
  perpetually-deferred. Extract WHY (stated vs observed), with the
  survivorship control: a "bad-plan property" found in dead plans must
  be checked against plans that WORKED before it becomes an
  anti-pattern for the new set. (Expect most candidates to fail the
  control — "too long", "too ambitious" are usually prevalent among
  successes too; the discriminating properties are more often
  structural: no owner, no trigger, no acceptance bar, state claims
  that rotted unwatched.)
- Empirical arm = the TRANSFER TEST, run EARLY as a baseline: give a
  fresh agent ONLY the current plans and pose real decisions the
  project actually faces; grade the answers against known intent.
  This measures the current corpus's guidance-transfer power — the
  number the new corpus must beat.
- Exploratory arm (optional, confabulation-guarded): wander adjacent
  planning traditions or the corpus's own history for reframing
  seeds; associations only.

**P4 — Verify and refute.**

- Verify extractions: per-plan spot verification that anchors are
  real quotes and classifications honest; every load-bearing
  extraction (anything that will drive a merge decision) gets its
  anchor re-read against the frozen source.
- Batch the owner-question queue: every INFERRED intent that matters,
  every contradiction between plans, every ambiguous conservation
  call — one card session, answers recorded as evidence.
- Refute the DRAFT STRUCTURE of the new plan set before writing it:
  propose the new shape (which plans exist, what each owns), then
  panel it — overlaps, gaps, concepts with no home, homes with no
  concept, sequencing breaks.

**P5 — Synthesis: write the new plans (custody work).**

- The conservation ledger is written ALONGSIDE the new plans, not
  after: every extracted concept maps to exactly one of
  {CARRIED (where), MERGED (into what, with provenance),
  SUPERSEDED (by what ruling, dated), RETIRED (why, by whose word)}.
  The un-mapped set must be EMPTY at close.
- The quality bar, falsifiably: FEWER — a count with a reason per
  surviving plan (each plan states why it exists as a separate plan);
  DENSER — each fact/decision lives in exactly one home and is cited
  elsewhere, never restated (restatement is where corpora rot);
  CLEARER — the transfer test, re-run against the NEW plans with
  fresh agents and comparable questions, must beat the P3 baseline.
- The backtest: replay a sample of KNOWN historical decisions —
  could a reader of only the new plans have reconstructed the intent
  that actually drove them? Misses are conservation failures; fix or
  record.
- Refuter pass on the written plans (the P4 structure panel's lenses,
  now against real text), dispositions recorded.

**P6 — Cutover and routing.** The conservation ledger and the frozen
archive land together; the owner walks the ledger (this is the
genuine owner moment — schedule it as one sitting with the ledger
designed for walkability: per-plan dispositions, exceptions
highlighted); supersession is executed only at the owner's word, with
the old corpus archived read-only, never deleted. The programme
write-up follows (Part VI).

### Sizing sketch (for a corpus of ~20–60 plans)

P0 inventory + 3 critics: ~0.3M tokens. P1 taxonomy in-seat +
calibration probe: ~0.2M. P2: one extractor per plan at ~40–80k each
(plans are smaller than websites) + cross-reference + reality arms:
~1.5–3M. P3 canon + baseline transfer test: ~0.5M. P4 verification +
owner batch + structure refuters: ~0.8M. P5 custody synthesis +
transfer re-test + plan refuters: ~0.5M agents (writing is in-seat).
P6 in-seat. Total order-of-magnitude 4–6M with the same >2× per-phase
guard — and re-price everything after wave one from your harness's
actuals.

---

## Part VIII — Checklists

### Programme design (before activation)

- [ ] End goal falsifiable; non-goals explicit; risks with mitigations.
- [ ] Phases with acceptance criteria + proof class; stop-point value
      per phase; budget baseline shares; escalation guard defined.
- [ ] Execution contract: evidence rules, safety rules, boundary
      protocol, re-derivation obligations for the executor.
- [ ] Plan reviewed by 2–3 disjoint-lens reviewers; verdicts folded.
- [ ] Priors named; consumed-inputs slot filled before activation.

### Per phase (at open / at close)

- [ ] Open: instrument calibrated (mutation probe passed, blind,
      strong-pass preferred); sampling frame declared; briefs
      decision-complete; schemas shallow with coverage_notes.
- [ ] Close: artefacts landed (committed+pushed+PR); boundary report
      (outward milestone first, verdict, spend vs baseline); cards for
      real decisions only; owner words encoded as dated amendments.

### Every brief

- [ ] Single purpose; exact inputs; evidence rules (fetched-this-
      session + date + verbatim anchors; no memory citations).
- [ ] Honest denominator demanded; refusal expressible and credited.
- [ ] Premises marked as verifiable hypotheses.

### Verification phase

- [ ] Mechanical sweeps run first (liveness/reality/existence).
- [ ] Load-bearing subset identified and re-fetched; verdict
      vocabulary used; quotes captured.
- [ ] Refuter panel with ≥3 distinct lenses; every finding disposed
      accept-with-cure or reject-with-reasoning; rejects exist.

### Synthesis

- [ ] Written in-seat from first-hand absorption; P4 contract honoured
      mechanically; uncalibrated cells held open; sole-instance and
      absence-based grades banned.
- [ ] Backtest run against known outcomes; misses recorded.
- [ ] (Consolidation) conservation ledger complete; un-mapped set
      empty; transfer re-test beats baseline; old corpus frozen.

### Programme close

- [ ] Four-layer write-up: corpus / programme record / distilled
      rules / continuity map. All landed. Unresolved items NAMED.

---

## Provenance

Distilled from a completed programme (2026-07-18/19): seven phases,
111 agents across eight fleet waves, ~7.12M subagent tokens, zero
agent errors, one orchestrating seat, all boundaries owner-reported,
outputs landed across fifteen gate-checked pushes on one pull
request. The worked instance's own record and corpus are the fuller
narrative; this guide carries everything a separate project needs to
run the method cold.

---

## Estate-fit note (appended after reading this estate's plan indexes, 2026-07-19)

Written by the delivering seat after reading `.agent/plans/README.md`,
`high-level-plan.md`, and the head of
`product-development-governance/vision-strategy-and-plan-estate.plan.md`,
plus a mechanical census. Three things the executing seat here should
know before applying Part VII:

1. **The programme already has a controlling specification in this
   estate**: the `estate-restructure` body (Body 3) of
   `vision-strategy-and-plan-estate.plan.md` — "read every plan, extract
   permanent documentation, archive complete plans, extract-and-archive
   completed work from partial plans, rewrite survivors to a common
   standard, pull scattered concepts into new plans, delete with
   disposition", with new plan boundaries derived FROM the estate's strategy
   layer (in OCE, `docs/strategy/`).
   Its named prerequisites (the plan standard = `plan-node-schema.v0.md`
   under ADR-200, and a fresh deep survey) map directly onto this
   guide's P1 (taxonomy + instrument calibration) and P0 (inventory).
   The strategy's choice IDs give the extraction taxonomy its derivation
   spine: "every plan must be justifiable by a strategic choice" is the
   read-upward traceability test — use it as an extraction FIELD.
2. **Where Body 3's mechanism clauses differ from this guide, note the
   evidence asymmetry before choosing**: this guide's mechanisms are
   PROVEN IN EXECUTION — the conservation-ledger shape, the
   mutation-probed instruments, the adversarial disposition discipline,
   and the fleet method all just ran end-to-end at the source estate
   (and the source estate's own earlier plan-corpus re-founding ran the
   frozen-archive + conservation-ledger + adversarial-overturn shape to
   completion with zero overturns). Body 3's mechanism clauses — e.g.
   "supersession mappings per the consolidation discipline, never a
   standalone ledger" — are AUTHORED BUT NOT YET EXECUTED here: Body 3
   has never run. The shared owner's direction on this asymmetry
   (2026-07-19): the worked mechanisms carry the weight. Practical
   posture for the executing seat: default to the proven mechanism
   where the two conflict, treat Body 3's specific mechanism clauses as
   hypotheses the programme validates or amends, and record each
   deviation as a dated note against Body 3 (or surface it as one owner
   card if the deviation is structural). The conservation PROPERTY both
   formulations want is identical — every extracted concept mapped,
   the un-mapped set empty, adversarially audited — so the cheapest
   honest path may be: run the proven ledger as the working instrument,
   and emit the in-place supersession mappings FROM it as a projection,
   satisfying both.
3. **Sizing, revised against the real census**: the corpus is 637
   markdown files (~11.5MB) across 25 collections — several times
   Part VII's 20–60-plan sketch, though a substantial fraction are
   lifecycle indexes and templates rather than plan bodies. Re-derive
   the extraction unit (probably per-collection clusters with per-file
   anchors, not per-file agents), re-price after the first collection,
   and let the collection READMEs — which are genuine pre-aggregated
   indexes — serve as P0 accelerants that the extraction VERIFIES
   rather than trusts.
