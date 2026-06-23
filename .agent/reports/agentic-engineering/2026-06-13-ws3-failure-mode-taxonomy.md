# WS3 — Failure-Mode Taxonomy (comms-corpus research)

**Workstream**: WS3 of `comms-corpus-research-and-rotation-strategy.plan.md`.
**Author**: Myrtle weaves Thicket (claude-code / Opus 4.8 / adcccb), supporting Katydid hunts
Roost on the comms-corpus research lane (peer pair; coordination on the ArcAngel channel
`.agent/collaboration/rapid-comms/2026-06-13-katydid-myrtle.md`).
**Status**: v0.2 — taxonomy with verification status per class. Three evidence layers feed it
and each class is labelled with its strongest:

- **FH** — verified first-hand by the author against the corpus event(s) cited.
- **ADV** — adversarially verified by an independent Sonnet refuter that re-read the cited
  events (Wave-2 workflow `wf_fb80249d`); refuter corrections applied.
- **HARVEST(n)** — surfaced by the WS1 cold-read harvest, cross-attested across `n` independent
  cold-read logs; first-hand corpus spot-check done where marked, else PENDING-FH.

Doctrine-grade-vs-note-grade verdicts and routing are the refuters' adjudicated values where
ADV applies, else the author's provisional read marked `(prov)`.

## Grounding (first-hand, derivation-anchored)

- Corpus re-derived 2026-06-13: **5,122 events**, span 2026-05-20 → 2026-06-13. Shapes:
  narrative-kind 4008+, directed 1092+, **lifecycle-kind 0**. Tags: heartbeat 2326 (45.6%),
  behaviour-note 303, failure-mode 41.
- **Definitive corpus-wide structural fact (FH):** across all 5,122 events the structured schema
  affordances `in_response_to`, `in_reply_to`, `audience`, `addressed_to` are **0 / 0 / 0 / 0**,
  and `lifecycle-kind` is **0**. The schema's reply-graph, addressing, and lifecycle machinery
  are entirely unused; all threading and lifecycle signalling rides on prose conventions. This
  underpins super-category B.
- Input set: 41 failure-mode + 303 behaviour-note tagged events (all 344 read FH); the 6 complete
  WS1 cold-read logs (R1, R4–R8) harvested; 76 extractor anomalies. R2/R3 cold reads held
  (Fable-outage partial) pending Katydid's completion ping.

## Method and the second-hand discipline

Owner constraint this session: agent-produced material is second-hand until verified first-hand.
The tagged-event spine (super-categories A/C/E/F/G below, classes S/T/A/P/M) was read FH and
adversarially verified. The cold-read harvest (super-categories B/D and the new classes) is
**thrice-removed** (Sonnet → cold reader → corpus); its load-bearing anchors were spot-checked FH
before promotion (marked CONFIRMED-FH), and the remainder is honestly labelled PENDING-FH with
cited event ids so prevalence is never overstated. Katydid's turn-5 cross-read relay was itself
adjudicated FH (two of five relayed patterns were overstated — see §Cross-read adjudication).

---

## A. SUBSTRATE-FAILURE (the mechanism failed; cure is structural / observability-in-primitive)

- **S1 — Watcher silent-stall / hang-but-run.** [FH+ADV, DOCTRINE] Events `26c8b7e9`, `382ed72e`,
  `e27e964a` (+ harvest: `b385b94c` the detector-cannot-detect-itself; `e1f88af9` zombie watchers
  sharing a seen-file). Two same-day episodes (Abyssal 14:07Z, Veiled 15:28Z) = systematic CLI
  defect, not one-off. **Cure (ADV-sharpened):** replace fs.watch primary source with interval
  polling (readdir + seen-set diff); fail-loud + exit-nonzero on loop error; stderr liveness
  heartbeat for external watchdog. **Routing:** `comms-watch-hang-hardening.plan.md`.
- **S2 — Watcher drain-death.** [FH+ADV, NOTE — downgraded] Events `4e35c31c`, `e3f111ec`,
  `940b435f`. **Refuter correction (verified):** the class conflated three mechanisms; only ONE
  is well-evidenced. (1) load-starvation death — evidenced. (2) **corpus-growth wedge — HYPOTHESIS
  ONLY; zero events attribute a death to corpus size independent of load** (I overstated this
  citing thread theme 13 — corrected). (3) intermittent blocking stall at moderate load
  (`940b435f`, 540 s budget, stable dir) — evidenced, attributed to fs contention / mid-pass race.
  **Cure:** instrument the drain to locate the blocking call; serialize/back-off on `.agent` fs
  contention; keep budgets SHORT (a long budget only lengthens the blind window — see S7-dup
  below). Drop "rotation reduces working set" as a cure until mechanism (2) is independently
  tested. **Routing:** `comms-watch-storage-redesign.plan.md` (+ rotation WS5, contingent).
- **S3 — Heartbeat-as-liveness misread.** [FH+ADV, NOTE — pending 3-vector cure] Events `0ca40410`,
  `a8366d7a`, `5fb2bcd9`, `670cc290`, `9d421e29`, `8c6bd26a` (+ harvest: `cd19782a`, `1c9ca98c`,
  Scorched's 162 ACTIVE beats). **Refuter correction (verified):** `6c370ea1` was MIS-cited (it is
  provenance-conflation = A4) — removed. Cure must name three vectors: (1) template-drift — derive
  heartbeat body from current claim/cycle at emit time; (2) cron-health — Monitor/cron degradation
  needs active staleness monitoring (`watcher-staleness.ts` hook); (3) blocked-label — set
  `cycle=blocked-on-owner-ask` on owner-wait entry. **Routing:** PDR-078 amendments +
  `comms-watch-liveness-floor.plan.md`.
- **S4 — Relative worktree CLI paths silently retarget the registry.** [FH+ADV, NOTE] Events
  `9a164c5c` (+ harvest `c5c4abff`, `092f41b6`, `de5122b8` third instance). **Refuter caveat
  (verified):** the original misdirected event was deleted, so retarget-vs-silent-failure is not
  forensically distinguishable from the surviving record; the competing diagnosis (`eb284f91`) is
  generic silent-write-failure. **Cure:** absolute `--comms-dir`/`--active` from worktree seats
  (correct either way) + verify the file exists at the absolute home by direct stat, not by
  parsing the proof line. **Routing:** collaboration-state CLI hardening (rightsizing M4).
- **S5 — CLI boundary gaps.** [FH+ADV, DOCTRINE — upgraded] Events `b797cc73` (malformed ISO
  `--now` accepted → "Invalid time value" cascade), `40a6ce09` (`conversation`/`escalation`
  subcommands wholly broken; zero dispatch-boundary tests; suite green) (+ harvest `53112f47`
  silent dropped Director rulings, `2e04d4e4` claims-close `--closed` error). **Two sub-patterns
  (verified):** (a) value-validation gap; (b) dispatch-contract gap (parser writes a key the
  handler never reads). **Cure:** schema-first validation at the CLI boundary + dispatch-level
  contract tests. **Routing:** `comms-event-write-integrity.plan.md`.
- **S6 — Identity instability.** [FH+ADV, NOTE for split-brain; FH for the wider family]
  Split-brain one-seed-two-names `10cb3a10`, `320b8901`, `f5e129bc` (refuter: watcher-fracture is
  inferred not observed; grade note until the activation-logic diagnostic lands). **FH-confirmed
  siblings:** **model-string Babel** — 15 spellings for ~4 model families across the corpus
  (`fable-5`/`Fable 5`/`claude-fable-5`; `claude-opus-4-7`/`opus-4.7`/`Opus-4.7`/…; `Opus 4.8`/
  `claude-opus-4-8`); identity tuples schema-valid but not value-canonicalised — feeds census
  unreliability. Identity-routing-by-word-collision (`78cabf76` Mistbound-mis-route) and name-pool
  stem collisions (Foamy×3, Twilit×2, Stormbound×3 → "identity disambiguation first" became a
  genre). **Routing:** PDR-027 identity + era-pinning follow-on + a model-string canonicaliser.
- **S7 — Heartbeat-loop shutdown race (stop-loop-FIRST defect).** [HARVEST(1), PENDING-FH, NOTE
  (prov)] Loop emits a final beat 3–6 s after heartbeat-end (`Tempestuous` 01:29:48 vs end
  01:29:45; `Evergreen` 09:08:16 vs 09:08:10) — the defect PR 183 was written to cure. Plus the
  **uncontrollable-loop** variant (L2): 33 beats over 2h20m after a declared stop because the
  process couldn't receive signals (`f8cf9ad3`/`37d9e374`).
- **S8 — Host-suspension heartbeat gap.** [HARVEST(2), PENDING-FH, NOTE (prov)] Host sleep pauses
  all loops synchronously — three agents' 4-min loops simultaneously gapped to 3,168–3,247 s
  overnight; indistinguishable from inactivity to any interval-based liveness monitor.
- **S9 — Watcher addressee-filter contract violation.** [FH-CONFIRMED via `c7fba7db`, DOCTRINE
  (prov)] The all-channels comms watcher silently dropped directed-to-OTHER-agent events across the
  team's history, violating the self-exclusion-only contract — agents systematically did not see
  cross-traffic (the exact failure the `comms-all-channels-watcher` rule exists to prevent, at the
  CLI filter level). Distinct from S1 (stall) and T3 (render-mask): a wrong-by-contract filter, not
  a stall or render bug. **Cure:** self-exclusion-only, never addressee-filtering; a dispatch-level
  test that a directed-to-other event IS emitted. **Routing:** comms-watch + watcher rule + write-integrity.

## B. SUBSTRATE-CREDIBILITY / STREAM-INTEGRITY (NEW — the corpus's own provenance is partly unsound)

This super-category did not exist in the tagged set; it is the cold reads' highest-value yield and
the most load-bearing because it undercuts the corpus's trustworthiness as a research substrate.

- **SC1 — Schema-affordance atrophy (the structured reply/lifecycle graph is dead-on-arrival).**
  [FH-CONFIRMED, corpus-wide, DOCTRINE] `in_response_to`=0, `in_reply_to`=0, `audience`=0,
  `addressed_to`=0, `lifecycle-kind`=0 across all 5,122 events — even where doctrine mandates the
  field (`ced9997b` instructs an `in_response_to` ack; the ack `41475bf9` omits it). All threading
  rides on prose event-id citations. **Implication:** any analysis (incl. WS2 linkage) that assumes
  structured threading gets nothing; this is the substrate the rotation strategy and any future
  consumer must treat as prose-only. **Routing:** comms-event schema/write-integrity + rightsizing
  M4 (decide: enforce the fields or remove them — an unused affordance is a standing liability). **Sharpened joint finding (both authors FH):**
  event→event threading barely happens by ANY mechanism — `in_response_to`=0 AND genuine
  prior-event citation is a minority of body references (of ~5,894 8-hex tokens, ~1,861 resolve to a
  unique event-id prefix; the rest are git SHAs / claim / agent prefixes). Katydid's WS2
  "~1,835 citation edges" over-counted event→event threading and is being corrected in the WS2 report.
  **Causal root (FH-confirmed, `1e2c83eb`/`ec86492e`):** the affordances were UNREACHABLE from the
  authoring CLI — both events are failure-mode events whose bodies state "Tag field not set because
  `comms send` does not expose `--tags`." Unifies SC1 with SC9: the `--tag` flag landed mid-corpus
  (partial fix → the SC9 stratigraphic boundary), while the reply/lifecycle/addressing fields never
  landed (→ 0 corpus-wide). This reframes the atrophy from a behaviour failure to a tooling-gap
  substrate class with a clean cure. **Load-bearing implication:** the tagged population (41+303)
  is a LOWER BOUND on true failure-modes — untagged failure-modes-in-prose exist (these very events,
  and `c7fba7db`); the disposition ledger states this rather than implying the 344 are the whole.
- **SC2 — Citation theatre / phantom event-ids.** [FH-CONFIRMED, RARE — quantified] Literal
  unfilled placeholders shipped: `bfa99e61` ("[ID-of-shaded-event]"), `357d04ff` ("[shaded
  broadcast id]"), `3f51b45a` ("[id at 15:25:12Z]", FH-confirmed) + ~6 `<intent-id>` template
  residue — **~10 genuine instances across 5,120 events** (Katydid's FH placeholder census;
  ~11 more were `comms show <event-id>` CLI-usage false positives, the same class my scan found).
  Phantom citations resolving to no event-id: `9a1ac1`, `0a82e1`. **Honest scope (both authors
  FH-converged):** citation theatre is REAL but RARE (~10), NOT pervasive — the original
  "a chunk are fictional" cold-read framing was overstated. A naive citation-resolution scan
  CONFOUNDS this: of 1,812 full-UUID tokens cited in bodies, 1,697 (93.7%) "dangle" — but those
  are `claim_id`s / PDR-027 agent `id`s (the `-5xxx-` v5 nibble is the tell) / `intent_id`s /
  PR-commit UUIDs, NOT fictional event citations (e.g. `9a666480` is a live closed-claim id, FH).
  The dangle rate measures "agents cite claims/agents/intents far more than events," not fiction —
  itself a live A6 instance (see A6). **Routing:** WS2 (sharpens linkage) + write-integrity.
- **SC3 — Diagnostic/test events on the permanent stream + title-vs-body trust mismatch.**
  [FH-CONFIRMED, DOCTRINE (prov)] `8013b51a` (title "test short body", body "diagnostic - delete
  me" — preserved 22 days), `4fcfcef5` (title "test-probe", heartbeat-tagged, a calibration probe),
  and the inverse `3cc1fb93` (title "reproducer-test…" but body is a **real load-bearing**
  three-way session-split proposal with live claim id `f4613bdc`). Preserve-everything semantics
  have no quarantine path; neither inversion is detectable without reading full bodies. **Routing:**
  rotation strategy (WS5 — a quarantine/cleanup class) + write-integrity.
- **SC4 — Provenance contradiction / actor-laundering on shared-credential actions.**
  [FH-CONFIRMED for laundering; #160-contradiction NOT reproduced] `1bb0efdd`: a CodeQL dismissal
  records `dismissed_by: jimCresswell` (the shared gh credential), not the acting agent Flamebright
  — provenance exists only in the comms stream. (Matches the standing
  `shared-gh-auth-hides-actor` note.) **Correction to the cold-read #5 claim:** the alleged "two
  incompatible accounts of who merged #160" does NOT reproduce — `2fc69a3f` and `c9b4dc78` both
  attribute the merge to the owner/transport (consistent). The real unreconciled-contradiction
  instance is the #192 temporal dislocation (`ac9a06af`), which is A2. **Routing:** identity /
  provenance + the comms stream as the de-facto actor record.
- **SC5 — Duplicate event fire (CLI at-least-once).** [HARVEST(2), PENDING-FH, NOTE] Byte-identical
  coordinator-handoff bodies 22 s apart under distinct ids (`c3d41f43`/`461982a5`); no dedup, no
  retraction; any body-naive census double-counts.
- **SC6 — Deliberate noise injected into the append-only stream.** [FH-CONFIRMED via `4fcfcef5`]
  A schema-valid "test-probe" written to the canonical stream with an implicit "ignore me"; the
  record is permanently polluted and the annotation is itself just another event.
- **SC7 — `naming_schema_version` field collapse.** [FH-CONFIRMED, NOTE] Fresh post-activation
  tuples stamp `naming_schema_version: "override"` rather than a real era (196/196 in one window;
  the field that should carry provenance carries a constant) — the data-layer root beneath the S6
  split-brain. **Routing:** era-pinning follow-on.
- **SC8 — `message_kind` mismatch.** [HARVEST(2), PENDING-FH, NOTE] Directed (point-to-point)
  events carry `message_kind: "narrative"` (21 instances, clusters by author/tool default) — a
  semantically contradictory but schema-valid combination that corrupts any kind-based classifier.
- **SC9 — Stratigraphic tag-backfill gap.** [HARVEST(1), PENDING-FH, NOTE] ~167 heartbeat-titled
  events pre-date the `--tag` feature and are untagged; any naive tag-based heartbeat census of
  that window under-counts by ~47%. A date-boundary, not a data error — schema validators pass.
- **SC10 — Per-occupant sequence-counter ambiguity.** [HARVEST(1), PENDING-FH, NOTE] Director
  "tick #N" resets per seat-occupant, not per team-day; cross-window tick references are ambiguous
  to any reader without the occupancy timeline.

## C. TOOLING FALSE-SIGNAL (a tool reported success/failure incorrectly)

- **T1 — Piped/wrapped exit-code false-green.** [FH+ADV, DOCTRINE] `e589b3c7`, `effea526` (+ harvest
  `488c8a1b`, `309a9a56` SIGPIPE variant, `5b6cab3d` exit-137-masked-by-vacuous-retry). **Three
  vectors (verified):** (1) pipe tail exit ≠ command exit; (2) hook banner ≠ transfer proof; (3)
  transfer never starts — absent transfer lines indistinguishable from suppressed output without
  `ls-remote`. **Cure:** unpiped + `ls-remote` verify; design hook exit-capture against `set -e` +
  pipeline + missing-file, demonstrate the negative case.
- **T2 — Invisible control byte fools reviewer AND verifier.** [FH+ADV, DOCTRINE] `4fd66dc5`
  (byte present, fooled reviewer + first-hand grep; `od -c`/RED-first exposed it), `b84fae38` (Write
  tool materialised escape-intent as raw 0x1F). (`d8fd08d3` corroborative only.) **Cure:** escape
  sequences not literal bytes; `od -c`/RED-first probe; post-Write byte-verify.
- **T3 — Render filter proven only on heartbeats drops substantive events.** [FH+ADV, DOCTRINE]
  One clean event `6cf5f4ab` (jq `else .kind` over the tags array dropped all untagged events).
  **Refuter correction (verified):** `d9ab3ec7` is the INVERSE (a flood from over-broad grep) —
  re-cited as an adjacent class, not a T3 instance. **Cure:** test the exact filter against one
  event of EACH shape before arming.
- **T4 — Whole-tree auto-fix at marshal time mangles committed content.** [FH+ADV, NOTE — narrowed]
  `85bb2336`/`4010748e` (prettier mangled ADR-186 §Render). **Refuter correction (verified):** the
  peer-file-SWEEP sub-claim (`89bbb056`) is a first-instance graduation candidate, demoted out of
  the cure. **Cure:** format at author-edit time; marshal must not run `format:root` as recovery;
  strengthen `verify-staged` to detect content damage, not just file-list correctness.
- **T5 — Gate-time auto-fix rewrites append-only coordination channels.** [HARVEST(1), PENDING-FH,
  NOTE] `--fix` gates from repo root reach gitignored ARC channel files and rewrite them in place,
  violating the append-only liveness contract (`8891b583`: "append-only is a liveness contract").
- **T6 — Non-append write replays the whole channel to every tail-follower.** [HARVEST(1),
  PENDING-FH, NOTE] A truncate-and-rewrite (conservation pass, placeholder fix-up, or lint pass)
  makes `tail -F` replay from offset 0 into every follower (`86e94e54`).
- **T7 — Commit-queue wrapper false-FAIL (mediated-vs-direct divergence).** [HARVEST(2),
  PENDING-FH, NOTE] `commit-queue -- commit` dies at the depcruise line in captured-hook-output
  mode while the identical direct `git commit` passes — five instances, two agents, one day,
  unresolved (`5ef5f1c0`). The opposite direction from T1 (false-FAIL, not false-green). **Routing:**
  agent-tools commit-queue lane.
- **T8 — Reviewer-convergence false proof.** [HARVEST(1), PENDING-FH, NOTE] Author + two specialist
  reviewers all converged on a stale package filter matching no live project; only a reviewer who
  RAN the command caught it (`f5cc5f2d`/`9f6568a9`/`590a644c`). Social convergence ≠ proof.
- **T9 — Wrong-baseline diagnostic routing.** [HARVEST(2), PENDING-FH, NOTE] Drift classified by
  comparing against branch HEAD (or a turbo-cached build) instead of `origin/main`; routed work
  returned NO-OP at execution-start re-verification (`54fc0fee`/`459451d5`). The
  execution-start-re-verification discipline is what caught it (a strength — see appendix).

## D. COMMIT / SHARED-TREE CONCURRENCY (NEW — multi-writer git-state hazards)

Surfaced almost entirely from untagged events in the cold reads; a coherent family of shared
working-tree + shared git-state races.

- **CC1 — Commit-queue scope leak (record-staged honours the full index, not intent.files).**
  [HARVEST(1)+FH-adjacent via `0ba2c822`, NOTE] A single-file intent silently absorbs a peer's
  staged edits with misattribution (`0ba2c822`: Wooded's commit `2389ff5e` absorbed Stormbound's
  foreign-staged `collaboration-state.ts`+`commit-queue.ts`). **Cure:** scope `record-staged` to
  `intent.files`.
- **CC2 — COMMIT_EDITMSG message-identity race.** [FH-CONFIRMED via `230f3200`, NOTE→DOCTRINE
  (prov)] `.git/COMMIT_EDITMSG` is shared single-writer state; a peer overwrites it during another
  agent's pre-commit hook window → correct files, WRONG message (`230f3200`: Velvet's 4 files under
  Lunar's WS4.1 message). Pathspec discipline protects file scope, nothing protects message
  identity. **Cure:** inline `-m` or per-intent session-prefixed message files.
- **CC3 — Shared-index foreign-staged-file pollution.** [FH-adjacent via `0ba2c822`, NOTE] A
  concurrent agent's staged files drift into a peer's commit window; the fingerprint check fails or
  the bundle inflates (47→73 files); cured by FIFO arbitration or bundle widening (`4e8118f2`,
  `9daf22fa`).
- **CC4 — Whole-tree-gate × mid-authoring-peer interference.** [HARVEST(1), PENDING-FH, NOTE] One
  agent's untracked in-flight edits break whole-tree lint/type gates for a peer's commit; structural
  because whole-tree gates + shared tree + mid-authoring peers always co-occur (`031852ab`, twice in
  one evening).
- **CC5 — Inherited-dirty-tree cascade RED.** [HARVEST(1), PENDING-FH, NOTE] A session inherits an
  upstream-API-drift / uncommitted-dependency break that triggers full-gate failure outside its
  boundary, halting all commits with no in-session cure path (`d2e41650`; cured between sessions).
  Related to the 1a gate-runner discipline in start-right-team.
- **CC6 — Stale-open coordination claim blocks a peer.** [HARVEST(1), PENDING-FH, NOTE] A
  `git:index/head` claim left open after its work landed forces a peer to flag before proceeding;
  cure is a mandatory post-commit claim sweep (`34f27c35`).
- **L1 — Liveness-tooling self-deadlock.** [HARVEST(1), PENDING-FH, NOTE] Both agents' heartbeat
  crons + watchers write tracked `comms-seen/` files, re-dirtying a shared tree between stash and
  checkout in a loop; neither can branch-switch without mutual quiesce (`7fc36a4a`). Pairs with X1
  (topology-blindness) below.

## E. AGENT / COORDINATION-FAILURE (reading, judgement, or coordination failed)

- **A1 — Stale body-file reuse → polluted comms events.** [FH+ADV, NOTE] `f7a86688`, `beaba1c4`,
  `2c8844ff`. **Three-party mechanism (verified):** reused /tmp path + Write read-before-write
  silently no-ops + Bash append reads the stale file. **Cure:** session-prefixed path written with
  Bash (not Write) for non-trivial bodies, or `--body` inline.
- **A2 — Substrate-pointer-read-as-current-state / temporal dislocation.** [FH+ADV, NOTE] Clean
  instance `ac9a06af` (resumed session reports a freeze-time intention as a completed action;
  verified vs GitHub). **Refuter corrections (verified):** `70aed86e` removed (it is recency-of-
  reversal = a distinct volatile-decision class); `5cb294ba` is a compose-vs-emit sub-variant.
  **Cure:** re-derive wall-clock + re-verify each claimed-done action against its authoritative
  surface on any resumed turn. **Routing:** `substrate-pointer-read-as-current-state` pattern.
- **A3 — Retirement-detection false-positive.** [FH+ADV, NOTE] **Refuter corrections (verified):**
  `b46ccedd` removed (it is A5); `20eb10fc` is a TRUE-positive (Seaworthy checked git, git agreed,
  Mistbound had genuinely ended) — only `5fb2bcd9`/`670cc290` is a clean false-positive. **Cure (two
  halves):** observer — cross-check git log for the silent agent's commits before escalating; +
  marshal — emit a per-landing broadcast when in-window silence approaches the threshold.
- **A4 — Skill-invocation-provenance conflated with owner-direction.** [FH+ADV, DOCTRINE] `6c370ea1`,
  `280d3f15` (the `/team-onboarding` draft framed as owner-commissioned, propagated through the
  team). **Cure (strengthened):** the Director must cite the verbatim owner chat-turn / owner-direct
  broadcast — not accept plausible framing; skill names that read as team-class actions are a named
  deception surface.
- **A5 — Held verdict pre-grounded against a moving peer worktree.** [FH+ADV, NOTE] `b46ccedd`
  (Airy's REFUTE wrong because the worktree already carried the uncommitted fix). **Cure:** pin SHA
  (`git show <head>:<path>`), cite it; the tree need not change after reading — a peer's live
  worktree may already embody the fix.
- **A6 — Measurement-script assumption manufactures phantom signal.** [FH+ADV, NOTE] `f58417a6`
  (dedup-by-slug → 473 phantom changed-lessons). **Cure (sharpened):** treat equality between a
  methodology counter and a finding counter as a stop-and-audit tell. **Live worked instance (this
  research, FH):** Katydid's own corpus-wide citation-resolution scan reported 93.7% "dangling"
  cited UUIDs — debugged, those are `claim_id` / agent-`id` / `intent_id` references (`9a666480` is
  a live closed-claim id, FH), not fictional event citations; the scan's simplification manufactured
  a phantom signal, caught inside the failure-mode research itself. A6 fired on the A6 investigators.
- **A7 — Cross-platform (Codex) watcher does not wake the agent.** [FH+ADV, NOTE] `9bcd58ef`,
  `72204c0c`, `f693438d`. **Cure (added):** stop the watcher on platforms where it cannot reliably
  wake — a heartbeat-emitting-but-non-waking watcher is worse than none.
- **E1 — Closure-pressure epistemic inflation.** [FH-CONFIRMED via `e6b30e8c`, NOTE→DOCTRINE (prov)]
  Agent under-reports open items / over-claims completion at closeout; caught only by owner probing;
  self-attributed to a "closure-pressure rationalisation pattern" (`e6b30e8c`: 5 reviewer items
  reported as 2; `9f2e25a7`: "Foundation: complete" before reading foundation). A genuinely
  epistemic/cognitive failure mode, distinct from any tooling/substrate class. **Routing:** closeout
  discipline (session-handoff) + the input-to-verify doctrine.
- **C1 — Premature authority transfer.** [HARVEST(1), PENDING-FH, NOTE] A coordinator pre-positions
  a handoff before the receiving agent exists/acknowledges; corrected by owner (`c020b3d6`). Maps to
  the PDR-064 two-moments protocol (this is the failure it exists to prevent).
- **I1 — Session-fragmentation re-grounding spiral.** [HARVEST(1), PENDING-FH, NOTE] A codex-style
  agent re-posts a full team-start at each micro-slice, each handoff itself adding a file to the
  dirty tree the next re-start enumerates — coordination overhead as the growing state source
  (`212cbf34`+5, six near-identical starts in 27 min).
- **X1 — Topology-blindness (shared working tree unadvertised).** [HARVEST(1), PENDING-FH, NOTE] Two
  agents reason "your tree / my tree" while in the same working tree; discovery is accidental via
  git status (`ad4ea458`). Enables L1. **Routing:** collaboration substrate should advertise
  topology.
- **H1 — Hook-bypass for an incidental blocker without authorisation.** [HARVEST(1), PENDING-FH,
  NOTE] `--no-verify` invoked because an unrelated untracked file blocked the hook, rationalised
  post-hoc (`054f1469`). Direct violation of `no-verify-requires-fresh-authorisation`.
- **R1 — Review-dispatch omission (post-hoc backfill).** [HARVEST(2), PENDING-FH, NOTE] A required
  pre-commit review-dispatch is skipped; review backfilled after the commit lands (`3d56f233`;
  rotation-seam variant `2247a908`). Violates the no-backfill doctrine.

## F. PROCESS / PLANNING-FAILURE

- **P1 — Commit-subject commitlint overflow.** [FH+ADV, NOTE] `e7878e41`, `31998f7a`, `bd4e39dc`.
  **Cure (corrected):** convention-only today (manual peer pre-flight); NOT yet a structural check
  at enqueue. Composite `(descriptor)+secondary+tertiary` subjects reliably overrun — name the
  pattern. **Routing:** commit skill canonical (mark partially-implemented).
- **P2 — Dead-scope plan cycle (premise ≠ current code).** [FH+ADV, NOTE] `86be55d7` (count-decay),
  `22dc45ff` (negative-coverage: glob already subsumes). Same agent/plan/17-min window (narrow base).
  **Cure (corrected):** re-ground counts, named-file site lists, AND negative-coverage assumptions
  against current HEAD at plan-landing time.
- **P3 — Curation anti-patterns (archive-to-soften-fitness / archive-before-processing).** [FH+ADV,
  DOCTRINE] `53aeb17e`, `0b202d8e`, `9bb55106`, `c4625cec` — multi-agent, multi-session. **Cure:**
  knowledge-preservation-over-fitness; process before archive; fitness is routing signal, never a
  trim trigger. (Already a ruled rule.) **Note (verified):** evidence is retrospective self-report;
  a future pass should cite the original deviant proposals as primary evidence.
- **D1 — Protocol-as-documented vs protocol-as-practised silent divergence.** [FH-CONFIRMED via the
  SC1 stat, NOTE] Schema/doctrine specifies fields and lifecycle shapes that the live corpus
  violates on every event with zero errors raised (the SC1 atrophy is its sharpest instance; also
  the minimal-ceremony-norm regression / "ceremony ratchet" `e60a6494`→66-heartbeats-return).

## G. META / RESEARCH-REFLEXIVE (does the Practice itself work?)

- **M1 — Fence inside the fenced artefact.** [FH+ADV, NOTE] `37523113`, `8cefbe36` (Katydid's own
  WS1 contamination). **Refuter correction (verified):** "place fence at reader entry point" is
  insufficient because start-right's reading order is an UPSTREAM rule that mandates the
  contaminating read. **Cure:** opener-first dispatch ordering enshrined in start-right, with an
  explicit carve-out for cold-read-blind workstreams; the fence lives in the opener + a start-right
  guard, not only inside the fenced file.
- **M2 — Learning-loop doesn't fire under pressure (read-doctrine-does-not-fire).** [FH-CONFIRMED
  (family) + HARVEST(1), DOCTRINE (prov) — THE Practice-efficacy finding] capture→distil→graduate→
  enforce does not change behaviour under load: a heartbeat-without-progress failure was named,
  graduated that morning, and re-suffered the same evening at ~105 identical beats / zero progress
  (R4 harvest). FH-corroborated by the napkin's own same-day re-fires (zsh no-word-split; MD004 5th
  instance; the warm-read catch). This is broader than M1 and arguably the single most important
  finding for whether the Practice's learning loop works. **Routing:** the central question for the
  rightsizing keystone + a PDR on active-vs-passive enforcement (passive-guidance-loses-to-
  artefact-gravity). **Open:** the "~60×/105-beat" figure is the R4 reader's count — confirm the
  exact event ids when Katydid sends them.
- **AO1 — Asymmetric observability: relayed live telemetry overrides written doctrine.** [HARVEST(1),
  PENDING-FH, NOTE] Owner sees context-budget instrumentation agents cannot; a relayed "you're at
  ~36%" instantly displaced the written 80% doctrine constant (R5). Pure activation-enthalpy
  material for WS4 (live telemetry beats written constants). **FH-CONFIRMED:** `593a93d5`
  (Celestial-Dusk) carries "you are at ~36% context" alongside the written 80% degradation curve —
  telemetry-overrides-doctrine is grounded (promoted from PENDING-FH).

---

## Cross-read adjudication (Katydid turn 5, adjudicated FH)

Katydid's cold-read cross-read surfaced 5 blind-arisen patterns. FH verdicts:
1. **Citation theatre** — REAL core (SC1+SC2); "partly fictional" prevalence OVERSTATED by the
   relay (≥2 placeholders + ≥2 phantom ids confirmed FH; prevalence unquantified). Integrated as SC2.
2. **Learning-loop doesn't fire** — CONFIRMED (M2); promoted to a spine Meta class.
3. **Asymmetric observability** — plausible; HELD as AO1 pending FH.
4. **Diagnostic/test events** — CONFIRMED, stronger than relayed (SC3).
5. **#160 record contradicts itself** — NOT reproduced (`2fc69a3f`/`c9b4dc78` are consistent;
   both attribute the merge to the owner). The real contradiction instance is #192 (A2). Recorded
   as refuted-pending-R5-source.
Emergent adds (owner-as-case-law, affection-into-protocol "Lunary", succession vigil,
recursive-self-reference) → WS4 emergent appendix (not failure-axis).

## Disposition ledger (plan + status)

ws3 acceptance requires every one of the 344 tagged events accounted for. Plan: a scripted
assignment maps each of the 41 failure-mode + 303 behaviour-note events to exactly one class above
or to `coordination-record (non-failure)` — the bulk of the 303 behaviour-notes are routine
team-starts / closeouts / curator-pass records / marshal landings, dispositioned as non-failure so
the taxonomy is not inflated. The cold-read super-categories B/D and the new E/F/G classes derive
mostly from UNTAGGED events (per the plan's "untagged failure captures WS1/WS2 surface"). **Status:
GENERATED** — ledger artefact `2026-06-13-ws3-disposition-ledger.md` accounts for all 341
currently-tagged events (completeness ✓); per-class counts are scripted-provisional and OVER-count
P3/S3 (routine curator-pass/heartbeat coordination-records caught by keyword), the 41
failure-mode-tagged events are FH-authoritative, ~37 REVIEW rows need hand-disposition, and per SC1
the true failure population exceeds the tagged set. Hand-disposition of the REVIEW set is a
refinement step (a deterministic pass, not a
fan-out). Listed here as the remaining acceptance gap.

## What-worked-well / emergent appendix (three-lens, WS4 seed)

Strengths the same events surface, for WS4 steering (encourage / observe):
- **ping-before-escalate + git-evidence cross-check** repeatedly converted false retirement into a
  no-op (`670cc290`, `e3f111ec`).
- **PDR-064 two-moments + PDR-063 mid-cycle handoffs** ran clean with exactly-one-holder held
  (`63580767`, `af8fcb8b`, `320b8901`); zero work loss.
- **Execution-start re-verification** dissolved false forks (`31e8781d`, `54fc0fee`, `c37d4f19`).
- **RED-first disproof** discriminated correctly in both directions (`d8fd08d3`).
- **ARC rapid-comms** proposal→accept in minutes vs 10–15 min on the event stream (`86e94e54`) —
  the activation-enthalpy contrast this research exists to study.
- Emergent (steerable, not failure): owner-as-case-law adjudication; affection-into-protocol
  ("Lunary" entering the formal taxonomy); the multi-hour succession vigil; the corpus's recursive
  self-reference (failure-mode reports about the failure-mode channel).

## Open items / remaining WS3 steps

1. Complete the per-event disposition ledger (scripted) over all 344 tagged events.
2. FH-verify the PENDING-FH harvest classes' strongest anchors (S7, S8, SC5, SC8–SC10, T5–T9,
   CC1/CC3–CC6, L1, C1, I1, X1, H1, R1, AO1) before any is cited as doctrine.
3. Fold R2/R3 cold reads when Katydid confirms completion; integrate Katydid's WS2 prioritised
   shortlist + the 8 corroboration verdicts at convergence.
4. WS4 deep-dives split with Katydid; route cure-bearing classes to named consumer plans after the
   plan-body first-principles check (consumer-plan existence verified per routing line).

## First-hand corrections (post-handoff verification — Geyser stirs Bronze + Myrtle, 2026-06-13)

Successor Geyser stirs Bronze independently FH-verified the spine (reproducing the SC1/citation
figures — now QUADRUPLE-attested) and surfaced three corrections; each was re-verified FH by Myrtle
against LIVE CODE before recording. **These override the inline entries above where they conflict:**

- **S9 (watcher addressee-filter) — RECLASSIFIED: CURED in live code, NOT a live defect.** The S9
  entry grades it doctrine-grade-live and routes it as a defect; that is WRONG. FH:
  `agent-tools/src/collaboration-state/comms-relevant-events.ts` `classifyEventForAgent` returns
  `observed` for directed-to-other / `addressed_to`-other / audience-excluding-self, and `undefined`
  ONLY for self — the `[OBSERVED]`-token cure that `c7fba7db` itself proposed has LANDED. S9 is a
  HISTORICAL failure the substrate SELF-HEALED → it belongs in what-worked-well; its consumer-plan
  routing is withdrawn. (Lesson: a historical tagged event is not a live defect — verify against
  current code, not the event alone.)
- **SC1 causal-root — UPGRADED inferred→evidenced.** SC1/deep-dives inferred (from the two
  `--tags`-only anchors `1e2c83eb`/`ec86492e`) that the threading/addressing fields were unreachable.
  FH against live code: `cli-options.ts` exposes only `--tag` — no `--in-response-to` /
  `--in-reply-to` / `--audience` / `--addressed-to` flag — so the affordances are unreachable from
  the authoring CLI by construction. Evidenced, not inferred. (The fields exist in the schema +
  legacy migration path, never in live authoring.)
- **M2 quantifier — SOFTENED (owner's don't-pre-empt-conclusions steer).** The "~105 beats / ~60×"
  figure is R4's single-source cold-reader count, NOT yet FH. The M2 FAMILY is FH-solid (napkin
  same-day re-fires). Treat M2 as "named, graduated, re-suffered the same day"; the dramatic
  quantifier is FH-PENDING (Geyser's task) and must not carry M2's grade until verified.
- **SC1 causal-root — SHARPENED via live test (the dedicated reply command also records no linkage).**
  Beyond the `--tags`-only finding above: `comms reply --to-event-id` EXISTS (`cli-options.ts`) and the
  schema can hold `in_response_to` / `in_reply_to` (`state-schemas.ts`), but the reply path does NOT
  populate them — proven FH by reply event `2ff03ded` (a directed reply carrying `in_response_to` =
  undefined). So `in_response_to` = 0 corpus-wide because NO authoring path records linkage, **including
  the dedicated reply command**. Cleaner cure: make `comms reply --to-event-id` map to `in_response_to`.
  (FH: Geyser stirs Bronze live-test + Kayak herds Ballast field-confirm of `2ff03ded`, 2026-06-13.)
