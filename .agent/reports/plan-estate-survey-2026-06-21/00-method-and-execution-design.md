# Deep Plan-Estate Survey — Method & Execution Design (2026-06-21)

> Status: **pre-launch design**, authored for an `assumptions-expert` proportionality review
> before the heavy Phase-1 fan-out. Orchestrator/curator: Volcano lifts Gleam (7c6879).
> Method is fixed by the decision-complete brief
> ([deep-plan-estate-survey.plan.md](../../plans/product-development-governance/future/deep-plan-estate-survey.plan.md));
> the lens is [plan-node-schema.v0.md](../../plans/product-development-governance/plan-node-schema.v0.md).
> This doc fixes the **execution** shape (allocation, tiering, batching, schemas), not the method.

## 1. Method (from the brief — not re-litigated)

- **Pass 0 — discovery (DONE).** Full target set enumerated first-hand; see `worklist-plans.tsv`.
- **Pass 1 — per-document deep read.** Every plan read by ≥3 agents (holistic + conformance-vs-V0 + ≥1 routed specialist), then an **adversarial verification gate** refutes each load-bearing finding (default-refuted on uncertainty). Pipeline read → specialist → verify, no barrier.
- **Pass 2 — cross-cutting relational passes** (across plans / groups / plans↔threads / plans↔adjacent doc groups), each a verified multi-agent sweep. Barrier after Pass 1 (needs the full per-document result set).
- **Pass 3 — synthesis + completeness critic, loop-until-dry** (two consecutive clean rounds).
- **Discipline:** every subagent response, claim, and source is input-to-verify; `file:line` for every claim; re-derive divergent counts, never average.

## 2. Phase-0 result — the real scale (re-derived first-hand)

- **286** non-archive `*.plan.md` across **16** collections (V0 census said 284 — minor delta).
- Lanes: `current/` 145, `future/` 121, `active/` 16, other 4.
- 38/286 (13%) no frontmatter; `status:` sparse + chaotic (~35 distinct values incl. emoji/quoted/prose).
- Adjacent (cross-cutting fuel): 278 non-plan `.md` under plans (76 README, 10 roadmap, 9 `_boundary`), ADRs 192, PDRs 111, strategy 7, reports 72, threads 23. Archive: 168 plans (historical; **out of the ≥3-reads scope** — logged in the coverage ledger).

## 3. Per-document allocation (Pass 1)

Per plan, baseline **4 agents**:

1. **Holistic** (always) — purpose; end-goal/mechanism/means present+coherent; lifecycle (folder-lane vs frontmatter agreement); authority; traceability candidates; health; value; classification recommendation + evidence; **emits the load-bearing-claims list** the verify gate consumes.
2. **Conformance vs V0** (always — the lens) — `kind`/`disposition`/`gate`, edge presence, status→axes mapping (tests §3.5 migration-map completeness), unclassified keys (lens-completeness, Cutter ask a), LOCKED-contradictions (§0 clause, Cutter ask d).
3. **≥1 routed specialist** by content signal (test-expert / architecture / security / type / config / docs / assumptions); `assumptions-expert` is the floor-filler when no signal. Strong multi-signal plans may get +1 (→5 agents).
4. **Adversarial verify** — independent agent refutes each load-bearing finding (esp. "complete"/"superseded"/"orphaned"/"duplicate"/"dead"); default-refuted on uncertainty; a finding enters the record only if refutation fails.

This satisfies the brief's "≥3 reads" (1+2+3) plus the separate verify gate (4).

**Model tiering (proportionality lever):** structured *reads* (holistic / conformance / specialist) → **Sonnet 4.6** (capable extraction, far cheaper at ~1,000 calls); *judgment* (adversarial verify, cross-cutting relational, synthesis, critic) → **Opus 4.8**. Open to the reviewer's verdict on this split.

## 4. Batching (the 1,000-agent-per-workflow cap forces it)

286 × ~4 ≈ **1,144 agents** (some plans 5) — over a single workflow's 1,000 cap. So Pass 1 runs as **~4 collection-grouped batches of ~70 plans** (≈280 agents/run, comfortably under cap):

- B1 `agentic-engineering-enhancements` (70)
- B2 `agent-tooling` (59) + `product-development-governance` (4) + `developer-experience` (4) + small singletons (~70)
- B3 `architecture-and-infrastructure` (36) + `observability` (31) (67)
- B4 `sdk-and-mcp-enhancements` (28) + `sector-engagement` (12) + `semantic-search` (11) + `connecting-oak-resources` (10) + `discovery` (9) + `user-experience` (7) + `exploring-open-education-resources` (2) + `security-and-privacy`/`school-data-search`/`curriculum-mcp-path-to-ga` (3) (~82)

Concurrency cap min(16, cores−2)=12. Host swap is elevated (~78%, stable) → keep batches modest, re-check host between batches. **Coverage ledger logs every batch, every dropped/unclassified surface, and any coverage bound** (no silent truncation).

## 5. StructuredOutput schemas (aggregation is validated, not parsed)

- **HolisticFinding** — `{ path, plan_id, purpose, egm{end/mech/means present+coherent}, lifecycle{folder_lane, fm_status, agree, note}, authority{owns, improperly_cited, note}, traceability{strategic_choice|null, adrs[], thread|null}, health{stale, dead_links[], superseded_framing}, value, classification(enum keep|rewrite|archive-complete|extract-then-archive|rehome|new-for-gap|uncertain), classification_evidence[{claim,file_line}], load_bearing_claims[{claim,file_line}] }`
- **ConformanceFinding** — `{ path, plan_id, has_frontmatter, v0_kind, v0_disposition|null, v0_gate(present|absent|malformed), edges{...present/value}, status_raw|null, status_maps_cleanly, unclassified_keys[], nonconforming[{issue,file_line}], conformance(conforms|minor-drift|major-drift|no-frontmatter), locked_contradictions[{item,evidence,file_line}] }`
- **SpecialistFinding** — `{ path, specialist, findings[{severity,claim,file_line}], classification_input }`
- **AdversarialVerdict** — `{ path, finding_claim, refutation_attempt, verdict(survives|refuted|uncertain), evidence_file_line, confidence }`
- Cross-cutting schemas defined at Pass 2 entry.

## 6. Cross-cutting (Pass 2) — folds in Cutter's survey-test asks

Four relational angles, each multi-agent + verified: across-plans (duplication/contradiction/drift/vocab/two-status-system/key-sprawl); across-collections (coherence/lane-correctness/over-under-structuring/stale READMEs+roadmaps); plans↔threads (orphans both ways, lifecycle agreement, continuity-as-scope-authority); plans↔adjacent (ADRs, strategic choices, reports, memory, the standard). Cutter's asks: migration-map/dropped-table completeness; `parent_plan` real-containment; `realized_by` endpoints; LOCKED-contradictions — all carried as explicit checks.

## 7. Synthesis + completeness critic (Pass 3)

Aggregate verified findings → the four outputs; a completeness critic asks "what's missing — a group not swept, a claim unverified, an angle not run, a surface dropped?" → next round; loop until **two consecutive clean rounds**.

## 8. Outputs (dated, structured, `file:line`-cited) — `.agent/reports/plan-estate-survey-2026-06-21/`

1. Conformance-and-traceability inventory (the restructure work-list). 2. Cross-cutting pattern findings. 3. Taxonomy grounding (V0→V1 input). 4. Coverage ledger.

## 9. Questions for the proportionality reviewer

1. Is **4 agents/plan × 286** (+ cross-cutting + critic loop) proportionate, or is there a leaner allocation that preserves the ≥3-reads-plus-verify invariant and the bias-dilution the method depends on?
2. Is the **Sonnet-reads / Opus-judgment tiering** right, or should verification/conformance also be Opus?
3. Is **~4 batches of ~70** the right granularity given the 1,000-cap, concurrency 12, and elevated host swap — or fewer/larger, or collection-pure batches?
4. Any **assumption** in this design that is unvalidated, or any **blocking** relationship asserted that isn't legitimate?
