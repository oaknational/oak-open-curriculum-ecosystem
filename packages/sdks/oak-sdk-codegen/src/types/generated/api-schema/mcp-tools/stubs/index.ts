/* GENERATED FILE - DO NOT EDIT */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { stubbedToolResponses } from './tools/index.js';
import type { StubbedToolName } from './tools/index.js';

/** Type alias for structuredContent to avoid broad generic object types in code */
type StructuredContent = NonNullable<CallToolResult["structuredContent"]>;

function isStubbedToolName(name: string): name is StubbedToolName {
  return name in stubbedToolResponses;
}

function isStructuredContent(value: unknown): value is StructuredContent {
  return typeof value === "object" && value !== null;
}

/**
 * Creates a stub tool executor that returns pre-defined responses.
 *
 * Returns both `content` (JSON text for MCP clients/model) and `structuredContent`
 * (object for MCP Apps-compliant hosts to deliver to widgets as structured content).
 */
export function createStubToolExecutor(): (name: string) => Promise<CallToolResult> {
  return (name: string) => {
    if (!isStubbedToolName(name)) {
      return Promise.resolve({ isError: true, content: [{ type: 'text', text: `Stub not found for ${name}` }] });
    }
    const payload = stubbedToolResponses[name]();
    const structuredContent: StructuredContent = isStructuredContent(payload)
      ? payload
      : { data: payload };
    return Promise.resolve({ content: [{ type: 'text', text: JSON.stringify(payload) }], structuredContent });
  };
}

export { stubbedToolResponses } from './tools/index.js';
export type { StubbedToolName } from './tools/index.js';