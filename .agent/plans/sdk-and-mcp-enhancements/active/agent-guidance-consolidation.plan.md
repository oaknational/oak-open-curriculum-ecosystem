---
name: "Agent Guidance Consolidation"
overview: "Review and consolidate the advice delivered to AI agents via server instructions, tool descriptions, resource annotations, and prompts — currently scattered, partially stale, and not fully DRY."
parent_plan: "open-education-knowledge-surfaces.plan.md"
sibling_plans:
  - "misconception-graph-mcp-surface.plan.md"
  - "eef-evidence-mcp-surface.plan.md"
specialist_reviewer: "mcp-reviewer, code-reviewer, docs-adr-reviewer"
isProject: false
todos:
  - id: t1-audit-current-state
    content: "Audit all agent-facing guidance: server instructions, tool descriptions, resource annotations, prompts, context hints, workflows, tips"
    status: pending
  - id: t2-catalogue-staleness
    content: "Catalogue stale, missing, or contradictory guidance with file paths and line numbers"
    status: pending
  - id: t3-design-tool-catalogue
    content: "Design a single machine-readable tool catalogue that drives descriptions, categories, prerequisites, and resource-loading advice"
    status: pending
  - id: t4-consolidate-prerequisite-guidance
    content: "Consolidate prerequisite guidance into a single generated pattern — remove manual imports from individual tool files"
    status: pending
  - id: t5-update-tool-categories
    content: "Update tool categories in tool-guidance-data.ts to include new tools (misconception graph, EEF evidence, any others added since last update)"
    status: pending
  - id: t6-update-workflows
    content: "Update workflow definitions to reflect current tool surface and include evidence/misconception workflows"
    status: pending
  - id: t7-update-resource-loading-advice
    content: "Consolidate resource-loading advice: which resources should be loaded when, by whom, and why"
    status: pending
  - id: t8-update-server-instructions
    content: "Regenerate server instructions from updated metadata to reflect full current tool surface"
    status: pending
  - id: t9-add-validation-tests
    content: "Add compile-time or test-time validation that all registered tools appear in the catalogue and have prerequisite guidance"
    status: pending
  - id: t10-update-documentation-resources
    content: "Regenerate documentation resources (getting-started, tools, workflows) from updated data"
    status: pending
  - id: t11-e2e-verification
    content: "Verify in E2E tests that server instructions, tool descriptions, and resource annotations are consistent"
    status: pending
---

# Agent Guidance Consolidation

**Status**: PENDING
**Last Updated**: 2026-04-10
**Branch**: TBD (new branch from `main` after WS3 merge)

## Problem

The advice delivered to AI agents when they connect to the Oak MCP
server is:

1. **Scattered** across 10+ files in two packages (SDK + HTTP app)
2. **Partially stale** — tool categories and workflows don't reflect
   the current tool surface (new tools added without updating guidance)
3. **Not fully DRY** — prerequisite guidance is a constant imported
   into each tool definition manually, with no compile-time guarantee
   that all tools include it

### Current Guidance Architecture

The system has two layers:

**Generated layer (DRY, good):**

- `agent-support-tool-metadata.ts` — single source for tool metadata
- `generateServerInstructions()` — server instructions from metadata
- `generateContextHint()` — context hint in every tool response
- `tool-guidance-data.ts` — tool categories, workflows, tips, ID formats
- `documentation-resources.ts` — docs generated from toolGuidanceData

**Hand-written layer (fragile):**

- Each aggregated tool definition imports prerequisite constants
  manually (`AGGREGATED_PREREQUISITE_GUIDANCE`, `FETCH_PREREQUISITE_GUIDANCE`)
- Each tool description is authored separately with its own "Use this
  when" / "Do NOT use for" / prerequisite text
- Prompts manually list tool sequences
- Workflows manually list tool names

### What Goes Wrong

When a new tool is added (e.g. misconception graph, EEF evidence):

- `tool-guidance-data.ts` tool categories are not updated
- Workflow definitions don't include the new tool
- Server instructions don't mention the new capability
- The new tool may or may not include prerequisite guidance
- Documentation resources become stale

There is no compile-time or registration-time check that catches this.
The unit test in `agent-support-tool-metadata.unit.test.ts` only covers
agent support tools, not the full tool surface.

## Decision

Consolidate agent guidance into a single machine-readable tool
catalogue that drives all downstream guidance surfaces. Make staleness
a compile-time or test-time failure, not a drift risk.

## Implementation

### Phase 1: Audit and catalogue (T1-T2)

**T1: Full audit** — Read every agent-facing guidance surface and
document what it says, where it lives, and what it references.

Surfaces to audit:

| Surface | File | What it controls |
|---|---|---|
| Server instructions | `prerequisite-guidance.ts` L96 | First message to AI clients |
| Context hint | `prerequisite-guidance.ts` L80 | Appended to every tool response |
| Agent support metadata | `agent-support-tool-metadata.ts` | Tool call-order and relationships |
| Tool categories | `tool-guidance-data.ts` L31 | Category groupings for documentation |
| Workflows | `tool-guidance-workflows.ts` L24 | Step-by-step tool sequences |
| Tips | `tool-guidance-data.ts` L120 | Usage tips in documentation |
| Tool descriptions | Each `tool-definition.ts` or `aggregated-*.ts` | Per-tool guidance for AI |
| Resource descriptions | Each `*-resource.ts` | Per-resource guidance for AI |
| Prompt messages | `mcp-prompt-messages.ts` | Per-prompt tool orchestration |
| Documentation resources | `documentation-resources.ts` | Getting-started, tools, workflows |

**T2: Staleness catalogue** — For each surface, record:

- Is it current? (does it reference all existing tools?)
- Is it consistent? (does it match other surfaces?)
- Is it DRY? (is it generated or manually maintained?)
- What's missing? (new tools not mentioned, stale tool names)

### Phase 2: Design (T3)

**T3: Tool catalogue design** — Create a single `tool-catalogue.ts`
that is the authoritative source for:

- Tool name, category, and short description
- Prerequisite tools (which tools should be called first)
- Complementary tools (which tools work well together)
- "Use this when" and "Do NOT use for" guidance
- Resource-loading recommendations (which resources to read)
- Whether the tool is agent-support, discovery, browsing, fetching,
  progression, or evidence

The catalogue should be typed so that:

- Adding a new tool without a catalogue entry is a type error
- Referencing a non-existent tool in prerequisites is a type error
- Tool categories exhaustively cover all registered tools

This replaces the current pattern of each tool file independently
importing prerequisite constants.

### Phase 3: Consolidation (T4-T8)

**T4: Prerequisite guidance** — Replace manual constant imports in
individual tool definitions with catalogue-driven generation. Each
tool's description should be composed from:

- Catalogue entry (category, prerequisites, use-when, do-not-use)
- Tool-specific schema description (from Zod schema)
- Prerequisite text (generated from catalogue prerequisites)

**T5: Tool categories** — Update `tool-guidance-data.ts` categories
to be derived from the catalogue. Add new categories if needed
(e.g. `evidence` for EEF tools, `diagnostics` for misconception graph).

**T6: Workflows** — Update workflow definitions to include new tools
and new workflows:

- Evidence-grounded lesson planning (EEF recommend → select → plan)
- Misconception diagnostics (search lesson → get misconceptions →
  plan remediation)
- Pupil Premium strategy review (EEF recommend → compare → assess)

**T7: Resource-loading advice** — Consolidate into a single
resource-priority model:

| Resource | When to load | Who loads it | Why |
|---|---|---|---|
| `curriculum://model` | Conversation start | Agent or host | Domain orientation |
| `eef-toolkit://methodology` | Before citing EEF data | Agent | Methodology context |
| `curriculum://prerequisite-graph` | When exploring progressions | Agent | Relationship context |
| `curriculum://misconception-graph` | When diagnosing understanding | Agent | Error patterns |
| `eef-toolkit://strands` | When recommending approaches | Agent | Evidence overview |

This replaces the current scattered "call get-curriculum-model first"
advice in 7+ tool descriptions.

**T8: Server instructions** — Regenerate from the updated catalogue.
The instructions should mention all tool categories and the primary
resource-loading sequence, not just `get-curriculum-model`.

### Phase 4: Validation and docs (T9-T11)

**T9: Validation tests** — Add tests that verify:

- Every tool registered in the MCP server has a catalogue entry
- Every tool mentioned in a workflow exists in the catalogue
- Every prerequisite reference points to a real tool
- Tool categories exhaustively cover all catalogue entries
- Resource-loading recommendations reference real resources

These should be in-process tests (not E2E) that fail at test time
if guidance drifts.

**T10: Documentation resources** — Regenerate `getting-started`,
`tools`, and `workflows` documentation resources from the updated
catalogue and workflow definitions.

**T11: E2E verification** — Verify that:

- Server instructions mention all tool categories
- Tool descriptions include prerequisite guidance
- New workflows appear in the workflows documentation resource

## Sequencing

```text
T1 audit  ──▶  T2 staleness catalogue  ──▶  T3 catalogue design
                                                      │
              T4 prerequisite consolidation  ◀────────┘
              T5 tool categories            ◀────────┘
              T6 workflows                  ◀────────┘
              T7 resource-loading advice    ◀────────┘
              T8 server instructions        ◀────────┘
                         │
              T9 validation tests     ◀──────────────┘
              T10 documentation resources  ◀─────────┘
              T11 E2E verification   ◀───────────────┘
```

T1-T2 are research. T3 is design. T4-T8 are parallel implementation.
T9-T11 are validation. Each phase depends on the previous.

## Coordination with Sibling Plans

This plan should execute AFTER the misconception graph and EEF evidence
plans, because those plans add new tools and resources that need to be
included in the consolidated guidance. However, the audit (T1-T2) can
run at any time.

Execution order:

1. Misconception graph MCP surface (adds 1 tool, 1 resource)
2. EEF evidence MCP surface (adds 1 tool, 2 resources, 1 prompt)
3. **This plan** (consolidates guidance for the full tool surface)

## Size Estimate

~300 lines of new code (tool catalogue + generated descriptions),
~200 lines of refactored code (removing manual prerequisite imports),
~100 lines of new tests. Touches 15+ files but most changes are
mechanical (replacing manual imports with catalogue-driven generation).

## Exit Criteria

1. Single `tool-catalogue.ts` is the authoritative source for all
   tool metadata
2. No tool description manually imports prerequisite constants
3. Tool categories exhaustively cover all registered tools
4. Workflows include evidence and misconception tool sequences
5. Server instructions mention all tool categories
6. Validation tests catch missing catalogue entries at test time
7. Documentation resources regenerated and current
8. `pnpm check` passes

## Key Files

| File | Change |
|------|--------|
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-catalogue.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts` | Refactor to use catalogue |
| `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts` | Merge into catalogue |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts` | Derive from catalogue |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts` | Update workflows |
| `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.ts` | Regenerate |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts` | Remove manual import |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts` | Remove manual import |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts` | Remove manual import |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/execution.ts` | Remove manual import |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts` | Remove manual import |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prerequisite-graph.ts` | Remove manual import |
| `apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts` | Add validation |
