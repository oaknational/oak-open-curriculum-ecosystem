/**
 * Generates the runtime/index.ts barrel export file.
 *
 * Exports runtime utilities for MCP tool execution.
 */

const BANNER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Runtime utilities for MCP tool execution.
 *
 * @remarks This file is part of the schema-first execution DAG. See
 * .agent/directives-and-memory/schema-first-execution.md.
 */`;

/**
 * Generates the runtime index.ts content.
 *
 * Exports the public runtime API for tool execution.
 */
export function generateRuntimeIndexFile(): string {
  return [BANNER, '', "export { callTool, listAllToolDescriptors } from './execute.js';"].join(
    '\n',
  );
}
