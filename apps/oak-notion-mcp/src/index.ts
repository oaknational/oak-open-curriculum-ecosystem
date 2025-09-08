/**
 * Entry point - delegates to the application wiring layer
 *
 * This file remains minimal and only bootstraps the server.
 * All orchestration happens in the application wiring.
 */

import { config } from 'dotenv';
import { startServer } from './app';

// Load environment variables from .env file
// This must happen before any other imports that depend on process.env
// Path is relative to where pnpm exec tsx runs from (project root)
config();

// Application entry point - minimal delegation
export async function main(): Promise<void> {
  await startServer();
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
