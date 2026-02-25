## Executive Summary

Oak National Academy has built something unique: a comprehensive, open curriculum API containing 30,000+ lessons, 1,000+ units, and rich educational metadata. This isn't just another education dataset—it's one of the most complete, openly accessible curriculum resources in the world.

**The opportunity**: With relatively straightforward OpenAPI schema improvements, we can transform this resource from a traditional API into an intelligent curriculum platform that AI assistants can reason about, compose, and use to help teachers in entirely new ways. The same schema that helps human developers understand our API can be enriched to help AI agents discover, combine, and intelligently apply our curriculum data.

**The multiplier effect**: Because our tooling generates everything from the OpenAPI schema, each enhancement you make flows automatically to:

- Type-safe SDKs
- AI tool descriptors for ChatGPT, Claude, Gemini
- Model Context Protocol (MCP) servers
- Semantic search integration
- Future intelligent curriculum assistants

Small improvements to the schema unlock exponential value through AI tooling. This document outlines those improvements.

**Note**: Oak is in a unique position—most education organisations either have closed APIs or limited content. You have both comprehensive curriculum data AND an open API. These enhancements help us make the most of this incredible resource by making it intelligently accessible to AI assistants that can help teachers in their day-to-day work.

## Vision: From API Documentation to Intelligent Curriculum Platform

### The Paradigm Shift

Traditionally, API documentation serves **human developers** who:

- Read endpoint descriptions to understand what they do
- Consult parameter docs to learn valid inputs
- Study response schemas to parse outputs
- Browse through multiple endpoints to find what they need

Now, we're enabling **AI agents** to:

- Discover appropriate tools based on natural language queries ("find KS3 science lessons about photosynthesis")
- Compose multiple tools to accomplish complex tasks (search → filter → fetch details → compare → recommend)
- Understand curriculum structure and relationships (key stage → unit → lesson hierarchy)
- Validate educational appropriateness (prior knowledge requirements, NC alignment)
- Generate teacher-ready resources (lesson plans, unit overviews, progression pathways)

**The key insight**: AI agents don't just call APIs—they reason about when to use them, how to combine them, and what the results mean. This requires richer metadata than traditional API documentation provides.

### What We're Building: The Tool Ecosystem

Our AI integration comprises four layers of tools, each building on the last:

#### **Layer 1: Direct Proxy Tools** ✅ (Currently Available)

26 tools that directly map to API endpoints:

- `get-lessons-summary` → `GET /lessons/{lesson}/summary`
- `get-search-lessons` → `GET /search/lessons`
- `get-units-summary` → `GET /units/{unit}/summary`
- etc.

**Value**: AI assistants can access any curriculum data via natural language requests.

**Enabled by**: Current API endpoints + OpenAPI schema.

#### **Layer 2: Aggregated Tools** ✅ (Currently Available)

Tools that combine multiple endpoints for efficiency:

- **`search`**: Searches both lessons and transcripts in parallel
- **`fetch`**: Routes to appropriate endpoint based on ID prefix (lesson:, unit:, subject:)

**Value**: Reduces tool call overhead; agents don't need to know which specific endpoint to use.

**Enabled by**: Well-structured endpoint patterns + clear response schemas.

**Would be improved by**: Items #1-2 (descriptions, summaries) help agents choose between `search` and direct access.

#### **Layer 3: Service Integration Tools** 🔄 (In Development)

Tools that integrate external AI services with curriculum data. **Note**: These tools require external services beyond the curriculum API itself.

**Semantic Search** (In Development - Requires External Search Service):

- Hybrid lexical + semantic search across curriculum content
- Natural language queries: "lessons about the water cycle for year 5"
- Contextual recommendations based on teaching goals
- **What the API provides**: Curriculum data endpoints that semantic search indexes
- **What external services provide**: Vector embeddings, semantic matching, hybrid search orchestration

**Pedagogical Validation** (Planned - Requires AI Platform Team Service):

- Validates lesson plans against curriculum standards
- Checks NC alignment and age-appropriateness
- Suggests improvements based on pedagogical principles
- **What the API provides**: Lesson metadata, NC mapping, curriculum structure
- **What external services provide**: Pedagogical analysis, validation rules, recommendation engine

**Content Sensitivity Analysis** (Planned - Requires AI Platform Team Service):

- Analyzes lesson content for safeguarding requirements
- Recommends supervision levels
- Flags content guidance needs
- **What the API provides**: Lesson content and context
- **What external services provide**: Content analysis, sensitivity detection, safeguarding rules

**Value**: AI-powered enhancements to curriculum discovery and validation.

**Enabled by**: Items #3 (ontology), #4 (error handling), #5 (parameter examples) provide the structural knowledge these services need.

#### **Layer 4: Advanced Intelligence Tools** 📋 (Planned)

High-level tools that combine everything. **Note**: Some are purely API-driven, others require external AI services.

**Discovery & Filtering** (Mix of API + Services):

- `find-units-by-thread`: Cross-key-stage progression pathways (e.g., "show me how fractions progress from KS1 to KS4")
  - **API provides**: Ontology, curriculum structure, thread/topic metadata
  - **MCP orchestration**: Queries multiple endpoints, filters by thread
- `find-lessons-with-fieldwork`: Context-aware filtering (e.g., "outdoor learning opportunities in geography")
  - **API provides**: Lesson metadata, tags, activity types
  - **MCP orchestration**: Filters and ranks based on criteria
- `discover-curriculum-gaps`: Identify missing content for specific topics/year groups
  - **API provides**: Complete curriculum map, coverage data
  - **External services**: Gap analysis algorithm, NC mapping

**Comparative Analysis** (API-Driven with MCP Orchestration):

- `compare-units`: Side-by-side comparison of units across year groups
  - **API provides**: All unit data, relationships, progression indicators
  - **MCP orchestration**: Fetches multiple units, structures comparison
- `analyse-nc-coverage`: Gap analysis for National Curriculum requirements
  - **API provides**: NC alignment metadata, curriculum coverage
  - **MCP orchestration**: Aggregates and analyses coverage patterns
- `trace-prior-knowledge`: Map prerequisite chains across lessons
  - **API provides**: Ontology relationships, prerequisite metadata (if available)
  - **MCP orchestration**: Traverses dependency graph

**Intelligent Recommendations** (Requires External AI Services):

- `recommend-adaptations`: Suggest how to adapt lessons for different contexts (e.g., "adapt this lesson for students with dyslexia")
  - **API provides**: Lesson content, resources, structure
  - **External services**: Pedagogical AI, adaptation recommendations
- `suggest-progression`: Recommend next lessons based on current teaching
  - **API provides**: Curriculum structure, lesson sequences
  - **External services**: Learning path optimization, student progress tracking
- `find-related-content`: Semantic similarity-based discovery across subjects
  - **API provides**: Lesson content for indexing
  - **External services**: Semantic search, similarity matching

**Bulk Operations** (API-Driven with MCP Orchestration):

- `bulk-unit-summaries`: Fetch multiple units efficiently for comparison
  - **API provides**: All endpoint data
  - **MCP orchestration**: Batch requests, error handling, response aggregation
- `generate-lesson-plan`: Compile lesson + assets + quiz into teacher-ready format
  - **API provides**: Lesson data, downloadable resources, quiz content
  - **MCP orchestration**: Fetches related data, formats output
- `export-curriculum-data`: Structured exports (JSON, Markdown, CSV) for external tools
  - **API provides**: All curriculum data
  - **MCP orchestration**: Format transformation, export generation

**Value**: Transform the API from data access to intelligent curriculum assistance. Instead of teachers searching for lessons, the AI helps them plan entire units, adapt content to their context, and understand progression pathways.

**Enabled by**: All items in this wish list, especially #1 (descriptions for tool selection), #3 (ontology for relationships), #4 (error handling for robustness).

### The Multiplier Effect of Schema Improvements

Here's the key: **every enhancement you make to the OpenAPI schema automatically enables new capabilities across all four tool layers**.

**Example 1: Adding "Use this when" descriptions (Item #1)**

- Layer 1 tools: AI chooses correct endpoint 70% more reliably
- Layer 2 tools: Better routing in `search` vs `fetch` decisions
- Layer 3 tools: Semantic search knows when to call curriculum API vs search service
- Layer 4 tools: Intelligent recommendations compose the right tools in the right order

**Example 2: Creating `/ontology` endpoint (Item #3)**

- Layer 1 tools: Responses include relationship context
- Layer 2 tools: `fetch` can traverse relationships (lesson → unit → programme)
- Layer 3 tools: Pedagogical validation understands curriculum structure
- Layer 4 tools: Comparative analysis and progression tracking become possible

**Example 3: Documenting error responses (Item #4)**

- Layer 1 tools: Handle legitimate 404s gracefully (practical lessons have no transcripts)
- Layer 2 tools: Aggregated tools provide helpful messages instead of failing
- Layer 3 tools: Services can distinguish "resource unavailable" from "request error"
- Layer 4 tools: Bulk operations handle partial failures intelligently

### Why This Matters for Teachers

The ultimate beneficiaries are teachers. With these enhancements, AI assistants can:

1. **"Find me KS3 science lessons about photosynthesis"** → Semantic search + filtering + NC alignment checking
2. **"Show me how fractions progress from year 1 to year 6"** → Cross-key-stage analysis + progression pathways
3. **"Adapt this lesson for outdoor learning at our school"** → Context-aware recommendations + related content discovery
4. **"What prior knowledge do students need for this unit?"** → Prerequisite tracing + knowledge mapping
5. **"Generate a 6-week unit plan on ancient civilizations"** → Bulk operations + comparative analysis + export

All of this becomes possible through simple OpenAPI schema enhancements combined with intelligent tooling.

## How We Generate Tools from Your OpenAPI Schema

To understand why these enhancements matter, here's how our system works:

```plaintext
Your OpenAPI Schema
        ↓
   pnpm sdk-codegen (automated)
        ↓
    ┌────────────────────────────┐
    │ Generated Artefacts        │
    ├────────────────────────────┤
    │ • TypeScript types         │
    │ • Zod validators           │
    │ • MCP tool descriptors     │
    │ • Client SDK methods       │
    │ • Documentation            │
    └────────────────────────────┘
        ↓
   AI Assistants
   (ChatGPT, Claude, Gemini)
```

**The key**: Everything flows from your schema. You don't need to understand MCP, SDKs, or AI tooling—you just need to enrich your OpenAPI documentation in ways that benefit both human and AI consumers.

**The result**: Better API metadata = better AI integration for free.

## Audience

This wish list is for the Open Curriculum API cross-functional squad (backend engineers, product, documentation). Items are prioritised by impact on AI tool capabilities and teacher value.

---

