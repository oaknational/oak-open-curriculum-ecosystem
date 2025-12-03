# ADR-060: Agent Support Tool Metadata System

## Status

Accepted

## Context

Agent support tools (`get-ontology`, `get-knowledge-graph`, `get-help`) help AI agents understand the Oak curriculum domain model before using other tools. These tools need to be discoverable through multiple channels:

1. **Server instructions** - Delivered in MCP `initialize` response
2. **Context hints** - Included in `structuredContent` of every tool response
3. **Tool descriptions** - Prerequisite guidance in tool descriptions
4. **MCP prompts** - User-initiated workflow templates
5. **Cross-references** - Tools referencing each other

Previously, each channel maintained its own hardcoded list of tools:

```typescript
// prerequisite-guidance.ts (hardcoded)
export const SERVER_INSTRUCTIONS = `...
1. get-ontology - ...
2. get-knowledge-graph - ...
3. get-help - ...`;

// tool-guidance-data.ts (separate list)
agentSupport: {
  tools: ['get-help', 'get-ontology', 'get-knowledge-graph'],
}
```

This created several problems:

- **Drift risk**: Adding a new tool required updating multiple files
- **Inconsistent relationships**: No formal encoding of how tools relate
- **Missing context**: Models didn't understand why tools complement each other
- **Manual synchronization**: Tool order, descriptions, and relationships manually maintained

## Decision

Implement a **single source of truth metadata system** for agent support tools that:

1. Defines all tool metadata in one place (`agent-support-tool-metadata.ts`)
2. Explicitly encodes tool relationships and complementary nature
3. Generates server instructions and context hints from the metadata
4. Provides type-safe access to tool information

### Metadata Structure

```typescript
export const AGENT_SUPPORT_TOOL_METADATA = {
  'get-ontology': {
    name: 'get-ontology',
    shortDescription: 'Domain model definitions',
    provides: ['key stages', 'subjects', 'entity hierarchy', 'ID formats'],
    purpose: 'understand WHAT curriculum concepts are and what they mean',
    callOrder: 1,
    complementsTools: ['get-knowledge-graph', 'get-help'],
    seeAlso: 'get-knowledge-graph for structural relationships, get-help for tool usage',
    callAtStart: true,
  },
  // ... other tools
} as const;
```

### Relationship Encoding

| Field              | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `complementsTools` | Array of tools that work well together with this one |
| `seeAlso`          | Human-readable guidance on when to use related tools |
| `purpose`          | Uses WHAT/HOW/WHICH verbs to distinguish tool roles  |
| `callOrder`        | Recommended sequence for calling tools               |
| `provides`         | Specific data/guidance each tool returns             |

### Generated Outputs

```typescript
// Generated from metadata - always includes all tools
export const SERVER_INSTRUCTIONS = generateServerInstructions();
export const OAK_CONTEXT_HINT = generateContextHint();
```

Sample generated instructions:

```markdown
Oak Curriculum MCP Server - AI Agent Guidance

For optimal results, call these agent support tools at conversation start:

1. get-ontology - Domain model definitions: key stages, subjects, entity hierarchy, ID formats
2. get-knowledge-graph - Concept TYPE relationships: domain structure graph, entity relationships
3. get-help - Tool usage guidance: tool categories, workflows, tips

These tools are read-only and idempotent. They complement each other:

- get-ontology: understand WHAT curriculum concepts are. See also: get-knowledge-graph for structure
- get-knowledge-graph: understand HOW concepts connect. See also: get-ontology for definitions
- get-help: understand WHICH tools to use. See also: get-ontology for domain understanding
```

## Rationale

### Single Source of Truth

The metadata object is the canonical definition of agent support tools. The `toolGuidanceData.toolCategories.agentSupport.tools` array should match the keys of this object, verified by unit tests.

### Explicit Relationship Encoding

By encoding relationships in structured data:

- Models can understand tool complementarity
- Cross-references are automatically consistent
- Relationship information appears in multiple channels

### Type Safety

Using `as const` and derived types ensures:

- Tool names are compile-time verified
- Metadata access is type-safe
- Refactoring updates all usages

### Automatic Propagation

When adding a new agent support tool:

1. Add metadata to `AGENT_SUPPORT_TOOL_METADATA`
2. Add tool name to `toolCategories.agentSupport.tools`
3. Run tests to verify consistency
4. All downstream artifacts update automatically

## Consequences

### Positive

- **No drift**: Single source of truth prevents inconsistencies
- **Rich relationships**: Tools explicitly reference each other
- **Self-documenting**: Metadata describes tool purposes and relationships
- **Testable**: Unit tests verify metadata-tool list consistency
- **Extensible**: Adding new tools is a single-location change

### Negative

- **Indirection**: Generated strings are less readable in source
- **Learning curve**: Developers must understand the metadata system
- **Verification delay**: Tests must run to catch missing metadata

### Neutral

- **Migration**: Existing hardcoded strings replaced with generated versions
- **Documentation**: TSDoc and this ADR explain the system

## Implementation

### Files Changed

- `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts` - New file
- `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts` - Now imports and uses generated values
- `packages/sdks/oak-curriculum-sdk/tsup.config.ts` - Added new entry

### Test Coverage

18 unit tests verify:

- Metadata entries match `agentSupport.tools` array
- All required fields present
- `complementsTools` only references valid tools
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
  callOrder: 4,
  complementsTools: ['get-ontology', 'get-help'],
  seeAlso: 'get-ontology for domain structure',
  callAtStart: true,
}
```

2. Add to `tool-guidance-data.ts`:

```typescript
agentSupport: {
  tools: ['get-help', 'get-ontology', 'get-knowledge-graph', 'get-glossary'],
}
```

3. Run tests: `pnpm test agent-support-tool-metadata`

## Related Decisions

- [ADR-058: Context Grounding for AI Agents](058-context-grounding-for-ai-agents.md)
- [ADR-059: Knowledge Graph for Agent Context](059-knowledge-graph-for-agent-context.md)
