# Large-corpus-analysis v2 — rerun result and design correction (2026-06-30)

**Status: RAN (full). Verdict: REFINE (not graduate).** The v2 method ran end-to-end over the
napkin corpus through the harness Workflow (map → reduce → validate → meta), with every count,
fraction, threshold, and routing decision computed deterministically by the
`agent-tools/src/corpus-analysis/` module — not self-reported by an LLM. The rerun also
surfaced and fixed a real adjudication design defect (single-adversary terminal kill), recovering
four genuine patterns that were being falsely discarded.

Design authority: the v2 design report
([`large-corpus-analysis-runbook-v2-design-2026-06-29.md`](./large-corpus-analysis-runbook-v2-design-2026-06-29.md)),
amended by the §"Design correction" below. Launch vehicle: the rerun runbook
([`large-corpus-analysis-v2-rerun-runbook-2026-06-29.md`](./large-corpus-analysis-v2-rerun-runbook-2026-06-29.md)).

## Verdict — Choice B dual gate

Choice B = strict within-remit recall ≥ 0.6 (fidelity floor) **AND** lenient within-remit ≥ 0.85
(coverage floor). The headline denominator is the **emergent** baseline subset (10 of 18);
single-window structural defects are out-of-remit and reported separately.

| Measure | Value | Gate |
| --- | --- | --- |
| **strict within-remit** | **5/10 = 0.50** | ❌ below 0.60 |
| **lenient within-remit** | **9/10 = 0.90** | ✅ at/above 0.85 |
| strict overall (all 18) | 12/18 = 0.667 | — |
| lenient overall (all 18) | 16/18 = 0.889 | — |

**Choice B fails on the fidelity leg → REFINE.** This matches the pre-run expectation: v2 changed
the *aggregation* layer, not *extraction*, so strict within-remit was expected to land near v1's
~0.5. A refine verdict on deterministically-computed, stratified numbers is the designed,
acceptable outcome — not a failure of the exercise.

Aggregation integrity (all clean): recompute-of-dispositions matches the workflow (independent
re-derivation through the real `adjudicate`), 0 voter-outcome parse failures, 0 recall-integrity
violations, 0 under-extracting windows.

## Design correction — single-adversary kills are not rigorous (the headline finding)

The v2 adjudication shipped with a **Tier-0 kill being terminal on one voter** — justified as
"cheap and self-correcting" under the risk-tiering principle (`principles.md` §Agentic Quality).
Run against the corpus this proved wrong, and was corrected mid-rerun after the decision was put
through the Decision Lenses (`principles.md` §Decision Lenses):

- **Reversibility flips the asymmetry.** A false *keep* is reversible and visible (noise sits in
  the candidate set, matches no baseline, a human prunes it). A false *kill* is irreversible and
  silent (a grounded pattern vanishes; if it matched a baseline the gate — not extraction — drops
  recall). A terminal kill is therefore the high-stakes one-way door and is *not* self-correcting,
  so the same risk-tiering principle demands the highest rigour for a kill, not the lightest.
- **The corpus predicted it.** Candidate C39 ("keep is the safe default"; a verification
  sub-agent's false-negative rate is ~50–83%) is exactly this finding, discovered empirically.
- **The cure (Lens 1 mandated, Lens 3/4 refined): a kill requires the diverse-lens quorum;
  conserve by default.** A Tier-0 kill now escalates to the Tier-2 three-distinct-lens ensemble
  (as a reroute or borderline keep already did); only a quorum may discard. Anything not
  quorum-killed is conserved (kept, or held-for-review and surfaced — never silently dropped).
  Keeps, being conserved and reversible, are unchanged.

**Empirical vindication.** Of 9 first-pass kills, 5 were single-adversary (n=1) terminal kills.
Re-validated under the quorum, **4 of the 5 were FALSE kills, rescued** (C22, C23, C24, C31 — the
diverse lenses kept them), and **1 was a true kill confirmed by quorum** (C42, an absence claim
the three lenses agreed is ungrounded). An **80% false-kill rate on single-adversary kills** —
within the ~50–83% band C39 names. Corrected dispositions: **45 keep / 5 kill** (was 41 / 9). The
five quorum-confirmed kills are C34, C40, C42, C44, C48.

## Recall diagnosis — the residual gap is extraction altitude, not measurement

The within-remit shortfall is **one true miss plus four partials**, all at mechanism grain:

- **Missed:** `cron-template-overrides-owner-direction` — the firing-order mechanism (cron body
  fires before the agent reads owner direction) is not surfaced; C18 covers owner-direction
  supremacy generally but not this mechanism.
- **Partial (theme re-found, mechanism blurred):** `coordinator-amplifies-unseen-defect` (the
  over-write/under-write double-bind), `repo-wide-autofix-sweep-footgun` (the format:root-into-
  staged-set mechanism), `compaction-is-a-checkpoint` (compaction named as the re-verify trigger),
  `peer-primary-topology-regime` (named as a distinct regime).

In every partial the run captured the *theme* in a broad recurrence candidate but lost the
load-bearing *mechanism* the baseline names. That is an **extraction-altitude** limitation — the
map/reduce stages cluster to theme and dissolve mechanism specificity — not an aggregation or
measurement error. The rescue confirms the diagnosis: recovering the four false kills improved
overall/single-window recall (C31 now `refines` presence-vs-ownership) but did not move the
emergent strict leg, because the rescued patterns do not match emergent baselines.

## Real-world-signal close

The meta stage named on-disk graduated homes for kept candidates; the driver verified each path
exists against a live scan of `.agent/memory/active/patterns/` + `.agent/rules/`. Result:
**31/31 kept candidates corroborated by ≥1 existing home; 55 named paths, all present, 0
named-but-absent.** Caveat: the check verifies *path existence*, a real-world signal that these
patterns already have durable homes — it does **not** verify semantic match of home to pattern.

## Run shape and cost

- **Corpus partition (re-derived at launch):** 100 files, ~1.02M tokens, **15** token-balanced
  windows (the runbook estimated ~14; the corpus grew — re-derivation was load-bearing), 0 files
  split.
- **map:** 15 windows, Sonnet/low → **682 leaves**, 40–50 per window, zero under-extraction.
- **reduce:** Opus/high → **50 candidates** (35 recurrence, 6 behavioural, 3 trajectory, 3
  absence, 1 each meta/regime/distributional).
- **validate:** Opus/high, mirror-driven Tier 0/1/2, then corrected to the diverse-lens quorum
  for kills; concurrency-capped for throughput control.
- **meta:** Opus/high over all 50 candidates with corrected dispositions.
- **Cost:** ~13.2M tokens total across four Workflow runs (run-1 map+reduce+partial-validate 3.49M
  [quota-truncated], full validate+meta 8.61M, kill top-up 1.08M, meta-over-50 0.06M); ~439
  agents. Far above the ~1.7M pre-spend estimate — see §Cost lessons.

## Cost lessons (and the gate that now catches them)

- **No post-reduce cost re-gate (now fixed).** The pre-spend estimate guessed validate voters from
  a prior candidate count (~20); reduce produced 50, and validate fan-out hit ~250 voter slots →
  the first run blew past the 2M ceiling to 3.49M and the quota truncated it. Fix landed:
  `validateStagePlan(candidateCount, …)` in `cost-and-coverage.ts` rebuilds the validate estimate
  from the **real** post-reduce count; re-run `estimatePipelineCost` after reduce, never only
  before.
- **Per-voter token estimate was ~5× low.** Grounding-heavy vote prompts at high effort ran ~50k
  tokens/voter, not the ~11k modelled. The cost model's `tokensPerInvocation` for the validate
  stage should be recalibrated to ~50k baseline (or the grounding passed to voters trimmed to a
  representative sample — a rigour/cost trade to weigh).
- **Throughput is orthogonal to volume and rigour.** The quota death was a *rate* failure, not a
  too-much-work failure. Concurrency-capping (and, for total-per-window limits, cross-window
  checkpointing) controls the rate while every agent, tier, and test still runs — the only trade
  is wall-clock latency.

## What landed (committed)

In `agent-tools/src/corpus-analysis/` (all green: build / type-check / lint / 131 unit tests):

- `workflow-routing-mirror.ts` + `workflow-routing-mirror.conformance.test.ts` — the sandbox
  mirror of the three routing functions, pinned to the source module (the Workflow JS sandbox
  cannot import repo code; the mirror is the one duplication and the conformance test is the pin).
- `cost-and-coverage.ts` — `validateStagePlan` / `MAX_VOTERS_PER_CANDIDATE`, the post-reduce cost
  re-gate, with tests.
- `aggregation-adjudication.ts` — the kill-escalation correction (a Tier-0 kill escalates to the
  diverse-lens quorum; conserve by default), with its test updated to describe the new state.

## Graduate-or-decide

**Decision: REFINE, do not graduate.** Runbook graduation (a PDR-120 reference runbook + the
adopting PDR per PDR-035) stays gated on a passing v2; strict within-remit 0.50 < 0.60 fails.

**Defect named + route (no holding state):** the residual gap is **extraction altitude** — the
map/reduce stages cluster to theme and lose mechanism specificity, so mechanism-grain baselines
land as partials or misses. A v3 should target extraction grain (preserve the load-bearing
mechanism through reduce — e.g. a mechanism-preservation pass, or candidate granularity that keeps
the distinct file-level/lifecycle mechanisms separable), not the aggregation layer (now proven
correct). Prioritisation of a v3 is an owner roadmap decision.

## What to carry forward / distrust

- The quorum-floor correction is the durable lesson and generalises beyond this method: **no
  high-stakes irreversible disposition on n=1; corroborate kills, conserve by default.** The v2
  design report's "a false keep is the irreversible error / a kill is cheap" framing is superseded
  by this for the *adjudication routing* (the per-verdict conjunctive keep logic is unchanged).
- The corroboration check proves path existence, not semantic match — read it as a graduation
  signal, not a correctness proof.
- The aggregation driver and the Workflow scripts (map/reduce/validate/meta + mirror) lived as
  session scratch artefacts; promoting them to permanent agent-tools tooling is an open follow-up
  (they would need to conform to the forthcoming agent-tools architecture).
