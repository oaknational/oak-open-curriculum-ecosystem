# Context Grounding & MCP Primitives Alignment

## Objective

Complete the alignment of all MCP primitives (tools, resources, prompts) with the context grounding strategy documented in ADR-058. Ensure each primitive serves its intended audience and includes appropriate guidance for users and agents to call `get-help` and `get-ontology` first.

## Foundation Documents (Read First)

Before starting, read and commit to:

- `.agent/directives/rules.md` - Cardinal rules and TDD approach
- `.agent/directives/schema-first-execution.md` - Type-gen sufficiency
- `.agent/directives/testing-strategy.md` - TDD at all levels
- `docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md` - Current context grounding strategy

## Background

### MCP Primitive Control Model

| Primitive     | Control                | Who Controls            | Model Sees Directly?                       |
| ------------- | ---------------------- | ----------------------- | ------------------------------------------ |
| **Tools**     | Model-controlled       | LLM decides to call     | ✅ Yes (`tools/list`, `structuredContent`) |
| **Resources** | Application-controlled | Client app surfaces     | ❌ No (unless app injects)                 |
| **Prompts**   | User-controlled        | User explicitly invokes | ❌ No (user sees, model receives)          |

### Current State

**Tools (Model-visible)** - ✅ Mostly complete:

- Generated tools include `requiresDomainContext` flag
- Aggregated tools use `formatOptimizedResult()` with `oakContextHint`
- Widget description mentions get-ontology
- Tool descriptions include prerequisite guidance

**Resources (Application-controlled)** - ⚠️ Needs updates:

- Widget template: `ui://widget/oak-json-viewer.html` ✅
- Documentation resources (`docs://oak/*.md`) missing:
  - `userInteractions` workflow (foundational "call get-help/get-ontology first")
  - `agentSupport` tool category
  - `returns` field in workflow steps

**Prompts (User-controlled)** - ⚠️ Needs updates:

- Current prompts (`find-lessons`, `lesson-planning`, `progression-map`) jump straight to tool usage
- Should guide users to start with context tools
- Users may not know about `get-help` and `get-ontology`

## Tasks

### 1. Update Documentation Resources

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.ts`

Update `getWorkflowsMarkdown()` to include:

- `userInteractions` workflow FIRST (foundational)
- All 5 workflows from `tool-guidance-data.workflows`
- `returns` field for each step

Update `getToolsReferenceMarkdown()` to include:

- `agentSupport` category (get-help, get-ontology)

**TDD**: Write/update tests in `documentation-resources.unit.test.ts` FIRST.

### 2. Update ADR-058

**File**: `docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md`

Add section clarifying:

- Resources are application-controlled (not model-visible in ChatGPT)
- Documentation resources exist for other MCP clients
- Prompts are user-controlled (user invokes, model receives instructions)

### 3. Update Prompts to Include Context Guidance

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`

Update prompt messages to include context tool guidance:

```typescript
// Example for find-lessons prompt
`Before searching, you may want to call get-ontology to understand the curriculum structure.

I want to find lessons about "${topic}"...`;
```

Each prompt should suggest (not require) calling context tools first.

**TDD**: Update `mcp-prompts.unit.test.ts` FIRST.

### 4. Analyze Curriculum Ontology Resource Plan

**File**: `.agent/plans/sdk-and-mcp-enhancements/02-curriculum-ontology-resource-plan.md`

This plan proposes dual exposure (tool + resource) for ontology:

- `get-ontology` tool (model-controlled) - ✅ Already implemented
- `curriculum://ontology` resource (application-controlled) - Planned

**Question to resolve**: Given that ChatGPT doesn't automatically surface resources to the model, should we:

1. Prioritize tool-based context (current approach)
2. Still implement resource for other MCP clients
3. Wait for upstream `/ontology` endpoint

DECISION: Implement the resource approach now, to complement the tool approach.

Document decision in plan update.

## Quality Gates

After each task, run:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm test
pnpm test:e2e
```

## Key Principles

1. **Model-visible channels are primary**: Tools and their responses are the reliable path to the model
2. **Resources supplement, don't replace**: Keep resources for other clients, but don't rely on them for ChatGPT
3. **Prompts guide users**: Users invoke prompts, which are then received by the model, so they need to include explicit guidance about context tools in the prompt messages (that the model will then act upon)
4. **Single source of truth**: Workflows defined once in `tool-guidance-data.ts`, consumed everywhere
5. **TDD at all levels**: Write tests FIRST for all changes

## Reference Files

- `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts` - Workflow definitions (source of truth)
- `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.ts` - Markdown resource generation
- `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts` - Prompt message generation
- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` - Resource registration
- `apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts` - Prompt registration

## Reference Documentation

- `.agent/reference-docs/openai-apps/openai-apps-sdk-reference.md` - OpenAI Apps SDK details
- `.agent/reference-docs/mcp-docs-for-agents.md` - MCP specification (search for "Resources", "Prompts", "User Interaction Model")
- `.agent/plans/sdk-and-mcp-enhancements/02-curriculum-ontology-resource-plan.md` - Plan for creating the curriculum ontology resource that is directly relevant to this work

## Success Criteria

- [ ] Documentation resources include all 5 workflows with `returns` field
- [ ] Documentation resources include `agentSupport` tool category
- [ ] ADR-058 explains resource/prompt audience (not model-visible)
- [ ] Prompts include guidance to call context tools first
- [ ] All tests pass
- [ ] Single source of truth maintained (`tool-guidance-data.ts`)
