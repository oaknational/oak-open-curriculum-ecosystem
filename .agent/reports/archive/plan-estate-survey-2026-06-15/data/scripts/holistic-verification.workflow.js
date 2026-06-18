export const meta = {
  name: 'holistic-strategy-verification',
  description: 'Adversarially verify the holistic vision→value→action synthesis: 3 blind independent readings + 3 refuters',
  phases: [{ title: 'Verify', detail: '3 independent holistic readings + 3 adversarial refutations of the synthesis claims' }],
}

const AGG = {
  pathRelevance: { liveCritical: 28, liveSupporting: 187, speculative: 112, staleOrSuperseded: 79 },
  visionLink_pathsWithNone: 15,
  practiceWeight: 'agentic-engineering-enhancements 98 + agent-tooling 61 = 159 of 409 docs (~39%)',
  reachability: '149 of 355 (42%) live+future plans unlinked from their sibling lane README',
  milestoneCoverage: { none: 287, M2: 55, M3: 38, 'M4-GA': 20, unclear: 9 },
  externalGateCounts: { 'upstream-oak-api': 24, elastic: 17, 'mcp-spec-ga': 13, cloudflare: 12, 'ontology-repo': 8, clerk: 7, 'legal-dpo': 1 },
  missingExecutionPlans: ['reusable-components build/packaging', 'value-proof instrumentation', 'pupil safeguarding/editorial-correctness', 'legal/DPIA/DSAR', 'performance axis', 'production Clerk', 'ops/sustainability/funding-envelope'],
  collectionOrgVerdicts: '4 cluttered, ~8 mislaned, 1 mixed, 2 coherent',
}
const SYNTHESIS_CLAIMS = [
  'C1: The VISION is clear, sound, and current (reviewed 2026-06-12); it does NOT need rewriting — it is the clearest layer of the strategy.',
  'C2: The technical substrate (schema-first SDK + codegen, data grounding, hybrid search, curriculum graph, EEF/evidence, privacy/security engineering, the agentic-engineering Practice) is genuinely excellent — the strongest part of the system.',
  'C3: The value chain is skewed INWARD: ~39% of plans are on how-we-build (Practice + tooling) plus heavy investment in the engineering substrate (VISION first-order). The SECOND order (reusable components for the sector — half of "what we deliver") is documentation-only with no execution plan. The THIRD order (the teacher-facing experience + proof of impact) is thin. We build the engine superbly but under-invest in the orders closest to the mission.',
  'C4: The deepest gap is PROOF-OF-VALUE, ecosystem-wide. VISION names leading/outcome indicators (adoption, teacher-workload reduction, pedagogical quality, sector reuse) but no plan or instrumentation measures whether ANY pillar is creating that value. "Is it working?" is assumed, not evidenced — across all pillars, not just the MCP app.',
  'C5: The action surface (the plan estate) does not express the strategy: 42% unreachable, stale/superseded residue, the genuinely value-creating work buried under ~400 docs; strategic indexes do not carry the live intent. Planning discipline (ADR-117/PDR-018) is sound — the drift is behavioural (the estate grew faster than it was curated).',
  'C6: Determination is the missing verb: the outward value pillars are under-resourced relative to their mission-centrality; external long-poles (incl. a 24-plan dependency on the upstream Oak API owned by another team) have no owned timelines; the inward/outward allocation happened by gravity, not by a conscious owner decision.',
]
const VISION_BRIEF = 'Oak Open Curriculum Ecosystem VISION: turn Oak\'s open curriculum into AI-native reusable infrastructure (typed SDK, hybrid search, curriculum graph, EEF evidence, MCP servers/Apps, reusable sector components, the portable Practice) so it reaches teachers in the AI tools they use, protecting what reaches PUPILS and helping close the disadvantage gap. Three orders of effect: (1) Oak ships safely+fast via the Practice; (2) enablement of Oak teams + external developers/EdTech/sector via reusable infra; (3) teacher-pupil outcomes. The live product is the Curriculum MCP server, but the vision is the whole infrastructure, not one app.'

const READING_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    lens: { type: 'string' },
    headline: { type: 'string' },
    vision_clarity: { type: 'string' },
    value_chain_assessment: { type: 'string' },
    action_surface_assessment: { type: 'string' },
    biggest_strategic_gap: { type: 'string' },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
  },
  required: ['lens', 'headline', 'biggest_strategic_gap', 'confidence'],
}
const REFUTE_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    verdicts: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      properties: {
        claim_id: { type: 'string' },
        stance: { type: 'string', enum: ['stands', 'overstated', 'understated', 'wrong', 'misframed'] },
        why: { type: 'string' },
        evidence_paths: { type: 'array', items: { type: 'string' } },
      },
      required: ['claim_id', 'stance', 'why'],
    } },
    missing_from_synthesis: { type: 'string', description: 'what a holistic view should include that these 6 claims omit entirely' },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
  },
  required: ['verdicts', 'missing_from_synthesis', 'confidence'],
}

phase('Verify')
const blindLenses = [
  { id: 'mission-outcome', ask: 'Read first-hand: docs/foundation/VISION.md, .agent/plans/high-level-plan.md, .agent/milestones/README.md. Through the MISSION/OUTCOME lens (does the estate move Oak\'s disadvantage-gap mission, via teachers, to pupils?), give an independent holistic reading of vision→value→action. You have NOT seen any prior synthesis — reason fresh.' },
  { id: 'value-chain', ask: 'Read first-hand: docs/foundation/VISION.md (esp. the three orders of effect + What We Deliver), .agent/plans/high-level-plan.md. Through the VALUE-CHAIN lens (where across the three orders is value CREATED vs DELIVERED?), give an independent holistic reading. You have NOT seen any prior synthesis — reason fresh.' },
  { id: 'execution-determination', ask: 'Read first-hand: .agent/plans/README.md, .agent/plans/high-level-plan.md, docs/foundation/agentic-engineering-system.md. Through the EXECUTION/DETERMINATION lens (is the action surface organised to execute the strategy with clarity and resolve?), give an independent holistic reading. You have NOT seen any prior synthesis — reason fresh.' },
]
const blind = blindLenses.map((l) => () => agent([
  VISION_BRIEF, '',
  `You are an independent strategy analyst. ${l.ask}`,
  '', 'Survey aggregates (a prior whole-estate census; evidence to weigh, not gospel):', JSON.stringify(AGG),
  '', 'Give: a headline, your read on vision_clarity / value_chain_assessment / action_surface_assessment, and the single biggest strategic gap you see. Ground claims in what you read.',
].join('\n'), { label: `blind:${l.id}`, phase: 'Verify', schema: READING_SCHEMA }))

const refute = ['r1', 'r2', 'r3'].map((id) => () => agent([
  VISION_BRIEF, '',
  'You are an adversarial reviewer. A synthesis of the Oak vision/strategy/plan estate makes the 6 claims below. For EACH, try hard to REFUTE it — find where it is overstated, understated, wrong, or misframed. Verify against the actual repo where you can (read VISION.md, high-level-plan.md, README.md, milestones, sample plans). Default to scepticism; a claim only "stands" if you genuinely cannot dent it. Then name what a holistic view should include that these 6 claims OMIT entirely.',
  '', 'Survey aggregates the synthesis used:', JSON.stringify(AGG),
  '', 'The 6 claims:', ...SYNTHESIS_CLAIMS,
].join('\n'), { label: `refute:${id}`, phase: 'Verify', schema: REFUTE_SCHEMA }))

const results = await parallel([...blind, ...refute])
return { blindReadings: results.slice(0, 3).filter(Boolean), refutations: results.slice(3).filter(Boolean) }
