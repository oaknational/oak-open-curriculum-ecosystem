# Upstream Open Curriculum API Metadata Enhancement Wish List

- Upstream API docs: <https://open-api.thenational.academy/docs/about-oaks-api/api-overview>
- OpenAPI schema: <https://open-api.thenational.academy/api/v0/swagger.json>
- API front page: <https://open-api.thenational.academy/>

## Open Questions

- Does OpenAPI 3.0 support `examples` at the path level, rather than just at the parameter level?
- Can we update the OpenAPI spec to OpenAPI 3.1? Does GCP support this?
- Can we make sure that the API uses Zod 4?
- Can we make sure that the API ships the Zod schemas as code snippets, in addition to JSON Schema?
- Can we enhance the metadata of the API to make it more useful for AI agents?
- Can we improve data integrity at the API level?

---

## Binary Response Schema Fix (2025-12-16)

**Status**: 🔴 HIGH PRIORITY — Causes `z.unknown()` in generated SDK  
**Endpoint**: `/api/v0/lessons/{lessonSlug}/assets/{assetSlug}`  
**Response**: `LessonAssetResponse`

### Problem

The upstream OpenAPI schema incorrectly declares a JSON response for what is actually a binary file stream:

```yaml
# Current (incorrect)
responses:
  200:
    content:
      application/json:
        schema: {}   # Empty schema → generates z.unknown()
```

This generates `LessonAssetResponseSchema = z.unknown()` in the SDK, which:

1. Provides no type information
2. Cannot validate the response
3. Violates our strictness requirements

### Requested Fix

Change to idiomatic OpenAPI for binary responses:

```yaml
# Correct
responses:
  200:
    description: Binary asset file (PDF, image, video, etc.)
    content:
      application/octet-stream:
        schema:
          type: string
          format: binary
      application/pdf:
        schema:
          type: string
          format: binary
      image/*:
        schema:
          type: string
          format: binary
```

### Why This Matters

- **Type safety**: SDK can generate proper `Blob` or `ArrayBuffer` types
- **Documentation**: Consumers understand the response is binary, not JSON
- **Validation**: Response type validation becomes meaningful

### SDK Workaround (Current)

We currently accept `z.unknown()` for this endpoint because:

1. We cannot validate binary streams with Zod anyway
2. The upstream schema is the source of truth
3. This is documented as a legitimate exception pending upstream fix

---

## Legitimate `z.unknown()` Exceptions Registry (2025-12-16)

**Context**: Our strictness requirements mandate that all Zod schemas be explicit. However, some `z.unknown()` usages are **legitimate** due to genuinely dynamic data. This registry documents those exceptions.

### Exception 1: Elasticsearch Aggregations

**Pattern**: `z.record(z.string(), z.unknown())`  
**Location**: Search response schemas (`responses.lessons.ts`, `responses.units.ts`, etc.)  
**Field**: `AggregationsSchema`

```typescript
const AggregationsSchema = z.record(z.string(), z.unknown()).default({});
```

**Justification**:

- Elasticsearch aggregations have genuinely dynamic structure
- Shape depends on the query (terms, histogram, nested, etc.)
- Keys are aggregation names chosen at query time
- Values are polymorphic aggregation results

**Status**: ✅ LEGITIMATE — Cannot be made stricter without losing functionality

### Exception 2: Binary File Responses (Pending Upstream Fix)

**Pattern**: `z.unknown()`  
**Location**: `curriculumZodSchemas.ts`  
**Schema**: `LessonAssetResponseSchema`

**Justification**:

- Upstream declares empty JSON schema for binary endpoint
- See "Binary Response Schema Fix" section above for upstream request

**Status**: ⚠️ PENDING UPSTREAM — Will become `z.instanceof(Blob)` or similar when fixed

---

## Bulk Download Data Integrity Issues (2025-12-19)

**Context**: Analysis of the bulk download data (`/bulk-download` endpoint) revealed inconsistencies that affect downstream filtering and search capabilities.

### Issue 1: Title Fields Null Despite Slug Fields Populated

**Affected Endpoints**: Bulk download JSON files (e.g., `maths-secondary.json`)
**Fields Affected**: `yearTitle`, `keyStageTitle`, `subjectTitle`

**Observation**:

```json
{
  "yearTitle": null,        // ← null
  "yearSlug": "year-7",     // ← populated
  "keyStageTitle": null,    // ← null
  "keyStageSlug": "ks3",    // ← populated
  "subjectTitle": null,     // ← null
  "subjectSlug": null,      // ← also null (double issue)
  "unitTitle": "Place value",
  "unitSlug": "place-value"
}
```

**Scope**: All 98 units in `maths-secondary.json` have `yearTitle: null` and `keyStageTitle: null`.

**Impact**:

- Consumers expecting human-readable titles get null
- Inconsistency between slug availability and title availability
- `subjectSlug` is also null in some cases (expected: `"maths"`)

**Requested Fix**:

Populate all `*Title` fields when corresponding `*Slug` fields are populated:

```json
{
  "yearTitle": "Year 7",
  "yearSlug": "year-7",
  "keyStageTitle": "Key Stage 3",
  "keyStageSlug": "ks3",
  "subjectTitle": "Maths",
  "subjectSlug": "maths"
}
```

