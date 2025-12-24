# 06: Reference Indices

**Status**: 📋 PENDING  
**Priority**: Medium  
**Created**: 2025-12-24  
**Source**: Extracted from phase-10-reference-indices.md

---

## Overview

Reference indices provide structured metadata for curriculum entities. They enable:

- Fast lookups (e.g., subject slug → title)
- Search filtering (e.g., glossary terms)
- Curriculum navigation (e.g., thread progression)

---

## Proposed Indices

| Index                      | Purpose                        | Data Source            |
| -------------------------- | ------------------------------ | ---------------------- |
| `oak_ref_subjects`         | Subject metadata               | `/subjects` API        |
| `oak_ref_key_stages`       | Key stage metadata             | `/key-stages` API      |
| `oak_curriculum_glossary`  | Keywords with definitions      | Extracted from lessons |
| `oak_curriculum_standards` | National curriculum statements | Extracted from units   |

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

## Thread Navigation

Threads represent curriculum progression. The Thread index should include:

- `thread_slug` - Unique identifier
- `thread_title` - Display title
- `subject_slugs` - Associated subjects
- `unit_slugs` - Units in the thread (ordered)
- `unit_orders` - Sequence order for each unit
- `unit_count` - Number of units

---

## Implementation Approach

1. Define field definitions in SDK type-gen (schema-first)
2. Create index schemas via `pnpm type-gen`
3. Build ingestion pipeline to populate indices
4. Add search endpoints for reference data

---

## Related Documents

- [phase-10-reference-indices.md](../phase-10-reference-indices.md) - Original detailed plan
- [Cardinal Rule](../../../directives-and-memory/rules.md) - All types from schema at compile time
