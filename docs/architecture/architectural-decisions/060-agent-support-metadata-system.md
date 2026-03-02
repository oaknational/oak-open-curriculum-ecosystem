# ADR-060: Agent Support Tool Metadata System

## Status

Accepted (Revised)

> **Update (20 February 2026)**: The standalone `get-knowledge-graph` tool has since
> been removed and merged into `get-ontology` (property graph data is now embedded in
> ontology responses). This ADR remains a historical record of the metadata-system
> pattern; references to `get-knowledge-graph` below reflect the accepted-state context.
>
> **Update (1 March 2026)**: Subsequently, `get-ontology` and `get-help` were
> consolidated into `get-curriculum-model` — now the sole agent support tool. The
> metadata-system pattern (single source of truth driving generated instructions) is
> unchanged; only the tool set has simplified from three to one.

## Context

The `get-curriculum-model` agent support tool helps AI agents understand the Oak curriculum domain model before using other tools. This tool needs to be discoverable through multiple channels:

1. **Server instructions** — Delivered in MCP `initialize` response
2. **Context hints** — Included in `structuredContent` of every tool response
3. **Tool descriptions** — Prerequisite guidance in tool descriptions
4. **MCP prompts** — User-initiated workflow templates
5. **Cross-references** — Tool referencing related search/fetch tools

Without a metadata system, each channel would maintain its own hardcoded description:

```typescript
// prerequisite-guidance.ts (hardcoded)
export const SERVER_INSTRUCTIONS = `...
0. get-curriculum-model - Complete curriculum orientation...`;

// tool-guidance-data.ts (separate list)
agentSupport: {
  tools: ['get-curriculum-model'],
}
```

This creates drift risk: updating the tool's description or purpose requires touching multiple files. The metadata system eliminates this by generating all downstream surfaces from a single definition.

## Decision

Implement a **single source of truth metadata system** for agent support tools that:

1. Defines all tool metadata in one place (`agent-support-tool-metadata.ts`)
2. Generates server instructions and context hints from the metadata
3. Provides type-safe access to tool information
4. Scales to additional tools if the tool set grows in future

### Metadata Structure

```typescript
export const AGENT_SUPPORT_TOOL_METADATA = {
  'get-curriculum-model': {
    name: 'get-curriculum-model',
    shortDescription: 'Complete curriculum orientation',
    provides: ['domain model', 'tool guidance', 'key stages', 'subjects', 'entity hierarchy'],
    purpose: 'understand the Oak curriculum domain model and how to use available tools',
    callOrder: 0,
    complementsTools: [],
    invocationTrigger: 'At session start or when the agent needs curriculum orientation',
    contextHint: 'Call get-curriculum-model for the complete domain model and tool guidance',
    callAtStart: true,
  },
} as const;
```

### Field Descriptions

| Field               | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `callOrder`         | Recommended sequence (0-based; reserved for future multi-tool) |
| `complementsTools`  | Other agent support tools that work alongside this one         |
| `invocationTrigger` | When an agent should call this tool                            |
| `contextHint`       | Brief sentence reinforced in every tool response               |
| `provides`          | Specific data categories the tool returns                      |
| `purpose`           | Why an agent should call this tool                             |

### Generated Outputs

```typescript
export const SERVER_INSTRUCTIONS = generateServerInstructions();
export const OAK_CONTEXT_HINT = generateContextHint();
```

Sample generated instructions:

```markdown
Oak Curriculum MCP Server - AI Agent Guidance

For optimal results, call this agent support tool at conversation start:

0. get-curriculum-model - Complete curriculum orientation: domain model, tool guidance,
   key stages, subjects, entity hierarchy

This tool is read-only and idempotent.

- get-curriculum-model: understand the Oak curriculum domain model and how to use
  available tools.

Call this tool first to reduce errors when using search, fetch, and browsing tools.
```

## Rationale

### Single Source of Truth

The metadata object is the canonical definition of agent support tools. The `toolGuidanceData.toolCategories.agentSupport.tools` array must match the keys of this object, verified by unit tests.

### Type Safety

Using `as const` and derived types ensures:

- Tool names are compile-time verified
- Metadata access is type-safe
- Refactoring updates all usages

### Automatic Propagation

When modifying the agent support tool or adding a new one:

1. Update metadata in `AGENT_SUPPORT_TOOL_METADATA`
2. Update `tool-guidance-data.ts` tool list
3. Run tests to verify consistency
4. All downstream artefacts update automatically

## Consequences

### Positive

- **No drift**: Single source of truth prevents inconsistencies across channels
- **Self-documenting**: Metadata describes tool purpose and invocation triggers
- **Testable**: Unit tests verify metadata-tool list consistency
- **Extensible**: Adding future tools is a single-location change

### Negative

- **Indirection**: Generated strings are less readable in source
- **Learning curve**: Developers must understand the metadata system

### Neutral

- **Migration**: Existing hardcoded strings replaced with generated versions
- **Documentation**: TSDoc and this ADR explain the system

## Implementation

### Files Changed

- `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts` — Metadata definition and generators
- `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts` — Imports and uses generated values

### Test Coverage

Unit tests verify:

- Metadata entries match `agentSupport.tools` array
- All required fields present
- `complementsTools` references valid tools only
- No tool complements itself
- Call orders are unique
- Generated instructions include all tools
- Generated hint is reasonably short

### Adding a New Tool

1. Add entry to `AGENT_SUPPORT_TOOL_METADATA`:

```typescript
'get-glossary': {
  name: 'get-glossary',
  shortDescription: 'Curriculum terminology',
  provides: ['definitions', 'synonyms', 'related terms'],
  purpose: 'understand terminology and jargon',
  callOrder: 1,
  complementsTools: ['get-curriculum-model'],
  invocationTrigger: 'When the agent encounters unfamiliar curriculum terminology',
  contextHint: 'Call get-glossary for curriculum term definitions',
  callAtStart: false,
}
```

2. Add to `tool-guidance-data.ts`:

```typescript
agentSupport: {
  tools: ['get-curriculum-model', 'get-glossary'],
}
```

3. Run tests: `pnpm test agent-support-tool-metadata`

## Related Decisions

- [ADR-058: Context Grounding for AI Agents](058-context-grounding-for-ai-agents.md)
- [ADR-059: Knowledge Graph for Agent Context](059-knowledge-graph-for-agent-context.md)
