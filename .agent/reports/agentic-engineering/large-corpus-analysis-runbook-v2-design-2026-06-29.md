# Large-corpus analysis — v2 design (proving-run-driven refinement)

*Author: Wren stirs Rainbow (claude / claude-opus-4-8[1m] / 093458) — 2026-06-29.*
*Status: design capture. Supersedes the method section (§5/§8) of the v1 design report*
*[`large-corpus-analysis-runbook-design-2026-06-29.md`](./large-corpus-analysis-runbook-design-2026-06-29.md)*
*on the points below; the v1 report stays authoritative for the unchanged spine (three*
*lenses, time-contiguous token-balanced windows, the asymmetric cost doctrine). Grounded*
*in the first Discovery proving run (substance + corrected numbers:*
*[`../../research/agentic-engineering/continuity-memory-and-knowledge-flow/napkin-discovery-pass-1-2026-06-29.md`](../../research/agentic-engineering/continuity-memory-and-knowledge-flow/napkin-discovery-pass-1-2026-06-29.md)).*
*Produced via a 4-designer + 1-critic design panel; the critic's First-Question pass and*
*this author's first-hand assessment shaped the spine-vs-elaboration cut below. The*
*reusable form of that panel is*
*[`agentic-design-panel-protocol-2026-06-29.md`](./agentic-design-panel-protocol-2026-06-29.md).*

## Why v2 exists — the load-bearing meta-result

The proving run worked (sound machinery, functioning apophenia gate) but its
**self-reported recall was wrong**: the meta agent claimed 13/18 = 0.72 while its own
per-baseline judgments summed to 10 (lenient) / 5 (strict). The cause is general, not
local: **an LLM was asked to both *judge* (per-item, qualitative — which it did
reliably) and *aggregate* (count, divide, threshold — which it got wrong).** LLMs judge
atomically well and aggregate faithfully badly. That single observation is the spine of
v2.

## The v2 design principle

> **LLMs judge atomically; deterministic code counts, thresholds, and routes.**
> An agent emits only local, per-item, typed qualitative judgments. Every count, sum,
> fraction, threshold comparison, deduplication, and routing decision is computed in
> code from those judgments. No agent is ever asked to produce a number that is a
> function of more than one item it is also judging.

This is the direct operationalisation of `principles.md` "generated state beats
authored state" applied to the agentic pipeline, and the "deterministic tests" leg of
§Agentic Quality. The v1 `keptConsistency` JS tripwire already proved the pattern (a JS
recompute over atomic kept-flags that passed); v2 generalises it.

## The v2 changes (the spine that survived the critic)

1. **Deterministic aggregation layer (core).** The LLM emits atomic fields only:
   per-baseline `verdict ∈ {subsumes, refines, equal, partial, missed}` + matched id;
   the four adversary booleans + importance; per-candidate citations. **Code** computes
   `reFoundStrict`/`reFoundLoose`, the recall fraction, threshold pass, the
   keep/kill/reroute verdict (the boolean conjunction + the single guarded reroute),
   grounding/window counts, and the cost estimate. **The fix is the unit test:** feed
   10 re-found verdicts, assert `recallStrict` counts 5 — the one test that would have
   caught the v1 bug. A deterministic function without that test is not the fix.
   Name the functions **query-shaped** (`countReFoundEdges`, `distinctGroundingWindows`)
   so a future memory-event-graph swap (Lens 4) is additive and free.

2. **Stratified recall over a hand-pinned, version-controlled typed fixture.** The run
   author pins each baseline's `population ∈ {emergent, single-window}` **once**, as
   reviewed data over the ~16 hand-reviewable baselines, in
   `fixtures/napkin-discovery-recall-baseline.v1.json` beside the runbook (Agentic
   Quality: "evaluation definitions are version-controlled with the artefact they
   grade"). **Headline recall = strict re-found ∩ emergent / total(emergent)**;
   single-window misses are reported separately as **out-of-remit → route to
   Directed/Surprises**, never counted as Discovery misses. (The critic correctly killed
   the panel's "blind LLM typing engine + window-span derivation" — it manufactured the
   circularity it then defended against. Hand-pinned reviewed data is simpler and
   honest, because the author already knows the populations.)

3. **Adversary — full Tier 0+1+2 ensemble (OWNER-CHOSEN, 2026-06-29).** A false *keep*
   is the asymmetric, irreversible error (apophenia); a kill self-corrects. So rigour
   tiers by where that harm lives, gated deterministically in code:
   - **Tier 0 — kill is final on one adversary.** A candidate failing any of the four
     tests is killed without an ensemble (kills are cheap, self-correcting; a
     base-rate-only fail at high importance still reroutes to Surprises).
   - **Tier 1 — clean keep gets one independent confirmer.** A decisive all-four pass
     gets a second adversary running the full four-test schema, blind to the first.
     This also fixes the C06 availability single-point-of-failure (with two voters, one
     unadjudicated voter no longer strands the candidate). A lone dissent demotes to
     Tier 2, never an outright kill.
   - **Tier 2 — borderline keep gets the 3-lens diverse ensemble.** Borderline iff any
     test passed only marginally, OR a Tier-1 dissent, OR it is the base-rate-only
     reroute candidate. Three adversaries, each a *different* lens (correctness/grounding;
     base-rate statistician; null-hypothesis/reproduction) — diverse, not three identical
     refuters — so the votes are uncorrelated.
   - **Quorum (code, not LLM):** the LLMs vote atomically; code counts. Tier 1 keep iff
     both confirm. Tier 2 keep iff refuters < majority of *adjudicated* voters; an
     unadjudicated voter is excluded from the denominator (availability failure cannot
     flip a keep). If fewer than 2 voters adjudicate, the candidate is **held for human
     review**, never auto-kept.
   - **Plus, independent of the tier: schema robustness + repair-retry** for the
     validator — the cheapest cure for the C06 availability defect (19/20 passed the
     identical schema; the complex one stranded), and the right fix for the *cause*
     (brittle schema for complex candidates) rather than only the symptom.

   *Recorded reasoning:* the critic argued Tiers 0+1 are the principled minimum and
   Tier 2 is YAGNI on an as-yet-unobserved false-keep. The owner chose the full
   ensemble — erring toward maximum rigour on the irreversible error. Both are recorded
   so a future session understands the choice is a deliberate cost-for-rigour trade, not
   an oversight; if cost pressure ever bites, Tiers 0+1 is the pre-identified fallback.

4. **Real-world-signal close** (the leg the panel missed; `principles.md` §Agentic
   Quality "no internal assurance is complete until it closes against a real-world
   signal — grading only against expectations we authored measures our own
   assumptions"). The recall baseline is *our authored expectation*. The real-world
   signal is on disk: several v1 kept patterns already graduated to pattern/rule files.
   v2 makes "does this kept pattern map to a graduated home?" a **first-class
   deterministic corroboration input**, not a footnote.

5. **One deterministic pre-spend cost estimate** over the whole pipeline (including the
   tiered adversary fan-out), effort tiered as **data** (map cheap/Sonnet; reduce /
   validate / meta Opus) — never inherited from the session. Code compares the estimate
   to a ceiling and gates before the spend. (The v1 overspend — ~4.4M vs the 1.3M
   estimate, rate-limit-truncated — was effort omitted → xhigh inherited on all 14 map
   agents. Cost is arithmetic over a known partition and an effort table.)

6. **Human-review run-record** (curator-passes shape) presenting kept / unadjudicated /
   held-for-review / out-of-remit / discounted candidates + the stratified recall — the
   human-review leg of the assurance case, where the irreversible false-keep harm is
   finally checked.

7. **Two upstream robustness adds:** a cheap **map-coverage check** (did any window
   silently under-extract across the spanning categories? — the upstream analogue of the
   C06 stranded voter), and an **absence-probe validation shape** distinct from
   present-pattern validation (an absence claim's falsifier differs — you must show X is
   genuinely absent, not merely unsampled).

8. **Referential-integrity tripwires only** (not the panel's generalised
   every-aggregate cross-check, which is vacuous once the LLM emits no aggregates):
   every `matchedCandidateId` resolves to a real candidate; every adjudicated candidate
   has its booleans; window file-coverage is exact.

## What v2 is NOT (First Question / YAGNI — explicitly excluded)

- **No union-find dedup engine** — single-consumer, N<20 candidates in one reduce
  context; the reduce agent dedups inline and code validates the merges.
- **No generalised every-aggregate consistency tripwire** — contradicts the
  delete-the-dead-copy rule (there is no LLM aggregate left to cross-check).
- **No blind-typing engine + window-span remit derivation** — manufactures the
  circularity it defends against; hand-pinned reviewed populations are simpler.
- **No fifth terminal state** — "held for human review" collapses into the
  unadjudicated terminal state.
- **No memory event-graph build, and no migration spec** — see Lens 4.

## Lens 4 — would the system changing dissolve the problem?

A typed PDR-119 / ADR-200 memory-event-graph **would** dissolve exactly two problems —
the recall and grounding *counts* become deterministic edge-counts — but those are
*already* dissolved by the deterministic aggregation layer (change 1) **without** a
graph; and it does **not** dissolve the method's actual value (emergence detection and
apophenia adjudication stay irreducibly LLM judgment regardless of substrate). PDR-119
gates on its own unrun napkin pilot. **Verdict: prose now; query-shaped JS names so the
eventual graph swap is additive and free; defer the graph to PDR-119's independent
trigger.** Building the graph to serve this runbook would invert PDR-119's own warrant
(a cowpath in reverse).

## Graduation candidate (PDR-shaped, surfaced — not authored here)

The **"LLMs judge atomically; deterministic code aggregates"** principle is general
agentic-engineering doctrine (applies to any fan-out → validate → synthesise pipeline,
far beyond this runbook). It is PDR-shaped (Practice substance, cross-repo). Captured in
`pending-graduations.md`; deserves its own graduation pass + quorum, not a drive-by
write.

## How v2 proves itself

TDD per `principles.md` §Testing: unit tests on the recall counter and the verdict
predicate against fixtures with known judgments (the cheapest, highest-value fix — the
v1 bug dies to one unit test); the rerun on the napkin corpus; and the real-world-signal
close. Pass → graduate the runbook (PDR-120 reference runbook + adopting PDR per
PDR-035). Defect → name and route. No holding state.

## Generalisation beyond the timeseries (where these lessons transfer)

The napkin run is **one instance**. The method is an invariant spine parameterised by
**two corpus-shaped choices** — naming them is how the lessons transfer to a
non-timeseries corpus such as the **planning estate**.

**Invariant spine (transfers to any oversized corpus):** the dual-regime combination
(first-hand detailed read of a *high-value subset* + workflow-compressed remainder,
integrated at a seam); LLM-judges-atomically / code-aggregates; the apophenia gate (four
conjunctive tests); within-remit calibration against a known baseline; the
cheap-generation / expensive-validation cost asymmetry (believing-false is the
irreversible harm); and the three lenses (Discovery / Surprises / Directed). None of
these is timeseries-specific.

**Corpus-shaped choice 1 — the partition axis.** A timeseries partitions by **time**
(contiguous windows) and the dual-regime "head" weights by **recency**. For a
non-recency corpus, `w(x)` derives from the **objective**, not the clock — leverage,
connectivity, activity, or risk. The planning estate's "head" is the **high-leverage /
active / most-connected** plans the reviewer reads first-hand; the "tail" (paused /
future / archived) is workflow-compressed. The design report §4's "the weighting kernel
is a function of the objective" is exactly this generalisation.

**Corpus-shaped choice 2 — the negative-space expectation source.** Timeseries absence
is **temporal** (a theme present early, gone later). Any corpus also supports
**structural** absence (declared purpose vs actual contents). A **graph-structured**
corpus adds the highest-value arm: **relational absence — missing edges** (an orphan
plan with no goal edge; an unserved goal with no plan; an undeclared dependency; a
decision reflected in no plan).

**The planning estate is the graph case (ADR-200, verified first-hand).** The estate is
being rewritten as a **living idea-graph** — ideas are nodes, typed edges, JSON-validated,
documents as co-equal embodiment via frontmatter edges. So for the planning-estate review:
(1) partition by **subgraph / neighbourhood**, not time; (2) negative-space becomes
**deterministic graph queries** (orphan-plan, unserved-goal, undeclared-dependency
detection) — the single most valuable lens (the design's "structural blind spot", §6)
becomes *cheap and exact*. **This is the Lens-4 dissolution that did NOT apply to napkins
(no graph) but DOES apply here, because the graph is being built.** The convergence is
the deepest finding: the corpus-analysis method's graph-substrate *future* IS ADR-200's
*deliverable* — the planning-estate review is where the method and the idea-graph meet,
and the method becomes a renderer over that graph. Caveat (do not over-claim): the
estate graph is WS2-next, not yet queryable, so **prose-now / graph-later applies to the
planning estate too** — but here the graph is already the plan, so the two efforts are
convergent rather than independent.

## Build-readiness refinements (cold-reader verification + owner task 3)

A cold-reader pass over the artefacts (three fresh agents, artefact-only) confirmed the
strategic record is self-contained but the **build was not yet startable** — it depends
on contracts that exist only as prose. These refinements close that, and pin owner
task 3 (agent-tools home):

- **The contract is a first-class agent-tools artefact, sequenced FIRST.** The
  atomic-judgment schemas (LEAF / VERDICT / BASELINE / META) **and** the deterministic
  aggregation **and** the cost-model live in the **`agent-tools` workspace as proper
  TypeScript under all repo gates** (ESLint / type-check / vitest-TDD / Result /
  schema-first) — owner task 3. The Workflow script is a thin orchestrator whose
  conformance to the schema is tested (the sandbox can't import repo code, so the schema
  is the shared contract, generated/mirrored into the script and conformance-checked).
  The aggregation module's unit tests cannot be written before this schema is pinned —
  so it is the **first** build step, ahead of the aggregation module.
- **Per-test confidence (forced by the full Tier 0+1+2 choice).** "Borderline" cannot be
  read off a boolean. Each adversary test emits `{pass, confidence ∈ low|med|high}`;
  **borderline = any kept-candidate test passing at low/med confidence** (deterministic,
  in the aggregation module). Without this, Tier 2 has no trigger.
- **The within-remit threshold is set at v2 calibration, with rationale.** It governs
  the graduate gate; the v1 0.85 is re-evaluated for the smaller `strict ∩ emergent /
  total(emergent)` denominator and owner-confirmed. The denominator: **18** baselines
  enumerated (the original "~16" was a floor), of which the **emergent subset** (pinned
  in the typed fixture) is the within-remit denominator.
- **Cost table is data in the agent-tools cost-model:** per-stage token estimate ×
  per-effort multipliers, compared to an abort **ceiling** — all explicit data, never
  inherited from the session.
- **The reroute sink is the run-record.** A base-rate-only-fail + high-importance
  candidate is recorded as a **Surprises-lens candidate** (Surprises mode is not built in
  v2; the recorded queue is the sink, not a live Surprises run).
- **One terminal "unresolved → human-review" state with a reason field**
  (`retry-cap | quorum-tie`); the run-record presents the reason. "Held" and
  "unadjudicated" are the same state, not two.
- **No cross-session cache.** The Workflow journal is session-scoped; a future-session v2
  rerun runs **fresh** (cheap at the corrected effort tiering, ~1.3M not ~4.4M). The v1
  run-id cache-reuse idea is dropped as a prerequisite.
