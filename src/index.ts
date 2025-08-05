/**
 * Entry point - delegates to the psychon (soul) layer
 *
 * This file remains minimal and only bootstraps the organism.
 * All orchestration happens in the psychon layer.
 */

import { startOrganism } from './psychon/index.js';

// Application entry point - minimal delegation
export async function main(): Promise<void> {
  await startOrganism();
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1] ?? ''}`) {
  main().catch((error: unknown) => {
    // Use console.error here as this is the absolute last resort error handler
    // This could run if there's an error in the logging system itself
    console.error('Server error:', error);
    process.exit(1);
  });
}
