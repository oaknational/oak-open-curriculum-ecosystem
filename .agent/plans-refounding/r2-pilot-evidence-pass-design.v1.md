# r2 — Pilot-area evidence pass: design (v1, DRAFT for Director review)

Authored 2026-07-15 by Aurora guards Penumbra (2226bf), team Mango, S2 seat,
under the Director r2 remit (wake event `72687e20`; claim `a1e8fa1a`).
**DESIGN ONLY — nothing here dispatches.** Any dispatch requires Director
routing plus the owner's declared go with agent count and model tier (the
standing constraint carried in the Director handoff record §2). Companion
artefact: `.agent/plans-refounding/r2-lane-seed.v1.md` (the taxonomy this
pass evidences). Both are Walk-A sitting inputs alongside the committed
divergence report (`plan-state.v1.report.json`, 1,960 rows).

## Purpose

Give the Walk A sitting EVIDENCE for ratifying the lane taxonomy, instead
of a bare top-down proposal: measured lane-assignment agreement, boundary
disagreement located to lane pairs, holding-share, and empty-lane signals —
with the assignment machinery itself proven able to fail (sealed canaries,
P4) before its output is trusted.

## Non-goals

- **No full-estate evidence pass** — deliberately not run pre-calibration
  (the r2 todo names this).
- **No row dispositions, homes, or destination authoring** — that is r3's
  unified row-judgement stage (J4); this pass evidences the LANE AXIS only
  (J6).
- **No corpus mutation of any kind** — read-only over frozen bytes; outputs
  land under `.agent/plans-refounding/` as new protocol artefacts (a P2
  sanctioned-writer class).

## Pilot-area selection

Criteria (from the controlling plan r3 note + priors): (a) small enough for
one end-to-end batch; (b) self-contained (low cross-collection concept
bleed); (c) status-rich (rows across classes, including unmapped prose
statuses); (d) **no live seat activity** (the pilot area must have no
active lanes so arrival machinery and live-lane ruling demand stay
prior-priced until batch 2); (e) exercises a genuine lane boundary, because
lane-assignment judgement is what the pilot calibrates.

Data over the candidates (from the S2 ledgers + divergence report):

| Area | Files | Ledger rows | Status rows | Unmapped |
| --- | --- | --- | --- | --- |
| connecting-oak-resources | 16 | 2,099 | 103 | 11 |
| user-experience | 19 | 1,420 | 27 | 9 |
| discovery | 16 | 1,432 | 20 | 12 |
| school-data-search | 4 | 382 | 23 | 1 |
| telemetry-and-understanding | 4 | 956 | 33 | 2 |

**Verdict: `connecting-oak-resources`.** Mid-small (3% of the estate's
69,661 rows), self-contained (the EEF/evidence-convenor scope with a clean
stream mapping), status-rich (103 rows, 11 unmapped prose values), no seat
currently works it, and it sits on a real boundary — engineering-tools vs
mcp-app vs capabilities (evidence surfaces feed the app; convening is
`TOOLS-3`) — so the 2-lens machinery meets genuine judgement, not layups.
Alternates, and why not first: `user-experience` (good prose-status
density, but its rows straddle app UX and practice surfaces so it tests
falsifier 2 better than it tests clean assignment — a good BATCH-2
candidate chosen WITH active lanes per r3); `school-data-search` (smallest,
but only 4 files — too little judgement surface to calibrate on).
Re-check at pilot open: confirm no claim in `active-claims.json` touches
`plans/connecting-oak-resources/**` (criterion d is time-sensitive).

## Sample design (stratified; strata narrow the QUESTION, never coverage)

Assignment unit: the **plan file** (lane is a file-level property at this
stage; the priors' concept unit arrives at r3/J4). Within-file lane splits
are recorded as a flag + quoted spans, not resolved — they are falsifier-2
evidence, not work items.

| Stratum | Definition | Size (measured, manifest v1) |
| --- | --- | --- |
| S-A pilot area | ALL md plan files in `plans/connecting-oak-resources/` | 16 files |
| S-B estate spread | Per collection: ceil(10% of files), min 2, cap 8; indices floor(j·n/k) over code-unit-sorted paths — recomputable, no RNG | 86 files |
| S-C residue hosts | The report's raw distinct unmapped-status hosts number 191 (the manifest's `inputs.unmappedHostFiles`); intersecting with the 643-file inventory denominator leaves 160 ELIGIBLE hosts (measured at manifest generation — the drafted "≤40" estimate was wrong by 4×). Sampling every eligible host would breach the declared invocation ceiling, so S-C applies the SAME per-collection k-rule draw over the eligible hosts not already drawn by S-A/S-B — bounded, evenly spread, recomputable | 35 files |
| Total | | 137 files ≈ 21% of the 643-file denominator |

The generated manifest (`r2-evidence/sample-manifest.v1.json`) is the
draw of record: byte-identical on re-run (proven at generation), carrying
the draw rule, the strata, and the per-lane expected-reach denominators
(every seed lane reaches ≥5 sampled files; `compliance-and-readiness` is
the floor at 5 — the small-collection effect condition 1 anticipated).

Every seed lane either receives assignment rows or its emptiness becomes
recorded evidence (falsifier 1) — S-B guarantees estate-wide reach.

## Task shape (J6 judgement fleet; 2-lens + escalation-only-third)

Per sampled file, two INDEPENDENT lens agents, blind to each other:

- **Lens A — derivation lens**: from the file's stated intent (frontmatter,
  lineage, opening framing): which seed lane does this plan SERVE? One value
  from the closed list — the 7 seed lanes plus `re-home-by-function` — no
  free text, no abstention. `re-home-by-function` is for wrong-kind content
  (operational records, evidence, research living inside the plans tree),
  which per the priors' homeless-concepts cure 1 re-homes by FUNCTION and
  never into a lane; keeping it out of `conservatory` keeps the holding
  lane clean for valuable-but-unplaced INTENT, so the holding-share
  falsifier measures taxonomy fit, not filing debris. (Amendment found
  during canary-key authoring, 2026-07-15.)
- **Lens B — content lens**: from the body's todos/outcomes/evidence: which
  lane do the file's concepts actually advance? Same closed list; plus the
  within-file split flag with quoted spans when concepts pull to a second
  lane.

Both lenses return schema-forced structured output:

```json
{
  "file": "plans/<collection>/<lane>/<name>.md",
  "lane": "one of the 8 closed values: the 7 seed ids | re-home-by-function",
  "confidence": "high | medium | low",
  "warrant": "<=40-word quote-anchored justification",
  "splitFlag": false,
  "splitLane": "the SECOND lane pulling, one of the 8 closed values — null unless splitFlag is true; feeds falsifier 2's lane-pair co-occurrence matrix",
  "splitSpans": [],
  "subLaneQualifier": "free-text sub-lane qualifier, recorded ONLY when lane = engineering-tools and the assignment needed one to be usable — null otherwise; feeds falsifier 5"
}
```

The two structured fields exist because two falsifiers need deterministic
inputs a flag and quoted spans cannot encode: falsifier 2 computes lane-pair
co-occurrence from `splitLane`, and falsifier 5 counts `subLaneQualifier`
usage; the evidence report's contract (below) consumes both.

- **Agreement** (same lane) → an assignment-evidence row.
- **Disagreement** → the escalation-only-third lens (a senior-tier agent
  receiving BOTH verdicts + warrants) rules and records the lane pair —
  falsifier-4 evidence. The third lens fires ONLY on disagreement.
- Workers judge from supplied file bytes (frozen copies) — no repo
  exploration; the dispatcher supplies untruncated file content per J8's
  decision-complete brief discipline.

## Sealed lane-assignment canaries (P4; `plant-challenge-canary` SEAL mode)

The pass's catch-machinery must prove it can fire before any zero/agreement
is trusted:

1. The protocol author hand-authors a **key set of 14 rows**: 12
   unambiguous files (≥1 per seed lane, first-hand evidence quoted per
   row — the OG-3 ~15-row shape) + 2 deliberately-ambiguous files whose
   KEY is "must escalate" (proves the escalation path fires, not just lane
   matching).
2. Seal BEFORE any lens runs: `refound-plant-challenge-canary --mode seal
   --keys <key-set>` commits the sha256 of the key set's exact bytes
   (hash-commit-then-reveal; the commitment lands under
   `.agent/plans-refounding/challenge/`). CORRECTED at execution
   (2026-07-15): seal mode schema-validates the key as the strict plant
   shape (`version`/`ratePercent`/`salt`/`plantedBlockIds`) — it is NOT
   generic over arbitrary key bytes, extending the score-mode tooling seam
   already flagged. The lane key rides it honestly by encoding: each keyed
   row as one id string `lane-canary:<file>:<lane>`, `ratePercent: 0` (no
   rate-derived selection in play), a real nonce salt, plus one id
   `evidence-doc:canary-key.v1.json:sha256:<hex>` pinning the full
   evidence-bearing key document — so the tool's commitment covers BOTH
   the lane mapping and the evidence bytes. The evidence doc + key set
   stay dispatcher-held (untracked) until reveal; only the commitment is
   committed pre-batch. Generalising seal/score beyond the plant shape is
   the tooling lane's, not this pass's.
3. Canary files ride the sample UNLABELLED (they are ordinary S-A/S-B
   members; the key stays outside the fleet's read scope).
4. After the pass: reveal, verify bytes against the commitment (mismatch =
   refusal), score deterministically (jq comparison of key rows vs
   assignment rows — the tool's score mode is plant-shaped, so lane-canary
   scoring is a dispatcher-side recomputation; noted as a small tooling
   seam for the tooling lane, not assumed away).
5. **Acceptance gate**: 12/12 unambiguous canaries assigned to their keyed
   lane by the AGREED verdict, and 2/2 ambiguous canaries actually
   escalated. Any miss → the pass's evidence is not presented to Walk A;
   the task design (not the taxonomy) is treated as the defect first (P3's
   refusal posture applied to lens design).

## Verification and outputs (deterministic)

- Format conformance + count parity: every sampled file has exactly 2 lens
  rows (+1 escalation row where fired); schema-validated; dispatcher
  recount, never sampling.
- Determinism of the sample: the S-A/S-B/S-C draw is a pure function of
  the frozen inventory + the report — recomputable byte-identically.
- Outputs (new artefacts under `.agent/plans-refounding/`):
  `r2-evidence/lane-assignments.v1.jsonl` (all lens + escalation rows),
  `r2-evidence/lane-evidence.v1.report.json` + `.md` (per-lane counts,
  agreement rates, lane-pair disagreement matrix, holding-share,
  within-file split census, canary scores, each falsifier evaluated
  against its threshold), and the sealed-then-revealed canary key +
  commitment under `challenge/`.
- **Expected-reach denominators** (Director review condition 1): the
  evidence report carries, per seed lane, the assignment rows the
  S-A/S-B/S-C draw COULD have reached (computed from the seed doc's
  coverage-check table + the draw parameters). Falsifier-1 (empty-lane)
  verdicts are judged against expected reach, never raw share — a lane
  fed only by small collections is under-reached by construction under
  the min-2/cap-8 draw, and that is a sampling fact, not lane evidence.
- **Canary provenance labelling** (Director review condition 2): the
  canary key is authored by the same seat that authored the seed, so
  canary scores measure lens agreement with the SEAT's boundary reading,
  not ground truth — acceptable for what P4 proves (the machinery can
  fail and the escalation path fires). The evidence report labels all
  canary scores: "key seat-authored; owner ratification rides Walk A per
  OG-3", and every key row carries its first-hand quote.

## Budget declaration (for the owner's go; numbers are the ceiling)

- Lens invocations: 137 files × 2 lenses = 274 (the measured manifest,
  not the drafted estimate); escalations ≤ 41 (a >30% disagreement rate
  would itself be a stop-and-surface); canary authoring was seat-side,
  zero fleet spend. **Ceiling: 320 invocations.**
- Model tier proposal: lenses sonnet-tier (closed-list judgement over
  supplied bytes; the S1 reader lesson — small models judge reliably when
  they point rather than copy — applies); escalation lens fable/opus-tier.
- Estimated tokens: ~15k per lens invocation (file bytes + brief + output)
  → ~4.8M ceiling; wall-clock one session; batch-sequential with the
  deterministic breaker per P12. Declared in full before dispatch per the
  pre-declaration discipline (P12). AUTHORISATION STATE (resolved
  2026-07-15/16): the FINAL declaration (post-seal, measured manifest)
  was routed to the Director and OWNER-APPROVED via a Director-session
  decision card, ANCHORED TO MERGE-TO-MAIN of this document's landing PR —
  the merge satisfies the anchor but dispatch additionally requires the
  designated executor (a fresh dispatcher session per the owner's
  2026-07-15 staffing ruling); merging this PR is NOT itself permission
  for any session to spend the declared 320 invocations.

## Acceptance criteria (the pass, not the taxonomy)

1. Canary gate green (12/12 + 2/2 as above).
2. 100% of sampled files carry an agreed or escalation-resolved lane.
3. Every falsifier in the seed doc §Falsifiers evaluated with its measured
   value in the evidence report.
4. All outputs recomputable: schemas validate, counts reconcile against
   the sample manifest, the draw re-derives byte-identically.

## Failure modes designed against

- **Plausible-but-blind pass** → sealed canaries with an escalation pair
  (P4/B1).
- **Lens homogenisation** (both lenses same-shaped → false agreement) →
  the lenses read DIFFERENT evidence (stated intent vs body content) by
  construction.
- **Force-fit** (no honest fallback → everything lands somewhere) →
  `conservatory` in the closed list + holding-share falsifier.
- **Worker copy-drift** (the S1 lesson) → workers return lane ids + short
  quotes only; all counting/scoring is dispatcher-side recomputation.

## Routing

This design + the seed doc route to the sitting Director (Mussel rides
Coral, 6f8857) for review. After Director review: canary key authoring +
seal (seat-side), then the dispatch decision (Director routing + owner
declared go). Landing of these two artefacts to the tracked tree rides the
normal branch/PR path once the Director's review verdict is in — nothing
lands to main from this seat without that review.
