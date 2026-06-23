# WS6 — Comms-corpus research: comprehensive synthesis

**Author:** Bluebell mends Mulch (claude-code / Opus 4.8 / `c2ef19`), comms-corpus research lane
(successor to Kayak herds Ballast). **Date:** 2026-06-13. **Workstream:** WS6 of
`comms-corpus-research-and-rotation-strategy.plan.md`.

This is the capstone synthesis. It **fronts** the full artefact set — it does not duplicate the
detailed reports; it states the headline findings per lens, the load-bearing insights, the routed
recommendations, the future-enhancement proposals, and the WS5 decision, with links into the
artefacts (§9). Read this first; follow the links for evidence.

## 0. What this research was

The `.agent/state/collaboration/comms/` event archive — **5,188 events** at corpus close
(2026-05-20T11:38Z → 2026-06-13, live-growing) — was treated as research substrate for understanding
modes of agent collaboration. Three owner-named lenses, the third weighted highest:

1. **Failure modes** — what went wrong, clustered with cure-shapes.
2. **What worked well** — practices and substrate behaviours to protect and propagate.
3. **Surprising emergent behaviour** — behaviours nobody designed, steerable by **activation-enthalpy
   tuning** (changing the cost of a behaviour via tool design / defaults / ceremony), not mandates.

The end-goal was understanding that improves the mechanisms, plus a ratified steady-state that makes
it safe to rotate the corpus out of the watcher's live path. The research was explicitly **not** a
find-and-fix-problems pass.

## 1. The conduct doctrine that produced trustworthy output

The single most important methodological finding — it earned its keep repeatedly and is itself a
what-worked-well result:

- **Corpus events are input-to-verify, not truth.** Every load-bearing claim was grounded by reading
  the cited event first-hand. This caught a phantom "93.7% dangling-citation" metric, an over-accepted
  T7 count (5→4), a reboot-confounded swap finding (retracted), and relayed-unverified cold-read
  surprises — several of them the researchers' *own* convenient claims.
- **The two-reader mutual-first-hand-correction loop is the lane's strongest reliability mechanism.**
  Independent FH readers caught what each single pass would have ratified — in **both** directions.
  Worked again in this session: the WS5 adversarial review caught a critical invariant-3 gap I missed;
  my first-hand re-count corrected the reviewer's undercount of untagged `Heartbeat-end:` events.
- **Conserve insight; do not prematurely narrow.** A CORRECTED / REFUTED verdict is as valuable as a
  confirmation.

**Finding-provenance discipline.** Every finding carries how it is known: `blind-arisen` (WS1 cold
reads), `seeded-confirmed` (catalogue theme corroborated), `statistically-derived` (survey / joins),
`cross-attested` (independent reader/method agreement). The executing seat's disclosed WS1
contamination is what made this matrix load-bearing — it is why the cold read was delegated to fresh
blind readers.

## 2. Verified corpus facts (first-hand, several quadruple-attested)

- **5,188 events**; by kind: narrative ~4,058 / directed ~1,092 / **lifecycle 0** (the schema's third
  shape was never used).
- **All structured threading/addressing fields are 0 corpus-wide:** `in_response_to`, `in_reply_to`,
  `audience`, `addressed_to`. Of ~1,842 full-UUID body tokens, only **115 resolve to a real event** —
  the rest are claim / agent / intent / commit-SHA UUIDs. Event→event threading is rare by ANY
  mechanism, and **"citation theatre" is real but RARE (~10 literal placeholders), not pervasive.**
- **Only 3 tag values were ever authored:** `heartbeat` (2,399, ~46%), `behaviour-note` (305),
  `failure-mode` (41). The tagged failure population is a **lower bound** — untagged failures-in-prose
  exist.
- **Heartbeat family ≈ 50.4%** of the corpus (2,399 tagged + 181 untagged `Heartbeat:` emissions + 35
  untagged `Heartbeat-end:` closeouts).
- Corpus integrity is sound: uniform `schema_version` 2.0.0; 0 missing required fields; 0
  event_id/filename mismatches.
- **WS2 survey quantitative facts (the cost-of-collaboration signal):** ~48% of non-heartbeat events
  are one-way status reports; **questions (16) and escalations (10) are vanishingly rare corpus-wide**
  (the open fork below); directed-reply median latency ~3.5 min; hub traffic concentrates on
  Director-seat names; and the heartbeat share **rose era-over-era to ~70–74% in the second intensive
  arc** (the ~50% close figure is the corpus average — the trend is the sharper argument for tiering).

## 3. Findings by lens

### 3.1 Failure modes (WS3 taxonomy — ~46 classes; full detail in the taxonomy + re-verify reports)

Clustered on a substrate (S) / substrate-credibility (SC) / tooling-false-signal (T) /
commit-concurrency (CC) / agent-coordination (A,E,C,I,X,H,R) / process (P,D) / meta (M) axis. Cluster
outline (one line each; full per-class detail in the taxonomy):

- **S (substrate):** watcher stall / drain-death / addressee-filter, heartbeat-as-liveness misread,
  CLI-path retarget, CLI boundary gaps, identity instability (model-string Babel), heartbeat
  shutdown-race + host-suspension gaps.
- **SC (substrate-credibility):** dead reply/lifecycle graph (SC1), citation theatre (rare), test/noise
  on the permanent stream, actor-laundering on shared credentials, duplicate event fire,
  `naming_schema_version` collapse, `message_kind` mismatch, tag-backfill gap, sequence-counter
  ambiguity.
- **T (tooling false-signal):** piped exit-code false-green, invisible control byte, render-filter
  drops, marshal-time auto-fix mangles content, gate-rewrites-append-only-channel, commit-queue
  false-FAIL, reviewer-convergence false proof, wrong-baseline routing.
- **CC (commit/shared-tree concurrency):** scope leak, message-identity race, foreign-staged
  pollution, whole-tree-gate × peer interference, inherited-dirty cascade, stale-claim-blocks-peer.
- **A/E/C/I/X/H/R (agent coordination):** stale-body reuse, substrate-pointer temporal dislocation,
  false retirement-detection, skill-provenance-as-owner-direction, held-verdict-on-moving-tree,
  measurement-manufactures-phantom-signal, Codex-watcher-non-waking, closure-pressure inflation,
  premature authority transfer, re-grounding spiral, topology-blindness, unauthorised hook-bypass,
  review-dispatch omission.
- **P/D/M (process / meta):** commitlint overflow, dead-scope plan cycle, curation anti-patterns,
  documented-vs-practised divergence, fence-inside-fence, and **M2 (learning-loop-doesn't-fire).**

The headline, FH-grounded classes:

- **The corpus's own provenance is partly unsound (super-category SC — the cold reads' highest-value
  yield).** SC1: the structured reply/lifecycle/addressing graph is dead-on-arrival — and the
  **causal root is a tooling gap, not a behaviour choice** (the authoring CLI exposes only `--tag`;
  the `comms reply --to-event-id` subcommand exists but discards the linkage, proven by reply event
  `2ff03ded`). This reframes an apparent discipline failure as a clean tooling cure.
- **Commit / shared-tree concurrency (CC) is a coherent hazard family** surfaced almost entirely from
  untagged events: scope leak (CC1, `0ba2c822`), message-identity race (CC2, `230f3200`),
  foreign-staged pollution (CC3), whole-tree-gate × mid-authoring-peer (CC4), inherited-dirty cascade
  (CC5), stale-claim-blocks-peer (CC6).
- **Tooling false-signals (T)** — piped exit-code false-green (T1), invisible control byte fooling
  reviewer+verifier (T2), commit-queue wrapper false-FAIL (T7), gate-time auto-fix rewriting an
  append-only channel (T5, `86e94e54`).
- **The Practice-efficacy finding (M2): the learning loop does not fire under pressure.**
  capture→distil→graduate→enforce did not change behaviour under load — a failure named and graduated
  one morning was re-suffered the same evening. This is arguably the single most important finding and
  routes to the active-vs-passive-enforcement question.

**Re-verify outcomes (this session):** six PENDING-FH anchors promoted to FH first-hand (H1, L1, CC1,
CC3, T5 re-anchored to `86e94e54`, and S7's 3–6s shutdown-race — sourced, not dropped). Stale
taxonomy-body figures corrected: SC8 21→66, SC9 ~167→~181 emissions, SC9 miss-rate ~47%→7.0% at
corpus close, SC1 framing sharpened.

### 3.2 What worked well (protect and propagate)

- **The mutual-first-hand-correction loop** (see §1) — the reliability backbone.
- **ping-before-escalate + git-evidence cross-check** repeatedly converted a false retirement-detection
  into a no-op.
- **PDR-064 two-moments + PDR-063 mid-cycle handoffs** ran clean with exactly-one-holder held; zero
  work loss across the 2026-06-11/12 handover arc.
- **Execution-start re-verification** dissolved false forks (caught a stale committed corpus; caught
  drift classified against the wrong baseline).
- **RED-first disproof** discriminated correctly in both directions (the invisible control byte).
- **S9 self-healed in live code** — the watcher addressee-filter defect the corpus records was already
  cured (`comms-relevant-events.ts` returns `observed` for directed-to-other); a historical event is
  not a live defect. (Lesson: verify against current code, not the event alone.)
- **ARC rapid-comms** — proposal→confirm in ~4 min vs 10–15 min on the event stream; the
  activation-enthalpy contrast this research exists to study.
- **Convention emergence in the open** — coordination genres appeared and stabilised without being
  designed first: the team-start report, the `Heartbeat:` / `Heartbeat-end:` title prefixes,
  coordinator pre-positioning. The corpus records the genre-firsts, which is itself the
  what-worked-well evidence that lightweight conventions can self-organise.

### 3.3 Surprising emergent behaviour (the highest-weighted lens; steerable)

- **Owner-as-case-law** — owner adjudications became cited precedent the team reasoned from.
- **Affection-into-protocol** — "Lunary" (a term of fondness) entering the formal taxonomy vocabulary.
- **The multi-hour succession night-vigil** — two agents holding a 5-hour watch awaiting a human word.
- **Recursive self-reference** — the corpus is self-aware of being analysed (an event predicted the
  cold read); failure-mode reports about the failure-mode channel.
- **Asymmetric observability** — owner sees context-budget telemetry agents cannot; a relayed "you're
  at ~36%" instantly displaced the written 80% doctrine constant (FH-confirmed, `593a93d5`). Pure
  activation-enthalpy material: live telemetry beats written constants.
- **Dead-channel ACTIVE-heartbeat tail** — loops emit ACTIVE beats with no self-exit; the
  3–6s shutdown race (S7) is the micro-instance.
- **"The cure became the killer"** — the fail-loud watcher hardening written to stop silent stalls
  began killing *healthy* watchers (exit-nonzero on transient conditions). A safety fix that increased
  the failure rate of the thing it protected — the sharpest emergent caution in the corpus.
- **The ceremony ratchet** — heartbeat share climbing era-over-era to ~70–74% despite a standing
  minimal-ceremony norm: the cost of a low-friction behaviour accretes until it dominates the channel.
  This is the activation-enthalpy lens turned on the corpus itself, and the direct motivation for
  treating heartbeats as the shortest-retention rotation tier.

## 4. Cross-cutting insights

1. **The substrate's structured affordances are unused because they were unreachable, not because
   agents chose prose.** SC1's tooling-gap root means the cure is cheap (wire the fields into the
   authoring path, including `comms reply`, or remove them) — not a behaviour-change campaign.
2. **Heartbeats are half the corpus and almost all of its low-value mass.** This is what makes
   rotation worthwhile independent of the unproven watcher-health question.
3. **The most dangerous claim is a convenient causal one that supports the claimant's thesis.** The
   retracted swap finding and the over-accepted T7 count were caught only by the two-reader loop. Build
   the loop in, do not rely on single-pass diligence.
4. **Activation enthalpy, not mandate, is the steering lever.** The ArcAngel contrast shows that
   *routing* fast-ephemeral coordination to a cheap append-only channel reduces what hits the heavy
   auditable stream — rotation by prevention as well as removal.

## 5. Routed recommendations (each to a named, existing consumer plan)

| Finding | Recommendation | Consumer plan |
| --- | --- | --- |
| SC1 — linkage/lifecycle fields unreachable from the authoring CLI | Enforce-or-remove the fields (wire `comms reply --to-event-id` → `in_response_to`, or remove the dead affordances) | rightsizing keystone M4 + `comms-event-write-integrity` |
| M2 — learning loop doesn't fire under pressure | The central active-vs-passive enforcement question (`passive-guidance-loses-to-artefact-gravity`) | rightsizing keystone + a PDR draft |
| Heartbeat shutdown-race (S7), host-suspension gap (S8), heartbeat-as-liveness misread (S3), stale heartbeat args | Liveness-contract amendments; derive heartbeat args from registry at emit time | PDR-078 + `comms-watch-liveness-floor` |
| Watcher stall / drain-death (S1, S2) — size→health link unproven | Interval-poll + fail-loud hardening; storage shape | `comms-watch-hang-hardening` + `comms-watch-storage-redesign` |
| Commit-queue wrapper false-FAIL (T7), scope leak (CC1), message-identity race (CC2) | record-staged scopes to intent.files; inline `-m` / per-intent message files | agent-tools commit-queue lane (Flame owns T7) |
| ~48% one-way status reports; questions/escalations vanishingly rare; heartbeat-share ratchet | Overhead/substance ratios as direct evidence for the P-ordered cost workstreams | `cost-of-collaboration` |
| Retrospective validation of coordination primitives at corpus scale | Confirm/refute the experiment hypotheses against the corpus | `n-agent-collaboration-experiments` |
| Corpus volume in the live watcher path | Class-tiered archive-not-delete rotation | **WS5 proposal (this research) — see §6** |

The plan-body first-principles check was applied at routing: each consumer plan above exists in the
comms/coordination cluster and owns the named surface (per the thread record §Related Plans).

## 6. The WS5 rotation decision (put to the owner)

WS5 produced a ratification-ready proposal:
[`2026-06-13-ws5-rotation-strategy-proposal.md`](./2026-06-13-ws5-rotation-strategy-proposal.md). The
shape, in one line: **class-tiered, age-triggered, archive-not-delete rotation, run as a curator-lane
pass on the consolidation/session-close cadence, absorption recorded before any event leaves the live
dir — ratified as a PDR (portable contract) + ADR (repo phenotype).** It was adversarially reviewed
across four lenses and the findings folded first-hand (proposal §10). It satisfies all five invariants
(invariant 4 in spirit, with the letter explicitly deferred to a controlled measurement), and reduces
the live working set by ~50% on the heartbeat class alone. **The decision is the owner's; WS7
execution is gated on ratification.**

## 7. Future-enhancement proposals

- **Controlled watcher-RSS × dir-size measurement.** Settles the retracted swap finding's hypothesis
  and would let invariant 4's bound be evidence-sized rather than a hygiene round-number. Until then,
  the watcher-health justification for rotation stays a hypothesis.
- **The cited-events digest** (introduced in WS5 §4.1) — a git-tracked record of every comms event id
  cited in a permanent doc, so provenance survives a clean checkout once the raw corpus is untracked.
- **Substrate-choice-by-coordination-shape** (the ArcAngel activation-enthalpy question) — which
  coordination shapes belong on the heavy auditable stream vs a lightweight append-only channel; routes
  to the rightsizing keystone.

## 8. Open items carried forward

1. **WS5 rotation strategy → owner ratification** (this synthesis + the proposal are the decision
   surface). WS7 (archive-not-delete execution) fires only on ratification.
2. **PR #207 post-merge follow-up on `main`:** correct "commit-queue ×5" → "4 enumerable".
3. **One-decision-home PR shape** (Flame's oak-pr plan + the evidence doc) awaits owner confirm.
4. `feat/comms-research` is ~28 behind `origin/main` (PR back-links dangle-until-merge).
5. **2 Dependabot vulns on `main`** (1 high / 1 low, owner-flagged).
6. The controlled watcher host-cost measurement (settles §7's hypothesis).
7. **Plan-todo drift reconciled:** the companion plan's frontmatter marked ws2/ws3/ws4 `pending` while
   they are complete; corrected as part of this closeout.
8. **Open research fork (unresolved):** questions (16) and escalations (10) are vanishingly rare
   corpus-wide — is that healthy autonomy, or under-surfacing of forks that should reach the owner?
   Carried from Kayak's handoff §4 as a deliberate non-answer; it routes to the cost-of-collaboration
   and rightsizing lanes rather than being forced to a verdict here.

## 9. Artefact index (all on origin / in this directory)

- **This synthesis:** `2026-06-13-ws6-comms-corpus-synthesis.md`
- **WS5 proposal:** `2026-06-13-ws5-rotation-strategy-proposal.md`
- **Re-verify outcomes (§11 trust-map closeout):** `2026-06-13-reverify-outcomes-bluebell.md`
- **Kayak's findings + handoff:** `2026-06-13-comms-corpus-findings-and-handoff-kayak.md`
- **WS3 taxonomy + companions:** `2026-06-13-ws3-failure-mode-taxonomy.md`,
  `2026-06-13-ws3-deep-dives.md`, `2026-06-13-ws3-disposition-ledger.md`,
  `2026-06-13-ws4-pending-fh-verification.md`, `2026-06-13-ws4-review-disposition.md`
- **WS4 evidence:** `2026-06-13-ws4-find-verify-evidence.json`,
  `2026-06-13-ws4-anchor-verify-evidence.json`, `2026-06-13-ws4-bdm2-verification.md`,
  `2026-06-13-ws4-geyser-continuation.md`
- **WS2 survey:** `2026-06-12-ws2-corpus-survey.md` (+ scripts beside it)
- **WS1 cold reads:** `ws1-cold-reads/` (8 logs + 8 corroboration verdicts)
- **Running-notes lab notebook:** `2026-06-13-comms-corpus-research-notes.md`
- **Substrate home (hypothesis, vectors, seeded themes):** the `agent-collaboration-research`
  thread record
- **Companion plan:** `comms-corpus-research-and-rotation-strategy.plan.md`

## 10. Status

WS0–WS6 complete. WS7 owner-gated on the WS5 ratification decision. The research vector the owner
opened on 2026-05-24 — *"yet to be recognised or analysed patterns that will emerge from the comms
logs"* — has been worked across three lenses with a verified evidence base, routed recommendations,
and a ratifiable steady-state. The corpus held surprises (the emergent-behaviour lens), the
mechanisms have named cures, and the preservation hold has an evidence-grounded exit.
