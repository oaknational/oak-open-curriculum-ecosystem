# Large-corpus-analysis v2 — rerun readiness & launch runbook

**UPDATE (2026-06-30):** the rerun **RAN** — verdict **REFINE**; the kill-terminal-on-one adversary
design was superseded by the diverse-lens quorum ([PDR-122](../../practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md)).
See the run-record [`large-corpus-analysis-v2-rerun-result-2026-06-30.md`](./large-corpus-analysis-v2-rerun-result-2026-06-30.md).
The 2026-06-29 status below is historical.

**Status (2026-06-29):** the v2 **deterministic layer is built, reviewed, and committed**;
the **rerun is NOT run** — deferred by owner direction this session ("do not start any
major runs, the context is too low; finish preparing"). This runbook is the self-contained
launch vehicle: a fresh, execution-authorised session with adequate context launches the
rerun from this document alone. Design authority is the v2 design report
([`large-corpus-analysis-runbook-v2-design-2026-06-29.md`](./large-corpus-analysis-runbook-v2-design-2026-06-29.md));
the v1 spine (three lenses, time-contiguous windows, the four conjunctive apophenia tests)
is in [`large-corpus-analysis-runbook-design-2026-06-29.md`](./large-corpus-analysis-runbook-design-2026-06-29.md).

## What is already built (committed on `docs/consolidations`)

The deterministic layer lives in `agent-tools/src/corpus-analysis/` (88 unit tests; green
under build / type-check / lint / knip):

- **`judgment-schemas.ts`** — the atomic-judgment contract (LEAF, CANDIDATE, VERDICT,
  VOTER-OUTCOME) as schema-first zod; `Result`-returning boundary parsers.
- **`recall-schemas.ts`** — BASELINE, RECALL-MATCH, META; META's `z.strictObject` rejects a
  smuggled aggregate (the structural v1-defect fix).
- **`aggregation-recall.ts`** — `countReFoundBaselines` (the v1-bug fix, distinct-baseline
  counting), `recallReport` (stratified fractions), `meetsGraduateGate` (the dual gate),
  `findRecallIntegrityViolations`.
- **`aggregation-verdict.ts`** — `classifyVerdict` (conjunctive keep / base-rate-only
  reroute / kill), `isBorderline` (the Tier-2 trigger), `distinctGroundingWindows`.
- **`aggregation-adjudication.ts`** — `adjudicate` (the deterministic tier-0/1/2 quorum
  state machine; ensemble completeness; distinct-lens enforcement; tie + availability).
- **`cost-and-coverage.ts`** — `estimatePipelineCost` (pre-spend gate), `checkMapCoverage`.
- **`real-world-signal.ts`** — `corroborateAgainstHomes` (on-disk corroboration close).
- **`recall-baseline-fixture.ts`** — the frozen 18 baselines, 10 emergent / 8 single-window.

The **graduate gate is owner-confirmed Choice B**: strict within-remit ≥ 0.6 **AND** lenient
within-remit ≥ 0.85 (a fidelity floor paired with a coverage floor; v1 was 0.5 / 1.0, so it
would fail Choice B on the fidelity leg — refine, not graduate).

## Corpus partition (re-derive at launch — never trust a frozen count)

Census at 2026-06-29: **100 files, ~3.9 MB, ~1.0M tokens (bytes ÷ 4), 2026-02-16 →
2026-06-29.** Re-derive the date-ordered file list and token-balanced windows at launch:

```bash
# date-ordered napkin corpus (archive + active), with byte size
for f in .agent/memory/active/archive/napkin-*.md; do
  d=$(echo "$f" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' | head -1)
  echo "$d|$(wc -c < "$f")|$f"
done
echo "2026-06-29|$(wc -c < .agent/memory/active/napkin.md)|.agent/memory/active/napkin.md"
# then sort by date and walk, opening a new window when the running byte total would
# exceed ~300 KB (~75k tokens). At the 2026-06-29 corpus the greedy walk yields ~14–15 windows
# (the v1 run was 14; the corpus has grown since — re-derive, never verify against a frozen count).
# Largest single file is
# ~203 KB (napkin-2026-05-24) — under one window, so no file is split.
```

Partition is **deterministic code, not an LLM agent** (the v2 principle). Compute the
window→files map in the launch step and pass it to the Workflow as `args`.

## The rerun pipeline (harness Workflow)

`setup (deterministic, pre-Workflow)` → `map ×N, one per window (Sonnet, low/med)` → `reduce (Opus, high)`
→ `validate (Opus, tiered adversary)` → `meta (Opus, high)` → emit atomic-judgment JSON →
`post-run aggregation (tsx driver, imports the repo module)`.

**The sandbox cannot import repo code.** So the Workflow script **mirrors** the schema shapes
and the three routing functions (`classifyVerdict`, `isBorderline`, `adjudicate`) that drive
in-flight tier escalation; a **conformance test** (add before launch — see below) pins the
mirror to the source. All non-routing aggregation (recall, the dual gate, integrity,
coverage, corroboration) runs **after** the Workflow in the tsx driver, which imports the
real module — so the only mirrored logic is the small, pure routing core.

### Stage prompts (atomic judgments only — no counts, no aggregates)

- **map (per window, Sonnet):** extract LEAF signals in the five spanning categories
  (motif / surprise / tension / shift / behavioural-reflex), high recall, false positives
  welcome. Each leaf: `{id, window, category, statement, grounding:[{napkinDate, quote}],
  confidence}`. Emit only leaves for THIS window.
- **reduce (Opus):** cluster leaves across windows into CANDIDATE emergent patterns
  `{id, pattern, kind, isAbsenceClaim, supportingWindows, supportingLeafIds, groundingCount}`,
  plus the negative-space probe (temporal: present-early-gone-later; structural: the napkin
  skill's declared "mistakes, corrections, surprises, what works" vs actual contents).
- **validate (Opus, the tiered adversary):** per candidate, one voter emits the VERDICT —
  the four `{pass, confidence}` tests (`grounded`, `baseRateHolds`, `survivesNull`,
  `notArtefact`) + `importance`. The script's mirrored `adjudicate` decides the next tier
  (Tier 0 → Tier 1 confirmer on a clean keep → Tier 2 three diverse lenses on borderline /
  dissent / reroute). Tier-2 voters carry a distinct `lens`
  (correctness-grounding / base-rate / null-reproduction). Absence candidates get the absence
  falsifier (show genuinely absent, not merely unsampled). The voter never emits a disposition.
  Build the validator with a robust verdict schema and a repair-retry on a StructuredOutput parse
  failure before recording an unadjudicated outcome — this is the design's PRIMARY C06 cause-cure
  (v1 lost a candidate to the 5-retry cap); the graceful quorum already in the module (unadjudicated
  voters excluded from the denominator) is only the symptom-cure.
- **meta (Opus):** per-baseline RECALL-MATCH `{baselineId, verdict ∈
  subsumes|refines|equal|partial|missed, matchedCandidateId?, note}` against the 18 fixture
  baselines, plus corroboration claims `{candidateId, claimedHomePaths}` naming on-disk
  pattern/rule homes for kept candidates, plus qualitative `discountNote` + `synthesisNotes`.
  No numbers.

### Post-run aggregation driver (tsx, imports `agent-tools/src/corpus-analysis/`)

Feed the Workflow's emitted judgments into the real module:

1. `findRecallIntegrityViolations({matches, baselines: RECALL_BASELINES})` — must be empty.
2. `recallReport({matches, baselines: RECALL_BASELINES})` → the stratified fractions.
3. `meetsGraduateGate(report, {minStrictWithinRemit: 0.6, minLooseWithinRemit: 0.85})` — Choice B.
4. `checkMapCoverage({windows})` — no window silently under-extracted.
5. `corroborateAgainstHomes({claims, existingHomePaths})` where `existingHomePaths` is a scan
   of `.agent/memory/active/patterns/` + `.agent/rules/`.
6. Per-candidate final disposition by replaying `adjudicate` over the gathered voter outcomes.

## Cost gate

`estimatePipelineCost` runs **before** the spend with an explicit per-stage effort table
(map Sonnet/low; reduce, validate, meta Opus/high — never inherited from the session). Target
~1.3M tokens at the corrected tiering (v1 overspent to ~4.4M by inheriting xhigh on all 14 map
agents). **Abort ceiling: 2,000,000 tokens** (≈1.5× the estimate, well below the v1 runaway).
If the estimate exceeds the ceiling, abort and re-tier.

## Launch steps (fresh session)

1. Be on `docs/consolidations` (carries the built module + this runbook), execution-authorised,
   with adequate context budget.
2. Re-derive the corpus partition (above); confirm the windows are token-balanced and 0 files
   split (expect ~14–15 at the current corpus — do not verify against a frozen count).
3. **Add and run the conformance test** mirroring `classifyVerdict` / `isBorderline` /
   `adjudicate` (assert the Workflow's mirrored copies match the repo module on a shared
   fixture) — do NOT launch with an unverified mirror.
4. Run `estimatePipelineCost` over the planned stage partition; confirm ≤ 2M ceiling.
5. Launch the Workflow (map → reduce → validate → meta); collect the emitted judgment JSON.
6. Run the tsx aggregation driver; produce the run-record (curator-passes shape) presenting
   kept / killed / held-for-review / out-of-remit / discounted candidates + the stratified
   recall + the Choice-B verdict + corroboration.
7. **Graduate-or-decide:** Choice-B pass + clean apophenia gate → graduate to a PDR-120
   reference runbook + the adopting PDR (PDR-035). Fail → name the defect and route. No
   holding state.

## What to carry forward / distrust

- The mirror is the one place logic is duplicated; the conformance test is non-optional.
- v1's "failure" (0.28/0.56) was mostly measurement error v2 fixes; the honest question the
  rerun answers is whether the method re-finds the emergent spine within Choice B, on numbers
  that are now deterministically computed and stratified.
- **Expectation-setting (read before interpreting the result):** the Choice-B gate was
  calibrated knowing v1's within-remit recall was 0.5 strict / 1.0 lenient, and v2's changes
  are all in the *aggregation* layer, not *extraction* — so v2's strict within-remit is likely
  to land near 0.5 again. A **refine-again verdict is a plausible and acceptable outcome, not a
  failure**: the rerun's value is the honest, stratified, deterministically-computed numbers
  plus the apophenia kill/keep gate and the real-world-signal close. Do not over-read a ~0.5
  strict result as the method failing; read it against the dual gate and the full run-record.
  (This is expectation-setting, not a pre-judgement — the per-baseline judgments run honestly.)
- Quota is the owner's concern; the rerun runs fresh (no cross-session Workflow cache).
