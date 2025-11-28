/**
 * MCP Prompts Registration
 *
 * Registers workflow prompts with the MCP server. Prompts are user-initiated
 * templates that guide common interactions with the curriculum tools.
 *
 * ## ⚠️ ZOD VERSION COMPATIBILITY WORKAROUND ⚠️
 *
 * This module uses a **simplified prompt registration approach** due to
 * Zod version incompatibility between:
 *
 * - **This app**: Zod v4
 * - **MCP SDK** (`@modelcontextprotocol/sdk`): Zod v3 internally
 *
 * The MCP SDK's `registerPrompt()` method expects `argsSchema` to be a
 * Zod v3 schema object. Mixing Zod v3 and v4 types causes TypeScript
 * errors like "Type instantiation is excessively deep and possibly infinite."
 *
 * ### Current Workaround
 *
 * We use the simpler `server.prompt(name, description, callback)` overload
 * which doesn't require an argsSchema. Prompt arguments are defined in
 * `MCP_PROMPTS` metadata for `prompts/list` responses, but aren't validated
 * at registration time.
 *
 * ### Future Fix (When Zod 3 Dependencies Are Removed)
 *
 * When the SDK migrates from `openapi-zod-client` (which requires Zod 3)
 * to a Zod 4-compatible solution, this module should be updated to:
 *
 * 1. Import `{ z } from 'zod'` (not `zod/v3`)
 * 2. Use `server.registerPrompt()` with proper `argsSchema`
 * 3. Build Zod schemas from `MCP_PROMPTS[].arguments` definitions
 *
 * @example Future implementation with Zod 4:
 * ```typescript
 * import { z } from 'zod';
 *
 * server.registerPrompt(prompt.name, {
 *   description: prompt.description,
 *   argsSchema: {
 *     topic: z.string().describe('The topic to search for'),
 *     keyStage: z.string().optional().describe('Filter by key stage'),
 *   },
 * }, (args) => { ... });
 * ```
 *
 * @see https://github.com/oaknational/oak-mcp-ecosystem - Track Zod migration
 * @see {@link MCP_PROMPTS} - Prompt definitions in SDK
 *
 * @module register-prompts
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  MCP_PROMPTS,
  getPromptMessages,
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

/**
 * Registers MCP prompts for common curriculum workflows.
 *
 * Prompts appear as slash commands or suggested actions in MCP clients.
 * Each prompt guides users through a multi-step workflow using the
 * available tools.
 *
 * ## ⚠️ ZOD 3 COMPATIBILITY LIMITATION ⚠️
 *
 * Uses the simpler `prompt()` overload to avoid Zod v3/v4 type conflicts.
 * See module-level documentation for details and future fix instructions.
 *
 * @param server - MCP server instance
 */
export function registerPrompts(server: McpServer): void {
  for (const prompt of MCP_PROMPTS) {
    // ⚠️ ZOD 3 WORKAROUND: Using 3-arg overload (name, description, callback)
    // instead of registerPrompt() with argsSchema to avoid Zod version conflicts.
    // TODO: When MCP SDK or our deps support Zod 4, use registerPrompt() with proper argsSchema.
    server.prompt(prompt.name, prompt.description, () => {
      // For now, use empty args - users provide context in conversation.
      // Future: Parse args from callback parameter when using registerPrompt().
      const messages = getPromptMessages(prompt.name, {});

      return {
        messages: messages.map((m) => ({
          role: m.role,
          content: {
            type: 'text' as const,
            text: m.content.text,
          },
        })),
      };
    });
  }
}
