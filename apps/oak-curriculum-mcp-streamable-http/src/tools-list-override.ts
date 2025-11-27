/**
 * B3 Hybrid Approach: Override tools/list to return JSON Schema with examples.
 *
 * ## Why This Override Exists
 *
 * The MCP SDK's registerTool() accepts Zod schemas for input validation. When responding
 * to tools/list requests, the SDK internally converts Zod schemas to JSON Schema. However,
 * Zod doesn't support an `examples` property, so any examples are lost during conversion.
 *
 * We already generate complete JSON Schema with examples at type-gen time (stored in
 * tool.inputSchema). By overriding the tools/list handler, we return this pre-generated
 * JSON Schema directly, preserving the examples for AI agents.
 *
 * ## How It Works
 *
 * 1. registerHandlers() registers tools with Zod schemas (for tools/call validation)
 * 2. This override sets a custom tools/list handler on the internal low-level Server
 * 3. The custom handler returns tool.inputSchema (our JSON Schema with examples)
 * 4. tools/call still uses Zod validation from registerHandlers()
 *
 * ## Maintenance Notes
 *
 * - If MCP SDK adds native examples support, this override can be removed
 * - Response shape must match SDK's expected ListToolsResult
 * - SDK version changes may require updates to this handler
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/b3-tools-list-override-test-plan.md
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { listUniversalTools } from '@oaknational/oak-curriculum-sdk';

/**
 * Overrides the tools/list handler on an McpServer to return our pre-generated
 * JSON Schema with examples, bypassing the SDK's lossy Zod→JSON Schema conversion.
 *
 * @param server - The McpServer instance (after registerHandlers has been called)
 */
export function overrideToolsListHandler(server: McpServer): void {
  server.server.setRequestHandler(ListToolsRequestSchema, () => {
    const tools = listUniversalTools();
    return Promise.resolve({
      tools: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
        // Include _meta for OpenAI Apps SDK invocation status (when present)
        ...(tool._meta ? { _meta: tool._meta } : {}),
      })),
    });
  });
}
