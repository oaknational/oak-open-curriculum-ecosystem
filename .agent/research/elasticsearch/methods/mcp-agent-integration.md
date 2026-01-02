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

- Custom MCP server that calls Elasticsearch directly (preferably via the SDK).
- Elastic Agent Builder MCP server when you already operate Kibana.

## 5. Oak Integration Notes (Current)

These notes are system-specific and may drift; treat them as integration examples and check `../system/` for current status.

- Hosted API routes are retired; MCP tools should call SDK services directly rather than HTTP endpoints.
- Retrieval tools can wrap the hybrid search and suggestion modules; admin tasks remain CLI-first unless a dedicated MCP admin tool is required.

## 6. Short SDK-Based Semantic-Search Tool (No HTTP)

Design a single `semantic_search` tool that wraps the SDK retrieval service directly:

- **Inputs**: `text`, `scope` (lessons|units|sequences|all), optional filters (subject, keyStage, unitSlug, tier, examBoard, examSubject, ks4Option, year, threadSlug, category), `size`, `from`, `includeFacets`, `highlight`.
- **Output**: structured results, `total`, `took`, `timedOut`, optional facets, and any available highlights.
- **Implementation**: call the SDK retrieval service (hybrid RRF) in-process; do not proxy through HTTP.
- **Companion tool**: keep `suggest` separate so typeahead stays fast and cacheable.

## References

- MCP server (Elastic Agent Builder): https://www.elastic.co/docs/solutions/search/agent-builder/mcp-server
