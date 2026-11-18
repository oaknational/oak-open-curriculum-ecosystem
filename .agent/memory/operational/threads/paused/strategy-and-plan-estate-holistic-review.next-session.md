---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Next-Session Record — `strategy-and-plan-estate-holistic-review` thread

Holistic work on Oak's **vision, strategy, and planning estate** — three
**separate, co-equal, first-class bodies of work**. The transition this thread
serves: **the repository is moving from an important experiment to an important
product** (owner, 2026-06-17). The relationship between the layers is
**informational dependence, not execution order** (owner, 2026-06-18):

> **Dated strategy amendment (owner, 2026-08-30):** the Oak Innovation Kit is the
> fourth value stream and `innovation-kit` is a distinct first-class strategic node.
> This supersedes this thread's earlier three-stream count; the diagram below is trued
> to four without changing the informational dependency direction or the two-part vision.

```text
Oak's strategy → our vision → our strategy → our planning
(we align, not fulfil)   (4 streams)   (cohesive system)   (the estate)
```

Each arrow means *what must be known to author the next layer correctly*. Bodies are
co-equal in **importance**; they differ in **work-volume** (the estate restructure is
~80% of the work) and **dependency-direction** — never collapse those axes into
"priority". Re-org is **value-preserving**: express the value encoded in plans more
clearly; never delete ideas. **Scope authority is the controlling plan**
[`vision-strategy-and-plan-estate.plan.md`](../../../../plans-backlog-2026-07/product-development-governance/vision-strategy-and-plan-estate.plan.md),
reconceived to this model 2026-06-18. This record is the **pickup surface**, not scope authority.

## Where the current state is

PAUSED 2026-09-06: no fork lane; the identity row in `repo-continuity.md` is stale by its own
note. The arc's last state is the section below (2026-07-16): the refounding lanes resume at a
named gate (the restatement-remediation cures landed, the freeze-recut check ruled), and the
Director handoff record it names is machine-local to a July checkout and does not exist on
this line. Scope and sequencing live in the plans, never here: the controlling plan above;
`planning-estate-rewrite.plan.md` (WS2 the idea-node schema and WS4 the thin-slice proof, both
still the parallel next steps, gated as the plan says); `plan-corpus-refounding.plan.md` (P1 to
P14, the owner-gate register, the cost ledger) with its design record and the
`.agent/plans-refounding/` artefact root (the freeze-planning sitting of 2026-07-14, the S1
deterministic evidence contract, the Walk-A structure priors); ADR-200 and ADR-201.

The journal from 2026-06-22 to 2026-07-16 (fifteen "Where We Are / Were" entries: the
architecture's convergence, the corpus-refounding commission, R0a to R0c, the main-commit guards,
the dedicated consolidation pass, r1's G2+G3 sitting and the pre-S0 tranche, the freeze-planning
sitting and the rule's ratification, S0, the S1 deterministic slice, the r2 seed and the
restatement-remediation gate) was curated on 2026-09-20 by graduate, then archive. The whole
pre-curation record is preserved at
`.agent/memory/operational/archive/strategy-and-plan-estate-holistic-review-thread-2026-09-20.md`,
byte-identical to the record committed at `SHA:52c376002` (blob `fc7d810df`). It was read by the
split method (two analysts, the join by grep; the file runs newest first, so each entry's next
step resolves in the entry above it). Its lessons were found homed before the move: the WS4 hard
gate and the non-goals anti-patterns in ADR-200; "scope from the goal, not from the pointer" in
`scope-from-goal-before-approach`; agent-produced inputs as input-to-verify in `verify-dont-trust`;
"mergeable is not READY" and the shepherding seat's truly-green merge (re-trued 2026-09-03) in
`pr-lifecycle`; bypass mechanics outside agent-facing doctrine in `never-commit-to-main`; the
disposable audit adapter never a standing warn-tier validator in PDR-126; doc-to-code sync as
validator work in `validate-ratified-lists`. The settled decisions and the method below stay in
the record's words.

## Landed arcs (the journal's entries, by their merge commits)

- Architecture (2026-06-22): ADR-200 and ADR-201 with the rewrite plan at `SHA:e33a278f9`; the
  `no-agent-substrate-access` lint rule at `SHA:a3ca73f1a`; PDR-113 graduated.
- Corpus refounding R0 (2026-07-06 to 07-08): commissioned and designed 2026-07-06 (G-ADR
  ratified, V0.1 signed); R0a as #315 `SHA:9994781b2`, #317 `SHA:3bc698531`, #321 `SHA:af6c285e5`
  and the G1 sitting's record #322; R0b as #323 `SHA:751ce9699`; R0c as #325 `SHA:8385bc41a`,
  with #324 `SHA:5faf08205` (the five-seat continuity chain) and #327 (the mergeable-is-not-READY
  doctrine); the dedicated consolidation pass drained the arc's capture debt.
- The main-commit guards (2026-07-08): #332 `SHA:d89d5c379` (`never-commit-to-main` and the shared
  five-hook branch guard), #333 `SHA:9a1bb14d6`, #334 `SHA:5efe61aaa`, #335.
- r1 to S1 (2026-07-14 to 07-15): G2 and G3 ruled at the owner sitting; the pre-S0 tranche #370
  `SHA:89f65108d`; the reconciliation omnibus #372 `SHA:3254dbc34`; the freeze-planning sitting's
  ratification #377 `SHA:019448a16`; S0 as #379 `SHA:68d6d232` (681 files frozen) and the
  orphan-recovery #380 `SHA:55a69ceca`; the S1 deterministic evidence contract #382
  `SHA:de3cc54c1`; #706 closed on a proven-redundant regeneration proof.
- r2 and the remediation gate (2026-07-16): #390 and #391 (the r2 seed); the restatement-audit
  module #393; PR #387 `SHA:c0aba5a5b` (the tooling lane). Three pull requests the journal names
  once and never resolves (#329, #374, #375) have no merge commit in this history.

## Lessons with no other home (the record's words, 2026-07-08 to 07-16)

- A git hook's behaviour is verified by a hand-run script, never a committed CI test (owner
  ruling, 2026-07-08; the branch guard was proven 11/11 in a scratch harness).
- No-loss is two directions plus a bad-pile re-screen by a fresh-context reviewer that did not
  perform the harvest; the independence requirement governs the whole audit, and independence is
  constructed, not asserted.
- The calibration disclosure of a reader-sample residual is evidence that the residual is
  necessary, not permission for blanket dispatch.
- A halt of more than 20 % unmapped status at an audit run is the trigger for the next status
  table, not a defect.
- A union that re-homes continuity can drop an era (the Goshawk and Rigel era fell out of this
  record and `repo-continuity.md` at #324 and was restored by concept-union at the next
  closeout): a union is checked for what it dropped, not only for what it merged.

## Where We Are (2026-07-16, Mussel rides Coral 6f8857 sitting Director — RESTATEMENT-REMEDIATION GATE ACTIVE; refounding lanes resume at the cures-landed + freeze-recut-check gate)

The r2 landing exposed the estate's dominant defect class, and the owner redirected the
arc onto curing it before the big push. PR #390 (the r2 refounding protocol docs) took 8
review rounds / ~38 Copilot findings traced to ONE generator — authored restatement of
derivable state; #390 and #391 are MERGED (the r2 seed is on main). The owner-approved
remediation plan (named in the Director current-state record below) has three
deliverables: pr-lifecycle hardening, the restatement-audit fleet (module + the T3+U
run; the canary pilot's corrected scorecard is the measured basis for the v2 respec —
grounding fidelity 62/62 with classification precision unmeasured, join fragility 43
predicates over 62 instances), and prevention validators that pin the cures.
Deliverable, PR, and dispatch states — including any halts and their clearing
conditions — are live values: read them from the claim's handoff record and the PRs
themselves, never from this section. Team Mango wound down to a
COMPOUND PAIR (owner-directed 2026-07-16): Director Mussel rides Coral (6f8857) +
implementer Vole hunts Perch (36c6ca) as mutual adversarial checkers via the ARC channel.
The
refounding lanes (the S1 reader-sample leg; the r2 pilot evidence pass — lane detail
lives in their plans and the live handoff record) RESUME AT A NAMED GATE: the
remediation cures landed (Deliverable 3) + the freeze-recut check ruled (guiding plan
Sequencing 5) — then the owner sequences the big push.

**Pickup**: the Director claim's `handoff_record_path` →
`.agent/state/collaboration/handoffs/2026-07-16-director-current-state-mussel-6f8857.md`
(untracked-by-design; read end-to-end first — it names the guiding plan, the halt
conditions, and the queue); then the napkin's 2026-07-16 entries; then sweep comms.

## Settled corpus-design decisions — do not re-litigate

These protect the restructure from re-opening settled questions (folded from the Kiln guards Patina
loss-scan):

- **Reachability is safe for the restructure:** no anchor-deep links into the `docs/strategy/` corpus exist anywhere in the estate — every consumer (root READMEs, `VISION.md`, `high-level-plan.md`, the controlling plan) links the README, not its sections. A Body-3 restructure can move strategy sections freely **provided the README stays the entry point**.
- **Strategy detail files use strategic-lineage frontmatter** (`title` / `type` / `status` / `derives_from` / `governed_by`), NOT `fitness_*` and NOT `boundary` / `authority` — a leadership strategy corpus wants lineage and role, not size-budgets. Match it when re-composing or extending the corpus.
- **Rejected alternatives (settled, do not rebuild):** (a) a `streams/` subdirectory — rejected as cosmetic balance masking a content gap (balance is a content problem, not a layout one); (b) splitting alignment from streams — combined into `alignment-and-streams.md` per the over-structuring guard; (c) the `serves_strategic_choice` ID-contract home is the controlling plan (the authority), explicitly NOT `suggestions/governed-repo-document-graph.plan.md` (a subordinate `status: future` input — making it the contract home is a category error).
- **The owner's stream-file edits are sign-off (final substance), not drafts** — do not "tidy" them.

## Method carried forward

- Long analytical sessions **narrow and over-claim** — this session took ~6 owner
  re-framings (experiment→product, question-the-order, co-equality-not-tension,
  vision-is-not-a-kitchen-sink, mission-verbatim-not-paraphrased). Self-ask on a
  cadence: *still at the right altitude? has the newest input reframed it? am I
  over-claiming? is this "tension/conflation" an owner judgement or my unverified
  frame?*
- **An agent-sourced claim of product "tension/conflation" is a product judgement
  the owner owns** — default to co-equal-by-design until the owner names a real
  tension. (The §13 conflation claim was the trap.)
- **Authoritative/mission language is quoted exactly, never smoothed for prose.**
- Treat all agent-produced inputs (sub-agent reviewers, survey waves, K1–K3) as
  **input-to-verify**; validate load-bearing claims first-hand.
- **Scope from the goal, not from the pointer (2026-06-18).** This session's recurring failure:
  examining exactly what the owner pointed at — the plan, then 2a, then the survey, then this
  record — and declaring done, instead of stepping back to ask *given the goal, what is the
  complete set of surfaces that relevantly sit in this context?* and verifying all of them. The
  owner had to point at each surface in turn. Cure (generative metacognition): before declaring
  any verification done, derive the full relevant surface set from the goal and walk it — the
  consumer-walk discipline applied to **verification**, not only to framing residue.

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Petrel calls Aether | claude-code | claude-fable-5 | d4f4b7 | AIP-126 implementer seat (restatement-remediation lane) — planned the §COLD PICKUP queue execution (approved plan-mode plan; queue order AIP-126→128→129→130→v2-cycle confirmed against verified dependencies), built AIP-126 as 8 red→green TDD commits + 1 code-expert cure commit on PR #409 (all 14 checks green, MERGEABLE, 4 review threads unresolved-untriaged at close — 1 Copilot + 3 Codex); owner rulings banked on AIP-128 (exemptions `coordination/*` + roll-ups; NO escape hatches); AIP-128 worktree cut+built, no code; paused on owner word mid-shepherd, full closeout 2026-07-18 | 2026-07-17 | 2026-07-18 |
| Foundry guards Vapor | claude | claude-fable-5 | 72fa18 | AIP-131/127 curation seat — stray-work queue discharged (PRs #405/#407/#408 merged; #396/#398/#400/#402 closed with conservation evidence; #401 gated-hold); coordination-branch model cutover executed (primary on the rolling branch, zero-dirty, cut-branch roll-ups); PR #405's 109-thread + #408's 5-thread ledgers fully dispositioned; unions/truings landed via the estate PRs; full handoff record `2026-07-17-full-handoff-foundry-72fa18.md` | 2026-07-17 | 2026-07-17 |
| Aurora guards Penumbra | claude | claude-fable-5 | 2226bf | S2 implementer team Mango (r1 S2 landed via #386 pre-compaction; r2 seed + pilot design authored/approved/sealed/committed, branch unpushed at the gitleaks gate; handoff record 2026-07-15-s2-r2-aurora-a1e8fa1a.md) | 2026-07-15 | 2026-07-15 |
| Quasar mends Umbra | claude | claude-fable-5 | 52b4de | Director (first PDR-117 seat) — runway to ratified rule + open S0 window; seat → Barnacle | 2026-07-14 | 2026-07-14 |
| Barnacle calls Spray | claude-code | claude-fable-5 | 6d5d9c | Director (Moment-2 2026-07-14T20:42:46Z) — executed S0 (re-cut branch on owner instruction to include PR #378 arrivals, froze 681 files, PR #379 merged `SHA:68d6d232`, window CLOSE broadcast), landed the S0 orphan-recovery (PR #380, merged 2026-07-15T11:20:45Z post-closeout); routed Stoat holds Warren's S1 fleet-captain remit (scripts-first, calibration-gated fleet-dispatch discipline per P3); retired at seat-open-to-Schooner, full loss-scan in the 2026-07-15 napkin entry | 2026-07-14 | 2026-07-15 |
| Stoat holds Warren | claude-code | claude-fable-5 | 2a69a1 | Fleet Captain (owner-designated, Director-routed) — RETIRED by owner instruction (unreliable behaviour) before any S1 script ran; the retirement was a contained tool-contract mistake (a `--help` probe executed `refound-sweep` for real, writing a stray artefact — see the 2026-07-15 napkin entry), not corrupted work-product; zero commits, S1 returns unstarted | 2026-07-15 | 2026-07-15 |
| Schooner guards Whirlpool | claude-code | claude-fable-5 | 82a9df | Director (Moment-2 2026-07-15T12:04:35Z, event `35076b29`, claim `0f4be777` adopted) — caught the registry/comms heartbeat divergence at arrival; corrected the handoff record's superseded PR-#380/S1 claims first-hand at pickup; PR #381 thread fixes; routed the S1 layers (Zodiac deterministic, Hedgehog fleet-in-waiting); ruled the compact-evidence PR shape (#382); ran the owner-ruled residue disposition sweep (4 stashes + 47 local + 11 remote branches cleared, proof-gated); authored the batched continuity landing | 2026-07-15 | 2026-07-15 |
| Mussel rides Coral | claude-code | claude-fable-5 | 6f8857 | Director successor — live claim `0f4be777` adopted from Schooner; drove the #390 8-round lesson into the restatement-remediation gate (plan + pr-lifecycle hardening + audit fleet); compound pair with Vole (owner-directed); refounding lanes resume at the cures-landed + freeze-recut gate | 2026-07-15 | 2026-07-16 |
| Vole hunts Perch | claude | claude-fable-5 | 36c6ca | restatement-audit seat, team Mango (claim `1fcfeb3e`): module built TDD (PR #393, 123 tests); canary pilot run + gate-FAIL verdict; 18-agent adversarial re-assessment correcting its own read-out; grounding fidelity 62/62 measured (classification precision unmeasured); compound-pair adversarial checker to the Director | 2026-07-16 | 2026-07-16 |
| Zodiac turns Solstice | codex | GPT-5 | 019f65 | Implementer (owner-joined, no subagent fleets) — r1-S1 deterministic layer, claim `124399ce`: fresh-worktree script run (verify-freeze 681/681, inventory, residue 77 candidates, sweep 3,514 hits/523 files), P4 calibration with the honest marker-free-blindness disclosure, twice-run byte-identical artefacts, full `pnpm check` green; compact-evidence PR #382 authored and landed (`SHA:de3cc54c1`); the 49MB conservation commit `SHA:42b27e3eb` held local-only pending post-merge regeneration re-verify | 2026-07-15 | 2026-07-15 |
| Baobab lifts Topsoil | claude-code | claude-opus-4-8 | 3be248 | surveyor-synthesist | 2026-06-15 | 2026-06-15 |
| Ocelot binds Curfew | claude-code | claude-opus-4-8[1m] | c9423b | vision-author + estate-rewiring | 2026-06-17 | 2026-06-17 |
| Tempest spins Spire | claude-code | claude-opus-4-8[1m] | 94a5c5 | controlling-plan author + review-synthesis + hygiene | 2026-06-17 | 2026-06-17 |
| Squall spins Stratus | claude-code | claude-opus-4-8[1m] | 8b8770 | Phase-2A ratification gate + decision recording + K1–K3 reconciliation | 2026-06-17 | 2026-06-17 |
| Asteroid calls Meridian | claude-code | claude-opus-4-8[1m] | 2297c9 | Q-002 strategy-layer discussion + approach reconception to the informational model | 2026-06-18 | 2026-06-18 |
| Kayak seeks Coral | claude-code | claude-opus-4-8[1m] | 551a7f | critical assessment + plan-estate approach recording + strategy-input capture + records-accuracy + handoff | 2026-06-20 | 2026-06-20 |
| Fennel tracks Chlorophyll | claude-code | claude-opus-4-8[1m] | 6dd550 | strategy reflection + two-part vision authoring + strategy-structure scaffolding + continuity deep-update | 2026-06-20 | 2026-06-20 |
| Kiln guards Patina | claude-code | claude-opus-4-8[1m] | 0c90b2 | diagnosis + granularity settling + README-index refactor + per-stream proposals + pupil-decontamination + handoff | 2026-06-20 | 2026-06-20 |
| Juniper stirs Taproot | claude-code | claude-opus-4-8[1m] | 8afc21 | handoff pickup from Kiln; encoded owner-accepted Body-3 under-spec resolutions and the sign-off staleness flip into the controlling plan | 2026-06-20 | 2026-06-20 |
| Plover wakes Sundog | claude-code | claude-opus-4-8[1m] | f91f5e | open-mind strategy/vision/plan-estate review; vision tripwire-2 pass; resolved search/graph (false dichotomy) + internal-alignment, encoded across the corpus and controlling plan | 2026-06-20 | 2026-06-20 |
| Cutter holds Reef | claude-code | claude-opus-4-8[1m] | cef45f | authored `plan` node-schema V0 (node-schema #1, the survey lens); reconciled PDR-018 + ADR-117 + templates + emergent reality; replaced the `paused` state with an expiring gate (owner-ratified) | 2026-06-21 | 2026-06-21 |
| Drake hunts Beeswax | claude-code | claude-opus-4-8[1m] | 89a5e2 | implementer pickup of Cutter's boundary; settled + encoded the four owner-gated V0 governance calls (enum baselines, folder collapse, 30-day gate-expiry); survey HOLD-then-lift; continuity refresh (repo-continuity + this record) | 2026-06-21 | 2026-06-21 |
| Vesuvius calls Quench | claude-code | claude-opus-4-8 | 92cefc | Director (coordinator) — received role from Cutter (PDR-064 Moment 2), rotated to Birch tracks Arbor; commit-warden landed 9 commits (Ferret / Volcano / Cutter / Drake handoffs + decision-lenses + frictions); wrote the ordered decision lenses into principles.md; opened ArcAngel with Drake; directed the multi-window survey launch | 2026-06-21 | 2026-06-21 |
| Birch tracks Arbor | claude-code | claude-opus-4-8 | 6c2090 | Director (coordinator) — successor to Vesuvius calls Quench (PDR-064 Moment 2); coordinated two clean role rotations (Drake→Ganymede, Hobby→Pinnace), folded both into continuity, set+confirmed the orchestrator pickup gate, corrected survey-output routing; **Director seat DISSOLVED to n=2 owner-visible on owner direction — retired, seat empty unless owner re-establishes** | 2026-06-21 | 2026-06-21 |
| Tuna stirs Fathom | claude-code | claude-opus-4-8[1m] | 9767ba | added the §"Governing invariant" (every organising axis is registered + validated) to the controlling plan — the estate-rewrite's governance face of the graph-convergence, binding WS2/WS3/WS5/WS4; owner-directed 2026-06-30 (no source touched) | 2026-07-01 | 2026-07-01 |
| Pinnace hunts Marsh | claude-code | claude-opus-4-8[1m] | 868a9b | survey orchestrator (successor to Hobby wakes Halo, PDR-063); ran Pass-1 to AEE 70/70 complete; implemented + validated + committed the owner substance re-aim (substance_class summary, content_quality, idea-granular salvage_value inventory); folded the owner's idea-level correction; conserved + committed all findings + scaffold; handed to Aardvark turns Whisper | 2026-06-21 | 2026-06-21 |
| Ganymede herds Penumbra | claude-code | claude-opus-4-8[1m] | 74cb92 | implementer (V1-fold / alignment, successor to Drake hunts Beeswax); delivered the owner-priority intent-alignment review (diagnosed the form-vs-substance theater risk, re-aimed to substance); encoded + committed the Body-3 + V0 substance re-aim (`14877e8d0`, `61489ce7e`); handed the V1-fold lane to Saffron holds Sepal | 2026-06-21 | 2026-06-21 |
| Saffron holds Sepal | claude-code | claude-opus-4-8[1m] | 0f0399 | implementer (V1-fold / Stage-3, successor to Ganymede herds Penumbra); authored + hardened the 3 Pass-2 substance specs (falsifiable capability-coverage effectiveness rubric; effectiveness-reviewer resolved owner-directed); ran the owner-directed cleanup sweep (5 orphan-commits + stale-state process-and-archive-move, not delete); fixed the comms-watch reference-shape doctrine bug; retired this session | 2026-06-21 | 2026-06-21 |
| Aardvark turns Whisper | claude-code | claude-opus-4-8[1m] | 3c3b32 | survey orchestrator (successor to Pinnace) then tooling; fired no sub-batch (compute-gated); caught + cured the comms-watch Monitor filter-blindness (F-82) and authored the `coordination-watcher-canonicalisation` monitor-fix plan (promoted to `current/`); handed survey to Anvil; retired | 2026-06-21 | 2026-06-21 |
| Anvil lifts Solder | claude-code | claude-opus-4-8[1m] | 34f6b3 | survey orchestrator (successor to Aardvark turns Whisper); grounded first-hand on the 06 handoff + workflow + V0 + the Pass-2 specs; armed monitors pipe-less; holding for the owner's GO (survey state unchanged: AEE 70/70 Pass-1; remaining = 15 collections + 70-AEE back-fill + Pass-2/3 + dated outputs + no-loss audit) | 2026-06-21 | 2026-06-21 |
| Cosmos calls Infinity | claude-code | claude-opus-4-8[1m] | 9888f9 | survey orchestrator (sole successor to Anvil lifts Solder); surveyed PDG + agent-tooling + observability + sdk-and-mcp-enhancements Pass-1 (122 plans / 4 collections) across 2 owner-reset budget windows → 228/286; authored the doc 08 next-session runbook; n=2 with Oyster weaves Surf (disjoint); claim 3a5e8798 closed at closeout | 2026-06-21 | 2026-06-21 |
| Pelican stirs Buoy | claude-code | claude-opus-4-8[1m] | 7a3b43 | reflected on the session-starter; curated this thread record (conserve-and-delete the finished session history per continuity-practice §Disposition); fixed the rewrite plan's frozen-estate prerequisite; reframed repo-continuity to ADR-200; next = WS2 | 2026-06-22 | 2026-06-22 |
| Skipper tracks Reef | claude-code | claude-opus-4-8[1m] | 87a7bb | capability-framing copy ("building capabilities") into VISION/README/strategy (`ac7870f4f`); authored the cross-effort curriculum graph estate synthesis report (`40d514fde`) and an SLT single-team brief (held local, not version-controlled); landed the prior session's uncommitted continuity edits (`7fb21e9ae`); did NOT advance the WS2 rewrite lane | 2026-06-22 | 2026-06-22 |
| Perseus lifts Umbra | claude-code | claude-opus-4-8[1m] | 5af536 | two-altitude knowledge-as-graph research (report `knowledge-as-graph-two-altitudes-2026-06-23.md`, initial-research → incoming engineer's brief); **amended ADR-200 (owner-directed): realisation edges §5 + family-entailment §Future state**; live Aila adaptation experiment + LTAE build-vs-reuse read of Aila's code (evidence in reference-local); added Q-009; did NOT advance the WS2 rewrite lane (WS2 remains the next step) | 2026-06-23 | 2026-06-23 |
| Wildfire herds Sulphur | claude-code | claude-fable-5 | 839565 | **corpus-refounding commission → protocol design → landing** (owner-directed 2026-07-06): estate-wide identification sweep; cross-estate design collaboration with the resonance exchange seat (Kiln tracks Basalt, 2a5066) under the inter-practice protocol; 6-designer + 4-critic PDR-123 panel; authored `plan-corpus-refounding.plan.md` (P1–P14, J1–J9, owner-gate register incl. G-ADR) + the design record + the dated `planning-estate-rewrite` amendment (`ws-r-corpus-refounding` gates ws6); donor-seat adversarial review absorbed (sound-with-revisions, zero overturns; B1 planted-loss challenge canaries, B2 WS6 substrate statement); WS2 untouched and unchanged as next parallel step | 2026-07-06 | 2026-07-06 |
| Goshawk calls Sundog | claude-code | claude-fable-5 | 970bdc | R0 successor #3 (runway pickup from Leopard): executed the main→t3 merge-forward + the two promised consolidations; opened + shepherded PR #321 to a truly-green self-merge (`af6c285e5` — R0a COMPLETE); ran the owner-approved six-reviewer gateway on cycles 3–4 and absorbed three bot rounds; landed `validate-ratified-lists` (owner correction: doc↔code sync = validator work) + the gate-agenda insertions; ran the in-chat G1 sitting with the owner (all seven rulings; packet §9; freeze rule ratified) and landed it as PR #322; recorded the Walk-A derivation input + WS6 harvest-scope strengthening; closeout handoff on retained claim `7b10679e` | 2026-07-07 | 2026-07-07 |
| Rigel turns Void | claude-code | claude-fable-5 | c6080b | R0 successor #4 (standby→adoption per the runway pattern): built + landed R0b — the plan-state engine, two adapters, CLI, table v1 (pre-execution review + seven-seat gateway both absorbed; two shared-surface security hardenings); PR #323 shepherded truly-green (owner-merged 751ce9699); trued the r0a todo (7c984a555); registered the pr-lifecycle classifier-merge-boundary candidate; closeout handoff on retained claim `7b10679e` | 2026-07-07 | 2026-07-08 |
| Pelican calls Spray | claude-code | claude-fable-5 | 55b041 | R0 successor #5 (pull-style standby→adoption): built + merged R0c — the consolidated owner-gate register + the cost ledger + r0b/r0c truings + the owner-ratified OG-2 table flip (both granted review moments absorbed, convergent critical cured; PR #325 via early-armed auto-merge); landed the mergeable≠READY + arm-early doctrine (PR #327); deep-reviewed the remediation bot's #326 and landed the proper S4782/S6661 fixes (PR #329, armed); relayed two owner insights to Resonance; restored the #324-dropped Goshawk/Rigel continuity era by concept-union; closeout handoff on retained claim `7b10679e` | 2026-07-08 | 2026-07-08 |
| Corsair guards Channel | claude-code | claude-fable-5 | ecdd12 | curator (dedicated consolidation): drained the R0 arc's capture debt into permanent homes; trued this record's consolidation next-step; did NOT touch the refounding claim areas or r1 | 2026-07-08 | 2026-07-08 |
| Bora holds Turbulence | claude-code | claude-fable-5 | 42a4cf | PR #333 review-round fixes: severed ambient `GUARD_BRANCH` in the four non-rebase hooks + added the `pre-rebase` main-in-range refusal (`--update-refs` vector); trued the rule's coverage claim; proven 11/11 in a hand-run scratch harness (never a committed test). Landed+pushed at `ec20d572c` (owner reconciled the branch divergence). Did NOT touch the refounding claim areas or r1 | 2026-07-08 | 2026-07-08 |
| Elder stirs Chlorophyll | claude-code | claude-fable-5 | 1af3af | pre-r1 seat (owner-named R0 successor #6, standby then owner-paused then bounded resume): resolved the diverged local main (three consolidation commits re-homed); landed the never-commit-to-main rule + shared five-hook branch guard via PR #332 (merged `d89d5c379`; four review rounds + post-merge round, three-reviewer pre-landing chain, all findings fixed-at-source or dispositioned); absorbed the owner's audience-scoping ruling (bypass mechanics out of agent-facing doctrine); r1 assigned on owner recall — first step G2+G3 sitting; claim `7b10679e` closed as stale at the closeout (owner ruling — Pelican long retired; the tracked thread-record block is the r1 pickup, a fresh claim opens at recall) | 2026-07-08 | 2026-07-08 |
| Callisto guards Penumbra | claude-code | claude-fable-5 | da9f8c | PR #333/#334 closeout shepherd: fixed PR #334's review findings + merged it truly-green; verified the Codex P2 pre-rebase thread already resolved (pickup discharged); recovered Orchid's unconserved worktree captures into the branch; moved the primary checkout to main; removed all four worktrees + twelve merged branches; reconciled the PR #333 state contradiction (PR #335) | 2026-07-08 | 2026-07-08 |
| Cedar rides Undergrowth | claude | claude-fable-5 | 270379 | r1 implementer (fresh seat per owner ruling, Director-routed): concept exploration of the r1 space; G2+G3 sitting packets authored + ruled; F-141 freeze-tool hardening; G3.3 out-subtraction + operational-registers rule class; pre-S0 tranche on PR #370; S0 held for the freeze-planning sitting | 2026-07-14 | 2026-07-14 |
| Ceres guards Corona | claude | fable-5 | 0f6b60 | S1 fleet implementer (team Satsuma): adopted s1-reader-sample-b1 mid-cycle from Hedgehog (82b36c); landed chain steps 1–6 (commit `SHA:012632b40`, draft PR #389, seal event, 30-window reader fleet run, H5 3/3 first pass); staged the 17-window re-dispatch redesign; handed back to Hedgehog on owner-called stop (record `2026-07-15-s1-reader-sample-b1-ceres-45befb32.md`) | 2026-07-15 | 2026-07-15 |
| Draco weaves Infinity | claude-code | claude-fable-5 | ef3e3e | tooling-lane implementer (team Satsuma): adopted ba5b683d mid-cycle from Acacia (637ea1); shepherded PR #387 through two verified review-fix rounds (`SHA:a32ffe68d` conditional-assertion cure, `SHA:f2f644283` prepareEntryRun extraction), ready-for-review, 5/5 rounds-1-2 threads resolved; Copilot round 3 (4 findings, triaged in the record addendum) + the merge remain; handed back on owner-called stop (record `2026-07-15-tooling-runway-draco-ba5b683d.md`; wake is Director-exclusive per the 17:57Z ruling) | 2026-07-15 | 2026-07-15 |
| Hedgehog tracks Eventide | claude | fable-5 | 82b36c | S1 seat / Fleet Captain (owner-assigned, team Mango) for batch `s1-reader-sample-b1` — grounded on plan P3/P4/P12, the S1 remit, and Stoat's tool-contract traps; instrument built + reshaped through three specialist reviews, 30-window manifest sealed, handed to Ceres at reshape-green; owner-directed cold pause / dormant standby through the ring rotations, then warm-resumed ~14:27Z and ran the signed `s1-reader-sample-b1` reader-sample batch under claim `45befb32` (P12 declaration signed by Director Mussel, dispatch gated on the sealed canary key); Director-woken post-rotation but the session's platform layer held the owner's pause against all lane work — bundle re-routed to Acacia per the Director's protocol; delivered the 104-row gate-assertion classification ledger (`2026-07-15-gate-ledger-hedgehog-82b36c.jsonl`) + the session-permission-wall map; seat CLOSED at the 2026-07-15 evening wind-down (seat-close record `2026-07-15-s1-seat-close-hedgehog-82b36c.md`) | 2026-07-15 | 2026-07-15 |
| Acacia rides Bark | claude-code | fable-5 | 637ea1 | tooling seat (team Mango): authored item 1 (`SHA:057a582c7`, the shared refound arg contract) pre-rotation; dormant standby then cold pause through the ring day; Director-woken 18:51Z, adopted `ba5b683d` back, disposed Copilot round 3 at the root (`SHA:23759f3ea`: unwrapErr promoted into `@oaknational/result` behind one `raise()` edge + `result-type.ts` cycle-break; `EntryRun<T>` nesting closing the TResolved unsoundness) — **PR #387 MERGED** (owner, 20:19:53Z, `SHA:c0aba5a5b`), 9/9 threads resolved, Copilot round 4 clean, Sonar passed; seat CLOSED on owner word ~20:25Z — all queued work (r2 landing, S1 bundle, doctrine-cargo PR, items 2-8) returned to the Director via event `ab047eef`, claim closed, closeout `ad718a8f`; item-8 evidence at five documented tooling gaps (napkin entry) | 2026-07-15 | 2026-07-15 |
