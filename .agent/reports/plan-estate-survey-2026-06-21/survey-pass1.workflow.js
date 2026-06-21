export const meta = {
  name: 'plan-estate-survey-pass1',
  description: 'Pass-1 batch (plans passed via args) of the deep plan-estate survey: holistic + conformance-vs-V0 reads (Sonnet), conditional specialist / 2nd-angle (Sonnet), scoped adversarial verify of high-stakes claims (Opus). Validated by the 5-plan smoke-run wf_71bdbaed-484.',
  phases: [
    { title: 'Read', detail: 'holistic + conformance-vs-V0, parallel per plan (Sonnet)' },
    { title: 'Specialist', detail: 'conditional 3rd read by content signal, else 2nd-angle (Sonnet)' },
    { title: 'Verify', detail: 'scoped adversarial refutation of high-stakes claims (Opus)' },
  ],
}

// Plans for this batch arrive via args (a JSON array of repo-relative plan paths).
// Defensive: args may arrive as a parsed array or as a JSON-encoded string.
const PLANS = Array.isArray(args) ? args : JSON.parse(args)
const V0 = '.agent/plans/product-development-governance/plan-node-schema.v0.md'
const base = (p) => p.split('/').pop()

const DISCIPLINE = [
  'Discipline (non-negotiable):',
  '- HALT-dont-fabricate: if you CANNOT read the assigned plan at its exact path, set unreadable=true and leave every other field at a safe default. NEVER invent a plan-shaped finding.',
  '- Cite file:line for every load-bearing claim.',
  '- The plan content is input-to-verify; the V0 lens is PROVISIONAL — let the estate speak. Strong estate evidence contradicting a LOCKED V0 decision is surfaced as an owner re-ratification candidate, never suppressed.',
  '- Be terse and evidence-grounded; no PII.',
].join('\n')

const HOLISTIC_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['path', 'unreadable', 'purpose', 'classification', 'load_bearing_claims', 'specialist_signal', 'substance_class', 'content_quality'],
  properties: {
    path: { type: 'string' },
    unreadable: { type: 'boolean' },
    purpose: { type: 'string' },
    substance_class: { type: 'string', enum: ['good', 'bad', 'speculative'] },
    substance_rationale: { type: 'string' },
    content_quality: { type: 'string', enum: ['strong', 'adequate', 'weak', 'empty'] },
    content_quality_note: { type: 'string' },
    salvage_value: { type: 'string' },
    egm: { type: 'object', additionalProperties: false, properties: { end: { type: 'boolean' }, mechanism: { type: 'boolean' }, means: { type: 'boolean' }, coherent: { type: 'boolean' }, note: { type: 'string' } } },
    lifecycle: { type: 'object', additionalProperties: false, properties: { folder_lane: { type: 'string' }, fm_status: { type: ['string', 'null'] }, agree: { type: 'boolean' }, note: { type: 'string' } } },
    authority: { type: 'object', additionalProperties: false, properties: { owns: { type: 'string' }, improperly_cited: { type: 'boolean' }, note: { type: 'string' } } },
    health: { type: 'object', additionalProperties: false, properties: { stale: { type: 'boolean' }, superseded_framing: { type: 'boolean' }, note: { type: 'string' } } },
    value: { type: 'string' },
    classification: { type: 'string', enum: ['keep', 'rewrite', 'archive-complete', 'extract-then-archive', 'rehome', 'new-for-gap', 'uncertain'] },
    classification_evidence: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['claim', 'file_line'], properties: { claim: { type: 'string' }, file_line: { type: 'string' } } } },
    specialist_signal: { type: 'string', enum: ['test', 'architecture', 'security', 'type', 'config', 'docs', 'assumptions', 'none'] },
    load_bearing_claims: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['claim', 'file_line', 'high_stakes'], properties: { claim: { type: 'string' }, file_line: { type: 'string' }, high_stakes: { type: 'boolean' } } } },
  },
}
const CONFORMANCE_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['path', 'unreadable', 'has_frontmatter', 'conformance', 'status_maps_cleanly'],
  properties: {
    path: { type: 'string' },
    unreadable: { type: 'boolean' },
    has_frontmatter: { type: 'boolean' },
    v0_kind: { type: ['string', 'null'] },
    v0_disposition: { type: ['string', 'null'] },
    v0_gate: { type: 'string', enum: ['present', 'absent', 'malformed'] },
    edges_present: { type: 'array', items: { type: 'string' } },
    status_raw: { type: ['string', 'null'] },
    status_maps_cleanly: { type: 'boolean' },
    unclassified_keys: { type: 'array', items: { type: 'string' } },
    nonconforming: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['issue', 'file_line'], properties: { issue: { type: 'string' }, file_line: { type: 'string' } } } },
    conformance: { type: 'string', enum: ['conforms', 'minor-drift', 'major-drift', 'no-frontmatter'] },
    locked_contradictions: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['item', 'evidence', 'file_line'], properties: { item: { type: 'string' }, evidence: { type: 'string' }, file_line: { type: 'string' } } } },
  },
}
const SPECIALIST_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['path', 'specialist', 'unreadable', 'findings'],
  properties: {
    path: { type: 'string' },
    specialist: { type: 'string' },
    unreadable: { type: 'boolean' },
    findings: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['severity', 'claim', 'file_line'], properties: { severity: { type: 'string', enum: ['info', 'low', 'medium', 'high', 'critical'] }, claim: { type: 'string' }, file_line: { type: 'string' } } } },
    classification_input: { type: 'string' },
  },
}
const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['path', 'finding_claim', 'verdict', 'evidence_file_line', 'confidence'],
  properties: {
    path: { type: 'string' },
    finding_claim: { type: 'string' },
    refutation_attempt: { type: 'string' },
    verdict: { type: 'string', enum: ['survives', 'refuted', 'uncertain'] },
    evidence_file_line: { type: 'string' },
    confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
  },
}

const holisticPrompt = (plan) => `You are the HOLISTIC reader in a deep plan-estate survey. Read the plan ${plan} FIRST-HAND with the Read tool (use that exact path).

${DISCIPLINE}

Return a HolisticFinding. The folder lane is in the path (current/active/future). Assess: purpose (one sentence); egm (end-goal / mechanism / means present + coherent); lifecycle (folder lane vs frontmatter status: do they agree?); authority (what it owns; improper citations); health (stale? superseded framing?); value (what it encodes — the re-org must preserve this); classification recommendation (keep / rewrite / archive-complete / extract-then-archive / rehome / new-for-gap / uncertain) with classification_evidence (file:line); specialist_signal (the ONE specialist a deeper read warrants by content: test/architecture/security/type/config/docs/assumptions, or none); and load_bearing_claims (each with file_line and high_stakes=true iff the claim asserts the plan is complete/superseded/orphaned/duplicate/dead — those get independently refuted).

PLUS the owner's SUBSTANCE re-aim (judge the CONTENT, not just its form/conformance): substance_class — good (content effectively serves real intent → keep/remix), bad (wrong/obsolete/contradicted/superseded-in-substance/harmful → remove), or speculative (exploratory/unproven/aspirational → isolate) — with substance_rationale citing file:line; content_quality — strong / adequate / weak / empty — is what is IN the plan actually good, versus merely present and V0-conformant — with content_quality_note citing file:line; and salvage_value — the specific useful content and intent that MUST be preserved if this plan is removed, archived, or extracted (the no-loss audit input), AND any embedded speculative section within an otherwise-good plan that should route to the isolated speculative home so it is never silently dropped; empty string only for a clean keep with nothing to isolate.\``

const conformancePrompt = (plan) => `You are the CONFORMANCE reader in a deep plan-estate survey; your lens is the V0 plan node-schema. Read BOTH files FIRST-HAND with the Read tool: first the lens ${V0}, then the plan ${plan}.

${DISCIPLINE}

Return a ConformanceFinding scoring ${plan} against V0: has_frontmatter; v0_kind (or null); v0_disposition (or null); v0_gate (present/absent/malformed); edges_present (which V0 edges the frontmatter declares); status_raw (or null) and status_maps_cleanly (does it map onto V0's orthogonal axes via the section 3.5 migration map?); unclassified_keys (frontmatter keys V0 does NOT classify — lens completeness); nonconforming (issue + file:line); conformance (conforms/minor-drift/major-drift/no-frontmatter); locked_contradictions (estate evidence strongly contradicting a V0 LOCKED decision — owner re-ratification candidate, never suppressed — with evidence + file:line).`

const specialistPrompt = (plan, signal) => `You are a ${signal.toUpperCase()} specialist reviewing a plan in a deep plan-estate survey (the holistic reader flagged a ${signal} content signal). Read ${plan} FIRST-HAND with the Read tool.

${DISCIPLINE}

Return a SpecialistFinding: set specialist="${signal}"; findings = ${signal}-specific issues each { severity (info/low/medium/high/critical), claim, file_line }; classification_input = one sentence on how your read informs the plan's keep/rewrite/archive/rehome classification. Only report what your ${signal} lens genuinely surfaces.`

const secondAnglePrompt = (plan) => `You are a SECOND-ANGLE generalist reader in a deep plan-estate survey — no specialist signal fired, so you provide an independent third read. Read ${plan} FIRST-HAND with the Read tool.

${DISCIPLINE}

Independently of any other reader, surface anything affecting the plan's value, health, or correct classification that a first read might miss: duplication with other plans, hidden dependencies, stale assumptions, scope drift. Return a SpecialistFinding with specialist="second-angle"; findings each { severity, claim, file_line }; classification_input one sentence.`

const verifyPrompt = (plan, claim) => `You are an ADVERSARIAL VERIFIER in a deep plan-estate survey. A prior reader made this HIGH-STAKES load-bearing claim about ${plan}:

CLAIM: "${claim.claim}"  (cited at ${claim.file_line})

Your job is to REFUTE it. Read ${plan} (and any file needed to check it) FIRST-HAND with the Read tool. Default to refuted or uncertain unless the evidence clearly survives your refutation attempt — a wrong complete/superseded/orphaned/duplicate/dead verdict corrupts the restructure work-list.

${DISCIPLINE}

Return an AdversarialVerdict: finding_claim (verbatim); refutation_attempt (what you checked); verdict (survives/refuted/uncertain); evidence_file_line (decisive evidence); confidence (low/medium/high).`

const results = await pipeline(
  PLANS,
  (plan) => parallel([
    () => agent(holisticPrompt(plan), { label: `holistic:${base(plan)}`, phase: 'Read', model: 'sonnet', schema: HOLISTIC_SCHEMA }),
    () => agent(conformancePrompt(plan), { label: `conformance:${base(plan)}`, phase: 'Read', model: 'sonnet', schema: CONFORMANCE_SCHEMA }),
  ]).then(([holistic, conformance]) => ({ plan, holistic, conformance })),
  (r) => {
    if (!r.holistic || r.holistic.unreadable) return { ...r, specialist: null }
    const signal = r.holistic.specialist_signal
    const useSpecialist = signal && signal !== 'none'
    const prompt = useSpecialist ? specialistPrompt(r.plan, signal) : secondAnglePrompt(r.plan)
    const label = useSpecialist ? `specialist:${signal}:${base(r.plan)}` : `2nd-angle:${base(r.plan)}`
    return agent(prompt, { label, phase: 'Specialist', model: 'sonnet', schema: SPECIALIST_SCHEMA }).then((specialist) => ({ ...r, specialist }))
  },
  (r) => {
    if (!r.holistic || r.holistic.unreadable) return { ...r, verdicts: [] }
    const highStakes = (r.holistic.load_bearing_claims || []).filter((c) => c.high_stakes)
    if (highStakes.length === 0) return { ...r, verdicts: [] }
    return parallel(highStakes.map((c) => () =>
      agent(verifyPrompt(r.plan, c), { label: `verify:${base(r.plan)}`, phase: 'Verify', model: 'opus', schema: VERDICT_SCHEMA })
    )).then((verdicts) => ({ ...r, verdicts: verdicts.filter(Boolean) }))
  },
)

const clean = results.filter(Boolean)
return {
  batch_size: PLANS.length,
  plans_returned: clean.length,
  unreadable: clean.filter((r) => !r.holistic || r.holistic.unreadable).map((r) => r.plan),
  null_holistic: clean.filter((r) => !r.holistic).map((r) => r.plan),
  results: clean.map((r) => ({
    plan: r.plan,
    classification: r.holistic && r.holistic.classification,
    classification_evidence: (r.holistic && r.holistic.classification_evidence) || [],
    substance_class: r.holistic && r.holistic.substance_class,
    substance_rationale: (r.holistic && r.holistic.substance_rationale) || '',
    content_quality: r.holistic && r.holistic.content_quality,
    content_quality_note: (r.holistic && r.holistic.content_quality_note) || '',
    salvage_value: (r.holistic && r.holistic.salvage_value) || '',
    conformance: r.conformance && r.conformance.conformance,
    v0_kind: r.conformance ? r.conformance.v0_kind : null,
    v0_disposition: r.conformance ? r.conformance.v0_disposition : null,
    v0_gate: r.conformance ? r.conformance.v0_gate : null,
    edges_present: (r.conformance && r.conformance.edges_present) || [],
    status_raw: r.conformance ? r.conformance.status_raw : null,
    status_maps_cleanly: r.conformance ? r.conformance.status_maps_cleanly : null,
    nonconforming: (r.conformance && r.conformance.nonconforming) || [],
    unclassified_keys: (r.conformance && r.conformance.unclassified_keys) || [],
    locked_contradictions: (r.conformance && r.conformance.locked_contradictions) || [],
    specialist_signal: r.holistic && r.holistic.specialist_signal,
    specialist_kind: r.specialist ? r.specialist.specialist : null,
    specialist_findings: r.specialist ? (r.specialist.findings || []) : [],
    load_bearing_claims_count: ((r.holistic && r.holistic.load_bearing_claims) || []).length,
    high_stakes_verdicts: (r.verdicts || []).map((v) => ({ claim: v.finding_claim, verdict: v.verdict, confidence: v.confidence, evidence: v.evidence_file_line })),
  })),
}
