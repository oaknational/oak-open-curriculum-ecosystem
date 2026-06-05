# Next-Session Record — `eef` thread

> **EEF D5 EXECUTED — graph-core generic query layer + graph-native EEF view
> LANDED AS ONE GREEN COMMIT (2026-06-05, Dim Dimming Threshold / `192ae9`;
> claude / Opus 4.8; owner-directed execution).** D5 built fresh as five TDD
> cycles, landed in commit `2e9021ff` (branch ahead 1 of origin; pushing is the
> owner's call). The `d5-graph-construction-methods` master-plan todo is flipped
> to `completed`.
>
> + **What landed**: (WS1.1) graph-core `graph-view` contract generified to
>   `GraphView<TNode, TNodeId, TEdgeType>` (subgraph-only; `GraphManifest`/
>   `manifest` deleted, no EEF consumer); (WS1.2) bounded-BFS `createGraphView`
>   factory (construction THROWS on dup-id / dangling-edge / negative `maxDepth`;
>   per-call errors are EXACTLY the two ratified `SubgraphError` variants);
>   (WS2.1) graph-native EEF view `eefStrandGraph` (one strand node kind,
>   `related_strand` edges, full strand payload incl. inline guidance reports;
>   four `toEqualTypeOf` non-widening id-flow proofs); (WS3.1/3.2) `inspectStrand`
>   + `evidenceForMove` over a shared `subgraphEnvelope` core, the evidence
>   envelope (members + member-induced edges + binding-derived frontier +
>   provenance; `data_version`/`last_updated` excluded), and `strandAxisIndex`
>   (in `raw-domains`). Sole-ingest holds: only `eef-graph.ts` reads the corpus in
>   the graph layer.
> + **Owner decision (2026-06-05) — projection DROPPED from D5.** Execution
>   surfaced that a field-narrowing projection returning the ratified
>   `SubgraphResult<TNode>` cannot be type-honest under `no-type-shortcuts`
>   (a trimmed node is a deep-`Partial`; returning it as `TNode` needs a forbidden
>   `as`/`Object.*`/`Record`; a projected return type re-opens D4), and EEF
>   consumes none. The owner directed dropping the runtime `projection?` parameter
>   (Decision 6 "absent" over a dishonest implementation); `NodeProjection` /
>   `DeepKeyPath` are retained for a future type-honest projection. D4 carries a
>   "Projection deferred" amendment and the D5 plan's C1 is marked superseded.
> + **Review cadence (extensive, real-time, no backfill)**: code-expert pre+post
>   per cycle (fan-from-brief), type-expert deep on WS1.2 / WS2.1 / the assembled
>   diff, test-expert per cycle + assembled diff. ~18 reviewer dispatches; every
>   finding critically assessed against the artefacts. Notable REJECTIONS (grounded
>   over-escalations): code-expert's "factory should return `Result`" (D4 ratifies
>   the infallible-or-throw construction contract; the dual-review already rejected
>   a Result variant) and its "frontier must derive from a depth-1 call"
>   (Option-A over `relatedStrandEdges` is faithful to D4's wording, gives the
>   identical result, and consumes a D2 export not the raw corpus — the post-exec
>   review confirmed the rejection). Accepted improvements: test-first sequencing,
>   grep-based WS1.1 acceptance, production-scoped sole-ingest, `strandAxisIndex`
>   in `raw-domains`, its home-test block, and test non-vacuity guards.
> + **Acceptance**: graph-core 90 tests, graph-corpus-sdk 31, curriculum-sdk 729;
>   type-check / lint / knip / depcruise / markdownlint / prettier clean; the
>   pre-commit gate (97 turbo tasks) green. Zero external blast radius (three
>   in-package edit sites verified first-hand).
>
> **NEXT SAFE STEP: D6** — the EEF MCP composition module + surface (the two
> single-Zod-call schemas over the graph-native view subsets, registration behind
> `OAK_CURRICULUM_MCP_EEF_ENABLED`, the interpretation resource + prompt), per the
> master plan §D6. D5 unblocks D6. The graph-tools-value-redesign lane stays parked
> on EEF D6 + D7. Re-derive HEAD from git — this banner is one commit stale by
> construction.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Dim Dimming Threshold` | `claude` | `Opus 4.8` | `192ae9` | `eef-d5-execution` | 2026-06-05 | 2026-06-05 |
>
> ---
>
> **EEF D5 PLAN + PARENT FRESH DUAL-REVIEW — VERDICT READY WITH CONDITIONS; ALL
> CONDITIONS OWNER-RESOLVED + FOLDED IN; D4 DOC-FIX APPLIED (2026-06-04, Prismatic
> Twinkling Planet / `b56c93`; claude / Opus 4.8; owner-directed review-only
> session).** Fresh independent dual-review of
> [`eef-d5-execution.plan.md`](../../../plans/sector-engagement/eef/current/eef-d5-execution.plan.md)
> AND the parent
> [`eef-graph-tool-completion.plan.md`](../../../plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md)
> together, grounding **every** empirical claim first-hand at HEAD `562b97f3`
> (all four package filters — incl. the asymmetric trap: `oak-curriculum-sdk` →
> `@oaknational/curriculum-sdk` drops `oak-`, but the streamable-http app keeps it;
> the live graph-core contract line-citations; corpus cardinalities; the worked
> anchors; and the zero-external-blast-radius hard gate — **all verified TRUE**),
> then six independent reviewer lenses (cross-consistency + type-expert +
> assumptions + architecture-fred + adversarial-refute + test-expert; Sonnet) +
> adversarial per-finding verification (48 agents). Every finding re-grounded by
> the lead before acceptance.
>
> + **Verdict: READY WITH CONDITIONS** — no blocking findings, no design defects;
>   the ratified D4 stands; the one-green-commit landing holds. Four adversarial
>   attacks on the load-bearing claims FAILED (rejected as false-positives): zero
>   external blast radius (only the three named in-package sites; `dist/*.d.ts`
>   hits are build artefacts), construction-validation = throw at construction not
>   a new `Result` variant, single-commit feasibility
>   (`graph-corpus-sdk/src/index.ts:14` re-exports `GraphView` by name), and the
>   no-persistent-red history.
> + **Conditions owner-resolved 2026-06-04 + folded in** (D5 plan + D4 contract):
>   **C1** keep `projection?` (WS1.2 implements + tests it; EEF binding exposes
>   none — matches D4's retained signature, no D4 change); **C2** depth ceiling
>   `MAX` is a per-graph `createGraphView` factory input (`maxDepth` →
>   `SubgraphDepthExceeded.limit`); **C3** WS2.1's depth-1 example now spells out
>   the full 4-edge member set (incl. reverse `metacognition→feedback`,
>   `mastery→feedback`, corpus-verified); **C4** WS2.1 adds the sole-ingest-path
>   module-import check; **C5** stale parent-filter NOTE removed; **C6** added the
>   fourth `expectTypeOf` on `edges[0].target`; **C7** rebuilt contract-test block
>   keeps a runtime assertion; **C8** D4 doc-fix (the "six names" prose at
>   D4:193-194 and the "names unchanged" parenthetical at D4:365-366 → five
>   surviving names after the `GraphManifest` deletion).
> + **Cross-consistency:** parent §D5 Proof aligned to include
>   `pnpm --filter @oaknational/graph-core test` (D5's acceptance already had it).
>   Full review verdict + method are in this session's plan-file artefact
>   (`~/.claude/plans/`, not repo-tracked).
>
> **NEXT SAFE STEP: execute D5** — build the new graph-core generic query layer +
> the graph-native EEF view fresh as TDD cycles, landing as ONE green commit, per
> the now-condition-folded `eef-d5-execution.plan.md`. The
> graph-tools-value-redesign lane stays parked on EEF D6 + D7. Re-derive HEAD from
> git — this banner is one commit stale by construction; the branch is unpushed
> (pushing is the owner's call). **These review edits are uncommitted working-tree
> changes** (owner has not requested a commit).
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Prismatic Twinkling Planet` | `claude` | `Opus 4.8` | `b56c93` | `eef-d5-fresh-dual-review-and-condition-fold-in` | 2026-06-04 | 2026-06-04 |
>
> ---
>
> **D5 EXECUTION PLAN AUTHORED + REVIEWED READY; PARENT FILTER FIXED; NEXT = FRESH
> DUAL-REVIEW OF D5 + PARENT TOGETHER (2026-06-04, Windward Gliding Squall /
> `ab2bcd`; claude / Opus 4.8; owner-directed planning session).** Authored the
> detailed D5 execution plan
> [`eef-d5-execution.plan.md`](../../../plans/sector-engagement/eef/current/eef-d5-execution.plan.md)
> (current/, executable) — 5 serial TDD cycles decomposing the ratified D4
> contract into a fresh build, landed as ONE green commit (cycles are internal
> checkpoints; landing discipline reconciled to the parent's §Risk Assessment
> one-commit rule): WS1.1 generify the graph-core `graph-view` contract
> (`GraphView<TNode,TNodeId,TEdgeType>`, subgraph-only, drop `manifest`/
> `GraphManifest` incl. the root barrel + the contract-test TSDoc); WS1.2 generic
> bounded-BFS `createGraphView` factory + structural tests (dup-id/dangling-edge
> are CONSTRUCTION-time validation; the per-call error surface stays EXACTLY D4's
> two variants — no new kind); WS2.1 graph-native EEF view (inject
> `type: 'related_strand' as const`; named `expectTypeOf` id-flow proofs);
> WS3.1 `inspectStrand` + evidence envelope (frontier + provenance;
> `data_version`/`last_updated` excluded); WS3.2 `evidenceForMove` axis
> resolution (reachable-by-axis asserted by derivation).
>
> + **Reviewed READY**: Iridescent Drifting Star (owner-assigned pair-reviewer) +
>   type-expert + assumptions-expert + architecture-expert-fred. ~16 findings, ALL
>   critically assessed against the artefacts before accepting (per the owner's
>   repeated directive); one corrected, not copied (assumptions' frontier example
>   was imprecise vs the D4 frontier definition → pinned a definition-robust
>   anchor). Iridescent confirmed **READY FOR EXECUTION**. Full disposition in the
>   plan's §Review disposition. The `createGraphView` factory shape — the one
>   D5-owned open decision — is CONFIRMED by Iridescent + type-expert.
> + **Parent filter fix (owner-authorised)**: this plan's D5-Proof line 1340
>   `@oaknational/oak-curriculum-sdk` → `@oaknational/curriculum-sdk` (directory
>   name ≠ package name; the wrong filter matched no project — caught by
>   Iridescent's empirical `pnpm --filter` run after THREE reviewers converged on
>   the wrong name; `oak-curriculum-mcp-streamable-http` verified correct as-is and
>   left unchanged).
>
> **NEXT SAFE STEP: a fresh session reviews the D5 execution plan AND the parent
> `eef-graph-tool-completion.plan.md` TOGETHER** (owner-directed), then executes
> D5. The two plans are cross-consistent (manifest disposition mirrored; landing
> discipline aligned; package filters correct). The graph-tools-value-redesign
> lane stays parked on EEF D6 + D7. Re-derive HEAD from git — this banner is one
> commit stale by construction (branch ~109 ahead of origin; pushing is the
> owner's call).
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Windward Gliding Squall` | `claude` | `Opus 4.8` | `ab2bcd` | `eef-d5-execution-plan-authoring-and-review` | 2026-06-04 | 2026-06-04 |
>
> ---
>
> **MIGRATION PLAN OVERHAULED → VALUE-DRIVEN REDESIGN (renamed); parked, EEF-gated
> (2026-06-04, Twilit Cascading Supernova / `bb53a9`; claude / Opus 4.8;
> owner-directed).** Accepted Burnished's handoff (comms `0e2f7e7b`). The graph-tools
> plan was re-derived from the two constraints + design agency and **renamed**
> `graph-tools-substrate-migration.plan.md` → `graph-tools-value-redesign.plan.md`;
> behaviour-preservation AND the "migration" framing removed. Per-corpus value-shapes:
> prior-knowledge = bounded subgraph, thread-progressions = sequence projection (both
> owner-ratified); misconception = **owner-directed graph** (curriculum-anchored bounded
> subgraph, thread→unit→lesson→misconception verified in the bulk source). Owner-directed
> architecture: **one bulk graph + bounded query views**; **deliberate identity model**
> (slugs are NOT guaranteed-unique ids; placement is an edge — a lesson can be in >1 unit);
> **bulk-derived graphs and the Oak Ontology repo are SEPARATE concerns** sharing the
> substrate (concepts live in the ontology; cross-source join gated on the alignment audit).
> Metaplan `graph-migration-plan-overhaul.plan.md` → COMPLETED; features-plan §1 reconciled;
> 3 readiness reviewers READY-WITH-CONDITIONS (applied). KG estate survey report written
> ([`graph-kg-estate-and-two-source-survey-2026-06-04.md`](../../../reports/graph-kg-estate-and-two-source-survey-2026-06-04.md)).
> **D4 coordination absorbed**: D4's `manifest()`-absent-at-D5 decision is recorded in the
> redesign plan as a first-view re-add obligation. **Owner-directed open: review the entire
> `oak-kg` / ontology estate** (distinct future activity; timing owner's). Plan stays PARKED
> on EEF D6 + D7 — EEF v1 consumes today's prerequisite + misconception tools as-is.
>
> **NEXT SAFE STEP (this lane)**: none until the redesign promotes (EEF D6 + D7). The owner
> directed the `oak-kg`/ontology estate review as the next distinct activity (unscheduled).
> The EEF lane's own next step is D5 (see Shadowed's banner below).
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Twilit Cascading Supernova` | `claude` | `Opus 4.8` | `bb53a9` | `migration-plan-overhaul` | 2026-06-04 | 2026-06-04 |
>
> ---
>
> **EEF D4 OWNER-RATIFIED — REVIEW-THEN-RATIFY COMPLETE; D5 IS NEXT (2026-06-04,
> Shadowed Creeping Secret / `b33dcf`; claude / Opus 4.8; owner-directed
> dedicated D4 + whole-plan review session).** The owner ratified the corrected
> D4 graph-capability contract; the `d4` todo is flipped to `completed`. D5
> (build the new graph-core query layer + EEF strand-view fresh, as TDD cycles)
> is the next session — NOT started here.
>
> + **Review method**: lead grounding (git perimeter; Decision-B dedup; the
>   contract's code citations; the live `graph-view` files; PDR-058; the rule
>   texts; `impact_months`) cross-checked against a read-only workflow — 4
>   grounding + 5 fresh post-B expert lenses + a 19-finding adversarial
>   de-escalation (28 agents, Sonnet). Every finding was re-grounded against the
>   artefact before acting; the verify stage overturned 3 specialist over-reaches
>   as false positives and cut several material→minor.
> + **Verdict**: RATIFY WITH CONDITIONS → all 11 conditions applied (working
>   tree, uncommitted, prettier + markdownlint green; pushing is the owner's
>   call). Substance verified sound: Decision-B dedup is ground-true (exactly one
>   report shared corpus-wide — *Making Best Use of Teaching Assistants*, on
>   `eef-tl-one-to-one-tuition` + `eef-tl-teaching-assistant-interventions`); all
>   corpus cardinalities exact; the zero-external-blast-radius hard gate confirmed
>   (three in-package sites, no fourth); the polymorphic `GraphView<TNode,
>   TNodeId, TEdgeType>` substrate is **earned** (ADR-179 forbids EEF names, so
>   EEF's typed-id-flow need forces the generic; PDR-058 §Surface 2 met), not
>   inherited-shape preservation.
> + **Corrections applied** (D4 contract + plan only; redesign plan untouched):
>   A1 re-grounded the substrate justification (dropped the false
>   "`consolidate-at-third-consumer` satisfied" — the rule fires at the *third*
>   consumer); A2 fixed the PDR-058 label (Three-Tier Optionality Decomposition
>   §Surface 2); B1 made `GraphManifest` decisive (absent at D5, migration
>   re-adds); C1–C5 fixed two pre-B `guidance_report` drift sites + the
>   Carried-Context two→three edit-site count + the stale deferred-homing anchor
>   + the stale "(exploration)" heading; D1 extended the D6 `impact_months` Zod
>   hazard (`-2` on `eef-tl-repeating-a-year` → `z.nullable(z.number())`, no
>   lower bound); E1 noted `number_of_studies`'s two corpus paths.
> + **Owner direction (2026-06-04)**: the upcoming graph tools WILL be
>   graph-based; EEF's first delivery (D7) continues on the CURRENT
>   `get-prior-knowledge-graph` / `get-misconception-graph` tools as-is (already
>   the plan's Non-Goals + the `eef-revalidate-on-new-graph-tools` follow-on).
>   This confirms the redesigned prereq + misconception tools as future
>   `subgraph` consumers of the new substrate, sequenced AFTER EEF — and resolves
>   the earlier comms-vs-plan misconception flag (it is graph-based, not an
>   attribute filter).
> + **Open coordination (not EEF lane)**: the `manifest()` re-add decision should
>   be homed in Twilit's redesign plan when its first consumer is built — a comms
>   note to Twilit, not an EEF edit. D4 only points at the redesign plan's
>   `define-heterogeneous-node-edge-model` todo (must-not-drop preserved there).
>
> **NEXT SAFE STEP: D5** — build the new domain-generic graph-core query layer
> (`GraphView<TNode, TNodeId, TEdgeType>`; `subgraph` only, no `manifest`) and
> the graph-native EEF strand-view fresh as TDD cycles, per the ratified D4
> contract. Re-derive HEAD from git — this banner is one commit stale by
> construction (a parallel school-data-search commit `1839e9b8` landed mid-session
> in another lane; my EEF edits are uncommitted on top). Branch ~90 ahead of
> origin; pushing is the owner's call.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Shadowed Creeping Secret` | `claude` | `Opus 4.8` | `b33dcf` | `eef-d4-whole-plan-review-then-ratify` | 2026-06-04 | 2026-06-04 |
>
> ---
>
> **EEF D4 GRAPH CAPABILITY CONTRACT AUTHORED + RATIFIABLE; OWNER DECISION B
> SIMPLIFIED IT; MIGRATION-OVERHAUL METAPLAN SCOPED + HANDED TO TWILIT
> (2026-06-04, Burnished Glowing Spark / `67b679`; claude / Opus 4.8;
> owner-directed D4 session).** D4 is a NON-CODE ratification deliverable; the
> contract is at
> [`eef-d4-graph-capability-contract.md`](../../../plans/sector-engagement/eef/current/eef-d4-graph-capability-contract.md)
> (committed in the owner's broad commit `ca927e40`, with the D3 revision + plan
> fold). **D4 ratification is HELD for a dedicated next session that reviews D4 +
> the EEF plan as a whole** (owner-directed); D5 follows.
>
> + **What D4 ratifies**: the new domain-generic graph-core query surface
>   (`GraphView<TNode, TNodeId, TEdgeType>` replacing the live string-typed
>   contract; `subgraph` is the one primitive EEF consumes; `manifest()` is NOT
>   EEF-consumed and left out per Decision 6); the graph-native EEF view; the
>   bound names; the consumer-impact finding (ZERO external blast radius + THREE
>   in-package edit sites — graph-core barrel, the contract test, AND the
>   `graph-corpus-sdk` `GraphView` re-export the plan had omitted); the minimal
>   operation set. The string→`TNodeId`/`TEdgeType` generification is grounded
>   field-by-field against the live `graph-view` files.
> + **Owner decision B (2026-06-04) — guidance reports INLINE, not a node kind**:
>   EEF v1 is a HOMOGENEOUS strand graph (`TNodeId = EefStrandId`, one edge type
>   `related_strand`). `related_guidance_reports` (7/30; `{title,url}` leaves,
>   exactly ONE shared corpus-wide) travel inline in the member payload. The
>   node-kind model deduped one leaf and bought no v1 value, so the entire
>   heterogeneous-graph machinery (union id, second id type, second edge type,
>   second node kind) dissolved. Nine bound names → EIGHT
>   (`eefGuidanceReportNodeSubset` retired). The D3 contract carries a dated
>   decision-B revision note; the plan body + frontmatter were reversed to match.
> + **Deferred-and-HOMED (must not be dropped)**: the fundamental heterogeneous
>   node/edge model (multiple node kinds, cross-kind node-id policy, typed
>   inter-kind edges + the bounded-retrieval primitive) is deferred from EEF D4
>   and HOMED in the migration plan (a `define-fundamental-node-edge-model` todo +
>   an interim amendment).
> + **Owner frame for the non-EEF graphs (2026-06-04)**: the migration plan's
>   behaviour-preservation premise is REPLACED by two constraints — (1) maximise
>   user value, (2) don't flood agents with irrelevant tokens — plus total design
>   agency (we build the graph data objects from bulk data AND the substrate, so
>   shape + retrieval are ours; "if we can make it work with graphs, we use
>   graphs"). This needs its own session: a ratified metaplan
>   [`graph-migration-plan-overhaul.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-migration-plan-overhaul.plan.md)
>   scopes the overhaul, which is **already active under Twilit Cascading
>   Supernova** — I handed Twilit the metaplan + decision-B context via comms
>   event `0e2f7e7b`. I do NOT edit the migration plan further.
> + **Grounded per-corpus facts (verified this session)**: misconception 12,858
>   flat nodes (no ids/edges, ~6MB); prior-knowledge 1,607 `unitSlug` nodes +
>   3,452 `prerequisiteFor` edges (a natural `subgraph` consumer);
>   thread-progressions ordered sequences.
> + **Reviews**: three refutation-briefed Sonnet specialists (type-expert +
>   architecture fred/betty) on the pre-B contract — all READY-WITH-CONDITIONS,
>   every finding critically validated (frontier-housing clarification applied;
>   betty's envelope-subset split REJECTED as a ratified-D3-name scope violation;
>   fred's PDR-058 miscitation verified + corrected). The B-collapse post-dates
>   that review, so the next session's D4 review covers the final shape.
> + **Method lesson (graduated to auto-memory, not just napkin)**: value-first;
>   existing artefacts (inherited code, current/generated data shape, ratified
>   decisions) are malleable design surface, not fixed constraints — the owner
>   corrected this root ~five times this session. Reshape on frame-overturn;
>   don't bolt-on.
>
> **NEXT SAFE STEP (owner-directed): a dedicated session reviewing D4 + the EEF
> plan as a whole, then ratifying** (D5 the session after). Re-derive state from
> git — this banner is one commit stale by construction. Branch ~39 ahead of
> origin; pushing is the owner's call. The migration overhaul is Twilit's lane;
> do not edit the migration plan.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Burnished Glowing Spark` | `claude` | `Opus 4.8` | `67b679` | `eef-d4-contract-authoring` | 2026-06-04 | 2026-06-04 |
>
> ---
>
> **EEF D3 OWNER-RATIFIED AND COMMITTED (2026-06-03, Lacustrine Swimming
> Beacon / `687a54`; claude / Opus 4.8; the owner-ratified dedicated
> review-then-ratify session). The `d3` todo is flipped. The day's working
> tree landed as four owner-directed chunks, all full-gate green:
> `a0fd7b0f` (the D3 ratification bundle), `88d8da9d` (Ashen Burning Magma's
> Antigravity identity slice), `6379f1e4` (skills-taxonomy seed),
> `422e57e0` (continuity + collaboration-state lifecycle).**
>
> The independent review ran in the fixed order (D3 work → whole plan →
> owner discussion → resolution → ratification), grounding every claim
> directly: full corpus census (extraction-count-verified), cite-or-strike
> over every contract element (zero invented rationale survived; the
> primitive-targeting text pre-existed the correction commits), V1–V8
> re-verified at file:line against HEAD + installed `sdk@1.29.0` /
> `ext-apps@1.7.3`, commit honesty for all three D3 commits (incl. a
> line-by-line verbatim check of the `0ace63ad` drain), then a 4-lens
> refutation workflow (15 agents) with every finding author-re-grounded
> (8 confirmed, 3 rejected as false positives with reasons).
>
> + **Review fixes (corpus-side enumeration found what confirm-the-claim
>   review could not)**: all four real defects clustered in the contract's
>   `members[]` cell — `headline.number_of_studies` (a seventh headline field
>   on 2 strands) unhandled; `closing_the_disadvantage_gap` labelled V1
>   without V1 authorisation; `implementation.key_considerations` dropped
>   from the naming; broken "per-field rows" citations for
>   `behind_the_average_by_phase`/`applications`. Plus: D2-table
>   exhaustiveness made true (row-granularity rule + 8 sub-field rows), the
>   stale `loader.ts` TSDoc in the corpus header fixed, the settled D1 V2
>   decision de-opened in two plan spots, and a `plus corpus metadata`
>   third-function residue in §Fully Specified End State (spaced token form —
>   the hyphenated-only sweep had missed it).
> + **Owner settlement decisions (all folded into contract + plan)**:
>   (1) **V1 extended** — `closing_the_disadvantage_gap`,
>   `headline.number_of_studies`, `implementation.digital_technology_application`
>   are included members ("central to the heart and soul of education, never
>   second-class"). (2) **Metric filters deferred** to
>   `eef/future/eef-tool-metric-filter-inputs.plan.md` (trigger: D7 green +
>   observed agent usage; `eefHeadlineMetricSubset` reserved there; D4 handoff
>   is now NINE names). (3) **Prompt renamed `adapt-lesson`** — evidence
>   grounding is how Oak adapts lessons, not a "with-evidence" qualifier.
>   (4) **Strand index added to the resource's corpus-cited layer** (id, name,
>   `headline_summary`, tags for all 30; ~7KB) — the corpus-complete discovery
>   surface, curing the structural bias where axis filters reach only the 17
>   `school_context_relevance`-tagged strands and hide 13 (including the
>   honest-insufficiency exemplars). (5) **Declared-only exclusions recorded
>   as snapshot-relative and self-healing** (observed domains derive from the
>   constant), with the `meta.coverage` "3-18" nuance and the
>   boundary-rejection-vs-empty-result rationale stated; KS5 lives only in
>   `uk_context.key_stage_mapping` + the declared schema (whose own
>   description targets an upstream `recommend_for_context` concept Oak
>   assigns to the agent, Decision 10). (6) Schema-borne discoverability
>   stated: the published `inputSchema` enumerates all 30 ids + observed axis
>   values.
> + **Estate also touched**: EEF README indexes the new future plan AND the
>   previously-unindexed `eef-revalidate-on-new-graph-tools` seed; napkin
>   carries four method lessons (ratified-decisions-only scope protection;
>   facts-verified ≠ implications-composed; both-token-form residue sweeps;
>   enumeration unit must match question scope).
> + **Verification**: graph-corpus-sdk type-check + 15/15 tests + eslint
>   green; prettier + markdownlint green repo-wide; focused refutation
>   reviewer over the final diff: a–f ALL PASS. Mid-session the owner/codex
>   committed the parallel curation slice (`23ee0ef3`); the orphan Seaworthy
>   experience file landed in `422e57e0`.
>
> **NEXT SAFE STEP: D4 (graph capability shape)** — its reviewers fire
> against the ratified D4 output in turn; D4 binds the nine handed-off names
> (per the ratified contract §Handoff to D4) and the `guidance_report` node
> kind / edge types / provenance policy. The branch is unpushed (9+ commits
> ahead of origin); pushing is the owner's call. The napkin is HARD on
> fitness — its named remediation lane is a rotation pass in the curation
> lane, not a trim.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Lacustrine Swimming Beacon` | `claude` | `Opus 4.8` | `687a54` | `eef-d3-review-then-ratify` | 2026-06-03 | 2026-06-03 |
>
> ---
>
> **EEF D3 ADVANCED TO RATIFIABLE OUTPUT — CONTRACT + VERIFICATION RECORD
> AUTHORED, FOUR REVIEWERS RUN, OWNER RATIFICATION PENDING (2026-06-02,
> Seaworthy Swimming Sextant / `a85c18`; claude / Opus 4.8; owner-directed
> opener, approved session plan).**
>
> The D3 contract is written:
> [`eef-d3-mcp-contract.md`](../../../plans/sector-engagement/eef/current/eef-d3-mcp-contract.md)
> — tool `get-eef-evidence` (function dispatch: `evidence-for-move` /
> `inspect-strand` — the plan's two named operations; corpus metadata is the
> interpretation resource's job per the plan's primitive targeting),
> resource `eef://interpretation`,
> prompt `adapt-lesson-with-evidence`; per-field source-path table (named
> unbound D4 subsets); the SDK/app verification record (V1–V8, all
> file:line-cited against installed `@modelcontextprotocol/sdk@1.29.0` +
> `ext-apps@1.7.3` + HEAD: `outputSchema` carries through both register paths
> once OUR config assembly + universal-tools surfaces add it; `isError`
> skips output validation; the S0 seam stays owned by the output-schemas
> plan, EEF D6 lands first use).
>
> + **Whole-plan + D3 review run first** (4-lens refutation workflow, 11
>   agents + adversarial verification): every corpus cardinality/divergence/
>   strand-id claim and the D2 table recounted EXACT against
>   `EEF_TOOLKIT_DATA`; 7 findings → 4 real, applied (D4 frontmatter
>   "(already removed in code)" falsity; stale threads-stub present-tense;
>   D1 heading label; D6 `eef-surface.ts` parenthetical — the withheld
>   known-answer probe, MISSED by the fleet, applied by the author); 3
>   refutations validated and upheld.
> + **The recorded-but-unapplied D3 edit is applied**: declared-only filter
>   exclusions (phase `post_16`/`all_through`/`special`, key stage `KS5`,
>   priority `improving_attendance`/`teacher_retention`) stated in D3 with
>   all three divergence arms re-verified directly against the corpus
>   constant; filter domains are the observed domains exactly.
> + **D3 PENDING reviewers fired in-flight at ratification** (mcp-expert /
>   assumptions-expert / type-expert / architecture-fred, refutation-briefed,
>   decided scope protected): all four READY-WITH-CONDITIONS; every
>   condition critically assessed, grounded, and applied — incl. the
>   mcp-expert catch that live graph tools return non-empty `content`
>   (V8 corrected: `content: []` is the ratified TARGET, not live
>   evidence — author's own convenient-claim slip),
>   `UniversalToolListEntry.inputSchema` widening added to V5,
>   `z.nullable`-not-`z.optional` hazard named, ADR-179 placement sentence,
>   and the D2-table provenance rows + the `update_history` honesty line.
> + **Owner-directed adversarial self-audit (2026-06-03) corrected three
>   authored defects**: the third tool function (corpus metadata) DELETED —
>   the plan's primitive targeting assigns corpus metadata to the resource,
>   and the function's "resource-less hosts" rationale was author-fabricated
>   then reviewer-amplified (Oak targets Claude.ai + ChatGPT exclusively;
>   the installed ext-apps stack itself requires resources); internal
>   `data_version`/`last_updated` removed from the envelope (D1 V2: internal
>   debugging metadata — telemetry's home, never `structuredContent`); prompt
>   arguments aligned to the house shape (`topic` + `yearGroup` required,
>   per `lesson-planning`). The envelope is now one uniform shape with zero
>   conditional fields; the type-expert optional-methodology bridge dissolved
>   with the function it patched (friction at that seam was the signal the
>   function was wrong); the fifth D2 provenance row (`meta.schema_version`)
>   completes the table's corpus-level rule. A focused mcp-expert re-pass ran
>   against the corrected artefact with the Claude.ai/ChatGPT target register
>   pinned in the brief.
> + **Parallel agent coordinated**: Lofty Sweeping Falcon (codex, dedicated
>   curation) live on the same branch; boundaries split by claim + comms
>   event; my commit excludes their curation surfaces (incl. `distilled.md`,
>   where their edits interleave).
>
> **NEXT SAFE STEP (owner-ratified 2026-06-03): a dedicated
> review-then-ratify session for D3.** In order: (1) independent review of
> the D3 work itself — `eef-d3-mcp-contract.md`, the plan's D3 section, and
> the three D3 commits (`78c92b95`, `0ace63ad`, `50b928c6`) — grounding
> every claim against `EEF_TOOLKIT_DATA`, the plan's Ratified Decisions,
> and HEAD code; the authoring session corrected its own fabricated
> rationale only under owner challenge, so do NOT inherit its conclusions
> as settled — a review session's failure family is rubber-stamping and
> confirm-the-claim bias; enumerate from the artefact and code side.
> (2) Whole-plan review for coherence with the corrected D3. (3) Discussion
> with the owner. (4) Resolution of anything raised. (5) Owner ratification
> — only then the `d3` todo flips and D4 (graph capability contract)
> proceeds, its reviewers firing against the ratified D4 output in turn.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Seaworthy Swimming Sextant` | `claude` | `Opus 4.8` | `a85c18` | `eef-d3-contract-authoring-and-review` | 2026-06-02 | 2026-06-03 |
>
> ---
>
> **JC4 UNIFIED SUBSTRATE-MIGRATION PLAN AUTHORED — PARKED ON A NAMED
> TRIGGER (2026-06-02, Galactic Glowing Prism / `cd7389`; claude / Opus 4.8;
> owner-approved session plan).**
>
> [`graph-tools-value-redesign.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/future/graph-tools-value-redesign.plan.md)
> now owns moving all existing graph tools onto `graph-corpus-sdk`
> (graph-estate-consolidation §Judgement calls, call 4 — authored-note added
> there). The estate edits land as one commit with the plan.
>
> + **Shape**: per-corpus replacement units (tool + resource twin +
>   interpolation consumers — entailed by the ratified type-authority
>   re-emission, so a promotion-time scope-back to per-tool would have to
>   accept split-brain explicitly). Tool set pinned from code:
>   `get-misconception-graph` (6.0MB, nodes-only), `get-prior-knowledge-graph`
>   (1.8MB, nodes+edges), `get-thread-progressions` (190KB `as const`
>   sequences — already its own type authority; its consumer set includes
>   `ontology-data.ts`, `tool-guidance-data.ts`, AND
>   `tool-guidance-workflows.ts`).
> + **Closed/open ledger**: nine ratified decisions carried with citations
>   (incl. the §Resolved Sequencing contract and owner-resolved Q2/Q4); open
>   Decisions A–F (re-emission shape, adapter home + dependency direction,
>   thread-progressions hosting incl. the named null-participation option,
>   schema-emission shape, landing order, factory third-consumer
>   consolidation) settle at promotion. **Promotion trigger: EEF D6 landed +
>   D7 green** (both observable todo flips).
> + **Absorptions**: `oak-misconceptions-substrate-migration` archived after
>   independent re-grounding (its `Inc.3` trigger + `maxResponseTokens`
>   demand are retired framing; disposition ledger in the plan);
>   `graph-tool-output-schemas` archived after its design content folded in
>   (Q1/Q3/Q5 → Decisions A/B/D); referrers repointed (kg README, Q-003,
>   repo-continuity, eef-revalidate seed). The ADR-086 amendment (large-graph
>   type pattern, stale tool rows, AND the §4 no-new-tools freeze) is a named
>   deliverable riding the first re-emission commit.
> + **Review**: 4-specialist refutation workflow (assumptions / betty /
>   docs-adr / mcp — all READY-WITH-CONDITIONS; every finding critically
>   assessed, one rejected with reason). The known-answer probe (the withheld
>   ADR-086 §4 freeze) was CAUGHT by docs-adr-expert — recall calibration
>   positive. The fleet caught a real consumer-set miss
>   (`tool-guidance-workflows.ts`) that author spot-checking did not.
>
> **NEXT SAFE STEP: EEF D3** per repo-continuity's EEF Next Safe Steps
> item 6 — open with a full whole-plan review of
> `eef-graph-tool-completion.plan.md`, then a full D3 review; one
> recorded-but-unapplied D3 edit (the declared-only filter exclusions) is
> noted there. The owner-ratified arc (2026-06-02): **finish the EEF plan →
> migrate the graph tools onto the new substrate → then decide what to do
> next** — the post-migration step is an explicit owner decision point,
> recorded in the migration plan's §Promotion trigger.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Galactic Glowing Prism` | `claude` | `Opus 4.8` | `cd7389` | `jc4-unified-substrate-migration-plan-authoring` | 2026-06-02 | 2026-06-02 |
>
> ---
>
> **GRAPH-ESTATE CONSOLIDATION EXECUTED — t2–t5+t7 LANDED AS ONE SHIP-UNIT,
> SCOPED t8 VERIFICATION PASSED (2026-06-02, Opalescent Cascading Planet /
> `0340f9`; claude / Opus 4.8; owner-approved session plan).**
>
> The graph plan estate now reads true in one pass: eleven plans archived to
> `kg/archive/completed/` with banners (seven superseded-framing, three
> completed with outcomes + SHAs, plus verification of the already-quarantined
> `graph-tooling-rebuild`); the four misconception feature plans consolidated
> into
> [`oak-misconceptions-graph-features.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/future/oak-misconceptions-graph-features.plan.md)
> (each problem a named section; both assumptions-expert park-header
> conditions honoured; `maxResponseTokens=16000` marked retired);
> `oak-kg-threads-surface` + `nc-knowledge-taxonomy-surface` parked with
> substance-preserving block-condition headers; the KG README rewritten to
> the post-move reality; `graph-stack.plan.md` re-framed (Inc.N/gate labels
> declared retired per ADR-173, landed WS statuses flipped incl. the WS4.1
> scaffold, WS5 closed as executed-by-consolidation); the live-estate
> reference sweep de-linked every survived pointer (one where-did-they-go
> record: `completed-plans.md` §"Knowledge Graph Integration (2026-06-02
> Estate Consolidation)"). `repo-continuity.md` verified zero-edit (all token
> instances are decontamination record). Reviewed in real time
> (docs-adr-expert + adversarial dangling-pointer hunt; all findings
> remediated except two broken links inside the
> `agentic-engineering-enhancements` thread record, deferred under a parallel
> agent's active claim — de-link the `graph-query-layer` /
> `2026-05-11-graph-execution-prep-opener` mentions there when that claim
> clears). `t6` and the full `t8` close stay D7-gated; the `t8` todo is
> `pending` by design.
>
> **NEXT SAFE STEP: author the Judgement-call-4 unified substrate-migration
> plan from this clean estate** (one plan owning the move of all existing
> graph tools onto `graph-corpus-sdk`; scope ratified in
> `graph-estate-consolidation.plan.md` §Judgement calls, call 4). Then EEF D3
> per repo-continuity's EEF Next Safe Steps item 6.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Opalescent Cascading Planet` | `claude` | `Opus 4.8` | `0340f9` | `graph-estate-consolidation-execution` | 2026-06-02 | 2026-06-02 |
>
> ---
>
> **MANDATE-1 DEEP CONTAMINATION SCAN EXECUTED — ESTATE CLEAN AFTER NINE
> FIXES (2026-06-02, Stellar Waning Planet / `64c383`; claude / Opus 4.8;
> owner-directed standing mandate).**
>
> The scan ran over the full four-commit session-output surface
> (`384b74de`, `9946ccf4`, `e8fe16e0`, `52cad7ee` — the perimeter was
> corrected at grounding: the brief's three-commit enumeration carried a
> June-1 commit and structurally excluded its own handoff commit). Method
> and complete ledger:
> [`mandate-1-contamination-scan-2026-06-02.md`](../../../reports/mandate-1-contamination-scan-2026-06-02.md)
> — token+concept inventory, mechanical sweep (237 hits, all sanctioned
> record), 8 refutation-briefed Sonnet reviewers + adversarial
> verification per finding (13 raised → 7 survived → all author-grounded),
> one known-answer probe (unfound by the fleet; calibration recorded).
>
> + **Nine fixes landed**: two count/citation precisions in
>   `output-schemas-for-mcp-tools.plan.md` (incl. the W2 8-vs-11 label);
>   three in `graph-estate-consolidation.plan.md` (D0–D2 completeness;
>   the meta-plan "never merged" falsity — its branch merged via PR #108;
>   the JC3 heading "5"→four, the span the prior 5-vs-4 fix missed); the
>   `pending-graduations` temporal-seam entry re-grounded to
>   green-at-each-boundary; the `repo-continuity` item-7 heading restated
>   to the one-thread order; the audit-workflow FILE_MAP path; and the
>   `graph-corpus-sdk` root-barrel TSDoc rewritten to present truth
>   (prose only — exports untouched, D4/D5 own the surface design).
> + **Cross-document consistency verified**: the one-thread sequencing,
>   schema-delivery order (EEF D6 first and alone; graph tools with their
>   migration), S0/migration/re-validation ownership, 24+11=35 tool
>   counts (code-grounded), and Q1–Q5 statuses read identically across
>   all four plans, both thread-record top banners, and repo-continuity.
> + **Spelling signal resolved in-session**: the owner directed British
>   "judgement" estate-wide (83 hits, 57 files; executed as a mechanical
>   sweep by a parallel cursor session — Ashen Igniting Hearth — then
>   scoped). The two generated vocab `data.json` snapshots are carved
>   out: their strings are upstream caption-derived curriculum content
>   and `pnpm sdk-codegen` would revert hand-edits. Upstream content
>   defect noted in the scan report §Spelling signal.
>
> **NEXT SAFE STEP (fresh session, the graph-estate plan's own doctrine):
> graph-estate t2+t3+t4 → t5+t7 as one ship-unit → scoped t8**, honouring
> the two assumptions-expert park-header conditions at the t4 move. Then
> the Judgement-call-4 unified substrate-migration plan, authored from this
> clean estate. Then EEF D3 per repo-continuity's EEF Next Safe Steps
> item 6.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Stellar Waning Planet` | `claude` | `Opus 4.8` | `64c383` | `mandate-1-deep-contamination-scan` | 2026-06-02 | 2026-06-02 |
>
> ---
>
> **ONE-THREAD RESEQUENCING RATIFIED + ESTATE CORRECTIONS — COMMITTED
> `e8fe16e0` AND PUSHED, FULL PRE-PUSH GATE GREEN (2026-06-02, Silvered
> Lurking Mask / `bbb696`; claude / Opus 4.8; owner-directed).**
>
> **Owner-ratified and now recorded in the estate (the plans are the
> authority; this banner is the pointer):**
>
> + **ONE thread**: EEF + graph decontamination/consolidation + graph
>   enhancements + substrate migration. **Decontamination + consolidation
>   execute FIRST** (graph-estate t2–t5/t7/t8 precede EEF D3+), preceded only
>   by the mandate-1 deep contamination scan. The prior "graph-estate after
>   EEF finishes" direction is superseded and removed everywhere it lived.
> + **Output-schema delivery order** (in
>   `output-schemas-for-mcp-tools.plan.md` §Resolved Sequencing): the EEF
>   tool's `outputSchema` lands **first and alone via EEF D6** — the first
>   instance of the projection→single-Zod-call mechanism; the 3 existing
>   graph tools receive theirs **with their substrate migration** (one
>   replacement unit per tool: data/type re-emission + rewrite +
>   `outputSchema`) and are untouched before it; remaining tool types follow;
>   required/root `UniversalToolListEntry` promotion last. **Rule: a tool's
>   schema arrives when the tool is built or rebuilt, never before.**
> + **D7 proves value on the LIVE bulk graph tools** (verified: they take no
>   input and return the whole graph — 6.0MB misconception / 1.8MB
>   prior-knowledge data); *scaling* that value is owned by the migration.
>   Thread-progressions (~190KB, sequence-shaped) is not graph-forced and is
>   not on the EEF value path.
> + **Corruption removed**: stale D6 citation-shape conditional (refuted by
>   tree); superseded sequencing directions; OPEN-DECISION-S0-OWNERSHIP
>   references (resolved); the **pre-existing 5-vs-4
>   misconceptions-consolidation contradiction** in graph-estate
>   (independent-reviewer catch — it survived this session's own full plan
>   read); `Increment 3` residue in the `graph-corpus-sdk` README +
>   `package.json` (README rewritten to grounded present truth, no
>   forward-looking schedule, per `no-moving-targets`).
> + **Review**: 3-reviewer workflow (docs-adr/assumptions/code,
>   refutation-inviting, decided scope protected); findings critically
>   assessed against the artefacts — 5 accepted and fixed, 1 rejected as
>   over-literal, 4 observations.
>
> **NEXT SAFE STEP (start here): the mandate-1 DEEP CONTAMINATION SCAN** of
> the 2026-06-02 session outputs — now pushed (`9946ccf4`, `384b74de`,
> `e8fe16e0`) — with independent eyes and a token+concept inventory assembled
> from the D0 decontamination ledger, the graph-estate plan preamble, and the
> June-2 convenient-claim slip classes. Known scan target already flagged:
> `graph-corpus-sdk/src/index.ts` root-barrel TSDoc (claims "re-exports each
> sub-path module's public surface"; the code exports only the
> `GraphView`+`Result` types; old corpus-adapter framing — D4/D5 surface).
> Then graph-estate execution (fresh session), then the Judgement-call-4
> unified substrate-migration plan (born from the clean estate), then EEF D3
> per item 6 of repo-continuity's EEF Next Safe Steps. The EEF plan's D3/D4
> PENDING reviewers fire against ratified D3/D4 outputs, which do not exist
> yet — no dispatch was due this session.
>
> **Gate:** commit `e8fe16e0` pushed; the successful push is the green proof
> (full pre-push gate: format, markdownlint, knip, depcruise, repo-validators,
> shell-lint, turbo build/type-check/lint/test/e2e/ui — 103/103). Owner also
> ran a green full `pnpm check` before the commit. Active-claims: none for my
> identity.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Silvered Lurking Mask` | `claude` | `Opus 4.8` | `bbb696` | `one-thread-resequencing-ratification-and-estate-corrections` | 2026-06-02 | 2026-06-02 |
>
> ---
>
> **MCP OUTPUT-SCHEMA PLAN AUDITED + REWRITTEN; GRAPH-TOOL OUTPUT-SCHEMA
> PROJECTION PLAN CREATED; S0 OWNERSHIP RESOLVED (2026-06-02, Abyssal Flowing
> Beacon / `762085`; claude / Opus 4.8; owner-directed; doc-only, no commit, no
> gates).** The output-schema workstream the sibling banner below flagged as
> "separate, NOT mine" — this is it.
>
> **Outputs (all uncommitted on `feat/graph-tooling-tidyup`):**
>
> + **Audit** `.agent/reports/output-schema-mcp-plan-audit-2026-06-02.md` (61-agent
>   workflow; 40 claims verified, top-stakes re-verified by hand). Found
>   `output-schemas-for-mcp-tools.plan.md` materially stale: stdio gone; 34→35
>   tools / 10→11 aggregated; Phase-3 gate on `projections.ts` deleted in PR #76.
> + **Rewrote** `output-schemas-for-mcp-tools.plan.md` decision-complete:
>   object-rooted **required** `outputSchema`; generated (codegen-composed) vs
>   aggregated (hand-authored) split; the S0 universal-tools seam; one open
>   decision. Then **owner resolved S0**: this plan owns it; apply the required
>   field **per tool type, graph first**; promote to root `UniversalToolListEntry`
>   last. `current/README.md` row refreshed.
> + **Created** `sdk-and-mcp-enhancements/current/graph-tool-output-schemas.plan.md`
>   (status DESIGN, not executable). Captures the owner's **projection** doctrine:
>   schemas are NOT hand-constructed Zod; they are a deterministic, type-strict
>   projection of the static data fed to a **single Zod call** (`satisfies`-tied),
>   the SAME pattern as EEF (Decision 2 / D6), emitted at **codegen**. Five open
>   questions (see **Q-003**) + co-design with EEF D4–D6.
>
> **Metacognition correction (mid-design):** I first designed "generator emits a
> hand-authored Zod string" and called it generator-first — owner named it as
> *constructing* a parallel Zod. Insight: **location ≠ principle**; a test-guarded
> hand-authored schema is a once-cure that can drift, the projection+`satisfies`
> tie is the structural cure (drift = compile error). Captured in napkin +
> experience this narrow handoff.
>
> **Key integration fact:** EEF D5/D6 (the single-Zod-call mechanism) are pending
> — so the graph tools and EEF are **co-defining one shared mechanism**, not
> copying. EEF D6 names the identical S0 seam this plan owns. The `as const`
> precondition (the typed projection needs it; graph data is currently loose
> `data.json`) and the output-only simplification are the live open questions.
>
> **Next safe step:** do NOT implement; the graph slice is paused for owner review
> of `graph-tool-output-schemas.plan.md` and must be coordinated with the EEF
> thread (one mechanism, one seam) per the owner mandate that graph-estate +
> graph-enhancement + EEF be aligned as ONE unit.
>
> **Gate:** doc-only; markdownlint green on touched files; full `pnpm check` NOT
> run (owner direction). Active-claims: none for my identity.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Abyssal Flowing Beacon` | `claude` | `Opus 4.8` | `762085` | `mcp-output-schema-audit-rewrite-and-graph-projection-plan` | 2026-06-02 | 2026-06-02 |
>
> ---
>
> **EEF/ADR/GRAPH-ESTATE PLAN REVIEW + REFINEMENT (deep, multi-workflow) — 3×
> CONVENIENT-CLAIM CATCHES, ALL UNCOMMITTED (2026-06-02, Flamebright Charring
> Ember / `30dd5d`; claude / Opus 4.8; owner-directed; no commit).** Reflect-and-
> review session that grew into grounded plan/ADR refinement across two threads.
> Doc-only; everything below is uncommitted working-tree on `feat/graph-tooling-tidyup`.
>
> **My session's outputs (the contamination-scan targets):**
>
> + **ADR-157 corrected** — dated 2026-06-01 amendment supersedes the retired
>   EvidenceCorpus/five-increment model (cites ADR-173 only, no plan-path; tense
>   fixed after docs-adr-expert caught a present-tense overclaim of the unshipped
>   projection); namespace table de-noised (dropped `eef-recommend-*` + the
>   forbidden `oak-misconceptions-eef-recommend-for-thread` compound example, then
>   removed the empty compound row entirely; "EEF recommendations" → "EEF strand
>   evidence").
> + **`eef-graph-tool-completion.plan.md`** — (C, corrected) the EEF tool is a
>   **graph universal tool** registered through the universal-tools path, NOT a
>   bespoke bypass (topology validated by 4 architecture reviewers + grounded in
>   `AggregatedToolName` containing the live graph tools; output-schema *mechanics*
>   deferred — see OPEN below). (A) D4 acceptance: string-typed
>   `GraphView`/`SubgraphResult`/`SubgraphError` are deleted + re-defined carrying
>   `TNodeId`, never extended. (B) the "red-tree window D2–D6" framing replaced with
>   green-at-each-boundary (D2 landed green; fixed in 3 places incl. the D2 todo).
>   (resource) the interpretation resource is **agent guidance** — end goals,
>   how-to, positive/negative examples, tagged agent-side per `eef-corpus-grounding`;
>   guides, cannot constrain. (D7) pinned the **live** signal tools
>   `get-misconception-graph`/`get-prior-knowledge-graph` (not "for example").
> + **Created `eef/future/eef-revalidate-on-new-graph-tools.plan.md`** (seed) —
>   re-validate the EEF value path against the new graph-corpus-sdk replacements
>   once they land.
> + **Memory** `ground-convenient-claims` sharpened twice (seeded-consensus;
>   label-contamination).
>
> **Reviews (3 Sonnet fan-out workflows, critically assessed — several findings
> rejected as over-escalations/false-positives):** holistic 6-lens plan review;
> D3 4-lens review; 4-architecture-reviewer review of my changes (barney/betty/
> fred/wilma — 0 refutes on the edits; the C topology survived "try hardest to
> refute"). Rejected e.g. a "dangling related-strand edge" runtime test (the
> compile-time guard already exists) and fred's plan-citation flag (matches the
> ADR-173 house convention).
>
> **OPEN — input/output schemas:** owned by
> `sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md` (ACTIVE;
> modified + audited in the working tree this session by a SEPARATE workstream —
> NOT mine: report `.agent/reports/output-schema-mcp-plan-audit-2026-06-02.md`,
> `.agent/state/output-schema-plan-audit.workflow.js`). EEF's output-schema
> mechanics — the universal-tools surface set (`AggregatedToolName`,
> `AGGREGATED_TOOL_DEFS`/`AggregatedToolDefShape`, `UniversalToolListEntry`,
> `listUniversalTools`, `handlers.ts` config) + Wilma's three-step asymmetric-drop
> guard — are deferred to that plan. See open-questions **Q-003**.
>
> **3× convenient-claim catches (owner):** asserted "bespoke" MCP topology (wrong —
> graph tools ARE universal tools); over-specified unsettled output-schema
> mechanics (pulled back); **proliferated retired `Inc.3`** into graph-estate
> (removed, reframed to ADR-173 consumer-readiness). One root: grounded the surface
> fact, not the load-bearing meta-fact. Cure sharpened in memory + `distilled.md`.
>
> **OWNER MANDATE (near-future session) — two standing items:**
>
> 1. **Deeply scan ALL this session's outputs for contamination** (the 3× catches
>    mean more may have slipped).
> 2. **Graph estate consolidation + graph enhancement + EEF work can no longer
>    exist independently — a near-future session must clean and align ALL
>    graph-related work as ONE unit.**
>
> **Gate:** doc-only; markdownlint green on every touched file; full `pnpm check`
> NOT run (doc-only, uncommitted, tree carries the separate output-schema
> workstream + `.vscode`/sdk-README edits not authored here, nothing committed) —
> the contamination-scan session must run the full gate before any commit.
> Active-claims: none for my identity.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Flamebright Charring Ember` | `claude` | `Opus 4.8` | `30dd5d` | `eef-adr-graph-plan-review-and-refinement` | 2026-06-02 | 2026-06-02 |
>
> ---
>
> **GRAPH-ESTATE CONSOLIDATION PLAN — POINTS 1/2/3 ADDRESSED + ADR-173
> DECONTAMINATED + t1 RATIFIED & FLIPPED (2026-06-01, Glittering Soaring Meteor /
> `9d9b06`; claude / Opus 4.8; owner-directed).** Owner asked to reflect on
> `connecting-oak-resources/knowledge-graph-integration/current/graph-estate-consolidation.plan.md`,
> then to address three of the reflection points, run reviewers, and apply. Done:
>
> + **Point 3 (verify convenient claims):** grep-grounded the plan's "already
>   done/removed" claims. Spine-pointer removal + EEF-README-done **verified true**;
>   the blanket "zero `Inc.3` residue" was **false for docs** — ADR-173 +
>   `graph-corpus-sdk/README.md:6` carried `Inc.3`. Corrected to a point-precise
>   residue position.
> + **Point 2 (t1 ratification risk → executed for real):** read all six t1 files;
>   the substance-loss lens caught that **`kg-alignment-audit`,
>   `kg-integration-quick-wins`, `agent-guidance-consolidation` are independent
>   live work, NOT archive/park-blocked-on-EEF** (a mechanical sweep would have lost
>   them). `open-education-knowledge-surfaces` → archive; `oak-kg-threads-surface` +
>   `oak-misconceptions-subgraph` → park (MVP-arc scaffold retired). `assumptions-expert`
>   ratified READY (agrees 6/6, no false-keep).
> + **Point 1 (flatten):** four stratified "Inbound from …" sections collapsed into
>   one verified `## Current state`, with an anti-restratification rule (hand-offs
>   land in this thread record, not new plan sections) — in the section and the
>   opening blockquote.
> + **Reviewers:** code-expert (4/4 residue claims confirmed; caught an ADR-173/t7
>   scope inconsistency), docs-adr-expert (flatten lossless; fixed a dead anchor +
>   two stale frontmatter todos), assumptions-expert (READY). All findings
>   critically assessed against live files, then applied.
> + **ADR-173 fixed (committed in the concurrent sweep `3f01a5e8`):** post-acceptance
>   hygiene amendment — stale "before promotion" sections cleared (Accepted
>   2026-05-11), `Inc.3` adapter-sequencing retired (no live referent; substrate
>   Inc.1/2/4 untouched).
> + **t1 flipped to `completed`** (decision ratified). The remaining source-tree
>   `Inc.3` (`graph-corpus-sdk/README.md:6`) is finishing-plan scope — owner-decision
>   for when it's cleaned.
>
> **Current state:** t1 (decide) DONE; the entire execution unit (t2–t5, t7) is
> decision-complete but **unexecuted** — no file has moved. t6 + final t8 criterion
> are D7-gated.
>
> **Next safe step (owner-directed):** take up the graph-estate plan **after the EEF
> work finishes**. Then execute t2+t3+t4 then t5+t7 as one ship-unit (the plan's
> `## Execution sequence`), honouring the two assumptions-expert park-header
> conditions at the t4 move. Two reviewer sonnet transcripts are in this session's
> subagents dir if their detail is needed.
>
> Concurrent context: a sweep-commit (`3f01a5e8`, owner) absorbed this session's
> ADR-173 edits + prior continuity + the field-cardinality back-out during the
> session; my graph-estate-plan delta is the only uncommitted file. Active-claims
> empty.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Glittering Soaring Meteor` | `claude` | `Opus 4.8` | `9d9b06` | `graph-estate-points-1-2-3-and-adr-173-decontamination` | 2026-06-01 | 2026-06-01 |
>
> ---
>
> **EEF PLAN + D3 REVIEW (grounded) + PLAN/​TABLE CURRENCY FIXES + A PROCESS
> MISSTEP (2026-06-01, Dawnlit Dancing Satellite / `b91f7b`; claude / Opus 4.8;
> owner-directed; HEAD `604ec53`; no commit).** Ran the owner-requested whole-plan
> and D3 reviews, grounding **every** corpus claim directly against
> `EEF_TOOLKIT_DATA` (prior reviewers fabricated facts, so nothing was trusted).
>
> **Grounding verified (all exact):** floor `headline`/`definition`/`key_findings`/
> `tags` 30/30; sparse `effectiveness` 7, `behind_the_average` 6, `implementation`
> 4, `common_pitfalls` 2, `school_context_relevance` 17, `related_strands` 17,
> `related_guidance_reports` 7; `impact_months: null` on 4. Phase and key stage are
> independent (the only key-stage map is `uk_context.key_stage_mapping` → ages/years
> — **no** key-stage→phase mapping); divergence exact (phase
> post_16/all_through/special; keyStage KS5; priority
> improving_attendance/teacher_retention); `behind_the_average_by_phase` +
> `applications` sit under `school_context_relevance` (feedback primary 7/secondary
> 5, oral 7/written 5). **No fabrication found; the contamination correction holds
> (zero composite-axis shorthand survives).**
>
> **Review verdict:** design coherent + SOUND; D3 sound (field classification
> grounded, no-crosswalk consistent with Decision 10, single-Zod-call, and the
> `outputSchema` gap is real — `handlers.ts` `registerTools` config carries
> `inputSchema` only). **D3 open finding (recorded, not yet applied):** the D2
> source-path table lacked rows for the attribution/summary output fields
> (`name`/`slug`/`eef_url`/`headline.headline_summary`, all 30/30 field-access) and
> `closing_the_disadvantage_gap` (2/30), so D3's "every output field traces to a
> source path" obligation could not close — **now fixed** (rows added, with the
> `uk_context` and non-phase/key-stage/priority `school_context_schema` enums
> recorded as intentionally-unprojected school-leader context). D3 should also state
> the
> declared-only exclusions (`KS5`/`post_16`/`all_through`/`special`/
> `improving_attendance`/`teacher_retention` are **not** valid filter inputs) — not
> yet applied.
>
> **Currency fixes APPLIED to the plan this session (D2 had landed but the plan
> still described the pre-D2 tree):** D2 frontmatter `pending`→`completed` + a body
> `Status: complete` line; `EefKeyStage`/`EefPriority` (never built) replaced with
> the real committed D2 projection inventory (the Observed/Declared split +
> divergence, headline-metric domains, edges, corpus-meta); `response-budget.ts`,
> `EvidenceCorpus` `rank`/`explain`/`compare` types, and `citation-shape.ts`
> corrected from "future D5/D6 deletion" to "already removed" (all verified gone
> from HEAD); `handlers.ts:185-196` de-line-numbered; Carried Context refreshed to
> post-D2 truth. Plan + table pass prettier/markdownlint/diff-check.
>
> **⚠ THE PROCESS MISSTEP (why the owner stopped the session).** Owner directed
> projection purity — **all data a deterministic projection of the corpus; no
> separate lists of keys; no type assertions; type predicates only for parsing
> external/user input.** To make the table's cardinality "derived, not asserted"
> I wrote `field-cardinality.ts` **v1 as a runtime `Record<field,count>` using
> `Object.keys` + two `as` casts** — every one of those is **banned** by the strict
> ESLint config (`consistent-type-assertions: never`, `no-explicit-any`,
> `no-restricted-properties` on `Object.keys` → use `typeSafeKeys`). I verified with
> `type-check` + `test` only — **not `lint`** — and the cast **silenced type-check**
> (casts pass tsc by design), producing a false green. Owner caught it across three
> corrections. **Root causes:** (1) wrong data shape — a runtime keyed record forces
> `Object.keys`+cast = thrown-away type info; the *type-level* floor/sparse split
> needs none; (2) skipped `lint-after-edit`; **type-check is cast-blind, lint is the
> only guard**; (3) wrote product code under a *review* mandate at reduced rigor;
> (4) failed to apply the owner's already-stated principle as a **pre-write screen**
> — reaching for `as`/`Object.keys`/a non-parsing predicate is itself the signal the
> shape is wrong. Lessons captured in `napkin.md`.
>
> **DECISION (owner-directed): the flawed code is backed out; there was never
> separate work to defer.** `field-cardinality.ts` + its test were removed and the
> `index.ts` barrel reverted — graph-corpus-sdk is back to its committed-D2 state
> (3 test files, 15 tests, lint + type-check green). The earlier "build it at D6"
> framing was wrong (can-kicking). The correct insight: **the floor/sparse
> distinction is inherent in `EefStrand` — `keyof EefStrand` *is* the floor, and the
> union carries optionality (a strand without `effectiveness` simply has no such
> key). There is no separate cardinality/floor structure to build, now or later.**
> A redundant module restating an inherent type fact is deleted, not deferred.
>
> **What GOOD looks like for the EEF graph stack (the floor — non-negotiable):**
>
> + Every datum is a deterministic projection of `EEF_TOOLKIT_DATA`; the corpus is
>   the single source of truth and its own type authority. No separate lists of
>   keys/values/fields, no hand-maintained vocabulary, no parallel data.
> + No type assertions (`as`), no `any`, no `Object.keys`-style type erasure. The
>   *one* type predicate in the system is `isValidStrandKey` (the single external
>   unknown — the key). A predicate anywhere else means type info was thrown away.
> + TypeScript proves types, tests prove runtime behaviour, ESLint proves structural
>   rules — **run all three after every edit.** type-check is cast-blind (an `as`
>   silences it); lint (`consistent-type-assertions: never`,
>   `no-restricted-properties` on `Object.keys`, `no-explicit-any`) is the guard.
> + Every exported surface has a real consumer (Decision 6 / PDR-058). No
>   speculative surface, no stub, no build-ahead-of-need.
>
> **What GREAT looks like (the bar to aim for):**
>
> + The distinction you reach to build (floor/sparse, cardinality, optionality) is
>   recognised as **already inherent in the corpus type**, so you build *nothing*
>   separate — you derive at the point of use and let `satisfies` make the type
>   enforce correctness. D6's output-schema optionality falls out of the
>   graph-native view type automatically; no counting, no classification.
> + Reaching for `as` / `Object.keys` / a non-parsing predicate triggers a **stop**:
>   it is the signal the shape discarded type information — find the type-level
>   projection (`keyof`, indexed access, mapped types) instead.
> + Removal of a redundant or zero-consumer surface is read as *excellence*, not
>   loss; "do it later" is not the alternative to "keep it" — "it does not exist as
>   separate work" is.
>
> **Uncommitted tree state (`feat/graph-tooling-tidyup`, on top of `604ec53`) — docs
> only, no product code:**
>
> + **Plan** (`eef-graph-tool-completion.plan.md`): D2 `completed`; post-D2 currency
>   fixes (real projection inventory replacing the never-built `EefKeyStage`/
>   `EefPriority`; already-removed `response-budget`/`EvidenceCorpus`/`citation-shape`
>   corrected; `handlers.ts` de-line-numbered; Carried Context refreshed).
> + **Source-path table**: added attribution rows (`name`/`slug`/`eef_url`/
>   `headline_summary` 30/30, `closing_the_disadvantage_gap` 2/30); the floor-is-
>   `keyof EefStrand` fact + the no-separate-structure note; the intentionally-
>   unprojected `uk_context`/`school_context_schema` scoping note.
> + **Continuity**: this banner + `napkin.md` process lessons.
> + All gate-green (type-check/lint/test on graph-corpus-sdk; prettier/markdownlint/
>   diff-check on the docs). **No commit.** Active-claims empty (mine); peer `Coppery
>   Warming Flame` owns the graph-estate banner below (untouched).
>
> **NEXT SESSION — start here, in order:**
>
> 1. **Review the whole plan** (`eef-graph-tool-completion.plan.md`) for coherence
>    and post-D2 currency, grounding every corpus claim directly against
>    `EEF_TOOLKIT_DATA` (trust no prose — prior reviewers fabricated facts). The
>    currency fixes above should hold; verify, don't assume.
> 2. **Review D3** (the MCP tool/resource/prompt contract) in full: field
>    classification (every input traces `contract field → graph-native subset → raw
>    EEF source path → proof test`); the no-server-side-crosswalk boundary
>    (Decision 10); the single-Zod-call input/output schemas (root `type: object`);
>    the SDK/app verification record (the `outputSchema` gap in `handlers.ts`
>    `registerTools` is real; `mcp-expert` verification pending). **One addition to
>    apply** that this session recorded but did not make: D3 should state the
>    declared-only filter exclusions — `KS5`/`post_16`/`all_through`/`special`/
>    `improving_attendance`/`teacher_retention` are declared-but-unobserved and are
>    **not** valid filter inputs (they yield empty-but-valid results).
> 3. Hold every edit to the GOOD/GREAT bar above; lint after each one.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Dawnlit Dancing Satellite` | `claude` | `Opus 4.8` | `b91f7b` | `eef-plan-and-d3-review-currency-fixes-and-backout` | 2026-06-01 | 2026-06-01 |
>
> ---
>
> **CONSOLIDATION-PLAN CURRENCY + GRAPH-INGEST DECONTAMINATION (2026-06-01,
> Coppery Warming Flame / `9a5cc3`; claude / Opus 4.8; owner-directed, commit
> attempted).** Made `graph-estate-consolidation.plan.md` post-D2 accurate and
> crystal-clear, and finished the code-side gate-1a decontamination. Plan edits:
> corrected "Verified state to inherit" (it presented D2-deleted surfaces —
> `EefStrandsGraphView`, the `loadEefCorpus`/`selectEefSeedIds`/freshness path, the
> EEF tool "shipping dark" — as live/pending), added an "Inbound from EEF D2"
> section, removed the stale D0 code-residue bullet, and added an explicit
> `## Execution sequence`. The sequence makes the key finding unmissable: **t1's
> six dispositions are unconfirmed proposals** (t1 `pending`; all six files still
> in their original lanes), so Increment 1 = t1 + `assumptions-expert` runs first;
> the do-now subset is t1–t5 + t7 (everything except the D7-gated t6 and t8's t6
> criterion). Code: removed the two surviving `gate-1a` TSDoc/test comments in
> `graph-ingest` (meaning preserved), so the repo now carries zero gate-1a/1b/Inc.3
> code residue (graph-ingest type-check + 36 tests green). `repo-continuity` item 7
> refreshed. All four touched files gate-green
> (markdownlint/prettier/eslint/diff-check), uncommitted on
> `feat/graph-tooling-tidyup`. A peer (`Woodland Swaying Copse`, codex) had an
> abandoned commit-queue entry touching the plan file; no live claim.
>
> **Next safe step:** execute the plan's `## Execution sequence` — Increment 1
> (t1 verify + `assumptions-expert`) before any archive/park move. t6 + final t8
> wait on finishing-plan D7.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Coppery Warming Flame` | `claude` | `Opus 4.8` | `9a5cc3` | `consolidation-plan-currency-and-graph-ingest-decontamination` | 2026-06-01 | 2026-06-01 |
>
> ---
>
> **EEF D2 LANDED + CONTAMINATION-CORRECTION ARC (2026-06-01, Lunar Transiting
> Eclipse / `9cde59`; claude / Opus 4.8; owner-directed).** D2 (the typed
> raw-corpus foundation) is COMPLETE and committed `9019bb86`, green + reviewed
> (code/type/test experts): `EefStrand`/`EefStrandId`/`EefStrandById` derived from
> the `as const` corpus (the `z.infer` name repointed), `isValidStrandKey`, the
> observed/declared domains + the declared-vs-observed divergence (phase:
> post_16/all_through/special; keyStage: KS5; priority:
> improving_attendance/teacher_retention), related-strand edges, corpus
> provenance, and the source-path table with its cardinality column
> (`eef/current/eef-d2-source-path-table.md`). The old list-shaped EEF surface was
> removed across three workspaces (graph-corpus-sdk + oak-curriculum-sdk + the
> streamable-http app); `OAK_CURRICULUM_MCP_EEF_ENABLED` is a dormant seam for D6.
> Clean green atomic removal — no red window needed.
>
> **Contamination correction (owner-caught).** A fabricated key-stage→phase
> mapping — the corpus holds phase and key-stage as two independent fields with no
> correspondence — had been carried into the canonical plan from a deleted prompt.
> Removed it; ran an independent 4-lane grounding audit against `EEF_TOOLKIT_DATA`
> (which caught a second grounding error — `behind_the_average_by_phase` "at which
> key stage" → "at which phase" — and the "key stage / phase" composite-axis
> shorthand); completed a tombstone disposition pass over the plan (commits
> `fb7ad234`, `70ccbef8`, `75b0734a`, `6d0fbbfd`). Lesson in Claude auto-memory:
> `harvest-from-deleted-is-contamination-vector` — deleting failed content, save
> nothing by default; anything carried must cite a corpus path or be tagged
> agent-side.
>
> **Next safe steps.**
>
> 1. **Cite-or-tag is now a real rule** (graduated 2026-06-01, Moonless Lurking
>    Dusk). It lives at `.agent/rules/eef-corpus-grounding.md` as a `trigger-loaded`
>    rule (all four forms + `RULES_INDEX.md` row); the stopgap doc was retired. The
>    rule fires when authoring/editing an `EEF_TOOLKIT_DATA` claim.
> 2. **D3** (MCP tool/resource/prompt contract) is the next plan deliverable —
>    owner-ratified, `mcp-expert` SDK-registration verification pending.
> 3. **Graph-estate-consolidation plan needs a currency update + execution**: its
>    "Verified state to inherit" presents D2-deleted surfaces as live; refresh it
>    and add an "Inbound from EEF D2" section first, then execute t1–t8 (mostly
>    pending; ~1–2 focused sessions; t7 largest; t6 deferred until D7).
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Lunar Transiting Eclipse` | `claude` | `Opus 4.8` | `9cde59` | `eef-d2-implementation-and-contamination-correction` | 2026-06-01 | 2026-06-01 |
>
> **EEF PLAN SEAM-MAPPING + GROUNDED REVIEW CORRECTIONS (2026-06-01, Windswept
> Floating Summit / `d8560c`; claude / Opus 4.8; owner-directed, no pnpm check,
> commit).** Ran the two owner-requested reviews of the live plan — whole-plan
> coherence and a D2-specific review — grounding every claim directly against
> `EEF_TOOLKIT_DATA` and the repo. Two Explore subagents returned a fabricated
> `graph-project` import fact and wrong `~N/30` cardinalities; both were caught by
> direct verification before reaching any edit (and my own narrow-`ls`
> over-correction — "graph-ingest/graph-project don't exist" — was caught too; they
> live in `packages/libs/`). **Corrections + enhancements applied to the live
> plan:**
>
> + **Status truth:** the claim that the `graph-view` query contract was "already
>   removed in code" is false — `graph-core/src/graph-view/` (interface/types/index/
>   contract test) and the EEF-local adapter are LIVE. Reworded: D2 deletes the
>   adapter + old list tool (the contract's only consumers), D5 replaces the
>   contract; `graph-ingest`/`graph-project` (in `packages/libs/`) consume only the
>   RDF substrate, so zero external blast radius. The RDF substrate is genuinely
>   multi-consumer.
> + **V1 source-path fixes:** `behind_the_average_by_phase` and `applications` sit
>   under `school_context_relevance` (not under `behind_the_average`); `meta.caveats`
>   is corpus-level (one global block), not a per-strand field.
> + **Optionality first-class (verified cardinalities over 30 strands):** universal
>   floor `headline`/`definition`/`key_findings`/`tags` 30/30; sparse/optional
>   `effectiveness` 7/30, `behind_the_average` 6/30, `implementation` 4/30,
>   `common_pitfalls` 2/30, `school_context_relevance` 17/30, `related_strands`
>   17/30, `related_guidance_reports` 7/30. D2 source-path table gains a corpus-
>   cardinality column; D6 output schema marks non-floor fields optional; D7 proves
>   graceful collapse on a floor-only strand.
> + **Decision 10 added:** the system is deterministic data; the consuming agent is
>   the only reasoner. Every surface is a deterministic projection of the static
>   corpus; relevance/ranking/move→strand mapping belong to the agent; the static
>   interpretation resource scaffolds its reasoning. This is the positive rationale
>   for the no-server-side-crosswalk boundary. `EefStrand` is currently a
>   `z.infer` type in the to-be-deleted `strand-schema.ts`; D2 repoints the name to
>   the `as const` derivation. Three existing EEF-MCP files (`telemetry.ts`,
>   `eef-evidence-grounded-lesson-plan-messages.ts`, `eef-evidence-guidance.ts`) now
>   have a stated disposition; the R1/R7 guidance is corpus-grounded and is candidate
>   D3-interpretation-resource content.
> + **`## Sequencing` rewritten** as the exemplar seam map: three axes (execution
>   schedule / dependency DAG / runtime path) + the value closure arc, then a seam
>   taxonomy — fan-out (D1/D2/D4), confluence (D3/D5/D6, the D2→D5 skip-level
>   construction boundary the deepest), closure arc (D1⇒D7), orthogonal runtime axis,
>   layering anti-seams, the source-path-table ledger, the temporal red-tree seam —
>   and the law **seams compose, they are never reconciled** (friction at a junction
>   = an input drifted from the single corpus root; fix upstream, never bridge). D7
>   gains an obligation to exercise the Oak/EEF workflow seam on more than one signal.
>
> **Next safe step (owner-directed 2026-06-01): do ONE more D2 review, then
> implement D2.** D2 is the typed raw-data ingestion foundation in
> `eef-graph-tool-completion.plan.md` (see its D2 Do/Done-when): derive
> `EefStrand`/`EefStrandId`/`EefStrandById` from the `as const` corpus, implement
> `isValidStrandKey`, build the source-path table (with the corpus-cardinality
> column), derive the observed/declared vocab domains + the declared-vs-observed
> divergence record, and delete the old school-context/strand-schema/load/list/Zod/
> freshness path and the EEF-local graph adapter outright — the plan's intentional
> in-flight red window, cured by the completed D2-D6 chain, not by any
> wrapper/shim/fallback. TDD cycles; test and product code co-land. Note `EefStrand`
> is currently the `z.infer` type in the to-be-deleted `strand-schema.ts` — repoint
> the name to the `as const` derivation, leaving no Zod-inferred strand type. This is
> the first product-code execution since D0, so `code-expert` (and the specialists it
> flags) run in the normal loop after edits. The D3/D4 PENDING reviewers fire later
> against ratified D3/D4 outputs. The seam-mapping taxonomy + "seams compose" law is
> captured in `pending-graduations.md` as a reusable plan-template/archetype
> candidate (owner-confirmed intent). A live peer (Luminous Dancing Aurora, codex/GPT-5/
> `019e82`) held an active claim on the `discovery/future/` plans and was editing
> them at session close; the owner directed committing everything in this session's
> bundle, so those plans were included (peer notified via a directed comms event;
> their later edits land as a delta). This session's continuity + EEF-plan + napkin
> edits are committed on `feat/graph-tooling-tidyup`; active-claims has no entry of
> mine.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Windswept Floating Summit` | `claude` | `Opus 4.8` | `d8560c` | `eef-plan-seam-mapping-grounded-review-corrections` | 2026-06-01 | 2026-06-01 |
>
> ---
>
> **EEF PLAN RECAST AS POSITIVE DESIGN + D0 COMPLETE + NO-EXCEPTIONS RULE
> (2026-06-01, Twilit Threading Satellite / `435b98`; claude / Opus 4.8;
> committed `f8548985`; owner-directed, no pnpm check).** The live EEF plan now
> reads as positive design throughout: it states what the system is and builds,
> carried by one invariant — every tool, resource, prompt, graph operation, and
> handler is implemented with real graph-derived logic and tests, or it is
> absent. **D0** (fixed-data doctrine + validator removal + estate
> decontamination) and **D1** (teacher value contract) are complete; D0 is
> verified against its acceptance criteria and the repo: `repo-validators:check`
> green, ADR-038/153/157/173 doctrine set, ADR-175 withdrawn, the `as const`
> corpus types derived in `graph-corpus-sdk/src/eef-strands/strand-lookup.ts`,
> and the decontamination ledger complete with a clean extended-token acceptance
> sweep. Two rules now hold: **`rules-have-no-exceptions`** (a rule holds in
> every case it governs; a misfit improves the rule) and the now exception-free
> **`no-tombstones-for-removed-ideas`** (framed as a domain statement: removing
> code is ordinary work, and a history record's subject is the change). How the
> plan reached this shape lives in the napkin, the ledger, and commit
> `f8548985`.
>
> **Next safe step:** two reviews, in order, held against the teacher value the
> work serves (EEF evidence enriching Oak lesson adaptation, with strength, cost,
> impact, caveats, and uncertainty preserved). (1) A whole-of-plan review of
> `eef/current/eef-graph-tool-completion.plan.md`: does it cohere as one design in
> service of that value — value contract → MCP surface → graph layer → raw corpus?
> (2) A D2-specific review: is the typed raw-data foundation the right foundation —
> does what it derives from `EEF_TOOLKIT_DATA` support the evidence the teacher
> needs downstream, and is its boundary with D5/D3/D6 clean? These are reviews;
> whether and when D2 is implemented is an owner decision after they land. The
> plan's D3/D4 PENDING reviewers fire later, against the ratified D3/D4 outputs
> once those exist. Continuity writes this session are working-tree (uncommitted)
> on `feat/graph-tooling-tidyup`; active-claims empty.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Twilit Threading Satellite` | `claude` | `Opus 4.8` | `435b98` | `eef-plan-positive-recast-d0-complete-no-exceptions-rule` | 2026-06-01 | 2026-06-01 |
>
> ---
>
> **EEF GRAPH-TOOL RE-REVIEW + STUB DELETION + DECONTAMINATION (2026-06-01,
> Shaded Swaying Sapling / `d37ba7`; claude / Opus 4.8; owner requested handoff,
> no pnpm check, no commit).** Re-reviewed the live EEF plan for total old-shape
> removal and settled the D2 union-vs-binding test boundary: domain-generic
> traversal + synthetic-node tests live in graph-core; the EEF binding is tested
> over the real corpus; nothing fabricates an `EefStrand`. Deleted the stub tools
> in code — the five `NotImplementedYet` graph ops, the `EvidenceCorpus`
> rank/explain/compare substrate, and the `threads` `export {}` placeholder —
> landing GREEN across all consumers (graph-core 76 / graph-corpus-sdk 48 /
> curriculum-sdk 784 tests; MCP app + graph libs type-check clean). Swept the
> plan's GraphView language to delete-and-build-fresh and scrubbed negation
> monuments (Decisions 6/7, the D2/D4/D5 bullets, the D4 todo). Corrected ADR-173
> (2026-06-01 amendment: query layer real-ops-only, Threads placeholder removed)
> and a `graph-project` comment; ADR-157's `EvidenceCorpus` note stays as demoted,
> self-disclaimed speculation. **D0 is RE-OPENED (decontamination only** — its code
> and ADR-doctrine work stays committed at `ce9745c7`). **Next safe step:** to
> re-close D0, update `eef-d0-decontamination-ledger.md` with the new-token
> dispositions (ADR-173 corrected; ADR-157 demoted-speculation / history-retained;
> graph-project comment corrected; estate-plan sweep routed to
> graph-estate-consolidation) and run the extended-token acceptance sweep
> (`NotImplementedYet` / `EvidenceCorpus` / threads / `Inc.3`) over EEF plans +
> non-plan docs proving zero live references, then flip the D0 frontmatter status
> back to `completed`. Then continue D2 per the live plan. No claim opened or closed
> (active-claims empty). Uncommitted code + doc edits on `feat/graph-tooling-tidyup`.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Shaded Swaying Sapling` | `claude` | `Opus 4.8` | `d37ba7` | `eef-re-review-stub-deletion-decontamination` | 2026-06-01 | 2026-06-01 |
>
> ---
>
> **D2-D6 REPLACEMENT-PLAN CORRECTION APPLIED (2026-06-01, Evergreen Budding
> Copse / `019e7f`; owner requested handoff, no pnpm check, commit all files).**
> This session read D2, ran four architecture reviewers, critically synthesised
> their findings, then applied the owner correction: no wrappers, no compromises,
> no remnant of the old shape, and no requirement to keep the tree green while the
> fundamental replacement is in flight. The live plan now states: D2 builds the
> typed raw-data ingestion foundation from the complete in-memory
> `EEF_TOOLKIT_DATA` constant; D2 deletes the old school-context/strand-schema/
> load/list/Zod/freshness path outright; D3 requires
> `contract field -> graph-native subset -> raw EEF source path -> proof test`;
> D3/D6 contain no Oak-signal-category, pedagogical-move, misconception,
> prerequisite, quiz, text, subject, or topic crosswalk to `EefStrandId`; D5
> ingests the D2 raw foundation into the D4-ratified deterministic graph-native
> EEF projection; and D6 registers only graph-derived MCP surfaces. The old list
> implementation is deletion evidence only, never a behaviour target. Napkin
> captures the correction. Collaboration claim
> `8f26914a-2482-43ea-87c8-fa1f5e5113d8` is closed. **Next safe step:** implement
> D2 exactly as written in
> `eef/current/eef-graph-tool-completion.plan.md`; do not introduce selector lists,
> compatibility fallbacks, raw-foundation wrappers, static no-survivor audit
> harnesses, stub tools, or old-list behaviour repairs.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Evergreen Budding Copse` | `codex` | `GPT-5` | `019e7f` | `eef-d2-d6-replacement-plan-correction` | 2026-06-01 | 2026-06-01 |
>
> ---
>
> **D1 COMPLETE + ANCILLARY REPORTS ARCHIVED (2026-05-31, Kilned Crackling
> Ember / `019e7f`; committed at `a6ec6766`; no `pnpm check` by explicit owner
> direction).** Double-checked the settled D0/D1 content after owner ratification.
> D1 is complete in the live plan: EEF concepts, payload fields, resources, and
> schemas are deterministic type-strict projections of the graph form of the fixed
> EEF data, with provenance visible back to that data; no separate evidence-term
> list, externally maintained vocabulary, crosswalk, fallback, or
> data-justification layer remains live. Reviewed the rest of the plan against
> that settled frame and fixed
> the plan accordingly: D3 now writes and validates the MCP contract; D4/D6 own the
> graph-native Zod schema path; D2/D5 deletion ordering is coherent; EEF tool
> inputs use fixed finite ids; Oak subject/topic context is workflow context, not
> an EEF input. Per owner direction, stale ancillary reports/briefs were archived
> after their useful substance was folded directly into the plan. The only live
> files under `eef/current/` are now the D0 decontamination ledger and the graph
> tool completion plan. Targeted validation before the commit was green:
> Prettier, markdownlint, `git diff --check`, and stale-language `rg` guards.
> **Next safe step:** resume from D2 or D3 in
> `eef/current/eef-graph-tool-completion.plan.md` as the owner directs; treat the
> live plan as the authority and the archived reports/briefs as historical scratch
> artefacts only. Session-handoff collaboration check found active claims empty,
> commit queue empty, and no relevant EEF conversation/escalation handoff needed.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Kilned Crackling Ember` | `codex` | `GPT-5` | `019e7f` | `eef-d1-completion-plan-archive-closeout` | 2026-05-31 | 2026-05-31 |
>
> ---
>
> **VALUE REFRAME LANDED + PLAN RESYNCED (2026-05-31, Fruited Regrowing
> Copse / `abec59`, `claude-opus-4-8`; owner-directed, no commit).** The owner
> reframed the EEF value model and the plan was resynced to it. **The reframe:**
> EEF is evidence about teaching strategies and decisions, not
> topic-indexed content; relevance is a function of the *pedagogical move* on EEF's
> own finite axes (approach / priority / key-stage-phase / impact-cost), and the
> value intersects Oak's tools at the *workflow* level — Oak's misconception and
> prior-knowledge graphs (plus the quiz/text) raise the signal, the agent names the
> move, the EEF tool returns the evidence on it. The EEF tool takes only the
> corpus's finite keys; subject/topic are Oak's domain and are simply not EEF
> inputs (stated by absence, not as a guarded prohibition — per the owner's
> no-tombstones correction). **Done this session:** `## Value And Impact` rewritten
> (new "What EEF is, and how relevance works"); D1/D3/D4/D5/D6/D7 bodies + Fully
> Specified End State + Non-Goals resynced natively (reframe-consequence banners
> removed, not kept as warnings); the graph layer reaffirmed as deliberate
> multi-source foundation (EEF first, then misconceptions / prerequisites / Oak
> ontology — owner direction); SLT strands split to
> `future/eef-school-leadership-evidence.plan.md`; EEF-only-workflow value captured
> in `future/eef-standalone-evidence-workflows.plan.md`; research/reviewer detail
> folded into the live plan. Gaps 2–4 from the holistic pass also cleared
> (D3→D4→D6 schema hand-off; D7↔observability matrix; D1 ratification-status note).
> Targeted checks green (Prettier, markdownlint, git diff --check) on every touched
> doc. **No commit, no `pnpm check`.** The user-value trace and graph predecision
> research/reviewer artefacts have since been folded directly into the live plan;
> their briefs/reports are archived as historical scratch artefacts and are not
> live sources. D0 and D1 are complete; resume at D2 or D3's written MCP contract /
> SDK-app verification record as the owner directs. Two cross-session lessons
> captured to platform memory: no-tombstones-for-removed-ideas and
> trace-user-value-before-tool-design.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Fruited Regrowing Copse` | `claude` | `claude-opus-4-8` | `abec59` | `eef-value-reframe-plan-report-resync` | 2026-05-31 | 2026-05-31 |
>
> ---
>
> **D2 / REPORT / PRINCIPLES NO-ESCAPE-HATCHES CORRECTION APPLIED (2026-05-31,
> Prismatic Shimmering Constellation / `019e7e`; owner-requested tight handoff,
> no commit, no new check).** This session repaired the D2 plan/report alignment
> after owner correction: the fixed `EEF_TOOLKIT_DATA` object is the only source
> of truth for EEF finite values; no separate maintained key/value/vocabulary
> lists, no glue/crosswalk layer, and no compatibility/fallback path is allowed.
> Any proposed EEF tool input that cannot map directly to fixed known data is a
> D1/D3 architectural misalignment, not D2 adapter work. The EEF plan and report
> now say free-form teacher language is interpreted before the deterministic tool
> call, not accepted as an EEF tool-input category. Adjacent D3/D6 wording was
> tightened from "replacement/fallback after verification" to hard proof
> requirements: failure means the contract/foundation is wrong and must be
> corrected. `.agent/directives/principles.md` now explicitly bans fallbacks,
> compatibility layers, preserving proven-wrong ideas, "just in case" branches,
> and hedged plan options. Code and docs reviewers re-checked the final wording
> and both returned PASS. Final checks before the handoff request had passed
> (Prettier, markdownlint, `git diff --check`, and targeted stale-phrase guards),
> but no additional check and no commit were run by explicit owner direction.
> **Next safe step:** continue from
> `eef/current/eef-graph-tool-completion.plan.md` D2 with the single-source rule
> as controlling doctrine, or proceed to the D3 MCP contract / SDK-app
> verification record if the owner chooses that lane; do not resurrect old-list,
> free-text, fallback, or compatibility paths.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Prismatic Shimmering Constellation` | `codex` | `GPT-5` | `019e7e` | `eef-d2-no-escape-hatches-plan-report-principles-repair` | 2026-05-31 | 2026-05-31 |
>
> ---
>
> **PRE-DECISION REPORT FIXED + REVIEWER POLISH APPLIED (2026-05-31, Deep
> Drifting Anchor / `019e7e`; owner-requested tight handoff, no additional check,
> no commit).** This session read
> `eef/current/eef-graph-predecision-report-fix.codex-brief.md`, applied the
> required fixes to
> `eef/current/eef-graph-predecision-research.report.md`, then dispatched a
> read-only reviewer set (`code-expert`, `docs-adr-expert`, `type-expert`,
> `mcp-expert`, `assumptions-expert`, and `architecture-expert-wilma`). Reviewer
> synthesis found one real blocker: the report covered broad-`string`
> result/error IDs but under-specified graph query inputs. The follow-up polish
> now explicitly threads `TNodeId` through query inputs as well as outputs,
> labels `EefStrandId` / `isValidStrandKey` as planned D2 work rather than
> current D0 code, aligns M1 with the practical-small D3 MCP direction, fixes
> `listUniversalTools` provenance, expands deletion-ordering evidence, separates
> corpus-op deletion from graph-core contract-test updates, and adds the MCP
> structured-content compatibility caveat. Targeted report validation before
> this handoff passed: Prettier, `git diff --check`, markdownlint, and the
> brief's targeted `rg` guard. **No new handoff check and no commit by explicit
> owner direction.** **Next safe step:** resume the EEF lane with the fixed
> pre-decision report as handoff-safe research material; run the live holistic
> plan pass brief if that review has not been superseded by owner direction, then
> proceed to the written D3 MCP contract artefact and SDK/app verification record
> or owner-directed D4+ planning.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Deep Drifting Anchor` | `codex` | `GPT-5` | `019e7e` | `eef-predecision-report-repair-review-synthesis` | 2026-05-31 | 2026-05-31 |
> | `Prismatic Shimmering Constellation` | `codex` | `GPT-5` | `019e7e` | `eef-d2-plan-repair-review-synthesis` | 2026-05-31 | 2026-05-31 |
>
> ---
>
> **OWNER QUESTIONS ANSWERED + D3 TIGHTENED; HOLISTIC PASS BRIEF READY
> (2026-05-31, Estuarine Rolling Harbour / `019e7d`; owner-requested tight
> handoff, no commit, no `pnpm check`).** This session applied the remaining D1/D3
> fixes and polish, answered the owner-facing open questions, and recorded the
> settled D3 MCP surface: one deterministic EEF query/fetch tool, one EEF
> interpretation resource/template for applying evidence, and one user-facing
> prompt for starting the teacher workflow. The plan now states that free-form
> teacher language is interpreted by the invoking agent before any EEF tool call;
> the deterministic tool receives only finite fixed inputs derived from Oak/EEF
> data. D3 is now tightened into two remaining products: a written MCP contract
> artefact and a separate SDK/app verification record; `mcp-expert` sign-off is
> still pending. EEF-specific docs now include the value of EEF evidence and the
> Sunday-night cover example as illustrative, not exhaustive. **Next safe step:**
> run the new holistic plan pass brief at
> `eef/current/eef-plan-holistic-pass.codex-brief.md` to review the entire live
> plan for coherence, cohesion, completeness, accuracy, and freshness before D4+
> execution proceeds. Targeted checks run this session for touched docs:
> `git diff --check`, Prettier, markdownlint. No commit and no full `pnpm check`
> by explicit owner direction.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Estuarine Rolling Harbour` | `codex` | `GPT-5` | `019e7d` | `eef-d1-d3-owner-question-resolution` | 2026-05-31 | 2026-05-31 |
>
> ---
>
> **REPORT REVIEWED; FIX BRIEF READY (2026-05-31, Codex GPT-5; owner-requested
> short handoff, no gates, no commit).** This session created the D1-parallel
> pre-decision research brief at
> `eef/current/eef-graph-predecision-research.codex-brief.md`, the D1 reviewer
> brief at `eef/current/eef-d1-reviewers.codex-brief.md`, monitored the
> delivered graph research report, swept SDK/plan/report language away from
> list-era/ranking/recommendation concepts, improved the report once, then ran
> code / architecture / docs reviewer passes on the report. Reviewer synthesis:
> the report is useful but **not yet safe as D3/D4/D5 handoff material**. It must
> first fix traversal-reuse wording, current-code-vs-plan-target wording for
> `structuredContent`, construction-integrity overclaims, shorthand file/line
> refs, process self-certification, and small projection/schema line-shape
> inaccuracies. A dedicated follow-up brief now exists:
> `eef/current/eef-graph-predecision-report-fix.codex-brief.md`. **Next safe
> step:** run that brief before using
> `eef/current/eef-graph-predecision-research.report.md` to guide D3/D4/D5. No
> gates run and no commit made by explicit owner direction.
>
> ---
>
> **PRE-DECISION GRAPH RESEARCH DELIVERED (2026-05-31, Vining Ripening Fern /
> `870a40`, `claude-opus-4-8`; owner-directed read-only research session).** Ran
> the research instruction set in
> `eef/current/eef-graph-predecision-research.codex-brief.md` and delivered the
> report at **`eef/current/eef-graph-predecision-research.report.md`** — the
> file/line-grounded map of the graph decision space (executive summary, known
> constraints C1–C9, open D1/D3/D4 questions, three candidate graph-native view
> forms with pros/risks/proof needs, layer-split map, risk register R1–R10, and
> the D3/D4 decision agenda). The `eef/README.md` "Status of the Live Plan"
> section now points at it. It is labelled `pre-decision research` and **ratifies
> nothing** — it names the decisions D1/D3/D4 own and surfaces considerations,
> it does not make or recommend them (owner-corrected mid-session: "research, not
> decision making").
>
> Concrete findings the report grounds for D3/D4: (1) the clean `as const`
> foundation (`strand-lookup.ts`) exists but the graph layer still types nodes as
> the Zod-inferred `EefStrand` keyed by broad `string` — D5 is mainly a
> re-pointing, the BFS traversal in `eef-graph-model.ts` is reusable once re-keyed
> on `EefStrandId`; (2) type erasure is concentrated at two named seams
> (`graph-core` broad-`string` result/error ids; the EEF adapter's
> `ReadonlyMap<string, EefStrand>`); (3) the MCP registration config at
> `handlers.ts:185-196` carries **no `outputSchema`** today, and both
> `registerTool` and `registerAppTool` paths exist — D6 must extend the config +
> the `listUniversalTools` projection; (4) `rank`/`explain`/`compare` are
> type-only, barrel-exported — corroborates the zero-external-blast-radius
> finding; (5) **D3's output schema cannot be settled before D1 ratifies the
> teacher-facing evidence field set** (the old `projection.ts` field set was sized
> by the deleted response cap, so it is not a neutral baseline — V1–V4 in §3a).
>
> **Tree state**: the report + the `eef/README.md` pointer are uncommitted
> working-tree edits. **No commit and no `pnpm check`** by explicit owner
> direction. Other agent present this session: Codex `Estuarine Rolling Harbour`,
> claim scoped to `napkin.md` only — no overlap. **Next step unchanged**: D1
> (value, owner-ratified) ∥ D2 (typed raw foundation), then D3→D7; the report
> feeds D3/D4.
>
> ---
>
> **REVIEWER FINDINGS APPLIED + ARCHITECTURE BRIEF READY (2026-05-31,
> Hearthlit Roasting Caldera / `019e7d`; owner-confirmed light handoff).** This
> session ran the Codex reviewer brief at
> `eef/current/eef-plan-reviewers.codex-brief.md`: `docs-adr-expert`, a general
> `type-expert`, and a special type-preservation `type-expert`. Findings were
> synthesised, then the owner widened scope to apply all findings and polish. The
> live plan and EEF README now state the controlling doctrine clearly: raw
> `EEF_TOOLKIT_DATA as const` is definitively **not** the graph contract; the graph
> is derived from the raw data; exact raw-derived typing must be preserved through
> the graph-native view, graph operations, MCP schema declarations,
> `structuredContent`, and the teacher-facing value proof. The plan no longer
> leaves an "identical raw/graph shape" revisit path. The next-session Codex brief
> for all four architecture reviewers is now
> `eef/current/eef-plan-architecture-reviewers.codex-brief.md`; run
> `architecture-expert-barney`, `architecture-expert-betty`,
> `architecture-expert-fred`, and `architecture-expert-wilma`, then synthesize.
> This session did **not** run `pnpm check` by explicit owner direction. Targeted
> checks for the touched plan/brief files passed: `git diff --check`,
> `pnpm markdownlint-check:root ...`, and `pnpm exec prettier --check ...`.
>
> | agent_name | platform | model | session_id_prefix | role | first_session | last_session |
> | --- | --- | --- | --- | --- | --- | --- |
> | `Hearthlit Roasting Caldera` | `codex` | `GPT-5` | `019e7d` | `eef-reviewer-synthesis-plan-repair-architecture-brief` | 2026-05-31 | 2026-05-31 |
>
> **PLAN REPAIR + REVIEWER BRIEF COMPLETE — RESUME HERE (2026-05-31, Tidal
> Charting Hull / `019e7d`; owner-confirmed handoff).** The EEF live plan was
> repaired after the D0 completion audit: D0 stale-state residue was swept; the
> MCP input/output schema rule now says each schema is derived by a single Zod call
> on the appropriate subset of the constructed graph-native EEF view; and the raw
> EEF corpus is explicitly the source snapshot and type source, not automatically
> the graph contract. D5 now owns an explicit pure graph-native
> construction/adaptation boundary; if no distinct graph-native shape adds value,
> the identical raw/graph-native shape requires owner ratification before
> implementation proceeds. The EEF README was reframed around graph tools/resources
> and evidence-preservation obligations. A next Codex reviewer-session brief now
> exists at `eef/current/eef-plan-reviewers.codex-brief.md`; run it next. It
> requires `docs-adr-expert`, a general `type-expert`, and a separate special
> `type-expert` pass tracing `EEF_TOOLKIT_DATA as const` through raw corpus ->
> typed raw foundation -> graph-native view -> graph ops -> MCP schemas/results ->
> teacher value proof. Targeted markdownlint/Prettier and root Prettier were green;
> `pnpm check` was not run in the final handoff by explicit owner direction.
>
> **D0 COMPLETE + INTENT-VS-LETTER AUDITED (2026-05-31, Opalescent Transiting
> Prism / `73491c`; owner-confirmed).** Both Commit 1 (code) and Commit
> 2 (docs/decontamination) are DONE and verified in the working tree. A
> 4-dimension adversarial audit (letter / intent / conservation-reflex /
> cross-session coherence) confirmed the intent is met — the gate was greened by
> DELETION (not by retyping the corpus to `unknown`), the corpus is typed by
> derivation, the doctrine is coherent across ADR-038/157/173/175 — and closed the
> one residue: the validator-deletion reshape had been recorded only in this
> banner, not propagated, so a shipped-code `gate-1b` line in
> `eef-toolkit.external-data.ts` and the stale "keep two rules" framing in the
> plan (Ratified Decision 3, frontmatter step 7, "Do — validator expunge", the
> "Done when" criterion + Proof) were left live; all now corrected /
> superseded-in-place. The decontamination ledger
> (`eef/current/eef-d0-decontamination-ledger.md`) is complete. **Full `pnpm
> check` is GREEN (exit 0** — build/e2e/a11y/widget/type-check/lint/test/knip/
> depcruise/markdownlint/prettier). **The whole D0 bundle is committed at
> `ce9745c7`** (2026-05-31, one owner-directed commit including the non-EEF
> `discovery/` plan collection and draft PDR-089; pre-commit hook green; 7 ahead
> of origin, NOT pushed). **Next sessions: (1) a Codex EEF plan-consistency /
> residue sweep — brief at
> `eef/current/eef-plan-consistency-sweep.codex-brief.md` (hunts the D1–D7 and
> cross-cutting sections for the same reshape-propagation residue D0's audit
> caught and PDR-089 names) is now complete; then (2) run the Codex reviewer
> session brief named above; then (3) D1 (value, owner-ratified) ∥ D2 (typed raw
> foundation), then D3→D7.** The detailed Commit-1/Commit-2 record below remains
> accurate; the plan-finalisation banner further below remains the authority for
> D1–D7 scope. (A small continuity SHA-stamp delta — this update — is the only
> thing uncommitted on top of `ce9745c7`.)
>
> ---
>
> **Commit 1 (D0 code) is DONE and verified green in the WORKING TREE
> (UNCOMMITTED):**
>
> + The ENTIRE `validate-external-data-files` validator is **DELETED** —
>   owner-directed: the right tool to keep one external-data file logic-free is to
>   LOOK at it, not an AST validator + test suite. This **SUPERSEDES** the plan's
>   Ratified Decision 3 / D0 "expunge two rules, keep two" — that framing was
>   itself the conservation reflex the whole plan exists to remedy. Deleted:
>   `agent-tools/src/external-data/{external-data-contract, external-data-contract.unit.test, external-data-discovery, external-data-discovery.unit.test, external-data-logic}.ts`
>   plus `agent-tools/src/bin/validate-external-data-files.ts`, the
>   `validate-external-data-files` script (agent-tools `package.json`), and its
>   segment in root `repo-validators:check`. **KEPT** (the real duplication-gate
>   mechanism, untouched): the `.external-data.ts` suffix, the Sonar
>   `cpd.exclusions` pattern, and the ESLint ignore glob.
> + `strandById`, `Strand`, `StrandByStrandId`, `lastUpdated`, AND `EefToolkitData`
>   relocated from `eef-toolkit.external-data.ts` into a NEW checked module
>   `packages/sdks/graph-corpus-sdk/src/eef-strands/strand-lookup.ts`,
>   barrel-exported via `eef-strands/index.ts`. The `.external-data.ts` file is now
>   PURE DATA (`EEF_TOOLKIT_DATA as const` + provenance docstring only).
> + Gates green: `repo-validators:check` **exit 0** (the RED gate is gone);
>   graph-corpus-sdk type-check + **53/53** tests; agent-tools type-check +
>   **722/722** tests; `knip` clean; lint + format clean. `pnpm check` (full) NOT
>   run — mid-arc, Commit 2 docs pending; the heavy suites (build/e2e/widget/a11y)
>   are unaffected by a validator deletion + type relocation.
>
> **⚠ TREE STATE: the owner DELETED the ADR-175 record file this session.** Its
> inbound links (ADR-157 ×2, the 3 README index entries) are NOT yet cleaned —
> that is Commit 2. **`pnpm check` will be RED on link integrity until Commit 2
> lands.** This is known/expected, not a regression.
>
> **Commit 2 (D0 docs) is PENDING — next session, then `pnpm check` green + commit:**
>
> + **ADR-038** generalise in-record to any fully-known `as const` constant. Cite
>   the **`unknown-is-type-destruction` RULE** as the primary linchpin (it is the
>   artefact that forbids `unknown` over known data and names `as const` as
>   non-destruction); ADR-034 is the ADR it operationalises — do NOT attribute
>   those exact words to ADR-034 directly (verified this session). No Amendment Log
>   exists on ADR-038; add a dated note (model ADR-153's convention).
> + **ADR-157** surgical (status "Proposed (was Accepted; demoted 2026-04-30)"):
>   Typing Discipline EEF bullet (l.115–119, BOTH sentences), Trade-offs sentence
>   (l.281–283), and REMOVE both ADR-175 refs — the Related link (l.16–17) and the
>   Status Amendment Note "binding" paragraph (l.42–45). Do NOT mark the whole ADR
>   superseded.
> + **ADR-173** Zod-loader designation in all FOUR locations (l.46–50 amendment
>   summary, l.256–261 First-wave ingestion item, l.318–323 Consequences bullet,
>   and the §Typing Discipline cross-ref inside l.256–261) → typed direct-load.
> + **ADR-175 inbound cleanup**: README index entries
>   (`architectural-decisions/README.md` l.226–229 + l.284–285;
>   `docs/architecture/README.md` l.74–75) + add **WITHDRAWN** to the lifecycle
>   vocabulary (`architectural-decisions/README.md` l.418–423, currently
>   Proposed/Accepted/Superseded/Deprecated). The ADR file is ALREADY deleted.
> + **`docs/governance/sonar-disposition-policy.md`** lines **357** and **450** —
>   drop the "MUST export its data typed `unknown`" clause AND the "enforced by the
>   `validate-external-data-files` repo-validator" clause; the convention is now
>   verified by review/inspection (no validator, no unknown requirement).
> + **Estate decontamination ledger** (EEF plans + non-plan docs only). Grounded
>   facts from this session's sweep: `gate-1a/1b` = **69 hits / 22 files**, ALL in
>   delete-bound CODE (covered by D2/D5/D6, not corrected individually); the LIVE
>   non-plan-doc hits needing correction are the ADR-175 inbound refs above + this
>   thread record's banner + repo-continuity's quarantined-rebuild pointers + the
>   `eef/README.md` + `eef/reference/conservation-map.md`. NON-EEF plans
>   (`graph-mvp-arc` etc.) are OUT of scope → `graph-estate-consolidation.plan.md`.
>   History/archive/comms/napkin = `history-retained`, NOT touched.
>
> **SESSION META-LESSON (curated — the reason this session was slow):** the
> conservation reflex recurred ~5× DURING EXECUTION (not just planning): I
> re-litigated the owner-deleted ADR-175; framed "zero importers" of the
> `strandById`/`StrandByStrandId` EXEMPLARS as a finding (they are the worked
> demonstration of the derive-from-`as const` doctrine — no consumers is by
> design); TDD-ed a validator that should not exist; framed the validator deletion
> as "superseding the approved plan" when deleting it was always the intent; and
> left `EefToolkitData` fossilised in the data file. Root: **in remediation the
> default verb is DELETE/REPLACE the mistaken status quo — and even a ratified plan
> clause (Decision 3) can carry the reflex.** The cure is an execution-time
> default-flip, NOT another `distilled.md` entry (the lesson already lives in
> `feedback_existence_is_not_correctness_default_replace` + the escape-hatch
> screen). Captured in napkin + an experience file this session.
>
> ---
>
> **CURRENT TRUTH — PLAN FINALISATION BANNER (2026-05-30; planning complete, D0 now
> executing per the block above). Everything below this banner is SUPERSEDED
> HISTORY — do not resume it (including the 2026-05-29 S1–S5 banner).**
>
> **PM UPDATE (Evergreen Bending Thicket / `d4da14`).** The plan was reviewed (an
> 11-agent readiness workflow), then **finalised** under owner direction: it is
> decision-complete + validated (frontmatter parses, markdownlint clean), scoped to
> the EEF work. The two broken-concept design docs
> (`graph-tooling-rebuild-foundation-2026-05-28.md`, `graph-tooling-rebuild.plan.md`)
> were **QUARANTINED** to `archive/` and every live link severed estate-wide. The
> wider graph consolidation/decontamination/rewriting — gate-1a/1b everywhere, the
> `graph-mvp-arc`/`graph-portfolio-index`/`graph-combinatorial-arc` disposition — is
> nominated to **`graph-estate-consolidation.plan.md`** (the master plan). This
> session's substantive work is **committed at `2e8d5455`** (the owner ran the
> `--no-verify` commit). The session-close continuity writes (this banner, the session
> entry below, repo-continuity, napkin, experience) are staged on top, uncommitted.
> `pnpm check` skipped by owner direction; it is RED only on the pre-existing
> `data-export-must-be-unknown` validator — the exact gate D0 greens.
>
> The finishing plan `eef-graph-tool-completion.plan.md` was **restructured again
> across 2026-05-30** (begun by Misty Washing Lagoon, deepened by Igneous Flaring
> Spark under a full owner-metacognition session). It is now an **impact-led,
> value-first D0–D7 plan**, **decision-complete**, with remaining exploration named
> as explicit steps (D1 value, D3 MCP, D4 graph). The S1–S5 framing is superseded.
>
> **The plan now opens with a Remediation Context section.** This is remediation
> for compounded mistakes-on-mistakes: one root error — external-origin data ≡
> unknown-shape data — is repeated across the corpus typing, a Zod strand-schema, a
> Zod freshness loader, the `validate-external-data-files` validator, and ADRs
> 157/173/175/032/003. The dominant risk is **drift** into re-stating the mistake;
> the default move on every inherited shape is to **replace it, never soften/preserve/
> hold-open**.
>
> **Owner-ratified decisions baked into the plan:**
>
> 1. **Axis = KNOWN vs UNKNOWN, not external vs internal.** Known data is derived
>    from; unknown-*structure* data is narrowed at its boundary. A clarification, not
>    a contest.
> 2. **No Zod anywhere in the EEF work EXCEPT the single MCP tool output schema**
>    (a Zod-4 declaration derived directly from the fixed EEF data; the installed
>    SDK accepts only Zod for `outputSchema` and validates `structuredContent`
>    against it). Tool input is predicate-narrowed, no Zod. Remove strand-schema,
>    school-context Zod + drift-guard, loader `safeParse`, MCP
>    tool-definition/validation/citation-shape Zod.
> 3. **Expunge the validator's `data-export-must-be-unknown` + `no-unknown-data-export`
>    rules entirely** (not soften). Keep `logic-export-forbidden` + provenance. Exactly
>    one `.external-data.ts` file → zero blast radius.
> 4. **Node type CLOSED**: `EefStrand = (typeof EEF_TOOLKIT_DATA.strands)[number]`; the
>    only unknown is the key, narrowed by `isValidStrandKey`; no hand-normalized
>    interface (the `z.infer<EefStrandSchema>` one is removed).
> 5. **graph-core is input to be RESHAPED, not a fixed foundation.** Its 7-op stubbed
>    `GraphView` (2 live — manifest/subgraph; 5 `NotImplementedYet`) is premature
>    generalization; reshape (kept domain-generic) to the concrete ops the MCP
>    surface consumes — after verifying graph-ingest/graph-project consumer impact
>    (shared RDF substrate stays; the threads adapter is an empty stub → blast
>    radius zero).
> 6. **Budget cap removed unconditionally** (list-era remnant; subgraph scope is the
>    bound).
> 7. **ADR-038 generalised, not duplicated** — it already is the compile-time
>    umbrella; extend it to any fully-known `as const` constant (grounded in the
>    `unknown-is-type-destruction` rule + ADR-034).
> 8. **ADR-175 WITHDRAWN** (added 2026-05-30 PM). It was a little-used
>    plan-promotion safeguard, mis-implemented as a freshness *gate* in code:
>    tighten-then-withdraw the ADR and delete the freshness apparatus + all refs.
> 9. **Estate decontamination is a deliverable** (added 2026-05-30 PM). The
>    discarded positions (`data-export-must-be-unknown`, `gate-1a`/`gate-1b`,
>    freshness/ADR-175, Zod-over-corpus, the response cap) are written across ADRs,
>    plans, and code comments; D0 sweeps + corrects/deletes every LIVE reference.
>
> **The `repo-validators` gate is RED right now** (3 violations on
> `eef-toolkit.external-data.ts`): 2× `data-export-must-be-unknown` (the erroneous
> rule → expunge in D0) + 1× `logic-export-forbidden` (`strandById` → relocate in D2).
> **D0 greens it and is the FIRST execution step.** Never satisfy by retyping the
> corpus `unknown`.
>
> **Read:** `.agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md`
> — the LIVE plan and the **ONLY** EEF plan (D0–D7, decision-complete; Remediation
> Context + Ratified Decisions at the top). The old `graph-tooling-rebuild*` design
> docs were **quarantined** to `archive/` (2026-05-30) — symptoms of the superseded
> broken concept; do not resume, cite, or build on them.
>
> **Next session = execute D0** (doctrine ADRs: generalise 038, correct 157/173
> in-record, WITHDRAW 175, ground 153/028 + `unknown-is-type-destruction`/034, note
> 032/003; EXPUNGE the two validator rules + all references; run the estate
> decontamination sweep → greens the gate), then **D1 (value, owner-ratified) ∥ D2
> (typed foundation)**, then D3→D7. Readiness reviewers (`assumptions-expert`, `mcp-expert`, `type-expert`, +
> an architecture reviewer for the graph-core reshape) before execution moves past
> D4.
>
> Two generalised cross-session lessons captured this session (platform memory +
> napkin): **existence-is-not-correctness / default-replace-in-remediation** and
> **ground-convenient-claims**.

## Session 2026-05-30 (PM, cont.) — D0 execution begun: validator DELETED + exemplars relocated (Opalescent Transiting Prism / `73491c`)

**Execution session (owner-directed; D0 of the EEF plan).** Took D0 from
plan-approved to **Commit 1 done + verified green in the working tree** (full
state in the EXECUTION UPDATE banner at the top). Headline: the entire
`validate-external-data-files` validator DELETED (owner: "the right tool to not
export logic from external data files is to look at them"); the
`strandById`/`Strand`/`StrandByStrandId`/`lastUpdated`/`EefToolkitData` exemplars
relocated to a checked `strand-lookup.ts`; `.external-data.ts` now pure data;
`repo-validators:check` exit 0; both touched packages' type-check + tests green;
knip/lint/format clean. Commit 2 (ADR/doc decontamination) pending; the owner
deleted the ADR-175 record (inbound links dangling until Commit 2). No commit, no
claim (solo, empty registry). `pnpm check` not run (mid-arc; compaction prep).

**Process (owner-caught ~5×, the session's primary artefact):** the conservation
reflex recurred throughout EXECUTION — re-litigating the owner-deleted ADR-175,
framing the exemplars' zero consumers as a finding, TDD-ing a doomed validator,
framing a planned deletion as a deviation, fossilising `EefToolkitData`. Root:
in remediation the default verb is DELETE/REPLACE; even a ratified plan clause
can carry the reflex. Curated to napkin + experience file.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Opalescent Transiting Prism` | `claude` | `claude-opus-4-8` | `73491c` | `eef-d0-execution-validator-deletion-relocation-decontamination-and-intent-audit` | 2026-05-30 | 2026-05-31 |

## Session 2026-05-30 (PM) — readiness review → plan finalisation + estate decontamination (Evergreen Bending Thicket / `d4da14`)

**Planning/docs session (owner-directed; zero product code).** Opened to review
`eef-graph-tool-completion.plan.md` via an 11-agent readiness workflow (2 ground-truth
verifiers + 9 specialist/drift/starting-statement reviewers), contamination-reframed
after the owner's note that ADRs/docs may themselves be wrong. Synthesised + grounded
the findings, then applied them plus owner directives:

+ ADR-175 tightened-then-WITHDRAWN; freshness apparatus + all refs removed. Zod ONLY
  for the single MCP tool output schema (Zod-4, derived from the fixed EEF data);
  input predicate-narrowed. `data-export-must-be-unknown` named the core defect;
  deleted with all references. GraphView corrected 6→7 ops. Escape hatches removed.
  EEF-scoped estate-decontamination deliverable + ledger added.
+ **Quarantined** the 2 design docs to `archive/` (banners + status flipped); severed
  EVERY live link across ~8 files (plans, READMEs, memory, research); audited + fixed
  `extending-graph-support-tooling.plan.md`.
+ **Nominated `graph-estate-consolidation.plan.md`** as the master consolidation/
  decontamination/rewriting plan for ALL graph materials (added the structural
  gate-based plans — `graph-mvp-arc` et al. — to its disposition map; named the
  corrected doctrine as the rewrite standard).

**Process (mine, owner-caught — echoing Igneous's conservation reflex one layer up):**
I kept trying to LIMIT/CONSERVE while the owner kept EXPANDING — (1) argued to KEEP
`checkFreshness` off a STALE `gate-1b` comment in `freshness.ts` (gate-1b removed
sessions ago; I took a dead comment as a live obligation); (2) under-reported the link
surface because my first sweep piped through `rg -v "current/graph-tooling-rebuild"`,
silently hiding the hard-links (the exact target class); (3) drew an artificial
EEF/graph scope boundary, owner-corrected. Same frame-capture as Igneous, now in
verification + scoping. Captured to napkin + distilled.

**State:** plan finalised + validated; substantive work **committed at `2e8d5455`**;
session-close continuity staged on top (uncommitted); `pnpm check` skipped by owner
(RED only on the pre-existing validator D0 greens). No claim opened (solo; bootstrap).
Next session = execute D0.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Evergreen Bending Thicket` | `claude` | `claude-opus-4-8` | `d4da14` | `eef-readiness-review-plan-finalisation-estate-decontamination` | 2026-05-30 | 2026-05-30 |

## Session 2026-05-30 (cont.) — impact-led D0–D7 restructure under full owner metacognition (Igneous Flaring Spark / `6e055a`)

**Planning-only session (owner-directed; zero product code).** Opened to "read +
reflect on `eef-graph-tool-completion.plan.md`". Inherited the day's earlier
impact-led restructure (Misty Washing Lagoon) and deepened it through several owner
correction passes into the current **D0–D7, decision-complete** plan. The seven
ratified decisions are in the banner above and in the plan's Ratified Decisions
section.

**Process arc (mine, owner-caught — the session's central lesson): a
conservation reflex fired four times** — I kept reaching for the smallest edit that
preserved a wrong inherited shape (softening the validator rule instead of deleting
it; preserving a Zod role in a system with no unknown-shape data; treating the
committed `graph-core` interface as fixed; holding the list-era cap as an open
question). Root: **existence/commitment is zero evidence of correctness; in
remediation the default verb is REPLACE.** Also caught grounding two convenient ADR
claims (032 over-claim, 157 "supersede in spirit") without verifying them, one step
after grounding ADR-173 correctly — discipline drops where a claim fits the thesis.
Both captured to platform memory + napkin + distilled.

**State:** plan rewritten + 2 memory entries; no commits, no claim opened (nothing
to close). `repo-validators` gate RED (pre-existing external-data-validator
conflation — the exact thing D0 fixes; surfaced to owner repeatedly; owner directed
planning + compaction with it red). Readiness reviewers NOT dispatched (plan queued,
not yet owner-moved to execution; the plan body changed materially this session, so
the next owner-move toward execution should dispatch them).

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Igneous Flaring Spark` | `claude` | `claude-opus-4-8` | `6e055a` | `eef-impact-led-D0-D7-restructure-under-metacognition` | 2026-05-30 | 2026-05-30 |

---

> **SUPERSEDED 2026-05-30 (was CURRENT TRUTH at 2026-05-29). The S1–S5 framing
> below is replaced by the 2026-05-30 D0–D7 restructure in the banner above — read
> it for history only. Everything below this banner is SUPERSEDED HISTORY.**
>
> The EEF explore tool and the gate-1a / gate-1b split were diagnosed as the
> **wrong foundation** (list-thinking in a graph domain; a query surface that
> was stubbed and then worked around). They are discarded. The old EEF plans are
> archived at `.agent/plans/sector-engagement/eef/archive/`.
>
> **GOAL 1 (fix the plan) is DONE — owner-ratified 2026-05-28.** The one open
> design question (selection / scoping) is resolved: **membership, full nodes
> (one axis)** — context-matched seeds ∪ their bounded traversal neighbourhood +
> all `related_strand` edges among members; every node full; the out-of-subgraph
> frontier reachable via the query surface. Graded "per-hop disclosure" is *not*
> a helpful lever here (whole corpus ~21k tokens < ~25k agent ceiling, so full
> nodes always fit). Settled outcomes folded in: encoding = `structuredContent`
> only; agent-facing, no UI; capability boundary = graph **delivery** (analytical
> ops rank/explain/compare → the new `extending-graph-support-tooling` plan).
>
> **Read, in order:**
>
> 1. `.agent/plans/sector-engagement/eef/current/graph-tooling-rebuild-foundation-2026-05-28.md`
>    — the single source of truth (diagnosis, principles, intent; §10 now resolved).
> 2. `.agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md`
>    — the LIVE execution plan (S1–S5, rewritten 2026-05-29; supersedes the
>    D1–D6 + DX spine of `graph-tooling-rebuild.plan.md`, which — with the
>    foundation — remains the design record).
>
> **GOAL 2 / D0 (merge-safety) is COMPLETE — PR #122 MERGED to `main` at
> `29fc29e4` (2026-05-29, Quiet Hiding Hush).** The EEF graph foundation ships
> **dark** behind `OAK_CURRICULUM_MCP_EEF_ENABLED` (proven OFF in every deployed
> environment). All D0 acceptance conditions met: PR safe; flag co-gating proven;
> flag OFF in preview & production; QG green. See the **2026-05-29 (cont. III)
> entry below** (Quiet Hiding Hush) for the full close.
>
> **Next session = CLOSE THE EEF WORK** by executing the finishing plan
> [`eef-graph-tool-completion.plan.md`](../../../plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md),
> **REWRITTEN 2026-05-29 (Radiant Glimmering Aurora) under a deeper owner critique
> pass** — S1 contract ADR → S2 corpus-is-its-own-typed-source (derive
> `EefStrand`/vocab from the `as const` `EEF_TOOLKIT_DATA`; DELETE the Zod
> `EefToolkitSchema`, `freshness.ts`, the drift-guard; collapse `loader.ts` to an
> infallible adapter) → S3 extend `graph-core` `NodeFilter` to nested paths +
> build ONLY the ops the tool consumes (`enumerateNodes`/`getNode`/`subgraph`) and
> **DELETE every unbuilt op** from adapter AND interface → S4 thin tool (delete
> `projection.ts`/`response-budget.ts`; `structuredContent`-only + derived
> `outputSchema`) → S5 navigation round-trip.
>
> **Three deepened owner directives now baked into the plan (they SUPERSEDE the
> foundation §7 "salvage the Zod loader + freshness" line — the foundation is
> explicitly evolving, not frozen):**
>
> 1. **The fixed `as const` corpus IS its own authority** — derive types FROM it,
>    NEVER validate it. No Zod, no freshness gate, no runtime/build integrity
>    check. The only validation in the system is the inbound tool request (the one
>    trust boundary). Validating fixed known data is strictness-DESTRUCTION (Zod
>    widens the exact literals), not rigor.
> 2. **No stub operations, anywhere** — an op is built or it does not exist. The
>    5 `NotImplementedYet` ops are DELETED from the adapter AND the generic
>    `GraphView` interface (which declares only built ops; it grows by real
>    implementation when a second adapter needs more).
> 3. **The generic `NodeFilter` is EXTENDED to nested paths** (symmetric with
>    `NodeProjection`'s `DeepKeyPath`) — settled LTAE solution, serves the
>    misconceptions / prerequisites / KG roadmap; not an option.
>
> The corpus is delivered as a context-scoped **subgraph** (too large to hand over
> whole), full nodes within it, navigable frontier. `outputSchema` is the DERIVED
> published output contract (data → type → schema), not a runtime gate. Supersedes
> the rebuild D1–D6 + DX spine (foundation + resolved design preserved and cited).
>
> **Forward sequence (owner-directed 2026-05-29 — Pelagic Sailing Sextant, planning session):**
>
> 1. **Next session:** execute the finishing plan to close the EEF work, then merge.
> 2. **After merge:** start a **team session** for (a) evaluating the tool **in
>    context** — its usefulness against the other curriculum tools (the discovery
>    lens) — and (b) the graph + EEF **plan-estate consolidation**, briefed by
>    [`graph-estate-consolidation.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-estate-consolidation.plan.md)
>    (which also authors the value-evaluation plan, superseding
>    `eef-outcome-evaluation-infrastructure.plan.md`).
>
> The earlier "three items" next-session scope is **superseded** by this planning
> session: the ADR is now S1 of the finishing plan; the tool-in-context
> evaluation and the plan-estate consolidation move to the post-merge team
> session. The estate is mostly superseded gate-1a/1b / five-increment framing —
> the consolidation brief carries the verified disposition map so that session
> starts grounded.
>
> Do NOT resume the increments B–H / gate-1a/1b framing below. Detailed prior
> session history remains in git. The full clean rewrite of this surface is plan
> deliverable DX (estate-wide reference reconciliation).

## Session 2026-05-29 (cont. V) — finishing plan REWRITTEN under deeper owner critique (Radiant Glimmering Aurora / `c23958`)

**Planning-only session (owner-directed; zero code — implementation explicitly
held).** Opened to "read + reflect on the finishing plan, report, then stop"; the
owner then delivered several escalating critique passes that deepened the
foundation and exposed the plan (and my reasoning) as still carrying rejected
shapes. Outcome: `eef-graph-tool-completion.plan.md` **rewritten** S1–S5; the
superseded plan-mode scratch file removed.

**What the critique surfaced (and corrected):**

+ **The corpus is now `as const`** (owner-set; `eef-toolkit.external-data.ts` ends
  `} as const`, exports `EefToolkitData = typeof …`, `strands`, `strandIds`). This
  OBSOLETES the entire Zod-parse / freshness / runtime-integrity ingest layer the
  prior plan meant to *salvage*. Types DERIVE from the const; the corpus is its own
  authority and is NEVER validated. The prior `unknown` typing + Zod re-parse was
  strictness-DESTRUCTION (Zod widens the exact literals).
+ **No stubs, ever** (owner, absolute) — the 5 `NotImplementedYet` ops are DELETED
  from the adapter AND the generic `GraphView` interface; build only what the tool
  consumes (`enumerateNodes`/`getNode`/`subgraph`); the interface declares only
  built ops and grows by real implementation.
+ **Extend the generic `NodeFilter` to nested paths** (settled LTAE solution, not
  an option) — the multi-corpus roadmap (misconceptions, prerequisites, KGs)
  justifies the generic query surface; EEF is its first reference adapter; subgraphs
  are the real size mechanism (corpus too large to hand over whole).
+ **No freshness** — the 180-day gate is invented/incorrect/damaging; deleted.
  Verify ADR-175 and retract if it mandates it; reconcile ADR-173 (Zod loader).

**Process lesson (mine, owner-caught repeatedly): the verify-reflex regenerated in
six costumes** (Zod parse → MCP `outputSchema`-as-defense → cross-host-encoding
worry → `satisfies` contract → build-time integrity test) and I twice re-served
SETTLED decisions as A/B choices ("invented optionality even when you claim
otherwise"). Also over-corrected the opposite way — briefly called the generic
layer + subgraphs "premature" by theorising instead of reading the foundation that
already justifies them. Root rule taken: **fixed canonical data is its own
authority — derive, never verify; read the primary artefact before reasoning about
the machinery around it** (the answer — `as const` on the file's last line — was
there the whole time while I circled it). Captured in napkin + distilled.

**Next session = execute the rewritten plan** (S1 ADR first; readiness reviewers —
assumptions-expert on the chain, type-expert at S3, mcp-expert at S4 — dispatch
when the owner moves it toward execution). Working tree carries the owner's
in-progress S2 edits (`eef-toolkit.external-data.ts` as-const, `loader.ts`) — the
Zod removal is S2 work, not yet done.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Radiant Glimmering Aurora` | `claude` | `claude-opus-4-8` | `c23958` | `eef-finishing-plan-rewrite-under-deeper-critique` | 2026-05-29 | 2026-05-29 |

## Session 2026-05-29 (cont. IV) — EEF completion + consolidation PLANS authored (Pelagic Sailing Sextant / `606a0e`)

**Planning-only session (owner-directed; zero code).** Verified true state
against code + git via a 6-agent workflow (not records): D0 done/merged (PR #122,
origin/main `5405f576` v1.15.0; tool ships **dark** behind the flag); D1–D6 + DX
**not started**; the tool is real but **F-shape** (`capForBudget` slice-to-12 +
`projectExploreNode` field-mask + dual `content[]`); **5 of 7** GraphView ops are
`NotImplementedYet` stubs; the substrate (graph-core, graph-corpus-sdk
eef-strands, 30-strand/37-edge corpus, 53 tests) is built. Owner correction
absorbed: the five live curriculum graph tools are the **naive first-pass** tools
the EEF tool is the **pathfinder** to replace — the wider graph work is undefined
until this first proper graph tool is finished.

**Authored (working tree → committed this session):**

+ **Finishing plan** —
  [`current/eef-graph-tool-completion.plan.md`](../../../plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md):
  simple/linear/explicit, S1 contract ADR → S2 query surface → S3 thin formatter
  → S4 navigation round-trip; supersedes the rebuild plan's D1–D6 + DX spine.
  assumptions-expert reviewed (scope proportionate, supersession sound, linear
  chain legitimate); D5 doctrine-graduation made an explicit out-of-scope
  follow-on; S4 telemetry framed as completing the existing `recordSpan` seam.
+ **Consolidation brief** —
  [`knowledge-graph-integration/current/graph-estate-consolidation.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-estate-consolidation.plan.md):
  fresh-session plan carrying the verified estate map + disposition proposal +
  the value-evaluation-plan authoring (t6, supersedes
  `eef-outcome-evaluation-infrastructure.plan.md`). Review caught 3 unclassified
  live-lane files (`oak-kg-threads-surface`, `oak-misconceptions-subgraph-mcp-surface`,
  `open-education-knowledge-surfaces`) → added to t1 verify-first.

**Forward:** next session executes the finishing plan to close EEF → merge →
team session for tool-in-context evaluation + plan-estate consolidation (see the
banner).

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Pelagic Sailing Sextant` | `claude` | `claude-opus-4-8` | `606a0e` | `eef-completion-and-consolidation-planning` | 2026-05-29 | 2026-05-29 |

## Session 2026-05-29 (cont. III) — Goal 2 / D0 COMPLETE: PR #122 merged (Quiet Hiding Hush / `457189`)

**D0 (merge-safety) is done. PR #122 (`feat/graph-foundations` → `main`) MERGED at
`29fc29e4`.** Now on `feat/graph-tooling-tidyup`. This session took D0 from
"committed but unpushed, all owner-gated" to merged, with a full functional proof
the owner explicitly raised the bar to require.

**Landed this session:**

+ **Pushed the D0 bundle** (was 8 ahead of origin — the 7 from cont. II plus the
  handoff commit). Note: the branch had also advanced under the session with the
  parallel routing-sunset commits (`d9225d5b`/`9317cdcd`/`d1525f55`), so the push
  published 11 commits — benign (peer-committed, gate-green).
+ **Fixed the remaining Sonar `new_violation`** — `typescript:S4624` nested
  template literal in `external-data-contract.ts:240` (the validator hardened last
  session). Extracted a `lineSuffix` local; `90714ea5`. → `new_violations` 0.
+ **Lane B hotspot SAFE write** (owner-authorised, explicit per-action): hotspot
  `AZ5rZYbMCv0_1Y1L8PE3` → REVIEWED/SAFE per `sonar-disposition-policy` §S4036.
  → `new_security_hotspots_reviewed` 100% → **SonarCloud QG GREEN**.
+ **Full functional proof (owner-raised bar — necessary, not just QG-green):**
  + *Local, real server* via `prod:harness` (exercises the real
    `env→toBooleanFlag→runtimeConfig` path, not the injected-config e2e path),
    **both flag states**: OFF → 35 tools / 4 prompts, EEF tool+prompt absent, base
    tool executes; ON → 36 / 5, EEF present and the **EEF tool executes** (returns
    a real `structuredContent` subgraph). Plus the e2e suite (133) green.
  + *Preview deployment* (`oak-preview` authed MCP + unauth probes): EEF tool
    absent from the authed tool set, `get-key-stages` executes (200); `/healthz`
    200, OAuth PRM 200, unauth `/mcp` 401, landing page 35/4 no-EEF.
+ **Found + fixed a flag-gating leak the review surfaced** — the public landing
  page (`/`) listed the EEF tool+prompt names+descriptions **even when the flag
  was OFF** (`renderToolsSection`/`renderPromptsSection` iterated the full SDK set
  unconditionally). Fixed via a single-source-of-truth `eef-surface.ts`
  (`EEF_TOOL_NAME`/`EEF_PROMPT_NAME`) consumed by BOTH the MCP registration AND
  the landing page, with `eefEnabled` threaded from `runtimeConfig`. `28bb7ace`;
  in-cycle reviewed (code-expert APPROVED, type-expert SAFE → added `as const`);
  verified live local + deployed preview (OFF 35/4 no-EEF, ON 36/5 EEF shown).
+ **Merge-readiness review** (5-lens workflow → adversarial verify →
  release-readiness synthesis): **GO_WITH_CONDITIONS, zero confirmed blockers**;
  flag-gating provably sealed on the MCP protocol surface. The landing-page leak
  was its one real finding (now fixed); conditions all met.
+ **Deployed-flag confirmation**: owner confirmed `OAK_CURRICULUM_MCP_EEF_ENABLED`
  must be literal `'true'` to enable and is **not set anywhere in Vercel** →
  fail-safe OFF in preview + production.

**Tooling note:** the Vercel MCP plugin has **no env-var tool** (`get_project`
returns no env data) — re-auth does not add one; env-var confirmation is a
dashboard/CLI action, owner-side when the CLI session lacks the team scope.

**Next session = D1** (graph-tool contract ADR) per the banner + plan.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Quiet Hiding Hush` | `claude` | `claude-opus-4-8` | `457189` | `goal-2-d0-completion-functional-proof-landing-gate-fix-and-merge-handoff` | 2026-05-29 | 2026-05-29 |

## Session 2026-05-29 (cont. II) — Goal 2 / D0 gateway review + validator hardening landed (Tempestuous Gliding Thermal / `3e5d88`)

**RESUME HERE for D0.** The D0 gateway review (the last remaining D0 *work*
step) is complete and the one defect it surfaced is fixed and committed.
Everything else remaining is owner-gated.

**Landed this session:**

+ **Gateway review** (via a background workflow + sub-agents): type-expert
  **SOUND** on the Lane A S7763 generator fix; code-expert + security-expert on
  the Lane C4 `*.external-data.ts` validator surfaced a real logic-smuggling
  bypass class.
+ **Lane B (S4036) disposition VERIFIED SAFE** — matches `sonar-disposition-policy`
  §S4036 (all three criteria: agent-tooling site / project-required `git`
  toolchain / dev-CI trust boundary; the second `spawnSync` uses `process.execPath`
  and does not trigger S4036). Hotspot key `AZ5rZYbMCv0_1Y1L8PE3`; ready-to-write
  REVIEWED/SAFE comment text is in the session log. The Sonar write is owner-gated
  AND was **BLOCKED by the auto-mode classifier** ("yes to all" judged too vague
  for a specific external security-disposition write) — needs EXPLICIT per-action
  owner authorisation (or a settings permission rule).
+ **Lane E co-gating integration test PASS** (8/8: OFF→neither tool nor prompt,
  ON→both, base prompts always). Flag is fail-safe — `toBooleanFlag = value ===
  'true'`, so unset/malformed → OFF.
+ **SonarCloud QG** maps 1:1 to the three D0 lanes: `new_violations`=2 (Lane A
  S7763 — `fixtures.ts:155` + `index-documents.ts:10`; fixed → awaits push),
  `new_duplicated_lines_density`=3.9% (Lane C — cpd-excluded → awaits push),
  `new_security_hotspots_reviewed`=0% (Lane B — awaits the SAFE write). The PR's
  SonarCloud check is STALE (scans origin, 7 commits behind). The 4 Copilot
  comments are advisory (`COMMENTED`); each maps to a Lane D fix in the bundle.
+ **Commit `e76b9b7c`** — hardened the `*.external-data.ts` validator from
  "no *exported* logic" to a **file-wide "no runtime logic anywhere"** invariant.
  The cpd-exclusion is file-level, so a namespace, a function nested in the data
  literal, a non-exported helper, a value re-export, an `import = require`, or an
  `export default` could ship duplicable logic past the gate. Now caught by a
  recursive whole-file scan (ambient `declare` blocks excluded — they erase at
  emit). AST classification split into `external-data-logic.ts`; the
  graph-corpus-sdk eslint ignore glob aligned to the sonar cpd glob
  (`**/*.external-data.ts`). Gate-clean (type-check, lint, 766 tests, knip,
  depcruise, real-repo validator OK) + in-cycle reviewed (test-expert
  `toStrictEqual` tightening + code-expert ambient-`declare` exclusion both
  absorbed; the reviewers' `new`/call-expression "gap" was REJECTED with
  grounding — an imported call has no in-file duplicable body, a local one is
  already caught, and catching bare calls would false-positive on
  `Object.freeze({...})`). **Owner-directed strictness**: this deliberately
  REVERSED the validator author's tested *"does not over-reach: nested function
  in data is allowed"* decision — a faithful snapshot is serialisable data, so
  the stricter rule has no false-positive cost on a genuine corpus file (the one
  real `*.external-data.ts` file still passes).

**Branch state:** `feat/graph-foundations` is **7 ahead of origin, NOT pushed.**

**Remaining D0 — fresh session, ALL owner-gated, in order:**

1. **Push the 7 commits** — PRE-AUTHORISED by owner ("yes to all"); held this
   session so the SonarCloud re-scan is watched in a live session. `git push`
   (no force) → re-scan clears `new_violations` (S7763 fixed) +
   `new_duplicated_lines_density` (cpd-exclusion).
2. **Lane B Sonar SAFE write** — needs EXPLICIT per-action owner auth (the
   auto-mode classifier blocks it). `change_security_hotspot_status`
   REVIEWED/SAFE on `AZ5rZYbMCv0_1Y1L8PE3` with the §S4036 comment. Clears
   `new_security_hotspots_reviewed` → **QG green.**
3. **Vercel deployed-env check** — the project Vercel MCP `get_project` does NOT
   expose env-var values; verify `OAK_CURRICULUM_MCP_EEF_ENABLED` unset/`false`
   in preview + production via the Vercel dashboard (or an env-listing path the
   MCP does not currently expose). Strong evidence it is OFF: fail-safe default +
   nothing in-repo sets it `true` + plan documents OFF (`true` is a documented
   FUTURE release step).
4. **Merge PR #122** — HARD owner-gate, only after QG green + flag proven OFF +
   Copilot comments confirmed resolved on push.

Then D1 → … → DX per `graph-tooling-rebuild.plan.md` (bounded; ends D6+DX).

**Full `pnpm check` on a settled tree** remains the standing deferred D0 item —
it cannot run clean while the shared tree carries concurrent agents' uncommitted
WIP, and the mutating gate would touch their files. Commit `e76b9b7c` passed the
full pre-commit hook (91 turbo tasks green), so the D0 source is verified clean.

**Tooling note:** the `comms watch` CLI has a known `routing-legacy-fallback`
runaway defect (floods on legacy-identity events that never dedupe into the
seen-file). Leafy Regrowing Petal owns the permanent fix. Workaround used this
session: a raw-file watcher reading `.agent/state/collaboration/comms/*.json`
directly (`/tmp/tempestuous-comms-watch.sh`).

**Tree note:** concurrent `agentic-engineering-enhancements` agents (Highland
Rising Squall, Shaded Prowling Threshold, Furnace Melting Bellows, coordinator
Prismatic Twinkling Nebula) all closed out clean this session; their
PDR/ADR/skill/memory WIP in the tree is headed for a separate WS-Z gatekeeper
commit — NOT this thread's to land. My continuity writes (this entry, the
experience file) are committed; `repo-continuity.md` + `napkin.md` touches are
left additively in the mingled working tree for that gatekeeper commit.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Tempestuous Gliding Thermal` | `claude` | `claude-opus-4-8` | `3e5d88` | `goal-2-d0-gateway-review-and-validator-hardening` | 2026-05-29 | 2026-05-29 |

## Session 2026-05-29 (cont.) — Goal 2 / D0 Lane C4 validator landed (Wooded Creeping Thicket / `d7d671`)

**Continued Deciduous's D0.** The owner committed the parked D0 bundle (Lanes
A/C/D + plan + PDR README + this thread record) at `c67af4e6`. This session built
and landed the remaining **Lane C4 — the `validate-external-data-files`
repo-validator** (the anti-abuse contract that makes the `*.external-data.ts`
cpd-exclusion safe — it would otherwise be a gate-dodge hole). Committed at
`0d45cf07`, knip follow-up `fc14463d`.

**Architecture (owner-directed placement).** `scripts/` is the deliberate
no-checks zone (excluded from tsconfig/eslint/vitest), so the validator lives in
`agent-tools/src/` — pure AST contract (`external-data/external-data-contract.ts`)
with DI-injected fs discovery (`external-data/external-data-discovery.ts`), both
unit-tested under the standard gate; thin import-safe runner at
`src/bin/validate-external-data-files.ts`; wired into root `repo-validators:check`.
`typescript` moved devDeps→deps (it is a runtime library here, not a build-time
devtool). Contract enforced: a `*.external-data.ts` file MUST export `: unknown`
data, MUST carry a provenance docstring, MUST NOT export logic
(function/class/enum/arrow-const). **Gate-clean:** type-check, lint, 29 tests,
prettier, markdownlint, repo-validators (incl. the new one), knip, depcruise.
In-cycle code-expert + test-expert review absorbed (5 fixes; 2 over-escalations
rejected with grounding — incl. the `.unit`→`.integration` rename, refuted by the
committed `paths.unit.test.ts` precedent + the touches-real-IO doctrine).

**Latent finding (flagged, not fixed):** the existing `scripts/` validators
(`validate-no-stale-script-invocations`, `validate-portability`,
`validate-subagents`, `validate-fitness-vocabulary`) ship `*.unit.test.ts` helper
tests that NEVER run (`scripts/` is excluded from vitest) — mis-placed by the
owner's principle; a separate cleanup (move logic to `src/`).

**Remaining D0 (next session, ordered — all owner-gated or owner-surface):**

1. **Lane B** — PATH hotspot SAFE disposition at
   `agent-tools/src/claude/statusline-identity.ts:112` per `sonar-disposition-policy`
   §S4036 (documented class: agent-tooling + `git` + dev-workstation; NOT a code
   fix — `no-machine-local-paths` forbids absolute-pathing git). Surface to owner
   BEFORE the Sonar `change_security_hotspot_status` REVIEWED/SAFE write.
2. **Lane E** — run the already-existing co-gating integration test
   (`apps/oak-curriculum-mcp-streamable-http/src/handlers-tool-registration.integration.test.ts`
   describe `'EEF feature-flag co-gating'`: OFF→neither, ON→both), THEN verify
   `OAK_CURRICULUM_MCP_EEF_ENABLED` unset/false in preview + production via the
   project Vercel MCP (NOT the CLI). D0 acceptance #2 + #3.
3. **Full gates** (`pnpm check`) — deferred this session (see Deep Consolidation
   note: concurrent uncommitted WIP in the shared tree); my C4 commits are
   gate-clean via the full pre-commit hook + knip + depcruise.
4. **Gateway review** — type-expert on the Lane A S7763 generator change + a final
   code-expert pass over the whole D0 bundle (the C4 validator is already
   in-cycle-reviewed).
5. **Merge PR #122 — HARD OWNER-GATE** — only after the SonarCloud QG is green,
   reviews resolved, and the flag is proven OFF in every deployed environment.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Wooded Creeping Thicket` | `claude` | `claude-opus-4-8` | `d7d671` | `goal-2-d0-lane-c4-validator-implementer` | 2026-05-29 | 2026-05-29 |

## Session 2026-05-29 — Goal 2 / D0 in progress: PR #122 signals + external-data convention (Deciduous Climbing Root / `42226f`)

**Goal 2 / D0 (merge-safety) — PARTIALLY LANDED, uncommitted in the working
tree.** All work is local (nothing pushed/committed); the merge is owner-gated.
Verified the live PR #122 signal set against SonarCloud + GitHub at session open
(matched the plan exactly: 2× S7763, 1 PATH hotspot, 3.9% new-dup, 4 Copilot
comments). **type-check + lint GREEN on the bundle.**

DONE:

+ **Lane A — S7763 (generator-first).** Fixed both emitters:
  `oak-sdk-codegen/code-generation/typegen/search/generate-search-index-docs.ts`
  (IMPORTS template: `AllSubjectSlug` → `export type … from`; kept the
  `ALL_SUBJECTS` value import) and `…/generate-search-fixtures.ts` (the four
  pure re-export types `Search{Lesson,Unit,Sequence}Result` + `SearchMultiScopeBucket`
  → `export type … from`; `*Response` types stay imported+re-exported, used
  in-file). Ran `pnpm sdk-codegen` → regenerated `generated/search/{fixtures,index-documents}.ts`
  verified. No test broken. Sonar confirms post-push.
+ **Lane D — 4 review comments.** `.gitignore` `_temp-*`→`_tmp-*`; PDR-085 README
  `Proposed`→`Accepted` (PDR header verified Accepted); `execution.ts:83` dropped
  `${error.kind}` from the user string (kind still logged at the call site);
  `prompt-schemas.ts` docstring softened (focus is a free-text MCP arg; the tool
  enforces EEF_PRIORITIES).
+ **Lane C (duplication) — reshaped to the EXTERNAL-DATA FILE CONVENTION
  (owner-decided).** The 3.9% dup is entirely in the EEF corpus data file, an
  EXTERNAL EEF snapshot — DRY would destroy source fidelity. Owner authorised a
  filename convention `*.external-data.ts` matched by a cpd-exclusion **pattern**
  (robust to file moves). Done: renamed `eef-toolkit.ts` →
  `eef-toolkit.external-data.ts` + all 6 refs (import; eslint ignore path→pattern
  `src/**/*.external-data.ts`; 4 docstrings; left `types.ts:75` conceptual
  `eef-toolkit.json` ref); added `**/*.external-data.ts` to `sonar.cpd.exclusions`
  in BOTH `sonar-project.properties` + `.sonarcloud.properties`; amended
  `docs/governance/sonar-disposition-policy.md` §Duplications (new class +
  contract).

REMAINING (next session, in order):

1. **Lane C4 — the enforcing validator (ships in D0, owner-decided).** Build
   `agent-tools/scripts/validate-external-data-files.ts` (+ `-helpers.ts` +
   `-helpers.unit.test.ts`), wire into the `repo-validators:check` root script.
   Contract: a `*.external-data.ts` file MUST export `: unknown` data, MUST carry
   a provenance docstring, MUST NOT export logic (function/class/enum). Copy the
   idiom from `agent-tools/scripts/validate-no-stale-script-invocations.ts`.
   Without it the suffix is a gate-dodge hole.
2. **Lane B — PATH hotspot.** Dispose SAFE per `sonar-disposition-policy` §S4036
   (agent-tools + `git` + dev-workstation — exact documented-class match; NOT a
   code fix — `no-machine-local-paths` forbids absolute-pathing git). Apply via
   Sonar `change_security_hotspot_status` REVIEWED/SAFE; comment: "SAFE per Sonar
   Disposition Policy §S4036: agent-tools/src/claude/statusline-identity.ts:112 —
   dev/CI tooling; standard developer toolchain binary; host owns PATH integrity;
   not a production-server runtime." Surface to owner before the Sonar write.
3. **Lane E — flag.** The co-gating test ALREADY EXISTS + is correct
   (`apps/oak-curriculum-mcp-streamable-http/src/handlers-tool-registration.integration.test.ts`
   describe('EEF feature-flag co-gating'): OFF→neither, ON→both, base prompts
   still register). Just run it. THEN verify `OAK_CURRICULUM_MCP_EEF_ENABLED`
   unset/false in preview + production via the project Vercel MCP (NOT the CLI) —
   D0 acceptance #3.
4. **Full gates** — only type-check + lint were run this session. Run build, test,
   markdownlint, format, repo-validators, sdk-codegen (or `pnpm check`).
5. **Gateway review** (code-expert architectural + type-expert on the generator
   change + test-expert on the validator) before merge — task tracked.
6. **Merge PR #122 — OWNER-GATED.** Only after the SonarCloud QG is green (push
   triggers re-scan), reviews resolved, flag proven OFF in every deployed env.
   Merging is the sole hard owner-gate.

**Commit hygiene (concurrent agent in the tree):** `Tempestuous Vaulting Falcon`
(`441c78`, claude-opus-4-8) is concurrently executing the pending-graduations
packet on `agentic-engineering-enhancements` — DISJOINT areas; it explicitly
defers the PDR README index to me. At commit, stage ONLY the D0 files by explicit
pathspec (the two generators + two generated search files; `execution.ts`;
`prompt-schemas.ts`; `.gitignore`; `decision-records/README.md`;
`sonar-disposition-policy.md`; `sonar-project.properties`; `.sonarcloud.properties`;
the renamed `eef-toolkit.external-data.ts` + its 4 importer files + `eslint.config.ts`;
and — when built — the validator + root `package.json` wiring). Do NOT stage
Tempestuous's `claim-liveness-…plan.md`; the shared state
(active-claims/closed-claims/napkin) carries both sessions' writes — handle
additively.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Deciduous Climbing Root` | `claude` | `claude-opus-4-8` | `42226f` | `goal-2-d0-implementer` | 2026-05-29 | 2026-05-29 |

## Session 2026-05-28 (later) — Goal 1 design settled + plan specified (Woodland Swaying Pollen / `073489`)

Goal 1 (fix the plan) completed and owner-ratified. The selection/scoping
strategy is resolved to **membership, full nodes (one axis)** via worked examples
on the real 30-strand corpus — the decisive fact being that the whole corpus
(~21k tokens) sits under the ~25k agent ceiling, so full nodes always fit and
graded "per-hop disclosure" is not a helpful lever. Two owner corrections
reshaped the resolution mid-session: (1) a forced conclusion must be *stated*,
not posed as an A/B menu; (2) the explicit goal is to *remove* the 1a/1b
deferral framing — zero deferral decisions had been made. Both, plus a near-miss
"rank-and-cut" (a list-op), were diagnosed as one root: F's *process* (escape
hatches that dodge the complete build) re-enacted at the design layer — captured
in foundation §9 and the napkin.

Folded in: `graph-tooling-rebuild.plan.md` → SPECIFIED (D0–D6 + DX, each with
(a)/(b)/(c)); foundation §10 resolved, §7 finalised, §9 escape-hatch
anti-pattern added, §11 seed aligned; new
`extending-graph-support-tooling.plan.md` homes rank/explain/compare + future
candidates (indexed in the KG-integration README). assumptions-expert reviewed
the plan (no residual escape hatch; verified fixes folded). Next = Goal 2
(D0 → DX).

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Woodland Swaying Pollen` | `claude` | `claude-opus-4-7` | `073489` | `goal-1-design-settling-plan-author` | 2026-05-28 | 2026-05-28 |

## Session 2026-05-28 — EEF wrong-shape diagnosis + graph-tooling rebuild (Deep Fathoming Harbour / `cef0b8`)

The EEF explore tool (increment F) was completed, three-reviewer-approved, and
committed — then diagnosed (with the owner) as the WRONG SHAPE: list-thinking in
a graph domain (selection/projection/cap hand-rolled around a stubbed graph query
surface). Established the graph-tooling rebuild on a new foundation. Landed on
`feat/graph-foundations`: foundation doc + new plan skeleton + archived old
estate (`d8ce706a`); Nebulous Threading Prism's handed-over curation pass
(`2f1d100e`). Resume via the CURRENT-TRUTH banner above → foundation → plan → Goal 1.

**Continuation pass (2026-05-28, same session):** a strict + LTAE lens pass over
the foundation's six open questions narrowed the open *design* surface to one
seam — the **selection / scoping strategy** (one axis or two: relevance vs
per-hop disclosure depth) — to be resolved by worked examples on the real corpus.
Q4 (client read-behaviour) was RESOLVED via Tidal Drifting Hull's research
(`.agent/research/mcp-client-tool-result-consumption-2026-05-28.md`):
`structuredContent`-only is correct in our standard-MCP-App regime; drop
`oakContextHint`. A "human-via-widget second audience" reframe was raised and
**owner-retracted as invented optionality** — the tool is agent-facing, no UI.
Work is now bounded as Goal 1 (fix the plan) → Goal 2 (implement); see the plan's
"End goal + bounded goals" section.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Deep Fathoming Harbour` | `claude` | `claude-opus-4-7` | `cef0b8` | `eef-graph-tooling-rebuild-foundation-author` | 2026-05-28 | 2026-05-28 |

---

**Last refreshed**: 2026-05-27 (Starless Prowling Mask / `claude` /
claude-opus-4-7 / `13c7d5` — Definition of Delivery doctrine + EEF
delivery-restructure LANDED; the gate-1a whole-graph approach was RETRACTED and
selection restored; next = increments B–H per the meta-plan).

## Session 2026-05-27 (late) — Definition of Delivery + restructure (Starless Prowling Mask / `13c7d5`)

**Landed (`feat/graph-foundations`):** Increment A — Definition of Delivery
doctrine (`27956bb6`: directive `definition-of-delivery.md` + PDR-085 +
indexes); meta-plan into repo + `eef-first-feature` gate-1a contract superseded
(`a60b51ce`); forward restructure retracting false-delivery claims across the
EEF plan estate (`cc3fad3c`); handoff (`8217082a`, refreshed `89ea5ce0`).

**The frame changed:** the gate-1a "whole-graph" approach (flagged below by
Galactic for owner discussion) was RETRACTED. Sub-graph SELECTION (seed
selection + projection in the explore tool, under a 10k output budget) was
always a gate-1a requirement and is restored; the scoring engine + recommend/
explain/compare tools stay gate-1b. PR #121 as-is (whole-graph, no flag, no
co-registered prompt) is NOT mergeable — it is the basis for increment F.

**Resume here (fresh session):** read the handoff
`.agent/state/collaboration/handoffs/2026-05-27-starless-eef-restructure-handoff.md`,
then the owning meta-plan
`.agent/plans/sector-engagement/eef/current/eef-delivery-restructure.plan.md`.
Next = increments B → C → D → E → F → G → H. Branch coordination: doctrine +
plans on `feat/graph-foundations`; EEF code in the `oak-wt-eef` worktree
(`feat/eef-explore-evidence`).

## Session 2026-05-27 — value-PR review + PR #121 open (Galactic Dancing Constellation / `7efeec`)

**Role**: reviewer (peer to Starless Prowling Mask / `13c7d5`, who drove
`oak-wt-eef`). n=2 worktree-per-agent, ARC AnGels coordination channel.

**Landed**: the EEF gate-1a value-PR is **OPEN as PR #121**
(`feat/eef-explore-evidence` → main, 7 commits): type relocation → adapter →
loader/freshness → substrate hardening → `eef-explore-evidence-for-context`
tool + universal-tools wire-up + ADR-123. Each commit reviewed in-cycle; a full
PR-boundary panel (mcp-expert + security-expert + type-expert + test-expert) on
commit 4 returned **SOUND**, all findings verified against the real repo before
relaying (one betty false-positive rejected: `by_phase.impact_months` is
preserved in the open `school_context_relevance` record). Register ledger lives
in the PR #121 body.

**Key design decision (peer-settled, owner-flagged)**: gate-1a returns the
**whole connected EEF graph**; the model selects contextual fit; server-side
narrowing is deferred to the gate-1b t5 ranking engine. Grounded against the
corpus: focus-enum→tag mapping is mostly empty and only 16/30 strands carry a
phase tag, so phase-narrowing would suppress ~14 phase-general strands. Seed
ids exposed via `loadEefCorpus → { view, strandIds }` as removable gate-1a
scaffolding (swaps to `enumerateNodes()` when Inc.3 un-stubs it). Open for owner
discussion — see [`open-questions.md` Q-001](../open-questions.md).

**Next safe step**: owner-gated — (1) the whole-graph semantics discussion
(Q-001); (2) merge PR #121 to main. Named follow-ons in the PR body: F3
`schemaHash`=schema_version (gate-1b refresh-script), telemetry app-wiring.

**Evidence**: PR #121; commits on `feat/eef-explore-evidence`
(`a6e8efc7`..`49317312`); `pnpm check` green (exit 0) at handoff. Adjacent: the
`feat/graph-foundations` rebase-without-force-push divergence was diagnosed and
resolved (owner force-with-lease; trees were byte-identical); `oak-wt-cure`
worktree + merged branch removed; stray `/tmp` worktree pruned.

## Session 2026-05-27 — value-PR coordination state (Foamy Lapping Harbour / `019e68`)

**Session boundary**: owner asked to commit paused agent files and then merge
main. The EEF contribution in this shared tree was documentation and
coordination-state only; source implementation for the value PR remained in
the separate EEF worktree lane.

**Landed**:

+ `544b2f4e` — `docs(eef): record value-pr coordination state`.
+ Captured value-PR coordination artefacts:
  + `eef-value-pr-review-register.md`
  + `eef-value-path-reflection-2026-05-27.md`
  + `please-do-a-deep-mighty-peach.plan.md` corrections
  + comms-method comparison report and README update
  + EEF PR1 sidebar backup and collaboration-state claim closure.

**Evidence**:

+ Full pre-commit hook passed 90/90 turbo tasks for the commit.
+ Later same-session merge of `origin/main` landed at `3c136e9d`; focused
  agent-tools type-check, lint, and tests stayed green after the merge.

**Current state**: EEF remains the active product thread. The value-PR shape is
the owner-approved teacher-value slice: boundary/type relocation, WS4.5
adapter, loader/freshness, and EEF explore tool, with the coordination register
recording review findings and ownership.

**Next safe step**: continue the actual EEF value-PR implementation in the
dedicated EEF worktree/branch lane; use the review register and corrected
`please-do-a-deep-mighty-peach.plan.md` as coordination evidence rather than
reconstructing the plan from older stale 4-PR prose.

**Previous refresh**: 2026-05-23 (Secret Vanishing Wisp / `claude` /
claude-opus-4-7 / `981cbe` first-out closeout-authored; Sparking Melting
Magma / `claude` / claude-opus-4-7 / `4cdb53` committed under owner-directed
overall-closeout-authority handoff at 2026-05-23 06:54Z — first-out
closeout of the 2026-05-22 → 2026-05-23 multi-agent gate-1a substrate-floor
team session; synthesises **19 commits across 6 active agents over ~10
hours**; Round 1+2 substrate floor **effectively complete** — WS4.1 landed
at `3241893d` under Stormbound Spiralling Breeze's owner-directed
ownership-override).

---

## Session 2026-05-25 — PR-0 plan-freshness pass (Stormy Surfing Dock / `2a7b65`)

**Solo session** (no peer collaboration; bootstrap fast-path: no other
agents present in active-claims at session open). PR-0 of the 4-PR
gate-1a closure sequence executed end-to-end and paused for owner
direction per the explicit scope instruction.

**Substantive output**: drift A–I plus the verified `_meta.attribution`
canonical-field corrections applied across three plan files:

+ `.agent/plans/sector-engagement/eef/current/eef-first-feature.plan.md`
  — ff1 → completed (skip per 2026-05-23 owner direction); ff3 → completed
  with PR #114 SHA `77fcf746`; ff4 stays pending but content updated with
  partial-progress record (5 of 7 full + partial breakdown corrected from
  prior 8 + 6 framing); ff6 content corrected (`_meta.attribution`,
  not `_meta.source`); Status/Last-Updated/Branch/Substrate-dep header
  refreshed (branch ref corrected to
  `feat/education-evidence-foundational-graphs-take2`); ADR-157 Proposed
  status caveat added; PR-#108 hard-gate section compressed to one
  historical block citing merge SHAs `2462952a` and `77fcf746`; broken
  ADR-175 + ADR-179 link paths corrected (the actual filenames are
  `175-external-evidence-corpus-freshness-governance.md` and
  `179-transport-agnostic-graph-substrate.md`); pre-existing substrate-leak
  in `types.ts:64-219` documented as Drift I with PR-1 healing pointer.
+ `.agent/plans/connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md`
  — WS4.4 + WS4.5 status: pending → completed with PR #114 SHA in YAML
  comments (verified by directory listing of substrate workspaces).
+ `.agent/memory/operational/threads/eef.next-session.md` — this entry.

**Critical assessment performed before any plan-file edit**: five
concurrent specialist verdicts (architecture-expert-betty + -fred +
-wilma + assumptions-expert + test-expert) reviewed an initial 6-PR
sketch. Key verdicts I verified by direct ADR + corpus-plan read before
absorbing:

+ Fred CRITICAL #1 (loader belongs in `graph-corpus-sdk`) — CONFIRMED
  against ADR-173:50.
+ Fred CRITICAL #2 (freshness vitest insufficient) — PARTIALLY CONFIRMED
  against ADR-175:40-46; the ADR mandates a **plan-promotion gate**, not
  per-PR/per-release CI. Scope softened to: `pnpm freshness:check`
  script + extended unit test + plan-promotion-checklist documentation.
  Scheduled CI workflow is optional excellence, not ADR-mandated.
+ Test-expert `_meta.attribution = EEF_ATTRIBUTION` correction — CONFIRMED
  against corpus plan line 66. Propagated through every plan reference.
+ Assumptions 3-PR compression argument — REJECTED via direct
  architectural-identity test; 4-PR shape (PR-0 freshness + PR-1
  boundary discipline + PR-2 surface + PR-3 closeout) each maps to one
  identity. PR-0 hygiene argument defended on stale-plan risk grounds.
+ Wilma contract-coherence "single best change" — REVISED placement from
  PR-3 closeout to PR-2 cross-cutting reviewer (architecture-expert-betty)
  so mismatch surfaces while PR-2 is still amendable, not after merge.

The full 4-PR delivery sequence with verified ADR citations + critical
assessment is at
`../../../plans/sector-engagement/eef/current/please-do-a-deep-mighty-peach.plan.md`.

**Outstanding state (next-session pickup)**:

+ **PR-0 landed and paused** — owner direction this session was PR-0
  only; subsequent PRs trigger on explicit owner extension or new session.
+ **PR-1 (boundary discipline)** is the immediate next executable unit:
  relocate corpus-substrate types from
  `oak-curriculum-sdk/src/mcp/evidence-corpus/types.ts:64-219` →
  `graph-corpus-sdk/src/eef-strands/types.ts`; add t2 Zod loader in
  `graph-corpus-sdk/src/eef-strands/loader.ts`; add `pnpm freshness:check`
  script + extend `freshness.unit.test.ts` with invalid-date error
  path + document plan-promotion checklist in
  `.agent/plans/sector-engagement/eef/README.md` §Promotion Rule.
+ **PR-2 (MCP feature surface)** sequenced after PR-1:
  Agent A (t6a tool + tests) → Agent B (wire-up: barrel + register +
  ADR-123 amendment + t15 TSDoc) → Agent C (E2E shape conditions). Plus
  the architecture-expert-betty cross-cutting pre-merge contract-coherence
  check against Inc 3 preconditions per
  `.agent/plans/graph-combinatorial-arc.plan.md`.
+ **PR-3 (gate-1a closure ceremony)** sequenced after PR-2: ff5 plan
  answers, ff6 acceptance bundle, plan status syncs, Inc-3 verification
  record transcribed.

**Identity row for this session** (added per PDR-027 additive-identity
rule):

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Stormy Surfing Dock` | `claude` | `claude-opus-4-7` | `2a7b65` | `pr-0-plan-freshness-pass-and-4-pr-delivery-sequence-author` | 2026-05-25 | 2026-05-25 |

---

## Session 2026-05-22 → 2026-05-23 — multi-agent gate-1a substrate-floor team session (first-out closeout: Secret Vanishing Wisp / `981cbe`)

**Substantive progress this session**: Round 1 gate-1a substrate floor for
the EEF first-feature delivery contract is effectively complete; Round 2
substrate (t1 EvidenceCorpus types + WS2.2/WS2.3 graph-ingest primitives +
t14 telemetry seam pattern) also landed.

**Gate-1a Round 1 cycles landed** (9 of 9 — WS4.1 LANDED at `3241893d` under
Stormbound Spiralling Breeze ownership-override after Lunar's silence):

| Cycle | Commit(s) | Owner |
|---|---|---|
| WS4.4 GraphView interface + T7a array-stop smoke-test | `1fc5b491` (substantive, 11 files, 540/-3) + `bf7fa545` (test-partition amendment) + `db5271af` (test-expert post-exec absorb, 3 audit-shape tightenings) | Foamy Fathoming Compass / `ecb459` |
| WS3.3 adjacency primitives status flip (substantive at f4ca84f6 in prior session) | `83179e11` | Foamy Fathoming Compass / `ecb459` |
| PR-108 SonarCloud quality-gate clearance (6-lane fan-out, 24 files) | `51a02a93` | Secret Dimming Shade / `5a6e56` |
| t9 AGGREGATED_EEF_EVIDENCE_GUIDANCE constant (R1 + R7 prose framings) | `acd2a3f3` | Secret Vanishing Wisp / `981cbe` |
| t10 eef-evidence-grounded-lesson-plan prompt (5-step orchestration of t6a) | `a2136557` + `11c05ced` (Sparking-reciprocal-nits absorb) | Secret Vanishing Wisp / `981cbe` |
| t12 citation shape (`citation-shape.ts` Zod tuple non-empty invariants) | (earlier 2026-05-22 via Mistbound + Stormbound) | (prior identity) |
| t13a freshness check function (gate-1a partial; gate-1b refresh-script deferred) | `968e3cb7` (plan-split) + `745fe919` (function + tests) + `8f253280` (TSDoc-forward-ref absorb) | Sparking Melting Magma / `4cdb53` |
| t20 credits attribution (state-flag only — substance pre-existing) | `e1d76c54` | Sparking Melting Magma / `4cdb53` |
| WS4.1 graph-corpus-sdk scaffold (14 files, +311; two code-expert absorptions baked in — `src/index.ts` type re-exports of `GraphView` + `Result<T, E>`, `knip.config.ts` entry removal) | `3241893d` | Stormbound Spiralling Breeze / `b8a5c9` (owner-directed override; Lunar Illuminating Eclipse Co-Authored-By preserved; SVW coordination preserved in commit body) |

**Round 2 substrate cycles landed**:

| Cycle | Commit(s) | Owner |
|---|---|---|
| t1 EvidenceCorpus type substrate + t16-partial public re-export | `7d8f0b0c` + `5ec02aec` (architecture-expert-betty post-exec absorb: subpath relocation) + `9425faa0` (SVW-reciprocal absorb: 3 RankOptions divergences fixed) | Sparking Melting Magma / `4cdb53` |
| WS2.2 jsonld-compatible + Turtle parsers + §invariant-2 contract | `f58bcb80` (scaffold + deps) + `ce0abe26` (substantive, 7 files) + `361cae35` (SVW-reciprocal absorb: literal-object dataset.has() upgrade) | Sparking Melting Magma / `4cdb53` |
| WS2.3 source-path primitives (JsonPointer + quadKey + SourceLocation; 32 tests) | `6cc7b339` + `c03ace9b` (plan-split into primitives + follow-on) | Sparking Melting Magma / `4cdb53` |
| t14 telemetry seam pattern (pure-type module; gate-1a partial) | `72cd93f0` | Sparking Melting Magma / `4cdb53` |

**Coordination commits**: `e1b9561e` (Velvet's 4 markdown files mis-attributed
under Lunar's WS4.1 commit message — the COMMIT_EDITMSG concurrent-write
incident); `a7134f82` (Sparking session-arc napkin capture); `644c937b` (Shade
push-blocker prettier-normalize cure on Sparking's WS2.3+turtle files).

**Reviewer cadence — reciprocal-review pattern empirically validated**:

The team's reciprocal cross-agent post-execution reviewer dispatch (SVW ↔
Sparking, SVW ↔ Foamy) produced **8 substantive defect catches** across this
session (each absorbed cleanly):

+ SVW caught on Sparking cycles (3): t13a TSDoc-filename forward-reference
  (`8f253280`); t1 `RankOptions.context` 3 plan-vs-implementation divergences
  — focus enum 4/6 members + missing `pp_percentage` + `max_results` mis-nested
  (`9425faa0`); WS2.2 jsonld-compatible literal-object quads partial
  C2-deviation (cleaner `dataset.has(quad(..., literal('Ada')))` vs
  manual-iteration predicate-value-only checks) (`361cae35`).
+ Sparking caught on SVW t10 cycle (3): registration tests were schema-audit
  not behavioural (removed; added dispatcher-route-correctness); KS5
  phase-resolution coverage gap (F9 edge-case test); `m.content.text` access
  unguarded (narrowing filter); SHA-pinned TSDoc reference rot risk (replaced
  with stable plan-file path). Absorbed at `11c05ced`.
+ Foamy ↔ SVW (2): Foamy's post-exec on SVW's t9 caught TSDoc line-range
  references that would rot (absorbed in-touch); SVW's reciprocal on Foamy's
  WS4.4 amendment caught WS4.5 `depends_on` array drift + stale `Last Updated`
  header (recorded as targeted follow-up).

**Coordination-pattern surfacings**:

1. **Authorial-bundle integrity 3rd known instance** — at the `e1b9561e`
   misattribution incident: Lunar `cp`'d their WS4.1 commit message to
   `.git/COMMIT_EDITMSG` while Velvet's commit-queue pre-commit hook was
   running; Velvet's hook then read Lunar's message file but committed
   Velvet's pathspec-scoped 4 files. **Cure shape worth a commit-queue CLI
   amendment**: per-intent **line-scoped** staging via patch-mode `git add -p`
   with a recorded patch fingerprint per intent, NOT just file-scoped
   pathspec discipline. Existing pathspec discipline protects file scope
   but not line-level scope within shared files (worked-instance: Sparking's
   `968e3cb7` swept SVW's unstaged t10 plan-file edits along with Sparking's
   t13 amendment — substance correct, attribution wrong). Captured in
   [`pending-graduations.md`](../pending-graduations.md) for graduation
   evaluation.

2. **Cure-1 emergent default across 4 agents** — intent-scoped message
   file path (e.g. `/tmp/<agent>-<cycle>-commit-msg.txt`) passed to
   `commit-queue commit --message-file <path>` rather than the shared
   `.git/COMMIT_EDITMSG`. Adopted by Foamy, SVW, Sparking, and Stormbound
   without coordination — emergent default. **Cure shape**: commit-queue
   CLI should accept `--message-file` with a per-intent default path
   natively (auto-derive `.git/.commit-queue/<intent-id>.msg`). Captured
   for graduation.

3. **Untracked-WIP whole-tree lint-blocker recurring pattern** — three
   instances this session: (a) Foamy's untracked graph-view/index.ts had
   8 lint errors that blocked Sparking's t20 first commit; (b) Sparking's
   untracked freshness.ts had 4 TSDoc errors + 1 type-assertion that
   blocked SVW's t10 first commit; (c) Sparking's untracked WS2.3 turtle
   parser had prettier format issues (Shade landed `644c937b` as a
   peer-format-cure). **Working cure**: directed diagnostic from peer
   with concrete fix shapes (Foamy → Sparking 22:45:56Z; SVW broadcast +
   Sparking self-fix at 22:47Z; Shade pre-empting WS2.3 push at 06:13Z).

4. **Honest-restructure-over-band-aid pattern** confirmed across two
   agents in two cycles: Foamy split graph-view/index.ts into 3 modules
   (architectural-excellence) rather than compress to pass max-lines;
   Sparking deleted the binding test per `no-conditional-tests.md`
   doctrine rather than use a file-existence guard. Both responses came
   from honest reading of the doctrine the quality-gate enforces.

**Outstanding state (next-session pickup)**:

+ **Lunar WS4.1 — RESOLVED at `3241893d`**. Stormbound Spiralling Breeze
  landed Lunar's substance under owner-directed ownership-override at
  06:39Z 2026-05-23 with two pre-execution code-expert absorptions
  baked in (`src/index.ts` placeholder replaced with type re-exports of
  `GraphView` + `Result<T, E>` to make deps knip-visible and declare
  the consumer contract; `knip.config.ts` explicit `entry:` removed
  since knip auto-detects sub-path entries from package.json `exports`).
  Lunar's `355d2ddb` (workspace) + `15465f06` (git:index/head) claims
  closed at the same commit. **WS4.5 (Foamy's natural next cycle —
  EefStrandsGraphView adapter) is now unblocked**.
+ **Sparking parser-integration follow-on** (claim `9c163e1c`,
  `ws2-source-map-parser-integration`) — intent broadcast at 01:08Z
  2026-05-23; never authored. Sparking acknowledged session ceiling
  after 15+ cycles. Clean pickup for any agent: per-quad source-location
  attachment refactor across both WS2.2 parsers (JSON-LD custom walker +
  n3.js StreamParser refactor), atomic landing per test-expert C4.
+ **Stormbound Floating Wing ff5 intent** at 06:14Z — stood down on owner
  cron cancellation immediately after broadcast; ff5 unclaimed.
+ **Critical-path beyond Round 2**: t2-zod-loader (needs WS4.1 substance
  committed for `@oaknational/graph-corpus-sdk` import path stable);
  t6a-explore-tool (needs t2 + WS4.5); ff3 + ff4 + ff5 + ff6 delivery-
  contract items.

**Round 1+2 substrate floor scoreboard**:

```text
WS4.4 ✓ + WS3.3 ✓ + PR-108 ✓ + t9 ✓ + t10 ✓ + t12 ✓ + t13a ✓ + t20 ✓
+ t1 ✓ + WS2.2 ✓ + WS2.3 primitives ✓ + t14 ✓ + WS4.1 ✓ (3241893d)
WS2.3 parser-integration outstanding (Sparking ceiling-stopped)
```

**Reviewer dispatches this session**: SVW dispatched 7 sub-agents (4 pre-exec
t9 + 3 pre-exec t10 + 1 post-exec each on Sparking's t13a, t1, WS2.2);
Sparking dispatched 6+ sub-agents (pre-exec t13a + pre-exec t1 + post-exec
self + pre-exec WS2.2 + post-exec self + pre-exec WS2.3 reviewers); Foamy
dispatched 6 pre-exec on WS4.4 + post-exec on 1fc5b491 + reciprocal on SVW
t9. Sparking ran an architecture-expert-fred cross-cycle audit (GO on
system-level cohesion, ADR-041 + ADR-108 compliant per Sparking napkin entry
at `a7134f82`).

**Identity rows for this session** (added per PDR-027 additive-identity
rule):

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Foamy Fathoming Compass` | `claude` | `claude-opus-4-7` | `ecb459` | `ws4-4-graphview-substantive-author + reciprocal-reviewer` | 2026-05-22 | 2026-05-23 |
| `Lunar Illuminating Eclipse` | `claude` | `claude-opus-4-7` | `326ea7` | `ws4-1-corpus-sdk-scaffold-author + commit-incident-victim` | 2026-05-22 | 2026-05-22 |
| `Velvet Veiling Wisp` | `claude` | `claude-opus-4-7` | `b4bb7a` | `consolidation-curation-3-pass + commit-editmsg-incident-victim` | 2026-05-22 | 2026-05-22 |
| `Secret Dimming Shade` | `claude` | `claude-opus-4-7` | `5a6e56` | `pr-108-sonarcloud-clearance + push-blocker-format-cure` | 2026-05-22 | 2026-05-23 |
| `Secret Vanishing Wisp` | `claude` | `claude-opus-4-7` | `981cbe` | `t9-t10-author + reciprocal-reviewer + first-out-closeout-owner` | 2026-05-22 | 2026-05-23 |
| `Sparking Melting Magma` | `claude` | `claude-opus-4-7` | `4cdb53` | `15-commit-round-1-and-2-cycle-author + reciprocal-reviewer` | 2026-05-22 | 2026-05-23 |
| `Stormbound Floating Wing` | `claude` | `claude-opus-4-7` | `52f264` | `team-start-then-9h-silent-then-return-stand-down` | 2026-05-22 | 2026-05-23 |
| `Stormbound Spiralling Breeze` | `claude` | `claude-opus-4-7` | `b8a5c9` | `team-start-then-silent` | 2026-05-22 | 2026-05-22 |

---

## Session 2026-05-21 — Sequencing pull-forward (Torrid Glowing Flame / `5ab0ec`)

**Last refreshed (prior)**: 2026-05-21 (Torrid Glowing Flame / claude /
claude-opus-4-7-1m / `5ab0ec`) — **Sequencing pull-forward authored
under owner direction. NO product code in this session; planning
amendments only.** The first user-facing EEF MCP feature is now
sequenced at graph-mvp-arc **gate-1a** (a new gate added by the
2026-05-21 split) atop **graph-stack Inc.1d** (new sub-increment: WS4.4
GraphView interface + WS4.5 EEF subgraph+manifest adapter as a
concurrent Inc.1 tenant of `graph-corpus-sdk` alongside the Threads
adapter, per ADR-173 §First-wave ingestion scope 2026-05-21
amendment). The EEF adapter formerly scheduled at Inc.3 is split:
`subgraph` + `manifest` operations land at Inc.1d; the remaining 5
operations (`summary`, `getNode`, `enumerateNodes`, `neighbours`,
`findByTag`) remain at Inc.3 as typed `NotImplementedYet` Result
stubs satisfying the full GraphView interface contract from
day one. The first user-facing tool is **`eef-explore-evidence-for-context`**
(new todo t6a in `eef-evidence-corpus.plan.md`) — a subgraph-shaped
response over EEF strands matching a teacher's seed context
(subject + key_stage + optional focus), wrapped in the structural
citation/caveat/freshness envelope. The first prompt is
`eef-evidence-grounded-lesson-plan` (t10, unchanged). EEF
source-authority status unchanged: the repository-held snapshot
remains the canonical implementation source until EEF clarifies
refresh mechanics. **Gate-1a is the EEF partnership-conversation
opener gate** — contact named, first-contact action recorded with
date + outcome before gate-1a promotes to active. **Non-negotiable
at gate-1a**: full GraphView interface (Inc.1d WS4.4),
DeepKeyPath compile-time discipline (T7a smoke-test), structural
citation envelope (t12 full), ADR-175 freshness CI gate (t13 full
binding), `eef-*` namespace + `_meta` attribution (ADR-157), Sentry
telemetry seam pattern (t14 partial — full pattern, one tool
instrumented). The gate-1b cluster (recommend/explain/compare +
second prompt) ships after graph-stack Inc.3 lands. **Slice 1 still
ships in full**; the split is sequencing only. No scope reduction.
**Predecessor (corrected at handoff close)**: the v0.7.0 upstream-API
cascade CLEARED earlier today via Opalescent Twinkling Supernova's
three commits on `feat/mcp-graph-support-foundation` (`b1afd5bf`
chore(sdk), `5613eee4` refactor(search-cli), `8fcd3200` docs(plans));
my session ran with the cascade already resolved. Graph
implementation work is no longer cascade-blocked. This session's
amendments are planning-only and do not touch SDK codegen output.

> **RETRACTION ANNOTATION (2026-05-27):** The framing above treated the removal of
> sub-graph SELECTION from gate-1a as "sequencing only, not a scope reduction". That
> framing was an UNRATIFIED scope reduction. Per owner direction 2026-05-27,
> sub-graph selection for large graphs (the EEF graph is large) was ALWAYS a
> gate-1a requirement and is RESTORED to gate-1a. The gate-1a contract is now
> owned by `.agent/plans/sector-engagement/eef/current/eef-delivery-restructure.plan.md`,
> rebuilt around the Definition of Delivery directive
> (`.agent/directives/definition-of-delivery.md`). Scope boundary: the
> SCORING/ranking engine and the recommend/explain/compare tools remain gate-1b;
> only the explore tool's seed-SELECTION + projection are restored to gate-1a.
> Current resume state: handoff
> `.agent/state/collaboration/handoffs/2026-05-27-starless-eef-restructure-handoff.md`.

**Prior refresh**: 2026-05-10 (Fragrant Regrowing Root / codex / GPT-5 /
`019e12` — EEF source-authority clarification. The repository-held
`eef-toolkit.json` snapshot is now treated as the canonical implementation
source until EEF clarifies whether refresh should come from a public
download/API endpoint or direct supply. The EEF plan now says not to
reconstruct the corpus from scraped EEF pages and to record the provenance gap
at promotion if EEF has not clarified it. The structural-only evaluation stance
is unchanged: load-bearing acceptance is citation/data/caveat/freshness/
MCP-shape preservation at the tool boundary; LLM paraphrase scoring,
teacher-trust measurement, and SENCO workflow-time measurement remain
follow-on evaluation-infrastructure work outside Vitest.)

**Prior refresh**: 2026-05-08 (Opalescent Shimmering Orbit / codex /
GPT-5 / `019e06` — PR #102 graph decision-complete closeout was pushed as head
`309d9e5e44cebecb1be2478d2fb084a54f39b6b2`; the EEF evaluation stance is
unchanged at handoff. Slice 1 is structural-only for evaluation purposes.
Load-bearing acceptance is citation/data/caveat/freshness/MCP-shape
preservation at the tool boundary; LLM paraphrase scoring, teacher-trust
measurement, and SENCO workflow-time measurement are follow-on
evaluation-infrastructure work outside Vitest. The follow-on now owns the
pre-ACTIVE split decision for teacher-trust and SENCO workflow-time
measurement.)

**Prior refresh**: 2026-04-30 (Vining Whispering Root / claude-code /
claude-opus-4-7-1m / session seed `696765` — drafted the 7×3 T1
tracer matrix into `graph-query-layer.plan.md § Phase 1` with
verification footnotes against real generator output and data files;
ran three review rounds (in-session first-principles, code-expert,
assumptions-expert); applied 6 findings across rounds plus 3
operation-design corrections (drop `find_by_tag` for prerequisite +
misconception under the *stop inventing optionality* doctrine, add
sparse-relations manifest surface, reframe outcome condition);
verified Increment 2 parallel-readiness; assembled the Promotion
Packet for owner sign-off. 17 of 21 tracer cells drafted; 4 NO TRACER
under the ≥2-of-3 rule (`neighbours × misconception`,
`subgraph × misconception`, `find_by_tag × prerequisite`,
`find_by_tag × misconception`). Final MCP tool count: 17, not 21).

---

## Thread Identity

+ **Thread**: `eef`
+ **Thread purpose**: Integrate the EEF Teaching and Learning Toolkit
  as an evidence corpus on Oak's MCP server, on top of a polymorphic
  graph-query foundation that also serves the misconception and
  prerequisite graphs. Five-increment delivery, parallel implementation
  across three graphs, user-value template enforced on every plan task.
+ **Branch**: `feat/eef_exploration` (originating session); execution
  branch TBD when Increment 1 promotes to ACTIVE.

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Iridescent Soaring Planet` | `claude-code` | `claude-opus-4-7-1m` | `b38261` | `architecture-restructure-and-handoff` | 2026-04-30 | 2026-04-30 |
| `Fragrant Sheltering Petal` | `claude-code` | `claude-opus-4-7-1m` | `360064` | `type-expert-round` | 2026-04-30 | 2026-04-30 |
| `Vining Whispering Root` | `claude-code` | `claude-opus-4-7-1m` | `696765` | `tracer-matrix-and-promotion-packet` | 2026-04-30 | 2026-05-01 |
| `Gnarled Fruiting Root` | `claude-code` | `claude-opus-4-7-1m` | `e18e2c` | `cross-ref-path-updates-from-thread-restructure-only` | 2026-05-01 | 2026-05-01 |
| `Windward Darting Horizon` | `cursor` | `claude-opus-4.7` | `dd084d` | `eef-tool-rename-eef-prefix-per-adr-157-and-mvp-arc-cross-ref` | 2026-05-07 | 2026-05-07 |
| `Opalescent Shimmering Orbit` | `codex` | `GPT-5` | `019e06` | `pr-102-eef-structural-eval-closeout` | 2026-05-08 | 2026-05-08 |
| `Fragrant Regrowing Root` | `codex` | `GPT-5` | `019e12` | `eef-source-authority-clarification` | 2026-05-10 | 2026-05-10 |
| `Torrid Glowing Flame` | `claude` | `claude-opus-4-7-1m` | `5ab0ec` | `inc-1d-eef-concurrent-tenant-sequencing-pull-forward-author` | 2026-05-21 | 2026-05-21 |
| `Salty Charting Harbour` | `codex` | `GPT-5` | `019e4e` | `standby-team-join-identity-drift-surfaced` | 2026-05-22 | 2026-05-22 |
| `Mistbound Slipping Night` | `claude` | `claude-opus-4-7` | `a1cb64` | `t12-citation-shape-cycle-author-with-stormbound-commit-handoff` | 2026-05-22 | 2026-05-22 |
| `Stormy Surfing Dock` | `claude` | `claude-opus-4-7` | `2a7b65` | `pr-0-plan-freshness-author+pr-115-watcher+adr-184-amendment` | 2026-05-25 | 2026-05-25 |
| `Fiery Kindling Brazier` | `claude` | `claude-opus-4-7` | `9f4026` | `commit-marshal+pr-115-stewardship+merge-landed` | 2026-05-25 | 2026-05-25 |
| `Foamy Lapping Harbour` | `codex` | `GPT-5` | `019e68` | `value-pr-coordination-state-committer; review-register-and-value-path-reflection-preserved; shared-tree-main-merge-verifier` | 2026-05-27 | 2026-05-27 |
| `Galactic Dancing Constellation` | `claude` | `claude-opus-4-7` | `7efeec` | `eef-value-pr-reviewer (commits 2-4 + hardening; full PR-boundary panel); whole-graph-design-peer; graph-foundations-divergence-diagnosis; worktree-cleanup` | 2026-05-27 | 2026-05-27 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; matching platform/model/agent_name updates
`last_session`.

---

## Landing Target (per PDR-026)

Landed: a coherent five-increment plan estate covering graph foundation
(`graph-query-layer.plan.md`, CURRENT), evidence-corpus extension on
EEF (`eef-evidence-corpus.plan.md`, CURRENT, replaces predecessor),
cross-source journey design (`cross-source-journeys.plan.md`, FUTURE),
plus operational concerns (telemetry, freshness, negative-space) folded
into the appropriate increments. All new plans carry a mandatory
three-line user-value template on every task. Conservation property
verified via independent re-read pass; predecessor preserved in git
history at commit `e2796757`.

Evidence:

+ [eef/README.md](../../../plans/sector-engagement/eef/README.md) — subthread orientation
+ [eef/current/eef-evidence-corpus.plan.md](../../../plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md) — Increment 2 executable plan
+ [eef/reference/conservation-map.md](../../../plans/sector-engagement/eef/reference/conservation-map.md) — semantic preservation map with verification log (§N)
+ `knowledge-graph-integration` graph-query-layer.plan.md (since archived) — Increment 1 foundation
+ [knowledge-graph-integration/future/cross-source-journeys.plan.md](../../../plans/connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md) — Increment 3 design
+ [napkin § 2026-04-30 EEF graph-and-corpus architecture session](../../active/napkin.md) — full session insight
+ [experience/2026-04-30-iridescent-graph-corpus-composition.md](../../../experience/2026-04-30-iridescent-graph-corpus-composition.md) — methodology + reflection

---

## Current State

+ All three plan files (graph-query-layer, eef-evidence-corpus,
  cross-source-journeys) are CURRENT or FUTURE; **none is ACTIVE**.
+ `eef-evidence-corpus.plan.md` now carries the structural-only evaluation
  stance: T19 proves shape/citation/data/caveat preservation at the tool
  boundary; LLM/outcome evaluation is sequenced behind follow-on evaluation
  infrastructure.
+ Predecessor `eef-evidence-mcp-surface.plan.md` deleted from working
  tree; recoverable via `git show e2796757:.agent/plans/exploring-open-education-resources/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md`.
+ The `originals/` snapshot directory was created during the
  restructure for the verification pass and deleted afterwards (see
  conservation map § Recovery path).
+ 25 files in the working tree at session-handoff time; 0 commits
  ahead of main; ready to commit in three sensible chunks (restructure,
  napkin, handoff).
+ Sector-engagement umbrella sees the new subthread:
  `sector-engagement/README.md` documents table includes `eef/` row;
  `external-knowledge-sources/README.md` retains education-skills + KG
  meta-strategy plans only.

---

## Session 2026-05-22 — multi-agent team session under Blustery Lifting Plume coordinator

**Substantive progress this session**: PR-108 quality-gate
advancement — `new_security_hotspots_reviewed` moved 0% → 100%
(12/12 hotspots reviewed: 11×S5332 SAFE in
`packages/core/graph-core/` test files + 1×S4036 SAFE at
`agent-tools/src/bin/agent-tools-cli-topics.ts:96`). CodeQL alert
number 90 dismissed via `gh api PATCH state=dismissed
dismissed_reason="false positive"` (Flamebright Cycle 1 tail
action; criterion 3 pending next CI run). Five mechanical commits
landed on `feat/mcp-graph-support-foundation`:

| Cycle | Commit  | Substance                                                |
| ----- | ------- | -------------------------------------------------------- |
| C1    | 77463a22 | CodeQL #90 TSDoc edit + UI dismissal (Flamebright)       |
| C4.1  | 73ab1624 | Object.hasOwn in agent-tools/src/context-cost/cli-options.ts (Salty) |
| C4.2  | ca28bd83 | RegExp.exec in agent-tools/src/practice-fitness/markdown.ts (Salty) |
| C4.3  | 0c3df45b | Optional-chain in graph-core canonicalize.unit.test.ts (Salty) |
| C4.4  | 604f64b7 | Array.at(-1) in agent-tools/src/practice-fitness/paths.ts (Salty) |

**Substrate-unblock framing**: PR-108 is the merge-blocker for the
EEF gate-1a substrate (graph-stack Inc.1d WS4.4 + WS4.5). This
session moved the PR-108 quality-gate conditions (hotspots cleared,
CodeQL #90 dismissed pending CI, four mechanical issues fixed) but
did **not** advance EEF gate-1a named delivery-contract items
(ff1–ff6). The substrate movement is necessary-but-not-sufficient;
gate-1a remains gated on the named delivery contract.

**Open Q1/Q2/Q3 PDR routing questions still on owner surface**:
Foamy Snorkelling Jetty (planning specialist) raised three
architectural routing questions during PDR-063..066 reviewer-verdict
absorption that remain owner-class decisions:

+ Q1: portability migration surface — how do PDR-063, PDR-065,
  PDR-066 cure their embedded-repo-path defects without losing
  substantive grounding? (Cure-shape decision: abstract substrate
  language vs migrate detail to a non-Practice-Core surface.)
+ Q2: PDR-065 `[DOCTRINE]` tag mechanism — keep, defer, or move to
  PDR-066 Tranche 2 amendment?
+ Q3: PDR-065 `fast_bootstrap_eligible` frontmatter field — keep or
  downgrade to deferred-to-first-instance?

All three remain unanswered at session pause. PDR-064 cured cleanly
in working tree (uncommitted); PDR-063/065/066 cures NOT STARTED.

**Roster outcomes**:

+ Codex side fully cleared: Veiled Cloaking Threshold, Salty
  Charting Harbour, Midnight Veiling Threshold all rotated out via
  team-member closeout broadcasts.
+ Claude side held in pause: Blustery (coordinator), Foamy
  (planning), Flamebright (retired post-Cycle-1/6 prep), Ferny
  (continuing for consolidation pass under owner direction).

**Sonar MCP unblock evidence** (durable; for future sessions): three
substrates demonstrated three distinct unblock paths — (i) Claude
Code `/mcp` reconnect re-attaches the `mcp__sonarqube__` namespace
mid-session (owner-driven); (ii) `docker mcp gateway run --profile
sonarqube_oak` exposes the same tools via shell layer for Codex
sessions (Midnight worked precedent); (iii) `mcp__sonarqube__
mcp-add` is denied by auto-mode classifier as "Self-Modification"
without prior user/inter-agent authorisation. Codex sessions
lacking the `mcp__sonarqube__` namespace should check `docker mcp
tools ls --format json` BEFORE declaring Sonar unavailable.

**Branch-state pickup pointer (2026-05-22 final shape)**: any
session picking up this thread on `feat/mcp-graph-support-foundation`
MUST first read
`feat-mcp-graph-support-foundation-meta.md`
— the top-level meta plan naming every plan currently in force on
the branch, the cross-plan dependency picture, the file-scope
partition (work-structure, not team-structure), current state of
work, entry points for different kinds of work, and the open
owner-class structural questions. **The earlier
`branch-concurrency.md` is retired**: it carried operational drift
(Stream-A-to-F framing read as team-shape; Path 1/2/3 merge
ordering = operational; coordinator-structure heuristics =
operational) that did not match owner direction "describe what
parallel work is possible, not how it is carried out or by whom".
Substantive content survives in the meta plan.

## Session 2026-05-22 (later) — Mistbound Slipping Night t12-citation-shape cycle

**Substantive progress this session**: t12-citation-shape (gate-1a
Round 1, load-bearing for both gate-1a and gate-1b) authored end to
end. Three files reach the staged-and-gate-green state under
Mistbound; commit was handed to Stormbound Kiting Squall per owner
direction at session-end.

Files landed in working tree (staged at handoff, not committed by
Mistbound):

+ `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/citation-shape.ts`
  — `CitationSchema` + `CaveatsSchema` + `CitationsSchema` with
  Zod 4 two-arg `z.tuple([T], T).readonly()` producing readonly
  non-empty tuples via `z.infer`. `z.url()` on `eef_url`.
  Source-attribution field DROPPED per owner direction (Option A):
  envelope `_meta.attribution` carries `EEF_ATTRIBUTION` once per
  response.
+ `.../citation-shape.unit.test.ts` — 17 tests; `satisfies Citation`
  on fixtures; `safeParse` + `result.success`; `it.each` over
  literal `keyof Citation` array for parametrised missing-field
  rejection. No pure type-only tests (per `test-immediate-fails.md`
  item 19).
+ `.agent/plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md`
  — §Phase F amendment dropping `source` from `Citation`;
  frontmatter t12 todo flipped `status: pending` → `completed`.

**Reviewer cadence absorbed**:

+ Pre-execution code-expert: CHANGES REQUESTED — surfaced the
  source-field duplication risk against `EEF_ATTRIBUTION` constant;
  Zod 4 tuple/min(1) tension; `@ts-expect-error` convention. Owner
  resolved source-field → Option A (drop).
+ Pre-execution type-expert: `z.tuple([T], T).readonly()` Zod 4
  two-arg form; `z.url()` not `z.string().url()`; SSoT via `z.infer`.
+ Pre-execution test-expert: no pure type-only tests; `satisfies` +
  `safeParse` + `it.each` over literal dataset.
+ Post-execution code-expert: CLEAR; all architectural commitments
  honoured.

**Local gate state at handoff**: lint clean (after
`pnpm --filter @oaknational/eslint-plugin-standards build &&
pnpm --filter @oaknational/sdk-codegen build &&
pnpm --filter @oaknational/result --filter @oaknational/type-helpers build`
sequence); type-check clean; vitest 17/17 pass; full
`pnpm turbo run type-check lint test` 87/87 successful.

**Commit handoff to Stormbound**: directed comms-event
`0f03f45c-a225-4d55-bb15-2e5c44abb678` at 15:42Z carries all
substance: intent_id `131fe2a9` already verify-staged with
fingerprint `35a29ef5...`; message file at
`/tmp/mistbound-t12-commit-message.txt`; three options for landing
(take over intent, open own intent with same files, Path-B
selective `git commit --`). Acknowledged Stormbound's graceful
abandonment of `cf39fd43` (the queue-collision worked instance).

**Claim disposition**: zero Mistbound claims active at handoff. Three
closed: `c847fffc` (stale ff2, absorbed by sweep), `f013f95d`
(t12 main, handed), `59eabaea` (t12 supplementary plan amendment,
handed).

**Workspace-bootstrap blocker surfaced** (pending-graduations
candidate): consumer-workspace lint, type-check, and test commands
fail at config-load time on a fresh checkout because producer
workspaces (`@oaknational/eslint-plugin-standards`,
`@oaknational/sdk-codegen` subpath exports, `@oaknational/result`,
`@oaknational/type-helpers`) ship no `dist/` until explicitly built.
Implicit build-order graph is invisible to new agents. Possible
cures: `pnpm bootstrap` script, `development` exports condition
resolving to `src/`, or precondition in onboarding docs.

**EEF gate-1a progress**: ff2 RESOLVED in prior cycle (this session
inherited the post-resolution state via sweeps `03da8e3d` /
`2cda69a2`). t12-citation-shape RESOLVED this session (subject to
Stormbound's commit). Remaining gate-1a items: ff1 (partnership
opener — owner direction is skip; EEF already aware),
ff3 (substrate floor tracking — WS4.4 + WS4.5 in graph-stack plan),
ff4 (corpus todos tracking — t1, t2, t6a, t9, t10, t13, t20 +
partials), ff5 (shape-understanding evidence — depends on t6a draft),
ff6 (acceptance bundle — terminal). Round 1 parallel-safe cycles
remaining: t9, t13, t20, WS4.4.

**Last refreshed**: 2026-05-22 (later) — Mistbound Slipping Night /
claude / claude-opus-4-7 / `a1cb64`. Topology: peer-primary with
Stormbound Kiting Squall (`ddbea2`) as the commit-window picker-up.

---

## Session 2026-05-22 — Blustery Lifting Plume coordinator (earlier)

**Last refreshed**: 2026-05-22 — Blustery Lifting Plume / claude /
claude-opus-4-7 / `d4aad7` (full-session coordinator) + team
(Flamebright / Foamy / Ferny / Veiled / Salty / Midnight).
Consolidation pass executed under Ferny by coordinator routing
event `09:35:57Z`; branch-concurrency manifest landed by Ferny at
commit `c8860a0f` under owner direction "update all relevant plans
and continuity surfaces to make the parallel work explicit"; the
manifest was subsequently superseded by the meta plan
`feat-mcp-graph-support-foundation-meta.md` after owner refined the
criterion ("describe what highly parallel work is possible, not how
it is carried out or by whom"). Final closeout this session: team
dissolved (last team member Blustery); meta plan landed; three plan
amendments (`pr-108-snagging.plan.md`, `eef-first-feature.plan.md`,
`graph-stack.plan.md`) tightened to cross-reference the meta plan
and drop operational framing; the four PDR drafts
(`PDR-063..066`) preserved on the branch as committed artefacts
under this closeout, with PDR-064 cures landed and PDR-063/065/066
cures paused mid-work awaiting owner Q1/Q2/Q3 routing. Knowledge-
graduation backlog expanded to 6 candidates (added: planning
documents describe work-structure, not operational/team approach
— owner-stated criterion).

---

## Promotion Triggers and Sequencing

The five-increment delivery sequence with explicit promotion gates:

1. **Increment 1** (graph-query-layer) → ACTIVE when:
   + Owner has approved architecture session conclusions ✓ (done this session).
   + T1 (tracer use cases — 21 minimum, 7 ops × 3 graphs) signed off.
   + Plan-body first-principles check applied to tracer shapes against
     actual data files.
   + EEF corpus plan (Increment 2) ready for parallel start.
2. **Increment 2** (eef-evidence-corpus) → ACTIVE when:
   + Increment 1 reached ACTIVE.
   + EEF provenance/refresh check performed with EEF or Oak's EEF contact. If
     unresolved, promotion notes must explicitly record that the checked-in
     JSON remains the definitive implementation source pending clarification.
   + Conservation map signed off by owner.
   + Plan-body first-principles check applied to citation type, corpus
     operations, test shapes.
3. **Increment 3** (cross-source-journeys) → CURRENT when:
   + Increments 1 and 2 both reached ACTIVE.
   + GraphView adapters exist for misconception and prerequisite (T3,
     T4 of graph-query-layer plan).
   + Real teacher question identifies that prompt-only orchestration
     is insufficient (the load-bearing observation the journeys plan
     waits on).
4. **Increment 4** (telemetry/freshness/provenance) — does not have a
   separate plan. EEF-specific work lives in Increment 2 (T13–T15);
   graph-layer telemetry lives in Increment 1 (T8).
5. **Increment 5** (school-context overlay) — deferred. Gated on
   multi-tenant identity work outside this thread.

**Escape hatch**: if Increment 1 slips, the EEF corpus plan can
prototype against an in-line `GraphView` stub and refactor onto the
real interface when it lands. See Increment 2 § Risks.

---

## Type-Expert Round Outcome (2026-04-30, Fragrant Sheltering Petal)

**Status**: type-expert round complete. Verdict: AT-RISK with concrete
remediations applied. Of 11 findings:

+ **Bucket (a) principles-decided** — applied: Result<T, E> on fallible
  GraphView ops; non-empty tuple `caveats: readonly [string, ...string[]]`;
  non-empty tuple `citations: readonly [Citation, ...Citation[]]`;
  `ComparisonDimension` literal union (no `string[]` widening).
+ **Bucket (b) reviewer-recommendation** — applied: DeepKeyPath
  array-stop constraint named in T2; T7a compile-time smoke-test added;
  `ExplainOptions` clarified TNode-independent (sketched); `NodeFilter<TNode>`
  and `RankOptions<TNode>` sketched in plans to prevent implementor drift;
  T19 claim corrected to match actual structural enforcement;
  `meta.last_updated` and `meta.data_version` Zod precision tightened
  (`z.string().date()` and semver regex); journey citation propagation
  type note added to T4.
+ **Bucket (c) resolved by reading the data, not by escalation:**
  `school_context_schema` in `eef-toolkit.json` is itself a JSON Schema
  document with a known closed shape — 9 named properties
  (phase, key_stage, school_type, pupil_premium, send_percentage,
  ofsted_grade, attainment, workforce, priorities), each a standard
  JSON Schema property descriptor. The predecessor's
  `Record<string, unknown>` carve-out was over-conservative; removed.
  Plan T2 now types this as a concrete `SchoolContextSchema` interface
  with a recursive `JsonSchemaProperty` shape; F2/F3 marked as
  *revised*, not preserved verbatim. Owner correction (2026-04-30):
  asking the owner to choose between "open" and "closed" when the
  answer was in a file in the repo is the same optionality-invention
  anti-pattern from last session, applied to a fact-check rather than
  a design call. Fourth instance; graduation candidate has now
  ripened.

Promotion gate update: T1 + T2 of `graph-query-layer.plan.md` and T1,
T2, T5, T8, T12 of `eef-evidence-corpus.plan.md` are now type-design-
clear. Increment 1's "T1 + plan-body first-principles check" gate is
closer to satisfied; the `pnpm sdk-codegen` round-trip is the next
structural verification.

## First Task of Next Session

**Owner: review the Promotion Packet (below) and approve / amend / reject promotion of Increment 1 (`graph-query-layer.plan.md`) to ACTIVE.**

Gates 2 and 3 of the promotion-gate set were satisfied in this
session (Vining Whispering Root, 2026-04-30): the plan-body
first-principles check ran against real data and surfaced 4
findings (all applied to the plan body), and the EEF corpus plan
(Increment 2) was verified parallel-ready. Gate 1 (T1 tracer
sign-off) is now ready for owner review — the 7×3 matrix is drafted
inline in `graph-query-layer.plan.md § Phase 1 § T1 Tracer Matrix`
with verification footnotes.

If the owner approves promotion, the natural next move is the
`pnpm sdk-codegen` round-trip — the round-trip is the next
structural verification that the type designs work in actual SDK
code, not just plan-body sketches.

**Out-of-band next-session candidate** (resolved 2026-05-10):
*stop inventing optionality* graduated to PDR-058 (three-tier
optionality decomposition). The `.agent/rules/apply-dont-ask.md`
rule shape was rejected; the substance now lives at PDR-058 (with
PDR-057 covering the empirical-answerability surface). No EEF
follow-up action.

---

## Promotion Packet (Vining Whispering Root, 2026-04-30)

### What the packet contains

A concrete, owner-reviewable bundle of the work done this session
to satisfy the three remaining promotion-gate conditions for
Increment 1.

### Gate 1 — T1 tracer use cases

Status: **drafted, awaiting owner sign-off.**

Result after two review rounds: **17 of 21 tracer cells drafted**
(7 operations × 3 graphs), **4 cells explicitly marked NO TRACER**
under the ≥2-of-3 rule:

+ `neighbours × misconception` — no edges in current `MisconceptionGraph` data (round-1 finding).
+ `subgraph × misconception` — same root cause (round-1 finding).
+ `find_by_tag × prerequisite` — no tag taxonomy in source data (round-2 finding from assumptions-expert); the synthetic-compound `${subject}-${keyStage}` proxy initially drafted was the *invented optionality* anti-pattern. Agents wanting subject+keyStage filtering use `enumerate_nodes`.
+ `find_by_tag × misconception` — same root cause (round-2 finding).

Final MCP tool count: **17**, not 21. Per-graph: prerequisite 6 +
misconception 4 + eef-strands 7. The four carve-outs are explicit in
the plan body and in T6 (registration code names each and links back
to the NO TRACER cell, so the absence is visible to a future
contributor).

Each of the 19 tracers carries:

+ A concrete teacher question.
+ An expected response shape grounded in the actual data structure.
+ A token budget at default projection.
+ A boundary check (drops to graph mechanics, not corpus scoring).
+ A verification footnote (`Verified against: <file> + <field path>`).

Inline location: `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md § Phase 1 § T1 Tracer Matrix`.

### Gate 2 — Plan-body first-principles check

Status: **complete.**

Each tracer was drafted with the actual generator-source or data file
open. Initial pass surfaced four findings; a code-expert round
(2026-04-30) caught two more genuine data-shape gaps that the initial
pass had missed. All six findings have been applied to the plan body
in this session:

1. **MisconceptionNode lacks an explicit ID field** — `MisconceptionGraphView`
   adapter (T4) must mint stable IDs. Recommended scheme: SHA-1 of
   `${lessonSlug}::${misconception}` truncated to 12 hex characters.
   Index-based alternatives are NOT viable (upstream extractor
   ordering not guaranteed). Recorded inline in T4 and in Phase B
   findings.
2. **Citation contract uses `strand_id`; data field is `id`** — the
   `id → strand_id` rename happens at the corpus boundary
   (Increment 2 § T2 loader), not inside the graph adapter.
3. **`NodeFilter.FieldPredicate` did not cover array-element membership** —
   added the array arm:
   `TFieldValue extends readonly (infer U)[] ? { readonly contains: U } : never`.
   Required by `enumerate_nodes × eef-strands` (the
   `tags: { contains: 'primary' }` tracer). Plan body T2 spec updated.
   Includes a "Semantic collision note" naming the structural-vs-
   semantic identity with the string-arm `contains`.
4. **MisconceptionGraph has no edges** — the two NO TRACER carve-outs
   above. T4 adapter description updated to reflect "5 of 7 operations".
5. **`related_strands` is absent on 13 of 30 EEF strands** (caught by
   reviewer round). The field is missing entirely on a named list of
   13 strands — not empty arrays. T5 adapter, `neighbours × eef-strands`
   tracer, and `subgraph × eef-strands` tracer all updated to name
   the optionality and the well-defined behaviour for absent strands.
   Increment 2 § T2 Zod loader must accept `related_strands` as
   optional with default `[]`.
6. **`related_guidance_reports` is `{title, url}` objects, not bare URLs**
   (caught by reviewer round). Field present on only 7 of 30 strands;
   each entry is an object. T5 adapter description updated:
   adapter extracts `url` as edge target ID, preserves `title` in
   edge metadata. Zod loader shape:
   `z.array(z.object({title: z.string(), url: z.string().url()})).optional()`.

Two additional plan-body corrections were applied while verifying
the existing T3/T4 adapter descriptions against real data:

+ T3 PrerequisiteGraphView previously named edge types `prerequisite_of`,
  `succeeds`. Real data: single edge type `prerequisiteFor` with a
  `source: 'thread' | 'priorKnowledge'` discriminator. Corrected.
+ T4 MisconceptionGraphView previously named edge types
  `related_misconception`, `addressed_by_lesson`. Real data: no edges
  at all. Corrected (with carve-outs).

### Gate 3 — Increment 2 parallel-readiness

Status: **complete — PASS on all four checks.**

Verified against `.agent/plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md`:

1. ✓ Status `current`; `parent_plan` and all four `sibling_plans`
   references resolve to existing files.
2. ✓ T1, T2, T5, T8, T12 are in their post-type-expert form
   (`EvidenceCorpus` wrapping shape with `Result<T, E>`; precise Zod
   for `last_updated` and `data_version`; non-empty tuple types on
   `caveats` and `citations`; `ComparisonDimension` literal union;
   citation discipline at compile time + runtime).
3. ✓ `EvidenceCorpus<TNode, TEdgeType extends string>` matches the
   `GraphView<TNode, TEdgeType extends string>` signature exactly.
   The corpus plan does not assume a `GraphView` shape this plan
   does not provide.
4. ✓ No new blocking ambiguities; the four Phase B findings above
   feed forward into Increment 2 cleanly (findings #2 and #3 are
   already accommodated; finding #1 is a T4 design point that does
   not block Increment 2; finding #4 is the carve-out that is
   already explicit in T6).

### Plan-body diff summary (since type-expert round)

Modifications to `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md`
this session, across two review rounds:

+ Added § Phase 1 § T1 Tracer Matrix subsection (17 tracers + 4 NO TRACER cells + 6 Phase B findings + matrix summary).
+ Extended `FieldPredicate<TFieldValue>` with the array-element `contains` arm (T2 spec) plus the "Semantic collision note" that names the string-vs-array structural identity for `{ contains }`.
+ Corrected T3 PrerequisiteGraphView edge-type description (`prerequisiteFor` only, with `source` discriminator); marked `find_by_tag` as not registered (no tag taxonomy in source data) — implements 6 of 7 operations.
+ Rewrote T4 MisconceptionGraphView description: 4-of-7 operations (no edges, no tag taxonomy), mints stable IDs (SHA-1-based; index-based forms ruled out).
+ Rewrote T5 EefStrandsGraphView description with concrete tag/edge counts, the `id → strand_id` rename note, the optionality of `related_strands` (absent on 13 of 30) and `related_guidance_reports` (absent on 23 of 30, present as `{title, url}` objects). Added a "Sparse-relations surface" subsection: `manifest()` and `summary()` expose `strands_without_relations: readonly string[]` to front-load the empty-edge knowledge.
+ Updated `manifest × eef-strands`, `neighbours × eef-strands`, and `subgraph × eef-strands` tracers to name the absent-field behaviour and the new manifest field.
+ Updated T6 description: 17 MCP tools (not 21), with the four carve-outs explicit.
+ Replaced Risk #5 ("tag-search semantics drift" mitigation) with a structural resolution: `find_by_tag` no longer ships for prerequisite or misconception, so the docstring-as-correction-of-surface-lie pattern is gone.
+ Updated Size Estimate table: 17 tools, ~1605 lines total.
+ Updated Exit Criteria § Shape conditions #1 to read "17 MCP tools".
+ **Reframed Exit Criteria § Outcome conditions** from a "ratio ≥50% in 4 weeks" gate (sampling-noise-dominated at expected launch volumes) to a composite "adoption evidence" gate with three branches (≥10 distinct sessions / ≥1 downstream consumer composing without special-casing / honest analysis).

`eef-evidence-corpus.plan.md` is unchanged this session (Phase C verified
no drift). However, the round-2 findings have a forward-impact for
Increment 2: the Zod loader (T2 in that plan) must accept `related_strands`
as optional and `related_guidance_reports` as `z.array(z.object({title, url})).optional()`,
not bare strings. This is recorded here for the next execution
session; the corpus plan body itself does not need editing because
its T2 already says "Zod-validated loader for eef-toolkit.json"
without specifying these field shapes.

### Explicit ask

**Approve promotion of Increment 1 (`graph-query-layer.plan.md`) to ACTIVE?**

+ **YES** → the plan moves from `current/` to `active/`; the next
  execution session begins with the `pnpm sdk-codegen` round-trip
  (verifying the type designs translate to working SDK code).
+ **AMEND** → name the gap; the plan is updated and the packet is
  re-presented.
+ **NO** → name the blocker; the plan stays CURRENT and the blocker
  becomes a new pre-promotion task.

No menu of alternative shapes is offered; the doctrine is to apply
the gate, not to invent optionality around it.

## Previous First Task (resolved)

**Run the type-expert over the current plan estate** — code-expert
explicitly recommended this in its session-close report; the
NodeProjection deep-path types and the EvidenceCorpus wrapping shape
are the load-bearing review questions. Owner direction (2026-04-30):
"this isn't something that needs my intervention, the code reviewer
suggested type reviewer follow up, stop inventing optionality and do
it." **Status**: complete (this session, see Type-Expert Round Outcome
above).

Brief the type-expert with:

+ Branch: `feat/eef_exploration` at HEAD.
+ Primary files: `graph-query-layer.plan.md` (NodeProjection recursive
  deep-path type with depth bound 4; the seven-operation interface),
  `eef-evidence-corpus.plan.md` (EvidenceCorpus wrapping a GraphView,
  Citation type as structural invariant).
+ Specific questions for the reviewer:
  1. Does the recursive `DeepKeyPath<TNode, Depth extends number = 4>`
     shape produce useful inference at depth 4 for `EefStrand` (the
     deepest node type), or does it hit instantiation limits earlier?
  2. Does the `EvidenceCorpus { readonly view: GraphView<...>; rank;
     explain; compare }` wrapping shape preserve the corpus/graph
     boundary at every call site (consumers must go through
     `corpus.view.*` for graph ops)?
  3. Is the `Citation` type non-emptiness enforceable at compile time
     via the response-type signature, or does runtime Zod-validation
     have to carry the load?

---

## Resolved Owner Decisions (this session-close)

All twelve open questions surfaced after the docs+code review have
been settled by owner direction on 2026-04-30:

1. **NodeProjection** → recursive deep paths, depth bound 4. Strict,
   everywhere always.
2. **EvidenceCorpus** → wrapping (`{ readonly view: GraphView<...>; ... }`),
   not extends. Architectural evidence over surface ergonomics.
3. **T2 data-shape unit-test contract** → REMOVED. Brittle, asserts
   implementation not behaviour, provides no real value. Loader test
   proves only that real EEF data parses without throwing. Framework
   "surfaces all nodes" question answered by fixture-based behaviour
   tests, not exact-count assertions.
4. **T19 LLM-graded outcome conditions** → REMOVED. Worth measuring,
   but no appropriate infrastructure exists; shoehorning into Vitest
   is not the answer. Structural citation type (T12) is what we ship
   and prove. LLM-paraphrasing verification is honestly out of scope
   until evaluation infrastructure exists.
5. (covered by 3) — Exact counts are brittle and provide no value.
6. **ADR-157** → demoted to **Proposed** status with status-amendment
   note; this work explores the space but is not constrained by it.
7. **User-value template** → reframed as a sense-check, not a
   ceremony. Applied where value or architectural assumption is
   non-obvious; omitted on wiring/credits/registration. The point is
   sense-checking that we are building useful things, not ticking
   boxes.
8. **Outcome operationalisation (named rubric/owner/cadence)** →
   REMOVED. Speculative fantasy without infrastructure to back it.
9. **Type-expert escalation** → first task of next session (see
   above).
10. **Parent plan child_plans drift** → fixed in this session.
11. **Refresh script location** → relocated to SDK workspace.
12. **Edge type rename** → `cites_guidance_report` →
    `related_guidance_report` (matches data field).

---

## Doctrine Candidates Pending Graduation

See napkin § "Doctrine candidates surfaced — explicit graduation queue"
for the full list with triggers and candidate homes. Items cover:

1. User-value sense-check template (now reframed; not "mandatory" — a
   sense-check applied where value is non-obvious)
2. Outcome-criteria gap (repo-wide) — note: separate concern from
   "fantasy-infrastructure outcome conditions in plans without
   evaluation infrastructure"; the gap is real, the fix is not
   prescribing rubrics/owners we cannot deliver
3. Progressive disclosure
4. Parallel-tracer-implementations
5. Conservation-requires-a-mind
6. Five artefact families per substantial restructure
7. Conservation-map verification pass mandatory before originals deletion
8. Two orders of plan architecture (data-tool-resource-prompt vs graph-corpus-journey)
9. Bias-toward-action in option presentation (second instance — could
   graduate now)
10. **NEW (this session-close)**: *Stop inventing optionality.* When
    a reviewer or principle has already named the right path, the
    next move is to apply it, not to wrap it as a question. Owner
    flagged this as the meta-pattern under several of the 12 questions.
11. **NEW**: *Don't shoehorn a value-claim into infrastructure that
    can't carry it.* If the right way to verify something doesn't
    exist yet, the honest plan says so and ships the structural
    enforcement that does exist; it does not invent a brittle test
    or a fantasy operational protocol to fill the gap.

---

## Risks Worth Flagging to Next Session

1. **Snapshot staleness creep**: `eef-toolkit.json` is 28 days old at
   handoff. EEF Toolkit updates ~2x/year. Refresh check is a
   precondition for promoting Increment 2 to ACTIVE.
2. **Three-graph protection erosion**: if Increment 1's tracer use
   cases turn out to have only 1-of-3 coverage for some operations,
   those operations should be dropped, not added speculatively. T1 is
   gating for a reason.
3. **Polymorphism through router tool**: the urge to ship one
   `query-graph` tool with a discriminator instead of 7 specific
   tools per graph (21 total). Resisted in plan body; surface in code
   review if it returns.
4. **Citation enforcement misfire on prompt outputs**: structural
   citation discipline is on tool calls, not LLM prose. The plan no
   longer claims to verify LLM behaviour; that's honestly out of
   scope until evaluation infrastructure exists.
5. **User-value sense-check becoming rote**: at consolidation, sample
   5 sense-check lines and ask "is this falsifiable? does it name a
   teacher action?" If not, push back. Without that discipline the
   sense-check is decorative.

---

## Cross-Plan and Cross-Thread Links

+ **Parent (sector-engagement)**: [`sector-engagement.next-session.md`](sector-engagement.next-session.md)
+ **Parent (KG-integration coordinator)**: `open-education-knowledge-surfaces.plan.md` (since archived) — this subthread owns its WS-3 (now restructured into Increments 1+2+3).
+ **Authoritative ADR**: [ADR-157](../../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
+ **Strategic brief**: [`evidence-integration-strategy.md`](../../../plans/sector-engagement/eef/future/evidence-integration-strategy.md) — R1–R8 source.
