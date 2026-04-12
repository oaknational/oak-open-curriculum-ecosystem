/**
 * Shared type definitions for MCP prompts.
 *
 * Leaf module with zero intra-package dependencies — extracted to break
 * the circular dependency between `mcp-prompts.ts` and
 * `mcp-prompt-messages.ts`.
 *
 * @packageDocumentation
 */

/**
 * Message content for prompt responses.
 */
export interface PromptMessageContent {
  readonly type: 'text';
  readonly text: string;
}

/**
 * Message in a prompt response.
 */
export interface PromptMessage {
  readonly role: 'user' | 'assistant';
  readonly content: PromptMessageContent;
}
