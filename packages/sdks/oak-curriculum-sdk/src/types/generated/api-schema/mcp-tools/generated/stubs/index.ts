/* GENERATED FILE - DO NOT EDIT */
 
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { stubbedToolResponses } from './tools/index.js';
import type { StubbedToolName } from './tools/index.js';

/** Type alias for structuredContent to avoid Record<string, unknown> in code */
type StructuredContent = NonNullable<CallToolResult["structuredContent"]>;

/**
 * Creates a stub tool executor that returns pre-defined responses.
 *
 * Returns both `content` (JSON text for MCP clients/model) and `structuredContent`
 * (object for OpenAI Apps SDK widgets to receive via `window.openai.toolOutput`).
 */
export function createStubToolExecutor(): (name: string) => Promise<CallToolResult> {
  return (name: string) => {
    const entry = stubbedToolResponses[name as StubbedToolName];
    if (!entry) {
      return Promise.resolve({ isError: true, content: [{ type: 'text', text: `Stub not found for ${name}` }] });
    }
    const payload = entry();
    // structuredContent is required for OpenAI Apps SDK widgets
    // Type assertion necessary: payload type varies by tool, but SDK requires StructuredContent
    const structuredContent: StructuredContent = typeof payload === "object" && payload !== null
      ? (payload as StructuredContent)
      : { data: payload };
    return Promise.resolve({ content: [{ type: 'text', text: JSON.stringify(payload) }], structuredContent });
  };
}

export { stubbedToolResponses } from './tools/index.js';
export type { StubbedToolName } from './tools/index.js';