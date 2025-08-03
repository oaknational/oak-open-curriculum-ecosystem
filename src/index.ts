import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createStartupLogger, defaultStartupLoggerDeps } from './startup-logger.js';

// Create early logging function
const log = createStartupLogger(defaultStartupLoggerDeps);

// Application entry point - minimal orchestration
export async function main(): Promise<void> {
  log('[STARTUP] Starting MCP server...');

  try {
    // Load environment variables
    log('[STARTUP] Loading environment variables...');
    const dotenv = await import('dotenv');
    dotenv.config();

    // Import and run server setup
    log('[STARTUP] Setting up server...');
    const { setupAndStartServer } = await import('./server-setup.js');

    await setupAndStartServer({
      transport: new StdioServerTransport(),
      log,
    });

    log('[STARTUP] MCP server started successfully');
  } catch (error) {
    log('[STARTUP ERROR] Failed during initialization: ' + String(error), true);
    throw error;
  }
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
