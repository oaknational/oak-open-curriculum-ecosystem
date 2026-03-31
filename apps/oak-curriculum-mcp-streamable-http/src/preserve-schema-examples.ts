/**
 * Preserve schema examples in MCP tools/list responses.
 *
 * ## Why This Exists
 *
 * Oak's sdk-codegen generates complete JSON Schema **with examples** from the
 * OpenAPI specification at build time (stored in each tool descriptor's
 * `inputSchema`). These examples help AI models understand how to call tools.
 *
 * The MCP SDK's `registerTool()` accepts Zod schemas for input validation.
 * When responding to `tools/list`, the SDK converts Zod → JSON Schema
 * internally. However, Zod has no `examples` property, so the SDK's
 * conversion silently drops all examples.
 *
 * This module replaces the `tools/list` handler to return the pre-generated
 * JSON Schema directly, preserving the examples through the full pipeline:
 *
 *   OpenAPI spec → sdk-codegen → JSON Schema with examples → tools/list
 *
 * ## How It Works
 *
 * 1. `registerHandlers()` registers tools with Zod schemas (for `tools/call` validation)
 * 2. This function sets a custom `tools/list` handler on the internal low-level Server
 * 3. The custom handler returns `tool.inputSchema` (pre-generated JSON Schema with examples)
 * 4. `tools/call` still uses Zod validation from `registerHandlers()`
 *
 * ## Root Cause
 *
 * The conversion pipeline is: **OpenAPI → Zod → JSON Schema**. The `examples`
 * field exists in both OpenAPI and JSON Schema. In Zod 3, Zod had no
 * representation for `examples`, so the OpenAPI → Zod step discarded them
 * and the Zod → JSON Schema step could not recover them.
 *
 * **Zod 4 changes this**: `.meta({ examples: [...] })` attaches arbitrary
 * metadata that `z.toJSONSchema()` preserves in the output. If sdk-codegen
 * attached examples via `.meta()` during generation, and the MCP SDK used
 * `z.toJSONSchema()` internally for `tools/list`, examples would flow through
 * natively. The two unknowns are: (a) whether the MCP SDK's internal Zod →
 * JSON Schema converter honours `.meta()`, and (b) whether our Zod version
 * supports `.meta()` (Zod 4+).
 *
 * ## Removal Condition
 *
 * Any of:
 * 1. The MCP SDK honours Zod `.meta()` in its `tools/list` conversion AND
 *    sdk-codegen attaches examples via `.meta()` on generated Zod schemas
 * 2. The MCP SDK adds native support for examples in `registerTool()`
 * 3. Tool schema declarations use a direct OpenAPI → JSON Schema path
 *    (bypassing Zod for the declaration) for the `tools/list` response
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/b3-tools-list-override-test-plan.md
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import {
  listUniversalTools,
  generatedToolRegistry,
  toProtocolEntry,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

/**
 * Replaces the default `tools/list` handler to return pre-generated JSON
 * Schema with examples, bypassing the SDK's lossy Zod → JSON Schema conversion.
 *
 * Call this after `registerHandlers()` so the override takes precedence.
 *
 * @param server - The McpServer instance (after registerHandlers has been called)
 */
export function preserveSchemaExamplesInToolsList(server: McpServer): void {
  server.server.setRequestHandler(ListToolsRequestSchema, () => {
    const tools = listUniversalTools(generatedToolRegistry);
    return Promise.resolve({
      tools: tools.map(toProtocolEntry),
    });
  });
}
