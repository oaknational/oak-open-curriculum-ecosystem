# MCP and Agent Integration Patterns

This note describes method patterns for exposing search capabilities to AI agents via MCP, without tying the approach to a specific system.

## 1. Tool Design Principles

- Keep tools small and explicit (search, fetch, suggest, explore-graph).
- Accept structured inputs; let the agent handle natural language interpretation.
- Return structured results plus citations or source identifiers.

## 2. Retrieval + RAG Separation

- Retrieval tools should return ranked results and snippets.
- RAG tools should be separate, combining retrieval output with LLM synthesis.

This separation keeps retrieval deterministic and testable.

## 3. Patterns for Elastic-Based Tools

Common tool set:

- `search` - hybrid retrieval over content indices.
- `suggest` - typeahead and spelling corrections.
- `explore_graph` - co-occurrence and relationship discovery.
- `ask` - RAG wrapper that synthesises answers with citations.

## 4. MCP Server Options

Two common approaches:

- Custom MCP server that calls Elasticsearch directly.
- Elastic Agent Builder MCP server when you already operate Kibana.

## References

- MCP server (Elastic Agent Builder): https://www.elastic.co/docs/solutions/search/agent-builder/mcp-server
