/**
 * Startup orchestrator
 *
 * This is the main orchestration layer that wires all components together.
 * It may import from any module via public APIs only.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createStartupLogger, defaultStartupLoggerDeps } from './startup';

/**
 * Start the organism - bring everything to life
 */
export async function startOrganism(): Promise<void> {
  const log = createStartupLogger(defaultStartupLoggerDeps);

  log('[STARTUP] Awakening the server...');

  try {
    // Import and run wiring
    log('[STARTUP] Wiring components...');
    const { setupAndStartServer } = await import('./wiring');

    const transport = new StdioServerTransport();

    await setupAndStartServer({
      transport,
      log,
    });

    log('[STARTUP] Server is running');
  } catch (error) {
    log('[STARTUP ERROR] Failed to start server: ' + String(error), true);
    throw error;
  }
}

/**
 * Export wiring utilities for testing
 */
export { createStartupLogger } from './startup';
export type { ServerSetupDependencies } from './wiring';
