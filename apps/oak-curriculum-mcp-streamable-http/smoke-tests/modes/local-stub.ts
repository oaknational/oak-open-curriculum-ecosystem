import type { PrepareEnvironmentOptions, PreparedEnvironment, LoadedEnvResult } from '../types.js';
import { getServerPort, startSmokeServer } from '../local-server.js';
import { createLocalStubProcessEnv } from './local-stub-env.js';

export const STUB_API_KEY = 'stub-smoke-key';
const STUB_CLERK_PUBLISHABLE_KEY = 'stub-clerk-publishable-key';
const STUB_CLERK_SECRET_KEY = 'stub-clerk-secret-key';

export async function prepareLocalStubEnvironment(
  options: PrepareEnvironmentOptions,
  envLoad: LoadedEnvResult,
): Promise<PreparedEnvironment> {
  const localStubEnv = createLocalStubProcessEnv({
    parentEnv: process.env,
    port: options.port,
  });

  delete process.env.OAK_API_KEY;
  delete process.env.VERCEL_ENV;
  delete process.env.VERCEL_GIT_COMMIT_REF;
  delete process.env.VERCEL_GIT_COMMIT_SHA;
  delete process.env.VERCEL_BRANCH_URL;
  delete process.env.SENTRY_RELEASE_OVERRIDE;
  Object.assign(process.env, localStubEnv);
  process.env.OAK_API_KEY = STUB_API_KEY;
  process.env.CLERK_PUBLISHABLE_KEY ??= STUB_CLERK_PUBLISHABLE_KEY;
  process.env.CLERK_SECRET_KEY ??= STUB_CLERK_SECRET_KEY;
  // Disable auth – stub mode validates protocol behaviour with canned data.
  // Auth enforcement is exercised in auth-enforcement.e2e.test.ts and smoke-dev-auth.
  process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
  process.env.ELASTICSEARCH_URL ??= 'http://fake-es:9200';
  process.env.ELASTICSEARCH_API_KEY ??= 'fake-api-key-for-smoke';

  const server = await startSmokeServer(options.port);
  const port = getServerPort(server);

  return {
    baseUrl: `http://localhost:${String(port)}`,
    devToken: undefined, // No dev token - auth is disabled
    envLoad,
    server,
    devTokenSource: 'not-applicable-auth-disabled',
  };
}
