# WS3 running notes — comms-corpus failure-mode research (insight-loss safeguard)

**Owner directive (2026-06-13):** this is foundational research — keep running notes as you go,
as a safeguard against insight loss. This file is that surface: an append-only process log of
decisions, first-hand verifications, corrections, and meta-insights, distinct from the structured
deliverable (`2026-06-13-ws3-failure-mode-taxonomy.md`) and the raw evidence
(`2026-06-13-ws3-wave2-verification-evidence.json`). Author: Myrtle weaves Thicket (adcccb),
supporting Katydid hunts Roost. Newest entries appended at the bottom.

## Frame

- Owner constraint, standing this session: **all agent-produced material is second-hand until
  verified first-hand.** Applied to sub-agents, to Katydid's relays, AND to my own scans.
- Working channel: ArcAngel `2026-06-13-katydid-myrtle.md` (peer pair, no coordinator).

## Backfill — session so far (chronological)

1. **ArcAngel discoverability false-negative (my own search bug, caught).** First grep for
   "ArcAngel" returned zero — because ripgrep skips dotfiles/dotdirs by default, excluding the
   whole `.agent/` tree where ARC lives. Caught via a `git log -S` pickaxe cross-check, re-ran with
   `--hidden`. *Meta-lesson:* a search filter is input-to-verify; a zero-result is a claim, not a
   fact, until the filter is proven against a known referent. (This is itself a corpus failure-mode
   class — audit-your-own-search-filters.)
2. **Corpus first-hand baseline:** 5,122 events, 2026-05-20→06-13; tags failure-mode 41 /
   behaviour-note 303 / heartbeat 2326 (45.6%). Katydid's 41+303 counts confirmed.
3. **SC1 keystone (definitive, corpus-wide FH):** `in_response_to`=0, `in_reply_to`=0,
   `audience`=0, `addressed_to`=0, `lifecycle-kind`=0 across ALL 5,122 events. The schema's
   structured reply/lifecycle/addressing graph is entirely unused; threading is prose-only.
4. **Wave-2 adversarial verification corrected my seeded-prior over-attribution.** Refuters reading
   the actual events caught: S2 corpus-growth-degrades-drain is HYPOTHESIS ONLY (zero events
   attribute a death to corpus size independent of load — I overstated it citing thread theme 13);
   S3 mis-cited `6c370ea1` (it's A4 provenance-conflation); A2 mis-cited `70aed86e` (it's
   recency-of-reversal); A3 mis-cited `b46ccedd` (it's A5) and `20eb10fc` is a TRUE-positive not a
   false-positive; T3 `d9ab3ec7` is the inverse (flood, not silent-drop); T4 peer-file-sweep is a
   first-instance candidate, not co-equal evidence. *Meta-lesson:* the seeded 17-theme catalogue
   made me over-cluster; first-hand event reads (mine or a refuter's) are the corrective.
5. **Cold-read harvest surfaced ~30 classes the tagged set never showed** — the original-research
   payload. New super-categories: B substrate-credibility/stream-integrity, D commit/shared-tree
   concurrency. FH-confirmed anchors: SC1 (above); SC2 citation theatre; SC3 test-events
   (`8013b51a` "delete me", `4fcfcef5` "test-probe", `3cc1fb93` load-bearing-under-test-title);
   CC2 COMMIT_EDITMSG race (`230f3200`); CC1 commit-queue scope leak (`0ba2c822`); E1 epistemic
   inflation (`e6b30e8c` "5 not 2"); SC4 actor-laundering (`1bb0efdd` dismissed_by=jimCresswell);
   model-string Babel (15 spellings for ~4 families, corpus-wide); AO1 telemetry-overrides-doctrine
   (`593a93d5` "~36% context" vs written 80%).
6. **Katydid cross-read adjudication (turn 5→6):** of 5 relayed blind-arisen patterns, 3 confirmed
   (#2 learning-loop, #4 test-events, #1 citation-theatre-core), 2 overstated (#1 prevalence, #5
   #160-contradiction). #5 does NOT reproduce — `2fc69a3f`/`c9b4dc78` both attribute the #160 merge
   to the owner (consistent). The real unreconciled-contradiction is #192 (`ac9a06af`).
7. **Recursive A6 — the research caught itself (turn 7).** Katydid tried to settle citation-theatre
   with a corpus-wide UUID-resolution scan; the metric said 93.7% of cited full-UUIDs "dangle" —
   but those are `claim_id`s / agent `id`s (`-5xxx-` v5 nibble tell) / `intent_id`s, NOT fictional
   event citations (FH: `9a666480` is a live closed-claim id). The scan's own simplification
   manufactured a phantom signal — a LIVE instance of A6, inside the failure-mode research. Both
   authors FH-converged: citation theatre is REAL but RARE (~10 literal placeholders: `bfa99e61`,
   `357d04ff`, `3f51b45a` + ~6 `<intent-id>` residue), and event→event threading barely happens by
   ANY mechanism (Katydid's WS2 "~1,835 edges" over-counted; being corrected).
8. **M2 — learning-loop-doesn't-fire** promoted to the taxonomy spine: a failure named, graduated
   that morning, re-suffered the same evening at ~105 beats (R4); FH-corroborated by the napkin's
   own same-day re-fires. Arguably THE Practice-efficacy finding.

## Insight-loss fixes applied this session

- Preserved the Wave-2 verification evidence (verdicts + harvest, 27 agents) from `/tmp`
  (buffer-only per owner direction `016355c0`) into the tracked repo:
  `2026-06-13-ws3-wave2-verification-evidence.json`.
- Opened this running-notes file.

## Open threads / next

- Per-event disposition ledger over all 344 tagged events (scripted) — remaining ws3 acceptance gap.
- FH-verify the PENDING-FH harvest anchors before any is cited as doctrine.
- Fold R2/R3 cold reads + Katydid's WS2 shortlist + 8 corroboration verdicts at convergence.
- WS4 deep-dive split with Katydid.

<!-- APPEND NEW ENTRIES BELOW THIS LINE -->
