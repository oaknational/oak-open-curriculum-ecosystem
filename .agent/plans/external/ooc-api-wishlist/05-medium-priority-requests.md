## Medium Priority – Parameter Richness

### 7. Add Parameter Examples

**Current state:**

```yaml
parameters:
  - name: keyStage
    in: query
    schema:
      type: string
      enum: [ks1, ks2, ks3, ks4]
      description: 'Key stage slug to filter by'
```

**Desired state:**

```yaml
parameters:
  - name: keyStage
    in: query
    schema:
      type: string
      enum: [ks1, ks2, ks3, ks4]
      description: "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"
    examples:
      ks1:
        value: 'ks1'
        summary: 'Key Stage 1 (ages 5-7, years 1-2)'
      ks2:
        value: 'ks2'
        summary: 'Key Stage 2 (ages 7-11, years 3-6)'
      ks3:
        value: 'ks3'
        summary: 'Key Stage 3 (ages 11-14, years 7-9)'
      ks4:
        value: 'ks4'
        summary: 'Key Stage 4 (ages 14-16, years 10-11)'
```

**Why:** Examples help AI models understand parameter semantics, especially educational terminology unfamiliar to general-purpose models.

**Benefits:**

- Clearer parameter meaning for international AI models
- Reduces invalid parameter values
- Provides age-range context for UK education system

**Applies to:** All enum parameters, especially educational domain terms (key stages, subjects, year groups).

**Enables**:

- **All layers**: Fewer invalid parameter errors (AI understands "ks2" vs "KS2" vs "key-stage-2")
- **Layer 3**: Semantic search uses correct age ranges for filtering
- **Layer 4**: Comparative analysis tools understand year group boundaries for progression tracking

---

### 8. Add Custom Schema Extensions for Tool Metadata

**What:** OpenAPI `x-oak-*` extensions providing tool-specific metadata.

**Examples:**

```yaml
/search/lessons:
  get:
    x-oak-metadata:
      category: 'discovery'
      use-cases: ['lesson-planning', 'resource-discovery']
      read-only: true
      typical-response-time-ms: 200
      result-stability: 'high'
      idempotent: true
```

```yaml
/lessons/{lesson}/summary:
  get:
    x-oak-canonical-url:
      template: 'https://www.thenational.academy/teachers/lessons/{lesson}'
      context: 'lesson'
      user-facing: true
```

```yaml
parameters:
  - name: subject
    x-oak-display-name: 'Subject'
    x-oak-category: 'curriculum-filter'
```

**Why:** Provides structured metadata that can flow to generated tool descriptors without hand-coding.

**Benefits:**

- Canonical URLs auto-generated in SDK
- Tool categorisation for better organisation
- Read-only hints for AI confirmation flows
- Performance expectations for AI planning

**Effort:** Low (add fields to existing schema); can be done incrementally.

**Enables**:

- **Layer 1**: Canonical URLs auto-generated (no hard-coding in SDK)
- **Layer 2**: Aggregated tools use metadata for routing decisions
- **Layer 4**: Advanced tools can optimise based on performance hints (batch slow operations, parallelise fast ones)

---

### 9. Add Behavioural Metadata for Tool Safety and Retry Logic

**What:** Custom OpenAPI extensions indicating tool behaviour characteristics for AI safety and orchestration.

**Examples:**

```yaml
/lessons/{lesson}/summary:
  get:
    x-oak-behavior:
      readOnly: true # Tool doesn't modify environment
      idempotent: true # Safe to call multiple times
      requiresConfirmation: false # Can execute without user approval
      retryable: true # Safe to retry on failure
```

```yaml
/lessons/{lesson}/assets:
  post:
    x-oak-behavior:
      readOnly: false # Modifies state
      idempotent: false # Each call has additional effect
      destructive: false # Additive, not destructive
      requiresConfirmation: true # Should prompt user before execution
      retryable: false # Don't auto-retry (may duplicate data)
```

**Behavioural Properties:**

- **`readOnly`** (boolean, default: `true` for GET, `false` for POST/PUT/DELETE/PATCH): Tool doesn't modify its environment. AI agents can call freely without confirmation.

- **`idempotent`** (boolean, default: `false`): Calling repeatedly with the same arguments has no additional effect. Safe to retry on network errors.

- **`destructive`** (boolean, default: `false` for additive operations): If `true`, may delete or overwrite existing data. Requires explicit user confirmation in most AI interfaces.

- **`requiresConfirmation`** (boolean, default: `false` for reads, `true` for writes): AI should prompt user before executing. Helps prevent unintended actions.

- **`retryable`** (boolean, default: `idempotent` value): Safe to automatically retry on transient failures.

**Why:** AI agents need to understand tool safety characteristics to make appropriate orchestration decisions. This metadata enables:

1. **Automatic Retry Logic**: Agents can safely retry idempotent operations without risk of duplication
2. **User Confirmation Flows**: Destructive operations can trigger confirmation prompts
3. **Parallel Execution**: Read-only tools can be safely parallelised
4. **Error Recovery**: Retryable operations can be automatically retried; non-retryable operations fail gracefully
5. **Security & Trust**: Clear labeling of write operations builds user confidence

**Benefits:**

- Safer AI agent behaviour (fewer accidental destructive actions)
- Better error handling and recovery
- More efficient orchestration (parallelise reads, serialise writes)
- Clearer API contract for all consumers

**Effort:** Low (add to existing endpoints); mechanical process once properties are defined.

**Applies to:** All endpoints, but especially important for POST/PUT/DELETE/PATCH operations.

**Enables**:

- **Layer 1**: Tools clearly labelled with safety characteristics
- **Layer 2**: Aggregated tools can implement smart retry logic
- **Layer 3**: Services distinguish safe operations from risky ones
- **Layer 4**:
  - `bulk-unit-summaries`: Can parallelise all requests (read-only, retryable)
  - `generate-lesson-plan`: Can retry failed fetches without duplication
  - Export tools: Can safely retry chunks without confirmation

**Industry Standards:** These properties align with:

- **MCP Specification**: `ToolAnnotations` interface (`readOnlyHint`, `idempotentHint`, `destructiveHint`)
- **OpenAI Apps SDK Guidelines**: "Mark any tool that changes external state as a write action. Read-only tools must be side-effect-free and safe to retry."
- **HTTP Semantics (RFC 9110)**: GET/HEAD are safe (read-only); PUT/DELETE are idempotent; POST is neither

**Current Workaround:** We infer behaviour from HTTP method (GET = read-only, POST = write), but this is imprecise. Explicit metadata would be more accurate.

**Example Use Case:**

A teacher asks: "Find 10 KS3 science lessons about cells and download the assets for each."

- **Without behavioural metadata**: AI agent downloads assets one by one, doesn't retry failures (risk of duplication), asks for confirmation before each download (10 prompts)
- **With behavioural metadata**: AI knows `get-lessons-assets` is read-only and retryable, so it parallelises requests, automatically retries failures, and doesn't prompt user (trusted read operation)

---

### 10. Enhance Thread Endpoints for Progression Analysis

**What:** Enrich thread endpoints with metadata about conceptual progression and cross-programme relationships.

**Current state:**

```typescript
GET / threads;
Response: [{ title: 'Number', slug: 'number' }]; // Minimal metadata

GET / threads / { threadSlug } / units;
Response: [{ unitTitle: '...', unitSlug: '...', unitOrder: 5 }]; // No progression context
```

**Desired state:**

```typescript
GET /threads

Response:
{
  "threads": [
    {
      "slug": "number",
      "title": "Number",
      "description": "Core number concepts from counting to surds",
      "subjectSlug": "maths",
      "keyStagesCovered": ["ks1", "ks2", "ks3", "ks4"],
      "unitCount": 118,
      "ageRange": "5-16",
      "conceptualProgression": "Concrete counting → Abstract mathematical concepts"
    },
    {
      "slug": "bq01-biology-what-are-living-things-and-what-are-they-made-of",
      "title": "BQ01 Biology: What are living things and what are they made of?",
      "description": "Progression from observable features to cellular/molecular biology",
      "subjectSlug": "science",
      "keyStagesCovered": ["ks1", "ks2", "ks3", "ks4"],
      "unitCount": 32,
      "ageRange": "5-16",
      "conceptualProgression": "Observable features → Systems → Molecular & cellular"
    }
  ]
}

GET /threads/{threadSlug}/units

Response:
{
  "threadSlug": "number",
  "threadTitle": "Number",
  "units": [
    {
      "unitSlug": "counting-recognising-and-comparing-numbers-0-10",
      "unitTitle": "Counting, recognising and comparing numbers 0-10",
      "unitOrder": 15,
      "keyStageSlug": "ks1",
      "year": 1,
      "conceptualLevel": "concrete",
      "prerequisiteUnits": [], // First in progression
      "nextUnits": [16, 19], // Unit orders that follow
      "appearsInProgrammes": ["maths-primary-ks1"]
    },
    {
      "unitSlug": "surds",
      "unitTitle": "Surds",
      "unitOrder": 8,
      "keyStageSlug": "ks4",
      "year": 11,
      "conceptualLevel": "abstract",
      "prerequisiteUnits": [1, 2, 7], // Earlier units in progression
      "nextUnits": [], // Terminal unit
      "appearsInProgrammes": ["maths-secondary-ks4-higher-aqa", "maths-secondary-ks4-higher-ocr"]
    }
  ]
}
```

**Additional enhancement: Thread filtering**

```typescript
GET /threads?subject=maths&keyStage=ks2
// Returns only threads relevant to KS2 maths

GET /threads?contains=unit-slug-here
// Returns threads containing a specific unit (reverse lookup)
```

**Why:** Threads are Oak's pedagogical backbone—they show how concepts build over time. Currently, thread endpoints provide minimal metadata, making it hard for AI tools to:

- Understand what a thread represents conceptually
- Identify prerequisites for a unit
- Trace progression pathways
- Compare coverage across programmes

**Benefits:**

- **Progression tracking**: AI can trace how "fractions" develop from Year 1 to Year 11
- **Prerequisite identification**: Find what students should know before a unit
- **Cross-key-stage continuity**: Support transitions (primary → secondary, KS3 → KS4)
- **Programme-agnostic planning**: Show conceptual coherence independent of exam board/tier
- **Gap analysis**: Identify missing units in a thread for specific contexts

**Impact:** **High for Layer 4 tools**. Threads enable the most sophisticated AI capabilities:

- `trace-concept-progression`: Show how ideas build across years
- `find-prerequisites`: Map prerequisite chains
- `compare-programme-paths`: Compare Foundation vs Higher progression
- `discover-curriculum-gaps`: Identify missing content

**Effort:** 2-3 days (metadata enhancement + filtering endpoints).

**Priority:** **Medium-High** - threads are crucial for pedagogical intelligence, but current endpoints are usable (just limited).

**Enables**:

- **Layer 4**: **CRITICAL FOR PROGRESSION TOOLS**
  - `find-units-by-thread`: Needs thread metadata to filter and present progression pathways
  - `trace-prior-knowledge`: Needs `prerequisiteUnits` to build dependency graphs
  - `compare-units`: Needs `conceptualLevel` and `unitOrder` to show progression differences
  - `analyse-nc-coverage`: Can map threads to NC statements for coherence checking
  - All recommendation tools benefit from understanding conceptual progression

**Example use case:**

Teacher: "Show me how fractions progress from Year 1 to Year 6"

**Current flow** (clunky):

1. Search for "fractions" → get mixed results
2. Try to manually order by year
3. No clear progression pathway

**With enhanced threads** (natural):

1. Query `/threads?subject=maths&contains=fraction`
2. Get `number` thread
3. Query `/threads/number/units`
4. Filter by `year` 1-6, `unitTitle` contains "fraction"
5. See clear progression with order, prerequisites, and next steps

---

## Medium Priority – Schema Validation & Type Safety

### 11. Standardise Parameter and Schema Types with `$ref`

**What:** Use OpenAPI `$ref` to define reusable parameter and schema components, ensuring type consistency across all endpoints.

**Current state:**

The same semantic concept has inconsistent types across the spec:

```yaml
# /sequences/{sequence}/units - year is STRING enum
parameters:
  - name: year
    schema:
      type: string
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"]

# /sequences/{sequence}/assets - year is NUMBER
parameters:
  - name: year
    schema:
      type: number

# Response schemas - MIXED
year:
  anyOf:
    - type: number
    - type: string
      enum: ["all-years"]
# OR
year:
  anyOf:
    - type: number
    - type: string  # Too broad!
```

**Problems:**

1. **Code generators produce inconsistent types** - TypeScript/Zod can't decide if `year` is `number | string` or `1 | 2 | ... | 11 | "all-years"`
2. **Runtime validation breaks** - A valid `year: 5` might fail validation on one endpoint but succeed on another
3. **Client confusion** - Should I send `5` or `"5"`?
4. **Maintenance nightmare** - Changing year representation requires hunting through the entire spec

**Desired state:**

Define reusable components:

```yaml
components:
  parameters:
    YearQueryParameter:
      name: year
      in: query
      description: "The year group to filter by. Accepts year numbers 1-11 or 'all-years' for content spanning multiple years."
      schema:
        $ref: '#/components/schemas/Year'
      examples:
        year3:
          value: 3
          summary: 'Year 3 (age 7-8)'
        allYears:
          value: 'all-years'
          summary: 'Content spanning multiple year groups'

  schemas:
    Year:
      oneOf:
        - type: integer
          minimum: 1
          maximum: 11
          description: 'Year group (1-11)'
        - type: string
          const: 'all-years'
          description: 'Content spanning multiple years'
```

Then reference consistently:

```yaml
# In path definitions
paths:
  /sequences/{sequence}/units:
    get:
      parameters:
        - $ref: '#/components/parameters/YearQueryParameter'

  /sequences/{sequence}/assets:
    get:
      parameters:
        - $ref: '#/components/parameters/YearQueryParameter'

# In response schemas
SequenceUnitsResponseSchema:
  properties:
    year:
      $ref: '#/components/schemas/Year'
```

**Other candidates for standardisation:**

- `keyStage`: Sometimes has description, sometimes doesn't, casing notes vary
- `subject`: Enum values identical across ~12 endpoints but duplicated
- `lessonSlug`, `unitSlug`, `sequenceSlug`: Pattern is `[a-z0-9-]+` but not documented
- `offset`, `limit`: Pagination params duplicated on every list endpoint

**Why:** Single source of truth for types → consistent codegen → fewer runtime errors.

**Benefits:**

- **Type-safe client generation**: Zod/TypeScript/etc. generate correct union types
- **DRY principle**: Define once, reference everywhere
- **Easier API evolution**: Change `Year` schema in one place, all endpoints update
- **Better validation**: Code generators can create proper validators
- **Self-documenting**: Clear that these are the same concept across endpoints

**Effort:** Low-Medium (mostly find-replace, but requires careful review)

**Enables**:

- **All layers**: Reliable type inference and validation
- **Layer 1**: Direct proxy tools use correct types in function signatures
- **Layer 2**: Aggregated tools can confidently pass parameters between endpoints
- **Layer 3/4**: Advanced tools can reason about parameter compatibility across endpoints

---

### 12. Expose Zod Validators for Perfect Type Fidelity

**Current state:**

The API maintains rich, hand-written Zod schemas internally using `zod-openapi/extend`:

```typescript
// reference/oak-openapi/src/lib/handlers/sequences/types.ts
import { z } from 'zod';
import 'zod-openapi/extend';

const categorySchema = z.object({
  categoryTitle: z.string().openapi({ description: 'The title of the category' }),
  categorySlug: z.string().optional().openapi({
    description: 'The unique identifier for the category',
  }),
});
```

These schemas:

- Define request/response validation
- Include field descriptions and examples
- Power the tRPC procedures
- Generate the OpenAPI specification via `trpc-to-openapi`

**The duplication problem:**

Currently, consuming applications:

1. Fetch the generated OpenAPI JSON
2. Re-generate Zod schemas from OpenAPI
3. Use those schemas for validation

**This creates**:

- Round-trip conversion losses (Zod → OpenAPI → Zod)
- Potential type fidelity issues (nullable handling, discriminated unions)
- Duplicated maintenance effort
- Version synchronisation challenges

**Desired state (Option A): Export as npm package**

```typescript
// API repo publishes:
// @oaknational/curriculum-api-schemas

{
  "name": "@oaknational/curriculum-api-schemas",
  "version": "1.0.0",
  "exports": {
    "./lesson": "./dist/handlers/lesson/schemas/index.js",
    "./units": "./dist/handlers/units/schemas/index.js",
    "./sequences": "./dist/handlers/sequences/schemas/index.js",
    "./subjects": "./dist/handlers/subjects/schemas/index.js",
    // ... all schemas
  }
}
```

```typescript
// Consuming applications use directly:
import {
  lessonSummaryRequestSchema,
  lessonSummaryResponseSchema,
} from '@oaknational/curriculum-api-schemas/lesson';

// Perfect type fidelity, no round-trip conversion
const validatedData = lessonSummaryResponseSchema.parse(apiResponse);
```

**Desired state (Option B): Expose via API endpoint**

```typescript
GET /api/v0/schemas/{schemaName}

// Returns the Zod schema as JSON Schema or TypeScript code
{
  "schemaName": "LessonSummaryResponse",
  "zodSchema": "z.object({ lessonTitle: z.string(), ... })",
  "jsonSchema": { "type": "object", "properties": { ... } },
  "typescript": "export interface LessonSummaryResponse { ... }"
}
```

Or even simpler:

```typescript
GET /api/v0/schemas

// Returns all schemas as a bundle
{
  "version": "1.0.0",
  "schemas": {
    "LessonSummaryRequest": { zodSchema: "...", jsonSchema: {...} },
    "LessonSummaryResponse": { zodSchema: "...", jsonSchema: {...} },
    // ... all schemas
  }
}
```

**Why this matters:**

1. **Perfect Type Fidelity**: No round-trip conversion means no data loss
2. **Single Source of Truth**: API's internal schemas ARE the public schemas
3. **Better DX**: Consuming apps get exact validation that API uses
4. **Reduced Duplication**: Stop regenerating what already exists
5. **Version Alignment**: Schema version matches API version automatically
6. **Better Error Messages**: Zod's validation errors are more helpful than OpenAPI validation errors

**Benefits for API team:**

- Schemas already exist (minimal additional work)
- Forces good schema maintenance (public-facing)
- Better API contract clarity
- Enables type-safe client libraries

**Benefits for all consumers:**

- Type-safe SDKs without code generation
- Runtime validation with excellent error messages
- Perfect alignment with API behaviour
- Easier integration testing

**Implementation options:**

**Option A (npm package):**

- **Pros**: Standard distribution method, versioned, npm ecosystem
- **Cons**: Requires package maintenance, breaking change management
- **Effort**: 1-2 days initial setup + ongoing maintenance

**Option B (API endpoint):**

- **Pros**: Always in sync with API, no separate publishing, simpler versioning
- **Cons**: Non-standard, requires schema serialisation, runtime fetching
- **Effort**: 2-3 days (endpoint creation + serialisation logic)

**Option C (Hybrid):**

- Expose via API endpoint for discovery/debugging
- Also publish as npm package for production use
- **Pros**: Best of both worlds
- **Effort**: Combined effort of both approaches

**Recommendation**: Option A (npm package) with Option B as future enhancement

**Priority**: Medium-High (solves real duplication problem, benefits all consumers)

**Enables**:

- **All layers**: Perfect type safety from API through to AI tools
- **Layer 1**: Generated tools use exact API validation logic
- **SDKs**: Type-safe client libraries without code generation step
- **Testing**: Consuming apps can validate test fixtures against API schemas

**Example use case:**

Current workflow:

```typescript
// 1. Fetch OpenAPI spec
// 2. Run type-gen to regenerate Zod schemas
// 3. Use generated schemas
import { lessonSummaryResponseSchema } from './generated/schemas';
```

With exposed schemas:

```typescript
// Just import and use
import { lessonSummaryResponseSchema } from '@oaknational/curriculum-api-schemas/lesson';
```

---

