## Low Priority – Performance Hints

### 16. Add Performance and Caching Metadata

**What:** Extensions indicating response characteristics.

**Example:**

```yaml
/lessons/{lesson}/summary:
  get:
    x-oak-performance:
      typical-response-time-ms: 150
      cache-duration-seconds: 300
      rate-limit-cost: 1
      result-stability: 'stable' # stable | dynamic | realtime
```

**Why:** Helps AI plan efficient tool call sequences (cache-friendly vs always-fresh data).

**Benefits:**

- Better AI planning for batch operations
- Cache-aware tool composition
- Rate limit awareness

**Priority:** Low (nice-to-have for advanced optimisation).

**Enables**:

- **Layer 4**: `bulk-unit-summaries` can optimise batching based on rate limits; tools can cache stable data (lesson content) vs. dynamic data (user progress)

---

### 17. Complete OpenAPI Best Practices Checklist

**What:** Fill gaps in OpenAPI spec completeness following [OpenAPI Initiative best practices](https://learn.openapis.org/best-practices.html).

**References:**

- [OpenAPI Best Practices](https://learn.openapis.org/best-practices.html)
- [Providing Documentation and Examples](https://learn.openapis.org/specification/docs.html)
- [Describing API Security](https://learn.openapis.org/specification/security.html)
- [API Servers](https://learn.openapis.org/specification/servers.html)

---

#### **Section A: Core Metadata (High Priority)**

**A1. Complete `info` object:**

```json
{
  "info": {
    "title": "Oak National Academy Curriculum API",
    "version": "0.5.0",
    "description": "Access the UK's largest open curriculum with 40,000+ lessons across all key stages. This API provides programmatic access to lessons, units, quiz questions, transcripts, and downloadable resources aligned with the National Curriculum.",
    "contact": {
      "name": "Oak National Academy Developer Support",
      "email": "developers@thenational.academy",
      "url": "https://github.com/oaknational/oak-curriculum-api"
    },
    "license": {
      "name": "Open Government Licence v3.0",
      "url": "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
    },
    "termsOfService": "https://www.thenational.academy/legal/terms-and-conditions"
  }
}
```

**Why:** Per [OpenAPI structure guidelines](https://learn.openapis.org/specification/structure.html), complete `info` metadata is essential for discoverability and legal clarity.
**User impact:** Human engineers and API consumers get clear legal and support information; organisational stakeholders can assess licence terms quickly.

**Current state:** Missing `description`, `contact`, `license`, `termsOfService`

---

**A2. Enhanced tag descriptions:**

```yaml
tags:
  - name: lessons
    description: |
      Retrieve comprehensive lesson content including:
      - **Summaries**: Learning objectives, keywords, misconceptions
      - **Transcripts**: Full video transcripts with VTT captions
      - **Quizzes**: Starter and exit quizzes with answers
      - **Assets**: Downloadable slide decks, worksheets, videos
    externalDocs:
      url: 'https://docs.thenational.academy/api/lessons'
  - name: search
    description: |
      Discover lessons using:
      - **Title search**: Keyword matching on lesson titles
      - **Transcript search**: Semantic search across video content
  - name: units
    description: 'Access curriculum units - thematic collections of 4-8 related lessons'
  - name: sequences
    description: 'Browse multi-year curriculum sequences spanning key stages'
  - name: threads
    description: 'Follow conceptual progression strands across the entire curriculum'
```

**Why:** [Enhanced tags](https://learn.openapis.org/specification/tags.html) with descriptions and external docs improve navigation in generated documentation.
**User impact:** API consumers and SDK/MCP engineers find endpoints faster; teachers and curriculum leaders can browse documentation more confidently.

**Current state:** Tags exist but have no descriptions or external documentation links.

---

#### **Section B: Documentation Best Practices (Medium-High Priority)**

**B1. Use `summary` AND `description` pattern:**

Per [OpenAPI documentation guidelines](https://learn.openapis.org/specification/docs.html), operations should have both fields:

```yaml
/sequences/{sequence}/units:
  get:
    summary: 'List units in a curriculum sequence'
    description: |
      ## Overview
      Returns all units within a curriculum sequence, grouped by year.

      ## Use Cases
      - Building year-by-year curriculum overviews
      - Filtering units for specific year groups
      - Understanding unit progression through key stages

      ## Ordering
      Units are returned in **pedagogical order** as defined by curriculum experts.

      ## Thread Associations
      Each unit includes thread memberships showing conceptual progression.

      ## Special Cases
      - PE Primary: Supports `year: "all-years"` for cross-year content
      - KS4 Science: Units are grouped by tier (Foundation/Higher)
```

**Why:**

- `summary`: Short (for list views, API explorers)
- `description`: Long with CommonMark formatting (for detail views)

**User impact:** Human engineers and API consumers understand intent quickly; AI tool builders reduce mismatched endpoint usage.

**Current state:** Most operations only have `description`, not `summary`

---

**B2. Leverage CommonMark in descriptions:**

Descriptions support [CommonMark 0.27](https://learn.openapis.org/specification/docs.html#the-commonmark-syntax):

```yaml
description: |
  ### What This Returns
  A paginated list of lessons grouped by unit.

  ### Filtering Options
  - `unit`: Filter to a specific unit slug
  - `offset`/`limit`: Pagination (max 100 per page)

  ### Response Structure
  [
    {
      "unitSlug": "...",
      "unitTitle": "...",
      "lessons": [...]
    }
  ]

  **Note**: Only published lessons are returned.
```

**Why:** Richer formatting creates better auto-generated documentation.
**User impact:** API consumers and teachers reading docs can skim and understand structure quickly.

**Current state:** Descriptions are plain text, not using CommonMark features.

---

**B3. Use `examples` (plural) over `example` (singular):**

Per [OpenAPI examples guide](https://learn.openapis.org/specification/docs.html#adding-examples), prefer `examples` (with Example Objects):

```yaml
responses:
  '400':
    description: Invalid request parameters
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
        examples:
          invalidYear:
            summary: 'Year out of range'
            description: 'Year must be 1-11 or "all-years"'
            value:
              message: 'Invalid year parameter'
              code: 'INVALID_PARAMETER'
              data:
                parameter: 'year'
                provided: '99'
                allowed: ['1', '2', ..., '11', 'all-years']
          invalidKeyStage:
            summary: 'Unknown key stage'
            value:
              message: 'Invalid keyStage parameter'
              code: 'INVALID_PARAMETER'
```

**Why:** Multiple named examples with summaries improve documentation and enable mock servers.
**User impact:** SDK/MCP engineers and API consumers can test against realistic examples without guessing response shapes.

**Current state:** Some endpoints use `example` (singular), most have none.

---

#### **Section C: Error Handling (High Priority)**

**C1. Document all HTTP responses:**

Current spec only documents `200` (and `404` for transcript). Should add:

```yaml
responses:
  '200':
    # ... existing
  '400':
    $ref: '#/components/responses/BadRequest'
  '401':
    $ref: '#/components/responses/Unauthorised'
  '403':
    $ref: '#/components/responses/Forbidden'
  '429':
    $ref: '#/components/responses/RateLimitExceeded'
  '500':
    $ref: '#/components/responses/InternalServerError'
  '503':
    $ref: '#/components/responses/ServiceUnavailable'
```

**C2. Define reusable error response components:**

```yaml
components:
  responses:
    BadRequest:
      description: Invalid request parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          examples:
            invalidParameter:
              summary: 'Parameter validation failed'
              value:
                message: 'Invalid year parameter'
                code: 'INVALID_PARAMETER'
    RateLimitExceeded:
      description: Too many requests
      headers:
        X-RateLimit-Limit:
          schema: { type: integer }
        X-RateLimit-Remaining:
          schema: { type: integer }
        X-RateLimit-Reset:
          schema: { type: integer }
        X-Retry-After:
          schema: { type: integer }
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
```

**Why:** Consistent error handling per [OpenAPI best practices](https://learn.openapis.org/best-practices.html).
**User impact:** API consumers and SDK/MCP engineers handle errors correctly; teachers see clearer, actionable failures.

---

#### **Section D: Response Headers (Medium Priority)**

**D1. Document rate limit headers:**

```yaml
    responses:
      '200':
        headers:
          X-RateLimit-Limit:
            schema:
              type: integer
              example: 1000
            description: 'Maximum requests per time window'
          X-RateLimit-Remaining:
            schema:
              type: integer
              example: 953
            description: 'Requests remaining in current window'
          X-RateLimit-Reset:
            schema:
              type: integer
              example: 1740164400000
            description: 'Time when rate limit resets (milliseconds since Unix epoch)'
          X-Retry-After:
            schema:
              type: integer
              example: 1740164400000
            description: 'Time when it is safe to retry after a 429 response (milliseconds since Unix epoch)'
```

**Why:** Oak has `/rate-limit` endpoint but headers aren't documented in spec!
**User impact:** SDK/MCP engineers can respect limits and avoid throttling; API consumers can plan retries reliably.

**D2. Add caching headers:**

```yaml
Cache-Control:
  schema:
    type: string
    example: 'public, max-age=300'
  description: 'Cache control directives (lesson content is cacheable)'
ETag:
  schema:
    type: string
  description: 'Entity tag for cache validation'
```

**User impact:** SDK/MCP engineers can implement reliable caching; teachers and learners see faster responses.

---

#### **Section E: Schema Constraints (Medium Priority)**

**E1. Add string patterns and constraints:**

```yaml
components:
  schemas:
    LessonSlug:
      type: string
      pattern: '^[a-z0-9]+(-[a-z0-9]+)*$'
      minLength: 3
      maxLength: 200
      example: 'the-roman-invasion-of-britain'
      description: 'URL-safe lesson identifier (lowercase, hyphen-separated)'
```

**E2. Use `format` validators:**

```yaml
properties:
  canonicalUrl:
    type: string
    format: uri
    readOnly: true
    example: 'https://www.thenational.academy/teachers/lessons/example'
```

**E3. Mark response-only fields:**

```yaml
properties:
  lessonSlug:
    type: string
    readOnly: true
  canonicalUrl:
    type: string
    format: uri
    readOnly: true
```

**Why:** Better code generation and validation per [reusing descriptions](https://learn.openapis.org/specification/reusing-descriptions.html).
**User impact:** SDK/MCP engineers get stricter, safer schemas; API consumers hit fewer validation surprises.

---

#### **Section F: Pagination (Medium Priority)**

**F1. Include pagination metadata in responses:**

```yaml
KeyStageSubjectLessonsResponse:
  type: object
  properties:
    results:
      type: array
      items:
        $ref: '#/components/schemas/LessonUnit'
    pagination:
      type: object
      required: [offset, limit, total, hasMore]
      properties:
        offset:
          type: integer
          example: 0
        limit:
          type: integer
          example: 10
        total:
          type: integer
          example: 247
          description: 'Total number of results available'
        hasMore:
          type: boolean
          example: true
          description: 'Whether more results are available beyond current page'
```

**Why:** Clients need to know if there are more results.
**User impact:** API consumers and SDK/MCP engineers can paginate correctly; teachers get complete lists.

---

#### **Section G: Additional Best Practices (Low-Medium Priority)**

**G1. Server variables for environments:**

```yaml
servers:
  - url: 'https://{environment}.thenational.academy/api/{version}'
    description: 'Oak Curriculum API'
  variables:
    environment:
        default: open-api
        enum: [open-api, open-api-staging]
        description: 'API environment'
      version:
        default: v0
        enum: [v0]
      description: 'API version'
```

**User impact:** API consumers and SDK/MCP engineers can target the right environment without guesswork.

**G2. Deprecation markers (when needed):**

```yaml
/legacy-endpoint:
  get:
    deprecated: true
    summary: 'Legacy endpoint'
    description: |
      **DEPRECATED**: Use `/new-endpoint` instead.

      This endpoint will be removed in v1.0 (December 2025).

      Migration guide: https://docs.thenational.academy/api/migration
```

**User impact:** API consumers and SDK/MCP engineers can migrate safely; teachers avoid broken tooling during rollouts.

**G3. Security scheme documentation:**

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        Obtain bearer tokens from https://open-api.thenational.academy/api/v0/auth

        Token lifetime: 1 hour
        Rate limit: 1000 requests/hour
```

**User impact:** API consumers and SDK/MCP engineers authenticate correctly; organisational stakeholders understand access controls.

---

### Summary

**Why:** Complete, well-documented specs following [OpenAPI best practices](https://learn.openapis.org/best-practices.html) enable:

- **Better tooling**: Swagger UI, Redoc, Postman, code generators
- **Clearer expectations**: Developers know what to expect
- **Standards compliance**: Passes linters/validators
- **Professional polish**: Shows API maturity

**Effort:** Low-Medium per item, comprehensive overall

**Priority breakdown:**

- **High**: Error responses, `info` metadata, rate limit headers, `summary` + `description` pattern
- **Medium**: Tag descriptions, CommonMark formatting, string constraints, pagination metadata
- **Low**: Server variables, deprecation markers (when needed)

**Enables**:

- **All layers**: More robust error handling, better validation
- **Tool ecosystem**: Better integration with OpenAPI toolchains
- **Documentation**: Auto-generated docs are comprehensive and navigable

---
