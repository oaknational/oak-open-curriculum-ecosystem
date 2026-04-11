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
    content: "Create eef-toolkit-data.ts with typed loader for eef-toolkit.json and EefToolkitData type"
    status: pending
  - id: t2-methodology-resource
    content: "Create eef-methodology-resource.ts with resource constant and getter for methodology + caveats"
    status: pending
  - id: t3-strands-resource
    content: "Create eef-strands-resource.ts with resource constant and getter for all 30 strands with headline metrics"
    status: pending
  - id: t4-recommendation-tool
    content: "Create aggregated-eef-recommend.ts with recommend_evidence_for_context tool definition and executor"
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
    content: "Add registerEefMethodologyResource() and registerEefStrandsResource() in register-resources.ts"
    status: pending
  - id: t10-register-prompt
    content: "Add evidence_grounded_lesson_plan prompt to mcp-prompts.ts and mcp-prompt-messages.ts"
    status: pending
  - id: t11-adr-123-update
    content: "Update ADR-123 resources and tools tables with EEF entries"
    status: pending
  - id: t12-e2e-test
    content: "Add E2E assertions for recommend-evidence-for-context tool, EEF resources, and evidence prompt"
    status: pending
---

# EEF Evidence MCP Surface

**Status**: PENDING — next to implement (WS-3)
**Last Updated**: 2026-04-10
**Branch**: `planning/kg_eef_integration`
**Strategic context**: `.agent/plans/kgs-and-pedagogy/future/evidence-integration-strategy.md`
(this plan implements Levels 2-3 of the evidence integration strategy)

## Pre-Implementation Review Findings (MUST resolve before coding)

The 2026-04-10 session ran 4 specialist reviewers (betty, barney, mcp,
code) against the full plan family. These findings apply to this plan
specifically:

1. **EEF data placement**: Place in `oak-curriculum-sdk/src/mcp/data/`
   (NOT `oak-sdk-codegen/`). EEF data is third-party static data, not
   generated from the OpenAPI spec. Cardinal rule does not apply.
2. **Type all fields precisely**: No `Record<string, unknown>` for
   `uk_context` or `school_context_schema`. The EEF JSON is static —
   type it exhaustively from the file.
3. **`EefToolkitData.meta` is incomplete**: The plan's interface only
   declares `caveats`. The actual `meta` has 7 fields including
   `source`, `licence`, `last_updated`. Type them all.
4. **`as const satisfies` incompatible with `createRequire`**: Use
   the direct type annotation pattern (same as misconception graph).
5. **Null-impact guard**: 4 strands have `impact_months: null`.
   Pre-filter before scoring. Mention in `data_coverage` for R8.
6. **URI scheme**: Use `curriculum://eef-methodology` and
   `curriculum://eef-strands` (NOT `eef-toolkit://`).
7. **Build-time Zod validation**: Add Zod schema that validates
   the JSON at load time. Schema drift = loud failure.
8. **Prompt step 3 clarification**: "get-implementation-guidance
   equivalent" means data extraction from the recommendation
   response, not a separate tool call. Clarify in prompt text.
9. **KS-to-phase mapping**: Include explicit mapping table in the
   prompt message text.
10. **`focus` enum alignment**: Verify enum values match JSON field
    names (e.g. `closing_disadvantage_gap` vs
    `closing_the_disadvantage_gap`).
11. **EEF resources use the graph factory**: For resource constants
    and JSON getters. Recommendation tool is custom (has params).
12. **`securitySchemes`**: Must include in the custom tool def (not
    just factory-produced tools). Use `SCOPES_SUPPORTED` directly.

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
copies it into the SDK codegen output as a generated data asset.

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

### Phase 1: Data and types (SDK codegen)

**T1: Data loader** — `eef-toolkit-data.ts`

Copy `eef-toolkit.json` into `packages/sdks/oak-sdk-codegen/` as a
generated data asset (same pattern as misconception graph). Create
typed interfaces:

```typescript
interface EefStrand {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly headline: {
    readonly impact_months: number | null;
    readonly cost_rating: number;
    readonly evidence_strength_rating: number;
    readonly headline_summary: string;
  };
  readonly definition: { readonly short: string; readonly full: string };
  readonly school_context_relevance?: {
    readonly most_relevant_phases: readonly string[];
    readonly most_relevant_priorities: readonly string[];
    readonly pp_relevance: string;
    readonly pp_relevance_note?: string;
    readonly implementation_requirements?: {
      readonly cpd_intensity?: string;
      readonly additional_staff_needed?: boolean;
      readonly time_to_embed?: string;
      readonly key_staff?: readonly string[];
    };
  };
  // ... remaining fields
}

interface EefToolkitData {
  readonly meta: { readonly caveats: readonly string[] };
  readonly methodology: {
    readonly impact_measure: { readonly derivation: string };
    // ... remaining methodology fields
  };
  readonly strands: readonly EefStrand[];
  readonly uk_context: Record<string, unknown>;
  readonly school_context_schema: Record<string, unknown>;
}
```

Load with `as const satisfies` for type safety. Provide
`getEefToolkitData(): EefToolkitData` getter.

### Phase 2: MCP surface (curriculum-sdk)

**T2: Methodology resource** — `eef-methodology-resource.ts`

```typescript
export const EEF_METHODOLOGY_RESOURCE = {
  name: 'eef-methodology',
  uri: 'eef-toolkit://methodology',
  title: 'EEF Teaching and Learning Toolkit: Methodology and Caveats',
  description:
    'How impact (months of additional progress), cost (1-5), and evidence '
    + 'strength (0-5) metrics are derived. Includes 8 interpretive caveats '
    + 'that AI systems MUST surface when citing toolkit figures.',
  mimeType: 'application/json' as const,
  annotations: {
    priority: 0.6,
    audience: ['assistant'] satisfies ('user' | 'assistant')[],
  },
};
```

Returns: `{ methodology, caveats, uk_context }` from the data file.

Pattern source: `prior-knowledge-graph-resource.ts`

**T3: Strands resource** — `eef-strands-resource.ts`

```typescript
export const EEF_STRANDS_RESOURCE = {
  name: 'eef-strands',
  uri: 'eef-toolkit://strands',
  title: 'EEF Teaching and Learning Toolkit: 30 Evidence Strands',
  description:
    'All 30 evidence-informed teaching approaches with headline metrics '
    + '(impact in months, cost rating 1-5, evidence strength 0-5). '
    + 'Use recommend-evidence-for-context for ranked recommendations.',
  mimeType: 'application/json' as const,
  annotations: {
    priority: 0.5,
    audience: ['assistant'] satisfies ('user' | 'assistant')[],
  },
};
```

Returns: strand summaries with headline metrics.

**T5: Guidance constant** — `eef-evidence-guidance.ts`

Teacher-oriented guidance for how the model should use evidence data:
always cite evidence strength alongside impact, surface caveats, frame
as decision-support not prescription, note partial coverage honestly.

Pattern source: `prerequisite-guidance.ts`

**T4: Recommendation tool** — `aggregated-eef-recommend.ts`

Tool name: `recommend-evidence-for-context`

Parameters (Zod schema):

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

Scoring algorithm (from EEF prototype, documented in technical
comparison):

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
  data_coverage: { strands_with_context: "17/30", ... }
}
```

Annotations: `readOnlyHint: true`, `idempotentHint: true`

Pattern source: `aggregated-prior-knowledge-graph.ts` (structure),
EEF `server.py` `recommend_for_context` (algorithm)

**T6: Register in definitions** — add to `AGGREGATED_TOOL_DEFS`
**T7: Register in executor** — add to `AGGREGATED_HANDLERS`
**T8: Public export** — add to `public/mcp-tools.ts` barrel

### Phase 3: Server surface (MCP app)

**T9: Register resources** — `register-resources.ts`

Add `registerEefMethodologyResource()` and
`registerEefStrandsResource()` following the same pattern as
`registerPrerequisiteGraphResource()`. Call from
`registerAllResources()`.

**T10: Register prompt** — `mcp-prompts.ts` + `mcp-prompt-messages.ts`

Add `evidence-grounded-lesson-plan` prompt with parameters:
`subject`, `key_stage`, `topic`.

Prompt message orchestrates:

1. Call `recommend-evidence-for-context` for phase/subject/focus
2. Select top 2-3 recommended approaches
3. Call `get-implementation-guidance` equivalent (inline from strand data)
4. Design lesson plan integrating approaches with evidence + caveats
5. Structure: starter → main → practice → plenary (metacognitive
   reflection)

Phase mapping: EYFS→early_years, KS1/KS2→primary,
KS3/KS4/KS5→secondary.

### Phase 4: Documentation and tests

**T11: ADR-123 update** — add rows:

| `eef-toolkit://methodology` | EEF methodology + caveats | 0.6 | `["assistant"]` |
| `eef-toolkit://strands` | EEF evidence strands | 0.5 | `["assistant"]` |

And add `recommend-evidence-for-context` to tools table.

**T12: E2E assertions** — verify in `server.e2e.test.ts`:

- Tool appears in `tools/list` response
- Tool call with `phase="primary"` returns ranked recommendations
- Each recommendation includes `caveat` and `methodology_note`
- Both resources appear in `resources/list`
- Resource reads return valid JSON
- Prompt appears in `prompts/list`

## Sequencing

```text
T1 data loader              ─┐
T2 methodology resource       │
T3 strands resource            ├─▶ T6 definitions ──▶ T7 executor ──▶ T8 export
T4 recommendation tool        │
T5 guidance constant         ─┘
                                                                        │
T9 register resources  ◀────────────────────────────────────────────────┘
T10 register prompt    ◀────────────────────────────────────────────────┘
T11 ADR-123 update
T12 E2E tests (after T7 + T9 + T10)
```

Phase 1 (T1) is prerequisite for all. Phase 2 tasks (T2-T8) are
independent of each other except T6-T8 depend on T4. Phase 3 depends
on T8. Phase 4 depends on Phase 3.

## Size Estimate

~400 lines of new code (data loader + scoring algorithm + resource
constants + prompt messages), ~80 lines of test additions, ~15 lines
of documentation updates. One new data file. No new dependencies, no
new infrastructure patterns.

## Exit Criteria

1. `recommend-evidence-for-context` tool appears in `tools/list`
2. Tool call returns ranked recommendations with transparent scoring
3. Every recommendation includes caveat and evidence strength
4. `eef-toolkit://methodology` and `eef-toolkit://strands` resources
   appear in `resources/list`
5. Resource reads return valid JSON
6. `evidence-grounded-lesson-plan` prompt appears in `prompts/list`
7. ADR-123 updated with new entries
8. `pnpm check` passes

## Key Files

| File | Change |
|------|--------|
| `packages/sdks/oak-sdk-codegen/eef-toolkit-data.ts` | NEW |
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
