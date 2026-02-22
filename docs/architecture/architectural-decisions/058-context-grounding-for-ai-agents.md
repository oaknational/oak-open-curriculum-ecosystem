# ADR-058: Context Grounding for AI Agents

## Status

Accepted

## Context

AI agents using the Oak MCP server often jump straight into calling curriculum tools without first understanding the domain model. This leads to:

- Incorrect parameter formats (e.g., wrong ID patterns like `lesson:slug`)
- Misunderstanding of entity hierarchy (subject → unit → lesson)
- Suboptimal tool selection
- Repeated trial-and-error interactions

The Oak curriculum has specific structures (key stages KS1-KS4, subjects, units, lessons) and ID formats (`type:slug`) that agents need to understand before they can effectively query the API.

### OpenAI Apps SDK Data Flow

Per the [OpenAI Apps SDK Reference](https://developers.openai.com/apps-sdk/reference#tool-results), tool responses have three fields with different visibility:

| Field               | Model Sees | Widget Sees | Purpose                       |
| ------------------- | ---------- | ----------- | ----------------------------- |
| `structuredContent` | ✅ Yes     | ✅ Yes      | Full data for model reasoning |
| `content`           | ✅ Yes     | ✅ Yes      | Human-readable summary        |
| `_meta`             | ❌ No      | ✅ Yes      | Widget-only data              |

This means any context guidance placed in `_meta` is invisible to the model—it can only be seen by the widget.

### MCP Primitive Audiences

MCP primitives have different control models and audiences:

| Primitive     | Control                | Who Controls            | Model Sees Directly?                           |
| ------------- | ---------------------- | ----------------------- | ---------------------------------------------- |
| **Tools**     | Model-controlled       | LLM decides to call     | Yes (tools/list, structuredContent)            |
| **Resources** | Application-controlled | Client app surfaces     | No (unless app injects into context)           |
| **Prompts**   | User-controlled        | User explicitly invokes | No (user sees options, model receives message) |

**Implication for ChatGPT**: ChatGPT does not automatically surface resources to the model. The `curriculum://ontology` resource exists for other MCP clients that do surface resources (e.g., Claude Desktop, custom clients). For ChatGPT, the primary context path is through the `get-ontology` tool.

**Implication for Prompts**: Prompts are user-initiated. When a user invokes a prompt, they may not know about context tools. The prompt message (which the model receives) should suggest calling `get-help` or `get-ontology` first.

### Dual Exposure Pattern

The ontology is exposed via both primitive types:

- `get-ontology` tool - Model-controlled, for ChatGPT and agents that request context on-demand
- `curriculum://ontology` resource - Application-controlled, for clients that pre-inject context

### Workflows for Agent Guidance

Agents benefit from structured workflows that show how to combine tools for common tasks. These workflows are defined once in `tool-guidance-data.ts` and imported by `ontology-data.ts`, ensuring a single source of truth.

## Decision

Implement a multi-layered context grounding system that guides AI agents to call `get-ontology` and `get-help` before using curriculum tools. The guidance appears in all model-visible locations:

### 1. Tool Descriptions (tools/list)

Each tool's description includes prerequisite guidance:

```typescript
const AGGREGATED_PREREQUISITE_GUIDANCE =
  "PREREQUISITE: If unfamiliar with Oak's curriculum structure, call `get-ontology` first...";
```

### 2. Widget Description (component load)

The widget resource includes guidance in `openai/widgetDescription`:

```typescript
const WIDGET_DESCRIPTION =
  'Oak curriculum explorer. For best results, call get-ontology and get-help first...';
```

### 3. `oakContextHint` in structuredContent (every response)

Every tool response includes a hint in `structuredContent` (which the model sees):

```typescript
export const OAK_CONTEXT_HINT =
  'For optimal results with Oak curriculum tools, call get-ontology and get-help first.' as const;
```

### 4. Workflows in `structuredContent` (agent guidance)

Workflows are returned via `get-ontology` and `get-help` in `structuredContent`, providing agents with step-by-step guidance. The foundational workflow is `userInteractions`:

```typescript
userInteractions: {
  title: 'When finding or presenting Oak content for the user',
  steps: [
    { step: 1, action: 'Use get-help to understand Oak context', tool: 'get-help' },
    { step: 2, action: 'Use get-ontology to understand the curriculum', tool: 'get-ontology' },
    { step: 3, action: 'Use discovery/browsing tools to explore' },
    { step: 4, action: 'Use fetching tools to get content' },
  ],
}
```

**Single Source of Truth**: All workflows are defined in `tool-guidance-data.ts` and imported by `ontology-data.ts`. This ensures:

- Consistent workflow definitions across `get-help` and `get-ontology` responses
- New workflows automatically appear in both tools
- Workflows include `returns` field describing what each step returns

**Available Workflows**:

| Workflow           | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `userInteractions` | Foundation: call get-help/get-ontology first |
| `findLessons`      | Search for lessons and retrieve details      |
| `lessonPlanning`   | Gather materials for lesson planning         |
| `browseSubject`    | Explore curriculum structure by subject      |
| `trackProgression` | Follow concept development across years      |

### Implementation by Tool Type

**Aggregated Tools** (`search`, `fetch`, `get-ontology`, `get-help`):

- Use `formatOptimizedResult()` which **always** includes `oakContextHint`
- Full data in `structuredContent` for model reasoning
- Human-readable summary in `content`

**Generated Tools** (curriculum API endpoints):

- Use `formatDataWithContext()` with `includeContextHint` flag
- Flag is set based on `requiresDomainContext` in tool descriptor
- `requiresDomainContext: true` for auth-required tools (curriculum content)
- `requiresDomainContext: false` for utility tools (`get-rate-limit`, `get-changelog`)

### Tool Descriptor Flag

The generator emits `requiresDomainContext` based on authentication requirements:

```typescript
// In emit-index.ts
const requiresDomainContext = securitySchemes[0]?.type !== NOAUTH_SCHEME_TYPE;
lines.push(`  requiresDomainContext: ${requiresDomainContext ? 'true' : 'false'},`);
```

This ensures:

- Curriculum tools → include context hint
- Utility tools → no hint (they don't need domain context)

## Rationale

1. **Multiple touchpoints**: Agents see guidance at discovery time (tool descriptions), widget load time (widget description), and every response (structuredContent). This redundancy ensures the message gets through.

2. **Model-visible placement**: All guidance is in `structuredContent` or tool descriptions—places the model actually sees. Previous approach of putting guidance in `_meta` was ineffective because the model never sees `_meta`.

3. **OpenAI Apps SDK alignment**: Following the official pattern where `structuredContent` contains data for model reasoning, `content` contains human-readable summaries, and `_meta` contains widget-only metadata.

4. **Generator-driven for generated tools**: The `requiresDomainContext` flag is determined at type-gen time based on auth requirements, following the schema-first principle.

5. **Automatic for aggregated tools**: Any new aggregated tool using `formatOptimizedResult()` automatically gets context grounding without per-tool changes.

6. **Single source of truth for workflows**: Workflows are defined once in `tool-guidance-data.ts` and consumed by both `get-help` and `get-ontology`. This prevents duplication and ensures consistency.

## Consequences

### Positive

- **Better agent behaviour**: Agents are guided to call `get-ontology` first, leading to more effective tool usage
- **Automatic coverage**: New tools automatically get context grounding
- **Schema-first compliance**: Generated tools get flags from the generator, not runtime code
- **Full data access**: Model gets complete data in `structuredContent` for reasoning
- **Consistent workflows**: Single source of truth ensures agents see the same workflows everywhere
- **Extensible**: New workflows can be added to `tool-guidance-data.ts` and automatically appear in responses

### Negative

- **Increased response size**: Every response includes the hint string (minimal overhead)
- **Repetitive guidance**: Agent sees the hint in every response (necessary for stateless interactions)

### Neutral

- **Utility tools excluded**: `get-rate-limit`, `get-changelog` etc. don't include hints (intentional—they don't need domain context)
- **Workflows in structuredContent only**: Workflows are for agent reasoning, not widget display

## Related Decisions

- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md) - Type generation principles
- [ADR-035: Unified SDK-MCP Type Generation](035-unified-sdk-mcp-type-generation.md) - Generator architecture
- [ADR-037: Embedded Tool Information](037-embedded-tool-information.md) - Tool descriptor patterns

## References

- [OpenAI Apps SDK Reference - Tool Results](https://developers.openai.com/apps-sdk/reference#tool-results)
- [Context Grounding Optimization Plan](/.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/16-context-grounding-optimization.md)
