---
name: "Graph Tools Value Redesign (unified)"
overview: "ONE plan owning the value-driven redesign of the whole-corpus Oak MCP graph tools (misconception, prior-knowledge, thread-progressions) onto the graph-corpus-sdk substrate as bounded anchored retrieval, plus the adjacent MCP surface-quality deliverables and the owner-shaped bounded-keywords addition. Restructured 2026-06-09 (owner-directed): the plan is subdivided into independent PR-shaped deliverables along the real seams — solution-class, dependency, surface-cohesion, decision-vs-delivery — not the earlier surface/graph two-way split. Mechanism decisions A/B/D/E/F, the identity model, and the substrate question are SETTLED (R1-reviewed, evidence in the 2026-06-09 seam-analysis report). Single upstream of the EEF re-validation gate. Each deliverable is one small, independently-shippable PR (hard constraint; no mega-PRs)."
plan_id: graph-tools-value-redesign
type: executable
status: current
graph_layer: oak-graph-surface
thread: eef
date: 2026-06-04
last_restructured: 2026-06-09
isProject: false
related:
  - "graph-estate-consolidation.plan.md (authority: §Judgement calls, call 4)"
  - "../../../../reports/graph-tools-readiness-seam-analysis-2026-06-09.md (the settle evidence: seam map, data grounding, R1 verdicts)"
  - "../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md (D4–D6 mechanism co-design; D7 value gate)"
  - "../../../sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md (binding §Resolved Sequencing contract; owns ALL MCP outputSchema work)"
  - "../../../sector-engagement/eef/current/eef-revalidate-on-new-graph-tools.plan.md (downstream gate; this plan is its single upstream)"
  - "../future/oak-misconceptions-graph-features.plan.md (boundary: §1 bounded retrieval folded into this redesign's core)"
todos:
  - id: settle-mechanism-at-promotion
    content: "Settle mechanism decisions A/B/D/E against landed code, with architecture review. COMPLETED 2026-06-09: A (emit-from-data types per ADR-031; anchor input types by domain size), B (option (a) — graph-corpus-sdk imports @oaknational/sdk-codegen via a new ./graph-corpus single-level subpath; no circular edge, ESLint boundary already permits), D (projection module, confirmed), E (G1 prior-knowledge → G2 misconception → G3 thread-progressions), F (graph-resource-factory deleted at G3; importer set re-verified at execution). R1 (barney/fred/betty) unanimous; findings adjudicated first-hand. Evidence: seam-analysis report §4 + §R1."
    status: completed
  - id: define-heterogeneous-node-edge-model
    content: "Define the one bulk curriculum graph's heterogeneous node/edge model. COMPLETED 2026-06-09: kind-qualified deterministic ids minted at vocab-gen, materialised as an explicit `id` field on every emitted node (never a nodeId-extractor convention); placement-as-edge; typed edges re-projected from the one bulk source; views are per-view GraphView constructions over the one corpus (construction-time edge selection — NO substrate extension; the earlier 'required edgeTypes? extension' claim is corrected); thread-progressions is an ordered corpus projection (own real operation). Misconception mint-rule stability (content-hash vs ordinal) is a named G2 design item. Evidence: seam-analysis report §1.2–§1.3, §4.7."
    status: completed
  - id: s1-doc-resources-single-source
    content: "COMPLETED 2026-06-10: PR #152 merged (c2aa4791; commits 529786df + 89536435). Both duplicate doc resources removed, getting-started Tips reference the model, A5 invariant live-proven, drift-guard green; code-expert + mcp-expert approved; Copilot comments adjudicated first-hand (deprecation-stub cure refuted per replace-dont-bridge). Removed-URI reads return -32602 — see §Protocol notes. — S1 (one PR): doc-resources single-sourcing under the curriculum://model-is-canonical principle. Remove docs://oak/tools.md (triplicates tools/list + model toolCategories); remove or fold docs://oak/workflows.md (verbatim duplicate; its track-progression workflow goes stale when tools are bounded); de-duplicate getting-started's Tips block (reference model, do not copy). A5 invariant: curriculum://model and eef://interpretation are untouched and unbroken (drift-guard test green). Independent of Track G."
    status: completed
  - id: s2-prompt-language-pass
    content: "COMPLETED 2026-06-10: PR #155 merged (commit b057ce89). B2 repaired better than hypothesised — the search tool's lessons-scope year filter (verified wired end-to-end) carries yearGroup precision directly, no keyStage coarsening; B3 light canonical pass; B4 owner-signed-off NO-RENAME (all five names kept; sign-off recorded on the PR). code/mcp/test experts approved; Copilot clean. — S2 (one PR): prompt-surface fixed-language pass over the five served prompts — B3 canonical domain vocabulary (terms from curriculum://model; keyStage and yearGroup stay distinct) + B4 distinguishable prompt names (renames go THROUGH the fixed vocabulary) + B2 adapt-lesson arg-mapping repair. Outward-facing renames need owner sign-off at the PR. Independent of Track G; lands before G-units' prompt-step repoints where possible to minimise churn."
    status: completed
  - id: g1-prior-knowledge-view
    content: "COMPLETED 2026-06-10: G1a PR #153 merged (foundation: corpus 1,612 nodes / 3,452 edges / 0 dangling; ./graph-corpus subpath; ADR-086 amended in-commit) + G1b PR #161 merged (793cb3c1; anchored unitSlug[]+depth tool; curriculum://prior-knowledge-graph removed with -32602 reads; prompts anchor-threaded; eef-revalidation 334b8a99). prerequisiteFor basis subsequently corrected to the year axis by PR #165 (53308e1e — see g3). — G1 (default one PR; split-permitted at size into G1a foundation + G1b view): the one-graph foundation + prior-knowledge view. G1a: vocab-gen emits the graph-corpus dataset (unit node kind with materialised kind-qualified `id`, prerequisiteFor typed edges) with integrity resolution per the settled rule (R2 condition, 2026-06-09): for each of the 5 dangling edge endpoints, emit the endpoint node IF the unit exists in the bulk source; otherwise DROP the edge with provenance recorded in the generator output, plus a generator test asserting zero dangling endpoints in the emitted corpus (the corpus must construct in createGraphView without throwing); self-loop policy recorded; emitted-from-data types replace hand-written prior-knowledge-graph/types.ts (ONLY that file — misconception's types live until G2); new ./graph-corpus subpath export (hand-authored barrel, ADR-108 invariant 2); ADR-086 amendment in the same commit (overturn explicit-interface-first §2, clear the §4 freeze clause, correct tool-status rows and counts — recompute counts at amendment time). G1b: prerequisite view in graph-corpus-sdk (per-view createGraphView over the corpus; module-load construction per the EEF precedent with a recorded startup-cost check; depth default 2, empirical basis: depth-2 median 5 / p90 9 / max 18 nodes); rewrite get-prior-knowledge-graph (anchor unitSlug[] + depth; well-formed empty results; keep the TextContent serialization alongside structuredContent per the MCP spec SHOULD); REMOVE curriculum://prior-knowledge-graph (resource has no bounded form; catalogue + drift-guard updated in the same PR); prompt repoints are ANCHOR-THREADING REWRITES, not reference swaps (R2/mcp condition): rewrite the prior-knowledge clause of adapt-lesson step 2 AND learning-progression step 3 so the step resolves the anchor from the preceding search/fetch step and passes it to the anchored tool — each partial edit leaves the prompt correct-at-that-commit (the misconception clause keeps instructing the still-whole-corpus tool until G2); raise the eef-revalidation signal. Bulk re-projection targets the live vocab-gen extraction path (not the src/bulk duplicate)."
    status: completed
    depends_on: [settle-mechanism-at-promotion, define-heterogeneous-node-edge-model]
  - id: g2-misconception-view
    content: "COMPLETED 2026-06-10/11: PR #163 merged (27204da0; nine commits; mint rule live per the settled fold below; anchored lesson/unit/thread tool; curriculum://misconception-graph removed; old estate retired; eef-revalidation 42e5cf0c). — G2 (one PR): misconception view. Re-project thread/unit/lesson/misconception node kinds + the thread→unit→lesson→misconception chain edges from the bulk source (verified fully navigable: 100% field presence, ≥99.8% misconception population); misconception mint rule SETTLED 2026-06-10 (Galactic Soaring Nebula design pull-forward, adversarially reviewed — architecture-expert-betty concerns folded, assumptions-expert sound with every quantitative claim reproduced; Director-adjudicated at fold with the extractor no-dedup @remarks and the unsorted-readdir order-sensitivity chain re-verified first-hand in source): mint `misconception:<lessonSlug>#<hash16(normalise(text))>` — content-hash, lesson-scoped, TEXT-ONLY (response is payload, never identity: a response edit updates under a stable id; 37% of cross-lesson shared texts carry differing normalised responses, justifying lesson scope); normalise = trim + collapse-whitespace + lowercase on the hash input only (raw display text kept on the node; NFC pinned as an ASSERTION, not a transform — corpus measured 0/12,858 NFC-divergent); hash16 = first 16 hex of SHA-256 (prefix length is a one-line constant; full-hash permitted at execution if greppability wins); within-lesson dedup by construction (the real 473 multi-placement byte-identical pairs collapse to one node — ordinal would mint 473 duplicate-content pairs); same-text-different-response within one lesson (measured zero) = keep-first + droppedDuplicates provenance array (recommended shape, G1a-consistent fail-loud); emission id-sorted (lessonSlug-grouped, hash-ordered — deterministic regardless of enumeration order); lesson-slug churn is HONEST identity churn inherited from the ratified lesson-scope qualifier (old ids absent, new ids minted — never silent re-pointing); ordinal, hybrid, global-hash, text+response-hash, and unit-scope all REJECTED with recorded grounds; the stability-across-regenerations contract test is the verdict note's five-part shape (order-independence; churn semantics incl. the slug-rename case; dedup idempotence + the 473-count guard as a generator-test count, not a fixture; golden vectors pinning normalisation+hash as the cross-regeneration proof; edge-end integrity / zero dangling). Full verdict, measurements, and review dispositions: `.agent/reports/g2-misconception-mint-rule-design-2026-06-10.md`; delete hand-written misconception-graph/types.ts (replaced by emitted types); misconception view (per-view construction over the chain edges); rewrite get-misconception-graph — anchors per owner ratification 2026-06-09: lesson (leaf, ≤2 items) + unit (core, 2–11 KB typical) + thread (bounded with heavy-tail semantics: limit/paging or unit-granular response for mega-threads — max observed 262 KB bodies; one maths thread spans 77% of its subject) and the thread-unreachable-units gap recorded in the tool contract (english-secondary 15.7% — results never presented as subject-complete); REMOVE curriculum://misconception-graph; complete the adapt-lesson step-2 rewrite (anchor-threading: the step resolves its anchor from the preceding workflow step — never a bare reference swap); signal eef-revalidation."
    status: completed
    depends_on: [g1-prior-knowledge-view]
  - id: g3-thread-progressions-view
    content: "COMPLETED 2026-06-11: PR #164 merged (a229d63d; year-ordered sequences corpus v1.2.0; ordered projection as its own operation; anchored tool; resource removed; factory + unit test deleted; three stats-interpolation consumers moved; eef-revalidation db953071). G3 ALSO surfaced + cured a falsified premise: the bulk export carries NO authoritative within-thread unit ordering (unit.threads[].order is constant per thread — it orders THREADS; legacy order was file-encounter under a no-op sort); cure = (year, unitId) total order for sequences AND the prerequisiteFor year-axis re-chain, follow-on PR #165 merged (53308e1e; count preserved 3,452, 93.1% re-chained, selfLoops 28->33 explained by five exposed duplicate same-(unit,year) placements; eef-revalidation 08abb32a). OPEN to the re-proof: prerequisiteFor multiplicity (3,452 emitted vs 2,605 unique pairs, G1a-era, doc corrected on #165) — decide dedup-vs-multiplicity-as-signal alongside the eef-revalidation re-proof. — G3 (one PR): thread-progressions view + factory retirement. Ordered sequence projection as its own real operation in graph-corpus-sdk (sequence order CANNOT ride GraphView subgraph edges — {source,type,target} carry no attributes; this is an ordered projection over the one-graph corpus data, real logic + tests per ADR-173); thread ordering re-projected per the one-graph model (replacing the as-const thread-progression-data.ts authority per Decision A); rewrite get-thread-progressions (anchor threadSlug, or subject+keyStage); REMOVE curriculum://thread-progressions; rewrite learning-progression step 2 (anchor-threading); move the three stats-interpolation consumers (tool-guidance-data.ts, tool-guidance-workflows.ts, ontology-data.ts) onto the new surface; DELETE graph-resource-factory.ts AND its co-deleted unit test graph-resource-factory.unit.test.ts (re-grep the importer set at execution — verified 2026-06-09 as the six G1–G3 product files plus the factory's own unit test; the curriculum-model and EEF resources deliberately bypass it); check AGGREGATED_TOOL_ORDER on the landing page renders correctly post-rewrite; signal eef-revalidation. Depends on G2 because the thread node kind is emitted by G2 (see §Emission ownership) and Decision A forbids re-emission."
    status: completed
    depends_on: [g1-prior-knowledge-view, g2-misconception-view]
  - id: g4-bounded-keywords-tool
    content: "COMPLETED 2026-06-11: G4a PR #158 (2026-06-10) + G4b PR #173 merged (c868bb52e; six gate-green commits across four seat holders Tempestuous->Seaworthy->Cindery->Blustery, three clean PDR-063 rotations; get-keyword-graph owner-signed-off on the PR; keyword emission corpus v1.3.0 13,452 nodes / 43,660 containsKeyword edges / 0 dropped; bounded anchored frequency-ranked view; 4-surface registration; both disambiguation halves e2e-proven; extractor duplicate consolidated src/bulk-canonical; ADR-086 counts recomputed 40,016 nodes / 75,571 edges). OPEN to the re-proof: whether the EEF path consumes the keyword tool (the signal-eef-revalidation G4b clause — determine at the re-proof routing). — G4 (reshaped 2026-06-10, owner-directed; Gate-1 verdict + design pulled forward by Iridescent Glowing Sun, adversarially reviewed — architecture/assumptions/mcp lenses grounded first-hand; folded here by the Director): TWO deliverables, two value props — the earlier one-source gate branch is replaced by owner direction. GATE-1 EVIDENCE (recorded 2026-06-10, first-hand against live /keywords + the 2026-05-21 bulk snapshot; full verdict + commands in the 2026-06-10T15:14Z comms event): fields bulk ⊇ live decisively (bulk lessonKeyword {keyword, description} strict, schema-annotated identical-to-API; per-lesson association via lesson.lessonSlug; extractor-computed frequency — which live promises in its description but does NOT deliver: live sorts alphabetically with no frequency field, U1-grounded); coverage NOT uniform — primary exact parity, ks3 near-parity, KS4 material divergence (english live +38% vs bulk; science-ks4 live serves 0 vs bulk 1123, live mid-restructure) — a snapshot-freshness gap, distinct from the dissolved corpus≡bulk fidelity question; owner explicitly accepted snapshot semantics for the graph tool; bulk-refresh timing for the wider G-estate stays an open owner decision. — G4a (one small PR; INDEPENDENT of G2, can land early; in execution 2026-06-10, Umbral Prowling Lantern): preserve + disambiguate the GENERATED live-API get-keywords. (1) REQUIRED MCP-correctness fix: correct its false frequency-order description claim at the codegen description layer via the existing getToolDescriptionEnhancement hook (tool-description.ts; the GET_RATE_LIMIT_NOTE pattern) — our product surface only, upstream spec mirrors stay faithful (U1 owns the upstream cure); acceptance: the served description promises no ordering the API does not deliver. (2) Description-led disambiguation: both tools' descriptions state when to prefer each (get-keywords = live full set, fresh, authoritative at KS4, coarse anchors; the graph tool = bounded frequency-ranked richly-connected subset for token economy + relationship navigation), verified e2e via tools/list. A served-name rename (owner illustrative keywords_api) is OPTIONAL NEW codegen work — name-generator.ts derives names from path+method with no override hook — pursue only on explicit owner insistence; any outward name lands through the S2 fixed vocabulary with owner sign-off at the PR (repo convention kebab-case). — G4b (one PR; GATED ON G2 — lesson node kind per §Emission ownership): the new bulk-derived keyword GRAPH tool, AGGREGATED family (name freely chosen; candidates get-keyword-graph / explore-keywords; owner decides at PR). Emission: keyword node kind + lesson→keyword edges into the graph-corpus dataset at vocab-gen; node identity kind-qualified id = keyword:<normalised-term> (lc+trim), materialised id field; display term (first-occurrence casing) kept as a property; node stays LEAN (term, description, frequency, firstYear, subjects) — richness arrives via EDGE traversal keyword→lesson→{unit, thread, misconception, prerequisites} on the one-graph substrate; frequency (lessonSlugs.size) is a first-class node property. Build against the LIVE vocab-gen extractor path (vocab-gen/extractors/keyword-extractor.ts), NOT the byte-identical src/bulk duplicate — consolidating that duplicate to one canonical import is a named G4b-c1 step (corrections-ledger smell: resolve, not entrench). View: per-view createGraphView over the corpus in graph-corpus-sdk src/curriculum/ (G1b-created, already exported via ./curriculum — no build-config change; the G2 gate guarantees G1b is merged). Tool surface: anchor subject+keyStage, narrowable by unit/lesson; frequency-ranked; bounded (top-N/limit); well-formed empty result; structuredContent + serialized TextContent via the shared formatToolResponse helper (canonical 2-item content array; no MCP outputSchema — owned by the output-schemas plan); snapshot semantics stated in the description; aggregated registration is a 4-surface atomic change (new module, AggregatedToolName union, AGGREGATED_TOOL_DEFS, AGGREGATED_HANDLERS — compile-time guarded); no listChanged plumbing (stateless per-request transport, ADR-112). Cycles (TDD): G4b-c1 emission test describes the keyword node shape + lesson→keyword edges + zero dangling endpoints (corpus constructs in createGraphView) + a normaliseKeyword stability contract test (lc+trim, deliberately simple — do not over-build a unicode layer the corpus may not warrant) → emission + extractor-duplicate resolution in the same cycle; G4b-c2 view test describes anchored bounded frequency-ranked retrieval + edge decoration + well-formed empty → keyword view; G4b-c3 tool test describes the anchored structuredContent envelope + the two-tool description disambiguation (e2e tools/list) → tool add; signal eef-revalidation if the EEF path consumes it. Readiness reviewers (assumptions + architecture + mcp + type) run before G4b is marked execution-ready. Decoration depth and default-vs-on-demand fields settle at G4b execution (design agency); re-verify the pinned data facts (bulk manifest date, divergence numbers, emission table) at execution start."
    status: completed
    depends_on: [g1-prior-knowledge-view, g2-misconception-view]
  - id: s3-skills-as-prompts
    content: "c0 RATIFIED IN PART 2026-06-10 (owner, via Director): candidate set = oak-lesson-builder (reconciled with lesson-planning/adapt-lesson — extend/merge, never a third planning surface) + oak-curriculum-mapper, both cleared for cycles; oak-curriculum-principles-mcp-enabled CONFIRMED in principle but gated on an owner-owned attribution-validation step (how original authors are properly credited — owner links this to the ADR-058/060 grounding addenda, PR #154) before its cycle starts; oak-tone-of-voice excluded from the c0 set (owner may re-add by future decision). Reconciliation shape RATIFIED: derive-from-oak-skills (single source stays the Oak-owned private repo; MCP prompts are a derived surface, attribution carried). — S3 (one PR per tranche; c0 design gate first — owner-directed 2026-06-10: this is a live deliverable, never an unagreed holding state): surface oak-skills curriculum skills as MCP prompts. c0 (owner design gate): confirm the candidate set and the reconciliation shape with the eight MCP-wired oak-skills curriculum commands — never a third parallel surface. Candidates assessed 2026-06-09: oak-curriculum-principles-mcp-enabled (strongest — it already drives this MCP), oak-curriculum-principles, oak-lesson-builder (reconcile with lesson-planning/adapt-lesson, do not duplicate), oak-curriculum-mapper; oak-accessibility is woven into prompts rather than standalone; oak-brand excluded (owner); oak-tone-of-voice open (owner undecided 2026-06-09). Licence (owner-clarified 2026-06-09): the content is Oak's to use; each shipped prompt carries its source skill's external-research attribution (references/sources.md) to the same extent the original does. Prerequisite classification: oak-skills going public is BENEFICIAL, not blocking — the minimum shippable shape derives prompt content from the (Oak-owned, accessible) private repo now, attribution carried. c1+: one cycle per prompt (prompt-surface tests describe the served prompt; attribution present), names landed through the S2 fixed vocabulary. — DELIVERED IN PART 2026-06-11: PR #162 merged (12762fd4) — lesson-builder extension (reconciled into lesson-planning, never a third surface) + the NEW curriculum-mapping prompt (owner name sign-off recorded on the PR). REMAINING (owner-directed 2026-06-11, must NOT be forgotten — explicit follow-on): the TWO oak-curriculum-principles skills (oak-curriculum-principles-mcp-enabled + oak-curriculum-principles) stay gated on the owner-owned attribution-validation step (how original authors are properly credited; linked to the ADR-058/060 grounding addenda, PR #154); when the owner supplies that direction, their cycles run per this todo's c1+ shape as a follow-on S3 tranche PR. oak-tone-of-voice remains excluded (owner may re-add)."
    status: pending
  - id: u1-keywords-upstream-request
    content: "COMPLETED 2026-06-10: PR #156 merged (commit 951ad448). Request doc landed in the upstream-feature-requests lane, grounded read-only against upstream main HEAD 2e1a01d — key evidence: /keywords returns the full set sorted alphabetically despite its description promising frequency order; frequency is computable per-keyword but unexposed; request = optional bounded (limit/offset) + ranked (orderBy) controls, backwards-compatible. docs-adr-expert re-verified all citations. — U1 (one small docs PR; owner-shaped 2026-06-09): author an upstream API feature request for finer-grained /keywords control (e.g. bounded/ranked parameters), grounded in the LATEST upstream API source code (read-only grounding against the upstream repo; the request document lives in THIS repo's upstream-feature-requests lane — never write to the sibling repo)."
    status: completed
  - id: amend-adr-086
    content: "COMPLETED 2026-06-10: rode G1a (PR #153) exactly as planned — ADR-086 amended in the same commit (explicit-interface-first overturned, freeze clause cleared, tool-status rows + counts recomputed). — ADR-086 amendment — rides G1's first re-emission commit (see g1-prior-knowledge-view). Scope verified 2026-06-09: overturn §2 explicit-interface-types-first (superseded by Decision A emit-from-data); clear the §4 'no new MCP tools until search optimisation' freeze clause (fossil); correct §3 stale tool-status rows (misconception is live) and naming residue; recompute the node/edge counts at amendment time (validators-must-recompute — do not copy this plan's 2026-05-21-snapshot figures)."
    status: completed
    depends_on: [g1-prior-knowledge-view]
  - id: signal-eef-revalidation
    content: "COMPLETED 2026-06-11: ALL G1–G3 signals raised — G1b (334b8a99), G2 (42e5cf0c), G3 (db953071) + the year-axis re-chain (08abb32a) — and CONSUMED: the downstream re-proof EXECUTED (PR #177 merged c248b8149; verdict = EEF value path INTACT on the anchored tools). The G4b conditional closes FALSE per the recorded determination (re-proof report §3: get-keyword-graph is adjacent enrichment, not an EEF value-path dependency; no signal raised — its condition 'if the EEF path consumes it' determined false). The Track-G portion of this plan is complete in full. — On each G-unit landing, raise the landing signal to eef-revalidate-on-new-graph-tools (name the redesigned tool + commit + the new bounded-retrieval contract). The value re-proof is owned by that plan; the Track-G portion of this plan completes when G1–G3 (and G4 if its gate passes into a substrate build) have landed and signalled."
    status: completed
    depends_on: [g1-prior-knowledge-view, g2-misconception-view, g3-thread-progressions-view]
---

# Graph Tools Value Redesign (unified)

> **✅ RESTRUCTURED 2026-06-09 (owner-directed session: review-and-readiness).** The earlier
> recommended surface/graph Step-0 split was owner-rejected as too crude. This plan is now
> subdivided into **independent PR-shaped deliverables along the real seams** (solution-class,
> dependency, surface-cohesion, decision-vs-delivery — see the
> [seam-analysis report](../../../../reports/graph-tools-readiness-seam-analysis-2026-06-09.md)).
> The mechanism decisions (A/B/D/E/F), the identity model, and the substrate question are
> **SETTLED** — R1 architecture review (barney/fred/betty) unanimous, every finding adjudicated
> first-hand. The owner ratified (2026-06-09): the seam map and deliverables, the keywords
> disposition (§Keywords), and the misconception anchors (§Per-corpus value).
> **Delivery: every deliverable is one small, independently-shippable PR — a hard constraint.**
>
> **🟢 DECISION-COMPLETE (2026-06-09).** R2 ran (architecture-expert-wilma, assumptions-expert,
> mcp-expert — all `ready-with-conditions`); every condition was verified first-hand and applied
> in this revision: the G1 integrity-resolution rule settled; prompt repoints upgraded to
> anchor-threading rewrites (correct-at-every-commit); the §Emission ownership table added and
> the G4/G3 `depends_on` edges corrected from it; the G4 Gate-1 decision rule pinned; the factory
> deletion scope corrected (six product files + the co-deleted unit test); §Protocol notes added
> (stateless-transport rationale, behaviour-break statement, outputSchema-deferral validity); the
> Learning Loop reference made explicit. Full dispositions:
> [seam-analysis report §8](../../../../reports/graph-tools-readiness-seam-analysis-2026-06-09.md).
> Validated per the §Cycles-and-proof-contract DECISION-COMPLETE clause. Execution may begin with
> any unblocked deliverable.
>
> **Owner corrections (2026-06-10).** The two session PRs are the PLANNING output; execution fans
> out as one PR per deliverable. **Nothing in this plan sits in an unagreed holding state**
> (owner): the former §C analysis is now deliverable **S3** (c0 owner design gate, then one cycle
> per prompt — ledger row 17); S3 reaches execution-ready at its c0, the other deliverables'
> decision-complete standing is unchanged. The indefinite-deferral vocabulary family was added to
> the innate-immunity trip-list (`.agent/hooks/policy.json`) and catalogued in
> `no-hedging-vocabulary.md`.

## Problem and intent

The whole-corpus graph tools each return their **entire generated corpus** with no scoping input:
`get-misconception-graph` returns a 6.0 MB / 12,858-node blob, `get-prior-knowledge-graph` returns
1.8 MB, `get-thread-progressions` returns all 164 threads. That whole-corpus return floods the
calling agent with mostly-irrelevant tokens — it is the central problem. (`get-keywords` carries a
related flood — ~205 KB at subject+keyStage, owner-observed live 2026-06-08 — but it is a
**different solution-class**: a generated live-API pass-through with existing narrowing
parameters, handled by G4 + U1 per the owner's 2026-06-09 disposition, never replaced.)

This plan was first authored under a behaviour-preservation frame, overturned 2026-06-04 (owner):
we **construct** the generated data objects (the `vocab-gen` pipeline) **and** build the retrieval
substrate (`graph-core` + `graph-corpus-sdk`), so the data shape and the retrieval mechanism are
both ours to design. The work is a **value-driven redesign** of how each tool retrieves, with the
substrate move as the means. Migration ownership was unified here by Judgement call 4
(`graph-estate-consolidation.plan.md`, owner-ratified 2026-06-02) so no tool is orphaned and the
EEF re-validation gate has exactly one upstream.

## Governing first principles (the spine)

1. **Maximise value to users.** Return what the calling agent actually needs for the teacher's
   task.
2. **Do not flood agents with tokens on irrelevant information.** Return the relevant, bounded
   subset — never a whole corpus.

**Design agency.** A generated corpus's serialization is a design output we own, not a fixed
input. Graph form is used when it is the most direct bounded-relevant shape — value, not graph
form, is the test. **A list is a simple DAG — still a graph (owner, 2026-06-08)**: an ordered
sequence is a trivially-shaped graph and belongs on the same substrate when bounded retrieval is
what the value needs.

## Scope and source boundaries

- **Two data sources, one substrate, separate concerns.** This plan builds from the **bulk
  curriculum export** (`apps/oak-search-cli/bulk-downloads`; all grounding numbers in this plan
  are pinned to the `2026-05-21T13:45:16.086Z` snapshot and re-verified at execution start). The
  **Oak Ontology repo** is a separate source and concern; concepts live in the ontology, so
  concept-anchored capability is cross-source and out of scope. Bulk-id↔ontology-IRI
  reconciliation is a separate future concern.
- **One bulk graph, surfaced as views.** The curriculum domains share entities, so the bulk graph
  is one graph with a single identity model, surfaced through bounded query views. "One graph" is
  an identity/target statement, not build-it-all-up-front: the graph grows incrementally — each
  view adds only the node kinds and edges it needs.
- **Scope stays the named deliverables.** The `oak-kg`/ontology estate review is a distinct
  activity (recorded in
  [`graph-kg-estate-and-two-source-survey-2026-06-04.md`](../../../../reports/graph-kg-estate-and-two-source-survey-2026-06-04.md)).

## The deliverables (each = one small PR)

The seam map deriving these is in the
[seam-analysis report §2–§3](../../../../reports/graph-tools-readiness-seam-analysis-2026-06-09.md).
Owner-ratified 2026-06-09. The frontmatter todos carry the full per-deliverable content; this
table is the index.

| ID | Deliverable | Track | Depends on |
| --- | --- | --- | --- |
| S1 | Doc-resources single-sourcing (`curriculum://model` is canonical) | Surface | — |
| S2 | Prompt fixed-language pass (vocabulary + names + arg-mapping) | Surface | — |
| S3 | Skills → prompts (c0 owner design gate, then one cycle per prompt) | Surface | c0 gate |
| G1 | One-graph foundation + prior-knowledge view (two cycles; default one PR) | Graph | settled decisions |
| G2 | Misconception view (chain re-projection; ratified anchors) | Graph | G1 |
| G3 | Thread-progressions view (ordered projection) + factory deletion | Graph | G1, G2 |
| G4 | Additional bounded keywords tool (gate: bulk-parity determination) | Graph | G1 |
| U1 | Upstream `/keywords` finer-grained-control feature request | Upstream | — |

Track S is independent of Track G. S1 and S2 are shippable immediately; S2 lands before the
G-units' prompt repoints where scheduling allows (same files; no hard dependency). S3 starts at
its c0 owner design gate — a live deliverable like every other row (owner 2026-06-10: nothing in
this plan sits in an unagreed holding state).

### Surface-cohesion rule (binding on every G-unit)

Each tool's rewrite moves its **whole surface at once** in its own PR: the tool + its input
schema, its `curriculum://` resource **removal** (a resource is a static whole-corpus read with no
anchor input — once the bounded tool exists the resource has no bounded form; it is removed, not
rewritten), its prompt-step repoints, its non-tool consumers, and its eef-revalidation signal.
One pinned exception: `adapt-lesson` step 2 names both the misconception and prior-knowledge
tools in one sentence — G1 repoints the prior-knowledge clause only; G2 completes the step.

## Settled mechanism decisions (2026-06-09; R1-reviewed, unanimous)

Evidence and the full grounding trail:
[seam-analysis report §4 + R1 adjudication](../../../../reports/graph-tools-readiness-seam-analysis-2026-06-09.md).

- **A — data/type re-emission.** `vocab-gen` emits the one-graph corpus (nodes + typed edges) via
  the established three-file JSON-loader pattern, with **types computed from the extracted data**
  at generation time (ADR-031), deleting the hand-written `types.ts` files per-unit (G1 deletes
  only prior-knowledge's; G2 deletes misconception's). Anchor input types by domain size:
  `subject`, `keyStage`, `threadSlug` (164) as literal unions; `unitSlug` (~1.6k) and `lessonSlug`
  (~12.4k) as validated strings backed by generated runtime sets (ADR-153). Physical layout: one
  `graph-corpus` dataset with a single identity space, per-kind partitioned files where TS7056 or
  lint budgets demand — never per-view re-emissions of shared entities.
- **B — adapter home + dependency direction: option (a).** `graph-corpus-sdk` imports the
  generated corpus from `@oaknational/sdk-codegen` via a **new `./graph-corpus` single-level
  subpath** (hand-authored barrel; named G1 precondition). Verified: no circular back-edge exists
  in either `package.json`; the ESLint runtime boundary rules already permit single-level
  sdk-codegen subpath imports (zero rule changes); ADR-108 invariant 4 rules out option (b)
  (bulk-derived generated artefacts belong in the generation workspace). Reusing `./vocab-data`
  was considered and declined: the transition would mix the legacy flat corpora and the new graph
  authority in one barrel.
- **Substrate question — per-view construction; NO substrate change.** Each view constructs its
  own `GraphView` via `createGraphView` over the one corpus's data, selecting exactly its node
  kinds and typed edges at construction time. The landed EEF adapter (`eef-strands/eef-graph.ts`)
  is this exact pattern. The earlier "required `edgeTypes?` extension" claim is **corrected**:
  no `G0` deliverable exists, `manifest()` stays absent, `graph-core` is untouched, and no
  curriculum vocabulary enters the domain-generic substrate (ADR-179). Thread-progressions
  ordering cannot ride `subgraph()` at all (edges carry no attributes) — it is an **ordered
  corpus projection**, its own real operation in the view layer (ADR-173 real-operations-only).
- **D — codegen schema-emission.** A projection module performing the projection + single Zod
  call at the generated package's compile (the landed EEF D6 mechanism is the in-tree instance).
  No MCP `outputSchema` ships with any unit (owner 2026-06-08) — that surface is owned end-to-end
  by `output-schemas-for-mcp-tools.plan.md`.
- **E — landing order.** G1 prior-knowledge → G2 misconception → G3 thread-progressions; G4 after
  its gate. Consumer-readiness: the EEF value path runs on prior-knowledge + misconception;
  prior-knowledge first because it is the smallest foundation-carrying landing (single node kind,
  single edge type, edges already present in the source). E orders landing, not authoring.
- **F — factory disposition.** `graph-resource-factory.ts` (the whole-corpus
  `() => config.sourceData` executor — the exact shape being removed) is **deleted in G3** when
  its last consumer leaves, together with its own unit test. Importer set verified 2026-06-09 as
  the six G1–G3 product files plus `graph-resource-factory.unit.test.ts`; the curriculum-model
  and EEF resources deliberately bypass it; G3 re-greps the importer set at execution. No
  compatibility shim; any shared anchored-view mechanics are a consolidate-at-second-consumer
  decision at G3, never presupposed.

### Protocol notes (R2/mcp-expert, 2026-06-09)

- **Staged resource removal is protocol-safe by construction**: the production transport is
  stateless per request (`sessionIdGenerator: undefined`, ADR-112) — every connection re-discovers
  `resources/list` and `tools/list`, so no `listChanged` notification plumbing is load-bearing or
  needed; a `resources/read` on a removed URI returns `-32602` (InvalidParams) from the live SDK
  (verified first-hand at S1 against `@modelcontextprotocol/sdk@1.29.0`; the spec's `-32002` is a
  SHOULD the SDK does not implement — removed-URI assertions in G1b/G2/G3 expect `-32602`). Do not
  wire notification plumbing the architecture makes inert.
- **Zero-arg → required-anchor is a deliberate behaviour break** for any caller relying on the
  old form (replace-don't-bridge; no aliasing or deprecation step). The mitigation is the tool
  description carrying the anchor contract, and the per-request transport means no client holds a
  stale schema across connections.
- **`structuredContent` without an MCP `outputSchema` is protocol-valid** (outputSchema is
  optional; the conformance MUST attaches only once one exists). Rewrites keep the serialized
  TextContent block alongside `structuredContent` per the spec's backwards-compat SHOULD.

### Emission ownership (settled; R2 condition 2026-06-09)

Every `depends_on` edge between G-units derives mechanically from this table plus Decision A's
never-re-emit-shared-entities rule. An executor consults it to know what already exists in the
corpus when their deliverable starts.

| Node kind / edge type | Emitted by |
| --- | --- |
| `unit` nodes; `unit→unit prerequisiteFor` edges | G1 |
| `thread`, `lesson`, `misconception` nodes; `unit→thread`, `unit↔lesson` placement, `lesson→misconception` edges | G2 |
| thread→unit ordering data (the ordered projection's source) | G3 (re-projection of the sequence authority) |
| `keyword` nodes; `lesson→keyword` edges (bulk branch only) | G4 |

### Identity model (settled core)

Node ids are **kind-qualified and minted deterministically at vocab-gen** from
`(kind, source key)` — `unit:<unitSlug>`, `lesson:<lessonSlug>`, `thread:<threadSlug>` — and
**materialised as an explicit `id` field on every emitted node**; the `createGraphView` `nodeId`
extractor returns `node.id`, never a bare slug (otherwise the identity model exists only in
documentation). Slugs remain content keys; unit↔lesson placement is an edge (correct by
construction for multi-unit lesson placement). Misconceptions have no source key:
`misconception:<lessonSlug>#<n>` is the draft mint, and its **stability across regenerations**
(content-hash vs ordinal, with a stability contract test) is a named G2 design item — ordinal
suffixes are regeneration-fragile if upstream ordering shifts.

## Per-corpus value + token analysis (data-grounded 2026-06-09)

All numbers from the seam-analysis report §1.4 (commands recorded there); pinned to the
2026-05-21 bulk snapshot; re-verified at execution start.

### prior-knowledge — bounded subgraph (ratified)

1,607 nodes / 3,452 `prerequisiteFor` edges. Depth bounds verified meaningful: depth-2 reaches
median 5 / p90 9 / max 18 nodes; depth-3 max 40 (2.5% of the graph). (SUPERSEDED 2026-09-03 by MCP-671: `get-prior-knowledge-graph` takes no `depth` and performs
no traversal — see ADR-195's amendment.) **Default depth 2,
caller-adjustable** — this is the recorded empirical basis. Two integrity findings the G1
generator must resolve: the corpus is **not a DAG** (28 self-loops + 4 two-node maths cycles —
visited-set-safe traversal required, which the landed BFS provides; the self-loops are an
upstream data-quality signal; **corrected 2026-06-11 at the PR #165 year-axis re-chain: 33
self-loops — the corrected adjacency exposes five duplicate same-(unit, year) placements that
encounter order had hidden**), and **5 edge-endpoint slugs are missing from the node set** —
`createGraphView` throws at construction on unknown endpoints, so the re-projection must emit
those endpoint nodes from bulk or drop the dangling edges with provenance.

### misconception — curriculum-anchored bounded subgraph (anchors owner-ratified 2026-06-09)

`lessonSlug` is 100% dense with zero slug→title conflicts. Cardinality is ~1:1 (12,385 distinct
lessons; max 2 misconceptions per lesson), so the **lesson anchor is the near-trivial leaf**
(≤2 items) and the value concentrates in the **unit anchor (core: 2–11 KB typical, <20 KB
worst)** and the **thread anchor (bounded with heavy-tail semantics: median ~20 KB, p90 ~81 KB,
max ~262 KB bodies; one maths mega-thread spans 77% of its subject's units — a limit/paging or
unit-granular response shape applies to the tail)**. The thread→unit→lesson→misconception chain
is fully navigable in bulk (100% field presence; ≥99.8% misconception population).
**Reachability gap recorded in the tool contract**: english-secondary has 15.7% of units carrying
no thread — thread-anchored results are never presented as subject-complete.

### thread-progressions — bounded ordered projection (ratified)

164 threads, ordered unit sequences. Anchor `threadSlug` (or `subject`+`keyStage`); return one
thread's ordered sequence, never all 164. Sequence order is per-(thread, unit) placement data and
cannot ride `GraphView` edges — the view is an ordered projection over the one-graph corpus data,
its own real operation.

### Keywords (owner-shaped disposition, 2026-06-09)

The plan's earlier grounding was **false** (corrections ledger #1): `get-keywords` is a
**generated live-API tool** (`/keywords` GET at request time) that already accepts
`subject`/`keyStage`/`phase`/`unit`/`lesson`; the keyword extractor the plan cited feeds the
excluded `vocabulary-graph`; no prompt calls the tool. The owner's disposition:

1. **Keep `get-keywords`** — an important API pass-through; never replaced.
2. **U1**: upstream feature request for finer-grained `/keywords` control, grounded in the latest
   upstream API source (read-only grounding; the request doc lives in this repo).
3. **G4**: an **additional** bounded, frequency-ranked tool. Gate 1 determines whether the same
   keyword data the API serves is available in bulk (lesson keyword data demonstrably exists —
   the extractor consumes it; field/coverage parity vs the live response is the check). Parity →
   build from bulk on the one-graph substrate (keyword node kind + `lesson→keyword` edge); no
   parity → pull keywords via the API at codegen time and generate the local corpus from the
   pull. The new tool's name is distinguished from `get-keywords` through the S2 fixed
   vocabulary.

## Input-interface design surface (per G-unit)

- **Anchor input schema** — strict and complete; types per Decision A's domain-size rule. The
  arity differences across tools are corpus-justified and recorded in each tool description.
- **Anchor resolution** — anchors are generated-corpus keys (slugs/ids), not free text; free-text
  topic resolution remains owned by `oak-misconceptions-graph-features.plan.md §3`.
- **Bounded-retrieval semantics** — the bound parameter, its default, and the empirical basis
  recorded in code (prior-knowledge: depth 2 per the verified distribution; misconception thread
  anchor: the heavy-tail handling above).
- **Well-formed empty results** — an anchor with no matching subset returns a structurally valid
  empty result on the same projection path.

## Decision disposition ledger

Dispositions from the behaviour-preservation authoring (2026-06-04) are retained as recorded; the
2026-06-09 restructure adds:

| # | Item | Disposition |
| --- | --- | --- |
| 10 | Surface/graph Step-0 two-plan split (banner recommendation) | **replaced** (owner 2026-06-09) — too crude; the real seams produce the deliverables map; one plan, deliverable-demarked |
| 11 | Keywords redesign unit (bulk-derived premise) | **reshaped** (owner 2026-06-09) — premise falsified (live-API tool); G4 additional-tool + U1 upstream request; `get-keywords` kept |
| 12 | "Required" `GraphView` `edgeTypes?` extension + `manifest()` re-add | **replaced** — per-view construction over the one corpus (R1 unanimous); no substrate change; no G0; `manifest()` stays absent |
| 13 | Check (d) keyword data-grounding | **dissolved** — its existence half answered by the provenance verification; G4's Gate 1 is the live check |
| 14 | A5 dual-listing + B1 banner/sequencing contradiction + unowned row F | **dissolved by structure** — A1/B1 live inside the owning G-units; A5 is an acceptance invariant on every surface-touching PR; F is settled (factory deleted at G3) |
| 15 | Prior-knowledge "DAG" claim | **corrected** — sparse directed graph with self-loops + 4 two-node cycles; traversal is visited-set-safe; upstream data-quality signal recorded (28 at analysis; 33 post-#165 year-axis re-chain — corrected adjacency exposes five duplicate same-(unit, year) placements) |
| 16 | Extractor path (`src/bulk/extractors/keyword-extractor.ts`) | **corrected** — the live pipeline extracts via `vocab-gen/extractors/`; the duplication is a verified smell the G-units must resolve, not entrench |
| 17 | §C as a non-deliverable holding state | **replaced** (owner-directed 2026-06-10) — nothing sits in an unagreed holding state: §C is deliverable S3 with a c0 owner design gate; the "blocked on `oak-skills` going public" claim is reclassified BENEFICIAL (the content is Oak's; attribution carried); the indefinite-deferral vocabulary family joined the innate-immunity trip-list |

## Acceptance criteria

1. **Bounded retrieval per redesigned tool (G1–G3, +G4 if built)**: the tool takes its ratified
   anchor input and returns only the bounded relevant subset; an empty anchor returns a
   well-formed empty result; no whole-corpus path remains; `structuredContent` present; full gate
   chain green at the unit's landing. (MCP `outputSchema` explicitly excluded — owned by
   `output-schemas-for-mcp-tools.plan.md`.)
2. **Type authority (per-unit)**: G1 deletes `prior-knowledge-graph/types.ts`; G2 deletes
   `misconception-graph/types.ts`; no hand-maintained type parallel to a generated corpus
   remains; `pnpm sdk-codegen && pnpm build` reproduces the tree.
3. **Identity materialised**: every emitted node carries the kind-qualified `id` field; edges
   reference those ids; the misconception mint rule has a stability contract test (G2).
4. **ADR-086 amended** in G1's first re-emission commit (counts recomputed at amendment time).
5. **Resource removals clean**: each removed `curriculum://` resource leaves `ALL_MCP_RESOURCES`
   and the registration drift-guard green; `curriculum://model` + `eef://interpretation`
   untouched (A5 invariant).
6. **Surface single-sourcing (S1)**: the removed/folded doc resources leave `curriculum://model`
   as the one canonical source; drift-guard green.
7. **Fixed language (S2)**: prompt arg vocabulary and names use the canonical domain terms;
   owner sign-off on renames recorded.
8. **Value re-proof signalled**: each G-unit landing raises the named signal to
   `eef-revalidate-on-new-graph-tools` citing the commit + the new contract.
9. **Small-PR shippability**: every deliverable lands as one small standalone PR (G1 carries the
   named two-cycle split-permission). This is a readiness criterion, not a preference.
10. **Skills → prompts (S3)**: the c0 owner confirmation (candidate set + reconciliation shape)
    is recorded; every shipped prompt derives from its source skill and carries that skill's
    external-research attribution; no third parallel surface beside the oak-skills curriculum
    commands.

## Cycles and proof contract

Every cycle is one atomic landing (failing test + product code + refactor, one commit; all tests
green at every level at every commit — `tdd-as-design.md`). Cycle tests describe the deliverable's
**describing surface**, named below per deliverable — not internal seams. Test internals are
designed at execution, not prescribed here (`plan-body-first-principles-check`).

| Deliverable | Describing surface | Cycle sequence (test+code pairs) | Proof level + validation |
| --- | --- | --- | --- |
| S1 | The served resource catalogue (`resources/list` + drift guard) | c1: catalogue/drift-guard test describes the post-removal set → remove A2/A3, trim A4 | integration: drift-guard + `pnpm test`; e2e: `resources/list` over local MCP shows the reduced set; A5 reads intact |
| S2 | The served prompt definitions (`prompts/get` output) | c1: prompt-surface tests describe canonical arg names + distinguishable prompt names → apply the fixed-language pass | integration: prompt tests + `pnpm test`; owner sign-off on names recorded in the PR |
| G1a | The generated `graph-corpus` dataset (emitted nodes/edges/types) | c1: generator tests describe the emitted unit-node shape (materialised `id`), edge set, and integrity resolution (no dangling endpoints; corpus constructs in `createGraphView` without throwing) → vocab-gen emission + `./graph-corpus` barrel; ADR-086 amendment in the same commit | unit (generator) + integration (emitted corpus loads): `pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm test` |
| G1b | `get-prior-knowledge-graph`'s wire envelope | c1: view test describes anchored bounded retrieval over the corpus (depth default 2; well-formed empty) → prerequisite view; c2: tool test describes the anchored `structuredContent` envelope + resource absence + repointed prompt clauses → tool rewrite, resource removal, prompt repoints | unit + integration + e2e (`tools/call` with anchor; `resources/list` without the removed resource): full gate chain |
| G2 | `get-misconception-graph`'s wire envelope | c1: generator tests describe chain re-projection + mint-rule stability (contract test) → emission incl. misconception types deletion; c2: view test describes lesson/unit/thread anchors incl. heavy-tail + reachability metadata → view; c3: tool test describes the envelope + resource absence + completed adapt-lesson step → tool rewrite + removals | unit + integration + e2e: full gate chain |
| G3 | `get-thread-progressions`'s wire envelope | c1: ordered-projection test describes one thread's ordered sequence (own real operation) → projection + emission; c2: tool test describes the envelope + resource absence + interpolator continuity (stats render from the new surface) → tool rewrite, consumer moves, factory deletion (post re-grep) | unit + integration + e2e: full gate chain |
| G4 | Gate 1: a recorded parity verdict; then the new tool's wire envelope | c0 (gate): parity determination recorded in this plan (bulk fields/coverage vs live `/keywords` response); c1+: per the surviving branch (bulk build mirrors G2's cycle shape; API-pull branch adds the codegen-time pull first) | gate: non-code (recorded verdict + commands); build: full gate chain |
| S3 | The served prompt set (`prompts/get` output + attribution presence) | c0 (owner design gate): candidate set + reconciliation shape recorded; c1+: one cycle per prompt (prompt-surface test describes the served prompt incl. its source-skill attribution) → derive content with attribution carried | gate: non-code (recorded owner confirmation); build: integration (prompt tests) + e2e (`prompts/get`); full gate chain |
| U1 | The upstream request document | single docs cycle (non-code) | non-code: document exists in the upstream-feature-requests lane, grounded in cited upstream source |

**DECISION-COMPLETE proof contract.** The flip is validated by: (1) every deliverable above
carries acceptance ids (§Acceptance criteria 1–9 map onto S1, S2, G1–G4, U1), a proof level, and
deterministic validation; (2) the settled decisions cite landed-code evidence (the seam-analysis
report); (3) R1 and R2 findings each carry a first-hand-verified disposition with no unresolved
blocking finding; (4) the owner ratifications (seam map, keywords, misconception anchors) are
recorded; (5) the oak-plan residue self-checks pass over this file. The flip is recorded in the
banner with the R2 dispositions. TDD evidence discipline: the cycles above land test+code
together at execution; nothing in this plan claims test-first evidence for code that does not yet
exist.

## Risks

| Risk | Mitigation |
| --- | --- |
| Corpus fails substrate construction (dangling endpoints) | Named G1 generator obligation; verified count (5) and the throw path; integrity resolution is a hard G1 precondition |
| Misconception ordinal ids unstable across regenerations | Named G2 design item: content-hash vs ordinal + stability contract test (R1/fred flag; R2/wilma pressure-tests) |
| Mega-thread responses blow the bounded-retrieval promise | Ratified heavy-tail semantics (limit/paging or unit-granular shape); worst observed 262 KB bodies recorded |
| Thread-anchored results read as subject-complete | Reachability gap (english-secondary 15.7%) recorded in the tool contract and result metadata |
| Mechanism divergence from EEF | One mechanism shared with EEF (Decision A/D reuse the landed D6 instance); per-view construction is the landed EEF pattern |
| Generated-tool/aggregated-tool naming collision (G4) | New tool named through the S2 fixed vocabulary; `get-keywords` untouched |
| Scope bleed from features-plan §2–§4 | Boundary unchanged: cross-corpus/topic/extended-context composition stays in `oak-misconceptions-graph-features.plan.md`, gated on this redesign + D7 |
| Extractor duplication entrenched by new generator work | G-units target the live `vocab-gen/extractors/` path; duplication resolution named in G1 |

## Non-goals

- **No MCP `outputSchema` work** — owned end-to-end by `output-schemas-for-mcp-tools.plan.md`.
- **Not cross-corpus composition, free-text topic resolution, or extended contexts** — owned by
  `oak-misconceptions-graph-features.plan.md §2–§4`, gated on this redesign + D7.
- **Not the EEF tool** (owned by the EEF plan); **not** `vocabulary-graph` / `nc-coverage-graph`
  (no consumer); **not replacing `get-keywords`** (owner 2026-06-09).
- **No `graph-core` changes** — the substrate question is settled as per-view construction.
- **No upstream bulk-pipeline changes beyond the emission/reshape the decided shapes need.**

## ADR obligations

- **ADR-086 amendment** — see the `amend-adr-086` todo (rides G1).
- **ADR-173 / ADR-179** — implemented, not amended: per-view construction keeps the substrate
  untouched and transport-free; the ordered projection is a corpus-adapter real operation.
- **ADR-041 / ADR-108** — satisfied by Decision B option (a); the new `./graph-corpus` subpath
  follows invariant 2; zero boundary-rule changes (verified against the live ESLint rules).

## Foundation alignment and plan-body first-principles check

[`principles.md`](../../../../directives/principles.md) — design for value; Cardinal Rule (types
flow from generation; G4's codegen-time API-pull fallback stays inside it); Strict and Complete;
replace-don't-bridge (factory deleted, resources removed, no compatibility re-exports);
value-first/malleable-artefacts. [`schema-first-execution.md`](../../../../directives/schema-first-execution.md);
[`tdd-as-design.md`](../../../../directives/tdd-as-design.md) — each deliverable is a sequence of
test+product cycles landing atomically; each G-unit's describing surface is the tool's wire
envelope (e2e `tools/list` + anchored `structuredContent`).

The [`plan-body-first-principles-check`](../../../../rules/plan-body-first-principles-check.md)
fired at the 2026-06-09 restructure: the **shape** — every bounded shape is grounded in verified
data (the seam-analysis report §1.4), and the falsified keywords premise was corrected rather
than built on; the **landing path** — each deliverable is one small PR with the gate chain green
at landing; the **vendor-literal clauses** — no SDK/codegen call shapes asserted beyond
verified-in-tree code (the per-view construction and the D6 projection mechanism are landed
precedents, not invented shapes).

## Lifecycle triggers

See the [lifecycle-triggers component](../../../../plans/templates/components/lifecycle-triggers.md).
Touch points: start-right at session open; an active claim on
`packages/sdks/oak-sdk-codegen/`, `packages/sdks/oak-curriculum-sdk/src/mcp/`, and
`packages/sdks/graph-corpus-sdk/` before the first execution edit (EEF shares the
`universal-tools/` seam — coordinate per §Resolved Sequencing of the output-schemas plan);
session-handoff at boundaries. **Learning Loop**: each deliverable's landing and the plan's
completion run the consolidation workflow (`oak-consolidate-docs`) — milestone closures mine
lessons to permanent homes before archival per ADR-117. The ratified arc (owner, 2026-06-02):
finish EEF → redesign the graph tools → then decide what is next; this plan's completion opens an
owner decision point — nothing downstream auto-resumes.
