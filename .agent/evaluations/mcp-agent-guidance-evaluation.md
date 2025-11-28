# Evaluation: MCP Agent Guidance Implementation

**Date**: 2025-11-28  
**Reference**: `.agent/research/mcp_agent_guidance_provision.md`

## Summary

The Oak Curriculum MCP server **fully implements** the four-layer canonical approach for agent guidance recommended in the research document. All layers are present and working correctly.

---

## Layer-by-Layer Evaluation

### Layer 1: Tool Metadata ✅ IMPLEMENTED

**Requirement**: Concise, model-targeted usage instructions in tool descriptions.

**Implementation**:

- All tools have comprehensive descriptions optimised for LLM understanding
- Descriptions specify when to use each tool and what it does
- Input schemas include parameter descriptions via Zod `.describe()`
- Example from `get-help`:

```text
Returns guidance on how to use the Oak Curriculum MCP server's tools effectively.

Use this when you need to understand:
- How to use a specific tool
- What tools are available and when to use them
...

Do NOT use for:
- Understanding the curriculum structure (use 'get-ontology')
- Fetching actual curriculum content (use 'search' or 'fetch')
```

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`

---

### Layer 2: Documentation Resources ✅ IMPLEMENTED

**Requirement**: File-like markdown docs for "start here" content (getting-started.md, tools.md, workflows.md).

**Implementation**:

- Three documentation resources registered via `resources/list`:
  1. `docs://oak/getting-started.md` - Server overview, auth, quick start
  2. `docs://oak/tools.md` - Tool reference by category
  3. `docs://oak/workflows.md` - Step-by-step workflow guides

- Content generated from structured `toolGuidanceData`
- Resources accessible via `resources/read`

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.ts`

---

### Layer 3: Help Tool ✅ IMPLEMENTED

**Requirement**: Single programmatic interface for structured help the model can call at any time.

**Implementation**:

- `get-help` tool registered with optional `tool_name` parameter
- Returns structured guidance:
  - Overview when called without arguments
  - Specific tool help when called with `tool_name`
- Includes `when_to_use`, gotchas, and examples
- Proper error handling for unknown tools

**Location**:

- Definition: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/definition.ts`
- Execution: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/execution.ts`
- Content: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/help-content.ts`

---

### Layer 4: Prompts ✅ IMPLEMENTED

**Requirement**: Reusable workflow templates that guide tool orchestration.

**Implementation**:

- Three prompts registered via `prompts/list`:
  1. `find-lessons` - Guide to finding curriculum lessons by topic
  2. `lesson-planning` - Workflow for gathering lesson planning materials
  3. `progression-map` - Guide to tracking concept progression across years

- Prompts accept arguments and generate contextualised messages
- All E2E tests passing (8/8)

**Location**:

- Metadata: `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`
- Schemas: `apps/oak-curriculum-mcp-streamable-http/src/prompt-schemas.ts`
- Registration: `apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts`

---

## Additional Features Beyond the Baseline

1. **MCP Annotations**: Tools include behaviour hints (`readOnlyHint`, `destructiveHint`, etc.)
2. **OpenAI Integration**: `_meta` fields for ChatGPT output rendering and invocation status
3. **Widget Resource**: Custom JSON viewer for tool output rendering
4. **Ontology Tool**: `get-ontology` provides curriculum structure understanding (complements `get-help`)

---

## E2E Test Coverage

| Feature                 | Tests              | Status     |
| ----------------------- | ------------------ | ---------- |
| `prompts/list`          | 4 tests            | ✅ Passing |
| `prompts/get`           | 4 tests            | ✅ Passing |
| `get-help` tool         | Multiple tests     | ✅ Passing |
| Documentation resources | Integration tested | ✅ Working |

---

## Conclusion

The Oak Curriculum MCP server is **fully compliant** with the canonical approach for agent guidance. All four recommended layers are implemented and tested:

1. ✅ Tool Metadata - model-targeted descriptions
2. ✅ Documentation Resources - file-like docs
3. ✅ Help Tool - programmatic guidance
4. ✅ Prompts - workflow templates

No gaps identified. The implementation goes beyond the baseline with additional features for ChatGPT integration and curriculum-specific tools.
