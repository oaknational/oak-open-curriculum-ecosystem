/**
 * Production server entry point
 *
 * Exports the Express app for Vercel serverless deployment.
 * When run locally (not on Vercel), starts the server on the configured port.
 * Configure via environment variables.
 */

import { loadRootEnv } from '@oaknational/mcp-env';
import { createApp } from './src/index.js';

// Load .env from repo root if OAK_API_KEY not already set
if (!process.env.OAK_API_KEY) {
  loadRootEnv({ requiredKeys: ['OAK_API_KEY'], startDir: process.cwd(), env: process.env });
}

const app = createApp();

// For local development with 'node server.js' or 'pnpm start'
// On Vercel, skip app.listen() - Vercel wraps the exported app
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT ?? 3333);

  app.listen(port, () => {
    console.log(`🚀 Oak Curriculum MCP Server listening on port ${String(port)}`);
    console.log(`   MCP endpoint: http://localhost:${String(port)}/mcp`);
    if (process.env.DANGEROUSLY_DISABLE_AUTH === 'true') {
      console.log(`   ⚠️  AUTH DISABLED (DANGEROUSLY_DISABLE_AUTH=true)`);
    } else {
      console.log(`   🔒 OAuth enforced via Clerk`);
    }
  });
}

// Export for Vercel serverless deployment
// See: https://vercel.com/docs/frameworks/backend/express
export default app;
