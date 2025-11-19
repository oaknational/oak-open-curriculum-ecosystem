import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';

import {
  createStubToolExecutor as createCallToolStubExecutor,
  stubbedToolResponses,
  type StubbedToolName,
} from '../types/generated/api-schema/mcp-tools/generated/stubs/index.js';
import {
  getToolFromToolName,
  isToolName,
  type ToolName,
} from '../types/generated/api-schema/mcp-tools/index.js';
import { typeSafeKeys } from '../types/helpers/type-helpers.js';
import { McpParameterError, McpToolError, type ToolExecutionResult } from './execute-tool-call.js';

function extractFirstText(result: CallToolResult): TextContent | undefined {
  if (result.content.length === 0) {
    return undefined;
  }
  const first = result.content[0];
  if (first.type !== 'text') {
    return undefined;
  }
  return first;
}

function decodeStubPayload(result: CallToolResult, name: ToolName): unknown {
  const first = extractFirstText(result);
  if (!first) {
    throw new McpToolError('Stub result content is empty', name, { code: 'STUB_DECODE_ERROR' });
  }
  try {
    return JSON.parse(first.text);
  } catch (error) {
    throw new McpToolError('Stub result is not valid JSON', name, {
      code: 'STUB_DECODE_ERROR',
      cause: error instanceof Error ? error : undefined,
    });
  }
}

function deriveErrorMessage(result: CallToolResult): string {
  const first = extractFirstText(result);
  if (first) {
    return first.text;
  }
  return 'Stub execution failed without diagnostic text content';
}

export function createStubToolExecutionAdapter(): (
  name: ToolName,
  args: unknown,
) => Promise<ToolExecutionResult> {
  const executeStubTool = createCallToolStubExecutor();

  return async (name: ToolName, args: unknown): Promise<ToolExecutionResult> => {
    const descriptor = getToolFromToolName(name);
    const validation = descriptor.toolMcpFlatInputSchema.safeParse(args ?? {});
    if (!validation.success) {
      return {
        error: new McpParameterError(descriptor.describeToolArgs(), name, undefined, undefined, {
          code: 'PARAMETER_ERROR',
        }),
      };
    }

    const result = await executeStubTool(name);
    if (result.isError) {
      return {
        error: new McpToolError(deriveErrorMessage(result), name, {
          code: 'STUB_EXECUTION_ERROR',
        }),
      };
    }
    const rawData = decodeStubPayload(result, name);
    const outputValidation = descriptor.validateOutput(rawData);
    if (!outputValidation.ok) {
      return {
        error: new McpToolError('Execution failed: ' + outputValidation.message, name, {
          code: 'OUTPUT_VALIDATION_ERROR',
        }),
      };
    }
    return { status: outputValidation.status, data: outputValidation.data };
  };
}

export function listAvailableStubTools(): readonly StubbedToolName[] {
  return typeSafeKeys(stubbedToolResponses);
}

export function hasStubForTool(name: ToolName): boolean {
  return name in stubbedToolResponses;
}

export function assertStubAvailable(name: unknown): asserts name is ToolName {
  if (!isToolName(name) || !hasStubForTool(name)) {
    throw new TypeError(`Stub payload not available for tool: ${String(name)}`);
  }
}
