---
title: "EEF graph tool completion - impact-led rebuild plan"
status: current
lane: current
type: executable
thread: eef
date: 2026-05-30
supersedes: "./graph-tooling-rebuild.plan.md (Goal 2 / D1-D6 + DX execution spine)"
foundation: "./graph-tooling-rebuild-foundation-2026-05-28.md"
owner_scope: >-
  Restructured 2026-05-30 after owner metacognition direction and follow-up.
  This plan is intentionally ordered by value flow, not implementation
  convenience: teacher value and impact -> MCP tools/resources -> graph
  capabilities -> typed graph formation from the fixed EEF corpus. The next
  session should explore and refine value and MCP surface first, then derive the
  graph layer from that. The fixed EEF corpus is constant, known, and annotated
  with `as const`; implementation must preserve that type information end to
  end and must not assert, re-parse, validate, or re-establish type information
  that already exists.
todos:
  - id: d1-value-impact-exploration
    content: "Explore and ratify the teacher value/impact contract: the Sunday-night cover-lesson use case, the agent's role, the evidence-preservation obligations, and the success criteria for useful Oak material enhanced by EEF evidence."
    status: pending
  - id: d2-mcp-tool-resource-contract
    content: "Design, verify, and owner-ratify the MCP tools/resources the user and agent interact with: tool/resource names, descriptions, inputs, outputs, resources, output schemas, interaction order, current MCP SDK/app registration shapes, and when the assistant should use or avoid EEF evidence."
    status: pending
    depends_on: [d1-value-impact-exploration]
  - id: d3-graph-capability-contract
    content: "Derive the graph capability contract from the MCP surface: the reusable graph-core boundary, EEF adapter boundary, Oak lesson-context mapping, and the fundamental/EEF-specific methods required to serve the ratified tools/resources, with no stubs or unused list operations."
    status: pending
    depends_on: [d2-mcp-tool-resource-contract]
  - id: d4-typed-ingest-graph
    content: "Replace the Zod/freshness/fallible loader with an infallible typed ingest that turns EEF_TOOLKIT_DATA into an EefEvidenceGraph while preserving the original as-const type information."
    status: pending
    depends_on: [d3-graph-capability-contract]
  - id: d5-graph-method-implementation
    content: "Implement the graph object and the graph methods required by the MCP contract: query, lookup, traversal, lesson-context evidence, strand lookup, and subgraph expansion."
    status: pending
    depends_on: [d4-typed-ingest-graph]
  - id: d6-mcp-factory-and-eef-surface
    content: "Build the MCP graph factory and register the EEF MCP tool/resource surface in the curriculum MCP app, with derived output schemas and structuredContent-only tool results."
    status: pending
    depends_on: [d5-graph-method-implementation]
  - id: d7-teacher-value-round-trip
    content: "Prove the Sunday-night cover-lesson value path through MCP: an agent uses Oak curriculum tools plus the EEF graph tools/resources to assemble evidence-enhanced lesson material with EEF caveats and provenance preserved."
    status: pending
    depends_on: [d6-mcp-factory-and-eef-surface]
---

# EEF graph tool completion - impact-led rebuild plan

## Metacognition Verdict

The inherited plan began too close to the existing broken tool and then worked
backwards toward value. That is the wrong centre of gravity for the next
session.

The next session's exploration should start with value and impact, then design
the MCP tools and resources the teacher-facing agent will actually use, then
derive the graph layer needed to serve that MCP surface. Only after those
contracts are clear should implementation reach the typed ingest and graph
construction layer.

The runtime relationship is:

```text
teacher -> AI host -> MCP tools/resources -> graph methods -> typed ingested data
```

The implementation relationship is:

```text
fixed EEF data + typed ingest -> graph object with methods -> MCP tools/resources -> teacher value
```

Both views matter. The plan's design order follows the runtime value path. The
code's dependency order follows the implementation path. Confusing those two
orders is how the previous sessions drifted into a tool-shaped but
misaligned system.

The impact is not "make the current EEF tool less wrong." The impact is:

> A teacher under time pressure can ask an AI assistant to assemble useful Oak
> lesson material and have that assistant enrich its choices with relevant EEF
> evidence, while preserving the uncertainty, provenance, and caveats that make
> the evidence honest.

The first concrete use case is a teacher preparing cover material on Sunday
night for a Monday lesson because another teacher is unexpectedly absent. The
teacher trusts Oak's curriculum materials and wants the assistant to adapt or
assemble them in a way that is enhanced by EEF evidence, not replaced by generic
pedagogical advice.

## Value And Impact

Teacher-facing value is the root of this plan. The graph and MCP layers are
delivery mechanisms. They are correct only if they make the assistant better at
the cover-lesson job without hiding uncertainty or inventing evidence.

When this plan is complete, an AI assistant in ChatGPT, Claude Desktop, Gemini
Desktop, or another MCP-capable host can help a teacher:

- find or assemble relevant Oak lesson material for a specific subject, key
  stage, and topic;
- ask for relevant EEF evidence when pedagogical choices need grounding;
- receive a scoped EEF subgraph instead of an inert full-corpus dump;
- inspect any returned EEF strand as a full typed evidence node;
- traverse from a returned strand to related evidence when the relationship
  matters;
- preserve EEF attribution, caveats, evidence strength, cost, and impact in the
  material it drafts for the teacher.

The teacher should experience this as practical help under time pressure:
usable cover material, clearer pedagogical choices, and transparent evidence
caveats. The teacher should not need to know that a graph exists.

## Design Direction

The next session should explore and refine the plan in this order.

### 1. Value And Impact Contract

Start by specifying the teacher job and the assistant behaviour.

The first value scenario is:

1. A teacher asks for Monday cover lesson material for a specific subject, key
   stage, and topic.
2. The assistant searches and fetches relevant Oak curriculum material.
3. The assistant decides whether EEF evidence is relevant to the task.
4. If relevant, the assistant uses the EEF MCP surface to retrieve a scoped
   evidence structure.
5. The assistant follows any necessary related evidence.
6. The assistant produces material that uses Oak content and explains which EEF
   evidence shaped the pedagogical choices.
7. The answer preserves caveats, attribution, evidence strength, cost, and
   impact. It does not present EEF averages as guarantees.

The exploration should answer:

- What teacher question should the first scenario optimise for?
- What would make the answer tangibly more useful than Oak retrieval alone?
- What EEF caveats must always travel with the assistant's answer?
- What should the assistant refuse to infer from EEF evidence?
- What is the smallest successful round trip that proves user value?

### 2. MCP Tools And Resources

The user does not interact with the graph directly. The user interacts with an
AI host. The host interacts with MCP tools and resources. Therefore the MCP
surface is the first technical design surface that needs to be right.

The MCP surface must describe its value to the assistant in model-facing terms:

- when EEF evidence is relevant;
- what kind of pedagogical decision the tool can inform;
- what the tool cannot prove;
- how to preserve evidence caveats;
- when to inspect a node;
- when to expand a subgraph;
- how to combine EEF evidence with Oak curriculum material.

The initial MCP surface to explore is a small suite:

1. `eef-evidence-for-lesson-context`

   A tool for retrieving an EEF evidence subgraph scoped to a lesson context.

2. `eef-evidence-strand-by-id`

   A tool or resource-backed lookup for inspecting one full EEF strand.

3. `eef-evidence-subgraph-around-strands`

   A tool for expanding from one or more known strands to a bounded related
   subgraph.

The next session should decide which surfaces are best represented as MCP
tools, which are best represented as MCP resources, and which resource
templates are useful. Candidate resources include:

- an EEF corpus metadata resource carrying attribution, caveats, version, and
  last-updated information;
- an EEF strand resource for full-node inspection by id;
- an EEF subgraph resource or resource template if a stable URI form is useful
  after a tool returns a subgraph.

The plan should not assume the final tool/resource boundary before that
exploration. D2 exists to ratify the boundary, names, descriptions, schemas, and
assistant interaction pattern before graph internals are built.

D2 must verify the installed MCP SDK and current curriculum MCP app registration
shape before it ratifies protocol-specific details. This includes tool output
schemas, resources, resource templates, and empty-`content` tool responses with
`structuredContent`.

Each output schema must be produced by the same data-backed mapper or factory
that defines the returned output envelope. The plan must not create a
hand-maintained JSON or Zod schema beside the payload constructor, because that
would recreate the parallel-schema drift this work is trying to remove.

### 3. Graph Capability Contract

The MCP tools/resources interact with the graph. The graph exists to provide
the operations the MCP surface needs, not to expose every graph operation that
could be imagined.

The graph capability contract is derived from D2. The following are
non-contractual capability examples, included only to help the next session
reason about likely needs. Exact names and signatures are not settled until the
D3 contract is ratified:

```typescript
queryNodes({ filter }) -> readonly TNode[]
getNode({ nodeId }) -> Result<TNode, NodeNotFound>
subgraph({ rootIds, depth }) -> Result<GraphSubgraph<TNode, TEdge>, GraphRequestError>
```

Likely EEF-specific capability examples are:

```typescript
evidenceForLessonContext(context) -> EefEvidenceSubgraph
evidenceStrandById({ strandId }) -> Result<EefStrand, NodeNotFound>
evidenceSubgraphAroundStrands({ strandIds, depth }) -> Result<EefEvidenceSubgraph, GraphRequestError>
```

These are starting hypotheses, not permission to hard-code the old tool shape.
D3 ratifies the final graph contract after D2 ratifies the MCP surface.

Refinement carried from the prior session (compile-time-construction insight):
the EEF strand-by-id retrieval is not a `NodeNotFound`-returning lookup. Because
the EEF key space is fixed and fully known, the lookup is compile-time
constructed and total over valid keys; the only fallible step is narrowing a
genuinely-external string at the MCP boundary with
`isValidStrandKey(value): value is EefStrandId` (false -> an input error at the
request boundary), after which the typed lookup cannot miss. The generic
`graph-core` `getNode` may still return a `Result` because a generic graph's key
space is open; totality is a property of the EEF fixed-corpus adapter, not of
graph-core. Final names and signatures remain D3 work.

The graph contract must keep these rules:

- the reusable graph-core layer is transport-agnostic;
- the EEF fixed-corpus adapter is the first graph-specific adapter, not the
  generic graph pattern itself;
- Oak lesson-context-to-EEF query mapping is a consumer or EEF-specific mapping
  layer, not generic graph core;
- the MCP consumer factory is separate from graph substrate packages;
- every exposed graph method is implemented;
- no stubs appear in the interface;
- no rank, cap, list, or projection operation appears unless it directly serves
  the ratified MCP surface;
- subgraphs return complete member nodes and all edges among members;
- frontier references identify related nodes outside the returned members;
- graph request errors live at the external request boundary.

### 4. Typed Graph Formation

The graph is formed from graph methods over ingested data.

`packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
exports `EEF_TOOLKIT_DATA` annotated with `as const`. This file is the source
of truth for the EEF corpus in this repo. Its type is the data's own type.

Fixed-data discipline (the chosen approach): whenever data is fully known in
advance, build from the constant at compile time so types stay exact at every
point, rather than reassembling the data with runtime lookups, parsing, or
iteration that erase the constant's type information. This is the reason the repo
has a codegen step at all: codegen exists to manufacture a compile-time-known
constant and thereby create the opportunity for compile-time construction. The
EEF corpus already ships that exact constant (`EEF_TOOLKIT_DATA`), so it needs no
codegen or extra processing step — we build directly from it.

Both approaches are named deliberately, and the choice is not in doubt:

- compile-time construction from the constant — derived aliases, mapped lookup
  types, and indexed access that keep exact types end to end. This is the chosen
  approach.
- runtime lookup/processing of the corpus — rejected for this fixed data: it
  re-derives at runtime what the constant already proves at compile time, and
  widens the types in doing so.

The one legitimate runtime element is at the genuine external boundary: an MCP
tool receives an arbitrary string, which is narrowed into the known type space
with a type-guard predicate (e.g. `isValidStrandKey(value): value is
EefStrandId`, the house pattern of `isKeyStage` / `isToolName`). A predicate is
not a type assertion. After narrowing, compile-time exactness resumes.

Schema-first scoping: schema-first derivation (Zod / `z.infer`) is the discipline
for the upstream OpenAPI surface, where types are codegen'd from the API schema.
It does not apply to this fixed corpus, whose `as const` constant is its own type
authority — here the data is the schema. This is a scoping correction, not an
abandonment of schema discipline.

The implementation must not throw away that type information and then recreate
it with Zod, manual interfaces, `unknown`, type assertions, or runtime parsing.

Allowed:

- derive aliases with `typeof` and indexed access;
- derive vocabularies and output shapes from the constant;
- construct graph indexes and output envelopes from the constant;
- narrow genuinely-external request input (e.g. an MCP tool's string argument)
  with type-guard predicates such as `isValidStrandKey(value): value is
  EefStrandId` — backed by a runtime membership check, this is the house pattern
  (`isKeyStage`, `isToolName`), not a type assertion.

Forbidden:

- `unknown` at the fixed-data boundary;
- Zod parsing of the fixed corpus;
- freshness gates for the fixed corpus;
- type assertions that "recover" a shape the constant already has;
- hand-authored parallel schemas for the fixed corpus.

The typed construction step is:

```typescript
createEefEvidenceGraph(EEF_TOOLKIT_DATA) -> EefEvidenceGraph
```

The graph object carries:

- the original fixed corpus reference;
- a typed node collection in corpus order;
- a typed id-to-node lookup;
- typed `related_strand` edges;
- graph metadata derived from `EEF_TOOLKIT_DATA.meta`;
- fundamental graph methods required by the MCP contract;
- EEF-specific graph methods required by the MCP contract.

Because the input is fixed and known, construction is infallible for data-shape
purposes. External requests to graph methods can still fail, for example when a
tool call asks for an unknown node id. That failure belongs to the request
boundary, not to ingest.

### 5. MCP Factory And App Integration

The MCP factory belongs to the transport-side consumer layer, not to graph
substrate workspaces. It takes a graph object plus the ratified MCP
configuration and produces tools/resources for the curriculum MCP app.

The factory owns:

- tool names and resource URIs/templates;
- model-facing descriptions;
- input schemas at the MCP request boundary;
- output schemas derived by the same data-backed mapper or factory that defines
  the chosen tool/resource output envelopes;
- handler wiring;
- structuredContent-only tool result formatting;
- resource result formatting;
- telemetry hook wiring.

The factory does not validate the fixed corpus and does not require graph
substrate packages to import MCP types.

The curriculum MCP app registers the EEF graph surface behind
`OAK_CURRICULUM_MCP_EEF_ENABLED` alongside the existing Oak curriculum tools.
The EEF lesson-plan prompt is updated to describe how the assistant should use
Oak curriculum content and EEF graph evidence together.

## Carried Context From The 2026-05-30 Session

Artefacts already in the tree from the session that produced this plan
restructure, so the next session does not rediscover or duplicate them:

- `strandById`, `Strand`, and `StrandByStrandId` exist in
  `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`.
  They are a compile-time precise keyed-lookup seed (literal id -> exact strand),
  added ahead of D4; D4 likely relocates them into the typed-ingest module.
- Direction notes were added to the headers of `eef-toolkit.external-data.ts`,
  `loader.ts`, and `strand-schema.ts` marking the Zod/freshness path as redundant
  for the fixed corpus and under active removal. They describe current behaviour
  honestly and point to this plan; they do not assert the removal as done.
- The old `strands` Set (runtime id membership) was removed; no runtime id
  surface currently exists. `isValidStrandKey` and the id-to-node lookup will
  reintroduce one (build once, per D4).
- The `validate-external-data-files` repo-validator
  (`agent-tools/src/external-data/`) still follows the **superseded, incorrect
  shape**. Run this session, it fails on `eef-toolkit.external-data.ts`: it
  demands `EEF_TOOLKIT_DATA` be typed `: unknown` (so it is "validated at a loader
  boundary") and forbids any logic in the file (flagging `strandById`). The
  `: unknown` requirement is wrong under the ratified fixed-data doctrine —
  `as const` is the correct and stricter shape, and the data is its own type
  authority. The validator's whole premise (external data is untrusted input that
  must be re-validated at a boundary) does not hold for a fixed, fully-known
  corpus; we probably do not need this validator at all for the EEF corpus. Its
  disposition is part of the ADR/doctrine exploration (D3) and the typed-ingest
  work (D4). Do **not** "fix" the data to satisfy the stale validator — the
  validator must catch up to the doctrine, or be retired, not the reverse.

## Fully Specified End State

The plan is complete when the following are true.

### User Value

- The Sunday-night cover-lesson scenario is ratified as the first value proof.
- The assistant can combine Oak curriculum material with EEF graph evidence in
  a way that makes the teacher's answer more useful than Oak retrieval alone.
- Scenario output includes EEF attribution and caveats and does not flatten
  uncertainty into a recommendation list.
- The teacher-facing answer does not require the teacher to understand the graph
  or the implementation layers.

### MCP Surface

- The EEF MCP surface has ratified tool and resource boundaries.
- Tool and resource descriptions explain the cover-lesson value path and the
  evidence-preservation obligations.
- Each MCP tool has an input schema for the request boundary.
- Each MCP tool has an output schema derived from its selected output shape.
- Each output schema is generated from the same data-backed mapper or factory as
  the returned payload, rather than maintained as a parallel schema.
- Each MCP resource or resource template has a defined URI, payload shape, and
  model-facing purpose.
- Graph tools return `structuredContent` only with `content: []`.
- The app exposes no EEF tool, resource, or prompt when the flag is off.

### Graph Layer

- The graph exposes only methods required by the ratified MCP surface.
- Fundamental methods exist and are tested on the real EEF corpus.
- EEF-specific methods exist and are tested on the real EEF corpus.
- Nested filtering works where the MCP surface requires it.
- Returned subgraphs contain full nodes, member edges, and frontier references.
- There is no `NotImplementedYet` symbol or equivalent stub in the graph stack.

### Data And Types

- `EEF_TOOLKIT_DATA` remains the only fixed corpus source.
- `EefToolkitData`, `EefStrand`, `EefStrandId`, `EefKeyStage`, and
  `EefPriority` derive from `EEF_TOOLKIT_DATA`.
- No consumer accepts the corpus as `unknown`.
- No Zod schema parses the fixed corpus.
- No runtime or build-time freshness gate blocks the fixed corpus.
- No type assertion re-establishes a shape already present in the `as const`
  data.
- `createEefEvidenceGraph(EEF_TOOLKIT_DATA)` creates an `EefEvidenceGraph`
  from the fixed corpus.
- Open question for D4: `EefStrand` derived as
  `(typeof EEF_TOOLKIT_DATA.strands)[number]` is a union of the exact per-strand
  shapes, not a single normalized interface. Consumers that assume one node type
  (`GraphView<EefStrand>`, the `makeStrand` test helper, `EefStrand[]`,
  id-to-node maps) must either operate on that union, or D4 must derive a single
  normalized node type from the constant without hand-authoring a parallel
  schema. This is an open question to resolve in D4, not a settled decision.
- Two access modes are distinct and both kept: compile-time literal access yields
  the exact single strand (a literal-keyed lookup); runtime boundary access,
  after predicate narrowing, yields the `EefStrand` node type. Exactness is a
  compile-time-literal property — a runtime string cannot resolve to one specific
  strand type, and that is expected, not a gap.

## Deliverables

Deliverables are ordered by design dependency. Product-code deliverables remain
TDD landings. D1-D3 are deliberately contract-setting work so the next session
can explore and refine value, MCP, and graph shape before implementation.

### D1 - Value And Impact Exploration

**Purpose:** make the teacher value explicit before choosing any tool or graph
shape.

**Do:**

- Explore the Sunday-night cover-lesson scenario.
- Define the teacher-facing job, assistant role, and value claim.
- Define what EEF evidence should add to Oak material.
- Define evidence-preservation obligations: caveats, attribution, evidence
  strength, cost, impact, and uncertainty.
- Define what the assistant must not infer or promise from EEF data.

**Done when:**

- The first value scenario is written clearly enough to test.
- The expected assistant behaviour is described from the user's point of view.
- The evidence caveats and non-claims are explicit.
- Owner ratifies the value statement and success criteria.

### D2 - MCP Tool And Resource Contract

**Purpose:** design the surface the AI host actually uses before designing graph
internals.

**Do:**

- Decide the MCP tool suite and any MCP resources/resource templates.
- Define tool/resource names, descriptions, input schemas, output shapes, and
  output schema derivation rules.
- Define the assistant interaction order for the cover-lesson scenario.
- Define when the assistant should use EEF and when it should avoid EEF.
- Decide which node/subgraph inspection surfaces are tools and which are
  resources.
- Verify the installed MCP SDK and current app registration shapes for tool
  output schemas, resources/resource templates, and empty-`content`
  `structuredContent` tool results.

**Done when:**

- The MCP surface is owner-ratified as a teacher-value delivery surface.
- The owner-ratified contract is written back into this plan or a cited ADR
  before D3 or D4 proceeds.
- Each tool/resource has a model-facing purpose tied to D1.
- Tool/resource payload shapes are selected before graph methods are finalised.
- Output schemas are specified as mappings of the selected data-backed output
  structures.
- Output schemas are generated from the same data-backed mapper or factory as
  the returned payloads, with no hand-maintained parallel schemas.
- The current MCP SDK/app registration shapes have been checked and cited for
  tool output schemas, resources/resource templates, and empty-`content`
  `structuredContent` tool results.
- The contract says how MCP tools/resources interact with the graph without
  importing graph implementation details into the host-facing description.

### D3 - Graph Capability Contract

**Purpose:** derive the graph methods from the ratified MCP surface.

**Do:**

- Define the fundamental graph methods required by D2.
- Define the EEF-specific graph methods required by D2.
- Name the layer split: generic transport-agnostic graph core, EEF fixed-corpus
  adapter, Oak lesson-context-to-EEF mapping, and MCP consumer factory.
- Remove any inherited method from the contract unless the MCP surface consumes
  it.
- Specify subgraph membership, frontier references, request errors, and nested
  filtering only where required by D2.
- Explore the ADR updates this direction implies — not only ADR-173/175:
  - reconcile ADR-173 (it still designates a Zod loader for EEF) and ADR-175
    (external-evidence freshness governance) where they encode the old
    Zod/freshness understanding;
  - correct the EEF typing discipline in ADR-157 (multi-source open-education
    integration) so it matches the fixed-corpus `as const` direction rather than
    an `unknown`/validated-boundary shape;
  - consider an umbrella ADR for the compile-time-construction principle — fixed,
    fully-known data is its own type authority; derive types from it, never
    validate it; codegen exists to manufacture such constants — of which this
    session, `loader.ts`, `strand-schema.ts`, and the `validate-external-data-files`
    validator are all instances.
- Decide the disposition of the `validate-external-data-files` repo-validator,
  which follows the superseded shape (requires `: unknown`, "validated at a loader
  boundary"). Because the EEF corpus is fixed and `as const`-typed, the
  validator's premise does not apply and the likely outcome is that we do not need
  it for this corpus at all. Record the decision; do not bend the data to the
  stale check.

**Done when:**

- The graph contract can serve every D2 tool/resource.
- The graph contract exposes no unbuilt or unused operation.
- ADR-173 no longer requires a Zod loader for EEF.
- ADR-175 has a recorded disposition before D4 proceeds, distinguishing the two
  uses of `meta.last_updated`: freshness as a *trust gate* over the fixed corpus
  is dropped (redundant for compile-time-known data), while `last_updated` as
  *provenance metadata* is retained and surfaced in the subgraph envelope. The
  disposition is an amended ADR or a source-specific owner decision.
- ADR-157's EEF typing discipline matches the fixed-corpus `as const` direction.
- The compile-time-construction umbrella ADR is authored or explicitly deferred
  with a recorded reason.
- The `validate-external-data-files` validator has a recorded disposition: retired
  for the fixed corpus, narrowed so an `as const` canonical constant is no longer
  reported as needing `: unknown`, or an owner decision to keep it with a stated
  reason. The disposition is never "retype the corpus to `unknown`".
- Owner ratifies the value -> MCP -> graph derivation.

### D4 - Typed Ingest Graph

**Purpose:** preserve the fixed data's type information and construct the EEF
graph object without a validation layer.

**Do:**

- Derive EEF types and vocabularies from `EEF_TOOLKIT_DATA`.
- Delete the corpus Zod schema path, freshness path, and loader failure variants
  tied to fixed-data validation.
- Replace `loadEefCorpus` with a pure typed graph constructor or compatibility-
  free renamed entry point.
- Build typed node lookup and edge collections from the constant.
- Resolve the `EefStrand` union-vs-normalized node-type question (see Data And
  Types) before building consumers on it.
- Build the id-to-node lookup once and reuse it as the runtime backing for the
  `isValidStrandKey` predicate (`value in lookup`). The prior session removed the
  old `strands` Set, so no runtime id surface currently exists; this lookup is
  the single one.
- Apply the D3 decision on the `validate-external-data-files` validator. If it is
  retired or narrowed, remove or adjust it alongside the Zod-ingest removal so the
  `as const` corpus and any derived accessors stop being reported as violations of
  the superseded `: unknown`/no-logic contract — never satisfy it by retyping the
  corpus to `unknown`.
- Update exports and tests to consume the typed graph.

**Done when:**

- No `EefToolkitSchema`, corpus `safeParse`, `freshness`, `stale-data`, or
  fixed-corpus `unknown` path remains.
- No type assertion is used to recover EEF corpus shape.
- The graph object exposes the original typed nodes and metadata.
- The `validate-external-data-files` validator no longer reports the fixed
  `as const` corpus (or its derived accessors) as a violation — resolved by
  retiring or narrowing the validator per the D3 decision, not by changing the
  corpus typing.
- Tests prove construction from the real corpus and type-check proves consumers
  use the derived types.

### D5 - Graph Method Implementation

**Purpose:** implement the graph operations required by the MCP contract.

**Do:**

- Implement the ratified fundamental graph methods.
- Implement the ratified EEF-specific graph methods.
- Move lesson-context membership logic out of the MCP tool body and into the
  EEF graph layer.
- Construct the EEF evidence subgraph envelope from the fixed data.
- Delete `NotImplementedYet` and any type-only rank/explain/compare surface not
  consumed by D2.

**Done when:**

- The interface contains no unbuilt operation.
- Worked contexts are pinned as literal id sets from the committed corpus.
- Each worked context returns complete full-node members and all member edges.
- Frontier references are present when related strands sit outside the returned
  members.
- Corpus-level caveats, attribution, data version, and last-updated metadata are
  attached once per subgraph envelope.
- Envelope metadata is additive: full returned strand nodes retain their own
  typed evidence fields and provenance.
- No runtime cap, rank-and-cut, or field-mask-for-budget code remains unless D2
  explicitly ratifies such a surface.

### D6 - MCP Factory And EEF Surface

**Purpose:** expose the EEF graph to agents as the ratified MCP tools/resources.

**Do:**

- Add a factory in the curriculum MCP consumer layer.
- Accept graph methods plus per-tool and per-resource config.
- Produce MCP tool definitions, resource definitions/templates, handlers,
  descriptions, input schemas, output schemas, and telemetry wiring.
- Configure and register the ratified EEF MCP surface.
- Update the EEF prompt/tool descriptions so the assistant knows when and how
  to use the surface for cover-lesson preparation.
- Remove the old `eef-explore-evidence-for-context` implementation shape where
  it conflicts with D2: `projection.ts`, `response-budget.ts`, dual content
  output, and citation revalidation.
- Preserve feature-flag co-gating for EEF tools, resources, and prompt.

**Done when:**

- With the EEF flag on, the ratified EEF tools/resources register and execute
  through the MCP app.
- With the EEF flag off, no EEF tool, resource, or prompt appears in
  registration or the landing page.
- Each tool returns `structuredContent` only with the expected derived output
  schema.
- Resource payloads match the ratified resource contract.
- Tool/resource descriptions explain evidence use, caveat preservation, and
  when not to use EEF.
- Tests prove registration includes the configured output schemas and resources.

### D7 - Teacher Value Round Trip

**Purpose:** prove that the system delivers the intended teacher value.

**Do:**

- Add an MCP-client e2e flow:
  - initialise the server;
  - call existing Oak curriculum tools for a lesson context;
  - call the ratified EEF context tool;
  - inspect or expand a returned strand through the ratified EEF MCP surface;
  - assert all EEF graph tool payloads arrive through `structuredContent`.
- Add a scenario-level assertion for the Sunday-night cover lesson use case.
- Capture telemetry for the EEF graph tool/resource path.

**Done when:**

- The e2e round trip proves graph retrieval, node lookup or resource lookup,
  and graph expansion through MCP.
- The scenario proof shows Oak material and EEF evidence used together.
- The final assistant-facing payload preserves attribution, caveats, evidence
  strength, impact, and cost.
- At least one telemetry span is recorded for the EEF graph path.
- `pnpm check` is green on a settled tree.

## Plan Definition Of Done

The plan is done when all deliverables D1-D7 are complete and:

- teacher value is ratified before the MCP and graph contracts are locked;
- the MCP tools/resources are designed as the user-facing agent surface before
  graph internals are implemented;
- the graph layer exposes only methods required by the ratified MCP surface;
- the fixed EEF data's `as const` type information flows into graph and MCP
  outputs without being thrown away and re-established;
- the ingest layer is a pure typed construction step, not a validation layer;
- ADR-173, ADR-175, and ADR-157 have recorded dispositions compatible with the
  ratified value, MCP, graph, and fixed-data contracts, and the
  compile-time-construction umbrella ADR is authored or explicitly deferred;
- the `validate-external-data-files` validator has a recorded disposition for the
  fixed `as const` corpus (retired or narrowed), never satisfied by retyping the
  data to `unknown`;
- the MCP app exposes the EEF graph as a useful tool/resource surface behind the
  existing feature flag;
- output schemas are derived by the same data-backed mapper or factory that
  produces the actual configured output structures;
- a Sunday-night cover-lesson scenario proves the teacher value path;
- all tests and gates for the touched workspaces pass.

## Non-Goals

- Begin implementation by designing graph internals before D1-D3 are ratified.
- Validate, parse, or freshness-gate the fixed EEF corpus as a runtime or
  build-time trust-boundary check.
- Treat tests of graph construction, subgraph completeness, schema derivation,
  metadata propagation, resources, or MCP behaviour as forbidden; those tests
  remain required.
- Reintroduce `unknown` or type assertions at the fixed-data boundary.
- Build ranking, recommendation, compare, or evidence-analysis tools beyond the
  graph access needed for this first use case unless D2 ratifies them.
- Build a UI widget.
- Flip `OAK_CURRICULUM_MCP_EEF_ENABLED` in any deployed environment.
- Build the next graph corpus before this first graph surface proves the pattern.

## Readiness Reviewers

Before execution moves past D3:

- `assumptions-expert` checks that the value-to-MCP-to-graph bridge is sound and
  that the deliverables are proportional.
- `mcp-expert` checks the tool/resource boundary, output-schema, resource, and
  structuredContent-only design.
- `type-expert` checks the no-type-reestablishment contract.

These reviews test the plan frame. Code-gateway reviewers still run in the
normal loop after product edits.
