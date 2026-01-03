# MCP Search Tool

**Status**: 📋 Planned — Prerequisite: SDK extraction complete
**Priority**: HIGH — Key consumer of Search SDK
**Parent**: [README.md](README.md) | [../roadmap.md](../roadmap.md)
**Created**: 2026-01-03 (Extracted from mcp-graph-tools.md and research)

---

## Overview

Expose the Search SDK capabilities via MCP tools for AI agent consumption.

**Prerequisite**: [SDK Extraction](../sdk-extraction/search-sdk-cli.md) must complete first.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MCP Server Layer                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                MCP Tool Definitions                      ││
│  │  - search-curriculum (structured search)                 ││
│  │  - suggest-completions (typeahead)                       ││
│  │  - get-lesson (by slug)                                  ││
│  │  - get-thread-progression (learning path)                ││
│  └─────────────────────────────────────────────────────────┘│
│                            │                                 │
│                            ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │             NL → Structured Query Mapping                ││
│  │  (lives in MCP layer, NOT in SDK)                       ││
│  └─────────────────────────────────────────────────────────┘│
└────────────────────────────│─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Search SDK                               │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────────┐  │
│  │   Retrieval   │ │    Admin      │ │   Observability   │  │
│  │   Service     │ │    Service    │ │   Service         │  │
│  └───────────────┘ └───────────────┘ └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## MCP Tools to Create

### Tool 1: search-curriculum

Core search tool for finding curriculum resources:

```typescript
{
  name: 'search-curriculum',
  description: 'Search Oak curriculum for lessons and units',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      subject: { type: 'string', description: 'Filter by subject slug' },
      keyStage: { type: 'string', description: 'Filter by key stage slug' },
      resourceType: { 
        type: 'string', 
        enum: ['lesson', 'unit', 'all'],
        default: 'all' 
      },
      limit: { type: 'number', default: 10 },
    },
    required: ['query'],
  },
}
```

### Tool 2: suggest-completions

Typeahead suggestions for search:

```typescript
{
  name: 'suggest-completions',
  description: 'Get search completion suggestions',
  inputSchema: {
    type: 'object',
    properties: {
      prefix: { type: 'string', description: 'Partial query text' },
      limit: { type: 'number', default: 5 },
    },
    required: ['prefix'],
  },
}
```

### Tool 3: get-thread-progression

Get learning path for a curriculum thread:

```typescript
{
  name: 'get-thread-progression',
  description: 'Get ordered units in a curriculum thread',
  inputSchema: {
    type: 'object',
    properties: {
      threadSlug: { type: 'string', description: 'Thread identifier' },
      subject: { type: 'string', description: 'Filter by subject' },
    },
    required: ['threadSlug'],
  },
}
```

### Tool 4: get-prerequisite-graph (already exists)

Already implemented in Curriculum SDK MCP server.

---

## NL Mapping Responsibility

**Critical design decision**: Natural language understanding stays in the MCP layer.

| Layer      | Responsibility                                 |
| ---------- | ---------------------------------------------- |
| MCP        | NL → structured query mapping, tool examples   |
| SDK        | Execute structured queries, return typed results |

### Example NL Mapping

```typescript
// MCP layer transforms user intent to SDK call
const nlMapping = {
  "Find lessons about fractions for Year 5": {
    tool: 'search-curriculum',
    args: {
      query: 'fractions',
      keyStage: 'ks2',
      resourceType: 'lesson',
    },
  },
  "What should students learn before quadratics?": {
    tool: 'get-thread-progression',
    args: { threadSlug: 'algebra' },
  },
};
```

---

## Tool Examples (Critical for AI Agents)

Comprehensive tool examples guide AI agent behaviour:

```typescript
const searchCurriculumExamples = [
  {
    description: "Finding lessons on a specific topic",
    input: { query: "photosynthesis", resourceType: "lesson" },
    reasoning: "User wants lesson resources about photosynthesis",
  },
  {
    description: "Finding KS3 science units",
    input: { query: "cells", subject: "science", keyStage: "ks3" },
    reasoning: "Filtered search for specific subject and key stage",
  },
  {
    description: "Cross-subject vocabulary search",
    input: { query: "evaluate" },
    reasoning: "Multi-subject term, don't filter by subject",
  },
];
```

---

## Integration with Existing MCP Server

The search tools will be added to the existing Express MCP server at `apps/mcp-servers/ooc-http-dev-local/`.

```typescript
// Add to tool registry
import { createSearchSdk } from '@oaknational/search-sdk';

const searchSdk = createSearchSdk({
  esClient: elasticsearchClient,
  config: searchConfig,
});

// Register search tools
server.addTool({
  name: 'search-curriculum',
  handler: async (args) => {
    const results = await searchSdk.retrieval.search(args);
    return formatMcpResult(results);
  },
});
```

---

## Success Criteria

- [ ] `search-curriculum` tool implemented and tested
- [ ] `suggest-completions` tool implemented and tested
- [ ] `get-thread-progression` tool implemented and tested
- [ ] Comprehensive tool examples for all tools
- [ ] NL mapping tested in MCP layer
- [ ] Integration tests for MCP → SDK flow
- [ ] All quality gates pass

---

## Related Documents

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [../sdk-extraction/search-sdk-cli.md](../sdk-extraction/search-sdk-cli.md)                    | SDK extraction spec  |
| [../roadmap.md](../roadmap.md)                                                                | Master roadmap       |
| [mcp-agent-integration.md](../../../research/elasticsearch/methods/mcp-agent-integration.md)  | MCP patterns research |

