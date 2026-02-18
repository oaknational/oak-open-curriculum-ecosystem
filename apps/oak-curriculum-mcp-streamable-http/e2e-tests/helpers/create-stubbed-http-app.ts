import type express from 'express';
import { createApp } from '../../src/application.js';
import { loadRuntimeConfig } from '../../src/runtime-config.js';

export const STUB_ACCEPT_HEADER = 'application/json, text/event-stream';
// No longer using bearer tokens - using auth bypass instead
export const STUB_DEV_BEARER_TOKEN = ''; // Deprecated, kept for backward compatibility
const STUB_API_KEY = 'stub-api-key';

export interface StubbedHttpApp {
  readonly app: express.Express;
}

export function createStubbedHttpApp(
  envOverrides: Partial<NodeJS.ProcessEnv> = {},
): StubbedHttpApp {
  // Create isolated env - NO global mutation
  const testEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    // Configure for stub mode with auth bypass
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
    OAK_API_KEY: STUB_API_KEY,
    // Disable auth – stub-mode E2E tests focus on protocol responses.
    // Auth enforcement is proven by auth-enforcement.e2e.test.ts and smoke-dev-auth.
    DANGEROUSLY_DISABLE_AUTH: 'true',
    // Clerk keys not needed when auth disabled, but set for completeness
    CLERK_PUBLISHABLE_KEY: 'pk_test_123',
    CLERK_SECRET_KEY: 'sk_test_123',
    ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
    ELASTICSEARCH_URL: 'http://fake-es:9200',
    ELASTICSEARCH_API_KEY: 'fake-api-key-for-stub-tests',
    ...envOverrides,
  };

  // Use DI - pass isolated env
  const runtimeConfig = loadRuntimeConfig(testEnv);
  const app = createApp({ runtimeConfig });

  return { app };
}
