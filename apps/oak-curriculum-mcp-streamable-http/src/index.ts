import { createApp } from './application.js';
import { createHttpLogger } from './logging/index.js';
import { loadRuntimeConfig } from './runtime-config.js';

const result = loadRuntimeConfig({
  processEnv: process.env,
  startDir: process.cwd(),
});

if (!result.ok) {
  console.error(result.error.message);
  process.exit(1);
}

const config = result.value;
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
