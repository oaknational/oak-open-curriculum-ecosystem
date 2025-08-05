/**
 * Psychon - The soul that brings the organism to life
 *
 * This is the main orchestration layer that wires all components together.
 * The psychon can import from any organ or chora, but only via public APIs.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createStartupLogger, defaultStartupLoggerDeps } from './startup.js';

/**
 * Start the organism - bring everything to life
 */
export async function startOrganism(): Promise<void> {
  const log = createStartupLogger(defaultStartupLoggerDeps);

  log('[PSYCHON] Awakening the organism...');

  try {
    // Load environment variables
    log('[PSYCHON] Loading environment...');
    const dotenv = await import('dotenv');
    dotenv.config();

    // Import and run wiring
    log('[PSYCHON] Wiring components...');
    const { setupAndStartServer } = await import('./wiring.js');

    const transport = new StdioServerTransport();

    await setupAndStartServer({
      transport,
      log,
    });

    log('[PSYCHON] Organism is fully alive and conscious');
  } catch (error) {
    log('[PSYCHON ERROR] Failed to bring organism to life: ' + String(error), true);
    throw error;
  }
}

/**
 * Export wiring utilities for testing
 */
export { createStartupLogger } from './startup.js';
export type { ServerSetupDependencies } from './wiring.js';
