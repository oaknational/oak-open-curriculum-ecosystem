# Seeing From the Client's Perspective

_Date: 2026-02-19_
_Tags: architecture | debugging | system-thinking | mcp_

## What happened (brief)

- Investigated why `search-sdk` returned "Unknown tool" despite appearing in `tools/list`. Found `isAggregatedToolName` had drifted from the definitions it was supposed to guard.
- Discovered that the MCP tools had two entirely separate response formatting functions (`formatDataWithContext` for generated tools, `formatOptimizedResult` for aggregated tools), producing different output shapes. Neither had tests asserting the shape.
- Called the server directly via `curl` to see what actually came back. Found that the tools put structured data in `structuredContent` — but the AI client only reads `content[0].text`. The carefully constructed structured payload was invisible to the consumer.
- Found that search results returned 186 KB for 5 lessons because Elasticsearch was returning the full `lesson_content` field with no `_source` filtering.

## What it was like

The `isAggregatedToolName` bug was humbling. A manually maintained list had silently fallen behind the data it was supposed to represent. The fix — `value in AGGREGATED_TOOL_DEFS` — was obvious in hindsight. The lesson is older than software: don't maintain a shadow of the truth when the truth is right there.

The response format investigation was different. Each component worked correctly in isolation. `formatDataWithContext` produced valid MCP responses. `formatOptimizedResult` produced valid MCP responses. The Elasticsearch query returned valid data. The MCP server serialised everything correctly. But nobody had traced the full path from server to client and asked: "what does the consumer actually see?"

The answer was: a JSON blob with no summary. The client reads `content[0].text` — and both formatting functions put raw JSON there. The `structuredContent` field, which had the carefully typed data, was invisible to the conversation. The tools were technically correct and practically useless for conveying meaning to the model reading them.

This felt like a classic integration gap. Not a bug in any component. A gap between components, visible only from the consumer's vantage point. The shift was from "does each piece work?" to "does the whole thing make sense to its reader?"

## What emerged

The response format drift was the most interesting finding. Two formatting functions, written at different times for different tool types, had never been compared. They produced structurally different outputs for the same protocol. The generated tools had no summary at all. The aggregated tools had summaries but put them in different places. Neither was wrong — they just weren't unified, and the protocol allows both approaches. The work ahead is to decide what a response _should_ look like and enforce it once.

The Elasticsearch `_source` issue was the simplest finding but possibly the most impactful. Not filtering `_source` meant every search hit carried its full lesson content — text designed for human reading, not for search result metadata. The fix is a one-line exclusion. The lesson: when you build a search pipeline, ask what fields the consumer actually needs, not what fields the database happens to have.

## Technical content

Patterns extracted to `distilled.md` and/or plans:
- `isAggregatedToolName` must derive from `AGGREGATED_TOOL_DEFS`, not a manual list
- MCP clients read `content[0].text`; `structuredContent` is for programmatic/widget use
- Two formatting functions (`formatDataWithContext`, `formatOptimizedResult`) need unification
- ES `_source` filtering should exclude `lesson_content` and `lesson_content_semantic`
