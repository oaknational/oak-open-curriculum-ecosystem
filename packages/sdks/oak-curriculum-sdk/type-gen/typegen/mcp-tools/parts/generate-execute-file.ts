const BANNER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Runtime executors for schema-derived MCP tools.
 *
 * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-execute-file.ts
 *
 * @remarks This file is part of the schema-first execution DAG described in
 * .agent/directives-and-memory/schema-first-execution.md. Do not hand-edit.
 */`;

export function generateExecuteFile(): string {
  return [
    BANNER,
    "import { CallToolRequestSchema, type CallToolRequest } from '@modelcontextprotocol/sdk/types.js';",
    "import { getToolFromToolName, isToolName, toolNames, type ToolDescriptorForName, type ToolName } from '../data/definitions.js';",
    "import type { ToolArgsForName, ToolClientForName, ToolResultForName } from '../aliases/types.js';",
    '',
    'export function listAllToolDescriptors(): readonly ToolDescriptorForName<ToolName>[] {',
    '  return toolNames.map((name) => getToolFromToolName(name));',
    '}',
    '',
    'export function parseToolArguments<TName extends ToolName>(name: TName, rawArgs: unknown): { readonly descriptor: ToolDescriptorForName<TName>; readonly args: ToolArgsForName<TName>; readonly run: (client: ToolClientForName<TName>) => Promise<ToolResultForName<TName>> } {',
    '  const descriptor = getToolFromToolName(name);',
    '  const parsed = descriptor.toolZodSchema.safeParse(rawArgs);',
    '  if (!parsed.success) {',
    '    throw new TypeError(descriptor.describeToolArgs());',
    '  }',
    '  const args = parsed.data;',
    '  const run = async (client: ToolClientForName<TName>): Promise<ToolResultForName<TName>> => {',
    '    // Safe: args already validated against descriptor.toolZodSchema.',
    '    const output = await descriptor.invoke(client, args as Parameters<typeof descriptor.invoke>[1]);',
    '    const validation = descriptor.validateOutput(output);',
    '    if (!validation.ok) {',
    "      throw new TypeError('Output validation error: ' + validation.message);",
    '    }',
    '    return validation.data;',
    '  };',
    '  return { descriptor, args, run };',
    '}',
    '',
    'export async function callTool<TName extends ToolName>(',
    '  name: TName,',
    '  client: ToolClientForName<TName>,',
    '  rawArgs: unknown,',
    '): Promise<ToolResultForName<TName>> {',
    '  const invocation = parseToolArguments(name, rawArgs);',
    '  return invocation.run(client);',
    '}',
    '',
    'export async function callToolWithValidation(',
    '  request: CallToolRequest,',
    '  client: ToolClientForName<ToolName>,',
    '): Promise<ToolResultForName<ToolName>> {',
    '  const { params } = CallToolRequestSchema.parse(request);',
    '  const { name, arguments: rawArgs } = params;',
    '  if (!isToolName(name)) {',
    "    throw new TypeError('Unknown tool: ' + String(name));",
    '  }',
    '  const invocation = parseToolArguments(name, rawArgs);',
    '  return invocation.run(client);',
    '}',
  ].join('\n');
}
