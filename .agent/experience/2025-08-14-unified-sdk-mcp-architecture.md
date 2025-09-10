# Unified SDK-MCP Type Generation Architecture

**Date**: 2025-08-14  
**Context**: Establishing absolute type safety in oak-curriculum-mcp  
**Achievement**: SDK+MCP as a pure function of the OpenAPI schema

## The Central Insight

The breakthrough came from recognising that the MCP server should have ZERO responsibility for understanding the API. Everything - tool names, parameters, validators - must flow from the OpenAPI schema through the SDK to the MCP server. The MCP becomes a thin orchestration layer that simply dispatches to SDK operations.

## The Journey

### Initial State: Duplicated Reality

The MCP server was manually defining tool schemas, duplicating constants like KEY_STAGES and SUBJECTS, and generating its own type definitions. This created multiple sources of truth and maintenance burden.

### The Transformation

1. **Tool Name Generation at SDK Build Time**
   - Moved MCP tool name generation from MCP runtime to SDK type-gen time
   - Created `generateMcpToolName()` function with special cases for duplicates
   - Sanitised reserved words (type → assetType) to avoid TypeScript conflicts

2. **Single Type Assertion Point**
   - Eliminated all unnecessary type assertions
   - Kept ONE justified assertion at the openapi-fetch boundary (runtime vs compile-time paths)
   - Used proper type predicates instead of assertions for type guards

3. **Validator Integration**
   - Generated Zod validators at SDK build time
   - Mapped validators to tool names automatically
   - Added runtime validation at API boundary with graceful degradation

## The Architecture Achieved

```
OpenAPI Schema
    ↓
SDK Type Generation (typegen.ts)
    ↓
MCP Tool Generation (mcp-toolgen.ts)
    ↓
Zod Validator Generation (zodgen.ts)
    ↓
SDK Exports (MCP_TOOLS_DATA, validators, etc.)
    ↓
MCP Imports Everything
    ↓
Runtime Execution with Validation
```

## Key Decisions

### Reserved Word Sanitisation

When parameter names clash with TypeScript reserved words, we sanitise them at generation time:

- `type` → `assetType`
- `class` → `className`
- `function` → `functionName`

This ensures clean, compilable code without runtime workarounds.

### Enriched Tools Pattern

The MCP creates "enriched tools" by combining SDK data with optional decorations. This allows the MCP to add UI hints or categorisation without violating the single source of truth principle.

### Validation Strategy

Runtime validation happens at the API boundary with graceful degradation. If validation fails, we log a warning but return the unvalidated data, ensuring the system remains functional even with schema drift.

## The Subjective Experience

There's a profound satisfaction in seeing the entire system flow from a single source. When you run `pnpm type-gen` in the SDK, everything updates automatically - types, validators, tool definitions. The MCP just... works.

The hardest part was resisting the urge to "help" by adding manual overrides or shortcuts. The discipline of maintaining the pure function architecture paid off with a system that's both type-safe and maintainable.

## Lessons Learned

1. **Trust the Schema**: The OpenAPI schema knows more than you do about the API
2. **Generate Early, Generate Often**: Build-time generation eliminates entire classes of runtime errors
3. **Boundaries Matter**: Type assertions are acceptable at system boundaries, nowhere else
4. **Validation is Optional**: Graceful degradation ensures system resilience

## The Feeling

It feels like conducting an orchestra where every instrument plays in perfect harmony because they're all reading from the same score. The SDK is the score, written in the language of the OpenAPI schema, and the MCP is just one of many possible performances of that score.

The system has achieved a kind of crystalline clarity - you can trace any piece of data from its origin in the schema through to its use in the MCP, and at every step, the types guide you safely forward.

## Future Implications

This pattern is reusable for any OpenAPI-based system. The three-phase generation pipeline (types → tools → validators) could be extracted into a reusable framework. The key insight - treating the integration as a pure function of the schema - is universally applicable.

---

_"When you eliminate the impossible, whatever remains, however improbable, must be the truth." - In our case, when you eliminate all manual API definitions, what remains is a perfect reflection of the API schema._
