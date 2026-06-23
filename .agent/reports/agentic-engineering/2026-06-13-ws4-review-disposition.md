# WS4 — REVIEW-bucket hand-disposition (the keyword-missed completeness pass)

**Author:** Geyser stirs Bronze (claude-code / Opus 4.8 / 3636b0), claim `6603978f`. Companion to
Myrtle's `2026-06-13-ws3-disposition-ledger.md` (I do NOT edit her relinquished ledger; this is the
hand-disposition of its 37 `REVIEW` rows — the bucket the keyword-bucketing could not classify).
**Purpose:** the REVIEW bucket is *where any keyword-missed failure-mode hides* (ledger caveat). This
pass hand-disposes all 37 first-hand: each → an existing taxonomy class, a what-worked record, or a
routine coordination-record. **Net result: the bucket hides keyword-missed *instances of existing
classes*, not a new class — confirming the class structure is complete and the tagged population is a
lower bound.** Owner steer: conserve insight, don't prematurely narrow; provisional evidence.

## Net finding

- **Keyword-missed failure-mode instances of EXISTING classes (5):** `9a164c5c`→**S4** (relative
  comms-path retarget), `40a6ce09`→**S5** (conversation/escalation CLI broken), `5ef5f1c0`→**T7**
  (commit-queue-wrapper false-FAIL — the anchor itself), `f5cc5f2d`→**T8** (FH: stale package filter
  caught only by *running* it — `@oaknational/oak-curriculum-sdk` vs live `@oaknational/curriculum-sdk`),
  `14eab105`→**D/CC** (same-file cross-cycle staging contention). These were bucketed REVIEW because
  the keyword pass keyed on title genre, not body — each is a real instance the tag census undercounts.
- **What-worked records (keyword-missed):** `9a8004cd` (Quality-Marshal survey caught 6 hex-token
  leaks in 4 permanent-doc files — and surfaced that the `no-moving-targets` hook is *write-time only*,
  missing pre-existing tokens: a minor tooling-coverage gap worth a note), `15c5cd23` (execution-start
  re-verification caught a committed vocab corpus stale 2026-03-07 vs live 2026-05-21 — fork surfaced
  to owner), `c1054b3b` (reviewer divergence test-GO/code-NO-GO synthesised via the
  `different-lens-reviewer-divergence` pattern), `a15363e5` (PR-108 4-reviewer fan-out converged),
  `14eab105` (detect-and-sequence cure for the staging contention above).
- **Zero NEW spine failure-modes.** The failure-suggestive rows all map to existing classes or are
  what-worked. The keyword-missed bucket does not surface a new class → the taxonomy's structure holds.

## Full disposition (37 rows)

| id | disposition | basis |
| --- | --- | --- |
| 9a164c5c | **S4** (failure-mode) | title explicit; known S4 anchor |
| 40a6ce09 | **S5** (failure-mode) | title explicit; known S5 anchor |
| 5ef5f1c0 | **T7** (failure-mode) | the T7 anchor (FH-verified this pass) |
| f5cc5f2d | **T8** (failure-mode) | FH read: stale `--filter` caught by running it |
| 14eab105 | **D/CC** (failure-mode + cure) | FH read: same-file cross-cycle staging contention, revert+sequence cure |
| 9a8004cd | what-worked + tooling-gap note | FH read: marshal survey caught hex leaks; write-time-only hook gap |
| 15c5cd23 | what-worked | FH read: execution-start re-verify caught stale corpus |
| c1054b3b | what-worked / coordination | FH read: reviewer-divergence synthesis via named pattern |
| a15363e5 | what-worked / coordination | reviewer fan-out converged (PR-108) |
| 7914816b, af29866b, d0648087, 33fb0359, ad00bcfc, 6822e169, 0de38ad0, 01cfbcfa, 3a534015, 9bafbb9d, 85fec4bc, f748c64f, aefaa645, 45185267, 570ca81f, 112df9f5, 735d527e, 2c3f7ecf, ef0c18a1, 8334097b, 53b9ba3a, 763aba70, be004b9b, c28056d4, fdf0663a, 0021b0bc, 7c9902f8, 5df838b4 | coordination-record (non-failure) | routine: marshal/gate/curation/EEF/review-dispatch/ownership-transfer/plan records (title genre) |

## Routing

- The 5 keyword-missed failure instances are folded as additional instances of S4/S5/T7/T8/D — they
  do not change verdicts; they raise instance counts and confirm the lower-bound caveat. Hand to
  Kayak for the consolidated anchor home if useful.
- The `no-moving-targets` **write-time-only hook gap** (`9a8004cd`) is a minor tooling note — candidate
  for the rightsizing/hygiene lane, not a spine class.
- What-worked records feed the WS6 what-worked-well appendix.
