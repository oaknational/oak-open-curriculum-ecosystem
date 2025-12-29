# Reference Indices

**Status**: 📋 Planned  
**Parent**: [README.md](../README.md) | [roadmap.md](../roadmap.md) (Milestone 6)  
**Priority**: Medium  
**Dependencies**: Milestone 1 (complete ES ingestion)

---

## Goal

Create reference indices for curriculum metadata to enable:

- Fast lookups (e.g., subject slug → title)
- Search filtering (e.g., glossary terms)
- Curriculum navigation (e.g., thread progression)
- National Curriculum alignment search

---

## Proposed Indices

| Index | Purpose | Data Source |
|-------|---------|-------------|
| `oak_ref_subjects` | Subject metadata | `/subjects` API |
| `oak_ref_key_stages` | Key stage metadata | `/key-stages` API |
| `oak_curriculum_glossary` | Keywords with definitions | Extracted from lessons |
| `oak_curriculum_standards` | National curriculum statements | Extracted from units |

---

## Schemas

### oak_ref_subjects

```typescript
interface SubjectReference {
  slug: string;         // 'maths'
  title: string;        // 'Mathematics'
  description: string;  // 'The study of numbers, quantities...'
  aliases: string[];    // ['math', 'numeracy']
  icon_url?: string;    // Subject icon
}
```

### oak_ref_key_stages

```typescript
interface KeyStageReference {
  slug: string;        // 'ks4'
  title: string;       // 'Key Stage 4'
  short_code: string;  // 'KS4'
  year_groups: string[]; // ['year-10', 'year-11']
  age_range: string;   // '14-16'
  aliases: string[];   // ['gcse', 'y10', 'y11']
}
```

### oak_curriculum_glossary

```typescript
interface GlossaryEntry {
  term: string;           // 'coefficient'
  definition: string;     // 'A number multiplied by a variable...'
  subject_slugs: string[]; // ['maths']
  key_stage_slugs: string[]; // ['ks3', 'ks4']
  related_terms: string[]; // ['variable', 'constant']
  examples: string[];     // ['In 3x, the coefficient is 3']
}
```

### oak_curriculum_standards

```typescript
interface CurriculumStandard {
  id: string;             // 'nc-maths-ks4-algebra-1'
  statement: string;      // 'Solve quadratic equations algebraically...'
  subject_slug: string;   // 'maths'
  key_stage_slug: string; // 'ks4'
  strand: string;         // 'Algebra'
  sub_strand?: string;    // 'Quadratics'
  related_lessons: string[]; // ['maths-ks4-solving-quadratics-1']
}
```

---

## Features

### 1. Reference Data Lookup

```typescript
// Fast lookup of display titles
const keyStage = await esClient.get({
  index: 'oak_ref_key_stages',
  id: keyStageSlug,
});
// { title: 'Key Stage 4', short_code: 'KS4', ... }
```

### 2. Glossary Search

Enable "what does X mean?" queries:

```typescript
const definition = await esClient.search({
  index: 'oak_curriculum_glossary',
  query: { match: { term: 'coefficient' } },
});
```

### 3. National Curriculum Alignment

```typescript
const ncAligned = await esClient.search({
  index: 'oak_lessons',
  query: {
    nested: {
      path: 'national_curriculum',
      query: { match: { 'national_curriculum.strand': 'Algebra' } },
    },
  },
});
```

---

## Implementation Approach

1. Define field definitions in SDK type-gen (schema-first)
2. Create index schemas via `pnpm type-gen`
3. Build ingestion pipeline to populate indices
4. Add search endpoints for reference data

---

## Success Criteria

- [ ] Reference indices created and populated
- [ ] Reference lookup API working
- [ ] Glossary search returning definitions
- [ ] All quality gates pass

---

## Evaluation Requirements

Reference indices enable new query types that need ground truth validation:

1. **Create ground truths** for reference queries:
   - "What is a coefficient?" → Expected glossary definition
   - "What subjects are available?" → Expected subject list
   - "What key stages cover algebra?" → Expected key stage list

2. **Measure response quality**:
   - Accuracy: Does the definition match expectations?
   - Completeness: Are all reference items indexed?

3. **Record results** in [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md)

**Success metric**: Reference queries return correct results (100% accuracy on structured lookups)

---

## Related Documents

- [roadmap.md](../roadmap.md) — Linear execution path
- [Cardinal Rule](../../../directives-and-memory/rules.md) — All types from schema at compile time

