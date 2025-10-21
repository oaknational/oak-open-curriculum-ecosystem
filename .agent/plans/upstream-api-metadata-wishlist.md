# Upstream Open Curriculum API Metadata Enhancement Wishlist

## Purpose

This document captures desired OpenAPI schema and endpoint enhancements for the Open Curriculum API (`open-api.thenational.academy`) that would improve AI tool integration, particularly for the OpenAI Apps SDK and Model Context Protocol (MCP) consumers. These improvements will benefit all downstream integrations by providing richer, more discoverable, and better-documented API metadata.

## Context

The oak-notion-mcp repository consumes the Open Curriculum API OpenAPI schema via `pnpm type-gen` to generate:

- TypeScript types and validators
- MCP tool descriptors
- Client SDK methods
- Documentation

All improvements to the upstream schema automatically flow through to generated artefacts, keeping the entire toolchain aligned without manual intervention. This schema-first approach means **better API metadata = better AI integration for free**.

## Audience

This wishlist is for the Open Curriculum API cross-functional squad (backend engineers, product, documentation). Items are prioritised by impact on AI tool discovery and user experience.

---

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

**Applies to:** All 26+ endpoints in the API schema.

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

**Applies to:** All endpoints.

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
      "canonical_url_pattern": "https://www.thenational.academy/teachers/lessons/{slug}",
      "description": "Individual teaching session with video, resources, and assessment"
    },
    "unit": {
      "contains": ["lessons"],
      "typical_lesson_count": "4-8",
      "canonical_url_pattern": "https://www.thenational.academy/teachers/units/{slug}",
      "description": "Collection of related lessons forming a teaching block"
    },
    "sequence": {
      "contains": ["units"],
      "groups_by": "year",
      "canonical_url_pattern": "https://www.thenational.academy/teachers/programmes/{slug}",
      "description": "Year-long progression pathway for a subject"
    }
  },
  "relationships": {
    "lesson_belongs_to": ["unit", "subject", "key_stage"],
    "unit_belongs_to": ["sequence", "subject", "key_stage"],
    "sequence_belongs_to": ["subject"],
    "hierarchy": "sequence → unit → lesson"
  },
  "tool_usage_guidance": {
    "discovery_flow": [
      "Start with GET /subjects to see available subjects",
      "Use GET /key-stages/{keyStage}/subject/{subject}/units to browse units",
      "Use GET /search/lessons for keyword-based discovery"
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
    ]
  }
}
```

**Why:** **Biggest impact for AI integration.** Provides structural knowledge that AI models cannot infer from individual endpoint schemas. Enables intelligent tool composition and reduces trial-and-error API exploration.

**Benefits:**

- AI understands curriculum hierarchy without guessing
- Clearer resource type distinctions (lesson vs unit vs sequence)
- Canonical URL patterns enable link generation
- Tool usage guidance improves workflow composition
- Single source of truth for domain model

**Impact:** Reduces multi-turn discovery conversations by ~60%; enables AI to plan efficient tool call sequences.

**Effort:** 1-2 days (backend + documentation).

**Interim Solution:** Currently shimmed at MCP layer as described in `.agent/plans/curriculum-ontology-resource-plan.md`. The shim extracts schema-derived facts during `pnpm type-gen` and merges with hand-authored educational guidance at runtime. This provides immediate value while the upstream endpoint is developed.

**Migration Path:** When upstream `/ontology` endpoint becomes available:

1. MCP layer can consume upstream endpoint instead of shimmed data
2. Schema extraction logic can be retired
3. Educational guidance layer remains at MCP layer (domain-specific to AI tooling)
4. All other API consumers benefit from official ontology endpoint

---

## Medium Priority – Parameter Richness

### 4. Add Parameter Examples

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

---

### 5. Add Custom Schema Extensions for Tool Metadata

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

---

## Medium Priority – Response Metadata

### 6. Add Response Schema Examples

**Current state:**

```yaml
responses:
  '200':
    description: 'Successful response'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/SearchLessonsResponse'
```

**Desired state:**

```yaml
responses:
  '200':
    description: 'Successful response'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/SearchLessonsResponse'
        examples:
          typical-search:
            summary: 'Typical search with results'
            value:
              lessons:
                - slug: 'checking-understanding-of-basic-transformations'
                  title: 'Checking understanding of basic transformations'
                  subject: 'maths'
                  key_stage: 'ks3'
                  canonicalUrl: 'https://...'
          empty-results:
            summary: 'No matches found'
            value:
              lessons: []
              metadata:
                query: 'nonexistent topic'
                total: 0
```

**Why:** Helps AI understand response structure and common patterns (empty results, typical data shapes).

**Benefits:**

- Better error handling in AI tool calls
- Clearer expectation setting
- Improved documentation

**Applies to:** Major list/search endpoints.

---

### 7. Document Canonical URL Patterns

**Current state:**
Canonical URLs calculated client-side based on implicit rules.

**Desired state (option A – in schema):**

```yaml
components:
  schemas:
    LessonSummary:
      type: object
      properties:
        slug:
          type: string
          x-oak-canonical-url-component: true
        # other fields...
      x-oak-canonical-url-template: 'https://www.thenational.academy/teachers/lessons/{slug}'
```

**Desired state (option B – in ontology endpoint):**
Included in `/ontology` response (see item 3).

**Why:** Enables generated clients to construct user-facing URLs without hard-coding patterns.

**Current workaround:** SDK generator adds canonical URLs at type-gen time using hard-coded patterns.

**Impact:** Single source of truth for URLs; easier updates when URL patterns change.

---

## Low Priority – Performance Hints

### 8. Add Performance and Caching Metadata

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

---

## Summary Table

| Item                            | Priority | Impact        | Effort    | AI Benefit                 |
| ------------------------------- | -------- | ------------- | --------- | -------------------------- |
| 1. "Use this when" descriptions | **High** | Very High     | 2-4 hours | 70% fewer wrong-tool calls |
| 2. Operation summaries          | **High** | Medium        | 1 hour    | Better UI/organisation     |
| 3. `/ontology` endpoint         | **High** | **Very High** | 1-2 days  | 60% fewer discovery turns  |
| 4. Parameter examples           | Medium   | Medium        | Ongoing   | Clearer semantics          |
| 5. Custom schema extensions     | Medium   | Medium        | Low       | Auto-generated metadata    |
| 6. Response examples            | Medium   | Low           | Ongoing   | Better error handling      |
| 7. Canonical URL patterns       | Medium   | Medium        | 1 hour    | URL generation             |
| 8. Performance hints            | Low      | Low           | Low       | Advanced optimisation      |

---

## Implementation Notes

### Iterative Approach

These enhancements can be implemented incrementally:

1. Start with high-priority items (descriptions, ontology)
2. Add examples and extensions to new endpoints as they're developed
3. Backfill existing endpoints during maintenance windows

### Testing Impact

After each schema change:

1. Run `pnpm type-gen` in oak-notion-mcp
2. Verify generated types and tools update correctly
3. Test AI tool discovery in ChatGPT Developer Mode
4. Measure tool selection accuracy improvements

### Cross-Team Coordination

- **API team:** Schema updates, new endpoint implementation
- **Documentation team:** Review descriptions for clarity and consistency
- **AI integration team (oak-notion-mcp):** Validate generated outputs, provide feedback
- **Product team:** Align tool usage guidance with user workflows

---

## Related Documentation

- OpenAI Apps SDK Metadata Guidance: <https://developers.openai.com/apps-sdk/guides/optimize-metadata/>
- MCP Tool Specification: <https://spec.modelcontextprotocol.io/>
- Oak MCP Implementation Plan: `.agent/plans/oak-openai-app-plan.md`
- Schema-First Execution: `.agent/directives-and-memory/schema-first-execution.md`

---

## Contact

For questions or to propose additional enhancements, contact the oak-notion-mcp maintainers or raise issues in the API schema repository.
