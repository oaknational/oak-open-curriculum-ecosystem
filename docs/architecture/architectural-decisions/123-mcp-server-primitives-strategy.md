# ADR-123: MCP Server Primitives Strategy

## Status

Accepted

## Context

The MCP specification defines three server primitives with distinct control models:

| Primitive     | Control Model          | Who Decides When to Use It         |
| ------------- | ---------------------- | ---------------------------------- |
| **Tools**     | Model-controlled       | The AI model decides to call them  |
| **Resources** | Application-controlled | The host application surfaces them |
| **Prompts**   | User-controlled        | The user explicitly invokes them   |

Our MCP server exposes curriculum capabilities through all three primitives. [ADR-058](058-context-grounding-for-ai-agents.md) documents the dual-exposure pattern for context grounding (tool + resource), but no ADR covers the broader strategy for how we map curriculum capabilities to these three primitive types and why.

This ADR fills that gap: it documents which curriculum capabilities are exposed through which primitive, the rationale for each placement, and the selection criteria for prompts.

## Decision

### Tools (model-controlled)

31 curriculum tools: 23 generated from the OpenAPI schema plus 8 aggregated tools (search, browse, fetch, explore, graph/orientation tools, and `download-asset`). The model decides when to call them based on the user's question.

- **Generated tools** (23) are produced at SDK compile time from the OpenAPI schema. When the upstream API changes, `pnpm sdk-codegen` updates the tool definitions automatically.
- **Aggregated tools** (8) are hand-authored compositions that orchestrate API calls, search, and reference data. These include `search`, `fetch`, `browse-curriculum`, `explore-topic`, `get-thread-progressions`, `get-prerequisite-graph`, `get-curriculum-model` (domain ontology and tool usage guidance), and `download-asset`.

**Intent**: Let AI assistants search, browse, and fetch curriculum data autonomously.

**Impact**: Agents can answer teacher questions about the curriculum without human tool orchestration.

### Resources (application-controlled)

Three resources for clients that support resource injection:

| Resource URI                       | Content                    | Priority | Audience        |
| ---------------------------------- | -------------------------- | -------- | --------------- |
| `curriculum://model`               | Domain ontology + guidance | 1.0      | `["assistant"]` |
| `curriculum://prerequisite-graph`  | Unit dependency data       | 0.5      | `["assistant"]` |
| `curriculum://thread-progressions` | Learning progression data  | 0.5      | `["assistant"]` |

The host application decides whether and how to inject these into the model's context.

A fourth resource serves the interactive MCP App widget:

| Resource URI                    | Content              | Priority | Audience  |
| ------------------------------- | -------------------- | -------- | --------- |
| `ui://widget/oak-banner-*.html` | React MCP App (HTML) | —        | `["app"]` |

This resource uses `text/html;profile=mcp-app` content type and is registered via `registerAppResource` per [ADR-141](141-mcp-apps-standard-primary.md). CSP declarations for external fonts are included via `_meta.ui.csp.resourceDomains` on the content item.

**Intent**: Clients that support resource auto-injection get orientation data without a tool call.

**Impact**: Reduced latency for first-turn responses in capable clients (e.g., Claude Desktop). For clients that do not surface resources (e.g., ChatGPT), the `get-curriculum-model` tool provides the same orientation data on-demand.

See [ADR-058](058-context-grounding-for-ai-agents.md) for the dual-exposure rationale.

### Prompts (user-controlled)

Four parameterised workflow templates that the user explicitly invokes (slash commands, UI buttons):

| Prompt                 | Arguments        | Workflow                                           |
| ---------------------- | ---------------- | -------------------------------------------------- |
| `find-lessons`         | topic, keyStage? | Search lessons, summarise top results              |
| `lesson-planning`      | topic, yearGroup | Search, get summary/transcript/quiz/assets         |
| `explore-curriculum`   | topic, subject?  | Broad parallel search across lessons/units/threads |
| `learning-progression` | concept, subject | Search threads, map progression, identify gaps     |

Each prompt's first instruction tells the model to call `get-curriculum-model` for orientation.

**Intent**: Structure common teacher workflows so the model follows a proven multi-step recipe instead of improvising.

**Impact**: Consistent, high-quality responses for the four most common curriculum queries.

### Prompt selection criteria

A prompt earns its place when it:

1. **Orchestrates multiple tools** in a specific sequence
2. **Serves a distinct user intent** not covered by another prompt
3. **Adds structure** the user would otherwise have to describe manually

### Deduplication: `progression-map` removed

`progression-map` and `learning-progression` were near-duplicates: same arguments (`concept`, `subject`), same tool sequence (search threads → get progressions → map dependencies → suggest scaffolding), same output shape. `learning-progression` additionally references `get-thread-progressions` and `get-prerequisite-graph` explicitly and includes gap-identification guidance. It is strictly more complete. `progression-map` was removed.

## Consequences

### Positive

- **Clear primitive mapping**: Each curriculum capability is exposed through the MCP primitive whose control model matches the intended interaction pattern
- **No dead code**: Every prompt defined in the SDK is registered at the app layer, has a Zod schema, and is E2E tested
- **No duplication**: Overlapping prompts have been consolidated
- **Documented selection criteria**: Future prompt additions can be evaluated against explicit criteria rather than ad-hoc judgement

### Negative

- **Removing a prompt is a breaking change** for any client that references it by name. Mitigated by the fact that the server is in private alpha and no external clients depend on `progression-map`.

### Neutral

- **Prompt count is intentionally small** (4). More prompts may be added post-alpha as real usage patterns emerge.

## Related Decisions

- [ADR-058: Context Grounding for AI Agents](058-context-grounding-for-ai-agents.md) — dual-exposure pattern for orientation data (tool + resource)
- [ADR-060: Agent Support Tool Metadata System](060-agent-support-metadata-system.md) — metadata annotations for tool guidance
- [ADR-107: Deterministic SDK / NL-in-MCP Boundary](107-deterministic-sdk-nl-in-mcp-boundary.md) — where deterministic data ends and natural language begins

## References

- [MCP Specification: Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [MCP Specification: Resources](https://modelcontextprotocol.io/specification/2025-06-18/server/resources)
- [MCP Specification: Prompts](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts)
- [MCP Server Concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)
