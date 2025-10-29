# Sequence vs Programme: Corrected Analysis

## Critical Finding: They Are NOT The Same

After deeper investigation of materialized views and GraphQL queries, **sequence ≠ programme**.

---

## What Each Concept Actually Represents

### **Sequence** (API Concept)

**Materialized View**: `published_mv_curriculum_sequence_b_13_0_17`

**Definition**: The underlying curriculum structure - a pedagogically ordered collection of units for a subject-phase combination.

**Examples**:

- `english-primary`
- `maths-secondary`
- `science-secondary-aqa` (includes exam board when KS4)

**Structure**:

```typescript
Sequence {
  slug: "maths-secondary",
  units: [
    { year: 7, units: [...] },
    { year: 8, units: [...] },
    { year: 9, units: [...] },
    {
      year: 10,
      tiers: [
        { tierSlug: "foundation", units: [...] },
        { tierSlug: "higher", units: [...] }
      ]
    },
    // etc
  ]
}
```

**Key characteristic**: A sequence represents the CANONICAL curriculum design - "this is how we've organized maths for secondary".

---

### **Programme** (OWA Concept)

**Materialized Views**:

- `published_mv_synthetic_programmes_by_year_18_2_0`
- `published_mv_synthetic_unitvariants_with_lesson_ids_by_keystage_18_0_0`
- `published_mv_synthetic_unitvariant_lessons_by_keystage_13_1_0`

**Definition**: A SYNTHETIC/DERIVED view representing a specific pathway through a sequence for a particular combination of:

- Subject
- Phase
- Year
- Exam board (if applicable)
- Tier (if applicable)
- Pathway (if applicable)

**Examples** (all from the SAME sequence `maths-secondary`):

- `maths-secondary-foundation-year-10`
- `maths-secondary-higher-year-10`
- `maths-secondary-foundation-year-11`
- `maths-secondary-higher-year-11`

**Key characteristic**: A programme is a CONTEXTUALIZED view - "this is the specific path a year 10 student taking foundation maths would follow".

---

## Relationship

```plaintext
Sequence (1)
  ↓ generates/derives
Programme (many)
```

**One sequence generates MULTIPLE programmes**, one for each combination of:

- Year group (7, 8, 9, 10, 11, "all-years")
- Tier (foundation, higher) - where applicable
- Exam board (AQA, OCR, Edexcel) - where applicable
- Pathway (core, combined-science) - where applicable

---

## Why This Matters for Canonical URLs

### Lesson Canonical URL: `/teachers/lessons/{lessonSlug}`

**Why it's context-independent**:
A lesson like `"pythagoras-theorem"` might appear in MULTIPLE programmes:

- `maths-secondary-foundation-year-10` (unit: geometry-basics)
- `maths-secondary-higher-year-9` (unit: advanced-triangles)
- `maths-secondary-foundation-year-11` (revision unit)

The canonical URL presents the lesson in isolation, without assuming which programme context the teacher is using.

### Unit Canonical URL: `/teachers/units/{unitSlug}`

**Why it's context-independent**:
Similarly, a unit like `"fractions-year-5"` might appear in multiple programmes:

- `maths-primary-year-5-term-1`
- `maths-primary-year-5-term-2`

The canonical URL shows the unit without programme context.

### Programme URL: `/teachers/programmes/{programmeSlug}/units`

**Why it's context-specific**:
This URL shows units within a SPECIFIC programme context - e.g., showing only the units that are part of the year 10 foundation tier pathway.

---

## Database Schema Evidence

### API Queries (Sequence-based)

```graphql
query getSequenceUnits {
  published_mv_curriculum_sequence_b_13_0_17(
    where: { slug: { _eq: "maths-secondary" } }
  ) {
    slug
    year
    tier_slug
    examboard_slug
    unit_options {
      slug
      title
      lessons { ... }
    }
  }
}
```

**Returns**: The full sequence structure with all years, all tiers, all units.

### OWA Queries (Programme-based)

```graphql
query unitListing($programmeSlug: String!) {
  units: published_mv_synthetic_unitvariants_with_lesson_ids_by_keystage_18_0_0(
    where: { programme_slug: { _eq: $programmeSlug } }
  ) {
    programme_slug # ← synthetic field
    unit_slug
    unit_data
    programme_fields
    # etc
  }
}
```

**Returns**: Only the units that belong to THIS SPECIFIC programme (e.g., `maths-secondary-foundation-year-10`).

```graphql
query pupilProgrammeListing($baseSlug: String!) {
  data: published_mv_synthetic_programmes_by_year_18_2_0(where: { base_slug: { _eq: $baseSlug } }) {
    programme_slug # ← e.g., "maths-secondary-foundation-year-10"
    year_slug
    programme_fields
  }
}
```

**Returns**: All programmes derived from a base sequence slug.

---

## Implications for Ontology

### Sequence Entity

```typescript
Sequence {
  sequenceSlug: string;           // API internal identifier
  subject: string;
  phase: string;
  examBoard?: string;             // KS4 only

  // Represents the CANONICAL curriculum design
  structure: YearGroup[] | KS4Structure;
}
```

### Programme Entity (NEW - needs to be added to ontology)

```typescript
Programme {
  programmeSlug: string;          // Synthetic identifier
  baseSlug: string;               // Links back to source sequence

  // Context-specific filters
  year: number | "all-years";
  tier?: "foundation" | "higher";
  examBoard?: string;
  pathway?: string;

  // Derived from sequence
  units: Unit[];                  // Filtered to this context
}
```

### Relationship

- Sequence (1) → DERIVES → Programme (many)
- Programme BELONGS_TO Sequence
- Lesson APPEARS_IN Programme (many-to-many)
- Unit APPEARS_IN Programme (many-to-many)
- Lesson HAS_CANONICAL_URL (context-independent)
- Unit HAS_CANONICAL_URL (context-independent)

---

## Corrections Needed

### In Ontology Document

1. **Separate Sequence and Programme as distinct entities**
2. **Add Programme entity** with fields:
   - `programmeSlug` (synthetic)
   - `baseSlug` (links to sequence)
   - Context filters (year, tier, examBoard, pathway)
3. **Update relationships**:
   - Sequence → Programme (DERIVES, 1:many)
   - Programme → Unit (INCLUDES, many:many via synthetic view)
   - Programme → Lesson (INCLUDES, many:many via synthetic view)
4. **Update URL patterns**:
   - Sequence: No direct user-facing URL in OWA
   - Programme: `/teachers/programmes/{programmeSlug}/units`
   - Lesson (canonical): `/teachers/lessons/{lessonSlug}`
   - Unit (canonical): `/teachers/units/{unitSlug}`

### In Wishlist Document

1. **Clarify terminology**:
   - API exposes sequences (canonical curriculum)
   - OWA displays programmes (contextualized pathways)
   - These are related but distinct concepts
2. **Update ontology endpoint example**:
   - Should explain both sequences and programmes
   - Should explain the derivation relationship
   - Should explain why canonical URLs exist (multi-context resources)
3. **Explain multi-context nature**:
   - Lessons/units appear in multiple programmes
   - Canonical URLs present them context-independently
   - Programme URLs show them in specific context

---

## Key Insight from User

> "lessons and units can always appear in multiple contexts, that is why we have the canonical urls to present them in isolation, it is impossible given just a lesson, to know what the correct unit/year/variant/exam board"

This confirms: **A lesson belongs to a sequence, but appears in MULTIPLE programmes**. The canonical URL is the context-free way to reference it.

---

## Action Items

1. ❌ Cancel my previous assumption that sequence == programme
2. ✅ Distinguish them as separate but related entities
3. ✅ Add Programme as new entity in ontology
4. ✅ Update relationship diagrams
5. ✅ Explain derivation/synthesis process
6. ✅ Document multi-context nature of lessons/units
7. ✅ Keep canonical URLs for lessons/units (context-independent)
8. ✅ Use programme URLs for browsing in context

---

## Questions for User

1. Should the API expose a `/programmes` endpoint that returns synthetic programme views (like OWA does)?
2. Or should the API continue to expose only sequences, and let consumers derive programmes client-side?
3. For the ontology endpoint, should it explain both concepts, or focus on sequences (since that's what the API exposes)?
