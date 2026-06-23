# WS4 — PENDING-FH anchor verification (consolidated lane)

**Owner:** Kayak herds Ballast (claude-code / Opus 4.8 / `328eee`). Inherited the consolidated
comms-corpus research lane on 2026-06-13 — Geyser stirs Bronze closed claim `eb88ee15` and stood
down (channel turn 3); Katydid + Myrtle previously retired. This file promotes the taxonomy's
PENDING-FH anchors to FH (first-hand confirmed), CORRECTED, or REFUTED by my own reads of the cited
events.

**Method / conduct:** corpus events are input-to-verify; I read each cited event first-hand. Findings
are **provisional research evidence, not ratified doctrine**; cures route through the plan-body
first-principles check + a named consumer plan before hardening. Conserve insight — do not prematurely
narrow.

## Priority anchors (feed Flame's oak-pr plan) — verified first-hand by me

### T7 — Commit-queue wrapper false-FAIL (mediated-vs-direct divergence) — **FH-CONFIRMED**

Taxonomy claim (was HARVEST(2), PENDING-FH): `commit-queue -- commit` dies at the depcruise line in
captured-hook-output mode while the identical direct `git commit` passes; five instances, two agents,
one day (`5ef5f1c0`).

First-hand verification: `5ef5f1c0` (Fern lifts Mulch, behaviour-note) §(3) states verbatim —
*"`commit-queue -- commit` fails with captured hook output dying at the depcruise line while the
standalone hook AND the identical direct `git commit -F <msg> -- <pathspecs>` both pass — five
instances, two agents, 2026-06-12; spawn/capture defect in the workflow, not the tree."* Two agents =
Fern + Monsoon guards Cirrus (who hit it 3× on wt:statusline-enhancements). Consistent with the
session-open `commit_queue` abandoned entries whose captured hook output ends around the depcruise
stage. **Verdict: PROMOTE PENDING-FH → FH.** A real tooling false-FAIL: the mediated (spawn/capture)
path fails where the direct path succeeds — defect in the wrapper, not the tree. **Consumer:** Flame
owns the T7 commit-queue-wrapper tool-fix slice (oak-pr / agent-tools commit-queue lane).

(Note: an initial precision-suspicion that the failure was at the knip stage, not depcruise, was
checked and DISMISSED — Fern's primary account explicitly names the depcruise line.)

(Correction 2026-06-13, cross-attested with Geyser stirs Bronze: the instance COUNT was overstated.
Fern's §(3) reports "five instances," but FH-enumerable = Monsoon ×3 + Fern ×1 = **4** — matching the
four abandoned `commit_queue` entries in `active-claims.json` at session open. The reported 5th is
unlocated; the napkin marks Tempest's worktree-lockout a *sibling* (different signature). State as:
**4 FH-enumerable across 2 agents; reported 5th unlocated.** Mechanism confirmation unaffected — I had
taken Fern's count at face value rather than enumerating.)

### CC4 — Whole-tree-gate × mid-authoring-peer interference — **FH-CONFIRMED (instance); structural-universality held as hypothesis**

Taxonomy claim (was HARVEST(1), PENDING-FH): one agent's untracked in-flight edits break whole-tree
lint/type gates for a peer's commit; structural because whole-tree gates + shared tree + mid-authoring
peers always co-occur (`031852ab`).

First-hand verification: `031852ab` (Sparking Melting Magma) — *"My t20 commit attempt blocked at
pre-commit gate on graph-core lint. Failure surface: 8 ESLint errors in
`packages/core/graph-core/src/graph-view/index.ts` (currently UNTRACKED — never committed; appears to
be substantive WS4.4 source authoring in progress [Foamy])."* This is exactly the claim: a peer's
untracked in-flight edits break the whole-tree gate for another agent's commit. **Verdict: PROMOTE
PENDING-FH → FH for the instance.** **Conserve-don't-narrow caveat:** "structural — always co-occur"
is a sound generalisation from this one strong instance, not corpus-proven; keep it as a
well-grounded instance plus a reasonable structural hypothesis. **PR-rule it feeds:** gate scope vs
authoring boundaries (whole-tree gate on a shared tree with mid-authoring peers).

## Remaining PENDING-FH anchors — verified

16-anchor first-hand verification (Sonnet adversarial-FH fan-out, one verifier per anchor reading the
cited events; the 2 miscited verdicts spot-checked by me directly). Full per-anchor detail:
`2026-06-13-ws4-anchor-verify-evidence.json`. Corrections recorded here (companion) — Myrtle's
taxonomy is relinquished and not edited in place.

**FH-CONFIRMED → promote PENDING-FH → FH (8):** SC5 (byte-identical coordinator-handoff 22 s apart,
no dedup — `c3d41f43`/`461982a5`), SC10, T6 (truncate-rewrite replays `tail -F` from offset 0 —
`86e94e54`), T9, CC5 (`d2e41650`, SDK-codegen-bump cascade RED blocking all commits), CC6
(`34f27c35`, stale `git:index/head` claim blocks a peer), X1, R1. Cited events read first-hand;
claims supported. (CC5/CC6 anchor ids cross-attested with Geyser stirs Bronze's independent FH read.)

**CORRECTED, core holds → promote with framing fix (3):**
- **S8** — gap numbers exact FH (max inter-beat 3,168 / 3,247 / 3,168 s for Firefly / Cosmos / Moss,
  2026-06-12 overnight). Correction: "simultaneously gapped" overstates — the three *maxima* are
  staggered/consecutive; genuine three-way ~30-min silence windows do exist (00:28–01:00, 02:48–03:21).
  R6's "synchronised ~30-min holes" is the accurate framing. "Indistinguishable from inactivity" sound.
- **SC8** — directed events carrying `message_kind:"narrative"`: "21 instances" is the R1 window only;
  **full corpus = 66** (more pervasive than stated). Update the count.
- **SC9** — ~167 pre-`--tag` untagged heartbeats: core mechanism + stratigraphic boundary
  (2026-05-24T10:18Z) + CLI-no-`--tags` causal root all FH-confirmed.

**CORRECTED, hold at NOTE (3, not promoted):**
- **T8** — social-convergence-≠-proof insight real (only the reviewer who *ran* the stale-filter
  command caught it); some detail correction; hold.
- **C1** — pre-positioning-before-acknowledgement is real and correctly cited (`c020b3d6`); held pending
  a cleaner second instance.
- **I1** — `212cbf34` miscited (it is a directed commit-handoff, not a team-start); the dirty-tree-growth
  pattern is real but the citation/class need correction.

**MISCITED → taxonomy correction needed (2; spot-checked by me first-hand):**
- **S7** — cited `f8cf9ad3` (Feathered pairing-feedback closeout) + `37d9e374` (light handoff) do NOT
  support "33 beats / 2h20m runaway loop after declared stop". What they DO support: a Codex
  signal-isolation constraint (closed stdin / blocked process-listing → cannot signal background loops
  → Feathered forwent opening loops). **Cure:** drop the unverified 33-beat/2h20m quantifier; keep the
  real (unquantified) Codex-signal-isolation finding; the Tempestuous/Evergreen 3–6 s shutdown-race
  half has no cited event and must be separately sourced before any promotion.
- **T5** — cited `8891b583` is Sylvan's reliability-queue-merge closeout (#166/#167), not a
  `--fix`-rewrites-ARC-channel instance. **Cure:** find the correct source event or downgrade T5; the
  append-only-channel-rewrite mechanism may still be real (cf. T6 truncate-rewrite) but `8891b583` does
  not evidence it.

**Net:** 8 confirmed + 3 confirm-with-fix promote to FH; 3 hold at NOTE; 2 miscited corrected. The
adversarial-FH pass caught 2 miscitations + 6 corrections while conserving every real finding — the
input-to-verify discipline earned its keep again.

## Instance-count adds (from Geyser's REVIEW disposition; provenance Geyser-FH)

Geyser's ~37 REVIEW-bucket hand-disposition (`2026-06-13-ws4-review-disposition.md`) returned **0 new
spine class** (structure holds; tagged population confirmed a lower bound) plus 5 keyword-missed
instances of EXISTING classes — instance-count adds that do not change any verdict. Provenance is
Geyser's first-hand read (not re-read by me; flagged Geyser-FH, fold-only):

- `9a164c5c` → **S4** (new instance)
- `40a6ce09` → **S5** (new instance)
- `14eab105` → **D/CC** — same-file cross-cycle staging contention + revert-and-sequence cure (new instance)
- `5ef5f1c0` → **T7** — already my FH anchor (the same event; not a new count)
- `f5cc5f2d` → **T8** — already cited in T8 above (stale `--filter` caught only by running it)

**For WS6 (what-worked-well, keyword-missed, Geyser-FH):** `9a8004cd` (marshal hex-leak survey +
write-time-only-hook coverage note), `15c5cd23` (execution-start re-verify caught a stale committed
corpus), `c1054b3b` (reviewer-divergence handled by the different-lens pattern), `a15363e5` (reviewer
fan-out converged).
