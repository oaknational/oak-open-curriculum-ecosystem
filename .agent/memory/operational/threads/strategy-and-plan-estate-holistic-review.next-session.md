# Next-Session Record — `strategy-and-plan-estate-holistic-review` thread

Holistic work on Oak's **vision, strategy, and planning estate** — three
**separate, co-equal, first-class bodies of work**. The transition this thread
serves: **the repository is moving from an important experiment to an important
product** (owner, 2026-06-17). The relationship between the layers is
**informational dependence, not execution order** (owner, 2026-06-18):

```text
Oak's strategy → our vision → our strategy → our planning
(we align, not fulfil)   (3 streams)   (cohesive system)   (the estate)
```

Each arrow means *what must be known to author the next layer correctly*. Bodies are
co-equal in **importance**; they differ in **work-volume** (the estate restructure is
~80% of the work) and **dependency-direction** — never collapse those axes into
"priority". Re-org is **value-preserving**: express the value encoded in plans more
clearly; never delete ideas. **Scope authority is the controlling plan**
[`vision-strategy-and-plan-estate.plan.md`](../../../plans/product-development-governance/vision-strategy-and-plan-estate.plan.md),
reconceived to this model 2026-06-18. This record is the **pickup surface**, not scope authority.

## Where We Are (2026-06-22, Pelican stirs Buoy — continuity curated; architecture committed; next = WS2)

The architecture has **converged and is committed**; progression is **GO** for the substrate build.
Read, in order:
[`ADR-200`](../../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md)
(the living idea-graph architecture — **Accepted**, owner-ratified),
[`ADR-201`](../../../../docs/architecture/architectural-decisions/201-external-systems-evidence-integration.md)
(external-evidence integration — **Proposed**; the *full-value* path, gated on the substrate landing;
the substrate value stands without it), the executable
[`planning-estate-rewrite.plan.md`](../../../plans/product-development-governance/current/planning-estate-rewrite.plan.md),
and this section.

**State (re-derived first-hand, 2026-06-22):**

- ADR-200/201 + the rewrite plan are committed (`e33a278f9`); the adopted `no-agent-substrate-access`
  eslint rule is committed (`a3ca73f1a`).
- The dedicated **consolidation is done and committed** (Petrel stirs Wingspan): the napkin was rotated
  (the 667-line content archived verbatim; a fresh napkin started), cross-session lessons graduated, and **PDR-113** (source intent from
  the principal, not the records) graduated — `9acde4d8` / `243c4cf8` / `deb697c6`. The
  napkin-rotation + graduation half of the consolidation is discharged.
- This session (Pelican stirs Buoy) **curated this thread record** — conserve-and-delete of the finished
  survey-era / role-rotation / handoff session history per `continuity-practice.md` §Disposition (the
  insight is homed in ADR-200/201, the controlling plan, the rewrite plan, and the survey archive; git
  retains the literal record), **fixed the rewrite plan's stale frozen-estate prerequisite**, and
  **reframed `repo-continuity.md`** to the ADR-200 reality.
- This session also **triaged the open-question surface through the decision lenses** (owner-directed): the
  design-direction verdicts are folded into ADR-200 §Open and the rewrite plan's "Lens-resolved directions"
  subsection; **Q-008 is RESOLVED** (the human-authoring side = a prose→graph **reconciliation workflow**,
  now in ADR-200 §8); and **Q-005/006/007 moved to automatic triggers, out of owner ownership** (owner
  direction). The open-questions register is the durable home; nothing in the triage blocks WS2.

**Next safe step: WS2** — author the idea-node JSON Schema **structure** and decide id-minting, per the
rewrite plan (WS1 done; WS2 decision-complete; ADR-200 §5 structure, vocabularies left open as
`$comment DISCOVERED`). Acceptance: a hand-written sample idea-node validates; ids are stable across an
edit to `statement`.

**Disciplines a successor MUST hold (ADR-200 + this session's reflection):**

- **WS4 thin-slice-proof is a HARD GATE.** Prove the idea-graph end-to-end on a thin vertical slice (both
  drift mechanisms + supersede AND merge) **before** the full harvest (WS6). Do not let "build the SDK +
  tooling" momentum reach the harvest before WS4 passes — the survey already got burned by a
  placeholder-not-landed graph adapter.
- **The full dependency chain:** WS6 ← WS3 **and** WS4; **WS6b** (V2 vocabulary reassessment) ← WS6;
  WS7 ← WS6b **and** WS5.
- **No-loss is TWO directions + a bad-pile re-screen, by a fresh-context reviewer that DID NOT perform the
  harvest.** The independence requirement governs the **whole** two-direction audit (harvest-recall +
  re-expression), not only the bad-pile re-screen — "independence is constructed, not asserted"
  (ADR-200 §5).
- **Conserve, never trim.** No valuable idea is ever lost; conservation conserves and organises.
- **The ADR-200 §Non-goals anti-patterns recur under context pressure and MUST be resisted:** NOT a
  refactor/relabelling; NOT preserving existing plans because they exist (existence is not correctness;
  default-replace); conformance/classification of old plans is NOT the goal.
- **Freeze/unfreeze boundary:** forward, genuinely-new V0-bridge work is **unblocked**; the rewrite of the
  existing estate (WS6–WS7) is gated on the substrate; the harvest scope is **re-derived per pass, not
  frozen**.
- **No PII in version control, ever** (ADR-201 §4, organisation constraint) — binds any future
  external-evidence work.
- Do **not** execute during a planning turn; tests assert **effects**, never message-constants.

**Cross-link — the large-corpus-analysis method applies to this estate review (2026-06-29, Wren stirs Rainbow).**
The proving run of the corpus-analysis method (over the napkin timeseries) generalises to
this non-timeseries estate — see "Generalisation beyond the timeseries" in
[`large-corpus-analysis-runbook-v2-design-2026-06-29.md`](../../../reports/agentic-engineering/large-corpus-analysis-runbook-v2-design-2026-06-29.md).
The transfer: parameterise the **partition axis** (subgraph/neighbourhood, weighted by
leverage/connectivity, not recency) and the **negative-space source** (here **relational
absence** — orphan plans, unserved goals, undeclared dependencies — which the ADR-200
idea-graph makes into DETERMINISTIC edge-queries). Applied to the estate, the method
becomes a renderer over the idea-graph and its highest-value lens (absence detection)
becomes cheap and exact; the method's graph-substrate future converges with ADR-200's
deliverable. Apply once WS4 proves the graph end-to-end.

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
