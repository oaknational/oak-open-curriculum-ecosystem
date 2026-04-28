const BANNER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Runtime executors for schema-derived MCP tools.
 *
 * Generated from packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-execute-file.ts
 *
 * @remarks This file is part of the schema-first execution DAG described in
 * .agent/directives/schema-first-execution.md. Do not hand-edit.
 */`;

function emitCallToolOverloads(names: readonly string[]): string {
  return names
    .map((toolName) =>
      [
        'export function callTool(',
        `  name: '${toolName}',`,
        `  client: ToolClientForName<'${toolName}'>,`,
        `  rawArgs: ToolArgsForName<'${toolName}'>,`,
        '  logger?: Logger,',
        `): Promise<ToolResultForName<'${toolName}'>>;`,
      ].join('\n'),
    )
    .join('\n');
}

export function generateExecuteFile(toolNames: string[]): string {
  const names = toolNames.slice().toSorted();

  const switchCases = names
    .map((toolName) =>
      [
        `    case '${toolName}': {`,
        `      const entry = getToolEntryFromToolName('${toolName}');`,
        `      const descriptor: ToolDescriptorForName<'${toolName}'> = entry.descriptor;`,
        '      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);',
        '      if (!parsed.success) {',
        '        throw new TypeError(descriptor.describeToolArgs());',
        '      }',
        '      const flatArgs = parsed.data;',
        '      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);',
        '      const invokeResult = await descriptor.invoke(client, nestedArgs);',
        '      if (invokeResult.httpStatus >= 400) {',
        '        throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {',
        '          cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },',
        '        });',
        '      }',
        '      const validation = descriptor.validateOutput(invokeResult.payload);',
        '      if (!validation.ok) {',
        "        throw new TypeError('Output validation error: ' + validation.message, {",
        '          cause: { raw: invokeResult.payload, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },',
        '        });',
        '      }',
        `      return { status: validation.status, data: validation.data };`,
        '    }',
      ].join('\n'),
    )
    .join('\n');

  return [
    BANNER,
    "import type { Logger } from '@oaknational/logger';",
    "import { CallToolRequestSchema, type CallToolRequest } from '@modelcontextprotocol/sdk/types.js';",
    "import { getToolEntryFromToolName, getToolFromToolName, isToolName, toolNames, type ToolDescriptorForName, type ToolName } from '../definitions.js';",
    "import type { ToolArgsForName, ToolClientForName, ToolResultForName } from '../aliases/types.js';",
    "import { DOCUMENTED_ERROR_PREFIX } from '../contract/tool-descriptor.contract.js';",
    '',
    'export function listAllToolDescriptors(): readonly ToolDescriptorForName<ToolName>[] {',
    '  return toolNames.map((name) => getToolFromToolName(name));',
    '}',
    '',
    'async function invokeToolByName<TName extends ToolName>(',
    '  name: TName,',
    '  client: ToolClientForName<TName>,',
    '  rawArgs: unknown,',
    '): Promise<ToolResultForName<TName>> {',
    '  switch (name) {',
    switchCases,
    '    default:',
    "      throw new TypeError('Unknown tool: ' + String(name));",
    '  }',
    '}',
    '',
    emitCallToolOverloads(names),
    'export function callTool(',
    '  name: ToolName,',
    '  client: ToolClientForName<ToolName>,',
    '  rawArgs: unknown,',
    '  logger?: Logger,',
    '): Promise<ToolResultForName<ToolName>>;',
    '',
    'export async function callTool<TName extends ToolName>(',
    '  name: TName,',
    '  client: ToolClientForName<TName>,',
    '  rawArgs: unknown,',
    '  logger?: Logger,',
    '): Promise<ToolResultForName<TName>> {',
    "  logger?.debug('mcp-tool.generated.call', { toolName: name, hasArgs: rawArgs !== undefined });",
    '  return invokeToolByName(name, client, rawArgs);',
    '}',
    '',
    'export async function callToolWithValidation(',
    '  request: CallToolRequest,',
    '  client: ToolClientForName<ToolName>,',
    '  logger?: Logger,',
    '): Promise<ToolResultForName<ToolName>> {',
    "  logger?.debug('mcp-tool.generated.validate', { hasRequest: true });",
    '  const { params } = CallToolRequestSchema.parse(request);',
    '  const { name, arguments: rawArgs } = params;',
    '  if (!isToolName(name)) {',
    "    throw new TypeError('Unknown tool: ' + String(name));",
    '  }',
    '  return callTool(name, client, rawArgs, logger);',
    '}',
  ].join('\n');
}
