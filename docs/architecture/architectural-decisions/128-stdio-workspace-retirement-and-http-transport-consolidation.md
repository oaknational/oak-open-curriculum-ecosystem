# ADR-128: Retire the Standalone STDIO Workspace and Consolidate MCP Server Evolution in the HTTP Workspace

## Status

Accepted (2026-03-07)

**Related**: [ADR-029 (No Manual API Data Structures)](029-no-manual-api-data.md), [ADR-030 (SDK Single Source of Truth)](030-sdk-single-source-truth.md), [ADR-031 (Generation-Time Extraction)](031-generation-time-extraction.md), [ADR-050 (MCP Tool Layering DAG)](050-mcp-tool-layering-dag.md), [ADR-112 (Per-Request MCP Transport)](112-per-request-mcp-transport.md), [ADR-123 (MCP Server Primitives Strategy)](123-mcp-server-primitives-strategy.md)

## Context

This repository currently contains two Oak curriculum MCP app workspaces:

1. `apps/oak-curriculum-mcp-streamable-http`
2. `apps/oak-curriculum-mcp-stdio`

The HTTP workspace is now the canonical product surface:

1. it owns the current MCP-standard server surface
2. it owns auth, resources, prompts, and the active deployment path
3. it is where the repo's current MCP evolution is happening

The standalone stdio workspace still exists, but continued investment in it now
creates the wrong maintenance shape:

1. documentation has to explain two server workspaces as if both are active
2. transport-specific differences obscure which workspace is the real product
   surface
3. feature work risks being duplicated or drifting across two apps
4. future MCP improvements would have to be implemented twice or left
   inconsistent

At the same time, stdio transport is still useful for some local MCP clients.
The problem is not stdio as a transport. The problem is treating a separate
standalone stdio workspace as a peer to the canonical HTTP server workspace.

## Decision

### 1. Halt active development on `apps/oak-curriculum-mcp-stdio`

The standalone stdio workspace is now a legacy workspace.

From this point forward:

1. no new feature work should be planned against it
2. no product-surface evolution should be driven through it
3. it should not be described as the long-term maintained Oak MCP server

### 2. Treat `apps/oak-curriculum-mcp-streamable-http` as the canonical Oak MCP server workspace

All ongoing MCP server evolution should happen in the HTTP workspace and the SDK
layers it depends on.

That includes:

1. MCP metadata and transport-surface improvements
2. auth and deployment behaviour
3. resources, prompts, and MCP Apps integration
4. future transport generalisation work

### 3. Future stdio support will be delivered by generalising the HTTP workspace, not by maintaining a separate stdio app

When stdio transport support is revisited, the intended end state is:

1. the HTTP workspace provides a separate stdio entry point
2. that entry point reuses the same canonical MCP server composition
3. transport differences are handled as entry-point concerns, not as a reason
   for parallel app evolution

This is a consolidation decision, not a commitment to immediate implementation.

### 4. Documentation must describe the stdio workspace as legacy and transitional

Repo documentation should be explicit that:

1. the standalone stdio workspace is not being actively maintained
2. existing local setups may still reference it temporarily
3. the long-term direction is a generalised stdio entry point in the HTTP
   workspace

## Rationale

### Why halt the standalone stdio workspace now

The first question applies: could this be simpler without compromising quality?

Yes.

Maintaining two app workspaces for one logical Oak MCP server is more complex
than maintaining one canonical server workspace with multiple transport-specific
entry points.

### Why not delete the stdio workspace immediately

Immediate removal would be premature because:

1. existing local MCP client configurations still point at it
2. the generalised stdio entry point does not exist yet
3. documentation needs a stable transitional state rather than a sudden gap

The correct move now is to stop investing in the standalone workspace while
documenting the transition clearly.

### Why not keep both workspaces in parallel long-term

Parallel maintenance would be a compatibility-layer mindset at the workspace
level. It would:

1. duplicate effort
2. encourage drift in transport behaviour and documentation
3. obscure the canonical server surface

The repository should have one canonical Oak MCP server workspace and as many
entry points as needed, not multiple peer workspaces competing to define the
same product surface.

## Consequences

### Positive

1. architectural ownership becomes clearer
2. future MCP server work has one obvious home
3. documentation can guide contributors towards the maintained server surface
4. later stdio support can be implemented as transport generalisation rather
   than feature duplication

### Negative

1. the legacy stdio workspace remains in the repo for a period of time, which
   still carries some cognitive overhead
2. existing local configurations continue to point at a workspace that is no
   longer under active development

### Neutral

1. this ADR does not by itself remove the stdio workspace
2. this ADR does not commit to a specific delivery date for the future stdio
   entry point

## Implementation Notes

Near-term documentation changes should:

1. mark `apps/oak-curriculum-mcp-stdio` as legacy and not maintained
2. mark `apps/oak-curriculum-mcp-streamable-http` as the canonical workspace
3. explain that future stdio support should come from an additional entry point
   in the HTTP workspace

Future implementation work should:

1. identify the reusable server-composition seam in the HTTP workspace
2. introduce a stdio-oriented entry point there
3. remove the standalone stdio workspace once the replacement path exists
