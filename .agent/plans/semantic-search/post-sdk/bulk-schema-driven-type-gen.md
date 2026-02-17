# Bulk Schema-Driven Type Generation

**Status**: 📋 BACKLOG
**Priority**: Medium-High — improves type safety, eliminates hardcoded domain constants
**Created**: 2026-02-17
**Related**: [Config Architecture Standardisation](../../architecture/config-architecture-standardisation-plan.md), [Subject Domain Model](move-search-domain-knowledge-to-typegen-time.md)

---

## Context

The API team has added a JSON Schema file (`schema.json`) to the bulk
data download. This schema formally describes the structure of the bulk
download files — the same files we ingest into Elasticsearch.

Currently, the bulk type-gen pipeline (`type-gen/typegen/bulk/`) uses
**hand-crafted TypeScript templates** to produce Zod schemas. Those
templates were written by manually examining bulk data files and
documenting the delta from the API schema. The schema.json didn't exist
at the time.

This plan replaces the template-based approach with a schema-driven
approach, bringing the bulk pipeline into the same discipline as the
API pipeline: two upstream schemas, two type-gen consumers, one
principle.

### Prerequisite: Schema Endpoint

The schema.json currently ships inside the bulk download archive. To
consume it at type-gen time without downloading all bulk data, we need
the API team to expose it at a dedicated endpoint (e.g.
`/api/bulk/schema`). This is a request to the API team.

If the endpoint is not available, the fallback is to commit the
schema.json to the SDK's schema-cache directory (alongside
`api-schema-original.json`) and update it manually when the bulk
format changes.

---

## Schema Comparison: API vs Bulk

See [Appendix: Field-by-Field Comparison](#appendix-field-by-field-comparison)
below for the full analysis. Key findings:

### 1. The Bulk Schema Is Dramatically More Type-Safe

The API schema uses **plain `string`** for all domain vocabulary fields.
The bulk schema has **strict enums** on 10 fields:

| Field | Bulk Enum Values | API Schema |
|-------|-----------------|------------|
| `subjectSlug` | 21 (17 canonical + 4 KS4 science) | `string` |
| `subjectTitle` | 21 | `string` |
| `keyStageSlug` | 6 (ks1-ks4, EYFS, all-ks) | `string` |
| `keyStageTitle` | 6 | `string` |
| `yearSlug` | 15 (reception through year-13, all-years) | `string` |
| `examBoard.slug` | 6 (aqa, edexcel, eduqas, ocr, wjec, edexcelb) | N/A |
| `examBoard.title` | 6 | N/A |
| `ks4Option.slug` | 8 (exam boards + core, gcse) | N/A |
| `ks4Option.title` | 8 | N/A |
| `unitLesson.state` | 3 (published, new, migration) | 2 (published, new) |

The bulk schema is, in effect, the **authoritative source of domain
vocabulary** for the Oak curriculum.

### 2. Three Fields the Bulk Adds Beyond the API

| Field | Type | Description |
|-------|------|-------------|
| `lessonSlug` | string | Required — the API's LessonSummaryResponse doesn't include this |
| `transcript_sentences` | string or null | Full transcript in sentence form |
| `transcript_vtt` | string or null | Full transcript in VTT format |

These are the fields that make bulk data valuable for search — the
slug for document IDs and the transcripts for semantic search.

### 3. Fields the API Has That Bulk Omits

For units, the API includes fields that the bulk format omits:

| API Unit Field | Purpose | Why Absent from Bulk |
|---------------|---------|---------------------|
| `phaseSlug` | "primary" / "secondary" | Derivable from the filename (e.g. `maths-primary.json`) |
| `subjectSlug` | Subject identifier | Derivable from the filename |
| `notes` | Unit summary notes | Not needed for search |
| `categories` | Category tags | Not included in bulk |
| `canonicalUrl` | Oak website URL | Computed at indexing time |

### 4. Naming Inconsistency

`downloadsAvailable` (API, camelCase) vs `downloadsavailable` (bulk,
all lowercase). The schema confirms this is intentional in the bulk
format, not a typo.

### 5. Nullable Handling

The API uses `anyOf: [{type: "array"}, {type: "null"}]`. The bulk
schema uses `type: ["array", "null"]`. Both are valid JSON Schema
2020-12 but syntactically different. Importantly, the bulk schema
describes null values as `null`, not the `"NULL"` string sentinel
that the current code handles. Worth confirming with the API team
whether `"NULL"` strings have been cleaned up or whether the schema
describes the target state rather than current reality.

### 6. Stricter Requirements in Bulk

Several fields that are optional in the API are **required** in the
bulk schema: `pupilLessonOutcome`, `description` (on unit),
`whyThisWhyNow`, `threads`, `lessonOrder`.

### 7. Extra Enum Value in Bulk

`unitLesson.state` includes `"migration"` in the bulk schema (3
values) but only `"published"` and `"new"` in the API (2 values).
This is a lifecycle state visible in the bulk data but not exposed
through the live API.

---

## Plan

### Phase 1: Schema Acquisition

1. **Request a `/api/bulk/schema` endpoint** from the API team that
   returns just the JSON schema (no bulk data). This enables type-gen
   to fetch it alongside the OpenAPI schema.
2. **Fallback**: Commit `schema.json` to
   `packages/sdks/oak-curriculum-sdk/schema-cache/bulk-schema.json`
   and add a refresh script.

### Phase 2: Schema-Driven Bulk Zod Generation

Replace the template-based generator (`schema-templates.ts`,
`schema-templates-part2.ts`, `schema-templates-part3.ts`) with a
generator that reads the bulk JSON schema and produces Zod schemas
directly.

**Key design decisions:**
- Walk the JSON Schema `$defs` and produce one Zod schema per definition
- Map `type: ["string", "null"]` to `z.string().nullable()`
- Map `enum` arrays to `z.enum([...])`
- Map `$ref` to schema references
- Preserve the NULL sentinel transform layer if the data still uses
  `"NULL"` strings (confirm with API team)
- Preserve `additionalProperties: false` → `.strict()`

**Acceptance criteria:**
- [ ] Generated Zod schemas match or exceed the validation of current templates
- [ ] All existing bulk ingestion tests pass without changes
- [ ] Enum values are validated at parse time (new capability)
- [ ] `pnpm type-gen` produces equivalent or better output

### Phase 3: Domain Enum Extraction

Extract the enum values from the bulk schema and make them available
as typed constants across the SDK:

- `SubjectSlug` — 21 values (replaces hardcoded `CANONICAL_SUBJECTS` + `KS4_SCIENCE_VARIANTS`)
- `KeyStageSlug` — 6 values
- `KeyStageTitle` — 6 values
- `YearSlug` — 15 values
- `ExamBoardSlug` — 6 values
- `UnitLessonState` — 3 values

**Impact:**
- `generate-subject-hierarchy.ts` reads from schema instead of hardcoded arrays
- Search filter validation uses schema-derived enums
- Bulk Zod schemas use `z.enum([...])` instead of `z.string()`
- MCP tool input validation can use the same enums

**Acceptance criteria:**
- [ ] Zero hardcoded domain enum values in the type-gen pipeline
- [ ] Subject hierarchy generator reads from bulk schema
- [ ] Search SDK filter validation uses schema-derived enums
- [ ] All quality gates pass

### Phase 4: Referential Integrity Validation

The bulk schema's `$comment` notes a TODO for cross-referencing
`unitLessons[].lessonSlug` against `lessons[].lessonSlug`. Add a
post-parse validation step in the ingestion pipeline.

**Acceptance criteria:**
- [ ] Published unit lessons reference existing lesson slugs
- [ ] Lesson unit slugs reference existing sequence unit slugs
- [ ] Violations produce clear, actionable error messages
- [ ] Does not block ingestion (warn, don't fail — data quality varies)

---

## Appendix: Field-by-Field Comparison

### Lesson Fields

| Field | API `LessonSummaryResponseSchema` | Bulk `lesson` | Delta |
|-------|----------------------------------|--------------|-------|
| `lessonTitle` | string, required | string, required | Same |
| `lessonSlug` | **absent** | string, required | **Bulk adds** |
| `unitSlug` | string, required | string, required | Same |
| `unitTitle` | string, required | string, required | Same |
| `subjectSlug` | string, required | string enum (21), required | **Bulk adds enum** |
| `subjectTitle` | string, required | string enum (21), required | **Bulk adds enum** |
| `keyStageSlug` | string, required | string enum (6), required | **Bulk adds enum** |
| `keyStageTitle` | string, required | string enum (6), required | **Bulk adds enum** |
| `lessonKeywords` | array, required | array, required | Same |
| `keyLearningPoints` | array, required | array, required | Same |
| `misconceptionsAndCommonMistakes` | array, required | array, required | Same |
| `pupilLessonOutcome` | string, optional | string, **required** | **Bulk strengthens** |
| `teacherTips` | array, required | array, required | Same |
| `contentGuidance` | anyOf [array, null], required | type ["array", "null"], required | Syntax differs, semantics same |
| `downloadsAvailable` | boolean, required | — | **Absent from bulk under this name** |
| `downloadsavailable` | — | boolean, required | **Bulk renames** (lowercase) |
| `supervisionLevel` | anyOf [string, null], required | type ["string", "null"], required | Syntax differs, semantics same |
| `transcript_sentences` | **absent** | type ["string", "null"], required | **Bulk adds** |
| `transcript_vtt` | **absent** | type ["string", "null"], required | **Bulk adds** |

### Unit Fields

| Field | API `UnitSummaryResponseSchema` | Bulk `unit` | Delta |
|-------|-------------------------------|------------|-------|
| `unitSlug` | string, required | string, required | Same |
| `unitTitle` | string, required | string, required | Same |
| `yearSlug` | string, required | string enum (15), required | **Bulk adds enum** |
| `year` | anyOf [number, string], required | integer, required | **Bulk simplifies** |
| `phaseSlug` | string, required | **absent** | **Bulk omits** (derivable from filename) |
| `subjectSlug` | string, required | **absent** | **Bulk omits** (derivable from filename) |
| `keyStageSlug` | string, required | string enum (6), required | **Bulk adds enum** |
| `notes` | string, optional | **absent** | **Bulk omits** |
| `description` | string, optional | string, **required** | **Bulk strengthens** |
| `priorKnowledgeRequirements` | array, required | array, required | Same |
| `nationalCurriculumContent` | array, required | array, required | Same |
| `whyThisWhyNow` | string, optional | string, **required** | **Bulk strengthens** |
| `threads` | array, optional | array, **required** | **Bulk strengthens** |
| `categories` | array, optional | **absent** | **Bulk omits** |
| `examBoards` | **absent** | array of examBoard, optional | **Bulk adds** |
| `unitLessons` | array, required | array, required | Same structure, different state enum |

### UnitLesson Fields

| Field | API | Bulk | Delta |
|-------|-----|------|-------|
| `lessonSlug` | string, required | string, required | Same |
| `lessonTitle` | string, required | string, required | Same |
| `lessonOrder` | number, optional | integer, **required** | **Bulk strengthens** |
| `state` | enum ["published", "new"], required | enum ["published", "new", **"migration"**], required | **Bulk adds value** |

### Thread, Keyword, Misconception, TeacherTip, ContentGuidanceItem

**Identical** between API and bulk (same fields, same types, same
required status). These are stable domain objects.
