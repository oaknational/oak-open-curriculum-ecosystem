# Phase 0: Integration Point Analysis

## Actual Integration Points Found

### 1. MCP_TOOL_MAP Imports
- **SDK Exports**: 
  - `/packages/oak-curriculum-sdk/src/index.ts`: Exports MCP_TOOL_MAP
  - `/packages/oak-curriculum-sdk/src/types/index.ts`: Re-exports MCP_TOOL_MAP
  
- **MCP Consumer**:
  - `/ecosystem/psycha/oak-curriculum-mcp/src/organa/mcp/generated/enriched-tools.ts`: Imports and iterates over MCP_TOOL_MAP
  - `/ecosystem/psycha/oak-curriculum-mcp/src/organa/mcp/handlers/tool-handler.ts`: Imports MCP_TOOL_MAP for logging

### 2. executeToolCall Imports
- **SDK Exports**:
  - `/packages/oak-curriculum-sdk/src/index.ts`: Exports executeToolCall
  - `/packages/oak-curriculum-sdk/src/types/index.ts`: Re-exports executeToolCall
  
- **MCP Consumer**:
  - `/ecosystem/psycha/oak-curriculum-mcp/src/organa/mcp/handlers/tool-handler.ts`: Line 66 - Delegates to executeToolCall

### 3. Supporting Functions
- **isMcpToolName**: Type guard used in both tool-handler.ts and enriched-tools.ts
- **validateToolResponse**: Used in tool-handler.ts for response validation

## Current Flow Analysis

### Data Flow
```
OpenAPI Schema
    ↓
SDK Type Generation (mcp-tool-mapping-generator.ts)
    ↓
MCP_TOOL_MAP (data) + executeToolCall (imperative switch)
    ↓
MCP Server imports and uses both
```

### The Problem
The generator currently creates BOTH:
1. **MCP_TOOL_MAP**: A data structure (good!)
2. **executeToolCall**: A massive switch statement with inline SDK calls (bad!)

The switch statement contains:
- 27 cases (one per tool)
- Manual parameter extraction (`const p = params`)
- Manual parameter mapping (`assetType` → `type`)
- Type suppression comments (`// @ts-expect-error`)

### The Solution (Data-Driven)
Instead of generating a switch, we should:
1. Add an `execute` function to each tool in MCP_TOOL_MAP
2. Use the data structure to look up and execute

## Critical Observations

### 1. Parameter Mapping Issue
The generator has special logic for `assetType` → `type` mapping (lines 41, 47, 57, 67 in generator). This should be data, not code:
```typescript
// Current (bad): Special case in code generation
const sdkParam = param === 'assetType' ? 'type' : param;

// Should be (good): Data in the tool definition
parameterMapping: { assetType: 'type' }
```

### 2. Type Suppression
The generated executeToolCall has `// @ts-expect-error` comments because:
- It casts params to `Record<string, unknown>`
- The SDK expects exact types
- TypeScript can't verify the switch guarantees correct types

### 3. Integration is Clean
The MCP server's integration is actually quite clean:
- tool-handler.ts simply delegates to executeToolCall
- enriched-tools.ts iterates over MCP_TOOL_MAP for metadata
- No custom mapping logic in the MCP server

## Phase 0 Conclusion

The integration points are minimal and clean. The problem is entirely in the SDK's generated code:
1. **MCP_TOOL_MAP**: Already a data structure ✓
2. **executeToolCall**: Should use the data structure, not a switch ✗

The fix is straightforward: Make executeToolCall a simple lookup in MCP_TOOL_MAP rather than a generated switch statement.