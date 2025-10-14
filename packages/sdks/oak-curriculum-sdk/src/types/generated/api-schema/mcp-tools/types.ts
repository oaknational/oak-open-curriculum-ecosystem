/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-types-file.ts
 *
 * Tool type definitions and guards.
 */


import type { Tool } from '@modelcontextprotocol/sdk/types.js';

// Tool definition which can be expanded with additional properties as necessary
export interface ToolDescriptor extends Tool {
  readonly name: string;
  readonly description: string;
}