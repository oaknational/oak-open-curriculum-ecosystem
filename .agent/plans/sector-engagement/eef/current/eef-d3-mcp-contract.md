# EEF D3 MCP contract — tool, resource, prompt

The D3 contract artefact of
[`eef-graph-tool-completion.plan.md`](eef-graph-tool-completion.plan.md): the
written MCP surface derived from the owner-ratified D3 decisions, plus the
SDK/app registration verification record. **Status: owner-ratified 2026-06-03**
(after the dedicated independent review-then-ratify session) — the names here
(tool, functions, resource URI, prompt) are contract; everything marked
**D4-bound** is a named but unbound forward reference that D4 ratifies and D6
implements.

Grounding rule ([`eef-corpus-grounding`](../../../../rules/eef-corpus-grounding.md)):
every corpus claim below cites an `EEF_TOOLKIT_DATA` source path (the
[D2 source-path table](eef-d2-source-path-table.md) is the canonical citation
surface); concepts that are the invoking agent's reasoning are tagged
**agent-side**; names this contract itself introduces (function names, envelope
vocabulary) are tagged **contract-defined**.

## The surface (three primitives, one intention each)

| Primitive | Name | Intention (per official MCP concepts) |
| --- | --- | --- |
| Tool | `get-eef-evidence` | Model-controlled deterministic query/fetch over the fixed EEF corpus — the agent decides when evidence is needed and passes only finite corpus values |
| Resource | `eef://interpretation` | Application-driven read context for applying the evidence faithfully — the host may browse, attach, or inject it without the model choosing an action |
| Prompt | `adapt-lesson` | User-controlled workflow template that starts the evidence-grounded adaptation workflow |

Elicitation and sampling are **not** part of this surface (plan D3 "Do":
elicitation only for a future host-supported structured-context need, never for
sensitive information; sampling only after a separate owner-ratified design).
All three primitives co-gate behind `OAK_CURRICULUM_MCP_EEF_ENABLED` (D6).

## The tool: `get-eef-evidence`

- **Title**: "EEF Evidence (Teaching and Learning Toolkit)".
- **D1-tied purpose**: surface the corpus's evidence for a pedagogical move the
  invoking agent has already named, with strength, cost, impact, caveats, and
  attribution intact, so the assistant can adapt Oak material as
  evidence-calibrated options for the teacher.
- **Family**: a graph universal tool — the same family as
  `get-misconception-graph` / `get-prior-knowledge-graph` (both in
  `AggregatedToolName`,
  `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts:121-149`);
  it registers through the universal-tools path, not a bespoke bypass.
- **Shape**: ONE tool with function/options dispatch
  (`name -> function -> options`, multitool-CLI style). No second tool layout
  exists or is recorded.
- **Annotations** (deliberate, not schema substitutes): `readOnlyHint: true` —
  the tool is a deterministic projection of a fixed constant; no other
  annotation carries contract weight.
- **Model-facing description** (use/avoid, D1 §use-and-avoid): use when the
  teacher asks for evidence context OR when the assistant is already adapting,
  combining, or framing Oak material pedagogically; avoid for curriculum
  retrieval alone, guaranteed outcomes, individual-pupil causal claims, or
  teacher-replacing selection. Every invocation is preceded by a terse
  agent-stated rationale ("EEF because: [pedagogical choice]" — pattern, exact
  wording free). Evidence returned is population-level; caveats and attribution
  must travel into anything drafted from it.

### Functions (contract-defined dispatch values)

| Function | Does | Returns |
| --- | --- | --- |
| `evidence-for-move` | Returns the evidence subgraph for the strands matching the supplied selectors — the strands the agent mapped the pedagogical move to, and/or strands matching observed-axis filters (the plan's evidence query + bounded subgraph-around-strands operations) | Evidence envelope (members + edges + frontier + provenance) |
| `inspect-strand` | Returns the single-strand subgraph for one known strand id — full evidence fields, its `related_strands` edges, frontier refs (the plan's total strand-by-id lookup) | Evidence envelope (one member) |

These two functions are exactly the tool's plan-assigned scope: "corpus-derived
evidence options and strand inspection" (plan §D3 primitive targeting). Corpus
metadata and methodology are the **resource's** job by the same targeting —
the tool does not duplicate them. `inspect-strand` with one id and
`evidence-for-move` with `strandIds: [oneId]` return the same envelope; the
two functions exist because they are the plan's two named operations
(axis evidence query; total by-id lookup), and the overlap at
cardinality one is stated here rather than hidden. **agent-side**: choosing
which strands a move maps to, and weighing impact-for-effort, is the invoking
agent's reasoning (plan Decision 10) — no function performs it.

### Input contract

Every externally supplied field is classified and narrowed by predicate at the
boundary before it reaches graph code. The MCP input schema proves structure;
membership of finite domains is proven by fixed-data predicates; the only
genuinely unknown value class is the strand key (plan Decision 5).
Discoverability is schema-borne: because the input schema derives from
corpus-derived literal unions, the published `inputSchema` (returned in
`tools/list`) enumerates the full finite vocabulary — all 30 strand ids and
every observed axis value — so the model sees the valid key space before its
first call.

| Contract field | Classification | Graph-native subset (D4-bound) | Raw EEF source path | Proof test |
| --- | --- | --- | --- | --- |
| `function` | contract-defined dispatch literal (not corpus data) | — | — | D6 registration/dispatch tests |
| `strandIds` (`evidence-for-move`) | strand-key predicate (`isValidStrandKey` per element) | `eefStrandIdSubset` | `strands[number].id` | `strand-lookup.unit.test.ts` |
| `strandId` (`inspect-strand`) | strand-key predicate | `eefStrandIdSubset` | `strands[number].id` | `strand-lookup.unit.test.ts` |
| `phase` | observed finite EEF-corpus-vocabulary predicate (`ObservedPhase`) | `eefObservedPhaseSubset` | `strands[number].school_context_relevance.most_relevant_phases` | `raw-domains.unit.test.ts` |
| `keyStage` | observed finite EEF-corpus-vocabulary predicate (`ObservedKeyStage`) | `eefObservedKeyStageSubset` | `strands[number].school_context_relevance.most_relevant_key_stages` | `raw-domains.unit.test.ts` |
| `priority` | observed finite EEF-corpus-vocabulary predicate (`ObservedPriority`) | `eefObservedPrioritySubset` | `strands[number].school_context_relevance.most_relevant_priorities` | `raw-domains.unit.test.ts` |

Exact-value filters over the graph-projected raw headline metric domains
(`impactMonths`, `costRating`, `costLabel`, `evidenceStrengthRating`,
`evidenceStrengthLabel`) are **not v1 inputs** — owner-deferred (2026-06-03) to
[`eef-tool-metric-filter-inputs.plan.md`](../future/eef-tool-metric-filter-inputs.plan.md),
sequenced after D7: strands are 1–5.5KB, the leverage lens is agent-side over
returned headline facts, and exact-match filtering has no v1 consumer.

Boundary rules:

- No bucket labels, threshold cut-offs, ranking weights, or comparator
  semantics exist as inputs, in v1 or in the deferred metric-filter
  enhancement. "High-impact for low effort" is **agent-side** reasoning over
  returned facts.
- The declared-only values — phase `post_16` / `all_through` / `special`, key
  stage `KS5`, priority `improving_attendance` / `teacher_retention`
  (`declaredVsObservedDivergence`; D2 table §"Declared metadata domains") — are
  not valid filter inputs; the filter domains are the observed domains exactly.
  This is snapshot-relative, not fundamental: the observed domains are derived
  from the constant, so a future snapshot that tags strands with these values
  widens the filter domains automatically, with no design change. Outside the
  strands, these values appear only as declaring vocabulary
  (`school_context_schema`, whose own description targets an upstream
  `recommend_for_context` concept this surface deliberately assigns to the
  agent, plan Decision 10) and as definitional school-leader context
  (`uk_context.key_stage_mapping.KS5`) — never as evidence content. A boundary
  rejection is chosen over an empty result because the two make different
  claims: rejection says "this snapshot indexes nothing along that value";
  an empty envelope would imply "searched the evidence and found none".
  Coverage nuance: `meta.coverage.age_range` is "3-18 year-olds", so the
  absence of a `KS5`/`post_16` tag must not be read as post-16 irrelevance —
  applicability tags are sparse curation, not applicability boundaries (the
  interpretation resource carries this guidance).
- Axis selectors match strands through `school_context_relevance`, which 17 of
  30 strands carry — an axis-filtered call can never surface the other 13.
  The interpretation resource's corpus-cited strand index is the
  corpus-complete discovery surface; axis filters are a focusing convenience
  over the tagged subset, not the discovery path.
- `evidence-for-move` requires at least one selector (`strandIds`, `phase`,
  `keyStage`, or `priority`): the unscoped whole-corpus call
  is contractually invalid (D1: a focused subgraph, not the whole corpus). This
  is a semantic predicate at the handler boundary, returned as `isError: true`,
  not a structural schema rule.
- An unknown strand key fails `isValidStrandKey` and returns `isError: true`
  with the invalid key named. Subject, topic, and any free-form teacher or Oak
  context never reach the tool (plan Decision 10; no-crosswalk rule below).

### Output contract — the evidence envelope (contract-defined name)

One output shape for both functions: the **evidence envelope**. A function's
result varies only by member count — no root-level union, no per-function
output layouts, no conditional fields.

| Contract field | Graph-native subset (D4-bound) | Raw EEF source path | Proof test |
| --- | --- | --- | --- |
| `members[]` — full strand nodes: the V1 set (owner-ratified 2026-05-31, extended 2026-06-03): `id`, `name`, `slug`, `eef_url`, `headline` (the six universal fields, plus `number_of_studies` where the corpus carries it, 2/30), `definition`, `key_findings`, `tags` (floor); `effectiveness` (incl. `summary`, `mechanisms`), `implementation` (incl. `key_considerations`, `common_pitfalls`, `digital_technology_application`), `school_context_relevance` (travelling whole; incl. `behind_the_average_by_phase`, `applications`), `behind_the_average`, `closing_the_disadvantage_gap` (optional, presence per corpus) | `eefEvidenceEnvelopeSubset` (member payload) | per-field rows of the D2 table §§Strand identity / Universal floor / Corpus-sparse | D2 table column 4; D5 constructor test; D7 verbatim proof |
| `members[]` — guidance-report nodes `{ title, url }` reached by `has_guidance_report` edges (D4-ratified node kind, deduplicated across strands) | `eefGuidanceReportNodeSubset` | `strands[number].related_guidance_reports` | D5 constructor test |
| `edges[]` — typed edges among members (`related_strand`, `has_guidance_report`) | `eefEvidenceEnvelopeSubset` (edge set) | `strands[number].related_strands`; `strands[number].related_guidance_reports` | `raw-domains.unit.test.ts` (edge facts); D5 |
| `frontier[]` — refs to related strands outside the members | `eefEvidenceEnvelopeSubset` (frontier refs) | `strands[number].related_strands` | D5 traversal tests |
| `provenance` — once per envelope: source attribution and the corpus caveats, nothing else (`data_version` / `last_updated` are internal debugging/logging metadata per the ratified D1 V2 decision — they do not enter `structuredContent`; D6's telemetry wiring is their home) | `eefProvenanceSubset` | `meta.source`, `meta.licence`, `meta.caveats` | `corpus-meta.unit.test.ts` |

Output rules:

- **Optionality is dictated by the graph-native view type**: a field optional in
  the view (because the corpus carries it on a subset of strands) is optional in
  the schema via the `satisfies` tie — derived at the point of use, never
  counted or classified (D2 table preamble). Honest absence: a floor-only
  strand returns the floor with richer fields omitted, never fabricated.
- Results are compact, deterministic graph facts for the invoking agent — not
  teacher-facing prose, not interpretive boilerplate. Reusable interpretation
  guidance lives in `eef://interpretation`.
- Per-strand `eef_url` plus envelope source attribution satisfy the corpus
  licence obligation that all EEF-derived outputs attribute EEF and link to the
  original strand pages (`meta.licence.attribution_note`).

### The schema rule (plan Decision 2 — controlling)

Two named schema-builder values, both **D4-bound** and implemented in D6:

- `eefToolInputSchemaSource` — typed from the graph-native view's key/domain
  types (`EefStrandId`, observed domains);
  `inputSchema` derives from it by ONE Zod call, `satisfies`-tied to the input
  payload type.
- `eefToolOutputSchemaSource` — typed from `eefEvidenceEnvelopeSubset`;
  `outputSchema` derives from it by ONE Zod call, `satisfies`-tied to the
  `structuredContent` type.

Each schema root serialises to an object (`type: object`); these two
declarations are the only Zod in the EEF graph stack. Results are
`structuredContent`-only with `content: []` (settled Oak decision); error
returns use `isError: true` so the SDK skips output validation.

Placement (ADR-179 / ADR-041): the schema-builder values and the Zod calls
live in the curriculum MCP consumer layer — never in `graph-corpus-sdk` or
`graph-core`. The substrate owns the corpus types and the graph-native view;
the MCP-shaped schema sources are built downstream of it (the
`graph-corpus-sdk` barrel TSDoc states the same boundary). D4 ratifies the
subset names; it does not relocate them into the substrate.

## The resource: `eef://interpretation`

- **Name**: `eef-interpretation`; **URI**: `eef://interpretation` (static
  resource — the payload has no parameters, so no resource template is needed;
  house URI style per `docs://oak/*` and `curriculum://model`).
- **MIME**: `text/markdown`.
- **D1-tied purpose**: the static reasoning scaffold of Decision 10 — how to
  interpret and apply the evidence faithfully. It guides the agent's reasoning
  but cannot constrain it; it is read context, not executable.
- **Payload shape** (three labelled layers):
  1. **Corpus-cited**: the corpus's own methodology (`methodology` — impact
     measure derivation and interpretation guidance, cost scale, evidence
     strength measure), corpus caveats (`meta.caveats`), source, licence,
     coverage (`meta.source` / `meta.licence` / `meta.coverage`), and the
     **strand index** — `id`, `name`, `headline.headline_summary`, and `tags`
     for all 30 strands (floor fields, 30/30; a deterministic projection,
     ~7KB) — the corpus-complete discovery surface the agent chooses strands
     from, carrying the impact-for-cost one-liner per strand.
  2. **Agent-side (tagged, never presented as corpus evidence)**: the end goals
     (faithful evidence transmission; options not recommendations; preserving
     strength/cost/impact/caveats/limits); how to reach them through the
     Oak/EEF workflow; positive and negative worked examples of faithful versus
     unfaithful evidence use; and how to read sparse curation honestly —
     applicability tags (`school_context_relevance`) exist on 17 of 30
     strands, so the absence of a tag is not evidence of inapplicability
     (corpus coverage is 3-18 year-olds per `meta.coverage`), and the strand
     index, not axis filtering, is the discovery path over the full corpus.
     No EEF evidence categories, caveat classes, or
     strand vocabulary are invented here.
  3. **Graph-structural (D4/D5-bound)**: the ratified field names, edge types,
     provenance-envelope fields, and schema-subset names, so the agent can
     navigate returned envelopes.

## The prompt: `adapt-lesson`

- **Name**: `adapt-lesson` (house style per `find-lessons`, `lesson-planning`,
  `explore-curriculum`). The name carries no "with-evidence" qualifier:
  evidence-grounding is how Oak adapts lessons — it comes from Oak's
  commitment to rigour and pedagogical excellence, not from a special "good
  version" of the workflow (owner-directed 2026-06-03).
- **D1-tied purpose**: the teacher/user-invoked starter for the evidence-grounded
  adaptation workflow — the cover-lesson scenario's entry point.
- **Arguments**: `topic` (required) and `yearGroup` (required) — the same
  argument shape as the sibling `lesson-planning` prompt, which this workflow
  extends with evidence grounding. Free-form values are legitimate HERE — the
  prompt instructs the agent to convert them into Oak retrieval inputs and
  finite EEF tool inputs before any deterministic call.
- **Behaviour**: instantiates the default calling-agent workflow below,
  instructing the agent to preserve caveats/attribution and present options,
  not selections.

## Workflows (contract, not open questions)

Default calling-agent workflow (plan D3, restated as contract):

1. Understand the teacher's task.
2. Use Oak API/search tools for the curriculum material; use Oak's
   misconception and prior-knowledge graphs (plus the lesson's quiz and text)
   to surface the pedagogical signals in it.
3. Name the pedagogical move the signal raises (**agent-side**), then select
   real corpus keys from the resource's corpus-cited strand index (all 30
   strands with name, impact-for-cost summary, and tags) and by inspecting
   corpus-derived definitions, key findings, applicability facts, and graph
   relations. Call
   `get-eef-evidence` / `evidence-for-move` with those finite keys.
4. Call `inspect-strand` only when more detail, caveats, or evidence-shape
   explanation is needed; fetch `eef://interpretation` when applying the
   evidence.
5. Produce teacher-facing output with Oak material, EEF options and trade-offs,
   uncertainty/caveats, and the short EEF rationale.

Primitive-by-primitive targeting rationale (per the official MCP server
concepts): the **tool** is model-controlled because invoking evidence is the
agent's decision and carries only finite values; the **resource** is
application-driven because interpretation context is safe to attach without a
model action; the **prompt** is user-controlled because starting the workflow
is the teacher's act. **Elicitation**: not used — no workflow step requires the
host to ask the teacher for structured context. **Sampling**: not used — the
calling agent already composes Oak and EEF outputs.

## SDK/app verification record

Verified against the installed packages and HEAD (`9fab8669`), 2026-06-02. The
re-verification at D6 build time re-runs these checks against the then-current
tree.

| # | Claim | Verified state | Evidence |
| --- | --- | --- | --- |
| V1 | Installed SDK accepts Zod schemas for `inputSchema`/`outputSchema` | `@modelcontextprotocol/sdk@1.29.0` built against `zod@4.4.3` (workspaces pin `zod ^4.4.3`); `registerTool` config carries `outputSchema?` | pnpm store key `@modelcontextprotocol+sdk@1.29.0_zod@4.4.3`; `dist/esm/server/mcp.d.ts:154,283` |
| V2 | `isError: true` skips output validation | `validateToolOutput` guards in source order: returns early when no `outputSchema`, when the result carries no `content` key (non-CallToolResult task results — never the EEF shape, whose `content: []` carries the key), and on `result.isError`; throws when a schema is declared but `structuredContent` is missing; otherwise validates `structuredContent` | SDK `dist/esm/server/mcp.js` (`validateToolOutput`) |
| V3 | `outputSchema` reaches both register paths | `registerAppTool` spreads its whole config into `server.registerTool` (only `_meta` rewritten); `McpUiAppToolConfig extends ToolConfig` | `@modelcontextprotocol/ext-apps@1.7.3` `dist/src/server/index.js` (`registerAppTool`); `index.d.ts:62,184` |
| V4 | The app registration path currently drops `outputSchema` | The gap is in OUR config assembly, not the SDK: `registerTools` builds `{ title, description, inputSchema, annotations }` (+`_meta`) and no universal-tools surface carries an output schema (`UniversalToolListEntry` has `inputSchema: z.ZodRawShape` only; `AggregatedToolDefShape` has none; `listUniversalTools` projects none) | `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts:173-183`; `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts:120-142`, `definitions.ts`, `list-tools.ts:62-90` |
| V5 | Surfaces that must change for `outputSchema` to reach registration | `AggregatedToolName` union (new tool name), `AGGREGATED_TOOL_DEFS` / `AggregatedToolDefShape` (new entry; output-schema field), `UniversalToolListEntry` (output-schema field AND `inputSchema` field-type widening — today `z.ZodRawShape` only at `types.ts:135`, while the EEF tool's single-Zod-call schema is a `z.object(...)` value; without the widening the assignment forces an `as` cast, the named stop signal), `listUniversalTools`, and the `handlers.ts` config. **Ownership**: the S0 seam belongs to `output-schemas-for-mcp-tools.plan.md` §Resolved Sequencing; EEF D6 lands the seam's first use, first and alone; the extension is additive and leaves existing generated tools unchanged | the same files; `.agent/plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md` §Resolved Sequencing |
| V6 | Resources and prompts register on the same path D6 co-gates | `registerHandlers` calls `registerTools`, then `registerAllResources`, then `registerPrompts` — one site for flag co-gating of tool + resource + prompt | `handlers.ts:144-149`; `register-resources.ts`; `register-prompts.ts` |
| V7 | The flag exists as a dormant seam | `OAK_CURRICULUM_MCP_EEF_ENABLED` is parsed and stored as `runtimeConfig.eefEnabled`; no production code path consumes it yet — D6 wires the co-gating | `apps/oak-curriculum-mcp-streamable-http/src/env.ts:47`; `runtime-config-from-validated-env.ts:39` |
| V8 | `structuredContent`-carrying results are valid in this stack, and the SDK accepts an empty `content` array | The two live graph universal tools return `structuredContent` with a non-empty `content` array (summary + JSON text blocks via `formatToolResponse`) — they prove `structuredContent` works on this path, not the `content: []` shape. The EEF tool's `content: []` shape is the separately owner-ratified target (plan §Fully Specified End State, not re-opened); the SDK's `validateToolOutput` checks `structuredContent` presence and never requires `content` to be non-empty | `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts:220` (`formatToolResponse`); SDK `dist/esm/server/mcp.js` (`validateToolOutput`) |

Schema carrier note for S0/D6: generated tools hand the SDK a
`z.ZodRawShape`; the EEF tool's single-Zod-call schemas are `z.object(...)`
values. The SDK normalises both (`normalizeObjectSchema` accepts raw shapes and
object schemas — SDK `mcp.js` `validateToolInput`), so the universal-tools
entry type extension chooses the carrier shape at S0 settlement; both reach the
SDK intact. The same carrier question applies to `outputSchema` and is equally
settled at S0. The dispatch functions live entirely within the tool's
input schema (`function` is a schema field, not a registry concept): the
registry carries one entry, one input schema, one output schema for this tool,
exactly like every other aggregated tool. One named D6 hazard, in the OUTPUT
schema: `members[].headline.impact_months` carries the corpus value `null`
(4 strands), so its VALUE type is `z.nullable(...)`, never `z.optional(...)`
in the value position — optional signals "field absent", null is a real corpus
value the field carries on all 30 strands; confusing the two widens the schema
against the corpus type. Value-nullability and field-optionality are
orthogonal concerns, never collapsed into one call (the same rule binds the
deferred metric-filter inputs when they land).

## Handoff to D4 (the named unbound values)

D4 ratifies the graph-native EEF view and binds: `eefStrandIdSubset`,
`eefObservedPhaseSubset`, `eefObservedKeyStageSubset`,
`eefObservedPrioritySubset`,
`eefEvidenceEnvelopeSubset` (member payload, edge set, frontier refs),
`eefGuidanceReportNodeSubset`, `eefProvenanceSubset` (source attribution +
corpus caveats), `eefToolInputSchemaSource`, and `eefToolOutputSchemaSource` —
together with the node id/kind policy, edge types (`related_strand`,
`has_guidance_report`), and the provenance-envelope policy. D3 is complete when
these names are ratified as the handed-off set; D6 implements the two Zod
calls.

## Non-claims (restated as contract)

No server-side or plan-authored mapping from Oak signal category, pedagogical
move, misconception, prerequisite, quiz, text, subject, or topic to
`EefStrandId` exists anywhere in this surface. The tool returns exactly what
the corpus holds for the finite keys it is given; relevance judgement, ranking,
and move→strand selection are the invoking agent's reasoning (plan
Decision 10). Teacher-facing output derived from this surface presents
evidence-informed options and limits; it never names a preferred action.
