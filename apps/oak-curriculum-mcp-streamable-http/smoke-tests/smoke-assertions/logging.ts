import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Logger } from '@oaknational/mcp-logger';

import type { JsonRpcEnvelope } from './common.js';
import type { SmokeContext } from './types.js';

export function createAssertionLogger(context: SmokeContext, assertion: string): Logger {
  return context.logger.child?.({ assertion, mode: context.mode }) ?? context.logger;
}

export async function recordSsePayload(
  context: SmokeContext,
  toolName: string,
  envelope: JsonRpcEnvelope,
): Promise<void> {
  if (!context.logToFile) {
    return;
  }
  const logger = createAssertionLogger(context, 'payload-writer');
  const filePath = path.join(
    context.logDirectory,
    `${context.mode}-${sanitiseToolName(toolName)}.json`,
  );
  try {
    await fs.mkdir(context.logDirectory, { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(envelope, null, 2)}\n`, 'utf8');
    logger.info('Saved SSE payload snapshot for diffing', {
      tool: toolName,
      filePath,
      mode: context.mode,
    });
  } catch (error) {
    logger.error('Failed to write SSE payload snapshot', error, {
      tool: toolName,
      filePath,
      mode: context.mode,
    });
  }
}

function sanitiseToolName(toolName: string): string {
  return toolName.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
}
