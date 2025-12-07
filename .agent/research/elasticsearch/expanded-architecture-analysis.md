# Expanded Architecture Analysis: Elasticsearch Integration

_Date: 2025-12-04_
_Status: RESEARCH - STRATEGIC PLANNING_

## Overview

This document expands on the initial semantic search review to address:

1. **Indexing ontology and knowledge graph data** in Elasticsearch
2. **MCP connectivity options** for semantic search
3. **RAG opportunities** with Elasticsearch Serverless
4. **Current deployment state** (indexes defined but not populated)

---

## 1. Indexing Ontology and Knowledge Graph Data

### Current State

The SDK contains two static data modules that provide curriculum domain knowledge:

**`ontology-data.ts`** (~430 lines):

- Curriculum structure (key stages, phases, subjects)
- Thread definitions and examples
- Programme vs sequence distinction
- KS4 complexity (tiers, exam boards, pathways)
- Entity hierarchy
- Unit types
- Lesson components
- Content guidance categories
- Workflows and synonyms
- UK education context
- Canonical URL patterns

**`knowledge-graph-data.ts`** (~314 lines):

- 28 concept nodes (structure, content, context, taxonomy, KS4, metadata)
- ~45 edges showing relationships (explicit + inferred)
- Relationship types: hasSequences, containsUnits, containsLessons, etc.

### Current Usage

Both are exposed as **aggregated MCP tools**:

- `get-ontology` → returns `ontologyData` as JSON
- `get-knowledge-graph` → returns `conceptGraph` as JSON

AI agents call these tools to understand the domain model before making curriculum queries.

### Proposal: Index for Semantic Search and RAG

#### Option A: Dedicated Ontology Index

Create a dedicated `oak_ontology` index for semantic search over domain knowledge:

```typescript
interface OntologyIndexDoc {
  doc_id: string; // e.g., "keystage:ks1", "thread:number", "concept:lesson"
  doc_type: 'keystage' | 'phase' | 'subject' | 'thread' | 'concept' | 'workflow' | 'guidance';
  title: string; // Human-readable title
  description: string; // Detailed description
  category?: string; // For concepts: structure, content, context, etc.
  relationships?: string[]; // Related doc_ids
  content_text: string; // Flattened text for semantic search
  content_semantic?: string; // semantic_text field for embeddings
  // Note: metadata should use specific types from field definitions, not generic Record
}
```

**Pros**:

- Enables semantic search over domain concepts
- Supports RAG for "What is a thread?" type questions
- Separates domain knowledge from curriculum content

**Cons**:

- Additional index to maintain
- Static data that rarely changes
- May be overkill for ~50 concepts

#### Option B: Embed in Existing Indices

Add ontology context to existing curriculum documents:

```typescript
// In SearchLessonsIndexDoc
interface LessonWithOntology extends SearchLessonsIndexDoc {
  // Existing fields...

  // Embedded ontology context
  ontology_context: {
    entity_type: 'lesson';
    parent_entities: ['unit', 'sequence', 'subject'];
    lesson_components: string[]; // Which components this lesson has
  };
}
```

**Pros**:

- No new index
- Context travels with content
- Enables faceted navigation by ontology concepts

**Cons**:

- Increases document size
- Duplicates ontology data across documents
- Harder to update ontology independently

#### Option C: Hybrid - Index + Embedding

Create a lightweight ontology index AND embed key context in content documents:

1. **`oak_ontology` index**: Full domain model for direct RAG queries
2. **Embedded fields**: Key stage, subject, phase context in content docs

**Recommendation**: Option C (Hybrid)

Rationale:

- Supports both "What is a thread?" (ontology search) and "Find lessons in the number thread" (content search with ontology filter)
- Separates concerns while maintaining queryability
- Enables RAG grounding with authoritative domain definitions

### Implementation Approach

**Phase 1: Ontology Index Schema**

Generate schema from ontology-data.ts at type-gen time:

```typescript
// type-gen/typegen/search-indices/generate-ontology-index.ts
export function generateOntologyIndexSchema(): string {
  // Parse ontologyData structure
  // Generate Zod schema + TypeScript types
  // Generate ES mapping
}
```

**Phase 2: Index Population Script**

Create ingestion that transforms ontologyData into index documents:

```typescript
// scripts/ingest-ontology.ts
function ontologyToDocuments(ontology: typeof ontologyData): OntologyIndexDoc[] {
  const docs: OntologyIndexDoc[] = [];

  // Key stages
  for (const ks of ontology.curriculumStructure.keyStages) {
    docs.push({
      doc_id: `keystage:${ks.slug}`,
      doc_type: 'keystage',
      title: ks.name,
      description: ks.description,
      content_text: `${ks.name}. ${ks.description}. Ages ${ks.ageRange}. Years ${ks.years.join(', ')}.`,
      metadata: { ageRange: ks.ageRange, years: ks.years, phase: ks.phase },
    });
  }

  // Threads, concepts, etc.
  // ...
}
```

**Phase 3: Knowledge Graph Index**

Optionally index knowledge graph edges as separate documents for relationship queries:

```typescript
interface KnowledgeGraphEdgeDoc {
  edge_id: string; // "subject-hasSequences-sequence"
  from_concept: string;
  to_concept: string;
  relationship: string;
  inferred: boolean;
  description: string; // Generated from rel type
}
```

---

## 2. MCP Connectivity Options

### Current Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│ MCP Servers (oak-curriculum-mcp-stdio, oak-curriculum-mcp-streamable-http) │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   Universal Tool Executor                            │
│  ┌─────────────────────┐  ┌──────────────────────────────────────┐ │
│  │  Aggregated Tools   │  │        Generated Tools (26)          │ │
│  │  - search           │  │  - get-lessons-summary               │ │
│  │  - fetch            │  │  - get-search-lessons                │ │
│  │  - get-ontology     │  │  - get-threads                       │ │
│  │  - get-help         │  │  - etc.                              │ │
│  │  - get-knowledge-graph │ │                                     │ │
│  └─────────────────────┘  └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                Oak Curriculum API (upstream)                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Proposed Options

#### Option A: Expose MCP Tools Directly from Semantic Search App

Add MCP endpoint to the Next.js semantic search app:

```
┌─────────────────────────────────────────────────────────────────────┐
│               oak-open-curriculum-semantic-search                    │
│  ┌─────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ POST /api/mcp       │  │  Existing Endpoints                  │  │
│  │ (MCP SSE transport) │  │  - POST /api/search                  │  │
│  │                     │  │  - POST /api/search/nl               │  │
│  │ Tools:              │  │  - POST /api/search/suggest          │  │
│  │ - semantic-search   │  │                                      │  │
│  │ - nl-search         │  │                                      │  │
│  │ - suggest           │  │                                      │  │
│  └─────────────────────┘  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Pros**:

- Direct access to semantic search from any MCP client
- Bypasses need for intermediate aggregation
- Can leverage Elasticsearch features directly
- Independent deployment/scaling

**Cons**:

- Separate MCP endpoint to manage
- Doesn't integrate with curriculum tools
- Users need to know about multiple MCP servers

**Implementation**:

```typescript
// apps/oak-open-curriculum-semantic-search/app/api/mcp/route.ts
import { Server } from '@modelcontextprotocol/sdk/server';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse';

const server = new Server({
  name: 'oak-semantic-search',
  version: '1.0.0',
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'semantic-search',
      description: 'Hybrid semantic + lexical search across curriculum',
      inputSchema: SearchStructuredRequestSchema,
    },
    // nl-search, suggest, etc.
  ],
}));
```

#### Option B: Build Aggregated Tool in SDK to Interact with Semantic Search App

Add a new aggregated tool that calls the semantic search API:

```typescript
// packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-semantic-search/
export const SEMANTIC_SEARCH_TOOL_DEF = {
  description: `Hybrid semantic + lexical search across Oak curriculum content.
  
Uses Elasticsearch RRF to combine:
- Semantic embeddings for conceptual similarity
- Lexical matching for exact terms
- Faceted filtering by subject, key stage, year, thread

Use this when you need:
- More relevant results than basic text search
- Cross-cutting queries ("Year 5 geometry lessons with video")
- Thread-based navigation
- Programme factor filtering (KS4 tier, exam board)

Requires semantic search service to be deployed.`,
  inputSchema: {
    /* ... */
  },
};
```

**Pros**:

- Integrated with other curriculum tools
- Single MCP endpoint for users
- Can compose with other aggregated tools

**Cons**:

- Adds network hop (SDK → Semantic Search App → ES)
- Requires semantic search app to be deployed
- Coupling between SDK and external service

**Implementation**:

```typescript
// packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-semantic-search/execution.ts
export async function runSemanticSearchTool(
  args: SemanticSearchArgs,
  deps: { semanticSearchUrl: string },
): Promise<CallToolResult> {
  const response = await fetch(`${deps.semanticSearchUrl}/api/search`, {
    method: 'POST',
    body: JSON.stringify(args),
  });
  // ...
}
```

#### Option C: Enhance Existing `search` Aggregated Tool

Extend the current `search` aggregated tool to optionally use semantic search:

```typescript
// Enhanced search tool
export const SEARCH_TOOL_DEF = {
  description: `Search across curriculum content.

Modes:
- Basic (default): get-search-lessons + get-search-transcripts via API
- Semantic (if available): Hybrid RRF search via Elasticsearch

Use 'mode: semantic' for:
- More relevant results
- Thread filtering
- Programme factor filtering
- Faceted navigation`,
  inputSchema: {
    properties: {
      q: { type: 'string' },
      mode: { enum: ['basic', 'semantic'], default: 'basic' },
      // ...
    },
  },
};
```

**Pros**:

- Single tool for all search needs
- Graceful degradation (falls back to basic if semantic unavailable)
- Users don't need to learn new tool names

**Cons**:

- More complex tool logic
- Mode parameter adds cognitive load
- Harder to optimize each mode independently

#### Option D: Elastic Agent Builder Integration

Use Elastic's native MCP server for semantic search:

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Kibana (Agent Builder)                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │        MCP Server: /api/agent_builder/mcp                    │   │
│  │  - Built-in semantic search tools                            │   │
│  │  - Custom Oak curriculum tools (registered in UI)            │   │
│  │  - RAG capabilities                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

**Pros**:

- Maintained by Elastic
- Native ES integration
- Built-in RAG, Playground, Agent Builder

**Cons**:

- Requires Kibana deployment
- Less type safety (tools defined in UI)
- Schema-first violation

### Recommendation

**Phased Approach**:

1. **Now**: Option B (Aggregated Tool) + Option C (Enhanced `search`)
   - Add `aggregated-semantic-search` that calls semantic search app
   - Add `mode` parameter to existing `search` tool
   - Graceful degradation when semantic search unavailable

2. **Later**: Option A (Direct MCP from Semantic Search App)
   - Once semantic search is production-ready
   - For clients that need direct ES access
   - Optional - not required

3. **Evaluate**: Option D (Elastic Agent Builder)
   - If we deploy Kibana for other reasons
   - If RAG requirements exceed custom implementation
   - Keep monitoring Elastic's MCP development

---

## 3. RAG Opportunities

### What RAG Enables

Retrieval Augmented Generation (RAG) with Elasticsearch enables:

1. **Grounded responses** - AI answers cite specific curriculum content
2. **Reduced hallucination** - Responses based on actual Oak data
3. **Up-to-date answers** - New curriculum content immediately available
4. **Authoritative sources** - Teachers can verify AI suggestions

### RAG Patterns for Oak Curriculum

#### Pattern 1: Curriculum Content RAG

**Use case**: "Explain how fractions are taught across primary school"

**Flow**:

1. Query: "fractions primary progression"
2. ES retrieves: Units from number thread (Year 1 → Year 6)
3. LLM synthesizes: Progression narrative with specific unit references

**Index requirements**:

- Thread fields in unit documents ✅ (planned)
- Semantic embeddings on unit descriptions ✅ (existing `unit_semantic`)
- Programme factor context ❌ (not yet implemented)

#### Pattern 2: Domain Knowledge RAG

**Use case**: "What's the difference between a sequence and a programme?"

**Flow**:

1. Query: "sequence programme difference"
2. ES retrieves: Ontology docs for sequence, programme, relationship
3. LLM synthesizes: Explanation with official definitions

**Index requirements**:

- Ontology index ❌ (proposed above)
- Semantic embeddings on definitions ❌ (proposed)

#### Pattern 3: Lesson Planning RAG

**Use case**: "Find lessons about photosynthesis with video and exit quiz"

**Flow**:

1. Query: "photosynthesis lessons video exit quiz"
2. ES retrieves: Lessons matching criteria with component flags
3. LLM formats: Lesson cards with links, component availability

**Index requirements**:

- Component availability flags ❌ (not yet implemented)
- Content guidance structure ❌ (not yet implemented)

#### Pattern 4: Cross-Cutting Query RAG

**Use case**: "What geometry concepts are covered in Year 3 and Year 7?"

**Flow**:

1. Query: "geometry Year 3 Year 7 concepts"
2. ES retrieves: Units from geometry-and-measure thread, filtered by year
3. LLM compares: Concept coverage, progression, prerequisites

**Index requirements**:

- Thread fields ❌ (planned)
- Year fields ✅ (existing)
- Prior knowledge fields ❌ (not in current schema)

### Implementation with Elastic

#### Option 1: Custom RAG Pipeline

Build RAG using Elasticsearch queries + LLM integration:

```typescript
async function ragQuery(question: string): Promise<RagResponse> {
  // 1. Retrieve relevant documents
  const esResults = await esClient.search({
    index: ['oak_lessons', 'oak_units', 'oak_ontology'],
    query: {
      hybrid: {
        queries: [
          { match: { content_text: question } },
          { semantic: { query: question, field: 'content_semantic' } },
        ],
      },
    },
    rrf: { rank_constant: 60, window_size: 100 },
    size: 10,
  });

  // 2. Build context from results
  const context = esResults.hits.hits.map((h) => h._source.content_text).join('\n\n');

  // 3. Generate response with LLM
  const response = await llm.generate({
    prompt: `Based on the following Oak curriculum content, answer the question.
    
Context:
${context}

Question: ${question}

Answer (cite specific lessons/units):`,
  });

  return {
    answer: response.text,
    sources: esResults.hits.hits.map((h) => ({
      id: h._id,
      title: h._source.title,
      url: h._source.canonical_url,
    })),
  };
}
```

#### Option 2: Elastic Playground

Use Elastic's Playground for RAG without custom code:

1. Create indices with semantic_text fields
2. Configure Playground in Kibana
3. Define custom instructions for Oak domain
4. Test queries interactively
5. Export Python code for integration

**Pros**: Fast iteration, no custom code, built-in UI
**Cons**: Requires Kibana, less control, harder to test

#### Option 3: Agent Builder Tools

Register custom tools in Elastic Agent Builder:

1. Define "search-curriculum" tool in Kibana UI
2. Configure tool parameters (subject, key stage, etc.)
3. Agent Builder handles RAG orchestration
4. Access via MCP endpoint

**Pros**: Integrated with Elastic MCP, built-in RAG
**Cons**: Schema-first violation, Kibana dependency

### RAG-Specific Index Enhancements

To fully support RAG, indices need:

| Field              | Purpose                       | Current    | Needed           |
| ------------------ | ----------------------------- | ---------- | ---------------- |
| `semantic_text`    | Embedding generation          | ✅ Defined | ❌ Not populated |
| `content_summary`  | LLM context window efficiency | ❌         | ✅ Add           |
| `canonical_url`    | Source citation               | ✅ Defined | ❌ Not populated |
| `last_updated`     | Freshness indicator           | ❌         | ✅ Add           |
| `confidence_score` | Result ranking hint           | ❌         | ⚠️ Consider      |

---

## 4. Current Deployment State

### Critical Point: Indexes Are Not Yet Deployed

**Current State**:

- Index mappings are **defined** in `scripts/mappings/*.json`
- Index document schemas are **generated** in SDK
- Ingestion scripts are **written** but not run against production
- **NO indexes exist** on any Elasticsearch Serverless instance

This means:

- All semantic search testing has been against **fixtures**
- No real data has been indexed
- Semantic embeddings have never been generated
- RRF queries have never run against real data

### What's Required for Deployment

#### 1. Elasticsearch Serverless Instance

- Create project via Elastic Cloud console or API
- Configure endpoints (ES + Kibana if needed)
- Generate API keys with appropriate permissions

#### 2. Index Creation

```bash
# From apps/oak-open-curriculum-semantic-search
./scripts/setup.sh
```

This creates:

- `oak_lessons` - Lesson documents
- `oak_units` - Unit documents
- `oak_unit_rollup` - Aggregated unit text
- `oak_sequences` - Sequence documents

#### 3. Synonym Set

```bash
curl -X PUT "${ES_URL}/_synonyms/oak-syns" \
  -H "Authorization: ApiKey ${ES_API_KEY}" \
  -d @scripts/synonyms.json
```

#### 4. Ingestion

```bash
# Trigger ingestion (requires API key)
curl -X GET "http://localhost:3000/api/index-oak" \
  -H "Authorization: Bearer ${SEARCH_API_KEY}"
```

This:

- Fetches all subjects, sequences, units, lessons from Oak Curriculum API
- Transforms to index document format
- Bulk indexes with semantic_text fields (triggers embedding generation)
- Swaps aliases for zero-downtime updates

#### 5. Verification

- Confirm index counts match expected curriculum size
- Test semantic queries return relevant results
- Verify RRF ranking works as expected
- Check suggestion completion fields

### Deployment Blockers

| Blocker              | Status          | Resolution                       |
| -------------------- | --------------- | -------------------------------- |
| ES instance          | Not provisioned | Create via Elastic Cloud         |
| API keys             | Not generated   | Generate with appropriate scopes |
| Ingestion tested     | Only fixtures   | Run against real ES              |
| Embeddings generated | Never           | First ingestion will trigger     |
| RRF tuning           | Untested        | Requires real data               |
| Cost monitoring      | Not set up      | Configure alerts                 |

### Deployment Sequence

1. **Provision ES Serverless** → Get endpoints + API keys
2. **Create indexes** → Run setup.sh
3. **Ingest subset** → Test with single subject first
4. **Verify queries** → Check RRF, embeddings, suggestions
5. **Full ingestion** → All subjects, all key stages
6. **Monitor** → Costs, latency, error rates
7. **Production cutover** → DNS, load balancing

---

## Summary: Unified Architecture Vision

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              AI Agents / MCP Clients                        │
└────────────────────────────────────────────────────────────────────────────┘
                                        │
            ┌───────────────────────────┼───────────────────────────┐
            ▼                           ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│   Curriculum MCP      │   │  Semantic Search MCP   │   │  (Future) Elastic     │
│   (stdio/streamable)  │   │  (optional direct)     │   │  Agent Builder MCP    │
│                       │   │                        │   │                        │
│ Tools:                │   │ Tools:                 │   │ Tools:                │
│ - search (enhanced)   │◄──│ - semantic-search      │   │ - ES-native search    │
│ - fetch               │   │ - nl-search            │   │ - RAG patterns        │
│ - get-ontology        │   │ - suggest              │   │ - Custom Oak tools    │
│ - get-help            │   └───────────────────────┘   └───────────────────────┘
│ - get-knowledge-graph │               │                           │
│ - semantic-search ────┼───────────────┘                           │
│   (aggregated)        │                                           │
└───────────────────────┘                                           │
            │                                                       │
            ▼                                                       │
┌───────────────────────┐                                           │
│  Oak Curriculum API   │                                           │
│  (upstream)           │                                           │
└───────────────────────┘                                           │
                                                                    │
┌────────────────────────────────────────────────────────────────────┘
│                      Elasticsearch Serverless                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │ oak_lessons │  │ oak_units   │  │ oak_unit_   │  │ oak_       │ │
│  │             │  │             │  │ rollup      │  │ sequences  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
│  ┌─────────────┐  ┌─────────────┐                                  │
│  │ oak_threads │  │ oak_        │  (Future indices)                │
│  │ (planned)   │  │ ontology    │                                  │
│  └─────────────┘  └─────────────┘                                  │
└────────────────────────────────────────────────────────────────────┘
```

### Next Steps

1. **Provision ES Serverless** and run initial ingestion
2. **Add ontology index** for domain knowledge RAG
3. **Implement thread fields** in content indices
4. **Add `semantic-search` aggregated tool** to SDK
5. **Enhance `search` tool** with mode parameter
6. **Test RAG patterns** with real data
7. **Evaluate Elastic Agent Builder** if Kibana deployed

---

## References

- [Semantic Search Plans Review](./semantic-search-plans-review.md)
- [Elastic MCP Integration Evaluation](./elastic-mcp-integration-evaluation.md)
- [Ontology Implementation Gaps](./ontology-implementation-gaps.md)
- [Elasticsearch RAG Documentation](../../reference-docs/elasticsearch/elasticsearch-rag-index.md)
- [Elasticsearch Tools and APIs](../../reference-docs/elasticsearch/elasticsearch-tools-and-apis.md)
