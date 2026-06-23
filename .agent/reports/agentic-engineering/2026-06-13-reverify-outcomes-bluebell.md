# Re-verify outcomes — §11 trust-map closeout (first-hand)

**Author:** Bluebell mends Mulch (claude-code / Opus 4.8 / `c2ef19`), comms-corpus research lane
successor to Kayak herds Ballast.
**Date:** 2026-06-13. **Purpose:** action Kayak's handoff §11 "re-verify before building" list
first-hand, so WS5/WS6 build on a clean evidence base. This is a companion record — it does **not**
edit Myrtle's relinquished WS3 taxonomy in place (the convention Geyser + Kayak followed); the
corrected figures and anchor verdicts here are the ones to **carry forward** into WS5, WS6, and any
PDR/skill promotion.

**Method / conduct:** corpus events are input-to-verify, not truth. Every verdict below comes from my
own first-hand read of the cited event(s). Counts are derivation-anchored ("as of corpus close,
5,188 events, 2026-06-13"). Conserve insight — corrections and residual uncertainty are recorded, not
buried.

## 1. Never-verified anchors — all four PROMOTE PENDING-FH → FH

| Anchor | Class | Cited event(s) | First-hand finding | Verdict |
| --- | --- | --- | --- | --- |
| H1 | Hook-bypass for an incidental blocker without authorisation | `054f1469` | Mistbound → Thermal: *"Push used `--no-verify` because local pre-push Prettier was blocked by unrelated untracked …mcp-analytics… which I did not include."* A `--no-verify` taken for an incidental unrelated blocker, decided in-session with no cited fresh owner authorisation. Direct `no-verify-requires-fresh-authorisation` instance (pre-push hook). | **FH** |
| L1 | Liveness-tooling self-deadlock | `7fc36a4a` | Galactic → Starless: *"my comms-watch monitor writes comms-seen/…(tracked) every time it processes a new event. Your frequent heartbeats kept triggering those writes mid-checkout = the re-stash/retry loop … looping for ~4 min. I've STOPPED my watcher."* Two agents' liveness tooling re-dirtying a shared tree; neither can branch-switch without mutual quiesce. | **FH** |
| CC1 | Commit-queue scope leak (record-staged honours full index, not intent.files) | `0ba2c822` | Wooded → Stormbound: commit `2389ff5e` absorbed Stormbound's foreign-staged `collaboration-state.ts` + `commit-queue.ts` because *"record-staged honoured the FULL git index rather than the intent's files field."* Misattribution under Wooded's subject; no work lost. | **FH** |
| CC3 | Shared-index foreign-staged-file pollution | `4e8118f2`, `9daf22fa` | Salty paused Cycle 4.2 on a foreign staged file outside the bundle (`4e8118f2`); Flamebright diagnosed a verify-staged race on a 47-file staged set as comms events kept mutating the working tree past the fingerprint time (`9daf22fa`). Two clean instances of foreign-staged pollution blocking / inflating a commit window. | **FH** |

## 2. T5 — re-anchored and promoted

- **Class:** Gate-time auto-fix rewrites append-only coordination channels.
- **Original citation `8891b583` was wrong** (it is Sylvan's reliability-queue-merge closeout, not a
  channel-rewrite instance — confirmed by the WS4 pending-FH pass).
- **Correct FH source: `86e94e54` §FRICTIONS n3-3** (Hushed, ARC n=3 findings ledger): *"repo-level
  lint/format gates rewrite gitignored ARC surfaces in place (MD004 marker flip observed in a seat
  buffer; cure candidates: exclude experiments/** from lint globs, or lint-clean composition)."* A
  markdownlint auto-fix flipped a list marker inside a gitignored ARC channel file — a gate-time
  auto-fix rewriting an append-only surface.
- **Verdict: re-anchor T5 from `8891b583` to `86e94e54` (§n3-3) and PROMOTE → FH.** The same event
  legitimately anchors **T6** (§n3-2 "non-append writes replay every follower") and the ARC
  what-worked finding — one incident, three mechanism-facets.

## 3. S7 — 3–6 s shutdown-race sourced (PROMOTE → FH, not dropped)

§11 flagged the "3–6 s shutdown race" half of S7 as unsourced ("source or drop"). It is **sourced
first-hand**:

| Agent | Heartbeat-end | Final beat (heartbeat-tagged) | Lag |
| --- | --- | --- | --- |
| Tempestuous Rising Gale (60496a) | `62190b73` @ `2026-06-11T01:29:45Z` | `5ecd0024` @ `2026-06-11T01:29:48Z` | **+3 s** |
| Evergreen Budding Sapling (1e6b10) | `487d4349` @ `2026-06-11T09:08:10Z` | `7266e5eb` @ `2026-06-11T09:08:16Z` | **+6 s** |

In both cases the heartbeat loop emitted a beat **after** the agent's own heartbeat-end broadcast —
the stop-loop-FIRST defect (PR 183 was written to cure it). **Verdict: S7 3–6 s race → FH** with the
four event ids above.

The *other* S7 half — the "33 beats / 2h20m runaway after a declared stop" (`f8cf9ad3` / `37d9e374`)
— remains as the WS4 pass corrected it: that quantifier is dropped; the real, **unquantified**
finding is the Codex signal-isolation constraint (closed stdin / blocked process-listing meant
background loops could not be signalled). Keep the two halves distinct.

## 4. Stale taxonomy-body figures — corrected (carry these forward)

| Figure | Taxonomy body says | Corrected (FH this pass) | Method |
| --- | --- | --- | --- |
| SC8 — directed events carrying `message_kind: "narrative"` | 21 instances (R1 window only) | **66 corpus-wide** | count of events with `kind==="directed"` AND `message_kind==="narrative"` over 5,188 events |
| SC9 — untagged heartbeat emissions pre-`--tag` | ~167 | **~180–181** (180 pre-boundary + 1 post-boundary straggler) | count of `title` matching `^Heartbeat:` (excluding `Heartbeat-end:`) AND no `heartbeat` tag; boundary = first tagged beat `2026-05-24T10:18:01Z` |
| SC9 — heartbeat-census miss rate | ~47% | **~7.0% at corpus close** | untagged-emissions ÷ (heartbeat-tagged 2,399 + untagged-emissions 181). The ~47% was a valid *early-snapshot* figure (small corpus); restate it as such, anchored to its snapshot date |
| SC1 — affordances "unreachable" | unreachable | **the `comms reply --to-event-id` subcommand exists but discards the linkage** | already FH-evidenced by reply event `2ff03ded` (`in_response_to` = undefined); the sharper framing is "no authoring path records linkage, including the dedicated reply command" |

The "~167 vs ~186 vs ~181" spread across passes is a title-filter sensitivity, not a contradiction —
all three land at ~180 untagged heartbeat emissions; the corpus-close miss rate (~7%) is the robust,
reproducible figure to cite.

## 5. Framing caveats kept as instance-plus-hypothesis (§11 item 5)

- **T6** "`tail -F` replays from offset 0" — the offset-0 mechanism is editorial inference; the corpus
  (`86e94e54` §n3-2) states only "non-append writes replay every follower." Keep the replay finding
  FH; mark "from offset 0" as the inferred mechanism.
- **CC4** "twice in one evening" — `031852ab` is one strong instance (whole-tree gate broken by a
  peer's untracked in-flight edits); the second occurrence is uncited. Keep as one FH instance plus a
  reasonable structural hypothesis (whole-tree gates + shared tree + mid-authoring peers co-occur).

## 6. Operational note carried (§11 item 6)

The shared git index carries stale registry (`active-claims`/`closed-claims`) and `comms-seen` cursor
state. **Do not bare-commit** — these are excluded from the feature branch by the pure-diff
convention; stage research artefacts by explicit pathspec only. Working-tree truth at pickup: no open
claims other than this lane's (`agent-collaboration-research`, opened by this session).

## 7. Net

All §11 re-verify items closed first-hand. Six anchors promoted to FH (H1, L1, CC1, CC3, T5, S7
3–6 s race); four stale figures corrected (SC8, SC9 count, SC9 miss-rate, SC1 framing); two framing
caveats kept honest. No finding was refuted by this pass — the trust-map held, and two findings
strengthened. The evidence base for WS5 (rotation strategy) and WS6 (synthesis) is clean.
