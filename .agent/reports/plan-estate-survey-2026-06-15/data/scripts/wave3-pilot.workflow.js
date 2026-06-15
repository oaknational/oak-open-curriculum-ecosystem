export const meta = {
  name: 'wave3-pilot-value-sequencing',
  description: 'PILOT (4 agents): test the forward-looking value/dependency/sequencing/decay instrument before scaling',
  phases: [{ title: 'Pilot', detail: '2 bundles x 2 lenses, schema-enforced, on known plans' }],
}

// Two pilot bundles chosen to span plan TYPES so the instrument is stress-tested:
//  B1 = critical-path / owner-priority live plans (I know their true state)
//  B2 = mixed: future-strategic + practice + stale + graph + sector
const B1 = [
  '.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md',
  '.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md',
  '.agent/plans/security-and-privacy/future/cloudflare-mcp-public-beta-security-gate.plan.md',
  '.agent/plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md',
  '.agent/plans/sdk-and-mcp-enhancements/current/unified-mcp-server-test-harness.plan.md',
  '.agent/plans/agent-tooling/current/agent-naming-schema-v3.plan.md',
]
const B2 = [
  '.agent/plans/agentic-engineering-enhancements/future/multi-agent-delegation-orchestration.plan.md',
  '.agent/plans/agent-tooling/current/cost-of-collaboration.plan.md',
  '.agent/plans/semantic-search/current/m2-public-alpha-auth-rate-limits.execution.plan.md',
  '.agent/plans/connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md',
  '.agent/plans/sector-engagement/future/dfe-data-sdk.plan.md',
  '.agent/plans/observability/current/observability-sinks-decoupling.plan.md',
]

const WAVE3_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    assessments: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      properties: {
        path: { type: 'string', description: 'exact path as given' },
        title: { type: 'string' },
        milestone_gate: { type: 'string', enum: ['M2', 'M3', 'M4-GA', 'none', 'unclear'] },
        user_value: { type: 'string', enum: ['order1-oak-delivery', 'order2-enablement', 'order3-teacher-pupil', 'internal-hygiene', 'unclear'], description: 'primary order of effect per VISION three orders; internal-hygiene = pure tooling/practice with no direct product-value line' },
        value_directness: { type: 'string', enum: ['direct', 'indirect'] },
        leverage: { type: 'string', enum: ['high', 'medium', 'low'], description: 'does completing it unblock/enable disproportionate downstream value?' },
        effort: { type: 'string', enum: ['S', 'M', 'L', 'unknown'] },
        depends_on: { type: 'array', items: { type: 'string' }, description: 'prerequisite plans/work this plan STATES it needs first (plan filenames or short names); [] if none stated' },
        blocks_or_enables: { type: 'array', items: { type: 'string' }, description: 'what completing this unblocks/enables, per the plan body; [] if none stated' },
        external_gate: { type: 'string', enum: ['upstream-oak-api', 'ontology-repo', 'clerk', 'cloudflare', 'mcp-spec-ga', 'legal-dpo', 'elastic', 'none', 'other'] },
        freshness_risk: { type: 'string', enum: ['fresh', 'references-merged-pr', 'references-removed-code', 'references-dead-branch', 'stale-dates', 'none'], description: 'decay signal: does the body reference already-merged PRs, removed code, dead branches, or carry stale dates?' },
        evidence_quote: { type: 'string', description: 'short quote grounding the hardest fields (depends_on / freshness)' },
        confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
      },
      required: ['path', 'milestone_gate', 'user_value', 'leverage', 'effort', 'depends_on', 'blocks_or_enables', 'external_gate', 'freshness_risk', 'confidence'],
    }},
  },
  required: ['assessments'],
}

const BRIEF = [
  'OAK OPEN CURRICULUM ECOSYSTEM — forward-looking plan prioritisation survey.',
  'VISION three orders of effect: order1 = Oak ships SDK/MCP/search/graph safely+fast (the Practice enables this); order2 = enablement of Oak product teams + external developers/EdTech via reusable infra; order3 = teacher-pupil outcomes (reduced planning workload, closing the disadvantage gap).',
  'LIVE PRODUCT = Curriculum MCP HTTP server. M2 (open public alpha, ~95%) close gates = user-facing widget SEARCH UI (not started) + observability evidence (Sentry/OTel foundation already on main). M3 (public beta) gates = production Clerk + Cloudflare MCP security gate. M4/GA undefined.',
].join('\n')

const LENS = {
  A: 'YOUR EMPHASIS = USER VALUE & LEVERAGE. For each plan judge milestone_gate, user_value (which order of effect), value_directness, leverage (does it unblock disproportionate downstream value?), effort. Still fill every field.',
  B: 'YOUR EMPHASIS = SEQUENCING & DECAY. For each plan extract depends_on (prerequisite plans/work the body states it needs), blocks_or_enables (what it unblocks), external_gate (upstream API / ontology repo / Clerk / Cloudflare / MCP spec GA / legal-DPO / Elastic / none), and freshness_risk (does the body cite already-merged PRs, removed code, dead branches, or stale dates?). Still fill every field.',
}

phase('Pilot')
const bundles = [
  { id: 'B1-critical', lens: 'A', paths: B1 }, { id: 'B1-critical', lens: 'B', paths: B1 },
  { id: 'B2-mixed', lens: 'A', paths: B2 }, { id: 'B2-mixed', lens: 'B', paths: B2 },
]
const results = await parallel(bundles.map((bd) => () =>
  agent(
    [
      BRIEF, '', LENS[bd.lens], '',
      'Read EACH plan IN FULL via the Read tool before judging. Ground the hardest fields (depends_on, freshness_risk) in a real quote. If a field is genuinely undeterminable from the body, set confidence "low" and say why in evidence_quote — do NOT default-fill. Echo each path EXACTLY.',
      'Plans:', ...bd.paths.map((p) => `- ${p}`),
    ].join('\n'),
    { label: `pilot:${bd.id}:${bd.lens}`, phase: 'Pilot', schema: WAVE3_SCHEMA, model: 'sonnet' },
  ),
))

return { bundles: bundles.map((b) => ({ id: b.id, lens: b.lens, n: b.paths.length })), results }
