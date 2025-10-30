/**
 * Development server runner
 *
 * Starts the MCP server locally with environment configuration.
 * Configure via .env file or environment variables.
 *
 * Usage:
 *   pnpm dev                    # With auth bypass (default)
 *   NODE_ENV=test pnpm dev      # With auth enforcement (OAuth required)
 */

import { createApp } from './src/index.js';

const app = createApp();
const port = Number(process.env.PORT ?? 3333);

const server = app.listen(port, () => {
  // Determine if auth bypass is active
  const shouldBypassAuth =
    process.env.REMOTE_MCP_ALLOW_NO_AUTH === 'true' &&
    process.env.NODE_ENV === 'development' &&
    !process.env.VERCEL;

  console.log('🚀 Oak Curriculum MCP Server running');
  console.log(`   URL: http://localhost:${String(port)}`);
  console.log(`   MCP endpoint: http://localhost:${String(port)}/mcp`);
  console.log(
    `   Auth mode: ${shouldBypassAuth ? '⚠️  BYPASS (dev mode)' : '🔒 ENFORCED (OAuth required)'}`,
  );
  console.log(`   NODE_ENV: ${process.env.NODE_ENV ?? 'unset'}`);
  console.log('');
  console.log('Press Ctrl+C to stop');
});

server.on('error', (err: Error) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});
