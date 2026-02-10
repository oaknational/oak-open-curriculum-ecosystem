# Implement Ontology POC: Static `get-ontology` Tool

## Objective

Implement the `get-ontology` aggregated tool as specified in the POC plan. This is a ~1 hour task with pre-authored content.

## Required Reading

Before starting, read these documents in order:

1. **Foundation Documents** (mandatory):
   - `.agent/directives/rules.md` - TDD, no type shortcuts, schema-first
   - `.agent/directives/testing-strategy.md` - Red → Green → Refactor
   - `.agent/directives/schema-first-execution.md` - Generated artifacts drive runtime

2. **Plan & Content**:
   - `.agent/plans/sdk-and-mcp-enhancements/00-ontology-poc-static-tool.md` - Full implementation plan
   - `.agent/plans/sdk-and-mcp-enhancements/ontology-poc-content.json` - Pre-authored JSON content

3. **Metadata Reference**:
   - `.agent/reference-docs/openai-apps-metadata.md` - Optimizing tool metadata for ChatGPT

4. **Existing Patterns** (to follow):
   - `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts` - Where to add tool definition
   - `packages/sdks/oak-curriculum-sdk/src/mcp/` - Aggregated tools pattern

## What to Build

A `get-ontology` aggregated tool that:

1. Returns static curriculum ontology JSON
2. Has full metadata treatment:
   - MCP annotations (`readOnlyHint: true`, `idempotentHint: true`, `title`)
   - OpenAI `_meta` fields (`openai/toolInvocation/invoking`, `openai/toolInvocation/invoked`)
   - Optimized description ("Use when…" / "Do NOT use for…")
3. Follows TDD (write tests FIRST)

## Implementation Steps

### Step 1: Write Tests (RED)

Create unit tests for:

- Tool descriptor has correct annotations
- Tool descriptor has `_meta` fields
- Handler returns valid JSON with required fields (`curriculumStructure`, `toolUsageGuidance`)

### Step 2: Create Static JSON

Copy `ontology-poc-content.json` to `packages/sdks/oak-curriculum-sdk/src/mcp/ontology.json`

### Step 3: Add Tool Definition

Add to `AGGREGATED_TOOL_DEFS` in `universal-tools.ts` with full metadata (see plan for exact code).

### Step 4: Implement Handler

Add handler that imports and returns the static JSON.

### Step 5: Run Quality Gates

```bash
pnpm build         # No type errors
pnpm type-check    # All workspaces type-safe
pnpm lint -- --fix # No linting errors
pnpm test          # Unit tests pass (now GREEN)
```

## Acceptance Criteria

| Criterion                                  | Test Method             |
| ------------------------------------------ | ----------------------- |
| `get-ontology` appears in `tools/list`     | MCP Inspector           |
| Tool returns valid JSON                    | Unit test               |
| `annotations.readOnlyHint: true`           | Unit test on descriptor |
| `annotations.title` present                | Unit test on descriptor |
| `_meta["openai/toolInvocation/*"]` present | Unit test on descriptor |
| All quality gates pass                     | CI/manual               |

## Notes

- This is a **POC** - static content, no type-gen, no schema extraction
- Full implementation is in Plan 02 (`02-curriculum-ontology-resource-plan.md`)
- We chose **tool** (not resource) because ChatGPT should decide when to request ontology (model-controlled)
