# Phase 9: Reference Indices & Threads

**Status**: 📋 PLANNED  
**Estimated Effort**: 2-3 days  
**Prerequisites**: Phase 8 (Entity Extraction)  
**Last Updated**: 2025-12-11

---

## Foundation Documents (MUST READ)

Before starting any work on this phase:

1. `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
3. `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

**All quality gates must pass. No exceptions.**

---

## Overview

This phase creates reference indices for curriculum metadata and enables thread-based navigation:

1. **Reference Indices** - Structured metadata for subjects, key stages, glossary
2. **Thread Navigation** - Prior knowledge and curriculum progression
3. **National Curriculum Alignment** - Standards-aligned search

---

## New Indices

| Index                      | Purpose                        | Feature Parity Alignment      |
| -------------------------- | ------------------------------ | ----------------------------- |
| `oak_ref_subjects`         | Subject metadata               | Solves `subjectTitle` lookup  |
| `oak_ref_key_stages`       | Key stage metadata             | Solves `keyStageTitle` lookup |
| `oak_curriculum_glossary`  | Keywords with definitions      | Lesson keyword definitions    |
| `oak_curriculum_standards` | National curriculum statements | NC alignment search           |

---

## Reference Index Schemas

### oak_ref_subjects

```typescript
interface SubjectReference {
  slug: string; // 'maths'
  title: string; // 'Mathematics'
  description: string; // 'The study of numbers, quantities...'
  aliases: string[]; // ['math', 'numeracy']
  icon_url?: string; // Subject icon
}
```

### oak_ref_key_stages

```typescript
interface KeyStageReference {
  slug: string; // 'ks4'
  title: string; // 'Key Stage 4'
  short_code: string; // 'KS4'
  year_groups: string[]; // ['year-10', 'year-11']
  age_range: string; // '14-16'
  aliases: string[]; // ['gcse', 'y10', 'y11']
}
```

### oak_curriculum_glossary

```typescript
interface GlossaryEntry {
  term: string; // 'coefficient'
  definition: string; // 'A number multiplied by a variable...'
  subject_slugs: string[]; // ['maths']
  key_stage_slugs: string[]; // ['ks3', 'ks4']
  related_terms: string[]; // ['variable', 'constant']
  examples: string[]; // ['In 3x, the coefficient is 3']
}
```

### oak_curriculum_standards

```typescript
interface CurriculumStandard {
  id: string; // 'nc-maths-ks4-algebra-1'
  statement: string; // 'Solve quadratic equations algebraically...'
  subject_slug: string; // 'maths'
  key_stage_slug: string; // 'ks4'
  strand: string; // 'Algebra'
  sub_strand?: string; // 'Quadratics'
  related_lessons: string[]; // ['maths-ks4-solving-quadratics-1']
}
```

---

## Features

### 1. Reference Data Lookup

Enable efficient lookup of display titles and metadata:

```typescript
// Before: Multiple lookups or hardcoded
const keyStageTitle = keyStageSlug === 'ks4' ? 'Key Stage 4' : '...';

// After: Single lookup from reference index
const keyStage = await esClient.get({
  index: 'oak_ref_key_stages',
  id: keyStageSlug,
});
// { title: 'Key Stage 4', short_code: 'KS4', ... }
```

### 2. Thread-Based Navigation

Use `priorKnowledgeRequirements` from unit summaries to enable progression navigation:

```typescript
// Query: Find lessons that are prerequisites for "Solving Quadratics"
const prerequisites = await esClient.search({
  index: 'oak_lessons',
  query: {
    terms: {
      'lesson_slug.keyword': unit.priorKnowledgeRequirements.map((p) => p.lessonSlug),
    },
  },
});
```

### 3. National Curriculum Alignment

Enable search by NC standards:

```typescript
// Query: Find lessons aligned to NC Algebra standards
const ncAligned = await esClient.search({
  index: 'oak_lessons',
  query: {
    nested: {
      path: 'national_curriculum',
      query: {
        match: { 'national_curriculum.strand': 'Algebra' },
      },
    },
  },
});
```

---

## Implementation Tasks

### Phase 9a: Reference Indices (1 day)

| Task                      | Description                                | Test Type   |
| ------------------------- | ------------------------------------------ | ----------- |
| Subject reference index   | Create and populate oak_ref_subjects       | Integration |
| Key stage reference index | Create and populate oak_ref_key_stages     | Integration |
| Reference lookup API      | Endpoint for reference data                | Integration |
| Enrich integration        | Use references in Phase 8 enrich processor | Integration |

### Phase 9b: Glossary Index (1 day)

| Task                     | Description                        | Test Type   |
| ------------------------ | ---------------------------------- | ----------- |
| Glossary schema          | Define glossary entry structure    | Unit        |
| Glossary population      | Extract terms from lesson keywords | Integration |
| Glossary search endpoint | Search definitions by term         | Integration |
| Related terms linking    | Link related glossary entries      | Unit        |

### Phase 9c: Thread Navigation (1 day)

| Task                     | Description                                 | Test Type   |
| ------------------------ | ------------------------------------------- | ----------- |
| Prior knowledge indexing | Index priorKnowledgeRequirements from units | Integration |
| Prerequisite query       | Find prerequisites for a lesson/unit        | Integration |
| Progression path         | Build learning pathway from prerequisites   | Unit        |
| Thread filtering         | Filter search by thread/progression         | Integration |

---

## Success Criteria

- [ ] Reference indices created and populated
- [ ] Reference lookup API working
- [ ] Glossary search returning definitions
- [ ] Thread filtering working
- [ ] Prerequisite navigation functional
- [ ] OWA-compatible response format documented
- [ ] All quality gates pass

---

## TDD Requirements

| Component          | Test First                                     |
| ------------------ | ---------------------------------------------- |
| Reference lookup   | Unit test: returns correct metadata for slug   |
| Glossary search    | Integration test: finds definition by term     |
| Prerequisite query | Integration test: returns prerequisite lessons |
| Thread filter      | Integration test: filters by thread            |

---

## Quality Gates

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
```

**All gates must pass. No exceptions.**

---

## Key Files

### New Reference Indices

```text
apps/oak-open-curriculum-semantic-search/src/lib/reference/
├── subjects.ts                     # Subject reference operations
├── key-stages.ts                   # Key stage reference operations
├── glossary.ts                     # Glossary operations
├── standards.ts                    # NC standards operations
└── index.ts                        # Barrel exports
```

### Schema Definitions

```text
packages/sdks/oak-curriculum-sdk/src/
├── field-definitions/
│   ├── reference-subjects.ts       # Subject schema
│   ├── reference-key-stages.ts     # Key stage schema
│   ├── glossary.ts                 # Glossary schema
│   └── standards.ts                # NC standards schema
```

---

## Data Sources

| Index                      | Data Source                           |
| -------------------------- | ------------------------------------- |
| `oak_ref_subjects`         | Oak API /subjects + hardcoded aliases |
| `oak_ref_key_stages`       | Oak API /keystages + hardcoded data   |
| `oak_curriculum_glossary`  | Lesson keywords + definitions         |
| `oak_curriculum_standards` | NC statements (manual curation)       |

---

## Dependencies

- **Upstream**: Phase 8 (enrich processor uses reference indices)
- **Blocks**: Phase 10 (RAG uses reference data for grounding)

---

## Related Documents

- [Phase 8](./phase-8-entity-extraction.md) - Enrich processor integration
- [Feature Parity Analysis](../../research/feature-parity-analysis.md) - Gap analysis
