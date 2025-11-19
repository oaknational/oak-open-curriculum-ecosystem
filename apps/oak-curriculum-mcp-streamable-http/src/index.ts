import { loadRootEnv } from '@oaknational/mcp-env';
import { createApp } from './application.js';
import { createHttpLogger } from './logging/index.js';
import { loadRuntimeConfig } from './runtime-config.js';

// Load .env from repo root if required environment variables are missing
/* eslint-disable no-restricted-syntax -- App entry point loads .env file, legitimate use */
loadRootEnv({
  requiredKeys: ['OAK_API_KEY', 'CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY'],
  startDir: process.cwd(),
  env: process.env,
});
/* eslint-enable no-restricted-syntax */

const config = loadRuntimeConfig();
const app = createApp({ runtimeConfig: config });
const bootstrapLog = createHttpLogger(config, { name: 'streamable-http:bootstrap' });

const port = config.env.PORT ? Number(config.env.PORT) : 3333;
bootstrapLog.debug(`Running locally, starting server on port ${String(port)}`);

app.listen(port, () => {
  console.log(`🚀 Oak Curriculum MCP Server listening on port ${String(port)}`);
  console.log(`   MCP endpoint: http://localhost:${String(port)}/mcp`);
  if (config.dangerouslyDisableAuth) {
    console.log(`   ⚠️  AUTH DISABLED (DANGEROUSLY_DISABLE_AUTH=true)`);
  } else {
    console.log(`   🔒 OAuth enforced via Clerk`);
  }
});
