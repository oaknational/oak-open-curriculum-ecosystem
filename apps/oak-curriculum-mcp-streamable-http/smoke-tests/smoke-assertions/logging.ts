import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Logger, JsonObject } from '@oaknational/mcp-logger';

import type { JsonRpcEnvelope } from './common.js';
import type { SmokeContext } from './types.js';

export function createAssertionLogger(context: SmokeContext, assertion: string): Logger {
  return context.logger.child?.({ assertion, mode: context.mode }) ?? context.logger;
}

export function logAssertionSuccess(logger: Logger, message: string, details?: JsonObject): void {
  logger.info(message, details);
  const detailText =
    details && Object.keys(details).length > 0 ? ` ${JSON.stringify(details)}` : '';
  console.log(`✅ ${message}${detailText}`);
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
    if (context.captureAnalysis) {
      await writeAnalysisSnapshot(context, toolName, envelope);
    }
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

async function writeAnalysisSnapshot(
  context: SmokeContext,
  toolName: string,
  envelope: JsonRpcEnvelope,
): Promise<void> {
  const analysisDirectory = path.join(context.logDirectory, 'analysis');
  const analysisFile = path.join(
    analysisDirectory,
    `${sanitiseToolName(toolName)}-${context.mode}.sse.json`,
  );
  await fs.mkdir(analysisDirectory, { recursive: true });
  await fs.writeFile(analysisFile, `${JSON.stringify(envelope, null, 2)}\n`, 'utf8');
  const logger = createAssertionLogger(context, 'analysis-writer');
  logger.info('Captured analysis snapshot', {
    tool: toolName,
    mode: context.mode,
    filePath: analysisFile,
  });
}
