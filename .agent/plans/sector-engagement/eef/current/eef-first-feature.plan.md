---
name: "EEF First Feature — eef-explore-evidence-for-context + eef-evidence-grounded-lesson-plan"
overview: "Owning plan for the first user-facing EEF MCP feature, delivered at graph-mvp-arc gate-1a atop graph-stack Inc.1d. Owns the gate-1a delivery contract end-to-end by reference: substrate floor (WS4.4 GraphView interface + WS4.5 EEF subgraph+manifest adapter), one tool (eef-explore-evidence-for-context), one prompt (eef-evidence-grounded-lesson-plan), structural citation/caveat/freshness envelope, ADR-175 freshness CI gate, ADR-157 eef-* namespace + _meta attribution, Sentry telemetry seam, and the two non-technical preconditions (EEF partnership-conversation opener, AI-client adoption-tracking owner naming)."
graph_layer: oak-graph-surface
graph_portfolio_index: "../../../graph-portfolio-index.md"
cross_cutting_thread: "EEF Evidence — sector-cohesion demonstration"
parent_plans:
  - "../../../graph-mvp-arc.plan.md"
  - "./eef-evidence-corpus.plan.md"
sibling_plans:
  - "../../../connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md"
  - "../../../connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md"
substrate_dependency: "graph-stack Inc.1d (WS4.4 + WS4.5)"
specialist_reviewer: "mcp-expert, code-expert, test-expert, type-expert, sentry-expert, docs-adr-expert"
status: current
isProject: false
todos:
  - id: ff1-partnership-opener
    content: "EEF partnership-conversation opener: name the EEF contact, record first-contact action (date + outcome). Required before gate-1a promotes to active. Sector-engagement deliverable, not technical; lives here because the partnership opener is a gate-1a precondition with no natural home in substrate or corpus plans."
    status: pending
    depends_on: []
  - id: ff2-adoption-tracking-owner
    content: "Name the owner of AI-client adoption tracking and the tracking mechanism (which AI clients have adopted which Oak MCP tools, with what usage signal). Carried over from graph-mvp-arc.plan.md::name-ai-client-adoption-owner — owned here because it is gate-1a's named precondition (resolves D-1). Without this the executive teacher-value chain has no signal source. Resolved 2026-05-22: owner = Jim Cresswell; mechanism = conversations (deliberately-light current state — adoption volume does not yet warrant a tracking surface). Future evolution recorded as a possibility, not a commitment: a Notion document gated by an Oak-specific token held in .env.local. The future evolution graduates when conversation cadence stops carrying the signal cleanly."
    status: completed
    depends_on: []
  - id: ff3-substrate-floor-tracking
    content: "Track graph-stack Inc.1d landing (WS4.4 + WS4.5 in active/graph-stack.plan.md). Not authored here — pointer only. WS4.4: GraphView<TNode, TEdgeType> interface in packages/core/graph-core/src/graph-view/ (placement corrected per architecture-expert-betty verdict 2026-05-21). WS4.5: EefStrandsGraphView adapter in packages/sdks/graph-corpus-sdk/ implementing subgraph + manifest for EEF data, remaining 5 ops as typed NotImplementedYet Result stubs."
    status: pending
    depends_on: []
  - id: ff4-corpus-todos-tracking
    content: "Track gate-1a corpus-plan todos in eef-evidence-corpus.plan.md (canonical IDs, not duplicated here): t1-corpus-shape, t2-zod-loader, t6a-explore-tool, t9-guidance-constant, t10-lesson-plan-prompt, t12-citation-shape, t13-freshness-gate, t20-credits. Plus gate-1a-partial scopes of t14-telemetry, t15-negative-space-doc, t16-public-export, t17-register-resources, t18-adr-123-update, t19-e2e (gate-1a portions per the corpus plan's §Gate grouping table)."
    status: pending
    depends_on: []
  - id: ff5-shape-understanding-evidence
    content: "Answer the five-question shape-understanding evidence template (from graph-mvp-arc.plan.md § Shape-Understanding Evidence Template) for the gate-1a feature: (1) what teacher action does this enable, (2) what is the smallest verifiable signal of value, (3) what is the worst plausible failure shape and the structural guard against it, (4) what does the response look like under a degenerate input, (5) what is the freshness-staleness behaviour. Record answers here as gate-1a precondition. Note: ff5 content can only be answered concretely once t1-corpus-shape + t6a-explore-tool are at least drafted, so the implementation order is Round 4 (parallel with t6a) per the Execution Partition table; the ff4 dependency is the tracking pointer to those corpus todos."
    status: pending
    depends_on: [ff4-corpus-todos-tracking]
  - id: ff6-acceptance-bundle
    content: "Gate-1a acceptance bundle: substrate floor landed (ff3); corpus todos landed (ff4); partnership opener executed (ff1); adoption-tracking owner named (ff2); shape-understanding evidence answered (ff5); _meta source attribution preserved on the response; eef-* prefix applied; freshness CI gate active (180-day threshold per ADR-175); structural citation envelope verified (non-empty tuple compile-time + Zod min(1) runtime); Sentry telemetry seam instrumented on the one tool. MCP tool home: existing oak-curriculum-sdk MCP module per ADR-179 surfacing discipline."
    status: pending
    depends_on: [ff1-partnership-opener, ff2-adoption-tracking-owner, ff3-substrate-floor-tracking, ff4-corpus-todos-tracking, ff5-shape-understanding-evidence]
---

# EEF First Feature — Owning Plan

**Status**: CURRENT — promotes to ACTIVE when graph-stack Inc.1d (WS4.4 + WS4.5)
lands and the EEF partnership-conversation opener has been executed.
**Last Updated**: 2026-05-21 (Charcoal Searing Ember session — owning-plan
extraction absorbing docs-adr-expert P0 finding against the Torrid Glowing
Flame amendment set).
**Branch**: `feat/mcp-graph-support-foundation` (substrate work);
`feat/eef_exploration` was the originating session branch for the corpus plan
this plan extracts gate-1a scope from.
**Substrate dependency**: graph-stack **Inc.1d** (WS4.4 GraphView interface +
WS4.5 EEF subgraph+manifest adapter as concurrent Inc.1 tenants of
`graph-corpus-sdk` per ADR-173 §First-wave ingestion scope 2026-05-21
amendment).

## Scope

This plan owns the gate-1a delivery contract end-to-end:

- **1 tool**: `eef-explore-evidence-for-context` (subgraph-shaped response over
  EEF strands matching a teacher's seed context — subject + key_stage + optional
  focus — wrapped in the structural citation/caveat/freshness envelope).
- **1 prompt**: `eef-evidence-grounded-lesson-plan` (projects the subgraph
  result into a teacher-readable narrative with structurally-preserved
  citations).
- **The corpus envelope**: structural citation discipline, caveat-presence,
  freshness metadata, ADR-157 `_meta` source attribution.
- **The freshness CI gate**: ADR-175 binding active at gate-1a (180-day
  threshold).
- **The Sentry telemetry seam**: pattern shipped, one tool instrumented.
- **The partnership-conversation opener**: EEF contact named, first-contact
  recorded.
- **The AI-client adoption-tracking owner naming**: D-1 resolved.

Ownership is **by reference**, not by duplication: this plan points at canonical
todo IDs in the substrate plan (`graph-stack.plan.md`) and the corpus plan
(`eef-evidence-corpus.plan.md`). The work itself executes there; the gate-1a
delivery contract is observed here.

## What this plan does NOT own

- **Substrate work** (graph-stack Inc.1d WS4.4 + WS4.5) — authored and tracked
  in `connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md`.
- **Corpus work** (t1, t2, t6a, t9, t10, t12, t13, t20 + partials) — authored
  and tracked in `./eef-evidence-corpus.plan.md`.
- **Gate-1b** (slice-1 completion: recommend/explain/compare tools + second
  prompt + full telemetry/registration/E2E) — that is the residual corpus
  surface, owned by `./eef-evidence-corpus.plan.md` after this plan's gate-1a
  scope lands.
- **Cross-corpus journeys** — owned by `graph-combinatorial-arc.plan.md`.

## Architectural commitments at gate-1a

The 2026-05-21 sequencing pull-forward is a **sequencing change, not a scope
reduction**. The following ship in full at gate-1a:

1. **Full `GraphView<TNode, TEdgeType extends string>` interface** (all 7
   method signatures, `Result<T, E>` discipline on every fallible operation per
   `principles.md` §Code Design, `NodeProjection<TNode, Depth extends number = 4>`
   recursive deep-path with array-stop discipline, `NodeFilter<TNode>` with full
   `FieldPredicate<TFieldValue>` arm set). Authored at WS4.4 inside
   `packages/core/graph-core/src/graph-view/`.
2. **T7a compile-time `DeepKeyPath` smoke-test** asserting `'headline.impact_months'`,
   `'school_context_relevance.implementation_requirements.cpd_intensity'` and
   `'effectiveness.mechanisms'` are valid, and `'tags.0'` / `'tags[number]'` are
   NOT valid (array-stop regression guard).
3. **Structural citation/caveat/freshness envelope** at the tool boundary
   (`citations: readonly [Citation, ...Citation[]]`, `caveats: readonly [string, ...string[]]` — non-empty tuple compile-time + Zod min(1) runtime).
4. **ADR-175 freshness CI gate** active before any user-facing surface ships
   (180-day staleness threshold; data version emitted on every response).
5. **ADR-157 `eef-*` namespace + `_meta` source attribution** on the tool and
   the prompt.
6. **Sentry telemetry seam pattern** shipped (pattern full; instrumentation
   scope = the one tool — `t14-telemetry` partial at gate-1a, full at gate-1b).
7. **Sparse-relations surface on manifest** (per assumptions-expert round
   2026-04-30 verdict and 2026-05-21 reconfirmation): `manifest()` returns
   `strands_without_relations: readonly string[]` to front-load the
   empty-edge knowledge so consumers avoid pointless `subgraph`/`neighbours`
   calls on isolated strands.

## Execution Partition

This section is the team-execution overlay for gate-1a delivery. It names
every gate-1a-blocking cycle and coordination token, the file scope each
owns, the dependency edges between them, the in-cycle reviewer set, and
the round assignment derived from the dependency graph. A fresh agent
landing on a Round 1 cycle should be able to pick it up from this table
alone, without re-deriving the partition.

The canonical authoritative todo content stays in the substrate plan
(`graph-stack.plan.md` for `WS4.x`) and the corpus plan
(`eef-evidence-corpus.plan.md` for `t1`–`t20`). This overlay points; it
does not duplicate.

**Hard gate before Round 1 opens** (added 2026-05-21; relaxed
2026-05-22 — see amendment note below): the
`feat/mcp-graph-support-foundation` branch carries PR #108 with
failing quality gates (CodeQL alert #90, SonarCloud Quality Gate
failing on 40 new issues, 12 unreviewed hotspots, and 6.0% new-code
duplication ≥ 3.0% threshold). All gate-1a substrate cycles in this
overlay (`WS4.1`, `WS4.4`, `WS4.5`) plus Inc.1a closure (`WS2.2`,
`WS2.3`) are blocked until PR #108 clears — either via the
[`pr-108-snagging.plan.md`](../../../connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md)
12-cycle plan landing on this branch, or via the branch merging
first and graph implementation resuming on a fresh branch. The
corpus cycles (`t1` through `t20`) and `ff`-coordination tokens
become dispatchable only after the substrate floor is unblocked.
Round 0 owner authorisation (the WS4.4 test-partition amendment +
four protocol additions) is necessary but NOT sufficient; the
PR-#108 gate is also a precondition.

**2026-05-22 amendment — concurrent-execution relaxation**. Owner
direction this session relaxes the hard gate above: gate-1a
substrate authoring (`WS4.1`, `WS4.4`, `WS4.5`) and `ff1` / `ff2`
non-technical preconditions are permitted to proceed concurrently
with the PR-#108 snagging work, under the file-scope partition that
prevents collisions across plans. Merge ordering — which PRs land in
what order — is a session-time operational choice, not a planning
constraint, and is not specified here.

**Meta-plan cross-reference**: a fresh session picking up this
branch reads
[`../../../feat-mcp-graph-support-foundation-meta.md`](../../../feat-mcp-graph-support-foundation-meta.md)
first. The meta plan names every plan currently in force on this
branch, the cross-plan dependency picture, the file-scope partition,
current state of work, and the open owner-class structural
questions.

### Dependency graph (gate-1a scope only)

| Cycle / token | Workspace + file scope | Depends on | Parallel-safe with |
| --- | --- | --- | --- |
| `WS4.1` | `packages/sdks/graph-corpus-sdk/**` + root registrations (`pnpm-workspace.yaml`, `knip.config.ts`, `.dependency-cruiser.mjs`, `pnpm-lock.yaml`) | (none after Round 0) | `WS4.4`, `WS2.2`, `WS2.3`, `t9`, `t12`, `t13`, `t20`, `ff1`, `ff2` |
| `WS4.4` | `packages/core/graph-core/src/graph-view/**` (interface + fixture-based DeepKeyPath smoke-test using inline fixture `TNode`) | (none after Round 0; test-partition amendment lifts the `WS4.1` dependency) | `WS4.1`, `WS2.2`, `WS2.3`, `t9`, `t12`, `t13`, `t20`, `ff1`, `ff2` |
| `WS4.5` | `packages/sdks/graph-corpus-sdk/src/eef-strands/**` (`EefStrandsGraphView` adapter + `EefStrand`-instantiation smoke-test) | `WS4.1`, `WS4.4` | `t12`, `t13`, `t9`, `t14`-pattern, `t20`, `ff1`, `ff2` |
| `t1-corpus-shape` | `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/types.ts` (canonical scaffold filename — actual name confirmed during cycle) | `WS4.4` | `WS4.5`, `t12`, `t13`, `t9`, `t20` |
| `t2-zod-loader` | `oak-curriculum-sdk/src/mcp/evidence-corpus/loader.ts` (+ co-located unit tests) | `t1-corpus-shape`, `WS4.5` | `t9`, `t12`, `t13`, `t20` |
| `t6a-explore-tool` | `oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context.ts` (+ tests) | `t1-corpus-shape`, `t2-zod-loader`, `WS4.5`, `t12-citation-shape`, `t14`-pattern | `t9`, `t20`, `ff5` (parallel — different surfaces) |
| `t9-guidance-constant` | `oak-curriculum-sdk/src/mcp/evidence-corpus/guidance-constant.ts` | (none) | every other cycle |
| `t10-lesson-plan-prompt` | `oak-curriculum-sdk/src/mcp/evidence-corpus/prompts/eef-evidence-grounded-lesson-plan.ts` (+ tests) | `t6a-explore-tool`, `t9-guidance-constant` | `t15`/`t16`/`t17`/`t18`/`t19` partial extensions |
| `t12-citation-shape` | `oak-curriculum-sdk/src/mcp/evidence-corpus/citation-shape.ts` (non-empty-tuple compile-time type + Zod `min(1)` runtime schema + tests) | (none) | every other cycle |
| `t13-freshness-gate` | canonical CI gate location (workflow file + ADR-175 binding wiring) | (none) | every other cycle |
| `t14-telemetry` (pattern only at gate-1a) | `oak-curriculum-sdk/src/mcp/evidence-corpus/telemetry.ts` (Sentry seam pattern); instrumentation of the one tool lands inside `t6a` | `t6a-explore-tool` (for instrumentation) | `t1`, `t12`, `t13`, `t9`, `t20` |
| `t20-credits` | repo `README.md` + `ATTRIBUTION.md` (EEF + John Roberts attribution) | (none) | every other cycle |
| `t15`/`t16`/`t17`/`t18`/`t19` (gate-1a partials) | canonical homes per corpus plan workstream overlay | `t6a-explore-tool`, `t10-lesson-plan-prompt` (partial scopes only) | `t9`, `t12`, `t13`, `t20` |
| `ff1-partnership-opener` | NON-TECHNICAL (sector-engagement deliverable; updates `ATTRIBUTION.md` + this plan body) | (none) | every other cycle |
| `ff2-adoption-tracking-owner` | NON-TECHNICAL (resolves D-1; updates `graph-mvp-arc.plan.md::name-ai-client-adoption-owner` + this plan body) | (none) | every other cycle |
| `ff5-shape-understanding-evidence` | plan-file edit in `eef-first-feature.plan.md` (answers the five-question template) | `ff4-corpus-todos-tracking` (substantively: `t1-corpus-shape` + `t6a-explore-tool` drafted) | `ff1`, `ff2`, `t9`, `t12`, `t13`, `t20`, `t6a` (parallel — plan-file vs. source) |
| `ff6-acceptance-bundle` | plan-file gate (terminal; this plan body records gate-1a closure) | ALL above | (terminal) |

Inc.1a closure cycles `WS2.2` (graph-ingest jsonld-compatible + Turtle/SKOS parser) and `WS2.3` (graph-ingest peer cycle) are NOT gate-1a-blocking — they live in `packages/libs/graph-ingest/**`, a separate workspace tree from the gate-1a substrate (`graph-core`, `graph-corpus-sdk`) and the gate-1a corpus (`oak-curriculum-sdk`). They are cross-workspace parallel with the entire Round 1 cohort and can land in any round without affecting the gate-1a critical path.

### Round assignment

Each round = the maximum file-disjoint cohort whose dependencies are
satisfied by the prior round.

- **Round 0** (owner authorisation only — no source code):
  - `WS4.4` test-partition amendment (split `T7a` `DeepKeyPath`
    compile-time smoke-test by ownership-of-invariant — fixture-based
    in graph-core with `WS4.4`, `EefStrand`-instantiation in
    `graph-corpus-sdk` with `WS4.5`).
  - Four rotating-cast coordination protocol additions captured as
    pending-graduations entries (mid-cycle retirement, coordinator
    handoff two-distinct-moments, grounding-cost amortisation,
    comms-event stream as failure-mode capture channel).
- **Round 1** (eight parallel cycles, all file-disjoint):
  `WS4.1`, `WS4.4`, `t9-guidance-constant`, `t12-citation-shape`,
  `t13-freshness-gate`, `t20-credits`, `ff1-partnership-opener`,
  `ff2-adoption-tracking-owner`. Plus `WS2.2`, `WS2.3` (Inc.1a closure,
  cross-workspace parallel — separate tree).
- **Round 2** (three parallel cycles): `WS4.5`, `t1-corpus-shape`,
  `t14-telemetry` (pattern only; instrumentation in `t6a`).
- **Round 3**: `t2-zod-loader` (depends on `t1` + `WS4.5`).
- **Round 4**: `t6a-explore-tool` (depends on `t2` + `WS4.5` + `t12` +
  `t14`-pattern) + `ff5-shape-understanding-evidence` (parallel —
  different surface; plan-file edit).
- **Round 5**: `t10-lesson-plan-prompt` (depends on `t6a` + `t9`) +
  `t15`/`t16`/`t17`/`t18`/`t19` partial extensions (parallel — each
  edits a different file home per corpus plan workstream overlay).
- **Round 6** (terminal): `ff6-acceptance-bundle` (acceptance gate;
  the closeout, not a cycle).

The critical path is the longest sequential chain:
`WS4.4` → `t1` → `t2` → `t6a` → `t10` → `ff6` (5 sequential rounds +
Round 0 authorisation + terminal acceptance). Compute scaling buys
round-internal parallelism (eight cycles + two non-technical streams +
two cross-workspace Inc.1a cycles in Round 1) and rotating-cast
resilience; it does not compress the chain.

### Per-cycle reviewer set (in-cycle dispatch; verdicts absorbed before commit)

| Cycle | Mandatory reviewers | Optional |
| --- | --- | --- |
| `WS4.1` | config-expert, architecture-expert-fred, test-expert | type-expert |
| `WS4.4` | type-expert, architecture-expert-betty, test-expert | — |
| `WS4.5` | type-expert, test-expert, architecture-expert-betty | mcp-expert (interface compliance) |
| `t1-corpus-shape` | type-expert, test-expert | architecture-expert-betty |
| `t2-zod-loader` | type-expert, test-expert | — |
| `t6a-explore-tool` | mcp-expert, type-expert, test-expert, sentry-expert | architecture-expert-betty |
| `t10-lesson-plan-prompt` | mcp-expert, type-expert | test-expert |
| `t12-citation-shape` | type-expert, test-expert | — |
| `t13-freshness-gate` | docs-adr-expert (ADR-175 alignment), test-expert | — |
| `t14-telemetry` | sentry-expert, type-expert | — |
| `t9-guidance-constant`, `t20-credits` | docs-adr-expert | — |
| `t15`/`t16`/`t17`/`t18`/`t19` (partials) | per corpus plan workstream-specific reviewer set | — |

Cross-cutting reviewer per round (reads the integrated state after
all round-cycles land, before the next round opens; per the inviolate
quality invariants in [`gate-1a-delivery-parallel-execution-addendum.plan.md`](../../../connecting-oak-resources/knowledge-graph-integration/current/gate-1a-delivery-parallel-execution-addendum.plan.md)):
architecture-expert-betty by default, or docs-adr-expert when the
round predominantly touches plan/ADR surfaces.

### Per-cycle acceptance test shape

Every cycle ships product code and test code in one atomic commit per
the inviolate `atomic-landing` invariant. The canonical authoritative
test shape per cycle lives in the substrate or corpus plan's `content`
field for that todo; this overlay points at the row, it does not
duplicate the test specification. A team agent picking up a cycle
reads:

1. This overlay row for file scope + dependencies + reviewers + round.
2. The substrate/corpus plan's todo `content` for the canonical test
   shape (e.g., for `t12-citation-shape`: "non-empty tuple compile-
   time + Zod `min(1)` runtime; load-bearing architectural commitment
   for both gates").
3. The reviewer cadence (dispatch in-cycle; absorb before commit).

### Named user-facing scenarios

The acceptance bundle (`ff6`) is the gate-1a closure trigger. The
substantive user-facing scenarios behind each gate-1a precondition:

- **`ff1` (partnership opener)** — EEF contact named in
  `ATTRIBUTION.md`; first-contact action recorded with date and outcome
  in this plan body. Acceptance test = manual review by owner.
- **`ff2` (adoption-tracking owner)** — owner named for AI-client
  adoption tracking; tracking mechanism documented in a named location
  (resolves `D-1`). Acceptance test = manual review by owner.
- **`ff3` (substrate floor)** — `WS4.4` + `WS4.5` commits visible in
  `graph-stack.plan.md` status with both todos at `status: completed`;
  `GraphView<TNode, TEdgeType>` importable from
  `@oaknational/graph-core/graph-view`; `EefStrandsGraphView`
  importable from `@oaknational/graph-corpus-sdk/eef-strands`.
  Acceptance test = plan-status cross-check + import smoke-test in
  consumer workspace.
- **`ff4` (corpus floor)** — the 8 full + 6 partial gate-1a corpus
  todos enumerated in `eef-evidence-corpus.plan.md` §Gate grouping
  table at `status: completed`; `t6a-explore-tool` callable
  end-to-end against EEF data. Acceptance test = the MCP-tool
  round-trip integration test already specified in corpus-plan `t19`
  partial.
- **`ff5` (shape-understanding evidence)** — the five-question
  template from `graph-mvp-arc.plan.md` §Shape-Understanding Evidence
  Template answered in this plan body for gate-1a. Acceptance test =
  manual review by owner.
- **`ff6` (acceptance bundle)** — teacher launches an MCP client,
  invokes `eef-explore-evidence-for-context` with a real KS-bound
  seed context (e.g., KS2 maths + "feedback" focus), receives a
  typed subgraph of EEF strands wrapped in the corpus envelope:
  non-empty `citations` tuple (per `t12-citation-shape`), non-empty
  `caveats` tuple, freshness metadata (per `t13-freshness-gate`,
  data version emitted), `_meta.source = 'EEF Toolkit'` (per
  ADR-157), `eef-*` namespace on the tool name. Acceptance test =
  manual MCP-client round-trip + the integration test set per
  corpus-plan `t19` partial.

## Non-technical preconditions

These have no natural home in the substrate plan or the corpus plan; they live
here because they gate `gate-1a` promotion to active:

- **`ff1-partnership-opener`**: EEF contact named, first-contact action
  recorded with date + outcome. The EEF source-authority status (the
  repository-held `eef-toolkit.json` snapshot is the canonical implementation
  source until EEF clarifies refresh mechanics) means the partnership
  conversation is the load-bearing channel for resolving long-term provenance
  questions.
- **`ff2-adoption-tracking-owner`**: name the owner of AI-client adoption
  tracking and the tracking mechanism. This resolves D-1 (which was the
  load-bearing decision shipping into the void without a tracking surface).
  The previous home in `graph-mvp-arc.plan.md::name-ai-client-adoption-owner`
  remains as a coordination pointer back here.

  **Resolved 2026-05-22**: owner = **Jim Cresswell**; mechanism =
  **conversations** for now. This is a deliberately-light current state —
  adoption volume does not yet warrant a tracking surface, and conversation
  cadence currently carries the signal cleanly. Future evolution recorded
  as a possibility, not a commitment: a Notion document gated by an
  Oak-specific token held in `.env.local`. The future surface graduates
  when conversation cadence stops carrying the signal cleanly — there is
  no scheduled trigger; the signal-degradation observation is the trigger.

## Acceptance bundle (`ff6`)

Gate-1a closes when all of:

- Substrate floor landed (graph-stack Inc.1d WS4.4 + WS4.5 commits visible in
  active/graph-stack.plan.md).
- Gate-1a corpus todos landed (the 8 full + 6 partial todos enumerated in
  `eef-evidence-corpus.plan.md` §Gate grouping table).
- `ff1-partnership-opener` executed.
- `ff2-adoption-tracking-owner` named.
- `ff5-shape-understanding-evidence` answered (five-question template
  completed for the gate-1a feature).
- `_meta` source attribution preserved on the response, `eef-*` prefix
  applied, freshness CI gate active, structural citation envelope verified,
  Sentry telemetry seam instrumented.
- MCP tool registered in the existing `oak-curriculum-sdk` MCP module per
  ADR-179 §Surfacing discipline (substrate workspaces ship no MCP code).

## Cross-plan references

- **Substrate plan**: [`graph-stack.plan.md`](../../../connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md) (active; owns
  WS4.4 + WS4.5).
- **Corpus plan**: [`./eef-evidence-corpus.plan.md`](./eef-evidence-corpus.plan.md)
  (current; owns t1, t2, t6a, t9, t10, t12, t13, t20 and the residual gate-1b
  surface).
- **MVP-arc spine**: [`../../../graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md)
  (owns gate-1a's milestone-level acceptance; this plan executes the gate-1a
  thread).
- **Query-layer plan**: [`../../../connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md`](../../../connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md)
  (current; owns T2 interface specification, which is what WS4.4 implements).
- **Authoritative ADRs**: [ADR-123](../../../../docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md)
  (MCP primitives strategy), [ADR-157](../../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
  (namespace + `_meta`), [ADR-173](../../../../docs/architecture/architectural-decisions/173-graph-stack-topology.md)
  (graph-stack topology, first-wave ingestion scope), [ADR-175](../../../../docs/architecture/architectural-decisions/175-evidence-corpus-freshness-governance.md)
  (freshness governance), [ADR-179](../../../../docs/architecture/architectural-decisions/179-substrate-vs-transport-discipline.md)
  (substrate-vs-transport discipline).

## Conservation property

Every item described here exists in one of:

- `graph-stack.plan.md` (substrate todos: WS4.1, WS3.3, WS4.4, WS4.5)
- `eef-evidence-corpus.plan.md` (corpus todos: t1, t2, t6a, t9, t10, t12, t13,
  t20 + partials)
- `graph-mvp-arc.plan.md` (gate-1a milestone definition: gate-0a, gate-1a)

This plan does not duplicate. It coordinates. The conservation map
[`../reference/conservation-map.md`](../reference/conservation-map.md) records
the extraction audit trail.

## Promotion to ACTIVE

Promotes when the substrate floor (graph-stack Inc.1d) lands and the
partnership-conversation opener (`ff1`) executes. Without either, the gate-1a
delivery contract cannot start — the substrate is the technical precondition;
the partnership opener is the source-authority precondition.
