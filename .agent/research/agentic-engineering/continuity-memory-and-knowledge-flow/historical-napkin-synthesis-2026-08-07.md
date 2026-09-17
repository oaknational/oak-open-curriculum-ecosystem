# Historical napkin synthesis — 2026-08-07

*Author: Nettle weaves Root (claude-code / claude-fable-5 / 5cfa11) — 2026-08-07.*
*Mode: `consolidate-docs` step 6a archive-scale historical synthesis, executed as the*
*owner-ratified plan `.agent/plans/delivery/longitudinal-napkin-synthesis-2026-08.plan.md`*
*(ratification: comms event `4abd7f53-eab2-4785-877b-956e47ce6030`; ticket MCP-531).*
*Engine: the corpus-analysis pipeline (`agent-tools/src/corpus-analysis/`), four checkpointed*
*stages plus the deterministic post-run driver. Every number below is either produced by the*
*deterministic driver (recomputed by replay, integrity-checked) or recomputed first-hand from*
*the committed checkpoints; no stage's self-reported aggregate is transcribed unverified.*

## Corpus window

All 37 napkins archived since the 2026-05-29 synthesis marker: `archive/napkin-*` dated
2026-05-31 (foamy-docs-consolidation) through `napkin-2026-08-07.md`, 2,806,105 bytes.
The exact file-to-window assignment is the committed partition checkpoint
[`longitudinal-2026-08-partition.json`](../../../reports/agentic-engineering/large-corpus-analysis-tooling/data/longitudinal-2026-08-partition.json):
11 token-balanced windows, **seam-aligned to the estate's three regime boundaries** so no
mapper window straddles a regime change — w01–w04 the June solo→team-substrate regime
(25 files), w05–w10 the July fleet/coordination-branch regime (10 files), w11 the hardened
August practice (2 files). Oversize single files (w07, w08, w10) hold their own windows.
The active napkin is not in the corpus (it was rotated 2026-08-07 before this pass; the
archive file is). No archived napkin was modified by this pass.

## Selection rationale

Recorded at the 2026-08-07 closeout that agreed the pass (napkin §"Next-session brief",
commit `4ded82566`): the marker protocol starts at the 2026-05-29 synthesis; the window
spans all three regime changes, and longitudinal value concentrates at regime boundaries;
a smaller N would strand napkins outside every future marker window.

## Marker chain and processed marker

The marker ledger runs `2026-05-09` → `2026-05-13` → `2026-05-29` → **this report**.
The `longitudinal-napkin-review-2026-05-31.md` sits outside the marker ledger by filename
contract (it is a brief-driven last-20 review, not a `historical-napkin-synthesis-*`
report); its one corpus-file overlap with this window (`napkin-2026-05-31-foamy…`) is
deliberate and harmless.

**Processed marker: `2026-08-07`** — the archive boundary through `napkin-2026-08-07.md`
inclusive. The next "since last marker" pass starts after this boundary.

## Run record

| Stage | Result | Tokens | Checkpoint commit |
| --- | --- | --- | --- |
| map (11 Sonnet legs) | 572 leaves, 11/11 windows, zero incomplete | 1.46M | `77d333a8e` |
| reduce (1 Opus leg) | 80 candidates (56 recurrence, 12 trajectory, 6 behavioural, 2 relational-lagged, 1 distributional, 3 absence) | 0.14M | `36049333f` |
| validate (320 voters, tiered) | 35 keep / 44 kill / 1 reroute; complete, zero errors | 7.40M | `6e6a09de2` |
| meta (1 Opus leg) | 17 recall matches judged; 34 corroboration claims | 0.08M | `e74373032` |
| post-run driver (deterministic) | integrity empty; **all 80 dispositions recompute to zero diff**; map coverage complete; zero temporal-coverage suspects | — | `e74373032` |

Validate ran at 7.4M of a 25M ceiling (80 × 5 voters × ~50k, ×1.25 headroom), the ceiling
pre-approved by owner word at ratification. Total pipeline spend ≈ 9.1M subagent tokens.

## Emergent findings

What the archive knows that no individual rotation could have known. Each finding is
carried by kept, adversary-surviving candidates (ids cite the committed reduce/triage
checkpoints).

1. **Prose cures do not move recurrence; only interface changes do — now measured, not
   asserted.** The kept trajectory C02 shows the exit-code cure hardening across three
   generations (unpiped `echo $?` → commit-skill doctrine → propagated `EXIT:$rc`
   pattern) while the recurrence rate stayed flat — seats still piped hours after reading
   the rule. Its sibling C01 (pipes eat exit codes) is grounded in **all 11 windows**,
   the widest recurrence in the run. This is the strongest longitudinal evidence yet for
   the estate's action-time-structural-interrupt thesis: the same claim as the
   `capture-does-not-cure` baseline, but now with a measured flat-recurrence arc rather
   than repeated anecdote. The general restatements of that thesis (C39, C40) were
   killed by the adversary as narrative arcs; the mechanism-grained carrier survived
   with the evidence intact — see §Rejected near-patterns for why that split is correct.

2. **The July regime's failure signature is shared-mutable-substrate contention, and the
   cures that stuck partition ownership rather than add coordination protocol.** The
   kept cluster C08 (shared index sweeps peer staging), C09 (branch/HEAD moves under a
   paused session), C10 (whole-tree gates red-gate other lanes), C11 (unbuilt dist
   false-verdicts sibling packages), C12 (guard substring over-blocking) concentrates
   its grounding in w05–w10. The estate's landed responses — worktree-per-lane,
   explicit-pathspec commits, the single commit-warden, built-before-trust — are all
   ownership-partitioning moves. The narrative version of this (C76, "operating scale
   grew and coordination followed") was killed on base-rate/null grounds: any growing
   estate accretes scale vocabulary; the mechanism-level components each survived on
   their own grounding.

3. **Every liveness signal the estate built has been successfully impersonated by a dead
   or wedged process; the only reliable verdict is work-evidence.** Kept: C17 (monitor
   lifecycle unmanaged — arms outliving TaskStop ~21h, SIGTERM reclamation at ~26min,
   double-armed watchers), C18 (heartbeat paths keyed on the wrong identity produce
   decoys), C19 (emitter presence masking 8–14h blind windows), C20 (UTC-vs-local
   arithmetic manufacturing phantom vacancies), C57 (the claims registry under-writing).
   No single rotation saw more than one instance; the archive shows the class: the
   estate iterated through signal after signal, each defeated the same way, converging
   on the substantive-output/work-evidence doctrine now in the liveness rule.

4. **The merge/review surface has a structural blindness class the estate keeps paying
   for at the boundary.** Kept: C21 (GitHub read instruments blind to Bots, statuses,
   mergeable-vs-mergeStateStatus), C22 (findings living outside the default harvest
   surface — suppressed Copilot bodies), C23 (async reviewers crossing the merge
   boundary), C44 (wrong ancestry instruments producing false-orphan verdicts). The
   longitudinal shape: each instance was cured locally; the class kept re-presenting on
   a new sub-surface. The homed cures (pr-lifecycle full-surface harvesting, the
   +10-minute tail harvest, merge-boundary recounts) now cover the known sub-surfaces.

5. **Authority hygiene decays as text ages: agent-authored prose is laundered into owner
   authority by register alone.** Kept: C59 (imperative-register napkin prose cited
   hours later as "the owner's ruling"; invented rationales relayed upward; recorded
   "grants" that were never granted), C26 (the whose-name-will-this-display trigger
   failing at write time), C28 (subagent reports relayed without first-hand grounding).
   The archive adds the time dimension: provenance loss is not an event but a decay —
   the same text is honest capture at write time and false authority a session later.
   The homed cures (records-are-technical registers, derivation-carrying claims) target
   exactly this decay.

6. **The estate learned to distrust its own aggregation and made judgment atomic** —
   C35 (LLM legs judge atomically well, aggregate badly; counts must be deterministic
   dispatcher code) and C36 (checkpoints measured cost but not judgment; the canary
   pilot discipline) — learned from this very pipeline's July calibration failure, now
   PDR-122 doctrine, and re-confirmed by this run's own shape (the deterministic driver
   recomputing every disposition to zero diff is that doctrine executing).

7. **Trajectory kinds are real and datable.** Twelve trajectory/relational candidates
   survived with genuine early/late splits and zero temporal-coverage suspects: fitness
   gate→signal (C41), retention doctrine flip and its misread as a delete mandate
   (C42), gate-response hardening from exemption-instinct to category-relocation (C46),
   merge authority tightening arc (C25), review convergence arc (C24), watcher
   drain-budget inversion (C16 — killed as a candidate but its committed evidence dates
   the policy flip). The archive can date doctrine changes and their misreadings.

## Evidence arcs

Chronological arcs supporting the findings above, resolvable in the committed checkpoints
(candidate `supportingLeafIds` → leaf `grounding` quotes → dated napkins):

- **Exit-code arc** (finding 1): w01 (2026-05-31 unpiped `echo $?`) → w05 (commit-skill
  doctrine) → w10 (2026-07-29 propagated `EXIT:$rc`) → w09/w11 (seats still piping).
- **Ownership-partitioning arc** (finding 2): w01–w02 (shared-checkout sweeps) →
  w03–w06 (worktree-per-lane, warden, pathspec) → w08–w10 (guard/mint-token merge arm).
- **Liveness-impersonation arc** (finding 3): w04–w07 (watcher deaths, decoy paths) →
  w10 (8–14h blind windows measured) → the substantive-output doctrine in the rule tier.
- **Authority-decay arc** (finding 5): instances in w01 (avoidance-voice handoffs
  teaching the next agent), w05–w09 (laundering instances), cures landing as register
  discipline through the window.

## Recall calibration and the Choice-B verdict

The driver reports strict recall 2/18 overall (0.11), lenient 13/18 (0.72); within the
emergent remit strict 2/10 (0.2), lenient 6/10 (0.6). **Choice-B (strict ≥ 0.6 AND
lenient ≥ 0.85) is a MISS.** Per the owner-ratified graduate-or-decide doctrine
(napkin-corpus-discovery-run plan), the assessment is whether the gap cost real
discovery. Two mechanisms explain the gap, checked first-hand:

1. **The fixture is aged relative to the window.** The 18 baselines were frozen for the
   February–June corpus. The four hard misses — `inherited-state-is-a-hypothesis`,
   `coordinator-amplifies-unseen-defect`, `cron-template-overrides-owner-direction`,
   `reviewer-pre-execution-catch` — are all already-homed doctrine (respectively: the
   continuation-pointer contract in `start-right-team`; PDR-117/PDR-064 Director
   doctrine; the owner-input-precedence section of `liveness-heartbeat-cron`; the
   `pre-execution-code-expert-review-per-loop-cycle` rule). A pattern whose cure landed
   stops recurring in later napkins; its fading from the live corpus is evidence the
   cure took, not that the instrument failed. Baseline aging is therefore itself a
   longitudinal signal — see the extinction-dating proposal in §Routing decisions.

2. **The adversary de-duplicates framing-level restatements.** The killed candidates
   that carried baseline substance were inspected voter-by-voter from the committed
   validate checkpoint before this verdict was worded (the Cricket panel's adversarial
   leg demanded exactly this, and it was right to): C39, C40 and C65 were unanimous
   four-conjunct kills — principled rejections of it-all-deepened narrative arcs — and
   C58 failed consistently on the not-artefact conjunct alone. In each case a
   mechanism-grained sibling survived carrying the same evidence (C02 for the
   capture-does-not-cure thesis; C08/C10 for the coordinator-hazard observables). The
   recall gap measures de-duplication against existing homes plus fixture age, not lost
   knowledge.

**Verdict: graduate-with-gap-named, no re-run.** A re-run against a fixture calibrated
for a different corpus would spend ~10M+ tokens against a broken measuring stick.
Follow-on pointer (a pointer, not a spec): the next archive-scale pass should re-freeze
the recall fixture from the synthesis arcs that cover ITS window — this report and its
two predecessors in the marker chain — before spending.

## Rejected near-patterns

44 candidates were killed by the tiered adversary (quorum over four conjunctive tests);
the full list with per-voter verdicts is the committed validate checkpoint. The
instructive kills:

- **C39** (cure-tier escalation arc), **C40** (authoring-a-cure-precedes-violating-it),
  **C65** (Director drift out of view-and-direct) — unanimous four-conjunct kills: the
  grounding did not separate into the claimed shape against the null of an estate that
  writes about whatever it is currently fixing. Their evidence survives inside
  mechanism-grained keeps.
- **C76** (scale-growth topology arc) — tier-0 passed it; the escalation tier killed it
  on base-rate/null: any growing estate accretes scale vocabulary.
- **C07** (markdown lint traps) — genuinely marginal (2 pass / 2 fail voters, quorum
  kill); its substance is already homed in the wrapped-list-marker pattern and rides
  C10's whole-tree-gate finding.
- **C13** (hook-block treated as wording obstacle) — thin evidence (2 windows, 2
  groundings); a real behaviour the corpus under-evidences; left to future capture.
- **C29** (reviewer-fleet agreement is correlated, not corroborating) — killed on
  grounding specifics; note its thesis is independently homed in the
  reviewer-diversity doctrine (model-tier stance gradient; register-diversity lessons).

## Novelty stratification and routing decisions

The deterministic triage bands the 36 survivors: 15 moderate, 21 review-first; **2
novel** (no verified on-disk home), 34 re-confirming homes the driver verified exist
(34/34 corroboration rows, zero missing claims).

| Class | Count | Disposition |
| --- | --- | --- |
| Novel keeps | 2 | **Graduated this pass** (promote-on-first-instance): C06 → [`patterns/tool-default-scan-set-drift.md`](../../../memory/active/patterns/tool-default-scan-set-drift.md); C55 → [`patterns/collaboration-cli-interface-drift.md`](../../../memory/active/patterns/collaboration-cli-interface-drift.md) |
| Re-confirming keeps | 34 | `duplicate-of-home` — every claimed home driver-verified on disk; no new artefact (consolidate-at-second-consumer: the homes already exist) |
| Kills | 44 | `rejected` by adversary quorum; per-voter verdicts committed; five instructive kills recorded above |
| Reroute | 1 | C06 (the adversary's reroute verdict routed it to a different frame; it is one of the two graduations above) |

Every one of the 80 candidates therefore carries a terminal disposition recorded in the
committed checkpoints plus this table. Further routing:

- **Action-time-interrupt evidence pointer**: finding 1's measured flat-recurrence arc
  attaches as evidence to the existing
  `action-time-structural-interrupt-design-space` plan (backlog/future) — a pointer,
  not new scope.
- **Fixture re-freeze pointer**: named in the Choice-B section; rides MCP-531.
- **Play seed (association, not finding)**: *failure-class extinction dating* — the
  fixture-aging observation inverted: date a cure's landing by when its failure class
  vanishes from the napkin stream; a cheap curator instrument if last-occurrence dates
  correlate with cure landings on three test classes (falsifier included). One seed
  discarded visibly at the harvest: the windows-as-tree-rings image (pretty, added
  nothing beyond the regime-stratigraphy framing already in the partition design).

## Limitations

- The recall fixture mismatch is constitutive for this window (see §Recall); recall
  numbers here calibrate the instrument's sensitivity to OLD patterns only.
- Mapper windows read whole files; three windows are single large files, where
  within-file recurrence can inflate a leaf's apparent independence.
- The June segment (w01–w04) overlaps the July discovery run's corpus tail; overlap
  dedup landed at novelty stratification (banked July verdicts as corroboration input),
  not at validate dispatch — the merged-disposition completeness gate makes
  pre-validate skipping a machinery change, which was out of scope. Validate therefore
  re-adjudicated ~200 June leaves' worth of candidates at ~2–3M token cost; a
  banked-verdict pre-filter is a legitimate future engine refinement (pointer only).
- Same-seat synthesis: the seat that ran the pipeline wrote this report. The
  deterministic driver's zero-diff recompute and the committed per-voter verdicts are
  the independent checks; the Cricket panel (quartet ×2: 6 ON-TRACK, 2 DRIFTING)
  reviewed the closing shape, and every DRIFTING redirection was executed before
  this report was finalised — the voter-verdict hand-check on the miss-carrying
  kills (§Recall item 2), the C55/C06 novelty verification against the frictions
  register and the patterns directory, and leaving the plan live for the owner's
  morning glance rather than archiving tonight. The 6:2 tally routes to the
  Director with this resolution per the non-unanimous rule.
