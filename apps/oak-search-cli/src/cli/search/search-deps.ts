/**
 * Shared `withEsClient` deps for search commands.
 *
 * Extracted to avoid circular imports between `index.ts` and the
 * extracted command registration modules.
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import { printError } from '../shared/index.js';
import type { WithEsClientDeps } from '../shared/with-es-client.js';
import { searchLogger } from '../../lib/logger.js';

/** Shared `withEsClient` deps for search commands. */
export const searchDeps: WithEsClientDeps = {
  logger: searchLogger,
  printError,
  setExitCode: (c) => {
    process.exitCode = c;
  },
};
