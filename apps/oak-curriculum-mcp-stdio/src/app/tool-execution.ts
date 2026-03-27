import {
  executeToolCall,
  type toolNames,
  type getToolFromToolName,
  type createOakPathBasedClient,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { type Duration, type ErrorContext, type Logger } from '@oaknational/logger/node';
import type { UniversalToolExecutors } from '../tools/index.js';
import { validateOutput } from './validation.js';

const SLOW_OPERATION_THRESHOLD_MS = 5000;

export type ToolExecutionStatus = 'with error' | 'success' | 'with validation error';

export function executeConfiguredTool<TName extends (typeof toolNames)[number]>(
  name: TName,
  params: unknown,
  client: ReturnType<typeof createOakPathBasedClient>,
  toolExecutors?: UniversalToolExecutors,
): Promise<Awaited<ReturnType<typeof executeToolCall>>> {
  return toolExecutors?.executeMcpTool
    ? toolExecutors.executeMcpTool(name, params ?? {})
    : executeToolCall(name, params, client);
}

export function createToolErrorContext(
  toolName: string,
  correlationId: string,
  duration: Duration,
): ErrorContext {
  return {
    correlationId,
    duration,
    toolName,
  };
}

export function getToolExecutionStatus(
  execResult: Awaited<ReturnType<typeof executeToolCall>>,
  descriptor: ReturnType<typeof getToolFromToolName>,
): ToolExecutionStatus {
  if (!execResult.ok) {
    return 'with error';
  }

  return validateOutput(descriptor, execResult.value).ok ? 'success' : 'with validation error';
}

export function logToolCompletion(
  logger: Logger,
  toolName: string,
  correlationId: string,
  duration: Duration,
  status: ToolExecutionStatus,
): void {
  const isSlowOperation = duration.ms > SLOW_OPERATION_THRESHOLD_MS;
  const logMethod = isSlowOperation ? 'warn' : 'debug';
  const logData = {
    toolName,
    correlationId,
    duration: duration.formatted,
    durationMs: duration.ms,
    ...(isSlowOperation ? { slowOperation: true } : {}),
  };

  logger[logMethod](`Tool execution completed ${status}`, logData);
}
