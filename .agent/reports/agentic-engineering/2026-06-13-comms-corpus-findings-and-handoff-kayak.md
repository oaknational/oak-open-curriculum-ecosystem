# Comms-corpus research — findings synthesis + session handoff

**From:** Kayak herds Ballast (claude-code / Opus 4.8 / `328eee`), consolidated lane owner.
**For:** the incoming session taking over the comms-corpus research lane.
**Date:** 2026-06-13. **Branch:** `feat/comms-research` (fully pushed). **Claim:** `b76045bb`.

This is the single-document orientation for the incoming session: what the research found, how far it
got, what is **verified** vs **still uncertain**, the state on disk/origin, and what to do next. It
points at the detailed artefacts; it does not replace them. Read it end-to-end, then the thread record
(`.agent/memory/operational/threads/agent-collaboration-research.next-session.md`) and the running-notes
lab notebook (`2026-06-13-comms-corpus-research-notes.md`).

## 0. Status in one line

WS0–WS4 complete + first-hand verified; WS5 (rotation strategy → owner ratification) + WS6
(comprehensive synthesis) remain, owner-sequenced-separately. Everything durable on origin.

## 1. Research vector + conduct doctrine (carry these — they are load-bearing)

The `.agent/state/collaboration/comms/` archive (~5,150 events, 2026-05-20→06-13) is the research
substrate. Three owner-named lenses, third weighted highest: failure modes; what-worked-well;
**surprising emergent behaviour** (steerable by activation-enthalpy tuning, not mandates). The end-goal
is to make it safe to rotate/remove the `.agent/state/` corpus (owner ratifies before any deletion).

**Conduct doctrine that earned its keep repeatedly this session — DO NOT DROP IT:**

- **Corpus events are input-to-verify, not truth.** Ground every load-bearing claim by reading the
  cited event first-hand. This caught a phantom "93.7% dangling-citation" metric, relayed-unverified
  cold-reader surprises, an over-accepted T7 count, and a reboot-confounded swap finding — several of
  them the researchers' *own* convenient claims.
- **Conserve insight; do not prematurely narrow.** Record corrections, never bury them. A
  CORRECTED/REFUTED verdict is as valuable as a confirmation.
- **Mutual first-hand correction (the what-worked-well of this session).** Two independent FH readers
  (Kayak + Geyser) caught what each single pass would have ratified — in both directions. This is the
  strongest reliability mechanism the lane has; preserve the two-reader-cross-attestation shape.
- **First-hand means me, not a sub-agent.** Fan-outs produce input-to-verify; the lane owner spot-checks
  load-bearing results.

## 2. Verified corpus facts (FH; several quadruple-attested)

Independently re-derived by ≥3 readers (Myrtle FH, Katydid FH, R1 verifier, Geyser, Kayak):

- **5,150 events**, `2026-05-20T11:38Z`→`2026-06-13T08:42Z` (grows live).
- By kind: narrative 4,058 / directed 1,092 / **lifecycle 0** (the schema's third shape never used).
- **`in_response_to` / `in_reply_to` / `audience` / `addressed_to` = 0 corpus-wide.** Event→event
  threading is rare by ANY mechanism.
- Citation resolution: of ~1,842 full-UUID body tokens, **115 resolve to a real event_id**; the rest
  are claim/agent(v5)/intent/commit-SHA UUIDs. "Citation theatre" is REAL but RARE (~10 literal
  placeholders), NOT a pervasive convention.
- Tags: only **3 values ever authored** — heartbeat 2,375 (46%), behaviour-note 303, failure-mode 41
  (341 unique tagged). The tagged failure population is a **LOWER BOUND** (untagged failures-in-prose
  exist).
- Corpus integrity: uniform `schema_version` 2.0.0; 0 missing required fields; 0 event_id/filename
  mismatches. (Note: the 1,092 "missing author" are simply directed events using `from`/`to` — a reader
  trap, not a defect.)

**SC1 causal root (evidenced, FH):** the comms CLI exposes only `--tag` — no
`--in-response-to`/`--in-reply-to`/`--audience`/`--addressed-to` flag — and even the dedicated
`comms reply --to-event-id` records no linkage (proven by reply event `2ff03ded`,
`in_response_to`=undefined). So zero-lifecycle + zero-threading is a **TOOLING-gap substrate class**,
not a behaviour choice. Cure: wire the fields into the authoring path (incl. `comms reply`) or remove
them. Consumer: rightsizing-M4 enforce-or-remove.

## 3. WS1 — cold-read top surprises (blind-arisen; full detail in running notes + `ws1-cold-reads/`)

8 blind cold-read windows + 8 corroboration verdicts. Highlights: dead-channel ACTIVE-heartbeat tail
(no self-exit on ACTIVE status); 3 false retirement-detections in 30h; watcher addressee-filter
dropped directed-to-other events (since CURED in live code); asymmetric observability (owner sees
context budgets, agents cannot); the corpus is self-aware of being analysed (an event predicted the
cold-read); "the cure became the killer" (fail-loud watcher hardening killed healthy watchers); a
5-hour two-agent night vigil awaiting a human word.

## 4. WS2 — survey findings

~48% of non-heartbeat events are one-way status reports; questions (16) and escalations (10) are
vanishingly rare corpus-wide (open question for WS4/WS6: healthy autonomy or under-surfacing of forks?);
directed-reply median latency ~3.5 min; hub traffic concentrates on Director-seat names.
Report: `2026-06-12-ws2-corpus-survey.md`.

## 5. WS3 — failure-mode taxonomy (Myrtle; corrections by Geyser + Kayak)

~46 classes on a substrate (S) / substrate-credibility (SC) / tooling-false-signal (T) /
commit-concurrency (CC) / agent-coordination (A,E,C,I,X,H,R) / process (P,D) / meta (M) axis. M2
(learning-loop-doesn't-fire-under-pressure) promoted to the spine. The taxonomy's "First-hand
corrections" addendum (now owned by the lane) records: **S9 cured-in-live-code** (→ what-worked, routing
withdrawn); **SC1 causal-root evidenced + sharpened**; **M2 quantifier softened** to FH-pending.
Files: `2026-06-13-ws3-failure-mode-taxonomy.md`, `-ws3-deep-dives.md`, `-ws3-disposition-ledger.md`.

## 6. WS4 — findings (verified)

**My half — liveness/coordination/emergent (12 leads, fan-out + adversarial verify):** all 12 core
phenomena FH-confirmed; flags were precision-level, not refutations. Evidence:
`2026-06-13-ws4-find-verify-evidence.json`. Clean: dead-channel-active-tail, watcher-addressee-filter
(S9, cured), affection-into-protocol ("Lunary"). Corrected-precision: cadence-under-turn-starvation,
asymmetric-observability, coordinator-two-moments, reply-latency-hub, owner-as-case-law,
succession-night-vigil, recursive-self-reference, stale-heartbeat-args, false-retirement-detections.

**B/D/M2 anchors (18 total: T7/CC4 + 16; Geyser's lane + my fan-out, cross-attested):** 8 FH-confirmed
& promoted (SC5 byte-identical-handoff-22s-apart, SC10, T6 truncate-rewrite-replays-tail-F, T9, CC5
codegen-cascade-blocks-commits, CC6 stale-index-claim-blocks-peer, X1, R1); 3 confirm-with-fix (S8
gaps-exact-but-staggered, SC8 21→66-instances, SC9 stratigraphic-boundary); 3 hold-at-NOTE (T8, C1,
I1); **2 MISCITED** (S7 "33-beat/2h20m" unsupported → keep the Codex-signal-isolation finding,
unquantified; T5 cited wrong event → needs resourcing). REVIEW disposition (Geyser): **0 new spine
class** (structure holds; tagged population confirmed a lower bound). Evidence:
`2026-06-13-ws4-anchor-verify-evidence.json`, `-ws4-pending-fh-verification.md`,
`-ws4-bdm2-verification.md`, `-ws4-review-disposition.md`.

## 7. Corrections ledger (including the session's own errors — recorded, not buried)

- **S9** watcher-addressee-filter: reclassified cured-in-live-code (`comms-relevant-events.ts` returns
  `observed`); historical, not a live defect; routing withdrawn → what-worked.
- **SC1** causal-root: sharpened — no authoring path records linkage, including `comms reply`
  (`2ff03ded`).
- **T7** commit-queue-wrapper false-FAIL: count corrected **5 → 4 FH-enumerable** (Monsoon×3 + Fern×1;
  matches the 4 abandoned commit_queue entries); reported 5th unlocated. Mechanism CONFIRMED.
- **Swap-9G→0 "finding": RETRACTED.** It was attributed to watcher-fleet retirement; in fact the host
  REBOOTED (~10:52Z, `kern.boottime`) — swap→0 + dead pids are reboot artefacts. The watcher
  host-resource cost is now a **HYPOTHESIS only** (the ~78%-CPU was real-when-observed). Meta-lesson:
  when a host metric moves sharply, check boot time before attributing.

The recurring meta-pattern: a convenient causal claim that supports the claimant's thesis is the most
dangerous; the mutual-FH loop caught these in BOTH researchers.

## 8. Crash-safety + state (verified `local==origin`)

The full comms corpus (~5,150 events) is committed + pushed (`8d6e26f88`) — the "189-untracked
deletion-safety gap" is largely cured (now ~1 untracked, accumulating live). All WS4 evidence,
corrections, the thread record, the channel, and this write-up are on origin. Excluded by design:
registry (`active-claims`/`closed-claims`) + cursor (`comms-seen`/heartbeat) per the pure-diff
convention; `statusline-logos.md` + the Bilby's logo work (theirs).

## 9. What is UNVERIFIED / hypothesis-only (do NOT treat as settled)

- **Watcher host-resource cost** (swap/memory ∝ watcher-count × dir-size): HYPOTHESIS (swap→0 evidence
  was reboot-confounded). A controlled watcher-RSS × dir-size measure would settle it.
- **M2 quantifier** ("~105 beats / ~60×"): FH-PENDING (R4 single-source); the M2 family is FH-solid.
- **S7** Codex-signal-isolation: real but unquantified; the "33-beat/2h20m" number is unsupported.
- **T5** gate-auto-fix-rewrites-append-only-channel: mechanism plausible (cf. T6) but the cited event
  (`8891b583`) does not evidence it — needs a correct source or downgrade.
- **CC4** structural-universality: one strong instance (`031852ab`); "always co-occur" is a reasonable
  hypothesis, not corpus-proven.

## 10. Open items for the incoming session

1. **WS5 rotation strategy → owner ratification** (NO deletion in research). Input: the thread record's
   §Non-Held Rotation Strategy (invariants + candidate shapes + open questions). The 189-untracked gap
   is largely cured but new events accumulate — rotation must keep the live dir bounded for the watcher.
2. **WS6 comprehensive synthesis.** This document is its draft input.
3. PR #207 post-merge follow-up on `main`: correct "commit-queue ×5" → "4 enumerable".
4. One-decision-home PR shape (Flame's oak-pr plan + the evidence doc) awaits owner confirm.
5. `feat/comms-research` is ~28 behind `origin/main` (PR back-links dangle-until-merge).
6. 2 Dependabot vulns on `main` (1 high / 1 low, owner-flagged).
7. The watcher host-cost controlled measure (settles the §7 retraction's hypothesis).

## 11. Adversarial context analysis (fresh-context, 5 dimensions)

A fresh-context adversarial review challenged this session's claims, my own corrections, the state, and
completeness. Full evidence: `2026-06-13-adversarial-context-analysis-evidence.json`.

**Headline (calibration): the core findings and the session's own corrections HELD.** Independent
re-derivation confirmed the corpus facts (now 5,187 events — live-growing; lifecycle 0; all four
threading/addressing fields 0; ~46% heartbeat; 41 failure-mode; citation ratio ~6.4%; SC9 boundary
`2026-05-24T10:18Z`; SC1 live-code evidence; 3 tag values only). The **self-corrections dimension found
0 high / 0 medium issues** — the swap-retraction, T7 5→4, and S9-cured corrections all hold.

**Trust adjustments + re-verify list for the incoming session (do these before building on the findings):**

1. **Taxonomy-BODY figures are stale** — corrected in the evidence/verification files but NOT propagated
   into `ws3-failure-mode-taxonomy.md` body: SC9 "~167" → **~186**; SC9 "~47% miss" is an early-snapshot
   figure → **~7% at corpus close** (anchor it or restate); SC8 "21 instances" → **66**; SC1 "unreachable"
   → the sharper "the `comms reply` subcommand exists but discards the linkage." **Carry the corrected
   figures if promoting the taxonomy to a PDR/skill.**
2. **T5 may NOT be flatly miscited** — the review flagged candidate FH-source `86e94e54` ("FRICTIONS
   n3-3: repo-level lint/format gates rewrite gitignored ARC surfaces"). Read it to decide promote-to-FH
   vs downgrade (this refines my "needs a correct source" verdict — a source candidate now exists).
3. **Anchors never verified** — H1, L1, CC1, CC3 are PENDING-FH and were never queued to either WS4
   verification lane. Verify them.
4. **S7 3–6 s shutdown-race sub-claim is unsourced** (no cited events) — find the Tempestuous (01:29:48Z)
   / Evergreen (09:08:16Z) events or drop the sub-claim (the "33-beat" half is already retracted as
   miscited).
5. **Minor framing** — T6 "tail -F replays from offset 0" is editorial-inferred (not corpus-stated);
   CC4 "twice in one evening" 2nd instance is uncited. Keep both as instance + hypothesis.
6. **Staged-index hazards (state)** — the shared git index carries stale registry (a staged
   `active-claims` showing both Geyser's closed claim AND Kayak's) and staged `comms-seen` cursor state.
   **Do NOT bare-commit** (it would put registry/cursor on the feature branch, violating the pure-diff
   convention) — commit by explicit pathspec only. Working-tree truth: only Kayak's claim `b76045bb` open.
7. **Re-count the corpus before any deletion** — it is live-growing (5,150 → 5,187 during this session);
   the untracked-events accumulation is the live WS5/WS7 deletion precondition.

**Method note:** this same adversarial-FH shape (fresh reader challenging the prior pass) is the
session's strongest reliability mechanism — the incoming session should keep using it on its own WS5/WS6
output.

## 12. Artefact index (all on origin)

`ws-critical-reassessment-kayak.md`, `ws4-find-verify-evidence.json`,
`ws4-anchor-verify-evidence.json`, `ws4-pending-fh-verification.md`, `ws4-bdm2-verification.md`,
`ws4-review-disposition.md`, `ws3-failure-mode-taxonomy.md`, `ws3-deep-dives.md`,
`ws3-disposition-ledger.md`, `ws2-corpus-survey.md`, `comms-corpus-research-notes.md`,
`ws4-geyser-continuation.md`; channel `rapid-comms/2026-06-13-kayak-geyser.md`; thread record
`agent-collaboration-research.next-session.md`; plan
`agent-tooling/active/comms-corpus-research-and-rotation-strategy.plan.md`.
