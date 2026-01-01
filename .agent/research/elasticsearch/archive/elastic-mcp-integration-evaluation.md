# Elastic MCP Integration Evaluation

_Date: 2025-12-04_
_Status: RESEARCH - REQUIRES DECISION_

## Overview

Elasticsearch now offers two MCP server options that could potentially integrate with or replace our custom MCP tool implementation for semantic search. This document evaluates the options and their alignment with our architecture.

---

## Option 1: Elastic Agent Builder MCP Server

**Availability**: Elasticsearch 9.2+ and Serverless deployments

**Endpoint**: `{KIBANA_URL}/api/agent_builder/mcp`

### Capabilities

From [Elastic documentation](https://www.elastic.co/docs/solutions/search/agent-builder/mcp-server):

- Exposes all built-in and custom Elastic Agent Builder tools
- Supports RAG patterns
- Native semantic search capabilities
- Custom tool registration
- Full MCP protocol compliance

### Requirements

- **Kibana deployment** - The MCP endpoint is served by Kibana, not Elasticsearch directly
- **API key with Kibana privileges** - Requires `kibana-.kibana` application privileges
- **Elasticsearch 9.2+** or Serverless

### Configuration Example

```json
{
  "mcpServers": {
    "elastic-agent-builder": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "${KIBANA_URL}/api/agent_builder/mcp",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "KIBANA_URL": "${KIBANA_URL}",
        "AUTH_HEADER": "ApiKey ${API_KEY}"
      }
    }
  }
}
```

### Pros

- **Maintained by Elastic** - Professional support, updates with ES releases
- **Native integration** - Deep integration with ES features (semantic_text, RRF, etc.)
- **Custom tools** - Can register custom tools in Kibana UI
- **RAG out-of-box** - Built-in patterns for retrieval-augmented generation
- **Lower maintenance** - Less code to maintain ourselves

### Cons

- **Kibana dependency** - We currently use ES Serverless directly; adding Kibana is additional infrastructure
- **Less type safety** - Tools are defined in Kibana, not generated from OpenAPI
- **Schema-first violation** - Tool definitions wouldn't flow from our OpenAPI schema
- **Coupling** - Tight coupling to Elastic's tool abstractions
- **Proxy requirement** - Serverless ES requires proxy; Kibana would add another layer

---

## Option 2: mcp-server-elasticsearch Package

**Repository**: `elastic/mcp-server-elasticsearch`

**Purpose**: MCP server for older ES versions without Agent Builder

### Capabilities

- Basic Elasticsearch querying through MCP
- Index listing and document retrieval
- Search execution
- Limited tool set compared to Agent Builder

### Requirements

- Any Elasticsearch version
- Node.js runtime for MCP server

### Pros

- **No Kibana required** - Works directly with ES
- **Reference implementation** - Useful patterns for ES-MCP integration
- **Simpler** - Less feature-rich but easier to understand

### Cons

- **Limited features** - Fewer tools than Agent Builder
- **Older versions focus** - Designed for pre-9.2 ES
- **Still external** - Another dependency to manage

---

## Option 3: Current Approach (Custom Generated Tools)

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/`

### Current Capabilities

- **26 MCP tools** generated from OpenAPI schema
- Full type safety with args/result types
- Generated stubs for testing
- Schema-first compliance
- Integrated with Oak Curriculum API

### Search-Related Tools

```
get-search-lessons   - Search lessons by text similarity
get-search-transcripts - Search transcripts
```

### Pros

- **Schema-first** - All types flow from OpenAPI at type-gen time
- **Full type safety** - Args, results, guards all generated
- **Oak API aligned** - Tools match our curriculum data model
- **No additional infrastructure** - Works with existing ES deployment
- **Testable** - Generated stubs enable comprehensive testing

### Cons

- **More maintenance** - We maintain the generators
- **Limited ES features** - Current tools use SDK API, not direct ES queries
- **No native RAG** - Would need custom implementation

---

## Architectural Analysis

### Cardinal Rule Alignment

From `.agent/directives-and-memory/rules.md`:

> ALL static data structures, types, type guards, Zod schemas, and other type related information MUST flow from the Open Curriculum OpenAPI schema in the SDK.

**Option 1 (Agent Builder)**: ❌ Tools defined in Kibana UI, not from OpenAPI
**Option 2 (mcp-server-elasticsearch)**: ❌ External tool definitions
**Option 3 (Current)**: ✅ Fully compliant, generated from OpenAPI

### Schema-First Execution

From `.agent/directives-and-memory/schema-first-execution.md`:

> The generator is the single source of truth.

**Option 1**: ❌ Kibana is source of truth for tool definitions
**Option 2**: ❌ Package is source of truth
**Option 3**: ✅ Generators are source of truth

### Testing Strategy

**Option 1**: Complex - requires Kibana, harder to stub
**Option 2**: Moderate - external server to mock
**Option 3**: ✅ Easy - generated stubs, integration tests work

---

## Hybrid Approach Consideration

Could we use **both** our generated tools AND Elastic's MCP for different purposes?

### Scenario A: Oak API via Generated Tools + ES Direct via Elastic MCP

- Use generated tools for curriculum data (subjects, lessons, units, etc.)
- Use Elastic MCP for direct ES queries (semantic search, aggregations)

**Pros**: Best of both worlds
**Cons**: Two MCP server integrations, complexity, testing burden

### Scenario B: Generated Tools with ES Client Internally

- Keep current generated tools approach
- Enhance tools to use ES client internally where needed
- Semantic search tool calls ES directly for RRF queries

**Pros**: Single source of truth, type safety maintained
**Cons**: More generator complexity, ES client management

---

## Recommendation

**Short Term (Next Quarter)**: Continue with Option 3 (Current Approach)

Rationale:

1. Schema-first architecture is non-negotiable
2. Current tools work and are well-tested
3. Adding Kibana for Agent Builder is significant infrastructure change
4. Ontology features (threads, programme factors) are higher priority

**Medium Term (6+ Months)**: Evaluate Elastic Agent Builder when:

1. Ontology features are complete
2. Production ES deployment is finalized
3. RAG requirements become clearer
4. We naturally need Kibana for other purposes

**Action Items**:

1. **No immediate change** to MCP architecture
2. **Monitor** Elastic Agent Builder development
3. **Document** this decision in ADR format if team agrees
4. **Revisit** after ontology implementation complete

---

## Questions for Stakeholders

1. Is Kibana deployment planned for any other purpose?
2. What are the RAG requirements for MCP tools?
3. Is direct ES access from MCP tools needed, or is SDK API sufficient?
4. What's the timeline pressure for semantic search MCP integration?

---

## References

- [Elastic MCP Index](../../reference-docs/elasticsearch/elasticsearch-mcp-index.md)
- [Agent Builder MCP Server](../../reference-docs/elasticsearch/elasticsearch-agent-builder-mcp-server.md)
- [Agent Builder Index](../../reference-docs/elasticsearch/elasticsearch-agent-builder-index.md)
- [RAG Index](../../reference-docs/elasticsearch/elasticsearch-rag-index.md)
