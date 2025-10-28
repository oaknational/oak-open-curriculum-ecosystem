/* GENERATED FILE - DO NOT EDIT */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { stubbedToolResponses } from './tools/index.js';
import type { StubbedToolName } from './tools/index.js';

export function createStubToolExecutor(): (name: string) => Promise<CallToolResult> {
  return (name: string) => {
    const entry = stubbedToolResponses[name as StubbedToolName];
    if (!entry) {
      return Promise.resolve({ isError: true, content: [{ type: 'text', text: `Stub not found for ${name}` }] });
    }
    const payload = entry();
    return Promise.resolve({ content: [{ type: 'text', text: JSON.stringify(payload) }] });
  };
}

export { stubbedToolResponses } from './tools/index.js';
export type { StubbedToolName } from './tools/index.js';