import { createAdaptiveLogger, type Logger } from '@oaknational/mcp-logger';

/**
 * Shared semantic search logger instance.
 * Centralising creation avoids multiple Consola bindings in Next.js.
 */
const baseLogger = createAdaptiveLogger({ name: 'SemanticSearch' });

function child(name: string): Logger {
  if (typeof baseLogger.child === 'function') {
    return baseLogger.child({ module: name });
  }
  return baseLogger;
}

/** Primary logger for hybrid search orchestration and telemetry. */
export const searchLogger: Logger = child('HybridSearch');

/** Dedicated logger for suggestion/type-ahead flows. */
export const suggestLogger: Logger = child('Suggestions');

/** Logger for sandbox ingestion drills and harness operations. */
export const sandboxLogger: Logger = child('SandboxHarness');
