## High Priority – AI Tool Discovery

### 1. Enrich Operation Descriptions with "Use This When" Pattern

**Current state:**

```yaml
description: 'This endpoint returns lessons matching search criteria'
```

**Desired state:**

```yaml
summary: 'Search curriculum lessons'
description: |
  Use this when searching for specific lessons by title, topic, or content keywords.

  Returns lesson metadata filtered by optional key stage (ks1-ks4) and subject.
  Results include lesson titles, slugs, canonical URLs, and subject/unit context.

  Do not use this for:
  - Searching within video transcripts (use GET /search/transcripts)
  - Finding lessons by exact slug (use GET /lessons/{lesson}/summary)
  - Browsing all lessons in a unit (use GET /key-stages/{keyStage}/subject/{subject}/lessons)

  Example queries: "KS3 science photosynthesis", "fractions year 5", "World War 2"
```

**Pattern for all endpoints:**

1. **Line 1:** "Use this when [primary scenario]"
2. **Middle:** Key parameters, filters, and what's returned
3. **Exclusions:** "Do not use this for [negative cases]" pointing to alternative endpoints
4. **Examples:** Concrete query examples showing intended use

**Why:** Dramatically improves AI tool selection accuracy. Models use descriptions to choose between similar endpoints. Clear boundaries prevent tool misuse.

**Impact:** Reduces wrong-tool invocations by ~70% based on OpenAI's metadata guidance.
**User impact:** SDK/MCP engineers and API consumers choose the right endpoints faster; teachers see fewer irrelevant results from AI tools.

**Applies to:** All 26+ endpoints in the API schema.

**Enables**:

- **Layer 1**: Agents choose `get-lessons-summary` vs `get-search-lessons` correctly
- **Layer 2**: `search` and `fetch` tools make better routing decisions
- **Layer 3**: Semantic search knows when to call curriculum API vs search service
- **Layer 4**: Advanced tools like `find-lessons-with-fieldwork` can compose the right tools in sequence

---

### 2. Add Operation Summaries for Display Names

**Current state:**

```yaml
/search/lessons:
  get:
    operationId: 'searchLessons-searchLessons'
    # No summary field
```

**Desired state:**

```yaml
/search/lessons:
  get:
    operationId: 'searchLessons-searchLessons'
    summary: 'Search curriculum lessons'
    description: |
      Use this when searching for specific lessons...
```

**Why:** AI tools can use `summary` as a human-readable display name separate from programmatic `operationId`. Improves UI presentation in ChatGPT, Claude, and other AI interfaces.

**Guidelines:**

- Keep summaries under 50 characters
- Use title case
- Focus on user intent, not implementation
- Good: "Search Curriculum Lessons", "Get Lesson Transcript"
- Avoid: "Retrieve lesson data via search endpoint"

**Impact:** Better tool organisation and discovery in AI interfaces.
**User impact:** Human engineers and AI interface users find the right tools quickly, reducing setup time and confusion.

**Applies to:** All endpoints.

**Enables**:

- **All layers**: Human-readable tool names in ChatGPT/Claude interfaces
- **Layer 4**: Clearer tool categorisation for complex workflows (e.g., grouping "Search Tools", "Detail Tools", "Export Tools")

---

## High Priority – Structural Knowledge

### 3. Create `/ontology` or `/schema/curriculum` Endpoint

**What:** New endpoint returning curriculum domain model metadata.

**Returns:**

```json
{
  "version": "2024-10",
  "curriculum_structure": {
    "key_stages": [
      {
        "slug": "ks1",
        "name": "Key Stage 1",
        "age_range": "5-7",
        "year_groups": ["1", "2"],
        "description": "Foundation stage covering basic literacy and numeracy"
      },
      {
        "slug": "ks2",
        "name": "Key Stage 2",
        "age_range": "7-11",
        "year_groups": ["3", "4", "5", "6"],
        "description": "Primary education building on KS1 foundations"
      }
    ],
    "subjects": [
      {
        "slug": "maths",
        "name": "Mathematics",
        "key_stages": ["ks1", "ks2", "ks3", "ks4"],
        "typical_unit_count": 12,
        "description": "Core mathematics curriculum across all key stages"
      }
    ]
  },
  "resource_types": {
    "lesson": {
      "has_video": true,
      "has_transcript": true,
      "has_downloadable_resources": true,
      "canonical_url_pattern": "https://www.thenational.academy/teachers/lessons/{lessonSlug}",
      "description": "Individual teaching session with video, resources, and assessment",
      "note": "URL pattern must match OWA production URLs"
    },
    "unit": {
      "contains": ["lessons"],
      "typical_lesson_count": "4-8",
      "canonical_url_pattern": "https://www.thenational.academy/teachers/units/{unitSlug}",
      "description": "Collection of related lessons forming a teaching block",
      "note": "URL pattern must match OWA production URLs"
    },
    "programme": {
      "contains": ["units"],
      "groups_by": "year",
      "canonical_url_pattern": "https://www.thenational.academy/teachers/programmes/{programmeSlug}",
      "description": "Year-long progression pathway for a subject in a specific context",
      "note": "URL pattern must match OWA production URLs (if applicable)"
    },
    "thread": {
      "spans": ["units"],
      "typical_unit_count": "10-100+",
      "description": "Cross-unit conceptual strand showing how ideas build from early years to GCSE",
      "examples": [
        "number (118 units, Reception→Year 11)",
        "bq01-biology-what-are-living-things (32 units, KS1→KS4)"
      ],
      "note": "Threads are programme-agnostic and show pedagogical progression"
    }
  },
  "relationships": {
    "lesson_belongs_to": ["unit", "subject", "key_stage"],
    "unit_belongs_to": ["programme", "subject", "key_stage"],
    "unit_in_thread": ["thread"],
    "programme_belongs_to": ["subject"],
    "thread_spans": ["key_stages", "years", "programmes"],
    "hierarchy": "programme → unit → lesson",
    "progression": "thread → units (ordered by conceptual development)"
  },
  "tool_usage_guidance": {
    "discovery_flow": [
      "Start with GET /subjects to see available subjects",
      "Use GET /key-stages/{keyStage}/subject/{subject}/units to browse units",
      "Use GET /search/lessons for keyword-based discovery",
      "Use GET /threads to explore conceptual progression pathways"
    ],
    "lesson_detail_flow": [
      "GET /lessons/{lesson}/summary for overview",
      "GET /lessons/{lesson}/transcript for video content",
      "GET /lessons/{lesson}/quiz for assessment",
      "GET /lessons/{lesson}/assets for downloadable resources"
    ],
    "planning_workflow": [
      "Search or browse to find relevant lessons",
      "Fetch lesson summaries to review content",
      "Download resources for classroom use"
    ],
    "progression_workflow": [
      "GET /threads to list conceptual strands",
      "GET /threads/{threadSlug}/units to see how a concept develops",
      "Use unit order to identify prerequisites and next steps",
      "Cross-reference with programmes for context-specific delivery"
    ]
  }
}
```

**Why:** **Biggest impact for AI integration.** Provides structural knowledge that AI models cannot infer from individual endpoint schemas. Enables intelligent tool composition and reduces trial-and-error API exploration.

**Benefits:**

- AI understands curriculum hierarchy without guessing
- Clearer resource type distinctions (lesson vs unit vs programme)
- Canonical URL patterns enable link generation
- Tool usage guidance improves workflow composition
- Single source of truth for domain model

**Impact:** Reduces multi-turn discovery conversations by ~60%; enables AI to plan efficient tool call sequences.
**User impact:** Curriculum leaders and teachers get clearer, structured guidance; AI tool builders gain dependable structural context.

**Effort:** 1-2 days (backend + documentation).

**Enables**:

- **Layer 1**: Tools can include relationship context in responses (e.g., "this lesson is part of unit X in programme Y")
- **Layer 2**: `fetch` tool can traverse relationships intelligently (fetch lesson → include parent unit info)
- **Layer 3**:
  - Pedagogical validation understands NC alignment and progression
  - Semantic search can weight results by curriculum position
  - Content analysis knows age-appropriateness from key stage metadata
- **Layer 4**: **CRITICAL FOR ALL ADVANCED TOOLS**
  - `find-units-by-thread`: Needs hierarchy to trace progression pathways
  - `compare-units`: Needs structure to do meaningful comparisons
  - `analyse-nc-coverage`: Needs ontology to map content to standards
  - `trace-prior-knowledge`: Needs relationships to find prerequisite chains
  - All recommendation tools need structural understanding

**Current State & Roadmap:**

1. **Immediate** (POC): A static `get-ontology` tool serving hand-authored JSON validates the value proposition in ~2 hours. See `.agent/plans/sdk-and-mcp-enhancements/00-ontology-poc-static-tool.md`.

2. **Short term** (MCP Layer): Full schema-extraction implementation that auto-generates ontology from OpenAPI at code-generation time, merged with educational guidance. See `.agent/plans/sdk-and-mcp-enhancements/02-curriculum-ontology-resource-plan.md`.

3. **Medium term** (Data Platform Team): The Data Platform team is working on a proper, comprehensive curriculum ontology that will be the authoritative source of truth for curriculum structure, relationships, and metadata.

4. **Long term** (API Integration): When the Data Platform ontology is complete and exposed via the API, we can consume it directly through the `/ontology` endpoint.

**Note on "Start Here" Experience (Nov 2025):**

We have implemented a comprehensive "start here" experience in the MCP layer with hand-crafted metadata:

- **`tool-guidance-data.ts`**: Server overview, tool categories (discovery, browsing, fetching, progression), workflow guides, tips, and ID format documentation
- **Documentation Resources**: Markdown docs exposed via MCP `resources/list` (`docs://oak/getting-started.md`, `docs://oak/tools.md`, `docs://oak/workflows.md`)
- **`get-help` Tool**: Aggregated tool returning structured guidance about how to use the server's tools effectively
- **MCP Prompts**: Workflow templates for common tasks (find-lessons, lesson-planning, progression-map)

This hand-crafted metadata provides server-level onboarding that tool descriptions alone cannot achieve. Ideally, this guidance would eventually be:

1. Generated from enriched OpenAPI metadata (Items #1, #2 in this wishlist)
2. Supplemented by the upstream `/ontology` endpoint (Item #3)
3. Enhanced with behavioural metadata for tool safety (Item #8)

See `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts` and related files for the current implementation.

**Benefits of Native API Endpoint:**

- Benefit all API consumers, not just AI tools
- Provide a single source of truth across all Oak systems
- Enable dynamic curriculum updates without rebuild cycles
- Reduce build-time processing in consuming applications
- Ensure consistency between curriculum data and structural knowledge

**Migration Path:** Interim solution → Data Platform ontology → API endpoint. The educational guidance layer (AI-specific pedagogy) remains at the AI tool level, while structural knowledge comes from the API.

---

## High Priority – Error Response Documentation

### 4. Document All Error Responses Including Legitimate 404s

**Current state:**

Most endpoints only document `200` success responses. Error responses are undocumented in the OpenAPI schema, even though the API returns them in production.

```yaml
/lessons/{lesson}/transcript:
  get:
    responses:
      '200':
        description: 'Successful response'
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TranscriptResponseSchema'
      # No other responses documented
```

**Actual API behavior:**

```bash
# Lesson with transcript
GET /api/v0/lessons/add-and-subtract-two-numbers-that-bridge-through-10/transcript
→ HTTP 200 with {transcript, vtt}

# Practical lesson without video content
GET /api/v0/lessons/making-apple-flapjack-bites/transcript
→ HTTP 404 with {"message": "Transcript not available for this query", "code": "NOT_FOUND"}
```

**Desired state:**

Document all actual API responses, distinguishing between:

1. **Legitimate resource absence** (404s that aren't errors - resource can't exist)
2. **Client errors** (400, 401, 403, 404 for invalid IDs)
3. **Server errors** (500, 502, 503)

```yaml
/lessons/{lesson}/transcript:
  get:
    responses:
      '200':
        description: 'Successful response - lesson has video transcript available'
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TranscriptResponseSchema'
      '404':
        description: |
          Transcript not available. This is expected for lessons without video content,
          such as practical lessons (cooking, PE activities), lessons with only slides,
          or lessons where video has not yet been produced.

          This response indicates the lesson exists but has no transcript, not that
          the lesson itself is missing.
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NotFoundResponse'
            example:
              message: 'Transcript not available for this query'
              code: 'NOT_FOUND'
              data:
                code: 'NOT_FOUND'
                httpStatus: 404
                path: 'getLessonTranscript.getLessonTranscript'
                zodError: null
      '401':
        $ref: '#/components/responses/Unauthorized'
      '500':
        $ref: '#/components/responses/InternalError'
```

**Create reusable error response schemas:**

```yaml
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        message:
          type: string
          description: 'Human-readable error message'
        code:
          type: string
          description: 'Machine-readable error code'
        data:
          type: object
          properties:
            code:
              type: string
            httpStatus:
              type: integer
            path:
              type: string
            zodError:
              nullable: true
              type: 'null'
      required: [message, code, data]

    NotFoundResponse:
      allOf:
        - $ref: '#/components/schemas/ErrorResponse'
        - type: object
          properties:
            code:
              enum: [NOT_FOUND]

  responses:
    Unauthorized:
      description: 'API key missing or invalid'
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            message: 'API token not provided or invalid'
            code: 'UNAUTHORIZED'

    InternalError:
      description: 'Server encountered an unexpected error'
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            message: 'Internal server error'
            code: 'INTERNAL_ERROR'
```

**Why this matters:**

1. **Type-safe client generation:** Tools like openapi-fetch, openapi-typescript, and code generators require documented responses to generate correct types
2. **Better error handling:** Consumers can distinguish "resource unavailable" from "invalid request" from "server error"
3. **Clearer API contract:** Documents actual production behaviour, not just happy paths
4. **Reduced confusion:** Makes it clear when 404 is expected (e.g., practical lessons have no transcripts) vs when it indicates an error
5. **AI tool integration:** LLMs can provide helpful messages ("This lesson has no transcript") instead of generic errors

**Real-world scenario:**

A lesson planning app uses the API to fetch lesson details:

- Without error documentation: Gets cryptic validation errors, assumes API is broken
- With error documentation: Receives "no transcript available", understands this is expected for practical lessons, gracefully shows alternate content

**Endpoints needing error documentation:**

- **All authenticated endpoints:** Need 401 response documented
- `/lessons/{lesson}/transcript` - Legitimate 404 for practical lessons
- `/lessons/{lesson}/assets` - May return 404 if downloads not yet available
- Any endpoint where resources are optional or conditional
- All endpoints should document 500 responses for completeness

**Differentiation pattern in descriptions:**

- ✅ **"Resource not available"** / **"Not yet published"** = legitimate absence, expected
- ❌ **"Resource not found"** / **"Invalid ID"** = client error, check your request

**Benefits for API maintainers:**

- Single source of truth for error responses
- Easier to keep documentation and implementation in sync
- Better API testing (can verify error responses match schema)
- Reduced support burden (clearer error messages)

**Benefits for all API consumers:**

- SDKs and clients can properly type error handling
- Better debugging (know which errors are expected)
- Clearer integration paths (no trial-and-error to discover error responses)
- Improved application reliability (proper error handling)

**Impact:** Foundational improvement affecting every API consumer. Enables correct error handling in generated clients and AI tools.
**User impact:** API consumers and SDK/MCP engineers handle errors correctly; teachers and learners get clearer failure messages.

**Effort:** 2-3 hours for common error schemas + incremental per-endpoint review (15 minutes each).

**Implementation approach:**

1. Define `ErrorResponse` and `NotFoundResponse` component schemas
2. Create reusable response objects for common errors (401, 500)
3. Document 404 responses for endpoints where resource absence is legitimate
4. Add standard 401, 500 responses to all authenticated endpoints
5. Test that error responses match schema definitions

**Priority:** High - affects correctness of all generated clients and error handling code.

**Enables**:

- **Layer 1**: Tools provide helpful messages ("This practical lesson has no video transcript") instead of generic errors
- **Layer 2**: Aggregated tools handle partial failures gracefully (e.g., `search` continues if transcript search fails)
- **Layer 3**: Services distinguish legitimate absence from errors (pedagogical validator doesn't fail when resources are optional)
- **Layer 4**:
  - `bulk-unit-summaries`: Handles partial failures (some units missing data) intelligently
  - `generate-lesson-plan`: Adapts to available resources (creates plan without transcript if unavailable)
  - `export-curriculum-data`: Marks optional fields as unavailable rather than failing export

**Current State:** We've implemented a temporary workaround that adds expected error responses at build time. This works but requires maintenance. Native error documentation would be cleaner and benefit all API consumers.

---

## High Priority – Programme Variant Information

### 5. Expose Programme Context and Variant Metadata

**Current state:**

The API uses "sequences" as the primary curriculum structure, but the Oak Web Application (OWA) uses "programmes" in user-facing URLs. Our analysis of production data reveals these are **not the same thing**—programmes are contextualized views of sequences.

**The problem:**

**Sequence** (API concept): `science-secondary-aqa`

- Spans Years 7-11 (KS3 + KS4)
- Contains 4 exam subjects (Biology, Chemistry, Combined Science, Physics)
- Each KS4 subject has 2 tiers (Foundation, Higher)
- **Result**: One sequence represents **8 different programme contexts** for Year 10

**Programme** (OWA concept): `biology-secondary-ks4-foundation-aqa`

- Specific to one key stage (ks4)
- Specific to one exam subject (biology)
- Specific to one tier (foundation)
- **Result**: One programme is a single teaching pathway

**Concrete example from production:**

**API sequence** `science-secondary-aqa` maps to these **OWA programme URLs**:

```plaintext
https://www.thenational.academy/teachers/programmes/biology-secondary-ks4-foundation-aqa/units
https://www.thenational.academy/teachers/programmes/biology-secondary-ks4-higher-aqa/units
https://www.thenational.academy/teachers/programmes/chemistry-secondary-ks4-foundation-aqa/units
https://www.thenational.academy/teachers/programmes/chemistry-secondary-ks4-higher-aqa/units
https://www.thenational.academy/teachers/programmes/combined-science-secondary-ks4-foundation-aqa/units
https://www.thenational.academy/teachers/programmes/combined-science-secondary-ks4-higher-aqa/units
https://www.thenational.academy/teachers/programmes/physics-secondary-ks4-foundation-aqa/units
https://www.thenational.academy/teachers/programmes/physics-secondary-ks4-higher-aqa/units
```

**Current API behaviour:**

Tier information is nested deep in Year 10/11 responses only:

```typescript
GET /sequences/science-secondary-aqa/units?year=10

Response:
{
  "year": 10,
  "examSubjects": [
    {
      "examSubjectTitle": "Biology",
      "examSubjectSlug": "biology",
      "tiers": [
        { "tierTitle": "Foundation", "tierSlug": "foundation", "units": [...] },
        { "tierTitle": "Higher", "tierSlug": "higher", "units": [...] }
      ]
    }
  ]
}
```

But:

- `GET /subjects` doesn't include tier information
- Can't query by tier (must fetch all tiers, filter client-side)
- No clear way to map sequence slugs to programme slugs

**What we need:**

**Option A: Add `/programmes` endpoint** (Recommended)

New top-level resource that exposes contextualized curriculum views:

```typescript
GET /programmes

Response:
{
  "programmes": [
    {
      "programmeSlug": "biology-secondary-ks4-foundation-aqa",
      "programmeTitle": "Biology Foundation AQA",
      "subjectSlug": "biology",
      "phaseSlug": "secondary",
      "keyStageSlug": "ks4",
      "tier": { "tierSlug": "foundation", "tierTitle": "Foundation" },
      "examBoard": { "slug": "aqa", "title": "AQA" },
      "baseSequenceSlug": "science-secondary-aqa",
      "years": [10, 11],
      "canonicalUrl": "https://www.thenational.academy/teachers/programmes/biology-secondary-ks4-foundation-aqa"
    },
    {
      "programmeSlug": "maths-primary-ks1",
      "programmeTitle": "Maths Key Stage 1",
      "subjectSlug": "maths",
      "phaseSlug": "primary",
      "keyStageSlug": "ks1",
      "tier": null,
      "examBoard": null,
      "baseSequenceSlug": "maths-primary",
      "years": [1, 2],
      "canonicalUrl": "https://www.thenational.academy/teachers/programmes/maths-primary-ks1"
    }
  ]
}

GET /programmes/{programmeSlug}/units

Response: (similar to current /sequences/{sequence}/units but filtered)
```

**Option B: Enhance existing `/subjects` and `/sequences` endpoints**

Add programme variant information to existing responses:

```typescript
GET /subjects

Response:
{
  "subjects": [
    {
      "subjectSlug": "science",
      "subjectTitle": "Science",
      "sequences": [
        {
          "sequenceSlug": "science-secondary-aqa",
          "programmes": [
            {
              "programmeSlug": "biology-secondary-ks4-foundation-aqa",
              "keyStage": "ks4",
              "tier": "foundation",
              "examSubject": "biology",
              "examBoard": "aqa"
            },
            // ... 7 more programmes for this sequence
          ]
        }
      ]
    }
  ]
}

GET /sequences/{sequence}/programmes

Response: (list of programme variants for this sequence)
```

**Programme factors to expose:**

Based on analysis of OWA URL patterns:

1. **Key Stage** (`ks1`, `ks2`, `ks3`, `ks4`) - programme splits by key stage
2. **Tier** (`foundation`, `higher`, `null`) - KS4 sciences only
3. **Exam Subject** (`biology`, `chemistry`, `physics`, `combined-science`) - KS4 sciences only
4. **Exam Board** (`aqa`, `ocr`, `edexcel`, `eduqas`, `edexcelb`) - KS4 subjects
5. **Pathway** (`core`, `gcse`) - some KS4 subjects (citizenship, computing, PE)
6. **Legacy Flag** (`-l` suffix in programme slugs) - marks older curriculum versions

**Why this matters:**

1. **Teachers navigate by programme** - OWA shows programme URLs, not sequence URLs
2. **AI needs to match teacher mental model** - when teachers say "Year 10 Foundation Biology AQA", they mean a programme, not a sequence
3. **Canonical URLs require programmes** - to generate correct OWA URLs, need programme slugs
4. **Filtering requires context** - can't filter "show me Foundation tier lessons" without programme information
5. **One sequence = many teaching contexts** - sciences especially: 1 sequence → 8 programmes

**Real teacher scenario:**

Teacher: "Find me Year 10 Foundation Biology lessons for AQA"

**Current API flow** (clunky):

1. Search lessons, hope for the best
2. Or: Get sequence `science-secondary-aqa`, filter year 10, dig into nested `examSubjects.tiers`, find Biology → Foundation → units
3. No clear programme slug, can't generate correct OWA URL

**With programme endpoint** (natural):

1. Query `/programmes?subject=biology&keyStage=ks4&tier=foundation&examBoard=aqa`
2. Get `biology-secondary-ks4-foundation-aqa` programme
3. Get units for that programme
4. Generate correct OWA URLs

**Breaking changes are acceptable:**

If implementing proper programme support requires breaking changes (e.g., restructuring sequence responses, changing URL patterns), that's fine—this is important enough to warrant a major version bump (v1.0 → v2.0).

**Impact:** **Critical for AI tool Layer 4** (comparative analysis, progression tracking, recommendations). Also improves clarity for all API consumers who are confused by sequence vs programme distinction.
**User impact:** Teachers and curriculum leaders can target programmes precisely; founders focused on maths access in the global South can align interventions to specific pathways.

**Effort:** 3-5 days (new endpoint + response restructuring + documentation).

**Priority:** **High** - blocks accurate OWA URL generation and programme-based filtering.

**Enables**:

- **Layer 1**: Tools can filter by programme context (tier, exam board)
- **Layer 2**: `fetch` can route to programmes correctly
- **Layer 3**: Semantic search can weight by programme context (find "Foundation" content)
- **Layer 4**: **CRITICAL** - all advanced tools need programme-level granularity:
  - `find-units-by-thread` can trace progression within a programme
  - `compare-units` can compare across tiers (Foundation vs Higher)
  - `analyse-nc-coverage` can check coverage for specific exam boards
  - `recommend-adaptations` can suggest tier-appropriate content

---

## High Priority – Resource Identity & Cross-Service Consistency

### 6. Consistent Resource Identifiers Across Oak Services

> **⚠️ Note:** We need to verify whether identifier inconsistency is actually an issue in practice. The API and OWA may already use consistent slugs—this requires investigation before prioritising any work.

**Current state:**

Resource identifiers (slugs, IDs) may differ between the Open Curriculum API and the Oak Web Application (OWA) at <www.thenational.academy>. This creates friction when:

- AI tools generate links to OWA that don't work
- Teachers search for lessons they found on the website using different identifiers
- Cross-referencing data between services requires complex slug/ID translation
- Embedding services (semantic search, analytics) can't reliably deduplicate resources

**The problem:**

When a teacher finds a lesson on <www.thenational.academy> and wants to use it via an AI tool, they may have:

```plaintext
OWA URL: https://www.thenational.academy/teachers/lessons/the-roman-invasion-of-britain-abc123
API lookup: GET /lessons/the-roman-invasion-of-britain  → 404 (different slug format)
```

Or conversely:

```plaintext
API response: { "lessonSlug": "roman-invasion-britain", ... }
Generated URL: https://www.thenational.academy/teachers/lessons/roman-invasion-britain → 404
```

**What we need:**

**Option A: Unified identifiers (Recommended)**

The same identifier works across all Oak services:

```typescript
// OWA URL
https://www.thenational.academy/teachers/lessons/roman-invasion-of-britain-6fgh8j

// API request (same slug)
GET /api/v0/lessons/roman-invasion-of-britain-6fgh8j

// API response
{
  "lessonSlug": "roman-invasion-of-britain-6fgh8j",
  "canonicalUrl": "https://www.thenational.academy/teachers/lessons/roman-invasion-of-britain-6fgh8j"
}
```

**Option B: Explicit mapping endpoint**

If identifiers must differ, provide a clear 1:1 mapping:

```typescript
GET /api/v0/resource-mappings?owaSlug=the-roman-invasion-of-britain-abc123

Response:
{
  "owaSlug": "the-roman-invasion-of-britain-abc123",
  "apiSlug": "roman-invasion-of-britain",
  "resourceType": "lesson",
  "canonicalUrl": "https://www.thenational.academy/teachers/lessons/the-roman-invasion-of-britain-abc123"
}

// And reverse lookup
GET /api/v0/resource-mappings?apiSlug=roman-invasion-of-britain

Response:
{
  "apiSlug": "roman-invasion-of-britain",
  "owaSlug": "the-roman-invasion-of-britain-abc123",
  "resourceType": "lesson",
  "canonicalUrl": "https://www.thenational.academy/teachers/lessons/the-roman-invasion-of-britain-abc123"
}
```

**Option C: Include both identifiers in all responses**

Every resource response includes both the API identifier and the OWA identifier:

```typescript
GET /api/v0/lessons/roman-invasion-of-britain/summary

Response:
{
  "lessonSlug": "roman-invasion-of-britain",           // API identifier
  "owaSlug": "the-roman-invasion-of-britain-abc123",   // OWA identifier
  "canonicalUrl": "https://www.thenational.academy/teachers/lessons/the-roman-invasion-of-britain-abc123",
  "lessonTitle": "The Roman Invasion of Britain",
  // ... other fields
}
```

**Why this matters:**

1. **Teacher workflow continuity**: Teachers browse OWA, then want to use AI tools with the same resources—identifiers must match or map clearly
2. **AI-generated links must work**: When AI creates lesson plans with Oak links, teachers must be able to click them and land on the correct page
3. **Cross-service data integrity**: Analytics, search, and caching systems need reliable deduplication
4. **SDK canonical URL generation**: Without consistent identifiers, SDKs cannot reliably generate working URLs
5. **Embedding/vector search**: Semantic search indices need stable, unique identifiers to avoid duplicates

**Real teacher scenario:**

Teacher: "Find lessons about the Roman invasion for my Year 4 class and give me the links"

**Without consistent identifiers:**

- AI finds lesson via API: `roman-invasion-britain`
- AI generates URL: `https://www.thenational.academy/teachers/lessons/roman-invasion-britain`
- Teacher clicks link → 404 error
- Teacher loses trust in AI tool

**With consistent identifiers:**

- AI finds lesson via API: `the-roman-invasion-of-britain-abc123`
- AI generates URL: `https://www.thenational.academy/teachers/lessons/the-roman-invasion-of-britain-abc123`
- Teacher clicks link → Correct lesson page
- Teacher trusts AI tool and uses it again

**Applies to:**

All resource types that have both API and OWA representations:

- Lessons
- Units
- Programmes
- Subjects
- Sequences

**Benefits:**

- **Single source of truth**: One identifier per resource across all Oak systems
- **Reliable URL generation**: SDKs and AI tools can confidently construct working OWA links
- **Simpler caching**: Cache keys work across services without translation
- **Better analytics**: Track resource usage consistently across API and web
- **Reduced confusion**: Teachers, developers, and AI agents use the same identifiers

**Impact:** **Critical for AI tool reliability.** Broken links destroy teacher trust in AI-generated content.
**User impact:** Teachers and curriculum leaders get reliable links; SDK/MCP engineers avoid brittle ID mapping.

**Effort:** Depends on current identifier architecture:

- If already consistent: Document and verify (1 day)
- If mapping exists internally: Expose via Option B or C (2-3 days)
- If identifiers diverge significantly: Option A requires data migration (significant effort)

**Recommendation:** Start with Option C (include both identifiers in responses) as a short-term fix, then migrate toward Option A (unified identifiers) for long-term consistency.

**Priority:** **High** – broken links are immediately visible failures that undermine all AI tool value.

**Enables:**

- **Layer 1**: Tools return working canonical URLs
- **Layer 2**: Aggregated tools cross-reference resources reliably
- **Layer 3**: Semantic search indexes with stable, deduplicable IDs
- **Layer 4**:
  - `generate-lesson-plan`: Creates plans with clickable links that actually work
  - `export-curriculum-data`: Exports include consistent identifiers for external systems
  - `bulk-unit-summaries`: Can be cached and referenced across services

---

## High Priority – Structural Pattern Documentation

### 7. Document Curriculum Structural Patterns in OpenAPI Schema

**Status**: 🔴 HIGH PRIORITY — Required for reliable API traversal  
**Date**: 2025-12-28 (Updated with comprehensive 17-subject analysis)  
**Related Analysis**: [Curriculum Structure Analysis](../../curriculum-structure-analysis.md), [ADR-080](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md)

**The Problem:**

The Oak Curriculum API has **7 distinct structural patterns** that require different traversal strategies. This is not documented anywhere, leading to:

1. **Ingestion failures**: Consumers try simple `subject + keyStage` queries for all combinations
2. **Missing data**: Science KS4 returns empty from the obvious endpoint
3. **Incorrect deduplication**: Consumers don't know that duplicate lessons indicate tier/option variants

**The 7 Patterns (Comprehensive Analysis 2025-12-28):**

| Pattern | Description | Response Structure | Subjects |
|---------|-------------|-------------------|----------|
| 1 | Simple flat (Primary) | `year → units[] → lessons[]` | 15 subjects at KS1-KS2 |
| 2 | Simple flat (Secondary KS3) | `year → units[] → lessons[]` | All 17 subjects at KS3 |
| 3 | Tier variants | `year → tiers[] → units[]` | Maths KS4 only |
| 4 | Exam board variants | Multiple sequences per subject | 12 subjects at KS4 |
| 5 | Exam subject split | `year → examSubjects[] → tiers[] → units[]` | Science KS4 only |
| 6 | Unit options | `units[].unitOptions[]` | 6 subjects (Art, D&T, English, Geography, History, RE) |
| 7 | No KS4 content | N/A | Cooking-nutrition only |

**Key Stage Coverage Gaps:**

| Gap | Subjects |
|-----|----------|
| No KS1 | French, Spanish (start at KS2/Year 3) |
| No primary | German, Citizenship |
| No KS4 | Cooking-nutrition |
| No bulk file | RSHE-PSHE (API only) |

**Critical Issue: Science KS4**

```bash
# This returns empty - NOT intuitive
GET /key-stages/ks4/subject/science/lessons
→ { "data": [] }

# Must use sequences endpoint with nested traversal
GET /sequences/science-secondary-aqa/units?year=10
→ { "data": [{ "examSubjects": [{ "examSubjectSlug": "biology", "tiers": [...] }] }] }
```

The bulk download uses subject slugs (`biology`, `chemistry`, `physics`, `combined-science`) that are NOT in the API subject enum. This creates confusion.

**What We Need:**

**Option A: Add `/curriculum-structure` endpoint (Recommended)**

```json
GET /curriculum-structure

{
  "patterns": [
    {
      "patternId": "simple-flat",
      "description": "Direct subject → year → units → lessons traversal",
      "appliesTo": {
        "keyStages": ["ks1", "ks2", "ks3"],
        "subjects": ["all except science at ks4"]
      },
      "traversalPath": "GET /key-stages/{ks}/subject/{subject}/lessons",
      "responseShape": "{ data: [{ unitSlug, lessons: [...] }] }"
    },
    {
      "patternId": "tier-variants",
      "description": "Year 10-11 content split by tier (foundation/higher)",
      "appliesTo": {
        "keyStages": ["ks4"],
        "subjects": ["maths"]
      },
      "traversalPath": "GET /sequences/maths-secondary/units?year={10|11}",
      "responseShape": "{ data: [{ year, tiers: [{ tierSlug, units: [...] }] }] }",
      "note": "Lessons may appear in both tiers. Index with tiers: ['foundation', 'higher']"
    },
    {
      "patternId": "exam-subject-split",
      "description": "Science splits into biology/chemistry/physics/combined-science at KS4",
      "appliesTo": {
        "keyStages": ["ks4"],
        "subjects": ["science"]
      },
      "traversalPath": "GET /sequences/science-secondary-{board}/units?year={10|11}",
      "responseShape": "{ data: [{ examSubjects: [{ examSubjectSlug, tiers: [{ units }] }] }] }",
      "warning": "GET /key-stages/ks4/subject/science/lessons returns EMPTY. Use sequences endpoint."
    }
  ],
  "subjectPatternMap": {
    "maths": { "ks1": "simple-flat", "ks2": "simple-flat", "ks3": "simple-flat", "ks4": "tier-variants" },
    "science": { "ks1": "simple-flat", "ks2": "simple-flat", "ks3": "simple-flat", "ks4": "exam-subject-split" },
    "english": { "ks1": "simple-flat", "ks2": "simple-flat", "ks3": "simple-flat", "ks4": "exam-board-variants + unit-options" }
  }
}
```

**Option B: Document in OpenAPI schema extensions**

```yaml
x-oak-structural-patterns:
  science:
    ks4:
      pattern: 'exam-subject-split'
      traversal: '/sequences/science-secondary-{board}/units'
      warning: 'Do not use /key-stages/ks4/subject/science/lessons - returns empty'
```

**Option C: Fix the API to be uniform**

Make `/key-stages/ks4/subject/science/lessons` actually return KS4 science lessons with nested exam subject metadata. This would be the ideal long-term fix.

**Impact:**

- **Without documentation**: Every API consumer must discover patterns through trial and error
- **With documentation**: Consumers know exactly which endpoint to use for each subject/keyStage combination

**User impact:** API consumers and SDK/MCP engineers avoid dead ends; teachers and curriculum leaders access KS4 science without trial and error.

**Real-world failure mode:**

```typescript
// Consumer's reasonable assumption
async function fetchAllLessons(subject: string, keyStage: string) {
  return await api.get(`/key-stages/${keyStage}/subject/${subject}/lessons`);
}

// Works for: maths, english, history, etc. at all key stages
// FAILS for: science at ks4 (returns empty)
// Consumer thinks API is broken or data is missing
```

**Effort:** 

- Option A: 2-3 days (new endpoint + documentation)
- Option B: 1 day (schema extensions)
- Option C: Significant (API refactoring)

**Enables:**

- **All layers**: Correct traversal strategy selection
- **Semantic search ingestion**: Complete data for all subjects
- **Ontology redesign**: Clear understanding of current structure

---

## High Priority – Bulk Download Enhancements

### 8. Add Tier/Context Metadata to Bulk Download Lessons

**Status**: 🔴 HIGH PRIORITY — Bulk download contains duplicate entries without context  
**Date**: 2025-12-28  
**Related**: [Issue 2 in 00-overview-and-known-issues.md](./00-overview-and-known-issues.md)

**The Problem:**

The bulk download files contain **duplicate lesson entries** for lessons that exist in multiple contexts (tiers, unit options), but **without** the discriminating metadata:

| File | Raw Entries | Unique Lessons | Duplicates | Cause |
|------|-------------|----------------|------------|-------|
| maths-secondary.json | 1,235 | 862 | 373 | Missing tier field |
| geography-secondary.json | 527 | 460 | 67 | Missing unitOption context |
| english-secondary.json | 1,035 | 1,009 | 26 | Missing unitOption context |
| science-secondary.json | 888 | 887 | 1 | Cross-unit sharing |

**UPDATED Analysis (2025-12-30):** The maths 373 duplicates break down as:

| Category | Count | Explanation |
|----------|-------|-------------|
| Legitimate | 210 | Shared between BOTH tier variants |
| **Spurious** | 163 | In ONE tier only — data quality bug |

This is WORSE than previously understood — 163 lessons are incorrectly duplicated when they shouldn't be.

**Example (Maths):**

The same lesson appears twice with **byte-for-byte identical data**:

```json
// Entry 1 (should be foundation)
{ "lessonSlug": "algebraic-manipulation-1", "unitSlug": "algebraic-manipulation", ... }

// Entry 2 (should be higher) - IDENTICAL
{ "lessonSlug": "algebraic-manipulation-1", "unitSlug": "algebraic-manipulation", ... }
```

**What We Need:**

Add discriminating fields to bulk download lessons:

```json
{
  "lessonSlug": "algebraic-manipulation-1",
  "unitSlug": "algebraic-manipulation",
  "tier": "foundation",           // NEW: Which tier this entry is for
  "unitOption": null,             // NEW: Which unit option (if applicable)
  "examBoard": "aqa",             // NEW: Which exam board sequence
  "examSubject": null,            // NEW: For science KS4 only
  "contexts": [                   // OR: Array of all contexts this lesson appears in
    { "tier": "foundation", "examBoard": "aqa" },
    { "tier": "higher", "examBoard": "aqa" }
  ]
}
```

**Alternative: Deduplicate with aggregated context**

Instead of duplicate entries, have unique lessons with aggregated metadata:

```json
{
  "lessonSlug": "algebraic-manipulation-1",
  "unitSlug": "algebraic-manipulation",
  "tiers": ["foundation", "higher"],  // All tiers this lesson appears in
  "examBoards": ["aqa"],
  "unitOptions": []
}
```

**Impact:**

- Without fix: Consumers must detect and handle duplicates, losing context information
- With fix: Clean data that accurately represents curriculum structure

**User impact:** Data engineers and curriculum leaders can trust KS4 tier data; API consumers avoid duplicate handling logic.

**Priority:** HIGH — Affects data integrity for all bulk download consumers.

---

### 9. Add RSHE-PSHE Bulk Download File

**Status**: 🟡 MEDIUM PRIORITY — Only subject without bulk data  
**Date**: 2025-12-28

RSHE-PSHE is the **only subject** without a bulk download file. The API returns lessons for this subject, so the data exists.

**Request:** Add `rshe-pshe-primary.json` and `rshe-pshe-secondary.json` bulk download files for parity with other subjects.
**User impact:** Teachers and curriculum leaders can plan RSHE/PSHE provision; API consumers gain full subject coverage.

---

### 10. Mark Transcript Fields as Optional in Lesson Schemas

**Status**: 🟡 MEDIUM PRIORITY — Improves schema accuracy for downstream consumers  
**Date**: 2026-01-01  
**Related ADRs**: [ADR-094](../../../../docs/architecture/architectural-decisions/094-has-transcript-field.md), [ADR-095](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md)

**Current state:**

The `transcript_sentences` field in bulk download lesson data appears to be implicitly optional (can be `null` or `undefined`), but this is not explicitly documented in any schema. Approximately 19% of lessons lack transcripts:

| Subject Group | Transcript Coverage |
|---------------|---------------------|
| MFL (French, German, Spanish) | ~0% |
| PE Primary | ~0.6% |
| PE Secondary | ~28.5% |
| All other subjects | 95-100% |

**The problem:**

Without explicit schema documentation, API consumers must:

1. Discover through trial and error that transcripts can be missing
2. Implement defensive coding without knowing which lesson types lack transcripts
3. Risk polluting search indexes with placeholder text (e.g., "[No transcript available]")

**What we need:**

1. **Explicitly mark `transcript_sentences` as optional** in:
   - OpenAPI schema for API responses
   - JSON schema for bulk download files (if schema exists)
   - TypeScript type definitions (if published)

2. **Document which lesson types typically lack transcripts:**
   ```yaml
   transcript_sentences:
     type: string
     nullable: true
     description: |
       Full transcript text from lesson video. May be null for:
       - MFL lessons (French, German, Spanish) - audio content not transcribed
       - PE practical lessons - physical activity without narration
       - Lessons with slides only - no video component
       - Lessons where video has not yet been produced
   ```

3. **Consider adding a native `has_transcript` boolean field:**
   ```yaml
   has_transcript:
     type: boolean
     description: |
       Indicates whether this lesson has transcript content available.
       Useful for filtering and UI indication without fetching transcript data.
   ```

**Why this matters:**

1. **Schema accuracy**: Types should reflect reality; nullable fields should be marked nullable
2. **Consumer correctness**: Generated clients and SDKs handle optional fields properly
3. **Search quality**: Consumers know to conditionally include content fields
4. **Reduced support burden**: Clear documentation prevents confusion

**Impact:**

- Without fix: Consumers must handle missing transcripts defensively, often incorrectly
- With fix: Clear contract enables correct handling across all consumers

**User impact:** API consumers, SDK/MCP engineers, and search implementers handle transcript availability correctly; teachers see better search results because indexes aren't polluted with placeholder text.

**Effort:** 1 day (schema update + documentation).

**Priority:** MEDIUM — Improves correctness but has known workaround (check for null/empty).

---
