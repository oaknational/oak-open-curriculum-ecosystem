---
name: "Aggregated Tool Result-Type Remediation"
overview: >
  Bring aggregated tools into the standard ToolExecutionResult
  pipeline and reclassify the tool taxonomy to reflect what
  tools actually are, leaving the system open to new tool
  classes.
todos:
  - id: taxonomy
    content: "Reclassify tool taxonomy (generated vs composed, open to extension)"
    status: pending
  - id: analyse-gap
    content: "Analyse CallToolResult vs ToolExecutionResult gap"
    status: pending
  - id: implement
    content: "Migrate composed tools to ToolExecutionResult"
    status: pending
  - id: verify
    content: "Verify E2E parity and type safety preserved"
    status: pending
isProject: false
---

# Aggregated Tool Result-Type Remediation

## Context

"Aggregated tools" is a legacy name from when the distinction
was simple. The actual taxonomy is now:

- **API-derived tools**: generated directly from the Oak Open
  Curriculum API OpenAPI spec via `sdk-codegen`. These use
  `ToolExecutionResult` and get standard error handling,
  logging, and type safety.
- **Composed tools**: more complex tools we create ourselves
  (search, browse, fetch flows, orientation, graph tools,
  download-asset, user-search). These currently return
  `Promise<CallToolResult>` directly, bypassing the standard
  pipeline.

The system must be **open to new tool classes** — tools
derived from other API specs, other third-party services,
other workspaces, git submodules pointing at other repos, or
categories not yet imagined. The architecture should not
assume exactly two classes; it should provide a common
contract that any tool class can plug into.

## Phase 1: Reclassify Tool Taxonomy

Rename the two current classes to reflect what they are:

- `AggregatedToolName` → a name that reflects "composed"
  or "custom" tools (exact naming TBD during implementation)
- `AGGREGATED_TOOL_DEFS` → equivalent rename
- Update all references (types, code, tests, docs, README)

Design the type system so new tool classes can be added
without modifying the core registration infrastructure — the
common contract is what matters, not an exhaustive enum of
tool origins.

## Phase 2: Result-Type Unification

Composed tools use `ToolExecutionResult` (or an equivalent
typed wrapper) so all tools share the same error handling,
logging, and type safety contract regardless of origin.

## Acceptance

- Tool taxonomy reflects actual categories, not legacy names
- All tool classes return through the standard result pipeline
- Error handling and logging parity across tool classes
- Existing E2E tests continue to pass
- Type system is open to new tool classes without core changes
- The debt note in the
  [MCP app README](../../apps/oak-curriculum-mcp-streamable-http/README.md)
  §Architecture Notes is resolved
