export const meta = {
  name: 'output-schema-plan-audit',
  description:
    'Audit output-schemas-for-mcp-tools plan: ground current MCP reality, verify every plan claim, gap-analyse related docs, map EEF relationship, assess the proposed API/search/universal/graph split',
  phases: [
    { title: 'Map', detail: 'Fan out region agents to map the real current MCP surface' },
    { title: 'Verify', detail: 'Extract every plan claim, verify each against the real code' },
    { title: 'RelatedDocs', detail: 'Gap-analyse related plans and docs vs the output-schema plan' },
    { title: 'EEF', detail: 'Map the EEF graph-tool plan relationship and graph-as-universal special case' },
    { title: 'Split', detail: 'Assess the proposed four-way split decomposition' },
    { title: 'Synthesis', detail: 'Produce the consolidated audit report' },
  ],
}

const PLAN = '.agent/plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md'

const FILE_MAP = `
KEY PATHS (verified to exist as of this branch):
- Single MCP app (NOTE: the stdio app no longer exists — only this one):
  apps/oak-curriculum-mcp-streamable-http/
    src/handlers.ts, src/app/core-endpoints.ts,
    src/landing-page/render-tools-section.ts, src/generated/widget-html-content.ts
- MCP SDK tooling: packages/sdks/oak-curriculum-sdk/src/mcp/
    universal-tools/  (definitions.ts, descriptor-utils.ts, executor.ts,
        generated-tool-registry.ts, list-tools.ts, types.ts, zod-utils.ts, type-guards.ts, index.ts)
    aggregated-search/, aggregated-fetch/, aggregated-browse/, aggregated-explore/,
        aggregated-curriculum-model/, aggregated-asset-download/, aggregated-user-search/
    aggregated-misconception-graph.ts, aggregated-prior-knowledge-graph.ts, aggregated-thread-progressions.ts
    graph-resource-factory.ts, misconception-graph-resource.ts, prior-knowledge-graph-resource.ts,
        prerequisite-guidance.ts, curriculum-model-resource.ts, thread-progressions-resource.ts
    universal-tool-shared.ts (formatToolResponse lives here), execute-tool-call.ts, public/mcp-tools.ts
- Generated ("API") tools + codegen:
    packages/sdks/oak-sdk-codegen/
    packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/*.ts
- Graph SDK / corpus: packages/sdks/graph-corpus-sdk/src/ (eef-strands/, index.ts),
    packages/libs/graph-project, packages/libs/graph-ingest
- Search SDK: packages/sdks/oak-search-sdk/
- Grep shows 'outputSchema' currently appears in CODE only at
    apps/oak-curriculum-mcp-streamable-http/src/generated/widget-html-content.ts
`

const REGION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['region', 'facts', 'toolList', 'surprises'],
  properties: {
    region: { type: 'string' },
    facts: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['fact', 'evidence'],
        properties: {
          fact: { type: 'string', description: 'A precise factual statement about the current code' },
          evidence: { type: 'string', description: 'file:line citations proving it' },
        },
      },
    },
    toolList: {
      type: 'array',
      description: 'Any MCP tools/resources this region owns, with their real structuredContent top-level field names if discoverable',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'kind', 'outputShape'],
        properties: {
          name: { type: 'string' },
          kind: { type: 'string', description: 'generated | aggregated | graph | search | resource | other' },
          outputShape: { type: 'string', description: 'Real top-level structuredContent fields, or "unknown"' },
        },
      },
    },
    surprises: { type: 'array', items: { type: 'string' }, description: 'Anything that contradicts the plan or is unexpected' },
  },
}

const CLAIMS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['claims'],
  properties: {
    claims: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'text', 'planLocation', 'category'],
        properties: {
          id: { type: 'string', description: 'short stable id e.g. c01' },
          text: { type: 'string', description: 'The atomic factual claim, paraphrased precisely' },
          planLocation: { type: 'string', description: 'section heading or line range in the plan' },
          category: { type: 'string', description: 'inventory | transport | runtime | codegen | sequencing | dependency | design-principle' },
        },
      },
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['claimId', 'verdict', 'evidence', 'correctedStatement'],
  properties: {
    claimId: { type: 'string' },
    verdict: { type: 'string', enum: ['TRUE', 'STALE', 'FALSE', 'PARTIAL', 'UNVERIFIABLE'] },
    evidence: { type: 'string', description: 'file:line citations from independently reading the real code' },
    correctedStatement: { type: 'string', description: 'If not TRUE, the accurate replacement statement; else empty' },
  },
}

const DOC_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['doc', 'exists', 'summary', 'relationship', 'overlaps', 'contradictions', 'recommendation'],
  properties: {
    doc: { type: 'string' },
    exists: { type: 'boolean' },
    summary: { type: 'string' },
    relationship: { type: 'string', enum: ['dependency-of-output-plan', 'depended-on-by-output-plan', 'overlapping-scope', 'superseded', 'supersedes', 'orthogonal', 'unknown'] },
    overlaps: { type: 'array', items: { type: 'string' } },
    contradictions: { type: 'array', items: { type: 'string' } },
    recommendation: { type: 'string', description: 'What the output-schema plan should do about this doc' },
  },
}

const EEF_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['lens', 'findings', 'graphIsSpecialCaseVerdict', 'conflicts'],
  properties: {
    lens: { type: 'string' },
    findings: { type: 'array', items: { type: 'string' } },
    graphIsSpecialCaseVerdict: { type: 'string', description: 'Is "graph tools are a special case of universal tools" actually true in the code? yes/no/partly + why' },
    conflicts: { type: 'array', items: { type: 'string' }, description: 'Conflicts or duplications between EEF output-schema work and the output-schema plan' },
  },
}

const SPLIT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['verdict', 'subPlans', 'graphSpecialCaseAssessment', 'sequencing', 'risks'],
  properties: {
    verdict: { type: 'string', description: 'Is the proposed API/search/universal/graph 4-way split the right decomposition? Direct verdict.' },
    subPlans: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'scope', 'tools', 'dependsOn', 'notes'],
        properties: {
          name: { type: 'string' },
          scope: { type: 'string' },
          tools: { type: 'array', items: { type: 'string' } },
          dependsOn: { type: 'array', items: { type: 'string' } },
          notes: { type: 'string' },
        },
      },
    },
    graphSpecialCaseAssessment: { type: 'string' },
    sequencing: { type: 'string', description: 'Recommended order across the sub-plans' },
    risks: { type: 'array', items: { type: 'string' } },
  },
}

// ----------------------------------------------------------------------------
// PHASE 1 — Map the real current MCP surface
// ----------------------------------------------------------------------------
phase('Map')

const REGIONS = [
  {
    key: 'transport-registration',
    prompt: `You are mapping the CURRENT transport + tool-registration surface of the Oak MCP server. ${FILE_MAP}
Read: apps/oak-curriculum-mcp-streamable-http/src/handlers.ts, src/app/core-endpoints.ts, src/landing-page/render-tools-section.ts, and packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts and registration helpers.
Determine, with file:line evidence:
1. Is there still ANY stdio transport? (grep the whole repo for a stdio MCP SERVER, not logger/test usages).
2. How are tools registered — registerTool vs registerAppTool — and does the registration path currently thread an outputSchema field anywhere? Where exactly would outputSchema have to be added?
3. How does tools/list expose tool metadata today? Is outputSchema present in that projection?
4. How many transports advertise tools, and do they advertise the same set?
Report region='transport-registration'.`,
  },
  {
    key: 'generated-api-tools',
    prompt: `You are mapping the CURRENT generated ("API") MCP tools and their codegen. ${FILE_MAP}
Read across packages/sdks/oak-sdk-codegen/ and packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/tools/ and the universal-tools/generated-tool-registry.ts.
Determine, with file:line evidence:
1. How many generated tools exist NOW (count the generated tool files). The plan claims 24 — verify the real number.
2. Do generated descriptors expose toolOutputJsonSchema and zodOutputSchema today? Is raw upstream-response validation (validateOutput) wired in the executor?
3. What is the real MCP structuredContent wrapper shape for a generated tool (find formatToolResponse usage in universal-tool-shared.ts and the executor)? Capture the actual top-level fields.
4. Is there any existing outputSchema generation at codegen time, or is it entirely absent?
Report region='generated-api-tools', and populate toolList with kind='generated' (a representative sample is fine if there are many, but give the exact count in facts).`,
  },
  {
    key: 'aggregated-tools',
    prompt: `You are mapping the CURRENT aggregated MCP tools. ${FILE_MAP}
Read each aggregated-* directory/file under packages/sdks/oak-curriculum-sdk/src/mcp/ and universal-tools/definitions.ts.
Determine, with file:line evidence:
1. The EXACT current list of aggregated tools (the plan claims exactly 10: search, fetch, get-curriculum-model, get-thread-progressions, get-prerequisite-graph, browse-curriculum, explore-topic, download-asset, user-search, user-search-query). Verify against reality — note any added (e.g. misconception-graph, prior-knowledge-graph, user-search variants) or renamed/removed.
2. For EACH aggregated tool, the real top-level structuredContent fields it emits (read the execution/formatting files).
3. Whether any aggregated tool already declares an outputSchema.
Report region='aggregated-tools' and populate toolList (kind='aggregated' or 'graph' or 'search' as appropriate) with the real outputShape for each.`,
  },
  {
    key: 'universal-tools-layer',
    prompt: `You are mapping the CURRENT universal-tools layer — the canonical transport-neutral descriptor surface. ${FILE_MAP}
Read packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/ in full (definitions.ts, descriptor-utils.ts, types.ts, zod-utils.ts, list-tools.ts, generated-tool-registry.ts, executor.ts, type-guards.ts) and public/mcp-tools.ts.
Determine, with file:line evidence:
1. What the canonical tool descriptor type looks like and whether it has a slot for outputSchema. If not, exactly where it would be added.
2. How generated and aggregated tools are unified into the universal-tools surface (is there a single descriptor shape both flow through?).
3. The relationship between "universal tools" and the two other categories — is "universal tools" the umbrella over generated+aggregated, or a distinct third category? The plan's mental model vs the code's.
4. How Zod schemas are built here (zod-utils) — relevant to the EEF "single Zod call" doctrine.
Report region='universal-tools-layer'.`,
  },
  {
    key: 'graph-tools',
    prompt: `You are mapping the CURRENT graph MCP tools and their relationship to universal tools. ${FILE_MAP}
Read graph-resource-factory.ts, misconception-graph-resource.ts, prior-knowledge-graph-resource.ts, aggregated-misconception-graph.ts, aggregated-prior-knowledge-graph.ts, prerequisite-guidance.ts, and packages/sdks/graph-corpus-sdk/src/ (eef-strands/, index.ts).
Determine, with file:line evidence:
1. Which graph tools/resources exist now and what they expose.
2. Are graph tools registered THROUGH the universal-tools surface (i.e. are they actually a special case of universal tools), or via a separate path? This is a key question — answer with evidence.
3. The real structuredContent shapes of graph tools.
4. How graph-corpus-sdk / eef-strands feed these (the EEF connection).
Report region='graph-tools', populate toolList kind='graph'.`,
  },
  {
    key: 'search-tools',
    prompt: `You are mapping the CURRENT search MCP tools. ${FILE_MAP}
Read aggregated-search/ (definition, execution, formatting), aggregated-user-search/, search-retrieval-types.ts, search-retrieval-stub.ts, and the relevant parts of packages/sdks/oak-search-sdk/ and packages/libs/search-contracts.
Determine, with file:line evidence:
1. The search-family tools (search, suggest mode, user-search, user-search-query) and their real structuredContent shapes — note the plan says search has "different but still object-shaped outputs for scoped search versus suggest mode".
2. Whether search outputs are object-shaped at the root (relevant to the plan's root-type restriction).
3. Whether search shares the formatToolResponse envelope or has its own.
4. Whether search tooling lives in oak-search-sdk vs oak-curriculum-sdk — boundary relevant to a "search tools" sub-plan.
Report region='search-tools', populate toolList kind='search'.`,
  },
]

const maps = (await parallel(
  REGIONS.map((r) => () => agent(r.prompt, { label: `map:${r.key}`, phase: 'Map', schema: REGION_SCHEMA, model: 'sonnet' })),
)).filter(Boolean)

const groundTruthJson = JSON.stringify(maps)
log(`Mapped ${maps.length}/${REGIONS.length} regions of the real MCP surface`)

// ----------------------------------------------------------------------------
// PHASE 2 — Extract every plan claim, then verify each against the real code
// ----------------------------------------------------------------------------
phase('Verify')

const extracted = await agent(
  `Read the plan at ${PLAN} IN FULL. Extract EVERY discrete, checkable factual claim it makes about the current codebase — tool counts, tool inventories, transport behaviour (stdio, universal/HTTP), runtime validation flow, codegen behaviour, what exists / what is missing, dependency/sequencing claims (e.g. "Phase 3 depends on mcp-runtime-boundary-simplification"), and design-principle claims that assert a current fact.
Do NOT extract pure aspirations or future-tense goals — only statements that assert something is currently true and can be checked against the code.
Aim for completeness: it is better to over-extract than miss one. Give each a stable id (c01, c02, ...).`,
  { schema: CLAIMS_SCHEMA, phase: 'Verify', label: 'extract-claims', model: 'sonnet' },
)

const claims = (extracted && extracted.claims) || []
log(`Extracted ${claims.length} checkable claims from the plan`)

const verdicts = (await parallel(
  claims.map((c) => () =>
    agent(
      `Independently verify this claim from the output-schema MCP plan against the REAL current code. Do NOT trust the plan or any summary — read the actual files and cite file:line.
CLAIM (${c.id}, ${c.category}, ${c.planLocation}): ${c.text}
${FILE_MAP}
Ground-truth context already gathered by mapping agents (use as a pointer, but verify yourself):
${groundTruthJson}
Return verdict TRUE only if the claim matches current reality exactly. Use STALE if it was once true but the code has since changed (e.g. stdio removed, counts changed). Use FALSE if it never matched or is wrong. Use PARTIAL if mixed. Provide the corrected statement when not TRUE.`,
      { schema: VERDICT_SCHEMA, phase: 'Verify', label: `verify:${c.id}`, model: 'sonnet' },
    ),
  ),
)).filter(Boolean)

const verdictsJson = JSON.stringify(verdicts)
log(`Verified ${verdicts.length} claims`)

// ----------------------------------------------------------------------------
// PHASE 3 — Gap-analyse related plans/docs vs the output-schema plan
// ----------------------------------------------------------------------------
phase('RelatedDocs')

const DOCS = [
  { key: 'schema-resilience', path: '.agent/plans/sdk-and-mcp-enhancements/active/schema-resilience-and-response-architecture.plan.md' },
  { key: 'download-asset', path: '.agent/plans/sdk-and-mcp-enhancements/current/download-asset-user-only-url.plan.md' },
  { key: 'upstream-ref-metadata', path: '.agent/plans/sdk-and-mcp-enhancements/active/upstream-api-reference-metadata.plan.md' },
  { key: 'upstream-v0.7', path: '.agent/plans/sdk-and-mcp-enhancements/current/upstream-api-v0.7.0-alignment.plan.md' },
  { key: 'runtime-boundary', path: '.agent/plans/sdk-and-mcp-enhancements/archive/completed/mcp-runtime-boundary-simplification.plan.md' },
  { key: 'agg-result-type', path: '.agent/plans/sdk-and-mcp-enhancements/aggregated-tool-result-type-remediation.plan.md' },
  { key: 'roadmap', path: '.agent/plans/sdk-and-mcp-enhancements/roadmap.md' },
  { key: 'protocol-roadmap', path: '.agent/plans/sdk-and-mcp-enhancements/future/mcp-protocol-adoption-roadmap.plan.md' },
  { key: 'current-readme', path: '.agent/plans/sdk-and-mcp-enhancements/current/README.md' },
]

const docAnalyses = (await parallel(
  DOCS.map((d) => () =>
    agent(
      `Read ${d.path} (if it exists). Then determine its relationship to the output-schema plan at ${PLAN}.
The output-schema plan's job: add truthful outputSchema metadata to every MCP tool (generated + aggregated/graph/search), threaded through the canonical universal-tools descriptor surface and exposed via tools/list.
Specifically assess:
1. Does this doc the output-schema plan depends on, or that depends on the output-schema plan?
2. Does it overlap or duplicate scope? (e.g. schema-resilience may already cover response architecture; runtime-boundary is named as the Phase-3 dependency — is it genuinely complete/landed? check.)
3. Any contradictions or stale cross-references.
4. For runtime-boundary specifically: the output plan says Phase 3 is gated on it being "grounded and verified in the current branch" — assess whether that groundwork actually exists in the code now (you may read universal-tools/ to check).
Cite file:line / plan sections. If the file does not exist, set exists=false and say so.`,
      { schema: DOC_SCHEMA, phase: 'RelatedDocs', label: `doc:${d.key}`, model: 'sonnet' },
    ),
  ),
)).filter(Boolean)

const docAnalysesJson = JSON.stringify(docAnalyses)
log(`Analysed ${docAnalyses.length} related documents`)

// ----------------------------------------------------------------------------
// PHASE 4 — EEF graph-tool plan relationship
// ----------------------------------------------------------------------------
phase('EEF')

const EEF_LENSES = [
  {
    key: 'doctrine',
    prompt: `Read the EEF graph-tool plan and its companions IN FULL:
- .agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md
- .agent/plans/sector-engagement/eef/current/eef-d2-source-path-table.md
- .agent/plans/sector-engagement/eef/current/eef-d0-decontamination-ledger.md
Extract precisely what the EEF plan says about OUTPUT SCHEMAS for MCP tools: the "single Zod call" rule (Decision 2), the D3 (MCP tool resource contract) and D6 (MCP composition EEF surface) todos, the graph-native-view-derived schema requirement, the satisfies/compile-time-proof requirement, and the root-must-be-object rule. Quote the key lines.
This is the 'doctrine' lens. graphIsSpecialCaseVerdict: report what the EEF plan ASSERTS about graph tools being universal tools.`,
  },
  {
    key: 'code-reality',
    prompt: `Determine from the REAL CODE whether "graph tools are a special case of universal tools" is actually true. ${FILE_MAP}
Read graph-resource-factory.ts, aggregated-misconception-graph.ts, aggregated-prior-knowledge-graph.ts, and the universal-tools/ layer. Trace whether graph tools register through the same universal-tools descriptor path as other tools, or via a separate resource/registration path.
This is the 'code-reality' lens. graphIsSpecialCaseVerdict must be grounded in file:line evidence, not the plan's claims.`,
  },
  {
    key: 'conflict',
    prompt: `Assess overlap/conflict/sequencing between the EEF graph-tool plan's output-schema work (eef-graph-tool-completion.plan.md, D3/D6, single-Zod-call rule) and the general output-schema plan at ${PLAN}.
Key question: if we split the output-schema plan into API / search / universal / graph sub-plans, does the EEF plan ALREADY own the "graph tools output schema" sub-plan, or would there be duplication? Should graph output-schema work live in the EEF plan, the output-schema plan, or be coordinated across both?
This is the 'conflict' lens. Populate conflicts[] with concrete duplications or ordering hazards.`,
  },
]

const eef = (await parallel(
  EEF_LENSES.map((l) => () => agent(l.prompt, { label: `eef:${l.key}`, phase: 'EEF', schema: EEF_SCHEMA, model: 'sonnet' })),
)).filter(Boolean)

const eefJson = JSON.stringify(eef)
log(`Completed ${eef.length} EEF-relationship lenses`)

// ----------------------------------------------------------------------------
// PHASE 5 — Assess the proposed four-way split
// ----------------------------------------------------------------------------
phase('Split')

const split = await agent(
  `You are deciding whether the output-schema MCP work should be split into FOUR sub-plans as the owner proposed:
  (a) output schemas for API tools (the generated tools)
  (b) output schemas for search tools
  (c) output schemas for universal tools
  (d) output schemas for graph tools (proposed to be a special case of universal tools)

Use ALL the evidence gathered:
GROUND TRUTH (real MCP surface): ${groundTruthJson}
CLAIM VERDICTS (plan vs reality): ${verdictsJson}
RELATED DOC ANALYSIS: ${docAnalysesJson}
EEF RELATIONSHIP: ${eefJson}

Decide and justify, grounded in the evidence:
1. Is the four-way split the right decomposition? Note the tension: the code mapping may show "universal tools" is the UMBRELLA descriptor surface that generated+aggregated+graph+search all flow through — if so, "universal tools" is not a peer category but the shared mechanism. Resolve this explicitly. Propose the corrected decomposition if the owner's framing needs adjusting (do not rubber-stamp it; do not dismiss it either — give a real verdict).
2. For each recommended sub-plan: scope, which concrete tools it covers, what it depends on, sequencing notes.
3. Is graph genuinely a special case of universal tools (per the code-reality EEF lens)? Should the graph sub-plan be owned by the EEF plan instead?
4. Sequencing across all sub-plans and the shared descriptor-surface change that must come first.
5. Risks.

Apply the project's "long-term architectural excellence is always the answer" lens. Be direct — present a verdict, not a menu.`,
  { schema: SPLIT_SCHEMA, phase: 'Split', label: 'split-assessment' },
)

const splitJson = JSON.stringify(split)

// ----------------------------------------------------------------------------
// PHASE 6 — Synthesis report
// ----------------------------------------------------------------------------
phase('Synthesis')

const report = await agent(
  `Write the consolidated audit report as Markdown for the owner. This is foundational planning input. Be precise, cite file:line where claims rest on code, and lead with verdicts.

INPUTS:
PLAN UNDER AUDIT: ${PLAN}
GROUND TRUTH: ${groundTruthJson}
CLAIM VERDICTS: ${verdictsJson}
RELATED DOCS: ${docAnalysesJson}
EEF: ${eefJson}
SPLIT ASSESSMENT: ${splitJson}

Structure the report with these sections:
1. **Bottom line** — 4-6 sentences: how stale the plan is, the single biggest correction, and the recommended split verdict.
2. **Claim ledger** — a table of every claim: id | verdict | corrected statement. Group TRUE claims briefly; expand STALE/FALSE/PARTIAL with the correction and evidence.
3. **What changed under the plan's feet** — the concrete drift (stdio removed, tool counts, new graph/user-search tools, runtime-boundary status, etc.).
4. **Current reality of outputSchema** — where it is / isn't threaded today, and the single descriptor-surface change that gates everything.
5. **Related-document gaps & overlaps** — per related doc: dependency / overlap / contradiction / recommended action.
6. **EEF relationship** — is graph a special case of universal tools (code verdict), and who should own graph output schemas.
7. **Recommended decomposition** — the corrected sub-plan set with scope, tools, dependencies, and sequencing. Be explicit if "universal tools" is the shared mechanism rather than a peer category.
8. **Recommended actions** — ordered, concrete: what to rewrite/retire/create, and the first move.

Return ONLY the markdown report.`,
  { label: 'synthesis-report' },
)

return {
  regionsMapsCount: maps.length,
  claimsCount: claims.length,
  verdicts,
  docAnalyses,
  eef,
  split,
  report,
}
