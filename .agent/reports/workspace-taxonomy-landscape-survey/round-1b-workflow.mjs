export const meta = {
  name: 'landscape-survey-round-1b',
  description: 'Round 1b challenger fleet: per-tier baselines, tier-matched seeding, falsification arm, stimulus controls, double reduction',
  phases: [
    { title: 'Baselines', detail: '18 unseeded per-tier prior fingerprints' },
    { title: 'Walkers', detail: 'tier-matched seeded walkers + codex relays + free-form arm' },
    { title: 'Controls', detail: 'decoy-estate stimulus controls' },
    { title: 'Falsifiers', detail: 'adversaries attack the 1a dominant elite; one attacks the instrument itself' },
    { title: 'Reduce', detail: 'two independent reducers, fresh descriptors', model: 'opus' },
    { title: 'Compare', detail: 'join both reductions + 1a descriptors; attractor, decoy, and leakage analyses' },
    { title: 'Score', detail: 'boundary fitness over reducer-X elites vs measured record' },
  ],
};

// Walker-visible texts are the committed briefs VERBATIM
// (.agent/research/landscape-survey-round1b-briefs-2026-08-17.md).
// Edit the briefs first, then mirror here; the briefs doc is the review surface.
// Frame-challenger cures 2026-08-17: blocklist extended + grounding-a allowlist
// (ADR-041 leak), requirement variants re-cut by concern cardinality (3/7/12),
// de-ontologised free-form arm, decoy-estate stimulus controls, falsifiers may
// return "sound", one falsifier attacks the instrument, comparator reports
// per-observation attractor rows and basin mass with/without falsifier fixes.

const FORBIDDEN = `FORBIDDEN (reading any invalidates your run — say so in notes if you do): anything under ANY dot-directory (.agent, .claude, .cursor, .github, and every other), anything under docs/ or research/, ANY Markdown file anywhere in the repository (README.md, AGENTS.md, CLAUDE.md, GEMINI.md included), any worktree checkout, any file whose name mentions census, inventory, basis, reorganisation, taxonomy, survey, or deconstruction; PR bodies and git log messages.`;

const SEALED = 'READ NOTHING from the repository or filesystem — reading any file invalidates your run; the text above is your entire world.';

const TASK = `You are designing how a TypeScript monorepo estate should be organised into units of code — what makes two things separate units, where units live, how they are named, and how the rules are enforced. You have never seen this estate's current plans or analyses, and you must not seek them out.

${FORBIDDEN}

TASK: produce a complete organisational proposal — the questions your design answers, the minimal set of independent classifications it rests on, the concrete carrier for each (directory level, name convention, manifest field, enforcement rule, derived from the dependency graph), the layout it implies, and your placement of each case in the probe set below. In notes, state how many repository files you read (zero if none), and name any question you believe this task statement should have asked but did not.`;

const TASK_FREE = `You are deciding how a TypeScript monorepo estate should be organised — whatever "organised" should turn out to mean. You have never seen this estate's current plans or analyses, and you must not seek them out.

${FORBIDDEN}

TASK: say how this estate should be organised, in whatever terms you think are the right terms. Do not assume the answer is a classification scheme, a directory tree, or any particular kind of structure — if it is, argue for that; if it is something else, produce that instead. State what determines where any given piece of code lives and how anyone (human or machine) would check the organisation is being followed. In notes, state how many repository files you read (zero if none).`;

const PROBES = `THE PROBE SET (place every case; mark forcedFit true where your design has no natural home for it):
P1: A machine-readable interface-specification snapshot fetched from an external service, and a large bulk dataset from the SAME service, refreshed on different schedules by different mechanisms.
P2: Four collections of machine-regenerated artefacts, each rebuilt in response to a different event class.
P3: Byte-preserved third-party vendor files that must never be hand-edited, alongside hand-written styling that changes freely.
P4: One tooling area whose code serves several distinct consumers on different rhythms (interactive commands, commit-time guards, scheduled jobs).
P5: Hand-curated reference data carrying a content licence different from the code around it.
P6: Trademark image assets whose reuse terms differ from everything else in the estate.
P7: Research-study evidence code — quality-gated like product code but never shipped to users.
P8: Operational scripts that run against live systems and sit outside the product quality gates.
P9: A deployed product application and a demonstration application with near-identical structure but different audiences and support promises.
P10: Generic machinery, reusable against any similar datastore, currently embedded inside a product-specific pipeline.
P11: A browser-built interactive widget whose BUILT OUTPUT is embedded and served by a different unit than its source.
P12: Commit-hook guard code and repo-state validator code — the same change rhythm, different consumers and failure modes.
S1: An error-handling primitive — tiny, zero dependencies, imported nearly everywhere.
S2: A path-safety utility born from a security incident — small, security-critical.
S3: A large graph-data library exposing ~74 public symbols.
S4: A typed client for the external curriculum service, published publicly.
S5: A design-token pipeline whose output is generated CSS consumed by several surfaces.
S6: A search-retrieval library over a commodity datastore.
S7: The estate's largest unit — a codegen pipeline mixing spec-fetch, generated types, corpus mining, and hand curation.
S8: An observability adapter for a commodity vendor.`;

const FACTS = `THE ESTATE (all you know about it): Scale: ~10,800 tracked files, TypeScript ESM, pnpm + turbo build graph, ~5,900 commits/year, 308 multi-unit commits/year. External services: one proper-noun curriculum platform (spec + bulk + live queries, one credential, measured refresh rates 29/7/year), one commodity search cluster, auth/observability/deploy commodities. Licence classes: MIT code, OGL curriculum content, reserved brand assets — coexisting, never mixable in one unit. Workforce: primarily AI agents under human ownership. Product surfaces: an MCP curriculum server, a search CLI, two demo apps, agent tooling, design system. Generated artefact classes: spec-derived types (regenerates ~29x/yr), search contracts (~16x/yr), bulk schemas (~7x/yr), mined corpus data (24MB, ~19x/yr), an embedded widget (~18x/yr).`;

const DECOY_FACTS = `THE ESTATE (all you know about it): Scale: ~300 tracked files, TypeScript ESM, single package manager, ~400 commits/year, almost all touching one area at a time. External services: none — the code is self-contained. Licence: everything MIT, no exceptions. Workforce: one human maintainer with occasional AI-agent help. Product surfaces: one small web application. Generated artefacts: none — everything is hand-written source.`;

// Requirement variants deliberately differ in CONCERN CARDINALITY (3 / 7 / 12),
// so classification-count tracking concern-count is a measurable leakage signal.
const REQ_A = `WHAT THE ORGANISATION MUST SERVE: The people and machine collaborators who work here keep needing answers to three questions. When I change this thing, what else must change with it, and will anything tell me? Who may edit these bytes — a person deciding, or a machine that will overwrite my edit on the next rebuild? And when the organisation itself turns out to be wrong somewhere — because it will be — what does it cost to change it? The estate this serves: roughly ten thousand eight hundred tracked files, around five thousand nine hundred commits a year of which three hundred and eight touch several units at once, a workforce that is mostly machine collaborators under human ownership, and an expectation of substantial growth within two years.`;

const REQ_B = `WHAT THE ORGANISATION MUST PREVENT: Design against the ways such estates fail. An edit lands in a file a machine owns, and the next rebuild silently erases it. Two things that always change together live far apart, and one of them is forgotten until production notices. Something whose reuse is legally reserved gets copied as if it were open, because nothing at the point of copying said otherwise. A newcomer reads the wrong thing first and builds a week of work on it. A machine collaborator, which pays for every file it opens, burns its whole budget just discovering where things are. A rule exists only in a document nobody re-reads, so it is violated with confidence. And the reorganisation everyone agrees is needed is priced so high by the current layout that it simply never happens. The estate in question holds roughly ten thousand eight hundred tracked files under version control, sees about five thousand nine hundred commits a year — three hundred and eight of them touching several units in one change — is worked mostly by machine collaborators under human ownership, and is expected to grow substantially within two years.`;

const REQ_C = `WHAT THE ORGANISATION MUST SERVE: The people and machine collaborators who work here keep needing answers while they work. When I change this thing, what else must change with it, and will anything tell me? Who may edit these bytes, and what regenerates them? May this piece import that one, and how would a wrong import be noticed? Under what terms may this leave the estate — freely, under a content licence, or never? Where does a newcomer look first, and does the path they guess exist? What does it cost a machine collaborator, paying for every file it opens, to find one unit? To read it? To edit it safely? Which rules are checked by a machine, and which exist only as good intentions? How does the organisation absorb a doubling of the estate without re-rooting? How would two units be merged, or one split, without a week of ceremony? And when the organisation itself turns out to be wrong somewhere, what does it cost to change? The estate this serves: roughly ten thousand eight hundred tracked files, around five thousand nine hundred commits a year of which three hundred and eight touch several units at once, a workforce that is mostly machine collaborators under human ownership, and an expectation of substantial growth within two years.`;

const REQ = { A: REQ_A, B: REQ_B, C: REQ_C };

const REPO_DIRECT = `GROUNDING: Ground your design by reading the live repository at the current checkout, under a strict ALLOWLIST: you may read ONLY workspace manifests (package.json at any level), pnpm-workspace.yaml, turbo.json, tsconfig files, the lockfile, and source or test files under src/ or tests/ directories — never any Markdown file, never anything inside a dot-directory. Every other path is out of bounds even if not individually named above. READ BUDGET: at most 30 file reads AND at most 5 directory listings or searches; never list or glob the whole repository (a full path listing of this estate is roughly 800,000 characters — half a walker budget in one call). In notes, list EVERY path you read and state both counts.`;

const HAIKU_GRADES = [
  'At most ONE of your classifications may be expressed by directory position; every other classification must live in machine-readable metadata.',
  'Directory depth at most 1 below the repository root, AND every organising rule must be enforceable by a machine check you name.',
  'Directories may not carry ANY classification — a flat namespace of units; classifications live in manifest fields or a name grammar you define; machine-regenerated artefacts may not live in version control at all.',
];

const SONNET_SEEDS = [
  { persona: 'an actuary who prices the risk of future change', constraint: 'favour classifications that survive a doubling of the estate' },
  { persona: 'a rail-network signalling engineer', constraint: 'no classification may exist without a named enforcement instrument' },
  { persona: 'a seed-vault archivist', constraint: 'optimise first for a collaborator who has never seen the estate' },
  { persona: 'a customs officer classifying goods at a border', constraint: 'the whole organisation must be explainable in one page' },
  { persona: 'a hospital pharmacist running a formulary', constraint: 'at most one concept may be borrowed from mainstream monorepo convention' },
  { persona: 'a printing-house imposition planner', constraint: 'treat "who edits these bytes" as the FIRST question, everything else second' },
];

const OPUS_SEEDS = [
  { persona: 'A national-archive chief cataloguer who has migrated three legacy classification systems and is professionally suspicious of any scheme that mirrors the previous one — you have watched inherited structure masquerade as design.', constraint: 'Your design must name what it deliberately does NOT classify, and why.' },
  { persona: 'A container-port terminal designer who thinks in flows, dwell time, and crane economics — everything is priced by how often it moves and who must touch it.', constraint: 'Prefer the smallest rule-set whose violations are mechanically detectable.' },
  { persona: 'A constitutional lawyer drafting a charter for a small federation — obsessed with which powers are enumerated, which are reserved, and how amendments are ratified.', constraint: 'Any rule a newcomer cannot discover from the artefacts themselves is a defect.' },
];

const FABLE_SEEDS = [
  'A polymath urban historian turned city planner, rebuilding a city after an earthquake. You have seen what survives such rebuilds: street grids outlive buildings, zoning outlives councils, and the decisions people regret are the ones that preserved a familiar shape because it was familiar. You write in decisions and regrets — what you kept, what you razed, and what it cost to know the difference.',
  'A theatrical production manager running a repertory house: the same stage hosts different shows nightly. Your world is turnover cost, labelling, and who may touch which props — and above all the difference between the house\'s permanent fabric and each production\'s transient assets. You have struck too many sets at 2am to trust any scheme that confuses the two.',
];

const SOL_PERSONA = 'A lighthouse-service chief engineer from the age of automation: you spent a career converting crewed lighthouses to unmanned ones — deciding what must be visible from the sea, what must run without a keeper, and what a rare visiting engineer must understand in the first hour, because there is nobody to ask. Unstaffed reliability and first-hour legibility are your twin obsessions, and you distrust any structure that needs a resident expert.';

const RULE_ITEM = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'rule', 'carrier'],
  properties: { name: { type: 'string' }, rule: { type: 'string' }, carrier: { type: 'string' } },
};
const PROBE_ITEM = {
  type: 'object',
  additionalProperties: false,
  required: ['probe', 'placement', 'forcedFit'],
  properties: { probe: { type: 'string' }, placement: { type: 'string' }, forcedFit: { type: 'boolean' } },
};
const WALKER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['design', 'organisingRules', 'probePlacements', 'notes'],
  properties: {
    design: { type: 'string' },
    organisingRules: { type: 'array', items: RULE_ITEM },
    probePlacements: { type: 'array', items: PROBE_ITEM },
    notes: { type: 'string' },
  },
};
const FREE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['proposal', 'notes'],
  properties: { proposal: { type: 'string' }, notes: { type: 'string' } },
};
const DECOY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['design', 'organisingRules', 'notes'],
  properties: {
    design: { type: 'string' },
    organisingRules: { type: 'array', items: RULE_ITEM },
    notes: { type: 'string' },
  },
};
const RELAY_OUTCOME = (inner) => ({
  type: 'object',
  additionalProperties: false,
  required: ['outcome'],
  properties: {
    outcome: {
      anyOf: [
        inner,
        { type: 'object', additionalProperties: false, required: ['shortfall'], properties: { shortfall: { type: 'string' } } },
      ],
    },
  },
});
const DEFECT_ITEM = {
  type: 'object',
  additionalProperties: false,
  required: ['claim', 'evidence', 'severity'],
  properties: { claim: { type: 'string' }, evidence: { type: 'string' }, severity: { type: 'string', enum: ['high', 'medium', 'low'] } },
};
const FALSIFIER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['verdict', 'defects', 'fixDesign'],
  properties: {
    verdict: { enum: ['refuted', 'sound-with-defects', 'sound'] },
    defects: { type: 'array', items: DEFECT_ITEM },
    fixDesign: { anyOf: [WALKER_SCHEMA, { type: 'null' }] },
  },
};
const INSTRUMENT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['instrumentDefects', 'foreclosedAnswers', 'betterInstrument'],
  properties: {
    instrumentDefects: { type: 'array', items: DEFECT_ITEM },
    foreclosedAnswers: { type: 'array', items: { type: 'string' } },
    betterInstrument: { type: 'string' },
  },
};
const REDUCER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['descriptors', 'cells', 'outliers', 'notes'],
  properties: {
    descriptors: { type: 'array', maxItems: 8, items: { type: 'object', additionalProperties: false, required: ['name', 'values'], properties: { name: { type: 'string' }, values: { type: 'string' } } } },
    cells: { type: 'array', maxItems: 16, items: { type: 'object', additionalProperties: false, required: ['coordinates', 'memberIds', 'eliteId', 'whyElite'], properties: { coordinates: { type: 'string' }, memberIds: { type: 'array', items: { type: 'string' } }, eliteId: { type: 'string' }, whyElite: { type: 'string' } } } },
    outliers: { type: 'array', maxItems: 12, items: { type: 'object', additionalProperties: false, required: ['id', 'why'], properties: { id: { type: 'string' }, why: { type: 'string' } } } },
    notes: { type: 'string' },
  },
};
const COMPARATOR_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['alignments', 'mismatches', 'attractorTest', 'basinMass', 'decoyAnalysis', 'variantLeakage', 'priorDescriptorFit', 'notes'],
  properties: {
    alignments: { type: 'array', items: { type: 'string' } },
    mismatches: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['aspect', 'xView', 'yView', 'finding'], properties: { aspect: { type: 'string' }, xView: { type: 'string' }, yView: { type: 'string' }, finding: { type: 'string' } } } },
    attractorTest: {
      type: 'object',
      additionalProperties: false,
      required: ['observations', 'verdict', 'caveats'],
      properties: {
        observations: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['id', 'tier', 'invocationPath', 'grounding', 'variant', 'shape', 'matchesDominant1aShape', 'note'], properties: { id: { type: 'string' }, tier: { type: 'string' }, invocationPath: { type: 'string' }, grounding: { type: 'string' }, variant: { type: 'string' }, shape: { type: 'string' }, matchesDominant1aShape: { type: 'boolean' }, note: { type: 'string' } } } },
        verdict: { type: 'string' },
        caveats: { type: 'string' },
      },
    },
    basinMass: { type: 'object', additionalProperties: false, required: ['withFalsifierFixes', 'withoutFalsifierFixes'], properties: { withFalsifierFixes: { type: 'string' }, withoutFalsifierFixes: { type: 'string' } } },
    decoyAnalysis: { type: 'string' },
    variantLeakage: { type: 'string' },
    priorDescriptorFit: { type: 'string' },
    notes: { type: 'string' },
  },
};
const SCORER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['scores', 'notes'],
  properties: {
    scores: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['eliteId', 'boundaryFitness', 'governanceAnswerability'],
        properties: {
          eliteId: { type: 'string' },
          boundaryFitness: { type: 'object', additionalProperties: false, required: ['score', 'evidence'], properties: { score: { type: 'number' }, evidence: { type: 'string' } } },
          governanceAnswerability: { type: 'object', additionalProperties: false, required: ['score', 'evidence'], properties: { score: { type: 'number' }, evidence: { type: 'string' } } },
        },
      },
    },
    notes: { type: 'string' },
  },
};

// The walker-35 packet, inlined VERBATIM (build-time substitution from the
// committed round-1b-falsifier-packet.json) so no falsifier needs repository
// access at all — which also removes the leak where a seat given a Read path
// could list the directory and find the full 1a archive beside the packet.
const FALSIFIER_PACKET_JSON = "{\n  \"provenance\": {\n    \"source\": \".agent/reports/workspace-taxonomy-landscape-survey/round-1-raw.json\",\n    \"rule\": \"dominant cell = max memberCount; elite = cell.eliteWalker\",\n    \"dominantCellDescriptor\": \"cardinality=5-6 | primary-layout-carrier=family (role/tier directory) | depth=3 | generated-in-vcs=yes (mostly; a few partial/dual-track) | unit-kind=package | repo-count=1\",\n    \"dominantCellMemberCount\": 19,\n    \"eliteWalker\": 35,\n    \"regeneratedFor\": \"round 1b falsification arm\",\n    \"contents\": \"eliteSummary + designQuestions + classifications + layoutSketch + probeClassifications, verbatim from walker 35; trajectory and selfScores deliberately excluded (1a instrument artefacts, not the design)\"\n  },\n  \"draw\": {\n    \"idx\": 35,\n    \"persona\": \"a museum collections curator\",\n    \"constraint\": \"optimise exclusively for AI-agent token economics (cost to find, read, and safely edit)\",\n    \"grounding\": \"requirements-only\",\n    \"crossVendor\": false\n  },\n  \"eliteSummary\": \"The dominant convergence shape across personas: 5-6 near-orthogonal classifications (license/edit-domain/import-boundary/quality-gate/consumption/domain or close variants), carried by a tiered directory family (core→infrastructure→products, license root-split), generated bytes committed under a /data or /generated subtree. Elite (walker 35) pairs this with explicit license+edit-domain root partition and .generation.yaml regeneration manifests, zero forced fits.\",\n  \"classifications\": [\n    {\n      \"name\": \"Generation Origin\",\n      \"question\": \"Where does the source code come from?\",\n      \"values\": \"Manual | SpecGenerated | ConfigComputed | Synchronized | Never\",\n      \"carrier\": \"Inferred from source; declared in package.json via regenerationTrigger field\"\n    },\n    {\n      \"name\": \"Consumer Class\",\n      \"question\": \"Who consumes this unit and under what contract?\",\n      \"values\": \"Published (npm) | Internal (workspace) | Demo (published but non-product) | Research (isolated) | Operational (tooling)\",\n      \"carrier\": \"package.json privateFlag and publishConfig; ESLint boundary rules\"\n    },\n    {\n      \"name\": \"Change Rhythm\",\n      \"question\": \"How often and by what trigger does this unit change?\",\n      \"values\": \"SpecDriven | CodeDriven | ConfigDriven | Synchronized | ManualOnly\",\n      \"carrier\": \"package.json regenerationTrigger field; CI hook naming convention\"\n    },\n    {\n      \"name\": \"Edit Boundary\",\n      \"question\": \"Which bytes may humans edit, and which are machine-only?\",\n      \"values\": \"HandWritten | Generated | Mixed | MachineOnly\",\n      \"carrier\": \".gitignore patterns; package.json editBoundary field; ESLint orphan exceptions\"\n    },\n    {\n      \"name\": \"Licensing\",\n      \"question\": \"Under what terms may this unit be reused externally?\",\n      \"values\": \"MIT | OGL-v3.0 | BrandReserved | Mixed (per-export-path)\",\n      \"carrier\": \"package.json license field; exports map declares per-path license; LICENCE file for edge cases\"\n    },\n    {\n      \"name\": \"Stability/Publication Stage\",\n      \"question\": \"Is this unit mature/stable, or experimental/temporary?\",\n      \"values\": \"Stable (SemVer, back-compat) | Experimental (rapid iteration) | Demonstration (non-product) | Infrastructure (version drift ok) | Research (temporary)\",\n      \"carrier\": \"package.json version field (0.x vs 1.x); README classification; ESLint import rules\"\n    }\n  ],\n  \"layoutSketch\": \"\\n```\\noak-open-curriculum-ecosystem/\\n├── packages/core/                  # Tier 1: Primitives (zero external deps)\\n│   ├── result/                     # S1: Error-handling\\n│   ├── safe-path/                  # S2: Path-safety\\n│   ├── [other tiny utilities]/\\n│\\n├── packages/libs/                  # Tier 2: Infrastructure (workspace deps only)\\n│   ├── graph-ingest/\\n│   ├── graph-core/\\n│   ├── search-contracts/\\n│   ├── logger/\\n│   ├── sentry-node/                # S8: Observability adapter\\n│   ├── posthog-node/               # S8: Observability adapter\\n│   └── [other infrastructure]/\\n│\\n├── packages/sdks/                  # Tier 2+: Public SDKs (spec-driven)\\n│   ├── oak-sdk-codegen/            # S7: Large code-generation pipeline\\n│   ├── oak-curriculum-sdk/         # S4: Curriculum API client\\n│   ├── oak-search-sdk/             # S6: Search retrieval library\\n│   ├── graph-corpus-sdk/           # S3: Large graph-data library\\n│   └── [other public SDKs]/\\n│\\n├── packages/design/                # Tier 2: Design system (config-computed)\\n│   ├── oak-design-tokens/          # S5: CSS generation from tokens\\n│   ├── oak-design-system/          # Components\\n│   ├── oak-design-assets/          # P6: Brand imagery (brand-reserved)\\n│   └── [design layers]/\\n│\\n├── packages/docs/                  # Content (OGL licensed)\\n│   └── [reference documentation]/\\n│\\n├── apps/                           # Tier 3: Deployed services (product)\\n│   ├── oak-curriculum-mcp-streamable-http/   # P9a: Deployed MCP server\\n│   ├── oak-search-cli/             # Semantic search CLI (product)\\n│   └── [other applications]/\\n│\\n├── demos/                          # Tier 3: Demonstrations (published but non-product)\\n│   ├── oak-curriculum-hub/         # P9b: Demo (one-way import barrier)\\n│   ├── oak-design-showcase/        # P11: Design showcase with embedded widget\\n│   └── [other demonstrations]/\\n│\\n├── agent-tools/                    # Operational: Workforce tooling (isolated)\\n│   ├── src/commit-hooks/           # P12: Git commit hooks\\n│   ├── src/validators/             # P12: Repo validators (CI + manual)\\n│   └── src/bin/                    # CLI entry points\\n│\\n├── plugins/                        # External integrations (MCP plugins)\\n│   └── oak-open-curriculum/        # Public MCP plugin\\n│\\n├── research/                       # Research investigations (isolated, temporary gates)\\n│   └── web-app-deconstruction/     # P7: Research study on app architecture\\n│\\n├── runtime-only-scripts/           # P8: Bootstrap-time only (no import contract)\\n│   └── validate-package-manager-version.mjs\\n│\\n├── .husky/                         # P4: Git hook entry points\\n│   ├── pre-commit                  # Invokes agent-tools validators\\n│   ├── commit-msg\\n│   ├── pre-push\\n│   └── [other hooks]/\\n│\\n└── .ds-sync/                       # P6: Design system synchronization machinery\\n    ├── lib/                        # Sync logic\\n    └── resync.mjs                  # Orchestrator\\n```\\n\\\"\\n\",\n  \"designQuestions\": [\n    \"What makes two things SEPARATE units? (differentiation by generation origin, consumer class, edit permission, change coordination)\",\n    \"WHERE does a unit live and how does a newcomer find it? (hierarchical path: layer/audience/concern/name; discovery via package.json, README, dependency graph)\",\n    \"Who may IMPORT whom? (unidirectional flow: core ← libs ← sdks/apps ← demos; research/ops/plugins isolated)\",\n    \"Who may EDIT which bytes, and what regenerates? (EditBoundary field in package.json; regenerationTrigger declares automated refresh points)\",\n    \"Under what LICENSE each unit may travel or be reused? (MIT for code; OGL-v3.0 for content; Brand-reserved for assets; mixed via exports map)\",\n    \"What does CHANGING the organization cost? (path changes O(n) rewrites; layer changes very expensive; license elevation requires audit; regeneration changes are contained)\"\n  ],\n  \"probeClassifications\": [\n    {\n      \"probe\": \"P1: spec snapshot + bulk dataset, different schedules\",\n      \"placement\": \"packages/sdks/oak-sdk-codegen/ (spec-fetch output + generated types)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"P2: four machine-regenerated artefact collections (different events)\",\n      \"placement\": \"Multiple units (sdk-codegen, oak-design-tokens, etc.) each with editBoundary:Generated\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"P3: byte-preserved third-party + hand-written styling\",\n      \"placement\": \"packages/design/ (third-party/* in .gitignore; src/styles/ freely editable)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"P4: tooling area with several distinct rhythms (same code, different consumers)\",\n      \"placement\": \"agent-tools/src/ (hooks, validators) + .husky/ (hook entry points); different CLI endpoints\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"P5: hand-curated reference data (content license in code estate)\",\n      \"placement\": \"packages/docs/ or packages/core/reference-data/ (dual license: MIT code + OGL content)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"P6: trademark image assets (different reuse terms from code)\",\n      \"placement\": \"packages/design/oak-design-assets/ (brand-reserved sub-layer; synchronized via .ds-sync)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"P7: research evidence code (quality-gated, not product)\",\n      \"placement\": \"research/web-app-deconstruction/packages/research-evidence/ (isolated, one-way barrier)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"P8: three small operational scripts (outside quality gates)\",\n      \"placement\": \"runtime-only-scripts/ (bootstrap-time only; no import contract; no ESLint lint)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"P9: deployed product + demo (demo must never silently become product)\",\n      \"placement\": \"apps/ (product) vs demos/ (demo); ESLint rule blocks demo→app imports (one-way barrier)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"P10: generic datastore machinery, currently embedded in product\",\n      \"placement\": \"Currently in apps/oak-search-cli/ (embedded); extractable to packages/libs/elasticsearch-base/\",\n      \"forcedFit\": true\n    },\n    {\n      \"probe\": \"P11: browser-built widget embedded into server module\",\n      \"placement\": \"demos/oak-design-showcase/ (esbuild output; dist/widget.js in exports; editBoundary:Generated)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"P12: commit-hook code + repo validator (same rhythm, different consumers)\",\n      \"placement\": \"agent-tools/src/ (collocated; different CLI entry points: codex-session-identity-hook vs validate-boundaries)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"S1: error-handling primitive (tiny, zero-dep, imported nearly everywhere)\",\n      \"placement\": \"packages/core/result/ (Tier 1; stable; MIT)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"S2: path-safety utility (born from security incident)\",\n      \"placement\": \"packages/core/safe-path/ (Tier 1; stable; immutable API; MIT)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"S3: large graph-data library (74 public symbols)\",\n      \"placement\": \"packages/sdks/graph-corpus-sdk/ (Published; Stable; MIT; CodeDriven)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"S4: typed client for curriculum service (published publicly)\",\n      \"placement\": \"packages/sdks/oak-curriculum-sdk/ (Published; SpecGenerated; SpecDriven; MIT; Mixed editBoundary)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"S5: design-token pipeline generating CSS\",\n      \"placement\": \"packages/design/oak-design-tokens/ (Internal; ConfigComputed; ConfigDriven; Generated editBoundary; MIT)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"S6: search retrieval library over commodity datastore\",\n      \"placement\": \"packages/sdks/oak-search-sdk/ (Published/Internal dual; CodeDriven; HandWritten; MIT)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"S7: large code-generation pipeline (~600 commits/yr; spec + types + data + vocab)\",\n      \"placement\": \"packages/sdks/oak-sdk-codegen/ (Internal; SpecGenerated; SpecDriven; Mixed editBoundary; Experimental)\",\n      \"forcedFit\": false\n    },\n    {\n      \"probe\": \"S8: observability adapter for vendor (thin wrapper)\",\n      \"placement\": \"packages/libs/sentry-node/ and packages/libs/posthog-node/ (Internal; CodeDriven; HandWritten; MIT; Stable)\",\n      \"forcedFit\": false\n    }\n  ]\n}";

const CLI_MODELS = {
  sol: { id: 'gpt-5.6-sol', effort: 'ultra' },
  terra: { id: 'gpt-5.6-terra', effort: 'medium' },
};

function cliRelayPrompt(w, brief, schema) {
  const m = CLI_MODELS[w.cliTier];
  return `You are a PARSER RELAY for a codex CLI invocation, not a designer. Steps, exactly:
1. Write the text between PROMPT markers, verbatim, to a scratchpad file (call it p.txt).
2. Write the JSON between SCHEMA markers, verbatim, to a scratchpad file (call it s.json).
3. From the repository root, run the CLI under the repo's bounded-spawn shape (macOS ships no timeout binary; the alarm reaps the process at 30 minutes by construction):
   perl -e 'alarm 1800; exec @ARGV' -- codex exec -s read-only -m ${m.id} -c model_reasoning_effort="${m.effort}" --color never --output-schema <path to s.json> -o <path to out.txt> - < <path to p.txt>
4. Read out.txt and parse it as JSON. If it parses and has the schema's required keys, return {"outcome": <the parsed object>} VERBATIM — no summarising, no restructuring, no vocabulary of your own.
5. If the command fails, out.txt is missing, or the parse fails, re-run ONCE (same bounded shape); if it still fails, return {"outcome": {"shortfall": "<exact reason including stderr tail>"}}. Never substitute your own design.
6. Before returning, run a process census (ps) and confirm no codex process from YOUR invocations survives; if one does, kill it by pid and name that in the shortfall or notes.

--- PROMPT START ---
${brief}
--- PROMPT END ---
--- SCHEMA START ---
${JSON.stringify(schema)}
--- SCHEMA END ---`;
}

function groundingText(grounding, variant) {
  if (grounding === 'a') return REPO_DIRECT;
  if (grounding === 'b') return `${FACTS}\n\n${SEALED}`;
  return `${REQ[variant]}\n\n${SEALED}`;
}

function walkerPrompt(w) {
  const parts = [TASK];
  if (w.persona) parts.push(`YOUR STARTING FRAME: ${w.persona}`);
  if (w.constraint) parts.push(`YOUR CONSTRAINT (binding — a design that violates it is invalid): ${w.constraint}`);
  parts.push(groundingText(w.grounding, w.variant));
  parts.push(PROBES);
  return parts.join('\n\n');
}

function freePrompt(w) {
  return [TASK_FREE, groundingText(w.grounding, w.variant)].join('\n\n');
}

function decoyPrompt() {
  const task = TASK.replace(', and your placement of each case in the probe set below', '');
  return [task, DECOY_FACTS, SEALED].join('\n\n');
}

function falsifierPrompt() {
  return `THE DESIGN UNDER ATTACK (verbatim from the prior round — eliteSummary, designQuestions, classifications, layoutSketch, probeClassifications):\n${FALSIFIER_PACKET_JSON}\n\nA prior survey of this design space produced the design in the packet above as its strongest candidate. Your job is to test it to destruction — and to report honestly what survives. First: audit it adversarially against the estate described below — find where it is wrong, vague where it must be precise, expensive where it claims to be cheap, or quietly dependent on the very structure it claims to redesign. Every defect needs evidence from the design's own text or the grounding, and a severity (high/medium/low). Second: give your verdict — "refuted", "sound-with-defects", or "sound". If your verdict is refuted or sound-with-defects with high-severity findings, produce a complete alternative design that cures your highest-severity defects (your fix, not a patch of theirs), placing every probe case. If after honest effort you judge the design sound, SAY SO — set fixDesign to null; a forced fix is worth less than an honest verdict.\n\n${FACTS}\n\n${REQ_A}\n\n${PROBES}\n\n${SEALED}`;
}

function instrumentFalsifierPrompt() {
  return `You are auditing a survey INSTRUMENT, not a design. A fleet of agents will each receive the texts below (task statement, probe set, requirement prose, output schema) and produce organisational designs for a real estate; the survey's owners fear the instrument teaches the answers it then measures. Attack the instrument: what answers does its wording foreclose? What structure does it presuppose (in the task statement's nouns, the schema's required keys, the probe set's minimal pairs)? What would an agent who disagreed with the instrument's framing be UNABLE to express? Evidence every defect from the instrument's own text, with severity. Then sketch a better instrument in prose.\n\n--- THE TASK STATEMENT ---\n${TASK}\n--- THE FREE-FORM VARIANT (also in use) ---\n${TASK_FREE}\n--- THE PROBE SET ---\n${PROBES}\n--- REQUIREMENT PROSE VARIANTS (3, differing in concern cardinality) ---\nA: ${REQ_A}\n\nB: ${REQ_B}\n\nC: ${REQ_C}\n--- THE OUTPUT SCHEMA (JSON Schema) ---\n${JSON.stringify(WALKER_SCHEMA)}`;
}

const ONE_A_DESCRIPTORS = `The PRIOR round's reducer derived this descriptor tuple over its own corpus: (basis cardinality | primary tree carrier: role/family/stratum/clock/authorship/flat/other | tree depth 0-3+ | generated-in-git: yes/no/partial | unit of description | repo count). Its dominant cell was: cardinality 5-6, primary carrier family (role/tier directory), depth 3, generated-in-vcs yes, unit package, repo-count 1 — 19 of 46 walkers. The dominant SHAPE it reported: 5-6 near-orthogonal classifications (licence / edit-domain / import-boundary / quality-gate / consumption / domain or close variants) carried by a tiered directory family, generated bytes committed under a data or generated subtree.`;

const MEASURED_RECORD = `THE MEASURED RECORD (12 months of git history; independent of every proposal). Co-change pairs, with a gloss mapping each named unit to the probe world the designs used: vocab-mining with corpus-data 95% (the codegen pipeline's mining stage and its mined corpus data — probe S7's internals); es-ingest members 89% (the search datastore's ingest pipeline members — the machinery behind S6); fidelity-capture members 86% (the research capture instrument and its captured outputs — probe P7's world). Splitting any of these across boundaries is measured breakage. Measured-independent units: mcp-tools 32% (the product MCP server's tool modules), graph-views 11% (the graph library's view layer — part of S3's world), conformance 11% (the conformance validation suite — probe P12's world); safe to separate. Regeneration clock rates per year: spec 29, mining 19, widget 18, index 16, brand 10, editorial 8, bulk 7. Live mechanisms: one pnpm+turbo build graph, one credential for the external curriculum platform covering spec+bulk+live, licence classes MIT/OGL/reserved coexisting.`;

function reducerPrompt(corpusJson) {
  return `Here is a corpus of organisational designs for one estate, each with arm, tier, grounding, variant, and origin metadata. Derive YOUR OWN descriptor dimensions from what actually varies in this corpus — do not import a scheme from anywhere. Assign every design to a cell in your descriptor space, name the strongest member of each cell (by id) and why, and name the designs too singular for any cell. Some entries are free-form prose (origin "free-form") — treat them as first-class corpus members whether or not they fit the shape the structured entries share. Do not read any repository files: the corpus below is your entire world.\n\n--- CORPUS (JSON) ---\n${corpusJson}\n--- END CORPUS ---`;
}

async function runWalker(w) {
  const schema = w.free ? FREE_SCHEMA : WALKER_SCHEMA;
  const brief = w.free ? freePrompt(w) : walkerPrompt(w);
  if (w.tier === 'codex-cli') {
    const r = await agent(cliRelayPrompt(w, brief, schema), { label: w.id, phase: w.phase, schema: RELAY_OUTCOME(schema), model: 'sonnet', effort: 'low' });
    const outcome = r?.outcome ?? null;
    if (outcome && typeof outcome.shortfall === 'string') return { ...w, result: null, shortfall: outcome.shortfall };
    return { ...w, result: outcome, shortfall: outcome ? null : 'cli relay agent failed' };
  }
  if (w.tier === 'codex') {
    const r = await agent(`You are a PARSER RELAY, not a designer. Load the codex dialogue tool via ToolSearch (query "select:mcp__codex-dialogues__codex,mcp__codex-dialogues__codex-reply"). Send codex EXACTLY the brief between the BRIEF markers — add nothing, reframe nothing. Require it to answer with ONE fenced JSON block matching this JSON Schema: ${JSON.stringify(schema)}. Extract that block VERBATIM — no summarising, no restructuring, no vocabulary of your own. Validate it is well-formed JSON with the schema's required keys. If the reply has no valid block, re-ask ONCE via codex-reply quoting the shape requirement. If the tool is unavailable or validation still fails, return {"outcome": {"shortfall": "<exact reason>"}}. Never substitute your own design. Return {"outcome": <the extracted object>} on success.\n\n--- BRIEF START ---\n${brief}\n--- BRIEF END ---`, { label: w.id, phase: w.phase, schema: RELAY_OUTCOME(schema), model: 'sonnet', effort: 'low' });
    const outcome = r?.outcome ?? null;
    if (outcome && typeof outcome.shortfall === 'string') return { ...w, result: null, shortfall: outcome.shortfall };
    return { ...w, result: outcome, shortfall: outcome ? null : 'relay agent failed' };
  }
  const r = await agent(brief, { label: w.id, phase: w.phase, schema, model: w.tier });
  return { ...w, result: r, shortfall: r ? null : 'schema/agent failure' };
}

async function runDecoy(d) {
  if (d.tier === 'codex-cli') {
    const r = await agent(cliRelayPrompt(d, decoyPrompt(), DECOY_SCHEMA), { label: d.id, phase: 'Controls', schema: RELAY_OUTCOME(DECOY_SCHEMA), model: 'sonnet', effort: 'low' });
    const outcome = r?.outcome ?? null;
    if (outcome && typeof outcome.shortfall === 'string') return { ...d, result: null, shortfall: outcome.shortfall };
    return { ...d, result: outcome, shortfall: null };
  }
  const r = await agent(decoyPrompt(), { label: d.id, phase: 'Controls', schema: DECOY_SCHEMA, model: d.tier });
  return { ...d, result: r, shortfall: r ? null : 'schema/agent failure' };
}

// ---- Build the deterministic walker table ----
// Requirement-variant assignment is EXPLICIT and balanced: it cycles A/B/C
// over grounding-c seats in build order (index parity proved unbalanced —
// 13/4/1 — because index mod 3 correlates with the arm layout).
const walkers = [];
let idx = 0;
let cSeat = 0;
const add = (partial) => {
  const variant = partial.grounding === 'c' ? ['A', 'B', 'C'][cSeat % 3] : 'n/a';
  if (partial.grounding === 'c') cSeat += 1;
  walkers.push({ idx, id: `${partial.arm}-${idx}`, variant, phase: partial.phase ?? 'Walkers', ...partial });
  idx += 1;
};

for (const g of ['a', 'b', 'c']) add({ arm: 'B-haiku', tier: 'haiku', grounding: g, phase: 'Baselines' });
for (const g of ['a', 'b', 'c']) add({ arm: 'B-sonnet', tier: 'sonnet', grounding: g, phase: 'Baselines' });
for (const g of ['a', 'b', 'c']) add({ arm: 'B-opus', tier: 'opus', grounding: g, phase: 'Baselines' });
for (const g of ['b', 'c']) add({ arm: 'B-fable', tier: 'fable', grounding: g, phase: 'Baselines' });
for (const g of ['b', 'c', 'c']) add({ arm: 'B-codex', tier: 'codex', grounding: g, phase: 'Baselines' });
for (let grade = 0; grade < 3; grade += 1) {
  for (const g of ['a', 'b', 'c']) add({ arm: `H-grade${grade + 1}`, tier: 'haiku', grounding: g, constraint: HAIKU_GRADES[grade] });
}
SONNET_SEEDS.forEach((s, i) => add({ arm: 'S-seeded', tier: 'sonnet', grounding: ['a', 'b', 'c'][i % 3], persona: s.persona, constraint: s.constraint }));
OPUS_SEEDS.forEach((s, i) => add({ arm: 'O-seeded', tier: 'opus', grounding: ['a', 'b', 'c'][i], persona: s.persona, constraint: s.constraint }));
FABLE_SEEDS.forEach((p, i) => add({ arm: 'F-seeded', tier: 'fable', grounding: ['a', 'b'][i], persona: p }));
[HAIKU_GRADES[1], HAIKU_GRADES[1], HAIKU_GRADES[2], HAIKU_GRADES[0]].forEach((c, i) => add({ arm: 'X-seeded', tier: 'codex', grounding: ['b', 'c', 'b', 'c'][i], constraint: c }));

// Owner-directed CLI arms (2026-08-17: "A few Sol ultra, many Terra medium... in addition to").
for (const g of ['a', 'b', 'c']) add({ arm: 'B-terra', tier: 'codex-cli', cliTier: 'terra', grounding: g, phase: 'Baselines' });
for (let grade = 0; grade < 3; grade += 1) {
  for (const g of ['a', 'b', 'c']) add({ arm: `T-grade${grade + 1}`, tier: 'codex-cli', cliTier: 'terra', grounding: g, constraint: HAIKU_GRADES[grade] });
}
add({ arm: 'B-sol', tier: 'codex-cli', cliTier: 'sol', grounding: 'b', phase: 'Baselines' });
add({ arm: 'SOL-seeded', tier: 'codex-cli', cliTier: 'sol', grounding: 'b', persona: SOL_PERSONA });

// De-ontologised free-form arm (frame-challenger cure: can the corpus escape
// classifications-with-carriers at all when the instrument stops demanding them?).
add({ arm: 'D-free', tier: 'haiku', grounding: 'b', free: true });
add({ arm: 'D-free', tier: 'opus', grounding: 'b', free: true });
add({ arm: 'D-free', tier: 'fable', grounding: 'b', free: true });
add({ arm: 'D-free', tier: 'codex-cli', cliTier: 'terra', grounding: 'b', free: true });

// Replication arm (assumptions-review cure): a SECOND grounding-b baseline
// per tier — grounding b exists in EVERY tier, making it the attractor
// test's balanced headline column at n=2 per tier (sol stays n=1, priced
// as "a few"; the comparator's caveats name it).
add({ arm: 'B2-haiku', tier: 'haiku', grounding: 'b', phase: 'Baselines' });
add({ arm: 'B2-sonnet', tier: 'sonnet', grounding: 'b', phase: 'Baselines' });
add({ arm: 'B2-opus', tier: 'opus', grounding: 'b', phase: 'Baselines' });
add({ arm: 'B2-fable', tier: 'fable', grounding: 'b', phase: 'Baselines' });
add({ arm: 'B2-codex', tier: 'codex', grounding: 'b', phase: 'Baselines' });
add({ arm: 'B2-terra', tier: 'codex-cli', cliTier: 'terra', grounding: 'b', phase: 'Baselines' });

// High-tier carrier-ban seats (assumptions-review cure): the grade-3
// directory ban previously ran only on low tiers; territory evidence needs
// the ban tested where the unseeded attractor actually appears.
add({ arm: 'O-grade3', tier: 'opus', grounding: 'b', constraint: HAIKU_GRADES[2] });
add({ arm: 'F-grade3', tier: 'fable', grounding: 'b', constraint: HAIKU_GRADES[2] });

log(`round 1b: ${String(walkers.length)} walkers built (expect 64: 52 estate + 4 free-form + 6 replication + 2 high-tier grade-3)`);

// Decoy-estate stimulus controls (frame-challenger cure: same task, wrong
// estate — if the dominant shape appears where it is manifestly wrong, it is
// a convention prior, not territory). Never enter the reduction corpus.
const decoys = [
  { id: 'DECOY-haiku', tier: 'haiku' },
  { id: 'DECOY-sonnet', tier: 'sonnet' },
  { id: 'DECOY-opus', tier: 'opus' },
  { id: 'DECOY-terra', tier: 'codex-cli', cliTier: 'terra', arm: 'D-decoy' },
];

// ---- Dispatch: walkers, decoys, and falsifiers concurrently; reduce is a true barrier ----
const walkersP = parallel(walkers.map((w) => () => runWalker(w)));
const decoysP = parallel(decoys.map((d) => () => runDecoy(d)));
const falsifierSeats = [
  { id: 'K-opus-1', model: 'opus', kind: 'design', relay: false },
  { id: 'K-fable-1', model: 'fable', kind: 'design', relay: false },
  { id: 'K-codex-1', model: 'sonnet', kind: 'design', relay: true },
  { id: 'K-sol-1', model: 'sonnet', kind: 'design', cli: 'sol' },
  { id: 'K-instrument', model: 'opus', kind: 'instrument' },
];
const falsifiersP = parallel(falsifierSeats.map((f) => () => {
  if (f.kind === 'instrument') {
    return agent(instrumentFalsifierPrompt(), { label: f.id, phase: 'Falsifiers', schema: INSTRUMENT_SCHEMA, model: f.model })
      .then((r) => ({ ...f, result: r }));
  }
  if (f.cli) {
    return agent(cliRelayPrompt({ cliTier: f.cli }, falsifierPrompt(), FALSIFIER_SCHEMA), { label: f.id, phase: 'Falsifiers', schema: RELAY_OUTCOME(FALSIFIER_SCHEMA), model: f.model, effort: 'low' })
      .then((r) => {
        const outcome = r?.outcome ?? null;
        if (outcome && typeof outcome.shortfall === 'string') return { ...f, result: null, shortfall: outcome.shortfall };
        return { ...f, result: outcome };
      });
  }
  if (f.relay) {
    return agent(`You are a PARSER RELAY for an adversarial audit. Load the codex dialogue tool via ToolSearch (query "select:mcp__codex-dialogues__codex,mcp__codex-dialogues__codex-reply"). Send codex EXACTLY the brief between the BRIEF markers (it already contains the design under attack) — add nothing, reframe nothing. Require ONE fenced JSON block matching this JSON Schema: ${JSON.stringify(FALSIFIER_SCHEMA)}. Extract verbatim, validate, re-ask once on failure, else return {"outcome": {"shortfall": "<exact reason>"}}. Add nothing of your own. Return {"outcome": <the extracted object>} on success.\n\n--- BRIEF START ---\n${falsifierPrompt()}\n--- BRIEF END ---`, { label: f.id, phase: 'Falsifiers', schema: RELAY_OUTCOME(FALSIFIER_SCHEMA), model: f.model, effort: 'low' })
      .then((r) => {
        const outcome = r?.outcome ?? null;
        if (outcome && typeof outcome.shortfall === 'string') return { ...f, result: null, shortfall: outcome.shortfall };
        return { ...f, result: outcome };
      });
  }
  return agent(falsifierPrompt(), { label: f.id, phase: 'Falsifiers', schema: FALSIFIER_SCHEMA, model: f.model })
    .then((r) => ({ ...f, result: r }));
}));

// args can arrive JSON-encoded depending on the invoking harness; normalise
// once (observed on the 2026-08-17 first run: extraCorpusEntries silently
// missed injection because args was a string).
const ARGS = (() => {
  if (typeof args === 'string') { try { return JSON.parse(args); } catch { return {}; } }
  return args ?? {};
})();

const walkerResults = (await walkersP).filter(Boolean);
const decoyResults = (await decoysP).filter(Boolean);
const falsifierResults = (await falsifiersP).filter(Boolean);

// ---- Arm health ----
const armHealth = {};
for (const w of walkerResults) {
  armHealth[w.arm] = armHealth[w.arm] ?? { total: 0, failed: 0 };
  armHealth[w.arm].total += 1;
  if (!w.result) armHealth[w.arm].failed += 1;
}
for (const f of falsifierResults) {
  const armKey = f.kind === 'instrument' ? 'K-instrument' : 'K-design';
  armHealth[armKey] = armHealth[armKey] ?? { total: 0, failed: 0 };
  armHealth[armKey].total += 1;
  if (!f.result) armHealth[armKey].failed += 1;
}
const compromisedArms = Object.entries(armHealth).filter(([, h]) => h.failed / h.total > 0.25).map(([arm]) => arm);
if (compromisedArms.length > 0) log(`COMPROMISED ARMS (>25% failure): ${compromisedArms.join(', ')}`);

// ---- Corpus for reduction: walkers + free-form + falsifier fix-designs (+ injected entries, e.g. the mechanical baseline) ----
const corpusEntries = walkerResults
  .filter((w) => w.result)
  .map((w) => ({ id: w.id, arm: w.arm, tier: w.cliTier ?? w.tier, grounding: w.grounding, variant: w.variant, origin: w.free ? 'free-form' : 'walker', design: w.result }));
for (const f of falsifierResults) {
  if (f.kind === 'design' && f.result?.fixDesign) corpusEntries.push({ id: `${f.id}-fix`, arm: 'K-falsify', tier: f.cli ?? f.model, grounding: 'packet+facts+reqA', variant: 'A', origin: 'falsifier', design: f.result.fixDesign });
}
for (const extra of (Array.isArray(ARGS.extraCorpusEntries) ? ARGS.extraCorpusEntries : [])) corpusEntries.push(extra);
const corpusJson = JSON.stringify(corpusEntries);
log(`corpus assembled: ${String(corpusEntries.length)} designs (${String(walkerResults.filter((w) => !w.result).length)} walker shortfalls)`);

// ---- Double reduction; scorer follows X without waiting for Y ----
const xP = agent(reducerPrompt(corpusJson), { label: 'reducer-X', phase: 'Reduce', schema: REDUCER_SCHEMA, model: 'opus' });
const yP = agent(reducerPrompt(corpusJson), { label: 'reducer-Y', phase: 'Reduce', schema: REDUCER_SCHEMA, model: 'fable' });
const reducerX = await xP;
const scorerP = reducerX
  ? agent(
      `Score each elite below against the measured record only. Boundary fitness (0-5): would this design's minting rule split any >=85% co-change pair across boundaries? Governance answerability (0-5): can import direction, edit rights, licence, regeneration, and membership each be answered by reading ONE declared thing? Give the specific evidence per score. Never score against any prior round's solutions.\n\n${MEASURED_RECORD}\n\n--- ELITES (JSON: reducer cells with eliteId; full designs follow) ---\n${JSON.stringify(reducerX.cells)}\n--- ELITE DESIGNS ---\n${JSON.stringify(corpusEntries.filter((e) => reducerX.cells.some((c) => c.eliteId === e.id)))}\n--- END ---`,
      { label: 'scorer', phase: 'Score', schema: SCORER_SCHEMA, model: 'sonnet' },
    )
  : null;
const reducerY = await yP;
const comparator = reducerX && reducerY
  ? await agent(
      `Two independent reductions of one corpus, the descriptor scheme a PRIOR round derived over a different corpus, the unseeded baseline designs, and a set of DECOY-estate control outputs (same task statement, deliberately different estate: tiny, single-licence, no generated artefacts, no external services — a place where the prior round's dominant shape would be manifestly wrong). Report, against the schema: (1) where the two reductions agree and disagree — a disagreement is a finding about the instrument, not an error to fix; AND note: agreement between the reductions (or with the prior scheme) on classification COUNT and carrier TYPE is expected BY CONSTRUCTION — the corpus schema forces organisingRules with name/rule/carrier — so never count those two dimensions as convergence evidence; report only agreements the schema did not force. (2) The attractor test as PER-OBSERVATION rows — one row per unseeded baseline design (arm ids starting "B-" or "B2-"). The HEADLINE column is grounding b, which exists in every tier with n=2 per tier (arms B-* plus B2-*; sol is n=1 — say so); treat grounding a and c rows as supporting observations only, and state in caveats that tier, grounding, and sampling variance are not separable outside the grounding-b column. (3) Basin mass around the dominant shape reported twice — with and without origin=falsifier corpus entries (they read the prior elite verbatim and are the most anchored designs present). (4) decoyAnalysis — do the decoy outputs reproduce the prior dominant shape where it is manifestly wrong? If yes, that shape is evidence of a convention prior, not territory. (5) variantLeakage — requirement variants A/B/C deliberately carry 3/7/12 concerns; does classification count track concern cardinality across grounding-c walkers? Note in the same field that variant is balanced globally (6/6/6) but NOT within tier — treat tier-by-variant cells as confounded at their n. (6) Whether the prior round's descriptors would have fit this corpus (priorDescriptorFit).\n\n${ONE_A_DESCRIPTORS}\n\n--- REDUCTION X (opus) ---\n${JSON.stringify(reducerX)}\n--- REDUCTION Y (fable) ---\n${JSON.stringify(reducerY)}\n--- BASELINE DESIGNS ---\n${JSON.stringify(corpusEntries.filter((e) => e.arm.startsWith('B-')))}\n--- DECOY CONTROL OUTPUTS ---\n${JSON.stringify(decoyResults.map((d) => ({ id: d.id, tier: d.cliTier ?? d.tier, result: d.result, shortfall: d.shortfall ?? null })))}\n--- END ---`,
      { label: 'comparator', phase: 'Compare', schema: COMPARATOR_SCHEMA, model: 'sonnet' },
    )
  : null;
const scorer = scorerP ? await scorerP : null;

return {
  meta: { round: '1b', startedAt: ARGS.startedAt ?? null, spec: 'landscape-survey-round1b-fleet-design-2026-08-17.md' },
  armHealth,
  compromisedArms,
  walkers: walkerResults,
  decoys: decoyResults,
  falsifiers: falsifierResults,
  reducerX,
  reducerY,
  comparator,
  scorer,
};
