# Reference Indices for Curriculum Enums

> **Status**: Draft  
> **Parent**: [Semantic Search Overview](./semantic-search-overview.md)  
> **Phase**: 3 - Reference Data Indices  
> **Goal**: Demonstrate powerful Elasticsearch features using curriculum reference data

## Foundational Alignment

This plan MUST adhere to:

- [rules.md](../../directives-and-memory/rules.md) - TDD, schema-first, no type shortcuts
- [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) - All types flow from OpenAPI schema
- [testing-strategy.md](../../directives-and-memory/testing-strategy.md) - TDD at all levels

**Cardinal Rule Reminder**: Running `pnpm type-gen` followed by `pnpm build` MUST be sufficient to bring all workspaces into alignment with the schema.

---

## Problem Statement

Curriculum enums (subjects, key stages, years) exist in the SDK as static tuples generated from the OpenAPI schema:

```typescript
// From path-parameters.ts (GENERATED)
export const KEY_STAGES = ["ks1", "ks2", "ks3", "ks4"] as const;
export const SUBJECTS = ["art", "citizenship", "computing", ...] as const;
```

These enums are currently:

1. **Disconnected from search** - Not available for faceted navigation
2. **Metadata-poor** - No display names, descriptions, or relationships
3. **Missing from ES** - Cannot leverage completion suggesters or aggregations

## Solution Overview

Create **reference indices** in Elasticsearch that:

1. Store enum values with rich metadata
2. Enable faceted search with counts
3. Provide autocomplete with contextual suggestions
4. Support cascading filter UI ("Select KS3 → show valid subjects")

### Reference Indices

| Index                | Source                    | Fields                                  | ES Features           |
| -------------------- | ------------------------- | --------------------------------------- | --------------------- |
| `oak_ref_subjects`   | `SUBJECTS` + metadata     | slug, title, key_stages[], lesson_count | completion, terms agg |
| `oak_ref_key_stages` | `KEY_STAGES` + metadata   | slug, title, years[], subject_count     | completion, terms agg |
| `oak_ref_years`      | Schema example + metadata | slug, title, key_stage, age_range       | completion            |

---

## Implementation Plan

### Phase 3.1: Subject Reference Index

**Acceptance Criteria:**

- [ ] AC1: `SUBJECT_REF_FIELDS` defined in `field-definitions.ts` with 8+ fields
- [ ] AC2: Unit test exists and passes proving field count and types
- [ ] AC3: `SubjectRefDocSchema` Zod schema generated at type-gen time
- [ ] AC4: `OAK_REF_SUBJECTS_MAPPING` ES mapping generated with completion field
- [ ] AC5: `SUBJECT_REF_DATA` constant generated from SDK enums + metadata
- [ ] AC6: Field alignment test proves Zod and ES fields match exactly
- [ ] AC7: All quality gates pass

#### Step 3.1.1: Define Field Definitions (TDD)

**Test First** (RED):

```typescript
// field-definitions.unit.test.ts
describe('SUBJECT_REF_FIELDS', () => {
  it('should have exactly 8 fields', () => {
    expect(SUBJECT_REF_FIELDS).toHaveLength(8);
  });

  it('should have slug as required string', () => {
    const slugField = SUBJECT_REF_FIELDS.find((f) => f.name === 'slug');
    expect(slugField?.zodType).toBe('string');
    expect(slugField?.optional).toBe(false);
  });

  it('should have title_suggest as optional object', () => {
    const suggestField = SUBJECT_REF_FIELDS.find((f) => f.name === 'title_suggest');
    expect(suggestField?.zodType).toBe('object');
    expect(suggestField?.optional).toBe(true);
  });
});
```

**Implementation** (GREEN):

```typescript
// field-definitions.ts
export const SUBJECT_REF_FIELDS: IndexFieldDefinitions = [
  { name: 'slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  { name: 'title', zodType: 'string', optional: false },
  { name: 'key_stages', zodType: 'array-string', optional: false },
  { name: 'years', zodType: 'array-number', optional: false },
  { name: 'lesson_count', zodType: 'number', optional: false },
  { name: 'unit_count', zodType: 'number', optional: false },
  { name: 'sequence_slugs', zodType: 'array-string', optional: true },
  { name: 'title_suggest', zodType: 'object', optional: true },
] as const;
```

**Measurement**: Test passes with exact field count and types.

#### Step 3.1.2: Generate Zod Schema

**Acceptance Criteria:**

- [ ] Zod schema `SubjectRefDocSchema` generated in `reference-index-docs.ts`
- [ ] Schema uses `z.enum(SUBJECTS)` for slug field
- [ ] Schema has TSDoc documentation

**Implementation**: Extend `generate-search-index-docs.ts` or create new `generate-reference-index-docs.ts` to generate:

```typescript
// GENERATED: reference-index-docs.ts
export const SubjectRefDocSchema = z.object({
  slug: z.enum(SUBJECTS),
  title: z.string().min(1),
  key_stages: z.array(z.enum(KEY_STAGES)),
  years: z.array(z.number().int().positive()),
  lesson_count: z.number().int().nonnegative(),
  unit_count: z.number().int().nonnegative(),
  sequence_slugs: z.array(z.string().min(1)).optional(),
  title_suggest: SearchCompletionSuggestPayloadSchema.optional(),
});
export type SubjectRefDoc = z.infer<typeof SubjectRefDocSchema>;
```

**Measurement**: `pnpm type-gen` produces valid TypeScript that passes `pnpm type-check`.

#### Step 3.1.3: Generate ES Mapping

**Acceptance Criteria:**

- [ ] `OAK_REF_SUBJECTS_MAPPING` generated with `completion` type for `title_suggest`
- [ ] Mapping includes contexts for completion (key_stage filter)
- [ ] Unit test proves mapping fields match Zod schema fields

**ES Mapping Override**:

```typescript
// es-field-overrides.ts
export const SUBJECT_REF_FIELD_OVERRIDES = {
  slug: { type: 'keyword' },
  title: { type: 'text', analyzer: 'standard' },
  key_stages: { type: 'keyword' },
  years: { type: 'integer' },
  title_suggest: {
    type: 'completion',
    contexts: [{ name: 'key_stage', type: 'category' }],
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
```

**Measurement**: Field alignment test passes, proving ES mapping has identical fields to Zod schema.

#### Step 3.1.4: Generate Reference Data

**Acceptance Criteria:**

- [ ] `SUBJECT_REF_DATA` constant generated at type-gen time
- [ ] Data combines SDK enum with metadata from ontology or hardcoded enrichments
- [ ] Each subject has display title derived from slug

**Generator Logic**:

```typescript
// generate-reference-data.ts
function generateSubjectRefData(): string {
  // Read SUBJECTS from path-parameters.ts at type-gen time
  // For each subject, generate an object with metadata
  // Counts (lesson_count, etc.) will be 0 initially - populated during ingestion
}
```

**Output Example**:

```typescript
// GENERATED: reference-data.ts
export const SUBJECT_REF_SEED_DATA: readonly SubjectRefDoc[] = [
  {
    slug: 'maths',
    title: 'Mathematics',
    key_stages: ['ks1', 'ks2', 'ks3', 'ks4'],
    years: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    lesson_count: 0, // Populated during ingestion from live data
    unit_count: 0,
    sequence_slugs: [],
    title_suggest: { input: ['maths', 'mathematics', 'math'] },
  },
  // ... more subjects
] as const;
```

**Measurement**: TypeScript compiles without errors; each `SUBJECTS` entry has corresponding ref data.

---

### Phase 3.2: Key Stage Reference Index

**Acceptance Criteria:**

- [ ] AC1: `KEY_STAGE_REF_FIELDS` defined with 9+ fields
- [ ] AC2: Unit tests pass for field definitions
- [ ] AC3: `KeyStageRefDocSchema` Zod schema generated
- [ ] AC4: `OAK_REF_KEY_STAGES_MAPPING` ES mapping generated
- [ ] AC5: `KEY_STAGE_REF_DATA` generated from `KEY_STAGES` + enrichments
- [ ] AC6: Field alignment test passes
- [ ] AC7: All quality gates pass

**Field Definitions**:

```typescript
export const KEY_STAGE_REF_FIELDS: IndexFieldDefinitions = [
  { name: 'slug', zodType: 'string', optional: false, enumRef: 'KEY_STAGE_TUPLE' },
  { name: 'title', zodType: 'string', optional: false },
  { name: 'age_range', zodType: 'string', optional: false },
  { name: 'years', zodType: 'array-number', optional: false },
  { name: 'phase', zodType: 'string', optional: false },
  { name: 'description', zodType: 'string', optional: true },
  { name: 'subject_count', zodType: 'number', optional: false },
  { name: 'lesson_count', zodType: 'number', optional: false },
  { name: 'title_suggest', zodType: 'object', optional: true },
] as const;
```

**Measurement**: Same as Phase 3.1 - tests pass, quality gates pass.

---

### Phase 3.3: Year Reference Index

**Acceptance Criteria:**

- [ ] AC1: `YEAR_REF_FIELDS` defined with 7+ fields
- [ ] AC2: Unit tests pass
- [ ] AC3: `YearRefDocSchema` Zod schema generated
- [ ] AC4: `OAK_REF_YEARS_MAPPING` ES mapping generated
- [ ] AC5: `YEAR_REF_DATA` generated from schema examples
- [ ] AC6: Field alignment test passes
- [ ] AC7: All quality gates pass

**Field Definitions**:

```typescript
export const YEAR_REF_FIELDS: IndexFieldDefinitions = [
  { name: 'slug', zodType: 'string', optional: false },
  { name: 'title', zodType: 'string', optional: false },
  { name: 'numeric', zodType: 'number', optional: false },
  { name: 'key_stage', zodType: 'string', optional: false, enumRef: 'KEY_STAGE_TUPLE' },
  { name: 'age_range', zodType: 'string', optional: true },
  { name: 'lesson_count', zodType: 'number', optional: false },
  { name: 'title_suggest', zodType: 'object', optional: true },
] as const;
```

**Source**: Years are defined in the OpenAPI schema at `/sequences/{sequence}/units` endpoint as:

```json
["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"]
```

---

### Phase 3.4: Ingestion & Index Setup

**Acceptance Criteria:**

- [ ] AC1: Reference indices created during `runSetup()`
- [ ] AC2: Seed data indexed with completion suggesters
- [ ] AC3: Counts (lesson_count, etc.) populated from aggregations on content indices
- [ ] AC4: CLI supports `--ref-only` flag to index only reference data
- [ ] AC5: E2E test validates reference indices exist with correct document count

**Implementation Approach**:

1. **Index Creation**: Add reference index mappings to `setup/index.ts`
2. **Seed Data Ingestion**: Create `ingest-reference-data.ts` to:
   - Read generated `*_REF_SEED_DATA` constants
   - Bulk index into reference indices
   - Update counts by running aggregations on content indices

**Measurement**: E2E test shows:

```text
oak_ref_subjects: 17 documents
oak_ref_key_stages: 4 documents
oak_ref_years: 12 documents (including all-years)
```

---

### Phase 3.5: Search Features Demonstration

**Acceptance Criteria:**

- [ ] AC1: Completion suggester returns subjects with key_stage context filtering
- [ ] AC2: Aggregation query returns subject facets with lesson counts
- [ ] AC3: Cascading filter query works (select KS3 → valid subjects only)
- [ ] AC4: Integration tests prove each feature works

**Demo Queries**:

#### Completion with Context

```json
{
  "suggest": {
    "subject-suggest": {
      "prefix": "ma",
      "completion": {
        "field": "title_suggest",
        "contexts": { "key_stage": ["ks3"] }
      }
    }
  }
}
```

Returns: "Mathematics" for KS3

#### Faceted Aggregation

```json
{
  "size": 0,
  "aggs": {
    "subjects": {
      "terms": { "field": "slug" },
      "aggs": {
        "lesson_count": { "sum": { "field": "lesson_count" } }
      }
    }
  }
}
```

---

## Quality Gate Checkpoints

After each phase, run:

```bash
# From repo root, one at a time
pnpm type-gen     # Must produce valid TypeScript
pnpm build        # Must compile
pnpm type-check   # No type errors
pnpm lint:fix     # No lint errors
pnpm format:root  # Formatting correct
pnpm test         # Unit + integration tests pass
pnpm test:e2e     # E2E tests pass
```

**Blocking**: Any failure is blocking. No phase proceeds until all gates pass.

---

## File Changes Summary

### New Files

| Path                                                        | Purpose                   |
| ----------------------------------------------------------- | ------------------------- |
| `type-gen/typegen/search/generate-reference-index-docs.ts`  | Generator for Zod schemas |
| `type-gen/typegen/search/generate-reference-es-mappings.ts` | Generator for ES mappings |
| `type-gen/typegen/search/generate-reference-data.ts`        | Generator for seed data   |
| `src/types/generated/search/reference-index-docs.ts`        | Generated Zod schemas     |
| `src/types/generated/search/reference-es-mappings.ts`       | Generated ES mappings     |
| `src/types/generated/search/reference-data.ts`              | Generated seed data       |

### Modified Files

| Path                                            | Change                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| `type-gen/typegen/search/field-definitions.ts`  | Add `SUBJECT_REF_FIELDS`, `KEY_STAGE_REF_FIELDS`, `YEAR_REF_FIELDS` |
| `type-gen/typegen/search/es-field-overrides.ts` | Add reference index overrides                                       |
| `type-gen/run-typegen.ts`                       | Add reference index generators                                      |
| `apps/.../setup/index.ts`                       | Create reference indices                                            |
| `apps/.../ingest/cli.ts`                        | Add `--ref-only` flag                                               |

---

## Architectural Decisions

### Why Separate Reference Indices?

1. **Single Responsibility** - Reference data has different update patterns (rarely changes)
2. **Efficient Aggregations** - Small indices are fast for terms aggregations
3. **Completion Context** - Separate indices allow targeted suggestion contexts
4. **Schema Clarity** - Reference documents have different fields than content documents

### Why Generate at Type-Gen Time?

1. **Schema-First Compliance** - Enums come from OpenAPI schema
2. **Type Safety** - TypeScript validates generated data
3. **No Runtime Parsing** - Data is const, no validation overhead
4. **Single Source of Truth** - Changes to upstream schema propagate automatically

---

## Risk Mitigation

| Risk                 | Mitigation                                         |
| -------------------- | -------------------------------------------------- |
| Counts become stale  | Re-index reference data during full reindex        |
| Missing enum values  | Generator reads from SDK, not hardcoded            |
| ES mapping conflicts | Use `dynamic: strict`, fail fast on unknown fields |
| Slow aggregations    | Reference indices are tiny (<20 docs each)         |

---

## Re-Commitment to Foundations

Before proceeding with implementation:

1. ✅ Re-read [rules.md](../../directives-and-memory/rules.md)
2. ✅ Re-read [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)
3. ✅ Re-read [testing-strategy.md](../../directives-and-memory/testing-strategy.md)

**TDD is mandatory**: Write tests FIRST at each step. Run tests to prove they fail (RED), then implement (GREEN), then refactor.

---

## Next Actions

1. **Review this plan** - Confirm scope and acceptance criteria
2. **Create TODO list** - Break Phase 3.1 into actionable tasks
3. **Begin TDD cycle** - Write first failing test for `SUBJECT_REF_FIELDS`
