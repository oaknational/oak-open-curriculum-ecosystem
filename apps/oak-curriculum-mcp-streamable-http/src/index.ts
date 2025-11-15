import { loadRootEnv } from '@oaknational/mcp-env';
import { createApp } from './application.js';
import { createHttpLogger } from './logging/index.js';
import { loadRuntimeConfig } from './runtime-config.js';

// Load .env from repo root if required environment variables are missing
loadRootEnv({
  requiredKeys: ['OAK_API_KEY', 'CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY'],
  startDir: process.cwd(),
  env: process.env,
});

const app = createApp();
const bootstrapLog = createHttpLogger(loadRuntimeConfig(), { name: 'streamable-http:bootstrap' });

const port = Number(process.env.PORT ?? 3333);
bootstrapLog.debug(`Running locally, starting server on port ${String(port)}`);

app.listen(port, () => {
  console.log(`🚀 Oak Curriculum MCP Server listening on port ${String(port)}`);
  console.log(`   MCP endpoint: http://localhost:${String(port)}/mcp`);
  if (process.env.DANGEROUSLY_DISABLE_AUTH === 'true') {
    console.log(`   ⚠️  AUTH DISABLED (DANGEROUSLY_DISABLE_AUTH=true)`);
  } else {
    console.log(`   🔒 OAuth enforced via Clerk`);
  }
});
