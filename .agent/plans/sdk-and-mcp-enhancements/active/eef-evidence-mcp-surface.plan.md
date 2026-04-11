---
name: "EEF Evidence MCP Surface"
overview: "Expose EEF Teaching and Learning Toolkit data as MCP resources, an aggregated recommendation tool, and an evidence-grounded lesson planning prompt."
parent_plan: "open-education-knowledge-surfaces.plan.md"
sibling_plans:
  - "misconception-graph-mcp-surface.plan.md"
specialist_reviewer: "mcp-reviewer, code-reviewer, test-reviewer"
isProject: false
todos:
  - id: t1-eef-data-loader
    content: "Create eef-toolkit-data.ts with Zod-validated loader in oak-curriculum-sdk/src/mcp/data/"
    status: pending
  - id: t2-methodology-resource
    content: "Create eef-methodology-resource.ts using graph factory for methodology + caveats resource"
    status: pending
  - id: t3-strands-resource
    content: "Create eef-strands-resource.ts using graph factory for 30 strands overview resource"
    status: pending
  - id: t4-recommendation-tool
    content: "Create aggregated-eef-recommend.ts with recommend-evidence-for-context tool, scoring, and null-impact guard"
    status: pending
  - id: t5-guidance-constant
    content: "Create eef-evidence-guidance.ts with AGGREGATED_EEF_EVIDENCE_GUIDANCE constant"
    status: pending
  - id: t6-register-definitions
    content: "Add recommend-evidence-for-context to AGGREGATED_TOOL_DEFS in definitions.ts"
    status: pending
  - id: t7-register-executor
    content: "Add handler in AGGREGATED_HANDLERS map in executor.ts"
    status: pending
  - id: t8-public-export
    content: "Export EEF resource constants and getters from public/mcp-tools.ts"
    status: pending
  - id: t9-register-resources
    content: "Register EEF resources via registerGraphResource() in register-resources.ts"
    status: pending
  - id: t10-register-prompt
    content: "Add evidence-grounded-lesson-plan prompt to mcp-prompts.ts and mcp-prompt-messages.ts"
    status: pending
  - id: t11-adr-123-update
    content: "Update ADR-123 resources and tools tables with EEF entries"
    status: pending
  - id: t12-e2e-test
    content: "Add E2E assertions for recommend-evidence-for-context tool, EEF resources, and evidence prompt"
    status: pending
---

# EEF Evidence MCP Surface

**Status**: PENDING — all 12 findings resolved, ready for implementation (WS-3)
**Last Updated**: 2026-04-11
**Branch**: `planning/kg_eef_integration`
**Strategic context**: `.agent/plans/kgs-and-pedagogy/future/evidence-integration-strategy.md`
(this plan implements Levels 2-3 of the evidence integration strategy)

## Pre-Implementation Review Findings — RESOLVED

All 12 findings from the 2026-04-10 pre-implementation review have been
resolved. Resolutions are inlined into the implementation sections below.

| # | Finding | Resolution |
|---|---------|------------|
| 1 | Data placement | SDK `src/mcp/data/`, not codegen. Third-party static data. |
| 2 | Type all fields | Full interfaces from JSON. No `Record<string, unknown>`. |
| 3 | Meta incomplete | All 7 fields typed: schema_version, data_version, source, licence, last_updated, coverage, caveats. |
| 4 | `as const satisfies` | Direct Zod `.parse()` at load time. |
| 5 | Null-impact guard | Pre-filter 4 strands before scoring; include count in `data_coverage`. |
| 6 | URI scheme | `curriculum://eef-methodology`, `curriculum://eef-strands`. |
| 7 | Zod validation | Zod schema validates JSON at import; test proves parse succeeds. |
| 8 | Prompt step 3 | Clarified: extract implementation data from recommendation response fields. |
| 9 | KS-to-phase mapping | Inline table in prompt text. |
| 10 | Focus enum | Use `most_relevant_priorities` values from data. Data uses `closing_disadvantage_gap` (no "the"). |
| 11 | Factory for resources | Methodology + strands use graph factory. Recommendation tool is custom. |
| 12 | Security schemes | `SCOPES_SUPPORTED` on custom tool def. |

## Credits

- **EEF Toolkit data**: Education Endowment Foundation
  (<https://educationendowmentfoundation.org.uk>)
- **EEF MCP server prototype**: John Roberts (JR)
  `<john.roberts@thenational.academy>`

When this plan ships, add JR to the repo's authors list.

## Context

The EEF Teaching and Learning Toolkit is the UK government's What Works
Centre for Education evidence base: 30 research-synthesised teaching
approaches with quantified impact (months of additional progress), cost
ratings (1-5), and evidence strength ratings (0-5 padlocks).

A prototype MCP server (Python, stdio) demonstrates the concept. This
plan brings the evidence data into Oak's production MCP server using
Oak's established patterns — following the same approach as the
misconception graph and prior knowledge graph surfaces.

The EEF data file (`eef-toolkit.json`, v0.2.0) is already in the repo
at `.agent/plans/kgs-and-pedagogy/future/eef-toolkit.json`. This plan
copies it into the SDK as a static data asset.

## Impact-Preserving Requirements

This implementation MUST satisfy R1-R8 from the evidence integration
strategy. The critical ones for this scope:

- **R1 (Epistemic honesty)**: every recommendation includes impact +
  evidence strength + population-average caveat
- **R2 (Transparent scoring)**: the 40/30/20/10 weighting is exposed
  in the tool response, not hidden
- **R3 (Disadvantage gap priority)**: PP relevance as a first-class
  parameter
- **R5 (Implementation guidance)**: CPD intensity, staffing, time to
  embed included in recommendations
- **R7 (Professional judgement)**: responses framed as decision-support,
  not automatic policy
- **R8 (Partial coverage honesty)**: transparent about 17/30 context
  coverage

## Decision

Follow the patterns established by `prior-knowledge-graph-resource.ts`,
`aggregated-prior-knowledge-graph.ts`, and `misconception-graph-mcp-surface.plan.md`.
Add one recommendation tool with transparent composite scoring, two
resources (methodology+caveats, strands overview), and one prompt.

## Data Source

**EEF JSON only.** This plan uses the static EEF data file directly.
It does NOT depend on the Oak Curriculum Ontology, the KG alignment
audit, or Neo4j. It is independently deliverable (Levels 2-3 of the
evidence integration strategy).

## Implementation

### Phase 1: Data, types, and Zod validation (SDK)

**T1: Data loader** — `oak-curriculum-sdk/src/mcp/data/eef-toolkit.json`
and `oak-curriculum-sdk/src/mcp/eef-toolkit-data.ts`

**[F1 RESOLVED]** Data lives in `oak-curriculum-sdk/src/mcp/data/`, NOT
in `oak-sdk-codegen/`. EEF data is third-party static data — the
cardinal rule (types flow from OpenAPI) does not apply.

**[F4 RESOLVED]** Use direct Zod `.parse()` at load time, not
`as const satisfies`. Same pattern as misconception graph.

**[F7 RESOLVED]** Zod schema validates the JSON at import time.
Schema drift = loud failure at module load, not silent runtime bugs.

**[F2, F3 RESOLVED]** All fields typed precisely. No `Record<string, unknown>`.

```typescript
// === Meta (7 fields — F3 RESOLVED) ===
// Zod schema for meta:
const EefMetaSchema = z.object({
  schema_version: z.string(),
  data_version: z.string(),
  source: z.object({
    name: z.string(),
    url: z.string(),
    organisation: z.string(),
    original_authors: z.array(z.string()),
  }),
  licence: z.object({
    name: z.string(),
    url: z.string(),
    attribution_note: z.string(),
  }),
  last_updated: z.string(),
  coverage: z.object({
    age_range: z.string(),
    jurisdiction_focus: z.string(),
    evidence_scope: z.string(),
  }),
  caveats: z.array(z.string()),
});

// === UK Context (F2 RESOLVED — no Record<string, unknown>) ===
const EefUkContextSchema = z.object({
  pupil_premium_rates_2024_25: z.object({
    primary_fsm: z.number(),
    secondary_fsm: z.number(),
    looked_after_children: z.number(),
    service_children: z.number(),
  }),
  national_averages: z.object({
    pp_percentage: z.number(),
    send_support_percentage: z.number(),
    ehcp_percentage: z.number(),
    primary_avg_size: z.number(),
    secondary_avg_size: z.number(),
  }),
  key_stage_mapping: z.record(
    z.enum(['EYFS', 'KS1', 'KS2', 'KS3', 'KS4', 'KS5']),
    z.object({
      age: z.string(),
      years: z.array(z.string()),
    }),
  ),
});

// === Implementation Requirements ===
const EefImplementationRequirementsSchema = z.object({
  cpd_intensity: z.enum(['minimal', 'light', 'moderate', 'intensive']),
  additional_staff_needed: z.boolean(),
  resource_cost: z.enum(['minimal', 'low', 'moderate', 'high']),
  time_to_embed: z.string(),
  key_staff: z.array(z.string()),
  // Rare optional fields (1/17 strands)
  critical_note: z.string().optional(),
  session_guidance: z.string().optional(),
  workload_note: z.string().optional(),
});

// === School Context Relevance ===
const EefSchoolContextRelevanceSchema = z.object({
  most_relevant_phases: z.array(
    z.enum(['early_years', 'primary', 'secondary',
            'post_16', 'all_through', 'special']),
  ),
  most_relevant_key_stages: z.array(
    z.enum(['EYFS', 'KS1', 'KS2', 'KS3', 'KS4', 'KS5']),
  ),
  most_relevant_priorities: z.array(z.string()),
  pp_relevance: z.enum(['moderate', 'high', 'very_high']),
  pp_relevance_note: z.string(),
  implementation_requirements: EefImplementationRequirementsSchema,
});

// === Headline ===
const EefHeadlineSchema = z.object({
  impact_months: z.number().nullable(),
  cost_rating: z.number().int().min(1).max(5),
  cost_label: z.string(),
  evidence_strength_rating: z.number().int().min(0).max(5),
  evidence_strength_label: z.string(),
  headline_summary: z.string(),
});

// === Strand (30 strands, many optional fields) ===
const EefStrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  eef_url: z.string(),
  headline: EefHeadlineSchema,
  definition: z.object({ short: z.string(), full: z.string() }),
  key_findings: z.array(z.string()),
  tags: z.array(z.string()),
  // Optional fields (present on subset of strands)
  school_context_relevance: EefSchoolContextRelevanceSchema.optional(),
  effectiveness: z.object({
    summary: z.string(),
    mechanisms: z.array(z.string()).optional(),
  }).optional(),
  behind_the_average: z.object({
    summary: z.string(),
    by_phase: z.record(z.string(), z.unknown()).optional(),
    by_subject: z.array(z.object({
      subject: z.string(),
      notes: z.string(),
    })).optional(),
    moderating_factors: z.array(z.string()).optional(),
  }).optional(),
  closing_the_disadvantage_gap: z.object({
    summary: z.string(),
  }).optional(),
  implementation: z.object({
    key_considerations: z.array(z.string()),
    common_pitfalls: z.array(z.string()).optional(),
  }).optional(),
  related_strands: z.array(z.string()).optional(),
  related_guidance_reports: z.array(z.object({
    title: z.string(),
    url: z.string(),
  })).optional(),
  update_history: z.array(z.object({
    date: z.string(),
    notes: z.string(),
  })).optional(),
});

// === Root (F2, F3 RESOLVED) ===
const EefToolkitDataSchema = z.object({
  meta: EefMetaSchema,
  methodology: z.object({
    impact_measure: z.object({
      name: z.string(),
      unit: z.string(),
      derivation: z.string(),
      interpretation_guidance: z.string(),
    }),
    cost_measure: z.object({
      name: z.string(),
      scale: z.record(z.string(), z.object({
        rating: z.number(),
        label: z.string(),
        range_per_pupil_per_year_gbp: z.string(),
        range_per_class_per_year_gbp: z.string(),
      })),
    }),
    evidence_strength_measure: z.object({
      name: z.string(),
      scale_min: z.number(),
      scale_max: z.number(),
      factors: z.array(z.string()),
      interpretation_guidance: z.string(),
    }),
    effect_size_to_months_conversion: z.object({
      table: z.array(z.object({
        effect_size_range: z.string(),
        months_progress: z.number(),
      })),
      notes: z.string(),
    }),
  }),
  strands: z.array(EefStrandSchema),
  uk_context: EefUkContextSchema,
  school_context_schema: z.object({
    description: z.string(),
    properties: z.record(z.string(), z.unknown()),
  }),
});
```

**Note on `school_context_schema`**: This is a JSON Schema meta-definition
(describes the shape of school context parameters for recommendations). Its
`properties` value is itself a schema structure with nested `type`, `enum`,
`properties` etc. Typing the meta-schema fully would be excessive — we type
the top-level `description` and leave `properties` as
`z.record(z.string(), z.unknown())`. This is acceptable because:
(a) it's a schema definition, not data we consume, and
(b) `z.unknown()` is permitted for genuinely polymorphic structures.

**Loader pattern:**

```typescript
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const rawData: unknown = require('./data/eef-toolkit.json');
const eefToolkitData = EefToolkitDataSchema.parse(rawData);
export function getEefToolkitData() { return eefToolkitData; }
```

**Unit tests:**

- Zod parse succeeds (proves schema matches data)
- 30 strands present
- 4 strands have `impact_months: null`
- 17/30 strands have `school_context_relevance`
- 9 caveats in meta

### Phase 2: MCP surface (curriculum-sdk)

**T2: Methodology resource** — `eef-methodology-resource.ts`

**[F6 RESOLVED]** URI: `curriculum://eef-methodology` (not `eef-toolkit://`).
**[F11 RESOLVED]** Uses graph factory for resource constant and JSON getter.

The EEF methodology data has `version` on `meta.data_version`. The factory
requires `{ readonly version: string }`. The config wraps the data to
satisfy this contract:

```typescript
const EEF_METHODOLOGY_CONFIG: GraphSurfaceConfig<{
  readonly version: string;
  readonly methodology: /* inferred from Zod */;
  readonly caveats: readonly string[];
  readonly uk_context: /* inferred from Zod */;
}> = {
  name: 'eef-methodology',
  title: 'EEF Teaching and Learning Toolkit: Methodology and Caveats',
  description:
    'How impact (months of additional progress), cost (1-5), and evidence '
    + 'strength (0-5) metrics are derived. Includes 9 interpretive caveats '
    + 'that AI systems MUST surface when citing toolkit figures.',
  uriSegment: 'eef-methodology',
  priority: 0.6,
  sourceData: {
    version: eefToolkitData.meta.data_version,
    methodology: eefToolkitData.methodology,
    caveats: eefToolkitData.meta.caveats,
    uk_context: eefToolkitData.uk_context,
  },
  summary: `EEF methodology loaded. ${eefToolkitData.meta.caveats.length} caveats.`,
};
```

**T3: Strands resource** — `eef-strands-resource.ts`

**[F6 RESOLVED]** URI: `curriculum://eef-strands`.
**[F11 RESOLVED]** Uses graph factory.

Returns strand summaries with headline metrics (id, name, slug,
headline, definition.short, tags, school_context_relevance summary).

**T5: Guidance constant** — `eef-evidence-guidance.ts`

Teacher-oriented guidance: always cite evidence strength alongside
impact, surface caveats, frame as decision-support not prescription,
note partial coverage honestly (17/30 strands have context data).

**T4: Recommendation tool** — `aggregated-eef-recommend.ts`

Tool name: `recommend-evidence-for-context`

**[F12 RESOLVED]** Custom tool def includes `SCOPES_SUPPORTED` directly.
**[F5 RESOLVED]** Null-impact guard: pre-filter 4 strands with
`impact_months: null` before scoring. Include count in `data_coverage`.

**[F10 RESOLVED]** Focus enum uses exact values from
`most_relevant_priorities` in the data. The data uses
`closing_disadvantage_gap` (without "the") — this matches the plan's
original enum. The full priority vocabulary from the data:

```text
closing_disadvantage_gap, improving_reading, improving_writing,
improving_maths, improving_oracy, improving_behaviour,
improving_attendance, improving_send_provision, teacher_retention,
curriculum_development, metacognition_and_self_regulation,
effective_use_of_tas, parental_engagement, transition_support,
post_covid_recovery
```

The tool accepts the 7 most teacher-relevant as an enum (the plan's
original selection is correct):

```typescript
{
  phase: z.enum(['early_years', 'primary', 'secondary']),
  subject: z.string().optional(),
  focus: z.enum([
    'closing_disadvantage_gap',
    'improving_reading',
    'improving_maths',
    'improving_writing',
    'improving_oracy',
    'improving_behaviour',
    'effective_use_of_tas',
  ]).optional(),
  max_cost_rating: z.number().int().min(1).max(5).default(3),
  min_evidence_strength: z.number().int().min(0).max(5).default(2),
  max_results: z.number().int().min(1).max(10).default(5),
}
```

Scoring algorithm (from EEF prototype):

```text
score = (impact/8 × 4.0)         // 40% impact, normalised 0-10
      + (evidence/5 × 3.0)       // 30% evidence strength
      + ((6-cost)/5 × 2.0)       // 20% cost-effectiveness (inverted)
      + context_relevance         // 10% accumulated:
                                  //   phase match: +0.4
                                  //   focus match: +0.4
                                  //   PP: very_high +0.2, high +0.15,
                                  //       moderate +0.1
```

**Null-impact guard** (F5): Strands with `impact_months === null` are
excluded from scoring (they have insufficient evidence). The 4 strands:

- `eef-tl-aspiration-interventions` (evidence_strength: 0)
- `eef-tl-learning-styles` (evidence_strength: 0)
- `eef-tl-outdoor-adventure-learning` (evidence_strength: 0)
- `eef-tl-school-uniform` (evidence_strength: 0)

The `data_coverage` field in the response includes:
`strands_scored: "26/30"`, `strands_excluded_no_impact: 4`,
`strands_with_context: "17/30"`.

Response shape (per R1, R2, R7):

```typescript
{
  context: { phase, subject, focus, constraints },
  recommendations: [
    {
      rank, strand_id, strand_name,
      impact_months, cost_rating, evidence_strength_rating,
      score, rationale,
      implementation: { cpd_intensity, time_to_embed, key_staff },
      caveat: "Impact figure (+N months) is a population average..."
    }
  ],
  methodology_note: "Rankings based on composite score: impact (40%)...",
  global_caveat: "These are 'best bets' based on research evidence...",
  data_coverage: {
    strands_scored: "26/30",
    strands_excluded_no_impact: 4,
    strands_with_context: "17/30",
  }
}
```

Annotations: `readOnlyHint: true`, `idempotentHint: true`

**T6: Register in definitions** — add to `AGGREGATED_TOOL_DEFS`
**T7: Register in executor** — add to `AGGREGATED_HANDLERS`
**T8: Public export** — add to `public/mcp-tools.ts` barrel

### Phase 3: Server surface (MCP app)

**T9: Register resources** — `register-resources.ts`

Register EEF resources via the existing `registerGraphResource()` helper
(same pattern as prior knowledge graph, thread progressions, and
misconception graph). Call from `registerAllResources()`.

**T10: Register prompt** — `mcp-prompts.ts` + `mcp-prompt-messages.ts`

Add `evidence-grounded-lesson-plan` prompt with parameters:
`subject`, `key_stage`, `topic`.

**[F8 RESOLVED]** Step 3 clarified: "get-implementation-guidance
equivalent" means extracting `implementation` fields from the
recommendation response — cpd_intensity, time_to_embed, key_staff.
There is no separate tool call.

**[F9 RESOLVED]** KS-to-phase mapping table included in prompt text:

```text
Key Stage to Phase mapping:
- EYFS → early_years
- KS1, KS2 → primary
- KS3, KS4 → secondary
- KS5 → secondary (EEF coverage is primarily up to age 16)
```

Prompt message orchestrates:

1. Call `recommend-evidence-for-context` with phase (mapped from
   key_stage), subject, and optional focus
2. Select top 2-3 recommended approaches from the response
3. Extract implementation guidance from the recommendation's
   `implementation` field (cpd_intensity, time_to_embed, key_staff)
4. Design lesson plan integrating approaches with evidence + caveats
5. Structure: starter → main → practice → plenary (metacognitive
   reflection)

### Phase 4: Documentation and tests

**T11: ADR-123 update** — add rows:

| `curriculum://eef-methodology` | EEF methodology + caveats | 0.6 | `["assistant"]` |
| `curriculum://eef-strands` | EEF evidence strands | 0.5 | `["assistant"]` |

And add `recommend-evidence-for-context` to tools table. Update
aggregated tool count from 11 to 12.

**T12: E2E assertions** — verify in E2E tests:

- Tool appears in `tools/list` response (update hardcoded
  `aggregatedTools` array in `server.e2e.test.ts`)
- Tool call with `phase="primary"` returns ranked recommendations
- Each recommendation includes `caveat` and `methodology_note`
- Both resources appear in `resources/list`
- Resource reads return valid JSON
- Prompt appears in `prompts/list`

## Sequencing

```text
T1 data loader + Zod     ─┐
T2 methodology resource    │
T3 strands resource        ├─▶ T6 defs ──▶ T7 executor ──▶ T8 export
T4 recommendation tool     │
T5 guidance constant      ─┘
                                                              │
T9 register resources   ◀────────────────────────────────────┘
T10 register prompt     ◀────────────────────────────────────┘
T11 ADR-123 update
T12 E2E tests (after T7 + T9 + T10)
```

Phase 1 (T1) is prerequisite for all. Phase 2 tasks (T2-T8) are
independent of each other except T6-T8 depend on T4. Phase 3 depends
on T8. Phase 4 depends on Phase 3.

## Size Estimate

~500 lines of new code (data loader + Zod schemas + scoring algorithm +
resource constants + prompt messages), ~100 lines of test additions,
~15 lines of documentation updates. One new data file. No new
dependencies, no new infrastructure patterns.

## Exit Criteria

1. `recommend-evidence-for-context` tool appears in `tools/list`
2. Tool call returns ranked recommendations with transparent scoring
3. Every recommendation includes caveat and evidence strength
4. `curriculum://eef-methodology` and `curriculum://eef-strands`
   resources appear in `resources/list`
5. Resource reads return valid JSON
6. `evidence-grounded-lesson-plan` prompt appears in `prompts/list`
7. ADR-123 updated with new entries
8. `pnpm check` passes

## Key Files

| File | Change |
|------|--------|
| `packages/sdks/oak-curriculum-sdk/src/mcp/data/eef-toolkit.json` | NEW (copy) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/eef-toolkit-data.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/eef-methodology-resource.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/eef-strands-resource.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/eef-evidence-guidance.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-recommend.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` | Add entry |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts` | Add handler |
| `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` | Add exports |
| `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts` | Add prompt |
| `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompt-messages.ts` | Add messages |
| `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` | Add resources |
| `apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts` | Update counts |
| `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md` | Add rows |
