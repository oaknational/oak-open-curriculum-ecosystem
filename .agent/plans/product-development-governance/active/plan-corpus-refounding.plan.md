---
id: plan-corpus-refounding
node_type: plan
kind: executable
name: 'Plan-corpus refounding — provably lossless intent-aligned transformation'
overview: >-
  Losslessly re-found the planning corpus around intent (destination lanes derived from the
  standing vision/strategy), with scripted mechanical layers, zero-judgement workers, placed
  judgement, recomputable state, and an auditable conservation chain — the intermediate step
  on the road to the ADR-200 intent graph.
serves_strategic_choice: FRAME-1
derives_from:
  - ../../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md
  - ../../../practice-core/decision-records/PDR-018-planning-discipline.md
  - ../../../practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md
lineage:
  serves_thread: strategy-and-plan-estate-holistic-review
  serves_stream: agentic-framework
  strategic_choice: FRAME-1
last_updated: 2026-07-15
todos:
  - id: r0a-mechanical-instrument
    content: >-
      BUILD (scripts, zero-LLM): the refounding mechanical substrate in
      agent-tools/src/refounding/ — freeze (verbatim copies + sha256 denominator + identity
      proofs), verify-freeze (standing re-hash gate), inventory (three overlapping
      deterministic nets, verbatim byte capture with per-line digests, sorted
      inventory.jsonl), tile (granularity-agnostic exact-cover arithmetic), plant-orphan
      (planted-defect discrimination proofs INCLUDING a marker-free work-bearing paraphrase
      for the sweep net), plant-challenge-canary (the P4 sealed planted-loss rows for every
      batch's challenge stream: known-dropped spec-detail plants at a declared rate, keys
      sealed by hash-commit-then-reveal — sha256 of the key set committed before the batch,
      revealed and scored after; the challenge layer's own prove-it-fires tooling per
      cross-estate review B1), sweep (archive/prompts/thread-record keyword net),
      merge-recheck (denominator re-derivation, banner-aware byte comparison), batch-status
      (recomputes, never reads run-state), claim-census (mapped status instances +
      completion-keyword lines, closed and counted). Acceptance: every detector passes its
      scripted discrimination proof (gapped/overlapped tiling fixtures, flipped frozen
      byte, synthetic arrival, planted orphans incl. the marker-free plant, AND a
      planted-loss challenge canary sealed-then-revealed end-to-end); determinism tests
      prove byte-stable output; freeze+inventory scripts may land and RUN as soon as their
      own proofs pass — not gated on the rest of R0.
    status: completed
  - id: r0b-plan-state-tool
    content: >-
      BUILD (TDD): the plan-state recomputation tool (repo-validators
      regenerate-and-compare pattern) — two-direction gate (recorded-done-but-red AND
      recorded-pending-but-green), probe kinds from the closed taxonomy, mutation-probed (a
      deliberately falsified status must go red before any green is trusted). Acceptance
      for THIS todo: fixture + mutation-proof completeness only. The full-estate
      claim-vs-derived divergence report is r1's audit-mode run (it needs the frozen
      inventory and so cannot precede the freeze).
    status: completed
  - id: r0c-registers-and-declaration
    content: >-
      AUTHOR: the consolidated owner-gate register (one Director-owned list — G0..G-Walk-C,
      duplicates merged, cutover sanction included) and the cost ledger (per-facet lines,
      tier-weighted, tokens + currency + wall-clock, fixed-vs-marginal split, Author and
      Adjudicator throughput lines, arrival-routing overhead per week of arc). Acceptance:
      the pre-run declaration exists in every billing denomination before any fleet
      dispatch; the H-series halt conditions reference the run total.
    status: completed
  - id: r1-freeze-inventory-baseline
    content: >-
      EXECUTE (S0/S1/S2 stable points): S0 atomic freeze commit (frozen copies at the
      refounding artefact root OUTSIDE the denominator + denominator + proofs; owner gates
      G1+G2 cleared first — G-ADR already ratified 2026-07-06); S1 scripted inventory + residue audit + planted-orphan
      proofs on the real corpus; S2 tiling baseline (anchored default blocks, exact-cover
      green) + the estate-wide audit-mode run (claim census -> claim-vs-derived divergence
      report). Merge-recheck re-derives the denominator at every stable point and batch
      open/close. Acceptance: recomputable proofs green at each stable point; divergence
      report published as Walk-A input.
    status: pending
    depends_on: [r0a-mechanical-instrument, r0b-plan-state-tool, r0c-registers-and-declaration]
  - id: r2-lanes-and-walk-a
    content: >-
      DERIVE + RATIFY: top-down lane seed from VISION.md + docs/strategy (streams,
      strategic choices) + PILOT-AREA evidence pass only (stratified sample, sealed
      lane-assignment canaries, 2-lens + escalation-only third; the full-estate evidence
      pass is deliberately NOT run pre-calibration) -> Walk A: owner ratifies the lane
      taxonomy (lanes minted as REGISTERED axis values with validation; non-pilot lanes at
      candidate status; holding lane included; escalation-thinning policy tables ratified so
      recurring ruling classes become one owner-ratified row each). Acceptance: lane
      registry + validation gate land in the same tranche as the taxonomy; no free-text
      lane value can enter the destination corpus; the register names the candidate-lane
      promotion mechanics (what evidence promotes candidate -> registered, carried by
      ruling batches) and the per-batch taxonomy-refit trigger (holding-share trend +
      lane-churn rate, alongside the global >20% falsifier).
    status: pending
    depends_on: [r1-freeze-inventory-baseline]
  - id: r3-pilot-batch
    content: >-
      CALIBRATE (one small self-contained area end-to-end): unified row-judgement stage
      (ONE stage owns segmentation-delta + disposition + home + lane per row; lane evidence
      an input column; probes pre-verify already-complete/superseded rows; challenge ALL
      rows of EVERY class with per-class question shapes; frozen-spec binding clause from
      first draft) -> co-authored
      destination plans (V0 + owner-signed extensions) -> per-batch loss check against the
      frozen denominator -> SP3 re-pricing (fixed vs marginal cost split from pilot
      actuals; ruling-demand sizing; scale-up gate is an owner sanction on the re-priced
      declaration; SP3 explicitly labels which declaration lines carry pilot evidence and
      which remain priors — the pilot area has no active lanes, so the arrival machinery,
      the challenge-stale trigger, and live-lane ruling demand stay prior-priced until
      batch 2, which is chosen WITH active lanes and re-confirms those three terms before
      full parallelism). Acceptance: pilot area's conservation ledger tiles exactly;
      challenge overturn/weaken rates measured, terminal-class overturn rate reported
      SEPARATELY; challenger-finding adjudication rate (findings per 100 rows, by class)
      measured; planted-loss challenge canaries caught (P4); canary keys sealed by
      hash-commit-then-reveal and scored after.
    status: pending
    depends_on: [r2-lanes-and-walk-a]
  - id: r4-rollout-batches
    content: >-
      EXECUTE (per-area batches, parallel-safe): batch-sequential with canaries + a
      deterministic breaker between batches; per-batch pre-declaration and loss check; the
      challenge-stale trigger re-flags VERIFIED loss-bearing rows whose destination homes a
      later commit mutates; arrivals consumed via the G3-ratified routing table (versioned
      frozen-v2 copies for modified arrivals, scoped inventory/tiling extension).
      Acceptance: every batch closes on recomputed proofs INCLUDING its planted-loss
      challenge canaries caught (P4); a failed loss check halts THAT batch only; owner
      ruling batches stay within the Walk-A-ratified thinning policy.
    status: pending
    depends_on: [r3-pilot-batch]
  - id: r5-cutover-and-retire
    content: >-
      LAND: per-tranche repoint-before-retire as ONE commit each — every consumer of old
      paths re-derived at execution, repointed via the closed decision table, durable
      pointers on first-read surfaces, additive dated supersession notes (history never
      rewritten) — gated on the scripted retirement precondition (live bytes == frozen +
      ratified banner + routed amendments, per file) and the per-tranche owner cutover
      sanction (rides existing ruling batches). Acceptance: link gates only ever evaluate
      finished states; old estate retires only against a green conservation ledger +
      challenge record.
    status: pending
    depends_on: [r4-rollout-batches]
  - id: r6-final-walk-and-close
    content: >-
      CLOSE: Walk C — the owner walks the new corpus against live-RECOMPUTED state (tool
      output, never remembered numbers); the two-direction no-loss audit composes the
      chain (tiling + challenge + probe records) with TWO fresh-context reviewers who did
      not perform any batch (the composed chain is the one surface a single lens covers
      alone); integration/rejection table for every adopted-or-rejected resonance
      mechanism recorded; learning-loop consolidation runs; the WS6 hand-off note lands
      stating the harvest substrate EXPLICITLY as the refounded corpus PLUS the frozen
      archive reachable via binding-clause provenance edges (so the transitive no-loss
      composition holds at idea granularity — cross-estate review B2; the same statement
      rides the G-ADR audit-composition ruling). Acceptance: Walk C ratified; this plan
      archived with disposition done; the rewrite plan's WS6 points at the new corpus +
      frozen-archive substrate.
    status: pending
    depends_on: [r5-cutover-and-retire]
---

# Plan-corpus refounding — provably lossless intent-aligned transformation

**Commissioned by the owner 2026-07-06** (in-session directive): do what the Practice donor
estate just did to its plan estate — losslessly re-found the planning corpus around intent —
using similar methods and adopting its epistemic advances, at this estate's scale, as an
intermediate step on the road to the ADR-200 intent graph. "It can and will be done, in
appropriately sized batches, with error correction and loss checks", with "hyper-efficient
low-context subagents that do not need to make any judgements — if they make judgements we
lose information."

Design provenance: a six-facet independent design panel + four-lens adversarial critic pass
(PDR-123 shape) synthesised with the donor estate's process synthesis and its live exchange
seat's ground-truth answers; the full record with every critical finding and its disposition
is [the design record](../../../reports/agentic-engineering/plan-estate-refounding-design-2026-07-06.md).
The donor-side method evidence re-sources from
[`resonance-practice-knowledge.md`](../../../reference/resonance-practice-knowledge.md) and the
incoming box synthesis
([`resonance-plan-estate-refounding-synthesis-2026-07-06.md`](../../../practice-core/incoming/resonance-plan-estate-refounding-synthesis-2026-07-06.md)).

## R1 execution progress (2026-07-15)

S0 is closed and merged. The S1 deterministic script layer is also merged through PR #382
(`de3cc54c1`, evidence tip `766f3d5eb`): freeze verification, inventory, residue, sweep, and
P4 detector-calibration were run twice from the exact recorded base with byte-identical output.
The compact evidence contract records the regeneration commands, measurements, checksums, and
the honest calibration boundary: the marker-free plant was invisible while the control hit.

The `r1-freeze-inventory-baseline` todo remains **pending** because this is a partial stable
point, not full S1 completion. The declared-rate reader sample and any resulting narrow
reader/locator or judgement residual remain Director-owned, calibration-gated work; S2 tiling
and the claim-vs-derived divergence report have not run. The five large generated outputs are
deliberately absent from the merged PR and preserved in local-only conservation commit
`42b27e3eb` pending Director disposition. Do not treat PR #382, the ignored output paths, or
the local conservation copy as evidence that the whole r1 todo is complete.

## End goal · mechanism · means

- **End goal.** A destination-organised, human-navigable plan corpus in owner-ratified
  intent lanes (including newly identified lanes and a conserving holding lane), every
  concept from the current estate conserved with an auditable proof chain, plan state
  recomputable rather than recorded, and the whole corpus born graph-ready so the ADR-200
  harvest (WS6) becomes mechanical. Near-term value lands without waiting for the graph.
- **Mechanism.** Resonance's conservation chain, re-engineered for ~37× scale: mechanical
  rules define every input set; deterministic scripts do everything deterministic;
  zero-judgement workers read only where scripts cannot; judgement is PLACED (rule
  authoring, mapping tables, one unified row-judgement stage, owner gates) and
  quorum-governed; every detector proves it can fire before its zero is trusted; batches
  close on recomputed loss checks; retirement happens only behind a green conservation
  ledger and a challenge record.
- **Means.** The nine todos above (R0a–R0c, R1–R6), gated as declared.

## The protocol invariants (P1–P14)

Merged from the cross-estate invariant exchange (the donor seat's I1–I12) plus the critic
cures; the design record maps each to its source and evidence.

1. **P1** Mechanical rules define every input set; the rule's derivation is the only
   judgement in it, ratified before execution (G1). No subjective per-file filter, ever.
2. **P2** Freeze + denominator land as one atomic commit; the denominator is re-derived at
   every stable point and batch boundary; byte-identity is recomputable at any time. Run
   artefacts live at a refounding artefact root OUTSIDE the frozen denominator, and the
   freeze rule carries named sanctioned-writer classes (new-lane directories, the ratified
   banner diff class, accretion-logged plans) so protocol-authored writes are never
   self-noise arrivals.
3. **P3** Deterministic operations are scripts; the mechanical layer spends zero LLM
   tokens. LLM workers appear only where reading is unavoidable, under 100% four-step
   verification (format conformance, count parity, full-set byte equality — never sampling
   — absence re-derivation) with dispatcher recomputation as the binding proof. A worker
   judgement is a task-design failure: the refusal clause fires, the TASK is redesigned.
4. **P4** Every detector and probe proves it can fire (planted defect, mutation, deliberate
   break) before its zero or green is accepted — including a marker-free work-bearing
   paraphrase plant for the sweep net, regex-invisible canaries for reader calibration,
   and sealed planted-loss rows (known-dropped spec detail, declared rate) seeded into
   EVERY batch's challenge stream: a batch's challenge pass is accepted only if its
   planted losses were caught, because a zero-findings pass on a well-authored batch is
   otherwise indistinguishable from a blind one (cross-estate review B1). Canary keys are
   sealed by hash-commit-then-reveal (or dispatcher-held keys): the sha256 of the key set
   is committed before the batch, revealed and scored after.
5. **P5** State verdicts are probed from the repo in BOTH divergence directions; recorded
   status is claim, never truth. The claim census is deterministic; probe selection per
   claim is placed judgement (J5); no terminal disposition without locator-anchored
   evidence.
6. **P6** Conservation is an exact tiling over the frozen denominator — zero gaps, zero
   overlaps — script-recomputed and independently recomputed.
7. **P7** Semantic-loss detection is fresh-context adversarial challenge over EVERY
   disposition class; stratification narrows the challenge QUESTION per class, never the
   coverage (donor-seat correction, 2026-07-06: wrong-reason risk on a reason-bearing row
   is total loss no mechanical probe can see). Per-class question shapes: named-home /
   merged-into / permanent-home-routed → does the named home plus binding clause reach
   this content's spec detail; already-complete → does the cited proof recompute and
   reach the claimed carrier; superseded-because → attack the reason itself;
   owner-rejected → does the cited ruling record exist and cover exactly this content.
   Mechanical probes PRE-verify claim-bearing rows but never substitute for challenge;
   never sample within any class; a verified reader finding inside any terminal-status
   block voids that status.
8. **P8** Judgement is placed and named (the J-map below). Nothing outside a J-row may
   require it.
9. **P9** Destination items carry typed proofs (closed taxonomy, owner-signed V0 extension)
   plus a frozen-spec binding clause from the FIRST draft; all cross-references cite stable
   ids, never line numbers.
10. **P10** Repoint-before-retire as one commit per tranche; probes are closed
    sanctioned-survivor sets; the estate's own gate contracts are verified at plan-author
    time (probe what the scanner actually scans before relying on it).
11. **P11** Owner gates are the scale-independent spine, held in ONE consolidated register;
    recurring escalation classes are thinned into owner-ratified policy rows so the ruling
    queue stays within measured capacity.
12. **P12** Batches are bounded and pre-declared (agents, tokens, currency, wall-clock);
    each closes with a loss check against the frozen denominator; a failed loss check halts
    that batch; canaries + a deterministic breaker run batch-sequential. Exit criteria are
    proofs, never the clock.
13. **P13** Cross-batch shared destinations are watched mechanically: any commit mutating a
    home cited by VERIFIED loss-bearing rows flips them challenge-stale and blocks the
    affected retirement tranches until re-verified.
14. **P14** Nothing is discarded, by construction: the disposition taxonomy contains no
    destructive class; not-currently-strategic content routes to the conserving holding
    lane; doctrine-grade content routes via `permanent-home-routed` INTO the existing
    consolidation machinery (the curation lane / consolidate-docs workflows) as
    candidates with provenance — the refounding mints no bespoke graduation path
    (PDR-122 Consequences), and a batch routing many fragments is a curation-lane load
    spike the Director schedules visibly; every exclusion, residue, and non-conservation
    declaration cites its sub-reason.

## The placed-judgement map (J-rows)

| J | Judgement | Holder | Gate/verifier |
| --- | --- | --- | --- |
| J1 | Freeze/surface rule + net design + keyword lists | protocol author | owner G1; discrimination proofs |
| J2 | Versioned status-mapping table (old value → typed verdict; unmappables = named residue class) | protocol author | owner OG-2; applied by script |
| J3 | Adjudication of net set-differences, residue blocks, sweep hits | in-session executor | evidence recorded per instance; H6 halt on out-of-map judgement |
| J4 | The unified row-judgement stage: segmentation-delta + disposition + home + lane per row (lane evidence as input column; 2-lens quorum + escalation; cross-regime concurrence for terminal classes — attention-irreversible, since content stays recoverable per P14). Segmentation-delta aggregation: identical deltas = agreement; ANY structural disagreement routes to J3; the pilot measures the disagreement rate (a high rate means the default anchored blocks are mis-granular — an F1 fix, never absorbed into J4) | judgement fleet | canaries + breaker; challenge layer; reconciliation rule (home's lane must equal lane verdict, else J3) |
| J5 | Probe-proposal per census claim (closed registry or NO-PROBE → locator anchors before any terminal call) | judgement fleet | mutation-probed tool; divergence report |
| J6 | Lane-taxonomy derivation (top-down seed + pilot evidence) | protocol author + fleet | owner Walk A; registry + validation |
| J7 | Destination authoring (co-authored, human + agent) | Author seat | V0(+ext) validation; frozen-spec binding; challenge |
| J8 | Fresh-context challenges (incl. challenge-the-clean on loss-bearing classes) | challenge fleet | decision-complete briefs with unit definitions and untruncated inputs |
| J9 | Owner gates | owner | the consolidated register |

## Zero-judgement worker roles

Exactly two, both verbatim-anchored, both verified on 100% of replies by dispatcher
scripts (P3):

- **refound-reader** — the second blind net over frozen windows (semantic recall the regex
  nets cannot see): Read-only, bounded turns, one window per dispatch; output = verbatim
  quotes + file:line anchors only; priced at the measured ~48k/window prior with the
  uncached figure carried as the declaration ceiling; calibration canaries must be
  regex-invisible by construction; a declared-rate sample of NON-hit sweep windows runs as
  the second net over the sweep surfaces. On the MAIN corpus the reader is a TARGETED
  second net only — the universal semantic pass over the main corpus is the challenge
  layer (P6 tiling coverage + P7 every-class challenge), never a priced-back-in universal
  reader sweep.
- **refound-locator** — single-target existence/anchor checks (zero tools where inline
  context suffices); supplies candidate anchors for NO-PROBE claims.

Segmentation, classification, summary wording, and disposition are NOT worker work.

## Owner-gate register (consolidated; the scale-independent spine)

One **Director-owned** list (P11; economics-critique C4 cure) — every owner gate in the arc
appears here and only here; the facet designs' gate sketches (F3 §6, F5 §8, F6 §9) are feeder
material merged into these rows, never a second register. Facet gate-numberings collide
(F6 §9's G-labels and F5 §8's OG-labels differ from F3 §6's); THIS register's labels are
authoritative — the F6 §9 mapping is Commission→G0, proof-typed→G-ADR, table→OG-2, lane
walk→Walk A, G5→G-SP3, G6/G7→Ruling batches, G8→Walk C. The economics counterpart is the
[cost ledger](../../../plans-refounding/plan-corpus-refounding-cost-ledger.md): H7 (the cost backstop, in the
operational H-series the implemented runners emit) fires against that ledger's per-batch
declarations AND its run total.

| Gate | Content | When |
| --- | --- | --- |
| G0 | Commission — recorded 2026-07-06 (this plan); gate content settles at G1 | done |
| G1 | Freeze-rule ratification — **DISCHARGED 2026-07-07** (in-chat owner sitting; record: the G1 packet §9): verdict table ratified as drafted (archive = sweep + reader sample); both keyword lists ratified; bounds ratified as detection calibration under the absorb-everything disposition; destination RULED as the separate root `.agent/refounded-plans/` with the terminal archive-old + rename cutover (supersedes the drafted named-class rooting); sanctioned-writer set ratified EMPTY (clean v1 rule); reader-sample cure at 10%. The §8 riding agenda delivered the Walk-A derivation input (zero concepts lost; a small number of thread-level plans each with implementation collections; a holding bucket; nothing thrown away) | R0→R1 boundary |
| G-ADR | **Decision-level ADR-200 amendment — RATIFIED (owner, 2026-07-06, formal question put and answered)**: the Q3 boundary re-ruling (corpus refounding precedes the graph; WS6 harvests the refounded corpus PLUS the frozen archive via binding-clause provenance edges), the audit-composition ruling, and the V0.1 sign-off (proof-typed todos; the `pending`-sentinel/lane rule; `permanent-home-routed`) — all three V0.1 items signed. Landed: ADR-200 §Consequences Amendment + §Sequence note; V0 schema V0.1 block | done |
| G2 | S0 landing sanction: denominator totals, scoped gate exclusions with reasons, secret-scan attestation, declared commit window | R1 |
| G3 | Arrivals-routing table (what auto-freezes vs per-arrival ruling) | R1 |
| OG-2 | Two halves (F3 §6 named one sitting; the halves discharged separately by owner choice). **Table half — DISCHARGED 2026-07-08** (owner rulings put as formal questions and answered, relayed by directed comms event to the R0c seat): status-mapping table v1 RATIFIED as-is (`agent-tools/src/plan-state/status-mapping/v1.ts` — six entries, todo-binary scope; `STATUS_MAPPING_V1_RATIFICATION.status` flipped to `ratified` on the R0c branch, the mechanical unlock for r1's audit mode on the default table; an explicitly injected `--status-mapping` table remains the operator's own call; the table is not packet-listed so `validate-ratified-lists` carries no entry — if a future packet lists it, extend the validator, never a pin test); gate semantics SETTLED — the all-no-evidence green keeps its shape (exit 0 + the named `green — no recomputation performed` line; the counts disclose it; `decideGateVerdict` unchanged); and plan-level status values stand as DESIGNED UNMAPPED residue — the >20% halt firing at r1's audit run is the table-v2 trigger, not a defect. **Judgement-machinery half — OPEN** (F3 §6/§5.4 + critique M5): ratify the disposition taxonomy (F3 §2.1 six classes + `permanent-home-routed`), the regime-A/regime-B pair definition WITH the challenger-tier declaration (M5: the same decision), the H-series thresholds (the 2% overturn rate, the canary mismatch count), and the V0 §3.5 status-map extension policy. This row merges the F3 §6 / F5 §8 OG-2 duplicates | Table half: discharged (r1 audit mode mechanically unblocked). Judgement-machinery half: before ANY challenge stream runs (R3); may ride the Walk-A sitting |
| OG-3 | Canary answer-key ratification (~15 rows, each with first-hand repo evidence attached, per F3 §4.1/§6; sealed via the R0a `plant-challenge-canary` tool's SEAL mode — sha256 hash-commit-then-reveal; distinct from that tool's plant mode, which derives the P4 planted-loss rows): the owner ratifies the sealed key before any batch's challenge stream runs; on any judgement-regime change the canary set RE-RUNS under the new regime (F3 §4.2; a regime change is a design change, PDR-122 inv-6). May ride the Walk-A sitting if the sealed key is ready | R2→R3, before pilot batch 1 |
| Walk A | Lane-taxonomy ratification from staged evidence (pilot + top-down seed; non-pilot lanes candidate-status) + escalation-thinning policy tables. This sitting IS the binding post-refounding organisational-structure decision; the R1 source denominator + census/divergence report are presented as sitting inputs (owner-directed 2026-07-07) | R2 |
| G-SP3 | Scale-up sanction on the RE-PRICED declaration (fixed vs marginal; ruling-demand sizing from pilot actuals). Also presents the post-corpus size projection — source denominator × pilot-measured merge/supersede/disposition rates — the expected-numbers moment (owner-directed 2026-07-07) | R3→R4 boundary |
| Ruling batches | Batched mid-flight rulings (≤15/batch; includes per-tranche cutover sanctions AND the plan-state gate warn→enforce escalation — F5 §8's third gate, re-ID'd **OG-WE** here to clear its collision with the canary-key OG-3 above; fires after the deliberate-break transcript + an owner-seen divergence report) | R4–R5 (OG-WE in any mid-flight slot) |
| Walk C | Final ratification against recomputed state — **includes the terminal cutover sanction**: the archive-old + rename move to the G1-ruled destination root (`.agent/refounded-plans/` becomes the live corpus; the old estate archives, never deleted, per P14). No cutover executes without this sitting; per-tranche cutover sanctions along the way stay inside the Ruling-batches row | R6 |

## Walk-A structure priors (owner-reacted, 2026-07-14)

Two owner-directed concept-exploration passes produced owner-reacted priors
for r2's derivation and the Walk A sitting — recorded in full at
[`walk-a-structure-priors.md`](../../../plans-refounding/walk-a-structure-priors.md)
(the sitting input of record). Headlines: the **three-layer hierarchy**
(lane roadmap → strategic plan → implementation plan, implementation always
parented) is ratified in principle; **lanes 6–8**; **~20 strategic plans**
with a **WIP limit of 5 in execution (2–3 owner-hot)** binding owner
attention, not agent throughput; threads recommended to dissolve into
strategic-plan continuity sections (Walk A decides); the homeless-concept
policy (wrong-kind re-homes by function / unplaced intent enters the
conservatory lane with placement triggers / history conserves in the frozen
archive); and the three analysis units (rows for proof, concepts for
judgement, plans for authoring). These are priors, not rulings — Walk A
ratifies, SP1/SP3 re-price.

## Economics (pre-pilot declaration; re-priced at SP3)

Corrected ensemble band from the independent economics critique: **40–60M tokens**,
**25–45 seat-sessions**, calendar conditional on concurrent multi-seat operation; dominant
terms are the challenge layer, the unified row-judgement stage, and Author/Adjudicator
wall-clock; the arrival-halt feedback loop is priced per week of arc length.
CHALLENGER-FINDING ADJUDICATION is a first-class priced line (the donor's hidden dominant
seat-cost: ~26 findings per 100 rows at their scale → potentially ~2k findings here —
every one first-hand verified and dispositioned); the pilot measures findings per 100
rows by class. The mechanical
substrate spends zero LLM tokens; the donor estate's ~1.3M verification-wave class is
deleted by design (scripted recomputation replaces it). Row prior: ~8.3k ledger rows
(618 sources × the donor's measured ~14.9 rows/source − the terminal-probe share). All
figures are declared bands, not commitments; SP3 re-prices from pilot actuals and the
scale-up is owner-sanctioned (G-SP3). The full cost ledger is
[`.agent/plans-refounding/plan-corpus-refounding-cost-ledger.md`](../../../plans-refounding/plan-corpus-refounding-cost-ledger.md)
(authored at R0c; Director-owned; re-issued at SP1 and SP3; H5 binds to its per-batch
declarations and run total).
Honest scaling assumption (donor-seat label, extrapolated-not-measured): challenge cost
is roughly LINEAR in corpus size — the controllable lever is brief narrowness (the
binding clause + per-class questions), never class exemption or sampling; the pilot
measures the constant. The donor's ~17h figure is elapsed time including an overnight
owner-hold — an upper bound on elapsed, not a work estimate.

## Prerequisites

- **`blocking`** — R0a script proofs green before S0; G1+G2 before S0 (G-ADR is already
  ratified and discharged — owner sitting 2026-07-06, per the owner-gate register); Walk A
  before pilot authoring; SP3 sanction before rollout.
- **`beneficial`** — the corpus-generalisation Phase 0 atomic landing set (PDR-122
  invariant-2 amendment): the refounding's quorum design already honours the measured-n_eff
  correction, so it does not wait; landing it first merely aligns the citation.
  Minimum shippable shape without it: cite the measurement + the Phase 0 design record.
- **`beneficial`** — ADR-200 WS2 (idea-node schema): proceeds in parallel by owner
  direction; the refounding consumes nothing from it. Minimum shape without it: V0(+ext)
  frontmatter only.

## Non-goals

- NOT the intent graph build (ADR-200 WS2–WS7 continue; WS6/WS7 consume this plan's output).
- NOT a refactor/relabelling of existing plans, and old-plan conformance to V0 is NOT a
  goal (ADR-200 §Non-goals) — old plans are frozen, mined, and re-expressed, never patched.
- NOT a file-count-preserving migration (named explicitly 2026-07-07, owner-directed):
  destination cardinality is LANE-derived — set at Walk A by the ratified taxonomy and J7
  authoring per lane — never source-derived. A per-source default of one-plan-in-one-plan-out
  is a failure mode, not a target: conservation is row-granular through the seven
  dispositions, the frozen archive remains the detail contract via P9 binding clauses, and
  only named-home / merged-into rows produce destination text at all (the donor re-founded
  15 sources into four destination plans). Source-plan count exerts zero pull on the
  destination corpus; an individual 1:1 re-expression stays legitimate where a lane warrants
  it — the non-goal is the coupling, never the instance.
- NOT a re-authoring of vision or strategy (they stand; ADR-200 owner ruling 2026-06-22).
- NOT a Practice-wide markdown→graph inversion (OQ-10 remains its own owner-gated ADR).
- NOT deletion of anything: no destructive disposition class exists (P14);
  `plans-old-archive` is a sweep surface, not a freeze source, and is never modified.
- NOT a rebuild of the corpus-analysis instrument: the refounding borrows its doctrine
  (PDR-122/123, canaries, breakers, pre-declaration) and shares no run-time machinery;
  generalisation-kernel convergence is F6's later question, not this arc's.

## Risks

| Risk | Mitigation |
| --- | --- |
| Coexistence-window deltas destroyed at retirement while proofs read green | frozen-v2 versioned arrival copies; banner-aware comparison with mutation proof; the scripted retirement precondition (P2/P13; lossless-critique cure 1) |
| Sweep surfaces (~59% of in-scope text) behind one never-proven net | marker-free paraphrase plant must be caught; declared-rate reader sample of non-hit windows; explicit G1 residue declaration otherwise |
| Owner ruling queue saturates (measured demand 100–200 vs ~45–90 slots) | escalation-thinning policy tables at Walk A; demand re-sized at SP3 |
| Judgement-regime drift mid-run | regimes calibration-stamped; a regime change is a design change (PDR-122 inv-6); canaries re-run on any change |
| The arc stalls on tool-building perfectionism | freeze+inventory land the moment their own proofs pass (R0a acceptance); the instrument phase is not a freeze hostage |
| Live-lane collisions during freeze/repoint | claims + comms coordination per the existing collaboration substrate; S0 in a declared commit window (G2) |
| Authoring quality collapses under batch pressure | co-authoring (J7) with the human owning higher-altitude shaping; frozen-spec binding narrows challenge briefs; challenge layer retained regardless (P7) |

## Foundation alignment

`principles.md` (LTAE; decision lenses; strict everywhere); `tdd-as-design.md` +
`testing-strategy.md` (every script and the plan-state tool land test-first; detectors are
mutation-probed — the same doctrine one level up); `schema-first-execution.md` (the V0
schema + registries are the authoring contract; validation strict at the boundary);
ADR-200 (the architecture this serves); PDR-018 (end-goal/mechanism/means; blocking vs
beneficial); PDR-049 (every new multi-writer artefact declares a merge class at creation);
PDR-122/123 (judgement pipelines and design panels); the governing invariant of the
[rewrite plan](../current/planning-estate-rewrite.plan.md) (every organising axis registered and
validated).

## Plan-body first-principles check

Fires before R1, R3, R4, and R5: re-ask whether the next step makes the estate more
truthful and serves the strategy, or merely satisfies the apparatus (the conformance-theatre
risk named in the controlling plan). The pilot (R3) is the structural embodiment — the
protocol does not scale until its own calibration passes and the owner re-sanctions the
re-priced run.

## Readiness reviewers

The PDR-123 panel + four-lens adversarial critique ran at design time (2026-07-06, this
plan's provenance); the donor estate's exchange seat provides the independent cross-estate
adversarial review of this synthesis; `assumptions-expert` re-reviews at G1 (freeze-rule
proportionality) and G-SP3 (scale-up); `config-expert` when the standing freeze gate and
plan-state tool join `repo-validators`; `test-expert` on the script/tool test estates.

## Lifecycle

Lives in `current/` (executable). **Execution AUTHORISED (owner, 2026-07-06): R0 is go**,
with WS2 proceeding in parallel; the branch push + PR were owner-approved the same sitting.
Promotes to `active/` when R0a starts. On R6 completion this plan archives with `disposition: done`; the
learning-loop consolidation runs at every stable point close and at archive
(`lifecycle-triggers` component applies in full).

## The long-term road (context, authoritative in the rewrite plan + ADR-200)

Current estate → **this refounding** (destination lanes, conserved content, recomputable
state, V0+ext form) → ADR-200 WS6 deep harvest over the REFOUNDED corpus PLUS the frozen
pre-refounding archive via binding-clause provenance edges (mechanical, because
provenance/edges/registries are born clean) → WS7 synthesis completes on the graph →
the intent graph becomes the SSOT with documents as co-equal projections. WS2 (idea-node
schema) and WS4 (thin-slice proof) proceed in parallel throughout and must not wait on this
plan; the refounding must not wait on them.
