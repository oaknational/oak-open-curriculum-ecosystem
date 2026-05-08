# Next-Session Record — `eef` thread

**Last refreshed**: 2026-05-08 (Opalescent Shimmering Orbit / codex /
GPT-5 / `019e06` — PR #102 graph decision-complete closeout reaffirmed the
EEF evaluation stance: slice 1 is structural-only for evaluation purposes.
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
ran three review rounds (in-session first-principles, code-reviewer,
assumptions-reviewer); applied 6 findings across rounds plus 3
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

- **Thread**: `eef`
- **Thread purpose**: Integrate the EEF Teaching and Learning Toolkit
  as an evidence corpus on Oak's MCP server, on top of a polymorphic
  graph-query foundation that also serves the misconception and
  prerequisite graphs. Five-increment delivery, parallel implementation
  across three graphs, user-value template enforced on every plan task.
- **Branch**: `feat/eef_exploration` (originating session); execution
  branch TBD when Increment 1 promotes to ACTIVE.

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Iridescent Soaring Planet` | `claude-code` | `claude-opus-4-7-1m` | `b38261` | `architecture-restructure-and-handoff` | 2026-04-30 | 2026-04-30 |
| `Fragrant Sheltering Petal` | `claude-code` | `claude-opus-4-7-1m` | `360064` | `type-reviewer-round` | 2026-04-30 | 2026-04-30 |
| `Vining Whispering Root` | `claude-code` | `claude-opus-4-7-1m` | `696765` | `tracer-matrix-and-promotion-packet` | 2026-04-30 | 2026-05-01 |
| `Gnarled Fruiting Root` | `claude-code` | `claude-opus-4-7-1m` | `e18e2c` | `cross-ref-path-updates-from-thread-restructure-only` | 2026-05-01 | 2026-05-01 |
| `Windward Darting Horizon` | `cursor` | `claude-opus-4.7` | `dd084d` | `eef-tool-rename-eef-prefix-per-adr-157-and-mvp-arc-cross-ref` | 2026-05-07 | 2026-05-07 |
| `Opalescent Shimmering Orbit` | `codex` | `GPT-5` | `019e06` | `pr-102-eef-structural-eval-closeout` | 2026-05-08 | 2026-05-08 |

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

- [eef/README.md](../../../plans/sector-engagement/eef/README.md) — subthread orientation
- [eef/current/eef-evidence-corpus.plan.md](../../../plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md) — Increment 2 executable plan
- [eef/reference/conservation-map.md](../../../plans/sector-engagement/eef/reference/conservation-map.md) — semantic preservation map with verification log (§N)
- [knowledge-graph-integration/current/graph-query-layer.plan.md](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md) — Increment 1 foundation
- [knowledge-graph-integration/future/cross-source-journeys.plan.md](../../../plans/connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md) — Increment 3 design
- [napkin § 2026-04-30 EEF graph-and-corpus architecture session](../../active/napkin.md) — full session insight
- [experience/2026-04-30-iridescent-graph-corpus-composition.md](../../../experience/2026-04-30-iridescent-graph-corpus-composition.md) — methodology + reflection

---

## Current State

- All three plan files (graph-query-layer, eef-evidence-corpus,
  cross-source-journeys) are CURRENT or FUTURE; **none is ACTIVE**.
- `eef-evidence-corpus.plan.md` now carries the structural-only evaluation
  stance: T19 proves shape/citation/data/caveat preservation at the tool
  boundary; LLM/outcome evaluation is sequenced behind follow-on evaluation
  infrastructure.
- Predecessor `eef-evidence-mcp-surface.plan.md` deleted from working
  tree; recoverable via `git show e2796757:.agent/plans/exploring-open-education-resources/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md`.
- The `originals/` snapshot directory was created during the
  restructure for the verification pass and deleted afterwards (see
  conservation map § Recovery path).
- 25 files in the working tree at session-handoff time; 0 commits
  ahead of main; ready to commit in three sensible chunks (restructure,
  napkin, handoff).
- Sector-engagement umbrella sees the new subthread:
  `sector-engagement/README.md` documents table includes `eef/` row;
  `external-knowledge-sources/README.md` retains education-skills + KG
  meta-strategy plans only.

---

## Promotion Triggers and Sequencing

The five-increment delivery sequence with explicit promotion gates:

1. **Increment 1** (graph-query-layer) → ACTIVE when:
   - Owner has approved architecture session conclusions ✓ (done this session).
   - T1 (tracer use cases — 21 minimum, 7 ops × 3 graphs) signed off.
   - Plan-body first-principles check applied to tracer shapes against
     actual data files.
   - EEF corpus plan (Increment 2) ready for parallel start.
2. **Increment 2** (eef-evidence-corpus) → ACTIVE when:
   - Increment 1 reached ACTIVE.
   - Fresh upstream EEF data check performed (snapshot is 28 days old
     at handoff; living systematic review updates twice yearly).
   - Conservation map signed off by owner.
   - Plan-body first-principles check applied to citation type, corpus
     operations, test shapes.
3. **Increment 3** (cross-source-journeys) → CURRENT when:
   - Increments 1 and 2 both reached ACTIVE.
   - GraphView adapters exist for misconception and prerequisite (T3,
     T4 of graph-query-layer plan).
   - Real teacher question identifies that prompt-only orchestration
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

## Type-Reviewer Round Outcome (2026-04-30, Fragrant Sheltering Petal)

**Status**: type-reviewer round complete. Verdict: AT-RISK with concrete
remediations applied. Of 11 findings:

- **Bucket (a) principles-decided** — applied: Result<T, E> on fallible
  GraphView ops; non-empty tuple `caveats: readonly [string, ...string[]]`;
  non-empty tuple `citations: readonly [Citation, ...Citation[]]`;
  `ComparisonDimension` literal union (no `string[]` widening).
- **Bucket (b) reviewer-recommendation** — applied: DeepKeyPath
  array-stop constraint named in T2; T7a compile-time smoke-test added;
  `ExplainOptions` clarified TNode-independent (sketched); `NodeFilter<TNode>`
  and `RankOptions<TNode>` sketched in plans to prevent implementor drift;
  T19 claim corrected to match actual structural enforcement;
  `meta.last_updated` and `meta.data_version` Zod precision tightened
  (`z.string().date()` and semver regex); journey citation propagation
  type note added to T4.
- **Bucket (c) resolved by reading the data, not by escalation:**
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

**Out-of-band next-session candidate**: graduate *stop inventing
optionality* to `.agent/rules/apply-dont-ask.md` per the
pending-graduations register's `due` entry. Belongs to the
`agentic-engineering-enhancements` thread, not `eef`; flagged here
so the next EEF session does not re-trip on the pattern.

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

- `neighbours × misconception` — no edges in current `MisconceptionGraph` data (round-1 finding).
- `subgraph × misconception` — same root cause (round-1 finding).
- `find_by_tag × prerequisite` — no tag taxonomy in source data (round-2 finding from assumptions-reviewer); the synthetic-compound `${subject}-${keyStage}` proxy initially drafted was the *invented optionality* anti-pattern. Agents wanting subject+keyStage filtering use `enumerate_nodes`.
- `find_by_tag × misconception` — same root cause (round-2 finding).

Final MCP tool count: **17**, not 21. Per-graph: prerequisite 6 +
misconception 4 + eef-strands 7. The four carve-outs are explicit in
the plan body and in T6 (registration code names each and links back
to the NO TRACER cell, so the absence is visible to a future
contributor).

Each of the 19 tracers carries:

- A concrete teacher question.
- An expected response shape grounded in the actual data structure.
- A token budget at default projection.
- A boundary check (drops to graph mechanics, not corpus scoring).
- A verification footnote (`Verified against: <file> + <field path>`).

Inline location: `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md § Phase 1 § T1 Tracer Matrix`.

### Gate 2 — Plan-body first-principles check

Status: **complete.**

Each tracer was drafted with the actual generator-source or data file
open. Initial pass surfaced four findings; a code-reviewer round
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

- T3 PrerequisiteGraphView previously named edge types `prerequisite_of`,
  `succeeds`. Real data: single edge type `prerequisiteFor` with a
  `source: 'thread' | 'priorKnowledge'` discriminator. Corrected.
- T4 MisconceptionGraphView previously named edge types
  `related_misconception`, `addressed_by_lesson`. Real data: no edges
  at all. Corrected (with carve-outs).

### Gate 3 — Increment 2 parallel-readiness

Status: **complete — PASS on all four checks.**

Verified against `.agent/plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md`:

1. ✓ Status `current`; `parent_plan` and all four `sibling_plans`
   references resolve to existing files.
2. ✓ T1, T2, T5, T8, T12 are in their post-type-reviewer form
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

### Plan-body diff summary (since type-reviewer round)

Modifications to `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md`
this session, across two review rounds:

- Added § Phase 1 § T1 Tracer Matrix subsection (17 tracers + 4 NO TRACER cells + 6 Phase B findings + matrix summary).
- Extended `FieldPredicate<TFieldValue>` with the array-element `contains` arm (T2 spec) plus the "Semantic collision note" that names the string-vs-array structural identity for `{ contains }`.
- Corrected T3 PrerequisiteGraphView edge-type description (`prerequisiteFor` only, with `source` discriminator); marked `find_by_tag` as not registered (no tag taxonomy in source data) — implements 6 of 7 operations.
- Rewrote T4 MisconceptionGraphView description: 4-of-7 operations (no edges, no tag taxonomy), mints stable IDs (SHA-1-based; index-based forms ruled out).
- Rewrote T5 EefStrandsGraphView description with concrete tag/edge counts, the `id → strand_id` rename note, the optionality of `related_strands` (absent on 13 of 30) and `related_guidance_reports` (absent on 23 of 30, present as `{title, url}` objects). Added a "Sparse-relations surface" subsection: `manifest()` and `summary()` expose `strands_without_relations: readonly string[]` to front-load the empty-edge knowledge.
- Updated `manifest × eef-strands`, `neighbours × eef-strands`, and `subgraph × eef-strands` tracers to name the absent-field behaviour and the new manifest field.
- Updated T6 description: 17 MCP tools (not 21), with the four carve-outs explicit.
- Replaced Risk #5 ("tag-search semantics drift" mitigation) with a structural resolution: `find_by_tag` no longer ships for prerequisite or misconception, so the docstring-as-correction-of-surface-lie pattern is gone.
- Updated Size Estimate table: 17 tools, ~1605 lines total.
- Updated Exit Criteria § Shape conditions #1 to read "17 MCP tools".
- **Reframed Exit Criteria § Outcome conditions** from a "ratio ≥50% in 4 weeks" gate (sampling-noise-dominated at expected launch volumes) to a composite "adoption evidence" gate with three branches (≥10 distinct sessions / ≥1 downstream consumer composing without special-casing / honest analysis).

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

- **YES** → the plan moves from `current/` to `active/`; the next
  execution session begins with the `pnpm sdk-codegen` round-trip
  (verifying the type designs translate to working SDK code).
- **AMEND** → name the gap; the plan is updated and the packet is
  re-presented.
- **NO** → name the blocker; the plan stays CURRENT and the blocker
  becomes a new pre-promotion task.

No menu of alternative shapes is offered; the doctrine is to apply
the gate, not to invent optionality around it.

## Previous First Task (resolved)

**Run the type-reviewer over the current plan estate** — code-reviewer
explicitly recommended this in its session-close report; the
NodeProjection deep-path types and the EvidenceCorpus wrapping shape
are the load-bearing review questions. Owner direction (2026-04-30):
"this isn't something that needs my intervention, the code reviewer
suggested type reviewer follow up, stop inventing optionality and do
it." **Status**: complete (this session, see Type-Reviewer Round Outcome
above).

Brief the type-reviewer with:

- Branch: `feat/eef_exploration` at HEAD.
- Primary files: `graph-query-layer.plan.md` (NodeProjection recursive
  deep-path type with depth bound 4; the seven-operation interface),
  `eef-evidence-corpus.plan.md` (EvidenceCorpus wrapping a GraphView,
  Citation type as structural invariant).
- Specific questions for the reviewer:
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
9. **Type-reviewer escalation** → first task of next session (see
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

- **Parent (sector-engagement)**: [`sector-engagement.next-session.md`](sector-engagement.next-session.md)
- **Parent (KG-integration coordinator)**: [`open-education-knowledge-surfaces.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md) — this subthread owns its WS-3 (now restructured into Increments 1+2+3).
- **Authoritative ADR**: [ADR-157](../../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
- **Strategic brief**: [`evidence-integration-strategy.md`](../../../plans/sector-engagement/eef/future/evidence-integration-strategy.md) — R1–R8 source.
