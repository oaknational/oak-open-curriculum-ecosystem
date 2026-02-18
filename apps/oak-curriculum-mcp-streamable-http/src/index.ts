import { loadRootEnv } from '@oaknational/mcp-env';
import { createApp } from './application.js';
import { createHttpLogger } from './logging/index.js';
import { loadRuntimeConfig } from './runtime-config.js';

const alwaysRequired = ['OAK_API_KEY', 'ELASTICSEARCH_URL', 'ELASTICSEARCH_API_KEY'] as const;
const clerkKeys = ['CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY'] as const;

// eslint-disable-next-line no-restricted-syntax -- TEMPORARY: direct process.env access will be removed by env-architecture-overhaul plan
const authDisabled = process.env.DANGEROUSLY_DISABLE_AUTH === 'true';
const requiredEnvKeys = authDisabled ? [...alwaysRequired] : [...alwaysRequired, ...clerkKeys];

const envResult = loadRootEnv({
  requiredKeys: requiredEnvKeys,
  startDir: process.cwd(),
  // eslint-disable-next-line no-restricted-syntax -- Entry point: pass environment to env library for loading and validation.
  env: process.env,
});

const statusLines = envResult.keyStatus
  .map((e) => `  ${e.key}: ${e.present ? 'present' : 'MISSING'}`)
  .join('\n');
const authLine = authDisabled
  ? '  DANGEROUSLY_DISABLE_AUTH: true (Clerk keys not required)'
  : '  DANGEROUSLY_DISABLE_AUTH: false (Clerk keys required)';

console.error(`[startup] Required environment variables:\n${statusLines}\n${authLine}`);

if (envResult.missingKeys.length > 0) {
  console.error(
    `[startup] FATAL: Cannot start — missing: ${envResult.missingKeys.join(', ')}\n` +
      `  Set these in the root .env file or export them in your shell.\n` +
      `  See .env.example for reference.`,
  );
  process.exit(1);
}

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
