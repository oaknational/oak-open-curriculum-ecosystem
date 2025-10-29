# Oak Open Curriculum API Deep Dive - Key Findings

**Date**: 2025-10-28  
**Research Focus**: Understanding API structure, terminology, Zod validators, and OpenAPI version

---

## Executive Summary

This research examined the Oak Open Curriculum API codebase (`reference/oak-openapi`) and Oak Web Application (`reference/Oak-Web-Application`) to answer four key questions and improve our ontology and wishlist documents.

### Key Findings

1. **✅ URL Structure Confirmed**: OWA uses `/teachers/programmes/{programmeSlug}`, NOT `/teachers/sequences/{sequenceSlug}`
2. **❌ Terminology Mismatch**: API uses "sequence" internally, OWA uses "programme" for user-facing URLs
3. **⚠️ Zod Validator Duplication**: We're regenerating Zod schemas that already exist in the API (but aren't exported)
4. **📊 OpenAPI Version**: Currently 3.0.3; upgrading to 3.1.x would provide benefits but is blocked by `trpc-to-openapi` library

---

## 1. OWA URL Structure & Terminology

### Confirmed URL Patterns

From `reference/Oak-Web-Application/src/pages/teachers/`:

```plaintext
/teachers/lessons/{lessonSlug}                                    ✅ Correct
/teachers/programmes/{programmeSlug}/units                        ✅ Uses "programmes"
/teachers/programmes/{programmeSlug}/units/{unitSlug}             ✅ Uses "programmes"
/teachers/programmes/{programmeSlug}/units/{unitSlug}/lessons     ✅ Uses "programmes"
```

### API vs OWA Terminology

| Concept                           | API Internal   | OWA User-Facing | Notes                        |
| --------------------------------- | -------------- | --------------- | ---------------------------- |
| **Year-long progression pathway** | `sequenceSlug` | `programmeSlug` | Same entity, different names |
| **Teaching block**                | `unitSlug`     | `unitSlug`      | ✅ Consistent                |
| **Teaching session**              | `lessonSlug`   | `lessonSlug`    | ✅ Consistent                |

### Evidence

**API (reference/oak-openapi/src/lib/handlers/sequences/sequences.ts)**:

```typescript
export const getSequences = router({
  getSequenceUnits: protectedProcedure
    .meta({
      openapi: {
        path: '/sequences/{sequence}/units',
        // ...
      }
    })
```

**OWA (reference/Oak-Web-Application/src/pages/teachers/programmes/[programmeSlug]/units.tsx)**:

```typescript
export type UnitListingPageProps = {
  curriculumData: UnitListingData;
};

// Data structure includes:
// - programmeSlug: z.string()
// - keyStageSlug: keystageSlugs
// - subjectSlug: subjectSlugs
```

**OWA Data Schema (reference/Oak-Web-Application/src/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema.ts)**:

```typescript
const reshapedUnitData = z.object({
  slug: z.string(),
  title: z.string(),
  programmeSlug: z.string(), // ← OWA uses "programme"
  keyStageSlug: keystageSlugs,
  subjectSlug: subjectSlugs,
  // ...
});
```

### Implication for Ontology

Our ontology document should:

- ✅ **Already notes**: "Sequence (synonyms: Programme)"
- ❌ **Missing**: Clarify that API uses `sequenceSlug` internally while OWA uses `programmeSlug` for URLs
- ❌ **Missing**: Update all canonical URL examples to use `/teachers/programmes/` not `/teachers/sequences/`
- ✅ **Action**: Add note about terminology mapping in relationship section

---

## 2. API Ontology Improvements from Code Review

### Current API Data Model (from code inspection)

#### Sequence/Programme Fields (actual API response)

From `reference/oak-openapi/src/lib/handlers/subjects/types.ts`:

```typescript
const sequenceResult = z.object({
  sequenceSlug: z.string().openapi({
    description: 'The slug identifier for the sequence',
    example: 'english-primary',
  }),
  phaseSlug: z.string().openapi({
    description: 'The phase slug',
    example: 'primary',
  }),
  // ...
});
```

From `reference/oak-openapi/src/lib/handlers/sequences/types.ts`:

```typescript
const yearSequenceSchema = z.object({
  year: z.union([z.number(), z.literal('all-years')]).openapi({
    description: 'The year group',
  }),
  title: z.string().optional(),
  units: z.array(unitSchema),
});
```

#### KS4 Variant Structure

```typescript
// Sequence → ExamSubject → Tier → Unit
const examSubjectsSchemaWithTiers = z.object({
  examSubjectTitle: z.string(),
  examSubjectSlug: z.string().optional(),
  tiers: z.array(tierSchema),
});

const tierSchema = z.object({
  tierTitle: z.string(),
  tierSlug: z.string(),
  units: z.array(unitSchema),
});
```

### Missing from Current Ontology

1. **Phase as explicit entity** with `phaseSlug` and `phaseTitle` fields
2. **Sequence structure variants**: Standard (year-based) vs KS4 (exam subjects/tiers/pathways)
3. **Unit grouping mechanisms**: By year, by exam subject, by tier, by pathway
4. **Release cohort information**: `cohort`, `hasNewContent`, `hasCycle2Content` (from OWA)
5. **Specialist content**: OWA has `/teachers/specialist/` routes for specialist subjects
6. **Learning themes**: OWA uses `learningThemes` for categorization (different from threads/categories)

### Relationships to Add/Clarify

- **Sequence ↔ Phase**: `BELONGS_TO` (phaseSlug: primary|secondary)
- **Sequence → Years**: `TARGETS` (array of years covered)
- **Sequence → ExamSubject**: `HAS_EXAM_STRUCTURE` (KS4 only)
- **ExamSubject → Tier**: `DIVIDED_INTO` (foundation|higher)
- **Unit → Unit**: `ALTERNATIVE_OF` (via unitOptions array)

---

## 3. Zod Validators: Current State & Duplication Problem

### How the API Works

**Step 1: Hand-written Zod schemas**

```typescript
// reference/oak-openapi/src/lib/handlers/lesson/schemas/lessonSummaryRequest.schema.ts
import z from 'zod';

export const lessonSummaryRequestSchema = z.object({
  lesson: z.string({ description: 'The slug of the lesson' }),
});
```

**Step 2: Zod + OpenAPI extensions**

```typescript
// reference/oak-openapi/src/lib/handlers/sequences/types.ts
import { z } from 'zod';
import 'zod-openapi/extend';

const categorySchema = z.object({
  categoryTitle: z.string().openapi({ description: 'The title of the category' }),
  categorySlug: z
    .string()
    .optional()
    .openapi({ description: 'The unique identifier for the category' }),
});
```

**Step 3: tRPC procedures with Zod schemas**

```typescript
// reference/oak-openapi/src/lib/handlers/lesson/lesson.ts
export const getLessons = router({
  getLesson: protectedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/lessons/{lesson}/summary',
        description: 'This endpoint returns a summary for a given lesson',
      },
    })
    .input(lessonSummaryRequestOpenAPISchema) // ← Zod schema
    .output(lessonSummaryResponseOpenAPISchema) // ← Zod schema
    .query(async ({ input }) => {
      // Implementation
    }),
});
```

**Step 4: OpenAPI generation**

```typescript
// reference/oak-openapi/src/lib/zod-openapi/schema/generateDocument.ts
import { generateOpenApiDocument } from 'trpc-to-openapi';

export const openApiDocument = generateOpenApiDocument(router, {
  title: 'Oak OpenAPI',
  version: '0.5.0',
  baseUrl: 'https://open-api.thenational.academy/api/v0',
});
```

**Result**: OpenAPI 3.0.3 JSON document exposed at `/api/v0`

### What We Do (Duplication)

**Step 1: Fetch OpenAPI document**

```bash
curl https://open-api.thenational.academy/api/v0 > api-schema-original.json
```

**Step 2: Regenerate Zod schemas from OpenAPI**

```bash
pnpm type-gen  # Runs our custom zodgen-core.ts
```

**Result**: We recreate the SAME Zod schemas that already exist in the API codebase!

### Why This Duplication Happens

- ❌ **API doesn't export its Zod schemas** as an npm package
- ❌ **API's Zod schemas are internal** (not designed for external consumption)
- ✅ **OpenAPI is the public contract** (documented, versioned, stable)
- ✅ **We need type-safe SDK** for our MCP tools
- ⚠️ **Round-trip conversion**: Zod → OpenAPI → Zod (potential data loss)

### Potential Solutions

#### Option A: API exports Zod schemas as npm package ⭐ **RECOMMENDED**

**Pros**:

- ✅ Single source of truth
- ✅ No round-trip conversion
- ✅ Perfect type fidelity
- ✅ Reduced maintenance burden

**Cons**:

- ⚠️ Requires API team to maintain public Zod package
- ⚠️ Breaking changes affect all consumers
- ⚠️ Need versioning strategy

**Implementation**:

```json
// In oak-openapi repo
{
  "name": "@oaknational/curriculum-api-schemas",
  "main": "dist/index.js",
  "exports": {
    "./lesson": "./dist/handlers/lesson/schemas/index.js",
    "./units": "./dist/handlers/units/schemas/index.js"
    // ...
  }
}
```

```typescript
// In our SDK
import { lessonSummaryRequestSchema } from '@oaknational/curriculum-api-schemas/lesson';
```

#### Option B: Continue current approach (OpenAPI → Zod)

**Pros**:

- ✅ Works today
- ✅ API team doesn't need to change anything
- ✅ We control our own schemas
- ✅ Can add enrichments (MCP extensions, canonical URLs)

**Cons**:

- ❌ Duplication of effort
- ❌ Round-trip conversion issues (nullable handling, discriminated unions)
- ❌ Maintenance overhead

#### Option C: Hybrid approach

**If API exports schemas**:

- Use them directly for input/output validation
- Layer our MCP-specific enrichments on top

**If API doesn't export**:

- Continue generating from OpenAPI
- Request better OpenAPI metadata (items in wishlist)

### Recommendation

**Short-term**: Continue current approach (Option B) + push for wishlist items

**Long-term**: Advocate for Option A (API exports Zod schemas)

**Reasoning**:

- The wishlist items (better descriptions, error docs, ontology endpoint) benefit ALL API consumers, not just us
- Exporting Zod schemas is a larger architectural decision requiring API team buy-in
- We can improve our tooling regardless of whether schemas are exported

---

## 4. OpenAPI Version: 3.0.3 vs 3.1.x

### Current State

- **API generates**: OpenAPI 3.0.3 (via `trpc-to-openapi` 2.1.5)
- **Confirmed in**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Oak OpenAPI",
    "version": "0.5.0"
  }
}
```

### OpenAPI 3.1.x Benefits

| Feature                    | 3.0.x                   | 3.1.x                             | Impact                                   |
| -------------------------- | ----------------------- | --------------------------------- | ---------------------------------------- |
| **JSON Schema compliance** | Subset of Draft 7       | Full Draft 2020-12                | Better validation, tooling compatibility |
| **Nullable types**         | Custom `nullable: true` | Native `type: ["string", "null"]` | Cleaner, more standard                   |
| **Examples**               | Singular `example`      | Multiple `examples`               | Better documentation                     |
| **const keyword**          | Via enum workaround     | Native `const`                    | Cleaner single-value constraints         |
| **Discriminated unions**   | Basic oneOf             | Improved discriminator            | Better polymorphic types                 |
| **Webhooks**               | N/A                     | Native support                    | Future extensibility                     |

### Example Improvements

**3.0.3 (current)**:

```yaml
supervisionLevel:
  type: string
  nullable: true # Custom keyword
  description: '...'
```

**3.1.x (improved)**:

```yaml
supervisionLevel:
  type: [string, 'null'] # JSON Schema standard
  description: '...'
```

**3.0.3 (current)**:

```yaml
keyStage:
  type: string
  example: 'ks2' # Singular
```

**3.1.x (improved)**:

```yaml
keyStage:
  type: string
  examples: # Multiple examples
    ks1:
      value: 'ks1'
      summary: 'Key Stage 1 (ages 5-7)'
    ks2:
      value: 'ks2'
      summary: 'Key Stage 2 (ages 7-11)'
```

### Blockers to Upgrading

**Primary blocker**: `trpc-to-openapi` library

- Current version (2.1.5) generates OpenAPI 3.0.3 only
- Check if newer versions support 3.1.x: <https://github.com/jlalmes/trpc-to-openapi>
- Alternative: Use `zod-openapi` library directly (what we use in semantic search app)

**Our semantic search app** already uses OpenAPI 3.1.0:

```typescript
// apps/oak-open-curriculum-semantic-search/src/lib/openapi.ts
import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

const generator = new OpenApiGeneratorV31(registry.definitions);
const doc = generator.generateDocument({
  openapi: '3.1.0', // ← We already do this!
  info: {
    title: 'Oak Curriculum Search API',
    version: '1.0.0',
  },
});
```

### Recommendation

**For API team**:

- ⚠️ **Low priority**: Upgrading to 3.1.x is nice-to-have, not critical
- ✅ **Higher priority**: Implement wishlist items (descriptions, error docs, ontology)
- 🔍 **Research**: Check if `trpc-to-openapi` has 3.1.x support in newer versions
- 🔄 **Alternative**: Consider switching from `trpc-to-openapi` to direct `zod-openapi` library (more control, 3.1.x support)

**For us**:

- ✅ We can consume 3.0.3 today (works fine)
- ✅ Our type-gen handles 3.0.3 correctly
- ✅ If API upgrades to 3.1.x, our type-gen can adapt (minor changes needed)

---

## 5. Actions Required

### Update Ontology Document (`docs/architecture/curriculum-ontology.md`)

1. **Clarify sequence/programme terminology**:
   - Keep "Sequence (synonyms: Programme)" definition
   - Add note: "API uses `sequenceSlug`, OWA uses `programmeSlug` for user-facing URLs"

2. **Fix canonical URL patterns**:
   - Change all `/teachers/sequences/` to `/teachers/programmes/`
   - Update example: `canonical_url_pattern: "https://www.thenational.academy/teachers/programmes/{programmeSlug}"`

3. **Add missing entities**:
   - **Phase** as explicit entity (not just field)
   - **ExamSubject** (already mentioned, clarify structure)
   - **Tier** (already mentioned, add relationship to examSubject)
   - **Pathway** (KS4 pathways: core, combined-science, etc.)
   - **LearningTheme** (OWA categorization mechanism)

4. **Add missing relationships**:
   - Sequence → Phase (BELONGS_TO)
   - Sequence → Years (TARGETS, array)
   - ExamSubject → Tier (DIVIDED_INTO)
   - Unit → LearningTheme (CATEGORIZED_BY)

5. **Clarify KS4 structure**:
   - Document three-level hierarchy: ExamSubject → Tier → Unit
   - Document alternative pathway structure
   - Add sequence-rules.md findings to ontology

### Update Wishlist Document (`.agent/plans/upstream-api-metadata-wishlist.md`)

1. **Fix all URL examples**:
   - Replace `/teachers/sequences/` with `/teachers/programmes/`
   - Update ontology endpoint example to use `programme` terminology

2. **Add context about Zod schemas**:
   - Item #3 (ontology endpoint): Note that API already has rich Zod schemas internally
   - Suggest: "Consider exposing schemas as npm package for perfect type fidelity"

3. **Clarify OpenAPI version**:
   - Add note in Item #4 or #10: "API currently generates OpenAPI 3.0.3; upgrading to 3.1.x would provide benefits (better nullable handling, multiple examples) but is low priority"

4. **Validate all examples**:
   - Ensure all endpoint paths match actual API
   - Ensure all field names match actual responses

### Research Follow-ups

1. **Check OWA for actual programme slug patterns**:
   - Do programme slugs follow same pattern as sequence slugs?
   - Example: API has `english-primary`, does OWA use same slug?

2. **Investigate specialist content**:
   - OWA has `/teachers/specialist/` routes
   - Are these different sequences or just filtered views?

3. **Document learning themes**:
   - What's the relationship between threads, categories, and learning themes?
   - Are they mutually exclusive or complementary?

---

## Conclusion

This deep dive revealed:

1. ✅ **URL terminology mismatch** requiring ontology updates
2. ✅ **Zod validator duplication** is unavoidable short-term but could be solved by API exporting schemas
3. ✅ **OpenAPI 3.1.x upgrade** would be beneficial but low priority
4. ✅ **Rich API data model** provides many missing entities/relationships for ontology

**Next steps**: Update ontology and wishlist documents with these findings, then propose Zod schema export to API team as long-term improvement.
