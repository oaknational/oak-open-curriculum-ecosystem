---
name: "Graph Tools Substrate Migration (unified)"
overview: "ONE plan owning the move of all existing graph MCP tools (misconception, prior-knowledge, thread-progressions) onto the graph-corpus-sdk substrate. Per tool, migration is ONE replacement unit: data/type re-emission (the generated data becomes its own type authority) + tool rewrite + that tool's projection-derived outputSchema land together. Authored under graph-estate-consolidation Judgement call 4 (owner-ratified 2026-06-02); single upstream of the EEF re-validation gate. Parked until the named promotion trigger: EEF D6 landed + EEF D7 green."
plan_id: graph-tools-substrate-migration
type: strategic
status: future
graph_layer: oak-graph-surface
thread: eef
date: 2026-06-02
isProject: false
related:
  - "../current/graph-estate-consolidation.plan.md (authority: §Judgement calls, call 4)"
  - "../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md (D4–D6 mechanism co-design; D7 value gate)"
  - "../../../sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md (binding §Resolved Sequencing contract)"
  - "../../../sector-engagement/eef/future/eef-revalidate-on-new-graph-tools.plan.md (downstream gate; this plan is its single upstream)"
todos:
  - id: settle-mechanism-at-promotion
    content: "At promotion (trigger: EEF D6 landed + D7 green), settle open Decisions A–F against the landed EEF D5/D6 mechanism: data/type re-emission shape per corpus (A), adapter home + dependency direction with an ADR-041 check (B), the thread-progressions hosting decision (C), the codegen schema-emission shape (D), the per-unit landing order (E), and the factory disposition + third-consumer consolidation shape (F). ONE mechanism shared with EEF — no parallel."
    status: pending
  - id: migrate-misconception-corpus
    content: "Misconception corpus replacement unit: re-emit data/types per Decision A (delete the hand-written interface in src/generated/vocab/misconception-graph/types.ts), rewrite get-misconception-graph + the curriculum://misconception-graph resource onto the migrated substrate, land the projection-derived required outputSchema. One unit; old import surface ends with zero consumers; tool behaviour preserved (no-input, whole-corpus structuredContent + summary/status/oakContextHint envelope)."
    status: pending
    depends_on: [settle-mechanism-at-promotion]
  - id: migrate-prior-knowledge-corpus
    content: "Prior-knowledge corpus replacement unit: re-emit data/types per Decision A (delete the hand-written types + replace the two-step edge-literal validation in src/generated/vocab/prior-knowledge-graph/ with generated narrowing), rewrite get-prior-knowledge-graph + the curriculum://prior-knowledge-graph resource, land the projection-derived required outputSchema. One unit; behaviour preserved."
    status: pending
    depends_on: [settle-mechanism-at-promotion]
  - id: migrate-thread-progressions-corpus
    content: "Thread-progressions corpus replacement unit per Decision C: the data is already as-const type authority; the unit covers its hosting decision, the tool + curriculum://thread-progressions resource rewrite, the three stats-interpolation consumers (ontology-data.ts, tool-guidance-data.ts, tool-guidance-workflows.ts) repointed in the same unit, and the projection-derived required outputSchema. Sequence form preserved — node/edge graph form is forbidden (owner-resolved Q4)."
    status: pending
    depends_on: [settle-mechanism-at-promotion]
  - id: amend-adr-086
    content: "Amend ADR-086 in the same commit as the first corpus re-emission: the hand-written-interface large-graph pattern is superseded by the data-as-type-authority re-emission (Decision A mechanism); correct the stale MCP-tool status rows (the misconception tool is live, not deferred) and the prerequisite-graph/prior-knowledge-graph naming residue."
    status: pending
    depends_on: [settle-mechanism-at-promotion]
  - id: signal-eef-revalidation
    content: "On each replacement-unit landing, raise the landing signal to eef-revalidate-on-new-graph-tools (name the replaced tool + commit). The value re-proof itself is owned by that plan; this plan completes when all three units have landed and signalled."
    status: pending
    depends_on: [migrate-misconception-corpus, migrate-prior-knowledge-corpus, migrate-thread-progressions-corpus]
---

# Graph Tools Substrate Migration (unified)

> **⏸️ PARKED — promotion trigger: EEF D6 landed AND EEF D7 green.** Ownership
> is established now (Judgement call 4,
> [`graph-estate-consolidation.plan.md`](../current/graph-estate-consolidation.plan.md)
> §Judgement calls, owner-ratified 2026-06-02); execution decisions finalise at
> promotion to `current/`. The existing tools are untouched before their
> migration — they work today, and the EEF value proof (D7) runs on them as-is.
> Both trigger gates are observable todo flips in
> [`eef-graph-tool-completion.plan.md`](../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md):
> D6 landing is the first in-tree instance of the shared
> projection→single-Zod-call mechanism this migration reuses; D7 green is the
> value proof the migration scales.

## Problem and intent

Migration ownership for the existing graph tools was scattered and gapped: the
misconception tool had a dedicated re-platform plan (contaminated with retired
`Inc.3` and response-budget framing), while prior-knowledge and
thread-progressions had no migration home at all — all upstream of a single
EEF re-validation gate that any orphaned tool would silently break. Judgement
call 4 unifies that ownership here: **one plan moves every existing graph tool
onto the `graph-corpus-sdk` substrate, so no tool is orphaned and the EEF
re-validation gate has exactly one upstream.**

## Ratified decisions (closed — do not re-open)

Carried from their authoritative sources; this section cites, it does not
re-decide.

1. **One plan owns all existing graph-tool migration** — Judgement call 4,
   [`graph-estate-consolidation.plan.md`](../current/graph-estate-consolidation.plan.md).
   [`graph-stack.plan.md`](../active/graph-stack.plan.md)'s sequencing
   re-frame banner records the same boundary from the substrate side.
2. **Per tool, migration is ONE replacement unit**: the data/type re-emission
   (the generated data becomes its own type authority, replacing today's
   loose `data.json` + hand-written-interface shape), the tool rewrite onto
   the substrate, and that tool's projection-derived `outputSchema` land
   together (Judgement call 4, owner-ratified scope 2026-06-02).
3. **Existing tools are untouched before their migration.** D7 proves value on
   them as-is; *scaling* that value is what this migration owns (Judgement
   call 4).
4. **Sequencing is by consumer-readiness** (ADR-173, 2026-06-01 amendment:
   corpus adapters are built when their consumers exist — this migration is
   that consumer), never a revived increment number.
5. **Binding cross-plan contract** —
   [`output-schemas-for-mcp-tools.plan.md`](../../../sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md)
   §Resolved Sequencing (owner, 2026-06-02): the EEF tool's `outputSchema`
   lands first and alone via EEF D6; the 3 existing graph tools receive theirs
   with their substrate migration; **a tool's schema arrives when the tool is
   built or rebuilt, never before.**
6. **This plan is the single upstream of the EEF re-validation gate**
   ([`eef-revalidate-on-new-graph-tools.plan.md`](../../../sector-engagement/eef/future/eef-revalidate-on-new-graph-tools.plan.md)).
7. **Schema production doctrine** (owner, 2026-06-02, absorbed from the
   graph-tool output-schema design): the static data is the only source of
   truth; the shape is a deterministic, type-strict **projection** of the
   data fed to a **single Zod call**, `satisfies`-tied to the
   `structuredContent` type; never a hand-constructed parallel Zod. For the
   graph tools the chain is emitted as part of code generation.
8. **Q2 — output-only simplification (owner-resolved 2026-06-02, verified in
   code)**: the existing graph tools take no input
   (`createGraphToolExecutor` is `() => CallToolResult`, returning
   `config.sourceData` wholesale —
   `packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts`), so
   the schema projection is purely **structural** (the shape, not every value
   as a literal), which sidesteps the large-`as const` cost.
9. **Q4 — thread-progressions is not graph-forced (owner-resolved
   2026-06-02)**: its data is sequence-shaped (ordered unit sequences per
   thread; a latent thread↔unit bipartite structure exists in the bulk
   source); this plan decides its substrate shape without forcing node/edge
   graph form onto it.

## The tool set, pinned from code (verified 2026-06-02)

Inclusion criterion: a live aggregated MCP tool whose payload is a
bulk-derived generated graph corpus
(`packages/sdks/oak-sdk-codegen/src/generated/vocab/`). The live registry
carries 35 tools (24 generated + 11 aggregated,
`packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`);
exactly three meet the criterion. **The replacement unit is per-corpus**: the
data/type re-emission moves every consumer of that corpus at once — tool,
resource twin, and interpolation consumers — otherwise the estate splits into
two type authorities for one corpus. The per-corpus scope is not added scope:
it is entailed by the ratified re-emission itself — once the corpus's type
authority changes, every importer of the old surface is a compile-time
consumer of the new one, so scoping back to per-tool at promotion would
require accepting the split-brain consequence explicitly.

| Corpus | Data (verified size/shape) | Type authority today | Consumers (complete set) |
| --- | --- | --- | --- |
| misconception | `src/generated/vocab/misconception-graph/data.json` — 6.0MB, 12,858 nodes, **no edges** | Hand-written interface (`types.ts`) annotating required JSON — no validation | `get-misconception-graph` tool (`aggregated-misconception-graph.ts`) + `curriculum://misconception-graph` resource (`misconception-graph-resource.ts`) |
| prior-knowledge | `src/generated/vocab/prior-knowledge-graph/data.json` — 1.8MB, 1,607 nodes, 3,452 edges | Hand-written types + two-step runtime narrowing of edge literals (`index.ts`) | `get-prior-knowledge-graph` tool (`aggregated-prior-knowledge-graph.ts`) + `curriculum://prior-knowledge-graph` resource |
| thread-progressions | `src/generated/vocab/thread-progression-data.ts` — 190KB, 164 threads, ordered unit sequences | **Already `as const` + `typeof`-derived — data is its own type authority** | `get-thread-progressions` tool (`aggregated-thread-progressions.ts`) + `curriculum://thread-progressions` resource + stats interpolations in `ontology-data.ts` (feeds `get-curriculum-model`), `tool-guidance-data.ts`, and `tool-guidance-workflows.ts` |

All three tools are no-input whole-corpus tools registered through the
universal-tools path; all data is produced by the `vocab-gen` pipeline in
`oak-sdk-codegen` from bulk downloads (bulk-data authority, ADR-173 §Corpus
source authority).

**Excluded, with reasons**: `vocabulary-graph` (3.4MB) and
`nc-coverage-graph` (2.3MB) generated data — no tool consumes them, so under
consumer-readiness there is nothing to migrate (their substrate question
fires if and when a consuming tool is proposed); `conceptGraph`
(hand-authored vocabulary schema, not a generated corpus); the 24 generated
API tools and the search/browse/fetch family (no graph data); the EEF tool
(owned end-to-end by the EEF plan).

## End goal, mechanism, means

- **End goal**: every existing graph tool runs on the `graph-corpus-sdk`
  substrate with its generated corpus as its own type authority and a
  projection-derived required `outputSchema` — same observable tool
  behaviour, scaled-up substrate — and the EEF value path is re-proven
  against the replacements.
- **Mechanism**: per-corpus atomic replacement units (re-emission + rewrite +
  schema in one landing) eliminate split-brain states; the shared
  projection→single-Zod-call mechanism (first instance: EEF D6) makes
  schema/data drift a compile error rather than a runtime discovery; the
  eef-revalidate gate converts each landing into a value re-proof.
- **Means**: the frontmatter todos — mechanism settlement at promotion, three
  per-corpus replacement units, the ADR-086 amendment riding the first
  re-emission, and the re-validation signal.

## Open design decisions (named; settled at promotion, not before)

Each decision is held open deliberately: the shared mechanism this plan
reuses (EEF D5/D6) is not yet in the tree, and settling against prose
instead of landed code is the contamination pattern this estate just
finished removing. Grounded facts narrowing each decision are recorded now;
the verdicts land at promotion with architecture review.

- **Decision A — data/type re-emission shape per corpus.** Full `as const`
  emission at 6.0MB is refuted by TypeScript's serialisation limit (TS7056 —
  the documented basis of ADR-086's current split). The candidate mechanism:
  the generator emits precise types **derived from the data** at `vocab-gen`
  time — literal unions for observed finite domains (subject, key stage,
  `rel`, `source`), structural types for unbounded text fields — alongside
  the data, deleting the hand-written `types.ts` files; the data is then its
  own type authority *through the generator* (Cardinal Rule: the heavy
  lifting happens at codegen). The EEF observed/declared-domain pattern
  (`graph-corpus-sdk/src/eef-strands/`) is the in-repo precedent.
  Falsifiable check at promotion: the emitted types compile within normal
  budget over the real 6.0MB corpus.
- **Decision B — adapter home and dependency direction.** ADR-173 names
  `graph-corpus-sdk` as the home of Oak's typed corpus adapters
  (prerequisite, misconception) built when their consumers exist. Whether
  the adapter imports the generated corpus from `oak-sdk-codegen`
  (sdk→sdk workspace dependency — verify against ADR-041 dependency rules)
  or `vocab-gen` emits corpus modules into `graph-corpus-sdk` is settled at
  promotion with architecture review. Both options deviate from one in-repo
  precedent each, and the promotion review weighs which precedent governs:
  option (a) introduces a new sdk→sdk data import edge that does not exist
  today (`graph-corpus-sdk/package.json` depends only on `graph-core` +
  `result`, and the one landed corpus — EEF — holds its data corpus-locally);
  option (b) has `vocab-gen` emitting generated artefacts into a foreign
  workspace, which is equally unprecedented (today it emits only into its own
  `src/generated/`). Constraint: ONE mechanism shared with
  EEF D4–D6 — no parallel mechanism may be invented here.
- **Decision C — thread-progressions hosting.** The sequence shape is
  settled (ratified Q4) and the data is already its own type authority, so
  this corpus's re-emission leg is substantially satisfied today. The open
  question is hosting: a `graph-corpus-sdk` sequence-corpus adapter, or the
  **null-participation option** — the corpus stays in `oak-sdk-codegen`, the
  migration leg is the tool/consumer rewrite + `outputSchema` only, and no
  `graph-corpus-sdk` adapter is created. The null option must be reconciled
  explicitly with Judgement call 4's umbrella intent ("moves all existing
  graph tools onto the substrate") — Q4's substrate-shape latitude is the
  ratified opening for that reconciliation, and hiding the tension would be
  the failure mode. Decided at promotion against the landed EEF mechanism's
  shape; forcing node/edge form is forbidden.
- **Decision D — codegen schema-emission shape** (absorbed open question):
  (a) emit the data + a generated schema module that performs the
  projection + single Zod call at the generated package's compile, or
  (b) emit a fully pre-rendered schema. (a) preserves the
  projection-from-data property; (b) risks re-introducing a serialised
  parallel. Default is (a); confirmed in the mechanism co-design. Grounded
  composition fact for the projection: graph tools always include
  `oakContextHint` (`createGraphToolExecutor` calls `formatToolResponse`
  with no `includeContextHint` override), so the projected `outputSchema`
  treats it as always-present.
- **Decision F — factory disposition and third-consumer consolidation.**
  All three tools share `createGraphToolDef`/`createGraphToolExecutor`/
  `createGraphResource`
  (`packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts`)
  today. The migration must state the factory's disposition (retired,
  retained, or superseded by the adapter pattern), and — per
  consolidate-at-third-consumer — name which per-corpus shapes graduate into
  shared capability rather than being re-implemented three times. The third
  corpus migration is the natural consolidation point; the graduating shape
  is named at promotion, not discovered mid-execution.
- **Decision E — per-unit landing order.** Consumer-readiness, not a number
  sequence. The EEF value path runs on the misconception and prior-knowledge
  tools (the D7 signal tools), so their replacements are what the
  re-validation gate most needs early; thread-progressions is not on the EEF
  value path. The actual order is fixed at promotion against the state of
  the tree.

## Dependencies and sequencing assumptions

| Dependency | Class | Detail |
| --- | --- | --- |
| EEF D6 landed (first instance of the shared projection→single-Zod-call mechanism) | **blocking** | The mechanism this migration reuses must exist as landed code, not prose. Schema-delivery order is also contractually after D6 (§Resolved Sequencing). |
| EEF D7 green (value proven on the live tools) | **blocking** | The migration scales proven value; replacing the signal tools before the proof runs would invalidate the proof's target. |
| Mechanism co-design ratified (W-mech, riding EEF D4–D6) | **blocking** | Subsumed by D6 landing; recorded separately so the co-design obligation is visible. |
| `graph-corpus-sdk` substrate (landed: scaffold, `GraphView`, EEF adapter) | satisfied | PRs #93/#108/#114/#115/#122; verified present 2026-06-02. |
| ADR-041 dependency-direction check for Decision B | **beneficial** | Without it the minimum shippable shape is `vocab-gen` emitting into `graph-corpus-sdk` (no new cross-sdk import edge). |

## Absorption record (disposition ledger)

**`oak-misconceptions-substrate-migration.plan.md`** (absorbed by independent
re-grounding; archived to
[`../archive/completed/oak-misconceptions-substrate-migration.plan.md`](../archive/completed/oak-misconceptions-substrate-migration.plan.md)):

| Claim in the old artefact | Disposition |
| --- | --- |
| "Start only after graph-stack Inc.3 lands the misconception adapter" | **superseded** — `Inc.3` is retired (ADR-173, 2026-06-01 amendment); sequencing is consumer-readiness, recorded in this plan's promotion trigger. |
| "Preserve the Thread IRI response contract" | **already-covered at its true home** — that contract belongs to the parked bounded sub-graph *feature* ([`oak-misconceptions-graph-features.plan.md`](./oak-misconceptions-graph-features.plan.md) §1), not to the live whole-graph tool, which takes no input (verified in code). Nothing carries here. |
| "Preserve the `maxResponseTokens = 16000` budget" | **retired** — the budget mechanism was discarded by the graph-tooling rebuild; the live record is the §1 "Retired" entry in the consolidated features plan. Not carried. |
| "Preserve the 20-context fixture manifest behaviour" | **already-covered** — preserved verbatim in the features plan §1 (fixture-manifest selection scheme). |
| Slice-3a / legacy-graph-factory framing | **superseded** — retired scaffold; the migration target architecture is this plan's. |

**`graph-tool-output-schemas.plan.md`** (design content folded in, as its own
overview directs — "into whose unified plan this design content folds when
that plan is authored"): the schema-production doctrine is ratified decision
7 above; its open questions Q1/Q3/Q5 are Decisions A/B/D; Q2/Q4 are ratified
decisions 8/9; its W-codegen/W-graph-def/W-seam/W-proof workstream shapes are
carried into the per-corpus replacement units; W-mech rides EEF D4–D6 (the
blocking co-design dependency above). The file is archived with a supersession
banner in the same commit as this plan, with its live referrers repointed
(`repo-continuity.md`, `open-questions.md` Q-003) and record-class mentions
left as history.

## ADR obligations

- **ADR-086 amendment (deliverable, same commit as the first re-emission)**:
  the "explicit interface types first (not `typeof`) for large graphs"
  pattern is superseded by the Decision-A data-as-type-authority emission;
  the stale tool-status rows (the misconception tool is live, not "deferred
  until search optimisation complete"), the §4 freeze clause ("No new MCP
  tools until search optimisation is complete" — superseded doctrine, the
  tools ship today), and the
  `prerequisite-graph`/`prior-knowledge-graph` naming residue are corrected
  in the same amendment. Until that commit, ADR-086 remains the live
  doctrine for the existing exports — this plan does not contradict it while
  parked.
- **ADR-173 / ADR-179**: unaffected — this plan implements their
  consumer-readiness and transport-discipline rules (the substrate ships no
  MCP code; the tool surface stays in `oak-curriculum-sdk` and the app).

## Strategic acceptance criteria

Each criterion names its single observable signal.

1. **Per corpus (×3)**: the old import surface has zero remaining consumers —
   proven by the workspace gates (knip/depcruise) plus a `grep` sweep over
   the retired import path returning only history; the tool's `outputSchema`
   appears in `tools/list` and the real `structuredContent` validates against
   it (e2e); an `isError: true` return carries no `structuredContent` and is
   not rejected by `outputSchema` validation (the SDK skips output validation
   on the error path); the full gate chain is green at the unit's single
   landing commit. (Required `outputSchema` at the graph tool type is repo
   policy — Strict and Complete; the MCP spec marks the field optional.)
2. **Type authority**: the hand-written
   `misconception-graph/types.ts` and `prior-knowledge-graph/types.ts` files
   are deleted; no hand-maintained type parallel to any generated corpus
   remains (signal: the files are absent and `pnpm sdk-codegen && pnpm build`
   reproduces the tree).
3. **Behaviour preservation**: each migrated tool returns the same
   no-input whole-corpus envelope as before (signal: the per-tool conformance
   test asserting the `summary`/`status`/`oakContextHint` +
   corpus-`structuredContent` envelope passes unchanged in semantics); the
   three `curriculum://` resource URIs are unchanged post-migration (signal:
   the same URI strings resolve in an e2e `resources/read` call) and the
   resource `mimeType` remains `application/json`.
4. **ADR-086 amended** in the first re-emission commit (signal: the
   amendment section exists citing this plan's Decision A verdict).
5. **Re-validation signalled**: all three landings raised the named signal to
   `eef-revalidate-on-new-graph-tools` (signal: that plan's
   `track-graph-tool-replacements` todo cites the three replacement commits).
   The value re-proof itself is that plan's acceptance, not this one's.

## Risks and unknowns

| Risk | Mitigation |
| --- | --- |
| Type-emission scale: 6.0MB corpus breaks compile budget (TS7056 class) | Decision A's structural emission + ratified Q2 (shape, not value literals); falsifiable compile check at promotion before any unit runs. |
| Mechanism divergence from EEF (two parallel projection mechanisms) | Blocking W-mech/D6 dependency; Decision B's ONE-mechanism constraint; co-design recorded in the EEF plan. |
| Split-brain consumer misses (a corpus consumer left on the old surface) | The pinned per-corpus consumer sets above; acceptance 1's zero-consumer proof. |
| EEF value path silently broken by a replacement | The eef-revalidate gate fires per landing (acceptance 5); the signal tools' replacements are sequenced for early re-proof (Decision E). |
| Dependency-direction violation at the adapter boundary | ADR-041 check named in Decision B; architecture review at promotion. |
| Silent `outputSchema` drop at the universal-tools seam (the three-step asymmetric-drop failure mode recorded in Q-003: a dropped schema leaves graph tools unvalidated while schema-less tools pass) | The seam guard is owned by `output-schemas-for-mcp-tools.plan.md` S0; per-unit, acceptance 1's `tools/list` exposure + `structuredContent` validation proof is the drop-catch for each migrated tool. |
| Estate contamination re-entry via the absorbed artefacts | The disposition ledger above is the absorption boundary; nothing from the archived plans is citable as authority. |

## Non-goals

- No behaviour changes or new features on any graph tool — bounded
  traversal, cross-corpus composition, topic extraction, and extended
  contexts are owned by the parked
  [`oak-misconceptions-graph-features.plan.md`](./oak-misconceptions-graph-features.plan.md),
  gated on D7 + this migration.
- Not the EEF tool (owned by
  [`eef-graph-tool-completion.plan.md`](../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md)).
- Not the `vocabulary-graph` / `nc-coverage-graph` data or any tool over
  them (no consumer exists).
- Not the required-field promotion to the root `UniversalToolListEntry`
  (owned by `output-schemas-for-mcp-tools.plan.md` S0, executed last).
- Not the Oak Curriculum Ontology Threads adapter (graph-stack WS4.2/WS4.3).
- No upstream bulk-pipeline changes beyond the emission shape (extraction
  logic and bulk-data authority are unchanged).

## Promotion trigger (into `current/`)

**EEF D6 landed AND EEF D7 green** — both observable as todo flips in
[`eef-graph-tool-completion.plan.md`](../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md),
with D6's landing additionally observable as the first in-tree
projection→single-Zod-call instance. At promotion: record the trigger
evidence, settle Decisions A–F (the `settle-mechanism-at-promotion` todo) with
architecture + assumptions review, author the executable plan in `current/`
with TDD cycles per replacement unit, and re-verify the pinned tool set and
consumer sets against the tree at that time (this plan's pins are
verified-2026-06-02 facts, re-checked at execution start, not trusted
across the gap).

## Foundation alignment and first-principles check

[`principles.md`](../../../../directives/principles.md) — Cardinal Rule
(types flow from generation; a missing type is a generator bug), Strict and
Complete (required schemas, no constructed optionality), replace-don't-bridge
(no compatibility re-exports during units);
[`schema-first-execution.md`](../../../../directives/schema-first-execution.md)
and the generator-first mindset;
[`tdd-as-design.md`](../../../../directives/tdd-as-design.md) — each
replacement unit is an atomic landing whose describing surface is the tool's
wire envelope (the e2e `tools/list` + `structuredContent` proof), with
lower-level cycles sequenced beneath it;
[ADR-173](../../../../../docs/architecture/architectural-decisions/173-graph-stack-topology.md),
[ADR-179](../../../../../docs/architecture/architectural-decisions/179-transport-agnostic-graph-substrate.md),
[ADR-086](../../../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md)
(amendment carried here). The plan-body first-principles check fired at
authoring (2026-06-02): every outcome above names a single observable signal;
sequencing points only at named gates (D6, D7) or falsifiable
promotion-time checks; no vendor-call shapes are asserted beyond verified
in-tree code.

## Lifecycle triggers

See the
[lifecycle-triggers component](../../../templates/components/lifecycle-triggers.md).
Work shape: strategic plan now; executable promotion later. Touch points:
start-right at session open; an active claim on
`packages/sdks/oak-sdk-codegen/`, `packages/sdks/oak-curriculum-sdk/src/mcp/`,
and `packages/sdks/graph-corpus-sdk/` before the first execution edit
(EEF shares the `universal-tools/` seam — coordinate per §Resolved
Sequencing); session-handoff at boundaries; consolidation at completion.

> Implementation detail in this plan (mechanism candidates, consumer tables,
> workstream shapes) is reference context from completed research, not an
> in-progress execution commitment. Execution decisions are finalised only
> during promotion to `current/`.
